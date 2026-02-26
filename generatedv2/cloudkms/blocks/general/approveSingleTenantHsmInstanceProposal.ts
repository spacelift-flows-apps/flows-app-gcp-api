import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient } from "../../lib/grpcClient.ts";

const approveSingleTenantHsmInstanceProposal: AppBlock = {
  name: "Approve Single Tenant Hsm Instance Proposal",
  description: `Approves a [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] for a given [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. The proposal must be in the [PENDING][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.State.PENDING] state.`,
  category: "General",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.name] of the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to approve.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.name] of the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to approve.",
          },
          required: true,
        },
        quorum_reply: {
          name: "Quorum Reply",
          description:
            "Required. The reply to [QuorumParameters][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.QuorumParameters] for approving the proposal.",
          type: {
            type: "object",
            properties: {
              challenge_replies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    signed_challenge: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    public_key_pem: {
                      type: "string",
                      description:
                        "Required. The public key associated with the 2FA key.",
                    },
                  },
                  required: ["signed_challenge", "public_key_pem"],
                  description: "A reply to a challenge signed by a 2FA key.",
                  additionalProperties: true,
                },
                description:
                  "Required. The challenge replies to approve the proposal. Challenge replies can be sent across multiple requests. The proposal will be approved when [required_approver_count][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.QuorumParameters.required_approver_count] challenge replies are provided.",
              },
            },
            required: ["challenge_replies"],
            description:
              "The reply to [QuorumParameters][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.QuorumParameters] for approving the proposal. (Part of 'approval_payload' - only one field in this group can be set)",
            additionalProperties: true,
          },
          required: true,
        },
        required_action_quorum_reply: {
          name: "Required Action Quorum Reply",
          description:
            "Required. The reply to [RequiredActionQuorumParameters][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.RequiredActionQuorumParameters] for approving the proposal.",
          type: {
            type: "object",
            properties: {
              required_challenge_replies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    signed_challenge: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    public_key_pem: {
                      type: "string",
                      description:
                        "Required. The public key associated with the 2FA key.",
                    },
                  },
                  required: ["signed_challenge", "public_key_pem"],
                  description: "A reply to a challenge signed by a 2FA key.",
                  additionalProperties: true,
                },
                description:
                  "Required. All required challenges must be signed for the proposal to be approved. These can be sent across multiple requests.",
              },
              quorum_challenge_replies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    signed_challenge: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    public_key_pem: {
                      type: "string",
                      description:
                        "Required. The public key associated with the 2FA key.",
                    },
                  },
                  required: ["signed_challenge", "public_key_pem"],
                  description: "A reply to a challenge signed by a 2FA key.",
                  additionalProperties: true,
                },
                description:
                  "Required. Quorum members' signed challenge replies. These can be provided across multiple requests. The proposal will be approved when [required_approver_count][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.RequiredActionQuorumParameters.required_approver_count] quorum_challenge_replies are provided and when all required_challenge_replies are provided.",
              },
            },
            required: [
              "required_challenge_replies",
              "quorum_challenge_replies",
            ],
            description:
              "The reply to [RequiredActionQuorumParameters][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.RequiredActionQuorumParameters] for approving the proposal. (Part of 'approval_payload' - only one field in this group can be set)",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.quorum_reply !== undefined)
          request.quorum_reply = input.event.inputConfig.quorum_reply;
        if (input.event.inputConfig.required_action_quorum_reply !== undefined)
          request.required_action_quorum_reply =
            input.event.inputConfig.required_action_quorum_reply;

        const result = await new Promise<any>((resolve, reject) => {
          client.approveSingleTenantHsmInstanceProposal(
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
        properties: {},
        description:
          "Response message for [HsmManagement.ApproveSingleTenantHsmInstanceProposal][google.cloud.kms.v1.HsmManagement.ApproveSingleTenantHsmInstanceProposal].",
        additionalProperties: true,
      },
    },
  },
};

export default approveSingleTenantHsmInstanceProposal;
