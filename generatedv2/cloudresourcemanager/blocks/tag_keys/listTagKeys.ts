import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagKeysClient } from "../../lib/grpcClient.ts";

const listTagKeys: AppBlock = {
  name: "List Tag Keys",
  description: `Lists all TagKeys for a parent resource.`,
  category: "Tag Keys",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the TagKey's parent. Must be of the form `organizations/{org_id}` or `projects/{project_id}` or `projects/{project_number}`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the TagKey's parent. Must be of the form `organizations/{org_id}` or `projects/{project_id}` or `projects/{project_number}`",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. The maximum number of TagKeys to return in the response. The server allows a maximum of 300 TagKeys to return. If unspecified, the server will use 100 as the default.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of TagKeys to return in the response. The server allows a maximum of 300 TagKeys to return. If unspecified, the server will use 100 as the default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `ListTagKey` that indicates where this listing should continue from.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to `ListTagKey` that indicates where this listing should continue from.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagKeysClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listTagKeys(request, (err: any, response: any) => {
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
          tag_keys: {
            type: "array",
            items: {
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
                short_name: {
                  type: "string",
                  description:
                    "Required. Immutable. The user friendly name for a TagKey. The short name should be unique for TagKeys within the same tag namespace.  The short name must be 1-63 characters, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.",
                },
                namespaced_name: {
                  type: "string",
                  description:
                    "Output only. Immutable. Namespaced name of the TagKey.",
                },
                description: {
                  type: "string",
                  description:
                    "Optional. User-assigned description of the TagKey. Must not exceed 256 characters.  Read-write.",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                update_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                purpose_data: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Optional. Purpose data corresponds to the policy system that the tag is intended for. See documentation for `Purpose` for formatting of this field.  Purpose data cannot be changed once set.",
                },
              },
              required: ["short_name"],
              description: "A TagKey, used to group a set of TagValues.",
              additionalProperties: true,
            },
            description:
              "List of TagKeys that live under the specified parent in the request.",
          },
          next_page_token: {
            type: "string",
            description:
              "A pagination token returned from a previous call to `ListTagKeys` that indicates from where listing should continue.",
          },
        },
        description: "The ListTagKeys response message.",
        additionalProperties: true,
      },
    },
  },
};

export default listTagKeys;
