import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const subscriptionsCreate: AppBlock = {
  name: "Subscriptions - Create",
  description: `Creates a subscription to a given topic.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Required.",
          type: {
            type: "string",
            description:
              'Required. The name of the subscription. It must have the format `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.',
          },
          required: false,
        },
        expirationPolicy: {
          name: "Expiration Policy",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              ttl: {
                type: "string",
                description:
                  'Optional. Specifies the "time-to-live" duration for an associated resource. The resource expires if it is not active for a period of `ttl`. The definition of "activity" depends on the type of the associated resource. The minimum and maximum allowed values for `ttl` depend on the type of the associated resource, as well. If `ttl` is not set, the associated resource never expires. (Format: google-duration)',
              },
            },
            description:
              "A policy that specifies the conditions for resource expiration (i.e., automatic resource deletion).",
            additionalProperties: true,
          },
          required: false,
        },
        pushConfig: {
          name: "Push Config",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              pubsubWrapper: {
                type: "object",
                properties: {},
                description:
                  "The payload to the push endpoint is in the form of the JSON representation of a PubsubMessage (https://cloud.google.com/pubsub/docs/reference/rpc/google.pubsub.v1#pubsubmessage).",
                additionalProperties: true,
              },
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
                  'Optional. Endpoint configuration attributes that can be used to control different aspects of the message delivery. The only currently supported attribute is `x-goog-version`, which you can use to change the format of the pushed message. This attribute indicates the version of the data expected by the endpoint. This controls the shape of the pushed message (i.e., its fields and metadata). If not present during the `CreateSubscription` call, it will default to the version of the Pub/Sub API used to make such call. If not present in a `ModifyPushConfig` call, its value will not be changed. `GetSubscription` calls will always return a valid version, even if the subscription was created without this attribute. The only supported values for the `x-goog-version` attribute are: * `v1beta1`: uses the push format defined in the v1beta1 Pub/Sub API. * `v1` or `v1beta2`: uses the push format defined in the v1 Pub/Sub API. For example: `attributes { "x-goog-version": "v1" }`',
              },
              noWrapper: {
                type: "object",
                properties: {
                  writeMetadata: {
                    type: "boolean",
                    description:
                      "Optional. When true, writes the Pub/Sub message metadata to `x-goog-pubsub-:` headers of the HTTP request. Writes the Pub/Sub message attributes to `:` headers of the HTTP request.",
                  },
                },
                description:
                  "Sets the `data` field as the HTTP body for delivery.",
                additionalProperties: true,
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
            },
            description: "Configuration for a push delivery endpoint.",
            additionalProperties: true,
          },
          required: false,
        },
        enableMessageOrdering: {
          name: "Enable Message Ordering",
          description: "Optional.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, messages published with the same `ordering_key` in `PubsubMessage` will be delivered to the subscribers in the order in which they are received by the Pub/Sub system. Otherwise, they may be delivered in any order.",
          },
          required: false,
        },
        messageTransforms: {
          name: "Message Transforms",
          description: "Optional.",
          type: {
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
              "Optional. Transforms to be applied to messages before they are delivered to subscribers. Transforms are applied in the order specified.",
          },
          required: false,
        },
        deadLetterPolicy: {
          name: "Dead Letter Policy",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              maxDeliveryAttempts: {
                type: "integer",
                description:
                  "Optional. The maximum number of delivery attempts for any message. The value must be between 5 and 100. The number of delivery attempts is defined as 1 + (the sum of number of NACKs and number of times the acknowledgment deadline has been exceeded for the message). A NACK is any call to ModifyAckDeadline with a 0 deadline. Note that client libraries may automatically extend ack_deadlines. This field will be honored on a best effort basis. If this parameter is 0, a default value of 5 is used. (Format: int32)",
              },
              deadLetterTopic: {
                type: "string",
                description:
                  "Optional. The name of the topic to which dead letter messages should be published. Format is `projects/{project}/topics/{topic}`.The Pub/Sub service account associated with the enclosing subscription's parent project (i.e., service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com) must have permission to Publish() to this topic. The operation will fail if the topic does not exist. Users should ensure that there is a subscription attached to this topic since messages published to a topic with no subscriptions are lost.",
              },
            },
            description:
              "Dead lettering is done on a best effort basis. The same message might be dead lettered multiple times. If validation on any of the fields fails at subscription creation/updation, the create/update subscription request will fail.",
            additionalProperties: true,
          },
          required: false,
        },
        retainAckedMessages: {
          name: "Retain Acked Messages",
          description: "Optional.",
          type: {
            type: "boolean",
            description:
              "Optional. Indicates whether to retain acknowledged messages. If true, then messages are not expunged from the subscription's backlog, even if they are acknowledged, until they fall out of the `message_retention_duration` window. This must be true if you would like to [`Seek` to a timestamp] (https://cloud.google.com/pubsub/docs/replay-overview#seek_to_a_time) in the past to replay previously-acknowledged messages.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "Optional.",
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
        retryPolicy: {
          name: "Retry Policy",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              maximumBackoff: {
                type: "string",
                description:
                  "Optional. The maximum delay between consecutive deliveries of a given message. Value should be between 0 and 600 seconds. Defaults to 600 seconds. (Format: google-duration)",
              },
              minimumBackoff: {
                type: "string",
                description:
                  "Optional. The minimum delay between consecutive deliveries of a given message. Value should be between 0 and 600 seconds. Defaults to 10 seconds. (Format: google-duration)",
              },
            },
            description:
              "A policy that specifies how Pub/Sub retries message delivery. Retry delay will be exponential based on provided minimum and maximum backoffs. https://en.wikipedia.org/wiki/Exponential_backoff. RetryPolicy will be triggered on NACKs or acknowledgment deadline exceeded events for a given message. Retry Policy is implemented on a best effort basis. At times, the delay between consecutive deliveries may not match the configuration. That is, delay can be more or less than configured backoff.",
            additionalProperties: true,
          },
          required: false,
        },
        detached: {
          name: "Detached",
          description: "Optional.",
          type: {
            type: "boolean",
            description:
              "Optional. Indicates whether the subscription is detached from its topic. Detached subscriptions don't receive messages from their topic and don't retain any backlog. `Pull` and `StreamingPull` requests will return FAILED_PRECONDITION. If the subscription is a push subscription, pushes to the endpoint will not be made.",
          },
          required: false,
        },
        cloudStorageConfig: {
          name: "Cloud Storage Config",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              maxBytes: {
                type: "string",
                description:
                  "Optional. The maximum bytes that can be written to a Cloud Storage file before a new file is created. Min 1 KB, max 10 GiB. The max_bytes limit may be exceeded in cases where messages are larger than the limit. (Format: int64)",
              },
              maxMessages: {
                type: "string",
                description:
                  "Optional. The maximum number of messages that can be written to a Cloud Storage file before a new file is created. Min 1000 messages. (Format: int64)",
              },
              maxDuration: {
                type: "string",
                description:
                  "Optional. The maximum duration that can elapse before a new Cloud Storage file is created. Min 1 minute, max 10 minutes, default 5 minutes. May not exceed the subscription's acknowledgment deadline. (Format: google-duration)",
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
                  "Configuration for writing message data in Avro format. Message payloads and metadata will be written to files as an Avro binary.",
                additionalProperties: true,
              },
              filenameDatetimeFormat: {
                type: "string",
                description:
                  "Optional. User-provided format string specifying how to represent datetimes in Cloud Storage filenames. See the [datetime format guidance](https://cloud.google.com/pubsub/docs/create-cloudstorage-subscription#file_names).",
              },
              bucket: {
                type: "string",
                description:
                  'Required. User-provided name for the Cloud Storage bucket. The bucket must be created by the user. The bucket name must be without any prefix like "gs://". See the [bucket naming requirements] (https://cloud.google.com/storage/docs/buckets#naming).',
              },
              textConfig: {
                type: "object",
                properties: {},
                description:
                  "Configuration for writing message data in text format. Message payloads will be written to files as raw text, separated by a newline.",
                additionalProperties: true,
              },
              filenamePrefix: {
                type: "string",
                description:
                  "Optional. User-provided prefix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming).",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to Cloud Storage. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
              },
              filenameSuffix: {
                type: "string",
                description:
                  'Optional. User-provided suffix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming). Must not end in "/".',
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
                ],
                description:
                  "Output only. An output-only field that indicates whether or not the subscription can receive messages.",
              },
            },
            description: "Configuration for a Cloud Storage subscription.",
            additionalProperties: true,
          },
          required: false,
        },
        messageRetentionDuration: {
          name: "Message Retention Duration",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. How long to retain unacknowledged messages in the subscription's backlog, from the moment a message is published. If `retain_acked_messages` is true, then this also configures the retention of acknowledged messages, and thus configures how far back in time a `Seek` can be done. Defaults to 7 days. Cannot be more than 31 days or less than 10 minutes. (Format: google-duration)",
          },
          required: false,
        },
        ackDeadlineSeconds: {
          name: "Ack Deadline Seconds",
          description: "Optional.",
          type: {
            type: "integer",
            description:
              "Optional. The approximate amount of time (on a best-effort basis) Pub/Sub waits for the subscriber to acknowledge receipt before resending the message. In the interval after the message is delivered and before it is acknowledged, it is considered to be _outstanding_. During that time period, the message will not be redelivered (on a best-effort basis). For pull subscriptions, this value is used as the initial value for the ack deadline. To override this value for a given message, call `ModifyAckDeadline` with the corresponding `ack_id` if using non-streaming pull or send the `ack_id` in a `StreamingModifyAckDeadlineRequest` if using streaming pull. The minimum custom deadline you can specify is 10 seconds. The maximum custom deadline you can specify is 600 seconds (10 minutes). If this parameter is 0, a default value of 10 seconds is used. For push delivery, this value is also used to set the request timeout for the call to the push endpoint. If the subscriber never acknowledges the message, the Pub/Sub system will eventually redeliver the message. (Format: int32)",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. An expression written in the Pub/Sub [filter language](https://cloud.google.com/pubsub/docs/filtering). If non-empty, then only `PubsubMessage`s whose `attributes` field matches the filter are delivered on this subscription. If empty, then no messages are filtered out.",
          },
          required: false,
        },
        topic: {
          name: "Topic",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The name of the topic from which this subscription is receiving messages. Format is `projects/{project}/topics/{topic}`. The value of this field will be `_deleted-topic_` if the topic has been deleted.",
          },
          required: false,
        },
        enableExactlyOnceDelivery: {
          name: "Enable Exactly Once Delivery",
          description: "Optional.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, Pub/Sub provides the following guarantees for the delivery of a message with a given value of `message_id` on this subscription: * The message sent to a subscriber is guaranteed not to be resent before the message's acknowledgment deadline expires. * An acknowledged message will not be resent to a subscriber. Note that subscribers may still receive multiple copies of a message when `enable_exactly_once_delivery` is true if the message was published multiple times by a publisher client. These copies are considered distinct by Pub/Sub and have distinct `message_id` values.",
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
              'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing"',
          },
          required: false,
        },
        bigqueryConfig: {
          name: "Bigquery Config",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              state: {
                type: "string",
                enum: [
                  "STATE_UNSPECIFIED",
                  "ACTIVE",
                  "PERMISSION_DENIED",
                  "NOT_FOUND",
                  "SCHEMA_MISMATCH",
                  "IN_TRANSIT_LOCATION_RESTRICTION",
                ],
                description:
                  "Output only. An output-only field that indicates whether or not the subscription can receive messages.",
              },
              useTableSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the BigQuery table's schema as the columns to write to in BigQuery. `use_table_schema` and `use_topic_schema` cannot be enabled at the same time.",
              },
              useTopicSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the topic's schema as the columns to write to in BigQuery, if it exists. `use_topic_schema` and `use_table_schema` cannot be enabled at the same time.",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to BigQuery. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
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
              table: {
                type: "string",
                description:
                  "Optional. The name of the table to which to write data, of the form {projectId}.{datasetId}.{tableId}",
              },
            },
            description: "Configuration for a BigQuery subscription.",
            additionalProperties: true,
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
        let path = `v1/{+name}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.expirationPolicy !== undefined)
          requestBody.expirationPolicy =
            input.event.inputConfig.expirationPolicy;
        if (input.event.inputConfig.pushConfig !== undefined)
          requestBody.pushConfig = input.event.inputConfig.pushConfig;
        if (input.event.inputConfig.enableMessageOrdering !== undefined)
          requestBody.enableMessageOrdering =
            input.event.inputConfig.enableMessageOrdering;
        if (input.event.inputConfig.messageTransforms !== undefined)
          requestBody.messageTransforms =
            input.event.inputConfig.messageTransforms;
        if (input.event.inputConfig.deadLetterPolicy !== undefined)
          requestBody.deadLetterPolicy =
            input.event.inputConfig.deadLetterPolicy;
        if (input.event.inputConfig.retainAckedMessages !== undefined)
          requestBody.retainAckedMessages =
            input.event.inputConfig.retainAckedMessages;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.retryPolicy !== undefined)
          requestBody.retryPolicy = input.event.inputConfig.retryPolicy;
        if (input.event.inputConfig.detached !== undefined)
          requestBody.detached = input.event.inputConfig.detached;
        if (input.event.inputConfig.cloudStorageConfig !== undefined)
          requestBody.cloudStorageConfig =
            input.event.inputConfig.cloudStorageConfig;
        if (input.event.inputConfig.messageRetentionDuration !== undefined)
          requestBody.messageRetentionDuration =
            input.event.inputConfig.messageRetentionDuration;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.ackDeadlineSeconds !== undefined)
          requestBody.ackDeadlineSeconds =
            input.event.inputConfig.ackDeadlineSeconds;
        if (input.event.inputConfig.filter !== undefined)
          requestBody.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.topic !== undefined)
          requestBody.topic = input.event.inputConfig.topic;
        if (input.event.inputConfig.enableExactlyOnceDelivery !== undefined)
          requestBody.enableExactlyOnceDelivery =
            input.event.inputConfig.enableExactlyOnceDelivery;
        if (input.event.inputConfig.tags !== undefined)
          requestBody.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.bigqueryConfig !== undefined)
          requestBody.bigqueryConfig = input.event.inputConfig.bigqueryConfig;

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
          expirationPolicy: {
            type: "object",
            properties: {
              ttl: {
                type: "string",
                description:
                  'Optional. Specifies the "time-to-live" duration for an associated resource. The resource expires if it is not active for a period of `ttl`. The definition of "activity" depends on the type of the associated resource. The minimum and maximum allowed values for `ttl` depend on the type of the associated resource, as well. If `ttl` is not set, the associated resource never expires. (Format: google-duration)',
              },
            },
            description:
              "A policy that specifies the conditions for resource expiration (i.e., automatic resource deletion).",
            additionalProperties: true,
          },
          pushConfig: {
            type: "object",
            properties: {
              pubsubWrapper: {
                type: "object",
                properties: {},
                description:
                  "The payload to the push endpoint is in the form of the JSON representation of a PubsubMessage (https://cloud.google.com/pubsub/docs/reference/rpc/google.pubsub.v1#pubsubmessage).",
                additionalProperties: true,
              },
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
                  'Optional. Endpoint configuration attributes that can be used to control different aspects of the message delivery. The only currently supported attribute is `x-goog-version`, which you can use to change the format of the pushed message. This attribute indicates the version of the data expected by the endpoint. This controls the shape of the pushed message (i.e., its fields and metadata). If not present during the `CreateSubscription` call, it will default to the version of the Pub/Sub API used to make such call. If not present in a `ModifyPushConfig` call, its value will not be changed. `GetSubscription` calls will always return a valid version, even if the subscription was created without this attribute. The only supported values for the `x-goog-version` attribute are: * `v1beta1`: uses the push format defined in the v1beta1 Pub/Sub API. * `v1` or `v1beta2`: uses the push format defined in the v1 Pub/Sub API. For example: `attributes { "x-goog-version": "v1" }`',
              },
              noWrapper: {
                type: "object",
                properties: {
                  writeMetadata: {
                    type: "boolean",
                    description:
                      "Optional. When true, writes the Pub/Sub message metadata to `x-goog-pubsub-:` headers of the HTTP request. Writes the Pub/Sub message attributes to `:` headers of the HTTP request.",
                  },
                },
                description:
                  "Sets the `data` field as the HTTP body for delivery.",
                additionalProperties: true,
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
            },
            description: "Configuration for a push delivery endpoint.",
            additionalProperties: true,
          },
          enableMessageOrdering: {
            type: "boolean",
            description:
              "Optional. If true, messages published with the same `ordering_key` in `PubsubMessage` will be delivered to the subscribers in the order in which they are received by the Pub/Sub system. Otherwise, they may be delivered in any order.",
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
              "Optional. Transforms to be applied to messages before they are delivered to subscribers. Transforms are applied in the order specified.",
          },
          deadLetterPolicy: {
            type: "object",
            properties: {
              maxDeliveryAttempts: {
                type: "integer",
                description:
                  "Optional. The maximum number of delivery attempts for any message. The value must be between 5 and 100. The number of delivery attempts is defined as 1 + (the sum of number of NACKs and number of times the acknowledgment deadline has been exceeded for the message). A NACK is any call to ModifyAckDeadline with a 0 deadline. Note that client libraries may automatically extend ack_deadlines. This field will be honored on a best effort basis. If this parameter is 0, a default value of 5 is used. (Format: int32)",
              },
              deadLetterTopic: {
                type: "string",
                description:
                  "Optional. The name of the topic to which dead letter messages should be published. Format is `projects/{project}/topics/{topic}`.The Pub/Sub service account associated with the enclosing subscription's parent project (i.e., service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com) must have permission to Publish() to this topic. The operation will fail if the topic does not exist. Users should ensure that there is a subscription attached to this topic since messages published to a topic with no subscriptions are lost.",
              },
            },
            description:
              "Dead lettering is done on a best effort basis. The same message might be dead lettered multiple times. If validation on any of the fields fails at subscription creation/updation, the create/update subscription request will fail.",
            additionalProperties: true,
          },
          analyticsHubSubscriptionInfo: {
            type: "object",
            properties: {
              subscription: {
                type: "string",
                description:
                  'Optional. The name of the associated Analytics Hub subscription resource. Pattern: "projects/{project}/locations/{location}/subscriptions/{subscription}"',
              },
              listing: {
                type: "string",
                description:
                  'Optional. The name of the associated Analytics Hub listing resource. Pattern: "projects/{project}/locations/{location}/dataExchanges/{data_exchange}/listings/{listing}"',
              },
            },
            description:
              "Information about an associated [Analytics Hub subscription](https://cloud.google.com/bigquery/docs/analytics-hub-manage-subscriptions).",
            additionalProperties: true,
          },
          retainAckedMessages: {
            type: "boolean",
            description:
              "Optional. Indicates whether to retain acknowledged messages. If true, then messages are not expunged from the subscription's backlog, even if they are acknowledged, until they fall out of the `message_retention_duration` window. This must be true if you would like to [`Seek` to a timestamp] (https://cloud.google.com/pubsub/docs/replay-overview#seek_to_a_time) in the past to replay previously-acknowledged messages.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. See [Creating and managing labels](https://cloud.google.com/pubsub/docs/labels).",
          },
          retryPolicy: {
            type: "object",
            properties: {
              maximumBackoff: {
                type: "string",
                description:
                  "Optional. The maximum delay between consecutive deliveries of a given message. Value should be between 0 and 600 seconds. Defaults to 600 seconds. (Format: google-duration)",
              },
              minimumBackoff: {
                type: "string",
                description:
                  "Optional. The minimum delay between consecutive deliveries of a given message. Value should be between 0 and 600 seconds. Defaults to 10 seconds. (Format: google-duration)",
              },
            },
            description:
              "A policy that specifies how Pub/Sub retries message delivery. Retry delay will be exponential based on provided minimum and maximum backoffs. https://en.wikipedia.org/wiki/Exponential_backoff. RetryPolicy will be triggered on NACKs or acknowledgment deadline exceeded events for a given message. Retry Policy is implemented on a best effort basis. At times, the delay between consecutive deliveries may not match the configuration. That is, delay can be more or less than configured backoff.",
            additionalProperties: true,
          },
          detached: {
            type: "boolean",
            description:
              "Optional. Indicates whether the subscription is detached from its topic. Detached subscriptions don't receive messages from their topic and don't retain any backlog. `Pull` and `StreamingPull` requests will return FAILED_PRECONDITION. If the subscription is a push subscription, pushes to the endpoint will not be made.",
          },
          topicMessageRetentionDuration: {
            type: "string",
            description:
              "Output only. Indicates the minimum duration for which a message is retained after it is published to the subscription's topic. If this field is set, messages published to the subscription's topic in the last `topic_message_retention_duration` are always available to subscribers. See the `message_retention_duration` field in `Topic`. This field is set only in responses from the server; it is ignored if it is set in any requests. (Format: google-duration)",
          },
          cloudStorageConfig: {
            type: "object",
            properties: {
              maxBytes: {
                type: "string",
                description:
                  "Optional. The maximum bytes that can be written to a Cloud Storage file before a new file is created. Min 1 KB, max 10 GiB. The max_bytes limit may be exceeded in cases where messages are larger than the limit. (Format: int64)",
              },
              maxMessages: {
                type: "string",
                description:
                  "Optional. The maximum number of messages that can be written to a Cloud Storage file before a new file is created. Min 1000 messages. (Format: int64)",
              },
              maxDuration: {
                type: "string",
                description:
                  "Optional. The maximum duration that can elapse before a new Cloud Storage file is created. Min 1 minute, max 10 minutes, default 5 minutes. May not exceed the subscription's acknowledgment deadline. (Format: google-duration)",
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
                  "Configuration for writing message data in Avro format. Message payloads and metadata will be written to files as an Avro binary.",
                additionalProperties: true,
              },
              filenameDatetimeFormat: {
                type: "string",
                description:
                  "Optional. User-provided format string specifying how to represent datetimes in Cloud Storage filenames. See the [datetime format guidance](https://cloud.google.com/pubsub/docs/create-cloudstorage-subscription#file_names).",
              },
              bucket: {
                type: "string",
                description:
                  'Required. User-provided name for the Cloud Storage bucket. The bucket must be created by the user. The bucket name must be without any prefix like "gs://". See the [bucket naming requirements] (https://cloud.google.com/storage/docs/buckets#naming).',
              },
              textConfig: {
                type: "object",
                properties: {},
                description:
                  "Configuration for writing message data in text format. Message payloads will be written to files as raw text, separated by a newline.",
                additionalProperties: true,
              },
              filenamePrefix: {
                type: "string",
                description:
                  "Optional. User-provided prefix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming).",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to Cloud Storage. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
              },
              filenameSuffix: {
                type: "string",
                description:
                  'Optional. User-provided suffix for Cloud Storage filename. See the [object naming requirements](https://cloud.google.com/storage/docs/objects#naming). Must not end in "/".',
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
                ],
                description:
                  "Output only. An output-only field that indicates whether or not the subscription can receive messages.",
              },
            },
            description: "Configuration for a Cloud Storage subscription.",
            additionalProperties: true,
          },
          messageRetentionDuration: {
            type: "string",
            description:
              "Optional. How long to retain unacknowledged messages in the subscription's backlog, from the moment a message is published. If `retain_acked_messages` is true, then this also configures the retention of acknowledged messages, and thus configures how far back in time a `Seek` can be done. Defaults to 7 days. Cannot be more than 31 days or less than 10 minutes. (Format: google-duration)",
          },
          name: {
            type: "string",
            description:
              'Required. The name of the subscription. It must have the format `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.',
          },
          ackDeadlineSeconds: {
            type: "integer",
            description:
              "Optional. The approximate amount of time (on a best-effort basis) Pub/Sub waits for the subscriber to acknowledge receipt before resending the message. In the interval after the message is delivered and before it is acknowledged, it is considered to be _outstanding_. During that time period, the message will not be redelivered (on a best-effort basis). For pull subscriptions, this value is used as the initial value for the ack deadline. To override this value for a given message, call `ModifyAckDeadline` with the corresponding `ack_id` if using non-streaming pull or send the `ack_id` in a `StreamingModifyAckDeadlineRequest` if using streaming pull. The minimum custom deadline you can specify is 10 seconds. The maximum custom deadline you can specify is 600 seconds (10 minutes). If this parameter is 0, a default value of 10 seconds is used. For push delivery, this value is also used to set the request timeout for the call to the push endpoint. If the subscriber never acknowledges the message, the Pub/Sub system will eventually redeliver the message. (Format: int32)",
          },
          filter: {
            type: "string",
            description:
              "Optional. An expression written in the Pub/Sub [filter language](https://cloud.google.com/pubsub/docs/filtering). If non-empty, then only `PubsubMessage`s whose `attributes` field matches the filter are delivered on this subscription. If empty, then no messages are filtered out.",
          },
          topic: {
            type: "string",
            description:
              "Required. The name of the topic from which this subscription is receiving messages. Format is `projects/{project}/topics/{topic}`. The value of this field will be `_deleted-topic_` if the topic has been deleted.",
          },
          enableExactlyOnceDelivery: {
            type: "boolean",
            description:
              "Optional. If true, Pub/Sub provides the following guarantees for the delivery of a message with a given value of `message_id` on this subscription: * The message sent to a subscriber is guaranteed not to be resent before the message's acknowledgment deadline expires. * An acknowledged message will not be resent to a subscriber. Note that subscribers may still receive multiple copies of a message when `enable_exactly_once_delivery` is true if the message was published multiple times by a publisher client. These copies are considered distinct by Pub/Sub and have distinct `message_id` values.",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "ACTIVE", "RESOURCE_ERROR"],
            description:
              "Output only. An output-only field indicating whether or not the subscription can receive messages.",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing"',
          },
          bigqueryConfig: {
            type: "object",
            properties: {
              state: {
                type: "string",
                enum: [
                  "STATE_UNSPECIFIED",
                  "ACTIVE",
                  "PERMISSION_DENIED",
                  "NOT_FOUND",
                  "SCHEMA_MISMATCH",
                  "IN_TRANSIT_LOCATION_RESTRICTION",
                ],
                description:
                  "Output only. An output-only field that indicates whether or not the subscription can receive messages.",
              },
              useTableSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the BigQuery table's schema as the columns to write to in BigQuery. `use_table_schema` and `use_topic_schema` cannot be enabled at the same time.",
              },
              useTopicSchema: {
                type: "boolean",
                description:
                  "Optional. When true, use the topic's schema as the columns to write to in BigQuery, if it exists. `use_topic_schema` and `use_table_schema` cannot be enabled at the same time.",
              },
              serviceAccountEmail: {
                type: "string",
                description:
                  "Optional. The service account to use to write to BigQuery. The subscription creator or updater that specifies this field must have `iam.serviceAccounts.actAs` permission on the service account. If not specified, the Pub/Sub [service agent](https://cloud.google.com/iam/docs/service-agents), service-{project_number}@gcp-sa-pubsub.iam.gserviceaccount.com, is used.",
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
              table: {
                type: "string",
                description:
                  "Optional. The name of the table to which to write data, of the form {projectId}.{datasetId}.{tableId}",
              },
            },
            description: "Configuration for a BigQuery subscription.",
            additionalProperties: true,
          },
        },
        description:
          "A subscription resource. If none of `push_config`, `bigquery_config`, or `cloud_storage_config` is set, then the subscriber will pull and ack messages using API methods. At most one of these fields may be set.",
        additionalProperties: true,
      },
    },
  },
};

export default subscriptionsCreate;
