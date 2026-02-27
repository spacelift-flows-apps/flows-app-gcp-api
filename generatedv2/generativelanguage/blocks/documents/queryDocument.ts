import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRetrieverServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  resultsCount: "results_count",
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
};

const outputMapping = {
  relevant_chunks: {
    name: "relevantChunks",
    fields: {
      chunk_relevance_score: "chunkRelevanceScore",
      chunk: {
        name: "chunk",
        fields: {
          data: {
            name: "data",
            fields: {
              string_value: "stringValue",
            },
          },
          custom_metadata: {
            name: "customMetadata",
            fields: {
              string_value: "stringValue",
              string_list_value: "stringListValue",
              numeric_value: "numericValue",
            },
          },
          create_time: "createTime",
          update_time: "updateTime",
        },
      },
      document: {
        name: "document",
        fields: {
          display_name: "displayName",
          custom_metadata: {
            name: "customMetadata",
            fields: {
              string_value: "stringValue",
              string_list_value: "stringListValue",
              numeric_value: "numericValue",
            },
          },
          update_time: "updateTime",
          create_time: "createTime",
        },
      },
    },
  },
};

const queryDocument: AppBlock = {
  name: "Query Document",
  description: `Performs semantic search over a 'Document'.`,
  category: "Documents",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the `Document` to query. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          type: {
            type: "string",
            description:
              "Required. The name of the `Document` to query. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          },
          required: true,
        },
        query: {
          name: "Query",
          description: "Required. Query string to perform semantic search.",
          type: {
            type: "string",
            description: "Required. Query string to perform semantic search.",
          },
          required: true,
        },
        resultsCount: {
          name: "Results Count",
          description:
            "Optional. The maximum number of `Chunk`s to return. The service may return fewer `Chunk`s.  If unspecified, at most 10 `Chunk`s will be returned. The maximum specified result count is 100.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of `Chunk`s to return. The service may return fewer `Chunk`s.  If unspecified, at most 10 `Chunk`s will be returned. The maximum specified result count is 100.",
          },
          required: false,
        },
        metadataFilters: {
          name: "Metadata Filters",
          description:
            'Optional. Filter for `Chunk` metadata. Each `MetadataFilter` object should correspond to a unique key. Multiple `MetadataFilter` objects are joined by logical "AND"s.  Note: `Document`-level filtering is not supported for this request because a `Document` name is already specified.  Example query: (year >= 2020 OR year < 2010) AND (genre = drama OR genre = action)  `MetadataFilter` object list:  metadata_filters = [  {key = "chunk.custom_metadata.year"   conditions = [{int_value = 2020, operation = GREATER_EQUAL},                 {int_value = 2010, operation = LESS}},  {key = "chunk.custom_metadata.genre"   conditions = [{string_value = "drama", operation = EQUAL},                 {string_value = "action", operation = EQUAL}}]  Example query for a numeric range of values: (year > 2015 AND year <= 2020)  `MetadataFilter` object list:  metadata_filters = [  {key = "chunk.custom_metadata.year"   conditions = [{int_value = 2015, operation = GREATER}]},  {key = "chunk.custom_metadata.year"   conditions = [{int_value = 2020, operation = LESS_EQUAL}]}]  Note: "AND"s for the same key are only supported for numeric values. String values only support "OR"s for the same key.',
          type: {
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
              'Optional. Filter for `Chunk` metadata. Each `MetadataFilter` object should correspond to a unique key. Multiple `MetadataFilter` objects are joined by logical "AND"s.  Note: `Document`-level filtering is not supported for this request because a `Document` name is already specified.  Example query: (year >= 2020 OR year < 2010) AND (genre = drama OR genre = action)  `MetadataFilter` object list:  metadata_filters = [  {key = "chunk.custom_metadata.year"   conditions = [{int_value = 2020, operation = GREATER_EQUAL},                 {int_value = 2010, operation = LESS}},  {key = "chunk.custom_metadata.genre"   conditions = [{string_value = "drama", operation = EQUAL},                 {string_value = "action", operation = EQUAL}}]  Example query for a numeric range of values: (year > 2015 AND year <= 2020)  `MetadataFilter` object list:  metadata_filters = [  {key = "chunk.custom_metadata.year"   conditions = [{int_value = 2015, operation = GREATER}]},  {key = "chunk.custom_metadata.year"   conditions = [{int_value = 2020, operation = LESS_EQUAL}]}]  Note: "AND"s for the same key are only supported for numeric values. String values only support "OR"s for the same key.',
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.queryDocument(request, (err: any, response: any) => {
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
          relevantChunks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                chunkRelevanceScore: {
                  type: "number",
                  description: "`Chunk` relevance to the query.",
                },
                chunk: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    data: {
                      type: "object",
                      properties: {
                        stringValue: {
                          type: "string",
                        },
                      },
                      additionalProperties: true,
                    },
                    customMetadata: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          stringValue: {
                            type: "string",
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          stringListValue: {
                            type: "object",
                            properties: {
                              values: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                              },
                            },
                            additionalProperties: true,
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          numericValue: {
                            type: "number",
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          key: {
                            type: "string",
                          },
                        },
                        additionalProperties: true,
                      },
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
                    state: {
                      type: "string",
                      enum: [
                        "STATE_UNSPECIFIED",
                        "STATE_PENDING_PROCESSING",
                        "STATE_ACTIVE",
                        "STATE_FAILED",
                      ],
                    },
                  },
                  additionalProperties: true,
                  description: "`Chunk` associated with the query.",
                },
                document: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    displayName: {
                      type: "string",
                    },
                    customMetadata: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          stringValue: {
                            type: "string",
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          stringListValue: {
                            type: "object",
                            properties: {
                              values: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                              },
                            },
                            additionalProperties: true,
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          numericValue: {
                            type: "number",
                            description:
                              "(Part of 'value' - only one field in this group can be set)",
                          },
                          key: {
                            type: "string",
                          },
                        },
                        additionalProperties: true,
                      },
                    },
                    updateTime: {
                      type: "string",
                      description:
                        "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                    },
                    createTime: {
                      type: "string",
                      description:
                        "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                    },
                  },
                  additionalProperties: true,
                  description: "`Document` associated with the chunk.",
                },
              },
              description: "The information for a chunk relevant to a query.",
              additionalProperties: true,
            },
            description: "The returned relevant chunks.",
          },
        },
        description:
          "Response from `QueryDocument` containing a list of relevant chunks.",
        additionalProperties: true,
      },
    },
  },
};

export default queryDocument;
