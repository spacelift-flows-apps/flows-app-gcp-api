import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRepositoryManagerClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  repositories: {
    name: "repositories",
    fields: {
      remote_uri: "remoteUri",
      create_time: "createTime",
      update_time: "updateTime",
      webhook_id: "webhookId",
    },
  },
  next_page_token: "nextPageToken",
};

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
        pageSize: {
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
        pageToken: {
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

        const request = convertKeys(input.event.inputConfig, inputMapping);

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
                remoteUri: {
                  type: "string",
                  description: "Required. Git Clone HTTPS URI.",
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
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
                webhookId: {
                  type: "string",
                  description:
                    "Output only. External ID of the webhook created for the repository.",
                },
              },
              required: ["remoteUri"],
              description: "A repository associated to a parent connection.",
              additionalProperties: true,
            },
            description: "repositories ready to be created.",
          },
          nextPageToken: {
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
