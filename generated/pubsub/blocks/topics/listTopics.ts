import { AppBlock, events } from "@slflows/sdk/v1";
import { getPublisherClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  topics: {
    name: "topics",
    fields: {
      message_storage_policy: {
        name: "messageStoragePolicy",
        fields: {
          allowed_persistence_regions: "allowedPersistenceRegions",
          enforce_in_transit: "enforceInTransit",
        },
      },
      kms_key_name: "kmsKeyName",
      schema_settings: {
        name: "schemaSettings",
        fields: {
          first_revision_id: "firstRevisionId",
          last_revision_id: "lastRevisionId",
        },
      },
      satisfies_pzs: "satisfiesPzs",
      message_retention_duration: "messageRetentionDuration",
      ingestion_data_source_settings: {
        name: "ingestionDataSourceSettings",
        fields: {
          aws_kinesis: {
            name: "awsKinesis",
            fields: {
              stream_arn: "streamArn",
              consumer_arn: "consumerArn",
              aws_role_arn: "awsRoleArn",
              gcp_service_account: "gcpServiceAccount",
            },
          },
          cloud_storage: {
            name: "cloudStorage",
            fields: {
              text_format: "textFormat",
              avro_format: "avroFormat",
              pubsub_avro_format: "pubsubAvroFormat",
              minimum_object_create_time: "minimumObjectCreateTime",
              match_glob: "matchGlob",
            },
          },
          azure_event_hubs: {
            name: "azureEventHubs",
            fields: {
              resource_group: "resourceGroup",
              event_hub: "eventHub",
              client_id: "clientId",
              tenant_id: "tenantId",
              subscription_id: "subscriptionId",
              gcp_service_account: "gcpServiceAccount",
            },
          },
          aws_msk: {
            name: "awsMsk",
            fields: {
              cluster_arn: "clusterArn",
              aws_role_arn: "awsRoleArn",
              gcp_service_account: "gcpServiceAccount",
            },
          },
          confluent_cloud: {
            name: "confluentCloud",
            fields: {
              bootstrap_server: "bootstrapServer",
              cluster_id: "clusterId",
              identity_pool_id: "identityPoolId",
              gcp_service_account: "gcpServiceAccount",
            },
          },
          platform_logs_settings: "platformLogsSettings",
        },
      },
      message_transforms: {
        name: "messageTransforms",
        fields: {
          javascript_udf: {
            name: "javascriptUdf",
            fields: {
              function_name: "functionName",
            },
          },
          ai_inference: {
            name: "aiInference",
            fields: {
              unstructured_inference: "unstructuredInference",
              service_account_email: "serviceAccountEmail",
            },
          },
        },
      },
    },
  },
  next_page_token: "nextPageToken",
};

const listTopics: AppBlock = {
  name: "List Topics",
  description: `Lists matching topics.`,
  category: "Topics",
  inputs: {
    default: {
      config: {
        project: {
          name: "Project",
          description:
            "Required. The name of the project in which to list topics. Format is `projects/{project-id}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the project in which to list topics. Format is `projects/{project-id}`.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description: "Optional. Maximum number of topics to return.",
          type: {
            type: "integer",
            description: "Optional. Maximum number of topics to return.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. The value returned by the last `ListTopicsResponse`; indicates that this is a continuation of a prior `ListTopics` call, and that the system should return the next page of data.",
          type: {
            type: "string",
            description:
              "Optional. The value returned by the last `ListTopicsResponse`; indicates that this is a continuation of a prior `ListTopics` call, and that the system should return the next page of data.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getPublisherClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listTopics(request, (err: any, response: any) => {
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
          topics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    'Required. Identifier. The name of the topic. It must have the format `"projects/{project}/topics/{topic}"`. `{topic}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.',
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Optional. See [Creating and managing labels] (https://cloud.google.com/pubsub/docs/labels).",
                },
                messageStoragePolicy: {
                  type: "object",
                  properties: {
                    allowedPersistenceRegions: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Optional. A list of IDs of Google Cloud regions where messages that are published to the topic may be persisted in storage. Messages published by publishers running in non-allowed Google Cloud regions (or running outside of Google Cloud altogether) are routed for storage in one of the allowed regions. An empty list means that no regions are allowed, and is not a valid configuration.",
                    },
                    enforceInTransit: {
                      type: "boolean",
                      description:
                        "Optional. If true, `allowed_persistence_regions` is also used to enforce in-transit guarantees for messages. That is, Pub/Sub will fail Publish operations on this topic and subscribe operations on any subscription attached to this topic in any region that is not in `allowed_persistence_regions`.",
                    },
                  },
                  description:
                    "A policy constraining the storage of messages published to the topic.",
                  additionalProperties: true,
                },
                kmsKeyName: {
                  type: "string",
                  description:
                    "Optional. The resource name of the Cloud KMS CryptoKey to be used to protect access to messages published on this topic.  The expected format is `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                },
                schemaSettings: {
                  type: "object",
                  properties: {
                    schema: {
                      type: "string",
                      description:
                        "Required. The name of the schema that messages published should be validated against. Format is `projects/{project}/schemas/{schema}`. The value of this field will be `_deleted-schema_` if the schema has been deleted.",
                    },
                    encoding: {
                      type: "string",
                      enum: ["ENCODING_UNSPECIFIED", "JSON", "BINARY"],
                      description: "Possible encoding types for messages.",
                    },
                    firstRevisionId: {
                      type: "string",
                      description:
                        "Optional. The minimum (inclusive) revision allowed for validating messages. If empty or not present, allow any revision to be validated against last_revision or any revision created before.",
                    },
                    lastRevisionId: {
                      type: "string",
                      description:
                        "Optional. The maximum (inclusive) revision allowed for validating messages. If empty or not present, allow any revision to be validated against first_revision or any revision created after.",
                    },
                  },
                  required: ["schema"],
                  description:
                    "Settings for validating messages published against a schema.",
                  additionalProperties: true,
                },
                satisfiesPzs: {
                  type: "boolean",
                  description:
                    "Optional. Reserved for future use. This field is set only in responses from the server; it is ignored if it is set in any requests.",
                },
                messageRetentionDuration: {
                  type: "string",
                  description: "Duration string (e.g., '1.5s', '300s')",
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
                ingestionDataSourceSettings: {
                  type: "object",
                  properties: {
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
                        streamArn: {
                          type: "string",
                          description:
                            "Required. The Kinesis stream ARN to ingest data from.",
                        },
                        consumerArn: {
                          type: "string",
                          description:
                            "Required. The Kinesis consumer ARN to used for ingestion in Enhanced Fan-Out mode. The consumer must be already created and ready to be used.",
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
                      required: [
                        "streamArn",
                        "consumerArn",
                        "awsRoleArn",
                        "gcpServiceAccount",
                      ],
                      description:
                        "Ingestion settings for Amazon Kinesis Data Streams. (Part of 'source' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    cloudStorage: {
                      type: "object",
                      properties: {
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
                        bucket: {
                          type: "string",
                          description:
                            'Optional. Cloud Storage bucket. The bucket name must be without any prefix like "gs://". See the [bucket naming requirements] (https://cloud.google.com/storage/docs/buckets#naming).',
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
                            "Configuration for reading Cloud Storage data in text format. Each line of text as specified by the delimiter will be set to the `data` field of a Pub/Sub message. (Part of 'input_format' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        avroFormat: {
                          type: "object",
                          properties: {},
                          description:
                            "Configuration for reading Cloud Storage data in Avro binary format. The bytes of each object will be set to the `data` field of a Pub/Sub message. (Part of 'input_format' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        pubsubAvroFormat: {
                          type: "object",
                          properties: {},
                          description:
                            "Configuration for reading Cloud Storage data written via [Cloud Storage subscriptions](https://cloud.google.com/pubsub/docs/cloudstorage). The data and attributes fields of the originally exported Pub/Sub message will be restored when publishing. (Part of 'input_format' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        minimumObjectCreateTime: {
                          type: "string",
                          description:
                            "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                        },
                        matchGlob: {
                          type: "string",
                          description:
                            "Optional. Glob pattern used to match objects that will be ingested. If unset, all objects will be ingested. See the [supported patterns](https://cloud.google.com/storage/docs/json_api/v1/objects/list#list-objects-and-prefixes-using-glob).",
                        },
                      },
                      description:
                        "Ingestion settings for Cloud Storage. (Part of 'source' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    azureEventHubs: {
                      type: "object",
                      properties: {
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
                        resourceGroup: {
                          type: "string",
                          description:
                            "Optional. Name of the resource group within the azure subscription.",
                        },
                        namespace: {
                          type: "string",
                          description:
                            "Optional. The name of the Event Hubs namespace.",
                        },
                        eventHub: {
                          type: "string",
                          description: "Optional. The name of the Event Hub.",
                        },
                        clientId: {
                          type: "string",
                          description:
                            "Optional. The client id of the Azure application that is being used to authenticate Pub/Sub.",
                        },
                        tenantId: {
                          type: "string",
                          description:
                            "Optional. The tenant id of the Azure application that is being used to authenticate Pub/Sub.",
                        },
                        subscriptionId: {
                          type: "string",
                          description: "Optional. The Azure subscription id.",
                        },
                        gcpServiceAccount: {
                          type: "string",
                          description:
                            "Optional. The GCP service account to be used for Federated Identity authentication.",
                        },
                      },
                      description:
                        "Ingestion settings for Azure Event Hubs. (Part of 'source' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    awsMsk: {
                      type: "object",
                      properties: {
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
                        clusterArn: {
                          type: "string",
                          description:
                            "Required. The Amazon Resource Name (ARN) that uniquely identifies the cluster.",
                        },
                        topic: {
                          type: "string",
                          description:
                            "Required. The name of the topic in the Amazon MSK cluster that Pub/Sub will import from.",
                        },
                        awsRoleArn: {
                          type: "string",
                          description:
                            "Required. AWS role ARN to be used for Federated Identity authentication with Amazon MSK. Check the Pub/Sub docs for how to set up this role and the required permissions that need to be attached to it.",
                        },
                        gcpServiceAccount: {
                          type: "string",
                          description:
                            "Required. The GCP service account to be used for Federated Identity authentication with Amazon MSK (via a `AssumeRoleWithWebIdentity` call for the provided role). The `aws_role_arn` must be set up with `accounts.google.com:sub` equals to this service account number.",
                        },
                      },
                      required: [
                        "clusterArn",
                        "topic",
                        "awsRoleArn",
                        "gcpServiceAccount",
                      ],
                      description:
                        "Ingestion settings for Amazon MSK. (Part of 'source' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    confluentCloud: {
                      type: "object",
                      properties: {
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
                        bootstrapServer: {
                          type: "string",
                          description:
                            "Required. The address of the bootstrap server. The format is url:port.",
                        },
                        clusterId: {
                          type: "string",
                          description: "Required. The id of the cluster.",
                        },
                        topic: {
                          type: "string",
                          description:
                            "Required. The name of the topic in the Confluent Cloud cluster that Pub/Sub will import from.",
                        },
                        identityPoolId: {
                          type: "string",
                          description:
                            "Required. The id of the identity pool to be used for Federated Identity authentication with Confluent Cloud. See https://docs.confluent.io/cloud/current/security/authenticate/workload-identities/identity-providers/oauth/identity-pools.html#add-oauth-identity-pools.",
                        },
                        gcpServiceAccount: {
                          type: "string",
                          description:
                            "Required. The GCP service account to be used for Federated Identity authentication with `identity_pool_id`.",
                        },
                      },
                      required: [
                        "bootstrapServer",
                        "clusterId",
                        "topic",
                        "identityPoolId",
                        "gcpServiceAccount",
                      ],
                      description:
                        "Ingestion settings for Confluent Cloud. (Part of 'source' - only one field in this group can be set)",
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
                          functionName: {
                            type: "string",
                            description:
                              "Required. Name of the JavasScript function that should applied to Pub/Sub messages.",
                          },
                          code: {
                            type: "string",
                            description:
                              "Required. JavaScript code that contains a function `function_name` with the below signature:  ```   /**   * Transforms a Pub/Sub message.    * @return {(Object<string, (string | Object<string, string>)>|null)} - To   * filter a message, return `null`. To transform a message return a map   * with the following keys:   *   - (required) 'data' : {string}   *   - (optional) 'attributes' : {Object<string, string>}   * Returning empty `attributes` will remove all attributes from the   * message.   *   * @param  {(Object<string, (string | Object<string, string>)>} Pub/Sub   * message. Keys:   *   - (required) 'data' : {string}   *   - (required) 'attributes' : {Object<string, string>}   *   * @param  {Object<string, any>} metadata - Pub/Sub message metadata.   * Keys:   *   - (optional) 'message_id'  : {string}   *   - (optional) 'publish_time': {string} YYYY-MM-DDTHH:MM:SSZ format   *   - (optional) 'ordering_key': {string}   */    function <function_name>(message, metadata) {   } ```",
                          },
                        },
                        required: ["functionName", "code"],
                        description:
                          "User-defined JavaScript function that can transform or filter a Pub/Sub message. (Part of 'transform' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      aiInference: {
                        type: "object",
                        properties: {
                          endpoint: {
                            type: "string",
                            description:
                              "Required. An endpoint to a Vertex AI model of the form `projects/{project}/locations/{location}/endpoints/{endpoint}` or `projects/{project}/locations/{location}/publishers/{publisher}/models/{model}`. Vertex AI API requests will be sent to this endpoint.",
                          },
                          unstructuredInference: {
                            type: "object",
                            properties: {
                              parameters: {
                                type: "object",
                                additionalProperties: true,
                                description:
                                  "Optional. A parameters object to be included in each inference request. The parameters object is combined with the data field of the Pub/Sub message to form the inference request.",
                              },
                            },
                            description:
                              "Configuration for making inferences using arbitrary JSON payloads.",
                            additionalProperties: true,
                          },
                          serviceAccountEmail: {
                            type: "string",
                            description:
                              "Optional. The service account to use to make prediction requests against endpoints. The resource creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent]({$universe.dns_names.final_documentation_domain}/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
                          },
                        },
                        required: ["endpoint"],
                        description:
                          "Configuration for making inference requests against Vertex AI models. (Part of 'transform' - only one field in this group can be set)",
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
              },
              required: ["name"],
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

export default listTopics;
