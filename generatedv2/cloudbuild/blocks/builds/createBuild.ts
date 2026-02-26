import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const createBuild: AppBlock = {
  name: "Create Build",
  description: `Starts a build with the specified configuration. This method returns a long-running 'Operation', which includes the build ID. Pass the build ID to 'GetBuild' to determine the build status (such as 'SUCCESS' or 'FAILURE').`,
  category: "Builds",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The parent resource where this build will be created. Format: `projects/{project}/locations/{location}`",
          type: {
            type: "string",
            description:
              "The parent resource where this build will be created. Format: `projects/{project}/locations/{location}`",
          },
          required: false,
        },
        project_id: {
          name: "Project Id",
          description: "Required. ID of the project.",
          type: {
            type: "string",
            description: "Required. ID of the project.",
          },
          required: true,
        },
        build: {
          name: "Build",
          description: "Required. Build resource to create.",
          type: {
            type: "object",
            properties: {
              source: {
                type: "object",
                properties: {
                  storage_source: {
                    type: "object",
                    properties: {
                      bucket: {
                        type: "string",
                        description:
                          "Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).",
                      },
                      object: {
                        type: "string",
                        description:
                          "Required. Cloud Storage object containing the source.  This object must be a zipped (`.zip`) or gzipped archive file (`.tar.gz`) containing source to build.",
                      },
                      generation: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      source_fetcher: {
                        type: "string",
                        enum: [
                          "SOURCE_FETCHER_UNSPECIFIED",
                          "GSUTIL",
                          "GCS_FETCHER",
                        ],
                        description:
                          "Optional. Option to specify the tool to fetch the source file for the build.",
                      },
                    },
                    required: ["object"],
                    description:
                      "Location of the source in an archive file in Cloud Storage. (Part of 'source' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  repo_source: {
                    type: "object",
                    properties: {
                      project_id: {
                        type: "string",
                        description:
                          "Optional. ID of the project that owns the Cloud Source Repository. If omitted, the project ID requesting the build is assumed.",
                      },
                      repo_name: {
                        type: "string",
                        description:
                          "Required. Name of the Cloud Source Repository.",
                      },
                      branch_name: {
                        type: "string",
                        description:
                          "Regex matching branches to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
                      },
                      tag_name: {
                        type: "string",
                        description:
                          "Regex matching tags to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
                      },
                      commit_sha: {
                        type: "string",
                        description:
                          "Explicit commit SHA to build. (Part of 'revision' - only one field in this group can be set)",
                      },
                      dir: {
                        type: "string",
                        description:
                          "Optional. Directory, relative to the source root, in which to run the build.  This must be a relative path. If a step's `dir` is specified and is an absolute path, this value is ignored for that step's execution.",
                      },
                      invert_regex: {
                        type: "boolean",
                        description:
                          "Optional. Only trigger a build if the revision regex does NOT match the revision regex.",
                      },
                      substitutions: {
                        type: "object",
                        additionalProperties: {
                          type: "string",
                        },
                        description:
                          "Optional. Substitutions to use in a triggered build. Should only be used with RunBuildTrigger",
                      },
                    },
                    required: ["repo_name"],
                    description:
                      "Location of the source in a Google Cloud Source Repository. (Part of 'source' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  git_source: {
                    type: "object",
                    properties: {
                      url: {
                        type: "string",
                        description:
                          "Required. Location of the Git repo to build.  This will be used as a `git remote`, see https://git-scm.com/docs/git-remote.",
                      },
                      dir: {
                        type: "string",
                        description:
                          "Optional. Directory, relative to the source root, in which to run the build.  This must be a relative path. If a step's `dir` is specified and is an absolute path, this value is ignored for that step's execution.",
                      },
                      revision: {
                        type: "string",
                        description:
                          "Optional. The revision to fetch from the Git repository such as a branch, a tag, a commit SHA, or any Git ref.  Cloud Build uses `git fetch` to fetch the revision from the Git repository; therefore make sure that the string you provide for `revision` is parsable  by the command. For information on string values accepted by `git fetch`, see https://git-scm.com/docs/gitrevisions#_specifying_revisions. For information on `git fetch`, see https://git-scm.com/docs/git-fetch.",
                      },
                    },
                    required: ["url"],
                    description:
                      "Location of the source in any accessible Git repository. (Part of 'source' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  storage_source_manifest: {
                    type: "object",
                    properties: {
                      bucket: {
                        type: "string",
                        description:
                          "Required. Cloud Storage bucket containing the source manifest (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).",
                      },
                      object: {
                        type: "string",
                        description:
                          "Required. Cloud Storage object containing the source manifest.  This object must be a JSON file.",
                      },
                      generation: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    required: ["bucket", "object"],
                    description:
                      "Location of the source manifest in Cloud Storage. This feature is in Preview; see description [here](https://github.com/GoogleCloudPlatform/cloud-builders/tree/master/gcs-fetcher). (Part of 'source' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  connected_repository: {
                    type: "object",
                    properties: {
                      repository: {
                        type: "string",
                        description:
                          "Required. Name of the Google Cloud Build repository, formatted as `projects/*/locations/*/connections/*/repositories/*`.",
                      },
                      dir: {
                        type: "string",
                        description:
                          "Optional. Directory, relative to the source root, in which to run the build.",
                      },
                      revision: {
                        type: "string",
                        description:
                          "Required. The revision to fetch from the Git repository such as a branch, a tag, a commit SHA, or any Git ref.",
                      },
                    },
                    required: ["repository", "revision"],
                    description:
                      "Location of the source in a 2nd-gen Google Cloud Build repository resource. (Part of 'source' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                },
                description:
                  "Location of the source in a supported storage service.",
                additionalProperties: true,
              },
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "Required. The name of the container image that will run this particular build step.  If the image is available in the host's Docker daemon's cache, it will be run directly. If not, the host will attempt to pull the image first, using the builder service account's credentials if necessary.  The Docker daemon's cache will already have the latest versions of all of the officially supported build steps ([https://github.com/GoogleCloudPlatform/cloud-builders](https://github.com/GoogleCloudPlatform/cloud-builders)). The Docker daemon will also have cached many of the layers for some popular images, like \"ubuntu\", \"debian\", but they will be refreshed at the time you attempt to use them.  If you built an image in a previous build step, it will be stored in the host's Docker daemon's cache and is available to use as the name for a later build step.",
                    },
                    env: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'A list of environment variable definitions to be used when running a step.  The elements are of the form "KEY=VALUE" for the environment variable "KEY" being given the value "VALUE".',
                    },
                    args: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of arguments that will be presented to the step when it is started.  If the image used to run the step's container has an entrypoint, the `args` are used as arguments to that entrypoint. If the image does not define an entrypoint, the first element in args is used as the entrypoint, and the remainder will be used as arguments.",
                    },
                    dir: {
                      type: "string",
                      description:
                        "Working directory to use when running this step's container.  If this value is a relative path, it is relative to the build's working directory. If this value is absolute, it may be outside the build's working directory, in which case the contents of the path may not be persisted across build step executions, unless a `volume` for that path is specified.  If the build specifies a `RepoSource` with `dir` and a step with a `dir`, which specifies an absolute path, the `RepoSource` `dir` is ignored for the step's execution.",
                    },
                    id: {
                      type: "string",
                      description:
                        "Unique identifier for this build step, used in `wait_for` to reference this build step as a dependency.",
                    },
                    wait_for: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The ID(s) of the step(s) that this build step depends on. This build step will not start until all the build steps in `wait_for` have completed successfully. If `wait_for` is empty, this build step will start when all previous build steps in the `Build.Steps` list have completed successfully.",
                    },
                    entrypoint: {
                      type: "string",
                      description:
                        "Entrypoint to be used instead of the build step image's default entrypoint. If unset, the image's default entrypoint is used.",
                    },
                    secret_env: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of environment variables which are encrypted using a Cloud Key Management Service crypto key. These values must be specified in the build's `Secret`.",
                    },
                    volumes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description:
                              "Name of the volume to mount.  Volume names must be unique per build step and must be valid names for Docker volumes. Each named volume must be used by at least two build steps.",
                          },
                          path: {
                            type: "string",
                            description:
                              "Path at which to mount the volume.  Paths must be absolute and cannot conflict with other volume paths on the same build step or with certain reserved volume paths.",
                          },
                        },
                        description:
                          "Volume describes a Docker container volume which is mounted into build steps in order to persist files across build step execution.",
                        additionalProperties: true,
                      },
                      description:
                        "List of volumes to mount into the build step.  Each volume is created as an empty volume prior to execution of the build step. Upon completion of the build, volumes and their contents are discarded.  Using a named volume in only one step is not valid as it is indicative of a build request with an incorrect configuration.",
                    },
                    timeout: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    allow_failure: {
                      type: "boolean",
                      description:
                        "Allow this build step to fail without failing the entire build.  If false, the entire build will fail if this step fails. Otherwise, the build will succeed, but this step will still have a failure status. Error information will be reported in the failure_detail field.",
                    },
                    allow_exit_codes: {
                      type: "array",
                      items: {
                        type: "integer",
                      },
                      description:
                        "Allow this build step to fail without failing the entire build if and only if the exit code is one of the specified codes. If allow_failure is also specified, this field will take precedence.",
                    },
                    script: {
                      type: "string",
                      description:
                        "A shell script to be executed in the step.  When script is provided, the user cannot specify the entrypoint or args.",
                    },
                    automap_substitutions: {
                      type: "boolean",
                      description:
                        "Option to include built-in and custom substitutions as env variables for this build step. This option will override the global option in BuildOption.",
                    },
                  },
                  description: "A step in the build pipeline.",
                  additionalProperties: true,
                },
                description:
                  "Required. The operations to be performed on the workspace.",
              },
              timeout: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              images: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "A list of images to be pushed upon the successful completion of all build steps.  The images are pushed using the builder service account's credentials.  The digests of the pushed images will be stored in the `Build` resource's results field.  If any of the images fail to be pushed, the build status is marked `FAILURE`.",
              },
              queue_ttl: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              artifacts: {
                type: "object",
                properties: {
                  images: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "A list of images to be pushed upon the successful completion of all build steps.  The images will be pushed using the builder service account's credentials.  The digests of the pushed images will be stored in the Build resource's results field.  If any of the images fail to be pushed, the build is marked FAILURE.",
                  },
                  objects: {
                    type: "object",
                    properties: {
                      location: {
                        type: "string",
                        description:
                          'Cloud Storage bucket and optional object path, in the form "gs://bucket/path/to/somewhere/". (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).  Files in the workspace matching any path pattern will be uploaded to Cloud Storage with this location as a prefix.',
                      },
                      paths: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Path globs used to match files in the build's workspace.",
                      },
                    },
                    description:
                      "Files in the workspace to upload to Cloud Storage upon successful completion of all build steps.",
                    additionalProperties: true,
                  },
                  maven_artifacts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        repository: {
                          type: "string",
                          description:
                            'Artifact Registry repository, in the form "https://$REGION-maven.pkg.dev/$PROJECT/$REPOSITORY"  Artifact in the workspace specified by path will be uploaded to Artifact Registry with this location as a prefix.',
                        },
                        path: {
                          type: "string",
                          description:
                            "Optional. Path to an artifact in the build's workspace to be uploaded to Artifact Registry. This can be either an absolute path, e.g. /workspace/my-app/target/my-app-1.0.SNAPSHOT.jar or a relative path from /workspace, e.g. my-app/target/my-app-1.0.SNAPSHOT.jar.",
                        },
                        artifact_id: {
                          type: "string",
                          description:
                            "Maven `artifactId` value used when uploading the artifact to Artifact Registry.",
                        },
                        group_id: {
                          type: "string",
                          description:
                            "Maven `groupId` value used when uploading the artifact to Artifact Registry.",
                        },
                        version: {
                          type: "string",
                          description:
                            "Maven `version` value used when uploading the artifact to Artifact Registry.",
                        },
                      },
                      description:
                        "A Maven artifact to upload to Artifact Registry upon successful completion of all build steps.",
                      additionalProperties: true,
                    },
                    description:
                      "A list of Maven artifacts to be uploaded to Artifact Registry upon successful completion of all build steps.  Artifacts in the workspace matching specified paths globs will be uploaded to the specified Artifact Registry repository using the builder service account's credentials.  If any artifacts fail to be pushed, the build is marked FAILURE.",
                  },
                  go_modules: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        repository_name: {
                          type: "string",
                          description:
                            "Optional. Artifact Registry repository name.  Specified Go modules will be zipped and uploaded to Artifact Registry with this location as a prefix. e.g. my-go-repo",
                        },
                        repository_location: {
                          type: "string",
                          description:
                            "Optional. Location of the Artifact Registry repository. i.e. us-east1 Defaults to the build’s location.",
                        },
                        repository_project_id: {
                          type: "string",
                          description:
                            "Optional. Project ID of the Artifact Registry repository. Defaults to the build project.",
                        },
                        source_path: {
                          type: "string",
                          description:
                            "Optional. Source path of the go.mod file in the build's workspace. If not specified, this will default to the current directory. e.g. ~/code/go/mypackage",
                        },
                        module_path: {
                          type: "string",
                          description:
                            'Optional. The Go module\'s "module path". e.g. example.com/foo/v2',
                        },
                        module_version: {
                          type: "string",
                          description:
                            "Optional. The Go module's semantic version in the form vX.Y.Z. e.g. v0.1.1 Pre-release identifiers can also be added by appending a dash and dot separated ASCII alphanumeric characters and hyphens. e.g. v0.2.3-alpha.x.12m.5",
                        },
                      },
                      description:
                        "Go module to upload to Artifact Registry upon successful completion of all build steps. A module refers to all dependencies in a go.mod file.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. A list of Go modules to be uploaded to Artifact Registry upon successful completion of all build steps.  If any objects fail to be pushed, the build is marked FAILURE.",
                  },
                  python_packages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        repository: {
                          type: "string",
                          description:
                            'Artifact Registry repository, in the form "https://$REGION-python.pkg.dev/$PROJECT/$REPOSITORY"  Files in the workspace matching any path pattern will be uploaded to Artifact Registry with this location as a prefix.',
                        },
                        paths: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Path globs used to match files in the build's workspace. For Python/ Twine, this is usually `dist/*`, and sometimes additionally an `.asc` file.",
                        },
                      },
                      description:
                        "Python package to upload to Artifact Registry upon successful completion of all build steps. A package can encapsulate multiple objects to be uploaded to a single repository.",
                      additionalProperties: true,
                    },
                    description:
                      "A list of Python packages to be uploaded to Artifact Registry upon successful completion of all build steps.  The build service account credentials will be used to perform the upload.  If any objects fail to be pushed, the build is marked FAILURE.",
                  },
                  npm_packages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        repository: {
                          type: "string",
                          description:
                            'Artifact Registry repository, in the form "https://$REGION-npm.pkg.dev/$PROJECT/$REPOSITORY"  Npm package in the workspace specified by path will be zipped and uploaded to Artifact Registry with this location as a prefix.',
                        },
                        package_path: {
                          type: "string",
                          description:
                            "Optional. Path to the package.json. e.g. workspace/path/to/package  Only one of `archive` or `package_path` can be specified.",
                        },
                      },
                      description:
                        "Npm package to upload to Artifact Registry upon successful completion of all build steps.",
                      additionalProperties: true,
                    },
                    description:
                      "A list of npm packages to be uploaded to Artifact Registry upon successful completion of all build steps.  Npm packages in the specified paths will be uploaded to the specified Artifact Registry repository using the builder service account's credentials.  If any packages fail to be pushed, the build is marked FAILURE.",
                  },
                },
                description:
                  "Artifacts produced by a build that should be uploaded upon successful completion of all build steps.",
                additionalProperties: true,
              },
              logs_bucket: {
                type: "string",
                description:
                  "Cloud Storage bucket where logs should be written (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)). Logs file names will be of the format `${logs_bucket}/log-${build_id}.txt`.",
              },
              options: {
                type: "object",
                properties: {
                  source_provenance_hash: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: ["NONE", "SHA256", "MD5", "GO_MODULE_H1", "SHA512"],
                    },
                    description: "Requested hash for SourceProvenance.",
                  },
                  requested_verify_option: {
                    type: "string",
                    enum: ["NOT_VERIFIED", "VERIFIED"],
                    description: "Requested verifiability options.",
                  },
                  machine_type: {
                    type: "string",
                    enum: [
                      "UNSPECIFIED",
                      "N1_HIGHCPU_8",
                      "N1_HIGHCPU_32",
                      "E2_HIGHCPU_8",
                      "E2_HIGHCPU_32",
                      "E2_MEDIUM",
                    ],
                    description:
                      "Compute Engine machine type on which to run the build.",
                  },
                  disk_size_gb: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  substitution_option: {
                    type: "string",
                    enum: ["MUST_MATCH", "ALLOW_LOOSE"],
                    description:
                      "Option to specify behavior when there is an error in the substitution checks.  NOTE: this is always set to ALLOW_LOOSE for triggered builds and cannot be overridden in the build configuration file.",
                  },
                  dynamic_substitutions: {
                    type: "boolean",
                    description:
                      "Option to specify whether or not to apply bash style string operations to the substitutions.  NOTE: this is always enabled for triggered builds and cannot be overridden in the build configuration file.",
                  },
                  automap_substitutions: {
                    type: "boolean",
                    description:
                      "Option to include built-in and custom substitutions as env variables for all build steps.",
                  },
                  log_streaming_option: {
                    type: "string",
                    enum: ["STREAM_DEFAULT", "STREAM_ON", "STREAM_OFF"],
                    description:
                      "Option to define build log streaming behavior to Cloud Storage.",
                  },
                  worker_pool: {
                    type: "string",
                    description:
                      "This field deprecated; please use `pool.name` instead.",
                  },
                  pool: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "The `WorkerPool` resource to execute the build on. You must have `cloudbuild.workerpools.use` on the project hosting the WorkerPool.  Format projects/{project}/locations/{location}/workerPools/{workerPoolId}",
                      },
                    },
                    description:
                      "Details about how a build should be executed on a `WorkerPool`.  See [running builds in a private pool](https://cloud.google.com/build/docs/private-pools/run-builds-in-private-pool) for more information.",
                    additionalProperties: true,
                  },
                  logging: {
                    type: "string",
                    enum: [
                      "LOGGING_UNSPECIFIED",
                      "LEGACY",
                      "GCS_ONLY",
                      "STACKDRIVER_ONLY",
                      "CLOUD_LOGGING_ONLY",
                      "NONE",
                    ],
                    description:
                      "Option to specify the logging mode, which determines if and where build logs are stored.",
                  },
                  env: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      'A list of global environment variable definitions that will exist for all build steps in this build. If a variable is defined in both globally and in a build step, the variable will use the build step value.  The elements are of the form "KEY=VALUE" for the environment variable "KEY" being given the value "VALUE".',
                  },
                  secret_env: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "A list of global environment variables, which are encrypted using a Cloud Key Management Service crypto key. These values must be specified in the build's `Secret`. These variables will be available to all build steps in this build.",
                  },
                  volumes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                          description:
                            "Name of the volume to mount.  Volume names must be unique per build step and must be valid names for Docker volumes. Each named volume must be used by at least two build steps.",
                        },
                        path: {
                          type: "string",
                          description:
                            "Path at which to mount the volume.  Paths must be absolute and cannot conflict with other volume paths on the same build step or with certain reserved volume paths.",
                        },
                      },
                      description:
                        "Volume describes a Docker container volume which is mounted into build steps in order to persist files across build step execution.",
                      additionalProperties: true,
                    },
                    description:
                      "Global list of volumes to mount for ALL build steps  Each volume is created as an empty volume prior to starting the build process. Upon completion of the build, volumes and their contents are discarded. Global volume names and paths cannot conflict with the volumes defined a build step.  Using a global volume in a build with only one step is not valid as it is indicative of a build request with an incorrect configuration.",
                  },
                  default_logs_bucket_behavior: {
                    type: "string",
                    enum: [
                      "DEFAULT_LOGS_BUCKET_BEHAVIOR_UNSPECIFIED",
                      "REGIONAL_USER_OWNED_BUCKET",
                      "LEGACY_BUCKET",
                    ],
                    description:
                      "Optional. Option to specify how default logs buckets are setup.",
                  },
                  enable_structured_logging: {
                    type: "boolean",
                    description:
                      "Optional. Option to specify whether structured logging is enabled.  If true, JSON-formatted logs are parsed as structured logs.",
                  },
                },
                description:
                  "Optional arguments to enable specific features of builds.",
                additionalProperties: true,
              },
              substitutions: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description: "Substitutions data for `Build` resource.",
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Tags for annotation of a `Build`. These are not docker tags.",
              },
              secrets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    kms_key_name: {
                      type: "string",
                      description:
                        "Cloud KMS key name to use to decrypt these envs.",
                    },
                    secret_env: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Map of environment variable name to its encrypted value.  Secret environment variables must be unique across all of a build's secrets, and must be used by at least one build step. Values can be at most 64 KB in size. There can be at most 100 secret values across all of a build's secrets.",
                    },
                  },
                  description:
                    "Pairs a set of secret environment variables containing encrypted values with the Cloud KMS key to use to decrypt the value. Note: Use `kmsKeyName` with  `available_secrets` instead of using `kmsKeyName` with `secret`. For instructions see: https://cloud.google.com/cloud-build/docs/securing-builds/use-encrypted-credentials.",
                  additionalProperties: true,
                },
                description:
                  "Secrets to decrypt using Cloud Key Management Service. Note: Secret Manager is the recommended technique for managing sensitive data with Cloud Build. Use `available_secrets` to configure builds to access secrets from Secret Manager. For instructions, see: https://cloud.google.com/cloud-build/docs/securing-builds/use-secrets",
              },
              service_account: {
                type: "string",
                description:
                  "IAM service account whose credentials will be used at build runtime. Must be of the format `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}`. ACCOUNT can be email address or uniqueId of the service account.",
              },
              available_secrets: {
                type: "object",
                properties: {
                  secret_manager: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        version_name: {
                          type: "string",
                          description:
                            "Resource name of the SecretVersion. In format: projects/*/secrets/*/versions/*",
                        },
                        env: {
                          type: "string",
                          description:
                            "Environment variable name to associate with the secret. Secret environment variables must be unique across all of a build's secrets, and must be used by at least one build step.",
                        },
                      },
                      description:
                        "Pairs a secret environment variable with a SecretVersion in Secret Manager.",
                      additionalProperties: true,
                    },
                    description:
                      "Secrets in Secret Manager and associated secret environment variable.",
                  },
                  inline: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        kms_key_name: {
                          type: "string",
                          description:
                            "Resource name of Cloud KMS crypto key to decrypt the encrypted value. In format: projects/*/locations/*/keyRings/*/cryptoKeys/*",
                        },
                        env_map: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "Map of environment variable name to its encrypted value.  Secret environment variables must be unique across all of a build's secrets, and must be used by at least one build step. Values can be at most 64 KB in size. There can be at most 100 secret values across all of a build's secrets.",
                        },
                      },
                      description:
                        "Pairs a set of secret environment variables mapped to encrypted values with the Cloud KMS key to use to decrypt the value.",
                      additionalProperties: true,
                    },
                    description:
                      "Secrets encrypted with KMS key and the associated secret environment variable.",
                  },
                },
                description: "Secrets and secret environment variables.",
                additionalProperties: true,
              },
              git_config: {
                type: "object",
                properties: {
                  http: {
                    type: "object",
                    properties: {
                      proxy_secret_version_name: {
                        type: "string",
                        description:
                          "SecretVersion resource of the HTTP proxy URL. The Service Account used in the build (either the default Service Account or user-specified Service Account) should have `secretmanager.versions.access` permissions on this secret. The proxy URL should be in format `[protocol://][user[:password]@]proxyhost[:port]`.",
                      },
                    },
                    description:
                      "HttpConfig is a configuration for HTTP related git operations.",
                    additionalProperties: true,
                  },
                },
                description: "GitConfig is a configuration for git operations.",
                additionalProperties: true,
              },
              dependencies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    empty: {
                      type: "boolean",
                      description:
                        "If set to true disable all dependency fetching (ignoring the default source as well). (Part of 'dep' - only one field in this group can be set)",
                    },
                    git_source: {
                      type: "object",
                      properties: {
                        repository: {
                          type: "object",
                          properties: {
                            url: {
                              type: "string",
                              description:
                                "Location of the Git repository. (Part of 'repotype' - only one field in this group can be set)",
                            },
                            developer_connect: {
                              type: "string",
                              description:
                                "The Developer Connect Git repository link formatted as `projects/*/locations/*/connections/*/gitRepositoryLink/*` (Part of 'repotype' - only one field in this group can be set)",
                            },
                          },
                          description: "A repository for a git source.",
                          additionalProperties: true,
                        },
                        revision: {
                          type: "string",
                          description:
                            "Required. The revision that we will fetch the repo at.",
                        },
                        recurse_submodules: {
                          type: "boolean",
                          description:
                            "Optional. True if submodules should be fetched too (default false).",
                        },
                        depth: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        dest_path: {
                          type: "string",
                          description:
                            "Required. Where should the files be placed on the worker.",
                        },
                      },
                      required: ["repository", "revision", "dest_path"],
                      description:
                        "Represents a git repository as a build dependency. (Part of 'dep' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "A dependency that the Cloud Build worker will fetch before executing user steps.",
                  additionalProperties: true,
                },
                description:
                  "Optional. Dependencies that the Cloud Build worker will fetch before executing user steps.",
              },
            },
            description:
              "A build resource in the Cloud Build API.  At a high level, a `Build` describes where to find source code, how to build it (for example, the builder image to run on the source), and where to store the built artifacts.  Fields can include the following variables, which will be expanded when the build is created:  - $PROJECT_ID: the project ID of the build. - $PROJECT_NUMBER: the project number of the build. - $LOCATION: the location/region of the build. - $BUILD_ID: the autogenerated ID of the build. - $REPO_NAME: the source repository name specified by RepoSource. - $BRANCH_NAME: the branch name specified by RepoSource. - $TAG_NAME: the tag name specified by RepoSource. - $REVISION_ID or $COMMIT_SHA: the commit SHA specified by RepoSource or   resolved from the specified branch or tag. - $SHORT_SHA: first 7 characters of $REVISION_ID or $COMMIT_SHA.",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getCloudBuildClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.project_id !== undefined)
          request.project_id = input.event.inputConfig.project_id;
        if (input.event.inputConfig.build !== undefined)
          request.build = input.event.inputConfig.build;

        const routingParams: Record<string, string> = {};
        if (request.parent !== undefined) {
          const m = String(request.parent).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.createBuild(request, metadata, (err: any, response: any) => {
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

export default createBuild;
