import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instanceGroupManagersInsert: AppBlock = {
  name: "Instance Group Managers - Insert",
  description: `Creates a managed instance group using the information that you specify in the request.`,
  category: "Instance Group Managers",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "[Output Only] The URL of azone where the managed instance group is located (for zonal resources).",
          type: {
            type: "string",
            description:
              "[Output Only] The URL of azone\nwhere the managed instance group is located (for zonal resources).",
          },
          required: false,
        },
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        updatePolicy: {
          name: "Update Policy",
          description: "The update policy for this managed instance group.",
          type: {
            type: "object",
            properties: {
              maxSurge: {
                type: "object",
                properties: {
                  fixed: {
                    type: "integer",
                    description:
                      "Specifies a fixed number of VM instances. This must be a positive integer. (Format: int32)",
                  },
                  calculated: {
                    type: "integer",
                    description:
                      "[Output Only] Absolute value of VM instances calculated based on the\nspecific mode.\n\n   \n   \n    - If the value is fixed, then the calculated\n     value is equal to the fixed value.\n    - If the value is a percent, then the\n    calculated\n     value is percent/100 * targetSize. For example,\n     the calculated value of a 80% of a managed instance group\n     with 150 instances would be (80/100 * 150) = 120 VM instances. If there\n     is a remainder, the number is rounded. (Format: int32)",
                  },
                  percent: {
                    type: "integer",
                    description:
                      "Specifies a percentage of instances between 0 to 100%, inclusive. For\nexample, specify 80 for 80%. (Format: int32)",
                  },
                },
                description:
                  "Encapsulates numeric value that can be either absolute or relative.",
                additionalProperties: true,
              },
              maxUnavailable: {
                type: "object",
                properties: {
                  fixed: {
                    type: "integer",
                    description:
                      "Specifies a fixed number of VM instances. This must be a positive integer. (Format: int32)",
                  },
                  calculated: {
                    type: "integer",
                    description:
                      "[Output Only] Absolute value of VM instances calculated based on the\nspecific mode.\n\n   \n   \n    - If the value is fixed, then the calculated\n     value is equal to the fixed value.\n    - If the value is a percent, then the\n    calculated\n     value is percent/100 * targetSize. For example,\n     the calculated value of a 80% of a managed instance group\n     with 150 instances would be (80/100 * 150) = 120 VM instances. If there\n     is a remainder, the number is rounded. (Format: int32)",
                  },
                  percent: {
                    type: "integer",
                    description:
                      "Specifies a percentage of instances between 0 to 100%, inclusive. For\nexample, specify 80 for 80%. (Format: int32)",
                  },
                },
                description:
                  "Encapsulates numeric value that can be either absolute or relative.",
                additionalProperties: true,
              },
              replacementMethod: {
                type: "string",
                enum: ["RECREATE", "SUBSTITUTE"],
                description:
                  "What action should be used to replace instances.\nSee minimal_action.REPLACE",
              },
              minimalAction: {
                type: "string",
                enum: ["NONE", "REFRESH", "REPLACE", "RESTART"],
                description:
                  "Minimal action to be taken on an instance. Use this option to minimize\ndisruption as much as possible or to apply a more disruptive action than\nis necessary.\n   \n   - To limit disruption as much as possible, set the minimal action toREFRESH. If your update requires a more disruptive action,\n   Compute Engine performs the necessary action to execute the update.\n   - To apply a more disruptive action than is strictly necessary, set the\n   minimal action to RESTART or REPLACE. For\n   example, Compute Engine does not need to restart a VM to change its\n   metadata. But if your application reads instance metadata only when a VM\n   is restarted, you can set the minimal action to RESTART in\n   order to pick up metadata changes.",
              },
              mostDisruptiveAllowedAction: {
                type: "string",
                enum: ["NONE", "REFRESH", "REPLACE", "RESTART"],
                description:
                  "Most disruptive action that is allowed to be taken on an instance.\nYou can specify either NONE to forbid any actions,REFRESH to avoid restarting the VM and to limit disruption\nas much as possible. RESTART to allow actions that can be\napplied without instance replacing or REPLACE to allow all\npossible actions. If the Updater determines that the minimal update\naction needed is more disruptive than most disruptive allowed action you\nspecify it will not perform the update at all.",
              },
              type: {
                type: "string",
                enum: ["OPPORTUNISTIC", "PROACTIVE"],
                description:
                  "The type\nof update process. You can specify either PROACTIVE so\nthat the MIG automatically updates VMs to the latest configurations orOPPORTUNISTIC so that you can select the VMs that you want\nto update.",
              },
              instanceRedistributionType: {
                type: "string",
                enum: ["NONE", "PROACTIVE"],
                description:
                  "The \ninstance redistribution policy for regional managed instance groups.\nValid values are: \n   \n   - PROACTIVE (default): The group attempts to maintain an\n   even distribution of VM instances across zones in the region.\n   - NONE: For non-autoscaled groups, proactive\n   redistribution is disabled.",
              },
            },
            additionalProperties: true,
          },
          required: false,
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
                  metadata: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "The metadata key-value pairs that you want to patch onto the instance. For\nmore information, see Project and\ninstance metadata.",
                  },
                  labels: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "The label key-value pairs that you want to patch onto the instance.",
                  },
                },
                description:
                  "Represents the change that you want to make to the instance properties.",
                additionalProperties: true,
              },
            },
            additionalProperties: true,
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
                enum: ["DO_NOTHING", "REPAIR"],
                description:
                  "The action that a MIG performs on a failed or an unhealthy VM.\nA VM is marked as unhealthy when the application running on that\nVM fails a health check.\nValid values are \n   \n   - REPAIR (default): MIG automatically repairs a failed or\n   an unhealthy VM by recreating it. For more information, see About\n   repairing VMs in a MIG.\n   - DO_NOTHING: MIG does not repair a failed or an unhealthy\n   VM.",
              },
              forceUpdateOnRepair: {
                type: "string",
                enum: ["NO", "YES"],
                description:
                  "A bit indicating whether to forcefully apply the group's latest\nconfiguration when repairing a VM. Valid options are:\n\n   \n   \n     -  NO (default): If configuration updates are available, they are not\n     forcefully applied during repair. Instead, configuration updates are\n     applied according to the group's update policy.\n   \n     -  YES: If configuration updates are available, they are applied\n     during repair.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "[Output Only] The resource type, which is alwayscompute#instanceGroupManager for managed instance groups.",
          type: {
            type: "string",
            description:
              "[Output Only] The resource type, which is alwayscompute#instanceGroupManager for managed instance groups.",
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
        targetSize: {
          name: "Target Size",
          description:
            "The target number of running instances for this managed instance group.",
          type: {
            type: "integer",
            description:
              "The target number of running instances for this managed instance group.\nYou can reduce this number by using the instanceGroupManager\ndeleteInstances or abandonInstances methods. Resizing the group also\nchanges this number. (Format: int32)",
          },
          required: false,
        },
        autoHealingPolicies: {
          name: "Auto Healing Policies",
          description:
            "The autohealing policy for this managed instance group.",
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
                    "The initial delay is the number of seconds that a new VM takes to\ninitialize and run its startup script. During a VM's initial delay\nperiod, the MIG ignores unsuccessful health checks because the VM might\nbe in the startup process. This prevents the MIG from prematurely\nrecreating a VM. If the health check receives a healthy response during\nthe initial delay, it indicates that the startup process is complete and\nthe VM is ready. The value of initial delay must be between 0 and 3600\nseconds. The default value is 0. (Format: int32)",
                },
              },
              additionalProperties: true,
            },
            description:
              "The autohealing policy for this managed instance group. You can specify\nonly one value.",
          },
          required: false,
        },
        targetSuspendedSize: {
          name: "Target Suspended Size",
          description:
            "The target number of suspended instances for this managed instance group.",
          type: {
            type: "integer",
            description:
              "The target number of suspended instances for this managed instance group.\nThis number changes when you: \n   \n   - Suspend instance using the suspendInstances\n   method or resume instances using the resumeInstances\n   method.\n   - Manually change the targetSuspendedSize using the update\n   method. (Format: int32)",
          },
          required: false,
        },
        region: {
          name: "Region",
          description:
            "[Output Only] The URL of theregion where the managed instance group resides (for regional resources).",
          type: {
            type: "string",
            description:
              "[Output Only] The URL of theregion\nwhere the managed instance group resides (for regional resources).",
          },
          required: false,
        },
        currentActions: {
          name: "Current Actions",
          description:
            "[Output Only] The list of instance actions and the number of instances in this managed instance group that are scheduled for each of those actions.",
          type: {
            type: "object",
            properties: {
              deleting: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be deleted or are currently being deleted. (Format: int32)",
              },
              starting: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be started or are currently being started. (Format: int32)",
              },
              refreshing: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare being reconfigured with properties that do not require a restart\nor a recreate action. For example, setting or removing target\npools for the instance. (Format: int32)",
              },
              creating: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be created or are currently being created. If the group\nfails to create any of these instances, it tries again until it creates\nthe instance successfully.\n\nIf you have disabled creation retries, this field will not be populated;\ninstead, the creatingWithoutRetries field will be populated. (Format: int32)",
              },
              suspending: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be suspended or are currently being suspended. (Format: int32)",
              },
              stopping: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be stopped or are currently being stopped. (Format: int32)",
              },
              none: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare running and have no scheduled actions. (Format: int32)",
              },
              verifying: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare being verified. See the managedInstances[].currentAction\nproperty in the listManagedInstances method documentation. (Format: int32)",
              },
              restarting: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be restarted or are currently being restarted. (Format: int32)",
              },
              resuming: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be resumed or are currently being resumed. (Format: int32)",
              },
              recreating: {
                type: "integer",
                description:
                  "[Output Only] The number of instances in the managed instance group that\nare scheduled to be recreated or are currently being being recreated.\nRecreating an instance deletes the existing root persistent disk\nand creates a new disk from the image that is defined in the\ninstance template. (Format: int32)",
              },
              abandoning: {
                type: "integer",
                description:
                  "[Output Only] The total number of instances in the managed instance group\nthat are scheduled to be abandoned. Abandoning an instance removes it\nfrom the managed instance group without deleting it. (Format: int32)",
              },
              creatingWithoutRetries: {
                type: "integer",
                description:
                  "[Output Only] The number of instances that the managed instance group\nwill attempt to create. The group attempts to create each instance\nonly once. If the group fails to create any of these instances, it\ndecreases the group's targetSize value accordingly. (Format: int32)",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        standbyPolicy: {
          name: "Standby Policy",
          description: "Standby policy for stopped and suspended instances.",
          type: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["MANUAL", "SCALE_OUT_POOL"],
                description:
                  "Defines how a MIG resumes or starts VMs from a standby pool when the\ngroup scales out. The default mode is `MANUAL`.",
              },
              initialDelaySec: {
                type: "integer",
                description:
                  "Specifies the number of seconds that the MIG should wait to suspend or\nstop a VM after that VM was created. The initial delay gives the\ninitialization script the time to prepare your VM for a quick scale out.\nThe value of initial delay must be between 0 and 3600 seconds. The\ndefault value is 0. (Format: int32)",
              },
            },
            additionalProperties: true,
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
                  "The URL of the workload policy that is specified for this managed\ninstance group.\nIt can be a full or partial URL. For example, the following are\nall valid URLs to a workload policy: \n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/regions/region/resourcePolicies/resourcePolicy\n      - projects/project/regions/region/resourcePolicies/resourcePolicy\n      - regions/region/resourcePolicies/resourcePolicy",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        instanceFlexibilityPolicy: {
          name: "Instance Flexibility Policy",
          description:
            "Instance flexibility allowing MIG to create VMs from multiple types of machines.",
          type: {
            type: "object",
            properties: {
              instanceSelections: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "Named instance selections configuring properties that the group will use\nwhen creating new VMs.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        baseInstanceName: {
          name: "Base Instance Name",
          description:
            "The base instance name is a prefix that you want to attach to the names of all VMs in a MIG.",
          type: {
            type: "string",
            description:
              'The base instance name is a prefix that you want to attach to the names of\nall VMs in a MIG. The maximum character length is 58 and the name must\ncomply with RFC1035 format.\n\nWhen a VM is created in the group, the MIG appends a hyphen and a random\nfour-character string to the base instance name. If you want the MIG to\nassign sequential numbers instead of a random string, then end the base\ninstance name with a hyphen followed by one or more hash symbols. The hash\nsymbols indicate the number of digits. For example, a base instance name of\n"vm-###" results in "vm-001" as a VM name.\n@pattern\n[a-z](([-a-z0-9]{0,57})|([-a-z0-9]{0,51}-#{1,10}(\\\\[[0-9]{1,10}\\\\])?))',
          },
          required: false,
        },
        targetPools: {
          name: "Target Pools",
          description:
            "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added. The target pools automatically\napply to all of the instances in the managed instance group.",
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
                  internalIPs: {
                    type: "object",
                    additionalProperties: {
                      type: "object",
                    },
                    description:
                      "Internal network IPs assigned to the instances that will be preserved on\ninstance delete, update, etc. This map is keyed with the network\ninterface name.",
                  },
                  disks: {
                    type: "object",
                    additionalProperties: {
                      type: "object",
                    },
                    description:
                      "Disks created on the instances that will be preserved on instance\ndelete, update, etc. This map is keyed with the device names of\nthe disks.",
                  },
                  externalIPs: {
                    type: "object",
                    additionalProperties: {
                      type: "object",
                    },
                    description:
                      "External network IPs assigned to the instances that will be preserved on\ninstance delete, update, etc. This map is keyed with the network\ninterface name.",
                  },
                },
                description: "Configuration of preserved resources.",
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "[Output Only] The URL for this managed instance group.",
          type: {
            type: "string",
            description:
              "[Output Only] The URL for this managed instance group. The server defines\nthis URL.",
          },
          required: false,
        },
        instanceGroup: {
          name: "Instance Group",
          description: "[Output Only] The URL of the Instance Group resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The URL of the Instance Group resource.",
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
              zones: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    zone: {
                      type: "string",
                      description:
                        "The URL of thezone.\nThe zone must exist in the region where the managed instance group is\nlocated.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Zones where the regional managed instance group will create and manage\nits instances.",
              },
              targetShape: {
                type: "string",
                enum: ["ANY", "ANY_SINGLE_ZONE", "BALANCED", "EVEN"],
                description:
                  "The distribution shape to which the group converges either proactively or\non resize events (depending on the value set inupdatePolicy.instanceRedistributionType).",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        instanceTemplate: {
          name: "Instance Template",
          description:
            "The URL of the instance template that is specified for this managed instance group.",
          type: {
            type: "string",
            description:
              "The URL of the instance template that is specified for this managed\ninstance group. The group uses this template to create all new instances\nin the managed instance group. The templates for existing instances in the\ngroup do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE.",
          },
          required: false,
        },
        listManagedInstancesResults: {
          name: "List Managed Instances Results",
          description:
            "Pagination behavior of the listManagedInstances API method for this managed instance group.",
          type: {
            type: "string",
            enum: ["PAGELESS", "PAGINATED"],
            description:
              "Pagination behavior of the listManagedInstances API method for\nthis managed instance group.",
          },
          required: false,
        },
        status: {
          name: "Status",
          description:
            "[Output Only] The status of this managed instance group.",
          type: {
            type: "object",
            properties: {
              isStable: {
                type: "boolean",
                description:
                  "[Output Only] A bit indicating whether the managed instance group is in a\nstable state. A stable state means that: none of the instances in the\nmanaged instance group is currently undergoing any type of change (for\nexample, creation, restart, or deletion); no future changes are scheduled\nfor instances in the managed instance group; and the managed instance\ngroup itself is not being modified.",
              },
              stateful: {
                type: "object",
                properties: {
                  perInstanceConfigs: {
                    type: "object",
                    properties: {
                      allEffective: {
                        type: "boolean",
                        description:
                          "A bit indicating if all of the group's per-instance configurations\n(listed in the output of a listPerInstanceConfigs API call) have\nstatus EFFECTIVE or there are no per-instance-configs.",
                      },
                    },
                    additionalProperties: true,
                  },
                  hasStatefulConfig: {
                    type: "boolean",
                    description:
                      "[Output Only] A bit indicating whether the managed instance group\nhas stateful configuration, that is, if you have configured any items\nin a stateful policy or in per-instance configs.\nThe group might report that it has no stateful configuration even when\nthere is still some preserved state on a managed instance, for example,\nif you have deleted all PICs but not yet applied those deletions.",
                  },
                },
                additionalProperties: true,
              },
              versionTarget: {
                type: "object",
                properties: {
                  isReached: {
                    type: "boolean",
                    description:
                      "[Output Only] A bit indicating whether version target has been reached\nin this managed instance group, i.e. all instances are in their target\nversion. Instances' target version are specified byversion field on Instance Group Manager.",
                  },
                },
                additionalProperties: true,
              },
              allInstancesConfig: {
                type: "object",
                properties: {
                  effective: {
                    type: "boolean",
                    description:
                      "[Output Only] A bit indicating whether this configuration has\nbeen applied to all managed instances in the group.",
                  },
                  currentRevision: {
                    type: "string",
                    description:
                      "[Output Only] Current all-instances configuration revision.\nThis value is in RFC3339 text format.",
                  },
                },
                additionalProperties: true,
              },
              autoscaler: {
                type: "string",
                description:
                  "[Output Only] The URL of theAutoscaler\nthat targets this instance group manager.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        satisfiesPzi: {
          name: "Satisfies Pzi",
          description: "[Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "[Output Only] Reserved for future use.",
          },
          required: false,
        },
        satisfiesPzs: {
          name: "Satisfies Pzs",
          description: "[Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "[Output Only] Reserved for future use.",
          },
          required: false,
        },
        targetStoppedSize: {
          name: "Target Stopped Size",
          description:
            "The target number of stopped instances for this managed instance group.",
          type: {
            type: "integer",
            description:
              "The target number of stopped instances for this managed instance group.\nThis number changes when you: \n   \n   - Stop instance using the stopInstances\n   method or start instances using the startInstances\n   method.\n   - Manually change the targetStoppedSize using the update\n   method. (Format: int32)",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "The name of the managed instance group.",
          type: {
            type: "string",
            description:
              "The name of the managed instance group. The name must be 1-63 characters\nlong, and comply withRFC1035.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description: "Fingerprint of this resource.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. This field may be used in optimistic locking.\nIt will be ignored when inserting an InstanceGroupManager. An up-to-date\nfingerprint must be provided in order to update the InstanceGroupManager,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an InstanceGroupManager. (Format: byte)",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "[Output Only] The creation timestamp for this managed instance group inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] The creation timestamp for this managed instance group inRFC3339\ntext format.",
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
                port: {
                  type: "integer",
                  description:
                    "The port number, which can be a value between 1 and 65535. (Format: int32)",
                },
                name: {
                  type: "string",
                  description:
                    "The name for this named port.\nThe name must be 1-63 characters long, and comply withRFC1035.",
                },
              },
              description: 'The named port. For example: <"http", 80>.',
              additionalProperties: true,
            },
            description:
              "[Output Only] Named ports configured on the Instance Groups complementary\nto this Instance Group Manager.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "[Output Only] A unique identifier for this resource type.",
          type: {
            type: "string",
            description:
              "[Output Only] A unique identifier for this resource type. The server\ngenerates this identifier. (Format: uint64)",
          },
          required: false,
        },
        versions: {
          name: "Versions",
          description:
            "Specifies the instance templates used by this managed instance group to create instances.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                instanceTemplate: {
                  type: "string",
                  description:
                    "The URL of the instance template that is specified for this managed\ninstance group. The group uses this template to create new instances in\nthe managed instance group until the `targetSize` for this version is\nreached. The templates for existing instances in the group do not change\nunless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE; in those cases,\nexisting instances are updated until the `targetSize` for this version is\nreached.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the version. Unique among all versions in the scope of this\nmanaged instance group.",
                },
                targetSize: {
                  type: "object",
                  properties: {
                    fixed: {
                      type: "integer",
                      description:
                        "Specifies a fixed number of VM instances. This must be a positive integer. (Format: int32)",
                    },
                    calculated: {
                      type: "integer",
                      description:
                        "[Output Only] Absolute value of VM instances calculated based on the\nspecific mode.\n\n   \n   \n    - If the value is fixed, then the calculated\n     value is equal to the fixed value.\n    - If the value is a percent, then the\n    calculated\n     value is percent/100 * targetSize. For example,\n     the calculated value of a 80% of a managed instance group\n     with 150 instances would be (80/100 * 150) = 120 VM instances. If there\n     is a remainder, the number is rounded. (Format: int32)",
                    },
                    percent: {
                      type: "integer",
                      description:
                        "Specifies a percentage of instances between 0 to 100%, inclusive. For\nexample, specify 80 for 80%. (Format: int32)",
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
              "Specifies the instance templates used by this managed instance group to\ncreate instances.\n\nEach version is defined by an instanceTemplate and aname. Every version can appear at most once per instance\ngroup. This field overrides the top-level instanceTemplate\nfield. Read more about therelationships\nbetween these fields. Exactly one version must leave thetargetSize field unset. That version will be applied to all\nremaining instances. For more information, read aboutcanary\nupdates.",
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
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/compute",
            ],
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/zones/{zone}/instanceGroupManagers`;

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

        if (input.event.inputConfig.updatePolicy !== undefined)
          requestBody.updatePolicy = input.event.inputConfig.updatePolicy;
        if (input.event.inputConfig.allInstancesConfig !== undefined)
          requestBody.allInstancesConfig =
            input.event.inputConfig.allInstancesConfig;
        if (input.event.inputConfig.instanceLifecyclePolicy !== undefined)
          requestBody.instanceLifecyclePolicy =
            input.event.inputConfig.instanceLifecyclePolicy;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.targetSize !== undefined)
          requestBody.targetSize = input.event.inputConfig.targetSize;
        if (input.event.inputConfig.autoHealingPolicies !== undefined)
          requestBody.autoHealingPolicies =
            input.event.inputConfig.autoHealingPolicies;
        if (input.event.inputConfig.targetSuspendedSize !== undefined)
          requestBody.targetSuspendedSize =
            input.event.inputConfig.targetSuspendedSize;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.currentActions !== undefined)
          requestBody.currentActions = input.event.inputConfig.currentActions;
        if (input.event.inputConfig.zone !== undefined)
          requestBody.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.standbyPolicy !== undefined)
          requestBody.standbyPolicy = input.event.inputConfig.standbyPolicy;
        if (input.event.inputConfig.resourcePolicies !== undefined)
          requestBody.resourcePolicies =
            input.event.inputConfig.resourcePolicies;
        if (input.event.inputConfig.instanceFlexibilityPolicy !== undefined)
          requestBody.instanceFlexibilityPolicy =
            input.event.inputConfig.instanceFlexibilityPolicy;
        if (input.event.inputConfig.baseInstanceName !== undefined)
          requestBody.baseInstanceName =
            input.event.inputConfig.baseInstanceName;
        if (input.event.inputConfig.targetPools !== undefined)
          requestBody.targetPools = input.event.inputConfig.targetPools;
        if (input.event.inputConfig.statefulPolicy !== undefined)
          requestBody.statefulPolicy = input.event.inputConfig.statefulPolicy;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.instanceGroup !== undefined)
          requestBody.instanceGroup = input.event.inputConfig.instanceGroup;
        if (input.event.inputConfig.distributionPolicy !== undefined)
          requestBody.distributionPolicy =
            input.event.inputConfig.distributionPolicy;
        if (input.event.inputConfig.instanceTemplate !== undefined)
          requestBody.instanceTemplate =
            input.event.inputConfig.instanceTemplate;
        if (input.event.inputConfig.listManagedInstancesResults !== undefined)
          requestBody.listManagedInstancesResults =
            input.event.inputConfig.listManagedInstancesResults;
        if (input.event.inputConfig.status !== undefined)
          requestBody.status = input.event.inputConfig.status;
        if (input.event.inputConfig.satisfiesPzi !== undefined)
          requestBody.satisfiesPzi = input.event.inputConfig.satisfiesPzi;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          requestBody.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.targetStoppedSize !== undefined)
          requestBody.targetStoppedSize =
            input.event.inputConfig.targetStoppedSize;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.fingerprint !== undefined)
          requestBody.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.namedPorts !== undefined)
          requestBody.namedPorts = input.event.inputConfig.namedPorts;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.versions !== undefined)
          requestBody.versions = input.event.inputConfig.versions;

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
          targetId: {
            type: "string",
            description:
              "[Output Only] The unique target ID, which identifies a specific incarnation\nof the target resource. (Format: uint64)",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nmessage that was returned, such as `NOT FOUND`.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always `compute#operation` for\nOperation resources.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "[Output Only] Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
            },
            additionalProperties: true,
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the operation. This identifier is\ndefined by the server. (Format: uint64)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only\napplicable when performing regional operations.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server.\nThis value is inRFC3339\ntext format.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only\napplicable when performing per-zone operations.",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the\noperation.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example:\n`user@example.com` or\n`alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
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
                    '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
                },
                code: {
                  type: "string",
                  enum: [
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
                    "[Output Only] A warning code, if applicable. For example, Compute\nEngine returns NO_RESULTS_ON_PAGE if there\nare no results in the response.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the\noperation, this field will be populated.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`,\n`update`, or `delete`, and so on.",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For\noperations related to creating a snapshot, this points to the disk\nthat the snapshot was created from.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
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
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          localizedMessage: {
                            type: "object",
                            properties: {
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at\nhttps://www.rfc-editor.org/rfc/bcp/bcp47.txt.\nExamples are: "en-US", "fr-CH", "es-MX"',
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user\nwhich can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          errorInfo: {
                            type: "object",
                            properties: {
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.\n\nKeys must match a regular expression of `a-z+` but should\nideally be lowerCamelCase. Also, they must be limited to 64 characters in\nlength. When identifying the current value of an exceeded limit, the units\nshould be contained in the key, not the value.  For example, rather than\n`{"instanceLimit": "100/request"}`, should be returned as,\n`{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of\ninstances that can be created in a single (batch) request.',
                              },
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain\nis typically the registered service name of the tool or product that\ngenerates the error. Example: "pubsub.googleapis.com". If the error is\ngenerated by some common infrastructure, the error domain must be a\nglobally unique value that identifies the infrastructure. For Google API\ninfrastructure, the error domain is "googleapis.com".',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the\nproximate cause of the error. Error reasons are unique within a particular\ndomain of errors. This should be at most 63 characters and match a\nregular expression of `A-Z+[A-Z0-9]`, which represents\nUPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.\n\nExample of an error when contacting the "pubsub.googleapis.com" API when it\nis not enabled:\n\n    { "reason": "API_DISABLED"\n      "domain": "googleapis.com"\n      "metadata": {\n        "resource": "projects/123",\n        "service": "pubsub.googleapis.com"\n      }\n    }\n\nThis response indicates that the pubsub.googleapis.com API is not enabled.\n\nExample of an error that is returned when attempting to create a Spanner\ninstance in a region that is out of stock:\n\n    { "reason": "STOCKOUT"\n      "domain": "spanner.googleapis.com",\n      "metadata": {\n        "availableRegions": "us-central1,us-east2"\n      }\n    }',
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type\nor metric. (Format: double)",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota\n type or metric. (Format: double)",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
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
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
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
                              "Provides links to documentation or for performing an out of band action.\n\nFor example, if a quota check failed with an error indicating the calling\nproject hasn't enabled the accessed service, this can contain a URL pointing\ndirectly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error\ndetails. There is a set of defined message types to use for providing\ndetails.The syntax depends on the error code. For example,\nQuotaExceededInfo will have details when the error code is\nQUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error.\nThis property is optional.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this\noperation.",
              },
            },
            description:
              "[Output Only] If errors are generated during processing of the operation,\nthis field will be populated.",
            additionalProperties: true,
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339\ntext format.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nstatus code that was returned. For example, a `404` means the\nresource was not found. (Format: int32)",
          },
          operationGroupId: {
            type: "string",
            description:
              "[Output Only] An ID that represents a group of operations, such as when a\ngroup of operations results from a `bulkInsert` API request.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is\nset when the operation is created.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request.\nNot present otherwise.",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested.\nThis value is inRFC3339\ntext format.",
          },
          status: {
            type: "string",
            enum: ["DONE", "PENDING", "RUNNING"],
            description:
              "[Output Only] The status of the operation, which can be one of the\nfollowing:\n`PENDING`, `RUNNING`, or `DONE`.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100.\nThere is no requirement that this be linear or support any granularity of\noperations. This should not be used to guess when the operation will be\ncomplete. This number should monotonically increase as the operation\nprogresses. (Format: int32)",
          },
        },
        description:
          "Represents an Operation resource.\n\nGoogle Compute Engine has three Operation resources:\n\n* [Global](/compute/docs/reference/rest/v1/globalOperations)\n* [Regional](/compute/docs/reference/rest/v1/regionOperations)\n* [Zonal](/compute/docs/reference/rest/v1/zoneOperations)\n\nYou can use an operation resource to manage asynchronous API requests.\nFor more information, readHandling\nAPI responses.\n\nOperations can be global, regional or zonal.\n   \n   - For global operations, use the `globalOperations`\n   resource. \n   - For regional operations, use the\n   `regionOperations` resource. \n   - For zonal operations, use\n   the `zoneOperations` resource.\n\n\n\nFor more information, read\nGlobal, Regional, and Zonal Resources.\n\nNote that completed Operation resources have a limited \nretention period.",
        additionalProperties: true,
      },
    },
  },
};

export default instanceGroupManagersInsert;
