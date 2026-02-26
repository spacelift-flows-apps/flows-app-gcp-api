import { AppBlock, events } from "@slflows/sdk/v1";
import { getSecretManagerServiceClient } from "../../lib/grpcClient.ts";

const enableSecretVersion: AppBlock = {
  name: "Enable Secret Version",
  description: `Enables a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion]. Sets the [state][google.cloud.secretmanager.v1.SecretVersion.state] of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] to [ENABLED][google.cloud.secretmanager.v1.SecretVersion.State.ENABLED].`,
  category: "Secret Versions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] to enable in the format `projects/*/secrets/*/versions/*` or `projects/*/locations/*/secrets/*/versions/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] to enable in the format `projects/*/secrets/*/versions/*` or `projects/*/locations/*/secrets/*/versions/*`.",
          },
          required: true,
        },
        etag: {
          name: "Etag",
          description:
            "Optional. Etag of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion]. The request succeeds if it matches the etag of the currently stored secret version object. If the etag is omitted, the request succeeds.",
          type: {
            type: "string",
            description:
              "Optional. Etag of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion]. The request succeeds if it matches the etag of the currently stored secret version object. If the etag is omitted, the request succeeds.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSecretManagerServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;

        const result = await new Promise<any>((resolve, reject) => {
          client.enableSecretVersion(request, (err: any, response: any) => {
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

export default enableSecretVersion;
