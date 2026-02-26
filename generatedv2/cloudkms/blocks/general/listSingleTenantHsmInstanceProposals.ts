import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient } from "../../lib/grpcClient.ts";

const listSingleTenantHsmInstanceProposals: AppBlock = {
  name: "List Single Tenant Hsm Instance Proposals",
  description: `Lists [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal].`,
  category: "General",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the single tenant HSM instance associated with the [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to list, in the format `projects/*/locations/*/singleTenantHsmInstances/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the single tenant HSM instance associated with the [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to list, in the format `projects/*/locations/*/singleTenantHsmInstances/*`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to include in the response. Further [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] can subsequently be obtained by including the [ListSingleTenantHsmInstanceProposalsResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstanceProposalsResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. Optional limit on the number of [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to include in the response. Further [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] can subsequently be obtained by including the [ListSingleTenantHsmInstanceProposalsResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstanceProposalsResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via [ListSingleTenantHsmInstanceProposalsResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstanceProposalsResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional. Optional pagination token, returned earlier via [ListSingleTenantHsmInstanceProposalsResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstanceProposalsResponse.next_page_token].",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order.  For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order.  For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
        show_deleted: {
          name: "Show Deleted",
          description:
            "Optional. If set to true, [HsmManagement.ListSingleTenantHsmInstanceProposals][google.cloud.kms.v1.HsmManagement.ListSingleTenantHsmInstanceProposals] will also return [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] in DELETED state.",
          type: {
            type: "boolean",
            description:
              "Optional. If set to true, [HsmManagement.ListSingleTenantHsmInstanceProposals][google.cloud.kms.v1.HsmManagement.ListSingleTenantHsmInstanceProposals] will also return [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] in DELETED state.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.order_by !== undefined)
          request.order_by = input.event.inputConfig.order_by;
        if (input.event.inputConfig.show_deleted !== undefined)
          request.show_deleted = input.event.inputConfig.show_deleted;

        const result = await new Promise<any>((resolve, reject) => {
          client.listSingleTenantHsmInstanceProposals(
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
          single_tenant_hsm_instance_proposals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Identifier. The resource name for this [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in the format `projects/*/locations/*/singleTenantHsmInstances/*/proposals/*`.",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                failure_reason: {
                  type: "string",
                  description:
                    "Output only. The root cause of the most recent failure. Only present if [state][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.state] is [FAILED][SingleTenantHsmInstanceProposal.FAILED].",
                },
                quorum_parameters: {
                  type: "object",
                  properties: {
                    required_approver_count: {
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
                          public_key_pem: {
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
                    approved_two_factor_public_key_pems: {
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
                required_action_quorum_parameters: {
                  type: "object",
                  properties: {
                    required_challenges: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          challenge: {
                            type: "string",
                            description: "Base64-encoded bytes",
                          },
                          public_key_pem: {
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
                    required_approver_count: {
                      type: "integer",
                      description:
                        "Output only. The required number of quorum approvers. This is the M value used for M of N quorum auth. It is less than the number of public keys.",
                    },
                    quorum_challenges: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          challenge: {
                            type: "string",
                            description: "Base64-encoded bytes",
                          },
                          public_key_pem: {
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
                    approved_two_factor_public_key_pems: {
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
                expire_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z') (Part of 'expiration' - only one field in this group can be set)",
                },
                delete_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                purge_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                register_two_factor_auth_keys: {
                  type: "object",
                  properties: {
                    required_approver_count: {
                      type: "integer",
                      description:
                        "Required. The required numbers of approvers to set for the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This is the M value used for M of N quorum auth. Must be greater than or equal to 2 and less than or equal to [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] - 1.",
                    },
                    two_factor_public_key_pems: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Required. The public keys associated with the 2FA keys for M of N quorum auth. Public keys must be associated with RSA 2048 keys.",
                    },
                  },
                  required: [
                    "required_approver_count",
                    "two_factor_public_key_pems",
                  ],
                  description:
                    "Register 2FA keys for the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This operation requires all Challenges to be signed by 2FA keys. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [PENDING_TWO_FACTOR_AUTH_REGISTRATION][google.cloud.kms.v1.SingleTenantHsmInstance.State.PENDING_TWO_FACTOR_AUTH_REGISTRATION] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                disable_single_tenant_hsm_instance: {
                  type: "object",
                  properties: {},
                  description:
                    "Disable the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [ACTIVE][google.cloud.kms.v1.SingleTenantHsmInstance.State.ACTIVE] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                enable_single_tenant_hsm_instance: {
                  type: "object",
                  properties: {},
                  description:
                    "Enable the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [DISABLED][google.cloud.kms.v1.SingleTenantHsmInstance.State.DISABLED] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                delete_single_tenant_hsm_instance: {
                  type: "object",
                  properties: {},
                  description:
                    "Delete the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. Deleting a [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] will make all [CryptoKeys][google.cloud.kms.v1.CryptoKey] attached to the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] unusable. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must not be in the [DELETING][google.cloud.kms.v1.SingleTenantHsmInstance.State.DELETING] or [DELETED][google.cloud.kms.v1.SingleTenantHsmInstance.State.DELETED] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                add_quorum_member: {
                  type: "object",
                  properties: {
                    two_factor_public_key_pem: {
                      type: "string",
                      description:
                        "Required. The public key associated with the 2FA key for the new quorum member to add. Public keys must be associated with RSA 2048 keys.",
                    },
                  },
                  required: ["two_factor_public_key_pem"],
                  description:
                    "Add a quorum member to the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This will increase the [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] by 1. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [ACTIVE][google.cloud.kms.v1.SingleTenantHsmInstance.State.ACTIVE] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                remove_quorum_member: {
                  type: "object",
                  properties: {
                    two_factor_public_key_pem: {
                      type: "string",
                      description:
                        "Required. The public key associated with the 2FA key for the quorum member to remove. Public keys must be associated with RSA 2048 keys.",
                    },
                  },
                  required: ["two_factor_public_key_pem"],
                  description:
                    "Remove a quorum member from the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. This will reduce [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] by 1. The [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] must be in the [ACTIVE][google.cloud.kms.v1.SingleTenantHsmInstance.State.ACTIVE] state to perform this operation. (Part of 'operation' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                refresh_single_tenant_hsm_instance: {
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
          next_page_token: {
            type: "string",
            description:
              "A token to retrieve next page of results. Pass this value in [ListSingleTenantHsmInstanceProposalsRequest.page_token][google.cloud.kms.v1.ListSingleTenantHsmInstanceProposalsRequest.page_token] to retrieve the next page of results.",
          },
          total_size: {
            type: "integer",
            description:
              "The total number of [SingleTenantHsmInstanceProposals][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] that matched the query.  This field is not populated if [ListSingleTenantHsmInstanceProposalsRequest.filter][google.cloud.kms.v1.ListSingleTenantHsmInstanceProposalsRequest.filter] is applied.",
          },
        },
        description:
          "Response message for [HsmManagement.ListSingleTenantHsmInstanceProposals][google.cloud.kms.v1.HsmManagement.ListSingleTenantHsmInstanceProposals].",
        additionalProperties: true,
      },
    },
  },
};

export default listSingleTenantHsmInstanceProposals;
