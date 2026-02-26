import { AppBlock, events } from "@slflows/sdk/v1";
import { getBuildsClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  "storageSource": "storage_source",
  "imageUri": "image_uri",
  "buildpackBuild": {
    "name": "buildpack_build",
    "fields": {
      "functionTarget": "function_target",
      "cacheImageUri": "cache_image_uri",
      "baseImage": "base_image",
      "environmentVariables": "environment_variables",
      "enableAutomaticUpdates": "enable_automatic_updates",
      "projectDescriptor": "project_descriptor"
    }
  },
  "dockerBuild": "docker_build",
  "serviceAccount": "service_account",
  "workerPool": "worker_pool",
  "machineType": "machine_type",
  "releaseTrack": "release_track"
};

const outputMapping = {
  "build_operation": {
    "name": "buildOperation",
    "fields": {
      "metadata": {
        "name": "metadata",
        "fields": {
          "type_url": "typeUrl"
        }
      },
      "error": {
        "name": "error",
        "fields": {
          "details": {
            "name": "details",
            "fields": {
              "type_url": "typeUrl"
            }
          }
        }
      },
      "response": {
        "name": "response",
        "fields": {
          "type_url": "typeUrl"
        }
      }
    }
  },
  "base_image_uri": "baseImageUri",
  "base_image_warning": "baseImageWarning"
};

const submitBuild: AppBlock = {
  name: "Submit Build",
  description: `Submits a build in a given project.`,
  category: "Builds",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description: "Required. The project and location to build in. Location must be a region, e.g., 'us-central1' or 'global' if the global builder is to be used. Format: `projects/{project}/locations/{location}`",
          type: {
                    "type": "string",
                    "description": "Required. The project and location to build in. Location must be a region, e.g., 'us-central1' or 'global' if the global builder is to be used. Format: `projects/{project}/locations/{location}`"
          },
          required: true,
        },
        storageSource: {
          name: "Storage Source",
          description: "Required. Source for the build.",
          type: {
                    "type": "object",
                    "properties": {
                              "bucket": {
                                        "type": "string",
                                        "description": "Required. Google Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements))."
                              },
                              "object": {
                                        "type": "string",
                                        "description": "Required. Google Cloud Storage object containing the source.  This object must be a gzipped archive file (`.tar.gz`) containing source to build."
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
                    "description": "Location of the source in an archive file in Google Cloud Storage.",
                    "additionalProperties": true
          },
          required: true,
        },
        imageUri: {
          name: "Image Uri",
          description: "Required. Artifact Registry URI to store the built image.",
          type: {
                    "type": "string",
                    "description": "Required. Artifact Registry URI to store the built image."
          },
          required: true,
        },
        buildpackBuild: {
          name: "Buildpack Build",
          description: "Build the source using Buildpacks.",
          type: {
                    "type": "object",
                    "properties": {
                              "runtime": {
                                        "type": "string",
                                        "description": "The runtime name, e.g. 'go113'. Leave blank for generic builds."
                              },
                              "functionTarget": {
                                        "type": "string",
                                        "description": "Optional. Name of the function target if the source is a function source. Required for function builds."
                              },
                              "cacheImageUri": {
                                        "type": "string",
                                        "description": "Optional. cache_image_uri is the GCR/AR URL where the cache image will be stored. cache_image_uri is optional and omitting it will disable caching. This URL must be stable across builds. It is used to derive a build-specific temporary URL by substituting the tag with the build ID. The build will clean up the temporary image on a best-effort basis."
                              },
                              "baseImage": {
                                        "type": "string",
                                        "description": "Optional. The base image to use for the build."
                              },
                              "environmentVariables": {
                                        "type": "object",
                                        "additionalProperties": {
                                                  "type": "string"
                                        },
                                        "description": "Optional. User-provided build-time environment variables."
                              },
                              "enableAutomaticUpdates": {
                                        "type": "boolean",
                                        "description": "Optional. Whether or not the application container will be enrolled in automatic base image updates. When true, the application will be built on a scratch base image, so the base layers can be appended at run time."
                              },
                              "projectDescriptor": {
                                        "type": "string",
                                        "description": "Optional. project_descriptor stores the path to the project descriptor file. When empty, it means that there is no project descriptor file in the source."
                              }
                    },
                    "description": "Build the source using Buildpacks. (Part of 'build_type' - only one field in this group can be set)",
                    "additionalProperties": true
          },
          required: false,
        },
        dockerBuild: {
          name: "Docker Build",
          description: "Build the source using Docker. This means the source has a Dockerfile.",
          type: {
                    "type": "object",
                    "properties": {},
                    "description": "Build the source using Docker. This means the source has a Dockerfile. (Part of 'build_type' - only one field in this group can be set)",
                    "additionalProperties": true
          },
          required: false,
        },
        serviceAccount: {
          name: "Service Account",
          description: "Optional. The service account to use for the build. If not set, the default Cloud Build service account for the project will be used.",
          type: {
                    "type": "string",
                    "description": "Optional. The service account to use for the build. If not set, the default Cloud Build service account for the project will be used."
          },
          required: false,
        },
        workerPool: {
          name: "Worker Pool",
          description: "Optional. Name of the Cloud Build Custom Worker Pool that should be used to build the function. The format of this field is `projects/{project}/locations/{region}/workerPools/{workerPool}` where `{project}` and `{region}` are the project id and region respectively where the worker pool is defined and `{workerPool}` is the short name of the worker pool.",
          type: {
                    "type": "string",
                    "description": "Optional. Name of the Cloud Build Custom Worker Pool that should be used to build the function. The format of this field is `projects/{project}/locations/{region}/workerPools/{workerPool}` where `{project}` and `{region}` are the project id and region respectively where the worker pool is defined and `{workerPool}` is the short name of the worker pool."
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: "Optional. Additional tags to annotate the build.",
          type: {
                    "type": "array",
                    "items": {
                              "type": "string"
                    },
                    "description": "Optional. Additional tags to annotate the build."
          },
          required: false,
        },
        machineType: {
          name: "Machine Type",
          description: "Optional. The machine type from default pool to use for the build. If left blank, cloudbuild will use a sensible default. Currently only E2_HIGHCPU_8 is supported. If worker_pool is set, this field will be ignored.",
          type: {
                    "type": "string",
                    "description": "Optional. The machine type from default pool to use for the build. If left blank, cloudbuild will use a sensible default. Currently only E2_HIGHCPU_8 is supported. If worker_pool is set, this field will be ignored."
          },
          required: false,
        },
        releaseTrack: {
          name: "Release Track",
          description: "Optional. The release track of the client that initiated the build request.",
          type: {
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
                    "description": "Optional. The release track of the client that initiated the build request."
          },
          required: false,
        },
        client: {
          name: "Client",
          description: "Optional. The client that initiated the build request.",
          type: {
                    "type": "string",
                    "description": "Optional. The client that initiated the build request."
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getBuildsClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);


        const result = await new Promise<any>((resolve, reject) => {
          client.submitBuild(request, (err: any, response: any) => {
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
                  "buildOperation": {
                        "type": "object",
                        "properties": {
                              "name": {
                                    "type": "string"
                              },
                              "metadata": {
                                    "type": "object",
                                    "properties": {
                                          "typeUrl": {
                                                "type": "string"
                                          },
                                          "value": {
                                                "type": "string",
                                                "description": "Base64-encoded bytes"
                                          }
                                    },
                                    "additionalProperties": true
                              },
                              "done": {
                                    "type": "boolean"
                              },
                              "error": {
                                    "type": "object",
                                    "properties": {
                                          "code": {
                                                "type": "integer"
                                          },
                                          "message": {
                                                "type": "string"
                                          },
                                          "details": {
                                                "type": "array",
                                                "items": {
                                                      "type": "object",
                                                      "properties": {
                                                            "typeUrl": {
                                                                  "type": "string"
                                                            },
                                                            "value": {
                                                                  "type": "string",
                                                                  "description": "Base64-encoded bytes"
                                                            }
                                                      },
                                                      "additionalProperties": true
                                                }
                                          }
                                    },
                                    "additionalProperties": true,
                                    "description": "(Part of 'result' - only one field in this group can be set)"
                              },
                              "response": {
                                    "type": "object",
                                    "properties": {
                                          "typeUrl": {
                                                "type": "string"
                                          },
                                          "value": {
                                                "type": "string",
                                                "description": "Base64-encoded bytes"
                                          }
                                    },
                                    "additionalProperties": true,
                                    "description": "(Part of 'result' - only one field in this group can be set)"
                              }
                        },
                        "additionalProperties": true,
                        "description": "Cloud Build operation to be polled via CloudBuild API."
                  },
                  "baseImageUri": {
                        "type": "string",
                        "description": "URI of the base builder image in Artifact Registry being used in the build. Used to opt into automatic base image updates."
                  },
                  "baseImageWarning": {
                        "type": "string",
                        "description": "Warning message for the base image."
                  }
            },
            "description": "Response message for submitting a Build.",
            "additionalProperties": true
      },
    },
  },
};

export default submitBuild;
