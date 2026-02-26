import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getAssociation: AppBlock = {
  name: "Region Network Firewall Policies - Get Association",
  description: `Gets an association with the specified name.`,
  category: "Region Network Firewall Policies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        firewallPolicy: {
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
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.firewallPolicy !== undefined)
          pathParams["firewall_policy"] = String(
            input.event.inputConfig.firewallPolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.name !== undefined)
          queryParams["name"] = String(input.event.inputConfig.name);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/firewallPolicies/{firewall_policy}/getAssociation",
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
          attachmentTarget: {
            type: "string",
            description: "The target that the firewall policy is attached to.",
          },
          displayName: {
            type: "string",
            description:
              "[Output Only] Deprecated, please use short name instead. The display name of the firewall policy of the association.",
          },
          firewallPolicyId: {
            type: "string",
            description:
              "Output only. [Output Only] The firewall policy ID of the association.",
          },
          name: {
            type: "string",
            description: "The name for an association.",
          },
          shortName: {
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
