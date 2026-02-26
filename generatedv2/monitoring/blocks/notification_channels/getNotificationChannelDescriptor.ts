import { AppBlock, events } from "@slflows/sdk/v1";
import { getNotificationChannelServiceClient } from "../../lib/grpcClient.ts";

const getNotificationChannelDescriptor: AppBlock = {
  name: "Get Notification Channel Descriptor",
  description: `Gets a single channel descriptor. The descriptor indicates which fields are expected / permitted for a notification channel of the given type.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The channel type for which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannelDescriptors/[CHANNEL_TYPE]",
          type: {
            type: "string",
            description:
              "Required. The channel type for which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannelDescriptors/[CHANNEL_TYPE]",
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

        const result = await new Promise<any>((resolve, reject) => {
          client.getNotificationChannelDescriptor(
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
          name: {
            type: "string",
            description:
              "The full REST resource name for this descriptor. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannelDescriptors/[TYPE]  In the above, `[TYPE]` is the value of the `type` field.",
          },
          type: {
            type: "string",
            description:
              'The type of notification channel, such as "email" and "sms". To view the full list of channels, see [Channel descriptors](https://cloud.google.com/monitoring/alerts/using-channels-api#ncd). Notification channel types are globally unique.',
          },
          display_name: {
            type: "string",
            description:
              "A human-readable name for the notification channel type.  This form of the name is suitable for a user interface.",
          },
          description: {
            type: "string",
            description:
              "A human-readable description of the notification channel type. The description may include a description of the properties of the channel and pointers to external documentation.",
          },
          labels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                value_type: {
                  type: "string",
                  enum: ["STRING", "BOOL", "INT64"],
                },
                description: {
                  type: "string",
                },
              },
              additionalProperties: true,
            },
            description:
              "The set of labels that must be defined to identify a particular channel of the corresponding type. Each label includes a description for how that field should be populated.",
          },
          supported_tiers: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "SERVICE_TIER_UNSPECIFIED",
                "SERVICE_TIER_BASIC",
                "SERVICE_TIER_PREMIUM",
              ],
              description:
                "The tier of service for a Metrics Scope. Please see the [service tiers documentation](https://cloud.google.com/monitoring/workspaces/tiers) for more details.",
            },
            description:
              "The tiers that support this notification channel; the project service tier must be one of the supported_tiers.",
          },
          launch_stage: {
            type: "string",
            enum: [
              "LAUNCH_STAGE_UNSPECIFIED",
              "UNIMPLEMENTED",
              "PRELAUNCH",
              "EARLY_ACCESS",
              "ALPHA",
              "BETA",
              "GA",
              "DEPRECATED",
            ],
            description: "The product launch stage for channels of this type.",
          },
        },
        description:
          "A description of a notification channel. The descriptor includes the properties of the channel and the set of labels or fields that must be specified to configure channels of a given type.",
        additionalProperties: true,
      },
    },
  },
};

export default getNotificationChannelDescriptor;
