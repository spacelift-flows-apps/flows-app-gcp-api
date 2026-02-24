import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionNetworkFirewallPoliciesGetRule: AppBlock = {
  name: "Region Network Firewall Policies - Get Rule",
  description: `Gets a rule of the specified priority.`,
  category: "Region Network Firewall Policies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        firewallPolicy: {
          name: "Firewall Policy",
          description:
            "Name of the firewall policy to which the queried rule belongs.",
          type: {
            type: "string",
          },
          required: true,
        },
        priority: {
          name: "Priority",
          description:
            "The priority of the rule to get from the firewall policy.",
          type: {
            type: "integer",
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
        let path = `projects/{project}/regions/{region}/firewallPolicies/{firewallPolicy}/getRule`;

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
    },
  },
};

export default regionNetworkFirewallPoliciesGetRule;
