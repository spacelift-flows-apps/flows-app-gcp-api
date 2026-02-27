import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlUsersServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  sqlserver_user_details: {
    name: "sqlserverUserDetails",
    fields: {
      server_roles: "serverRoles",
    },
  },
  iam_email: "iamEmail",
  password_policy: {
    name: "passwordPolicy",
    fields: {
      allowed_failed_attempts: "allowedFailedAttempts",
      password_expiration_duration: "passwordExpirationDuration",
      enable_failed_attempts_check: "enableFailedAttemptsCheck",
      status: {
        name: "status",
        fields: {
          password_expiration_time: "passwordExpirationTime",
        },
      },
      enable_password_verification: "enablePasswordVerification",
    },
  },
  dual_password_type: "dualPasswordType",
  iam_status: "iamStatus",
  database_roles: "databaseRoles",
};

const get: AppBlock = {
  name: "Get",
  description: `Retrieves a resource containing information about a user.`,
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
        name: {
          name: "Name",
          description: "User of the instance.",
          type: {
            type: "string",
            description: "User of the instance.",
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
        host: {
          name: "Host",
          description: "Host of a user of the instance.",
          type: {
            type: "string",
            description: "Host of a user of the instance.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlUsersServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.get(request, (err: any, response: any) => {
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
          sqlserverUserDetails: {
            type: "object",
            properties: {
              disabled: {
                type: "boolean",
                description: "If the user has been disabled",
              },
              serverRoles: {
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
          iamEmail: {
            type: "string",
            description:
              "Optional. The full email for an IAM user. For normal database users, this will not be filled. Only applicable to MySQL database users.",
          },
          passwordPolicy: {
            type: "object",
            properties: {
              allowedFailedAttempts: {
                type: "integer",
                description:
                  "Number of failed login attempts allowed before user get locked.",
              },
              passwordExpirationDuration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              enableFailedAttemptsCheck: {
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
                  passwordExpirationTime: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description: "Read-only password status.",
                additionalProperties: true,
              },
              enablePasswordVerification: {
                type: "boolean",
                description:
                  "If true, the user must specify the current password before changing the password. This flag is supported only for MySQL.",
              },
            },
            description: "User level password validation policy.",
            additionalProperties: true,
          },
          dualPasswordType: {
            type: "string",
            enum: [
              "DUAL_PASSWORD_TYPE_UNSPECIFIED",
              "NO_MODIFY_DUAL_PASSWORD",
              "NO_DUAL_PASSWORD",
              "DUAL_PASSWORD",
            ],
            description: "Dual password status for the user.",
          },
          iamStatus: {
            type: "string",
            enum: ["IAM_STATUS_UNSPECIFIED", "INACTIVE", "ACTIVE"],
            description:
              "Indicates if a group is active or inactive for IAM database authentication.",
          },
          databaseRoles: {
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
    },
  },
};

export default get;
