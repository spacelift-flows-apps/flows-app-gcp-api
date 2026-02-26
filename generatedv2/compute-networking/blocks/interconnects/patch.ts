import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const patch: AppBlock = {
  name: "Interconnects - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Interconnects",
  inputs: {
    default: {
      config: {
        interconnect: {
          name: "Interconnect",
          description: "Name of the interconnect to update.",
          type: {
            type: "string",
          },
          required: true,
        },
        aaiEnabled: {
          name: "Aai Enabled",
          description:
            "Enable or disable the application awareness feature on this Cloud Interconnect.",
          type: {
            type: "boolean",
            description:
              "Enable or disable the application awareness feature on this Cloud Interconnect.",
          },
          required: false,
        },
        adminEnabled: {
          name: "Admin Enabled",
          description:
            "Administrative status of the interconnect. When this is set to true, the Interconnect is functional and can carry traffic. When set to false, no packets can be carried over the interconnect and no BGP routes are exchanged over it. By default, the status is set to true.",
          type: {
            type: "boolean",
            description:
              "Administrative status of the interconnect. When this is set to true, the Interconnect is functional and can carry traffic. When set to false, no packets can be carried over the interconnect and no BGP routes are exchanged over it. By default, the status is set to true.",
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
          required: false,
        },
        availableFeatures: {
          name: "Available Features",
          description:
            "[Output only] List of features available for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If present, then the Interconnect connection is    provisioned on MACsec capable hardware ports. If not present, then the    Interconnect connection is provisioned on non-MACsec capable ports. Any    attempt to enable MACsec will fail.    - IF_CROSS_SITE_NETWORK: If present, then the Interconnect connection is    provisioned exclusively for Cross-Site Networking. Any attempt to configure    VLAN attachments will fail. If not present, then the Interconnect    connection is not provisioned for Cross-Site Networking. Any attempt to use    it for Cross-Site Networking will fail. Check the AvailableFeatures enum for the list of possible values.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output only] List of features available for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If present, then the Interconnect connection is    provisioned on MACsec capable hardware ports. If not present, then the    Interconnect connection is provisioned on non-MACsec capable ports. Any    attempt to enable MACsec will fail.    - IF_CROSS_SITE_NETWORK: If present, then the Interconnect connection is    provisioned exclusively for Cross-Site Networking. Any attempt to configure    VLAN attachments will fail. If not present, then the Interconnect    connection is not provisioned for Cross-Site Networking. Any attempt to use    it for Cross-Site Networking will fail. Check the AvailableFeatures enum for the list of possible values.",
          },
          required: false,
        },
        circuitInfos: {
          name: "Circuit Infos",
          description:
            "Output only. [Output Only] A list of CircuitInfo objects, that describe the individual circuits in this LAG.",
          type: {
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
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
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
              "Customer name, to put in the Letter of Authorization as the party authorized to request a crossconnect.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          required: false,
        },
        expectedOutages: {
          name: "Expected Outages",
          description:
            "Output only. [Output Only] A list of outages expected for this Interconnect.",
          type: {
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
                  description:
                    "The party that generated this notification, which can take the following value:     - GOOGLE: this notification as generated by Google.   Note that the value of NSRC_GOOGLE has been deprecated in favor of GOOGLE. Check the Source enum for the list of possible values.",
                },
                startTime: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                state: {
                  type: "string",
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
          required: false,
        },
        googleIpAddress: {
          name: "Google Ip Address",
          description:
            "Output only. [Output Only] IP address configured on the Google side of the Interconnect link. This can be used only for ping tests.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] IP address configured on the Google side of the Interconnect link. This can be used only for ping tests.",
          },
          required: false,
        },
        googleReferenceId: {
          name: "Google Reference Id",
          description:
            "Output only. [Output Only] Google reference ID to be used when raising support tickets with Google or otherwise to debug backend connectivity issues.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Google reference ID to be used when raising support tickets with Google or otherwise to debug backend connectivity issues.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        interconnectAttachments: {
          name: "Interconnect Attachments",
          description:
            "Output only. [Output Only] A list of the URLs of all InterconnectAttachments configured to use  this Interconnect.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] A list of the URLs of all InterconnectAttachments configured to use  this Interconnect.",
          },
          required: false,
        },
        interconnectGroups: {
          name: "Interconnect Groups",
          description:
            "Output only. [Output Only] URLs of InterconnectGroups that include this Interconnect. Order is arbitrary and items are unique.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] URLs of InterconnectGroups that include this Interconnect. Order is arbitrary and items are unique.",
          },
          required: false,
        },
        interconnectType: {
          name: "Interconnect Type",
          description:
            "Type of interconnect, which can take one of the following values:     - PARTNER: A partner-managed interconnection shared between customers    though a partner.    - DEDICATED: A dedicated physical interconnection with the    customer.   Note that a value IT_PRIVATE has been deprecated in favor of DEDICATED. Check the InterconnectType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Type of interconnect, which can take one of the following values:     - PARTNER: A partner-managed interconnection shared between customers    though a partner.    - DEDICATED: A dedicated physical interconnection with the    customer.   Note that a value IT_PRIVATE has been deprecated in favor of DEDICATED. Check the InterconnectType enum for the list of possible values.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Alwayscompute#interconnect for interconnects.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#interconnect for interconnects.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this Interconnect, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an Interconnect.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this Interconnect, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an Interconnect.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
          },
          required: false,
        },
        linkType: {
          name: "Link Type",
          description:
            "Type of link requested, which can take one of the following values:     - LINK_TYPE_ETHERNET_10G_LR: A 10G Ethernet with LR optics    - LINK_TYPE_ETHERNET_100G_LR: A 100G Ethernet with LR optics.    - LINK_TYPE_ETHERNET_400G_LR4: A 400G Ethernet with LR4 optics.    Note that this field indicates the speed of each of the links in the bundle, not the speed of the entire bundle. Check the LinkType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Type of link requested, which can take one of the following values:     - LINK_TYPE_ETHERNET_10G_LR: A 10G Ethernet with LR optics    - LINK_TYPE_ETHERNET_100G_LR: A 100G Ethernet with LR optics.    - LINK_TYPE_ETHERNET_400G_LR4: A 400G Ethernet with LR4 optics.    Note that this field indicates the speed of each of the links in the bundle, not the speed of the entire bundle. Check the LinkType enum for the list of possible values.",
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
              "URL of the InterconnectLocation object that represents where this connection is to be provisioned.",
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
          required: false,
        },
        macsecEnabled: {
          name: "Macsec Enabled",
          description:
            "Enable or disable MACsec on this Interconnect connection. MACsec enablement fails if the MACsec object is not specified.",
          type: {
            type: "boolean",
            description:
              "Enable or disable MACsec on this Interconnect connection. MACsec enablement fails if the MACsec object is not specified.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        nocContactEmail: {
          name: "Noc Contact Email",
          description:
            "Email address to contact the customer NOC for operations and maintenance notifications regarding this Interconnect. If specified, this will be used for notifications in addition to all other forms described, such as Cloud Monitoring logs alerting and Cloud Notifications. This field is required for users who sign up for Cloud Interconnect using workforce identity federation.",
          type: {
            type: "string",
            description:
              "Email address to contact the customer NOC for operations and maintenance notifications regarding this Interconnect. If specified, this will be used for notifications in addition to all other forms described, such as Cloud Monitoring logs alerting and Cloud Notifications. This field is required for users who sign up for Cloud Interconnect using workforce identity federation.",
          },
          required: false,
        },
        operationalStatus: {
          name: "Operational Status",
          description:
            "Output only. [Output Only] The current status of this Interconnect's functionality, which can take one of the following values:     - OS_ACTIVE: A valid Interconnect, which is turned up and is ready to    use. Attachments may be provisioned on this Interconnect.  - OS_UNPROVISIONED: An Interconnect that has not completed turnup. No attachments may be provisioned on this Interconnect. - OS_UNDER_MAINTENANCE: An Interconnect that is undergoing internal maintenance. No attachments may be provisioned or updated on this Interconnect. Check the OperationalStatus enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The current status of this Interconnect's functionality, which can take one of the following values:     - OS_ACTIVE: A valid Interconnect, which is turned up and is ready to    use. Attachments may be provisioned on this Interconnect.  - OS_UNPROVISIONED: An Interconnect that has not completed turnup. No attachments may be provisioned on this Interconnect. - OS_UNDER_MAINTENANCE: An Interconnect that is undergoing internal maintenance. No attachments may be provisioned or updated on this Interconnect. Check the OperationalStatus enum for the list of possible values.",
          },
          required: false,
        },
        params: {
          name: "Params",
          description:
            "Input only. [Input Only] Additional params passed with the request, but not persisted as part of resource payload.",
          type: {
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
          required: false,
        },
        peerIpAddress: {
          name: "Peer Ip Address",
          description:
            "Output only. [Output Only] IP address configured on the customer side of the Interconnect link. The customer should configure this IP address during turnup when prompted by Google NOC. This can be used only for ping tests.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] IP address configured on the customer side of the Interconnect link. The customer should configure this IP address during turnup when prompted by Google NOC. This can be used only for ping tests.",
          },
          required: false,
        },
        provisionedLinkCount: {
          name: "Provisioned Link Count",
          description:
            "Output only. [Output Only] Number of links actually provisioned in this interconnect.",
          type: {
            type: "integer",
            description:
              "Output only. [Output Only] Number of links actually provisioned in this interconnect.",
          },
          required: false,
        },
        remoteLocation: {
          name: "Remote Location",
          description:
            "Indicates that this is a Cross-Cloud Interconnect. This field specifies the location outside of Google's network that the interconnect is connected to.",
          type: {
            type: "string",
            description:
              "Indicates that this is a Cross-Cloud Interconnect. This field specifies the location outside of Google's network that the interconnect is connected to.",
          },
          required: false,
        },
        requestedFeatures: {
          name: "Requested Features",
          description:
            "Optional. This parameter can be provided only with Interconnect INSERT. It isn't valid for Interconnect PATCH. List of features requested for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If specified, then the connection is created on MACsec    capable hardware ports. If not specified, non-MACsec capable ports will    also be considered.    - IF_CROSS_SITE_NETWORK: If specified, then the connection is created    exclusively for Cross-Site Networking. The connection can not be used for    Cross-Site Networking unless this feature is specified. Check the RequestedFeatures enum for the list of possible values.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Optional. This parameter can be provided only with Interconnect INSERT. It isn't valid for Interconnect PATCH. List of features requested for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If specified, then the connection is created on MACsec    capable hardware ports. If not specified, non-MACsec capable ports will    also be considered.    - IF_CROSS_SITE_NETWORK: If specified, then the connection is created    exclusively for Cross-Site Networking. The connection can not be used for    Cross-Site Networking unless this feature is specified. Check the RequestedFeatures enum for the list of possible values.",
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
              "Target number of physical links in the link bundle, as requested by the customer.",
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
            "Output only. [Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        state: {
          name: "State",
          description:
            "Output only. [Output Only] The current state of Interconnect functionality, which can take one of the following values:     - ACTIVE: The Interconnect is valid, turned up and ready to use.    Attachments may be provisioned on this Interconnect.    - UNPROVISIONED: The Interconnect has not completed turnup. No    attachments may be provisioned on this Interconnect.    - UNDER_MAINTENANCE: The Interconnect is undergoing internal maintenance.    No attachments may be provisioned or updated on this    Interconnect. Check the State enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The current state of Interconnect functionality, which can take one of the following values:     - ACTIVE: The Interconnect is valid, turned up and ready to use.    Attachments may be provisioned on this Interconnect.    - UNPROVISIONED: The Interconnect has not completed turnup. No    attachments may be provisioned on this Interconnect.    - UNDER_MAINTENANCE: The Interconnect is undergoing internal maintenance.    No attachments may be provisioned or updated on this    Interconnect. Check the State enum for the list of possible values.",
          },
          required: false,
        },
        subzone: {
          name: "Subzone",
          description:
            "Specific subzone in the InterconnectLocation that represents where this connection is to be provisioned. Check the Subzone enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Specific subzone in the InterconnectLocation that represents where this connection is to be provisioned. Check the Subzone enum for the list of possible values.",
          },
          required: false,
        },
        wireGroups: {
          name: "Wire Groups",
          description:
            "Output only. [Output Only] A list of the URLs of all CrossSiteNetwork WireGroups configured to use this Interconnect. The Interconnect cannot be deleted if this list is non-empty.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] A list of the URLs of all CrossSiteNetwork WireGroups configured to use this Interconnect. The Interconnect cannot be deleted if this list is non-empty.",
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.interconnect !== undefined)
          pathParams["interconnect"] = String(
            input.event.inputConfig.interconnect,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.aaiEnabled !== undefined)
          body.aaiEnabled = input.event.inputConfig.aaiEnabled;
        if (input.event.inputConfig.adminEnabled !== undefined)
          body.adminEnabled = input.event.inputConfig.adminEnabled;
        if (input.event.inputConfig.applicationAwareInterconnect !== undefined)
          body.applicationAwareInterconnect =
            input.event.inputConfig.applicationAwareInterconnect;
        if (input.event.inputConfig.availableFeatures !== undefined)
          body.availableFeatures = input.event.inputConfig.availableFeatures;
        if (input.event.inputConfig.circuitInfos !== undefined)
          body.circuitInfos = input.event.inputConfig.circuitInfos;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.customerName !== undefined)
          body.customerName = input.event.inputConfig.customerName;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.expectedOutages !== undefined)
          body.expectedOutages = input.event.inputConfig.expectedOutages;
        if (input.event.inputConfig.googleIpAddress !== undefined)
          body.googleIpAddress = input.event.inputConfig.googleIpAddress;
        if (input.event.inputConfig.googleReferenceId !== undefined)
          body.googleReferenceId = input.event.inputConfig.googleReferenceId;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.interconnectAttachments !== undefined)
          body.interconnectAttachments =
            input.event.inputConfig.interconnectAttachments;
        if (input.event.inputConfig.interconnectGroups !== undefined)
          body.interconnectGroups = input.event.inputConfig.interconnectGroups;
        if (input.event.inputConfig.interconnectType !== undefined)
          body.interconnectType = input.event.inputConfig.interconnectType;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          body.labelFingerprint = input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.linkType !== undefined)
          body.linkType = input.event.inputConfig.linkType;
        if (input.event.inputConfig.location !== undefined)
          body.location = input.event.inputConfig.location;
        if (input.event.inputConfig.macsec !== undefined)
          body.macsec = input.event.inputConfig.macsec;
        if (input.event.inputConfig.macsecEnabled !== undefined)
          body.macsecEnabled = input.event.inputConfig.macsecEnabled;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.nocContactEmail !== undefined)
          body.nocContactEmail = input.event.inputConfig.nocContactEmail;
        if (input.event.inputConfig.operationalStatus !== undefined)
          body.operationalStatus = input.event.inputConfig.operationalStatus;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.peerIpAddress !== undefined)
          body.peerIpAddress = input.event.inputConfig.peerIpAddress;
        if (input.event.inputConfig.provisionedLinkCount !== undefined)
          body.provisionedLinkCount =
            input.event.inputConfig.provisionedLinkCount;
        if (input.event.inputConfig.remoteLocation !== undefined)
          body.remoteLocation = input.event.inputConfig.remoteLocation;
        if (input.event.inputConfig.requestedFeatures !== undefined)
          body.requestedFeatures = input.event.inputConfig.requestedFeatures;
        if (input.event.inputConfig.requestedLinkCount !== undefined)
          body.requestedLinkCount = input.event.inputConfig.requestedLinkCount;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          body.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.state !== undefined)
          body.state = input.event.inputConfig.state;
        if (input.event.inputConfig.subzone !== undefined)
          body.subzone = input.event.inputConfig.subzone;
        if (input.event.inputConfig.wireGroups !== undefined)
          body.wireGroups = input.event.inputConfig.wireGroups;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/global/interconnects/{interconnect}",
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

export default patch;
