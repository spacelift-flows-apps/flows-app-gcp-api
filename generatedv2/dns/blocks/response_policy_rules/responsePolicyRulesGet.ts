import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePolicyRulesGet: AppBlock = {
  name: "Response Policy Rules - Get",
  description: `Fetches the representation of an existing Response Policy Rule.`,
  category: "Response Policy Rules",
  inputs: {
    default: {
      config: {
        responsePolicyRule: {
          name: "Response Policy Rule",
          description:
            "User assigned name of the Response Policy Rule addressed by this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        responsePolicy: {
          name: "Response Policy",
          description:
            "User assigned name of the Response Policy containing the Response Policy Rule.",
          type: {
            type: "string",
          },
          required: true,
        },
        clientOperationId: {
          name: "Client Operation Id",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.responsePolicyRule !== undefined)
          pathParams["responsePolicyRule"] = String(
            input.event.inputConfig.responsePolicyRule,
          );
        if (input.event.inputConfig.responsePolicy !== undefined)
          pathParams["responsePolicy"] = String(
            input.event.inputConfig.responsePolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules/{responsePolicyRule}",
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
                  properties: {
                    rrdatas: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see examples.",
                    },
                    name: {
                      type: "string",
                      description: "For example, www.example.com.",
                    },
                    ttl: {
                      type: "integer",
                      description:
                        "Number of seconds that this `ResourceRecordSet` can be cached by resolvers.",
                    },
                    signatureRrdatas: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "As defined in RFC 4034 (section 3.2).",
                    },
                    routingPolicy: {
                      type: "object",
                      properties: {
                        geo: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        wrr: {
                          type: "object",
                          additionalProperties: true,
                        },
                        healthCheck: {
                          type: "object",
                          additionalProperties: true,
                        },
                        primaryBackup: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                      description:
                        "A RRSetRoutingPolicy represents ResourceRecordSet data that is returned dynamically with the response varying based on configured properties such as geolocation or by weighted random selection.",
                    },
                    type: {
                      type: "string",
                      description:
                        "The identifier of a supported record type. See the list of Supported DNS record types.",
                    },
                    kind: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "A unit of data that is returned by the DNS servers.",
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
    },
  },
};

export default responsePolicyRulesGet;
