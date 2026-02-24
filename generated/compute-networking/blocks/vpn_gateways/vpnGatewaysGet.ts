import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const vpnGatewaysGet: AppBlock = {
  name: "VPN Gateways - Get",
  description: `Returns the specified VPN gateway.`,
  category: "VPN Gateways",
  inputs: {
    default: {
      config: {
        vpnGateway: {
          name: "VPN Gateway",
          description: "Name of the VPN gateway to return.",
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
        let path = `projects/{project}/regions/{region}/vpnGateways/{vpnGateway}`;

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
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          gatewayIpVersion: {
            type: "string",
            enum: ["IPV4", "IPV6"],
            description:
              "The IP family of the gateway IPs for the HA-VPN gateway interfaces. If not\nspecified, IPV4 will be used.",
          },
          vpnInterfaces: {
            type: "array",
            items: {
              type: "object",
              properties: {
                interconnectAttachment: {
                  type: "string",
                  description:
                    "URL of the VLAN attachment (interconnectAttachment) resource for this\nVPN gateway interface. When the value of this field is present, the VPN\ngateway is used for HA VPN over Cloud Interconnect; all egress\nor ingress traffic for this VPN gateway interface goes through the\nspecified VLAN attachment resource.",
                },
                ipAddress: {
                  type: "string",
                  description:
                    "[Output Only] IP address for this VPN interface associated with the VPN\ngateway.\nThe IP address could be either a regional external IP address or\na regional internal IP address. The two IP addresses for a VPN gateway\nmust be all regional external or regional internal IP addresses. There\ncannot be a mix of regional external IP addresses and regional internal\nIP addresses. For HA VPN over Cloud Interconnect, the IP addresses\nfor both interfaces could either be regional internal IP addresses or\nregional external IP addresses. For regular (non HA VPN over Cloud\nInterconnect) HA VPN tunnels, the IP address must be a regional external\nIP address.",
                },
                id: {
                  type: "integer",
                  description:
                    "[Output Only] Numeric identifier for this VPN interface associated with\nthe VPN gateway. (Format: uint32)",
                },
                ipv6Address: {
                  type: "string",
                  description:
                    "[Output Only] IPv6 address for this VPN interface associated with the VPN\ngateway.\nThe IPv6 address must be a regional external IPv6 address. The format is\nRFC 5952 format (e.g. 2001:db8::2d9:51:0:0).",
                },
              },
              description: "A VPN gateway interface.",
              additionalProperties: true,
            },
            description:
              "The list of VPN interfaces associated with this VPN gateway.",
          },
          stackType: {
            type: "string",
            enum: ["IPV4_IPV6", "IPV4_ONLY", "IPV6_ONLY"],
            description:
              "The stack type for this VPN gateway to identify the IP protocols that are\nenabled. Possible values are: IPV4_ONLY,IPV4_IPV6, IPV6_ONLY. If not specified,IPV4_ONLY is used if the gateway IP version isIPV4, or IPV4_IPV6 if the gateway IP version isIPV6.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the VPN gateway resides.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#vpnGateway for\nVPN gateways.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this VpnGateway, which\nis essentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a VpnGateway. (Format: byte)",
          },
          network: {
            type: "string",
            description:
              "URL of the network to which this VPN gateway is attached. Provided by the\nclient when the VPN gateway is created.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
          },
        },
        description:
          "Represents a HA VPN gateway.\n\nHA VPN is a high-availability (HA) Cloud VPN solution that lets you securely\nconnect your on-premises network to your Google Cloud Virtual Private Cloud\nnetwork through an IPsec VPN connection in a single region.\nFor more information about Cloud HA VPN solutions, see\nCloud VPN topologies .",
        additionalProperties: true,
      },
    },
  },
};

export default vpnGatewaysGet;
