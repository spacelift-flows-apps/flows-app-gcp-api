import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const networksGetEffectiveFirewalls: AppBlock = {
  name: "Networks - Get Effective Firewalls",
  description: `Returns the effective firewalls on a given network.`,
  category: "Networks",
  inputs: {
    default: {
      config: {
        network: {
          name: "Network",
          description: "Name of the network for this request.",
          type: {
            type: "string",
          },
          required: true,
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
        let path = `projects/{project}/global/networks/{network}/getEffectiveFirewalls`;

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
          firewallPolicys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                packetMirroringRules: {
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
                        description:
                          "The direction in which this rule applies.",
                      },
                      description: {
                        type: "string",
                        description:
                          "An optional description for this resource.",
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
                    "[Output Only] The packet mirroring rules that apply to the network.",
                },
                priority: {
                  type: "integer",
                  description:
                    "[Output only] Priority of firewall policy association. Not applicable for\ntype=HIERARCHY. (Format: int32)",
                },
                rules: {
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
                        description:
                          "The direction in which this rule applies.",
                      },
                      description: {
                        type: "string",
                        description:
                          "An optional description for this resource.",
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
                    "[Output Only] The rules that apply to the network.",
                },
                name: {
                  type: "string",
                  description: "[Output Only] The name of the firewall policy.",
                },
                shortName: {
                  type: "string",
                  description:
                    "[Output Only] The short name of the firewall policy.",
                },
                type: {
                  type: "string",
                  enum: ["HIERARCHY", "NETWORK", "SYSTEM", "UNSPECIFIED"],
                  description: "[Output Only] The type of the firewall policy.",
                },
                displayName: {
                  type: "string",
                  description:
                    "[Output Only] Deprecated, please use short name instead. The display name\nof the firewall policy.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] Effective firewalls from firewall policy. It returns Global\nNetwork Firewall Policies and Hierarchical Firewall Policies. UseregionNetworkFirewallPolicies.getEffectiveFirewalls to get\nRegional Network Firewall Policies as well.",
          },
          firewalls: {
            type: "array",
            items: {
              type: "object",
              properties: {
                direction: {
                  type: "string",
                  enum: ["EGRESS", "INGRESS"],
                  description:
                    "Direction of traffic to which this firewall applies, either `INGRESS` or\n`EGRESS`. The default is `INGRESS`. For `EGRESS` traffic, you cannot\nspecify the sourceTags fields.",
                },
                sourceServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source service accounts are specified, the firewall rules apply only to\ntraffic originating from an instance with a service account in this list.\nSource service accounts cannot be used to control traffic to an instance's\nexternal IP address because service accounts are associated with an\ninstance, not an IP address.sourceRanges can be set at the same time assourceServiceAccounts.\nIf both are set, the firewall applies to traffic that\nhas a source IP address within the sourceRanges OR a source\nIP that belongs to an instance with service account listed insourceServiceAccount. The connection does not need to match\nboth fields for the firewall to apply.sourceServiceAccounts cannot be used at the same time assourceTags or targetTags.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                sourceTags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source tags are specified, the firewall rule applies only to traffic\nwith source IPs that match the primary network interfaces of VM instances\nthat have the tag and are in the same VPC network.\nSource tags cannot be used to control traffic to an instance's external IP\naddress, it only applies to traffic between instances in the same virtual\nnetwork. Because tags are associated with instances, not IP addresses.\nOne or both of sourceRanges and sourceTags may be\nset. If both fields are set, the firewall applies to traffic that has a\nsource IP address within sourceRanges OR a source IP from a\nresource with a matching tag listed in the sourceTags\nfield. The connection does not need to match both fields for the\nfirewall to apply.",
                },
                targetTags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of tags that controls which instances the firewall rule\napplies to. If targetTags are specified, then the firewall\nrule applies only to instances in the VPC network that have one of those\ntags. If no targetTags are specified, the firewall rule\napplies to all instances on the specified network.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                network: {
                  type: "string",
                  description:
                    "URL of the network resource for this firewall rule. If not\nspecified when creating a firewall rule, the default network\nis used:\n\nglobal/networks/default\n\nIf you choose to specify this field, you can specify the network as a full \nor partial URL. For example, the following are all valid URLs: \n   \n   - \n   https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network \n   - projects/myproject/global/networks/my-network \n   - global/networks/default",
                },
                disabled: {
                  type: "boolean",
                  description:
                    "Denotes whether the firewall rule is disabled. When set to true, the\nfirewall rule is not enforced and the network behaves as if it did not\nexist. If this is unspecified, the firewall rule will be enabled.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always compute#firewall\nfor firewall rules.",
                },
                params: {
                  type: "object",
                  properties: {
                    resourceManagerTags: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.',
                    },
                  },
                  description: "Additional firewall parameters.",
                  additionalProperties: true,
                },
                logConfig: {
                  type: "object",
                  properties: {
                    enable: {
                      type: "boolean",
                      description:
                        "This field denotes whether to enable logging for a particular firewall\nrule.",
                    },
                    metadata: {
                      type: "string",
                      enum: ["EXCLUDE_ALL_METADATA", "INCLUDE_ALL_METADATA"],
                      description:
                        "This field can only be specified for a particular firewall rule if\nlogging is enabled for that rule. This field denotes whether to include\nor exclude metadata for firewall logs.",
                    },
                  },
                  description:
                    "The available logging options for a firewall rule.",
                  additionalProperties: true,
                },
                destinationRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If destination ranges are specified, the firewall rule applies only to\ntraffic that has destination IP address in these ranges. These ranges must\nbe expressed inCIDR format. Both IPv4 and IPv6 are supported.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this field when you\ncreate the resource.",
                },
                sourceRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If source ranges are specified, the firewall rule applies only to traffic\nthat has a source IP address in these ranges. These ranges must be\nexpressed inCIDR format. One or both of sourceRanges\nand sourceTags may be set.\nIf both fields are set, the rule applies to traffic that has a\nsource IP address within sourceRanges OR a source IP\nfrom a resource with a matching tag listed in thesourceTags field. The connection does not need to match\nboth fields for the rule to\napply. Both IPv4 and IPv6 are supported.",
                },
                denied: {
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
                          'An optional list of ports to which this rule applies.\nThis field is only applicable for the UDP or TCP protocol.\nEach entry must be either an integer or a range.\nIf not specified, this rule applies to connections through any port.\n\nExample inputs include: ["22"], ["80","443"],\nand ["12345-12349"].',
                      },
                      IPProtocol: {
                        type: "string",
                        description:
                          "The IP protocol to which this rule applies. The protocol type is\nrequired when creating a firewall rule. This value can either be one of the\nfollowing well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The list of DENY rules specified by this firewall. Each rule specifies a\nprotocol and port-range tuple that describes a denied connection.",
                },
                targetServiceAccounts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of service accounts indicating sets of instances located in the\nnetwork that may make network connections as specified inallowed[].targetServiceAccounts cannot be used at the same time astargetTags or sourceTags.\nIf neither targetServiceAccounts nor targetTags\nare specified, the firewall rule applies to all instances on the specified\nnetwork.",
                },
                allowed: {
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
                          'An optional list of ports to which this rule applies.\nThis field is only applicable for the UDP or TCP protocol.\nEach entry must be either an integer or a range.\nIf not specified, this rule applies to connections through any port.\n\nExample inputs include: ["22"], ["80","443"],\nand ["12345-12349"].',
                      },
                      IPProtocol: {
                        type: "string",
                        description:
                          "The IP protocol to which this rule applies. The protocol type is\nrequired when creating a firewall rule. This value can either be one of the\nfollowing well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The list of ALLOW rules specified by this firewall. Each rule specifies a\nprotocol and port-range tuple that describes a permitted connection.",
                },
                priority: {
                  type: "integer",
                  description:
                    "Priority for this rule.\nThis is an integer between `0` and `65535`, both inclusive.\nThe default value is `1000`.\nRelative priorities determine which rule takes effect if multiple rules\napply. Lower values indicate higher priority. For example, a rule with\npriority `0` has higher precedence than a rule with priority `1`.\nDENY rules take precedence over ALLOW rules if they have equal priority.\nNote that VPC networks have implied\nrules with a priority of `65535`. To avoid conflicts with the implied\nrules, use a priority number less than `65535`. (Format: int32)",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character\nmust be a lowercase letter, and all following characters (except for the\nlast character) must be a dash, lowercase letter, or digit. The last\ncharacter must be a lowercase letter or digit.",
                },
              },
              description:
                "Represents a Firewall Rule resource.\n\nFirewall rules allow or deny ingress traffic to, and egress traffic from your\ninstances. For more information, readFirewall rules.",
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

export default networksGetEffectiveFirewalls;
