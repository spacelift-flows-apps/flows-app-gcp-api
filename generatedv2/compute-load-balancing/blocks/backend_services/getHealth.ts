import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getHealth: AppBlock = {
  name: "Backend Services - Get Health",
  description: `Gets the most recent health check results for each IP for the instance that is referenced by the given target pool.`,
  category: "Backend Services",
  inputs: {
    default: {
      config: {
        backend_service: {
          name: "Backend Service",
          description:
            "Name of the BackendService resource to which the queried instance belongs.",
          type: {
            type: "string",
          },
          required: true,
        },
        group: {
          name: "Group",
          description:
            "A URI referencing one of the instance groups or network endpoint groups listed in the backend service.",
          type: {
            type: "string",
            description:
              "A URI referencing one of the instance groups or network endpoint groups listed in the backend service.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.backend_service !== undefined)
          pathParams["backend_service"] = String(
            input.event.inputConfig.backend_service,
          );

        const body: Record<string, any> = {};
        if (input.event.inputConfig.group !== undefined)
          body.group = input.event.inputConfig.group;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/global/backendServices/{backend_service}/getHealth",
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
          annotations: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Metadata defined as annotations on the network endpoint group.",
          },
          health_status: {
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
                forwarding_rule: {
                  type: "string",
                  description:
                    "URL of the forwarding rule associated with the health status of the instance.",
                },
                forwarding_rule_ip: {
                  type: "string",
                  description:
                    "A forwarding rule IP address assigned to this instance.",
                },
                health_state: {
                  type: "string",
                  description:
                    "Health state of the IPv4 address of the instance. Check the HealthState enum for the list of possible values.",
                },
                instance: {
                  type: "string",
                  description: "URL of the instance resource.",
                },
                ip_address: {
                  type: "string",
                  description:
                    "For target pool based Network Load Balancing, it indicates the forwarding rule's IP address assigned to this instance. For other types of load balancing, the field indicates VM internal ip.",
                },
                ipv6_address: {
                  type: "string",
                },
                ipv6_health_state: {
                  type: "string",
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
                weight_error: {
                  type: "string",
                  description:
                    "Check the WeightError enum for the list of possible values.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Health state of the backend instances or endpoints in requested instance or network endpoint group, determined based on configured health checks.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#backendServiceGroupHealth for the health of backend services.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getHealth;
