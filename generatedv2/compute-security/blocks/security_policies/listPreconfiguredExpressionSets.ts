import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const listPreconfiguredExpressionSets: AppBlock = {
  name: "Security Policies - List Preconfigured Expression Sets",
  description: `Gets the current list of preconfigured Web Application Firewall (WAF) expressions.`,
  category: "Security Policies",
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

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/securityPolicies/listPreconfiguredExpressionSets",
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
          preconfigured_expression_sets: {
            type: "object",
            properties: {
              waf_rules: {
                type: "object",
                properties: {
                  expression_sets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        aliases: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            'A list of alternate IDs. The format should be: - E.g. XSS-stable Generic suffix like "stable" is particularly useful if a policy likes to avail newer set of expressions without having to change the policy. A given alias name can\'t be used for more than one entity set.',
                        },
                        expressions: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                description:
                                  "Expression ID should uniquely identify the origin of the expression. E.g. owasp-crs-v020901-id973337 identifies Owasp core rule set version 2.9.1 rule id 973337. The ID could be used to determine the individual attack definition that has been detected. It could also be used to exclude it from the policy in case of false positive. required",
                              },
                              sensitivity: {
                                type: "integer",
                                description:
                                  "The sensitivity value associated with the WAF rule ID. This corresponds to the ModSecurity paranoia level, ranging from 1 to 4. 0 is reserved for opt-in only rules.",
                              },
                            },
                            additionalProperties: true,
                          },
                          description: "List of available expressions.",
                        },
                        id: {
                          type: "string",
                          description:
                            "Google specified expression set ID. The format should be: - E.g. XSS-20170329 required",
                        },
                      },
                      additionalProperties: true,
                    },
                    description:
                      "List of entities that are currently supported for WAF rules.",
                  },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listPreconfiguredExpressionSets;
