import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const connectionsProcessWebhook: AppBlock = {
  name: "Connections - Process Webhook",
  description: `ProcessWebhook is called by the external SCM for notifying of events.`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Project and location where the webhook will be received. Format: `projects/*/locations/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        webhookKey: {
          name: "Webhook Key",
          description:
            "Arbitrary additional key to find the matching repository for a webhook event if needed.",
          type: {
            type: "string",
          },
          required: false,
        },
        contentType: {
          name: "Content Type",
          description:
            "The HTTP Content-Type header value specifying the content type of the body.",
          type: {
            type: "string",
            description:
              "The HTTP Content-Type header value specifying the content type of the body.",
          },
          required: false,
        },
        data: {
          name: "Data",
          description: "The HTTP request/response body as raw binary.",
          type: {
            type: "string",
            description:
              "The HTTP request/response body as raw binary. (Format: byte)",
          },
          required: false,
        },
        extensions: {
          name: "Extensions",
          description: "Application specific response metadata.",
          type: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
            description:
              "Application specific response metadata. Must be set in the first response for streaming APIs.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://cloudbuild.googleapis.com/";
        let path = `v2/{+parent}/connections:processWebhook`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.contentType !== undefined)
          requestBody.contentType = input.event.inputConfig.contentType;
        if (input.event.inputConfig.data !== undefined)
          requestBody.data = input.event.inputConfig.data;
        if (input.event.inputConfig.extensions !== undefined)
          requestBody.extensions = input.event.inputConfig.extensions;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();
        await events.emit(result || {});
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        description:
          "A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); }",
        additionalProperties: true,
      },
    },
  },
};

export default connectionsProcessWebhook;
