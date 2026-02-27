import { AppBlock, events } from "@slflows/sdk/v1";
import { getRetrieverServiceClient } from "../../lib/grpcClient.ts";

const deleteCorpus: AppBlock = {
  name: "Delete Corpus",
  description: `Deletes a 'Corpus'.`,
  category: "Corpora",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the `Corpus`. Example: `corpora/my-corpus-123`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the `Corpus`. Example: `corpora/my-corpus-123`",
          },
          required: true,
        },
        force: {
          name: "Force",
          description:
            "Optional. If set to true, any `Document`s and objects related to this `Corpus` will also be deleted.  If false (the default), a `FAILED_PRECONDITION` error will be returned if `Corpus` contains any `Document`s.",
          type: {
            type: "boolean",
            description:
              "Optional. If set to true, any `Document`s and objects related to this `Corpus` will also be deleted.  If false (the default), a `FAILED_PRECONDITION` error will be returned if `Corpus` contains any `Document`s.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteCorpus(request, (err: any, response: any) => {
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

export default deleteCorpus;
