import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const globalForwardingRulesPatch: AppBlock = {
  name: "Global Forwarding Rules - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Global Forwarding Rules",
  inputs: {
    default: {
      config: {
        forwardingRule: {
          name: "Forwarding Rule",
          description: "Name of the ForwardingRule resource to patch.",
          type: {
            type: "string",
            description: "Name of the ForwardingRule resource to patch.",
          },
          required: true,
        },
        IPAddress: {
          name: "I P Address",
          description:
            "IP address for which this forwarding rule accepts traffic. When a client sends traffic to this IP address, the forwarding rule directs the traffic to the referenced target or backendService. While creating a forwarding rule, specifying an IPAddress is required under the following circumstances:      - When the target is set to targetGrpcProxy andvalidateForProxyless is set to true, theIPAddress should be set to 0.0.0.0.    - When the target is a Private Service Connect Google APIs    bundle, you must specify an IPAddress.   Otherwise, you can optionally specify an IP address that references an existing static (reserved) IP address resource. When omitted, Google Cloud assigns an ephemeral IP address.  Use one of the following formats to specify an IP address while creating a forwarding rule:  * IP address number, as in `100.1.2.3` * IPv6 address range, as in `2600:1234::/96` * Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/addresses/address-name * Partial URL or by name, as in:     - projects/project_id/regions/region/addresses/address-name    - regions/region/addresses/address-name    - global/addresses/address-name    - address-name    The forwarding rule's target or backendService, and in most cases, also the loadBalancingScheme, determine the type of IP address that you can use. For detailed information, see [IP address specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).  When reading an IPAddress, the API always returns the IP address number.",
          type: {
            type: "string",
            description:
              "IP address for which this forwarding rule accepts traffic. When a client sends traffic to this IP address, the forwarding rule directs the traffic to the referenced target or backendService. While creating a forwarding rule, specifying an IPAddress is required under the following circumstances:      - When the target is set to targetGrpcProxy andvalidateForProxyless is set to true, theIPAddress should be set to 0.0.0.0.    - When the target is a Private Service Connect Google APIs    bundle, you must specify an IPAddress.   Otherwise, you can optionally specify an IP address that references an existing static (reserved) IP address resource. When omitted, Google Cloud assigns an ephemeral IP address.  Use one of the following formats to specify an IP address while creating a forwarding rule:  * IP address number, as in `100.1.2.3` * IPv6 address range, as in `2600:1234::/96` * Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/addresses/address-name * Partial URL or by name, as in:     - projects/project_id/regions/region/addresses/address-name    - regions/region/addresses/address-name    - global/addresses/address-name    - address-name    The forwarding rule's target or backendService, and in most cases, also the loadBalancingScheme, determine the type of IP address that you can use. For detailed information, see [IP address specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).  When reading an IPAddress, the API always returns the IP address number.",
          },
          required: false,
        },
        IPProtocol: {
          name: "I P Protocol",
          description:
            "The IP protocol to which this rule applies.  For protocol forwarding, valid options are TCP, UDP, ESP,AH, SCTP, ICMP andL3_DEFAULT.  The valid IP protocols are different for different load balancing products as described in [Load balancing features](https://cloud.google.com/load-balancing/docs/features#protocols_from_the_load_balancer_to_the_backends). Check the IPProtocolEnum enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_I_P_PROTOCOL_ENUM",
              "AH",
              "ESP",
              "ICMP",
              "L3_DEFAULT",
              "SCTP",
              "TCP",
              "UDP",
            ],
            description:
              "The IP protocol to which this rule applies.  For protocol forwarding, valid options are TCP, UDP, ESP,AH, SCTP, ICMP andL3_DEFAULT.  The valid IP protocols are different for different load balancing products as described in [Load balancing features](https://cloud.google.com/load-balancing/docs/features#protocols_from_the_load_balancer_to_the_backends). Check the IPProtocolEnum enum for the list of possible values.",
          },
          required: false,
        },
        allPorts: {
          name: "All Ports",
          description:
            "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The allPorts field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, SCTP, or L3_DEFAULT.    - It's applicable only to the following products: internal passthrough    Network Load Balancers, backend service-based external passthrough Network    Load Balancers, and internal and external protocol forwarding.    - Set this field to true to allow packets addressed to any port or    packets lacking destination port information (for example, UDP fragments    after the first fragment) to be forwarded to the backends configured with    this forwarding rule. The L3_DEFAULT protocol requiresallPorts be set to true.",
          type: {
            type: "boolean",
            description:
              "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The allPorts field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, SCTP, or L3_DEFAULT.    - It's applicable only to the following products: internal passthrough    Network Load Balancers, backend service-based external passthrough Network    Load Balancers, and internal and external protocol forwarding.    - Set this field to true to allow packets addressed to any port or    packets lacking destination port information (for example, UDP fragments    after the first fragment) to be forwarded to the backends configured with    this forwarding rule. The L3_DEFAULT protocol requiresallPorts be set to true.",
          },
          required: false,
        },
        allowGlobalAccess: {
          name: "Allow Global Access",
          description:
            "If set to true, clients can access the internal passthrough Network Load Balancers, the regional internal Application Load Balancer, and the regional internal proxy Network Load Balancer from all regions. If false, only allows access from the local region the load balancer is located at. Note that for INTERNAL_MANAGED forwarding rules, this field cannot be changed after the forwarding rule is created.",
          type: {
            type: "boolean",
            description:
              "If set to true, clients can access the internal passthrough Network Load Balancers, the regional internal Application Load Balancer, and the regional internal proxy Network Load Balancer from all regions. If false, only allows access from the local region the load balancer is located at. Note that for INTERNAL_MANAGED forwarding rules, this field cannot be changed after the forwarding rule is created.",
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
              "This is used in PSC consumer ForwardingRule to control whether the PSC endpoint can be accessed from another region.",
          },
          required: false,
        },
        backendService: {
          name: "Backend Service",
          description:
            "Identifies the backend service to which the forwarding rule sends traffic. Required for internal and external passthrough Network Load Balancers; must be omitted for all other load balancer types.",
          type: {
            type: "string",
            description:
              "Identifies the backend service to which the forwarding rule sends traffic. Required for internal and external passthrough Network Load Balancers; must be omitted for all other load balancer types.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          required: false,
        },
        externalManagedBackendBucketMigrationState: {
          name: "External Managed Backend Bucket Migration State",
          description:
            "Specifies the canary migration state for the backend buckets attached to this forwarding rule. Possible values are PREPARE, TEST_BY_PERCENTAGE, and TEST_ALL_TRAFFIC.  To begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be changed to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before the loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate traffic to backend buckets attached to this forwarding rule by percentage using externalManagedBackendBucketMigrationTestingPercentage.  Rolling back a migration requires the states to be set in reverse order. So changing the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to be set to TEST_ALL_TRAFFIC at the same time. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate some traffic back to EXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL. Check the ExternalManagedBackendBucketMigrationState enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_EXTERNAL_MANAGED_BACKEND_BUCKET_MIGRATION_STATE",
              "PREPARE",
              "TEST_ALL_TRAFFIC",
              "TEST_BY_PERCENTAGE",
            ],
            description:
              "Specifies the canary migration state for the backend buckets attached to this forwarding rule. Possible values are PREPARE, TEST_BY_PERCENTAGE, and TEST_ALL_TRAFFIC.  To begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be changed to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before the loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate traffic to backend buckets attached to this forwarding rule by percentage using externalManagedBackendBucketMigrationTestingPercentage.  Rolling back a migration requires the states to be set in reverse order. So changing the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to be set to TEST_ALL_TRAFFIC at the same time. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate some traffic back to EXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL. Check the ExternalManagedBackendBucketMigrationState enum for the list of possible values.",
          },
          required: false,
        },
        externalManagedBackendBucketMigrationTestingPercentage: {
          name: "External Managed Backend Bucket Migration Testing Percentage",
          description:
            "Determines the fraction of requests to backend buckets that should be processed by the global external Application Load Balancer.  The value of this field must be in the range [0, 100].  This value can only be set if the loadBalancingScheme in the BackendService is set to EXTERNAL (when using the classic Application Load Balancer) and the migration state is TEST_BY_PERCENTAGE.",
          type: {
            type: "number",
            description:
              "Determines the fraction of requests to backend buckets that should be processed by the global external Application Load Balancer.  The value of this field must be in the range [0, 100].  This value can only be set if the loadBalancingScheme in the BackendService is set to EXTERNAL (when using the classic Application Load Balancer) and the migration state is TEST_BY_PERCENTAGE.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a ForwardingRule. Include the fingerprint in patch request to ensure that you do not overwrite changes that were applied from another concurrent request.  To see the latest fingerprint, make a get() request to retrieve a ForwardingRule.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a ForwardingRule. Include the fingerprint in patch request to ensure that you do not overwrite changes that were applied from another concurrent request.  To see the latest fingerprint, make a get() request to retrieve a ForwardingRule.",
          },
          required: false,
        },
        ipCollection: {
          name: "Ip Collection",
          description:
            "Resource reference of a PublicDelegatedPrefix. The PDP must be a sub-PDP in EXTERNAL_IPV6_FORWARDING_RULE_CREATION mode.  Use one of the following formats to specify a sub-PDP when creating an IPv6 NetLB forwarding rule using BYOIP: Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name Partial URL, as in:     - projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name    - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          type: {
            type: "string",
            description:
              "Resource reference of a PublicDelegatedPrefix. The PDP must be a sub-PDP in EXTERNAL_IPV6_FORWARDING_RULE_CREATION mode.  Use one of the following formats to specify a sub-PDP when creating an IPv6 NetLB forwarding rule using BYOIP: Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name Partial URL, as in:     - projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name    - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          },
          required: false,
        },
        ipVersion: {
          name: "Ip Version",
          description:
            "The IP Version that will be used by this forwarding rule.  Valid options are IPV4 or IPV6. Check the IpVersion enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_IP_VERSION",
              "IPV4",
              "IPV6",
              "UNSPECIFIED_VERSION",
            ],
            description:
              "The IP Version that will be used by this forwarding rule.  Valid options are IPV4 or IPV6. Check the IpVersion enum for the list of possible values.",
          },
          required: false,
        },
        isMirroringCollector: {
          name: "Is Mirroring Collector",
          description:
            "Indicates whether or not this load balancer can be used as a collector for packet mirroring. To prevent mirroring loops, instances behind this load balancer will not have their traffic mirrored even if aPacketMirroring rule applies to them. This can only be set to true for load balancers that have theirloadBalancingScheme set to INTERNAL.",
          type: {
            type: "boolean",
            description:
              "Indicates whether or not this load balancer can be used as a collector for packet mirroring. To prevent mirroring loops, instances behind this load balancer will not have their traffic mirrored even if aPacketMirroring rule applies to them. This can only be set to true for load balancers that have theirloadBalancingScheme set to INTERNAL.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this resource, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a ForwardingRule.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this resource, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a ForwardingRule.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
          },
          required: false,
        },
        loadBalancingScheme: {
          name: "Load Balancing Scheme",
          description:
            "Specifies the forwarding rule type.  For more information about forwarding rules, refer to Forwarding rule concepts. Check the LoadBalancingScheme enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_LOAD_BALANCING_SCHEME",
              "EXTERNAL",
              "EXTERNAL_MANAGED",
              "INTERNAL",
              "INTERNAL_MANAGED",
              "INTERNAL_SELF_MANAGED",
              "INVALID",
            ],
            description:
              "Specifies the forwarding rule type.  For more information about forwarding rules, refer to Forwarding rule concepts. Check the LoadBalancingScheme enum for the list of possible values.",
          },
          required: false,
        },
        metadataFilters: {
          name: "Metadata Filters",
          description:
            "Opaque filter criteria used by load balancer to restrict routing configuration to a limited set of xDS compliant clients. In their xDS requests to load balancer, xDS clients present node metadata. When there is a match, the relevant configuration is made available to those proxies. Otherwise, all the resources (e.g.TargetHttpProxy, UrlMap) referenced by the ForwardingRule are not visible to those proxies.  For each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least one of thefilterLabels must match the corresponding label provided in the metadata. If its filterMatchCriteria is set to MATCH_ALL, then all of its filterLabels must match with corresponding labels provided in the metadata. If multiplemetadataFilters are specified, all of them need to be satisfied in order to be considered a match.  metadataFilters specified here will be applifed before those specified in the UrlMap that thisForwardingRule references.  metadataFilters only applies to Loadbalancers that have their loadBalancingScheme set toINTERNAL_SELF_MANAGED.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                filterLabels: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "Name of metadata label.   The name can have a maximum length of 1024 characters and must be at least 1 character long.",
                      },
                      value: {
                        type: "string",
                        description:
                          "The value of the label must match the specified value.  value can have a maximum length of 1024 characters.",
                      },
                    },
                    description:
                      "MetadataFilter label name value pairs that are expected to match corresponding labels presented as metadata to the load balancer.",
                    additionalProperties: true,
                  },
                  description:
                    "The list of label value pairs that must match labels in the provided metadata based on filterMatchCriteria  This list must not be empty and can have at the most 64 entries.",
                },
                filterMatchCriteria: {
                  type: "string",
                  enum: [
                    "UNDEFINED_FILTER_MATCH_CRITERIA",
                    "MATCH_ALL",
                    "MATCH_ANY",
                    "NOT_SET",
                  ],
                  description:
                    "Specifies how individual filter label matches within the list of filterLabels and contributes toward the overall metadataFilter match.   Supported values are:     - MATCH_ANY: at least one of the filterLabels    must have a matching label in the provided metadata.    - MATCH_ALL: all filterLabels must have    matching labels in the provided metadata. Check the FilterMatchCriteria enum for the list of possible values.",
                },
              },
              description:
                "Opaque filter criteria used by load balancers to restrict routing configuration to a limited set of load balancing proxies. Proxies and sidecars involved in load balancing would typically present metadata to the load balancers that need to match criteria specified here. If a match takes place, the relevant configuration is made available to those proxies.  For each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least one of thefilterLabels must match the corresponding label provided in the metadata. If its filterMatchCriteria is set to MATCH_ALL, then all of its filterLabels must match with corresponding labels provided in the metadata.  An example for using metadataFilters would be: if load balancing involves Envoys, they receive routing configuration when values inmetadataFilters match values supplied in  of their XDS requests to loadbalancers.",
              additionalProperties: true,
            },
            description:
              "Opaque filter criteria used by load balancer to restrict routing configuration to a limited set of xDS compliant clients. In their xDS requests to load balancer, xDS clients present node metadata. When there is a match, the relevant configuration is made available to those proxies. Otherwise, all the resources (e.g.TargetHttpProxy, UrlMap) referenced by the ForwardingRule are not visible to those proxies.  For each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least one of thefilterLabels must match the corresponding label provided in the metadata. If its filterMatchCriteria is set to MATCH_ALL, then all of its filterLabels must match with corresponding labels provided in the metadata. If multiplemetadataFilters are specified, all of them need to be satisfied in order to be considered a match.  metadataFilters specified here will be applifed before those specified in the UrlMap that thisForwardingRule references.  metadataFilters only applies to Loadbalancers that have their loadBalancingScheme set toINTERNAL_SELF_MANAGED.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.  For Private Service Connect forwarding rules that forward traffic to Google APIs, the forwarding rule name must be a 1-20 characters string with lowercase letters and numbers and must start with a letter.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.  For Private Service Connect forwarding rules that forward traffic to Google APIs, the forwarding rule name must be a 1-20 characters string with lowercase letters and numbers and must start with a letter.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "This field is not used for global external load balancing.  For internal passthrough Network Load Balancers, this field identifies the network that the load balanced IP should belong to for this forwarding rule. If the subnetwork is specified, the network of the subnetwork will be used. If neither subnetwork nor this field is specified, the default network will be used.  For Private Service Connect forwarding rules that forward traffic to Google APIs, a network must be provided.",
          type: {
            type: "string",
            description:
              "This field is not used for global external load balancing.  For internal passthrough Network Load Balancers, this field identifies the network that the load balanced IP should belong to for this forwarding rule. If the subnetwork is specified, the network of the subnetwork will be used. If neither subnetwork nor this field is specified, the default network will be used.  For Private Service Connect forwarding rules that forward traffic to Google APIs, a network must be provided.",
          },
          required: false,
        },
        networkTier: {
          name: "Network Tier",
          description:
            "This signifies the networking tier used for configuring this load balancer and can only take the following values:PREMIUM, STANDARD.  For regional ForwardingRule, the valid values are PREMIUM andSTANDARD. For GlobalForwardingRule, the valid value isPREMIUM.  If this field is not specified, it is assumed to be PREMIUM. If IPAddress is specified, this value must be equal to the networkTier of the Address. Check the NetworkTier enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_NETWORK_TIER",
              "FIXED_STANDARD",
              "PREMIUM",
              "STANDARD",
              "STANDARD_OVERRIDES_FIXED_STANDARD",
            ],
            description:
              "This signifies the networking tier used for configuring this load balancer and can only take the following values:PREMIUM, STANDARD.  For regional ForwardingRule, the valid values are PREMIUM andSTANDARD. For GlobalForwardingRule, the valid value isPREMIUM.  If this field is not specified, it is assumed to be PREMIUM. If IPAddress is specified, this value must be equal to the networkTier of the Address. Check the NetworkTier enum for the list of possible values.",
          },
          required: false,
        },
        noAutomateDnsZone: {
          name: "No Automate Dns Zone",
          description:
            "This is used in PSC consumer ForwardingRule to control whether it should try to auto-generate a DNS zone or not. Non-PSC forwarding rules do not use this field. Once set, this field is not mutable.",
          type: {
            type: "boolean",
            description:
              "This is used in PSC consumer ForwardingRule to control whether it should try to auto-generate a DNS zone or not. Non-PSC forwarding rules do not use this field. Once set, this field is not mutable.",
          },
          required: false,
        },
        portRange: {
          name: "Port Range",
          description:
            "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The portRange field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, or SCTP, and    - It's applicable only to the following products: external passthrough    Network Load Balancers, internal and external proxy Network Load Balancers,    internal and external Application Load Balancers, external protocol    forwarding, and Classic VPN.    - Some products have restrictions on what ports can be used. See    port specifications for details.    For external forwarding rules, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair, and cannot have overlappingportRanges.  For internal forwarding rules within the same VPC network, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair, and cannot have overlapping portRanges.  @pattern: \\\\d+(?:-\\\\d+)?",
          type: {
            type: "string",
            description:
              "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The portRange field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, or SCTP, and    - It's applicable only to the following products: external passthrough    Network Load Balancers, internal and external proxy Network Load Balancers,    internal and external Application Load Balancers, external protocol    forwarding, and Classic VPN.    - Some products have restrictions on what ports can be used. See    port specifications for details.    For external forwarding rules, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair, and cannot have overlappingportRanges.  For internal forwarding rules within the same VPC network, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair, and cannot have overlapping portRanges.  @pattern: \\\\d+(?:-\\\\d+)?",
          },
          required: false,
        },
        ports: {
          name: "Ports",
          description:
            "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The ports field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, or SCTP, and    - It's applicable only to the following products: internal passthrough    Network Load Balancers, backend service-based external passthrough Network    Load Balancers, and internal protocol forwarding.    - You can specify a list of up to five ports by number, separated by    commas. The ports can be contiguous or discontiguous.    For external forwarding rules, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair if they share at least one port number.  For internal forwarding rules within the same VPC network, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair if they share at least one port number.  @pattern: \\\\d+(?:-\\\\d+)?",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The ports field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, or SCTP, and    - It's applicable only to the following products: internal passthrough    Network Load Balancers, backend service-based external passthrough Network    Load Balancers, and internal protocol forwarding.    - You can specify a list of up to five ports by number, separated by    commas. The ports can be contiguous or discontiguous.    For external forwarding rules, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair if they share at least one port number.  For internal forwarding rules within the same VPC network, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair if they share at least one port number.  @pattern: \\\\d+(?:-\\\\d+)?",
          },
          required: false,
        },
        pscConnectionStatus: {
          name: "Psc Connection Status",
          description:
            "Check the PscConnectionStatus enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_PSC_CONNECTION_STATUS",
              "ACCEPTED",
              "CLOSED",
              "NEEDS_ATTENTION",
              "PENDING",
              "REJECTED",
              "STATUS_UNSPECIFIED",
            ],
            description:
              "Check the PscConnectionStatus enum for the list of possible values.",
          },
          required: false,
        },
        serviceDirectoryRegistrations: {
          name: "Service Directory Registrations",
          description:
            "Service Directory resources to register this forwarding rule with. Currently, only supports a single Service Directory resource.",
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
                    '[Optional] Service Directory region to register this global forwarding rule under. Default to "us-central1". Only used for PSC for Google APIs. All PSC for Google APIs forwarding rules on the same network should use the same Service Directory region.',
                },
              },
              description:
                "Describes the auto-registration of the forwarding rule to Service Directory. The region and project of the Service Directory resource generated from this registration will be the same as this forwarding rule.",
              additionalProperties: true,
            },
            description:
              "Service Directory resources to register this forwarding rule with. Currently, only supports a single Service Directory resource.",
          },
          required: false,
        },
        serviceLabel: {
          name: "Service Label",
          description:
            "An optional prefix to the service name for this forwarding rule. If specified, the prefix is the first label of the fully qualified service name.  The label must be 1-63 characters long, and comply withRFC1035. Specifically, the label must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.  This field is only used for internal load balancing.",
          type: {
            type: "string",
            description:
              "An optional prefix to the service name for this forwarding rule. If specified, the prefix is the first label of the fully qualified service name.  The label must be 1-63 characters long, and comply withRFC1035. Specifically, the label must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.  This field is only used for internal load balancing.",
          },
          required: false,
        },
        sourceIpRanges: {
          name: "Source Ip Ranges",
          description:
            "If not empty, this forwarding rule will only forward the traffic when the source IP address matches one of the IP addresses or CIDR ranges set here. Note that a forwarding rule can only have up to 64 source IP ranges, and this field can only be used with a regional forwarding rule whose scheme isEXTERNAL. Each source_ip_range entry should be either an IP address (for example, 1.2.3.4) or a CIDR range (for example, 1.2.3.0/24).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If not empty, this forwarding rule will only forward the traffic when the source IP address matches one of the IP addresses or CIDR ranges set here. Note that a forwarding rule can only have up to 64 source IP ranges, and this field can only be used with a regional forwarding rule whose scheme isEXTERNAL. Each source_ip_range entry should be either an IP address (for example, 1.2.3.4) or a CIDR range (for example, 1.2.3.0/24).",
          },
          required: false,
        },
        subnetwork: {
          name: "Subnetwork",
          description:
            "This field identifies the subnetwork that the load balanced IP should belong to for this forwarding rule, used with internal load balancers and external passthrough Network Load Balancers with IPv6.  If the network specified is in auto subnet mode, this field is optional. However, a subnetwork must be specified if the network is in custom subnet mode or when creating external forwarding rule with IPv6.",
          type: {
            type: "string",
            description:
              "This field identifies the subnetwork that the load balanced IP should belong to for this forwarding rule, used with internal load balancers and external passthrough Network Load Balancers with IPv6.  If the network specified is in auto subnet mode, this field is optional. However, a subnetwork must be specified if the network is in custom subnet mode or when creating external forwarding rule with IPv6.",
          },
          required: false,
        },
        target: {
          name: "Target",
          description:
            'The URL of the target resource to receive the matched traffic.  For regional forwarding rules, this target must be in the same region as the forwarding rule. For global forwarding rules, this target must be a global load balancing resource.  The forwarded traffic must be of a type appropriate to the target object.        -  For load balancers, see the "Target" column in [Port specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).      -  For Private Service Connect forwarding rules that forward traffic to Google APIs, provide the name of a supported Google API bundle:               -  vpc-sc -  APIs that support VPC Service Controls.             -  all-apis - All supported Google APIs.        -  For Private Service Connect forwarding rules that forward traffic to managed services, the target must be a service attachment. The target is not mutable once set as a service attachment.',
          type: {
            type: "string",
            description:
              'The URL of the target resource to receive the matched traffic.  For regional forwarding rules, this target must be in the same region as the forwarding rule. For global forwarding rules, this target must be a global load balancing resource.  The forwarded traffic must be of a type appropriate to the target object.        -  For load balancers, see the "Target" column in [Port specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).      -  For Private Service Connect forwarding rules that forward traffic to Google APIs, provide the name of a supported Google API bundle:               -  vpc-sc -  APIs that support VPC Service Controls.             -  all-apis - All supported Google APIs.        -  For Private Service Connect forwarding rules that forward traffic to managed services, the target must be a service attachment. The target is not mutable once set as a service attachment.',
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
            description:
              "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.forwardingRule !== undefined)
          pathParams["forwarding_rule"] = String(
            input.event.inputConfig.forwardingRule,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.IPAddress !== undefined)
          body.IPAddress = input.event.inputConfig.IPAddress;
        if (input.event.inputConfig.IPProtocol !== undefined)
          body.IPProtocol = input.event.inputConfig.IPProtocol;
        if (input.event.inputConfig.allPorts !== undefined)
          body.allPorts = input.event.inputConfig.allPorts;
        if (input.event.inputConfig.allowGlobalAccess !== undefined)
          body.allowGlobalAccess = input.event.inputConfig.allowGlobalAccess;
        if (input.event.inputConfig.allowPscGlobalAccess !== undefined)
          body.allowPscGlobalAccess =
            input.event.inputConfig.allowPscGlobalAccess;
        if (input.event.inputConfig.backendService !== undefined)
          body.backendService = input.event.inputConfig.backendService;
        if (input.event.inputConfig.baseForwardingRule !== undefined)
          body.baseForwardingRule = input.event.inputConfig.baseForwardingRule;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (
          input.event.inputConfig.externalManagedBackendBucketMigrationState !==
          undefined
        )
          body.externalManagedBackendBucketMigrationState =
            input.event.inputConfig.externalManagedBackendBucketMigrationState;
        if (
          input.event.inputConfig
            .externalManagedBackendBucketMigrationTestingPercentage !==
          undefined
        )
          body.externalManagedBackendBucketMigrationTestingPercentage =
            input.event.inputConfig.externalManagedBackendBucketMigrationTestingPercentage;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.ipCollection !== undefined)
          body.ipCollection = input.event.inputConfig.ipCollection;
        if (input.event.inputConfig.ipVersion !== undefined)
          body.ipVersion = input.event.inputConfig.ipVersion;
        if (input.event.inputConfig.isMirroringCollector !== undefined)
          body.isMirroringCollector =
            input.event.inputConfig.isMirroringCollector;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          body.labelFingerprint = input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.loadBalancingScheme !== undefined)
          body.loadBalancingScheme =
            input.event.inputConfig.loadBalancingScheme;
        if (input.event.inputConfig.metadataFilters !== undefined)
          body.metadataFilters = input.event.inputConfig.metadataFilters;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.network !== undefined)
          body.network = input.event.inputConfig.network;
        if (input.event.inputConfig.networkTier !== undefined)
          body.networkTier = input.event.inputConfig.networkTier;
        if (input.event.inputConfig.noAutomateDnsZone !== undefined)
          body.noAutomateDnsZone = input.event.inputConfig.noAutomateDnsZone;
        if (input.event.inputConfig.portRange !== undefined)
          body.portRange = input.event.inputConfig.portRange;
        if (input.event.inputConfig.ports !== undefined)
          body.ports = input.event.inputConfig.ports;
        if (input.event.inputConfig.pscConnectionId !== undefined)
          body.pscConnectionId = input.event.inputConfig.pscConnectionId;
        if (input.event.inputConfig.pscConnectionStatus !== undefined)
          body.pscConnectionStatus =
            input.event.inputConfig.pscConnectionStatus;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.selfLinkWithId !== undefined)
          body.selfLinkWithId = input.event.inputConfig.selfLinkWithId;
        if (input.event.inputConfig.serviceDirectoryRegistrations !== undefined)
          body.serviceDirectoryRegistrations =
            input.event.inputConfig.serviceDirectoryRegistrations;
        if (input.event.inputConfig.serviceLabel !== undefined)
          body.serviceLabel = input.event.inputConfig.serviceLabel;
        if (input.event.inputConfig.serviceName !== undefined)
          body.serviceName = input.event.inputConfig.serviceName;
        if (input.event.inputConfig.sourceIpRanges !== undefined)
          body.sourceIpRanges = input.event.inputConfig.sourceIpRanges;
        if (input.event.inputConfig.subnetwork !== undefined)
          body.subnetwork = input.event.inputConfig.subnetwork;
        if (input.event.inputConfig.target !== undefined)
          body.target = input.event.inputConfig.target;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/global/forwardingRules/{forwarding_rule}",
          pathParams,
          queryParams,
          body: Object.keys(body).length > 0 ? body : undefined,
        });

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
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339 text format.",
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
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          errorInfo: {
                            type: "object",
                            properties: {
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain is typically the registered service name of the tool or product that generates the error. Example: "pubsub.googleapis.com". If the error is generated by some common infrastructure, the error domain must be a globally unique value that identifies the infrastructure. For Google API infrastructure, the error domain is "googleapis.com".',
                              },
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.  Keys must match a regular expression of `a-z+` but should ideally be lowerCamelCase. Also, they must be limited to 64 characters in length. When identifying the current value of an exceeded limit, the units should be contained in the key, not the value.  For example, rather than `{"instanceLimit": "100/request"}`, should be returned as, `{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of instances that can be created in a single (batch) request.',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the proximate cause of the error. Error reasons are unique within a particular domain of errors. This should be at most 63 characters and match a regular expression of `A-Z+[A-Z0-9]`, which represents UPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.  Example of an error when contacting the "pubsub.googleapis.com" API when it is not enabled:      { "reason": "API_DISABLED"       "domain": "googleapis.com"       "metadata": {         "resource": "projects/123",         "service": "pubsub.googleapis.com"       }     }  This response indicates that the pubsub.googleapis.com API is not enabled.  Example of an error that is returned when attempting to create a Spanner instance in a region that is out of stock:      { "reason": "STOCKOUT"       "domain": "spanner.googleapis.com",       "metadata": {         "availableRegions": "us-central1,us-east2"       }     }',
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
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
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
                              "Provides links to documentation or for performing an out of band action.  For example, if a quota check failed with an error indicating the calling project hasn't enabled the accessed service, this can contain a URL pointing directly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                          localizedMessage: {
                            type: "object",
                            properties: {
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at https://www.rfc-editor.org/rfc/bcp/bcp47.txt. Examples are: "en-US", "fr-CH", "es-MX"',
                              },
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user which can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_ROLLOUT_STATUS",
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit. Check the RolloutStatus enum for the list of possible values.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error details. There is a set of defined message types to use for providing details.The syntax depends on the error code. For example, QuotaExceededInfo will have details when the error code is QUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error. This property is optional.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this operation.",
              },
            },
            description:
              "Output only. Errors that prevented the ResizeRequest to be fulfilled.",
            additionalProperties: true,
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always `compute#operation` for Operation resources.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          operationGroupId: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`, `update`, or `delete`, and so on.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only applicable when performing regional operations.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "[Output Only] Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] If the operation is for projects.setCommonInstanceMetadata, this field will contain information on all underlying zonal actions and their state.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server. This value is inRFC3339 text format.",
          },
          status: {
            type: "string",
            enum: ["UNDEFINED_STATUS", "DONE", "PENDING", "RUNNING"],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          targetId: {
            type: "string",
            description: "64-bit integer as string",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the disk that the snapshot was created from.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example: `user@example.com` or `alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "UNDEFINED_CODE",
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
                    "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
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
                    '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                },
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the operation, this field will be populated.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only applicable when performing per-zone operations.",
          },
        },
        description:
          "Represents an Operation resource.  Google Compute Engine has three Operation resources:  * [Global](/compute/docs/reference/rest/v1/globalOperations) * [Regional](/compute/docs/reference/rest/v1/regionOperations) * [Zonal](/compute/docs/reference/rest/v1/zoneOperations)  You can use an operation resource to manage asynchronous API requests. For more information, readHandling API responses.  Operations can be global, regional or zonal.     - For global operations, use the `globalOperations`    resource.    - For regional operations, use the    `regionOperations` resource.    - For zonal operations, use    the `zoneOperations` resource.    For more information, read Global, Regional, and Zonal Resources.  Note that completed Operation resources have a limited retention period.",
        additionalProperties: true,
      },
    },
  },
};

export default globalForwardingRulesPatch;
