import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSubscriberClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const deleteSnapshot: AppBlock = {
  name: "Delete Snapshot",
  description: `Removes an existing snapshot. Snapshots are used in [Seek] (https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot. When the snapshot is deleted, all messages retained in the snapshot are immediately dropped. After a snapshot is deleted, a new one may be created with the same name, but the new one has no association with the old snapshot or its subscription, unless the same subscription is specified.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        snapshot: {
          name: "Snapshot",
          description:
            "Required. The name of the snapshot to delete. Format is `projects/{project}/snapshots/{snap}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the snapshot to delete. Format is `projects/{project}/snapshots/{snap}`.",
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
          client.deleteSnapshot(protoRequest, (err: any, response: any) => {
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

export default deleteSnapshot;
