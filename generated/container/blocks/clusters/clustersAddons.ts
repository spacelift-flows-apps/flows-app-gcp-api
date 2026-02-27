import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const clustersAddons: AppBlock = {
  name: "Clusters - Addons",
  description: `Sets the addons for a specific cluster.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster) of the cluster to set addons.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster) of the cluster to set addons. Specified in the format `projects/*/locations/*/clusters/*`.",
          },
          required: false,
        },
        addonsConfig: {
          name: "Addons Config",
          description: "Required.",
          type: {
            type: "object",
            properties: {
              lustreCsiDriverConfig: {
                type: "object",
                properties: {
                  enableLegacyLustrePort: {
                    type: "boolean",
                    description:
                      "If set to true, the Lustre CSI driver will install Lustre kernel modules using port 6988. This serves as a workaround for a port conflict with the gke-metadata-server. This field is required ONLY under the following conditions: 1. The GKE node version is older than 1.33.2-gke.4655000. 2. You're connecting to a Lustre instance that has the 'gke-support-enabled' flag. Deprecated: This flag is no longer required as of GKE node version 1.33.2-gke.4655000, unless you are connecting to a Lustre instance that has the `gke-support-enabled` flag.",
                  },
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Lustre CSI driver is enabled for this cluster.",
                  },
                },
                description: "Configuration for the Lustre CSI driver.",
                additionalProperties: true,
              },
              statefulHaConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Stateful HA add-on is enabled for this cluster.",
                  },
                },
                description: "Configuration for the Stateful HA add-on.",
                additionalProperties: true,
              },
              gcePersistentDiskCsiDriverConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Compute Engine PD CSI driver is enabled for this cluster.",
                  },
                },
                description:
                  "Configuration for the Compute Engine PD CSI driver.",
                additionalProperties: true,
              },
              gkeBackupAgentConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Backup for GKE agent is enabled for this cluster.",
                  },
                },
                description: "Configuration for the Backup for GKE Agent.",
                additionalProperties: true,
              },
              gcpFilestoreCsiDriverConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Filestore CSI driver is enabled for this cluster.",
                  },
                },
                description: "Configuration for the Filestore CSI driver.",
                additionalProperties: true,
              },
              rayOperatorConfig: {
                type: "object",
                properties: {
                  rayClusterLoggingConfig: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description: "Enable log collection for Ray clusters.",
                      },
                    },
                    description:
                      "RayClusterLoggingConfig specifies configuration of Ray logging.",
                    additionalProperties: true,
                  },
                  rayClusterMonitoringConfig: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Enable metrics collection for Ray clusters.",
                      },
                    },
                    description:
                      "RayClusterMonitoringConfig specifies monitoring configuration for Ray clusters.",
                    additionalProperties: true,
                  },
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Ray Operator addon is enabled for this cluster.",
                  },
                },
                description:
                  "Configuration options for the Ray Operator add-on.",
                additionalProperties: true,
              },
              httpLoadBalancing: {
                type: "object",
                properties: {
                  disabled: {
                    type: "boolean",
                    description:
                      "Whether the HTTP Load Balancing controller is enabled in the cluster. When enabled, it runs a small pod in the cluster that manages the load balancers.",
                  },
                },
                description:
                  "Configuration options for the HTTP (L7) load balancing controller addon, which makes it easy to set up HTTP load balancers for services in a cluster.",
                additionalProperties: true,
              },
              highScaleCheckpointingConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the High Scale Checkpointing is enabled for this cluster.",
                  },
                },
                description: "Configuration for the High Scale Checkpointing.",
                additionalProperties: true,
              },
              parallelstoreCsiDriverConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Cloud Storage Parallelstore CSI driver is enabled for this cluster.",
                  },
                },
                description:
                  "Configuration for the Cloud Storage Parallelstore CSI driver.",
                additionalProperties: true,
              },
              dnsCacheConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether NodeLocal DNSCache is enabled for this cluster.",
                  },
                },
                description: "Configuration for NodeLocal DNSCache",
                additionalProperties: true,
              },
              horizontalPodAutoscaling: {
                type: "object",
                properties: {
                  disabled: {
                    type: "boolean",
                    description:
                      "Whether the Horizontal Pod Autoscaling feature is enabled in the cluster. When enabled, it ensures that metrics are collected into Stackdriver Monitoring.",
                  },
                },
                description:
                  "Configuration options for the horizontal pod autoscaling feature, which increases or decreases the number of replica pods a replication controller has based on the resource usage of the existing pods.",
                additionalProperties: true,
              },
              kubernetesDashboard: {
                type: "object",
                properties: {
                  disabled: {
                    type: "boolean",
                    description:
                      "Whether the Kubernetes Dashboard is enabled for this cluster.",
                  },
                },
                description: "Configuration for the Kubernetes Dashboard.",
                additionalProperties: true,
              },
              gcsFuseCsiDriverConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Cloud Storage Fuse CSI driver is enabled for this cluster.",
                  },
                },
                description:
                  "Configuration for the Cloud Storage Fuse CSI driver.",
                additionalProperties: true,
              },
              cloudRunConfig: {
                type: "object",
                properties: {
                  disabled: {
                    type: "boolean",
                    description:
                      "Whether Cloud Run addon is enabled for this cluster.",
                  },
                  loadBalancerType: {
                    type: "string",
                    enum: [
                      "LOAD_BALANCER_TYPE_UNSPECIFIED",
                      "LOAD_BALANCER_TYPE_EXTERNAL",
                      "LOAD_BALANCER_TYPE_INTERNAL",
                    ],
                    description:
                      "Which load balancer type is installed for Cloud Run.",
                  },
                },
                description: "Configuration options for the Cloud Run feature.",
                additionalProperties: true,
              },
              networkPolicyConfig: {
                type: "object",
                properties: {
                  disabled: {
                    type: "boolean",
                    description:
                      "Whether NetworkPolicy is enabled for this cluster.",
                  },
                },
                description:
                  "Configuration for NetworkPolicy. This only tracks whether the addon is enabled or not on the Master, it does not track whether network policy is enabled for the nodes.",
                additionalProperties: true,
              },
              configConnectorConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether Cloud Connector is enabled for this cluster.",
                  },
                },
                description:
                  "Configuration options for the Config Connector add-on.",
                additionalProperties: true,
              },
            },
            description:
              "Configuration for the addons that can be automatically spun up in the cluster, enabling additional functionality.",
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
        let path = `v1/projects/{projectId}/zones/{zone}/clusters/{clusterId}/addons`;

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
        if (input.event.inputConfig.addonsConfig !== undefined)
          requestBody.addonsConfig = input.event.inputConfig.addonsConfig;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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

export default clustersAddons;
