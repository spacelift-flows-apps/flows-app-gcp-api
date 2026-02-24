import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const resourcePoliciesGet: AppBlock = {
  name: "Resource Policies - Get",
  description: `Retrieves all information of the specified resource policy.`,
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
        let path = `projects/{project}/regions/{region}/resourcePolicies/{resourcePolicy}`;

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
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
                    description: "Chain name that the snapshot is created in.",
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
                    description: "Time window specified for daily operations.",
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
                    description: "Time window specified for weekly operations.",
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
                    description: "Time window specified for hourly operations.",
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
    },
  },
};

export default resourcePoliciesGet;
