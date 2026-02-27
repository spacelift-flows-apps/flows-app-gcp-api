import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  fullResourceName: "full_resource_name",
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  permissions: {
    name: "permissions",
    fields: {
      only_in_predefined_roles: "onlyInPredefinedRoles",
      custom_roles_support_level: "customRolesSupportLevel",
      api_disabled: "apiDisabled",
      primary_permission: "primaryPermission",
    },
  },
  next_page_token: "nextPageToken",
};

const queryTestablePermissions: AppBlock = {
  name: "Query Testable Permissions",
  description: `Lists every permission that you can test on a resource. A permission is testable if you can check whether a principal has that permission on the resource.`,
  category: "IAM",
  inputs: {
    default: {
      config: {
        fullResourceName: {
          name: "Full Resource Name",
          description:
            "Required. The full resource name to query from the list of testable permissions.  The name follows the Google Cloud Platform resource format. For example, a Cloud Platform project with id `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.",
          type: {
            type: "string",
            description:
              "Required. The full resource name to query from the list of testable permissions.  The name follows the Google Cloud Platform resource format. For example, a Cloud Platform project with id `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional limit on the number of permissions to include in the response.  The default is 100, and the maximum is 1,000.",
          type: {
            type: "integer",
            description:
              "Optional limit on the number of permissions to include in the response.  The default is 100, and the maximum is 1,000.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional pagination token returned in an earlier QueryTestablePermissionsRequest.",
          type: {
            type: "string",
            description:
              "Optional pagination token returned in an earlier QueryTestablePermissionsRequest.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.queryTestablePermissions(
            request,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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
          permissions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of this Permission.",
                },
                title: {
                  type: "string",
                  description: "The title of this Permission.",
                },
                description: {
                  type: "string",
                  description:
                    "A brief description of what this Permission is used for. This permission can ONLY be used in predefined roles.",
                },
                onlyInPredefinedRoles: {
                  type: "boolean",
                },
                stage: {
                  type: "string",
                  enum: ["ALPHA", "BETA", "GA", "DEPRECATED"],
                  description: "The current launch stage of the permission.",
                },
                customRolesSupportLevel: {
                  type: "string",
                  enum: ["SUPPORTED", "TESTING", "NOT_SUPPORTED"],
                  description: "The current custom role support level.",
                },
                apiDisabled: {
                  type: "boolean",
                  description:
                    "The service API associated with the permission is not enabled.",
                },
                primaryPermission: {
                  type: "string",
                  description:
                    "The preferred name for this permission. If present, then this permission is an alias of, and equivalent to, the listed primary_permission.",
                },
              },
              description: "A permission which can be included by a role.",
              additionalProperties: true,
            },
            description: "The Permissions testable on the requested resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "To retrieve the next page of results, set `QueryTestableRolesRequest.page_token` to this value.",
          },
        },
        description:
          "The response containing permissions which can be tested on a resource.",
        additionalProperties: true,
      },
    },
  },
};

export default queryTestablePermissions;
