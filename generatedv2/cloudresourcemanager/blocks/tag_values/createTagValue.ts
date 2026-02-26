import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient } from "../../lib/grpcClient.ts";

const createTagValue: AppBlock = {
  name: "Create Tag Value",
  description: `Creates a TagValue as a child of the specified TagKey. If a another request with the same parameters is sent while the original request is in process the second request will receive an error. A maximum of 1000 TagValues can exist under a TagKey at any given time.`,
  category: "Tag Values",
  inputs: {
    default: {
      config: {
        tag_value: {
          name: "Tag Value",
          description:
            "Required. The TagValue to be created. Only fields `short_name`, `description`, and `parent` are considered during the creation request.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Immutable. Resource name for TagValue in the format `tagValues/456`.",
              },
              parent: {
                type: "string",
                description:
                  "Immutable. The resource name of the new TagValue's parent TagKey. Must be of the form `tagKeys/{tag_key_id}`.",
              },
              short_name: {
                type: "string",
                description:
                  "Required. Immutable. User-assigned short name for TagValue. The short name should be unique for TagValues within the same parent TagKey.  The short name must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.",
              },
              description: {
                type: "string",
                description:
                  "Optional. User-assigned description of the TagValue. Must not exceed 256 characters.  Read-write.",
              },
              etag: {
                type: "string",
                description:
                  "Optional. Entity tag which users can pass to prevent race conditions. This field is always set in server responses. See UpdateTagValueRequest for details.",
              },
            },
            required: ["short_name"],
            description:
              "A TagValue is a child of a particular TagKey. This is used to group cloud resources for the purpose of controlling them using policies.",
            additionalProperties: true,
          },
          required: true,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "Optional. Set as true to perform the validations necessary for creating the resource, but not actually perform the action.",
          type: {
            type: "boolean",
            description:
              "Optional. Set as true to perform the validations necessary for creating the resource, but not actually perform the action.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagValuesClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.tag_value !== undefined)
          request.tag_value = input.event.inputConfig.tag_value;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;

        const result = await new Promise<any>((resolve, reject) => {
          client.createTagValue(request, (err: any, response: any) => {
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

export default createTagValue;
