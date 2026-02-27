import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const globalAddressesGet: AppBlock = {
  name: "Global Addresses - Get",
  description: `Returns the specified address resource.`,
  category: "Global Addresses",
  inputs: {
    default: {
      config: {
        address: {
          name: "Address",
          description: "Name of the address resource to return.",
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
        let path = `projects/{project}/global/addresses/{address}`;

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
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
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
          prefixLength: {
            type: "integer",
            description:
              "The prefix length if the resource represents an IP range. (Format: int32)",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          purpose: {
            type: "string",
            enum: [
              "DNS_RESOLVER",
              "GCE_ENDPOINT",
              "IPSEC_INTERCONNECT",
              "NAT_AUTO",
              "PRIVATE_SERVICE_CONNECT",
              "SERVERLESS",
              "SHARED_LOADBALANCER_VIP",
              "VPC_PEERING",
            ],
            description:
              "The purpose of this resource, which can be one of the following values:\n   \n   \n     - GCE_ENDPOINT for addresses that are used by VM\n     instances, alias IP ranges, load balancers, and similar resources.\n     - DNS_RESOLVER for a DNS resolver address in a subnetwork\n       for a Cloud DNS  inbound\n       forwarder IP addresses (regional internal IP address in a subnet of\n       a VPC network)\n     - VPC_PEERING for global internal IP addresses used for\n      \n          private services access allocated ranges.\n     - NAT_AUTO for the regional external IP addresses used by\n          Cloud NAT when allocating addresses using\n          \n          automatic NAT IP address allocation.\n     - IPSEC_INTERCONNECT for addresses created from a private\n     IP range that are reserved for a VLAN attachment in an\n     *HA VPN over Cloud Interconnect* configuration. These addresses\n     are regional resources.\n     - `SHARED_LOADBALANCER_VIP` for an internal IP address that is assigned\n     to multiple internal forwarding rules.\n     - `PRIVATE_SERVICE_CONNECT` for a private network address that is\n     used to configure Private Service Connect. Only global internal addresses\n     can use this purpose.",
          },
          ipVersion: {
            type: "string",
            enum: ["IPV4", "IPV6", "UNSPECIFIED_VERSION"],
            description:
              "The IP version that will be used by this address. Valid options areIPV4 or IPV6.",
          },
          users: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] The URLs of the resources that are using this address.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          address: {
            type: "string",
            description: "The static IP address represented by this resource.",
          },
          addressType: {
            type: "string",
            enum: ["EXTERNAL", "INTERNAL", "UNSPECIFIED_TYPE"],
            description:
              "The type of address to reserve, either INTERNAL orEXTERNAL. If unspecified, defaults to EXTERNAL.",
          },
          ipv6EndpointType: {
            type: "string",
            enum: ["NETLB", "VM"],
            description:
              "The endpoint type of this address, which should be VM\nor NETLB. This is used for deciding which type of endpoint\nthis address can be used after the external IPv6 address reservation.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where a regional address resides.\nFor regional addresses, you must specify the region as a path parameter in\nthe HTTP request URL. *This field is not applicable to global\naddresses.*",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you\ncreate the resource.",
          },
          network: {
            type: "string",
            description:
              "The URL of the network in which to reserve the address. This field can\nonly be used with INTERNAL type with theVPC_PEERING purpose.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this Address, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an Address. (Format: byte)",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#address for\naddresses.",
          },
          subnetwork: {
            type: "string",
            description:
              "The URL of the subnetwork in which to reserve the address. If an IP address\nis specified, it must be within the subnetwork's IP range. This field can\nonly be used with INTERNAL type with aGCE_ENDPOINT or DNS_RESOLVER purpose.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character\nmust be a lowercase letter, and all following characters (except for the\nlast character) must be a dash, lowercase letter, or digit. The last\ncharacter must be a lowercase letter or digit.",
          },
          status: {
            type: "string",
            enum: ["IN_USE", "RESERVED", "RESERVING"],
            description:
              "[Output Only] The status of the address, which can be one ofRESERVING, RESERVED, or IN_USE.\nAn address that is RESERVING is currently in the process of\nbeing reserved. A RESERVED address is currently reserved and\navailable to use. An IN_USE address is currently being used\nby another resource and is not available.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          networkTier: {
            type: "string",
            enum: [
              "FIXED_STANDARD",
              "PREMIUM",
              "STANDARD",
              "STANDARD_OVERRIDES_FIXED_STANDARD",
            ],
            description:
              "This signifies the networking tier used for configuring this address and\ncan only take the following values: PREMIUM orSTANDARD. Internal IP addresses are always Premium Tier;\nglobal external IP addresses are always Premium Tier; regional external IP\naddresses can be either Standard or Premium Tier.\n\nIf this field is not specified, it is assumed to be PREMIUM.",
          },
        },
        description:
          "Represents an IP Address resource.\n\nGoogle Compute Engine has two IP Address resources:\n\n* [Global (external and\ninternal)](https://cloud.google.com/compute/docs/reference/rest/v1/globalAddresses)\n* [Regional (external and\ninternal)](https://cloud.google.com/compute/docs/reference/rest/v1/addresses)\n\nFor more information, see\nReserving a static external IP address.",
        additionalProperties: true,
      },
    },
  },
};

export default globalAddressesGet;
