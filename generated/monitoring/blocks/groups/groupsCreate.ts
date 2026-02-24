import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const groupsCreate: AppBlock = {
  name: "Groups - Create",
  description: `Creates a new group.`,
  category: "Groups",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Output only.",
          type: {
            type: "string",
            description:
              "Output only. The name of this group. The format is: projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID] When creating a group, this field is ignored and a new name is created consisting of the project specified in the call to CreateGroup and a unique [GROUP_ID] that is generated automatically.",
          },
          required: false,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "If true, validate this request but do not create the group.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        displayName: {
          name: "Display Name",
          description:
            "A user-assigned name for this group, used only for display purposes.",
          type: {
            type: "string",
            description:
              "A user-assigned name for this group, used only for display purposes.",
          },
          required: false,
        },
        parentName: {
          name: "Parent Name",
          description: "The name of the group's parent, if it has one.",
          type: {
            type: "string",
            description:
              'The name of the group\'s parent, if it has one. The format is: projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID] For groups with no parent, parent_name is the empty string, "".',
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "The filter used to determine which monitored resources belong to this group.",
          type: {
            type: "string",
            description:
              "The filter used to determine which monitored resources belong to this group.",
          },
          required: false,
        },
        isCluster: {
          name: "Is Cluster",
          description:
            "If true, the members of this group are considered to be a cluster.",
          type: {
            type: "boolean",
            description:
              "If true, the members of this group are considered to be a cluster. The system can perform additional analysis on groups that are clusters.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/monitoring",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://monitoring.googleapis.com/";
        let path = `v3/{+name}/groups`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.displayName !== undefined)
          requestBody.displayName = input.event.inputConfig.displayName;
        if (input.event.inputConfig.parentName !== undefined)
          requestBody.parentName = input.event.inputConfig.parentName;
        if (input.event.inputConfig.filter !== undefined)
          requestBody.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.isCluster !== undefined)
          requestBody.isCluster = input.event.inputConfig.isCluster;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();
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
          name: {
            type: "string",
            description:
              "Output only. The name of this group. The format is: projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID] When creating a group, this field is ignored and a new name is created consisting of the project specified in the call to CreateGroup and a unique [GROUP_ID] that is generated automatically.",
          },
          displayName: {
            type: "string",
            description:
              "A user-assigned name for this group, used only for display purposes.",
          },
          parentName: {
            type: "string",
            description:
              'The name of the group\'s parent, if it has one. The format is: projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID] For groups with no parent, parent_name is the empty string, "".',
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
          'The description of a dynamic collection of monitored resources. Each group has a filter that is matched against monitored resources and their associated metadata. If a group\'s filter matches an available monitored resource, then that resource is a member of that group. Groups can contain any number of monitored resources, and each monitored resource can be a member of any number of groups.Groups can be nested in parent-child hierarchies. The parentName field identifies an optional parent for each group. If a group has a parent, then the only monitored resources available to be matched by the group\'s filter are the resources contained in the parent group. In other words, a group contains the monitored resources that match its filter and the filters of all the group\'s ancestors. A group without a parent can contain any monitored resource.For example, consider an infrastructure running a set of instances with two user-defined tags: "environment" and "role". A parent group has a filter, environment="production". A child of that parent group has a filter, role="transcoder". The parent group contains all instances in the production environment, regardless of their roles. The child group contains instances that have the transcoder role and are in the production environment.The monitored resources contained in a group can change at any moment, depending on what resources exist and what filters are associated with the group and its ancestors.',
        additionalProperties: true,
      },
    },
  },
};

export default groupsCreate;
