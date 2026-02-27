import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const zoneOperationsList: AppBlock = {
  name: "Zone Operations - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Zone Operations",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "Name of the zone for request.",
          type: {
            type: "string",
            description: "Name of the zone for request.",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
            description:
              'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
            description:
              "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
            description:
              'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
            description:
              "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "boolean",
            description:
              "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.orderBy !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.orderBy);
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.returnPartialSuccess !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.returnPartialSuccess,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/operations",
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
              "[Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                clientOperationId: {
                  type: "string",
                  description:
                    "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
                },
                creationTimestamp: {
                  type: "string",
                  description: "[Deprecated] This field is deprecated.",
                },
                description: {
                  type: "string",
                  description:
                    "[Output Only] A textual description of the operation, which is set when the operation is created.",
                },
                endTime: {
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
                          errorDetails: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                errorInfo: {
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
                                localizedMessage: {
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
                                quotaInfo: {
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
                                    futureLimit: {
                                      type: "number",
                                      description:
                                        "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                                    },
                                    limit: {
                                      type: "number",
                                      description:
                                        "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                                    },
                                    limitName: {
                                      type: "string",
                                      description:
                                        "The name of the quota limit.",
                                    },
                                    metricName: {
                                      type: "string",
                                      description:
                                        "The Compute Engine quota metric name.",
                                    },
                                    rolloutStatus: {
                                      type: "string",
                                      enum: [
                                        "UNDEFINED_ROLLOUT_STATUS",
                                        "IN_PROGRESS",
                                        "ROLLOUT_STATUS_UNSPECIFIED",
                                      ],
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
                httpErrorMessage: {
                  type: "string",
                  description:
                    "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
                },
                httpErrorStatusCode: {
                  type: "integer",
                  description:
                    "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                insertTime: {
                  type: "string",
                  description:
                    "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
                },
                instancesBulkInsertOperationMetadata: {
                  type: "object",
                  properties: {
                    perLocationStatus: {
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
                operationGroupId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
                },
                operationType: {
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
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                setCommonInstanceMetadataOperationMetadata: {
                  type: "object",
                  properties: {
                    clientOperationId: {
                      type: "string",
                      description: "[Output Only] The client operation id.",
                    },
                    perLocationOperations: {
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
                startTime: {
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
                statusMessage: {
                  type: "string",
                  description:
                    "[Output Only] An optional textual description of the current status of the operation.",
                },
                targetId: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                targetLink: {
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
                        enum: [
                          "UNDEFINED_CODE",
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
            description: "[Output Only] A list of Operation resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always `compute#operations` for Operations resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than `maxResults`, use the `nextPageToken` as a value for the query parameter `pageToken` in the next list request. Subsequent list requests will have their own `nextPageToken` to continue paging through the results.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          warning: {
            type: "object",
            properties: {
              code: {
                type: "string",
                enum: [
                  "UNDEFINED_CODE",
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
        description: "Contains a list of Operation resources.",
        additionalProperties: true,
      },
    },
  },
};

export default zoneOperationsList;
