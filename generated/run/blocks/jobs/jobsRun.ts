import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const jobsRun: AppBlock = {
  name: "Jobs - Run",
  description: `Triggers creation of a new Execution of this Job.`,
  category: "Jobs",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The full name of the Job. Format: projects/{project}/locations/{location}/jobs/{job}, where {project} can be project id or number.",
          type: {
            type: "string",
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "Indicates that the request should be validated without actually deleting any resources.",
          type: {
            type: "boolean",
            description:
              "Indicates that the request should be validated without actually deleting any resources.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description:
            "A system-generated fingerprint for this version of the resource.",
          type: {
            type: "string",
            description:
              "A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
          },
          required: false,
        },
        overrides: {
          name: "Overrides",
          description:
            "Overrides specification for a given execution of a job.",
          type: {
            type: "object",
            properties: {
              containerOverrides: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "The name of the container specified as a DNS_LABEL.",
                    },
                    args: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Optional. Arguments to the entrypoint. Will replace existing args for override.",
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
                        "List of environment variables to set in the container. Will be merged with existing env for override.",
                    },
                    clearArgs: {
                      type: "boolean",
                      description:
                        "Optional. True if the intention is to clear out existing args list.",
                    },
                  },
                  description: "Per-container override specification.",
                  additionalProperties: true,
                },
                description: "Per container override specification.",
              },
              taskCount: {
                type: "integer",
                description:
                  "Optional. The desired number of tasks the execution should run. Will replace existing task_count value. (Format: int32)",
              },
              timeout: {
                type: "string",
                description:
                  "Duration in seconds the task may be active before the system will actively try to mark it failed and kill associated containers. Will replace existing timeout_seconds value. (Format: google-duration)",
              },
            },
            description:
              "RunJob Overrides that contains Execution fields to be overridden.",
            additionalProperties: true,
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
        let path = `v2/{+name}:run`;

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

        if (input.event.inputConfig.validateOnly !== undefined)
          requestBody.validateOnly = input.event.inputConfig.validateOnly;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.overrides !== undefined)
          requestBody.overrides = input.event.inputConfig.overrides;

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

export default jobsRun;
