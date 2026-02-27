import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const instanceGroupManagerResizeRequestsList: AppBlock = {
  name: "Instance Group Manager Resize Requests - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Instance Group Manager Resize Requests",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of thezone where the managed instance group is located. The name should conform to RFC1035.",
          type: {
            type: "string",
            description:
              "The name of thezone where the managed instance group is located. The name should conform to RFC1035.",
          },
          required: true,
        },
        instanceGroupManager: {
          name: "Instance Group Manager",
          description:
            "The name of the managed instance group. The name should conform to RFC1035.",
          type: {
            type: "string",
            description:
              "The name of the managed instance group. The name should conform to RFC1035.",
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
        if (input.event.inputConfig.instanceGroupManager !== undefined)
          pathParams["instance_group_manager"] = String(
            input.event.inputConfig.instanceGroupManager,
          );

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
            "/compute/v1/projects/{project}/zones/{zone}/instanceGroupManagers/{instance_group_manager}/resizeRequests",
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
              "Output only. [Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The creation timestamp for this resize request inRFC3339 text format.",
                },
                description: {
                  type: "string",
                  description: "An optional description of this resource.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The resource type, which is alwayscompute#instanceGroupManagerResizeRequest for resize requests.",
                },
                name: {
                  type: "string",
                  description:
                    "The name of this resize request. The name must be 1-63 characters long, and comply withRFC1035.",
                },
                requestedRunDuration: {
                  type: "object",
                  properties: {
                    nanos: {
                      type: "integer",
                      description:
                        "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                    },
                    seconds: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                  },
                  description:
                    'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                  additionalProperties: true,
                },
                resizeBy: {
                  type: "integer",
                  description:
                    "The number of instances to be created by this resize request. The group's target size will be increased by this number. This field cannot be used together with 'instances'.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL for this resize request. The server defines this URL.",
                },
                selfLinkWithId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for this resource with the resource id.",
                },
                state: {
                  type: "string",
                  enum: [
                    "UNDEFINED_STATE",
                    "ACCEPTED",
                    "CANCELLED",
                    "CREATING",
                    "FAILED",
                    "STATE_UNSPECIFIED",
                    "SUCCEEDED",
                  ],
                  description:
                    "Output only. [Output only] Current state of the request. Check the State enum for the list of possible values.",
                },
                status: {
                  type: "object",
                  properties: {
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
                                                description:
                                                  "The URL of the link.",
                                              },
                                            },
                                            description:
                                              "Describes a URL link.",
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
                    lastAttempt: {
                      type: "object",
                      properties: {
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
                      },
                      additionalProperties: true,
                      description:
                        'Output only. [Output only] Information about the last attempt to fulfill the request. The value is temporary since the ResizeRequest can retry, as long as it\'s still active and the last attempt value can either be cleared or replaced with a different error. Since ResizeRequest retries infrequently, the value may be stale and no longer show an active problem. The value is cleared when ResizeRequest transitions to the final state (becomes inactive). If the final state is FAILED the error describing it will be storred in the "error" field only.',
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output only] Status of the request.",
                },
                zone: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL of azone where the resize request is located. Populated only for zonal resize requests.",
                },
              },
              description:
                "InstanceGroupManagerResizeRequest represents a request to create a number of VMs: either immediately or by queuing the request for the specified time. This resize request is nested under InstanceGroupManager and the VMs created by this request are added to the owning InstanceGroupManager.",
              additionalProperties: true,
            },
            description: "A list of resize request resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#instanceGroupManagerResizeRequestList for a list of resize requests.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Output only. [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
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
        description: "[Output Only] A list of resize requests.",
        additionalProperties: true,
      },
    },
  },
};

export default instanceGroupManagerResizeRequestsList;
