import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const nodePoolsUpdate: AppBlock = {
  name: "Node Pools - Update",
  description: `Updates the version and/or image type for the specified node pool.`,
  category: "Node Pools",
  inputs: {
    default: {
      config: {
        etag: {
          name: "Etag",
          description: "The current etag of the node pool.",
          type: {
            type: "string",
            description:
              "The current etag of the node pool. If an etag is provided and does not match the current etag of the node pool, update will be blocked and an ABORTED error will be returned.",
          },
          required: false,
        },
        kubeletConfig: {
          name: "Kubelet Config",
          description: "Node kubelet configs.",
          type: {
            type: "object",
            properties: {
              imageGcLowThresholdPercent: {
                type: "integer",
                description:
                  "Optional. Defines the percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. The percent is calculated as this field value out of 100. The value must be between 10 and 85, inclusive and smaller than image_gc_high_threshold_percent. The default value is 80 if unspecified. (Format: int32)",
              },
              containerLogMaxSize: {
                type: "string",
                description:
                  "Optional. Defines the maximum size of the container log file before it is rotated. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation Valid format is positive number + unit, e.g. 100Ki, 10Mi. Valid units are Ki, Mi, Gi. The value must be between 10Mi and 500Mi, inclusive. Note that the total container log size (container_log_max_size * container_log_max_files) cannot exceed 1% of the total storage of the node, to avoid disk pressure caused by log files. The default value is 10Mi if unspecified.",
              },
              cpuCfsQuotaPeriod: {
                type: "string",
                description:
                  'Set the CPU CFS quota period value \'cpu.cfs_period_us\'. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration between 1ms and 1 second, inclusive.',
              },
              containerLogMaxFiles: {
                type: "integer",
                description:
                  "Optional. Defines the maximum number of container log files that can be present for a container. See https://kubernetes.io/docs/concepts/cluster-administration/logging/#log-rotation The value must be an integer between 2 and 10, inclusive. The default value is 5 if unspecified. (Format: int32)",
              },
              insecureKubeletReadonlyPortEnabled: {
                type: "boolean",
                description: "Enable or disable Kubelet read only port.",
              },
              topologyManager: {
                type: "object",
                properties: {
                  policy: {
                    type: "string",
                    description:
                      "Configures the strategy for resource alignment. Allowed values are: * none: the default policy, and does not perform any topology alignment. * restricted: the topology manager stores the preferred NUMA node affinity for the container, and will reject the pod if the affinity if not preferred. * best-effort: the topology manager stores the preferred NUMA node affinity for the container. If the affinity is not preferred, the topology manager will admit the pod to the node anyway. * single-numa-node: the topology manager determines if the single NUMA node affinity is possible. If it is, Topology Manager will store this and the Hint Providers can then use this information when making the resource allocation decision. If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a Terminated state with a pod admission failure. The default policy value is 'none' if unspecified. Details about each strategy can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-policies).",
                  },
                  scope: {
                    type: "string",
                    description:
                      "The Topology Manager aligns resources in following scopes: * container * pod The default scope is 'container' if unspecified. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#topology-manager-scopes",
                  },
                },
                description:
                  "TopologyManager defines the configuration options for Topology Manager feature. See https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/",
                additionalProperties: true,
              },
              evictionMaxPodGracePeriodSeconds: {
                type: "integer",
                description:
                  "Optional. eviction_max_pod_grace_period_seconds is the maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met. This value effectively caps the Pod's terminationGracePeriodSeconds value during soft evictions. Default: 0. Range: [0, 300]. (Format: int32)",
              },
              maxParallelImagePulls: {
                type: "integer",
                description:
                  "Optional. Defines the maximum number of image pulls in parallel. The range is 2 to 5, inclusive. The default value is 2 or 3 depending on the disk type. See https://kubernetes.io/docs/concepts/containers/images/#maximum-parallel-image-pulls for more details. (Format: int32)",
              },
              evictionMinimumReclaim: {
                type: "object",
                properties: {
                  nodefsAvailable: {
                    type: "string",
                    description:
                      'Optional. Minimum reclaim for eviction due to nodefs available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  imagefsAvailable: {
                    type: "string",
                    description:
                      'Optional. Minimum reclaim for eviction due to imagefs available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  pidAvailable: {
                    type: "string",
                    description:
                      'Optional. Minimum reclaim for eviction due to pid available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  nodefsInodesFree: {
                    type: "string",
                    description:
                      'Optional. Minimum reclaim for eviction due to nodefs inodes free signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  imagefsInodesFree: {
                    type: "string",
                    description:
                      'Optional. Minimum reclaim for eviction due to imagefs inodes free signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  memoryAvailable: {
                    type: "string",
                    description:
                      'Optional. Minimum reclaim for eviction due to memory available signal. Only take percentage value for now. Sample format: "10%". Must be <=10%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                },
                description:
                  "Eviction minimum reclaims are the resource amounts of minimum reclaims for each eviction signal.",
                additionalProperties: true,
              },
              allowedUnsafeSysctls: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Optional. Defines a comma-separated allowlist of unsafe sysctls or sysctl patterns (ending in `*`). The unsafe namespaced sysctl groups are `kernel.shm*`, `kernel.msg*`, `kernel.sem`, `fs.mqueue.*`, and `net.*`. Leaving this allowlist empty means they cannot be set on Pods. To allow certain sysctls or sysctl patterns to be set on Pods, list them separated by commas. For example: `kernel.msg*,net.ipv4.route.min_pmtu`. See https://kubernetes.io/docs/tasks/administer-cluster/sysctl-cluster/ for more details.",
              },
              evictionSoftGracePeriod: {
                type: "object",
                properties: {
                  imagefsAvailable: {
                    type: "string",
                    description:
                      'Optional. Grace period for eviction due to imagefs available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  pidAvailable: {
                    type: "string",
                    description:
                      'Optional. Grace period for eviction due to pid available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  memoryAvailable: {
                    type: "string",
                    description:
                      'Optional. Grace period for eviction due to memory available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  nodefsAvailable: {
                    type: "string",
                    description:
                      'Optional. Grace period for eviction due to nodefs available signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  imagefsInodesFree: {
                    type: "string",
                    description:
                      'Optional. Grace period for eviction due to imagefs inodes free signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  nodefsInodesFree: {
                    type: "string",
                    description:
                      'Optional. Grace period for eviction due to nodefs inodes free signal. Sample format: "10s". Must be >= 0. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                },
                description:
                  "Eviction grace periods are grace periods for each eviction signal.",
                additionalProperties: true,
              },
              podPidsLimit: {
                type: "string",
                description:
                  "Set the Pod PID limits. See https://kubernetes.io/docs/concepts/policy/pid-limiting/#pod-pid-limits Controls the maximum number of processes allowed to run in a pod. The value must be greater than or equal to 1024 and less than 4194304. (Format: int64)",
              },
              imageMaximumGcAge: {
                type: "string",
                description:
                  'Optional. Defines the maximum age an image can be unused before it is garbage collected. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration greater than image_minimum_gc_age or "0s". The default value is "0s" if unspecified, which disables this field, meaning images won\'t be garbage collected based on being unused for too long.',
              },
              imageGcHighThresholdPercent: {
                type: "integer",
                description:
                  "Optional. Defines the percent of disk usage after which image garbage collection is always run. The percent is calculated as this field value out of 100. The value must be between 10 and 85, inclusive and greater than image_gc_low_threshold_percent. The default value is 85 if unspecified. (Format: int32)",
              },
              cpuCfsQuota: {
                type: "boolean",
                description:
                  "Enable CPU CFS quota enforcement for containers that specify CPU limits. This option is enabled by default which makes kubelet use CFS quota (https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.txt) to enforce container CPU limits. Otherwise, CPU limits will not be enforced at all. Disable this option to mitigate CPU throttling problems while still having your pods to be in Guaranteed QoS class by specifying the CPU limits. The default value is 'true' if unspecified.",
              },
              evictionSoft: {
                type: "object",
                properties: {
                  imagefsAvailable: {
                    type: "string",
                    description:
                      'Optional. Amount of storage available on filesystem that container runtime uses for storing images layers. If the container filesystem and image filesystem are not separate, then imagefs can store both image layers and writeable layers. Defines the amount of "imagefs.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 15% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  nodefsAvailable: {
                    type: "string",
                    description:
                      'Optional. Amount of storage available on filesystem that kubelet uses for volumes, daemon logs, etc. Defines the amount of "nodefs.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 10% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  nodefsInodesFree: {
                    type: "string",
                    description:
                      'Optional. Amount of inodes available on filesystem that kubelet uses for volumes, daemon logs, etc. Defines the amount of "nodefs.inodesFree" signal in kubelet. Default is unset, if not specified in the kubelet config. Linux only. It takses percentage value for now. Sample format: "30%". Must be >= 5% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  pidAvailable: {
                    type: "string",
                    description:
                      'Optional. Amount of PID available for pod allocation. Defines the amount of "pid.available" signal in kubelet. Default is unset, if not specified in the kubelet config. It takses percentage value for now. Sample format: "30%". Must be >= 10% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  memoryAvailable: {
                    type: "string",
                    description:
                      'Optional. Memory available (i.e. capacity - workingSet), in bytes. Defines the amount of "memory.available" signal in kubelet. Default is unset, if not specified in the kubelet config. Format: positive number + unit, e.g. 100Ki, 10Mi, 5Gi. Valid units are Ki, Mi, Gi. Must be >= 100Mi and <= 50% of the node\'s memory. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                  imagefsInodesFree: {
                    type: "string",
                    description:
                      'Optional. Amount of inodes available on filesystem that container runtime uses for storing images layers. Defines the amount of "imagefs.inodesFree" signal in kubelet. Default is unset, if not specified in the kubelet config. Linux only. It takses percentage value for now. Sample format: "30%". Must be >= 5% and <= 50%. See https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals',
                  },
                },
                description:
                  "Eviction signals are the current state of a particular resource at a specific point in time. The kubelet uses eviction signals to make eviction decisions by comparing the signals to eviction thresholds, which are the minimum amount of the resource that should be available on the node.",
                additionalProperties: true,
              },
              singleProcessOomKill: {
                type: "boolean",
                description:
                  "Optional. Defines whether to enable single process OOM killer. If true, will prevent the memory.oom.group flag from being set for container cgroups in cgroups v2. This causes processes in the container to be OOM killed individually instead of as a group.",
              },
              imageMinimumGcAge: {
                type: "string",
                description:
                  'Optional. Defines the minimum age for an unused image before it is garbage collected. The string must be a sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300s", "1.5h", and "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". The value must be a positive duration less than or equal to 2 minutes. The default value is "2m0s" if unspecified.',
              },
              cpuManagerPolicy: {
                type: "string",
                description:
                  'Control the CPU management policy on the node. See https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/ The following values are allowed. * "none": the default, which represents the existing scheduling behavior. * "static": allows pods with certain resource characteristics to be granted increased CPU affinity and exclusivity on the node. The default value is \'none\' if unspecified.',
              },
              memoryManager: {
                type: "object",
                properties: {
                  policy: {
                    type: "string",
                    description:
                      'Controls the memory management policy on the Node. See https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#policies The following values are allowed. * "none" * "static" The default value is \'none\' if unspecified.',
                  },
                },
                description:
                  "The option enables the Kubernetes NUMA-aware Memory Manager feature. Detailed description about the feature can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/).",
                additionalProperties: true,
              },
            },
            description: "Node kubelet configs.",
            additionalProperties: true,
          },
          required: false,
        },
        resourceManagerTags: {
          name: "Resource Manager Tags",
          description:
            "Desired resource manager tag keys and values to be attached to the nodes for managing Compute Engine firewalls using Network Firewall Policies.",
          type: {
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
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "The desired node labels to be applied to all nodes in the node pool.",
          type: {
            type: "object",
            properties: {
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description: "Map of node label keys and node label values.",
              },
            },
            description:
              "Collection of node-level [Kubernetes labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels).",
            additionalProperties: true,
          },
          required: false,
        },
        linuxNodeConfig: {
          name: "Linux Node Config",
          description: "Parameters that can be configured on Linux nodes.",
          type: {
            type: "object",
            properties: {
              transparentHugepageDefrag: {
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
                  "Optional. Defines the transparent hugepage defrag configuration on the node. VM hugepage allocation can be managed by either limiting defragmentation for delayed allocation or skipping it entirely for immediate allocation only. See https://docs.kernel.org/admin-guide/mm/transhuge.html for more details.",
              },
              hugepages: {
                type: "object",
                properties: {
                  hugepageSize2m: {
                    type: "integer",
                    description:
                      "Optional. Amount of 2M hugepages (Format: int32)",
                  },
                  hugepageSize1g: {
                    type: "integer",
                    description:
                      "Optional. Amount of 1G hugepages (Format: int32)",
                  },
                },
                description: "Hugepages amount in both 2m and 1g size",
                additionalProperties: true,
              },
              cgroupMode: {
                type: "string",
                enum: [
                  "CGROUP_MODE_UNSPECIFIED",
                  "CGROUP_MODE_V1",
                  "CGROUP_MODE_V2",
                ],
                description:
                  "cgroup_mode specifies the cgroup mode to be used on the node.",
              },
              nodeKernelModuleLoading: {
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
              sysctls: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "The Linux kernel parameters to be applied to the nodes and all pods running on the nodes. The following parameters are supported. net.core.busy_poll net.core.busy_read net.core.netdev_max_backlog net.core.rmem_max net.core.rmem_default net.core.wmem_default net.core.wmem_max net.core.optmem_max net.core.somaxconn net.ipv4.tcp_rmem net.ipv4.tcp_wmem net.ipv4.tcp_tw_reuse net.ipv4.tcp_mtu_probing net.ipv4.tcp_max_orphans net.ipv4.tcp_max_tw_buckets net.ipv4.tcp_syn_retries net.ipv4.tcp_ecn net.ipv4.tcp_congestion_control net.netfilter.nf_conntrack_max net.netfilter.nf_conntrack_buckets net.netfilter.nf_conntrack_tcp_timeout_close_wait net.netfilter.nf_conntrack_tcp_timeout_time_wait net.netfilter.nf_conntrack_tcp_timeout_established net.netfilter.nf_conntrack_acct kernel.shmmni kernel.shmmax kernel.shmall kernel.perf_event_paranoid kernel.sched_rt_runtime_us kernel.softlockup_panic kernel.yama.ptrace_scope kernel.kptr_restrict kernel.dmesg_restrict kernel.sysrq fs.aio-max-nr fs.file-max fs.inotify.max_user_instances fs.inotify.max_user_watches fs.nr_open vm.dirty_background_ratio vm.dirty_background_bytes vm.dirty_expire_centisecs vm.dirty_ratio vm.dirty_bytes vm.dirty_writeback_centisecs vm.max_map_count vm.overcommit_memory vm.overcommit_ratio vm.vfs_cache_pressure vm.swappiness vm.watermark_scale_factor vm.min_free_kbytes",
              },
              transparentHugepageEnabled: {
                type: "string",
                enum: [
                  "TRANSPARENT_HUGEPAGE_ENABLED_UNSPECIFIED",
                  "TRANSPARENT_HUGEPAGE_ENABLED_ALWAYS",
                  "TRANSPARENT_HUGEPAGE_ENABLED_MADVISE",
                  "TRANSPARENT_HUGEPAGE_ENABLED_NEVER",
                ],
                description:
                  "Optional. Transparent hugepage support for anonymous memory can be entirely disabled (mostly for debugging purposes) or only enabled inside MADV_HUGEPAGE regions (to avoid the risk of consuming more memory resources) or enabled system wide. See https://docs.kernel.org/admin-guide/mm/transhuge.html for more details.",
              },
            },
            description: "Parameters that can be configured on Linux nodes.",
            additionalProperties: true,
          },
          required: false,
        },
        maxRunDuration: {
          name: "Max Run Duration",
          description: "The maximum duration for the nodes to exist.",
          type: {
            type: "string",
            description:
              "The maximum duration for the nodes to exist. If unspecified, the nodes can exist indefinitely. (Format: google-duration)",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster, node pool) of the node pool to update.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster, node pool) of the node pool to update. Specified in the format `projects/*/locations/*/clusters/*/nodePools/*`.",
          },
          required: false,
        },
        diskSizeGb: {
          name: "Disk Size Gb",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The desired disk size for nodes in the node pool specified in GB. The smallest allowed disk size is 10GB. Initiates an upgrade operation that migrates the nodes in the node pool to the specified disk size. (Format: int64)",
          },
          required: false,
        },
        queuedProvisioning: {
          name: "Queued Provisioning",
          description: "Specifies the configuration of queued provisioning.",
          type: {
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
          required: false,
        },
        fastSocket: {
          name: "Fast Socket",
          description: "Enable or disable NCCL fast socket for the node pool.",
          type: {
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
          required: false,
        },
        accelerators: {
          name: "Accelerators",
          description:
            "A list of hardware accelerators to be attached to each node.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                acceleratorType: {
                  type: "string",
                  description:
                    "The accelerator type resource name. List of supported accelerators [here](https://cloud.google.com/compute/docs/gpus)",
                },
                gpuSharingConfig: {
                  type: "object",
                  properties: {
                    gpuSharingStrategy: {
                      type: "string",
                      enum: [
                        "GPU_SHARING_STRATEGY_UNSPECIFIED",
                        "TIME_SHARING",
                        "MPS",
                      ],
                      description:
                        "The type of GPU sharing strategy to enable on the GPU node.",
                    },
                    maxSharedClientsPerGpu: {
                      type: "string",
                      description:
                        "The max number of containers that can share a physical GPU. (Format: int64)",
                    },
                  },
                  description:
                    "GPUSharingConfig represents the GPU sharing configuration for Hardware Accelerators.",
                  additionalProperties: true,
                },
                acceleratorCount: {
                  type: "string",
                  description:
                    "The number of the accelerator cards exposed to an instance. (Format: int64)",
                },
                gpuDriverInstallationConfig: {
                  type: "object",
                  properties: {
                    gpuDriverVersion: {
                      type: "string",
                      enum: [
                        "GPU_DRIVER_VERSION_UNSPECIFIED",
                        "INSTALLATION_DISABLED",
                        "DEFAULT",
                        "LATEST",
                      ],
                      description: "Mode for how the GPU driver is installed.",
                    },
                  },
                  description:
                    "GPUDriverInstallationConfig specifies the version of GPU driver to be auto installed.",
                  additionalProperties: true,
                },
                gpuPartitionSize: {
                  type: "string",
                  description:
                    "Size of partitions to create on the GPU. Valid values are described in the NVIDIA [mig user guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/#partitioning).",
                },
              },
              description:
                "AcceleratorConfig represents a Hardware Accelerator request.",
              additionalProperties: true,
            },
            description:
              "A list of hardware accelerators to be attached to each node. See https://cloud.google.com/compute/docs/gpus for more information about support for GPUs.",
          },
          required: false,
        },
        windowsNodeConfig: {
          name: "Windows Node Config",
          description: "Parameters that can be configured on Windows nodes.",
          type: {
            type: "object",
            properties: {
              osVersion: {
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
          required: false,
        },
        machineType: {
          name: "Machine Type",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The desired [Google Compute Engine machine type](https://cloud.google.com/compute/docs/machine-types) for nodes in the node pool. Initiates an upgrade operation that migrates the nodes in the node pool to the specified machine type.",
          },
          required: false,
        },
        upgradeSettings: {
          name: "Upgrade Settings",
          description:
            "Upgrade settings control disruption and speed of the upgrade.",
          type: {
            type: "object",
            properties: {
              maxSurge: {
                type: "integer",
                description:
                  "The maximum number of nodes that can be created beyond the current size of the node pool during the upgrade process. (Format: int32)",
              },
              strategy: {
                type: "string",
                enum: [
                  "NODE_POOL_UPDATE_STRATEGY_UNSPECIFIED",
                  "BLUE_GREEN",
                  "SURGE",
                ],
                description: "Update strategy of the node pool.",
              },
              blueGreenSettings: {
                type: "object",
                properties: {
                  nodePoolSoakDuration: {
                    type: "string",
                    description:
                      "Time needed after draining entire blue pool. After this period, blue pool will be cleaned up. (Format: google-duration)",
                  },
                  standardRolloutPolicy: {
                    type: "object",
                    properties: {
                      batchSoakDuration: {
                        type: "string",
                        description:
                          "Soak time after each batch gets drained. Default to zero. (Format: google-duration)",
                      },
                      batchPercentage: {
                        type: "number",
                        description:
                          "Percentage of the blue pool nodes to drain in a batch. The range of this field should be (0.0, 1.0]. (Format: float)",
                      },
                      batchNodeCount: {
                        type: "integer",
                        description:
                          "Number of blue nodes to drain in a batch. (Format: int32)",
                      },
                    },
                    description:
                      "Standard rollout policy is the default policy for blue-green.",
                    additionalProperties: true,
                  },
                  autoscaledRolloutPolicy: {
                    type: "object",
                    properties: {
                      waitForDrainDuration: {
                        type: "string",
                        description:
                          "Optional. Time to wait after cordoning the blue pool before draining the nodes. Defaults to 3 days. The value can be set between 0 and 7 days, inclusive. (Format: google-duration)",
                      },
                    },
                    description:
                      "Autoscaled rollout policy utilizes the cluster autoscaler during blue-green upgrade to scale both the blue and green pools.",
                    additionalProperties: true,
                  },
                },
                description: "Settings for blue-green upgrade.",
                additionalProperties: true,
              },
              maxUnavailable: {
                type: "integer",
                description:
                  "The maximum number of nodes that can be simultaneously unavailable during the upgrade process. A node is considered available if its status is Ready. (Format: int32)",
              },
            },
            description:
              "These upgrade settings control the level of parallelism and the level of disruption caused by an upgrade. maxUnavailable controls the number of nodes that can be simultaneously unavailable. maxSurge controls the number of additional nodes that can be added to the node pool temporarily for the time of the upgrade to increase the number of available nodes. (maxUnavailable + maxSurge) determines the level of parallelism (how many nodes are being upgraded at the same time). Note: upgrades inevitably introduce some disruption since workloads need to be moved from old nodes to new, upgraded ones. Even if maxUnavailable=0, this holds true. (Disruption stays within the limits of PodDisruptionBudget, if it is configured.) Consider a hypothetical node pool with 5 nodes having maxSurge=2, maxUnavailable=1. This means the upgrade process upgrades 3 nodes simultaneously. It creates 2 additional (upgraded) nodes, then it brings down 3 old (not yet upgraded) nodes at the same time. This ensures that there are always at least 4 nodes available. These upgrade settings configure the upgrade strategy for the node pool. Use strategy to switch between the strategies applied to the node pool. If the strategy is ROLLING, use max_surge and max_unavailable to control the level of parallelism and the level of disruption caused by upgrade. 1. maxSurge controls the number of additional nodes that can be added to the node pool temporarily for the time of the upgrade to increase the number of available nodes. 2. maxUnavailable controls the number of nodes that can be simultaneously unavailable. 3. (maxUnavailable + maxSurge) determines the level of parallelism (how many nodes are being upgraded at the same time). If the strategy is BLUE_GREEN, use blue_green_settings to configure the blue-green upgrade related settings. 1. standard_rollout_policy is the default policy. The policy is used to control the way blue pool gets drained. The draining is executed in the batch mode. The batch size could be specified as either percentage of the node pool size or the number of nodes. batch_soak_duration is the soak time after each batch gets drained. 2. node_pool_soak_duration is the soak time after all blue nodes are drained. After this period, the blue pool nodes will be deleted.",
            additionalProperties: true,
          },
          required: false,
        },
        containerdConfig: {
          name: "Containerd Config",
          description:
            "The desired containerd config for nodes in the node pool.",
          type: {
            type: "object",
            properties: {
              privateRegistryAccessConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Private registry access is enabled.",
                  },
                  certificateAuthorityDomainConfig: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        gcpSecretManagerCertificateConfig: {
                          type: "object",
                          properties: {
                            secretUri: {
                              type: "string",
                              description:
                                'Secret URI, in the form "projects/$PROJECT_ID/secrets/$SECRET_NAME/versions/$VERSION". Version can be fixed (e.g. "2") or "latest"',
                            },
                          },
                          description:
                            "GCPSecretManagerCertificateConfig configures a secret from [Secret Manager](https://cloud.google.com/secret-manager).",
                          additionalProperties: true,
                        },
                        fqdns: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "List of fully qualified domain names (FQDN). Specifying port is supported. Wildcards are NOT supported. Examples: - my.customdomain.com - 10.0.1.2:5000",
                        },
                      },
                      description:
                        "CertificateAuthorityDomainConfig configures one or more fully qualified domain names (FQDN) to a specific certificate.",
                      additionalProperties: true,
                    },
                    description: "Private registry access configuration.",
                  },
                },
                description:
                  "PrivateRegistryAccessConfig contains access configuration for private container registries.",
                additionalProperties: true,
              },
              writableCgroups: {
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
              registryHosts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    server: {
                      type: "string",
                      description:
                        "Defines the host name of the registry server, which will be used to create configuration file as /etc/containerd/hosts.d//hosts.toml. It supports fully qualified domain names (FQDN) and IP addresses: Specifying port is supported. Wildcards are NOT supported. Examples: - my.customdomain.com - 10.0.1.2:5000",
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
                          client: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "object",
                                  properties: {
                                    gcpSecretManagerSecretUri: {
                                      type: "string",
                                      description:
                                        'The URI configures a secret from [Secret Manager](https://cloud.google.com/secret-manager) in the format "projects/$PROJECT_ID/secrets/$SECRET_NAME/versions/$VERSION" for global secret or "projects/$PROJECT_ID/locations/$REGION/secrets/$SECRET_NAME/versions/$VERSION" for regional secret. Version can be fixed (e.g. "2") or "latest"',
                                    },
                                  },
                                  description:
                                    "CertificateConfig configures certificate for the registry.",
                                  additionalProperties: true,
                                },
                                cert: {
                                  type: "object",
                                  properties: {
                                    gcpSecretManagerSecretUri: {
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
                          ca: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                gcpSecretManagerSecretUri: {
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
                          header: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                  description: "Key configures the header key.",
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
                          overridePath: {
                            type: "boolean",
                            description:
                              "OverridePath is used to indicate the host's API root endpoint is defined in the URL path rather than by the API specification. This may be used with non-compliant OCI registries which are missing the /v2 prefix. If not set, containerd sets default false.",
                          },
                          dialTimeout: {
                            type: "string",
                            description:
                              "Specifies the maximum duration allowed for a connection attempt to complete. A shorter timeout helps reduce delays when falling back to the original registry if the mirror is unreachable. Maximum allowed value is 180s. If not set, containerd sets default 30s. The value should be a decimal number of seconds with an `s` suffix. (Format: google-duration)",
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
          required: false,
        },
        diskType: {
          name: "Disk Type",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The desired disk type (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced') for nodes in the node pool. Initiates an upgrade operation that migrates the nodes in the node pool to the specified disk type.",
          },
          required: false,
        },
        imageType: {
          name: "Image Type",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The desired image type for the node pool. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.",
          },
          required: false,
        },
        flexStart: {
          name: "Flex Start",
          description: "Flex Start flag for enabling Flex Start VM.",
          type: {
            type: "boolean",
            description: "Flex Start flag for enabling Flex Start VM.",
          },
          required: false,
        },
        bootDisk: {
          name: "Boot Disk",
          description:
            "The desired boot disk config for nodes in the node pool.",
          type: {
            type: "object",
            properties: {
              provisionedIops: {
                type: "string",
                description:
                  "For Hyperdisk-Balanced only, the provisioned IOPS config value. (Format: int64)",
              },
              diskType: {
                type: "string",
                description:
                  "Disk type of the boot disk. (i.e. Hyperdisk-Balanced, PD-Balanced, etc.)",
              },
              sizeGb: {
                type: "string",
                description:
                  "Disk size in GB. Replaces NodeConfig.disk_size_gb (Format: int64)",
              },
              provisionedThroughput: {
                type: "string",
                description:
                  "For Hyperdisk-Balanced only, the provisioned throughput config value. (Format: int64)",
              },
            },
            description:
              "BootDisk specifies the boot disk configuration for nodepools.",
            additionalProperties: true,
          },
          required: false,
        },
        taints: {
          name: "Taints",
          description:
            "The desired node taints to be applied to all nodes in the node pool.",
          type: {
            type: "object",
            properties: {
              taints: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    value: {
                      type: "string",
                      description: "Value for taint.",
                    },
                    key: {
                      type: "string",
                      description: "Key for taint.",
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
                    "Kubernetes taint is composed of three fields: key, value, and effect. Effect can only be one of three types: NoSchedule, PreferNoSchedule or NoExecute. See [here](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration) for more information, including usage and the valid values.",
                  additionalProperties: true,
                },
                description: "List of node taints.",
              },
            },
            description:
              "Collection of Kubernetes [node taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration).",
            additionalProperties: true,
          },
          required: false,
        },
        nodeNetworkConfig: {
          name: "Node Network Config",
          description: "Node network config.",
          type: {
            type: "object",
            properties: {
              additionalPodNetworkConfigs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    maxPodsPerNode: {
                      type: "object",
                      properties: {
                        maxPodsPerNode: {
                          type: "string",
                          description:
                            "Constraint enforced on the max num of pods per node. (Format: int64)",
                        },
                      },
                      description: "Constraints applied to pods.",
                      additionalProperties: true,
                    },
                    secondaryPodRange: {
                      type: "string",
                      description:
                        "The name of the secondary range on the subnet which provides IP address for this pod range.",
                    },
                    networkAttachment: {
                      type: "string",
                      description:
                        "The name of the network attachment for pods to communicate to; cannot be specified along with subnetwork or secondary_pod_range.",
                    },
                    subnetwork: {
                      type: "string",
                      description:
                        "Name of the subnetwork where the additional pod network belongs.",
                    },
                  },
                  description:
                    "AdditionalPodNetworkConfig is the configuration for additional pod networks within the NodeNetworkConfig message",
                  additionalProperties: true,
                },
                description:
                  "We specify the additional pod networks for this node pool using this list. Each pod network corresponds to an additional alias IP range for the node",
              },
              createPodRange: {
                type: "boolean",
                description:
                  "Input only. Whether to create a new range for pod IPs in this node pool. Defaults are provided for `pod_range` and `pod_ipv4_cidr_block` if they are not specified. If neither `create_pod_range` or `pod_range` are specified, the cluster-level default (`ip_allocation_policy.cluster_ipv4_cidr_block`) is used. Only applicable if `ip_allocation_policy.use_ip_aliases` is true. This field cannot be changed after the node pool has been created.",
              },
              podCidrOverprovisionConfig: {
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
              podRange: {
                type: "string",
                description:
                  "The ID of the secondary range for pod IPs. If `create_pod_range` is true, this ID is used for the new range. If `create_pod_range` is false, uses an existing secondary range with this ID. Only applicable if `ip_allocation_policy.use_ip_aliases` is true. This field cannot be changed after the node pool has been created.",
              },
              networkPerformanceConfig: {
                type: "object",
                properties: {
                  totalEgressBandwidthTier: {
                    type: "string",
                    enum: ["TIER_UNSPECIFIED", "TIER_1"],
                    description:
                      "Specifies the total network bandwidth tier for the NodePool.",
                  },
                },
                description: "Configuration of all network bandwidth tiers",
                additionalProperties: true,
              },
              subnetwork: {
                type: "string",
                description:
                  "Output only. The subnetwork path for the node pool. Format: projects/{project}/regions/{region}/subnetworks/{subnetwork} If the cluster is associated with multiple subnetworks, the subnetwork for the node pool is picked based on the IP utilization during node pool creation and is immutable.",
              },
              podIpv4CidrBlock: {
                type: "string",
                description:
                  "The IP address range for pod IPs in this node pool. Only applicable if `create_pod_range` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) to pick a specific range to use. Only applicable if `ip_allocation_policy.use_ip_aliases` is true. This field cannot be changed after the node pool has been created.",
              },
              additionalNodeNetworkConfigs: {
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
              enablePrivateNodes: {
                type: "boolean",
                description:
                  "Whether nodes have internal IP addresses only. If enable_private_nodes is not specified, then the value is derived from Cluster.NetworkConfig.default_enable_private_nodes",
              },
              networkTierConfig: {
                type: "object",
                properties: {
                  networkTier: {
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
              podIpv4RangeUtilization: {
                type: "number",
                description:
                  "Output only. The utilization of the IPv4 range for the pod. The ratio is Usage/[Total number of IPs in the secondary range], Usage=numNodes*numZones*podIPsPerNode. (Format: double)",
              },
            },
            description: "Parameters for node pool-level network config.",
            additionalProperties: true,
          },
          required: false,
        },
        nodeVersion: {
          name: "Node Version",
          description: "Required.",
          type: {
            type: "string",
            description:
              'Required. The Kubernetes version to change the nodes to (typically an upgrade). Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior: - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "-": picks the Kubernetes master version',
          },
          required: false,
        },
        storagePools: {
          name: "Storage Pools",
          description:
            "List of Storage Pools where boot disks are provisioned.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of Storage Pools where boot disks are provisioned. Existing Storage Pools will be replaced with storage-pools.",
          },
          required: false,
        },
        resourceLabels: {
          name: "Resource Labels",
          description:
            "The resource labels for the node pool to use to annotate any related Google Compute Engine resources.",
          type: {
            type: "object",
            properties: {
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description: "Map of node label keys and node label values.",
              },
            },
            description:
              "Collection of [Resource Manager labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels).",
            additionalProperties: true,
          },
          required: false,
        },
        gcfsConfig: {
          name: "Gcfs Config",
          description: "GCFS config.",
          type: {
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
          required: false,
        },
        gvnic: {
          name: "Gvnic",
          description: "Enable or disable gvnic on the node pool.",
          type: {
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
          required: false,
        },
        tags: {
          name: "Tags",
          description:
            "The desired network tags to be applied to all nodes in the node pool.",
          type: {
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
          required: false,
        },
        locations: {
          name: "Locations",
          description:
            "The desired list of Google Compute Engine [zones](https://cloud.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The desired list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the node pool's nodes should be located. Changing the locations for a node pool will result in nodes being either created or removed from the node pool, depending on whether locations are being added or removed. Warning: It is recommended to update node pool locations in a standalone API call. Do not combine a location update with changes to other fields (such as `tags`, `labels`, `taints`, etc.) in the same request. Otherwise, the API performs a structural modification where changes to other fields will only apply to newly created nodes and will not be applied to existing nodes in the node pool. To ensure all nodes are updated consistently, use a separate API call for location changes.",
          },
          required: false,
        },
        confidentialNodes: {
          name: "Confidential Nodes",
          description: "Confidential nodes config.",
          type: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Whether Confidential Nodes feature is enabled.",
              },
              confidentialInstanceType: {
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
          required: false,
        },
        loggingConfig: {
          name: "Logging Config",
          description: "Logging configuration.",
          type: {
            type: "object",
            properties: {
              variantConfig: {
                type: "object",
                properties: {
                  variant: {
                    type: "string",
                    enum: ["VARIANT_UNSPECIFIED", "DEFAULT", "MAX_THROUGHPUT"],
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
          required: false,
        },
        workloadMetadataConfig: {
          name: "Workload Metadata Config",
          description:
            "The desired workload metadata config for the node pool.",
          type: {
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
        let path = `v1/projects/{projectId}/zones/{zone}/clusters/{clusterId}/nodePools/{nodePoolId}/update`;

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
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.kubeletConfig !== undefined)
          requestBody.kubeletConfig = input.event.inputConfig.kubeletConfig;
        if (input.event.inputConfig.resourceManagerTags !== undefined)
          requestBody.resourceManagerTags =
            input.event.inputConfig.resourceManagerTags;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.linuxNodeConfig !== undefined)
          requestBody.linuxNodeConfig = input.event.inputConfig.linuxNodeConfig;
        if (input.event.inputConfig.maxRunDuration !== undefined)
          requestBody.maxRunDuration = input.event.inputConfig.maxRunDuration;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.diskSizeGb !== undefined)
          requestBody.diskSizeGb = input.event.inputConfig.diskSizeGb;
        if (input.event.inputConfig.queuedProvisioning !== undefined)
          requestBody.queuedProvisioning =
            input.event.inputConfig.queuedProvisioning;
        if (input.event.inputConfig.fastSocket !== undefined)
          requestBody.fastSocket = input.event.inputConfig.fastSocket;
        if (input.event.inputConfig.accelerators !== undefined)
          requestBody.accelerators = input.event.inputConfig.accelerators;
        if (input.event.inputConfig.windowsNodeConfig !== undefined)
          requestBody.windowsNodeConfig =
            input.event.inputConfig.windowsNodeConfig;
        if (input.event.inputConfig.machineType !== undefined)
          requestBody.machineType = input.event.inputConfig.machineType;
        if (input.event.inputConfig.upgradeSettings !== undefined)
          requestBody.upgradeSettings = input.event.inputConfig.upgradeSettings;
        if (input.event.inputConfig.containerdConfig !== undefined)
          requestBody.containerdConfig =
            input.event.inputConfig.containerdConfig;
        if (input.event.inputConfig.diskType !== undefined)
          requestBody.diskType = input.event.inputConfig.diskType;
        if (input.event.inputConfig.imageType !== undefined)
          requestBody.imageType = input.event.inputConfig.imageType;
        if (input.event.inputConfig.flexStart !== undefined)
          requestBody.flexStart = input.event.inputConfig.flexStart;
        if (input.event.inputConfig.bootDisk !== undefined)
          requestBody.bootDisk = input.event.inputConfig.bootDisk;
        if (input.event.inputConfig.taints !== undefined)
          requestBody.taints = input.event.inputConfig.taints;
        if (input.event.inputConfig.nodeNetworkConfig !== undefined)
          requestBody.nodeNetworkConfig =
            input.event.inputConfig.nodeNetworkConfig;
        if (input.event.inputConfig.nodeVersion !== undefined)
          requestBody.nodeVersion = input.event.inputConfig.nodeVersion;
        if (input.event.inputConfig.storagePools !== undefined)
          requestBody.storagePools = input.event.inputConfig.storagePools;
        if (input.event.inputConfig.resourceLabels !== undefined)
          requestBody.resourceLabels = input.event.inputConfig.resourceLabels;
        if (input.event.inputConfig.gcfsConfig !== undefined)
          requestBody.gcfsConfig = input.event.inputConfig.gcfsConfig;
        if (input.event.inputConfig.gvnic !== undefined)
          requestBody.gvnic = input.event.inputConfig.gvnic;
        if (input.event.inputConfig.tags !== undefined)
          requestBody.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.locations !== undefined)
          requestBody.locations = input.event.inputConfig.locations;
        if (input.event.inputConfig.confidentialNodes !== undefined)
          requestBody.confidentialNodes =
            input.event.inputConfig.confidentialNodes;
        if (input.event.inputConfig.loggingConfig !== undefined)
          requestBody.loggingConfig = input.event.inputConfig.loggingConfig;
        if (input.event.inputConfig.workloadMetadataConfig !== undefined)
          requestBody.workloadMetadataConfig =
            input.event.inputConfig.workloadMetadataConfig;

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

export default nodePoolsUpdate;
