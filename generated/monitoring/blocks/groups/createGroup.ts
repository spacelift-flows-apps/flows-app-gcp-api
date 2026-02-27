import { AppBlock, events } from "@slflows/sdk/v1";
import { getGroupServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  group: {
    name: "group",
    fields: {
      displayName: "display_name",
      parentName: "parent_name",
      isCluster: "is_cluster",
    },
  },
  validateOnly: "validate_only",
};

const outputMapping = {
  display_name: "displayName",
  parent_name: "parentName",
  is_cluster: "isCluster",
};

const createGroup: AppBlock = {
  name: "Create Group",
  description: `Creates a new group.`,
  category: "Groups",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) in which to create the group. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) in which to create the group. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          },
          required: true,
        },
        group: {
          name: "Group",
          description:
            "Required. A group definition. It is an error to define the `name` field because the system assigns the name.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Output only. The name of this group. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  When creating a group, this field is ignored and a new name is created consisting of the project specified in the call to `CreateGroup` and a unique `[GROUP_ID]` that is generated automatically.",
              },
              displayName: {
                type: "string",
                description:
                  "A user-assigned name for this group, used only for display purposes.",
              },
              parentName: {
                type: "string",
                description:
                  'The name of the group\'s parent, if it has one. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  For groups with no parent, `parent_name` is the empty string, `""`.',
              },
              filter: {
                type: "string",
                description:
                  "The filter used to determine which monitored resources belong to this group.",
              },
              isCluster: {
                type: "boolean",
                description:
                  "If true, the members of this group are considered to be a cluster. The system can perform additional analysis on groups that are clusters.",
              },
            },
            description:
              'The description of a dynamic collection of monitored resources. Each group has a filter that is matched against monitored resources and their associated metadata. If a group\'s filter matches an available monitored resource, then that resource is a member of that group.  Groups can contain any number of monitored resources, and each monitored resource can be a member of any number of groups.  Groups can be nested in parent-child hierarchies. The `parentName` field identifies an optional parent for each group.  If a group has a parent, then the only monitored resources available to be matched by the group\'s filter are the resources contained in the parent group.  In other words, a group contains the monitored resources that match its filter and the filters of all the group\'s ancestors.  A group without a parent can contain any monitored resource.  For example, consider an infrastructure running a set of instances with two user-defined tags: `"environment"` and `"role"`. A parent group has a filter, `environment="production"`.  A child of that parent group has a filter, `role="transcoder"`.  The parent group contains all instances in the production environment, regardless of their roles.  The child group contains instances that have the transcoder role *and* are in the production environment.  The monitored resources contained in a group can change at any moment, depending on what resources exist and what filters are associated with the group and its ancestors.',
            additionalProperties: true,
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "If true, validate this request but do not create the group.",
          type: {
            type: "boolean",
            description:
              "If true, validate this request but do not create the group.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getGroupServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createGroup(request, (err: any, response: any) => {
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
              "Output only. The name of this group. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  When creating a group, this field is ignored and a new name is created consisting of the project specified in the call to `CreateGroup` and a unique `[GROUP_ID]` that is generated automatically.",
          },
          displayName: {
            type: "string",
            description:
              "A user-assigned name for this group, used only for display purposes.",
          },
          parentName: {
            type: "string",
            description:
              'The name of the group\'s parent, if it has one. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]  For groups with no parent, `parent_name` is the empty string, `""`.',
          },
          filter: {
            type: "string",
            description:
              "The filter used to determine which monitored resources belong to this group.",
          },
          isCluster: {
            type: "boolean",
            description:
              "If true, the members of this group are considered to be a cluster. The system can perform additional analysis on groups that are clusters.",
          },
        },
        description:
          'The description of a dynamic collection of monitored resources. Each group has a filter that is matched against monitored resources and their associated metadata. If a group\'s filter matches an available monitored resource, then that resource is a member of that group.  Groups can contain any number of monitored resources, and each monitored resource can be a member of any number of groups.  Groups can be nested in parent-child hierarchies. The `parentName` field identifies an optional parent for each group.  If a group has a parent, then the only monitored resources available to be matched by the group\'s filter are the resources contained in the parent group.  In other words, a group contains the monitored resources that match its filter and the filters of all the group\'s ancestors.  A group without a parent can contain any monitored resource.  For example, consider an infrastructure running a set of instances with two user-defined tags: `"environment"` and `"role"`. A parent group has a filter, `environment="production"`.  A child of that parent group has a filter, `role="transcoder"`.  The parent group contains all instances in the production environment, regardless of their roles.  The child group contains instances that have the transcoder role *and* are in the production environment.  The monitored resources contained in a group can change at any moment, depending on what resources exist and what filters are associated with the group and its ancestors.',
        additionalProperties: true,
      },
    },
  },
};

export default createGroup;
