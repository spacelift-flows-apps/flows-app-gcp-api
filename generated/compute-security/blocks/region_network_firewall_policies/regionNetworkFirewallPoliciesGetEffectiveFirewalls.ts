import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const regionNetworkFirewallPoliciesGetEffectiveFirewalls: AppBlock = {
  name: "Region Network Firewall Policies - Get Effective Firewalls",
  description: `Returns the effective firewalls on a given network.`,
  category: "Region Network Firewall Policies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
            description: "Name of the region scoping this request.",
          },
          required: true,
        },
        network: {
          name: "Network",
          description: "Network reference",
          type: {
            type: "string",
            description: "Network reference",
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
        if (input.event.inputConfig.network !== undefined)
          queryParams["network"] = String(input.event.inputConfig.network);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/firewallPolicies/getEffectiveFirewalls",
          pathParams,
          queryParams,
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
          firewallPolicys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                displayName: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The display name of the firewall policy.",
                },
                name: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The name of the firewall policy.",
                },
                packetMirroringRules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      action: {
                        type: "string",
                        description:
                          'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next". Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
                      },
                      description: {
                        type: "string",
                        description:
                          "An optional description for this resource.",
                      },
                      direction: {
                        type: "string",
                        enum: ["UNDEFINED_DIRECTION", "EGRESS", "INGRESS"],
                        description:
                          "The direction in which this rule applies. Check the Direction enum for the list of possible values.",
                      },
                      disabled: {
                        type: "boolean",
                        description:
                          "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
                      },
                      enableLogging: {
                        type: "boolean",
                        description:
                          'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
                      },
                      kind: {
                        type: "string",
                        description:
                          "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
                      },
                      match: {
                        type: "object",
                        properties: {
                          destAddressGroups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
                          },
                          destFqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
                          },
                          destIpRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
                          },
                          destNetworkContext: {
                            type: "string",
                            enum: ["UNDEFINED_DEST_NETWORK_CONTEXT"],
                            description:
                              "Network context of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkContext enum for the list of possible values.",
                          },
                          destNetworkType: {
                            type: "string",
                            enum: ["UNDEFINED_DEST_NETWORK_TYPE"],
                            description:
                              "Network type of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkType enum for the list of possible values.",
                          },
                          destRegionCodes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
                          },
                          destThreatIntelligences: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
                          },
                          layer4Configs: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                ipProtocol: {
                                  type: "string",
                                  description:
                                    "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP protocol number.",
                                },
                                ports: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    'An optional list of ports to which this rule applies. This field is only applicable for UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port.  Example inputs include: ["22"],["80","443"], and ["12345-12349"].',
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "Pairs of IP protocols and ports that the rule should match.",
                          },
                          srcAddressGroups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
                          },
                          srcFqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
                          },
                          srcIpRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
                          },
                          srcNetworkContext: {
                            type: "string",
                            enum: ["UNDEFINED_SRC_NETWORK_CONTEXT"],
                            description:
                              "Network context of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkContext enum for the list of possible values.",
                          },
                          srcNetworkType: {
                            type: "string",
                            enum: ["UNDEFINED_SRC_NETWORK_TYPE"],
                            description:
                              "Network type of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkType enum for the list of possible values.",
                          },
                          srcNetworks: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Networks of the traffic source. It can be either a full or partial url.",
                          },
                          srcRegionCodes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
                          },
                          srcSecureTags: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                  description:
                                    "Name of the secure tag, created with TagManager's TagValue API.",
                                },
                                state: {
                                  type: "string",
                                  enum: [
                                    "UNDEFINED_STATE",
                                    "EFFECTIVE",
                                    "INEFFECTIVE",
                                  ],
                                  description:
                                    "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
                          },
                          srcThreatIntelligences: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic source.",
                          },
                        },
                        description:
                          "Represents a match condition that incoming traffic is evaluated against. Exactly one field must be specified.",
                        additionalProperties: true,
                      },
                      priority: {
                        type: "integer",
                        description:
                          "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
                      },
                      ruleName: {
                        type: "string",
                        description:
                          "An optional name for the rule. This field is not a unique identifier and can be updated.",
                      },
                      ruleTupleCount: {
                        type: "integer",
                        description:
                          "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
                      },
                      securityProfileGroup: {
                        type: "string",
                        description:
                          "A fully-qualified URL of a SecurityProfile resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions.",
                      },
                      targetResources: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of network resource URLs to which this rule applies.  This field allows you to control which network's VMs get this rule.  If this field is left blank, all VMs within the organization will receive the rule.",
                      },
                      targetSecureTags: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              description:
                                "Name of the secure tag, created with TagManager's TagValue API.",
                            },
                            state: {
                              type: "string",
                              enum: [
                                "UNDEFINED_STATE",
                                "EFFECTIVE",
                                "INEFFECTIVE",
                              ],
                              description:
                                "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                            },
                          },
                          additionalProperties: true,
                        },
                        description:
                          "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
                      },
                      targetServiceAccounts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of service accounts indicating the sets of instances that are applied with this rule.",
                      },
                      tlsInspect: {
                        type: "boolean",
                        description:
                          "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
                      },
                    },
                    description:
                      "Represents a rule that describes one or more match conditions along with the action to be taken when traffic matches this condition (allow or deny).",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output only] The packet mirroring rules that apply to the network.",
                },
                priority: {
                  type: "integer",
                  description:
                    "Output only. [Output only] Priority of firewall policy association. Not applicable for type=HIERARCHY.",
                },
                rules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      action: {
                        type: "string",
                        description:
                          'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next". Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
                      },
                      description: {
                        type: "string",
                        description:
                          "An optional description for this resource.",
                      },
                      direction: {
                        type: "string",
                        enum: ["UNDEFINED_DIRECTION", "EGRESS", "INGRESS"],
                        description:
                          "The direction in which this rule applies. Check the Direction enum for the list of possible values.",
                      },
                      disabled: {
                        type: "boolean",
                        description:
                          "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
                      },
                      enableLogging: {
                        type: "boolean",
                        description:
                          'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
                      },
                      kind: {
                        type: "string",
                        description:
                          "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
                      },
                      match: {
                        type: "object",
                        properties: {
                          destAddressGroups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
                          },
                          destFqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
                          },
                          destIpRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
                          },
                          destNetworkContext: {
                            type: "string",
                            enum: ["UNDEFINED_DEST_NETWORK_CONTEXT"],
                            description:
                              "Network context of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkContext enum for the list of possible values.",
                          },
                          destNetworkType: {
                            type: "string",
                            enum: ["UNDEFINED_DEST_NETWORK_TYPE"],
                            description:
                              "Network type of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkType enum for the list of possible values.",
                          },
                          destRegionCodes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
                          },
                          destThreatIntelligences: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
                          },
                          layer4Configs: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                ipProtocol: {
                                  type: "string",
                                  description:
                                    "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP protocol number.",
                                },
                                ports: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    'An optional list of ports to which this rule applies. This field is only applicable for UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port.  Example inputs include: ["22"],["80","443"], and ["12345-12349"].',
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "Pairs of IP protocols and ports that the rule should match.",
                          },
                          srcAddressGroups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
                          },
                          srcFqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
                          },
                          srcIpRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
                          },
                          srcNetworkContext: {
                            type: "string",
                            enum: ["UNDEFINED_SRC_NETWORK_CONTEXT"],
                            description:
                              "Network context of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkContext enum for the list of possible values.",
                          },
                          srcNetworkType: {
                            type: "string",
                            enum: ["UNDEFINED_SRC_NETWORK_TYPE"],
                            description:
                              "Network type of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkType enum for the list of possible values.",
                          },
                          srcNetworks: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Networks of the traffic source. It can be either a full or partial url.",
                          },
                          srcRegionCodes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
                          },
                          srcSecureTags: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                  description:
                                    "Name of the secure tag, created with TagManager's TagValue API.",
                                },
                                state: {
                                  type: "string",
                                  enum: [
                                    "UNDEFINED_STATE",
                                    "EFFECTIVE",
                                    "INEFFECTIVE",
                                  ],
                                  description:
                                    "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
                          },
                          srcThreatIntelligences: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic source.",
                          },
                        },
                        description:
                          "Represents a match condition that incoming traffic is evaluated against. Exactly one field must be specified.",
                        additionalProperties: true,
                      },
                      priority: {
                        type: "integer",
                        description:
                          "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
                      },
                      ruleName: {
                        type: "string",
                        description:
                          "An optional name for the rule. This field is not a unique identifier and can be updated.",
                      },
                      ruleTupleCount: {
                        type: "integer",
                        description:
                          "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
                      },
                      securityProfileGroup: {
                        type: "string",
                        description:
                          "A fully-qualified URL of a SecurityProfile resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions.",
                      },
                      targetResources: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of network resource URLs to which this rule applies.  This field allows you to control which network's VMs get this rule.  If this field is left blank, all VMs within the organization will receive the rule.",
                      },
                      targetSecureTags: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              description:
                                "Name of the secure tag, created with TagManager's TagValue API.",
                            },
                            state: {
                              type: "string",
                              enum: [
                                "UNDEFINED_STATE",
                                "EFFECTIVE",
                                "INEFFECTIVE",
                              ],
                              description:
                                "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                            },
                          },
                          additionalProperties: true,
                        },
                        description:
                          "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
                      },
                      targetServiceAccounts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of service accounts indicating the sets of instances that are applied with this rule.",
                      },
                      tlsInspect: {
                        type: "boolean",
                        description:
                          "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
                      },
                    },
                    description:
                      "Represents a rule that describes one or more match conditions along with the action to be taken when traffic matches this condition (allow or deny).",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output only] The rules that apply to the network.",
                },
                type: {
                  type: "string",
                  enum: [
                    "UNDEFINED_TYPE",
                    "HIERARCHY",
                    "NETWORK",
                    "NETWORK_REGIONAL",
                    "SYSTEM_GLOBAL",
                    "SYSTEM_REGIONAL",
                    "UNSPECIFIED",
                  ],
                  description:
                    "Output only. [Output Only] The type of the firewall policy. Can be one of HIERARCHY, NETWORK, NETWORK_REGIONAL, SYSTEM_GLOBAL, SYSTEM_REGIONAL. Check the Type enum for the list of possible values.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Output only. [Output only] Effective firewalls from firewall policy. It applies to Regional Network Firewall Policies in the specified region, Global Network Firewall Policies and Hierachial Firewall Policies which are associated with the network.",
          },
          firewalls: {
            type: "array",
            items: {
              type: "object",
              properties: {
                allowed: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      IPProtocol: {
                        type: "string",
                        description:
                          "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                      },
                      ports: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'An optional list of ports to which this rule applies. This field is only applicable for the UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port.  Example inputs include: ["22"], ["80","443"], and ["12345-12349"].',
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The list of ALLOW rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a permitted connection.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                denied: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      IPProtocol: {
                        type: "string",
                        description:
                          "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                      },
                      ports: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'An optional list of ports to which this rule applies. This field is only applicable for the UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port.  Example inputs include: ["22"], ["80","443"], and ["12345-12349"].',
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The list of DENY rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a denied connection.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this field when you create the resource.",
                },
                destinationRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If destination ranges are specified, the firewall rule applies only to traffic that has destination IP address in these ranges. These ranges must be expressed inCIDR format. Both IPv4 and IPv6 are supported.",
                },
                direction: {
                  type: "string",
                  enum: ["UNDEFINED_DIRECTION", "EGRESS", "INGRESS"],
                  description:
                    "Direction of traffic to which this firewall applies, either `INGRESS` or `EGRESS`. The default is `INGRESS`. For `EGRESS` traffic, you cannot specify the sourceTags fields. Check the Direction enum for the list of possible values.",
                },
                disabled: {
                  type: "boolean",
                  description:
                    "Denotes whether the firewall rule is disabled. When set to true, the firewall rule is not enforced and the network behaves as if it did not exist. If this is unspecified, the firewall rule will be enabled.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Always compute#firewall for firewall rules.",
                },
                logConfig: {
                  type: "object",
                  properties: {
                    enable: {
                      type: "boolean",
                      description:
                        "This field denotes whether to enable logging for a particular firewall rule.",
                    },
                    metadata: {
                      type: "string",
                      enum: [
                        "UNDEFINED_METADATA",
                        "EXCLUDE_ALL_METADATA",
                        "INCLUDE_ALL_METADATA",
                      ],
                      description: "A metadata key/value entry.",
                    },
                  },
                  description:
                    "The available logging options for a firewall rule.",
                  additionalProperties: true,
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
                },
                network: {
                  type: "string",
                  description:
                    "URL of the network resource for this firewall rule. If not specified when creating a firewall rule, the default network is used:  global/networks/default  If you choose to specify this field, you can specify the network as a full or partial URL. For example, the following are all valid URLs:     -    https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network    - projects/myproject/global/networks/my-network    - global/networks/default",
                },
                priority: {
                  type: "integer",
                  description:
                    "Priority for this rule. This is an integer between `0` and `65535`, both inclusive. The default value is `1000`. Relative priorities determine which rule takes effect if multiple rules apply. Lower values indicate higher priority. For example, a rule with priority `0` has higher precedence than a rule with priority `1`. DENY rules take precedence over ALLOW rules if they have equal priority. Note that VPC networks have implied rules with a priority of `65535`. To avoid conflicts with the implied rules, use a priority number less than `65535`.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                sourceRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source ranges are specified, the firewall rule applies only to traffic that has a source IP address in these ranges. These ranges must be expressed inCIDR format. One or both of sourceRanges and sourceTags may be set. If both fields are set, the rule applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in thesourceTags field. The connection does not need to match both fields for the rule to apply. Both IPv4 and IPv6 are supported.",
                },
                sourceServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source service accounts are specified, the firewall rules apply only to traffic originating from an instance with a service account in this list. Source service accounts cannot be used to control traffic to an instance's external IP address because service accounts are associated with an instance, not an IP address.sourceRanges can be set at the same time assourceServiceAccounts. If both are set, the firewall applies to traffic that has a source IP address within the sourceRanges OR a source IP that belongs to an instance with service account listed insourceServiceAccount. The connection does not need to match both fields for the firewall to apply.sourceServiceAccounts cannot be used at the same time assourceTags or targetTags.",
                },
                sourceTags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source tags are specified, the firewall rule applies only to traffic with source IPs that match the primary network interfaces of VM instances that have the tag and are in the same VPC network. Source tags cannot be used to control traffic to an instance's external IP address, it only applies to traffic between instances in the same virtual network. Because tags are associated with instances, not IP addresses. One or both of sourceRanges and sourceTags may be set. If both fields are set, the firewall applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in the sourceTags field. The connection does not need to match both fields for the firewall to apply.",
                },
                targetServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of service accounts indicating sets of instances located in the network that may make network connections as specified inallowed[].targetServiceAccounts cannot be used at the same time astargetTags or sourceTags. If neither targetServiceAccounts nor targetTags are specified, the firewall rule applies to all instances on the specified network.",
                },
                targetTags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of tags that controls which instances the firewall rule applies to. If targetTags are specified, then the firewall rule applies only to instances in the VPC network that have one of those tags. If no targetTags are specified, the firewall rule applies to all instances on the specified network.",
                },
              },
              description:
                "Represents a Firewall Rule resource.  Firewall rules allow or deny ingress traffic to, and egress traffic from your instances. For more information, readFirewall rules.",
              additionalProperties: true,
            },
            description: "Effective firewalls on the network.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default regionNetworkFirewallPoliciesGetEffectiveFirewalls;
