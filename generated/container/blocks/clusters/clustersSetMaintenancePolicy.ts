import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const clustersSetMaintenancePolicy: AppBlock = {
  name: "Clusters - Set Maintenance Policy",
  description: `Sets the maintenance policy for a cluster.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        clusterId: {
          name: "Cluster ID",
          description: "Required.",
          type: {
            type: "string",
            description: "Required. The name of the cluster to update.",
          },
          required: false,
        },
        zone: {
          name: "Zone",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster name) of the cluster to set maintenance policy.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster name) of the cluster to set maintenance policy. Specified in the format `projects/*/locations/*/clusters/*`.",
          },
          required: false,
        },
        maintenancePolicy: {
          name: "Maintenance Policy",
          description: "Required.",
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
                      duration: {
                        type: "string",
                        description:
                          'Output only. Duration of the time window, automatically chosen to be smallest possible in the given scenario. Duration will be in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format "PTnHnMnS".',
                      },
                    },
                    description:
                      "Time window specified for daily maintenance operations.",
                    additionalProperties: true,
                  },
                  maintenanceExclusions: {
                    type: "object",
                    additionalProperties: {
                      type: "object",
                    },
                    description:
                      "Exceptions to maintenance window. Non-emergency maintenance should not occur in these windows.",
                  },
                  recurringWindow: {
                    type: "object",
                    properties: {
                      window: {
                        type: "object",
                        properties: {
                          startTime: {
                            type: "string",
                            description:
                              "The time that the window first starts. (Format: google-datetime)",
                          },
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
                          endTime: {
                            type: "string",
                            description:
                              "The time that the window ends. The end time should take place after the start time. (Format: google-datetime)",
                          },
                        },
                        description: "Represents an arbitrary window of time.",
                        additionalProperties: true,
                      },
                      recurrence: {
                        type: "string",
                        description:
                          "An RRULE (https://tools.ietf.org/html/rfc5545#section-3.8.5.3) for how this window reccurs. They go on for the span of time between the start and end time. For example, to have something repeat every weekday, you'd use: `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR` To repeat some window daily (equivalent to the DailyMaintenanceWindow): `FREQ=DAILY` For the first weekend of every month: `FREQ=MONTHLY;BYSETPOS=1;BYDAY=SA,SU` This specifies how frequently the window starts. Eg, if you wanted to have a 9-5 UTC-4 window every weekday, you'd use something like: ``` start time = 2019-01-01T09:00:00-0400 end time = 2019-01-01T17:00:00-0400 recurrence = FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR ``` Windows can span multiple days. Eg, to make the window encompass every weekend from midnight Saturday till the last minute of Sunday UTC: ``` start time = 2019-01-05T00:00:00Z end time = 2019-01-07T23:59:00Z recurrence = FREQ=WEEKLY;BYDAY=SA ``` Note the start and end time's specific dates are largely arbitrary except to specify duration of the window and when it first starts. The FREQ values of HOURLY, MINUTELY, and SECONDLY are not supported.",
                      },
                    },
                    description:
                      "Represents an arbitrary window of time that recurs.",
                    additionalProperties: true,
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
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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
        const baseUrl = "https://container.googleapis.com/";
        let path = `v1/projects/{projectId}/zones/{zone}/clusters/{clusterId}:setMaintenancePolicy`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};
        requestBody.projectId = input.app.config.projectId;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.zone !== undefined)
          requestBody.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.maintenancePolicy !== undefined)
          requestBody.maintenancePolicy =
            input.event.inputConfig.maintenancePolicy;
        if (input.event.inputConfig.clusterId !== undefined)
          requestBody.clusterId = input.event.inputConfig.clusterId;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
          startTime: {
            type: "string",
            description:
              "Output only. The time the operation started, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
          },
          clusterConditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "Human-friendly representation of the condition",
                },
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
          location: {
            type: "string",
            description:
              "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) or [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) in which the cluster resides.",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
                description:
                  "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
              },
              message: {
                type: "string",
                description:
                  "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description:
                  "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              },
            },
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "Output only. The server-assigned ID for the operation.",
          },
          progress: {
            type: "object",
            properties: {
              stages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    stages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          stages: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                stages: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      stages: {
                                        type: "array",
                                        items: {
                                          type: "object",
                                          additionalProperties: true,
                                        },
                                        description:
                                          "Substages of an operation or a stage.",
                                      },
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
                                          additionalProperties: true,
                                        },
                                        description:
                                          'Progress metric bundle, for example: metrics: [{name: "nodes done", int_value: 15}, {name: "nodes total", int_value: 32}] or metrics: [{name: "progress", double_value: 0.56}, {name: "progress scale", double_value: 1.0}]',
                                      },
                                    },
                                    description:
                                      "Information about operation (or operation stage) progress.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Substages of an operation or a stage.",
                                },
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
                                      stringValue: {
                                        type: "string",
                                        description:
                                          "For metrics with custom values (ratios, visual progress, etc.).",
                                      },
                                      intValue: {
                                        type: "string",
                                        description:
                                          "For metrics with integer value. (Format: int64)",
                                      },
                                      doubleValue: {
                                        type: "number",
                                        description:
                                          "For metrics with floating point value. (Format: double)",
                                      },
                                    },
                                    description:
                                      "Progress metric is (string, int|float|string) pair.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    'Progress metric bundle, for example: metrics: [{name: "nodes done", int_value: 15}, {name: "nodes total", int_value: 32}] or metrics: [{name: "progress", double_value: 0.56}, {name: "progress scale", double_value: 1.0}]',
                                },
                              },
                              description:
                                "Information about operation (or operation stage) progress.",
                              additionalProperties: true,
                            },
                            description:
                              "Substages of an operation or a stage.",
                          },
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
                                stringValue: {
                                  type: "string",
                                  description:
                                    "For metrics with custom values (ratios, visual progress, etc.).",
                                },
                                intValue: {
                                  type: "string",
                                  description:
                                    "For metrics with integer value. (Format: int64)",
                                },
                                doubleValue: {
                                  type: "number",
                                  description:
                                    "For metrics with floating point value. (Format: double)",
                                },
                              },
                              description:
                                "Progress metric is (string, int|float|string) pair.",
                              additionalProperties: true,
                            },
                            description:
                              'Progress metric bundle, for example: metrics: [{name: "nodes done", int_value: 15}, {name: "nodes total", int_value: 32}] or metrics: [{name: "progress", double_value: 0.56}, {name: "progress scale", double_value: 1.0}]',
                          },
                        },
                        description:
                          "Information about operation (or operation stage) progress.",
                        additionalProperties: true,
                      },
                      description: "Substages of an operation or a stage.",
                    },
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
                          stringValue: {
                            type: "string",
                            description:
                              "For metrics with custom values (ratios, visual progress, etc.).",
                          },
                          intValue: {
                            type: "string",
                            description:
                              "For metrics with integer value. (Format: int64)",
                          },
                          doubleValue: {
                            type: "number",
                            description:
                              "For metrics with floating point value. (Format: double)",
                          },
                        },
                        description:
                          "Progress metric is (string, int|float|string) pair.",
                        additionalProperties: true,
                      },
                      description:
                        'Progress metric bundle, for example: metrics: [{name: "nodes done", int_value: 15}, {name: "nodes total", int_value: 32}] or metrics: [{name: "progress", double_value: 0.56}, {name: "progress scale", double_value: 1.0}]',
                    },
                  },
                  description:
                    "Information about operation (or operation stage) progress.",
                  additionalProperties: true,
                },
                description: "Substages of an operation or a stage.",
              },
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
                    stringValue: {
                      type: "string",
                      description:
                        "For metrics with custom values (ratios, visual progress, etc.).",
                    },
                    intValue: {
                      type: "string",
                      description:
                        "For metrics with integer value. (Format: int64)",
                    },
                    doubleValue: {
                      type: "number",
                      description:
                        "For metrics with floating point value. (Format: double)",
                    },
                  },
                  description:
                    "Progress metric is (string, int|float|string) pair.",
                  additionalProperties: true,
                },
                description:
                  'Progress metric bundle, for example: metrics: [{name: "nodes done", int_value: 15}, {name: "nodes total", int_value: 32}] or metrics: [{name: "progress", double_value: 0.56}, {name: "progress scale", double_value: 1.0}]',
              },
            },
            description:
              "Information about operation (or operation stage) progress.",
            additionalProperties: true,
          },
          statusMessage: {
            type: "string",
            description:
              "Output only. If an error has occurred, a textual description of the error. Deprecated. Use the field error instead.",
          },
          nodepoolConditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "Human-friendly representation of the condition",
                },
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
          selfLink: {
            type: "string",
            description:
              "Output only. Server-defined URI for the operation. Example: `https://container.googleapis.com/v1alpha1/projects/123/locations/us-central1/operations/operation-123`.",
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
          zone: {
            type: "string",
            description:
              "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the operation is taking place. This field is deprecated, use location instead.",
          },
          endTime: {
            type: "string",
            description:
              "Output only. The time the operation completed, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
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
          targetLink: {
            type: "string",
            description:
              "Output only. Server-defined URI for the target of the operation. The format of this is a URI to the resource being modified (such as a cluster, node pool, or node). For node pool repairs, there may be multiple nodes being repaired, but only one will be the target. Examples: - ## `https://container.googleapis.com/v1/projects/123/locations/us-central1/clusters/my-cluster` ## `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np` `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np/node/my-node`",
          },
          detail: {
            type: "string",
            description:
              "Output only. Detailed operation progress, if available.",
          },
        },
        description:
          "This operation resource represents operations that may have happened or are happening on the cluster. All fields are output only.",
        additionalProperties: true,
      },
    },
  },
};

export default clustersSetMaintenancePolicy;
