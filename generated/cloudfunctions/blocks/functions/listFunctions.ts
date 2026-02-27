import { AppBlock, events } from "@slflows/sdk/v1";
import { getFunctionServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
  orderBy: "order_by",
};

const outputMapping = {
  functions: {
    name: "functions",
    fields: {
      build_config: {
        name: "buildConfig",
        fields: {
          automatic_update_policy: "automaticUpdatePolicy",
          on_deploy_update_policy: {
            name: "onDeployUpdatePolicy",
            fields: {
              runtime_version: "runtimeVersion",
            },
          },
          entry_point: "entryPoint",
          source: {
            name: "source",
            fields: {
              storage_source: {
                name: "storageSource",
                fields: {
                  source_upload_url: "sourceUploadUrl",
                },
              },
              repo_source: {
                name: "repoSource",
                fields: {
                  branch_name: "branchName",
                  tag_name: "tagName",
                  commit_sha: "commitSha",
                  project_id: "projectId",
                  repo_name: "repoName",
                  invert_regex: "invertRegex",
                },
              },
              git_uri: "gitUri",
            },
          },
          source_provenance: {
            name: "sourceProvenance",
            fields: {
              resolved_storage_source: {
                name: "resolvedStorageSource",
                fields: {
                  source_upload_url: "sourceUploadUrl",
                },
              },
              resolved_repo_source: {
                name: "resolvedRepoSource",
                fields: {
                  branch_name: "branchName",
                  tag_name: "tagName",
                  commit_sha: "commitSha",
                  project_id: "projectId",
                  repo_name: "repoName",
                  invert_regex: "invertRegex",
                },
              },
              git_uri: "gitUri",
            },
          },
          worker_pool: "workerPool",
          environment_variables: "environmentVariables",
          docker_registry: "dockerRegistry",
          docker_repository: "dockerRepository",
          service_account: "serviceAccount",
        },
      },
      service_config: {
        name: "serviceConfig",
        fields: {
          timeout_seconds: "timeoutSeconds",
          available_memory: "availableMemory",
          available_cpu: "availableCpu",
          environment_variables: "environmentVariables",
          max_instance_count: "maxInstanceCount",
          min_instance_count: "minInstanceCount",
          vpc_connector: "vpcConnector",
          vpc_connector_egress_settings: "vpcConnectorEgressSettings",
          ingress_settings: "ingressSettings",
          service_account_email: "serviceAccountEmail",
          all_traffic_on_latest_revision: "allTrafficOnLatestRevision",
          secret_environment_variables: {
            name: "secretEnvironmentVariables",
            fields: {
              project_id: "projectId",
            },
          },
          secret_volumes: {
            name: "secretVolumes",
            fields: {
              mount_path: "mountPath",
              project_id: "projectId",
            },
          },
          max_instance_request_concurrency: "maxInstanceRequestConcurrency",
          security_level: "securityLevel",
          binary_authorization_policy: "binaryAuthorizationPolicy",
        },
      },
      event_trigger: {
        name: "eventTrigger",
        fields: {
          trigger_region: "triggerRegion",
          event_type: "eventType",
          event_filters: "eventFilters",
          pubsub_topic: "pubsubTopic",
          service_account_email: "serviceAccountEmail",
          retry_policy: "retryPolicy",
        },
      },
      update_time: "updateTime",
      state_messages: "stateMessages",
      kms_key_name: "kmsKeyName",
      satisfies_pzs: "satisfiesPzs",
      create_time: "createTime",
    },
  },
  next_page_token: "nextPageToken",
};

const listFunctions: AppBlock = {
  name: "List Functions",
  description: `Returns a list of functions that belong to the requested project.`,
  category: "Functions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            'Required. The project and location from which the function should be listed, specified in the format `projects/*/locations/*` If you want to list functions in all locations, use "-" in place of a location. When listing functions in all locations, if one or more location(s) are unreachable, the response will contain functions from all reachable locations along with the names of any unreachable locations.',
          type: {
            type: "string",
            description:
              'Required. The project and location from which the function should be listed, specified in the format `projects/*/locations/*` If you want to list functions in all locations, use "-" in place of a location. When listing functions in all locations, if one or more location(s) are unreachable, the response will contain functions from all reachable locations along with the names of any unreachable locations.',
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Maximum number of functions to return per call. The largest allowed page_size is 1,000, if the page_size is omitted or specified as greater than 1,000 then it will be replaced as 1,000. The size of the list response can be less than specified when used with filters.",
          type: {
            type: "integer",
            description:
              "Maximum number of functions to return per call. The largest allowed page_size is 1,000, if the page_size is omitted or specified as greater than 1,000 then it will be replaced as 1,000. The size of the list response can be less than specified when used with filters.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "The value returned by the last `ListFunctionsResponse`; indicates that this is a continuation of a prior `ListFunctions` call, and that the system should return the next page of data.",
          type: {
            type: "string",
            description:
              "The value returned by the last `ListFunctionsResponse`; indicates that this is a continuation of a prior `ListFunctions` call, and that the system should return the next page of data.",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "The filter for Functions that match the filter expression, following the syntax outlined in https://google.aip.dev/160.",
          type: {
            type: "string",
            description:
              "The filter for Functions that match the filter expression, following the syntax outlined in https://google.aip.dev/160.",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            "The sorting order of the resources returned. Value should be a comma separated list of fields. The default sorting order is ascending. See https://google.aip.dev/132#ordering.",
          type: {
            type: "string",
            description:
              "The sorting order of the resources returned. Value should be a comma separated list of fields. The default sorting order is ascending. See https://google.aip.dev/132#ordering.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getFunctionServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listFunctions(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
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
        type: "object",
        properties: {
          functions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "A user-defined name of the function. Function names must be unique globally and match pattern `projects/*/locations/*/functions/*`",
                },
                description: {
                  type: "string",
                  description: "User-provided description of a function.",
                },
                buildConfig: {
                  type: "object",
                  properties: {
                    automaticUpdatePolicy: {
                      type: "object",
                      properties: {},
                      description:
                        "Security patches are applied automatically to the runtime without requiring the function to be redeployed. (Part of 'runtime_update_policy' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    onDeployUpdatePolicy: {
                      type: "object",
                      properties: {
                        runtimeVersion: {
                          type: "string",
                          description:
                            "Output only. contains the runtime version which was used during latest function deployment.",
                        },
                      },
                      description:
                        "Security patches are only applied when a function is redeployed. (Part of 'runtime_update_policy' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    build: {
                      type: "string",
                      description:
                        "Output only. The Cloud Build name of the latest successful deployment of the function.",
                    },
                    runtime: {
                      type: "string",
                      description:
                        "The runtime in which to run the function. Required when deploying a new function, optional when updating an existing function. For a complete list of possible choices, see the [`gcloud` command reference](https://cloud.google.com/sdk/gcloud/reference/functions/deploy#--runtime).",
                    },
                    entryPoint: {
                      type: "string",
                      description:
                        'The name of the function (as defined in source code) that will be executed. Defaults to the resource name suffix, if not specified. For backward compatibility, if function with given name is not found, then the system will try to use function named "function". For Node.js this is name of a function exported by the module specified in `source_location`.',
                    },
                    source: {
                      type: "object",
                      properties: {
                        storageSource: {
                          type: "object",
                          properties: {
                            bucket: {
                              type: "string",
                              description:
                                "Google Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).",
                            },
                            object: {
                              type: "string",
                              description:
                                "Google Cloud Storage object containing the source.  This object must be a gzipped archive file (`.tar.gz`) containing source to build.",
                            },
                            generation: {
                              type: "string",
                              description: "64-bit integer as string",
                            },
                            sourceUploadUrl: {
                              type: "string",
                              description:
                                "When the specified storage bucket is a 1st gen function uploard url bucket, this field should be set as the generated upload url for 1st gen deployment.",
                            },
                          },
                          description:
                            "Location of the source in an archive file in Google Cloud Storage. (Part of 'source' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        repoSource: {
                          type: "object",
                          properties: {
                            branchName: {
                              type: "string",
                              description:
                                "Regex matching branches to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
                            },
                            tagName: {
                              type: "string",
                              description:
                                "Regex matching tags to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
                            },
                            commitSha: {
                              type: "string",
                              description:
                                "Explicit commit SHA to build. (Part of 'revision' - only one field in this group can be set)",
                            },
                            projectId: {
                              type: "string",
                              description:
                                "ID of the project that owns the Cloud Source Repository. If omitted, the project ID requesting the build is assumed.",
                            },
                            repoName: {
                              type: "string",
                              description:
                                "Name of the Cloud Source Repository.",
                            },
                            dir: {
                              type: "string",
                              description:
                                "Directory, relative to the source root, in which to run the build.  This must be a relative path. If a step's `dir` is specified and is an absolute path, this value is ignored for that step's execution. eg. helloworld (no leading slash allowed)",
                            },
                            invertRegex: {
                              type: "boolean",
                              description:
                                "Only trigger a build if the revision regex does NOT match the revision regex.",
                            },
                          },
                          description:
                            "Location of the source in a Google Cloud Source Repository. (Part of 'source' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        gitUri: {
                          type: "string",
                          description:
                            "If provided, get the source from GitHub repository. This option is valid only for GCF 1st Gen function. Example: https://github.com/<user>/<repo>/blob/<commit>/<path-to-code> (Part of 'source' - only one field in this group can be set)",
                        },
                      },
                      description: "The location of the function source code.",
                      additionalProperties: true,
                    },
                    sourceProvenance: {
                      type: "object",
                      properties: {
                        resolvedStorageSource: {
                          type: "object",
                          properties: {
                            bucket: {
                              type: "string",
                              description:
                                "Google Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).",
                            },
                            object: {
                              type: "string",
                              description:
                                "Google Cloud Storage object containing the source.  This object must be a gzipped archive file (`.tar.gz`) containing source to build.",
                            },
                            generation: {
                              type: "string",
                              description: "64-bit integer as string",
                            },
                            sourceUploadUrl: {
                              type: "string",
                              description:
                                "When the specified storage bucket is a 1st gen function uploard url bucket, this field should be set as the generated upload url for 1st gen deployment.",
                            },
                          },
                          description:
                            "Location of the source in an archive file in Google Cloud Storage.",
                          additionalProperties: true,
                        },
                        resolvedRepoSource: {
                          type: "object",
                          properties: {
                            branchName: {
                              type: "string",
                              description:
                                "Regex matching branches to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
                            },
                            tagName: {
                              type: "string",
                              description:
                                "Regex matching tags to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
                            },
                            commitSha: {
                              type: "string",
                              description:
                                "Explicit commit SHA to build. (Part of 'revision' - only one field in this group can be set)",
                            },
                            projectId: {
                              type: "string",
                              description:
                                "ID of the project that owns the Cloud Source Repository. If omitted, the project ID requesting the build is assumed.",
                            },
                            repoName: {
                              type: "string",
                              description:
                                "Name of the Cloud Source Repository.",
                            },
                            dir: {
                              type: "string",
                              description:
                                "Directory, relative to the source root, in which to run the build.  This must be a relative path. If a step's `dir` is specified and is an absolute path, this value is ignored for that step's execution. eg. helloworld (no leading slash allowed)",
                            },
                            invertRegex: {
                              type: "boolean",
                              description:
                                "Only trigger a build if the revision regex does NOT match the revision regex.",
                            },
                          },
                          description:
                            "Location of the source in a Google Cloud Source Repository.",
                          additionalProperties: true,
                        },
                        gitUri: {
                          type: "string",
                          description:
                            "A copy of the build's `source.git_uri`, if exists, with any commits resolved.",
                        },
                      },
                      description:
                        "Provenance of the source. Ways to find the original source, or verify that some source was used for this build.",
                      additionalProperties: true,
                    },
                    workerPool: {
                      type: "string",
                      description:
                        "Name of the Cloud Build Custom Worker Pool that should be used to build the function. The format of this field is `projects/{project}/locations/{region}/workerPools/{workerPool}` where {project} and {region} are the project id and region respectively where the worker pool is defined and {workerPool} is the short name of the worker pool.  If the project id is not the same as the function, then the Cloud Functions Service Agent (service-<project_number>@gcf-admin-robot.iam.gserviceaccount.com) must be granted the role Cloud Build Custom Workers Builder (roles/cloudbuild.customworkers.builder) in the project.",
                    },
                    environmentVariables: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "User-provided build-time environment variables for the function",
                    },
                    dockerRegistry: {
                      type: "string",
                      enum: [
                        "DOCKER_REGISTRY_UNSPECIFIED",
                        "CONTAINER_REGISTRY",
                        "ARTIFACT_REGISTRY",
                      ],
                      description:
                        "Docker Registry to use for this deployment. This configuration is only applicable to 1st Gen functions, 2nd Gen functions can only use Artifact Registry. Deprecated: As of March 2025, `CONTAINER_REGISTRY` option is no longer available in response to Container Registry's deprecation: https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr Please use Artifact Registry instead, which is the default choice.  If unspecified, it defaults to `ARTIFACT_REGISTRY`. If `docker_repository` field is specified, this field should either be left unspecified or set to `ARTIFACT_REGISTRY`.",
                    },
                    dockerRepository: {
                      type: "string",
                      description:
                        "Repository in Artifact Registry to which the function docker image will be pushed after it is built by Cloud Build. If specified by user, it is created and managed by user with a customer managed encryption key. Otherwise, GCF will create and use a repository named 'gcf-artifacts' for every deployed region.  It must match the pattern `projects/{project}/locations/{location}/repositories/{repository}`. Repository format must be 'DOCKER'.",
                    },
                    serviceAccount: {
                      type: "string",
                      description:
                        "Service account to be used for building the container. The format of this field is `projects/{projectId}/serviceAccounts/{serviceAccountEmail}`.",
                    },
                  },
                  description:
                    "Describes the Build step of the function that builds a container from the given source.",
                  additionalProperties: true,
                },
                serviceConfig: {
                  type: "object",
                  properties: {
                    service: {
                      type: "string",
                      description:
                        "Output only. Name of the service associated with a Function. The format of this field is `projects/{project}/locations/{region}/services/{service}`",
                    },
                    timeoutSeconds: {
                      type: "integer",
                      description:
                        "The function execution timeout. Execution is considered failed and can be terminated if the function is not completed at the end of the timeout period. Defaults to 60 seconds.",
                    },
                    availableMemory: {
                      type: "string",
                      description:
                        "The amount of memory available for a function. Defaults to 256M. Supported units are k, M, G, Mi, Gi. If no unit is supplied the value is interpreted as bytes. See https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apimachinery/pkg/api/resource/quantity.go a full description.",
                    },
                    availableCpu: {
                      type: "string",
                      description:
                        'The number of CPUs used in a single container instance. Default value is calculated from available memory. Supports the same values as Cloud Run, see https://cloud.google.com/run/docs/reference/rest/v1/Container#resourcerequirements Example: "1" indicates 1 vCPU',
                    },
                    environmentVariables: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Environment variables that shall be available during function execution.",
                    },
                    maxInstanceCount: {
                      type: "integer",
                      description:
                        "The limit on the maximum number of function instances that may coexist at a given time.  In some cases, such as rapid traffic surges, Cloud Functions may, for a short period of time, create more instances than the specified max instances limit. If your function cannot tolerate this temporary behavior, you may want to factor in a safety margin and set a lower max instances value than your function can tolerate.  See the [Max Instances](https://cloud.google.com/functions/docs/max-instances) Guide for more details.",
                    },
                    minInstanceCount: {
                      type: "integer",
                      description:
                        "The limit on the minimum number of function instances that may coexist at a given time.  Function instances are kept in idle state for a short period after they finished executing the request to reduce cold start time for subsequent requests. Setting a minimum instance count will ensure that the given number of instances are kept running in idle state always. This can help with cold start times when jump in incoming request count occurs after the idle instance would have been stopped in the default case.",
                    },
                    vpcConnector: {
                      type: "string",
                      description:
                        "The Serverless VPC Access connector that this cloud function can connect to. The format of this field is `projects/*/locations/*/connectors/*`.",
                    },
                    vpcConnectorEgressSettings: {
                      type: "string",
                      enum: [
                        "VPC_CONNECTOR_EGRESS_SETTINGS_UNSPECIFIED",
                        "PRIVATE_RANGES_ONLY",
                        "ALL_TRAFFIC",
                      ],
                      description:
                        "The egress settings for the connector, controlling what traffic is diverted through it.",
                    },
                    ingressSettings: {
                      type: "string",
                      enum: [
                        "INGRESS_SETTINGS_UNSPECIFIED",
                        "ALLOW_ALL",
                        "ALLOW_INTERNAL_ONLY",
                        "ALLOW_INTERNAL_AND_GCLB",
                      ],
                      description:
                        "The ingress settings for the function, controlling what traffic can reach it.",
                    },
                    uri: {
                      type: "string",
                      description: "Output only. URI of the Service deployed.",
                    },
                    serviceAccountEmail: {
                      type: "string",
                      description:
                        "The email of the service's service account. If empty, defaults to `{project_number}-compute@developer.gserviceaccount.com`.",
                    },
                    allTrafficOnLatestRevision: {
                      type: "boolean",
                      description:
                        "Whether 100% of traffic is routed to the latest revision. On CreateFunction and UpdateFunction, when set to true, the revision being deployed will serve 100% of traffic, ignoring any traffic split settings, if any. On GetFunction, true will be returned if the latest revision is serving 100% of traffic.",
                    },
                    secretEnvironmentVariables: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          key: {
                            type: "string",
                            description: "Name of the environment variable.",
                          },
                          projectId: {
                            type: "string",
                            description:
                              "Project identifier (preferably project number but can also be the project ID) of the project that contains the secret. If not set, it is assumed that the secret is in the same project as the function.",
                          },
                          secret: {
                            type: "string",
                            description:
                              "Name of the secret in secret manager (not the full resource name).",
                          },
                          version: {
                            type: "string",
                            description:
                              "Version of the secret (version number or the string 'latest'). It is recommended to use a numeric version for secret environment variables as any updates to the secret value is not reflected until new instances start.",
                          },
                        },
                        description:
                          "Configuration for a secret environment variable. It has the information necessary to fetch the secret value from secret manager and expose it as an environment variable.",
                        additionalProperties: true,
                      },
                      description:
                        "Secret environment variables configuration.",
                    },
                    secretVolumes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          mountPath: {
                            type: "string",
                            description:
                              "The path within the container to mount the secret volume. For example, setting the mount_path as `/etc/secrets` would mount the secret value files under the `/etc/secrets` directory. This directory will also be completely shadowed and unavailable to mount any other secrets. Recommended mount path: /etc/secrets",
                          },
                          projectId: {
                            type: "string",
                            description:
                              "Project identifier (preferably project number but can also be the project ID) of the project that contains the secret. If not set, it is assumed that the secret is in the same project as the function.",
                          },
                          secret: {
                            type: "string",
                            description:
                              "Name of the secret in secret manager (not the full resource name).",
                          },
                          versions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                version: {
                                  type: "string",
                                  description:
                                    "Version of the secret (version number or the string 'latest'). It is preferable to use `latest` version with secret volumes as secret value changes are reflected immediately.",
                                },
                                path: {
                                  type: "string",
                                  description:
                                    "Relative path of the file under the mount path where the secret value for this version will be fetched and made available. For example, setting the mount_path as '/etc/secrets' and path as `secret_foo` would mount the secret value file at `/etc/secrets/secret_foo`.",
                                },
                              },
                              description:
                                "Configuration for a single version.",
                              additionalProperties: true,
                            },
                            description:
                              "List of secret versions to mount for this secret. If empty, the `latest` version of the secret will be made available in a file named after the secret under the mount point.",
                          },
                        },
                        description:
                          "Configuration for a secret volume. It has the information necessary to fetch the secret value from secret manager and make it available as files mounted at the requested paths within the application container.",
                        additionalProperties: true,
                      },
                      description: "Secret volumes configuration.",
                    },
                    revision: {
                      type: "string",
                      description: "Output only. The name of service revision.",
                    },
                    maxInstanceRequestConcurrency: {
                      type: "integer",
                      description:
                        "Sets the maximum number of concurrent requests that each instance can receive. Defaults to 1.",
                    },
                    securityLevel: {
                      type: "string",
                      enum: [
                        "SECURITY_LEVEL_UNSPECIFIED",
                        "SECURE_ALWAYS",
                        "SECURE_OPTIONAL",
                      ],
                      description:
                        "Security level configure whether the function only accepts https. This configuration is only applicable to 1st Gen functions with Http trigger. By default https is optional for 1st Gen functions; 2nd Gen functions are https ONLY.",
                    },
                    binaryAuthorizationPolicy: {
                      type: "string",
                      description:
                        "Optional. The binary authorization policy to be checked when deploying the Cloud Run service.",
                    },
                  },
                  description:
                    "Describes the Service being deployed. Currently Supported : Cloud Run (fully managed).",
                  additionalProperties: true,
                },
                eventTrigger: {
                  type: "object",
                  properties: {
                    trigger: {
                      type: "string",
                      description:
                        "Output only. The resource name of the Eventarc trigger. The format of this field is `projects/{project}/locations/{region}/triggers/{trigger}`.",
                    },
                    triggerRegion: {
                      type: "string",
                      description:
                        "The region that the trigger will be in. The trigger will only receive events originating in this region. It can be the same region as the function, a different region or multi-region, or the global region. If not provided, defaults to the same region as the function.",
                    },
                    eventType: {
                      type: "string",
                      description:
                        "Required. The type of event to observe. For example: `google.cloud.audit.log.v1.written` or `google.cloud.pubsub.topic.v1.messagePublished`.",
                    },
                    eventFilters: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          attribute: {
                            type: "string",
                            description:
                              "Required. The name of a CloudEvents attribute.",
                          },
                          value: {
                            type: "string",
                            description:
                              "Required. The value for the attribute.",
                          },
                          operator: {
                            type: "string",
                            description:
                              "Optional. The operator used for matching the events with the value of the filter. If not specified, only events that have an exact key-value pair specified in the filter are matched. The only allowed value is `match-path-pattern`.",
                          },
                        },
                        required: ["attribute", "value"],
                        description:
                          "Filters events based on exact matches on the CloudEvents attributes.",
                        additionalProperties: true,
                      },
                      description: "Criteria used to filter events.",
                    },
                    pubsubTopic: {
                      type: "string",
                      description:
                        "Optional. The name of a Pub/Sub topic in the same project that will be used as the transport topic for the event delivery. Format: `projects/{project}/topics/{topic}`.  This is only valid for events of type `google.cloud.pubsub.topic.v1.messagePublished`. The topic provided here will not be deleted at function deletion.",
                    },
                    serviceAccountEmail: {
                      type: "string",
                      description:
                        "Optional. The email of the trigger's service account. The service account must have permission to invoke Cloud Run services, the permission is `run.routes.invoke`. If empty, defaults to the Compute Engine default service account: `{project_number}-compute@developer.gserviceaccount.com`.",
                    },
                    retryPolicy: {
                      type: "string",
                      enum: [
                        "RETRY_POLICY_UNSPECIFIED",
                        "RETRY_POLICY_DO_NOT_RETRY",
                        "RETRY_POLICY_RETRY",
                      ],
                      description:
                        "Optional. If unset, then defaults to ignoring failures (i.e. not retrying them).",
                    },
                    channel: {
                      type: "string",
                      description:
                        "Optional. The name of the channel associated with the trigger in `projects/{project}/locations/{location}/channels/{channel}` format. You must provide a channel to receive events from Eventarc SaaS partners.",
                    },
                    service: {
                      type: "string",
                      description:
                        "Optional. The hostname of the service that 1st Gen function should be observed.  If no string is provided, the default service implementing the API will be used. For example, `storage.googleapis.com` is the default for all event types in the `google.storage` namespace.  The field is only applicable to 1st Gen functions.",
                    },
                  },
                  required: ["eventType"],
                  description:
                    "Describes EventTrigger, used to request events to be sent from another service.",
                  additionalProperties: true,
                },
                state: {
                  type: "string",
                  enum: [
                    "STATE_UNSPECIFIED",
                    "ACTIVE",
                    "FAILED",
                    "DEPLOYING",
                    "DELETING",
                    "UNKNOWN",
                  ],
                  description: "Output only. State of the function.",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description: "Labels associated with this Cloud Function.",
                },
                stateMessages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      severity: {
                        type: "string",
                        enum: [
                          "SEVERITY_UNSPECIFIED",
                          "ERROR",
                          "WARNING",
                          "INFO",
                        ],
                        description: "Severity of the state message.",
                      },
                      type: {
                        type: "string",
                        description:
                          "One-word CamelCase type of the state message.",
                      },
                      message: {
                        type: "string",
                        description: "The message.",
                      },
                    },
                    description:
                      "Informational messages about the state of the Cloud Function or Operation.",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. State Messages for this Cloud Function.",
                },
                environment: {
                  type: "string",
                  enum: ["ENVIRONMENT_UNSPECIFIED", "GEN_1", "GEN_2"],
                  description: "The environment the function is hosted on.",
                },
                url: {
                  type: "string",
                  description:
                    "Output only. The deployed url for the function.",
                },
                kmsKeyName: {
                  type: "string",
                  description:
                    "Resource name of a KMS crypto key (managed by the user) used to encrypt/decrypt function resources.  It must match the pattern `projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}`.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description: "Output only. Reserved for future use.",
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
              },
              description:
                "Describes a Cloud Function that contains user computation executed in response to an event. It encapsulates function and trigger configurations.",
              additionalProperties: true,
            },
            description: "The functions that match the request.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.",
          },
          unreachable: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Locations that could not be reached. The response does not include any functions from these locations.",
          },
        },
        description: "Response for the `ListFunctions` method.",
        additionalProperties: true,
      },
    },
  },
};

export default listFunctions;
