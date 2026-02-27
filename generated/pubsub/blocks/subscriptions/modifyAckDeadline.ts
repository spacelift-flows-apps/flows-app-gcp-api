import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  ackIds: "ack_ids",
  ackDeadlineSeconds: "ack_deadline_seconds",
};

const modifyAckDeadline: AppBlock = {
  name: "Modify Ack Deadline",
  description: `Modifies the ack deadline for a specific message. This method is useful to indicate that more time is needed to process a message by the subscriber, or to make the message available for redelivery if the processing was interrupted. Note that this does not modify the subscription-level 'ackDeadlineSeconds' used for subsequent messages.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        subscription: {
          name: "Subscription",
          description:
            "Required. The name of the subscription. Format is `projects/{project}/subscriptions/{sub}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the subscription. Format is `projects/{project}/subscriptions/{sub}`.",
          },
          required: true,
        },
        ackIds: {
          name: "Ack Ids",
          description: "Required. List of acknowledgment IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Required. List of acknowledgment IDs.",
          },
          required: true,
        },
        ackDeadlineSeconds: {
          name: "Ack Deadline Seconds",
          description:
            "Required. The new ack deadline with respect to the time this request was sent to the Pub/Sub system. For example, if the value is 10, the new ack deadline will expire 10 seconds after the `ModifyAckDeadline` call was made. Specifying zero might immediately make the message available for delivery to another subscriber client. This typically results in an increase in the rate of message redeliveries (that is, duplicates). The minimum deadline you can specify is 0 seconds. The maximum deadline you can specify in a single request is 600 seconds (10 minutes).",
          type: {
            type: "integer",
            description:
              "Required. The new ack deadline with respect to the time this request was sent to the Pub/Sub system. For example, if the value is 10, the new ack deadline will expire 10 seconds after the `ModifyAckDeadline` call was made. Specifying zero might immediately make the message available for delivery to another subscriber client. This typically results in an increase in the rate of message redeliveries (that is, duplicates). The minimum deadline you can specify is 0 seconds. The maximum deadline you can specify in a single request is 600 seconds (10 minutes).",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.modifyAckDeadline(request, (err: any, response: any) => {
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

export default modifyAckDeadline;
