import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const interconnectsInsert: AppBlock = {
  name: "Interconnects - Insert",
  description: `Creates an Interconnect in the specified project using the data included in the request.`,
  category: "Interconnects",
  inputs: {
    default: {
      config: {
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        location: {
          name: "Location",
          description:
            "URL of the InterconnectLocation object that represents where this connection is to be provisioned.",
          type: {
            type: "string",
            description:
              "URL of the InterconnectLocation object that represents where this\nconnection is to be provisioned.",
          },
          required: false,
        },
        applicationAwareInterconnect: {
          name: "Application Aware Interconnect",
          description:
            "Configuration information for application awareness on this Cloud Interconnect.",
          type: {
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
                description: "Specify configuration for StrictPriorityPolicy.",
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
          required: false,
        },
        requestedFeatures: {
          name: "Requested Features",
          description: "Optional.",
          type: {
            type: "array",
            items: {
              type: "string",
              enum: ["IF_CROSS_SITE_NETWORK", "IF_L2_FORWARDING", "IF_MACSEC"],
            },
            description:
              "Optional. This parameter can be provided only with Interconnect INSERT. It\nisn't valid for Interconnect PATCH. List of features requested for this\nInterconnect connection, which can take one of the following values:\n   \n   - IF_MACSEC: If specified, then the connection is created on MACsec\n   capable hardware ports. If not specified, non-MACsec capable ports will\n   also be considered.\n   - IF_CROSS_SITE_NETWORK: If specified, then the connection is created\n   exclusively for Cross-Site Networking. The connection can not be used for\n   Cross-Site Networking unless this feature is specified.",
          },
          required: false,
        },
        provisionedLinkCount: {
          name: "Provisioned Link Count",
          description:
            "[Output Only] Number of links actually provisioned in this interconnect.",
          type: {
            type: "integer",
            description:
              "[Output Only] Number of links actually provisioned in this interconnect. (Format: int32)",
          },
          required: false,
        },
        customerName: {
          name: "Customer Name",
          description:
            "Customer name, to put in the Letter of Authorization as the party authorized to request a crossconnect.",
          type: {
            type: "string",
            description:
              "Customer name, to put in the Letter of Authorization as the party\nauthorized to request a crossconnect.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        peerIpAddress: {
          name: "Peer IP Address",
          description:
            "[Output Only] IP address configured on the customer side of the Interconnect link.",
          type: {
            type: "string",
            description:
              "[Output Only] IP address configured on the customer side of the\nInterconnect link. The customer should configure this IP address during\nturnup when prompted by Google NOC. This can be used only for ping tests.",
          },
          required: false,
        },
        operationalStatus: {
          name: "Operational Status",
          description:
            "[Output Only] The current status of this Interconnect's functionality, which can take one of the following values: - OS_ACTIVE: A valid Interconnect, which is turned up and is ready to use.",
          type: {
            type: "string",
            enum: ["OS_ACTIVE", "OS_UNPROVISIONED"],
            description:
              "[Output Only] The current status of this Interconnect's functionality,\nwhich can take one of the following values:\n   \n   - OS_ACTIVE: A valid Interconnect, which is turned up and is ready to\n   use. Attachments may be provisioned on this Interconnect.\n\n- OS_UNPROVISIONED: An Interconnect that has not completed turnup. No\nattachments may be provisioned on this Interconnect.\n- OS_UNDER_MAINTENANCE: An Interconnect that is undergoing internal\nmaintenance. No attachments may be provisioned or updated on this\nInterconnect.",
          },
          required: false,
        },
        macsec: {
          name: "Macsec",
          description:
            "Configuration that enables Media Access Control security (MACsec) on the Cloud Interconnect connection between Google and your on-premises router.",
          type: {
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
          required: false,
        },
        state: {
          name: "State",
          description:
            "[Output Only] The current state of Interconnect functionality, which can take one of the following values: - ACTIVE: The Interconnect is valid, turned up and ready to use.",
          type: {
            type: "string",
            enum: ["ACTIVE", "UNPROVISIONED"],
            description:
              "[Output Only] The current state of Interconnect functionality, which can\ntake one of the following values:\n   \n   - ACTIVE: The Interconnect is valid, turned up and ready to use.\n   Attachments may be provisioned on this Interconnect.\n   - UNPROVISIONED: The Interconnect has not completed turnup. No\n   attachments may be provisioned on this Interconnect.\n   - UNDER_MAINTENANCE: The Interconnect is undergoing internal maintenance.\n   No attachments may be provisioned or updated on this\n   Interconnect.",
          },
          required: false,
        },
        availableFeatures: {
          name: "Available Features",
          description:
            "[Output only] List of features available for this Interconnect connection, which can take one of the following values: - IF_MACSEC: If present, then the Interconnect connection is provisioned on MACsec capable hardware ports.",
          type: {
            type: "array",
            items: {
              type: "string",
              enum: ["IF_CROSS_SITE_NETWORK", "IF_L2_FORWARDING", "IF_MACSEC"],
            },
            description:
              "[Output only] List of features available for this Interconnect connection,\nwhich can take one of the following values:\n   \n   - IF_MACSEC: If present, then the Interconnect connection is\n   provisioned on MACsec capable hardware ports. If not present, then the\n   Interconnect connection is provisioned on non-MACsec capable ports. Any\n   attempt to enable MACsec will fail.\n   - IF_CROSS_SITE_NETWORK: If present, then the Interconnect connection is\n   provisioned exclusively for Cross-Site Networking. Any attempt to configure\n   VLAN attachments will fail. If not present, then the Interconnect\n   connection is not provisioned for Cross-Site Networking. Any attempt to use\n   it for Cross-Site Networking will fail.",
          },
          required: false,
        },
        googleReferenceId: {
          name: "Google Reference ID",
          description:
            "[Output Only] Google reference ID to be used when raising support tickets with Google or otherwise to debug backend connectivity issues.",
          type: {
            type: "string",
            description:
              "[Output Only] Google reference ID to be used when raising support tickets\nwith Google or otherwise to debug backend connectivity issues.",
          },
          required: false,
        },
        subzone: {
          name: "Subzone",
          description:
            "Specific subzone in the InterconnectLocation that represents where this connection is to be provisioned.",
          type: {
            type: "string",
            enum: ["SUBZONE_A", "SUBZONE_B"],
            description:
              "Specific subzone in the InterconnectLocation that represents where\nthis connection is to be provisioned.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
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
        remoteLocation: {
          name: "Remote Location",
          description: "Indicates that this is a Cross-Cloud Interconnect.",
          type: {
            type: "string",
            description:
              "Indicates that this is a Cross-Cloud Interconnect. This field specifies the\nlocation outside of Google's network that the interconnect is connected to.",
          },
          required: false,
        },
        requestedLinkCount: {
          name: "Requested Link Count",
          description:
            "Target number of physical links in the link bundle, as requested by the customer.",
          type: {
            type: "integer",
            description:
              "Target number of physical links in the link bundle, as requested by the\ncustomer. (Format: int32)",
          },
          required: false,
        },
        interconnectAttachments: {
          name: "Interconnect Attachments",
          description:
            "[Output Only] A list of the URLs of all InterconnectAttachments configured to use this Interconnect.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] A list of the URLs of all InterconnectAttachments configured\nto use  this Interconnect.",
          },
          required: false,
        },
        params: {
          name: "Params",
          description: "Input only.",
          type: {
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
          required: false,
        },
        adminEnabled: {
          name: "Admin Enabled",
          description: "Administrative status of the interconnect.",
          type: {
            type: "boolean",
            description:
              "Administrative status of the interconnect. When this is set to true, the\nInterconnect is functional and can carry traffic.\nWhen set to false, no packets can be carried over the interconnect and\nno BGP routes are exchanged over it. By default, the status is set to true.",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "[Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          required: false,
        },
        expectedOutages: {
          name: "Expected Outages",
          description:
            "[Output Only] A list of outages expected for this Interconnect.",
          type: {
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
                  description: "A description about the purpose of the outage.",
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
          required: false,
        },
        interconnectGroups: {
          name: "Interconnect Groups",
          description:
            "[Output Only] URLs of InterconnectGroups that include this Interconnect.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] URLs of InterconnectGroups that include this Interconnect.\nOrder is arbitrary and items are unique.",
          },
          required: false,
        },
        aaiEnabled: {
          name: "Aai Enabled",
          description:
            "Enable or disable the application awareness feature on this Cloud Interconnect.",
          type: {
            type: "boolean",
            description:
              "Enable or disable the application awareness feature on this Cloud\nInterconnect.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          required: false,
        },
        googleIpAddress: {
          name: "Google IP Address",
          description:
            "[Output Only] IP address configured on the Google side of the Interconnect link.",
          type: {
            type: "string",
            description:
              "[Output Only] IP address configured on the Google side of the Interconnect\nlink. This can be used only for ping tests.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description: "[Output Only] The unique identifier for the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          required: false,
        },
        circuitInfos: {
          name: "Circuit Infos",
          description:
            "[Output Only] A list of CircuitInfo objects, that describe the individual circuits in this LAG.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                customerDemarcId: {
                  type: "string",
                  description: "Customer-side demarc ID for this circuit.",
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
          required: false,
        },
        labels: {
          name: "Labels",
          description: "Labels for this resource.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
          },
          required: false,
        },
        nocContactEmail: {
          name: "Noc Contact Email",
          description:
            "Email address to contact the customer NOC for operations and maintenance notifications regarding this Interconnect.",
          type: {
            type: "string",
            description:
              "Email address to contact the customer NOC for operations and maintenance\nnotifications regarding this Interconnect. If specified, this will be used\nfor notifications in addition to all other forms described, such as\nCloud Monitoring logs alerting and Cloud Notifications. This field is\nrequired for users who sign up for Cloud Interconnect using\nworkforce identity federation.",
          },
          required: false,
        },
        wireGroups: {
          name: "Wire Groups",
          description:
            "[Output Only] A list of the URLs of all CrossSiteNetwork WireGroups configured to use this Interconnect.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] A list of the URLs of all CrossSiteNetwork WireGroups\nconfigured to use this Interconnect. The Interconnect cannot be deleted if\nthis list is non-empty.",
          },
          required: false,
        },
        macsecEnabled: {
          name: "Macsec Enabled",
          description:
            "Enable or disable MACsec on this Interconnect connection.",
          type: {
            type: "boolean",
            description:
              "Enable or disable MACsec on this Interconnect connection. MACsec enablement\nfails if the MACsec object is not specified.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this Interconnect, which is essentially a hash of the labels set used for optimistic locking.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this Interconnect, which\nis essentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an Interconnect. (Format: byte)",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#interconnect for interconnects.",
          },
          required: false,
        },
        linkType: {
          name: "Link Type",
          description:
            "Type of link requested, which can take one of the following values: - LINK_TYPE_ETHERNET_10G_LR: A 10G Ethernet with LR optics - LINK_TYPE_ETHERNET_100G_LR: A 100G Ethernet with LR optics.",
          type: {
            type: "string",
            enum: [
              "LINK_TYPE_ETHERNET_100G_LR",
              "LINK_TYPE_ETHERNET_10G_LR",
              "LINK_TYPE_ETHERNET_400G_LR4",
            ],
            description:
              "Type of link requested, which can take one of the following values:\n   \n   - LINK_TYPE_ETHERNET_10G_LR: A 10G Ethernet with LR optics\n   - LINK_TYPE_ETHERNET_100G_LR: A 100G Ethernet with LR optics.\n   - LINK_TYPE_ETHERNET_400G_LR4: A 400G Ethernet with LR4 optics.\n\n\n Note that this field indicates the speed of each of\nthe links in the bundle, not the speed of the entire bundle.",
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
        let path = `projects/{project}/global/interconnects`;

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

        if (input.event.inputConfig.location !== undefined)
          requestBody.location = input.event.inputConfig.location;
        if (input.event.inputConfig.applicationAwareInterconnect !== undefined)
          requestBody.applicationAwareInterconnect =
            input.event.inputConfig.applicationAwareInterconnect;
        if (input.event.inputConfig.requestedFeatures !== undefined)
          requestBody.requestedFeatures =
            input.event.inputConfig.requestedFeatures;
        if (input.event.inputConfig.provisionedLinkCount !== undefined)
          requestBody.provisionedLinkCount =
            input.event.inputConfig.provisionedLinkCount;
        if (input.event.inputConfig.customerName !== undefined)
          requestBody.customerName = input.event.inputConfig.customerName;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.peerIpAddress !== undefined)
          requestBody.peerIpAddress = input.event.inputConfig.peerIpAddress;
        if (input.event.inputConfig.operationalStatus !== undefined)
          requestBody.operationalStatus =
            input.event.inputConfig.operationalStatus;
        if (input.event.inputConfig.macsec !== undefined)
          requestBody.macsec = input.event.inputConfig.macsec;
        if (input.event.inputConfig.state !== undefined)
          requestBody.state = input.event.inputConfig.state;
        if (input.event.inputConfig.availableFeatures !== undefined)
          requestBody.availableFeatures =
            input.event.inputConfig.availableFeatures;
        if (input.event.inputConfig.googleReferenceId !== undefined)
          requestBody.googleReferenceId =
            input.event.inputConfig.googleReferenceId;
        if (input.event.inputConfig.subzone !== undefined)
          requestBody.subzone = input.event.inputConfig.subzone;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          requestBody.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.remoteLocation !== undefined)
          requestBody.remoteLocation = input.event.inputConfig.remoteLocation;
        if (input.event.inputConfig.requestedLinkCount !== undefined)
          requestBody.requestedLinkCount =
            input.event.inputConfig.requestedLinkCount;
        if (input.event.inputConfig.interconnectAttachments !== undefined)
          requestBody.interconnectAttachments =
            input.event.inputConfig.interconnectAttachments;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.adminEnabled !== undefined)
          requestBody.adminEnabled = input.event.inputConfig.adminEnabled;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.expectedOutages !== undefined)
          requestBody.expectedOutages = input.event.inputConfig.expectedOutages;
        if (input.event.inputConfig.interconnectGroups !== undefined)
          requestBody.interconnectGroups =
            input.event.inputConfig.interconnectGroups;
        if (input.event.inputConfig.aaiEnabled !== undefined)
          requestBody.aaiEnabled = input.event.inputConfig.aaiEnabled;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.googleIpAddress !== undefined)
          requestBody.googleIpAddress = input.event.inputConfig.googleIpAddress;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.circuitInfos !== undefined)
          requestBody.circuitInfos = input.event.inputConfig.circuitInfos;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.nocContactEmail !== undefined)
          requestBody.nocContactEmail = input.event.inputConfig.nocContactEmail;
        if (input.event.inputConfig.wireGroups !== undefined)
          requestBody.wireGroups = input.event.inputConfig.wireGroups;
        if (input.event.inputConfig.macsecEnabled !== undefined)
          requestBody.macsecEnabled = input.event.inputConfig.macsecEnabled;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          requestBody.labelFingerprint =
            input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.linkType !== undefined)
          requestBody.linkType = input.event.inputConfig.linkType;

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

export default interconnectsInsert;
