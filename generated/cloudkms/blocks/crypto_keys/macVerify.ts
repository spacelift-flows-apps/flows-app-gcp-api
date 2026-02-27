import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  dataCrc32c: "data_crc32c",
  macCrc32c: "mac_crc32c",
};

const outputMapping = {
  verified_data_crc32c: "verifiedDataCrc32c",
  verified_mac_crc32c: "verifiedMacCrc32c",
  verified_success_integrity: "verifiedSuccessIntegrity",
  protection_level: "protectionLevel",
};

const macVerify: AppBlock = {
  name: "Mac Verify",
  description: `Verifies MAC tag using a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] with [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] MAC, and returns a response that indicates whether or not the verification was successful.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for verification.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for verification.",
          },
          required: true,
        },
        data: {
          name: "Data",
          description:
            "Required. The data used previously as a [MacSignRequest.data][google.cloud.kms.v1.MacSignRequest.data] to generate the MAC tag.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        dataCrc32c: {
          name: "Data Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [MacVerifyRequest.data][google.cloud.kms.v1.MacVerifyRequest.data]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [MacVerifyRequest.data][google.cloud.kms.v1.MacVerifyRequest.data] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([MacVerifyRequest.data][google.cloud.kms.v1.MacVerifyRequest.data]) is equal to [MacVerifyRequest.data_crc32c][google.cloud.kms.v1.MacVerifyRequest.data_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        mac: {
          name: "Mac",
          description: "Required. The signature to verify.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        macCrc32c: {
          name: "Mac Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [MacVerifyRequest.mac][google.cloud.kms.v1.MacVerifyRequest.mac]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [MacVerifyRequest.mac][google.cloud.kms.v1.MacVerifyRequest.mac] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([MacVerifyRequest.mac][google.cloud.kms.v1.MacVerifyRequest.mac]) is equal to [MacVerifyRequest.mac_crc32c][google.cloud.kms.v1.MacVerifyRequest.mac_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
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
          client.macVerify(request, (err: any, response: any) => {
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
              "The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] used for verification. Check this field to verify that the intended resource was used for verification.",
          },
          success: {
            type: "boolean",
            description:
              "This field indicates whether or not the verification operation for [MacVerifyRequest.mac][google.cloud.kms.v1.MacVerifyRequest.mac] over [MacVerifyRequest.data][google.cloud.kms.v1.MacVerifyRequest.data] was successful.",
          },
          verifiedDataCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [MacVerifyRequest.data_crc32c][google.cloud.kms.v1.MacVerifyRequest.data_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [data][google.cloud.kms.v1.MacVerifyRequest.data]. A false value of this field indicates either that [MacVerifyRequest.data_crc32c][google.cloud.kms.v1.MacVerifyRequest.data_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [MacVerifyRequest.data_crc32c][google.cloud.kms.v1.MacVerifyRequest.data_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
          verifiedMacCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [MacVerifyRequest.mac_crc32c][google.cloud.kms.v1.MacVerifyRequest.mac_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [data][google.cloud.kms.v1.MacVerifyRequest.mac]. A false value of this field indicates either that [MacVerifyRequest.mac_crc32c][google.cloud.kms.v1.MacVerifyRequest.mac_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [MacVerifyRequest.mac_crc32c][google.cloud.kms.v1.MacVerifyRequest.mac_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
          verifiedSuccessIntegrity: {
            type: "boolean",
            description:
              "Integrity verification field. This value is used for the integrity verification of [MacVerifyResponse.success]. If the value of this field contradicts the value of [MacVerifyResponse.success], discard the response and perform a limited number of retries.",
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
          "Response message for [KeyManagementService.MacVerify][google.cloud.kms.v1.KeyManagementService.MacVerify].",
        additionalProperties: true,
      },
    },
  },
};

export default macVerify;
