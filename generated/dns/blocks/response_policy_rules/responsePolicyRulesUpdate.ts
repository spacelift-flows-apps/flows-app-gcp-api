import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePolicyRulesUpdate: AppBlock = {
  name: "Response Policy Rules - Update",
  description: `Updates an existing Response Policy Rule.`,
  category: "Response Policy Rules",
  inputs: {
    default: {
      config: {
        responsePolicy: {
          name: "Response Policy",
          description:
            "User assigned name of the Response Policy containing the Response Policy Rule.",
          type: {
            type: "string",
          },
          required: true,
        },
        responsePolicyRule: {
          name: "Response Policy Rule",
          description:
            "User assigned name of the Response Policy Rule addressed by this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        behavior: {
          name: "Behavior",
          description:
            "Answer this query with a behavior rather than DNS data.",
          type: {
            type: "string",
            enum: ["behaviorUnspecified", "bypassResponsePolicy"],
          },
          required: false,
        },
        dnsName: {
          name: "Dns Name",
          description:
            "The DNS name (wildcard or exact) to apply this rule to. Must be unique within the Response Policy Rule.",
          type: {
            type: "string",
          },
          required: false,
        },
        ruleName: {
          name: "Rule Name",
          description:
            "An identifier for this rule. Must be unique with the ResponsePolicy.",
          type: {
            type: "string",
          },
          required: false,
        },
        localData: {
          name: "Local Data",
          description:
            "Answer this query directly with DNS data. These ResourceRecordSets override any other DNS behavior for the matched name; in particular they override private zones, the public internet, and GCP internal DNS. No SOA nor NS types are allowed.",
          type: {
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
                    },
                    name: {
                      type: "string",
                    },
                    ttl: {
                      type: "integer",
                    },
                    signatureRrdatas: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                    routingPolicy: {
                      type: "object",
                      properties: {
                        geo: {
                          type: "object",
                          additionalProperties: true,
                        },
                        wrr: {
                          type: "object",
                          additionalProperties: true,
                        },
                        healthCheck: {
                          type: "string",
                        },
                        primaryBackup: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                    },
                    type: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
          },
          required: false,
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
        if (input.event.inputConfig.responsePolicy !== undefined)
          pathParams["responsePolicy"] = String(
            input.event.inputConfig.responsePolicy,
          );
        if (input.event.inputConfig.responsePolicyRule !== undefined)
          pathParams["responsePolicyRule"] = String(
            input.event.inputConfig.responsePolicyRule,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );
        const body: Record<string, any> = {};
        if (input.event.inputConfig.behavior !== undefined)
          body.behavior = input.event.inputConfig.behavior;
        if (input.event.inputConfig.dnsName !== undefined)
          body.dnsName = input.event.inputConfig.dnsName;
        if (input.event.inputConfig.ruleName !== undefined)
          body.ruleName = input.event.inputConfig.ruleName;
        if (input.event.inputConfig.localData !== undefined)
          body.localData = input.event.inputConfig.localData;

        const result = await dnsFetch({
          config: input.app.config,
          method: "PUT",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules/{responsePolicyRule}",
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
          responsePolicyRule: {
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
                          type: "object",
                          additionalProperties: true,
                        },
                        name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ttl: {
                          type: "object",
                          additionalProperties: true,
                        },
                        signatureRrdatas: {
                          type: "object",
                          additionalProperties: true,
                        },
                        routingPolicy: {
                          type: "object",
                          additionalProperties: true,
                        },
                        type: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
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
        additionalProperties: true,
      },
    },
  },
};

export default responsePolicyRulesUpdate;
