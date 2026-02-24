import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const revisionsGet: AppBlock = {
  name: "Revisions - Get",
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
          },
          required: true,
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
        let path = `v2/{+name}`;

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
            description: "Output only. The unique name of this Revision.",
          },
          uid: {
            type: "string",
            description:
              "Output only. Server assigned unique identifier for the Revision. The value is a UUID4 string and guaranteed to remain unchanged until the resource is deleted.",
          },
          generation: {
            type: "string",
            description:
              "Output only. A number that monotonically increases every time the user modifies the desired state. (Format: int64)",
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
          createTime: {
            type: "string",
            description:
              "Output only. The creation time. (Format: google-datetime)",
          },
          updateTime: {
            type: "string",
            description:
              "Output only. The last-modified time. (Format: google-datetime)",
          },
          deleteTime: {
            type: "string",
            description:
              "Output only. For a deleted resource, the deletion time. It is only populated as a response to a Delete request. (Format: google-datetime)",
          },
          expireTime: {
            type: "string",
            description:
              "Output only. For a deleted resource, the time after which it will be permamently deleted. It is only populated as a response to a Delete request. (Format: google-datetime)",
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
              "The least stable launch stage needed to create this resource, as defined by [Google Cloud Platform Launch Stages](https://cloud.google.com/terms/launch-stages). Cloud Run supports `ALPHA`, `BETA`, and `GA`. Note that this value might not be what was used as input. For example, if ALPHA was provided as input in the parent resource, but only BETA and GA-level features are were, this field will be BETA.",
          },
          service: {
            type: "string",
            description: "Output only. The name of the parent service.",
          },
          scaling: {
            type: "object",
            properties: {
              minInstanceCount: {
                type: "integer",
                description:
                  "Optional. Minimum number of serving instances that this resource should have. (Format: int32)",
              },
              maxInstanceCount: {
                type: "integer",
                description:
                  "Optional. Maximum number of serving instances that this resource should have. When unspecified, the field is set to the server default value of 100. For more information see https://cloud.google.com/run/docs/configuring/max-instances (Format: int32)",
              },
            },
            description: "Settings for revision-level scaling settings.",
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
          maxInstanceRequestConcurrency: {
            type: "integer",
            description:
              "Sets the maximum number of requests that each serving instance can receive. (Format: int32)",
          },
          timeout: {
            type: "string",
            description:
              "Max allowed time for an instance to respond to a request. (Format: google-duration)",
          },
          serviceAccount: {
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
                                description: "Required. The header field name",
                              },
                              value: {
                                type: "string",
                                description: "Optional. The header field value",
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
                                description: "Required. The header field name",
                              },
                              value: {
                                type: "string",
                                description: "Optional. The header field value",
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
                      description: "Hostname or IP address of the NFS server",
                    },
                    path: {
                      type: "string",
                      description: "Path that is exported by the NFS server.",
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
              description: "Volume represents a named volume in a container.",
              additionalProperties: true,
            },
            description: "A list of Volumes to make available to containers.",
          },
          executionEnvironment: {
            type: "string",
            enum: [
              "EXECUTION_ENVIRONMENT_UNSPECIFIED",
              "EXECUTION_ENVIRONMENT_GEN1",
              "EXECUTION_ENVIRONMENT_GEN2",
            ],
            description:
              "The execution environment being used to host this Revision.",
          },
          encryptionKey: {
            type: "string",
            description:
              "A reference to a customer managed encryption key (CMEK) to use to encrypt this container image. For more information, go to https://cloud.google.com/run/docs/securing/using-cmek",
          },
          serviceMesh: {
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
          encryptionKeyRevocationAction: {
            type: "string",
            enum: [
              "ENCRYPTION_KEY_REVOCATION_ACTION_UNSPECIFIED",
              "PREVENT_NEW",
              "SHUTDOWN",
            ],
            description: "The action to take if the encryption key is revoked.",
          },
          encryptionKeyShutdownDuration: {
            type: "string",
            description:
              "If encryption_key_revocation_action is SHUTDOWN, the duration before shutting down all instances. The minimum increment is 1 hour. (Format: google-duration)",
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
                lastTransitionTime: {
                  type: "string",
                  description:
                    "Last time the condition transitioned from one status to another. (Format: google-datetime)",
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
                    "Output only. A common (service-level) reason for this condition.",
                },
                revisionReason: {
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
                    "Output only. A reason for the revision condition.",
                },
                executionReason: {
                  type: "string",
                  enum: [
                    "EXECUTION_REASON_UNDEFINED",
                    "JOB_STATUS_SERVICE_POLLING_ERROR",
                    "NON_ZERO_EXIT_CODE",
                    "CANCELLED",
                    "CANCELLING",
                    "DELETED",
                  ],
                  description:
                    "Output only. A reason for the execution condition.",
                },
              },
              description: "Defines a status condition for a resource.",
              additionalProperties: true,
            },
            description:
              "Output only. The Condition of this Revision, containing its readiness status, and detailed error information in case it did not reach a serving state.",
          },
          observedGeneration: {
            type: "string",
            description:
              "Output only. The generation of this Revision currently serving traffic. See comments in `reconciling` for additional information on reconciliation process in Cloud Run. (Format: int64)",
          },
          logUri: {
            type: "string",
            description:
              "Output only. The Google Console URI to obtain logs for the Revision.",
          },
          satisfiesPzs: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
          },
          sessionAffinity: {
            type: "boolean",
            description: "Enable session affinity.",
          },
          scalingStatus: {
            type: "object",
            properties: {
              desiredMinInstanceCount: {
                type: "integer",
                description:
                  "The current number of min instances provisioned for this revision. (Format: int32)",
              },
            },
            description: "Effective settings for the current revision",
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
          "A Revision is an immutable snapshot of code and configuration. A Revision references a container image. Revisions are only created by updates to its parent Service.",
        additionalProperties: true,
      },
    },
  },
};

export default revisionsGet;
