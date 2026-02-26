import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const patch: AppBlock = {
  name: "Subnetworks - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Subnetworks",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description:
            "URL of the region where the Subnetwork resides. This field can be set only at resource creation time.",
          type: {
            type: "string",
            description:
              "URL of the region where the Subnetwork resides. This field can be set only at resource creation time.",
          },
          required: false,
        },
        subnetwork: {
          name: "Subnetwork",
          description: "Name of the Subnetwork resource to patch.",
          type: {
            type: "string",
          },
          required: true,
        },
        allow_subnet_cidr_routes_overlap: {
          name: "Allow Subnet Cidr Routes Overlap",
          description:
            "Whether this subnetwork's ranges can conflict with existing static routes. Setting this to true allows this subnetwork's primary and secondary ranges to overlap with (and contain) static routes that have already been configured on the corresponding network.  For example if a static route has range 10.1.0.0/16, a subnet range 10.0.0.0/8 could only be created if allow_conflicting_routes=true.  Overlapping is only allowed on subnetwork operations; routes whose ranges conflict with this subnetwork's ranges won't be allowed unless route.allow_conflicting_subnetworks is set to true.  Typically packets destined to IPs within the subnetwork (which may contain private/sensitive data) are prevented from leaving the virtual network. Setting this field to true will disable this feature.  The default value is false and applies to all existing subnetworks and automatically created subnetworks.  This field cannot be set to true at resource creation time.",
          type: {
            type: "boolean",
            description:
              "Whether this subnetwork's ranges can conflict with existing static routes. Setting this to true allows this subnetwork's primary and secondary ranges to overlap with (and contain) static routes that have already been configured on the corresponding network.  For example if a static route has range 10.1.0.0/16, a subnet range 10.0.0.0/8 could only be created if allow_conflicting_routes=true.  Overlapping is only allowed on subnetwork operations; routes whose ranges conflict with this subnetwork's ranges won't be allowed unless route.allow_conflicting_subnetworks is set to true.  Typically packets destined to IPs within the subnetwork (which may contain private/sensitive data) are prevented from leaving the virtual network. Setting this field to true will disable this feature.  The default value is false and applies to all existing subnetworks and automatically created subnetworks.  This field cannot be set to true at resource creation time.",
          },
          required: false,
        },
        creation_timestamp: {
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
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource. This field can be set only at resource creation time.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource. This field can be set only at resource creation time.",
          },
          required: false,
        },
        enable_flow_logs: {
          name: "Enable Flow Logs",
          description:
            "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled. This field isn't supported if the subnet purpose field is set toREGIONAL_MANAGED_PROXY. It is recommended to uselogConfig.enable field instead.",
          type: {
            type: "boolean",
            description:
              "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled. This field isn't supported if the subnet purpose field is set toREGIONAL_MANAGED_PROXY. It is recommended to uselogConfig.enable field instead.",
          },
          required: false,
        },
        external_ipv6_prefix: {
          name: "External Ipv6 Prefix",
          description:
            "The external IPv6 address range that is owned by this subnetwork.",
          type: {
            type: "string",
            description:
              "The external IPv6 address range that is owned by this subnetwork.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a Subnetwork. An up-to-date fingerprint must be provided in order to update the Subnetwork, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a Subnetwork.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a Subnetwork. An up-to-date fingerprint must be provided in order to update the Subnetwork, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a Subnetwork.",
          },
          required: false,
        },
        gateway_address: {
          name: "Gateway Address",
          description:
            "Output only. [Output Only] The gateway address for default routes to reach destination addresses outside this subnetwork.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The gateway address for default routes to reach destination addresses outside this subnetwork.",
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
        internal_ipv6_prefix: {
          name: "Internal Ipv6 Prefix",
          description:
            "The internal IPv6 address range that is owned by this subnetwork.",
          type: {
            type: "string",
            description:
              "The internal IPv6 address range that is owned by this subnetwork.",
          },
          required: false,
        },
        ip_cidr_range: {
          name: "Ip Cidr Range",
          description:
            "The range of internal addresses that are owned by this subnetwork. Provide this property when you create the subnetwork. For example,10.0.0.0/8 or 100.64.0.0/10. Ranges must be unique and non-overlapping within a network. Only IPv4 is supported. This field is set at resource creation time. The range can be any range listed in theValid ranges list. The range can be expanded after creation usingexpandIpCidrRange.",
          type: {
            type: "string",
            description:
              "The range of internal addresses that are owned by this subnetwork. Provide this property when you create the subnetwork. For example,10.0.0.0/8 or 100.64.0.0/10. Ranges must be unique and non-overlapping within a network. Only IPv4 is supported. This field is set at resource creation time. The range can be any range listed in theValid ranges list. The range can be expanded after creation usingexpandIpCidrRange.",
          },
          required: false,
        },
        ip_collection: {
          name: "Ip Collection",
          description:
            "Reference to the source of IP, like a PublicDelegatedPrefix (PDP) for BYOIP. The PDP must be a sub-PDP in EXTERNAL_IPV6_SUBNETWORK_CREATION or INTERNAL_IPV6_SUBNETWORK_CREATION mode.  Use one of the following formats to specify a sub-PDP when creating a dual stack or IPv6-only subnetwork with external access using BYOIP:     -    Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name    -    Partial URL, as in             - projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name           - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          type: {
            type: "string",
            description:
              "Reference to the source of IP, like a PublicDelegatedPrefix (PDP) for BYOIP. The PDP must be a sub-PDP in EXTERNAL_IPV6_SUBNETWORK_CREATION or INTERNAL_IPV6_SUBNETWORK_CREATION mode.  Use one of the following formats to specify a sub-PDP when creating a dual stack or IPv6-only subnetwork with external access using BYOIP:     -    Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name    -    Partial URL, as in             - projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name           - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          },
          required: false,
        },
        ipv6_access_type: {
          name: "Ipv6 Access Type",
          description:
            "The access type of IPv6 address this subnet holds. It's immutable and can only be specified during creation or the first time the subnet is updated into IPV4_IPV6 dual stack. Check the Ipv6AccessType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The access type of IPv6 address this subnet holds. It's immutable and can only be specified during creation or the first time the subnet is updated into IPV4_IPV6 dual stack. Check the Ipv6AccessType enum for the list of possible values.",
          },
          required: false,
        },
        ipv6_cidr_range: {
          name: "Ipv6 Cidr Range",
          description:
            "Output only. [Output Only] This field is for internal use.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] This field is for internal use.",
          },
          required: false,
        },
        ipv6_gce_endpoint: {
          name: "Ipv6 Gce Endpoint",
          description:
            "Output only. [Output Only] Possible endpoints of this subnetwork. It can be one of the following:     - VM_ONLY: The subnetwork can be used for creating instances and    IPv6 addresses with VM endpoint type. Such a subnetwork gets external IPv6    ranges from a public delegated prefix and cannot be used to create NetLb.    - VM_AND_FR: The subnetwork can be used for creating both VM    instances and Forwarding Rules. It can also be used to reserve IPv6    addresses with both VM and FR endpoint types. Such a subnetwork gets its    IPv6 range from Google IP Pool directly. Check the Ipv6GceEndpoint enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Possible endpoints of this subnetwork. It can be one of the following:     - VM_ONLY: The subnetwork can be used for creating instances and    IPv6 addresses with VM endpoint type. Such a subnetwork gets external IPv6    ranges from a public delegated prefix and cannot be used to create NetLb.    - VM_AND_FR: The subnetwork can be used for creating both VM    instances and Forwarding Rules. It can also be used to reserve IPv6    addresses with both VM and FR endpoint types. Such a subnetwork gets its    IPv6 range from Google IP Pool directly. Check the Ipv6GceEndpoint enum for the list of possible values.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Always compute#subnetwork for Subnetwork resources.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#subnetwork for Subnetwork resources.",
          },
          required: false,
        },
        log_config: {
          name: "Log Config",
          description:
            "This field denotes the VPC flow logging options for this subnetwork. If logging is enabled, logs are exported to Cloud Logging.",
          type: {
            type: "object",
            properties: {
              aggregation_interval: {
                type: "string",
                description:
                  "Can only be specified if VPC flow logging for this subnetwork is enabled. Toggles the aggregation interval for collecting flow logs. Increasing the interval time will reduce the amount of generated flow logs for long lasting connections. Default is an interval of 5 seconds per connection. Check the AggregationInterval enum for the list of possible values.",
              },
              enable: {
                type: "boolean",
                description:
                  "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled. Flow logging isn't supported if the subnet purpose field is set to REGIONAL_MANAGED_PROXY.",
              },
              filter_expr: {
                type: "string",
                description:
                  "Can only be specified if VPC flow logs for this subnetwork is enabled. The filter expression is used to define which VPC flow logs should be exported to Cloud Logging.",
              },
              flow_sampling: {
                type: "number",
                description:
                  "Can only be specified if VPC flow logging for this subnetwork is enabled. The value of the field must be in [0, 1]. Set the sampling rate of VPC flow logs within the subnetwork where 1.0 means all collected logs are reported and 0.0 means no logs are reported. Default is 0.5 unless otherwise specified by the org policy, which means half of all collected logs are reported.",
              },
              metadata: {
                type: "string",
                description:
                  "Can only be specified if VPC flow logs for this subnetwork is enabled. Configures whether all, none or a subset of metadata fields should be added to the reported VPC flow logs. Default isEXCLUDE_ALL_METADATA. Check the Metadata enum for the list of possible values.",
              },
              metadata_fields: {
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
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name of the resource, provided by the client when initially creating the resource. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating the resource. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "The URL of the network to which this subnetwork belongs, provided by the client when initially creating the subnetwork. This field can be set only at resource creation time.",
          type: {
            type: "string",
            description:
              "The URL of the network to which this subnetwork belongs, provided by the client when initially creating the subnetwork. This field can be set only at resource creation time.",
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
              resource_manager_tags: {
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
          required: false,
        },
        private_ip_google_access: {
          name: "Private Ip Google Access",
          description:
            "Whether the VMs in this subnet can access Google services without assigned external IP addresses. This field can be both set at resource creation time and updated using setPrivateIpGoogleAccess.",
          type: {
            type: "boolean",
            description:
              "Whether the VMs in this subnet can access Google services without assigned external IP addresses. This field can be both set at resource creation time and updated using setPrivateIpGoogleAccess.",
          },
          required: false,
        },
        private_ipv6_google_access: {
          name: "Private Ipv6 Google Access",
          description:
            "This field is for internal use.  This field can be both set at resource creation time and updated usingpatch. Check the PrivateIpv6GoogleAccess enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "This field is for internal use.  This field can be both set at resource creation time and updated usingpatch. Check the PrivateIpv6GoogleAccess enum for the list of possible values.",
          },
          required: false,
        },
        purpose: {
          name: "Purpose",
          description:
            "Check the Purpose enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Check the Purpose enum for the list of possible values.",
          },
          required: false,
        },
        reserved_internal_range: {
          name: "Reserved Internal Range",
          description: "The URL of the reserved internal range.",
          type: {
            type: "string",
            description: "The URL of the reserved internal range.",
          },
          required: false,
        },
        role: {
          name: "Role",
          description:
            "The role of subnetwork. Currently, this field is only used when purpose is set to GLOBAL_MANAGED_PROXY orREGIONAL_MANAGED_PROXY. The value can be set toACTIVE or BACKUP. An ACTIVE subnetwork is one that is currently being used for Envoy-based load balancers in a region. A BACKUP subnetwork is one that is ready to be promoted to ACTIVE or is currently draining. This field can be updated with a patch request. Check the Role enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The role of subnetwork. Currently, this field is only used when purpose is set to GLOBAL_MANAGED_PROXY orREGIONAL_MANAGED_PROXY. The value can be set toACTIVE or BACKUP. An ACTIVE subnetwork is one that is currently being used for Envoy-based load balancers in a region. A BACKUP subnetwork is one that is ready to be promoted to ACTIVE or is currently draining. This field can be updated with a patch request. Check the Role enum for the list of possible values.",
          },
          required: false,
        },
        secondary_ip_ranges: {
          name: "Secondary Ip Ranges",
          description:
            "An array of configurations for secondary IP ranges for VM instances contained in this subnetwork. The primary IP of such VM must belong to the primary ipCidrRange of the subnetwork. The alias IPs may belong to either primary or secondary ranges. This field can be updated with apatch request.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ip_cidr_range: {
                  type: "string",
                  description:
                    "The range of IP addresses belonging to this subnetwork secondary range. Provide this property when you create the subnetwork. Ranges must be unique and non-overlapping with all primary and secondary IP ranges within a network. Only IPv4 is supported. The range can be any range listed in theValid ranges list.",
                },
                range_name: {
                  type: "string",
                  description:
                    "The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance. The name must be 1-63 characters long, and comply withRFC1035. The name must be unique within the subnetwork.",
                },
                reserved_internal_range: {
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
          required: false,
        },
        self_link: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        stack_type: {
          name: "Stack Type",
          description:
            "The stack type for the subnet. If set to IPV4_ONLY, new VMs in the subnet are assigned IPv4 addresses only. If set toIPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and IPv6 addresses. If not specified, IPV4_ONLY is used.  This field can be both set at resource creation time and updated usingpatch. Check the StackType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The stack type for the subnet. If set to IPV4_ONLY, new VMs in the subnet are assigned IPv4 addresses only. If set toIPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and IPv6 addresses. If not specified, IPV4_ONLY is used.  This field can be both set at resource creation time and updated usingpatch. Check the StackType enum for the list of possible values.",
          },
          required: false,
        },
        state: {
          name: "State",
          description:
            "Output only. [Output Only] The state of the subnetwork, which can be one of the following values:READY: Subnetwork is created and ready to useDRAINING: only applicable to subnetworks that have the purpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that connections to the load balancer are being drained. A subnetwork that is draining cannot be used or modified until it reaches a status ofREADY Check the State enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The state of the subnetwork, which can be one of the following values:READY: Subnetwork is created and ready to useDRAINING: only applicable to subnetworks that have the purpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that connections to the load balancer are being drained. A subnetwork that is draining cannot be used or modified until it reaches a status ofREADY Check the State enum for the list of possible values.",
          },
          required: false,
        },
        system_reserved_external_ipv6_ranges: {
          name: "System Reserved External Ipv6 Ranges",
          description:
            "Output only. [Output Only] The array of external IPv6 network ranges reserved from the subnetwork's external IPv6 range for system use.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] The array of external IPv6 network ranges reserved from the subnetwork's external IPv6 range for system use.",
          },
          required: false,
        },
        system_reserved_internal_ipv6_ranges: {
          name: "System Reserved Internal Ipv6 Ranges",
          description:
            "Output only. [Output Only] The array of internal IPv6 network ranges reserved from the subnetwork's internal IPv6 range for system use.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] The array of internal IPv6 network ranges reserved from the subnetwork's internal IPv6 range for system use.",
          },
          required: false,
        },
        utilization_details: {
          name: "Utilization Details",
          description:
            "Output only. [Output Only] The current IP utilization of all subnetwork ranges. Contains the total number of allocated and free IPs in each range.",
          type: {
            type: "object",
            properties: {
              external_ipv6_instance_utilization: {
                type: "object",
                properties: {
                  total_allocated_ip: {
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
                  total_free_ip: {
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
              external_ipv6_lb_utilization: {
                type: "object",
                properties: {
                  total_allocated_ip: {
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
                  total_free_ip: {
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
              internal_ipv6_utilization: {
                type: "object",
                properties: {
                  total_allocated_ip: {
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
                  total_free_ip: {
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
              ipv4_utilizations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    range_name: {
                      type: "string",
                      description:
                        "Will be set for secondary range. Empty for primary IPv4 range.",
                    },
                    total_allocated_ip: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    total_free_ip: {
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
          required: false,
        },
        drain_timeout_seconds: {
          name: "Drain Timeout Seconds",
          description:
            "The drain timeout specifies the upper bound in seconds on the amount of time allowed to drain connections from the current ACTIVE subnetwork to the current BACKUP subnetwork. The drain timeout is only applicable when the following conditions are true:  - the subnetwork being patched has purpose = INTERNAL_HTTPS_LOAD_BALANCER  - the subnetwork being patched has role = BACKUP  - the patch request is setting the role to ACTIVE. Note that after this    patch operation the roles of the ACTIVE and BACKUP subnetworks will be    swapped.",
          type: {
            type: "string",
          },
          required: false,
        },
        request_id: {
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
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.subnetwork !== undefined)
          pathParams["subnetwork"] = String(input.event.inputConfig.subnetwork);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.drain_timeout_seconds !== undefined)
          queryParams["drainTimeoutSeconds"] = String(
            input.event.inputConfig.drain_timeout_seconds,
          );
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (
          input.event.inputConfig.allow_subnet_cidr_routes_overlap !== undefined
        )
          body.allow_subnet_cidr_routes_overlap =
            input.event.inputConfig.allow_subnet_cidr_routes_overlap;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.enable_flow_logs !== undefined)
          body.enable_flow_logs = input.event.inputConfig.enable_flow_logs;
        if (input.event.inputConfig.external_ipv6_prefix !== undefined)
          body.external_ipv6_prefix =
            input.event.inputConfig.external_ipv6_prefix;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.gateway_address !== undefined)
          body.gateway_address = input.event.inputConfig.gateway_address;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.internal_ipv6_prefix !== undefined)
          body.internal_ipv6_prefix =
            input.event.inputConfig.internal_ipv6_prefix;
        if (input.event.inputConfig.ip_cidr_range !== undefined)
          body.ip_cidr_range = input.event.inputConfig.ip_cidr_range;
        if (input.event.inputConfig.ip_collection !== undefined)
          body.ip_collection = input.event.inputConfig.ip_collection;
        if (input.event.inputConfig.ipv6_access_type !== undefined)
          body.ipv6_access_type = input.event.inputConfig.ipv6_access_type;
        if (input.event.inputConfig.ipv6_cidr_range !== undefined)
          body.ipv6_cidr_range = input.event.inputConfig.ipv6_cidr_range;
        if (input.event.inputConfig.ipv6_gce_endpoint !== undefined)
          body.ipv6_gce_endpoint = input.event.inputConfig.ipv6_gce_endpoint;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.log_config !== undefined)
          body.log_config = input.event.inputConfig.log_config;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.network !== undefined)
          body.network = input.event.inputConfig.network;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.private_ip_google_access !== undefined)
          body.private_ip_google_access =
            input.event.inputConfig.private_ip_google_access;
        if (input.event.inputConfig.private_ipv6_google_access !== undefined)
          body.private_ipv6_google_access =
            input.event.inputConfig.private_ipv6_google_access;
        if (input.event.inputConfig.purpose !== undefined)
          body.purpose = input.event.inputConfig.purpose;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.reserved_internal_range !== undefined)
          body.reserved_internal_range =
            input.event.inputConfig.reserved_internal_range;
        if (input.event.inputConfig.role !== undefined)
          body.role = input.event.inputConfig.role;
        if (input.event.inputConfig.secondary_ip_ranges !== undefined)
          body.secondary_ip_ranges =
            input.event.inputConfig.secondary_ip_ranges;
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;
        if (input.event.inputConfig.stack_type !== undefined)
          body.stack_type = input.event.inputConfig.stack_type;
        if (input.event.inputConfig.state !== undefined)
          body.state = input.event.inputConfig.state;
        if (
          input.event.inputConfig.system_reserved_external_ipv6_ranges !==
          undefined
        )
          body.system_reserved_external_ipv6_ranges =
            input.event.inputConfig.system_reserved_external_ipv6_ranges;
        if (
          input.event.inputConfig.system_reserved_internal_ipv6_ranges !==
          undefined
        )
          body.system_reserved_internal_ipv6_ranges =
            input.event.inputConfig.system_reserved_internal_ipv6_ranges;
        if (input.event.inputConfig.utilization_details !== undefined)
          body.utilization_details =
            input.event.inputConfig.utilization_details;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/subnetworks/{subnetwork}",
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
          client_operation_id: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creation_timestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          end_time: {
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
                    error_details: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          error_info: {
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
                          localized_message: {
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
                          quota_info: {
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
                              future_limit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limit_name: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metric_name: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rollout_status: {
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
          http_error_message: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          http_error_status_code: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insert_time: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instances_bulk_insert_operation_metadata: {
            type: "object",
            properties: {
              per_location_status: {
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
          operation_group_id: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operation_type: {
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
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          set_common_instance_metadata_operation_metadata: {
            type: "object",
            properties: {
              client_operation_id: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              per_location_operations: {
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
          start_time: {
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
          status_message: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          target_id: {
            type: "string",
            description: "64-bit integer as string",
          },
          target_link: {
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
