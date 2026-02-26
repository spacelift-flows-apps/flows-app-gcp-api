import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePoliciesDelete: AppBlock = {
  name: "Response Policies - Delete",
  description: `Deletes a previously created Response Policy. Fails if the response policy is non-empty or still being referenced by a network.`,
  category: "Response Policies",
  inputs: {
    default: {
      config: {
        responsePolicy: {
          name: "Response Policy",
          description:
            "User assigned name of the Response Policy addressed by this request.",
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

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "DELETE",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}",
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

export default responsePoliciesDelete;
