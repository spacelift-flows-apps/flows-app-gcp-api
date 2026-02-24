import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const importJobsList: AppBlock = {
  name: "Import Jobs - List",
  description: `Lists ImportJobs.`,
  category: "Import Jobs",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the KeyRing to list, in the format `projects/*/locations/*/keyRings/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via ListImportJobsResponse.next_page_token.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of ImportJobs to include in the response. Further ImportJobs can subsequently be obtained by including the ListImportJobsResponse.next_page_token in a subsequent request. If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
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
        let path = `v1/{+parent}/importJobs`;

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
              "A token to retrieve next page of results. Pass this value in ListImportJobsRequest.page_token to retrieve the next page of results.",
          },
          totalSize: {
            type: "integer",
            description:
              "The total number of ImportJobs that matched the query. This field is not populated if ListImportJobsRequest.filter is applied. (Format: int32)",
          },
          importJobs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The resource name for this ImportJob in the format `projects/*/locations/*/keyRings/*/importJobs/*`.",
                },
                state: {
                  type: "string",
                  enum: [
                    "IMPORT_JOB_STATE_UNSPECIFIED",
                    "PENDING_GENERATION",
                    "ACTIVE",
                    "EXPIRED",
                  ],
                  description:
                    "Output only. The current state of the ImportJob, indicating if it can be used.",
                },
                importMethod: {
                  type: "string",
                  enum: [
                    "IMPORT_METHOD_UNSPECIFIED",
                    "RSA_OAEP_3072_SHA1_AES_256",
                    "RSA_OAEP_4096_SHA1_AES_256",
                    "RSA_OAEP_3072_SHA256_AES_256",
                    "RSA_OAEP_4096_SHA256_AES_256",
                    "RSA_OAEP_3072_SHA256",
                    "RSA_OAEP_4096_SHA256",
                  ],
                  description:
                    "Required. Immutable. The wrapping method to be used for incoming key material.",
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
                    "Required. Immutable. The protection level of the ImportJob. This must match the protection_level of the version_template on the CryptoKey you attempt to import into.",
                },
                expireEventTime: {
                  type: "string",
                  description:
                    "Output only. The time this ImportJob expired. Only present if state is EXPIRED. (Format: google-datetime)",
                },
                expireTime: {
                  type: "string",
                  description:
                    "Output only. The time at which this ImportJob is scheduled for expiration and can no longer be used to import key material. (Format: google-datetime)",
                },
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
                publicKey: {
                  type: "object",
                  properties: {
                    pem: {
                      type: "string",
                      description:
                        "The public key, encoded in PEM format. For more information, see the [RFC 7468](https://tools.ietf.org/html/rfc7468) sections for [General Considerations](https://tools.ietf.org/html/rfc7468#section-2) and [Textual Encoding of Subject Public Key Info] (https://tools.ietf.org/html/rfc7468#section-13).",
                    },
                  },
                  description:
                    "The public key component of the wrapping key. For details of the type of key this public key corresponds to, see the ImportMethod.",
                  additionalProperties: true,
                },
                generateTime: {
                  type: "string",
                  description:
                    "Output only. The time this ImportJob's key material was generated. (Format: google-datetime)",
                },
                createTime: {
                  type: "string",
                  description:
                    "Output only. The time at which this ImportJob was created. (Format: google-datetime)",
                },
              },
              description:
                'An ImportJob can be used to create CryptoKeys and CryptoKeyVersions using pre-existing key material, generated outside of Cloud KMS. When an ImportJob is created, Cloud KMS will generate a "wrapping key", which is a public/private key pair. You use the wrapping key to encrypt (also known as wrap) the pre-existing key material to protect it during the import process. The nature of the wrapping key depends on the choice of import_method. When the wrapping key generation is complete, the state will be set to ACTIVE and the public_key can be fetched. The fetched public key can then be used to wrap your pre-existing key material. Once the key material is wrapped, it can be imported into a new CryptoKeyVersion in an existing CryptoKey by calling ImportCryptoKeyVersion. Multiple CryptoKeyVersions can be imported with a single ImportJob. Cloud KMS uses the private key portion of the wrapping key to unwrap the key material. Only Cloud KMS has access to the private key. An ImportJob expires 3 days after it is created. Once expired, Cloud KMS will no longer be able to import or unwrap any key material that was wrapped with the ImportJob\'s public key. For more information, see [Importing a key](https://cloud.google.com/kms/docs/importing-a-key).',
              additionalProperties: true,
            },
            description: "The list of ImportJobs.",
          },
        },
        description:
          "Response message for KeyManagementService.ListImportJobs.",
        additionalProperties: true,
      },
    },
  },
};

export default importJobsList;
