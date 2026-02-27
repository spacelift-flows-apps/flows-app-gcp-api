import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRetrieverServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  document: {
    name: "document",
    fields: {
      displayName: "display_name",
      customMetadata: {
        name: "custom_metadata",
        fields: {
          stringValue: "string_value",
          stringListValue: "string_list_value",
          numericValue: "numeric_value",
        },
      },
      updateTime: "update_time",
      createTime: "create_time",
    },
  },
  updateMask: "update_mask",
};

const outputMapping = {
  display_name: "displayName",
  custom_metadata: {
    name: "customMetadata",
    fields: {
      string_value: "stringValue",
      string_list_value: "stringListValue",
      numeric_value: "numericValue",
    },
  },
  update_time: "updateTime",
  create_time: "createTime",
};

const updateDocument: AppBlock = {
  name: "Update Document",
  description: `Updates a 'Document'.`,
  category: "Documents",
  inputs: {
    default: {
      config: {
        document: {
          name: "Document",
          description: "Required. The `Document` to update.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              displayName: {
                type: "string",
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
              updateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              createTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
            },
            additionalProperties: true,
            description: "Required. The `Document` to update.",
          },
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "Required. The list of fields to update. Currently, this only supports updating `display_name` and `custom_metadata`.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.updateDocument(request, (err: any, response: any) => {
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
          displayName: {
            type: "string",
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
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateDocument;
