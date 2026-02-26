import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const listImportJobs: AppBlock = {
  name: "List Import Jobs",
  description: `Lists [ImportJobs][google.cloud.kms.v1.ImportJob].`,
  category: "Import Jobs",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the [KeyRing][google.cloud.kms.v1.KeyRing] to list, in the format `projects/*/locations/*/keyRings/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [KeyRing][google.cloud.kms.v1.KeyRing] to list, in the format `projects/*/locations/*/keyRings/*`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of [ImportJobs][google.cloud.kms.v1.ImportJob] to include in the response. Further [ImportJobs][google.cloud.kms.v1.ImportJob] can subsequently be obtained by including the [ListImportJobsResponse.next_page_token][google.cloud.kms.v1.ListImportJobsResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. Optional limit on the number of [ImportJobs][google.cloud.kms.v1.ImportJob] to include in the response. Further [ImportJobs][google.cloud.kms.v1.ImportJob] can subsequently be obtained by including the [ListImportJobsResponse.next_page_token][google.cloud.kms.v1.ListImportJobsResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via [ListImportJobsResponse.next_page_token][google.cloud.kms.v1.ListImportJobsResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional. Optional pagination token, returned earlier via [ListImportJobsResponse.next_page_token][google.cloud.kms.v1.ListImportJobsResponse.next_page_token].",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.order_by !== undefined)
          request.order_by = input.event.inputConfig.order_by;

        const result = await new Promise<any>((resolve, reject) => {
          client.listImportJobs(request, (err: any, response: any) => {
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
          import_jobs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The resource name for this [ImportJob][google.cloud.kms.v1.ImportJob] in the format `projects/*/locations/*/keyRings/*/importJobs/*`.",
                },
                import_method: {
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
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                generate_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                expire_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                expire_event_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                    "Output only. The current state of the [ImportJob][google.cloud.kms.v1.ImportJob], indicating if it can be used.",
                },
                public_key: {
                  type: "object",
                  properties: {
                    pem: {
                      type: "string",
                      description:
                        "The public key, encoded in PEM format. For more information, see the [RFC 7468](https://tools.ietf.org/html/rfc7468) sections for [General Considerations](https://tools.ietf.org/html/rfc7468#section-2) and [Textual Encoding of Subject Public Key Info] (https://tools.ietf.org/html/rfc7468#section-13).",
                    },
                  },
                  description:
                    "The public key component of the wrapping key. For details of the type of key this public key corresponds to, see the [ImportMethod][google.cloud.kms.v1.ImportJob.ImportMethod].",
                  additionalProperties: true,
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
                crypto_key_backend: {
                  type: "string",
                  description:
                    'Immutable. The resource name of the backend environment where the key material for the wrapping key resides and where all related cryptographic operations are performed. Currently, this field is only populated for keys stored in HSM_SINGLE_TENANT. Note, this list is non-exhaustive and may apply to additional [ProtectionLevels][google.cloud.kms.v1.ProtectionLevel] in the future. Supported resources: * `"projects/*/locations/*/singleTenantHsmInstances/*"`',
                },
              },
              required: ["import_method", "protection_level"],
              description:
                'An [ImportJob][google.cloud.kms.v1.ImportJob] can be used to create [CryptoKeys][google.cloud.kms.v1.CryptoKey] and [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] using pre-existing key material, generated outside of Cloud KMS.  When an [ImportJob][google.cloud.kms.v1.ImportJob] is created, Cloud KMS will generate a "wrapping key", which is a public/private key pair. You use the wrapping key to encrypt (also known as wrap) the pre-existing key material to protect it during the import process. The nature of the wrapping key depends on the choice of [import_method][google.cloud.kms.v1.ImportJob.import_method]. When the wrapping key generation is complete, the [state][google.cloud.kms.v1.ImportJob.state] will be set to [ACTIVE][google.cloud.kms.v1.ImportJob.ImportJobState.ACTIVE] and the [public_key][google.cloud.kms.v1.ImportJob.public_key] can be fetched. The fetched public key can then be used to wrap your pre-existing key material.  Once the key material is wrapped, it can be imported into a new [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] in an existing [CryptoKey][google.cloud.kms.v1.CryptoKey] by calling [ImportCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.ImportCryptoKeyVersion]. Multiple [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] can be imported with a single [ImportJob][google.cloud.kms.v1.ImportJob]. Cloud KMS uses the private key portion of the wrapping key to unwrap the key material. Only Cloud KMS has access to the private key.  An [ImportJob][google.cloud.kms.v1.ImportJob] expires 3 days after it is created. Once expired, Cloud KMS will no longer be able to import or unwrap any key material that was wrapped with the [ImportJob][google.cloud.kms.v1.ImportJob]\'s public key.  For more information, see [Importing a key](https://cloud.google.com/kms/docs/importing-a-key).',
              additionalProperties: true,
            },
            description:
              "The list of [ImportJobs][google.cloud.kms.v1.ImportJob].",
          },
          next_page_token: {
            type: "string",
            description:
              "A token to retrieve next page of results. Pass this value in [ListImportJobsRequest.page_token][google.cloud.kms.v1.ListImportJobsRequest.page_token] to retrieve the next page of results.",
          },
          total_size: {
            type: "integer",
            description:
              "The total number of [ImportJobs][google.cloud.kms.v1.ImportJob] that matched the query.  This field is not populated if [ListImportJobsRequest.filter][google.cloud.kms.v1.ListImportJobsRequest.filter] is applied.",
          },
        },
        description:
          "Response message for [KeyManagementService.ListImportJobs][google.cloud.kms.v1.KeyManagementService.ListImportJobs].",
        additionalProperties: true,
      },
    },
  },
};

export default listImportJobs;
