import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Firewall Policies - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Firewall Policies",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        max_results: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        parent_id: {
          name: "Parent Id",
          description:
            'Parent ID for this request. The ID can be either be "folders/[FOLDER_ID]" if the parent is a folder or "organizations/[ORGANIZATION_ID]" if the parent is an organization.',
          type: {
            type: "string",
          },
          required: false,
        },
        return_partial_success: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.max_results !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.max_results,
          );
        if (input.event.inputConfig.order_by !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.order_by);
        if (input.event.inputConfig.page_token !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.page_token);
        if (input.event.inputConfig.parent_id !== undefined)
          queryParams["parentId"] = String(input.event.inputConfig.parent_id);
        if (input.event.inputConfig.return_partial_success !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.return_partial_success,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "/compute/v1/locations/global/firewallPolicies",
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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                associations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      attachment_target: {
                        type: "string",
                        description:
                          "The target that the firewall policy is attached to.",
                      },
                      display_name: {
                        type: "string",
                        description:
                          "[Output Only] Deprecated, please use short name instead. The display name of the firewall policy of the association.",
                      },
                      firewall_policy_id: {
                        type: "string",
                        description:
                          "Output only. [Output Only] The firewall policy ID of the association.",
                      },
                      name: {
                        type: "string",
                        description: "The name for an association.",
                      },
                      short_name: {
                        type: "string",
                        description:
                          "Output only. [Output Only] The short name of the firewall policy of the association.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "A list of associations that belong to this firewall policy.",
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
                display_name: {
                  type: "string",
                  description:
                    "Deprecated, please use short name instead. User-provided name of the Organization firewall policy. The name should be unique in the organization in which the firewall policy is created. This field is not applicable to network firewall policies. This name must be set on creation and cannot be changed. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Specifies a fingerprint for this resource, which is essentially a hash of the metadata's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make get() request to the firewall policy.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output only] Type of the resource. Alwayscompute#firewallPolicyfor firewall policies",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. For Organization Firewall Policies it's a [Output Only] numeric ID allocated by Google Cloud which uniquely identifies the Organization Firewall Policy.",
                },
                packet_mirroring_rules: {
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
                        description:
                          "The direction in which this rule applies. Check the Direction enum for the list of possible values.",
                      },
                      disabled: {
                        type: "boolean",
                        description:
                          "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
                      },
                      enable_logging: {
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
                          dest_address_groups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
                          },
                          dest_fqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
                          },
                          dest_ip_ranges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
                          },
                          dest_network_context: {
                            type: "string",
                            description:
                              "Network context of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkContext enum for the list of possible values.",
                          },
                          dest_network_type: {
                            type: "string",
                            description:
                              "Network type of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkType enum for the list of possible values.",
                          },
                          dest_region_codes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
                          },
                          dest_threat_intelligences: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
                          },
                          layer4_configs: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                ip_protocol: {
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
                          src_address_groups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
                          },
                          src_fqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
                          },
                          src_ip_ranges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
                          },
                          src_network_context: {
                            type: "string",
                            description:
                              "Network context of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkContext enum for the list of possible values.",
                          },
                          src_network_type: {
                            type: "string",
                            description:
                              "Network type of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkType enum for the list of possible values.",
                          },
                          src_networks: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Networks of the traffic source. It can be either a full or partial url.",
                          },
                          src_region_codes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
                          },
                          src_secure_tags: {
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
                                  description:
                                    "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
                          },
                          src_threat_intelligences: {
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
                      rule_name: {
                        type: "string",
                        description:
                          "An optional name for the rule. This field is not a unique identifier and can be updated.",
                      },
                      rule_tuple_count: {
                        type: "integer",
                        description:
                          "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
                      },
                      security_profile_group: {
                        type: "string",
                        description:
                          "A fully-qualified URL of a SecurityProfile resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions.",
                      },
                      target_resources: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of network resource URLs to which this rule applies.  This field allows you to control which network's VMs get this rule.  If this field is left blank, all VMs within the organization will receive the rule.",
                      },
                      target_secure_tags: {
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
                              description:
                                "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                            },
                          },
                          additionalProperties: true,
                        },
                        description:
                          "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
                      },
                      target_service_accounts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of service accounts indicating the sets of instances that are applied with this rule.",
                      },
                      tls_inspect: {
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
                    "A list of packet mirroring rules that belong to this policy.",
                },
                parent: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The parent of the firewall policy. This field is not applicable to network firewall policies.",
                },
                policy_type: {
                  type: "string",
                  description:
                    "The type of the firewall policy. This field can be eitherVPC_POLICY or RDMA_ROCE_POLICY.  Note: if not specified then VPC_POLICY will be used. Check the PolicyType enum for the list of possible values.",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the region where the regional firewall policy resides. This field is not applicable to global firewall policies. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
                },
                rule_tuple_count: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] Total count of all firewall policy rule tuples. A firewall policy can not exceed a set number of tuples.",
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
                        description:
                          "The direction in which this rule applies. Check the Direction enum for the list of possible values.",
                      },
                      disabled: {
                        type: "boolean",
                        description:
                          "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
                      },
                      enable_logging: {
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
                          dest_address_groups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic destination. Maximum number of destination address groups is 10.",
                          },
                          dest_fqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic destination. Maximum number of destination fqdn allowed is 100.",
                          },
                          dest_ip_ranges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of destination CIDR IP ranges allowed is 5000.",
                          },
                          dest_network_context: {
                            type: "string",
                            description:
                              "Network context of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkContext enum for the list of possible values.",
                          },
                          dest_network_type: {
                            type: "string",
                            description:
                              "Network type of the traffic destination. Allowed values are:        - UNSPECIFIED      - INTERNET      - NON_INTERNET Check the DestNetworkType enum for the list of possible values.",
                          },
                          dest_region_codes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for destination of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of dest region codes allowed is 5000.',
                          },
                          dest_threat_intelligences: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Names of Network Threat Intelligence lists. The IPs in these lists will be matched against traffic destination.",
                          },
                          layer4_configs: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                ip_protocol: {
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
                          src_address_groups: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Address groups which should be matched against the traffic source. Maximum number of source address groups is 10.",
                          },
                          src_fqdns: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Fully Qualified Domain Name (FQDN) which should be matched against traffic source. Maximum number of source fqdn allowed is 100.",
                          },
                          src_ip_ranges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "CIDR IP address range. Maximum number of source CIDR IP ranges allowed is 5000.",
                          },
                          src_network_context: {
                            type: "string",
                            description:
                              "Network context of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkContext enum for the list of possible values.",
                          },
                          src_network_type: {
                            type: "string",
                            description:
                              "Network type of the traffic source. Allowed values are:        - UNSPECIFIED      - INTERNET      - INTRA_VPC      - NON_INTERNET      - VPC_NETWORKS Check the SrcNetworkType enum for the list of possible values.",
                          },
                          src_networks: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Networks of the traffic source. It can be either a full or partial url.",
                          },
                          src_region_codes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Region codes whose IP addresses will be used to match for source of traffic. Should be specified as 2 letter country code defined as per ISO 3166 alpha-2 country codes. ex."US" Maximum number of source region codes allowed is 5000.',
                          },
                          src_secure_tags: {
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
                                  description:
                                    "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "List of secure tag values, which should be matched at the source of the traffic. For INGRESS rule, if all the srcSecureTag are INEFFECTIVE, and there is no srcIpRange, this rule will be ignored. Maximum number of source tag values allowed is 256.",
                          },
                          src_threat_intelligences: {
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
                      rule_name: {
                        type: "string",
                        description:
                          "An optional name for the rule. This field is not a unique identifier and can be updated.",
                      },
                      rule_tuple_count: {
                        type: "integer",
                        description:
                          "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
                      },
                      security_profile_group: {
                        type: "string",
                        description:
                          "A fully-qualified URL of a SecurityProfile resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions.",
                      },
                      target_resources: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of network resource URLs to which this rule applies.  This field allows you to control which network's VMs get this rule.  If this field is left blank, all VMs within the organization will receive the rule.",
                      },
                      target_secure_tags: {
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
                              description:
                                "Output only. [Output Only] State of the secure tag, either `EFFECTIVE` or `INEFFECTIVE`. A secure tag is `INEFFECTIVE` when it is deleted or its network is deleted. Check the State enum for the list of possible values.",
                            },
                          },
                          additionalProperties: true,
                        },
                        description:
                          "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
                      },
                      target_service_accounts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of service accounts indicating the sets of instances that are applied with this rule.",
                      },
                      tls_inspect: {
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
                    'A list of rules that belong to this policy. There must always be a default rule (rule with priority 2147483647 and match "*"). If no rules are provided when creating a firewall policy, a default rule with action "allow" will be added.',
                },
                self_link: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                self_link_with_id: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for this resource with the resource id.",
                },
                short_name: {
                  type: "string",
                  description:
                    "User-provided name of the Organization firewall policy. The name should be unique in the organization in which the firewall policy is created. This field is not applicable to network firewall policies. This name must be set on creation and cannot be changed. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
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
              "Output only. [Output Only] Type of resource. Alwayscompute#firewallPolicyList for listsof FirewallPolicies",
          },
          next_page_token: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          warning: {
            type: "object",
            properties: {
              code: {
                type: "string",
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default list;
