import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  roleId: "role_id",
  role: {
    name: "role",
    fields: {
      includedPermissions: "included_permissions",
    },
  },
};

const outputMapping = {
  included_permissions: "includedPermissions",
};

const createRole: AppBlock = {
  name: "Create Role",
  description: `Creates a new custom [Role][google.iam.admin.v1.Role].`,
  category: "Roles",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The `parent` parameter's value depends on the target resource for the request, namely [`projects`](https://cloud.google.com/iam/reference/rest/v1/projects.roles) or [`organizations`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below:  * [`projects.roles.create()`](https://cloud.google.com/iam/reference/rest/v1/projects.roles/create):   `projects/{PROJECT_ID}`. This method creates project-level   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/projects/{PROJECT_ID}/roles`  * [`organizations.roles.create()`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles/create):   `organizations/{ORGANIZATION_ID}`. This method creates organization-level   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID}/roles`  Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.",
          type: {
            type: "string",
            description:
              "The `parent` parameter's value depends on the target resource for the request, namely [`projects`](https://cloud.google.com/iam/reference/rest/v1/projects.roles) or [`organizations`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below:  * [`projects.roles.create()`](https://cloud.google.com/iam/reference/rest/v1/projects.roles/create):   `projects/{PROJECT_ID}`. This method creates project-level   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/projects/{PROJECT_ID}/roles`  * [`organizations.roles.create()`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles/create):   `organizations/{ORGANIZATION_ID}`. This method creates organization-level   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID}/roles`  Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.",
          },
          required: false,
        },
        roleId: {
          name: "Role Id",
          description:
            "The role ID to use for this role.  A role ID may contain alphanumeric characters, underscores (`_`), and periods (`.`). It must contain a minimum of 3 characters and a maximum of 64 characters.",
          type: {
            type: "string",
            description:
              "The role ID to use for this role.  A role ID may contain alphanumeric characters, underscores (`_`), and periods (`.`). It must contain a minimum of 3 characters and a maximum of 64 characters.",
          },
          required: false,
        },
        role: {
          name: "Role",
          description: "The Role resource to create.",
          type: {
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
              includedPermissions: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The names of the permissions this role grants when bound in an IAM policy.",
              },
              stage: {
                type: "string",
                enum: ["ALPHA", "BETA", "GA", "DEPRECATED", "DISABLED", "EAP"],
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
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createRole(request, (err: any, response: any) => {
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
              "The name of the role.  When Role is used in CreateRole, the role name must not be set.  When Role is used in output and other input such as UpdateRole, the role name is the complete path, e.g., roles/logging.viewer for predefined roles and organizations/{ORGANIZATION_ID}/roles/logging.viewer for custom roles.",
          },
          title: {
            type: "string",
            description:
              "Optional. A human-readable title for the role.  Typically this is limited to 100 UTF-8 bytes.",
          },
          description: {
            type: "string",
            description: "Optional. A human-readable description for the role.",
          },
          includedPermissions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The names of the permissions this role grants when bound in an IAM policy.",
          },
          stage: {
            type: "string",
            enum: ["ALPHA", "BETA", "GA", "DEPRECATED", "DISABLED", "EAP"],
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
    },
  },
};

export default createRole;
