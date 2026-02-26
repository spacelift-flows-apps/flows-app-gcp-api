import { AppBlock, events } from "@slflows/sdk/v1";
import { getGroupServiceClient } from "../../lib/grpcClient.ts";

const listGroups: AppBlock = {
  name: "List Groups",
  description: `Lists the existing groups.`,
  category: "Groups",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) whose groups are to be listed. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) whose groups are to be listed. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          },
          required: true,
        },
        children_of_group: {
          name: "Children Of Group",
          description:
            "A group name. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  Returns groups whose `parent_name` field contains the group name.  If no groups have this parent, the results are empty.",
          type: {
            type: "string",
            description:
              "A group name. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  Returns groups whose `parent_name` field contains the group name.  If no groups have this parent, the results are empty. (Part of 'filter' - only one field in this group can be set)",
          },
          required: false,
        },
        ancestors_of_group: {
          name: "Ancestors Of Group",
          description:
            "A group name. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  Returns groups that are ancestors of the specified group. The groups are returned in order, starting with the immediate parent and ending with the most distant ancestor.  If the specified group has no immediate parent, the results are empty.",
          type: {
            type: "string",
            description:
              "A group name. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  Returns groups that are ancestors of the specified group. The groups are returned in order, starting with the immediate parent and ending with the most distant ancestor.  If the specified group has no immediate parent, the results are empty. (Part of 'filter' - only one field in this group can be set)",
          },
          required: false,
        },
        descendants_of_group: {
          name: "Descendants Of Group",
          description:
            "A group name. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  Returns the descendants of the specified group.  This is a superset of the results returned by the `children_of_group` filter, and includes children-of-children, and so forth.",
          type: {
            type: "string",
            description:
              "A group name. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  Returns the descendants of the specified group.  This is a superset of the results returned by the `children_of_group` filter, and includes children-of-children, and so forth. (Part of 'filter' - only one field in this group can be set)",
          },
          required: false,
        },
        page_size: {
          name: "Page Size",
          description:
            "A positive number that is the maximum number of results to return.",
          type: {
            type: "integer",
            description:
              "A positive number that is the maximum number of results to return.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the `next_page_token` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the `next_page_token` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getGroupServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.children_of_group !== undefined)
          request.children_of_group = input.event.inputConfig.children_of_group;
        if (input.event.inputConfig.ancestors_of_group !== undefined)
          request.ancestors_of_group =
            input.event.inputConfig.ancestors_of_group;
        if (input.event.inputConfig.descendants_of_group !== undefined)
          request.descendants_of_group =
            input.event.inputConfig.descendants_of_group;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listGroups(request, (err: any, response: any) => {
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
          group: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The name of this group. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  When creating a group, this field is ignored and a new name is created consisting of the project specified in the call to `CreateGroup` and a unique `[GROUP_ID]` that is generated automatically.",
                },
                display_name: {
                  type: "string",
                  description:
                    "A user-assigned name for this group, used only for display purposes.",
                },
                parent_name: {
                  type: "string",
                  description:
                    'The name of the group\'s parent, if it has one. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  For groups with no parent, `parent_name` is the empty string, `""`.',
                },
                filter: {
                  type: "string",
                  description:
                    "The filter used to determine which monitored resources belong to this group.",
                },
                is_cluster: {
                  type: "boolean",
                  description:
                    "If true, the members of this group are considered to be a cluster. The system can perform additional analysis on groups that are clusters.",
                },
              },
              description:
                'The description of a dynamic collection of monitored resources. Each group has a filter that is matched against monitored resources and their associated metadata. If a group\'s filter matches an available monitored resource, then that resource is a member of that group.  Groups can contain any number of monitored resources, and each monitored resource can be a member of any number of groups.  Groups can be nested in parent-child hierarchies. The `parentName` field identifies an optional parent for each group.  If a group has a parent, then the only monitored resources available to be matched by the group\'s filter are the resources contained in the parent group.  In other words, a group contains the monitored resources that match its filter and the filters of all the group\'s ancestors.  A group without a parent can contain any monitored resource.  For example, consider an infrastructure running a set of instances with two user-defined tags: `"environment"` and `"role"`. A parent group has a filter, `environment="production"`.  A child of that parent group has a filter, `role="transcoder"`.  The parent group contains all instances in the production environment, regardless of their roles.  The child group contains instances that have the transcoder role *and* are in the production environment.  The monitored resources contained in a group can change at any moment, depending on what resources exist and what filters are associated with the group and its ancestors.',
              additionalProperties: true,
            },
            description: "The groups that match the specified filters.",
          },
          next_page_token: {
            type: "string",
            description:
              "If there are more results than have been returned, then this field is set to a non-empty value.  To see the additional results, use that value as `page_token` in the next call to this method.",
          },
        },
        description: "The `ListGroups` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listGroups;
