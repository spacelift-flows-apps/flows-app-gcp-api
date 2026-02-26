import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Interconnects - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Interconnects",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        max_results: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        return_partial_success: {
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

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.max_results !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.max_results,
          );
        if (input.event.inputConfig.order_by !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.order_by);
        if (input.event.inputConfig.page_token !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.page_token);
        if (input.event.inputConfig.return_partial_success !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.return_partial_success,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "/compute/v1/projects/{project}/global/interconnects",
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
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                aai_enabled: {
                  type: "boolean",
                  description:
                    "Enable or disable the application awareness feature on this Cloud Interconnect.",
                },
                admin_enabled: {
                  type: "boolean",
                  description:
                    "Administrative status of the interconnect. When this is set to true, the Interconnect is functional and can carry traffic. When set to false, no packets can be carried over the interconnect and no BGP routes are exchanged over it. By default, the status is set to true.",
                },
                application_aware_interconnect: {
                  type: "object",
                  properties: {
                    bandwidth_percentage_policy: {
                      type: "object",
                      properties: {
                        bandwidth_percentages: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              percentage: {
                                type: "integer",
                                description:
                                  "Bandwidth percentage for a specific traffic class.",
                              },
                              traffic_class: {
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
                    profile_description: {
                      type: "string",
                      description:
                        "Description for the application awareness profile on this Cloud Interconnect.",
                    },
                    shape_average_percentages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          percentage: {
                            type: "integer",
                            description:
                              "Bandwidth percentage for a specific traffic class.",
                          },
                          traffic_class: {
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
                    strict_priority_policy: {
                      type: "object",
                      properties: {},
                      description:
                        "Specify configuration for StrictPriorityPolicy.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Configuration information for application awareness on this Cloud Interconnect.",
                  additionalProperties: true,
                },
                available_features: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output only] List of features available for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If present, then the Interconnect connection is    provisioned on MACsec capable hardware ports. If not present, then the    Interconnect connection is provisioned on non-MACsec capable ports. Any    attempt to enable MACsec will fail.    - IF_CROSS_SITE_NETWORK: If present, then the Interconnect connection is    provisioned exclusively for Cross-Site Networking. Any attempt to configure    VLAN attachments will fail. If not present, then the Interconnect    connection is not provisioned for Cross-Site Networking. Any attempt to use    it for Cross-Site Networking will fail. Check the AvailableFeatures enum for the list of possible values.",
                },
                circuit_infos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      customer_demarc_id: {
                        type: "string",
                        description:
                          "Customer-side demarc ID for this circuit.",
                      },
                      google_circuit_id: {
                        type: "string",
                        description:
                          "Google-assigned unique ID for this circuit. Assigned at circuit turn-up.",
                      },
                      google_demarc_id: {
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
                creation_timestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                customer_name: {
                  type: "string",
                  description:
                    "Customer name, to put in the Letter of Authorization as the party authorized to request a crossconnect.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                expected_outages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      affected_circuits: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "If issue_type is IT_PARTIAL_OUTAGE, a list of the Google-side circuit IDs that will be affected.",
                      },
                      description: {
                        type: "string",
                        description:
                          "A description about the purpose of the outage.",
                      },
                      end_time: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      issue_type: {
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
                      start_time: {
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
                google_ip_address: {
                  type: "string",
                  description:
                    "Output only. [Output Only] IP address configured on the Google side of the Interconnect link. This can be used only for ping tests.",
                },
                google_reference_id: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Google reference ID to be used when raising support tickets with Google or otherwise to debug backend connectivity issues.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                interconnect_attachments: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Output only. [Output Only] A list of the URLs of all InterconnectAttachments configured to use  this Interconnect.",
                },
                interconnect_groups: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Output only. [Output Only] URLs of InterconnectGroups that include this Interconnect. Order is arbitrary and items are unique.",
                },
                interconnect_type: {
                  type: "string",
                  description:
                    "Type of interconnect, which can take one of the following values:     - PARTNER: A partner-managed interconnection shared between customers    though a partner.    - DEDICATED: A dedicated physical interconnection with the    customer.   Note that a value IT_PRIVATE has been deprecated in favor of DEDICATED. Check the InterconnectType enum for the list of possible values.",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Alwayscompute#interconnect for interconnects.",
                },
                label_fingerprint: {
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
                link_type: {
                  type: "string",
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
                    fail_open: {
                      type: "boolean",
                      description:
                        "If set to true, the Interconnect connection is configured with ashould-secure MACsec security policy, that allows the Google router to fallback to cleartext traffic if the MKA session cannot be established. By default, the Interconnect connection is configured with amust-secure security policy that drops all traffic if the MKA session cannot be established with your router.",
                    },
                    pre_shared_keys: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description:
                              "Required. A name for this pre-shared key. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                          },
                          start_time: {
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
                macsec_enabled: {
                  type: "boolean",
                  description:
                    "Enable or disable MACsec on this Interconnect connection. MACsec enablement fails if the MACsec object is not specified.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                noc_contact_email: {
                  type: "string",
                  description:
                    "Email address to contact the customer NOC for operations and maintenance notifications regarding this Interconnect. If specified, this will be used for notifications in addition to all other forms described, such as Cloud Monitoring logs alerting and Cloud Notifications. This field is required for users who sign up for Cloud Interconnect using workforce identity federation.",
                },
                operational_status: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The current status of this Interconnect's functionality, which can take one of the following values:     - OS_ACTIVE: A valid Interconnect, which is turned up and is ready to    use. Attachments may be provisioned on this Interconnect.  - OS_UNPROVISIONED: An Interconnect that has not completed turnup. No attachments may be provisioned on this Interconnect. - OS_UNDER_MAINTENANCE: An Interconnect that is undergoing internal maintenance. No attachments may be provisioned or updated on this Interconnect. Check the OperationalStatus enum for the list of possible values.",
                },
                params: {
                  type: "object",
                  properties: {
                    resource_manager_tags: {
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
                peer_ip_address: {
                  type: "string",
                  description:
                    "Output only. [Output Only] IP address configured on the customer side of the Interconnect link. The customer should configure this IP address during turnup when prompted by Google NOC. This can be used only for ping tests.",
                },
                provisioned_link_count: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] Number of links actually provisioned in this interconnect.",
                },
                remote_location: {
                  type: "string",
                  description:
                    "Indicates that this is a Cross-Cloud Interconnect. This field specifies the location outside of Google's network that the interconnect is connected to.",
                },
                requested_features: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Optional. This parameter can be provided only with Interconnect INSERT. It isn't valid for Interconnect PATCH. List of features requested for this Interconnect connection, which can take one of the following values:     - IF_MACSEC: If specified, then the connection is created on MACsec    capable hardware ports. If not specified, non-MACsec capable ports will    also be considered.    - IF_CROSS_SITE_NETWORK: If specified, then the connection is created    exclusively for Cross-Site Networking. The connection can not be used for    Cross-Site Networking unless this feature is specified. Check the RequestedFeatures enum for the list of possible values.",
                },
                requested_link_count: {
                  type: "integer",
                  description:
                    "Target number of physical links in the link bundle, as requested by the customer.",
                },
                satisfies_pzs: {
                  type: "boolean",
                  description:
                    "Output only. [Output Only] Reserved for future use.",
                },
                self_link: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for the resource.",
                },
                state: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The current state of Interconnect functionality, which can take one of the following values:     - ACTIVE: The Interconnect is valid, turned up and ready to use.    Attachments may be provisioned on this Interconnect.    - UNPROVISIONED: The Interconnect has not completed turnup. No    attachments may be provisioned on this Interconnect.    - UNDER_MAINTENANCE: The Interconnect is undergoing internal maintenance.    No attachments may be provisioned or updated on this    Interconnect. Check the State enum for the list of possible values.",
                },
                subzone: {
                  type: "string",
                  description:
                    "Specific subzone in the InterconnectLocation that represents where this connection is to be provisioned. Check the Subzone enum for the list of possible values.",
                },
                wire_groups: {
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
            description: "A list of Interconnect resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#interconnectList for lists of interconnects.",
          },
          next_page_token: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          self_link: {
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
        description:
          "Response to the list request, and contains a list of interconnects.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
