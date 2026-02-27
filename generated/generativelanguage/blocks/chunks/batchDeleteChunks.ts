import { AppBlock, events } from "@slflows/sdk/v1";
import { getRetrieverServiceClient } from "../../lib/grpcClient.ts";

const batchDeleteChunks: AppBlock = {
  name: "Batch Delete Chunks",
  description: `Batch delete 'Chunk's.`,
  category: "Chunks",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Optional. The name of the `Document` containing the `Chunk`s to delete. The parent field in every `DeleteChunkRequest` must match this value. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          type: {
            type: "string",
            description:
              "Optional. The name of the `Document` containing the `Chunk`s to delete. The parent field in every `DeleteChunkRequest` must match this value. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          },
          required: false,
        },
        requests: {
          name: "Requests",
          description:
            "Required. The request messages specifying the `Chunk`s to delete.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Required. The resource name of the `Chunk` to delete. Example: `corpora/my-corpus-123/documents/the-doc-abc/chunks/some-chunk`",
                },
              },
              required: ["name"],
              description: "Request to delete a `Chunk`.",
              additionalProperties: true,
            },
            description:
              "Required. The request messages specifying the `Chunk`s to delete.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.batchDeleteChunks(request, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default batchDeleteChunks;
