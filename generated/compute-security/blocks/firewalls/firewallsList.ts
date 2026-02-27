import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const firewallsList: AppBlock = {
  name: "Firewalls - List",
  description: `Retrieves the list of firewall rules available to the specified project.`,
  category: "Firewalls",
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
        let path = `projects/{project}/global/firewalls`;

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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                direction: {
                  type: "string",
                  enum: ["EGRESS", "INGRESS"],
                  description:
                    "Direction of traffic to which this firewall applies, either `INGRESS` or\n`EGRESS`. The default is `INGRESS`. For `EGRESS` traffic, you cannot\nspecify the sourceTags fields.",
                },
                sourceServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source service accounts are specified, the firewall rules apply only to\ntraffic originating from an instance with a service account in this list.\nSource service accounts cannot be used to control traffic to an instance's\nexternal IP address because service accounts are associated with an\ninstance, not an IP address.sourceRanges can be set at the same time assourceServiceAccounts.\nIf both are set, the firewall applies to traffic that\nhas a source IP address within the sourceRanges OR a source\nIP that belongs to an instance with service account listed insourceServiceAccount. The connection does not need to match\nboth fields for the firewall to apply.sourceServiceAccounts cannot be used at the same time assourceTags or targetTags.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                sourceTags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source tags are specified, the firewall rule applies only to traffic\nwith source IPs that match the primary network interfaces of VM instances\nthat have the tag and are in the same VPC network.\nSource tags cannot be used to control traffic to an instance's external IP\naddress, it only applies to traffic between instances in the same virtual\nnetwork. Because tags are associated with instances, not IP addresses.\nOne or both of sourceRanges and sourceTags may be\nset. If both fields are set, the firewall applies to traffic that has a\nsource IP address within sourceRanges OR a source IP from a\nresource with a matching tag listed in the sourceTags\nfield. The connection does not need to match both fields for the\nfirewall to apply.",
                },
                targetTags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of tags that controls which instances the firewall rule\napplies to. If targetTags are specified, then the firewall\nrule applies only to instances in the VPC network that have one of those\ntags. If no targetTags are specified, the firewall rule\napplies to all instances on the specified network.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                network: {
                  type: "string",
                  description:
                    "URL of the network resource for this firewall rule. If not\nspecified when creating a firewall rule, the default network\nis used:\n\nglobal/networks/default\n\nIf you choose to specify this field, you can specify the network as a full \nor partial URL. For example, the following are all valid URLs: \n   \n   - \n   https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network \n   - projects/myproject/global/networks/my-network \n   - global/networks/default",
                },
                disabled: {
                  type: "boolean",
                  description:
                    "Denotes whether the firewall rule is disabled. When set to true, the\nfirewall rule is not enforced and the network behaves as if it did not\nexist. If this is unspecified, the firewall rule will be enabled.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always compute#firewall\nfor firewall rules.",
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
                  description: "Additional firewall parameters.",
                  additionalProperties: true,
                },
                logConfig: {
                  type: "object",
                  properties: {
                    enable: {
                      type: "boolean",
                      description:
                        "This field denotes whether to enable logging for a particular firewall\nrule.",
                    },
                    metadata: {
                      type: "string",
                      enum: ["EXCLUDE_ALL_METADATA", "INCLUDE_ALL_METADATA"],
                      description:
                        "This field can only be specified for a particular firewall rule if\nlogging is enabled for that rule. This field denotes whether to include\nor exclude metadata for firewall logs.",
                    },
                  },
                  description:
                    "The available logging options for a firewall rule.",
                  additionalProperties: true,
                },
                destinationRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If destination ranges are specified, the firewall rule applies only to\ntraffic that has destination IP address in these ranges. These ranges must\nbe expressed inCIDR format. Both IPv4 and IPv6 are supported.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this field when you\ncreate the resource.",
                },
                sourceRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source ranges are specified, the firewall rule applies only to traffic\nthat has a source IP address in these ranges. These ranges must be\nexpressed inCIDR format. One or both of sourceRanges\nand sourceTags may be set.\nIf both fields are set, the rule applies to traffic that has a\nsource IP address within sourceRanges OR a source IP\nfrom a resource with a matching tag listed in thesourceTags field. The connection does not need to match\nboth fields for the rule to\napply. Both IPv4 and IPv6 are supported.",
                },
                denied: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ports: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'An optional list of ports to which this rule applies.\nThis field is only applicable for the UDP or TCP protocol.\nEach entry must be either an integer or a range.\nIf not specified, this rule applies to connections through any port.\n\nExample inputs include: ["22"], ["80","443"],\nand ["12345-12349"].',
                      },
                      IPProtocol: {
                        type: "string",
                        description:
                          "The IP protocol to which this rule applies. The protocol type is\nrequired when creating a firewall rule. This value can either be one of the\nfollowing well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The list of DENY rules specified by this firewall. Each rule specifies a\nprotocol and port-range tuple that describes a denied connection.",
                },
                targetServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of service accounts indicating sets of instances located in the\nnetwork that may make network connections as specified inallowed[].targetServiceAccounts cannot be used at the same time astargetTags or sourceTags.\nIf neither targetServiceAccounts nor targetTags\nare specified, the firewall rule applies to all instances on the specified\nnetwork.",
                },
                allowed: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ports: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'An optional list of ports to which this rule applies.\nThis field is only applicable for the UDP or TCP protocol.\nEach entry must be either an integer or a range.\nIf not specified, this rule applies to connections through any port.\n\nExample inputs include: ["22"], ["80","443"],\nand ["12345-12349"].',
                      },
                      IPProtocol: {
                        type: "string",
                        description:
                          "The IP protocol to which this rule applies. The protocol type is\nrequired when creating a firewall rule. This value can either be one of the\nfollowing well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The list of ALLOW rules specified by this firewall. Each rule specifies a\nprotocol and port-range tuple that describes a permitted connection.",
                },
                priority: {
                  type: "integer",
                  description:
                    "Priority for this rule.\nThis is an integer between `0` and `65535`, both inclusive.\nThe default value is `1000`.\nRelative priorities determine which rule takes effect if multiple rules\napply. Lower values indicate higher priority. For example, a rule with\npriority `0` has higher precedence than a rule with priority `1`.\nDENY rules take precedence over ALLOW rules if they have equal priority.\nNote that VPC networks have implied\nrules with a priority of `65535`. To avoid conflicts with the implied\nrules, use a priority number less than `65535`. (Format: int32)",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character\nmust be a lowercase letter, and all following characters (except for the\nlast character) must be a dash, lowercase letter, or digit. The last\ncharacter must be a lowercase letter or digit.",
                },
              },
              description:
                "Represents a Firewall Rule resource.\n\nFirewall rules allow or deny ingress traffic to, and egress traffic from your\ninstances. For more information, readFirewall rules.",
              additionalProperties: true,
            },
            description: "A list of Firewall resources.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#firewallList\nfor lists of firewalls.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
        },
        description: "Contains a list of firewalls.",
        additionalProperties: true,
      },
    },
  },
};

export default firewallsList;
