import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const globalForwardingRulesGet: AppBlock = {
  name: "Global Forwarding Rules - Get",
  description: `Returns the specified Zone resource.`,
  category: "Global Forwarding Rules",
  inputs: {
    default: {
      config: {
        forwardingRule: {
          name: "Forwarding Rule",
          description: "Name of the ForwardingRule resource to return.",
          type: {
            type: "string",
            description: "Name of the ForwardingRule resource to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.forwardingRule !== undefined)
          pathParams["forwarding_rule"] = String(
            input.event.inputConfig.forwardingRule,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/forwardingRules/{forwarding_rule}",
          pathParams,
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
          IPAddress: {
            type: "string",
            description:
              "IP address for which this forwarding rule accepts traffic. When a client sends traffic to this IP address, the forwarding rule directs the traffic to the referenced target or backendService. While creating a forwarding rule, specifying an IPAddress is required under the following circumstances:      - When the target is set to targetGrpcProxy andvalidateForProxyless is set to true, theIPAddress should be set to 0.0.0.0.    - When the target is a Private Service Connect Google APIs    bundle, you must specify an IPAddress.   Otherwise, you can optionally specify an IP address that references an existing static (reserved) IP address resource. When omitted, Google Cloud assigns an ephemeral IP address.  Use one of the following formats to specify an IP address while creating a forwarding rule:  * IP address number, as in `100.1.2.3` * IPv6 address range, as in `2600:1234::/96` * Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/addresses/address-name * Partial URL or by name, as in:     - projects/project_id/regions/region/addresses/address-name    - regions/region/addresses/address-name    - global/addresses/address-name    - address-name    The forwarding rule's target or backendService, and in most cases, also the loadBalancingScheme, determine the type of IP address that you can use. For detailed information, see [IP address specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).  When reading an IPAddress, the API always returns the IP address number.",
          },
          IPProtocol: {
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
          allPorts: {
            type: "boolean",
            description:
              "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The allPorts field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, SCTP, or L3_DEFAULT.    - It's applicable only to the following products: internal passthrough    Network Load Balancers, backend service-based external passthrough Network    Load Balancers, and internal and external protocol forwarding.    - Set this field to true to allow packets addressed to any port or    packets lacking destination port information (for example, UDP fragments    after the first fragment) to be forwarded to the backends configured with    this forwarding rule. The L3_DEFAULT protocol requiresallPorts be set to true.",
          },
          allowGlobalAccess: {
            type: "boolean",
            description:
              "If set to true, clients can access the internal passthrough Network Load Balancers, the regional internal Application Load Balancer, and the regional internal proxy Network Load Balancer from all regions. If false, only allows access from the local region the load balancer is located at. Note that for INTERNAL_MANAGED forwarding rules, this field cannot be changed after the forwarding rule is created.",
          },
          allowPscGlobalAccess: {
            type: "boolean",
            description:
              "This is used in PSC consumer ForwardingRule to control whether the PSC endpoint can be accessed from another region.",
          },
          backendService: {
            type: "string",
            description:
              "Identifies the backend service to which the forwarding rule sends traffic. Required for internal and external passthrough Network Load Balancers; must be omitted for all other load balancer types.",
          },
          baseForwardingRule: {
            type: "string",
            description:
              "Output only. [Output Only] The URL for the corresponding base forwarding rule. By base forwarding rule, we mean the forwarding rule that has the same IP address, protocol, and port settings with the current forwarding rule, but without sourceIPRanges specified. Always empty if the current forwarding rule does not have sourceIPRanges specified.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          externalManagedBackendBucketMigrationState: {
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
          externalManagedBackendBucketMigrationTestingPercentage: {
            type: "number",
            description:
              "Determines the fraction of requests to backend buckets that should be processed by the global external Application Load Balancer.  The value of this field must be in the range [0, 100].  This value can only be set if the loadBalancingScheme in the BackendService is set to EXTERNAL (when using the classic Application Load Balancer) and the migration state is TEST_BY_PERCENTAGE.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a ForwardingRule. Include the fingerprint in patch request to ensure that you do not overwrite changes that were applied from another concurrent request.  To see the latest fingerprint, make a get() request to retrieve a ForwardingRule.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          ipCollection: {
            type: "string",
            description:
              "Resource reference of a PublicDelegatedPrefix. The PDP must be a sub-PDP in EXTERNAL_IPV6_FORWARDING_RULE_CREATION mode.  Use one of the following formats to specify a sub-PDP when creating an IPv6 NetLB forwarding rule using BYOIP: Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name Partial URL, as in:     - projects/project_id/regions/region/publicDelegatedPrefixes/sub-pdp-name    - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          },
          ipVersion: {
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
          isMirroringCollector: {
            type: "boolean",
            description:
              "Indicates whether or not this load balancer can be used as a collector for packet mirroring. To prevent mirroring loops, instances behind this load balancer will not have their traffic mirrored even if aPacketMirroring rule applies to them. This can only be set to true for load balancers that have theirloadBalancingScheme set to INTERNAL.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#forwardingRule for forwarding rule resources.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this resource, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a ForwardingRule.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
          },
          loadBalancingScheme: {
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
          metadataFilters: {
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
          name: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.  For Private Service Connect forwarding rules that forward traffic to Google APIs, the forwarding rule name must be a 1-20 characters string with lowercase letters and numbers and must start with a letter.",
          },
          network: {
            type: "string",
            description:
              "This field is not used for global external load balancing.  For internal passthrough Network Load Balancers, this field identifies the network that the load balanced IP should belong to for this forwarding rule. If the subnetwork is specified, the network of the subnetwork will be used. If neither subnetwork nor this field is specified, the default network will be used.  For Private Service Connect forwarding rules that forward traffic to Google APIs, a network must be provided.",
          },
          networkTier: {
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
          noAutomateDnsZone: {
            type: "boolean",
            description:
              "This is used in PSC consumer ForwardingRule to control whether it should try to auto-generate a DNS zone or not. Non-PSC forwarding rules do not use this field. Once set, this field is not mutable.",
          },
          portRange: {
            type: "string",
            description:
              "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The portRange field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, or SCTP, and    - It's applicable only to the following products: external passthrough    Network Load Balancers, internal and external proxy Network Load Balancers,    internal and external Application Load Balancers, external protocol    forwarding, and Classic VPN.    - Some products have restrictions on what ports can be used. See    port specifications for details.    For external forwarding rules, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair, and cannot have overlappingportRanges.  For internal forwarding rules within the same VPC network, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair, and cannot have overlapping portRanges.  @pattern: \\\\d+(?:-\\\\d+)?",
          },
          ports: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The ports, portRange, and allPorts fields are mutually exclusive. Only packets addressed to ports in the specified range will be forwarded to the backends configured with this forwarding rule.  The ports field has the following limitations:     - It requires that the forwarding rule IPProtocol be TCP,    UDP, or SCTP, and    - It's applicable only to the following products: internal passthrough    Network Load Balancers, backend service-based external passthrough Network    Load Balancers, and internal protocol forwarding.    - You can specify a list of up to five ports by number, separated by    commas. The ports can be contiguous or discontiguous.    For external forwarding rules, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair if they share at least one port number.  For internal forwarding rules within the same VPC network, two or more forwarding rules cannot use the same [IPAddress, IPProtocol] pair if they share at least one port number.  @pattern: \\\\d+(?:-\\\\d+)?",
          },
          pscConnectionId: {
            type: "string",
            description: "64-bit integer as string",
          },
          pscConnectionStatus: {
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
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the regional forwarding rule resides. This field is not applicable to global forwarding rules. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          selfLinkWithId: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource with the resource id.",
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
          serviceLabel: {
            type: "string",
            description:
              "An optional prefix to the service name for this forwarding rule. If specified, the prefix is the first label of the fully qualified service name.  The label must be 1-63 characters long, and comply withRFC1035. Specifically, the label must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.  This field is only used for internal load balancing.",
          },
          serviceName: {
            type: "string",
            description:
              "[Output Only] The internal fully qualified service name for this forwarding rule.  This field is only used for internal load balancing.",
          },
          sourceIpRanges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If not empty, this forwarding rule will only forward the traffic when the source IP address matches one of the IP addresses or CIDR ranges set here. Note that a forwarding rule can only have up to 64 source IP ranges, and this field can only be used with a regional forwarding rule whose scheme isEXTERNAL. Each source_ip_range entry should be either an IP address (for example, 1.2.3.4) or a CIDR range (for example, 1.2.3.0/24).",
          },
          subnetwork: {
            type: "string",
            description:
              "This field identifies the subnetwork that the load balanced IP should belong to for this forwarding rule, used with internal load balancers and external passthrough Network Load Balancers with IPv6.  If the network specified is in auto subnet mode, this field is optional. However, a subnetwork must be specified if the network is in custom subnet mode or when creating external forwarding rule with IPv6.",
          },
          target: {
            type: "string",
            description:
              'The URL of the target resource to receive the matched traffic.  For regional forwarding rules, this target must be in the same region as the forwarding rule. For global forwarding rules, this target must be a global load balancing resource.  The forwarded traffic must be of a type appropriate to the target object.        -  For load balancers, see the "Target" column in [Port specifications](https://cloud.google.com/load-balancing/docs/forwarding-rule-concepts#ip_address_specifications).      -  For Private Service Connect forwarding rules that forward traffic to Google APIs, provide the name of a supported Google API bundle:               -  vpc-sc -  APIs that support VPC Service Controls.             -  all-apis - All supported Google APIs.        -  For Private Service Connect forwarding rules that forward traffic to managed services, the target must be a service attachment. The target is not mutable once set as a service attachment.',
          },
        },
        description:
          "Represents a Forwarding Rule resource.  Forwarding rule resources in Google Cloud can be either regional or global in scope:  * [Global](https://cloud.google.com/compute/docs/reference/rest/v1/globalForwardingRules) * [Regional](https://cloud.google.com/compute/docs/reference/rest/v1/forwardingRules)  A forwarding rule and its corresponding IP address represent the frontend configuration of a Google Cloud load balancer. Forwarding rules can also reference target instances and Cloud VPN Classic gateways (targetVpnGateway).  For more information, read Forwarding rule concepts and Using protocol forwarding.",
        additionalProperties: true,
      },
    },
  },
};

export default globalForwardingRulesGet;
