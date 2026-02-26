import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const decapsulate: AppBlock = {
  name: "Decapsulate",
  description: `Decapsulates data that was encapsulated with a public key retrieved from [GetPublicKey][google.cloud.kms.v1.KeyManagementService.GetPublicKey] corresponding to a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] with [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] KEY_ENCAPSULATION.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for decapsulation.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for decapsulation.",
          },
          required: true,
        },
        ciphertext: {
          name: "Ciphertext",
          description:
            "Required. The ciphertext produced from encapsulation with the named [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] public key(s).",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        ciphertext_crc32c: {
          name: "Ciphertext Crc32c",
          description:
            "Optional. A CRC32C checksum of the [DecapsulateRequest.ciphertext][google.cloud.kms.v1.DecapsulateRequest.ciphertext]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [DecapsulateRequest.ciphertext][google.cloud.kms.v1.DecapsulateRequest.ciphertext] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([DecapsulateRequest.ciphertext][google.cloud.kms.v1.DecapsulateRequest.ciphertext]) is equal to [DecapsulateRequest.ciphertext_crc32c][google.cloud.kms.v1.DecapsulateRequest.ciphertext_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.ciphertext !== undefined)
          request.ciphertext = input.event.inputConfig.ciphertext;
        if (input.event.inputConfig.ciphertext_crc32c !== undefined)
          request.ciphertext_crc32c = input.event.inputConfig.ciphertext_crc32c;

        const result = await new Promise<any>((resolve, reject) => {
          client.decapsulate(request, (err: any, response: any) => {
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
              "The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] used for decapsulation. Check this field to verify that the intended resource was used for decapsulation.",
          },
          shared_secret: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          shared_secret_crc32c: {
            type: "string",
            description: "64-bit integer as string",
          },
          verified_ciphertext_crc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [DecapsulateRequest.ciphertext_crc32c][google.cloud.kms.v1.DecapsulateRequest.ciphertext_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [ciphertext][google.cloud.kms.v1.DecapsulateRequest.ciphertext]. A false value of this field indicates either that [DecapsulateRequest.ciphertext_crc32c][google.cloud.kms.v1.DecapsulateRequest.ciphertext_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [DecapsulateRequest.ciphertext_crc32c][google.cloud.kms.v1.DecapsulateRequest.ciphertext_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
          protection_level: {
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
        },
        description:
          "Response message for [KeyManagementService.Decapsulate][google.cloud.kms.v1.KeyManagementService.Decapsulate].",
        additionalProperties: true,
      },
    },
  },
};

export default decapsulate;
