import { AppBlock, events } from "@slflows/sdk/v1";
import { getExecutionsClient } from "../../lib/grpcClient.ts";

const cancelExecution: AppBlock = {
  name: "Cancel Execution",
  description: `Cancels an Execution.`,
  category: "Executions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the Execution to cancel. Format: `projects/{project}/locations/{location}/jobs/{job}/executions/{execution}`, where `{project}` can be project id or number.",
          type: {
            type: "string",
            description:
              "Required. The name of the Execution to cancel. Format: `projects/{project}/locations/{location}/jobs/{job}/executions/{execution}`, where `{project}` can be project id or number.",
          },
          required: true,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "Indicates that the request should be validated without actually cancelling any resources.",
          type: {
            type: "boolean",
            description:
              "Indicates that the request should be validated without actually cancelling any resources.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description:
            "A system-generated fingerprint for this version of the resource. This may be used to detect modification conflict during updates.",
          type: {
            type: "string",
            description:
              "A system-generated fingerprint for this version of the resource. This may be used to detect modification conflict during updates.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getExecutionsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;

        const result = await new Promise<any>((resolve, reject) => {
          client.cancelExecution(request, (err: any, response: any) => {
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

export default cancelExecution;
