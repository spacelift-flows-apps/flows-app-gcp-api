import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getRouterStatus: AppBlock = {
  name: "Routers - Get Router Status",
  description: `Retrieves runtime information of the specified router.`,
  category: "Routers",
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
        router: {
          name: "Router",
          description: "Name of the Router resource to query.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.router !== undefined)
          pathParams["router"] = String(input.event.inputConfig.router);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/routers/{router}/getRouterStatus",
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
          kind: {
            type: "string",
            description: "Output only. Type of resource.",
          },
          result: {
            type: "object",
            properties: {
              best_routes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    as_paths: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          as_lists: {
                            type: "array",
                            items: {
                              type: "integer",
                            },
                            description:
                              "[Output Only] The AS numbers of the AS Path.",
                          },
                          path_segment_type: {
                            type: "string",
                            description:
                              "[Output Only] The type of the AS Path, which can be one of the following values: - 'AS_SET': unordered set of autonomous systems that the route in has traversed - 'AS_SEQUENCE': ordered set of autonomous systems that the route has traversed - 'AS_CONFED_SEQUENCE': ordered set of Member Autonomous Systems in the local confederation that the route has traversed - 'AS_CONFED_SET': unordered set of Member Autonomous Systems in the local confederation that the route has traversed Check the PathSegmentType enum for the list of possible values.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "Output only. [Output Only] AS path.",
                    },
                    creation_timestamp: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                    },
                    description: {
                      type: "string",
                      description:
                        "An optional description of this resource. Provide this field when you create the resource.",
                    },
                    dest_range: {
                      type: "string",
                      description:
                        "The destination range of outgoing packets that this route applies to. Both IPv4 and IPv6 are supported. Must specify an IPv4 range (e.g. 192.0.2.0/24) or an IPv6 range in RFC 4291 format (e.g. 2001:db8::/32). IPv6 range will be displayed using RFC 5952 compressed format.",
                    },
                    id: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    kind: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Type of this resource. Always compute#routes for Route resources.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
                    },
                    network: {
                      type: "string",
                      description:
                        "Fully-qualified URL of the network that this route applies to.",
                    },
                    next_hop_gateway: {
                      type: "string",
                      description:
                        "The URL to a gateway that should handle matching packets. You can only specify the internet gateway using a full or partial valid URL: projects/project/global/gateways/default-internet-gateway",
                    },
                    next_hop_hub: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The full resource name of the Network Connectivity Center hub that will handle matching packets.",
                    },
                    next_hop_ilb: {
                      type: "string",
                      description:
                        "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching packets or the IP address of the forwarding Rule. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule    - regions/region/forwardingRules/forwardingRule   If an IP address is provided, must specify an IPv4 address in dot-decimal notation or an IPv6 address in RFC 4291 format. For example, the following are all valid IP addresses:         - 10.128.0.56       - 2001:db8::2d9:51:0:0       - 2001:db8:0:0:2d9:51:0:0   IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    next_hop_instance: {
                      type: "string",
                      description:
                        "The URL to an instance that should handle matching packets. You can specify this as a full or partial URL. For example: https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                    },
                    next_hop_inter_region_cost: {
                      type: "integer",
                      description:
                        "Output only. [Output only] Internal fixed region-to-region cost that Google Cloud calculates based on factors such as network performance, distance, and available bandwidth between regions.",
                    },
                    next_hop_interconnect_attachment: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The URL to an InterconnectAttachment which is the next hop for the route. This field will only be populated for dynamic routes generated by Cloud Router with a linked interconnectAttachment or the static route generated by each L2 Interconnect Attachment.",
                    },
                    next_hop_ip: {
                      type: "string",
                      description:
                        "The network IP address of an instance that should handle matching packets. Both IPv6 address and IPv4 addresses are supported. Must specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or an IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or 2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    next_hop_med: {
                      type: "integer",
                      description:
                        "Output only. [Output Only] Multi-Exit Discriminator, a BGP route metric that indicates the desirability of a particular route in a network.",
                    },
                    next_hop_network: {
                      type: "string",
                      description:
                        "The URL of the local network if it should handle matching packets.",
                    },
                    next_hop_origin: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Indicates the origin of the route. Can be IGP (Interior Gateway Protocol), EGP (Exterior Gateway Protocol), or INCOMPLETE. Check the NextHopOrigin enum for the list of possible values.",
                    },
                    next_hop_peering: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.",
                    },
                    next_hop_vpn_tunnel: {
                      type: "string",
                      description:
                        "The URL to a VpnTunnel that should handle matching packets.",
                    },
                    params: {
                      type: "object",
                      properties: {
                        resource_manager_tags: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
                        },
                      },
                      description: "Additional route parameters.",
                      additionalProperties: true,
                    },
                    priority: {
                      type: "integer",
                      description:
                        "The priority of this route. Priority is used to break ties in cases where there is more than one matching route of equal prefix length. In cases where multiple routes have equal prefix length, the one with the lowest-numbered priority value wins. The default value is `1000`. The priority value must be from `0` to `65535`, inclusive.",
                    },
                    route_status: {
                      type: "string",
                      description:
                        "[Output only] The status of the route. This status applies to dynamic routes learned by Cloud Routers. It is also applicable to routes undergoing migration. Check the RouteStatus enum for the list of possible values.",
                    },
                    route_type: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The type of this route, which can be one of the following values: - 'TRANSIT' for a transit route that this router learned from another Cloud Router and will readvertise to one of its BGP peers - 'SUBNET' for a route from a subnet of the VPC - 'BGP' for a route learned from a BGP peer of this router - 'STATIC' for a static route Check the RouteType enum for the list of possible values.",
                    },
                    self_link: {
                      type: "string",
                      description:
                        "[Output Only] Server-defined fully-qualified URL for this resource.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of instance tags to which this route applies.",
                    },
                    warnings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            description:
                              "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                          },
                          data: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                  description:
                                    "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
                                },
                                value: {
                                  type: "string",
                                  description:
                                    "[Output Only] A warning data value corresponding to the key.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                          },
                          message: {
                            type: "string",
                            description:
                              "[Output Only] A human-readable description of the warning code.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "Output only. [Output Only] If potential misconfigurations are detected for this route, this field will be populated with warning messages.",
                    },
                  },
                  description:
                    "Represents a Route resource.  A route defines a path from VM instances in the VPC network to a specific destination. This destination can be inside or outside the VPC network. For more information, read theRoutes overview.",
                  additionalProperties: true,
                },
                description:
                  "A list of the best dynamic routes for this Cloud Router's Virtual Private Cloud (VPC) network in the same region as this Cloud Router.  Lists all of the best routes per prefix that are programmed into this region's VPC data plane.  When global dynamic routing mode is turned on in the VPC network, this list can include cross-region dynamic routes from Cloud Routers in other regions.",
              },
              best_routes_for_router: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    as_paths: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          as_lists: {
                            type: "array",
                            items: {
                              type: "integer",
                            },
                            description:
                              "[Output Only] The AS numbers of the AS Path.",
                          },
                          path_segment_type: {
                            type: "string",
                            description:
                              "[Output Only] The type of the AS Path, which can be one of the following values: - 'AS_SET': unordered set of autonomous systems that the route in has traversed - 'AS_SEQUENCE': ordered set of autonomous systems that the route has traversed - 'AS_CONFED_SEQUENCE': ordered set of Member Autonomous Systems in the local confederation that the route has traversed - 'AS_CONFED_SET': unordered set of Member Autonomous Systems in the local confederation that the route has traversed Check the PathSegmentType enum for the list of possible values.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "Output only. [Output Only] AS path.",
                    },
                    creation_timestamp: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                    },
                    description: {
                      type: "string",
                      description:
                        "An optional description of this resource. Provide this field when you create the resource.",
                    },
                    dest_range: {
                      type: "string",
                      description:
                        "The destination range of outgoing packets that this route applies to. Both IPv4 and IPv6 are supported. Must specify an IPv4 range (e.g. 192.0.2.0/24) or an IPv6 range in RFC 4291 format (e.g. 2001:db8::/32). IPv6 range will be displayed using RFC 5952 compressed format.",
                    },
                    id: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    kind: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Type of this resource. Always compute#routes for Route resources.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
                    },
                    network: {
                      type: "string",
                      description:
                        "Fully-qualified URL of the network that this route applies to.",
                    },
                    next_hop_gateway: {
                      type: "string",
                      description:
                        "The URL to a gateway that should handle matching packets. You can only specify the internet gateway using a full or partial valid URL: projects/project/global/gateways/default-internet-gateway",
                    },
                    next_hop_hub: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The full resource name of the Network Connectivity Center hub that will handle matching packets.",
                    },
                    next_hop_ilb: {
                      type: "string",
                      description:
                        "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching packets or the IP address of the forwarding Rule. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule    - regions/region/forwardingRules/forwardingRule   If an IP address is provided, must specify an IPv4 address in dot-decimal notation or an IPv6 address in RFC 4291 format. For example, the following are all valid IP addresses:         - 10.128.0.56       - 2001:db8::2d9:51:0:0       - 2001:db8:0:0:2d9:51:0:0   IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    next_hop_instance: {
                      type: "string",
                      description:
                        "The URL to an instance that should handle matching packets. You can specify this as a full or partial URL. For example: https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                    },
                    next_hop_inter_region_cost: {
                      type: "integer",
                      description:
                        "Output only. [Output only] Internal fixed region-to-region cost that Google Cloud calculates based on factors such as network performance, distance, and available bandwidth between regions.",
                    },
                    next_hop_interconnect_attachment: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The URL to an InterconnectAttachment which is the next hop for the route. This field will only be populated for dynamic routes generated by Cloud Router with a linked interconnectAttachment or the static route generated by each L2 Interconnect Attachment.",
                    },
                    next_hop_ip: {
                      type: "string",
                      description:
                        "The network IP address of an instance that should handle matching packets. Both IPv6 address and IPv4 addresses are supported. Must specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or an IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or 2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    next_hop_med: {
                      type: "integer",
                      description:
                        "Output only. [Output Only] Multi-Exit Discriminator, a BGP route metric that indicates the desirability of a particular route in a network.",
                    },
                    next_hop_network: {
                      type: "string",
                      description:
                        "The URL of the local network if it should handle matching packets.",
                    },
                    next_hop_origin: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Indicates the origin of the route. Can be IGP (Interior Gateway Protocol), EGP (Exterior Gateway Protocol), or INCOMPLETE. Check the NextHopOrigin enum for the list of possible values.",
                    },
                    next_hop_peering: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.",
                    },
                    next_hop_vpn_tunnel: {
                      type: "string",
                      description:
                        "The URL to a VpnTunnel that should handle matching packets.",
                    },
                    params: {
                      type: "object",
                      properties: {
                        resource_manager_tags: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
                        },
                      },
                      description: "Additional route parameters.",
                      additionalProperties: true,
                    },
                    priority: {
                      type: "integer",
                      description:
                        "The priority of this route. Priority is used to break ties in cases where there is more than one matching route of equal prefix length. In cases where multiple routes have equal prefix length, the one with the lowest-numbered priority value wins. The default value is `1000`. The priority value must be from `0` to `65535`, inclusive.",
                    },
                    route_status: {
                      type: "string",
                      description:
                        "[Output only] The status of the route. This status applies to dynamic routes learned by Cloud Routers. It is also applicable to routes undergoing migration. Check the RouteStatus enum for the list of possible values.",
                    },
                    route_type: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The type of this route, which can be one of the following values: - 'TRANSIT' for a transit route that this router learned from another Cloud Router and will readvertise to one of its BGP peers - 'SUBNET' for a route from a subnet of the VPC - 'BGP' for a route learned from a BGP peer of this router - 'STATIC' for a static route Check the RouteType enum for the list of possible values.",
                    },
                    self_link: {
                      type: "string",
                      description:
                        "[Output Only] Server-defined fully-qualified URL for this resource.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of instance tags to which this route applies.",
                    },
                    warnings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            description:
                              "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                          },
                          data: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                  description:
                                    "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
                                },
                                value: {
                                  type: "string",
                                  description:
                                    "[Output Only] A warning data value corresponding to the key.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                          },
                          message: {
                            type: "string",
                            description:
                              "[Output Only] A human-readable description of the warning code.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "Output only. [Output Only] If potential misconfigurations are detected for this route, this field will be populated with warning messages.",
                    },
                  },
                  description:
                    "Represents a Route resource.  A route defines a path from VM instances in the VPC network to a specific destination. This destination can be inside or outside the VPC network. For more information, read theRoutes overview.",
                  additionalProperties: true,
                },
                description:
                  "A list of the best BGP routes learned by this Cloud Router.  It is possible that routes listed might not be programmed into the data plane, if the Google Cloud control plane finds a more optimal route for a prefix than a route learned by this Cloud Router.",
              },
              bgp_peer_status: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    advertised_routes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          as_paths: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                as_lists: {
                                  type: "array",
                                  items: {
                                    type: "integer",
                                  },
                                  description:
                                    "[Output Only] The AS numbers of the AS Path.",
                                },
                                path_segment_type: {
                                  type: "string",
                                  description:
                                    "[Output Only] The type of the AS Path, which can be one of the following values: - 'AS_SET': unordered set of autonomous systems that the route in has traversed - 'AS_SEQUENCE': ordered set of autonomous systems that the route has traversed - 'AS_CONFED_SEQUENCE': ordered set of Member Autonomous Systems in the local confederation that the route has traversed - 'AS_CONFED_SET': unordered set of Member Autonomous Systems in the local confederation that the route has traversed Check the PathSegmentType enum for the list of possible values.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description: "Output only. [Output Only] AS path.",
                          },
                          creation_timestamp: {
                            type: "string",
                            description:
                              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                          },
                          description: {
                            type: "string",
                            description:
                              "An optional description of this resource. Provide this field when you create the resource.",
                          },
                          dest_range: {
                            type: "string",
                            description:
                              "The destination range of outgoing packets that this route applies to. Both IPv4 and IPv6 are supported. Must specify an IPv4 range (e.g. 192.0.2.0/24) or an IPv6 range in RFC 4291 format (e.g. 2001:db8::/32). IPv6 range will be displayed using RFC 5952 compressed format.",
                          },
                          id: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          kind: {
                            type: "string",
                            description:
                              "Output only. [Output Only] Type of this resource. Always compute#routes for Route resources.",
                          },
                          name: {
                            type: "string",
                            description:
                              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
                          },
                          network: {
                            type: "string",
                            description:
                              "Fully-qualified URL of the network that this route applies to.",
                          },
                          next_hop_gateway: {
                            type: "string",
                            description:
                              "The URL to a gateway that should handle matching packets. You can only specify the internet gateway using a full or partial valid URL: projects/project/global/gateways/default-internet-gateway",
                          },
                          next_hop_hub: {
                            type: "string",
                            description:
                              "Output only. [Output Only] The full resource name of the Network Connectivity Center hub that will handle matching packets.",
                          },
                          next_hop_ilb: {
                            type: "string",
                            description:
                              "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching packets or the IP address of the forwarding Rule. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule    - regions/region/forwardingRules/forwardingRule   If an IP address is provided, must specify an IPv4 address in dot-decimal notation or an IPv6 address in RFC 4291 format. For example, the following are all valid IP addresses:         - 10.128.0.56       - 2001:db8::2d9:51:0:0       - 2001:db8:0:0:2d9:51:0:0   IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                          },
                          next_hop_instance: {
                            type: "string",
                            description:
                              "The URL to an instance that should handle matching packets. You can specify this as a full or partial URL. For example: https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                          },
                          next_hop_inter_region_cost: {
                            type: "integer",
                            description:
                              "Output only. [Output only] Internal fixed region-to-region cost that Google Cloud calculates based on factors such as network performance, distance, and available bandwidth between regions.",
                          },
                          next_hop_interconnect_attachment: {
                            type: "string",
                            description:
                              "Output only. [Output Only] The URL to an InterconnectAttachment which is the next hop for the route. This field will only be populated for dynamic routes generated by Cloud Router with a linked interconnectAttachment or the static route generated by each L2 Interconnect Attachment.",
                          },
                          next_hop_ip: {
                            type: "string",
                            description:
                              "The network IP address of an instance that should handle matching packets. Both IPv6 address and IPv4 addresses are supported. Must specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or an IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or 2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                          },
                          next_hop_med: {
                            type: "integer",
                            description:
                              "Output only. [Output Only] Multi-Exit Discriminator, a BGP route metric that indicates the desirability of a particular route in a network.",
                          },
                          next_hop_network: {
                            type: "string",
                            description:
                              "The URL of the local network if it should handle matching packets.",
                          },
                          next_hop_origin: {
                            type: "string",
                            description:
                              "Output only. [Output Only] Indicates the origin of the route. Can be IGP (Interior Gateway Protocol), EGP (Exterior Gateway Protocol), or INCOMPLETE. Check the NextHopOrigin enum for the list of possible values.",
                          },
                          next_hop_peering: {
                            type: "string",
                            description:
                              "Output only. [Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.",
                          },
                          next_hop_vpn_tunnel: {
                            type: "string",
                            description:
                              "The URL to a VpnTunnel that should handle matching packets.",
                          },
                          params: {
                            type: "object",
                            properties: {
                              resource_manager_tags: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
                              },
                            },
                            description: "Additional route parameters.",
                            additionalProperties: true,
                          },
                          priority: {
                            type: "integer",
                            description:
                              "The priority of this route. Priority is used to break ties in cases where there is more than one matching route of equal prefix length. In cases where multiple routes have equal prefix length, the one with the lowest-numbered priority value wins. The default value is `1000`. The priority value must be from `0` to `65535`, inclusive.",
                          },
                          route_status: {
                            type: "string",
                            description:
                              "[Output only] The status of the route. This status applies to dynamic routes learned by Cloud Routers. It is also applicable to routes undergoing migration. Check the RouteStatus enum for the list of possible values.",
                          },
                          route_type: {
                            type: "string",
                            description:
                              "Output only. [Output Only] The type of this route, which can be one of the following values: - 'TRANSIT' for a transit route that this router learned from another Cloud Router and will readvertise to one of its BGP peers - 'SUBNET' for a route from a subnet of the VPC - 'BGP' for a route learned from a BGP peer of this router - 'STATIC' for a static route Check the RouteType enum for the list of possible values.",
                          },
                          self_link: {
                            type: "string",
                            description:
                              "[Output Only] Server-defined fully-qualified URL for this resource.",
                          },
                          tags: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of instance tags to which this route applies.",
                          },
                          warnings: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                code: {
                                  type: "string",
                                  description:
                                    "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                                },
                                data: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      key: {
                                        type: "string",
                                        description:
                                          "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
                                      },
                                      value: {
                                        type: "string",
                                        description:
                                          "[Output Only] A warning data value corresponding to the key.",
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  description:
                                    '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                                },
                                message: {
                                  type: "string",
                                  description:
                                    "[Output Only] A human-readable description of the warning code.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "Output only. [Output Only] If potential misconfigurations are detected for this route, this field will be populated with warning messages.",
                          },
                        },
                        description:
                          "Represents a Route resource.  A route defines a path from VM instances in the VPC network to a specific destination. This destination can be inside or outside the VPC network. For more information, read theRoutes overview.",
                        additionalProperties: true,
                      },
                      description:
                        "Routes that were advertised to the remote BGP peer",
                    },
                    bfd_status: {
                      type: "object",
                      properties: {
                        bfd_session_initialization_mode: {
                          type: "string",
                          description:
                            "The BFD session initialization mode for this BGP peer. If set to ACTIVE, the Cloud Router will initiate the BFD session for this BGP peer. If set to PASSIVE, the Cloud Router will wait for the peer router to initiate the BFD session for this BGP peer. If set to DISABLED, BFD is disabled for this BGP peer. Check the BfdSessionInitializationMode enum for the list of possible values.",
                        },
                        config_update_timestamp_micros: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        control_packet_counts: {
                          type: "object",
                          properties: {
                            num_rx: {
                              type: "integer",
                              description:
                                "Number of packets received since the beginning of the current BFD session.",
                            },
                            num_rx_rejected: {
                              type: "integer",
                              description:
                                "Number of packets received that were rejected because of errors since the beginning of the current BFD session.",
                            },
                            num_rx_successful: {
                              type: "integer",
                              description:
                                "Number of packets received that were successfully processed since the beginning of the current BFD session.",
                            },
                            num_tx: {
                              type: "integer",
                              description:
                                "Number of packets transmitted since the beginning of the current BFD session.",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "Control packet counts for the current BFD session.",
                        },
                        control_packet_intervals: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              avg_ms: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              duration: {
                                type: "string",
                                description:
                                  "From how long ago in the past these intervals were observed. Check the Duration enum for the list of possible values.",
                              },
                              max_ms: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              min_ms: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              num_intervals: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              type: {
                                type: "string",
                                description:
                                  "The type of packets for which inter-packet intervals were computed. Check the Type enum for the list of possible values.",
                              },
                            },
                            description: "Next free: 7",
                            additionalProperties: true,
                          },
                          description:
                            "Inter-packet time interval statistics for control packets.",
                        },
                        local_diagnostic: {
                          type: "string",
                          description:
                            "The diagnostic code specifies the local system's reason for the last change in session state. This allows remote systems to determine the reason that the previous session failed, for example. These diagnostic codes are specified in section 4.1 ofRFC5880 Check the LocalDiagnostic enum for the list of possible values.",
                        },
                        local_state: {
                          type: "string",
                          description:
                            "The current BFD session state as seen by the transmitting system. These states are specified in section 4.1 ofRFC5880 Check the LocalState enum for the list of possible values.",
                        },
                        negotiated_local_control_tx_interval_ms: {
                          type: "integer",
                          description:
                            "Negotiated transmit interval for control packets.",
                        },
                        rx_packet: {
                          type: "object",
                          properties: {
                            authentication_present: {
                              type: "boolean",
                              description:
                                "The Authentication Present bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            control_plane_independent: {
                              type: "boolean",
                              description:
                                "The Control Plane Independent bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            demand: {
                              type: "boolean",
                              description:
                                "The demand bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            diagnostic: {
                              type: "string",
                              description:
                                "The diagnostic code specifies the local system's reason for the last change in session state. This allows remote systems to determine the reason that the previous session failed, for example. These diagnostic codes are specified in section 4.1 ofRFC5880 Check the Diagnostic enum for the list of possible values.",
                            },
                            final: {
                              type: "boolean",
                              description:
                                "The Final bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            length: {
                              type: "integer",
                              description:
                                "The length of the BFD Control packet in bytes. This is specified in section 4.1 ofRFC5880",
                            },
                            min_echo_rx_interval_ms: {
                              type: "integer",
                              description:
                                "The Required Min Echo RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            min_rx_interval_ms: {
                              type: "integer",
                              description:
                                "The Required Min RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            min_tx_interval_ms: {
                              type: "integer",
                              description:
                                "The Desired Min TX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            multiplier: {
                              type: "integer",
                              description:
                                "The detection time multiplier of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            multipoint: {
                              type: "boolean",
                              description:
                                "The multipoint bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            my_discriminator: {
                              type: "integer",
                              description:
                                "The My Discriminator value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            poll: {
                              type: "boolean",
                              description:
                                "The Poll bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            state: {
                              type: "string",
                              description:
                                "The current BFD session state as seen by the transmitting system. These states are specified in section 4.1 ofRFC5880 Check the State enum for the list of possible values.",
                            },
                            version: {
                              type: "integer",
                              description:
                                "The version number of the BFD protocol, as specified in section 4.1 ofRFC5880.",
                            },
                            your_discriminator: {
                              type: "integer",
                              description:
                                "The Your Discriminator value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "The most recent Rx control packet for this BFD session.",
                        },
                        tx_packet: {
                          type: "object",
                          properties: {
                            authentication_present: {
                              type: "boolean",
                              description:
                                "The Authentication Present bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            control_plane_independent: {
                              type: "boolean",
                              description:
                                "The Control Plane Independent bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            demand: {
                              type: "boolean",
                              description:
                                "The demand bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            diagnostic: {
                              type: "string",
                              description:
                                "The diagnostic code specifies the local system's reason for the last change in session state. This allows remote systems to determine the reason that the previous session failed, for example. These diagnostic codes are specified in section 4.1 ofRFC5880 Check the Diagnostic enum for the list of possible values.",
                            },
                            final: {
                              type: "boolean",
                              description:
                                "The Final bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            length: {
                              type: "integer",
                              description:
                                "The length of the BFD Control packet in bytes. This is specified in section 4.1 ofRFC5880",
                            },
                            min_echo_rx_interval_ms: {
                              type: "integer",
                              description:
                                "The Required Min Echo RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            min_rx_interval_ms: {
                              type: "integer",
                              description:
                                "The Required Min RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            min_tx_interval_ms: {
                              type: "integer",
                              description:
                                "The Desired Min TX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            multiplier: {
                              type: "integer",
                              description:
                                "The detection time multiplier of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            multipoint: {
                              type: "boolean",
                              description:
                                "The multipoint bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            my_discriminator: {
                              type: "integer",
                              description:
                                "The My Discriminator value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            poll: {
                              type: "boolean",
                              description:
                                "The Poll bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            state: {
                              type: "string",
                              description:
                                "The current BFD session state as seen by the transmitting system. These states are specified in section 4.1 ofRFC5880 Check the State enum for the list of possible values.",
                            },
                            version: {
                              type: "integer",
                              description:
                                "The version number of the BFD protocol, as specified in section 4.1 ofRFC5880.",
                            },
                            your_discriminator: {
                              type: "integer",
                              description:
                                "The Your Discriminator value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "The most recent Tx control packet for this BFD session.",
                        },
                        uptime_ms: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      description: "Next free: 15",
                      additionalProperties: true,
                    },
                    enable_ipv4: {
                      type: "boolean",
                      description:
                        "Output only. Enable IPv4 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 4.",
                    },
                    enable_ipv6: {
                      type: "boolean",
                      description:
                        "Output only. Enable IPv6 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 6.",
                    },
                    ip_address: {
                      type: "string",
                      description:
                        "Output only. IP address of the local BGP interface.",
                    },
                    ipv4_nexthop_address: {
                      type: "string",
                      description:
                        "Output only. IPv4 address of the local BGP interface.",
                    },
                    ipv6_nexthop_address: {
                      type: "string",
                      description:
                        "Output only. IPv6 address of the local BGP interface.",
                    },
                    linked_vpn_tunnel: {
                      type: "string",
                      description:
                        "Output only. URL of the VPN tunnel that this BGP peer controls.",
                    },
                    md5_auth_enabled: {
                      type: "boolean",
                      description:
                        "Informs whether MD5 authentication is enabled on this BGP peer.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Output only. Name of this BGP peer. Unique within the Routers resource.",
                    },
                    num_learned_routes: {
                      type: "integer",
                      description:
                        "Output only. Number of routes learned from the remote BGP Peer.",
                    },
                    peer_ip_address: {
                      type: "string",
                      description:
                        "Output only. IP address of the remote BGP interface.",
                    },
                    peer_ipv4_nexthop_address: {
                      type: "string",
                      description:
                        "Output only. IPv4 address of the remote BGP interface.",
                    },
                    peer_ipv6_nexthop_address: {
                      type: "string",
                      description:
                        "Output only. IPv6 address of the remote BGP interface.",
                    },
                    router_appliance_instance: {
                      type: "string",
                      description:
                        "Output only. [Output only] URI of the VM instance that is used as third-party router appliances such as Next Gen Firewalls, Virtual Routers, or Router Appliances. The VM instance is the peer side of the BGP session.",
                    },
                    state: {
                      type: "string",
                      description:
                        "Output only. The state of the BGP session. For a list of possible values for this field, seeBGP session states.",
                    },
                    status: {
                      type: "string",
                      description:
                        "Output only. Status of the BGP peer: {UP, DOWN} Check the Status enum for the list of possible values.",
                    },
                    status_reason: {
                      type: "string",
                      description:
                        "Indicates why particular status was returned. Check the StatusReason enum for the list of possible values.",
                    },
                    uptime: {
                      type: "string",
                      description:
                        "Output only. Time this session has been up. Format:  14 years, 51 weeks, 6 days, 23 hours, 59 minutes, 59 seconds",
                    },
                    uptime_seconds: {
                      type: "string",
                      description:
                        "Output only. Time this session has been up, in seconds. Format:  145",
                    },
                  },
                  additionalProperties: true,
                },
              },
              nat_status: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    auto_allocated_nat_ips: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Output only. A list of IPs auto-allocated for NAT. Example: ["1.1.1.1", "129.2.16.89"]',
                    },
                    drain_auto_allocated_nat_ips: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Output only. A list of IPs auto-allocated for NAT that are in drain mode. Example: ["1.1.1.1", "179.12.26.133"].',
                    },
                    drain_user_allocated_nat_ips: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Output only. A list of IPs user-allocated for NAT that are in drain mode. Example: ["1.1.1.1", "179.12.26.133"].',
                    },
                    min_extra_nat_ips_needed: {
                      type: "integer",
                      description:
                        "Output only. The number of extra IPs to allocate. This will be greater than 0 only if user-specified IPs are NOT enough to allow all configured VMs to use NAT. This value is meaningful only when auto-allocation of NAT IPs is *not* used.",
                    },
                    name: {
                      type: "string",
                      description: "Output only. Unique name of this NAT.",
                    },
                    num_vm_endpoints_with_nat_mappings: {
                      type: "integer",
                      description:
                        "Output only. Number of VM endpoints (i.e., Nics) that can use NAT.",
                    },
                    rule_status: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          active_nat_ips: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Output only. A list of active IPs for NAT. Example: ["1.1.1.1", "179.12.26.133"].',
                          },
                          drain_nat_ips: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Output only. A list of IPs for NAT that are in drain mode. Example: ["1.1.1.1", "179.12.26.133"].',
                          },
                          min_extra_ips_needed: {
                            type: "integer",
                            description:
                              "Output only. The number of extra IPs to allocate. This will be greater than 0 only if the existing IPs in this NAT Rule are NOT enough to allow all configured VMs to use NAT.",
                          },
                          num_vm_endpoints_with_nat_mappings: {
                            type: "integer",
                            description:
                              "Output only. Number of VM endpoints (i.e., NICs) that have NAT Mappings from this NAT Rule.",
                          },
                          rule_number: {
                            type: "integer",
                            description:
                              "Output only. Rule number of the rule.",
                          },
                        },
                        description:
                          "Status of a NAT Rule contained in this NAT.",
                        additionalProperties: true,
                      },
                      description: "Status of rules in this NAT.",
                    },
                    user_allocated_nat_ip_resources: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Output only. A list of fully qualified URLs of reserved IP address resources.",
                    },
                    user_allocated_nat_ips: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Output only. A list of IPs user-allocated for NAT. They will be raw IP strings like "179.12.26.133".',
                    },
                  },
                  description: "Status of a NAT contained in this router.",
                  additionalProperties: true,
                },
              },
              network: {
                type: "string",
                description: "URI of the network to which this router belongs.",
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

export default getRouterStatus;
