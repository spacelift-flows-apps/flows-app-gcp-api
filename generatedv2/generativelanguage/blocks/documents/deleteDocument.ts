import { AppBlock, events } from "@slflows/sdk/v1";
import { getRetrieverServiceClient } from "../../lib/grpcClient.ts";

const deleteDocument: AppBlock = {
  name: "Delete Document",
  description: `Deletes a 'Document'.`,
  category: "Documents",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the `Document` to delete. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the `Document` to delete. Example: `corpora/my-corpus-123/documents/the-doc-abc`",
          },
          required: true,
        },
        force: {
          name: "Force",
          description:
            "Optional. If set to true, any `Chunk`s and objects related to this `Document` will also be deleted.  If false (the default), a `FAILED_PRECONDITION` error will be returned if `Document` contains any `Chunk`s.",
          type: {
            type: "boolean",
            description:
              "Optional. If set to true, any `Chunk`s and objects related to this `Document` will also be deleted.  If false (the default), a `FAILED_PRECONDITION` error will be returned if `Document` contains any `Chunk`s.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteDocument(request, (err: any, response: any) => {
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

export default deleteDocument;
