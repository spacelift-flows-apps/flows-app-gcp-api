import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listUsable: AppBlock = {
  name: "Subnetworks - List Usable",
  description: `Retrieves an aggregated list of all usable subnetworks in the project.`,
  category: "Subnetworks",
  inputs: {
    default: {
      config: {
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
        service_project: {
          name: "Service Project",
          description:
            "The project id or project number in which the subnetwork is intended to be used. Only applied for Shared VPC. See [Shared VPC documentation](https://cloud.google.com/vpc/docs/shared-vpc/)",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

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
        if (input.event.inputConfig.service_project !== undefined)
          queryParams["serviceProject"] = String(
            input.event.inputConfig.service_project,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/aggregated/subnetworks/listUsable",
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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                external_ipv6_prefix: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The external IPv6 address range that is assigned to this subnetwork.",
                },
                internal_ipv6_prefix: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The internal IPv6 address range that is assigned to this subnetwork.",
                },
                ip_cidr_range: {
                  type: "string",
                  description:
                    "The range of internal addresses that are owned by this subnetwork.",
                },
                ipv6_access_type: {
                  type: "string",
                  description:
                    "The access type of IPv6 address this subnet holds. It's immutable and can only be specified during creation or the first time the subnet is updated into IPV4_IPV6 dual stack. Check the Ipv6AccessType enum for the list of possible values.",
                },
                network: {
                  type: "string",
                  description: "Network URL.",
                },
                purpose: {
                  type: "string",
                  description:
                    "Check the Purpose enum for the list of possible values.",
                },
                role: {
                  type: "string",
                  description:
                    "The role of subnetwork. Currently, this field is only used when purpose is set to GLOBAL_MANAGED_PROXY orREGIONAL_MANAGED_PROXY. The value can be set toACTIVE or BACKUP. An ACTIVE subnetwork is one that is currently being used for Envoy-based load balancers in a region. A BACKUP subnetwork is one that is ready to be promoted to ACTIVE or is currently draining. This field can be updated with a patch request. Check the Role enum for the list of possible values.",
                },
                secondary_ip_ranges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ip_cidr_range: {
                        type: "string",
                        description:
                          "The range of IP addresses belonging to this subnetwork secondary range.",
                      },
                      range_name: {
                        type: "string",
                        description:
                          "The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance. The name must be 1-63 characters long, and comply withRFC1035. The name must be unique within the subnetwork.",
                      },
                    },
                    description: "Secondary IP range of a usable subnetwork.",
                    additionalProperties: true,
                  },
                  description: "Secondary IP ranges.",
                },
                stack_type: {
                  type: "string",
                  description:
                    "The stack type for the subnet. If set to IPV4_ONLY, new VMs in the subnet are assigned IPv4 addresses only. If set toIPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and IPv6 addresses. If not specified, IPV4_ONLY is used.  This field can be both set at resource creation time and updated usingpatch. Check the StackType enum for the list of possible values.",
                },
                subnetwork: {
                  type: "string",
                  description: "Subnetwork URL.",
                },
              },
              description:
                "Subnetwork which the current user has compute.subnetworks.use permission on.",
              additionalProperties: true,
            },
            description: "[Output] A list of usable subnetwork URLs.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#usableSubnetworksAggregatedList for aggregated lists of usable subnetworks.",
          },
          next_page_token: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results. In special cases listUsable may return 0 subnetworks andnextPageToken which still should be used to get the next page of results.",
          },
          scoped_warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                scope_name: {
                  type: "string",
                  description:
                    "Name of the scope containing this set of Subnetworks.",
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
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] Informational warning messages for failures encountered from scopes.",
          },
          self_link: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          unreachables: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Output only. [Output Only] Unreachable resources.",
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
        additionalProperties: true,
      },
    },
  },
};

export default listUsable;
