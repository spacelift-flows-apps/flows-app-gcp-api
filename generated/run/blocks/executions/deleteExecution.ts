import { AppBlock, events } from "@slflows/sdk/v1";
import { getExecutionsClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  validateOnly: "validate_only",
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

const deleteExecution: AppBlock = {
  name: "Delete Execution",
  description: `Deletes an Execution.`,
  category: "Executions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the Execution to delete. Format: `projects/{project}/locations/{location}/jobs/{job}/executions/{execution}`, where `{project}` can be project id or number.",
          type: {
            type: "string",
            description:
              "Required. The name of the Execution to delete. Format: `projects/{project}/locations/{location}/jobs/{job}/executions/{execution}`, where `{project}` can be project id or number.",
          },
          required: true,
        },
        validateOnly: {
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

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteExecution(request, (err: any, response: any) => {
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

export default deleteExecution;
