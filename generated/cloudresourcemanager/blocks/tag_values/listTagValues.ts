import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  tag_values: {
    name: "tagValues",
    fields: {
      short_name: "shortName",
      namespaced_name: "namespacedName",
      create_time: "createTime",
      update_time: "updateTime",
    },
  },
  next_page_token: "nextPageToken",
};

const listTagValues: AppBlock = {
  name: "List Tag Values",
  description: `Lists all TagValues for a specific TagKey.`,
  category: "Tag Values",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description: "Required.",
          type: {
            type: "string",
            description: "Required.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of TagValues to return in the response. The server allows a maximum of 300 TagValues to return. If unspecified, the server will use 100 as the default.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of TagValues to return in the response. The server allows a maximum of 300 TagValues to return. If unspecified, the server will use 100 as the default.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `ListTagValues` that indicates where this listing should continue from.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to `ListTagValues` that indicates where this listing should continue from.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagValuesClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listTagValues(request, (err: any, response: any) => {
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
          tagValues: {
            type: "array",
            items: {
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            description:
              "A possibly paginated list of TagValues that are direct descendants of the specified parent TagKey.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A pagination token returned from a previous call to `ListTagValues` that indicates from where listing should continue. This is currently not used, but the server may at any point start supplying a valid token.",
          },
        },
        description: "The ListTagValues response.",
        additionalProperties: true,
      },
    },
  },
};

export default listTagValues;
