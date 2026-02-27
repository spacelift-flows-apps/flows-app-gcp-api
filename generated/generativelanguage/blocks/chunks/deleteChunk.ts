import { AppBlock, events } from "@slflows/sdk/v1";
import { getRetrieverServiceClient } from "../../lib/grpcClient.ts";

const deleteChunk: AppBlock = {
  name: "Delete Chunk",
  description: `Deletes a 'Chunk'.`,
  category: "Chunks",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the `Chunk` to delete. Example: `corpora/my-corpus-123/documents/the-doc-abc/chunks/some-chunk`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the `Chunk` to delete. Example: `corpora/my-corpus-123/documents/the-doc-abc/chunks/some-chunk`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteChunk(request, (err: any, response: any) => {
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

export default deleteChunk;
