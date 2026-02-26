import { AppBlock, events } from "@slflows/sdk/v1";
import { getNotificationChannelServiceClient } from "../../lib/grpcClient.ts";

const getNotificationChannelVerificationCode: AppBlock = {
  name: "Get Notification Channel Verification Code",
  description: `Requests a verification code for an already verified channel that can then be used in a call to VerifyNotificationChannel() on a different channel with an equivalent identity in the same or in a different project. This makes it possible to copy a channel between projects without requiring manual reverification of the channel. If the channel is not in the verified state, this method will fail (in other words, this may only be used if the SendNotificationChannelVerificationCode and VerifyNotificationChannel paths have already been used to put the given channel into the verified state). There is no guarantee that the verification codes returned by this method will be of a similar structure or form as the ones that are delivered to the channel via SendNotificationChannelVerificationCode; while VerifyNotificationChannel() will recognize both the codes delivered via SendNotificationChannelVerificationCode() and returned from GetNotificationChannelVerificationCode(), it is typically the case that the verification codes delivered via SendNotificationChannelVerificationCode() will be shorter and also have a shorter expiration (e.g. codes such as "G-123456") whereas GetVerificationCode() will typically return a much longer, websafe base 64 encoded string that has a longer expiration time.`,
  category: "Notification Channels",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The notification channel for which a verification code is to be generated and retrieved. This must name a channel that is already verified; if the specified channel is not verified, the request will fail.",
          type: {
            type: "string",
            description:
              "Required. The notification channel for which a verification code is to be generated and retrieved. This must name a channel that is already verified; if the specified channel is not verified, the request will fail.",
          },
          required: true,
        },
        expire_time: {
          name: "Expire Time",
          description:
            "The desired expiration time. If specified, the API will guarantee that the returned code will not be valid after the specified timestamp; however, the API cannot guarantee that the returned code will be valid for at least as long as the requested time (the API puts an upper bound on the amount of time for which a code may be valid). If omitted, a default expiration will be used, which may be less than the max permissible expiration (so specifying an expiration may extend the code's lifetime over omitting an expiration, even though the API does impose an upper limit on the maximum expiration that is permitted).",
          type: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
        if (input.event.inputConfig.expire_time !== undefined)
          request.expire_time = input.event.inputConfig.expire_time;

        const result = await new Promise<any>((resolve, reject) => {
          client.getNotificationChannelVerificationCode(
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
          code: {
            type: "string",
            description:
              "The verification code, which may be used to verify other channels that have an equivalent identity (i.e. other channels of the same type with the same fingerprint such as other email channels with the same email address or other sms channels with the same number).",
          },
          expire_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        description: "The `GetNotificationChannelVerificationCode` request.",
        additionalProperties: true,
      },
    },
  },
};

export default getNotificationChannelVerificationCode;
