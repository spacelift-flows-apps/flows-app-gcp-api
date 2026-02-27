import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const cryptoKeysUpdatePrimaryVersion: AppBlock = {
  name: "Crypto Keys - Update Primary Version",
  description: `Update the version of a CryptoKey that will be used in Encrypt.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the CryptoKey to update.",
          type: {
            type: "string",
          },
          required: true,
        },
        cryptoKeyVersionId: {
          name: "Crypto Key Version ID",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The id of the child CryptoKeyVersion to use as primary.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/cloudkms",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://cloudkms.googleapis.com/";
        let path = `v1/{+name}:updatePrimaryVersion`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.cryptoKeyVersionId !== undefined)
          requestBody.cryptoKeyVersionId =
            input.event.inputConfig.cryptoKeyVersionId;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
          );
        }

        const result = await response.json();
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
          createTime: {
            type: "string",
            description:
              "Output only. The time at which this CryptoKey was created. (Format: google-datetime)",
          },
          primary: {
            type: "object",
            properties: {
              attestation: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "Output only. The attestation data provided by the HSM when the key operation was performed. (Format: byte)",
                  },
                  certChains: {
                    type: "object",
                    properties: {
                      googlePartitionCerts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Google partition certificate chain corresponding to the attestation.",
                      },
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
                    },
                    description:
                      "Certificate chains needed to verify the attestation. Certificates in chains are PEM-encoded and are ordered based on https://tools.ietf.org/html/rfc5246#section-7.4.2.",
                    additionalProperties: true,
                  },
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
                },
                description:
                  "Contains an HSM-generated attestation about a key operation. For more information, see [Verifying attestations] (https://cloud.google.com/kms/docs/attest-key).",
                additionalProperties: true,
              },
              reimportEligible: {
                type: "boolean",
                description:
                  "Output only. Whether or not this key version is eligible for reimport, by being specified as a target in ImportCryptoKeyVersionRequest.crypto_key_version.",
              },
              externalDestructionFailureReason: {
                type: "string",
                description:
                  "Output only. The root cause of the most recent external destruction failure. Only present if state is EXTERNAL_DESTRUCTION_FAILED.",
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
                ],
                description:
                  "Output only. The CryptoKeyVersionAlgorithm that this CryptoKeyVersion supports.",
              },
              protectionLevel: {
                type: "string",
                enum: [
                  "PROTECTION_LEVEL_UNSPECIFIED",
                  "SOFTWARE",
                  "HSM",
                  "EXTERNAL",
                  "EXTERNAL_VPC",
                ],
                description:
                  "Output only. The ProtectionLevel describing how crypto operations are performed with this CryptoKeyVersion.",
              },
              generateTime: {
                type: "string",
                description:
                  "Output only. The time this CryptoKeyVersion's key material was generated. (Format: google-datetime)",
              },
              importTime: {
                type: "string",
                description:
                  "Output only. The time at which this CryptoKeyVersion's key material was most recently imported. (Format: google-datetime)",
              },
              externalProtectionLevelOptions: {
                type: "object",
                properties: {
                  ekmConnectionKeyPath: {
                    type: "string",
                    description:
                      'The path to the external key material on the EKM when using EkmConnection e.g., "v0/my/key". Set this field instead of external_key_uri when using an EkmConnection.',
                  },
                  externalKeyUri: {
                    type: "string",
                    description:
                      "The URI for an external resource that this CryptoKeyVersion represents.",
                  },
                },
                description:
                  "ExternalProtectionLevelOptions stores a group of additional fields for configuring a CryptoKeyVersion that are specific to the EXTERNAL protection level and EXTERNAL_VPC protection levels.",
                additionalProperties: true,
              },
              importFailureReason: {
                type: "string",
                description:
                  "Output only. The root cause of the most recent import failure. Only present if state is IMPORT_FAILED.",
              },
              generationFailureReason: {
                type: "string",
                description:
                  "Output only. The root cause of the most recent generation failure. Only present if state is GENERATION_FAILED.",
              },
              importJob: {
                type: "string",
                description:
                  "Output only. The name of the ImportJob used in the most recent import of this CryptoKeyVersion. Only present if the underlying key material was imported.",
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
                description: "The current state of the CryptoKeyVersion.",
              },
              destroyTime: {
                type: "string",
                description:
                  "Output only. The time this CryptoKeyVersion's key material is scheduled for destruction. Only present if state is DESTROY_SCHEDULED. (Format: google-datetime)",
              },
              destroyEventTime: {
                type: "string",
                description:
                  "Output only. The time this CryptoKeyVersion's key material was destroyed. Only present if state is DESTROYED. (Format: google-datetime)",
              },
              name: {
                type: "string",
                description:
                  "Output only. The resource name for this CryptoKeyVersion in the format `projects/*/locations/*/keyRings/*/cryptoKeys/*/cryptoKeyVersions/*`.",
              },
              createTime: {
                type: "string",
                description:
                  "Output only. The time at which this CryptoKeyVersion was created. (Format: google-datetime)",
              },
            },
            description:
              "A CryptoKeyVersion represents an individual cryptographic key, and the associated key material. An ENABLED version can be used for cryptographic operations. For security reasons, the raw cryptographic key material represented by a CryptoKeyVersion can never be viewed or exported. It can only be used to encrypt, decrypt, or sign data when an authorized user or application invokes Cloud KMS.",
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
            description: "Immutable. The immutable purpose of this CryptoKey.",
          },
          importOnly: {
            type: "boolean",
            description:
              "Immutable. Whether this key may contain imported versions only.",
          },
          nextRotationTime: {
            type: "string",
            description:
              "At next_rotation_time, the Key Management Service will automatically: 1. Create a new version of this CryptoKey. 2. Mark the new version as primary. Key rotations performed manually via CreateCryptoKeyVersion and UpdateCryptoKeyPrimaryVersion do not affect next_rotation_time. Keys with purpose ENCRYPT_DECRYPT support automatic rotation. For other keys, this field must be omitted. (Format: google-datetime)",
          },
          destroyScheduledDuration: {
            type: "string",
            description:
              "Immutable. The period of time that versions of this key spend in the DESTROY_SCHEDULED state before transitioning to DESTROYED. If not specified at creation time, the default duration is 30 days. (Format: google-duration)",
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
                ],
                description:
                  "ProtectionLevel to use when creating a CryptoKeyVersion based on this template. Immutable. Defaults to SOFTWARE.",
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
                ],
                description:
                  "Required. Algorithm to use when creating a CryptoKeyVersion based on this template. For backwards compatibility, GOOGLE_SYMMETRIC_ENCRYPTION is implied if both this field is omitted and CryptoKey.purpose is ENCRYPT_DECRYPT.",
              },
            },
            description:
              "A CryptoKeyVersionTemplate specifies the properties to use when creating a new CryptoKeyVersion, either manually with CreateCryptoKeyVersion or automatically as a result of auto-rotation.",
            additionalProperties: true,
          },
          rotationPeriod: {
            type: "string",
            description:
              "next_rotation_time will be advanced by this period when the service automatically rotates a key. Must be at least 24 hours and at most 876,000 hours. If rotation_period is set, next_rotation_time must also be set. Keys with purpose ENCRYPT_DECRYPT support automatic rotation. For other keys, this field must be omitted. (Format: google-duration)",
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
                },
                description:
                  "The list of allowed reasons for access to a CryptoKey. Zero allowed access reasons means all encrypt, decrypt, and sign operations for the CryptoKey associated with this policy will fail.",
              },
            },
            description:
              "A KeyAccessJustificationsPolicy specifies zero or more allowed AccessReason values for encrypt, decrypt, and sign operations on a CryptoKey.",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "Output only. The resource name for this CryptoKey in the format `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
          },
          cryptoKeyBackend: {
            type: "string",
            description:
              "Immutable. The resource name of the backend environment where the key material for all CryptoKeyVersions associated with this CryptoKey reside and where all related cryptographic operations are performed. Only applicable if CryptoKeyVersions have a ProtectionLevel of EXTERNAL_VPC, with the resource name in the format `projects/*/locations/*/ekmConnections/*`. Note, this list is non-exhaustive and may apply to additional ProtectionLevels in the future.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels with user-defined metadata. For more information, see [Labeling Keys](https://cloud.google.com/kms/docs/labeling-keys).",
          },
        },
        description:
          "A CryptoKey represents a logical key that can be used for cryptographic operations. A CryptoKey is made up of zero or more versions, which represent the actual key material used in cryptographic operations.",
        additionalProperties: true,
      },
    },
  },
};

export default cryptoKeysUpdatePrimaryVersion;
