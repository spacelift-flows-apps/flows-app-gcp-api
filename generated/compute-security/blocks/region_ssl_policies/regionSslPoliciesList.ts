import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionSslPoliciesList: AppBlock = {
  name: "Region SSL Policies - List",
  description: `Lists all the SSL policies that have been configured for the specified project and region.`,
  category: "Region SSL Policies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
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
        let path = `projects/{project}/regions/{region}/sslPolicies`;

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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                customFeatures: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of features enabled when the selected profile is CUSTOM. The\n method returns the set of features that can be\nspecified in this list. This field must be empty if the profile is notCUSTOM.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. The name must be 1-63 characters long, and comply\nwith RFC1035. Specifically, the name must be 1-63 characters\nlong and match the regular expression\n`[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character\nmust be a lowercase letter, and all following characters must be a dash,\nlowercase letter, or digit, except the last character, which cannot be a\ndash.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
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
                    },
                    additionalProperties: true,
                  },
                  description:
                    "[Output Only] If potential misconfigurations are detected for this\nSSL policy, this field will be populated with warning messages.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output only] Type of the resource. Alwayscompute#sslPolicyfor SSL policies.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the regional SSL policy\nresides. This field is not applicable to global SSL policies.",
                },
                minTlsVersion: {
                  type: "string",
                  enum: ["TLS_1_0", "TLS_1_1", "TLS_1_2", "TLS_1_3"],
                  description:
                    "The minimum version of SSL protocol that can be used by the clients to\nestablish a connection with the load balancer. This can be one ofTLS_1_0, TLS_1_1, TLS_1_2,TLS_1_3. When set to TLS_1_3, the profile field\nmust be set to RESTRICTED.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a SslPolicy. An up-to-date fingerprint must be\nprovided in order to update the SslPolicy, otherwise the\nrequest will fail with error 412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an SslPolicy. (Format: byte)",
                },
                enabledFeatures: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] The list of features enabled in the SSL policy.",
                },
                profile: {
                  type: "string",
                  enum: [
                    "COMPATIBLE",
                    "CUSTOM",
                    "FIPS_202205",
                    "MODERN",
                    "RESTRICTED",
                  ],
                  description:
                    "Profile specifies the set of SSL features that can be used by the load\nbalancer when negotiating SSL with clients. This can be one ofCOMPATIBLE, MODERN, RESTRICTED, orCUSTOM. If using CUSTOM, the set of SSL features\nto enable must be specified in the customFeatures field.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
              },
              description:
                "Represents an SSL Policy resource.\n\nUse SSL policies to control SSL features, such as versions and cipher\nsuites, that are offered by Application Load Balancers and proxy Network Load\nBalancers. For more information, read \nSSL policies overview.",
              additionalProperties: true,
            },
            description: "A list of SslPolicy resources.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#sslPoliciesList for lists of sslPolicies.",
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
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default regionSslPoliciesList;
