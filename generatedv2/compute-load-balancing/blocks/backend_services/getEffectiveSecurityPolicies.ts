import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getEffectiveSecurityPolicies: AppBlock = {
  name: "Backend Services - Get Effective Security Policies",
  description: `Returns effective security policies applied to this backend service.`,
  category: "Backend Services",
  inputs: {
    default: {
      config: {
        backend_service: {
          name: "Backend Service",
          description: "Name of the Backend Service for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.backend_service !== undefined)
          pathParams["backend_service"] = String(
            input.event.inputConfig.backend_service,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/backendServices/{backend_service}/getEffectiveSecurityPolicies",
          pathParams,
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
          "A response message for BackendServices.GetEffectiveSecurityPolicies. See the method description for details.",
        additionalProperties: true,
      },
    },
  },
};

export default getEffectiveSecurityPolicies;
