import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const instanceGroupManagersPatch: AppBlock = {
  name: "Instance Group Managers - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Instance Group Managers",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "Output only. [Output Only] The URL of azone where the managed instance group is located (for zonal resources).",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of azone where the managed instance group is located (for zonal resources).",
          },
          required: false,
        },
        instanceGroupManager: {
          name: "Instance Group Manager",
          description: "The name of the instance group manager.",
          type: {
            type: "string",
            description: "The name of the instance group manager.",
          },
          required: true,
        },
        allInstancesConfig: {
          name: "All Instances Config",
          description:
            "Specifies configuration that overrides the instance template configuration for the group.",
          type: {
            type: "object",
            properties: {
              properties: {
                type: "object",
                properties: {
                  labels: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "The label key-value pairs that you want to patch onto the instance.",
                  },
                  metadata: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "The metadata key-value pairs that you want to patch onto the instance. For more information, see Project and instance metadata.",
                  },
                },
                description:
                  "Represents the change that you want to make to the instance properties.",
                additionalProperties: true,
              },
            },
            additionalProperties: true,
            description:
              "Specifies configuration that overrides the instance template configuration for the group.",
          },
          required: false,
        },
        autoHealingPolicies: {
          name: "Auto Healing Policies",
          description:
            "The autohealing policy for this managed instance group. You can specify only one value.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                healthCheck: {
                  type: "string",
                  description:
                    "The URL for the health check that signals autohealing.",
                },
                initialDelaySec: {
                  type: "integer",
                  description:
                    "The initial delay is the number of seconds that a new VM takes to initialize and run its startup script. During a VM's initial delay period, the MIG ignores unsuccessful health checks because the VM might be in the startup process. This prevents the MIG from prematurely recreating a VM. If the health check receives a healthy response during the initial delay, it indicates that the startup process is complete and the VM is ready. The value of initial delay must be between 0 and 3600 seconds. The default value is 0.",
                },
              },
              additionalProperties: true,
            },
            description:
              "The autohealing policy for this managed instance group. You can specify only one value.",
          },
          required: false,
        },
        baseInstanceName: {
          name: "Base Instance Name",
          description:
            'The base instance name is a prefix that you want to attach to the names of all VMs in a MIG. The maximum character length is 58 and the name must comply with RFC1035 format.  When a VM is created in the group, the MIG appends a hyphen and a random four-character string to the base instance name. If you want the MIG to assign sequential numbers instead of a random string, then end the base instance name with a hyphen followed by one or more hash symbols. The hash symbols indicate the number of digits. For example, a base instance name of "vm-###" results in "vm-001" as a VM name. @pattern [a-z](([-a-z0-9]{0,57})|([-a-z0-9]{0,51}-#{1,10}(\\\\[[0-9]{1,10}\\\\])?))',
          type: {
            type: "string",
            description:
              'The base instance name is a prefix that you want to attach to the names of all VMs in a MIG. The maximum character length is 58 and the name must comply with RFC1035 format.  When a VM is created in the group, the MIG appends a hyphen and a random four-character string to the base instance name. If you want the MIG to assign sequential numbers instead of a random string, then end the base instance name with a hyphen followed by one or more hash symbols. The hash symbols indicate the number of digits. For example, a base instance name of "vm-###" results in "vm-001" as a VM name. @pattern [a-z](([-a-z0-9]{0,57})|([-a-z0-9]{0,51}-#{1,10}(\\\\[[0-9]{1,10}\\\\])?))',
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] The creation timestamp for this managed instance group inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The creation timestamp for this managed instance group inRFC3339 text format.",
          },
          required: false,
        },
        currentActions: {
          name: "Current Actions",
          description:
            "Output only. [Output Only] The list of instance actions and the number of instances in this managed instance group that are scheduled for each of those actions.",
          type: {
            type: "object",
            properties: {
              abandoning: {
                type: "integer",
                description:
                  "Output only. [Output Only] The total number of instances in the managed instance group that are scheduled to be abandoned. Abandoning an instance removes it from the managed instance group without deleting it.",
              },
              creating: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be created or are currently being created. If the group fails to create any of these instances, it tries again until it creates the instance successfully.  If you have disabled creation retries, this field will not be populated; instead, the creatingWithoutRetries field will be populated.",
              },
              creatingWithoutRetries: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances that the managed instance group will attempt to create. The group attempts to create each instance only once. If the group fails to create any of these instances, it decreases the group's targetSize value accordingly.",
              },
              deleting: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be deleted or are currently being deleted.",
              },
              none: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are running and have no scheduled actions.",
              },
              recreating: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be recreated or are currently being being recreated. Recreating an instance deletes the existing root persistent disk and creates a new disk from the image that is defined in the instance template.",
              },
              refreshing: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are being reconfigured with properties that do not require a restart or a recreate action. For example, setting or removing target pools for the instance.",
              },
              restarting: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be restarted or are currently being restarted.",
              },
              resuming: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be resumed or are currently being resumed.",
              },
              starting: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be started or are currently being started.",
              },
              stopping: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be stopped or are currently being stopped.",
              },
              suspending: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are scheduled to be suspended or are currently being suspended.",
              },
              verifying: {
                type: "integer",
                description:
                  "Output only. [Output Only] The number of instances in the managed instance group that are being verified. See the managedInstances[].currentAction property in the listManagedInstances method documentation.",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] The list of instance actions and the number of instances in this managed instance group that are scheduled for each of those actions.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description: "An optional description of this resource.",
          },
          required: false,
        },
        distributionPolicy: {
          name: "Distribution Policy",
          description:
            "Policy specifying the intended distribution of managed instances across zones in a regional managed instance group.",
          type: {
            type: "object",
            properties: {
              targetShape: {
                type: "string",
                enum: [
                  "UNDEFINED_TARGET_SHAPE",
                  "ANY",
                  "ANY_SINGLE_ZONE",
                  "BALANCED",
                  "EVEN",
                ],
                description:
                  "The distribution shape to which the group converges either proactively or on resize events (depending on the value set inupdatePolicy.instanceRedistributionType). Check the TargetShape enum for the list of possible values.",
              },
              zones: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    zone: {
                      type: "string",
                      description:
                        "The URL of thezone. The zone must exist in the region where the managed instance group is located.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Zones where the regional managed instance group will create and manage its instances.",
              },
            },
            additionalProperties: true,
            description:
              "Policy specifying the intended distribution of managed instances across zones in a regional managed instance group.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint of this resource. This field may be used in optimistic locking. It will be ignored when inserting an InstanceGroupManager. An up-to-date fingerprint must be provided in order to update the InstanceGroupManager, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an InstanceGroupManager.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. This field may be used in optimistic locking. It will be ignored when inserting an InstanceGroupManager. An up-to-date fingerprint must be provided in order to update the InstanceGroupManager, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an InstanceGroupManager.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] A unique identifier for this resource type. The server generates this identifier.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        instanceFlexibilityPolicy: {
          name: "Instance Flexibility Policy",
          description:
            "Instance flexibility allowing MIG to create VMs from multiple types of machines. Instance flexibility configuration on MIG overrides instance template configuration.",
          type: {
            type: "object",
            properties: {
              instanceSelections: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Named instance selections configuring properties that the group will use when creating new VMs.",
              },
            },
            additionalProperties: true,
            description:
              "Instance flexibility allowing MIG to create VMs from multiple types of machines. Instance flexibility configuration on MIG overrides instance template configuration.",
          },
          required: false,
        },
        instanceGroup: {
          name: "Instance Group",
          description:
            "Output only. [Output Only] The URL of the Instance Group resource.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of the Instance Group resource.",
          },
          required: false,
        },
        instanceLifecyclePolicy: {
          name: "Instance Lifecycle Policy",
          description: "The repair policy for this managed instance group.",
          type: {
            type: "object",
            properties: {
              defaultActionOnFailure: {
                type: "string",
                enum: [
                  "UNDEFINED_DEFAULT_ACTION_ON_FAILURE",
                  "DO_NOTHING",
                  "REPAIR",
                ],
                description:
                  "The action that a MIG performs on a failed or an unhealthy VM. A VM is marked as unhealthy when the application running on that VM fails a health check. Valid values are     - REPAIR (default): MIG automatically repairs a failed or    an unhealthy VM by recreating it. For more information, see About    repairing VMs in a MIG.    - DO_NOTHING: MIG does not repair a failed or an unhealthy    VM. Check the DefaultActionOnFailure enum for the list of possible values.",
              },
              forceUpdateOnRepair: {
                type: "string",
                enum: ["UNDEFINED_FORCE_UPDATE_ON_REPAIR", "NO", "YES"],
                description:
                  "A bit indicating whether to forcefully apply the group's latest configuration when repairing a VM. Valid options are:         -  NO (default): If configuration updates are available, they are not      forcefully applied during repair. Instead, configuration updates are      applied according to the group's update policy.       -  YES: If configuration updates are available, they are applied      during repair. Check the ForceUpdateOnRepair enum for the list of possible values.",
              },
            },
            additionalProperties: true,
            description: "The repair policy for this managed instance group.",
          },
          required: false,
        },
        instanceTemplate: {
          name: "Instance Template",
          description:
            "The URL of the instance template that is specified for this managed instance group. The group uses this template to create all new instances in the managed instance group. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE.",
          type: {
            type: "string",
            description:
              "The URL of the instance template that is specified for this managed instance group. The group uses this template to create all new instances in the managed instance group. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] The resource type, which is alwayscompute#instanceGroupManager for managed instance groups.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The resource type, which is alwayscompute#instanceGroupManager for managed instance groups.",
          },
          required: false,
        },
        listManagedInstancesResults: {
          name: "List Managed Instances Results",
          description:
            "Pagination behavior of the listManagedInstances API method for this managed instance group. Check the ListManagedInstancesResults enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_LIST_MANAGED_INSTANCES_RESULTS",
              "PAGELESS",
              "PAGINATED",
            ],
            description:
              "Pagination behavior of the listManagedInstances API method for this managed instance group. Check the ListManagedInstancesResults enum for the list of possible values.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name of the managed instance group. The name must be 1-63 characters long, and comply withRFC1035.",
          type: {
            type: "string",
            description:
              "The name of the managed instance group. The name must be 1-63 characters long, and comply withRFC1035.",
          },
          required: false,
        },
        namedPorts: {
          name: "Named Ports",
          description:
            "[Output Only] Named ports configured on the Instance Groups complementary to this Instance Group Manager.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name for this named port. The name must be 1-63 characters long, and comply withRFC1035.",
                },
                port: {
                  type: "integer",
                  description:
                    "The port number, which can be a value between 1 and 65535.",
                },
              },
              description: 'The named port. For example: <"http", 80>.',
              additionalProperties: true,
            },
            description:
              "[Output Only] Named ports configured on the Instance Groups complementary to this Instance Group Manager.",
          },
          required: false,
        },
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] The URL of theregion where the managed instance group resides (for regional resources).",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of theregion where the managed instance group resides (for regional resources).",
          },
          required: false,
        },
        resourcePolicies: {
          name: "Resource Policies",
          description: "Resource policies for this managed instance group.",
          type: {
            type: "object",
            properties: {
              workloadPolicy: {
                type: "string",
                description:
                  "The URL of the workload policy that is specified for this managed instance group. It can be a full or partial URL. For example, the following are all valid URLs to a workload policy:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/resourcePolicies/resourcePolicy       - projects/project/regions/region/resourcePolicies/resourcePolicy       - regions/region/resourcePolicies/resourcePolicy",
              },
            },
            additionalProperties: true,
            description: "Resource policies for this managed instance group.",
          },
          required: false,
        },
        satisfiesPzi: {
          name: "Satisfies Pzi",
          description: "Output only. [Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          required: false,
        },
        satisfiesPzs: {
          name: "Satisfies Pzs",
          description: "Output only. [Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description:
            "Output only. [Output Only] The URL for this managed instance group. The server defines this URL.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The URL for this managed instance group. The server defines this URL.",
          },
          required: false,
        },
        standbyPolicy: {
          name: "Standby Policy",
          description: "Standby policy for stopped and suspended instances.",
          type: {
            type: "object",
            properties: {
              initialDelaySec: {
                type: "integer",
                description:
                  "Specifies the number of seconds that the MIG should wait to suspend or stop a VM after that VM was created. The initial delay gives the initialization script the time to prepare your VM for a quick scale out. The value of initial delay must be between 0 and 3600 seconds. The default value is 0.",
              },
              mode: {
                type: "string",
                enum: ["UNDEFINED_MODE", "MANUAL", "SCALE_OUT_POOL"],
                description:
                  "Defines how a MIG resumes or starts VMs from a standby pool when the group scales out. The default mode is `MANUAL`. Check the Mode enum for the list of possible values.",
              },
            },
            additionalProperties: true,
            description: "Standby policy for stopped and suspended instances.",
          },
          required: false,
        },
        statefulPolicy: {
          name: "Stateful Policy",
          description:
            "Stateful configuration for this Instanced Group Manager",
          type: {
            type: "object",
            properties: {
              preservedState: {
                type: "object",
                properties: {
                  disks: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Disks created on the instances that will be preserved on instance delete, update, etc. This map is keyed with the device names of the disks.",
                  },
                  externalIPs: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "External network IPs assigned to the instances that will be preserved on instance delete, update, etc. This map is keyed with the network interface name.",
                  },
                  internalIPs: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Internal network IPs assigned to the instances that will be preserved on instance delete, update, etc. This map is keyed with the network interface name.",
                  },
                },
                description: "Configuration of preserved resources.",
                additionalProperties: true,
              },
            },
            additionalProperties: true,
            description:
              "Stateful configuration for this Instanced Group Manager",
          },
          required: false,
        },
        status: {
          name: "Status",
          description:
            "Output only. [Output Only] The status of this managed instance group.",
          type: {
            type: "object",
            properties: {
              allInstancesConfig: {
                type: "object",
                properties: {
                  currentRevision: {
                    type: "string",
                    description:
                      "Output only. [Output Only] Current all-instances configuration revision. This value is in RFC3339 text format.",
                  },
                  effective: {
                    type: "boolean",
                    description:
                      "Output only. [Output Only] A bit indicating whether this configuration has been applied to all managed instances in the group.",
                  },
                },
                additionalProperties: true,
                description:
                  "Output only. [Output only] Status of all-instances configuration on the group.",
              },
              autoscaler: {
                type: "string",
                description:
                  "Output only. [Output Only] The URL of theAutoscaler that targets this instance group manager.",
              },
              isStable: {
                type: "boolean",
                description:
                  "Output only. [Output Only] A bit indicating whether the managed instance group is in a stable state. A stable state means that: none of the instances in the managed instance group is currently undergoing any type of change (for example, creation, restart, or deletion); no future changes are scheduled for instances in the managed instance group; and the managed instance group itself is not being modified.",
              },
              stateful: {
                type: "object",
                properties: {
                  hasStatefulConfig: {
                    type: "boolean",
                    description:
                      "Output only. [Output Only] A bit indicating whether the managed instance group has stateful configuration, that is, if you have configured any items in a stateful policy or in per-instance configs. The group might report that it has no stateful configuration even when there is still some preserved state on a managed instance, for example, if you have deleted all PICs but not yet applied those deletions.",
                  },
                  perInstanceConfigs: {
                    type: "object",
                    properties: {
                      allEffective: {
                        type: "boolean",
                        description:
                          "Output only. A bit indicating if all of the group's per-instance configurations (listed in the output of a listPerInstanceConfigs API call) have status EFFECTIVE or there are no per-instance-configs.",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "Output only. [Output Only] Status of per-instance configurations on the instances.",
                  },
                },
                additionalProperties: true,
                description:
                  "Output only. [Output Only] Stateful status of the given Instance Group Manager.",
              },
              versionTarget: {
                type: "object",
                properties: {
                  isReached: {
                    type: "boolean",
                    description:
                      "Output only. [Output Only] A bit indicating whether version target has been reached in this managed instance group, i.e. all instances are in their target version. Instances' target version are specified byversion field on Instance Group Manager.",
                  },
                },
                additionalProperties: true,
                description:
                  "Output only. [Output Only] A status of consistency of Instances' versions with their target version specified by version field on Instance Group Manager.",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] The status of this managed instance group.",
          },
          required: false,
        },
        targetPools: {
          name: "Target Pools",
          description:
            "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added. The target pools automatically apply to all of the instances in the managed instance group.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added. The target pools automatically apply to all of the instances in the managed instance group.",
          },
          required: false,
        },
        targetSize: {
          name: "Target Size",
          description:
            "The target number of running instances for this managed instance group. You can reduce this number by using the instanceGroupManager deleteInstances or abandonInstances methods. Resizing the group also changes this number.",
          type: {
            type: "integer",
            description:
              "The target number of running instances for this managed instance group. You can reduce this number by using the instanceGroupManager deleteInstances or abandonInstances methods. Resizing the group also changes this number.",
          },
          required: false,
        },
        targetStoppedSize: {
          name: "Target Stopped Size",
          description:
            "The target number of stopped instances for this managed instance group. This number changes when you:     - Stop instance using the stopInstances    method or start instances using the startInstances    method.    - Manually change the targetStoppedSize using the update    method.",
          type: {
            type: "integer",
            description:
              "The target number of stopped instances for this managed instance group. This number changes when you:     - Stop instance using the stopInstances    method or start instances using the startInstances    method.    - Manually change the targetStoppedSize using the update    method.",
          },
          required: false,
        },
        targetSuspendedSize: {
          name: "Target Suspended Size",
          description:
            "The target number of suspended instances for this managed instance group. This number changes when you:     - Suspend instance using the suspendInstances    method or resume instances using the resumeInstances    method.    - Manually change the targetSuspendedSize using the update    method.",
          type: {
            type: "integer",
            description:
              "The target number of suspended instances for this managed instance group. This number changes when you:     - Suspend instance using the suspendInstances    method or resume instances using the resumeInstances    method.    - Manually change the targetSuspendedSize using the update    method.",
          },
          required: false,
        },
        updatePolicy: {
          name: "Update Policy",
          description: "The update policy for this managed instance group.",
          type: {
            type: "object",
            properties: {
              instanceRedistributionType: {
                type: "string",
                enum: ["UNDEFINED_INSTANCE_REDISTRIBUTION_TYPE"],
                description:
                  "The instance redistribution policy for regional managed instance groups. Valid values are:     - PROACTIVE (default): The group attempts to maintain an    even distribution of VM instances across zones in the region.    - NONE: For non-autoscaled groups, proactive    redistribution is disabled. Check the InstanceRedistributionType enum for the list of possible values.",
              },
              maxSurge: {
                type: "object",
                properties: {
                  calculated: {
                    type: "integer",
                    description:
                      "Output only. [Output Only] Absolute value of VM instances calculated based on the specific mode.        - If the value is fixed, then the calculated      value is equal to the fixed value.     - If the value is a percent, then the     calculated      value is percent/100 * targetSize. For example,      the calculated value of a 80% of a managed instance group      with 150 instances would be (80/100 * 150) = 120 VM instances. If there      is a remainder, the number is rounded.",
                  },
                  fixed: {
                    type: "integer",
                    description:
                      "Specifies a fixed number of VM instances. This must be a positive integer.",
                  },
                  percent: {
                    type: "integer",
                    description:
                      "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
                  },
                },
                description:
                  "Encapsulates numeric value that can be either absolute or relative.",
                additionalProperties: true,
              },
              maxUnavailable: {
                type: "object",
                properties: {
                  calculated: {
                    type: "integer",
                    description:
                      "Output only. [Output Only] Absolute value of VM instances calculated based on the specific mode.        - If the value is fixed, then the calculated      value is equal to the fixed value.     - If the value is a percent, then the     calculated      value is percent/100 * targetSize. For example,      the calculated value of a 80% of a managed instance group      with 150 instances would be (80/100 * 150) = 120 VM instances. If there      is a remainder, the number is rounded.",
                  },
                  fixed: {
                    type: "integer",
                    description:
                      "Specifies a fixed number of VM instances. This must be a positive integer.",
                  },
                  percent: {
                    type: "integer",
                    description:
                      "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
                  },
                },
                description:
                  "Encapsulates numeric value that can be either absolute or relative.",
                additionalProperties: true,
              },
              minimalAction: {
                type: "string",
                enum: ["UNDEFINED_MINIMAL_ACTION"],
                description:
                  "Minimal action to be taken on an instance. Use this option to minimize disruption as much as possible or to apply a more disruptive action than is necessary.     - To limit disruption as much as possible, set the minimal action toREFRESH. If your update requires a more disruptive action,    Compute Engine performs the necessary action to execute the update.    - To apply a more disruptive action than is strictly necessary, set the    minimal action to RESTART or REPLACE. For    example, Compute Engine does not need to restart a VM to change its    metadata. But if your application reads instance metadata only when a VM    is restarted, you can set the minimal action to RESTART in    order to pick up metadata changes. Check the MinimalAction enum for the list of possible values.",
              },
              mostDisruptiveAllowedAction: {
                type: "string",
                enum: ["UNDEFINED_MOST_DISRUPTIVE_ALLOWED_ACTION"],
                description:
                  "Most disruptive action that is allowed to be taken on an instance. You can specify either NONE to forbid any actions,REFRESH to avoid restarting the VM and to limit disruption as much as possible. RESTART to allow actions that can be applied without instance replacing or REPLACE to allow all possible actions. If the Updater determines that the minimal update action needed is more disruptive than most disruptive allowed action you specify it will not perform the update at all. Check the MostDisruptiveAllowedAction enum for the list of possible values.",
              },
              replacementMethod: {
                type: "string",
                enum: [
                  "UNDEFINED_REPLACEMENT_METHOD",
                  "RECREATE",
                  "SUBSTITUTE",
                ],
                description:
                  "What action should be used to replace instances. See minimal_action.REPLACE Check the ReplacementMethod enum for the list of possible values.",
              },
              type: {
                type: "string",
                enum: ["UNDEFINED_TYPE", "OPPORTUNISTIC"],
                description:
                  "The type of update process. You can specify either PROACTIVE so that the MIG automatically updates VMs to the latest configurations orOPPORTUNISTIC so that you can select the VMs that you want to update. Check the Type enum for the list of possible values.",
              },
            },
            additionalProperties: true,
            description: "The update policy for this managed instance group.",
          },
          required: false,
        },
        versions: {
          name: "Versions",
          description:
            "Specifies the instance templates used by this managed instance group to create instances.  Each version is defined by an instanceTemplate and aname. Every version can appear at most once per instance group. This field overrides the top-level instanceTemplate field. Read more about therelationships between these fields. Exactly one version must leave thetargetSize field unset. That version will be applied to all remaining instances. For more information, read aboutcanary updates.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                instanceTemplate: {
                  type: "string",
                  description:
                    "The URL of the instance template that is specified for this managed instance group. The group uses this template to create new instances in the managed instance group until the `targetSize` for this version is reached. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE; in those cases, existing instances are updated until the `targetSize` for this version is reached.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the version. Unique among all versions in the scope of this managed instance group.",
                },
                targetSize: {
                  type: "object",
                  properties: {
                    calculated: {
                      type: "integer",
                      description:
                        "Output only. [Output Only] Absolute value of VM instances calculated based on the specific mode.        - If the value is fixed, then the calculated      value is equal to the fixed value.     - If the value is a percent, then the     calculated      value is percent/100 * targetSize. For example,      the calculated value of a 80% of a managed instance group      with 150 instances would be (80/100 * 150) = 120 VM instances. If there      is a remainder, the number is rounded.",
                    },
                    fixed: {
                      type: "integer",
                      description:
                        "Specifies a fixed number of VM instances. This must be a positive integer.",
                    },
                    percent: {
                      type: "integer",
                      description:
                        "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
                    },
                  },
                  description:
                    "Encapsulates numeric value that can be either absolute or relative.",
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
            },
            description:
              "Specifies the instance templates used by this managed instance group to create instances.  Each version is defined by an instanceTemplate and aname. Every version can appear at most once per instance group. This field overrides the top-level instanceTemplate field. Read more about therelationships between these fields. Exactly one version must leave thetargetSize field unset. That version will be applied to all remaining instances. For more information, read aboutcanary updates.",
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
            description:
              "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.instanceGroupManager !== undefined)
          pathParams["instance_group_manager"] = String(
            input.event.inputConfig.instanceGroupManager,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.allInstancesConfig !== undefined)
          body.allInstancesConfig = input.event.inputConfig.allInstancesConfig;
        if (input.event.inputConfig.autoHealingPolicies !== undefined)
          body.autoHealingPolicies =
            input.event.inputConfig.autoHealingPolicies;
        if (input.event.inputConfig.baseInstanceName !== undefined)
          body.baseInstanceName = input.event.inputConfig.baseInstanceName;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.currentActions !== undefined)
          body.currentActions = input.event.inputConfig.currentActions;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.distributionPolicy !== undefined)
          body.distributionPolicy = input.event.inputConfig.distributionPolicy;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.instanceFlexibilityPolicy !== undefined)
          body.instanceFlexibilityPolicy =
            input.event.inputConfig.instanceFlexibilityPolicy;
        if (input.event.inputConfig.instanceGroup !== undefined)
          body.instanceGroup = input.event.inputConfig.instanceGroup;
        if (input.event.inputConfig.instanceLifecyclePolicy !== undefined)
          body.instanceLifecyclePolicy =
            input.event.inputConfig.instanceLifecyclePolicy;
        if (input.event.inputConfig.instanceTemplate !== undefined)
          body.instanceTemplate = input.event.inputConfig.instanceTemplate;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.listManagedInstancesResults !== undefined)
          body.listManagedInstancesResults =
            input.event.inputConfig.listManagedInstancesResults;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.namedPorts !== undefined)
          body.namedPorts = input.event.inputConfig.namedPorts;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.resourcePolicies !== undefined)
          body.resourcePolicies = input.event.inputConfig.resourcePolicies;
        if (input.event.inputConfig.satisfiesPzi !== undefined)
          body.satisfiesPzi = input.event.inputConfig.satisfiesPzi;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          body.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.standbyPolicy !== undefined)
          body.standbyPolicy = input.event.inputConfig.standbyPolicy;
        if (input.event.inputConfig.statefulPolicy !== undefined)
          body.statefulPolicy = input.event.inputConfig.statefulPolicy;
        if (input.event.inputConfig.status !== undefined)
          body.status = input.event.inputConfig.status;
        if (input.event.inputConfig.targetPools !== undefined)
          body.targetPools = input.event.inputConfig.targetPools;
        if (input.event.inputConfig.targetSize !== undefined)
          body.targetSize = input.event.inputConfig.targetSize;
        if (input.event.inputConfig.targetStoppedSize !== undefined)
          body.targetStoppedSize = input.event.inputConfig.targetStoppedSize;
        if (input.event.inputConfig.targetSuspendedSize !== undefined)
          body.targetSuspendedSize =
            input.event.inputConfig.targetSuspendedSize;
        if (input.event.inputConfig.updatePolicy !== undefined)
          body.updatePolicy = input.event.inputConfig.updatePolicy;
        if (input.event.inputConfig.versions !== undefined)
          body.versions = input.event.inputConfig.versions;
        if (input.event.inputConfig.zone !== undefined)
          body.zone = input.event.inputConfig.zone;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instanceGroupManagers/{instance_group_manager}",
          pathParams,
          queryParams,
          body: Object.keys(body).length > 0 ? body : undefined,
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
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339 text format.",
          },
          error: {
            type: "object",
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      description:
                        "[Output Only] The error type identifier for this error.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          errorInfo: {
                            type: "object",
                            properties: {
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain is typically the registered service name of the tool or product that generates the error. Example: "pubsub.googleapis.com". If the error is generated by some common infrastructure, the error domain must be a globally unique value that identifies the infrastructure. For Google API infrastructure, the error domain is "googleapis.com".',
                              },
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.  Keys must match a regular expression of `a-z+` but should ideally be lowerCamelCase. Also, they must be limited to 64 characters in length. When identifying the current value of an exceeded limit, the units should be contained in the key, not the value.  For example, rather than `{"instanceLimit": "100/request"}`, should be returned as, `{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of instances that can be created in a single (batch) request.',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the proximate cause of the error. Error reasons are unique within a particular domain of errors. This should be at most 63 characters and match a regular expression of `A-Z+[A-Z0-9]`, which represents UPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.  Example of an error when contacting the "pubsub.googleapis.com" API when it is not enabled:      { "reason": "API_DISABLED"       "domain": "googleapis.com"       "metadata": {         "resource": "projects/123",         "service": "pubsub.googleapis.com"       }     }  This response indicates that the pubsub.googleapis.com API is not enabled.  Example of an error that is returned when attempting to create a Spanner instance in a region that is out of stock:      { "reason": "STOCKOUT"       "domain": "spanner.googleapis.com",       "metadata": {         "availableRegions": "us-central1,us-east2"       }     }',
                            additionalProperties: true,
                          },
                          help: {
                            type: "object",
                            properties: {
                              links: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                  },
                                  description: "Describes a URL link.",
                                  additionalProperties: true,
                                },
                                description:
                                  "URL(s) pointing to additional information on handling the current error.",
                              },
                            },
                            description:
                              "Provides links to documentation or for performing an out of band action.  For example, if a quota check failed with an error indicating the calling project hasn't enabled the accessed service, this can contain a URL pointing directly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                          localizedMessage: {
                            type: "object",
                            properties: {
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at https://www.rfc-editor.org/rfc/bcp/bcp47.txt. Examples are: "en-US", "fr-CH", "es-MX"',
                              },
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user which can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_ROLLOUT_STATUS",
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit. Check the RolloutStatus enum for the list of possible values.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error details. There is a set of defined message types to use for providing details.The syntax depends on the error code. For example, QuotaExceededInfo will have details when the error code is QUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error. This property is optional.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this operation.",
              },
            },
            description:
              "Output only. Errors that prevented the ResizeRequest to be fulfilled.",
            additionalProperties: true,
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always `compute#operation` for Operation resources.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          operationGroupId: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`, `update`, or `delete`, and so on.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only applicable when performing regional operations.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "[Output Only] Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] If the operation is for projects.setCommonInstanceMetadata, this field will contain information on all underlying zonal actions and their state.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server. This value is inRFC3339 text format.",
          },
          status: {
            type: "string",
            enum: ["UNDEFINED_STATUS", "DONE", "PENDING", "RUNNING"],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          targetId: {
            type: "string",
            description: "64-bit integer as string",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the disk that the snapshot was created from.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example: `user@example.com` or `alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "UNDEFINED_CODE",
                    "CLEANUP_FAILED",
                    "DEPRECATED_RESOURCE_USED",
                    "DEPRECATED_TYPE_USED",
                    "DISK_SIZE_LARGER_THAN_IMAGE_SIZE",
                    "EXPERIMENTAL_TYPE_USED",
                    "EXTERNAL_API_WARNING",
                    "FIELD_VALUE_OVERRIDEN",
                    "INJECTED_KERNELS_DEPRECATED",
                    "INVALID_HEALTH_CHECK_FOR_DYNAMIC_WIEGHTED_LB",
                    "LARGE_DEPLOYMENT_WARNING",
                    "LIST_OVERHEAD_QUOTA_EXCEED",
                    "MISSING_TYPE_DEPENDENCY",
                    "NEXT_HOP_ADDRESS_NOT_ASSIGNED",
                    "NEXT_HOP_CANNOT_IP_FORWARD",
                    "NEXT_HOP_INSTANCE_HAS_NO_IPV6_INTERFACE",
                    "NEXT_HOP_INSTANCE_NOT_FOUND",
                    "NEXT_HOP_INSTANCE_NOT_ON_NETWORK",
                    "NEXT_HOP_NOT_RUNNING",
                    "NOT_CRITICAL_ERROR",
                    "NO_RESULTS_ON_PAGE",
                    "PARTIAL_SUCCESS",
                    "QUOTA_INFO_UNAVAILABLE",
                    "REQUIRED_TOS_AGREEMENT",
                    "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING",
                    "RESOURCE_NOT_DELETED",
                    "SCHEMA_VALIDATION_IGNORED",
                    "SINGLE_INSTANCE_PROPERTY_TEMPLATE",
                    "UNDECLARED_PROPERTIES",
                    "UNREACHABLE",
                  ],
                  description:
                    "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
                      },
                      value: {
                        type: "string",
                        description:
                          "[Output Only] A warning data value corresponding to the key.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                },
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the operation, this field will be populated.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only applicable when performing per-zone operations.",
          },
        },
        description:
          "Represents an Operation resource.  Google Compute Engine has three Operation resources:  * [Global](/compute/docs/reference/rest/v1/globalOperations) * [Regional](/compute/docs/reference/rest/v1/regionOperations) * [Zonal](/compute/docs/reference/rest/v1/zoneOperations)  You can use an operation resource to manage asynchronous API requests. For more information, readHandling API responses.  Operations can be global, regional or zonal.     - For global operations, use the `globalOperations`    resource.    - For regional operations, use the    `regionOperations` resource.    - For zonal operations, use    the `zoneOperations` resource.    For more information, read Global, Regional, and Zonal Resources.  Note that completed Operation resources have a limited retention period.",
        additionalProperties: true,
      },
    },
  },
};

export default instanceGroupManagersPatch;
