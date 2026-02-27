import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRetrieverServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  chunks: {
    name: "chunks",
    fields: {
      data: {
        name: "data",
        fields: {
          string_value: "stringValue",
        },
      },
      custom_metadata: {
        name: "customMetadata",
        fields: {
          string_value: "stringValue",
          string_list_value: "stringListValue",
          numeric_value: "numericValue",
        },
      },
      create_time: "createTime",
      update_time: "updateTime",
    },
  },
  next_page_token: "nextPageToken",
};

const listChunks: AppBlock = {
  name: "List Chunks",
  description: `Lists all 'Chunk's in a 'Document'.`,
  category: "Chunks",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the `Document` containing `Chunk`s. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          type: {
            type: "string",
            description:
              "Required. The name of the `Document` containing `Chunk`s. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of `Chunk`s to return (per page). The service may return fewer `Chunk`s.  If unspecified, at most 10 `Chunk`s will be returned. The maximum size limit is 100 `Chunk`s per page.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of `Chunk`s to return (per page). The service may return fewer `Chunk`s.  If unspecified, at most 10 `Chunk`s will be returned. The maximum size limit is 100 `Chunk`s per page.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A page token, received from a previous `ListChunks` call.  Provide the `next_page_token` returned in the response as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListChunks` must match the call that provided the page token.",
          type: {
            type: "string",
            description:
              "Optional. A page token, received from a previous `ListChunks` call.  Provide the `next_page_token` returned in the response as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListChunks` must match the call that provided the page token.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listChunks(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          chunks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                data: {
                  type: "object",
                  properties: {
                    stringValue: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
                customMetadata: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      stringValue: {
                        type: "string",
                        description:
                          "(Part of 'value' - only one field in this group can be set)",
                      },
                      stringListValue: {
                        type: "object",
                        properties: {
                          values: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                        additionalProperties: true,
                        description:
                          "(Part of 'value' - only one field in this group can be set)",
                      },
                      numericValue: {
                        type: "number",
                        description:
                          "(Part of 'value' - only one field in this group can be set)",
                      },
                      key: {
                        type: "string",
                      },
                    },
                    additionalProperties: true,
                  },
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                state: {
                  type: "string",
                  enum: [
                    "STATE_UNSPECIFIED",
                    "STATE_PENDING_PROCESSING",
                    "STATE_ACTIVE",
                    "STATE_FAILED",
                  ],
                },
              },
              additionalProperties: true,
            },
            description: "The returned `Chunk`s.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no more pages.",
          },
        },
        description:
          "Response from `ListChunks` containing a paginated list of `Chunk`s. The `Chunk`s are sorted by ascending `chunk.create_time`.",
        additionalProperties: true,
      },
    },
  },
};

export default listChunks;
