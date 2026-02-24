import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const publicDelegatedPrefixesList: AppBlock = {
  name: "Public Delegated Prefixes - List",
  description: `Lists the PublicDelegatedPrefixes for a project in the given region.`,
  category: "Public Delegated Prefixes",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region of this request.",
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
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
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
        let path = `projects/{project}/regions/{region}/publicDelegatedPrefixes`;

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
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#publicDelegatedPrefixList for public delegated\nprefixes.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                isLiveMigration: {
                  type: "boolean",
                  description: "If true, the prefix will be live migrated.",
                },
                byoipApiVersion: {
                  type: "string",
                  enum: ["V1", "V2"],
                  description: "[Output Only] The version of BYOIP API.",
                },
                mode: {
                  type: "string",
                  enum: [
                    "DELEGATION",
                    "EXTERNAL_IPV6_FORWARDING_RULE_CREATION",
                    "EXTERNAL_IPV6_SUBNETWORK_CREATION",
                    "INTERNAL_IPV6_SUBNETWORK_CREATION",
                  ],
                  description:
                    "The public delegated prefix mode for IPv6 only.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                publicDelegatedSubPrefixs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "The name of the sub public delegated prefix.",
                      },
                      delegateeProject: {
                        type: "string",
                        description:
                          "Name of the project scoping this PublicDelegatedSubPrefix.",
                      },
                      ipCidrRange: {
                        type: "string",
                        description:
                          "The IP address range, in CIDR format, represented by this sub public\ndelegated prefix.",
                      },
                      status: {
                        type: "string",
                        enum: ["ACTIVE", "INACTIVE"],
                        description:
                          "[Output Only] The status of the sub public delegated prefix.",
                      },
                      region: {
                        type: "string",
                        description:
                          "[Output Only] The region of the sub public delegated prefix if it is\nregional. If absent, the sub prefix is global.",
                      },
                      allocatablePrefixLength: {
                        type: "integer",
                        description:
                          "The allocatable prefix length supported by this PublicDelegatedSubPrefix. (Format: int32)",
                      },
                      isAddress: {
                        type: "boolean",
                        description:
                          "Whether the sub prefix is delegated to create Address resources in the\ndelegatee project.",
                      },
                      mode: {
                        type: "string",
                        enum: [
                          "DELEGATION",
                          "EXTERNAL_IPV6_FORWARDING_RULE_CREATION",
                          "EXTERNAL_IPV6_SUBNETWORK_CREATION",
                          "INTERNAL_IPV6_SUBNETWORK_CREATION",
                        ],
                        description:
                          "The PublicDelegatedSubPrefix mode for IPv6 only.",
                      },
                      description: {
                        type: "string",
                        description:
                          "An optional description of this resource. Provide this property when you\ncreate the resource.",
                      },
                      ipv6AccessType: {
                        type: "string",
                        enum: ["EXTERNAL", "INTERNAL"],
                        description:
                          "[Output Only] The internet access type for IPv6 Public Delegated Sub\nPrefixes. Inherited from parent prefix.",
                      },
                    },
                    description: "Represents a sub PublicDelegatedPrefix.",
                    additionalProperties: true,
                  },
                  description:
                    "The list of sub public delegated prefixes that exist for this public\ndelegated prefix.",
                },
                status: {
                  type: "string",
                  enum: [
                    "ACTIVE",
                    "ANNOUNCED",
                    "ANNOUNCED_TO_GOOGLE",
                    "ANNOUNCED_TO_INTERNET",
                    "DELETING",
                    "INITIALIZING",
                    "READY_TO_ANNOUNCE",
                  ],
                  description:
                    "[Output Only] The status of the public delegated prefix, which can be one\nof following values:\n   \n   \n     - `INITIALIZING` The public delegated prefix is being initialized and\n     addresses cannot be created yet.\n     - `READY_TO_ANNOUNCE` The public delegated prefix is a live migration\n     prefix and is active.\n     - `ANNOUNCED` The public delegated prefix is announced and ready to\n     use.\n     - `DELETING` The public delegated prefix is being deprovsioned.\n     - `ACTIVE` The public delegated prefix is ready to use.",
                },
                ipCidrRange: {
                  type: "string",
                  description:
                    "The IP address range, in CIDR format, represented by this public\ndelegated prefix.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#publicDelegatedPrefix for public delegated prefixes.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a new PublicDelegatedPrefix. An up-to-date\nfingerprint must be provided in order to update thePublicDelegatedPrefix, otherwise the request will fail with\nerror 412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a PublicDelegatedPrefix. (Format: byte)",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the public delegated prefix resides.\nThis field applies only to the region resource. You must specify this\nfield as part of the HTTP request URL. It is not settable as a field in\nthe request body.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                parentPrefix: {
                  type: "string",
                  description:
                    "The URL of parent prefix. Either PublicAdvertisedPrefix or\nPublicDelegatedPrefix.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource type. The server\ngenerates this identifier. (Format: uint64)",
                },
                allocatablePrefixLength: {
                  type: "integer",
                  description:
                    "The allocatable prefix length supported by this public delegated prefix.\nThis field is optional and cannot be set for prefixes in DELEGATION mode.\nIt cannot be set for IPv4 prefixes either, and it always defaults to 32. (Format: int32)",
                },
                ipv6AccessType: {
                  type: "string",
                  enum: ["EXTERNAL", "INTERNAL"],
                  description:
                    "[Output Only] The internet access type for IPv6 Public Delegated Prefixes.\nInherited from parent prefix.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
              },
              description:
                "A PublicDelegatedPrefix resource represents an IP block within a\nPublicAdvertisedPrefix that is configured within a single cloud scope\n(global or region). IPs in the block can be allocated to resources within\nthat scope. Public delegated prefixes may be further broken up into\nsmaller IP blocks in the same scope as the parent block.",
              additionalProperties: true,
            },
            description: "A list of PublicDelegatedPrefix resources.",
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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default publicDelegatedPrefixesList;
