import { AppBlock, events } from "@slflows/sdk/v1";
import { getSubscriberClient } from "../../lib/grpcClient.ts";

const modifyPushConfig: AppBlock = {
  name: "Modify Push Config",
  description: `Modifies the 'PushConfig' for a specified subscription. This may be used to change a push subscription to a pull one (signified by an empty 'PushConfig') or vice versa, or change the endpoint URL and other attributes of a push subscription. Messages will accumulate for delivery continuously through the call regardless of changes to the 'PushConfig'.`,
  category: "Subscriptions",
  inputs: {
    default: {
      config: {
        subscription: {
          name: "Subscription",
          description:
            "Required. The name of the subscription. Format is `projects/{project}/subscriptions/{sub}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the subscription. Format is `projects/{project}/subscriptions/{sub}`.",
          },
          required: true,
        },
        push_config: {
          name: "Push Config",
          description:
            "Required. The push configuration for future deliveries.  An empty `pushConfig` indicates that the Pub/Sub system should stop pushing messages from the given subscription and allow messages to be pulled and acknowledged - effectively pausing the subscription if `Pull` or `StreamingPull` is not called.",
          type: {
            type: "object",
            properties: {
              push_endpoint: {
                type: "string",
                description:
                  "Optional. A URL locating the endpoint to which messages should be pushed. For example, a Webhook endpoint might use `https://example.com/push`.",
              },
              attributes: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Optional. Endpoint configuration attributes that can be used to control different aspects of the message delivery.  The only currently supported attribute is `x-goog-version`, which you can use to change the format of the pushed message. This attribute indicates the version of the data expected by the endpoint. This controls the shape of the pushed message (i.e., its fields and metadata).  If not present during the `CreateSubscription` call, it will default to the version of the Pub/Sub API used to make such call. If not present in a `ModifyPushConfig` call, its value will not be changed. `GetSubscription` calls will always return a valid version, even if the subscription was created without this attribute.  The only supported values for the `x-goog-version` attribute are:  * `v1beta1`: uses the push format defined in the v1beta1 Pub/Sub API. * `v1` or `v1beta2`: uses the push format defined in the v1 Pub/Sub API.  For example: `attributes { "x-goog-version": "v1" }`',
              },
              oidc_token: {
                type: "object",
                properties: {
                  service_account_email: {
                    type: "string",
                    description:
                      "Optional. [Service account email](https://cloud.google.com/iam/docs/service-accounts) used for generating the OIDC token. For more information on setting up authentication, see [Push subscriptions](https://cloud.google.com/pubsub/docs/push).",
                  },
                  audience: {
                    type: "string",
                    description:
                      "Optional. Audience to be used when generating OIDC token. The audience claim identifies the recipients that the JWT is intended for. The audience value is a single case-sensitive string. Having multiple values (array) for the audience field is not supported. More info about the OIDC JWT token audience here: https://tools.ietf.org/html/rfc7519#section-4.1.3 Note: if not specified, the Push endpoint URL will be used.",
                  },
                },
                description:
                  "Contains information needed for generating an [OpenID Connect token](https://developers.google.com/identity/protocols/OpenIDConnect).",
                additionalProperties: true,
              },
              pubsub_wrapper: {
                type: "object",
                properties: {},
                description:
                  "The payload to the push endpoint is in the form of the JSON representation of a PubsubMessage (https://cloud.google.com/pubsub/docs/reference/rpc/google.pubsub.v1#pubsubmessage). (Part of 'wrapper' - only one field in this group can be set)",
                additionalProperties: true,
              },
              no_wrapper: {
                type: "object",
                properties: {
                  write_metadata: {
                    type: "boolean",
                    description:
                      "Optional. When true, writes the Pub/Sub message metadata to `x-goog-pubsub-<KEY>:<VAL>` headers of the HTTP request. Writes the Pub/Sub message attributes to `<KEY>:<VAL>` headers of the HTTP request.",
                  },
                },
                description:
                  "Sets the `data` field as the HTTP body for delivery. (Part of 'wrapper' - only one field in this group can be set)",
                additionalProperties: true,
              },
            },
            description: "Configuration for a push delivery endpoint.",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSubscriberClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.subscription !== undefined)
          request.subscription = input.event.inputConfig.subscription;
        if (input.event.inputConfig.push_config !== undefined)
          request.push_config = input.event.inputConfig.push_config;

        const result = await new Promise<any>((resolve, reject) => {
          client.modifyPushConfig(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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

export default modifyPushConfig;
