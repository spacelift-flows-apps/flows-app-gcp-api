import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listInstances: AppBlock = {
  name: "Instance Groups - List Instances",
  description: `Lists the instances in the specified instance group and displays information about the named ports. Depending on the specified options, this method can list all instances or only the instances that are running. The orderBy query parameter is not supported.`,
  category: "Instance Groups",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of the zone where the instance group is located.",
          type: {
            type: "string",
          },
          required: true,
        },
        instance_group: {
          name: "Instance Group",
          description:
            "The name of the instance group from which you want to generate a list of included instances.",
          type: {
            type: "string",
          },
          required: true,
        },
        instance_state: {
          name: "Instance State",
          description:
            "A filter for the state of the instances in the instance group. Valid options are ALL or RUNNING. If you do not specify this parameter the list includes all instances regardless of their state. Check the InstanceState enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "A filter for the state of the instances in the instance group. Valid options are ALL or RUNNING. If you do not specify this parameter the list includes all instances regardless of their state. Check the InstanceState enum for the list of possible values.",
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
        if (input.event.inputConfig.instance_group !== undefined)
          pathParams["instance_group"] = String(
            input.event.inputConfig.instance_group,
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
        if (input.event.inputConfig.instance_state !== undefined)
          body.instance_state = input.event.inputConfig.instance_state;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instanceGroups/{instance_group}/listInstances",
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
              "Output only. [Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                instance: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL of the instance.",
                },
                named_ports: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "The name for this named port. The name must be 1-63 characters long, and comply withRFC1035.",
                      },
                      port: {
                        type: "integer",
                        description:
                          "The port number, which can be a value between 1 and 65535.",
                      },
                    },
                    description: 'The named port. For example: <"http", 80>.',
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output Only] The named ports that belong to this instance group.",
                },
                status: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The status of the instance. Check the Status enum for the list of possible values.",
                },
              },
              additionalProperties: true,
            },
            description: "A list of InstanceWithNamedPorts resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] The resource type, which is alwayscompute#instanceGroupsListInstances for the list of instances in the specified instance group.",
          },
          next_page_token: {
            type: "string",
            description:
              "Output only. [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
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
        additionalProperties: true,
      },
    },
  },
};

export default listInstances;
