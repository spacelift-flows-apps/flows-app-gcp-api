import { AppBlock, events } from "@slflows/sdk/v1";
import { getSecretManagerServiceClient } from "../../lib/grpcClient.ts";

const getIamPolicy: AppBlock = {
  name: "Get IAM Policy",
  description: `Gets the access control policy for a secret. Returns empty policy if the secret exists and does not have a policy set.`,
  category: "IAM",
  inputs: {
    default: {
      config: {
        resource: {
          name: "Resource",
          description: "Resource field",
          type: {
            type: "string",
          },
          required: false,
        },
        options: {
          name: "Options",
          description: "Options field",
          type: {
            type: "object",
            properties: {
              requested_policy_version: {
                type: "integer",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSecretManagerServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.resource !== undefined)
          request.resource = input.event.inputConfig.resource;
        if (input.event.inputConfig.options !== undefined)
          request.options = input.event.inputConfig.options;

        const result = await new Promise<any>((resolve, reject) => {
          client.getIamPolicy(request, (err: any, response: any) => {
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
          version: {
            type: "integer",
          },
          bindings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                },
                members: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                condition: {
                  type: "object",
                  properties: {
                    expression: {
                      type: "string",
                    },
                    title: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                    location: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
            },
          },
          audit_configs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                service: {
                  type: "string",
                },
                audit_log_configs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      log_type: {
                        type: "string",
                        enum: [
                          "LOG_TYPE_UNSPECIFIED",
                          "ADMIN_READ",
                          "DATA_WRITE",
                          "DATA_READ",
                        ],
                      },
                      exempted_members: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                    additionalProperties: true,
                  },
                },
              },
              additionalProperties: true,
            },
          },
          etag: {
            type: "string",
            description: "Base64-encoded bytes",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getIamPolicy;
