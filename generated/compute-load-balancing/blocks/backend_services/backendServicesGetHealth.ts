import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const backendServicesGetHealth: AppBlock = {
  name: "Backend Services - Get Health",
  description: `Gets the most recent health check results for this BackendService.`,
  category: "Backend Services",
  inputs: {
    default: {
      config: {
        backendService: {
          name: "Backend Service",
          description:
            "Name of the BackendService resource to which the queried instance belongs.",
          type: {
            type: "string",
          },
          required: true,
        },
        group: {
          name: "Group",
          description:
            "A URI referencing one of the instance groups or network endpoint groups listed in the backend service.",
          type: {
            type: "string",
            description:
              "A URI referencing one of the instance groups or network endpoint groups\nlisted in the backend service.",
          },
          required: false,
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
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/compute",
              "https://www.googleapis.com/auth/compute.readonly",
            ],
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/global/backendServices/{backendService}/getHealth`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.group !== undefined)
          requestBody.group = input.event.inputConfig.group;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
          healthStatus: {
            type: "array",
            items: {
              type: "object",
              properties: {
                forwardingRule: {
                  type: "string",
                  description:
                    "URL of the forwarding rule associated with the health status of the\ninstance.",
                },
                instance: {
                  type: "string",
                  description: "URL of the instance resource.",
                },
                healthState: {
                  type: "string",
                  enum: ["HEALTHY", "UNHEALTHY"],
                  description:
                    "Health state of the IPv4 address of the instance.",
                },
                weight: {
                  type: "string",
                },
                ipv6HealthState: {
                  type: "string",
                  enum: ["HEALTHY", "UNHEALTHY"],
                  description:
                    "Health state of the IPv6 address of the instance.",
                },
                ipv6Address: {
                  type: "string",
                },
                weightError: {
                  type: "string",
                  enum: [
                    "INVALID_WEIGHT",
                    "MISSING_WEIGHT",
                    "UNAVAILABLE_WEIGHT",
                    "WEIGHT_NONE",
                  ],
                },
                forwardingRuleIp: {
                  type: "string",
                  description:
                    "A forwarding rule IP address assigned to this instance.",
                },
                port: {
                  type: "integer",
                  description:
                    "The named port of the instance group, not necessarily the port that is\nhealth-checked. (Format: int32)",
                },
                ipAddress: {
                  type: "string",
                  description:
                    "For target pool based Network Load Balancing, it indicates the forwarding\nrule's IP address assigned to this instance. For other types of load\nbalancing, the field indicates VM internal ip.",
                },
                annotations: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Metadata defined as annotations for network endpoint.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Health state of the backend instances or endpoints in requested instance or\nnetwork endpoint group, determined based on configured health checks.",
          },
          annotations: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Metadata defined as annotations on the network endpoint group.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Alwayscompute#backendServiceGroupHealth for the health of backend\nservices.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default backendServicesGetHealth;
