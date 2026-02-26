import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getAssociation: AppBlock = {
  name: "Network Firewall Policies - Get Association",
  description: `Gets an association with the specified name.`,
  category: "Network Firewall Policies",
  inputs: {
    default: {
      config: {
        firewall_policy: {
          name: "Firewall Policy",
          description:
            "Name of the firewall policy to which the queried association belongs.",
          type: {
            type: "string",
          },
          required: true,
        },
        name: {
          name: "Name",
          description:
            "The name of the association to get from the firewall policy.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.firewall_policy !== undefined)
          pathParams["firewall_policy"] = String(
            input.event.inputConfig.firewall_policy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.name !== undefined)
          queryParams["name"] = String(input.event.inputConfig.name);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/firewallPolicies/{firewall_policy}/getAssociation",
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
        properties: {
          attachment_target: {
            type: "string",
            description: "The target that the firewall policy is attached to.",
          },
          display_name: {
            type: "string",
            description:
              "[Output Only] Deprecated, please use short name instead. The display name of the firewall policy of the association.",
          },
          firewall_policy_id: {
            type: "string",
            description:
              "Output only. [Output Only] The firewall policy ID of the association.",
          },
          name: {
            type: "string",
            description: "The name for an association.",
          },
          short_name: {
            type: "string",
            description:
              "Output only. [Output Only] The short name of the firewall policy of the association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAssociation;
