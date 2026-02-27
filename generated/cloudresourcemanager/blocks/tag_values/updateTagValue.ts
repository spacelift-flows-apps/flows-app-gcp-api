import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  tagValue: {
    name: "tag_value",
    fields: {
      shortName: "short_name",
    },
  },
  updateMask: "update_mask",
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

const updateTagValue: AppBlock = {
  name: "Update Tag Value",
  description: `Updates the attributes of the TagValue resource.`,
  category: "Tag Values",
  inputs: {
    default: {
      config: {
        tagValue: {
          name: "Tag Value",
          description:
            "Required. The new definition of the TagValue. Only fields `description` and `etag` fields can be updated by this request. If the `etag` field is nonempty, it must match the `etag` field of the existing ControlGroup. Otherwise, `ABORTED` will be returned.",
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
              shortName: {
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
            required: ["shortName"],
            description:
              "A TagValue is a child of a particular TagKey. This is used to group cloud resources for the purpose of controlling them using policies.",
            additionalProperties: true,
          },
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description: "Optional. Fields to be updated.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: false,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "Optional. True to perform validations necessary for updating the resource, but not actually perform the action.",
          type: {
            type: "boolean",
            description:
              "Optional. True to perform validations necessary for updating the resource, but not actually perform the action.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagValuesClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.updateTagValue(request, (err: any, response: any) => {
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

export default updateTagValue;
