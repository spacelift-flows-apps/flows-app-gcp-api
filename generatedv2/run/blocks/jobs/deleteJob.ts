import { AppBlock, events } from "@slflows/sdk/v1";
import { getJobsClient, createRoutingMetadata } from "../../lib/grpcClient.ts";

const deleteJob: AppBlock = {
  name: "Delete Job",
  description: `Deletes a Job.`,
  category: "Jobs",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The full name of the Job. Format: projects/{project}/locations/{location}/jobs/{job}, where {project} can be project id or number.",
          type: {
            type: "string",
            description:
              "Required. The full name of the Job. Format: projects/{project}/locations/{location}/jobs/{job}, where {project} can be project id or number.",
          },
          required: true,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "Indicates that the request should be validated without actually deleting any resources.",
          type: {
            type: "boolean",
            description:
              "Indicates that the request should be validated without actually deleting any resources.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description:
            "A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
          type: {
            type: "string",
            description:
              "A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getJobsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteJob(request, metadata, (err: any, response: any) => {
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

export default deleteJob;
