import { AppBlock, events } from "@slflows/sdk/v1";
import { getSecretManagerServiceClient } from "../../lib/grpcClient.ts";

const addSecretVersion: AppBlock = {
  name: "Add Secret Version",
  description: `Creates a new [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] containing secret data and attaches it to an existing [Secret][google.cloud.secretmanager.v1.Secret].`,
  category: "Secret Versions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret] to associate with the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] in the format `projects/*/secrets/*` or `projects/*/locations/*/secrets/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret] to associate with the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] in the format `projects/*/secrets/*` or `projects/*/locations/*/secrets/*`.",
          },
          required: true,
        },
        payload: {
          name: "Payload",
          description:
            "Required. The secret payload of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
          type: {
            type: "object",
            properties: {
              data: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              data_crc32c: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            description:
              "A secret payload resource in the Secret Manager API. This contains the sensitive secret payload that is associated with a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSecretManagerServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.payload !== undefined)
          request.payload = input.event.inputConfig.payload;

        const result = await new Promise<any>((resolve, reject) => {
          client.addSecretVersion(request, (err: any, response: any) => {
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
              "Output only. The resource name of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] in the format `projects/*/secrets/*/versions/*`.  [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] IDs in a [Secret][google.cloud.secretmanager.v1.Secret] start at 1 and are incremented for each subsequent version of the secret.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          destroy_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "ENABLED", "DISABLED", "DESTROYED"],
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
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            description: "Describes the status of customer-managed encryption.",
            additionalProperties: true,
          },
        },
        description: "A secret version resource in the Secret Manager API.",
        additionalProperties: true,
      },
    },
  },
};

export default addSecretVersion;
