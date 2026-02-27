import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRepositoryManagerClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  requests: {
    name: "requests",
    fields: {
      repository: {
        name: "repository",
        fields: {
          remoteUri: "remote_uri",
        },
      },
      repositoryId: "repository_id",
    },
  },
};

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

const batchCreateRepositories: AppBlock = {
  name: "Batch Create Repositories",
  description: `Creates multiple repositories inside a connection.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The connection to contain all the repositories being created. Format: projects/*/locations/*/connections/* The parent field in the CreateRepositoryRequest messages must either be empty or match this field.",
          type: {
            type: "string",
            description:
              "Required. The connection to contain all the repositories being created. Format: projects/*/locations/*/connections/* The parent field in the CreateRepositoryRequest messages must either be empty or match this field.",
          },
          required: true,
        },
        requests: {
          name: "Requests",
          description:
            "Required. The request messages specifying the repositories to create.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                parent: {
                  type: "string",
                  description:
                    "Required. The connection to contain the repository. If the request is part of a BatchCreateRepositoriesRequest, this field should be empty or match the parent specified there.",
                },
                repository: {
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
                  required: ["remoteUri"],
                  description:
                    "A repository associated to a parent connection.",
                  additionalProperties: true,
                },
                repositoryId: {
                  type: "string",
                  description:
                    "Required. The ID to use for the repository, which will become the final component of the repository's resource name. This ID should be unique in the connection. Allows alphanumeric characters and any of -._~%!$&'()*+,;=@.",
                },
              },
              required: ["parent", "repository", "repositoryId"],
              description: "Message for creating a Repository.",
              additionalProperties: true,
            },
            description:
              "Required. The request messages specifying the repositories to create.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.batchCreateRepositories(request, (err: any, response: any) => {
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
          metadata: {
            type: "object",
            properties: {
              typeUrl: {
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
                    typeUrl: {
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
              typeUrl: {
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

export default batchCreateRepositories;
