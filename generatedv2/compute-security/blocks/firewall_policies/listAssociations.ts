import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listAssociations: AppBlock = {
  name: "Firewall Policies - List Associations",
  description: `Lists associations of a specified target, i.e., organization or folder. Use this API to read Cloud Armor policies. Previously, alpha and beta versions of this API were used to read firewall policies. This usage is now disabled for most organizations. Use firewallPolicies.listAssociations instead.`,
  category: "Firewall Policies",
  inputs: {
    default: {
      config: {
        target_resource: {
          name: "Target Resource",
          description:
            "The target resource to list associations. It is an organization, or a folder.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.target_resource !== undefined)
          queryParams["targetResource"] = String(
            input.event.inputConfig.target_resource,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/locations/global/firewallPolicies/listAssociations",
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
          associations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                attachment_target: {
                  type: "string",
                  description:
                    "The target that the firewall policy is attached to.",
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
            description: "A list of associations.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of firewallPolicy associations. Alwayscompute#FirewallPoliciesListAssociations for lists of firewallPolicy associations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAssociations;
