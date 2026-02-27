import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRepositoryManagerClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  connections: {
    name: "connections",
    fields: {
      create_time: "createTime",
      update_time: "updateTime",
      github_config: {
        name: "githubConfig",
        fields: {
          authorizer_credential: {
            name: "authorizerCredential",
            fields: {
              oauth_token_secret_version: "oauthTokenSecretVersion",
            },
          },
          app_installation_id: "appInstallationId",
        },
      },
      github_enterprise_config: {
        name: "githubEnterpriseConfig",
        fields: {
          host_uri: "hostUri",
          api_key: "apiKey",
          app_id: "appId",
          app_slug: "appSlug",
          private_key_secret_version: "privateKeySecretVersion",
          webhook_secret_secret_version: "webhookSecretSecretVersion",
          app_installation_id: "appInstallationId",
          service_directory_config: "serviceDirectoryConfig",
          ssl_ca: "sslCa",
          server_version: "serverVersion",
        },
      },
      gitlab_config: {
        name: "gitlabConfig",
        fields: {
          host_uri: "hostUri",
          webhook_secret_secret_version: "webhookSecretSecretVersion",
          read_authorizer_credential: {
            name: "readAuthorizerCredential",
            fields: {
              user_token_secret_version: "userTokenSecretVersion",
            },
          },
          authorizer_credential: {
            name: "authorizerCredential",
            fields: {
              user_token_secret_version: "userTokenSecretVersion",
            },
          },
          service_directory_config: "serviceDirectoryConfig",
          ssl_ca: "sslCa",
          server_version: "serverVersion",
        },
      },
      bitbucket_data_center_config: {
        name: "bitbucketDataCenterConfig",
        fields: {
          host_uri: "hostUri",
          webhook_secret_secret_version: "webhookSecretSecretVersion",
          read_authorizer_credential: {
            name: "readAuthorizerCredential",
            fields: {
              user_token_secret_version: "userTokenSecretVersion",
            },
          },
          authorizer_credential: {
            name: "authorizerCredential",
            fields: {
              user_token_secret_version: "userTokenSecretVersion",
            },
          },
          service_directory_config: "serviceDirectoryConfig",
          ssl_ca: "sslCa",
          server_version: "serverVersion",
        },
      },
      bitbucket_cloud_config: {
        name: "bitbucketCloudConfig",
        fields: {
          webhook_secret_secret_version: "webhookSecretSecretVersion",
          read_authorizer_credential: {
            name: "readAuthorizerCredential",
            fields: {
              user_token_secret_version: "userTokenSecretVersion",
            },
          },
          authorizer_credential: {
            name: "authorizerCredential",
            fields: {
              user_token_secret_version: "userTokenSecretVersion",
            },
          },
        },
      },
      installation_state: {
        name: "installationState",
        fields: {
          action_uri: "actionUri",
        },
      },
    },
  },
  next_page_token: "nextPageToken",
};

const listConnections: AppBlock = {
  name: "List Connections",
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
            description:
              "Required. The parent, which owns this collection of Connections. Format: `projects/*/locations/*`.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description: "Number of results to return in the list.",
          type: {
            type: "integer",
            description: "Number of results to return in the list.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description: "Page start.",
          type: {
            type: "string",
            description: "Page start.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listConnections(request, (err: any, response: any) => {
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
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                            "A SecretManager resource containing the OAuth token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
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
                      description: "64-bit integer as string",
                    },
                  },
                  description:
                    "Configuration for connections to github.com. (Part of 'connection_config' - only one field in this group can be set)",
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
                      description: "64-bit integer as string",
                    },
                    appSlug: {
                      type: "string",
                      description: "The URL-friendly name of the GitHub App.",
                    },
                    privateKeySecretVersion: {
                      type: "string",
                      description:
                        "SecretManager resource containing the private key of the GitHub App, formatted as `projects/*/secrets/*/versions/*`.",
                    },
                    webhookSecretSecretVersion: {
                      type: "string",
                      description:
                        "SecretManager resource containing the webhook secret of the GitHub App, formatted as `projects/*/secrets/*/versions/*`.",
                    },
                    appInstallationId: {
                      type: "string",
                      description: "64-bit integer as string",
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
                      required: ["service"],
                      description:
                        "ServiceDirectoryConfig represents Service Directory configuration for a connection.",
                      additionalProperties: true,
                    },
                    sslCa: {
                      type: "string",
                      description:
                        "SSL certificate to use for requests to GitHub Enterprise.",
                    },
                    serverVersion: {
                      type: "string",
                      description:
                        "Output only. GitHub Enterprise version installed at the host_uri.",
                    },
                  },
                  required: ["hostUri", "apiKey", "appId"],
                  description:
                    "Configuration for connections to an instance of GitHub Enterprise. (Part of 'connection_config' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                gitlabConfig: {
                  type: "object",
                  properties: {
                    hostUri: {
                      type: "string",
                      description:
                        "The URI of the GitLab Enterprise host this connection is for. If not specified, the default value is https://gitlab.com.",
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
                      required: ["userTokenSecretVersion"],
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
                      required: ["userTokenSecretVersion"],
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
                      required: ["service"],
                      description:
                        "ServiceDirectoryConfig represents Service Directory configuration for a connection.",
                      additionalProperties: true,
                    },
                    sslCa: {
                      type: "string",
                      description:
                        "SSL certificate to use for requests to GitLab Enterprise.",
                    },
                    serverVersion: {
                      type: "string",
                      description:
                        "Output only. Version of the GitLab Enterprise server running on the `host_uri`.",
                    },
                  },
                  required: [
                    "webhookSecretSecretVersion",
                    "readAuthorizerCredential",
                    "authorizerCredential",
                  ],
                  description:
                    "Configuration for connections to gitlab.com or an instance of GitLab Enterprise. (Part of 'connection_config' - only one field in this group can be set)",
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
                      required: ["userTokenSecretVersion"],
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
                      required: ["userTokenSecretVersion"],
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
                      required: ["service"],
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
                  required: [
                    "hostUri",
                    "webhookSecretSecretVersion",
                    "readAuthorizerCredential",
                    "authorizerCredential",
                  ],
                  description:
                    "Configuration for connections to Bitbucket Data Center. (Part of 'connection_config' - only one field in this group can be set)",
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
                      required: ["userTokenSecretVersion"],
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
                      required: ["userTokenSecretVersion"],
                      description:
                        "Represents a personal access token that authorized the Connection, and associated metadata.",
                      additionalProperties: true,
                    },
                  },
                  required: [
                    "workspace",
                    "webhookSecretSecretVersion",
                    "readAuthorizerCredential",
                    "authorizerCredential",
                  ],
                  description:
                    "Configuration for connections to Bitbucket Cloud. (Part of 'connection_config' - only one field in this group can be set)",
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
                    "If disabled is set to true, functionality is disabled for this connection. Repository based API methods and webhooks processing for repositories in this connection will be disabled.",
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
                    "Allows clients to store small amounts of arbitrary data.",
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
        },
        description: "Message for response to listing Connections.",
        additionalProperties: true,
      },
    },
  },
};

export default listConnections;
