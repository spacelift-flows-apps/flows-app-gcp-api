import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const channelsStop: AppBlock = {
  name: "Channels - Stop",
  description: `Stop watching resources through this channel`,
  category: "Channels",
  inputs: {
    default: {
      config: {
        address: {
          name: "Address",
          description:
            "The address where notifications are delivered for this channel.",
          type: {
            type: "string",
            description:
              "The address where notifications are delivered for this channel.",
          },
          required: false,
        },
        expiration: {
          name: "Expiration",
          description:
            "Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds.",
          type: {
            type: "string",
            description:
              "Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional. (Format: int64)",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "A UUID or similar unique string that identifies this channel.",
          type: {
            type: "string",
            description:
              "A UUID or similar unique string that identifies this channel.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            'Identifies this as a notification channel used to watch for changes to a resource, which is "api#channel".',
          type: {
            type: "string",
            description:
              'Identifies this as a notification channel used to watch for changes to a resource, which is "api#channel".',
          },
          required: false,
        },
        params: {
          name: "Params",
          description:
            "Additional parameters controlling delivery channel behavior.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Additional parameters controlling delivery channel behavior. Optional.",
          },
          required: false,
        },
        payload: {
          name: "Payload",
          description: "A Boolean value to indicate whether payload is wanted.",
          type: {
            type: "boolean",
            description:
              "A Boolean value to indicate whether payload is wanted. Optional.",
          },
          required: false,
        },
        resourceId: {
          name: "Resource ID",
          description:
            "An opaque ID that identifies the resource being watched on this channel.",
          type: {
            type: "string",
            description:
              "An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.",
          },
          required: false,
        },
        resourceUri: {
          name: "Resource Uri",
          description:
            "A version-specific identifier for the watched resource.",
          type: {
            type: "string",
            description:
              "A version-specific identifier for the watched resource.",
          },
          required: false,
        },
        token: {
          name: "Token",
          description:
            "An arbitrary string delivered to the target address with each notification delivered over this channel.",
          type: {
            type: "string",
            description:
              "An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.",
          },
          required: false,
        },
        type: {
          name: "Type",
          description: "The type of delivery mechanism used for this channel.",
          type: {
            type: "string",
            description:
              "The type of delivery mechanism used for this channel.",
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
        let path = `channels/stop`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.address !== undefined)
          requestBody.address = input.event.inputConfig.address;
        if (input.event.inputConfig.expiration !== undefined)
          requestBody.expiration = input.event.inputConfig.expiration;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.payload !== undefined)
          requestBody.payload = input.event.inputConfig.payload;
        if (input.event.inputConfig.resourceId !== undefined)
          requestBody.resourceId = input.event.inputConfig.resourceId;
        if (input.event.inputConfig.resourceUri !== undefined)
          requestBody.resourceUri = input.event.inputConfig.resourceUri;
        if (input.event.inputConfig.token !== undefined)
          requestBody.token = input.event.inputConfig.token;
        if (input.event.inputConfig.type !== undefined)
          requestBody.type = input.event.inputConfig.type;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
        additionalProperties: true,
      },
    },
  },
};

export default channelsStop;
