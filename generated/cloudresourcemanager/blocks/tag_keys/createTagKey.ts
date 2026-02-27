import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagKeysClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  tagKey: {
    name: "tag_key",
    fields: {
      shortName: "short_name",
      purposeData: "purpose_data",
    },
  },
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

const createTagKey: AppBlock = {
  name: "Create Tag Key",
  description: `Creates a new TagKey. If another request with the same parameters is sent while the original request is in process, the second request will receive an error. A maximum of 1000 TagKeys can exist under a parent at any given time.`,
  category: "Tag Keys",
  inputs: {
    default: {
      config: {
        tagKey: {
          name: "Tag Key",
          description:
            "Required. The TagKey to be created. Only fields `short_name`, `description`, and `parent` are considered during the creation request.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Immutable. The resource name for a TagKey. Must be in the format `tagKeys/{tag_key_id}`, where `tag_key_id` is the generated numeric id for the TagKey.",
              },
              parent: {
                type: "string",
                description:
                  "Immutable. The resource name of the TagKey's parent. A TagKey can be parented by an Organization or a Project. For a TagKey parented by an Organization, its parent must be in the form `organizations/{org_id}`. For a TagKey parented by a Project, its parent can be in the form `projects/{project_id}` or `projects/{project_number}`.",
              },
              shortName: {
                type: "string",
                description:
                  "Required. Immutable. The user friendly name for a TagKey. The short name should be unique for TagKeys within the same tag namespace.  The short name must be 1-63 characters, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.",
              },
              description: {
                type: "string",
                description:
                  "Optional. User-assigned description of the TagKey. Must not exceed 256 characters.  Read-write.",
              },
              etag: {
                type: "string",
                description:
                  "Optional. Entity tag which users can pass to prevent race conditions. This field is always set in server responses. See UpdateTagKeyRequest for details.",
              },
              purpose: {
                type: "string",
                enum: ["PURPOSE_UNSPECIFIED", "GCE_FIREWALL"],
                description:
                  "A purpose for each policy engine requiring such an integration. A single policy engine may have multiple purposes defined, however a TagKey may only specify a single purpose.",
              },
              purposeData: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Optional. Purpose data corresponds to the policy system that the tag is intended for. See documentation for `Purpose` for formatting of this field.  Purpose data cannot be changed once set.",
              },
            },
            required: ["shortName"],
            description: "A TagKey, used to group a set of TagValues.",
            additionalProperties: true,
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "Optional. Set to true to perform validations necessary for creating the resource, but not actually perform the action.",
          type: {
            type: "boolean",
            description:
              "Optional. Set to true to perform validations necessary for creating the resource, but not actually perform the action.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagKeysClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createTagKey(request, (err: any, response: any) => {
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

export default createTagKey;
