import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const jobsCreate: AppBlock = {
  name: "Jobs - Create",
  description: `Creates a Job.`,
  category: "Jobs",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The location and project in which this Job should be created. Format: projects/{project}/locations/{location}, where {project} can be project id or number.",
          type: {
            type: "string",
          },
          required: true,
        },
        jobId: {
          name: "Job ID",
          description:
            "Required. The unique identifier for the Job. The name of the job becomes {parent}/jobs/{job_id}.",
          type: {
            type: "string",
          },
          required: false,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "Indicates that the request should be validated and default values populated, without persisting the request or creating any resources.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "The fully qualified name of this Job.",
          type: {
            type: "string",
            description:
              "The fully qualified name of this Job. Format: projects/{project}/locations/{location}/jobs/{job}",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "Unstructured key value map that can be used to organize and categorize objects.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Unstructured key value map that can be used to organize and categorize objects. User-provided labels are shared with Google's billing system, so they can be used to filter, or break down billing charges by team, component, environment, state, etc. For more information, visit https://cloud.google.com/resource-manager/docs/creating-managing-labels or https://cloud.google.com/run/docs/configuring/labels. Cloud Run API v2 does not support labels with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system labels in v1 now have a corresponding field in v2 Job.",
          },
          required: false,
        },
        annotations: {
          name: "Annotations",
          description:
            "Unstructured key value map that may be set by external tools to store and arbitrary metadata.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Unstructured key value map that may be set by external tools to store and arbitrary metadata. They are not queryable and should be preserved when modifying objects. Cloud Run API v2 does not support annotations with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected on new resources. All system annotations in v1 now have a corresponding field in v2 Job. This field follows Kubernetes annotations' namespacing, limits, and rules.",
          },
          required: false,
        },
        client: {
          name: "Client",
          description: "Arbitrary identifier for the API client.",
          type: {
            type: "string",
            description: "Arbitrary identifier for the API client.",
          },
          required: false,
        },
        clientVersion: {
          name: "Client Version",
          description: "Arbitrary version identifier for the API client.",
          type: {
            type: "string",
            description: "Arbitrary version identifier for the API client.",
          },
          required: false,
        },
        launchStage: {
          name: "Launch Stage",
          description:
            "The launch stage as defined by [Google Cloud Platform Launch Stages](https://cloud.",
          type: {
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
              "The launch stage as defined by [Google Cloud Platform Launch Stages](https://cloud.google.com/terms/launch-stages). Cloud Run supports `ALPHA`, `BETA`, and `GA`. If no value is specified, GA is assumed. Set the launch stage to a preview stage on input to allow use of preview features in that stage. On read (or output), describes whether the resource uses preview features. For example, if ALPHA is provided as input, but only BETA and GA-level features are used, this field will be BETA on output.",
          },
          required: false,
        },
        binaryAuthorization: {
          name: "Binary Authorization",
          description: "Settings for the Binary Authorization feature.",
          type: {
            type: "object",
            properties: {
              useDefault: {
                type: "boolean",
                description:
                  "Optional. If True, indicates to use the default project's binary authorization policy. If False, binary authorization will be disabled.",
              },
              policy: {
                type: "string",
                description:
                  "Optional. The path to a binary authorization policy. Format: `projects/{project}/platforms/cloudRun/{policy-name}`",
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
          required: false,
        },
        template: {
          name: "Template",
          description: "Required.",
          type: {
            type: "object",
            properties: {
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Unstructured key value map that can be used to organize and categorize objects. User-provided labels are shared with Google's billing system, so they can be used to filter, or break down billing charges by team, component, environment, state, etc. For more information, visit https://cloud.google.com/resource-manager/docs/creating-managing-labels or https://cloud.google.com/run/docs/configuring/labels. Cloud Run API v2 does not support labels with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system labels in v1 now have a corresponding field in v2 ExecutionTemplate.",
              },
              annotations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Unstructured key value map that may be set by external tools to store and arbitrary metadata. They are not queryable and should be preserved when modifying objects. Cloud Run API v2 does not support annotations with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system annotations in v1 now have a corresponding field in v2 ExecutionTemplate. This field follows Kubernetes annotations' namespacing, limits, and rules.",
              },
              parallelism: {
                type: "integer",
                description:
                  "Optional. Specifies the maximum desired number of tasks the execution should run at given time. When the job is run, if this field is 0 or unset, the maximum possible value will be used for that execution. The actual number of tasks running in steady state will be less than this number when there are fewer tasks waiting to be completed remaining, i.e. when the work left to do is less than max parallelism. (Format: int32)",
              },
              taskCount: {
                type: "integer",
                description:
                  "Specifies the desired number of tasks the execution should run. Setting to 1 means that parallelism is limited to 1 and the success of that task signals the success of the execution. Defaults to 1. (Format: int32)",
              },
              template: {
                type: "object",
                properties: {
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
                                  description:
                                    "Optional. The Cloud Storage object generation. (Format: int64)",
                                },
                              },
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
                                  'Literal value of the environment variable. Defaults to "", and the maximum length is 32768 bytes. Variable references are not supported in Cloud Run.',
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
                                    description:
                                      "SecretEnvVarSource represents a source for the value of an EnvVar.",
                                    additionalProperties: true,
                                  },
                                },
                                description:
                                  "EnvVarSource represents a source for the value of an EnvVar.",
                                additionalProperties: true,
                              },
                            },
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
                                "Only `memory`, `cpu` and `nvidia.com/gpu` keys in the map are supported. Notes: * The only supported values for CPU are '1', '2', '4', and '8'. Setting 4 CPU requires at least 2Gi of memory. For more information, go to https://cloud.google.com/run/docs/configuring/cpu. * For supported 'memory' values and syntax, go to https://cloud.google.com/run/docs/configuring/memory-limits * The only supported 'nvidia.com/gpu' value is '1'.",
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
                                  "Port number the container listens on. This must be a valid TCP port number, 0 < container_port < 65536. (Format: int32)",
                              },
                            },
                            description:
                              "ContainerPort represents a network port in a single container.",
                            additionalProperties: true,
                          },
                          description:
                            "List of ports to expose from the container. Only a single port can be specified. The specified ports must be listening on all interfaces (0.0.0.0) within the container to be accessible. If omitted, a port number will be chosen and passed to the container through the PORT environment variable for the container to listen on.",
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
                                "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. (Format: int32)",
                            },
                            timeoutSeconds: {
                              type: "integer",
                              description:
                                "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds. (Format: int32)",
                            },
                            periodSeconds: {
                              type: "integer",
                              description:
                                "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds. (Format: int32)",
                            },
                            failureThreshold: {
                              type: "integer",
                              description:
                                "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. (Format: int32)",
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
                                    "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort. (Format: int32)",
                                },
                              },
                              description:
                                "HTTPGetAction describes an action based on HTTP Get requests.",
                              additionalProperties: true,
                            },
                            tcpSocket: {
                              type: "object",
                              properties: {
                                port: {
                                  type: "integer",
                                  description:
                                    "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort. (Format: int32)",
                                },
                              },
                              description:
                                "TCPSocketAction describes an action based on opening a socket",
                              additionalProperties: true,
                            },
                            grpc: {
                              type: "object",
                              properties: {
                                port: {
                                  type: "integer",
                                  description:
                                    "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort. (Format: int32)",
                                },
                                service: {
                                  type: "string",
                                  description:
                                    "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC.",
                                },
                              },
                              description:
                                "GRPCAction describes an action involving a GRPC port.",
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
                                "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. (Format: int32)",
                            },
                            timeoutSeconds: {
                              type: "integer",
                              description:
                                "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds. (Format: int32)",
                            },
                            periodSeconds: {
                              type: "integer",
                              description:
                                "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds. (Format: int32)",
                            },
                            failureThreshold: {
                              type: "integer",
                              description:
                                "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. (Format: int32)",
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
                                    "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort. (Format: int32)",
                                },
                              },
                              description:
                                "HTTPGetAction describes an action based on HTTP Get requests.",
                              additionalProperties: true,
                            },
                            tcpSocket: {
                              type: "object",
                              properties: {
                                port: {
                                  type: "integer",
                                  description:
                                    "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort. (Format: int32)",
                                },
                              },
                              description:
                                "TCPSocketAction describes an action based on opening a socket",
                              additionalProperties: true,
                            },
                            grpc: {
                              type: "object",
                              properties: {
                                port: {
                                  type: "integer",
                                  description:
                                    "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort. (Format: int32)",
                                },
                                service: {
                                  type: "string",
                                  description:
                                    "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC.",
                                },
                              },
                              description:
                                "GRPCAction describes an action involving a GRPC port.",
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
                        buildInfo: {
                          type: "object",
                          properties: {
                            functionTarget: {
                              type: "string",
                              description:
                                "Output only. Entry point of the function when the image is a Cloud Run function.",
                            },
                            sourceLocation: {
                              type: "string",
                              description:
                                "Output only. Source code location of the image.",
                            },
                          },
                          description: "Build information of the image.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "A single application container. This specifies both the container to run, the command to run in the container and the arguments to supply to it. Note that additional arguments can be supplied by the system to the container at runtime.",
                      additionalProperties: true,
                    },
                    description:
                      "Holds the single container that defines the unit of execution for this task.",
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
                                      "Integer octal mode bits to use on this file, must be a value between 01 and 0777 (octal). If 0 or not set, the Volume's default mode will be used. Notes * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. (Format: int32)",
                                  },
                                },
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
                                "Integer representation of mode bits to use on created files by default. Must be a value between 0000 and 0777 (octal), defaulting to 0444. Directories within the path are not affected by this setting. Notes * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. This might be in conflict with other options that affect the file mode, like fsGroup, and as a result, other mode bits could be set. (Format: int32)",
                            },
                          },
                          description:
                            "The secret's value will be presented as the content of a file whose name is defined in the item path. If no items are defined, the name of the file is the secret.",
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
                            "Represents a set of Cloud SQL instances. Each one will be available under /cloudsql/[instance]. Visit https://cloud.google.com/sql/docs/mysql/connect-run for more information on how to connect Cloud SQL and Cloud Run.",
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
                            "In memory (tmpfs) ephemeral storage. It is ephemeral in the sense that when the sandbox is taken down, the data is destroyed with it (it does not persist across sandbox runs).",
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
                          description: "Represents an NFS mount.",
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
                            "Represents a volume backed by a Cloud Storage bucket using Cloud Storage FUSE.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "Volume represents a named volume in a container.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. A list of Volumes to make available to containers.",
                  },
                  maxRetries: {
                    type: "integer",
                    description:
                      "Number of retries allowed per Task, before marking this Task failed. Defaults to 3. (Format: int32)",
                  },
                  timeout: {
                    type: "string",
                    description:
                      "Optional. Max allowed time duration the Task may be active before the system will actively try to mark it failed and kill associated containers. This applies per attempt of a task, meaning each retry can run for the full timeout. Defaults to 600 seconds. (Format: google-duration)",
                  },
                  serviceAccount: {
                    type: "string",
                    description:
                      "Optional. Email address of the IAM service account associated with the Task of a Job. The service account represents the identity of the running task, and determines what permissions the task has. If not provided, the task will use the project's default service account.",
                  },
                  executionEnvironment: {
                    type: "string",
                    enum: [
                      "EXECUTION_ENVIRONMENT_UNSPECIFIED",
                      "EXECUTION_ENVIRONMENT_GEN1",
                      "EXECUTION_ENVIRONMENT_GEN2",
                    ],
                    description:
                      "Optional. The execution environment being used to host this Task.",
                  },
                  encryptionKey: {
                    type: "string",
                    description:
                      "A reference to a customer managed encryption key (CMEK) to use to encrypt this container image. For more information, go to https://cloud.google.com/run/docs/securing/using-cmek",
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
                  nodeSelector: {
                    type: "object",
                    properties: {
                      accelerator: {
                        type: "string",
                        description:
                          "Required. GPU accelerator type to attach to an instance.",
                      },
                    },
                    description: "Hardware constraints configuration.",
                    additionalProperties: true,
                  },
                  gpuZonalRedundancyDisabled: {
                    type: "boolean",
                    description:
                      "Optional. True if GPU zonal redundancy is disabled on this task template.",
                  },
                },
                description:
                  "TaskTemplate describes the data a task should have when created from a template.",
                additionalProperties: true,
              },
            },
            description:
              "ExecutionTemplate describes the data an execution should have when created from a template.",
            additionalProperties: true,
          },
          required: false,
        },
        startExecutionToken: {
          name: "Start Execution Token",
          description:
            "A unique string used as a suffix creating a new execution.",
          type: {
            type: "string",
            description:
              "A unique string used as a suffix creating a new execution. The Job will become ready when the execution is successfully started. The sum of job name and token length must be fewer than 63 characters.",
          },
          required: false,
        },
        runExecutionToken: {
          name: "Run Execution Token",
          description:
            "A unique string used as a suffix for creating a new execution.",
          type: {
            type: "string",
            description:
              "A unique string used as a suffix for creating a new execution. The Job will become ready when the execution is successfully completed. The sum of job name and token length must be fewer than 63 characters.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
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
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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
        const baseUrl = "https://run.googleapis.com/";
        let path = `v2/{+parent}/jobs`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.annotations !== undefined)
          requestBody.annotations = input.event.inputConfig.annotations;
        if (input.event.inputConfig.client !== undefined)
          requestBody.client = input.event.inputConfig.client;
        if (input.event.inputConfig.clientVersion !== undefined)
          requestBody.clientVersion = input.event.inputConfig.clientVersion;
        if (input.event.inputConfig.launchStage !== undefined)
          requestBody.launchStage = input.event.inputConfig.launchStage;
        if (input.event.inputConfig.binaryAuthorization !== undefined)
          requestBody.binaryAuthorization =
            input.event.inputConfig.binaryAuthorization;
        if (input.event.inputConfig.template !== undefined)
          requestBody.template = input.event.inputConfig.template;
        if (input.event.inputConfig.startExecutionToken !== undefined)
          requestBody.startExecutionToken =
            input.event.inputConfig.startExecutionToken;
        if (input.event.inputConfig.runExecutionToken !== undefined)
          requestBody.runExecutionToken =
            input.event.inputConfig.runExecutionToken;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          name: {
            type: "string",
            description:
              "The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`.",
          },
          metadata: {
            type: "object",
            additionalProperties: true,
            description:
              "Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.",
          },
          done: {
            type: "boolean",
            description:
              "If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
                description:
                  "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
              },
              message: {
                type: "string",
                description:
                  "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description:
                  "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              },
            },
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
            additionalProperties: true,
          },
          response: {
            type: "object",
            additionalProperties: true,
            description:
              "The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.",
          },
        },
        description:
          "This resource represents a long-running operation that is the result of a network API call.",
        additionalProperties: true,
      },
    },
  },
};

export default jobsCreate;
