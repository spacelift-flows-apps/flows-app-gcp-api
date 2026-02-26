import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Vpn Tunnels - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Vpn Tunnels",
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
            "/compute/v1/projects/{project}/regions/{region}/vpnTunnels",
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
                cipher_suite: {
                  type: "object",
                  properties: {
                    phase1: {
                      type: "object",
                      properties: {
                        dh: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        encryption: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        integrity: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        prf: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                      additionalProperties: true,
                    },
                    phase2: {
                      type: "object",
                      properties: {
                        encryption: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        integrity: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        pfs: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                  description:
                    "User specified list of ciphers to use for the phase 1 and phase 2 of the IKE protocol.",
                },
                creation_timestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                detailed_status: {
                  type: "string",
                  description:
                    "[Output Only] Detailed status message for the VPN tunnel.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                ike_version: {
                  type: "integer",
                  description:
                    "IKE protocol version to use when establishing the VPN tunnel with the peer VPN gateway. Acceptable IKE versions are 1 or 2. The default version is 2.",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of resource. Always compute#vpnTunnel for VPN tunnels.",
                },
                label_fingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this VpnTunnel, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a VpnTunnel.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
                },
                local_traffic_selector: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Local traffic selector to use when establishing the VPN tunnel with the peer VPN gateway. The value should be a CIDR formatted string, for example: 192.168.0.0/16. The ranges must be disjoint. Only IPv4 is supported for Classic VPN tunnels. This field is output only for HA VPN tunnels.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                peer_external_gateway: {
                  type: "string",
                  description:
                    "URL of the peer side external VPN gateway to which this VPN tunnel is connected. Provided by the client when the VPN tunnel is created. This field is exclusive with the field peerGcpGateway.",
                },
                peer_external_gateway_interface: {
                  type: "integer",
                  description:
                    "The interface ID of the external VPN gateway to which this VPN tunnel is connected. Provided by the client when the VPN tunnel is created. Possible values are: `0`, `1`, `2`, `3`. The number of IDs in use depends on the external VPN gateway redundancy type.",
                },
                peer_gcp_gateway: {
                  type: "string",
                  description:
                    "URL of the peer side HA VPN gateway to which this VPN tunnel is connected. Provided by the client when the VPN tunnel is created. This field can be used when creating highly available VPN from VPC network to VPC network, the field is exclusive with the field peerExternalGateway. If provided, the VPN tunnel will automatically use the same vpnGatewayInterface ID in the peer Google Cloud VPN gateway.",
                },
                peer_ip: {
                  type: "string",
                  description:
                    "IP address of the peer VPN gateway. Only IPv4 is supported. This field can be set only for Classic VPN tunnels.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the VPN tunnel resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
                },
                remote_traffic_selector: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Remote traffic selectors to use when establishing the VPN tunnel with the peer VPN gateway. The value should be a CIDR formatted string, for example: 192.168.0.0/16. The ranges should be disjoint. Only IPv4 is supported for Classic VPN tunnels. This field is output only for HA VPN tunnels.",
                },
                router: {
                  type: "string",
                  description:
                    "URL of the router resource to be used for dynamic routing.",
                },
                self_link: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                shared_secret: {
                  type: "string",
                  description:
                    "Shared secret used to set the secure session between the Cloud VPN gateway and the peer VPN gateway.",
                },
                shared_secret_hash: {
                  type: "string",
                  description: "Hash of the shared secret.",
                },
                status: {
                  type: "string",
                  description:
                    "[Output Only] The status of the VPN tunnel, which can be one of the following:     - PROVISIONING: Resource is being allocated for the VPN tunnel.    - WAITING_FOR_FULL_CONFIG: Waiting to receive all VPN-related configs    from      the user. Network, TargetVpnGateway, VpnTunnel, ForwardingRule, and Route      resources are needed to setup the VPN tunnel.    - FIRST_HANDSHAKE: Successful first handshake with the peer VPN.    - ESTABLISHED: Secure session is successfully established with the peer    VPN.    - NETWORK_ERROR: Deprecated, replaced by    NO_INCOMING_PACKETS    - AUTHORIZATION_ERROR: Auth error (for example,    bad shared secret).    - NEGOTIATION_FAILURE: Handshake failed.    - DEPROVISIONING: Resources are being deallocated for the VPN    tunnel.    - FAILED: Tunnel creation has failed and the tunnel is not    ready to be used.    - NO_INCOMING_PACKETS: No incoming packets from    peer.    - REJECTED: Tunnel configuration was rejected, can be result    of being denied access.    - ALLOCATING_RESOURCES: Cloud VPN is in the    process of allocating all required resources.    - STOPPED: Tunnel is stopped due to its Forwarding Rules being deleted    for Classic VPN tunnels or the project is in frozen state.    - PEER_IDENTITY_MISMATCH: Peer identity does not match peer IP,    probably behind NAT.    - TS_NARROWING_NOT_ALLOWED: Traffic selector    narrowing not allowed for an HA-VPN tunnel. Check the Status enum for the list of possible values.",
                },
                target_vpn_gateway: {
                  type: "string",
                  description:
                    "URL of the Target VPN gateway with which this VPN tunnel is associated. Provided by the client when the VPN tunnel is created. This field can be set only for Classic VPN tunnels.",
                },
                vpn_gateway: {
                  type: "string",
                  description:
                    "URL of the VPN gateway with which this VPN tunnel is associated. Provided by the client when the VPN tunnel is created. This must be used (instead of target_vpn_gateway) if a High Availability VPN gateway resource is created.",
                },
                vpn_gateway_interface: {
                  type: "integer",
                  description:
                    "The interface ID of the VPN gateway with which this VPN tunnel is associated. Possible values are: `0`, `1`.",
                },
              },
              description:
                "Represents a Cloud VPN Tunnel resource.  For more information about VPN, read the the Cloud VPN Overview.",
              additionalProperties: true,
            },
            description: "A list of VpnTunnel resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#vpnTunnel for VPN tunnels.",
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
        description: "Contains a list of VpnTunnel resources.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
