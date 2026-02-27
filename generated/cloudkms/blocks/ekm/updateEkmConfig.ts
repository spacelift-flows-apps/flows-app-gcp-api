import { AppBlock, events } from "@slflows/sdk/v1";
import { getEkmServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  ekmConfig: {
    name: "ekm_config",
    fields: {
      defaultEkmConnection: "default_ekm_connection",
    },
  },
  updateMask: "update_mask",
};

const outputMapping = {
  default_ekm_connection: "defaultEkmConnection",
};

const updateEkmConfig: AppBlock = {
  name: "Update Ekm Config",
  description: `Updates the [EkmConfig][google.cloud.kms.v1.EkmConfig] singleton resource for a given project and location.`,
  category: "EKM",
  inputs: {
    default: {
      config: {
        ekmConfig: {
          name: "Ekm Config",
          description:
            "Required. [EkmConfig][google.cloud.kms.v1.EkmConfig] with updated values.",
          type: {
            type: "object",
            properties: {
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
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "Required. List of fields to be updated in this request.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getEkmServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.updateEkmConfig(request, (err: any, response: any) => {
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

export default updateEkmConfig;
