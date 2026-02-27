import { AppBlock, events } from "@slflows/sdk/v1";
import { getPermissionServiceClient } from "../../lib/grpcClient.ts";

const deletePermission: AppBlock = {
  name: "Delete Permission",
  description: `Deletes the permission.`,
  category: "Permissions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the permission. Formats:    `tunedModels/{tuned_model}/permissions/{permission}`    `corpora/{corpus}/permissions/{permission}`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the permission. Formats:    `tunedModels/{tuned_model}/permissions/{permission}`    `corpora/{corpus}/permissions/{permission}`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPermissionServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deletePermission(request, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deletePermission;
