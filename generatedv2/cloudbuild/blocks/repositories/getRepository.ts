import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const getRepository: AppBlock = {
  name: "Get Repository",
  description: `Gets details of a single repository.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the Repository to retrieve. Format: `projects/*/locations/*/connections/*/repositories/*`.",
          type: {
            type: "string",
            description:
              "Required. The name of the Repository to retrieve. Format: `projects/*/locations/*/connections/*/repositories/*`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getRepository(request, (err: any, response: any) => {
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
          name: {
            type: "string",
            description:
              "Immutable. Resource name of the repository, in the format `projects/*/locations/*/connections/*/repositories/*`.",
          },
          remote_uri: {
            type: "string",
            description: "Required. Git Clone HTTPS URI.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          update_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          annotations: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Allows clients to store small amounts of arbitrary data.",
          },
          etag: {
            type: "string",
            description:
              "This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
          },
          webhook_id: {
            type: "string",
            description:
              "Output only. External ID of the webhook created for the repository.",
          },
        },
        required: ["remote_uri"],
        description: "A repository associated to a parent connection.",
        additionalProperties: true,
      },
    },
  },
};

export default getRepository;
