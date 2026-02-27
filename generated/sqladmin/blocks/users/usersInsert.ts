import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const usersInsert: AppBlock = {
  name: "Users - Insert",
  description: `Creates a new user in a Cloud SQL instance.`,
  category: "Users",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description: "The name of the Cloud SQL instance.",
          type: {
            type: "string",
            description:
              "The name of the Cloud SQL instance. This does not include the project ID. Can be omitted for `update` because it is already specified on the URL.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "This is always 'sql#user'.",
          type: {
            type: "string",
            description: "This is always `sql#user`.",
          },
          required: false,
        },
        password: {
          name: "Password",
          description: "The password for the user.",
          type: {
            type: "string",
            description: "The password for the user.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "The name of the user in the Cloud SQL instance.",
          type: {
            type: "string",
            description:
              "The name of the user in the Cloud SQL instance. Can be omitted for `update` because it is already specified in the URL.",
          },
          required: false,
        },
        host: {
          name: "Host",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The host from which the user can connect. For `insert` operations, host defaults to an empty string. For `update` operations, host is specified as part of the request URL. The host name cannot be updated after insertion. For a MySQL instance, it's required; for a PostgreSQL or SQL Server instance, it's optional.",
          },
          required: false,
        },
        type: {
          name: "Type",
          description: "The user type.",
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
          required: false,
        },
        sqlserverUserDetails: {
          name: "Sqlserver User Details",
          description: "Request body field: sqlserverUserDetails",
          type: {
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
          required: false,
        },
        iamEmail: {
          name: "IAM Email",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The full email for an IAM user. For normal database users, this will not be filled. Only applicable to MySQL database users.",
          },
          required: false,
        },
        passwordPolicy: {
          name: "Password Policy",
          description: "User level password validation policy.",
          type: {
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
          required: false,
        },
        dualPasswordType: {
          name: "Dual Password Type",
          description: "Dual password status for the user.",
          type: {
            type: "string",
            enum: [
              "DUAL_PASSWORD_TYPE_UNSPECIFIED",
              "NO_MODIFY_DUAL_PASSWORD",
              "NO_DUAL_PASSWORD",
              "DUAL_PASSWORD",
            ],
            description: "Dual password status for the user.",
          },
          required: false,
        },
        iamStatus: {
          name: "IAM Status",
          description:
            "Indicates if a group is active or inactive for IAM database authentication.",
          type: {
            type: "string",
            enum: ["IAM_STATUS_UNSPECIFIED", "INACTIVE", "ACTIVE"],
            description:
              "Indicates if a group is active or inactive for IAM database authentication.",
          },
          required: false,
        },
        databaseRoles: {
          name: "Database Roles",
          description: "Optional.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Optional. Role memberships of the user",
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
        let path = `v1/projects/{project}/instances/{instance}/users`;

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
        requestBody.projectId = input.app.config.projectId;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.password !== undefined)
          requestBody.password = input.event.inputConfig.password;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.host !== undefined)
          requestBody.host = input.event.inputConfig.host;
        if (input.event.inputConfig.instance !== undefined)
          requestBody.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.type !== undefined)
          requestBody.type = input.event.inputConfig.type;
        if (input.event.inputConfig.sqlserverUserDetails !== undefined)
          requestBody.sqlserverUserDetails =
            input.event.inputConfig.sqlserverUserDetails;
        if (input.event.inputConfig.iamEmail !== undefined)
          requestBody.iamEmail = input.event.inputConfig.iamEmail;
        if (input.event.inputConfig.passwordPolicy !== undefined)
          requestBody.passwordPolicy = input.event.inputConfig.passwordPolicy;
        if (input.event.inputConfig.dualPasswordType !== undefined)
          requestBody.dualPasswordType =
            input.event.inputConfig.dualPasswordType;
        if (input.event.inputConfig.iamStatus !== undefined)
          requestBody.iamStatus = input.event.inputConfig.iamStatus;
        if (input.event.inputConfig.databaseRoles !== undefined)
          requestBody.databaseRoles = input.event.inputConfig.databaseRoles;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
            description: "This is always `sql#operation`.",
          },
          targetLink: {
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
          insertTime: {
            type: "string",
            description:
              "The time this operation was enqueued in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
          },
          startTime: {
            type: "string",
            description:
              "The time this operation actually started in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
          },
          endTime: {
            type: "string",
            description:
              "The time this operation finished in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
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
          apiWarning: {
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
          operationType: {
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
              "The type of the operation. Valid values are: * `CREATE` * `DELETE` * `UPDATE` * `RESTART` * `IMPORT` * `EXPORT` * `BACKUP_VOLUME` * `RESTORE_VOLUME` * `CREATE_USER` * `DELETE_USER` * `CREATE_DATABASE` * `DELETE_DATABASE`",
          },
          importContext: {
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
              fileType: {
                type: "string",
                enum: ["SQL_FILE_TYPE_UNSPECIFIED", "SQL", "CSV", "BAK", "TDE"],
                description:
                  "The file type for the specified uri.\\`SQL`: The file contains SQL statements. \\`CSV`: The file contains CSV data.",
              },
              csvImportOptions: {
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
                  escapeCharacter: {
                    type: "string",
                    description:
                      "Specifies the character that should appear before a data character that needs to be escaped.",
                  },
                  quoteCharacter: {
                    type: "string",
                    description:
                      "Specifies the quoting character to be used when a data value is quoted.",
                  },
                  fieldsTerminatedBy: {
                    type: "string",
                    description:
                      "Specifies the character that separates columns within each row (line) of the file.",
                  },
                  linesTerminatedBy: {
                    type: "string",
                    description:
                      "This is used to separate lines. If a line does not contain all fields, the rest of the columns are set to their default values.",
                  },
                },
                description: "Options for importing data as CSV.",
                additionalProperties: true,
              },
              importUser: {
                type: "string",
                description:
                  "The PostgreSQL user for this import operation. PostgreSQL instances only.",
              },
              bakImportOptions: {
                type: "object",
                properties: {
                  encryptionOptions: {
                    type: "object",
                    properties: {
                      certPath: {
                        type: "string",
                        description:
                          "Path to the Certificate (.cer) in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
                      },
                      pvkPath: {
                        type: "string",
                        description:
                          "Path to the Certificate Private Key (.pvk) in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
                      },
                      pvkPassword: {
                        type: "string",
                        description: "Password that encrypts the private key",
                      },
                      keepEncrypted: {
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
                  noRecovery: {
                    type: "boolean",
                    description:
                      "Whether or not the backup importing will restore database with NORECOVERY option. Applies only to Cloud SQL for SQL Server.",
                  },
                  recoveryOnly: {
                    type: "boolean",
                    description:
                      'Whether or not the backup importing request will just bring database online without downloading Bak content only one of "no_recovery" and "recovery_only" can be true otherwise error will return. Applies only to Cloud SQL for SQL Server.',
                  },
                  bakType: {
                    type: "string",
                    enum: ["BAK_TYPE_UNSPECIFIED", "FULL", "DIFF", "TLOG"],
                    description: "Type of the bak content, FULL or DIFF",
                  },
                  stopAt: {
                    type: "string",
                    description:
                      "Optional. The timestamp when the import should stop. This timestamp is in the [RFC 3339](https://tools.ietf.org/html/rfc3339) format (for example, `2023-10-01T16:19:00.094`). This field is equivalent to the STOPAT keyword and applies to Cloud SQL for SQL Server only. (Format: google-datetime)",
                  },
                  stopAtMark: {
                    type: "string",
                    description:
                      "Optional. The marked transaction where the import should stop. This field is equivalent to the STOPATMARK keyword and applies to Cloud SQL for SQL Server only.",
                  },
                },
                description:
                  "Import parameters specific to SQL Server .BAK files",
                additionalProperties: true,
              },
              sqlImportOptions: {
                type: "object",
                properties: {
                  threads: {
                    type: "integer",
                    description:
                      "Optional. The number of threads to use for parallel import. (Format: int32)",
                  },
                  parallel: {
                    type: "boolean",
                    description:
                      "Optional. Whether or not the import should be parallel.",
                  },
                  postgresImportOptions: {
                    type: "object",
                    properties: {
                      clean: {
                        type: "boolean",
                        description:
                          "Optional. The --clean flag for the pg_restore utility. This flag applies only if you enabled Cloud SQL to import files in parallel.",
                      },
                      ifExists: {
                        type: "boolean",
                        description:
                          "Optional. The --if-exists flag for the pg_restore utility. This flag applies only if you enabled Cloud SQL to import files in parallel.",
                      },
                    },
                    description:
                      "Optional. Options for importing from a Cloud SQL for PostgreSQL instance.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Optional. Options for importing data from SQL statements.",
                additionalProperties: true,
              },
              tdeImportOptions: {
                type: "object",
                properties: {
                  certificatePath: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate public key in the form gs://bucketName/fileName. The instance must have read access to the file. Applicable only for SQL Server instances.",
                  },
                  privateKeyPath: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate private key in the form gs://bucketName/fileName. The instance must have read access to the file. Applicable only for SQL Server instances.",
                  },
                  privateKeyPassword: {
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
                description:
                  "Optional. Import parameters specific to SQL Server TDE certificates",
                additionalProperties: true,
              },
            },
            description: "Database instance import context.",
            additionalProperties: true,
          },
          exportContext: {
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
                  "Databases to be exported. `MySQL instances:` If `fileType` is `SQL` and no database is specified, all databases are exported, except for the `mysql` system database. If `fileType` is `CSV`, you can specify one database, either by using this property or by using the `csvExportOptions.selectQuery` property, which takes precedence over this property. `PostgreSQL instances:` If you don't specify a database by name, all user databases in the instance are exported. This excludes system databases and Cloud SQL databases used to manage internal operations. Exporting all user databases is only available for directory-formatted parallel export. If `fileType` is `CSV`, this database must match the one specified in the `csvExportOptions.selectQuery` property. `SQL Server instances:` You must specify one database to be exported, and the `fileType` must be `BAK`.",
              },
              kind: {
                type: "string",
                description: "This is always `sql#exportContext`.",
              },
              sqlExportOptions: {
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
                  schemaOnly: {
                    type: "boolean",
                    description: "Export only schemas.",
                  },
                  mysqlExportOptions: {
                    type: "object",
                    properties: {
                      masterData: {
                        type: "integer",
                        description:
                          "Option to include SQL statement required to set up replication. If set to `1`, the dump file includes a CHANGE MASTER TO statement with the binary log coordinates, and --set-gtid-purged is set to ON. If set to `2`, the CHANGE MASTER TO statement is written as a SQL comment and has no effect. If set to any value other than `1`, --set-gtid-purged is set to OFF. (Format: int32)",
                      },
                    },
                    description: "Options for exporting from MySQL.",
                    additionalProperties: true,
                  },
                  threads: {
                    type: "integer",
                    description:
                      "Optional. The number of threads to use for parallel export. (Format: int32)",
                  },
                  parallel: {
                    type: "boolean",
                    description:
                      "Optional. Whether or not the export should be parallel.",
                  },
                  postgresExportOptions: {
                    type: "object",
                    properties: {
                      clean: {
                        type: "boolean",
                        description:
                          "Optional. Use this option to include DROP <object> SQL statements. Use these statements to delete database objects before running the import operation.",
                      },
                      ifExists: {
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
                description: "Options for exporting data as SQL statements.",
                additionalProperties: true,
              },
              csvExportOptions: {
                type: "object",
                properties: {
                  selectQuery: {
                    type: "string",
                    description: "The select query used to extract the data.",
                  },
                  escapeCharacter: {
                    type: "string",
                    description:
                      "Specifies the character that should appear before a data character that needs to be escaped.",
                  },
                  quoteCharacter: {
                    type: "string",
                    description:
                      "Specifies the quoting character to be used when a data value is quoted.",
                  },
                  fieldsTerminatedBy: {
                    type: "string",
                    description:
                      "Specifies the character that separates columns within each row (line) of the file.",
                  },
                  linesTerminatedBy: {
                    type: "string",
                    description:
                      "This is used to separate lines. If a line does not contain all fields, the rest of the columns are set to their default values.",
                  },
                },
                description:
                  "Options for exporting data as CSV. `MySQL` and `PostgreSQL` instances only.",
                additionalProperties: true,
              },
              fileType: {
                type: "string",
                enum: ["SQL_FILE_TYPE_UNSPECIFIED", "SQL", "CSV", "BAK", "TDE"],
                description: "The file type for the specified uri.",
              },
              offload: {
                type: "boolean",
                description: "Whether to perform a serverless export.",
              },
              bakExportOptions: {
                type: "object",
                properties: {
                  striped: {
                    type: "boolean",
                    description: "Whether or not the export should be striped.",
                  },
                  stripeCount: {
                    type: "integer",
                    description:
                      "Option for specifying how many stripes to use for the export. If blank, and the value of the striped field is true, the number of stripes is automatically chosen. (Format: int32)",
                  },
                  bakType: {
                    type: "string",
                    enum: ["BAK_TYPE_UNSPECIFIED", "FULL", "DIFF", "TLOG"],
                    description:
                      "Type of this bak file will be export, FULL or DIFF, SQL Server only",
                  },
                  copyOnly: {
                    type: "boolean",
                    description:
                      "Deprecated: copy_only is deprecated. Use differential_base instead",
                  },
                  differentialBase: {
                    type: "boolean",
                    description:
                      "Whether or not the backup can be used as a differential base copy_only backup can not be served as differential base",
                  },
                  exportLogStartTime: {
                    type: "string",
                    description:
                      "Optional. The begin timestamp when transaction log will be included in the export operation. [RFC 3339](https://tools.ietf.org/html/rfc3339) format (for example, `2023-10-01T16:19:00.094`) in UTC. When omitted, all available logs from the beginning of retention period will be included. Only applied to Cloud SQL for SQL Server. (Format: google-datetime)",
                  },
                  exportLogEndTime: {
                    type: "string",
                    description:
                      "Optional. The end timestamp when transaction log will be included in the export operation. [RFC 3339](https://tools.ietf.org/html/rfc3339) format (for example, `2023-10-01T16:19:00.094`) in UTC. When omitted, all available logs until current time will be included. Only applied to Cloud SQL for SQL Server. (Format: google-datetime)",
                  },
                },
                description:
                  "Options for exporting BAK files (SQL Server-only)",
                additionalProperties: true,
              },
              tdeExportOptions: {
                type: "object",
                properties: {
                  certificatePath: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate public key in the form gs://bucketName/fileName. The instance must have write access to the bucket. Applicable only for SQL Server instances.",
                  },
                  privateKeyPath: {
                    type: "string",
                    description:
                      "Required. Path to the TDE certificate private key in the form gs://bucketName/fileName. The instance must have write access to the location. Applicable only for SQL Server instances.",
                  },
                  privateKeyPassword: {
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
                description:
                  "Optional. Export parameters specific to SQL Server TDE certificates",
                additionalProperties: true,
              },
            },
            description: "Database instance export context.",
            additionalProperties: true,
          },
          backupContext: {
            type: "object",
            properties: {
              backupId: {
                type: "string",
                description: "The identifier of the backup. (Format: int64)",
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
          preCheckMajorVersionUpgradeContext: {
            type: "object",
            properties: {
              targetDatabaseVersion: {
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
                description:
                  "Required. The target database version to upgrade to.",
              },
              preCheckResponse: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "The message to be displayed to the user.",
                    },
                    messageType: {
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
                    actionsRequired: {
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
            description: "Pre-check major version upgrade context.",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.",
          },
          targetId: {
            type: "string",
            description: "Name of the resource on which this operation runs.",
          },
          selfLink: {
            type: "string",
            description: "The URI of this resource.",
          },
          targetProject: {
            type: "string",
            description:
              "The project ID of the target instance related to this operation.",
          },
          acquireSsrsLeaseContext: {
            type: "object",
            properties: {
              setupLogin: {
                type: "string",
                description:
                  "The username to be used as the setup login to connect to the database server for SSRS setup.",
              },
              serviceLogin: {
                type: "string",
                description:
                  "The username to be used as the service login to connect to the report database for SSRS setup.",
              },
              reportDatabase: {
                type: "string",
                description: "The report database to be used for SSRS setup.",
              },
              duration: {
                type: "string",
                description:
                  "Lease duration needed for SSRS setup. (Format: google-duration)",
              },
            },
            description: "Acquire SSRS lease context.",
            additionalProperties: true,
          },
          subOperationType: {
            type: "object",
            properties: {
              maintenanceType: {
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
          "An Operation resource. For successful operations that return an Operation resource, only the fields relevant to the operation are populated in the resource.",
        additionalProperties: true,
      },
    },
  },
};

export default usersInsert;
