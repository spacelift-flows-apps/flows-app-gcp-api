import { AppBlock, events } from "@slflows/sdk/v1";
import { getModelServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  tuned_models: {
    name: "tunedModels",
    fields: {
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
    },
  },
  next_page_token: "nextPageToken",
};

const listTunedModels: AppBlock = {
  name: "List Tuned Models",
  description: `Lists created tuned models.`,
  category: "Tuned Models",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of `TunedModels` to return (per page). The service may return fewer tuned models.  If unspecified, at most 10 tuned models will be returned. This method returns at most 1000 models per page, even if you pass a larger page_size.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of `TunedModels` to return (per page). The service may return fewer tuned models.  If unspecified, at most 10 tuned models will be returned. This method returns at most 1000 models per page, even if you pass a larger page_size.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A page token, received from a previous `ListTunedModels` call.  Provide the `page_token` returned by one request as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListTunedModels` must match the call that provided the page token.",
          type: {
            type: "string",
            description:
              "Optional. A page token, received from a previous `ListTunedModels` call.  Provide the `page_token` returned by one request as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListTunedModels` must match the call that provided the page token.",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'Optional. A filter is a full text search over the tuned model\'s description and display name. By default, results will not include tuned models shared with everyone.  Additional operators:   - owner:me   - writers:me   - readers:me   - readers:everyone  Examples:   "owner:me" returns all tuned models to which caller has owner role   "readers:me" returns all tuned models to which caller has reader role   "readers:everyone" returns all tuned models that are shared with everyone',
          type: {
            type: "string",
            description:
              'Optional. A filter is a full text search over the tuned model\'s description and display name. By default, results will not include tuned models shared with everyone.  Additional operators:   - owner:me   - writers:me   - readers:me   - readers:everyone  Examples:   "owner:me" returns all tuned models to which caller has owner role   "readers:me" returns all tuned models to which caller has reader role   "readers:everyone" returns all tuned models that are shared with everyone',
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getModelServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listTunedModels(request, (err: any, response: any) => {
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
          tunedModels: {
            type: "array",
            items: {
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
          "Response from `ListTunedModels` containing a paginated list of Models.",
        additionalProperties: true,
      },
    },
  },
};

export default listTunedModels;
