import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listAssociations: AppBlock = {
  name: "Organization Security Policies - List Associations",
  description: `Lists associations of a specified target, i.e., organization or folder. Use this API to read Cloud Armor policies. Previously, alpha and beta versions of this API were used to read firewall policies. This usage is now disabled for most organizations. Use firewallPolicies.listAssociations instead.`,
  category: "Organization Security Policies",
  inputs: {
    default: {
      config: {
        targetResource: {
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
        if (input.event.inputConfig.targetResource !== undefined)
          queryParams["targetResource"] = String(
            input.event.inputConfig.targetResource,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/locations/global/securityPolicies/listAssociations",
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
                attachmentId: {
                  type: "string",
                  description:
                    "The resource that the security policy is attached to.",
                },
                displayName: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The display name of the security policy of the association.",
                },
                excludedFolders: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of folders to exclude from the security policy.",
                },
                excludedProjects: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of projects to exclude from the security policy.",
                },
                name: {
                  type: "string",
                  description: "The name for an association.",
                },
                securityPolicyId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The security policy ID of the association.",
                },
                shortName: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The short name of the security policy of the association.",
                },
              },
              additionalProperties: true,
            },
            description: "A list of associations.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of securityPolicy associations. Alwayscompute#organizationSecurityPoliciesListAssociations for lists of securityPolicy associations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAssociations;
