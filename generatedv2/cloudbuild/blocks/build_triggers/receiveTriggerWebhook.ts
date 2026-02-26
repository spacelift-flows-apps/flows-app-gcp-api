import { AppBlock, events } from "@slflows/sdk/v1";
import { getCloudBuildClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  body: {
    name: "body",
    fields: {
      contentType: "content_type",
      extensions: {
        name: "extensions",
        fields: {
          typeUrl: "type_url",
        },
      },
    },
  },
  projectId: "project_id",
};

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
              contentType: {
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
                    typeUrl: {
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
        projectId: {
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

        const request = convertKeys(input.event.inputConfig, inputMapping);

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
