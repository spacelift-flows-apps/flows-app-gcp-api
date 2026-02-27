import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getGenerativeServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  inlinePassages: {
    name: "inline_passages",
    fields: {
      passages: {
        name: "passages",
        fields: {
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
        },
      },
    },
  },
  semanticRetriever: {
    name: "semantic_retriever",
    fields: {
      query: {
        name: "query",
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
      metadataFilters: {
        name: "metadata_filters",
        fields: {
          conditions: {
            name: "conditions",
            fields: {
              stringValue: "string_value",
              numericValue: "numeric_value",
            },
          },
        },
      },
      maxChunksCount: "max_chunks_count",
      minimumRelevanceScore: "minimum_relevance_score",
    },
  },
  contents: {
    name: "contents",
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
  answerStyle: "answer_style",
  safetySettings: "safety_settings",
};

const outputMapping = {
  answer: {
    name: "answer",
    fields: {
      content: {
        name: "content",
        fields: {
          parts: {
            name: "parts",
            fields: {
              inline_data: {
                name: "inlineData",
                fields: {
                  mime_type: "mimeType",
                },
              },
              function_call: "functionCall",
              function_response: {
                name: "functionResponse",
                fields: {
                  parts: {
                    name: "parts",
                    fields: {
                      inline_data: {
                        name: "inlineData",
                        fields: {
                          mime_type: "mimeType",
                        },
                      },
                    },
                  },
                  will_continue: "willContinue",
                },
              },
              file_data: {
                name: "fileData",
                fields: {
                  mime_type: "mimeType",
                  file_uri: "fileUri",
                },
              },
              executable_code: "executableCode",
              code_execution_result: "codeExecutionResult",
              video_metadata: {
                name: "videoMetadata",
                fields: {
                  start_offset: "startOffset",
                  end_offset: "endOffset",
                },
              },
              thought_signature: "thoughtSignature",
              part_metadata: "partMetadata",
            },
          },
        },
      },
      finish_reason: "finishReason",
      finish_message: "finishMessage",
      safety_ratings: "safetyRatings",
      citation_metadata: {
        name: "citationMetadata",
        fields: {
          citation_sources: {
            name: "citationSources",
            fields: {
              start_index: "startIndex",
              end_index: "endIndex",
            },
          },
        },
      },
      token_count: "tokenCount",
      grounding_attributions: {
        name: "groundingAttributions",
        fields: {
          source_id: {
            name: "sourceId",
            fields: {
              grounding_passage: {
                name: "groundingPassage",
                fields: {
                  passage_id: "passageId",
                  part_index: "partIndex",
                },
              },
              semantic_retriever_chunk: "semanticRetrieverChunk",
            },
          },
          content: {
            name: "content",
            fields: {
              parts: {
                name: "parts",
                fields: {
                  inline_data: {
                    name: "inlineData",
                    fields: {
                      mime_type: "mimeType",
                    },
                  },
                  function_call: "functionCall",
                  function_response: {
                    name: "functionResponse",
                    fields: {
                      parts: {
                        name: "parts",
                        fields: {
                          inline_data: {
                            name: "inlineData",
                            fields: {
                              mime_type: "mimeType",
                            },
                          },
                        },
                      },
                      will_continue: "willContinue",
                    },
                  },
                  file_data: {
                    name: "fileData",
                    fields: {
                      mime_type: "mimeType",
                      file_uri: "fileUri",
                    },
                  },
                  executable_code: "executableCode",
                  code_execution_result: "codeExecutionResult",
                  video_metadata: {
                    name: "videoMetadata",
                    fields: {
                      start_offset: "startOffset",
                      end_offset: "endOffset",
                    },
                  },
                  thought_signature: "thoughtSignature",
                  part_metadata: "partMetadata",
                },
              },
            },
          },
        },
      },
      grounding_metadata: {
        name: "groundingMetadata",
        fields: {
          search_entry_point: {
            name: "searchEntryPoint",
            fields: {
              rendered_content: "renderedContent",
              sdk_blob: "sdkBlob",
            },
          },
          grounding_chunks: {
            name: "groundingChunks",
            fields: {
              retrieved_context: "retrievedContext",
              maps: {
                name: "maps",
                fields: {
                  place_id: "placeId",
                  place_answer_sources: {
                    name: "placeAnswerSources",
                    fields: {
                      review_snippets: {
                        name: "reviewSnippets",
                        fields: {
                          review_id: "reviewId",
                          google_maps_uri: "googleMapsUri",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          grounding_supports: {
            name: "groundingSupports",
            fields: {
              segment: {
                name: "segment",
                fields: {
                  part_index: "partIndex",
                  start_index: "startIndex",
                  end_index: "endIndex",
                },
              },
              grounding_chunk_indices: "groundingChunkIndices",
              confidence_scores: "confidenceScores",
            },
          },
          retrieval_metadata: {
            name: "retrievalMetadata",
            fields: {
              google_search_dynamic_retrieval_score:
                "googleSearchDynamicRetrievalScore",
            },
          },
          web_search_queries: "webSearchQueries",
          google_maps_widget_context_token: "googleMapsWidgetContextToken",
        },
      },
      avg_logprobs: "avgLogprobs",
      logprobs_result: {
        name: "logprobsResult",
        fields: {
          log_probability_sum: "logProbabilitySum",
          top_candidates: {
            name: "topCandidates",
            fields: {
              candidates: {
                name: "candidates",
                fields: {
                  token_id: "tokenId",
                  log_probability: "logProbability",
                },
              },
            },
          },
          chosen_candidates: {
            name: "chosenCandidates",
            fields: {
              token_id: "tokenId",
              log_probability: "logProbability",
            },
          },
        },
      },
      url_context_metadata: {
        name: "urlContextMetadata",
        fields: {
          url_metadata: {
            name: "urlMetadata",
            fields: {
              retrieved_url: "retrievedUrl",
              url_retrieval_status: "urlRetrievalStatus",
            },
          },
        },
      },
    },
  },
  answerable_probability: "answerableProbability",
  input_feedback: {
    name: "inputFeedback",
    fields: {
      block_reason: "blockReason",
      safety_ratings: "safetyRatings",
    },
  },
};

const generateAnswer: AppBlock = {
  name: "Generate Answer",
  description: `Generates a grounded answer from the model given an input 'GenerateAnswerRequest'.`,
  category: "Generation",
  inputs: {
    default: {
      config: {
        inlinePassages: {
          name: "Inline Passages",
          description: "Passages provided inline with the request.",
          type: {
            type: "object",
            properties: {
              passages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    content: {
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
                                              description:
                                                "Base64-encoded bytes",
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
                                    description:
                                      "Duration string (e.g., '1.5s', '300s')",
                                  },
                                  endOffset: {
                                    type: "string",
                                    description:
                                      "Duration string (e.g., '1.5s', '300s')",
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
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "Passages provided inline with the request. (Part of 'grounding_source' - only one field in this group can be set)",
          },
          required: false,
        },
        semanticRetriever: {
          name: "Semantic Retriever",
          description:
            "Content retrieved from resources created via the Semantic Retriever API.",
          type: {
            type: "object",
            properties: {
              source: {
                type: "string",
                description:
                  "Required. Name of the resource for retrieval. Example: `corpora/123` or `corpora/123/documents/abc`.",
              },
              query: {
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
                              description:
                                "Duration string (e.g., '1.5s', '300s')",
                            },
                            endOffset: {
                              type: "string",
                              description:
                                "Duration string (e.g., '1.5s', '300s')",
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
                  "Required. Query to use for matching `Chunk`s in the given resource by similarity.",
              },
              metadataFilters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                    },
                    conditions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          stringValue: {
                            type: "string",
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          numericValue: {
                            type: "number",
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          operation: {
                            type: "string",
                            enum: [
                              "OPERATOR_UNSPECIFIED",
                              "LESS",
                              "LESS_EQUAL",
                              "EQUAL",
                              "GREATER_EQUAL",
                              "GREATER",
                              "NOT_EQUAL",
                              "INCLUDES",
                              "EXCLUDES",
                            ],
                          },
                        },
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Optional. Filters for selecting `Document`s and/or `Chunk`s from the resource.",
              },
              maxChunksCount: {
                type: "integer",
                description:
                  "Optional. Maximum number of relevant `Chunk`s to retrieve.",
              },
              minimumRelevanceScore: {
                type: "number",
                description:
                  "Optional. Minimum relevance score for retrieved relevant `Chunk`s.",
              },
            },
            required: ["source", "query"],
            description:
              "Configuration for retrieving grounding content from a `Corpus` or `Document` created using the Semantic Retriever API. (Part of 'grounding_source' - only one field in this group can be set)",
            additionalProperties: true,
          },
          required: false,
        },
        model: {
          name: "Model",
          description:
            "Required. The name of the `Model` to use for generating the grounded response.  Format: `model=models/{model}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the `Model` to use for generating the grounded response.  Format: `model=models/{model}`.",
          },
          required: true,
        },
        contents: {
          name: "Contents",
          description:
            "Required. The content of the current conversation with the `Model`. For single-turn queries, this is a single question to answer. For multi-turn queries, this is a repeated field that contains conversation history and the last `Content` in the list containing the question.  Note: `GenerateAnswer` only supports queries in English.",
          type: {
            type: "array",
            items: {
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
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                          endOffset: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
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
            },
            description:
              "Required. The content of the current conversation with the `Model`. For single-turn queries, this is a single question to answer. For multi-turn queries, this is a repeated field that contains conversation history and the last `Content` in the list containing the question.  Note: `GenerateAnswer` only supports queries in English.",
          },
          required: true,
        },
        answerStyle: {
          name: "Answer Style",
          description: "Required. Style in which answers should be returned.",
          type: {
            type: "string",
            enum: [
              "ANSWER_STYLE_UNSPECIFIED",
              "ABSTRACTIVE",
              "EXTRACTIVE",
              "VERBOSE",
            ],
            description: "Required. Style in which answers should be returned.",
          },
          required: true,
        },
        safetySettings: {
          name: "Safety Settings",
          description:
            "Optional. A list of unique `SafetySetting` instances for blocking unsafe content.  This will be enforced on the `GenerateAnswerRequest.contents` and `GenerateAnswerResponse.candidate`. There should not be more than one setting for each `SafetyCategory` type. The API will block any contents and responses that fail to meet the thresholds set by these settings. This list overrides the default settings for each `SafetyCategory` specified in the safety_settings. If there is no `SafetySetting` for a given `SafetyCategory` provided in the list, the API will use the default safety setting for that category. Harm categories HARM_CATEGORY_HATE_SPEECH, HARM_CATEGORY_SEXUALLY_EXPLICIT, HARM_CATEGORY_DANGEROUS_CONTENT, HARM_CATEGORY_HARASSMENT are supported. Refer to the [guide](https://ai.google.dev/gemini-api/docs/safety-settings) for detailed information on available safety settings. Also refer to the [Safety guidance](https://ai.google.dev/gemini-api/docs/safety-guidance) to learn how to incorporate safety considerations in your AI applications.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  enum: [
                    "HARM_CATEGORY_UNSPECIFIED",
                    "HARM_CATEGORY_DEROGATORY",
                    "HARM_CATEGORY_TOXICITY",
                    "HARM_CATEGORY_VIOLENCE",
                    "HARM_CATEGORY_SEXUAL",
                    "HARM_CATEGORY_MEDICAL",
                    "HARM_CATEGORY_DANGEROUS",
                    "HARM_CATEGORY_HARASSMENT",
                    "HARM_CATEGORY_HATE_SPEECH",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "HARM_CATEGORY_CIVIC_INTEGRITY",
                  ],
                },
                threshold: {
                  type: "string",
                  enum: [
                    "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
                    "BLOCK_LOW_AND_ABOVE",
                    "BLOCK_MEDIUM_AND_ABOVE",
                    "BLOCK_ONLY_HIGH",
                    "BLOCK_NONE",
                    "OFF",
                  ],
                },
              },
              additionalProperties: true,
            },
            description:
              "Optional. A list of unique `SafetySetting` instances for blocking unsafe content.  This will be enforced on the `GenerateAnswerRequest.contents` and `GenerateAnswerResponse.candidate`. There should not be more than one setting for each `SafetyCategory` type. The API will block any contents and responses that fail to meet the thresholds set by these settings. This list overrides the default settings for each `SafetyCategory` specified in the safety_settings. If there is no `SafetySetting` for a given `SafetyCategory` provided in the list, the API will use the default safety setting for that category. Harm categories HARM_CATEGORY_HATE_SPEECH, HARM_CATEGORY_SEXUALLY_EXPLICIT, HARM_CATEGORY_DANGEROUS_CONTENT, HARM_CATEGORY_HARASSMENT are supported. Refer to the [guide](https://ai.google.dev/gemini-api/docs/safety-settings) for detailed information on available safety settings. Also refer to the [Safety guidance](https://ai.google.dev/gemini-api/docs/safety-guidance) to learn how to incorporate safety considerations in your AI applications.",
          },
          required: false,
        },
        temperature: {
          name: "Temperature",
          description:
            "Optional. Controls the randomness of the output.  Values can range from [0.0,1.0], inclusive. A value closer to 1.0 will produce responses that are more varied and creative, while a value closer to 0.0 will typically result in more straightforward responses from the model. A low temperature (~0.2) is usually recommended for Attributed-Question-Answering use cases.",
          type: {
            type: "number",
            description:
              "Optional. Controls the randomness of the output.  Values can range from [0.0,1.0], inclusive. A value closer to 1.0 will produce responses that are more varied and creative, while a value closer to 0.0 will typically result in more straightforward responses from the model. A low temperature (~0.2) is usually recommended for Attributed-Question-Answering use cases.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getGenerativeServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.generateAnswer(request, (err: any, response: any) => {
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
          answer: {
            type: "object",
            properties: {
              index: {
                type: "integer",
                description:
                  "Output only. Index of the candidate in the list of response candidates.",
              },
              content: {
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
                              description:
                                "Duration string (e.g., '1.5s', '300s')",
                            },
                            endOffset: {
                              type: "string",
                              description:
                                "Duration string (e.g., '1.5s', '300s')",
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
                  "Output only. Generated content returned from the model.",
              },
              finishReason: {
                type: "string",
                enum: [
                  "FINISH_REASON_UNSPECIFIED",
                  "STOP",
                  "MAX_TOKENS",
                  "SAFETY",
                  "RECITATION",
                  "LANGUAGE",
                  "OTHER",
                  "BLOCKLIST",
                  "PROHIBITED_CONTENT",
                  "SPII",
                  "MALFORMED_FUNCTION_CALL",
                  "IMAGE_SAFETY",
                  "IMAGE_PROHIBITED_CONTENT",
                  "IMAGE_OTHER",
                  "NO_IMAGE",
                  "IMAGE_RECITATION",
                  "UNEXPECTED_TOOL_CALL",
                  "TOO_MANY_TOOL_CALLS",
                ],
                description:
                  "Optional. Output only. The reason why the model stopped generating tokens.  If empty, the model has not stopped generating tokens.",
              },
              finishMessage: {
                type: "string",
                description:
                  "Optional. Output only. Details the reason why the model stopped generating tokens. This is populated only when `finish_reason` is set.",
              },
              safetyRatings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: {
                      type: "string",
                      enum: [
                        "HARM_CATEGORY_UNSPECIFIED",
                        "HARM_CATEGORY_DEROGATORY",
                        "HARM_CATEGORY_TOXICITY",
                        "HARM_CATEGORY_VIOLENCE",
                        "HARM_CATEGORY_SEXUAL",
                        "HARM_CATEGORY_MEDICAL",
                        "HARM_CATEGORY_DANGEROUS",
                        "HARM_CATEGORY_HARASSMENT",
                        "HARM_CATEGORY_HATE_SPEECH",
                        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "HARM_CATEGORY_CIVIC_INTEGRITY",
                      ],
                    },
                    probability: {
                      type: "string",
                      enum: [
                        "HARM_PROBABILITY_UNSPECIFIED",
                        "NEGLIGIBLE",
                        "LOW",
                        "MEDIUM",
                        "HIGH",
                      ],
                    },
                    blocked: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "List of ratings for the safety of a response candidate.  There is at most one rating per category.",
              },
              citationMetadata: {
                type: "object",
                properties: {
                  citationSources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        startIndex: {
                          type: "integer",
                        },
                        endIndex: {
                          type: "integer",
                        },
                        uri: {
                          type: "string",
                        },
                        license: {
                          type: "string",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                },
                additionalProperties: true,
                description:
                  'Output only. Citation information for model-generated candidate.  This field may be populated with recitation information for any text included in the `content`. These are passages that are "recited" from copyrighted material in the foundational LLM\'s training data.',
              },
              tokenCount: {
                type: "integer",
                description: "Output only. Token count for this candidate.",
              },
              groundingAttributions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    sourceId: {
                      type: "object",
                      properties: {
                        groundingPassage: {
                          type: "object",
                          properties: {
                            passageId: {
                              type: "string",
                              description:
                                "Output only. ID of the passage matching the `GenerateAnswerRequest`'s `GroundingPassage.id`.",
                            },
                            partIndex: {
                              type: "integer",
                              description:
                                "Output only. Index of the part within the `GenerateAnswerRequest`'s `GroundingPassage.content`.",
                            },
                          },
                          description:
                            "Identifier for a part within a `GroundingPassage`. (Part of 'source' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        semanticRetrieverChunk: {
                          type: "object",
                          properties: {
                            source: {
                              type: "string",
                              description:
                                "Output only. Name of the source matching the request's `SemanticRetrieverConfig.source`. Example: `corpora/123` or `corpora/123/documents/abc`",
                            },
                            chunk: {
                              type: "string",
                              description:
                                "Output only. Name of the `Chunk` containing the attributed text. Example: `corpora/123/documents/abc/chunks/xyz`",
                            },
                          },
                          description:
                            "Identifier for a `Chunk` retrieved via Semantic Retriever specified in the `GenerateAnswerRequest` using `SemanticRetrieverConfig`. (Part of 'source' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "Identifier for the source contributing to this attribution.",
                      additionalProperties: true,
                    },
                    content: {
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
                                              description:
                                                "Base64-encoded bytes",
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
                                    description:
                                      "Duration string (e.g., '1.5s', '300s')",
                                  },
                                  endOffset: {
                                    type: "string",
                                    description:
                                      "Duration string (e.g., '1.5s', '300s')",
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
                        "Grounding source content that makes up this attribution.",
                    },
                  },
                  description:
                    "Attribution for a source that contributed to an answer.",
                  additionalProperties: true,
                },
                description:
                  "Output only. Attribution information for sources that contributed to a grounded answer.  This field is populated for `GenerateAnswer` calls.",
              },
              groundingMetadata: {
                type: "object",
                properties: {
                  searchEntryPoint: {
                    type: "object",
                    properties: {
                      renderedContent: {
                        type: "string",
                        description:
                          "Optional. Web content snippet that can be embedded in a web page or an app webview.",
                      },
                      sdkBlob: {
                        type: "string",
                        description: "Base64-encoded bytes",
                      },
                    },
                    description: "Google search entry point.",
                    additionalProperties: true,
                  },
                  groundingChunks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        web: {
                          type: "object",
                          properties: {
                            uri: {
                              type: "string",
                              description: "URI reference of the chunk.",
                            },
                            title: {
                              type: "string",
                              description: "Title of the chunk.",
                            },
                          },
                          description:
                            "Chunk from the web. (Part of 'chunk_type' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        retrievedContext: {
                          type: "object",
                          properties: {
                            uri: {
                              type: "string",
                              description:
                                "Optional. URI reference of the semantic retrieval document.",
                            },
                            title: {
                              type: "string",
                              description: "Optional. Title of the document.",
                            },
                            text: {
                              type: "string",
                              description: "Optional. Text of the chunk.",
                            },
                          },
                          description:
                            "Chunk from context retrieved by the file search tool. (Part of 'chunk_type' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        maps: {
                          type: "object",
                          properties: {
                            uri: {
                              type: "string",
                              description: "URI reference of the place.",
                            },
                            title: {
                              type: "string",
                              description: "Title of the place.",
                            },
                            text: {
                              type: "string",
                              description:
                                "Text description of the place answer.",
                            },
                            placeId: {
                              type: "string",
                              description:
                                "This ID of the place, in `places/{place_id}` format. A user can use this ID to look up that place.",
                            },
                            placeAnswerSources: {
                              type: "object",
                              properties: {
                                reviewSnippets: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      reviewId: {
                                        type: "string",
                                        description:
                                          "The ID of the review snippet.",
                                      },
                                      googleMapsUri: {
                                        type: "string",
                                        description:
                                          "A link that corresponds to the user review on Google Maps.",
                                      },
                                      title: {
                                        type: "string",
                                        description: "Title of the review.",
                                      },
                                    },
                                    description:
                                      "Encapsulates a snippet of a user review that answers a question about the features of a specific place in Google Maps.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Snippets of reviews that are used to generate answers about the features of a given place in Google Maps.",
                                },
                              },
                              description:
                                'Collection of sources that provide answers about the features of a given place in Google Maps. Each PlaceAnswerSources message corresponds to a specific place in Google Maps. The Google Maps tool used these sources in order to answer questions about features of the place (e.g: "does Bar Foo have Wifi" or "is Foo Bar wheelchair accessible?"). Currently we only support review snippets as sources.',
                              additionalProperties: true,
                            },
                          },
                          description:
                            "A grounding chunk from Google Maps. A Maps chunk corresponds to a single place. (Part of 'chunk_type' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                      },
                      description: "Grounding chunk.",
                      additionalProperties: true,
                    },
                    description:
                      "List of supporting references retrieved from specified grounding source.",
                  },
                  groundingSupports: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        segment: {
                          type: "object",
                          properties: {
                            partIndex: {
                              type: "integer",
                              description:
                                "Output only. The index of a Part object within its parent Content object.",
                            },
                            startIndex: {
                              type: "integer",
                              description:
                                "Output only. Start index in the given Part, measured in bytes. Offset from the start of the Part, inclusive, starting at zero.",
                            },
                            endIndex: {
                              type: "integer",
                              description:
                                "Output only. End index in the given Part, measured in bytes. Offset from the start of the Part, exclusive, starting at zero.",
                            },
                            text: {
                              type: "string",
                              description:
                                "Output only. The text corresponding to the segment from the response.",
                            },
                          },
                          description: "Segment of the content.",
                          additionalProperties: true,
                        },
                        groundingChunkIndices: {
                          type: "array",
                          items: {
                            type: "integer",
                          },
                          description:
                            "A list of indices (into 'grounding_chunk') specifying the citations associated with the claim. For instance [1,3,4] means that grounding_chunk[1], grounding_chunk[3], grounding_chunk[4] are the retrieved content attributed to the claim.",
                        },
                        confidenceScores: {
                          type: "array",
                          items: {
                            type: "number",
                          },
                          description:
                            "Confidence score of the support references. Ranges from 0 to 1. 1 is the most confident. This list must have the same size as the grounding_chunk_indices.",
                        },
                      },
                      description: "Grounding support.",
                      additionalProperties: true,
                    },
                    description: "List of grounding support.",
                  },
                  retrievalMetadata: {
                    type: "object",
                    properties: {
                      googleSearchDynamicRetrievalScore: {
                        type: "number",
                        description:
                          "Optional. Score indicating how likely information from google search could help answer the prompt. The score is in the range [0, 1], where 0 is the least likely and 1 is the most likely. This score is only populated when google search grounding and dynamic retrieval is enabled. It will be compared to the threshold to determine whether to trigger google search.",
                      },
                    },
                    description:
                      "Metadata related to retrieval in the grounding flow.",
                    additionalProperties: true,
                  },
                  webSearchQueries: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Web search queries for the following-up web search.",
                  },
                  googleMapsWidgetContextToken: {
                    type: "string",
                    description:
                      "Optional. Resource name of the Google Maps widget context token that can be used with the PlacesContextElement widget in order to render contextual data. Only populated in the case that grounding with Google Maps is enabled.",
                  },
                },
                description:
                  "Metadata returned to client when grounding is enabled.",
                additionalProperties: true,
              },
              avgLogprobs: {
                type: "number",
                description:
                  "Output only. Average log probability score of the candidate.",
              },
              logprobsResult: {
                type: "object",
                properties: {
                  logProbabilitySum: {
                    type: "number",
                    description: "Sum of log probabilities for all tokens.",
                  },
                  topCandidates: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        candidates: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              token: {
                                type: "string",
                                description:
                                  "The candidate’s token string value.",
                              },
                              tokenId: {
                                type: "integer",
                                description: "The candidate’s token id value.",
                              },
                              logProbability: {
                                type: "number",
                                description: "The candidate's log probability.",
                              },
                            },
                            description:
                              "Candidate for the logprobs token and score.",
                            additionalProperties: true,
                          },
                          description:
                            "Sorted by log probability in descending order.",
                        },
                      },
                      description:
                        "Candidates with top log probabilities at each decoding step.",
                      additionalProperties: true,
                    },
                    description: "Length = total number of decoding steps.",
                  },
                  chosenCandidates: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        token: {
                          type: "string",
                          description: "The candidate’s token string value.",
                        },
                        tokenId: {
                          type: "integer",
                          description: "The candidate’s token id value.",
                        },
                        logProbability: {
                          type: "number",
                          description: "The candidate's log probability.",
                        },
                      },
                      description:
                        "Candidate for the logprobs token and score.",
                      additionalProperties: true,
                    },
                    description:
                      "Length = total number of decoding steps. The chosen candidates may or may not be in top_candidates.",
                  },
                },
                description: "Logprobs Result",
                additionalProperties: true,
              },
              urlContextMetadata: {
                type: "object",
                properties: {
                  urlMetadata: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        retrievedUrl: {
                          type: "string",
                          description: "Retrieved url by the tool.",
                        },
                        urlRetrievalStatus: {
                          type: "string",
                          enum: [
                            "URL_RETRIEVAL_STATUS_UNSPECIFIED",
                            "URL_RETRIEVAL_STATUS_SUCCESS",
                            "URL_RETRIEVAL_STATUS_ERROR",
                            "URL_RETRIEVAL_STATUS_PAYWALL",
                            "URL_RETRIEVAL_STATUS_UNSAFE",
                          ],
                          description: "Status of the url retrieval.",
                        },
                      },
                      description: "Context of the a single url retrieval.",
                      additionalProperties: true,
                    },
                    description: "List of url context.",
                  },
                },
                description: "Metadata related to url context retrieval tool.",
                additionalProperties: true,
              },
            },
            description: "A response candidate generated from the model.",
            additionalProperties: true,
          },
          answerableProbability: {
            type: "number",
            description:
              'Output only. The model\'s estimate of the probability that its answer is correct and grounded in the input passages.  A low `answerable_probability` indicates that the answer might not be grounded in the sources.  When `answerable_probability` is low, you may want to:  * Display a message to the effect of "We couldn’t answer that question" to the user. * Fall back to a general-purpose LLM that answers the question from world knowledge. The threshold and nature of such fallbacks will depend on individual use cases. `0.5` is a good starting threshold.',
          },
          inputFeedback: {
            type: "object",
            properties: {
              blockReason: {
                type: "string",
                enum: ["BLOCK_REASON_UNSPECIFIED", "SAFETY", "OTHER"],
                description:
                  "Optional. If set, the input was blocked and no candidates are returned. Rephrase the input.",
              },
              safetyRatings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: {
                      type: "string",
                      enum: [
                        "HARM_CATEGORY_UNSPECIFIED",
                        "HARM_CATEGORY_DEROGATORY",
                        "HARM_CATEGORY_TOXICITY",
                        "HARM_CATEGORY_VIOLENCE",
                        "HARM_CATEGORY_SEXUAL",
                        "HARM_CATEGORY_MEDICAL",
                        "HARM_CATEGORY_DANGEROUS",
                        "HARM_CATEGORY_HARASSMENT",
                        "HARM_CATEGORY_HATE_SPEECH",
                        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "HARM_CATEGORY_CIVIC_INTEGRITY",
                      ],
                    },
                    probability: {
                      type: "string",
                      enum: [
                        "HARM_PROBABILITY_UNSPECIFIED",
                        "NEGLIGIBLE",
                        "LOW",
                        "MEDIUM",
                        "HIGH",
                      ],
                    },
                    blocked: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Ratings for safety of the input. There is at most one rating per category.",
              },
            },
            description:
              "Feedback related to the input data used to answer the question, as opposed to the model-generated response to the question.",
            additionalProperties: true,
          },
        },
        description: "Response from the model for a grounded answer.",
        additionalProperties: true,
      },
    },
  },
};

export default generateAnswer;
