import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const notificationsList: AppBlock = {
  name: "Notifications - List",
  description: `Retrieves a list of notification subscriptions for a given bucket.`,
  category: "Notifications",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of a Google Cloud Storage bucket.",
          type: {
            type: "string",
          },
          required: true,
        },
        userProject: {
          name: "User Project",
          description:
            "The project to be billed for this request. Required for Requester Pays buckets.",
          type: {
            type: "string",
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
              "https://www.googleapis.com/auth/cloud-platform.read-only",
              "https://www.googleapis.com/auth/devstorage.full_control",
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/devstorage.read_write",
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
        const baseUrl = "https://storage.googleapis.com/storage/v1/";
        let path = `b/{bucket}/notificationConfigs`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                custom_attributes: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "An optional list of additional attributes to attach to each Cloud PubSub message published for this notification subscription.",
                },
                etag: {
                  type: "string",
                  description:
                    "HTTP 1.1 Entity tag for this subscription notification.",
                },
                event_types: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If present, only send notifications about listed event types. If empty, sent notifications for all event types.",
                },
                id: {
                  type: "string",
                  description: "The ID of the notification.",
                },
                kind: {
                  type: "string",
                  description:
                    "The kind of item this is. For notifications, this is always storage#notification.",
                },
                object_name_prefix: {
                  type: "string",
                  description:
                    "If present, only apply this notification configuration to object names that begin with this prefix.",
                },
                payload_format: {
                  type: "string",
                  description: "The desired content of the Payload.",
                },
                selfLink: {
                  type: "string",
                  description: "The canonical URL of this notification.",
                },
                topic: {
                  type: "string",
                  description:
                    "The Cloud PubSub topic to which this subscription publishes. Formatted as: '//pubsub.googleapis.com/projects/{project-identifier}/topics/{my-topic}'",
                },
              },
              description:
                "A subscription to receive Google PubSub notifications.",
              additionalProperties: true,
            },
            description: "The list of items.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For lists of notifications, this is always storage#notifications.",
          },
        },
        description: "A list of notification subscriptions.",
        additionalProperties: true,
      },
    },
  },
};

export default notificationsList;
