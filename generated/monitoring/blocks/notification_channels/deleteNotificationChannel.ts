import { AppBlock, events } from "@slflows/sdk/v1";
import { getNotificationChannelServiceClient } from "../../lib/grpcClient.ts";

const deleteNotificationChannel: AppBlock = {
  name: "Delete Notification Channel",
  description: `Deletes a notification channel. Design your application to single-thread API calls that modify the state of notification channels in a single project. This includes calls to CreateNotificationChannel, DeleteNotificationChannel and UpdateNotificationChannel.`,
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
        force: {
          name: "Force",
          description:
            "If true, the notification channel will be deleted regardless of its use in alert policies (the policies will be updated to remove the channel). If false, this operation will fail if the notification channel is referenced by existing alerting policies.",
          type: {
            type: "boolean",
            description:
              "If true, the notification channel will be deleted regardless of its use in alert policies (the policies will be updated to remove the channel). If false, this operation will fail if the notification channel is referenced by existing alerting policies.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getNotificationChannelServiceClient(
          input.app.config,
        );

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteNotificationChannel(
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteNotificationChannel;
