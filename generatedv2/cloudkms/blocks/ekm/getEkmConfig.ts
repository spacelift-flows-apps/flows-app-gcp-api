import { AppBlock, events } from "@slflows/sdk/v1";
import { getEkmServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  default_ekm_connection: "defaultEkmConnection",
};

const getEkmConfig: AppBlock = {
  name: "Get Ekm Config",
  description: `Returns the [EkmConfig][google.cloud.kms.v1.EkmConfig] singleton resource for a given project and location.`,
  category: "EKM",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.EkmConfig.name] of the [EkmConfig][google.cloud.kms.v1.EkmConfig] to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.EkmConfig.name] of the [EkmConfig][google.cloud.kms.v1.EkmConfig] to get.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getEkmServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getEkmConfig(request, (err: any, response: any) => {
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
              "Output only. The resource name for the [EkmConfig][google.cloud.kms.v1.EkmConfig] in the format `projects/*/locations/*/ekmConfig`.",
          },
          defaultEkmConnection: {
            type: "string",
            description:
              "Optional. Resource name of the default [EkmConnection][google.cloud.kms.v1.EkmConnection]. Setting this field to the empty string removes the default.",
          },
        },
        description:
          "An [EkmConfig][google.cloud.kms.v1.EkmConfig] is a singleton resource that represents configuration parameters that apply to all [CryptoKeys][google.cloud.kms.v1.CryptoKey] and [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC] in a given project and location.",
        additionalProperties: true,
      },
    },
  },
};

export default getEkmConfig;
