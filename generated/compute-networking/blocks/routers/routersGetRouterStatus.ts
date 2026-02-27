import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const routersGetRouterStatus: AppBlock = {
  name: "Routers - Get Router Status",
  description: `Retrieves runtime information of the specified router.`,
  category: "Routers",
  inputs: {
    default: {
      config: {
        router: {
          name: "Router",
          description: "Name of the Router resource to query.",
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
        let path = `projects/{project}/regions/{region}/routers/{router}/getRouterStatus`;

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
          result: {
            type: "object",
            properties: {
              bestRoutes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                      description:
                        "[Output Only] Type of this resource. Always compute#routes for\nRoute resources.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of instance tags to which this route applies.",
                    },
                    nextHopMed: {
                      type: "integer",
                      description:
                        "[Output Only] Multi-Exit Discriminator, a BGP route metric that indicates\nthe desirability of a particular route in a network. (Format: uint32)",
                    },
                    routeType: {
                      type: "string",
                      enum: ["BGP", "STATIC", "SUBNET", "TRANSIT"],
                      description:
                        "[Output Only] The type of this route, which can be one of the following\nvalues:\n- 'TRANSIT' for a transit route that this router learned from\nanother Cloud Router and will readvertise to one of its BGP peers \n- 'SUBNET' for a route from a subnet of the VPC \n- 'BGP' for a route learned from a BGP peer of this router \n- 'STATIC' for a static route",
                    },
                    routeStatus: {
                      type: "string",
                      enum: ["ACTIVE", "DROPPED", "INACTIVE", "PENDING"],
                      description:
                        "[Output only] The status of the route. This status only applies to\ndynamic routes learned by Cloud Routers. This status is not applicable\nto static routes.",
                    },
                    description: {
                      type: "string",
                      description:
                        "An optional description of this resource. Provide this field when you\ncreate the resource.",
                    },
                    nextHopHub: {
                      type: "string",
                      description:
                        "[Output Only] The full resource name of the Network Connectivity Center hub\nthat will handle matching packets.",
                    },
                    asPaths: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          pathSegmentType: {
                            type: "string",
                            enum: [
                              "AS_CONFED_SEQUENCE",
                              "AS_CONFED_SET",
                              "AS_SEQUENCE",
                              "AS_SET",
                            ],
                            description:
                              "[Output Only] The type of the AS Path, which can be one of the following\nvalues: \n- 'AS_SET': unordered set of autonomous systems that the route\nin has traversed  \n- 'AS_SEQUENCE': ordered set of autonomous\nsystems that the route has traversed  \n- 'AS_CONFED_SEQUENCE':\nordered set of Member Autonomous Systems in the local confederation that\nthe route has traversed  \n- 'AS_CONFED_SET': unordered set of\nMember Autonomous Systems in the local confederation that the route has\ntraversed",
                          },
                          asLists: {
                            type: "array",
                            items: {
                              type: "integer",
                              description: "Format: uint32",
                            },
                            description:
                              "[Output Only] The AS numbers of the AS Path.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "[Output Only] AS path.",
                    },
                    warnings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                value: {
                                  type: "string",
                                  description:
                                    "[Output Only] A warning data value corresponding to the key.",
                                },
                                key: {
                                  type: "string",
                                  description:
                                    "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
                          },
                          message: {
                            type: "string",
                            description:
                              "[Output Only] A human-readable description of the warning code.",
                          },
                          code: {
                            type: "string",
                            enum: [
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
                              "[Output Only] A warning code, if applicable. For example, Compute\nEngine returns NO_RESULTS_ON_PAGE if there\nare no results in the response.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] If potential misconfigurations are detected for this\nroute, this field will be populated with warning messages.",
                    },
                    nextHopGateway: {
                      type: "string",
                      description:
                        "The URL to a gateway that should handle matching packets.\nYou can only specify the internet gateway using a full or\npartial valid URL: projects/project/global/gateways/default-internet-gateway",
                    },
                    nextHopIp: {
                      type: "string",
                      description:
                        "The network IP address of an instance that should handle matching packets.\nBoth IPv6 address and IPv4 addresses are supported.\nMust specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or\nan IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or\n2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952\ncompressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an\nIPv4-mapped IPv6 address.",
                    },
                    nextHopInterRegionCost: {
                      type: "integer",
                      description:
                        "[Output only] Internal fixed region-to-region cost that Google Cloud\ncalculates based on factors such as network performance, distance, and\navailable bandwidth between regions. (Format: uint32)",
                    },
                    creationTimestamp: {
                      type: "string",
                      description:
                        "[Output Only] Creation timestamp inRFC3339\ntext format.",
                    },
                    id: {
                      type: "string",
                      description:
                        "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
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
                      description: "Additional route parameters.",
                      additionalProperties: true,
                    },
                    nextHopVpnTunnel: {
                      type: "string",
                      description:
                        "The URL to a VpnTunnel that should handle matching packets.",
                    },
                    destRange: {
                      type: "string",
                      description:
                        "The destination range of outgoing packets that this route applies to. Both\nIPv4 and IPv6 are supported.\nMust specify an IPv4 range (e.g. 192.0.2.0/24) or an IPv6 range in RFC 4291\nformat (e.g. 2001:db8::/32). IPv6 range will be displayed using RFC 5952\ncompressed format.",
                    },
                    nextHopOrigin: {
                      type: "string",
                      enum: ["EGP", "IGP", "INCOMPLETE"],
                      description:
                        "[Output Only] Indicates the origin of the route. Can be IGP\n(Interior Gateway Protocol), EGP (Exterior Gateway Protocol),\nor INCOMPLETE.",
                    },
                    network: {
                      type: "string",
                      description:
                        "Fully-qualified URL of the network that this route applies to.",
                    },
                    nextHopNetwork: {
                      type: "string",
                      description:
                        "The URL of the local network if it should handle matching packets.",
                    },
                    nextHopInstance: {
                      type: "string",
                      description:
                        "The URL to an instance that should handle matching packets. You can specify\nthis as a full or partial URL.\nFor example: \nhttps://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                    },
                    name: {
                      type: "string",
                      description:
                        "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all following characters (except for the last\ncharacter) must be a dash, lowercase letter, or digit. The last character\nmust be a lowercase letter or digit.",
                    },
                    nextHopIlb: {
                      type: "string",
                      description:
                        "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching\npackets or the IP address of the forwarding Rule.\nFor example, the following are all valid URLs:\n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule \n   - regions/region/forwardingRules/forwardingRule\n\n\nIf an IP address is provided, must specify an IPv4 address in dot-decimal\nnotation or an IPv6 address in RFC 4291 format. For example, the following\nare all valid IP addresses:\n   \n   \n      - 10.128.0.56\n      - 2001:db8::2d9:51:0:0\n      - 2001:db8:0:0:2d9:51:0:0\n\n\nIPv6 addresses will be displayed using RFC 5952 compressed format (e.g.\n2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    nextHopPeering: {
                      type: "string",
                      description:
                        "[Output Only] The network peering name that should handle matching packets,\nwhich should conform to RFC1035.",
                    },
                    selfLink: {
                      type: "string",
                      description:
                        "[Output Only] Server-defined fully-qualified URL for this resource.",
                    },
                    priority: {
                      type: "integer",
                      description:
                        "The priority of this route. Priority is used to break ties in cases\nwhere there is more than one matching route of equal prefix length. In\ncases where multiple routes have equal prefix length, the one with the\nlowest-numbered priority value wins. The default value is `1000`. The\npriority value must be from `0` to `65535`, inclusive. (Format: uint32)",
                    },
                  },
                  description:
                    "Represents a Route resource.\n\nA route defines a path from VM instances in the VPC network to a specific\ndestination. This destination can be inside or outside the VPC network.\nFor more information, read theRoutes overview.",
                  additionalProperties: true,
                },
                description:
                  "A list of the best dynamic routes for this Cloud Router's Virtual Private\nCloud (VPC) network in the same region as this Cloud Router.\n\nLists all of the best routes per prefix that are programmed into this\nregion's VPC data plane.\n\nWhen global dynamic routing mode is turned on in the VPC network, this list\ncan include cross-region dynamic routes from Cloud Routers in other\nregions.",
              },
              bgpPeerStatus: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    peerIpv6NexthopAddress: {
                      type: "string",
                      description: "IPv6 address of the remote BGP interface.",
                    },
                    state: {
                      type: "string",
                      description:
                        "The state of the BGP session. For a list of possible values for this\nfield, seeBGP session states.",
                    },
                    md5AuthEnabled: {
                      type: "boolean",
                      description:
                        "Informs whether MD5 authentication is enabled on this BGP peer.",
                    },
                    peerIpAddress: {
                      type: "string",
                      description: "IP address of the remote BGP interface.",
                    },
                    enableIpv4: {
                      type: "boolean",
                      description:
                        "Enable IPv4 traffic over BGP Peer.\nIt is enabled by default if the peerIpAddress is version 4.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Name of this BGP peer. Unique within the Routers resource.",
                    },
                    numLearnedRoutes: {
                      type: "integer",
                      description:
                        "Number of routes learned from the remote BGP Peer. (Format: uint32)",
                    },
                    routerApplianceInstance: {
                      type: "string",
                      description:
                        "[Output only] URI of the VM instance that is used as third-party router\nappliances such as Next Gen Firewalls, Virtual Routers, or Router\nAppliances.\nThe VM instance is the peer side of the BGP session.",
                    },
                    linkedVpnTunnel: {
                      type: "string",
                      description:
                        "URL of the VPN tunnel that this BGP peer controls.",
                    },
                    peerIpv4NexthopAddress: {
                      type: "string",
                      description: "IPv4 address of the remote BGP interface.",
                    },
                    advertisedRoutes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          kind: {
                            type: "string",
                            description:
                              "[Output Only] Type of this resource. Always compute#routes for\nRoute resources.",
                          },
                          tags: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of instance tags to which this route applies.",
                          },
                          nextHopMed: {
                            type: "integer",
                            description:
                              "[Output Only] Multi-Exit Discriminator, a BGP route metric that indicates\nthe desirability of a particular route in a network. (Format: uint32)",
                          },
                          routeType: {
                            type: "string",
                            enum: ["BGP", "STATIC", "SUBNET", "TRANSIT"],
                            description:
                              "[Output Only] The type of this route, which can be one of the following\nvalues:\n- 'TRANSIT' for a transit route that this router learned from\nanother Cloud Router and will readvertise to one of its BGP peers \n- 'SUBNET' for a route from a subnet of the VPC \n- 'BGP' for a route learned from a BGP peer of this router \n- 'STATIC' for a static route",
                          },
                          routeStatus: {
                            type: "string",
                            enum: ["ACTIVE", "DROPPED", "INACTIVE", "PENDING"],
                            description:
                              "[Output only] The status of the route. This status only applies to\ndynamic routes learned by Cloud Routers. This status is not applicable\nto static routes.",
                          },
                          description: {
                            type: "string",
                            description:
                              "An optional description of this resource. Provide this field when you\ncreate the resource.",
                          },
                          nextHopHub: {
                            type: "string",
                            description:
                              "[Output Only] The full resource name of the Network Connectivity Center hub\nthat will handle matching packets.",
                          },
                          asPaths: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                pathSegmentType: {
                                  type: "string",
                                  enum: [
                                    "AS_CONFED_SEQUENCE",
                                    "AS_CONFED_SET",
                                    "AS_SEQUENCE",
                                    "AS_SET",
                                  ],
                                  description:
                                    "[Output Only] The type of the AS Path, which can be one of the following\nvalues: \n- 'AS_SET': unordered set of autonomous systems that the route\nin has traversed  \n- 'AS_SEQUENCE': ordered set of autonomous\nsystems that the route has traversed  \n- 'AS_CONFED_SEQUENCE':\nordered set of Member Autonomous Systems in the local confederation that\nthe route has traversed  \n- 'AS_CONFED_SET': unordered set of\nMember Autonomous Systems in the local confederation that the route has\ntraversed",
                                },
                                asLists: {
                                  type: "array",
                                  items: {
                                    type: "integer",
                                    description: "Format: uint32",
                                  },
                                  description:
                                    "[Output Only] The AS numbers of the AS Path.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description: "[Output Only] AS path.",
                          },
                          warnings: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                data: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      value: {
                                        type: "string",
                                        description:
                                          "[Output Only] A warning data value corresponding to the key.",
                                      },
                                      key: {
                                        type: "string",
                                        description:
                                          "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  description:
                                    '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
                                },
                                message: {
                                  type: "string",
                                  description:
                                    "[Output Only] A human-readable description of the warning code.",
                                },
                                code: {
                                  type: "string",
                                  enum: [
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
                                    "[Output Only] A warning code, if applicable. For example, Compute\nEngine returns NO_RESULTS_ON_PAGE if there\nare no results in the response.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "[Output Only] If potential misconfigurations are detected for this\nroute, this field will be populated with warning messages.",
                          },
                          nextHopGateway: {
                            type: "string",
                            description:
                              "The URL to a gateway that should handle matching packets.\nYou can only specify the internet gateway using a full or\npartial valid URL: projects/project/global/gateways/default-internet-gateway",
                          },
                          nextHopIp: {
                            type: "string",
                            description:
                              "The network IP address of an instance that should handle matching packets.\nBoth IPv6 address and IPv4 addresses are supported.\nMust specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or\nan IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or\n2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952\ncompressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an\nIPv4-mapped IPv6 address.",
                          },
                          nextHopInterRegionCost: {
                            type: "integer",
                            description:
                              "[Output only] Internal fixed region-to-region cost that Google Cloud\ncalculates based on factors such as network performance, distance, and\navailable bandwidth between regions. (Format: uint32)",
                          },
                          creationTimestamp: {
                            type: "string",
                            description:
                              "[Output Only] Creation timestamp inRFC3339\ntext format.",
                          },
                          id: {
                            type: "string",
                            description:
                              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
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
                            description: "Additional route parameters.",
                            additionalProperties: true,
                          },
                          nextHopVpnTunnel: {
                            type: "string",
                            description:
                              "The URL to a VpnTunnel that should handle matching packets.",
                          },
                          destRange: {
                            type: "string",
                            description:
                              "The destination range of outgoing packets that this route applies to. Both\nIPv4 and IPv6 are supported.\nMust specify an IPv4 range (e.g. 192.0.2.0/24) or an IPv6 range in RFC 4291\nformat (e.g. 2001:db8::/32). IPv6 range will be displayed using RFC 5952\ncompressed format.",
                          },
                          nextHopOrigin: {
                            type: "string",
                            enum: ["EGP", "IGP", "INCOMPLETE"],
                            description:
                              "[Output Only] Indicates the origin of the route. Can be IGP\n(Interior Gateway Protocol), EGP (Exterior Gateway Protocol),\nor INCOMPLETE.",
                          },
                          network: {
                            type: "string",
                            description:
                              "Fully-qualified URL of the network that this route applies to.",
                          },
                          nextHopNetwork: {
                            type: "string",
                            description:
                              "The URL of the local network if it should handle matching packets.",
                          },
                          nextHopInstance: {
                            type: "string",
                            description:
                              "The URL to an instance that should handle matching packets. You can specify\nthis as a full or partial URL.\nFor example: \nhttps://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                          },
                          name: {
                            type: "string",
                            description:
                              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all following characters (except for the last\ncharacter) must be a dash, lowercase letter, or digit. The last character\nmust be a lowercase letter or digit.",
                          },
                          nextHopIlb: {
                            type: "string",
                            description:
                              "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching\npackets or the IP address of the forwarding Rule.\nFor example, the following are all valid URLs:\n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule \n   - regions/region/forwardingRules/forwardingRule\n\n\nIf an IP address is provided, must specify an IPv4 address in dot-decimal\nnotation or an IPv6 address in RFC 4291 format. For example, the following\nare all valid IP addresses:\n   \n   \n      - 10.128.0.56\n      - 2001:db8::2d9:51:0:0\n      - 2001:db8:0:0:2d9:51:0:0\n\n\nIPv6 addresses will be displayed using RFC 5952 compressed format (e.g.\n2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                          },
                          nextHopPeering: {
                            type: "string",
                            description:
                              "[Output Only] The network peering name that should handle matching packets,\nwhich should conform to RFC1035.",
                          },
                          selfLink: {
                            type: "string",
                            description:
                              "[Output Only] Server-defined fully-qualified URL for this resource.",
                          },
                          priority: {
                            type: "integer",
                            description:
                              "The priority of this route. Priority is used to break ties in cases\nwhere there is more than one matching route of equal prefix length. In\ncases where multiple routes have equal prefix length, the one with the\nlowest-numbered priority value wins. The default value is `1000`. The\npriority value must be from `0` to `65535`, inclusive. (Format: uint32)",
                          },
                        },
                        description:
                          "Represents a Route resource.\n\nA route defines a path from VM instances in the VPC network to a specific\ndestination. This destination can be inside or outside the VPC network.\nFor more information, read theRoutes overview.",
                        additionalProperties: true,
                      },
                      description:
                        "Routes that were advertised to the remote BGP peer",
                    },
                    uptime: {
                      type: "string",
                      description:
                        "Time this session has been up.\nFormat:\n 14 years, 51 weeks, 6 days, 23 hours, 59 minutes, 59 seconds",
                    },
                    bfdStatus: {
                      type: "object",
                      properties: {
                        localState: {
                          type: "string",
                          enum: [
                            "ADMIN_DOWN",
                            "DOWN",
                            "INIT",
                            "STATE_UNSPECIFIED",
                            "UP",
                          ],
                          description:
                            "The current BFD session state as seen by the transmitting system. These\nstates are specified in section 4.1 ofRFC5880",
                        },
                        configUpdateTimestampMicros: {
                          type: "string",
                          description:
                            "Unix timestamp of the most recent config update. (Format: int64)",
                        },
                        txPacket: {
                          type: "object",
                          properties: {
                            length: {
                              type: "integer",
                              description:
                                "The length of the BFD Control packet in bytes. This is specified in section\n4.1 ofRFC5880 (Format: uint32)",
                            },
                            multiplier: {
                              type: "integer",
                              description:
                                "The detection time multiplier of the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                            version: {
                              type: "integer",
                              description:
                                "The version number of the BFD protocol, as specified in section 4.1 ofRFC5880. (Format: uint32)",
                            },
                            minTxIntervalMs: {
                              type: "integer",
                              description:
                                "The Desired Min TX Interval value in the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                            diagnostic: {
                              type: "string",
                              enum: [
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
                                "The diagnostic code specifies the local system's reason for the last change\nin session state. This allows remote systems to determine the reason that\nthe previous session failed, for example. These diagnostic codes are\nspecified in section 4.1 ofRFC5880",
                            },
                            poll: {
                              type: "boolean",
                              description:
                                "The Poll bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            yourDiscriminator: {
                              type: "integer",
                              description:
                                "The Your Discriminator value in the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                            authenticationPresent: {
                              type: "boolean",
                              description:
                                "The Authentication Present bit of the BFD packet. This is specified in\nsection 4.1 ofRFC5880",
                            },
                            myDiscriminator: {
                              type: "integer",
                              description:
                                "The My Discriminator value in the BFD packet. This is specified in section\n4.1 ofRFC5880 (Format: uint32)",
                            },
                            multipoint: {
                              type: "boolean",
                              description:
                                "The multipoint bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            state: {
                              type: "string",
                              enum: [
                                "ADMIN_DOWN",
                                "DOWN",
                                "INIT",
                                "STATE_UNSPECIFIED",
                                "UP",
                              ],
                              description:
                                "The current BFD session state as seen by the transmitting system. These\nstates are specified in section 4.1 ofRFC5880",
                            },
                            minEchoRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min Echo RX Interval value in the BFD packet. This is\nspecified in section 4.1 ofRFC5880 (Format: uint32)",
                            },
                            demand: {
                              type: "boolean",
                              description:
                                "The demand bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            controlPlaneIndependent: {
                              type: "boolean",
                              description:
                                "The Control Plane Independent bit of the BFD packet. This is specified in\nsection 4.1 ofRFC5880",
                            },
                            final: {
                              type: "boolean",
                              description:
                                "The Final bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            minRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min RX Interval value in the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                          },
                          additionalProperties: true,
                        },
                        bfdSessionInitializationMode: {
                          type: "string",
                          enum: ["ACTIVE", "DISABLED", "PASSIVE"],
                          description:
                            "The BFD session initialization mode for this BGP peer.\nIf set to ACTIVE, the Cloud Router will initiate the BFD session for\nthis BGP peer. If set to PASSIVE, the Cloud Router will wait for the\npeer router to initiate the BFD session for this BGP peer. If set to\nDISABLED, BFD is disabled for this BGP peer.",
                        },
                        controlPacketCounts: {
                          type: "object",
                          properties: {
                            numRxSuccessful: {
                              type: "integer",
                              description:
                                "Number of packets received that were successfully processed since the\nbeginning of the current BFD session. (Format: uint32)",
                            },
                            numTx: {
                              type: "integer",
                              description:
                                "Number of packets transmitted since the beginning of the current BFD\nsession. (Format: uint32)",
                            },
                            numRxRejected: {
                              type: "integer",
                              description:
                                "Number of packets received that were rejected because of errors since the\nbeginning of the current BFD session. (Format: uint32)",
                            },
                            numRx: {
                              type: "integer",
                              description:
                                "Number of packets received since the beginning of the current BFD\nsession. (Format: uint32)",
                            },
                          },
                          additionalProperties: true,
                        },
                        rxPacket: {
                          type: "object",
                          properties: {
                            length: {
                              type: "integer",
                              description:
                                "The length of the BFD Control packet in bytes. This is specified in section\n4.1 ofRFC5880 (Format: uint32)",
                            },
                            multiplier: {
                              type: "integer",
                              description:
                                "The detection time multiplier of the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                            version: {
                              type: "integer",
                              description:
                                "The version number of the BFD protocol, as specified in section 4.1 ofRFC5880. (Format: uint32)",
                            },
                            minTxIntervalMs: {
                              type: "integer",
                              description:
                                "The Desired Min TX Interval value in the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                            diagnostic: {
                              type: "string",
                              enum: [
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
                                "The diagnostic code specifies the local system's reason for the last change\nin session state. This allows remote systems to determine the reason that\nthe previous session failed, for example. These diagnostic codes are\nspecified in section 4.1 ofRFC5880",
                            },
                            poll: {
                              type: "boolean",
                              description:
                                "The Poll bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            yourDiscriminator: {
                              type: "integer",
                              description:
                                "The Your Discriminator value in the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                            authenticationPresent: {
                              type: "boolean",
                              description:
                                "The Authentication Present bit of the BFD packet. This is specified in\nsection 4.1 ofRFC5880",
                            },
                            myDiscriminator: {
                              type: "integer",
                              description:
                                "The My Discriminator value in the BFD packet. This is specified in section\n4.1 ofRFC5880 (Format: uint32)",
                            },
                            multipoint: {
                              type: "boolean",
                              description:
                                "The multipoint bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            state: {
                              type: "string",
                              enum: [
                                "ADMIN_DOWN",
                                "DOWN",
                                "INIT",
                                "STATE_UNSPECIFIED",
                                "UP",
                              ],
                              description:
                                "The current BFD session state as seen by the transmitting system. These\nstates are specified in section 4.1 ofRFC5880",
                            },
                            minEchoRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min Echo RX Interval value in the BFD packet. This is\nspecified in section 4.1 ofRFC5880 (Format: uint32)",
                            },
                            demand: {
                              type: "boolean",
                              description:
                                "The demand bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            controlPlaneIndependent: {
                              type: "boolean",
                              description:
                                "The Control Plane Independent bit of the BFD packet. This is specified in\nsection 4.1 ofRFC5880",
                            },
                            final: {
                              type: "boolean",
                              description:
                                "The Final bit of the BFD packet. This is specified in section 4.1 ofRFC5880",
                            },
                            minRxIntervalMs: {
                              type: "integer",
                              description:
                                "The Required Min RX Interval value in the BFD packet. This is specified in\nsection 4.1 ofRFC5880 (Format: uint32)",
                            },
                          },
                          additionalProperties: true,
                        },
                        localDiagnostic: {
                          type: "string",
                          enum: [
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
                            "The diagnostic code specifies the local system's reason for the last change\nin session state. This allows remote systems to determine the reason that\nthe previous session failed, for example. These diagnostic codes are\nspecified in section 4.1 ofRFC5880",
                        },
                        uptimeMs: {
                          type: "string",
                          description:
                            "Session uptime in milliseconds. Value will be 0 if session is not up. (Format: int64)",
                        },
                        negotiatedLocalControlTxIntervalMs: {
                          type: "integer",
                          description:
                            "Negotiated transmit interval for control packets. (Format: uint32)",
                        },
                        controlPacketIntervals: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              numIntervals: {
                                type: "string",
                                description:
                                  "Number of inter-packet intervals from which these statistics were derived. (Format: int64)",
                              },
                              type: {
                                type: "string",
                                enum: [
                                  "LOOPBACK",
                                  "RECEIVE",
                                  "TRANSMIT",
                                  "TYPE_UNSPECIFIED",
                                ],
                                description:
                                  "The type of packets for which inter-packet intervals were computed.",
                              },
                              duration: {
                                type: "string",
                                enum: [
                                  "DURATION_UNSPECIFIED",
                                  "HOUR",
                                  "MAX",
                                  "MINUTE",
                                ],
                                description:
                                  "From how long ago in the past these intervals were observed.",
                              },
                              minMs: {
                                type: "string",
                                description:
                                  "Minimum observed inter-packet interval in milliseconds. (Format: int64)",
                              },
                              maxMs: {
                                type: "string",
                                description:
                                  "Maximum observed inter-packet interval in milliseconds. (Format: int64)",
                              },
                              avgMs: {
                                type: "string",
                                description:
                                  "Average observed inter-packet interval in milliseconds. (Format: int64)",
                              },
                            },
                            description: "Next free: 7",
                            additionalProperties: true,
                          },
                          description:
                            "Inter-packet time interval statistics for control packets.",
                        },
                      },
                      description: "Next free: 15",
                      additionalProperties: true,
                    },
                    ipv4NexthopAddress: {
                      type: "string",
                      description: "IPv4 address of the local BGP interface.",
                    },
                    enableIpv6: {
                      type: "boolean",
                      description:
                        "Enable IPv6 traffic over BGP Peer.\nIt is enabled by default if the peerIpAddress is version 6.",
                    },
                    status: {
                      type: "string",
                      enum: ["DOWN", "UNKNOWN", "UP"],
                      description: "Status of the BGP peer: {UP, DOWN}",
                    },
                    statusReason: {
                      type: "string",
                      enum: [
                        "IPV4_PEER_ON_IPV6_ONLY_CONNECTION",
                        "IPV6_PEER_ON_IPV4_ONLY_CONNECTION",
                        "MD5_AUTH_INTERNAL_PROBLEM",
                        "STATUS_REASON_UNSPECIFIED",
                      ],
                      description:
                        "Indicates why particular status was returned.",
                    },
                    uptimeSeconds: {
                      type: "string",
                      description:
                        "Time this session has been up, in seconds.\nFormat:\n 145",
                    },
                    ipAddress: {
                      type: "string",
                      description: "IP address of the local BGP interface.",
                    },
                    ipv6NexthopAddress: {
                      type: "string",
                      description: "IPv6 address of the local BGP interface.",
                    },
                  },
                  additionalProperties: true,
                },
              },
              network: {
                type: "string",
                description: "URI of the network to which this router belongs.",
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
                        'A list of IPs auto-allocated for NAT. Example: ["1.1.1.1", "129.2.16.89"]',
                    },
                    userAllocatedNatIpResources: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of fully qualified URLs of reserved IP address resources.",
                    },
                    numVmEndpointsWithNatMappings: {
                      type: "integer",
                      description:
                        "Number of VM endpoints (i.e., Nics) that can use NAT. (Format: int32)",
                    },
                    name: {
                      type: "string",
                      description: "Unique name of this NAT.",
                    },
                    drainAutoAllocatedNatIps: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'A list of IPs auto-allocated for NAT that are in drain mode.\nExample: ["1.1.1.1", "179.12.26.133"].',
                    },
                    drainUserAllocatedNatIps: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'A list of IPs user-allocated for NAT that are in drain mode.\nExample: ["1.1.1.1", "179.12.26.133"].',
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
                              'A list of active IPs for NAT.\nExample: ["1.1.1.1", "179.12.26.133"].',
                          },
                          numVmEndpointsWithNatMappings: {
                            type: "integer",
                            description:
                              "Number of VM endpoints (i.e., NICs) that have NAT Mappings from this\nNAT Rule. (Format: int32)",
                          },
                          ruleNumber: {
                            type: "integer",
                            description:
                              "Rule number of the rule. (Format: int32)",
                          },
                          drainNatIps: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'A list of IPs for NAT that are in drain mode.\nExample: ["1.1.1.1", "179.12.26.133"].',
                          },
                          minExtraIpsNeeded: {
                            type: "integer",
                            description:
                              "The number of extra IPs to allocate. This will be greater than 0 only\nif the existing IPs in this NAT Rule are NOT enough to allow all\nconfigured VMs to use NAT. (Format: int32)",
                          },
                        },
                        description:
                          "Status of a NAT Rule contained in this NAT.",
                        additionalProperties: true,
                      },
                      description: "Status of rules in this NAT.",
                    },
                    userAllocatedNatIps: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'A list of IPs user-allocated for NAT.\nThey will be raw IP strings like "179.12.26.133".',
                    },
                    minExtraNatIpsNeeded: {
                      type: "integer",
                      description:
                        "The number of extra IPs to allocate. This will be greater than 0 only if\nuser-specified IPs are NOT enough to allow all configured VMs to use NAT.\nThis value is meaningful only when auto-allocation of NAT IPs is *not*\nused. (Format: int32)",
                    },
                  },
                  description: "Status of a NAT contained in this router.",
                  additionalProperties: true,
                },
              },
              bestRoutesForRouter: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                      description:
                        "[Output Only] Type of this resource. Always compute#routes for\nRoute resources.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of instance tags to which this route applies.",
                    },
                    nextHopMed: {
                      type: "integer",
                      description:
                        "[Output Only] Multi-Exit Discriminator, a BGP route metric that indicates\nthe desirability of a particular route in a network. (Format: uint32)",
                    },
                    routeType: {
                      type: "string",
                      enum: ["BGP", "STATIC", "SUBNET", "TRANSIT"],
                      description:
                        "[Output Only] The type of this route, which can be one of the following\nvalues:\n- 'TRANSIT' for a transit route that this router learned from\nanother Cloud Router and will readvertise to one of its BGP peers \n- 'SUBNET' for a route from a subnet of the VPC \n- 'BGP' for a route learned from a BGP peer of this router \n- 'STATIC' for a static route",
                    },
                    routeStatus: {
                      type: "string",
                      enum: ["ACTIVE", "DROPPED", "INACTIVE", "PENDING"],
                      description:
                        "[Output only] The status of the route. This status only applies to\ndynamic routes learned by Cloud Routers. This status is not applicable\nto static routes.",
                    },
                    description: {
                      type: "string",
                      description:
                        "An optional description of this resource. Provide this field when you\ncreate the resource.",
                    },
                    nextHopHub: {
                      type: "string",
                      description:
                        "[Output Only] The full resource name of the Network Connectivity Center hub\nthat will handle matching packets.",
                    },
                    asPaths: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          pathSegmentType: {
                            type: "string",
                            enum: [
                              "AS_CONFED_SEQUENCE",
                              "AS_CONFED_SET",
                              "AS_SEQUENCE",
                              "AS_SET",
                            ],
                            description:
                              "[Output Only] The type of the AS Path, which can be one of the following\nvalues: \n- 'AS_SET': unordered set of autonomous systems that the route\nin has traversed  \n- 'AS_SEQUENCE': ordered set of autonomous\nsystems that the route has traversed  \n- 'AS_CONFED_SEQUENCE':\nordered set of Member Autonomous Systems in the local confederation that\nthe route has traversed  \n- 'AS_CONFED_SET': unordered set of\nMember Autonomous Systems in the local confederation that the route has\ntraversed",
                          },
                          asLists: {
                            type: "array",
                            items: {
                              type: "integer",
                              description: "Format: uint32",
                            },
                            description:
                              "[Output Only] The AS numbers of the AS Path.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "[Output Only] AS path.",
                    },
                    warnings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                value: {
                                  type: "string",
                                  description:
                                    "[Output Only] A warning data value corresponding to the key.",
                                },
                                key: {
                                  type: "string",
                                  description:
                                    "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
                          },
                          message: {
                            type: "string",
                            description:
                              "[Output Only] A human-readable description of the warning code.",
                          },
                          code: {
                            type: "string",
                            enum: [
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
                              "[Output Only] A warning code, if applicable. For example, Compute\nEngine returns NO_RESULTS_ON_PAGE if there\nare no results in the response.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] If potential misconfigurations are detected for this\nroute, this field will be populated with warning messages.",
                    },
                    nextHopGateway: {
                      type: "string",
                      description:
                        "The URL to a gateway that should handle matching packets.\nYou can only specify the internet gateway using a full or\npartial valid URL: projects/project/global/gateways/default-internet-gateway",
                    },
                    nextHopIp: {
                      type: "string",
                      description:
                        "The network IP address of an instance that should handle matching packets.\nBoth IPv6 address and IPv4 addresses are supported.\nMust specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or\nan IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or\n2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952\ncompressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an\nIPv4-mapped IPv6 address.",
                    },
                    nextHopInterRegionCost: {
                      type: "integer",
                      description:
                        "[Output only] Internal fixed region-to-region cost that Google Cloud\ncalculates based on factors such as network performance, distance, and\navailable bandwidth between regions. (Format: uint32)",
                    },
                    creationTimestamp: {
                      type: "string",
                      description:
                        "[Output Only] Creation timestamp inRFC3339\ntext format.",
                    },
                    id: {
                      type: "string",
                      description:
                        "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
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
                      description: "Additional route parameters.",
                      additionalProperties: true,
                    },
                    nextHopVpnTunnel: {
                      type: "string",
                      description:
                        "The URL to a VpnTunnel that should handle matching packets.",
                    },
                    destRange: {
                      type: "string",
                      description:
                        "The destination range of outgoing packets that this route applies to. Both\nIPv4 and IPv6 are supported.\nMust specify an IPv4 range (e.g. 192.0.2.0/24) or an IPv6 range in RFC 4291\nformat (e.g. 2001:db8::/32). IPv6 range will be displayed using RFC 5952\ncompressed format.",
                    },
                    nextHopOrigin: {
                      type: "string",
                      enum: ["EGP", "IGP", "INCOMPLETE"],
                      description:
                        "[Output Only] Indicates the origin of the route. Can be IGP\n(Interior Gateway Protocol), EGP (Exterior Gateway Protocol),\nor INCOMPLETE.",
                    },
                    network: {
                      type: "string",
                      description:
                        "Fully-qualified URL of the network that this route applies to.",
                    },
                    nextHopNetwork: {
                      type: "string",
                      description:
                        "The URL of the local network if it should handle matching packets.",
                    },
                    nextHopInstance: {
                      type: "string",
                      description:
                        "The URL to an instance that should handle matching packets. You can specify\nthis as a full or partial URL.\nFor example: \nhttps://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
                    },
                    name: {
                      type: "string",
                      description:
                        "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all following characters (except for the last\ncharacter) must be a dash, lowercase letter, or digit. The last character\nmust be a lowercase letter or digit.",
                    },
                    nextHopIlb: {
                      type: "string",
                      description:
                        "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching\npackets or the IP address of the forwarding Rule.\nFor example, the following are all valid URLs:\n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule \n   - regions/region/forwardingRules/forwardingRule\n\n\nIf an IP address is provided, must specify an IPv4 address in dot-decimal\nnotation or an IPv6 address in RFC 4291 format. For example, the following\nare all valid IP addresses:\n   \n   \n      - 10.128.0.56\n      - 2001:db8::2d9:51:0:0\n      - 2001:db8:0:0:2d9:51:0:0\n\n\nIPv6 addresses will be displayed using RFC 5952 compressed format (e.g.\n2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
                    },
                    nextHopPeering: {
                      type: "string",
                      description:
                        "[Output Only] The network peering name that should handle matching packets,\nwhich should conform to RFC1035.",
                    },
                    selfLink: {
                      type: "string",
                      description:
                        "[Output Only] Server-defined fully-qualified URL for this resource.",
                    },
                    priority: {
                      type: "integer",
                      description:
                        "The priority of this route. Priority is used to break ties in cases\nwhere there is more than one matching route of equal prefix length. In\ncases where multiple routes have equal prefix length, the one with the\nlowest-numbered priority value wins. The default value is `1000`. The\npriority value must be from `0` to `65535`, inclusive. (Format: uint32)",
                    },
                  },
                  description:
                    "Represents a Route resource.\n\nA route defines a path from VM instances in the VPC network to a specific\ndestination. This destination can be inside or outside the VPC network.\nFor more information, read theRoutes overview.",
                  additionalProperties: true,
                },
                description:
                  "A list of the best BGP routes learned by this Cloud Router.\n\nIt is possible that routes listed might not be programmed into the data\nplane, if the Google Cloud control plane finds a more optimal route for a\nprefix than a route learned by this Cloud Router.",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description: "Type of resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default routersGetRouterStatus;
