import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient } from "../../lib/grpcClient.ts";

const listSnapshots: AppBlock = {
  name: "List Snapshots",
  description: `Lists the existing snapshots. Snapshots are used in [Seek]( https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        project: {
          name: "Project",
          description:
            "Required. The name of the project in which to list snapshots. Format is `projects/{project-id}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the project in which to list snapshots. Format is `projects/{project-id}`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description: "Optional. Maximum number of snapshots to return.",
          type: {
            type: "integer",
            description: "Optional. Maximum number of snapshots to return.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. The value returned by the last `ListSnapshotsResponse`; indicates that this is a continuation of a prior `ListSnapshots` call, and that the system should return the next page of data.",
          type: {
            type: "string",
            description:
              "Optional. The value returned by the last `ListSnapshotsResponse`; indicates that this is a continuation of a prior `ListSnapshots` call, and that the system should return the next page of data.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listSnapshots(request, (err: any, response: any) => {
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            description: "Optional. The resulting snapshots.",
          },
          next_page_token: {
            type: "string",
            description:
              "Optional. If not empty, indicates that there may be more snapshot that match the request; this value should be passed in a new `ListSnapshotsRequest`.",
          },
        },
        description: "Response for the `ListSnapshots` method.",
        additionalProperties: true,
      },
    },
  },
};

export default listSnapshots;
