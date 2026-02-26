import { AppBlock, events } from "@slflows/sdk/v1";
import { getCloudBuildClient } from "../../lib/grpcClient.ts";

const receiveTriggerWebhook: AppBlock = {
  name: "Receive Trigger Webhook",
  description: `ReceiveTriggerWebhook [Experimental] is called when the API receives a webhook request targeted at a specific trigger.`,
  category: "Build Triggers",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The name of the `ReceiveTriggerWebhook` to retrieve. Format: `projects/{project}/locations/{location}/triggers/{trigger}`",
          type: {
            type: "string",
            description:
              "The name of the `ReceiveTriggerWebhook` to retrieve. Format: `projects/{project}/locations/{location}/triggers/{trigger}`",
          },
          required: false,
        },
        body: {
          name: "Body",
          description: "HTTP request body.",
          type: {
            type: "object",
            properties: {
              content_type: {
                type: "string",
              },
              data: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              extensions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type_url: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description: "HTTP request body.",
          },
          required: false,
        },
        project_id: {
          name: "Project Id",
          description: "Project in which the specified trigger lives",
          type: {
            type: "string",
            description: "Project in which the specified trigger lives",
          },
          required: false,
        },
        trigger: {
          name: "Trigger",
          description: "Name of the trigger to run the payload against",
          type: {
            type: "string",
            description: "Name of the trigger to run the payload against",
          },
          required: false,
        },
        secret: {
          name: "Secret",
          description:
            "Secret token used for authorization if an OAuth token isn't provided.",
          type: {
            type: "string",
            description:
              "Secret token used for authorization if an OAuth token isn't provided.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getCloudBuildClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.body !== undefined)
          request.body = input.event.inputConfig.body;
        if (input.event.inputConfig.project_id !== undefined)
          request.project_id = input.event.inputConfig.project_id;
        if (input.event.inputConfig.trigger !== undefined)
          request.trigger = input.event.inputConfig.trigger;
        if (input.event.inputConfig.secret !== undefined)
          request.secret = input.event.inputConfig.secret;

        const result = await new Promise<any>((resolve, reject) => {
          client.receiveTriggerWebhook(request, (err: any, response: any) => {
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
        description:
          "ReceiveTriggerWebhookResponse [Experimental] is the response object for the ReceiveTriggerWebhook method.",
        additionalProperties: true,
      },
    },
  },
};

export default receiveTriggerWebhook;
