import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const connectionsList: AppBlock = {
  name: "Connections - List",
  description: `Lists Connections in a given project and location.`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The parent, which owns this collection of Connections. Format: `projects/*/locations/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description: "Number of results to return in the list.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description: "Page start.",
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Optional. If set to true, the response will return partial results when some regions are unreachable. If set to false, the response will fail if any region is unreachable.",
          type: {
            type: "boolean",
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
          connections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Immutable. The resource name of the connection, in the format `projects/{project}/locations/{location}/connections/{connection_id}`.",
                },
                createTime: {
                  type: "string",
                  description:
                    "Output only. Server assigned timestamp for when the connection was created. (Format: google-datetime)",
                },
                updateTime: {
                  type: "string",
                  description:
                    "Output only. Server assigned timestamp for when the connection was updated. (Format: google-datetime)",
                },
                githubConfig: {
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
                githubEnterpriseConfig: {
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
                gitlabConfig: {
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
                bitbucketDataCenterConfig: {
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
                bitbucketCloudConfig: {
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
                  description:
                    "Configuration for connections to Bitbucket Cloud.",
                  additionalProperties: true,
                },
                installationState: {
                  type: "object",
                  properties: {
                    stage: {
                      type: "string",
                      enum: [
                        "STAGE_UNSPECIFIED",
                        "PENDING_CREATE_APP",
                        "PENDING_USER_OAUTH",
                        "PENDING_INSTALL_APP",
                        "COMPLETE",
                      ],
                      description:
                        "Output only. Current step of the installation process.",
                    },
                    message: {
                      type: "string",
                      description:
                        "Output only. Message of what the user should do next to continue the installation. Empty string if the installation is already complete.",
                    },
                    actionUri: {
                      type: "string",
                      description:
                        "Output only. Link to follow for next action. Empty string if the installation is already complete.",
                    },
                  },
                  description:
                    "Describes stage and necessary actions to be taken by the user to complete the installation. Used for GitHub and GitHub Enterprise based connections.",
                  additionalProperties: true,
                },
                disabled: {
                  type: "boolean",
                  description:
                    "Optional. If disabled is set to true, functionality is disabled for this connection. Repository based API methods and webhooks processing for repositories in this connection will be disabled.",
                },
                reconciling: {
                  type: "boolean",
                  description:
                    "Output only. Set to true when the connection is being set up or updated in the background.",
                },
                annotations: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Optional. Allows clients to store small amounts of arbitrary data.",
                },
                etag: {
                  type: "string",
                  description:
                    "This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
                },
              },
              description:
                "A connection to a SCM like GitHub, GitHub Enterprise, Bitbucket Data Center, Bitbucket Cloud or GitLab.",
              additionalProperties: true,
            },
            description: "The list of Connections.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token identifying a page of results the server should return.",
          },
          unreachable: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Locations that could not be reached.",
          },
        },
        description: "Message for response to listing Connections.",
        additionalProperties: true,
      },
    },
  },
};

export default connectionsList;
