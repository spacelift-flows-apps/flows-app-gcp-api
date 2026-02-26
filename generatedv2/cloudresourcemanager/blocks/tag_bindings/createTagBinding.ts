import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagBindingsClient } from "../../lib/grpcClient.ts";

const createTagBinding: AppBlock = {
  name: "Create Tag Binding",
  description: `Creates a TagBinding between a TagValue and a Google Cloud resource.`,
  category: "Tag Bindings",
  inputs: {
    default: {
      config: {
        tag_binding: {
          name: "Tag Binding",
          description: "Required. The TagBinding to be created.",
          type: {
            type: "object",
            properties: {
              parent: {
                type: "string",
                description:
                  "The full resource name of the resource the TagValue is bound to. E.g. `//cloudresourcemanager.googleapis.com/projects/123`",
              },
              tag_value: {
                type: "string",
                description:
                  "The TagValue of the TagBinding. Must be of the form `tagValues/456`.",
              },
              tag_value_namespaced_name: {
                type: "string",
                description:
                  "The namespaced name for the TagValue of the TagBinding. Must be in the format `{parent_id}/{tag_key_short_name}/{short_name}`.  For methods that support TagValue namespaced name, only one of tag_value_namespaced_name or tag_value may be filled. Requests with both fields will be rejected.",
              },
            },
            description:
              "A TagBinding represents a connection between a TagValue and a cloud resource Once a TagBinding is created, the TagValue is applied to all the descendants of the Google Cloud resource.",
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
        const client = await getTagBindingsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.tag_binding !== undefined)
          request.tag_binding = input.event.inputConfig.tag_binding;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;

        const result = await new Promise<any>((resolve, reject) => {
          client.createTagBinding(request, (err: any, response: any) => {
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

export default createTagBinding;
