import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const patch: AppBlock = {
  name: "Service Attachments - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Service Attachments",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] URL of the region where the service attachment resides. This field applies only to the region resource. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the service attachment resides. This field applies only to the region resource. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          required: false,
        },
        service_attachment: {
          name: "Service Attachment",
          description:
            "The resource id of the ServiceAttachment to patch. It should conform to RFC1035 resource name or be a string form on an unsigned long number.",
          type: {
            type: "string",
          },
          required: true,
        },
        connected_endpoints: {
          name: "Connected Endpoints",
          description:
            "Output only. [Output Only] An array of connections for all the consumers connected to this service attachment.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                consumer_network: {
                  type: "string",
                  description: "The url of the consumer network.",
                },
                endpoint: {
                  type: "string",
                  description: "The url of a connected endpoint.",
                },
                nat_ips: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "NAT IPs of the connected PSC endpoint and those of other endpoints propagated from it.",
                },
                propagated_connection_count: {
                  type: "integer",
                  description:
                    "The number of consumer Network Connectivity Center spokes that the connected Private Service Connect endpoint has propagated to.",
                },
                psc_connection_id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                status: {
                  type: "string",
                  description:
                    "The status of a connected endpoint to this service attachment. Check the Status enum for the list of possible values.",
                },
              },
              description:
                "[Output Only] A connection connected to this service attachment.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] An array of connections for all the consumers connected to this service attachment.",
          },
          required: false,
        },
        connection_preference: {
          name: "Connection Preference",
          description:
            "The connection preference of service attachment. The value can be set to ACCEPT_AUTOMATIC. An ACCEPT_AUTOMATIC service attachment is one that always accepts the connection from consumer forwarding rules. Check the ConnectionPreference enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The connection preference of service attachment. The value can be set to ACCEPT_AUTOMATIC. An ACCEPT_AUTOMATIC service attachment is one that always accepts the connection from consumer forwarding rules. Check the ConnectionPreference enum for the list of possible values.",
          },
          required: false,
        },
        consumer_accept_lists: {
          name: "Consumer Accept Lists",
          description:
            "Specifies which consumer projects or networks are allowed to connect to the service attachment. Each project or network has a connection limit. A given service attachment can manage connections at either the project or network level. Therefore, both the accept and reject lists for a given service attachment must contain either only projects or only networks or only endpoints.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                connection_limit: {
                  type: "integer",
                  description:
                    "The value of the limit to set. For endpoint_url, the limit should be no more than 1.",
                },
                network_url: {
                  type: "string",
                  description:
                    "The network URL for the network to set the limit for.",
                },
                project_id_or_num: {
                  type: "string",
                  description:
                    "The project id or number for the project to set the limit for.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Specifies which consumer projects or networks are allowed to connect to the service attachment. Each project or network has a connection limit. A given service attachment can manage connections at either the project or network level. Therefore, both the accept and reject lists for a given service attachment must contain either only projects or only networks or only endpoints.",
          },
          required: false,
        },
        consumer_reject_lists: {
          name: "Consumer Reject Lists",
          description:
            "Specifies a list of projects or networks that are not allowed to connect to this service attachment. The project can be specified using its project ID or project number and the network can be specified using its URL. A given service attachment can manage connections at either the project or network level. Therefore, both the reject and accept lists for a given service attachment must contain either only projects or only networks.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Specifies a list of projects or networks that are not allowed to connect to this service attachment. The project can be specified using its project ID or project number and the network can be specified using its URL. A given service attachment can manage connections at either the project or network level. Therefore, both the reject and accept lists for a given service attachment must contain either only projects or only networks.",
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
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          required: false,
        },
        domain_names: {
          name: "Domain Names",
          description:
            'If specified, the domain name will be used during the integration between the PSC connected endpoints and the Cloud DNS. For example, this is a valid domain name: "p.mycompany.com.". Current max number of domain names supported is 1.',
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              'If specified, the domain name will be used during the integration between the PSC connected endpoints and the Cloud DNS. For example, this is a valid domain name: "p.mycompany.com.". Current max number of domain names supported is 1.',
          },
          required: false,
        },
        enable_proxy_protocol: {
          name: "Enable Proxy Protocol",
          description:
            "If true, enable the proxy protocol which is for supplying client TCP/IP address data in TCP connections that traverse proxies on their way to destination servers.",
          type: {
            type: "boolean",
            description:
              "If true, enable the proxy protocol which is for supplying client TCP/IP address data in TCP connections that traverse proxies on their way to destination servers.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a ServiceAttachment. An up-to-date fingerprint must be provided in order to patch/update the ServiceAttachment; otherwise, the request will fail with error 412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve the ServiceAttachment.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a ServiceAttachment. An up-to-date fingerprint must be provided in order to patch/update the ServiceAttachment; otherwise, the request will fail with error 412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve the ServiceAttachment.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] The unique identifier for the resource type. The server generates this identifier.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Alwayscompute#serviceAttachment for service attachments.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#serviceAttachment for service attachments.",
          },
          required: false,
        },
        metadata: {
          name: "Metadata",
          description: "Metadata of the service attachment.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Metadata of the service attachment.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        nat_subnets: {
          name: "Nat Subnets",
          description:
            "An array of URLs where each entry is the URL of a subnet provided by the service producer to use for NAT in this service attachment.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "An array of URLs where each entry is the URL of a subnet provided by the service producer to use for NAT in this service attachment.",
          },
          required: false,
        },
        producer_forwarding_rule: {
          name: "Producer Forwarding Rule",
          description:
            "The URL of a forwarding rule with loadBalancingScheme INTERNAL* that is serving the endpoint identified by this service attachment.",
          type: {
            type: "string",
            description:
              "The URL of a forwarding rule with loadBalancingScheme INTERNAL* that is serving the endpoint identified by this service attachment.",
          },
          required: false,
        },
        propagated_connection_limit: {
          name: "Propagated Connection Limit",
          description:
            "The number of consumer spokes that connected Private Service Connect endpoints can be propagated to through Network Connectivity Center. This limit lets the service producer limit how many propagated Private Service Connect connections can be established to this service attachment from a single consumer.  If the connection preference of the service attachment is ACCEPT_MANUAL, the limit applies to each project or network that is listed in the consumer accept list. If the connection preference of the service attachment is ACCEPT_AUTOMATIC, the limit applies to each project that contains a connected endpoint.  If unspecified, the default propagated connection limit is 250.",
          type: {
            type: "integer",
            description:
              "The number of consumer spokes that connected Private Service Connect endpoints can be propagated to through Network Connectivity Center. This limit lets the service producer limit how many propagated Private Service Connect connections can be established to this service attachment from a single consumer.  If the connection preference of the service attachment is ACCEPT_MANUAL, the limit applies to each project or network that is listed in the consumer accept list. If the connection preference of the service attachment is ACCEPT_AUTOMATIC, the limit applies to each project that contains a connected endpoint.  If unspecified, the default propagated connection limit is 250.",
          },
          required: false,
        },
        psc_service_attachment_id: {
          name: "Psc Service Attachment Id",
          description:
            "Output only. [Output Only] An 128-bit global unique ID of the PSC service attachment.",
          type: {
            type: "object",
            properties: {
              high: {
                type: "string",
                description: "64-bit integer as string",
              },
              low: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] An 128-bit global unique ID of the PSC service attachment.",
          },
          required: false,
        },
        reconcile_connections: {
          name: "Reconcile Connections",
          description:
            "This flag determines whether a consumer accept/reject list change can reconcile the statuses of existing ACCEPTED or REJECTED PSC endpoints.       -  If false, connection policy update will only affect existing PENDING     PSC endpoints. Existing ACCEPTED/REJECTED endpoints will remain untouched     regardless how the connection policy is modified .    -  If true,     update will affect both PENDING and ACCEPTED/REJECTED PSC endpoints. For     example, an ACCEPTED PSC endpoint will be moved to REJECTED if its project     is added to the reject list.   For newly created service attachment, this boolean defaults to false.",
          type: {
            type: "boolean",
            description:
              "This flag determines whether a consumer accept/reject list change can reconcile the statuses of existing ACCEPTED or REJECTED PSC endpoints.       -  If false, connection policy update will only affect existing PENDING     PSC endpoints. Existing ACCEPTED/REJECTED endpoints will remain untouched     regardless how the connection policy is modified .    -  If true,     update will affect both PENDING and ACCEPTED/REJECTED PSC endpoints. For     example, an ACCEPTED PSC endpoint will be moved to REJECTED if its project     is added to the reject list.   For newly created service attachment, this boolean defaults to false.",
          },
          required: false,
        },
        self_link: {
          name: "Self Link",
          description:
            "Output only. [Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        target_service: {
          name: "Target Service",
          description:
            "The URL of a service serving the endpoint identified by this service attachment.",
          type: {
            type: "string",
            description:
              "The URL of a service serving the endpoint identified by this service attachment.",
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
        if (input.event.inputConfig.service_attachment !== undefined)
          pathParams["service_attachment"] = String(
            input.event.inputConfig.service_attachment,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.connected_endpoints !== undefined)
          body.connected_endpoints =
            input.event.inputConfig.connected_endpoints;
        if (input.event.inputConfig.connection_preference !== undefined)
          body.connection_preference =
            input.event.inputConfig.connection_preference;
        if (input.event.inputConfig.consumer_accept_lists !== undefined)
          body.consumer_accept_lists =
            input.event.inputConfig.consumer_accept_lists;
        if (input.event.inputConfig.consumer_reject_lists !== undefined)
          body.consumer_reject_lists =
            input.event.inputConfig.consumer_reject_lists;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.domain_names !== undefined)
          body.domain_names = input.event.inputConfig.domain_names;
        if (input.event.inputConfig.enable_proxy_protocol !== undefined)
          body.enable_proxy_protocol =
            input.event.inputConfig.enable_proxy_protocol;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.metadata !== undefined)
          body.metadata = input.event.inputConfig.metadata;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.nat_subnets !== undefined)
          body.nat_subnets = input.event.inputConfig.nat_subnets;
        if (input.event.inputConfig.producer_forwarding_rule !== undefined)
          body.producer_forwarding_rule =
            input.event.inputConfig.producer_forwarding_rule;
        if (input.event.inputConfig.propagated_connection_limit !== undefined)
          body.propagated_connection_limit =
            input.event.inputConfig.propagated_connection_limit;
        if (input.event.inputConfig.psc_service_attachment_id !== undefined)
          body.psc_service_attachment_id =
            input.event.inputConfig.psc_service_attachment_id;
        if (input.event.inputConfig.reconcile_connections !== undefined)
          body.reconcile_connections =
            input.event.inputConfig.reconcile_connections;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;
        if (input.event.inputConfig.target_service !== undefined)
          body.target_service = input.event.inputConfig.target_service;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/serviceAttachments/{service_attachment}",
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
