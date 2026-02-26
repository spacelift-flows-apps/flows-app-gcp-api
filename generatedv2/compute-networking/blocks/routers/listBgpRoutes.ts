import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listBgpRoutes: AppBlock = {
  name: "Routers - List Bgp Routes",
  description: `Retrieves a list of router bgp routes available to the specified project.`,
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
            "Name or id of the resource for this request. Name should conform to RFC1035.",
          type: {
            type: "string",
          },
          required: true,
        },
        address_family: {
          name: "Address Family",
          description:
            "(Required) limit results to this address family (either IPv4 or IPv6) Check the AddressFamily enum for the list of possible values.",
          type: {
            type: "string",
          },
          required: false,
        },
        destination_prefix: {
          name: "Destination Prefix",
          description:
            "Limit results to destinations that are subnets of this CIDR range",
          type: {
            type: "string",
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
        peer: {
          name: "Peer",
          description:
            "(Required) limit results to the BGP peer with the given name. Name should conform to RFC1035.",
          type: {
            type: "string",
          },
          required: false,
        },
        policy_applied: {
          name: "Policy Applied",
          description:
            "When true, the method returns post-policy routes. Otherwise, it returns pre-policy routes.",
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
        route_type: {
          name: "Route Type",
          description:
            "(Required) limit results to this type of route (either LEARNED or ADVERTISED) Check the RouteType enum for the list of possible values.",
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
        if (input.event.inputConfig.address_family !== undefined)
          queryParams["addressFamily"] = String(
            input.event.inputConfig.address_family,
          );
        if (input.event.inputConfig.destination_prefix !== undefined)
          queryParams["destinationPrefix"] = String(
            input.event.inputConfig.destination_prefix,
          );
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
        if (input.event.inputConfig.peer !== undefined)
          queryParams["peer"] = String(input.event.inputConfig.peer);
        if (input.event.inputConfig.policy_applied !== undefined)
          queryParams["policyApplied"] = String(
            input.event.inputConfig.policy_applied,
          );
        if (input.event.inputConfig.return_partial_success !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.return_partial_success,
          );
        if (input.event.inputConfig.route_type !== undefined)
          queryParams["routeType"] = String(input.event.inputConfig.route_type);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/routers/{router}/listBgpRoutes",
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
          etag: {
            type: "string",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#routersListBgpRoutes for lists of bgp routes.",
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
                as_paths: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      asns: {
                        type: "array",
                        items: {
                          type: "integer",
                        },
                        description:
                          "Output only. [Output only] ASNs in the path segment. When type is SEQUENCE, these are ordered.",
                      },
                      asns32: {
                        type: "array",
                        items: {
                          type: "integer",
                        },
                        description:
                          "Output only. [Output only] ASNs in the path segment. This field is for better support of 32 bit ASNs as the other asns field suffers from overflow when the ASN is larger. When type is SEQUENCE, these are ordered.",
                      },
                      type: {
                        type: "string",
                        description:
                          "Output only. [Output only] Type of AS-PATH segment (SEQUENCE or SET) Check the Type enum for the list of possible values.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output only] AS-PATH for the route",
                },
                communities: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Output only. [Output only] BGP communities in human-readable A:B format.",
                },
                destination: {
                  type: "object",
                  properties: {
                    path_id: {
                      type: "integer",
                      description:
                        "If the BGP session supports multiple paths (RFC 7911), the path identifier for this route.",
                    },
                    prefix: {
                      type: "string",
                      description:
                        "Human readable CIDR notation for a prefix. E.g. 10.42.0.0/16.",
                    },
                  },
                  description:
                    "Network Layer Reachability Information (NLRI) for a route.",
                  additionalProperties: true,
                },
                med: {
                  type: "integer",
                  description:
                    "Output only. [Output only] BGP multi-exit discriminator",
                },
                origin: {
                  type: "string",
                  description:
                    "Output only. [Output only] BGP origin (EGP, IGP or INCOMPLETE) Check the Origin enum for the list of possible values.",
                },
              },
              additionalProperties: true,
            },
            description: "[Output Only] A list of bgp routes.",
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

export default listBgpRoutes;
