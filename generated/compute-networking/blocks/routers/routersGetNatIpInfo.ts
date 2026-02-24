import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const routersGetNatIpInfo: AppBlock = {
  name: "Routers - Get NAT IP Info",
  description: `Retrieves runtime NAT IP information.`,
  category: "Routers",
  inputs: {
    default: {
      config: {
        router: {
          name: "Router",
          description:
            "Name of the Router resource to query for Nat IP information. The name\nshould conform to RFC1035.",
          type: {
            type: "string",
          },
          required: true,
        },
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        natName: {
          name: "NAT Name",
          description:
            "Name of the nat service to filter the NAT IP information.\nIf it is omitted, all nats for this router will be returned.\nName should conform to RFC1035.",
          type: {
            type: "string",
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
        let path = `projects/{project}/regions/{region}/routers/{router}/getNatIpInfo`;

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
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                natName: {
                  type: "string",
                  description:
                    "Name of the NAT config which the NAT IP belongs to.",
                },
                natIpInfoMappings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      natIp: {
                        type: "string",
                        description:
                          "NAT IP address. For example: 203.0.113.11.",
                      },
                      usage: {
                        type: "string",
                        enum: ["IN_USE", "UNUSED"],
                        description:
                          "Specifies whether NAT IP is currently serving at least one endpoint or\nnot.",
                      },
                      mode: {
                        type: "string",
                        enum: ["AUTO", "MANUAL"],
                        description:
                          "Specifies whether NAT IP is auto or manual.",
                      },
                    },
                    description: "Contains information of a NAT IP.",
                    additionalProperties: true,
                  },
                  description:
                    "A list of all NAT IPs assigned to this NAT config.",
                },
              },
              description:
                "Contains NAT IP information of a NAT config (i.e. usage status, mode).",
              additionalProperties: true,
            },
            description: "[Output Only] A list of NAT IP information.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default routersGetNatIpInfo;
