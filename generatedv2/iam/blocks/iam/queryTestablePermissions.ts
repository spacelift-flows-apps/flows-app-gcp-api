import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient } from "../../lib/grpcClient.ts";

const queryTestablePermissions: AppBlock = {
  name: "Query Testable Permissions",
  description: `Lists every permission that you can test on a resource. A permission is testable if you can check whether a principal has that permission on the resource.`,
  category: "IAM",
  inputs: {
    default: {
      config: {
        full_resource_name: {
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
        page_size: {
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
        page_token: {
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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.full_resource_name !== undefined)
          request.full_resource_name =
            input.event.inputConfig.full_resource_name;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

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
                only_in_predefined_roles: {
                  type: "boolean",
                },
                stage: {
                  type: "string",
                  enum: ["ALPHA", "BETA", "GA", "DEPRECATED"],
                  description: "The current launch stage of the permission.",
                },
                custom_roles_support_level: {
                  type: "string",
                  enum: ["SUPPORTED", "TESTING", "NOT_SUPPORTED"],
                  description: "The current custom role support level.",
                },
                api_disabled: {
                  type: "boolean",
                  description:
                    "The service API associated with the permission is not enabled.",
                },
                primary_permission: {
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
          next_page_token: {
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
