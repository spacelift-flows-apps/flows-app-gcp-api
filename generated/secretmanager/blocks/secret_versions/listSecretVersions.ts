import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSecretManagerServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  versions: {
    name: "versions",
    fields: {
      create_time: "createTime",
      destroy_time: "destroyTime",
      replication_status: {
        name: "replicationStatus",
        fields: {
          automatic: {
            name: "automatic",
            fields: {
              customer_managed_encryption: {
                name: "customerManagedEncryption",
                fields: {
                  kms_key_version_name: "kmsKeyVersionName",
                },
              },
            },
          },
          user_managed: {
            name: "userManaged",
            fields: {
              replicas: {
                name: "replicas",
                fields: {
                  customer_managed_encryption: {
                    name: "customerManagedEncryption",
                    fields: {
                      kms_key_version_name: "kmsKeyVersionName",
                    },
                  },
                },
              },
            },
          },
        },
      },
      client_specified_payload_checksum: "clientSpecifiedPayloadChecksum",
      scheduled_destroy_time: "scheduledDestroyTime",
      customer_managed_encryption: {
        name: "customerManagedEncryption",
        fields: {
          kms_key_version_name: "kmsKeyVersionName",
        },
      },
    },
  },
  next_page_token: "nextPageToken",
  total_size: "totalSize",
};

const listSecretVersions: AppBlock = {
  name: "List Secret Versions",
  description: `Lists [SecretVersions][google.cloud.secretmanager.v1.SecretVersion]. This call does not return secret data.`,
  category: "Secret Versions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret] associated with the [SecretVersions][google.cloud.secretmanager.v1.SecretVersion] to list, in the format `projects/*/secrets/*` or `projects/*/locations/*/secrets/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret] associated with the [SecretVersions][google.cloud.secretmanager.v1.SecretVersion] to list, in the format `projects/*/secrets/*` or `projects/*/locations/*/secrets/*`.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of results to be returned in a single page. If set to 0, the server decides the number of results to return. If the number is greater than 25000, it is capped at 25000.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of results to be returned in a single page. If set to 0, the server decides the number of results to return. If the number is greater than 25000, it is capped at 25000.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. Pagination token, returned earlier via ListSecretVersionsResponse.next_page_token][].",
          type: {
            type: "string",
            description:
              "Optional. Pagination token, returned earlier via ListSecretVersionsResponse.next_page_token][].",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Filter string, adhering to the rules in [List-operation filtering](https://cloud.google.com/secret-manager/docs/filtering). List only secret versions matching the filter. If filter is empty, all secret versions are listed.",
          type: {
            type: "string",
            description:
              "Optional. Filter string, adhering to the rules in [List-operation filtering](https://cloud.google.com/secret-manager/docs/filtering). List only secret versions matching the filter. If filter is empty, all secret versions are listed.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSecretManagerServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listSecretVersions(request, (err: any, response: any) => {
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
          versions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The resource name of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] in the format `projects/*/secrets/*/versions/*`.  [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] IDs in a [Secret][google.cloud.secretmanager.v1.Secret] start at 1 and are incremented for each subsequent version of the secret.",
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                destroyTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                state: {
                  type: "string",
                  enum: [
                    "STATE_UNSPECIFIED",
                    "ENABLED",
                    "DISABLED",
                    "DESTROYED",
                  ],
                  description:
                    "Output only. The current state of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
                },
                replicationStatus: {
                  type: "object",
                  properties: {
                    automatic: {
                      type: "object",
                      properties: {
                        customerManagedEncryption: {
                          type: "object",
                          properties: {
                            kmsKeyVersionName: {
                              type: "string",
                              description:
                                "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                            },
                          },
                          required: ["kmsKeyVersionName"],
                          description:
                            "Describes the status of customer-managed encryption.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "The replication status of a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] using automatic replication.  Only populated if the parent [Secret][google.cloud.secretmanager.v1.Secret] has an automatic replication policy. (Part of 'replication_status' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    userManaged: {
                      type: "object",
                      properties: {
                        replicas: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              location: {
                                type: "string",
                                description:
                                  'Output only. The canonical ID of the replica location. For example: `"us-east1"`.',
                              },
                              customerManagedEncryption: {
                                type: "object",
                                properties: {
                                  kmsKeyVersionName: {
                                    type: "string",
                                    description:
                                      "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                                  },
                                },
                                required: ["kmsKeyVersionName"],
                                description:
                                  "Describes the status of customer-managed encryption.",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "Describes the status of a user-managed replica for the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
                            additionalProperties: true,
                          },
                          description:
                            "Output only. The list of replica statuses for the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
                        },
                      },
                      description:
                        "The replication status of a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] using user-managed replication.  Only populated if the parent [Secret][google.cloud.secretmanager.v1.Secret] has a user-managed replication policy. (Part of 'replication_status' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "The replication status of a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
                  additionalProperties: true,
                },
                etag: {
                  type: "string",
                  description:
                    "Output only. Etag of the currently stored [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
                },
                clientSpecifiedPayloadChecksum: {
                  type: "boolean",
                  description:
                    "Output only. True if payload checksum specified in [SecretPayload][google.cloud.secretmanager.v1.SecretPayload] object has been received by [SecretManagerService][google.cloud.secretmanager.v1.SecretManagerService] on [SecretManagerService.AddSecretVersion][google.cloud.secretmanager.v1.SecretManagerService.AddSecretVersion].",
                },
                scheduledDestroyTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                customerManagedEncryption: {
                  type: "object",
                  properties: {
                    kmsKeyVersionName: {
                      type: "string",
                      description:
                        "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                    },
                  },
                  required: ["kmsKeyVersionName"],
                  description:
                    "Describes the status of customer-managed encryption.",
                  additionalProperties: true,
                },
              },
              description:
                "A secret version resource in the Secret Manager API.",
              additionalProperties: true,
            },
            description:
              "The list of [SecretVersions][google.cloud.secretmanager.v1.SecretVersion] sorted in reverse by create_time (newest first).",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token to retrieve the next page of results. Pass this value in [ListSecretVersionsRequest.page_token][google.cloud.secretmanager.v1.ListSecretVersionsRequest.page_token] to retrieve the next page.",
          },
          totalSize: {
            type: "integer",
            description:
              "The total number of [SecretVersions][google.cloud.secretmanager.v1.SecretVersion] but 0 when the [ListSecretsRequest.filter][google.cloud.secretmanager.v1.ListSecretsRequest.filter] field is set.",
          },
        },
        description:
          "Response message for [SecretManagerService.ListSecretVersions][google.cloud.secretmanager.v1.SecretManagerService.ListSecretVersions].",
        additionalProperties: true,
      },
    },
  },
};

export default listSecretVersions;
