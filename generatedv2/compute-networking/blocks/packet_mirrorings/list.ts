import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Packet Mirrorings - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Packet Mirrorings",
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
            "/compute/v1/projects/{project}/regions/{region}/packetMirrorings",
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
                collector_ilb: {
                  type: "object",
                  properties: {
                    canonical_url: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Unique identifier for the forwarding rule; defined by the server.",
                    },
                    url: {
                      type: "string",
                      description:
                        "Resource URL to the forwarding rule representing the ILB configured as destination of the mirrored traffic.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "The Forwarding Rule resource of typeloadBalancingScheme=INTERNAL that will be used as collector for mirrored traffic. The specified forwarding rule must have isMirroringCollector set to true.",
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
                enable: {
                  type: "string",
                  description:
                    "Indicates whether or not this packet mirroring takes effect. If set to FALSE, this packet mirroring policy will not be enforced on the network.  The default is TRUE. Check the Enable enum for the list of possible values.",
                },
                filter: {
                  type: "object",
                  properties: {
                    I_p_protocols: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Protocols that apply as filter on mirrored traffic. If no protocols are specified, all traffic that matches the specified CIDR ranges is mirrored. If neither cidrRanges nor IPProtocols is specified, all IPv4 traffic is mirrored.",
                    },
                    cidr_ranges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'One or more IPv4 or IPv6 CIDR ranges that apply as filters on the source (ingress) or destination (egress) IP in the IP header. If no ranges are specified, all IPv4 traffic that matches the specified IPProtocols is mirrored. If neither cidrRanges nor IPProtocols is specified, all IPv4 traffic is mirrored. To mirror all IPv4 and IPv6 traffic, use "0.0.0.0/0,::/0".',
                    },
                    direction: {
                      type: "string",
                      description:
                        "Direction of traffic to mirror, either INGRESS, EGRESS, or BOTH. The default is BOTH. Check the Direction enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Filter for mirrored traffic. If unspecified, all IPv4 traffic is mirrored.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Alwayscompute#packetMirroring for packet mirrorings.",
                },
                mirrored_resources: {
                  type: "object",
                  properties: {
                    instances: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          canonical_url: {
                            type: "string",
                            description:
                              "Output only. [Output Only] Unique identifier for the instance; defined by the server.",
                          },
                          url: {
                            type: "string",
                            description:
                              "Resource URL to the virtual machine instance which is being mirrored.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A set of virtual machine instances that are being mirrored. They must live in zones contained in the same region as this packetMirroring.  Note that this config will apply only to those network interfaces of the Instances that belong to the network specified in this packetMirroring.  You may specify a maximum of 50 Instances.",
                    },
                    subnetworks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          canonical_url: {
                            type: "string",
                            description:
                              "Output only. [Output Only] Unique identifier for the subnetwork; defined by the server.",
                          },
                          url: {
                            type: "string",
                            description:
                              "Resource URL to the subnetwork for which traffic from/to all VM instances will be mirrored.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A set of subnetworks for which traffic from/to all VM instances will be mirrored. They must live in the same region as this packetMirroring.  You may specify a maximum of 5 subnetworks.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A set of mirrored tags. Traffic from/to all VM instances that have one or more of these tags will be mirrored.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "PacketMirroring mirroredResourceInfos. MirroredResourceInfo specifies a set of mirrored VM instances, subnetworks and/or tags for which traffic from/to all VM instances will be mirrored.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                network: {
                  type: "object",
                  properties: {
                    canonical_url: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Unique identifier for the network; defined by the server.",
                    },
                    url: {
                      type: "string",
                      description: "URL of the network resource.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Specifies the mirrored VPC network. Only packets in this network will be mirrored. All mirrored VMs should have a NIC in the given network. All mirrored subnetworks should belong to the given network.",
                },
                priority: {
                  type: "integer",
                  description:
                    "The priority of applying this configuration. Priority is used to break ties in cases where there is more than one matching rule. In the case of two rules that apply for a given Instance, the one with the lowest-numbered priority value wins.  Default value is 1000. Valid range is 0 through 65535.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URI of the region where the packetMirroring resides.",
                },
                self_link: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for the resource.",
                },
              },
              description:
                "Represents a Packet Mirroring resource.  Packet Mirroring clones the traffic of specified instances in your Virtual Private Cloud (VPC) network and forwards it to a collector destination, such as an instance group of an internal TCP/UDP load balancer, for analysis or examination. For more information about setting up Packet Mirroring, seeUsing Packet Mirroring.",
              additionalProperties: true,
            },
            description: "A list of PacketMirroring resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#packetMirroring for packetMirrorings.",
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
        description: "Contains a list of PacketMirroring resources.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
