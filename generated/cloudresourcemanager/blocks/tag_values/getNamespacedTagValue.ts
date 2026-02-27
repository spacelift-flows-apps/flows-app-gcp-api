import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  short_name: "shortName",
  namespaced_name: "namespacedName",
  create_time: "createTime",
  update_time: "updateTime",
};

const getNamespacedTagValue: AppBlock = {
  name: "Get Namespaced Tag Value",
  description: `Retrieves a TagValue by its namespaced name. This method will return 'PERMISSION_DENIED' if the value does not exist or the user does not have permission to view it.`,
  category: "Tag Values",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            'Required. A namespaced tag value name in the following format:    `{parentId}/{tagKeyShort}/{tagValueShort}`  Examples: - `42/foo/abc` for a value with short name "abc" under the key with short   name "foo" under the organization with ID 42 - `r2-d2/bar/xyz` for a value with short name "xyz" under the key with    short name "bar" under the project with ID "r2-d2"',
          type: {
            type: "string",
            description:
              'Required. A namespaced tag value name in the following format:    `{parentId}/{tagKeyShort}/{tagValueShort}`  Examples: - `42/foo/abc` for a value with short name "abc" under the key with short   name "foo" under the organization with ID 42 - `r2-d2/bar/xyz` for a value with short name "xyz" under the key with    short name "bar" under the project with ID "r2-d2"',
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getTagValuesClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getNamespacedTagValue(request, (err: any, response: any) => {
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
          namespacedName: {
            type: "string",
            description:
              "Output only. The namespaced name of the TagValue. Can be in the form `{organization_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_number}/{tag_key_short_name}/{tag_value_short_name}`.",
          },
          description: {
            type: "string",
            description:
              "Optional. User-assigned description of the TagValue. Must not exceed 256 characters.  Read-write.",
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
              "Optional. Entity tag which users can pass to prevent race conditions. This field is always set in server responses. See UpdateTagValueRequest for details.",
          },
        },
        required: ["shortName"],
        description:
          "A TagValue is a child of a particular TagKey. This is used to group cloud resources for the purpose of controlling them using policies.",
        additionalProperties: true,
      },
    },
  },
};

export default getNamespacedTagValue;
