import { AppBlock, events } from "@slflows/sdk/v1";
import { getPublisherClient } from "../../lib/grpcClient.ts";

const deleteTopic: AppBlock = {
  name: "Delete Topic",
  description: `Deletes the topic with the given name. Returns 'NOT_FOUND' if the topic does not exist. After a topic is deleted, a new topic may be created with the same name; this is an entirely new topic with none of the old configuration or subscriptions. Existing subscriptions to this topic are not deleted, but their 'topic' field is set to '_deleted-topic_'.`,
  category: "Topics",
  inputs: {
    default: {
      config: {
        topic: {
          name: "Topic",
          description:
            "Required. Name of the topic to delete. Format is `projects/{project}/topics/{topic}`.",
          type: {
            type: "string",
            description:
              "Required. Name of the topic to delete. Format is `projects/{project}/topics/{topic}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPublisherClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.topic !== undefined)
          request.topic = input.event.inputConfig.topic;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteTopic(request, (err: any, response: any) => {
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

export default deleteTopic;
