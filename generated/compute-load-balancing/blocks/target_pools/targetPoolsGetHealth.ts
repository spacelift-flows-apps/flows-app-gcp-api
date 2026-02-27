import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const targetPoolsGetHealth: AppBlock = {
  name: "Target Pools - Get Health",
  description: `Gets the most recent health check results for each IP for the instance that is referenced by the given target pool.`,
  category: "Target Pools",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
            description: "Name of the region scoping this request.",
          },
          required: true,
        },
        targetPool: {
          name: "Target Pool",
          description:
            "Name of the TargetPool resource to which the queried instance belongs.",
          type: {
            type: "string",
            description:
              "Name of the TargetPool resource to which the queried instance belongs.",
          },
          required: true,
        },
        instance: {
          name: "Instance",
          description:
            "The URL for a specific instance. @required compute.instancegroups.addInstances/removeInstances",
          type: {
            type: "string",
            description:
              "The URL for a specific instance. @required compute.instancegroups.addInstances/removeInstances",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.targetPool !== undefined)
          pathParams["target_pool"] = String(
            input.event.inputConfig.targetPool,
          );

        const body: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          body.instance = input.event.inputConfig.instance;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/targetPools/{target_pool}/getHealth",
          pathParams,
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
          healthStatus: {
            type: "array",
            items: {
              type: "object",
              properties: {
                annotations: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Metadata defined as annotations for network endpoint.",
                },
                forwardingRule: {
                  type: "string",
                  description:
                    "URL of the forwarding rule associated with the health status of the instance.",
                },
                forwardingRuleIp: {
                  type: "string",
                  description:
                    "A forwarding rule IP address assigned to this instance.",
                },
                healthState: {
                  type: "string",
                  enum: ["UNDEFINED_HEALTH_STATE", "HEALTHY", "UNHEALTHY"],
                  description:
                    "Health state of the IPv4 address of the instance. Check the HealthState enum for the list of possible values.",
                },
                instance: {
                  type: "string",
                  description: "URL of the instance resource.",
                },
                ipAddress: {
                  type: "string",
                  description:
                    "For target pool based Network Load Balancing, it indicates the forwarding rule's IP address assigned to this instance. For other types of load balancing, the field indicates VM internal ip.",
                },
                ipv6Address: {
                  type: "string",
                },
                ipv6HealthState: {
                  type: "string",
                  enum: ["UNDEFINED_IPV6_HEALTH_STATE"],
                  description:
                    "Health state of the IPv6 address of the instance. Check the Ipv6HealthState enum for the list of possible values.",
                },
                port: {
                  type: "integer",
                  description:
                    "The named port of the instance group, not necessarily the port that is health-checked.",
                },
                weight: {
                  type: "string",
                },
                weightError: {
                  type: "string",
                  enum: [
                    "UNDEFINED_WEIGHT_ERROR",
                    "INVALID_WEIGHT",
                    "MISSING_WEIGHT",
                    "UNAVAILABLE_WEIGHT",
                    "WEIGHT_NONE",
                  ],
                  description:
                    "Check the WeightError enum for the list of possible values.",
                },
              },
              additionalProperties: true,
            },
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#targetPoolInstanceHealth when checking the health of an instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default targetPoolsGetHealth;
