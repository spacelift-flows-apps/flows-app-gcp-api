import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  additionalAuthenticatedData: "additional_authenticated_data",
  plaintextCrc32c: "plaintext_crc32c",
  additionalAuthenticatedDataCrc32c: "additional_authenticated_data_crc32c",
};

const outputMapping = {
  ciphertext_crc32c: "ciphertextCrc32c",
  verified_plaintext_crc32c: "verifiedPlaintextCrc32c",
  verified_additional_authenticated_data_crc32c:
    "verifiedAdditionalAuthenticatedDataCrc32c",
  protection_level: "protectionLevel",
};

const encrypt: AppBlock = {
  name: "Encrypt",
  description: `Encrypts data, so that it can only be recovered by a call to [Decrypt][google.cloud.kms.v1.KeyManagementService.Decrypt]. The [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] must be [ENCRYPT_DECRYPT][google.cloud.kms.v1.CryptoKey.CryptoKeyPurpose.ENCRYPT_DECRYPT].`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [CryptoKey][google.cloud.kms.v1.CryptoKey] or [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for encryption.  If a [CryptoKey][google.cloud.kms.v1.CryptoKey] is specified, the server will use its [primary version][google.cloud.kms.v1.CryptoKey.primary].",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [CryptoKey][google.cloud.kms.v1.CryptoKey] or [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for encryption.  If a [CryptoKey][google.cloud.kms.v1.CryptoKey] is specified, the server will use its [primary version][google.cloud.kms.v1.CryptoKey.primary].",
          },
          required: true,
        },
        plaintext: {
          name: "Plaintext",
          description:
            "Required. The data to encrypt. Must be no larger than 64KiB.  The maximum size depends on the key version's [protection_level][google.cloud.kms.v1.CryptoKeyVersionTemplate.protection_level]. For [SOFTWARE][google.cloud.kms.v1.ProtectionLevel.SOFTWARE], [EXTERNAL][google.cloud.kms.v1.ProtectionLevel.EXTERNAL], and [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC] keys, the plaintext must be no larger than 64KiB. For [HSM][google.cloud.kms.v1.ProtectionLevel.HSM] keys, the combined length of the plaintext and additional_authenticated_data fields must be no larger than 8KiB.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        additionalAuthenticatedData: {
          name: "Additional Authenticated Data",
          description:
            "Optional. Optional data that, if specified, must also be provided during decryption through [DecryptRequest.additional_authenticated_data][google.cloud.kms.v1.DecryptRequest.additional_authenticated_data].  The maximum size depends on the key version's [protection_level][google.cloud.kms.v1.CryptoKeyVersionTemplate.protection_level]. For [SOFTWARE][google.cloud.kms.v1.ProtectionLevel.SOFTWARE], [EXTERNAL][google.cloud.kms.v1.ProtectionLevel.EXTERNAL], and [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC] keys the AAD must be no larger than 64KiB. For [HSM][google.cloud.kms.v1.ProtectionLevel.HSM] keys, the combined length of the plaintext and additional_authenticated_data fields must be no larger than 8KiB.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: false,
        },
        plaintextCrc32c: {
          name: "Plaintext Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [EncryptRequest.plaintext][google.cloud.kms.v1.EncryptRequest.plaintext]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [EncryptRequest.plaintext][google.cloud.kms.v1.EncryptRequest.plaintext] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([EncryptRequest.plaintext][google.cloud.kms.v1.EncryptRequest.plaintext]) is equal to [EncryptRequest.plaintext_crc32c][google.cloud.kms.v1.EncryptRequest.plaintext_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        additionalAuthenticatedDataCrc32c: {
          name: "Additional Authenticated Data Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [EncryptRequest.additional_authenticated_data][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [EncryptRequest.additional_authenticated_data][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([EncryptRequest.additional_authenticated_data][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data]) is equal to [EncryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
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
          client.encrypt(request, (err: any, response: any) => {
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
              "The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] used in encryption. Check this field to verify that the intended resource was used for encryption.",
          },
          ciphertext: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          ciphertextCrc32c: {
            type: "string",
            description: "64-bit integer as string",
          },
          verifiedPlaintextCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [EncryptRequest.plaintext_crc32c][google.cloud.kms.v1.EncryptRequest.plaintext_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [plaintext][google.cloud.kms.v1.EncryptRequest.plaintext]. A false value of this field indicates either that [EncryptRequest.plaintext_crc32c][google.cloud.kms.v1.EncryptRequest.plaintext_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [EncryptRequest.plaintext_crc32c][google.cloud.kms.v1.EncryptRequest.plaintext_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
          verifiedAdditionalAuthenticatedDataCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [EncryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [AAD][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data]. A false value of this field indicates either that [EncryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [EncryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.EncryptRequest.additional_authenticated_data_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
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
          "Response message for [KeyManagementService.Encrypt][google.cloud.kms.v1.KeyManagementService.Encrypt].",
        additionalProperties: true,
      },
    },
  },
};

export default encrypt;
