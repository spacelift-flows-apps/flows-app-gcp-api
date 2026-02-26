import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSubscriberClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const seek: AppBlock = {
  name: "Seek",
  description: `Seeks an existing subscription to a point in time or to a given snapshot, whichever is provided in the request. Snapshots are used in [Seek] (https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot. Note that both the subscription and the snapshot must be on the same topic.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        subscription: {
          name: "Subscription",
          description: "Required. The subscription to affect.",
          type: {
            type: "string",
            description: "Required. The subscription to affect.",
          },
          required: true,
        },
        time: {
          name: "Time",
          description:
            "Optional. The time to seek to. Messages retained in the subscription that were published before this time are marked as acknowledged, and messages retained in the subscription that were published after this time are marked as unacknowledged. Note that this operation affects only those messages retained in the subscription (configured by the combination of `message_retention_duration` and `retain_acked_messages`). For example, if `time` corresponds to a point before the message retention window (or to a point before the system's notion of the subscription creation time), only retained messages will be marked as unacknowledged, and already-expunged messages will not be restored.",
          type: {
            type: "string",
            description:
              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z') (Part of 'target' - only one field in this group can be set)",
          },
          required: false,
        },
        snapshot: {
          name: "Snapshot",
          description:
            "Optional. The snapshot to seek to. The snapshot's topic must be the same as that of the provided subscription. Format is `projects/{project}/snapshots/{snap}`.",
          type: {
            type: "string",
            description:
              "Optional. The snapshot to seek to. The snapshot's topic must be the same as that of the provided subscription. Format is `projects/{project}/snapshots/{snap}`. (Part of 'target' - only one field in this group can be set)",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.subscription !== undefined)
          request.subscription = input.event.inputConfig.subscription;
        if (input.event.inputConfig.time !== undefined)
          request.time = input.event.inputConfig.time;
        if (input.event.inputConfig.snapshot !== undefined)
          request.snapshot = input.event.inputConfig.snapshot;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.seek(protoRequest, (err: any, response: any) => {
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
        description: "Response for the `Seek` method (this response is empty).",
        additionalProperties: true,
      },
    },
  },
};

export default seek;
