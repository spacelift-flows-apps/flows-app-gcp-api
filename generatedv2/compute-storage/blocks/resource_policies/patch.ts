import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const patch: AppBlock = {
  name: "Resource Policies - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Resource Policies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Region field",
          type: {
            type: "string",
          },
          required: false,
        },
        resourcePolicy: {
          name: "Resource Policy",
          description: "Id of the resource policy to patch.",
          type: {
            type: "string",
          },
          required: true,
        },
        creationTimestamp: {
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
          description: "Description field",
          type: {
            type: "string",
          },
          required: false,
        },
        diskConsistencyGroupPolicy: {
          name: "Disk Consistency Group Policy",
          description: "Resource policy for disk consistency groups.",
          type: {
            type: "object",
            properties: {},
            description: "Resource policy for disk consistency groups.",
            additionalProperties: true,
          },
          required: false,
        },
        groupPlacementPolicy: {
          name: "Group Placement Policy",
          description:
            "Resource policy for instances for placement configuration.",
          type: {
            type: "object",
            properties: {
              availabilityDomainCount: {
                type: "integer",
                description:
                  "The number of availability domains to spread instances across. If two instances are in different availability domain, they are not in the same low latency network.",
              },
              collocation: {
                type: "string",
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
        instanceSchedulePolicy: {
          name: "Instance Schedule Policy",
          description: "Resource policy for scheduling instance operations.",
          type: {
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
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Alwayscompute#resource_policies for resource policies.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#resource_policies for resource policies.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        resourceStatus: {
          name: "Resource Status",
          description:
            "Output only. [Output Only] The system status of the resource policy.",
          type: {
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
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description:
            "Output only. [Output Only] Server-defined fully-qualified URL for this resource.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined fully-qualified URL for this resource.",
          },
          required: false,
        },
        snapshotSchedulePolicy: {
          name: "Snapshot Schedule Policy",
          description:
            "Resource policy for persistent disks for creating snapshots.",
          type: {
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
                    description:
                      "Specifies the behavior to apply to scheduled snapshots when the source disk is deleted. Check the OnSourceDiskDelete enum for the list of possible values.",
                  },
                },
                description: "Policy for retention of scheduled snapshots.",
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
                    description: "Time window specified for daily operations.",
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
                    description: "Time window specified for hourly operations.",
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
                    description: "Time window specified for weekly operations.",
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
                    description: "Chain name that the snapshot is created in.",
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
          required: false,
        },
        status: {
          name: "Status",
          description:
            "Output only. [Output Only] The status of resource policy creation. Check the Status enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The status of resource policy creation. Check the Status enum for the list of possible values.",
          },
          required: false,
        },
        workloadPolicy: {
          name: "Workload Policy",
          description:
            "Resource policy for defining instance placement for MIGs.",
          type: {
            type: "object",
            properties: {
              acceleratorTopology: {
                type: "string",
                description:
                  "Specifies the topology required to create a partition for VMs that have interconnected GPUs.",
              },
              maxTopologyDistance: {
                type: "string",
                description:
                  "Specifies the maximum distance between instances. Check the MaxTopologyDistance enum for the list of possible values.",
              },
              type: {
                type: "string",
                description:
                  "Specifies the intent of the instance placement in the MIG. Check the Type enum for the list of possible values.",
              },
            },
            description: "Represents the workload policy.",
            additionalProperties: true,
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "update_mask indicates fields to be updated as part of this request.",
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
        if (input.event.inputConfig.resourcePolicy !== undefined)
          pathParams["resource_policy"] = String(
            input.event.inputConfig.resourcePolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        if (input.event.inputConfig.updateMask !== undefined)
          queryParams["updateMask"] = String(
            input.event.inputConfig.updateMask,
          );
        const body: Record<string, any> = {};
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.diskConsistencyGroupPolicy !== undefined)
          body.diskConsistencyGroupPolicy =
            input.event.inputConfig.diskConsistencyGroupPolicy;
        if (input.event.inputConfig.groupPlacementPolicy !== undefined)
          body.groupPlacementPolicy =
            input.event.inputConfig.groupPlacementPolicy;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.instanceSchedulePolicy !== undefined)
          body.instanceSchedulePolicy =
            input.event.inputConfig.instanceSchedulePolicy;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.resourceStatus !== undefined)
          body.resourceStatus = input.event.inputConfig.resourceStatus;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.snapshotSchedulePolicy !== undefined)
          body.snapshotSchedulePolicy =
            input.event.inputConfig.snapshotSchedulePolicy;
        if (input.event.inputConfig.status !== undefined)
          body.status = input.event.inputConfig.status;
        if (input.event.inputConfig.workloadPolicy !== undefined)
          body.workloadPolicy = input.event.inputConfig.workloadPolicy;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/resourcePolicies/{resource_policy}",
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
            description: "[Output Only] Server-defined URL for the resource.",
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
