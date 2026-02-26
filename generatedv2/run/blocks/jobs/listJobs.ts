import { AppBlock, events } from "@slflows/sdk/v1";
import { getJobsClient, createRoutingMetadata, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  "pageSize": "page_size",
  "pageToken": "page_token",
  "showDeleted": "show_deleted"
};

const outputMapping = {
  "jobs": {
    "name": "jobs",
    "fields": {
      "create_time": "createTime",
      "update_time": "updateTime",
      "delete_time": "deleteTime",
      "expire_time": "expireTime",
      "last_modifier": "lastModifier",
      "client_version": "clientVersion",
      "launch_stage": "launchStage",
      "binary_authorization": {
        "name": "binaryAuthorization",
        "fields": {
          "use_default": "useDefault",
          "breakglass_justification": "breakglassJustification"
        }
      },
      "template": {
        "name": "template",
        "fields": {
          "task_count": "taskCount",
          "template": {
            "name": "template",
            "fields": {
              "containers": {
                "name": "containers",
                "fields": {
                  "source_code": {
                    "name": "sourceCode",
                    "fields": {
                      "cloud_storage_source": "cloudStorageSource"
                    }
                  },
                  "env": {
                    "name": "env",
                    "fields": {
                      "value_source": {
                        "name": "valueSource",
                        "fields": {
                          "secret_key_ref": "secretKeyRef"
                        }
                      }
                    }
                  },
                  "resources": {
                    "name": "resources",
                    "fields": {
                      "cpu_idle": "cpuIdle",
                      "startup_cpu_boost": "startupCpuBoost"
                    }
                  },
                  "ports": {
                    "name": "ports",
                    "fields": {
                      "container_port": "containerPort"
                    }
                  },
                  "volume_mounts": {
                    "name": "volumeMounts",
                    "fields": {
                      "mount_path": "mountPath",
                      "sub_path": "subPath"
                    }
                  },
                  "working_dir": "workingDir",
                  "liveness_probe": {
                    "name": "livenessProbe",
                    "fields": {
                      "initial_delay_seconds": "initialDelaySeconds",
                      "timeout_seconds": "timeoutSeconds",
                      "period_seconds": "periodSeconds",
                      "failure_threshold": "failureThreshold",
                      "http_get": {
                        "name": "httpGet",
                        "fields": {
                          "http_headers": "httpHeaders"
                        }
                      },
                      "tcp_socket": "tcpSocket"
                    }
                  },
                  "startup_probe": {
                    "name": "startupProbe",
                    "fields": {
                      "initial_delay_seconds": "initialDelaySeconds",
                      "timeout_seconds": "timeoutSeconds",
                      "period_seconds": "periodSeconds",
                      "failure_threshold": "failureThreshold",
                      "http_get": {
                        "name": "httpGet",
                        "fields": {
                          "http_headers": "httpHeaders"
                        }
                      },
                      "tcp_socket": "tcpSocket"
                    }
                  },
                  "readiness_probe": {
                    "name": "readinessProbe",
                    "fields": {
                      "initial_delay_seconds": "initialDelaySeconds",
                      "timeout_seconds": "timeoutSeconds",
                      "period_seconds": "periodSeconds",
                      "failure_threshold": "failureThreshold",
                      "http_get": {
                        "name": "httpGet",
                        "fields": {
                          "http_headers": "httpHeaders"
                        }
                      },
                      "tcp_socket": "tcpSocket"
                    }
                  },
                  "depends_on": "dependsOn",
                  "base_image_uri": "baseImageUri",
                  "build_info": {
                    "name": "buildInfo",
                    "fields": {
                      "function_target": "functionTarget",
                      "source_location": "sourceLocation"
                    }
                  }
                }
              },
              "volumes": {
                "name": "volumes",
                "fields": {
                  "secret": {
                    "name": "secret",
                    "fields": {
                      "default_mode": "defaultMode"
                    }
                  },
                  "cloud_sql_instance": "cloudSqlInstance",
                  "empty_dir": {
                    "name": "emptyDir",
                    "fields": {
                      "size_limit": "sizeLimit"
                    }
                  },
                  "nfs": {
                    "name": "nfs",
                    "fields": {
                      "read_only": "readOnly"
                    }
                  },
                  "gcs": {
                    "name": "gcs",
                    "fields": {
                      "read_only": "readOnly",
                      "mount_options": "mountOptions"
                    }
                  }
                }
              },
              "max_retries": "maxRetries",
              "service_account": "serviceAccount",
              "execution_environment": "executionEnvironment",
              "encryption_key": "encryptionKey",
              "vpc_access": {
                "name": "vpcAccess",
                "fields": {
                  "network_interfaces": "networkInterfaces"
                }
              },
              "node_selector": "nodeSelector",
              "gpu_zonal_redundancy_disabled": "gpuZonalRedundancyDisabled"
            }
          }
        }
      },
      "observed_generation": "observedGeneration",
      "terminal_condition": {
        "name": "terminalCondition",
        "fields": {
          "last_transition_time": "lastTransitionTime",
          "revision_reason": "revisionReason",
          "execution_reason": "executionReason"
        }
      },
      "conditions": {
        "name": "conditions",
        "fields": {
          "last_transition_time": "lastTransitionTime",
          "revision_reason": "revisionReason",
          "execution_reason": "executionReason"
        }
      },
      "execution_count": "executionCount",
      "latest_created_execution": {
        "name": "latestCreatedExecution",
        "fields": {
          "create_time": "createTime",
          "completion_time": "completionTime",
          "delete_time": "deleteTime",
          "completion_status": "completionStatus"
        }
      },
      "satisfies_pzs": "satisfiesPzs",
      "start_execution_token": "startExecutionToken",
      "run_execution_token": "runExecutionToken"
    }
  },
  "next_page_token": "nextPageToken"
};

const listJobs: AppBlock = {
  name: "List Jobs",
  description: `Lists Jobs. Results are sorted by creation time, descending.`,
  category: "Jobs",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description: "Required. The location and project to list resources on. Format: projects/{project}/locations/{location}, where {project} can be project id or number.",
          type: {
                    "type": "string",
                    "description": "Required. The location and project to list resources on. Format: projects/{project}/locations/{location}, where {project} can be project id or number."
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description: "Maximum number of Jobs to return in this call.",
          type: {
                    "type": "integer",
                    "description": "Maximum number of Jobs to return in this call."
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description: "A page token received from a previous call to ListJobs. All other parameters must match.",
          type: {
                    "type": "string",
                    "description": "A page token received from a previous call to ListJobs. All other parameters must match."
          },
          required: false,
        },
        showDeleted: {
          name: "Show Deleted",
          description: "If true, returns deleted (but unexpired) resources along with active ones.",
          type: {
                    "type": "boolean",
                    "description": "If true, returns deleted (but unexpired) resources along with active ones."
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getJobsClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.parent !== undefined) {
          const m = String(request.parent).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.listJobs(request, metadata, (err: any, response: any) => {
            if (err) reject(new Error(`gRPC error [${err.code}]: ${err.details || err.message}`));
            else resolve(response);
          });
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
            "type": "object",
            "properties": {
                  "jobs": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "name": {
                                          "type": "string",
                                          "description": "The fully qualified name of this Job.  Format: projects/{project}/locations/{location}/jobs/{job}"
                                    },
                                    "uid": {
                                          "type": "string",
                                          "description": "Output only. Server assigned unique identifier for the Execution. The value is a UUID4 string and guaranteed to remain unchanged until the resource is deleted."
                                    },
                                    "generation": {
                                          "type": "string",
                                          "description": "64-bit integer as string"
                                    },
                                    "labels": {
                                          "type": "object",
                                          "additionalProperties": {
                                                "type": "string"
                                          },
                                          "description": "Unstructured key value map that can be used to organize and categorize objects. User-provided labels are shared with Google's billing system, so they can be used to filter, or break down billing charges by team, component, environment, state, etc. For more information, visit https://cloud.google.com/resource-manager/docs/creating-managing-labels or https://cloud.google.com/run/docs/configuring/labels.  <p>Cloud Run API v2 does not support labels with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system labels in v1 now have a corresponding field in v2 Job."
                                    },
                                    "annotations": {
                                          "type": "object",
                                          "additionalProperties": {
                                                "type": "string"
                                          },
                                          "description": "Unstructured key value map that may be set by external tools to store and arbitrary metadata. They are not queryable and should be preserved when modifying objects.  <p>Cloud Run API v2 does not support annotations with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected on new resources. All system annotations in v1 now have a corresponding field in v2 Job.  <p>This field follows Kubernetes annotations' namespacing, limits, and rules."
                                    },
                                    "createTime": {
                                          "type": "string",
                                          "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                    },
                                    "updateTime": {
                                          "type": "string",
                                          "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                    },
                                    "deleteTime": {
                                          "type": "string",
                                          "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                    },
                                    "expireTime": {
                                          "type": "string",
                                          "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                    },
                                    "creator": {
                                          "type": "string",
                                          "description": "Output only. Email address of the authenticated creator."
                                    },
                                    "lastModifier": {
                                          "type": "string",
                                          "description": "Output only. Email address of the last authenticated modifier."
                                    },
                                    "client": {
                                          "type": "string",
                                          "description": "Arbitrary identifier for the API client."
                                    },
                                    "clientVersion": {
                                          "type": "string",
                                          "description": "Arbitrary version identifier for the API client."
                                    },
                                    "launchStage": {
                                          "type": "string",
                                          "enum": [
                                                "LAUNCH_STAGE_UNSPECIFIED",
                                                "UNIMPLEMENTED",
                                                "PRELAUNCH",
                                                "EARLY_ACCESS",
                                                "ALPHA",
                                                "BETA",
                                                "GA",
                                                "DEPRECATED"
                                          ],
                                          "description": "The launch stage as defined by [Google Cloud Platform Launch Stages](https://cloud.google.com/terms/launch-stages). Cloud Run supports `ALPHA`, `BETA`, and `GA`. If no value is specified, GA is assumed. Set the launch stage to a preview stage on input to allow use of preview features in that stage. On read (or output), describes whether the resource uses preview features.  For example, if ALPHA is provided as input, but only BETA and GA-level features are used, this field will be BETA on output."
                                    },
                                    "binaryAuthorization": {
                                          "type": "object",
                                          "properties": {
                                                "useDefault": {
                                                      "type": "boolean",
                                                      "description": "Optional. If True, indicates to use the default project's binary authorization policy. If False, binary authorization will be disabled. (Part of 'binauthz_method' - only one field in this group can be set)"
                                                },
                                                "policy": {
                                                      "type": "string",
                                                      "description": "Optional. The path to a binary authorization policy. Format: `projects/{project}/platforms/cloudRun/{policy-name}` (Part of 'binauthz_method' - only one field in this group can be set)"
                                                },
                                                "breakglassJustification": {
                                                      "type": "string",
                                                      "description": "Optional. If present, indicates to use Breakglass using this justification. If use_default is False, then it must be empty. For more information on breakglass, see https://cloud.google.com/binary-authorization/docs/using-breakglass"
                                                }
                                          },
                                          "description": "Settings for Binary Authorization feature.",
                                          "additionalProperties": true
                                    },
                                    "template": {
                                          "type": "object",
                                          "properties": {
                                                "labels": {
                                                      "type": "object",
                                                      "additionalProperties": {
                                                            "type": "string"
                                                      },
                                                      "description": "Unstructured key value map that can be used to organize and categorize objects. User-provided labels are shared with Google's billing system, so they can be used to filter, or break down billing charges by team, component, environment, state, etc. For more information, visit https://cloud.google.com/resource-manager/docs/creating-managing-labels or https://cloud.google.com/run/docs/configuring/labels.  <p>Cloud Run API v2 does not support labels with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system labels in v1 now have a corresponding field in v2 ExecutionTemplate."
                                                },
                                                "annotations": {
                                                      "type": "object",
                                                      "additionalProperties": {
                                                            "type": "string"
                                                      },
                                                      "description": "Unstructured key value map that may be set by external tools to store and arbitrary metadata. They are not queryable and should be preserved when modifying objects.  <p>Cloud Run API v2 does not support annotations with `run.googleapis.com`, `cloud.googleapis.com`, `serving.knative.dev`, or `autoscaling.knative.dev` namespaces, and they will be rejected. All system annotations in v1 now have a corresponding field in v2 ExecutionTemplate.  <p>This field follows Kubernetes annotations' namespacing, limits, and rules."
                                                },
                                                "parallelism": {
                                                      "type": "integer",
                                                      "description": "Optional. Specifies the maximum desired number of tasks the execution should run at given time. When the job is run, if this field is 0 or unset, the maximum possible value will be used for that execution. The actual number of tasks running in steady state will be less than this number when there are fewer tasks waiting to be completed remaining, i.e. when the work left to do is less than max parallelism."
                                                },
                                                "taskCount": {
                                                      "type": "integer",
                                                      "description": "Specifies the desired number of tasks the execution should run. Setting to 1 means that parallelism is limited to 1 and the success of that task signals the success of the execution. Defaults to 1."
                                                },
                                                "template": {
                                                      "type": "object",
                                                      "properties": {
                                                            "containers": {
                                                                  "type": "array",
                                                                  "items": {
                                                                        "type": "object",
                                                                        "properties": {
                                                                              "name": {
                                                                                    "type": "string",
                                                                                    "description": "Name of the container specified as a DNS_LABEL (RFC 1123)."
                                                                              },
                                                                              "image": {
                                                                                    "type": "string",
                                                                                    "description": "Required. Name of the container image in Dockerhub, Google Artifact Registry, or Google Container Registry. If the host is not provided, Dockerhub is assumed."
                                                                              },
                                                                              "sourceCode": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "cloudStorageSource": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "bucket": {
                                                                                                            "type": "string",
                                                                                                            "description": "Required. The Cloud Storage bucket name."
                                                                                                      },
                                                                                                      "object": {
                                                                                                            "type": "string",
                                                                                                            "description": "Required. The Cloud Storage object name."
                                                                                                      },
                                                                                                      "generation": {
                                                                                                            "type": "string",
                                                                                                            "description": "64-bit integer as string"
                                                                                                      }
                                                                                                },
                                                                                                "required": [
                                                                                                      "bucket",
                                                                                                      "object"
                                                                                                ],
                                                                                                "description": "Cloud Storage source.",
                                                                                                "additionalProperties": true
                                                                                          }
                                                                                    },
                                                                                    "description": "Source type for the container.",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "command": {
                                                                                    "type": "array",
                                                                                    "items": {
                                                                                          "type": "string"
                                                                                    },
                                                                                    "description": "Entrypoint array. Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided."
                                                                              },
                                                                              "args": {
                                                                                    "type": "array",
                                                                                    "items": {
                                                                                          "type": "string"
                                                                                    },
                                                                                    "description": "Arguments to the entrypoint. The docker image's CMD is used if this is not provided."
                                                                              },
                                                                              "env": {
                                                                                    "type": "array",
                                                                                    "items": {
                                                                                          "type": "object",
                                                                                          "properties": {
                                                                                                "name": {
                                                                                                      "type": "string",
                                                                                                      "description": "Required. Name of the environment variable. Must not exceed 32768 characters."
                                                                                                },
                                                                                                "value": {
                                                                                                      "type": "string",
                                                                                                      "description": "Literal value of the environment variable. Defaults to \"\", and the maximum length is 32768 bytes. Variable references are not supported in Cloud Run. (Part of 'values' - only one field in this group can be set)"
                                                                                                },
                                                                                                "valueSource": {
                                                                                                      "type": "object",
                                                                                                      "properties": {
                                                                                                            "secretKeyRef": {
                                                                                                                  "type": "object",
                                                                                                                  "properties": {
                                                                                                                        "secret": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "Required. The name of the secret in Cloud Secret Manager. Format: {secret_name} if the secret is in the same project. projects/{project}/secrets/{secret_name} if the secret is in a different project."
                                                                                                                        },
                                                                                                                        "version": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "The Cloud Secret Manager secret version. Can be 'latest' for the latest version, an integer for a specific version, or a version alias."
                                                                                                                        }
                                                                                                                  },
                                                                                                                  "required": [
                                                                                                                        "secret"
                                                                                                                  ],
                                                                                                                  "description": "SecretEnvVarSource represents a source for the value of an EnvVar.",
                                                                                                                  "additionalProperties": true
                                                                                                            }
                                                                                                      },
                                                                                                      "description": "EnvVarSource represents a source for the value of an EnvVar. (Part of 'values' - only one field in this group can be set)",
                                                                                                      "additionalProperties": true
                                                                                                }
                                                                                          },
                                                                                          "required": [
                                                                                                "name"
                                                                                          ],
                                                                                          "description": "EnvVar represents an environment variable present in a Container.",
                                                                                          "additionalProperties": true
                                                                                    },
                                                                                    "description": "List of environment variables to set in the container."
                                                                              },
                                                                              "resources": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "limits": {
                                                                                                "type": "object",
                                                                                                "additionalProperties": {
                                                                                                      "type": "string"
                                                                                                },
                                                                                                "description": "Only `memory`, `cpu` and `nvidia.com/gpu` keys in the map are supported.  <p>Notes:  * The only supported values for CPU are '1', '2', '4', and '8'. Setting 4 CPU requires at least 2Gi of memory. For more information, go to https://cloud.google.com/run/docs/configuring/cpu.   * For supported 'memory' values and syntax, go to  https://cloud.google.com/run/docs/configuring/memory-limits  * The only supported 'nvidia.com/gpu' value is '1'."
                                                                                          },
                                                                                          "cpuIdle": {
                                                                                                "type": "boolean",
                                                                                                "description": "Determines whether CPU is only allocated during requests (true by default). However, if ResourceRequirements is set, the caller must explicitly set this field to true to preserve the default behavior."
                                                                                          },
                                                                                          "startupCpuBoost": {
                                                                                                "type": "boolean",
                                                                                                "description": "Determines whether CPU should be boosted on startup of a new container instance above the requested CPU threshold, this can help reduce cold-start latency."
                                                                                          }
                                                                                    },
                                                                                    "description": "ResourceRequirements describes the compute resource requirements.",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "ports": {
                                                                                    "type": "array",
                                                                                    "items": {
                                                                                          "type": "object",
                                                                                          "properties": {
                                                                                                "name": {
                                                                                                      "type": "string",
                                                                                                      "description": "If specified, used to specify which protocol to use. Allowed values are \"http1\" and \"h2c\"."
                                                                                                },
                                                                                                "containerPort": {
                                                                                                      "type": "integer",
                                                                                                      "description": "Port number the container listens on. This must be a valid TCP port number, 0 < container_port < 65536."
                                                                                                }
                                                                                          },
                                                                                          "description": "ContainerPort represents a network port in a single container.",
                                                                                          "additionalProperties": true
                                                                                    },
                                                                                    "description": "List of ports to expose from the container. Only a single port can be specified. The specified ports must be listening on all interfaces (0.0.0.0) within the container to be accessible.  If omitted, a port number will be chosen and passed to the container through the PORT environment variable for the container to listen on."
                                                                              },
                                                                              "volumeMounts": {
                                                                                    "type": "array",
                                                                                    "items": {
                                                                                          "type": "object",
                                                                                          "properties": {
                                                                                                "name": {
                                                                                                      "type": "string",
                                                                                                      "description": "Required. This must match the Name of a Volume."
                                                                                                },
                                                                                                "mountPath": {
                                                                                                      "type": "string",
                                                                                                      "description": "Required. Path within the container at which the volume should be mounted. Must not contain ':'. For Cloud SQL volumes, it can be left empty, or must otherwise be `/cloudsql`. All instances defined in the Volume will be available as `/cloudsql/[instance]`. For more information on Cloud SQL volumes, visit https://cloud.google.com/sql/docs/mysql/connect-run"
                                                                                                },
                                                                                                "subPath": {
                                                                                                      "type": "string",
                                                                                                      "description": "Optional. Path within the volume from which the container's volume should be mounted. Defaults to \"\" (volume's root)."
                                                                                                }
                                                                                          },
                                                                                          "required": [
                                                                                                "name",
                                                                                                "mountPath"
                                                                                          ],
                                                                                          "description": "VolumeMount describes a mounting of a Volume within a container.",
                                                                                          "additionalProperties": true
                                                                                    },
                                                                                    "description": "Volume to mount into the container's filesystem."
                                                                              },
                                                                              "workingDir": {
                                                                                    "type": "string",
                                                                                    "description": "Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image."
                                                                              },
                                                                              "livenessProbe": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "initialDelaySeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240."
                                                                                          },
                                                                                          "timeoutSeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds."
                                                                                          },
                                                                                          "periodSeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds."
                                                                                          },
                                                                                          "failureThreshold": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1."
                                                                                          },
                                                                                          "httpGet": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "path": {
                                                                                                            "type": "string",
                                                                                                            "description": "Optional. Path to access on the HTTP server. Defaults to '/'."
                                                                                                      },
                                                                                                      "httpHeaders": {
                                                                                                            "type": "array",
                                                                                                            "items": {
                                                                                                                  "type": "object",
                                                                                                                  "properties": {
                                                                                                                        "name": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "Required. The header field name"
                                                                                                                        },
                                                                                                                        "value": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "Optional. The header field value"
                                                                                                                        }
                                                                                                                  },
                                                                                                                  "required": [
                                                                                                                        "name"
                                                                                                                  ],
                                                                                                                  "description": "HTTPHeader describes a custom header to be used in HTTP probes",
                                                                                                                  "additionalProperties": true
                                                                                                            },
                                                                                                            "description": "Optional. Custom headers to set in the request. HTTP allows repeated headers."
                                                                                                      },
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      }
                                                                                                },
                                                                                                "description": "HTTPGetAction describes an action based on HTTP Get requests. (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          },
                                                                                          "tcpSocket": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      }
                                                                                                },
                                                                                                "description": "TCPSocketAction describes an action based on opening a socket (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          },
                                                                                          "grpc": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      },
                                                                                                      "service": {
                                                                                                            "type": "string",
                                                                                                            "description": "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC."
                                                                                                      }
                                                                                                },
                                                                                                "description": "GRPCAction describes an action involving a GRPC port. (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          }
                                                                                    },
                                                                                    "description": "Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "startupProbe": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "initialDelaySeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240."
                                                                                          },
                                                                                          "timeoutSeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds."
                                                                                          },
                                                                                          "periodSeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds."
                                                                                          },
                                                                                          "failureThreshold": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1."
                                                                                          },
                                                                                          "httpGet": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "path": {
                                                                                                            "type": "string",
                                                                                                            "description": "Optional. Path to access on the HTTP server. Defaults to '/'."
                                                                                                      },
                                                                                                      "httpHeaders": {
                                                                                                            "type": "array",
                                                                                                            "items": {
                                                                                                                  "type": "object",
                                                                                                                  "properties": {
                                                                                                                        "name": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "Required. The header field name"
                                                                                                                        },
                                                                                                                        "value": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "Optional. The header field value"
                                                                                                                        }
                                                                                                                  },
                                                                                                                  "required": [
                                                                                                                        "name"
                                                                                                                  ],
                                                                                                                  "description": "HTTPHeader describes a custom header to be used in HTTP probes",
                                                                                                                  "additionalProperties": true
                                                                                                            },
                                                                                                            "description": "Optional. Custom headers to set in the request. HTTP allows repeated headers."
                                                                                                      },
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      }
                                                                                                },
                                                                                                "description": "HTTPGetAction describes an action based on HTTP Get requests. (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          },
                                                                                          "tcpSocket": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      }
                                                                                                },
                                                                                                "description": "TCPSocketAction describes an action based on opening a socket (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          },
                                                                                          "grpc": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      },
                                                                                                      "service": {
                                                                                                            "type": "string",
                                                                                                            "description": "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC."
                                                                                                      }
                                                                                                },
                                                                                                "description": "GRPCAction describes an action involving a GRPC port. (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          }
                                                                                    },
                                                                                    "description": "Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "readinessProbe": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "initialDelaySeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240."
                                                                                          },
                                                                                          "timeoutSeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds."
                                                                                          },
                                                                                          "periodSeconds": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds."
                                                                                          },
                                                                                          "failureThreshold": {
                                                                                                "type": "integer",
                                                                                                "description": "Optional. Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1."
                                                                                          },
                                                                                          "httpGet": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "path": {
                                                                                                            "type": "string",
                                                                                                            "description": "Optional. Path to access on the HTTP server. Defaults to '/'."
                                                                                                      },
                                                                                                      "httpHeaders": {
                                                                                                            "type": "array",
                                                                                                            "items": {
                                                                                                                  "type": "object",
                                                                                                                  "properties": {
                                                                                                                        "name": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "Required. The header field name"
                                                                                                                        },
                                                                                                                        "value": {
                                                                                                                              "type": "string",
                                                                                                                              "description": "Optional. The header field value"
                                                                                                                        }
                                                                                                                  },
                                                                                                                  "required": [
                                                                                                                        "name"
                                                                                                                  ],
                                                                                                                  "description": "HTTPHeader describes a custom header to be used in HTTP probes",
                                                                                                                  "additionalProperties": true
                                                                                                            },
                                                                                                            "description": "Optional. Custom headers to set in the request. HTTP allows repeated headers."
                                                                                                      },
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      }
                                                                                                },
                                                                                                "description": "HTTPGetAction describes an action based on HTTP Get requests. (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          },
                                                                                          "tcpSocket": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number to access on the container. Must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      }
                                                                                                },
                                                                                                "description": "TCPSocketAction describes an action based on opening a socket (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          },
                                                                                          "grpc": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                      "port": {
                                                                                                            "type": "integer",
                                                                                                            "description": "Optional. Port number of the gRPC service. Number must be in the range 1 to 65535. If not specified, defaults to the exposed port of the container, which is the value of container.ports[0].containerPort."
                                                                                                      },
                                                                                                      "service": {
                                                                                                            "type": "string",
                                                                                                            "description": "Optional. Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md ). If this is not specified, the default behavior is defined by gRPC."
                                                                                                      }
                                                                                                },
                                                                                                "description": "GRPCAction describes an action involving a GRPC port. (Part of 'probe_type' - only one field in this group can be set)",
                                                                                                "additionalProperties": true
                                                                                          }
                                                                                    },
                                                                                    "description": "Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "dependsOn": {
                                                                                    "type": "array",
                                                                                    "items": {
                                                                                          "type": "string"
                                                                                    },
                                                                                    "description": "Names of the containers that must start before this container."
                                                                              },
                                                                              "baseImageUri": {
                                                                                    "type": "string",
                                                                                    "description": "Base image for this container. Only supported for services. If set, it indicates that the service is enrolled into automatic base image update."
                                                                              },
                                                                              "buildInfo": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "functionTarget": {
                                                                                                "type": "string",
                                                                                                "description": "Output only. Entry point of the function when the image is a Cloud Run function."
                                                                                          },
                                                                                          "sourceLocation": {
                                                                                                "type": "string",
                                                                                                "description": "Output only. Source code location of the image."
                                                                                          }
                                                                                    },
                                                                                    "description": "Build information of the image.",
                                                                                    "additionalProperties": true
                                                                              }
                                                                        },
                                                                        "required": [
                                                                              "image"
                                                                        ],
                                                                        "description": "A single application container. This specifies both the container to run, the command to run in the container and the arguments to supply to it. Note that additional arguments can be supplied by the system to the container at runtime.",
                                                                        "additionalProperties": true
                                                                  },
                                                                  "description": "Holds the single container that defines the unit of execution for this task."
                                                            },
                                                            "volumes": {
                                                                  "type": "array",
                                                                  "items": {
                                                                        "type": "object",
                                                                        "properties": {
                                                                              "name": {
                                                                                    "type": "string",
                                                                                    "description": "Required. Volume's name."
                                                                              },
                                                                              "secret": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "secret": {
                                                                                                "type": "string",
                                                                                                "description": "Required. The name of the secret in Cloud Secret Manager. Format: {secret} if the secret is in the same project. projects/{project}/secrets/{secret} if the secret is in a different project."
                                                                                          },
                                                                                          "items": {
                                                                                                "type": "array",
                                                                                                "items": {
                                                                                                      "type": "object",
                                                                                                      "properties": {
                                                                                                            "path": {
                                                                                                                  "type": "string",
                                                                                                                  "description": "Required. The relative path of the secret in the container."
                                                                                                            },
                                                                                                            "version": {
                                                                                                                  "type": "string",
                                                                                                                  "description": "The Cloud Secret Manager secret version. Can be 'latest' for the latest value, or an integer or a secret alias for a specific version."
                                                                                                            },
                                                                                                            "mode": {
                                                                                                                  "type": "integer",
                                                                                                                  "description": "Integer octal mode bits to use on this file, must be a value between 01 and 0777 (octal). If 0 or not set, the Volume's default mode will be used.  Notes  * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set."
                                                                                                            }
                                                                                                      },
                                                                                                      "required": [
                                                                                                            "path"
                                                                                                      ],
                                                                                                      "description": "VersionToPath maps a specific version of a secret to a relative file to mount to, relative to VolumeMount's mount_path.",
                                                                                                      "additionalProperties": true
                                                                                                },
                                                                                                "description": "If unspecified, the volume will expose a file whose name is the secret, relative to VolumeMount.mount_path + VolumeMount.sub_path. If specified, the key will be used as the version to fetch from Cloud Secret Manager and the path will be the name of the file exposed in the volume. When items are defined, they must specify a path and a version."
                                                                                          },
                                                                                          "defaultMode": {
                                                                                                "type": "integer",
                                                                                                "description": "Integer representation of mode bits to use on created files by default. Must be a value between 0000 and 0777 (octal), defaulting to 0444. Directories within the path are not affected by  this setting.  Notes  * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.  This might be in conflict with other options that affect the file mode, like fsGroup, and as a result, other mode bits could be set."
                                                                                          }
                                                                                    },
                                                                                    "required": [
                                                                                          "secret"
                                                                                    ],
                                                                                    "description": "The secret's value will be presented as the content of a file whose name is defined in the item path. If no items are defined, the name of the file is the secret. (Part of 'volume_type' - only one field in this group can be set)",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "cloudSqlInstance": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "instances": {
                                                                                                "type": "array",
                                                                                                "items": {
                                                                                                      "type": "string"
                                                                                                },
                                                                                                "description": "The Cloud SQL instance connection names, as can be found in https://console.cloud.google.com/sql/instances. Visit https://cloud.google.com/sql/docs/mysql/connect-run for more information on how to connect Cloud SQL and Cloud Run. Format: {project}:{location}:{instance}"
                                                                                          }
                                                                                    },
                                                                                    "description": "Represents a set of Cloud SQL instances. Each one will be available under /cloudsql/[instance]. Visit https://cloud.google.com/sql/docs/mysql/connect-run for more information on how to connect Cloud SQL and Cloud Run. (Part of 'volume_type' - only one field in this group can be set)",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "emptyDir": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "medium": {
                                                                                                "type": "string",
                                                                                                "enum": [
                                                                                                      "MEDIUM_UNSPECIFIED",
                                                                                                      "MEMORY"
                                                                                                ],
                                                                                                "description": "The medium on which the data is stored. Acceptable values today is only MEMORY or none. When none, the default will currently be backed by memory but could change over time. +optional"
                                                                                          },
                                                                                          "sizeLimit": {
                                                                                                "type": "string",
                                                                                                "description": "Limit on the storage usable by this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers. The default is nil which means that the limit is undefined. More info: https://cloud.google.com/run/docs/configuring/in-memory-volumes#configure-volume. Info in Kubernetes: https://kubernetes.io/docs/concepts/storage/volumes/#emptydir"
                                                                                          }
                                                                                    },
                                                                                    "description": "In memory (tmpfs) ephemeral storage. It is ephemeral in the sense that when the sandbox is taken down, the data is destroyed with it (it does not persist across sandbox runs). (Part of 'volume_type' - only one field in this group can be set)",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "nfs": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "server": {
                                                                                                "type": "string",
                                                                                                "description": "Hostname or IP address of the NFS server"
                                                                                          },
                                                                                          "path": {
                                                                                                "type": "string",
                                                                                                "description": "Path that is exported by the NFS server."
                                                                                          },
                                                                                          "readOnly": {
                                                                                                "type": "boolean",
                                                                                                "description": "If true, the volume will be mounted as read only for all mounts."
                                                                                          }
                                                                                    },
                                                                                    "description": "Represents an NFS mount. (Part of 'volume_type' - only one field in this group can be set)",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "gcs": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "bucket": {
                                                                                                "type": "string",
                                                                                                "description": "Cloud Storage Bucket name."
                                                                                          },
                                                                                          "readOnly": {
                                                                                                "type": "boolean",
                                                                                                "description": "If true, the volume will be mounted as read only for all mounts."
                                                                                          },
                                                                                          "mountOptions": {
                                                                                                "type": "array",
                                                                                                "items": {
                                                                                                      "type": "string"
                                                                                                },
                                                                                                "description": "A list of additional flags to pass to the gcsfuse CLI. Options should be specified without the leading \"--\"."
                                                                                          }
                                                                                    },
                                                                                    "description": "Represents a volume backed by a Cloud Storage bucket using Cloud Storage FUSE. (Part of 'volume_type' - only one field in this group can be set)",
                                                                                    "additionalProperties": true
                                                                              }
                                                                        },
                                                                        "required": [
                                                                              "name"
                                                                        ],
                                                                        "description": "Volume represents a named volume in a container.",
                                                                        "additionalProperties": true
                                                                  },
                                                                  "description": "Optional. A list of Volumes to make available to containers."
                                                            },
                                                            "maxRetries": {
                                                                  "type": "integer",
                                                                  "description": "Number of retries allowed per Task, before marking this Task failed. Defaults to 3."
                                                            },
                                                            "timeout": {
                                                                  "type": "string",
                                                                  "description": "Duration string (e.g., '1.5s', '300s')"
                                                            },
                                                            "serviceAccount": {
                                                                  "type": "string",
                                                                  "description": "Optional. Email address of the IAM service account associated with the Task of a Job. The service account represents the identity of the running task, and determines what permissions the task has. If not provided, the task will use the project's default service account."
                                                            },
                                                            "executionEnvironment": {
                                                                  "type": "string",
                                                                  "enum": [
                                                                        "EXECUTION_ENVIRONMENT_UNSPECIFIED",
                                                                        "EXECUTION_ENVIRONMENT_GEN1",
                                                                        "EXECUTION_ENVIRONMENT_GEN2"
                                                                  ],
                                                                  "description": "Alternatives for execution environments."
                                                            },
                                                            "encryptionKey": {
                                                                  "type": "string",
                                                                  "description": "A reference to a customer managed encryption key (CMEK) to use to encrypt this container image. For more information, go to https://cloud.google.com/run/docs/securing/using-cmek"
                                                            },
                                                            "vpcAccess": {
                                                                  "type": "object",
                                                                  "properties": {
                                                                        "connector": {
                                                                              "type": "string",
                                                                              "description": "VPC Access connector name. Format: `projects/{project}/locations/{location}/connectors/{connector}`, where `{project}` can be project id or number. For more information on sending traffic to a VPC network via a connector, visit https://cloud.google.com/run/docs/configuring/vpc-connectors."
                                                                        },
                                                                        "egress": {
                                                                              "type": "string",
                                                                              "enum": [
                                                                                    "VPC_EGRESS_UNSPECIFIED",
                                                                                    "ALL_TRAFFIC",
                                                                                    "PRIVATE_RANGES_ONLY"
                                                                              ],
                                                                              "description": "Optional. Traffic VPC egress settings. If not provided, it defaults to PRIVATE_RANGES_ONLY."
                                                                        },
                                                                        "networkInterfaces": {
                                                                              "type": "array",
                                                                              "items": {
                                                                                    "type": "object",
                                                                                    "properties": {
                                                                                          "network": {
                                                                                                "type": "string",
                                                                                                "description": "Optional. The VPC network that the Cloud Run resource will be able to send traffic to. At least one of network or subnetwork must be specified. If both network and subnetwork are specified, the given VPC subnetwork must belong to the given VPC network. If network is not specified, it will be looked up from the subnetwork."
                                                                                          },
                                                                                          "subnetwork": {
                                                                                                "type": "string",
                                                                                                "description": "Optional. The VPC subnetwork that the Cloud Run resource will get IPs from. At least one of network or subnetwork must be specified. If both network and subnetwork are specified, the given VPC subnetwork must belong to the given VPC network. If subnetwork is not specified, the subnetwork with the same name with the network will be used."
                                                                                          },
                                                                                          "tags": {
                                                                                                "type": "array",
                                                                                                "items": {
                                                                                                      "type": "string"
                                                                                                },
                                                                                                "description": "Optional. Network tags applied to this Cloud Run resource."
                                                                                          }
                                                                                    },
                                                                                    "description": "Direct VPC egress settings.",
                                                                                    "additionalProperties": true
                                                                              },
                                                                              "description": "Optional. Direct VPC egress settings. Currently only single network interface is supported."
                                                                        }
                                                                  },
                                                                  "description": "VPC Access settings. For more information on sending traffic to a VPC network, visit https://cloud.google.com/run/docs/configuring/connecting-vpc.",
                                                                  "additionalProperties": true
                                                            },
                                                            "nodeSelector": {
                                                                  "type": "object",
                                                                  "properties": {
                                                                        "accelerator": {
                                                                              "type": "string",
                                                                              "description": "Required. GPU accelerator type to attach to an instance."
                                                                        }
                                                                  },
                                                                  "required": [
                                                                        "accelerator"
                                                                  ],
                                                                  "description": "Hardware constraints configuration.",
                                                                  "additionalProperties": true
                                                            },
                                                            "gpuZonalRedundancyDisabled": {
                                                                  "type": "boolean",
                                                                  "description": "Optional. True if GPU zonal redundancy is disabled on this task template."
                                                            }
                                                      },
                                                      "description": "TaskTemplate describes the data a task should have when created from a template.",
                                                      "additionalProperties": true
                                                }
                                          },
                                          "required": [
                                                "template"
                                          ],
                                          "description": "ExecutionTemplate describes the data an execution should have when created from a template.",
                                          "additionalProperties": true
                                    },
                                    "observedGeneration": {
                                          "type": "string",
                                          "description": "64-bit integer as string"
                                    },
                                    "terminalCondition": {
                                          "type": "object",
                                          "properties": {
                                                "type": {
                                                      "type": "string",
                                                      "description": "type is used to communicate the status of the reconciliation process. See also: https://github.com/knative/serving/blob/main/docs/spec/errors.md#error-conditions-and-reporting Types common to all resources include: * \"Ready\": True when the Resource is ready."
                                                },
                                                "state": {
                                                      "type": "string",
                                                      "enum": [
                                                            "STATE_UNSPECIFIED",
                                                            "CONDITION_PENDING",
                                                            "CONDITION_RECONCILING",
                                                            "CONDITION_FAILED",
                                                            "CONDITION_SUCCEEDED"
                                                      ],
                                                      "description": "State of the condition."
                                                },
                                                "message": {
                                                      "type": "string",
                                                      "description": "Human readable message indicating details about the current status."
                                                },
                                                "lastTransitionTime": {
                                                      "type": "string",
                                                      "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                                },
                                                "severity": {
                                                      "type": "string",
                                                      "enum": [
                                                            "SEVERITY_UNSPECIFIED",
                                                            "ERROR",
                                                            "WARNING",
                                                            "INFO"
                                                      ],
                                                      "description": "How to interpret failures of this condition, one of Error, Warning, Info"
                                                },
                                                "reason": {
                                                      "type": "string",
                                                      "enum": [
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
                                                            "VPC_NETWORK_NOT_FOUND"
                                                      ],
                                                      "description": "Output only. A common (service-level) reason for this condition. (Part of 'reasons' - only one field in this group can be set)"
                                                },
                                                "revisionReason": {
                                                      "type": "string",
                                                      "enum": [
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
                                                            "MIN_INSTANCES_WARMING"
                                                      ],
                                                      "description": "Output only. A reason for the revision condition. (Part of 'reasons' - only one field in this group can be set)"
                                                },
                                                "executionReason": {
                                                      "type": "string",
                                                      "enum": [
                                                            "EXECUTION_REASON_UNDEFINED",
                                                            "JOB_STATUS_SERVICE_POLLING_ERROR",
                                                            "NON_ZERO_EXIT_CODE",
                                                            "CANCELLED",
                                                            "CANCELLING",
                                                            "DELETED",
                                                            "DELAYED_START_PENDING"
                                                      ],
                                                      "description": "Output only. A reason for the execution condition. (Part of 'reasons' - only one field in this group can be set)"
                                                }
                                          },
                                          "description": "Defines a status condition for a resource.",
                                          "additionalProperties": true
                                    },
                                    "conditions": {
                                          "type": "array",
                                          "items": {
                                                "type": "object",
                                                "properties": {
                                                      "type": {
                                                            "type": "string",
                                                            "description": "type is used to communicate the status of the reconciliation process. See also: https://github.com/knative/serving/blob/main/docs/spec/errors.md#error-conditions-and-reporting Types common to all resources include: * \"Ready\": True when the Resource is ready."
                                                      },
                                                      "state": {
                                                            "type": "string",
                                                            "enum": [
                                                                  "STATE_UNSPECIFIED",
                                                                  "CONDITION_PENDING",
                                                                  "CONDITION_RECONCILING",
                                                                  "CONDITION_FAILED",
                                                                  "CONDITION_SUCCEEDED"
                                                            ],
                                                            "description": "State of the condition."
                                                      },
                                                      "message": {
                                                            "type": "string",
                                                            "description": "Human readable message indicating details about the current status."
                                                      },
                                                      "lastTransitionTime": {
                                                            "type": "string",
                                                            "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                                      },
                                                      "severity": {
                                                            "type": "string",
                                                            "enum": [
                                                                  "SEVERITY_UNSPECIFIED",
                                                                  "ERROR",
                                                                  "WARNING",
                                                                  "INFO"
                                                            ],
                                                            "description": "How to interpret failures of this condition, one of Error, Warning, Info"
                                                      },
                                                      "reason": {
                                                            "type": "string",
                                                            "enum": [
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
                                                                  "VPC_NETWORK_NOT_FOUND"
                                                            ],
                                                            "description": "Output only. A common (service-level) reason for this condition. (Part of 'reasons' - only one field in this group can be set)"
                                                      },
                                                      "revisionReason": {
                                                            "type": "string",
                                                            "enum": [
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
                                                                  "MIN_INSTANCES_WARMING"
                                                            ],
                                                            "description": "Output only. A reason for the revision condition. (Part of 'reasons' - only one field in this group can be set)"
                                                      },
                                                      "executionReason": {
                                                            "type": "string",
                                                            "enum": [
                                                                  "EXECUTION_REASON_UNDEFINED",
                                                                  "JOB_STATUS_SERVICE_POLLING_ERROR",
                                                                  "NON_ZERO_EXIT_CODE",
                                                                  "CANCELLED",
                                                                  "CANCELLING",
                                                                  "DELETED",
                                                                  "DELAYED_START_PENDING"
                                                            ],
                                                            "description": "Output only. A reason for the execution condition. (Part of 'reasons' - only one field in this group can be set)"
                                                      }
                                                },
                                                "description": "Defines a status condition for a resource.",
                                                "additionalProperties": true
                                          },
                                          "description": "Output only. The Conditions of all other associated sub-resources. They contain additional diagnostics information in case the Job does not reach its desired state. See comments in `reconciling` for additional information on reconciliation process in Cloud Run."
                                    },
                                    "executionCount": {
                                          "type": "integer",
                                          "description": "Output only. Number of executions created for this job."
                                    },
                                    "latestCreatedExecution": {
                                          "type": "object",
                                          "properties": {
                                                "name": {
                                                      "type": "string",
                                                      "description": "Name of the execution."
                                                },
                                                "createTime": {
                                                      "type": "string",
                                                      "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                                },
                                                "completionTime": {
                                                      "type": "string",
                                                      "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                                },
                                                "deleteTime": {
                                                      "type": "string",
                                                      "description": "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')"
                                                },
                                                "completionStatus": {
                                                      "type": "string",
                                                      "enum": [
                                                            "COMPLETION_STATUS_UNSPECIFIED",
                                                            "EXECUTION_SUCCEEDED",
                                                            "EXECUTION_FAILED",
                                                            "EXECUTION_RUNNING",
                                                            "EXECUTION_PENDING",
                                                            "EXECUTION_CANCELLED"
                                                      ],
                                                      "description": "Status for the execution completion."
                                                }
                                          },
                                          "description": "Reference to an Execution. Use /Executions.GetExecution with the given name to get full execution including the latest status.",
                                          "additionalProperties": true
                                    },
                                    "reconciling": {
                                          "type": "boolean",
                                          "description": "Output only. Returns true if the Job is currently being acted upon by the system to bring it into the desired state.  When a new Job is created, or an existing one is updated, Cloud Run will asynchronously perform all necessary steps to bring the Job to the desired state. This process is called reconciliation. While reconciliation is in process, `observed_generation` and `latest_succeeded_execution`, will have transient values that might mismatch the intended state: Once reconciliation is over (and this field is false), there are two possible outcomes: reconciliation succeeded and the state matches the Job, or there was an error,  and reconciliation failed. This state can be found in `terminal_condition.state`.  If reconciliation succeeded, the following fields will match: `observed_generation` and `generation`, `latest_succeeded_execution` and `latest_created_execution`.  If reconciliation failed, `observed_generation` and `latest_succeeded_execution` will have the state of the last succeeded execution or empty for newly created Job. Additional information on the failure can be found in `terminal_condition` and `conditions`."
                                    },
                                    "satisfiesPzs": {
                                          "type": "boolean",
                                          "description": "Output only. Reserved for future use."
                                    },
                                    "startExecutionToken": {
                                          "type": "string",
                                          "description": "A unique string used as a suffix creating a new execution. The Job will become ready when the execution is successfully started. The sum of job name and token length must be fewer than 63 characters. (Part of 'create_execution' - only one field in this group can be set)"
                                    },
                                    "runExecutionToken": {
                                          "type": "string",
                                          "description": "A unique string used as a suffix for creating a new execution. The Job will become ready when the execution is successfully completed. The sum of job name and token length must be fewer than 63 characters. (Part of 'create_execution' - only one field in this group can be set)"
                                    },
                                    "etag": {
                                          "type": "string",
                                          "description": "Optional. A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates."
                                    }
                              },
                              "required": [
                                    "template"
                              ],
                              "description": "Job represents the configuration of a single job, which references a container image that is run to completion.",
                              "additionalProperties": true
                        },
                        "description": "The resulting list of Jobs."
                  },
                  "nextPageToken": {
                        "type": "string",
                        "description": "A token indicating there are more items than page_size. Use it in the next ListJobs request to continue."
                  }
            },
            "description": "Response message containing a list of Jobs.",
            "additionalProperties": true
      },
    },
  },
};

export default listJobs;
