import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const connectionsCreate: AppBlock = {
  name: "Connections - Create",
  description: `Creates a Connection.`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Project and location where the connection will be created. Format: `projects/*/locations/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        connectionId: {
          name: "Connection ID",
          description:
            "Required. The ID to use for the Connection, which will become the final component of the Connection's resource name. Names must be unique per-project per-location. Allows alphanumeric characters and any of -._~%!$&'()*+,;=@.",
          type: {
            type: "string",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Immutable.",
          type: {
            type: "string",
            description:
              "Immutable. The resource name of the connection, in the format `projects/{project}/locations/{location}/connections/{connection_id}`.",
          },
          required: false,
        },
        githubConfig: {
          name: "Github Config",
          description: "Configuration for connections to github.",
          type: {
            type: "object",
            properties: {
              authorizerCredential: {
                type: "object",
                properties: {
                  oauthTokenSecretVersion: {
                    type: "string",
                    description:
                      "Optional. A SecretManager resource containing the OAuth token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                  },
                  username: {
                    type: "string",
                    description:
                      "Output only. The username associated to this token.",
                  },
                },
                description:
                  "Represents an OAuth token of the account that authorized the Connection, and associated metadata.",
                additionalProperties: true,
              },
              appInstallationId: {
                type: "string",
                description:
                  "Optional. GitHub App installation id. (Format: int64)",
              },
            },
            description: "Configuration for connections to github.com.",
            additionalProperties: true,
          },
          required: false,
        },
        githubEnterpriseConfig: {
          name: "Github Enterprise Config",
          description:
            "Configuration for connections to an instance of GitHub Enterprise.",
          type: {
            type: "object",
            properties: {
              hostUri: {
                type: "string",
                description:
                  "Required. The URI of the GitHub Enterprise host this connection is for.",
              },
              apiKey: {
                type: "string",
                description:
                  "Required. API Key used for authentication of webhook events.",
              },
              appId: {
                type: "string",
                description:
                  "Optional. Id of the GitHub App created from the manifest. (Format: int64)",
              },
              appSlug: {
                type: "string",
                description:
                  "Optional. The URL-friendly name of the GitHub App.",
              },
              privateKeySecretVersion: {
                type: "string",
                description:
                  "Optional. SecretManager resource containing the private key of the GitHub App, formatted as `projects/*/secrets/*/versions/*`.",
              },
              webhookSecretSecretVersion: {
                type: "string",
                description:
                  "Optional. SecretManager resource containing the webhook secret of the GitHub App, formatted as `projects/*/secrets/*/versions/*`.",
              },
              appInstallationId: {
                type: "string",
                description:
                  "Optional. ID of the installation of the GitHub App. (Format: int64)",
              },
              serviceDirectoryConfig: {
                type: "object",
                properties: {
                  service: {
                    type: "string",
                    description:
                      "Required. The Service Directory service name. Format: projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}.",
                  },
                },
                description:
                  "ServiceDirectoryConfig represents Service Directory configuration for a connection.",
                additionalProperties: true,
              },
              sslCa: {
                type: "string",
                description:
                  "Optional. SSL certificate to use for requests to GitHub Enterprise.",
              },
              serverVersion: {
                type: "string",
                description:
                  "Output only. GitHub Enterprise version installed at the host_uri.",
              },
            },
            description:
              "Configuration for connections to an instance of GitHub Enterprise.",
            additionalProperties: true,
          },
          required: false,
        },
        gitlabConfig: {
          name: "Gitlab Config",
          description: "Configuration for connections to gitlab.",
          type: {
            type: "object",
            properties: {
              hostUri: {
                type: "string",
                description:
                  "Optional. The URI of the GitLab Enterprise host this connection is for. If not specified, the default value is https://gitlab.com.",
              },
              webhookSecretSecretVersion: {
                type: "string",
                description:
                  "Required. Immutable. SecretManager resource containing the webhook secret of a GitLab Enterprise project, formatted as `projects/*/secrets/*/versions/*`.",
              },
              readAuthorizerCredential: {
                type: "object",
                properties: {
                  userTokenSecretVersion: {
                    type: "string",
                    description:
                      "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                  },
                  username: {
                    type: "string",
                    description:
                      "Output only. The username associated to this token.",
                  },
                },
                description:
                  "Represents a personal access token that authorized the Connection, and associated metadata.",
                additionalProperties: true,
              },
              authorizerCredential: {
                type: "object",
                properties: {
                  userTokenSecretVersion: {
                    type: "string",
                    description:
                      "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                  },
                  username: {
                    type: "string",
                    description:
                      "Output only. The username associated to this token.",
                  },
                },
                description:
                  "Represents a personal access token that authorized the Connection, and associated metadata.",
                additionalProperties: true,
              },
              serviceDirectoryConfig: {
                type: "object",
                properties: {
                  service: {
                    type: "string",
                    description:
                      "Required. The Service Directory service name. Format: projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}.",
                  },
                },
                description:
                  "ServiceDirectoryConfig represents Service Directory configuration for a connection.",
                additionalProperties: true,
              },
              sslCa: {
                type: "string",
                description:
                  "Optional. SSL certificate to use for requests to GitLab Enterprise.",
              },
              serverVersion: {
                type: "string",
                description:
                  "Output only. Version of the GitLab Enterprise server running on the `host_uri`.",
              },
            },
            description:
              "Configuration for connections to gitlab.com or an instance of GitLab Enterprise.",
            additionalProperties: true,
          },
          required: false,
        },
        bitbucketDataCenterConfig: {
          name: "Bitbucket Data Center Config",
          description:
            "Configuration for connections to Bitbucket Data Center.",
          type: {
            type: "object",
            properties: {
              hostUri: {
                type: "string",
                description:
                  "Required. The URI of the Bitbucket Data Center instance or cluster this connection is for.",
              },
              webhookSecretSecretVersion: {
                type: "string",
                description:
                  "Required. Immutable. SecretManager resource containing the webhook secret used to verify webhook events, formatted as `projects/*/secrets/*/versions/*`.",
              },
              readAuthorizerCredential: {
                type: "object",
                properties: {
                  userTokenSecretVersion: {
                    type: "string",
                    description:
                      "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                  },
                  username: {
                    type: "string",
                    description:
                      "Output only. The username associated to this token.",
                  },
                },
                description:
                  "Represents a personal access token that authorized the Connection, and associated metadata.",
                additionalProperties: true,
              },
              authorizerCredential: {
                type: "object",
                properties: {
                  userTokenSecretVersion: {
                    type: "string",
                    description:
                      "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                  },
                  username: {
                    type: "string",
                    description:
                      "Output only. The username associated to this token.",
                  },
                },
                description:
                  "Represents a personal access token that authorized the Connection, and associated metadata.",
                additionalProperties: true,
              },
              serviceDirectoryConfig: {
                type: "object",
                properties: {
                  service: {
                    type: "string",
                    description:
                      "Required. The Service Directory service name. Format: projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}.",
                  },
                },
                description:
                  "ServiceDirectoryConfig represents Service Directory configuration for a connection.",
                additionalProperties: true,
              },
              sslCa: {
                type: "string",
                description:
                  "Optional. SSL certificate to use for requests to the Bitbucket Data Center.",
              },
              serverVersion: {
                type: "string",
                description:
                  "Output only. Version of the Bitbucket Data Center running on the `host_uri`.",
              },
            },
            description:
              "Configuration for connections to Bitbucket Data Center.",
            additionalProperties: true,
          },
          required: false,
        },
        bitbucketCloudConfig: {
          name: "Bitbucket Cloud Config",
          description: "Configuration for connections to Bitbucket Cloud.",
          type: {
            type: "object",
            properties: {
              workspace: {
                type: "string",
                description:
                  "Required. The Bitbucket Cloud Workspace ID to be connected to Google Cloud Platform.",
              },
              webhookSecretSecretVersion: {
                type: "string",
                description:
                  "Required. SecretManager resource containing the webhook secret used to verify webhook events, formatted as `projects/*/secrets/*/versions/*`.",
              },
              readAuthorizerCredential: {
                type: "object",
                properties: {
                  userTokenSecretVersion: {
                    type: "string",
                    description:
                      "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                  },
                  username: {
                    type: "string",
                    description:
                      "Output only. The username associated to this token.",
                  },
                },
                description:
                  "Represents a personal access token that authorized the Connection, and associated metadata.",
                additionalProperties: true,
              },
              authorizerCredential: {
                type: "object",
                properties: {
                  userTokenSecretVersion: {
                    type: "string",
                    description:
                      "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                  },
                  username: {
                    type: "string",
                    description:
                      "Output only. The username associated to this token.",
                  },
                },
                description:
                  "Represents a personal access token that authorized the Connection, and associated metadata.",
                additionalProperties: true,
              },
            },
            description: "Configuration for connections to Bitbucket Cloud.",
            additionalProperties: true,
          },
          required: false,
        },
        disabled: {
          name: "Disabled",
          description: "Optional.",
          type: {
            type: "boolean",
            description:
              "Optional. If disabled is set to true, functionality is disabled for this connection. Repository based API methods and webhooks processing for repositories in this connection will be disabled.",
          },
          required: false,
        },
        annotations: {
          name: "Annotations",
          description: "Optional.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Allows clients to store small amounts of arbitrary data.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description:
            "This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
          type: {
            type: "string",
            description:
              "This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
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
        const baseUrl = "https://cloudbuild.googleapis.com/";
        let path = `v2/{+parent}/connections`;

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
        if (input.event.inputConfig.githubConfig !== undefined)
          requestBody.githubConfig = input.event.inputConfig.githubConfig;
        if (input.event.inputConfig.githubEnterpriseConfig !== undefined)
          requestBody.githubEnterpriseConfig =
            input.event.inputConfig.githubEnterpriseConfig;
        if (input.event.inputConfig.gitlabConfig !== undefined)
          requestBody.gitlabConfig = input.event.inputConfig.gitlabConfig;
        if (input.event.inputConfig.bitbucketDataCenterConfig !== undefined)
          requestBody.bitbucketDataCenterConfig =
            input.event.inputConfig.bitbucketDataCenterConfig;
        if (input.event.inputConfig.bitbucketCloudConfig !== undefined)
          requestBody.bitbucketCloudConfig =
            input.event.inputConfig.bitbucketCloudConfig;
        if (input.event.inputConfig.disabled !== undefined)
          requestBody.disabled = input.event.inputConfig.disabled;
        if (input.event.inputConfig.annotations !== undefined)
          requestBody.annotations = input.event.inputConfig.annotations;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
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

export default connectionsCreate;
