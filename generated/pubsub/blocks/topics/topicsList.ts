import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const topicsList: AppBlock = {
  name: "Topics - List",
  description: `Lists matching topics.`,
  category: "Topics",
  inputs: {
    default: {
      config: {
        pageToken: {
          name: "Page Token",
          description:
            "Optional. The value returned by the last `ListTopicsResponse`; indicates that this is a continuation of a prior `ListTopics` call, and that the system should return the next page of data.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description: "Optional. Maximum number of topics to return.",
          type: {
            type: "integer",
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
              "https://www.googleapis.com/auth/pubsub",
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
        const baseUrl = "https://pubsub.googleapis.com/";
        let path = `v1/{+project}/topics`;

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
          topics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kmsKeyName: {
                  type: "string",
                  description:
                    "Optional. The resource name of the Cloud KMS CryptoKey to be used to protect access to messages published on this topic. The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                },
                ingestionDataSourceSettings: {
                  type: "object",
                  properties: {
                    cloudStorage: {
                      type: "object",
                      properties: {
                        pubsubAvroFormat: {
                          type: "object",
                          properties: {},
                          description:
                            "Configuration for reading Cloud Storage data written via [Cloud Storage subscriptions](https://cloud.google.com/pubsub/docs/cloudstorage). The data and attributes fields of the originally exported Pub/Sub message will be restored when publishing.",
                          additionalProperties: true,
                        },
                        matchGlob: {
                          type: "string",
                          description:
                            "Optional. Glob pattern used to match objects that will be ingested. If unset, all objects will be ingested. See the [supported patterns](https://cloud.google.com/storage/docs/json_api/v1/objects/list#list-objects-and-prefixes-using-glob).",
                        },
                        avroFormat: {
                          type: "object",
                          properties: {},
                          description:
                            "Configuration for reading Cloud Storage data in Avro binary format. The bytes of each object will be set to the `data` field of a Pub/Sub message.",
                          additionalProperties: true,
                        },
                        bucket: {
                          type: "string",
                          description:
                            'Optional. Cloud Storage bucket. The bucket name must be without any prefix like "gs://". See the [bucket naming requirements] (https://cloud.google.com/storage/docs/buckets#naming).',
                        },
                        minimumObjectCreateTime: {
                          type: "string",
                          description:
                            "Optional. Only objects with a larger or equal creation timestamp will be ingested. (Format: google-datetime)",
                        },
                        state: {
                          type: "string",
                          enum: [
                            "STATE_UNSPECIFIED",
                            "ACTIVE",
                            "CLOUD_STORAGE_PERMISSION_DENIED",
                            "PUBLISH_PERMISSION_DENIED",
                            "BUCKET_NOT_FOUND",
                            "TOO_MANY_OBJECTS",
                          ],
                          description:
                            "Output only. An output-only field that indicates the state of the Cloud Storage ingestion source.",
                        },
                        textFormat: {
                          type: "object",
                          properties: {
                            delimiter: {
                              type: "string",
                              description:
                                "Optional. When unset, '\\n' is used.",
                            },
                          },
                          description:
                            "Configuration for reading Cloud Storage data in text format. Each line of text as specified by the delimiter will be set to the `data` field of a Pub/Sub message.",
                          additionalProperties: true,
                        },
                      },
                      description: "Ingestion settings for Cloud Storage.",
                      additionalProperties: true,
                    },
                    platformLogsSettings: {
                      type: "object",
                      properties: {
                        severity: {
                          type: "string",
                          enum: [
                            "SEVERITY_UNSPECIFIED",
                            "DISABLED",
                            "DEBUG",
                            "INFO",
                            "WARNING",
                            "ERROR",
                          ],
                          description:
                            "Optional. The minimum severity level of Platform Logs that will be written.",
                        },
                      },
                      description:
                        "Settings for Platform Logs produced by Pub/Sub.",
                      additionalProperties: true,
                    },
                    azureEventHubs: {
                      type: "object",
                      properties: {
                        subscriptionId: {
                          type: "string",
                          description: "Optional. The Azure subscription id.",
                        },
                        gcpServiceAccount: {
                          type: "string",
                          description:
                            "Optional. The GCP service account to be used for Federated Identity authentication.",
                        },
                        clientId: {
                          type: "string",
                          description:
                            "Optional. The client id of the Azure application that is being used to authenticate Pub/Sub.",
                        },
                        eventHub: {
                          type: "string",
                          description: "Optional. The name of the Event Hub.",
                        },
                        resourceGroup: {
                          type: "string",
                          description:
                            "Optional. Name of the resource group within the azure subscription.",
                        },
                        tenantId: {
                          type: "string",
                          description:
                            "Optional. The tenant id of the Azure application that is being used to authenticate Pub/Sub.",
                        },
                        namespace: {
                          type: "string",
                          description:
                            "Optional. The name of the Event Hubs namespace.",
                        },
                        state: {
                          type: "string",
                          enum: [
                            "STATE_UNSPECIFIED",
                            "ACTIVE",
                            "EVENT_HUBS_PERMISSION_DENIED",
                            "PUBLISH_PERMISSION_DENIED",
                            "NAMESPACE_NOT_FOUND",
                            "EVENT_HUB_NOT_FOUND",
                            "SUBSCRIPTION_NOT_FOUND",
                            "RESOURCE_GROUP_NOT_FOUND",
                          ],
                          description:
                            "Output only. An output-only field that indicates the state of the Event Hubs ingestion source.",
                        },
                      },
                      description: "Ingestion settings for Azure Event Hubs.",
                      additionalProperties: true,
                    },
                    awsMsk: {
                      type: "object",
                      properties: {
                        awsRoleArn: {
                          type: "string",
                          description:
                            "Required. AWS role ARN to be used for Federated Identity authentication with Amazon MSK. Check the Pub/Sub docs for how to set up this role and the required permissions that need to be attached to it.",
                        },
                        clusterArn: {
                          type: "string",
                          description:
                            "Required. The Amazon Resource Name (ARN) that uniquely identifies the cluster.",
                        },
                        state: {
                          type: "string",
                          enum: [
                            "STATE_UNSPECIFIED",
                            "ACTIVE",
                            "MSK_PERMISSION_DENIED",
                            "PUBLISH_PERMISSION_DENIED",
                            "CLUSTER_NOT_FOUND",
                            "TOPIC_NOT_FOUND",
                          ],
                          description:
                            "Output only. An output-only field that indicates the state of the Amazon MSK ingestion source.",
                        },
                        gcpServiceAccount: {
                          type: "string",
                          description:
                            "Required. The GCP service account to be used for Federated Identity authentication with Amazon MSK (via a `AssumeRoleWithWebIdentity` call for the provided role). The `aws_role_arn` must be set up with `accounts.google.com:sub` equals to this service account number.",
                        },
                        topic: {
                          type: "string",
                          description:
                            "Required. The name of the topic in the Amazon MSK cluster that Pub/Sub will import from.",
                        },
                      },
                      description: "Ingestion settings for Amazon MSK.",
                      additionalProperties: true,
                    },
                    awsKinesis: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: [
                            "STATE_UNSPECIFIED",
                            "ACTIVE",
                            "KINESIS_PERMISSION_DENIED",
                            "PUBLISH_PERMISSION_DENIED",
                            "STREAM_NOT_FOUND",
                            "CONSUMER_NOT_FOUND",
                          ],
                          description:
                            "Output only. An output-only field that indicates the state of the Kinesis ingestion source.",
                        },
                        consumerArn: {
                          type: "string",
                          description:
                            "Required. The Kinesis consumer ARN to used for ingestion in Enhanced Fan-Out mode. The consumer must be already created and ready to be used.",
                        },
                        streamArn: {
                          type: "string",
                          description:
                            "Required. The Kinesis stream ARN to ingest data from.",
                        },
                        awsRoleArn: {
                          type: "string",
                          description:
                            "Required. AWS role ARN to be used for Federated Identity authentication with Kinesis. Check the Pub/Sub docs for how to set up this role and the required permissions that need to be attached to it.",
                        },
                        gcpServiceAccount: {
                          type: "string",
                          description:
                            "Required. The GCP service account to be used for Federated Identity authentication with Kinesis (via a `AssumeRoleWithWebIdentity` call for the provided role). The `aws_role_arn` must be set up with `accounts.google.com:sub` equals to this service account number.",
                        },
                      },
                      description:
                        "Ingestion settings for Amazon Kinesis Data Streams.",
                      additionalProperties: true,
                    },
                    confluentCloud: {
                      type: "object",
                      properties: {
                        clusterId: {
                          type: "string",
                          description: "Required. The id of the cluster.",
                        },
                        gcpServiceAccount: {
                          type: "string",
                          description:
                            "Required. The GCP service account to be used for Federated Identity authentication with `identity_pool_id`.",
                        },
                        state: {
                          type: "string",
                          enum: [
                            "STATE_UNSPECIFIED",
                            "ACTIVE",
                            "CONFLUENT_CLOUD_PERMISSION_DENIED",
                            "PUBLISH_PERMISSION_DENIED",
                            "UNREACHABLE_BOOTSTRAP_SERVER",
                            "CLUSTER_NOT_FOUND",
                            "TOPIC_NOT_FOUND",
                          ],
                          description:
                            "Output only. An output-only field that indicates the state of the Confluent Cloud ingestion source.",
                        },
                        identityPoolId: {
                          type: "string",
                          description:
                            "Required. The id of the identity pool to be used for Federated Identity authentication with Confluent Cloud. See https://docs.confluent.io/cloud/current/security/authenticate/workload-identities/identity-providers/oauth/identity-pools.html#add-oauth-identity-pools.",
                        },
                        topic: {
                          type: "string",
                          description:
                            "Required. The name of the topic in the Confluent Cloud cluster that Pub/Sub will import from.",
                        },
                        bootstrapServer: {
                          type: "string",
                          description:
                            "Required. The address of the bootstrap server. The format is url:port.",
                        },
                      },
                      description: "Ingestion settings for Confluent Cloud.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Settings for an ingestion data source on a topic.",
                  additionalProperties: true,
                },
                messageTransforms: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      javascriptUdf: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            description:
                              "Required. JavaScript code that contains a function `function_name` with the below signature: ``` /** * Transforms a Pub/Sub message. * @return {(Object)>|null)} - To * filter a message, return `null`. To transform a message return a map * with the following keys: * - (required) 'data' : {string} * - (optional) 'attributes' : {Object} * Returning empty `attributes` will remove all attributes from the * message. * * @param {(Object)>} Pub/Sub * message. Keys: * - (required) 'data' : {string} * - (required) 'attributes' : {Object} * * @param {Object} metadata - Pub/Sub message metadata. * Keys: * - (optional) 'message_id' : {string} * - (optional) 'publish_time': {string} YYYY-MM-DDTHH:MM:SSZ format * - (optional) 'ordering_key': {string} */ function (message, metadata) { } ```",
                          },
                          functionName: {
                            type: "string",
                            description:
                              "Required. Name of the JavasScript function that should applied to Pub/Sub messages.",
                          },
                        },
                        description:
                          "User-defined JavaScript function that can transform or filter a Pub/Sub message.",
                        additionalProperties: true,
                      },
                      enabled: {
                        type: "boolean",
                        description:
                          "Optional. This field is deprecated, use the `disabled` field to disable transforms.",
                      },
                      disabled: {
                        type: "boolean",
                        description:
                          "Optional. If true, the transform is disabled and will not be applied to messages. Defaults to `false`.",
                      },
                    },
                    description: "All supported message transforms types.",
                    additionalProperties: true,
                  },
                  description:
                    "Optional. Transforms to be applied to messages published to the topic. Transforms are applied in the order specified.",
                },
                messageStoragePolicy: {
                  type: "object",
                  properties: {
                    enforceInTransit: {
                      type: "boolean",
                      description:
                        "Optional. If true, `allowed_persistence_regions` is also used to enforce in-transit guarantees for messages. That is, Pub/Sub will fail Publish operations on this topic and subscribe operations on any subscription attached to this topic in any region that is not in `allowed_persistence_regions`.",
                    },
                    allowedPersistenceRegions: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Optional. A list of IDs of Google Cloud regions where messages that are published to the topic may be persisted in storage. Messages published by publishers running in non-allowed Google Cloud regions (or running outside of Google Cloud altogether) are routed for storage in one of the allowed regions. An empty list means that no regions are allowed, and is not a valid configuration.",
                    },
                  },
                  description:
                    "A policy constraining the storage of messages published to the topic.",
                  additionalProperties: true,
                },
                satisfiesPzs: {
                  type: "boolean",
                  description:
                    "Optional. Reserved for future use. This field is set only in responses from the server; it is ignored if it is set in any requests.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Optional. See [Creating and managing labels] (https://cloud.google.com/pubsub/docs/labels).",
                },
                name: {
                  type: "string",
                  description:
                    'Required. The name of the topic. It must have the format `"projects/{project}/topics/{topic}"`. `{topic}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.',
                },
                tags: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing"',
                },
                schemaSettings: {
                  type: "object",
                  properties: {
                    encoding: {
                      type: "string",
                      enum: ["ENCODING_UNSPECIFIED", "JSON", "BINARY"],
                      description:
                        "Optional. The encoding of messages validated against `schema`.",
                    },
                    lastRevisionId: {
                      type: "string",
                      description:
                        "Optional. The maximum (inclusive) revision allowed for validating messages. If empty or not present, allow any revision to be validated against first_revision or any revision created after.",
                    },
                    firstRevisionId: {
                      type: "string",
                      description:
                        "Optional. The minimum (inclusive) revision allowed for validating messages. If empty or not present, allow any revision to be validated against last_revision or any revision created before.",
                    },
                    schema: {
                      type: "string",
                      description:
                        "Required. The name of the schema that messages published should be validated against. Format is `projects/{project}/schemas/{schema}`. The value of this field will be `_deleted-schema_` if the schema has been deleted.",
                    },
                  },
                  description:
                    "Settings for validating messages published against a schema.",
                  additionalProperties: true,
                },
                messageRetentionDuration: {
                  type: "string",
                  description:
                    "Optional. Indicates the minimum duration to retain a message after it is published to the topic. If this field is set, messages published to the topic in the last `message_retention_duration` are always available to subscribers. For instance, it allows any attached subscription to [seek to a timestamp](https://cloud.google.com/pubsub/docs/replay-overview#seek_to_a_time) that is up to `message_retention_duration` in the past. If this field is not set, message retention is controlled by settings on individual subscriptions. Cannot be more than 31 days or less than 10 minutes. (Format: google-duration)",
                },
                state: {
                  type: "string",
                  enum: [
                    "STATE_UNSPECIFIED",
                    "ACTIVE",
                    "INGESTION_RESOURCE_ERROR",
                  ],
                  description:
                    "Output only. An output-only field indicating the state of the topic.",
                },
              },
              description: "A topic resource.",
              additionalProperties: true,
            },
            description: "Optional. The resulting topics.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Optional. If not empty, indicates that there may be more topics that match the request; this value should be passed in a new `ListTopicsRequest`.",
          },
        },
        description: "Response for the `ListTopics` method.",
        additionalProperties: true,
      },
    },
  },
};

export default topicsList;
