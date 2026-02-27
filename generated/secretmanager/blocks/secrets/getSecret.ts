import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSecretManagerServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  replication: {
    name: "replication",
    fields: {
      automatic: {
        name: "automatic",
        fields: {
          customer_managed_encryption: {
            name: "customerManagedEncryption",
            fields: {
              kms_key_name: "kmsKeyName",
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
                  kms_key_name: "kmsKeyName",
                },
              },
            },
          },
        },
      },
    },
  },
  create_time: "createTime",
  expire_time: "expireTime",
  rotation: {
    name: "rotation",
    fields: {
      next_rotation_time: "nextRotationTime",
    },
  },
  version_aliases: "versionAliases",
  version_destroy_ttl: "versionDestroyTtl",
  customer_managed_encryption: {
    name: "customerManagedEncryption",
    fields: {
      kms_key_name: "kmsKeyName",
    },
  },
};

const getSecret: AppBlock = {
  name: "Get Secret",
  description: `Gets metadata for a given [Secret][google.cloud.secretmanager.v1.Secret].`,
  category: "Secrets",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret], in the format `projects/*/secrets/*` or `projects/*/locations/*/secrets/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret], in the format `projects/*/secrets/*` or `projects/*/locations/*/secrets/*`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSecretManagerServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getSecret(request, (err: any, response: any) => {
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
              "Output only. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret] in the format `projects/*/secrets/*`.",
          },
          replication: {
            type: "object",
            properties: {
              automatic: {
                type: "object",
                properties: {
                  customerManagedEncryption: {
                    type: "object",
                    properties: {
                      kmsKeyName: {
                        type: "string",
                        description:
                          "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads.  For secrets using the [UserManaged][google.cloud.secretmanager.v1.Replication.UserManaged] replication policy type, Cloud KMS CryptoKeys must reside in the same location as the [replica location][Secret.UserManaged.Replica.location].  For secrets using the [Automatic][google.cloud.secretmanager.v1.Replication.Automatic] replication policy type, Cloud KMS CryptoKeys must reside in `global`.  The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                      },
                    },
                    required: ["kmsKeyName"],
                    description:
                      "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
                    additionalProperties: true,
                  },
                },
                description:
                  "A replication policy that replicates the [Secret][google.cloud.secretmanager.v1.Secret] payload without any restrictions. (Part of 'replication' - only one field in this group can be set)",
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
                            'The canonical IDs of the location to replicate data. For example: `"us-east1"`.',
                        },
                        customerManagedEncryption: {
                          type: "object",
                          properties: {
                            kmsKeyName: {
                              type: "string",
                              description:
                                "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads.  For secrets using the [UserManaged][google.cloud.secretmanager.v1.Replication.UserManaged] replication policy type, Cloud KMS CryptoKeys must reside in the same location as the [replica location][Secret.UserManaged.Replica.location].  For secrets using the [Automatic][google.cloud.secretmanager.v1.Replication.Automatic] replication policy type, Cloud KMS CryptoKeys must reside in `global`.  The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                            },
                          },
                          required: ["kmsKeyName"],
                          description:
                            "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "Represents a Replica for this [Secret][google.cloud.secretmanager.v1.Secret].",
                      additionalProperties: true,
                    },
                    description:
                      "Required. The list of Replicas for this [Secret][google.cloud.secretmanager.v1.Secret].  Cannot be empty.",
                  },
                },
                required: ["replicas"],
                description:
                  "A replication policy that replicates the [Secret][google.cloud.secretmanager.v1.Secret] payload into the locations specified in [Replication.UserManaged.replicas][google.cloud.secretmanager.v1.Replication.UserManaged.replicas] (Part of 'replication' - only one field in this group can be set)",
                additionalProperties: true,
              },
            },
            description:
              "A policy that defines the replication and encryption configuration of data.",
            additionalProperties: true,
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "The labels assigned to this Secret.  Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: `[\\p{Ll}\\p{Lo}][\\p{Ll}\\p{Lo}\\p{N}_-]{0,62}`  Label values must be between 0 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: `[\\p{Ll}\\p{Lo}\\p{N}_-]{0,63}`  No more than 64 labels can be assigned to a given resource.",
          },
          topics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Identifier. The resource name of the Pub/Sub topic that will be published to, in the following format: `projects/*/topics/*`. For publication to succeed, the Secret Manager service agent must have the `pubsub.topic.publish` permission on the topic. The Pub/Sub Publisher role (`roles/pubsub.publisher`) includes this permission.",
                },
              },
              description:
                "A Pub/Sub topic which Secret Manager will publish to when control plane events occur on this secret.",
              additionalProperties: true,
            },
            description:
              "Optional. A list of up to 10 Pub/Sub topics to which messages are published when control plane operations are called on the secret or its versions.",
          },
          expireTime: {
            type: "string",
            description:
              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z') (Part of 'expiration' - only one field in this group can be set)",
          },
          etag: {
            type: "string",
            description:
              "Optional. Etag of the currently stored [Secret][google.cloud.secretmanager.v1.Secret].",
          },
          rotation: {
            type: "object",
            properties: {
              nextRotationTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
            },
            description:
              "The rotation time and period for a [Secret][google.cloud.secretmanager.v1.Secret]. At next_rotation_time, Secret Manager will send a Pub/Sub notification to the topics configured on the Secret. [Secret.topics][google.cloud.secretmanager.v1.Secret.topics] must be set to configure rotation.",
            additionalProperties: true,
          },
          versionAliases: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Mapping from version alias to version name.  A version alias is a string with a maximum length of 63 characters and can contain uppercase and lowercase letters, numerals, and the hyphen (`-`) and underscore ('_') characters. An alias string must start with a letter and cannot be the string 'latest' or 'NEW'. No more than 50 aliases can be assigned to a given secret.  Version-Alias pairs will be viewable via GetSecret and modifiable via UpdateSecret. Access by alias is only be supported on GetSecretVersion and AccessSecretVersion.",
          },
          annotations: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Custom metadata about the secret.  Annotations are distinct from various forms of labels. Annotations exist to allow client tools to store their own state information without requiring a database.  Annotation keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, begin and end with an alphanumeric character ([a-z0-9A-Z]), and may have dashes (-), underscores (_), dots (.), and alphanumerics in between these symbols.  The total size of annotation keys and values must be less than 16KiB.",
          },
          versionDestroyTtl: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          customerManagedEncryption: {
            type: "object",
            properties: {
              kmsKeyName: {
                type: "string",
                description:
                  "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads.  For secrets using the [UserManaged][google.cloud.secretmanager.v1.Replication.UserManaged] replication policy type, Cloud KMS CryptoKeys must reside in the same location as the [replica location][Secret.UserManaged.Replica.location].  For secrets using the [Automatic][google.cloud.secretmanager.v1.Replication.Automatic] replication policy type, Cloud KMS CryptoKeys must reside in `global`.  The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
              },
            },
            required: ["kmsKeyName"],
            description:
              "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
            additionalProperties: true,
          },
        },
        description:
          "A [Secret][google.cloud.secretmanager.v1.Secret] is a logical secret whose value and versions can be accessed.  A [Secret][google.cloud.secretmanager.v1.Secret] is made up of zero or more [SecretVersions][google.cloud.secretmanager.v1.SecretVersion] that represent the secret data.",
        additionalProperties: true,
      },
    },
  },
};

export default getSecret;
