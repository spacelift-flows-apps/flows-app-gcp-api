import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const getCluster: AppBlock = {
  name: "Get Cluster",
  description: `Gets the details of a specific cluster.`,
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
            "Deprecated. The name of the cluster to retrieve. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the cluster to retrieve. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster) of the cluster to retrieve. Specified in the format `projects/*/locations/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster) of the cluster to retrieve. Specified in the format `projects/*/locations/*/clusters/*`.",
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
          client.getCluster(request, (err: any, response: any) => {
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
              "The name of this cluster. The name must be unique within this project and location (e.g. zone or region), and can be up to 40 characters with the following restrictions:  * Lowercase letters, numbers, and hyphens only. * Must start with a letter. * Must end with a number or a letter.",
          },
          description: {
            type: "string",
            description: "An optional description of this cluster.",
          },
          initial_node_count: {
            type: "integer",
            description:
              'The number of nodes to create in this cluster. You must ensure that your Compute Engine [resource quota](https://cloud.google.com/compute/quotas) is sufficient for this number of instances. You must also have available firewall and routes quota. For requests, this field should only be used in lieu of a "node_pool" object, since this configuration (along with the "node_config") will be used to create a "NodePool" object with an auto-generated name. Do not use this and a node_pool at the same time.  This field is deprecated, use node_pool.initial_node_count instead.',
          },
          node_config: {
            type: "object",
            properties: {
              machine_type: {
                type: "string",
                description:
                  "The name of a Google Compute Engine [machine type](https://cloud.google.com/compute/docs/machine-types)  If unspecified, the default machine type is `e2-medium`.",
              },
              disk_size_gb: {
                type: "integer",
                description:
                  "Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB.  If unspecified, the default disk size is 100GB.",
              },
              oauth_scopes: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'The set of Google API scopes to be made available on all of the node VMs under the "default" service account.  The following scopes are recommended, but not required, and by default are not included:  * `https://www.googleapis.com/auth/compute` is required for mounting persistent storage on your nodes. * `https://www.googleapis.com/auth/devstorage.read_only` is required for communicating with **gcr.io** (the [Artifact Registry](https://cloud.google.com/artifact-registry/)).  If unspecified, no scopes are added, unless Cloud Logging or Cloud Monitoring are enabled, in which case their required scopes will be added.',
              },
              service_account: {
                type: "string",
                description:
                  'The Google Cloud Platform Service Account to be used by the node VMs. Specify the email address of the Service Account; otherwise, if no Service Account is specified, the "default" service account is used.',
              },
              metadata: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'The metadata key/value pairs assigned to instances in the cluster.  Keys must conform to the regexp `[a-zA-Z0-9-_]+` and be less than 128 bytes in length. These are reflected as part of a URL in the metadata server. Additionally, to avoid ambiguity, keys must not conflict with any other metadata keys for the project or be one of the reserved keys:   - "cluster-location"  - "cluster-name"  - "cluster-uid"  - "configure-sh"  - "containerd-configure-sh"  - "enable-os-login"  - "gci-ensure-gke-docker"  - "gci-metrics-enabled"  - "gci-update-strategy"  - "instance-template"  - "kube-env"  - "startup-script"  - "user-data"  - "disable-address-manager"  - "windows-startup-script-ps1"  - "common-psm1"  - "k8s-node-setup-psm1"  - "install-ssh-psm1"  - "user-profile-psm1"  Values are free-form strings, and only have meaning as interpreted by the image running in the instance. The only restriction placed on them is that each value\'s size must be less than or equal to 32 KB.  The total size of all keys and values must be less than 512 KB.',
              },
              image_type: {
                type: "string",
                description:
                  "The image type to use for this node. Note that for a given image type, the latest version of it will be used. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "The map of Kubernetes labels (key/value pairs) to be applied to each node. These will added in addition to any default label(s) that Kubernetes may apply to the node. In case of conflict in label keys, the applied set may differ depending on the Kubernetes version -- it's best to assume the behavior is undefined and conflicts should be avoided. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/",
              },
              local_ssd_count: {
                type: "integer",
                description:
                  "The number of local SSD disks to be attached to the node.  The limit for this value is dependent upon the maximum number of disks available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information.",
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The list of instance tags applied to all nodes. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during cluster or node pool creation. Each tag within the list must comply with RFC1035.",
              },
              preemptible: {
                type: "boolean",
                description:
                  "Whether the nodes are created as preemptible VM instances. See: https://cloud.google.com/compute/docs/instances/preemptible for more information about preemptible VM instances.",
              },
              accelerators: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    accelerator_count: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    accelerator_type: {
                      type: "string",
                      description:
                        "The accelerator type resource name. List of supported accelerators [here](https://cloud.google.com/compute/docs/gpus)",
                    },
                    gpu_partition_size: {
                      type: "string",
                      description:
                        "Size of partitions to create on the GPU. Valid values are described in the NVIDIA [mig user guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/#partitioning).",
                    },
                    gpu_sharing_config: {
                      type: "object",
                      properties: {
                        max_shared_clients_per_gpu: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        gpu_sharing_strategy: {
                          type: "string",
                          enum: [
                            "GPU_SHARING_STRATEGY_UNSPECIFIED",
                            "TIME_SHARING",
                            "MPS",
                          ],
                          description:
                            "The type of GPU sharing strategy to enable on the GPU node.",
                        },
                      },
                      description:
                        "GPUSharingConfig represents the GPU sharing configuration for Hardware Accelerators.",
                      additionalProperties: true,
                    },
                    gpu_driver_installation_config: {
                      type: "object",
                      properties: {
                        gpu_driver_version: {
                          type: "string",
                          enum: [
                            "GPU_DRIVER_VERSION_UNSPECIFIED",
                            "INSTALLATION_DISABLED",
                            "DEFAULT",
                            "LATEST",
                          ],
                          description:
                            "Mode for how the GPU driver is installed.",
                        },
                      },
                      description:
                        "GPUDriverInstallationConfig specifies the version of GPU driver to be auto installed.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "AcceleratorConfig represents a Hardware Accelerator request.",
                  additionalProperties: true,
                },
                description:
                  "A list of hardware accelerators to be attached to each node. See https://cloud.google.com/compute/docs/gpus for more information about support for GPUs.",
              },
              disk_type: {
                type: "string",
                description:
                  "Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced')  If unspecified, the default disk type is 'pd-standard'",
              },
              min_cpu_platform: {
                type: "string",
                description:
                  'Minimum CPU platform to be used by this instance. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as `minCpuPlatform: "Intel Haswell"` or `minCpuPlatform: "Intel Sandy Bridge"`. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform)',
              },
              workload_metadata_config: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    enum: ["MODE_UNSPECIFIED", "GCE_METADATA", "GKE_METADATA"],
                    description:
                      "Mode is the configuration for how to expose metadata to workloads running on the node pool.",
                  },
                },
                description:
                  "WorkloadMetadataConfig defines the metadata configuration to expose to workloads on the node pool.",
                additionalProperties: true,
              },
              taints: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description: "Key for taint.",
                    },
                    value: {
                      type: "string",
                      description: "Value for taint.",
                    },
                    effect: {
                      type: "string",
                      enum: [
                        "EFFECT_UNSPECIFIED",
                        "NO_SCHEDULE",
                        "PREFER_NO_SCHEDULE",
                        "NO_EXECUTE",
                      ],
                      description: "Effect for taint.",
                    },
                  },
                  description:
                    "Kubernetes taint is composed of three fields: key, value, and effect. Effect can only be one of three types:  NoSchedule, PreferNoSchedule or NoExecute.  See [here](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration) for more information, including usage and the valid values.",
                  additionalProperties: true,
                },
                description:
                  "List of kubernetes taints to be applied to each node.  For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/",
              },
              sandbox_config: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["UNSPECIFIED", "GVISOR"],
                    description: "Type of the sandbox to use for the node.",
                  },
                },
                description:
                  "SandboxConfig contains configurations of the sandbox to use for the node.",
                additionalProperties: true,
              },
              node_group: {
                type: "string",
                description:
                  "Setting this field will assign instances of this pool to run on the specified node group. This is useful for running workloads on [sole tenant nodes](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes).",
              },
              reservation_affinity: {
                type: "object",
                properties: {
                  consume_reservation_type: {
                    type: "string",
                    enum: [
                      "UNSPECIFIED",
                      "NO_RESERVATION",
                      "ANY_RESERVATION",
                      "SPECIFIC_RESERVATION",
                    ],
                    description:
                      "Corresponds to the type of reservation consumption.",
                  },
                  key: {
                    type: "string",
                    description:
                      'Corresponds to the label key of a reservation resource. To target a SPECIFIC_RESERVATION by name, specify "compute.googleapis.com/reservation-name" as the key and specify the name of your reservation as its value.',
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Corresponds to the label value(s) of reservation resource(s).",
                  },
                },
                description:
                  "[ReservationAffinity](https://cloud.google.com/compute/docs/instances/reserving-zonal-resources) is the configuration of desired reservation which instances could take capacity from.",
                additionalProperties: true,
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
              linux_node_config: {
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
              kubelet_config: {
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
              boot_disk_kms_key: {
                type: "string",
                description:
                  "The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption",
              },
              gcfs_config: {
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
              advanced_machine_features: {
                type: "object",
                properties: {
                  threads_per_core: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  enable_nested_virtualization: {
                    type: "boolean",
                    description:
                      "Whether or not to enable nested virtualization (defaults to false).",
                  },
                  performance_monitoring_unit: {
                    type: "string",
                    enum: [
                      "PERFORMANCE_MONITORING_UNIT_UNSPECIFIED",
                      "ARCHITECTURAL",
                      "STANDARD",
                      "ENHANCED",
                    ],
                    description:
                      "Type of Performance Monitoring Unit (PMU) requested on node pool instances. If unset, PMU will not be available to the node.",
                  },
                },
                description:
                  "Specifies options for controlling advanced machine features.",
                additionalProperties: true,
              },
              gvnic: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether gVNIC features are enabled in the node pool.",
                  },
                },
                description: "Configuration of gVNIC feature.",
                additionalProperties: true,
              },
              spot: {
                type: "boolean",
                description:
                  "Spot flag for enabling Spot VM, which is a rebrand of the existing preemptible flag.",
              },
              confidential_nodes: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether Confidential Nodes feature is enabled.",
                  },
                  confidential_instance_type: {
                    type: "string",
                    enum: [
                      "CONFIDENTIAL_INSTANCE_TYPE_UNSPECIFIED",
                      "SEV",
                      "SEV_SNP",
                      "TDX",
                    ],
                    description:
                      "Defines the type of technology used by the confidential node.",
                  },
                },
                description:
                  "ConfidentialNodes is configuration for the confidential nodes feature, which makes nodes run on confidential VMs.",
                additionalProperties: true,
              },
              fast_socket: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether Fast Socket features are enabled in the node pool.",
                  },
                },
                description: "Configuration of Fast Socket feature.",
                additionalProperties: true,
              },
              resource_labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "The resource labels for the node pool to use to annotate any related Google Compute Engine resources.",
              },
              logging_config: {
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
              windows_node_config: {
                type: "object",
                properties: {
                  os_version: {
                    type: "string",
                    enum: [
                      "OS_VERSION_UNSPECIFIED",
                      "OS_VERSION_LTSC2019",
                      "OS_VERSION_LTSC2022",
                    ],
                    description:
                      "OSVersion specifies the Windows node config to be used on the node.",
                  },
                },
                description:
                  "Parameters that can be configured on Windows nodes. Windows Node Config that define the parameters that will be used to configure the Windows node pool settings.",
                additionalProperties: true,
              },
              local_nvme_ssd_block_config: {
                type: "object",
                properties: {
                  local_ssd_count: {
                    type: "integer",
                    description:
                      "Number of local NVMe SSDs to use.  The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information.  A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info.",
                  },
                },
                description:
                  "LocalNvmeSsdBlockConfig contains configuration for using raw-block local NVMe SSDs",
                additionalProperties: true,
              },
              ephemeral_storage_local_ssd_config: {
                type: "object",
                properties: {
                  local_ssd_count: {
                    type: "integer",
                    description:
                      "Number of local SSDs to use to back ephemeral storage. Uses NVMe interfaces.  A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info.",
                  },
                  data_cache_count: {
                    type: "integer",
                    description:
                      "Number of local SSDs to use for GKE Data Cache.",
                  },
                },
                description:
                  "EphemeralStorageLocalSsdConfig contains configuration for the node ephemeral storage using Local SSDs.",
                additionalProperties: true,
              },
              sole_tenant_config: {
                type: "object",
                properties: {
                  node_affinities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        key: {
                          type: "string",
                          description: "Key for NodeAffinity.",
                        },
                        operator: {
                          type: "string",
                          enum: ["OPERATOR_UNSPECIFIED", "IN", "NOT_IN"],
                          description: "Operator for NodeAffinity.",
                        },
                        values: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description: "Values for NodeAffinity.",
                        },
                      },
                      description:
                        "Specifies the NodeAffinity key, values, and affinity operator according to [shared sole tenant node group affinities](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes#node_affinity_and_anti-affinity).",
                      additionalProperties: true,
                    },
                    description:
                      "NodeAffinities used to match to a shared sole tenant node group.",
                  },
                  min_node_cpus: {
                    type: "integer",
                    description:
                      "Optional. The minimum number of virtual CPUs this instance will consume when running on a sole-tenant node. This field can only be set if the node pool is created in a shared sole-tenant node group.",
                  },
                },
                description:
                  "SoleTenantConfig contains the NodeAffinities to specify what shared sole tenant node groups should back the node pool.",
                additionalProperties: true,
              },
              containerd_config: {
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
              resource_manager_tags: {
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
              enable_confidential_storage: {
                type: "boolean",
                description: "Optional. Reserved for future use.",
              },
              secondary_boot_disks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mode: {
                      type: "string",
                      enum: ["MODE_UNSPECIFIED", "CONTAINER_IMAGE_CACHE"],
                      description: "Disk mode (container image cache, etc.)",
                    },
                    disk_image: {
                      type: "string",
                      description:
                        "Fully-qualified resource ID for an existing disk image.",
                    },
                  },
                  description:
                    "SecondaryBootDisk represents a persistent disk attached to a node with special configurations based on its mode.",
                  additionalProperties: true,
                },
                description:
                  "List of secondary boot disks attached to the nodes.",
              },
              storage_pools: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "List of Storage Pools where boot disks are provisioned.",
              },
              secondary_boot_disk_update_strategy: {
                type: "object",
                properties: {},
                description:
                  "SecondaryBootDiskUpdateStrategy is a placeholder which will be extended in the future to define different options for updating secondary boot disks.",
                additionalProperties: true,
              },
              gpu_direct_config: {
                type: "object",
                properties: {
                  gpu_direct_strategy: {
                    type: "string",
                    enum: ["GPU_DIRECT_STRATEGY_UNSPECIFIED", "RDMA"],
                    description:
                      "The type of GPU direct strategy to enable on the node pool.",
                  },
                },
                description:
                  "GPUDirectConfig specifies the GPU direct strategy on the node pool.",
                additionalProperties: true,
              },
              max_run_duration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              local_ssd_encryption_mode: {
                type: "string",
                enum: [
                  "LOCAL_SSD_ENCRYPTION_MODE_UNSPECIFIED",
                  "STANDARD_ENCRYPTION",
                  "EPHEMERAL_KEY_ENCRYPTION",
                ],
                description:
                  "Specifies which method should be used for encrypting the Local SSDs attached to the node.",
              },
              effective_cgroup_mode: {
                type: "string",
                enum: [
                  "EFFECTIVE_CGROUP_MODE_UNSPECIFIED",
                  "EFFECTIVE_CGROUP_MODE_V1",
                  "EFFECTIVE_CGROUP_MODE_V2",
                ],
                description:
                  "Output only. effective_cgroup_mode is the cgroup mode actually used by the node pool. It is determined by the cgroup mode specified in the LinuxNodeConfig or the default cgroup mode based on the cluster creation version.",
              },
              flex_start: {
                type: "boolean",
                description: "Flex Start flag for enabling Flex Start VM.",
              },
              boot_disk: {
                type: "object",
                properties: {
                  disk_type: {
                    type: "string",
                    description:
                      "Disk type of the boot disk. (i.e. Hyperdisk-Balanced, PD-Balanced, etc.)",
                  },
                  size_gb: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  provisioned_iops: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  provisioned_throughput: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                },
                description:
                  "BootDisk specifies the boot disk configuration for nodepools.",
                additionalProperties: true,
              },
              consolidation_delay: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
            },
            description:
              "Parameters that describe the nodes in a cluster.  GKE Autopilot clusters do not recognize parameters in `NodeConfig`. Use [AutoprovisioningNodePoolDefaults][google.container.v1.AutoprovisioningNodePoolDefaults] instead.",
            additionalProperties: true,
          },
          master_auth: {
            type: "object",
            properties: {
              username: {
                type: "string",
                description:
                  "The username to use for HTTP basic authentication to the master endpoint. For clusters v1.6.0 and later, basic authentication can be disabled by leaving username unspecified (or setting it to the empty string).  Warning: basic authentication is deprecated, and will be removed in GKE control plane versions 1.19 and newer. For a list of recommended authentication methods, see: https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication",
              },
              password: {
                type: "string",
                description:
                  "The password to use for HTTP basic authentication to the master endpoint. Because the master endpoint is open to the Internet, you should create a strong password.  If a password is provided for cluster creation, username must be non-empty.  Warning: basic authentication is deprecated, and will be removed in GKE control plane versions 1.19 and newer. For a list of recommended authentication methods, see: https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication",
              },
              client_certificate_config: {
                type: "object",
                properties: {
                  issue_client_certificate: {
                    type: "boolean",
                    description: "Issue a client certificate.",
                  },
                },
                description:
                  "Configuration for client certificates on the cluster.",
                additionalProperties: true,
              },
              cluster_ca_certificate: {
                type: "string",
                description:
                  "Output only. Base64-encoded public certificate that is the root of trust for the cluster.",
              },
              client_certificate: {
                type: "string",
                description:
                  "Output only. Base64-encoded public certificate used by clients to authenticate to the cluster endpoint. Issued only if client_certificate_config is set.",
              },
              client_key: {
                type: "string",
                description:
                  "Output only. Base64-encoded private key used by clients to authenticate to the cluster endpoint.",
              },
            },
            description:
              "The authentication information for accessing the master endpoint. Authentication can be done using HTTP basic auth or using client certificates.",
            additionalProperties: true,
          },
          logging_service: {
            type: "string",
            description:
              "The logging service the cluster should use to write logs. Currently available options:  * `logging.googleapis.com/kubernetes` - The Cloud Logging service with a Kubernetes-native resource model * `logging.googleapis.com` - The legacy Cloud Logging service (no longer   available as of GKE 1.15). * `none` - no logs will be exported from the cluster.  If left as an empty string,`logging.googleapis.com/kubernetes` will be used for GKE 1.14+ or `logging.googleapis.com` for earlier versions.",
          },
          monitoring_service: {
            type: "string",
            description:
              "The monitoring service the cluster should use to write metrics. Currently available options:  * `monitoring.googleapis.com/kubernetes` - The Cloud Monitoring service with a Kubernetes-native resource model * `monitoring.googleapis.com` - The legacy Cloud Monitoring service (no   longer available as of GKE 1.15). * `none` - No metrics will be exported from the cluster.  If left as an empty string,`monitoring.googleapis.com/kubernetes` will be used for GKE 1.14+ or `monitoring.googleapis.com` for earlier versions.",
          },
          network: {
            type: "string",
            description:
              "The name of the Google Compute Engine [network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks) to which the cluster is connected. If left unspecified, the `default` network will be used.",
          },
          cluster_ipv4_cidr: {
            type: "string",
            description:
              "The IP address range of the container pods in this cluster, in [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`). Leave blank to have one automatically chosen or specify a `/14` block in `10.0.0.0/8`.",
          },
          addons_config: {
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
                description: "Configuration options for the Cloud Run feature.",
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
                        description: "Enable log collection for Ray clusters.",
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
                description: "Configuration for the High Scale Checkpointing.",
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
          subnetwork: {
            type: "string",
            description:
              "The name of the Google Compute Engine [subnetwork](https://cloud.google.com/compute/docs/subnetworks) to which the cluster is connected.",
          },
          node_pools: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the node pool.",
                },
                config: {
                  type: "object",
                  properties: {
                    machine_type: {
                      type: "string",
                      description:
                        "The name of a Google Compute Engine [machine type](https://cloud.google.com/compute/docs/machine-types)  If unspecified, the default machine type is `e2-medium`.",
                    },
                    disk_size_gb: {
                      type: "integer",
                      description:
                        "Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB.  If unspecified, the default disk size is 100GB.",
                    },
                    oauth_scopes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'The set of Google API scopes to be made available on all of the node VMs under the "default" service account.  The following scopes are recommended, but not required, and by default are not included:  * `https://www.googleapis.com/auth/compute` is required for mounting persistent storage on your nodes. * `https://www.googleapis.com/auth/devstorage.read_only` is required for communicating with **gcr.io** (the [Artifact Registry](https://cloud.google.com/artifact-registry/)).  If unspecified, no scopes are added, unless Cloud Logging or Cloud Monitoring are enabled, in which case their required scopes will be added.',
                    },
                    service_account: {
                      type: "string",
                      description:
                        'The Google Cloud Platform Service Account to be used by the node VMs. Specify the email address of the Service Account; otherwise, if no Service Account is specified, the "default" service account is used.',
                    },
                    metadata: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        'The metadata key/value pairs assigned to instances in the cluster.  Keys must conform to the regexp `[a-zA-Z0-9-_]+` and be less than 128 bytes in length. These are reflected as part of a URL in the metadata server. Additionally, to avoid ambiguity, keys must not conflict with any other metadata keys for the project or be one of the reserved keys:   - "cluster-location"  - "cluster-name"  - "cluster-uid"  - "configure-sh"  - "containerd-configure-sh"  - "enable-os-login"  - "gci-ensure-gke-docker"  - "gci-metrics-enabled"  - "gci-update-strategy"  - "instance-template"  - "kube-env"  - "startup-script"  - "user-data"  - "disable-address-manager"  - "windows-startup-script-ps1"  - "common-psm1"  - "k8s-node-setup-psm1"  - "install-ssh-psm1"  - "user-profile-psm1"  Values are free-form strings, and only have meaning as interpreted by the image running in the instance. The only restriction placed on them is that each value\'s size must be less than or equal to 32 KB.  The total size of all keys and values must be less than 512 KB.',
                    },
                    image_type: {
                      type: "string",
                      description:
                        "The image type to use for this node. Note that for a given image type, the latest version of it will be used. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.",
                    },
                    labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "The map of Kubernetes labels (key/value pairs) to be applied to each node. These will added in addition to any default label(s) that Kubernetes may apply to the node. In case of conflict in label keys, the applied set may differ depending on the Kubernetes version -- it's best to assume the behavior is undefined and conflicts should be avoided. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/",
                    },
                    local_ssd_count: {
                      type: "integer",
                      description:
                        "The number of local SSD disks to be attached to the node.  The limit for this value is dependent upon the maximum number of disks available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The list of instance tags applied to all nodes. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during cluster or node pool creation. Each tag within the list must comply with RFC1035.",
                    },
                    preemptible: {
                      type: "boolean",
                      description:
                        "Whether the nodes are created as preemptible VM instances. See: https://cloud.google.com/compute/docs/instances/preemptible for more information about preemptible VM instances.",
                    },
                    accelerators: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          accelerator_count: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          accelerator_type: {
                            type: "string",
                            description:
                              "The accelerator type resource name. List of supported accelerators [here](https://cloud.google.com/compute/docs/gpus)",
                          },
                          gpu_partition_size: {
                            type: "string",
                            description:
                              "Size of partitions to create on the GPU. Valid values are described in the NVIDIA [mig user guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/#partitioning).",
                          },
                          gpu_sharing_config: {
                            type: "object",
                            properties: {
                              max_shared_clients_per_gpu: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              gpu_sharing_strategy: {
                                type: "string",
                                enum: [
                                  "GPU_SHARING_STRATEGY_UNSPECIFIED",
                                  "TIME_SHARING",
                                  "MPS",
                                ],
                                description:
                                  "The type of GPU sharing strategy to enable on the GPU node.",
                              },
                            },
                            description:
                              "GPUSharingConfig represents the GPU sharing configuration for Hardware Accelerators.",
                            additionalProperties: true,
                          },
                          gpu_driver_installation_config: {
                            type: "object",
                            properties: {
                              gpu_driver_version: {
                                type: "string",
                                enum: [
                                  "GPU_DRIVER_VERSION_UNSPECIFIED",
                                  "INSTALLATION_DISABLED",
                                  "DEFAULT",
                                  "LATEST",
                                ],
                                description:
                                  "Mode for how the GPU driver is installed.",
                              },
                            },
                            description:
                              "GPUDriverInstallationConfig specifies the version of GPU driver to be auto installed.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "AcceleratorConfig represents a Hardware Accelerator request.",
                        additionalProperties: true,
                      },
                      description:
                        "A list of hardware accelerators to be attached to each node. See https://cloud.google.com/compute/docs/gpus for more information about support for GPUs.",
                    },
                    disk_type: {
                      type: "string",
                      description:
                        "Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced')  If unspecified, the default disk type is 'pd-standard'",
                    },
                    min_cpu_platform: {
                      type: "string",
                      description:
                        'Minimum CPU platform to be used by this instance. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as `minCpuPlatform: "Intel Haswell"` or `minCpuPlatform: "Intel Sandy Bridge"`. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform)',
                    },
                    workload_metadata_config: {
                      type: "object",
                      properties: {
                        mode: {
                          type: "string",
                          enum: [
                            "MODE_UNSPECIFIED",
                            "GCE_METADATA",
                            "GKE_METADATA",
                          ],
                          description:
                            "Mode is the configuration for how to expose metadata to workloads running on the node pool.",
                        },
                      },
                      description:
                        "WorkloadMetadataConfig defines the metadata configuration to expose to workloads on the node pool.",
                      additionalProperties: true,
                    },
                    taints: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          key: {
                            type: "string",
                            description: "Key for taint.",
                          },
                          value: {
                            type: "string",
                            description: "Value for taint.",
                          },
                          effect: {
                            type: "string",
                            enum: [
                              "EFFECT_UNSPECIFIED",
                              "NO_SCHEDULE",
                              "PREFER_NO_SCHEDULE",
                              "NO_EXECUTE",
                            ],
                            description: "Effect for taint.",
                          },
                        },
                        description:
                          "Kubernetes taint is composed of three fields: key, value, and effect. Effect can only be one of three types:  NoSchedule, PreferNoSchedule or NoExecute.  See [here](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration) for more information, including usage and the valid values.",
                        additionalProperties: true,
                      },
                      description:
                        "List of kubernetes taints to be applied to each node.  For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/",
                    },
                    sandbox_config: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["UNSPECIFIED", "GVISOR"],
                          description:
                            "Type of the sandbox to use for the node.",
                        },
                      },
                      description:
                        "SandboxConfig contains configurations of the sandbox to use for the node.",
                      additionalProperties: true,
                    },
                    node_group: {
                      type: "string",
                      description:
                        "Setting this field will assign instances of this pool to run on the specified node group. This is useful for running workloads on [sole tenant nodes](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes).",
                    },
                    reservation_affinity: {
                      type: "object",
                      properties: {
                        consume_reservation_type: {
                          type: "string",
                          enum: [
                            "UNSPECIFIED",
                            "NO_RESERVATION",
                            "ANY_RESERVATION",
                            "SPECIFIC_RESERVATION",
                          ],
                          description:
                            "Corresponds to the type of reservation consumption.",
                        },
                        key: {
                          type: "string",
                          description:
                            'Corresponds to the label key of a reservation resource. To target a SPECIFIC_RESERVATION by name, specify "compute.googleapis.com/reservation-name" as the key and specify the name of your reservation as its value.',
                        },
                        values: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Corresponds to the label value(s) of reservation resource(s).",
                        },
                      },
                      description:
                        "[ReservationAffinity](https://cloud.google.com/compute/docs/instances/reserving-zonal-resources) is the configuration of desired reservation which instances could take capacity from.",
                      additionalProperties: true,
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
                    linux_node_config: {
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
                          description:
                            "Hugepages amount in both 2m and 1g size",
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
                    kubelet_config: {
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
                          description:
                            "Enable or disable Kubelet read only port.",
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
                    boot_disk_kms_key: {
                      type: "string",
                      description:
                        "The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption",
                    },
                    gcfs_config: {
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
                    advanced_machine_features: {
                      type: "object",
                      properties: {
                        threads_per_core: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        enable_nested_virtualization: {
                          type: "boolean",
                          description:
                            "Whether or not to enable nested virtualization (defaults to false).",
                        },
                        performance_monitoring_unit: {
                          type: "string",
                          enum: [
                            "PERFORMANCE_MONITORING_UNIT_UNSPECIFIED",
                            "ARCHITECTURAL",
                            "STANDARD",
                            "ENHANCED",
                          ],
                          description:
                            "Type of Performance Monitoring Unit (PMU) requested on node pool instances. If unset, PMU will not be available to the node.",
                        },
                      },
                      description:
                        "Specifies options for controlling advanced machine features.",
                      additionalProperties: true,
                    },
                    gvnic: {
                      type: "object",
                      properties: {
                        enabled: {
                          type: "boolean",
                          description:
                            "Whether gVNIC features are enabled in the node pool.",
                        },
                      },
                      description: "Configuration of gVNIC feature.",
                      additionalProperties: true,
                    },
                    spot: {
                      type: "boolean",
                      description:
                        "Spot flag for enabling Spot VM, which is a rebrand of the existing preemptible flag.",
                    },
                    confidential_nodes: {
                      type: "object",
                      properties: {
                        enabled: {
                          type: "boolean",
                          description:
                            "Whether Confidential Nodes feature is enabled.",
                        },
                        confidential_instance_type: {
                          type: "string",
                          enum: [
                            "CONFIDENTIAL_INSTANCE_TYPE_UNSPECIFIED",
                            "SEV",
                            "SEV_SNP",
                            "TDX",
                          ],
                          description:
                            "Defines the type of technology used by the confidential node.",
                        },
                      },
                      description:
                        "ConfidentialNodes is configuration for the confidential nodes feature, which makes nodes run on confidential VMs.",
                      additionalProperties: true,
                    },
                    fast_socket: {
                      type: "object",
                      properties: {
                        enabled: {
                          type: "boolean",
                          description:
                            "Whether Fast Socket features are enabled in the node pool.",
                        },
                      },
                      description: "Configuration of Fast Socket feature.",
                      additionalProperties: true,
                    },
                    resource_labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "The resource labels for the node pool to use to annotate any related Google Compute Engine resources.",
                    },
                    logging_config: {
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
                    windows_node_config: {
                      type: "object",
                      properties: {
                        os_version: {
                          type: "string",
                          enum: [
                            "OS_VERSION_UNSPECIFIED",
                            "OS_VERSION_LTSC2019",
                            "OS_VERSION_LTSC2022",
                          ],
                          description:
                            "OSVersion specifies the Windows node config to be used on the node.",
                        },
                      },
                      description:
                        "Parameters that can be configured on Windows nodes. Windows Node Config that define the parameters that will be used to configure the Windows node pool settings.",
                      additionalProperties: true,
                    },
                    local_nvme_ssd_block_config: {
                      type: "object",
                      properties: {
                        local_ssd_count: {
                          type: "integer",
                          description:
                            "Number of local NVMe SSDs to use.  The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information.  A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info.",
                        },
                      },
                      description:
                        "LocalNvmeSsdBlockConfig contains configuration for using raw-block local NVMe SSDs",
                      additionalProperties: true,
                    },
                    ephemeral_storage_local_ssd_config: {
                      type: "object",
                      properties: {
                        local_ssd_count: {
                          type: "integer",
                          description:
                            "Number of local SSDs to use to back ephemeral storage. Uses NVMe interfaces.  A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info.",
                        },
                        data_cache_count: {
                          type: "integer",
                          description:
                            "Number of local SSDs to use for GKE Data Cache.",
                        },
                      },
                      description:
                        "EphemeralStorageLocalSsdConfig contains configuration for the node ephemeral storage using Local SSDs.",
                      additionalProperties: true,
                    },
                    sole_tenant_config: {
                      type: "object",
                      properties: {
                        node_affinities: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              key: {
                                type: "string",
                                description: "Key for NodeAffinity.",
                              },
                              operator: {
                                type: "string",
                                enum: ["OPERATOR_UNSPECIFIED", "IN", "NOT_IN"],
                                description: "Operator for NodeAffinity.",
                              },
                              values: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description: "Values for NodeAffinity.",
                              },
                            },
                            description:
                              "Specifies the NodeAffinity key, values, and affinity operator according to [shared sole tenant node group affinities](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes#node_affinity_and_anti-affinity).",
                            additionalProperties: true,
                          },
                          description:
                            "NodeAffinities used to match to a shared sole tenant node group.",
                        },
                        min_node_cpus: {
                          type: "integer",
                          description:
                            "Optional. The minimum number of virtual CPUs this instance will consume when running on a sole-tenant node. This field can only be set if the node pool is created in a shared sole-tenant node group.",
                        },
                      },
                      description:
                        "SoleTenantConfig contains the NodeAffinities to specify what shared sole tenant node groups should back the node pool.",
                      additionalProperties: true,
                    },
                    containerd_config: {
                      type: "object",
                      properties: {
                        private_registry_access_config: {
                          type: "object",
                          properties: {
                            enabled: {
                              type: "boolean",
                              description:
                                "Private registry access is enabled.",
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
                          description:
                            "Defines writable cgroups configuration.",
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
                    resource_manager_tags: {
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
                    enable_confidential_storage: {
                      type: "boolean",
                      description: "Optional. Reserved for future use.",
                    },
                    secondary_boot_disks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          mode: {
                            type: "string",
                            enum: ["MODE_UNSPECIFIED", "CONTAINER_IMAGE_CACHE"],
                            description:
                              "Disk mode (container image cache, etc.)",
                          },
                          disk_image: {
                            type: "string",
                            description:
                              "Fully-qualified resource ID for an existing disk image.",
                          },
                        },
                        description:
                          "SecondaryBootDisk represents a persistent disk attached to a node with special configurations based on its mode.",
                        additionalProperties: true,
                      },
                      description:
                        "List of secondary boot disks attached to the nodes.",
                    },
                    storage_pools: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "List of Storage Pools where boot disks are provisioned.",
                    },
                    secondary_boot_disk_update_strategy: {
                      type: "object",
                      properties: {},
                      description:
                        "SecondaryBootDiskUpdateStrategy is a placeholder which will be extended in the future to define different options for updating secondary boot disks.",
                      additionalProperties: true,
                    },
                    gpu_direct_config: {
                      type: "object",
                      properties: {
                        gpu_direct_strategy: {
                          type: "string",
                          enum: ["GPU_DIRECT_STRATEGY_UNSPECIFIED", "RDMA"],
                          description:
                            "The type of GPU direct strategy to enable on the node pool.",
                        },
                      },
                      description:
                        "GPUDirectConfig specifies the GPU direct strategy on the node pool.",
                      additionalProperties: true,
                    },
                    max_run_duration: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    local_ssd_encryption_mode: {
                      type: "string",
                      enum: [
                        "LOCAL_SSD_ENCRYPTION_MODE_UNSPECIFIED",
                        "STANDARD_ENCRYPTION",
                        "EPHEMERAL_KEY_ENCRYPTION",
                      ],
                      description:
                        "Specifies which method should be used for encrypting the Local SSDs attached to the node.",
                    },
                    effective_cgroup_mode: {
                      type: "string",
                      enum: [
                        "EFFECTIVE_CGROUP_MODE_UNSPECIFIED",
                        "EFFECTIVE_CGROUP_MODE_V1",
                        "EFFECTIVE_CGROUP_MODE_V2",
                      ],
                      description:
                        "Output only. effective_cgroup_mode is the cgroup mode actually used by the node pool. It is determined by the cgroup mode specified in the LinuxNodeConfig or the default cgroup mode based on the cluster creation version.",
                    },
                    flex_start: {
                      type: "boolean",
                      description:
                        "Flex Start flag for enabling Flex Start VM.",
                    },
                    boot_disk: {
                      type: "object",
                      properties: {
                        disk_type: {
                          type: "string",
                          description:
                            "Disk type of the boot disk. (i.e. Hyperdisk-Balanced, PD-Balanced, etc.)",
                        },
                        size_gb: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        provisioned_iops: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        provisioned_throughput: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      description:
                        "BootDisk specifies the boot disk configuration for nodepools.",
                      additionalProperties: true,
                    },
                    consolidation_delay: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                  },
                  description:
                    "Parameters that describe the nodes in a cluster.  GKE Autopilot clusters do not recognize parameters in `NodeConfig`. Use [AutoprovisioningNodePoolDefaults][google.container.v1.AutoprovisioningNodePoolDefaults] instead.",
                  additionalProperties: true,
                },
                initial_node_count: {
                  type: "integer",
                  description:
                    "The initial node count for the pool. You must ensure that your Compute Engine [resource quota](https://cloud.google.com/compute/quotas) is sufficient for this number of instances. You must also have available firewall and routes quota.",
                },
                locations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the NodePool's nodes should be located.  If this value is unspecified during node pool creation, the [Cluster.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters#Cluster.FIELDS.locations) value will be used, instead.  Warning: changing node pool locations will result in nodes being added and/or removed.",
                },
                network_config: {
                  type: "object",
                  properties: {
                    pod_range: {
                      type: "string",
                      description:
                        "The ID of the secondary range for pod IPs. If `create_pod_range` is true, this ID is used for the new range. If `create_pod_range` is false, uses an existing secondary range with this ID.  Only applicable if `ip_allocation_policy.use_ip_aliases` is true.  This field cannot be changed after the node pool has been created.",
                    },
                    pod_ipv4_cidr_block: {
                      type: "string",
                      description:
                        "The IP address range for pod IPs in this node pool.  Only applicable if `create_pod_range` is true.  Set to blank to have a range chosen with the default size.  Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask.  Set to a [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) to pick a specific range to use.  Only applicable if `ip_allocation_policy.use_ip_aliases` is true.  This field cannot be changed after the node pool has been created.",
                    },
                    enable_private_nodes: {
                      type: "boolean",
                      description:
                        "Whether nodes have internal IP addresses only. If enable_private_nodes is not specified, then the value is derived from [Cluster.NetworkConfig.default_enable_private_nodes][]",
                    },
                    network_performance_config: {
                      type: "object",
                      properties: {
                        total_egress_bandwidth_tier: {
                          type: "string",
                          enum: ["TIER_UNSPECIFIED", "TIER_1"],
                          description:
                            "Specifies the total network bandwidth tier for the NodePool.",
                        },
                      },
                      description:
                        "Configuration of all network bandwidth tiers",
                      additionalProperties: true,
                    },
                    pod_cidr_overprovision_config: {
                      type: "object",
                      properties: {
                        disable: {
                          type: "boolean",
                          description:
                            "Whether Pod CIDR overprovisioning is disabled. Note: Pod CIDR overprovisioning is enabled by default.",
                        },
                      },
                      description:
                        "[PRIVATE FIELD] Config for pod CIDR size overprovisioning.",
                      additionalProperties: true,
                    },
                    additional_node_network_configs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          network: {
                            type: "string",
                            description:
                              "Name of the VPC where the additional interface belongs",
                          },
                          subnetwork: {
                            type: "string",
                            description:
                              "Name of the subnetwork where the additional interface belongs",
                          },
                        },
                        description:
                          "AdditionalNodeNetworkConfig is the configuration for additional node networks within the NodeNetworkConfig message",
                        additionalProperties: true,
                      },
                      description:
                        "We specify the additional node networks for this node pool using this list. Each node network corresponds to an additional interface",
                    },
                    additional_pod_network_configs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          subnetwork: {
                            type: "string",
                            description:
                              "Name of the subnetwork where the additional pod network belongs.",
                          },
                          secondary_pod_range: {
                            type: "string",
                            description:
                              "The name of the secondary range on the subnet which provides IP address for this pod range.",
                          },
                          max_pods_per_node: {
                            type: "object",
                            properties: {
                              max_pods_per_node: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                            },
                            description: "Constraints applied to pods.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "AdditionalPodNetworkConfig is the configuration for additional pod networks within the NodeNetworkConfig message",
                        additionalProperties: true,
                      },
                      description:
                        "We specify the additional pod networks for this node pool using this list. Each pod network corresponds to an additional alias IP range for the node",
                    },
                    pod_ipv4_range_utilization: {
                      type: "number",
                      description:
                        "Output only. The utilization of the IPv4 range for the pod. The ratio is Usage/[Total number of IPs in the secondary range], Usage=numNodes*numZones*podIPsPerNode.",
                    },
                    subnetwork: {
                      type: "string",
                      description:
                        "Optional. The subnetwork name/path for the node pool. Format: projects/{project}/regions/{region}/subnetworks/{subnetwork} If the cluster is associated with multiple subnetworks, the subnetwork can be either: 1. A user supplied subnetwork name/full path during node pool creation.    Example1: my-subnet    Example2: projects/gke-project/regions/us-central1/subnetworks/my-subnet 2. A subnetwork path picked based on the IP utilization during node pool    creation and is immutable.",
                    },
                    network_tier_config: {
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
                  },
                  description: "Parameters for node pool-level network config.",
                  additionalProperties: true,
                },
                self_link: {
                  type: "string",
                  description:
                    "Output only. Server-defined URL for the resource.",
                },
                version: {
                  type: "string",
                  description:
                    "The version of Kubernetes running on this NodePool's nodes. If unspecified, it defaults as described [here](https://cloud.google.com/kubernetes-engine/versioning#specifying_node_version).",
                },
                instance_group_urls: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Output only. The resource URLs of the [managed instance groups](https://cloud.google.com/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with this node pool. During the node pool blue-green upgrade operation, the URLs contain both blue and green resources.",
                },
                status: {
                  type: "string",
                  enum: [
                    "STATUS_UNSPECIFIED",
                    "PROVISIONING",
                    "RUNNING",
                    "RUNNING_WITH_ERROR",
                    "RECONCILING",
                    "STOPPING",
                    "ERROR",
                  ],
                  description:
                    "Output only. The status of the nodes in this pool instance.",
                },
                status_message: {
                  type: "string",
                  description:
                    "Output only. Deprecated. Use conditions instead. Additional information about the current status of this node pool instance, if available.",
                },
                autoscaling: {
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
                      description:
                        "Can this node pool be deleted automatically.",
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
                      properties: {
                        auto_upgrade_start_time: {
                          type: "string",
                          description:
                            "Output only. This field is set when upgrades are about to commence with the approximate start time for the upgrades, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
                        },
                        description: {
                          type: "string",
                          description:
                            "Output only. This field is set when upgrades are about to commence with the description of the upgrade.",
                        },
                      },
                      description:
                        "AutoUpgradeOptions defines the set of options for the user to control how the Auto Upgrades will proceed.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "NodeManagement defines the set of node management services turned on for the node pool.",
                  additionalProperties: true,
                },
                max_pods_constraint: {
                  type: "object",
                  properties: {
                    max_pods_per_node: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                  },
                  description: "Constraints applied to pods.",
                  additionalProperties: true,
                },
                conditions: {
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
                        description:
                          "Human-friendly representation of the condition",
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
                    "Which conditions caused the current node pool state.",
                },
                pod_ipv4_cidr_size: {
                  type: "integer",
                  description:
                    "Output only. The pod CIDR block size per node in this node pool.",
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
                          description: "Duration string (e.g., '1.5s', '300s')",
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
                placement_policy: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["TYPE_UNSPECIFIED", "COMPACT"],
                      description: "The type of placement.",
                    },
                    tpu_topology: {
                      type: "string",
                      description:
                        "Optional. TPU placement topology for pod slice node pool. https://cloud.google.com/tpu/docs/types-topologies#tpu_topologies",
                    },
                    policy_name: {
                      type: "string",
                      description:
                        "If set, refers to the name of a custom resource policy supplied by the user. The resource policy must be in the same project and region as the node pool. If not found, InvalidArgument error is returned.",
                    },
                  },
                  description:
                    "PlacementPolicy defines the placement policy used by the node pool.",
                  additionalProperties: true,
                },
                update_info: {
                  type: "object",
                  properties: {
                    blue_green_info: {
                      type: "object",
                      properties: {
                        phase: {
                          type: "string",
                          enum: [
                            "PHASE_UNSPECIFIED",
                            "UPDATE_STARTED",
                            "CREATING_GREEN_POOL",
                            "CORDONING_BLUE_POOL",
                            "DRAINING_BLUE_POOL",
                            "NODE_POOL_SOAKING",
                            "DELETING_BLUE_POOL",
                            "ROLLBACK_STARTED",
                          ],
                          description: "Current blue-green upgrade phase.",
                        },
                        blue_instance_group_urls: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "The resource URLs of the [managed instance groups] (/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with blue pool.",
                        },
                        green_instance_group_urls: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "The resource URLs of the [managed instance groups] (/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with green pool.",
                        },
                        blue_pool_deletion_start_time: {
                          type: "string",
                          description:
                            "Time to start deleting blue pool to complete blue-green upgrade, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
                        },
                        green_pool_version: {
                          type: "string",
                          description: "Version of green pool.",
                        },
                      },
                      description:
                        "Information relevant to blue-green upgrade.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "UpdateInfo contains resource (instance groups, etc), status and other intermediate information relevant to a node pool upgrade.",
                  additionalProperties: true,
                },
                etag: {
                  type: "string",
                  description:
                    "This checksum is computed by the server based on the value of node pool fields, and may be sent on update requests to ensure the client has an up-to-date value before proceeding.",
                },
                queued_provisioning: {
                  type: "object",
                  properties: {
                    enabled: {
                      type: "boolean",
                      description:
                        "Denotes that this nodepool is QRM specific, meaning nodes can be only obtained through queuing via the Cluster Autoscaler ProvisioningRequest API.",
                    },
                  },
                  description:
                    "QueuedProvisioning defines the queued provisioning used by the node pool.",
                  additionalProperties: true,
                },
                best_effort_provisioning: {
                  type: "object",
                  properties: {
                    enabled: {
                      type: "boolean",
                      description:
                        "When this is enabled, cluster/node pool creations will ignore non-fatal errors like stockout to best provision as many nodes as possible right now and eventually bring up all target number of nodes",
                    },
                    min_provision_nodes: {
                      type: "integer",
                      description:
                        "Minimum number of nodes to be provisioned to be considered as succeeded, and the rest of nodes will be provisioned gradually and eventually when stockout issue has been resolved.",
                    },
                  },
                  description: "Best effort provisioning.",
                  additionalProperties: true,
                },
                node_drain_config: {
                  type: "object",
                  properties: {
                    respect_pdb_during_node_pool_deletion: {
                      type: "boolean",
                      description:
                        "Whether to respect PDB during node pool deletion.",
                    },
                  },
                  description:
                    "NodeDrainConfig contains the node drain related configurations for this nodepool.",
                  additionalProperties: true,
                },
              },
              description:
                "NodePool contains the name and configuration for a cluster's node pool. Node pools are a set of nodes (i.e. VM's), with a common configuration and specification, under the control of the cluster master. They may have a set of Kubernetes labels applied to them, which may be used to reference them during pod scheduling. They may also be resized up or down, to accommodate the workload.",
              additionalProperties: true,
            },
            description:
              'The node pools associated with this cluster. This field should not be set if "node_config" or "initial_node_count" are specified.',
          },
          locations: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the cluster's nodes should be located.  This field provides a default value if [NodePool.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools#NodePool.FIELDS.locations) are not specified during node pool creation.  Warning: changing cluster locations will update the [NodePool.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools#NodePool.FIELDS.locations) of all node pools and will result in nodes being added and/or removed.",
          },
          enable_kubernetes_alpha: {
            type: "boolean",
            description:
              "Kubernetes alpha features are enabled on this cluster. This includes alpha API groups (e.g. v1alpha1) and features that may not be production ready in the kubernetes version of the master and nodes. The cluster has no SLA for uptime and master/node upgrades are disabled. Alpha enabled clusters are automatically deleted thirty days after creation.",
          },
          alpha_cluster_feature_gates: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              'The list of user specified Kubernetes feature gates. Each string represents the activation status of a feature gate (e.g. "featureX=true" or "featureX=false")',
          },
          resource_labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "The resource labels for the cluster to use to annotate any related Google Compute Engine resources.",
          },
          label_fingerprint: {
            type: "string",
            description:
              "The fingerprint of the set of labels for this cluster.",
          },
          legacy_abac: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "Whether the ABAC authorizer is enabled for this cluster. When enabled, identities in the system, including service accounts, nodes, and controllers, will have statically granted permissions beyond those provided by the RBAC configuration or IAM.",
              },
            },
            description:
              "Configuration for the legacy Attribute Based Access Control authorization mode.",
            additionalProperties: true,
          },
          network_policy: {
            type: "object",
            properties: {
              provider: {
                type: "string",
                enum: ["PROVIDER_UNSPECIFIED", "CALICO"],
                description: "The selected network policy provider.",
              },
              enabled: {
                type: "boolean",
                description:
                  "Whether network policy is enabled on the cluster.",
              },
            },
            description:
              "Configuration options for the NetworkPolicy feature. https://kubernetes.io/docs/concepts/services-networking/networkpolicies/",
            additionalProperties: true,
          },
          ip_allocation_policy: {
            type: "object",
            properties: {
              use_ip_aliases: {
                type: "boolean",
                description:
                  "Whether alias IPs will be used for pod IPs in the cluster. This is used in conjunction with use_routes. It cannot be true if use_routes is true. If both use_ip_aliases and use_routes are false, then the server picks the default IP allocation mode",
              },
              create_subnetwork: {
                type: "boolean",
                description:
                  "Whether a new subnetwork will be created automatically for the cluster.  This field is only applicable when `use_ip_aliases` is true.",
              },
              subnetwork_name: {
                type: "string",
                description:
                  "A custom subnetwork name to be used if `create_subnetwork` is true.  If this field is empty, then an automatic name will be chosen for the new subnetwork.",
              },
              cluster_ipv4_cidr: {
                type: "string",
                description:
                  "This field is deprecated, use cluster_ipv4_cidr_block.",
              },
              node_ipv4_cidr: {
                type: "string",
                description:
                  "This field is deprecated, use node_ipv4_cidr_block.",
              },
              services_ipv4_cidr: {
                type: "string",
                description:
                  "This field is deprecated, use services_ipv4_cidr_block.",
              },
              cluster_secondary_range_name: {
                type: "string",
                description:
                  "The name of the secondary range to be used for the cluster CIDR block.  The secondary range will be used for pod IP addresses. This must be an existing secondary range associated with the cluster subnetwork.  This field is only applicable with use_ip_aliases is true and create_subnetwork is false.",
              },
              services_secondary_range_name: {
                type: "string",
                description:
                  "The name of the secondary range to be used as for the services CIDR block.  The secondary range will be used for service ClusterIPs. This must be an existing secondary range associated with the cluster subnetwork.  This field is only applicable with use_ip_aliases is true and create_subnetwork is false.",
              },
              cluster_ipv4_cidr_block: {
                type: "string",
                description:
                  "The IP address range for the cluster pod IPs. If this field is set, then `cluster.cluster_ipv4_cidr` must be left blank.  This field is only applicable when `use_ip_aliases` is true.  Set to blank to have a range chosen with the default size.  Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask.  Set to a [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.",
              },
              node_ipv4_cidr_block: {
                type: "string",
                description:
                  "The IP address range of the instance IPs in this cluster.  This is applicable only if `create_subnetwork` is true.  Set to blank to have a range chosen with the default size.  Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask.  Set to a [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.",
              },
              services_ipv4_cidr_block: {
                type: "string",
                description:
                  "The IP address range of the services IPs in this cluster. If blank, a range will be automatically chosen with the default size.  This field is only applicable when `use_ip_aliases` is true.  Set to blank to have a range chosen with the default size.  Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask.  Set to a [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.",
              },
              tpu_ipv4_cidr_block: {
                type: "string",
                description:
                  "The IP address range of the Cloud TPUs in this cluster. If unspecified, a range will be automatically chosen with the default size.  This field is only applicable when `use_ip_aliases` is true.  If unspecified, the range will use the default size.  Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask.  Set to a [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.  This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.",
              },
              use_routes: {
                type: "boolean",
                description:
                  "Whether routes will be used for pod IPs in the cluster. This is used in conjunction with use_ip_aliases. It cannot be true if use_ip_aliases is true. If both use_ip_aliases and use_routes are false, then the server picks the default IP allocation mode",
              },
              stack_type: {
                type: "string",
                enum: ["STACK_TYPE_UNSPECIFIED", "IPV4", "IPV4_IPV6"],
                description: "Possible values for IP stack type",
              },
              ipv6_access_type: {
                type: "string",
                enum: ["IPV6_ACCESS_TYPE_UNSPECIFIED", "INTERNAL", "EXTERNAL"],
                description: "Possible values for IPv6 access type",
              },
              pod_cidr_overprovision_config: {
                type: "object",
                properties: {
                  disable: {
                    type: "boolean",
                    description:
                      "Whether Pod CIDR overprovisioning is disabled. Note: Pod CIDR overprovisioning is enabled by default.",
                  },
                },
                description:
                  "[PRIVATE FIELD] Config for pod CIDR size overprovisioning.",
                additionalProperties: true,
              },
              subnet_ipv6_cidr_block: {
                type: "string",
                description:
                  "Output only. The subnet's IPv6 CIDR block used by nodes and pods.",
              },
              services_ipv6_cidr_block: {
                type: "string",
                description:
                  "Output only. The services IPv6 CIDR block for the cluster.",
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
                  pod_range_info: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        range_name: {
                          type: "string",
                          description: "Output only. Name of a range.",
                        },
                        utilization: {
                          type: "number",
                          description:
                            "Output only. The utilization of the range.",
                        },
                      },
                      description:
                        "RangeInfo contains the range name and the range utilization by this cluster.",
                      additionalProperties: true,
                    },
                    description:
                      "Output only. Information for additional pod range.",
                  },
                },
                description:
                  "AdditionalPodRangesConfig is the configuration for additional pod secondary ranges supporting the ClusterUpdate message.",
                additionalProperties: true,
              },
              default_pod_ipv4_range_utilization: {
                type: "number",
                description:
                  "Output only. The utilization of the cluster default IPv4 range for the pod. The ratio is Usage/[Total number of IPs in the secondary range], Usage=numNodes*numZones*podIPsPerNode.",
              },
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
                      description: "Draining status of the additional subnet.",
                    },
                  },
                  description:
                    "AdditionalIPRangesConfig is the configuration for individual additional subnetwork attached to the cluster",
                  additionalProperties: true,
                },
                description:
                  "Output only. The additional IP ranges that are added to the cluster. These IP ranges can be used by new node pools to allocate node and pod IPs automatically. Each AdditionalIPRangesConfig corresponds to a single subnetwork. Once a range is removed it will not show up in IPAllocationPolicy.",
              },
              auto_ipam_config: {
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
              network_tier_config: {
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
            },
            description:
              "Configuration for controlling how IPs are allocated in the cluster.",
            additionalProperties: true,
          },
          master_authorized_networks_config: {
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
          maintenance_policy: {
            type: "object",
            properties: {
              window: {
                type: "object",
                properties: {
                  daily_maintenance_window: {
                    type: "object",
                    properties: {
                      start_time: {
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
                      "Time window specified for daily maintenance operations. (Part of 'policy' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  recurring_window: {
                    type: "object",
                    properties: {
                      window: {
                        type: "object",
                        properties: {
                          maintenance_exclusion_options: {
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
                              end_time_behavior: {
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
                          start_time: {
                            type: "string",
                            description:
                              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                          },
                          end_time: {
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
                  maintenance_exclusions: {
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
              resource_version: {
                type: "string",
                description:
                  "A hash identifying the version of this policy, so that updates to fields of the policy won't accidentally undo intermediate changes (and so that users of the API unaware of some fields won't accidentally remove other fields). Make a `get()` request to the cluster to get the current resource version and include it with requests to set the policy.",
              },
            },
            description:
              "MaintenancePolicy defines the maintenance policy to be used for the cluster.",
            additionalProperties: true,
          },
          binary_authorization: {
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
          autoscaling: {
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
                        properties: {
                          auto_upgrade_start_time: {
                            type: "string",
                            description:
                              "Output only. This field is set when upgrades are about to commence with the approximate start time for the upgrades, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
                          },
                          description: {
                            type: "string",
                            description:
                              "Output only. This field is set when upgrades are about to commence with the description of the upgrade.",
                          },
                        },
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
          network_config: {
            type: "object",
            properties: {
              network: {
                type: "string",
                description:
                  "Output only. The relative name of the Google Compute Engine [network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks) to which the cluster is connected. Example: projects/my-project/global/networks/my-network",
              },
              subnetwork: {
                type: "string",
                description:
                  "Output only. The relative name of the Google Compute Engine [subnetwork](https://cloud.google.com/compute/docs/vpc) to which the cluster is connected. Example: projects/my-project/regions/us-central1/subnetworks/my-subnet",
              },
              enable_intra_node_visibility: {
                type: "boolean",
                description:
                  "Whether Intra-node visibility is enabled for this cluster. This makes same node pod to pod traffic visible for VPC network.",
              },
              default_snat_status: {
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
              enable_l4ilb_subsetting: {
                type: "boolean",
                description:
                  "Whether L4ILB Subsetting is enabled for this cluster.",
              },
              datapath_provider: {
                type: "string",
                enum: [
                  "DATAPATH_PROVIDER_UNSPECIFIED",
                  "LEGACY_DATAPATH",
                  "ADVANCED_DATAPATH",
                ],
                description:
                  "The datapath provider selects the implementation of the Kubernetes networking model for service resolution and network policy enforcement.",
              },
              private_ipv6_google_access: {
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
              dns_config: {
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
              service_external_ips_config: {
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
              gateway_api_config: {
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
              enable_multi_networking: {
                type: "boolean",
                description:
                  "Whether multi-networking is enabled for this cluster.",
              },
              network_performance_config: {
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
              enable_fqdn_network_policy: {
                type: "boolean",
                description:
                  "Whether FQDN Network Policy is enabled on this cluster.",
              },
              in_transit_encryption_config: {
                type: "string",
                enum: [
                  "IN_TRANSIT_ENCRYPTION_CONFIG_UNSPECIFIED",
                  "IN_TRANSIT_ENCRYPTION_DISABLED",
                  "IN_TRANSIT_ENCRYPTION_INTER_NODE_TRANSPARENT",
                ],
                description: "Options for in-transit encryption.",
              },
              enable_cilium_clusterwide_network_policy: {
                type: "boolean",
                description:
                  "Whether CiliumClusterwideNetworkPolicy is enabled on this cluster.",
              },
              default_enable_private_nodes: {
                type: "boolean",
                description:
                  "Controls whether by default nodes have private IP addresses only. It is invalid to specify both [PrivateClusterConfig.enablePrivateNodes][] and this field at the same time. To update the default setting, use [ClusterUpdate.desired_default_enable_private_nodes][google.container.v1.ClusterUpdate.desired_default_enable_private_nodes]",
              },
              disable_l4_lb_firewall_reconciliation: {
                type: "boolean",
                description:
                  "Disable L4 load balancer VPC firewalls to enable firewall policies.",
              },
            },
            description:
              "NetworkConfig reports the relative names of network & subnetwork.",
            additionalProperties: true,
          },
          default_max_pods_constraint: {
            type: "object",
            properties: {
              max_pods_per_node: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            description: "Constraints applied to pods.",
            additionalProperties: true,
          },
          resource_usage_export_config: {
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
                description: "Parameters for controlling consumption metering.",
                additionalProperties: true,
              },
            },
            description: "Configuration for exporting cluster resource usages.",
            additionalProperties: true,
          },
          authenticator_groups_config: {
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
          private_cluster_config: {
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
              private_endpoint: {
                type: "string",
                description:
                  "Output only. The internal IP address of this cluster's master endpoint.  Deprecated: Use [ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint][google.container.v1.ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint] instead.",
              },
              public_endpoint: {
                type: "string",
                description:
                  "Output only. The external IP address of this cluster's master endpoint.  Deprecated:Use [ControlPlaneEndpointsConfig.IPEndpointsConfig.public_endpoint][google.container.v1.ControlPlaneEndpointsConfig.IPEndpointsConfig.public_endpoint] instead.",
              },
              peering_name: {
                type: "string",
                description:
                  "Output only. The peering name in the customer VPC used by this cluster.",
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
          database_encryption: {
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
              current_state: {
                type: "string",
                enum: [
                  "CURRENT_STATE_UNSPECIFIED",
                  "CURRENT_STATE_ENCRYPTED",
                  "CURRENT_STATE_DECRYPTED",
                  "CURRENT_STATE_ENCRYPTION_PENDING",
                  "CURRENT_STATE_ENCRYPTION_ERROR",
                  "CURRENT_STATE_DECRYPTION_PENDING",
                  "CURRENT_STATE_DECRYPTION_ERROR",
                ],
                description:
                  "Output only. The current state of etcd encryption.",
              },
              decryption_keys: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Output only. Keys in use by the cluster for decrypting existing objects, in addition to the key in `key_name`.  Each item is a CloudKMS key resource.",
              },
              last_operation_errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key_name: {
                      type: "string",
                      description: "CloudKMS key resource that had the error.",
                    },
                    error_message: {
                      type: "string",
                      description:
                        "Description of the error seen during the operation.",
                    },
                    timestamp: {
                      type: "string",
                      description:
                        "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                    },
                  },
                  description:
                    "OperationError records errors seen from CloudKMS keys encountered during updates to DatabaseEncryption configuration.",
                  additionalProperties: true,
                },
                description:
                  "Output only. Records errors seen during DatabaseEncryption update operations.",
              },
            },
            description: "Configuration of etcd encryption.",
            additionalProperties: true,
          },
          vertical_pod_autoscaling: {
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
          shielded_nodes: {
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
          release_channel: {
            type: "object",
            properties: {
              channel: {
                type: "string",
                enum: ["UNSPECIFIED", "RAPID", "REGULAR", "STABLE", "EXTENDED"],
                description:
                  "channel specifies which release channel the cluster is subscribed to.",
              },
            },
            description:
              "ReleaseChannel indicates which release channel a cluster is subscribed to. Release channels are arranged in order of risk.  When a cluster is subscribed to a release channel, Google maintains both the master version and the node version. Node auto-upgrade defaults to true and cannot be disabled.",
            additionalProperties: true,
          },
          workload_identity_config: {
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
          mesh_certificates: {
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
          cost_management_config: {
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
          notification_config: {
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
          confidential_nodes: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Whether Confidential Nodes feature is enabled.",
              },
              confidential_instance_type: {
                type: "string",
                enum: [
                  "CONFIDENTIAL_INSTANCE_TYPE_UNSPECIFIED",
                  "SEV",
                  "SEV_SNP",
                  "TDX",
                ],
                description:
                  "Defines the type of technology used by the confidential node.",
              },
            },
            description:
              "ConfidentialNodes is configuration for the confidential nodes feature, which makes nodes run on confidential VMs.",
            additionalProperties: true,
          },
          identity_service_config: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Whether to enable the Identity Service component",
              },
            },
            description:
              "IdentityServiceConfig is configuration for Identity Service which allows customers to use external identity providers with the K8S API",
            additionalProperties: true,
          },
          self_link: {
            type: "string",
            description: "Output only. Server-defined URL for the resource.",
          },
          zone: {
            type: "string",
            description:
              "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field is deprecated, use location instead.",
          },
          endpoint: {
            type: "string",
            description:
              "Output only. The IP address of this cluster's master endpoint. The endpoint can be accessed from the internet at `https://username:password@endpoint/`.  See the `masterAuth` property of this resource for username and password information.",
          },
          initial_cluster_version: {
            type: "string",
            description:
              'The initial Kubernetes version for this cluster.  Valid versions are those found in validMasterVersions returned by getServerConfig.  The version can be upgraded over time; such upgrades are reflected in currentMasterVersion and currentNodeVersion.  Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior:  - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "","-": picks the default Kubernetes version',
          },
          current_master_version: {
            type: "string",
            description:
              "Output only. The current software version of the master endpoint.",
          },
          current_node_version: {
            type: "string",
            description:
              "Output only. Deprecated, use [NodePools.version](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools) instead. The current version of the node software components. If they are currently at multiple versions because they're in the process of being upgraded, this reflects the minimum version of all nodes.",
          },
          create_time: {
            type: "string",
            description:
              "Output only. The time the cluster was created, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
          },
          status: {
            type: "string",
            enum: [
              "STATUS_UNSPECIFIED",
              "PROVISIONING",
              "RUNNING",
              "RECONCILING",
              "STOPPING",
              "ERROR",
              "DEGRADED",
            ],
            description: "Output only. The current status of this cluster.",
          },
          status_message: {
            type: "string",
            description:
              "Output only. Deprecated. Use conditions instead. Additional information about the current status of this cluster, if available.",
          },
          node_ipv4_cidr_size: {
            type: "integer",
            description:
              "Output only. The size of the address space on each node for hosting containers. This is provisioned from within the `container_ipv4_cidr` range. This field will only be set when cluster is in route-based network mode.",
          },
          services_ipv4_cidr: {
            type: "string",
            description:
              "Output only. The IP address range of the Kubernetes services in this cluster, in [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `1.2.3.4/29`). Service addresses are typically put in the last `/16` from the container CIDR.",
          },
          instance_group_urls: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. Deprecated. Use node_pools.instance_group_urls.",
          },
          current_node_count: {
            type: "integer",
            description:
              "Output only. The number of nodes currently in the cluster. Deprecated. Call Kubernetes API directly to retrieve node information.",
          },
          expire_time: {
            type: "string",
            description:
              "Output only. The time the cluster will be automatically deleted in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
          },
          location: {
            type: "string",
            description:
              "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) or [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) in which the cluster resides.",
          },
          enable_tpu: {
            type: "boolean",
            description:
              "Enable the ability to use Cloud TPUs in this cluster. This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.",
          },
          tpu_ipv4_cidr_block: {
            type: "string",
            description:
              "Output only. The IP address range of the Cloud TPUs in this cluster, in [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `1.2.3.4/29`). This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.",
          },
          conditions: {
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
            description: "Which conditions caused the current cluster state.",
          },
          autopilot: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable Autopilot",
              },
              workload_policy_config: {
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
              privileged_admission_config: {
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
            },
            description:
              "Autopilot is the configuration for Autopilot settings on the cluster.",
            additionalProperties: true,
          },
          id: {
            type: "string",
            description: "Output only. Unique id for the cluster.",
          },
          node_pool_defaults: {
            type: "object",
            properties: {
              node_config_defaults: {
                type: "object",
                properties: {
                  gcfs_config: {
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
                  logging_config: {
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
                  containerd_config: {
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
                  node_kubelet_config: {
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
                        description:
                          "Enable or disable Kubelet read only port.",
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
                },
                description: "Subset of NodeConfig message that has defaults.",
                additionalProperties: true,
              },
            },
            description: "Subset of Nodepool message that has defaults.",
            additionalProperties: true,
          },
          logging_config: {
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
          monitoring_config: {
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
                        description: "Scope for GKE Workload Auto-Monitoring.",
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
          node_pool_auto_config: {
            type: "object",
            properties: {
              network_tags: {
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
              resource_manager_tags: {
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
              node_kubelet_config: {
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
              linux_node_config: {
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
            },
            description:
              "Node pool configs that apply to all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters.",
            additionalProperties: true,
          },
          pod_autoscaling: {
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
          etag: {
            type: "string",
            description:
              "This checksum is computed by the server based on the value of cluster fields, and may be sent on update requests to ensure the client has an up-to-date value before proceeding.",
          },
          fleet: {
            type: "object",
            properties: {
              project: {
                type: "string",
                description:
                  "The Fleet host project(project ID or project number) where this cluster will be registered to. This field cannot be changed after the cluster has been registered.",
              },
              membership: {
                type: "string",
                description:
                  "Output only. The full resource name of the registered fleet membership of the cluster, in the format `//gkehub.googleapis.com/projects/*/locations/*/memberships/*`.",
              },
              pre_registered: {
                type: "boolean",
                description:
                  "Output only. Whether the cluster has been registered through the fleet API.",
              },
              membership_type: {
                type: "string",
                enum: ["MEMBERSHIP_TYPE_UNSPECIFIED", "LIGHTWEIGHT"],
                description: "The type of the cluster's fleet membership.",
              },
            },
            description: "Fleet is the fleet configuration for the cluster.",
            additionalProperties: true,
          },
          security_posture_config: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["MODE_UNSPECIFIED", "DISABLED", "BASIC", "ENTERPRISE"],
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
          control_plane_endpoints_config: {
            type: "object",
            properties: {
              dns_endpoint_config: {
                type: "object",
                properties: {
                  endpoint: {
                    type: "string",
                    description:
                      "Output only. The cluster's DNS endpoint configuration. A DNS format address. This is accessible from the public internet. Ex: uid.us-central1.gke.goog. Always present, but the behavior may change according to the value of [DNSEndpointConfig.allow_external_traffic][google.container.v1.ControlPlaneEndpointsConfig.DNSEndpointConfig.allow_external_traffic].",
                  },
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
                description: "Describes the configuration of a DNS endpoint.",
                additionalProperties: true,
              },
              ip_endpoints_config: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Controls whether to allow direct IP access.",
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
                  public_endpoint: {
                    type: "string",
                    description:
                      "Output only. The external IP address of this cluster's control plane. Only populated if enabled.",
                  },
                  private_endpoint: {
                    type: "string",
                    description:
                      "Output only. The internal IP address of this cluster's control plane. Only populated if enabled.",
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
          enterprise_config: {
            type: "object",
            properties: {
              cluster_tier: {
                type: "string",
                enum: ["CLUSTER_TIER_UNSPECIFIED", "STANDARD", "ENTERPRISE"],
                description:
                  "Output only. cluster_tier indicates the effective tier of the cluster.",
              },
              desired_tier: {
                type: "string",
                enum: ["CLUSTER_TIER_UNSPECIFIED", "STANDARD", "ENTERPRISE"],
                description:
                  "desired_tier specifies the desired tier of the cluster.",
              },
            },
            description:
              "EnterpriseConfig is the cluster enterprise configuration.  Deprecated: GKE Enterprise features are now available without an Enterprise tier.",
            additionalProperties: true,
          },
          secret_manager_config: {
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
          compliance_posture_config: {
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
                  description: "Defines the details of a compliance standard.",
                  additionalProperties: true,
                },
                description: "List of enabled compliance standards.",
              },
            },
            description:
              "CompliancePostureConfig defines the settings needed to enable/disable features for the Compliance Posture.",
            additionalProperties: true,
          },
          satisfies_pzs: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
          },
          satisfies_pzi: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
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
              control_plane_disk_encryption_key_versions: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Output only. All of the versions of the Cloud KMS cryptoKey that are used by Confidential Hyperdisks on the control plane nodes.",
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
          rbac_binding_config: {
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
          anonymous_authentication_config: {
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
          managed_opentelemetry_config: {
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
        description: "A Google Kubernetes Engine cluster.",
        additionalProperties: true,
      },
    },
  },
};

export default getCluster;
