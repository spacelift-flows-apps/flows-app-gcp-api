import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient } from "../../lib/grpcClient.ts";

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
        validate_only: {
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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;

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
          name: {
            type: "string",
          },
          metadata: {
            type: "object",
            properties: {
              type_url: {
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
                    type_url: {
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
              type_url: {
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
