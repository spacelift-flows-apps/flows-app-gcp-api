import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const interconnectsList: AppBlock = {
  name: "Interconnects - List",
  description: `Retrieves the list of Interconnects available to the specified project.`,
  category: "Interconnects",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
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
        let path = `projects/{project}/global/interconnects`;

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
          warning: {
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
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Alwayscompute#interconnectList for lists of interconnects.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description:
                    "URL of the InterconnectLocation object that represents where this\nconnection is to be provisioned.",
                },
                applicationAwareInterconnect: {
                  type: "object",
                  properties: {
                    profileDescription: {
                      type: "string",
                      description:
                        "Description for the application awareness profile on this Cloud\nInterconnect.",
                    },
                    strictPriorityPolicy: {
                      type: "object",
                      properties: {},
                      description:
                        "Specify configuration for StrictPriorityPolicy.",
                      additionalProperties: true,
                    },
                    bandwidthPercentagePolicy: {
                      type: "object",
                      properties: {
                        bandwidthPercentages: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              percentage: {
                                type: "integer",
                                description:
                                  "Bandwidth percentage for a specific traffic class. (Format: uint32)",
                              },
                              trafficClass: {
                                type: "string",
                                enum: [
                                  "TC1",
                                  "TC2",
                                  "TC3",
                                  "TC4",
                                  "TC5",
                                  "TC6",
                                ],
                                description:
                                  "TrafficClass whose bandwidth percentage is being specified.",
                              },
                            },
                            description:
                              "Specify bandwidth percentages [1-100] for various traffic classes in\nBandwidthPercentagePolicy. The sum of all percentages must equal 100.\nAll traffic classes must have a percentage value specified.",
                            additionalProperties: true,
                          },
                          description:
                            "Specify bandwidth percentages for various traffic classes for queuing\ntype Bandwidth Percent.",
                        },
                      },
                      additionalProperties: true,
                    },
                    shapeAveragePercentages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          percentage: {
                            type: "integer",
                            description:
                              "Bandwidth percentage for a specific traffic class. (Format: uint32)",
                          },
                          trafficClass: {
                            type: "string",
                            enum: ["TC1", "TC2", "TC3", "TC4", "TC5", "TC6"],
                            description:
                              "TrafficClass whose bandwidth percentage is being specified.",
                          },
                        },
                        description:
                          "Specify bandwidth percentages [1-100] for various traffic classes in\nBandwidthPercentagePolicy. The sum of all percentages must equal 100.\nAll traffic classes must have a percentage value specified.",
                        additionalProperties: true,
                      },
                      description:
                        "Optional field to specify a list of shape average percentages to be\napplied in conjunction with StrictPriorityPolicy or\nBandwidthPercentagePolicy.",
                    },
                  },
                  description:
                    "Configuration information for application awareness on this Cloud\nInterconnect.",
                  additionalProperties: true,
                },
                requestedFeatures: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "IF_CROSS_SITE_NETWORK",
                      "IF_L2_FORWARDING",
                      "IF_MACSEC",
                    ],
                  },
                  description:
                    "Optional. This parameter can be provided only with Interconnect INSERT. It\nisn't valid for Interconnect PATCH. List of features requested for this\nInterconnect connection, which can take one of the following values:\n   \n   - IF_MACSEC: If specified, then the connection is created on MACsec\n   capable hardware ports. If not specified, non-MACsec capable ports will\n   also be considered.\n   - IF_CROSS_SITE_NETWORK: If specified, then the connection is created\n   exclusively for Cross-Site Networking. The connection can not be used for\n   Cross-Site Networking unless this feature is specified.",
                },
                provisionedLinkCount: {
                  type: "integer",
                  description:
                    "[Output Only] Number of links actually provisioned in this interconnect. (Format: int32)",
                },
                customerName: {
                  type: "string",
                  description:
                    "Customer name, to put in the Letter of Authorization as the party\nauthorized to request a crossconnect.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                peerIpAddress: {
                  type: "string",
                  description:
                    "[Output Only] IP address configured on the customer side of the\nInterconnect link. The customer should configure this IP address during\nturnup when prompted by Google NOC. This can be used only for ping tests.",
                },
                operationalStatus: {
                  type: "string",
                  enum: ["OS_ACTIVE", "OS_UNPROVISIONED"],
                  description:
                    "[Output Only] The current status of this Interconnect's functionality,\nwhich can take one of the following values:\n   \n   - OS_ACTIVE: A valid Interconnect, which is turned up and is ready to\n   use. Attachments may be provisioned on this Interconnect.\n\n- OS_UNPROVISIONED: An Interconnect that has not completed turnup. No\nattachments may be provisioned on this Interconnect.\n- OS_UNDER_MAINTENANCE: An Interconnect that is undergoing internal\nmaintenance. No attachments may be provisioned or updated on this\nInterconnect.",
                },
                macsec: {
                  type: "object",
                  properties: {
                    preSharedKeys: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description:
                              "Required. A name for this pre-shared key.\nThe name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63\ncharacters long and match the regular expression\n`[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a\nlowercase letter, and all following characters must be a dash,\nlowercase letter, or digit, except the last character, which cannot be\na dash.",
                          },
                          startTime: {
                            type: "string",
                            description:
                              "A RFC3339 timestamp on or after which the key is\nvalid. startTime can be in the future. If the keychain has a single\nkey, startTime can be omitted. If the keychain has multiple keys,\nstartTime is mandatory for each key. The start times of keys must be in\nincreasing order. The start times of two consecutive keys must be\nat least 6 hours apart.",
                          },
                        },
                        description:
                          "Describes a pre-shared key used to setup MACsec in static connectivity\nassociation key (CAK) mode.",
                        additionalProperties: true,
                      },
                      description:
                        "Required. A keychain placeholder describing a set of named key objects\nalong with their start times. A MACsec CKN/CAK is generated for each\nkey in the key chain. Google router automatically picks the key with\nthe most recent startTime when establishing or re-establishing a MACsec\nsecure link.",
                    },
                    failOpen: {
                      type: "boolean",
                      description:
                        "If set to true, the Interconnect connection is configured with ashould-secure MACsec security policy, that allows the Google\nrouter to fallback to cleartext traffic if the MKA session cannot be\nestablished. By default, the Interconnect connection is configured with amust-secure security policy that drops all traffic if the\nMKA session cannot be established with your router.",
                    },
                  },
                  description:
                    "Configuration information for enabling Media Access Control security\n(MACsec) on this Cloud Interconnect connection between Google and your\non-premises router.",
                  additionalProperties: true,
                },
                state: {
                  type: "string",
                  enum: ["ACTIVE", "UNPROVISIONED"],
                  description:
                    "[Output Only] The current state of Interconnect functionality, which can\ntake one of the following values:\n   \n   - ACTIVE: The Interconnect is valid, turned up and ready to use.\n   Attachments may be provisioned on this Interconnect.\n   - UNPROVISIONED: The Interconnect has not completed turnup. No\n   attachments may be provisioned on this Interconnect.\n   - UNDER_MAINTENANCE: The Interconnect is undergoing internal maintenance.\n   No attachments may be provisioned or updated on this\n   Interconnect.",
                },
                availableFeatures: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "IF_CROSS_SITE_NETWORK",
                      "IF_L2_FORWARDING",
                      "IF_MACSEC",
                    ],
                  },
                  description:
                    "[Output only] List of features available for this Interconnect connection,\nwhich can take one of the following values:\n   \n   - IF_MACSEC: If present, then the Interconnect connection is\n   provisioned on MACsec capable hardware ports. If not present, then the\n   Interconnect connection is provisioned on non-MACsec capable ports. Any\n   attempt to enable MACsec will fail.\n   - IF_CROSS_SITE_NETWORK: If present, then the Interconnect connection is\n   provisioned exclusively for Cross-Site Networking. Any attempt to configure\n   VLAN attachments will fail. If not present, then the Interconnect\n   connection is not provisioned for Cross-Site Networking. Any attempt to use\n   it for Cross-Site Networking will fail.",
                },
                googleReferenceId: {
                  type: "string",
                  description:
                    "[Output Only] Google reference ID to be used when raising support tickets\nwith Google or otherwise to debug backend connectivity issues.",
                },
                subzone: {
                  type: "string",
                  enum: ["SUBZONE_A", "SUBZONE_B"],
                  description:
                    "Specific subzone in the InterconnectLocation that represents where\nthis connection is to be provisioned.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description: "[Output Only] Reserved for future use.",
                },
                remoteLocation: {
                  type: "string",
                  description:
                    "Indicates that this is a Cross-Cloud Interconnect. This field specifies the\nlocation outside of Google's network that the interconnect is connected to.",
                },
                requestedLinkCount: {
                  type: "integer",
                  description:
                    "Target number of physical links in the link bundle, as requested by the\ncustomer. (Format: int32)",
                },
                interconnectAttachments: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] A list of the URLs of all InterconnectAttachments configured\nto use  this Interconnect.",
                },
                params: {
                  type: "object",
                  properties: {
                    resourceManagerTags: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.\n* Inconsistent format is not supported. For instance:\n  {"tagKeys/333" : "tagValues/444", "123/env" : "prod"} is invalid.',
                    },
                  },
                  description: "Additional interconnect parameters.",
                  additionalProperties: true,
                },
                adminEnabled: {
                  type: "boolean",
                  description:
                    "Administrative status of the interconnect. When this is set to true, the\nInterconnect is functional and can carry traffic.\nWhen set to false, no packets can be carried over the interconnect and\nno BGP routes are exchanged over it. By default, the status is set to true.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                expectedOutages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      startTime: {
                        type: "string",
                        description:
                          "Scheduled start time for the outage (milliseconds since Unix\nepoch). (Format: int64)",
                      },
                      source: {
                        type: "string",
                        enum: ["GOOGLE", "NSRC_GOOGLE"],
                        description:
                          "The party that generated this notification, which can take the following\nvalue:\n   \n   - GOOGLE: this notification as generated by Google.\n\n\nNote that the value of NSRC_GOOGLE has been deprecated in favor of\nGOOGLE.",
                      },
                      affectedCircuits: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "If issue_type is IT_PARTIAL_OUTAGE, a list of the Google-side circuit\nIDs that will be affected.",
                      },
                      description: {
                        type: "string",
                        description:
                          "A description about the purpose of the outage.",
                      },
                      state: {
                        type: "string",
                        enum: [
                          "ACTIVE",
                          "CANCELLED",
                          "COMPLETED",
                          "NS_ACTIVE",
                          "NS_CANCELED",
                        ],
                        description:
                          'State of this notification, which can take one of the following values:\n   \n   - ACTIVE: This outage notification is active. The event could be in\n   the past, present, or future. See start_time and end_time for\n   scheduling.\n   - CANCELLED: The outage associated with this notification was cancelled\n   before the outage was due to start.\n   - COMPLETED: The outage associated with this notification is complete.\n\n\nNote that the versions of this enum prefixed with "NS_" have been\ndeprecated in favor of the unprefixed values.',
                      },
                      issueType: {
                        type: "string",
                        enum: [
                          "IT_OUTAGE",
                          "IT_PARTIAL_OUTAGE",
                          "OUTAGE",
                          "PARTIAL_OUTAGE",
                        ],
                        description:
                          'Form this outage is expected to take, which can take one of the following\nvalues:\n   \n   - OUTAGE: The Interconnect may be completely out of service for\n   some or all of the specified window.\n   - PARTIAL_OUTAGE: Some circuits comprising the Interconnect as a whole\n   should remain up, but with reduced bandwidth.\n\n\nNote that the versions of this enum prefixed with "IT_" have been\ndeprecated in favor of the unprefixed values.',
                      },
                      name: {
                        type: "string",
                        description:
                          "Unique identifier for this outage notification.",
                      },
                      endTime: {
                        type: "string",
                        description:
                          "Scheduled end time for the outage (milliseconds since Unix\nepoch). (Format: int64)",
                      },
                    },
                    description:
                      "Description of a planned outage on this Interconnect.",
                    additionalProperties: true,
                  },
                  description:
                    "[Output Only] A list of outages expected for this Interconnect.",
                },
                interconnectGroups: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] URLs of InterconnectGroups that include this Interconnect.\nOrder is arbitrary and items are unique.",
                },
                aaiEnabled: {
                  type: "boolean",
                  description:
                    "Enable or disable the application awareness feature on this Cloud\nInterconnect.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                googleIpAddress: {
                  type: "string",
                  description:
                    "[Output Only] IP address configured on the Google side of the Interconnect\nlink. This can be used only for ping tests.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                circuitInfos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      customerDemarcId: {
                        type: "string",
                        description:
                          "Customer-side demarc ID for this circuit.",
                      },
                      googleDemarcId: {
                        type: "string",
                        description:
                          "Google-side demarc ID for this circuit. Assigned at circuit turn-up and\nprovided by Google to the customer in the LOA.",
                      },
                      googleCircuitId: {
                        type: "string",
                        description:
                          "Google-assigned unique ID for this circuit. Assigned at circuit turn-up.",
                      },
                    },
                    description:
                      "Describes a single physical circuit between the Customer and Google.\nCircuitInfo objects are created by Google, so all fields are output only.",
                    additionalProperties: true,
                  },
                  description:
                    "[Output Only] A list of CircuitInfo objects, that describe the individual\ncircuits in this LAG.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
                },
                nocContactEmail: {
                  type: "string",
                  description:
                    "Email address to contact the customer NOC for operations and maintenance\nnotifications regarding this Interconnect. If specified, this will be used\nfor notifications in addition to all other forms described, such as\nCloud Monitoring logs alerting and Cloud Notifications. This field is\nrequired for users who sign up for Cloud Interconnect using\nworkforce identity federation.",
                },
                wireGroups: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] A list of the URLs of all CrossSiteNetwork WireGroups\nconfigured to use this Interconnect. The Interconnect cannot be deleted if\nthis list is non-empty.",
                },
                macsecEnabled: {
                  type: "boolean",
                  description:
                    "Enable or disable MACsec on this Interconnect connection. MACsec enablement\nfails if the MACsec object is not specified.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this Interconnect, which\nis essentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an Interconnect. (Format: byte)",
                },
                interconnectType: {
                  type: "string",
                  enum: ["DEDICATED", "IT_PRIVATE", "PARTNER"],
                  description:
                    "Type of interconnect, which can take one of the following values:\n   \n   - PARTNER: A partner-managed interconnection shared between customers\n   though a partner.\n   - DEDICATED: A dedicated physical interconnection with the\n   customer.\n\n\nNote that a value IT_PRIVATE has been deprecated in favor of DEDICATED.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#interconnect for interconnects.",
                },
                linkType: {
                  type: "string",
                  enum: [
                    "LINK_TYPE_ETHERNET_100G_LR",
                    "LINK_TYPE_ETHERNET_10G_LR",
                    "LINK_TYPE_ETHERNET_400G_LR4",
                  ],
                  description:
                    "Type of link requested, which can take one of the following values:\n   \n   - LINK_TYPE_ETHERNET_10G_LR: A 10G Ethernet with LR optics\n   - LINK_TYPE_ETHERNET_100G_LR: A 100G Ethernet with LR optics.\n   - LINK_TYPE_ETHERNET_400G_LR4: A 400G Ethernet with LR4 optics.\n\n\n Note that this field indicates the speed of each of\nthe links in the bundle, not the speed of the entire bundle.",
                },
              },
              description:
                "Represents an Interconnect resource.\n\nAn Interconnect resource is a dedicated connection between the Google\nCloud network and your on-premises network. For more information, read the\nDedicated Interconnect Overview.",
              additionalProperties: true,
            },
            description: "A list of Interconnect resources.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
        },
        description:
          "Response to the list request, and contains a list of interconnects.",
        additionalProperties: true,
      },
    },
  },
};

export default interconnectsList;
