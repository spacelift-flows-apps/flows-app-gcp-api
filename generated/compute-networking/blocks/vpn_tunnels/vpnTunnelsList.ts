import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const vpnTunnelsList: AppBlock = {
  name: "VPN Tunnels - List",
  description: `Retrieves a list of VpnTunnel resources contained in the specified project and region.`,
  category: "VPN Tunnels",
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
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
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
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
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
        let path = `projects/{project}/regions/{region}/vpnTunnels`;

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
          warning: {
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
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                sharedSecretHash: {
                  type: "string",
                  description: "Hash of the shared secret.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of resource. Always compute#vpnTunnel for\nVPN tunnels.",
                },
                ikeVersion: {
                  type: "integer",
                  description:
                    "IKE protocol version to use when establishing the VPN tunnel with the peer\nVPN gateway. Acceptable IKE versions are 1 or 2.\nThe default version is 2. (Format: int32)",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
                },
                peerIp: {
                  type: "string",
                  description:
                    "IP address of the peer VPN gateway. Only IPv4 is supported. This field can\nbe set only for Classic VPN tunnels.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this VpnTunnel, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a VpnTunnel. (Format: byte)",
                },
                router: {
                  type: "string",
                  description:
                    "URL of the router resource to be used for dynamic routing.",
                },
                vpnGateway: {
                  type: "string",
                  description:
                    "URL of the VPN gateway with which this VPN tunnel is associated.\nProvided by the client when the VPN tunnel is created. This must be\nused (instead of target_vpn_gateway) if a High Availability VPN gateway\nresource is created.",
                },
                peerGcpGateway: {
                  type: "string",
                  description:
                    "URL of the peer side HA VPN gateway to which this VPN tunnel\nis connected. Provided by the client when the VPN tunnel is created.\nThis field can be used when creating highly available VPN from VPC network\nto VPC network, the field is exclusive with the field peerExternalGateway.\nIf provided, the VPN tunnel will automatically use the same\nvpnGatewayInterface ID in the peer Google Cloud VPN gateway.",
                },
                cipherSuite: {
                  type: "object",
                  properties: {
                    phase2: {
                      type: "object",
                      properties: {
                        integrity: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        encryption: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        pfs: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                      additionalProperties: true,
                    },
                    phase1: {
                      type: "object",
                      properties: {
                        integrity: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        prf: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        dh: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        encryption: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                status: {
                  type: "string",
                  enum: [
                    "ALLOCATING_RESOURCES",
                    "AUTHORIZATION_ERROR",
                    "DEPROVISIONING",
                    "ESTABLISHED",
                    "FAILED",
                    "FIRST_HANDSHAKE",
                    "NEGOTIATION_FAILURE",
                    "NETWORK_ERROR",
                    "NO_INCOMING_PACKETS",
                    "PROVISIONING",
                    "REJECTED",
                    "STOPPED",
                    "WAITING_FOR_FULL_CONFIG",
                  ],
                  description:
                    "[Output Only] The status of the VPN tunnel, which can be one of the\nfollowing:\n   \n   - PROVISIONING: Resource is being allocated for the VPN tunnel.\n   - WAITING_FOR_FULL_CONFIG: Waiting to receive all VPN-related configs\n   from\n     the user. Network, TargetVpnGateway, VpnTunnel, ForwardingRule, and Route\n     resources are needed to setup the VPN tunnel.\n   - FIRST_HANDSHAKE: Successful first handshake with the peer VPN.\n   - ESTABLISHED: Secure session is successfully established with the peer\n   VPN. \n   - NETWORK_ERROR: Deprecated, replaced by\n   NO_INCOMING_PACKETS \n   - AUTHORIZATION_ERROR: Auth error (for example,\n   bad shared secret). \n   - NEGOTIATION_FAILURE: Handshake failed.\n   - DEPROVISIONING: Resources are being deallocated for the VPN\n   tunnel. \n   - FAILED: Tunnel creation has failed and the tunnel is not\n   ready to be used. \n   - NO_INCOMING_PACKETS: No incoming packets from\n   peer. \n   - REJECTED: Tunnel configuration was rejected, can be result\n   of being denied access. \n   - ALLOCATING_RESOURCES: Cloud VPN is in the\n   process of allocating all required resources.\n   - STOPPED: Tunnel is stopped due to its Forwarding Rules being deleted\n   for Classic VPN tunnels or the project is in frozen state.\n   - PEER_IDENTITY_MISMATCH: Peer identity does not match peer IP,\n   probably behind NAT. \n   - TS_NARROWING_NOT_ALLOWED: Traffic selector\n   narrowing not allowed for an HA-VPN tunnel.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                remoteTrafficSelector: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Remote traffic selectors to use when establishing the VPN tunnel with\nthe peer VPN gateway. The value should be a CIDR formatted string,\nfor example: 192.168.0.0/16. The ranges should be disjoint. Only IPv4 is\nsupported for Classic VPN tunnels. This field is output only for HA VPN\ntunnels.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                sharedSecret: {
                  type: "string",
                  description:
                    "Shared secret used to set the secure session between the Cloud VPN gateway\nand the peer VPN gateway.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
                },
                detailedStatus: {
                  type: "string",
                  description:
                    "[Output Only] Detailed status message for the VPN tunnel.",
                },
                vpnGatewayInterface: {
                  type: "integer",
                  description:
                    "The interface ID of the VPN gateway with which this VPN tunnel is\nassociated.\nPossible values are: `0`, `1`. (Format: int32)",
                },
                targetVpnGateway: {
                  type: "string",
                  description:
                    "URL of the Target VPN gateway with which this VPN tunnel is associated.\nProvided by the client when the VPN tunnel is created.\nThis field can be set only for Classic VPN tunnels.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                peerExternalGateway: {
                  type: "string",
                  description:
                    "URL of the peer side external VPN gateway to which this VPN tunnel is\nconnected.\nProvided by the client when the VPN tunnel is created.\nThis field is exclusive with the field peerGcpGateway.",
                },
                localTrafficSelector: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Local traffic selector to use when establishing the VPN tunnel with the\npeer VPN gateway. The value should be a CIDR formatted string, for\nexample: 192.168.0.0/16. The ranges must be disjoint.\nOnly IPv4 is supported for Classic VPN tunnels. This field is output only\nfor HA VPN tunnels.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the VPN tunnel resides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
                },
                peerExternalGatewayInterface: {
                  type: "integer",
                  description:
                    "The interface ID of the external VPN gateway to which this VPN tunnel is\nconnected. Provided by the client when the VPN tunnel is created.\nPossible values are: `0`, `1`, `2`, `3`. The number of IDs in use\ndepends on the external VPN gateway redundancy type. (Format: int32)",
                },
              },
              description:
                "Represents a Cloud VPN Tunnel resource.\n\nFor more information about VPN, read the\nthe Cloud VPN Overview.",
              additionalProperties: true,
            },
            description: "A list of VpnTunnel resources.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#vpnTunnel for\nVPN tunnels.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
        },
        description: "Contains a list of VpnTunnel resources.",
        additionalProperties: true,
      },
    },
  },
};

export default vpnTunnelsList;
