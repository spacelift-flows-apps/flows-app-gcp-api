import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Instance Group Managers - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Instance Group Managers",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of thezone where the managed instance group is located.",
          type: {
            type: "string",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.orderBy !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.orderBy);
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.returnPartialSuccess !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.returnPartialSuccess,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instanceGroupManagers",
          pathParams,
          queryParams,
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
          id: {
            type: "string",
            description:
              "Output only. [Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                allInstancesConfig: {
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
                autoHealingPolicies: {
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
                baseInstanceName: {
                  type: "string",
                  description:
                    'The base instance name is a prefix that you want to attach to the names of all VMs in a MIG. The maximum character length is 58 and the name must comply with RFC1035 format.  When a VM is created in the group, the MIG appends a hyphen and a random four-character string to the base instance name. If you want the MIG to assign sequential numbers instead of a random string, then end the base instance name with a hyphen followed by one or more hash symbols. The hash symbols indicate the number of digits. For example, a base instance name of "vm-###" results in "vm-001" as a VM name. @pattern [a-z](([-a-z0-9]{0,57})|([-a-z0-9]{0,51}-#{1,10}(\\\\[[0-9]{1,10}\\\\])?))',
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The creation timestamp for this managed instance group inRFC3339 text format.",
                },
                currentActions: {
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
                description: {
                  type: "string",
                  description: "An optional description of this resource.",
                },
                distributionPolicy: {
                  type: "object",
                  properties: {
                    targetShape: {
                      type: "string",
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
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. This field may be used in optimistic locking. It will be ignored when inserting an InstanceGroupManager. An up-to-date fingerprint must be provided in order to update the InstanceGroupManager, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an InstanceGroupManager.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                instanceFlexibilityPolicy: {
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
                instanceGroup: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL of the Instance Group resource.",
                },
                instanceLifecyclePolicy: {
                  type: "object",
                  properties: {
                    defaultActionOnFailure: {
                      type: "string",
                      description:
                        "The action that a MIG performs on a failed or an unhealthy VM. A VM is marked as unhealthy when the application running on that VM fails a health check. Valid values are     - REPAIR (default): MIG automatically repairs a failed or    an unhealthy VM by recreating it. For more information, see About    repairing VMs in a MIG.    - DO_NOTHING: MIG does not repair a failed or an unhealthy    VM. Check the DefaultActionOnFailure enum for the list of possible values.",
                    },
                    forceUpdateOnRepair: {
                      type: "string",
                      description:
                        "A bit indicating whether to forcefully apply the group's latest configuration when repairing a VM. Valid options are:         -  NO (default): If configuration updates are available, they are not      forcefully applied during repair. Instead, configuration updates are      applied according to the group's update policy.       -  YES: If configuration updates are available, they are applied      during repair. Check the ForceUpdateOnRepair enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "The repair policy for this managed instance group.",
                },
                instanceTemplate: {
                  type: "string",
                  description:
                    "The URL of the instance template that is specified for this managed instance group. The group uses this template to create all new instances in the managed instance group. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE.",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The resource type, which is alwayscompute#instanceGroupManager for managed instance groups.",
                },
                listManagedInstancesResults: {
                  type: "string",
                  description:
                    "Pagination behavior of the listManagedInstances API method for this managed instance group. Check the ListManagedInstancesResults enum for the list of possible values.",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the managed instance group. The name must be 1-63 characters long, and comply withRFC1035.",
                },
                namedPorts: {
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
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL of theregion where the managed instance group resides (for regional resources).",
                },
                resourcePolicies: {
                  type: "object",
                  properties: {
                    workloadPolicy: {
                      type: "string",
                      description:
                        "The URL of the workload policy that is specified for this managed instance group. It can be a full or partial URL. For example, the following are all valid URLs to a workload policy:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/resourcePolicies/resourcePolicy       - projects/project/regions/region/resourcePolicies/resourcePolicy       - regions/region/resourcePolicies/resourcePolicy",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Resource policies for this managed instance group.",
                },
                satisfiesPzi: {
                  type: "boolean",
                  description:
                    "Output only. [Output Only] Reserved for future use.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description:
                    "Output only. [Output Only] Reserved for future use.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL for this managed instance group. The server defines this URL.",
                },
                standbyPolicy: {
                  type: "object",
                  properties: {
                    initialDelaySec: {
                      type: "integer",
                      description:
                        "Specifies the number of seconds that the MIG should wait to suspend or stop a VM after that VM was created. The initial delay gives the initialization script the time to prepare your VM for a quick scale out. The value of initial delay must be between 0 and 3600 seconds. The default value is 0.",
                    },
                    mode: {
                      type: "string",
                      description:
                        "Defines how a MIG resumes or starts VMs from a standby pool when the group scales out. The default mode is `MANUAL`. Check the Mode enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Standby policy for stopped and suspended instances.",
                },
                statefulPolicy: {
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
                status: {
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
                targetPools: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added. The target pools automatically apply to all of the instances in the managed instance group.",
                },
                targetSize: {
                  type: "integer",
                  description:
                    "The target number of running instances for this managed instance group. You can reduce this number by using the instanceGroupManager deleteInstances or abandonInstances methods. Resizing the group also changes this number.",
                },
                targetStoppedSize: {
                  type: "integer",
                  description:
                    "The target number of stopped instances for this managed instance group. This number changes when you:     - Stop instance using the stopInstances    method or start instances using the startInstances    method.    - Manually change the targetStoppedSize using the update    method.",
                },
                targetSuspendedSize: {
                  type: "integer",
                  description:
                    "The target number of suspended instances for this managed instance group. This number changes when you:     - Suspend instance using the suspendInstances    method or resume instances using the resumeInstances    method.    - Manually change the targetSuspendedSize using the update    method.",
                },
                updatePolicy: {
                  type: "object",
                  properties: {
                    instanceRedistributionType: {
                      type: "string",
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
                      description:
                        "Minimal action to be taken on an instance. Use this option to minimize disruption as much as possible or to apply a more disruptive action than is necessary.     - To limit disruption as much as possible, set the minimal action toREFRESH. If your update requires a more disruptive action,    Compute Engine performs the necessary action to execute the update.    - To apply a more disruptive action than is strictly necessary, set the    minimal action to RESTART or REPLACE. For    example, Compute Engine does not need to restart a VM to change its    metadata. But if your application reads instance metadata only when a VM    is restarted, you can set the minimal action to RESTART in    order to pick up metadata changes. Check the MinimalAction enum for the list of possible values.",
                    },
                    mostDisruptiveAllowedAction: {
                      type: "string",
                      description:
                        "Most disruptive action that is allowed to be taken on an instance. You can specify either NONE to forbid any actions,REFRESH to avoid restarting the VM and to limit disruption as much as possible. RESTART to allow actions that can be applied without instance replacing or REPLACE to allow all possible actions. If the Updater determines that the minimal update action needed is more disruptive than most disruptive allowed action you specify it will not perform the update at all. Check the MostDisruptiveAllowedAction enum for the list of possible values.",
                    },
                    replacementMethod: {
                      type: "string",
                      description:
                        "What action should be used to replace instances. See minimal_action.REPLACE Check the ReplacementMethod enum for the list of possible values.",
                    },
                    type: {
                      type: "string",
                      description:
                        "The type of update process. You can specify either PROACTIVE so that the MIG automatically updates VMs to the latest configurations orOPPORTUNISTIC so that you can select the VMs that you want to update. Check the Type enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "The update policy for this managed instance group.",
                },
                versions: {
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
                zone: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL of azone where the managed instance group is located (for zonal resources).",
                },
              },
              description:
                "Represents a Managed Instance Group resource.  An instance group is a collection of VM instances that you can manage as a single entity. For more information, readInstance groups.  For zonal Managed Instance Group, use the instanceGroupManagers resource.  For regional Managed Instance Group, use theregionInstanceGroupManagers resource.",
              additionalProperties: true,
            },
            description: "A list of InstanceGroupManager resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] The resource type, which is always compute#instanceGroupManagerList for a list of managed instance groups.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Output only. [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          warning: {
            type: "object",
            properties: {
              code: {
                type: "string",
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "[Output Only] A list of managed instance groups.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
