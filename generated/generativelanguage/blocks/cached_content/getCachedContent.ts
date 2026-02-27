import { AppBlock, events } from "@slflows/sdk/v1";
import { getCacheServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  expire_time: "expireTime",
  display_name: "displayName",
  system_instruction: {
    name: "systemInstruction",
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
  contents: {
    name: "contents",
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
  tools: {
    name: "tools",
    fields: {
      function_declarations: {
        name: "functionDeclarations",
        fields: {
          parameters: {
            name: "parameters",
            fields: {
              max_items: "maxItems",
              min_items: "minItems",
              min_properties: "minProperties",
              max_properties: "maxProperties",
              min_length: "minLength",
              max_length: "maxLength",
              any_of: "anyOf",
              property_ordering: "propertyOrdering",
            },
          },
          parameters_json_schema: "parametersJsonSchema",
          response: {
            name: "response",
            fields: {
              max_items: "maxItems",
              min_items: "minItems",
              min_properties: "minProperties",
              max_properties: "maxProperties",
              min_length: "minLength",
              max_length: "maxLength",
              any_of: "anyOf",
              property_ordering: "propertyOrdering",
            },
          },
          response_json_schema: "responseJsonSchema",
        },
      },
      google_search_retrieval: {
        name: "googleSearchRetrieval",
        fields: {
          dynamic_retrieval_config: {
            name: "dynamicRetrievalConfig",
            fields: {
              dynamic_threshold: "dynamicThreshold",
            },
          },
        },
      },
      code_execution: "codeExecution",
      google_search: {
        name: "googleSearch",
        fields: {
          time_range_filter: {
            name: "timeRangeFilter",
            fields: {
              start_time: "startTime",
              end_time: "endTime",
            },
          },
        },
      },
      computer_use: {
        name: "computerUse",
        fields: {
          excluded_predefined_functions: "excludedPredefinedFunctions",
        },
      },
      url_context: "urlContext",
      file_search: {
        name: "fileSearch",
        fields: {
          retrieval_resources: {
            name: "retrievalResources",
            fields: {
              rag_store_name: "ragStoreName",
            },
          },
          retrieval_config: {
            name: "retrievalConfig",
            fields: {
              top_k: "topK",
              metadata_filter: "metadataFilter",
            },
          },
        },
      },
      google_maps: {
        name: "googleMaps",
        fields: {
          enable_widget: "enableWidget",
        },
      },
    },
  },
  tool_config: {
    name: "toolConfig",
    fields: {
      function_calling_config: {
        name: "functionCallingConfig",
        fields: {
          allowed_function_names: "allowedFunctionNames",
        },
      },
      retrieval_config: {
        name: "retrievalConfig",
        fields: {
          lat_lng: "latLng",
          language_code: "languageCode",
        },
      },
    },
  },
  create_time: "createTime",
  update_time: "updateTime",
  usage_metadata: {
    name: "usageMetadata",
    fields: {
      total_token_count: "totalTokenCount",
    },
  },
};

const getCachedContent: AppBlock = {
  name: "Get Cached Content",
  description: `Reads CachedContent resource.`,
  category: "Cached Content",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name referring to the content cache entry. Format: `cachedContents/{id}`",
          type: {
            type: "string",
            description:
              "Required. The resource name referring to the content cache entry. Format: `cachedContents/{id}`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getCacheServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getCachedContent(request, (err: any, response: any) => {
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
          expireTime: {
            type: "string",
            description:
              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z') (Part of 'expiration' - only one field in this group can be set)",
          },
          ttl: {
            type: "string",
            description:
              "Duration string (e.g., '1.5s', '300s') (Part of 'expiration' - only one field in this group can be set)",
          },
          name: {
            type: "string",
          },
          displayName: {
            type: "string",
          },
          model: {
            type: "string",
          },
          systemInstruction: {
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
          },
          contents: {
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
          },
          tools: {
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
          },
          toolConfig: {
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
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          usageMetadata: {
            type: "object",
            properties: {
              totalTokenCount: {
                type: "integer",
              },
            },
            description: "Usage metadata about response(s).",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCachedContent;
