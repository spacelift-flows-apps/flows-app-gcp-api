import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagKeysClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  short_name: "shortName",
  namespaced_name: "namespacedName",
  create_time: "createTime",
  update_time: "updateTime",
  purpose_data: "purposeData",
};

const getTagKey: AppBlock = {
  name: "Get Tag Key",
  description: `Retrieves a TagKey. This method will return 'PERMISSION_DENIED' if the key does not exist or the user does not have permission to view it.`,
  category: "Tag Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. A resource name in the format `tagKeys/{id}`, such as `tagKeys/123`.",
          type: {
            type: "string",
            description:
              "Required. A resource name in the format `tagKeys/{id}`, such as `tagKeys/123`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getTagKeysClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getTagKey(request, (err: any, response: any) => {
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
          namespacedName: {
            type: "string",
            description:
              "Output only. Immutable. Namespaced name of the TagKey.",
          },
          description: {
            type: "string",
            description:
              "Optional. User-assigned description of the TagKey. Must not exceed 256 characters.  Read-write.",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
    },
  },
};

export default getTagKey;
