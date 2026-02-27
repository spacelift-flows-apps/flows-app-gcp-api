import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const organizationSecurityPoliciesGetAssociation: AppBlock = {
  name: "Organization Security Policies - Get Association",
  description: `Gets an association with the specified name.`,
  category: "Organization Security Policies",
  inputs: {
    default: {
      config: {
        securityPolicy: {
          name: "Security Policy",
          description:
            "Name of the security policy to which the queried rule belongs.",
          type: {
            type: "string",
            description:
              "Name of the security policy to which the queried rule belongs.",
          },
          required: true,
        },
        name: {
          name: "Name",
          description:
            "The name of the association to get from the security policy.",
          type: {
            type: "string",
            description:
              "The name of the association to get from the security policy.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.securityPolicy !== undefined)
          pathParams["security_policy"] = String(
            input.event.inputConfig.securityPolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.name !== undefined)
          queryParams["name"] = String(input.event.inputConfig.name);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/locations/global/securityPolicies/{security_policy}/getAssociation",
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
    },
  },
};

export default organizationSecurityPoliciesGetAssociation;
