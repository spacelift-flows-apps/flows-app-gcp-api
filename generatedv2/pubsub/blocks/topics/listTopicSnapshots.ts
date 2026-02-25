import { AppBlock, events } from "@slflows/sdk/v1";
import { getPublisherClient } from "../../lib/grpcClient.ts";

const listTopicSnapshots: AppBlock = {
  name: "List Topic Snapshots",
  description: `Lists the names of the snapshots on this topic. Snapshots are used in [Seek](https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot.`,
  category: "Topics",
  inputs: {
    default: {
      config: {
        topic: {
          name: "Topic",
          description:
            "Required. The name of the topic that snapshots are attached to. Format is `projects/{project}/topics/{topic}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the topic that snapshots are attached to. Format is `projects/{project}/topics/{topic}`.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description: "Optional. Maximum number of snapshot names to return.",
          type: {
            type: "integer",
            description:
              "Optional. Maximum number of snapshot names to return.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. The value returned by the last `ListTopicSnapshotsResponse`; indicates that this is a continuation of a prior `ListTopicSnapshots` call, and that the system should return the next page of data.",
          type: {
            type: "string",
            description:
              "Optional. The value returned by the last `ListTopicSnapshotsResponse`; indicates that this is a continuation of a prior `ListTopicSnapshots` call, and that the system should return the next page of data.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getPublisherClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.topic !== undefined)
          request.topic = input.event.inputConfig.topic;
        if (input.event.inputConfig.pageSize !== undefined)
          request.pageSize = input.event.inputConfig.pageSize;
        if (input.event.inputConfig.pageToken !== undefined)
          request.pageToken = input.event.inputConfig.pageToken;

        const result = await new Promise<any>((resolve, reject) => {
          client.listTopicSnapshots(request, (err: any, response: any) => {
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
          snapshots: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Optional. The names of the snapshots that match the request.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Optional. If not empty, indicates that there may be more snapshots that match the request; this value should be passed in a new `ListTopicSnapshotsRequest` to get more snapshots.",
          },
        },
        description: "Response for the `ListTopicSnapshots` method.",
        additionalProperties: true,
      },
    },
  },
};

export default listTopicSnapshots;
