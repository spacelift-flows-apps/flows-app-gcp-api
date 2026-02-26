import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const resourceRecordSetsPatch: AppBlock = {
  name: "Resource Record Sets - Patch",
  description: `Applies a partial update to an existing ResourceRecordSet.`,
  category: "Resource Record Sets",
  inputs: {
    default: {
      config: {
        managedZone: {
          name: "Managed Zone",
          description:
            "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
          type: {
            type: "string",
          },
          required: true,
        },
        name: {
          name: "Name",
          description: "For example, www.example.com.",
          type: {
            type: "string",
          },
          required: false,
        },
        type: {
          name: "Type",
          description:
            "The identifier of a supported record type. See the list of Supported DNS record types.",
          type: {
            type: "string",
          },
          required: false,
        },
        rrdatas: {
          name: "Rrdatas",
          description:
            "As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see examples.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ttl: {
          name: "Ttl",
          description:
            "Number of seconds that this `ResourceRecordSet` can be cached by resolvers.",
          type: {
            type: "integer",
          },
          required: false,
        },
        signatureRrdatas: {
          name: "Signature Rrdatas",
          description: "As defined in RFC 4034 (section 3.2).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        routingPolicy: {
          name: "Routing Policy",
          description:
            "Configures dynamic query responses based on either the geo location of the querying user or a weighted round robin based routing policy. A valid `ResourceRecordSet` contains only `rrdata` (for static resolution) or a `routing_policy` (for dynamic resolution).",
          type: {
            type: "object",
            properties: {
              geo: {
                type: "object",
                properties: {
                  enableFencing: {
                    type: "boolean",
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
                        signatureRrdatas: {
                          type: "array",
                          items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        rrdatas: {
                          type: "array",
                          items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        location: {
                          type: "string",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                },
                additionalProperties: true,
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
                          type: "array",
                          items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        rrdatas: {
                          type: "array",
                          items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        weight: {
                          type: "number",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                },
                additionalProperties: true,
              },
              healthCheck: {
                type: "string",
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
                          type: "string",
                        },
                      },
                      internalLoadBalancers: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    additionalProperties: true,
                  },
                  backupGeoTargets: {
                    type: "object",
                    properties: {
                      enableFencing: {
                        type: "boolean",
                      },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    additionalProperties: true,
                  },
                  trickleTraffic: {
                    type: "number",
                  },
                },
                additionalProperties: true,
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
        if (input.event.inputConfig.managedZone !== undefined)
          pathParams["managedZone"] = String(
            input.event.inputConfig.managedZone,
          );
        if (input.event.inputConfig.name !== undefined)
          pathParams["name"] = String(input.event.inputConfig.name);
        if (input.event.inputConfig.type !== undefined)
          pathParams["type"] = String(input.event.inputConfig.type);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );
        const body: Record<string, any> = {};
        if (input.event.inputConfig.rrdatas !== undefined)
          body.rrdatas = input.event.inputConfig.rrdatas;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.ttl !== undefined)
          body.ttl = input.event.inputConfig.ttl;
        if (input.event.inputConfig.signatureRrdatas !== undefined)
          body.signatureRrdatas = input.event.inputConfig.signatureRrdatas;
        if (input.event.inputConfig.routingPolicy !== undefined)
          body.routingPolicy = input.event.inputConfig.routingPolicy;
        if (input.event.inputConfig.type !== undefined)
          body.type = input.event.inputConfig.type;

        const result = await dnsFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets/{name}/{type}",
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

export default resourceRecordSetsPatch;
