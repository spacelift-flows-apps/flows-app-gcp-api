import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const forwardingRulesList: AppBlock = {
  name: "Forwarding Rules - List",
  description: `Retrieves a list of ForwardingRule resources available to the specified project and region.`,
  category: "Forwarding Rules",
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
        let path = `projects/{project}/regions/{region}/forwardingRules`;

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
            description: "Type of resource.",
          },
          items: {
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
                    "The ports, portRange, and allPorts\nfields are mutually exclusive. Only packets addressed to ports in the\nspecified range will be forwarded to the backends configured with this\nforwarding rule.\n\nThe ports field has the following limitations:\n   \n   - It requires that the forwarding rule IPProtocol be TCP,\n   UDP, or SCTP, and\n   - It's applicable only to the following products: internal passthrough\n   Network Load Balancers, backend service-based external passthrough Network\n   Load Balancers, and internal protocol forwarding.\n   - You can specify a list of up to five ports by number, separated by\n   commas. The ports can be contiguous or discontiguous.\n\n\n\nFor external forwarding rules, two or more forwarding rules cannot use the\nsame [IPAddress, IPProtocol] pair if they share at least one\nport number.\n\nFor internal forwarding rules within the same VPC network, two or more\nforwarding rules cannot use the same [IPAddress, IPProtocol]\npair if they share at least one port number.\n\n@pattern: \\\\d+(?:-\\\\d+)?",
                },
                target: {
                  type: "string",
                  description:
                    'The URL of the target resource to receive the matched traffic.  For\nregional forwarding rules, this target must be in the same region as the\nforwarding rule. For global forwarding rules, this target must be a global\nload balancing resource.\n\nThe forwarded traffic must be of a type appropriate to the target object.\n   \n   \n     -  For load balancers, see the "Target" column in [Port specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).\n     -  For Private Service Connect forwarding rules that forward traffic to Google APIs, provide the name of a supported Google API bundle:\n       \n      \n            -  vpc-sc -  APIs that support VPC Service Controls. \n            -  all-apis - All supported Google APIs. \n          \n     \n     -  For Private Service Connect forwarding rules that forward traffic to managed services, the target must be a service attachment. The target is not mutable once set as a service attachment.',
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the regional forwarding rule resides.\nThis field is not applicable to global forwarding rules.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
                },
                externalManagedBackendBucketMigrationTestingPercentage: {
                  type: "number",
                  description:
                    "Determines the fraction of requests to backend buckets that should be\nprocessed by the global external Application Load Balancer.\n\nThe value of this field must be in the range [0, 100].\n\nThis value can only be set if the loadBalancingScheme in the BackendService\nis set to EXTERNAL (when using the classic Application Load Balancer) and\nthe migration state is TEST_BY_PERCENTAGE. (Format: float)",
                },
                allPorts: {
                  type: "boolean",
                  description:
                    "The ports, portRange, and allPorts\nfields are mutually exclusive. Only packets addressed to ports in the\nspecified range will be forwarded to the backends configured with this\nforwarding rule.\n\nThe allPorts field has the following limitations:\n   \n   - It requires that the forwarding rule IPProtocol be TCP,\n   UDP, SCTP, or L3_DEFAULT.\n   - It's applicable only to the following products: internal passthrough\n   Network Load Balancers, backend service-based external passthrough Network\n   Load Balancers, and internal and external protocol forwarding.\n   - Set this field to true to allow packets addressed to any port or\n   packets lacking destination port information (for example, UDP fragments\n   after the first fragment) to be forwarded to the backends configured with\n   this forwarding rule. The L3_DEFAULT protocol requiresallPorts be set to true.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                IPProtocol: {
                  type: "string",
                  enum: [
                    "AH",
                    "ESP",
                    "ICMP",
                    "L3_DEFAULT",
                    "SCTP",
                    "TCP",
                    "UDP",
                  ],
                  description:
                    "The IP protocol to which this rule applies.\n\nFor protocol forwarding, valid\noptions are TCP, UDP, ESP,AH, SCTP, ICMP andL3_DEFAULT.\n\nThe valid IP protocols are different for different load balancing products\nas described in [Load balancing\nfeatures](https://cloud.google.com/load-balancing/docs/features#protocols_from_the_load_balancer_to_the_backends).",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#forwardingRule for forwarding rule resources.",
                },
                network: {
                  type: "string",
                  description:
                    "This field is not used for global external load balancing.\n\nFor internal passthrough Network Load Balancers, this field identifies the\nnetwork that the load balanced IP should belong to for this forwarding\nrule.\nIf the subnetwork is specified, the network of the subnetwork will be used.\nIf neither subnetwork nor this field is specified, the default network will\nbe used.\n\nFor Private Service Connect forwarding rules that forward traffic to Google\nAPIs, a network must be provided.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
                },
                serviceLabel: {
                  type: "string",
                  description:
                    "An optional prefix to the service name for this forwarding rule.\nIf specified, the prefix is the first label of the fully qualified service\nname.\n\nThe label must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the label must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.\n\nThis field is only used for internal load balancing.",
                },
                backendService: {
                  type: "string",
                  description:
                    "Identifies the backend service to which the forwarding rule sends traffic.\nRequired for internal and external passthrough Network Load Balancers;\nmust be omitted for all other load balancer types.",
                },
                sourceIpRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If not empty, this forwarding rule will only forward the traffic when the\nsource IP address matches one of the IP addresses or CIDR ranges set here.\nNote that a forwarding rule can only have up to 64 source IP ranges, and\nthis field can only be used with a regional forwarding rule whose scheme isEXTERNAL.\nEach source_ip_range entry should be either an IP address (for\nexample, 1.2.3.4) or a CIDR range (for example, 1.2.3.0/24).",
                },
                serviceDirectoryRegistrations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      namespace: {
                        type: "string",
                        description:
                          "Service Directory namespace to register the forwarding rule under.",
                      },
                      service: {
                        type: "string",
                        description:
                          "Service Directory service to register the forwarding rule under.",
                      },
                      serviceDirectoryRegion: {
                        type: "string",
                        description:
                          '[Optional] Service Directory region to register this global forwarding\nrule under. Default to "us-central1". Only used for PSC for Google APIs.\nAll PSC for Google APIs forwarding rules on the same network should use\nthe same Service Directory region.',
                      },
                    },
                    description:
                      "Describes the auto-registration of the forwarding rule to Service Directory.\nThe region and project of the Service Directory resource generated from\nthis registration will be the same as this forwarding rule.",
                    additionalProperties: true,
                  },
                  description:
                    "Service Directory resources to register this forwarding rule with.\nCurrently, only supports a single Service Directory resource.",
                },
                baseForwardingRule: {
                  type: "string",
                  description:
                    "[Output Only] The URL for the corresponding base forwarding rule. By base\nforwarding rule, we mean the forwarding rule that has the same IP address,\nprotocol, and port settings with the current forwarding rule, but without\nsourceIPRanges specified.\nAlways empty if the current forwarding rule does not have sourceIPRanges\nspecified.",
                },
                allowGlobalAccess: {
                  type: "boolean",
                  description:
                    "If set to true, clients can access the internal passthrough Network Load\nBalancers, the regional internal Application Load Balancer, and the\nregional internal proxy Network Load Balancer from all regions.\nIf false, only allows access from the local region the load balancer is\nlocated at. Note that for INTERNAL_MANAGED forwarding rules, this field\ncannot be changed after the forwarding rule is created.",
                },
                noAutomateDnsZone: {
                  type: "boolean",
                  description:
                    "This is used in PSC consumer ForwardingRule to control whether it should\ntry to auto-generate a DNS zone or not. Non-PSC forwarding rules do not use\nthis field. Once set, this field is not mutable.",
                },
                isMirroringCollector: {
                  type: "boolean",
                  description:
                    "Indicates whether or not this load balancer can be used as a collector for\npacket mirroring. To prevent mirroring loops, instances behind this\nload balancer will not have their traffic mirrored even if aPacketMirroring rule applies to them.\nThis can only be set to true for load balancers that have theirloadBalancingScheme set to INTERNAL.",
                },
                subnetwork: {
                  type: "string",
                  description:
                    "This field identifies the subnetwork that the load balanced IP should\nbelong to for this forwarding rule, used with internal load balancers and\nexternal passthrough Network Load Balancers with IPv6.\n\nIf the network specified is in auto subnet mode, this field is optional.\nHowever, a subnetwork must be specified if the network is in custom subnet\nmode or when creating external forwarding rule with IPv6.",
                },
                pscConnectionStatus: {
                  type: "string",
                  enum: [
                    "ACCEPTED",
                    "CLOSED",
                    "NEEDS_ATTENTION",
                    "PENDING",
                    "REJECTED",
                    "STATUS_UNSPECIFIED",
                  ],
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
                    "This signifies the networking tier used for configuring\nthis load balancer and can only take the following values:PREMIUM, STANDARD.\n\nFor regional ForwardingRule, the valid values are PREMIUM andSTANDARD. For GlobalForwardingRule, the valid value isPREMIUM.\n\nIf this field is not specified, it is assumed to be PREMIUM.\nIf IPAddress is specified, this value must be equal to the\nnetworkTier of the Address.",
                },
                allowPscGlobalAccess: {
                  type: "boolean",
                  description:
                    "This is used in PSC consumer ForwardingRule to control whether the PSC\nendpoint can be accessed from another region.",
                },
                portRange: {
                  type: "string",
                  description:
                    "The ports, portRange, and allPorts\nfields are mutually exclusive. Only packets addressed to ports in the\nspecified range will be forwarded to the backends configured with this\nforwarding rule.\n\nThe portRange field has the following limitations:\n   \n   - It requires that the forwarding rule IPProtocol be TCP,\n   UDP, or SCTP, and\n   - It's applicable only to the following products: external passthrough\n   Network Load Balancers, internal and external proxy Network Load Balancers,\n   internal and external Application Load Balancers, external protocol\n   forwarding, and Classic VPN.\n   - Some products have restrictions on what ports can be used. See \n   port specifications for details.\n\n\n\nFor external forwarding rules, two or more forwarding rules cannot use the\nsame [IPAddress, IPProtocol] pair, and cannot have overlappingportRanges.\n\nFor internal forwarding rules within the same VPC network, two or more\nforwarding rules cannot use the same [IPAddress, IPProtocol]\npair, and cannot have overlapping portRanges.\n\n@pattern: \\\\d+(?:-\\\\d+)?",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this resource, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a ForwardingRule. (Format: byte)",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                loadBalancingScheme: {
                  type: "string",
                  enum: [
                    "EXTERNAL",
                    "EXTERNAL_MANAGED",
                    "INTERNAL",
                    "INTERNAL_MANAGED",
                    "INTERNAL_SELF_MANAGED",
                    "INVALID",
                  ],
                  description:
                    "Specifies the forwarding rule type.\n\nFor more information about forwarding rules, refer to\nForwarding rule concepts.",
                },
                selfLinkWithId: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for this resource with the resource id.",
                },
                IPAddress: {
                  type: "string",
                  description:
                    "IP address for which this forwarding rule accepts traffic. When a client\nsends traffic to this IP address, the forwarding rule directs the traffic\nto the referenced target or backendService.\nWhile creating a forwarding rule, specifying an IPAddress is\nrequired under the following circumstances:\n\n   \n   - When the target is set to targetGrpcProxy andvalidateForProxyless is set to true, theIPAddress should be set to 0.0.0.0.\n   - When the target is a Private Service Connect Google APIs\n   bundle, you must specify an IPAddress.\n\n\nOtherwise, you can optionally specify an IP address that references an\nexisting static (reserved) IP address resource. When omitted, Google Cloud\nassigns an ephemeral IP address.\n\nUse one of the following formats to specify an IP address while creating a\nforwarding rule:\n\n* IP address number, as in `100.1.2.3`\n* IPv6 address range, as in `2600:1234::/96`\n* Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/addresses/address-name\n* Partial URL or by name, as in:\n   \n   - projects/project_id/regions/region/addresses/address-name\n   - regions/region/addresses/address-name\n   - global/addresses/address-name\n   - address-name\n\n\n\nThe forwarding rule's target or backendService,\nand in most cases, also the loadBalancingScheme, determine the\ntype of IP address that you can use. For detailed information, see\n[IP address\nspecifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).\n\nWhen reading an IPAddress, the API always returns the IP\naddress number.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                serviceName: {
                  type: "string",
                  description:
                    "[Output Only]\nThe internal fully qualified service name for this forwarding rule.\n\nThis field is only used for internal load balancing.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a ForwardingRule. Include the fingerprint in patch request to\nensure that you do not overwrite changes that were applied from another\nconcurrent request.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a ForwardingRule. (Format: byte)",
                },
                metadataFilters: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      filterMatchCriteria: {
                        type: "string",
                        enum: ["MATCH_ALL", "MATCH_ANY", "NOT_SET"],
                        description:
                          "Specifies how individual filter label matches\nwithin the list of filterLabels and contributes toward the\noverall metadataFilter match.\n\n Supported values are:\n   \n   - MATCH_ANY: at least one of the filterLabels\n   must have a matching label in the provided metadata.\n   - MATCH_ALL: all filterLabels must have\n   matching labels in the provided metadata.",
                      },
                      filterLabels: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            value: {
                              type: "string",
                              description:
                                "The value of the label must match the specified value.\n\nvalue can have a maximum length of 1024 characters.",
                            },
                            name: {
                              type: "string",
                              description:
                                "Name of metadata label.\n\n The name can have a maximum length of 1024 characters and must be at\nleast 1 character long.",
                            },
                          },
                          description:
                            "MetadataFilter label name value pairs that are expected\nto match corresponding labels presented as metadata to the load balancer.",
                          additionalProperties: true,
                        },
                        description:
                          "The list of label value pairs that must match labels in the provided\nmetadata based on filterMatchCriteria\n\nThis list must not be empty and can have at the most 64 entries.",
                      },
                    },
                    description:
                      "Opaque filter criteria used by load balancers to restrict routing\nconfiguration to a limited set of load balancing proxies. Proxies and\nsidecars involved in load balancing would typically present metadata to the\nload balancers that need to match criteria specified here. If a match takes\nplace, the relevant configuration is made available to those\nproxies.\n\nFor each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least\none of thefilterLabels must match the corresponding label provided in\nthe metadata. If its filterMatchCriteria is set to\nMATCH_ALL, then all of its filterLabels must match with\ncorresponding labels provided in the metadata.\n\nAn example for using metadataFilters would be: if\nload balancing involves\nEnvoys, they receive routing configuration when values inmetadataFilters match values supplied in  of their XDS requests to loadbalancers.",
                    additionalProperties: true,
                  },
                  description:
                    "Opaque filter criteria used by load balancer to restrict routing\nconfiguration to a limited set of xDS\ncompliant clients. In their xDS requests to load balancer, xDS clients\npresent node\nmetadata. When there is a match, the relevant configuration\nis made available to those proxies. Otherwise, all the resources (e.g.TargetHttpProxy, UrlMap)\nreferenced by the ForwardingRule are not visible to\nthose proxies.\n\nFor each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least one of thefilterLabels must match the corresponding label provided in\nthe metadata. If its filterMatchCriteria is set to\nMATCH_ALL, then all of its filterLabels must match with\ncorresponding labels provided in the metadata. If multiplemetadataFilters are specified, all of them need to be satisfied\nin order to be considered a match.\n\nmetadataFilters specified here will be applifed before\nthose specified in the UrlMap that thisForwardingRule references.\n\nmetadataFilters only applies to Loadbalancers that have\ntheir loadBalancingScheme set toINTERNAL_SELF_MANAGED.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.\n\nFor Private Service Connect forwarding rules that forward traffic to Google\nAPIs, the forwarding rule name must be a 1-20 characters string with\nlowercase letters and numbers and must start with a letter.",
                },
                ipCollection: {
                  type: "string",
                  description:
                    "Resource reference of a PublicDelegatedPrefix. The PDP must\nbe a sub-PDP in EXTERNAL_IPV6_FORWARDING_RULE_CREATION mode.\n\nUse one of the following formats to specify a sub-PDP when creating an IPv6\nNetLB forwarding rule using BYOIP:\nFull resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name\nPartial URL, as in:\n   \n   - projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name\n   - regions/region/publicDelegatedPrefixes/sub-pdp-name",
                },
                pscConnectionId: {
                  type: "string",
                  description:
                    "[Output Only] The PSC connection id of the PSC forwarding rule. (Format: uint64)",
                },
                ipVersion: {
                  type: "string",
                  enum: ["IPV4", "IPV6", "UNSPECIFIED_VERSION"],
                  description:
                    "The IP Version that will be used by this forwarding rule.  Valid options\nare IPV4 or IPV6.",
                },
                externalManagedBackendBucketMigrationState: {
                  type: "string",
                  enum: ["PREPARE", "TEST_ALL_TRAFFIC", "TEST_BY_PERCENTAGE"],
                  description:
                    "Specifies the canary migration state for the backend buckets attached to\nthis forwarding rule. Possible values are PREPARE, TEST_BY_PERCENTAGE, and\nTEST_ALL_TRAFFIC.\n\nTo begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be\nchanged to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before\nthe loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the\nTEST_BY_PERCENTAGE state can be used to migrate traffic to backend buckets\nattached to this forwarding rule by percentage using\nexternalManagedBackendBucketMigrationTestingPercentage.\n\nRolling back a migration requires the states to be set in reverse order. So\nchanging the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to\nbe set to TEST_ALL_TRAFFIC at the same time. Optionally, the\nTEST_BY_PERCENTAGE state can be used to migrate some traffic back to\nEXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL.",
                },
              },
              description:
                "Represents a Forwarding Rule resource.\n\nForwarding rule resources in Google Cloud can be either regional or global in\nscope:\n\n* [Global](https://cloud.google.com/compute/docs/reference/rest/v1/globalForwardingRules)\n* [Regional](https://cloud.google.com/compute/docs/reference/rest/v1/forwardingRules)\n\nA forwarding rule and its corresponding IP address represent the frontend\nconfiguration of a Google Cloud load balancer.\nForwarding rules can also reference target instances and Cloud VPN Classic\ngateways (targetVpnGateway).\n\nFor more information, read\nForwarding rule concepts and\nUsing protocol forwarding.",
              additionalProperties: true,
            },
            description: "A list of ForwardingRule resources.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
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
        description: "Contains a list of ForwardingRule resources.",
        additionalProperties: true,
      },
    },
  },
};

export default forwardingRulesList;
