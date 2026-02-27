import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const networksGet: AppBlock = {
  name: "Networks - Get",
  description: `Returns the specified network.`,
  category: "Networks",
  inputs: {
    default: {
      config: {
        network: {
          name: "Network",
          description: "Name of the network to return.",
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
        let path = `projects/{project}/global/networks/{network}`;

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
          internalIpv6Range: {
            type: "string",
            description:
              "When enabling ula internal ipv6, caller optionally can specify the /48\nrange they want from the google defined ULA prefix fd20::/20. The input\nmust be a valid /48 ULA IPv6 address and must be within the fd20::/20.\nOperation will fail if the speficied /48 is already in used by another\nresource. If the field is not speficied, then a /48 range will be randomly\nallocated from fd20::/20 and returned via this field.\n.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#network for\nnetworks.",
          },
          selfLinkWithId: {
            type: "string",
            description:
              "[Output Only] Server-defined URL for this resource with the resource id.",
          },
          autoCreateSubnetworks: {
            type: "boolean",
            description:
              "Must be set to create a VPC network. If not set, a legacy network is\ncreated.\n\nWhen set to true, the VPC network is created in auto mode.\nWhen set to false, the VPC network is created in custom mode.\n\nAn auto mode VPC network starts with one subnet per region. Each subnet\nhas a predetermined range as described inAuto mode VPC network IP ranges.\n\nFor custom mode VPC networks, you can add subnets using the subnetworksinsert\nmethod.",
          },
          params: {
            type: "object",
            properties: {
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional network parameters.",
            additionalProperties: true,
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          mtu: {
            type: "integer",
            description:
              "Maximum Transmission Unit in bytes.\nThe minimum value for this field is 1300 and the maximum value is 8896.\nThe suggested value is 1500, which is the default MTU used on the\nInternet, or 8896 if you want to use Jumbo frames. If unspecified, the\nvalue defaults to 1460. (Format: int32)",
          },
          subnetworks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] Server-defined fully-qualified URLs for all subnetworks\nin this VPC network.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you\ncreate the resource.",
          },
          networkFirewallPolicyEnforcementOrder: {
            type: "string",
            enum: ["AFTER_CLASSIC_FIREWALL", "BEFORE_CLASSIC_FIREWALL"],
            description:
              "The network firewall policy enforcement order. Can be either\nAFTER_CLASSIC_FIREWALL or BEFORE_CLASSIC_FIREWALL. Defaults to\nAFTER_CLASSIC_FIREWALL if the field is not specified.",
          },
          gatewayIPv4: {
            type: "string",
            description:
              "[Output Only] The gateway address for default routing out of the network,\nselected by Google Cloud.",
          },
          peerings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                updateStrategy: {
                  type: "string",
                  enum: ["CONSENSUS", "INDEPENDENT", "UNSPECIFIED"],
                  description:
                    "The update strategy determines the semantics for updates and deletes to the\npeering connection configuration.",
                },
                state: {
                  type: "string",
                  enum: ["ACTIVE", "INACTIVE"],
                  description:
                    "[Output Only] State for the peering, either `ACTIVE` or `INACTIVE`. The\npeering is `ACTIVE` when there's a matching configuration in the peer\nnetwork.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this peering. Provided by the client when the peering is created.\nThe name must comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all the following characters must be a dash,\nlowercase letter, or digit, except the last character, which cannot be a\ndash.",
                },
                network: {
                  type: "string",
                  description:
                    "The URL of the peer network. It can be either full URL or partial URL. The\npeer network may belong to a different project. If the partial URL does not\ncontain project, it is assumed that the peer network is in the same project\nas the current network.",
                },
                exportCustomRoutes: {
                  type: "boolean",
                  description:
                    "Whether to export the custom routes to peer network. The default value is\nfalse.",
                },
                autoCreateRoutes: {
                  type: "boolean",
                  description:
                    "This field will be deprecated soon. Use theexchange_subnet_routes field instead.\nIndicates whether full mesh connectivity is created and managed\nautomatically between peered networks. Currently this field should always\nbe true since Google Compute Engine will automatically create and manage\nsubnetwork routes between two networks when peering state isACTIVE.",
                },
                importSubnetRoutesWithPublicIp: {
                  type: "boolean",
                  description:
                    "Whether subnet routes with public IP range are imported. The default value\nis false.IPv4\nspecial-use ranges are always\nimported from peers and are not controlled by this field.",
                },
                importCustomRoutes: {
                  type: "boolean",
                  description:
                    "Whether to import the custom routes from peer network. The default value is\nfalse.",
                },
                connectionStatus: {
                  type: "object",
                  properties: {
                    consensusState: {
                      type: "object",
                      properties: {
                        updateStatus: {
                          type: "string",
                          enum: [
                            "IN_SYNC",
                            "PENDING_LOCAL_ACKNOWLEDMENT",
                            "PENDING_PEER_ACKNOWLEDGEMENT",
                            "UPDATE_STATUS_UNSPECIFIED",
                          ],
                          description: "The status of the update request.",
                        },
                        deleteStatus: {
                          type: "string",
                          enum: [
                            "DELETE_ACKNOWLEDGED",
                            "DELETE_STATUS_UNSPECIFIED",
                            "LOCAL_DELETE_REQUESTED",
                            "PEER_DELETE_REQUESTED",
                          ],
                          description: "The status of the delete request.",
                        },
                      },
                      description:
                        "The status of update/delete for a consensus peering connection. Only set\nwhen connection_status.update_strategy isCONSENSUS or a network peering is proposing to update the\nstrategy to CONSENSUS.",
                      additionalProperties: true,
                    },
                    updateStrategy: {
                      type: "string",
                      enum: ["CONSENSUS", "INDEPENDENT", "UNSPECIFIED"],
                      description:
                        "The update strategy determines the update/delete semantics for this\npeering connection.",
                    },
                    trafficConfiguration: {
                      type: "object",
                      properties: {
                        stackType: {
                          type: "string",
                          enum: ["IPV4_IPV6", "IPV4_ONLY"],
                          description:
                            "Which IP version(s) of traffic and routes are being imported or\nexported between peer networks.",
                        },
                        importSubnetRoutesWithPublicIpFromPeer: {
                          type: "boolean",
                          description:
                            "Whether subnet routes with public IP ranges are being imported\nfrom the peer network.",
                        },
                        exportCustomRoutesToPeer: {
                          type: "boolean",
                          description:
                            "Whether custom routes are being exported to the peer network.",
                        },
                        importCustomRoutesFromPeer: {
                          type: "boolean",
                          description:
                            "Whether custom routes are being imported from the peer network.",
                        },
                        exportSubnetRoutesWithPublicIpToPeer: {
                          type: "boolean",
                          description:
                            "Whether subnet routes with public IP ranges are being exported to the\npeer network.",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  description:
                    "[Output Only] Describes the state of a peering connection, not just the\nlocal peering. This field provides information about the effective settings\nfor the connection as a whole, including pending delete/update requests for\nCONSENSUS peerings.",
                  additionalProperties: true,
                },
                stackType: {
                  type: "string",
                  enum: ["IPV4_IPV6", "IPV4_ONLY"],
                  description:
                    "Which IP version(s) of traffic and routes are allowed to be imported or\nexported between peer networks. The default value is IPV4_ONLY.",
                },
                stateDetails: {
                  type: "string",
                  description:
                    "[Output Only] Details about the current state of the peering.",
                },
                exchangeSubnetRoutes: {
                  type: "boolean",
                  description:
                    "Indicates whether full mesh connectivity is created and managed\nautomatically between peered networks. Currently this field should always\nbe true since Google Compute Engine will automatically create and manage\nsubnetwork routes between two networks when peering state isACTIVE.",
                },
                exportSubnetRoutesWithPublicIp: {
                  type: "boolean",
                  description:
                    "Whether subnet routes with public IP range are exported. The default value\nis true, all subnet routes are exported.IPv4\nspecial-use ranges are always\nexported to peers and are not controlled by this field.",
                },
                peerMtu: {
                  type: "integer",
                  description:
                    "[Output Only] Maximum Transmission Unit in bytes of the peer network. (Format: int32)",
                },
              },
              description:
                "A network peering attached to a network resource. The message includes the\npeering name, peer network, peering state, and a flag indicating whether\nGoogle Compute Engine should automatically create routes for the peering.",
              additionalProperties: true,
            },
            description:
              "[Output Only] A list of network peerings for the resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          firewallPolicy: {
            type: "string",
            description:
              "[Output Only] URL of the firewall policy the network is associated with.",
          },
          routingConfig: {
            type: "object",
            properties: {
              bgpBestPathSelectionMode: {
                type: "string",
                enum: ["LEGACY", "STANDARD"],
                description:
                  "The BGP best path selection algorithm to be employed within this network\nfor dynamic routes learned by Cloud Routers. Can be LEGACY\n(default) or STANDARD.",
              },
              bgpInterRegionCost: {
                type: "string",
                enum: ["ADD_COST_TO_MED", "DEFAULT"],
                description:
                  "Allows to define a preferred approach for handling inter-region cost in\nthe selection process when using the STANDARD BGP best path\nselection algorithm. Can be DEFAULT orADD_COST_TO_MED.",
              },
              effectiveBgpAlwaysCompareMed: {
                type: "boolean",
                description:
                  "[Output Only] Effective value of the bgp_always_compare_med\nfield.",
              },
              effectiveBgpInterRegionCost: {
                type: "string",
                enum: ["ADD_COST_TO_MED", "DEFAULT"],
                description:
                  "[Output Only] Effective value of the bgp_inter_region_cost\nfield.",
              },
              routingMode: {
                type: "string",
                enum: ["GLOBAL", "REGIONAL"],
                description:
                  "The network-wide routing mode to use. If set to REGIONAL,\nthis network's Cloud Routers will only advertise routes with subnets\nof this network in the same region as the router. If set toGLOBAL, this network's Cloud Routers will advertise\nroutes with all subnets of this network, across regions.",
              },
              bgpAlwaysCompareMed: {
                type: "boolean",
                description:
                  "Enable comparison of Multi-Exit Discriminators (MED) across routes with\ndifferent neighbor ASNs when using the STANDARD BGP best path selection\nalgorithm.",
              },
            },
            description:
              "A routing configuration attached to a network resource. The message\nincludes the list of routers associated with the network, and a flag\nindicating the type of routing behavior to enforce network-wide.",
            additionalProperties: true,
          },
          IPv4Range: {
            type: "string",
            description:
              "Deprecated in favor of subnet mode networks.\nThe range of internal addresses that are legal on this network. This\nrange is aCIDR specification, for example:192.168.0.0/16. Provided by the client when the network is\ncreated.",
          },
          networkProfile: {
            type: "string",
            description:
              "A full or partial URL of the network profile to apply to this network.\nThis field can be set only at resource creation time. For example, the\nfollowing are valid URLs: \n   \n   - https://www.googleapis.com/compute/{api_version}/projects/{project_id}/global/networkProfiles/{network_profile_name}\n   - projects/{project_id}/global/networkProfiles/{network_profile_name}",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all following characters (except for the last\ncharacter) must be a dash, lowercase letter, or digit. The last character\nmust be a lowercase letter or digit.",
          },
          enableUlaInternalIpv6: {
            type: "boolean",
            description:
              "Enable ULA internal ipv6 on this network. Enabling this feature will assign\na /48 from google defined ULA prefix fd20::/20.\n.",
          },
        },
        description:
          "Represents a VPC Network resource.\n\nNetworks connect resources to each other and to the internet. For more\ninformation, readVirtual Private Cloud (VPC) Network.",
        additionalProperties: true,
      },
    },
  },
};

export default networksGet;
