import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const policiesDelete: AppBlock = {
  name: "Policies - Delete",
  description: `Deletes a previously created policy. Fails if the policy is still being referenced by a network.`,
  category: "Policies",
  inputs: {
    default: {
      config: {
        policy: {
          name: "Policy",
          description:
            "User given friendly name of the policy addressed by this request.",
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
        if (input.event.inputConfig.policy !== undefined)
          pathParams["policy"] = String(input.event.inputConfig.policy);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "DELETE",
          pathTemplate: "dns/v1/projects/{project}/policies/{policy}",
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

export default policiesDelete;
