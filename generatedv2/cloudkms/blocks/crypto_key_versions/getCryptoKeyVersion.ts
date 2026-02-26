import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const getCryptoKeyVersion: AppBlock = {
  name: "Get Crypto Key Version",
  description: `Returns metadata for a given [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion].`,
  category: "Crypto Key Versions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.CryptoKeyVersion.name] of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.CryptoKeyVersion.name] of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] to get.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getCryptoKeyVersion(request, (err: any, response: any) => {
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
              "Output only. The resource name for this [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] in the format `projects/*/locations/*/keyRings/*/cryptoKeys/*/cryptoKeyVersions/*`.",
          },
          state: {
            type: "string",
            enum: [
              "CRYPTO_KEY_VERSION_STATE_UNSPECIFIED",
              "PENDING_GENERATION",
              "ENABLED",
              "DISABLED",
              "DESTROYED",
              "DESTROY_SCHEDULED",
              "PENDING_IMPORT",
              "IMPORT_FAILED",
              "GENERATION_FAILED",
              "PENDING_EXTERNAL_DESTRUCTION",
              "EXTERNAL_DESTRUCTION_FAILED",
            ],
            description:
              "The current state of the [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion].",
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
              "Output only. The [CryptoKeyVersionAlgorithm][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionAlgorithm] that this [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] supports.",
          },
          attestation: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: [
                  "ATTESTATION_FORMAT_UNSPECIFIED",
                  "CAVIUM_V1_COMPRESSED",
                  "CAVIUM_V2_COMPRESSED",
                ],
                description: "Output only. The format of the attestation data.",
              },
              content: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              cert_chains: {
                type: "object",
                properties: {
                  cavium_certs: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Cavium certificate chain corresponding to the attestation.",
                  },
                  google_card_certs: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Google card certificate chain corresponding to the attestation.",
                  },
                  google_partition_certs: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Google partition certificate chain corresponding to the attestation.",
                  },
                },
                description:
                  "Certificate chains needed to verify the attestation. Certificates in chains are PEM-encoded and are ordered based on https://tools.ietf.org/html/rfc5246#section-7.4.2.",
                additionalProperties: true,
              },
            },
            description:
              "Contains an HSM-generated attestation about a key operation. For more information, see [Verifying attestations] (https://cloud.google.com/kms/docs/attest-key).",
            additionalProperties: true,
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          generate_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          destroy_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          destroy_event_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          import_job: {
            type: "string",
            description:
              "Output only. The name of the [ImportJob][google.cloud.kms.v1.ImportJob] used in the most recent import of this [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion]. Only present if the underlying key material was imported.",
          },
          import_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          import_failure_reason: {
            type: "string",
            description:
              "Output only. The root cause of the most recent import failure. Only present if [state][google.cloud.kms.v1.CryptoKeyVersion.state] is [IMPORT_FAILED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.IMPORT_FAILED].",
          },
          generation_failure_reason: {
            type: "string",
            description:
              "Output only. The root cause of the most recent generation failure. Only present if [state][google.cloud.kms.v1.CryptoKeyVersion.state] is [GENERATION_FAILED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.GENERATION_FAILED].",
          },
          external_destruction_failure_reason: {
            type: "string",
            description:
              "Output only. The root cause of the most recent external destruction failure. Only present if [state][google.cloud.kms.v1.CryptoKeyVersion.state] is [EXTERNAL_DESTRUCTION_FAILED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.EXTERNAL_DESTRUCTION_FAILED].",
          },
          external_protection_level_options: {
            type: "object",
            properties: {
              external_key_uri: {
                type: "string",
                description:
                  "The URI for an external resource that this [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] represents.",
              },
              ekm_connection_key_path: {
                type: "string",
                description:
                  'The path to the external key material on the EKM when using [EkmConnection][google.cloud.kms.v1.EkmConnection] e.g., "v0/my/key". Set this field instead of external_key_uri when using an [EkmConnection][google.cloud.kms.v1.EkmConnection].',
              },
            },
            description:
              "ExternalProtectionLevelOptions stores a group of additional fields for configuring a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] that are specific to the [EXTERNAL][google.cloud.kms.v1.ProtectionLevel.EXTERNAL] protection level and [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC] protection levels.",
            additionalProperties: true,
          },
          reimport_eligible: {
            type: "boolean",
            description:
              "Output only. Whether or not this key version is eligible for reimport, by being specified as a target in [ImportCryptoKeyVersionRequest.crypto_key_version][google.cloud.kms.v1.ImportCryptoKeyVersionRequest.crypto_key_version].",
          },
        },
        description:
          "A [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] represents an individual cryptographic key, and the associated key material.  An [ENABLED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.ENABLED] version can be used for cryptographic operations.  For security reasons, the raw cryptographic key material represented by a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] can never be viewed or exported. It can only be used to encrypt, decrypt, or sign data when an authorized user or application invokes Cloud KMS.",
        additionalProperties: true,
      },
    },
  },
};

export default getCryptoKeyVersion;
