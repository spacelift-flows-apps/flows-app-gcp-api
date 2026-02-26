import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSubscriberClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const deleteSubscription: AppBlock = {
  name: "Delete Subscription",
  description: `Deletes an existing subscription. All messages retained in the subscription are immediately dropped. Calls to 'Pull' after deletion will return 'NOT_FOUND'. After a subscription is deleted, a new one may be created with the same name, but the new one has no association with the old subscription or its topic unless the same topic is specified.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        subscription: {
          name: "Subscription",
          description:
            "Required. The subscription to delete. Format is `projects/{project}/subscriptions/{sub}`.",
          type: {
            type: "string",
            description:
              "Required. The subscription to delete. Format is `projects/{project}/subscriptions/{sub}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.subscription !== undefined)
          request.subscription = input.event.inputConfig.subscription;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteSubscription(protoRequest, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteSubscription;
