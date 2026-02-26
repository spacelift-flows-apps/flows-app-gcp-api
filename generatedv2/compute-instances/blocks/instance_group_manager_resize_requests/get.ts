import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Instance Group Manager Resize Requests - Get",
  description: `Returns the specified Zone resource.`,
  category: "Instance Group Manager Resize Requests",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            'Name of the href="/compute/docs/regions-zones/#available">zone scoping this request. Name should conform to RFC1035.',
          type: {
            type: "string",
          },
          required: true,
        },
        instanceGroupManager: {
          name: "Instance Group Manager",
          description:
            "The name of the managed instance group. Name should conform to RFC1035 or be a resource ID.",
          type: {
            type: "string",
          },
          required: true,
        },
        resizeRequest: {
          name: "Resize Request",
          description:
            "The name of the resize request. Name should conform to RFC1035 or be a resource ID.",
          type: {
            type: "string",
          },
          required: true,
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
        if (input.event.inputConfig.resizeRequest !== undefined)
          pathParams["resize_request"] = String(
            input.event.inputConfig.resizeRequest,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instanceGroupManagers/{instance_group_manager}/resizeRequests/{resize_request}",
          pathParams,
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
                                    description: "The name of the quota limit.",
                                  },
                                  metricName: {
                                    type: "string",
                                    description:
                                      "The Compute Engine quota metric name.",
                                  },
                                  rolloutStatus: {
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
            description: "Output only. [Output only] Status of the request.",
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
    },
  },
};

export default get;
