import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagHoldsClient } from "../../lib/grpcClient.ts";

const createTagHold: AppBlock = {
  name: "Create Tag Hold",
  description: `Creates a TagHold. Returns ALREADY_EXISTS if a TagHold with the same resource and origin exists under the same TagValue.`,
  category: "Tag Holds",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the TagHold's parent TagValue. Must be of the form: `tagValues/{tag-value-id}`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the TagHold's parent TagValue. Must be of the form: `tagValues/{tag-value-id}`.",
          },
          required: true,
        },
        tag_hold: {
          name: "Tag Hold",
          description: "Required. The TagHold to be created.",
          type: {
            type: "object",
            properties: {
              holder: {
                type: "string",
                description:
                  "Required. The name of the resource where the TagValue is being used. Must be less than 200 characters. E.g. `//compute.googleapis.com/compute/projects/myproject/regions/us-east-1/instanceGroupManagers/instance-group`",
              },
              origin: {
                type: "string",
                description:
                  "Optional. An optional string representing the origin of this request. This field should include human-understandable information to distinguish origins from each other. Must be less than 200 characters. E.g. `migs-35678234`",
              },
              help_link: {
                type: "string",
                description:
                  "Optional. A URL where an end user can learn more about removing this hold. E.g. `https://cloud.google.com/resource-manager/docs/tags/tags-creating-and-managing`",
              },
            },
            required: ["holder"],
            description:
              "A TagHold represents the use of a TagValue that is not captured by TagBindings. If a TagValue has any TagHolds, deletion will be blocked. This resource is intended to be created in the same cloud location as the `holder`.",
            additionalProperties: true,
          },
          required: true,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "Optional. Set to true to perform the validations necessary for creating the resource, but not actually perform the action.",
          type: {
            type: "boolean",
            description:
              "Optional. Set to true to perform the validations necessary for creating the resource, but not actually perform the action.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagHoldsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.tag_hold !== undefined)
          request.tag_hold = input.event.inputConfig.tag_hold;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;

        const result = await new Promise<any>((resolve, reject) => {
          client.createTagHold(request, (err: any, response: any) => {
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

export default createTagHold;
