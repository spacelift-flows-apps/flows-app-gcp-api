import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const vpnGatewaysList: AppBlock = {
  name: "VPN Gateways - List",
  description: `Retrieves a list of VPN gateways available to the specified project and region.`,
  category: "VPN Gateways",
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
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
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
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
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
        let path = `projects/{project}/regions/{region}/vpnGateways`;

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
          warning: {
            type: "object",
            properties: {
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
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#vpnGateway for\nVPN gateways.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                gatewayIpVersion: {
                  type: "string",
                  enum: ["IPV4", "IPV6"],
                  description:
                    "The IP family of the gateway IPs for the HA-VPN gateway interfaces. If not\nspecified, IPV4 will be used.",
                },
                vpnInterfaces: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      interconnectAttachment: {
                        type: "string",
                        description:
                          "URL of the VLAN attachment (interconnectAttachment) resource for this\nVPN gateway interface. When the value of this field is present, the VPN\ngateway is used for HA VPN over Cloud Interconnect; all egress\nor ingress traffic for this VPN gateway interface goes through the\nspecified VLAN attachment resource.",
                      },
                      ipAddress: {
                        type: "string",
                        description:
                          "[Output Only] IP address for this VPN interface associated with the VPN\ngateway.\nThe IP address could be either a regional external IP address or\na regional internal IP address. The two IP addresses for a VPN gateway\nmust be all regional external or regional internal IP addresses. There\ncannot be a mix of regional external IP addresses and regional internal\nIP addresses. For HA VPN over Cloud Interconnect, the IP addresses\nfor both interfaces could either be regional internal IP addresses or\nregional external IP addresses. For regular (non HA VPN over Cloud\nInterconnect) HA VPN tunnels, the IP address must be a regional external\nIP address.",
                      },
                      id: {
                        type: "integer",
                        description:
                          "[Output Only] Numeric identifier for this VPN interface associated with\nthe VPN gateway. (Format: uint32)",
                      },
                      ipv6Address: {
                        type: "string",
                        description:
                          "[Output Only] IPv6 address for this VPN interface associated with the VPN\ngateway.\nThe IPv6 address must be a regional external IPv6 address. The format is\nRFC 5952 format (e.g. 2001:db8::2d9:51:0:0).",
                      },
                    },
                    description: "A VPN gateway interface.",
                    additionalProperties: true,
                  },
                  description:
                    "The list of VPN interfaces associated with this VPN gateway.",
                },
                stackType: {
                  type: "string",
                  enum: ["IPV4_IPV6", "IPV4_ONLY", "IPV6_ONLY"],
                  description:
                    "The stack type for this VPN gateway to identify the IP protocols that are\nenabled. Possible values are: IPV4_ONLY,IPV4_IPV6, IPV6_ONLY. If not specified,IPV4_ONLY is used if the gateway IP version isIPV4, or IPV4_IPV6 if the gateway IP version isIPV6.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the VPN gateway resides.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of resource. Always compute#vpnGateway for\nVPN gateways.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this VpnGateway, which\nis essentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a VpnGateway. (Format: byte)",
                },
                network: {
                  type: "string",
                  description:
                    "URL of the network to which this VPN gateway is attached. Provided by the\nclient when the VPN gateway is created.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
                },
              },
              description:
                "Represents a HA VPN gateway.\n\nHA VPN is a high-availability (HA) Cloud VPN solution that lets you securely\nconnect your on-premises network to your Google Cloud Virtual Private Cloud\nnetwork through an IPsec VPN connection in a single region.\nFor more information about Cloud HA VPN solutions, see\nCloud VPN topologies .",
              additionalProperties: true,
            },
            description: "A list of VpnGateway resources.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
        },
        description: "Contains a list of VpnGateway resources.",
        additionalProperties: true,
      },
    },
  },
};

export default vpnGatewaysList;
