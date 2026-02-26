import { AppBlock, events } from "@slflows/sdk/v1";
import { getServicesClient } from "../../lib/grpcClient.ts";

const servicesTestIamPermissions: AppBlock = {
  name: "Services - Test IAM Permissions",
  description: `Returns permissions that a caller has on the specified Project. There are no permissions required for making this API call.`,
  category: "IAM",
  inputs: {
    default: {
      config: {
        resource: {
          name: "Resource",
          description: "Resource field",
          type: {
            type: "string",
          },
          required: false,
        },
        permissions: {
          name: "Permissions",
          description: "Permissions field",
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
        const client = await getServicesClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.resource !== undefined)
          request.resource = input.event.inputConfig.resource;
        if (input.event.inputConfig.permissions !== undefined)
          request.permissions = input.event.inputConfig.permissions;

        const result = await new Promise<any>((resolve, reject) => {
          client.testIamPermissions(request, (err: any, response: any) => {
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
          permissions: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default servicesTestIamPermissions;
