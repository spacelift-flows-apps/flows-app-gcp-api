import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const firewallPoliciesGetRule: AppBlock = {
  name: "Firewall Policies - Get Rule",
  description: `Gets a rule at the specified priority.`,
  category: "Firewall Policies",
  inputs: {
    default: {
      config: {
        firewallPolicy: {
          name: "Firewall Policy",
          description:
            "Name of the firewall policy to which the queried rule belongs.",
          type: {
            type: "string",
            description:
              "Name of the firewall policy to which the queried rule belongs.",
          },
          required: true,
        },
        priority: {
          name: "Priority",
          description:
            "The priority of the rule to get from the firewall policy.",
          type: {
            type: "integer",
            description:
              "The priority of the rule to get from the firewall policy.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.firewallPolicy !== undefined)
          pathParams["firewall_policy"] = String(
            input.event.inputConfig.firewallPolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.priority !== undefined)
          queryParams["priority"] = String(input.event.inputConfig.priority);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/locations/global/firewallPolicies/{firewall_policy}/getRule",
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
          action: {
            type: "string",
            description:
              'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next". Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
          },
          description: {
            type: "string",
            description: "An optional description for this resource.",
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
                      enum: ["UNDEFINED_STATE", "EFFECTIVE", "INEFFECTIVE"],
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
                  enum: ["UNDEFINED_STATE", "EFFECTIVE", "INEFFECTIVE"],
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
    },
  },
};

export default firewallPoliciesGetRule;
