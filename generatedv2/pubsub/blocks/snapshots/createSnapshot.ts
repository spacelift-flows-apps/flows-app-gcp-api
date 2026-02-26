import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient } from "../../lib/grpcClient.ts";

const createSnapshot: AppBlock = {
  name: "Create Snapshot",
  description: `Creates a snapshot from the requested subscription. Snapshots are used in [Seek](https://cloud.google.com/pubsub/docs/replay-overview) operations, which allow you to manage message acknowledgments in bulk. That is, you can set the acknowledgment state of messages in an existing subscription to the state captured by a snapshot. If the snapshot already exists, returns 'ALREADY_EXISTS'. If the requested subscription doesn't exist, returns 'NOT_FOUND'. If the backlog in the subscription is too old -- and the resulting snapshot would expire in less than 1 hour -- then 'FAILED_PRECONDITION' is returned. See also the 'Snapshot.expire_time' field. If the name is not provided in the request, the server will assign a random name for this snapshot on the same project as the subscription, conforming to the [resource name format] (https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names). The generated name is populated in the returned Snapshot object. Note that for REST API requests, you must specify a name in the request.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. User-provided name for this snapshot. If the name is not provided in the request, the server will assign a random name for this snapshot on the same project as the subscription. Note that for REST API requests, you must specify a name.  See the [resource name rules](https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names). Format is `projects/{project}/snapshots/{snap}`.",
          type: {
            type: "string",
            description:
              "Required. User-provided name for this snapshot. If the name is not provided in the request, the server will assign a random name for this snapshot on the same project as the subscription. Note that for REST API requests, you must specify a name.  See the [resource name rules](https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names). Format is `projects/{project}/snapshots/{snap}`.",
          },
          required: true,
        },
        subscription: {
          name: "Subscription",
          description:
            "Required. The subscription whose backlog the snapshot retains. Specifically, the created snapshot is guaranteed to retain:  (a) The existing backlog on the subscription. More precisely, this is      defined as the messages in the subscription's backlog that are      unacknowledged upon the successful completion of the      `CreateSnapshot` request; as well as:  (b) Any messages published to the subscription's topic following the      successful completion of the CreateSnapshot request. Format is `projects/{project}/subscriptions/{sub}`.",
          type: {
            type: "string",
            description:
              "Required. The subscription whose backlog the snapshot retains. Specifically, the created snapshot is guaranteed to retain:  (a) The existing backlog on the subscription. More precisely, this is      defined as the messages in the subscription's backlog that are      unacknowledged upon the successful completion of the      `CreateSnapshot` request; as well as:  (b) Any messages published to the subscription's topic following the      successful completion of the CreateSnapshot request. Format is `projects/{project}/subscriptions/{sub}`.",
          },
          required: true,
        },
        labels: {
          name: "Labels",
          description:
            "Optional. See [Creating and managing labels](https://cloud.google.com/pubsub/docs/labels).",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. See [Creating and managing labels](https://cloud.google.com/pubsub/docs/labels).",
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description:
            'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example:   "123/environment": "production",   "123/costCenter": "marketing" See https://docs.cloud.google.com/pubsub/docs/tags for more information on using tags with Pub/Sub resources.',
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example:   "123/environment": "production",   "123/costCenter": "marketing" See https://docs.cloud.google.com/pubsub/docs/tags for more information on using tags with Pub/Sub resources.',
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.subscription !== undefined)
          request.subscription = input.event.inputConfig.subscription;
        if (input.event.inputConfig.labels !== undefined)
          request.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.tags !== undefined)
          request.tags = input.event.inputConfig.tags;

        const result = await new Promise<any>((resolve, reject) => {
          client.createSnapshot(request, (err: any, response: any) => {
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

export default createSnapshot;
