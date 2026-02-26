import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePolicyRulesList: AppBlock = {
  name: "Response Policy Rules - List",
  description: `Enumerates all Response Policy Rules associated with a project.`,
  category: "Response Policy Rules",
  inputs: {
    default: {
      config: {
        responsePolicy: {
          name: "Response Policy",
          description: "User assigned name of the Response Policy to list.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.",
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.",
          type: {
            type: "integer",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.responsePolicy !== undefined)
          pathParams["responsePolicy"] = String(
            input.event.inputConfig.responsePolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules",
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
          responsePolicyRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                behavior: {
                  type: "string",
                  enum: ["behaviorUnspecified", "bypassResponsePolicy"],
                  description:
                    "Answer this query with a behavior rather than DNS data.",
                },
                dnsName: {
                  type: "string",
                  description:
                    "The DNS name (wildcard or exact) to apply this rule to. Must be unique within the Response Policy Rule.",
                },
                kind: {
                  type: "string",
                },
                ruleName: {
                  type: "string",
                  description:
                    "An identifier for this rule. Must be unique with the ResponsePolicy.",
                },
                localData: {
                  type: "object",
                  properties: {
                    localDatas: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                      description:
                        "All resource record sets for this selector, one per resource record type. The name must match the dns_name.",
                    },
                  },
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
              description:
                "A Response Policy Rule is a selector that applies its behavior to queries that match the selector. Selectors are DNS names, which may be wildcards or exact matches. Each DNS query subject to a Response Policy matches at most one ResponsePolicyRule, as identified by the dns_name field with the longest matching suffix.",
            },
            description: "The Response Policy Rule resources.",
          },
          nextPageToken: {
            type: "string",
            description:
              "This field indicates that more results are available beyond the last page displayed. To fetch the results, make another list request and use this value as your page token. This lets you retrieve the complete contents of a very large collection one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You can't retrieve a consistent snapshot of a collection larger than the maximum page size.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default responsePolicyRulesList;
