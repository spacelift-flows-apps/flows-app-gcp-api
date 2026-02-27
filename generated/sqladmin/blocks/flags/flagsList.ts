import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const flagsList: AppBlock = {
  name: "Flags - List",
  description: `Lists all available database flags for Cloud SQL instances.`,
  category: "Flags",
  inputs: {
    default: {
      config: {
        databaseVersion: {
          name: "Database Version",
          description:
            "Database type and version you want to retrieve flags for. By default, this method returns flags for all database types and versions.",
          type: {
            type: "string",
          },
          required: false,
        },
        flagScope: {
          name: "Flag Scope",
          description:
            "Optional. Specify the scope of flags to be returned by SqlFlagsListService. Return list of database flags if unspecified.",
          type: {
            type: "string",
            enum: [
              "SQL_FLAG_SCOPE_UNSPECIFIED",
              "SQL_FLAG_SCOPE_DATABASE",
              "SQL_FLAG_SCOPE_CONNECTION_POOL",
            ],
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
        let path = `v1/flags`;

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
            description: "This is always `sql#flagsList`.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "This is the name of the flag. Flag names always use underscores, not hyphens, for example: `max_allowed_packet`",
                },
                type: {
                  type: "string",
                  enum: [
                    "SQL_FLAG_TYPE_UNSPECIFIED",
                    "BOOLEAN",
                    "STRING",
                    "INTEGER",
                    "NONE",
                    "MYSQL_TIMEZONE_OFFSET",
                    "FLOAT",
                    "REPEATED_STRING",
                  ],
                  description:
                    "The type of the flag. Flags are typed to being `BOOLEAN`, `STRING`, `INTEGER` or `NONE`. `NONE` is used for flags that do not take a value, such as `skip_grant_tables`.",
                },
                appliesTo: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "SQL_DATABASE_VERSION_UNSPECIFIED",
                      "MYSQL_5_1",
                      "MYSQL_5_5",
                      "MYSQL_5_6",
                      "MYSQL_5_7",
                      "MYSQL_8_0",
                      "MYSQL_8_0_18",
                      "MYSQL_8_0_26",
                      "MYSQL_8_0_27",
                      "MYSQL_8_0_28",
                      "MYSQL_8_0_29",
                      "MYSQL_8_0_30",
                      "MYSQL_8_0_31",
                      "MYSQL_8_0_32",
                      "MYSQL_8_0_33",
                      "MYSQL_8_0_34",
                      "MYSQL_8_0_35",
                      "MYSQL_8_0_36",
                      "MYSQL_8_0_37",
                      "MYSQL_8_0_39",
                      "MYSQL_8_0_40",
                      "MYSQL_8_0_41",
                      "MYSQL_8_0_42",
                      "MYSQL_8_0_43",
                      "MYSQL_8_0_44",
                      "MYSQL_8_0_45",
                      "MYSQL_8_0_46",
                      "MYSQL_8_4",
                      "SQLSERVER_2017_STANDARD",
                      "SQLSERVER_2017_ENTERPRISE",
                      "SQLSERVER_2017_EXPRESS",
                      "SQLSERVER_2017_WEB",
                      "POSTGRES_9_6",
                      "POSTGRES_10",
                      "POSTGRES_11",
                      "POSTGRES_12",
                      "POSTGRES_13",
                      "POSTGRES_14",
                      "POSTGRES_15",
                      "POSTGRES_16",
                      "POSTGRES_17",
                      "POSTGRES_18",
                      "SQLSERVER_2019_STANDARD",
                      "SQLSERVER_2019_ENTERPRISE",
                      "SQLSERVER_2019_EXPRESS",
                      "SQLSERVER_2019_WEB",
                      "SQLSERVER_2022_STANDARD",
                      "SQLSERVER_2022_ENTERPRISE",
                      "SQLSERVER_2022_EXPRESS",
                      "SQLSERVER_2022_WEB",
                    ],
                  },
                  description:
                    "The database version this flag applies to. Can be MySQL instances: `MYSQL_8_0`, `MYSQL_8_0_18`, `MYSQL_8_0_26`, `MYSQL_5_7`, or `MYSQL_5_6`. PostgreSQL instances: `POSTGRES_9_6`, `POSTGRES_10`, `POSTGRES_11` or `POSTGRES_12`. SQL Server instances: `SQLSERVER_2017_STANDARD`, `SQLSERVER_2017_ENTERPRISE`, `SQLSERVER_2017_EXPRESS`, `SQLSERVER_2017_WEB`, `SQLSERVER_2019_STANDARD`, `SQLSERVER_2019_ENTERPRISE`, `SQLSERVER_2019_EXPRESS`, or `SQLSERVER_2019_WEB`. See [the complete list](/sql/docs/mysql/admin-api/rest/v1/SqlDatabaseVersion).",
                },
                allowedStringValues: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "For `STRING` flags, a list of strings that the value can be set to.",
                },
                minValue: {
                  type: "string",
                  description:
                    "For `INTEGER` flags, the minimum allowed value. (Format: int64)",
                },
                maxValue: {
                  type: "string",
                  description:
                    "For `INTEGER` flags, the maximum allowed value. (Format: int64)",
                },
                requiresRestart: {
                  type: "boolean",
                  description:
                    "Indicates whether changing this flag will trigger a database restart. Only applicable to Second Generation instances.",
                },
                kind: {
                  type: "string",
                  description: "This is always `sql#flag`.",
                },
                inBeta: {
                  type: "boolean",
                  description: "Whether or not the flag is considered in beta.",
                },
                allowedIntValues: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "Format: int64",
                  },
                  description:
                    "Use this field if only certain integers are accepted. Can be combined with min_value and max_value to add additional values.",
                },
                flagScope: {
                  type: "string",
                  enum: [
                    "SQL_FLAG_SCOPE_UNSPECIFIED",
                    "SQL_FLAG_SCOPE_DATABASE",
                    "SQL_FLAG_SCOPE_CONNECTION_POOL",
                  ],
                  description: "Scope of flag.",
                },
                recommendedStringValue: {
                  type: "string",
                  description:
                    "Recommended string value in string format for UI display.",
                },
                recommendedIntValue: {
                  type: "string",
                  description:
                    "Recommended int value in integer format for UI display. (Format: int64)",
                },
              },
              description: "A flag resource.",
              additionalProperties: true,
            },
            description: "List of flags.",
          },
        },
        description: "Flags list response.",
        additionalProperties: true,
      },
    },
  },
};

export default flagsList;
