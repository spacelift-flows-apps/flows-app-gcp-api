import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const clustersCreate: AppBlock = {
  name: "Clusters - Create",
  description: `Creates a cluster, consisting of the specified number and type of Google Compute Engine instances.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The parent (project and location) where the cluster will be created.",
          type: {
            type: "string",
            description:
              "The parent (project and location) where the cluster will be created. Specified in the format `projects/*/locations/*`.",
          },
          required: false,
        },
        cluster: {
          name: "Cluster",
          description: "Required.",
          type: {
            type: "object",
            properties: {
              enableK8sBetaApis: {
                type: "object",
                properties: {
                  enabledApis: {
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
              expireTime: {
                type: "string",
                description:
                  "Output only. The time the cluster will be automatically deleted in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
              },
              databaseEncryption: {
                type: "object",
                properties: {
                  keyName: {
                    type: "string",
                    description:
                      "Name of CloudKMS key to use for the encryption of secrets in etcd. Ex. projects/my-project/locations/global/keyRings/my-ring/cryptoKeys/my-key",
                  },
                  currentState: {
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
                  decryptionKeys: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Output only. Keys in use by the cluster for decrypting existing objects, in addition to the key in `key_name`. Each item is a CloudKMS key resource.",
                  },
                  lastOperationErrors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        keyName: {
                          type: "string",
                          description:
                            "CloudKMS key resource that had the error.",
                        },
                        timestamp: {
                          type: "string",
                          description:
                            "Time when the CloudKMS error was seen. (Format: google-datetime)",
                        },
                        errorMessage: {
                          type: "string",
                          description:
                            "Description of the error seen during the operation.",
                        },
                      },
                      description:
                        "OperationError records errors seen from CloudKMS keys encountered during updates to DatabaseEncryption configuration.",
                      additionalProperties: true,
                    },
                    description:
                      "Output only. Records errors seen during DatabaseEncryption update operations.",
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
              subnetwork: {
                type: "string",
                description:
                  "The name of the Google Compute Engine [subnetwork](https://cloud.google.com/compute/docs/subnetworks) to which the cluster is connected.",
              },
              nodePoolDefaults: {
                type: "object",
                properties: {
                  nodeConfigDefaults: {
                    type: "object",
                    properties: {
                      containerdConfig: {
                        type: "object",
                        properties: {
                          privateRegistryAccessConfig: {
                            type: "object",
                            properties: {
                              enabled: {
                                type: "boolean",
                                description:
                                  "Private registry access is enabled.",
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
                                description:
                                  "Private registry access configuration.",
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
                            description:
                              "Defines writable cgroups configuration.",
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
                                                  type: "object",
                                                  additionalProperties: true,
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
                                                  type: "object",
                                                  additionalProperties: true,
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
                                              description:
                                                "Key configures the header key.",
                                            },
                                            value: {
                                              type: "array",
                                              items: {
                                                type: "object",
                                                additionalProperties: true,
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
                      loggingConfig: {
                        type: "object",
                        properties: {
                          variantConfig: {
                            type: "object",
                            properties: {
                              variant: {
                                type: "string",
                                enum: [
                                  "VARIANT_UNSPECIFIED",
                                  "DEFAULT",
                                  "MAX_THROUGHPUT",
                                ],
                                description:
                                  "Logging variant deployed on nodes.",
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
                      gcfsConfig: {
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
                      nodeKubeletConfig: {
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
                            description:
                              "Enable or disable Kubelet read only port.",
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
                    },
                    description:
                      "Subset of NodeConfig message that has defaults.",
                    additionalProperties: true,
                  },
                },
                description: "Subset of Nodepool message that has defaults.",
                additionalProperties: true,
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
              name: {
                type: "string",
                description:
                  "The name of this cluster. The name must be unique within this project and location (e.g. zone or region), and can be up to 40 characters with the following restrictions: * Lowercase letters, numbers, and hyphens only. * Must start with a letter. * Must end with a number or a letter.",
              },
              legacyAbac: {
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
              shieldedNodes: {
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
              nodePools: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    conditions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          message: {
                            type: "string",
                            description:
                              "Human-friendly representation of the condition",
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
                        "Which conditions caused the current node pool state.",
                    },
                    etag: {
                      type: "string",
                      description:
                        "This checksum is computed by the server based on the value of node pool fields, and may be sent on update requests to ensure the client has an up-to-date value before proceeding.",
                    },
                    maxPodsConstraint: {
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
                    placementPolicy: {
                      type: "object",
                      properties: {
                        tpuTopology: {
                          type: "string",
                          description:
                            "Optional. TPU placement topology for pod slice node pool. https://cloud.google.com/tpu/docs/types-topologies#tpu_topologies",
                        },
                        policyName: {
                          type: "string",
                          description:
                            "If set, refers to the name of a custom resource policy supplied by the user. The resource policy must be in the same project and region as the node pool. If not found, InvalidArgument error is returned.",
                        },
                        type: {
                          type: "string",
                          enum: ["TYPE_UNSPECIFIED", "COMPACT"],
                          description: "The type of placement.",
                        },
                      },
                      description:
                        "PlacementPolicy defines the placement policy used by the node pool.",
                      additionalProperties: true,
                    },
                    networkConfig: {
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
                          description:
                            "Configuration of all network bandwidth tiers",
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
                      description:
                        "Parameters for node pool-level network config.",
                      additionalProperties: true,
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
                    version: {
                      type: "string",
                      description:
                        "The version of Kubernetes running on this NodePool's nodes. If unspecified, it defaults as described [here](https://cloud.google.com/kubernetes-engine/versioning#specifying_node_version).",
                    },
                    podIpv4CidrSize: {
                      type: "integer",
                      description:
                        "Output only. The pod CIDR block size per node in this node pool. (Format: int32)",
                    },
                    config: {
                      type: "object",
                      properties: {
                        ephemeralStorageLocalSsdConfig: {
                          type: "object",
                          properties: {
                            dataCacheCount: {
                              type: "integer",
                              description:
                                "Number of local SSDs to use for GKE Data Cache. (Format: int32)",
                            },
                            localSsdCount: {
                              type: "integer",
                              description:
                                "Number of local SSDs to use to back ephemeral storage. Uses NVMe interfaces. A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info. (Format: int32)",
                            },
                          },
                          description:
                            "EphemeralStorageLocalSsdConfig contains configuration for the node ephemeral storage using Local SSDs.",
                          additionalProperties: true,
                        },
                        secondaryBootDiskUpdateStrategy: {
                          type: "object",
                          properties: {},
                          description:
                            "SecondaryBootDiskUpdateStrategy is a placeholder which will be extended in the future to define different options for updating secondary boot disks.",
                          additionalProperties: true,
                        },
                        secondaryBootDisks: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              mode: {
                                type: "string",
                                enum: [
                                  "MODE_UNSPECIFIED",
                                  "CONTAINER_IMAGE_CACHE",
                                ],
                                description:
                                  "Disk mode (container image cache, etc.)",
                              },
                              diskImage: {
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
                        metadata: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            'The metadata key/value pairs assigned to instances in the cluster. Keys must conform to the regexp `[a-zA-Z0-9-_]+` and be less than 128 bytes in length. These are reflected as part of a URL in the metadata server. Additionally, to avoid ambiguity, keys must not conflict with any other metadata keys for the project or be one of the reserved keys: - "cluster-location" - "cluster-name" - "cluster-uid" - "configure-sh" - "containerd-configure-sh" - "enable-os-login" - "gci-ensure-gke-docker" - "gci-metrics-enabled" - "gci-update-strategy" - "instance-template" - "kube-env" - "startup-script" - "user-data" - "disable-address-manager" - "windows-startup-script-ps1" - "common-psm1" - "k8s-node-setup-psm1" - "install-ssh-psm1" - "user-profile-psm1" Values are free-form strings, and only have meaning as interpreted by the image running in the instance. The only restriction placed on them is that each value\'s size must be less than or equal to 32 KB. The total size of all keys and values must be less than 512 KB.',
                        },
                        preemptible: {
                          type: "boolean",
                          description:
                            "Whether the nodes are created as preemptible VM instances. See: https://cloud.google.com/compute/docs/instances/preemptible for more information about preemptible VM instances.",
                        },
                        localSsdEncryptionMode: {
                          type: "string",
                          enum: [
                            "LOCAL_SSD_ENCRYPTION_MODE_UNSPECIFIED",
                            "STANDARD_ENCRYPTION",
                            "EPHEMERAL_KEY_ENCRYPTION",
                          ],
                          description:
                            "Specifies which method should be used for encrypting the Local SSDs attached to the node.",
                        },
                        resourceManagerTags: {
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
                        soleTenantConfig: {
                          type: "object",
                          properties: {
                            minNodeCpus: {
                              type: "integer",
                              description:
                                "Optional. The minimum number of virtual CPUs this instance will consume when running on a sole-tenant node. This field can only be set if the node pool is created in a shared sole-tenant node group. (Format: int32)",
                            },
                            nodeAffinities: {
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
                                    enum: [
                                      "OPERATOR_UNSPECIFIED",
                                      "IN",
                                      "NOT_IN",
                                    ],
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
                          },
                          description:
                            "SoleTenantConfig contains the NodeAffinities to specify what shared sole tenant node groups should back the node pool.",
                          additionalProperties: true,
                        },
                        bootDisk: {
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
                        labels: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "The map of Kubernetes labels (key/value pairs) to be applied to each node. These will added in addition to any default label(s) that Kubernetes may apply to the node. In case of conflict in label keys, the applied set may differ depending on the Kubernetes version -- it's best to assume the behavior is undefined and conflicts should be avoided. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/",
                        },
                        windowsNodeConfig: {
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
                        loggingConfig: {
                          type: "object",
                          properties: {
                            variantConfig: {
                              type: "object",
                              properties: {
                                variant: {
                                  type: "string",
                                  enum: [
                                    "VARIANT_UNSPECIFIED",
                                    "DEFAULT",
                                    "MAX_THROUGHPUT",
                                  ],
                                  description:
                                    "Logging variant deployed on nodes.",
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
                        imageType: {
                          type: "string",
                          description:
                            "The image type to use for this node. Note that for a given image type, the latest version of it will be used. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.",
                        },
                        minCpuPlatform: {
                          type: "string",
                          description:
                            'Minimum CPU platform to be used by this instance. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as `minCpuPlatform: "Intel Haswell"` or `minCpuPlatform: "Intel Sandy Bridge"`. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform)',
                        },
                        nodeGroup: {
                          type: "string",
                          description:
                            "Setting this field will assign instances of this pool to run on the specified node group. This is useful for running workloads on [sole tenant nodes](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes).",
                        },
                        fastSocket: {
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
                        kubeletConfig: {
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
                              description:
                                "Enable or disable Kubelet read only port.",
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
                        linuxNodeConfig: {
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
                              description:
                                "Hugepages amount in both 2m and 1g size",
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
                          description:
                            "Parameters that can be configured on Linux nodes.",
                          additionalProperties: true,
                        },
                        spot: {
                          type: "boolean",
                          description:
                            "Spot flag for enabling Spot VM, which is a rebrand of the existing preemptible flag.",
                        },
                        advancedMachineFeatures: {
                          type: "object",
                          properties: {
                            performanceMonitoringUnit: {
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
                            threadsPerCore: {
                              type: "string",
                              description:
                                "The number of threads per physical core. To disable simultaneous multithreading (SMT) set this to 1. If unset, the maximum number of threads supported per core by the underlying processor is assumed. (Format: int64)",
                            },
                            enableNestedVirtualization: {
                              type: "boolean",
                              description:
                                "Whether or not to enable nested virtualization (defaults to false).",
                            },
                          },
                          description:
                            "Specifies options for controlling advanced machine features.",
                          additionalProperties: true,
                        },
                        sandboxConfig: {
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
                        bootDiskKmsKey: {
                          type: "string",
                          description:
                            "The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption",
                        },
                        maxRunDuration: {
                          type: "string",
                          description:
                            "The maximum duration for the nodes to exist. If unspecified, the nodes can exist indefinitely. (Format: google-duration)",
                        },
                        reservationAffinity: {
                          type: "object",
                          properties: {
                            values: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "Corresponds to the label value(s) of reservation resource(s).",
                            },
                            consumeReservationType: {
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
                          },
                          description:
                            "[ReservationAffinity](https://cloud.google.com/compute/docs/instances/reserving-zonal-resources) is the configuration of desired reservation which instances could take capacity from.",
                          additionalProperties: true,
                        },
                        confidentialNodes: {
                          type: "object",
                          properties: {
                            enabled: {
                              type: "boolean",
                              description:
                                "Whether Confidential Nodes feature is enabled.",
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
                        resourceLabels: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "The resource labels for the node pool to use to annotate any related Google Compute Engine resources.",
                        },
                        diskType: {
                          type: "string",
                          description:
                            "Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced') If unspecified, the default disk type is 'pd-standard'",
                        },
                        serviceAccount: {
                          type: "string",
                          description:
                            'The Google Cloud Platform Service Account to be used by the node VMs. Specify the email address of the Service Account; otherwise, if no Service Account is specified, the "default" service account is used.',
                        },
                        oauthScopes: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            'The set of Google API scopes to be made available on all of the node VMs under the "default" service account. The following scopes are recommended, but not required, and by default are not included: * `https://www.googleapis.com/auth/compute` is required for mounting persistent storage on your nodes. * `https://www.googleapis.com/auth/devstorage.read_only` is required for communicating with **gcr.io** (the [Artifact Registry](https://cloud.google.com/artifact-registry/)). If unspecified, no scopes are added, unless Cloud Logging or Cloud Monitoring are enabled, in which case their required scopes will be added.',
                        },
                        effectiveCgroupMode: {
                          type: "string",
                          enum: [
                            "EFFECTIVE_CGROUP_MODE_UNSPECIFIED",
                            "EFFECTIVE_CGROUP_MODE_V1",
                            "EFFECTIVE_CGROUP_MODE_V2",
                          ],
                          description:
                            "Output only. effective_cgroup_mode is the cgroup mode actually used by the node pool. It is determined by the cgroup mode specified in the LinuxNodeConfig or the default cgroup mode based on the cluster creation version.",
                        },
                        gcfsConfig: {
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
                        localSsdCount: {
                          type: "integer",
                          description:
                            "The number of local SSD disks to be attached to the node. The limit for this value is dependent upon the maximum number of disks available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. (Format: int32)",
                        },
                        flexStart: {
                          type: "boolean",
                          description:
                            "Flex Start flag for enabling Flex Start VM.",
                        },
                        storagePools: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "List of Storage Pools where boot disks are provisioned.",
                        },
                        localNvmeSsdBlockConfig: {
                          type: "object",
                          properties: {
                            localSsdCount: {
                              type: "integer",
                              description:
                                "Number of local NVMe SSDs to use. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info. (Format: int32)",
                            },
                          },
                          description:
                            "LocalNvmeSsdBlockConfig contains configuration for using raw-block local NVMe SSDs",
                          additionalProperties: true,
                        },
                        workloadMetadataConfig: {
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
                        machineType: {
                          type: "string",
                          description:
                            "The name of a Google Compute Engine [machine type](https://cloud.google.com/compute/docs/machine-types) If unspecified, the default machine type is `e2-medium`.",
                        },
                        tags: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "The list of instance tags applied to all nodes. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during cluster or node pool creation. Each tag within the list must comply with RFC1035.",
                        },
                        enableConfidentialStorage: {
                          type: "boolean",
                          description: "Optional. Reserved for future use.",
                        },
                        containerdConfig: {
                          type: "object",
                          properties: {
                            privateRegistryAccessConfig: {
                              type: "object",
                              properties: {
                                enabled: {
                                  type: "boolean",
                                  description:
                                    "Private registry access is enabled.",
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
                                  description:
                                    "Private registry access configuration.",
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
                              description:
                                "Defines writable cgroups configuration.",
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
                                                additionalProperties: true,
                                              },
                                              cert: {
                                                type: "object",
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
                                                type: "object",
                                                additionalProperties: true,
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
                                                type: "object",
                                                additionalProperties: true,
                                              },
                                              value: {
                                                type: "object",
                                                additionalProperties: true,
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
                          description:
                            "List of kubernetes taints to be applied to each node. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/",
                        },
                        shieldedInstanceConfig: {
                          type: "object",
                          properties: {
                            enableSecureBoot: {
                              type: "boolean",
                              description:
                                "Defines whether the instance has Secure Boot enabled. Secure Boot helps ensure that the system only runs authentic software by verifying the digital signature of all boot components, and halting the boot process if signature verification fails.",
                            },
                            enableIntegrityMonitoring: {
                              type: "boolean",
                              description:
                                "Defines whether the instance has integrity monitoring enabled. Enables monitoring and attestation of the boot integrity of the instance. The attestation is performed against the integrity policy baseline. This baseline is initially derived from the implicitly trusted boot image when the instance is created.",
                            },
                          },
                          description: "A set of Shielded Instance options.",
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
                        diskSizeGb: {
                          type: "integer",
                          description:
                            "Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB. If unspecified, the default disk size is 100GB. (Format: int32)",
                        },
                        accelerators: {
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
                                    description:
                                      "Mode for how the GPU driver is installed.",
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
                      },
                      description:
                        "Parameters that describe the nodes in a cluster. GKE Autopilot clusters do not recognize parameters in `NodeConfig`. Use AutoprovisioningNodePoolDefaults instead.",
                      additionalProperties: true,
                    },
                    statusMessage: {
                      type: "string",
                      description:
                        "Output only. Deprecated. Use conditions instead. Additional information about the current status of this node pool instance, if available.",
                    },
                    instanceGroupUrls: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Output only. The resource URLs of the [managed instance groups](https://cloud.google.com/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with this node pool. During the node pool blue-green upgrade operation, the URLs contain both blue and green resources.",
                    },
                    name: {
                      type: "string",
                      description: "The name of the node pool.",
                    },
                    updateInfo: {
                      type: "object",
                      properties: {
                        blueGreenInfo: {
                          type: "object",
                          properties: {
                            greenPoolVersion: {
                              type: "string",
                              description: "Version of green pool.",
                            },
                            blueInstanceGroupUrls: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "The resource URLs of the [managed instance groups] (/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with blue pool.",
                            },
                            bluePoolDeletionStartTime: {
                              type: "string",
                              description:
                                "Time to start deleting blue pool to complete blue-green upgrade, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
                            },
                            greenInstanceGroupUrls: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "The resource URLs of the [managed instance groups] (/compute/docs/instance-groups/creating-groups-of-managed-instances) associated with green pool.",
                            },
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
                    management: {
                      type: "object",
                      properties: {
                        autoUpgrade: {
                          type: "boolean",
                          description:
                            "A flag that specifies whether node auto-upgrade is enabled for the node pool. If enabled, node auto-upgrade helps keep the nodes in your node pool up to date with the latest release version of Kubernetes.",
                        },
                        upgradeOptions: {
                          type: "object",
                          properties: {
                            description: {
                              type: "string",
                              description:
                                "Output only. This field is set when upgrades are about to commence with the description of the upgrade.",
                            },
                            autoUpgradeStartTime: {
                              type: "string",
                              description:
                                "Output only. This field is set when upgrades are about to commence with the approximate start time for the upgrades, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
                            },
                          },
                          description:
                            "AutoUpgradeOptions defines the set of options for the user to control how the Auto Upgrades will proceed.",
                          additionalProperties: true,
                        },
                        autoRepair: {
                          type: "boolean",
                          description:
                            "A flag that specifies whether the node auto-repair is enabled for the node pool. If enabled, the nodes in this node pool will be monitored and, if they fail health checks too many times, an automatic repair action will be triggered.",
                        },
                      },
                      description:
                        "NodeManagement defines the set of node management services turned on for the node pool.",
                      additionalProperties: true,
                    },
                    autoscaling: {
                      type: "object",
                      properties: {
                        minNodeCount: {
                          type: "integer",
                          description:
                            "Minimum number of nodes for one location in the node pool. Must be greater than or equal to 0 and less than or equal to max_node_count. (Format: int32)",
                        },
                        maxNodeCount: {
                          type: "integer",
                          description:
                            "Maximum number of nodes for one location in the node pool. Must be >= min_node_count. There has to be enough quota to scale up the cluster. (Format: int32)",
                        },
                        autoprovisioned: {
                          type: "boolean",
                          description:
                            "Can this node pool be deleted automatically.",
                        },
                        totalMinNodeCount: {
                          type: "integer",
                          description:
                            "Minimum number of nodes in the node pool. Must be greater than or equal to 0 and less than or equal to total_max_node_count. The total_*_node_count fields are mutually exclusive with the *_node_count fields. (Format: int32)",
                        },
                        locationPolicy: {
                          type: "string",
                          enum: [
                            "LOCATION_POLICY_UNSPECIFIED",
                            "BALANCED",
                            "ANY",
                          ],
                          description:
                            "Location policy used when scaling up a nodepool.",
                        },
                        totalMaxNodeCount: {
                          type: "integer",
                          description:
                            "Maximum number of nodes in the node pool. Must be greater than or equal to total_min_node_count. There has to be enough quota to scale up the cluster. The total_*_node_count fields are mutually exclusive with the *_node_count fields. (Format: int32)",
                        },
                        enabled: {
                          type: "boolean",
                          description:
                            "Is autoscaling enabled for this node pool.",
                        },
                      },
                      description:
                        "NodePoolAutoscaling contains information required by cluster autoscaler to adjust the size of the node pool to the current cluster usage.",
                      additionalProperties: true,
                    },
                    locations: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the NodePool's nodes should be located. If this value is unspecified during node pool creation, the [Cluster.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters#Cluster.FIELDS.locations) value will be used, instead. Warning: changing node pool locations will result in nodes being added and/or removed.",
                    },
                    initialNodeCount: {
                      type: "integer",
                      description:
                        "The initial node count for the pool. You must ensure that your Compute Engine [resource quota](https://cloud.google.com/compute/quotas) is sufficient for this number of instances. You must also have available firewall and routes quota. (Format: int32)",
                    },
                    autopilotConfig: {
                      type: "object",
                      properties: {
                        enabled: {
                          type: "boolean",
                          description:
                            "Denotes that nodes belonging to this node pool are Autopilot nodes.",
                        },
                      },
                      description:
                        "AutopilotConfig contains configuration of autopilot feature for this nodepool.",
                      additionalProperties: true,
                    },
                    selfLink: {
                      type: "string",
                      description:
                        "Output only. Server-defined URL for the resource.",
                    },
                    queuedProvisioning: {
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
                    bestEffortProvisioning: {
                      type: "object",
                      properties: {
                        enabled: {
                          type: "boolean",
                          description:
                            "When this is enabled, cluster/node pool creations will ignore non-fatal errors like stockout to best provision as many nodes as possible right now and eventually bring up all target number of nodes",
                        },
                        minProvisionNodes: {
                          type: "integer",
                          description:
                            "Minimum number of nodes to be provisioned to be considered as succeeded, and the rest of nodes will be provisioned gradually and eventually when stockout issue has been resolved. (Format: int32)",
                        },
                      },
                      description: "Best effort provisioning.",
                      additionalProperties: true,
                    },
                    upgradeSettings: {
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
                  },
                  description:
                    "NodePool contains the name and configuration for a cluster's node pool. Node pools are a set of nodes (i.e. VM's), with a common configuration and specification, under the control of the cluster master. They may have a set of Kubernetes labels applied to them, which may be used to reference them during pod scheduling. They may also be resized up or down, to accommodate the workload.",
                  additionalProperties: true,
                },
                description:
                  'The node pools associated with this cluster. This field should not be set if "node_config" or "initial_node_count" are specified.',
              },
              meshCertificates: {
                type: "object",
                properties: {
                  enableCertificates: {
                    type: "boolean",
                    description:
                      "enable_certificates controls issuance of workload mTLS certificates. If set, the GKE Workload Identity Certificates controller and node agent will be deployed in the cluster, which can then be configured by creating a WorkloadCertificateConfig Custom Resource. Requires Workload Identity (workload_pool must be non-empty).",
                  },
                },
                description:
                  "Configuration for issuance of mTLS keys and certificates to Kubernetes pods.",
                additionalProperties: true,
              },
              addonsConfig: {
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
                            description:
                              "Enable log collection for Ray clusters.",
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
                    description:
                      "Configuration for the High Scale Checkpointing.",
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
                    description:
                      "Configuration options for the Cloud Run feature.",
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
              enterpriseConfig: {
                type: "object",
                properties: {
                  desiredTier: {
                    type: "string",
                    enum: [
                      "CLUSTER_TIER_UNSPECIFIED",
                      "STANDARD",
                      "ENTERPRISE",
                    ],
                    description:
                      "desired_tier specifies the desired tier of the cluster.",
                  },
                  clusterTier: {
                    type: "string",
                    enum: [
                      "CLUSTER_TIER_UNSPECIFIED",
                      "STANDARD",
                      "ENTERPRISE",
                    ],
                    description:
                      "Output only. cluster_tier indicates the effective tier of the cluster.",
                  },
                },
                description:
                  "EnterpriseConfig is the cluster enterprise configuration. Deprecated: GKE Enterprise features are now available without an Enterprise tier.",
                additionalProperties: true,
              },
              masterAuth: {
                type: "object",
                properties: {
                  clientKey: {
                    type: "string",
                    description:
                      "Output only. Base64-encoded private key used by clients to authenticate to the cluster endpoint.",
                  },
                  clusterCaCertificate: {
                    type: "string",
                    description:
                      "Output only. Base64-encoded public certificate that is the root of trust for the cluster.",
                  },
                  clientCertificateConfig: {
                    type: "object",
                    properties: {
                      issueClientCertificate: {
                        type: "boolean",
                        description: "Issue a client certificate.",
                      },
                    },
                    description:
                      "Configuration for client certificates on the cluster.",
                    additionalProperties: true,
                  },
                  username: {
                    type: "string",
                    description:
                      "The username to use for HTTP basic authentication to the master endpoint. For clusters v1.6.0 and later, basic authentication can be disabled by leaving username unspecified (or setting it to the empty string). Warning: basic authentication is deprecated, and will be removed in GKE control plane versions 1.19 and newer. For a list of recommended authentication methods, see: https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication",
                  },
                  password: {
                    type: "string",
                    description:
                      "The password to use for HTTP basic authentication to the master endpoint. Because the master endpoint is open to the Internet, you should create a strong password. If a password is provided for cluster creation, username must be non-empty. Warning: basic authentication is deprecated, and will be removed in GKE control plane versions 1.19 and newer. For a list of recommended authentication methods, see: https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication",
                  },
                  clientCertificate: {
                    type: "string",
                    description:
                      "Output only. Base64-encoded public certificate used by clients to authenticate to the cluster endpoint. Issued only if client_certificate_config is set.",
                  },
                },
                description:
                  "The authentication information for accessing the master endpoint. Authentication can be done using HTTP basic auth or using client certificates.",
                additionalProperties: true,
              },
              initialClusterVersion: {
                type: "string",
                description:
                  'The initial Kubernetes version for this cluster. Valid versions are those found in validMasterVersions returned by getServerConfig. The version can be upgraded over time; such upgrades are reflected in currentMasterVersion and currentNodeVersion. Users may specify either explicit versions offered by Kubernetes Engine or version aliases, which have the following behavior: - "latest": picks the highest valid Kubernetes version - "1.X": picks the highest valid patch+gke.N patch in the 1.X version - "1.X.Y": picks the highest valid gke.N patch in the 1.X.Y version - "1.X.Y-gke.N": picks an explicit Kubernetes version - "","-": picks the default Kubernetes version',
              },
              tpuIpv4CidrBlock: {
                type: "string",
                description:
                  "Output only. The IP address range of the Cloud TPUs in this cluster, in [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `1.2.3.4/29`). This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.",
              },
              labelFingerprint: {
                type: "string",
                description:
                  "The fingerprint of the set of labels for this cluster.",
              },
              verticalPodAutoscaling: {
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
              releaseChannel: {
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
                  "ReleaseChannel indicates which release channel a cluster is subscribed to. Release channels are arranged in order of risk. When a cluster is subscribed to a release channel, Google maintains both the master version and the node version. Node auto-upgrade defaults to true and cannot be disabled.",
                additionalProperties: true,
              },
              costManagementConfig: {
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
              userManagedKeysConfig: {
                type: "object",
                properties: {
                  serviceAccountSigningKeys: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The Cloud KMS cryptoKeyVersions to use for signing service account JWTs issued by this cluster. Format: `projects/{project}/locations/{location}/keyRings/{keyring}/cryptoKeys/{cryptoKey}/cryptoKeyVersions/{cryptoKeyVersion}`",
                  },
                  controlPlaneDiskEncryptionKeyVersions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Output only. All of the versions of the Cloud KMS cryptoKey that are used by Confidential Hyperdisks on the control plane nodes.",
                  },
                  serviceAccountVerificationKeys: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The Cloud KMS cryptoKeyVersions to use for verifying service account JWTs issued by this cluster. Format: `projects/{project}/locations/{location}/keyRings/{keyring}/cryptoKeys/{cryptoKey}/cryptoKeyVersions/{cryptoKeyVersion}`",
                  },
                  etcdPeerCa: {
                    type: "string",
                    description:
                      "Resource path of the Certificate Authority Service caPool to use for the etcd peer CA in this cluster.",
                  },
                  clusterCa: {
                    type: "string",
                    description:
                      "The Certificate Authority Service caPool to use for the cluster CA in this cluster.",
                  },
                  gkeopsEtcdBackupEncryptionKey: {
                    type: "string",
                    description:
                      "Resource path of the Cloud KMS cryptoKey to use for encryption of internal etcd backups.",
                  },
                  aggregationCa: {
                    type: "string",
                    description:
                      "The Certificate Authority Service caPool to use for the aggregation CA in this cluster.",
                  },
                  etcdApiCa: {
                    type: "string",
                    description:
                      "Resource path of the Certificate Authority Service caPool to use for the etcd API CA in this cluster.",
                  },
                  controlPlaneDiskEncryptionKey: {
                    type: "string",
                    description:
                      "The Cloud KMS cryptoKey to use for Confidential Hyperdisk on the control plane nodes.",
                  },
                },
                description:
                  "UserManagedKeysConfig holds the resource address to Keys which are used for signing certs and token that are used for communication within cluster.",
                additionalProperties: true,
              },
              satisfiesPzs: {
                type: "boolean",
                description: "Output only. Reserved for future use.",
              },
              enableKubernetesAlpha: {
                type: "boolean",
                description:
                  "Kubernetes alpha features are enabled on this cluster. This includes alpha API groups (e.g. v1alpha1) and features that may not be production ready in the kubernetes version of the master and nodes. The cluster has no SLA for uptime and master/node upgrades are disabled. Alpha enabled clusters are automatically deleted thirty days after creation.",
              },
              description: {
                type: "string",
                description: "An optional description of this cluster.",
              },
              nodePoolAutoConfig: {
                type: "object",
                properties: {
                  nodeKubeletConfig: {
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
                        description:
                          "Enable or disable Kubelet read only port.",
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
                  networkTags: {
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
                  resourceManagerTags: {
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
                  linuxNodeConfig: {
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
                    description:
                      "Parameters that can be configured on Linux nodes.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Node pool configs that apply to all auto-provisioned node pools in autopilot clusters and node auto-provisioning enabled clusters.",
                additionalProperties: true,
              },
              initialNodeCount: {
                type: "integer",
                description:
                  'The number of nodes to create in this cluster. You must ensure that your Compute Engine [resource quota](https://cloud.google.com/compute/quotas) is sufficient for this number of instances. You must also have available firewall and routes quota. For requests, this field should only be used in lieu of a "node_pool" object, since this configuration (along with the "node_config") will be used to create a "NodePool" object with an auto-generated name. Do not use this and a node_pool at the same time. This field is deprecated, use node_pool.initial_node_count instead. (Format: int32)',
              },
              rbacBindingConfig: {
                type: "object",
                properties: {
                  enableInsecureBindingSystemAuthenticated: {
                    type: "boolean",
                    description:
                      "Setting this to true will allow any ClusterRoleBinding and RoleBinding with subjects system:authenticated.",
                  },
                  enableInsecureBindingSystemUnauthenticated: {
                    type: "boolean",
                    description:
                      "Setting this to true will allow any ClusterRoleBinding and RoleBinding with subjets system:anonymous or system:unauthenticated.",
                  },
                },
                description:
                  "RBACBindingConfig allows user to restrict ClusterRoleBindings an RoleBindings that can be created.",
                additionalProperties: true,
              },
              network: {
                type: "string",
                description:
                  "The name of the Google Compute Engine [network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks) to which the cluster is connected. If left unspecified, the `default` network will be used.",
              },
              fleet: {
                type: "object",
                properties: {
                  membershipType: {
                    type: "string",
                    enum: ["MEMBERSHIP_TYPE_UNSPECIFIED", "LIGHTWEIGHT"],
                    description: "The type of the cluster's fleet membership.",
                  },
                  preRegistered: {
                    type: "boolean",
                    description:
                      "Output only. Whether the cluster has been registered through the fleet API.",
                  },
                  membership: {
                    type: "string",
                    description:
                      "Output only. The full resource name of the registered fleet membership of the cluster, in the format `//gkehub.googleapis.com/projects/*/locations/*/memberships/*`.",
                  },
                  project: {
                    type: "string",
                    description:
                      "The Fleet host project(project ID or project number) where this cluster will be registered to. This field cannot be changed after the cluster has been registered.",
                  },
                },
                description:
                  "Fleet is the fleet configuration for the cluster.",
                additionalProperties: true,
              },
              etag: {
                type: "string",
                description:
                  "This checksum is computed by the server based on the value of cluster fields, and may be sent on update requests to ensure the client has an up-to-date value before proceeding.",
              },
              podAutoscaling: {
                type: "object",
                properties: {
                  hpaProfile: {
                    type: "string",
                    enum: ["HPA_PROFILE_UNSPECIFIED", "NONE", "PERFORMANCE"],
                    description: "Selected Horizontal Pod Autoscaling profile.",
                  },
                },
                description:
                  "PodAutoscaling is used for configuration of parameters for workload autoscaling.",
                additionalProperties: true,
              },
              monitoringService: {
                type: "string",
                description:
                  "The monitoring service the cluster should use to write metrics. Currently available options: * `monitoring.googleapis.com/kubernetes` - The Cloud Monitoring service with a Kubernetes-native resource model * `monitoring.googleapis.com` - The legacy Cloud Monitoring service (no longer available as of GKE 1.15). * `none` - No metrics will be exported from the cluster. If left as an empty string,`monitoring.googleapis.com/kubernetes` will be used for GKE 1.14+ or `monitoring.googleapis.com` for earlier versions.",
              },
              ipAllocationPolicy: {
                type: "object",
                properties: {
                  servicesIpv4Cidr: {
                    type: "string",
                    description:
                      "This field is deprecated, use services_ipv4_cidr_block.",
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
                  tpuIpv4CidrBlock: {
                    type: "string",
                    description:
                      "The IP address range of the Cloud TPUs in this cluster. If unspecified, a range will be automatically chosen with the default size. This field is only applicable when `use_ip_aliases` is true. If unspecified, the range will use the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use. This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.",
                  },
                  subnetIpv6CidrBlock: {
                    type: "string",
                    description:
                      "Output only. The subnet's IPv6 CIDR block used by nodes and pods.",
                  },
                  clusterSecondaryRangeName: {
                    type: "string",
                    description:
                      "The name of the secondary range to be used for the cluster CIDR block. The secondary range will be used for pod IP addresses. This must be an existing secondary range associated with the cluster subnetwork. This field is only applicable with use_ip_aliases is true and create_subnetwork is false.",
                  },
                  nodeIpv4Cidr: {
                    type: "string",
                    description:
                      "This field is deprecated, use node_ipv4_cidr_block.",
                  },
                  servicesIpv4CidrBlock: {
                    type: "string",
                    description:
                      "The IP address range of the services IPs in this cluster. If blank, a range will be automatically chosen with the default size. This field is only applicable when `use_ip_aliases` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.",
                  },
                  servicesSecondaryRangeName: {
                    type: "string",
                    description:
                      "The name of the secondary range to be used as for the services CIDR block. The secondary range will be used for service ClusterIPs. This must be an existing secondary range associated with the cluster subnetwork. This field is only applicable with use_ip_aliases is true and create_subnetwork is false.",
                  },
                  defaultPodIpv4RangeUtilization: {
                    type: "number",
                    description:
                      "Output only. The utilization of the cluster default IPv4 range for the pod. The ratio is Usage/[Total number of IPs in the secondary range], Usage=numNodes*numZones*podIPsPerNode. (Format: double)",
                  },
                  createSubnetwork: {
                    type: "boolean",
                    description:
                      "Whether a new subnetwork will be created automatically for the cluster. This field is only applicable when `use_ip_aliases` is true.",
                  },
                  clusterIpv4Cidr: {
                    type: "string",
                    description:
                      "This field is deprecated, use cluster_ipv4_cidr_block.",
                  },
                  ipv6AccessType: {
                    type: "string",
                    enum: [
                      "IPV6_ACCESS_TYPE_UNSPECIFIED",
                      "INTERNAL",
                      "EXTERNAL",
                    ],
                    description:
                      "The ipv6 access type (internal or external) when create_subnetwork is true",
                  },
                  additionalPodRangesConfig: {
                    type: "object",
                    properties: {
                      podRangeNames: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Name for pod secondary ipv4 range which has the actual range defined ahead.",
                      },
                      podRangeInfo: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            rangeName: {
                              type: "string",
                              description: "Output only. Name of a range.",
                            },
                            utilization: {
                              type: "number",
                              description:
                                "Output only. The utilization of the range. (Format: double)",
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
                  useIpAliases: {
                    type: "boolean",
                    description:
                      "Whether alias IPs will be used for pod IPs in the cluster. This is used in conjunction with use_routes. It cannot be true if use_routes is true. If both use_ip_aliases and use_routes are false, then the server picks the default IP allocation mode",
                  },
                  servicesIpv6CidrBlock: {
                    type: "string",
                    description:
                      "Output only. The services IPv6 CIDR block for the cluster.",
                  },
                  additionalIpRangesConfigs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        podIpv4RangeNames: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "List of secondary ranges names within this subnetwork that can be used for pod IPs. Example1: gke-pod-range1 Example2: gke-pod-range1,gke-pod-range2",
                        },
                        subnetwork: {
                          type: "string",
                          description:
                            "Name of the subnetwork. This can be the full path of the subnetwork or just the name. Example1: my-subnet Example2: projects/gke-project/regions/us-central1/subnetworks/my-subnet",
                        },
                      },
                      description:
                        "AdditionalIPRangesConfig is the configuration for individual additional subnetwork attached to the cluster",
                      additionalProperties: true,
                    },
                    description:
                      "Output only. The additional IP ranges that are added to the cluster. These IP ranges can be used by new node pools to allocate node and pod IPs automatically. Each AdditionalIPRangesConfig corresponds to a single subnetwork. Once a range is removed it will not show up in IPAllocationPolicy.",
                  },
                  clusterIpv4CidrBlock: {
                    type: "string",
                    description:
                      "The IP address range for the cluster pod IPs. If this field is set, then `cluster.cluster_ipv4_cidr` must be left blank. This field is only applicable when `use_ip_aliases` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.",
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
                  useRoutes: {
                    type: "boolean",
                    description:
                      "Whether routes will be used for pod IPs in the cluster. This is used in conjunction with use_ip_aliases. It cannot be true if use_ip_aliases is true. If both use_ip_aliases and use_routes are false, then the server picks the default IP allocation mode",
                  },
                  autoIpamConfig: {
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
                  nodeIpv4CidrBlock: {
                    type: "string",
                    description:
                      "The IP address range of the instance IPs in this cluster. This is applicable only if `create_subnetwork` is true. Set to blank to have a range chosen with the default size. Set to /netmask (e.g. `/14`) to have a range chosen with a specific netmask. Set to a [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`) from the RFC-1918 private networks (e.g. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to pick a specific range to use.",
                  },
                  stackType: {
                    type: "string",
                    enum: ["STACK_TYPE_UNSPECIFIED", "IPV4", "IPV4_IPV6"],
                    description: "The IP stack type of the cluster",
                  },
                  subnetworkName: {
                    type: "string",
                    description:
                      "A custom subnetwork name to be used if `create_subnetwork` is true. If this field is empty, then an automatic name will be chosen for the new subnetwork.",
                  },
                },
                description:
                  "Configuration for controlling how IPs are allocated in the cluster.",
                additionalProperties: true,
              },
              currentNodeCount: {
                type: "integer",
                description:
                  "Output only. The number of nodes currently in the cluster. Deprecated. Call Kubernetes API directly to retrieve node information. (Format: int32)",
              },
              endpoint: {
                type: "string",
                description:
                  "Output only. The IP address of this cluster's master endpoint. The endpoint can be accessed from the internet at `https://username:password@endpoint/`. See the `masterAuth` property of this resource for username and password information.",
              },
              secretManagerConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Enable/Disable Secret Manager Config.",
                  },
                  rotationConfig: {
                    type: "object",
                    properties: {
                      rotationInterval: {
                        type: "string",
                        description:
                          "The interval between two consecutive rotations. Default rotation interval is 2 minutes. (Format: google-duration)",
                      },
                      enabled: {
                        type: "boolean",
                        description: "Whether the rotation is enabled.",
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
              workloadIdentityConfig: {
                type: "object",
                properties: {
                  workloadPool: {
                    type: "string",
                    description:
                      "The workload pool to attach all Kubernetes service accounts to.",
                  },
                },
                description:
                  "Configuration for the use of Kubernetes Service Accounts in IAM policies.",
                additionalProperties: true,
              },
              controlPlaneEndpointsConfig: {
                type: "object",
                properties: {
                  ipEndpointsConfig: {
                    type: "object",
                    properties: {
                      globalAccess: {
                        type: "boolean",
                        description:
                          "Controls whether the control plane's private endpoint is accessible from sources in other regions. It is invalid to specify both PrivateClusterMasterGlobalAccessConfig.enabled and this field at the same time.",
                      },
                      privateEndpointSubnetwork: {
                        type: "string",
                        description:
                          "Subnet to provision the master's private endpoint during cluster creation. Specified in projects/*/regions/*/subnetworks/* format. It is invalid to specify both PrivateClusterConfig.privateEndpointSubnetwork and this field at the same time.",
                      },
                      authorizedNetworksConfig: {
                        type: "object",
                        properties: {
                          enabled: {
                            type: "boolean",
                            description:
                              "Whether or not master authorized networks is enabled.",
                          },
                          privateEndpointEnforcementEnabled: {
                            type: "boolean",
                            description:
                              "Whether master authorized networks is enforced on private endpoint or not.",
                          },
                          cidrBlocks: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                cidrBlock: {
                                  type: "string",
                                  description:
                                    "cidr_block must be specified in CIDR notation.",
                                },
                                displayName: {
                                  type: "string",
                                  description:
                                    "display_name is an optional field for users to identify CIDR blocks.",
                                },
                              },
                              description:
                                "CidrBlock contains an optional name and one CIDR block.",
                              additionalProperties: true,
                            },
                            description:
                              "cidr_blocks define up to 50 external networks that could access Kubernetes master through HTTPS.",
                          },
                          gcpPublicCidrsAccessEnabled: {
                            type: "boolean",
                            description:
                              "Whether master is accessible via Google Compute Engine Public IP addresses.",
                          },
                        },
                        description:
                          "Configuration options for the master authorized networks feature. Enabled master authorized networks will disallow all external traffic to access Kubernetes master through HTTPS except traffic from the given CIDR blocks, Google Compute Engine Public IPs and Google Prod IPs.",
                        additionalProperties: true,
                      },
                      publicEndpoint: {
                        type: "string",
                        description:
                          "Output only. The external IP address of this cluster's control plane. Only populated if enabled.",
                      },
                      enabled: {
                        type: "boolean",
                        description:
                          "Controls whether to allow direct IP access.",
                      },
                      enablePublicEndpoint: {
                        type: "boolean",
                        description:
                          "Controls whether the control plane allows access through a public IP. It is invalid to specify both PrivateClusterConfig.enablePrivateEndpoint and this field at the same time.",
                      },
                      privateEndpoint: {
                        type: "string",
                        description:
                          "Output only. The internal IP address of this cluster's control plane. Only populated if enabled.",
                      },
                    },
                    description: "IP endpoints configuration.",
                    additionalProperties: true,
                  },
                  dnsEndpointConfig: {
                    type: "object",
                    properties: {
                      enableK8sTokensViaDns: {
                        type: "boolean",
                        description:
                          "Controls whether the k8s token auth is allowed via DNS.",
                      },
                      endpoint: {
                        type: "string",
                        description:
                          "Output only. The cluster's DNS endpoint configuration. A DNS format address. This is accessible from the public internet. Ex: uid.us-central1.gke.goog. Always present, but the behavior may change according to the value of DNSEndpointConfig.allow_external_traffic.",
                      },
                      allowExternalTraffic: {
                        type: "boolean",
                        description:
                          "Controls whether user traffic is allowed over this endpoint. Note that Google-managed services may still use the endpoint even if this is false.",
                      },
                      enableK8sCertsViaDns: {
                        type: "boolean",
                        description:
                          "Controls whether the k8s certs auth is allowed via DNS.",
                      },
                    },
                    description:
                      "Describes the configuration of a DNS endpoint.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Configuration for all of the cluster's control plane endpoints.",
                additionalProperties: true,
              },
              defaultMaxPodsConstraint: {
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
              parentProductConfig: {
                type: "object",
                properties: {
                  productName: {
                    type: "string",
                    description:
                      "Name of the parent product associated with the cluster.",
                  },
                  labels: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Labels contain the configuration of the parent product.",
                  },
                },
                description:
                  "ParentProductConfig is the configuration of the parent product of the cluster. This field is used by Google internal products that are built on top of a GKE cluster and take the ownership of the cluster.",
                additionalProperties: true,
              },
              satisfiesPzi: {
                type: "boolean",
                description: "Output only. Reserved for future use.",
              },
              servicesIpv4Cidr: {
                type: "string",
                description:
                  "Output only. The IP address range of the Kubernetes services in this cluster, in [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `1.2.3.4/29`). Service addresses are typically put in the last `/16` from the container CIDR.",
              },
              networkConfig: {
                type: "object",
                properties: {
                  enableL4ilbSubsetting: {
                    type: "boolean",
                    description:
                      "Whether L4ILB Subsetting is enabled for this cluster.",
                  },
                  privateIpv6GoogleAccess: {
                    type: "string",
                    enum: [
                      "PRIVATE_IPV6_GOOGLE_ACCESS_UNSPECIFIED",
                      "PRIVATE_IPV6_GOOGLE_ACCESS_DISABLED",
                      "PRIVATE_IPV6_GOOGLE_ACCESS_TO_GOOGLE",
                      "PRIVATE_IPV6_GOOGLE_ACCESS_BIDIRECTIONAL",
                    ],
                    description:
                      "The desired state of IPv6 connectivity to Google Services. By default, no private IPv6 access to or from Google Services (all access will be via IPv4)",
                  },
                  enableFqdnNetworkPolicy: {
                    type: "boolean",
                    description:
                      "Whether FQDN Network Policy is enabled on this cluster.",
                  },
                  subnetwork: {
                    type: "string",
                    description:
                      "Output only. The relative name of the Google Compute Engine [subnetwork](https://cloud.google.com/compute/docs/vpc) to which the cluster is connected. Example: projects/my-project/regions/us-central1/subnetworks/my-subnet",
                  },
                  enableMultiNetworking: {
                    type: "boolean",
                    description:
                      "Whether multi-networking is enabled for this cluster.",
                  },
                  network: {
                    type: "string",
                    description:
                      "Output only. The relative name of the Google Compute Engine [network](https://cloud.google.com/compute/docs/networks-and-firewalls#networks) to which the cluster is connected. Example: projects/my-project/global/networks/my-network",
                  },
                  defaultEnablePrivateNodes: {
                    type: "boolean",
                    description:
                      "Controls whether by default nodes have private IP addresses only. It is invalid to specify both PrivateClusterConfig.enablePrivateNodes and this field at the same time. To update the default setting, use ClusterUpdate.desired_default_enable_private_nodes",
                  },
                  datapathProvider: {
                    type: "string",
                    enum: [
                      "DATAPATH_PROVIDER_UNSPECIFIED",
                      "LEGACY_DATAPATH",
                      "ADVANCED_DATAPATH",
                    ],
                    description:
                      "The desired datapath provider for this cluster. By default, uses the IPTables-based kube-proxy implementation.",
                  },
                  defaultSnatStatus: {
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
                  inTransitEncryptionConfig: {
                    type: "string",
                    enum: [
                      "IN_TRANSIT_ENCRYPTION_CONFIG_UNSPECIFIED",
                      "IN_TRANSIT_ENCRYPTION_DISABLED",
                      "IN_TRANSIT_ENCRYPTION_INTER_NODE_TRANSPARENT",
                    ],
                    description:
                      "Specify the details of in-transit encryption. Now named inter-node transparent encryption.",
                  },
                  dnsConfig: {
                    type: "object",
                    properties: {
                      clusterDnsDomain: {
                        type: "string",
                        description:
                          "cluster_dns_domain is the suffix used for all cluster service records.",
                      },
                      additiveVpcScopeDnsDomain: {
                        type: "string",
                        description:
                          "Optional. The domain used in Additive VPC scope.",
                      },
                      clusterDns: {
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
                      clusterDnsScope: {
                        type: "string",
                        enum: [
                          "DNS_SCOPE_UNSPECIFIED",
                          "CLUSTER_SCOPE",
                          "VPC_SCOPE",
                        ],
                        description:
                          "cluster_dns_scope indicates the scope of access to cluster DNS records.",
                      },
                    },
                    description:
                      "DNSConfig contains the desired set of options for configuring clusterDNS.",
                    additionalProperties: true,
                  },
                  gatewayApiConfig: {
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
                  serviceExternalIpsConfig: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Whether Services with ExternalIPs field are allowed or not.",
                      },
                    },
                    description:
                      "Config to block services with externalIPs field.",
                    additionalProperties: true,
                  },
                  disableL4LbFirewallReconciliation: {
                    type: "boolean",
                    description:
                      "Disable L4 load balancer VPC firewalls to enable firewall policies.",
                  },
                  enableCiliumClusterwideNetworkPolicy: {
                    type: "boolean",
                    description:
                      "Whether CiliumClusterwideNetworkPolicy is enabled on this cluster.",
                  },
                  networkPerformanceConfig: {
                    type: "object",
                    properties: {
                      totalEgressBandwidthTier: {
                        type: "string",
                        enum: ["TIER_UNSPECIFIED", "TIER_1"],
                        description:
                          "Specifies the total network bandwidth tier for NodePools in the cluster.",
                      },
                    },
                    description: "Configuration of network bandwidth tiers",
                    additionalProperties: true,
                  },
                  enableIntraNodeVisibility: {
                    type: "boolean",
                    description:
                      "Whether Intra-node visibility is enabled for this cluster. This makes same node pod to pod traffic visible for VPC network.",
                  },
                },
                description:
                  "NetworkConfig reports the relative names of network & subnetwork.",
                additionalProperties: true,
              },
              maintenancePolicy: {
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
                            description:
                              "Represents an arbitrary window of time.",
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
              masterAuthorizedNetworksConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether or not master authorized networks is enabled.",
                  },
                  privateEndpointEnforcementEnabled: {
                    type: "boolean",
                    description:
                      "Whether master authorized networks is enforced on private endpoint or not.",
                  },
                  cidrBlocks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        cidrBlock: {
                          type: "string",
                          description:
                            "cidr_block must be specified in CIDR notation.",
                        },
                        displayName: {
                          type: "string",
                          description:
                            "display_name is an optional field for users to identify CIDR blocks.",
                        },
                      },
                      description:
                        "CidrBlock contains an optional name and one CIDR block.",
                      additionalProperties: true,
                    },
                    description:
                      "cidr_blocks define up to 50 external networks that could access Kubernetes master through HTTPS.",
                  },
                  gcpPublicCidrsAccessEnabled: {
                    type: "boolean",
                    description:
                      "Whether master is accessible via Google Compute Engine Public IP addresses.",
                  },
                },
                description:
                  "Configuration options for the master authorized networks feature. Enabled master authorized networks will disallow all external traffic to access Kubernetes master through HTTPS except traffic from the given CIDR blocks, Google Compute Engine Public IPs and Google Prod IPs.",
                additionalProperties: true,
              },
              nodeConfig: {
                type: "object",
                properties: {
                  ephemeralStorageLocalSsdConfig: {
                    type: "object",
                    properties: {
                      dataCacheCount: {
                        type: "integer",
                        description:
                          "Number of local SSDs to use for GKE Data Cache. (Format: int32)",
                      },
                      localSsdCount: {
                        type: "integer",
                        description:
                          "Number of local SSDs to use to back ephemeral storage. Uses NVMe interfaces. A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info. (Format: int32)",
                      },
                    },
                    description:
                      "EphemeralStorageLocalSsdConfig contains configuration for the node ephemeral storage using Local SSDs.",
                    additionalProperties: true,
                  },
                  secondaryBootDiskUpdateStrategy: {
                    type: "object",
                    properties: {},
                    description:
                      "SecondaryBootDiskUpdateStrategy is a placeholder which will be extended in the future to define different options for updating secondary boot disks.",
                    additionalProperties: true,
                  },
                  secondaryBootDisks: {
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
                        diskImage: {
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
                  metadata: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      'The metadata key/value pairs assigned to instances in the cluster. Keys must conform to the regexp `[a-zA-Z0-9-_]+` and be less than 128 bytes in length. These are reflected as part of a URL in the metadata server. Additionally, to avoid ambiguity, keys must not conflict with any other metadata keys for the project or be one of the reserved keys: - "cluster-location" - "cluster-name" - "cluster-uid" - "configure-sh" - "containerd-configure-sh" - "enable-os-login" - "gci-ensure-gke-docker" - "gci-metrics-enabled" - "gci-update-strategy" - "instance-template" - "kube-env" - "startup-script" - "user-data" - "disable-address-manager" - "windows-startup-script-ps1" - "common-psm1" - "k8s-node-setup-psm1" - "install-ssh-psm1" - "user-profile-psm1" Values are free-form strings, and only have meaning as interpreted by the image running in the instance. The only restriction placed on them is that each value\'s size must be less than or equal to 32 KB. The total size of all keys and values must be less than 512 KB.',
                  },
                  preemptible: {
                    type: "boolean",
                    description:
                      "Whether the nodes are created as preemptible VM instances. See: https://cloud.google.com/compute/docs/instances/preemptible for more information about preemptible VM instances.",
                  },
                  localSsdEncryptionMode: {
                    type: "string",
                    enum: [
                      "LOCAL_SSD_ENCRYPTION_MODE_UNSPECIFIED",
                      "STANDARD_ENCRYPTION",
                      "EPHEMERAL_KEY_ENCRYPTION",
                    ],
                    description:
                      "Specifies which method should be used for encrypting the Local SSDs attached to the node.",
                  },
                  resourceManagerTags: {
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
                  soleTenantConfig: {
                    type: "object",
                    properties: {
                      minNodeCpus: {
                        type: "integer",
                        description:
                          "Optional. The minimum number of virtual CPUs this instance will consume when running on a sole-tenant node. This field can only be set if the node pool is created in a shared sole-tenant node group. (Format: int32)",
                      },
                      nodeAffinities: {
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
                    },
                    description:
                      "SoleTenantConfig contains the NodeAffinities to specify what shared sole tenant node groups should back the node pool.",
                    additionalProperties: true,
                  },
                  bootDisk: {
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
                  labels: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "The map of Kubernetes labels (key/value pairs) to be applied to each node. These will added in addition to any default label(s) that Kubernetes may apply to the node. In case of conflict in label keys, the applied set may differ depending on the Kubernetes version -- it's best to assume the behavior is undefined and conflicts should be avoided. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/",
                  },
                  windowsNodeConfig: {
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
                  loggingConfig: {
                    type: "object",
                    properties: {
                      variantConfig: {
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
                  imageType: {
                    type: "string",
                    description:
                      "The image type to use for this node. Note that for a given image type, the latest version of it will be used. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.",
                  },
                  minCpuPlatform: {
                    type: "string",
                    description:
                      'Minimum CPU platform to be used by this instance. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as `minCpuPlatform: "Intel Haswell"` or `minCpuPlatform: "Intel Sandy Bridge"`. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform)',
                  },
                  nodeGroup: {
                    type: "string",
                    description:
                      "Setting this field will assign instances of this pool to run on the specified node group. This is useful for running workloads on [sole tenant nodes](https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes).",
                  },
                  fastSocket: {
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
                  kubeletConfig: {
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
                        description:
                          "Enable or disable Kubelet read only port.",
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
                  linuxNodeConfig: {
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
                    description:
                      "Parameters that can be configured on Linux nodes.",
                    additionalProperties: true,
                  },
                  spot: {
                    type: "boolean",
                    description:
                      "Spot flag for enabling Spot VM, which is a rebrand of the existing preemptible flag.",
                  },
                  advancedMachineFeatures: {
                    type: "object",
                    properties: {
                      performanceMonitoringUnit: {
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
                      threadsPerCore: {
                        type: "string",
                        description:
                          "The number of threads per physical core. To disable simultaneous multithreading (SMT) set this to 1. If unset, the maximum number of threads supported per core by the underlying processor is assumed. (Format: int64)",
                      },
                      enableNestedVirtualization: {
                        type: "boolean",
                        description:
                          "Whether or not to enable nested virtualization (defaults to false).",
                      },
                    },
                    description:
                      "Specifies options for controlling advanced machine features.",
                    additionalProperties: true,
                  },
                  sandboxConfig: {
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
                  bootDiskKmsKey: {
                    type: "string",
                    description:
                      "The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption",
                  },
                  maxRunDuration: {
                    type: "string",
                    description:
                      "The maximum duration for the nodes to exist. If unspecified, the nodes can exist indefinitely. (Format: google-duration)",
                  },
                  reservationAffinity: {
                    type: "object",
                    properties: {
                      values: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Corresponds to the label value(s) of reservation resource(s).",
                      },
                      consumeReservationType: {
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
                    },
                    description:
                      "[ReservationAffinity](https://cloud.google.com/compute/docs/instances/reserving-zonal-resources) is the configuration of desired reservation which instances could take capacity from.",
                    additionalProperties: true,
                  },
                  confidentialNodes: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Whether Confidential Nodes feature is enabled.",
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
                  resourceLabels: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "The resource labels for the node pool to use to annotate any related Google Compute Engine resources.",
                  },
                  diskType: {
                    type: "string",
                    description:
                      "Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced') If unspecified, the default disk type is 'pd-standard'",
                  },
                  serviceAccount: {
                    type: "string",
                    description:
                      'The Google Cloud Platform Service Account to be used by the node VMs. Specify the email address of the Service Account; otherwise, if no Service Account is specified, the "default" service account is used.',
                  },
                  oauthScopes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      'The set of Google API scopes to be made available on all of the node VMs under the "default" service account. The following scopes are recommended, but not required, and by default are not included: * `https://www.googleapis.com/auth/compute` is required for mounting persistent storage on your nodes. * `https://www.googleapis.com/auth/devstorage.read_only` is required for communicating with **gcr.io** (the [Artifact Registry](https://cloud.google.com/artifact-registry/)). If unspecified, no scopes are added, unless Cloud Logging or Cloud Monitoring are enabled, in which case their required scopes will be added.',
                  },
                  effectiveCgroupMode: {
                    type: "string",
                    enum: [
                      "EFFECTIVE_CGROUP_MODE_UNSPECIFIED",
                      "EFFECTIVE_CGROUP_MODE_V1",
                      "EFFECTIVE_CGROUP_MODE_V2",
                    ],
                    description:
                      "Output only. effective_cgroup_mode is the cgroup mode actually used by the node pool. It is determined by the cgroup mode specified in the LinuxNodeConfig or the default cgroup mode based on the cluster creation version.",
                  },
                  gcfsConfig: {
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
                  localSsdCount: {
                    type: "integer",
                    description:
                      "The number of local SSD disks to be attached to the node. The limit for this value is dependent upon the maximum number of disks available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. (Format: int32)",
                  },
                  flexStart: {
                    type: "boolean",
                    description: "Flex Start flag for enabling Flex Start VM.",
                  },
                  storagePools: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "List of Storage Pools where boot disks are provisioned.",
                  },
                  localNvmeSsdBlockConfig: {
                    type: "object",
                    properties: {
                      localSsdCount: {
                        type: "integer",
                        description:
                          "Number of local NVMe SSDs to use. The limit for this value is dependent upon the maximum number of disk available on a machine per zone. See: https://cloud.google.com/compute/docs/disks/local-ssd for more information. A zero (or unset) value has different meanings depending on machine type being used: 1. For pre-Gen3 machines, which support flexible numbers of local ssds, zero (or unset) means to disable using local SSDs as ephemeral storage. 2. For Gen3 machines which dictate a specific number of local ssds, zero (or unset) means to use the default number of local ssds that goes with that machine type. For example, for a c3-standard-8-lssd machine, 2 local ssds would be provisioned. For c3-standard-8 (which doesn't support local ssds), 0 will be provisioned. See https://cloud.google.com/compute/docs/disks/local-ssd#choose_number_local_ssds for more info. (Format: int32)",
                      },
                    },
                    description:
                      "LocalNvmeSsdBlockConfig contains configuration for using raw-block local NVMe SSDs",
                    additionalProperties: true,
                  },
                  workloadMetadataConfig: {
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
                  machineType: {
                    type: "string",
                    description:
                      "The name of a Google Compute Engine [machine type](https://cloud.google.com/compute/docs/machine-types) If unspecified, the default machine type is `e2-medium`.",
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The list of instance tags applied to all nodes. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during cluster or node pool creation. Each tag within the list must comply with RFC1035.",
                  },
                  enableConfidentialStorage: {
                    type: "boolean",
                    description: "Optional. Reserved for future use.",
                  },
                  containerdConfig: {
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
                            description:
                              "Private registry access configuration.",
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
                    description:
                      "List of kubernetes taints to be applied to each node. For more information, including usage and the valid values, see: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/",
                  },
                  shieldedInstanceConfig: {
                    type: "object",
                    properties: {
                      enableSecureBoot: {
                        type: "boolean",
                        description:
                          "Defines whether the instance has Secure Boot enabled. Secure Boot helps ensure that the system only runs authentic software by verifying the digital signature of all boot components, and halting the boot process if signature verification fails.",
                      },
                      enableIntegrityMonitoring: {
                        type: "boolean",
                        description:
                          "Defines whether the instance has integrity monitoring enabled. Enables monitoring and attestation of the boot integrity of the instance. The attestation is performed against the integrity policy baseline. This baseline is initially derived from the implicitly trusted boot image when the instance is created.",
                      },
                    },
                    description: "A set of Shielded Instance options.",
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
                  diskSizeGb: {
                    type: "integer",
                    description:
                      "Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB. If unspecified, the default disk size is 100GB. (Format: int32)",
                  },
                  accelerators: {
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
                              description:
                                "Mode for how the GPU driver is installed.",
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
                },
                description:
                  "Parameters that describe the nodes in a cluster. GKE Autopilot clusters do not recognize parameters in `NodeConfig`. Use AutoprovisioningNodePoolDefaults instead.",
                additionalProperties: true,
              },
              locations: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the cluster's nodes should be located. This field provides a default value if [NodePool.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools#NodePool.FIELDS.locations) are not specified during node pool creation. Warning: changing cluster locations will update the [NodePool.Locations](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools#NodePool.FIELDS.locations) of all node pools and will result in nodes being added and/or removed.",
              },
              instanceGroupUrls: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Output only. Deprecated. Use node_pools.instance_group_urls.",
              },
              gkeAutoUpgradeConfig: {
                type: "object",
                properties: {
                  patchMode: {
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
              autopilot: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Enable Autopilot",
                  },
                  privilegedAdmissionConfig: {
                    type: "object",
                    properties: {
                      allowlistPaths: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "The customer allowlist Cloud Storage paths for the cluster. These paths are used with the `--autopilot-privileged-admission` flag to authorize privileged workloads in Autopilot clusters. Paths can be GKE-owned, in the format `gke:////`, or customer-owned, in the format `gs:///`. Wildcards (`*`) are supported to authorize all allowlists under specific paths or directories. Example: `gs://my-bucket/*` will authorize all allowlists under the `my-bucket` bucket.",
                      },
                    },
                    description:
                      "PrivilegedAdmissionConfig stores the list of authorized allowlist paths for the cluster.",
                    additionalProperties: true,
                  },
                  workloadPolicyConfig: {
                    type: "object",
                    properties: {
                      allowNetAdmin: {
                        type: "boolean",
                        description:
                          "If true, workloads can use NET_ADMIN capability.",
                      },
                      autopilotCompatibilityAuditingEnabled: {
                        type: "boolean",
                        description:
                          "If true, enables the GCW Auditor that audits workloads on standard clusters.",
                      },
                    },
                    description:
                      "WorkloadPolicyConfig is the configuration related to GCW workload policy",
                    additionalProperties: true,
                  },
                },
                description:
                  "Autopilot is the configuration for Autopilot settings on the cluster.",
                additionalProperties: true,
              },
              networkPolicy: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether network policy is enabled on the cluster.",
                  },
                  provider: {
                    type: "string",
                    enum: ["PROVIDER_UNSPECIFIED", "CALICO"],
                    description: "The selected network policy provider.",
                  },
                },
                description:
                  "Configuration options for the NetworkPolicy feature. https://kubernetes.io/docs/concepts/services-networking/networkpolicies/",
                additionalProperties: true,
              },
              nodeIpv4CidrSize: {
                type: "integer",
                description:
                  "Output only. The size of the address space on each node for hosting containers. This is provisioned from within the `container_ipv4_cidr` range. This field will only be set when cluster is in route-based network mode. (Format: int32)",
              },
              identityServiceConfig: {
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
              authenticatorGroupsConfig: {
                type: "object",
                properties: {
                  securityGroup: {
                    type: "string",
                    description:
                      "The name of the security group-of-groups to be used. Only relevant if enabled = true.",
                  },
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether this cluster should return group membership lookups during authentication using a group of security groups.",
                  },
                },
                description:
                  "Configuration for returning group information from authenticators.",
                additionalProperties: true,
              },
              binaryAuthorization: {
                type: "object",
                properties: {
                  evaluationMode: {
                    type: "string",
                    enum: [
                      "EVALUATION_MODE_UNSPECIFIED",
                      "DISABLED",
                      "PROJECT_SINGLETON_POLICY_ENFORCE",
                    ],
                    description:
                      "Mode of operation for binauthz policy evaluation. If unspecified, defaults to DISABLED.",
                  },
                  enabled: {
                    type: "boolean",
                    description:
                      "This field is deprecated. Leave this unset and instead configure BinaryAuthorization using evaluation_mode. If evaluation_mode is set to anything other than EVALUATION_MODE_UNSPECIFIED, this field is ignored.",
                  },
                },
                description: "Configuration for Binary Authorization.",
                additionalProperties: true,
              },
              alphaClusterFeatureGates: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'The list of user specified Kubernetes feature gates. Each string represents the activation status of a feature gate (e.g. "featureX=true" or "featureX=false")',
              },
              resourceUsageExportConfig: {
                type: "object",
                properties: {
                  consumptionMeteringConfig: {
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
                  bigqueryDestination: {
                    type: "object",
                    properties: {
                      datasetId: {
                        type: "string",
                        description: "The ID of a BigQuery Dataset.",
                      },
                    },
                    description:
                      "Parameters for using BigQuery as the destination of resource usage export.",
                    additionalProperties: true,
                  },
                  enableNetworkEgressMetering: {
                    type: "boolean",
                    description:
                      "Whether to enable network egress metering for this cluster. If enabled, a daemonset will be created in the cluster to meter network egress traffic.",
                  },
                },
                description:
                  "Configuration for exporting cluster resource usages.",
                additionalProperties: true,
              },
              privateClusterConfig: {
                type: "object",
                properties: {
                  publicEndpoint: {
                    type: "string",
                    description:
                      "Output only. The external IP address of this cluster's master endpoint. Deprecated:Use ControlPlaneEndpointsConfig.IPEndpointsConfig.public_endpoint instead.",
                  },
                  privateEndpointSubnetwork: {
                    type: "string",
                    description:
                      "Subnet to provision the master's private endpoint during cluster creation. Specified in projects/*/regions/*/subnetworks/* format. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint_subnetwork instead.",
                  },
                  peeringName: {
                    type: "string",
                    description:
                      "Output only. The peering name in the customer VPC used by this cluster.",
                  },
                  masterGlobalAccessConfig: {
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
                  enablePrivateNodes: {
                    type: "boolean",
                    description:
                      "Whether nodes have internal IP addresses only. If enabled, all nodes are given only RFC 1918 private addresses and communicate with the master via private networking. Deprecated: Use NetworkConfig.default_enable_private_nodes instead.",
                  },
                  privateEndpoint: {
                    type: "string",
                    description:
                      "Output only. The internal IP address of this cluster's master endpoint. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.private_endpoint instead.",
                  },
                  enablePrivateEndpoint: {
                    type: "boolean",
                    description:
                      "Whether the master's internal IP address is used as the cluster endpoint. Deprecated: Use ControlPlaneEndpointsConfig.IPEndpointsConfig.enable_public_endpoint instead. Note that the value of enable_public_endpoint is reversed: if enable_private_endpoint is false, then enable_public_endpoint will be true.",
                  },
                  masterIpv4CidrBlock: {
                    type: "string",
                    description:
                      "The IP range in CIDR notation to use for the hosted master network. This range will be used for assigning internal IP addresses to the master or set of masters, as well as the ILB VIP. This range must not overlap with any other ranges in use within the cluster's network.",
                  },
                },
                description: "Configuration options for private clusters.",
                additionalProperties: true,
              },
              statusMessage: {
                type: "string",
                description:
                  "Output only. Deprecated. Use conditions instead. Additional information about the current status of this cluster, if available.",
              },
              zone: {
                type: "string",
                description:
                  "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the cluster resides. This field is deprecated, use location instead.",
              },
              clusterIpv4Cidr: {
                type: "string",
                description:
                  "The IP address range of the container pods in this cluster, in [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation (e.g. `10.96.0.0/14`). Leave blank to have one automatically chosen or specify a `/14` block in `10.0.0.0/8`.",
              },
              location: {
                type: "string",
                description:
                  "Output only. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) or [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones#available) in which the cluster resides.",
              },
              monitoringConfig: {
                type: "object",
                properties: {
                  componentConfig: {
                    type: "object",
                    properties: {
                      enableComponents: {
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
                  managedPrometheusConfig: {
                    type: "object",
                    properties: {
                      autoMonitoringConfig: {
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
                      enabled: {
                        type: "boolean",
                        description: "Enable Managed Collection.",
                      },
                    },
                    description:
                      "ManagedPrometheusConfig defines the configuration for Google Cloud Managed Service for Prometheus.",
                    additionalProperties: true,
                  },
                  advancedDatapathObservabilityConfig: {
                    type: "object",
                    properties: {
                      enableRelay: {
                        type: "boolean",
                        description: "Enable Relay component",
                      },
                      relayMode: {
                        type: "string",
                        enum: [
                          "RELAY_MODE_UNSPECIFIED",
                          "DISABLED",
                          "INTERNAL_VPC_LB",
                          "EXTERNAL_LB",
                        ],
                        description: "Method used to make Relay available",
                      },
                      enableMetrics: {
                        type: "boolean",
                        description: "Expose flow metrics on nodes",
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
              createTime: {
                type: "string",
                description:
                  "Output only. The time the cluster was created, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
              },
              notificationConfig: {
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
                          eventType: {
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
              enableTpu: {
                type: "boolean",
                description:
                  "Enable the ability to use Cloud TPUs in this cluster. This field is deprecated due to the deprecation of 2VM TPU. The end of life date for 2VM TPU is 2025-04-25.",
              },
              anonymousAuthenticationConfig: {
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
              autoscaling: {
                type: "object",
                properties: {
                  autoscalingProfile: {
                    type: "string",
                    enum: [
                      "PROFILE_UNSPECIFIED",
                      "OPTIMIZE_UTILIZATION",
                      "BALANCED",
                    ],
                    description: "Defines autoscaling behaviour.",
                  },
                  autoprovisioningLocations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The list of Google Compute Engine [zones](https://cloud.google.com/compute/docs/zones#available) in which the NodePool's nodes can be created by NAP.",
                  },
                  defaultComputeClassConfig: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description: "Enables default compute class.",
                      },
                    },
                    description:
                      "DefaultComputeClassConfig defines default compute class configuration.",
                    additionalProperties: true,
                  },
                  resourceLimits: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        maximum: {
                          type: "string",
                          description:
                            "Maximum amount of the resource in the cluster. (Format: int64)",
                        },
                        resourceType: {
                          type: "string",
                          description:
                            'Resource name "cpu", "memory" or gpu-specific string.',
                        },
                        minimum: {
                          type: "string",
                          description:
                            "Minimum amount of the resource in the cluster. (Format: int64)",
                        },
                      },
                      description:
                        "Contains information about amount of some resource in the cluster. For memory, value should be in GB.",
                      additionalProperties: true,
                    },
                    description:
                      "Contains global constraints regarding minimum and maximum amount of resources in the cluster.",
                  },
                  enableNodeAutoprovisioning: {
                    type: "boolean",
                    description:
                      "Enables automatic node pool creation and deletion.",
                  },
                  autoprovisioningNodePoolDefaults: {
                    type: "object",
                    properties: {
                      serviceAccount: {
                        type: "string",
                        description:
                          "The Google Cloud Platform Service Account to be used by the node VMs.",
                      },
                      shieldedInstanceConfig: {
                        type: "object",
                        properties: {
                          enableSecureBoot: {
                            type: "boolean",
                            description:
                              "Defines whether the instance has Secure Boot enabled. Secure Boot helps ensure that the system only runs authentic software by verifying the digital signature of all boot components, and halting the boot process if signature verification fails.",
                          },
                          enableIntegrityMonitoring: {
                            type: "boolean",
                            description:
                              "Defines whether the instance has integrity monitoring enabled. Enables monitoring and attestation of the boot integrity of the instance. The attestation is performed against the integrity policy baseline. This baseline is initially derived from the implicitly trusted boot image when the instance is created.",
                          },
                        },
                        description: "A set of Shielded Instance options.",
                        additionalProperties: true,
                      },
                      management: {
                        type: "object",
                        properties: {
                          autoUpgrade: {
                            type: "boolean",
                            description:
                              "A flag that specifies whether node auto-upgrade is enabled for the node pool. If enabled, node auto-upgrade helps keep the nodes in your node pool up to date with the latest release version of Kubernetes.",
                          },
                          upgradeOptions: {
                            type: "object",
                            properties: {
                              description: {
                                type: "string",
                                description:
                                  "Output only. This field is set when upgrades are about to commence with the description of the upgrade.",
                              },
                              autoUpgradeStartTime: {
                                type: "string",
                                description:
                                  "Output only. This field is set when upgrades are about to commence with the approximate start time for the upgrades, in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) text format.",
                              },
                            },
                            description:
                              "AutoUpgradeOptions defines the set of options for the user to control how the Auto Upgrades will proceed.",
                            additionalProperties: true,
                          },
                          autoRepair: {
                            type: "boolean",
                            description:
                              "A flag that specifies whether the node auto-repair is enabled for the node pool. If enabled, the nodes in this node pool will be monitored and, if they fail health checks too many times, an automatic repair action will be triggered.",
                          },
                        },
                        description:
                          "NodeManagement defines the set of node management services turned on for the node pool.",
                        additionalProperties: true,
                      },
                      minCpuPlatform: {
                        type: "string",
                        description:
                          'Deprecated. Minimum CPU platform to be used for NAP created node pools. The instance may be scheduled on the specified or newer CPU platform. Applicable values are the friendly names of CPU platforms, such as minCpuPlatform: Intel Haswell or minCpuPlatform: Intel Sandy Bridge. For more information, read [how to specify min CPU platform](https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform). This field is deprecated, min_cpu_platform should be specified using `cloud.google.com/requested-min-cpu-platform` label selector on the pod. To unset the min cpu platform field pass "automatic" as field value.',
                      },
                      diskSizeGb: {
                        type: "integer",
                        description:
                          "Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB. If unspecified, the default disk size is 100GB. (Format: int32)",
                      },
                      bootDiskKmsKey: {
                        type: "string",
                        description:
                          "The Customer Managed Encryption Key used to encrypt the boot disk attached to each node in the node pool. This should be of the form projects/[KEY_PROJECT_ID]/locations/[LOCATION]/keyRings/[RING_NAME]/cryptoKeys/[KEY_NAME]. For more information about protecting resources with Cloud KMS Keys please see: https://cloud.google.com/compute/docs/disks/customer-managed-encryption",
                      },
                      imageType: {
                        type: "string",
                        description:
                          "The image type to use for NAP created node. Please see https://cloud.google.com/kubernetes-engine/docs/concepts/node-images for available image types.",
                      },
                      diskType: {
                        type: "string",
                        description:
                          "Type of the disk attached to each node (e.g. 'pd-standard', 'pd-ssd' or 'pd-balanced') If unspecified, the default disk type is 'pd-standard'",
                      },
                      insecureKubeletReadonlyPortEnabled: {
                        type: "boolean",
                        description:
                          "DEPRECATED. Use NodePoolAutoConfig.NodeKubeletConfig instead.",
                      },
                      oauthScopes: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Scopes that are used by NAP when creating node pools.",
                      },
                      upgradeSettings: {
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
                    },
                    description:
                      "AutoprovisioningNodePoolDefaults contains defaults for a node pool created by NAP.",
                    additionalProperties: true,
                  },
                },
                description:
                  "ClusterAutoscaling contains global, per-cluster information required by Cluster Autoscaler to automatically adjust the size of the cluster and create/delete node pools based on the current needs.",
                additionalProperties: true,
              },
              compliancePostureConfig: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    enum: ["MODE_UNSPECIFIED", "DISABLED", "ENABLED"],
                    description:
                      "Defines the enablement mode for Compliance Posture.",
                  },
                  complianceStandards: {
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
              id: {
                type: "string",
                description: "Output only. Unique id for the cluster.",
              },
              currentNodeVersion: {
                type: "string",
                description:
                  "Output only. Deprecated, use [NodePools.version](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters.nodePools) instead. The current version of the node software components. If they are currently at multiple versions because they're in the process of being upgraded, this reflects the minimum version of all nodes.",
              },
              loggingService: {
                type: "string",
                description:
                  "The logging service the cluster should use to write logs. Currently available options: * `logging.googleapis.com/kubernetes` - The Cloud Logging service with a Kubernetes-native resource model * `logging.googleapis.com` - The legacy Cloud Logging service (no longer available as of GKE 1.15). * `none` - no logs will be exported from the cluster. If left as an empty string,`logging.googleapis.com/kubernetes` will be used for GKE 1.14+ or `logging.googleapis.com` for earlier versions.",
              },
              confidentialNodes: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether Confidential Nodes feature is enabled.",
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
              selfLink: {
                type: "string",
                description:
                  "Output only. Server-defined URL for the resource.",
              },
              resourceLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "The resource labels for the cluster to use to annotate any related Google Compute Engine resources.",
              },
              loggingConfig: {
                type: "object",
                properties: {
                  componentConfig: {
                    type: "object",
                    properties: {
                      enableComponents: {
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
              conditions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description:
                        "Human-friendly representation of the condition",
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
                  "Which conditions caused the current cluster state.",
              },
              securityPostureConfig: {
                type: "object",
                properties: {
                  vulnerabilityMode: {
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
                },
                description:
                  "SecurityPostureConfig defines the flags needed to enable/disable features for the Security Posture API.",
                additionalProperties: true,
              },
              currentMasterVersion: {
                type: "string",
                description:
                  "Output only. The current software version of the master endpoint.",
              },
            },
            description: "A Google Kubernetes Engine cluster.",
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
        let path = `v1/projects/{projectId}/zones/{zone}/clusters`;

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
        if (input.event.inputConfig.parent !== undefined)
          requestBody.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.cluster !== undefined)
          requestBody.cluster = input.event.inputConfig.cluster;

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

export default clustersCreate;
