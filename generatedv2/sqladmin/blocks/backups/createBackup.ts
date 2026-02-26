import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlBackupsServiceClient } from "../../lib/grpcClient.ts";

const createBackup: AppBlock = {
  name: "Create Backup",
  description: `Creates a backup for a Cloud SQL instance. This API can be used only to create on-demand backups.`,
  category: "Backups",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The parent resource where this backup is created. Format: projects/{project}",
          type: {
            type: "string",
            description:
              "Required. The parent resource where this backup is created. Format: projects/{project}",
          },
          required: true,
        },
        backup: {
          name: "Backup",
          description: "Required. The Backup to create.",
          type: {
            type: "object",
            properties: {
              description: {
                type: "string",
                description: "The description of this backup.",
              },
              instance: {
                type: "string",
                description: "The name of the source database instance.",
              },
              location: {
                type: "string",
                description:
                  "The storage location of the backups. The location can be multi-regional.",
              },
              ttl_days: {
                type: "string",
                description:
                  "64-bit integer as string (Part of 'expiration' - only one field in this group can be set)",
              },
              expiry_time: {
                type: "string",
                description:
                  "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z') (Part of 'expiration' - only one field in this group can be set)",
              },
            },
            description: "A backup resource.",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlBackupsServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.backup !== undefined)
          request.backup = input.event.inputConfig.backup;

        const result = await new Promise<any>((resolve, reject) => {
          client.createBackup(request, (err: any, response: any) => {
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
            description: "This is always `sql#operation`.",
          },
          target_link: {
            type: "string",
          },
          status: {
            type: "string",
            enum: [
              "SQL_OPERATION_STATUS_UNSPECIFIED",
              "PENDING",
              "RUNNING",
              "DONE",
            ],
            description: "The status of an operation.",
          },
          user: {
            type: "string",
            description:
              "The email address of the user who initiated this operation.",
          },
          insert_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          start_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          end_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          error: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description: "This is always `sql#operationErrors`.",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                      description: "This is always `sql#operationError`.",
                    },
                    code: {
                      type: "string",
                      description:
                        "Identifies the specific error that occurred.",
                    },
                    message: {
                      type: "string",
                      description:
                        "Additional information about the error encountered.",
                    },
                  },
                  description: "Database instance operation error.",
                  additionalProperties: true,
                },
                description:
                  "The list of errors encountered while processing this operation.",
              },
            },
            description: "Database instance operation errors list wrapper.",
            additionalProperties: true,
          },
          api_warning: {
            type: "object",
            properties: {
              code: {
                type: "string",
                enum: [
                  "SQL_API_WARNING_CODE_UNSPECIFIED",
                  "REGION_UNREACHABLE",
                  "MAX_RESULTS_EXCEEDS_LIMIT",
                  "COMPROMISED_CREDENTIALS",
                  "INTERNAL_STATE_FAILURE",
                ],
                description: "Code to uniquely identify the warning type.",
              },
              message: {
                type: "string",
                description: "The warning message.",
              },
              region: {
                type: "string",
                description: "The region name for REGION_UNREACHABLE warning.",
              },
            },
            description: "An Admin API warning message.",
            additionalProperties: true,
          },
          operation_type: {
            type: "string",
            enum: [
              "SQL_OPERATION_TYPE_UNSPECIFIED",
              "IMPORT",
              "EXPORT",
              "CREATE",
              "UPDATE",
              "DELETE",
              "RESTART",
              "BACKUP",
              "SNAPSHOT",
              "BACKUP_VOLUME",
              "DELETE_VOLUME",
              "RESTORE_VOLUME",
              "INJECT_USER",
              "CLONE",
              "STOP_REPLICA",
              "START_REPLICA",
              "PROMOTE_REPLICA",
              "CREATE_REPLICA",
              "CREATE_USER",
              "DELETE_USER",
              "UPDATE_USER",
              "CREATE_DATABASE",
              "DELETE_DATABASE",
              "UPDATE_DATABASE",
              "FAILOVER",
              "DELETE_BACKUP",
              "RECREATE_REPLICA",
              "TRUNCATE_LOG",
              "DEMOTE_MASTER",
              "MAINTENANCE",
              "ENABLE_PRIVATE_IP",
              "DEFER_MAINTENANCE",
              "CREATE_CLONE",
              "RESCHEDULE_MAINTENANCE",
              "START_EXTERNAL_SYNC",
              "LOG_CLEANUP",
              "AUTO_RESTART",
              "REENCRYPT",
              "SWITCHOVER",
              "UPDATE_BACKUP",
              "ACQUIRE_SSRS_LEASE",
              "RELEASE_SSRS_LEASE",
              "RECONFIGURE_OLD_PRIMARY",
              "CLUSTER_MAINTENANCE",
              "SELF_SERVICE_MAINTENANCE",
              "SWITCHOVER_TO_REPLICA",
              "MAJOR_VERSION_UPGRADE",
              "ADVANCED_BACKUP",
              "MANAGE_BACKUP",
              "ENHANCED_BACKUP",
              "REPAIR_READ_POOL",
              "CREATE_READ_POOL",
            ],
            description:
              "The type of the operation. Valid values are: *  `CREATE` *  `DELETE` *  `UPDATE` *  `RESTART` *  `IMPORT` *  `EXPORT` *  `BACKUP_VOLUME` *  `RESTORE_VOLUME` *  `CREATE_USER` *  `DELETE_USER` *  `CREATE_DATABASE` *  `DELETE_DATABASE`",
          },
          import_context: {
            type: "object",
            properties: {
              uri: {
                type: "string",
                description:
                  "Path to the import file in Cloud Storage, in the form `gs://bucketName/fileName`. Compressed gzip files (.gz) are supported when `fileType` is `SQL`. The instance must have write permissions to the bucket and read access to the file.",
              },
              database: {
                type: "string",
                description:
                  "The target database for the import. If `fileType` is `SQL`, this field is required only if the import file does not specify a database, and is overridden by any database specification in the import file. For entire instance parallel import operations, the database is overridden by the database name stored in subdirectory name. If `fileType` is `CSV`, one database must be specified.",
              },
              kind: {
                type: "string",
                description: "This is always `sql#importContext`.",
              },
              file_type: {
                type: "string",
                enum: ["SQL_FILE_TYPE_UNSPECIFIED", "SQL", "CSV", "BAK", "TDE"],
                description:
                  "The file type for the specified uri.\\`SQL`: The file contains SQL statements. \\`CSV`: The file contains CSV data.",
              },
              csv_import_options: {
                type: "object",
                properties: {
                  table: {
                    type: "string",
                    description: "The table to which CSV data is imported.",
                  },
                  columns: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The columns to which CSV data is imported. If not specified, all columns of the database table are loaded with CSV data.",
                  },
                  escape_character: {
                    type: "string",
                    description:
                      "Specifies the character that should appear before a data character that needs to be escaped.",
                  },
                  quote_character: {
                    type: "string",
                    description:
                      "Specifies the quoting character to be used when a data value is quoted.",
                  },
                  fields_terminated_by: {
                    type: "string",
                    description:
                      "Specifies the character that separates columns within each row (line) of the file.",
                  },
                  lines_terminated_by: {
                    type: "string",
                    description:
                      "This is used to separate lines. If a line does not contain all fields, the rest of the columns are set to their default values.",
                  },
                },
                additionalProperties: true,
                description: "Options for importing data as CSV.",
              },
              import_user: {
                type: "string",
                description:
                  "The PostgreSQL user for this import operation. PostgreSQL instances only.",
              },
              bak_import_options: {
                type: "object",
                properties: {
                  encryption_options: {
                    type: "object",
                    properties: {
                      cert_path: {
                        type: "string",
                        description:
                          "Path to the Certificate (.cer) in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
                      },
                      pvk_path: {
                        type: "string",
                        description:
                          "Path to the Certificate Private Key (.pvk)  in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
                      },
                      pvk_password: {
                        type: "string",
                        description: "Password that encrypts the private key",
                      },
                      keep_encrypted: {
                        type: "boolean",
                        description:
                          "Optional. Whether the imported file remains encrypted.",
                      },
                    },
                    additionalProperties: true,
                  },
                  striped: {
                    type: "boolean",
                    description:
                      "Whether or not the backup set being restored is striped. Applies only to Cloud SQL for SQL Server.",
                  },
                  no_recovery: {
                    type: "boolean",
                    description:
                      "Whether or not the backup importing will restore database with NORECOVERY option. Applies only to Cloud SQL for SQL Server.",
                  },
                  recovery_only: {
                    type: "boolean",
                    description:
                      'Whether or not the backup importing request will just bring database online without downloading Bak content only one of "no_recovery" and "recovery_only" can be true otherwise error will return. Applies only to Cloud SQL for SQL Server.',
                  },
                  bak_type: {
                    type: "string",
                    enum: ["BAK_TYPE_UNSPECIFIED", "FULL", "DIFF", "TLOG"],
                    description: "Type of the bak content, FULL or DIFF",
                  },
                  stop_at: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  stop_at_mark: {
                    type: "string",
                    description:
                      "Optional. The marked transaction where the import should stop. This field is equivalent to the STOPATMARK keyword and applies to Cloud SQL for SQL Server only.",
                  },
                },
                additionalProperties: true,
                description:
                  "Import parameters specific to SQL Server .BAK files",
              },
              sql_import_options: {
                type: "object",
                properties: {
                  threads: {
                    type: "integer",
                    description:
                      "Optional. The number of threads to use for parallel import.",
                  },
                  parallel: {
                    type: "boolean",
                    description:
                      "Optional. Whether or not the import should be parallel.",
                  },
                  postgres_import_options: {
                    type: "object",
                    properties: {
                      clean: {
                        type: "boolean",
                        description:
                          "Optional. The --clean flag for the pg_restore utility. This flag applies only if you enabled Cloud SQL to import files in parallel.",
                      },
                      if_exists: {
                        type: "boolean",
                        description:
                          "Optional. The --if-exists flag for the pg_restore utility. This flag applies only if you enabled Cloud SQL to import files in parallel.",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "Optional. Options for importing from a Cloud SQL for PostgreSQL instance.",
                  },
                },
                additionalProperties: true,
                description:
                  "Optional. Options for importing data from SQL statements.",
              },
              tde_import_options: {
                type: "object",
                properties: {
                  certificate_path: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate public key in the form gs://bucketName/fileName. The instance must have read access to the file. Applicable only for SQL Server instances.",
                  },
                  private_key_path: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate private key in the form gs://bucketName/fileName. The instance must have read access to the file. Applicable only for SQL Server instances.",
                  },
                  private_key_password: {
                    type: "string",
                    description:
                      "Required. Password that encrypts the private key.",
                  },
                  name: {
                    type: "string",
                    description:
                      "Required. Certificate name. Applicable only for SQL Server instances.",
                  },
                },
                required: [
                  "certificate_path",
                  "private_key_path",
                  "private_key_password",
                  "name",
                ],
                additionalProperties: true,
                description:
                  "Optional. Import parameters specific to SQL Server TDE certificates",
              },
            },
            description: "Database instance import context.",
            additionalProperties: true,
          },
          export_context: {
            type: "object",
            properties: {
              uri: {
                type: "string",
                description:
                  "The path to the file in Google Cloud Storage where the export will be stored. The URI is in the form `gs://bucketName/fileName`. If the file already exists, the request succeeds, but the operation fails. If `fileType` is `SQL` and the filename ends with .gz, the contents are compressed.",
              },
              databases: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Databases to be exported. <br /> `MySQL instances:` If `fileType` is `SQL` and no database is specified, all databases are exported, except for the `mysql` system database. If `fileType` is `CSV`, you can specify one database, either by using this property or by using the `csvExportOptions.selectQuery` property, which takes precedence over this property. <br /> `PostgreSQL instances:` If you don't specify a database by name, all user databases in the instance are exported. This excludes system databases and Cloud SQL databases used to manage internal operations. Exporting all user databases is only available for directory-formatted parallel export. If `fileType` is `CSV`, this database must match the one specified in the `csvExportOptions.selectQuery` property. <br /> `SQL Server instances:` You must specify one database to be exported, and the `fileType` must be `BAK`.",
              },
              kind: {
                type: "string",
                description: "This is always `sql#exportContext`.",
              },
              sql_export_options: {
                type: "object",
                properties: {
                  tables: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Tables to export, or that were exported, from the specified database. If you specify tables, specify one and only one database. For PostgreSQL instances, you can specify only one table.",
                  },
                  schema_only: {
                    type: "boolean",
                    description: "Export only schemas.",
                  },
                  mysql_export_options: {
                    type: "object",
                    properties: {
                      master_data: {
                        type: "integer",
                        description:
                          "Option to include SQL statement required to set up replication. If set to `1`, the dump file includes a CHANGE MASTER TO statement with the binary log coordinates, and --set-gtid-purged is set to ON. If set to `2`, the CHANGE MASTER TO statement is written as a SQL comment and has no effect. If set to any value other than `1`, --set-gtid-purged is set to OFF.",
                      },
                    },
                    description: "Options for exporting from MySQL.",
                    additionalProperties: true,
                  },
                  threads: {
                    type: "integer",
                    description:
                      "Optional. The number of threads to use for parallel export.",
                  },
                  parallel: {
                    type: "boolean",
                    description:
                      "Optional. Whether or not the export should be parallel.",
                  },
                  postgres_export_options: {
                    type: "object",
                    properties: {
                      clean: {
                        type: "boolean",
                        description:
                          "Optional. Use this option to include DROP <code>&lt;object&gt;</code> SQL statements. Use these statements to delete database objects before running the import operation.",
                      },
                      if_exists: {
                        type: "boolean",
                        description:
                          "Optional. Option to include an IF EXISTS SQL statement with each DROP statement produced by clean.",
                      },
                    },
                    description:
                      "Options for exporting from a Cloud SQL for PostgreSQL instance.",
                    additionalProperties: true,
                  },
                },
                additionalProperties: true,
                description: "Options for exporting data as SQL statements.",
              },
              csv_export_options: {
                type: "object",
                properties: {
                  select_query: {
                    type: "string",
                    description: "The select query used to extract the data.",
                  },
                  escape_character: {
                    type: "string",
                    description:
                      "Specifies the character that should appear before a data character that needs to be escaped.",
                  },
                  quote_character: {
                    type: "string",
                    description:
                      "Specifies the quoting character to be used when a data value is quoted.",
                  },
                  fields_terminated_by: {
                    type: "string",
                    description:
                      "Specifies the character that separates columns within each row (line) of the file.",
                  },
                  lines_terminated_by: {
                    type: "string",
                    description:
                      "This is used to separate lines. If a line does not contain all fields, the rest of the columns are set to their default values.",
                  },
                },
                additionalProperties: true,
                description:
                  "Options for exporting data as CSV. `MySQL` and `PostgreSQL` instances only.",
              },
              file_type: {
                type: "string",
                enum: ["SQL_FILE_TYPE_UNSPECIFIED", "SQL", "CSV", "BAK", "TDE"],
                description: "The file type for the specified uri.",
              },
              offload: {
                type: "boolean",
                description: "Whether to perform a serverless export.",
              },
              bak_export_options: {
                type: "object",
                properties: {
                  striped: {
                    type: "boolean",
                    description: "Whether or not the export should be striped.",
                  },
                  stripe_count: {
                    type: "integer",
                    description:
                      "Option for specifying how many stripes to use for the export. If blank, and the value of the striped field is true, the number of stripes is automatically chosen.",
                  },
                  bak_type: {
                    type: "string",
                    enum: ["BAK_TYPE_UNSPECIFIED", "FULL", "DIFF", "TLOG"],
                    description:
                      "Type of this bak file will be export, FULL or DIFF, SQL Server only",
                  },
                  copy_only: {
                    type: "boolean",
                    description:
                      "Deprecated: copy_only is deprecated. Use differential_base instead",
                  },
                  differential_base: {
                    type: "boolean",
                    description:
                      "Whether or not the backup can be used as a differential base copy_only backup can not be served as differential base",
                  },
                  export_log_start_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  export_log_end_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description:
                  "Options for exporting BAK files (SQL Server-only)",
                additionalProperties: true,
              },
              tde_export_options: {
                type: "object",
                properties: {
                  certificate_path: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate public key in the form gs://bucketName/fileName. The instance must have write access to the bucket. Applicable only for SQL Server instances.",
                  },
                  private_key_path: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate private key in the form gs://bucketName/fileName. The instance must have write access to the location. Applicable only for SQL Server instances.",
                  },
                  private_key_password: {
                    type: "string",
                    description:
                      "Required. Password that encrypts the private key.",
                  },
                  name: {
                    type: "string",
                    description:
                      "Required. Certificate name. Applicable only for SQL Server instances.",
                  },
                },
                required: [
                  "certificate_path",
                  "private_key_path",
                  "private_key_password",
                  "name",
                ],
                additionalProperties: true,
                description:
                  "Optional. Export parameters specific to SQL Server TDE certificates",
              },
            },
            description: "Database instance export context.",
            additionalProperties: true,
          },
          backup_context: {
            type: "object",
            properties: {
              backup_id: {
                type: "string",
                description: "64-bit integer as string",
              },
              kind: {
                type: "string",
                description: "This is always `sql#backupContext`.",
              },
              name: {
                type: "string",
                description:
                  "The name of the backup. Format: projects/{project}/backups/{backup}",
              },
            },
            description: "Backup context.",
            additionalProperties: true,
          },
          pre_check_major_version_upgrade_context: {
            type: "object",
            properties: {
              target_database_version: {
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
              pre_check_response: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "The message to be displayed to the user.",
                    },
                    message_type: {
                      type: "string",
                      enum: [
                        "MESSAGE_TYPE_UNSPECIFIED",
                        "INFO",
                        "WARNING",
                        "ERROR",
                      ],
                      description:
                        "The type of message whether it is an info, warning, or error.",
                    },
                    actions_required: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The actions that the user needs to take. Use repeated for multiple actions.",
                    },
                  },
                  description:
                    "Structured PreCheckResponse containing message, type, and required actions.",
                  additionalProperties: true,
                },
                description:
                  "Output only. The responses from the precheck operation.",
              },
              kind: {
                type: "string",
                description:
                  "Optional. This is always `sql#preCheckMajorVersionUpgradeContext`.",
              },
            },
            required: ["target_database_version"],
            description: "Pre-check major version upgrade context.",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.",
          },
          target_id: {
            type: "string",
            description: "Name of the resource on which this operation runs.",
          },
          self_link: {
            type: "string",
            description: "The URI of this resource.",
          },
          target_project: {
            type: "string",
            description:
              "The project ID of the target instance related to this operation.",
          },
          acquire_ssrs_lease_context: {
            type: "object",
            properties: {
              setup_login: {
                type: "string",
                description:
                  "The username to be used as the setup login to connect to the database server for SSRS setup.",
              },
              service_login: {
                type: "string",
                description:
                  "The username to be used as the service login to connect to the report database for SSRS setup.",
              },
              report_database: {
                type: "string",
                description: "The report database to be used for SSRS setup.",
              },
              duration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
            },
            description: "Acquire SSRS lease context.",
            additionalProperties: true,
          },
          sub_operation_type: {
            type: "object",
            properties: {
              maintenance_type: {
                type: "string",
                enum: [
                  "SQL_MAINTENANCE_TYPE_UNSPECIFIED",
                  "INSTANCE_MAINTENANCE",
                  "REPLICA_INCLUDED_MAINTENANCE",
                  "INSTANCE_SELF_SERVICE_MAINTENANCE",
                  "REPLICA_INCLUDED_SELF_SERVICE_MAINTENANCE",
                ],
                description:
                  "The type of maintenance to be performed on the instance.",
              },
            },
            description: "The sub operation type based on the operation type.",
            additionalProperties: true,
          },
        },
        description:
          "An Operation resource.&nbsp;For successful operations that return an Operation resource, only the fields relevant to the operation are populated in the resource.",
        additionalProperties: true,
      },
    },
  },
};

export default createBackup;
