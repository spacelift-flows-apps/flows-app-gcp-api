import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  create_time: "createTime",
  quorum_auth: {
    name: "quorumAuth",
    fields: {
      total_approver_count: "totalApproverCount",
      required_approver_count: "requiredApproverCount",
      two_factor_public_key_pems: "twoFactorPublicKeyPems",
    },
  },
  delete_time: "deleteTime",
  unrefreshed_duration_until_disable: "unrefreshedDurationUntilDisable",
  disable_time: "disableTime",
};

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

        const request = { ...input.event.inputConfig };

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
            description:
              "Identifier. The resource name for this [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in the format `projects/*/locations/*/singleTenantHsmInstances/*`.",
          },
          createTime: {
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
          quorumAuth: {
            type: "object",
            properties: {
              totalApproverCount: {
                type: "integer",
                description:
                  "Required. The total number of approvers. This is the N value used for M of N quorum auth. Must be greater than or equal to 3 and less than or equal to 16.",
              },
              requiredApproverCount: {
                type: "integer",
                description:
                  "Output only. The required numbers of approvers. The M value used for M of N quorum auth. Must be greater than or equal to 2 and less than or equal to [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] - 1.",
              },
              twoFactorPublicKeyPems: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Output only. The public keys associated with the 2FA keys for M of N quorum auth.",
              },
            },
            required: ["totalApproverCount"],
            description: "Configuration for M of N quorum auth.",
            additionalProperties: true,
          },
          deleteTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          unrefreshedDurationUntilDisable: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          disableTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        required: ["quorumAuth"],
        description:
          "A [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] represents a single-tenant HSM instance. It can be used for creating [CryptoKeys][google.cloud.kms.v1.CryptoKey] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [HSM_SINGLE_TENANT][CryptoKeyVersion.ProtectionLevel.HSM_SINGLE_TENANT], as well as performing cryptographic operations using keys created within the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
        additionalProperties: true,
      },
    },
  },
};

export default getSingleTenantHsmInstance;
