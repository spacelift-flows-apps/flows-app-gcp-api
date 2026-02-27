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
  corpora: {
    name: "corpora",
    fields: {
      display_name: "displayName",
      create_time: "createTime",
      update_time: "updateTime",
    },
  },
  next_page_token: "nextPageToken",
};

const listCorpora: AppBlock = {
  name: "List Corpora",
  description: `Lists all 'Corpora' owned by the user.`,
  category: "Corpora",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of `Corpora` to return (per page). The service may return fewer `Corpora`.  If unspecified, at most 10 `Corpora` will be returned. The maximum size limit is 20 `Corpora` per page.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of `Corpora` to return (per page). The service may return fewer `Corpora`.  If unspecified, at most 10 `Corpora` will be returned. The maximum size limit is 20 `Corpora` per page.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A page token, received from a previous `ListCorpora` call.  Provide the `next_page_token` returned in the response as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListCorpora` must match the call that provided the page token.",
          type: {
            type: "string",
            description:
              "Optional. A page token, received from a previous `ListCorpora` call.  Provide the `next_page_token` returned in the response as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListCorpora` must match the call that provided the page token.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listCorpora(request, (err: any, response: any) => {
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
          corpora: {
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
              },
              additionalProperties: true,
            },
            description: "The returned corpora.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no more pages.",
          },
        },
        description:
          "Response from `ListCorpora` containing a paginated list of `Corpora`. The results are sorted by ascending `corpus.create_time`.",
        additionalProperties: true,
      },
    },
  },
};

export default listCorpora;
