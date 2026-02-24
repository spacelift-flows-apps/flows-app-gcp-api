import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const interconnectAttachmentsGet: AppBlock = {
  name: "Interconnect Attachments - Get",
  description: `Returns the specified interconnect attachment.`,
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
        interconnectAttachment: {
          name: "Interconnect Attachment",
          description: "Name of the interconnect attachment to return.",
          type: {
            type: "string",
          },
          required: true,
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
        let path = `projects/{project}/regions/{region}/interconnectAttachments/{interconnectAttachment}`;

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
          stackType: {
            type: "string",
            enum: ["IPV4_IPV6", "IPV4_ONLY"],
            description:
              "The stack type for this interconnect attachment to identify whether the\nIPv6 feature is enabled or not. If not specified, IPV4_ONLY\nwill be used.\n\nThis field can be both set at interconnect attachments creation and\nupdate interconnect attachment operations.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#interconnectAttachment for interconnect attachments.",
          },
          mtu: {
            type: "integer",
            description:
              "Maximum Transmission Unit (MTU), in bytes, of packets passing through this\ninterconnect attachment.\nValid values are 1440, 1460, 1500, and 8896. If not specified,\nthe value will default to 1440. (Format: int32)",
          },
          state: {
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
          customerRouterIpAddress: {
            type: "string",
            description:
              "[Output Only] IPv4 address + prefix length to be configured on the customer\nrouter subinterface for this interconnect attachment.",
          },
          vlanTag8021q: {
            type: "integer",
            description:
              "The IEEE 802.1Q VLAN tag for this attachment, in the range 2-4093.\nOnly specified at creation time. (Format: int32)",
          },
          edgeAvailabilityDomain: {
            type: "string",
            enum: [
              "AVAILABILITY_DOMAIN_1",
              "AVAILABILITY_DOMAIN_2",
              "AVAILABILITY_DOMAIN_ANY",
            ],
            description:
              "Input only. Desired availability domain for the attachment. Only available for type\nPARTNER, at creation time, and can take one of the following values:\n   \n   - AVAILABILITY_DOMAIN_ANY\n   - AVAILABILITY_DOMAIN_1\n   - AVAILABILITY_DOMAIN_2\n\n\nFor improved reliability, customers should configure a pair of attachments,\none per availability domain. The selected availability domain will be\nprovided to the Partner via the pairing key, so that the provisioned\ncircuit will lie in the specified domain. If not specified, the value will\ndefault to AVAILABILITY_DOMAIN_ANY.",
          },
          ipsecInternalAddresses: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of URLs of addresses that have been reserved for the VLAN\nattachment. Used only for the VLAN attachment that has the encryption\noption as IPSEC. The addresses must be regional internal IP address ranges.\nWhen creating an HA VPN gateway over the VLAN attachment, if the attachment\nis configured to use a regional internal IP address, then the VPN gateway's\nIP address is allocated from the IP address range specified here. For\nexample, if the HA VPN gateway's interface 0 is paired to this VLAN\nattachment, then a regional internal IP address for the VPN gateway\ninterface 0 will be allocated from the IP address specified for this\nVLAN attachment.\nIf this field is not specified when creating the VLAN attachment, then\nlater on when creating an HA VPN gateway on this VLAN attachment, the HA\nVPN gateway's IP address is allocated from the regional external IP address\npool.",
          },
          pairingKey: {
            type: "string",
            description:
              '[Output only for type PARTNER. Input only for PARTNER_PROVIDER. Not\npresent for DEDICATED].\nThe opaque identifier of a PARTNER attachment used to initiate\nprovisioning with a selected partner.\nOf the form "XXXXX/region/domain"',
          },
          cloudRouterIpAddress: {
            type: "string",
            description:
              "[Output Only] IPv4 address + prefix length to be configured on Cloud Router\nInterface for this interconnect attachment.",
          },
          dataplaneVersion: {
            type: "integer",
            description:
              "[Output Only] Dataplane version for this InterconnectAttachment. This\nfield is only present for Dataplane version 2 and higher. Absence of this\nfield in the API output indicates that the Dataplane is version 1. (Format: int32)",
          },
          l2Forwarding: {
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
          customerRouterIpv6InterfaceId: {
            type: "string",
            description: "This field is not available.",
          },
          configurationConstraints: {
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
          remoteService: {
            type: "string",
            description:
              '[Output Only]\nIf the attachment is on a Cross-Cloud Interconnect connection, this field\ncontains the interconnect\'s remote location service provider. Example\nvalues: "Amazon Web Services" "Microsoft Azure".\n\nThe field is set only for attachments on Cross-Cloud Interconnect\nconnections. Its value is copied from the InterconnectRemoteLocation\nremoteService field.',
          },
          adminEnabled: {
            type: "boolean",
            description:
              "Determines whether this Attachment will carry packets.\nNot present for PARTNER_PROVIDER.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional interconnect attachment\nresides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          privateInterconnectInfo: {
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
          googleReferenceId: {
            type: "string",
            description:
              "[Output Only] Google reference ID, to be used when raising support tickets\nwith Google or otherwise to debug backend connectivity issues.\n[Deprecated] This field is not used.",
          },
          description: {
            type: "string",
            description: "An optional description of this resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this InterconnectAttachment,\nwhich is essentially a hash of the labels set used for optimistic locking.\nThe fingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an InterconnectAttachment. (Format: byte)",
          },
          customerRouterIpv6Address: {
            type: "string",
            description:
              "[Output Only] IPv6 address + prefix length to be configured on the\ncustomer router subinterface for this interconnect attachment.",
          },
          attachmentGroup: {
            type: "string",
            description:
              "[Output Only] URL of the AttachmentGroup that includes this Attachment.",
          },
          interconnect: {
            type: "string",
            description:
              "URL of the underlying Interconnect object that this attachment's traffic\nwill traverse through.",
          },
          bandwidth: {
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
          subnetLength: {
            type: "integer",
            description:
              "Input only. Length of the IPv4 subnet mask.\nAllowed values:\n   \n   \n    - 29 (default)\n    - 30\n\nThe default value is 29, except for Cross-Cloud Interconnect\nconnections that use an InterconnectRemoteLocation with a\nconstraints.subnetLengthRange.min equal to 30. For example,\nconnections that use an Azure remote location fall into this\ncategory. In these cases, the default value is 30, and requesting\n29 returns an error.\n\nWhere both 29 and 30 are allowed, 29 is preferred, because it gives\nGoogle Cloud Support more debugging visibility. (Format: int32)",
          },
          partnerMetadata: {
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
          satisfiesPzs: {
            type: "boolean",
            description: "[Output Only] Reserved for future use.",
          },
          operationalStatus: {
            type: "string",
            enum: ["OS_ACTIVE", "OS_UNPROVISIONED"],
            description:
              "[Output Only] The current status of whether or not this interconnect\nattachment is functional, which can take one of the following values:\n   \n   - OS_ACTIVE: The attachment has been turned up and is ready to\n   use. \n   - OS_UNPROVISIONED: The attachment is not ready to use yet,\n   because turnup is not complete.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          cloudRouterIpv6Address: {
            type: "string",
            description:
              "[Output Only] IPv6 address + prefix length to be configured on Cloud\nRouter Interface for this interconnect attachment.",
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
            description: "Additional interconnect attachment parameters.",
            additionalProperties: true,
          },
          type: {
            type: "string",
            enum: ["DEDICATED", "L2_DEDICATED", "PARTNER", "PARTNER_PROVIDER"],
            description:
              "The type of interconnect attachment this is, which can take one of the\nfollowing values:\n   \n   - DEDICATED: an attachment to a Dedicated Interconnect.\n   - PARTNER: an attachment to a Partner Interconnect, created by the\n   customer.\n   - PARTNER_PROVIDER: an attachment to a Partner Interconnect, created by\n   the partner.\n\n- L2_DEDICATED: a L2 attachment to a Dedicated Interconnect.",
          },
          candidateSubnets: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Input only. Up to 16 candidate prefixes that can be used to restrict the allocation\nof cloudRouterIpAddress and customerRouterIpAddress for this attachment.\nAll prefixes must be within link-local address space (169.254.0.0/16) and\nmust be /29 or shorter (/28, /27, etc). Google will attempt to select an\nunused /29 from the supplied candidate prefix(es). The request will fail if\nall possible /29s are in use on Google's edge. If not supplied, Google will\nrandomly select an unused /29 from all of link-local space.",
          },
          encryption: {
            type: "string",
            enum: ["IPSEC", "NONE"],
            description:
              "Indicates the user-supplied encryption option of this VLAN attachment\n(interconnectAttachment). Can only be specified at attachment creation\nfor PARTNER or DEDICATED attachments.\nPossible values are:\n   \n   - NONE - This is the default value, which means that the\n   VLAN attachment carries unencrypted traffic. VMs are able to send\n   traffic to, or receive traffic from, such a VLAN attachment.\n   - IPSEC - The VLAN attachment carries only encrypted\n   traffic that is encrypted by an IPsec device, such as an HA VPN gateway or\n   third-party IPsec VPN. VMs cannot directly send traffic to, or receive\n   traffic from, such a VLAN attachment. To use *HA VPN over Cloud\n   Interconnect*, the VLAN attachment must be created with this\n   option.",
          },
          candidateIpv6Subnets: {
            type: "array",
            items: {
              type: "string",
            },
            description: "This field is not available.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          router: {
            type: "string",
            description:
              "URL of the Cloud Router to be used for dynamic routing. This router must be\nin the same region as this InterconnectAttachment. The\nInterconnectAttachment will automatically connect the Interconnect to the\nnetwork & region within which the Cloud Router is configured.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
          },
          partnerAsn: {
            type: "string",
            description:
              "Optional BGP ASN for the router supplied by a Layer 3 Partner if they\nconfigured BGP on behalf of the customer.\nOutput only for PARTNER type, input only for PARTNER_PROVIDER, not\navailable for DEDICATED. (Format: int64)",
          },
          cloudRouterIpv6InterfaceId: {
            type: "string",
            description: "This field is not available.",
          },
        },
        description:
          "Represents an Interconnect Attachment (VLAN) resource.\n\nYou can use Interconnect attachments (VLANS) to connect your Virtual Private\nCloud networks to your on-premises networks through an Interconnect.\nFor more information, read\nCreating VLAN Attachments.",
        additionalProperties: true,
      },
    },
  },
};

export default interconnectAttachmentsGet;
