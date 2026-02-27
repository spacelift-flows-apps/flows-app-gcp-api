import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const routersListRoutePolicies: AppBlock = {
  name: "Routers - List Route Policies",
  description: `Retrieves a list of router route policy subresources available to the specified project.`,
  category: "Routers",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
            description: "Name of the region for this request.",
          },
          required: true,
        },
        router: {
          name: "Router",
          description:
            "Name or id of the resource for this request. Name should conform to RFC1035.",
          type: {
            type: "string",
            description:
              "Name or id of the resource for this request. Name should conform to RFC1035.",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
            description:
              'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
            description:
              "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
            description:
              'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
            description:
              "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "boolean",
            description:
              "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
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
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.orderBy !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.orderBy);
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.returnPartialSuccess !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.returnPartialSuccess,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/routers/{router}/listRoutePolicies",
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
              "Output only. [Output Only] Type of resource. Alwayscompute#routersListRoutePolicies for lists of route policies.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  description: "An optional description of route policy.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the Route Policy being applied to this Router, which is essentially a hash of the Route Policy used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update Route Policy. You must always provide an up-to-date fingerprint hash in order to update or change labels.  To see the latest fingerprint, make a getRoutePolicy() request to retrieve a Route Policy.",
                },
                name: {
                  type: "string",
                  description:
                    "Route Policy name, which must be a resource ID segment and unique within all the router's Route Policies. Name should conform to RFC1035.",
                },
                terms: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      actions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            description: {
                              type: "string",
                              description:
                                "Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.",
                            },
                            expression: {
                              type: "string",
                              description:
                                "Textual representation of an expression in Common Expression Language syntax.",
                            },
                            location: {
                              type: "string",
                              description:
                                "Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file.",
                            },
                            title: {
                              type: "string",
                              description:
                                "Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.",
                            },
                          },
                          description:
                            'Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec.  Example (Comparison):      title: "Summary size limit"     description: "Determines if a summary is less than 100 chars"     expression: "document.summary.size() < 100"  Example (Equality):      title: "Requestor is owner"     description: "Determines if requestor is the document owner"     expression: "document.owner == request.auth.claims.email"  Example (Logic):      title: "Public documents"     description: "Determine whether the document should be publicly visible"     expression: "document.type != \'private\' && document.type != \'internal\'"  Example (Data Manipulation):      title: "Notification string"     description: "Create a notification string with a timestamp."     expression: "\'New message received at \' + string(document.create_time)"  The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.',
                          additionalProperties: true,
                        },
                        description:
                          "CEL expressions to evaluate to modify a route when this term matches.",
                      },
                      match: {
                        type: "object",
                        properties: {
                          description: {
                            type: "string",
                            description:
                              "Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.",
                          },
                          expression: {
                            type: "string",
                            description:
                              "Textual representation of an expression in Common Expression Language syntax.",
                          },
                          location: {
                            type: "string",
                            description:
                              "Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file.",
                          },
                          title: {
                            type: "string",
                            description:
                              "Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.",
                          },
                        },
                        description:
                          'Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec.  Example (Comparison):      title: "Summary size limit"     description: "Determines if a summary is less than 100 chars"     expression: "document.summary.size() < 100"  Example (Equality):      title: "Requestor is owner"     description: "Determines if requestor is the document owner"     expression: "document.owner == request.auth.claims.email"  Example (Logic):      title: "Public documents"     description: "Determine whether the document should be publicly visible"     expression: "document.type != \'private\' && document.type != \'internal\'"  Example (Data Manipulation):      title: "Notification string"     description: "Create a notification string with a timestamp."     expression: "\'New message received at \' + string(document.create_time)"  The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.',
                        additionalProperties: true,
                      },
                      priority: {
                        type: "integer",
                        description:
                          "The evaluation priority for this term, which must be between 0 (inclusive) and 2^31 (exclusive), and unique within the list.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "List of terms (the order in the list is not important, they are evaluated in order of priority). Order of policies is not retained and might change when getting policy later.",
                },
                type: {
                  type: "string",
                  enum: [
                    "UNDEFINED_TYPE",
                    "ROUTE_POLICY_TYPE_EXPORT",
                    "ROUTE_POLICY_TYPE_IMPORT",
                  ],
                  description:
                    "Check the Type enum for the list of possible values.",
                },
              },
              additionalProperties: true,
            },
            description: "[Output Only] A list of route policies.",
          },
          selfLink: {
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
                enum: [
                  "UNDEFINED_CODE",
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

export default routersListRoutePolicies;
