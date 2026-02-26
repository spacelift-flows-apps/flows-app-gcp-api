import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSubscriberClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const getSnapshot: AppBlock = {
  name: "Get Snapshot",
  description: `Gets the configuration details of a snapshot. Snapshots are used in [Seek](https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        snapshot: {
          name: "Snapshot",
          description:
            "Required. The name of the snapshot to get. Format is `projects/{project}/snapshots/{snap}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the snapshot to get. Format is `projects/{project}/snapshots/{snap}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.snapshot !== undefined)
          request.snapshot = input.event.inputConfig.snapshot;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.getSnapshot(protoRequest, (err: any, response: any) => {
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
          name: {
            type: "string",
            description: "Optional. The name of the snapshot.",
          },
          topic: {
            type: "string",
            description:
              "Optional. The name of the topic from which this snapshot is retaining messages.",
          },
          expireTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. See [Creating and managing labels] (https://cloud.google.com/pubsub/docs/labels).",
          },
        },
        description:
          "A snapshot resource. Snapshots are used in [Seek](https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot.",
        additionalProperties: true,
      },
    },
  },
};

export default getSnapshot;
