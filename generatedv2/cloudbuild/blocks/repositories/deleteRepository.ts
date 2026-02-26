import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const deleteRepository: AppBlock = {
  name: "Delete Repository",
  description: `Deletes a single repository.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the Repository to delete. Format: `projects/*/locations/*/connections/*/repositories/*`.",
          type: {
            type: "string",
            description:
              "Required. The name of the Repository to delete. Format: `projects/*/locations/*/connections/*/repositories/*`.",
          },
          required: true,
        },
        etag: {
          name: "Etag",
          description:
            "The current etag of the repository. If an etag is provided and does not match the current etag of the repository, deletion will be blocked and an ABORTED error will be returned.",
          type: {
            type: "string",
            description:
              "The current etag of the repository. If an etag is provided and does not match the current etag of the repository, deletion will be blocked and an ABORTED error will be returned.",
          },
          required: false,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "If set, validate the request, but do not actually post it.",
          type: {
            type: "boolean",
            description:
              "If set, validate the request, but do not actually post it.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteRepository(request, (err: any, response: any) => {
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

export default deleteRepository;
