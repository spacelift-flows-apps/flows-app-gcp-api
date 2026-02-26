import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const createRepository: AppBlock = {
  name: "Create Repository",
  description: `Creates a Repository.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The connection to contain the repository. If the request is part of a BatchCreateRepositoriesRequest, this field should be empty or match the parent specified there.",
          type: {
            type: "string",
            description:
              "Required. The connection to contain the repository. If the request is part of a BatchCreateRepositoriesRequest, this field should be empty or match the parent specified there.",
          },
          required: true,
        },
        repository: {
          name: "Repository",
          description: "Required. The repository to create.",
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
            },
            required: ["remote_uri"],
            description: "A repository associated to a parent connection.",
            additionalProperties: true,
          },
          required: true,
        },
        repository_id: {
          name: "Repository Id",
          description:
            "Required. The ID to use for the repository, which will become the final component of the repository's resource name. This ID should be unique in the connection. Allows alphanumeric characters and any of -._~%!$&'()*+,;=@.",
          type: {
            type: "string",
            description:
              "Required. The ID to use for the repository, which will become the final component of the repository's resource name. This ID should be unique in the connection. Allows alphanumeric characters and any of -._~%!$&'()*+,;=@.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.repository !== undefined)
          request.repository = input.event.inputConfig.repository;
        if (input.event.inputConfig.repository_id !== undefined)
          request.repository_id = input.event.inputConfig.repository_id;

        const result = await new Promise<any>((resolve, reject) => {
          client.createRepository(request, (err: any, response: any) => {
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
          },
          metadata: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
          },
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type_url: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRepository;
