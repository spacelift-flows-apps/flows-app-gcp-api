import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  digestCrc32c: "digest_crc32c",
  dataCrc32c: "data_crc32c",
};

const outputMapping = {
  signature_crc32c: "signatureCrc32c",
  verified_digest_crc32c: "verifiedDigestCrc32c",
  verified_data_crc32c: "verifiedDataCrc32c",
  protection_level: "protectionLevel",
};

const asymmetricSign: AppBlock = {
  name: "Asymmetric Sign",
  description: `Signs data using a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] with [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] ASYMMETRIC_SIGN, producing a signature that can be verified with the public key retrieved from [GetPublicKey][google.cloud.kms.v1.KeyManagementService.GetPublicKey].`,
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
        digest: {
          name: "Digest",
          description:
            "Optional. The digest of the data to sign. The digest must be produced with the same digest algorithm as specified by the key version's [algorithm][google.cloud.kms.v1.CryptoKeyVersion.algorithm].  This field may not be supplied if [AsymmetricSignRequest.data][google.cloud.kms.v1.AsymmetricSignRequest.data] is supplied.",
          type: {
            type: "object",
            properties: {
              sha256: {
                type: "string",
                description:
                  "Base64-encoded bytes (Part of 'digest' - only one field in this group can be set)",
              },
              sha384: {
                type: "string",
                description:
                  "Base64-encoded bytes (Part of 'digest' - only one field in this group can be set)",
              },
              sha512: {
                type: "string",
                description:
                  "Base64-encoded bytes (Part of 'digest' - only one field in this group can be set)",
              },
            },
            description:
              "A [Digest][google.cloud.kms.v1.Digest] holds a cryptographic message digest.",
            additionalProperties: true,
          },
          required: false,
        },
        digestCrc32c: {
          name: "Digest Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [AsymmetricSignRequest.digest][google.cloud.kms.v1.AsymmetricSignRequest.digest]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [AsymmetricSignRequest.digest][google.cloud.kms.v1.AsymmetricSignRequest.digest] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([AsymmetricSignRequest.digest][google.cloud.kms.v1.AsymmetricSignRequest.digest]) is equal to [AsymmetricSignRequest.digest_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.digest_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        data: {
          name: "Data",
          description:
            "Optional. The data to sign. It can't be supplied if [AsymmetricSignRequest.digest][google.cloud.kms.v1.AsymmetricSignRequest.digest] is supplied.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: false,
        },
        dataCrc32c: {
          name: "Data Crc32c",
          description:
            "Optional. An optional CRC32C checksum of the [AsymmetricSignRequest.data][google.cloud.kms.v1.AsymmetricSignRequest.data]. If specified, [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will verify the integrity of the received [AsymmetricSignRequest.data][google.cloud.kms.v1.AsymmetricSignRequest.data] using this checksum. [KeyManagementService][google.cloud.kms.v1.KeyManagementService] will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C([AsymmetricSignRequest.data][google.cloud.kms.v1.AsymmetricSignRequest.data]) is equal to [AsymmetricSignRequest.data_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.data_crc32c], and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type.",
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
          client.asymmetricSign(request, (err: any, response: any) => {
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
          signature: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          signatureCrc32c: {
            type: "string",
            description: "64-bit integer as string",
          },
          verifiedDigestCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [AsymmetricSignRequest.digest_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.digest_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [digest][google.cloud.kms.v1.AsymmetricSignRequest.digest]. A false value of this field indicates either that [AsymmetricSignRequest.digest_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.digest_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [AsymmetricSignRequest.digest_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.digest_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
          },
          name: {
            type: "string",
            description:
              "The resource name of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] used for signing. Check this field to verify that the intended resource was used for signing.",
          },
          verifiedDataCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether [AsymmetricSignRequest.data_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.data_crc32c] was received by [KeyManagementService][google.cloud.kms.v1.KeyManagementService] and used for the integrity verification of the [data][google.cloud.kms.v1.AsymmetricSignRequest.data]. A false value of this field indicates either that [AsymmetricSignRequest.data_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.data_crc32c] was left unset or that it was not delivered to [KeyManagementService][google.cloud.kms.v1.KeyManagementService]. If you've set [AsymmetricSignRequest.data_crc32c][google.cloud.kms.v1.AsymmetricSignRequest.data_crc32c] but this field is still false, discard the response and perform a limited number of retries.",
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
          "Response message for [KeyManagementService.AsymmetricSign][google.cloud.kms.v1.KeyManagementService.AsymmetricSign].",
        additionalProperties: true,
      },
    },
  },
};

export default asymmetricSign;
