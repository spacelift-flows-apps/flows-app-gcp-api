import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRepositoryManagerClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  expiration_time: "expirationTime",
};

const fetchReadToken: AppBlock = {
  name: "Fetch Read Token",
  description: `Fetches read token of a given repository.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        repository: {
          name: "Repository",
          description:
            "Required. The resource name of the repository in the format `projects/*/locations/*/connections/*/repositories/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the repository in the format `projects/*/locations/*/connections/*/repositories/*`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.fetchReadToken(request, (err: any, response: any) => {
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
          token: {
            type: "string",
            description: "The token content.",
          },
          expirationTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        description: "Message for responding to get read token.",
        additionalProperties: true,
      },
    },
  },
};

export default fetchReadToken;
