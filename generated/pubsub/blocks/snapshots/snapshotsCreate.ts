import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const snapshotsCreate: AppBlock = {
  name: "Snapshots - Create",
  description: `Creates a snapshot from the requested subscription.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. User-provided name for this snapshot. If the name is not provided in the request, the server will assign a random name for this snapshot on the same project as the subscription. Note that for REST API requests, you must specify a name. See the [resource name rules](https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names). Format is `projects/{project}/snapshots/{snap}`.",
          type: {
            type: "string",
          },
          required: true,
        },
        subscription: {
          name: "Subscription",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The subscription whose backlog the snapshot retains. Specifically, the created snapshot is guaranteed to retain: (a) The existing backlog on the subscription. More precisely, this is defined as the messages in the subscription's backlog that are unacknowledged upon the successful completion of the `CreateSnapshot` request; as well as: (b) Any messages published to the subscription's topic following the successful completion of the CreateSnapshot request. Format is `projects/{project}/subscriptions/{sub}`.",
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: "Optional.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing"',
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "Optional.",
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
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/pubsub",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://pubsub.googleapis.com/";
        let path = `v1/{+name}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.subscription !== undefined)
          requestBody.subscription = input.event.inputConfig.subscription;
        if (input.event.inputConfig.tags !== undefined)
          requestBody.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
          );
        }

        const result = await response.json();
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
          expireTime: {
            type: "string",
            description:
              "Optional. The snapshot is guaranteed to exist up until this time. A newly-created snapshot expires no later than 7 days from the time of its creation. Its exact lifetime is determined at creation by the existing backlog in the source subscription. Specifically, the lifetime of the snapshot is `7 days - (age of oldest unacked message in the subscription)`. For example, consider a subscription whose oldest unacked message is 3 days old. If a snapshot is created from this subscription, the snapshot -- which will always capture this 3-day-old backlog as long as the snapshot exists -- will expire in 4 days. The service will refuse to create a snapshot that would expire in less than 1 hour after creation. (Format: google-datetime)",
          },
          name: {
            type: "string",
            description: "Optional. The name of the snapshot.",
          },
          topic: {
            type: "string",
            description:
              "Optional. The name of the topic from which this snapshot is retaining messages.",
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

export default snapshotsCreate;
