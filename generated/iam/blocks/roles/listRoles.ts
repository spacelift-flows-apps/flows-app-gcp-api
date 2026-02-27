import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
  showDeleted: "show_deleted",
};

const outputMapping = {
  roles: {
    name: "roles",
    fields: {
      included_permissions: "includedPermissions",
    },
  },
  next_page_token: "nextPageToken",
};

const listRoles: AppBlock = {
  name: "List Roles",
  description: `Lists every predefined [Role][google.iam.admin.v1.Role] that IAM supports, or every custom role that is defined for an organization or project.`,
  category: "Roles",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The `parent` parameter's value depends on the target resource for the request, namely [`roles`](https://cloud.google.com/iam/reference/rest/v1/roles), [`projects`](https://cloud.google.com/iam/reference/rest/v1/projects.roles), or [`organizations`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below:  * [`roles.list()`](https://cloud.google.com/iam/reference/rest/v1/roles/list): An empty string.   This method doesn't require a resource; it simply returns all   [predefined   roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles)   in Cloud IAM. Example request URL: `https://iam.googleapis.com/v1/roles`  * [`projects.roles.list()`](https://cloud.google.com/iam/reference/rest/v1/projects.roles/list):   `projects/{PROJECT_ID}`. This method lists all project-level   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/projects/{PROJECT_ID}/roles`  * [`organizations.roles.list()`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles/list):   `organizations/{ORGANIZATION_ID}`. This method lists all   organization-level [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID}/roles`  Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.",
          type: {
            type: "string",
            description:
              "The `parent` parameter's value depends on the target resource for the request, namely [`roles`](https://cloud.google.com/iam/reference/rest/v1/roles), [`projects`](https://cloud.google.com/iam/reference/rest/v1/projects.roles), or [`organizations`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles). Each resource type's `parent` value format is described below:  * [`roles.list()`](https://cloud.google.com/iam/reference/rest/v1/roles/list): An empty string.   This method doesn't require a resource; it simply returns all   [predefined   roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles)   in Cloud IAM. Example request URL: `https://iam.googleapis.com/v1/roles`  * [`projects.roles.list()`](https://cloud.google.com/iam/reference/rest/v1/projects.roles/list):   `projects/{PROJECT_ID}`. This method lists all project-level   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/projects/{PROJECT_ID}/roles`  * [`organizations.roles.list()`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles/list):   `organizations/{ORGANIZATION_ID}`. This method lists all   organization-level [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles).   Example request URL:   `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID}/roles`  Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.",
          },
          required: false,
        },
        pageSize: {
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
        pageToken: {
          name: "Page Token",
          description:
            "Optional pagination token returned in an earlier ListRolesResponse.",
          type: {
            type: "string",
            description:
              "Optional pagination token returned in an earlier ListRolesResponse.",
          },
          required: false,
        },
        view: {
          name: "View",
          description:
            "Optional view for the returned Role objects. When `FULL` is specified, the `includedPermissions` field is returned, which includes a list of all permissions in the role. The default value is `BASIC`, which does not return the `includedPermissions` field.",
          type: {
            type: "string",
            enum: ["BASIC", "FULL"],
            description: "A view for Role objects.",
          },
          required: false,
        },
        showDeleted: {
          name: "Show Deleted",
          description: "Include Roles that have been deleted.",
          type: {
            type: "boolean",
            description: "Include Roles that have been deleted.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listRoles(request, (err: any, response: any) => {
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
            description: "The Roles defined on this resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "To retrieve the next page of results, set `ListRolesRequest.page_token` to this value.",
          },
        },
        description:
          "The response containing the roles defined under a resource.",
        additionalProperties: true,
      },
    },
  },
};

export default listRoles;
