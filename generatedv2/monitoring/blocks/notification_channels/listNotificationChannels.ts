import { AppBlock, events } from "@slflows/sdk/v1";
import { getNotificationChannelServiceClient } from "../../lib/grpcClient.ts";

const listNotificationChannels: AppBlock = {
  name: "List Notification Channels",
  description: `Lists the notification channels that have been created for the project. To list the types of notification channels that are supported, use the 'ListNotificationChannelDescriptors' method.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]  This names the container in which to look for the notification channels; it does not name a specific channel. To query a specific channel by REST resource name, use the [`GetNotificationChannel`][google.monitoring.v3.NotificationChannelService.GetNotificationChannel] operation.",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]  This names the container in which to look for the notification channels; it does not name a specific channel. To query a specific channel by REST resource name, use the [`GetNotificationChannel`][google.monitoring.v3.NotificationChannelService.GetNotificationChannel] operation.",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. If provided, this field specifies the criteria that must be met by notification channels to be included in the response.  For more details, see [sorting and filtering](https://cloud.google.com/monitoring/api/v3/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. If provided, this field specifies the criteria that must be met by notification channels to be included in the response.  For more details, see [sorting and filtering](https://cloud.google.com/monitoring/api/v3/sorting-and-filtering).",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            "Optional. A comma-separated list of fields by which to sort the result. Supports the same set of fields as in `filter`. Entries can be prefixed with a minus sign to sort in descending rather than ascending order.  For more details, see [sorting and filtering](https://cloud.google.com/monitoring/api/v3/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. A comma-separated list of fields by which to sort the result. Supports the same set of fields as in `filter`. Entries can be prefixed with a minus sign to sort in descending rather than ascending order.  For more details, see [sorting and filtering](https://cloud.google.com/monitoring/api/v3/sorting-and-filtering).",
          },
          required: false,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. The maximum number of results to return in a single response. If not set to a positive number, a reasonable value will be chosen by the service.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of results to return in a single response. If not set to a positive number, a reasonable value will be chosen by the service.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. If non-empty, `page_token` must contain a value returned as the `next_page_token` in a previous response to request the next set of results.",
          type: {
            type: "string",
            description:
              "Optional. If non-empty, `page_token` must contain a value returned as the `next_page_token` in a previous response to request the next set of results.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getNotificationChannelServiceClient(
          input.app.config,
        );

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.order_by !== undefined)
          request.order_by = input.event.inputConfig.order_by;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listNotificationChannels(
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
          notification_channels: {
            type: "array",
            items: {
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
            description:
              "The notification channels defined for the specified project.",
          },
          next_page_token: {
            type: "string",
            description:
              "If not empty, indicates that there may be more results that match the request. Use the value in the `page_token` field in a subsequent request to fetch the next set of results. If empty, all results have been returned.",
          },
          total_size: {
            type: "integer",
            description:
              "The total number of notification channels in all pages. This number is only an estimate, and may change in subsequent pages. https://aip.dev/158",
          },
        },
        description: "The `ListNotificationChannels` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listNotificationChannels;
