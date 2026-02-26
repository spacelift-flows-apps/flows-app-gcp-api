import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const fetchLinkableRepositories: AppBlock = {
  name: "Fetch Linkable Repositories",
  description: `FetchLinkableRepositories get repositories from SCM that are accessible and could be added to the connection.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        connection: {
          name: "Connection",
          description:
            "Required. The name of the Connection. Format: `projects/*/locations/*/connections/*`.",
          type: {
            type: "string",
            description:
              "Required. The name of the Connection. Format: `projects/*/locations/*/connections/*`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Number of results to return in the list. Default to 20.",
          type: {
            type: "integer",
            description:
              "Number of results to return in the list. Default to 20.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description: "Page start.",
          type: {
            type: "string",
            description: "Page start.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.connection !== undefined)
          request.connection = input.event.inputConfig.connection;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.fetchLinkableRepositories(
            request,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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
          repositories: {
            type: "array",
            items: {
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                update_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            description: "repositories ready to be created.",
          },
          next_page_token: {
            type: "string",
            description:
              "A token identifying a page of results the server should return.",
          },
        },
        description: "Response message for FetchLinkableRepositories.",
        additionalProperties: true,
      },
    },
  },
};

export default fetchLinkableRepositories;
