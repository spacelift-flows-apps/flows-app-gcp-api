import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const vpnGatewaysGetStatus: AppBlock = {
  name: "VPN Gateways - Get Status",
  description: `Returns the status for the specified VPN gateway.`,
  category: "VPN Gateways",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        vpnGateway: {
          name: "VPN Gateway",
          description: "Name of the VPN gateway to return.",
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
        let path = `projects/{project}/regions/{region}/vpnGateways/{vpnGateway}/getStatus`;

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
            type: "object",
            properties: {
              vpnConnections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    tunnels: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          localGatewayInterface: {
                            type: "integer",
                            description:
                              "The VPN gateway interface this VPN tunnel is associated with. (Format: uint32)",
                          },
                          peerGatewayInterface: {
                            type: "integer",
                            description:
                              "The peer gateway interface this VPN tunnel is connected to, the peer\ngateway could either be an external VPN gateway or a Google Cloud\nVPN gateway. (Format: uint32)",
                          },
                          tunnelUrl: {
                            type: "string",
                            description: "URL reference to the VPN tunnel.",
                          },
                        },
                        description:
                          "Contains some information about a VPN tunnel.",
                        additionalProperties: true,
                      },
                      description:
                        "List of VPN tunnels that are in this VPN connection.",
                    },
                    state: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: [
                            "CONNECTION_REDUNDANCY_MET",
                            "CONNECTION_REDUNDANCY_NOT_MET",
                          ],
                          description:
                            "Indicates the high availability requirement state for the VPN connection.\nValid values are CONNECTION_REDUNDANCY_MET,CONNECTION_REDUNDANCY_NOT_MET.",
                        },
                        unsatisfiedReason: {
                          type: "string",
                          enum: ["INCOMPLETE_TUNNELS_COVERAGE"],
                          description:
                            "Indicates the reason why the VPN connection does not meet the high\navailability redundancy criteria/requirement.\nValid values is INCOMPLETE_TUNNELS_COVERAGE.",
                        },
                      },
                      description:
                        "Describes the high availability requirement state for the VPN connection\nbetween this Cloud VPN gateway and a peer gateway.",
                      additionalProperties: true,
                    },
                    peerExternalGateway: {
                      type: "string",
                      description:
                        "URL reference to the peer external VPN gateways to which the VPN tunnels\nin this VPN connection are connected.\nThis field is mutually exclusive with peer_gcp_gateway.",
                    },
                    peerGcpGateway: {
                      type: "string",
                      description:
                        "URL reference to the peer side VPN gateways to which the VPN tunnels in\nthis VPN connection are connected.\nThis field is mutually exclusive with peer_gcp_gateway.",
                    },
                  },
                  description:
                    "A VPN connection contains all VPN tunnels connected from this VpnGateway\nto the same peer gateway. The peer gateway could either be an external VPN\ngateway or a Google Cloud VPN gateway.",
                  additionalProperties: true,
                },
                description: "List of VPN connection for this VpnGateway.",
              },
            },
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default vpnGatewaysGetStatus;
