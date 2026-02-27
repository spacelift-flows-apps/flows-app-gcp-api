import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const networksPatch: AppBlock = {
  name: "Networks - Patch",
  description: `Patches the specified network with the data included in the request.`,
  category: "Networks",
  inputs: {
    default: {
      config: {
        network: {
          name: "Network",
          description: "Name of the network to update.",
          type: {
            type: "string",
          },
          required: true,
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
        internalIpv6Range: {
          name: "Internal Ipv6 Range",
          description:
            "When enabling ula internal ipv6, caller optionally can specify the /48 range they want from the google defined ULA prefix fd20::/20.",
          type: {
            type: "string",
            description:
              "When enabling ula internal ipv6, caller optionally can specify the /48\nrange they want from the google defined ULA prefix fd20::/20. The input\nmust be a valid /48 ULA IPv6 address and must be within the fd20::/20.\nOperation will fail if the speficied /48 is already in used by another\nresource. If the field is not speficied, then a /48 range will be randomly\nallocated from fd20::/20 and returned via this field.\n.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#network for\nnetworks.",
          },
          required: false,
        },
        selfLinkWithId: {
          name: "Self Link With ID",
          description:
            "[Output Only] Server-defined URL for this resource with the resource id.",
          type: {
            type: "string",
            description:
              "[Output Only] Server-defined URL for this resource with the resource id.",
          },
          required: false,
        },
        autoCreateSubnetworks: {
          name: "Auto Create Subnetworks",
          description: "Must be set to create a VPC network.",
          type: {
            type: "boolean",
            description:
              "Must be set to create a VPC network. If not set, a legacy network is\ncreated.\n\nWhen set to true, the VPC network is created in auto mode.\nWhen set to false, the VPC network is created in custom mode.\n\nAn auto mode VPC network starts with one subnet per region. Each subnet\nhas a predetermined range as described inAuto mode VPC network IP ranges.\n\nFor custom mode VPC networks, you can add subnets using the subnetworksinsert\nmethod.",
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
            description: "Additional network parameters.",
            additionalProperties: true,
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
        selfLink: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        mtu: {
          name: "Mtu",
          description: "Maximum Transmission Unit in bytes.",
          type: {
            type: "integer",
            description:
              "Maximum Transmission Unit in bytes.\nThe minimum value for this field is 1300 and the maximum value is 8896.\nThe suggested value is 1500, which is the default MTU used on the\nInternet, or 8896 if you want to use Jumbo frames. If unspecified, the\nvalue defaults to 1460. (Format: int32)",
          },
          required: false,
        },
        subnetworks: {
          name: "Subnetworks",
          description:
            "[Output Only] Server-defined fully-qualified URLs for all subnetworks in this VPC network.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] Server-defined fully-qualified URLs for all subnetworks\nin this VPC network.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you\ncreate the resource.",
          },
          required: false,
        },
        networkFirewallPolicyEnforcementOrder: {
          name: "Network Firewall Policy Enforcement Order",
          description: "The network firewall policy enforcement order.",
          type: {
            type: "string",
            enum: ["AFTER_CLASSIC_FIREWALL", "BEFORE_CLASSIC_FIREWALL"],
            description:
              "The network firewall policy enforcement order. Can be either\nAFTER_CLASSIC_FIREWALL or BEFORE_CLASSIC_FIREWALL. Defaults to\nAFTER_CLASSIC_FIREWALL if the field is not specified.",
          },
          required: false,
        },
        gatewayIPv4: {
          name: "Gateway I Pv4",
          description:
            "[Output Only] The gateway address for default routing out of the network, selected by Google Cloud.",
          type: {
            type: "string",
            description:
              "[Output Only] The gateway address for default routing out of the network,\nselected by Google Cloud.",
          },
          required: false,
        },
        peerings: {
          name: "Peerings",
          description:
            "[Output Only] A list of network peerings for the resource.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                updateStrategy: {
                  type: "string",
                  enum: ["CONSENSUS", "INDEPENDENT", "UNSPECIFIED"],
                  description:
                    "The update strategy determines the semantics for updates and deletes to the\npeering connection configuration.",
                },
                state: {
                  type: "string",
                  enum: ["ACTIVE", "INACTIVE"],
                  description:
                    "[Output Only] State for the peering, either `ACTIVE` or `INACTIVE`. The\npeering is `ACTIVE` when there's a matching configuration in the peer\nnetwork.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of this peering. Provided by the client when the peering is created.\nThe name must comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all the following characters must be a dash,\nlowercase letter, or digit, except the last character, which cannot be a\ndash.",
                },
                network: {
                  type: "string",
                  description:
                    "The URL of the peer network. It can be either full URL or partial URL. The\npeer network may belong to a different project. If the partial URL does not\ncontain project, it is assumed that the peer network is in the same project\nas the current network.",
                },
                exportCustomRoutes: {
                  type: "boolean",
                  description:
                    "Whether to export the custom routes to peer network. The default value is\nfalse.",
                },
                autoCreateRoutes: {
                  type: "boolean",
                  description:
                    "This field will be deprecated soon. Use theexchange_subnet_routes field instead.\nIndicates whether full mesh connectivity is created and managed\nautomatically between peered networks. Currently this field should always\nbe true since Google Compute Engine will automatically create and manage\nsubnetwork routes between two networks when peering state isACTIVE.",
                },
                importSubnetRoutesWithPublicIp: {
                  type: "boolean",
                  description:
                    "Whether subnet routes with public IP range are imported. The default value\nis false.IPv4\nspecial-use ranges are always\nimported from peers and are not controlled by this field.",
                },
                importCustomRoutes: {
                  type: "boolean",
                  description:
                    "Whether to import the custom routes from peer network. The default value is\nfalse.",
                },
                connectionStatus: {
                  type: "object",
                  properties: {
                    consensusState: {
                      type: "object",
                      properties: {
                        updateStatus: {
                          type: "string",
                          enum: [
                            "IN_SYNC",
                            "PENDING_LOCAL_ACKNOWLEDMENT",
                            "PENDING_PEER_ACKNOWLEDGEMENT",
                            "UPDATE_STATUS_UNSPECIFIED",
                          ],
                          description: "The status of the update request.",
                        },
                        deleteStatus: {
                          type: "string",
                          enum: [
                            "DELETE_ACKNOWLEDGED",
                            "DELETE_STATUS_UNSPECIFIED",
                            "LOCAL_DELETE_REQUESTED",
                            "PEER_DELETE_REQUESTED",
                          ],
                          description: "The status of the delete request.",
                        },
                      },
                      description:
                        "The status of update/delete for a consensus peering connection. Only set\nwhen connection_status.update_strategy isCONSENSUS or a network peering is proposing to update the\nstrategy to CONSENSUS.",
                      additionalProperties: true,
                    },
                    updateStrategy: {
                      type: "string",
                      enum: ["CONSENSUS", "INDEPENDENT", "UNSPECIFIED"],
                      description:
                        "The update strategy determines the update/delete semantics for this\npeering connection.",
                    },
                    trafficConfiguration: {
                      type: "object",
                      properties: {
                        stackType: {
                          type: "string",
                          enum: ["IPV4_IPV6", "IPV4_ONLY"],
                          description:
                            "Which IP version(s) of traffic and routes are being imported or\nexported between peer networks.",
                        },
                        importSubnetRoutesWithPublicIpFromPeer: {
                          type: "boolean",
                          description:
                            "Whether subnet routes with public IP ranges are being imported\nfrom the peer network.",
                        },
                        exportCustomRoutesToPeer: {
                          type: "boolean",
                          description:
                            "Whether custom routes are being exported to the peer network.",
                        },
                        importCustomRoutesFromPeer: {
                          type: "boolean",
                          description:
                            "Whether custom routes are being imported from the peer network.",
                        },
                        exportSubnetRoutesWithPublicIpToPeer: {
                          type: "boolean",
                          description:
                            "Whether subnet routes with public IP ranges are being exported to the\npeer network.",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  description:
                    "[Output Only] Describes the state of a peering connection, not just the\nlocal peering. This field provides information about the effective settings\nfor the connection as a whole, including pending delete/update requests for\nCONSENSUS peerings.",
                  additionalProperties: true,
                },
                stackType: {
                  type: "string",
                  enum: ["IPV4_IPV6", "IPV4_ONLY"],
                  description:
                    "Which IP version(s) of traffic and routes are allowed to be imported or\nexported between peer networks. The default value is IPV4_ONLY.",
                },
                stateDetails: {
                  type: "string",
                  description:
                    "[Output Only] Details about the current state of the peering.",
                },
                exchangeSubnetRoutes: {
                  type: "boolean",
                  description:
                    "Indicates whether full mesh connectivity is created and managed\nautomatically between peered networks. Currently this field should always\nbe true since Google Compute Engine will automatically create and manage\nsubnetwork routes between two networks when peering state isACTIVE.",
                },
                exportSubnetRoutesWithPublicIp: {
                  type: "boolean",
                  description:
                    "Whether subnet routes with public IP range are exported. The default value\nis true, all subnet routes are exported.IPv4\nspecial-use ranges are always\nexported to peers and are not controlled by this field.",
                },
                peerMtu: {
                  type: "integer",
                  description:
                    "[Output Only] Maximum Transmission Unit in bytes of the peer network. (Format: int32)",
                },
              },
              description:
                "A network peering attached to a network resource. The message includes the\npeering name, peer network, peering state, and a flag indicating whether\nGoogle Compute Engine should automatically create routes for the peering.",
              additionalProperties: true,
            },
            description:
              "[Output Only] A list of network peerings for the resource.",
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
        firewallPolicy: {
          name: "Firewall Policy",
          description:
            "[Output Only] URL of the firewall policy the network is associated with.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the firewall policy the network is associated with.",
          },
          required: false,
        },
        routingConfig: {
          name: "Routing Config",
          description:
            "The network-level routing configuration for this network.",
          type: {
            type: "object",
            properties: {
              bgpBestPathSelectionMode: {
                type: "string",
                enum: ["LEGACY", "STANDARD"],
                description:
                  "The BGP best path selection algorithm to be employed within this network\nfor dynamic routes learned by Cloud Routers. Can be LEGACY\n(default) or STANDARD.",
              },
              bgpInterRegionCost: {
                type: "string",
                enum: ["ADD_COST_TO_MED", "DEFAULT"],
                description:
                  "Allows to define a preferred approach for handling inter-region cost in\nthe selection process when using the STANDARD BGP best path\nselection algorithm. Can be DEFAULT orADD_COST_TO_MED.",
              },
              effectiveBgpAlwaysCompareMed: {
                type: "boolean",
                description:
                  "[Output Only] Effective value of the bgp_always_compare_med\nfield.",
              },
              effectiveBgpInterRegionCost: {
                type: "string",
                enum: ["ADD_COST_TO_MED", "DEFAULT"],
                description:
                  "[Output Only] Effective value of the bgp_inter_region_cost\nfield.",
              },
              routingMode: {
                type: "string",
                enum: ["GLOBAL", "REGIONAL"],
                description:
                  "The network-wide routing mode to use. If set to REGIONAL,\nthis network's Cloud Routers will only advertise routes with subnets\nof this network in the same region as the router. If set toGLOBAL, this network's Cloud Routers will advertise\nroutes with all subnets of this network, across regions.",
              },
              bgpAlwaysCompareMed: {
                type: "boolean",
                description:
                  "Enable comparison of Multi-Exit Discriminators (MED) across routes with\ndifferent neighbor ASNs when using the STANDARD BGP best path selection\nalgorithm.",
              },
            },
            description:
              "A routing configuration attached to a network resource. The message\nincludes the list of routers associated with the network, and a flag\nindicating the type of routing behavior to enforce network-wide.",
            additionalProperties: true,
          },
          required: false,
        },
        networkProfile: {
          name: "Network Profile",
          description:
            "A full or partial URL of the network profile to apply to this network.",
          type: {
            type: "string",
            description:
              "A full or partial URL of the network profile to apply to this network.\nThis field can be set only at resource creation time. For example, the\nfollowing are valid URLs: \n   \n   - https://www.googleapis.com/compute/{api_version}/projects/{project_id}/global/networkProfiles/{network_profile_name}\n   - projects/{project_id}/global/networkProfiles/{network_profile_name}",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a\nlowercase letter, and all following characters (except for the last\ncharacter) must be a dash, lowercase letter, or digit. The last character\nmust be a lowercase letter or digit.",
          },
          required: false,
        },
        enableUlaInternalIpv6: {
          name: "Enable Ula Internal Ipv6",
          description: "Enable ULA internal ipv6 on this network.",
          type: {
            type: "boolean",
            description:
              "Enable ULA internal ipv6 on this network. Enabling this feature will assign\na /48 from google defined ULA prefix fd20::/20.\n.",
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
        let path = `projects/{project}/global/networks/{network}`;

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

        if (input.event.inputConfig.internalIpv6Range !== undefined)
          requestBody.internalIpv6Range =
            input.event.inputConfig.internalIpv6Range;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.selfLinkWithId !== undefined)
          requestBody.selfLinkWithId = input.event.inputConfig.selfLinkWithId;
        if (input.event.inputConfig.autoCreateSubnetworks !== undefined)
          requestBody.autoCreateSubnetworks =
            input.event.inputConfig.autoCreateSubnetworks;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.mtu !== undefined)
          requestBody.mtu = input.event.inputConfig.mtu;
        if (input.event.inputConfig.subnetworks !== undefined)
          requestBody.subnetworks = input.event.inputConfig.subnetworks;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (
          input.event.inputConfig.networkFirewallPolicyEnforcementOrder !==
          undefined
        )
          requestBody.networkFirewallPolicyEnforcementOrder =
            input.event.inputConfig.networkFirewallPolicyEnforcementOrder;
        if (input.event.inputConfig.gatewayIPv4 !== undefined)
          requestBody.gatewayIPv4 = input.event.inputConfig.gatewayIPv4;
        if (input.event.inputConfig.peerings !== undefined)
          requestBody.peerings = input.event.inputConfig.peerings;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.firewallPolicy !== undefined)
          requestBody.firewallPolicy = input.event.inputConfig.firewallPolicy;
        if (input.event.inputConfig.routingConfig !== undefined)
          requestBody.routingConfig = input.event.inputConfig.routingConfig;
        if (input.event.inputConfig.networkProfile !== undefined)
          requestBody.networkProfile = input.event.inputConfig.networkProfile;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.enableUlaInternalIpv6 !== undefined)
          requestBody.enableUlaInternalIpv6 =
            input.event.inputConfig.enableUlaInternalIpv6;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
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

export default networksPatch;
