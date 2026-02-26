import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagKeysClient } from "../../lib/grpcClient.ts";

const deleteTagKey: AppBlock = {
  name: "Delete Tag Key",
  description: `Deletes a TagKey. The TagKey cannot be deleted if it has any child TagValues.`,
  category: "Tag Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of a TagKey to be deleted in the format `tagKeys/123`. The TagKey cannot be a parent of any existing TagValues or it will not be deleted successfully.",
          type: {
            type: "string",
            description:
              "Required. The resource name of a TagKey to be deleted in the format `tagKeys/123`. The TagKey cannot be a parent of any existing TagValues or it will not be deleted successfully.",
          },
          required: true,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "Optional. Set as true to perform validations necessary for deletion, but not actually perform the action.",
          type: {
            type: "boolean",
            description:
              "Optional. Set as true to perform validations necessary for deletion, but not actually perform the action.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description:
            "Optional. The etag known to the client for the expected state of the TagKey. This is to be used for optimistic concurrency.",
          type: {
            type: "string",
            description:
              "Optional. The etag known to the client for the expected state of the TagKey. This is to be used for optimistic concurrency.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagKeysClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteTagKey(request, (err: any, response: any) => {
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

export default deleteTagKey;
