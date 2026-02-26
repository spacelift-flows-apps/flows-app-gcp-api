import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlUsersServiceClient } from "../../lib/grpcClient.ts";

const list: AppBlock = {
  name: "List",
  description: `Lists users in the specified Cloud SQL instance.`,
  category: "Users",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Database instance ID. This does not include the project ID.",
          type: {
            type: "string",
            description:
              "Database instance ID. This does not include the project ID.",
          },
          required: false,
        },
        project: {
          name: "Project",
          description: "Project ID of the project that contains the instance.",
          type: {
            type: "string",
            description:
              "Project ID of the project that contains the instance.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlUsersServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          request.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;

        const result = await new Promise<any>((resolve, reject) => {
          client.list(request, (err: any, response: any) => {
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
          kind: {
            type: "string",
            description: "This is always `sql#usersList`.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description: "This is always `sql#user`.",
                },
                password: {
                  type: "string",
                  description: "The password for the user.",
                },
                etag: {
                  type: "string",
                  description:
                    "This field is deprecated and will be removed from a future version of the API.",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the user in the Cloud SQL instance. Can be omitted for `update` because it is already specified in the URL.",
                },
                host: {
                  type: "string",
                  description:
                    "Optional. The host from which the user can connect. For `insert` operations, host defaults to an empty string. For `update` operations, host is specified as part of the request URL. The host name cannot be updated after insertion.  For a MySQL instance, it's required; for a PostgreSQL or SQL Server instance, it's optional.",
                },
                instance: {
                  type: "string",
                  description:
                    "The name of the Cloud SQL instance. This does not include the project ID. Can be omitted for `update` because it is already specified on the URL.",
                },
                project: {
                  type: "string",
                  description:
                    "The project ID of the project containing the Cloud SQL database. The Google apps domain is prefixed if applicable. Can be omitted for `update` because it is already specified on the URL.",
                },
                type: {
                  type: "string",
                  enum: [
                    "BUILT_IN",
                    "CLOUD_IAM_USER",
                    "CLOUD_IAM_SERVICE_ACCOUNT",
                    "CLOUD_IAM_GROUP",
                    "CLOUD_IAM_GROUP_USER",
                    "CLOUD_IAM_GROUP_SERVICE_ACCOUNT",
                    "ENTRAID_USER",
                  ],
                  description:
                    "The user type. It determines the method to authenticate the user during login. The default is the database's built-in user type.",
                },
                sqlserver_user_details: {
                  type: "object",
                  properties: {
                    disabled: {
                      type: "boolean",
                      description: "If the user has been disabled",
                    },
                    server_roles: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "The server roles for this user",
                    },
                  },
                  description:
                    "Represents a Sql Server user on the Cloud SQL instance.",
                  additionalProperties: true,
                },
                iam_email: {
                  type: "string",
                  description:
                    "Optional. The full email for an IAM user. For normal database users, this will not be filled. Only applicable to MySQL database users.",
                },
                password_policy: {
                  type: "object",
                  properties: {
                    allowed_failed_attempts: {
                      type: "integer",
                      description:
                        "Number of failed login attempts allowed before user get locked.",
                    },
                    password_expiration_duration: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    enable_failed_attempts_check: {
                      type: "boolean",
                      description:
                        "If true, failed login attempts check will be enabled.",
                    },
                    status: {
                      type: "object",
                      properties: {
                        locked: {
                          type: "boolean",
                          description:
                            "If true, user does not have login privileges.",
                        },
                        password_expiration_time: {
                          type: "string",
                          description:
                            "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                        },
                      },
                      description: "Read-only password status.",
                      additionalProperties: true,
                    },
                    enable_password_verification: {
                      type: "boolean",
                      description:
                        "If true, the user must specify the current password before changing the password. This flag is supported only for MySQL.",
                    },
                  },
                  description: "User level password validation policy.",
                  additionalProperties: true,
                },
                dual_password_type: {
                  type: "string",
                  enum: [
                    "DUAL_PASSWORD_TYPE_UNSPECIFIED",
                    "NO_MODIFY_DUAL_PASSWORD",
                    "NO_DUAL_PASSWORD",
                    "DUAL_PASSWORD",
                  ],
                  description: "Dual password status for the user.",
                },
                iam_status: {
                  type: "string",
                  enum: ["IAM_STATUS_UNSPECIFIED", "INACTIVE", "ACTIVE"],
                  description:
                    "Indicates if a group is active or inactive for IAM database authentication.",
                },
                database_roles: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Optional. Role memberships of the user",
                },
              },
              description: "A Cloud SQL user resource.",
              additionalProperties: true,
            },
            description: "List of user resources in the instance.",
          },
          next_page_token: {
            type: "string",
            description: "Unused.",
          },
        },
        description: "User list response.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
