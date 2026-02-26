import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const listRepositories: AppBlock = {
  name: "List Repositories",
  description: `Lists Repositories in a given connection.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The parent, which owns this collection of Repositories. Format: `projects/*/locations/*/connections/*`.",
          type: {
            type: "string",
            description:
              "Required. The parent, which owns this collection of Repositories. Format: `projects/*/locations/*/connections/*`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description: "Number of results to return in the list.",
          type: {
            type: "integer",
            description: "Number of results to return in the list.",
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
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Expressions must follow API improvement proposal [AIP-160](https://google.aip.dev/160). e.g. `remote_uri:"https://github.com*"`.',
          type: {
            type: "string",
            description:
              'A filter expression that filters resources listed in the response. Expressions must follow API improvement proposal [AIP-160](https://google.aip.dev/160). e.g. `remote_uri:"https://github.com*"`.',
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;

        const result = await new Promise<any>((resolve, reject) => {
          client.listRepositories(request, (err: any, response: any) => {
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
            description: "The list of Repositories.",
          },
          next_page_token: {
            type: "string",
            description:
              "A token identifying a page of results the server should return.",
          },
        },
        description: "Message for response to listing Repositories.",
        additionalProperties: true,
      },
    },
  },
};

export default listRepositories;
