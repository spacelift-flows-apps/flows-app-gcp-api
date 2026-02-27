import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlFlagsServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  databaseVersion: "database_version",
  flagScope: "flag_scope",
};

const outputMapping = {
  items: {
    name: "items",
    fields: {
      applies_to: "appliesTo",
      allowed_string_values: "allowedStringValues",
      min_value: "minValue",
      max_value: "maxValue",
      requires_restart: "requiresRestart",
      in_beta: "inBeta",
      allowed_int_values: "allowedIntValues",
      flag_scope: "flagScope",
      recommended_string_value: "recommendedStringValue",
      recommended_int_value: "recommendedIntValue",
    },
  },
};

const list: AppBlock = {
  name: "List",
  description: `Lists users in the specified Cloud SQL instance.`,
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
            description:
              "Database type and version you want to retrieve flags for. By default, this method returns flags for all database types and versions.",
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
            description: "Scopes of a flag describe where the flag is used.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlFlagsServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

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
                      "MYSQL_9_7",
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
                    description: "The database engine type and version.",
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
                  description: "64-bit integer as string",
                },
                maxValue: {
                  type: "string",
                  description: "64-bit integer as string",
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
                    description: "64-bit integer as string",
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
                  description:
                    "Scopes of a flag describe where the flag is used.",
                },
                recommendedStringValue: {
                  type: "string",
                  description:
                    "Recommended string value in string format for UI display. (Part of 'recommended_value' - only one field in this group can be set)",
                },
                recommendedIntValue: {
                  type: "string",
                  description:
                    "64-bit integer as string (Part of 'recommended_value' - only one field in this group can be set)",
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

export default list;
