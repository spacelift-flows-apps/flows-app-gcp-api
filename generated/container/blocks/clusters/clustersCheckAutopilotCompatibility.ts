import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const clustersCheckAutopilotCompatibility: AppBlock = {
  name: "Clusters - Check Autopilot Compatibility",
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
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://container.googleapis.com/";
        let path = `v1/{+name}:checkAutopilotCompatibility`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();
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
          summary: {
            type: "string",
            description: "The summary of the autopilot compatibility response.",
          },
          issues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                lastObservation: {
                  type: "string",
                  description:
                    "The last time when this issue was observed. (Format: google-datetime)",
                },
                incompatibilityType: {
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
                documentationUrl: {
                  type: "string",
                  description:
                    "A URL to a public documentation, which addresses resolving this issue.",
                },
                description: {
                  type: "string",
                  description: "The description of the issue.",
                },
                constraintType: {
                  type: "string",
                  description: "The constraint type of the issue.",
                },
              },
              description:
                "AutopilotCompatibilityIssue contains information about a specific compatibility issue with Autopilot mode.",
              additionalProperties: true,
            },
            description: "The list of issues for the given operation.",
          },
        },
        description:
          "CheckAutopilotCompatibilityResponse has a list of compatibility issues.",
        additionalProperties: true,
      },
    },
  },
};

export default clustersCheckAutopilotCompatibility;
