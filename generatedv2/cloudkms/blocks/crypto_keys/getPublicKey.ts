import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const getPublicKey: AppBlock = {
  name: "Get Public Key",
  description: `Returns the public key for the given [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion]. The [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] must be [ASYMMETRIC_SIGN][google.cloud.kms.v1.CryptoKey.CryptoKeyPurpose.ASYMMETRIC_SIGN] or [ASYMMETRIC_DECRYPT][google.cloud.kms.v1.CryptoKey.CryptoKeyPurpose.ASYMMETRIC_DECRYPT].`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.CryptoKeyVersion.name] of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] public key to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.CryptoKeyVersion.name] of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] public key to get.",
          },
          required: true,
        },
        public_key_format: {
          name: "Public Key Format",
          description:
            "Optional. The [PublicKey][google.cloud.kms.v1.PublicKey] format specified by the user. This field is required for PQC algorithms. If specified, the public key will be exported through the [public_key][google.cloud.kms.v1.PublicKey.public_key] field in the requested format. Otherwise, the [pem][google.cloud.kms.v1.PublicKey.pem] field will be populated for non-PQC algorithms, and an error will be returned for PQC algorithms.",
          type: {
            type: "string",
            enum: [
              "PUBLIC_KEY_FORMAT_UNSPECIFIED",
              "PEM",
              "DER",
              "NIST_PQC",
              "XWING_RAW_BYTES",
            ],
            description:
              "Optional. The [PublicKey][google.cloud.kms.v1.PublicKey] format specified by the user. This field is required for PQC algorithms. If specified, the public key will be exported through the [public_key][google.cloud.kms.v1.PublicKey.public_key] field in the requested format. Otherwise, the [pem][google.cloud.kms.v1.PublicKey.pem] field will be populated for non-PQC algorithms, and an error will be returned for PQC algorithms.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.public_key_format !== undefined)
          request.public_key_format = input.event.inputConfig.public_key_format;

        const result = await new Promise<any>((resolve, reject) => {
          client.getPublicKey(request, (err: any, response: any) => {
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
          pem: {
            type: "string",
            description:
              "The public key, encoded in PEM format. For more information, see the [RFC 7468](https://tools.ietf.org/html/rfc7468) sections for [General Considerations](https://tools.ietf.org/html/rfc7468#section-2) and [Textual Encoding of Subject Public Key Info] (https://tools.ietf.org/html/rfc7468#section-13).",
          },
          algorithm: {
            type: "string",
            enum: [
              "CRYPTO_KEY_VERSION_ALGORITHM_UNSPECIFIED",
              "GOOGLE_SYMMETRIC_ENCRYPTION",
              "AES_128_GCM",
              "AES_256_GCM",
              "AES_128_CBC",
              "AES_256_CBC",
              "AES_128_CTR",
              "AES_256_CTR",
              "RSA_SIGN_PSS_2048_SHA256",
              "RSA_SIGN_PSS_3072_SHA256",
              "RSA_SIGN_PSS_4096_SHA256",
              "RSA_SIGN_PSS_4096_SHA512",
              "RSA_SIGN_PKCS1_2048_SHA256",
              "RSA_SIGN_PKCS1_3072_SHA256",
              "RSA_SIGN_PKCS1_4096_SHA256",
              "RSA_SIGN_PKCS1_4096_SHA512",
              "RSA_SIGN_RAW_PKCS1_2048",
              "RSA_SIGN_RAW_PKCS1_3072",
              "RSA_SIGN_RAW_PKCS1_4096",
              "RSA_DECRYPT_OAEP_2048_SHA256",
              "RSA_DECRYPT_OAEP_3072_SHA256",
              "RSA_DECRYPT_OAEP_4096_SHA256",
              "RSA_DECRYPT_OAEP_4096_SHA512",
              "RSA_DECRYPT_OAEP_2048_SHA1",
              "RSA_DECRYPT_OAEP_3072_SHA1",
              "RSA_DECRYPT_OAEP_4096_SHA1",
              "EC_SIGN_P256_SHA256",
              "EC_SIGN_P384_SHA384",
              "EC_SIGN_SECP256K1_SHA256",
              "EC_SIGN_ED25519",
              "HMAC_SHA256",
              "HMAC_SHA1",
              "HMAC_SHA384",
              "HMAC_SHA512",
              "HMAC_SHA224",
              "EXTERNAL_SYMMETRIC_ENCRYPTION",
              "ML_KEM_768",
              "ML_KEM_1024",
              "KEM_XWING",
              "PQ_SIGN_ML_DSA_44",
              "PQ_SIGN_ML_DSA_65",
              "PQ_SIGN_ML_DSA_87",
              "PQ_SIGN_SLH_DSA_SHA2_128S",
              "PQ_SIGN_HASH_SLH_DSA_SHA2_128S_SHA256",
              "PQ_SIGN_ML_DSA_44_EXTERNAL_MU",
              "PQ_SIGN_ML_DSA_65_EXTERNAL_MU",
              "PQ_SIGN_ML_DSA_87_EXTERNAL_MU",
            ],
            description:
              "The [Algorithm][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionAlgorithm] associated with this key.",
          },
          pem_crc32c: {
            type: "string",
            description: "64-bit integer as string",
          },
          name: {
            type: "string",
            description:
              "The [name][google.cloud.kms.v1.CryptoKeyVersion.name] of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] public key. Provided here for verification.  NOTE: This field is in Beta.",
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
          public_key_format: {
            type: "string",
            enum: [
              "PUBLIC_KEY_FORMAT_UNSPECIFIED",
              "PEM",
              "DER",
              "NIST_PQC",
              "XWING_RAW_BYTES",
            ],
            description:
              "The [PublicKey][google.cloud.kms.v1.PublicKey] format specified by the customer through the [public_key_format][google.cloud.kms.v1.GetPublicKeyRequest.public_key_format] field.",
          },
          public_key: {
            type: "object",
            properties: {
              data: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              crc32c_checksum: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            description: "Data with integrity verification field.",
            additionalProperties: true,
          },
        },
        description:
          "The public keys for a given [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion]. Obtained via [GetPublicKey][google.cloud.kms.v1.KeyManagementService.GetPublicKey].",
        additionalProperties: true,
      },
    },
  },
};

export default getPublicKey;
