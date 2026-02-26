import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const deleteCluster: AppBlock = {
  name: "Delete Cluster",
  description: `Deletes the cluster, including the Kubernetes endpoint and all worker nodes. Firewalls and routes that were configured during cluster creation are also deleted. Other Google Compute Engine resources that might be in use by the cluster, such as load balancer resources, are not deleted if they weren't present when the cluster was initially created.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        project_id: {
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
        cluster_id: {
          name: "Cluster Id",
          description:
            "Deprecated. The name of the cluster to delete. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the cluster to delete. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster) of the cluster to delete. Specified in the format `projects/*/locations/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster) of the cluster to delete. Specified in the format `projects/*/locations/*/clusters/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.project_id !== undefined)
          request.project_id = input.event.inputConfig.project_id;
        if (input.event.inputConfig.zone !== undefined)
          request.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.cluster_id !== undefined)
          request.cluster_id = input.event.inputConfig.cluster_id;
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteCluster(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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
          operation_type: {
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
          status_message: {
            type: "string",
            description:
              "Output only. If an error has occurred, a textual description of the error. Deprecated. Use the field error instead.",
          },
          self_link: {
            type: "string",
            description:
              "Output only. Server-defined URI for the operation. Example: `https://container.googleapis.com/v1alpha1/projects/123/locations/us-central1/operations/operation-123`.",
          },
          target_link: {
            type: "string",
            description:
              "Output only. Server-defined URI for the target of the operation. The format of this is a URI to the resource being modified (such as a cluster, node pool, or node). For node pool repairs, there may be multiple nodes being repaired, but only one will be the target.  Examples:  - ## `https://container.googleapis.com/v1/projects/123/locations/us-central1/clusters/my-cluster`  ## `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np`  `https://container.googleapis.com/v1/projects/123/zones/us-central1-c/clusters/my-cluster/nodePools/my-np/node/my-node`",
          },
          location: {
            type: "string",
            description:
              "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) or [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) in which the cluster resides.",
          },
          start_time: {
            type: "string",
            description:
              "Output only. The time the operation started, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
          },
          end_time: {
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
                    int_value: {
                      type: "string",
                      description:
                        "64-bit integer as string (Part of 'value' - only one field in this group can be set)",
                    },
                    double_value: {
                      type: "number",
                      description:
                        "For metrics with floating point value. (Part of 'value' - only one field in this group can be set)",
                    },
                    string_value: {
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
          cluster_conditions: {
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
                canonical_code: {
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
          nodepool_conditions: {
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
                canonical_code: {
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
                    type_url: {
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

export default deleteCluster;
