import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const getNodePool: AppBlock = {
  name: "Get Node Pool",
  description: `Retrieves the requested node pool.`,
  category: "Node Pools",
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
            "Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the cluster. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        node_pool_id: {
          name: "Node Pool Id",
          description:
            "Deprecated. The name of the node pool. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the node pool. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster, node pool id) of the node pool to get. Specified in the format `projects/*/locations/*/clusters/*/nodePools/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster, node pool id) of the node pool to get. Specified in the format `projects/*/locations/*/clusters/*/nodePools/*`.",
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
        if (input.event.inputConfig.node_pool_id !== undefined)
          request.node_pool_id = input.event.inputConfig.node_pool_id;
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getNodePool(request, (err: any, response: any) => {
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
                description: "Configuration of all network bandwidth tiers",
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
            description: "Output only. Server-defined URL for the resource.",
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
                description: "Can this node pool be deleted automatically.",
              },
              location_policy: {
                type: "string",
                enum: ["LOCATION_POLICY_UNSPECIFIED", "BALANCED", "ANY"],
                description: "Location policy used when scaling up a nodepool.",
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
            description: "Which conditions caused the current node pool state.",
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
                        description: "Duration string (e.g., '1.5s', '300s')",
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
                        description: "Duration string (e.g., '1.5s', '300s')",
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
                description: "Information relevant to blue-green upgrade.",
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
    },
  },
};

export default getNodePool;
