import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const interconnectsGet: AppBlock = {
  name: "Interconnects - Get",
  description: `Returns the specified Zone resource.`,
  category: "Interconnects",
  inputs: {
    default: {
      config: {
        interconnect: {
          name: "Interconnect",
          description: "Name of the interconnect to return.",
          type: {
            type: "string",
            description: "Name of the interconnect to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.interconnect !== undefined)
          pathParams["interconnect"] = String(
            input.event.inputConfig.interconnect,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/interconnects/{interconnect}",
          pathParams,
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
          aaiEnabled: {
            type: "boolean",
            description:
              "Enable or disable the application awareness feature on this Cloud Interconnect.",
          },
          adminEnabled: {
            type: "boolean",
            description:
              "Administrative status of the interconnect. When this is set to true, the Interconnect is functional and can carry traffic. When set to false, no packets can be carried over the interconnect and no BGP routes are exchanged over it. By default, the status is set to true.",
          },
          applicationAwareInterconnect: {
            type: "object",
            properties: {
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
                            "Bandwidth percentage for a specific traffic class.",
                        },
                        trafficClass: {
                          type: "string",
                          enum: [
                            "UNDEFINED_TRAFFIC_CLASS",
                            "TC1",
                            "TC2",
                            "TC3",
                            "TC4",
                            "TC5",
                            "TC6",
                          ],
                          description:
                            "TrafficClass whose bandwidth percentage is being specified. Check the TrafficClass enum for the list of possible values.",
                        },
                      },
                      description:
                        "Specify bandwidth percentages [1-100] for various traffic classes in BandwidthPercentagePolicy. The sum of all percentages must equal 100. All traffic classes must have a percentage value specified.",
                      additionalProperties: true,
                    },
                    description:
                      "Specify bandwidth percentages for various traffic classes for queuing type Bandwidth Percent.",
                  },
                },
                additionalProperties: true,
              },
              profileDescription: {
                type: "string",
                description:
                  "Description for the application awareness profile on this Cloud Interconnect.",
              },
              shapeAveragePercentages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    percentage: {
                      type: "integer",
                      description:
                        "Bandwidth percentage for a specific traffic class.",
                    },
                    trafficClass: {
                      type: "string",
                      enum: [
                        "UNDEFINED_TRAFFIC_CLASS",
                        "TC1",
                        "TC2",
                        "TC3",
                        "TC4",
                        "TC5",
                        "TC6",
                      ],
                      description:
                        "TrafficClass whose bandwidth percentage is being specified. Check the TrafficClass enum for the list of possible values.",
                    },
                  },
                  description:
                    "Specify bandwidth percentages [1-100] for various traffic classes in BandwidthPercentagePolicy. The sum of all percentages must equal 100. All traffic classes must have a percentage value specified.",
                  additionalProperties: true,
                },
                description:
                  "Optional field to specify a list of shape average percentages to be applied in conjunction with StrictPriorityPolicy or BandwidthPercentagePolicy.",
              },
              strictPriorityPolicy: {
                type: "object",
                properties: {},
                description: "Specify configuration for StrictPriorityPolicy.",
                additionalProperties: true,
              },
            },
            description:
              "Configuration information for application awareness on this Cloud Interconnect.",
            additionalProperties: true,
          },
          availableFeatures: {
            type: "array",
            items: {
              type: "string",
              enum: ["UNDEFINED_AVAILABLE_FEATURES"],
            },
            description:
              "[Output only] List of features available for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If present, then the Interconnect connection is    provisioned on MACsec capable hardware ports. If not present, then the    Interconnect connection is provisioned on non-MACsec capable ports. Any    attempt to enable MACsec will fail.    - IF_CROSS_SITE_NETWORK: If present, then the Interconnect connection is    provisioned exclusively for Cross-Site Networking. Any attempt to configure    VLAN attachments will fail. If not present, then the Interconnect    connection is not provisioned for Cross-Site Networking. Any attempt to use    it for Cross-Site Networking will fail. Check the AvailableFeatures enum for the list of possible values.",
          },
          circuitInfos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                customerDemarcId: {
                  type: "string",
                  description: "Customer-side demarc ID for this circuit.",
                },
                googleCircuitId: {
                  type: "string",
                  description:
                    "Google-assigned unique ID for this circuit. Assigned at circuit turn-up.",
                },
                googleDemarcId: {
                  type: "string",
                  description:
                    "Google-side demarc ID for this circuit. Assigned at circuit turn-up and provided by Google to the customer in the LOA.",
                },
              },
              description:
                "Describes a single physical circuit between the Customer and Google. CircuitInfo objects are created by Google, so all fields are output only.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] A list of CircuitInfo objects, that describe the individual circuits in this LAG.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          customerName: {
            type: "string",
            description:
              "Customer name, to put in the Letter of Authorization as the party authorized to request a crossconnect.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          expectedOutages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                affectedCircuits: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "If issue_type is IT_PARTIAL_OUTAGE, a list of the Google-side circuit IDs that will be affected.",
                },
                description: {
                  type: "string",
                  description: "A description about the purpose of the outage.",
                },
                endTime: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                issueType: {
                  type: "string",
                  enum: [
                    "UNDEFINED_ISSUE_TYPE",
                    "IT_OUTAGE",
                    "IT_PARTIAL_OUTAGE",
                    "OUTAGE",
                    "PARTIAL_OUTAGE",
                  ],
                  description:
                    'Form this outage is expected to take, which can take one of the following values:     - OUTAGE: The Interconnect may be completely out of service for    some or all of the specified window.    - PARTIAL_OUTAGE: Some circuits comprising the Interconnect as a whole    should remain up, but with reduced bandwidth.   Note that the versions of this enum prefixed with "IT_" have been deprecated in favor of the unprefixed values. Check the IssueType enum for the list of possible values.',
                },
                name: {
                  type: "string",
                  description:
                    "Unique identifier for this outage notification.",
                },
                source: {
                  type: "string",
                  enum: ["UNDEFINED_SOURCE", "GOOGLE", "NSRC_GOOGLE"],
                  description:
                    "The party that generated this notification, which can take the following value:     - GOOGLE: this notification as generated by Google.   Note that the value of NSRC_GOOGLE has been deprecated in favor of GOOGLE. Check the Source enum for the list of possible values.",
                },
                startTime: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                state: {
                  type: "string",
                  enum: [
                    "UNDEFINED_STATE",
                    "ACTIVE",
                    "CANCELLED",
                    "COMPLETED",
                    "NS_ACTIVE",
                    "NS_CANCELED",
                  ],
                  description:
                    'State of this notification, which can take one of the following values:     - ACTIVE: This outage notification is active. The event could be in    the past, present, or future. See start_time and end_time for    scheduling.    - CANCELLED: The outage associated with this notification was cancelled    before the outage was due to start.    - COMPLETED: The outage associated with this notification is complete.   Note that the versions of this enum prefixed with "NS_" have been deprecated in favor of the unprefixed values. Check the State enum for the list of possible values.',
                },
              },
              description:
                "Description of a planned outage on this Interconnect.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] A list of outages expected for this Interconnect.",
          },
          googleIpAddress: {
            type: "string",
            description:
              "Output only. [Output Only] IP address configured on the Google side of the Interconnect link. This can be used only for ping tests.",
          },
          googleReferenceId: {
            type: "string",
            description:
              "Output only. [Output Only] Google reference ID to be used when raising support tickets with Google or otherwise to debug backend connectivity issues.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          interconnectAttachments: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] A list of the URLs of all InterconnectAttachments configured to use  this Interconnect.",
          },
          interconnectGroups: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] URLs of InterconnectGroups that include this Interconnect. Order is arbitrary and items are unique.",
          },
          interconnectType: {
            type: "string",
            enum: [
              "UNDEFINED_INTERCONNECT_TYPE",
              "DEDICATED",
              "IT_PRIVATE",
              "PARTNER",
            ],
            description:
              "Type of interconnect, which can take one of the following values:     - PARTNER: A partner-managed interconnection shared between customers    though a partner.    - DEDICATED: A dedicated physical interconnection with the    customer.   Note that a value IT_PRIVATE has been deprecated in favor of DEDICATED. Check the InterconnectType enum for the list of possible values.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#interconnect for interconnects.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this Interconnect, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an Interconnect.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
          },
          linkType: {
            type: "string",
            enum: [
              "UNDEFINED_LINK_TYPE",
              "LINK_TYPE_ETHERNET_100G_LR",
              "LINK_TYPE_ETHERNET_10G_LR",
              "LINK_TYPE_ETHERNET_400G_LR4",
            ],
            description:
              "Type of link requested, which can take one of the following values:     - LINK_TYPE_ETHERNET_10G_LR: A 10G Ethernet with LR optics    - LINK_TYPE_ETHERNET_100G_LR: A 100G Ethernet with LR optics.    - LINK_TYPE_ETHERNET_400G_LR4: A 400G Ethernet with LR4 optics.    Note that this field indicates the speed of each of the links in the bundle, not the speed of the entire bundle. Check the LinkType enum for the list of possible values.",
          },
          location: {
            type: "string",
            description:
              "URL of the InterconnectLocation object that represents where this connection is to be provisioned.",
          },
          macsec: {
            type: "object",
            properties: {
              failOpen: {
                type: "boolean",
                description:
                  "If set to true, the Interconnect connection is configured with ashould-secure MACsec security policy, that allows the Google router to fallback to cleartext traffic if the MKA session cannot be established. By default, the Interconnect connection is configured with amust-secure security policy that drops all traffic if the MKA session cannot be established with your router.",
              },
              preSharedKeys: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "Required. A name for this pre-shared key. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                    },
                    startTime: {
                      type: "string",
                      description:
                        "A RFC3339 timestamp on or after which the key is valid. startTime can be in the future. If the keychain has a single key, startTime can be omitted. If the keychain has multiple keys, startTime is mandatory for each key. The start times of keys must be in increasing order. The start times of two consecutive keys must be at least 6 hours apart.",
                    },
                  },
                  description:
                    "Describes a pre-shared key used to setup MACsec in static connectivity association key (CAK) mode.",
                  additionalProperties: true,
                },
                description:
                  "Required. A keychain placeholder describing a set of named key objects along with their start times. A MACsec CKN/CAK is generated for each key in the key chain. Google router automatically picks the key with the most recent startTime when establishing or re-establishing a MACsec secure link.",
              },
            },
            description:
              "Configuration information for enabling Media Access Control security (MACsec) on this Cloud Interconnect connection between Google and your on-premises router.",
            additionalProperties: true,
          },
          macsecEnabled: {
            type: "boolean",
            description:
              "Enable or disable MACsec on this Interconnect connection. MACsec enablement fails if the MACsec object is not specified.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          nocContactEmail: {
            type: "string",
            description:
              "Email address to contact the customer NOC for operations and maintenance notifications regarding this Interconnect. If specified, this will be used for notifications in addition to all other forms described, such as Cloud Monitoring logs alerting and Cloud Notifications. This field is required for users who sign up for Cloud Interconnect using workforce identity federation.",
          },
          operationalStatus: {
            type: "string",
            enum: [
              "UNDEFINED_OPERATIONAL_STATUS",
              "OS_ACTIVE",
              "OS_UNPROVISIONED",
            ],
            description:
              "Output only. [Output Only] The current status of this Interconnect's functionality, which can take one of the following values:     - OS_ACTIVE: A valid Interconnect, which is turned up and is ready to    use. Attachments may be provisioned on this Interconnect.  - OS_UNPROVISIONED: An Interconnect that has not completed turnup. No attachments may be provisioned on this Interconnect. - OS_UNDER_MAINTENANCE: An Interconnect that is undergoing internal maintenance. No attachments may be provisioned or updated on this Interconnect. Check the OperationalStatus enum for the list of possible values.",
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
                  'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid. * Inconsistent format is not supported. For instance:   {"tagKeys/333" : "tagValues/444", "123/env" : "prod"} is invalid.',
              },
            },
            description: "Additional interconnect parameters.",
            additionalProperties: true,
          },
          peerIpAddress: {
            type: "string",
            description:
              "Output only. [Output Only] IP address configured on the customer side of the Interconnect link. The customer should configure this IP address during turnup when prompted by Google NOC. This can be used only for ping tests.",
          },
          provisionedLinkCount: {
            type: "integer",
            description:
              "Output only. [Output Only] Number of links actually provisioned in this interconnect.",
          },
          remoteLocation: {
            type: "string",
            description:
              "Indicates that this is a Cross-Cloud Interconnect. This field specifies the location outside of Google's network that the interconnect is connected to.",
          },
          requestedFeatures: {
            type: "array",
            items: {
              type: "string",
              enum: ["UNDEFINED_REQUESTED_FEATURES"],
            },
            description:
              "Optional. This parameter can be provided only with Interconnect INSERT. It isn't valid for Interconnect PATCH. List of features requested for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If specified, then the connection is created on MACsec    capable hardware ports. If not specified, non-MACsec capable ports will    also be considered.    - IF_CROSS_SITE_NETWORK: If specified, then the connection is created    exclusively for Cross-Site Networking. The connection can not be used for    Cross-Site Networking unless this feature is specified. Check the RequestedFeatures enum for the list of possible values.",
          },
          requestedLinkCount: {
            type: "integer",
            description:
              "Target number of physical links in the link bundle, as requested by the customer.",
          },
          satisfiesPzs: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          state: {
            type: "string",
            enum: ["UNDEFINED_STATE", "ACTIVE", "UNPROVISIONED"],
            description:
              "Output only. [Output Only] The current state of Interconnect functionality, which can take one of the following values:     - ACTIVE: The Interconnect is valid, turned up and ready to use.    Attachments may be provisioned on this Interconnect.    - UNPROVISIONED: The Interconnect has not completed turnup. No    attachments may be provisioned on this Interconnect.    - UNDER_MAINTENANCE: The Interconnect is undergoing internal maintenance.    No attachments may be provisioned or updated on this    Interconnect. Check the State enum for the list of possible values.",
          },
          subzone: {
            type: "string",
            enum: ["UNDEFINED_SUBZONE", "SUBZONE_A", "SUBZONE_B"],
            description:
              "Specific subzone in the InterconnectLocation that represents where this connection is to be provisioned. Check the Subzone enum for the list of possible values.",
          },
          wireGroups: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] A list of the URLs of all CrossSiteNetwork WireGroups configured to use this Interconnect. The Interconnect cannot be deleted if this list is non-empty.",
          },
        },
        description:
          "Represents an Interconnect resource.  An Interconnect resource is a dedicated connection between the Google Cloud network and your on-premises network. For more information, read the Dedicated Interconnect Overview.",
        additionalProperties: true,
      },
    },
  },
};

export default interconnectsGet;
