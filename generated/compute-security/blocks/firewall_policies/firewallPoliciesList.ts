import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const firewallPoliciesList: AppBlock = {
  name: "Firewall Policies - List",
  description: `Lists all the policies that have been configured for the specified folder or organization.`,
  category: "Firewall Policies",
  inputs: {
    default: {
      config: {
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        parentId: {
          name: "Parent ID",
          description:
            'Parent ID for this request. The ID can be either be "folders/[FOLDER_ID]"\nif the parent is a folder or "organizations/[ORGANIZATION_ID]" if the\nparent is an organization.',
          type: {
            type: "string",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
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
        let path = `locations/global/firewallPolicies`;

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
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description:
                    "[Output only] Type of the resource. Alwayscompute#firewallPolicyfor firewall policies",
                },
                ruleTupleCount: {
                  type: "integer",
                  description:
                    "[Output Only] Total count of all firewall policy rule tuples. A firewall\npolicy can not exceed a set number of tuples. (Format: int32)",
                },
                parent: {
                  type: "string",
                  description:
                    "[Output Only] The parent of the firewall policy.\nThis field is not applicable to network firewall policies.",
                },
                associations: {
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
                policyType: {
                  type: "string",
                  enum: ["RDMA_ROCE_POLICY", "VPC_POLICY"],
                  description:
                    "The type of the firewall policy. This field can be eitherVPC_POLICY or RDMA_ROCE_POLICY.\n\nNote: if not specified then VPC_POLICY will be used.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Specifies a fingerprint for this resource, which is essentially a hash of\nthe metadata's contents and used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update metadata. You must always provide an\nup-to-date fingerprint hash in order to update or change metadata,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make get() request to the\nfirewall policy. (Format: byte)",
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
                    'A list of rules that belong to this policy.\nThere must always be a default rule (rule with priority 2147483647 and\nmatch "*"). If no rules are provided when creating a firewall policy, a\ndefault rule with action "allow" will be added.',
                },
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
                    "A list of packet mirroring rules that belong to this policy.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                selfLinkWithId: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for this resource with the resource id.",
                },
                displayName: {
                  type: "string",
                  description:
                    "Deprecated, please use short name instead. User-provided name of the\nOrganization firewall policy. The name should be unique in the organization\nin which the firewall policy is created.\nThis field is not applicable to network firewall policies.\nThis name must be set on creation and cannot be changed.\nThe name must be 1-63 characters long, and comply\nwith RFC1035. Specifically, the name must be 1-63 characters\nlong and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which\nmeans the first character must be a lowercase letter, and all following\ncharacters must be a dash, lowercase letter, or digit, except the last\ncharacter, which cannot be a dash.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                shortName: {
                  type: "string",
                  description:
                    "User-provided name of the Organization firewall policy. The name should be\nunique in the organization in which the firewall policy is created.\nThis field is not applicable to network firewall policies.\nThis name must be set on creation and cannot be changed. The name must be\n1-63 characters long, and comply with RFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. For Organization Firewall Policies it's a\n[Output Only] numeric ID allocated by Google Cloud which uniquely\nidentifies the Organization Firewall Policy.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the regional firewall policy resides.\nThis field is not applicable to global firewall policies.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
              },
              description: "Represents a Firewall Policy resource.",
              additionalProperties: true,
            },
            description: "A list of FirewallPolicy resources.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Alwayscompute#firewallPolicyList for listsof FirewallPolicies",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          warning: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description:
                  "[Output Only] A human-readable description of the warning code.",
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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default firewallPoliciesList;
