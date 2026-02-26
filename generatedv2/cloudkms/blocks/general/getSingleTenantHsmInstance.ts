import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient } from "../../lib/grpcClient.ts";

const getSingleTenantHsmInstance: AppBlock = {
  name: "Get Single Tenant Hsm Instance",
  description: `Returns metadata for a given [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].`,
  category: "General",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstance.name] of the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstance.name] of the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] to get.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getSingleTenantHsmInstance(
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
            description:
              "Identifier. The resource name for this [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in the format `projects/*/locations/*/singleTenantHsmInstances/*`.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          state: {
            type: "string",
            enum: [
              "STATE_UNSPECIFIED",
              "CREATING",
              "PENDING_TWO_FACTOR_AUTH_REGISTRATION",
              "ACTIVE",
              "DISABLING",
              "DISABLED",
              "DELETING",
              "DELETED",
              "FAILED",
            ],
            description:
              "Output only. The state of the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
          },
          quorum_auth: {
            type: "object",
            properties: {
              total_approver_count: {
                type: "integer",
                description:
                  "Required. The total number of approvers. This is the N value used for M of N quorum auth. Must be greater than or equal to 3 and less than or equal to 16.",
              },
              required_approver_count: {
                type: "integer",
                description:
                  "Output only. The required numbers of approvers. The M value used for M of N quorum auth. Must be greater than or equal to 2 and less than or equal to [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] - 1.",
              },
              two_factor_public_key_pems: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Output only. The public keys associated with the 2FA keys for M of N quorum auth.",
              },
            },
            required: ["total_approver_count"],
            description: "Configuration for M of N quorum auth.",
            additionalProperties: true,
          },
          delete_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          unrefreshed_duration_until_disable: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          disable_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        required: ["quorum_auth"],
        description:
          "A [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] represents a single-tenant HSM instance. It can be used for creating [CryptoKeys][google.cloud.kms.v1.CryptoKey] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [HSM_SINGLE_TENANT][CryptoKeyVersion.ProtectionLevel.HSM_SINGLE_TENANT], as well as performing cryptographic operations using keys created within the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
        additionalProperties: true,
      },
    },
  },
};

export default getSingleTenantHsmInstance;
