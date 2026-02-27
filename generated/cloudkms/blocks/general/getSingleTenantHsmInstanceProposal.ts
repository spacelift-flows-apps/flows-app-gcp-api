import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  create_time: "createTime",
  failure_reason: "failureReason",
  quorum_parameters: {
    name: "quorumParameters",
    fields: {
      required_approver_count: "requiredApproverCount",
      challenges: {
        name: "challenges",
        fields: {
          public_key_pem: "publicKeyPem",
        },
      },
      approved_two_factor_public_key_pems: "approvedTwoFactorPublicKeyPems",
    },
  },
  required_action_quorum_parameters: {
    name: "requiredActionQuorumParameters",
    fields: {
      required_challenges: {
        name: "requiredChallenges",
        fields: {
          public_key_pem: "publicKeyPem",
        },
      },
      required_approver_count: "requiredApproverCount",
      quorum_challenges: {
        name: "quorumChallenges",
        fields: {
          public_key_pem: "publicKeyPem",
        },
      },
      approved_two_factor_public_key_pems: "approvedTwoFactorPublicKeyPems",
    },
  },
  expire_time: "expireTime",
  delete_time: "deleteTime",
  purge_time: "purgeTime",
  register_two_factor_auth_keys: {
    name: "registerTwoFactorAuthKeys",
    fields: {
      required_approver_count: "requiredApproverCount",
      two_factor_public_key_pems: "twoFactorPublicKeyPems",
    },
  },
  disable_single_tenant_hsm_instance: "disableSingleTenantHsmInstance",
  enable_single_tenant_hsm_instance: "enableSingleTenantHsmInstance",
  delete_single_tenant_hsm_instance: "deleteSingleTenantHsmInstance",
  add_quorum_member: {
    name: "addQuorumMember",
    fields: {
      two_factor_public_key_pem: "twoFactorPublicKeyPem",
    },
  },
  remove_quorum_member: {
    name: "removeQuorumMember",
    fields: {
      two_factor_public_key_pem: "twoFactorPublicKeyPem",
    },
  },
  refresh_single_tenant_hsm_instance: "refreshSingleTenantHsmInstance",
};

const getSingleTenantHsmInstanceProposal: AppBlock = {
  name: "Get Single Tenant Hsm Instance Proposal",
  description: `Returns metadata for a given [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal].`,
  category: "General",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.name] of the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.name] of the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to get.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getSingleTenantHsmInstanceProposal(
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
              "Identifier. The resource name for this [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in the format `projects/*/locations/*/singleTenantHsmInstances/*/proposals/*`.",
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
              "PENDING",
              "APPROVED",
              "RUNNING",
              "SUCCEEDED",
              "FAILED",
              "DELETED",
            ],
            description:
              "Output only. The state of the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal].",
          },
          failureReason: {
            type: "string",
            description:
              "Output only. The root cause of the most recent failure. Only present if [state][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.state] is [FAILED][SingleTenantHsmInstanceProposal.FAILED].",
          },
          quorumParameters: {
            type: "object",
            properties: {
              requiredApproverCount: {
                type: "integer",
                description:
                  "Output only. The required numbers of approvers. This is the M value used for M of N quorum auth. It is less than the number of public keys.",
              },
              challenges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    challenge: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    publicKeyPem: {
                      type: "string",
                      description:
                        "Output only. The public key associated with the 2FA key that should sign the challenge.",
                    },
                  },
                  description: "A challenge to be signed by a 2FA key.",
                  additionalProperties: true,
                },
                description:
                  "Output only. The challenges to be signed by 2FA keys for quorum auth. M of N of these challenges are required to be signed to approve the operation.",
              },
              approvedTwoFactorPublicKeyPems: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Output only. The public keys associated with the 2FA keys that have already approved the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] by signing the challenge.",
              },
            },
            description:
              "Parameters of quorum approval for the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal]. (Part of 'approval_parameters' - only one field in this group can be set)",
            additionalProperties: true,
          },
          requiredActionQuorumParameters: {
            type: "object",
            properties: {
              requiredChallenges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    challenge: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    publicKeyPem: {
                      type: "string",
                      description:
                        "Output only. The public key associated with the 2FA key that should sign the challenge.",
                    },
                  },
                  description: "A challenge to be signed by a 2FA key.",
                  additionalProperties: true,
                },
                description:
                  "Output only. A list of specific challenges that must be signed. For some operations, this will contain a single challenge.",
              },
              requiredApproverCount: {
                type: "integer",
                description:
                  "Output only. The required number of quorum approvers. This is the M value used for M of N quorum auth. It is less than the number of public keys.",
              },
              quorumChallenges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    challenge: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    publicKeyPem: {
                      type: "string",
                      description:
                        "Output only. The public key associated with the 2FA key that should sign the challenge.",
                    },
                  },
                  description: "A challenge to be signed by a 2FA key.",
                  additionalProperties: true,
                },
                description:
                  "Output only. The challenges to be signed by 2FA keys for quorum auth. M of N of these challenges are required to be signed to approve the operation.",
              },
              approvedTwoFactorPublicKeyPems: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Output only. The public keys associated with the 2FA keys that have already approved the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] by signing the challenge.",
              },
            },
            description:
              "Parameters for an approval that has both required challenges and a quorum. (Part of 'approval_parameters' - only one field in this group can be set)",
            additionalProperties: true,
          },
          expireTime: {
            type: "string",
            description:
              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z') (Part of 'expiration' - only one field in this group can be set)",
          },
          deleteTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          purgeTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          registerTwoFactorAuthKeys: {
            type: "object",
            properties: {
              requiredApproverCount: {
                type: "integer",
                description:
                  "Required. The required numbers of approvers to set for the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This is the M value used for M of N quorum auth. Must be greater than or equal to 2 and less than or equal to [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] - 1.",
              },
              twoFactorPublicKeyPems: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Required. The public keys associated with the 2FA keys for M of N quorum auth. Public keys must be associated with RSA 2048 keys.",
              },
            },
            required: ["requiredApproverCount", "twoFactorPublicKeyPems"],
            description:
              "Register 2FA keys for the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This operation requires all Challenges to be signed by 2FA keys. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [PENDING_TWO_FACTOR_AUTH_REGISTRATION][google.cloud.kms.v1.SingleTenantHsmInstance.State.PENDING_TWO_FACTOR_AUTH_REGISTRATION] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
            additionalProperties: true,
          },
          disableSingleTenantHsmInstance: {
            type: "object",
            properties: {},
            description:
              "Disable the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [ACTIVE][google.cloud.kms.v1.SingleTenantHsmInstance.State.ACTIVE] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
            additionalProperties: true,
          },
          enableSingleTenantHsmInstance: {
            type: "object",
            properties: {},
            description:
              "Enable the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [DISABLED][google.cloud.kms.v1.SingleTenantHsmInstance.State.DISABLED] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
            additionalProperties: true,
          },
          deleteSingleTenantHsmInstance: {
            type: "object",
            properties: {},
            description:
              "Delete the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. Deleting a [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] will make all [CryptoKeys][google.cloud.kms.v1.CryptoKey] attached to the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] unusable. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must not be in the [DELETING][google.cloud.kms.v1.SingleTenantHsmInstance.State.DELETING] or [DELETED][google.cloud.kms.v1.SingleTenantHsmInstance.State.DELETED] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
            additionalProperties: true,
          },
          addQuorumMember: {
            type: "object",
            properties: {
              twoFactorPublicKeyPem: {
                type: "string",
                description:
                  "Required. The public key associated with the 2FA key for the new quorum member to add. Public keys must be associated with RSA 2048 keys.",
              },
            },
            required: ["twoFactorPublicKeyPem"],
            description:
              "Add a quorum member to the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This will increase the [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] by 1. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [ACTIVE][google.cloud.kms.v1.SingleTenantHsmInstance.State.ACTIVE] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
            additionalProperties: true,
          },
          removeQuorumMember: {
            type: "object",
            properties: {
              twoFactorPublicKeyPem: {
                type: "string",
                description:
                  "Required. The public key associated with the 2FA key for the quorum member to remove. Public keys must be associated with RSA 2048 keys.",
              },
            },
            required: ["twoFactorPublicKeyPem"],
            description:
              "Remove a quorum member from the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This will reduce [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] by 1. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [ACTIVE][google.cloud.kms.v1.SingleTenantHsmInstance.State.ACTIVE] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
            additionalProperties: true,
          },
          refreshSingleTenantHsmInstance: {
            type: "object",
            properties: {},
            description:
              "Refreshes the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This operation must be performed periodically to keep the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] active. This operation must be performed before [unrefreshed_duration_until_disable][google.cloud.kms.v1.SingleTenantHsmInstance.unrefreshed_duration_until_disable] has passed. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [ACTIVE][google.cloud.kms.v1.SingleTenantHsmInstance.State.ACTIVE] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
            additionalProperties: true,
          },
        },
        description:
          "A [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] represents a proposal to perform an operation on a [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
        additionalProperties: true,
      },
    },
  },
};

export default getSingleTenantHsmInstanceProposal;
