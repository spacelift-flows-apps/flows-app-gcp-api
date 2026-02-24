import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const externalVpnGatewaysGet: AppBlock = {
  name: "External VPN Gateways - Get",
  description: `Returns the specified externalVpnGateway.`,
  category: "External VPN Gateways",
  inputs: {
    default: {
      config: {
        externalVpnGateway: {
          name: "External VPN Gateway",
          description: "Name of the externalVpnGateway to return.",
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
        let path = `projects/{project}/global/externalVpnGateways/{externalVpnGateway}`;

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
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#externalVpnGateway for externalVpnGateways.",
          },
          redundancyType: {
            type: "string",
            enum: [
              "FOUR_IPS_REDUNDANCY",
              "SINGLE_IP_INTERNALLY_REDUNDANT",
              "TWO_IPS_REDUNDANCY",
            ],
            description:
              "Indicates the user-supplied redundancy type of this external VPN gateway.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
          },
          interfaces: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  description:
                    "The numeric ID of this interface.\nThe allowed input values for this id for different redundancy types of\nexternal VPN gateway:\n   \n   - SINGLE_IP_INTERNALLY_REDUNDANT - 0\n   - TWO_IPS_REDUNDANCY - 0, 1\n   - FOUR_IPS_REDUNDANCY - 0, 1, 2, 3 (Format: uint32)",
                },
                ipv6Address: {
                  type: "string",
                  description:
                    "IPv6 address of the interface in the external VPN gateway. This IPv6\naddress can be either from your on-premise gateway or another Cloud\nprovider's VPN gateway, it cannot be an IP address from Google Compute\nEngine. Must specify an IPv6 address (not IPV4-mapped) using any format\ndescribed in RFC 4291 (e.g. 2001:db8:0:0:2d9:51:0:0). The output format\nis RFC 5952 format (e.g. 2001:db8::2d9:51:0:0).",
                },
                ipAddress: {
                  type: "string",
                  description:
                    "IP address of the interface in the external VPN gateway. Only IPv4 is\nsupported. This IP address can be either from your on-premise gateway or\nanother Cloud provider's VPN gateway, it cannot be an IP address from\nGoogle Compute Engine.",
                },
              },
              description: "The interface for the external VPN gateway.",
              additionalProperties: true,
            },
            description:
              "A list of interfaces for this external VPN gateway.\n\nIf your peer-side gateway is an on-premises gateway and non-AWS cloud\nproviders' gateway, at most two interfaces can be provided for an external\nVPN gateway. If your peer side is an AWS virtual private gateway, four\ninterfaces should be provided for an external VPN gateway.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this ExternalVpnGateway,\nwhich is essentially a hash of the labels set used for optimistic locking.\nThe fingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an ExternalVpnGateway. (Format: byte)",
          },
        },
        description:
          "Represents an external VPN gateway.\n\nExternal VPN gateway is the on-premises VPN gateway(s) or another cloud\nprovider's VPN gateway that connects to your Google Cloud VPN gateway.\n\nTo create a highly available VPN from Google Cloud Platform to your\nVPN gateway or another cloud provider's VPN gateway, you must create a\nexternal VPN gateway resource with information about the other gateway.\n\nFor more information about using external VPN gateways, see\nCreating an HA VPN gateway and tunnel pair to a peer VPN.",
        additionalProperties: true,
      },
    },
  },
};

export default externalVpnGatewaysGet;
