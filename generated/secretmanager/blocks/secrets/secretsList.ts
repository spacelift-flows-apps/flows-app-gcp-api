import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const secretsList: AppBlock = {
  name: "Secrets - List",
  description: `Lists Secrets.`,
  category: "Secrets",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the project associated with the Secrets, in the format `projects/*` or `projects/*/locations/*`",
          type: {
            type: "string",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of results to be returned in a single page. If set to 0, the server decides the number of results to return. If the number is greater than 25000, it is capped at 25000.",
          type: {
            type: "integer",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Filter string, adhering to the rules in [List-operation filtering](https://cloud.google.com/secret-manager/docs/filtering). List only secrets matching the filter. If filter is empty, all secrets are listed.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. Pagination token, returned earlier via ListSecretsResponse.next_page_token.",
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
        let path = `v1/{+parent}/secrets`;

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
          secrets: {
            type: "array",
            items: {
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
                            description:
                              "Represents a Replica for this Secret.",
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
            description:
              "The list of Secrets sorted in reverse by create_time (newest first).",
          },
          totalSize: {
            type: "integer",
            description:
              "The total number of Secrets but 0 when the ListSecretsRequest.filter field is set. (Format: int32)",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token to retrieve the next page of results. Pass this value in ListSecretsRequest.page_token to retrieve the next page.",
          },
        },
        description: "Response message for SecretManagerService.ListSecrets.",
        additionalProperties: true,
      },
    },
  },
};

export default secretsList;
