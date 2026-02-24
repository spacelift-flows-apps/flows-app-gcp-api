import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const cryptoKeyVersionsList: AppBlock = {
  name: "Crypto Key Versions - List",
  description: `Lists CryptoKeyVersions.`,
  category: "Crypto Key Versions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the CryptoKey to list, in the format `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of CryptoKeyVersions to include in the response. Further CryptoKeyVersions can subsequently be obtained by including the ListCryptoKeyVersionsResponse.next_page_token in a subsequent request. If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
          },
          required: false,
        },
        view: {
          name: "View",
          description: "The fields to include in the response.",
          type: {
            type: "string",
            enum: ["CRYPTO_KEY_VERSION_VIEW_UNSPECIFIED", "FULL"],
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via ListCryptoKeyVersionsResponse.next_page_token.",
          type: {
            type: "string",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
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
        let path = `v1/{+parent}/cryptoKeyVersions`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          nextPageToken: {
            type: "string",
            description:
              "A token to retrieve next page of results. Pass this value in ListCryptoKeyVersionsRequest.page_token to retrieve the next page of results.",
          },
          cryptoKeyVersions: {
            type: "array",
            items: {
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
            description: "The list of CryptoKeyVersions.",
          },
          totalSize: {
            type: "integer",
            description:
              "The total number of CryptoKeyVersions that matched the query. This field is not populated if ListCryptoKeyVersionsRequest.filter is applied. (Format: int32)",
          },
        },
        description:
          "Response message for KeyManagementService.ListCryptoKeyVersions.",
        additionalProperties: true,
      },
    },
  },
};

export default cryptoKeyVersionsList;
