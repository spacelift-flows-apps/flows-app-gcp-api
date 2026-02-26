import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient } from "../../lib/grpcClient.ts";

const updateSnapshot: AppBlock = {
  name: "Update Snapshot",
  description: `Updates an existing snapshot by updating the fields specified in the update mask. Snapshots are used in [Seek](https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        snapshot: {
          name: "Snapshot",
          description: "Required. The updated snapshot object.",
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
              expire_time: {
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
          required: true,
        },
        update_mask: {
          name: "Update Mask",
          description:
            "Required. Indicates which fields in the provided snapshot to update. Must be specified and non-empty.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.snapshot !== undefined)
          request.snapshot = input.event.inputConfig.snapshot;
        if (input.event.inputConfig.update_mask !== undefined)
          request.update_mask = input.event.inputConfig.update_mask;

        const result = await new Promise<any>((resolve, reject) => {
          client.updateSnapshot(request, (err: any, response: any) => {
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
          name: {
            type: "string",
            description: "Optional. The name of the snapshot.",
          },
          topic: {
            type: "string",
            description:
              "Optional. The name of the topic from which this snapshot is retaining messages.",
          },
          expire_time: {
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

export default updateSnapshot;
