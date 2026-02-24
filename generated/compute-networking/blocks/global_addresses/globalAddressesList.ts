import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const globalAddressesList: AppBlock = {
  name: "Global Addresses - List",
  description: `Retrieves a list of global addresses.`,
  category: "Global Addresses",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
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
        let path = `projects/{project}/global/addresses`;

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
              "[Output Only] Type of resource. Always compute#addressList for\nlists of addresses.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                prefixLength: {
                  type: "integer",
                  description:
                    "The prefix length if the resource represents an IP range. (Format: int32)",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                purpose: {
                  type: "string",
                  enum: [
                    "DNS_RESOLVER",
                    "GCE_ENDPOINT",
                    "IPSEC_INTERCONNECT",
                    "NAT_AUTO",
                    "PRIVATE_SERVICE_CONNECT",
                    "SERVERLESS",
                    "SHARED_LOADBALANCER_VIP",
                    "VPC_PEERING",
                  ],
                  description:
                    "The purpose of this resource, which can be one of the following values:\n   \n   \n     - GCE_ENDPOINT for addresses that are used by VM\n     instances, alias IP ranges, load balancers, and similar resources.\n     - DNS_RESOLVER for a DNS resolver address in a subnetwork\n       for a Cloud DNS  inbound\n       forwarder IP addresses (regional internal IP address in a subnet of\n       a VPC network)\n     - VPC_PEERING for global internal IP addresses used for\n      \n          private services access allocated ranges.\n     - NAT_AUTO for the regional external IP addresses used by\n          Cloud NAT when allocating addresses using\n          \n          automatic NAT IP address allocation.\n     - IPSEC_INTERCONNECT for addresses created from a private\n     IP range that are reserved for a VLAN attachment in an\n     *HA VPN over Cloud Interconnect* configuration. These addresses\n     are regional resources.\n     - `SHARED_LOADBALANCER_VIP` for an internal IP address that is assigned\n     to multiple internal forwarding rules.\n     - `PRIVATE_SERVICE_CONNECT` for a private network address that is\n     used to configure Private Service Connect. Only global internal addresses\n     can use this purpose.",
                },
                ipVersion: {
                  type: "string",
                  enum: ["IPV4", "IPV6", "UNSPECIFIED_VERSION"],
                  description:
                    "The IP version that will be used by this address. Valid options areIPV4 or IPV6.",
                },
                users: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] The URLs of the resources that are using this address.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                address: {
                  type: "string",
                  description:
                    "The static IP address represented by this resource.",
                },
                addressType: {
                  type: "string",
                  enum: ["EXTERNAL", "INTERNAL", "UNSPECIFIED_TYPE"],
                  description:
                    "The type of address to reserve, either INTERNAL orEXTERNAL. If unspecified, defaults to EXTERNAL.",
                },
                ipv6EndpointType: {
                  type: "string",
                  enum: ["NETLB", "VM"],
                  description:
                    "The endpoint type of this address, which should be VM\nor NETLB. This is used for deciding which type of endpoint\nthis address can be used after the external IPv6 address reservation.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] The URL of the region where a regional address resides.\nFor regional addresses, you must specify the region as a path parameter in\nthe HTTP request URL. *This field is not applicable to global\naddresses.*",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this field when you\ncreate the resource.",
                },
                network: {
                  type: "string",
                  description:
                    "The URL of the network in which to reserve the address. This field can\nonly be used with INTERNAL type with theVPC_PEERING purpose.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this Address, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an Address. (Format: byte)",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always compute#address for\naddresses.",
                },
                subnetwork: {
                  type: "string",
                  description:
                    "The URL of the subnetwork in which to reserve the address. If an IP address\nis specified, it must be within the subnetwork's IP range. This field can\nonly be used with INTERNAL type with aGCE_ENDPOINT or DNS_RESOLVER purpose.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character\nmust be a lowercase letter, and all following characters (except for the\nlast character) must be a dash, lowercase letter, or digit. The last\ncharacter must be a lowercase letter or digit.",
                },
                status: {
                  type: "string",
                  enum: ["IN_USE", "RESERVED", "RESERVING"],
                  description:
                    "[Output Only] The status of the address, which can be one ofRESERVING, RESERVED, or IN_USE.\nAn address that is RESERVING is currently in the process of\nbeing reserved. A RESERVED address is currently reserved and\navailable to use. An IN_USE address is currently being used\nby another resource and is not available.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                networkTier: {
                  type: "string",
                  enum: [
                    "FIXED_STANDARD",
                    "PREMIUM",
                    "STANDARD",
                    "STANDARD_OVERRIDES_FIXED_STANDARD",
                  ],
                  description:
                    "This signifies the networking tier used for configuring this address and\ncan only take the following values: PREMIUM orSTANDARD. Internal IP addresses are always Premium Tier;\nglobal external IP addresses are always Premium Tier; regional external IP\naddresses can be either Standard or Premium Tier.\n\nIf this field is not specified, it is assumed to be PREMIUM.",
                },
              },
              description:
                "Represents an IP Address resource.\n\nGoogle Compute Engine has two IP Address resources:\n\n* [Global (external and\ninternal)](https://cloud.google.com/compute/docs/reference/rest/v1/globalAddresses)\n* [Regional (external and\ninternal)](https://cloud.google.com/compute/docs/reference/rest/v1/addresses)\n\nFor more information, see\nReserving a static external IP address.",
              additionalProperties: true,
            },
            description: "A list of Address resources.",
          },
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
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "Contains a list of addresses.",
        additionalProperties: true,
      },
    },
  },
};

export default globalAddressesList;
