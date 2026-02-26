import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const deleteWorkerPool: AppBlock = {
  name: "Delete Worker Pool",
  description: `Deletes a 'WorkerPool'.`,
  category: "Worker Pools",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the `WorkerPool` to delete. Format: `projects/{project}/locations/{location}/workerPools/{workerPool}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the `WorkerPool` to delete. Format: `projects/{project}/locations/{location}/workerPools/{workerPool}`.",
          },
          required: true,
        },
        etag: {
          name: "Etag",
          description:
            "Optional. If provided, it must match the server's etag on the workerpool for the request to be processed.",
          type: {
            type: "string",
            description:
              "Optional. If provided, it must match the server's etag on the workerpool for the request to be processed.",
          },
          required: false,
        },
        allow_missing: {
          name: "Allow Missing",
          description:
            "If set to true, and the `WorkerPool` is not found, the request will succeed but no action will be taken on the server.",
          type: {
            type: "boolean",
            description:
              "If set to true, and the `WorkerPool` is not found, the request will succeed but no action will be taken on the server.",
          },
          required: false,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "If set, validate the request and preview the response, but do not actually post it.",
          type: {
            type: "boolean",
            description:
              "If set, validate the request and preview the response, but do not actually post it.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getCloudBuildClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.allow_missing !== undefined)
          request.allow_missing = input.event.inputConfig.allow_missing;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteWorkerPool(
            request,
            metadata,
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

export default deleteWorkerPool;
