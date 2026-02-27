import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  cryptoKeyId: "crypto_key_id",
  cryptoKey: {
    name: "crypto_key",
    fields: {
      nextRotationTime: "next_rotation_time",
      rotationPeriod: "rotation_period",
      versionTemplate: {
        name: "version_template",
        fields: {
          protectionLevel: "protection_level",
        },
      },
      importOnly: "import_only",
      destroyScheduledDuration: "destroy_scheduled_duration",
      cryptoKeyBackend: "crypto_key_backend",
      keyAccessJustificationsPolicy: {
        name: "key_access_justifications_policy",
        fields: {
          allowedAccessReasons: "allowed_access_reasons",
        },
      },
    },
  },
  skipInitialVersionCreation: "skip_initial_version_creation",
};

const outputMapping = {
  primary: {
    name: "primary",
    fields: {
      protection_level: "protectionLevel",
      attestation: {
        name: "attestation",
        fields: {
          cert_chains: {
            name: "certChains",
            fields: {
              cavium_certs: "caviumCerts",
              google_card_certs: "googleCardCerts",
              google_partition_certs: "googlePartitionCerts",
            },
          },
        },
      },
      create_time: "createTime",
      generate_time: "generateTime",
      destroy_time: "destroyTime",
      destroy_event_time: "destroyEventTime",
      import_job: "importJob",
      import_time: "importTime",
      import_failure_reason: "importFailureReason",
      generation_failure_reason: "generationFailureReason",
      external_destruction_failure_reason: "externalDestructionFailureReason",
      external_protection_level_options: {
        name: "externalProtectionLevelOptions",
        fields: {
          external_key_uri: "externalKeyUri",
          ekm_connection_key_path: "ekmConnectionKeyPath",
        },
      },
      reimport_eligible: "reimportEligible",
    },
  },
  create_time: "createTime",
  next_rotation_time: "nextRotationTime",
  rotation_period: "rotationPeriod",
  version_template: {
    name: "versionTemplate",
    fields: {
      protection_level: "protectionLevel",
    },
  },
  import_only: "importOnly",
  destroy_scheduled_duration: "destroyScheduledDuration",
  crypto_key_backend: "cryptoKeyBackend",
  key_access_justifications_policy: {
    name: "keyAccessJustificationsPolicy",
    fields: {
      allowed_access_reasons: "allowedAccessReasons",
    },
  },
};

const createCryptoKey: AppBlock = {
  name: "Create Crypto Key",
  description: `Create a new [CryptoKey][google.cloud.kms.v1.CryptoKey] within a [KeyRing][google.cloud.kms.v1.KeyRing]. [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] and [CryptoKey.version_template.algorithm][google.cloud.kms.v1.CryptoKeyVersionTemplate.algorithm] are required.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The [name][google.cloud.kms.v1.KeyRing.name] of the KeyRing associated with the [CryptoKeys][google.cloud.kms.v1.CryptoKey].",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.KeyRing.name] of the KeyRing associated with the [CryptoKeys][google.cloud.kms.v1.CryptoKey].",
          },
          required: true,
        },
        cryptoKeyId: {
          name: "Crypto Key Id",
          description:
            "Required. It must be unique within a KeyRing and match the regular expression `[a-zA-Z0-9_-]{1,63}`",
          type: {
            type: "string",
            description:
              "Required. It must be unique within a KeyRing and match the regular expression `[a-zA-Z0-9_-]{1,63}`",
          },
          required: true,
        },
        cryptoKey: {
          name: "Crypto Key",
          description:
            "Required. A [CryptoKey][google.cloud.kms.v1.CryptoKey] with initial field values.",
          type: {
            type: "object",
            properties: {
              purpose: {
                type: "string",
                enum: [
                  "CRYPTO_KEY_PURPOSE_UNSPECIFIED",
                  "ENCRYPT_DECRYPT",
                  "ASYMMETRIC_SIGN",
                  "ASYMMETRIC_DECRYPT",
                  "RAW_ENCRYPT_DECRYPT",
                  "MAC",
                  "KEY_ENCAPSULATION",
                ],
                description:
                  "Immutable. The immutable purpose of this [CryptoKey][google.cloud.kms.v1.CryptoKey].",
              },
              nextRotationTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              rotationPeriod: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              versionTemplate: {
                type: "object",
                properties: {
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
                      "Required. [Algorithm][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionAlgorithm] to use when creating a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] based on this template.  For backwards compatibility, GOOGLE_SYMMETRIC_ENCRYPTION is implied if both this field is omitted and [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] is [ENCRYPT_DECRYPT][google.cloud.kms.v1.CryptoKey.CryptoKeyPurpose.ENCRYPT_DECRYPT].",
                  },
                },
                required: ["algorithm"],
                description:
                  "A [CryptoKeyVersionTemplate][google.cloud.kms.v1.CryptoKeyVersionTemplate] specifies the properties to use when creating a new [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion], either manually with [CreateCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.CreateCryptoKeyVersion] or automatically as a result of auto-rotation.",
                additionalProperties: true,
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Labels with user-defined metadata. For more information, see [Labeling Keys](https://cloud.google.com/kms/docs/labeling-keys).",
              },
              importOnly: {
                type: "boolean",
                description:
                  "Immutable. Whether this key may contain imported versions only.",
              },
              destroyScheduledDuration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              cryptoKeyBackend: {
                type: "string",
                description:
                  "Immutable. The resource name of the backend environment where the key material for all [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] associated with this [CryptoKey][google.cloud.kms.v1.CryptoKey] reside and where all related cryptographic operations are performed. Only applicable if [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] have a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC], with the resource name in the format `projects/*/locations/*/ekmConnections/*`. Only applicable if [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] have a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [HSM_SINGLE_TENANT][google.cloud.kms.v1.ProtectionLevel.HSM_SINGLE_TENANT], with the resource name in the format `projects/*/locations/*/singleTenantHsmInstances/*`. Note, this list is non-exhaustive and may apply to additional [ProtectionLevels][google.cloud.kms.v1.ProtectionLevel] in the future.",
              },
              keyAccessJustificationsPolicy: {
                type: "object",
                properties: {
                  allowedAccessReasons: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: [
                        "REASON_UNSPECIFIED",
                        "CUSTOMER_INITIATED_SUPPORT",
                        "GOOGLE_INITIATED_SERVICE",
                        "THIRD_PARTY_DATA_REQUEST",
                        "GOOGLE_INITIATED_REVIEW",
                        "CUSTOMER_INITIATED_ACCESS",
                        "GOOGLE_INITIATED_SYSTEM_OPERATION",
                        "REASON_NOT_EXPECTED",
                        "MODIFIED_CUSTOMER_INITIATED_ACCESS",
                        "MODIFIED_GOOGLE_INITIATED_SYSTEM_OPERATION",
                        "GOOGLE_RESPONSE_TO_PRODUCTION_ALERT",
                        "CUSTOMER_AUTHORIZED_WORKFLOW_SERVICING",
                      ],
                      description:
                        "Describes the reason for a data access. Please refer to https://cloud.google.com/assured-workloads/key-access-justifications/docs/justification-codes for the detailed semantic meaning of justification reason codes.",
                    },
                    description:
                      "The list of allowed reasons for access to a [CryptoKey][google.cloud.kms.v1.CryptoKey]. Zero allowed access reasons means all encrypt, decrypt, and sign operations for the [CryptoKey][google.cloud.kms.v1.CryptoKey] associated with this policy will fail.",
                  },
                },
                description:
                  "A [KeyAccessJustificationsPolicy][google.cloud.kms.v1.KeyAccessJustificationsPolicy] specifies zero or more allowed [AccessReason][google.cloud.kms.v1.AccessReason] values for encrypt, decrypt, and sign operations on a [CryptoKey][google.cloud.kms.v1.CryptoKey].",
                additionalProperties: true,
              },
            },
            description:
              "A [CryptoKey][google.cloud.kms.v1.CryptoKey] represents a logical key that can be used for cryptographic operations.  A [CryptoKey][google.cloud.kms.v1.CryptoKey] is made up of zero or more [versions][google.cloud.kms.v1.CryptoKeyVersion], which represent the actual key material used in cryptographic operations.",
            additionalProperties: true,
          },
          required: true,
        },
        skipInitialVersionCreation: {
          name: "Skip Initial Version Creation",
          description:
            "If set to true, the request will create a [CryptoKey][google.cloud.kms.v1.CryptoKey] without any [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion]. You must manually call [CreateCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.CreateCryptoKeyVersion] or [ImportCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.ImportCryptoKeyVersion] before you can use this [CryptoKey][google.cloud.kms.v1.CryptoKey].",
          type: {
            type: "boolean",
            description:
              "If set to true, the request will create a [CryptoKey][google.cloud.kms.v1.CryptoKey] without any [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion]. You must manually call [CreateCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.CreateCryptoKeyVersion] or [ImportCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.ImportCryptoKeyVersion] before you can use this [CryptoKey][google.cloud.kms.v1.CryptoKey].",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createCryptoKey(request, (err: any, response: any) => {
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
              "Output only. The resource name for this [CryptoKey][google.cloud.kms.v1.CryptoKey] in the format `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
          },
          primary: {
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
                    description:
                      "Output only. The format of the attestation data.",
                  },
                  content: {
                    type: "string",
                    description: "Base64-encoded bytes",
                  },
                  certChains: {
                    type: "object",
                    properties: {
                      caviumCerts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Cavium certificate chain corresponding to the attestation.",
                      },
                      googleCardCerts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Google card certificate chain corresponding to the attestation.",
                      },
                      googlePartitionCerts: {
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
              createTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              generateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              destroyTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              destroyEventTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              importJob: {
                type: "string",
                description:
                  "Output only. The name of the [ImportJob][google.cloud.kms.v1.ImportJob] used in the most recent import of this [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion]. Only present if the underlying key material was imported.",
              },
              importTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              importFailureReason: {
                type: "string",
                description:
                  "Output only. The root cause of the most recent import failure. Only present if [state][google.cloud.kms.v1.CryptoKeyVersion.state] is [IMPORT_FAILED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.IMPORT_FAILED].",
              },
              generationFailureReason: {
                type: "string",
                description:
                  "Output only. The root cause of the most recent generation failure. Only present if [state][google.cloud.kms.v1.CryptoKeyVersion.state] is [GENERATION_FAILED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.GENERATION_FAILED].",
              },
              externalDestructionFailureReason: {
                type: "string",
                description:
                  "Output only. The root cause of the most recent external destruction failure. Only present if [state][google.cloud.kms.v1.CryptoKeyVersion.state] is [EXTERNAL_DESTRUCTION_FAILED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.EXTERNAL_DESTRUCTION_FAILED].",
              },
              externalProtectionLevelOptions: {
                type: "object",
                properties: {
                  externalKeyUri: {
                    type: "string",
                    description:
                      "The URI for an external resource that this [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] represents.",
                  },
                  ekmConnectionKeyPath: {
                    type: "string",
                    description:
                      'The path to the external key material on the EKM when using [EkmConnection][google.cloud.kms.v1.EkmConnection] e.g., "v0/my/key". Set this field instead of external_key_uri when using an [EkmConnection][google.cloud.kms.v1.EkmConnection].',
                  },
                },
                description:
                  "ExternalProtectionLevelOptions stores a group of additional fields for configuring a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] that are specific to the [EXTERNAL][google.cloud.kms.v1.ProtectionLevel.EXTERNAL] protection level and [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC] protection levels.",
                additionalProperties: true,
              },
              reimportEligible: {
                type: "boolean",
                description:
                  "Output only. Whether or not this key version is eligible for reimport, by being specified as a target in [ImportCryptoKeyVersionRequest.crypto_key_version][google.cloud.kms.v1.ImportCryptoKeyVersionRequest.crypto_key_version].",
              },
            },
            description:
              "A [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] represents an individual cryptographic key, and the associated key material.  An [ENABLED][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionState.ENABLED] version can be used for cryptographic operations.  For security reasons, the raw cryptographic key material represented by a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] can never be viewed or exported. It can only be used to encrypt, decrypt, or sign data when an authorized user or application invokes Cloud KMS.",
            additionalProperties: true,
          },
          purpose: {
            type: "string",
            enum: [
              "CRYPTO_KEY_PURPOSE_UNSPECIFIED",
              "ENCRYPT_DECRYPT",
              "ASYMMETRIC_SIGN",
              "ASYMMETRIC_DECRYPT",
              "RAW_ENCRYPT_DECRYPT",
              "MAC",
              "KEY_ENCAPSULATION",
            ],
            description:
              "Immutable. The immutable purpose of this [CryptoKey][google.cloud.kms.v1.CryptoKey].",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          nextRotationTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          rotationPeriod: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          versionTemplate: {
            type: "object",
            properties: {
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
                  "Required. [Algorithm][google.cloud.kms.v1.CryptoKeyVersion.CryptoKeyVersionAlgorithm] to use when creating a [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] based on this template.  For backwards compatibility, GOOGLE_SYMMETRIC_ENCRYPTION is implied if both this field is omitted and [CryptoKey.purpose][google.cloud.kms.v1.CryptoKey.purpose] is [ENCRYPT_DECRYPT][google.cloud.kms.v1.CryptoKey.CryptoKeyPurpose.ENCRYPT_DECRYPT].",
              },
            },
            required: ["algorithm"],
            description:
              "A [CryptoKeyVersionTemplate][google.cloud.kms.v1.CryptoKeyVersionTemplate] specifies the properties to use when creating a new [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion], either manually with [CreateCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.CreateCryptoKeyVersion] or automatically as a result of auto-rotation.",
            additionalProperties: true,
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels with user-defined metadata. For more information, see [Labeling Keys](https://cloud.google.com/kms/docs/labeling-keys).",
          },
          importOnly: {
            type: "boolean",
            description:
              "Immutable. Whether this key may contain imported versions only.",
          },
          destroyScheduledDuration: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          cryptoKeyBackend: {
            type: "string",
            description:
              "Immutable. The resource name of the backend environment where the key material for all [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] associated with this [CryptoKey][google.cloud.kms.v1.CryptoKey] reside and where all related cryptographic operations are performed. Only applicable if [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] have a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC], with the resource name in the format `projects/*/locations/*/ekmConnections/*`. Only applicable if [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] have a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [HSM_SINGLE_TENANT][google.cloud.kms.v1.ProtectionLevel.HSM_SINGLE_TENANT], with the resource name in the format `projects/*/locations/*/singleTenantHsmInstances/*`. Note, this list is non-exhaustive and may apply to additional [ProtectionLevels][google.cloud.kms.v1.ProtectionLevel] in the future.",
          },
          keyAccessJustificationsPolicy: {
            type: "object",
            properties: {
              allowedAccessReasons: {
                type: "array",
                items: {
                  type: "string",
                  enum: [
                    "REASON_UNSPECIFIED",
                    "CUSTOMER_INITIATED_SUPPORT",
                    "GOOGLE_INITIATED_SERVICE",
                    "THIRD_PARTY_DATA_REQUEST",
                    "GOOGLE_INITIATED_REVIEW",
                    "CUSTOMER_INITIATED_ACCESS",
                    "GOOGLE_INITIATED_SYSTEM_OPERATION",
                    "REASON_NOT_EXPECTED",
                    "MODIFIED_CUSTOMER_INITIATED_ACCESS",
                    "MODIFIED_GOOGLE_INITIATED_SYSTEM_OPERATION",
                    "GOOGLE_RESPONSE_TO_PRODUCTION_ALERT",
                    "CUSTOMER_AUTHORIZED_WORKFLOW_SERVICING",
                  ],
                  description:
                    "Describes the reason for a data access. Please refer to https://cloud.google.com/assured-workloads/key-access-justifications/docs/justification-codes for the detailed semantic meaning of justification reason codes.",
                },
                description:
                  "The list of allowed reasons for access to a [CryptoKey][google.cloud.kms.v1.CryptoKey]. Zero allowed access reasons means all encrypt, decrypt, and sign operations for the [CryptoKey][google.cloud.kms.v1.CryptoKey] associated with this policy will fail.",
              },
            },
            description:
              "A [KeyAccessJustificationsPolicy][google.cloud.kms.v1.KeyAccessJustificationsPolicy] specifies zero or more allowed [AccessReason][google.cloud.kms.v1.AccessReason] values for encrypt, decrypt, and sign operations on a [CryptoKey][google.cloud.kms.v1.CryptoKey].",
            additionalProperties: true,
          },
        },
        description:
          "A [CryptoKey][google.cloud.kms.v1.CryptoKey] represents a logical key that can be used for cryptographic operations.  A [CryptoKey][google.cloud.kms.v1.CryptoKey] is made up of zero or more [versions][google.cloud.kms.v1.CryptoKeyVersion], which represent the actual key material used in cryptographic operations.",
        additionalProperties: true,
      },
    },
  },
};

export default createCryptoKey;
