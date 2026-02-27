import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  projectId: "project_id",
  clusterId: "cluster_id",
  maintenancePolicy: {
    name: "maintenance_policy",
    fields: {
      window: {
        name: "window",
        fields: {
          dailyMaintenanceWindow: {
            name: "daily_maintenance_window",
            fields: {
              startTime: "start_time",
            },
          },
          recurringWindow: {
            name: "recurring_window",
            fields: {
              window: {
                name: "window",
                fields: {
                  maintenanceExclusionOptions: {
                    name: "maintenance_exclusion_options",
                    fields: {
                      endTimeBehavior: "end_time_behavior",
                    },
                  },
                  startTime: "start_time",
                  endTime: "end_time",
                },
              },
            },
          },
          maintenanceExclusions: "maintenance_exclusions",
        },
      },
      resourceVersion: "resource_version",
    },
  },
};

const outputMapping = {
  operation_type: "operationType",
  status_message: "statusMessage",
  self_link: "selfLink",
  target_link: "targetLink",
  start_time: "startTime",
  end_time: "endTime",
  progress: {
    name: "progress",
    fields: {
      metrics: {
        name: "metrics",
        fields: {
          int_value: "intValue",
          double_value: "doubleValue",
          string_value: "stringValue",
        },
      },
    },
  },
  cluster_conditions: {
    name: "clusterConditions",
    fields: {
      canonical_code: "canonicalCode",
    },
  },
  nodepool_conditions: {
    name: "nodepoolConditions",
    fields: {
      canonical_code: "canonicalCode",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
};

const setMaintenancePolicy: AppBlock = {
  name: "Set Maintenance Policy",
  description: `Sets the maintenance policy for a cluster.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        projectId: {
          name: "Project Id",
          description:
            "Required. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects).",
          type: {
            type: "string",
            description:
              "Required. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects).",
          },
          required: true,
        },
        zone: {
          name: "Zone",
          description:
            "Required. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides.",
          type: {
            type: "string",
            description:
              "Required. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides.",
          },
          required: true,
        },
        clusterId: {
          name: "Cluster Id",
          description: "Required. The name of the cluster to update.",
          type: {
            type: "string",
            description: "Required. The name of the cluster to update.",
          },
          required: true,
        },
        maintenancePolicy: {
          name: "Maintenance Policy",
          description:
            "Required. The maintenance policy to be set for the cluster. An empty field clears the existing maintenance policy.",
          type: {
            type: "object",
            properties: {
              window: {
                type: "object",
                properties: {
                  dailyMaintenanceWindow: {
                    type: "object",
                    properties: {
                      startTime: {
                        type: "string",
                        description:
                          'Time within the maintenance window to start the maintenance operations. Time format should be in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format "HH:MM", where HH : [00-23] and MM : [00-59] GMT.',
                      },
                    },
                    description:
                      "Time window specified for daily maintenance operations. (Part of 'policy' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  recurringWindow: {
                    type: "object",
                    properties: {
                      window: {
                        type: "object",
                        properties: {
                          maintenanceExclusionOptions: {
                            type: "object",
                            properties: {
                              scope: {
                                type: "string",
                                enum: [
                                  "NO_UPGRADES",
                                  "NO_MINOR_UPGRADES",
                                  "NO_MINOR_OR_NODE_UPGRADES",
                                ],
                                description:
                                  "Scope specifies the upgrade scope which upgrades are blocked by the exclusion.",
                              },
                              endTimeBehavior: {
                                type: "string",
                                enum: [
                                  "END_TIME_BEHAVIOR_UNSPECIFIED",
                                  "UNTIL_END_OF_SUPPORT",
                                ],
                                description:
                                  "EndTimeBehavior specifies the behavior of the exclusion end time.",
                              },
                            },
                            description:
                              "Represents the Maintenance exclusion option.",
                            additionalProperties: true,
                          },
                          startTime: {
                            type: "string",
                            description:
                              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                          },
                          endTime: {
                            type: "string",
                            description:
                              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                          },
                        },
                        description: "Represents an arbitrary window of time.",
                        additionalProperties: true,
                      },
                      recurrence: {
                        type: "string",
                        description:
                          "An RRULE (https://tools.ietf.org/html/rfc5545#section-3.8.5.3) for how this window recurs. They go on for the span of time between the start and end time.  For example, to have something repeat every weekday, you'd use: `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR`  To repeat some window daily (equivalent to the DailyMaintenanceWindow): `FREQ=DAILY`  For the first weekend of every month: `FREQ=MONTHLY;BYSETPOS=1;BYDAY=SA,SU`  This specifies how frequently the window starts. Eg, if you wanted to have a 9-5 UTC-4 window every weekday, you'd use something like: ``` start time = 2019-01-01T09:00:00-0400 end time = 2019-01-01T17:00:00-0400 recurrence = FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR ```  Windows can span multiple days. Eg, to make the window encompass every weekend from midnight Saturday till the last minute of Sunday UTC: ``` start time = 2019-01-05T00:00:00Z end time = 2019-01-07T23:59:00Z recurrence = FREQ=WEEKLY;BYDAY=SA ```  Note the start and end time's specific dates are largely arbitrary except to specify duration of the window and when it first starts. The FREQ values of HOURLY, MINUTELY, and SECONDLY are not supported.",
                      },
                    },
                    description:
                      "Represents an arbitrary window of time that recurs. (Part of 'policy' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  maintenanceExclusions: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Exceptions to maintenance window. Non-emergency maintenance should not occur in these windows.",
                  },
                },
                description:
                  "MaintenanceWindow defines the maintenance window to be used for the cluster.",
                additionalProperties: true,
              },
              resourceVersion: {
                type: "string",
                description:
                  "A hash identifying the version of this policy, so that updates to fields of the policy won't accidentally undo intermediate changes (and so that users of the API unaware of some fields won't accidentally remove other fields). Make a `get()` request to the cluster to get the current resource version and include it with requests to set the policy.",
              },
            },
            description:
              "MaintenancePolicy defines the maintenance policy to be used for the cluster.",
            additionalProperties: true,
          },
          required: true,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster name) of the cluster to set maintenance policy. Specified in the format `projects/*/locations/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster name) of the cluster to set maintenance policy. Specified in the format `projects/*/locations/*/clusters/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.setMaintenancePolicy(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "Output only. The server-assigned ID for the operation.",
          },
          zone: {
            type: "string",
            description:
              "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the operation is taking place. This field is deprecated, use location instead.",
          },
          operationType: {
            type: "string",
            enum: [
              "TYPE_UNSPECIFIED",
              "CREATE_CLUSTER",
              "DELETE_CLUSTER",
              "UPGRADE_MASTER",
              "UPGRADE_NODES",
              "REPAIR_CLUSTER",
              "UPDATE_CLUSTER",
              "CREATE_NODE_POOL",
              "DELETE_NODE_POOL",
              "SET_NODE_POOL_MANAGEMENT",
              "AUTO_REPAIR_NODES",
              "AUTO_UPGRADE_NODES",
              "SET_LABELS",
              "SET_MASTER_AUTH",
              "SET_NODE_POOL_SIZE",
              "SET_NETWORK_POLICY",
              "SET_MAINTENANCE_POLICY",
              "RESIZE_CLUSTER",
              "FLEET_FEATURE_UPGRADE",
            ],
            description: "Output only. The operation type.",
          },
          status: {
            type: "string",
            enum: [
              "STATUS_UNSPECIFIED",
              "PENDING",
              "RUNNING",
              "DONE",
              "ABORTING",
            ],
            description: "Output only. The current status of the operation.",
          },
          detail: {
            type: "string",
            description:
              "Output only. Detailed operation progress, if available.",
          },
          statusMessage: {
            type: "string",
            description:
              "Output only. If an error has occurred, a textual description of the error. Deprecated. Use the field error instead.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. Server-defined URI for the operation. Example: `https://container.googleapis.com/v1alpha1/projects/123/locations/us-central1/operations/operation-123`.",
          },
          targetLink: {
            type: "string",
            description:
              "Output only. Server-defined URI for the target of the operation. The format of this is a URI to the resource being modified (such as a cluster, node pool, or node). For node pool repairs, there may be multiple nodes being repaired, but only one will be the target.  Examples:  - ## `https://container.googleapis.com/v1/projects/123/locations/us-central1/clusters/my-cluster`  ## `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np`  `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np/node/my-node`",
          },
          location: {
            type: "string",
            description:
              "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) or [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) in which the cluster resides.",
          },
          startTime: {
            type: "string",
            description:
              "Output only. The time the operation started, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
          },
          endTime: {
            type: "string",
            description:
              "Output only. The time the operation completed, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
          },
          progress: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "A non-parameterized string describing an operation stage. Unset for single-stage operations.",
              },
              status: {
                type: "string",
                enum: [
                  "STATUS_UNSPECIFIED",
                  "PENDING",
                  "RUNNING",
                  "DONE",
                  "ABORTING",
                ],
                description:
                  "Status of an operation stage. Unset for single-stage operations.",
              },
              metrics: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        'Required. Metric name, e.g., "nodes total", "percent done".',
                    },
                    intValue: {
                      type: "string",
                      description:
                        "64-bit integer as string (Part of 'value' - only one field in this group can be set)",
                    },
                    doubleValue: {
                      type: "number",
                      description:
                        "For metrics with floating point value. (Part of 'value' - only one field in this group can be set)",
                    },
                    stringValue: {
                      type: "string",
                      description:
                        "For metrics with custom values (ratios, visual progress, etc.). (Part of 'value' - only one field in this group can be set)",
                    },
                  },
                  required: ["name"],
                  description:
                    "Progress metric is (string, int|float|string) pair.",
                  additionalProperties: true,
                },
                description:
                  'Progress metric bundle, for example:   metrics: [{name: "nodes done",     int_value: 15},             {name: "nodes total",    int_value: 32}] or   metrics: [{name: "progress",       double_value: 0.56},             {name: "progress scale", double_value: 1.0}]',
              },
              stages: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description: "Substages of an operation or a stage.",
              },
            },
            description:
              "Information about operation (or operation stage) progress.",
            additionalProperties: true,
          },
          clusterConditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "UNKNOWN",
                    "GCE_STOCKOUT",
                    "GKE_SERVICE_ACCOUNT_DELETED",
                    "GCE_QUOTA_EXCEEDED",
                    "SET_BY_OPERATOR",
                    "CLOUD_KMS_KEY_ERROR",
                    "CA_EXPIRING",
                    "NODE_SERVICE_ACCOUNT_MISSING_PERMISSIONS",
                    "CLOUD_KMS_KEY_DESTROYED",
                  ],
                  description:
                    "Machine-friendly representation of the condition Deprecated. Use canonical_code instead.",
                },
                message: {
                  type: "string",
                  description: "Human-friendly representation of the condition",
                },
                canonicalCode: {
                  type: "string",
                  enum: [
                    "OK",
                    "CANCELLED",
                    "UNKNOWN",
                    "INVALID_ARGUMENT",
                    "DEADLINE_EXCEEDED",
                    "NOT_FOUND",
                    "ALREADY_EXISTS",
                    "PERMISSION_DENIED",
                    "UNAUTHENTICATED",
                    "RESOURCE_EXHAUSTED",
                    "FAILED_PRECONDITION",
                    "ABORTED",
                    "OUT_OF_RANGE",
                    "UNIMPLEMENTED",
                    "INTERNAL",
                    "UNAVAILABLE",
                    "DATA_LOSS",
                  ],
                  description: "Canonical code of the condition.",
                },
              },
              description:
                "StatusCondition describes why a cluster or a node pool has a certain status (e.g., ERROR or DEGRADED).",
              additionalProperties: true,
            },
            description:
              "Which conditions caused the current cluster state. Deprecated. Use field error instead.",
          },
          nodepoolConditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "UNKNOWN",
                    "GCE_STOCKOUT",
                    "GKE_SERVICE_ACCOUNT_DELETED",
                    "GCE_QUOTA_EXCEEDED",
                    "SET_BY_OPERATOR",
                    "CLOUD_KMS_KEY_ERROR",
                    "CA_EXPIRING",
                    "NODE_SERVICE_ACCOUNT_MISSING_PERMISSIONS",
                    "CLOUD_KMS_KEY_DESTROYED",
                  ],
                  description:
                    "Machine-friendly representation of the condition Deprecated. Use canonical_code instead.",
                },
                message: {
                  type: "string",
                  description: "Human-friendly representation of the condition",
                },
                canonicalCode: {
                  type: "string",
                  enum: [
                    "OK",
                    "CANCELLED",
                    "UNKNOWN",
                    "INVALID_ARGUMENT",
                    "DEADLINE_EXCEEDED",
                    "NOT_FOUND",
                    "ALREADY_EXISTS",
                    "PERMISSION_DENIED",
                    "UNAUTHENTICATED",
                    "RESOURCE_EXHAUSTED",
                    "FAILED_PRECONDITION",
                    "ABORTED",
                    "OUT_OF_RANGE",
                    "UNIMPLEMENTED",
                    "INTERNAL",
                    "UNAVAILABLE",
                    "DATA_LOSS",
                  ],
                  description: "Canonical code of the condition.",
                },
              },
              description:
                "StatusCondition describes why a cluster or a node pool has a certain status (e.g., ERROR or DEGRADED).",
              additionalProperties: true,
            },
            description:
              "Which conditions caused the current node pool state. Deprecated. Use field error instead.",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    typeUrl: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "The error result of the operation in case of failure.",
          },
        },
        description:
          "This operation resource represents operations that may have happened or are happening on the cluster. All fields are output only.",
        additionalProperties: true,
      },
    },
  },
};

export default setMaintenancePolicy;
