import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const patch: AppBlock = {
  name: "Firewalls - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Firewalls",
  inputs: {
    default: {
      config: {
        firewall: {
          name: "Firewall",
          description: "Name of the firewall rule to patch.",
          type: {
            type: "string",
          },
          required: true,
        },
        allowed: {
          name: "Allowed",
          description:
            "The list of ALLOW rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a permitted connection.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                I_p_protocol: {
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
        denied: {
          name: "Denied",
          description:
            "The list of DENY rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a denied connection.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                I_p_protocol: {
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
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this field when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you create the resource.",
          },
          required: false,
        },
        destination_ranges: {
          name: "Destination Ranges",
          description:
            "If destination ranges are specified, the firewall rule applies only to traffic that has destination IP address in these ranges. These ranges must be expressed inCIDR format. Both IPv4 and IPv6 are supported.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If destination ranges are specified, the firewall rule applies only to traffic that has destination IP address in these ranges. These ranges must be expressed inCIDR format. Both IPv4 and IPv6 are supported.",
          },
          required: false,
        },
        direction: {
          name: "Direction",
          description:
            "Direction of traffic to which this firewall applies, either `INGRESS` or `EGRESS`. The default is `INGRESS`. For `EGRESS` traffic, you cannot specify the sourceTags fields. Check the Direction enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Direction of traffic to which this firewall applies, either `INGRESS` or `EGRESS`. The default is `INGRESS`. For `EGRESS` traffic, you cannot specify the sourceTags fields. Check the Direction enum for the list of possible values.",
          },
          required: false,
        },
        disabled: {
          name: "Disabled",
          description:
            "Denotes whether the firewall rule is disabled. When set to true, the firewall rule is not enforced and the network behaves as if it did not exist. If this is unspecified, the firewall rule will be enabled.",
          type: {
            type: "boolean",
            description:
              "Denotes whether the firewall rule is disabled. When set to true, the firewall rule is not enforced and the network behaves as if it did not exist. If this is unspecified, the firewall rule will be enabled.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Always compute#firewall for firewall rules.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#firewall for firewall rules.",
          },
          required: false,
        },
        log_config: {
          name: "Log Config",
          description:
            "This field denotes the logging options for a particular firewall rule. If logging is enabled, logs will be exported to Cloud Logging.",
          type: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description:
                  "This field denotes whether to enable logging for a particular firewall rule.",
              },
              metadata: {
                type: "string",
                description:
                  "This field can only be specified for a particular firewall rule if logging is enabled for that rule. This field denotes whether to include or exclude metadata for firewall logs. Check the Metadata enum for the list of possible values.",
              },
            },
            description: "The available logging options for a firewall rule.",
            additionalProperties: true,
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "URL of the network resource for this firewall rule. If not specified when creating a firewall rule, the default network is used:  global/networks/default  If you choose to specify this field, you can specify the network as a full or partial URL. For example, the following are all valid URLs:     -    https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network    - projects/myproject/global/networks/my-network    - global/networks/default",
          type: {
            type: "string",
            description:
              "URL of the network resource for this firewall rule. If not specified when creating a firewall rule, the default network is used:  global/networks/default  If you choose to specify this field, you can specify the network as a full or partial URL. For example, the following are all valid URLs:     -    https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network    - projects/myproject/global/networks/my-network    - global/networks/default",
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
                  'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional firewall parameters.",
            additionalProperties: true,
          },
          required: false,
        },
        priority: {
          name: "Priority",
          description:
            "Priority for this rule. This is an integer between `0` and `65535`, both inclusive. The default value is `1000`. Relative priorities determine which rule takes effect if multiple rules apply. Lower values indicate higher priority. For example, a rule with priority `0` has higher precedence than a rule with priority `1`. DENY rules take precedence over ALLOW rules if they have equal priority. Note that VPC networks have implied rules with a priority of `65535`. To avoid conflicts with the implied rules, use a priority number less than `65535`.",
          type: {
            type: "integer",
            description:
              "Priority for this rule. This is an integer between `0` and `65535`, both inclusive. The default value is `1000`. Relative priorities determine which rule takes effect if multiple rules apply. Lower values indicate higher priority. For example, a rule with priority `0` has higher precedence than a rule with priority `1`. DENY rules take precedence over ALLOW rules if they have equal priority. Note that VPC networks have implied rules with a priority of `65535`. To avoid conflicts with the implied rules, use a priority number less than `65535`.",
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
        source_ranges: {
          name: "Source Ranges",
          description:
            "If source ranges are specified, the firewall rule applies only to traffic that has a source IP address in these ranges. These ranges must be expressed inCIDR format. One or both of sourceRanges and sourceTags may be set. If both fields are set, the rule applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in thesourceTags field. The connection does not need to match both fields for the rule to apply. Both IPv4 and IPv6 are supported.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source ranges are specified, the firewall rule applies only to traffic that has a source IP address in these ranges. These ranges must be expressed inCIDR format. One or both of sourceRanges and sourceTags may be set. If both fields are set, the rule applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in thesourceTags field. The connection does not need to match both fields for the rule to apply. Both IPv4 and IPv6 are supported.",
          },
          required: false,
        },
        source_service_accounts: {
          name: "Source Service Accounts",
          description:
            "If source service accounts are specified, the firewall rules apply only to traffic originating from an instance with a service account in this list. Source service accounts cannot be used to control traffic to an instance's external IP address because service accounts are associated with an instance, not an IP address.sourceRanges can be set at the same time assourceServiceAccounts. If both are set, the firewall applies to traffic that has a source IP address within the sourceRanges OR a source IP that belongs to an instance with service account listed insourceServiceAccount. The connection does not need to match both fields for the firewall to apply.sourceServiceAccounts cannot be used at the same time assourceTags or targetTags.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source service accounts are specified, the firewall rules apply only to traffic originating from an instance with a service account in this list. Source service accounts cannot be used to control traffic to an instance's external IP address because service accounts are associated with an instance, not an IP address.sourceRanges can be set at the same time assourceServiceAccounts. If both are set, the firewall applies to traffic that has a source IP address within the sourceRanges OR a source IP that belongs to an instance with service account listed insourceServiceAccount. The connection does not need to match both fields for the firewall to apply.sourceServiceAccounts cannot be used at the same time assourceTags or targetTags.",
          },
          required: false,
        },
        source_tags: {
          name: "Source Tags",
          description:
            "If source tags are specified, the firewall rule applies only to traffic with source IPs that match the primary network interfaces of VM instances that have the tag and are in the same VPC network. Source tags cannot be used to control traffic to an instance's external IP address, it only applies to traffic between instances in the same virtual network. Because tags are associated with instances, not IP addresses. One or both of sourceRanges and sourceTags may be set. If both fields are set, the firewall applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in the sourceTags field. The connection does not need to match both fields for the firewall to apply.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source tags are specified, the firewall rule applies only to traffic with source IPs that match the primary network interfaces of VM instances that have the tag and are in the same VPC network. Source tags cannot be used to control traffic to an instance's external IP address, it only applies to traffic between instances in the same virtual network. Because tags are associated with instances, not IP addresses. One or both of sourceRanges and sourceTags may be set. If both fields are set, the firewall applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in the sourceTags field. The connection does not need to match both fields for the firewall to apply.",
          },
          required: false,
        },
        target_service_accounts: {
          name: "Target Service Accounts",
          description:
            "A list of service accounts indicating sets of instances located in the network that may make network connections as specified inallowed[].targetServiceAccounts cannot be used at the same time astargetTags or sourceTags. If neither targetServiceAccounts nor targetTags are specified, the firewall rule applies to all instances on the specified network.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of service accounts indicating sets of instances located in the network that may make network connections as specified inallowed[].targetServiceAccounts cannot be used at the same time astargetTags or sourceTags. If neither targetServiceAccounts nor targetTags are specified, the firewall rule applies to all instances on the specified network.",
          },
          required: false,
        },
        target_tags: {
          name: "Target Tags",
          description:
            "A list of tags that controls which instances the firewall rule applies to. If targetTags are specified, then the firewall rule applies only to instances in the VPC network that have one of those tags. If no targetTags are specified, the firewall rule applies to all instances on the specified network.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of tags that controls which instances the firewall rule applies to. If targetTags are specified, then the firewall rule applies only to instances in the VPC network that have one of those tags. If no targetTags are specified, the firewall rule applies to all instances on the specified network.",
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
        if (input.event.inputConfig.firewall !== undefined)
          pathParams["firewall"] = String(input.event.inputConfig.firewall);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.allowed !== undefined)
          body.allowed = input.event.inputConfig.allowed;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.denied !== undefined)
          body.denied = input.event.inputConfig.denied;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.destination_ranges !== undefined)
          body.destination_ranges = input.event.inputConfig.destination_ranges;
        if (input.event.inputConfig.direction !== undefined)
          body.direction = input.event.inputConfig.direction;
        if (input.event.inputConfig.disabled !== undefined)
          body.disabled = input.event.inputConfig.disabled;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.log_config !== undefined)
          body.log_config = input.event.inputConfig.log_config;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.network !== undefined)
          body.network = input.event.inputConfig.network;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.priority !== undefined)
          body.priority = input.event.inputConfig.priority;
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;
        if (input.event.inputConfig.source_ranges !== undefined)
          body.source_ranges = input.event.inputConfig.source_ranges;
        if (input.event.inputConfig.source_service_accounts !== undefined)
          body.source_service_accounts =
            input.event.inputConfig.source_service_accounts;
        if (input.event.inputConfig.source_tags !== undefined)
          body.source_tags = input.event.inputConfig.source_tags;
        if (input.event.inputConfig.target_service_accounts !== undefined)
          body.target_service_accounts =
            input.event.inputConfig.target_service_accounts;
        if (input.event.inputConfig.target_tags !== undefined)
          body.target_tags = input.event.inputConfig.target_tags;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/global/firewalls/{firewall}",
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

export default patch;
