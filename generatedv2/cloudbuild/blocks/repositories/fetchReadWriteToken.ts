import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const fetchReadWriteToken: AppBlock = {
  name: "Fetch Read Write Token",
  description: `Fetches read/write token of a given repository.`,
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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.repository !== undefined)
          request.repository = input.event.inputConfig.repository;

        const result = await new Promise<any>((resolve, reject) => {
          client.fetchReadWriteToken(request, (err: any, response: any) => {
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
        properties: {
          token: {
            type: "string",
            description: "The token content.",
          },
          expiration_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        description: "Message for responding to get read/write token.",
        additionalProperties: true,
      },
    },
  },
};

export default fetchReadWriteToken;
