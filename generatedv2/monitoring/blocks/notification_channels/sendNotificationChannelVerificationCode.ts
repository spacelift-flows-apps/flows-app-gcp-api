import { AppBlock, events } from "@slflows/sdk/v1";
import { getNotificationChannelServiceClient } from "../../lib/grpcClient.ts";

const sendNotificationChannelVerificationCode: AppBlock = {
  name: "Send Notification Channel Verification Code",
  description: `Causes a verification code to be delivered to the channel. The code can then be supplied in 'VerifyNotificationChannel' to verify the channel.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The notification channel to which to send a verification code.",
          type: {
            type: "string",
            description:
              "Required. The notification channel to which to send a verification code.",
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
          client.sendNotificationChannelVerificationCode(
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

export default sendNotificationChannelVerificationCode;
