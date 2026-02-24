import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const subnetworksInsert: AppBlock = {
  name: "Subnetworks - Insert",
  description: `Creates a subnetwork in the specified project using the data included in the request.`,
  category: "Subnetworks",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "URL of the region where the Subnetwork resides.",
          type: {
            type: "string",
            description:
              "URL of the region where the Subnetwork resides. This\nfield can be set only at resource creation time.",
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
        fingerprint: {
          name: "Fingerprint",
          description: "Fingerprint of this resource.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a Subnetwork. An up-to-date fingerprint must be\nprovided in order to update the Subnetwork, otherwise the\nrequest will fail with error 412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a Subnetwork. (Format: byte)",
          },
          required: false,
        },
        gatewayAddress: {
          name: "Gateway Address",
          description:
            "[Output Only] The gateway address for default routes to reach destination addresses outside this subnetwork.",
          type: {
            type: "string",
            description:
              "[Output Only] The gateway address for default routes to reach destination\naddresses outside this subnetwork.",
          },
          required: false,
        },
        secondaryIpRanges: {
          name: "Secondary IP Ranges",
          description:
            "An array of configurations for secondary IP ranges for VM instances contained in this subnetwork.",
          type: {
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
          required: false,
        },
        reservedInternalRange: {
          name: "Reserved Internal Range",
          description: "The URL of the reserved internal range.",
          type: {
            type: "string",
            description: "The URL of the reserved internal range.",
          },
          required: false,
        },
        ipv6GceEndpoint: {
          name: "Ipv6 Gce Endpoint",
          description: "[Output Only] Possible endpoints of this subnetwork.",
          type: {
            type: "string",
            enum: ["VM_AND_FR", "VM_ONLY"],
            description:
              "[Output Only] Possible endpoints of this subnetwork. It can be one of the\nfollowing:\n   \n   - VM_ONLY: The subnetwork can be used for creating instances and\n   IPv6 addresses with VM endpoint type. Such a subnetwork gets external IPv6\n   ranges from a public delegated prefix and cannot be used to create NetLb.\n   - VM_AND_FR: The subnetwork can be used for creating both VM\n   instances and Forwarding Rules. It can also be used to reserve IPv6\n   addresses with both VM and FR endpoint types. Such a subnetwork gets its\n   IPv6 range from Google IP Pool directly.",
          },
          required: false,
        },
        purpose: {
          name: "Purpose",
          description: "Request body field: purpose",
          type: {
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
        state: {
          name: "State",
          description:
            "[Output Only] The state of the subnetwork, which can be one of the following values:READY: Subnetwork is created and ready to useDRAINING: only applicable to subnetworks that have the purpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that connections to the load balancer are being drained.",
          type: {
            type: "string",
            enum: ["DRAINING", "READY"],
            description:
              "[Output Only] The state of the subnetwork, which can be one of the\nfollowing values:READY: Subnetwork is created and ready to useDRAINING: only applicable to subnetworks that have the\npurpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that\nconnections to the load balancer are being drained. A subnetwork that is\ndraining cannot be used or modified until it reaches a status ofREADY",
          },
          required: false,
        },
        internalIpv6Prefix: {
          name: "Internal Ipv6 Prefix",
          description:
            "The internal IPv6 address range that is owned by this subnetwork.",
          type: {
            type: "string",
            description:
              "The internal IPv6 address range that is owned by this\nsubnetwork.",
          },
          required: false,
        },
        privateIpGoogleAccess: {
          name: "Private IP Google Access",
          description:
            "Whether the VMs in this subnet can access Google services without assigned external IP addresses.",
          type: {
            type: "boolean",
            description:
              "Whether the VMs in this subnet can access Google services without assigned\nexternal IP addresses. This field can be both set at resource creation\ntime and updated using setPrivateIpGoogleAccess.",
          },
          required: false,
        },
        ipv6CidrRange: {
          name: "Ipv6 Cidr Range",
          description: "[Output Only] This field is for internal use.",
          type: {
            type: "string",
            description: "[Output Only] This field is for internal use.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "The URL of the network to which this subnetwork belongs, provided by the client when initially creating the subnetwork.",
          type: {
            type: "string",
            description:
              "The URL of the network to which this subnetwork belongs, provided by the\nclient when initially creating the subnetwork. This field can be set only\nat resource creation time.",
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
        externalIpv6Prefix: {
          name: "External Ipv6 Prefix",
          description:
            "The external IPv6 address range that is owned by this subnetwork.",
          type: {
            type: "string",
            description:
              "The external IPv6 address range that is owned by this\nsubnetwork.",
          },
          required: false,
        },
        stackType: {
          name: "Stack Type",
          description: "The stack type for the subnet.",
          type: {
            type: "string",
            enum: ["IPV4_IPV6", "IPV4_ONLY", "IPV6_ONLY"],
            description:
              "The stack type for the subnet. If set to IPV4_ONLY, new VMs\nin the subnet are assigned IPv4 addresses only. If set toIPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and\nIPv6 addresses. If not specified, IPV4_ONLY is used.\n\nThis field can be both set at resource creation time and updated usingpatch.",
          },
          required: false,
        },
        privateIpv6GoogleAccess: {
          name: "Private Ipv6 Google Access",
          description: "This field is for internal use.",
          type: {
            type: "string",
            enum: [
              "DISABLE_GOOGLE_ACCESS",
              "ENABLE_BIDIRECTIONAL_ACCESS_TO_GOOGLE",
              "ENABLE_OUTBOUND_VM_ACCESS_TO_GOOGLE",
            ],
            description:
              "This field is for internal use.\n\nThis field can be both set at resource creation time and updated usingpatch.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource. This field can be set only at resource creation time.",
          },
          required: false,
        },
        ipCidrRange: {
          name: "IP Cidr Range",
          description:
            "The range of internal addresses that are owned by this subnetwork.",
          type: {
            type: "string",
            description:
              "The range of internal addresses that are owned by this subnetwork.\nProvide this property when you create the subnetwork. For example,10.0.0.0/8 or 100.64.0.0/10. Ranges must\nbe unique and non-overlapping within a network. Only IPv4 is supported.\nThis field is set at resource creation time. The range can be any range\nlisted in theValid\nranges list. The range can be expanded after creation usingexpandIpCidrRange.",
          },
          required: false,
        },
        logConfig: {
          name: "Log Config",
          description:
            "This field denotes the VPC flow logging options for this subnetwork.",
          type: {
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
          required: false,
        },
        ipv6AccessType: {
          name: "Ipv6 Access Type",
          description: "The access type of IPv6 address this subnet holds.",
          type: {
            type: "string",
            enum: ["EXTERNAL", "INTERNAL"],
            description:
              "The access type of IPv6 address this subnet holds. It's immutable and can\nonly be specified during creation or the first time the subnet is updated\ninto IPV4_IPV6 dual stack.",
          },
          required: false,
        },
        role: {
          name: "Role",
          description: "The role of subnetwork.",
          type: {
            type: "string",
            enum: ["ACTIVE", "BACKUP"],
            description:
              "The role of subnetwork. Currently, this field is only used when\npurpose is set to GLOBAL_MANAGED_PROXY orREGIONAL_MANAGED_PROXY. The value can be set toACTIVE or BACKUP. An ACTIVE\nsubnetwork is one that is currently being used for Envoy-based load\nbalancers in a region. A BACKUP subnetwork is one that is\nready to be promoted to ACTIVE or is currently draining.\nThis field can be updated with a patch request.",
          },
          required: false,
        },
        enableFlowLogs: {
          name: "Enable Flow Logs",
          description: "Whether to enable flow logging for this subnetwork.",
          type: {
            type: "boolean",
            description:
              "Whether to enable flow logging for this subnetwork. If this field is not\nexplicitly set, it will not appear in get listings. If not set\nthe default behavior is determined by the org policy, if there is no org\npolicy specified, then it will default to disabled. This field isn't\nsupported if the subnet purpose field is set toREGIONAL_MANAGED_PROXY.",
          },
          required: false,
        },
        ipCollection: {
          name: "IP Collection",
          description:
            "Reference to the source of IP, like a PublicDelegatedPrefix (PDP) for BYOIP.",
          type: {
            type: "string",
            description:
              "Reference to the source of IP, like a PublicDelegatedPrefix\n(PDP) for BYOIP. The PDP must be a sub-PDP in\nEXTERNAL_IPV6_SUBNETWORK_CREATION or INTERNAL_IPV6_SUBNETWORK_CREATION\nmode.\n\nUse one of the following formats to specify a sub-PDP when creating a dual\nstack or IPv6-only subnetwork with external access using BYOIP:\n   \n   - \n   Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name\n   - \n   Partial URL, as in\n     \n      \n          - projects/projectId/regions/region/publicDelegatedPrefixes/sub-pdp-name\n          - regions/region/publicDelegatedPrefixes/sub-pdp-name",
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
        name: {
          name: "Name",
          description:
            "The name of the resource, provided by the client when initially creating the resource.",
          type: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating\nthe resource. The name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#subnetwork\nfor Subnetwork resources.",
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
                  'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional subnetwork parameters.",
            additionalProperties: true,
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
        let path = `projects/{project}/regions/{region}/subnetworks`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.fingerprint !== undefined)
          requestBody.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.gatewayAddress !== undefined)
          requestBody.gatewayAddress = input.event.inputConfig.gatewayAddress;
        if (input.event.inputConfig.secondaryIpRanges !== undefined)
          requestBody.secondaryIpRanges =
            input.event.inputConfig.secondaryIpRanges;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.reservedInternalRange !== undefined)
          requestBody.reservedInternalRange =
            input.event.inputConfig.reservedInternalRange;
        if (input.event.inputConfig.ipv6GceEndpoint !== undefined)
          requestBody.ipv6GceEndpoint = input.event.inputConfig.ipv6GceEndpoint;
        if (input.event.inputConfig.purpose !== undefined)
          requestBody.purpose = input.event.inputConfig.purpose;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.state !== undefined)
          requestBody.state = input.event.inputConfig.state;
        if (input.event.inputConfig.internalIpv6Prefix !== undefined)
          requestBody.internalIpv6Prefix =
            input.event.inputConfig.internalIpv6Prefix;
        if (input.event.inputConfig.privateIpGoogleAccess !== undefined)
          requestBody.privateIpGoogleAccess =
            input.event.inputConfig.privateIpGoogleAccess;
        if (input.event.inputConfig.ipv6CidrRange !== undefined)
          requestBody.ipv6CidrRange = input.event.inputConfig.ipv6CidrRange;
        if (input.event.inputConfig.network !== undefined)
          requestBody.network = input.event.inputConfig.network;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.externalIpv6Prefix !== undefined)
          requestBody.externalIpv6Prefix =
            input.event.inputConfig.externalIpv6Prefix;
        if (input.event.inputConfig.stackType !== undefined)
          requestBody.stackType = input.event.inputConfig.stackType;
        if (input.event.inputConfig.privateIpv6GoogleAccess !== undefined)
          requestBody.privateIpv6GoogleAccess =
            input.event.inputConfig.privateIpv6GoogleAccess;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.ipCidrRange !== undefined)
          requestBody.ipCidrRange = input.event.inputConfig.ipCidrRange;
        if (input.event.inputConfig.logConfig !== undefined)
          requestBody.logConfig = input.event.inputConfig.logConfig;
        if (input.event.inputConfig.ipv6AccessType !== undefined)
          requestBody.ipv6AccessType = input.event.inputConfig.ipv6AccessType;
        if (input.event.inputConfig.role !== undefined)
          requestBody.role = input.event.inputConfig.role;
        if (input.event.inputConfig.enableFlowLogs !== undefined)
          requestBody.enableFlowLogs = input.event.inputConfig.enableFlowLogs;
        if (input.event.inputConfig.ipCollection !== undefined)
          requestBody.ipCollection = input.event.inputConfig.ipCollection;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;

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

export default subnetworksInsert;
