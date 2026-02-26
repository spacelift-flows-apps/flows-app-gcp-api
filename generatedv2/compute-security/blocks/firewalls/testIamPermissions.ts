import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const testIamPermissions: AppBlock = {
  name: "Firewalls - Test IAM Permissions",
  description: `Returns permissions that a caller has on the specified resource.`,
  category: "Firewalls",
  inputs: {
    default: {
      config: {
        resource: {
          name: "Resource",
          description: "Name or id of the resource for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        permissions: {
          name: "Permissions",
          description:
            "The set of permissions to check for the 'resource'. Permissions with wildcards (such as '*' or 'storage.*') are not allowed.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The set of permissions to check for the 'resource'. Permissions with wildcards (such as '*' or 'storage.*') are not allowed.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.resource !== undefined)
          pathParams["resource"] = String(input.event.inputConfig.resource);

        const body: Record<string, any> = {};
        if (input.event.inputConfig.permissions !== undefined)
          body.permissions = input.event.inputConfig.permissions;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/global/firewalls/{resource}/testIamPermissions",
          pathParams,
          body: Object.keys(body).length > 0 ? body : undefined,
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
              type: "string",
            },
            description:
              "A subset of `TestPermissionsRequest.permissions` that the caller is allowed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default testIamPermissions;
