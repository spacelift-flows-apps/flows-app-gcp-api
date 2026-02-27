import { AppBlock, events } from "@slflows/sdk/v1";
import { getPublisherClient } from "../../lib/grpcClient.ts";

const detachSubscription: AppBlock = {
  name: "Detach Subscription",
  description: `Detaches a subscription from this topic. All messages retained in the subscription are dropped. Subsequent 'Pull' and 'StreamingPull' requests will return FAILED_PRECONDITION. If the subscription is a push subscription, pushes to the endpoint will stop.`,
  category: "Topics",
  inputs: {
    default: {
      config: {
        subscription: {
          name: "Subscription",
          description:
            "Required. The subscription to detach. Format is `projects/{project}/subscriptions/{subscription}`.",
          type: {
            type: "string",
            description:
              "Required. The subscription to detach. Format is `projects/{project}/subscriptions/{subscription}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPublisherClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.detachSubscription(request, (err: any, response: any) => {
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
        description:
          "Response for the DetachSubscription method. Reserved for future use.",
        additionalProperties: true,
      },
    },
  },
};

export default detachSubscription;
