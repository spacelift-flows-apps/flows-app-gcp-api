import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getGenerativeServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  systemInstruction: {
    name: "system_instruction",
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
  tools: {
    name: "tools",
    fields: {
      functionDeclarations: {
        name: "function_declarations",
        fields: {
          parameters: {
            name: "parameters",
            fields: {
              maxItems: "max_items",
              minItems: "min_items",
              minProperties: "min_properties",
              maxProperties: "max_properties",
              minLength: "min_length",
              maxLength: "max_length",
              anyOf: "any_of",
              propertyOrdering: "property_ordering",
            },
          },
          parametersJsonSchema: "parameters_json_schema",
          response: {
            name: "response",
            fields: {
              maxItems: "max_items",
              minItems: "min_items",
              minProperties: "min_properties",
              maxProperties: "max_properties",
              minLength: "min_length",
              maxLength: "max_length",
              anyOf: "any_of",
              propertyOrdering: "property_ordering",
            },
          },
          responseJsonSchema: "response_json_schema",
        },
      },
      googleSearchRetrieval: {
        name: "google_search_retrieval",
        fields: {
          dynamicRetrievalConfig: {
            name: "dynamic_retrieval_config",
            fields: {
              dynamicThreshold: "dynamic_threshold",
            },
          },
        },
      },
      codeExecution: "code_execution",
      googleSearch: {
        name: "google_search",
        fields: {
          timeRangeFilter: {
            name: "time_range_filter",
            fields: {
              startTime: "start_time",
              endTime: "end_time",
            },
          },
        },
      },
      computerUse: {
        name: "computer_use",
        fields: {
          excludedPredefinedFunctions: "excluded_predefined_functions",
        },
      },
      urlContext: "url_context",
      fileSearch: {
        name: "file_search",
        fields: {
          retrievalResources: {
            name: "retrieval_resources",
            fields: {
              ragStoreName: "rag_store_name",
            },
          },
          retrievalConfig: {
            name: "retrieval_config",
            fields: {
              topK: "top_k",
              metadataFilter: "metadata_filter",
            },
          },
        },
      },
      googleMaps: {
        name: "google_maps",
        fields: {
          enableWidget: "enable_widget",
        },
      },
    },
  },
  toolConfig: {
    name: "tool_config",
    fields: {
      functionCallingConfig: {
        name: "function_calling_config",
        fields: {
          allowedFunctionNames: "allowed_function_names",
        },
      },
      retrievalConfig: {
        name: "retrieval_config",
        fields: {
          latLng: "lat_lng",
          languageCode: "language_code",
        },
      },
    },
  },
  safetySettings: "safety_settings",
  generationConfig: {
    name: "generation_config",
    fields: {
      candidateCount: "candidate_count",
      stopSequences: "stop_sequences",
      maxOutputTokens: "max_output_tokens",
      topP: "top_p",
      topK: "top_k",
      responseMimeType: "response_mime_type",
      responseSchema: {
        name: "response_schema",
        fields: {
          maxItems: "max_items",
          minItems: "min_items",
          minProperties: "min_properties",
          maxProperties: "max_properties",
          minLength: "min_length",
          maxLength: "max_length",
          anyOf: "any_of",
          propertyOrdering: "property_ordering",
        },
      },
      responseJsonSchema: "response_json_schema",
      responseJsonSchemaOrdered: "response_json_schema_ordered",
      presencePenalty: "presence_penalty",
      frequencyPenalty: "frequency_penalty",
      responseLogprobs: "response_logprobs",
      enableEnhancedCivicAnswers: "enable_enhanced_civic_answers",
      responseModalities: "response_modalities",
      speechConfig: {
        name: "speech_config",
        fields: {
          voiceConfig: {
            name: "voice_config",
            fields: {
              prebuiltVoiceConfig: {
                name: "prebuilt_voice_config",
                fields: {
                  voiceName: "voice_name",
                },
              },
            },
          },
          multiSpeakerVoiceConfig: {
            name: "multi_speaker_voice_config",
            fields: {
              speakerVoiceConfigs: {
                name: "speaker_voice_configs",
                fields: {
                  voiceConfig: {
                    name: "voice_config",
                    fields: {
                      prebuiltVoiceConfig: {
                        name: "prebuilt_voice_config",
                        fields: {
                          voiceName: "voice_name",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          languageCode: "language_code",
        },
      },
      thinkingConfig: {
        name: "thinking_config",
        fields: {
          includeThoughts: "include_thoughts",
          thinkingBudget: "thinking_budget",
        },
      },
      imageConfig: {
        name: "image_config",
        fields: {
          aspectRatio: "aspect_ratio",
        },
      },
      mediaResolution: "media_resolution",
    },
  },
  cachedContent: "cached_content",
};

const outputMapping = {
  candidates: {
    name: "candidates",
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
  prompt_feedback: {
    name: "promptFeedback",
    fields: {
      block_reason: "blockReason",
      safety_ratings: "safetyRatings",
    },
  },
  usage_metadata: {
    name: "usageMetadata",
    fields: {
      prompt_token_count: "promptTokenCount",
      cached_content_token_count: "cachedContentTokenCount",
      candidates_token_count: "candidatesTokenCount",
      tool_use_prompt_token_count: "toolUsePromptTokenCount",
      thoughts_token_count: "thoughtsTokenCount",
      total_token_count: "totalTokenCount",
      prompt_tokens_details: {
        name: "promptTokensDetails",
        fields: {
          token_count: "tokenCount",
        },
      },
      cache_tokens_details: {
        name: "cacheTokensDetails",
        fields: {
          token_count: "tokenCount",
        },
      },
      candidates_tokens_details: {
        name: "candidatesTokensDetails",
        fields: {
          token_count: "tokenCount",
        },
      },
      tool_use_prompt_tokens_details: {
        name: "toolUsePromptTokensDetails",
        fields: {
          token_count: "tokenCount",
        },
      },
    },
  },
  model_version: "modelVersion",
  response_id: "responseId",
};

const generateContent: AppBlock = {
  name: "Generate Content",
  description: `Generates a model response given an input 'GenerateContentRequest'. Refer to the [text generation guide](https://ai.google.dev/gemini-api/docs/text-generation) for detailed usage information. Input capabilities differ between models, including tuned models. Refer to the [model guide](https://ai.google.dev/gemini-api/docs/models/gemini) and [tuning guide](https://ai.google.dev/gemini-api/docs/model-tuning) for details.`,
  category: "Generation",
  inputs: {
    default: {
      config: {
        model: {
          name: "Model",
          description:
            "Required. The name of the `Model` to use for generating the completion.  Format: `models/{model}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the `Model` to use for generating the completion.  Format: `models/{model}`.",
          },
          required: true,
        },
        systemInstruction: {
          name: "System Instruction",
          description:
            "Optional. Developer set [system instruction(s)](https://ai.google.dev/gemini-api/docs/system-instructions). Currently, text only.",
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
              "Optional. Developer set [system instruction(s)](https://ai.google.dev/gemini-api/docs/system-instructions). Currently, text only.",
          },
          required: false,
        },
        contents: {
          name: "Contents",
          description:
            "Required. The content of the current conversation with the model.  For single-turn queries, this is a single instance. For multi-turn queries like [chat](https://ai.google.dev/gemini-api/docs/text-generation#chat), this is a repeated field that contains the conversation history and the latest request.",
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
              "Required. The content of the current conversation with the model.  For single-turn queries, this is a single instance. For multi-turn queries like [chat](https://ai.google.dev/gemini-api/docs/text-generation#chat), this is a repeated field that contains the conversation history and the latest request.",
          },
          required: true,
        },
        tools: {
          name: "Tools",
          description:
            "Optional. A list of `Tools` the `Model` may use to generate the next response.  A `Tool` is a piece of code that enables the system to interact with external systems to perform an action, or set of actions, outside of knowledge and scope of the `Model`. Supported `Tool`s are `Function` and `code_execution`. Refer to the [Function calling](https://ai.google.dev/gemini-api/docs/function-calling) and the [Code execution](https://ai.google.dev/gemini-api/docs/code-execution) guides to learn more.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                functionDeclarations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                      parameters: {
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                            enum: [
                              "TYPE_UNSPECIFIED",
                              "STRING",
                              "NUMBER",
                              "INTEGER",
                              "BOOLEAN",
                              "ARRAY",
                              "OBJECT",
                              "NULL",
                            ],
                          },
                          format: {
                            type: "string",
                          },
                          title: {
                            type: "string",
                          },
                          description: {
                            type: "string",
                          },
                          nullable: {
                            type: "boolean",
                          },
                          enum: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          items: {
                            type: "object",
                            additionalProperties: true,
                          },
                          maxItems: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          minItems: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          properties: {
                            type: "object",
                            additionalProperties: {
                              type: "string",
                            },
                          },
                          required: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          minProperties: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          maxProperties: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          minimum: {
                            type: "number",
                          },
                          maximum: {
                            type: "number",
                          },
                          minLength: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          maxLength: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          pattern: {
                            type: "string",
                          },
                          example: {
                            description: "Any JSON value",
                          },
                          anyOf: {
                            type: "array",
                            items: {
                              type: "object",
                              additionalProperties: true,
                            },
                          },
                          propertyOrdering: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          default: {
                            description: "Any JSON value",
                          },
                        },
                        additionalProperties: true,
                      },
                      parametersJsonSchema: {
                        description: "Any JSON value",
                      },
                      response: {
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                            enum: [
                              "TYPE_UNSPECIFIED",
                              "STRING",
                              "NUMBER",
                              "INTEGER",
                              "BOOLEAN",
                              "ARRAY",
                              "OBJECT",
                              "NULL",
                            ],
                          },
                          format: {
                            type: "string",
                          },
                          title: {
                            type: "string",
                          },
                          description: {
                            type: "string",
                          },
                          nullable: {
                            type: "boolean",
                          },
                          enum: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          items: {
                            type: "object",
                            additionalProperties: true,
                          },
                          maxItems: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          minItems: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          properties: {
                            type: "object",
                            additionalProperties: {
                              type: "string",
                            },
                          },
                          required: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          minProperties: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          maxProperties: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          minimum: {
                            type: "number",
                          },
                          maximum: {
                            type: "number",
                          },
                          minLength: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          maxLength: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          pattern: {
                            type: "string",
                          },
                          example: {
                            description: "Any JSON value",
                          },
                          anyOf: {
                            type: "array",
                            items: {
                              type: "object",
                              additionalProperties: true,
                            },
                          },
                          propertyOrdering: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          default: {
                            description: "Any JSON value",
                          },
                        },
                        additionalProperties: true,
                      },
                      responseJsonSchema: {
                        description: "Any JSON value",
                      },
                      behavior: {
                        type: "string",
                        enum: ["UNSPECIFIED", "BLOCKING", "NON_BLOCKING"],
                      },
                    },
                    additionalProperties: true,
                  },
                },
                googleSearchRetrieval: {
                  type: "object",
                  properties: {
                    dynamicRetrievalConfig: {
                      type: "object",
                      properties: {
                        mode: {
                          type: "string",
                          enum: ["MODE_UNSPECIFIED", "MODE_DYNAMIC"],
                        },
                        dynamicThreshold: {
                          type: "number",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                codeExecution: {
                  type: "object",
                  properties: {},
                  additionalProperties: true,
                },
                googleSearch: {
                  type: "object",
                  properties: {
                    timeRangeFilter: {
                      type: "object",
                      properties: {
                        startTime: {
                          type: "string",
                          description:
                            "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                        },
                        endTime: {
                          type: "string",
                          description:
                            "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                computerUse: {
                  type: "object",
                  properties: {
                    environment: {
                      type: "string",
                      enum: ["ENVIRONMENT_UNSPECIFIED", "ENVIRONMENT_BROWSER"],
                    },
                    excludedPredefinedFunctions: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                  additionalProperties: true,
                },
                urlContext: {
                  type: "object",
                  properties: {},
                  additionalProperties: true,
                },
                fileSearch: {
                  type: "object",
                  properties: {
                    retrievalResources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          ragStoreName: {
                            type: "string",
                          },
                        },
                        additionalProperties: true,
                      },
                    },
                    retrievalConfig: {
                      type: "object",
                      properties: {
                        topK: {
                          type: "integer",
                        },
                        metadataFilter: {
                          type: "string",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                googleMaps: {
                  type: "object",
                  properties: {
                    enableWidget: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
            },
            description:
              "Optional. A list of `Tools` the `Model` may use to generate the next response.  A `Tool` is a piece of code that enables the system to interact with external systems to perform an action, or set of actions, outside of knowledge and scope of the `Model`. Supported `Tool`s are `Function` and `code_execution`. Refer to the [Function calling](https://ai.google.dev/gemini-api/docs/function-calling) and the [Code execution](https://ai.google.dev/gemini-api/docs/code-execution) guides to learn more.",
          },
          required: false,
        },
        toolConfig: {
          name: "Tool Config",
          description:
            "Optional. Tool configuration for any `Tool` specified in the request. Refer to the [Function calling guide](https://ai.google.dev/gemini-api/docs/function-calling#function_calling_mode) for a usage example.",
          type: {
            type: "object",
            properties: {
              functionCallingConfig: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    enum: [
                      "MODE_UNSPECIFIED",
                      "AUTO",
                      "ANY",
                      "NONE",
                      "VALIDATED",
                    ],
                  },
                  allowedFunctionNames: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                additionalProperties: true,
              },
              retrievalConfig: {
                type: "object",
                properties: {
                  latLng: {
                    type: "object",
                    properties: {
                      latitude: {
                        type: "number",
                      },
                      longitude: {
                        type: "number",
                      },
                    },
                    additionalProperties: true,
                  },
                  languageCode: {
                    type: "string",
                  },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
            description:
              "Optional. Tool configuration for any `Tool` specified in the request. Refer to the [Function calling guide](https://ai.google.dev/gemini-api/docs/function-calling#function_calling_mode) for a usage example.",
          },
          required: false,
        },
        safetySettings: {
          name: "Safety Settings",
          description:
            "Optional. A list of unique `SafetySetting` instances for blocking unsafe content.  This will be enforced on the `GenerateContentRequest.contents` and `GenerateContentResponse.candidates`. There should not be more than one setting for each `SafetyCategory` type. The API will block any contents and responses that fail to meet the thresholds set by these settings. This list overrides the default settings for each `SafetyCategory` specified in the safety_settings. If there is no `SafetySetting` for a given `SafetyCategory` provided in the list, the API will use the default safety setting for that category. Harm categories HARM_CATEGORY_HATE_SPEECH, HARM_CATEGORY_SEXUALLY_EXPLICIT, HARM_CATEGORY_DANGEROUS_CONTENT, HARM_CATEGORY_HARASSMENT, HARM_CATEGORY_CIVIC_INTEGRITY are supported. Refer to the [guide](https://ai.google.dev/gemini-api/docs/safety-settings) for detailed information on available safety settings. Also refer to the [Safety guidance](https://ai.google.dev/gemini-api/docs/safety-guidance) to learn how to incorporate safety considerations in your AI applications.",
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
              "Optional. A list of unique `SafetySetting` instances for blocking unsafe content.  This will be enforced on the `GenerateContentRequest.contents` and `GenerateContentResponse.candidates`. There should not be more than one setting for each `SafetyCategory` type. The API will block any contents and responses that fail to meet the thresholds set by these settings. This list overrides the default settings for each `SafetyCategory` specified in the safety_settings. If there is no `SafetySetting` for a given `SafetyCategory` provided in the list, the API will use the default safety setting for that category. Harm categories HARM_CATEGORY_HATE_SPEECH, HARM_CATEGORY_SEXUALLY_EXPLICIT, HARM_CATEGORY_DANGEROUS_CONTENT, HARM_CATEGORY_HARASSMENT, HARM_CATEGORY_CIVIC_INTEGRITY are supported. Refer to the [guide](https://ai.google.dev/gemini-api/docs/safety-settings) for detailed information on available safety settings. Also refer to the [Safety guidance](https://ai.google.dev/gemini-api/docs/safety-guidance) to learn how to incorporate safety considerations in your AI applications.",
          },
          required: false,
        },
        generationConfig: {
          name: "Generation Config",
          description:
            "Optional. Configuration options for model generation and outputs.",
          type: {
            type: "object",
            properties: {
              candidateCount: {
                type: "integer",
                description:
                  "Optional. Number of generated responses to return. If unset, this will default to 1. Please note that this doesn't work for previous generation models (Gemini 1.0 family)",
              },
              stopSequences: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Optional. The set of character sequences (up to 5) that will stop output generation. If specified, the API will stop at the first appearance of a `stop_sequence`. The stop sequence will not be included as part of the response.",
              },
              maxOutputTokens: {
                type: "integer",
                description:
                  "Optional. The maximum number of tokens to include in a response candidate.  Note: The default value varies by model, see the `Model.output_token_limit` attribute of the `Model` returned from the `getModel` function.",
              },
              temperature: {
                type: "number",
                description:
                  "Optional. Controls the randomness of the output.  Note: The default value varies by model, see the `Model.temperature` attribute of the `Model` returned from the `getModel` function.  Values can range from [0.0, 2.0].",
              },
              topP: {
                type: "number",
                description:
                  "Optional. The maximum cumulative probability of tokens to consider when sampling.  The model uses combined Top-k and Top-p (nucleus) sampling.  Tokens are sorted based on their assigned probabilities so that only the most likely tokens are considered. Top-k sampling directly limits the maximum number of tokens to consider, while Nucleus sampling limits the number of tokens based on the cumulative probability.  Note: The default value varies by `Model` and is specified by the`Model.top_p` attribute returned from the `getModel` function. An empty `top_k` attribute indicates that the model doesn't apply top-k sampling and doesn't allow setting `top_k` on requests.",
              },
              topK: {
                type: "integer",
                description:
                  "Optional. The maximum number of tokens to consider when sampling.  Gemini models use Top-p (nucleus) sampling or a combination of Top-k and nucleus sampling. Top-k sampling considers the set of `top_k` most probable tokens. Models running with nucleus sampling don't allow top_k setting.  Note: The default value varies by `Model` and is specified by the`Model.top_p` attribute returned from the `getModel` function. An empty `top_k` attribute indicates that the model doesn't apply top-k sampling and doesn't allow setting `top_k` on requests.",
              },
              seed: {
                type: "integer",
                description:
                  "Optional. Seed used in decoding. If not set, the request uses a randomly generated seed.",
              },
              responseMimeType: {
                type: "string",
                description:
                  "Optional. MIME type of the generated candidate text. Supported MIME types are: `text/plain`: (default) Text output. `application/json`: JSON response in the response candidates. `text/x.enum`: ENUM as a string response in the response candidates. Refer to the [docs](https://ai.google.dev/gemini-api/docs/prompting_with_media#plain_text_formats) for a list of all supported text MIME types.",
              },
              responseSchema: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "TYPE_UNSPECIFIED",
                      "STRING",
                      "NUMBER",
                      "INTEGER",
                      "BOOLEAN",
                      "ARRAY",
                      "OBJECT",
                      "NULL",
                    ],
                  },
                  format: {
                    type: "string",
                  },
                  title: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                  nullable: {
                    type: "boolean",
                  },
                  enum: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  items: {
                    type: "object",
                    additionalProperties: true,
                  },
                  maxItems: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  minItems: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  properties: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                  },
                  required: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  minProperties: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  maxProperties: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  minimum: {
                    type: "number",
                  },
                  maximum: {
                    type: "number",
                  },
                  minLength: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  maxLength: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  pattern: {
                    type: "string",
                  },
                  example: {
                    description: "Any JSON value",
                  },
                  anyOf: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                    },
                  },
                  propertyOrdering: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  default: {
                    description: "Any JSON value",
                  },
                },
                additionalProperties: true,
                description:
                  "Optional. Output schema of the generated candidate text. Schemas must be a subset of the [OpenAPI schema](https://spec.openapis.org/oas/v3.0.3#schema) and can be objects, primitives or arrays.  If set, a compatible `response_mime_type` must also be set. Compatible MIME types: `application/json`: Schema for JSON response. Refer to the [JSON text generation guide](https://ai.google.dev/gemini-api/docs/json-mode) for more details.",
              },
              responseJsonSchema: {
                description: "Any JSON value",
              },
              responseJsonSchemaOrdered: {
                description: "Any JSON value",
              },
              presencePenalty: {
                type: "number",
                description:
                  "Optional. Presence penalty applied to the next token's logprobs if the token has already been seen in the response.  This penalty is binary on/off and not dependant on the number of times the token is used (after the first). Use [frequency_penalty][google.ai.generativelanguage.v1beta.GenerationConfig.frequency_penalty] for a penalty that increases with each use.  A positive penalty will discourage the use of tokens that have already been used in the response, increasing the vocabulary.  A negative penalty will encourage the use of tokens that have already been used in the response, decreasing the vocabulary.",
              },
              frequencyPenalty: {
                type: "number",
                description:
                  "Optional. Frequency penalty applied to the next token's logprobs, multiplied by the number of times each token has been seen in the respponse so far.  A positive penalty will discourage the use of tokens that have already been used, proportional to the number of times the token has been used: The more a token is used, the more difficult it is for the model to use that token again increasing the vocabulary of responses.  Caution: A _negative_ penalty will encourage the model to reuse tokens proportional to the number of times the token has been used. Small negative values will reduce the vocabulary of a response. Larger negative values will cause the model to start repeating a common token  until it hits the [max_output_tokens][google.ai.generativelanguage.v1beta.GenerationConfig.max_output_tokens] limit.",
              },
              responseLogprobs: {
                type: "boolean",
                description:
                  "Optional. If true, export the logprobs results in response.",
              },
              logprobs: {
                type: "integer",
                description:
                  "Optional. Only valid if [response_logprobs=True][google.ai.generativelanguage.v1beta.GenerationConfig.response_logprobs]. This sets the number of top logprobs to return at each decoding step in the [Candidate.logprobs_result][google.ai.generativelanguage.v1beta.Candidate.logprobs_result]. The number must be in the range of [0, 20].",
              },
              enableEnhancedCivicAnswers: {
                type: "boolean",
                description:
                  "Optional. Enables enhanced civic answers. It may not be available for all models.",
              },
              responseModalities: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["MODALITY_UNSPECIFIED", "TEXT", "IMAGE", "AUDIO"],
                },
                description:
                  "Optional. The requested modalities of the response. Represents the set of modalities that the model can return, and should be expected in the response. This is an exact match to the modalities of the response.  A model may have multiple combinations of supported modalities. If the requested modalities do not match any of the supported combinations, an error will be returned.  An empty list is equivalent to requesting only text.",
              },
              speechConfig: {
                type: "object",
                properties: {
                  voiceConfig: {
                    type: "object",
                    properties: {
                      prebuiltVoiceConfig: {
                        type: "object",
                        properties: {
                          voiceName: {
                            type: "string",
                            description: "The name of the preset voice to use.",
                          },
                        },
                        description:
                          "The configuration for the prebuilt speaker to use.",
                        additionalProperties: true,
                      },
                    },
                    description: "The configuration for the voice to use.",
                    additionalProperties: true,
                  },
                  multiSpeakerVoiceConfig: {
                    type: "object",
                    properties: {
                      speakerVoiceConfigs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            speaker: {
                              type: "string",
                              description:
                                "Required. The name of the speaker to use. Should be the same as in the prompt.",
                            },
                            voiceConfig: {
                              type: "object",
                              properties: {
                                prebuiltVoiceConfig: {
                                  type: "object",
                                  properties: {
                                    voiceName: {
                                      type: "string",
                                      description:
                                        "The name of the preset voice to use.",
                                    },
                                  },
                                  description:
                                    "The configuration for the prebuilt speaker to use.",
                                  additionalProperties: true,
                                },
                              },
                              description:
                                "The configuration for the voice to use.",
                              additionalProperties: true,
                            },
                          },
                          required: ["speaker", "voiceConfig"],
                          description:
                            "The configuration for a single speaker in a multi speaker setup.",
                          additionalProperties: true,
                        },
                        description:
                          "Required. All the enabled speaker voices.",
                      },
                    },
                    required: ["speakerVoiceConfigs"],
                    description:
                      "The configuration for the multi-speaker setup.",
                    additionalProperties: true,
                  },
                  languageCode: {
                    type: "string",
                    description:
                      'Optional. Language code (in BCP 47 format, e.g. "en-US") for speech synthesis.  Valid values are: de-DE, en-AU, en-GB, en-IN, en-US, es-US, fr-FR, hi-IN, pt-BR, ar-XA, es-ES, fr-CA, id-ID, it-IT, ja-JP, tr-TR, vi-VN, bn-IN, gu-IN, kn-IN, ml-IN, mr-IN, ta-IN, te-IN, nl-NL, ko-KR, cmn-CN, pl-PL, ru-RU, and th-TH.',
                  },
                },
                description: "The speech generation config.",
                additionalProperties: true,
              },
              thinkingConfig: {
                type: "object",
                properties: {
                  includeThoughts: {
                    type: "boolean",
                    description:
                      "Indicates whether to include thoughts in the response. If true, thoughts are returned only when available.",
                  },
                  thinkingBudget: {
                    type: "integer",
                    description:
                      "The number of thoughts tokens that the model should generate.",
                  },
                },
                description: "Config for thinking features.",
                additionalProperties: true,
              },
              imageConfig: {
                type: "object",
                properties: {
                  aspectRatio: {
                    type: "string",
                    description:
                      "Optional. The aspect ratio of the image to generate. Supported aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9.  If not specified, the model will choose a default aspect ratio based on any reference images provided.",
                  },
                },
                description: "Config for image generation features.",
                additionalProperties: true,
              },
              mediaResolution: {
                type: "string",
                enum: [
                  "MEDIA_RESOLUTION_UNSPECIFIED",
                  "MEDIA_RESOLUTION_LOW",
                  "MEDIA_RESOLUTION_MEDIUM",
                  "MEDIA_RESOLUTION_HIGH",
                ],
                description:
                  "Optional. If specified, the media resolution specified will be used.",
              },
            },
            description:
              "Configuration options for model generation and outputs. Not all parameters are configurable for every model.",
            additionalProperties: true,
          },
          required: false,
        },
        cachedContent: {
          name: "Cached Content",
          description:
            "Optional. The name of the content [cached](https://ai.google.dev/gemini-api/docs/caching) to use as context to serve the prediction. Format: `cachedContents/{cachedContent}`",
          type: {
            type: "string",
            description:
              "Optional. The name of the content [cached](https://ai.google.dev/gemini-api/docs/caching) to use as context to serve the prediction. Format: `cachedContents/{cachedContent}`",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getGenerativeServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.generateContent(request, (err: any, response: any) => {
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
          candidates: {
            type: "array",
            items: {
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
                                  description:
                                    "The candidate’s token id value.",
                                },
                                logProbability: {
                                  type: "number",
                                  description:
                                    "The candidate's log probability.",
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
                  description:
                    "Metadata related to url context retrieval tool.",
                  additionalProperties: true,
                },
              },
              description: "A response candidate generated from the model.",
              additionalProperties: true,
            },
            description: "Candidate responses from the model.",
          },
          promptFeedback: {
            type: "object",
            properties: {
              blockReason: {
                type: "string",
                enum: [
                  "BLOCK_REASON_UNSPECIFIED",
                  "SAFETY",
                  "OTHER",
                  "BLOCKLIST",
                  "PROHIBITED_CONTENT",
                  "IMAGE_SAFETY",
                ],
                description:
                  "Optional. If set, the prompt was blocked and no candidates are returned. Rephrase the prompt.",
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
                  "Ratings for safety of the prompt. There is at most one rating per category.",
              },
            },
            description:
              "A set of the feedback metadata the prompt specified in `GenerateContentRequest.content`.",
            additionalProperties: true,
          },
          usageMetadata: {
            type: "object",
            properties: {
              promptTokenCount: {
                type: "integer",
                description:
                  "Number of tokens in the prompt. When `cached_content` is set, this is still the total effective prompt size meaning this includes the number of tokens in the cached content.",
              },
              cachedContentTokenCount: {
                type: "integer",
                description:
                  "Number of tokens in the cached part of the prompt (the cached content)",
              },
              candidatesTokenCount: {
                type: "integer",
                description:
                  "Total number of tokens across all the generated response candidates.",
              },
              toolUsePromptTokenCount: {
                type: "integer",
                description:
                  "Output only. Number of tokens present in tool-use prompt(s).",
              },
              thoughtsTokenCount: {
                type: "integer",
                description:
                  "Output only. Number of tokens of thoughts for thinking models.",
              },
              totalTokenCount: {
                type: "integer",
                description:
                  "Total token count for the generation request (prompt + response candidates).",
              },
              promptTokensDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    modality: {
                      type: "string",
                      enum: [
                        "MODALITY_UNSPECIFIED",
                        "TEXT",
                        "IMAGE",
                        "VIDEO",
                        "AUDIO",
                        "DOCUMENT",
                      ],
                    },
                    tokenCount: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Output only. List of modalities that were processed in the request input.",
              },
              cacheTokensDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    modality: {
                      type: "string",
                      enum: [
                        "MODALITY_UNSPECIFIED",
                        "TEXT",
                        "IMAGE",
                        "VIDEO",
                        "AUDIO",
                        "DOCUMENT",
                      ],
                    },
                    tokenCount: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Output only. List of modalities of the cached content in the request input.",
              },
              candidatesTokensDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    modality: {
                      type: "string",
                      enum: [
                        "MODALITY_UNSPECIFIED",
                        "TEXT",
                        "IMAGE",
                        "VIDEO",
                        "AUDIO",
                        "DOCUMENT",
                      ],
                    },
                    tokenCount: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Output only. List of modalities that were returned in the response.",
              },
              toolUsePromptTokensDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    modality: {
                      type: "string",
                      enum: [
                        "MODALITY_UNSPECIFIED",
                        "TEXT",
                        "IMAGE",
                        "VIDEO",
                        "AUDIO",
                        "DOCUMENT",
                      ],
                    },
                    tokenCount: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Output only. List of modalities that were processed for tool-use request inputs.",
              },
            },
            description: "Metadata on the generation request's token usage.",
            additionalProperties: true,
          },
          modelVersion: {
            type: "string",
            description:
              "Output only. The model version used to generate the response.",
          },
          responseId: {
            type: "string",
            description:
              "Output only. response_id is used to identify each response.",
          },
        },
        description:
          "Response from the model supporting multiple candidate responses.  Safety ratings and content filtering are reported for both prompt in `GenerateContentResponse.prompt_feedback` and for each candidate in `finish_reason` and in `safety_ratings`. The API:  - Returns either all requested candidates or none of them  - Returns no candidates at all only if there was something wrong with the    prompt (check `prompt_feedback`)  - Reports feedback on each candidate in `finish_reason` and    `safety_ratings`.",
        additionalProperties: true,
      },
    },
  },
};

export default generateContent;
