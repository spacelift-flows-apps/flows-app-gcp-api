import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const buildsSubmit: AppBlock = {
  name: "Builds - Submit",
  description: `Submits a build in a given project.`,
  category: "Builds",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The project and location to build in. Location must be a region, e.g., 'us-central1' or 'global' if the global builder is to be used. Format: `projects/{project}/locations/{location}`",
          type: {
            type: "string",
          },
          required: true,
        },
        storageSource: {
          name: "Storage Source",
          description: "Required.",
          type: {
            type: "object",
            properties: {
              bucket: {
                type: "string",
                description:
                  "Required. Google Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).",
              },
              object: {
                type: "string",
                description:
                  "Required. Google Cloud Storage object containing the source. This object must be a gzipped archive file (`.tar.gz`) containing source to build.",
              },
              generation: {
                type: "string",
                description:
                  "Optional. Google Cloud Storage generation for the object. If the generation is omitted, the latest generation will be used. (Format: int64)",
              },
            },
            description:
              "Location of the source in an archive file in Google Cloud Storage.",
            additionalProperties: true,
          },
          required: false,
        },
        imageUri: {
          name: "Image Uri",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. Artifact Registry URI to store the built image.",
          },
          required: false,
        },
        buildpackBuild: {
          name: "Buildpack Build",
          description: "Build the source using Buildpacks.",
          type: {
            type: "object",
            properties: {
              runtime: {
                type: "string",
                description:
                  "The runtime name, e.g. 'go113'. Leave blank for generic builds.",
              },
              functionTarget: {
                type: "string",
                description:
                  "Optional. Name of the function target if the source is a function source. Required for function builds.",
              },
              cacheImageUri: {
                type: "string",
                description:
                  "Optional. cache_image_uri is the GCR/AR URL where the cache image will be stored. cache_image_uri is optional and omitting it will disable caching. This URL must be stable across builds. It is used to derive a build-specific temporary URL by substituting the tag with the build ID. The build will clean up the temporary image on a best-effort basis.",
              },
              baseImage: {
                type: "string",
                description: "Optional. The base image to use for the build.",
              },
              environmentVariables: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Optional. User-provided build-time environment variables.",
              },
              enableAutomaticUpdates: {
                type: "boolean",
                description:
                  "Optional. Whether or not the application container will be enrolled in automatic base image updates. When true, the application will be built on a scratch base image, so the base layers can be appended at run time.",
              },
              projectDescriptor: {
                type: "string",
                description:
                  "Optional. project_descriptor stores the path to the project descriptor file. When empty, it means that there is no project descriptor file in the source.",
              },
            },
            description: "Build the source using Buildpacks.",
            additionalProperties: true,
          },
          required: false,
        },
        dockerBuild: {
          name: "Docker Build",
          description: "Build the source using Docker.",
          type: {
            type: "object",
            properties: {},
            description:
              "Build the source using Docker. This means the source has a Dockerfile.",
            additionalProperties: true,
          },
          required: false,
        },
        serviceAccount: {
          name: "Service Account",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The service account to use for the build. If not set, the default Cloud Build service account for the project will be used.",
          },
          required: false,
        },
        workerPool: {
          name: "Worker Pool",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Name of the Cloud Build Custom Worker Pool that should be used to build the function. The format of this field is `projects/{project}/locations/{region}/workerPools/{workerPool}` where `{project}` and `{region}` are the project id and region respectively where the worker pool is defined and `{workerPool}` is the short name of the worker pool.",
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description: "Optional.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Optional. Additional tags to annotate the build.",
          },
          required: false,
        },
        machineType: {
          name: "Machine Type",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The machine type from default pool to use for the build. If left blank, cloudbuild will use a sensible default. Currently only E2_HIGHCPU_8 is supported. If worker_pool is set, this field will be ignored.",
          },
          required: false,
        },
        releaseTrack: {
          name: "Release Track",
          description: "Optional.",
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
              "Optional. The release track of the client that initiated the build request.",
          },
          required: false,
        },
        client: {
          name: "Client",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The client that initiated the build request.",
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
        let path = `v2/{+parent}/builds:submit`;

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

        if (input.event.inputConfig.storageSource !== undefined)
          requestBody.storageSource = input.event.inputConfig.storageSource;
        if (input.event.inputConfig.imageUri !== undefined)
          requestBody.imageUri = input.event.inputConfig.imageUri;
        if (input.event.inputConfig.buildpackBuild !== undefined)
          requestBody.buildpackBuild = input.event.inputConfig.buildpackBuild;
        if (input.event.inputConfig.dockerBuild !== undefined)
          requestBody.dockerBuild = input.event.inputConfig.dockerBuild;
        if (input.event.inputConfig.serviceAccount !== undefined)
          requestBody.serviceAccount = input.event.inputConfig.serviceAccount;
        if (input.event.inputConfig.workerPool !== undefined)
          requestBody.workerPool = input.event.inputConfig.workerPool;
        if (input.event.inputConfig.tags !== undefined)
          requestBody.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.machineType !== undefined)
          requestBody.machineType = input.event.inputConfig.machineType;
        if (input.event.inputConfig.releaseTrack !== undefined)
          requestBody.releaseTrack = input.event.inputConfig.releaseTrack;
        if (input.event.inputConfig.client !== undefined)
          requestBody.client = input.event.inputConfig.client;

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
          buildOperation: {
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
          baseImageUri: {
            type: "string",
            description:
              "URI of the base builder image in Artifact Registry being used in the build. Used to opt into automatic base image updates.",
          },
          baseImageWarning: {
            type: "string",
            description: "Warning message for the base image.",
          },
        },
        description: "Response message for submitting a Build.",
        additionalProperties: true,
      },
    },
  },
};

export default buildsSubmit;
