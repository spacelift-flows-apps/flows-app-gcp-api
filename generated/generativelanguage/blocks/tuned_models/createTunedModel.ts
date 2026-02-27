import { AppBlock, events } from "@slflows/sdk/v1";
import { getModelServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  tunedModelId: "tuned_model_id",
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
};

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

const createTunedModel: AppBlock = {
  name: "Create Tuned Model",
  description: `Creates a tuned model. Check intermediate tuning progress (if any) through the [google.longrunning.Operations] service. Access status and results through the Operations service. Example: GET /v1/tunedModels/az2mb0bpw6i/operations/000-111-222`,
  category: "Tuned Models",
  inputs: {
    default: {
      config: {
        tunedModelId: {
          name: "Tuned Model Id",
          description:
            "Optional. The unique id for the tuned model if specified. This value should be up to 40 characters, the first character must be a letter, the last could be a letter or a number. The id must match the regular expression: `[a-z]([a-z0-9-]{0,38}[a-z0-9])?`.",
          type: {
            type: "string",
            description:
              "Optional. The unique id for the tuned model if specified. This value should be up to 40 characters, the first character must be a letter, the last could be a letter or a number. The id must match the regular expression: `[a-z]([a-z0-9-]{0,38}[a-z0-9])?`.",
          },
          required: false,
        },
        tunedModel: {
          name: "Tuned Model",
          description: "Required. The tuned model to create.",
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
            description: "Required. The tuned model to create.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getModelServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createTunedModel(request, (err: any, response: any) => {
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
          metadata: {
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
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
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
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
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
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTunedModel;
