import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  singleTenantHsmInstanceProposalId: "single_tenant_hsm_instance_proposal_id",
  singleTenantHsmInstanceProposal: {
    name: "single_tenant_hsm_instance_proposal",
    fields: {
      expireTime: "expire_time",
      registerTwoFactorAuthKeys: {
        name: "register_two_factor_auth_keys",
        fields: {
          requiredApproverCount: "required_approver_count",
          twoFactorPublicKeyPems: "two_factor_public_key_pems",
        },
      },
      disableSingleTenantHsmInstance: "disable_single_tenant_hsm_instance",
      enableSingleTenantHsmInstance: "enable_single_tenant_hsm_instance",
      deleteSingleTenantHsmInstance: "delete_single_tenant_hsm_instance",
      addQuorumMember: {
        name: "add_quorum_member",
        fields: {
          twoFactorPublicKeyPem: "two_factor_public_key_pem",
        },
      },
      removeQuorumMember: {
        name: "remove_quorum_member",
        fields: {
          twoFactorPublicKeyPem: "two_factor_public_key_pem",
        },
      },
      refreshSingleTenantHsmInstance: "refresh_single_tenant_hsm_instance",
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

const createSingleTenantHsmInstanceProposal: AppBlock = {
  name: "Create Single Tenant Hsm Instance Proposal",
  description: `Creates a new [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] for a given [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].`,
  category: "General",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstance.name] of the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] associated with the [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal].",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstance.name] of the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] associated with the [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal].",
          },
          required: true,
        },
        singleTenantHsmInstanceProposalId: {
          name: "Single Tenant Hsm Instance Proposal Id",
          description:
            "Optional. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`.",
          type: {
            type: "string",
            description:
              "Optional. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`.",
          },
          required: false,
        },
        singleTenantHsmInstanceProposal: {
          name: "Single Tenant Hsm Instance Proposal",
          description:
            "Required. The [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to create.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. The resource name for this [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in the format `projects/*/locations/*/singleTenantHsmInstances/*/proposals/*`.",
              },
              expireTime: {
                type: "string",
                description:
                  "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z') (Part of 'expiration' - only one field in this group can be set)",
              },
              ttl: {
                type: "string",
                description:
                  "Duration string (e.g., '1.5s', '300s') (Part of 'expiration' - only one field in this group can be set)",
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
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createSingleTenantHsmInstanceProposal(
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

export default createSingleTenantHsmInstanceProposal;
