import { AppBlock, events } from "@slflows/sdk/v1";
import { getModelServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  tuned_model_source: {
    name: "tunedModelSource",
    fields: {
      tuned_model: "tunedModel",
      base_model: "baseModel",
    },
  },
  base_model: "baseModel",
  display_name: "displayName",
  top_p: "topP",
  top_k: "topK",
  create_time: "createTime",
  update_time: "updateTime",
  tuning_task: {
    name: "tuningTask",
    fields: {
      start_time: "startTime",
      complete_time: "completeTime",
      snapshots: {
        name: "snapshots",
        fields: {
          mean_loss: "meanLoss",
          compute_time: "computeTime",
        },
      },
      training_data: {
        name: "trainingData",
        fields: {
          examples: {
            name: "examples",
            fields: {
              examples: {
                name: "examples",
                fields: {
                  text_input: "textInput",
                },
              },
            },
          },
        },
      },
      hyperparameters: {
        name: "hyperparameters",
        fields: {
          learning_rate: "learningRate",
          learning_rate_multiplier: "learningRateMultiplier",
          epoch_count: "epochCount",
          batch_size: "batchSize",
        },
      },
    },
  },
  reader_project_numbers: "readerProjectNumbers",
};

const getTunedModel: AppBlock = {
  name: "Get Tuned Model",
  description: `Gets information about a specific TunedModel.`,
  category: "Tuned Models",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the model.  Format: `tunedModels/my-model-id`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the model.  Format: `tunedModels/my-model-id`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getModelServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getTunedModel(request, (err: any, response: any) => {
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
          tunedModelSource: {
            type: "object",
            properties: {
              tunedModel: {
                type: "string",
              },
              baseModel: {
                type: "string",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'source_model' - only one field in this group can be set)",
          },
          baseModel: {
            type: "string",
            description:
              "(Part of 'source_model' - only one field in this group can be set)",
          },
          name: {
            type: "string",
          },
          displayName: {
            type: "string",
          },
          description: {
            type: "string",
          },
          temperature: {
            type: "number",
          },
          topP: {
            type: "number",
          },
          topK: {
            type: "integer",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "CREATING", "ACTIVE", "FAILED"],
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          tuningTask: {
            type: "object",
            properties: {
              startTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              completeTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              snapshots: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    step: {
                      type: "integer",
                    },
                    epoch: {
                      type: "integer",
                    },
                    meanLoss: {
                      type: "number",
                    },
                    computeTime: {
                      type: "string",
                      description:
                        "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                    },
                  },
                  additionalProperties: true,
                },
              },
              trainingData: {
                type: "object",
                properties: {
                  examples: {
                    type: "object",
                    properties: {
                      examples: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            textInput: {
                              type: "string",
                            },
                            output: {
                              type: "string",
                            },
                          },
                          additionalProperties: true,
                        },
                      },
                    },
                    additionalProperties: true,
                  },
                },
                additionalProperties: true,
              },
              hyperparameters: {
                type: "object",
                properties: {
                  learningRate: {
                    type: "number",
                    description:
                      "(Part of 'learning_rate_option' - only one field in this group can be set)",
                  },
                  learningRateMultiplier: {
                    type: "number",
                    description:
                      "(Part of 'learning_rate_option' - only one field in this group can be set)",
                  },
                  epochCount: {
                    type: "integer",
                  },
                  batchSize: {
                    type: "integer",
                  },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
          readerProjectNumbers: {
            type: "array",
            items: {
              type: "string",
              description: "64-bit integer as string",
            },
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getTunedModel;
