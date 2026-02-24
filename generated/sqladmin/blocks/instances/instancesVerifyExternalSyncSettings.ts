import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesVerifyExternalSyncSettings: AppBlock = {
  name: "Instances - Verify External Sync Settings",
  description: `Verify External primary instance external sync settings.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Cloud SQL instance ID. This does not include the project ID.",
          type: {
            type: "string",
          },
          required: true,
        },
        verifyConnectionOnly: {
          name: "Verify Connection Only",
          description: "Flag to enable verifying connection only",
          type: {
            type: "boolean",
            description: "Flag to enable verifying connection only",
          },
          required: false,
        },
        syncMode: {
          name: "Sync Mode",
          description: "External sync mode",
          type: {
            type: "string",
            enum: ["EXTERNAL_SYNC_MODE_UNSPECIFIED", "ONLINE", "OFFLINE"],
            description: "External sync mode",
          },
          required: false,
        },
        verifyReplicationOnly: {
          name: "Verify Replication Only",
          description: "Optional.",
          type: {
            type: "boolean",
            description:
              "Optional. Flag to verify settings required by replication setup only",
          },
          required: false,
        },
        mysqlSyncConfig: {
          name: "Mysql Sync Config",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              initialSyncFlags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the flag.",
                    },
                    value: {
                      type: "string",
                      description:
                        "The value of the flag. This field must be omitted if the flag doesn't take a value.",
                    },
                  },
                  description:
                    "Initial sync flags for certain Cloud SQL APIs. Currently used for the MySQL external server initial dump.",
                  additionalProperties: true,
                },
                description: "Flags to use for the initial dump.",
              },
            },
            description: "MySQL-specific external server sync settings.",
            additionalProperties: true,
          },
          required: false,
        },
        migrationType: {
          name: "Migration Type",
          description: "Optional.",
          type: {
            type: "string",
            enum: ["MIGRATION_TYPE_UNSPECIFIED", "LOGICAL", "PHYSICAL"],
            description:
              "Optional. MigrationType configures the migration to use physical files or logical dump files. If not set, then the logical dump file configuration is used. Valid values are `LOGICAL` or `PHYSICAL`. Only applicable to MySQL.",
          },
          required: false,
        },
        syncParallelLevel: {
          name: "Sync Parallel Level",
          description: "Optional.",
          type: {
            type: "string",
            enum: [
              "EXTERNAL_SYNC_PARALLEL_LEVEL_UNSPECIFIED",
              "MIN",
              "OPTIMAL",
              "MAX",
            ],
            description:
              "Optional. Parallel level for initial data sync. Only applicable for PostgreSQL.",
          },
          required: false,
        },
        selectedObjects: {
          name: "Selected Objects",
          description: "Optional.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                database: {
                  type: "string",
                  description:
                    "The name of the database that Cloud SQL migrates.",
                },
              },
              description: "The selected object that Cloud SQL migrates.",
              additionalProperties: true,
            },
            description:
              "Optional. Migrate only the specified objects from the source instance. If this field is empty, then migrate all objects.",
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
        let path = `v1/projects/{project}/instances/{instance}/verifyExternalSyncSettings`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.verifyConnectionOnly !== undefined)
          requestBody.verifyConnectionOnly =
            input.event.inputConfig.verifyConnectionOnly;
        if (input.event.inputConfig.syncMode !== undefined)
          requestBody.syncMode = input.event.inputConfig.syncMode;
        if (input.event.inputConfig.verifyReplicationOnly !== undefined)
          requestBody.verifyReplicationOnly =
            input.event.inputConfig.verifyReplicationOnly;
        if (input.event.inputConfig.mysqlSyncConfig !== undefined)
          requestBody.mysqlSyncConfig = input.event.inputConfig.mysqlSyncConfig;
        if (input.event.inputConfig.migrationType !== undefined)
          requestBody.migrationType = input.event.inputConfig.migrationType;
        if (input.event.inputConfig.syncParallelLevel !== undefined)
          requestBody.syncParallelLevel =
            input.event.inputConfig.syncParallelLevel;
        if (input.event.inputConfig.selectedObjects !== undefined)
          requestBody.selectedObjects = input.event.inputConfig.selectedObjects;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
          kind: {
            type: "string",
            description: "This is always `sql#migrationSettingErrorList`.",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description:
                    "Can be `sql#externalSyncSettingError` or `sql#externalSyncSettingWarning`.",
                },
                type: {
                  type: "string",
                  enum: [
                    "SQL_EXTERNAL_SYNC_SETTING_ERROR_TYPE_UNSPECIFIED",
                    "CONNECTION_FAILURE",
                    "BINLOG_NOT_ENABLED",
                    "INCOMPATIBLE_DATABASE_VERSION",
                    "REPLICA_ALREADY_SETUP",
                    "INSUFFICIENT_PRIVILEGE",
                    "UNSUPPORTED_MIGRATION_TYPE",
                    "NO_PGLOGICAL_INSTALLED",
                    "PGLOGICAL_NODE_ALREADY_EXISTS",
                    "INVALID_WAL_LEVEL",
                    "INVALID_SHARED_PRELOAD_LIBRARY",
                    "INSUFFICIENT_MAX_REPLICATION_SLOTS",
                    "INSUFFICIENT_MAX_WAL_SENDERS",
                    "INSUFFICIENT_MAX_WORKER_PROCESSES",
                    "UNSUPPORTED_EXTENSIONS",
                    "INVALID_RDS_LOGICAL_REPLICATION",
                    "INVALID_LOGGING_SETUP",
                    "INVALID_DB_PARAM",
                    "UNSUPPORTED_GTID_MODE",
                    "SQLSERVER_AGENT_NOT_RUNNING",
                    "UNSUPPORTED_TABLE_DEFINITION",
                    "UNSUPPORTED_DEFINER",
                    "SQLSERVER_SERVERNAME_MISMATCH",
                    "PRIMARY_ALREADY_SETUP",
                    "UNSUPPORTED_BINLOG_FORMAT",
                    "BINLOG_RETENTION_SETTING",
                    "UNSUPPORTED_STORAGE_ENGINE",
                    "LIMITED_SUPPORT_TABLES",
                    "EXISTING_DATA_IN_REPLICA",
                    "MISSING_OPTIONAL_PRIVILEGES",
                    "RISKY_BACKUP_ADMIN_PRIVILEGE",
                    "INSUFFICIENT_GCS_PERMISSIONS",
                    "INVALID_FILE_INFO",
                    "UNSUPPORTED_DATABASE_SETTINGS",
                    "MYSQL_PARALLEL_IMPORT_INSUFFICIENT_PRIVILEGE",
                    "LOCAL_INFILE_OFF",
                    "TURN_ON_PITR_AFTER_PROMOTE",
                    "INCOMPATIBLE_DATABASE_MINOR_VERSION",
                    "SOURCE_MAX_SUBSCRIPTIONS",
                    "UNABLE_TO_VERIFY_DEFINERS",
                    "SUBSCRIPTION_CALCULATION_STATUS",
                    "PG_SUBSCRIPTION_COUNT",
                    "PG_SYNC_PARALLEL_LEVEL",
                    "INSUFFICIENT_DISK_SIZE",
                    "INSUFFICIENT_MACHINE_TIER",
                    "UNSUPPORTED_EXTENSIONS_NOT_MIGRATED",
                    "EXTENSIONS_NOT_MIGRATED",
                    "PG_CRON_FLAG_ENABLED_IN_REPLICA",
                    "EXTENSIONS_NOT_ENABLED_IN_REPLICA",
                    "UNSUPPORTED_COLUMNS",
                    "USERS_NOT_CREATED_IN_REPLICA",
                    "UNSUPPORTED_SYSTEM_OBJECTS",
                    "UNSUPPORTED_TABLES_WITH_REPLICA_IDENTITY",
                    "SELECTED_OBJECTS_NOT_EXIST_ON_SOURCE",
                    "PSC_ONLY_INSTANCE_WITH_NO_NETWORK_ATTACHMENT_URI",
                    "SELECTED_OBJECTS_REFERENCE_UNSELECTED_OBJECTS",
                    "PROMPT_DELETE_EXISTING",
                    "WILL_DELETE_EXISTING",
                    "PG_DDL_REPLICATION_INSUFFICIENT_PRIVILEGE",
                  ],
                  description: "Identifies the specific error that occurred.",
                },
                detail: {
                  type: "string",
                  description:
                    "Additional information about the error encountered.",
                },
              },
              description:
                "External primary instance migration setting error/warning.",
              additionalProperties: true,
            },
            description: "List of migration violations.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description:
                    "Can be `sql#externalSyncSettingError` or `sql#externalSyncSettingWarning`.",
                },
                type: {
                  type: "string",
                  enum: [
                    "SQL_EXTERNAL_SYNC_SETTING_ERROR_TYPE_UNSPECIFIED",
                    "CONNECTION_FAILURE",
                    "BINLOG_NOT_ENABLED",
                    "INCOMPATIBLE_DATABASE_VERSION",
                    "REPLICA_ALREADY_SETUP",
                    "INSUFFICIENT_PRIVILEGE",
                    "UNSUPPORTED_MIGRATION_TYPE",
                    "NO_PGLOGICAL_INSTALLED",
                    "PGLOGICAL_NODE_ALREADY_EXISTS",
                    "INVALID_WAL_LEVEL",
                    "INVALID_SHARED_PRELOAD_LIBRARY",
                    "INSUFFICIENT_MAX_REPLICATION_SLOTS",
                    "INSUFFICIENT_MAX_WAL_SENDERS",
                    "INSUFFICIENT_MAX_WORKER_PROCESSES",
                    "UNSUPPORTED_EXTENSIONS",
                    "INVALID_RDS_LOGICAL_REPLICATION",
                    "INVALID_LOGGING_SETUP",
                    "INVALID_DB_PARAM",
                    "UNSUPPORTED_GTID_MODE",
                    "SQLSERVER_AGENT_NOT_RUNNING",
                    "UNSUPPORTED_TABLE_DEFINITION",
                    "UNSUPPORTED_DEFINER",
                    "SQLSERVER_SERVERNAME_MISMATCH",
                    "PRIMARY_ALREADY_SETUP",
                    "UNSUPPORTED_BINLOG_FORMAT",
                    "BINLOG_RETENTION_SETTING",
                    "UNSUPPORTED_STORAGE_ENGINE",
                    "LIMITED_SUPPORT_TABLES",
                    "EXISTING_DATA_IN_REPLICA",
                    "MISSING_OPTIONAL_PRIVILEGES",
                    "RISKY_BACKUP_ADMIN_PRIVILEGE",
                    "INSUFFICIENT_GCS_PERMISSIONS",
                    "INVALID_FILE_INFO",
                    "UNSUPPORTED_DATABASE_SETTINGS",
                    "MYSQL_PARALLEL_IMPORT_INSUFFICIENT_PRIVILEGE",
                    "LOCAL_INFILE_OFF",
                    "TURN_ON_PITR_AFTER_PROMOTE",
                    "INCOMPATIBLE_DATABASE_MINOR_VERSION",
                    "SOURCE_MAX_SUBSCRIPTIONS",
                    "UNABLE_TO_VERIFY_DEFINERS",
                    "SUBSCRIPTION_CALCULATION_STATUS",
                    "PG_SUBSCRIPTION_COUNT",
                    "PG_SYNC_PARALLEL_LEVEL",
                    "INSUFFICIENT_DISK_SIZE",
                    "INSUFFICIENT_MACHINE_TIER",
                    "UNSUPPORTED_EXTENSIONS_NOT_MIGRATED",
                    "EXTENSIONS_NOT_MIGRATED",
                    "PG_CRON_FLAG_ENABLED_IN_REPLICA",
                    "EXTENSIONS_NOT_ENABLED_IN_REPLICA",
                    "UNSUPPORTED_COLUMNS",
                    "USERS_NOT_CREATED_IN_REPLICA",
                    "UNSUPPORTED_SYSTEM_OBJECTS",
                    "UNSUPPORTED_TABLES_WITH_REPLICA_IDENTITY",
                    "SELECTED_OBJECTS_NOT_EXIST_ON_SOURCE",
                    "PSC_ONLY_INSTANCE_WITH_NO_NETWORK_ATTACHMENT_URI",
                    "SELECTED_OBJECTS_REFERENCE_UNSELECTED_OBJECTS",
                    "PROMPT_DELETE_EXISTING",
                    "WILL_DELETE_EXISTING",
                    "PG_DDL_REPLICATION_INSUFFICIENT_PRIVILEGE",
                  ],
                  description: "Identifies the specific error that occurred.",
                },
                detail: {
                  type: "string",
                  description:
                    "Additional information about the error encountered.",
                },
              },
              description:
                "External primary instance migration setting error/warning.",
              additionalProperties: true,
            },
            description: "List of migration warnings.",
          },
        },
        description: "Instance verify external sync settings response.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesVerifyExternalSyncSettings;
