import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRetrieverServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  corpus: {
    name: "corpus",
    fields: {
      displayName: "display_name",
      createTime: "create_time",
      updateTime: "update_time",
    },
  },
};

const outputMapping = {
  display_name: "displayName",
  create_time: "createTime",
  update_time: "updateTime",
};

const createCorpus: AppBlock = {
  name: "Create Corpus",
  description: `Creates an empty 'Corpus'.`,
  category: "Corpora",
  inputs: {
    default: {
      config: {
        corpus: {
          name: "Corpus",
          description: "Required. The `Corpus` to create.",
          type: {
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
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              updateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
            },
            additionalProperties: true,
            description: "Required. The `Corpus` to create.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRetrieverServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createCorpus(request, (err: any, response: any) => {
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
          name: {
            type: "string",
          },
          displayName: {
            type: "string",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createCorpus;
