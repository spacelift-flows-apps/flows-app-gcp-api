import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const addRule: AppBlock = {
  name: "Region Network Firewall Policies - Add Rule",
  description: `Inserts a rule into a security policy.`,
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
        firewall_policy: {
          name: "Firewall Policy",
          description: "Name of the firewall policy to update.",
          type: {
            type: "string",
          },
          required: true,
        },
        action: {
          name: "Action",
          description:
            'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next". Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
          type: {
            type: "string",
            description:
              'The Action to perform when the client connection triggers the rule. Valid actions for firewall rules are: "allow", "deny", "apply_security_profile_group" and "goto_next". Valid actions for packet mirroring rules are: "mirror", "do_not_mirror" and "goto_next".',
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description for this resource.",
          type: {
            type: "string",
            description: "An optional description for this resource.",
          },
          required: false,
        },
        direction: {
          name: "Direction",
          description:
            "The direction in which this rule applies. Check the Direction enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The direction in which this rule applies. Check the Direction enum for the list of possible values.",
          },
          required: false,
        },
        disabled: {
          name: "Disabled",
          description:
            "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
          type: {
            type: "boolean",
            description:
              "Denotes whether the firewall policy rule is disabled. When set to true, the firewall policy rule is not enforced and traffic behaves as if it did not exist. If this is unspecified, the firewall policy rule will be enabled.",
          },
          required: false,
        },
        enable_logging: {
          name: "Enable Logging",
          description:
            'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
          type: {
            type: "boolean",
            description:
              'Denotes whether to enable logging for a particular rule. If logging is enabled, logs will be exported to the configured export destination in Stackdriver. Logs may be exported to BigQuery or Pub/Sub. Note: you cannot enable logging on "goto_next" rules.',
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
          type: {
            type: "string",
            description:
              "Output only. [Output only] Type of the resource. Returnscompute#firewallPolicyRule for firewall rules andcompute#packetMirroringRule for packet mirroring rules.",
          },
          required: false,
        },
        match: {
          name: "Match",
          description:
            "A match condition that incoming traffic is evaluated against. If it evaluates to true, the corresponding 'action' is enforced.",
          type: {
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
          required: false,
        },
        priority: {
          name: "Priority",
          description:
            "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
          type: {
            type: "integer",
            description:
              "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
          },
          required: false,
        },
        rule_name: {
          name: "Rule Name",
          description:
            "An optional name for the rule. This field is not a unique identifier and can be updated.",
          type: {
            type: "string",
            description:
              "An optional name for the rule. This field is not a unique identifier and can be updated.",
          },
          required: false,
        },
        rule_tuple_count: {
          name: "Rule Tuple Count",
          description:
            "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
          type: {
            type: "integer",
            description:
              "Output only. [Output Only] Calculation of the complexity of a single firewall policy rule.",
          },
          required: false,
        },
        security_profile_group: {
          name: "Security Profile Group",
          description:
            "A fully-qualified URL of a SecurityProfile resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions.",
          type: {
            type: "string",
            description:
              "A fully-qualified URL of a SecurityProfile resource instance. Example: https://networksecurity.googleapis.com/v1/projects/{project}/locations/{location}/securityProfileGroups/my-security-profile-group Must be specified if action is one of 'apply_security_profile_group' or 'mirror'. Cannot be specified for other actions.",
          },
          required: false,
        },
        target_resources: {
          name: "Target Resources",
          description:
            "A list of network resource URLs to which this rule applies.  This field allows you to control which network's VMs get this rule.  If this field is left blank, all VMs within the organization will receive the rule.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of network resource URLs to which this rule applies.  This field allows you to control which network's VMs get this rule.  If this field is left blank, all VMs within the organization will receive the rule.",
          },
          required: false,
        },
        target_secure_tags: {
          name: "Target Secure Tags",
          description:
            "A list of secure tags that controls which instances the firewall rule applies to. If targetSecureTag are specified, then the firewall rule applies only to instances in the VPC network that have one of those EFFECTIVE secure tags, if all the target_secure_tag are in INEFFECTIVE state, then this rule will be ignored.targetSecureTag may not be set at the same time astargetServiceAccounts. If neither targetServiceAccounts nortargetSecureTag are specified, the firewall rule applies to all instances on the specified network. Maximum number of target label tags allowed is 256.",
          type: {
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
          required: false,
        },
        target_service_accounts: {
          name: "Target Service Accounts",
          description:
            "A list of service accounts indicating the sets of instances that are applied with this rule.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of service accounts indicating the sets of instances that are applied with this rule.",
          },
          required: false,
        },
        tls_inspect: {
          name: "Tls Inspect",
          description:
            "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
          type: {
            type: "boolean",
            description:
              "Boolean flag indicating if the traffic should be TLS decrypted. Can be set only if action = 'apply_security_profile_group' and cannot be set for other actions.",
          },
          required: false,
        },
        max_priority: {
          name: "Max Priority",
          description:
            "When rule.priority is not specified, auto choose a unused priority betweenminPriority and maxPriority>. This field is exclusive with rule.priority.",
          type: {
            type: "string",
          },
          required: false,
        },
        min_priority: {
          name: "Min Priority",
          description:
            "When rule.priority is not specified, auto choose a unused priority betweenminPriority and maxPriority>. This field is exclusive with rule.priority.",
          type: {
            type: "string",
          },
          required: false,
        },
        request_id: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.firewall_policy !== undefined)
          pathParams["firewall_policy"] = String(
            input.event.inputConfig.firewall_policy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.max_priority !== undefined)
          queryParams["maxPriority"] = String(
            input.event.inputConfig.max_priority,
          );
        if (input.event.inputConfig.min_priority !== undefined)
          queryParams["minPriority"] = String(
            input.event.inputConfig.min_priority,
          );
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.action !== undefined)
          body.action = input.event.inputConfig.action;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.direction !== undefined)
          body.direction = input.event.inputConfig.direction;
        if (input.event.inputConfig.disabled !== undefined)
          body.disabled = input.event.inputConfig.disabled;
        if (input.event.inputConfig.enable_logging !== undefined)
          body.enable_logging = input.event.inputConfig.enable_logging;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.match !== undefined)
          body.match = input.event.inputConfig.match;
        if (input.event.inputConfig.priority !== undefined)
          body.priority = input.event.inputConfig.priority;
        if (input.event.inputConfig.rule_name !== undefined)
          body.rule_name = input.event.inputConfig.rule_name;
        if (input.event.inputConfig.rule_tuple_count !== undefined)
          body.rule_tuple_count = input.event.inputConfig.rule_tuple_count;
        if (input.event.inputConfig.security_profile_group !== undefined)
          body.security_profile_group =
            input.event.inputConfig.security_profile_group;
        if (input.event.inputConfig.target_resources !== undefined)
          body.target_resources = input.event.inputConfig.target_resources;
        if (input.event.inputConfig.target_secure_tags !== undefined)
          body.target_secure_tags = input.event.inputConfig.target_secure_tags;
        if (input.event.inputConfig.target_service_accounts !== undefined)
          body.target_service_accounts =
            input.event.inputConfig.target_service_accounts;
        if (input.event.inputConfig.tls_inspect !== undefined)
          body.tls_inspect = input.event.inputConfig.tls_inspect;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/firewallPolicies/{firewall_policy}/addRule",
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
          client_operation_id: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creation_timestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          end_time: {
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
                    error_details: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          error_info: {
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
                          localized_message: {
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
                          quota_info: {
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
                              future_limit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limit_name: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metric_name: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rollout_status: {
                                type: "string",
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
          http_error_message: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          http_error_status_code: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insert_time: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instances_bulk_insert_operation_metadata: {
            type: "object",
            properties: {
              per_location_status: {
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
          operation_group_id: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operation_type: {
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
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          set_common_instance_metadata_operation_metadata: {
            type: "object",
            properties: {
              client_operation_id: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              per_location_operations: {
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
          start_time: {
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
          status_message: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          target_id: {
            type: "string",
            description: "64-bit integer as string",
          },
          target_link: {
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

export default addRule;
