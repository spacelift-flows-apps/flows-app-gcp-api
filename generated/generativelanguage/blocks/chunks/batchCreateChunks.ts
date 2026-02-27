import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRetrieverServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  requests: {
    name: "requests",
    fields: {
      chunk: {
        name: "chunk",
        fields: {
          data: {
            name: "data",
            fields: {
              stringValue: "string_value",
            },
          },
          customMetadata: {
            name: "custom_metadata",
            fields: {
              stringValue: "string_value",
              stringListValue: "string_list_value",
              numericValue: "numeric_value",
            },
          },
          createTime: "create_time",
          updateTime: "update_time",
        },
      },
    },
  },
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
};

const batchCreateChunks: AppBlock = {
  name: "Batch Create Chunks",
  description: `Batch create 'Chunk's.`,
  category: "Chunks",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Optional. The name of the `Document` where this batch of `Chunk`s will be created. The parent field in every `CreateChunkRequest` must match this value. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          type: {
            type: "string",
            description:
              "Optional. The name of the `Document` where this batch of `Chunk`s will be created. The parent field in every `CreateChunkRequest` must match this value. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          },
          required: false,
        },
        requests: {
          name: "Requests",
          description:
            "Required. The request messages specifying the `Chunk`s to create. A maximum of 100 `Chunk`s can be created in a batch.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                parent: {
                  type: "string",
                  description:
                    "Required. The name of the `Document` where this `Chunk` will be created. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
                },
                chunk: {
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
                  description: "Required. The `Chunk` to create.",
                },
              },
              required: ["parent", "chunk"],
              description: "Request to create a `Chunk`.",
              additionalProperties: true,
            },
            description:
              "Required. The request messages specifying the `Chunk`s to create. A maximum of 100 `Chunk`s can be created in a batch.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.batchCreateChunks(request, (err: any, response: any) => {
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
            description: "`Chunk`s created.",
          },
        },
        description:
          "Response from `BatchCreateChunks` containing a list of created `Chunk`s.",
        additionalProperties: true,
      },
    },
  },
};

export default batchCreateChunks;
