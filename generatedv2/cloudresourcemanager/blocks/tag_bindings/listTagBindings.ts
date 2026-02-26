import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagBindingsClient } from "../../lib/grpcClient.ts";

const listTagBindings: AppBlock = {
  name: "List Tag Bindings",
  description: `Lists the TagBindings for the given Google Cloud resource, as specified with 'parent'. NOTE: The 'parent' field is expected to be a full resource name: https://cloud.google.com/apis/design/resource_names#full_resource_name`,
  category: "Tag Bindings",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            'Required. The full resource name of a resource for which you want to list existing TagBindings. E.g. "//cloudresourcemanager.googleapis.com/projects/123"',
          type: {
            type: "string",
            description:
              'Required. The full resource name of a resource for which you want to list existing TagBindings. E.g. "//cloudresourcemanager.googleapis.com/projects/123"',
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. The maximum number of TagBindings to return in the response. The server allows a maximum of 300 TagBindings to return. If unspecified, the server will use 100 as the default.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of TagBindings to return in the response. The server allows a maximum of 300 TagBindings to return. If unspecified, the server will use 100 as the default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `ListTagBindings` that indicates where this listing should continue from.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to `ListTagBindings` that indicates where this listing should continue from.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagBindingsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listTagBindings(request, (err: any, response: any) => {
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
          tag_bindings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The name of the TagBinding. This is a String of the form: `tagBindings/{full-resource-name}/{tag-value-name}` (e.g. `tagBindings/%2F%2Fcloudresourcemanager.googleapis.com%2Fprojects%2F123/tagValues/456`).",
                },
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
            description:
              "A possibly paginated list of TagBindings for the specified resource.",
          },
          next_page_token: {
            type: "string",
            description:
              "Pagination token.  If the result set is too large to fit in a single response, this token is returned. It encodes the position of the current result cursor. Feeding this value into a new list request with the `page_token` parameter gives the next page of the results.  When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set.  Pagination tokens have a limited lifetime.",
          },
        },
        description: "The ListTagBindings response.",
        additionalProperties: true,
      },
    },
  },
};

export default listTagBindings;
