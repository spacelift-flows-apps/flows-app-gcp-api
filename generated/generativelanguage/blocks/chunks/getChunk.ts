import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRetrieverServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
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
};

const getChunk: AppBlock = {
  name: "Get Chunk",
  description: `Gets information about a specific 'Chunk'.`,
  category: "Chunks",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the `Chunk` to retrieve. Example: `corpora/my-corpus-123/documents/the-doc-abc/chunks/some-chunk`",
          type: {
            type: "string",
            description:
              "Required. The name of the `Chunk` to retrieve. Example: `corpora/my-corpus-123/documents/the-doc-abc/chunks/some-chunk`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getChunk(request, (err: any, response: any) => {
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
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
    },
  },
};

export default getChunk;
