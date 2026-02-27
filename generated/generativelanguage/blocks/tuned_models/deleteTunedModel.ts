import { AppBlock, events } from "@slflows/sdk/v1";
import { getModelServiceClient } from "../../lib/grpcClient.ts";

const deleteTunedModel: AppBlock = {
  name: "Delete Tuned Model",
  description: `Deletes a tuned model.`,
  category: "Tuned Models",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the model. Format: `tunedModels/my-model-id`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the model. Format: `tunedModels/my-model-id`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getModelServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteTunedModel(request, (err: any, response: any) => {
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

export default deleteTunedModel;
