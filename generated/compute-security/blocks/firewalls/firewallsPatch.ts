import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const firewallsPatch: AppBlock = {
  name: "Firewalls - Patch",
  description: `Updates the specified firewall rule with the data included in the request.`,
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
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        direction: {
          name: "Direction",
          description:
            "Direction of traffic to which this firewall applies, either 'INGRESS' or 'EGRESS'.",
          type: {
            type: "string",
            enum: ["EGRESS", "INGRESS"],
            description:
              "Direction of traffic to which this firewall applies, either `INGRESS` or\n`EGRESS`. The default is `INGRESS`. For `EGRESS` traffic, you cannot\nspecify the sourceTags fields.",
          },
          required: false,
        },
        sourceServiceAccounts: {
          name: "Source Service Accounts",
          description:
            "If source service accounts are specified, the firewall rules apply only to traffic originating from an instance with a service account in this list.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source service accounts are specified, the firewall rules apply only to\ntraffic originating from an instance with a service account in this list.\nSource service accounts cannot be used to control traffic to an instance's\nexternal IP address because service accounts are associated with an\ninstance, not an IP address.sourceRanges can be set at the same time assourceServiceAccounts.\nIf both are set, the firewall applies to traffic that\nhas a source IP address within the sourceRanges OR a source\nIP that belongs to an instance with service account listed insourceServiceAccount. The connection does not need to match\nboth fields for the firewall to apply.sourceServiceAccounts cannot be used at the same time assourceTags or targetTags.",
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
        sourceTags: {
          name: "Source Tags",
          description:
            "If source tags are specified, the firewall rule applies only to traffic with source IPs that match the primary network interfaces of VM instances that have the tag and are in the same VPC network.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source tags are specified, the firewall rule applies only to traffic\nwith source IPs that match the primary network interfaces of VM instances\nthat have the tag and are in the same VPC network.\nSource tags cannot be used to control traffic to an instance's external IP\naddress, it only applies to traffic between instances in the same virtual\nnetwork. Because tags are associated with instances, not IP addresses.\nOne or both of sourceRanges and sourceTags may be\nset. If both fields are set, the firewall applies to traffic that has a\nsource IP address within sourceRanges OR a source IP from a\nresource with a matching tag listed in the sourceTags\nfield. The connection does not need to match both fields for the\nfirewall to apply.",
          },
          required: false,
        },
        targetTags: {
          name: "Target Tags",
          description:
            "A list of tags that controls which instances the firewall rule applies to.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of tags that controls which instances the firewall rule\napplies to. If targetTags are specified, then the firewall\nrule applies only to instances in the VPC network that have one of those\ntags. If no targetTags are specified, the firewall rule\napplies to all instances on the specified network.",
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
        network: {
          name: "Network",
          description: "URL of the network resource for this firewall rule.",
          type: {
            type: "string",
            description:
              "URL of the network resource for this firewall rule. If not\nspecified when creating a firewall rule, the default network\nis used:\n\nglobal/networks/default\n\nIf you choose to specify this field, you can specify the network as a full \nor partial URL. For example, the following are all valid URLs: \n   \n   - \n   https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network \n   - projects/myproject/global/networks/my-network \n   - global/networks/default",
          },
          required: false,
        },
        disabled: {
          name: "Disabled",
          description: "Denotes whether the firewall rule is disabled.",
          type: {
            type: "boolean",
            description:
              "Denotes whether the firewall rule is disabled. When set to true, the\nfirewall rule is not enforced and the network behaves as if it did not\nexist. If this is unspecified, the firewall rule will be enabled.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#firewall\nfor firewall rules.",
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
                  'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional firewall parameters.",
            additionalProperties: true,
          },
          required: false,
        },
        logConfig: {
          name: "Log Config",
          description:
            "This field denotes the logging options for a particular firewall rule.",
          type: {
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
            description: "The available logging options for a firewall rule.",
            additionalProperties: true,
          },
          required: false,
        },
        destinationRanges: {
          name: "Destination Ranges",
          description:
            "If destination ranges are specified, the firewall rule applies only to traffic that has destination IP address in these ranges.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If destination ranges are specified, the firewall rule applies only to\ntraffic that has destination IP address in these ranges. These ranges must\nbe expressed inCIDR format. Both IPv4 and IPv6 are supported.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you\ncreate the resource.",
          },
          required: false,
        },
        sourceRanges: {
          name: "Source Ranges",
          description:
            "If source ranges are specified, the firewall rule applies only to traffic that has a source IP address in these ranges.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source ranges are specified, the firewall rule applies only to traffic\nthat has a source IP address in these ranges. These ranges must be\nexpressed inCIDR format. One or both of sourceRanges\nand sourceTags may be set.\nIf both fields are set, the rule applies to traffic that has a\nsource IP address within sourceRanges OR a source IP\nfrom a resource with a matching tag listed in thesourceTags field. The connection does not need to match\nboth fields for the rule to\napply. Both IPv4 and IPv6 are supported.",
          },
          required: false,
        },
        denied: {
          name: "Denied",
          description: "The list of DENY rules specified by this firewall.",
          type: {
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
          required: false,
        },
        targetServiceAccounts: {
          name: "Target Service Accounts",
          description:
            "A list of service accounts indicating sets of instances located in the network that may make network connections as specified inallowed[].",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of service accounts indicating sets of instances located in the\nnetwork that may make network connections as specified inallowed[].targetServiceAccounts cannot be used at the same time astargetTags or sourceTags.\nIf neither targetServiceAccounts nor targetTags\nare specified, the firewall rule applies to all instances on the specified\nnetwork.",
          },
          required: false,
        },
        allowed: {
          name: "Allowed",
          description: "The list of ALLOW rules specified by this firewall.",
          type: {
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
          required: false,
        },
        priority: {
          name: "Priority",
          description: "Priority for this rule.",
          type: {
            type: "integer",
            description:
              "Priority for this rule.\nThis is an integer between `0` and `65535`, both inclusive.\nThe default value is `1000`.\nRelative priorities determine which rule takes effect if multiple rules\napply. Lower values indicate higher priority. For example, a rule with\npriority `0` has higher precedence than a rule with priority `1`.\nDENY rules take precedence over ALLOW rules if they have equal priority.\nNote that VPC networks have implied\nrules with a priority of `65535`. To avoid conflicts with the implied\nrules, use a priority number less than `65535`. (Format: int32)",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character\nmust be a lowercase letter, and all following characters (except for the\nlast character) must be a dash, lowercase letter, or digit. The last\ncharacter must be a lowercase letter or digit.",
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
        let path = `projects/{project}/global/firewalls/{firewall}`;

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

        if (input.event.inputConfig.direction !== undefined)
          requestBody.direction = input.event.inputConfig.direction;
        if (input.event.inputConfig.sourceServiceAccounts !== undefined)
          requestBody.sourceServiceAccounts =
            input.event.inputConfig.sourceServiceAccounts;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.sourceTags !== undefined)
          requestBody.sourceTags = input.event.inputConfig.sourceTags;
        if (input.event.inputConfig.targetTags !== undefined)
          requestBody.targetTags = input.event.inputConfig.targetTags;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.network !== undefined)
          requestBody.network = input.event.inputConfig.network;
        if (input.event.inputConfig.disabled !== undefined)
          requestBody.disabled = input.event.inputConfig.disabled;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.logConfig !== undefined)
          requestBody.logConfig = input.event.inputConfig.logConfig;
        if (input.event.inputConfig.destinationRanges !== undefined)
          requestBody.destinationRanges =
            input.event.inputConfig.destinationRanges;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.sourceRanges !== undefined)
          requestBody.sourceRanges = input.event.inputConfig.sourceRanges;
        if (input.event.inputConfig.denied !== undefined)
          requestBody.denied = input.event.inputConfig.denied;
        if (input.event.inputConfig.targetServiceAccounts !== undefined)
          requestBody.targetServiceAccounts =
            input.event.inputConfig.targetServiceAccounts;
        if (input.event.inputConfig.allowed !== undefined)
          requestBody.allowed = input.event.inputConfig.allowed;
        if (input.event.inputConfig.priority !== undefined)
          requestBody.priority = input.event.inputConfig.priority;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;

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

export default firewallsPatch;
