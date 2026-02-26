import { AppBlock, events } from "@slflows/sdk/v1";
import { getNotificationChannelServiceClient } from "../../lib/grpcClient.ts";

const createNotificationChannel: AppBlock = {
  name: "Create Notification Channel",
  description: `Creates a new notification channel, representing a single notification endpoint such as an email address, SMS number, or PagerDuty service. Design your application to single-thread API calls that modify the state of notification channels in a single project. This includes calls to CreateNotificationChannel, DeleteNotificationChannel and UpdateNotificationChannel.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]  This names the container into which the channel will be written, this does not name the newly created channel. The resulting channel's name will have a normalized version of this field as a prefix, but will add `/notificationChannels/[CHANNEL_ID]` to identify the channel.",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]  This names the container into which the channel will be written, this does not name the newly created channel. The resulting channel's name will have a normalized version of this field as a prefix, but will add `/notificationChannels/[CHANNEL_ID]` to identify the channel.",
          },
          required: true,
        },
        notification_channel: {
          name: "Notification Channel",
          description:
            "Required. The definition of the `NotificationChannel` to create.",
          type: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description:
                  "The type of the notification channel. This field matches the value of the [NotificationChannelDescriptor.type][google.monitoring.v3.NotificationChannelDescriptor.type] field.",
              },
              name: {
                type: "string",
                description:
                  "Identifier. The full REST resource name for this channel. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]  The `[CHANNEL_ID]` is automatically assigned by the server on creation.",
              },
              display_name: {
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
                  "Configuration fields that define the channel and its behavior. The permissible and required labels are specified in the [NotificationChannelDescriptor.labels][google.monitoring.v3.NotificationChannelDescriptor.labels] of the `NotificationChannelDescriptor` corresponding to the `type` field.",
              },
              user_labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "User-supplied key/value data that does not need to conform to the corresponding `NotificationChannelDescriptor`'s schema, unlike the `labels` field. This field is intended to be used for organizing and identifying the `NotificationChannel` objects.  The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
              },
              verification_status: {
                type: "string",
                enum: [
                  "VERIFICATION_STATUS_UNSPECIFIED",
                  "UNVERIFIED",
                  "VERIFIED",
                ],
                description:
                  "Indicates whether this channel has been verified or not. On a [`ListNotificationChannels`][google.monitoring.v3.NotificationChannelService.ListNotificationChannels] or [`GetNotificationChannel`][google.monitoring.v3.NotificationChannelService.GetNotificationChannel] operation, this field is expected to be populated.  If the value is `UNVERIFIED`, then it indicates that the channel is non-functioning (it both requires verification and lacks verification); otherwise, it is assumed that the channel works.  If the channel is neither `VERIFIED` nor `UNVERIFIED`, it implies that the channel is of a type that does not require verification or that this specific channel has been exempted from verification because it was created prior to verification being required for channels of this type.  This field cannot be modified using a standard [`UpdateNotificationChannel`][google.monitoring.v3.NotificationChannelService.UpdateNotificationChannel] operation. To change the value of this field, you must call [`VerifyNotificationChannel`][google.monitoring.v3.NotificationChannelService.VerifyNotificationChannel].",
              },
              enabled: {
                type: "boolean",
                description:
                  "Whether notifications are forwarded to the described channel. This makes it possible to disable delivery of notifications to a particular channel without removing the channel from all alerting policies that reference the channel. This is a more convenient approach when the change is temporary and you want to receive notifications from the same set of alerting policies on the channel at some point in the future.",
              },
              creation_record: {
                type: "object",
                properties: {
                  mutate_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  mutated_by: {
                    type: "string",
                    description:
                      "The email address of the user making the change.",
                  },
                },
                description: "Describes a change made to a configuration.",
                additionalProperties: true,
              },
              mutation_records: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mutate_time: {
                      type: "string",
                      description:
                        "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                    },
                    mutated_by: {
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
              "A `NotificationChannel` is a medium through which an alert is delivered when a policy violation is detected. Examples of channels include email, SMS, and third-party messaging applications. Fields containing sensitive information like authentication tokens or contact info are only partially populated on retrieval.",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getNotificationChannelServiceClient(
          input.app.config,
        );

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.notification_channel !== undefined)
          request.notification_channel =
            input.event.inputConfig.notification_channel;

        const result = await new Promise<any>((resolve, reject) => {
          client.createNotificationChannel(
            request,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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
          type: {
            type: "string",
            description:
              "The type of the notification channel. This field matches the value of the [NotificationChannelDescriptor.type][google.monitoring.v3.NotificationChannelDescriptor.type] field.",
          },
          name: {
            type: "string",
            description:
              "Identifier. The full REST resource name for this channel. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]  The `[CHANNEL_ID]` is automatically assigned by the server on creation.",
          },
          display_name: {
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
              "Configuration fields that define the channel and its behavior. The permissible and required labels are specified in the [NotificationChannelDescriptor.labels][google.monitoring.v3.NotificationChannelDescriptor.labels] of the `NotificationChannelDescriptor` corresponding to the `type` field.",
          },
          user_labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "User-supplied key/value data that does not need to conform to the corresponding `NotificationChannelDescriptor`'s schema, unlike the `labels` field. This field is intended to be used for organizing and identifying the `NotificationChannel` objects.  The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
          },
          verification_status: {
            type: "string",
            enum: ["VERIFICATION_STATUS_UNSPECIFIED", "UNVERIFIED", "VERIFIED"],
            description:
              "Indicates whether this channel has been verified or not. On a [`ListNotificationChannels`][google.monitoring.v3.NotificationChannelService.ListNotificationChannels] or [`GetNotificationChannel`][google.monitoring.v3.NotificationChannelService.GetNotificationChannel] operation, this field is expected to be populated.  If the value is `UNVERIFIED`, then it indicates that the channel is non-functioning (it both requires verification and lacks verification); otherwise, it is assumed that the channel works.  If the channel is neither `VERIFIED` nor `UNVERIFIED`, it implies that the channel is of a type that does not require verification or that this specific channel has been exempted from verification because it was created prior to verification being required for channels of this type.  This field cannot be modified using a standard [`UpdateNotificationChannel`][google.monitoring.v3.NotificationChannelService.UpdateNotificationChannel] operation. To change the value of this field, you must call [`VerifyNotificationChannel`][google.monitoring.v3.NotificationChannelService.VerifyNotificationChannel].",
          },
          enabled: {
            type: "boolean",
            description:
              "Whether notifications are forwarded to the described channel. This makes it possible to disable delivery of notifications to a particular channel without removing the channel from all alerting policies that reference the channel. This is a more convenient approach when the change is temporary and you want to receive notifications from the same set of alerting policies on the channel at some point in the future.",
          },
          creation_record: {
            type: "object",
            properties: {
              mutate_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              mutated_by: {
                type: "string",
                description: "The email address of the user making the change.",
              },
            },
            description: "Describes a change made to a configuration.",
            additionalProperties: true,
          },
          mutation_records: {
            type: "array",
            items: {
              type: "object",
              properties: {
                mutate_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                mutated_by: {
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
          "A `NotificationChannel` is a medium through which an alert is delivered when a policy violation is detected. Examples of channels include email, SMS, and third-party messaging applications. Fields containing sensitive information like authentication tokens or contact info are only partially populated on retrieval.",
        additionalProperties: true,
      },
    },
  },
};

export default createNotificationChannel;
