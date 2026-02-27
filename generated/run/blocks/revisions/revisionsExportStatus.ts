import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const revisionsExportStatus: AppBlock = {
  name: "Revisions - Export Status",
  description: `Read the status of an image export operation.`,
  category: "Revisions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the resource of which image export operation status has to be fetched. Format: `projects/{project_id_or_number}/locations/{location}/services/{service}/revisions/{revision}` for Revision `projects/{project_id_or_number}/locations/{location}/jobs/{job}/executions/{execution}` for Execution",
          type: {
            type: "string",
          },
          required: true,
        },
        operationId: {
          name: "Operation ID",
          description: "Required. The operation id returned from ExportImage.",
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
        const baseUrl = "https://run.googleapis.com/";
        let path = `v2/{+name}/{+operationId}:exportStatus`;

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
          operationId: {
            type: "string",
            description: "The operation id.",
          },
          operationState: {
            type: "string",
            enum: ["OPERATION_STATE_UNSPECIFIED", "IN_PROGRESS", "FINISHED"],
            description:
              "Output only. The state of the overall export operation.",
          },
          imageExportStatuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                exportJobState: {
                  type: "string",
                  enum: [
                    "EXPORT_JOB_STATE_UNSPECIFIED",
                    "IN_PROGRESS",
                    "FINISHED",
                  ],
                  description:
                    "Output only. Has the image export job finished (regardless of successful or failure).",
                },
                status: {
                  type: "object",
                  properties: {
                    code: {
                      type: "integer",
                      description:
                        "Numeric code drawn from the space specified below. Often, this is the canonical error space, and code is drawn from google3/util/task/codes.proto copybara:strip_begin(b/383363683) copybara:strip_end_and_replace optional int32 code = 1; (Format: int32)",
                    },
                    space: {
                      type: "string",
                      description:
                        "copybara:strip_begin(b/383363683) Space to which this status belongs copybara:strip_end_and_replace optional string space = 2; // Space to which this status belongs",
                    },
                    message: {
                      type: "string",
                      description:
                        "Detail message copybara:strip_begin(b/383363683) copybara:strip_end_and_replace optional string message = 3;",
                    },
                    canonicalCode: {
                      type: "integer",
                      description:
                        "copybara:strip_begin(b/383363683) copybara:strip_end_and_replace optional int32 canonical_code = 6; (Format: int32)",
                    },
                    messageSet: {
                      type: "object",
                      properties: {},
                      description:
                        'This is proto2\'s version of MessageSet. DEPRECATED: DO NOT USE FOR NEW FIELDS. If you are using editions or proto2, please make your own extendable messages for your use case. If you are using proto3, please use `Any` instead. MessageSet was the implementation of extensions for proto1. When proto2 was introduced, extensions were implemented as a first-class feature. This schema for MessageSet was meant to be a "bridge" solution to migrate MessageSet-bearing messages from proto1 to proto2. This schema has been open-sourced only to facilitate the migration of Google products with MessageSet-bearing messages to open-source environments.',
                      additionalProperties: true,
                    },
                  },
                  description: "Wire-format for a Status object",
                  additionalProperties: true,
                },
                exportedImageDigest: {
                  type: "string",
                  description:
                    "The exported image ID as it will appear in Artifact Registry.",
                },
                tag: {
                  type: "string",
                  description:
                    "The image tag as it will appear in Artifact Registry.",
                },
              },
              description: "The status of an image export job.",
              additionalProperties: true,
            },
            description: "The status of each image export job.",
          },
        },
        description:
          "ExportStatusResponse contains the status of image export operation, with the status of each image export job.",
        additionalProperties: true,
      },
    },
  },
};

export default revisionsExportStatus;
