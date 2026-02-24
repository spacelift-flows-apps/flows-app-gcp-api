import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instanceGroupManagersList: AppBlock = {
  name: "Instance Group Managers - List",
  description: `Retrieves a list of managed instance groups that are contained within the specified project and zone.`,
  category: "Instance Group Managers",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of thezone where the managed\ninstance group is located.",
          type: {
            type: "string",
          },
          required: true,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
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
              "https://www.googleapis.com/auth/compute.readonly",
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
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                updatePolicy: {
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
                allInstancesConfig: {
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
                instanceLifecyclePolicy: {
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
                kind: {
                  type: "string",
                  description:
                    "[Output Only] The resource type, which is alwayscompute#instanceGroupManager for managed instance groups.",
                },
                description: {
                  type: "string",
                  description: "An optional description of this resource.",
                },
                targetSize: {
                  type: "integer",
                  description:
                    "The target number of running instances for this managed instance group.\nYou can reduce this number by using the instanceGroupManager\ndeleteInstances or abandonInstances methods. Resizing the group also\nchanges this number. (Format: int32)",
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
                          "The initial delay is the number of seconds that a new VM takes to\ninitialize and run its startup script. During a VM's initial delay\nperiod, the MIG ignores unsuccessful health checks because the VM might\nbe in the startup process. This prevents the MIG from prematurely\nrecreating a VM. If the health check receives a healthy response during\nthe initial delay, it indicates that the startup process is complete and\nthe VM is ready. The value of initial delay must be between 0 and 3600\nseconds. The default value is 0. (Format: int32)",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The autohealing policy for this managed instance group. You can specify\nonly one value.",
                },
                targetSuspendedSize: {
                  type: "integer",
                  description:
                    "The target number of suspended instances for this managed instance group.\nThis number changes when you: \n   \n   - Suspend instance using the suspendInstances\n   method or resume instances using the resumeInstances\n   method.\n   - Manually change the targetSuspendedSize using the update\n   method. (Format: int32)",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] The URL of theregion\nwhere the managed instance group resides (for regional resources).",
                },
                currentActions: {
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
                zone: {
                  type: "string",
                  description:
                    "[Output Only] The URL of azone\nwhere the managed instance group is located (for zonal resources).",
                },
                standbyPolicy: {
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
                resourcePolicies: {
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
                instanceFlexibilityPolicy: {
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
                baseInstanceName: {
                  type: "string",
                  description:
                    'The base instance name is a prefix that you want to attach to the names of\nall VMs in a MIG. The maximum character length is 58 and the name must\ncomply with RFC1035 format.\n\nWhen a VM is created in the group, the MIG appends a hyphen and a random\nfour-character string to the base instance name. If you want the MIG to\nassign sequential numbers instead of a random string, then end the base\ninstance name with a hyphen followed by one or more hash symbols. The hash\nsymbols indicate the number of digits. For example, a base instance name of\n"vm-###" results in "vm-001" as a VM name.\n@pattern\n[a-z](([-a-z0-9]{0,57})|([-a-z0-9]{0,51}-#{1,10}(\\\\[[0-9]{1,10}\\\\])?))',
                },
                targetPools: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added. The target pools automatically\napply to all of the instances in the managed instance group.",
                },
                statefulPolicy: {
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
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] The URL for this managed instance group. The server defines\nthis URL.",
                },
                instanceGroup: {
                  type: "string",
                  description:
                    "[Output Only] The URL of the Instance Group resource.",
                },
                distributionPolicy: {
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
                instanceTemplate: {
                  type: "string",
                  description:
                    "The URL of the instance template that is specified for this managed\ninstance group. The group uses this template to create all new instances\nin the managed instance group. The templates for existing instances in the\ngroup do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE.",
                },
                listManagedInstancesResults: {
                  type: "string",
                  enum: ["PAGELESS", "PAGINATED"],
                  description:
                    "Pagination behavior of the listManagedInstances API method for\nthis managed instance group.",
                },
                status: {
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
                satisfiesPzi: {
                  type: "boolean",
                  description: "[Output Only] Reserved for future use.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description: "[Output Only] Reserved for future use.",
                },
                targetStoppedSize: {
                  type: "integer",
                  description:
                    "The target number of stopped instances for this managed instance group.\nThis number changes when you: \n   \n   - Stop instance using the stopInstances\n   method or start instances using the startInstances\n   method.\n   - Manually change the targetStoppedSize using the update\n   method. (Format: int32)",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the managed instance group. The name must be 1-63 characters\nlong, and comply withRFC1035.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. This field may be used in optimistic locking.\nIt will be ignored when inserting an InstanceGroupManager. An up-to-date\nfingerprint must be provided in order to update the InstanceGroupManager,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an InstanceGroupManager. (Format: byte)",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] The creation timestamp for this managed instance group inRFC3339\ntext format.",
                },
                namedPorts: {
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
                id: {
                  type: "string",
                  description:
                    "[Output Only] A unique identifier for this resource type. The server\ngenerates this identifier. (Format: uint64)",
                },
                versions: {
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
              },
              description:
                "Represents a Managed Instance Group resource.\n\nAn instance group is a collection of VM instances that you can manage as a\nsingle entity. For more information, readInstance groups.\n\nFor zonal Managed Instance Group, use the instanceGroupManagers\nresource.\n\nFor regional Managed Instance Group, use theregionInstanceGroupManagers resource.",
              additionalProperties: true,
            },
            description: "A list of InstanceGroupManager resources.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] The resource type, which is always\ncompute#instanceGroupManagerList for a list of managed instance groups.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          warning: {
            type: "object",
            properties: {
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
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    value: {
                      type: "string",
                      description:
                        "[Output Only] A warning data value corresponding to the key.",
                    },
                    key: {
                      type: "string",
                      description:
                        "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
              },
              message: {
                type: "string",
                description:
                  "[Output Only] A human-readable description of the warning code.",
              },
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
        },
        description: "[Output Only] A list of managed instance groups.",
        additionalProperties: true,
      },
    },
  },
};

export default instanceGroupManagersList;
