import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient } from "../../lib/grpcClient.ts";

const createSubscription: AppBlock = {
  name: "Create Subscription",
  description: `Creates a subscription to a given topic. See the [resource name rules] (https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names). If the subscription already exists, returns 'ALREADY_EXISTS'. If the corresponding topic doesn't exist, returns 'NOT_FOUND'. If the name is not provided in the request, the server will assign a random name for this subscription on the same project as the topic, conforming to the [resource name format] (https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names). The generated name is populated in the returned Subscription object. Note that for REST API requests, you must specify a name in the request.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            'Required. Identifier. The name of the subscription. It must have the format `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.',
          type: {
            type: "string",
            description:
              'Required. Identifier. The name of the subscription. It must have the format `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.',
          },
          required: true,
        },
        topic: {
          name: "Topic",
          description:
            "Required. The name of the topic from which this subscription is receiving messages. Format is `projects/{project}/topics/{topic}`. The value of this field will be `_deleted-topic_` if the topic has been deleted.",
          type: {
            type: "string",
            description:
              "Required. The name of the topic from which this subscription is receiving messages. Format is `projects/{project}/topics/{topic}`. The value of this field will be `_deleted-topic_` if the topic has been deleted.",
          },
          required: true,
        },
        pushConfig: {
          name: "Push Config",
          description:
            "Optional. If push delivery is used with this subscription, this field is used to configure it.",
          type: {
            type: "object",
            properties: {
              pushEndpoint: {
                type: "string",
                description:
                  "Optional. A URL locating the endpoint to which messages should be pushed. For example, a Webhook endpoint might use `https://example.com/push`.",
              },
              attributes: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Optional. Endpoint configuration attributes that can be used to control different aspects of the message delivery.  The only currently supported attribute is `x-goog-version`, which you can use to change the format of the pushed message. This attribute indicates the version of the data expected by the endpoint. This controls the shape of the pushed message (i.e., its fields and metadata).  If not present during the `CreateSubscription` call, it will default to the version of the Pub/Sub API used to make such call. If not present in a `ModifyPushConfig` call, its value will not be changed. `GetSubscription` calls will always return a valid version, even if the subscription was created without this attribute.  The only supported values for the `x-goog-version` attribute are:  * `v1beta1`: uses the push format defined in the v1beta1 Pub/Sub API. * `v1` or `v1beta2`: uses the push format defined in the v1 Pub/Sub API.  For example: `attributes { "x-goog-version": "v1" }`',
              },
              oidcToken: {
                type: "object",
                properties: {
                  serviceAccountEmail: {
                    type: "string",
                    description:
                      "Optional. [Service account email](https://cloud.google.com/iam/docs/service-accounts) used for generating the OIDC token. For more information on setting up authentication, see [Push subscriptions](https://cloud.google.com/pubsub/docs/push).",
                  },
                  audience: {
                    type: "string",
                    description:
                      "Optional. Audience to be used when generating OIDC token. The audience claim identifies the recipients that the JWT is intended for. The audience value is a single case-sensitive string. Having multiple values (array) for the audience field is not supported. More info about the OIDC JWT token audience here: https://tools.ietf.org/html/rfc7519#section-4.1.3 Note: if not specified, the Push endpoint URL will be used.",
                  },
                },
                description:
                  "Contains information needed for generating an [OpenID Connect token](https://developers.google.com/identity/protocols/OpenIDConnect).",
                additionalProperties: true,
              },
              pubsubWrapper: {
                type: "object",
                properties: {},
                description:
                  "The payload to the push endpoint is in the form of the JSON representation of a PubsubMessage (https://cloud.google.com/pubsub/docs/reference/rpc/google.pubsub.v1#pubsubmessage). (Part of 'wrapper' - only one field in this group can be set)",
                additionalProperties: true,
              },
              noWrapper: {
                type: "object",
                properties: {
                  writeMetadata: {
                    type: "boolean",
                    description:
                      "Optional. When true, writes the Pub/Sub message metadata to `x-goog-pubsub-<KEY>:<VAL>` headers of the HTTP request. Writes the Pub/Sub message attributes to `<KEY>:<VAL>` headers of the HTTP request.",
                  },
                },
                description:
                  "Sets the `data` field as the HTTP body for delivery. (Part of 'wrapper' - only one field in this group can be set)",
                additionalProperties: true,
              },
            },
            description: "Configuration for a push delivery endpoint.",
            additionalProperties: true,
          },
          required: false,
        },
        bigqueryConfig: {
          name: "Bigquery Config",
          description:
            "Optional. If delivery to BigQuery is used with this subscription, this field is used to configure it.",
          type: {
            type: "object",
            properties: {
              table: {
                type: "string",
                description:
                  "Optional. The name of the table to which to write data, of the form {projectId}.{datasetId}.{tableId}",
              },
              useTopicSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the topic's schema as the columns to write to in BigQuery, if it exists. `use_topic_schema` and `use_table_schema` cannot be enabled at the same time.",
              },
              writeMetadata: {
                type: "boolean",
                description:
                  "Optional. When true, write the subscription name, message_id, publish_time, attributes, and ordering_key to additional columns in the table. The subscription name, message_id, and publish_time fields are put in their own columns while all other message properties (other than data) are written to a JSON object in the attributes column.",
              },
              dropUnknownFields: {
                type: "boolean",
                description:
                  "Optional. When true and use_topic_schema is true, any fields that are a part of the topic schema that are not part of the BigQuery table schema are dropped when writing to BigQuery. Otherwise, the schemas must be kept in sync and any messages with extra fields are not written and remain in the subscription's backlog.",
              },
              useTableSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the BigQuery table's schema as the columns to write to in BigQuery. `use_table_schema` and `use_topic_schema` cannot be enabled at the same time.",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to BigQuery. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
              },
            },
            description: "Configuration for a BigQuery subscription.",
            additionalProperties: true,
          },
          required: false,
        },
        cloudStorageConfig: {
          name: "Cloud Storage Config",
          description:
            "Optional. If delivery to Google Cloud Storage is used with this subscription, this field is used to configure it.",
          type: {
            type: "object",
            properties: {
              bucket: {
                type: "string",
                description:
                  'Required. User-provided name for the Cloud Storage bucket. The bucket must be created by the user. The bucket name must be without any prefix like "gs://". See the [bucket naming requirements] (https://cloud.google.com/storage/docs/buckets#naming).',
              },
              filenamePrefix: {
                type: "string",
                description:
                  "Optional. User-provided prefix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming).",
              },
              filenameSuffix: {
                type: "string",
                description:
                  'Optional. User-provided suffix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming). Must not end in "/".',
              },
              filenameDatetimeFormat: {
                type: "string",
                description:
                  "Optional. User-provided format string specifying how to represent datetimes in Cloud Storage filenames. See the [datetime format guidance](https://cloud.google.com/pubsub/docs/create-cloudstorage-subscription#file_names).",
              },
              textConfig: {
                type: "object",
                properties: {},
                description:
                  "Configuration for writing message data in text format. Message payloads will be written to files as raw text, separated by a newline. (Part of 'output_format' - only one field in this group can be set)",
                additionalProperties: true,
              },
              avroConfig: {
                type: "object",
                properties: {
                  writeMetadata: {
                    type: "boolean",
                    description:
                      "Optional. When true, write the subscription name, message_id, publish_time, attributes, and ordering_key as additional fields in the output. The subscription name, message_id, and publish_time fields are put in their own fields while all other message properties other than data (for example, an ordering_key, if present) are added as entries in the attributes map.",
                  },
                  useTopicSchema: {
                    type: "boolean",
                    description:
                      "Optional. When true, the output Cloud Storage file will be serialized using the topic schema, if it exists.",
                  },
                },
                description:
                  "Configuration for writing message data in Avro format. Message payloads and metadata will be written to files as an Avro binary. (Part of 'output_format' - only one field in this group can be set)",
                additionalProperties: true,
              },
              maxDuration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              maxBytes: {
                type: "string",
                description: "64-bit integer as string",
              },
              maxMessages: {
                type: "string",
                description: "64-bit integer as string",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to Cloud Storage. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
              },
            },
            required: ["bucket"],
            description: "Configuration for a Cloud Storage subscription.",
            additionalProperties: true,
          },
          required: false,
        },
        ackDeadlineSeconds: {
          name: "Ack Deadline Seconds",
          description:
            "Optional. The approximate amount of time (on a best-effort basis) Pub/Sub waits for the subscriber to acknowledge receipt before resending the message. In the interval after the message is delivered and before it is acknowledged, it is considered to be _outstanding_. During that time period, the message will not be redelivered (on a best-effort basis).  For pull subscriptions, this value is used as the initial value for the ack deadline. To override this value for a given message, call `ModifyAckDeadline` with the corresponding `ack_id` if using non-streaming pull or send the `ack_id` in a `StreamingModifyAckDeadlineRequest` if using streaming pull. The minimum custom deadline you can specify is 10 seconds. The maximum custom deadline you can specify is 600 seconds (10 minutes). If this parameter is 0, a default value of 10 seconds is used.  For push delivery, this value is also used to set the request timeout for the call to the push endpoint.  If the subscriber never acknowledges the message, the Pub/Sub system will eventually redeliver the message.",
          type: {
            type: "integer",
            description:
              "Optional. The approximate amount of time (on a best-effort basis) Pub/Sub waits for the subscriber to acknowledge receipt before resending the message. In the interval after the message is delivered and before it is acknowledged, it is considered to be _outstanding_. During that time period, the message will not be redelivered (on a best-effort basis).  For pull subscriptions, this value is used as the initial value for the ack deadline. To override this value for a given message, call `ModifyAckDeadline` with the corresponding `ack_id` if using non-streaming pull or send the `ack_id` in a `StreamingModifyAckDeadlineRequest` if using streaming pull. The minimum custom deadline you can specify is 10 seconds. The maximum custom deadline you can specify is 600 seconds (10 minutes). If this parameter is 0, a default value of 10 seconds is used.  For push delivery, this value is also used to set the request timeout for the call to the push endpoint.  If the subscriber never acknowledges the message, the Pub/Sub system will eventually redeliver the message.",
          },
          required: false,
        },
        retainAckedMessages: {
          name: "Retain Acked Messages",
          description:
            "Optional. Indicates whether to retain acknowledged messages. If true, then messages are not expunged from the subscription's backlog, even if they are acknowledged, until they fall out of the `message_retention_duration` window. This must be true if you would like to [`Seek` to a timestamp] (https://cloud.google.com/pubsub/docs/replay-overview#seek_to_a_time) in the past to replay previously-acknowledged messages.",
          type: {
            type: "boolean",
            description:
              "Optional. Indicates whether to retain acknowledged messages. If true, then messages are not expunged from the subscription's backlog, even if they are acknowledged, until they fall out of the `message_retention_duration` window. This must be true if you would like to [`Seek` to a timestamp] (https://cloud.google.com/pubsub/docs/replay-overview#seek_to_a_time) in the past to replay previously-acknowledged messages.",
          },
          required: false,
        },
        messageRetentionDuration: {
          name: "Message Retention Duration",
          description:
            "Optional. How long to retain unacknowledged messages in the subscription's backlog, from the moment a message is published. If `retain_acked_messages` is true, then this also configures the retention of acknowledged messages, and thus configures how far back in time a `Seek` can be done. Defaults to 7 days. Cannot be more than 31 days or less than 10 minutes.",
          type: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "Optional. See [Creating and managing labels](https://cloud.google.com/pubsub/docs/labels).",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. See [Creating and managing labels](https://cloud.google.com/pubsub/docs/labels).",
          },
          required: false,
        },
        enableMessageOrdering: {
          name: "Enable Message Ordering",
          description:
            "Optional. If true, messages published with the same `ordering_key` in `PubsubMessage` will be delivered to the subscribers in the order in which they are received by the Pub/Sub system. Otherwise, they may be delivered in any order.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, messages published with the same `ordering_key` in `PubsubMessage` will be delivered to the subscribers in the order in which they are received by the Pub/Sub system. Otherwise, they may be delivered in any order.",
          },
          required: false,
        },
        expirationPolicy: {
          name: "Expiration Policy",
          description:
            "Optional. A policy that specifies the conditions for this subscription's expiration. A subscription is considered active as long as any connected subscriber is successfully consuming messages from the subscription or is issuing operations on the subscription. If `expiration_policy` is not set, a *default policy* with `ttl` of 31 days will be used. The minimum allowed value for `expiration_policy.ttl` is 1 day. If `expiration_policy` is set, but `expiration_policy.ttl` is not set, the subscription never expires.",
          type: {
            type: "object",
            properties: {
              ttl: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
            },
            description:
              "A policy that specifies the conditions for resource expiration (i.e., automatic resource deletion).",
            additionalProperties: true,
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. An expression written in the Pub/Sub [filter language](https://cloud.google.com/pubsub/docs/filtering). If non-empty, then only `PubsubMessage`s whose `attributes` field matches the filter are delivered on this subscription. If empty, then no messages are filtered out.",
          type: {
            type: "string",
            description:
              "Optional. An expression written in the Pub/Sub [filter language](https://cloud.google.com/pubsub/docs/filtering). If non-empty, then only `PubsubMessage`s whose `attributes` field matches the filter are delivered on this subscription. If empty, then no messages are filtered out.",
          },
          required: false,
        },
        deadLetterPolicy: {
          name: "Dead Letter Policy",
          description:
            "Optional. A policy that specifies the conditions for dead lettering messages in this subscription. If dead_letter_policy is not set, dead lettering is disabled.  The Pub/Sub service account associated with this subscriptions's parent project (i.e., service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com) must have permission to Acknowledge() messages on this subscription.",
          type: {
            type: "object",
            properties: {
              deadLetterTopic: {
                type: "string",
                description:
                  "Optional. The name of the topic to which dead letter messages should be published. Format is `projects/{project}/topics/{topic}`.The Pub/Sub service account associated with the enclosing subscription's parent project (i.e., service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com) must have permission to Publish() to this topic.  The operation will fail if the topic does not exist. Users should ensure that there is a subscription attached to this topic since messages published to a topic with no subscriptions are lost.",
              },
              maxDeliveryAttempts: {
                type: "integer",
                description:
                  "Optional. The maximum number of delivery attempts for any message. The value must be between 5 and 100.  The number of delivery attempts is defined as 1 + (the sum of number of NACKs and number of times the acknowledgment deadline has been exceeded for the message).  A NACK is any call to ModifyAckDeadline with a 0 deadline. Note that client libraries may automatically extend ack_deadlines.  This field will be honored on a best effort basis.  If this parameter is 0, a default value of 5 is used.",
              },
            },
            description:
              "Dead lettering is done on a best effort basis. The same message might be dead lettered multiple times.  If validation on any of the fields fails at subscription creation/updation, the create/update subscription request will fail.",
            additionalProperties: true,
          },
          required: false,
        },
        retryPolicy: {
          name: "Retry Policy",
          description:
            "Optional. A policy that specifies how Pub/Sub retries message delivery for this subscription.  If not set, the default retry policy is applied. This generally implies that messages will be retried as soon as possible for healthy subscribers. RetryPolicy will be triggered on NACKs or acknowledgment deadline exceeded events for a given message.",
          type: {
            type: "object",
            properties: {
              minimumBackoff: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              maximumBackoff: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
            },
            description:
              "A policy that specifies how Pub/Sub retries message delivery.  Retry delay will be exponential based on provided minimum and maximum backoffs. https://en.wikipedia.org/wiki/Exponential_backoff.  RetryPolicy will be triggered on NACKs or acknowledgment deadline exceeded events for a given message.  Retry Policy is implemented on a best effort basis. At times, the delay between consecutive deliveries may not match the configuration. That is, delay can be more or less than configured backoff.",
            additionalProperties: true,
          },
          required: false,
        },
        detached: {
          name: "Detached",
          description:
            "Optional. Indicates whether the subscription is detached from its topic. Detached subscriptions don't receive messages from their topic and don't retain any backlog. `Pull` and `StreamingPull` requests will return FAILED_PRECONDITION. If the subscription is a push subscription, pushes to the endpoint will not be made.",
          type: {
            type: "boolean",
            description:
              "Optional. Indicates whether the subscription is detached from its topic. Detached subscriptions don't receive messages from their topic and don't retain any backlog. `Pull` and `StreamingPull` requests will return FAILED_PRECONDITION. If the subscription is a push subscription, pushes to the endpoint will not be made.",
          },
          required: false,
        },
        enableExactlyOnceDelivery: {
          name: "Enable Exactly Once Delivery",
          description:
            "Optional. If true, Pub/Sub provides the following guarantees for the delivery of a message with a given value of `message_id` on this subscription:  * The message sent to a subscriber is guaranteed not to be resent before the message's acknowledgment deadline expires. * An acknowledged message will not be resent to a subscriber.  Note that subscribers may still receive multiple copies of a message when `enable_exactly_once_delivery` is true if the message was published multiple times by a publisher client. These copies are  considered distinct by Pub/Sub and have distinct `message_id` values.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, Pub/Sub provides the following guarantees for the delivery of a message with a given value of `message_id` on this subscription:  * The message sent to a subscriber is guaranteed not to be resent before the message's acknowledgment deadline expires. * An acknowledged message will not be resent to a subscriber.  Note that subscribers may still receive multiple copies of a message when `enable_exactly_once_delivery` is true if the message was published multiple times by a publisher client. These copies are  considered distinct by Pub/Sub and have distinct `message_id` values.",
          },
          required: false,
        },
        messageTransforms: {
          name: "Message Transforms",
          description:
            "Optional. Transforms to be applied to messages before they are delivered to subscribers. Transforms are applied in the order specified.",
          type: {
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
              "Optional. Transforms to be applied to messages before they are delivered to subscribers. Transforms are applied in the order specified.",
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description:
            'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example:   "123/environment": "production",   "123/costCenter": "marketing" See https://docs.cloud.google.com/pubsub/docs/tags for more information on using tags with Pub/Sub resources.',
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example:   "123/environment": "production",   "123/costCenter": "marketing" See https://docs.cloud.google.com/pubsub/docs/tags for more information on using tags with Pub/Sub resources.',
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.topic !== undefined)
          request.topic = input.event.inputConfig.topic;
        if (input.event.inputConfig.pushConfig !== undefined)
          request.pushConfig = input.event.inputConfig.pushConfig;
        if (input.event.inputConfig.bigqueryConfig !== undefined)
          request.bigqueryConfig = input.event.inputConfig.bigqueryConfig;
        if (input.event.inputConfig.cloudStorageConfig !== undefined)
          request.cloudStorageConfig =
            input.event.inputConfig.cloudStorageConfig;
        if (input.event.inputConfig.ackDeadlineSeconds !== undefined)
          request.ackDeadlineSeconds =
            input.event.inputConfig.ackDeadlineSeconds;
        if (input.event.inputConfig.retainAckedMessages !== undefined)
          request.retainAckedMessages =
            input.event.inputConfig.retainAckedMessages;
        if (input.event.inputConfig.messageRetentionDuration !== undefined)
          request.messageRetentionDuration =
            input.event.inputConfig.messageRetentionDuration;
        if (input.event.inputConfig.labels !== undefined)
          request.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.enableMessageOrdering !== undefined)
          request.enableMessageOrdering =
            input.event.inputConfig.enableMessageOrdering;
        if (input.event.inputConfig.expirationPolicy !== undefined)
          request.expirationPolicy = input.event.inputConfig.expirationPolicy;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.deadLetterPolicy !== undefined)
          request.deadLetterPolicy = input.event.inputConfig.deadLetterPolicy;
        if (input.event.inputConfig.retryPolicy !== undefined)
          request.retryPolicy = input.event.inputConfig.retryPolicy;
        if (input.event.inputConfig.detached !== undefined)
          request.detached = input.event.inputConfig.detached;
        if (input.event.inputConfig.enableExactlyOnceDelivery !== undefined)
          request.enableExactlyOnceDelivery =
            input.event.inputConfig.enableExactlyOnceDelivery;
        if (input.event.inputConfig.messageTransforms !== undefined)
          request.messageTransforms = input.event.inputConfig.messageTransforms;
        if (input.event.inputConfig.tags !== undefined)
          request.tags = input.event.inputConfig.tags;

        const result = await new Promise<any>((resolve, reject) => {
          client.createSubscription(request, (err: any, response: any) => {
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
              'Required. Identifier. The name of the subscription. It must have the format `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.',
          },
          topic: {
            type: "string",
            description:
              "Required. The name of the topic from which this subscription is receiving messages. Format is `projects/{project}/topics/{topic}`. The value of this field will be `_deleted-topic_` if the topic has been deleted.",
          },
          pushConfig: {
            type: "object",
            properties: {
              pushEndpoint: {
                type: "string",
                description:
                  "Optional. A URL locating the endpoint to which messages should be pushed. For example, a Webhook endpoint might use `https://example.com/push`.",
              },
              attributes: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Optional. Endpoint configuration attributes that can be used to control different aspects of the message delivery.  The only currently supported attribute is `x-goog-version`, which you can use to change the format of the pushed message. This attribute indicates the version of the data expected by the endpoint. This controls the shape of the pushed message (i.e., its fields and metadata).  If not present during the `CreateSubscription` call, it will default to the version of the Pub/Sub API used to make such call. If not present in a `ModifyPushConfig` call, its value will not be changed. `GetSubscription` calls will always return a valid version, even if the subscription was created without this attribute.  The only supported values for the `x-goog-version` attribute are:  * `v1beta1`: uses the push format defined in the v1beta1 Pub/Sub API. * `v1` or `v1beta2`: uses the push format defined in the v1 Pub/Sub API.  For example: `attributes { "x-goog-version": "v1" }`',
              },
              oidcToken: {
                type: "object",
                properties: {
                  serviceAccountEmail: {
                    type: "string",
                    description:
                      "Optional. [Service account email](https://cloud.google.com/iam/docs/service-accounts) used for generating the OIDC token. For more information on setting up authentication, see [Push subscriptions](https://cloud.google.com/pubsub/docs/push).",
                  },
                  audience: {
                    type: "string",
                    description:
                      "Optional. Audience to be used when generating OIDC token. The audience claim identifies the recipients that the JWT is intended for. The audience value is a single case-sensitive string. Having multiple values (array) for the audience field is not supported. More info about the OIDC JWT token audience here: https://tools.ietf.org/html/rfc7519#section-4.1.3 Note: if not specified, the Push endpoint URL will be used.",
                  },
                },
                description:
                  "Contains information needed for generating an [OpenID Connect token](https://developers.google.com/identity/protocols/OpenIDConnect).",
                additionalProperties: true,
              },
              pubsubWrapper: {
                type: "object",
                properties: {},
                description:
                  "The payload to the push endpoint is in the form of the JSON representation of a PubsubMessage (https://cloud.google.com/pubsub/docs/reference/rpc/google.pubsub.v1#pubsubmessage). (Part of 'wrapper' - only one field in this group can be set)",
                additionalProperties: true,
              },
              noWrapper: {
                type: "object",
                properties: {
                  writeMetadata: {
                    type: "boolean",
                    description:
                      "Optional. When true, writes the Pub/Sub message metadata to `x-goog-pubsub-<KEY>:<VAL>` headers of the HTTP request. Writes the Pub/Sub message attributes to `<KEY>:<VAL>` headers of the HTTP request.",
                  },
                },
                description:
                  "Sets the `data` field as the HTTP body for delivery. (Part of 'wrapper' - only one field in this group can be set)",
                additionalProperties: true,
              },
            },
            description: "Configuration for a push delivery endpoint.",
            additionalProperties: true,
          },
          bigqueryConfig: {
            type: "object",
            properties: {
              table: {
                type: "string",
                description:
                  "Optional. The name of the table to which to write data, of the form {projectId}.{datasetId}.{tableId}",
              },
              useTopicSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the topic's schema as the columns to write to in BigQuery, if it exists. `use_topic_schema` and `use_table_schema` cannot be enabled at the same time.",
              },
              writeMetadata: {
                type: "boolean",
                description:
                  "Optional. When true, write the subscription name, message_id, publish_time, attributes, and ordering_key to additional columns in the table. The subscription name, message_id, and publish_time fields are put in their own columns while all other message properties (other than data) are written to a JSON object in the attributes column.",
              },
              dropUnknownFields: {
                type: "boolean",
                description:
                  "Optional. When true and use_topic_schema is true, any fields that are a part of the topic schema that are not part of the BigQuery table schema are dropped when writing to BigQuery. Otherwise, the schemas must be kept in sync and any messages with extra fields are not written and remain in the subscription's backlog.",
              },
              state: {
                type: "string",
                enum: [
                  "STATE_UNSPECIFIED",
                  "ACTIVE",
                  "PERMISSION_DENIED",
                  "NOT_FOUND",
                  "SCHEMA_MISMATCH",
                  "IN_TRANSIT_LOCATION_RESTRICTION",
                  "VERTEX_AI_LOCATION_RESTRICTION",
                ],
                description:
                  "Output only. An output-only field that indicates whether or not the subscription can receive messages.",
              },
              useTableSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the BigQuery table's schema as the columns to write to in BigQuery. `use_table_schema` and `use_topic_schema` cannot be enabled at the same time.",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to BigQuery. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
              },
            },
            description: "Configuration for a BigQuery subscription.",
            additionalProperties: true,
          },
          cloudStorageConfig: {
            type: "object",
            properties: {
              bucket: {
                type: "string",
                description:
                  'Required. User-provided name for the Cloud Storage bucket. The bucket must be created by the user. The bucket name must be without any prefix like "gs://". See the [bucket naming requirements] (https://cloud.google.com/storage/docs/buckets#naming).',
              },
              filenamePrefix: {
                type: "string",
                description:
                  "Optional. User-provided prefix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming).",
              },
              filenameSuffix: {
                type: "string",
                description:
                  'Optional. User-provided suffix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming). Must not end in "/".',
              },
              filenameDatetimeFormat: {
                type: "string",
                description:
                  "Optional. User-provided format string specifying how to represent datetimes in Cloud Storage filenames. See the [datetime format guidance](https://cloud.google.com/pubsub/docs/create-cloudstorage-subscription#file_names).",
              },
              textConfig: {
                type: "object",
                properties: {},
                description:
                  "Configuration for writing message data in text format. Message payloads will be written to files as raw text, separated by a newline. (Part of 'output_format' - only one field in this group can be set)",
                additionalProperties: true,
              },
              avroConfig: {
                type: "object",
                properties: {
                  writeMetadata: {
                    type: "boolean",
                    description:
                      "Optional. When true, write the subscription name, message_id, publish_time, attributes, and ordering_key as additional fields in the output. The subscription name, message_id, and publish_time fields are put in their own fields while all other message properties other than data (for example, an ordering_key, if present) are added as entries in the attributes map.",
                  },
                  useTopicSchema: {
                    type: "boolean",
                    description:
                      "Optional. When true, the output Cloud Storage file will be serialized using the topic schema, if it exists.",
                  },
                },
                description:
                  "Configuration for writing message data in Avro format. Message payloads and metadata will be written to files as an Avro binary. (Part of 'output_format' - only one field in this group can be set)",
                additionalProperties: true,
              },
              maxDuration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              maxBytes: {
                type: "string",
                description: "64-bit integer as string",
              },
              maxMessages: {
                type: "string",
                description: "64-bit integer as string",
              },
              state: {
                type: "string",
                enum: [
                  "STATE_UNSPECIFIED",
                  "ACTIVE",
                  "PERMISSION_DENIED",
                  "NOT_FOUND",
                  "IN_TRANSIT_LOCATION_RESTRICTION",
                  "SCHEMA_MISMATCH",
                  "VERTEX_AI_LOCATION_RESTRICTION",
                ],
                description:
                  "Output only. An output-only field that indicates whether or not the subscription can receive messages.",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to Cloud Storage. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
              },
            },
            required: ["bucket"],
            description: "Configuration for a Cloud Storage subscription.",
            additionalProperties: true,
          },
          ackDeadlineSeconds: {
            type: "integer",
            description:
              "Optional. The approximate amount of time (on a best-effort basis) Pub/Sub waits for the subscriber to acknowledge receipt before resending the message. In the interval after the message is delivered and before it is acknowledged, it is considered to be _outstanding_. During that time period, the message will not be redelivered (on a best-effort basis).  For pull subscriptions, this value is used as the initial value for the ack deadline. To override this value for a given message, call `ModifyAckDeadline` with the corresponding `ack_id` if using non-streaming pull or send the `ack_id` in a `StreamingModifyAckDeadlineRequest` if using streaming pull. The minimum custom deadline you can specify is 10 seconds. The maximum custom deadline you can specify is 600 seconds (10 minutes). If this parameter is 0, a default value of 10 seconds is used.  For push delivery, this value is also used to set the request timeout for the call to the push endpoint.  If the subscriber never acknowledges the message, the Pub/Sub system will eventually redeliver the message.",
          },
          retainAckedMessages: {
            type: "boolean",
            description:
              "Optional. Indicates whether to retain acknowledged messages. If true, then messages are not expunged from the subscription's backlog, even if they are acknowledged, until they fall out of the `message_retention_duration` window. This must be true if you would like to [`Seek` to a timestamp] (https://cloud.google.com/pubsub/docs/replay-overview#seek_to_a_time) in the past to replay previously-acknowledged messages.",
          },
          messageRetentionDuration: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. See [Creating and managing labels](https://cloud.google.com/pubsub/docs/labels).",
          },
          enableMessageOrdering: {
            type: "boolean",
            description:
              "Optional. If true, messages published with the same `ordering_key` in `PubsubMessage` will be delivered to the subscribers in the order in which they are received by the Pub/Sub system. Otherwise, they may be delivered in any order.",
          },
          expirationPolicy: {
            type: "object",
            properties: {
              ttl: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
            },
            description:
              "A policy that specifies the conditions for resource expiration (i.e., automatic resource deletion).",
            additionalProperties: true,
          },
          filter: {
            type: "string",
            description:
              "Optional. An expression written in the Pub/Sub [filter language](https://cloud.google.com/pubsub/docs/filtering). If non-empty, then only `PubsubMessage`s whose `attributes` field matches the filter are delivered on this subscription. If empty, then no messages are filtered out.",
          },
          deadLetterPolicy: {
            type: "object",
            properties: {
              deadLetterTopic: {
                type: "string",
                description:
                  "Optional. The name of the topic to which dead letter messages should be published. Format is `projects/{project}/topics/{topic}`.The Pub/Sub service account associated with the enclosing subscription's parent project (i.e., service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com) must have permission to Publish() to this topic.  The operation will fail if the topic does not exist. Users should ensure that there is a subscription attached to this topic since messages published to a topic with no subscriptions are lost.",
              },
              maxDeliveryAttempts: {
                type: "integer",
                description:
                  "Optional. The maximum number of delivery attempts for any message. The value must be between 5 and 100.  The number of delivery attempts is defined as 1 + (the sum of number of NACKs and number of times the acknowledgment deadline has been exceeded for the message).  A NACK is any call to ModifyAckDeadline with a 0 deadline. Note that client libraries may automatically extend ack_deadlines.  This field will be honored on a best effort basis.  If this parameter is 0, a default value of 5 is used.",
              },
            },
            description:
              "Dead lettering is done on a best effort basis. The same message might be dead lettered multiple times.  If validation on any of the fields fails at subscription creation/updation, the create/update subscription request will fail.",
            additionalProperties: true,
          },
          retryPolicy: {
            type: "object",
            properties: {
              minimumBackoff: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              maximumBackoff: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
            },
            description:
              "A policy that specifies how Pub/Sub retries message delivery.  Retry delay will be exponential based on provided minimum and maximum backoffs. https://en.wikipedia.org/wiki/Exponential_backoff.  RetryPolicy will be triggered on NACKs or acknowledgment deadline exceeded events for a given message.  Retry Policy is implemented on a best effort basis. At times, the delay between consecutive deliveries may not match the configuration. That is, delay can be more or less than configured backoff.",
            additionalProperties: true,
          },
          detached: {
            type: "boolean",
            description:
              "Optional. Indicates whether the subscription is detached from its topic. Detached subscriptions don't receive messages from their topic and don't retain any backlog. `Pull` and `StreamingPull` requests will return FAILED_PRECONDITION. If the subscription is a push subscription, pushes to the endpoint will not be made.",
          },
          enableExactlyOnceDelivery: {
            type: "boolean",
            description:
              "Optional. If true, Pub/Sub provides the following guarantees for the delivery of a message with a given value of `message_id` on this subscription:  * The message sent to a subscriber is guaranteed not to be resent before the message's acknowledgment deadline expires. * An acknowledged message will not be resent to a subscriber.  Note that subscribers may still receive multiple copies of a message when `enable_exactly_once_delivery` is true if the message was published multiple times by a publisher client. These copies are  considered distinct by Pub/Sub and have distinct `message_id` values.",
          },
          topicMessageRetentionDuration: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "ACTIVE", "RESOURCE_ERROR"],
            description:
              "Output only. An output-only field indicating whether or not the subscription can receive messages.",
          },
          analyticsHubSubscriptionInfo: {
            type: "object",
            properties: {
              listing: {
                type: "string",
                description:
                  'Optional. The name of the associated Analytics Hub listing resource. Pattern: "projects/{project}/locations/{location}/dataExchanges/{data_exchange}/listings/{listing}"',
              },
              subscription: {
                type: "string",
                description:
                  'Optional. The name of the associated Analytics Hub subscription resource. Pattern: "projects/{project}/locations/{location}/subscriptions/{subscription}"',
              },
            },
            description:
              "Information about an associated [Analytics Hub subscription](https://cloud.google.com/bigquery/docs/analytics-hub-manage-subscriptions).",
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
              "Optional. Transforms to be applied to messages before they are delivered to subscribers. Transforms are applied in the order specified.",
          },
        },
        required: ["name", "topic"],
        description:
          "A subscription resource. If none of `push_config`, `bigquery_config`, or `cloud_storage_config` is set, then the subscriber will pull and ack messages using API methods. At most one of these fields may be set.",
        additionalProperties: true,
      },
    },
  },
};

export default createSubscription;
