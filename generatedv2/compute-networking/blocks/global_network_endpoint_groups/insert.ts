import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const insert: AppBlock = {
  name: "Global Network Endpoint Groups - Insert",
  description: `Creates a wire group in the specified project in the given scope using the parameters that are included in the request.`,
  category: "Global Network Endpoint Groups",
  inputs: {
    default: {
      config: {
        annotations: {
          name: "Annotations",
          description:
            "Optional. Metadata defined as annotations on the network endpoint group.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Metadata defined as annotations on the network endpoint group.",
          },
          required: false,
        },
        app_engine: {
          name: "App Engine",
          description:
            "Optional. Only valid when networkEndpointType isSERVERLESS. Only one of cloudRun,appEngine or cloudFunction may be set.",
          type: {
            type: "object",
            properties: {
              service: {
                type: "string",
                description:
                  "Optional serving service.  The service name is case-sensitive and must be 1-63 characters long.  Example value: default, my-service.",
              },
              url_mask: {
                type: "string",
                description:
                  'An URL mask is one of the main components of the Cloud Function.  A template to parse service and version fields from a request URL. URL mask allows for routing to multiple App Engine services without having to create multiple Network Endpoint Groups and backend services.  For example, the request URLsfoo1-dot-appname.appspot.com/v1 andfoo1-dot-appname.appspot.com/v2 can be backed by the same Serverless NEG with URL mask<service>-dot-appname.appspot.com/<version>. The URL mask will parse them to { service = "foo1", version = "v1" } and { service = "foo1", version = "v2" } respectively.',
              },
              version: {
                type: "string",
                description:
                  "Optional serving version.  The version name is case-sensitive and must be 1-100 characters long.  Example value: v1, v2.",
              },
            },
            description:
              "Configuration for an App Engine network endpoint group (NEG). The service is optional, may be provided explicitly or in the URL mask. The version is optional and can only be provided explicitly or in the URL mask when service is present.  Note: App Engine service must be in the same project and located in the same region as the Serverless NEG.",
            additionalProperties: true,
          },
          required: false,
        },
        cloud_function: {
          name: "Cloud Function",
          description:
            "Optional. Only valid when networkEndpointType isSERVERLESS. Only one of cloudRun,appEngine or cloudFunction may be set.",
          type: {
            type: "object",
            properties: {
              function: {
                type: "string",
                description:
                  "A user-defined name of the Cloud Function.  The function name is case-sensitive and must be 1-63 characters long.  Example value: func1.",
              },
              url_mask: {
                type: "string",
                description:
                  'An URL mask is one of the main components of the Cloud Function.  A template to parse function field from a request URL. URL mask allows for routing to multiple Cloud Functions without having to create multiple Network Endpoint Groups and backend services.  For example, request URLs mydomain.com/function1 andmydomain.com/function2 can be backed by the same Serverless NEG with URL mask /<function>. The URL mask will parse them to { function = "function1" } and{ function = "function2" } respectively.',
              },
            },
            description:
              "Configuration for a Cloud Function network endpoint group (NEG). The function must be provided explicitly or in the URL mask.  Note: Cloud Function must be in the same project and located in the same region as the Serverless NEG.",
            additionalProperties: true,
          },
          required: false,
        },
        cloud_run: {
          name: "Cloud Run",
          description:
            "Optional. Only valid when networkEndpointType isSERVERLESS. Only one of cloudRun,appEngine or cloudFunction may be set.",
          type: {
            type: "object",
            properties: {
              service: {
                type: "string",
                description:
                  'Cloud Run service is the main resource of Cloud Run.  The service must be 1-63 characters long, and comply withRFC1035.  Example value: "run-service".',
              },
              tag: {
                type: "string",
                description:
                  'Optional Cloud Run tag represents the "named-revision" to provide additional fine-grained traffic routing information.  The tag must be 1-63 characters long, and comply withRFC1035.  Example value: "revision-0010".',
              },
              url_mask: {
                type: "string",
                description:
                  'An URL mask is one of the main components of the Cloud Function.  A template to parse <service> and<tag> fields from a request URL. URL mask allows for routing to multiple Run services without having to create multiple network endpoint groups and backend services.  For example, request URLs foo1.domain.com/bar1 andfoo1.domain.com/bar2 can be backed by the same Serverless Network Endpoint Group (NEG) with URL mask<tag>.domain.com/<service>. The URL mask will parse them to { service="bar1", tag="foo1" } and { service="bar2", tag="foo2" } respectively.',
              },
            },
            description:
              "Configuration for a Cloud Run network endpoint group (NEG). The service must be provided explicitly or in the URL mask. The tag is optional, may be provided explicitly or in the URL mask.  Note: Cloud Run service must be in the same project and located in the same region as the Serverless NEG.",
            additionalProperties: true,
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
        default_port: {
          name: "Default Port",
          description:
            "The default port used if the port number is not specified in the network endpoint.  Optional. If the network endpoint type is either GCE_VM_IP,SERVERLESS or PRIVATE_SERVICE_CONNECT, this field must not be specified.",
          type: {
            type: "integer",
            description:
              "The default port used if the port number is not specified in the network endpoint.  Optional. If the network endpoint type is either GCE_VM_IP,SERVERLESS or PRIVATE_SERVICE_CONNECT, this field must not be specified.",
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
            "Output only. [Output Only] Type of the resource. Alwayscompute#networkEndpointGroup for network endpoint group.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#networkEndpointGroup for network endpoint group.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "The URL of the network to which all network endpoints in the NEG belong. Uses default project network if unspecified.",
          type: {
            type: "string",
            description:
              "The URL of the network to which all network endpoints in the NEG belong. Uses default project network if unspecified.",
          },
          required: false,
        },
        network_endpoint_type: {
          name: "Network Endpoint Type",
          description:
            "Type of network endpoints in this network endpoint group. Can be one ofGCE_VM_IP, GCE_VM_IP_PORT,NON_GCP_PRIVATE_IP_PORT, INTERNET_FQDN_PORT,INTERNET_IP_PORT, SERVERLESS,PRIVATE_SERVICE_CONNECT, GCE_VM_IP_PORTMAP. Check the NetworkEndpointType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Type of network endpoints in this network endpoint group. Can be one ofGCE_VM_IP, GCE_VM_IP_PORT,NON_GCP_PRIVATE_IP_PORT, INTERNET_FQDN_PORT,INTERNET_IP_PORT, SERVERLESS,PRIVATE_SERVICE_CONNECT, GCE_VM_IP_PORTMAP. Check the NetworkEndpointType enum for the list of possible values.",
          },
          required: false,
        },
        psc_data: {
          name: "Psc Data",
          description:
            "Optional. Only valid when networkEndpointType isPRIVATE_SERVICE_CONNECT.",
          type: {
            type: "object",
            properties: {
              consumer_psc_address: {
                type: "string",
                description:
                  "Output only. [Output Only] Address allocated from given subnetwork for PSC. This IP address acts as a VIP for a PSC NEG, allowing it to act as an endpoint in L7 PSC-XLB.",
              },
              producer_port: {
                type: "integer",
                description:
                  "The psc producer port is used to connect PSC NEG with specific port on the PSC Producer side; should only be used for the PRIVATE_SERVICE_CONNECT NEG type",
              },
              psc_connection_id: {
                type: "string",
                description: "64-bit integer as string",
              },
              psc_connection_status: {
                type: "string",
                description:
                  "Output only. [Output Only] The connection status of the PSC Forwarding Rule. Check the PscConnectionStatus enum for the list of possible values.",
              },
            },
            description:
              "All data that is specifically relevant to only network endpoint groups of type PRIVATE_SERVICE_CONNECT.",
            additionalProperties: true,
          },
          required: false,
        },
        psc_target_service: {
          name: "Psc Target Service",
          description:
            "The target service url used to set up private service connection to a Google API or a PSC Producer Service Attachment. An example value is: asia-northeast3-cloudkms.googleapis.com.  Optional. Only valid when networkEndpointType isPRIVATE_SERVICE_CONNECT.",
          type: {
            type: "string",
            description:
              "The target service url used to set up private service connection to a Google API or a PSC Producer Service Attachment. An example value is: asia-northeast3-cloudkms.googleapis.com.  Optional. Only valid when networkEndpointType isPRIVATE_SERVICE_CONNECT.",
          },
          required: false,
        },
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] The URL of theregion where the network endpoint group is located.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of theregion where the network endpoint group is located.",
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
        size: {
          name: "Size",
          description:
            "Output only. [Output only] Number of network endpoints in the network endpoint group.",
          type: {
            type: "integer",
            description:
              "Output only. [Output only] Number of network endpoints in the network endpoint group.",
          },
          required: false,
        },
        subnetwork: {
          name: "Subnetwork",
          description:
            "Optional URL of the subnetwork to which all network endpoints in the NEG belong.",
          type: {
            type: "string",
            description:
              "Optional URL of the subnetwork to which all network endpoints in the NEG belong.",
          },
          required: false,
        },
        zone: {
          name: "Zone",
          description:
            "Output only. [Output Only] The URL of thezone where the network endpoint group is located.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of thezone where the network endpoint group is located.",
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

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.annotations !== undefined)
          body.annotations = input.event.inputConfig.annotations;
        if (input.event.inputConfig.app_engine !== undefined)
          body.app_engine = input.event.inputConfig.app_engine;
        if (input.event.inputConfig.cloud_function !== undefined)
          body.cloud_function = input.event.inputConfig.cloud_function;
        if (input.event.inputConfig.cloud_run !== undefined)
          body.cloud_run = input.event.inputConfig.cloud_run;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.default_port !== undefined)
          body.default_port = input.event.inputConfig.default_port;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.network !== undefined)
          body.network = input.event.inputConfig.network;
        if (input.event.inputConfig.network_endpoint_type !== undefined)
          body.network_endpoint_type =
            input.event.inputConfig.network_endpoint_type;
        if (input.event.inputConfig.psc_data !== undefined)
          body.psc_data = input.event.inputConfig.psc_data;
        if (input.event.inputConfig.psc_target_service !== undefined)
          body.psc_target_service = input.event.inputConfig.psc_target_service;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;
        if (input.event.inputConfig.size !== undefined)
          body.size = input.event.inputConfig.size;
        if (input.event.inputConfig.subnetwork !== undefined)
          body.subnetwork = input.event.inputConfig.subnetwork;
        if (input.event.inputConfig.zone !== undefined)
          body.zone = input.event.inputConfig.zone;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/global/networkEndpointGroups",
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

export default insert;
