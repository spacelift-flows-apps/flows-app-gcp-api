import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagHoldsClient } from "../../lib/grpcClient.ts";

const deleteTagHold: AppBlock = {
  name: "Delete Tag Hold",
  description: `Deletes a TagHold.`,
  category: "Tag Holds",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the TagHold to delete. Must be of the form: `tagValues/{tag-value-id}/tagHolds/{tag-hold-id}`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the TagHold to delete. Must be of the form: `tagValues/{tag-value-id}/tagHolds/{tag-hold-id}`.",
          },
          required: true,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "Optional. Set to true to perform the validations necessary for deleting the resource, but not actually perform the action.",
          type: {
            type: "boolean",
            description:
              "Optional. Set to true to perform the validations necessary for deleting the resource, but not actually perform the action.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagHoldsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteTagHold(request, (err: any, response: any) => {
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

export default deleteTagHold;
