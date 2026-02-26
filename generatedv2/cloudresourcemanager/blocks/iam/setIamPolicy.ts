import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagKeysClient } from "../../lib/grpcClient.ts";

const setIamPolicy: AppBlock = {
  name: "Set IAM Policy",
  description: `Sets the access control policy on a TagValue, replacing any existing policy. The 'resource' field should be the TagValue's resource name. For example: 'tagValues/1234'. The caller must have 'resourcemanager.tagValues.setIamPolicy' permission on the identified tagValue.`,
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
        policy: {
          name: "Policy",
          description: "Policy field",
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
          required: false,
        },
        update_mask: {
          name: "Update Mask",
          description: "Update Mask field",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getTagKeysClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.resource !== undefined)
          request.resource = input.event.inputConfig.resource;
        if (input.event.inputConfig.policy !== undefined)
          request.policy = input.event.inputConfig.policy;
        if (input.event.inputConfig.update_mask !== undefined)
          request.update_mask = input.event.inputConfig.update_mask;

        const result = await new Promise<any>((resolve, reject) => {
          client.setIamPolicy(request, (err: any, response: any) => {
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

export default setIamPolicy;
