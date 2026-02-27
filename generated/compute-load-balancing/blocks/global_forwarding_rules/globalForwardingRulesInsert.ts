import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const globalForwardingRulesInsert: AppBlock = {
  name: "Global Forwarding Rules - Insert",
  description: `Creates a GlobalForwardingRule resource in the specified project using the data included in the request.`,
  category: "Global Forwarding Rules",
  inputs: {
    default: {
      config: {
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        ports: {
          name: "Ports",
          description:
            "The ports, portRange, and allPorts fields are mutually exclusive.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The ports, portRange, and allPorts\nfields are mutually exclusive. Only packets addressed to ports in the\nspecified range will be forwarded to the backends configured with this\nforwarding rule.\n\nThe ports field has the following limitations:\n   \n   - It requires that the forwarding rule IPProtocol be TCP,\n   UDP, or SCTP, and\n   - It's applicable only to the following products: internal passthrough\n   Network Load Balancers, backend service-based external passthrough Network\n   Load Balancers, and internal protocol forwarding.\n   - You can specify a list of up to five ports by number, separated by\n   commas. The ports can be contiguous or discontiguous.\n\n\n\nFor external forwarding rules, two or more forwarding rules cannot use the\nsame [IPAddress, IPProtocol] pair if they share at least one\nport number.\n\nFor internal forwarding rules within the same VPC network, two or more\nforwarding rules cannot use the same [IPAddress, IPProtocol]\npair if they share at least one port number.\n\n@pattern: \\\\d+(?:-\\\\d+)?",
          },
          required: false,
        },
        target: {
          name: "Target",
          description:
            "The URL of the target resource to receive the matched traffic.",
          type: {
            type: "string",
            description:
              'The URL of the target resource to receive the matched traffic.  For\nregional forwarding rules, this target must be in the same region as the\nforwarding rule. For global forwarding rules, this target must be a global\nload balancing resource.\n\nThe forwarded traffic must be of a type appropriate to the target object.\n   \n   \n     -  For load balancers, see the "Target" column in [Port specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).\n     -  For Private Service Connect forwarding rules that forward traffic to Google APIs, provide the name of a supported Google API bundle:\n       \n      \n            -  vpc-sc -  APIs that support VPC Service Controls. \n            -  all-apis - All supported Google APIs. \n          \n     \n     -  For Private Service Connect forwarding rules that forward traffic to managed services, the target must be a service attachment. The target is not mutable once set as a service attachment.',
          },
          required: false,
        },
        region: {
          name: "Region",
          description:
            "[Output Only] URL of the region where the regional forwarding rule resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional forwarding rule resides.\nThis field is not applicable to global forwarding rules.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          required: false,
        },
        externalManagedBackendBucketMigrationTestingPercentage: {
          name: "External Managed Backend Bucket Migration Testing Percentage",
          description:
            "Determines the fraction of requests to backend buckets that should be processed by the global external Application Load Balancer.",
          type: {
            type: "number",
            description:
              "Determines the fraction of requests to backend buckets that should be\nprocessed by the global external Application Load Balancer.\n\nThe value of this field must be in the range [0, 100].\n\nThis value can only be set if the loadBalancingScheme in the BackendService\nis set to EXTERNAL (when using the classic Application Load Balancer) and\nthe migration state is TEST_BY_PERCENTAGE. (Format: float)",
          },
          required: false,
        },
        allPorts: {
          name: "All Ports",
          description:
            "The ports, portRange, and allPorts fields are mutually exclusive.",
          type: {
            type: "boolean",
            description:
              "The ports, portRange, and allPorts\nfields are mutually exclusive. Only packets addressed to ports in the\nspecified range will be forwarded to the backends configured with this\nforwarding rule.\n\nThe allPorts field has the following limitations:\n   \n   - It requires that the forwarding rule IPProtocol be TCP,\n   UDP, SCTP, or L3_DEFAULT.\n   - It's applicable only to the following products: internal passthrough\n   Network Load Balancers, backend service-based external passthrough Network\n   Load Balancers, and internal and external protocol forwarding.\n   - Set this field to true to allow packets addressed to any port or\n   packets lacking destination port information (for example, UDP fragments\n   after the first fragment) to be forwarded to the backends configured with\n   this forwarding rule. The L3_DEFAULT protocol requiresallPorts be set to true.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          required: false,
        },
        IPProtocol: {
          name: "IP Protocol",
          description: "The IP protocol to which this rule applies.",
          type: {
            type: "string",
            enum: ["AH", "ESP", "ICMP", "L3_DEFAULT", "SCTP", "TCP", "UDP"],
            description:
              "The IP protocol to which this rule applies.\n\nFor protocol forwarding, valid\noptions are TCP, UDP, ESP,AH, SCTP, ICMP andL3_DEFAULT.\n\nThe valid IP protocols are different for different load balancing products\nas described in [Load balancing\nfeatures](https://cloud.google.com/load-balancing/docs/features#protocols_from_the_load_balancer_to_the_backends).",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#forwardingRule for forwarding rule resources.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "This field is not used for global external load balancing.",
          type: {
            type: "string",
            description:
              "This field is not used for global external load balancing.\n\nFor internal passthrough Network Load Balancers, this field identifies the\nnetwork that the load balanced IP should belong to for this forwarding\nrule.\nIf the subnetwork is specified, the network of the subnetwork will be used.\nIf neither subnetwork nor this field is specified, the default network will\nbe used.\n\nFor Private Service Connect forwarding rules that forward traffic to Google\nAPIs, a network must be provided.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "Labels for this resource.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
          },
          required: false,
        },
        serviceLabel: {
          name: "Service Label",
          description:
            "An optional prefix to the service name for this forwarding rule.",
          type: {
            type: "string",
            description:
              "An optional prefix to the service name for this forwarding rule.\nIf specified, the prefix is the first label of the fully qualified service\nname.\n\nThe label must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the label must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.\n\nThis field is only used for internal load balancing.",
          },
          required: false,
        },
        backendService: {
          name: "Backend Service",
          description:
            "Identifies the backend service to which the forwarding rule sends traffic.",
          type: {
            type: "string",
            description:
              "Identifies the backend service to which the forwarding rule sends traffic.\nRequired for internal and external passthrough Network Load Balancers;\nmust be omitted for all other load balancer types.",
          },
          required: false,
        },
        sourceIpRanges: {
          name: "Source IP Ranges",
          description:
            "If not empty, this forwarding rule will only forward the traffic when the source IP address matches one of the IP addresses or CIDR ranges set here.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If not empty, this forwarding rule will only forward the traffic when the\nsource IP address matches one of the IP addresses or CIDR ranges set here.\nNote that a forwarding rule can only have up to 64 source IP ranges, and\nthis field can only be used with a regional forwarding rule whose scheme isEXTERNAL.\nEach source_ip_range entry should be either an IP address (for\nexample, 1.2.3.4) or a CIDR range (for example, 1.2.3.0/24).",
          },
          required: false,
        },
        serviceDirectoryRegistrations: {
          name: "Service Directory Registrations",
          description:
            "Service Directory resources to register this forwarding rule with.",
          type: {
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
          required: false,
        },
        baseForwardingRule: {
          name: "Base Forwarding Rule",
          description:
            "[Output Only] The URL for the corresponding base forwarding rule.",
          type: {
            type: "string",
            description:
              "[Output Only] The URL for the corresponding base forwarding rule. By base\nforwarding rule, we mean the forwarding rule that has the same IP address,\nprotocol, and port settings with the current forwarding rule, but without\nsourceIPRanges specified.\nAlways empty if the current forwarding rule does not have sourceIPRanges\nspecified.",
          },
          required: false,
        },
        allowGlobalAccess: {
          name: "Allow Global Access",
          description:
            "If set to true, clients can access the internal passthrough Network Load Balancers, the regional internal Application Load Balancer, and the regional internal proxy Network Load Balancer from all regions.",
          type: {
            type: "boolean",
            description:
              "If set to true, clients can access the internal passthrough Network Load\nBalancers, the regional internal Application Load Balancer, and the\nregional internal proxy Network Load Balancer from all regions.\nIf false, only allows access from the local region the load balancer is\nlocated at. Note that for INTERNAL_MANAGED forwarding rules, this field\ncannot be changed after the forwarding rule is created.",
          },
          required: false,
        },
        noAutomateDnsZone: {
          name: "No Automate DNS Zone",
          description:
            "This is used in PSC consumer ForwardingRule to control whether it should try to auto-generate a DNS zone or not.",
          type: {
            type: "boolean",
            description:
              "This is used in PSC consumer ForwardingRule to control whether it should\ntry to auto-generate a DNS zone or not. Non-PSC forwarding rules do not use\nthis field. Once set, this field is not mutable.",
          },
          required: false,
        },
        isMirroringCollector: {
          name: "Is Mirroring Collector",
          description:
            "Indicates whether or not this load balancer can be used as a collector for packet mirroring.",
          type: {
            type: "boolean",
            description:
              "Indicates whether or not this load balancer can be used as a collector for\npacket mirroring. To prevent mirroring loops, instances behind this\nload balancer will not have their traffic mirrored even if aPacketMirroring rule applies to them.\nThis can only be set to true for load balancers that have theirloadBalancingScheme set to INTERNAL.",
          },
          required: false,
        },
        subnetwork: {
          name: "Subnetwork",
          description:
            "This field identifies the subnetwork that the load balanced IP should belong to for this forwarding rule, used with internal load balancers and external passthrough Network Load Balancers with IPv6.",
          type: {
            type: "string",
            description:
              "This field identifies the subnetwork that the load balanced IP should\nbelong to for this forwarding rule, used with internal load balancers and\nexternal passthrough Network Load Balancers with IPv6.\n\nIf the network specified is in auto subnet mode, this field is optional.\nHowever, a subnetwork must be specified if the network is in custom subnet\nmode or when creating external forwarding rule with IPv6.",
          },
          required: false,
        },
        pscConnectionStatus: {
          name: "Psc Connection Status",
          description: "Request body field: pscConnectionStatus",
          type: {
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
          required: false,
        },
        networkTier: {
          name: "Network Tier",
          description:
            "This signifies the networking tier used for configuring this load balancer and can only take the following values:PREMIUM, STANDARD.",
          type: {
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
          required: false,
        },
        allowPscGlobalAccess: {
          name: "Allow Psc Global Access",
          description:
            "This is used in PSC consumer ForwardingRule to control whether the PSC endpoint can be accessed from another region.",
          type: {
            type: "boolean",
            description:
              "This is used in PSC consumer ForwardingRule to control whether the PSC\nendpoint can be accessed from another region.",
          },
          required: false,
        },
        portRange: {
          name: "Port Range",
          description:
            "The ports, portRange, and allPorts fields are mutually exclusive.",
          type: {
            type: "string",
            description:
              "The ports, portRange, and allPorts\nfields are mutually exclusive. Only packets addressed to ports in the\nspecified range will be forwarded to the backends configured with this\nforwarding rule.\n\nThe portRange field has the following limitations:\n   \n   - It requires that the forwarding rule IPProtocol be TCP,\n   UDP, or SCTP, and\n   - It's applicable only to the following products: external passthrough\n   Network Load Balancers, internal and external proxy Network Load Balancers,\n   internal and external Application Load Balancers, external protocol\n   forwarding, and Classic VPN.\n   - Some products have restrictions on what ports can be used. See \n   port specifications for details.\n\n\n\nFor external forwarding rules, two or more forwarding rules cannot use the\nsame [IPAddress, IPProtocol] pair, and cannot have overlappingportRanges.\n\nFor internal forwarding rules within the same VPC network, two or more\nforwarding rules cannot use the same [IPAddress, IPProtocol]\npair, and cannot have overlapping portRanges.\n\n@pattern: \\\\d+(?:-\\\\d+)?",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this resource, which is essentially a hash of the labels set used for optimistic locking.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this resource, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a ForwardingRule. (Format: byte)",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "[Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description: "[Output Only] The unique identifier for the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          required: false,
        },
        loadBalancingScheme: {
          name: "Load Balancing Scheme",
          description: "Specifies the forwarding rule type.",
          type: {
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
          required: false,
        },
        selfLinkWithId: {
          name: "Self Link With ID",
          description:
            "[Output Only] Server-defined URL for this resource with the resource id.",
          type: {
            type: "string",
            description:
              "[Output Only] Server-defined URL for this resource with the resource id.",
          },
          required: false,
        },
        IPAddress: {
          name: "IP Address",
          description:
            "IP address for which this forwarding rule accepts traffic.",
          type: {
            type: "string",
            description:
              "IP address for which this forwarding rule accepts traffic. When a client\nsends traffic to this IP address, the forwarding rule directs the traffic\nto the referenced target or backendService.\nWhile creating a forwarding rule, specifying an IPAddress is\nrequired under the following circumstances:\n\n   \n   - When the target is set to targetGrpcProxy andvalidateForProxyless is set to true, theIPAddress should be set to 0.0.0.0.\n   - When the target is a Private Service Connect Google APIs\n   bundle, you must specify an IPAddress.\n\n\nOtherwise, you can optionally specify an IP address that references an\nexisting static (reserved) IP address resource. When omitted, Google Cloud\nassigns an ephemeral IP address.\n\nUse one of the following formats to specify an IP address while creating a\nforwarding rule:\n\n* IP address number, as in `100.1.2.3`\n* IPv6 address range, as in `2600:1234::/96`\n* Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/addresses/address-name\n* Partial URL or by name, as in:\n   \n   - projects/project_id/regions/region/addresses/address-name\n   - regions/region/addresses/address-name\n   - global/addresses/address-name\n   - address-name\n\n\n\nThe forwarding rule's target or backendService,\nand in most cases, also the loadBalancingScheme, determine the\ntype of IP address that you can use. For detailed information, see\n[IP address\nspecifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).\n\nWhen reading an IPAddress, the API always returns the IP\naddress number.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        serviceName: {
          name: "Service Name",
          description:
            "[Output Only] The internal fully qualified service name for this forwarding rule.",
          type: {
            type: "string",
            description:
              "[Output Only]\nThe internal fully qualified service name for this forwarding rule.\n\nThis field is only used for internal load balancing.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description: "Fingerprint of this resource.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a ForwardingRule. Include the fingerprint in patch request to\nensure that you do not overwrite changes that were applied from another\nconcurrent request.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a ForwardingRule. (Format: byte)",
          },
          required: false,
        },
        metadataFilters: {
          name: "Metadata Filters",
          description:
            "Opaque filter criteria used by load balancer to restrict routing configuration to a limited set of xDS compliant clients.",
          type: {
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
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.\n\nFor Private Service Connect forwarding rules that forward traffic to Google\nAPIs, the forwarding rule name must be a 1-20 characters string with\nlowercase letters and numbers and must start with a letter.",
          },
          required: false,
        },
        ipCollection: {
          name: "IP Collection",
          description: "Resource reference of a PublicDelegatedPrefix.",
          type: {
            type: "string",
            description:
              "Resource reference of a PublicDelegatedPrefix. The PDP must\nbe a sub-PDP in EXTERNAL_IPV6_FORWARDING_RULE_CREATION mode.\n\nUse one of the following formats to specify a sub-PDP when creating an IPv6\nNetLB forwarding rule using BYOIP:\nFull resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name\nPartial URL, as in:\n   \n   - projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name\n   - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          },
          required: false,
        },
        pscConnectionId: {
          name: "Psc Connection ID",
          description:
            "[Output Only] The PSC connection id of the PSC forwarding rule.",
          type: {
            type: "string",
            description:
              "[Output Only] The PSC connection id of the PSC forwarding rule. (Format: uint64)",
          },
          required: false,
        },
        ipVersion: {
          name: "IP Version",
          description:
            "The IP Version that will be used by this forwarding rule.",
          type: {
            type: "string",
            enum: ["IPV4", "IPV6", "UNSPECIFIED_VERSION"],
            description:
              "The IP Version that will be used by this forwarding rule.  Valid options\nare IPV4 or IPV6.",
          },
          required: false,
        },
        externalManagedBackendBucketMigrationState: {
          name: "External Managed Backend Bucket Migration State",
          description:
            "Specifies the canary migration state for the backend buckets attached to this forwarding rule.",
          type: {
            type: "string",
            enum: ["PREPARE", "TEST_ALL_TRAFFIC", "TEST_BY_PERCENTAGE"],
            description:
              "Specifies the canary migration state for the backend buckets attached to\nthis forwarding rule. Possible values are PREPARE, TEST_BY_PERCENTAGE, and\nTEST_ALL_TRAFFIC.\n\nTo begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be\nchanged to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before\nthe loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the\nTEST_BY_PERCENTAGE state can be used to migrate traffic to backend buckets\nattached to this forwarding rule by percentage using\nexternalManagedBackendBucketMigrationTestingPercentage.\n\nRolling back a migration requires the states to be set in reverse order. So\nchanging the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to\nbe set to TEST_ALL_TRAFFIC at the same time. Optionally, the\nTEST_BY_PERCENTAGE state can be used to migrate some traffic back to\nEXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL.",
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
        let path = `projects/{project}/global/forwardingRules`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.ports !== undefined)
          requestBody.ports = input.event.inputConfig.ports;
        if (input.event.inputConfig.target !== undefined)
          requestBody.target = input.event.inputConfig.target;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (
          input.event.inputConfig
            .externalManagedBackendBucketMigrationTestingPercentage !==
          undefined
        )
          requestBody.externalManagedBackendBucketMigrationTestingPercentage =
            input.event.inputConfig.externalManagedBackendBucketMigrationTestingPercentage;
        if (input.event.inputConfig.allPorts !== undefined)
          requestBody.allPorts = input.event.inputConfig.allPorts;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.IPProtocol !== undefined)
          requestBody.IPProtocol = input.event.inputConfig.IPProtocol;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.network !== undefined)
          requestBody.network = input.event.inputConfig.network;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.serviceLabel !== undefined)
          requestBody.serviceLabel = input.event.inputConfig.serviceLabel;
        if (input.event.inputConfig.backendService !== undefined)
          requestBody.backendService = input.event.inputConfig.backendService;
        if (input.event.inputConfig.sourceIpRanges !== undefined)
          requestBody.sourceIpRanges = input.event.inputConfig.sourceIpRanges;
        if (input.event.inputConfig.serviceDirectoryRegistrations !== undefined)
          requestBody.serviceDirectoryRegistrations =
            input.event.inputConfig.serviceDirectoryRegistrations;
        if (input.event.inputConfig.baseForwardingRule !== undefined)
          requestBody.baseForwardingRule =
            input.event.inputConfig.baseForwardingRule;
        if (input.event.inputConfig.allowGlobalAccess !== undefined)
          requestBody.allowGlobalAccess =
            input.event.inputConfig.allowGlobalAccess;
        if (input.event.inputConfig.noAutomateDnsZone !== undefined)
          requestBody.noAutomateDnsZone =
            input.event.inputConfig.noAutomateDnsZone;
        if (input.event.inputConfig.isMirroringCollector !== undefined)
          requestBody.isMirroringCollector =
            input.event.inputConfig.isMirroringCollector;
        if (input.event.inputConfig.subnetwork !== undefined)
          requestBody.subnetwork = input.event.inputConfig.subnetwork;
        if (input.event.inputConfig.pscConnectionStatus !== undefined)
          requestBody.pscConnectionStatus =
            input.event.inputConfig.pscConnectionStatus;
        if (input.event.inputConfig.networkTier !== undefined)
          requestBody.networkTier = input.event.inputConfig.networkTier;
        if (input.event.inputConfig.allowPscGlobalAccess !== undefined)
          requestBody.allowPscGlobalAccess =
            input.event.inputConfig.allowPscGlobalAccess;
        if (input.event.inputConfig.portRange !== undefined)
          requestBody.portRange = input.event.inputConfig.portRange;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          requestBody.labelFingerprint =
            input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.loadBalancingScheme !== undefined)
          requestBody.loadBalancingScheme =
            input.event.inputConfig.loadBalancingScheme;
        if (input.event.inputConfig.selfLinkWithId !== undefined)
          requestBody.selfLinkWithId = input.event.inputConfig.selfLinkWithId;
        if (input.event.inputConfig.IPAddress !== undefined)
          requestBody.IPAddress = input.event.inputConfig.IPAddress;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.serviceName !== undefined)
          requestBody.serviceName = input.event.inputConfig.serviceName;
        if (input.event.inputConfig.fingerprint !== undefined)
          requestBody.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.metadataFilters !== undefined)
          requestBody.metadataFilters = input.event.inputConfig.metadataFilters;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.ipCollection !== undefined)
          requestBody.ipCollection = input.event.inputConfig.ipCollection;
        if (input.event.inputConfig.pscConnectionId !== undefined)
          requestBody.pscConnectionId = input.event.inputConfig.pscConnectionId;
        if (input.event.inputConfig.ipVersion !== undefined)
          requestBody.ipVersion = input.event.inputConfig.ipVersion;
        if (
          input.event.inputConfig.externalManagedBackendBucketMigrationState !==
          undefined
        )
          requestBody.externalManagedBackendBucketMigrationState =
            input.event.inputConfig.externalManagedBackendBucketMigrationState;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
          targetId: {
            type: "string",
            description:
              "[Output Only] The unique target ID, which identifies a specific incarnation\nof the target resource. (Format: uint64)",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nmessage that was returned, such as `NOT FOUND`.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always `compute#operation` for\nOperation resources.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "[Output Only] Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
            },
            additionalProperties: true,
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the operation. This identifier is\ndefined by the server. (Format: uint64)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only\napplicable when performing regional operations.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server.\nThis value is inRFC3339\ntext format.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only\napplicable when performing per-zone operations.",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the\noperation.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example:\n`user@example.com` or\n`alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
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
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the\noperation, this field will be populated.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`,\n`update`, or `delete`, and so on.",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For\noperations related to creating a snapshot, this points to the disk\nthat the snapshot was created from.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          error: {
            type: "object",
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      description:
                        "[Output Only] The error type identifier for this error.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          localizedMessage: {
                            type: "object",
                            properties: {
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at\nhttps://www.rfc-editor.org/rfc/bcp/bcp47.txt.\nExamples are: "en-US", "fr-CH", "es-MX"',
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user\nwhich can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          errorInfo: {
                            type: "object",
                            properties: {
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.\n\nKeys must match a regular expression of `a-z+` but should\nideally be lowerCamelCase. Also, they must be limited to 64 characters in\nlength. When identifying the current value of an exceeded limit, the units\nshould be contained in the key, not the value.  For example, rather than\n`{"instanceLimit": "100/request"}`, should be returned as,\n`{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of\ninstances that can be created in a single (batch) request.',
                              },
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain\nis typically the registered service name of the tool or product that\ngenerates the error. Example: "pubsub.googleapis.com". If the error is\ngenerated by some common infrastructure, the error domain must be a\nglobally unique value that identifies the infrastructure. For Google API\ninfrastructure, the error domain is "googleapis.com".',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the\nproximate cause of the error. Error reasons are unique within a particular\ndomain of errors. This should be at most 63 characters and match a\nregular expression of `A-Z+[A-Z0-9]`, which represents\nUPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.\n\nExample of an error when contacting the "pubsub.googleapis.com" API when it\nis not enabled:\n\n    { "reason": "API_DISABLED"\n      "domain": "googleapis.com"\n      "metadata": {\n        "resource": "projects/123",\n        "service": "pubsub.googleapis.com"\n      }\n    }\n\nThis response indicates that the pubsub.googleapis.com API is not enabled.\n\nExample of an error that is returned when attempting to create a Spanner\ninstance in a region that is out of stock:\n\n    { "reason": "STOCKOUT"\n      "domain": "spanner.googleapis.com",\n      "metadata": {\n        "availableRegions": "us-central1,us-east2"\n      }\n    }',
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type\nor metric. (Format: double)",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota\n type or metric. (Format: double)",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                          help: {
                            type: "object",
                            properties: {
                              links: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                  },
                                  description: "Describes a URL link.",
                                  additionalProperties: true,
                                },
                                description:
                                  "URL(s) pointing to additional information on handling the current error.",
                              },
                            },
                            description:
                              "Provides links to documentation or for performing an out of band action.\n\nFor example, if a quota check failed with an error indicating the calling\nproject hasn't enabled the accessed service, this can contain a URL pointing\ndirectly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error\ndetails. There is a set of defined message types to use for providing\ndetails.The syntax depends on the error code. For example,\nQuotaExceededInfo will have details when the error code is\nQUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error.\nThis property is optional.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this\noperation.",
              },
            },
            description:
              "[Output Only] If errors are generated during processing of the operation,\nthis field will be populated.",
            additionalProperties: true,
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339\ntext format.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nstatus code that was returned. For example, a `404` means the\nresource was not found. (Format: int32)",
          },
          operationGroupId: {
            type: "string",
            description:
              "[Output Only] An ID that represents a group of operations, such as when a\ngroup of operations results from a `bulkInsert` API request.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is\nset when the operation is created.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request.\nNot present otherwise.",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested.\nThis value is inRFC3339\ntext format.",
          },
          status: {
            type: "string",
            enum: ["DONE", "PENDING", "RUNNING"],
            description:
              "[Output Only] The status of the operation, which can be one of the\nfollowing:\n`PENDING`, `RUNNING`, or `DONE`.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100.\nThere is no requirement that this be linear or support any granularity of\noperations. This should not be used to guess when the operation will be\ncomplete. This number should monotonically increase as the operation\nprogresses. (Format: int32)",
          },
        },
        description:
          "Represents an Operation resource.\n\nGoogle Compute Engine has three Operation resources:\n\n* [Global](/compute/docs/reference/rest/v1/globalOperations)\n* [Regional](/compute/docs/reference/rest/v1/regionOperations)\n* [Zonal](/compute/docs/reference/rest/v1/zoneOperations)\n\nYou can use an operation resource to manage asynchronous API requests.\nFor more information, readHandling\nAPI responses.\n\nOperations can be global, regional or zonal.\n   \n   - For global operations, use the `globalOperations`\n   resource. \n   - For regional operations, use the\n   `regionOperations` resource. \n   - For zonal operations, use\n   the `zoneOperations` resource.\n\n\n\nFor more information, read\nGlobal, Regional, and Zonal Resources.\n\nNote that completed Operation resources have a limited \nretention period.",
        additionalProperties: true,
      },
    },
  },
};

export default globalForwardingRulesInsert;
