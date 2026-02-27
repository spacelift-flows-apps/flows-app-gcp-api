import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instanceGroupManagersListManagedInstances: AppBlock = {
  name: "Instance Group Managers - List Managed Instances",
  description: `Lists all of the instances in the managed instance group.`,
  category: "Instance Group Managers",
  inputs: {
    default: {
      config: {
        instanceGroupManager: {
          name: "Instance Group Manager",
          description: "The name of the managed instance group.",
          type: {
            type: "string",
          },
          required: true,
        },
        zone: {
          name: "Zone",
          description:
            "The name of thezone where the managed\ninstance group is located.",
          type: {
            type: "string",
          },
          required: true,
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
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
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
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
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
        let path = `projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/listManagedInstances`;

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
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          managedInstances: {
            type: "array",
            items: {
              type: "object",
              properties: {
                currentAction: {
                  type: "string",
                  enum: [
                    "ABANDONING",
                    "CREATING",
                    "CREATING_WITHOUT_RETRIES",
                    "DELETING",
                    "NONE",
                    "RECREATING",
                    "REFRESHING",
                    "RESTARTING",
                    "RESUMING",
                    "STARTING",
                    "STOPPING",
                    "SUSPENDING",
                    "VERIFYING",
                  ],
                  description:
                    "[Output Only] The current action that the managed instance group has\nscheduled for the instance. Possible values:\n   \n   - NONE The instance is running, and the managed\n   instance group does not have any scheduled actions for this instance.\n   - CREATING The managed instance group is creating this\n   instance. If the group fails to create this instance, it will try again\n   until it is successful.\n   - CREATING_WITHOUT_RETRIES The managed instance group\n   is attempting to create this instance only once. If the group fails\n   to create this instance, it does not try again and the group'stargetSize value is decreased instead.\n   - RECREATING The managed instance group is recreating\n   this instance.\n   - DELETING The managed instance group is permanently\n   deleting this instance.\n   - ABANDONING The managed instance group is abandoning\n   this instance. The instance will be removed from the instance group\n   and from any target pools that are associated with this group.\n   - RESTARTING The managed instance group is restarting\n   the instance.\n   - REFRESHING The managed instance group is applying\n   configuration changes to the instance without stopping it. For example,\n   the group can update the target pool list for an instance without\n   stopping that instance.\n   - VERIFYING The managed instance group has created the\n   instance and it is in the process of being verified.",
                },
                propertiesFromFlexibilityPolicy: {
                  type: "object",
                  properties: {
                    machineType: {
                      type: "string",
                      description:
                        "The machine type to be used for this instance.",
                    },
                  },
                  additionalProperties: true,
                },
                preservedStateFromPolicy: {
                  type: "object",
                  properties: {
                    metadata: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved metadata defined for this instance.",
                    },
                    externalIPs: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Preserved external IPs defined for this instance.\nThis map is keyed with the name of the network interface.",
                    },
                    internalIPs: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Preserved internal IPs defined for this instance.\nThis map is keyed with the name of the network interface.",
                    },
                    disks: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Preserved disks defined for this instance.\nThis map is keyed with the device names of the disks.",
                    },
                  },
                  description: "Preserved state for a given instance.",
                  additionalProperties: true,
                },
                preservedStateFromConfig: {
                  type: "object",
                  properties: {
                    metadata: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Preserved metadata defined for this instance.",
                    },
                    externalIPs: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Preserved external IPs defined for this instance.\nThis map is keyed with the name of the network interface.",
                    },
                    internalIPs: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Preserved internal IPs defined for this instance.\nThis map is keyed with the name of the network interface.",
                    },
                    disks: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Preserved disks defined for this instance.\nThis map is keyed with the device names of the disks.",
                    },
                  },
                  description: "Preserved state for a given instance.",
                  additionalProperties: true,
                },
                instanceStatus: {
                  type: "string",
                  enum: [
                    "DEPROVISIONING",
                    "PENDING",
                    "PROVISIONING",
                    "REPAIRING",
                    "RUNNING",
                    "STAGING",
                    "STOPPED",
                    "STOPPING",
                    "SUSPENDED",
                    "SUSPENDING",
                    "TERMINATED",
                  ],
                  description:
                    "[Output Only] The status of the instance. This field is empty when\nthe instance does not exist.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output only] The unique identifier for this resource. This field is empty\nwhen instance does not exist. (Format: uint64)",
                },
                instanceHealth: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      healthCheck: {
                        type: "string",
                        description:
                          "[Output Only] The URL for the health check that verifies whether the\ninstance is healthy.",
                      },
                      detailedHealthState: {
                        type: "string",
                        enum: [
                          "DRAINING",
                          "HEALTHY",
                          "TIMEOUT",
                          "UNHEALTHY",
                          "UNKNOWN",
                        ],
                        description:
                          "[Output Only] The current detailed instance health state.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "[Output Only] Health state of the instance per health-check.",
                },
                name: {
                  type: "string",
                  description:
                    "[Output Only] The name of the instance. The name always exists even if the\ninstance has not yet been created.",
                },
                lastAttempt: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "object",
                      properties: {
                        errors: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              message: {
                                type: "string",
                                description:
                                  "[Output Only] An optional, human-readable error message.",
                              },
                              code: {
                                type: "string",
                                description:
                                  "[Output Only] The error type identifier for this error.",
                              },
                              location: {
                                type: "string",
                                description:
                                  "[Output Only] Indicates the field in the request that caused the error.\nThis property is optional.",
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
                                          description:
                                            "The name of the quota limit.",
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
                                    help: {
                                      type: "object",
                                      properties: {
                                        links: {
                                          type: "array",
                                          items: {
                                            type: "object",
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
                            },
                            additionalProperties: true,
                          },
                          description:
                            "[Output Only] The array of errors encountered while processing this\noperation.",
                        },
                      },
                      description:
                        "[Output Only] Encountered errors during the last attempt to create or\ndelete the instance.",
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                instance: {
                  type: "string",
                  description:
                    "[Output Only] The URL of the instance. The URL can exist even if the\ninstance has not yet been created.",
                },
                version: {
                  type: "object",
                  properties: {
                    instanceTemplate: {
                      type: "string",
                      description:
                        "[Output Only] The intended template of the instance. This field is empty\nwhen current_action is one of { DELETING, ABANDONING }.",
                    },
                    name: {
                      type: "string",
                      description: "[Output Only] Name of the version.",
                    },
                  },
                  additionalProperties: true,
                },
              },
              description: "A Managed Instance resource.",
              additionalProperties: true,
            },
            description:
              "[Output Only] The list of instances in the managed instance group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default instanceGroupManagersListManagedInstances;
