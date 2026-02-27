import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  additionalAuthenticatedData: "additional_authenticated_data",
  ciphertextCrc32c: "ciphertext_crc32c",
  additionalAuthenticatedDataCrc32c: "additional_authenticated_data_crc32c",
};

const outputMapping = {
  plaintext_crc32c: "plaintextCrc32c",
  used_primary: "usedPrimary",
  protection_level: "protectionLevel",
};

const decrypt: AppBlock = {
  name: "Decrypt",
  description: `Decrypts data that was protected by [Encrypt][google.cloud.kms.v1.KeyManagementService.Encrypt]. The [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] must be [ENCRYPT_DECRYPT][google.cloud.kms.v1.CryptoKey.CryptoKeyPurpose.ENCRYPT_DECRYPT].`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [CryptoKey][google.cloud.kms.v1.CryptoKey] to use for decryption. The server will choose the appropriate version.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [CryptoKey][google.cloud.kms.v1.CryptoKey] to use for decryption. The server will choose the appropriate version.",
          },
          required: true,
        },
        ciphertext: {
          name: "Ciphertext",
          description:
            "Required. The encrypted data originally returned in [EncryptResponse.ciphertext][google.cloud.kms.v1.EncryptResponse.ciphertext].",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        additionalAuthenticatedData: {
          name: "Additional Authenticated Data",
          description:
            "Optional. Optional data that must match the data originally supplied in [EncryptRequest.additional_authenticated_data][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data].",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: false,
        },
        ciphertextCrc32c: {
          name: "Ciphertext Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [DecryptRequest.ciphertext][google.cloud.kms.v1.DecryptRequest.ciphertext]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [DecryptRequest.ciphertext][google.cloud.kms.v1.DecryptRequest.ciphertext] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([DecryptRequest.ciphertext][google.cloud.kms.v1.DecryptRequest.ciphertext]) is equal to [DecryptRequest.ciphertext_crc32c][google.cloud.kms.v1.DecryptRequest.ciphertext_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        additionalAuthenticatedDataCrc32c: {
          name: "Additional Authenticated Data Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [DecryptRequest.additional_authenticated_data][google.cloud.kms.v1.DecryptRequest.additional_authenticated_data]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [DecryptRequest.additional_authenticated_data][google.cloud.kms.v1.DecryptRequest.additional_authenticated_data] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([DecryptRequest.additional_authenticated_data][google.cloud.kms.v1.DecryptRequest.additional_authenticated_data]) is equal to [DecryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.DecryptRequest.additional_authenticated_data_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.decrypt(request, (err: any, response: any) => {
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
          plaintext: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          plaintextCrc32c: {
            type: "string",
            description: "64-bit integer as string",
          },
          usedPrimary: {
            type: "boolean",
            description:
              "Whether the Decryption was performed using the primary key version.",
          },
          protectionLevel: {
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
          "Response message for [KeyManagementService.Decrypt][google.cloud.kms.v1.KeyManagementService.Decrypt].",
        additionalProperties: true,
      },
    },
  },
};

export default decrypt;
