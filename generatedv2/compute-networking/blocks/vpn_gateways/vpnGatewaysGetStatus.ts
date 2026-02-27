import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const vpnGatewaysGetStatus: AppBlock = {
  name: "Vpn Gateways - Get Status",
  description: `Returns the status for the specified VPN gateway.`,
  category: "Vpn Gateways",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
            description: "Name of the region for this request.",
          },
          required: true,
        },
        vpnGateway: {
          name: "Vpn Gateway",
          description: "Name of the VPN gateway to return.",
          type: {
            type: "string",
            description: "Name of the VPN gateway to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.vpnGateway !== undefined)
          pathParams["vpn_gateway"] = String(
            input.event.inputConfig.vpnGateway,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/vpnGateways/{vpn_gateway}/getStatus",
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
        properties: {
          result: {
            type: "object",
            properties: {
              vpnConnections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    peerExternalGateway: {
                      type: "string",
                      description:
                        "Output only. URL reference to the peer external VPN gateways to which the VPN tunnels in this VPN connection are connected. This field is mutually exclusive with peer_gcp_gateway.",
                    },
                    peerGcpGateway: {
                      type: "string",
                      description:
                        "Output only. URL reference to the peer side VPN gateways to which the VPN tunnels in this VPN connection are connected. This field is mutually exclusive with peer_gcp_gateway.",
                    },
                    state: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: [
                            "UNDEFINED_STATE",
                            "CONNECTION_REDUNDANCY_MET",
                            "CONNECTION_REDUNDANCY_NOT_MET",
                          ],
                          description:
                            "Indicates the high availability requirement state for the VPN connection. Valid values are CONNECTION_REDUNDANCY_MET,CONNECTION_REDUNDANCY_NOT_MET. Check the State enum for the list of possible values.",
                        },
                        unsatisfiedReason: {
                          type: "string",
                          enum: [
                            "UNDEFINED_UNSATISFIED_REASON",
                            "INCOMPLETE_TUNNELS_COVERAGE",
                          ],
                          description:
                            "Indicates the reason why the VPN connection does not meet the high availability redundancy criteria/requirement. Valid values is INCOMPLETE_TUNNELS_COVERAGE. Check the UnsatisfiedReason enum for the list of possible values.",
                        },
                      },
                      description:
                        "Describes the high availability requirement state for the VPN connection between this Cloud VPN gateway and a peer gateway.",
                      additionalProperties: true,
                    },
                    tunnels: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          localGatewayInterface: {
                            type: "integer",
                            description:
                              "Output only. The VPN gateway interface this VPN tunnel is associated with.",
                          },
                          peerGatewayInterface: {
                            type: "integer",
                            description:
                              "Output only. The peer gateway interface this VPN tunnel is connected to, the peer gateway could either be an external VPN gateway or a Google Cloud VPN gateway.",
                          },
                          tunnelUrl: {
                            type: "string",
                            description:
                              "Output only. URL reference to the VPN tunnel.",
                          },
                        },
                        description:
                          "Contains some information about a VPN tunnel.",
                        additionalProperties: true,
                      },
                      description:
                        "List of VPN tunnels that are in this VPN connection.",
                    },
                  },
                  description:
                    "A VPN connection contains all VPN tunnels connected from this VpnGateway to the same peer gateway. The peer gateway could either be an external VPN gateway or a Google Cloud VPN gateway.",
                  additionalProperties: true,
                },
                description:
                  "Output only. List of VPN connection for this VpnGateway.",
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
