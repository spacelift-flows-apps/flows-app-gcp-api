import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

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
        page_size: {
          name: "Page Size",
          description: "Number of results to return in the list.",
          type: {
            type: "integer",
            description: "Number of results to return in the list.",
          },
          required: false,
        },
        page_token: {
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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

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
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                update_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                    server_version: {
                      type: "string",
                      description:
                        "Output only. GitHub Enterprise version installed at the host_uri.",
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
                        username: {
                          type: "string",
                          description:
                            "Output only. The username associated to this token.",
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
                        username: {
                          type: "string",
                          description:
                            "Output only. The username associated to this token.",
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
                    server_version: {
                      type: "string",
                      description:
                        "Output only. Version of the GitLab Enterprise server running on the `host_uri`.",
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
                        username: {
                          type: "string",
                          description:
                            "Output only. The username associated to this token.",
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
                        username: {
                          type: "string",
                          description:
                            "Output only. The username associated to this token.",
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
                    server_version: {
                      type: "string",
                      description:
                        "Output only. Version of the Bitbucket Data Center running on the `host_uri`.",
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
                        username: {
                          type: "string",
                          description:
                            "Output only. The username associated to this token.",
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
                        username: {
                          type: "string",
                          description:
                            "Output only. The username associated to this token.",
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
                installation_state: {
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
                    action_uri: {
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
          next_page_token: {
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
