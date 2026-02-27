import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getPermissionServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  emailAddress: "email_address",
};

const transferOwnership: AppBlock = {
  name: "Transfer Ownership",
  description: `Transfers ownership of the tuned model. This is the only way to change ownership of the tuned model. The current owner will be downgraded to writer role.`,
  category: "Permissions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the tuned model to transfer ownership.  Format: `tunedModels/my-model-id`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the tuned model to transfer ownership.  Format: `tunedModels/my-model-id`",
          },
          required: true,
        },
        emailAddress: {
          name: "Email Address",
          description:
            "Required. The email address of the user to whom the tuned model is being transferred to.",
          type: {
            type: "string",
            description:
              "Required. The email address of the user to whom the tuned model is being transferred to.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPermissionServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.transferOwnership(request, (err: any, response: any) => {
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
        description: "Response from `TransferOwnership`.",
        additionalProperties: true,
      },
    },
  },
};

export default transferOwnership;
