import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const operationsList: AppBlock = {
  name: "Operations - List",
  description: `Lists operations that match the specified filter in the request.`,
  category: "Operations",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket in which to look for operations.",
          type: {
            type: "string",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            "A filter to narrow down results to a preferred subset. The filtering language is documented in more detail in [AIP-160](https://google.aip.dev/160).",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Maximum number of items to return in a single page of responses. Fewer total results may be returned than requested. The service uses this parameter or 100 items, whichever is smaller.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A previously-returned page token representing part of the larger set of results to view.",
          type: {
            type: "string",
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
              "https://www.googleapis.com/auth/cloud-platform.read-only",
              "https://www.googleapis.com/auth/devstorage.full_control",
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/devstorage.read_write",
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
        const baseUrl = "https://storage.googleapis.com/storage/v1/";
        let path = `b/{bucket}/operations`;

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
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
          operations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                done: {
                  type: "boolean",
                  description:
                    'If the value is "false", it means the operation is still in progress. If "true", the operation is completed, and either "error" or "response" is available.',
                },
                error: {
                  type: "object",
                  properties: {
                    code: {
                      type: "integer",
                      description:
                        "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
                    },
                    details: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                      description:
                        "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
                    },
                    message: {
                      type: "string",
                      description:
                        "A developer-facing error message, which should be in English.",
                    },
                  },
                  description:
                    'The "Status" type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each "Status" message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).',
                  additionalProperties: true,
                },
                metadata: {
                  type: "object",
                  additionalProperties: true,
                  description:
                    "Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.",
                },
                name: {
                  type: "string",
                  description:
                    'The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the "name" should be a resource name ending with "operations/{operationId}".',
                },
                response: {
                  type: "object",
                  additionalProperties: true,
                  description:
                    'The normal response of the operation in case of success. If the original method returns no data on success, such as "Delete", the response is google.protobuf.Empty. If the original method is standard Get/Create/Update, the response should be the resource. For other methods, the response should have the type "XxxResponse", where "Xxx" is the original method name. For example, if the original method name is "TakeSnapshot()", the inferred response type is "TakeSnapshotResponse".',
                },
                selfLink: {
                  type: "string",
                  description: "The link to this long running operation.",
                },
                kind: {
                  type: "string",
                  description:
                    "The kind of item this is. For operations, this is always storage#operation.",
                },
              },
              description:
                "This resource represents a long-running operation that is the result of a network API call.",
              additionalProperties: true,
            },
            description:
              "A list of operations that matches the specified filter in the request.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For lists of operations, this is always storage#operations.",
          },
        },
        description:
          "The response message for storage.buckets.operations.list.",
        additionalProperties: true,
      },
    },
  },
};

export default operationsList;
