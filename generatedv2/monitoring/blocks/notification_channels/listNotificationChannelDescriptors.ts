import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getNotificationChannelServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  channel_descriptors: {
    name: "channelDescriptors",
    fields: {
      display_name: "displayName",
      labels: {
        name: "labels",
        fields: {
          value_type: "valueType",
        },
      },
      supported_tiers: "supportedTiers",
      launch_stage: "launchStage",
    },
  },
  next_page_token: "nextPageToken",
};

const listNotificationChannelDescriptors: AppBlock = {
  name: "List Notification Channel Descriptors",
  description: `Lists the descriptors for supported channel types. The use of descriptors makes it possible for new channel types to be dynamically added.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The REST resource name of the parent from which to retrieve the notification channel descriptors. The expected syntax is:      projects/[PROJECT_ID_OR_NUMBER]  Note that this [names](https://cloud.google.com/monitoring/api/v3#project_name) the parent container in which to look for the descriptors; to retrieve a single descriptor by name, use the [GetNotificationChannelDescriptor][google.monitoring.v3.NotificationChannelService.GetNotificationChannelDescriptor] operation, instead.",
          type: {
            type: "string",
            description:
              "Required. The REST resource name of the parent from which to retrieve the notification channel descriptors. The expected syntax is:      projects/[PROJECT_ID_OR_NUMBER]  Note that this [names](https://cloud.google.com/monitoring/api/v3#project_name) the parent container in which to look for the descriptors; to retrieve a single descriptor by name, use the [GetNotificationChannelDescriptor][google.monitoring.v3.NotificationChannelService.GetNotificationChannelDescriptor] operation, instead.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "The maximum number of results to return in a single response. If not set to a positive number, a reasonable value will be chosen by the service.",
          type: {
            type: "integer",
            description:
              "The maximum number of results to return in a single response. If not set to a positive number, a reasonable value will be chosen by the service.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "If non-empty, `page_token` must contain a value returned as the `next_page_token` in a previous response to request the next set of results.",
          type: {
            type: "string",
            description:
              "If non-empty, `page_token` must contain a value returned as the `next_page_token` in a previous response to request the next set of results.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getNotificationChannelServiceClient(
          input.app.config,
        );

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listNotificationChannelDescriptors(
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
          channelDescriptors: {
            type: "array",
            items: {
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
                displayName: {
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
                      valueType: {
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
                supportedTiers: {
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
                launchStage: {
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
                  description:
                    "The product launch stage for channels of this type.",
                },
              },
              description:
                "A description of a notification channel. The descriptor includes the properties of the channel and the set of labels or fields that must be specified to configure channels of a given type.",
              additionalProperties: true,
            },
            description:
              "The monitored resource descriptors supported for the specified project, optionally filtered.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If not empty, indicates that there may be more results that match the request. Use the value in the `page_token` field in a subsequent request to fetch the next set of results. If empty, all results have been returned.",
          },
        },
        description: "The `ListNotificationChannelDescriptors` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listNotificationChannelDescriptors;
