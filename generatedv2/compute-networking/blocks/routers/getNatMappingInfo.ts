import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getNatMappingInfo: AppBlock = {
  name: "Routers - Get Nat Mapping Info",
  description: `Retrieves runtime Nat mapping information of VM endpoints.`,
  category: "Routers",
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
        router: {
          name: "Router",
          description:
            "Name of the Router resource to query for Nat Mapping information of VM endpoints.",
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
        nat_name: {
          name: "Nat Name",
          description:
            "Name of the nat service to filter the Nat Mapping information. If it is omitted, all nats for this router will be returned. Name should conform to RFC1035.",
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
        if (input.event.inputConfig.router !== undefined)
          pathParams["router"] = String(input.event.inputConfig.router);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.max_results !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.max_results,
          );
        if (input.event.inputConfig.nat_name !== undefined)
          queryParams["natName"] = String(input.event.inputConfig.nat_name);
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
            "/compute/v1/projects/{project}/regions/{region}/routers/{router}/getNatMappingInfo",
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
              "[Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#vmEndpointNatMappingsList for lists of Nat mappings of VM endpoints.",
          },
          next_page_token: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                instance_name: {
                  type: "string",
                  description:
                    "Output only. Name of the VM instance which the endpoint belongs to",
                },
                interface_nat_mappings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      drain_nat_ip_port_ranges: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'Output only. List of all drain IP:port-range mappings assigned to this interface. These ranges are inclusive, that is, both the first and the last ports can be used for NAT. Example: ["2.2.2.2:12345-12355", "1.1.1.1:2234-2234"].',
                      },
                      nat_ip_port_ranges: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          'Output only. A list of all IP:port-range mappings assigned to this interface. These ranges are inclusive, that is, both the first and the last ports can be used for NAT. Example: ["2.2.2.2:12345-12355", "1.1.1.1:2234-2234"].',
                      },
                      num_total_drain_nat_ports: {
                        type: "integer",
                        description:
                          "Output only. Total number of drain ports across all NAT IPs allocated to this interface. It equals to the aggregated port number in the field drain_nat_ip_port_ranges.",
                      },
                      num_total_nat_ports: {
                        type: "integer",
                        description:
                          "Output only. Total number of ports across all NAT IPs allocated to this interface. It equals to the aggregated port number in the field nat_ip_port_ranges.",
                      },
                      rule_mappings: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            drain_nat_ip_port_ranges: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                'Output only. List of all drain IP:port-range mappings assigned to this interface by this rule. These ranges are inclusive, that is, both the first and the last ports can be used for NAT. Example: ["2.2.2.2:12345-12355", "1.1.1.1:2234-2234"].',
                            },
                            nat_ip_port_ranges: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                'Output only. A list of all IP:port-range mappings assigned to this interface by this rule. These ranges are inclusive, that is, both the first and the last ports can be used for NAT. Example: ["2.2.2.2:12345-12355", "1.1.1.1:2234-2234"].',
                            },
                            num_total_drain_nat_ports: {
                              type: "integer",
                              description:
                                "Output only. Total number of drain ports across all NAT IPs allocated to this interface by this rule. It equals the aggregated port number in the field drain_nat_ip_port_ranges.",
                            },
                            num_total_nat_ports: {
                              type: "integer",
                              description:
                                "Output only. Total number of ports across all NAT IPs allocated to this interface by this rule. It equals the aggregated port number in the field nat_ip_port_ranges.",
                            },
                            rule_number: {
                              type: "integer",
                              description:
                                "Output only. Rule number of the NAT Rule.",
                            },
                          },
                          description:
                            "Contains information of NAT Mappings provided by a NAT Rule.",
                          additionalProperties: true,
                        },
                        description:
                          "Output only. Information about mappings provided by rules in this NAT.",
                      },
                      source_alias_ip_range: {
                        type: "string",
                        description:
                          'Output only. Alias IP range for this interface endpoint. It will be a private (RFC 1918) IP range. Examples: "10.33.4.55/32", or "192.168.5.0/24".',
                      },
                      source_virtual_ip: {
                        type: "string",
                        description:
                          "Output only. Primary IP of the VM for this NIC.",
                      },
                    },
                    description:
                      "Contain information of Nat mapping for an interface of this endpoint.",
                    additionalProperties: true,
                  },
                },
              },
              description:
                "Contain information of Nat mapping for a VM endpoint (i.e., NIC).",
              additionalProperties: true,
            },
            description:
              "[Output Only] A list of Nat mapping information of VM endpoints.",
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
        description: "Contains a list of VmEndpointNatMappings.",
        additionalProperties: true,
      },
    },
  },
};

export default getNatMappingInfo;
