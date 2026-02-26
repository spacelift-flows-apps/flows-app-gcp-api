import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlInstancesServiceClient } from "../../lib/grpcClient.ts";

const restoreBackup: AppBlock = {
  name: "Restore Backup",
  description: `Restores a backup of a Cloud SQL instance. Using this operation might cause your instance to restart.`,
  category: "Backups",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Cloud SQL instance ID. This does not include the project ID.",
          type: {
            type: "string",
            description:
              "Cloud SQL instance ID. This does not include the project ID.",
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
        body: {
          name: "Body",
          description: "Body field",
          type: {
            type: "object",
            properties: {
              restore_backup_context: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                    description: "This is always `sql#restoreBackupContext`.",
                  },
                  backup_run_id: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  instance_id: {
                    type: "string",
                    description:
                      "The ID of the instance that the backup was taken from.",
                  },
                  project: {
                    type: "string",
                    description: "The full project ID of the source instance.",
                  },
                },
                description:
                  "Database instance restore from backup context. Backup context contains source instance id and project id.",
                additionalProperties: true,
              },
              backup: {
                type: "string",
                description:
                  "The name of the backup that's used to restore a Cloud SQL instance: Format:  projects/{project-id}/backups/{backup-uid}. Only one of restore_backup_context, backup, backupdr_backup can be passed to the input.",
              },
              backupdr_backup: {
                type: "string",
                description:
                  'The name of the backup that\'s used to restore a Cloud SQL instance: Format: "projects/{project-id}/locations/{location}/backupVaults/{backupvault}/dataSources/{datasource}/backups/{backup-uid}". Only one of restore_backup_context, backup, backupdr_backup can be passed to the input.',
              },
              restore_instance_settings: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                    description: "This is always `sql#instance`.",
                  },
                  state: {
                    type: "string",
                    enum: [
                      "SQL_INSTANCE_STATE_UNSPECIFIED",
                      "RUNNABLE",
                      "SUSPENDED",
                      "PENDING_DELETE",
                      "PENDING_CREATE",
                      "MAINTENANCE",
                      "FAILED",
                      "ONLINE_MAINTENANCE",
                      "REPAIRING",
                    ],
                    description:
                      "The current serving state of the Cloud SQL instance.",
                  },
                  database_version: {
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
                  settings: {
                    type: "object",
                    properties: {
                      settings_version: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      authorized_gae_applications: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "The App Engine app IDs that can access this instance. (Deprecated) Applied to First Generation instances only.",
                      },
                      tier: {
                        type: "string",
                        description:
                          "The tier (or machine type) for this instance, for example `db-custom-1-3840`. WARNING: Changing this restarts the instance.",
                      },
                      kind: {
                        type: "string",
                        description: "This is always `sql#settings`.",
                      },
                      user_labels: {
                        type: "object",
                        additionalProperties: {
                          type: "string",
                        },
                        description:
                          "User-provided labels, represented as a dictionary where each label is a single key value pair.",
                      },
                      availability_type: {
                        type: "string",
                        enum: [
                          "SQL_AVAILABILITY_TYPE_UNSPECIFIED",
                          "ZONAL",
                          "REGIONAL",
                        ],
                        description:
                          "The availability type of the given Cloud SQL instance.",
                      },
                      pricing_plan: {
                        type: "string",
                        enum: [
                          "SQL_PRICING_PLAN_UNSPECIFIED",
                          "PACKAGE",
                          "PER_USE",
                        ],
                        description: "The pricing plan for this instance.",
                      },
                      replication_type: {
                        type: "string",
                        enum: [
                          "SQL_REPLICATION_TYPE_UNSPECIFIED",
                          "SYNCHRONOUS",
                          "ASYNCHRONOUS",
                        ],
                        description:
                          "The type of replication this instance uses. This can be either `ASYNCHRONOUS` or `SYNCHRONOUS`. (Deprecated) This property was only applicable to First Generation instances.",
                      },
                      storage_auto_resize_limit: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      activation_policy: {
                        type: "string",
                        enum: [
                          "SQL_ACTIVATION_POLICY_UNSPECIFIED",
                          "ALWAYS",
                          "NEVER",
                          "ON_DEMAND",
                        ],
                        description:
                          "The activation policy specifies when the instance is activated; it is applicable only when the instance state is RUNNABLE. Valid values: *  `ALWAYS`: The instance is on, and remains so even in the absence of connection requests. *  `NEVER`: The instance is off; it is not activated, even if a connection request arrives.",
                      },
                      ip_configuration: {
                        type: "object",
                        properties: {
                          ipv4_enabled: {
                            type: "boolean",
                            description:
                              "Whether the instance is assigned a public IP address or not.",
                          },
                          private_network: {
                            type: "string",
                            description:
                              "The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `/projects/myProject/global/networks/default`. This setting can be updated, but it cannot be removed after it is set.",
                          },
                          require_ssl: {
                            type: "boolean",
                            description:
                              "Use `ssl_mode` instead.  Whether SSL/TLS connections over IP are enforced. If set to false, then allow both non-SSL/non-TLS and SSL/TLS connections. For SSL/TLS connections, the client certificate won't be verified. If set to true, then only allow connections encrypted with SSL/TLS and with valid client certificates. If you want to enforce SSL/TLS without enforcing the requirement for valid client certificates, then use the `ssl_mode` flag instead of the `require_ssl` flag.",
                          },
                          authorized_networks: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                value: {
                                  type: "string",
                                  description:
                                    "The allowlisted value for the access control list.",
                                },
                                expiration_time: {
                                  type: "string",
                                  description:
                                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                                },
                                name: {
                                  type: "string",
                                  description:
                                    "Optional. A label to identify this entry.",
                                },
                                kind: {
                                  type: "string",
                                  description: "This is always `sql#aclEntry`.",
                                },
                              },
                              description:
                                "An entry for an Access Control list.",
                              additionalProperties: true,
                            },
                            description:
                              "The list of external networks that are allowed to connect to the instance using the IP. In 'CIDR' notation, also known as 'slash' notation (for example: `157.197.200.0/24`).",
                          },
                          allocated_ip_range: {
                            type: "string",
                            description:
                              'The name of the allocated ip range for the private ip Cloud SQL instance. For example: "google-managed-services-default". If set, the instance ip will be created in the allocated range. The range name must comply with [RFC 1035](https://tools.ietf.org/html/rfc1035). Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?.`',
                          },
                          enable_private_path_for_google_cloud_services: {
                            type: "boolean",
                            description:
                              "Controls connectivity to private IP instances from Google services, such as BigQuery.",
                          },
                          ssl_mode: {
                            type: "string",
                            enum: [
                              "SSL_MODE_UNSPECIFIED",
                              "ALLOW_UNENCRYPTED_AND_ENCRYPTED",
                              "ENCRYPTED_ONLY",
                              "TRUSTED_CLIENT_CERTIFICATE_REQUIRED",
                            ],
                            description:
                              "Specify how SSL/TLS is enforced in database connections. If you must use the `require_ssl` flag for backward compatibility, then only the following value pairs are valid:  For PostgreSQL and MySQL:  * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false` * `ssl_mode=TRUSTED_CLIENT_CERTIFICATE_REQUIRED` and `require_ssl=true`  For SQL Server:  * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=true`  The value of `ssl_mode` has priority over the value of `require_ssl`.  For example, for the pair `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false`, `ssl_mode=ENCRYPTED_ONLY` means accept only SSL connections, while `require_ssl=false` means accept both non-SSL and SSL connections. In this case, MySQL and PostgreSQL databases respect `ssl_mode` and accepts only SSL connections.",
                          },
                          psc_config: {
                            type: "object",
                            properties: {
                              psc_enabled: {
                                type: "boolean",
                                description:
                                  "Whether PSC connectivity is enabled for this instance.",
                              },
                              allowed_consumer_projects: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Optional. The list of consumer projects that are allow-listed for PSC connections to this instance. This instance can be connected to with PSC from any network in these projects.  Each consumer project in this list may be represented by a project number (numeric) or by a project id (alphanumeric).",
                              },
                              psc_auto_connections: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    consumer_project: {
                                      type: "string",
                                      description:
                                        "Optional. This is the project ID of consumer service project of this consumer endpoint.  Optional. This is only applicable if consumer_network is a shared vpc network.",
                                    },
                                    consumer_network: {
                                      type: "string",
                                      description:
                                        "Optional. The consumer network of this consumer endpoint. This must be a resource path that includes both the host project and the network name.  For example, `projects/project1/global/networks/network1`.  The consumer host project of this network might be different from the consumer service project.",
                                    },
                                    ip_address: {
                                      type: "string",
                                      description:
                                        "The IP address of the consumer endpoint.",
                                    },
                                    status: {
                                      type: "string",
                                      description:
                                        "The connection status of the consumer endpoint.",
                                    },
                                    consumer_network_status: {
                                      type: "string",
                                      description:
                                        "The connection policy status of the consumer network.",
                                    },
                                  },
                                  description:
                                    "Settings for an automatically-setup Private Service Connect consumer endpoint that is used to connect to a Cloud SQL instance.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Optional. The list of settings for requested Private Service Connect consumer endpoints that can be used to connect to this Cloud SQL instance.",
                              },
                              network_attachment_uri: {
                                type: "string",
                                description:
                                  "Optional. The network attachment of the consumer network that the Private Service Connect enabled Cloud SQL instance is authorized to connect via PSC interface. format: projects/PROJECT/regions/REGION/networkAttachments/ID",
                              },
                            },
                            description:
                              "PSC settings for a Cloud SQL instance.",
                            additionalProperties: true,
                          },
                          server_ca_mode: {
                            type: "string",
                            enum: [
                              "CA_MODE_UNSPECIFIED",
                              "GOOGLE_MANAGED_INTERNAL_CA",
                              "GOOGLE_MANAGED_CAS_CA",
                              "CUSTOMER_MANAGED_CAS_CA",
                            ],
                            description:
                              "Specify what type of CA is used for the server certificate.",
                          },
                          custom_subject_alternative_names: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Optional. Custom Subject Alternative Name(SAN)s for a Cloud SQL instance.",
                          },
                          server_ca_pool: {
                            type: "string",
                            description:
                              "Optional. The resource name of the server CA pool for an instance with `CUSTOMER_MANAGED_CAS_CA` as the `server_ca_mode`. Format: projects/{PROJECT}/locations/{REGION}/caPools/{CA_POOL_ID}",
                          },
                          server_certificate_rotation_mode: {
                            type: "string",
                            enum: [
                              "SERVER_CERTIFICATE_ROTATION_MODE_UNSPECIFIED",
                              "NO_AUTOMATIC_ROTATION",
                              "AUTOMATIC_ROTATION_DURING_MAINTENANCE",
                            ],
                            description:
                              "Optional. Controls the automatic server certificate rotation feature. This feature is disabled by default. When enabled, the server certificate will be automatically rotated during Cloud SQL scheduled maintenance or self-service maintenance updates up to six months before it expires. This setting can only be set if server_ca_mode is either GOOGLE_MANAGED_CAS_CA or CUSTOMER_MANAGED_CAS_CA.",
                          },
                        },
                        description: "IP Management configuration.",
                        additionalProperties: true,
                      },
                      storage_auto_resize: {
                        type: "boolean",
                        description:
                          "Configuration to increase storage size automatically. The default value is true.",
                      },
                      location_preference: {
                        type: "object",
                        properties: {
                          follow_gae_application: {
                            type: "string",
                            description:
                              "The App Engine application to follow, it must be in the same region as the Cloud SQL instance. WARNING: Changing this might restart the instance.",
                          },
                          zone: {
                            type: "string",
                            description:
                              "The preferred Compute Engine zone (for example: us-central1-a, us-central1-b, etc.). WARNING: Changing this might restart the instance.",
                          },
                          secondary_zone: {
                            type: "string",
                            description:
                              "The preferred Compute Engine zone for the secondary/failover (for example: us-central1-a, us-central1-b, etc.). To disable this field, set it to 'no_secondary_zone'.",
                          },
                          kind: {
                            type: "string",
                            description:
                              "This is always `sql#locationPreference`.",
                          },
                        },
                        description:
                          "Preferred location. This specifies where a Cloud SQL instance is located. Note that if the preferred location is not available, the instance will be located as close as possible within the region. Only one location may be specified.",
                        additionalProperties: true,
                      },
                      database_flags: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              description:
                                "The name of the flag. These flags are passed at instance startup, so include both server options and system variables. Flags are specified with underscores, not hyphens. For more information, see [Configuring Database Flags](https://cloud.google.com/sql/docs/mysql/flags) in the Cloud SQL documentation.",
                            },
                            value: {
                              type: "string",
                              description:
                                "The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.",
                            },
                          },
                          description:
                            "Database flags for Cloud SQL instances.",
                          additionalProperties: true,
                        },
                        description:
                          "The database flags passed to the instance at startup.",
                      },
                      data_disk_type: {
                        type: "string",
                        enum: [
                          "SQL_DATA_DISK_TYPE_UNSPECIFIED",
                          "PD_SSD",
                          "PD_HDD",
                          "OBSOLETE_LOCAL_SSD",
                          "HYPERDISK_BALANCED",
                        ],
                        description:
                          "The type of disk that is used for a v2 instance to use.",
                      },
                      maintenance_window: {
                        type: "object",
                        properties: {
                          hour: {
                            type: "integer",
                            description:
                              "Hour of day - 0 to 23. Specify in the UTC time zone.",
                          },
                          day: {
                            type: "integer",
                            description:
                              "Day of week - `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, or `SUNDAY`. Specify in the UTC time zone. Returned in output as an integer, 1 to 7, where `1` equals Monday.",
                          },
                          update_track: {
                            type: "string",
                            enum: [
                              "SQL_UPDATE_TRACK_UNSPECIFIED",
                              "canary",
                              "stable",
                              "week5",
                            ],
                            description:
                              "Maintenance timing settings: `canary`, `stable`, or `week5`. For more information, see [About maintenance on Cloud SQL instances](https://cloud.google.com/sql/docs/mysql/maintenance).",
                          },
                          kind: {
                            type: "string",
                            description:
                              "This is always `sql#maintenanceWindow`.",
                          },
                        },
                        description:
                          "Maintenance window. This specifies when a Cloud SQL instance is restarted for system maintenance purposes.",
                        additionalProperties: true,
                      },
                      backup_configuration: {
                        type: "object",
                        properties: {
                          start_time: {
                            type: "string",
                            description:
                              "Start time for the daily backup configuration in UTC timezone in the 24 hour format - `HH:MM`.",
                          },
                          enabled: {
                            type: "boolean",
                            description:
                              "Whether this configuration is enabled.",
                          },
                          kind: {
                            type: "string",
                            description:
                              "This is always `sql#backupConfiguration`.",
                          },
                          binary_log_enabled: {
                            type: "boolean",
                            description:
                              "(MySQL only) Whether binary log is enabled. If backup configuration is disabled, binarylog must be disabled as well.",
                          },
                          replication_log_archiving_enabled: {
                            type: "boolean",
                            description: "Reserved for future use.",
                          },
                          location: {
                            type: "string",
                            description: "Location of the backup",
                          },
                          point_in_time_recovery_enabled: {
                            type: "boolean",
                            description:
                              "Whether point in time recovery is enabled.",
                          },
                          backup_retention_settings: {
                            type: "object",
                            properties: {
                              retention_unit: {
                                type: "string",
                                enum: ["RETENTION_UNIT_UNSPECIFIED", "COUNT"],
                                description:
                                  "The unit that 'retained_backups' represents.",
                              },
                              retained_backups: {
                                type: "integer",
                                description:
                                  "Depending on the value of retention_unit, this is used to determine if a backup needs to be deleted.  If retention_unit is 'COUNT', we will retain this many backups.",
                              },
                            },
                            description:
                              "We currently only support backup retention by specifying the number of backups we will retain.",
                            additionalProperties: true,
                          },
                          transaction_log_retention_days: {
                            type: "integer",
                            description:
                              "The number of days of transaction logs we retain for point in time restore, from 1-7.",
                          },
                        },
                        description: "Database instance backup configuration.",
                        additionalProperties: true,
                      },
                      database_replication_enabled: {
                        type: "boolean",
                        description:
                          "Configuration specific to read replica instances. Indicates whether replication is enabled or not. WARNING: Changing this restarts the instance.",
                      },
                      crash_safe_replication_enabled: {
                        type: "boolean",
                        description:
                          "Configuration specific to read replica instances. Indicates whether database flags for crash-safe replication are enabled. This property was only applicable to First Generation instances.",
                      },
                      data_disk_size_gb: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      active_directory_config: {
                        type: "object",
                        properties: {
                          kind: {
                            type: "string",
                            description:
                              "This is always sql#activeDirectoryConfig.",
                          },
                          domain: {
                            type: "string",
                            description:
                              "The name of the domain (e.g., mydomain.com).",
                          },
                          mode: {
                            type: "string",
                            enum: [
                              "ACTIVE_DIRECTORY_MODE_UNSPECIFIED",
                              "MANAGED_ACTIVE_DIRECTORY",
                              "SELF_MANAGED_ACTIVE_DIRECTORY",
                              "CUSTOMER_MANAGED_ACTIVE_DIRECTORY",
                            ],
                            description:
                              "Optional. The mode of the Active Directory configuration.",
                          },
                          dns_servers: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Optional. Domain controller IPv4 addresses used to bootstrap Active Directory.",
                          },
                          admin_credential_secret_name: {
                            type: "string",
                            description:
                              "Optional. The secret manager key storing the administrator credential. (e.g., projects/{project}/secrets/{secret}).",
                          },
                          organizational_unit: {
                            type: "string",
                            description:
                              "Optional. The organizational unit distinguished name. This is the full hierarchical path to the organizational unit.",
                          },
                        },
                        description:
                          "Active Directory configuration, relevant only for Cloud SQL for SQL Server.",
                        additionalProperties: true,
                      },
                      collation: {
                        type: "string",
                        description: "The name of server Instance collation.",
                      },
                      deny_maintenance_periods: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            start_date: {
                              type: "string",
                              description:
                                '"deny maintenance period" start date. If the year of the start date is empty, the year of the end date also must be empty. In this case, it means the deny maintenance period recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01',
                            },
                            end_date: {
                              type: "string",
                              description:
                                '"deny maintenance period" end date. If the year of the end date is empty, the year of the start date also must be empty. In this case, it means the no maintenance interval recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01',
                            },
                            time: {
                              type: "string",
                              description:
                                'Time in UTC when the "deny maintenance period" starts on start_date and ends on end_date. The time is in format: HH:mm:SS, i.e., 00:00:00',
                            },
                          },
                          description:
                            "Deny maintenance Periods. This specifies a date range during when all CSA rollout will be denied.",
                          additionalProperties: true,
                        },
                        description: "Deny maintenance periods",
                      },
                      insights_config: {
                        type: "object",
                        properties: {
                          query_insights_enabled: {
                            type: "boolean",
                            description:
                              "Whether Query Insights feature is enabled.",
                          },
                          record_client_address: {
                            type: "boolean",
                            description:
                              "Whether Query Insights will record client address when enabled.",
                          },
                          record_application_tags: {
                            type: "boolean",
                            description:
                              "Whether Query Insights will record application tags from query when enabled.",
                          },
                          query_string_length: {
                            type: "integer",
                            description:
                              "Maximum query length stored in bytes. Default value: 1024 bytes. Range: 256-4500 bytes. Query lengths greater than this field value will be truncated to this value. When unset, query length will be the default value. Changing query length will restart the database.",
                          },
                          query_plans_per_minute: {
                            type: "integer",
                            description:
                              "Number of query execution plans captured by Insights per minute for all queries combined. Default is 5.",
                          },
                          enhanced_query_insights_enabled: {
                            type: "boolean",
                            description:
                              "Optional. Whether enhanced query insights feature is enabled.",
                          },
                        },
                        description:
                          "Insights configuration. This specifies when Cloud SQL Insights feature is enabled and optional configuration.",
                        additionalProperties: true,
                      },
                      password_validation_policy: {
                        type: "object",
                        properties: {
                          min_length: {
                            type: "integer",
                            description:
                              "Minimum number of characters allowed.",
                          },
                          complexity: {
                            type: "string",
                            enum: [
                              "COMPLEXITY_UNSPECIFIED",
                              "COMPLEXITY_DEFAULT",
                            ],
                            description: "The complexity of the password.",
                          },
                          reuse_interval: {
                            type: "integer",
                            description:
                              "Number of previous passwords that cannot be reused.",
                          },
                          disallow_username_substring: {
                            type: "boolean",
                            description:
                              "Disallow username as a part of the password.",
                          },
                          password_change_interval: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                          enable_password_policy: {
                            type: "boolean",
                            description:
                              "Whether to enable the password policy or not. When enabled, passwords must meet complexity requirements. Keep this policy enabled to help prevent unauthorized access. Disabling this policy allows weak passwords.",
                          },
                          disallow_compromised_credentials: {
                            type: "boolean",
                            description:
                              "This field is deprecated and will be removed in a future version of the API.",
                          },
                        },
                        description:
                          "Database instance local user password validation policy. This message defines the password policy for local database users. When enabled, it enforces constraints on password complexity, length, and reuse. Keep this policy enabled to help prevent unauthorized access.",
                        additionalProperties: true,
                      },
                      sql_server_audit_config: {
                        type: "object",
                        properties: {
                          kind: {
                            type: "string",
                            description:
                              "This is always sql#sqlServerAuditConfig",
                          },
                          bucket: {
                            type: "string",
                            description:
                              "The name of the destination bucket (e.g., gs://mybucket).",
                          },
                          retention_interval: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                          upload_interval: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                        },
                        description: "SQL Server specific audit configuration.",
                        additionalProperties: true,
                      },
                      edition: {
                        type: "string",
                        enum: [
                          "EDITION_UNSPECIFIED",
                          "ENTERPRISE",
                          "ENTERPRISE_PLUS",
                        ],
                        description: "Optional. The edition of the instance.",
                      },
                      connector_enforcement: {
                        type: "string",
                        enum: [
                          "CONNECTOR_ENFORCEMENT_UNSPECIFIED",
                          "NOT_REQUIRED",
                          "REQUIRED",
                        ],
                        description:
                          "Specifies if connections must use Cloud SQL connectors. Option values include the following: `NOT_REQUIRED` (Cloud SQL instances can be connected without Cloud SQL Connectors) and `REQUIRED` (Only allow connections that use Cloud SQL Connectors).  Note that using REQUIRED disables all existing authorized networks. If this field is not specified when creating a new instance, NOT_REQUIRED is used. If this field is not specified when patching or updating an existing instance, it is left unchanged in the instance.",
                      },
                      deletion_protection_enabled: {
                        type: "boolean",
                        description:
                          "Configuration to protect against accidental instance deletion.",
                      },
                      time_zone: {
                        type: "string",
                        description:
                          "Server timezone, relevant only for Cloud SQL for SQL Server.",
                      },
                      advanced_machine_features: {
                        type: "object",
                        properties: {
                          threads_per_core: {
                            type: "integer",
                            description:
                              "The number of threads per physical core.",
                          },
                        },
                        description:
                          "Specifies options for controlling advanced machine features.",
                        additionalProperties: true,
                      },
                      data_cache_config: {
                        type: "object",
                        properties: {
                          data_cache_enabled: {
                            type: "boolean",
                            description:
                              "Whether data cache is enabled for the instance.",
                          },
                        },
                        description: "Data cache configurations.",
                        additionalProperties: true,
                      },
                      replication_lag_max_seconds: {
                        type: "integer",
                        description:
                          "Optional. Configuration value for recreation of replica after certain replication lag",
                      },
                      enable_google_ml_integration: {
                        type: "boolean",
                        description:
                          "Optional. When this parameter is set to true, Cloud SQL instances can connect to Vertex AI to pass requests for real-time predictions and insights to the AI. The default value is false. This applies only to Cloud SQL for MySQL and Cloud SQL for PostgreSQL instances.",
                      },
                      enable_dataplex_integration: {
                        type: "boolean",
                        description:
                          "Optional. By default, Cloud SQL instances have schema extraction disabled for Dataplex. When this parameter is set to true, schema extraction for Dataplex on Cloud SQL instances is activated.",
                      },
                      retain_backups_on_delete: {
                        type: "boolean",
                        description:
                          "Optional. When this parameter is set to true, Cloud SQL retains backups of the instance even after the instance is deleted. The ON_DEMAND backup will be retained until customer deletes the backup or the project. The AUTOMATED backup will be retained based on the backups retention setting.",
                      },
                      data_disk_provisioned_iops: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      data_disk_provisioned_throughput: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                      connection_pool_config: {
                        type: "object",
                        properties: {
                          connection_pooling_enabled: {
                            type: "boolean",
                            description:
                              "Whether managed connection pooling is enabled.",
                          },
                          flags: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                  description:
                                    "Required. The name of the flag.",
                                },
                                value: {
                                  type: "string",
                                  description:
                                    "Required. The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.",
                                },
                              },
                              required: ["name", "value"],
                              description:
                                "Connection pool flags for Cloud SQL instances managed connection pool configuration.",
                              additionalProperties: true,
                            },
                            description:
                              "Optional. List of connection pool configuration flags.",
                          },
                        },
                        description:
                          "The managed connection pooling configuration.",
                        additionalProperties: true,
                      },
                      final_backup_config: {
                        type: "object",
                        properties: {
                          enabled: {
                            type: "boolean",
                            description:
                              "Whether the final backup is enabled for the instance.",
                          },
                          retention_days: {
                            type: "integer",
                            description:
                              "The number of days to retain the final backup after the instance deletion. The final backup will be purged at (time_of_instance_deletion + retention_days).",
                          },
                        },
                        description:
                          "Config used to determine the final backup settings for the instance.",
                        additionalProperties: true,
                      },
                      read_pool_auto_scale_config: {
                        type: "object",
                        properties: {
                          enabled: {
                            type: "boolean",
                            description:
                              "Indicates whether read pool auto scaling is enabled.",
                          },
                          min_node_count: {
                            type: "integer",
                            description:
                              "Minimum number of read pool nodes to be maintained.",
                          },
                          max_node_count: {
                            type: "integer",
                            description:
                              "Maximum number of read pool nodes to be maintained.",
                          },
                          target_metrics: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                metric: {
                                  type: "string",
                                  description:
                                    "The metric name to be used for auto scaling.",
                                },
                                target_value: {
                                  type: "number",
                                  description:
                                    "The target value for the metric.",
                                },
                              },
                              description:
                                "Target metric for read pool auto scaling.",
                              additionalProperties: true,
                            },
                            description:
                              "Optional. Target metrics for read pool auto scaling.",
                          },
                          disable_scale_in: {
                            type: "boolean",
                            description:
                              "Indicates whether read pool auto scaling supports scale in operations (removing nodes).",
                          },
                          scale_in_cooldown_seconds: {
                            type: "integer",
                            description:
                              "The cooldown period for scale-in operations.",
                          },
                          scale_out_cooldown_seconds: {
                            type: "integer",
                            description:
                              "The cooldown period for scale-out operations.",
                          },
                        },
                        description: "The read pool auto-scale configuration.",
                        additionalProperties: true,
                      },
                      auto_upgrade_enabled: {
                        type: "boolean",
                        description:
                          "Optional. Cloud SQL for MySQL auto-upgrade configuration. When this parameter is set to true, auto-upgrade is enabled for MySQL 8.0 minor versions. The MySQL version must be 8.0.35 or higher.",
                      },
                      entraid_config: {
                        type: "object",
                        properties: {
                          tenant_id: {
                            type: "string",
                            description:
                              "Optional. The tenant ID for the Entra ID configuration.",
                          },
                          application_id: {
                            type: "string",
                            description:
                              "Optional. The application ID for the Entra ID configuration.",
                          },
                        },
                        description: "SQL Server Entra ID configuration.",
                        additionalProperties: true,
                      },
                      data_api_access: {
                        type: "string",
                        enum: [
                          "DATA_API_ACCESS_UNSPECIFIED",
                          "DISALLOW_DATA_API",
                          "ALLOW_DATA_API",
                        ],
                        description:
                          "This parameter controls whether to allow using ExecuteSql API to connect to the instance. Not allowed by default.",
                      },
                      performance_capture_config: {
                        type: "object",
                        properties: {
                          enabled: {
                            type: "boolean",
                            description:
                              "Optional. Enable or disable the Performance Capture feature.",
                          },
                          probing_interval_seconds: {
                            type: "integer",
                            description:
                              "Optional. The time interval in seconds between any two probes.",
                          },
                          probe_threshold: {
                            type: "integer",
                            description:
                              "Optional. The minimum number of consecutive readings above threshold that triggers instance state capture.",
                          },
                          running_threads_threshold: {
                            type: "integer",
                            description:
                              "Optional. The minimum number of server threads running to trigger the capture on primary.",
                          },
                          seconds_behind_source_threshold: {
                            type: "integer",
                            description:
                              "Optional. The minimum number of seconds replica must be lagging behind primary to trigger capture on replica.",
                          },
                          transaction_duration_threshold: {
                            type: "integer",
                            description:
                              "Optional. The amount of time in seconds that a transaction needs to have been open before the watcher starts recording it.",
                          },
                        },
                        description: "Performance Capture configuration.",
                        additionalProperties: true,
                      },
                    },
                    description: "Database instance settings.",
                    additionalProperties: true,
                  },
                  etag: {
                    type: "string",
                    description:
                      "This field is deprecated and will be removed from a future version of the API. Use the `settings.settingsVersion` field instead.",
                  },
                  failover_replica: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "The name of the failover replica. If specified at instance creation, a failover replica is created for the instance. The name doesn't include the project ID.",
                      },
                      available: {
                        type: "boolean",
                        description:
                          "The availability status of the failover replica. A false status indicates that the failover replica is out of sync. The primary instance can only failover to the failover replica when the status is true.",
                      },
                    },
                    additionalProperties: true,
                    description: "The name and status of the failover replica.",
                  },
                  master_instance_name: {
                    type: "string",
                    description:
                      "The name of the instance which will act as primary in the replication setup.",
                  },
                  replica_names: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "The replicas of the instance.",
                  },
                  max_disk_size: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  current_disk_size: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  ip_addresses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: [
                            "SQL_IP_ADDRESS_TYPE_UNSPECIFIED",
                            "PRIMARY",
                            "OUTGOING",
                            "PRIVATE",
                            "MIGRATED_1ST_GEN",
                          ],
                          description:
                            "The type of this IP address. A `PRIMARY` address is a public address that can accept incoming connections. A `PRIVATE` address is a private address that can accept incoming connections. An `OUTGOING` address is the source address of connections originating from the instance, if supported.",
                        },
                        ip_address: {
                          type: "string",
                          description: "The IP address assigned.",
                        },
                        time_to_retire: {
                          type: "string",
                          description:
                            "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                        },
                      },
                      description: "Database instance IP mapping",
                      additionalProperties: true,
                    },
                    description: "The assigned IP addresses for the instance.",
                  },
                  server_ca_cert: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                        description: "This is always `sql#sslCert`.",
                      },
                      cert_serial_number: {
                        type: "string",
                        description:
                          "Serial number, as extracted from the certificate.",
                      },
                      cert: {
                        type: "string",
                        description: "PEM representation.",
                      },
                      create_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                      common_name: {
                        type: "string",
                        description:
                          "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
                      },
                      expiration_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                      sha1_fingerprint: {
                        type: "string",
                        description: "Sha1 Fingerprint.",
                      },
                      instance: {
                        type: "string",
                        description: "Name of the database instance.",
                      },
                      self_link: {
                        type: "string",
                        description: "The URI of this resource.",
                      },
                    },
                    description: "SslCerts Resource",
                    additionalProperties: true,
                  },
                  instance_type: {
                    type: "string",
                    enum: [
                      "SQL_INSTANCE_TYPE_UNSPECIFIED",
                      "CLOUD_SQL_INSTANCE",
                      "ON_PREMISES_INSTANCE",
                      "READ_REPLICA_INSTANCE",
                      "READ_POOL_INSTANCE",
                    ],
                    description: "The instance type.",
                  },
                  project: {
                    type: "string",
                    description:
                      "The project ID of the project containing the Cloud SQL instance. The Google apps domain is prefixed if applicable.",
                  },
                  ipv6_address: {
                    type: "string",
                    description:
                      "The IPv6 address assigned to the instance. (Deprecated) This property was applicable only to First Generation instances.",
                  },
                  service_account_email_address: {
                    type: "string",
                    description:
                      "The service account email address assigned to the instance.\\This property is read-only.",
                  },
                  on_premises_configuration: {
                    type: "object",
                    properties: {
                      host_port: {
                        type: "string",
                        description:
                          "The host and port of the on-premises instance in host:port format",
                      },
                      kind: {
                        type: "string",
                        description:
                          "This is always `sql#onPremisesConfiguration`.",
                      },
                      username: {
                        type: "string",
                        description:
                          "The username for connecting to on-premises instance.",
                      },
                      password: {
                        type: "string",
                        description:
                          "The password for connecting to on-premises instance.",
                      },
                      ca_certificate: {
                        type: "string",
                        description:
                          "PEM representation of the trusted CA's x509 certificate.",
                      },
                      client_certificate: {
                        type: "string",
                        description:
                          "PEM representation of the replica's x509 certificate.",
                      },
                      client_key: {
                        type: "string",
                        description:
                          "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
                      },
                      dump_file_path: {
                        type: "string",
                        description:
                          "The dump file to create the Cloud SQL replica.",
                      },
                      source_instance: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description:
                              "The name of the Cloud SQL instance being referenced. This does not include the project ID.",
                          },
                          region: {
                            type: "string",
                            description:
                              "The region of the Cloud SQL instance being referenced.",
                          },
                          project: {
                            type: "string",
                            description:
                              "The project ID of the Cloud SQL instance being referenced. The default is the same project ID as the instance references it.",
                          },
                        },
                        description: "Reference to another Cloud SQL instance.",
                        additionalProperties: true,
                      },
                      selected_objects: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            database: {
                              type: "string",
                              description:
                                "Required. The name of the database to migrate.",
                            },
                          },
                          required: ["database"],
                          description:
                            "A list of objects that the user selects for replication from an external source instance.",
                          additionalProperties: true,
                        },
                        description:
                          "Optional. A list of objects that the user selects for replication from an external source instance.",
                      },
                      ssl_option: {
                        type: "string",
                        enum: [
                          "SSL_OPTION_UNSPECIFIED",
                          "DISABLE",
                          "REQUIRE",
                          "VERIFY_CA",
                        ],
                        description:
                          "Optional. SSL option for replica connection to the on-premises source.",
                      },
                    },
                    description: "On-premises instance configuration.",
                    additionalProperties: true,
                  },
                  replica_configuration: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                        description:
                          "This is always `sql#replicaConfiguration`.",
                      },
                      mysql_replica_configuration: {
                        type: "object",
                        properties: {
                          dump_file_path: {
                            type: "string",
                            description:
                              "Path to a SQL dump file in Google Cloud Storage from which the replica instance is to be created. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported. Dumps have the binlog co-ordinates from which replication begins. This can be accomplished by setting --master-data to 1 when using mysqldump.",
                          },
                          username: {
                            type: "string",
                            description:
                              "The username for the replication connection.",
                          },
                          password: {
                            type: "string",
                            description:
                              "The password for the replication connection.",
                          },
                          connect_retry_interval: {
                            type: "integer",
                            description:
                              "Seconds to wait between connect retries. MySQL's default is 60 seconds.",
                          },
                          master_heartbeat_period: {
                            type: "string",
                            description: "64-bit integer as string",
                          },
                          ca_certificate: {
                            type: "string",
                            description:
                              "PEM representation of the trusted CA's x509 certificate.",
                          },
                          client_certificate: {
                            type: "string",
                            description:
                              "PEM representation of the replica's x509 certificate.",
                          },
                          client_key: {
                            type: "string",
                            description:
                              "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
                          },
                          ssl_cipher: {
                            type: "string",
                            description:
                              "A list of permissible ciphers to use for SSL encryption.",
                          },
                          verify_server_certificate: {
                            type: "boolean",
                            description:
                              "Whether or not to check the primary instance's Common Name value in the certificate that it sends during the SSL handshake.",
                          },
                          kind: {
                            type: "string",
                            description:
                              "This is always `sql#mysqlReplicaConfiguration`.",
                          },
                        },
                        description:
                          "Read-replica configuration specific to MySQL databases.",
                        additionalProperties: true,
                      },
                      failover_target: {
                        type: "boolean",
                        description:
                          "Specifies if the replica is the failover target. If the field is set to `true`, the replica will be designated as a failover replica. In case the primary instance fails, the replica instance will be promoted as the new primary instance. Only one replica can be specified as failover target, and the replica has to be in different zone with the primary instance.",
                      },
                      cascadable_replica: {
                        type: "boolean",
                        description:
                          "Optional. Specifies if a SQL Server replica is a cascadable replica. A cascadable replica is a SQL Server cross region replica that supports replica(s) under it.",
                      },
                    },
                    description:
                      "Read-replica configuration for connecting to the primary instance.",
                    additionalProperties: true,
                  },
                  backend_type: {
                    type: "string",
                    enum: [
                      "SQL_BACKEND_TYPE_UNSPECIFIED",
                      "FIRST_GEN",
                      "SECOND_GEN",
                      "EXTERNAL",
                    ],
                    description:
                      "The backend type. `SECOND_GEN`: Cloud SQL database instance. `EXTERNAL`: A database server that is not managed by Google.  This property is read-only; use the `tier` property in the `settings` object to determine the database type.",
                  },
                  self_link: {
                    type: "string",
                    description: "The URI of this resource.",
                  },
                  suspension_reason: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: [
                        "SQL_SUSPENSION_REASON_UNSPECIFIED",
                        "BILLING_ISSUE",
                        "LEGAL_ISSUE",
                        "OPERATIONAL_ISSUE",
                        "KMS_KEY_ISSUE",
                      ],
                      description:
                        "The suspension reason of the database instance if the state is SUSPENDED.",
                    },
                    description:
                      "If the instance state is SUSPENDED, the reason for the suspension.",
                  },
                  connection_name: {
                    type: "string",
                    description:
                      "Connection name of the Cloud SQL instance used in connection strings.",
                  },
                  name: {
                    type: "string",
                    description:
                      "Name of the Cloud SQL instance. This does not include the project ID.",
                  },
                  region: {
                    type: "string",
                    description:
                      "The geographical region of the Cloud SQL instance.  It can be one of the [regions](https://cloud.google.com/sql/docs/mysql/locations#location-r) where Cloud SQL operates:  For example,  `asia-east1`, `europe-west1`, and  `us-central1`. The default value is `us-central1`.",
                  },
                  gce_zone: {
                    type: "string",
                    description:
                      "The Compute Engine zone that the instance is currently serving from. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary zone. WARNING: Changing this might restart the instance.",
                  },
                  secondary_gce_zone: {
                    type: "string",
                    description:
                      "The Compute Engine zone that the failover instance is currently serving from for a regional instance. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary/failover zone.",
                  },
                  disk_encryption_configuration: {
                    type: "object",
                    properties: {
                      kms_key_name: {
                        type: "string",
                        description:
                          "Resource name of KMS key for disk encryption",
                      },
                      kind: {
                        type: "string",
                        description:
                          "This is always `sql#diskEncryptionConfiguration`.",
                      },
                    },
                    description:
                      "Disk encryption configuration for an instance.",
                    additionalProperties: true,
                  },
                  disk_encryption_status: {
                    type: "object",
                    properties: {
                      kms_key_version_name: {
                        type: "string",
                        description:
                          "KMS key version used to encrypt the Cloud SQL instance resource",
                      },
                      kind: {
                        type: "string",
                        description:
                          "This is always `sql#diskEncryptionStatus`.",
                      },
                    },
                    description: "Disk encryption status for an instance.",
                    additionalProperties: true,
                  },
                  root_password: {
                    type: "string",
                    description:
                      "Initial root password. Use only on creation. You must set root passwords before you can connect to PostgreSQL instances.",
                  },
                  scheduled_maintenance: {
                    type: "object",
                    properties: {
                      start_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                      can_defer: {
                        type: "boolean",
                      },
                      can_reschedule: {
                        type: "boolean",
                        description:
                          "If the scheduled maintenance can be rescheduled.",
                      },
                      schedule_deadline_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                    },
                    description: "Any scheduled maintenance for this instance.",
                    additionalProperties: true,
                  },
                  satisfies_pzs: {
                    type: "boolean",
                    description:
                      "This status indicates whether the instance satisfies PZS.  The status is reserved for future use.",
                  },
                  out_of_disk_report: {
                    type: "object",
                    properties: {
                      sql_out_of_disk_state: {
                        type: "string",
                        enum: [
                          "SQL_OUT_OF_DISK_STATE_UNSPECIFIED",
                          "NORMAL",
                          "SOFT_SHUTDOWN",
                        ],
                        description:
                          "This field represents the state generated by the proactive database wellness job for OutOfDisk issues. *  Writers:   *  the proactive database wellness job for OOD. *  Readers:   *  the proactive database wellness job",
                      },
                      sql_min_recommended_increase_size_gb: {
                        type: "integer",
                        description:
                          "The minimum recommended increase size in GigaBytes This field is consumed by the frontend *  Writers:   *  the proactive database wellness job for OOD. *  Readers:",
                      },
                    },
                    description:
                      "This message wraps up the information written by out-of-disk detection job.",
                    additionalProperties: true,
                  },
                  maintenance_version: {
                    type: "string",
                    description:
                      "The current software version on the instance.",
                  },
                  sql_network_architecture: {
                    type: "string",
                    enum: [
                      "SQL_NETWORK_ARCHITECTURE_UNSPECIFIED",
                      "NEW_NETWORK_ARCHITECTURE",
                      "OLD_NETWORK_ARCHITECTURE",
                    ],
                  },
                  replication_cluster: {
                    type: "object",
                    properties: {
                      failover_dr_replica_name: {
                        type: "string",
                        description:
                          "Optional. If the instance is a primary instance, then this field identifies the disaster recovery (DR) replica. A DR replica is an optional configuration for Enterprise Plus edition instances. If the instance is a read replica, then the field is not set. Set this field to a replica name to designate a DR replica for a primary instance. Remove the replica name to remove the DR replica designation.",
                      },
                    },
                    description:
                      "A primary instance and disaster recovery (DR) replica pair. A DR replica is a cross-region replica that you designate for failover in the event that the primary instance experiences regional failure. Applicable to MySQL and PostgreSQL.",
                    additionalProperties: true,
                  },
                  gemini_config: {
                    type: "object",
                    properties: {},
                    description: "Gemini instance configuration.",
                    additionalProperties: true,
                  },
                  switch_transaction_logs_to_cloud_storage_enabled: {
                    type: "boolean",
                  },
                  include_replicas_for_major_version_upgrade: {
                    type: "boolean",
                  },
                  tags: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      'Optional. Input only. Immutable. Tag keys and tag values that are bound to this instance. You must represent each item in the map as: `"<tag-key-namespaced-name>" : "<tag-value-short-name>"`.  For example, a single resource can have the following tags: ```   "123/environment": "production",   "123/costCenter": "marketing", ```  For more information on tag creation and management, see https://cloud.google.com/resource-manager/docs/tags/tags-overview.',
                  },
                  node_count: {
                    type: "integer",
                    description:
                      "The number of read pool nodes in a read pool.",
                  },
                },
                description: "A Cloud SQL instance resource.",
                additionalProperties: true,
              },
              restore_instance_clear_overrides_field_names: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Optional. This field has the same purpose as restore_instance_settings, changes any instance settings stored in the backup you are restoring from. With the difference that these fields are cleared in the settings.",
              },
            },
            description: "Database instance restore backup request.",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlInstancesServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          request.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;
        if (input.event.inputConfig.body !== undefined)
          request.body = input.event.inputConfig.body;

        const result = await new Promise<any>((resolve, reject) => {
          client.restoreBackup(request, (err: any, response: any) => {
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

export default restoreBackup;
