import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRevisionsClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const getRevision: AppBlock = {
  name: "Get Revision",
  description: `Gets information about a Revision.`,
  category: "Revisions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The full name of the Revision. Format: projects/{project}/locations/{location}/services/{service}/revisions/{revision}",
          type: {
            type: "string",
            description:
              "Required. The full name of the Revision. Format: projects/{project}/locations/{location}/services/{service}/revisions/{revision}",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRevisionsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.getRevision(request, metadata, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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
          name: {
            type: "string",
            description: "Output only. The unique name of this Revision.",
          },
          uid: {
            type: "string",
            description:
              "Output only. Server assigned unique identifier for the Revision. The value is a UUID4 string and guaranteed to remain unchanged until the resource is deleted.",
          },
          generation: {
            type: "string",
            description: "64-bit integer as string",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Output only. Unstructured key value map that can be used to organize and categorize objects. User-provided labels are shared with Google's billing system, so they can be used to filter, or break down billing charges by team, component, environment, state, etc. For more information, visit https://cloud.google.com/resource-manager/docs/creating-managing-labels or https://cloud.google.com/run/docs/configuring/labels.",
          },
          annotations: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Output only. Unstructured key value map that may be set by external tools to store and arbitrary metadata. They are not queryable and should be preserved when modifying objects.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          update_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          delete_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          expire_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          launch_stage: {
            type: "string",
            enum: [
              "LAUNCH_STAGE_UNSPECIFIED",
              "UNIMPLEMENTED",
              "PRELAUNCH",
              "EARLY_ACCESS",
              "ALPHA",
              "BETA",
              "GA",
              "DEPRECATED",
            ],
            description:
              "The least stable launch stage needed to create this resource, as defined by [Google Cloud Platform Launch Stages](https://cloud.google.com/terms/launch-stages). Cloud Run supports `ALPHA`, `BETA`, and `GA`.  Note that this value might not be what was used as input. For example, if ALPHA was provided as input in the parent resource, but only BETA and GA-level features are were, this field will be BETA.",
          },
          service: {
            type: "string",
            description: "Output only. The name of the parent service.",
          },
          scaling: {
            type: "object",
            properties: {
              min_instance_count: {
                type: "integer",
                description:
                  "Optional. Minimum number of serving instances that this resource should have.",
              },
              max_instance_count: {
                type: "integer",
                description:
                  "Optional. Maximum number of serving instances that this resource should have. When unspecified, the field is set to the server default value of 100. For more information see https://cloud.google.com/run/docs/configuring/max-instances",
              },
            },
            description: "Settings for revision-level scaling settings.",
            additionalProperties: true,
          },
          vpc_access: {
            type: "object",
            properties: {
              connector: {
                type: "string",
                description:
                  "VPC Access connector name. Format: `projects/{project}/locations/{location}/connectors/{connector}`, where `{project}` can be project id or number. For more information on sending traffic to a VPC network via a connector, visit https://cloud.google.com/run/docs/configuring/vpc-connectors.",
              },
              egress: {
                type: "string",
                enum: [
                  "VPC_EGRESS_UNSPECIFIED",
                  "ALL_TRAFFIC",
                  "PRIVATE_RANGES_ONLY",
                ],
                description:
                  "Optional. Traffic VPC egress settings. If not provided, it defaults to PRIVATE_RANGES_ONLY.",
              },
              network_interfaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    network: {
                      type: "string",
                      description:
                        "Optional. The VPC network that the Cloud Run resource will be able to send traffic to. At least one of network or subnetwork must be specified. If both network and subnetwork are specified, the given VPC subnetwork must belong to the given VPC network. If network is not specified, it will be looked up from the subnetwork.",
                    },
                    subnetwork: {
                      type: "string",
                      description:
                        "Optional. The VPC subnetwork that the Cloud Run resource will get IPs from. At least one of network or subnetwork must be specified. If both network and subnetwork are specified, the given VPC subnetwork must belong to the given VPC network. If subnetwork is not specified, the subnetwork with the same name with the network will be used.",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Optional. Network tags applied to this Cloud Run resource.",
                    },
                  },
                  description: "Direct VPC egress settings.",
                  additionalProperties: true,
                },
                description:
                  "Optional. Direct VPC egress settings. Currently only single network interface is supported.",
              },
            },
            description:
              "VPC Access settings. For more information on sending traffic to a VPC network, visit https://cloud.google.com/run/docs/configuring/connecting-vpc.",
            additionalProperties: true,
          },
          max_instance_request_concurrency: {
            type: "integer",
            description:
              "Sets the maximum number of requests that each serving instance can receive.",
          },
          timeout: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          service_account: {
            type: "string",
            description:
              "Email address of the IAM service account associated with the revision of the service. The service account represents the identity of the running revision, and determines what permissions the revision has.",
          },
          containers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Name of the container specified as a DNS_LABEL (RFC 1123).",
                },
                image: {
                  type: "string",
                  description:
                    "Required. Name of the container image in Dockerhub, Google Artifact Registry, or Google Container Registry. If the host is not provided, Dockerhub is assumed.",
                },
                source_code: {
                  type: "object",
                  properties: {
                    cloud_storage_source: {
                      type: "object",
                      properties: {
                        bucket: {
                          type: "string",
                          description:
                            "Required. The Cloud Storage bucket name.",
                        },
                        object: {
                          type: "string",
                          description:
                            "Required. The Cloud Storage object name.",
                        },
                        generation: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      required: ["bucket", "object"],
                      description: "Cloud Storage source.",
                      additionalProperties: true,
                    },
                  },
                  description: "Source type for the container.",
                  additionalProperties: true,
                },
                command: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Entrypoint array. Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided.",
                },
                args: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Arguments to the entrypoint. The docker image's CMD is used if this is not provided.",
                },
                env: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "Required. Name of the environment variable. Must not exceed 32768 characters.",
                      },
                      value: {
                        type: "string",
                        description:
                          "Literal value of the environment variable. Defaults to \"\", and the maximum length is 32768 bytes. Variable references are not supported in Cloud Run. (Part of 'values' - only one field in this group can be set)",
                      },
                      value_source: {
                        type: "object",
                        properties: {
                          secret_key_ref: {
                            type: "object",
                            properties: {
                              secret: {
                                type: "string",
                                description:
                                  "Required. The name of the secret in Cloud Secret Manager. Format: {secret_name} if the secret is in the same project. projects/{project}/secrets/{secret_name} if the secret is in a different project.",
                              },
                              version: {
                                type: "string",
                                description:
                                  "The Cloud Secret Manager secret version. Can be 'latest' for the latest version, an integer for a specific version, or a version alias.",
                              },
                            },
                            required: ["secret"],
                            description:
                              "SecretEnvVarSource represents a source for the value of an EnvVar.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "EnvVarSource represents a source for the value of an EnvVar. (Part of 'values' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                    },
                    required: ["name"],
                    description:
                      "EnvVar represents an environment variable present in a Container.",
                    additionalProperties: true,
                  },
                  description:
                    "List of environment variables to set in the container.",
                },
                resources: {
                  type: "object",
                  properties: {
                    limits: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Only `memory`, `cpu` and `nvidia.com/gpu` keys in the map are supported.  <p>Notes:  * The only supported values for CPU are '1', '2', '4', and '8'. Setting 4 CPU requires at least 2Gi of memory. For more information, go to https://cloud.google.com/run/docs/configuring/cpu.   * For supported 'memory' values and syntax, go to  https://cloud.google.com/run/docs/configuring/memory-limits  * The only supported 'nvidia.com/gpu' value is '1'.",
                    },
                    cpu_idle: {
                      type: "boolean",
                      description:
                        "Determines whether CPU is only allocated during requests (true by default). However, if ResourceRequirements is set, the caller must explicitly set this field to true to preserve the default behavior.",
                    },
                    startup_cpu_boost: {
                      type: "boolean",
                      description:
                        "Determines whether CPU should be boosted on startup of a new container instance above the requested CPU threshold, this can help reduce cold-start latency.",
                    },
                  },
                  description:
                    "ResourceRequirements describes the compute resource requirements.",
                  additionalProperties: true,
                },
                ports: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          'If specified, used to specify which protocol to use. Allowed values are "http1" and "h2c".',
                      },
                      container_port: {
                        type: "integer",
                        description:
                          "Port number the container listens on. This must be a valid TCP port number, 0 < container_port < 65536.",
                      },
                    },
                    description:
                      "ContainerPort represents a network port in a single container.",
                    additionalProperties: true,
                  },
                  description:
                    "List of ports to expose from the container. Only a single port can be specified. The specified ports must be listening on all interfaces (0.0.0.0) within the container to be accessible.  If omitted, a port number will be chosen and passed to the container through the PORT environment variable for the container to listen on.",
                },
                volume_mounts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "Required. This must match the Name of a Volume.",
                      },
                      mount_path: {
                        type: "string",
                        description:
                          "Required. Path within the container at which the volume should be mounted. Must not contain ':'. For Cloud SQL volumes, it can be left empty, or must otherwise be `/cloudsql`. All instances defined in the Volume will be available as `/cloudsql/[instance]`. For more information on Cloud SQL volumes, visit https://cloud.google.com/sql/docs/mysql/connect-run",
                      },
                      sub_path: {
                        type: "string",
                        description:
                          "Optional. Path within the volume from which the container's volume should be mounted. Defaults to \"\" (volume's root).",
                      },
                    },
                    required: ["name", "mount_path"],
                    description:
                      "VolumeMount describes a mounting of a Volume within a container.",
                    additionalProperties: true,
                  },
                  description:
                    "Volume to mount into the container's filesystem.",
                },
                working_dir: {
                  type: "string",
                  description:
                    "Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image.",
                },
                liveness_probe: {
                  type: "object",
                  properties: {
                    initial_delay_seconds: {
                      type: "integer",
                      description:
                        "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240.",
                    },
                    timeout_seconds: {
                      type: "integer",
                      description:
                        "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds.",
                    },
                    period_seconds: {
                      type: "integer",
                      description:
                        "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds.",
                    },
                    failure_threshold: {
                      type: "integer",
                      description:
                        "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.",
                    },
                    http_get: {
                      type: "object",
                      properties: {
                        path: {
                          type: "string",
                          description:
                            "Optional. Path to access on the HTTP server. Defaults to '/'.",
                        },
                        http_headers: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                description: "Required. The header field name",
                              },
                              value: {
                                type: "string",
                                description: "Optional. The header field value",
                              },
                            },
                            required: ["name"],
                            description:
                              "HTTPHeader describes a custom header to be used in HTTP probes",
                            additionalProperties: true,
                          },
                          description:
                            "Optional. Custom headers to set in the request. HTTP allows repeated headers.",
                        },
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                      },
                      description:
                        "HTTPGetAction describes an action based on HTTP Get requests. (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    tcp_socket: {
                      type: "object",
                      properties: {
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                      },
                      description:
                        "TCPSocketAction describes an action based on opening a socket (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    grpc: {
                      type: "object",
                      properties: {
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                        service: {
                          type: "string",
                          description:
                            "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC.",
                        },
                      },
                      description:
                        "GRPCAction describes an action involving a GRPC port. (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.",
                  additionalProperties: true,
                },
                startup_probe: {
                  type: "object",
                  properties: {
                    initial_delay_seconds: {
                      type: "integer",
                      description:
                        "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240.",
                    },
                    timeout_seconds: {
                      type: "integer",
                      description:
                        "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds.",
                    },
                    period_seconds: {
                      type: "integer",
                      description:
                        "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds.",
                    },
                    failure_threshold: {
                      type: "integer",
                      description:
                        "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.",
                    },
                    http_get: {
                      type: "object",
                      properties: {
                        path: {
                          type: "string",
                          description:
                            "Optional. Path to access on the HTTP server. Defaults to '/'.",
                        },
                        http_headers: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                description: "Required. The header field name",
                              },
                              value: {
                                type: "string",
                                description: "Optional. The header field value",
                              },
                            },
                            required: ["name"],
                            description:
                              "HTTPHeader describes a custom header to be used in HTTP probes",
                            additionalProperties: true,
                          },
                          description:
                            "Optional. Custom headers to set in the request. HTTP allows repeated headers.",
                        },
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                      },
                      description:
                        "HTTPGetAction describes an action based on HTTP Get requests. (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    tcp_socket: {
                      type: "object",
                      properties: {
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                      },
                      description:
                        "TCPSocketAction describes an action based on opening a socket (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    grpc: {
                      type: "object",
                      properties: {
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                        service: {
                          type: "string",
                          description:
                            "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC.",
                        },
                      },
                      description:
                        "GRPCAction describes an action involving a GRPC port. (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.",
                  additionalProperties: true,
                },
                readiness_probe: {
                  type: "object",
                  properties: {
                    initial_delay_seconds: {
                      type: "integer",
                      description:
                        "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240.",
                    },
                    timeout_seconds: {
                      type: "integer",
                      description:
                        "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds.",
                    },
                    period_seconds: {
                      type: "integer",
                      description:
                        "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds.",
                    },
                    failure_threshold: {
                      type: "integer",
                      description:
                        "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.",
                    },
                    http_get: {
                      type: "object",
                      properties: {
                        path: {
                          type: "string",
                          description:
                            "Optional. Path to access on the HTTP server. Defaults to '/'.",
                        },
                        http_headers: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                description: "Required. The header field name",
                              },
                              value: {
                                type: "string",
                                description: "Optional. The header field value",
                              },
                            },
                            required: ["name"],
                            description:
                              "HTTPHeader describes a custom header to be used in HTTP probes",
                            additionalProperties: true,
                          },
                          description:
                            "Optional. Custom headers to set in the request. HTTP allows repeated headers.",
                        },
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                      },
                      description:
                        "HTTPGetAction describes an action based on HTTP Get requests. (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    tcp_socket: {
                      type: "object",
                      properties: {
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                      },
                      description:
                        "TCPSocketAction describes an action based on opening a socket (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    grpc: {
                      type: "object",
                      properties: {
                        port: {
                          type: "integer",
                          description:
                            "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort.",
                        },
                        service: {
                          type: "string",
                          description:
                            "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC.",
                        },
                      },
                      description:
                        "GRPCAction describes an action involving a GRPC port. (Part of 'probe_type' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.",
                  additionalProperties: true,
                },
                depends_on: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Names of the containers that must start before this container.",
                },
                base_image_uri: {
                  type: "string",
                  description:
                    "Base image for this container. Only supported for services. If set, it indicates that the service is enrolled into automatic base image update.",
                },
                build_info: {
                  type: "object",
                  properties: {
                    function_target: {
                      type: "string",
                      description:
                        "Output only. Entry point of the function when the image is a Cloud Run function.",
                    },
                    source_location: {
                      type: "string",
                      description:
                        "Output only. Source code location of the image.",
                    },
                  },
                  description: "Build information of the image.",
                  additionalProperties: true,
                },
              },
              required: ["image"],
              description:
                "A single application container. This specifies both the container to run, the command to run in the container and the arguments to supply to it. Note that additional arguments can be supplied by the system to the container at runtime.",
              additionalProperties: true,
            },
            description:
              "Holds the single container that defines the unit of execution for this Revision.",
          },
          volumes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Required. Volume's name.",
                },
                secret: {
                  type: "object",
                  properties: {
                    secret: {
                      type: "string",
                      description:
                        "Required. The name of the secret in Cloud Secret Manager. Format: {secret} if the secret is in the same project. projects/{project}/secrets/{secret} if the secret is in a different project.",
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          path: {
                            type: "string",
                            description:
                              "Required. The relative path of the secret in the container.",
                          },
                          version: {
                            type: "string",
                            description:
                              "The Cloud Secret Manager secret version. Can be 'latest' for the latest value, or an integer or a secret alias for a specific version.",
                          },
                          mode: {
                            type: "integer",
                            description:
                              "Integer octal mode bits to use on this file, must be a value between 01 and 0777 (octal). If 0 or not set, the Volume's default mode will be used.  Notes  * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.",
                          },
                        },
                        required: ["path"],
                        description:
                          "VersionToPath maps a specific version of a secret to a relative file to mount to, relative to VolumeMount's mount_path.",
                        additionalProperties: true,
                      },
                      description:
                        "If unspecified, the volume will expose a file whose name is the secret, relative to VolumeMount.mount_path + VolumeMount.sub_path. If specified, the key will be used as the version to fetch from Cloud Secret Manager and the path will be the name of the file exposed in the volume. When items are defined, they must specify a path and a version.",
                    },
                    default_mode: {
                      type: "integer",
                      description:
                        "Integer representation of mode bits to use on created files by default. Must be a value between 0000 and 0777 (octal), defaulting to 0444. Directories within the path are not affected by  this setting.  Notes  * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.  This might be in conflict with other options that affect the file mode, like fsGroup, and as a result, other mode bits could be set.",
                    },
                  },
                  required: ["secret"],
                  description:
                    "The secret's value will be presented as the content of a file whose name is defined in the item path. If no items are defined, the name of the file is the secret. (Part of 'volume_type' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                cloud_sql_instance: {
                  type: "object",
                  properties: {
                    instances: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The Cloud SQL instance connection names, as can be found in https://console.cloud.google.com/sql/instances. Visit https://cloud.google.com/sql/docs/mysql/connect-run for more information on how to connect Cloud SQL and Cloud Run. Format: {project}:{location}:{instance}",
                    },
                  },
                  description:
                    "Represents a set of Cloud SQL instances. Each one will be available under /cloudsql/[instance]. Visit https://cloud.google.com/sql/docs/mysql/connect-run for more information on how to connect Cloud SQL and Cloud Run. (Part of 'volume_type' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                empty_dir: {
                  type: "object",
                  properties: {
                    medium: {
                      type: "string",
                      enum: ["MEDIUM_UNSPECIFIED", "MEMORY"],
                      description:
                        "The medium on which the data is stored. Acceptable values today is only MEMORY or none. When none, the default will currently be backed by memory but could change over time. +optional",
                    },
                    size_limit: {
                      type: "string",
                      description:
                        "Limit on the storage usable by this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers. The default is nil which means that the limit is undefined. More info: https://cloud.google.com/run/docs/configuring/in-memory-volumes#configure-volume. Info in Kubernetes: https://kubernetes.io/docs/concepts/storage/volumes/#emptydir",
                    },
                  },
                  description:
                    "In memory (tmpfs) ephemeral storage. It is ephemeral in the sense that when the sandbox is taken down, the data is destroyed with it (it does not persist across sandbox runs). (Part of 'volume_type' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                nfs: {
                  type: "object",
                  properties: {
                    server: {
                      type: "string",
                      description: "Hostname or IP address of the NFS server",
                    },
                    path: {
                      type: "string",
                      description: "Path that is exported by the NFS server.",
                    },
                    read_only: {
                      type: "boolean",
                      description:
                        "If true, the volume will be mounted as read only for all mounts.",
                    },
                  },
                  description:
                    "Represents an NFS mount. (Part of 'volume_type' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                gcs: {
                  type: "object",
                  properties: {
                    bucket: {
                      type: "string",
                      description: "Cloud Storage Bucket name.",
                    },
                    read_only: {
                      type: "boolean",
                      description:
                        "If true, the volume will be mounted as read only for all mounts.",
                    },
                    mount_options: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'A list of additional flags to pass to the gcsfuse CLI. Options should be specified without the leading "--".',
                    },
                  },
                  description:
                    "Represents a volume backed by a Cloud Storage bucket using Cloud Storage FUSE. (Part of 'volume_type' - only one field in this group can be set)",
                  additionalProperties: true,
                },
              },
              required: ["name"],
              description: "Volume represents a named volume in a container.",
              additionalProperties: true,
            },
            description: "A list of Volumes to make available to containers.",
          },
          execution_environment: {
            type: "string",
            enum: [
              "EXECUTION_ENVIRONMENT_UNSPECIFIED",
              "EXECUTION_ENVIRONMENT_GEN1",
              "EXECUTION_ENVIRONMENT_GEN2",
            ],
            description: "Alternatives for execution environments.",
          },
          encryption_key: {
            type: "string",
            description:
              "A reference to a customer managed encryption key (CMEK) to use to encrypt this container image. For more information, go to https://cloud.google.com/run/docs/securing/using-cmek",
          },
          service_mesh: {
            type: "object",
            properties: {
              mesh: {
                type: "string",
                description:
                  "The Mesh resource name. Format: `projects/{project}/locations/global/meshes/{mesh}`, where `{project}` can be project id or number.",
              },
            },
            description:
              "Settings for Cloud Service Mesh. For more information see https://cloud.google.com/service-mesh/docs/overview.",
            additionalProperties: true,
          },
          encryption_key_revocation_action: {
            type: "string",
            enum: [
              "ENCRYPTION_KEY_REVOCATION_ACTION_UNSPECIFIED",
              "PREVENT_NEW",
              "SHUTDOWN",
            ],
            description:
              "Specifies behavior if an encryption key used by a resource is revoked.",
          },
          encryption_key_shutdown_duration: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          reconciling: {
            type: "boolean",
            description:
              "Output only. Indicates whether the resource's reconciliation is still in progress. See comments in `Service.reconciling` for additional information on reconciliation process in Cloud Run.",
          },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description:
                    'type is used to communicate the status of the reconciliation process. See also: https://github.com/knative/serving/blob/main/docs/spec/errors.md#error-conditions-and-reporting Types common to all resources include: * "Ready": True when the Resource is ready.',
                },
                state: {
                  type: "string",
                  enum: [
                    "STATE_UNSPECIFIED",
                    "CONDITION_PENDING",
                    "CONDITION_RECONCILING",
                    "CONDITION_FAILED",
                    "CONDITION_SUCCEEDED",
                  ],
                  description: "State of the condition.",
                },
                message: {
                  type: "string",
                  description:
                    "Human readable message indicating details about the current status.",
                },
                last_transition_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                severity: {
                  type: "string",
                  enum: ["SEVERITY_UNSPECIFIED", "ERROR", "WARNING", "INFO"],
                  description:
                    "How to interpret failures of this condition, one of Error, Warning, Info",
                },
                reason: {
                  type: "string",
                  enum: [
                    "COMMON_REASON_UNDEFINED",
                    "UNKNOWN",
                    "REVISION_FAILED",
                    "PROGRESS_DEADLINE_EXCEEDED",
                    "CONTAINER_MISSING",
                    "CONTAINER_PERMISSION_DENIED",
                    "CONTAINER_IMAGE_UNAUTHORIZED",
                    "CONTAINER_IMAGE_AUTHORIZATION_CHECK_FAILED",
                    "ENCRYPTION_KEY_PERMISSION_DENIED",
                    "ENCRYPTION_KEY_CHECK_FAILED",
                    "SECRETS_ACCESS_CHECK_FAILED",
                    "WAITING_FOR_OPERATION",
                    "IMMEDIATE_RETRY",
                    "POSTPONED_RETRY",
                    "INTERNAL",
                    "VPC_NETWORK_NOT_FOUND",
                  ],
                  description:
                    "Output only. A common (service-level) reason for this condition. (Part of 'reasons' - only one field in this group can be set)",
                },
                revision_reason: {
                  type: "string",
                  enum: [
                    "REVISION_REASON_UNDEFINED",
                    "PENDING",
                    "RESERVE",
                    "RETIRED",
                    "RETIRING",
                    "RECREATING",
                    "HEALTH_CHECK_CONTAINER_ERROR",
                    "CUSTOMIZED_PATH_RESPONSE_PENDING",
                    "MIN_INSTANCES_NOT_PROVISIONED",
                    "ACTIVE_REVISION_LIMIT_REACHED",
                    "NO_DEPLOYMENT",
                    "HEALTH_CHECK_SKIPPED",
                    "MIN_INSTANCES_WARMING",
                  ],
                  description:
                    "Output only. A reason for the revision condition. (Part of 'reasons' - only one field in this group can be set)",
                },
                execution_reason: {
                  type: "string",
                  enum: [
                    "EXECUTION_REASON_UNDEFINED",
                    "JOB_STATUS_SERVICE_POLLING_ERROR",
                    "NON_ZERO_EXIT_CODE",
                    "CANCELLED",
                    "CANCELLING",
                    "DELETED",
                    "DELAYED_START_PENDING",
                  ],
                  description:
                    "Output only. A reason for the execution condition. (Part of 'reasons' - only one field in this group can be set)",
                },
              },
              description: "Defines a status condition for a resource.",
              additionalProperties: true,
            },
            description:
              "Output only. The Condition of this Revision, containing its readiness status, and detailed error information in case it did not reach a serving state.",
          },
          observed_generation: {
            type: "string",
            description: "64-bit integer as string",
          },
          log_uri: {
            type: "string",
            description:
              "Output only. The Google Console URI to obtain logs for the Revision.",
          },
          satisfies_pzs: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
          },
          session_affinity: {
            type: "boolean",
            description: "Enable session affinity.",
          },
          scaling_status: {
            type: "object",
            properties: {
              desired_min_instance_count: {
                type: "integer",
                description:
                  "The current number of min instances provisioned for this revision.",
              },
            },
            description: "Effective settings for the current revision",
            additionalProperties: true,
          },
          node_selector: {
            type: "object",
            properties: {
              accelerator: {
                type: "string",
                description:
                  "Required. GPU accelerator type to attach to an instance.",
              },
            },
            required: ["accelerator"],
            description: "Hardware constraints configuration.",
            additionalProperties: true,
          },
          gpu_zonal_redundancy_disabled: {
            type: "boolean",
            description:
              "Optional. Output only. True if GPU zonal redundancy is disabled on this revision.",
          },
          creator: {
            type: "string",
            description:
              "Output only. Email address of the authenticated creator.",
          },
          etag: {
            type: "string",
            description:
              "Output only. A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
          },
        },
        description:
          "A Revision is an immutable snapshot of code and configuration.  A Revision references a container image. Revisions are only created by updates to its parent Service.",
        additionalProperties: true,
      },
    },
  },
};

export default getRevision;
