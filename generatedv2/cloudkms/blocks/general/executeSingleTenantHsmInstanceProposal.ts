import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient } from "../../lib/grpcClient.ts";

const executeSingleTenantHsmInstanceProposal: AppBlock = {
  name: "Execute Single Tenant Hsm Instance Proposal",
  description: `Executes a [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] for a given [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance]. The proposal must be in the [APPROVED][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.State.APPROVED] state.`,
  category: "General",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.name] of the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to execute.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.SingleTenantHsmInstanceProposal.name] of the [SingleTenantHsmInstanceProposal][google.cloud.kms.v1.SingleTenantHsmInstanceProposal] to execute.",
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
          client.executeSingleTenantHsmInstanceProposal(
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

export default executeSingleTenantHsmInstanceProposal;
