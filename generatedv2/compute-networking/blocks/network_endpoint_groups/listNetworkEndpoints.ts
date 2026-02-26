import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listNetworkEndpoints: AppBlock = {
  name: "Network Endpoint Groups - List Network Endpoints",
  description: `Lists the network endpoints in the specified network endpoint group.`,
  category: "Network Endpoint Groups",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of the zone where the network endpoint group is located. It should comply with RFC1035.",
          type: {
            type: "string",
          },
          required: true,
        },
        network_endpoint_group: {
          name: "Network Endpoint Group",
          description:
            "The name of the network endpoint group from which you want to generate a list of included network endpoints. It should comply with RFC1035.",
          type: {
            type: "string",
          },
          required: true,
        },
        health_status: {
          name: "Health Status",
          description:
            "Optional query parameter for showing the health status of each network endpoint. Valid options are SKIP or SHOW. If you don't specify this parameter, the health status of network endpoints will not be provided. Check the HealthStatus enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Optional query parameter for showing the health status of each network endpoint. Valid options are SKIP or SHOW. If you don't specify this parameter, the health status of network endpoints will not be provided. Check the HealthStatus enum for the list of possible values.",
          },
          required: false,
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
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.network_endpoint_group !== undefined)
          pathParams["network_endpoint_group"] = String(
            input.event.inputConfig.network_endpoint_group,
          );

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
        const body: Record<string, any> = {};
        if (input.event.inputConfig.health_status !== undefined)
          body.health_status = input.event.inputConfig.health_status;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/networkEndpointGroups/{network_endpoint_group}/listNetworkEndpoints",
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
                healths: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      backend_service: {
                        type: "object",
                        properties: {
                          backend_service: {
                            type: "string",
                          },
                        },
                        additionalProperties: true,
                        description:
                          "URL of the backend service associated with the health state of the network endpoint.",
                      },
                      forwarding_rule: {
                        type: "object",
                        properties: {
                          forwarding_rule: {
                            type: "string",
                          },
                        },
                        additionalProperties: true,
                        description:
                          "URL of the forwarding rule associated with the health state of the network endpoint.",
                      },
                      health_check: {
                        type: "object",
                        properties: {
                          health_check: {
                            type: "string",
                          },
                        },
                        description:
                          "A full or valid partial URL to a health check. For example, the following are valid URLs:     - https://www.googleapis.com/compute/beta/projects/project-id/global/httpHealthChecks/health-check    - projects/project-id/global/httpHealthChecks/health-check    - global/httpHealthChecks/health-check",
                        additionalProperties: true,
                      },
                      health_check_service: {
                        type: "object",
                        properties: {
                          health_check_service: {
                            type: "string",
                          },
                        },
                        description:
                          "A full or valid partial URL to a health check service. For example, the following are valid URLs:     - https://www.googleapis.com/compute/beta/projects/project-id/regions/us-west1/healthCheckServices/health-check-service    - projects/project-id/regions/us-west1/healthCheckServices/health-check-service    - regions/us-west1/healthCheckServices/health-check-service",
                        additionalProperties: true,
                      },
                      health_state: {
                        type: "string",
                        description:
                          "Health state of the network endpoint determined based on the health checks configured. Check the HealthState enum for the list of possible values.",
                      },
                      ipv6_health_state: {
                        type: "string",
                        description:
                          "Health state of the ipv6 network endpoint determined based on the health checks configured. Check the Ipv6HealthState enum for the list of possible values.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output only] The health status of network endpoint.  Optional. Displayed only if the network endpoint has centralized health checking configured.",
                },
                network_endpoint: {
                  type: "object",
                  properties: {
                    annotations: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Optional metadata defined as annotations on the network endpoint.",
                    },
                    client_destination_port: {
                      type: "integer",
                      description:
                        "Represents the port number to which PSC consumer sends packets.  Optional. Only valid for network endpoint groups created withGCE_VM_IP_PORTMAP endpoint type.",
                    },
                    fqdn: {
                      type: "string",
                      description:
                        "Optional fully qualified domain name of network endpoint. This can only be specified when NetworkEndpointGroup.network_endpoint_type isNON_GCP_FQDN_PORT.",
                    },
                    instance: {
                      type: "string",
                      description:
                        "The name or a URL of VM instance of this network endpoint. Optional, the field presence depends on the network endpoint type. The field is required for network endpoints of type GCE_VM_IP andGCE_VM_IP_PORT.  The instance must be in the same zone of network endpoint group (for zonal NEGs) or in the zone within the region of the NEG (for regional NEGs). If the ipAddress is specified, it must belongs to the VM instance.  The name must be 1-63 characters long, and comply withRFC1035 or be a valid URL pointing to an existing instance.",
                    },
                    ip_address: {
                      type: "string",
                      description:
                        "Optional IPv4 address of network endpoint. The IP address must belong to a VM in Compute Engine (either the primary IP or as part of an aliased IP range). If the IP address is not specified, then the primary IP address for the VM instance in the network that the network endpoint group belongs to will be used.  This field is redundant and need not be set for network endpoints of typeGCE_VM_IP. If set, it must be set to the primary internal IP address of the attached VM instance that matches the subnetwork of the NEG. The primary internal IP address from any NIC of a multi-NIC VM instance can be added to a NEG as long as it matches the NEG subnetwork.",
                    },
                    ipv6_address: {
                      type: "string",
                      description: "Optional IPv6 address of network endpoint.",
                    },
                    port: {
                      type: "integer",
                      description:
                        "Optional port number of network endpoint. If not specified, the defaultPort for the network endpoint group will be used.  This field can not be set for network endpoints of typeGCE_VM_IP.",
                    },
                  },
                  description: "The network endpoint.",
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
            },
            description: "A list of NetworkEndpointWithHealthStatus resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] The resource type, which is alwayscompute#networkEndpointGroupsListNetworkEndpoints for the list of network endpoints in the specified network endpoint group.",
          },
          next_page_token: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
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

export default listNetworkEndpoints;
