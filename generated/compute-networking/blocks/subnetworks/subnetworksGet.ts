import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const subnetworksGet: AppBlock = {
  name: "Subnetworks - Get",
  description: `Returns the specified subnetwork.`,
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
            "Defines the extra views returned back in the subnetwork resource.\nSupported values:\n   \n   - WITH_UTILIZATION: Utilization data is included in the\n   response.",
          type: {
            type: "string",
            enum: ["DEFAULT", "WITH_UTILIZATION"],
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
        let path = `projects/{project}/regions/{region}/subnetworks/{subnetwork}`;

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
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a Subnetwork. An up-to-date fingerprint must be\nprovided in order to update the Subnetwork, otherwise the\nrequest will fail with error 412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a Subnetwork. (Format: byte)",
          },
          gatewayAddress: {
            type: "string",
            description:
              "[Output Only] The gateway address for default routes to reach destination\naddresses outside this subnetwork.",
          },
          secondaryIpRanges: {
            type: "array",
            items: {
              type: "object",
              properties: {
                rangeName: {
                  type: "string",
                  description:
                    "The name associated with this subnetwork secondary range, used when adding\nan alias IP range to a VM instance.\nThe name must be 1-63 characters long, and comply withRFC1035.\nThe name must be unique within the subnetwork.",
                },
                reservedInternalRange: {
                  type: "string",
                  description: "The URL of the reserved internal range.",
                },
                ipCidrRange: {
                  type: "string",
                  description:
                    "The range of IP addresses belonging to this subnetwork secondary range.\nProvide this property when you create the subnetwork. Ranges must be\nunique and non-overlapping with all primary and secondary IP ranges\nwithin a network. Only IPv4 is supported. The range can be any range\nlisted in theValid\nranges list.",
                },
              },
              description: "Represents a secondary IP range of a subnetwork.",
              additionalProperties: true,
            },
            description:
              "An array of configurations for secondary IP ranges for VM instances\ncontained in this subnetwork. The primary IP of such VM must belong to the\nprimary ipCidrRange of the subnetwork. The alias IPs may belong to either\nprimary or secondary ranges. This field can be updated with apatch request.",
          },
          region: {
            type: "string",
            description:
              "URL of the region where the Subnetwork resides. This\nfield can be set only at resource creation time.",
          },
          reservedInternalRange: {
            type: "string",
            description: "The URL of the reserved internal range.",
          },
          ipv6GceEndpoint: {
            type: "string",
            enum: ["VM_AND_FR", "VM_ONLY"],
            description:
              "[Output Only] Possible endpoints of this subnetwork. It can be one of the\nfollowing:\n   \n   - VM_ONLY: The subnetwork can be used for creating instances and\n   IPv6 addresses with VM endpoint type. Such a subnetwork gets external IPv6\n   ranges from a public delegated prefix and cannot be used to create NetLb.\n   - VM_AND_FR: The subnetwork can be used for creating both VM\n   instances and Forwarding Rules. It can also be used to reserve IPv6\n   addresses with both VM and FR endpoint types. Such a subnetwork gets its\n   IPv6 range from Google IP Pool directly.",
          },
          systemReservedInternalIpv6Ranges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] The array of internal IPv6 network ranges reserved from\nthe subnetwork's internal IPv6 range for system use.",
          },
          purpose: {
            type: "string",
            enum: [
              "GLOBAL_MANAGED_PROXY",
              "INTERNAL_HTTPS_LOAD_BALANCER",
              "PEER_MIGRATION",
              "PRIVATE",
              "PRIVATE_NAT",
              "PRIVATE_RFC_1918",
              "PRIVATE_SERVICE_CONNECT",
              "REGIONAL_MANAGED_PROXY",
            ],
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          state: {
            type: "string",
            enum: ["DRAINING", "READY"],
            description:
              "[Output Only] The state of the subnetwork, which can be one of the\nfollowing values:READY: Subnetwork is created and ready to useDRAINING: only applicable to subnetworks that have the\npurpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that\nconnections to the load balancer are being drained. A subnetwork that is\ndraining cannot be used or modified until it reaches a status ofREADY",
          },
          internalIpv6Prefix: {
            type: "string",
            description:
              "The internal IPv6 address range that is owned by this\nsubnetwork.",
          },
          privateIpGoogleAccess: {
            type: "boolean",
            description:
              "Whether the VMs in this subnet can access Google services without assigned\nexternal IP addresses. This field can be both set at resource creation\ntime and updated using setPrivateIpGoogleAccess.",
          },
          ipv6CidrRange: {
            type: "string",
            description: "[Output Only] This field is for internal use.",
          },
          network: {
            type: "string",
            description:
              "The URL of the network to which this subnetwork belongs, provided by the\nclient when initially creating the subnetwork. This field can be set only\nat resource creation time.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          utilizationDetails: {
            type: "object",
            properties: {
              externalIpv6LbUtilization: {
                type: "object",
                properties: {
                  totalFreeIp: {
                    type: "object",
                    properties: {
                      low: {
                        type: "string",
                        description: "Format: uint64",
                      },
                      high: {
                        type: "string",
                        description: "Format: uint64",
                      },
                    },
                    additionalProperties: true,
                  },
                  totalAllocatedIp: {
                    type: "object",
                    properties: {
                      low: {
                        type: "string",
                        description: "Format: uint64",
                      },
                      high: {
                        type: "string",
                        description: "Format: uint64",
                      },
                    },
                    additionalProperties: true,
                  },
                },
                description: "The IPV6 utilization of a single IP range.",
                additionalProperties: true,
              },
              externalIpv6InstanceUtilization: {
                type: "object",
                properties: {
                  totalFreeIp: {
                    type: "object",
                    properties: {
                      low: {
                        type: "string",
                        description: "Format: uint64",
                      },
                      high: {
                        type: "string",
                        description: "Format: uint64",
                      },
                    },
                    additionalProperties: true,
                  },
                  totalAllocatedIp: {
                    type: "object",
                    properties: {
                      low: {
                        type: "string",
                        description: "Format: uint64",
                      },
                      high: {
                        type: "string",
                        description: "Format: uint64",
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
                  totalFreeIp: {
                    type: "object",
                    properties: {
                      low: {
                        type: "string",
                        description: "Format: uint64",
                      },
                      high: {
                        type: "string",
                        description: "Format: uint64",
                      },
                    },
                    additionalProperties: true,
                  },
                  totalAllocatedIp: {
                    type: "object",
                    properties: {
                      low: {
                        type: "string",
                        description: "Format: uint64",
                      },
                      high: {
                        type: "string",
                        description: "Format: uint64",
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
                    totalAllocatedIp: {
                      type: "string",
                      description: "Format: int64",
                    },
                    rangeName: {
                      type: "string",
                      description:
                        "Will be set for secondary range. Empty for primary IPv4 range.",
                    },
                    totalFreeIp: {
                      type: "string",
                      description: "Format: int64",
                    },
                  },
                  description: "The IPV4 utilization of a single IP range.",
                  additionalProperties: true,
                },
                description:
                  "Utilizations of all IPV4 IP ranges. For primary ranges, the range name\nwill be empty.",
              },
            },
            description:
              "The current IP utilization of all subnetwork ranges. Contains the total\nnumber of allocated and free IPs in each range.",
            additionalProperties: true,
          },
          externalIpv6Prefix: {
            type: "string",
            description:
              "The external IPv6 address range that is owned by this\nsubnetwork.",
          },
          stackType: {
            type: "string",
            enum: ["IPV4_IPV6", "IPV4_ONLY", "IPV6_ONLY"],
            description:
              "The stack type for the subnet. If set to IPV4_ONLY, new VMs\nin the subnet are assigned IPv4 addresses only. If set toIPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and\nIPv6 addresses. If not specified, IPV4_ONLY is used.\n\nThis field can be both set at resource creation time and updated usingpatch.",
          },
          systemReservedExternalIpv6Ranges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] The array of external IPv6 network ranges reserved from\nthe subnetwork's external IPv6 range for system use.",
          },
          privateIpv6GoogleAccess: {
            type: "string",
            enum: [
              "DISABLE_GOOGLE_ACCESS",
              "ENABLE_BIDIRECTIONAL_ACCESS_TO_GOOGLE",
              "ENABLE_OUTBOUND_VM_ACCESS_TO_GOOGLE",
            ],
            description:
              "This field is for internal use.\n\nThis field can be both set at resource creation time and updated usingpatch.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource. This field can be set only at resource creation time.",
          },
          ipCidrRange: {
            type: "string",
            description:
              "The range of internal addresses that are owned by this subnetwork.\nProvide this property when you create the subnetwork. For example,10.0.0.0/8 or 100.64.0.0/10. Ranges must\nbe unique and non-overlapping within a network. Only IPv4 is supported.\nThis field is set at resource creation time. The range can be any range\nlisted in theValid\nranges list. The range can be expanded after creation usingexpandIpCidrRange.",
          },
          logConfig: {
            type: "object",
            properties: {
              flowSampling: {
                type: "number",
                description:
                  "Can only be specified if VPC flow logging for this subnetwork is enabled.\nThe value of the field must be in [0, 1]. Set the sampling rate of VPC\nflow logs within the subnetwork where 1.0 means all collected logs are\nreported and 0.0 means no logs are reported. Default is 0.5 unless\notherwise specified by the org policy, which means half of all collected\nlogs are reported. (Format: float)",
              },
              metadataFields: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'Can only be specified if VPC flow logs for this subnetwork is enabled and\n"metadata" was set to CUSTOM_METADATA.',
              },
              metadata: {
                type: "string",
                enum: [
                  "CUSTOM_METADATA",
                  "EXCLUDE_ALL_METADATA",
                  "INCLUDE_ALL_METADATA",
                ],
                description:
                  "Can only be specified if VPC flow logs for this subnetwork is enabled.\nConfigures whether all, none or a subset of metadata fields should be\nadded to the reported VPC flow logs. Default isEXCLUDE_ALL_METADATA.",
              },
              aggregationInterval: {
                type: "string",
                enum: [
                  "INTERVAL_10_MIN",
                  "INTERVAL_15_MIN",
                  "INTERVAL_1_MIN",
                  "INTERVAL_30_SEC",
                  "INTERVAL_5_MIN",
                  "INTERVAL_5_SEC",
                ],
                description:
                  "Can only be specified if VPC flow logging for this subnetwork is enabled.\nToggles the aggregation interval for collecting flow logs. Increasing the\ninterval time will reduce the amount of generated flow logs for long\nlasting connections. Default is an interval of 5 seconds per connection.",
              },
              enable: {
                type: "boolean",
                description:
                  "Whether to enable flow logging for this subnetwork. If this field is not\nexplicitly set, it will not appear in get listings. If not\nset the default behavior is determined by the org policy, if there is no\norg policy specified, then it will default to disabled.\nFlow logging isn't supported if the subnet purpose field is\nset to REGIONAL_MANAGED_PROXY.",
              },
              filterExpr: {
                type: "string",
                description:
                  "Can only be specified if VPC flow logs for this subnetwork is enabled.\nThe filter expression is used to define which VPC flow logs should be\nexported to Cloud Logging.",
              },
            },
            description: "The available logging options for this subnetwork.",
            additionalProperties: true,
          },
          ipv6AccessType: {
            type: "string",
            enum: ["EXTERNAL", "INTERNAL"],
            description:
              "The access type of IPv6 address this subnet holds. It's immutable and can\nonly be specified during creation or the first time the subnet is updated\ninto IPV4_IPV6 dual stack.",
          },
          role: {
            type: "string",
            enum: ["ACTIVE", "BACKUP"],
            description:
              "The role of subnetwork. Currently, this field is only used when\npurpose is set to GLOBAL_MANAGED_PROXY orREGIONAL_MANAGED_PROXY. The value can be set toACTIVE or BACKUP. An ACTIVE\nsubnetwork is one that is currently being used for Envoy-based load\nbalancers in a region. A BACKUP subnetwork is one that is\nready to be promoted to ACTIVE or is currently draining.\nThis field can be updated with a patch request.",
          },
          enableFlowLogs: {
            type: "boolean",
            description:
              "Whether to enable flow logging for this subnetwork. If this field is not\nexplicitly set, it will not appear in get listings. If not set\nthe default behavior is determined by the org policy, if there is no org\npolicy specified, then it will default to disabled. This field isn't\nsupported if the subnet purpose field is set toREGIONAL_MANAGED_PROXY.",
          },
          ipCollection: {
            type: "string",
            description:
              "Reference to the source of IP, like a PublicDelegatedPrefix\n(PDP) for BYOIP. The PDP must be a sub-PDP in\nEXTERNAL_IPV6_SUBNETWORK_CREATION or INTERNAL_IPV6_SUBNETWORK_CREATION\nmode.\n\nUse one of the following formats to specify a sub-PDP when creating a dual\nstack or IPv6-only subnetwork with external access using BYOIP:\n   \n   - \n   Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name\n   - \n   Partial URL, as in\n     \n      \n          - projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name\n          - regions/region/publicDelegatedPrefixes/sub-pdp-name",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          name: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating\nthe resource. The name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#subnetwork\nfor Subnetwork resources.",
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
                  'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional subnetwork parameters.",
            additionalProperties: true,
          },
        },
        description:
          "Represents a Subnetwork resource.\n\nA subnetwork (also known as a subnet) is a logical partition of a Virtual\nPrivate Cloud network with one primary IP range and zero or more secondary\nIP ranges. For more information, read\nVirtual Private Cloud (VPC) Network.",
        additionalProperties: true,
      },
    },
  },
};

export default subnetworksGet;
