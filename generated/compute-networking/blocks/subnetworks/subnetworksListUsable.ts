import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const subnetworksListUsable: AppBlock = {
  name: "Subnetworks - List Usable",
  description: `Retrieves an aggregated list of all usable subnetworks in the project.`,
  category: "Subnetworks",
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
        serviceProject: {
          name: "Service Project",
          description:
            "The project id or project number in which the subnetwork is intended to be\nused. Only applied for Shared VPC. See [Shared VPC\ndocumentation](https://cloud.google.com/vpc/docs/shared-vpc/)",
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
        let path = `projects/{project}/aggregated/subnetworks/listUsable`;

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
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Alwayscompute#usableSubnetworksAggregatedList for aggregated lists\nof usable subnetworks.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server.",
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
                stackType: {
                  type: "string",
                  enum: ["IPV4_IPV6", "IPV4_ONLY", "IPV6_ONLY"],
                  description:
                    "The stack type for the subnet. If set to IPV4_ONLY, new VMs\nin the subnet are assigned IPv4 addresses only. If set toIPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and\nIPv6 addresses. If not specified, IPV4_ONLY is used.\n\nThis field can be both set at resource creation time and updated usingpatch.",
                },
                internalIpv6Prefix: {
                  type: "string",
                  description:
                    "[Output Only] The internal IPv6 address range that is assigned to this\nsubnetwork.",
                },
                subnetwork: {
                  type: "string",
                  description: "Subnetwork URL.",
                },
                network: {
                  type: "string",
                  description: "Network URL.",
                },
                role: {
                  type: "string",
                  enum: ["ACTIVE", "BACKUP"],
                  description:
                    "The role of subnetwork. Currently, this field is only used when\npurpose is set to GLOBAL_MANAGED_PROXY orREGIONAL_MANAGED_PROXY. The value can be set toACTIVE or BACKUP. An ACTIVE\nsubnetwork is one that is currently being used for Envoy-based load\nbalancers in a region. A BACKUP subnetwork is one that is\nready to be promoted to ACTIVE or is currently draining.\nThis field can be updated with a patch request.",
                },
                purpose: {
                  type: "string",
                  enum: [
                    "GLOBAL_MANAGED_PROXY",
                    "INTERNAL_HTTPS_LOAD_BALANCER",
                    "PEER_MIGRATION",
                    "PRIVATE",
                    "PRIVATE_NAT",
                    "PRIVATE_RFC_1918",
                    "PRIVATE_SERVICE_CONNECT",
                    "REGIONAL_MANAGED_PROXY",
                  ],
                },
                secondaryIpRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      rangeName: {
                        type: "string",
                        description:
                          "The name associated with this subnetwork secondary range, used when adding\nan alias IP range to a VM instance.\nThe name must be 1-63 characters long, and comply withRFC1035.\nThe name must be unique within the subnetwork.",
                      },
                      ipCidrRange: {
                        type: "string",
                        description:
                          "The range of IP addresses belonging to this subnetwork secondary range.",
                      },
                    },
                    description: "Secondary IP range of a usable subnetwork.",
                    additionalProperties: true,
                  },
                  description: "Secondary IP ranges.",
                },
                externalIpv6Prefix: {
                  type: "string",
                  description:
                    "[Output Only] The external IPv6 address range that is assigned to this\nsubnetwork.",
                },
                ipv6AccessType: {
                  type: "string",
                  enum: ["EXTERNAL", "INTERNAL"],
                  description:
                    "The access type of IPv6 address this subnet holds. It's immutable and can\nonly be specified during creation or the first time the subnet is updated\ninto IPV4_IPV6 dual stack.",
                },
                ipCidrRange: {
                  type: "string",
                  description:
                    "The range of internal addresses that are owned by this subnetwork.",
                },
              },
              description:
                "Subnetwork which the current user has compute.subnetworks.use permission on.",
              additionalProperties: true,
            },
            description: "[Output] A list of usable subnetwork URLs.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.\nIn special cases listUsable may return 0 subnetworks andnextPageToken which still should be used to get the\nnext page of results.",
          },
          scopedWarnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
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
                  description:
                    "An informational warning about unreachable scope",
                  additionalProperties: true,
                },
                scopeName: {
                  type: "string",
                  description:
                    "Name of the scope containing this set of Subnetworks.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] Informational warning messages for failures encountered from\nscopes.",
          },
          unreachables: {
            type: "array",
            items: {
              type: "string",
            },
            description: "[Output Only] Unreachable resources.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default subnetworksListUsable;
