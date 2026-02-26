import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const rawDecrypt: AppBlock = {
  name: "Raw Decrypt",
  description: `Decrypts data that was originally encrypted using a raw cryptographic mechanism. The [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] must be [RAW_ENCRYPT_DECRYPT][google.cloud.kms.v1.CryptoKey.CryptoKeyPurpose.RAW_ENCRYPT_DECRYPT].`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for decryption.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for decryption.",
          },
          required: true,
        },
        ciphertext: {
          name: "Ciphertext",
          description:
            "Required. The encrypted data originally returned in [RawEncryptResponse.ciphertext][google.cloud.kms.v1.RawEncryptResponse.ciphertext].",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        additional_authenticated_data: {
          name: "Additional Authenticated Data",
          description:
            "Optional. Optional data that must match the data originally supplied in [RawEncryptRequest.additional_authenticated_data][google.cloud.kms.v1.RawEncryptRequest.additional_authenticated_data].",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: false,
        },
        initialization_vector: {
          name: "Initialization Vector",
          description:
            "Required. The initialization vector (IV) used during encryption, which must match the data originally provided in [RawEncryptResponse.initialization_vector][google.cloud.kms.v1.RawEncryptResponse.initialization_vector].",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        tag_length: {
          name: "Tag Length",
          description:
            "The length of the authentication tag that is appended to the end of the ciphertext. If unspecified (0), the default value for the key's algorithm will be used (for AES-GCM, the default value is 16).",
          type: {
            type: "integer",
            description:
              "The length of the authentication tag that is appended to the end of the ciphertext. If unspecified (0), the default value for the key's algorithm will be used (for AES-GCM, the default value is 16).",
          },
          required: false,
        },
        ciphertext_crc32c: {
          name: "Ciphertext Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [RawDecryptRequest.ciphertext][google.cloud.kms.v1.RawDecryptRequest.ciphertext]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received ciphertext using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(ciphertext) is equal to ciphertext_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        additional_authenticated_data_crc32c: {
          name: "Additional Authenticated Data Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [RawDecryptRequest.additional_authenticated_data][google.cloud.kms.v1.RawDecryptRequest.additional_authenticated_data]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received additional_authenticated_data using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(additional_authenticated_data) is equal to additional_authenticated_data_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        initialization_vector_crc32c: {
          name: "Initialization Vector Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [RawDecryptRequest.initialization_vector][google.cloud.kms.v1.RawDecryptRequest.initialization_vector]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received initialization_vector using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(initialization_vector) is equal to initialization_vector_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
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
        if (input.event.inputConfig.additional_authenticated_data !== undefined)
          request.additional_authenticated_data =
            input.event.inputConfig.additional_authenticated_data;
        if (input.event.inputConfig.initialization_vector !== undefined)
          request.initialization_vector =
            input.event.inputConfig.initialization_vector;
        if (input.event.inputConfig.tag_length !== undefined)
          request.tag_length = input.event.inputConfig.tag_length;
        if (input.event.inputConfig.ciphertext_crc32c !== undefined)
          request.ciphertext_crc32c = input.event.inputConfig.ciphertext_crc32c;
        if (
          input.event.inputConfig.additional_authenticated_data_crc32c !==
          undefined
        )
          request.additional_authenticated_data_crc32c =
            input.event.inputConfig.additional_authenticated_data_crc32c;
        if (input.event.inputConfig.initialization_vector_crc32c !== undefined)
          request.initialization_vector_crc32c =
            input.event.inputConfig.initialization_vector_crc32c;

        const result = await new Promise<any>((resolve, reject) => {
          client.rawDecrypt(request, (err: any, response: any) => {
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
          plaintext: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          plaintext_crc32c: {
            type: "string",
            description: "64-bit integer as string",
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
          verified_ciphertext_crc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [RawDecryptRequest.ciphertext_crc32c][google.cloud.kms.v1.RawDecryptRequest.ciphertext_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the ciphertext. A false value of this field indicates either that [RawDecryptRequest.ciphertext_crc32c][google.cloud.kms.v1.RawDecryptRequest.ciphertext_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [RawDecryptRequest.ciphertext_crc32c][google.cloud.kms.v1.RawDecryptRequest.ciphertext_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
          verified_additional_authenticated_data_crc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [RawDecryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.RawDecryptRequest.additional_authenticated_data_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of additional_authenticated_data. A false value of this field indicates either that // [RawDecryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.RawDecryptRequest.additional_authenticated_data_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [RawDecryptRequest.additional_authenticated_data_crc32c][google.cloud.kms.v1.RawDecryptRequest.additional_authenticated_data_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
          verified_initialization_vector_crc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [RawDecryptRequest.initialization_vector_crc32c][google.cloud.kms.v1.RawDecryptRequest.initialization_vector_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of initialization_vector. A false value of this field indicates either that [RawDecryptRequest.initialization_vector_crc32c][google.cloud.kms.v1.RawDecryptRequest.initialization_vector_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [RawDecryptRequest.initialization_vector_crc32c][google.cloud.kms.v1.RawDecryptRequest.initialization_vector_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
        },
        description:
          "Response message for [KeyManagementService.RawDecrypt][google.cloud.kms.v1.KeyManagementService.RawDecrypt].",
        additionalProperties: true,
      },
    },
  },
};

export default rawDecrypt;
