import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRetrieverServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  documents: {
    name: "documents",
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
  next_page_token: "nextPageToken",
};

const listDocuments: AppBlock = {
  name: "List Documents",
  description: `Lists all 'Document's in a 'Corpus'.`,
  category: "Documents",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the `Corpus` containing `Document`s. Example: `corpora/my-corpus-123`",
          type: {
            type: "string",
            description:
              "Required. The name of the `Corpus` containing `Document`s. Example: `corpora/my-corpus-123`",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of `Document`s to return (per page). The service may return fewer `Document`s.  If unspecified, at most 10 `Document`s will be returned. The maximum size limit is 20 `Document`s per page.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of `Document`s to return (per page). The service may return fewer `Document`s.  If unspecified, at most 10 `Document`s will be returned. The maximum size limit is 20 `Document`s per page.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A page token, received from a previous `ListDocuments` call.  Provide the `next_page_token` returned in the response as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListDocuments` must match the call that provided the page token.",
          type: {
            type: "string",
            description:
              "Optional. A page token, received from a previous `ListDocuments` call.  Provide the `next_page_token` returned in the response as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListDocuments` must match the call that provided the page token.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listDocuments(request, (err: any, response: any) => {
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
          documents: {
            type: "array",
            items: {
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
            },
            description: "The returned `Document`s.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no more pages.",
          },
        },
        description:
          "Response from `ListDocuments` containing a paginated list of `Document`s. The `Document`s are sorted by ascending `document.create_time`.",
        additionalProperties: true,
      },
    },
  },
};

export default listDocuments;
