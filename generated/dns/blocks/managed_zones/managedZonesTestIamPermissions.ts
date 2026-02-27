import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const managedZonesTestIamPermissions: AppBlock = {
  name: "Managed Zones - Test IAM Permissions",
  description: `Returns permissions that a caller has on the specified resource. If the resource does not exist, this returns an empty set of permissions, not a 'NOT_FOUND' error. Note: This operation is designed to be used for building permission-aware UIs and command-line tools, not for authorization checking. This operation may "fail open" without warning.`,
  category: "Managed Zones",
  inputs: {
    default: {
      config: {
        resource: {
          name: "Resource",
          description:
            "REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.",
          type: {
            type: "string",
          },
          required: true,
        },
        permissions: {
          name: "Permissions",
          description:
            "The set of permissions to check for the `resource`. Permissions with wildcards (such as `*` or `storage.*`) are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
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

        const result = await dnsFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate: "dns/v1/{+resource}:testIamPermissions",
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
        description: "Response message for `TestIamPermissions` method.",
      },
    },
  },
};

export default managedZonesTestIamPermissions;
