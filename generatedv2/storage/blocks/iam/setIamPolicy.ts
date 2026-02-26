import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

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

const setIamPolicy: AppBlock = {
  name: "Set IAM Policy",
  description: `Updates an IAM policy for the specified bucket or managed folder. The 'resource' field in the request should be 'projects/_/buckets/{bucket}' for a bucket, or 'projects/_/buckets/{bucket}/managedFolders/{managedFolder}' for a managed folder.`,
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
        const client = await getStorageClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.resource !== undefined)
          routingParams["bucket"] = String(request.resource);
        if (request.resource !== undefined) {
          const m = String(request.resource).match(
            /^(projects\/[^/]+\/buckets\/[^/]+)/,
          );
          if (m) routingParams["bucket"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.setIamPolicy(request, metadata, (err: any, response: any) => {
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

export default setIamPolicy;
