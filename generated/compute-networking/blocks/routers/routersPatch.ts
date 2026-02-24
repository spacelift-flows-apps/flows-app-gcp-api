import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const routersPatch: AppBlock = {
  name: "Routers - Patch",
  description: `Patches the specified Router resource with the data included in the request.`,
  category: "Routers",
  inputs: {
    default: {
      config: {
        router: {
          name: "Router",
          description: "Name of the Router resource to patch.",
          type: {
            type: "string",
          },
          required: true,
        },
        region: {
          name: "Region",
          description:
            "[Output Only] URI of the region where the router resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URI of the region where the router resides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          required: false,
        },
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
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
        encryptedInterconnectRouter: {
          name: "Encrypted Interconnect Router",
          description:
            "Indicates if a router is dedicated for use with encrypted VLAN attachments (interconnectAttachments).",
          type: {
            type: "boolean",
            description:
              "Indicates if a router is dedicated for use with encrypted VLAN\nattachments (interconnectAttachments).",
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
        nats: {
          name: "Nats",
          description: "A list of NAT services created in this router.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                natIpAllocateOption: {
                  type: "string",
                  enum: ["AUTO_ONLY", "MANUAL_ONLY"],
                  description:
                    "Specify the NatIpAllocateOption, which can take one of the following\nvalues: \n   \n   - MANUAL_ONLY: Uses only Nat IP addresses provided by\n   customers. When there are not enough specified Nat IPs, the Nat service\n   fails for new VMs.\n   - AUTO_ONLY: Nat IPs are allocated by Google Cloud Platform; customers\n   can't specify any Nat IPs. When choosing AUTO_ONLY, then nat_ip should\n   be empty.",
                },
                tcpTimeWaitTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP connections that are in TIME_WAIT state.\nDefaults to 120s if not set. (Format: int32)",
                },
                type: {
                  type: "string",
                  enum: ["PRIVATE", "PUBLIC"],
                  description:
                    "Indicates whether this NAT is used for public or private IP\ntranslation. If unspecified, it defaults to PUBLIC.",
                },
                autoNetworkTier: {
                  type: "string",
                  enum: [
                    "FIXED_STANDARD",
                    "PREMIUM",
                    "STANDARD",
                    "STANDARD_OVERRIDES_FIXED_STANDARD",
                  ],
                  description:
                    "The network tier to use when automatically reserving NAT IP addresses.\nMust be one of: PREMIUM, STANDARD.\nIf not specified, then the current \nproject-level default tier is used.",
                },
                tcpEstablishedIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP established connections. Defaults to 1200s\nif not set. (Format: int32)",
                },
                sourceSubnetworkIpRangesToNat64: {
                  type: "string",
                  enum: ["ALL_IPV6_SUBNETWORKS", "LIST_OF_IPV6_SUBNETWORKS"],
                  description:
                    "Specify the Nat option for NAT64, which can take one of the following\nvalues: \n   \n   - ALL_IPV6_SUBNETWORKS: All of the IP ranges in\n   every Subnetwork are allowed to Nat.\n   - LIST_OF_IPV6_SUBNETWORKS: A list of Subnetworks are allowed to Nat\n   (specified in the field nat64_subnetwork below)\n\n\nThe default is NAT64_OPTION_UNSPECIFIED.\nNote that if this field contains NAT64_ALL_V6_SUBNETWORKS no other\nRouter.Nat section in this region can also enable NAT64 for any\nSubnetworks in this network. Other Router.Nat sections can still be\npresent to enable NAT44 only.",
                },
                minPortsPerVm: {
                  type: "integer",
                  description:
                    "Minimum number of ports allocated to a VM from this NAT config. If not\nset, a default number of ports is allocated to a VM. This is rounded\nup to the nearest power of 2. For example, if the value of this field is\n50, at least 64 ports are allocated to a VM. (Format: int32)",
                },
                subnetworks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      secondaryIpRangeNames: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'A list of the secondary ranges of the Subnetwork that are allowed to\nuse NAT. This can be populated only if "LIST_OF_SECONDARY_IP_RANGES"\nis one of the values in source_ip_ranges_to_nat.',
                      },
                      name: {
                        type: "string",
                        description:
                          "URL for the subnetwork resource that will use NAT.",
                      },
                      sourceIpRangesToNat: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "ALL_IP_RANGES",
                            "LIST_OF_SECONDARY_IP_RANGES",
                            "PRIMARY_IP_RANGE",
                          ],
                        },
                        description:
                          'Specify the options for NAT ranges in the Subnetwork. All\noptions of a single value are valid except\nNAT_IP_RANGE_OPTION_UNSPECIFIED.\nThe only valid option with multiple values is: ["PRIMARY_IP_RANGE",\n"LIST_OF_SECONDARY_IP_RANGES"]\nDefault: [ALL_IP_RANGES]',
                      },
                    },
                    description:
                      "Defines the IP ranges that want to use NAT for a subnetwork.",
                    additionalProperties: true,
                  },
                  description:
                    "A list of Subnetwork resources whose traffic should be translated by NAT\nGateway. It is used only when LIST_OF_SUBNETWORKS is selected for the\nSubnetworkIpRangeToNatOption above.",
                },
                icmpIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for ICMP connections. Defaults to 30s if not set. (Format: int32)",
                },
                enableEndpointIndependentMapping: {
                  type: "boolean",
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
                    "List of Subnetwork resources whose traffic should be translated by NAT64\nGateway. It is used only when LIST_OF_IPV6_SUBNETWORKS is\nselected for the SubnetworkIpRangeToNat64Option above.",
                },
                tcpTransitoryIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for TCP transitory connections. Defaults to 30s if\nnot set. (Format: int32)",
                },
                maxPortsPerVm: {
                  type: "integer",
                  description:
                    "Maximum number of ports allocated to a VM from this NAT config when\nDynamic Port Allocation is enabled.\n\n\nIf Dynamic Port Allocation is not enabled, this field has no effect.\n\n\nIf Dynamic Port Allocation is enabled, and this field is set, it must be\nset to a power of two greater than minPortsPerVm, or 64 if minPortsPerVm\nis not set.\n\n\nIf Dynamic Port Allocation is enabled and this field is not set,\na maximum of 65536 ports will be allocated to a VM from this NAT\nconfig. (Format: int32)",
                },
                sourceSubnetworkIpRangesToNat: {
                  type: "string",
                  enum: [
                    "ALL_SUBNETWORKS_ALL_IP_RANGES",
                    "ALL_SUBNETWORKS_ALL_PRIMARY_IP_RANGES",
                    "LIST_OF_SUBNETWORKS",
                  ],
                  description:
                    "Specify the Nat option, which can take one of the following values:\n   \n   - ALL_SUBNETWORKS_ALL_IP_RANGES: All of the IP ranges in every\n   Subnetwork are allowed to Nat.\n   - ALL_SUBNETWORKS_ALL_PRIMARY_IP_RANGES: All of the primary IP ranges\n   in every Subnetwork are allowed to Nat.\n   - LIST_OF_SUBNETWORKS: A list of Subnetworks are allowed to Nat\n   (specified in the field subnetwork below)\n\n\nThe default is SUBNETWORK_IP_RANGE_TO_NAT_OPTION_UNSPECIFIED.\nNote that if this field contains ALL_SUBNETWORKS_ALL_IP_RANGES then there\nshould not be any other Router.Nat section in any Router for this network\nin this region.",
                },
                drainNatIps: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of URLs of the IP resources to be drained. These IPs\nmust be valid static external IPs that have been assigned to the NAT.\nThese IPs should be used for updating/patching a NAT only.",
                },
                endpointTypes: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "ENDPOINT_TYPE_MANAGED_PROXY_LB",
                      "ENDPOINT_TYPE_SWG",
                      "ENDPOINT_TYPE_VM",
                    ],
                  },
                  description:
                    "List of NAT-ted endpoint types supported by the Nat Gateway. If the list\nis empty, then it will be equivalent to include ENDPOINT_TYPE_VM",
                },
                enableDynamicPortAllocation: {
                  type: "boolean",
                  description:
                    "Enable Dynamic Port Allocation.\n\n\nIf not specified, it is disabled by default.\n\n\nIf set to true,\n   \n   - Dynamic Port Allocation will be enabled on this NAT\n   config.\n   - enableEndpointIndependentMapping cannot be set to true.\n   - If minPorts is set, minPortsPerVm must be set to a\n   power of two greater than or equal to 32. If minPortsPerVm is not set, a\n   minimum of 32 ports will be allocated to a VM from this NAT\n   config.",
                },
                rules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      match: {
                        type: "string",
                        description:
                          "CEL expression that specifies the match condition that egress traffic\nfrom a VM is evaluated against. If it evaluates to true, the\ncorresponding `action` is enforced.\n\nThe following examples are valid match expressions for public NAT:\n\n`inIpRange(destination.ip, '1.1.0.0/16') || inIpRange(destination.ip,\n     '2.2.0.0/16')`\n\n`destination.ip == '1.1.0.1' || destination.ip == '8.8.8.8'`\n\nThe following example is a valid match expression for private NAT:\n\n`nexthop.hub ==\n'//networkconnectivity.googleapis.com/projects/my-project/locations/global/hubs/hub-1'`",
                      },
                      action: {
                        type: "object",
                        properties: {
                          sourceNatActiveIps: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the IP resources used for this NAT rule. These IP\naddresses must be valid static external IP addresses assigned to the\nproject.\nThis field is used for public NAT.",
                          },
                          sourceNatDrainRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of subnetworks representing source ranges to be\ndrained. This is only supported on patch/update, and these\nsubnetworks must have previously been used as active ranges in this\nNAT Rule.\nThis field is used for private NAT.",
                          },
                          sourceNatDrainIps: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the IP resources to be drained. These IPs\nmust be valid static external IPs that have been assigned to the NAT.\nThese IPs should be used for updating/patching a NAT rule only.\nThis field is used for public NAT.",
                          },
                          sourceNatActiveRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of URLs of the subnetworks used as source ranges for this\nNAT Rule. These subnetworks must have purpose set to PRIVATE_NAT.\nThis field is used for private NAT.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: {
                        type: "string",
                        description: "An optional description of this rule.",
                      },
                      ruleNumber: {
                        type: "integer",
                        description:
                          "An integer uniquely identifying a rule in the list. The rule number\nmust be a positive value between 0 and 65000, and\nmust be unique among rules within a NAT. (Format: uint32)",
                      },
                    },
                    additionalProperties: true,
                  },
                  description: "A list of rules associated with this NAT.",
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
                      enum: ["ALL", "ERRORS_ONLY", "TRANSLATIONS_ONLY"],
                      description:
                        "Specify the desired filtering of logs on this NAT. If unspecified,\nlogs are exported for all connections handled by this NAT.\nThis option can take one of the following values:\n   \n   - ERRORS_ONLY: Export logs only for connection failures.\n   - TRANSLATIONS_ONLY: Export logs only for successful\n   connections.\n   - ALL: Export logs for all connections, successful and\n   unsuccessful.",
                    },
                  },
                  description: "Configuration of logging on a NAT.",
                  additionalProperties: true,
                },
                name: {
                  type: "string",
                  description:
                    "Unique name of this Nat service.\nThe name must be 1-63 characters long and comply withRFC1035.",
                },
                udpIdleTimeoutSec: {
                  type: "integer",
                  description:
                    "Timeout (in seconds) for UDP connections. Defaults to 30s if not set. (Format: int32)",
                },
                natIps: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of URLs of the IP resources used for this Nat service. These IP\naddresses must be valid static external IP addresses assigned to the\nproject.",
                },
              },
              description:
                "Represents a Nat resource. It enables the VMs within the specified\nsubnetworks to access Internet without external IP addresses. It specifies\na list of subnetworks (and the ranges within) that want to use NAT.\nCustomers can also provide the external IPs that would be used for NAT. GCP\nwould auto-allocate ephemeral IPs if no external IPs are provided.",
              additionalProperties: true,
            },
            description: "A list of NAT services created in this router.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#router for\nrouters.",
          },
          required: false,
        },
        bgp: {
          name: "Bgp",
          description: "BGP information specific to this router.",
          type: {
            type: "object",
            properties: {
              advertiseMode: {
                type: "string",
                enum: ["CUSTOM", "DEFAULT"],
                description:
                  "User-specified flag to indicate which mode to use for advertisement.\nThe options are DEFAULT or CUSTOM.",
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
                  "User-specified list of individual IP ranges to advertise in custom mode.\nThis field can only be populated if advertise_mode is CUSTOM and\nis advertised to all peers of the router.\nThese IP ranges will be advertised in addition to any specified groups.\nLeave this field blank to advertise no custom IP ranges.",
              },
              asn: {
                type: "integer",
                description:
                  "Local BGP Autonomous System Number (ASN).\nMust be anRFC6996 private ASN, either 16-bit or 32-bit. The\nvalue will be fixed for this router resource. All VPN tunnels that link\nto this router will have the same local ASN. (Format: uint32)",
              },
              keepaliveInterval: {
                type: "integer",
                description:
                  "The interval in seconds between BGP keepalive messages that are\nsent to the peer.\n\n\nHold time is three times the interval at which keepalive messages are\nsent, and the hold time is the maximum number of seconds allowed to\nelapse between successive keepalive messages that BGP receives from a\npeer.\n\n\nBGP will use the smaller of either the local hold time value or the\npeer's hold time value as the hold time for the BGP connection between\nthe two peers.\n\n\nIf set, this value must be between 20 and 60. The default is 20. (Format: uint32)",
              },
              advertisedGroups: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["ALL_SUBNETS"],
                },
                description:
                  "User-specified list of prefix groups to advertise in custom mode.\nThis field can only be populated if advertise_mode is CUSTOM and\nis advertised to all peers of the router.\nThese groups will be advertised in addition to any specified prefixes.\nLeave this field blank to advertise no custom groups.",
              },
              identifierRange: {
                type: "string",
                description:
                  'Explicitly specifies a range of valid BGP Identifiers for this Router. It\nis provided as a link-local IPv4 range (from 169.254.0.0/16), of size at\nleast /30, even if the BGP sessions are over IPv6. It must not overlap\nwith any IPv4 BGP session ranges.\n\n\nOther vendors commonly call this "router ID".',
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        interfaces: {
          name: "Interfaces",
          description: "Router interfaces.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                privateIpAddress: {
                  type: "string",
                  description:
                    "The regional private internal IP address that is used to establish\nBGP sessions to a VM instance acting as a third-party\nRouter Appliance, such as a Next Gen Firewall, a Virtual Router, or\nan SD-WAN VM.",
                },
                linkedInterconnectAttachment: {
                  type: "string",
                  description:
                    "URI of the linked Interconnect attachment. It must be in the same region\nas the router. Each interface can have one linked resource, which can be\na VPN tunnel, an Interconnect attachment, or a subnetwork.",
                },
                subnetwork: {
                  type: "string",
                  description:
                    "The URI of the subnetwork resource that this interface belongs to, which\nmust be in the same region as the Cloud Router.\nWhen you establish a BGP session to a VM instance using this interface,\nthe VM instance must belong to the same subnetwork as the subnetwork\nspecified here.",
                },
                redundantInterface: {
                  type: "string",
                  description:
                    "Name of the interface that will be redundant with the current interface\nyou are creating. The redundantInterface must belong to the same Cloud\nRouter as the interface here. To establish the BGP session to a Router\nAppliance VM, you must create two BGP peers. The two BGP peers must be\nattached to two separate interfaces that are redundant with each other.\nThe redundant_interface must be 1-63 characters long, and comply withRFC1035. Specifically, the redundant_interface must\nbe 1-63 characters long and match the regular expression\n`[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a\nlowercase letter, and all following characters must be a dash, lowercase\nletter, or digit, except the last character, which cannot be a dash.",
                },
                managementType: {
                  type: "string",
                  enum: ["MANAGED_BY_ATTACHMENT", "MANAGED_BY_USER"],
                  description:
                    "[Output Only] The resource that configures and manages this interface.\n   \n   - MANAGED_BY_USER is the default value and can be managed directly\n   by users.\n   - MANAGED_BY_ATTACHMENT is an interface that is configured and\n   managed by Cloud Interconnect, specifically, by an InterconnectAttachment\n   of type PARTNER. Google automatically creates, updates, and deletes\n   this type of interface when the PARTNER InterconnectAttachment is\n   created, updated, or deleted.",
                },
                ipRange: {
                  type: "string",
                  description:
                    "IP address and range of the interface.\n   \n   - For Internet Protocol version 4 (IPv4), the IP range must be in theRFC3927 link-local IP address space. The value must\n   be a CIDR-formatted string, for example, 169.254.0.1/30.\n   Note: Do not truncate the IP address, as it represents the IP address of\n   the interface. \n   - For Internet Protocol version 6 (IPv6), the value\n   must be a unique local address (ULA) range from fdff:1::/64\n   with a mask length of 126 or less. This value should be a CIDR-formatted\n   string, for example, fdff:1::1/112. Within the router's\n   VPC, this IPv6 prefix will be reserved exclusively for this connection\n   and cannot be used for any other purpose.",
                },
                linkedVpnTunnel: {
                  type: "string",
                  description:
                    "URI of the linked VPN tunnel, which must be in the same region as the\nrouter. Each interface can have one linked resource, which can be\na VPN tunnel, an Interconnect attachment, or a subnetwork.",
                },
                ipVersion: {
                  type: "string",
                  enum: ["IPV4", "IPV6"],
                  description: "IP version of this interface.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this interface entry.\nThe name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63\ncharacters long and match the regular expression\n`[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a\nlowercase letter, and all following characters must be a dash, lowercase\nletter, or digit, except the last character, which cannot be a dash.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Router interfaces.\nTo create a BGP peer that uses a router interface,\nthe interface must have one of the following fields specified:\n   \n   - linkedVpnTunnel\n   - linkedInterconnectAttachment\n   - subnetwork\n\n\nYou can create a router interface without any of these fields specified.\nHowever, you cannot create a BGP peer that uses that interface.",
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
        network: {
          name: "Network",
          description: "URI of the network to which this router belongs.",
          type: {
            type: "string",
            description: "URI of the network to which this router belongs.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          required: false,
        },
        bgpPeers: {
          name: "Bgp Peers",
          description:
            "BGP information that must be configured into the routing stack to establish BGP peering.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ipv4NexthopAddress: {
                  type: "string",
                  description:
                    "IPv4 address of the interface inside Google Cloud Platform.",
                },
                enableIpv4: {
                  type: "boolean",
                  description:
                    "Enable IPv4 traffic over BGP Peer. It is enabled by default if\nthe peerIpAddress is version 4.",
                },
                peerIpv6NexthopAddress: {
                  type: "string",
                  description:
                    "IPv6 address of the BGP interface outside Google Cloud Platform.",
                },
                peerAsn: {
                  type: "integer",
                  description:
                    "Peer BGP Autonomous System Number (ASN). Each BGP interface may use\na different value. (Format: uint32)",
                },
                md5AuthenticationKeyName: {
                  type: "string",
                  description:
                    "Present if MD5 authentication is enabled for the peering. Must be the\nname of one of the entries in the Router.md5_authentication_keys. The\nfield must comply with RFC1035.",
                },
                peerIpv4NexthopAddress: {
                  type: "string",
                  description:
                    "IPv4 address of the BGP interface outside Google Cloud Platform.",
                },
                exportPolicies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of export policies applied to this peer, in the order they must be\nevaluated. The name must correspond to an existing policy that has\nROUTE_POLICY_TYPE_EXPORT type.",
                },
                ipAddress: {
                  type: "string",
                  description:
                    "IP address of the interface inside Google Cloud Platform.",
                },
                routerApplianceInstance: {
                  type: "string",
                  description:
                    "URI of the VM instance that is used as third-party router\nappliances such as Next Gen Firewalls, Virtual Routers, or Router\nAppliances. The VM instance must be located in zones contained in the\nsame region as this Cloud Router.\nThe VM instance is the peer side of the BGP session.",
                },
                customLearnedRoutePriority: {
                  type: "integer",
                  description:
                    "The user-defined custom learned route priority for a BGP session. This\nvalue is applied to all custom learned route ranges for the session.\nYou can choose a value from `0` to `65335`. If you don't provide a\nvalue, Google Cloud assigns a priority of `100` to the ranges. (Format: int32)",
                },
                advertiseMode: {
                  type: "string",
                  enum: ["CUSTOM", "DEFAULT"],
                  description:
                    "User-specified flag to indicate which mode to use for advertisement.",
                },
                advertisedGroups: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["ALL_SUBNETS"],
                  },
                  description:
                    'User-specified list of prefix groups to advertise in custom mode,\nwhich currently supports the following option:\n   \n   - ALL_SUBNETS: Advertises all of the router\'s own VPC subnets. This\n   excludes any routes learned for subnets that use\n   VPC Network Peering.\n\n\nNote that this field can only be populated if advertise_mode is CUSTOM\nand overrides the list defined for the router (in the "bgp" message).\nThese groups are advertised in addition to any specified prefixes.\nLeave this field blank to advertise no custom groups.',
                },
                ipv6NexthopAddress: {
                  type: "string",
                  description:
                    "IPv6 address of the interface inside Google Cloud Platform.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this BGP peer.\nThe name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63\ncharacters long and match the regular expression\n`[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a\nlowercase letter, and all following characters must be a dash, lowercase\nletter, or digit, except the last character, which cannot be a dash.",
                },
                peerIpAddress: {
                  type: "string",
                  description:
                    "IP address of the BGP interface outside Google Cloud Platform.",
                },
                bfd: {
                  type: "object",
                  properties: {
                    minTransmitInterval: {
                      type: "integer",
                      description:
                        "The minimum interval, in milliseconds, between BFD control packets\ntransmitted to the peer router. The actual value is negotiated between\nthe two routers and is equal to the greater of this value and the\ncorresponding receive interval of the other router.\n\n\nIf set, this value must be between 1000 and 30000.\n\n\nThe default is 1000. (Format: uint32)",
                    },
                    sessionInitializationMode: {
                      type: "string",
                      enum: ["ACTIVE", "DISABLED", "PASSIVE"],
                      description:
                        "The BFD session initialization mode for this BGP peer.\n\n\nIf set to ACTIVE, the Cloud Router will initiate the BFD session for\nthis BGP peer. If set to PASSIVE, the Cloud Router will wait for the\npeer router to initiate the BFD session for this BGP peer. If set to\nDISABLED, BFD is disabled for this BGP peer. The default is DISABLED.",
                    },
                    multiplier: {
                      type: "integer",
                      description:
                        "The number of consecutive BFD packets that must be missed\nbefore BFD declares that a peer is unavailable.\n\n\nIf set, the value must be a value between 5 and 16.\n\n\nThe default is 5. (Format: uint32)",
                    },
                    minReceiveInterval: {
                      type: "integer",
                      description:
                        "The minimum interval, in milliseconds, between BFD control packets\nreceived from the peer router. The actual value is negotiated between\nthe two routers and is equal to the greater of this value and the\ntransmit interval of the other router.\n\n\nIf set, this value must be between 1000 and 30000.\n\n\nThe default is 1000. (Format: uint32)",
                    },
                  },
                  additionalProperties: true,
                },
                enable: {
                  type: "string",
                  enum: ["FALSE", "TRUE"],
                  description:
                    "The status of the BGP peer connection.\n\n\nIf set to FALSE, any active session with the peer is terminated and\nall associated routing information is removed. If set to TRUE, the\npeer connection can be established with routing information. The default\nis TRUE.",
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
                    'User-specified list of individual IP ranges to advertise in custom mode.\nThis field can only be populated if advertise_mode is CUSTOM and\noverrides the list defined for the router (in the "bgp" message).\nThese IP ranges are advertised in addition to any specified groups.\nLeave this field blank to advertise no custom IP ranges.',
                },
                customLearnedIpRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      range: {
                        type: "string",
                        description:
                          "The custom learned route IP address range. Must be a valid\nCIDR-formatted prefix. If an IP address is provided without a subnet\nmask, it is interpreted as, for IPv4, a `/32` singular IP address\nrange, and, for IPv6, `/128`.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "A list of user-defined custom learned route IP address ranges for a BGP\nsession.",
                },
                advertisedRoutePriority: {
                  type: "integer",
                  description:
                    "The priority of routes advertised to this BGP peer. Where there is more\nthan one matching route of maximum length, the routes with the lowest\npriority value win. (Format: uint32)",
                },
                importPolicies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of import policies applied to this peer, in the order they must be\nevaluated. The name must correspond to an existing policy that has\nROUTE_POLICY_TYPE_IMPORT type.",
                },
                managementType: {
                  type: "string",
                  enum: ["MANAGED_BY_ATTACHMENT", "MANAGED_BY_USER"],
                  description:
                    "[Output Only] The resource that configures and manages this BGP peer.\n   \n   -  MANAGED_BY_USER is the default value and can be managed by you\n   or other users\n   - MANAGED_BY_ATTACHMENT is a BGP peer that is configured and managed\n   by Cloud Interconnect, specifically by an InterconnectAttachment of type\n   PARTNER. Google automatically creates, updates, and deletes this type of\n   BGP peer when the PARTNER InterconnectAttachment is created, updated,\n   or deleted.",
                },
                enableIpv6: {
                  type: "boolean",
                  description:
                    "Enable IPv6 traffic over BGP Peer. It is enabled by default if the\npeerIpAddress is version 6.",
                },
                interfaceName: {
                  type: "string",
                  description:
                    "Name of the interface the BGP peer is associated with.",
                },
              },
              additionalProperties: true,
            },
            description:
              "BGP information that must be configured into the routing stack to\nestablish BGP peering. This information must specify the peer ASN and\neither the interface name, IP address, or peer IP address. Please refer toRFC4273.",
          },
          required: false,
        },
        params: {
          name: "Params",
          description: "Input only.",
          type: {
            type: "object",
            properties: {
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Tag keys/values directly bound to this resource.\nThe field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.\n* Inconsistent format is not supported. For instance:\n  {"tagKeys/333" : "tagValues/444", "123/env" : "prod"} is invalid.',
              },
            },
            description: "Additional router parameters.",
            additionalProperties: true,
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
                name: {
                  type: "string",
                  description:
                    "Name used to identify the key.\n\nMust be unique within a router. Must be referenced by exactly\none bgpPeer. Must comply withRFC1035.",
                },
                key: {
                  type: "string",
                  description:
                    "[Input only] Value of the key.\n\nFor patch and update calls, it can be skipped to\ncopy the value from the previous configuration. This is allowed if the\nkey with the same name existed before the operation. Maximum length is 80\ncharacters. Can only contain printable ASCII characters.",
                },
              },
              additionalProperties: true,
            },
            description: "Keys used for MD5 authentication.",
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
        let path = `projects/{project}/regions/{region}/routers/{router}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.encryptedInterconnectRouter !== undefined)
          requestBody.encryptedInterconnectRouter =
            input.event.inputConfig.encryptedInterconnectRouter;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.nats !== undefined)
          requestBody.nats = input.event.inputConfig.nats;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.bgp !== undefined)
          requestBody.bgp = input.event.inputConfig.bgp;
        if (input.event.inputConfig.interfaces !== undefined)
          requestBody.interfaces = input.event.inputConfig.interfaces;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.network !== undefined)
          requestBody.network = input.event.inputConfig.network;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.bgpPeers !== undefined)
          requestBody.bgpPeers = input.event.inputConfig.bgpPeers;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.md5AuthenticationKeys !== undefined)
          requestBody.md5AuthenticationKeys =
            input.event.inputConfig.md5AuthenticationKeys;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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

export default routersPatch;
