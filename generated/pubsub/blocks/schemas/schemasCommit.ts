import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const schemasCommit: AppBlock = {
  name: "Schemas - Commit",
  description: `Commits a new schema revision to an existing schema.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the schema we are revising. Format is `projects/{project}/schemas/{schema}`.",
          type: {
            type: "string",
          },
          required: true,
        },
        schema: {
          name: "Schema",
          description: "Required.",
          type: {
            type: "object",
            properties: {
              definition: {
                type: "string",
                description:
                  "The definition of the schema. This should contain a string representing the full definition of the schema that is a valid schema definition of the type specified in `type`.",
              },
              revisionCreateTime: {
                type: "string",
                description:
                  "Output only. The timestamp that the revision was created. (Format: google-datetime)",
              },
              name: {
                type: "string",
                description:
                  "Required. Name of the schema. Format is `projects/{project}/schemas/{schema}`.",
              },
              revisionId: {
                type: "string",
                description:
                  "Output only. Immutable. The revision ID of the schema.",
              },
              type: {
                type: "string",
                enum: ["TYPE_UNSPECIFIED", "PROTOCOL_BUFFER", "AVRO"],
                description: "The type of the schema definition.",
              },
            },
            description: "A schema resource.",
            additionalProperties: true,
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
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/pubsub",
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
        const baseUrl = "https://pubsub.googleapis.com/";
        let path = `v1/{+name}:commit`;

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

        if (input.event.inputConfig.schema !== undefined)
          requestBody.schema = input.event.inputConfig.schema;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
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
          definition: {
            type: "string",
            description:
              "The definition of the schema. This should contain a string representing the full definition of the schema that is a valid schema definition of the type specified in `type`.",
          },
          revisionCreateTime: {
            type: "string",
            description:
              "Output only. The timestamp that the revision was created. (Format: google-datetime)",
          },
          name: {
            type: "string",
            description:
              "Required. Name of the schema. Format is `projects/{project}/schemas/{schema}`.",
          },
          revisionId: {
            type: "string",
            description:
              "Output only. Immutable. The revision ID of the schema.",
          },
          type: {
            type: "string",
            enum: ["TYPE_UNSPECIFIED", "PROTOCOL_BUFFER", "AVRO"],
            description: "The type of the schema definition.",
          },
        },
        description: "A schema resource.",
        additionalProperties: true,
      },
    },
  },
};

export default schemasCommit;
