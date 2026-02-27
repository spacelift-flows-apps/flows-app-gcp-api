import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const routersInsert: AppBlock = {
  name: "Routers - Insert",
  description: `Creates a wire group in the specified project in the given scope using the parameters that are included in the request.`,
  category: "Routers",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
            description: "Name of the region for this request.",
          },
          required: true,
        },
        bgp: {
          name: "Bgp",
          description: "BGP information specific to this router.",
          type: {
            type: "object",
            properties: {
              advertiseMode: {
                type: "string",
                enum: ["UNDEFINED_ADVERTISE_MODE", "CUSTOM", "DEFAULT"],
                description:
                  "User-specified flag to indicate which mode to use for advertisement. The options are DEFAULT or CUSTOM. Check the AdvertiseMode enum for the list of possible values.",
              },
              advertisedGroups: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["UNDEFINED_ADVERTISED_GROUPS", "ALL_SUBNETS"],
                },
                description:
                  "User-specified list of prefix groups to advertise in custom mode. This field can only be populated if advertise_mode is CUSTOM and is advertised to all peers of the router. These groups will be advertised in addition to any specified prefixes. Leave this field blank to advertise no custom groups. Check the AdvertisedGroups enum for the list of possible values.",
              },
              advertisedIpRanges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    description: {
                      type: "string",
                      description:
                        "User-specified description for the IP range.",
                    },
                    range: {
                      type: "string",
                      description:
                        "The IP range to advertise. The value must be a CIDR-formatted string.",
                    },
                  },
                  description:
                    "Description-tagged IP ranges for the router to advertise.",
                  additionalProperties: true,
                },
                description:
                  "User-specified list of individual IP ranges to advertise in custom mode. This field can only be populated if advertise_mode is CUSTOM and is advertised to all peers of the router. These IP ranges will be advertised in addition to any specified groups. Leave this field blank to advertise no custom IP ranges.",
              },
              asn: {
                type: "integer",
                description:
                  "Local BGP Autonomous System Number (ASN). Must be anRFC6996 private ASN, either 16-bit or 32-bit. The value will be fixed for this router resource. All VPN tunnels that link to this router will have the same local ASN.",
              },
              identifierRange: {
                type: "string",
                description:
                  'Explicitly specifies a range of valid BGP Identifiers for this Router. It is provided as a link-local IPv4 range (from 169.254.0.0/16), of size at least /30, even if the BGP sessions are over IPv6. It must not overlap with any IPv4 BGP session ranges.   Other vendors commonly call this "router ID".',
              },
              keepaliveInterval: {
                type: "integer",
                description:
                  "The interval in seconds between BGP keepalive messages that are sent to the peer.   Hold time is three times the interval at which keepalive messages are sent, and the hold time is the maximum number of seconds allowed to elapse between successive keepalive messages that BGP receives from a peer.   BGP will use the smaller of either the local hold time value or the peer's hold time value as the hold time for the BGP connection between the two peers.   If set, this value must be between 20 and 60. The default is 20.",
              },
            },
            additionalProperties: true,
            description: "BGP information specific to this router.",
          },
          required: false,
        },
        bgpPeers: {
          name: "Bgp Peers",
          description:
            "BGP information that must be configured into the routing stack to establish BGP peering. This information must specify the peer ASN and either the interface name, IP address, or peer IP address. Please refer toRFC4273.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                advertiseMode: {
                  type: "string",
                  enum: ["UNDEFINED_ADVERTISE_MODE", "CUSTOM", "DEFAULT"],
                  description:
                    "User-specified flag to indicate which mode to use for advertisement. Check the AdvertiseMode enum for the list of possible values.",
                },
                advertisedGroups: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["UNDEFINED_ADVERTISED_GROUPS", "ALL_SUBNETS"],
                  },
                  description:
                    'User-specified list of prefix groups to advertise in custom mode, which currently supports the following option:     - ALL_SUBNETS: Advertises all of the router\'s own VPC subnets. This    excludes any routes learned for subnets that use    VPC Network Peering.   Note that this field can only be populated if advertise_mode is CUSTOM and overrides the list defined for the router (in the "bgp" message). These groups are advertised in addition to any specified prefixes. Leave this field blank to advertise no custom groups. Check the AdvertisedGroups enum for the list of possible values.',
                },
                advertisedIpRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      description: {
                        type: "string",
                        description:
                          "User-specified description for the IP range.",
                      },
                      range: {
                        type: "string",
                        description:
                          "The IP range to advertise. The value must be a CIDR-formatted string.",
                      },
                    },
                    description:
                      "Description-tagged IP ranges for the router to advertise.",
                    additionalProperties: true,
                  },
                  description:
                    'User-specified list of individual IP ranges to advertise in custom mode. This field can only be populated if advertise_mode is CUSTOM and overrides the list defined for the router (in the "bgp" message). These IP ranges are advertised in addition to any specified groups. Leave this field blank to advertise no custom IP ranges.',
                },
                advertisedRoutePriority: {
                  type: "integer",
                  description:
                    "The priority of routes advertised to this BGP peer. Where there is more than one matching route of maximum length, the routes with the lowest priority value win.",
                },
                bfd: {
                  type: "object",
                  properties: {
                    minReceiveInterval: {
                      type: "integer",
                      description:
                        "The minimum interval, in milliseconds, between BFD control packets received from the peer router. The actual value is negotiated between the two routers and is equal to the greater of this value and the transmit interval of the other router.   If set, this value must be between 1000 and 30000.   The default is 1000.",
                    },
                    minTransmitInterval: {
                      type: "integer",
                      description:
                        "The minimum interval, in milliseconds, between BFD control packets transmitted to the peer router. The actual value is negotiated between the two routers and is equal to the greater of this value and the corresponding receive interval of the other router.   If set, this value must be between 1000 and 30000.   The default is 1000.",
                    },
                    multiplier: {
                      type: "integer",
                      description:
                        "The number of consecutive BFD packets that must be missed before BFD declares that a peer is unavailable.   If set, the value must be a value between 5 and 16.   The default is 5.",
                    },
                    sessionInitializationMode: {
                      type: "string",
                      enum: [
                        "UNDEFINED_SESSION_INITIALIZATION_MODE",
                        "ACTIVE",
                        "DISABLED",
                        "PASSIVE",
                      ],
                      description:
                        "The BFD session initialization mode for this BGP peer.   If set to ACTIVE, the Cloud Router will initiate the BFD session for this BGP peer. If set to PASSIVE, the Cloud Router will wait for the peer router to initiate the BFD session for this BGP peer. If set to DISABLED, BFD is disabled for this BGP peer. The default is DISABLED. Check the SessionInitializationMode enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                  description: "BFD configuration for the BGP peering.",
                },
                customLearnedIpRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      range: {
                        type: "string",
                        description:
                          "The custom learned route IP address range. Must be a valid CIDR-formatted prefix. If an IP address is provided without a subnet mask, it is interpreted as, for IPv4, a `/32` singular IP address range, and, for IPv6, `/128`.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "A list of user-defined custom learned route IP address ranges for a BGP session.",
                },
                customLearnedRoutePriority: {
                  type: "integer",
                  description:
                    "The user-defined custom learned route priority for a BGP session. This value is applied to all custom learned route ranges for the session. You can choose a value from `0` to `65335`. If you don't provide a value, Google Cloud assigns a priority of `100` to the ranges.",
                },
                enable: {
                  type: "string",
                  enum: ["UNDEFINED_ENABLE", "FALSE", "TRUE"],
                  description:
                    "The status of the BGP peer connection.   If set to FALSE, any active session with the peer is terminated and all associated routing information is removed. If set to TRUE, the peer connection can be established with routing information. The default is TRUE. Check the Enable enum for the list of possible values.",
                },
                enableIpv4: {
                  type: "boolean",
                  description:
                    "Enable IPv4 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 4.",
                },
                enableIpv6: {
                  type: "boolean",
                  description:
                    "Enable IPv6 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 6.",
                },
                exportPolicies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of export policies applied to this peer, in the order they must be evaluated. The name must correspond to an existing policy that has ROUTE_POLICY_TYPE_EXPORT type.",
                },
                importPolicies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of import policies applied to this peer, in the order they must be evaluated. The name must correspond to an existing policy that has ROUTE_POLICY_TYPE_IMPORT type.",
                },
                interfaceName: {
                  type: "string",
                  description:
                    "Name of the interface the BGP peer is associated with.",
                },
                ipAddress: {
                  type: "string",
                  description:
                    "IP address of the interface inside Google Cloud Platform.",
                },
                ipv4NexthopAddress: {
                  type: "string",
                  description:
                    "IPv4 address of the interface inside Google Cloud Platform.",
                },
                ipv6NexthopAddress: {
                  type: "string",
                  description:
                    "IPv6 address of the interface inside Google Cloud Platform.",
                },
                md5AuthenticationKeyName: {
                  type: "string",
                  description:
                    "Present if MD5 authentication is enabled for the peering. Must be the name of one of the entries in the Router.md5_authentication_keys. The field must comply with RFC1035.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this BGP peer. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                peerAsn: {
                  type: "integer",
                  description:
                    "Peer BGP Autonomous System Number (ASN). Each BGP interface may use a different value.",
                },
                peerIpAddress: {
                  type: "string",
                  description:
                    "IP address of the BGP interface outside Google Cloud Platform.",
                },
                peerIpv4NexthopAddress: {
                  type: "string",
                  description:
                    "IPv4 address of the BGP interface outside Google Cloud Platform.",
                },
                peerIpv6NexthopAddress: {
                  type: "string",
                  description:
                    "IPv6 address of the BGP interface outside Google Cloud Platform.",
                },
                routerApplianceInstance: {
                  type: "string",
                  description:
                    "URI of the VM instance that is used as third-party router appliances such as Next Gen Firewalls, Virtual Routers, or Router Appliances. The VM instance must be located in zones contained in the same region as this Cloud Router. The VM instance is the peer side of the BGP session.",
                },
              },
              additionalProperties: true,
            },
            description:
              "BGP information that must be configured into the routing stack to establish BGP peering. This information must specify the peer ASN and either the interface name, IP address, or peer IP address. Please refer toRFC4273.",
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
        encryptedInterconnectRouter: {
          name: "Encrypted Interconnect Router",
          description:
            "Indicates if a router is dedicated for use with encrypted VLAN attachments (interconnectAttachments).",
          type: {
            type: "boolean",
            description:
              "Indicates if a router is dedicated for use with encrypted VLAN attachments (interconnectAttachments).",
          },
          required: false,
        },
        interfaces: {
          name: "Interfaces",
          description:
            "Router interfaces. To create a BGP peer that uses a router interface, the interface must have one of the following fields specified:     - linkedVpnTunnel    - linkedInterconnectAttachment    - subnetwork   You can create a router interface without any of these fields specified. However, you cannot create a BGP peer that uses that interface.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ipRange: {
                  type: "string",
                  description:
                    "IP address and range of the interface.     - For Internet Protocol version 4 (IPv4), the IP range must be in theRFC3927 link-local IP address space. The value must    be a CIDR-formatted string, for example, 169.254.0.1/30.    Note: Do not truncate the IP address, as it represents the IP address of    the interface.    - For Internet Protocol version 6 (IPv6), the value    must be a unique local address (ULA) range from fdff:1::/64    with a mask length of 126 or less. This value should be a CIDR-formatted    string, for example, fdff:1::1/112. Within the router's    VPC, this IPv6 prefix will be reserved exclusively for this connection    and cannot be used for any other purpose.",
                },
                ipVersion: {
                  type: "string",
                  enum: ["UNDEFINED_IP_VERSION", "IPV4", "IPV6"],
                  description:
                    "IP version of this interface. Check the IpVersion enum for the list of possible values.",
                },
                linkedInterconnectAttachment: {
                  type: "string",
                  description:
                    "URI of the linked Interconnect attachment. It must be in the same region as the router. Each interface can have one linked resource, which can be a VPN tunnel, an Interconnect attachment, or a subnetwork.",
                },
                linkedVpnTunnel: {
                  type: "string",
                  description:
                    "URI of the linked VPN tunnel, which must be in the same region as the router. Each interface can have one linked resource, which can be a VPN tunnel, an Interconnect attachment, or a subnetwork.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this interface entry. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                privateIpAddress: {
                  type: "string",
                  description:
                    "The regional private internal IP address that is used to establish BGP sessions to a VM instance acting as a third-party Router Appliance, such as a Next Gen Firewall, a Virtual Router, or an SD-WAN VM.",
                },
                redundantInterface: {
                  type: "string",
                  description:
                    "Name of the interface that will be redundant with the current interface you are creating. The redundantInterface must belong to the same Cloud Router as the interface here. To establish the BGP session to a Router Appliance VM, you must create two BGP peers. The two BGP peers must be attached to two separate interfaces that are redundant with each other. The redundant_interface must be 1-63 characters long, and comply withRFC1035. Specifically, the redundant_interface must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                subnetwork: {
                  type: "string",
                  description:
                    "The URI of the subnetwork resource that this interface belongs to, which must be in the same region as the Cloud Router. When you establish a BGP session to a VM instance using this interface, the VM instance must belong to the same subnetwork as the subnetwork specified here.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Router interfaces. To create a BGP peer that uses a router interface, the interface must have one of the following fields specified:     - linkedVpnTunnel    - linkedInterconnectAttachment    - subnetwork   You can create a router interface without any of these fields specified. However, you cannot create a BGP peer that uses that interface.",
          },
          required: false,
        },
        md5AuthenticationKeys: {
          name: "Md5 Authentication Keys",
          description: "Keys used for MD5 authentication.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                  description:
                    "[Input only] Value of the key.  For patch and update calls, it can be skipped to copy the value from the previous configuration. This is allowed if the key with the same name existed before the operation. Maximum length is 80 characters. Can only contain printable ASCII characters.",
                },
                name: {
                  type: "string",
                  description:
                    "Name used to identify the key.  Must be unique within a router. Must be referenced by exactly one bgpPeer. Must comply withRFC1035.",
                },
              },
              additionalProperties: true,
            },
            description: "Keys used for MD5 authentication.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        nats: {
          name: "Nats",
          description: "A list of NAT services created in this router.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                autoNetworkTier: {
                  type: "string",
                  enum: [
                    "UNDEFINED_AUTO_NETWORK_TIER",
                    "FIXED_STANDARD",
                    "PREMIUM",
                    "STANDARD",
                    "STANDARD_OVERRIDES_FIXED_STANDARD",
                  ],
                  description:
                    "The network tier to use when automatically reserving NAT IP addresses. Must be one of: PREMIUM, STANDARD. If not specified, then the current project-level default tier is used. Check the AutoNetworkTier enum for the list of possible values.",
                },
                drainNatIps: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of URLs of the IP resources to be drained. These IPs must be valid static external IPs that have been assigned to the NAT. These IPs should be used for updating/patching a NAT only.",
                },
                enableDynamicPortAllocation: {
                  type: "boolean",
                  description:
                    "Enable Dynamic Port Allocation.   If not specified, it is disabled by default.   If set to true,     - Dynamic Port Allocation will be enabled on this NAT    config.    - enableEndpointIndependentMapping cannot be set to true.    - If minPorts is set, minPortsPerVm must be set to a    power of two greater than or equal to 32. If minPortsPerVm is not set, a    minimum of 32 ports will be allocated to a VM from this NAT    config.",
                },
                enableEndpointIndependentMapping: {
                  type: "boolean",
                },
                endpointTypes: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "UNDEFINED_ENDPOINT_TYPES",
                      "ENDPOINT_TYPE_MANAGED_PROXY_LB",
                      "ENDPOINT_TYPE_SWG",
                      "ENDPOINT_TYPE_VM",
                    ],
                  },
                  description:
                    "List of NAT-ted endpoint types supported by the Nat Gateway. If the list is empty, then it will be equivalent to include ENDPOINT_TYPE_VM Check the EndpointTypes enum for the list of possible values.",
                },
                icmpIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for ICMP connections. Defaults to 30s if not set.",
                },
                logConfig: {
                  type: "object",
                  properties: {
                    enable: {
                      type: "boolean",
                      description:
                        "Indicates whether or not to export logs. This is false by default.",
                    },
                    filter: {
                      type: "string",
                      enum: [
                        "UNDEFINED_FILTER",
                        "ALL",
                        "ERRORS_ONLY",
                        "TRANSLATIONS_ONLY",
                      ],
                      description:
                        "Specify the desired filtering of logs on this NAT. If unspecified, logs are exported for all connections handled by this NAT. This option can take one of the following values:     - ERRORS_ONLY: Export logs only for connection failures.    - TRANSLATIONS_ONLY: Export logs only for successful    connections.    - ALL: Export logs for all connections, successful and    unsuccessful. Check the Filter enum for the list of possible values.",
                    },
                  },
                  description: "Configuration of logging on a NAT.",
                  additionalProperties: true,
                },
                maxPortsPerVm: {
                  type: "integer",
                  description:
                    "Maximum number of ports allocated to a VM from this NAT config when Dynamic Port Allocation is enabled.   If Dynamic Port Allocation is not enabled, this field has no effect.   If Dynamic Port Allocation is enabled, and this field is set, it must be set to a power of two greater than minPortsPerVm, or 64 if minPortsPerVm is not set.   If Dynamic Port Allocation is enabled and this field is not set, a maximum of 65536 ports will be allocated to a VM from this NAT config.",
                },
                minPortsPerVm: {
                  type: "integer",
                  description:
                    "Minimum number of ports allocated to a VM from this NAT config. If not set, a default number of ports is allocated to a VM. This is rounded up to the nearest power of 2. For example, if the value of this field is 50, at least 64 ports are allocated to a VM.",
                },
                name: {
                  type: "string",
                  description:
                    "Unique name of this Nat service. The name must be 1-63 characters long and comply withRFC1035.",
                },
                nat64Subnetworks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "URL for the subnetwork resource that will use NAT64.",
                      },
                    },
                    description: "Specifies a subnetwork to enable NAT64.",
                    additionalProperties: true,
                  },
                  description:
                    "List of Subnetwork resources whose traffic should be translated by NAT64 Gateway. It is used only when LIST_OF_IPV6_SUBNETWORKS is selected for the SubnetworkIpRangeToNat64Option above.",
                },
                natIpAllocateOption: {
                  type: "string",
                  enum: [
                    "UNDEFINED_NAT_IP_ALLOCATE_OPTION",
                    "AUTO_ONLY",
                    "MANUAL_ONLY",
                  ],
                  description:
                    "Specify the NatIpAllocateOption, which can take one of the following values:     - MANUAL_ONLY: Uses only Nat IP addresses provided by    customers. When there are not enough specified Nat IPs, the Nat service    fails for new VMs.    - AUTO_ONLY: Nat IPs are allocated by Google Cloud Platform; customers    can't specify any Nat IPs. When choosing AUTO_ONLY, then nat_ip should    be empty. Check the NatIpAllocateOption enum for the list of possible values.",
                },
                natIps: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of URLs of the IP resources used for this Nat service. These IP addresses must be valid static external IP addresses assigned to the project.",
                },
                rules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      action: {
                        type: "object",
                        properties: {
                          sourceNatActiveIps: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the IP resources used for this NAT rule. These IP addresses must be valid static external IP addresses assigned to the project. This field is used for public NAT.",
                          },
                          sourceNatActiveRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the subnetworks used as source ranges for this NAT Rule. These subnetworks must have purpose set to PRIVATE_NAT. This field is used for private NAT.",
                          },
                          sourceNatDrainIps: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the IP resources to be drained. These IPs must be valid static external IPs that have been assigned to the NAT. These IPs should be used for updating/patching a NAT rule only. This field is used for public NAT.",
                          },
                          sourceNatDrainRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of subnetworks representing source ranges to be drained. This is only supported on patch/update, and these subnetworks must have previously been used as active ranges in this NAT Rule. This field is used for private NAT.",
                          },
                        },
                        additionalProperties: true,
                        description:
                          "The action to be enforced for traffic that matches this rule.",
                      },
                      description: {
                        type: "string",
                        description: "An optional description of this rule.",
                      },
                      match: {
                        type: "string",
                        description:
                          "CEL expression that specifies the match condition that egress traffic from a VM is evaluated against. If it evaluates to true, the corresponding `action` is enforced.  The following examples are valid match expressions for public NAT:  `inIpRange(destination.ip, '1.1.0.0/16') || inIpRange(destination.ip,      '2.2.0.0/16')`  `destination.ip == '1.1.0.1' || destination.ip == '8.8.8.8'`  The following example is a valid match expression for private NAT:  `nexthop.hub == '//networkconnectivity.googleapis.com/projects/my-project/locations/global/hubs/hub-1'`",
                      },
                      ruleNumber: {
                        type: "integer",
                        description:
                          "An integer uniquely identifying a rule in the list. The rule number must be a positive value between 0 and 65000, and must be unique among rules within a NAT.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description: "A list of rules associated with this NAT.",
                },
                sourceSubnetworkIpRangesToNat: {
                  type: "string",
                  enum: [
                    "UNDEFINED_SOURCE_SUBNETWORK_IP_RANGES_TO_NAT",
                    "ALL_SUBNETWORKS_ALL_IP_RANGES",
                    "ALL_SUBNETWORKS_ALL_PRIMARY_IP_RANGES",
                    "LIST_OF_SUBNETWORKS",
                  ],
                  description:
                    "Specify the Nat option, which can take one of the following values:     - ALL_SUBNETWORKS_ALL_IP_RANGES: All of the IP ranges in every    Subnetwork are allowed to Nat.    - ALL_SUBNETWORKS_ALL_PRIMARY_IP_RANGES: All of the primary IP ranges    in every Subnetwork are allowed to Nat.    - LIST_OF_SUBNETWORKS: A list of Subnetworks are allowed to Nat    (specified in the field subnetwork below)   The default is SUBNETWORK_IP_RANGE_TO_NAT_OPTION_UNSPECIFIED. Note that if this field contains ALL_SUBNETWORKS_ALL_IP_RANGES then there should not be any other Router.Nat section in any Router for this network in this region. Check the SourceSubnetworkIpRangesToNat enum for the list of possible values.",
                },
                sourceSubnetworkIpRangesToNat64: {
                  type: "string",
                  enum: [
                    "UNDEFINED_SOURCE_SUBNETWORK_IP_RANGES_TO_NAT64",
                    "ALL_IPV6_SUBNETWORKS",
                    "LIST_OF_IPV6_SUBNETWORKS",
                  ],
                  description:
                    "Specify the Nat option for NAT64, which can take one of the following values:     - ALL_IPV6_SUBNETWORKS: All of the IP ranges in    every Subnetwork are allowed to Nat.    - LIST_OF_IPV6_SUBNETWORKS: A list of Subnetworks are allowed to Nat    (specified in the field nat64_subnetwork below)   The default is NAT64_OPTION_UNSPECIFIED. Note that if this field contains NAT64_ALL_V6_SUBNETWORKS no other Router.Nat section in this region can also enable NAT64 for any Subnetworks in this network. Other Router.Nat sections can still be present to enable NAT44 only. Check the SourceSubnetworkIpRangesToNat64 enum for the list of possible values.",
                },
                subnetworks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "URL for the subnetwork resource that will use NAT.",
                      },
                      secondaryIpRangeNames: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'A list of the secondary ranges of the Subnetwork that are allowed to use NAT. This can be populated only if "LIST_OF_SECONDARY_IP_RANGES" is one of the values in source_ip_ranges_to_nat.',
                      },
                      sourceIpRangesToNat: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "UNDEFINED_SOURCE_IP_RANGES_TO_NAT",
                            "ALL_IP_RANGES",
                            "LIST_OF_SECONDARY_IP_RANGES",
                            "PRIMARY_IP_RANGE",
                          ],
                        },
                        description:
                          'Specify the options for NAT ranges in the Subnetwork. All options of a single value are valid except NAT_IP_RANGE_OPTION_UNSPECIFIED. The only valid option with multiple values is: ["PRIMARY_IP_RANGE", "LIST_OF_SECONDARY_IP_RANGES"] Default: [ALL_IP_RANGES] Check the SourceIpRangesToNat enum for the list of possible values.',
                      },
                    },
                    description:
                      "Defines the IP ranges that want to use NAT for a subnetwork.",
                    additionalProperties: true,
                  },
                  description:
                    "A list of Subnetwork resources whose traffic should be translated by NAT Gateway. It is used only when LIST_OF_SUBNETWORKS is selected for the SubnetworkIpRangeToNatOption above.",
                },
                tcpEstablishedIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP established connections. Defaults to 1200s if not set.",
                },
                tcpTimeWaitTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP connections that are in TIME_WAIT state. Defaults to 120s if not set.",
                },
                tcpTransitoryIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP transitory connections. Defaults to 30s if not set.",
                },
                type: {
                  type: "string",
                  enum: ["UNDEFINED_TYPE", "PRIVATE", "PUBLIC"],
                  description:
                    "Indicates whether this NAT is used for public or private IP translation. If unspecified, it defaults to PUBLIC. Check the Type enum for the list of possible values.",
                },
                udpIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for UDP connections. Defaults to 30s if not set.",
                },
              },
              description:
                "Represents a Nat resource. It enables the VMs within the specified subnetworks to access Internet without external IP addresses. It specifies a list of subnetworks (and the ranges within) that want to use NAT. Customers can also provide the external IPs that would be used for NAT. GCP would auto-allocate ephemeral IPs if no external IPs are provided.",
              additionalProperties: true,
            },
            description: "A list of NAT services created in this router.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description: "URI of the network to which this router belongs.",
          type: {
            type: "string",
            description: "URI of the network to which this router belongs.",
          },
          required: false,
        },
        params: {
          name: "Params",
          description:
            "Input only. [Input Only] Additional params passed with the request, but not persisted as part of resource payload.",
          type: {
            type: "object",
            properties: {
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Tag keys/values directly bound to this resource. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid. * Inconsistent format is not supported. For instance:   {"tagKeys/333" : "tagValues/444", "123/env" : "prod"} is invalid.',
              },
            },
            description: "Additional router parameters.",
            additionalProperties: true,
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
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.bgp !== undefined)
          body.bgp = input.event.inputConfig.bgp;
        if (input.event.inputConfig.bgpPeers !== undefined)
          body.bgpPeers = input.event.inputConfig.bgpPeers;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.encryptedInterconnectRouter !== undefined)
          body.encryptedInterconnectRouter =
            input.event.inputConfig.encryptedInterconnectRouter;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.interfaces !== undefined)
          body.interfaces = input.event.inputConfig.interfaces;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.md5AuthenticationKeys !== undefined)
          body.md5AuthenticationKeys =
            input.event.inputConfig.md5AuthenticationKeys;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.nats !== undefined)
          body.nats = input.event.inputConfig.nats;
        if (input.event.inputConfig.network !== undefined)
          body.network = input.event.inputConfig.network;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/routers",
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

export default routersInsert;
