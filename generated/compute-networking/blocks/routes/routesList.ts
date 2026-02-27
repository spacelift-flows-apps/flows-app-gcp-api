import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const routesList: AppBlock = {
  name: "Routes - List",
  description: `Retrieves the list of Route resources available to the specified project.`,
  category: "Routes",
  inputs: {
    default: {
      config: {
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
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
        let path = `projects/{project}/global/routes`;

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
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          items: {
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
            description: "A list of Route resources.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          warning: {
            type: "object",
            properties: {
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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description: "Type of resource.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
        },
        description: "Contains a list of Route resources.",
        additionalProperties: true,
      },
    },
  },
};

export default routesList;
