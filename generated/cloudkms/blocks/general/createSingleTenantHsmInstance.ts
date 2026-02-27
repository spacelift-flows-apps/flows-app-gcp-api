import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  singleTenantHsmInstanceId: "single_tenant_hsm_instance_id",
  singleTenantHsmInstance: {
    name: "single_tenant_hsm_instance",
    fields: {
      quorumAuth: {
        name: "quorum_auth",
        fields: {
          totalApproverCount: "total_approver_count",
        },
      },
    },
  },
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

const createSingleTenantHsmInstance: AppBlock = {
  name: "Create Single Tenant Hsm Instance",
  description: `Creates a new [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in a given Project and Location. User must create a RegisterTwoFactorAuthKeys proposal with this single-tenant HSM instance to finish setup of the instance.`,
  category: "General",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the location associated with the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance], in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the location associated with the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance], in the format `projects/*/locations/*`.",
          },
          required: true,
        },
        singleTenantHsmInstanceId: {
          name: "Single Tenant Hsm Instance Id",
          description:
            "Optional. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`.",
          type: {
            type: "string",
            description:
              "Optional. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`.",
          },
          required: false,
        },
        singleTenantHsmInstance: {
          name: "Single Tenant Hsm Instance",
          description:
            "Required. An [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] with initial field values.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. The resource name for this [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in the format `projects/*/locations/*/singleTenantHsmInstances/*`.",
              },
              quorumAuth: {
                type: "object",
                properties: {
                  totalApproverCount: {
                    type: "integer",
                    description:
                      "Required. The total number of approvers. This is the N value used for M of N quorum auth. Must be greater than or equal to 3 and less than or equal to 16.",
                  },
                },
                required: ["totalApproverCount"],
                description: "Configuration for M of N quorum auth.",
                additionalProperties: true,
              },
            },
            required: ["quorumAuth"],
            description:
              "A [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] represents a single-tenant HSM instance. It can be used for creating [CryptoKeys][google.cloud.kms.v1.CryptoKey] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [HSM_SINGLE_TENANT][CryptoKeyVersion.ProtectionLevel.HSM_SINGLE_TENANT], as well as performing cryptographic operations using keys created within the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createSingleTenantHsmInstance(
            request,
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

export default createSingleTenantHsmInstance;
