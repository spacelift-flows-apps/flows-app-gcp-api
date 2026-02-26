import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getServicesClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const createService: AppBlock = {
  name: "Create Service",
  description: `Creates a new Service in a given project and location.`,
  category: "Services",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The location and project in which this service should be created. Format: projects/{project}/locations/{location}, where {project} can be project id or number. Only lowercase characters, digits, and hyphens.",
          type: {
            type: "string",
            description:
              "Required. The location and project in which this service should be created. Format: projects/{project}/locations/{location}, where {project} can be project id or number. Only lowercase characters, digits, and hyphens.",
          },
          required: true,
        },
        service: {
          name: "Service",
          description: "Required. The Service instance to create.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. The fully qualified name of this Service. In CreateServiceRequest, this field is ignored, and instead composed from CreateServiceRequest.parent and CreateServiceRequest.service_id.  Format: projects/{project}/locations/{location}/services/{service_id}",
              },
              description: {
                type: "string",
                description:
                  "User-provided description of the Service. This field currently has a 512-character limit.",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Optional. Unstructured key value map that can be used to organize and categorize objects. User-provided labels are shared with Google's billing system, so they can be used to filter, or break down billing charges by team, component, environment, state, etc. For more information, visit https://cloud.google.com/resource-manager/docs/creating-managing-labels or https://cloud.google.com/run/docs/configuring/labels.  <p>Cloud Run API v2 does not support labels with  `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system labels in v1 now have a corresponding field in v2 Service.",
              },
              annotations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Optional. Unstructured key value map that may be set by external tools to store and arbitrary metadata. They are not queryable and should be preserved when modifying objects.  <p>Cloud Run API v2 does not support annotations with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected in new resources. All system annotations in v1 now have a corresponding field in v2 Service.  <p>This field follows Kubernetes annotations' namespacing, limits, and rules.",
              },
              client: {
                type: "string",
                description: "Arbitrary identifier for the API client.",
              },
              client_version: {
                type: "string",
                description: "Arbitrary version identifier for the API client.",
              },
              ingress: {
                type: "string",
                enum: [
                  "INGRESS_TRAFFIC_UNSPECIFIED",
                  "INGRESS_TRAFFIC_ALL",
                  "INGRESS_TRAFFIC_INTERNAL_ONLY",
                  "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER",
                  "INGRESS_TRAFFIC_NONE",
                ],
                description: "Allowed ingress traffic for the Container.",
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
                  "Optional. The launch stage as defined by [Google Cloud Platform Launch Stages](https://cloud.google.com/terms/launch-stages). Cloud Run supports `ALPHA`, `BETA`, and `GA`. If no value is specified, GA is assumed. Set the launch stage to a preview stage on input to allow use of preview features in that stage. On read (or output), describes whether the resource uses preview features.  For example, if ALPHA is provided as input, but only BETA and GA-level features are used, this field will be BETA on output.",
              },
              binary_authorization: {
                type: "object",
                properties: {
                  use_default: {
                    type: "boolean",
                    description:
                      "Optional. If True, indicates to use the default project's binary authorization policy. If False, binary authorization will be disabled. (Part of 'binauthz_method' - only one field in this group can be set)",
                  },
                  policy: {
                    type: "string",
                    description:
                      "Optional. The path to a binary authorization policy. Format: `projects/{project}/platforms/cloudRun/{policy-name}` (Part of 'binauthz_method' - only one field in this group can be set)",
                  },
                  breakglass_justification: {
                    type: "string",
                    description:
                      "Optional. If present, indicates to use Breakglass using this justification. If use_default is False, then it must be empty. For more information on breakglass, see https://cloud.google.com/binary-authorization/docs/using-breakglass",
                  },
                },
                description: "Settings for Binary Authorization feature.",
                additionalProperties: true,
              },
              template: {
                type: "object",
                properties: {
                  revision: {
                    type: "string",
                    description:
                      "Optional. The unique name for the revision. If this field is omitted, it will be automatically generated based on the Service name.",
                  },
                  labels: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Optional. Unstructured key value map that can be used to organize and categorize objects. User-provided labels are shared with Google's billing system, so they can be used to filter, or break down billing charges by team, component, environment, state, etc. For more information, visit https://cloud.google.com/resource-manager/docs/creating-managing-labels or https://cloud.google.com/run/docs/configuring/labels.  <p>Cloud Run API v2 does not support labels with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system labels in v1 now have a corresponding field in v2 RevisionTemplate.",
                  },
                  annotations: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Optional. Unstructured key value map that may be set by external tools to store and arbitrary metadata. They are not queryable and should be preserved when modifying objects.  <p>Cloud Run API v2 does not support annotations with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system annotations in v1 now have a corresponding field in v2 RevisionTemplate.  <p>This field follows Kubernetes annotations' namespacing, limits, and rules.",
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
                    description:
                      "Settings for revision-level scaling settings.",
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
                  timeout: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                  service_account: {
                    type: "string",
                    description:
                      "Optional. Email address of the IAM service account associated with the revision of the service. The service account represents the identity of the running revision, and determines what permissions the revision has. If not provided, the revision will use the project's default service account.",
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
                                        description:
                                          "Required. The header field name",
                                      },
                                      value: {
                                        type: "string",
                                        description:
                                          "Optional. The header field value",
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
                                        description:
                                          "Required. The header field name",
                                      },
                                      value: {
                                        type: "string",
                                        description:
                                          "Optional. The header field value",
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
                                        description:
                                          "Required. The header field name",
                                      },
                                      value: {
                                        type: "string",
                                        description:
                                          "Optional. The header field value",
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
                              description:
                                "Hostname or IP address of the NFS server",
                            },
                            path: {
                              type: "string",
                              description:
                                "Path that is exported by the NFS server.",
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
                      description:
                        "Volume represents a named volume in a container.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. A list of Volumes to make available to containers.",
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
                  max_instance_request_concurrency: {
                    type: "integer",
                    description:
                      "Optional. Sets the maximum number of requests that each serving instance can receive. If not specified or 0, concurrency defaults to 80 when requested `CPU >= 1` and defaults to 1 when requested `CPU < 1`.",
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
                  session_affinity: {
                    type: "boolean",
                    description: "Optional. Enable session affinity.",
                  },
                  health_check_disabled: {
                    type: "boolean",
                    description:
                      "Optional. Disables health checking containers during deployment.",
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
                      "Optional. True if GPU zonal redundancy is disabled on this revision.",
                  },
                },
                description:
                  "RevisionTemplate describes the data a revision should have when created from a template.",
                additionalProperties: true,
              },
              traffic: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: [
                        "TRAFFIC_TARGET_ALLOCATION_TYPE_UNSPECIFIED",
                        "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST",
                        "TRAFFIC_TARGET_ALLOCATION_TYPE_REVISION",
                      ],
                      description: "The type of instance allocation.",
                    },
                    revision: {
                      type: "string",
                      description:
                        "Revision to which to send this portion of traffic, if traffic allocation is by revision.",
                    },
                    percent: {
                      type: "integer",
                      description:
                        "Specifies percent of the traffic to this Revision. This defaults to zero if unspecified.",
                    },
                    tag: {
                      type: "string",
                      description:
                        "Indicates a string to be part of the URI to exclusively reference this target.",
                    },
                  },
                  description:
                    "Holds a single traffic routing entry for the Service. Allocations can be done to a specific Revision name, or pointing to the latest Ready Revision.",
                  additionalProperties: true,
                },
                description:
                  "Optional. Specifies how to distribute traffic over a collection of Revisions belonging to the Service. If traffic is empty or not provided, defaults to 100% traffic to the latest `Ready` Revision.",
              },
              scaling: {
                type: "object",
                properties: {
                  min_instance_count: {
                    type: "integer",
                    description:
                      "Optional. total min instances for the service. This number of instances is divided among all revisions with specified traffic based on the percent of traffic they are receiving.",
                  },
                  scaling_mode: {
                    type: "string",
                    enum: ["SCALING_MODE_UNSPECIFIED", "AUTOMATIC", "MANUAL"],
                    description: "Optional. The scaling mode for the service.",
                  },
                  max_instance_count: {
                    type: "integer",
                    description:
                      "Optional. total max instances for the service. This number of instances is divided among all revisions with specified traffic based on the percent of traffic they are receiving.",
                  },
                  manual_instance_count: {
                    type: "integer",
                    description:
                      "Optional. total instance count for the service in manual scaling mode. This number of instances is divided among all revisions with specified traffic based on the percent of traffic they are receiving.",
                  },
                },
                description:
                  "Scaling settings applied at the service level rather than at the revision level.",
                additionalProperties: true,
              },
              invoker_iam_disabled: {
                type: "boolean",
                description:
                  "Optional. Disables IAM permission check for run.routes.invoke for callers of this service. For more information, visit https://cloud.google.com/run/docs/securing/managing-access#invoker_check.",
              },
              default_uri_disabled: {
                type: "boolean",
                description:
                  "Optional. Disables public resolution of the default URI of this service.",
              },
              iap_enabled: {
                type: "boolean",
                description: "Optional. IAP settings on the Service.",
              },
              multi_region_settings: {
                type: "object",
                properties: {
                  regions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Required. List of regions to deploy to, including primary region.",
                  },
                  multi_region_id: {
                    type: "string",
                    description:
                      "Optional. System-generated unique id for the multi-region Service.",
                  },
                },
                required: ["regions"],
                description: "Settings for multi-region deployment.",
                additionalProperties: true,
              },
              custom_audiences: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "One or more custom audiences that you want this service to support. Specify each custom audience as the full URL in a string. The custom audiences are encoded in the token and used to authenticate requests. For more information, see https://cloud.google.com/run/docs/configuring/custom-audiences.",
              },
              build_config: {
                type: "object",
                properties: {
                  source_location: {
                    type: "string",
                    description:
                      "The Cloud Storage bucket URI where the function source code is located.",
                  },
                  function_target: {
                    type: "string",
                    description:
                      'Optional. The name of the function (as defined in source code) that will be executed. Defaults to the resource name suffix, if not specified. For backward compatibility, if function with given name is not found, then the system will try to use function named "function".',
                  },
                  image_uri: {
                    type: "string",
                    description:
                      "Optional. Artifact Registry URI to store the built image.",
                  },
                  base_image: {
                    type: "string",
                    description:
                      "Optional. The base image used to build the function.",
                  },
                  enable_automatic_updates: {
                    type: "boolean",
                    description:
                      "Optional. Sets whether the function will receive automatic base image updates.",
                  },
                  worker_pool: {
                    type: "string",
                    description:
                      "Optional. Name of the Cloud Build Custom Worker Pool that should be used to build the Cloud Run function. The format of this field is `projects/{project}/locations/{region}/workerPools/{workerPool}` where `{project}` and `{region}` are the project id and region respectively where the worker pool is defined and `{workerPool}` is the short name of the worker pool.",
                  },
                  environment_variables: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Optional. User-provided build-time environment variables for the function",
                  },
                  service_account: {
                    type: "string",
                    description:
                      "Optional. Service account to be used for building the container. The format of this field is `projects/{projectId}/serviceAccounts/{serviceAccountEmail}`.",
                  },
                },
                description:
                  "Describes the Build step of the function that builds a container from the given source.",
                additionalProperties: true,
              },
              etag: {
                type: "string",
                description:
                  "Optional. A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
              },
            },
            required: ["template"],
            description:
              "Service acts as a top-level container that manages a set of configurations and revision templates which implement a network service. Service exists to provide a singular abstraction which can be access controlled, reasoned about, and which encapsulates software lifecycle decisions such as rollout policy and team resource ownership.",
            additionalProperties: true,
          },
          required: true,
        },
        service_id: {
          name: "Service Id",
          description:
            "Required. The unique identifier for the Service. It must begin with letter, and cannot end with hyphen; must contain fewer than 50 characters. The name of the service becomes {parent}/services/{service_id}.",
          type: {
            type: "string",
            description:
              "Required. The unique identifier for the Service. It must begin with letter, and cannot end with hyphen; must contain fewer than 50 characters. The name of the service becomes {parent}/services/{service_id}.",
          },
          required: true,
        },
        validate_only: {
          name: "Validate Only",
          description:
            "Indicates that the request should be validated and default values populated, without persisting the request or creating any resources.",
          type: {
            type: "boolean",
            description:
              "Indicates that the request should be validated and default values populated, without persisting the request or creating any resources.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getServicesClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.service !== undefined)
          request.service = input.event.inputConfig.service;
        if (input.event.inputConfig.service_id !== undefined)
          request.service_id = input.event.inputConfig.service_id;
        if (input.event.inputConfig.validate_only !== undefined)
          request.validate_only = input.event.inputConfig.validate_only;

        const routingParams: Record<string, string> = {};
        if (request.parent !== undefined) {
          const m = String(request.parent).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.createService(request, metadata, (err: any, response: any) => {
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
          },
          metadata: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
          },
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type_url: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createService;
