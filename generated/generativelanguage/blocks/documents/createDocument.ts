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

const createDocument: AppBlock = {
  name: "Create Document",
  description: `Creates an empty 'Document'.`,
  category: "Documents",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the `Corpus` where this `Document` will be created. Example: `corpora/my-corpus-123`",
          type: {
            type: "string",
            description:
              "Required. The name of the `Corpus` where this `Document` will be created. Example: `corpora/my-corpus-123`",
          },
          required: true,
        },
        document: {
          name: "Document",
          description: "Required. The `Document` to create.",
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
            description: "Required. The `Document` to create.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createDocument(request, (err: any, response: any) => {
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

export default createDocument;
