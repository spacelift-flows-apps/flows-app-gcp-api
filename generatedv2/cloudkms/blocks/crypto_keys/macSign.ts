import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const macSign: AppBlock = {
  name: "Mac Sign",
  description: `Signs data using a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] with [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] MAC, producing a tag that can be verified by another source with the same key.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for signing.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to use for signing.",
          },
          required: true,
        },
        data: {
          name: "Data",
          description:
            "Required. The data to sign. The MAC tag is computed over this data field based on the specific algorithm.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
        data_crc32c: {
          name: "Data Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [MacSignRequest.data][google.cloud.kms.v1.MacSignRequest.data]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [MacSignRequest.data][google.cloud.kms.v1.MacSignRequest.data] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([MacSignRequest.data][google.cloud.kms.v1.MacSignRequest.data]) is equal to [MacSignRequest.data_crc32c][google.cloud.kms.v1.MacSignRequest.data_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
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
        if (input.event.inputConfig.data !== undefined)
          request.data = input.event.inputConfig.data;
        if (input.event.inputConfig.data_crc32c !== undefined)
          request.data_crc32c = input.event.inputConfig.data_crc32c;

        const result = await new Promise<any>((resolve, reject) => {
          client.macSign(request, (err: any, response: any) => {
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
              "The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] used for signing. Check this field to verify that the intended resource was used for signing.",
          },
          mac: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          mac_crc32c: {
            type: "string",
            description: "64-bit integer as string",
          },
          verified_data_crc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [MacSignRequest.data_crc32c][google.cloud.kms.v1.MacSignRequest.data_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [data][google.cloud.kms.v1.MacSignRequest.data]. A false value of this field indicates either that [MacSignRequest.data_crc32c][google.cloud.kms.v1.MacSignRequest.data_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [MacSignRequest.data_crc32c][google.cloud.kms.v1.MacSignRequest.data_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
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
          "Response message for [KeyManagementService.MacSign][google.cloud.kms.v1.KeyManagementService.MacSign].",
        additionalProperties: true,
      },
    },
  },
};

export default macSign;
