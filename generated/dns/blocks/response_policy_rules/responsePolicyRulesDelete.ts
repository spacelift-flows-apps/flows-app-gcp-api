import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePolicyRulesDelete: AppBlock = {
  name: "Response Policy Rules - Delete",
  description: `Deletes a previously created Response Policy Rule.`,
  category: "Response Policy Rules",
  inputs: {
    default: {
      config: {
        responsePolicy: {
          name: "Response Policy",
          description:
            "User assigned name of the Response Policy containing the Response Policy Rule.",
          type: {
            type: "string",
          },
          required: true,
        },
        responsePolicyRule: {
          name: "Response Policy Rule",
          description:
            "User assigned name of the Response Policy Rule addressed by this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        clientOperationId: {
          name: "Client Operation Id",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.responsePolicy !== undefined)
          pathParams["responsePolicy"] = String(
            input.event.inputConfig.responsePolicy,
          );
        if (input.event.inputConfig.responsePolicyRule !== undefined)
          pathParams["responsePolicyRule"] = String(
            input.event.inputConfig.responsePolicyRule,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "DELETE",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules/{responsePolicyRule}",
          pathParams,
          queryParams,
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
        additionalProperties: true,
      },
    },
  },
};

export default responsePolicyRulesDelete;
