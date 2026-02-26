import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Networks - Get",
  description: `Returns the specified Zone resource.`,
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
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.network !== undefined)
          pathParams["network"] = String(input.event.inputConfig.network);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/networks/{network}",
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
          IPv4Range: {
            type: "string",
            description:
              "Deprecated in favor of subnet mode networks. The range of internal addresses that are legal on this network. This range is aCIDR specification, for example:192.168.0.0/16. Provided by the client when the network is created.",
          },
          autoCreateSubnetworks: {
            type: "boolean",
            description:
              "Must be set to create a VPC network. If not set, a legacy network is created.  When set to true, the VPC network is created in auto mode. When set to false, the VPC network is created in custom mode.  An auto mode VPC network starts with one subnet per region. Each subnet has a predetermined range as described inAuto mode VPC network IP ranges.  For custom mode VPC networks, you can add subnets using the subnetworksinsert method.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you create the resource.",
          },
          enableUlaInternalIpv6: {
            type: "boolean",
            description:
              "Enable ULA internal ipv6 on this network. Enabling this feature will assign a /48 from google defined ULA prefix fd20::/20. .",
          },
          firewallPolicy: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the firewall policy the network is associated with.",
          },
          gatewayIPv4: {
            type: "string",
            description:
              "[Output Only] The gateway address for default routing out of the network, selected by Google Cloud.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          internalIpv6Range: {
            type: "string",
            description:
              "When enabling ula internal ipv6, caller optionally can specify the /48 range they want from the google defined ULA prefix fd20::/20. The input must be a valid /48 ULA IPv6 address and must be within the fd20::/20. Operation will fail if the speficied /48 is already in used by another resource. If the field is not speficied, then a /48 range will be randomly allocated from fd20::/20 and returned via this field. .",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#network for networks.",
          },
          mtu: {
            type: "integer",
            description:
              "Maximum Transmission Unit in bytes. The minimum value for this field is 1300 and the maximum value is 8896. The suggested value is 1500, which is the default MTU used on the Internet, or 8896 if you want to use Jumbo frames. If unspecified, the value defaults to 1460.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
          },
          networkFirewallPolicyEnforcementOrder: {
            type: "string",
            description:
              "The network firewall policy enforcement order. Can be either AFTER_CLASSIC_FIREWALL or BEFORE_CLASSIC_FIREWALL. Defaults to AFTER_CLASSIC_FIREWALL if the field is not specified. Check the NetworkFirewallPolicyEnforcementOrder enum for the list of possible values.",
          },
          networkProfile: {
            type: "string",
            description:
              "A full or partial URL of the network profile to apply to this network. This field can be set only at resource creation time. For example, the following are valid URLs:     - https://www.googleapis.com/compute/{api_version}/projects/{project_id}/global/networkProfiles/{network_profile_name}    - projects/{project_id}/global/networkProfiles/{network_profile_name}",
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
                  'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional network parameters.",
            additionalProperties: true,
          },
          peerings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                autoCreateRoutes: {
                  type: "boolean",
                  description:
                    "This field will be deprecated soon. Use theexchange_subnet_routes field instead. Indicates whether full mesh connectivity is created and managed automatically between peered networks. Currently this field should always be true since Google Compute Engine will automatically create and manage subnetwork routes between two networks when peering state isACTIVE.",
                },
                connectionStatus: {
                  type: "object",
                  properties: {
                    consensusState: {
                      type: "object",
                      properties: {
                        deleteStatus: {
                          type: "string",
                          description:
                            "The status of the delete request. Check the DeleteStatus enum for the list of possible values.",
                        },
                        updateStatus: {
                          type: "string",
                          description:
                            "The status of the update request. Check the UpdateStatus enum for the list of possible values.",
                        },
                      },
                      description:
                        "The status of update/delete for a consensus peering connection. Only set when connection_status.update_strategy isCONSENSUS or a network peering is proposing to update the strategy to CONSENSUS.",
                      additionalProperties: true,
                    },
                    trafficConfiguration: {
                      type: "object",
                      properties: {
                        exportCustomRoutesToPeer: {
                          type: "boolean",
                          description:
                            "Whether custom routes are being exported to the peer network.",
                        },
                        exportSubnetRoutesWithPublicIpToPeer: {
                          type: "boolean",
                          description:
                            "Whether subnet routes with public IP ranges are being exported to the peer network.",
                        },
                        importCustomRoutesFromPeer: {
                          type: "boolean",
                          description:
                            "Whether custom routes are being imported from the peer network.",
                        },
                        importSubnetRoutesWithPublicIpFromPeer: {
                          type: "boolean",
                          description:
                            "Whether subnet routes with public IP ranges are being imported from the peer network.",
                        },
                        stackType: {
                          type: "string",
                          description:
                            "Which IP version(s) of traffic and routes are being imported or exported between peer networks. Check the StackType enum for the list of possible values.",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "The active connectivity settings for the peering connection based on the settings of the network peerings.",
                    },
                    updateStrategy: {
                      type: "string",
                      description:
                        "The update strategy determines the update/delete semantics for this peering connection. Check the UpdateStrategy enum for the list of possible values.",
                    },
                  },
                  description:
                    "[Output Only] Describes the state of a peering connection, not just the local peering. This field provides information about the effective settings for the connection as a whole, including pending delete/update requests for CONSENSUS peerings.",
                  additionalProperties: true,
                },
                exchangeSubnetRoutes: {
                  type: "boolean",
                  description:
                    "Indicates whether full mesh connectivity is created and managed automatically between peered networks. Currently this field should always be true since Google Compute Engine will automatically create and manage subnetwork routes between two networks when peering state isACTIVE.",
                },
                exportCustomRoutes: {
                  type: "boolean",
                  description:
                    "Whether to export the custom routes to peer network. The default value is false.",
                },
                exportSubnetRoutesWithPublicIp: {
                  type: "boolean",
                  description:
                    "Whether subnet routes with public IP range are exported. The default value is true, all subnet routes are exported.IPv4 special-use ranges are always exported to peers and are not controlled by this field.",
                },
                importCustomRoutes: {
                  type: "boolean",
                  description:
                    "Whether to import the custom routes from peer network. The default value is false.",
                },
                importSubnetRoutesWithPublicIp: {
                  type: "boolean",
                  description:
                    "Whether subnet routes with public IP range are imported. The default value is false.IPv4 special-use ranges are always imported from peers and are not controlled by this field.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this peering. Provided by the client when the peering is created. The name must comply withRFC1035. Specifically, the name must be 1-63 characters long and match regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all the following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                network: {
                  type: "string",
                  description:
                    "The URL of the peer network. It can be either full URL or partial URL. The peer network may belong to a different project. If the partial URL does not contain project, it is assumed that the peer network is in the same project as the current network.",
                },
                peerMtu: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] Maximum Transmission Unit in bytes of the peer network.",
                },
                stackType: {
                  type: "string",
                  description:
                    "Which IP version(s) of traffic and routes are allowed to be imported or exported between peer networks. The default value is IPV4_ONLY. Check the StackType enum for the list of possible values.",
                },
                state: {
                  type: "string",
                  description:
                    "Output only. [Output Only] State for the peering, either `ACTIVE` or `INACTIVE`. The peering is `ACTIVE` when there's a matching configuration in the peer network. Check the State enum for the list of possible values.",
                },
                stateDetails: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Details about the current state of the peering.",
                },
                updateStrategy: {
                  type: "string",
                  description:
                    "The update strategy determines the semantics for updates and deletes to the peering connection configuration. Check the UpdateStrategy enum for the list of possible values.",
                },
              },
              description:
                "A network peering attached to a network resource. The message includes the peering name, peer network, peering state, and a flag indicating whether Google Compute Engine should automatically create routes for the peering.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] A list of network peerings for the resource.",
          },
          routingConfig: {
            type: "object",
            properties: {
              bgpAlwaysCompareMed: {
                type: "boolean",
                description:
                  "Enable comparison of Multi-Exit Discriminators (MED) across routes with different neighbor ASNs when using the STANDARD BGP best path selection algorithm.",
              },
              bgpBestPathSelectionMode: {
                type: "string",
                description:
                  "The BGP best path selection algorithm to be employed within this network for dynamic routes learned by Cloud Routers. Can be LEGACY (default) or STANDARD. Check the BgpBestPathSelectionMode enum for the list of possible values.",
              },
              bgpInterRegionCost: {
                type: "string",
                description:
                  "Allows to define a preferred approach for handling inter-region cost in the selection process when using the STANDARD BGP best path selection algorithm. Can be DEFAULT orADD_COST_TO_MED. Check the BgpInterRegionCost enum for the list of possible values.",
              },
              effectiveBgpAlwaysCompareMed: {
                type: "boolean",
                description:
                  "Output only. [Output Only] Effective value of the bgp_always_compare_med field.",
              },
              effectiveBgpInterRegionCost: {
                type: "string",
                description:
                  "Output only. [Output Only] Effective value of the bgp_inter_region_cost field. Check the EffectiveBgpInterRegionCost enum for the list of possible values.",
              },
              routingMode: {
                type: "string",
                description:
                  "The network-wide routing mode to use. If set to REGIONAL, this network's Cloud Routers will only advertise routes with subnets of this network in the same region as the router. If set toGLOBAL, this network's Cloud Routers will advertise routes with all subnets of this network, across regions. Check the RoutingMode enum for the list of possible values.",
              },
            },
            description:
              "A routing configuration attached to a network resource. The message includes the list of routers associated with the network, and a flag indicating the type of routing behavior to enforce network-wide.",
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          selfLinkWithId: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource with the resource id.",
          },
          subnetworks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] Server-defined fully-qualified URLs for all subnetworks in this VPC network.",
          },
        },
        description:
          "Represents a VPC Network resource.  Networks connect resources to each other and to the internet. For more information, readVirtual Private Cloud (VPC) Network.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
