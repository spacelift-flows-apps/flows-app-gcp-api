import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getInstancesClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  instance: {
    name: "instance",
    fields: {
      clientVersion: "client_version",
      launchStage: "launch_stage",
      binaryAuthorization: {
        name: "binary_authorization",
        fields: {
          useDefault: "use_default",
          breakglassJustification: "breakglass_justification",
        },
      },
      vpcAccess: {
        name: "vpc_access",
        fields: {
          networkInterfaces: "network_interfaces",
        },
      },
      serviceAccount: "service_account",
      containers: {
        name: "containers",
        fields: {
          sourceCode: {
            name: "source_code",
            fields: {
              cloudStorageSource: "cloud_storage_source",
            },
          },
          env: {
            name: "env",
            fields: {
              valueSource: {
                name: "value_source",
                fields: {
                  secretKeyRef: "secret_key_ref",
                },
              },
            },
          },
          resources: {
            name: "resources",
            fields: {
              cpuIdle: "cpu_idle",
              startupCpuBoost: "startup_cpu_boost",
            },
          },
          ports: {
            name: "ports",
            fields: {
              containerPort: "container_port",
            },
          },
          volumeMounts: {
            name: "volume_mounts",
            fields: {
              mountPath: "mount_path",
              subPath: "sub_path",
            },
          },
          workingDir: "working_dir",
          livenessProbe: {
            name: "liveness_probe",
            fields: {
              initialDelaySeconds: "initial_delay_seconds",
              timeoutSeconds: "timeout_seconds",
              periodSeconds: "period_seconds",
              failureThreshold: "failure_threshold",
              httpGet: {
                name: "http_get",
                fields: {
                  httpHeaders: "http_headers",
                },
              },
              tcpSocket: "tcp_socket",
            },
          },
          startupProbe: {
            name: "startup_probe",
            fields: {
              initialDelaySeconds: "initial_delay_seconds",
              timeoutSeconds: "timeout_seconds",
              periodSeconds: "period_seconds",
              failureThreshold: "failure_threshold",
              httpGet: {
                name: "http_get",
                fields: {
                  httpHeaders: "http_headers",
                },
              },
              tcpSocket: "tcp_socket",
            },
          },
          readinessProbe: {
            name: "readiness_probe",
            fields: {
              initialDelaySeconds: "initial_delay_seconds",
              timeoutSeconds: "timeout_seconds",
              periodSeconds: "period_seconds",
              failureThreshold: "failure_threshold",
              httpGet: {
                name: "http_get",
                fields: {
                  httpHeaders: "http_headers",
                },
              },
              tcpSocket: "tcp_socket",
            },
          },
          dependsOn: "depends_on",
          baseImageUri: "base_image_uri",
        },
      },
      volumes: {
        name: "volumes",
        fields: {
          secret: {
            name: "secret",
            fields: {
              defaultMode: "default_mode",
            },
          },
          cloudSqlInstance: "cloud_sql_instance",
          emptyDir: {
            name: "empty_dir",
            fields: {
              sizeLimit: "size_limit",
            },
          },
          nfs: {
            name: "nfs",
            fields: {
              readOnly: "read_only",
            },
          },
          gcs: {
            name: "gcs",
            fields: {
              readOnly: "read_only",
              mountOptions: "mount_options",
            },
          },
        },
      },
      encryptionKey: "encryption_key",
      encryptionKeyRevocationAction: "encryption_key_revocation_action",
      encryptionKeyShutdownDuration: "encryption_key_shutdown_duration",
      nodeSelector: "node_selector",
      gpuZonalRedundancyDisabled: "gpu_zonal_redundancy_disabled",
      invokerIamDisabled: "invoker_iam_disabled",
      iapEnabled: "iap_enabled",
    },
  },
  instanceId: "instance_id",
  validateOnly: "validate_only",
};

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

const createInstance: AppBlock = {
  name: "Create Instance",
  description: `Creates an Instance.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description: "Parent field",
          type: {
            type: "string",
          },
          required: true,
        },
        instance: {
          name: "Instance",
          description: "Instance field",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "The fully qualified name of this Instance. In CreateInstanceRequest, this field is ignored, and instead composed from CreateInstanceRequest.parent and CreateInstanceRequest.instance_id.  Format: projects/{project}/locations/{location}/instances/{instance_id}",
              },
              description: {
                type: "string",
                description:
                  "User-provided description of the Instance. This field currently has a 512-character limit.",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              annotations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              client: {
                type: "string",
                description: "Arbitrary identifier for the API client.",
              },
              clientVersion: {
                type: "string",
                description: "Arbitrary version identifier for the API client.",
              },
              launchStage: {
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
                  "The launch stage as defined by [Google Cloud Platform  Launch Stages](https://cloud.google.com/terms/launch-stages).  Cloud Run supports `ALPHA`, `BETA`, and `GA`. If no value is specified, GA  is assumed.  Set the launch stage to a preview stage on input to allow use of preview  features in that stage. On read (or output), describes whether the  resource uses preview features. <p>  For example, if ALPHA is provided as input, but only BETA and GA-level  features are used, this field will be BETA on output.",
              },
              binaryAuthorization: {
                type: "object",
                properties: {
                  useDefault: {
                    type: "boolean",
                    description:
                      "Optional. If True, indicates to use the default project's binary authorization policy. If False, binary authorization will be disabled. (Part of 'binauthz_method' - only one field in this group can be set)",
                  },
                  policy: {
                    type: "string",
                    description:
                      "Optional. The path to a binary authorization policy. Format: `projects/{project}/platforms/cloudRun/{policy-name}` (Part of 'binauthz_method' - only one field in this group can be set)",
                  },
                  breakglassJustification: {
                    type: "string",
                    description:
                      "Optional. If present, indicates to use Breakglass using this justification. If use_default is False, then it must be empty. For more information on breakglass, see https://cloud.google.com/binary-authorization/docs/using-breakglass",
                  },
                },
                description: "Settings for Binary Authorization feature.",
                additionalProperties: true,
              },
              vpcAccess: {
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
                  networkInterfaces: {
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
              serviceAccount: {
                type: "string",
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
                    sourceCode: {
                      type: "object",
                      properties: {
                        cloudStorageSource: {
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
                          valueSource: {
                            type: "object",
                            properties: {
                              secretKeyRef: {
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
                        cpuIdle: {
                          type: "boolean",
                          description:
                            "Determines whether CPU is only allocated during requests (true by default). However, if ResourceRequirements is set, the caller must explicitly set this field to true to preserve the default behavior.",
                        },
                        startupCpuBoost: {
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
                          containerPort: {
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
                    volumeMounts: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description:
                              "Required. This must match the Name of a Volume.",
                          },
                          mountPath: {
                            type: "string",
                            description:
                              "Required. Path within the container at which the volume should be mounted. Must not contain ':'. For Cloud SQL volumes, it can be left empty, or must otherwise be `/cloudsql`. All instances defined in the Volume will be available as `/cloudsql/[instance]`. For more information on Cloud SQL volumes, visit https://cloud.google.com/sql/docs/mysql/connect-run",
                          },
                          subPath: {
                            type: "string",
                            description:
                              "Optional. Path within the volume from which the container's volume should be mounted. Defaults to \"\" (volume's root).",
                          },
                        },
                        required: ["name", "mountPath"],
                        description:
                          "VolumeMount describes a mounting of a Volume within a container.",
                        additionalProperties: true,
                      },
                      description:
                        "Volume to mount into the container's filesystem.",
                    },
                    workingDir: {
                      type: "string",
                      description:
                        "Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image.",
                    },
                    livenessProbe: {
                      type: "object",
                      properties: {
                        initialDelaySeconds: {
                          type: "integer",
                          description:
                            "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240.",
                        },
                        timeoutSeconds: {
                          type: "integer",
                          description:
                            "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds.",
                        },
                        periodSeconds: {
                          type: "integer",
                          description:
                            "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds.",
                        },
                        failureThreshold: {
                          type: "integer",
                          description:
                            "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.",
                        },
                        httpGet: {
                          type: "object",
                          properties: {
                            path: {
                              type: "string",
                              description:
                                "Optional. Path to access on the HTTP server. Defaults to '/'.",
                            },
                            httpHeaders: {
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
                        tcpSocket: {
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
                    startupProbe: {
                      type: "object",
                      properties: {
                        initialDelaySeconds: {
                          type: "integer",
                          description:
                            "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240.",
                        },
                        timeoutSeconds: {
                          type: "integer",
                          description:
                            "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds.",
                        },
                        periodSeconds: {
                          type: "integer",
                          description:
                            "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds.",
                        },
                        failureThreshold: {
                          type: "integer",
                          description:
                            "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.",
                        },
                        httpGet: {
                          type: "object",
                          properties: {
                            path: {
                              type: "string",
                              description:
                                "Optional. Path to access on the HTTP server. Defaults to '/'.",
                            },
                            httpHeaders: {
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
                        tcpSocket: {
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
                    readinessProbe: {
                      type: "object",
                      properties: {
                        initialDelaySeconds: {
                          type: "integer",
                          description:
                            "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240.",
                        },
                        timeoutSeconds: {
                          type: "integer",
                          description:
                            "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds.",
                        },
                        periodSeconds: {
                          type: "integer",
                          description:
                            "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds.",
                        },
                        failureThreshold: {
                          type: "integer",
                          description:
                            "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.",
                        },
                        httpGet: {
                          type: "object",
                          properties: {
                            path: {
                              type: "string",
                              description:
                                "Optional. Path to access on the HTTP server. Defaults to '/'.",
                            },
                            httpHeaders: {
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
                        tcpSocket: {
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
                    dependsOn: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Names of the containers that must start before this container.",
                    },
                    baseImageUri: {
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
                  "Required. Holds the single container that defines the unit of execution for this Instance.",
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
                        defaultMode: {
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
                    cloudSqlInstance: {
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
                    emptyDir: {
                      type: "object",
                      properties: {
                        medium: {
                          type: "string",
                          enum: ["MEDIUM_UNSPECIFIED", "MEMORY"],
                          description:
                            "The medium on which the data is stored. Acceptable values today is only MEMORY or none. When none, the default will currently be backed by memory but could change over time. +optional",
                        },
                        sizeLimit: {
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
                        readOnly: {
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
                        readOnly: {
                          type: "boolean",
                          description:
                            "If true, the volume will be mounted as read only for all mounts.",
                        },
                        mountOptions: {
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
                  "A list of Volumes to make available to containers.",
              },
              encryptionKey: {
                type: "string",
                description:
                  "A reference to a customer managed encryption key (CMEK) to use to encrypt this container image. For more information, go to https://cloud.google.com/run/docs/securing/using-cmek",
              },
              encryptionKeyRevocationAction: {
                type: "string",
                enum: [
                  "ENCRYPTION_KEY_REVOCATION_ACTION_UNSPECIFIED",
                  "PREVENT_NEW",
                  "SHUTDOWN",
                ],
                description:
                  "Specifies behavior if an encryption key used by a resource is revoked.",
              },
              encryptionKeyShutdownDuration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              nodeSelector: {
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
              gpuZonalRedundancyDisabled: {
                type: "boolean",
                description:
                  "Optional. True if GPU zonal redundancy is disabled on this instance.",
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
              invokerIamDisabled: {
                type: "boolean",
                description:
                  "Optional. Disables IAM permission check for run.routes.invoke for callers of this Instance. For more information, visit https://cloud.google.com/run/docs/securing/managing-access#invoker_check.",
              },
              iapEnabled: {
                type: "boolean",
                description: "Optional. IAP settings on the Instance.",
              },
              etag: {
                type: "string",
                description:
                  "Optional. A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
              },
            },
            required: ["containers"],
            description:
              "A Cloud Run Instance represents a single group of containers running in a region.",
            additionalProperties: true,
          },
          required: true,
        },
        instanceId: {
          name: "Instance Id",
          description:
            "Required. The unique identifier for the Instance. It must begin with letter, and cannot end with hyphen; must contain fewer than 50 characters. The name of the instance becomes {parent}/instances/{instance_id}.",
          type: {
            type: "string",
            description:
              "Required. The unique identifier for the Instance. It must begin with letter, and cannot end with hyphen; must contain fewer than 50 characters. The name of the instance becomes {parent}/instances/{instance_id}.",
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "Optional. Indicates that the request should be validated and default values populated, without persisting the request or creating any resources.",
          type: {
            type: "boolean",
            description:
              "Optional. Indicates that the request should be validated and default values populated, without persisting the request or creating any resources.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getInstancesClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.parent !== undefined) {
          const m = String(request.parent).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.createInstance(
            request,
            metadata,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
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
              typeUrl: {
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
                    typeUrl: {
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
              typeUrl: {
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

export default createInstance;
