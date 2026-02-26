import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getIAMClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const setIamPolicy: AppBlock = {
  name: "Set IAM Policy",
  description: `Sets the IAM policy that is attached to a [ServiceAccount][google.iam.admin.v1.ServiceAccount]. Use this method to grant or revoke access to the service account. For example, you could grant a principal the ability to impersonate the service account. This method does not enable the service account to access other resources. To grant roles to a service account on a resource, follow these steps: 1. Call the resource's 'getIamPolicy' method to get its current IAM policy. 2. Edit the policy so that it binds the service account to an IAM role for the resource. 3. Call the resource's 'setIamPolicy' method to update its IAM policy. For detailed instructions, see [Manage access to project, folders, and organizations](https://cloud.google.com/iam/help/service-accounts/granting-access-to-service-accounts) or [Manage access to other resources](https://cloud.google.com/iam/help/access/manage-other-resources).`,
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
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.resource !== undefined)
          request.resource = input.event.inputConfig.resource;
        if (input.event.inputConfig.policy !== undefined)
          request.policy = input.event.inputConfig.policy;
        if (input.event.inputConfig.updateMask !== undefined)
          request.updateMask = input.event.inputConfig.updateMask;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.setIamPolicy(protoRequest, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        await events.emit(result ? toCamelCase(result) : {});
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
