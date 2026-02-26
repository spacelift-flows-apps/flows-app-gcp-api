import { AppBlock, events } from "@slflows/sdk/v1";
import { getEkmServiceClient } from "../../lib/grpcClient.ts";

const verifyConnectivity: AppBlock = {
  name: "Verify Connectivity",
  description: `Verifies that Cloud KMS can successfully connect to the external key manager specified by an [EkmConnection][google.cloud.kms.v1.EkmConnection]. If there is an error connecting to the EKM, this method returns a FAILED_PRECONDITION status containing structured information as described at https://cloud.google.com/kms/docs/reference/ekm_errors.`,
  category: "EKM",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.EkmConnection.name] of the [EkmConnection][google.cloud.kms.v1.EkmConnection] to verify.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.EkmConnection.name] of the [EkmConnection][google.cloud.kms.v1.EkmConnection] to verify.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getEkmServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.verifyConnectivity(request, (err: any, response: any) => {
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
        description:
          "Response message for [EkmService.VerifyConnectivity][google.cloud.kms.v1.EkmService.VerifyConnectivity].",
        additionalProperties: true,
      },
    },
  },
};

export default verifyConnectivity;
