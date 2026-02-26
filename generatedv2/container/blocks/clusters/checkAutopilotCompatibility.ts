import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const checkAutopilotCompatibility: AppBlock = {
  name: "Check Autopilot Compatibility",
  description: `Checks the cluster compatibility with Autopilot mode, and returns a list of compatibility issues.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster) of the cluster to retrieve. Specified in the format `projects/*/locations/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster) of the cluster to retrieve. Specified in the format `projects/*/locations/*/clusters/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.checkAutopilotCompatibility(
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
          issues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                last_observation: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                constraint_type: {
                  type: "string",
                  description: "The constraint type of the issue.",
                },
                incompatibility_type: {
                  type: "string",
                  enum: [
                    "UNSPECIFIED",
                    "INCOMPATIBILITY",
                    "ADDITIONAL_CONFIG_REQUIRED",
                    "PASSED_WITH_OPTIONAL_CONFIG",
                  ],
                  description: "The incompatibility type of this issue.",
                },
                subjects: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The name of the resources which are subject to this issue.",
                },
                documentation_url: {
                  type: "string",
                  description:
                    "A URL to a public documentation, which addresses resolving this issue.",
                },
                description: {
                  type: "string",
                  description: "The description of the issue.",
                },
              },
              description:
                "AutopilotCompatibilityIssue contains information about a specific compatibility issue with Autopilot mode.",
              additionalProperties: true,
            },
            description: "The list of issues for the given operation.",
          },
          summary: {
            type: "string",
            description: "The summary of the autopilot compatibility response.",
          },
        },
        description:
          "CheckAutopilotCompatibilityResponse has a list of compatibility issues.",
        additionalProperties: true,
      },
    },
  },
};

export default checkAutopilotCompatibility;
