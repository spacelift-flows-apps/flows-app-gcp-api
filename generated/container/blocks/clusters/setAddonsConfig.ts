import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  projectId: "project_id",
  clusterId: "cluster_id",
  addonsConfig: {
    name: "addons_config",
    fields: {
      httpLoadBalancing: "http_load_balancing",
      horizontalPodAutoscaling: "horizontal_pod_autoscaling",
      kubernetesDashboard: "kubernetes_dashboard",
      networkPolicyConfig: "network_policy_config",
      cloudRunConfig: {
        name: "cloud_run_config",
        fields: {
          loadBalancerType: "load_balancer_type",
        },
      },
      dnsCacheConfig: "dns_cache_config",
      configConnectorConfig: "config_connector_config",
      gcePersistentDiskCsiDriverConfig: "gce_persistent_disk_csi_driver_config",
      gcpFilestoreCsiDriverConfig: "gcp_filestore_csi_driver_config",
      gkeBackupAgentConfig: "gke_backup_agent_config",
      gcsFuseCsiDriverConfig: "gcs_fuse_csi_driver_config",
      statefulHaConfig: "stateful_ha_config",
      parallelstoreCsiDriverConfig: "parallelstore_csi_driver_config",
      rayOperatorConfig: {
        name: "ray_operator_config",
        fields: {
          rayClusterLoggingConfig: "ray_cluster_logging_config",
          rayClusterMonitoringConfig: "ray_cluster_monitoring_config",
        },
      },
      highScaleCheckpointingConfig: "high_scale_checkpointing_config",
      lustreCsiDriverConfig: {
        name: "lustre_csi_driver_config",
        fields: {
          enableLegacyLustrePort: "enable_legacy_lustre_port",
        },
      },
      sliceControllerConfig: "slice_controller_config",
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

const setAddonsConfig: AppBlock = {
  name: "Set Addons Config",
  description: `Sets the addons for a specific cluster.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        projectId: {
          name: "Project Id",
          description:
            "Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        zone: {
          name: "Zone",
          description:
            "Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        clusterId: {
          name: "Cluster Id",
          description:
            "Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        addonsConfig: {
          name: "Addons Config",
          description:
            "Required. The desired configurations for the various addons available to run in the cluster.",
          type: {
            type: "object",
            properties: {
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
              rayOperatorConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Ray Operator addon is enabled for this cluster.",
                  },
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
                },
                description:
                  "Configuration options for the Ray Operator add-on.",
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
              lustreCsiDriverConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the Lustre CSI driver is enabled for this cluster.",
                  },
                  enableLegacyLustrePort: {
                    type: "boolean",
                    description:
                      "If set to true, the Lustre CSI driver will install Lustre kernel modules using port 6988. This serves as a workaround for a port conflict with the gke-metadata-server. This field is required ONLY under the following conditions: 1. The GKE node version is older than 1.33.2-gke.4655000. 2. You're connecting to a Lustre instance that has the 'gke-support-enabled' flag. Deprecated: This flag is no longer required as of GKE node version 1.33.2-gke.4655000, unless you are connecting to a Lustre instance that has the `gke-support-enabled` flag.",
                  },
                },
                description: "Configuration for the Lustre CSI driver.",
                additionalProperties: true,
              },
              sliceControllerConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Optional. Indicates whether Slice Controller is enabled in the cluster.",
                  },
                },
                description: "Configuration for the Slice Controller.",
                additionalProperties: true,
              },
            },
            description:
              "Configuration for the addons that can be automatically spun up in the cluster, enabling additional functionality.",
            additionalProperties: true,
          },
          required: true,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster) of the cluster to set addons. Specified in the format `projects/*/locations/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster) of the cluster to set addons. Specified in the format `projects/*/locations/*/clusters/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.setAddonsConfig(request, (err: any, response: any) => {
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

export default setAddonsConfig;
