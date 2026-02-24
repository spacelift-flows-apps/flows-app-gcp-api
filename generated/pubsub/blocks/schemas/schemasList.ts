import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const schemasList: AppBlock = {
  name: "Schemas - List",
  description: `Lists schemas in a project.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the project in which to list schemas. Format is `projects/{project-id}`.",
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
            "The value returned by the last `ListSchemasResponse`; indicates that this is a continuation of a prior `ListSchemas` call, and that the system should return the next page of data.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description: "Maximum number of schemas to return.",
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
        let path = `v1/{+parent}/schemas`;

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
            description: "The resulting schemas.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If not empty, indicates that there may be more schemas that match the request; this value should be passed in a new `ListSchemasRequest`.",
          },
        },
        description: "Response for the `ListSchemas` method.",
        additionalProperties: true,
      },
    },
  },
};

export default schemasList;
