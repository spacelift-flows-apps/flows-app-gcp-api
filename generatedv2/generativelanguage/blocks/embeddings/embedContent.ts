import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getGenerativeServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  content: {
    name: "content",
    fields: {
      parts: {
        name: "parts",
        fields: {
          inlineData: {
            name: "inline_data",
            fields: {
              mimeType: "mime_type",
            },
          },
          functionCall: "function_call",
          functionResponse: {
            name: "function_response",
            fields: {
              parts: {
                name: "parts",
                fields: {
                  inlineData: {
                    name: "inline_data",
                    fields: {
                      mimeType: "mime_type",
                    },
                  },
                },
              },
              willContinue: "will_continue",
            },
          },
          fileData: {
            name: "file_data",
            fields: {
              mimeType: "mime_type",
              fileUri: "file_uri",
            },
          },
          executableCode: "executable_code",
          codeExecutionResult: "code_execution_result",
          videoMetadata: {
            name: "video_metadata",
            fields: {
              startOffset: "start_offset",
              endOffset: "end_offset",
            },
          },
          thoughtSignature: "thought_signature",
          partMetadata: "part_metadata",
        },
      },
    },
  },
  taskType: "task_type",
  outputDimensionality: "output_dimensionality",
};

const embedContent: AppBlock = {
  name: "Embed Content",
  description: `Generates a text embedding vector from the input 'Content' using the specified [Gemini Embedding model](https://ai.google.dev/gemini-api/docs/models/gemini#text-embedding).`,
  category: "Embeddings",
  inputs: {
    default: {
      config: {
        model: {
          name: "Model",
          description:
            "Required. The model's resource name. This serves as an ID for the Model to use.  This name should match a model name returned by the `ListModels` method.  Format: `models/{model}`",
          type: {
            type: "string",
            description:
              "Required. The model's resource name. This serves as an ID for the Model to use.  This name should match a model name returned by the `ListModels` method.  Format: `models/{model}`",
          },
          required: true,
        },
        content: {
          name: "Content",
          description:
            "Required. The content to embed. Only the `parts.text` fields will be counted.",
          type: {
            type: "object",
            properties: {
              parts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: {
                      type: "string",
                      description:
                        "(Part of 'data' - only one field in this group can be set)",
                    },
                    inlineData: {
                      type: "object",
                      properties: {
                        mimeType: {
                          type: "string",
                        },
                        data: {
                          type: "string",
                          description: "Base64-encoded bytes",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "(Part of 'data' - only one field in this group can be set)",
                    },
                    functionCall: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        name: {
                          type: "string",
                        },
                        args: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                      description:
                        "(Part of 'data' - only one field in this group can be set)",
                    },
                    functionResponse: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        name: {
                          type: "string",
                        },
                        response: {
                          type: "object",
                          additionalProperties: true,
                        },
                        parts: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              inlineData: {
                                type: "object",
                                properties: {
                                  mimeType: {
                                    type: "string",
                                  },
                                  data: {
                                    type: "string",
                                    description: "Base64-encoded bytes",
                                  },
                                },
                                additionalProperties: true,
                              },
                            },
                            additionalProperties: true,
                          },
                        },
                        willContinue: {
                          type: "boolean",
                        },
                        scheduling: {
                          type: "string",
                          enum: [
                            "SCHEDULING_UNSPECIFIED",
                            "SILENT",
                            "WHEN_IDLE",
                            "INTERRUPT",
                          ],
                        },
                      },
                      additionalProperties: true,
                      description:
                        "(Part of 'data' - only one field in this group can be set)",
                    },
                    fileData: {
                      type: "object",
                      properties: {
                        mimeType: {
                          type: "string",
                        },
                        fileUri: {
                          type: "string",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "(Part of 'data' - only one field in this group can be set)",
                    },
                    executableCode: {
                      type: "object",
                      properties: {
                        language: {
                          type: "string",
                          enum: ["LANGUAGE_UNSPECIFIED", "PYTHON"],
                        },
                        code: {
                          type: "string",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "(Part of 'data' - only one field in this group can be set)",
                    },
                    codeExecutionResult: {
                      type: "object",
                      properties: {
                        outcome: {
                          type: "string",
                          enum: [
                            "OUTCOME_UNSPECIFIED",
                            "OUTCOME_OK",
                            "OUTCOME_FAILED",
                            "OUTCOME_DEADLINE_EXCEEDED",
                          ],
                        },
                        output: {
                          type: "string",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "(Part of 'data' - only one field in this group can be set)",
                    },
                    videoMetadata: {
                      type: "object",
                      properties: {
                        startOffset: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                        endOffset: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                        fps: {
                          type: "number",
                        },
                      },
                      additionalProperties: true,
                    },
                    thought: {
                      type: "boolean",
                    },
                    thoughtSignature: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    partMetadata: {
                      type: "object",
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
              },
              role: {
                type: "string",
              },
            },
            additionalProperties: true,
            description:
              "Required. The content to embed. Only the `parts.text` fields will be counted.",
          },
          required: true,
        },
        taskType: {
          name: "Task Type",
          description:
            "Optional. Optional task type for which the embeddings will be used. Not supported on earlier models (`models/embedding-001`).",
          type: {
            type: "string",
            enum: [
              "TASK_TYPE_UNSPECIFIED",
              "RETRIEVAL_QUERY",
              "RETRIEVAL_DOCUMENT",
              "SEMANTIC_SIMILARITY",
              "CLASSIFICATION",
              "CLUSTERING",
              "QUESTION_ANSWERING",
              "FACT_VERIFICATION",
              "CODE_RETRIEVAL_QUERY",
            ],
            description: "Type of task for which the embedding will be used.",
          },
          required: false,
        },
        title: {
          name: "Title",
          description:
            "Optional. An optional title for the text. Only applicable when TaskType is `RETRIEVAL_DOCUMENT`.  Note: Specifying a `title` for `RETRIEVAL_DOCUMENT` provides better quality embeddings for retrieval.",
          type: {
            type: "string",
            description:
              "Optional. An optional title for the text. Only applicable when TaskType is `RETRIEVAL_DOCUMENT`.  Note: Specifying a `title` for `RETRIEVAL_DOCUMENT` provides better quality embeddings for retrieval.",
          },
          required: false,
        },
        outputDimensionality: {
          name: "Output Dimensionality",
          description:
            "Optional. Optional reduced dimension for the output embedding. If set, excessive values in the output embedding are truncated from the end. Supported by newer models since 2024 only. You cannot set this value if using the earlier model (`models/embedding-001`).",
          type: {
            type: "integer",
            description:
              "Optional. Optional reduced dimension for the output embedding. If set, excessive values in the output embedding are truncated from the end. Supported by newer models since 2024 only. You cannot set this value if using the earlier model (`models/embedding-001`).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getGenerativeServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.embedContent(request, (err: any, response: any) => {
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
        properties: {
          embedding: {
            type: "object",
            properties: {
              values: {
                type: "array",
                items: {
                  type: "number",
                },
                description: "The embedding values.",
              },
            },
            description: "A list of floats representing an embedding.",
            additionalProperties: true,
          },
        },
        description: "The response to an `EmbedContentRequest`.",
        additionalProperties: true,
      },
    },
  },
};

export default embedContent;
