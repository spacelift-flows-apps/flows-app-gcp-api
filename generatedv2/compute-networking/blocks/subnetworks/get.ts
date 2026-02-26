import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Subnetworks - Get",
  description: `Returns the specified Zone resource.`,
  category: "Subnetworks",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        subnetwork: {
          name: "Subnetwork",
          description: "Name of the Subnetwork resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
        views: {
          name: "Views",
          description:
            "Defines the extra views returned back in the subnetwork resource. Supported values:     - WITH_UTILIZATION: Utilization data is included in the    response. Check the Views enum for the list of possible values.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.subnetwork !== undefined)
          pathParams["subnetwork"] = String(input.event.inputConfig.subnetwork);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.views !== undefined)
          queryParams["views"] = String(input.event.inputConfig.views);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/subnetworks/{subnetwork}",
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
          allowSubnetCidrRoutesOverlap: {
            type: "boolean",
            description:
              "Whether this subnetwork's ranges can conflict with existing static routes. Setting this to true allows this subnetwork's primary and secondary ranges to overlap with (and contain) static routes that have already been configured on the corresponding network.  For example if a static route has range 10.1.0.0/16, a subnet range 10.0.0.0/8 could only be created if allow_conflicting_routes=true.  Overlapping is only allowed on subnetwork operations; routes whose ranges conflict with this subnetwork's ranges won't be allowed unless route.allow_conflicting_subnetworks is set to true.  Typically packets destined to IPs within the subnetwork (which may contain private/sensitive data) are prevented from leaving the virtual network. Setting this field to true will disable this feature.  The default value is false and applies to all existing subnetworks and automatically created subnetworks.  This field cannot be set to true at resource creation time.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource. This field can be set only at resource creation time.",
          },
          enableFlowLogs: {
            type: "boolean",
            description:
              "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled. This field isn't supported if the subnet purpose field is set toREGIONAL_MANAGED_PROXY. It is recommended to uselogConfig.enable field instead.",
          },
          externalIpv6Prefix: {
            type: "string",
            description:
              "The external IPv6 address range that is owned by this subnetwork.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a Subnetwork. An up-to-date fingerprint must be provided in order to update the Subnetwork, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a Subnetwork.",
          },
          gatewayAddress: {
            type: "string",
            description:
              "Output only. [Output Only] The gateway address for default routes to reach destination addresses outside this subnetwork.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          internalIpv6Prefix: {
            type: "string",
            description:
              "The internal IPv6 address range that is owned by this subnetwork.",
          },
          ipCidrRange: {
            type: "string",
            description:
              "The range of internal addresses that are owned by this subnetwork. Provide this property when you create the subnetwork. For example,10.0.0.0/8 or 100.64.0.0/10. Ranges must be unique and non-overlapping within a network. Only IPv4 is supported. This field is set at resource creation time. The range can be any range listed in theValid ranges list. The range can be expanded after creation usingexpandIpCidrRange.",
          },
          ipCollection: {
            type: "string",
            description:
              "Reference to the source of IP, like a PublicDelegatedPrefix (PDP) for BYOIP. The PDP must be a sub-PDP in EXTERNAL_IPV6_SUBNETWORK_CREATION or INTERNAL_IPV6_SUBNETWORK_CREATION mode.  Use one of the following formats to specify a sub-PDP when creating a dual stack or IPv6-only subnetwork with external access using BYOIP:     -    Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name    -    Partial URL, as in             - projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name           - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          },
          ipv6AccessType: {
            type: "string",
            description:
              "The access type of IPv6 address this subnet holds. It's immutable and can only be specified during creation or the first time the subnet is updated into IPV4_IPV6 dual stack. Check the Ipv6AccessType enum for the list of possible values.",
          },
          ipv6CidrRange: {
            type: "string",
            description:
              "Output only. [Output Only] This field is for internal use.",
          },
          ipv6GceEndpoint: {
            type: "string",
            description:
              "Output only. [Output Only] Possible endpoints of this subnetwork. It can be one of the following:     - VM_ONLY: The subnetwork can be used for creating instances and    IPv6 addresses with VM endpoint type. Such a subnetwork gets external IPv6    ranges from a public delegated prefix and cannot be used to create NetLb.    - VM_AND_FR: The subnetwork can be used for creating both VM    instances and Forwarding Rules. It can also be used to reserve IPv6    addresses with both VM and FR endpoint types. Such a subnetwork gets its    IPv6 range from Google IP Pool directly. Check the Ipv6GceEndpoint enum for the list of possible values.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#subnetwork for Subnetwork resources.",
          },
          logConfig: {
            type: "object",
            properties: {
              aggregationInterval: {
                type: "string",
                description:
                  "Can only be specified if VPC flow logging for this subnetwork is enabled. Toggles the aggregation interval for collecting flow logs. Increasing the interval time will reduce the amount of generated flow logs for long lasting connections. Default is an interval of 5 seconds per connection. Check the AggregationInterval enum for the list of possible values.",
              },
              enable: {
                type: "boolean",
                description:
                  "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled. Flow logging isn't supported if the subnet purpose field is set to REGIONAL_MANAGED_PROXY.",
              },
              filterExpr: {
                type: "string",
                description:
                  "Can only be specified if VPC flow logs for this subnetwork is enabled. The filter expression is used to define which VPC flow logs should be exported to Cloud Logging.",
              },
              flowSampling: {
                type: "number",
                description:
                  "Can only be specified if VPC flow logging for this subnetwork is enabled. The value of the field must be in [0, 1]. Set the sampling rate of VPC flow logs within the subnetwork where 1.0 means all collected logs are reported and 0.0 means no logs are reported. Default is 0.5 unless otherwise specified by the org policy, which means half of all collected logs are reported.",
              },
              metadata: {
                type: "string",
                description:
                  "Can only be specified if VPC flow logs for this subnetwork is enabled. Configures whether all, none or a subset of metadata fields should be added to the reported VPC flow logs. Default isEXCLUDE_ALL_METADATA. Check the Metadata enum for the list of possible values.",
              },
              metadataFields: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'Can only be specified if VPC flow logs for this subnetwork is enabled and "metadata" was set to CUSTOM_METADATA.',
              },
            },
            description: "The available logging options for this subnetwork.",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating the resource. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          network: {
            type: "string",
            description:
              "The URL of the network to which this subnetwork belongs, provided by the client when initially creating the subnetwork. This field can be set only at resource creation time.",
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
                  'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional subnetwork parameters.",
            additionalProperties: true,
          },
          privateIpGoogleAccess: {
            type: "boolean",
            description:
              "Whether the VMs in this subnet can access Google services without assigned external IP addresses. This field can be both set at resource creation time and updated using setPrivateIpGoogleAccess.",
          },
          privateIpv6GoogleAccess: {
            type: "string",
            description:
              "This field is for internal use.  This field can be both set at resource creation time and updated usingpatch. Check the PrivateIpv6GoogleAccess enum for the list of possible values.",
          },
          purpose: {
            type: "string",
            description:
              "Check the Purpose enum for the list of possible values.",
          },
          region: {
            type: "string",
            description:
              "URL of the region where the Subnetwork resides. This field can be set only at resource creation time.",
          },
          reservedInternalRange: {
            type: "string",
            description: "The URL of the reserved internal range.",
          },
          role: {
            type: "string",
            description:
              "The role of subnetwork. Currently, this field is only used when purpose is set to GLOBAL_MANAGED_PROXY orREGIONAL_MANAGED_PROXY. The value can be set toACTIVE or BACKUP. An ACTIVE subnetwork is one that is currently being used for Envoy-based load balancers in a region. A BACKUP subnetwork is one that is ready to be promoted to ACTIVE or is currently draining. This field can be updated with a patch request. Check the Role enum for the list of possible values.",
          },
          secondaryIpRanges: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ipCidrRange: {
                  type: "string",
                  description:
                    "The range of IP addresses belonging to this subnetwork secondary range. Provide this property when you create the subnetwork. Ranges must be unique and non-overlapping with all primary and secondary IP ranges within a network. Only IPv4 is supported. The range can be any range listed in theValid ranges list.",
                },
                rangeName: {
                  type: "string",
                  description:
                    "The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance. The name must be 1-63 characters long, and comply withRFC1035. The name must be unique within the subnetwork.",
                },
                reservedInternalRange: {
                  type: "string",
                  description: "The URL of the reserved internal range.",
                },
              },
              description: "Represents a secondary IP range of a subnetwork.",
              additionalProperties: true,
            },
            description:
              "An array of configurations for secondary IP ranges for VM instances contained in this subnetwork. The primary IP of such VM must belong to the primary ipCidrRange of the subnetwork. The alias IPs may belong to either primary or secondary ranges. This field can be updated with apatch request.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          stackType: {
            type: "string",
            description:
              "The stack type for the subnet. If set to IPV4_ONLY, new VMs in the subnet are assigned IPv4 addresses only. If set toIPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and IPv6 addresses. If not specified, IPV4_ONLY is used.  This field can be both set at resource creation time and updated usingpatch. Check the StackType enum for the list of possible values.",
          },
          state: {
            type: "string",
            description:
              "Output only. [Output Only] The state of the subnetwork, which can be one of the following values:READY: Subnetwork is created and ready to useDRAINING: only applicable to subnetworks that have the purpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that connections to the load balancer are being drained. A subnetwork that is draining cannot be used or modified until it reaches a status ofREADY Check the State enum for the list of possible values.",
          },
          systemReservedExternalIpv6Ranges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] The array of external IPv6 network ranges reserved from the subnetwork's external IPv6 range for system use.",
          },
          systemReservedInternalIpv6Ranges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] The array of internal IPv6 network ranges reserved from the subnetwork's internal IPv6 range for system use.",
          },
          utilizationDetails: {
            type: "object",
            properties: {
              externalIpv6InstanceUtilization: {
                type: "object",
                properties: {
                  totalAllocatedIp: {
                    type: "object",
                    properties: {
                      high: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      low: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    additionalProperties: true,
                  },
                  totalFreeIp: {
                    type: "object",
                    properties: {
                      high: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      low: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    additionalProperties: true,
                  },
                },
                description: "The IPV6 utilization of a single IP range.",
                additionalProperties: true,
              },
              externalIpv6LbUtilization: {
                type: "object",
                properties: {
                  totalAllocatedIp: {
                    type: "object",
                    properties: {
                      high: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      low: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    additionalProperties: true,
                  },
                  totalFreeIp: {
                    type: "object",
                    properties: {
                      high: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      low: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    additionalProperties: true,
                  },
                },
                description: "The IPV6 utilization of a single IP range.",
                additionalProperties: true,
              },
              internalIpv6Utilization: {
                type: "object",
                properties: {
                  totalAllocatedIp: {
                    type: "object",
                    properties: {
                      high: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      low: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    additionalProperties: true,
                  },
                  totalFreeIp: {
                    type: "object",
                    properties: {
                      high: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      low: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    additionalProperties: true,
                  },
                },
                description: "The IPV6 utilization of a single IP range.",
                additionalProperties: true,
              },
              ipv4Utilizations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    rangeName: {
                      type: "string",
                      description:
                        "Will be set for secondary range. Empty for primary IPv4 range.",
                    },
                    totalAllocatedIp: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    totalFreeIp: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                  },
                  description: "The IPV4 utilization of a single IP range.",
                  additionalProperties: true,
                },
                description:
                  "Utilizations of all IPV4 IP ranges. For primary ranges, the range name will be empty.",
              },
            },
            description:
              "The current IP utilization of all subnetwork ranges. Contains the total number of allocated and free IPs in each range.",
            additionalProperties: true,
          },
        },
        description:
          "Represents a Subnetwork resource.  A subnetwork (also known as a subnet) is a logical partition of a Virtual Private Cloud network with one primary IP range and zero or more secondary IP ranges. For more information, read Virtual Private Cloud (VPC) Network.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
