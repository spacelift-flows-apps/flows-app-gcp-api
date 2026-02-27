import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const resourcePoliciesList: AppBlock = {
  name: "Resource Policies - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Resource Policies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
            description: "Name of the region for this request.",
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
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);

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
            "/compute/v1/projects/{project}/regions/{region}/resourcePolicies",
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
          etag: {
            type: "string",
          },
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
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                description: {
                  type: "string",
                },
                diskConsistencyGroupPolicy: {
                  type: "object",
                  properties: {},
                  description: "Resource policy for disk consistency groups.",
                  additionalProperties: true,
                },
                groupPlacementPolicy: {
                  type: "object",
                  properties: {
                    availabilityDomainCount: {
                      type: "integer",
                      description:
                        "The number of availability domains to spread instances across. If two instances are in different availability domain, they are not in the same low latency network.",
                    },
                    collocation: {
                      type: "string",
                      enum: [
                        "UNDEFINED_COLLOCATION",
                        "COLLOCATED",
                        "UNSPECIFIED_COLLOCATION",
                      ],
                      description:
                        "Specifies network collocation Check the Collocation enum for the list of possible values.",
                    },
                    gpuTopology: {
                      type: "string",
                      description:
                        "Specifies the shape of the GPU slice, in slice based GPU families eg. A4X.",
                    },
                    vmCount: {
                      type: "integer",
                      description:
                        "Number of VMs in this placement group. Google does not recommend that you use this field unless you use a compact policy and you want your policy to work only if it contains this exact number of VMs.",
                    },
                  },
                  description:
                    "A GroupPlacementPolicy specifies resource placement configuration. It specifies the failure bucket separation",
                  additionalProperties: true,
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                instanceSchedulePolicy: {
                  type: "object",
                  properties: {
                    expirationTime: {
                      type: "string",
                      description:
                        "The expiration time of the schedule. The timestamp is an RFC3339 string.",
                    },
                    startTime: {
                      type: "string",
                      description:
                        "The start time of the schedule. The timestamp is an RFC3339 string.",
                    },
                    timeZone: {
                      type: "string",
                      description:
                        "Specifies the time zone to be used in interpreting Schedule.schedule. The value of this field must be a time zone name from the tz database: https://wikipedia.org/wiki/Tz_database.",
                    },
                    vmStartSchedule: {
                      type: "object",
                      properties: {
                        schedule: {
                          type: "string",
                          description:
                            "Specifies the frequency for the operation, using the unix-cron format.",
                        },
                      },
                      description: "Schedule for an instance operation.",
                      additionalProperties: true,
                    },
                    vmStopSchedule: {
                      type: "object",
                      properties: {
                        schedule: {
                          type: "string",
                          description:
                            "Specifies the frequency for the operation, using the unix-cron format.",
                        },
                      },
                      description: "Schedule for an instance operation.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "An InstanceSchedulePolicy specifies when and how frequent certain operations are performed on the instance.",
                  additionalProperties: true,
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Alwayscompute#resource_policies for resource policies.",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                region: {
                  type: "string",
                },
                resourceStatus: {
                  type: "object",
                  properties: {
                    instanceSchedulePolicy: {
                      type: "object",
                      properties: {
                        lastRunStartTime: {
                          type: "string",
                          description:
                            "Output only. [Output Only] The last time the schedule successfully ran. The timestamp is an RFC3339 string.",
                        },
                        nextRunStartTime: {
                          type: "string",
                          description:
                            "Output only. [Output Only] The next time the schedule is planned to run. The actual time might be slightly different. The timestamp is an RFC3339 string.",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "Output only. [Output Only] Specifies a set of output values reffering to the instance_schedule_policy system status. This field should have the same name as corresponding policy field.",
                    },
                  },
                  description:
                    'Contains output only fields. Use this sub-message for all output fields set on ResourcePolicy. The internal structure of this "status" field should mimic the structure of ResourcePolicy proto specification.',
                  additionalProperties: true,
                },
                selfLink: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined fully-qualified URL for this resource.",
                },
                snapshotSchedulePolicy: {
                  type: "object",
                  properties: {
                    retentionPolicy: {
                      type: "object",
                      properties: {
                        maxRetentionDays: {
                          type: "integer",
                          description:
                            "Maximum age of the snapshot that is allowed to be kept.",
                        },
                        onSourceDiskDelete: {
                          type: "string",
                          enum: [
                            "UNDEFINED_ON_SOURCE_DISK_DELETE",
                            "APPLY_RETENTION_POLICY",
                            "KEEP_AUTO_SNAPSHOTS",
                            "UNSPECIFIED_ON_SOURCE_DISK_DELETE",
                          ],
                          description:
                            "Specifies the behavior to apply to scheduled snapshots when the source disk is deleted. Check the OnSourceDiskDelete enum for the list of possible values.",
                        },
                      },
                      description:
                        "Policy for retention of scheduled snapshots.",
                      additionalProperties: true,
                    },
                    schedule: {
                      type: "object",
                      properties: {
                        dailySchedule: {
                          type: "object",
                          properties: {
                            daysInCycle: {
                              type: "integer",
                              description:
                                "Defines a schedule with units measured in days. The value determines how many days pass between the start of each cycle.",
                            },
                            duration: {
                              type: "string",
                              description:
                                "Output only. [Output only] A predetermined duration for the window, automatically chosen to be the smallest possible in the given scenario.",
                            },
                            startTime: {
                              type: "string",
                              description:
                                "Start time of the window. This must be in UTC format that resolves to one of 00:00, 04:00, 08:00,12:00, 16:00, or 20:00. For example, both 13:00-5 and 08:00 are valid.",
                            },
                          },
                          description:
                            "Time window specified for daily operations.",
                          additionalProperties: true,
                        },
                        hourlySchedule: {
                          type: "object",
                          properties: {
                            duration: {
                              type: "string",
                              description:
                                "Output only. [Output only] Duration of the time window, automatically chosen to be smallest possible in the given scenario.",
                            },
                            hoursInCycle: {
                              type: "integer",
                              description:
                                "Defines a schedule with units measured in hours. The value determines how many hours pass between the start of each cycle.",
                            },
                            startTime: {
                              type: "string",
                              description:
                                'Time within the window to start the operations. It must be in format "HH:MM", where HH : [00-23] and MM : [00-00] GMT.',
                            },
                          },
                          description:
                            "Time window specified for hourly operations.",
                          additionalProperties: true,
                        },
                        weeklySchedule: {
                          type: "object",
                          properties: {
                            dayOfWeeks: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  day: {
                                    type: "string",
                                    enum: [
                                      "UNDEFINED_DAY",
                                      "FRIDAY",
                                      "INVALID",
                                      "MONDAY",
                                      "SATURDAY",
                                      "SUNDAY",
                                      "THURSDAY",
                                      "TUESDAY",
                                      "WEDNESDAY",
                                    ],
                                    description:
                                      "Defines a schedule that runs on specific days of the week. Specify one or more days. The following options are available: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY. Check the Day enum for the list of possible values.",
                                  },
                                  duration: {
                                    type: "string",
                                    description:
                                      "Output only. [Output only] Duration of the time window, automatically chosen to be smallest possible in the given scenario.",
                                  },
                                  startTime: {
                                    type: "string",
                                    description:
                                      'Time within the window to start the operations. It must be in format "HH:MM", where HH : [00-23] and MM : [00-00] GMT.',
                                  },
                                },
                                additionalProperties: true,
                              },
                              description:
                                "Up to 7 intervals/windows, one for each day of the week.",
                            },
                          },
                          description:
                            "Time window specified for weekly operations.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "A schedule for disks where the schedueled operations are performed.",
                      additionalProperties: true,
                    },
                    snapshotProperties: {
                      type: "object",
                      properties: {
                        chainName: {
                          type: "string",
                          description:
                            "Chain name that the snapshot is created in.",
                        },
                        guestFlush: {
                          type: "boolean",
                          description:
                            "Indication to perform a 'guest aware' snapshot.",
                        },
                        labels: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "Labels to apply to scheduled snapshots. These can be later modified by the setLabels method. Label values may be empty.",
                        },
                        storageLocations: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Cloud Storage bucket storage location of the auto snapshot (regional or multi-regional).",
                        },
                      },
                      description:
                        "Specified snapshot properties for scheduled snapshots created by this policy.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "A snapshot schedule policy specifies when and how frequently snapshots are to be created for the target disk. Also specifies how many and how long these scheduled snapshots should be retained.",
                  additionalProperties: true,
                },
                status: {
                  type: "string",
                  enum: [
                    "UNDEFINED_STATUS",
                    "CREATING",
                    "DELETING",
                    "EXPIRED",
                    "INVALID",
                    "READY",
                  ],
                  description:
                    "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
                },
                workloadPolicy: {
                  type: "object",
                  properties: {
                    acceleratorTopology: {
                      type: "string",
                      description:
                        "Specifies the topology required to create a partition for VMs that have interconnected GPUs.",
                    },
                    maxTopologyDistance: {
                      type: "string",
                      enum: [
                        "UNDEFINED_MAX_TOPOLOGY_DISTANCE",
                        "BLOCK",
                        "CLUSTER",
                        "SUBBLOCK",
                      ],
                      description:
                        "Specifies the maximum distance between instances. Check the MaxTopologyDistance enum for the list of possible values.",
                    },
                    type: {
                      type: "string",
                      enum: [
                        "UNDEFINED_TYPE",
                        "HIGH_AVAILABILITY",
                        "HIGH_THROUGHPUT",
                      ],
                      description:
                        "Specifies the intent of the instance placement in the MIG. Check the Type enum for the list of possible values.",
                    },
                  },
                  description: "Represents the workload policy.",
                  additionalProperties: true,
                },
              },
              description:
                "Represents a Resource Policy resource. You can use resource policies to schedule actions for some Compute Engine resources. For example, you can use them toschedule persistent disk snapshots.",
              additionalProperties: true,
            },
            description: "[Output Only] A list of ResourcePolicy resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource.Alwayscompute#resourcePoliciesList for listsof resourcePolicies",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
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
        additionalProperties: true,
      },
    },
  },
};

export default resourcePoliciesList;
