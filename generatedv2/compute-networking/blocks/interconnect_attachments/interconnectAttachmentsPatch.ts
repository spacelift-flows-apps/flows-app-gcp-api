import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const interconnectAttachmentsPatch: AppBlock = {
  name: "Interconnect Attachments - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Interconnect Attachments",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
            description: "Name of the region scoping this request.",
          },
          required: true,
        },
        interconnectAttachment: {
          name: "Interconnect Attachment",
          description: "Name of the interconnect attachment to patch.",
          type: {
            type: "string",
            description: "Name of the interconnect attachment to patch.",
          },
          required: true,
        },
        adminEnabled: {
          name: "Admin Enabled",
          description:
            "Determines whether this Attachment will carry packets. Not present for PARTNER_PROVIDER.",
          type: {
            type: "boolean",
            description:
              "Determines whether this Attachment will carry packets. Not present for PARTNER_PROVIDER.",
          },
          required: false,
        },
        bandwidth: {
          name: "Bandwidth",
          description:
            "Provisioned bandwidth capacity for the interconnect attachment. For attachments of type DEDICATED, the user can set the bandwidth. For attachments of type PARTNER, the Google Partner that is operating the interconnect must set the bandwidth. Output only for PARTNER type, mutable for PARTNER_PROVIDER and DEDICATED, and can take one of the following values:     - BPS_50M: 50 Mbit/s    - BPS_100M: 100 Mbit/s    - BPS_200M: 200 Mbit/s    - BPS_300M: 300 Mbit/s    - BPS_400M: 400 Mbit/s    - BPS_500M: 500 Mbit/s    - BPS_1G: 1 Gbit/s    - BPS_2G: 2 Gbit/s    - BPS_5G: 5 Gbit/s    - BPS_10G: 10 Gbit/s    - BPS_20G: 20 Gbit/s    - BPS_50G: 50 Gbit/s    - BPS_100G: 100 Gbit/s    - BPS_400G: 400 Gbit/s Check the Bandwidth enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_BANDWIDTH",
              "BPS_100G",
              "BPS_100M",
              "BPS_10G",
              "BPS_1G",
              "BPS_200M",
              "BPS_20G",
              "BPS_2G",
              "BPS_300M",
              "BPS_400G",
              "BPS_400M",
              "BPS_500M",
              "BPS_50G",
              "BPS_50M",
              "BPS_5G",
            ],
            description:
              "Provisioned bandwidth capacity for the interconnect attachment. For attachments of type DEDICATED, the user can set the bandwidth. For attachments of type PARTNER, the Google Partner that is operating the interconnect must set the bandwidth. Output only for PARTNER type, mutable for PARTNER_PROVIDER and DEDICATED, and can take one of the following values:     - BPS_50M: 50 Mbit/s    - BPS_100M: 100 Mbit/s    - BPS_200M: 200 Mbit/s    - BPS_300M: 300 Mbit/s    - BPS_400M: 400 Mbit/s    - BPS_500M: 500 Mbit/s    - BPS_1G: 1 Gbit/s    - BPS_2G: 2 Gbit/s    - BPS_5G: 5 Gbit/s    - BPS_10G: 10 Gbit/s    - BPS_20G: 20 Gbit/s    - BPS_50G: 50 Gbit/s    - BPS_100G: 100 Gbit/s    - BPS_400G: 400 Gbit/s Check the Bandwidth enum for the list of possible values.",
          },
          required: false,
        },
        candidateCloudRouterIpAddress: {
          name: "Candidate Cloud Router Ip Address",
          description:
            "Single IPv4 address + prefix length to be configured on the cloud router interface for this interconnect attachment.     - Both candidate_cloud_router_ip_address and    candidate_customer_router_ip_address fields must be set or both must be    unset.    - Prefix length of both candidate_cloud_router_ip_address and    candidate_customer_router_ip_address must be the same.    - Max prefix length is 31.",
          type: {
            type: "string",
            description:
              "Single IPv4 address + prefix length to be configured on the cloud router interface for this interconnect attachment.     - Both candidate_cloud_router_ip_address and    candidate_customer_router_ip_address fields must be set or both must be    unset.    - Prefix length of both candidate_cloud_router_ip_address and    candidate_customer_router_ip_address must be the same.    - Max prefix length is 31.",
          },
          required: false,
        },
        candidateCloudRouterIpv6Address: {
          name: "Candidate Cloud Router Ipv6 Address",
          description:
            "Single IPv6 address + prefix length to be configured on the cloud router interface for this interconnect attachment.     - Both candidate_cloud_router_ipv6_address and    candidate_customer_router_ipv6_address fields must be set or both must be    unset.    - Prefix length of both candidate_cloud_router_ipv6_address and    candidate_customer_router_ipv6_address must be the same.    - Max prefix length is 126.",
          type: {
            type: "string",
            description:
              "Single IPv6 address + prefix length to be configured on the cloud router interface for this interconnect attachment.     - Both candidate_cloud_router_ipv6_address and    candidate_customer_router_ipv6_address fields must be set or both must be    unset.    - Prefix length of both candidate_cloud_router_ipv6_address and    candidate_customer_router_ipv6_address must be the same.    - Max prefix length is 126.",
          },
          required: false,
        },
        candidateCustomerRouterIpAddress: {
          name: "Candidate Customer Router Ip Address",
          description:
            "Single IPv4 address + prefix length to be configured on the customer router interface for this interconnect attachment.",
          type: {
            type: "string",
            description:
              "Single IPv4 address + prefix length to be configured on the customer router interface for this interconnect attachment.",
          },
          required: false,
        },
        candidateCustomerRouterIpv6Address: {
          name: "Candidate Customer Router Ipv6 Address",
          description:
            "Single IPv6 address + prefix length to be configured on the customer router interface for this interconnect attachment.",
          type: {
            type: "string",
            description:
              "Single IPv6 address + prefix length to be configured on the customer router interface for this interconnect attachment.",
          },
          required: false,
        },
        candidateIpv6Subnets: {
          name: "Candidate Ipv6 Subnets",
          description: "This field is not available.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "This field is not available.",
          },
          required: false,
        },
        candidateSubnets: {
          name: "Candidate Subnets",
          description:
            "Input only. Up to 16 candidate prefixes that can be used to restrict the allocation of cloudRouterIpAddress and customerRouterIpAddress for this attachment. All prefixes must be within link-local address space (169.254.0.0/16) and must be /29 or shorter (/28, /27, etc). Google will attempt to select an unused /29 from the supplied candidate prefix(es). The request will fail if all possible /29s are in use on Google's edge. If not supplied, Google will randomly select an unused /29 from all of link-local space.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Input only. Up to 16 candidate prefixes that can be used to restrict the allocation of cloudRouterIpAddress and customerRouterIpAddress for this attachment. All prefixes must be within link-local address space (169.254.0.0/16) and must be /29 or shorter (/28, /27, etc). Google will attempt to select an unused /29 from the supplied candidate prefix(es). The request will fail if all possible /29s are in use on Google's edge. If not supplied, Google will randomly select an unused /29 from all of link-local space.",
          },
          required: false,
        },
        cloudRouterIpv6InterfaceId: {
          name: "Cloud Router Ipv6 Interface Id",
          description: "This field is not available.",
          type: {
            type: "string",
            description: "This field is not available.",
          },
          required: false,
        },
        customerRouterIpv6InterfaceId: {
          name: "Customer Router Ipv6 Interface Id",
          description: "This field is not available.",
          type: {
            type: "string",
            description: "This field is not available.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description: "An optional description of this resource.",
          },
          required: false,
        },
        edgeAvailabilityDomain: {
          name: "Edge Availability Domain",
          description:
            "Input only. Desired availability domain for the attachment. Only available for type PARTNER, at creation time, and can take one of the following values:     - AVAILABILITY_DOMAIN_ANY    - AVAILABILITY_DOMAIN_1    - AVAILABILITY_DOMAIN_2   For improved reliability, customers should configure a pair of attachments, one per availability domain. The selected availability domain will be provided to the Partner via the pairing key, so that the provisioned circuit will lie in the specified domain. If not specified, the value will default to AVAILABILITY_DOMAIN_ANY. Check the EdgeAvailabilityDomain enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_EDGE_AVAILABILITY_DOMAIN",
              "AVAILABILITY_DOMAIN_1",
              "AVAILABILITY_DOMAIN_2",
              "AVAILABILITY_DOMAIN_ANY",
            ],
            description:
              "Input only. Desired availability domain for the attachment. Only available for type PARTNER, at creation time, and can take one of the following values:     - AVAILABILITY_DOMAIN_ANY    - AVAILABILITY_DOMAIN_1    - AVAILABILITY_DOMAIN_2   For improved reliability, customers should configure a pair of attachments, one per availability domain. The selected availability domain will be provided to the Partner via the pairing key, so that the provisioned circuit will lie in the specified domain. If not specified, the value will default to AVAILABILITY_DOMAIN_ANY. Check the EdgeAvailabilityDomain enum for the list of possible values.",
          },
          required: false,
        },
        encryption: {
          name: "Encryption",
          description:
            "Indicates the user-supplied encryption option of this VLAN attachment (interconnectAttachment). Can only be specified at attachment creation for PARTNER or DEDICATED attachments. Possible values are:     - NONE - This is the default value, which means that the    VLAN attachment carries unencrypted traffic. VMs are able to send    traffic to, or receive traffic from, such a VLAN attachment.    - IPSEC - The VLAN attachment carries only encrypted    traffic that is encrypted by an IPsec device, such as an HA VPN gateway or    third-party IPsec VPN. VMs cannot directly send traffic to, or receive    traffic from, such a VLAN attachment. To use *HA VPN over Cloud    Interconnect*, the VLAN attachment must be created with this    option. Check the Encryption enum for the list of possible values.",
          type: {
            type: "string",
            enum: ["UNDEFINED_ENCRYPTION", "IPSEC", "NONE"],
            description:
              "Indicates the user-supplied encryption option of this VLAN attachment (interconnectAttachment). Can only be specified at attachment creation for PARTNER or DEDICATED attachments. Possible values are:     - NONE - This is the default value, which means that the    VLAN attachment carries unencrypted traffic. VMs are able to send    traffic to, or receive traffic from, such a VLAN attachment.    - IPSEC - The VLAN attachment carries only encrypted    traffic that is encrypted by an IPsec device, such as an HA VPN gateway or    third-party IPsec VPN. VMs cannot directly send traffic to, or receive    traffic from, such a VLAN attachment. To use *HA VPN over Cloud    Interconnect*, the VLAN attachment must be created with this    option. Check the Encryption enum for the list of possible values.",
          },
          required: false,
        },
        interconnect: {
          name: "Interconnect",
          description:
            "URL of the underlying Interconnect object that this attachment's traffic will traverse through.",
          type: {
            type: "string",
            description:
              "URL of the underlying Interconnect object that this attachment's traffic will traverse through.",
          },
          required: false,
        },
        ipsecInternalAddresses: {
          name: "Ipsec Internal Addresses",
          description:
            "A list of URLs of addresses that have been reserved for the VLAN attachment. Used only for the VLAN attachment that has the encryption option as IPSEC. The addresses must be regional internal IP address ranges. When creating an HA VPN gateway over the VLAN attachment, if the attachment is configured to use a regional internal IP address, then the VPN gateway's IP address is allocated from the IP address range specified here. For example, if the HA VPN gateway's interface 0 is paired to this VLAN attachment, then a regional internal IP address for the VPN gateway interface 0 will be allocated from the IP address specified for this VLAN attachment. If this field is not specified when creating the VLAN attachment, then later on when creating an HA VPN gateway on this VLAN attachment, the HA VPN gateway's IP address is allocated from the regional external IP address pool.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of URLs of addresses that have been reserved for the VLAN attachment. Used only for the VLAN attachment that has the encryption option as IPSEC. The addresses must be regional internal IP address ranges. When creating an HA VPN gateway over the VLAN attachment, if the attachment is configured to use a regional internal IP address, then the VPN gateway's IP address is allocated from the IP address range specified here. For example, if the HA VPN gateway's interface 0 is paired to this VLAN attachment, then a regional internal IP address for the VPN gateway interface 0 will be allocated from the IP address specified for this VLAN attachment. If this field is not specified when creating the VLAN attachment, then later on when creating an HA VPN gateway on this VLAN attachment, the HA VPN gateway's IP address is allocated from the regional external IP address pool.",
          },
          required: false,
        },
        l2Forwarding: {
          name: "L2 Forwarding",
          description:
            "L2 Interconnect Attachment related config. This field is required if the type is L2_DEDICATED.  The configuration specifies how VLAN tags (like dot1q, qinq, or dot1ad) within L2 packets are mapped to the destination appliances IP addresses. The packet is then encapsulated with the appliance IP address and sent to the edge appliance.",
          type: {
            type: "object",
            properties: {
              applianceMappings: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Optional. A map of VLAN tags to appliances and optional inner mapping rules. If VLANs are not explicitly mapped to any appliance, the defaultApplianceIpAddress is used.  Each VLAN tag can be a single number or a range of numbers in the range of 1 to 4094, e.g., "1" or "4001-4094". Non-empty and non-overlapping VLAN tag ranges are enforced, and violating operations will be rejected.  The VLAN tags in the Ethernet header must use an ethertype value of 0x88A8 or 0x8100.',
              },
              defaultApplianceIpAddress: {
                type: "string",
                description:
                  "Optional. A single IPv4 or IPv6 address used as the default destination IP when there is no VLAN mapping result found.  Unset field (null-value) indicates the unmatched packet should be dropped.",
              },
              geneveHeader: {
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
              tunnelEndpointIpAddress: {
                type: "string",
                description:
                  "Required. A single IPv4 or IPv6 address. This address will be used as the source IP address for packets sent to the appliances, and must be used as the destination IP address for packets that should be sent out through this attachment.",
              },
            },
            description: "L2 Interconnect Attachment related configuration.",
            additionalProperties: true,
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this InterconnectAttachment, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an InterconnectAttachment.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this InterconnectAttachment, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an InterconnectAttachment.",
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
        mtu: {
          name: "Mtu",
          description:
            "Maximum Transmission Unit (MTU), in bytes, of packets passing through this interconnect attachment. Valid values are 1440, 1460, 1500, and 8896. If not specified, the value will default to 1440.",
          type: {
            type: "integer",
            description:
              "Maximum Transmission Unit (MTU), in bytes, of packets passing through this interconnect attachment. Valid values are 1440, 1460, 1500, and 8896. If not specified, the value will default to 1440.",
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
        pairingKey: {
          name: "Pairing Key",
          description:
            '[Output only for type PARTNER. Input only for PARTNER_PROVIDER. Not present for DEDICATED]. The opaque identifier of a PARTNER attachment used to initiate provisioning with a selected partner. Of the form "XXXXX/region/domain"',
          type: {
            type: "string",
            description:
              '[Output only for type PARTNER. Input only for PARTNER_PROVIDER. Not present for DEDICATED]. The opaque identifier of a PARTNER attachment used to initiate provisioning with a selected partner. Of the form "XXXXX/region/domain"',
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
            description: "Additional interconnect attachment parameters.",
            additionalProperties: true,
          },
          required: false,
        },
        partnerAsn: {
          name: "Partner Asn",
          description:
            "Optional BGP ASN for the router supplied by a Layer 3 Partner if they configured BGP on behalf of the customer. Output only for PARTNER type, input only for PARTNER_PROVIDER, not available for DEDICATED.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        partnerMetadata: {
          name: "Partner Metadata",
          description:
            "Informational metadata about Partner attachments from Partners to display to customers. Output only for PARTNER type, mutable for PARTNER_PROVIDER, not available for DEDICATED.",
          type: {
            type: "object",
            properties: {
              interconnectName: {
                type: "string",
                description:
                  'Plain text name of the Interconnect this attachment is connected to, as displayed in the Partner\'s portal. For instance "Chicago 1". This value may be validated to match approved Partner values.',
              },
              partnerName: {
                type: "string",
                description:
                  "Plain text name of the Partner providing this attachment. This value may be validated to match approved Partner values.",
              },
              portalUrl: {
                type: "string",
                description:
                  "URL of the Partner's portal for this Attachment. Partners may customise this to be a deep link to the specific resource on the Partner portal. This value may be validated to match approved Partner values.",
              },
            },
            description:
              "Informational metadata about Partner attachments from Partners to display to customers.  These fields are propagated from PARTNER_PROVIDER attachments to their corresponding PARTNER attachments.",
            additionalProperties: true,
          },
          required: false,
        },
        router: {
          name: "Router",
          description:
            "URL of the Cloud Router to be used for dynamic routing. This router must be in the same region as this InterconnectAttachment. The InterconnectAttachment will automatically connect the Interconnect to the network & region within which the Cloud Router is configured.",
          type: {
            type: "string",
            description:
              "URL of the Cloud Router to be used for dynamic routing. This router must be in the same region as this InterconnectAttachment. The InterconnectAttachment will automatically connect the Interconnect to the network & region within which the Cloud Router is configured.",
          },
          required: false,
        },
        stackType: {
          name: "Stack Type",
          description:
            "The stack type for this interconnect attachment to identify whether the IPv6 feature is enabled or not. If not specified, IPV4_ONLY will be used.  This field can be both set at interconnect attachments creation and update interconnect attachment operations. Check the StackType enum for the list of possible values.",
          type: {
            type: "string",
            enum: ["UNDEFINED_STACK_TYPE", "IPV4_IPV6", "IPV4_ONLY"],
            description:
              "The stack type for this interconnect attachment to identify whether the IPv6 feature is enabled or not. If not specified, IPV4_ONLY will be used.  This field can be both set at interconnect attachments creation and update interconnect attachment operations. Check the StackType enum for the list of possible values.",
          },
          required: false,
        },
        subnetLength: {
          name: "Subnet Length",
          description:
            "Input only. Length of the IPv4 subnet mask. Allowed values:       - 29 (default)     - 30  The default value is 29, except for Cross-Cloud Interconnect connections that use an InterconnectRemoteLocation with a constraints.subnetLengthRange.min equal to 30. For example, connections that use an Azure remote location fall into this category. In these cases, the default value is 30, and requesting 29 returns an error.  Where both 29 and 30 are allowed, 29 is preferred, because it gives Google Cloud Support more debugging visibility.",
          type: {
            type: "integer",
            description:
              "Input only. Length of the IPv4 subnet mask. Allowed values:       - 29 (default)     - 30  The default value is 29, except for Cross-Cloud Interconnect connections that use an InterconnectRemoteLocation with a constraints.subnetLengthRange.min equal to 30. For example, connections that use an Azure remote location fall into this category. In these cases, the default value is 30, and requesting 29 returns an error.  Where both 29 and 30 are allowed, 29 is preferred, because it gives Google Cloud Support more debugging visibility.",
          },
          required: false,
        },
        type: {
          name: "Type",
          description:
            "The type of interconnect attachment this is, which can take one of the following values:     - DEDICATED: an attachment to a Dedicated Interconnect.    - PARTNER: an attachment to a Partner Interconnect, created by the    customer.    - PARTNER_PROVIDER: an attachment to a Partner Interconnect, created by    the partner.  - L2_DEDICATED: a L2 attachment to a Dedicated Interconnect. Check the Type enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_TYPE",
              "DEDICATED",
              "L2_DEDICATED",
              "PARTNER",
              "PARTNER_PROVIDER",
            ],
            description:
              "The type of interconnect attachment this is, which can take one of the following values:     - DEDICATED: an attachment to a Dedicated Interconnect.    - PARTNER: an attachment to a Partner Interconnect, created by the    customer.    - PARTNER_PROVIDER: an attachment to a Partner Interconnect, created by    the partner.  - L2_DEDICATED: a L2 attachment to a Dedicated Interconnect. Check the Type enum for the list of possible values.",
          },
          required: false,
        },
        vlanTag8021q: {
          name: "Vlan Tag8021q",
          description:
            "The IEEE 802.1Q VLAN tag for this attachment, in the range 2-4093. Only specified at creation time.",
          type: {
            type: "integer",
            description:
              "The IEEE 802.1Q VLAN tag for this attachment, in the range 2-4093. Only specified at creation time.",
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
            description:
              "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.interconnectAttachment !== undefined)
          pathParams["interconnect_attachment"] = String(
            input.event.inputConfig.interconnectAttachment,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.adminEnabled !== undefined)
          body.adminEnabled = input.event.inputConfig.adminEnabled;
        if (input.event.inputConfig.attachmentGroup !== undefined)
          body.attachmentGroup = input.event.inputConfig.attachmentGroup;
        if (input.event.inputConfig.bandwidth !== undefined)
          body.bandwidth = input.event.inputConfig.bandwidth;
        if (input.event.inputConfig.candidateCloudRouterIpAddress !== undefined)
          body.candidateCloudRouterIpAddress =
            input.event.inputConfig.candidateCloudRouterIpAddress;
        if (
          input.event.inputConfig.candidateCloudRouterIpv6Address !== undefined
        )
          body.candidateCloudRouterIpv6Address =
            input.event.inputConfig.candidateCloudRouterIpv6Address;
        if (
          input.event.inputConfig.candidateCustomerRouterIpAddress !== undefined
        )
          body.candidateCustomerRouterIpAddress =
            input.event.inputConfig.candidateCustomerRouterIpAddress;
        if (
          input.event.inputConfig.candidateCustomerRouterIpv6Address !==
          undefined
        )
          body.candidateCustomerRouterIpv6Address =
            input.event.inputConfig.candidateCustomerRouterIpv6Address;
        if (input.event.inputConfig.candidateIpv6Subnets !== undefined)
          body.candidateIpv6Subnets =
            input.event.inputConfig.candidateIpv6Subnets;
        if (input.event.inputConfig.candidateSubnets !== undefined)
          body.candidateSubnets = input.event.inputConfig.candidateSubnets;
        if (input.event.inputConfig.cloudRouterIpAddress !== undefined)
          body.cloudRouterIpAddress =
            input.event.inputConfig.cloudRouterIpAddress;
        if (input.event.inputConfig.cloudRouterIpv6Address !== undefined)
          body.cloudRouterIpv6Address =
            input.event.inputConfig.cloudRouterIpv6Address;
        if (input.event.inputConfig.cloudRouterIpv6InterfaceId !== undefined)
          body.cloudRouterIpv6InterfaceId =
            input.event.inputConfig.cloudRouterIpv6InterfaceId;
        if (input.event.inputConfig.configurationConstraints !== undefined)
          body.configurationConstraints =
            input.event.inputConfig.configurationConstraints;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.customerRouterIpAddress !== undefined)
          body.customerRouterIpAddress =
            input.event.inputConfig.customerRouterIpAddress;
        if (input.event.inputConfig.customerRouterIpv6Address !== undefined)
          body.customerRouterIpv6Address =
            input.event.inputConfig.customerRouterIpv6Address;
        if (input.event.inputConfig.customerRouterIpv6InterfaceId !== undefined)
          body.customerRouterIpv6InterfaceId =
            input.event.inputConfig.customerRouterIpv6InterfaceId;
        if (input.event.inputConfig.dataplaneVersion !== undefined)
          body.dataplaneVersion = input.event.inputConfig.dataplaneVersion;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.edgeAvailabilityDomain !== undefined)
          body.edgeAvailabilityDomain =
            input.event.inputConfig.edgeAvailabilityDomain;
        if (input.event.inputConfig.encryption !== undefined)
          body.encryption = input.event.inputConfig.encryption;
        if (input.event.inputConfig.googleReferenceId !== undefined)
          body.googleReferenceId = input.event.inputConfig.googleReferenceId;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.interconnect !== undefined)
          body.interconnect = input.event.inputConfig.interconnect;
        if (input.event.inputConfig.ipsecInternalAddresses !== undefined)
          body.ipsecInternalAddresses =
            input.event.inputConfig.ipsecInternalAddresses;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.l2Forwarding !== undefined)
          body.l2Forwarding = input.event.inputConfig.l2Forwarding;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          body.labelFingerprint = input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.mtu !== undefined)
          body.mtu = input.event.inputConfig.mtu;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.operationalStatus !== undefined)
          body.operationalStatus = input.event.inputConfig.operationalStatus;
        if (input.event.inputConfig.pairingKey !== undefined)
          body.pairingKey = input.event.inputConfig.pairingKey;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.partnerAsn !== undefined)
          body.partnerAsn = input.event.inputConfig.partnerAsn;
        if (input.event.inputConfig.partnerMetadata !== undefined)
          body.partnerMetadata = input.event.inputConfig.partnerMetadata;
        if (input.event.inputConfig.privateInterconnectInfo !== undefined)
          body.privateInterconnectInfo =
            input.event.inputConfig.privateInterconnectInfo;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.remoteService !== undefined)
          body.remoteService = input.event.inputConfig.remoteService;
        if (input.event.inputConfig.router !== undefined)
          body.router = input.event.inputConfig.router;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          body.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.stackType !== undefined)
          body.stackType = input.event.inputConfig.stackType;
        if (input.event.inputConfig.state !== undefined)
          body.state = input.event.inputConfig.state;
        if (input.event.inputConfig.subnetLength !== undefined)
          body.subnetLength = input.event.inputConfig.subnetLength;
        if (input.event.inputConfig.type !== undefined)
          body.type = input.event.inputConfig.type;
        if (input.event.inputConfig.vlanTag8021q !== undefined)
          body.vlanTag8021q = input.event.inputConfig.vlanTag8021q;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/interconnectAttachments/{interconnect_attachment}",
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
                                enum: [
                                  "UNDEFINED_ROLLOUT_STATUS",
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
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
                  enum: [
                    "UNDEFINED_CODE",
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

export default interconnectAttachmentsPatch;
