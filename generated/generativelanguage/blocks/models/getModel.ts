import { AppBlock, events } from "@slflows/sdk/v1";
import { getModelServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  base_model_id: "baseModelId",
  display_name: "displayName",
  input_token_limit: "inputTokenLimit",
  output_token_limit: "outputTokenLimit",
  supported_generation_methods: "supportedGenerationMethods",
  max_temperature: "maxTemperature",
  top_p: "topP",
  top_k: "topK",
};

const getModel: AppBlock = {
  name: "Get Model",
  description: `Gets information about a specific 'Model' such as its version number, token limits, [parameters](https://ai.google.dev/gemini-api/docs/models/generative-models#model-parameters) and other metadata. Refer to the [Gemini models guide](https://ai.google.dev/gemini-api/docs/models/gemini) for detailed model information.`,
  category: "Models",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the model.  This name should match a model name returned by the `ListModels` method.  Format: `models/{model}`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the model.  This name should match a model name returned by the `ListModels` method.  Format: `models/{model}`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getModelServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getModel(request, (err: any, response: any) => {
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
    },
  },
};

export default getModel;
