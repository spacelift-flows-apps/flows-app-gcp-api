import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient } from "../../lib/grpcClient.ts";

const queryGrantableRoles: AppBlock = {
  name: "Query Grantable Roles",
  description: `Lists roles that can be granted on a Google Cloud resource. A role is grantable if the IAM policy for the resource can contain bindings to the role.`,
  category: "Roles",
  inputs: {
    default: {
      config: {
        full_resource_name: {
          name: "Full Resource Name",
          description:
            "Required. The full resource name to query from the list of grantable roles.  The name follows the Google Cloud Platform resource format. For example, a Cloud Platform project with id `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.",
          type: {
            type: "string",
            description:
              "Required. The full resource name to query from the list of grantable roles.  The name follows the Google Cloud Platform resource format. For example, a Cloud Platform project with id `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.",
          },
          required: true,
        },
        view: {
          name: "View",
          description: "View field",
          type: {
            type: "string",
            enum: ["BASIC", "FULL"],
            description: "A view for Role objects.",
          },
          required: false,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional limit on the number of roles to include in the response.  The default is 300, and the maximum is 1,000.",
          type: {
            type: "integer",
            description:
              "Optional limit on the number of roles to include in the response.  The default is 300, and the maximum is 1,000.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional pagination token returned in an earlier QueryGrantableRolesResponse.",
          type: {
            type: "string",
            description:
              "Optional pagination token returned in an earlier QueryGrantableRolesResponse.",
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
        if (input.event.inputConfig.view !== undefined)
          request.view = input.event.inputConfig.view;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.queryGrantableRoles(request, (err: any, response: any) => {
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
          roles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name of the role.  When Role is used in CreateRole, the role name must not be set.  When Role is used in output and other input such as UpdateRole, the role name is the complete path, e.g., roles/logging.viewer for predefined roles and organizations/{ORGANIZATION_ID}/roles/logging.viewer for custom roles.",
                },
                title: {
                  type: "string",
                  description:
                    "Optional. A human-readable title for the role.  Typically this is limited to 100 UTF-8 bytes.",
                },
                description: {
                  type: "string",
                  description:
                    "Optional. A human-readable description for the role.",
                },
                included_permissions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The names of the permissions this role grants when bound in an IAM policy.",
                },
                stage: {
                  type: "string",
                  enum: [
                    "ALPHA",
                    "BETA",
                    "GA",
                    "DEPRECATED",
                    "DISABLED",
                    "EAP",
                  ],
                  description:
                    "The current launch stage of the role. If the `ALPHA` launch stage has been selected for a role, the `stage` field will not be included in the returned definition for the role.",
                },
                etag: {
                  type: "string",
                  description: "Base64-encoded bytes",
                },
                deleted: {
                  type: "boolean",
                  description:
                    "The current deleted state of the role. This field is read only. It will be ignored in calls to CreateRole and UpdateRole.",
                },
              },
              description: "A role in the Identity and Access Management API.",
              additionalProperties: true,
            },
            description: "The list of matching roles.",
          },
          next_page_token: {
            type: "string",
            description:
              "To retrieve the next page of results, set `QueryGrantableRolesRequest.page_token` to this value.",
          },
        },
        description: "The grantable role query response.",
        additionalProperties: true,
      },
    },
  },
};

export default queryGrantableRoles;
