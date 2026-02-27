import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const routersGetRouterStatus: AppBlock = {
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
            description: "Name of the region for this request.",
          },
          required: true,
        },
        router: {
          name: "Router",
          description: "Name of the Router resource to query.",
          type: {
            type: "string",
            description: "Name of the Router resource to query.",
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
              bestRoutes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    asPaths: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          asLists: {
                            type: "array",
                            items: {
                              type: "integer",
                            },
                            description:
                              "[Output Only] The AS numbers of the AS Path.",
                          },
                          pathSegmentType: {
                            type: "string",
                            enum: [
                              "UNDEFINED_PATH_SEGMENT_TYPE",
                              "AS_CONFED_SEQUENCE",
                              "AS_CONFED_SET",
                              "AS_SEQUENCE",
                              "AS_SET",
                            ],
                            description:
                              "[Output Only] The type of the AS Path, which can be one of the following values: - 'AS_SET': unordered set of autonomous systems that the route in has traversed - 'AS_SEQUENCE': ordered set of autonomous systems that the route has traversed - 'AS_CONFED_SEQUENCE': ordered set of Member Autonomous Systems in the local confederation that the route has traversed - 'AS_CONFED_SET': unordered set of Member Autonomous Systems in the local confederation that the route has traversed Check the PathSegmentType enum for the list of possible values.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "Output only. [Output Only] AS path.",
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
                    destRange: {
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
                    nextHopGateway: {
                      type: "string",
                      description:
                        "The URL to a gateway that should handle matching packets. You can only specify the internet gateway using a full or partial valid URL: projects/project/global/gateways/default-internet-gateway",
                    },
                    nextHopHub: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The full resource name of the Network Connectivity Center hub that will handle matching packets.",
                    },
                    nextHopIlb: {
                      type: "string",
                      description:
                        "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching packets or the IP address of the forwarding Rule. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule    - regions/region/forwardingRules/forwardingRule   If an IP address is provided, must specify an IPv4 address in dot-decimal notation or an IPv6 address in RFC 4291 format. For example, the following are all valid IP addresses:         - 10.128.0.56       - 2001:db8::2d9:51:0:0       - 2001:db8:0:0:2d9:51:0:0   IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    nextHopInstance: {
                      type: "string",
                      description:
                        "The URL to an instance that should handle matching packets. You can specify this as a full or partial URL. For example: https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                    },
                    nextHopInterRegionCost: {
                      type: "integer",
                      description:
                        "Output only. [Output only] Internal fixed region-to-region cost that Google Cloud calculates based on factors such as network performance, distance, and available bandwidth between regions.",
                    },
                    nextHopInterconnectAttachment: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The URL to an InterconnectAttachment which is the next hop for the route. This field will only be populated for dynamic routes generated by Cloud Router with a linked interconnectAttachment or the static route generated by each L2 Interconnect Attachment.",
                    },
                    nextHopIp: {
                      type: "string",
                      description:
                        "The network IP address of an instance that should handle matching packets. Both IPv6 address and IPv4 addresses are supported. Must specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or an IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or 2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    nextHopMed: {
                      type: "integer",
                      description:
                        "Output only. [Output Only] Multi-Exit Discriminator, a BGP route metric that indicates the desirability of a particular route in a network.",
                    },
                    nextHopNetwork: {
                      type: "string",
                      description:
                        "The URL of the local network if it should handle matching packets.",
                    },
                    nextHopOrigin: {
                      type: "string",
                      enum: [
                        "UNDEFINED_NEXT_HOP_ORIGIN",
                        "EGP",
                        "IGP",
                        "INCOMPLETE",
                      ],
                      description:
                        "Output only. [Output Only] Indicates the origin of the route. Can be IGP (Interior Gateway Protocol), EGP (Exterior Gateway Protocol), or INCOMPLETE. Check the NextHopOrigin enum for the list of possible values.",
                    },
                    nextHopPeering: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.",
                    },
                    nextHopVpnTunnel: {
                      type: "string",
                      description:
                        "The URL to a VpnTunnel that should handle matching packets.",
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
                      description: "Additional route parameters.",
                      additionalProperties: true,
                    },
                    priority: {
                      type: "integer",
                      description:
                        "The priority of this route. Priority is used to break ties in cases where there is more than one matching route of equal prefix length. In cases where multiple routes have equal prefix length, the one with the lowest-numbered priority value wins. The default value is `1000`. The priority value must be from `0` to `65535`, inclusive.",
                    },
                    routeStatus: {
                      type: "string",
                      enum: [
                        "UNDEFINED_ROUTE_STATUS",
                        "ACTIVE",
                        "DROPPED",
                        "INACTIVE",
                        "PENDING",
                      ],
                      description:
                        "[Output only] The status of the route. This status applies to dynamic routes learned by Cloud Routers. It is also applicable to routes undergoing migration. Check the RouteStatus enum for the list of possible values.",
                    },
                    routeType: {
                      type: "string",
                      enum: [
                        "UNDEFINED_ROUTE_TYPE",
                        "BGP",
                        "STATIC",
                        "SUBNET",
                        "TRANSIT",
                      ],
                      description:
                        "Output only. [Output Only] The type of this route, which can be one of the following values: - 'TRANSIT' for a transit route that this router learned from another Cloud Router and will readvertise to one of its BGP peers - 'SUBNET' for a route from a subnet of the VPC - 'BGP' for a route learned from a BGP peer of this router - 'STATIC' for a static route Check the RouteType enum for the list of possible values.",
                    },
                    selfLink: {
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
                            enum: [
                              "UNDEFINED_CODE",
                              "CLEANUP_FAILED",
                              "DEPRECATED_RESOURCE_USED",
                              "DEPRECATED_TYPE_USED",
                              "DISK_SIZE_LARGER_THAN_IMAGE_SIZE",
                              "EXPERIMENTAL_TYPE_USED",
                              "EXTERNAL_API_WARNING",
                              "FIELD_VALUE_OVERRIDEN",
                              "INJECTED_KERNELS_DEPRECATED",
                              "INVALID_HEALTH_CHECK_FOR_DYNAMIC_WIEGHTED_LB",
                              "LARGE_DEPLOYMENT_WARNING",
                              "LIST_OVERHEAD_QUOTA_EXCEED",
                              "MISSING_TYPE_DEPENDENCY",
                              "NEXT_HOP_ADDRESS_NOT_ASSIGNED",
                              "NEXT_HOP_CANNOT_IP_FORWARD",
                              "NEXT_HOP_INSTANCE_HAS_NO_IPV6_INTERFACE",
                              "NEXT_HOP_INSTANCE_NOT_FOUND",
                              "NEXT_HOP_INSTANCE_NOT_ON_NETWORK",
                              "NEXT_HOP_NOT_RUNNING",
                              "NOT_CRITICAL_ERROR",
                              "NO_RESULTS_ON_PAGE",
                              "PARTIAL_SUCCESS",
                              "QUOTA_INFO_UNAVAILABLE",
                              "REQUIRED_TOS_AGREEMENT",
                              "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING",
                              "RESOURCE_NOT_DELETED",
                              "SCHEMA_VALIDATION_IGNORED",
                              "SINGLE_INSTANCE_PROPERTY_TEMPLATE",
                              "UNDECLARED_PROPERTIES",
                              "UNREACHABLE",
                            ],
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
              bestRoutesForRouter: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    asPaths: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          asLists: {
                            type: "array",
                            items: {
                              type: "integer",
                            },
                            description:
                              "[Output Only] The AS numbers of the AS Path.",
                          },
                          pathSegmentType: {
                            type: "string",
                            enum: [
                              "UNDEFINED_PATH_SEGMENT_TYPE",
                              "AS_CONFED_SEQUENCE",
                              "AS_CONFED_SET",
                              "AS_SEQUENCE",
                              "AS_SET",
                            ],
                            description:
                              "[Output Only] The type of the AS Path, which can be one of the following values: - 'AS_SET': unordered set of autonomous systems that the route in has traversed - 'AS_SEQUENCE': ordered set of autonomous systems that the route has traversed - 'AS_CONFED_SEQUENCE': ordered set of Member Autonomous Systems in the local confederation that the route has traversed - 'AS_CONFED_SET': unordered set of Member Autonomous Systems in the local confederation that the route has traversed Check the PathSegmentType enum for the list of possible values.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "Output only. [Output Only] AS path.",
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
                    destRange: {
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
                    nextHopGateway: {
                      type: "string",
                      description:
                        "The URL to a gateway that should handle matching packets. You can only specify the internet gateway using a full or partial valid URL: projects/project/global/gateways/default-internet-gateway",
                    },
                    nextHopHub: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The full resource name of the Network Connectivity Center hub that will handle matching packets.",
                    },
                    nextHopIlb: {
                      type: "string",
                      description:
                        "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching packets or the IP address of the forwarding Rule. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule    - regions/region/forwardingRules/forwardingRule   If an IP address is provided, must specify an IPv4 address in dot-decimal notation or an IPv6 address in RFC 4291 format. For example, the following are all valid IP addresses:         - 10.128.0.56       - 2001:db8::2d9:51:0:0       - 2001:db8:0:0:2d9:51:0:0   IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    nextHopInstance: {
                      type: "string",
                      description:
                        "The URL to an instance that should handle matching packets. You can specify this as a full or partial URL. For example: https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                    },
                    nextHopInterRegionCost: {
                      type: "integer",
                      description:
                        "Output only. [Output only] Internal fixed region-to-region cost that Google Cloud calculates based on factors such as network performance, distance, and available bandwidth between regions.",
                    },
                    nextHopInterconnectAttachment: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The URL to an InterconnectAttachment which is the next hop for the route. This field will only be populated for dynamic routes generated by Cloud Router with a linked interconnectAttachment or the static route generated by each L2 Interconnect Attachment.",
                    },
                    nextHopIp: {
                      type: "string",
                      description:
                        "The network IP address of an instance that should handle matching packets. Both IPv6 address and IPv4 addresses are supported. Must specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or an IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or 2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    nextHopMed: {
                      type: "integer",
                      description:
                        "Output only. [Output Only] Multi-Exit Discriminator, a BGP route metric that indicates the desirability of a particular route in a network.",
                    },
                    nextHopNetwork: {
                      type: "string",
                      description:
                        "The URL of the local network if it should handle matching packets.",
                    },
                    nextHopOrigin: {
                      type: "string",
                      enum: [
                        "UNDEFINED_NEXT_HOP_ORIGIN",
                        "EGP",
                        "IGP",
                        "INCOMPLETE",
                      ],
                      description:
                        "Output only. [Output Only] Indicates the origin of the route. Can be IGP (Interior Gateway Protocol), EGP (Exterior Gateway Protocol), or INCOMPLETE. Check the NextHopOrigin enum for the list of possible values.",
                    },
                    nextHopPeering: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.",
                    },
                    nextHopVpnTunnel: {
                      type: "string",
                      description:
                        "The URL to a VpnTunnel that should handle matching packets.",
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
                      description: "Additional route parameters.",
                      additionalProperties: true,
                    },
                    priority: {
                      type: "integer",
                      description:
                        "The priority of this route. Priority is used to break ties in cases where there is more than one matching route of equal prefix length. In cases where multiple routes have equal prefix length, the one with the lowest-numbered priority value wins. The default value is `1000`. The priority value must be from `0` to `65535`, inclusive.",
                    },
                    routeStatus: {
                      type: "string",
                      enum: [
                        "UNDEFINED_ROUTE_STATUS",
                        "ACTIVE",
                        "DROPPED",
                        "INACTIVE",
                        "PENDING",
                      ],
                      description:
                        "[Output only] The status of the route. This status applies to dynamic routes learned by Cloud Routers. It is also applicable to routes undergoing migration. Check the RouteStatus enum for the list of possible values.",
                    },
                    routeType: {
                      type: "string",
                      enum: [
                        "UNDEFINED_ROUTE_TYPE",
                        "BGP",
                        "STATIC",
                        "SUBNET",
                        "TRANSIT",
                      ],
                      description:
                        "Output only. [Output Only] The type of this route, which can be one of the following values: - 'TRANSIT' for a transit route that this router learned from another Cloud Router and will readvertise to one of its BGP peers - 'SUBNET' for a route from a subnet of the VPC - 'BGP' for a route learned from a BGP peer of this router - 'STATIC' for a static route Check the RouteType enum for the list of possible values.",
                    },
                    selfLink: {
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
                            enum: [
                              "UNDEFINED_CODE",
                              "CLEANUP_FAILED",
                              "DEPRECATED_RESOURCE_USED",
                              "DEPRECATED_TYPE_USED",
                              "DISK_SIZE_LARGER_THAN_IMAGE_SIZE",
                              "EXPERIMENTAL_TYPE_USED",
                              "EXTERNAL_API_WARNING",
                              "FIELD_VALUE_OVERRIDEN",
                              "INJECTED_KERNELS_DEPRECATED",
                              "INVALID_HEALTH_CHECK_FOR_DYNAMIC_WIEGHTED_LB",
                              "LARGE_DEPLOYMENT_WARNING",
                              "LIST_OVERHEAD_QUOTA_EXCEED",
                              "MISSING_TYPE_DEPENDENCY",
                              "NEXT_HOP_ADDRESS_NOT_ASSIGNED",
                              "NEXT_HOP_CANNOT_IP_FORWARD",
                              "NEXT_HOP_INSTANCE_HAS_NO_IPV6_INTERFACE",
                              "NEXT_HOP_INSTANCE_NOT_FOUND",
                              "NEXT_HOP_INSTANCE_NOT_ON_NETWORK",
                              "NEXT_HOP_NOT_RUNNING",
                              "NOT_CRITICAL_ERROR",
                              "NO_RESULTS_ON_PAGE",
                              "PARTIAL_SUCCESS",
                              "QUOTA_INFO_UNAVAILABLE",
                              "REQUIRED_TOS_AGREEMENT",
                              "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING",
                              "RESOURCE_NOT_DELETED",
                              "SCHEMA_VALIDATION_IGNORED",
                              "SINGLE_INSTANCE_PROPERTY_TEMPLATE",
                              "UNDECLARED_PROPERTIES",
                              "UNREACHABLE",
                            ],
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
              bgpPeerStatus: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    advertisedRoutes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          asPaths: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                asLists: {
                                  type: "array",
                                  items: {
                                    type: "integer",
                                  },
                                  description:
                                    "[Output Only] The AS numbers of the AS Path.",
                                },
                                pathSegmentType: {
                                  type: "string",
                                  enum: [
                                    "UNDEFINED_PATH_SEGMENT_TYPE",
                                    "AS_CONFED_SEQUENCE",
                                    "AS_CONFED_SET",
                                    "AS_SEQUENCE",
                                    "AS_SET",
                                  ],
                                  description:
                                    "[Output Only] The type of the AS Path, which can be one of the following values: - 'AS_SET': unordered set of autonomous systems that the route in has traversed - 'AS_SEQUENCE': ordered set of autonomous systems that the route has traversed - 'AS_CONFED_SEQUENCE': ordered set of Member Autonomous Systems in the local confederation that the route has traversed - 'AS_CONFED_SET': unordered set of Member Autonomous Systems in the local confederation that the route has traversed Check the PathSegmentType enum for the list of possible values.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description: "Output only. [Output Only] AS path.",
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
                          destRange: {
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
                          nextHopGateway: {
                            type: "string",
                            description:
                              "The URL to a gateway that should handle matching packets. You can only specify the internet gateway using a full or partial valid URL: projects/project/global/gateways/default-internet-gateway",
                          },
                          nextHopHub: {
                            type: "string",
                            description:
                              "Output only. [Output Only] The full resource name of the Network Connectivity Center hub that will handle matching packets.",
                          },
                          nextHopIlb: {
                            type: "string",
                            description:
                              "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching packets or the IP address of the forwarding Rule. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule    - regions/region/forwardingRules/forwardingRule   If an IP address is provided, must specify an IPv4 address in dot-decimal notation or an IPv6 address in RFC 4291 format. For example, the following are all valid IP addresses:         - 10.128.0.56       - 2001:db8::2d9:51:0:0       - 2001:db8:0:0:2d9:51:0:0   IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                          },
                          nextHopInstance: {
                            type: "string",
                            description:
                              "The URL to an instance that should handle matching packets. You can specify this as a full or partial URL. For example: https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                          },
                          nextHopInterRegionCost: {
                            type: "integer",
                            description:
                              "Output only. [Output only] Internal fixed region-to-region cost that Google Cloud calculates based on factors such as network performance, distance, and available bandwidth between regions.",
                          },
                          nextHopInterconnectAttachment: {
                            type: "string",
                            description:
                              "Output only. [Output Only] The URL to an InterconnectAttachment which is the next hop for the route. This field will only be populated for dynamic routes generated by Cloud Router with a linked interconnectAttachment or the static route generated by each L2 Interconnect Attachment.",
                          },
                          nextHopIp: {
                            type: "string",
                            description:
                              "The network IP address of an instance that should handle matching packets. Both IPv6 address and IPv4 addresses are supported. Must specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or an IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or 2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952 compressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                          },
                          nextHopMed: {
                            type: "integer",
                            description:
                              "Output only. [Output Only] Multi-Exit Discriminator, a BGP route metric that indicates the desirability of a particular route in a network.",
                          },
                          nextHopNetwork: {
                            type: "string",
                            description:
                              "The URL of the local network if it should handle matching packets.",
                          },
                          nextHopOrigin: {
                            type: "string",
                            enum: [
                              "UNDEFINED_NEXT_HOP_ORIGIN",
                              "EGP",
                              "IGP",
                              "INCOMPLETE",
                            ],
                            description:
                              "Output only. [Output Only] Indicates the origin of the route. Can be IGP (Interior Gateway Protocol), EGP (Exterior Gateway Protocol), or INCOMPLETE. Check the NextHopOrigin enum for the list of possible values.",
                          },
                          nextHopPeering: {
                            type: "string",
                            description:
                              "Output only. [Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.",
                          },
                          nextHopVpnTunnel: {
                            type: "string",
                            description:
                              "The URL to a VpnTunnel that should handle matching packets.",
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
                            description: "Additional route parameters.",
                            additionalProperties: true,
                          },
                          priority: {
                            type: "integer",
                            description:
                              "The priority of this route. Priority is used to break ties in cases where there is more than one matching route of equal prefix length. In cases where multiple routes have equal prefix length, the one with the lowest-numbered priority value wins. The default value is `1000`. The priority value must be from `0` to `65535`, inclusive.",
                          },
                          routeStatus: {
                            type: "string",
                            enum: [
                              "UNDEFINED_ROUTE_STATUS",
                              "ACTIVE",
                              "DROPPED",
                              "INACTIVE",
                              "PENDING",
                            ],
                            description:
                              "[Output only] The status of the route. This status applies to dynamic routes learned by Cloud Routers. It is also applicable to routes undergoing migration. Check the RouteStatus enum for the list of possible values.",
                          },
                          routeType: {
                            type: "string",
                            enum: [
                              "UNDEFINED_ROUTE_TYPE",
                              "BGP",
                              "STATIC",
                              "SUBNET",
                              "TRANSIT",
                            ],
                            description:
                              "Output only. [Output Only] The type of this route, which can be one of the following values: - 'TRANSIT' for a transit route that this router learned from another Cloud Router and will readvertise to one of its BGP peers - 'SUBNET' for a route from a subnet of the VPC - 'BGP' for a route learned from a BGP peer of this router - 'STATIC' for a static route Check the RouteType enum for the list of possible values.",
                          },
                          selfLink: {
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
                                  enum: [
                                    "UNDEFINED_CODE",
                                    "CLEANUP_FAILED",
                                    "DEPRECATED_RESOURCE_USED",
                                    "DEPRECATED_TYPE_USED",
                                    "DISK_SIZE_LARGER_THAN_IMAGE_SIZE",
                                    "EXPERIMENTAL_TYPE_USED",
                                    "EXTERNAL_API_WARNING",
                                    "FIELD_VALUE_OVERRIDEN",
                                    "INJECTED_KERNELS_DEPRECATED",
                                    "INVALID_HEALTH_CHECK_FOR_DYNAMIC_WIEGHTED_LB",
                                    "LARGE_DEPLOYMENT_WARNING",
                                    "LIST_OVERHEAD_QUOTA_EXCEED",
                                    "MISSING_TYPE_DEPENDENCY",
                                    "NEXT_HOP_ADDRESS_NOT_ASSIGNED",
                                    "NEXT_HOP_CANNOT_IP_FORWARD",
                                    "NEXT_HOP_INSTANCE_HAS_NO_IPV6_INTERFACE",
                                    "NEXT_HOP_INSTANCE_NOT_FOUND",
                                    "NEXT_HOP_INSTANCE_NOT_ON_NETWORK",
                                    "NEXT_HOP_NOT_RUNNING",
                                    "NOT_CRITICAL_ERROR",
                                    "NO_RESULTS_ON_PAGE",
                                    "PARTIAL_SUCCESS",
                                    "QUOTA_INFO_UNAVAILABLE",
                                    "REQUIRED_TOS_AGREEMENT",
                                    "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING",
                                    "RESOURCE_NOT_DELETED",
                                    "SCHEMA_VALIDATION_IGNORED",
                                    "SINGLE_INSTANCE_PROPERTY_TEMPLATE",
                                    "UNDECLARED_PROPERTIES",
                                    "UNREACHABLE",
                                  ],
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
                    bfdStatus: {
                      type: "object",
                      properties: {
                        bfdSessionInitializationMode: {
                          type: "string",
                          enum: [
                            "UNDEFINED_BFD_SESSION_INITIALIZATION_MODE",
                            "ACTIVE",
                            "DISABLED",
                            "PASSIVE",
                          ],
                          description:
                            "The BFD session initialization mode for this BGP peer. If set to ACTIVE, the Cloud Router will initiate the BFD session for this BGP peer. If set to PASSIVE, the Cloud Router will wait for the peer router to initiate the BFD session for this BGP peer. If set to DISABLED, BFD is disabled for this BGP peer. Check the BfdSessionInitializationMode enum for the list of possible values.",
                        },
                        configUpdateTimestampMicros: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        controlPacketCounts: {
                          type: "object",
                          properties: {
                            numRx: {
                              type: "integer",
                              description:
                                "Number of packets received since the beginning of the current BFD session.",
                            },
                            numRxRejected: {
                              type: "integer",
                              description:
                                "Number of packets received that were rejected because of errors since the beginning of the current BFD session.",
                            },
                            numRxSuccessful: {
                              type: "integer",
                              description:
                                "Number of packets received that were successfully processed since the beginning of the current BFD session.",
                            },
                            numTx: {
                              type: "integer",
                              description:
                                "Number of packets transmitted since the beginning of the current BFD session.",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "Control packet counts for the current BFD session.",
                        },
                        controlPacketIntervals: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              avgMs: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              duration: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_DURATION",
                                  "DURATION_UNSPECIFIED",
                                  "HOUR",
                                  "MAX",
                                  "MINUTE",
                                ],
                                description:
                                  'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                              },
                              maxMs: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              minMs: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              numIntervals: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              type: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_TYPE",
                                  "LOOPBACK",
                                  "RECEIVE",
                                  "TRANSMIT",
                                  "TYPE_UNSPECIFIED",
                                ],
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
                        localDiagnostic: {
                          type: "string",
                          enum: [
                            "UNDEFINED_LOCAL_DIAGNOSTIC",
                            "ADMINISTRATIVELY_DOWN",
                            "CONCATENATED_PATH_DOWN",
                            "CONTROL_DETECTION_TIME_EXPIRED",
                            "DIAGNOSTIC_UNSPECIFIED",
                            "ECHO_FUNCTION_FAILED",
                            "FORWARDING_PLANE_RESET",
                            "NEIGHBOR_SIGNALED_SESSION_DOWN",
                            "NO_DIAGNOSTIC",
                            "PATH_DOWN",
                            "REVERSE_CONCATENATED_PATH_DOWN",
                          ],
                          description:
                            "The diagnostic code specifies the local system's reason for the last change in session state. This allows remote systems to determine the reason that the previous session failed, for example. These diagnostic codes are specified in section 4.1 ofRFC5880 Check the LocalDiagnostic enum for the list of possible values.",
                        },
                        localState: {
                          type: "string",
                          enum: [
                            "UNDEFINED_LOCAL_STATE",
                            "ADMIN_DOWN",
                            "DOWN",
                            "INIT",
                            "STATE_UNSPECIFIED",
                            "UP",
                          ],
                          description:
                            "The current BFD session state as seen by the transmitting system. These states are specified in section 4.1 ofRFC5880 Check the LocalState enum for the list of possible values.",
                        },
                        negotiatedLocalControlTxIntervalMs: {
                          type: "integer",
                          description:
                            "Negotiated transmit interval for control packets.",
                        },
                        rxPacket: {
                          type: "object",
                          properties: {
                            authenticationPresent: {
                              type: "boolean",
                              description:
                                "The Authentication Present bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            controlPlaneIndependent: {
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
                              enum: [
                                "UNDEFINED_DIAGNOSTIC",
                                "ADMINISTRATIVELY_DOWN",
                                "CONCATENATED_PATH_DOWN",
                                "CONTROL_DETECTION_TIME_EXPIRED",
                                "DIAGNOSTIC_UNSPECIFIED",
                                "ECHO_FUNCTION_FAILED",
                                "FORWARDING_PLANE_RESET",
                                "NEIGHBOR_SIGNALED_SESSION_DOWN",
                                "NO_DIAGNOSTIC",
                                "PATH_DOWN",
                                "REVERSE_CONCATENATED_PATH_DOWN",
                              ],
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
                            minEchoRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min Echo RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            minRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            minTxIntervalMs: {
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
                            myDiscriminator: {
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
                              enum: [
                                "UNDEFINED_STATE",
                                "ADMIN_DOWN",
                                "DOWN",
                                "INIT",
                                "STATE_UNSPECIFIED",
                                "UP",
                              ],
                              description:
                                "The current BFD session state as seen by the transmitting system. These states are specified in section 4.1 ofRFC5880 Check the State enum for the list of possible values.",
                            },
                            version: {
                              type: "integer",
                              description:
                                "The version number of the BFD protocol, as specified in section 4.1 ofRFC5880.",
                            },
                            yourDiscriminator: {
                              type: "integer",
                              description:
                                "The Your Discriminator value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "The most recent Rx control packet for this BFD session.",
                        },
                        txPacket: {
                          type: "object",
                          properties: {
                            authenticationPresent: {
                              type: "boolean",
                              description:
                                "The Authentication Present bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            controlPlaneIndependent: {
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
                              enum: [
                                "UNDEFINED_DIAGNOSTIC",
                                "ADMINISTRATIVELY_DOWN",
                                "CONCATENATED_PATH_DOWN",
                                "CONTROL_DETECTION_TIME_EXPIRED",
                                "DIAGNOSTIC_UNSPECIFIED",
                                "ECHO_FUNCTION_FAILED",
                                "FORWARDING_PLANE_RESET",
                                "NEIGHBOR_SIGNALED_SESSION_DOWN",
                                "NO_DIAGNOSTIC",
                                "PATH_DOWN",
                                "REVERSE_CONCATENATED_PATH_DOWN",
                              ],
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
                            minEchoRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min Echo RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            minRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min RX Interval value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            minTxIntervalMs: {
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
                            myDiscriminator: {
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
                              enum: [
                                "UNDEFINED_STATE",
                                "ADMIN_DOWN",
                                "DOWN",
                                "INIT",
                                "STATE_UNSPECIFIED",
                                "UP",
                              ],
                              description:
                                "The current BFD session state as seen by the transmitting system. These states are specified in section 4.1 ofRFC5880 Check the State enum for the list of possible values.",
                            },
                            version: {
                              type: "integer",
                              description:
                                "The version number of the BFD protocol, as specified in section 4.1 ofRFC5880.",
                            },
                            yourDiscriminator: {
                              type: "integer",
                              description:
                                "The Your Discriminator value in the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "The most recent Tx control packet for this BFD session.",
                        },
                        uptimeMs: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      description: "Next free: 15",
                      additionalProperties: true,
                    },
                    enableIpv4: {
                      type: "boolean",
                      description:
                        "Output only. Enable IPv4 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 4.",
                    },
                    enableIpv6: {
                      type: "boolean",
                      description:
                        "Output only. Enable IPv6 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 6.",
                    },
                    ipAddress: {
                      type: "string",
                      description:
                        "Output only. IP address of the local BGP interface.",
                    },
                    ipv4NexthopAddress: {
                      type: "string",
                      description:
                        "Output only. IPv4 address of the local BGP interface.",
                    },
                    ipv6NexthopAddress: {
                      type: "string",
                      description:
                        "Output only. IPv6 address of the local BGP interface.",
                    },
                    linkedVpnTunnel: {
                      type: "string",
                      description:
                        "Output only. URL of the VPN tunnel that this BGP peer controls.",
                    },
                    md5AuthEnabled: {
                      type: "boolean",
                      description:
                        "Informs whether MD5 authentication is enabled on this BGP peer.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Output only. Name of this BGP peer. Unique within the Routers resource.",
                    },
                    numLearnedRoutes: {
                      type: "integer",
                      description:
                        "Output only. Number of routes learned from the remote BGP Peer.",
                    },
                    peerIpAddress: {
                      type: "string",
                      description:
                        "Output only. IP address of the remote BGP interface.",
                    },
                    peerIpv4NexthopAddress: {
                      type: "string",
                      description:
                        "Output only. IPv4 address of the remote BGP interface.",
                    },
                    peerIpv6NexthopAddress: {
                      type: "string",
                      description:
                        "Output only. IPv6 address of the remote BGP interface.",
                    },
                    routerApplianceInstance: {
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
                      enum: ["UNDEFINED_STATUS", "DOWN", "UNKNOWN", "UP"],
                      description:
                        "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
                    },
                    statusReason: {
                      type: "string",
                      enum: [
                        "UNDEFINED_STATUS_REASON",
                        "IPV4_PEER_ON_IPV6_ONLY_CONNECTION",
                        "IPV6_PEER_ON_IPV4_ONLY_CONNECTION",
                        "MD5_AUTH_INTERNAL_PROBLEM",
                        "STATUS_REASON_UNSPECIFIED",
                      ],
                      description:
                        "Indicates why particular status was returned. Check the StatusReason enum for the list of possible values.",
                    },
                    uptime: {
                      type: "string",
                      description:
                        "Output only. Time this session has been up. Format:  14 years, 51 weeks, 6 days, 23 hours, 59 minutes, 59 seconds",
                    },
                    uptimeSeconds: {
                      type: "string",
                      description:
                        "Output only. Time this session has been up, in seconds. Format:  145",
                    },
                  },
                  additionalProperties: true,
                },
              },
              natStatus: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    autoAllocatedNatIps: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Output only. A list of IPs auto-allocated for NAT. Example: ["1.1.1.1", "129.2.16.89"]',
                    },
                    drainAutoAllocatedNatIps: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Output only. A list of IPs auto-allocated for NAT that are in drain mode. Example: ["1.1.1.1", "179.12.26.133"].',
                    },
                    drainUserAllocatedNatIps: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Output only. A list of IPs user-allocated for NAT that are in drain mode. Example: ["1.1.1.1", "179.12.26.133"].',
                    },
                    minExtraNatIpsNeeded: {
                      type: "integer",
                      description:
                        "Output only. The number of extra IPs to allocate. This will be greater than 0 only if user-specified IPs are NOT enough to allow all configured VMs to use NAT. This value is meaningful only when auto-allocation of NAT IPs is *not* used.",
                    },
                    name: {
                      type: "string",
                      description: "Output only. Unique name of this NAT.",
                    },
                    numVmEndpointsWithNatMappings: {
                      type: "integer",
                      description:
                        "Output only. Number of VM endpoints (i.e., Nics) that can use NAT.",
                    },
                    ruleStatus: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          activeNatIps: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Output only. A list of active IPs for NAT. Example: ["1.1.1.1", "179.12.26.133"].',
                          },
                          drainNatIps: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Output only. A list of IPs for NAT that are in drain mode. Example: ["1.1.1.1", "179.12.26.133"].',
                          },
                          minExtraIpsNeeded: {
                            type: "integer",
                            description:
                              "Output only. The number of extra IPs to allocate. This will be greater than 0 only if the existing IPs in this NAT Rule are NOT enough to allow all configured VMs to use NAT.",
                          },
                          numVmEndpointsWithNatMappings: {
                            type: "integer",
                            description:
                              "Output only. Number of VM endpoints (i.e., NICs) that have NAT Mappings from this NAT Rule.",
                          },
                          ruleNumber: {
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
                    userAllocatedNatIpResources: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Output only. A list of fully qualified URLs of reserved IP address resources.",
                    },
                    userAllocatedNatIps: {
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

export default routersGetRouterStatus;
