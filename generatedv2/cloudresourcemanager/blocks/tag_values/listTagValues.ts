import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient } from "../../lib/grpcClient.ts";

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
        page_size: {
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
        page_token: {
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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

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
          tag_values: {
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
                short_name: {
                  type: "string",
                  description:
                    "Required. Immutable. User-assigned short name for TagValue. The short name should be unique for TagValues within the same parent TagKey.  The short name must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.",
                },
                namespaced_name: {
                  type: "string",
                  description:
                    "Output only. The namespaced name of the TagValue. Can be in the form `{organization_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_number}/{tag_key_short_name}/{tag_value_short_name}`.",
                },
                description: {
                  type: "string",
                  description:
                    "Optional. User-assigned description of the TagValue. Must not exceed 256 characters.  Read-write.",
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
                    "Optional. Entity tag which users can pass to prevent race conditions. This field is always set in server responses. See UpdateTagValueRequest for details.",
                },
              },
              required: ["short_name"],
              description:
                "A TagValue is a child of a particular TagKey. This is used to group cloud resources for the purpose of controlling them using policies.",
              additionalProperties: true,
            },
            description:
              "A possibly paginated list of TagValues that are direct descendants of the specified parent TagKey.",
          },
          next_page_token: {
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
