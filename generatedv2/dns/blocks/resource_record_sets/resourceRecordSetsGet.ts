import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const resourceRecordSetsGet: AppBlock = {
  name: "Resource Record Sets - Get",
  description: `Fetches the representation of an existing ResourceRecordSet.`,
  category: "Resource Record Sets",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Fully qualified domain name.",
          type: {
            type: "string",
          },
          required: true,
        },
        type: {
          name: "Type",
          description: "RRSet type.",
          type: {
            type: "string",
          },
          required: true,
        },
        managedZone: {
          name: "Managed Zone",
          description:
            "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
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
        if (input.event.inputConfig.name !== undefined)
          pathParams["name"] = String(input.event.inputConfig.name);
        if (input.event.inputConfig.type !== undefined)
          pathParams["type"] = String(input.event.inputConfig.type);
        if (input.event.inputConfig.managedZone !== undefined)
          pathParams["managedZone"] = String(
            input.event.inputConfig.managedZone,
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
            "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets/{name}/{type}",
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
                properties: {
                  kind: {
                    type: "string",
                  },
                  enableFencing: {
                    type: "boolean",
                    description:
                      "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        healthCheckedTargets: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        signatureRrdatas: {
                          type: "object",
                          additionalProperties: true,
                        },
                        rrdatas: {
                          type: "object",
                          additionalProperties: true,
                        },
                        location: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                      description:
                        "ResourceRecordSet data for one geo location.",
                    },
                    description:
                      "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
                  },
                },
                additionalProperties: true,
                description:
                  "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
              },
              kind: {
                type: "string",
              },
              wrr: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        healthCheckedTargets: {
                          type: "object",
                          additionalProperties: true,
                        },
                        signatureRrdatas: {
                          type: "object",
                          additionalProperties: true,
                        },
                        rrdatas: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        weight: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                      description:
                        "A routing block which contains the routing information for one WRR item.",
                    },
                  },
                  kind: {
                    type: "string",
                  },
                },
                additionalProperties: true,
                description:
                  "Configures a RRSetRoutingPolicy that routes in a weighted round robin fashion.",
              },
              healthCheck: {
                type: "string",
                description:
                  "The fully qualified URL of the HealthCheck to use for this RRSetRoutingPolicy. Format this URL like `https://www.googleapis.com/compute/v1/projects/{project}/global/healthChecks/{healthCheck}`. https://cloud.google.com/compute/docs/reference/rest/v1/healthChecks",
              },
              primaryBackup: {
                type: "object",
                properties: {
                  primaryTargets: {
                    type: "object",
                    properties: {
                      externalEndpoints: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description:
                          "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
                      },
                      internalLoadBalancers: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description:
                          "Configuration for internal load balancers to be health checked.",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "HealthCheckTargets describes endpoints to health-check when responding to Routing Policy queries. Only the healthy endpoints will be included in the response. Set either `internal_load_balancer` or `external_endpoints`. Do not set both.",
                  },
                  kind: {
                    type: "string",
                  },
                  backupGeoTargets: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                      },
                      enableFencing: {
                        type: "boolean",
                        description:
                          "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
                      },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description:
                          "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
                  },
                  trickleTraffic: {
                    type: "number",
                    description:
                      "When serving state is `PRIMARY`, this field provides the option of sending a small percentage of the traffic to the backup targets.",
                  },
                },
                additionalProperties: true,
                description:
                  "Configures a RRSetRoutingPolicy such that all queries are responded with the primary_targets if they are healthy. And if all of them are unhealthy, then we fallback to a geo localized policy.",
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
        description: "A unit of data that is returned by the DNS servers.",
      },
    },
  },
};

export default resourceRecordSetsGet;
