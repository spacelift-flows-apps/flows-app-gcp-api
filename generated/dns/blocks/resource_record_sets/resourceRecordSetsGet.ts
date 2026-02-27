import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

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
          name: "Client Operation ID",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/cloud-platform.read-only",
              "https://www.googleapis.com/auth/ndev.clouddns.readonly",
              "https://www.googleapis.com/auth/ndev.clouddns.readwrite",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://dns.googleapis.com/";
        let path = `dns/v1/projects/{project}/managedZones/{managedZone}/rrsets/{name}/{type}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
          );
        }

        const result = await response.json();
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
              "Number of seconds that this `ResourceRecordSet` can be cached by resolvers. (Format: int32)",
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
                          properties: {
                            externalEndpoints: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
                            },
                            internalLoadBalancers: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  port: {
                                    type: "string",
                                    description:
                                      "The configured port of the load balancer.",
                                  },
                                  project: {
                                    type: "string",
                                    description:
                                      "The project ID in which the load balancer is located.",
                                  },
                                  ipAddress: {
                                    type: "string",
                                    description:
                                      "The frontend IP address of the load balancer to health check.",
                                  },
                                  kind: {
                                    type: "string",
                                  },
                                  ipProtocol: {
                                    type: "string",
                                    enum: ["undefined", "tcp", "udp"],
                                    description:
                                      "The protocol of the load balancer to health check.",
                                  },
                                  region: {
                                    type: "string",
                                    description:
                                      "The region in which the load balancer is located.",
                                  },
                                  networkUrl: {
                                    type: "string",
                                    description:
                                      "The fully qualified URL of the network that the load balancer is attached to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`.",
                                  },
                                  loadBalancerType: {
                                    type: "string",
                                    enum: [
                                      "none",
                                      "globalL7ilb",
                                      "regionalL4ilb",
                                      "regionalL7ilb",
                                    ],
                                    description:
                                      "The type of load balancer specified by this target. This value must match the configuration of the load balancer located at the LoadBalancerTarget's IP address, port, and region. Use the following: - *regionalL4ilb*: for a regional internal passthrough Network Load Balancer. - *regionalL7ilb*: for a regional internal Application Load Balancer. - *globalL7ilb*: for a global internal Application Load Balancer.",
                                  },
                                },
                                description:
                                  "The configuration for an individual load balancer to health check.",
                                additionalProperties: true,
                              },
                              description:
                                "Configuration for internal load balancers to be health checked.",
                            },
                          },
                          description:
                            "HealthCheckTargets describes endpoints to health-check when responding to Routing Policy queries. Only the healthy endpoints will be included in the response. Set either `internal_load_balancer` or `external_endpoints`. Do not set both.",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "string",
                        },
                        signatureRrdatas: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
                        },
                        rrdatas: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        location: {
                          type: "string",
                          description:
                            'The geo-location granularity is a GCP region. This location string should correspond to a GCP region. e.g. "us-east1", "southamerica-east1", "asia-east1", etc.',
                        },
                      },
                      description:
                        "ResourceRecordSet data for one geo location.",
                      additionalProperties: true,
                    },
                    description:
                      "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
                  },
                },
                description:
                  "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
                additionalProperties: true,
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
                          properties: {
                            externalEndpoints: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
                            },
                            internalLoadBalancers: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  port: {
                                    type: "string",
                                    description:
                                      "The configured port of the load balancer.",
                                  },
                                  project: {
                                    type: "string",
                                    description:
                                      "The project ID in which the load balancer is located.",
                                  },
                                  ipAddress: {
                                    type: "string",
                                    description:
                                      "The frontend IP address of the load balancer to health check.",
                                  },
                                  kind: {
                                    type: "string",
                                  },
                                  ipProtocol: {
                                    type: "string",
                                    enum: ["undefined", "tcp", "udp"],
                                    description:
                                      "The protocol of the load balancer to health check.",
                                  },
                                  region: {
                                    type: "string",
                                    description:
                                      "The region in which the load balancer is located.",
                                  },
                                  networkUrl: {
                                    type: "string",
                                    description:
                                      "The fully qualified URL of the network that the load balancer is attached to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`.",
                                  },
                                  loadBalancerType: {
                                    type: "string",
                                    enum: [
                                      "none",
                                      "globalL7ilb",
                                      "regionalL4ilb",
                                      "regionalL7ilb",
                                    ],
                                    description:
                                      "The type of load balancer specified by this target. This value must match the configuration of the load balancer located at the LoadBalancerTarget's IP address, port, and region. Use the following: - *regionalL4ilb*: for a regional internal passthrough Network Load Balancer. - *regionalL7ilb*: for a regional internal Application Load Balancer. - *globalL7ilb*: for a global internal Application Load Balancer.",
                                  },
                                },
                                description:
                                  "The configuration for an individual load balancer to health check.",
                                additionalProperties: true,
                              },
                              description:
                                "Configuration for internal load balancers to be health checked.",
                            },
                          },
                          description:
                            "HealthCheckTargets describes endpoints to health-check when responding to Routing Policy queries. Only the healthy endpoints will be included in the response. Set either `internal_load_balancer` or `external_endpoints`. Do not set both.",
                          additionalProperties: true,
                        },
                        signatureRrdatas: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
                        },
                        rrdatas: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        kind: {
                          type: "string",
                        },
                        weight: {
                          type: "number",
                          description:
                            "The weight corresponding to this `WrrPolicyItem` object. When multiple `WrrPolicyItem` objects are configured, the probability of returning an `WrrPolicyItem` object's data is proportional to its weight relative to the sum of weights configured for all items. This weight must be non-negative. (Format: double)",
                        },
                      },
                      description:
                        "A routing block which contains the routing information for one WRR item.",
                      additionalProperties: true,
                    },
                  },
                  kind: {
                    type: "string",
                  },
                },
                description:
                  "Configures a RRSetRoutingPolicy that routes in a weighted round robin fashion.",
                additionalProperties: true,
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
                          type: "string",
                        },
                        description:
                          "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
                      },
                      internalLoadBalancers: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            port: {
                              type: "string",
                              description:
                                "The configured port of the load balancer.",
                            },
                            project: {
                              type: "string",
                              description:
                                "The project ID in which the load balancer is located.",
                            },
                            ipAddress: {
                              type: "string",
                              description:
                                "The frontend IP address of the load balancer to health check.",
                            },
                            kind: {
                              type: "string",
                            },
                            ipProtocol: {
                              type: "string",
                              enum: ["undefined", "tcp", "udp"],
                              description:
                                "The protocol of the load balancer to health check.",
                            },
                            region: {
                              type: "string",
                              description:
                                "The region in which the load balancer is located.",
                            },
                            networkUrl: {
                              type: "string",
                              description:
                                "The fully qualified URL of the network that the load balancer is attached to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`.",
                            },
                            loadBalancerType: {
                              type: "string",
                              enum: [
                                "none",
                                "globalL7ilb",
                                "regionalL4ilb",
                                "regionalL7ilb",
                              ],
                              description:
                                "The type of load balancer specified by this target. This value must match the configuration of the load balancer located at the LoadBalancerTarget's IP address, port, and region. Use the following: - *regionalL4ilb*: for a regional internal passthrough Network Load Balancer. - *regionalL7ilb*: for a regional internal Application Load Balancer. - *globalL7ilb*: for a global internal Application Load Balancer.",
                            },
                          },
                          description:
                            "The configuration for an individual load balancer to health check.",
                          additionalProperties: true,
                        },
                        description:
                          "Configuration for internal load balancers to be health checked.",
                      },
                    },
                    description:
                      "HealthCheckTargets describes endpoints to health-check when responding to Routing Policy queries. Only the healthy endpoints will be included in the response. Set either `internal_load_balancer` or `external_endpoints`. Do not set both.",
                    additionalProperties: true,
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
                          properties: {
                            healthCheckedTargets: {
                              type: "object",
                              properties: {
                                externalEndpoints: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
                                },
                                internalLoadBalancers: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      port: {
                                        type: "string",
                                        description:
                                          "The configured port of the load balancer.",
                                      },
                                      project: {
                                        type: "string",
                                        description:
                                          "The project ID in which the load balancer is located.",
                                      },
                                      ipAddress: {
                                        type: "string",
                                        description:
                                          "The frontend IP address of the load balancer to health check.",
                                      },
                                      kind: {
                                        type: "string",
                                      },
                                      ipProtocol: {
                                        type: "string",
                                        enum: ["undefined", "tcp", "udp"],
                                        description:
                                          "The protocol of the load balancer to health check.",
                                      },
                                      region: {
                                        type: "string",
                                        description:
                                          "The region in which the load balancer is located.",
                                      },
                                      networkUrl: {
                                        type: "string",
                                        description:
                                          "The fully qualified URL of the network that the load balancer is attached to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`.",
                                      },
                                      loadBalancerType: {
                                        type: "string",
                                        enum: [
                                          "none",
                                          "globalL7ilb",
                                          "regionalL4ilb",
                                          "regionalL7ilb",
                                        ],
                                        description:
                                          "The type of load balancer specified by this target. This value must match the configuration of the load balancer located at the LoadBalancerTarget's IP address, port, and region. Use the following: - *regionalL4ilb*: for a regional internal passthrough Network Load Balancer. - *regionalL7ilb*: for a regional internal Application Load Balancer. - *globalL7ilb*: for a global internal Application Load Balancer.",
                                      },
                                    },
                                    description:
                                      "The configuration for an individual load balancer to health check.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Configuration for internal load balancers to be health checked.",
                                },
                              },
                              description:
                                "HealthCheckTargets describes endpoints to health-check when responding to Routing Policy queries. Only the healthy endpoints will be included in the response. Set either `internal_load_balancer` or `external_endpoints`. Do not set both.",
                              additionalProperties: true,
                            },
                            kind: {
                              type: "string",
                            },
                            signatureRrdatas: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
                            },
                            rrdatas: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                            location: {
                              type: "string",
                              description:
                                'The geo-location granularity is a GCP region. This location string should correspond to a GCP region. e.g. "us-east1", "southamerica-east1", "asia-east1", etc.',
                            },
                          },
                          description:
                            "ResourceRecordSet data for one geo location.",
                          additionalProperties: true,
                        },
                        description:
                          "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
                      },
                    },
                    description:
                      "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
                    additionalProperties: true,
                  },
                  trickleTraffic: {
                    type: "number",
                    description:
                      "When serving state is `PRIMARY`, this field provides the option of sending a small percentage of the traffic to the backup targets. (Format: double)",
                  },
                },
                description:
                  "Configures a RRSetRoutingPolicy such that all queries are responded with the primary_targets if they are healthy. And if all of them are unhealthy, then we fallback to a geo localized policy.",
                additionalProperties: true,
              },
            },
            description:
              "A RRSetRoutingPolicy represents ResourceRecordSet data that is returned dynamically with the response varying based on configured properties such as geolocation or by weighted random selection.",
            additionalProperties: true,
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
        description: "A unit of data that is returned by the DNS servers.",
        additionalProperties: true,
      },
    },
  },
};

export default resourceRecordSetsGet;
