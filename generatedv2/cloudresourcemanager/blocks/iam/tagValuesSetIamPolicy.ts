import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  policy: {
    name: "policy",
    fields: {
      auditConfigs: {
        name: "audit_configs",
        fields: {
          auditLogConfigs: {
            name: "audit_log_configs",
            fields: {
              logType: "log_type",
              exemptedMembers: "exempted_members",
            },
          },
        },
      },
    },
  },
  updateMask: "update_mask",
};

const outputMapping = {
  audit_configs: {
    name: "auditConfigs",
    fields: {
      audit_log_configs: {
        name: "auditLogConfigs",
        fields: {
          log_type: "logType",
          exempted_members: "exemptedMembers",
        },
      },
    },
  },
};

const tagValuesSetIamPolicy: AppBlock = {
  name: "TagValues - Set IAM Policy",
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
              auditConfigs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    service: {
                      type: "string",
                    },
                    auditLogConfigs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          logType: {
                            type: "string",
                            enum: [
                              "LOG_TYPE_UNSPECIFIED",
                              "ADMIN_READ",
                              "DATA_WRITE",
                              "DATA_READ",
                            ],
                          },
                          exemptedMembers: {
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
        updateMask: {
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
        const client = await getTagValuesClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

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
          auditConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                service: {
                  type: "string",
                },
                auditLogConfigs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      logType: {
                        type: "string",
                        enum: [
                          "LOG_TYPE_UNSPECIFIED",
                          "ADMIN_READ",
                          "DATA_WRITE",
                          "DATA_READ",
                        ],
                      },
                      exemptedMembers: {
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

export default tagValuesSetIamPolicy;
