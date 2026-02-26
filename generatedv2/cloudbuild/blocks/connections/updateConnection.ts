import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const updateConnection: AppBlock = {
  name: "Update Connection",
  description: `Updates a single connection.`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        connection: {
          name: "Connection",
          description: "Required. The Connection to update.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Immutable. The resource name of the connection, in the format `projects/{project}/locations/{location}/connections/{connection_id}`.",
              },
              github_config: {
                type: "object",
                properties: {
                  authorizer_credential: {
                    type: "object",
                    properties: {
                      oauth_token_secret_version: {
                        type: "string",
                        description:
                          "A SecretManager resource containing the OAuth token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                      },
                    },
                    description:
                      "Represents an OAuth token of the account that authorized the Connection, and associated metadata.",
                    additionalProperties: true,
                  },
                  app_installation_id: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                },
                description:
                  "Configuration for connections to github.com. (Part of 'connection_config' - only one field in this group can be set)",
                additionalProperties: true,
              },
              github_enterprise_config: {
                type: "object",
                properties: {
                  host_uri: {
                    type: "string",
                    description:
                      "Required. The URI of the GitHub Enterprise host this connection is for.",
                  },
                  api_key: {
                    type: "string",
                    description:
                      "Required. API Key used for authentication of webhook events.",
                  },
                  app_id: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  app_slug: {
                    type: "string",
                    description: "The URL-friendly name of the GitHub App.",
                  },
                  private_key_secret_version: {
                    type: "string",
                    description:
                      "SecretManager resource containing the private key of the GitHub App, formatted as `projects/*/secrets/*/versions/*`.",
                  },
                  webhook_secret_secret_version: {
                    type: "string",
                    description:
                      "SecretManager resource containing the webhook secret of the GitHub App, formatted as `projects/*/secrets/*/versions/*`.",
                  },
                  app_installation_id: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  service_directory_config: {
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
                  ssl_ca: {
                    type: "string",
                    description:
                      "SSL certificate to use for requests to GitHub Enterprise.",
                  },
                },
                required: ["host_uri", "api_key", "app_id"],
                description:
                  "Configuration for connections to an instance of GitHub Enterprise. (Part of 'connection_config' - only one field in this group can be set)",
                additionalProperties: true,
              },
              gitlab_config: {
                type: "object",
                properties: {
                  host_uri: {
                    type: "string",
                    description:
                      "The URI of the GitLab Enterprise host this connection is for. If not specified, the default value is https://gitlab.com.",
                  },
                  webhook_secret_secret_version: {
                    type: "string",
                    description:
                      "Required. Immutable. SecretManager resource containing the webhook secret of a GitLab Enterprise project, formatted as `projects/*/secrets/*/versions/*`.",
                  },
                  read_authorizer_credential: {
                    type: "object",
                    properties: {
                      user_token_secret_version: {
                        type: "string",
                        description:
                          "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                      },
                    },
                    required: ["user_token_secret_version"],
                    description:
                      "Represents a personal access token that authorized the Connection, and associated metadata.",
                    additionalProperties: true,
                  },
                  authorizer_credential: {
                    type: "object",
                    properties: {
                      user_token_secret_version: {
                        type: "string",
                        description:
                          "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                      },
                    },
                    required: ["user_token_secret_version"],
                    description:
                      "Represents a personal access token that authorized the Connection, and associated metadata.",
                    additionalProperties: true,
                  },
                  service_directory_config: {
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
                  ssl_ca: {
                    type: "string",
                    description:
                      "SSL certificate to use for requests to GitLab Enterprise.",
                  },
                },
                required: [
                  "webhook_secret_secret_version",
                  "read_authorizer_credential",
                  "authorizer_credential",
                ],
                description:
                  "Configuration for connections to gitlab.com or an instance of GitLab Enterprise. (Part of 'connection_config' - only one field in this group can be set)",
                additionalProperties: true,
              },
              bitbucket_data_center_config: {
                type: "object",
                properties: {
                  host_uri: {
                    type: "string",
                    description:
                      "Required. The URI of the Bitbucket Data Center instance or cluster this connection is for.",
                  },
                  webhook_secret_secret_version: {
                    type: "string",
                    description:
                      "Required. Immutable. SecretManager resource containing the webhook secret used to verify webhook events, formatted as `projects/*/secrets/*/versions/*`.",
                  },
                  read_authorizer_credential: {
                    type: "object",
                    properties: {
                      user_token_secret_version: {
                        type: "string",
                        description:
                          "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                      },
                    },
                    required: ["user_token_secret_version"],
                    description:
                      "Represents a personal access token that authorized the Connection, and associated metadata.",
                    additionalProperties: true,
                  },
                  authorizer_credential: {
                    type: "object",
                    properties: {
                      user_token_secret_version: {
                        type: "string",
                        description:
                          "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                      },
                    },
                    required: ["user_token_secret_version"],
                    description:
                      "Represents a personal access token that authorized the Connection, and associated metadata.",
                    additionalProperties: true,
                  },
                  service_directory_config: {
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
                  ssl_ca: {
                    type: "string",
                    description:
                      "Optional. SSL certificate to use for requests to the Bitbucket Data Center.",
                  },
                },
                required: [
                  "host_uri",
                  "webhook_secret_secret_version",
                  "read_authorizer_credential",
                  "authorizer_credential",
                ],
                description:
                  "Configuration for connections to Bitbucket Data Center. (Part of 'connection_config' - only one field in this group can be set)",
                additionalProperties: true,
              },
              bitbucket_cloud_config: {
                type: "object",
                properties: {
                  workspace: {
                    type: "string",
                    description:
                      "Required. The Bitbucket Cloud Workspace ID to be connected to Google Cloud Platform.",
                  },
                  webhook_secret_secret_version: {
                    type: "string",
                    description:
                      "Required. SecretManager resource containing the webhook secret used to verify webhook events, formatted as `projects/*/secrets/*/versions/*`.",
                  },
                  read_authorizer_credential: {
                    type: "object",
                    properties: {
                      user_token_secret_version: {
                        type: "string",
                        description:
                          "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                      },
                    },
                    required: ["user_token_secret_version"],
                    description:
                      "Represents a personal access token that authorized the Connection, and associated metadata.",
                    additionalProperties: true,
                  },
                  authorizer_credential: {
                    type: "object",
                    properties: {
                      user_token_secret_version: {
                        type: "string",
                        description:
                          "Required. A SecretManager resource containing the user token that authorizes the Cloud Build connection. Format: `projects/*/secrets/*/versions/*`.",
                      },
                    },
                    required: ["user_token_secret_version"],
                    description:
                      "Represents a personal access token that authorized the Connection, and associated metadata.",
                    additionalProperties: true,
                  },
                },
                required: [
                  "workspace",
                  "webhook_secret_secret_version",
                  "read_authorizer_credential",
                  "authorizer_credential",
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
        update_mask: {
          name: "Update Mask",
          description: "The list of fields to be updated.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: false,
        },
        allow_missing: {
          name: "Allow Missing",
          description:
            "If set to true, and the connection is not found a new connection will be created. In this situation `update_mask` is ignored. The creation will succeed only if the input connection has all the necessary information (e.g a github_config with both  user_oauth_token and installation_id properties).",
          type: {
            type: "boolean",
            description:
              "If set to true, and the connection is not found a new connection will be created. In this situation `update_mask` is ignored. The creation will succeed only if the input connection has all the necessary information (e.g a github_config with both  user_oauth_token and installation_id properties).",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description:
            "The current etag of the connection. If an etag is provided and does not match the current etag of the connection, update will be blocked and an ABORTED error will be returned.",
          type: {
            type: "string",
            description:
              "The current etag of the connection. If an etag is provided and does not match the current etag of the connection, update will be blocked and an ABORTED error will be returned.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.connection !== undefined)
          request.connection = input.event.inputConfig.connection;
        if (input.event.inputConfig.update_mask !== undefined)
          request.update_mask = input.event.inputConfig.update_mask;
        if (input.event.inputConfig.allow_missing !== undefined)
          request.allow_missing = input.event.inputConfig.allow_missing;
        if (input.event.inputConfig.etag !== undefined)
          request.etag = input.event.inputConfig.etag;

        const result = await new Promise<any>((resolve, reject) => {
          client.updateConnection(request, (err: any, response: any) => {
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

export default updateConnection;
