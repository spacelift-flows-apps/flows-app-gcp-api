import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagBindingsClient } from "../../lib/grpcClient.ts";

const listEffectiveTags: AppBlock = {
  name: "List Effective Tags",
  description: `Return a list of effective tags for the given Google Cloud resource, as specified in 'parent'.`,
  category: "Tag Bindings",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            'Required. The full resource name of a resource for which you want to list the effective tags. E.g. "//cloudresourcemanager.googleapis.com/projects/123"',
          type: {
            type: "string",
            description:
              'Required. The full resource name of a resource for which you want to list the effective tags. E.g. "//cloudresourcemanager.googleapis.com/projects/123"',
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. The maximum number of effective tags to return in the response. The server allows a maximum of 300 effective tags to return in a single page. If unspecified, the server will use 100 as the default.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of effective tags to return in the response. The server allows a maximum of 300 effective tags to return in a single page. If unspecified, the server will use 100 as the default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `ListEffectiveTags` that indicates from where this listing should continue.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to `ListEffectiveTags` that indicates from where this listing should continue.",
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
          client.listEffectiveTags(request, (err: any, response: any) => {
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
          effective_tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tag_value: {
                  type: "string",
                  description:
                    "Resource name for TagValue in the format `tagValues/456`.",
                },
                namespaced_tag_value: {
                  type: "string",
                  description:
                    "The namespaced name of the TagValue. Can be in the form `{organization_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_number}/{tag_key_short_name}/{tag_value_short_name}`.",
                },
                tag_key: {
                  type: "string",
                  description:
                    "The name of the TagKey, in the format `tagKeys/{id}`, such as `tagKeys/123`.",
                },
                namespaced_tag_key: {
                  type: "string",
                  description:
                    "The namespaced name of the TagKey. Can be in the form `{organization_id}/{tag_key_short_name}` or `{project_id}/{tag_key_short_name}` or `{project_number}/{tag_key_short_name}`.",
                },
                tag_key_parent_name: {
                  type: "string",
                  description:
                    "The parent name of the tag key. Must be in the format `organizations/{organization_id}` or `projects/{project_number}`",
                },
                inherited: {
                  type: "boolean",
                  description:
                    "Indicates the inheritance status of a tag value attached to the given resource. If the tag value is inherited from one of the resource's ancestors, inherited will be true. If false, then the tag value is directly attached to the resource, inherited will be false.",
                },
              },
              description:
                "An EffectiveTag represents a tag that applies to a resource during policy evaluation. Tags can be either directly bound to a resource or inherited from its ancestor. EffectiveTag contains the name and namespaced_name of the tag value and tag key, with additional fields of `inherited` to indicate the inheritance status of the effective tag.",
              additionalProperties: true,
            },
            description:
              "A possibly paginated list of effective tags for the specified resource.",
          },
          next_page_token: {
            type: "string",
            description:
              "Pagination token.  If the result set is too large to fit in a single response, this token is returned. It encodes the position of the current result cursor. Feeding this value into a new list request with the `page_token` parameter gives the next page of the results.  When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set.  Pagination tokens have a limited lifetime.",
          },
        },
        description: "The response of ListEffectiveTags.",
        additionalProperties: true,
      },
    },
  },
};

export default listEffectiveTags;
