import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient } from "../../lib/grpcClient.ts";

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
        single_tenant_hsm_instance_id: {
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
        single_tenant_hsm_instance: {
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
              quorum_auth: {
                type: "object",
                properties: {
                  total_approver_count: {
                    type: "integer",
                    description:
                      "Required. The total number of approvers. This is the N value used for M of N quorum auth. Must be greater than or equal to 3 and less than or equal to 16.",
                  },
                },
                required: ["total_approver_count"],
                description: "Configuration for M of N quorum auth.",
                additionalProperties: true,
              },
            },
            required: ["quorum_auth"],
            description:
              "A [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] represents a single-tenant HSM instance. It can be used for creating [CryptoKeys][google.cloud.kms.v1.CryptoKey] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [HSM_SINGLE_TENANT][CryptoKeyVersion.ProtectionLevel.HSM_SINGLE_TENANT], as well as performing cryptographic operations using keys created within the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.single_tenant_hsm_instance_id !== undefined)
          request.single_tenant_hsm_instance_id =
            input.event.inputConfig.single_tenant_hsm_instance_id;
        if (input.event.inputConfig.single_tenant_hsm_instance !== undefined)
          request.single_tenant_hsm_instance =
            input.event.inputConfig.single_tenant_hsm_instance;

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

export default createSingleTenantHsmInstance;
