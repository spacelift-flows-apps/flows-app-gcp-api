import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Resource Policies - Get",
  description: `Returns the specified Zone resource.`,
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
        resourcePolicy: {
          name: "Resource Policy",
          description: "Name of the resource policy to retrieve.",
          type: {
            type: "string",
          },
          required: true,
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

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/resourcePolicies/{resource_policy}",
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
          status: {
            type: "string",
            description:
              "Output only. [Output Only] The status of resource policy creation. Check the Status enum for the list of possible values.",
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
        },
        description:
          "Represents a Resource Policy resource. You can use resource policies to schedule actions for some Compute Engine resources. For example, you can use them toschedule persistent disk snapshots.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
