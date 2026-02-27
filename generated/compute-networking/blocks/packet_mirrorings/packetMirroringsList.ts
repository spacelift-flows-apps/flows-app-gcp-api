import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const packetMirroringsList: AppBlock = {
  name: "Packet Mirrorings - List",
  description: `Retrieves a list of PacketMirroring resources available to the specified project and region.`,
  category: "Packet Mirrorings",
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
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
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
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
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
        let path = `projects/{project}/regions/{region}/packetMirrorings`;

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
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                region: {
                  type: "string",
                  description:
                    "[Output Only] URI of the region where the packetMirroring resides.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#packetMirroring for packet mirrorings.",
                },
                priority: {
                  type: "integer",
                  description:
                    "The priority of applying this configuration. Priority is used to break ties\nin cases where there is more than one matching rule. In the case of two\nrules that apply for a given Instance, the one with the lowest-numbered\npriority value wins.\n\nDefault value is 1000. Valid range is 0 through 65535. (Format: uint32)",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                enable: {
                  type: "string",
                  enum: ["FALSE", "TRUE"],
                  description:
                    "Indicates whether or not this packet mirroring takes effect.\nIf set to FALSE, this packet mirroring policy will not be enforced on the\nnetwork.\n\nThe default is TRUE.",
                },
                filter: {
                  type: "object",
                  properties: {
                    direction: {
                      type: "string",
                      enum: ["BOTH", "EGRESS", "INGRESS"],
                      description:
                        "Direction of traffic to mirror, either INGRESS, EGRESS, or BOTH.\nThe default is BOTH.",
                    },
                    IPProtocols: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Protocols that apply as filter on mirrored traffic.\nIf no protocols are specified, all traffic that matches the specified\nCIDR ranges is mirrored.\nIf neither cidrRanges nor IPProtocols is specified, all IPv4 traffic is\nmirrored.",
                    },
                    cidrRanges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'One or more IPv4 or IPv6 CIDR ranges that apply as filters on the source\n(ingress) or destination (egress) IP in the IP header. If no ranges are\nspecified, all IPv4 traffic that matches the specified IPProtocols is\nmirrored. If neither cidrRanges nor IPProtocols is specified, all IPv4\ntraffic is mirrored. To mirror all IPv4 and IPv6 traffic, use\n"0.0.0.0/0,::/0".',
                    },
                  },
                  additionalProperties: true,
                },
                collectorIlb: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description:
                        "Resource URL to the forwarding rule representing the ILB\nconfigured as destination of the mirrored traffic.",
                    },
                    canonicalUrl: {
                      type: "string",
                      description:
                        "[Output Only] Unique identifier for the forwarding rule; defined by the\nserver.",
                    },
                  },
                  additionalProperties: true,
                },
                mirroredResources: {
                  type: "object",
                  properties: {
                    subnetworks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          url: {
                            type: "string",
                            description:
                              "Resource URL to the subnetwork for which\ntraffic from/to all VM instances will be mirrored.",
                          },
                          canonicalUrl: {
                            type: "string",
                            description:
                              "[Output Only] Unique identifier for the subnetwork; defined by the\nserver.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A set of subnetworks for which traffic from/to all VM instances will be\nmirrored. They must live in the same region as this packetMirroring.\n\nYou may specify a maximum of 5 subnetworks.",
                    },
                    instances: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          canonicalUrl: {
                            type: "string",
                            description:
                              "[Output Only] Unique identifier for the instance; defined by the\nserver.",
                          },
                          url: {
                            type: "string",
                            description:
                              "Resource URL to the virtual machine instance which is being mirrored.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A set of virtual machine instances that are being mirrored.\nThey must live in zones contained in the same region as this\npacketMirroring.\n\nNote that this config will apply only to those network interfaces of the\nInstances that belong to the network specified in this packetMirroring.\n\nYou may specify a maximum of 50 Instances.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A set of mirrored tags. Traffic from/to all VM instances that have one or\nmore of these tags will be mirrored.",
                    },
                  },
                  additionalProperties: true,
                },
                network: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description: "URL of the network resource.",
                    },
                    canonicalUrl: {
                      type: "string",
                      description:
                        "[Output Only] Unique identifier for the network; defined by the server.",
                    },
                  },
                  additionalProperties: true,
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
              },
              description:
                "Represents a Packet Mirroring resource.\n\nPacket Mirroring clones the traffic of specified instances in your Virtual\nPrivate Cloud (VPC) network and forwards it to a collector destination,\nsuch as an instance group of an internal TCP/UDP load balancer, for analysis\nor examination.\nFor more information about setting up Packet Mirroring, seeUsing Packet Mirroring.",
              additionalProperties: true,
            },
            description: "A list of PacketMirroring resources.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#packetMirroring\nfor packetMirrorings.",
          },
        },
        description: "Contains a list of PacketMirroring resources.",
        additionalProperties: true,
      },
    },
  },
};

export default packetMirroringsList;
