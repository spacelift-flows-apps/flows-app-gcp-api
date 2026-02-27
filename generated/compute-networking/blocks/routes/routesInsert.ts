import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const routesInsert: AppBlock = {
  name: "Routes - Insert",
  description: `Creates a Route resource in the specified project using the data included in the request.`,
  category: "Routes",
  inputs: {
    default: {
      config: {
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of this resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of this resource. Always compute#routes for\nRoute resources.",
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: "A list of instance tags to which this route applies.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of instance tags to which this route applies.",
          },
          required: false,
        },
        nextHopMed: {
          name: "Next Hop Med",
          description:
            "[Output Only] Multi-Exit Discriminator, a BGP route metric that indicates the desirability of a particular route in a network.",
          type: {
            type: "integer",
            description:
              "[Output Only] Multi-Exit Discriminator, a BGP route metric that indicates\nthe desirability of a particular route in a network. (Format: uint32)",
          },
          required: false,
        },
        routeType: {
          name: "Route Type",
          description:
            "[Output Only] The type of this route, which can be one of the following values: - 'TRANSIT' for a tr...",
          type: {
            type: "string",
            enum: ["BGP", "STATIC", "SUBNET", "TRANSIT"],
            description:
              "[Output Only] The type of this route, which can be one of the following\nvalues:\n- 'TRANSIT' for a transit route that this router learned from\nanother Cloud Router and will readvertise to one of its BGP peers \n- 'SUBNET' for a route from a subnet of the VPC \n- 'BGP' for a route learned from a BGP peer of this router \n- 'STATIC' for a static route",
          },
          required: false,
        },
        routeStatus: {
          name: "Route Status",
          description: "[Output only] The status of the route.",
          type: {
            type: "string",
            enum: ["ACTIVE", "DROPPED", "INACTIVE", "PENDING"],
            description:
              "[Output only] The status of the route. This status only applies to\ndynamic routes learned by Cloud Routers. This status is not applicable\nto static routes.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you\ncreate the resource.",
          },
          required: false,
        },
        nextHopHub: {
          name: "Next Hop Hub",
          description:
            "[Output Only] The full resource name of the Network Connectivity Center hub that will handle matching packets.",
          type: {
            type: "string",
            description:
              "[Output Only] The full resource name of the Network Connectivity Center hub\nthat will handle matching packets.",
          },
          required: false,
        },
        asPaths: {
          name: "As Paths",
          description: "[Output Only] AS path.",
          type: {
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
                  description: "[Output Only] The AS numbers of the AS Path.",
                },
              },
              additionalProperties: true,
            },
            description: "[Output Only] AS path.",
          },
          required: false,
        },
        warnings: {
          name: "Warnings",
          description:
            "[Output Only] If potential misconfigurations are detected for this route, this field will be populated with warning messages.",
          type: {
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
          required: false,
        },
        nextHopGateway: {
          name: "Next Hop Gateway",
          description:
            "The URL to a gateway that should handle matching packets.",
          type: {
            type: "string",
            description:
              "The URL to a gateway that should handle matching packets.\nYou can only specify the internet gateway using a full or\npartial valid URL: projects/project/global/gateways/default-internet-gateway",
          },
          required: false,
        },
        nextHopIp: {
          name: "Next Hop IP",
          description:
            "The network IP address of an instance that should handle matching packets.",
          type: {
            type: "string",
            description:
              "The network IP address of an instance that should handle matching packets.\nBoth IPv6 address and IPv4 addresses are supported.\nMust specify an IPv4 address in dot-decimal notation (e.g. 192.0.2.99) or\nan IPv6 address in RFC 4291 format (e.g. 2001:db8::2d9:51:0:0 or\n2001:db8:0:0:2d9:51:0:0). IPv6 addresses will be displayed using RFC 5952\ncompressed format (e.g. 2001:db8::2d9:51:0:0). Should never be an\nIPv4-mapped IPv6 address.",
          },
          required: false,
        },
        nextHopInterRegionCost: {
          name: "Next Hop Inter Region Cost",
          description:
            "[Output only] Internal fixed region-to-region cost that Google Cloud calculates based on factors such as network performance, distance, and available bandwidth between regions.",
          type: {
            type: "integer",
            description:
              "[Output only] Internal fixed region-to-region cost that Google Cloud\ncalculates based on factors such as network performance, distance, and\navailable bandwidth between regions. (Format: uint32)",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "[Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description: "[Output Only] The unique identifier for the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          required: false,
        },
        params: {
          name: "Params",
          description: "Input only.",
          type: {
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
          required: false,
        },
        nextHopVpnTunnel: {
          name: "Next Hop VPN Tunnel",
          description:
            "The URL to a VpnTunnel that should handle matching packets.",
          type: {
            type: "string",
            description:
              "The URL to a VpnTunnel that should handle matching packets.",
          },
          required: false,
        },
        destRange: {
          name: "Dest Range",
          description:
            "The destination range of outgoing packets that this route applies to.",
          type: {
            type: "string",
            description:
              "The destination range of outgoing packets that this route applies to. Both\nIPv4 and IPv6 are supported.\nMust specify an IPv4 range (e.g. 192.0.2.0/24) or an IPv6 range in RFC 4291\nformat (e.g. 2001:db8::/32). IPv6 range will be displayed using RFC 5952\ncompressed format.",
          },
          required: false,
        },
        nextHopOrigin: {
          name: "Next Hop Origin",
          description: "[Output Only] Indicates the origin of the route.",
          type: {
            type: "string",
            enum: ["EGP", "IGP", "INCOMPLETE"],
            description:
              "[Output Only] Indicates the origin of the route. Can be IGP\n(Interior Gateway Protocol), EGP (Exterior Gateway Protocol),\nor INCOMPLETE.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "Fully-qualified URL of the network that this route applies to.",
          type: {
            type: "string",
            description:
              "Fully-qualified URL of the network that this route applies to.",
          },
          required: false,
        },
        nextHopNetwork: {
          name: "Next Hop Network",
          description:
            "The URL of the local network if it should handle matching packets.",
          type: {
            type: "string",
            description:
              "The URL of the local network if it should handle matching packets.",
          },
          required: false,
        },
        nextHopInstance: {
          name: "Next Hop Instance",
          description:
            "The URL to an instance that should handle matching packets.",
          type: {
            type: "string",
            description:
              "The URL to an instance that should handle matching packets. You can specify\nthis as a full or partial URL.\nFor example: \nhttps://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all following characters (except for the last\ncharacter) must be a dash, lowercase letter, or digit. The last character\nmust be a lowercase letter or digit.",
          },
          required: false,
        },
        nextHopIlb: {
          name: "Next Hop Ilb",
          description:
            "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching packets or the IP address of the forwarding Rule.",
          type: {
            type: "string",
            description:
              "The URL to a forwarding rule of typeloadBalancingScheme=INTERNAL that should handle matching\npackets or the IP address of the forwarding Rule.\nFor example, the following are all valid URLs:\n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/regions/region/forwardingRules/forwardingRule \n   - regions/region/forwardingRules/forwardingRule\n\n\nIf an IP address is provided, must specify an IPv4 address in dot-decimal\nnotation or an IPv6 address in RFC 4291 format. For example, the following\nare all valid IP addresses:\n   \n   \n      - 10.128.0.56\n      - 2001:db8::2d9:51:0:0\n      - 2001:db8:0:0:2d9:51:0:0\n\n\nIPv6 addresses will be displayed using RFC 5952 compressed format (e.g.\n2001:db8::2d9:51:0:0). Should never be an IPv4-mapped IPv6 address.",
          },
          required: false,
        },
        nextHopPeering: {
          name: "Next Hop Peering",
          description:
            "[Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.",
          type: {
            type: "string",
            description:
              "[Output Only] The network peering name that should handle matching packets,\nwhich should conform to RFC1035.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description:
            "[Output Only] Server-defined fully-qualified URL for this resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Server-defined fully-qualified URL for this resource.",
          },
          required: false,
        },
        priority: {
          name: "Priority",
          description: "The priority of this route.",
          type: {
            type: "integer",
            description:
              "The priority of this route. Priority is used to break ties in cases\nwhere there is more than one matching route of equal prefix length. In\ncases where multiple routes have equal prefix length, the one with the\nlowest-numbered priority value wins. The default value is `1000`. The\npriority value must be from `0` to `65535`, inclusive. (Format: uint32)",
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
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.tags !== undefined)
          requestBody.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.nextHopMed !== undefined)
          requestBody.nextHopMed = input.event.inputConfig.nextHopMed;
        if (input.event.inputConfig.routeType !== undefined)
          requestBody.routeType = input.event.inputConfig.routeType;
        if (input.event.inputConfig.routeStatus !== undefined)
          requestBody.routeStatus = input.event.inputConfig.routeStatus;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.nextHopHub !== undefined)
          requestBody.nextHopHub = input.event.inputConfig.nextHopHub;
        if (input.event.inputConfig.asPaths !== undefined)
          requestBody.asPaths = input.event.inputConfig.asPaths;
        if (input.event.inputConfig.warnings !== undefined)
          requestBody.warnings = input.event.inputConfig.warnings;
        if (input.event.inputConfig.nextHopGateway !== undefined)
          requestBody.nextHopGateway = input.event.inputConfig.nextHopGateway;
        if (input.event.inputConfig.nextHopIp !== undefined)
          requestBody.nextHopIp = input.event.inputConfig.nextHopIp;
        if (input.event.inputConfig.nextHopInterRegionCost !== undefined)
          requestBody.nextHopInterRegionCost =
            input.event.inputConfig.nextHopInterRegionCost;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.nextHopVpnTunnel !== undefined)
          requestBody.nextHopVpnTunnel =
            input.event.inputConfig.nextHopVpnTunnel;
        if (input.event.inputConfig.destRange !== undefined)
          requestBody.destRange = input.event.inputConfig.destRange;
        if (input.event.inputConfig.nextHopOrigin !== undefined)
          requestBody.nextHopOrigin = input.event.inputConfig.nextHopOrigin;
        if (input.event.inputConfig.network !== undefined)
          requestBody.network = input.event.inputConfig.network;
        if (input.event.inputConfig.nextHopNetwork !== undefined)
          requestBody.nextHopNetwork = input.event.inputConfig.nextHopNetwork;
        if (input.event.inputConfig.nextHopInstance !== undefined)
          requestBody.nextHopInstance = input.event.inputConfig.nextHopInstance;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.nextHopIlb !== undefined)
          requestBody.nextHopIlb = input.event.inputConfig.nextHopIlb;
        if (input.event.inputConfig.nextHopPeering !== undefined)
          requestBody.nextHopPeering = input.event.inputConfig.nextHopPeering;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.priority !== undefined)
          requestBody.priority = input.event.inputConfig.priority;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
          targetId: {
            type: "string",
            description:
              "[Output Only] The unique target ID, which identifies a specific incarnation\nof the target resource. (Format: uint64)",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nmessage that was returned, such as `NOT FOUND`.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always `compute#operation` for\nOperation resources.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "[Output Only] Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
            },
            additionalProperties: true,
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the operation. This identifier is\ndefined by the server. (Format: uint64)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only\napplicable when performing regional operations.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server.\nThis value is inRFC3339\ntext format.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only\napplicable when performing per-zone operations.",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the\noperation.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example:\n`user@example.com` or\n`alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
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
                    '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
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
              "[Output Only] If warning messages are generated during processing of the\noperation, this field will be populated.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`,\n`update`, or `delete`, and so on.",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For\noperations related to creating a snapshot, this points to the disk\nthat the snapshot was created from.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          error: {
            type: "object",
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      description:
                        "[Output Only] The error type identifier for this error.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          localizedMessage: {
                            type: "object",
                            properties: {
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at\nhttps://www.rfc-editor.org/rfc/bcp/bcp47.txt.\nExamples are: "en-US", "fr-CH", "es-MX"',
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user\nwhich can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          errorInfo: {
                            type: "object",
                            properties: {
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.\n\nKeys must match a regular expression of `a-z+` but should\nideally be lowerCamelCase. Also, they must be limited to 64 characters in\nlength. When identifying the current value of an exceeded limit, the units\nshould be contained in the key, not the value.  For example, rather than\n`{"instanceLimit": "100/request"}`, should be returned as,\n`{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of\ninstances that can be created in a single (batch) request.',
                              },
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain\nis typically the registered service name of the tool or product that\ngenerates the error. Example: "pubsub.googleapis.com". If the error is\ngenerated by some common infrastructure, the error domain must be a\nglobally unique value that identifies the infrastructure. For Google API\ninfrastructure, the error domain is "googleapis.com".',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the\nproximate cause of the error. Error reasons are unique within a particular\ndomain of errors. This should be at most 63 characters and match a\nregular expression of `A-Z+[A-Z0-9]`, which represents\nUPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.\n\nExample of an error when contacting the "pubsub.googleapis.com" API when it\nis not enabled:\n\n    { "reason": "API_DISABLED"\n      "domain": "googleapis.com"\n      "metadata": {\n        "resource": "projects/123",\n        "service": "pubsub.googleapis.com"\n      }\n    }\n\nThis response indicates that the pubsub.googleapis.com API is not enabled.\n\nExample of an error that is returned when attempting to create a Spanner\ninstance in a region that is out of stock:\n\n    { "reason": "STOCKOUT"\n      "domain": "spanner.googleapis.com",\n      "metadata": {\n        "availableRegions": "us-central1,us-east2"\n      }\n    }',
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type\nor metric. (Format: double)",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota\n type or metric. (Format: double)",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                          help: {
                            type: "object",
                            properties: {
                              links: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                  },
                                  description: "Describes a URL link.",
                                  additionalProperties: true,
                                },
                                description:
                                  "URL(s) pointing to additional information on handling the current error.",
                              },
                            },
                            description:
                              "Provides links to documentation or for performing an out of band action.\n\nFor example, if a quota check failed with an error indicating the calling\nproject hasn't enabled the accessed service, this can contain a URL pointing\ndirectly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error\ndetails. There is a set of defined message types to use for providing\ndetails.The syntax depends on the error code. For example,\nQuotaExceededInfo will have details when the error code is\nQUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error.\nThis property is optional.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this\noperation.",
              },
            },
            description:
              "[Output Only] If errors are generated during processing of the operation,\nthis field will be populated.",
            additionalProperties: true,
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339\ntext format.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nstatus code that was returned. For example, a `404` means the\nresource was not found. (Format: int32)",
          },
          operationGroupId: {
            type: "string",
            description:
              "[Output Only] An ID that represents a group of operations, such as when a\ngroup of operations results from a `bulkInsert` API request.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is\nset when the operation is created.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request.\nNot present otherwise.",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested.\nThis value is inRFC3339\ntext format.",
          },
          status: {
            type: "string",
            enum: ["DONE", "PENDING", "RUNNING"],
            description:
              "[Output Only] The status of the operation, which can be one of the\nfollowing:\n`PENDING`, `RUNNING`, or `DONE`.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100.\nThere is no requirement that this be linear or support any granularity of\noperations. This should not be used to guess when the operation will be\ncomplete. This number should monotonically increase as the operation\nprogresses. (Format: int32)",
          },
        },
        description:
          "Represents an Operation resource.\n\nGoogle Compute Engine has three Operation resources:\n\n* [Global](/compute/docs/reference/rest/v1/globalOperations)\n* [Regional](/compute/docs/reference/rest/v1/regionOperations)\n* [Zonal](/compute/docs/reference/rest/v1/zoneOperations)\n\nYou can use an operation resource to manage asynchronous API requests.\nFor more information, readHandling\nAPI responses.\n\nOperations can be global, regional or zonal.\n   \n   - For global operations, use the `globalOperations`\n   resource. \n   - For regional operations, use the\n   `regionOperations` resource. \n   - For zonal operations, use\n   the `zoneOperations` resource.\n\n\n\nFor more information, read\nGlobal, Regional, and Zonal Resources.\n\nNote that completed Operation resources have a limited \nretention period.",
        additionalProperties: true,
      },
    },
  },
};

export default routesInsert;
