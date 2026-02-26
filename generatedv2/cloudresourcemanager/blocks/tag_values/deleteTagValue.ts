import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  validateOnly: "validate_only",
};

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

const deleteTagValue: AppBlock = {
  name: "Delete Tag Value",
  description: `Deletes a TagValue. The TagValue cannot have any bindings when it is deleted.`,
  category: "Tag Values",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Resource name for TagValue to be deleted in the format tagValues/456.",
          type: {
            type: "string",
            description:
              "Required. Resource name for TagValue to be deleted in the format tagValues/456.",
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "Optional. Set as true to perform the validations necessary for deletion, but not actually perform the action.",
          type: {
            type: "boolean",
            description:
              "Optional. Set as true to perform the validations necessary for deletion, but not actually perform the action.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description:
            "Optional. The etag known to the client for the expected state of the TagValue. This is to be used for optimistic concurrency.",
          type: {
            type: "string",
            description:
              "Optional. The etag known to the client for the expected state of the TagValue. This is to be used for optimistic concurrency.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagValuesClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteTagValue(request, (err: any, response: any) => {
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
          metadata: {
            type: "object",
            properties: {
              typeUrl: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
          },
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    typeUrl: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
            type: "object",
            properties: {
              typeUrl: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTagValue;
