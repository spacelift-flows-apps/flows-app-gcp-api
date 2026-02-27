import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const firewallPoliciesInsert: AppBlock = {
  name: "Firewall Policies - Insert",
  description: `Creates a new policy in the specified project using the data included in the request.`,
  category: "Firewall Policies",
  inputs: {
    default: {
      config: {
        parentId: {
          name: "Parent ID",
          description:
            'Parent ID for this request. The ID can be either be "folders/[FOLDER_ID]"\nif the parent is a folder or "organizations/[ORGANIZATION_ID]" if the\nparent is an organization.',
          type: {
            type: "string",
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
        kind: {
          name: "Kind",
          description: "[Output only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output only] Type of the resource. Alwayscompute#firewallPolicyfor firewall policies",
          },
          required: false,
        },
        ruleTupleCount: {
          name: "Rule Tuple Count",
          description:
            "[Output Only] Total count of all firewall policy rule tuples.",
          type: {
            type: "integer",
            description:
              "[Output Only] Total count of all firewall policy rule tuples. A firewall\npolicy can not exceed a set number of tuples. (Format: int32)",
          },
          required: false,
        },
        parent: {
          name: "Parent",
          description: "[Output Only] The parent of the firewall policy.",
          type: {
            type: "string",
            description:
              "[Output Only] The parent of the firewall policy.\nThis field is not applicable to network firewall policies.",
          },
          required: false,
        },
        associations: {
          name: "Associations",
          description:
            "A list of associations that belong to this firewall policy.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                displayName: {
                  type: "string",
                  description:
                    "[Output Only] Deprecated, please use short name instead. The display name\nof the firewall policy of the association.",
                },
                name: {
                  type: "string",
                  description: "The name for an association.",
                },
                firewallPolicyId: {
                  type: "string",
                  description:
                    "[Output Only] The firewall policy ID of the association.",
                },
                shortName: {
                  type: "string",
                  description:
                    "[Output Only] The short name of the firewall policy of the association.",
                },
                attachmentTarget: {
                  type: "string",
                  description:
                    "The target that the firewall policy is attached to.",
                },
              },
              additionalProperties: true,
            },
            description:
              "A list of associations that belong to this firewall policy.",
          },
          required: false,
        },
        policyType: {
          name: "Policy Type",
          description: "The type of the firewall policy.",
          type: {
            type: "string",
            enum: ["RDMA_ROCE_POLICY", "VPC_POLICY"],
            description:
              "The type of the firewall policy. This field can be eitherVPC_POLICY or RDMA_ROCE_POLICY.\n\nNote: if not specified then VPC_POLICY will be used.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Specifies a fingerprint for this resource, which is essentially a hash of the metadata's contents and used for optimistic locking.",
          type: {
            type: "string",
            description:
              "Specifies a fingerprint for this resource, which is essentially a hash of\nthe metadata's contents and used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update metadata. You must always provide an\nup-to-date fingerprint hash in order to update or change metadata,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make get() request to the\nfirewall policy. (Format: byte)",
          },
          required: false,
        },
        rules: {
          name: "Rules",
          description: "A list of rules that belong to this policy.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                securityProfileGroup: {
                  type: "string",
                  description:
                    "A fully-qualified URL of a SecurityProfile resource instance.\nExample:\nhttps://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group\nMust be specified if action is one of 'apply_security_profile_group' or\n'mirror'. Cannot be specified for other actions.",
                },
                ruleTupleCount: {
                  type: "integer",
                  description:
                    "[Output Only] Calculation of the complexity of a single firewall policy\nrule. (Format: int32)",
                },
                disabled: {
                  type: "boolean",
                  description:
                    "Denotes whether the firewall policy rule is disabled. When set to true,\nthe firewall policy rule is not enforced and traffic behaves as if it did\nnot exist. If this is unspecified, the firewall policy rule will be\nenabled.",
                },
                tlsInspect: {
                  type: "boolean",
                  description:
                    "Boolean flag indicating if the traffic should be TLS decrypted.\nCan be set only if action = 'apply_security_profile_group' and cannot\nbe set for other actions.",
                },
                priority: {
                  type: "integer",
                  description:
                    "An integer indicating the priority of a rule in the list. The priority\nmust be a positive value between 0 and 2147483647.\nRules are evaluated from highest to lowest priority where 0 is the\nhighest priority and 2147483647 is the lowest priority. (Format: int32)",
                },
                action: {
                  type: "string",
                  description:
                    'The Action to perform when the client connection triggers the rule.\nValid actions for firewall rules are: "allow", "deny",\n"apply_security_profile_group" and "goto_next".\nValid actions for packet mirroring rules are: "mirror", "do_not_mirror"\nand "goto_next".',
                },
                kind: {
                  type: "string",
                  description:
                    "[Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
                },
                targetServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of service accounts indicating the sets of instances that are\napplied with this rule.",
                },
                match: {
                  type: "object",
                  properties: {
                    destIpRanges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "CIDR IP address range.\nMaximum number of destination CIDR IP ranges allowed is 5000.",
                    },
                    srcAddressGroups: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Address groups which should be matched against the traffic source.\nMaximum number of source address groups is 10.",
                    },
                    srcSecureTags: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          state: {
                            type: "string",
                            enum: ["EFFECTIVE", "INEFFECTIVE"],
                            description:
                              "[Output Only] State of the secure tag, either `EFFECTIVE` or\n`INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted\nor its network is deleted.",
                          },
                          name: {
                            type: "string",
                            description:
                              "Name of the secure tag, created with TagManager's TagValue API.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "List of secure tag values, which should be matched at the source\nof the traffic.\nFor INGRESS rule, if all the srcSecureTag are INEFFECTIVE,\nand there is no srcIpRange, this rule will be ignored.\nMaximum number of source tag values allowed is 256.",
                    },
                    srcRegionCodes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Region codes whose IP addresses will be used to match for source\nof traffic. Should be specified as 2 letter country code defined as per\nISO 3166 alpha-2 country codes. ex."US"\nMaximum number of source region codes allowed is 5000.',
                    },
                    destRegionCodes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Region codes whose IP addresses will be used to match for destination\nof traffic. Should be specified as 2 letter country code defined as per\nISO 3166 alpha-2 country codes. ex."US"\nMaximum number of dest region codes allowed is 5000.',
                    },
                    srcIpRanges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "CIDR IP address range.\nMaximum number of source CIDR IP ranges allowed is 5000.",
                    },
                    destAddressGroups: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Address groups which should be matched against the traffic destination.\nMaximum number of destination address groups is 10.",
                    },
                    srcFqdns: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Fully Qualified Domain Name (FQDN) which should be matched against\ntraffic source.\nMaximum number of source fqdn allowed is 100.",
                    },
                    destNetworkType: {
                      type: "string",
                      enum: [
                        "INTERNET",
                        "INTRA_VPC",
                        "NON_INTERNET",
                        "UNSPECIFIED",
                        "VPC_NETWORKS",
                      ],
                      description:
                        "Network type of the traffic destination. Allowed values are:\n   \n   \n     - UNSPECIFIED\n     - INTERNET\n     - NON_INTERNET",
                    },
                    destThreatIntelligences: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Names of Network Threat Intelligence lists.\nThe IPs in these lists will be matched against traffic destination.",
                    },
                    srcThreatIntelligences: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Names of Network Threat Intelligence lists.\nThe IPs in these lists will be matched against traffic source.",
                    },
                    srcNetworks: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Networks of the traffic source. It can be either a full or partial url.",
                    },
                    layer4Configs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          ipProtocol: {
                            type: "string",
                            description:
                              "The IP protocol to which this rule applies. The protocol type is\nrequired when creating a firewall rule. This value can either be\none of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP\nprotocol number.",
                          },
                          ports: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'An optional list of ports to which this rule applies. This field is\nonly applicable for UDP or TCP protocol. Each entry must be either\nan integer or a range. If not specified, this rule applies to\nconnections through any port.\n\nExample inputs include: ["22"],["80","443"], and ["12345-12349"].',
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "Pairs of IP protocols and ports that the rule should match.",
                    },
                    srcNetworkType: {
                      type: "string",
                      enum: [
                        "INTERNET",
                        "INTRA_VPC",
                        "NON_INTERNET",
                        "UNSPECIFIED",
                        "VPC_NETWORKS",
                      ],
                      description:
                        "Network type of the traffic source. Allowed values are:\n   \n   \n     - UNSPECIFIED\n     - INTERNET\n     - INTRA_VPC\n     - NON_INTERNET\n     - VPC_NETWORKS",
                    },
                    destFqdns: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Fully Qualified Domain Name (FQDN) which should be matched against\ntraffic destination.\nMaximum number of destination fqdn allowed is 100.",
                    },
                  },
                  description:
                    "Represents a match condition that incoming traffic is evaluated against.\nExactly one field must be specified.",
                  additionalProperties: true,
                },
                enableLogging: {
                  type: "boolean",
                  description:
                    'Denotes whether to enable logging for a particular rule. If logging is\nenabled, logs will be exported to the configured export destination in\nStackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you\ncannot enable logging on "goto_next" rules.',
                },
                ruleName: {
                  type: "string",
                  description:
                    "An optional name for the rule. This field is not a unique identifier\nand can be updated.",
                },
                direction: {
                  type: "string",
                  enum: ["EGRESS", "INGRESS"],
                  description: "The direction in which this rule applies.",
                },
                description: {
                  type: "string",
                  description: "An optional description for this resource.",
                },
                targetSecureTags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      state: {
                        type: "string",
                        enum: ["EFFECTIVE", "INEFFECTIVE"],
                        description:
                          "[Output Only] State of the secure tag, either `EFFECTIVE` or\n`INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted\nor its network is deleted.",
                      },
                      name: {
                        type: "string",
                        description:
                          "Name of the secure tag, created with TagManager's TagValue API.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "A list of secure tags that controls which instances the firewall rule\napplies to. If targetSecureTag are specified, then the\nfirewall rule applies only to instances in the VPC network that have one\nof those EFFECTIVE secure tags, if all the target_secure_tag are in\nINEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts.\nIf neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies\nto all instances on the specified network.\nMaximum number of target label tags allowed is 256.",
                },
                targetResources: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of network resource URLs to which this rule applies.  This field\nallows you to control which network's VMs get this rule.  If this field\nis left blank, all VMs within the organization will receive the rule.",
                },
              },
              description:
                "Represents a rule that describes one or more match conditions along with\nthe action to be taken when traffic matches this condition (allow or deny).",
              additionalProperties: true,
            },
            description:
              'A list of rules that belong to this policy.\nThere must always be a default rule (rule with priority 2147483647 and\nmatch "*"). If no rules are provided when creating a firewall policy, a\ndefault rule with action "allow" will be added.',
          },
          required: false,
        },
        packetMirroringRules: {
          name: "Packet Mirroring Rules",
          description:
            "A list of packet mirroring rules that belong to this policy.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                securityProfileGroup: {
                  type: "string",
                  description:
                    "A fully-qualified URL of a SecurityProfile resource instance.\nExample:\nhttps://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group\nMust be specified if action is one of 'apply_security_profile_group' or\n'mirror'. Cannot be specified for other actions.",
                },
                ruleTupleCount: {
                  type: "integer",
                  description:
                    "[Output Only] Calculation of the complexity of a single firewall policy\nrule. (Format: int32)",
                },
                disabled: {
                  type: "boolean",
                  description:
                    "Denotes whether the firewall policy rule is disabled. When set to true,\nthe firewall policy rule is not enforced and traffic behaves as if it did\nnot exist. If this is unspecified, the firewall policy rule will be\nenabled.",
                },
                tlsInspect: {
                  type: "boolean",
                  description:
                    "Boolean flag indicating if the traffic should be TLS decrypted.\nCan be set only if action = 'apply_security_profile_group' and cannot\nbe set for other actions.",
                },
                priority: {
                  type: "integer",
                  description:
                    "An integer indicating the priority of a rule in the list. The priority\nmust be a positive value between 0 and 2147483647.\nRules are evaluated from highest to lowest priority where 0 is the\nhighest priority and 2147483647 is the lowest priority. (Format: int32)",
                },
                action: {
                  type: "string",
                  description:
                    'The Action to perform when the client connection triggers the rule.\nValid actions for firewall rules are: "allow", "deny",\n"apply_security_profile_group" and "goto_next".\nValid actions for packet mirroring rules are: "mirror", "do_not_mirror"\nand "goto_next".',
                },
                kind: {
                  type: "string",
                  description:
                    "[Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
                },
                targetServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of service accounts indicating the sets of instances that are\napplied with this rule.",
                },
                match: {
                  type: "object",
                  properties: {
                    destIpRanges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "CIDR IP address range.\nMaximum number of destination CIDR IP ranges allowed is 5000.",
                    },
                    srcAddressGroups: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Address groups which should be matched against the traffic source.\nMaximum number of source address groups is 10.",
                    },
                    srcSecureTags: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          state: {
                            type: "string",
                            enum: ["EFFECTIVE", "INEFFECTIVE"],
                            description:
                              "[Output Only] State of the secure tag, either `EFFECTIVE` or\n`INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted\nor its network is deleted.",
                          },
                          name: {
                            type: "string",
                            description:
                              "Name of the secure tag, created with TagManager's TagValue API.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "List of secure tag values, which should be matched at the source\nof the traffic.\nFor INGRESS rule, if all the srcSecureTag are INEFFECTIVE,\nand there is no srcIpRange, this rule will be ignored.\nMaximum number of source tag values allowed is 256.",
                    },
                    srcRegionCodes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Region codes whose IP addresses will be used to match for source\nof traffic. Should be specified as 2 letter country code defined as per\nISO 3166 alpha-2 country codes. ex."US"\nMaximum number of source region codes allowed is 5000.',
                    },
                    destRegionCodes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Region codes whose IP addresses will be used to match for destination\nof traffic. Should be specified as 2 letter country code defined as per\nISO 3166 alpha-2 country codes. ex."US"\nMaximum number of dest region codes allowed is 5000.',
                    },
                    srcIpRanges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "CIDR IP address range.\nMaximum number of source CIDR IP ranges allowed is 5000.",
                    },
                    destAddressGroups: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Address groups which should be matched against the traffic destination.\nMaximum number of destination address groups is 10.",
                    },
                    srcFqdns: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Fully Qualified Domain Name (FQDN) which should be matched against\ntraffic source.\nMaximum number of source fqdn allowed is 100.",
                    },
                    destNetworkType: {
                      type: "string",
                      enum: [
                        "INTERNET",
                        "INTRA_VPC",
                        "NON_INTERNET",
                        "UNSPECIFIED",
                        "VPC_NETWORKS",
                      ],
                      description:
                        "Network type of the traffic destination. Allowed values are:\n   \n   \n     - UNSPECIFIED\n     - INTERNET\n     - NON_INTERNET",
                    },
                    destThreatIntelligences: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Names of Network Threat Intelligence lists.\nThe IPs in these lists will be matched against traffic destination.",
                    },
                    srcThreatIntelligences: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Names of Network Threat Intelligence lists.\nThe IPs in these lists will be matched against traffic source.",
                    },
                    srcNetworks: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Networks of the traffic source. It can be either a full or partial url.",
                    },
                    layer4Configs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          ipProtocol: {
                            type: "string",
                            description:
                              "The IP protocol to which this rule applies. The protocol type is\nrequired when creating a firewall rule. This value can either be\none of the following well known protocol strings (tcp,udp, icmp, esp,ah, ipip, sctp), or the IP\nprotocol number.",
                          },
                          ports: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'An optional list of ports to which this rule applies. This field is\nonly applicable for UDP or TCP protocol. Each entry must be either\nan integer or a range. If not specified, this rule applies to\nconnections through any port.\n\nExample inputs include: ["22"],["80","443"], and ["12345-12349"].',
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "Pairs of IP protocols and ports that the rule should match.",
                    },
                    srcNetworkType: {
                      type: "string",
                      enum: [
                        "INTERNET",
                        "INTRA_VPC",
                        "NON_INTERNET",
                        "UNSPECIFIED",
                        "VPC_NETWORKS",
                      ],
                      description:
                        "Network type of the traffic source. Allowed values are:\n   \n   \n     - UNSPECIFIED\n     - INTERNET\n     - INTRA_VPC\n     - NON_INTERNET\n     - VPC_NETWORKS",
                    },
                    destFqdns: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Fully Qualified Domain Name (FQDN) which should be matched against\ntraffic destination.\nMaximum number of destination fqdn allowed is 100.",
                    },
                  },
                  description:
                    "Represents a match condition that incoming traffic is evaluated against.\nExactly one field must be specified.",
                  additionalProperties: true,
                },
                enableLogging: {
                  type: "boolean",
                  description:
                    'Denotes whether to enable logging for a particular rule. If logging is\nenabled, logs will be exported to the configured export destination in\nStackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you\ncannot enable logging on "goto_next" rules.',
                },
                ruleName: {
                  type: "string",
                  description:
                    "An optional name for the rule. This field is not a unique identifier\nand can be updated.",
                },
                direction: {
                  type: "string",
                  enum: ["EGRESS", "INGRESS"],
                  description: "The direction in which this rule applies.",
                },
                description: {
                  type: "string",
                  description: "An optional description for this resource.",
                },
                targetSecureTags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      state: {
                        type: "string",
                        enum: ["EFFECTIVE", "INEFFECTIVE"],
                        description:
                          "[Output Only] State of the secure tag, either `EFFECTIVE` or\n`INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted\nor its network is deleted.",
                      },
                      name: {
                        type: "string",
                        description:
                          "Name of the secure tag, created with TagManager's TagValue API.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "A list of secure tags that controls which instances the firewall rule\napplies to. If targetSecureTag are specified, then the\nfirewall rule applies only to instances in the VPC network that have one\nof those EFFECTIVE secure tags, if all the target_secure_tag are in\nINEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts.\nIf neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies\nto all instances on the specified network.\nMaximum number of target label tags allowed is 256.",
                },
                targetResources: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of network resource URLs to which this rule applies.  This field\nallows you to control which network's VMs get this rule.  If this field\nis left blank, all VMs within the organization will receive the rule.",
                },
              },
              description:
                "Represents a rule that describes one or more match conditions along with\nthe action to be taken when traffic matches this condition (allow or deny).",
              additionalProperties: true,
            },
            description:
              "A list of packet mirroring rules that belong to this policy.",
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
        selfLink: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        shortName: {
          name: "Short Name",
          description:
            "User-provided name of the Organization firewall policy.",
          type: {
            type: "string",
            description:
              "User-provided name of the Organization firewall policy. The name should be\nunique in the organization in which the firewall policy is created.\nThis field is not applicable to network firewall policies.\nThis name must be set on creation and cannot be changed. The name must be\n1-63 characters long, and comply with RFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. For Organization Firewall Policies it's a\n[Output Only] numeric ID allocated by Google Cloud which uniquely\nidentifies the Organization Firewall Policy.",
          },
          required: false,
        },
        region: {
          name: "Region",
          description:
            "[Output Only] URL of the region where the regional firewall policy resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional firewall policy resides.\nThis field is not applicable to global firewall policies.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
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
        let path = `locations/global/firewallPolicies`;

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

        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.ruleTupleCount !== undefined)
          requestBody.ruleTupleCount = input.event.inputConfig.ruleTupleCount;
        if (input.event.inputConfig.parent !== undefined)
          requestBody.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.associations !== undefined)
          requestBody.associations = input.event.inputConfig.associations;
        if (input.event.inputConfig.policyType !== undefined)
          requestBody.policyType = input.event.inputConfig.policyType;
        if (input.event.inputConfig.fingerprint !== undefined)
          requestBody.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.rules !== undefined)
          requestBody.rules = input.event.inputConfig.rules;
        if (input.event.inputConfig.packetMirroringRules !== undefined)
          requestBody.packetMirroringRules =
            input.event.inputConfig.packetMirroringRules;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.selfLinkWithId !== undefined)
          requestBody.selfLinkWithId = input.event.inputConfig.selfLinkWithId;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.shortName !== undefined)
          requestBody.shortName = input.event.inputConfig.shortName;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;

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

export default firewallPoliciesInsert;
