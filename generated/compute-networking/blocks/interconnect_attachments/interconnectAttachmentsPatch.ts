import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const interconnectAttachmentsPatch: AppBlock = {
  name: "Interconnect Attachments - Patch",
  description: `Updates the specified interconnect attachment with the data included in the request.`,
  category: "Interconnect Attachments",
  inputs: {
    default: {
      config: {
        interconnectAttachment: {
          name: "Interconnect Attachment",
          description: "Name of the interconnect attachment to patch.",
          type: {
            type: "string",
          },
          required: true,
        },
        region: {
          name: "Region",
          description:
            "[Output Only] URL of the region where the regional interconnect attachment resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional interconnect attachment\nresides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          required: false,
        },
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        stackType: {
          name: "Stack Type",
          description:
            "The stack type for this interconnect attachment to identify whether the IPv6 feature is enabled or not.",
          type: {
            type: "string",
            enum: ["IPV4_IPV6", "IPV4_ONLY"],
            description:
              "The stack type for this interconnect attachment to identify whether the\nIPv6 feature is enabled or not. If not specified, IPV4_ONLY\nwill be used.\n\nThis field can be both set at interconnect attachments creation and\nupdate interconnect attachment operations.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#interconnectAttachment for interconnect attachments.",
          },
          required: false,
        },
        mtu: {
          name: "Mtu",
          description:
            "Maximum Transmission Unit (MTU), in bytes, of packets passing through this interconnect attachment.",
          type: {
            type: "integer",
            description:
              "Maximum Transmission Unit (MTU), in bytes, of packets passing through this\ninterconnect attachment.\nValid values are 1440, 1460, 1500, and 8896. If not specified,\nthe value will default to 1440. (Format: int32)",
          },
          required: false,
        },
        state: {
          name: "State",
          description:
            "[Output Only] The current state of this attachment's functionality.",
          type: {
            type: "string",
            enum: [
              "ACTIVE",
              "DEFUNCT",
              "PARTNER_REQUEST_RECEIVED",
              "PENDING_CUSTOMER",
              "PENDING_PARTNER",
              "STATE_UNSPECIFIED",
              "UNPROVISIONED",
            ],
            description:
              "[Output Only] The current state of this attachment's functionality.\nEnum values ACTIVE and UNPROVISIONED are shared by DEDICATED/PRIVATE,\nPARTNER, and PARTNER_PROVIDER interconnect attachments, while enum values\nPENDING_PARTNER, PARTNER_REQUEST_RECEIVED, and PENDING_CUSTOMER are used\nfor only PARTNER and PARTNER_PROVIDER interconnect attachments.\nThis state can take one of the following values:\n   \n   - ACTIVE: The attachment has been turned up and is ready to use.\n   - UNPROVISIONED: The attachment is not ready to use yet, because turnup\n   is not complete.\n   - PENDING_PARTNER: A newly-created PARTNER attachment that has not yet\n   been configured on the Partner side.\n   - PARTNER_REQUEST_RECEIVED: A PARTNER attachment is in the process of\n   provisioning after a PARTNER_PROVIDER attachment was created that\n   references it. \n   - PENDING_CUSTOMER: A PARTNER or PARTNER_PROVIDER\n   attachment that is waiting for a customer to activate it. \n   - DEFUNCT:\n   The attachment was deleted externally and is no longer functional. This\n   could be because the associated Interconnect was removed, or because the\n   other side of a Partner attachment was deleted.",
          },
          required: false,
        },
        customerRouterIpAddress: {
          name: "Customer Router IP Address",
          description:
            "[Output Only] IPv4 address + prefix length to be configured on the customer router subinterface for this interconnect attachment.",
          type: {
            type: "string",
            description:
              "[Output Only] IPv4 address + prefix length to be configured on the customer\nrouter subinterface for this interconnect attachment.",
          },
          required: false,
        },
        vlanTag8021q: {
          name: "Vlan Tag8021q",
          description: "The IEEE 802.",
          type: {
            type: "integer",
            description:
              "The IEEE 802.1Q VLAN tag for this attachment, in the range 2-4093.\nOnly specified at creation time. (Format: int32)",
          },
          required: false,
        },
        edgeAvailabilityDomain: {
          name: "Edge Availability Domain",
          description: "Input only.",
          type: {
            type: "string",
            enum: [
              "AVAILABILITY_DOMAIN_1",
              "AVAILABILITY_DOMAIN_2",
              "AVAILABILITY_DOMAIN_ANY",
            ],
            description:
              "Input only. Desired availability domain for the attachment. Only available for type\nPARTNER, at creation time, and can take one of the following values:\n   \n   - AVAILABILITY_DOMAIN_ANY\n   - AVAILABILITY_DOMAIN_1\n   - AVAILABILITY_DOMAIN_2\n\n\nFor improved reliability, customers should configure a pair of attachments,\none per availability domain. The selected availability domain will be\nprovided to the Partner via the pairing key, so that the provisioned\ncircuit will lie in the specified domain. If not specified, the value will\ndefault to AVAILABILITY_DOMAIN_ANY.",
          },
          required: false,
        },
        ipsecInternalAddresses: {
          name: "Ipsec Internal Addresses",
          description:
            "A list of URLs of addresses that have been reserved for the VLAN attachment.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of URLs of addresses that have been reserved for the VLAN\nattachment. Used only for the VLAN attachment that has the encryption\noption as IPSEC. The addresses must be regional internal IP address ranges.\nWhen creating an HA VPN gateway over the VLAN attachment, if the attachment\nis configured to use a regional internal IP address, then the VPN gateway's\nIP address is allocated from the IP address range specified here. For\nexample, if the HA VPN gateway's interface 0 is paired to this VLAN\nattachment, then a regional internal IP address for the VPN gateway\ninterface 0 will be allocated from the IP address specified for this\nVLAN attachment.\nIf this field is not specified when creating the VLAN attachment, then\nlater on when creating an HA VPN gateway on this VLAN attachment, the HA\nVPN gateway's IP address is allocated from the regional external IP address\npool.",
          },
          required: false,
        },
        pairingKey: {
          name: "Pairing Key",
          description: "[Output only for type PARTNER.",
          type: {
            type: "string",
            description:
              '[Output only for type PARTNER. Input only for PARTNER_PROVIDER. Not\npresent for DEDICATED].\nThe opaque identifier of a PARTNER attachment used to initiate\nprovisioning with a selected partner.\nOf the form "XXXXX/region/domain"',
          },
          required: false,
        },
        cloudRouterIpAddress: {
          name: "Cloud Router IP Address",
          description:
            "[Output Only] IPv4 address + prefix length to be configured on Cloud Router Interface for this interconnect attachment.",
          type: {
            type: "string",
            description:
              "[Output Only] IPv4 address + prefix length to be configured on Cloud Router\nInterface for this interconnect attachment.",
          },
          required: false,
        },
        dataplaneVersion: {
          name: "Dataplane Version",
          description:
            "[Output Only] Dataplane version for this InterconnectAttachment.",
          type: {
            type: "integer",
            description:
              "[Output Only] Dataplane version for this InterconnectAttachment. This\nfield is only present for Dataplane version 2 and higher. Absence of this\nfield in the API output indicates that the Dataplane is version 1. (Format: int32)",
          },
          required: false,
        },
        l2Forwarding: {
          name: "L2 Forwarding",
          description: "L2 Interconnect Attachment related config.",
          type: {
            type: "object",
            properties: {
              tunnelEndpointIpAddress: {
                type: "string",
                description:
                  "Required. A single IPv4 or IPv6 address. This address will be used as the\nsource IP address for packets sent to the appliances, and must be used as\nthe destination IP address for packets that should be sent out through\nthis attachment.",
              },
              defaultApplianceIpAddress: {
                type: "string",
                description:
                  "Optional. A single IPv4 or IPv6 address used as the default destination\nIP when there is no VLAN mapping result found.\n\nUnset field (null-value) indicates the unmatched packet should be\ndropped.",
              },
              geneveHeader: {
                type: "object",
                properties: {
                  vni: {
                    type: "integer",
                    description:
                      "Optional. VNI is a 24-bit unique virtual network identifier, from 0 to\n16,777,215. (Format: uint32)",
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
              applianceMappings: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  'Optional. A map of VLAN tags to appliances and optional inner mapping\nrules. If VLANs are not explicitly mapped to any appliance, the\ndefaultApplianceIpAddress is used.\n\nEach VLAN tag can be a single number or a range of numbers in the range\nof 1 to 4094, e.g., "1" or "4001-4094". Non-empty and non-overlapping\nVLAN tag ranges are enforced, and violating operations will be rejected.\n\nThe VLAN tags in the Ethernet header must use an ethertype value of\n0x88A8 or 0x8100.',
              },
            },
            description: "L2 Interconnect Attachment related configuration.",
            additionalProperties: true,
          },
          required: false,
        },
        customerRouterIpv6InterfaceId: {
          name: "Customer Router Ipv6 Interface ID",
          description: "This field is not available.",
          type: {
            type: "string",
            description: "This field is not available.",
          },
          required: false,
        },
        configurationConstraints: {
          name: "Configuration Constraints",
          description: "[Output Only] Constraints for this attachment, if any.",
          type: {
            type: "object",
            properties: {
              bgpMd5: {
                type: "string",
                enum: ["MD5_OPTIONAL", "MD5_REQUIRED", "MD5_UNSUPPORTED"],
                description:
                  "[Output Only] Whether the attachment's BGP session\nrequires/allows/disallows BGP MD5 authentication. This can take one of\nthe following values: MD5_OPTIONAL, MD5_REQUIRED, MD5_UNSUPPORTED.\n\nFor example, a Cross-Cloud Interconnect connection to a remote cloud\nprovider that requires BGP MD5 authentication has the\ninterconnectRemoteLocation attachment_configuration_constraints.bgp_md5\nfield set to MD5_REQUIRED, and that property is propagated to the\nattachment. Similarly, if BGP MD5 is MD5_UNSUPPORTED, an error is\nreturned if MD5 is requested.",
              },
              bgpPeerAsnRanges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    max: {
                      type: "integer",
                      description: "Format: uint32",
                    },
                    min: {
                      type: "integer",
                      description: "Format: uint32",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] List of ASN ranges that the remote location is known to\nsupport. Formatted as an array of inclusive ranges {min: min-value, max:\nmax-value}. For example, [{min: 123, max: 123}, {min: 64512, max: 65534}]\nallows the peer ASN to be 123 or anything in the range 64512-65534.\n\nThis field is only advisory. Although the API accepts other ranges, these\nare the ranges that we recommend.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        remoteService: {
          name: "Remote Service",
          description:
            "[Output Only] If the attachment is on a Cross-Cloud Interconnect connection, this field contains the interconnect's remote location service provider.",
          type: {
            type: "string",
            description:
              '[Output Only]\nIf the attachment is on a Cross-Cloud Interconnect connection, this field\ncontains the interconnect\'s remote location service provider. Example\nvalues: "Amazon Web Services" "Microsoft Azure".\n\nThe field is set only for attachments on Cross-Cloud Interconnect\nconnections. Its value is copied from the InterconnectRemoteLocation\nremoteService field.',
          },
          required: false,
        },
        adminEnabled: {
          name: "Admin Enabled",
          description: "Determines whether this Attachment will carry packets.",
          type: {
            type: "boolean",
            description:
              "Determines whether this Attachment will carry packets.\nNot present for PARTNER_PROVIDER.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          required: false,
        },
        privateInterconnectInfo: {
          name: "Private Interconnect Info",
          description:
            "[Output Only] Information specific to an InterconnectAttachment.",
          type: {
            type: "object",
            properties: {
              tag8021q: {
                type: "integer",
                description:
                  "[Output Only] 802.1q encapsulation tag to be used for traffic between\nGoogle and the customer, going to and from this network and region. (Format: uint32)",
              },
            },
            description:
              "Information for an interconnect attachment when this belongs to an\ninterconnect of type DEDICATED.",
            additionalProperties: true,
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
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this InterconnectAttachment, which is essentially a hash of the labels set used for optimistic locking.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this InterconnectAttachment,\nwhich is essentially a hash of the labels set used for optimistic locking.\nThe fingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an InterconnectAttachment. (Format: byte)",
          },
          required: false,
        },
        customerRouterIpv6Address: {
          name: "Customer Router Ipv6 Address",
          description:
            "[Output Only] IPv6 address + prefix length to be configured on the customer router subinterface for this interconnect attachment.",
          type: {
            type: "string",
            description:
              "[Output Only] IPv6 address + prefix length to be configured on the\ncustomer router subinterface for this interconnect attachment.",
          },
          required: false,
        },
        attachmentGroup: {
          name: "Attachment Group",
          description:
            "[Output Only] URL of the AttachmentGroup that includes this Attachment.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the AttachmentGroup that includes this Attachment.",
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
              "URL of the underlying Interconnect object that this attachment's traffic\nwill traverse through.",
          },
          required: false,
        },
        bandwidth: {
          name: "Bandwidth",
          description:
            "Provisioned bandwidth capacity for the interconnect attachment.",
          type: {
            type: "string",
            enum: [
              "BPS_100G",
              "BPS_100M",
              "BPS_10G",
              "BPS_1G",
              "BPS_200M",
              "BPS_20G",
              "BPS_2G",
              "BPS_300M",
              "BPS_400M",
              "BPS_500M",
              "BPS_50G",
              "BPS_50M",
              "BPS_5G",
            ],
            description:
              "Provisioned bandwidth capacity for the interconnect attachment. For\nattachments of type DEDICATED, the user can set the bandwidth.\nFor attachments of type PARTNER, the Google Partner that is operating\nthe interconnect must set the bandwidth.\nOutput only for PARTNER type, mutable for PARTNER_PROVIDER and DEDICATED,\nand can take one of the following values:\n   \n   - BPS_50M: 50 Mbit/s\n   - BPS_100M: 100 Mbit/s\n   - BPS_200M: 200 Mbit/s\n   - BPS_300M: 300 Mbit/s\n   - BPS_400M: 400 Mbit/s\n   - BPS_500M: 500 Mbit/s\n   - BPS_1G: 1 Gbit/s\n   - BPS_2G: 2 Gbit/s\n   - BPS_5G: 5 Gbit/s\n   - BPS_10G: 10 Gbit/s\n   - BPS_20G: 20 Gbit/s\n   - BPS_50G: 50 Gbit/s\n   - BPS_100G: 100 Gbit/s",
          },
          required: false,
        },
        subnetLength: {
          name: "Subnet Length",
          description: "Input only.",
          type: {
            type: "integer",
            description:
              "Input only. Length of the IPv4 subnet mask.\nAllowed values:\n   \n   \n    - 29 (default)\n    - 30\n\nThe default value is 29, except for Cross-Cloud Interconnect\nconnections that use an InterconnectRemoteLocation with a\nconstraints.subnetLengthRange.min equal to 30. For example,\nconnections that use an Azure remote location fall into this\ncategory. In these cases, the default value is 30, and requesting\n29 returns an error.\n\nWhere both 29 and 30 are allowed, 29 is preferred, because it gives\nGoogle Cloud Support more debugging visibility. (Format: int32)",
          },
          required: false,
        },
        partnerMetadata: {
          name: "Partner Metadata",
          description:
            "Informational metadata about Partner attachments from Partners to display to customers.",
          type: {
            type: "object",
            properties: {
              interconnectName: {
                type: "string",
                description:
                  'Plain text name of the Interconnect this attachment is connected to, as\ndisplayed in the Partner\'s portal. For instance "Chicago 1".\nThis value may be validated to match approved Partner values.',
              },
              partnerName: {
                type: "string",
                description:
                  "Plain text name of the Partner providing this attachment.\nThis value may be validated to match approved Partner values.",
              },
              portalUrl: {
                type: "string",
                description:
                  "URL of the Partner's portal for this Attachment. Partners may customise\nthis to be a deep link to the specific resource on the Partner portal.\nThis value may be validated to match approved Partner values.",
              },
            },
            description:
              "Informational metadata about Partner attachments from Partners to display\nto customers.  These fields are propagated from PARTNER_PROVIDER\nattachments to their corresponding PARTNER attachments.",
            additionalProperties: true,
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
        operationalStatus: {
          name: "Operational Status",
          description:
            "[Output Only] The current status of whether or not this interconnect attachment is functional, which can take one of the following values: - OS_ACTIVE: The attachment has been turned up and is ready to use.",
          type: {
            type: "string",
            enum: ["OS_ACTIVE", "OS_UNPROVISIONED"],
            description:
              "[Output Only] The current status of whether or not this interconnect\nattachment is functional, which can take one of the following values:\n   \n   - OS_ACTIVE: The attachment has been turned up and is ready to\n   use. \n   - OS_UNPROVISIONED: The attachment is not ready to use yet,\n   because turnup is not complete.",
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
        cloudRouterIpv6Address: {
          name: "Cloud Router Ipv6 Address",
          description:
            "[Output Only] IPv6 address + prefix length to be configured on Cloud Router Interface for this interconnect attachment.",
          type: {
            type: "string",
            description:
              "[Output Only] IPv6 address + prefix length to be configured on Cloud\nRouter Interface for this interconnect attachment.",
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
            description: "Additional interconnect attachment parameters.",
            additionalProperties: true,
          },
          required: false,
        },
        type: {
          name: "Type",
          description:
            "The type of interconnect attachment this is, which can take one of the following values: - DEDICATED: an attachment to a Dedicated Interconnect.",
          type: {
            type: "string",
            enum: ["DEDICATED", "L2_DEDICATED", "PARTNER", "PARTNER_PROVIDER"],
            description:
              "The type of interconnect attachment this is, which can take one of the\nfollowing values:\n   \n   - DEDICATED: an attachment to a Dedicated Interconnect.\n   - PARTNER: an attachment to a Partner Interconnect, created by the\n   customer.\n   - PARTNER_PROVIDER: an attachment to a Partner Interconnect, created by\n   the partner.\n\n- L2_DEDICATED: a L2 attachment to a Dedicated Interconnect.",
          },
          required: false,
        },
        candidateSubnets: {
          name: "Candidate Subnets",
          description: "Input only.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Input only. Up to 16 candidate prefixes that can be used to restrict the allocation\nof cloudRouterIpAddress and customerRouterIpAddress for this attachment.\nAll prefixes must be within link-local address space (169.254.0.0/16) and\nmust be /29 or shorter (/28, /27, etc). Google will attempt to select an\nunused /29 from the supplied candidate prefix(es). The request will fail if\nall possible /29s are in use on Google's edge. If not supplied, Google will\nrandomly select an unused /29 from all of link-local space.",
          },
          required: false,
        },
        encryption: {
          name: "Encryption",
          description:
            "Indicates the user-supplied encryption option of this VLAN attachment (interconnectAttachment).",
          type: {
            type: "string",
            enum: ["IPSEC", "NONE"],
            description:
              "Indicates the user-supplied encryption option of this VLAN attachment\n(interconnectAttachment). Can only be specified at attachment creation\nfor PARTNER or DEDICATED attachments.\nPossible values are:\n   \n   - NONE - This is the default value, which means that the\n   VLAN attachment carries unencrypted traffic. VMs are able to send\n   traffic to, or receive traffic from, such a VLAN attachment.\n   - IPSEC - The VLAN attachment carries only encrypted\n   traffic that is encrypted by an IPsec device, such as an HA VPN gateway or\n   third-party IPsec VPN. VMs cannot directly send traffic to, or receive\n   traffic from, such a VLAN attachment. To use *HA VPN over Cloud\n   Interconnect*, the VLAN attachment must be created with this\n   option.",
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
        router: {
          name: "Router",
          description:
            "URL of the Cloud Router to be used for dynamic routing.",
          type: {
            type: "string",
            description:
              "URL of the Cloud Router to be used for dynamic routing. This router must be\nin the same region as this InterconnectAttachment. The\nInterconnectAttachment will automatically connect the Interconnect to the\nnetwork & region within which the Cloud Router is configured.",
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
        partnerAsn: {
          name: "Partner Asn",
          description:
            "Optional BGP ASN for the router supplied by a Layer 3 Partner if they configured BGP on behalf of the customer.",
          type: {
            type: "string",
            description:
              "Optional BGP ASN for the router supplied by a Layer 3 Partner if they\nconfigured BGP on behalf of the customer.\nOutput only for PARTNER type, input only for PARTNER_PROVIDER, not\navailable for DEDICATED. (Format: int64)",
          },
          required: false,
        },
        cloudRouterIpv6InterfaceId: {
          name: "Cloud Router Ipv6 Interface ID",
          description: "This field is not available.",
          type: {
            type: "string",
            description: "This field is not available.",
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
        let path = `projects/{project}/regions/{region}/interconnectAttachments/{interconnectAttachment}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.stackType !== undefined)
          requestBody.stackType = input.event.inputConfig.stackType;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.mtu !== undefined)
          requestBody.mtu = input.event.inputConfig.mtu;
        if (input.event.inputConfig.state !== undefined)
          requestBody.state = input.event.inputConfig.state;
        if (input.event.inputConfig.customerRouterIpAddress !== undefined)
          requestBody.customerRouterIpAddress =
            input.event.inputConfig.customerRouterIpAddress;
        if (input.event.inputConfig.vlanTag8021q !== undefined)
          requestBody.vlanTag8021q = input.event.inputConfig.vlanTag8021q;
        if (input.event.inputConfig.edgeAvailabilityDomain !== undefined)
          requestBody.edgeAvailabilityDomain =
            input.event.inputConfig.edgeAvailabilityDomain;
        if (input.event.inputConfig.ipsecInternalAddresses !== undefined)
          requestBody.ipsecInternalAddresses =
            input.event.inputConfig.ipsecInternalAddresses;
        if (input.event.inputConfig.pairingKey !== undefined)
          requestBody.pairingKey = input.event.inputConfig.pairingKey;
        if (input.event.inputConfig.cloudRouterIpAddress !== undefined)
          requestBody.cloudRouterIpAddress =
            input.event.inputConfig.cloudRouterIpAddress;
        if (input.event.inputConfig.dataplaneVersion !== undefined)
          requestBody.dataplaneVersion =
            input.event.inputConfig.dataplaneVersion;
        if (input.event.inputConfig.l2Forwarding !== undefined)
          requestBody.l2Forwarding = input.event.inputConfig.l2Forwarding;
        if (input.event.inputConfig.customerRouterIpv6InterfaceId !== undefined)
          requestBody.customerRouterIpv6InterfaceId =
            input.event.inputConfig.customerRouterIpv6InterfaceId;
        if (input.event.inputConfig.configurationConstraints !== undefined)
          requestBody.configurationConstraints =
            input.event.inputConfig.configurationConstraints;
        if (input.event.inputConfig.remoteService !== undefined)
          requestBody.remoteService = input.event.inputConfig.remoteService;
        if (input.event.inputConfig.adminEnabled !== undefined)
          requestBody.adminEnabled = input.event.inputConfig.adminEnabled;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.privateInterconnectInfo !== undefined)
          requestBody.privateInterconnectInfo =
            input.event.inputConfig.privateInterconnectInfo;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          requestBody.labelFingerprint =
            input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.customerRouterIpv6Address !== undefined)
          requestBody.customerRouterIpv6Address =
            input.event.inputConfig.customerRouterIpv6Address;
        if (input.event.inputConfig.attachmentGroup !== undefined)
          requestBody.attachmentGroup = input.event.inputConfig.attachmentGroup;
        if (input.event.inputConfig.interconnect !== undefined)
          requestBody.interconnect = input.event.inputConfig.interconnect;
        if (input.event.inputConfig.bandwidth !== undefined)
          requestBody.bandwidth = input.event.inputConfig.bandwidth;
        if (input.event.inputConfig.subnetLength !== undefined)
          requestBody.subnetLength = input.event.inputConfig.subnetLength;
        if (input.event.inputConfig.partnerMetadata !== undefined)
          requestBody.partnerMetadata = input.event.inputConfig.partnerMetadata;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          requestBody.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.operationalStatus !== undefined)
          requestBody.operationalStatus =
            input.event.inputConfig.operationalStatus;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.cloudRouterIpv6Address !== undefined)
          requestBody.cloudRouterIpv6Address =
            input.event.inputConfig.cloudRouterIpv6Address;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.type !== undefined)
          requestBody.type = input.event.inputConfig.type;
        if (input.event.inputConfig.candidateSubnets !== undefined)
          requestBody.candidateSubnets =
            input.event.inputConfig.candidateSubnets;
        if (input.event.inputConfig.encryption !== undefined)
          requestBody.encryption = input.event.inputConfig.encryption;
        if (input.event.inputConfig.candidateIpv6Subnets !== undefined)
          requestBody.candidateIpv6Subnets =
            input.event.inputConfig.candidateIpv6Subnets;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.router !== undefined)
          requestBody.router = input.event.inputConfig.router;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.partnerAsn !== undefined)
          requestBody.partnerAsn = input.event.inputConfig.partnerAsn;
        if (input.event.inputConfig.cloudRouterIpv6InterfaceId !== undefined)
          requestBody.cloudRouterIpv6InterfaceId =
            input.event.inputConfig.cloudRouterIpv6InterfaceId;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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

export default interconnectAttachmentsPatch;
