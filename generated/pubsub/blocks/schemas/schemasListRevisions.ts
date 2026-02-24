import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const schemasListRevisions: AppBlock = {
  name: "Schemas - List Revisions",
  description: `Lists all schema revisions for the named schema.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the schema to list revisions for.",
          type: {
            type: "string",
          },
          required: true,
        },
        view: {
          name: "View",
          description:
            "The set of Schema fields to return in the response. If not set, returns Schemas with `name` and `type`, but not `definition`. Set to `FULL` to retrieve all fields.",
          type: {
            type: "string",
            enum: ["SCHEMA_VIEW_UNSPECIFIED", "BASIC", "FULL"],
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "The page token, received from a previous ListSchemaRevisions call. Provide this to retrieve the subsequent page.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description: "The maximum number of revisions to return per page.",
          type: {
            type: "integer",
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
        let path = `v1/{+name}:listRevisions`;

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
          nextPageToken: {
            type: "string",
            description:
              "A token that can be sent as `page_token` to retrieve the next page. If this field is empty, there are no subsequent pages.",
          },
          schemas: {
            type: "array",
            items: {
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
            description: "The revisions of the schema.",
          },
        },
        description: "Response for the `ListSchemaRevisions` method.",
        additionalProperties: true,
      },
    },
  },
};

export default schemasListRevisions;
