import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePolicyRulesCreate: AppBlock = {
  name: "Response Policy Rules - Create",
  description: `Creates a new Response Policy Rule.`,
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
          method: "POST",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules",
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

export default responsePolicyRulesCreate;
