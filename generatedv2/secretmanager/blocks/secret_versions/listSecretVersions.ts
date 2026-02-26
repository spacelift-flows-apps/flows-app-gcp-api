import { AppBlock, events } from "@slflows/sdk/v1";
import { getSecretManagerServiceClient } from "../../lib/grpcClient.ts";

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
        page_size: {
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
        page_token: {
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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;

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
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                destroy_time: {
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
                replication_status: {
                  type: "object",
                  properties: {
                    automatic: {
                      type: "object",
                      properties: {
                        customer_managed_encryption: {
                          type: "object",
                          properties: {
                            kms_key_version_name: {
                              type: "string",
                              description:
                                "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                            },
                          },
                          required: ["kms_key_version_name"],
                          description:
                            "Describes the status of customer-managed encryption.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "The replication status of a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] using automatic replication.  Only populated if the parent [Secret][google.cloud.secretmanager.v1.Secret] has an automatic replication policy. (Part of 'replication_status' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    user_managed: {
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
                              customer_managed_encryption: {
                                type: "object",
                                properties: {
                                  kms_key_version_name: {
                                    type: "string",
                                    description:
                                      "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                                  },
                                },
                                required: ["kms_key_version_name"],
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
                client_specified_payload_checksum: {
                  type: "boolean",
                  description:
                    "Output only. True if payload checksum specified in [SecretPayload][google.cloud.secretmanager.v1.SecretPayload] object has been received by [SecretManagerService][google.cloud.secretmanager.v1.SecretManagerService] on [SecretManagerService.AddSecretVersion][google.cloud.secretmanager.v1.SecretManagerService.AddSecretVersion].",
                },
                scheduled_destroy_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                customer_managed_encryption: {
                  type: "object",
                  properties: {
                    kms_key_version_name: {
                      type: "string",
                      description:
                        "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                    },
                  },
                  required: ["kms_key_version_name"],
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
          next_page_token: {
            type: "string",
            description:
              "A token to retrieve the next page of results. Pass this value in [ListSecretVersionsRequest.page_token][google.cloud.secretmanager.v1.ListSecretVersionsRequest.page_token] to retrieve the next page.",
          },
          total_size: {
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
