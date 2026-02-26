import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const changesGet: AppBlock = {
  name: "Changes - Get",
  description: `Fetches the representation of an existing Change.`,
  category: "Changes",
  inputs: {
    default: {
      config: {
        changeId: {
          name: "Change Id",
          description:
            "The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.",
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
        if (input.event.inputConfig.changeId !== undefined)
          pathParams["changeId"] = String(input.event.inputConfig.changeId);
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
            "dns/v1/projects/{project}/managedZones/{managedZone}/changes/{changeId}",
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
          kind: {
            type: "string",
          },
          id: {
            type: "string",
            description:
              "Unique identifier for the resource; defined by the server (output only).",
          },
          status: {
            type: "string",
            enum: ["pending", "done"],
            description:
              'Status of the operation (output only). A status of "done" means that the request to update the authoritative servers has been sent, but the servers might not be updated yet.',
          },
          additions: {
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
                      properties: {
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        enableFencing: {
                          type: "object",
                          additionalProperties: true,
                        },
                        items: {
                          type: "object",
                          additionalProperties: true,
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
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        backupGeoTargets: {
                          type: "object",
                          additionalProperties: true,
                        },
                        trickleTraffic: {
                          type: "object",
                          additionalProperties: true,
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
              description:
                "A unit of data that is returned by the DNS servers.",
            },
            description: "Which ResourceRecordSets to add?",
          },
          startTime: {
            type: "string",
            description:
              "The time that this operation was started by the server (output only). This is in RFC3339 text format.",
          },
          isServing: {
            type: "boolean",
            description: "If the DNS queries for the zone will be served.",
          },
          deletions: {
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
                      properties: {
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        enableFencing: {
                          type: "object",
                          additionalProperties: true,
                        },
                        items: {
                          type: "object",
                          additionalProperties: true,
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
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        backupGeoTargets: {
                          type: "object",
                          additionalProperties: true,
                        },
                        trickleTraffic: {
                          type: "object",
                          additionalProperties: true,
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
              description:
                "A unit of data that is returned by the DNS servers.",
            },
            description:
              "Which ResourceRecordSets to remove? Must match existing data exactly.",
          },
        },
        additionalProperties: true,
        description:
          "A Change represents a set of `ResourceRecordSet` additions and deletions applied atomically to a ManagedZone. ResourceRecordSets within a ManagedZone are modified by creating a new Change element in the Changes collection. In turn the Changes collection also records the past modifications to the `ResourceRecordSets` in a `ManagedZone`. The current state of the `ManagedZone` is the sum effect of applying all `Change` elements in the `Changes` collection in sequence.",
      },
    },
  },
};

export default changesGet;
