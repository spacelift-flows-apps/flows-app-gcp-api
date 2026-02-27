import { AppBlock, events } from "@slflows/sdk/v1";
import { getModelServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  tunedModel: {
    name: "tuned_model",
    fields: {
      tunedModelSource: {
        name: "tuned_model_source",
        fields: {
          tunedModel: "tuned_model",
          baseModel: "base_model",
        },
      },
      baseModel: "base_model",
      displayName: "display_name",
      topP: "top_p",
      topK: "top_k",
      createTime: "create_time",
      updateTime: "update_time",
      tuningTask: {
        name: "tuning_task",
        fields: {
          startTime: "start_time",
          completeTime: "complete_time",
          snapshots: {
            name: "snapshots",
            fields: {
              meanLoss: "mean_loss",
              computeTime: "compute_time",
            },
          },
          trainingData: {
            name: "training_data",
            fields: {
              examples: {
                name: "examples",
                fields: {
                  examples: {
                    name: "examples",
                    fields: {
                      textInput: "text_input",
                    },
                  },
                },
              },
            },
          },
          hyperparameters: {
            name: "hyperparameters",
            fields: {
              learningRate: "learning_rate",
              learningRateMultiplier: "learning_rate_multiplier",
              epochCount: "epoch_count",
              batchSize: "batch_size",
            },
          },
        },
      },
      readerProjectNumbers: "reader_project_numbers",
    },
  },
  updateMask: "update_mask",
};

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

const updateTunedModel: AppBlock = {
  name: "Update Tuned Model",
  description: `Updates a tuned model.`,
  category: "Tuned Models",
  inputs: {
    default: {
      config: {
        tunedModel: {
          name: "Tuned Model",
          description: "Required. The tuned model to update.",
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
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  completeTime: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            description: "Required. The tuned model to update.",
          },
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description: "Optional. The list of fields to update.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getModelServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.updateTunedModel(request, (err: any, response: any) => {
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

export default updateTunedModel;
