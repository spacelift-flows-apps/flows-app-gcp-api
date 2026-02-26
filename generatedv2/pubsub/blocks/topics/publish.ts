import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getPublisherClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const publish: AppBlock = {
  name: "Publish",
  description: `Adds one or more messages to the topic. Returns 'NOT_FOUND' if the topic does not exist.`,
  category: "Topics",
  inputs: {
    default: {
      config: {
        topic: {
          name: "Topic",
          description:
            "Required. The messages in the request will be published on this topic. Format is `projects/{project}/topics/{topic}`.",
          type: {
            type: "string",
            description:
              "Required. The messages in the request will be published on this topic. Format is `projects/{project}/topics/{topic}`.",
          },
          required: true,
        },
        messages: {
          name: "Messages",
          description: "Required. The messages to publish.",
          type: {
            type: "array",
            items: {
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
            description: "Required. The messages to publish.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPublisherClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.topic !== undefined)
          request.topic = input.event.inputConfig.topic;
        if (input.event.inputConfig.messages !== undefined)
          request.messages = input.event.inputConfig.messages;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.publish(protoRequest, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        await events.emit(result ? toCamelCase(result) : {});
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          messageIds: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Optional. The server-assigned ID of each published message, in the same order as the messages in the request. IDs are guaranteed to be unique within the topic.",
          },
        },
        description: "Response for the `Publish` method.",
        additionalProperties: true,
      },
    },
  },
};

export default publish;
