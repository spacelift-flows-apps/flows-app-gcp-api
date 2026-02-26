import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getNotificationChannelServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  display_name: "displayName",
  user_labels: "userLabels",
  verification_status: "verificationStatus",
  creation_record: {
    name: "creationRecord",
    fields: {
      mutate_time: "mutateTime",
      mutated_by: "mutatedBy",
    },
  },
  mutation_records: {
    name: "mutationRecords",
    fields: {
      mutate_time: "mutateTime",
      mutated_by: "mutatedBy",
    },
  },
};

const getNotificationChannel: AppBlock = {
  name: "Get Notification Channel",
  description: `Gets a single notification channel. The channel includes the relevant configuration details with which the channel was created. However, the response may truncate or omit passwords, API keys, or other private key matter and thus the response may not be 100% identical to the information that was supplied in the call to the create method.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The channel for which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]",
          type: {
            type: "string",
            description:
              "Required. The channel for which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getNotificationChannelServiceClient(
          input.app.config,
        );

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getNotificationChannel(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
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
              "Configuration fields that define the channel and its behavior. The permissible and required labels are specified in the [NotificationChannelDescriptor.labels][google.monitoring.v3.NotificationChannelDescriptor.labels] of the `NotificationChannelDescriptor` corresponding to the `type` field.",
          },
          userLabels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "User-supplied key/value data that does not need to conform to the corresponding `NotificationChannelDescriptor`'s schema, unlike the `labels` field. This field is intended to be used for organizing and identifying the `NotificationChannel` objects.  The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
          },
          verificationStatus: {
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
          creationRecord: {
            type: "object",
            properties: {
              mutateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
          "A `NotificationChannel` is a medium through which an alert is delivered when a policy violation is detected. Examples of channels include email, SMS, and third-party messaging applications. Fields containing sensitive information like authentication tokens or contact info are only partially populated on retrieval.",
        additionalProperties: true,
      },
    },
  },
};

export default getNotificationChannel;
