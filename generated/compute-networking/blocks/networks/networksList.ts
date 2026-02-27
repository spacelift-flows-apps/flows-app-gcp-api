import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const networksList: AppBlock = {
  name: "Networks - List",
  description: `Retrieves the list of networks available to the specified project.`,
  category: "Networks",
  inputs: {
    default: {
      config: {
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
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
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
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
        let path = `projects/{project}/global/networks`;

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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
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
                  description:
                    "[Output Only] Server-defined URL for the resource.",
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
                                description:
                                  "The status of the update request.",
                              },
                              deleteStatus: {
                                type: "string",
                                enum: [
                                  "DELETE_ACKNOWLEDGED",
                                  "DELETE_STATUS_UNSPECIFIED",
                                  "LOCAL_DELETE_REQUESTED",
                                  "PEER_DELETE_REQUESTED",
                                ],
                                description:
                                  "The status of the delete request.",
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
            description: "A list of Network resources.",
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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#networkList for\nlists of networks.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
        },
        description: "Contains a list of networks.",
        additionalProperties: true,
      },
    },
  },
};

export default networksList;
