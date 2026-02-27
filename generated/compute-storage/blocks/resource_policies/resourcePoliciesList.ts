import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const resourcePoliciesList: AppBlock = {
  name: "Resource Policies - List",
  description: `A list all the resource policies that have been configured for the specified project in specified region.`,
  category: "Resource Policies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
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
              "https://www.googleapis.com/auth/compute.readonly",
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
        let path = `projects/{project}/regions/{region}/resourcePolicies`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
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
          etag: {
            type: "string",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource.Alwayscompute#resourcePoliciesList for listsof resourcePolicies",
          },
          warning: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description:
                  "[Output Only] A human-readable description of the warning code.",
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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                groupPlacementPolicy: {
                  type: "object",
                  properties: {
                    vmCount: {
                      type: "integer",
                      description:
                        "Number of VMs in this placement group. Google does not recommend that you\nuse this field unless you use a compact policy and you want your policy\nto work only if it contains this exact number of VMs. (Format: int32)",
                    },
                    collocation: {
                      type: "string",
                      enum: ["COLLOCATED", "UNSPECIFIED_COLLOCATION"],
                      description: "Specifies network collocation",
                    },
                    availabilityDomainCount: {
                      type: "integer",
                      description:
                        "The number of availability domains to spread instances across. If two\ninstances are in different availability domain, they are not in the same\nlow latency network. (Format: int32)",
                    },
                    gpuTopology: {
                      type: "string",
                      description:
                        "Specifies the shape of the GPU slice, in slice based GPU families eg.\nA4X.",
                    },
                  },
                  description:
                    "A GroupPlacementPolicy specifies resource placement configuration.\nIt specifies the failure bucket separation",
                  additionalProperties: true,
                },
                description: {
                  type: "string",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#resource_policies for resource policies.",
                },
                status: {
                  type: "string",
                  enum: ["CREATING", "DELETING", "EXPIRED", "INVALID", "READY"],
                  description:
                    "[Output Only] The status of resource policy creation.",
                },
                snapshotSchedulePolicy: {
                  type: "object",
                  properties: {
                    snapshotProperties: {
                      type: "object",
                      properties: {
                        labels: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "Labels to apply to scheduled snapshots. These can be later modified\nby the setLabels method. Label values may be empty.",
                        },
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
                        storageLocations: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Cloud Storage bucket storage location of the auto snapshot (regional or\nmulti-regional).",
                        },
                      },
                      description:
                        "Specified snapshot properties for scheduled snapshots created by this\npolicy.",
                      additionalProperties: true,
                    },
                    retentionPolicy: {
                      type: "object",
                      properties: {
                        maxRetentionDays: {
                          type: "integer",
                          description:
                            "Maximum age of the snapshot that is allowed to be kept. (Format: int32)",
                        },
                        onSourceDiskDelete: {
                          type: "string",
                          enum: [
                            "APPLY_RETENTION_POLICY",
                            "KEEP_AUTO_SNAPSHOTS",
                            "UNSPECIFIED_ON_SOURCE_DISK_DELETE",
                          ],
                          description:
                            "Specifies the behavior to apply to scheduled snapshots when\nthe source disk is deleted.",
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
                                "Defines a schedule with units measured in days. The value determines\nhow many days pass between the start of each cycle. (Format: int32)",
                            },
                            startTime: {
                              type: "string",
                              description:
                                "Start time of the window. This must be in UTC format that resolves to one\nof 00:00, 04:00, 08:00,12:00, 16:00, or 20:00. For\nexample, both 13:00-5 and 08:00 are valid.",
                            },
                            duration: {
                              type: "string",
                              description:
                                "[Output only] A predetermined duration for the window, automatically\nchosen to be the smallest possible in the given scenario.",
                            },
                          },
                          description:
                            "Time window specified for daily operations.",
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
                                  duration: {
                                    type: "string",
                                    description:
                                      "[Output only] Duration of the time window, automatically chosen to be\nsmallest possible in the given scenario.",
                                  },
                                  startTime: {
                                    type: "string",
                                    description:
                                      'Time within the window to start the operations.\nIt must be in format "HH:MM", where HH : [00-23] and MM : [00-00] GMT.',
                                  },
                                  day: {
                                    type: "string",
                                    enum: [
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
                                      "Defines a schedule that runs on specific days of the week. Specify\none or more days. The following options are available:\nMONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY.",
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
                        hourlySchedule: {
                          type: "object",
                          properties: {
                            startTime: {
                              type: "string",
                              description:
                                'Time within the window to start the operations.\nIt must be in format "HH:MM", where HH : [00-23] and MM : [00-00] GMT.',
                            },
                            duration: {
                              type: "string",
                              description:
                                "[Output only] Duration of the time window, automatically chosen to be\nsmallest possible in the given scenario.",
                            },
                            hoursInCycle: {
                              type: "integer",
                              description:
                                "Defines a schedule with units measured in hours. The value determines\nhow many hours pass between the start of each cycle. (Format: int32)",
                            },
                          },
                          description:
                            "Time window specified for hourly operations.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "A schedule for disks where the schedueled operations are performed.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "A snapshot schedule policy specifies when and how frequently snapshots are\nto be created for the target disk. Also specifies how many and how long\nthese scheduled snapshots should be retained.",
                  additionalProperties: true,
                },
                name: {
                  type: "string",
                  description:
                    "The name of the resource, provided by the client when initially creating\nthe resource. The resource name must be 1-63 characters long, and comply\nwithRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
                },
                region: {
                  type: "string",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                instanceSchedulePolicy: {
                  type: "object",
                  properties: {
                    timeZone: {
                      type: "string",
                      description:
                        "Specifies the time zone to be used in interpreting Schedule.schedule.\nThe value of this field must be a time zone name from the tz database:\nhttps://wikipedia.org/wiki/Tz_database.",
                    },
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
                  },
                  description:
                    "An InstanceSchedulePolicy specifies when and how frequent certain\noperations are performed on the instance.",
                  additionalProperties: true,
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                diskConsistencyGroupPolicy: {
                  type: "object",
                  properties: {},
                  description: "Resource policy for disk consistency groups.",
                  additionalProperties: true,
                },
                workloadPolicy: {
                  type: "object",
                  properties: {
                    acceleratorTopology: {
                      type: "string",
                      description:
                        "Specifies the topology required to create a partition for VMs that have\ninterconnected GPUs.",
                    },
                    type: {
                      type: "string",
                      enum: ["HIGH_AVAILABILITY", "HIGH_THROUGHPUT"],
                      description:
                        "Specifies the intent of the instance placement in the MIG.",
                    },
                    maxTopologyDistance: {
                      type: "string",
                      enum: ["BLOCK", "CLUSTER", "SUBBLOCK"],
                      description:
                        "Specifies the maximum distance between instances.",
                    },
                  },
                  description: "Represents the workload policy.",
                  additionalProperties: true,
                },
                resourceStatus: {
                  type: "object",
                  properties: {
                    instanceSchedulePolicy: {
                      type: "object",
                      properties: {
                        nextRunStartTime: {
                          type: "string",
                          description:
                            "[Output Only] The next time the schedule is planned to run.\nThe actual time might be slightly different.\nThe timestamp is an RFC3339 string.",
                        },
                        lastRunStartTime: {
                          type: "string",
                          description:
                            "[Output Only] The last time the schedule successfully ran.\nThe timestamp is an RFC3339 string.",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  description:
                    'Contains output only fields.\nUse this sub-message for all output fields set on ResourcePolicy.\nThe internal structure of this "status" field should mimic the structure\nof ResourcePolicy proto specification.',
                  additionalProperties: true,
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined fully-qualified URL for this resource.",
                },
              },
              description:
                "Represents a Resource Policy resource. You can use resource policies to\nschedule actions for some Compute Engine resources. For example, you can\nuse them toschedule persistent disk\nsnapshots.",
              additionalProperties: true,
            },
            description: "[Output Only] A list of ResourcePolicy resources.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default resourcePoliciesList;
