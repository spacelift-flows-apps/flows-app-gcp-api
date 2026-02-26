import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Interconnect Attachments - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Interconnect Attachments",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
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
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);

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
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/interconnectAttachments",
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
                admin_enabled: {
                  type: "boolean",
                  description:
                    "Determines whether this Attachment will carry packets. Not present for PARTNER_PROVIDER.",
                },
                attachment_group: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the AttachmentGroup that includes this Attachment.",
                },
                bandwidth: {
                  type: "string",
                  description:
                    "Provisioned bandwidth capacity for the interconnect attachment. For attachments of type DEDICATED, the user can set the bandwidth. For attachments of type PARTNER, the Google Partner that is operating the interconnect must set the bandwidth. Output only for PARTNER type, mutable for PARTNER_PROVIDER and DEDICATED, and can take one of the following values:     - BPS_50M: 50 Mbit/s    - BPS_100M: 100 Mbit/s    - BPS_200M: 200 Mbit/s    - BPS_300M: 300 Mbit/s    - BPS_400M: 400 Mbit/s    - BPS_500M: 500 Mbit/s    - BPS_1G: 1 Gbit/s    - BPS_2G: 2 Gbit/s    - BPS_5G: 5 Gbit/s    - BPS_10G: 10 Gbit/s    - BPS_20G: 20 Gbit/s    - BPS_50G: 50 Gbit/s    - BPS_100G: 100 Gbit/s    - BPS_400G: 400 Gbit/s Check the Bandwidth enum for the list of possible values.",
                },
                candidate_cloud_router_ip_address: {
                  type: "string",
                  description:
                    "Single IPv4 address + prefix length to be configured on the cloud router interface for this interconnect attachment.     - Both candidate_cloud_router_ip_address and    candidate_customer_router_ip_address fields must be set or both must be    unset.    - Prefix length of both candidate_cloud_router_ip_address and    candidate_customer_router_ip_address must be the same.    - Max prefix length is 31.",
                },
                candidate_cloud_router_ipv6_address: {
                  type: "string",
                  description:
                    "Single IPv6 address + prefix length to be configured on the cloud router interface for this interconnect attachment.     - Both candidate_cloud_router_ipv6_address and    candidate_customer_router_ipv6_address fields must be set or both must be    unset.    - Prefix length of both candidate_cloud_router_ipv6_address and    candidate_customer_router_ipv6_address must be the same.    - Max prefix length is 126.",
                },
                candidate_customer_router_ip_address: {
                  type: "string",
                  description:
                    "Single IPv4 address + prefix length to be configured on the customer router interface for this interconnect attachment.",
                },
                candidate_customer_router_ipv6_address: {
                  type: "string",
                  description:
                    "Single IPv6 address + prefix length to be configured on the customer router interface for this interconnect attachment.",
                },
                candidate_ipv6_subnets: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "This field is not available.",
                },
                candidate_subnets: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Input only. Up to 16 candidate prefixes that can be used to restrict the allocation of cloudRouterIpAddress and customerRouterIpAddress for this attachment. All prefixes must be within link-local address space (169.254.0.0/16) and must be /29 or shorter (/28, /27, etc). Google will attempt to select an unused /29 from the supplied candidate prefix(es). The request will fail if all possible /29s are in use on Google's edge. If not supplied, Google will randomly select an unused /29 from all of link-local space.",
                },
                cloud_router_ip_address: {
                  type: "string",
                  description:
                    "Output only. [Output Only] IPv4 address + prefix length to be configured on Cloud Router Interface for this interconnect attachment.",
                },
                cloud_router_ipv6_address: {
                  type: "string",
                  description:
                    "Output only. [Output Only] IPv6 address + prefix length to be configured on Cloud Router Interface for this interconnect attachment.",
                },
                cloud_router_ipv6_interface_id: {
                  type: "string",
                  description: "This field is not available.",
                },
                configuration_constraints: {
                  type: "object",
                  properties: {
                    bgp_md5: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Whether the attachment's BGP session requires/allows/disallows BGP MD5 authentication. This can take one of the following values: MD5_OPTIONAL, MD5_REQUIRED, MD5_UNSUPPORTED.  For example, a Cross-Cloud Interconnect connection to a remote cloud provider that requires BGP MD5 authentication has the interconnectRemoteLocation attachment_configuration_constraints.bgp_md5 field set to MD5_REQUIRED, and that property is propagated to the attachment. Similarly, if BGP MD5 is MD5_UNSUPPORTED, an error is returned if MD5 is requested. Check the BgpMd5 enum for the list of possible values.",
                    },
                    bgp_peer_asn_ranges: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          max: {
                            type: "integer",
                          },
                          min: {
                            type: "integer",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "Output only. [Output Only] List of ASN ranges that the remote location is known to support. Formatted as an array of inclusive ranges {min: min-value, max: max-value}. For example, [{min: 123, max: 123}, {min: 64512, max: 65534}] allows the peer ASN to be 123 or anything in the range 64512-65534.  This field is only advisory. Although the API accepts other ranges, these are the ranges that we recommend.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output Only] Constraints for this attachment, if any. The attachment does not work if these constraints are not met.",
                },
                creation_timestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                customer_router_ip_address: {
                  type: "string",
                  description:
                    "Output only. [Output Only] IPv4 address + prefix length to be configured on the customer router subinterface for this interconnect attachment.",
                },
                customer_router_ipv6_address: {
                  type: "string",
                  description:
                    "Output only. [Output Only] IPv6 address + prefix length to be configured on the customer router subinterface for this interconnect attachment.",
                },
                customer_router_ipv6_interface_id: {
                  type: "string",
                  description: "This field is not available.",
                },
                dataplane_version: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] Dataplane version for this InterconnectAttachment. This field is only present for Dataplane version 2 and higher. Absence of this field in the API output indicates that the Dataplane is version 1.",
                },
                description: {
                  type: "string",
                  description: "An optional description of this resource.",
                },
                edge_availability_domain: {
                  type: "string",
                  description:
                    "Input only. Desired availability domain for the attachment. Only available for type PARTNER, at creation time, and can take one of the following values:     - AVAILABILITY_DOMAIN_ANY    - AVAILABILITY_DOMAIN_1    - AVAILABILITY_DOMAIN_2   For improved reliability, customers should configure a pair of attachments, one per availability domain. The selected availability domain will be provided to the Partner via the pairing key, so that the provisioned circuit will lie in the specified domain. If not specified, the value will default to AVAILABILITY_DOMAIN_ANY. Check the EdgeAvailabilityDomain enum for the list of possible values.",
                },
                encryption: {
                  type: "string",
                  description:
                    "Indicates the user-supplied encryption option of this VLAN attachment (interconnectAttachment). Can only be specified at attachment creation for PARTNER or DEDICATED attachments. Possible values are:     - NONE - This is the default value, which means that the    VLAN attachment carries unencrypted traffic. VMs are able to send    traffic to, or receive traffic from, such a VLAN attachment.    - IPSEC - The VLAN attachment carries only encrypted    traffic that is encrypted by an IPsec device, such as an HA VPN gateway or    third-party IPsec VPN. VMs cannot directly send traffic to, or receive    traffic from, such a VLAN attachment. To use *HA VPN over Cloud    Interconnect*, the VLAN attachment must be created with this    option. Check the Encryption enum for the list of possible values.",
                },
                google_reference_id: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Google reference ID, to be used when raising support tickets with Google or otherwise to debug backend connectivity issues. [Deprecated] This field is not used.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                interconnect: {
                  type: "string",
                  description:
                    "URL of the underlying Interconnect object that this attachment's traffic will traverse through.",
                },
                ipsec_internal_addresses: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of URLs of addresses that have been reserved for the VLAN attachment. Used only for the VLAN attachment that has the encryption option as IPSEC. The addresses must be regional internal IP address ranges. When creating an HA VPN gateway over the VLAN attachment, if the attachment is configured to use a regional internal IP address, then the VPN gateway's IP address is allocated from the IP address range specified here. For example, if the HA VPN gateway's interface 0 is paired to this VLAN attachment, then a regional internal IP address for the VPN gateway interface 0 will be allocated from the IP address specified for this VLAN attachment. If this field is not specified when creating the VLAN attachment, then later on when creating an HA VPN gateway on this VLAN attachment, the HA VPN gateway's IP address is allocated from the regional external IP address pool.",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Alwayscompute#interconnectAttachment for interconnect attachments.",
                },
                l2_forwarding: {
                  type: "object",
                  properties: {
                    appliance_mappings: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        'Optional. A map of VLAN tags to appliances and optional inner mapping rules. If VLANs are not explicitly mapped to any appliance, the defaultApplianceIpAddress is used.  Each VLAN tag can be a single number or a range of numbers in the range of 1 to 4094, e.g., "1" or "4001-4094". Non-empty and non-overlapping VLAN tag ranges are enforced, and violating operations will be rejected.  The VLAN tags in the Ethernet header must use an ethertype value of 0x88A8 or 0x8100.',
                    },
                    default_appliance_ip_address: {
                      type: "string",
                      description:
                        "Optional. A single IPv4 or IPv6 address used as the default destination IP when there is no VLAN mapping result found.  Unset field (null-value) indicates the unmatched packet should be dropped.",
                    },
                    geneve_header: {
                      type: "object",
                      properties: {
                        vni: {
                          type: "integer",
                          description:
                            "Optional. VNI is a 24-bit unique virtual network identifier, from 0 to 16,777,215.",
                        },
                      },
                      description: "GeneveHeader related configurations.",
                      additionalProperties: true,
                    },
                    network: {
                      type: "string",
                      description:
                        "Required. Resource URL of the network to which this attachment belongs.",
                    },
                    tunnel_endpoint_ip_address: {
                      type: "string",
                      description:
                        "Required. A single IPv4 or IPv6 address. This address will be used as the source IP address for packets sent to the appliances, and must be used as the destination IP address for packets that should be sent out through this attachment.",
                    },
                  },
                  description:
                    "L2 Interconnect Attachment related configuration.",
                  additionalProperties: true,
                },
                label_fingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this InterconnectAttachment, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an InterconnectAttachment.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
                },
                mtu: {
                  type: "integer",
                  description:
                    "Maximum Transmission Unit (MTU), in bytes, of packets passing through this interconnect attachment. Valid values are 1440, 1460, 1500, and 8896. If not specified, the value will default to 1440.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                operational_status: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The current status of whether or not this interconnect attachment is functional, which can take one of the following values:     - OS_ACTIVE: The attachment has been turned up and is ready to    use.    - OS_UNPROVISIONED: The attachment is not ready to use yet,    because turnup is not complete. Check the OperationalStatus enum for the list of possible values.",
                },
                pairing_key: {
                  type: "string",
                  description:
                    '[Output only for type PARTNER. Input only for PARTNER_PROVIDER. Not present for DEDICATED]. The opaque identifier of a PARTNER attachment used to initiate provisioning with a selected partner. Of the form "XXXXX/region/domain"',
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
                  description: "Additional interconnect attachment parameters.",
                  additionalProperties: true,
                },
                partner_asn: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                partner_metadata: {
                  type: "object",
                  properties: {
                    interconnect_name: {
                      type: "string",
                      description:
                        'Plain text name of the Interconnect this attachment is connected to, as displayed in the Partner\'s portal. For instance "Chicago 1". This value may be validated to match approved Partner values.',
                    },
                    partner_name: {
                      type: "string",
                      description:
                        "Plain text name of the Partner providing this attachment. This value may be validated to match approved Partner values.",
                    },
                    portal_url: {
                      type: "string",
                      description:
                        "URL of the Partner's portal for this Attachment. Partners may customise this to be a deep link to the specific resource on the Partner portal. This value may be validated to match approved Partner values.",
                    },
                  },
                  description:
                    "Informational metadata about Partner attachments from Partners to display to customers.  These fields are propagated from PARTNER_PROVIDER attachments to their corresponding PARTNER attachments.",
                  additionalProperties: true,
                },
                private_interconnect_info: {
                  type: "object",
                  properties: {
                    tag8021q: {
                      type: "integer",
                      description:
                        "[Output Only] 802.1q encapsulation tag to be used for traffic between Google and the customer, going to and from this network and region.",
                    },
                  },
                  description:
                    "Information for an interconnect attachment when this belongs to an interconnect of type DEDICATED.",
                  additionalProperties: true,
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the region where the regional interconnect attachment resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
                },
                remote_service: {
                  type: "string",
                  description:
                    'Output only. [Output Only] If the attachment is on a Cross-Cloud Interconnect connection, this field contains the interconnect\'s remote location service provider. Example values: "Amazon Web Services" "Microsoft Azure".  The field is set only for attachments on Cross-Cloud Interconnect connections. Its value is copied from the InterconnectRemoteLocation remoteService field.',
                },
                router: {
                  type: "string",
                  description:
                    "URL of the Cloud Router to be used for dynamic routing. This router must be in the same region as this InterconnectAttachment. The InterconnectAttachment will automatically connect the Interconnect to the network & region within which the Cloud Router is configured.",
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
                stack_type: {
                  type: "string",
                  description:
                    "The stack type for this interconnect attachment to identify whether the IPv6 feature is enabled or not. If not specified, IPV4_ONLY will be used.  This field can be both set at interconnect attachments creation and update interconnect attachment operations. Check the StackType enum for the list of possible values.",
                },
                state: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The current state of this attachment's functionality. Enum values ACTIVE and UNPROVISIONED are shared by DEDICATED/PRIVATE, PARTNER, and PARTNER_PROVIDER interconnect attachments, while enum values PENDING_PARTNER, PARTNER_REQUEST_RECEIVED, and PENDING_CUSTOMER are used for only PARTNER and PARTNER_PROVIDER interconnect attachments. This state can take one of the following values:     - ACTIVE: The attachment has been turned up and is ready to use.    - UNPROVISIONED: The attachment is not ready to use yet, because turnup    is not complete.    - PENDING_PARTNER: A newly-created PARTNER attachment that has not yet    been configured on the Partner side.    - PARTNER_REQUEST_RECEIVED: A PARTNER attachment is in the process of    provisioning after a PARTNER_PROVIDER attachment was created that    references it.    - PENDING_CUSTOMER: A PARTNER or PARTNER_PROVIDER    attachment that is waiting for a customer to activate it.    - DEFUNCT:    The attachment was deleted externally and is no longer functional. This    could be because the associated Interconnect was removed, or because the    other side of a Partner attachment was deleted. Check the State enum for the list of possible values.",
                },
                subnet_length: {
                  type: "integer",
                  description:
                    "Input only. Length of the IPv4 subnet mask. Allowed values:       - 29 (default)     - 30  The default value is 29, except for Cross-Cloud Interconnect connections that use an InterconnectRemoteLocation with a constraints.subnetLengthRange.min equal to 30. For example, connections that use an Azure remote location fall into this category. In these cases, the default value is 30, and requesting 29 returns an error.  Where both 29 and 30 are allowed, 29 is preferred, because it gives Google Cloud Support more debugging visibility.",
                },
                type: {
                  type: "string",
                  description:
                    "The type of interconnect attachment this is, which can take one of the following values:     - DEDICATED: an attachment to a Dedicated Interconnect.    - PARTNER: an attachment to a Partner Interconnect, created by the    customer.    - PARTNER_PROVIDER: an attachment to a Partner Interconnect, created by    the partner.  - L2_DEDICATED: a L2 attachment to a Dedicated Interconnect. Check the Type enum for the list of possible values.",
                },
                vlan_tag8021q: {
                  type: "integer",
                  description:
                    "The IEEE 802.1Q VLAN tag for this attachment, in the range 2-4093. Only specified at creation time.",
                },
              },
              description:
                "Represents an Interconnect Attachment (VLAN) resource.  You can use Interconnect attachments (VLANS) to connect your Virtual Private Cloud networks to your on-premises networks through an Interconnect. For more information, read Creating VLAN Attachments.",
              additionalProperties: true,
            },
            description: "A list of InterconnectAttachment resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#interconnectAttachmentList for lists of interconnect attachments.",
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
          "Response to the list request, and contains a list of interconnect attachments.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
