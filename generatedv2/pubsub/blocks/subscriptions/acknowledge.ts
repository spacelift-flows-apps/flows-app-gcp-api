import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient } from "../../lib/grpcClient.ts";

const acknowledge: AppBlock = {
  name: "Acknowledge",
  description: `Acknowledges the messages associated with the 'ack_ids' in the 'AcknowledgeRequest'. The Pub/Sub system can remove the relevant messages from the subscription. Acknowledging a message whose ack deadline has expired may succeed, but such a message may be redelivered later. Acknowledging a message more than once will not result in an error.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        subscription: {
          name: "Subscription",
          description:
            "Required. The subscription whose message is being acknowledged. Format is `projects/{project}/subscriptions/{sub}`.",
          type: {
            type: "string",
            description:
              "Required. The subscription whose message is being acknowledged. Format is `projects/{project}/subscriptions/{sub}`.",
          },
          required: true,
        },
        ack_ids: {
          name: "Ack Ids",
          description:
            "Required. The acknowledgment ID for the messages being acknowledged that was returned by the Pub/Sub system in the `Pull` response. Must not be empty.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Required. The acknowledgment ID for the messages being acknowledged that was returned by the Pub/Sub system in the `Pull` response. Must not be empty.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.subscription !== undefined)
          request.subscription = input.event.inputConfig.subscription;
        if (input.event.inputConfig.ack_ids !== undefined)
          request.ack_ids = input.event.inputConfig.ack_ids;

        const result = await new Promise<any>((resolve, reject) => {
          client.acknowledge(request, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default acknowledge;
