import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const secretsPatch: AppBlock = {
  name: "Secrets - Patch",
  description: `Updates metadata of an existing Secret.`,
  category: "Secrets",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Output only. The resource name of the Secret in the format `projects/*/secrets/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description: "Required. Specifies the fields to be updated.",
          type: {
            type: "string",
          },
          required: false,
        },
        annotations: {
          name: "Annotations",
          description: "Optional.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Custom metadata about the secret. Annotations are distinct from various forms of labels. Annotations exist to allow client tools to store their own state information without requiring a database. Annotation keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, begin and end with an alphanumeric character ([a-z0-9A-Z]), and may have dashes (-), underscores (_), dots (.), and alphanumerics in between these symbols. The total size of annotation keys and values must be less than 16KiB.",
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: "Optional.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Mapping of Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing" Tags are used to organize and group resources. Tags can be used to control policy evaluation for the resource.',
          },
          required: false,
        },
        topics: {
          name: "Topics",
          description: "Optional.",
          type: {
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
          required: false,
        },
        versionAliases: {
          name: "Version Aliases",
          description: "Optional.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Mapping from version alias to version name. A version alias is a string with a maximum length of 63 characters and can contain uppercase and lowercase letters, numerals, and the hyphen (`-`) and underscore ('_') characters. An alias string must start with a letter and cannot be the string 'latest' or 'NEW'. No more than 50 aliases can be assigned to a given secret. Version-Alias pairs will be viewable via GetSecret and modifiable via UpdateSecret. Access by alias is only be supported on GetSecretVersion and AccessSecretVersion.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description: "Optional.",
          type: {
            type: "string",
            description: "Optional. Etag of the currently stored Secret.",
          },
          required: false,
        },
        customerManagedEncryption: {
          name: "Customer Managed Encryption",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              kmsKeyName: {
                type: "string",
                description:
                  "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads. For secrets using the UserManaged replication policy type, Cloud KMS CryptoKeys must reside in the same location as the replica location. For secrets using the Automatic replication policy type, Cloud KMS CryptoKeys must reside in `global`. The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
              },
            },
            description:
              "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
            additionalProperties: true,
          },
          required: false,
        },
        expireTime: {
          name: "Expire Time",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Timestamp in UTC when the Secret is scheduled to expire. This is always provided on output, regardless of what was sent on input. (Format: google-datetime)",
          },
          required: false,
        },
        versionDestroyTtl: {
          name: "Version Destroy Ttl",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Secret Version TTL after destruction request This is a part of the Delayed secret version destroy feature. For secret with TTL>0, version destruction doesn't happen immediately on calling destroy instead the version goes to a disabled state and destruction happens after the TTL expires. (Format: google-duration)",
          },
          required: false,
        },
        rotation: {
          name: "Rotation",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              rotationPeriod: {
                type: "string",
                description:
                  "Input only. The Duration between rotation notifications. Must be in seconds and at least 3600s (1h) and at most 3153600000s (100 years). If rotation_period is set, next_rotation_time must be set. next_rotation_time will be advanced by this period when the service automatically sends rotation notifications. (Format: google-duration)",
              },
              nextRotationTime: {
                type: "string",
                description:
                  "Optional. Timestamp in UTC at which the Secret is scheduled to rotate. Cannot be set to less than 300s (5 min) in the future and at most 3153600000s (100 years). next_rotation_time MUST be set if rotation_period is set. (Format: google-datetime)",
              },
            },
            description:
              "The rotation time and period for a Secret. At next_rotation_time, Secret Manager will send a Pub/Sub notification to the topics configured on the Secret. Secret.topics must be set to configure rotation.",
            additionalProperties: true,
          },
          required: false,
        },
        replication: {
          name: "Replication",
          description: "Optional.",
          type: {
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
                          "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads. For secrets using the UserManaged replication policy type, Cloud KMS CryptoKeys must reside in the same location as the replica location. For secrets using the Automatic replication policy type, Cloud KMS CryptoKeys must reside in `global`. The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                      },
                    },
                    description:
                      "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
                    additionalProperties: true,
                  },
                },
                description:
                  "A replication policy that replicates the Secret payload without any restrictions.",
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
                        customerManagedEncryption: {
                          type: "object",
                          properties: {
                            kmsKeyName: {
                              type: "string",
                              description:
                                "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads. For secrets using the UserManaged replication policy type, Cloud KMS CryptoKeys must reside in the same location as the replica location. For secrets using the Automatic replication policy type, Cloud KMS CryptoKeys must reside in `global`. The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                            },
                          },
                          description:
                            "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
                          additionalProperties: true,
                        },
                        location: {
                          type: "string",
                          description:
                            'The canonical IDs of the location to replicate data. For example: `"us-east1"`.',
                        },
                      },
                      description: "Represents a Replica for this Secret.",
                      additionalProperties: true,
                    },
                    description:
                      "Required. The list of Replicas for this Secret. Cannot be empty.",
                  },
                },
                description:
                  "A replication policy that replicates the Secret payload into the locations specified in Replication.UserManaged.replicas",
                additionalProperties: true,
              },
            },
            description:
              "A policy that defines the replication and encryption configuration of data.",
            additionalProperties: true,
          },
          required: false,
        },
        ttl: {
          name: "Ttl",
          description: "Input only.",
          type: {
            type: "string",
            description:
              "Input only. The TTL for the Secret. (Format: google-duration)",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "The labels assigned to this Secret.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "The labels assigned to this Secret. Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: `\\p{Ll}\\p{Lo}{0,62}` Label values must be between 0 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: `[\\p{Ll}\\p{Lo}\\p{N}_-]{0,63}` No more than 64 labels can be assigned to a given resource.",
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
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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
        const baseUrl = "https://secretmanager.googleapis.com/";
        let path = `v1/{+name}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.annotations !== undefined)
          requestBody.annotations = input.event.inputConfig.annotations;
        if (input.event.inputConfig.tags !== undefined)
          requestBody.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.topics !== undefined)
          requestBody.topics = input.event.inputConfig.topics;
        if (input.event.inputConfig.versionAliases !== undefined)
          requestBody.versionAliases = input.event.inputConfig.versionAliases;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.customerManagedEncryption !== undefined)
          requestBody.customerManagedEncryption =
            input.event.inputConfig.customerManagedEncryption;
        if (input.event.inputConfig.expireTime !== undefined)
          requestBody.expireTime = input.event.inputConfig.expireTime;
        if (input.event.inputConfig.versionDestroyTtl !== undefined)
          requestBody.versionDestroyTtl =
            input.event.inputConfig.versionDestroyTtl;
        if (input.event.inputConfig.rotation !== undefined)
          requestBody.rotation = input.event.inputConfig.rotation;
        if (input.event.inputConfig.replication !== undefined)
          requestBody.replication = input.event.inputConfig.replication;
        if (input.event.inputConfig.ttl !== undefined)
          requestBody.ttl = input.event.inputConfig.ttl;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;

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
          annotations: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Custom metadata about the secret. Annotations are distinct from various forms of labels. Annotations exist to allow client tools to store their own state information without requiring a database. Annotation keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, begin and end with an alphanumeric character ([a-z0-9A-Z]), and may have dashes (-), underscores (_), dots (.), and alphanumerics in between these symbols. The total size of annotation keys and values must be less than 16KiB.",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Mapping of Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing" Tags are used to organize and group resources. Tags can be used to control policy evaluation for the resource.',
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
          createTime: {
            type: "string",
            description:
              "Output only. The time at which the Secret was created. (Format: google-datetime)",
          },
          versionAliases: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Mapping from version alias to version name. A version alias is a string with a maximum length of 63 characters and can contain uppercase and lowercase letters, numerals, and the hyphen (`-`) and underscore ('_') characters. An alias string must start with a letter and cannot be the string 'latest' or 'NEW'. No more than 50 aliases can be assigned to a given secret. Version-Alias pairs will be viewable via GetSecret and modifiable via UpdateSecret. Access by alias is only be supported on GetSecretVersion and AccessSecretVersion.",
          },
          name: {
            type: "string",
            description:
              "Output only. The resource name of the Secret in the format `projects/*/secrets/*`.",
          },
          etag: {
            type: "string",
            description: "Optional. Etag of the currently stored Secret.",
          },
          customerManagedEncryption: {
            type: "object",
            properties: {
              kmsKeyName: {
                type: "string",
                description:
                  "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads. For secrets using the UserManaged replication policy type, Cloud KMS CryptoKeys must reside in the same location as the replica location. For secrets using the Automatic replication policy type, Cloud KMS CryptoKeys must reside in `global`. The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
              },
            },
            description:
              "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
            additionalProperties: true,
          },
          expireTime: {
            type: "string",
            description:
              "Optional. Timestamp in UTC when the Secret is scheduled to expire. This is always provided on output, regardless of what was sent on input. (Format: google-datetime)",
          },
          versionDestroyTtl: {
            type: "string",
            description:
              "Optional. Secret Version TTL after destruction request This is a part of the Delayed secret version destroy feature. For secret with TTL>0, version destruction doesn't happen immediately on calling destroy instead the version goes to a disabled state and destruction happens after the TTL expires. (Format: google-duration)",
          },
          rotation: {
            type: "object",
            properties: {
              rotationPeriod: {
                type: "string",
                description:
                  "Input only. The Duration between rotation notifications. Must be in seconds and at least 3600s (1h) and at most 3153600000s (100 years). If rotation_period is set, next_rotation_time must be set. next_rotation_time will be advanced by this period when the service automatically sends rotation notifications. (Format: google-duration)",
              },
              nextRotationTime: {
                type: "string",
                description:
                  "Optional. Timestamp in UTC at which the Secret is scheduled to rotate. Cannot be set to less than 300s (5 min) in the future and at most 3153600000s (100 years). next_rotation_time MUST be set if rotation_period is set. (Format: google-datetime)",
              },
            },
            description:
              "The rotation time and period for a Secret. At next_rotation_time, Secret Manager will send a Pub/Sub notification to the topics configured on the Secret. Secret.topics must be set to configure rotation.",
            additionalProperties: true,
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
                          "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads. For secrets using the UserManaged replication policy type, Cloud KMS CryptoKeys must reside in the same location as the replica location. For secrets using the Automatic replication policy type, Cloud KMS CryptoKeys must reside in `global`. The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                      },
                    },
                    description:
                      "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
                    additionalProperties: true,
                  },
                },
                description:
                  "A replication policy that replicates the Secret payload without any restrictions.",
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
                        customerManagedEncryption: {
                          type: "object",
                          properties: {
                            kmsKeyName: {
                              type: "string",
                              description:
                                "Required. The resource name of the Cloud KMS CryptoKey used to encrypt secret payloads. For secrets using the UserManaged replication policy type, Cloud KMS CryptoKeys must reside in the same location as the replica location. For secrets using the Automatic replication policy type, Cloud KMS CryptoKeys must reside in `global`. The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                            },
                          },
                          description:
                            "Configuration for encrypting secret payloads using customer-managed encryption keys (CMEK).",
                          additionalProperties: true,
                        },
                        location: {
                          type: "string",
                          description:
                            'The canonical IDs of the location to replicate data. For example: `"us-east1"`.',
                        },
                      },
                      description: "Represents a Replica for this Secret.",
                      additionalProperties: true,
                    },
                    description:
                      "Required. The list of Replicas for this Secret. Cannot be empty.",
                  },
                },
                description:
                  "A replication policy that replicates the Secret payload into the locations specified in Replication.UserManaged.replicas",
                additionalProperties: true,
              },
            },
            description:
              "A policy that defines the replication and encryption configuration of data.",
            additionalProperties: true,
          },
          ttl: {
            type: "string",
            description:
              "Input only. The TTL for the Secret. (Format: google-duration)",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "The labels assigned to this Secret. Label keys must be between 1 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: `\\p{Ll}\\p{Lo}{0,62}` Label values must be between 0 and 63 characters long, have a UTF-8 encoding of maximum 128 bytes, and must conform to the following PCRE regular expression: `[\\p{Ll}\\p{Lo}\\p{N}_-]{0,63}` No more than 64 labels can be assigned to a given resource.",
          },
        },
        description:
          "A Secret is a logical secret whose value and versions can be accessed. A Secret is made up of zero or more SecretVersions that represent the secret data.",
        additionalProperties: true,
      },
    },
  },
};

export default secretsPatch;
