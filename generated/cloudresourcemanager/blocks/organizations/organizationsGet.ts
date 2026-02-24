import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const organizationsGet: AppBlock = {
  name: "Organizations - Get",
  description: `Fetches an organization resource identified by the specified resource name.`,
  category: "Organizations",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            'Required. The resource name of the Organization to fetch. This is the organization\'s relative path in the API, formatted as "organizations/[organizationId]". For example, "organizations/1234".',
          type: {
            type: "string",
          },
          required: true,
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
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/cloud-platform.read-only",
            ],
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
        const baseUrl = "https://cloudresourcemanager.googleapis.com/";
        let path = `v3/{+name}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

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
        properties: {
          displayName: {
            type: "string",
            description:
              'Output only. A human-readable string that refers to the organization in the Google Cloud Console. This string is set by the server and cannot be changed. The string will be set to the primary domain (for example, "google.com") of the Google Workspace customer that owns the organization.',
          },
          createTime: {
            type: "string",
            description:
              "Output only. Timestamp when the Organization was created. (Format: google-datetime)",
          },
          deleteTime: {
            type: "string",
            description:
              "Output only. Timestamp when the Organization was requested for deletion. (Format: google-datetime)",
          },
          name: {
            type: "string",
            description:
              'Output only. The resource name of the organization. This is the organization\'s relative path in the API. Its format is "organizations/[organization_id]". For example, "organizations/1234".',
          },
          updateTime: {
            type: "string",
            description:
              "Output only. Timestamp when the Organization was last modified. (Format: google-datetime)",
          },
          directoryCustomerId: {
            type: "string",
            description:
              "Immutable. The G Suite / Workspace customer id used in the Directory API.",
          },
          etag: {
            type: "string",
            description:
              "Output only. A checksum computed by the server based on the current value of the Organization resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
            description:
              "Output only. The organization's current lifecycle state.",
          },
        },
        description:
          "The root node in the resource hierarchy to which a particular entity's (a company, for example) resources belong.",
        additionalProperties: true,
      },
    },
  },
};

export default organizationsGet;
