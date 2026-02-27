import { AppBlock, events } from "@slflows/sdk/v1";
import { getModelServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  models: {
    name: "models",
    fields: {
      base_model_id: "baseModelId",
      display_name: "displayName",
      input_token_limit: "inputTokenLimit",
      output_token_limit: "outputTokenLimit",
      supported_generation_methods: "supportedGenerationMethods",
      max_temperature: "maxTemperature",
      top_p: "topP",
      top_k: "topK",
    },
  },
  next_page_token: "nextPageToken",
};

const listModels: AppBlock = {
  name: "List Models",
  description: `Lists the ['Model's](https://ai.google.dev/gemini-api/docs/models/gemini) available through the Gemini API.`,
  category: "Models",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "The maximum number of `Models` to return (per page).  If unspecified, 50 models will be returned per page. This method returns at most 1000 models per page, even if you pass a larger page_size.",
          type: {
            type: "integer",
            description:
              "The maximum number of `Models` to return (per page).  If unspecified, 50 models will be returned per page. This method returns at most 1000 models per page, even if you pass a larger page_size.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A page token, received from a previous `ListModels` call.  Provide the `page_token` returned by one request as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListModels` must match the call that provided the page token.",
          type: {
            type: "string",
            description:
              "A page token, received from a previous `ListModels` call.  Provide the `page_token` returned by one request as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListModels` must match the call that provided the page token.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getModelServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listModels(request, (err: any, response: any) => {
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
          models: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                baseModelId: {
                  type: "string",
                },
                version: {
                  type: "string",
                },
                displayName: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                inputTokenLimit: {
                  type: "integer",
                },
                outputTokenLimit: {
                  type: "integer",
                },
                supportedGenerationMethods: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                temperature: {
                  type: "number",
                },
                maxTemperature: {
                  type: "number",
                },
                topP: {
                  type: "number",
                },
                topK: {
                  type: "integer",
                },
                thinking: {
                  type: "boolean",
                },
              },
              additionalProperties: true,
            },
            description: "The returned Models.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token, which can be sent as `page_token` to retrieve the next page.  If this field is omitted, there are no more pages.",
          },
        },
        description:
          "Response from `ListModel` containing a paginated list of Models.",
        additionalProperties: true,
      },
    },
  },
};

export default listModels;
