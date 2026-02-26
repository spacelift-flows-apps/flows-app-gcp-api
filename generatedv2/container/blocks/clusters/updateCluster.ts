import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const updateCluster: AppBlock = {
  name: "Update Cluster",
  description: `Updates the settings of a specific cluster.`,
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
            "Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the cluster to upgrade. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        update: {
          name: "Update",
          description: "Required. A description of the update.",
          type: {
            type: "object",
            properties: {
              desired_node_version: {
                type: "string",
                description:
                  'The Kubernetes version to change the nodes to (typically an upgrade).  Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior:  - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "-": picks the Kubernetes master version',
              },
              desired_monitoring_service: {
                type: "string",
                description:
                  "The monitoring service the cluster should use to write metrics. Currently available options:  * `monitoring.googleapis.com/kubernetes` - The Cloud Monitoring service with a Kubernetes-native resource model * `monitoring.googleapis.com` - The legacy Cloud Monitoring service (no   longer available as of GKE 1.15). * `none` - No metrics will be exported from the cluster.  If left as an empty string,`monitoring.googleapis.com/kubernetes` will be used for GKE 1.14+ or `monitoring.googleapis.com` for earlier versions.",
              },
              desired_addons_config: {
                type: "object",
                properties: {
                  http_load_balancing: {
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
                  horizontal_pod_autoscaling: {
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
                  kubernetes_dashboard: {
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
                  network_policy_config: {
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
                  cloud_run_config: {
                    type: "object",
                    properties: {
                      disabled: {
                        type: "boolean",
                        description:
                          "Whether Cloud Run addon is enabled for this cluster.",
                      },
                      load_balancer_type: {
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
                    description:
                      "Configuration options for the Cloud Run feature.",
                    additionalProperties: true,
                  },
                  dns_cache_config: {
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
                  config_connector_config: {
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
                  gce_persistent_disk_csi_driver_config: {
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
                  gcp_filestore_csi_driver_config: {
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
                  gke_backup_agent_config: {
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
                  gcs_fuse_csi_driver_config: {
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
                  stateful_ha_config: {
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
                  parallelstore_csi_driver_config: {
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
                  ray_operator_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Whether the Ray Operator addon is enabled for this cluster.",
                      },
                      ray_cluster_logging_config: {
                        type: "object",
                        properties: {
                          enabled: {
                            type: "boolean",
                            description:
                              "Enable log collection for Ray clusters.",
                          },
                        },
                        description:
                          "RayClusterLoggingConfig specifies configuration of Ray logging.",
                        additionalProperties: true,
                      },
                      ray_cluster_monitoring_config: {
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
                  high_scale_checkpointing_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Whether the High Scale Checkpointing is enabled for this cluster.",
                      },
                    },
                    description:
                      "Configuration for the High Scale Checkpointing.",
                    additionalProperties: true,
                  },
                  lustre_csi_driver_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Whether the Lustre CSI driver is enabled for this cluster.",
                      },
                      enable_legacy_lustre_port: {
                        type: "boolean",
                        description:
                          "If set to true, the Lustre CSI driver will install Lustre kernel modules using port 6988. This serves as a workaround for a port conflict with the gke-metadata-server. This field is required ONLY under the following conditions: 1. The GKE node version is older than 1.33.2-gke.4655000. 2. You're connecting to a Lustre instance that has the 'gke-support-enabled' flag. Deprecated: This flag is no longer required as of GKE node version 1.33.2-gke.4655000, unless you are connecting to a Lustre instance that has the `gke-support-enabled` flag.",
                      },
                    },
                    description: "Configuration for the Lustre CSI driver.",
                    additionalProperties: true,
                  },
                  slice_controller_config: {
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
              desired_node_pool_id: {
                type: "string",
                description:
                  'The node pool to be upgraded. This field is mandatory if "desired_node_version", "desired_image_family" or "desired_node_pool_autoscaling" is specified and there is more than one node pool on the cluster.',
              },
              desired_image_type: {
                type: "string",
                description:
                  'The desired image type for the node pool. NOTE: Set the "desired_node_pool" field as well.',
              },
              desired_database_encryption: {
                type: "object",
                properties: {
                  key_name: {
                    type: "string",
                    description:
                      "Name of CloudKMS key to use for the encryption of secrets in etcd. Ex. projects/my-project/locations/global/keyRings/my-ring/cryptoKeys/my-key",
                  },
                  state: {
                    type: "string",
                    enum: ["UNKNOWN", "ENCRYPTED", "DECRYPTED"],
                    description: "The desired state of etcd encryption.",
                  },
                },
                description: "Configuration of etcd encryption.",
                additionalProperties: true,
              },
              desired_workload_identity_config: {
                type: "object",
                properties: {
                  workload_pool: {
                    type: "string",
                    description:
                      "The workload pool to attach all Kubernetes service accounts to.",
                  },
                },
                description:
                  "Configuration for the use of Kubernetes Service Accounts in IAM policies.",
                additionalProperties: true,
              },
              desired_mesh_certificates: {
                type: "object",
                properties: {
                  enable_certificates: {
                    type: "boolean",
                    description:
                      "enable_certificates controls issuance of workload mTLS certificates.  If set, the GKE Workload Identity Certificates controller and node agent will be deployed in the cluster, which can then be configured by creating a WorkloadCertificateConfig Custom Resource.  Requires Workload Identity ([workload_pool][google.container.v1.WorkloadIdentityConfig.workload_pool] must be non-empty).",
                  },
                },
                description:
                  "Configuration for issuance of mTLS keys and certificates to Kubernetes pods.",
                additionalProperties: true,
              },
              desired_shielded_nodes: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether Shielded Nodes features are enabled on all nodes in this cluster.",
                  },
                },
                description: "Configuration of Shielded Nodes feature.",
                additionalProperties: true,
              },
              desired_cost_management_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Whether the feature is enabled or not.",
                  },
                },
                description:
                  "Configuration for fine-grained cost management feature.",
                additionalProperties: true,
              },
              desired_dns_config: {
                type: "object",
                properties: {
                  cluster_dns: {
                    type: "string",
                    enum: [
                      "PROVIDER_UNSPECIFIED",
                      "PLATFORM_DEFAULT",
                      "CLOUD_DNS",
                      "KUBE_DNS",
                    ],
                    description:
                      "cluster_dns indicates which in-cluster DNS provider should be used.",
                  },
                  cluster_dns_scope: {
                    type: "string",
                    enum: [
                      "DNS_SCOPE_UNSPECIFIED",
                      "CLUSTER_SCOPE",
                      "VPC_SCOPE",
                    ],
                    description:
                      "cluster_dns_scope indicates the scope of access to cluster DNS records.",
                  },
                  cluster_dns_domain: {
                    type: "string",
                    description:
                      "cluster_dns_domain is the suffix used for all cluster service records.",
                  },
                  additive_vpc_scope_dns_domain: {
                    type: "string",
                    description:
                      "Optional. The domain used in Additive VPC scope.",
                  },
                },
                description:
                  "DNSConfig contains the desired set of options for configuring clusterDNS.",
                additionalProperties: true,
              },
              desired_node_pool_autoscaling: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Is autoscaling enabled for this node pool.",
                  },
                  min_node_count: {
                    type: "integer",
                    description:
                      "Minimum number of nodes for one location in the node pool. Must be greater than or equal to 0 and less than or equal to max_node_count.",
                  },
                  max_node_count: {
                    type: "integer",
                    description:
                      "Maximum number of nodes for one location in the node pool. Must be >= min_node_count. There has to be enough quota to scale up the cluster.",
                  },
                  autoprovisioned: {
                    type: "boolean",
                    description: "Can this node pool be deleted automatically.",
                  },
                  location_policy: {
                    type: "string",
                    enum: ["LOCATION_POLICY_UNSPECIFIED", "BALANCED", "ANY"],
                    description:
                      "Location policy used when scaling up a nodepool.",
                  },
                  total_min_node_count: {
                    type: "integer",
                    description:
                      "Minimum number of nodes in the node pool. Must be greater than or equal to 0 and less than or equal to total_max_node_count. The total_*_node_count fields are mutually exclusive with the *_node_count fields.",
                  },
                  total_max_node_count: {
                    type: "integer",
                    description:
                      "Maximum number of nodes in the node pool. Must be greater than or equal to total_min_node_count. There has to be enough quota to scale up the cluster. The total_*_node_count fields are mutually exclusive with the *_node_count fields.",
                  },
                },
                description:
                  "NodePoolAutoscaling contains information required by cluster autoscaler to adjust the size of the node pool to the current cluster usage.",
                additionalProperties: true,
              },
              desired_locations: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The desired list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the cluster's nodes should be located.  This list must always include the cluster's primary zone.  Warning: changing cluster locations will update the locations of all node pools and will result in nodes being added and/or removed.",
              },
              desired_master_authorized_networks_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether or not master authorized networks is enabled.",
                  },
                  cidr_blocks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        display_name: {
                          type: "string",
                          description:
                            "display_name is an optional field for users to identify CIDR blocks.",
                        },
                        cidr_block: {
                          type: "string",
                          description:
                            "cidr_block must be specified in CIDR notation.",
                        },
                      },
                      description:
                        "CidrBlock contains an optional name and one CIDR block.",
                      additionalProperties: true,
                    },
                    description:
                      "cidr_blocks define up to 50 external networks that could access Kubernetes master through HTTPS.",
                  },
                  gcp_public_cidrs_access_enabled: {
                    type: "boolean",
                    description:
                      "Whether master is accessible via Google Compute Engine Public IP addresses.",
                  },
                  private_endpoint_enforcement_enabled: {
                    type: "boolean",
                    description:
                      "Whether master authorized networks is enforced on private endpoint or not.",
                  },
                },
                description:
                  "Configuration options for the master authorized networks feature. Enabled master authorized networks will disallow all external traffic to access Kubernetes master through HTTPS except traffic from the given CIDR blocks, Google Compute Engine Public IPs and Google Prod IPs.",
                additionalProperties: true,
              },
              desired_cluster_autoscaling: {
                type: "object",
                properties: {
                  enable_node_autoprovisioning: {
                    type: "boolean",
                    description:
                      "Enables automatic node pool creation and deletion.",
                  },
                  resource_limits: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        resource_type: {
                          type: "string",
                          description:
                            'Resource name "cpu", "memory" or gpu-specific string.',
                        },
                        minimum: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        maximum: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      description:
                        "Contains information about amount of some resource in the cluster. For memory, value should be in GB.",
                      additionalProperties: true,
                    },
                    description:
                      "Contains global constraints regarding minimum and maximum amount of resources in the cluster.",
                  },
                  autoscaling_profile: {
                    type: "string",
                    enum: [
                      "PROFILE_UNSPECIFIED",
                      "OPTIMIZE_UTILIZATION",
                      "BALANCED",
                    ],
                    description: "Defines autoscaling behaviour.",
                  },
                  autoprovisioning_node_pool_defaults: {
                    type: "object",
                    properties: {
                      oauth_scopes: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Scopes that are used by NAP when creating node pools.",
                      },
                      service_account: {
                        type: "string",
                        description:
                          "The Google Cloud Platform Service Account to be used by the node VMs.",
                      },
                      upgrade_settings: {
                        type: "object",
                        properties: {
                          max_surge: {
                            type: "integer",
                            description:
                              "The maximum number of nodes that can be created beyond the current size of the node pool during the upgrade process.",
                          },
                          max_unavailable: {
                            type: "integer",
                            description:
                              "The maximum number of nodes that can be simultaneously unavailable during the upgrade process. A node is considered available if its status is Ready.",
                          },
                          strategy: {
                            type: "string",
                            enum: [
                              "NODE_POOL_UPDATE_STRATEGY_UNSPECIFIED",
                              "BLUE_GREEN",
                              "SURGE",
                              "SHORT_LIVED",
                            ],
                            description: "Strategy used for node pool update.",
                          },
                          blue_green_settings: {
                            type: "object",
                            properties: {
                              standard_rollout_policy: {
                                type: "object",
                                properties: {
                                  batch_percentage: {
                                    type: "number",
                                    description:
                                      "Percentage of the blue pool nodes to drain in a batch. The range of this field should be (0.0, 1.0]. (Part of 'update_batch_size' - only one field in this group can be set)",
                                  },
                                  batch_node_count: {
                                    type: "integer",
                                    description:
                                      "Number of blue nodes to drain in a batch. (Part of 'update_batch_size' - only one field in this group can be set)",
                                  },
                                  batch_soak_duration: {
                                    type: "string",
                                    description:
                                      "Duration string (e.g., '1.5s', '300s')",
                                  },
                                },
                                description:
                                  "Standard rollout policy is the default policy for blue-green. (Part of 'rollout_policy' - only one field in this group can be set)",
                                additionalProperties: true,
                              },
                              autoscaled_rollout_policy: {
                                type: "object",
                                properties: {
                                  wait_for_drain_duration: {
                                    type: "string",
                                    description:
                                      "Duration string (e.g., '1.5s', '300s')",
                                  },
                                },
                                description:
                                  "Autoscaled rollout policy utilizes the cluster autoscaler during blue-green upgrade to scale both the blue and green pools. (Part of 'rollout_policy' - only one field in this group can be set)",
                                additionalProperties: true,
                              },
                              node_pool_soak_duration: {
                                type: "string",
                                description:
                                  "Duration string (e.g., '1.5s', '300s')",
                              },
                            },
                            description: "Settings for blue-green upgrade.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "These upgrade settings control the level of parallelism and the level of disruption caused by an upgrade.  maxUnavailable controls the number of nodes that can be simultaneously unavailable.  maxSurge controls the number of additional nodes that can be added to the node pool temporarily for the time of the upgrade to increase the number of available nodes.  (maxUnavailable + maxSurge) determines the level of parallelism (how many nodes are being upgraded at the same time).  Note: upgrades inevitably introduce some disruption since workloads need to be moved from old nodes to new, upgraded ones. Even if maxUnavailable=0, this holds true. (Disruption stays within the limits of PodDisruptionBudget, if it is configured.)  Consider a hypothetical node pool with 5 nodes having maxSurge=2, maxUnavailable=1. This means the upgrade process upgrades 3 nodes simultaneously. It creates 2 additional (upgraded) nodes, then it brings down 3 old (not yet upgraded) nodes at the same time. This ensures that there are always at least 4 nodes available.  These upgrade settings configure the upgrade strategy for the node pool. Use strategy to switch between the strategies applied to the node pool.  If the strategy is ROLLING, use max_surge and max_unavailable to control the level of parallelism and the level of disruption caused by upgrade. 1. maxSurge controls the number of additional nodes that can be added to the node pool temporarily for the time of the upgrade to increase the number of available nodes. 2. maxUnavailable controls the number of nodes that can be simultaneously unavailable. 3. (maxUnavailable + maxSurge) determines the level of parallelism (how many nodes are being upgraded at the same time).  If the strategy is BLUE_GREEN, use blue_green_settings to configure the blue-green upgrade related settings. 1. standard_rollout_policy is the default policy. The policy is used to control the way blue pool gets drained. The draining is executed in the batch mode. The batch size could be specified as either percentage of the node pool size or the number of nodes. batch_soak_duration is the soak time after each batch gets drained. 2. node_pool_soak_duration is the soak time after all blue nodes are drained. After this period, the blue pool nodes will be deleted.",
                        additionalProperties: true,
                      },
                      management: {
                        type: "object",
                        properties: {
                          auto_upgrade: {
                            type: "boolean",
                            description:
                              "A flag that specifies whether node auto-upgrade is enabled for the node pool. If enabled, node auto-upgrade helps keep the nodes in your node pool up to date with the latest release version of Kubernetes.",
                          },
                          auto_repair: {
                            type: "boolean",
                            description:
                              "A flag that specifies whether the node auto-repair is enabled for the node pool. If enabled, the nodes in this node pool will be monitored and, if they fail health checks too many times, an automatic repair action will be triggered.",
                          },
                          upgrade_options: {
                            type: "object",
                            properties: {},
                            description:
                              "AutoUpgradeOptions defines the set of options for the user to control how the Auto Upgrades will proceed.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "NodeManagement defines the set of node management services turned on for the node pool.",
                        additionalProperties: true,
                      },
                      min_cpu_platform: {
                        type: "string",
                        description:
                          'Deprecated. Minimum CPU platform to be used for NAP created node pools. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as minCpuPlatform: Intel Haswell or minCpuPlatform: Intel Sandy Bridge. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform). This field is deprecated, min_cpu_platform should be specified using `cloud.google.com/requested-min-cpu-platform` label selector on the pod. To unset the min cpu platform field pass "automatic" as field value.',
                      },
                      disk_size_gb: {
                        type: "integer",
                        description:
                          "Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB.  If unspecified, the default disk size is 100GB.",
                      },
                      disk_type: {
                        type: "string",
                        description:
                          "Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced')  If unspecified, the default disk type is 'pd-standard'",
                      },
                      shielded_instance_config: {
                        type: "object",
                        properties: {
                          enable_secure_boot: {
                            type: "boolean",
                            description:
                              "Defines whether the instance has Secure Boot enabled.  Secure Boot helps ensure that the system only runs authentic software by verifying the digital signature of all boot components, and halting the boot process if signature verification fails.",
                          },
                          enable_integrity_monitoring: {
                            type: "boolean",
                            description:
                              "Defines whether the instance has integrity monitoring enabled.  Enables monitoring and attestation of the boot integrity of the instance. The attestation is performed against the integrity policy baseline. This baseline is initially derived from the implicitly trusted boot image when the instance is created.",
                          },
                        },
                        description: "A set of Shielded Instance options.",
                        additionalProperties: true,
                      },
                      boot_disk_kms_key: {
                        type: "string",
                        description:
                          "The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption",
                      },
                      image_type: {
                        type: "string",
                        description:
                          "The image type to use for NAP created node. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.",
                      },
                      insecure_kubelet_readonly_port_enabled: {
                        type: "boolean",
                        description:
                          "DEPRECATED. Use NodePoolAutoConfig.NodeKubeletConfig instead.",
                      },
                    },
                    description:
                      "AutoprovisioningNodePoolDefaults contains defaults for a node pool created by NAP.",
                    additionalProperties: true,
                  },
                  autoprovisioning_locations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the NodePool's nodes can be created by NAP.",
                  },
                  default_compute_class_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description: "Enables default compute class.",
                      },
                    },
                    description:
                      "DefaultComputeClassConfig defines default compute class  configuration.",
                    additionalProperties: true,
                  },
                  autopilot_general_profile: {
                    type: "string",
                    enum: [
                      "AUTOPILOT_GENERAL_PROFILE_UNSPECIFIED",
                      "NO_PERFORMANCE",
                    ],
                    description:
                      "Autopilot general profile for the cluster, which defines the configuration for the cluster.",
                  },
                },
                description:
                  "ClusterAutoscaling contains global, per-cluster information required by Cluster Autoscaler to automatically adjust the size of the cluster and create/delete node pools based on the current needs.",
                additionalProperties: true,
              },
              desired_binary_authorization: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "This field is deprecated. Leave this unset and instead configure BinaryAuthorization using evaluation_mode. If evaluation_mode is set to anything other than EVALUATION_MODE_UNSPECIFIED, this field is ignored.",
                  },
                  evaluation_mode: {
                    type: "string",
                    enum: [
                      "EVALUATION_MODE_UNSPECIFIED",
                      "DISABLED",
                      "PROJECT_SINGLETON_POLICY_ENFORCE",
                    ],
                    description:
                      "Mode of operation for binauthz policy evaluation. If unspecified, defaults to DISABLED.",
                  },
                },
                description: "Configuration for Binary Authorization.",
                additionalProperties: true,
              },
              desired_logging_service: {
                type: "string",
                description:
                  "The logging service the cluster should use to write logs. Currently available options:  * `logging.googleapis.com/kubernetes` - The Cloud Logging service with a Kubernetes-native resource model * `logging.googleapis.com` - The legacy Cloud Logging service (no longer   available as of GKE 1.15). * `none` - no logs will be exported from the cluster.  If left as an empty string,`logging.googleapis.com/kubernetes` will be used for GKE 1.14+ or `logging.googleapis.com` for earlier versions.",
              },
              desired_resource_usage_export_config: {
                type: "object",
                properties: {
                  bigquery_destination: {
                    type: "object",
                    properties: {
                      dataset_id: {
                        type: "string",
                        description: "The ID of a BigQuery Dataset.",
                      },
                    },
                    description:
                      "Parameters for using BigQuery as the destination of resource usage export.",
                    additionalProperties: true,
                  },
                  enable_network_egress_metering: {
                    type: "boolean",
                    description:
                      "Whether to enable network egress metering for this cluster. If enabled, a daemonset will be created in the cluster to meter network egress traffic.",
                  },
                  consumption_metering_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Whether to enable consumption metering for this cluster. If enabled, a second BigQuery table will be created to hold resource consumption records.",
                      },
                    },
                    description:
                      "Parameters for controlling consumption metering.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Configuration for exporting cluster resource usages.",
                additionalProperties: true,
              },
              desired_vertical_pod_autoscaling: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Enables vertical pod autoscaling.",
                  },
                },
                description:
                  "VerticalPodAutoscaling contains global, per-cluster information required by Vertical Pod Autoscaler to automatically adjust the resources of pods controlled by it.",
                additionalProperties: true,
              },
              desired_private_cluster_config: {
                type: "object",
                properties: {
                  enable_private_nodes: {
                    type: "boolean",
                    description:
                      "Whether nodes have internal IP addresses only. If enabled, all nodes are given only RFC 1918 private addresses and communicate with the master via private networking.  Deprecated: Use [NetworkConfig.default_enable_private_nodes][google.container.v1.NetworkConfig.default_enable_private_nodes] instead.",
                  },
                  enable_private_endpoint: {
                    type: "boolean",
                    description:
                      "Whether the master's internal IP address is used as the cluster endpoint.  Deprecated: Use [ControlPlaneEndpointsConfig.IPEndpointsConfig.enable_public_endpoint][google.container.v1.ControlPlaneEndpointsConfig.IPEndpointsConfig.enable_public_endpoint] instead. Note that the value of enable_public_endpoint is reversed: if enable_private_endpoint is false, then enable_public_endpoint will be true.",
                  },
                  master_ipv4_cidr_block: {
                    type: "string",
                    description:
                      "The IP range in CIDR notation to use for the hosted master network. This range will be used for assigning internal IP addresses to the master or set of masters, as well as the ILB VIP. This range must not overlap with any other ranges in use within the cluster's network.",
                  },
                  master_global_access_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Whenever master is accessible globally or not.",
                      },
                    },
                    description:
                      "Configuration for controlling master global access settings.",
                    additionalProperties: true,
                  },
                  private_endpoint_subnetwork: {
                    type: "string",
                    description:
                      "Subnet to provision the master's private endpoint during cluster creation. Specified in projects/*/regions/*/subnetworks/* format.  Deprecated: Use [ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint_subnetwork][google.container.v1.ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint_subnetwork] instead.",
                  },
                },
                description: "Configuration options for private clusters.",
                additionalProperties: true,
              },
              desired_intra_node_visibility_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Enables intra node visibility for this cluster.",
                  },
                },
                description:
                  "IntraNodeVisibilityConfig contains the desired config of the intra-node visibility on this cluster.",
                additionalProperties: true,
              },
              desired_default_snat_status: {
                type: "object",
                properties: {
                  disabled: {
                    type: "boolean",
                    description: "Disables cluster default sNAT rules.",
                  },
                },
                description:
                  "DefaultSnatStatus contains the desired state of whether default sNAT should be disabled on the cluster.",
                additionalProperties: true,
              },
              desired_release_channel: {
                type: "object",
                properties: {
                  channel: {
                    type: "string",
                    enum: [
                      "UNSPECIFIED",
                      "RAPID",
                      "REGULAR",
                      "STABLE",
                      "EXTENDED",
                    ],
                    description:
                      "channel specifies which release channel the cluster is subscribed to.",
                  },
                },
                description:
                  "ReleaseChannel indicates which release channel a cluster is subscribed to. Release channels are arranged in order of risk.  When a cluster is subscribed to a release channel, Google maintains both the master version and the node version. Node auto-upgrade defaults to true and cannot be disabled.",
                additionalProperties: true,
              },
              desired_l4ilb_subsetting_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Enables l4 ILB subsetting for this cluster.",
                  },
                },
                description:
                  "ILBSubsettingConfig contains the desired config of L4 Internal LoadBalancer subsetting on this cluster.",
                additionalProperties: true,
              },
              desired_datapath_provider: {
                type: "string",
                enum: [
                  "DATAPATH_PROVIDER_UNSPECIFIED",
                  "LEGACY_DATAPATH",
                  "ADVANCED_DATAPATH",
                ],
                description:
                  "The datapath provider selects the implementation of the Kubernetes networking model for service resolution and network policy enforcement.",
              },
              desired_private_ipv6_google_access: {
                type: "string",
                enum: [
                  "PRIVATE_IPV6_GOOGLE_ACCESS_UNSPECIFIED",
                  "PRIVATE_IPV6_GOOGLE_ACCESS_DISABLED",
                  "PRIVATE_IPV6_GOOGLE_ACCESS_TO_GOOGLE",
                  "PRIVATE_IPV6_GOOGLE_ACCESS_BIDIRECTIONAL",
                ],
                description:
                  "PrivateIPv6GoogleAccess controls whether and how the pods can communicate with Google Services through gRPC over IPv6.",
              },
              desired_notification_config: {
                type: "object",
                properties: {
                  pubsub: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description: "Enable notifications for Pub/Sub.",
                      },
                      topic: {
                        type: "string",
                        description:
                          "The desired Pub/Sub topic to which notifications will be sent by GKE. Format is `projects/{project}/topics/{topic}`.",
                      },
                      filter: {
                        type: "object",
                        properties: {
                          event_type: {
                            type: "array",
                            items: {
                              type: "string",
                              enum: [
                                "EVENT_TYPE_UNSPECIFIED",
                                "UPGRADE_AVAILABLE_EVENT",
                                "UPGRADE_EVENT",
                                "SECURITY_BULLETIN_EVENT",
                                "UPGRADE_INFO_EVENT",
                              ],
                            },
                            description: "Event types to allowlist.",
                          },
                        },
                        description:
                          "Allows filtering to one or more specific event types. If event types are present, those and only those event types will be transmitted to the cluster. Other types will be skipped. If no filter is specified, or no event types are present, all event types will be sent",
                        additionalProperties: true,
                      },
                    },
                    description: "Pub/Sub specific notification config.",
                    additionalProperties: true,
                  },
                },
                description:
                  "NotificationConfig is the configuration of notifications.",
                additionalProperties: true,
              },
              desired_authenticator_groups_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether this cluster should return group membership lookups during authentication using a group of security groups.",
                  },
                  security_group: {
                    type: "string",
                    description:
                      "The name of the security group-of-groups to be used. Only relevant if enabled = true.",
                  },
                },
                description:
                  "Configuration for returning group information from authenticators.",
                additionalProperties: true,
              },
              desired_logging_config: {
                type: "object",
                properties: {
                  component_config: {
                    type: "object",
                    properties: {
                      enable_components: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "COMPONENT_UNSPECIFIED",
                            "SYSTEM_COMPONENTS",
                            "WORKLOADS",
                            "APISERVER",
                            "SCHEDULER",
                            "CONTROLLER_MANAGER",
                            "KCP_SSHD",
                            "KCP_CONNECTION",
                            "KCP_HPA",
                          ],
                        },
                        description:
                          "Select components to collect logs. An empty set would disable all logging.",
                      },
                    },
                    description:
                      "LoggingComponentConfig is cluster logging component configuration.",
                    additionalProperties: true,
                  },
                },
                description: "LoggingConfig is cluster logging configuration.",
                additionalProperties: true,
              },
              desired_monitoring_config: {
                type: "object",
                properties: {
                  component_config: {
                    type: "object",
                    properties: {
                      enable_components: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "COMPONENT_UNSPECIFIED",
                            "SYSTEM_COMPONENTS",
                            "APISERVER",
                            "SCHEDULER",
                            "CONTROLLER_MANAGER",
                            "STORAGE",
                            "HPA",
                            "POD",
                            "DAEMONSET",
                            "DEPLOYMENT",
                            "STATEFULSET",
                            "CADVISOR",
                            "KUBELET",
                            "DCGM",
                            "JOBSET",
                          ],
                        },
                        description:
                          "Select components to collect metrics. An empty set would disable all monitoring.",
                      },
                    },
                    description:
                      "MonitoringComponentConfig is cluster monitoring component configuration.",
                    additionalProperties: true,
                  },
                  managed_prometheus_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description: "Enable Managed Collection.",
                      },
                      auto_monitoring_config: {
                        type: "object",
                        properties: {
                          scope: {
                            type: "string",
                            enum: ["SCOPE_UNSPECIFIED", "ALL", "NONE"],
                            description:
                              "Scope for GKE Workload Auto-Monitoring.",
                          },
                        },
                        description:
                          "AutoMonitoringConfig defines the configuration for GKE Workload Auto-Monitoring.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "ManagedPrometheusConfig defines the configuration for Google Cloud Managed Service for Prometheus.",
                    additionalProperties: true,
                  },
                  advanced_datapath_observability_config: {
                    type: "object",
                    properties: {
                      enable_metrics: {
                        type: "boolean",
                        description: "Expose flow metrics on nodes",
                      },
                      relay_mode: {
                        type: "string",
                        enum: [
                          "RELAY_MODE_UNSPECIFIED",
                          "DISABLED",
                          "INTERNAL_VPC_LB",
                          "EXTERNAL_LB",
                        ],
                        description: "Method used to make Relay available",
                      },
                      enable_relay: {
                        type: "boolean",
                        description: "Enable Relay component",
                      },
                    },
                    description:
                      "AdvancedDatapathObservabilityConfig specifies configuration of observability features of advanced datapath.",
                    additionalProperties: true,
                  },
                },
                description:
                  "MonitoringConfig is cluster monitoring configuration.",
                additionalProperties: true,
              },
              desired_identity_service_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether to enable the Identity Service component",
                  },
                },
                description:
                  "IdentityServiceConfig is configuration for Identity Service which allows customers to use external identity providers with the K8S API",
                additionalProperties: true,
              },
              desired_service_external_ips_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether Services with ExternalIPs field are allowed or not.",
                  },
                },
                description: "Config to block services with externalIPs field.",
                additionalProperties: true,
              },
              desired_enable_private_endpoint: {
                type: "boolean",
                description:
                  "Enable/Disable private endpoint for the cluster's master.  Deprecated: Use desired_control_plane_endpoints_config.ip_endpoints_config.enable_public_endpoint instead. Note that the value of enable_public_endpoint is reversed: if enable_private_endpoint is false, then enable_public_endpoint will be true.",
              },
              desired_default_enable_private_nodes: {
                type: "boolean",
                description:
                  "Override the default setting of whether future created nodes have private IP addresses only, namely [NetworkConfig.default_enable_private_nodes][google.container.v1.NetworkConfig.default_enable_private_nodes]",
              },
              desired_control_plane_endpoints_config: {
                type: "object",
                properties: {
                  dns_endpoint_config: {
                    type: "object",
                    properties: {
                      allow_external_traffic: {
                        type: "boolean",
                        description:
                          "Controls whether user traffic is allowed over this endpoint. Note that Google-managed services may still use the endpoint even if this is false.",
                      },
                      enable_k8s_tokens_via_dns: {
                        type: "boolean",
                        description:
                          "Controls whether the k8s token auth is allowed via DNS.",
                      },
                      enable_k8s_certs_via_dns: {
                        type: "boolean",
                        description:
                          "Controls whether the k8s certs auth is allowed via DNS.",
                      },
                    },
                    description:
                      "Describes the configuration of a DNS endpoint.",
                    additionalProperties: true,
                  },
                  ip_endpoints_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Controls whether to allow direct IP access.",
                      },
                      enable_public_endpoint: {
                        type: "boolean",
                        description:
                          "Controls whether the control plane allows access through a public IP. It is invalid to specify both [PrivateClusterConfig.enablePrivateEndpoint][] and this field at the same time.",
                      },
                      global_access: {
                        type: "boolean",
                        description:
                          "Controls whether the control plane's private endpoint is accessible from sources in other regions. It is invalid to specify both [PrivateClusterMasterGlobalAccessConfig.enabled][google.container.v1.PrivateClusterMasterGlobalAccessConfig.enabled] and this field at the same time.",
                      },
                      authorized_networks_config: {
                        type: "object",
                        properties: {
                          enabled: {
                            type: "boolean",
                            description:
                              "Whether or not master authorized networks is enabled.",
                          },
                          cidr_blocks: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                display_name: {
                                  type: "string",
                                  description:
                                    "display_name is an optional field for users to identify CIDR blocks.",
                                },
                                cidr_block: {
                                  type: "string",
                                  description:
                                    "cidr_block must be specified in CIDR notation.",
                                },
                              },
                              description:
                                "CidrBlock contains an optional name and one CIDR block.",
                              additionalProperties: true,
                            },
                            description:
                              "cidr_blocks define up to 50 external networks that could access Kubernetes master through HTTPS.",
                          },
                          gcp_public_cidrs_access_enabled: {
                            type: "boolean",
                            description:
                              "Whether master is accessible via Google Compute Engine Public IP addresses.",
                          },
                          private_endpoint_enforcement_enabled: {
                            type: "boolean",
                            description:
                              "Whether master authorized networks is enforced on private endpoint or not.",
                          },
                        },
                        description:
                          "Configuration options for the master authorized networks feature. Enabled master authorized networks will disallow all external traffic to access Kubernetes master through HTTPS except traffic from the given CIDR blocks, Google Compute Engine Public IPs and Google Prod IPs.",
                        additionalProperties: true,
                      },
                      private_endpoint_subnetwork: {
                        type: "string",
                        description:
                          "Subnet to provision the master's private endpoint during cluster creation. Specified in projects/*/regions/*/subnetworks/* format. It is invalid to specify both [PrivateClusterConfig.privateEndpointSubnetwork][] and this field at the same time.",
                      },
                    },
                    description: "IP endpoints configuration.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Configuration for all of the cluster's control plane endpoints.",
                additionalProperties: true,
              },
              desired_master_version: {
                type: "string",
                description:
                  'The Kubernetes version to change the master to.  Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior:  - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "-": picks the default Kubernetes version',
              },
              desired_gcfs_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Whether to use GCFS.",
                  },
                },
                description:
                  "GcfsConfig contains configurations of Google Container File System (image streaming).",
                additionalProperties: true,
              },
              desired_node_pool_auto_config_network_tags: {
                type: "object",
                properties: {
                  tags: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "List of network tags.",
                  },
                },
                description:
                  "Collection of Compute Engine network tags that can be applied to a node's underlying VM instance.",
                additionalProperties: true,
              },
              desired_pod_autoscaling: {
                type: "object",
                properties: {
                  hpa_profile: {
                    type: "string",
                    enum: ["HPA_PROFILE_UNSPECIFIED", "NONE", "PERFORMANCE"],
                    description: "Selected Horizontal Pod Autoscaling profile.",
                  },
                },
                description:
                  "PodAutoscaling is used for configuration of parameters for workload autoscaling.",
                additionalProperties: true,
              },
              desired_gateway_api_config: {
                type: "object",
                properties: {
                  channel: {
                    type: "string",
                    enum: [
                      "CHANNEL_UNSPECIFIED",
                      "CHANNEL_DISABLED",
                      "CHANNEL_EXPERIMENTAL",
                      "CHANNEL_STANDARD",
                    ],
                    description:
                      "The Gateway API release channel to use for Gateway API.",
                  },
                },
                description:
                  "GatewayAPIConfig contains the desired config of Gateway API on this cluster.",
                additionalProperties: true,
              },
              etag: {
                type: "string",
                description:
                  "The current etag of the cluster. If an etag is provided and does not match the current etag of the cluster, update will be blocked and an ABORTED error will be returned.",
              },
              desired_node_pool_logging_config: {
                type: "object",
                properties: {
                  variant_config: {
                    type: "object",
                    properties: {
                      variant: {
                        type: "string",
                        enum: [
                          "VARIANT_UNSPECIFIED",
                          "DEFAULT",
                          "MAX_THROUGHPUT",
                        ],
                        description: "Logging variant deployed on nodes.",
                      },
                    },
                    description:
                      "LoggingVariantConfig specifies the behaviour of the logging component.",
                    additionalProperties: true,
                  },
                },
                description:
                  "NodePoolLoggingConfig specifies logging configuration for nodepools.",
                additionalProperties: true,
              },
              desired_fleet: {
                type: "object",
                properties: {
                  project: {
                    type: "string",
                    description:
                      "The Fleet host project(project ID or project number) where this cluster will be registered to. This field cannot be changed after the cluster has been registered.",
                  },
                  membership_type: {
                    type: "string",
                    enum: ["MEMBERSHIP_TYPE_UNSPECIFIED", "LIGHTWEIGHT"],
                    description: "The type of the cluster's fleet membership.",
                  },
                },
                description:
                  "Fleet is the fleet configuration for the cluster.",
                additionalProperties: true,
              },
              desired_stack_type: {
                type: "string",
                enum: ["STACK_TYPE_UNSPECIFIED", "IPV4", "IPV4_IPV6"],
                description: "Possible values for IP stack type",
              },
              additional_pod_ranges_config: {
                type: "object",
                properties: {
                  pod_range_names: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Name for pod secondary ipv4 range which has the actual range defined ahead.",
                  },
                },
                description:
                  "AdditionalPodRangesConfig is the configuration for additional pod secondary ranges supporting the ClusterUpdate message.",
                additionalProperties: true,
              },
              removed_additional_pod_ranges_config: {
                type: "object",
                properties: {
                  pod_range_names: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Name for pod secondary ipv4 range which has the actual range defined ahead.",
                  },
                },
                description:
                  "AdditionalPodRangesConfig is the configuration for additional pod secondary ranges supporting the ClusterUpdate message.",
                additionalProperties: true,
              },
              enable_k8s_beta_apis: {
                type: "object",
                properties: {
                  enabled_apis: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Enabled k8s beta APIs.",
                  },
                },
                description: "K8sBetaAPIConfig , configuration for beta APIs",
                additionalProperties: true,
              },
              desired_security_posture_config: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    enum: [
                      "MODE_UNSPECIFIED",
                      "DISABLED",
                      "BASIC",
                      "ENTERPRISE",
                    ],
                    description:
                      "Sets which mode to use for Security Posture features.",
                  },
                  vulnerability_mode: {
                    type: "string",
                    enum: [
                      "VULNERABILITY_MODE_UNSPECIFIED",
                      "VULNERABILITY_DISABLED",
                      "VULNERABILITY_BASIC",
                      "VULNERABILITY_ENTERPRISE",
                    ],
                    description:
                      "Sets which mode to use for vulnerability scanning.",
                  },
                },
                description:
                  "SecurityPostureConfig defines the flags needed to enable/disable features for the Security Posture API.",
                additionalProperties: true,
              },
              desired_network_performance_config: {
                type: "object",
                properties: {
                  total_egress_bandwidth_tier: {
                    type: "string",
                    enum: ["TIER_UNSPECIFIED", "TIER_1"],
                    description:
                      "Specifies the total network bandwidth tier for NodePools in the cluster.",
                  },
                },
                description: "Configuration of network bandwidth tiers",
                additionalProperties: true,
              },
              desired_enable_fqdn_network_policy: {
                type: "boolean",
                description:
                  "Enable/Disable FQDN Network Policy for the cluster.",
              },
              desired_autopilot_workload_policy_config: {
                type: "object",
                properties: {
                  allow_net_admin: {
                    type: "boolean",
                    description:
                      "If true, workloads can use NET_ADMIN capability.",
                  },
                  autopilot_compatibility_auditing_enabled: {
                    type: "boolean",
                    description:
                      "If true, enables the GCW Auditor that audits workloads on standard clusters.",
                  },
                },
                description:
                  "WorkloadPolicyConfig is the configuration related to GCW workload policy",
                additionalProperties: true,
              },
              desired_k8s_beta_apis: {
                type: "object",
                properties: {
                  enabled_apis: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Enabled k8s beta APIs.",
                  },
                },
                description: "K8sBetaAPIConfig , configuration for beta APIs",
                additionalProperties: true,
              },
              desired_containerd_config: {
                type: "object",
                properties: {
                  private_registry_access_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description: "Private registry access is enabled.",
                      },
                      certificate_authority_domain_config: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            fqdns: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "List of fully qualified domain names (FQDN). Specifying port is supported. Wildcards are NOT supported. Examples: - my.customdomain.com - 10.0.1.2:5000",
                            },
                            gcp_secret_manager_certificate_config: {
                              type: "object",
                              properties: {
                                secret_uri: {
                                  type: "string",
                                  description:
                                    'Secret URI, in the form "projects/$PROJECT_ID/secrets/$SECRET_NAME/versions/$VERSION". Version can be fixed (e.g. "2") or "latest"',
                                },
                              },
                              description:
                                "GCPSecretManagerCertificateConfig configures a secret from [Secret Manager](https://cloud.google.com/secret-manager).",
                              additionalProperties: true,
                            },
                          },
                          description:
                            "CertificateAuthorityDomainConfig configures one or more fully qualified domain names (FQDN) to a specific certificate.",
                          additionalProperties: true,
                        },
                      },
                    },
                    description:
                      "PrivateRegistryAccessConfig contains access configuration for private container registries.",
                    additionalProperties: true,
                  },
                  writable_cgroups: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Optional. Whether writable cgroups is enabled.",
                      },
                    },
                    description: "Defines writable cgroups configuration.",
                    additionalProperties: true,
                  },
                  registry_hosts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        server: {
                          type: "string",
                          description:
                            "Defines the host name of the registry server, which will be used to create configuration file as /etc/containerd/hosts.d/<server>/hosts.toml. It supports fully qualified domain names (FQDN) and IP addresses: Specifying port is supported. Wildcards are NOT supported. Examples: - my.customdomain.com - 10.0.1.2:5000",
                        },
                        hosts: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              host: {
                                type: "string",
                                description:
                                  "Host configures the registry host/mirror. It supports fully qualified domain names (FQDN) and IP addresses: Specifying port is supported. Wildcards are NOT supported. Examples: - my.customdomain.com - 10.0.1.2:5000",
                              },
                              capabilities: {
                                type: "array",
                                items: {
                                  type: "string",
                                  enum: [
                                    "HOST_CAPABILITY_UNSPECIFIED",
                                    "HOST_CAPABILITY_PULL",
                                    "HOST_CAPABILITY_RESOLVE",
                                    "HOST_CAPABILITY_PUSH",
                                  ],
                                },
                                description:
                                  "Capabilities represent the capabilities of the registry host, specifying what operations a host is capable of performing. If not set, containerd enables all capabilities by default.",
                              },
                              override_path: {
                                type: "boolean",
                                description:
                                  "OverridePath is used to indicate the host's API root endpoint is defined in the URL path rather than by the API specification. This may be used with non-compliant OCI registries which are missing the /v2 prefix. If not set, containerd sets default false.",
                              },
                              header: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    key: {
                                      type: "string",
                                      description:
                                        "Key configures the header key.",
                                    },
                                    value: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Value configures the header value.",
                                    },
                                  },
                                  description:
                                    "RegistryHeader configures headers for the registry.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Header configures the registry host headers.",
                              },
                              ca: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    gcp_secret_manager_secret_uri: {
                                      type: "string",
                                      description:
                                        'The URI configures a secret from [Secret Manager](https://cloud.google.com/secret-manager) in the format "projects/$PROJECT_ID/secrets/$SECRET_NAME/versions/$VERSION" for global secret or "projects/$PROJECT_ID/locations/$REGION/secrets/$SECRET_NAME/versions/$VERSION" for regional secret. Version can be fixed (e.g. "2") or "latest"',
                                    },
                                  },
                                  description:
                                    "CertificateConfig configures certificate for the registry.",
                                  additionalProperties: true,
                                },
                                description:
                                  "CA configures the registry host certificate.",
                              },
                              client: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    cert: {
                                      type: "object",
                                      properties: {
                                        gcp_secret_manager_secret_uri: {
                                          type: "string",
                                          description:
                                            'The URI configures a secret from [Secret Manager](https://cloud.google.com/secret-manager) in the format "projects/$PROJECT_ID/secrets/$SECRET_NAME/versions/$VERSION" for global secret or "projects/$PROJECT_ID/locations/$REGION/secrets/$SECRET_NAME/versions/$VERSION" for regional secret. Version can be fixed (e.g. "2") or "latest"',
                                        },
                                      },
                                      description:
                                        "CertificateConfig configures certificate for the registry.",
                                      additionalProperties: true,
                                    },
                                    key: {
                                      type: "object",
                                      properties: {
                                        gcp_secret_manager_secret_uri: {
                                          type: "string",
                                          description:
                                            'The URI configures a secret from [Secret Manager](https://cloud.google.com/secret-manager) in the format "projects/$PROJECT_ID/secrets/$SECRET_NAME/versions/$VERSION" for global secret or "projects/$PROJECT_ID/locations/$REGION/secrets/$SECRET_NAME/versions/$VERSION" for regional secret. Version can be fixed (e.g. "2") or "latest"',
                                        },
                                      },
                                      description:
                                        "CertificateConfig configures certificate for the registry.",
                                      additionalProperties: true,
                                    },
                                  },
                                  description:
                                    "CertificateConfigPair configures pairs of certificates, which is used for client certificate and key pairs under a registry.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Client configures the registry host client certificate and key.",
                              },
                              dial_timeout: {
                                type: "string",
                                description:
                                  "Duration string (e.g., '1.5s', '300s')",
                              },
                            },
                            description:
                              "HostConfig configures the registry host under a given Server.",
                            additionalProperties: true,
                          },
                          description:
                            "HostConfig configures a list of host-specific configurations for the server. Each server can have at most 10 host configurations.",
                        },
                      },
                      description:
                        "RegistryHostConfig configures the top-level structure for a single containerd registry server's configuration, which represents one hosts.toml file on the node. It will override the same fqdns in PrivateRegistryAccessConfig.",
                      additionalProperties: true,
                    },
                    description:
                      "RegistryHostConfig configures containerd registry host configuration. Each registry_hosts represents a hosts.toml file. At most 25 registry_hosts are allowed.",
                  },
                },
                description:
                  "ContainerdConfig contains configuration to customize containerd.",
                additionalProperties: true,
              },
              desired_enable_multi_networking: {
                type: "boolean",
                description: "Enable/Disable Multi-Networking for the cluster",
              },
              desired_node_pool_auto_config_resource_manager_tags: {
                type: "object",
                properties: {
                  tags: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "TagKeyValue must be in one of the following formats ([KEY]=[VALUE]) 1. `tagKeys/{tag_key_id}=tagValues/{tag_value_id}` 2. `{org_id}/{tag_key_name}={tag_value_name}` 3. `{project_id}/{tag_key_name}={tag_value_name}`",
                  },
                },
                description:
                  "A map of resource manager tag keys and values to be attached to the nodes for managing Compute Engine firewalls using Network Firewall Policies. Tags must be according to specifications in https://cloud.google.com/vpc/docs/tags-firewalls-overview#specifications. A maximum of 5 tag key-value pairs can be specified. Existing tags will be replaced with new values.",
                additionalProperties: true,
              },
              desired_in_transit_encryption_config: {
                type: "string",
                enum: [
                  "IN_TRANSIT_ENCRYPTION_CONFIG_UNSPECIFIED",
                  "IN_TRANSIT_ENCRYPTION_DISABLED",
                  "IN_TRANSIT_ENCRYPTION_INTER_NODE_TRANSPARENT",
                ],
                description: "Options for in-transit encryption.",
              },
              desired_enable_cilium_clusterwide_network_policy: {
                type: "boolean",
                description:
                  "Enable/Disable Cilium Clusterwide Network Policy for the cluster.",
              },
              desired_secret_manager_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Enable/Disable Secret Manager Config.",
                  },
                  rotation_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description: "Whether the rotation is enabled.",
                      },
                      rotation_interval: {
                        type: "string",
                        description: "Duration string (e.g., '1.5s', '300s')",
                      },
                    },
                    description:
                      "RotationConfig is config for secret manager auto rotation.",
                    additionalProperties: true,
                  },
                },
                description:
                  "SecretManagerConfig is config for secret manager enablement.",
                additionalProperties: true,
              },
              desired_compliance_posture_config: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    enum: ["MODE_UNSPECIFIED", "DISABLED", "ENABLED"],
                    description:
                      "Defines the enablement mode for Compliance Posture.",
                  },
                  compliance_standards: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        standard: {
                          type: "string",
                          description: "Name of the compliance standard.",
                        },
                      },
                      description:
                        "Defines the details of a compliance standard.",
                      additionalProperties: true,
                    },
                    description: "List of enabled compliance standards.",
                  },
                },
                description:
                  "CompliancePostureConfig defines the settings needed to enable/disable features for the Compliance Posture.",
                additionalProperties: true,
              },
              desired_node_kubelet_config: {
                type: "object",
                properties: {
                  cpu_manager_policy: {
                    type: "string",
                    description:
                      'Control the CPU management policy on the node. See https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/  The following values are allowed. * "none": the default, which represents the existing scheduling behavior. * "static": allows pods with certain resource characteristics to be granted increased CPU affinity and exclusivity on the node. The default value is \'none\' if unspecified.',
                  },
                  topology_manager: {
                    type: "object",
                    properties: {
                      policy: {
                        type: "string",
                        description:
                          "Configures the strategy for resource alignment. Allowed values are:  * none: the default policy, and does not perform any topology alignment. * restricted: the topology manager stores the preferred NUMA node affinity for the container, and will reject the pod if the affinity if not preferred. * best-effort: the topology manager stores the preferred NUMA node affinity for the container. If the affinity is not preferred, the topology manager will admit the pod to the node anyway. * single-numa-node: the topology manager determines if the single NUMA node affinity is possible. If it is, Topology Manager will store this and the Hint Providers can then use this information when making the resource allocation decision. If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a Terminated state with a pod admission failure.  The default policy value is 'none' if unspecified. Details about each strategy can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-policies).",
                      },
                      scope: {
                        type: "string",
                        description:
                          "The Topology Manager aligns resources in following scopes:  * container * pod  The default scope is 'container' if unspecified. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-scopes",
                      },
                    },
                    description:
                      "TopologyManager defines the configuration options for Topology Manager feature. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/",
                    additionalProperties: true,
                  },
                  memory_manager: {
                    type: "object",
                    properties: {
                      policy: {
                        type: "string",
                        description:
                          'Controls the memory management policy on the Node. See https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#policies  The following values are allowed. * "none" * "static" The default value is \'none\' if unspecified.',
                      },
                    },
                    description:
                      "The option enables the Kubernetes NUMA-aware Memory Manager feature. Detailed description about the feature can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/).",
                    additionalProperties: true,
                  },
                  cpu_cfs_quota: {
                    type: "boolean",
                    description:
                      "Enable CPU CFS quota enforcement for containers that specify CPU limits.  This option is enabled by default which makes kubelet use CFS quota (https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.txt) to enforce container CPU limits. Otherwise, CPU limits will not be enforced at all.  Disable this option to mitigate CPU throttling problems while still having your pods to be in Guaranteed QoS class by specifying the CPU limits.  The default value is 'true' if unspecified.",
                  },
                  cpu_cfs_quota_period: {
                    type: "string",
                    description:
                      'Set the CPU CFS quota period value \'cpu.cfs_period_us\'.  The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration between 1ms and 1 second, inclusive.',
                  },
                  pod_pids_limit: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  insecure_kubelet_readonly_port_enabled: {
                    type: "boolean",
                    description: "Enable or disable Kubelet read only port.",
                  },
                  image_gc_low_threshold_percent: {
                    type: "integer",
                    description:
                      "Optional. Defines the percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. The percent is calculated as this field value out of 100.  The value must be between 10 and 85, inclusive and smaller than image_gc_high_threshold_percent.  The default value is 80 if unspecified.",
                  },
                  image_gc_high_threshold_percent: {
                    type: "integer",
                    description:
                      "Optional. Defines the percent of disk usage after which image garbage collection is always run. The percent is calculated as this field value out of 100.  The value must be between 10 and 85, inclusive and greater than image_gc_low_threshold_percent.  The default value is 85 if unspecified.",
                  },
                  image_minimum_gc_age: {
                    type: "string",
                    description:
                      'Optional. Defines the minimum age for an unused image before it is garbage collected.  The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".  The value must be a positive duration less than or equal to 2 minutes.  The default value is "2m0s" if unspecified.',
                  },
                  image_maximum_gc_age: {
                    type: "string",
                    description:
                      'Optional. Defines the maximum age an image can be unused before it is garbage collected. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".  The value must be a positive duration greater than image_minimum_gc_age or "0s".  The default value is "0s" if unspecified, which disables this field, meaning images won\'t be garbage collected based on being unused for too long.',
                  },
                  container_log_max_size: {
                    type: "string",
                    description:
                      "Optional. Defines the maximum size of the container log file before it is rotated. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation  Valid format is positive number + unit, e.g. 100Ki, 10Mi. Valid units are Ki, Mi, Gi. The value must be between 10Mi and 500Mi, inclusive.  Note that the total container log size (container_log_max_size * container_log_max_files) cannot exceed 1% of the total storage of the node, to avoid disk pressure caused by log files.  The default value is 10Mi if unspecified.",
                  },
                  container_log_max_files: {
                    type: "integer",
                    description:
                      "Optional. Defines the maximum number of container log files that can be present for a container. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation  The value must be an integer between 2 and 10, inclusive. The default value is 5 if unspecified.",
                  },
                  allowed_unsafe_sysctls: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Optional. Defines a comma-separated allowlist of unsafe sysctls or sysctl patterns (ending in `*`).  The unsafe namespaced sysctl groups are `kernel.shm*`, `kernel.msg*`, `kernel.sem`, `fs.mqueue.*`, and `net.*`. Leaving this allowlist empty means they cannot be set on Pods.  To allow certain sysctls or sysctl patterns to be set on Pods, list them separated by commas. For example: `kernel.msg*,net.ipv4.route.min_pmtu`.  See https://kubernetes.io/docs/tasks/administer-cluster/sysctl-cluster/ for more details.",
                  },
                  eviction_soft: {
                    type: "object",
                    properties: {
                      memory_available: {
                        type: "string",
                        description:
                          'Optional. Memory available (i.e. capacity - workingSet), in bytes. Defines the amount of "memory.available" signal in kubelet. Default is unset, if not specified in the kubelet config. Format: positive number + unit, e.g. 100Ki, 10Mi, 5Gi. Valid units are Ki, Mi, Gi. Must be >= 100Mi and <= 50% of the node\'s memory. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_available: {
                        type: "string",
                        description:
                          'Optional. Amount of storage available on filesystem that kubelet uses for volumes, daemon logs, etc. Defines the amount of "nodefs.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 10% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Amount of inodes available on filesystem that kubelet uses for volumes, daemon logs, etc. Defines the amount of "nodefs.inodesFree" signal in kubelet. Default is unset, if not specified in the kubelet config. Linux only. It takses percentage value for now. Sample format: "30%". Must be >= 5% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_available: {
                        type: "string",
                        description:
                          'Optional. Amount of storage available on filesystem that container runtime uses for storing images layers. If the container filesystem and image filesystem are not separate, then imagefs can store both image layers and writeable layers. Defines the amount of "imagefs.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 15% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Amount of inodes available on filesystem that container runtime uses for storing images layers. Defines the amount of "imagefs.inodesFree" signal in kubelet. Default is unset, if not specified in the kubelet config. Linux only. It takses percentage value for now. Sample format: "30%". Must be >= 5% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      pid_available: {
                        type: "string",
                        description:
                          'Optional. Amount of PID available for pod allocation. Defines the amount of "pid.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 10% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                    },
                    description:
                      "Eviction signals are the current state of a particular resource at a specific point in time. The kubelet uses eviction signals to make eviction decisions by comparing the signals to eviction thresholds, which are the minimum amount of the resource that should be available on the node.",
                    additionalProperties: true,
                  },
                  eviction_soft_grace_period: {
                    type: "object",
                    properties: {
                      memory_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to memory available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to nodefs available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to nodefs inodes free signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to imagefs available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to imagefs inodes free signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      pid_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to pid available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                    },
                    description:
                      "Eviction grace periods are grace periods for each eviction signal.",
                    additionalProperties: true,
                  },
                  eviction_minimum_reclaim: {
                    type: "object",
                    properties: {
                      memory_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to memory available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to nodefs available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to nodefs inodes free signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to imagefs available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to imagefs inodes free signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      pid_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to pid available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                    },
                    description:
                      "Eviction minimum reclaims are the resource amounts of minimum reclaims for each eviction signal.",
                    additionalProperties: true,
                  },
                  eviction_max_pod_grace_period_seconds: {
                    type: "integer",
                    description:
                      "Optional. eviction_max_pod_grace_period_seconds is the maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met. This value effectively caps the Pod's terminationGracePeriodSeconds value during soft evictions. Default: 0. Range: [0, 300].",
                  },
                  max_parallel_image_pulls: {
                    type: "integer",
                    description:
                      "Optional. Defines the maximum number of image pulls in parallel. The range is 2 to 5, inclusive. The default value is 2 or 3 depending on the disk type.  See https://kubernetes.io/docs/concepts/containers/images/#maximum-parallel-image-pulls for more details.",
                  },
                  single_process_oom_kill: {
                    type: "boolean",
                    description:
                      "Optional. Defines whether to enable single process OOM killer. If true, will prevent the memory.oom.group flag from being set for container cgroups in cgroups v2. This causes processes in the container to be OOM killed individually instead of as a group.",
                  },
                  shutdown_grace_period_seconds: {
                    type: "integer",
                    description:
                      "Optional. shutdown_grace_period_seconds is the maximum allowed grace period (in seconds) the total duration that the node should delay the shutdown during a graceful shutdown. This is the total grace period for pod termination for both regular and critical pods. https://kubernetes.io/docs/concepts/cluster-administration/node-shutdown/ If set to 0, node will not enable the graceful node shutdown functionality. This field is only valid for Spot VMs. Allowed values: 0, 30, 120.",
                  },
                  shutdown_grace_period_critical_pods_seconds: {
                    type: "integer",
                    description:
                      "Optional. shutdown_grace_period_critical_pods_seconds is the maximum allowed grace period (in seconds) used to terminate critical pods during a node shutdown. This value should be <= shutdown_grace_period_seconds, and is only valid if shutdown_grace_period_seconds is set. https://kubernetes.io/docs/concepts/cluster-administration/node-shutdown/ Range: [0, 120].",
                  },
                },
                description: "Node kubelet configs.",
                additionalProperties: true,
              },
              desired_node_pool_auto_config_kubelet_config: {
                type: "object",
                properties: {
                  cpu_manager_policy: {
                    type: "string",
                    description:
                      'Control the CPU management policy on the node. See https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/  The following values are allowed. * "none": the default, which represents the existing scheduling behavior. * "static": allows pods with certain resource characteristics to be granted increased CPU affinity and exclusivity on the node. The default value is \'none\' if unspecified.',
                  },
                  topology_manager: {
                    type: "object",
                    properties: {
                      policy: {
                        type: "string",
                        description:
                          "Configures the strategy for resource alignment. Allowed values are:  * none: the default policy, and does not perform any topology alignment. * restricted: the topology manager stores the preferred NUMA node affinity for the container, and will reject the pod if the affinity if not preferred. * best-effort: the topology manager stores the preferred NUMA node affinity for the container. If the affinity is not preferred, the topology manager will admit the pod to the node anyway. * single-numa-node: the topology manager determines if the single NUMA node affinity is possible. If it is, Topology Manager will store this and the Hint Providers can then use this information when making the resource allocation decision. If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a Terminated state with a pod admission failure.  The default policy value is 'none' if unspecified. Details about each strategy can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-policies).",
                      },
                      scope: {
                        type: "string",
                        description:
                          "The Topology Manager aligns resources in following scopes:  * container * pod  The default scope is 'container' if unspecified. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-scopes",
                      },
                    },
                    description:
                      "TopologyManager defines the configuration options for Topology Manager feature. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/",
                    additionalProperties: true,
                  },
                  memory_manager: {
                    type: "object",
                    properties: {
                      policy: {
                        type: "string",
                        description:
                          'Controls the memory management policy on the Node. See https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#policies  The following values are allowed. * "none" * "static" The default value is \'none\' if unspecified.',
                      },
                    },
                    description:
                      "The option enables the Kubernetes NUMA-aware Memory Manager feature. Detailed description about the feature can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/).",
                    additionalProperties: true,
                  },
                  cpu_cfs_quota: {
                    type: "boolean",
                    description:
                      "Enable CPU CFS quota enforcement for containers that specify CPU limits.  This option is enabled by default which makes kubelet use CFS quota (https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.txt) to enforce container CPU limits. Otherwise, CPU limits will not be enforced at all.  Disable this option to mitigate CPU throttling problems while still having your pods to be in Guaranteed QoS class by specifying the CPU limits.  The default value is 'true' if unspecified.",
                  },
                  cpu_cfs_quota_period: {
                    type: "string",
                    description:
                      'Set the CPU CFS quota period value \'cpu.cfs_period_us\'.  The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration between 1ms and 1 second, inclusive.',
                  },
                  pod_pids_limit: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  insecure_kubelet_readonly_port_enabled: {
                    type: "boolean",
                    description: "Enable or disable Kubelet read only port.",
                  },
                  image_gc_low_threshold_percent: {
                    type: "integer",
                    description:
                      "Optional. Defines the percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. The percent is calculated as this field value out of 100.  The value must be between 10 and 85, inclusive and smaller than image_gc_high_threshold_percent.  The default value is 80 if unspecified.",
                  },
                  image_gc_high_threshold_percent: {
                    type: "integer",
                    description:
                      "Optional. Defines the percent of disk usage after which image garbage collection is always run. The percent is calculated as this field value out of 100.  The value must be between 10 and 85, inclusive and greater than image_gc_low_threshold_percent.  The default value is 85 if unspecified.",
                  },
                  image_minimum_gc_age: {
                    type: "string",
                    description:
                      'Optional. Defines the minimum age for an unused image before it is garbage collected.  The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".  The value must be a positive duration less than or equal to 2 minutes.  The default value is "2m0s" if unspecified.',
                  },
                  image_maximum_gc_age: {
                    type: "string",
                    description:
                      'Optional. Defines the maximum age an image can be unused before it is garbage collected. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".  The value must be a positive duration greater than image_minimum_gc_age or "0s".  The default value is "0s" if unspecified, which disables this field, meaning images won\'t be garbage collected based on being unused for too long.',
                  },
                  container_log_max_size: {
                    type: "string",
                    description:
                      "Optional. Defines the maximum size of the container log file before it is rotated. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation  Valid format is positive number + unit, e.g. 100Ki, 10Mi. Valid units are Ki, Mi, Gi. The value must be between 10Mi and 500Mi, inclusive.  Note that the total container log size (container_log_max_size * container_log_max_files) cannot exceed 1% of the total storage of the node, to avoid disk pressure caused by log files.  The default value is 10Mi if unspecified.",
                  },
                  container_log_max_files: {
                    type: "integer",
                    description:
                      "Optional. Defines the maximum number of container log files that can be present for a container. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation  The value must be an integer between 2 and 10, inclusive. The default value is 5 if unspecified.",
                  },
                  allowed_unsafe_sysctls: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Optional. Defines a comma-separated allowlist of unsafe sysctls or sysctl patterns (ending in `*`).  The unsafe namespaced sysctl groups are `kernel.shm*`, `kernel.msg*`, `kernel.sem`, `fs.mqueue.*`, and `net.*`. Leaving this allowlist empty means they cannot be set on Pods.  To allow certain sysctls or sysctl patterns to be set on Pods, list them separated by commas. For example: `kernel.msg*,net.ipv4.route.min_pmtu`.  See https://kubernetes.io/docs/tasks/administer-cluster/sysctl-cluster/ for more details.",
                  },
                  eviction_soft: {
                    type: "object",
                    properties: {
                      memory_available: {
                        type: "string",
                        description:
                          'Optional. Memory available (i.e. capacity - workingSet), in bytes. Defines the amount of "memory.available" signal in kubelet. Default is unset, if not specified in the kubelet config. Format: positive number + unit, e.g. 100Ki, 10Mi, 5Gi. Valid units are Ki, Mi, Gi. Must be >= 100Mi and <= 50% of the node\'s memory. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_available: {
                        type: "string",
                        description:
                          'Optional. Amount of storage available on filesystem that kubelet uses for volumes, daemon logs, etc. Defines the amount of "nodefs.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 10% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Amount of inodes available on filesystem that kubelet uses for volumes, daemon logs, etc. Defines the amount of "nodefs.inodesFree" signal in kubelet. Default is unset, if not specified in the kubelet config. Linux only. It takses percentage value for now. Sample format: "30%". Must be >= 5% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_available: {
                        type: "string",
                        description:
                          'Optional. Amount of storage available on filesystem that container runtime uses for storing images layers. If the container filesystem and image filesystem are not separate, then imagefs can store both image layers and writeable layers. Defines the amount of "imagefs.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 15% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Amount of inodes available on filesystem that container runtime uses for storing images layers. Defines the amount of "imagefs.inodesFree" signal in kubelet. Default is unset, if not specified in the kubelet config. Linux only. It takses percentage value for now. Sample format: "30%". Must be >= 5% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      pid_available: {
                        type: "string",
                        description:
                          'Optional. Amount of PID available for pod allocation. Defines the amount of "pid.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 10% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                    },
                    description:
                      "Eviction signals are the current state of a particular resource at a specific point in time. The kubelet uses eviction signals to make eviction decisions by comparing the signals to eviction thresholds, which are the minimum amount of the resource that should be available on the node.",
                    additionalProperties: true,
                  },
                  eviction_soft_grace_period: {
                    type: "object",
                    properties: {
                      memory_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to memory available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to nodefs available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to nodefs inodes free signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to imagefs available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to imagefs inodes free signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      pid_available: {
                        type: "string",
                        description:
                          'Optional. Grace period for eviction due to pid available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                    },
                    description:
                      "Eviction grace periods are grace periods for each eviction signal.",
                    additionalProperties: true,
                  },
                  eviction_minimum_reclaim: {
                    type: "object",
                    properties: {
                      memory_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to memory available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to nodefs available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      nodefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to nodefs inodes free signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to imagefs available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      imagefs_inodes_free: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to imagefs inodes free signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                      pid_available: {
                        type: "string",
                        description:
                          'Optional. Minimum reclaim for eviction due to pid available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                      },
                    },
                    description:
                      "Eviction minimum reclaims are the resource amounts of minimum reclaims for each eviction signal.",
                    additionalProperties: true,
                  },
                  eviction_max_pod_grace_period_seconds: {
                    type: "integer",
                    description:
                      "Optional. eviction_max_pod_grace_period_seconds is the maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met. This value effectively caps the Pod's terminationGracePeriodSeconds value during soft evictions. Default: 0. Range: [0, 300].",
                  },
                  max_parallel_image_pulls: {
                    type: "integer",
                    description:
                      "Optional. Defines the maximum number of image pulls in parallel. The range is 2 to 5, inclusive. The default value is 2 or 3 depending on the disk type.  See https://kubernetes.io/docs/concepts/containers/images/#maximum-parallel-image-pulls for more details.",
                  },
                  single_process_oom_kill: {
                    type: "boolean",
                    description:
                      "Optional. Defines whether to enable single process OOM killer. If true, will prevent the memory.oom.group flag from being set for container cgroups in cgroups v2. This causes processes in the container to be OOM killed individually instead of as a group.",
                  },
                  shutdown_grace_period_seconds: {
                    type: "integer",
                    description:
                      "Optional. shutdown_grace_period_seconds is the maximum allowed grace period (in seconds) the total duration that the node should delay the shutdown during a graceful shutdown. This is the total grace period for pod termination for both regular and critical pods. https://kubernetes.io/docs/concepts/cluster-administration/node-shutdown/ If set to 0, node will not enable the graceful node shutdown functionality. This field is only valid for Spot VMs. Allowed values: 0, 30, 120.",
                  },
                  shutdown_grace_period_critical_pods_seconds: {
                    type: "integer",
                    description:
                      "Optional. shutdown_grace_period_critical_pods_seconds is the maximum allowed grace period (in seconds) used to terminate critical pods during a node shutdown. This value should be <= shutdown_grace_period_seconds, and is only valid if shutdown_grace_period_seconds is set. https://kubernetes.io/docs/concepts/cluster-administration/node-shutdown/ Range: [0, 120].",
                  },
                },
                description: "Node kubelet configs.",
                additionalProperties: true,
              },
              user_managed_keys_config: {
                type: "object",
                properties: {
                  cluster_ca: {
                    type: "string",
                    description:
                      "The Certificate Authority Service caPool to use for the cluster CA in this cluster.",
                  },
                  etcd_api_ca: {
                    type: "string",
                    description:
                      "Resource path of the Certificate Authority Service caPool to use for the etcd API CA in this cluster.",
                  },
                  etcd_peer_ca: {
                    type: "string",
                    description:
                      "Resource path of the Certificate Authority Service caPool to use for the etcd peer CA in this cluster.",
                  },
                  service_account_signing_keys: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The Cloud KMS cryptoKeyVersions to use for signing service account JWTs issued by this cluster.  Format: `projects/{project}/locations/{location}/keyRings/{keyring}/cryptoKeys/{cryptoKey}/cryptoKeyVersions/{cryptoKeyVersion}`",
                  },
                  service_account_verification_keys: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The Cloud KMS cryptoKeyVersions to use for verifying service account JWTs issued by this cluster.  Format: `projects/{project}/locations/{location}/keyRings/{keyring}/cryptoKeys/{cryptoKey}/cryptoKeyVersions/{cryptoKeyVersion}`",
                  },
                  aggregation_ca: {
                    type: "string",
                    description:
                      "The Certificate Authority Service caPool to use for the aggregation CA in this cluster.",
                  },
                  control_plane_disk_encryption_key: {
                    type: "string",
                    description:
                      "The Cloud KMS cryptoKey to use for Confidential Hyperdisk on the control plane nodes.",
                  },
                  gkeops_etcd_backup_encryption_key: {
                    type: "string",
                    description:
                      "Resource path of the Cloud KMS cryptoKey to use for encryption of internal etcd backups.",
                  },
                },
                description:
                  "UserManagedKeysConfig holds the resource address to Keys which are used for signing certs and token that are used for communication within cluster.",
                additionalProperties: true,
              },
              desired_rbac_binding_config: {
                type: "object",
                properties: {
                  enable_insecure_binding_system_unauthenticated: {
                    type: "boolean",
                    description:
                      "Setting this to true will allow any ClusterRoleBinding and RoleBinding with subjets system:anonymous or system:unauthenticated.",
                  },
                  enable_insecure_binding_system_authenticated: {
                    type: "boolean",
                    description:
                      "Setting this to true will allow any ClusterRoleBinding and RoleBinding with subjects system:authenticated.",
                  },
                },
                description:
                  "RBACBindingConfig allows user to restrict ClusterRoleBindings an RoleBindings that can be created.",
                additionalProperties: true,
              },
              desired_additional_ip_ranges_config: {
                type: "object",
                properties: {
                  additional_ip_ranges_configs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        subnetwork: {
                          type: "string",
                          description:
                            "Name of the subnetwork. This can be the full path of the subnetwork or just the name. Example1: my-subnet Example2: projects/gke-project/regions/us-central1/subnetworks/my-subnet",
                        },
                        pod_ipv4_range_names: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "List of secondary ranges names within this subnetwork that can be used for pod IPs. Example1: gke-pod-range1 Example2: gke-pod-range1,gke-pod-range2",
                        },
                        status: {
                          type: "string",
                          enum: ["STATUS_UNSPECIFIED", "ACTIVE", "DRAINING"],
                          description:
                            "Draining status of the additional subnet.",
                        },
                      },
                      description:
                        "AdditionalIPRangesConfig is the configuration for individual additional subnetwork attached to the cluster",
                      additionalProperties: true,
                    },
                    description:
                      "List of additional IP ranges configs where each AdditionalIPRangesConfig corresponds to one subnetwork's IP ranges",
                  },
                },
                description:
                  "DesiredAdditionalIPRangesConfig is a wrapper used for cluster update operation and contains multiple AdditionalIPRangesConfigs.",
                additionalProperties: true,
              },
              desired_enterprise_config: {
                type: "object",
                properties: {
                  desired_tier: {
                    type: "string",
                    enum: [
                      "CLUSTER_TIER_UNSPECIFIED",
                      "STANDARD",
                      "ENTERPRISE",
                    ],
                    description:
                      "desired_tier specifies the desired tier of the cluster.",
                  },
                },
                description:
                  "DesiredEnterpriseConfig is a wrapper used for updating enterprise_config.  Deprecated: GKE Enterprise features are now available without an Enterprise tier.",
                additionalProperties: true,
              },
              desired_auto_ipam_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "The flag that enables Auto IPAM on this cluster",
                  },
                },
                description:
                  "AutoIpamConfig contains all information related to Auto IPAM",
                additionalProperties: true,
              },
              desired_disable_l4_lb_firewall_reconciliation: {
                type: "boolean",
                description:
                  "Enable/Disable L4 LB VPC firewall reconciliation for the cluster.",
              },
              desired_node_pool_auto_config_linux_node_config: {
                type: "object",
                properties: {
                  sysctls: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "The Linux kernel parameters to be applied to the nodes and all pods running on the nodes.  The following parameters are supported.  net.core.busy_poll net.core.busy_read net.core.netdev_max_backlog net.core.rmem_max net.core.rmem_default net.core.wmem_default net.core.wmem_max net.core.optmem_max net.core.somaxconn net.ipv4.tcp_rmem net.ipv4.tcp_wmem net.ipv4.tcp_tw_reuse net.ipv4.tcp_mtu_probing net.ipv4.tcp_max_orphans net.ipv4.tcp_max_tw_buckets net.ipv4.tcp_syn_retries net.ipv4.tcp_ecn net.ipv4.tcp_congestion_control net.netfilter.nf_conntrack_max net.netfilter.nf_conntrack_buckets net.netfilter.nf_conntrack_tcp_timeout_close_wait net.netfilter.nf_conntrack_tcp_timeout_time_wait net.netfilter.nf_conntrack_tcp_timeout_established net.netfilter.nf_conntrack_acct kernel.shmmni kernel.shmmax kernel.shmall kernel.perf_event_paranoid kernel.sched_rt_runtime_us kernel.softlockup_panic kernel.yama.ptrace_scope kernel.kptr_restrict kernel.dmesg_restrict kernel.sysrq fs.aio-max-nr fs.file-max fs.inotify.max_user_instances fs.inotify.max_user_watches fs.nr_open vm.dirty_background_ratio vm.dirty_background_bytes vm.dirty_expire_centisecs vm.dirty_ratio vm.dirty_bytes vm.dirty_writeback_centisecs vm.max_map_count vm.overcommit_memory vm.overcommit_ratio vm.vfs_cache_pressure vm.swappiness vm.watermark_scale_factor vm.min_free_kbytes",
                  },
                  cgroup_mode: {
                    type: "string",
                    enum: [
                      "CGROUP_MODE_UNSPECIFIED",
                      "CGROUP_MODE_V1",
                      "CGROUP_MODE_V2",
                    ],
                    description:
                      "cgroup_mode specifies the cgroup mode to be used on the node.",
                  },
                  hugepages: {
                    type: "object",
                    properties: {
                      hugepage_size2m: {
                        type: "integer",
                        description: "Optional. Amount of 2M hugepages",
                      },
                      hugepage_size1g: {
                        type: "integer",
                        description: "Optional. Amount of 1G hugepages",
                      },
                    },
                    description: "Hugepages amount in both 2m and 1g size",
                    additionalProperties: true,
                  },
                  transparent_hugepage_enabled: {
                    type: "string",
                    enum: [
                      "TRANSPARENT_HUGEPAGE_ENABLED_UNSPECIFIED",
                      "TRANSPARENT_HUGEPAGE_ENABLED_ALWAYS",
                      "TRANSPARENT_HUGEPAGE_ENABLED_MADVISE",
                      "TRANSPARENT_HUGEPAGE_ENABLED_NEVER",
                    ],
                    description:
                      "Optional. Transparent hugepage support for anonymous memory can be entirely disabled (mostly for debugging purposes) or only enabled inside MADV_HUGEPAGE regions (to avoid the risk of consuming more memory resources) or enabled system wide.  See https://docs.kernel.org/admin-guide/mm/transhuge.html for more details.",
                  },
                  transparent_hugepage_defrag: {
                    type: "string",
                    enum: [
                      "TRANSPARENT_HUGEPAGE_DEFRAG_UNSPECIFIED",
                      "TRANSPARENT_HUGEPAGE_DEFRAG_ALWAYS",
                      "TRANSPARENT_HUGEPAGE_DEFRAG_DEFER",
                      "TRANSPARENT_HUGEPAGE_DEFRAG_DEFER_WITH_MADVISE",
                      "TRANSPARENT_HUGEPAGE_DEFRAG_MADVISE",
                      "TRANSPARENT_HUGEPAGE_DEFRAG_NEVER",
                    ],
                    description:
                      "Optional. Defines the transparent hugepage defrag configuration on the node. VM hugepage allocation can be managed by either limiting defragmentation for delayed allocation or skipping it entirely for immediate allocation only.  See https://docs.kernel.org/admin-guide/mm/transhuge.html for more details.",
                  },
                  swap_config: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Optional. Enables or disables swap for the node pool.",
                      },
                      encryption_config: {
                        type: "object",
                        properties: {
                          disabled: {
                            type: "boolean",
                            description:
                              "Optional. If true, swap space will not be encrypted. Defaults to false (encrypted).",
                          },
                        },
                        description:
                          "Defines encryption settings for the swap space.",
                        additionalProperties: true,
                      },
                      boot_disk_profile: {
                        type: "object",
                        properties: {
                          swap_size_gib: {
                            type: "string",
                            description:
                              "64-bit integer as string (Part of 'swap_size' - only one field in this group can be set)",
                          },
                          swap_size_percent: {
                            type: "integer",
                            description:
                              "Specifies the size of the swap space as a percentage of the boot disk size. (Part of 'swap_size' - only one field in this group can be set)",
                          },
                        },
                        description:
                          "Swap on the node's boot disk. (Part of 'performance_profile' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      ephemeral_local_ssd_profile: {
                        type: "object",
                        properties: {
                          swap_size_gib: {
                            type: "string",
                            description:
                              "64-bit integer as string (Part of 'swap_size' - only one field in this group can be set)",
                          },
                          swap_size_percent: {
                            type: "integer",
                            description:
                              "Specifies the size of the swap space as a percentage of the ephemeral local SSD capacity. (Part of 'swap_size' - only one field in this group can be set)",
                          },
                        },
                        description:
                          "Swap on the local SSD shared with pod ephemeral storage. (Part of 'performance_profile' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      dedicated_local_ssd_profile: {
                        type: "object",
                        properties: {
                          disk_count: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                        },
                        description:
                          "Provisions a new, separate local NVMe SSD exclusively for swap. (Part of 'performance_profile' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "Configuration for swap memory on a node pool.",
                    additionalProperties: true,
                  },
                  node_kernel_module_loading: {
                    type: "object",
                    properties: {
                      policy: {
                        type: "string",
                        enum: [
                          "POLICY_UNSPECIFIED",
                          "ENFORCE_SIGNED_MODULES",
                          "DO_NOT_ENFORCE_SIGNED_MODULES",
                        ],
                        description:
                          "Set the node module loading policy for nodes in the node pool.",
                      },
                    },
                    description:
                      "Configuration for kernel module loading on nodes.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Parameters that can be configured on Linux nodes.",
                additionalProperties: true,
              },
              desired_user_managed_keys_config: {
                type: "object",
                properties: {
                  cluster_ca: {
                    type: "string",
                    description:
                      "The Certificate Authority Service caPool to use for the cluster CA in this cluster.",
                  },
                  etcd_api_ca: {
                    type: "string",
                    description:
                      "Resource path of the Certificate Authority Service caPool to use for the etcd API CA in this cluster.",
                  },
                  etcd_peer_ca: {
                    type: "string",
                    description:
                      "Resource path of the Certificate Authority Service caPool to use for the etcd peer CA in this cluster.",
                  },
                  service_account_signing_keys: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The Cloud KMS cryptoKeyVersions to use for signing service account JWTs issued by this cluster.  Format: `projects/{project}/locations/{location}/keyRings/{keyring}/cryptoKeys/{cryptoKey}/cryptoKeyVersions/{cryptoKeyVersion}`",
                  },
                  service_account_verification_keys: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The Cloud KMS cryptoKeyVersions to use for verifying service account JWTs issued by this cluster.  Format: `projects/{project}/locations/{location}/keyRings/{keyring}/cryptoKeys/{cryptoKey}/cryptoKeyVersions/{cryptoKeyVersion}`",
                  },
                  aggregation_ca: {
                    type: "string",
                    description:
                      "The Certificate Authority Service caPool to use for the aggregation CA in this cluster.",
                  },
                  control_plane_disk_encryption_key: {
                    type: "string",
                    description:
                      "The Cloud KMS cryptoKey to use for Confidential Hyperdisk on the control plane nodes.",
                  },
                  gkeops_etcd_backup_encryption_key: {
                    type: "string",
                    description:
                      "Resource path of the Cloud KMS cryptoKey to use for encryption of internal etcd backups.",
                  },
                },
                description:
                  "UserManagedKeysConfig holds the resource address to Keys which are used for signing certs and token that are used for communication within cluster.",
                additionalProperties: true,
              },
              desired_anonymous_authentication_config: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    enum: ["MODE_UNSPECIFIED", "ENABLED", "LIMITED"],
                    description:
                      "Defines the mode of limiting anonymous access in the cluster.",
                  },
                },
                description:
                  "AnonymousAuthenticationConfig defines the settings needed to limit endpoints that allow anonymous authentication.",
                additionalProperties: true,
              },
              gke_auto_upgrade_config: {
                type: "object",
                properties: {
                  patch_mode: {
                    type: "string",
                    enum: ["PATCH_MODE_UNSPECIFIED", "ACCELERATED"],
                    description:
                      "PatchMode specifies how auto upgrade patch builds should be selected.",
                  },
                },
                description:
                  "GkeAutoUpgradeConfig is the configuration for GKE auto upgrades.",
                additionalProperties: true,
              },
              desired_network_tier_config: {
                type: "object",
                properties: {
                  network_tier: {
                    type: "string",
                    enum: [
                      "NETWORK_TIER_UNSPECIFIED",
                      "NETWORK_TIER_DEFAULT",
                      "NETWORK_TIER_PREMIUM",
                      "NETWORK_TIER_STANDARD",
                    ],
                    description: "Network tier configuration.",
                  },
                },
                description:
                  "NetworkTierConfig contains network tier information.",
                additionalProperties: true,
              },
              desired_privileged_admission_config: {
                type: "object",
                properties: {
                  allowlist_paths: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The customer allowlist Cloud Storage paths for the cluster. These paths are used with the `--autopilot-privileged-admission` flag to authorize privileged workloads in Autopilot clusters.  Paths can be GKE-owned, in the format `gke://<partner_name>/<app_name>/<allowlist_path>`, or customer-owned, in the format `gs://<bucket_name>/<allowlist_path>`.  Wildcards (`*`) are supported to authorize all allowlists under specific paths or directories. Example: `gs://my-bucket/*` will authorize all allowlists under the `my-bucket` bucket.",
                  },
                },
                description:
                  "PrivilegedAdmissionConfig stores the list of authorized allowlist paths for the cluster.",
                additionalProperties: true,
              },
              desired_managed_opentelemetry_config: {
                type: "object",
                properties: {
                  scope: {
                    type: "string",
                    enum: [
                      "SCOPE_UNSPECIFIED",
                      "NONE",
                      "COLLECTION_AND_INSTRUMENTATION_COMPONENTS",
                    ],
                    description: "Scope of the Managed OpenTelemetry pipeline.",
                  },
                },
                description:
                  "ManagedOpenTelemetryConfig is the configuration for the GKE Managed OpenTelemetry pipeline.",
                additionalProperties: true,
              },
            },
            description:
              "ClusterUpdate describes an update to the cluster. Exactly one update can be applied to a cluster with each request, so at most one field can be provided.",
            additionalProperties: true,
          },
          required: true,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster) of the cluster to update. Specified in the format `projects/*/locations/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster) of the cluster to update. Specified in the format `projects/*/locations/*/clusters/*`.",
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
        if (input.event.inputConfig.update !== undefined)
          request.update = input.event.inputConfig.update;
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.updateCluster(request, (err: any, response: any) => {
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

export default updateCluster;
