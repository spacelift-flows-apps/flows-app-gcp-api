import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const preview: AppBlock = {
  name: "Routers - Preview",
  description: `Preview fields auto-generated during router create andupdate operations. Calling this method does NOT create or update the router.`,
  category: "Routers",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description:
            "[Output Only] URI of the region where the router resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          type: {
            type: "string",
            description:
              "[Output Only] URI of the region where the router resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          required: false,
        },
        router: {
          name: "Router",
          description: "Name of the Router resource to query.",
          type: {
            type: "string",
          },
          required: true,
        },
        bgp: {
          name: "Bgp",
          description: "BGP information specific to this router.",
          type: {
            type: "object",
            properties: {
              advertise_mode: {
                type: "string",
                description:
                  "User-specified flag to indicate which mode to use for advertisement. The options are DEFAULT or CUSTOM. Check the AdvertiseMode enum for the list of possible values.",
              },
              advertised_groups: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "User-specified list of prefix groups to advertise in custom mode. This field can only be populated if advertise_mode is CUSTOM and is advertised to all peers of the router. These groups will be advertised in addition to any specified prefixes. Leave this field blank to advertise no custom groups. Check the AdvertisedGroups enum for the list of possible values.",
              },
              advertised_ip_ranges: {
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
              identifier_range: {
                type: "string",
                description:
                  'Explicitly specifies a range of valid BGP Identifiers for this Router. It is provided as a link-local IPv4 range (from 169.254.0.0/16), of size at least /30, even if the BGP sessions are over IPv6. It must not overlap with any IPv4 BGP session ranges.   Other vendors commonly call this "router ID".',
              },
              keepalive_interval: {
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
        bgp_peers: {
          name: "Bgp Peers",
          description:
            "BGP information that must be configured into the routing stack to establish BGP peering. This information must specify the peer ASN and either the interface name, IP address, or peer IP address. Please refer toRFC4273.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                advertise_mode: {
                  type: "string",
                  description:
                    "User-specified flag to indicate which mode to use for advertisement. Check the AdvertiseMode enum for the list of possible values.",
                },
                advertised_groups: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    'User-specified list of prefix groups to advertise in custom mode, which currently supports the following option:     - ALL_SUBNETS: Advertises all of the router\'s own VPC subnets. This    excludes any routes learned for subnets that use    VPC Network Peering.   Note that this field can only be populated if advertise_mode is CUSTOM and overrides the list defined for the router (in the "bgp" message). These groups are advertised in addition to any specified prefixes. Leave this field blank to advertise no custom groups. Check the AdvertisedGroups enum for the list of possible values.',
                },
                advertised_ip_ranges: {
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
                advertised_route_priority: {
                  type: "integer",
                  description:
                    "The priority of routes advertised to this BGP peer. Where there is more than one matching route of maximum length, the routes with the lowest priority value win.",
                },
                bfd: {
                  type: "object",
                  properties: {
                    min_receive_interval: {
                      type: "integer",
                      description:
                        "The minimum interval, in milliseconds, between BFD control packets received from the peer router. The actual value is negotiated between the two routers and is equal to the greater of this value and the transmit interval of the other router.   If set, this value must be between 1000 and 30000.   The default is 1000.",
                    },
                    min_transmit_interval: {
                      type: "integer",
                      description:
                        "The minimum interval, in milliseconds, between BFD control packets transmitted to the peer router. The actual value is negotiated between the two routers and is equal to the greater of this value and the corresponding receive interval of the other router.   If set, this value must be between 1000 and 30000.   The default is 1000.",
                    },
                    multiplier: {
                      type: "integer",
                      description:
                        "The number of consecutive BFD packets that must be missed before BFD declares that a peer is unavailable.   If set, the value must be a value between 5 and 16.   The default is 5.",
                    },
                    session_initialization_mode: {
                      type: "string",
                      description:
                        "The BFD session initialization mode for this BGP peer.   If set to ACTIVE, the Cloud Router will initiate the BFD session for this BGP peer. If set to PASSIVE, the Cloud Router will wait for the peer router to initiate the BFD session for this BGP peer. If set to DISABLED, BFD is disabled for this BGP peer. The default is DISABLED. Check the SessionInitializationMode enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                  description: "BFD configuration for the BGP peering.",
                },
                custom_learned_ip_ranges: {
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
                custom_learned_route_priority: {
                  type: "integer",
                  description:
                    "The user-defined custom learned route priority for a BGP session. This value is applied to all custom learned route ranges for the session. You can choose a value from `0` to `65335`. If you don't provide a value, Google Cloud assigns a priority of `100` to the ranges.",
                },
                enable: {
                  type: "string",
                  description:
                    "The status of the BGP peer connection.   If set to FALSE, any active session with the peer is terminated and all associated routing information is removed. If set to TRUE, the peer connection can be established with routing information. The default is TRUE. Check the Enable enum for the list of possible values.",
                },
                enable_ipv4: {
                  type: "boolean",
                  description:
                    "Enable IPv4 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 4.",
                },
                enable_ipv6: {
                  type: "boolean",
                  description:
                    "Enable IPv6 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 6.",
                },
                export_policies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of export policies applied to this peer, in the order they must be evaluated. The name must correspond to an existing policy that has ROUTE_POLICY_TYPE_EXPORT type.",
                },
                import_policies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of import policies applied to this peer, in the order they must be evaluated. The name must correspond to an existing policy that has ROUTE_POLICY_TYPE_IMPORT type.",
                },
                interface_name: {
                  type: "string",
                  description:
                    "Name of the interface the BGP peer is associated with.",
                },
                ip_address: {
                  type: "string",
                  description:
                    "IP address of the interface inside Google Cloud Platform.",
                },
                ipv4_nexthop_address: {
                  type: "string",
                  description:
                    "IPv4 address of the interface inside Google Cloud Platform.",
                },
                ipv6_nexthop_address: {
                  type: "string",
                  description:
                    "IPv6 address of the interface inside Google Cloud Platform.",
                },
                management_type: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The resource that configures and manages this BGP peer.     -  MANAGED_BY_USER is the default value and can be managed by you    or other users    - MANAGED_BY_ATTACHMENT is a BGP peer that is configured and managed    by Cloud Interconnect, specifically by an InterconnectAttachment of type    PARTNER. Google automatically creates, updates, and deletes this type of    BGP peer when the PARTNER InterconnectAttachment is created, updated,    or deleted. Check the ManagementType enum for the list of possible values.",
                },
                md5_authentication_key_name: {
                  type: "string",
                  description:
                    "Present if MD5 authentication is enabled for the peering. Must be the name of one of the entries in the Router.md5_authentication_keys. The field must comply with RFC1035.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this BGP peer. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                peer_asn: {
                  type: "integer",
                  description:
                    "Peer BGP Autonomous System Number (ASN). Each BGP interface may use a different value.",
                },
                peer_ip_address: {
                  type: "string",
                  description:
                    "IP address of the BGP interface outside Google Cloud Platform.",
                },
                peer_ipv4_nexthop_address: {
                  type: "string",
                  description:
                    "IPv4 address of the BGP interface outside Google Cloud Platform.",
                },
                peer_ipv6_nexthop_address: {
                  type: "string",
                  description:
                    "IPv6 address of the BGP interface outside Google Cloud Platform.",
                },
                router_appliance_instance: {
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
        creation_timestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
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
        encrypted_interconnect_router: {
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
        id: {
          name: "Id",
          description:
            "[Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
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
                ip_range: {
                  type: "string",
                  description:
                    "IP address and range of the interface.     - For Internet Protocol version 4 (IPv4), the IP range must be in theRFC3927 link-local IP address space. The value must    be a CIDR-formatted string, for example, 169.254.0.1/30.    Note: Do not truncate the IP address, as it represents the IP address of    the interface.    - For Internet Protocol version 6 (IPv6), the value    must be a unique local address (ULA) range from fdff:1::/64    with a mask length of 126 or less. This value should be a CIDR-formatted    string, for example, fdff:1::1/112. Within the router's    VPC, this IPv6 prefix will be reserved exclusively for this connection    and cannot be used for any other purpose.",
                },
                ip_version: {
                  type: "string",
                  description:
                    "IP version of this interface. Check the IpVersion enum for the list of possible values.",
                },
                linked_interconnect_attachment: {
                  type: "string",
                  description:
                    "URI of the linked Interconnect attachment. It must be in the same region as the router. Each interface can have one linked resource, which can be a VPN tunnel, an Interconnect attachment, or a subnetwork.",
                },
                linked_vpn_tunnel: {
                  type: "string",
                  description:
                    "URI of the linked VPN tunnel, which must be in the same region as the router. Each interface can have one linked resource, which can be a VPN tunnel, an Interconnect attachment, or a subnetwork.",
                },
                management_type: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The resource that configures and manages this interface.     - MANAGED_BY_USER is the default value and can be managed directly    by users.    - MANAGED_BY_ATTACHMENT is an interface that is configured and    managed by Cloud Interconnect, specifically, by an InterconnectAttachment    of type PARTNER. Google automatically creates, updates, and deletes    this type of interface when the PARTNER InterconnectAttachment is    created, updated, or deleted. Check the ManagementType enum for the list of possible values.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this interface entry. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                private_ip_address: {
                  type: "string",
                  description:
                    "The regional private internal IP address that is used to establish BGP sessions to a VM instance acting as a third-party Router Appliance, such as a Next Gen Firewall, a Virtual Router, or an SD-WAN VM.",
                },
                redundant_interface: {
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
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of resource. Always compute#router for routers.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#router for routers.",
          },
          required: false,
        },
        md5_authentication_keys: {
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
                auto_network_tier: {
                  type: "string",
                  description:
                    "The network tier to use when automatically reserving NAT IP addresses. Must be one of: PREMIUM, STANDARD. If not specified, then the current project-level default tier is used. Check the AutoNetworkTier enum for the list of possible values.",
                },
                drain_nat_ips: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of URLs of the IP resources to be drained. These IPs must be valid static external IPs that have been assigned to the NAT. These IPs should be used for updating/patching a NAT only.",
                },
                enable_dynamic_port_allocation: {
                  type: "boolean",
                  description:
                    "Enable Dynamic Port Allocation.   If not specified, it is disabled by default.   If set to true,     - Dynamic Port Allocation will be enabled on this NAT    config.    - enableEndpointIndependentMapping cannot be set to true.    - If minPorts is set, minPortsPerVm must be set to a    power of two greater than or equal to 32. If minPortsPerVm is not set, a    minimum of 32 ports will be allocated to a VM from this NAT    config.",
                },
                enable_endpoint_independent_mapping: {
                  type: "boolean",
                },
                endpoint_types: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of NAT-ted endpoint types supported by the Nat Gateway. If the list is empty, then it will be equivalent to include ENDPOINT_TYPE_VM Check the EndpointTypes enum for the list of possible values.",
                },
                icmp_idle_timeout_sec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for ICMP connections. Defaults to 30s if not set.",
                },
                log_config: {
                  type: "object",
                  properties: {
                    enable: {
                      type: "boolean",
                      description:
                        "Indicates whether or not to export logs. This is false by default.",
                    },
                    filter: {
                      type: "string",
                      description:
                        "Specify the desired filtering of logs on this NAT. If unspecified, logs are exported for all connections handled by this NAT. This option can take one of the following values:     - ERRORS_ONLY: Export logs only for connection failures.    - TRANSLATIONS_ONLY: Export logs only for successful    connections.    - ALL: Export logs for all connections, successful and    unsuccessful. Check the Filter enum for the list of possible values.",
                    },
                  },
                  description: "Configuration of logging on a NAT.",
                  additionalProperties: true,
                },
                max_ports_per_vm: {
                  type: "integer",
                  description:
                    "Maximum number of ports allocated to a VM from this NAT config when Dynamic Port Allocation is enabled.   If Dynamic Port Allocation is not enabled, this field has no effect.   If Dynamic Port Allocation is enabled, and this field is set, it must be set to a power of two greater than minPortsPerVm, or 64 if minPortsPerVm is not set.   If Dynamic Port Allocation is enabled and this field is not set, a maximum of 65536 ports will be allocated to a VM from this NAT config.",
                },
                min_ports_per_vm: {
                  type: "integer",
                  description:
                    "Minimum number of ports allocated to a VM from this NAT config. If not set, a default number of ports is allocated to a VM. This is rounded up to the nearest power of 2. For example, if the value of this field is 50, at least 64 ports are allocated to a VM.",
                },
                name: {
                  type: "string",
                  description:
                    "Unique name of this Nat service. The name must be 1-63 characters long and comply withRFC1035.",
                },
                nat64_subnetworks: {
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
                nat_ip_allocate_option: {
                  type: "string",
                  description:
                    "Specify the NatIpAllocateOption, which can take one of the following values:     - MANUAL_ONLY: Uses only Nat IP addresses provided by    customers. When there are not enough specified Nat IPs, the Nat service    fails for new VMs.    - AUTO_ONLY: Nat IPs are allocated by Google Cloud Platform; customers    can't specify any Nat IPs. When choosing AUTO_ONLY, then nat_ip should    be empty. Check the NatIpAllocateOption enum for the list of possible values.",
                },
                nat_ips: {
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
                          source_nat_active_ips: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the IP resources used for this NAT rule. These IP addresses must be valid static external IP addresses assigned to the project. This field is used for public NAT.",
                          },
                          source_nat_active_ranges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the subnetworks used as source ranges for this NAT Rule. These subnetworks must have purpose set to PRIVATE_NAT. This field is used for private NAT.",
                          },
                          source_nat_drain_ips: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the IP resources to be drained. These IPs must be valid static external IPs that have been assigned to the NAT. These IPs should be used for updating/patching a NAT rule only. This field is used for public NAT.",
                          },
                          source_nat_drain_ranges: {
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
                      rule_number: {
                        type: "integer",
                        description:
                          "An integer uniquely identifying a rule in the list. The rule number must be a positive value between 0 and 65000, and must be unique among rules within a NAT.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description: "A list of rules associated with this NAT.",
                },
                source_subnetwork_ip_ranges_to_nat: {
                  type: "string",
                  description:
                    "Specify the Nat option, which can take one of the following values:     - ALL_SUBNETWORKS_ALL_IP_RANGES: All of the IP ranges in every    Subnetwork are allowed to Nat.    - ALL_SUBNETWORKS_ALL_PRIMARY_IP_RANGES: All of the primary IP ranges    in every Subnetwork are allowed to Nat.    - LIST_OF_SUBNETWORKS: A list of Subnetworks are allowed to Nat    (specified in the field subnetwork below)   The default is SUBNETWORK_IP_RANGE_TO_NAT_OPTION_UNSPECIFIED. Note that if this field contains ALL_SUBNETWORKS_ALL_IP_RANGES then there should not be any other Router.Nat section in any Router for this network in this region. Check the SourceSubnetworkIpRangesToNat enum for the list of possible values.",
                },
                source_subnetwork_ip_ranges_to_nat64: {
                  type: "string",
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
                      secondary_ip_range_names: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'A list of the secondary ranges of the Subnetwork that are allowed to use NAT. This can be populated only if "LIST_OF_SECONDARY_IP_RANGES" is one of the values in source_ip_ranges_to_nat.',
                      },
                      source_ip_ranges_to_nat: {
                        type: "array",
                        items: {
                          type: "string",
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
                tcp_established_idle_timeout_sec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP established connections. Defaults to 1200s if not set.",
                },
                tcp_time_wait_timeout_sec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP connections that are in TIME_WAIT state. Defaults to 120s if not set.",
                },
                tcp_transitory_idle_timeout_sec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP transitory connections. Defaults to 30s if not set.",
                },
                type: {
                  type: "string",
                  description:
                    "Indicates whether this NAT is used for public or private IP translation. If unspecified, it defaults to PUBLIC. Check the Type enum for the list of possible values.",
                },
                udp_idle_timeout_sec: {
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
              resource_manager_tags: {
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
        self_link: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.router !== undefined)
          pathParams["router"] = String(input.event.inputConfig.router);

        const body: Record<string, any> = {};
        if (input.event.inputConfig.bgp !== undefined)
          body.bgp = input.event.inputConfig.bgp;
        if (input.event.inputConfig.bgp_peers !== undefined)
          body.bgp_peers = input.event.inputConfig.bgp_peers;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.encrypted_interconnect_router !== undefined)
          body.encrypted_interconnect_router =
            input.event.inputConfig.encrypted_interconnect_router;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.interfaces !== undefined)
          body.interfaces = input.event.inputConfig.interfaces;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.md5_authentication_keys !== undefined)
          body.md5_authentication_keys =
            input.event.inputConfig.md5_authentication_keys;
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
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/routers/{router}/preview",
          pathParams,
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
          resource: {
            type: "object",
            properties: {
              bgp: {
                type: "object",
                properties: {
                  advertise_mode: {
                    type: "string",
                    description:
                      "User-specified flag to indicate which mode to use for advertisement. The options are DEFAULT or CUSTOM. Check the AdvertiseMode enum for the list of possible values.",
                  },
                  advertised_groups: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "User-specified list of prefix groups to advertise in custom mode. This field can only be populated if advertise_mode is CUSTOM and is advertised to all peers of the router. These groups will be advertised in addition to any specified prefixes. Leave this field blank to advertise no custom groups. Check the AdvertisedGroups enum for the list of possible values.",
                  },
                  advertised_ip_ranges: {
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
                  identifier_range: {
                    type: "string",
                    description:
                      'Explicitly specifies a range of valid BGP Identifiers for this Router. It is provided as a link-local IPv4 range (from 169.254.0.0/16), of size at least /30, even if the BGP sessions are over IPv6. It must not overlap with any IPv4 BGP session ranges.   Other vendors commonly call this "router ID".',
                  },
                  keepalive_interval: {
                    type: "integer",
                    description:
                      "The interval in seconds between BGP keepalive messages that are sent to the peer.   Hold time is three times the interval at which keepalive messages are sent, and the hold time is the maximum number of seconds allowed to elapse between successive keepalive messages that BGP receives from a peer.   BGP will use the smaller of either the local hold time value or the peer's hold time value as the hold time for the BGP connection between the two peers.   If set, this value must be between 20 and 60. The default is 20.",
                  },
                },
                additionalProperties: true,
                description: "BGP information specific to this router.",
              },
              bgp_peers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    advertise_mode: {
                      type: "string",
                      description:
                        "User-specified flag to indicate which mode to use for advertisement. Check the AdvertiseMode enum for the list of possible values.",
                    },
                    advertised_groups: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'User-specified list of prefix groups to advertise in custom mode, which currently supports the following option:     - ALL_SUBNETS: Advertises all of the router\'s own VPC subnets. This    excludes any routes learned for subnets that use    VPC Network Peering.   Note that this field can only be populated if advertise_mode is CUSTOM and overrides the list defined for the router (in the "bgp" message). These groups are advertised in addition to any specified prefixes. Leave this field blank to advertise no custom groups. Check the AdvertisedGroups enum for the list of possible values.',
                    },
                    advertised_ip_ranges: {
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
                    advertised_route_priority: {
                      type: "integer",
                      description:
                        "The priority of routes advertised to this BGP peer. Where there is more than one matching route of maximum length, the routes with the lowest priority value win.",
                    },
                    bfd: {
                      type: "object",
                      properties: {
                        min_receive_interval: {
                          type: "integer",
                          description:
                            "The minimum interval, in milliseconds, between BFD control packets received from the peer router. The actual value is negotiated between the two routers and is equal to the greater of this value and the transmit interval of the other router.   If set, this value must be between 1000 and 30000.   The default is 1000.",
                        },
                        min_transmit_interval: {
                          type: "integer",
                          description:
                            "The minimum interval, in milliseconds, between BFD control packets transmitted to the peer router. The actual value is negotiated between the two routers and is equal to the greater of this value and the corresponding receive interval of the other router.   If set, this value must be between 1000 and 30000.   The default is 1000.",
                        },
                        multiplier: {
                          type: "integer",
                          description:
                            "The number of consecutive BFD packets that must be missed before BFD declares that a peer is unavailable.   If set, the value must be a value between 5 and 16.   The default is 5.",
                        },
                        session_initialization_mode: {
                          type: "string",
                          description:
                            "The BFD session initialization mode for this BGP peer.   If set to ACTIVE, the Cloud Router will initiate the BFD session for this BGP peer. If set to PASSIVE, the Cloud Router will wait for the peer router to initiate the BFD session for this BGP peer. If set to DISABLED, BFD is disabled for this BGP peer. The default is DISABLED. Check the SessionInitializationMode enum for the list of possible values.",
                        },
                      },
                      additionalProperties: true,
                      description: "BFD configuration for the BGP peering.",
                    },
                    custom_learned_ip_ranges: {
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
                    custom_learned_route_priority: {
                      type: "integer",
                      description:
                        "The user-defined custom learned route priority for a BGP session. This value is applied to all custom learned route ranges for the session. You can choose a value from `0` to `65335`. If you don't provide a value, Google Cloud assigns a priority of `100` to the ranges.",
                    },
                    enable: {
                      type: "string",
                      description:
                        "The status of the BGP peer connection.   If set to FALSE, any active session with the peer is terminated and all associated routing information is removed. If set to TRUE, the peer connection can be established with routing information. The default is TRUE. Check the Enable enum for the list of possible values.",
                    },
                    enable_ipv4: {
                      type: "boolean",
                      description:
                        "Enable IPv4 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 4.",
                    },
                    enable_ipv6: {
                      type: "boolean",
                      description:
                        "Enable IPv6 traffic over BGP Peer. It is enabled by default if the peerIpAddress is version 6.",
                    },
                    export_policies: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "List of export policies applied to this peer, in the order they must be evaluated. The name must correspond to an existing policy that has ROUTE_POLICY_TYPE_EXPORT type.",
                    },
                    import_policies: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "List of import policies applied to this peer, in the order they must be evaluated. The name must correspond to an existing policy that has ROUTE_POLICY_TYPE_IMPORT type.",
                    },
                    interface_name: {
                      type: "string",
                      description:
                        "Name of the interface the BGP peer is associated with.",
                    },
                    ip_address: {
                      type: "string",
                      description:
                        "IP address of the interface inside Google Cloud Platform.",
                    },
                    ipv4_nexthop_address: {
                      type: "string",
                      description:
                        "IPv4 address of the interface inside Google Cloud Platform.",
                    },
                    ipv6_nexthop_address: {
                      type: "string",
                      description:
                        "IPv6 address of the interface inside Google Cloud Platform.",
                    },
                    management_type: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The resource that configures and manages this BGP peer.     -  MANAGED_BY_USER is the default value and can be managed by you    or other users    - MANAGED_BY_ATTACHMENT is a BGP peer that is configured and managed    by Cloud Interconnect, specifically by an InterconnectAttachment of type    PARTNER. Google automatically creates, updates, and deletes this type of    BGP peer when the PARTNER InterconnectAttachment is created, updated,    or deleted. Check the ManagementType enum for the list of possible values.",
                    },
                    md5_authentication_key_name: {
                      type: "string",
                      description:
                        "Present if MD5 authentication is enabled for the peering. Must be the name of one of the entries in the Router.md5_authentication_keys. The field must comply with RFC1035.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Name of this BGP peer. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                    },
                    peer_asn: {
                      type: "integer",
                      description:
                        "Peer BGP Autonomous System Number (ASN). Each BGP interface may use a different value.",
                    },
                    peer_ip_address: {
                      type: "string",
                      description:
                        "IP address of the BGP interface outside Google Cloud Platform.",
                    },
                    peer_ipv4_nexthop_address: {
                      type: "string",
                      description:
                        "IPv4 address of the BGP interface outside Google Cloud Platform.",
                    },
                    peer_ipv6_nexthop_address: {
                      type: "string",
                      description:
                        "IPv6 address of the BGP interface outside Google Cloud Platform.",
                    },
                    router_appliance_instance: {
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
              creation_timestamp: {
                type: "string",
                description:
                  "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
              },
              description: {
                type: "string",
                description:
                  "An optional description of this resource. Provide this property when you create the resource.",
              },
              encrypted_interconnect_router: {
                type: "boolean",
                description:
                  "Indicates if a router is dedicated for use with encrypted VLAN attachments (interconnectAttachments).",
              },
              id: {
                type: "string",
                description: "64-bit integer as string",
              },
              interfaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ip_range: {
                      type: "string",
                      description:
                        "IP address and range of the interface.     - For Internet Protocol version 4 (IPv4), the IP range must be in theRFC3927 link-local IP address space. The value must    be a CIDR-formatted string, for example, 169.254.0.1/30.    Note: Do not truncate the IP address, as it represents the IP address of    the interface.    - For Internet Protocol version 6 (IPv6), the value    must be a unique local address (ULA) range from fdff:1::/64    with a mask length of 126 or less. This value should be a CIDR-formatted    string, for example, fdff:1::1/112. Within the router's    VPC, this IPv6 prefix will be reserved exclusively for this connection    and cannot be used for any other purpose.",
                    },
                    ip_version: {
                      type: "string",
                      description:
                        "IP version of this interface. Check the IpVersion enum for the list of possible values.",
                    },
                    linked_interconnect_attachment: {
                      type: "string",
                      description:
                        "URI of the linked Interconnect attachment. It must be in the same region as the router. Each interface can have one linked resource, which can be a VPN tunnel, an Interconnect attachment, or a subnetwork.",
                    },
                    linked_vpn_tunnel: {
                      type: "string",
                      description:
                        "URI of the linked VPN tunnel, which must be in the same region as the router. Each interface can have one linked resource, which can be a VPN tunnel, an Interconnect attachment, or a subnetwork.",
                    },
                    management_type: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The resource that configures and manages this interface.     - MANAGED_BY_USER is the default value and can be managed directly    by users.    - MANAGED_BY_ATTACHMENT is an interface that is configured and    managed by Cloud Interconnect, specifically, by an InterconnectAttachment    of type PARTNER. Google automatically creates, updates, and deletes    this type of interface when the PARTNER InterconnectAttachment is    created, updated, or deleted. Check the ManagementType enum for the list of possible values.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Name of this interface entry. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                    },
                    private_ip_address: {
                      type: "string",
                      description:
                        "The regional private internal IP address that is used to establish BGP sessions to a VM instance acting as a third-party Router Appliance, such as a Next Gen Firewall, a Virtual Router, or an SD-WAN VM.",
                    },
                    redundant_interface: {
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
              kind: {
                type: "string",
                description:
                  "Output only. [Output Only] Type of resource. Always compute#router for routers.",
              },
              md5_authentication_keys: {
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
              name: {
                type: "string",
                description:
                  "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
              },
              nats: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    auto_network_tier: {
                      type: "string",
                      description:
                        "The network tier to use when automatically reserving NAT IP addresses. Must be one of: PREMIUM, STANDARD. If not specified, then the current project-level default tier is used. Check the AutoNetworkTier enum for the list of possible values.",
                    },
                    drain_nat_ips: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of URLs of the IP resources to be drained. These IPs must be valid static external IPs that have been assigned to the NAT. These IPs should be used for updating/patching a NAT only.",
                    },
                    enable_dynamic_port_allocation: {
                      type: "boolean",
                      description:
                        "Enable Dynamic Port Allocation.   If not specified, it is disabled by default.   If set to true,     - Dynamic Port Allocation will be enabled on this NAT    config.    - enableEndpointIndependentMapping cannot be set to true.    - If minPorts is set, minPortsPerVm must be set to a    power of two greater than or equal to 32. If minPortsPerVm is not set, a    minimum of 32 ports will be allocated to a VM from this NAT    config.",
                    },
                    enable_endpoint_independent_mapping: {
                      type: "boolean",
                    },
                    endpoint_types: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "List of NAT-ted endpoint types supported by the Nat Gateway. If the list is empty, then it will be equivalent to include ENDPOINT_TYPE_VM Check the EndpointTypes enum for the list of possible values.",
                    },
                    icmp_idle_timeout_sec: {
                      type: "integer",
                      description:
                        "Timeout (in seconds) for ICMP connections. Defaults to 30s if not set.",
                    },
                    log_config: {
                      type: "object",
                      properties: {
                        enable: {
                          type: "boolean",
                          description:
                            "Indicates whether or not to export logs. This is false by default.",
                        },
                        filter: {
                          type: "string",
                          description:
                            "Specify the desired filtering of logs on this NAT. If unspecified, logs are exported for all connections handled by this NAT. This option can take one of the following values:     - ERRORS_ONLY: Export logs only for connection failures.    - TRANSLATIONS_ONLY: Export logs only for successful    connections.    - ALL: Export logs for all connections, successful and    unsuccessful. Check the Filter enum for the list of possible values.",
                        },
                      },
                      description: "Configuration of logging on a NAT.",
                      additionalProperties: true,
                    },
                    max_ports_per_vm: {
                      type: "integer",
                      description:
                        "Maximum number of ports allocated to a VM from this NAT config when Dynamic Port Allocation is enabled.   If Dynamic Port Allocation is not enabled, this field has no effect.   If Dynamic Port Allocation is enabled, and this field is set, it must be set to a power of two greater than minPortsPerVm, or 64 if minPortsPerVm is not set.   If Dynamic Port Allocation is enabled and this field is not set, a maximum of 65536 ports will be allocated to a VM from this NAT config.",
                    },
                    min_ports_per_vm: {
                      type: "integer",
                      description:
                        "Minimum number of ports allocated to a VM from this NAT config. If not set, a default number of ports is allocated to a VM. This is rounded up to the nearest power of 2. For example, if the value of this field is 50, at least 64 ports are allocated to a VM.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Unique name of this Nat service. The name must be 1-63 characters long and comply withRFC1035.",
                    },
                    nat64_subnetworks: {
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
                    nat_ip_allocate_option: {
                      type: "string",
                      description:
                        "Specify the NatIpAllocateOption, which can take one of the following values:     - MANUAL_ONLY: Uses only Nat IP addresses provided by    customers. When there are not enough specified Nat IPs, the Nat service    fails for new VMs.    - AUTO_ONLY: Nat IPs are allocated by Google Cloud Platform; customers    can't specify any Nat IPs. When choosing AUTO_ONLY, then nat_ip should    be empty. Check the NatIpAllocateOption enum for the list of possible values.",
                    },
                    nat_ips: {
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
                              source_nat_active_ips: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "A list of URLs of the IP resources used for this NAT rule. These IP addresses must be valid static external IP addresses assigned to the project. This field is used for public NAT.",
                              },
                              source_nat_active_ranges: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "A list of URLs of the subnetworks used as source ranges for this NAT Rule. These subnetworks must have purpose set to PRIVATE_NAT. This field is used for private NAT.",
                              },
                              source_nat_drain_ips: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "A list of URLs of the IP resources to be drained. These IPs must be valid static external IPs that have been assigned to the NAT. These IPs should be used for updating/patching a NAT rule only. This field is used for public NAT.",
                              },
                              source_nat_drain_ranges: {
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
                            description:
                              "An optional description of this rule.",
                          },
                          match: {
                            type: "string",
                            description:
                              "CEL expression that specifies the match condition that egress traffic from a VM is evaluated against. If it evaluates to true, the corresponding `action` is enforced.  The following examples are valid match expressions for public NAT:  `inIpRange(destination.ip, '1.1.0.0/16') || inIpRange(destination.ip,      '2.2.0.0/16')`  `destination.ip == '1.1.0.1' || destination.ip == '8.8.8.8'`  The following example is a valid match expression for private NAT:  `nexthop.hub == '//networkconnectivity.googleapis.com/projects/my-project/locations/global/hubs/hub-1'`",
                          },
                          rule_number: {
                            type: "integer",
                            description:
                              "An integer uniquely identifying a rule in the list. The rule number must be a positive value between 0 and 65000, and must be unique among rules within a NAT.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "A list of rules associated with this NAT.",
                    },
                    source_subnetwork_ip_ranges_to_nat: {
                      type: "string",
                      description:
                        "Specify the Nat option, which can take one of the following values:     - ALL_SUBNETWORKS_ALL_IP_RANGES: All of the IP ranges in every    Subnetwork are allowed to Nat.    - ALL_SUBNETWORKS_ALL_PRIMARY_IP_RANGES: All of the primary IP ranges    in every Subnetwork are allowed to Nat.    - LIST_OF_SUBNETWORKS: A list of Subnetworks are allowed to Nat    (specified in the field subnetwork below)   The default is SUBNETWORK_IP_RANGE_TO_NAT_OPTION_UNSPECIFIED. Note that if this field contains ALL_SUBNETWORKS_ALL_IP_RANGES then there should not be any other Router.Nat section in any Router for this network in this region. Check the SourceSubnetworkIpRangesToNat enum for the list of possible values.",
                    },
                    source_subnetwork_ip_ranges_to_nat64: {
                      type: "string",
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
                          secondary_ip_range_names: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'A list of the secondary ranges of the Subnetwork that are allowed to use NAT. This can be populated only if "LIST_OF_SECONDARY_IP_RANGES" is one of the values in source_ip_ranges_to_nat.',
                          },
                          source_ip_ranges_to_nat: {
                            type: "array",
                            items: {
                              type: "string",
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
                    tcp_established_idle_timeout_sec: {
                      type: "integer",
                      description:
                        "Timeout (in seconds) for TCP established connections. Defaults to 1200s if not set.",
                    },
                    tcp_time_wait_timeout_sec: {
                      type: "integer",
                      description:
                        "Timeout (in seconds) for TCP connections that are in TIME_WAIT state. Defaults to 120s if not set.",
                    },
                    tcp_transitory_idle_timeout_sec: {
                      type: "integer",
                      description:
                        "Timeout (in seconds) for TCP transitory connections. Defaults to 30s if not set.",
                    },
                    type: {
                      type: "string",
                      description:
                        "Indicates whether this NAT is used for public or private IP translation. If unspecified, it defaults to PUBLIC. Check the Type enum for the list of possible values.",
                    },
                    udp_idle_timeout_sec: {
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
              network: {
                type: "string",
                description: "URI of the network to which this router belongs.",
              },
              params: {
                type: "object",
                properties: {
                  resource_manager_tags: {
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
              region: {
                type: "string",
                description:
                  "[Output Only] URI of the region where the router resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
              },
              self_link: {
                type: "string",
                description:
                  "[Output Only] Server-defined URL for the resource.",
              },
            },
            description:
              "Represents a Cloud Router resource.  For more information about Cloud Router, read theCloud Router overview.",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default preview;
