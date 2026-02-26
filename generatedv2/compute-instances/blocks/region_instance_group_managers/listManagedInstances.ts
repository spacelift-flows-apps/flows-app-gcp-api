import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listManagedInstances: AppBlock = {
  name: "Region Instance Group Managers - List Managed Instances",
  description: `Lists the instances in the managed instance group and instances that are scheduled to be created. The list includes any current actions that the group has scheduled for its instances. The orderBy query parameter is not supported. The 'pageToken' query parameter is supported only if the group's 'listManagedInstancesResults' field is set to 'PAGINATED'.`,
  category: "Region Instance Group Managers",
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
        instance_group_manager: {
          name: "Instance Group Manager",
          description: "The name of the managed instance group.",
          type: {
            type: "string",
          },
          required: true,
        },
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
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.instance_group_manager !== undefined)
          pathParams["instance_group_manager"] = String(
            input.event.inputConfig.instance_group_manager,
          );

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
        if (input.event.inputConfig.return_partial_success !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.return_partial_success,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/instanceGroupManagers/{instance_group_manager}/listManagedInstances",
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
          managed_instances: {
            type: "array",
            items: {
              type: "object",
              properties: {
                current_action: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The current action that the managed instance group has scheduled for the instance. Possible values:     - NONE The instance is running, and the managed    instance group does not have any scheduled actions for this instance.    - CREATING The managed instance group is creating this    instance. If the group fails to create this instance, it will try again    until it is successful.    - CREATING_WITHOUT_RETRIES The managed instance group    is attempting to create this instance only once. If the group fails    to create this instance, it does not try again and the group'stargetSize value is decreased instead.    - RECREATING The managed instance group is recreating    this instance.    - DELETING The managed instance group is permanently    deleting this instance.    - ABANDONING The managed instance group is abandoning    this instance. The instance will be removed from the instance group    and from any target pools that are associated with this group.    - RESTARTING The managed instance group is restarting    the instance.    - REFRESHING The managed instance group is applying    configuration changes to the instance without stopping it. For example,    the group can update the target pool list for an instance without    stopping that instance.    - VERIFYING The managed instance group has created the    instance and it is in the process of being verified. Check the CurrentAction enum for the list of possible values.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                instance: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL of the instance. The URL can exist even if the instance has not yet been created.",
                },
                instance_health: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      detailed_health_state: {
                        type: "string",
                        description:
                          "Output only. [Output Only] The current detailed instance health state. Check the DetailedHealthState enum for the list of possible values.",
                      },
                      health_check: {
                        type: "string",
                        description:
                          "Output only. [Output Only] The URL for the health check that verifies whether the instance is healthy.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output Only] Health state of the instance per health-check.",
                },
                instance_status: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The status of the instance. This field is empty when the instance does not exist. Check the InstanceStatus enum for the list of possible values.",
                },
                last_attempt: {
                  type: "object",
                  properties: {
                    errors: {
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
                                          description:
                                            "The name of the quota limit.",
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
                        "Output only. [Output Only] Encountered errors during the last attempt to create or delete the instance.",
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output Only] Information about the last attempt to create or delete the instance.",
                },
                name: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The name of the instance. The name always exists even if the instance has not yet been created.",
                },
                preserved_state_from_config: {
                  type: "object",
                  properties: {
                    disks: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved disks defined for this instance. This map is keyed with the device names of the disks.",
                    },
                    external_i_ps: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved external IPs defined for this instance. This map is keyed with the name of the network interface.",
                    },
                    internal_i_ps: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved internal IPs defined for this instance. This map is keyed with the name of the network interface.",
                    },
                    metadata: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved metadata defined for this instance.",
                    },
                  },
                  description: "Preserved state for a given instance.",
                  additionalProperties: true,
                },
                preserved_state_from_policy: {
                  type: "object",
                  properties: {
                    disks: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved disks defined for this instance. This map is keyed with the device names of the disks.",
                    },
                    external_i_ps: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved external IPs defined for this instance. This map is keyed with the name of the network interface.",
                    },
                    internal_i_ps: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved internal IPs defined for this instance. This map is keyed with the name of the network interface.",
                    },
                    metadata: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved metadata defined for this instance.",
                    },
                  },
                  description: "Preserved state for a given instance.",
                  additionalProperties: true,
                },
                properties_from_flexibility_policy: {
                  type: "object",
                  properties: {
                    machine_type: {
                      type: "string",
                      description:
                        "Output only. The machine type to be used for this instance.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output Only] Instance properties selected for this instance resulting from InstanceFlexibilityPolicy.",
                },
                version: {
                  type: "object",
                  properties: {
                    instance_template: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The intended template of the instance. This field is empty when current_action is one of { DELETING, ABANDONING }.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Name of the version.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output Only] Intended version of this instance.",
                },
              },
              description: "A Managed Instance resource.",
              additionalProperties: true,
            },
            description: "A list of managed instances.",
          },
          next_page_token: {
            type: "string",
            description:
              "Output only. [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listManagedInstances;
