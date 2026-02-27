import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  lengthBytes: "length_bytes",
  protectionLevel: "protection_level",
};

const outputMapping = {
  data_crc32c: "dataCrc32c",
};

const generateRandomBytes: AppBlock = {
  name: "Generate Random Bytes",
  description: `Generate random bytes using the Cloud KMS randomness source in the provided location.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        location: {
          name: "Location",
          description:
            'The project-specific location in which to generate random bytes. For example, "projects/my-project/locations/us-central1".',
          type: {
            type: "string",
            description:
              'The project-specific location in which to generate random bytes. For example, "projects/my-project/locations/us-central1".',
          },
          required: false,
        },
        lengthBytes: {
          name: "Length Bytes",
          description:
            "The length in bytes of the amount of randomness to retrieve.  Minimum 8 bytes, maximum 1024 bytes.",
          type: {
            type: "integer",
            description:
              "The length in bytes of the amount of randomness to retrieve.  Minimum 8 bytes, maximum 1024 bytes.",
          },
          required: false,
        },
        protectionLevel: {
          name: "Protection Level",
          description:
            "The [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] to use when generating the random data. Currently, only [HSM][google.cloud.kms.v1.ProtectionLevel.HSM] protection level is supported.",
          type: {
            type: "string",
            enum: [
              "PROTECTION_LEVEL_UNSPECIFIED",
              "SOFTWARE",
              "HSM",
              "EXTERNAL",
              "EXTERNAL_VPC",
              "HSM_SINGLE_TENANT",
            ],
            description:
              "[ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] specifies how cryptographic operations are performed. For more information, see [Protection levels] (https://cloud.google.com/kms/docs/algorithms#protection_levels).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.generateRandomBytes(request, (err: any, response: any) => {
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
          data: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          dataCrc32c: {
            type: "string",
            description: "64-bit integer as string",
          },
        },
        description:
          "Response message for [KeyManagementService.GenerateRandomBytes][google.cloud.kms.v1.KeyManagementService.GenerateRandomBytes].",
        additionalProperties: true,
      },
    },
  },
};

export default generateRandomBytes;
