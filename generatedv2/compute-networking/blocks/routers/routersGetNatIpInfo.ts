import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const routersGetNatIpInfo: AppBlock = {
  name: "Routers - Get Nat Ip Info",
  description: `Retrieves runtime NAT IP information.`,
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
            "Name of the Router resource to query for Nat IP information. The name should conform to RFC1035.",
          type: {
            type: "string",
            description:
              "Name of the Router resource to query for Nat IP information. The name should conform to RFC1035.",
          },
          required: true,
        },
        natName: {
          name: "Nat Name",
          description:
            "Name of the nat service to filter the NAT IP information. If it is omitted, all nats for this router will be returned. Name should conform to RFC1035.",
          type: {
            type: "string",
            description:
              "Name of the nat service to filter the NAT IP information. If it is omitted, all nats for this router will be returned. Name should conform to RFC1035.",
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
        if (input.event.inputConfig.natName !== undefined)
          queryParams["natName"] = String(input.event.inputConfig.natName);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/routers/{router}/getNatIpInfo",
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
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                natIpInfoMappings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      mode: {
                        type: "string",
                        enum: ["UNDEFINED_MODE", "AUTO", "MANUAL"],
                        description:
                          "Output only. Specifies whether NAT IP is auto or manual. Check the Mode enum for the list of possible values.",
                      },
                      natIp: {
                        type: "string",
                        description:
                          "Output only. NAT IP address. For example: 203.0.113.11.",
                      },
                      usage: {
                        type: "string",
                        enum: ["UNDEFINED_USAGE", "IN_USE", "UNUSED"],
                        description:
                          "Output only. Specifies whether NAT IP is currently serving at least one endpoint or not. Check the Usage enum for the list of possible values.",
                      },
                    },
                    description: "Contains information of a NAT IP.",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. A list of all NAT IPs assigned to this NAT config.",
                },
                natName: {
                  type: "string",
                  description:
                    "Output only. Name of the NAT config which the NAT IP belongs to.",
                },
              },
              description:
                "Contains NAT IP information of a NAT config (i.e. usage status, mode).",
              additionalProperties: true,
            },
            description: "[Output Only] A list of NAT IP information.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default routersGetNatIpInfo;
