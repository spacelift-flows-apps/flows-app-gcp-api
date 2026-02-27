import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const notificationChannelsPatch: AppBlock = {
  name: "Notification Channels - Patch",
  description: `Updates a notification channel.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Identifier.",
          type: {
            type: "string",
            description:
              "Identifier. The full REST resource name for this channel. The format is: projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID] The [CHANNEL_ID] is automatically assigned by the server on creation.",
          },
          required: false,
        },
        updateMask: {
          name: "Update Mask",
          description: "Optional. The fields to update.",
          type: {
            type: "string",
          },
          required: false,
        },
        type: {
          name: "Type",
          description: "The type of the notification channel.",
          type: {
            type: "string",
            description:
              "The type of the notification channel. This field matches the value of the NotificationChannelDescriptor.type field.",
          },
          required: false,
        },
        displayName: {
          name: "Display Name",
          description:
            "An optional human-readable name for this notification channel.",
          type: {
            type: "string",
            description:
              "An optional human-readable name for this notification channel. It is recommended that you specify a non-empty and unique name in order to make it easier to identify the channels in your project, though this is not enforced. The display name is limited to 512 Unicode characters.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional human-readable description of this notification channel.",
          type: {
            type: "string",
            description:
              "An optional human-readable description of this notification channel. This description may provide additional details, beyond the display name, for the channel. This may not exceed 1024 Unicode characters.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "Configuration fields that define the channel and its behavior.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Configuration fields that define the channel and its behavior. The permissible and required labels are specified in the NotificationChannelDescriptor.labels of the NotificationChannelDescriptor corresponding to the type field.",
          },
          required: false,
        },
        userLabels: {
          name: "User Labels",
          description:
            "User-supplied key/value data that does not need to conform to the corresponding NotificationChannelDescriptor's schema, unlike the labels field.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "User-supplied key/value data that does not need to conform to the corresponding NotificationChannelDescriptor's schema, unlike the labels field. This field is intended to be used for organizing and identifying the NotificationChannel objects.The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
          },
          required: false,
        },
        verificationStatus: {
          name: "Verification Status",
          description:
            "Indicates whether this channel has been verified or not.",
          type: {
            type: "string",
            enum: ["VERIFICATION_STATUS_UNSPECIFIED", "UNVERIFIED", "VERIFIED"],
            description:
              "Indicates whether this channel has been verified or not. On a ListNotificationChannels or GetNotificationChannel operation, this field is expected to be populated.If the value is UNVERIFIED, then it indicates that the channel is non-functioning (it both requires verification and lacks verification); otherwise, it is assumed that the channel works.If the channel is neither VERIFIED nor UNVERIFIED, it implies that the channel is of a type that does not require verification or that this specific channel has been exempted from verification because it was created prior to verification being required for channels of this type.This field cannot be modified using a standard UpdateNotificationChannel operation. To change the value of this field, you must call VerifyNotificationChannel.",
          },
          required: false,
        },
        enabled: {
          name: "Enabled",
          description:
            "Whether notifications are forwarded to the described channel.",
          type: {
            type: "boolean",
            description:
              "Whether notifications are forwarded to the described channel. This makes it possible to disable delivery of notifications to a particular channel without removing the channel from all alerting policies that reference the channel. This is a more convenient approach when the change is temporary and you want to receive notifications from the same set of alerting policies on the channel at some point in the future.",
          },
          required: false,
        },
        creationRecord: {
          name: "Creation Record",
          description: "Record of the creation of this channel.",
          type: {
            type: "object",
            properties: {
              mutateTime: {
                type: "string",
                description:
                  "When the change occurred. (Format: google-datetime)",
              },
              mutatedBy: {
                type: "string",
                description: "The email address of the user making the change.",
              },
            },
            description: "Describes a change made to a configuration.",
            additionalProperties: true,
          },
          required: false,
        },
        mutationRecords: {
          name: "Mutation Records",
          description: "Records of the modification of this channel.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                mutateTime: {
                  type: "string",
                  description:
                    "When the change occurred. (Format: google-datetime)",
                },
                mutatedBy: {
                  type: "string",
                  description:
                    "The email address of the user making the change.",
                },
              },
              description: "Describes a change made to a configuration.",
              additionalProperties: true,
            },
            description: "Records of the modification of this channel.",
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
              "https://www.googleapis.com/auth/monitoring",
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
        const baseUrl = "https://monitoring.googleapis.com/";
        let path = `v3/{+name}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.type !== undefined)
          requestBody.type = input.event.inputConfig.type;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.displayName !== undefined)
          requestBody.displayName = input.event.inputConfig.displayName;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.userLabels !== undefined)
          requestBody.userLabels = input.event.inputConfig.userLabels;
        if (input.event.inputConfig.verificationStatus !== undefined)
          requestBody.verificationStatus =
            input.event.inputConfig.verificationStatus;
        if (input.event.inputConfig.enabled !== undefined)
          requestBody.enabled = input.event.inputConfig.enabled;
        if (input.event.inputConfig.creationRecord !== undefined)
          requestBody.creationRecord = input.event.inputConfig.creationRecord;
        if (input.event.inputConfig.mutationRecords !== undefined)
          requestBody.mutationRecords = input.event.inputConfig.mutationRecords;

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
          type: {
            type: "string",
            description:
              "The type of the notification channel. This field matches the value of the NotificationChannelDescriptor.type field.",
          },
          name: {
            type: "string",
            description:
              "Identifier. The full REST resource name for this channel. The format is: projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID] The [CHANNEL_ID] is automatically assigned by the server on creation.",
          },
          displayName: {
            type: "string",
            description:
              "An optional human-readable name for this notification channel. It is recommended that you specify a non-empty and unique name in order to make it easier to identify the channels in your project, though this is not enforced. The display name is limited to 512 Unicode characters.",
          },
          description: {
            type: "string",
            description:
              "An optional human-readable description of this notification channel. This description may provide additional details, beyond the display name, for the channel. This may not exceed 1024 Unicode characters.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Configuration fields that define the channel and its behavior. The permissible and required labels are specified in the NotificationChannelDescriptor.labels of the NotificationChannelDescriptor corresponding to the type field.",
          },
          userLabels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "User-supplied key/value data that does not need to conform to the corresponding NotificationChannelDescriptor's schema, unlike the labels field. This field is intended to be used for organizing and identifying the NotificationChannel objects.The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
          },
          verificationStatus: {
            type: "string",
            enum: ["VERIFICATION_STATUS_UNSPECIFIED", "UNVERIFIED", "VERIFIED"],
            description:
              "Indicates whether this channel has been verified or not. On a ListNotificationChannels or GetNotificationChannel operation, this field is expected to be populated.If the value is UNVERIFIED, then it indicates that the channel is non-functioning (it both requires verification and lacks verification); otherwise, it is assumed that the channel works.If the channel is neither VERIFIED nor UNVERIFIED, it implies that the channel is of a type that does not require verification or that this specific channel has been exempted from verification because it was created prior to verification being required for channels of this type.This field cannot be modified using a standard UpdateNotificationChannel operation. To change the value of this field, you must call VerifyNotificationChannel.",
          },
          enabled: {
            type: "boolean",
            description:
              "Whether notifications are forwarded to the described channel. This makes it possible to disable delivery of notifications to a particular channel without removing the channel from all alerting policies that reference the channel. This is a more convenient approach when the change is temporary and you want to receive notifications from the same set of alerting policies on the channel at some point in the future.",
          },
          creationRecord: {
            type: "object",
            properties: {
              mutateTime: {
                type: "string",
                description:
                  "When the change occurred. (Format: google-datetime)",
              },
              mutatedBy: {
                type: "string",
                description: "The email address of the user making the change.",
              },
            },
            description: "Describes a change made to a configuration.",
            additionalProperties: true,
          },
          mutationRecords: {
            type: "array",
            items: {
              type: "object",
              properties: {
                mutateTime: {
                  type: "string",
                  description:
                    "When the change occurred. (Format: google-datetime)",
                },
                mutatedBy: {
                  type: "string",
                  description:
                    "The email address of the user making the change.",
                },
              },
              description: "Describes a change made to a configuration.",
              additionalProperties: true,
            },
            description: "Records of the modification of this channel.",
          },
        },
        description:
          "A NotificationChannel is a medium through which an alert is delivered when a policy violation is detected. Examples of channels include email, SMS, and third-party messaging applications. Fields containing sensitive information like authentication tokens or contact info are only partially populated on retrieval.",
        additionalProperties: true,
      },
    },
  },
};

export default notificationChannelsPatch;
