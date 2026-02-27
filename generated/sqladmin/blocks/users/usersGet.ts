import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const usersGet: AppBlock = {
  name: "Users - Get",
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
          },
          required: true,
        },
        name: {
          name: "Name",
          description: "User of the instance.",
          type: {
            type: "string",
          },
          required: true,
        },
        host: {
          name: "Host",
          description: "Host of a user of the instance.",
          type: {
            type: "string",
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
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/sqlservice.admin",
            ],
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
        const baseUrl = "https://sqladmin.googleapis.com/";
        let path = `v1/projects/{project}/instances/{instance}/users/{name}`;

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
              "Optional. The host from which the user can connect. For `insert` operations, host defaults to an empty string. For `update` operations, host is specified as part of the request URL. The host name cannot be updated after insertion. For a MySQL instance, it's required; for a PostgreSQL or SQL Server instance, it's optional.",
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
                  "Number of failed login attempts allowed before user get locked. (Format: int32)",
              },
              passwordExpirationDuration: {
                type: "string",
                description:
                  "Expiration duration after password is updated. (Format: google-duration)",
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
                      "The expiration time of the current password. (Format: google-datetime)",
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

export default usersGet;
