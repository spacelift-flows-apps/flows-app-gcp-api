import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient } from "../../lib/grpcClient.ts";

const getRole: AppBlock = {
  name: "Get Role",
  description: `Gets the definition of a [Role][google.iam.admin.v1.Role].`,
  category: "Roles",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The `name` parameter's value depends on the target resource for the request, namely [`roles`](https://cloud.google.com/iam/reference/rest/v1/roles), [`projects`](https://cloud.google.com/iam/reference/rest/v1/projects.roles), or [`organizations`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below:  * [`roles.get()`](https://cloud.google.com/iam/reference/rest/v1/roles/get): `roles/{ROLE_NAME}`.   This method returns results from all   [predefined   roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles)   in Cloud IAM. Example request URL:   `https://iam.googleapis.com/v1/roles/{ROLE_NAME}`  * [`projects.roles.get()`](https://cloud.google.com/iam/reference/rest/v1/projects.roles/get):   `projects/{PROJECT_ID}/roles/{CUSTOM_ROLE_ID}`. This method returns only   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that   have been created at the project level. Example request URL:   `https://iam.googleapis.com/v1/projects/{PROJECT_ID}/roles/{CUSTOM_ROLE_ID}`  * [`organizations.roles.get()`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles/get):   `organizations/{ORGANIZATION_ID}/roles/{CUSTOM_ROLE_ID}`. This method   returns only [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that   have been created at the organization level. Example request URL:   `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID}/roles/{CUSTOM_ROLE_ID}`  Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.",
          type: {
            type: "string",
            description:
              "The `name` parameter's value depends on the target resource for the request, namely [`roles`](https://cloud.google.com/iam/reference/rest/v1/roles), [`projects`](https://cloud.google.com/iam/reference/rest/v1/projects.roles), or [`organizations`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles). Each resource type's `name` value format is described below:  * [`roles.get()`](https://cloud.google.com/iam/reference/rest/v1/roles/get): `roles/{ROLE_NAME}`.   This method returns results from all   [predefined   roles](https://cloud.google.com/iam/docs/understanding-roles#predefined_roles)   in Cloud IAM. Example request URL:   `https://iam.googleapis.com/v1/roles/{ROLE_NAME}`  * [`projects.roles.get()`](https://cloud.google.com/iam/reference/rest/v1/projects.roles/get):   `projects/{PROJECT_ID}/roles/{CUSTOM_ROLE_ID}`. This method returns only   [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that   have been created at the project level. Example request URL:   `https://iam.googleapis.com/v1/projects/{PROJECT_ID}/roles/{CUSTOM_ROLE_ID}`  * [`organizations.roles.get()`](https://cloud.google.com/iam/reference/rest/v1/organizations.roles/get):   `organizations/{ORGANIZATION_ID}/roles/{CUSTOM_ROLE_ID}`. This method   returns only [custom   roles](https://cloud.google.com/iam/docs/understanding-custom-roles) that   have been created at the organization level. Example request URL:   `https://iam.googleapis.com/v1/organizations/{ORGANIZATION_ID}/roles/{CUSTOM_ROLE_ID}`  Note: Wildcard (*) values are invalid; you must specify a complete project ID or organization ID.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getRole(request, (err: any, response: any) => {
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

export default getRole;
