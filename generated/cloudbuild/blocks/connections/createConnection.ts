import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getRepositoryManagerClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  connection: {
    name: "connection",
    fields: {
      githubConfig: {
        name: "github_config",
        fields: {
          authorizerCredential: {
            name: "authorizer_credential",
            fields: {
              oauthTokenSecretVersion: "oauth_token_secret_version",
            },
          },
          appInstallationId: "app_installation_id",
        },
      },
      githubEnterpriseConfig: {
        name: "github_enterprise_config",
        fields: {
          hostUri: "host_uri",
          apiKey: "api_key",
          appId: "app_id",
          appSlug: "app_slug",
          privateKeySecretVersion: "private_key_secret_version",
          webhookSecretSecretVersion: "webhook_secret_secret_version",
          appInstallationId: "app_installation_id",
          serviceDirectoryConfig: "service_directory_config",
          sslCa: "ssl_ca",
        },
      },
      gitlabConfig: {
        name: "gitlab_config",
        fields: {
          hostUri: "host_uri",
          webhookSecretSecretVersion: "webhook_secret_secret_version",
          readAuthorizerCredential: {
            name: "read_authorizer_credential",
            fields: {
              userTokenSecretVersion: "user_token_secret_version",
            },
          },
          authorizerCredential: {
            name: "authorizer_credential",
            fields: {
              userTokenSecretVersion: "user_token_secret_version",
            },
          },
          serviceDirectoryConfig: "service_directory_config",
          sslCa: "ssl_ca",
        },
      },
      bitbucketDataCenterConfig: {
        name: "bitbucket_data_center_config",
        fields: {
          hostUri: "host_uri",
          webhookSecretSecretVersion: "webhook_secret_secret_version",
          readAuthorizerCredential: {
            name: "read_authorizer_credential",
            fields: {
              userTokenSecretVersion: "user_token_secret_version",
            },
          },
          authorizerCredential: {
            name: "authorizer_credential",
            fields: {
              userTokenSecretVersion: "user_token_secret_version",
            },
          },
          serviceDirectoryConfig: "service_directory_config",
          sslCa: "ssl_ca",
        },
      },
      bitbucketCloudConfig: {
        name: "bitbucket_cloud_config",
        fields: {
          webhookSecretSecretVersion: "webhook_secret_secret_version",
          readAuthorizerCredential: {
            name: "read_authorizer_credential",
            fields: {
              userTokenSecretVersion: "user_token_secret_version",
            },
          },
          authorizerCredential: {
            name: "authorizer_credential",
            fields: {
              userTokenSecretVersion: "user_token_secret_version",
            },
          },
        },
      },
    },
  },
  connectionId: "connection_id",
};

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

const createConnection: AppBlock = {
  name: "Create Connection",
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
            description:
              "Required. Project and location where the connection will be created. Format: `projects/*/locations/*`.",
          },
          required: true,
        },
        connection: {
          name: "Connection",
          description: "Required. The Connection to create.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Immutable. The resource name of the connection, in the format `projects/{project}/locations/{location}/connections/{connection_id}`.",
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
              disabled: {
                type: "boolean",
                description:
                  "If disabled is set to true, functionality is disabled for this connection. Repository based API methods and webhooks processing for repositories in this connection will be disabled.",
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
          required: true,
        },
        connectionId: {
          name: "Connection Id",
          description:
            "Required. The ID to use for the Connection, which will become the final component of the Connection's resource name. Names must be unique per-project per-location. Allows alphanumeric characters and any of -._~%!$&'()*+,;=@.",
          type: {
            type: "string",
            description:
              "Required. The ID to use for the Connection, which will become the final component of the Connection's resource name. Names must be unique per-project per-location. Allows alphanumeric characters and any of -._~%!$&'()*+,;=@.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createConnection(request, (err: any, response: any) => {
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
          name: {
            type: "string",
          },
          metadata: {
            type: "object",
            properties: {
              typeUrl: {
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
                    typeUrl: {
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
              typeUrl: {
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

export default createConnection;
