import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  returnImmediately: "return_immediately",
  maxMessages: "max_messages",
};

const outputMapping = {
  received_messages: {
    name: "receivedMessages",
    fields: {
      ack_id: "ackId",
      message: {
        name: "message",
        fields: {
          message_id: "messageId",
          publish_time: "publishTime",
          ordering_key: "orderingKey",
        },
      },
      delivery_attempt: "deliveryAttempt",
    },
  },
};

const pull: AppBlock = {
  name: "Pull",
  description: `Pulls messages from the server.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        subscription: {
          name: "Subscription",
          description:
            "Required. The subscription from which messages should be pulled. Format is `projects/{project}/subscriptions/{sub}`.",
          type: {
            type: "string",
            description:
              "Required. The subscription from which messages should be pulled. Format is `projects/{project}/subscriptions/{sub}`.",
          },
          required: true,
        },
        returnImmediately: {
          name: "Return Immediately",
          description:
            "Optional. If this field set to true, the system will respond immediately even if it there are no messages available to return in the `Pull` response. Otherwise, the system may wait (for a bounded amount of time) until at least one message is available, rather than returning no messages. Warning: setting this field to `true` is discouraged because it adversely impacts the performance of `Pull` operations. We recommend that users do not set this field.",
          type: {
            type: "boolean",
            description:
              "Optional. If this field set to true, the system will respond immediately even if it there are no messages available to return in the `Pull` response. Otherwise, the system may wait (for a bounded amount of time) until at least one message is available, rather than returning no messages. Warning: setting this field to `true` is discouraged because it adversely impacts the performance of `Pull` operations. We recommend that users do not set this field.",
          },
          required: false,
        },
        maxMessages: {
          name: "Max Messages",
          description:
            "Required. The maximum number of messages to return for this request. Must be a positive integer. The Pub/Sub system may return fewer than the number specified.",
          type: {
            type: "integer",
            description:
              "Required. The maximum number of messages to return for this request. Must be a positive integer. The Pub/Sub system may return fewer than the number specified.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.pull(request, (err: any, response: any) => {
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
          receivedMessages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ackId: {
                  type: "string",
                  description:
                    "Optional. This ID can be used to acknowledge the received message.",
                },
                message: {
                  type: "object",
                  properties: {
                    data: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    attributes: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Optional. Attributes for this message. If this field is empty, the message must contain non-empty data. This can be used to filter messages on the subscription.",
                    },
                    messageId: {
                      type: "string",
                      description:
                        "ID of this message, assigned by the server when the message is published. Guaranteed to be unique within the topic. This value may be read by a subscriber that receives a `PubsubMessage` via a `Pull` call or a push delivery. It must not be populated by the publisher in a `Publish` call.",
                    },
                    publishTime: {
                      type: "string",
                      description:
                        "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                    },
                    orderingKey: {
                      type: "string",
                      description:
                        "Optional. If non-empty, identifies related messages for which publish order should be respected. If a `Subscription` has `enable_message_ordering` set to `true`, messages published with the same non-empty `ordering_key` value will be delivered to subscribers in the order in which they are received by the Pub/Sub system. All `PubsubMessage`s published in a given `PublishRequest` must specify the same `ordering_key` value. For more information, see [ordering messages](https://cloud.google.com/pubsub/docs/ordering).",
                    },
                  },
                  description:
                    "A message that is published by publishers and consumed by subscribers. The message must contain either a non-empty data field or at least one attribute. Note that client libraries represent this object differently depending on the language. See the corresponding [client library documentation](https://cloud.google.com/pubsub/docs/reference/libraries) for more information. See [quotas and limits] (https://cloud.google.com/pubsub/quotas) for more information about message limits.",
                  additionalProperties: true,
                },
                deliveryAttempt: {
                  type: "integer",
                  description:
                    "Optional. The approximate number of times that Pub/Sub has attempted to deliver the associated message to a subscriber.  More precisely, this is 1 + (number of NACKs) + (number of ack_deadline exceeds) for this message.  A NACK is any call to ModifyAckDeadline with a 0 deadline. An ack_deadline exceeds event is whenever a message is not acknowledged within ack_deadline. Note that ack_deadline is initially Subscription.ackDeadlineSeconds, but may get extended automatically by the client library.  Upon the first delivery of a given message, `delivery_attempt` will have a value of 1. The value is calculated at best effort and is approximate.  If a DeadLetterPolicy is not set on the subscription, this will be 0.",
                },
              },
              description: "A message and its corresponding acknowledgment ID.",
              additionalProperties: true,
            },
            description:
              "Optional. Received Pub/Sub messages. The list will be empty if there are no more messages available in the backlog, or if no messages could be returned before the request timeout. For JSON, the response can be entirely empty. The Pub/Sub system may return fewer than the `maxMessages` requested even if there are more messages available in the backlog.",
          },
        },
        description: "Response for the `Pull` method.",
        additionalProperties: true,
      },
    },
  },
};

export default pull;
