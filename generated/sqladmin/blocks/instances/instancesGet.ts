import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesGet: AppBlock = {
  name: "Instances - Get",
  description: `Retrieves a resource containing information about a Cloud SQL instance.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Required. Database instance ID. This does not include the project ID.",
          type: {
            type: "string",
          },
          required: true,
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
        let path = `v1/projects/{project}/instances/{instance}`;

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
            description: "The current serving state of the Cloud SQL instance.",
          },
          databaseVersion: {
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
              "The database engine type and version. The `databaseVersion` field cannot be changed after instance creation.",
          },
          settings: {
            type: "object",
            properties: {
              settingsVersion: {
                type: "string",
                description:
                  "The version of instance settings. This is a required field for update method to make sure concurrent updates are handled properly. During update, use the most recent settingsVersion value for this instance and do not try to update this value. (Format: int64)",
              },
              authorizedGaeApplications: {
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
              userLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "User-provided labels, represented as a dictionary where each label is a single key value pair.",
              },
              availabilityType: {
                type: "string",
                enum: [
                  "SQL_AVAILABILITY_TYPE_UNSPECIFIED",
                  "ZONAL",
                  "REGIONAL",
                ],
                description:
                  "Availability type. Potential values: * `ZONAL`: The instance serves data from only one zone. Outages in that zone affect data accessibility. * `REGIONAL`: The instance can serve data from more than one zone in a region (it is highly available)./ For more information, see [Overview of the High Availability Configuration](https://cloud.google.com/sql/docs/mysql/high-availability).",
              },
              pricingPlan: {
                type: "string",
                enum: ["SQL_PRICING_PLAN_UNSPECIFIED", "PACKAGE", "PER_USE"],
                description:
                  "The pricing plan for this instance. This can be either `PER_USE` or `PACKAGE`. Only `PER_USE` is supported for Second Generation instances.",
              },
              replicationType: {
                type: "string",
                enum: [
                  "SQL_REPLICATION_TYPE_UNSPECIFIED",
                  "SYNCHRONOUS",
                  "ASYNCHRONOUS",
                ],
                description:
                  "The type of replication this instance uses. This can be either `ASYNCHRONOUS` or `SYNCHRONOUS`. (Deprecated) This property was only applicable to First Generation instances.",
              },
              storageAutoResizeLimit: {
                type: "string",
                description:
                  "The maximum size to which storage capacity can be automatically increased. The default value is 0, which specifies that there is no limit. (Format: int64)",
              },
              activationPolicy: {
                type: "string",
                enum: [
                  "SQL_ACTIVATION_POLICY_UNSPECIFIED",
                  "ALWAYS",
                  "NEVER",
                  "ON_DEMAND",
                ],
                description:
                  "The activation policy specifies when the instance is activated; it is applicable only when the instance state is RUNNABLE. Valid values: * `ALWAYS`: The instance is on, and remains so even in the absence of connection requests. * `NEVER`: The instance is off; it is not activated, even if a connection request arrives.",
              },
              ipConfiguration: {
                type: "object",
                properties: {
                  ipv4Enabled: {
                    type: "boolean",
                    description:
                      "Whether the instance is assigned a public IP address or not.",
                  },
                  privateNetwork: {
                    type: "string",
                    description:
                      "The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `/projects/myProject/global/networks/default`. This setting can be updated, but it cannot be removed after it is set.",
                  },
                  requireSsl: {
                    type: "boolean",
                    description:
                      "Use `ssl_mode` instead. Whether SSL/TLS connections over IP are enforced. If set to false, then allow both non-SSL/non-TLS and SSL/TLS connections. For SSL/TLS connections, the client certificate won't be verified. If set to true, then only allow connections encrypted with SSL/TLS and with valid client certificates. If you want to enforce SSL/TLS without enforcing the requirement for valid client certificates, then use the `ssl_mode` flag instead of the `require_ssl` flag.",
                  },
                  authorizedNetworks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          description:
                            "The allowlisted value for the access control list.",
                        },
                        expirationTime: {
                          type: "string",
                          description:
                            "The time when this access control entry expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
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
                      description: "An entry for an Access Control list.",
                      additionalProperties: true,
                    },
                    description:
                      "The list of external networks that are allowed to connect to the instance using the IP. In 'CIDR' notation, also known as 'slash' notation (for example: `157.197.200.0/24`).",
                  },
                  allocatedIpRange: {
                    type: "string",
                    description:
                      'The name of the allocated ip range for the private ip Cloud SQL instance. For example: "google-managed-services-default". If set, the instance ip will be created in the allocated range. The range name must comply with [RFC 1035](https://tools.ietf.org/html/rfc1035). Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?.`',
                  },
                  enablePrivatePathForGoogleCloudServices: {
                    type: "boolean",
                    description:
                      "Controls connectivity to private IP instances from Google services, such as BigQuery.",
                  },
                  sslMode: {
                    type: "string",
                    enum: [
                      "SSL_MODE_UNSPECIFIED",
                      "ALLOW_UNENCRYPTED_AND_ENCRYPTED",
                      "ENCRYPTED_ONLY",
                      "TRUSTED_CLIENT_CERTIFICATE_REQUIRED",
                    ],
                    description:
                      "Specify how SSL/TLS is enforced in database connections. If you must use the `require_ssl` flag for backward compatibility, then only the following value pairs are valid: For PostgreSQL and MySQL: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false` * `ssl_mode=TRUSTED_CLIENT_CERTIFICATE_REQUIRED` and `require_ssl=true` For SQL Server: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=true` The value of `ssl_mode` has priority over the value of `require_ssl`. For example, for the pair `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false`, `ssl_mode=ENCRYPTED_ONLY` means accept only SSL connections, while `require_ssl=false` means accept both non-SSL and SSL connections. In this case, MySQL and PostgreSQL databases respect `ssl_mode` and accepts only SSL connections.",
                  },
                  pscConfig: {
                    type: "object",
                    properties: {
                      pscEnabled: {
                        type: "boolean",
                        description:
                          "Whether PSC connectivity is enabled for this instance.",
                      },
                      allowedConsumerProjects: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Optional. The list of consumer projects that are allow-listed for PSC connections to this instance. This instance can be connected to with PSC from any network in these projects. Each consumer project in this list may be represented by a project number (numeric) or by a project id (alphanumeric).",
                      },
                      pscAutoConnections: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            consumerProject: {
                              type: "string",
                              description:
                                "Optional. This is the project ID of consumer service project of this consumer endpoint. Optional. This is only applicable if consumer_network is a shared vpc network.",
                            },
                            consumerNetwork: {
                              type: "string",
                              description:
                                "Optional. The consumer network of this consumer endpoint. This must be a resource path that includes both the host project and the network name. For example, `projects/project1/global/networks/network1`. The consumer host project of this network might be different from the consumer service project.",
                            },
                            ipAddress: {
                              type: "string",
                              description:
                                "The IP address of the consumer endpoint.",
                            },
                            status: {
                              type: "string",
                              description:
                                "The connection status of the consumer endpoint.",
                            },
                            consumerNetworkStatus: {
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
                      networkAttachmentUri: {
                        type: "string",
                        description:
                          "Optional. The network attachment of the consumer network that the Private Service Connect enabled Cloud SQL instance is authorized to connect via PSC interface. format: projects/PROJECT/regions/REGION/networkAttachments/ID",
                      },
                    },
                    description: "PSC settings for a Cloud SQL instance.",
                    additionalProperties: true,
                  },
                  serverCaMode: {
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
                  customSubjectAlternativeNames: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Optional. Custom Subject Alternative Name(SAN)s for a Cloud SQL instance.",
                  },
                  serverCaPool: {
                    type: "string",
                    description:
                      "Optional. The resource name of the server CA pool for an instance with `CUSTOMER_MANAGED_CAS_CA` as the `server_ca_mode`. Format: projects/{PROJECT}/locations/{REGION}/caPools/{CA_POOL_ID}",
                  },
                  serverCertificateRotationMode: {
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
              storageAutoResize: {
                type: "boolean",
                description:
                  "Configuration to increase storage size automatically. The default value is true.",
              },
              locationPreference: {
                type: "object",
                properties: {
                  followGaeApplication: {
                    type: "string",
                    description:
                      "The App Engine application to follow, it must be in the same region as the Cloud SQL instance. WARNING: Changing this might restart the instance.",
                  },
                  zone: {
                    type: "string",
                    description:
                      "The preferred Compute Engine zone (for example: us-central1-a, us-central1-b, etc.). WARNING: Changing this might restart the instance.",
                  },
                  secondaryZone: {
                    type: "string",
                    description:
                      "The preferred Compute Engine zone for the secondary/failover (for example: us-central1-a, us-central1-b, etc.). To disable this field, set it to 'no_secondary_zone'.",
                  },
                  kind: {
                    type: "string",
                    description: "This is always `sql#locationPreference`.",
                  },
                },
                description:
                  "Preferred location. This specifies where a Cloud SQL instance is located. Note that if the preferred location is not available, the instance will be located as close as possible within the region. Only one location may be specified.",
                additionalProperties: true,
              },
              databaseFlags: {
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
                  description: "Database flags for Cloud SQL instances.",
                  additionalProperties: true,
                },
                description:
                  "The database flags passed to the instance at startup.",
              },
              dataDiskType: {
                type: "string",
                enum: [
                  "SQL_DATA_DISK_TYPE_UNSPECIFIED",
                  "PD_SSD",
                  "PD_HDD",
                  "OBSOLETE_LOCAL_SSD",
                  "HYPERDISK_BALANCED",
                ],
                description:
                  "The type of data disk: `PD_SSD` (default) or `PD_HDD`. Not used for First Generation instances.",
              },
              maintenanceWindow: {
                type: "object",
                properties: {
                  hour: {
                    type: "integer",
                    description:
                      "Hour of day - 0 to 23. Specify in the UTC time zone. (Format: int32)",
                  },
                  day: {
                    type: "integer",
                    description:
                      "Day of week - `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, or `SUNDAY`. Specify in the UTC time zone. Returned in output as an integer, 1 to 7, where `1` equals Monday. (Format: int32)",
                  },
                  updateTrack: {
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
                    description: "This is always `sql#maintenanceWindow`.",
                  },
                },
                description:
                  "Maintenance window. This specifies when a Cloud SQL instance is restarted for system maintenance purposes.",
                additionalProperties: true,
              },
              backupConfiguration: {
                type: "object",
                properties: {
                  startTime: {
                    type: "string",
                    description:
                      "Start time for the daily backup configuration in UTC timezone in the 24 hour format - `HH:MM`.",
                  },
                  enabled: {
                    type: "boolean",
                    description: "Whether this configuration is enabled.",
                  },
                  kind: {
                    type: "string",
                    description: "This is always `sql#backupConfiguration`.",
                  },
                  binaryLogEnabled: {
                    type: "boolean",
                    description:
                      "(MySQL only) Whether binary log is enabled. If backup configuration is disabled, binarylog must be disabled as well.",
                  },
                  replicationLogArchivingEnabled: {
                    type: "boolean",
                    description: "Reserved for future use.",
                  },
                  location: {
                    type: "string",
                    description: "Location of the backup",
                  },
                  pointInTimeRecoveryEnabled: {
                    type: "boolean",
                    description: "Whether point in time recovery is enabled.",
                  },
                  backupRetentionSettings: {
                    type: "object",
                    properties: {
                      retentionUnit: {
                        type: "string",
                        enum: ["RETENTION_UNIT_UNSPECIFIED", "COUNT"],
                        description:
                          "The unit that 'retained_backups' represents.",
                      },
                      retainedBackups: {
                        type: "integer",
                        description:
                          "Depending on the value of retention_unit, this is used to determine if a backup needs to be deleted. If retention_unit is 'COUNT', we will retain this many backups. (Format: int32)",
                      },
                    },
                    description:
                      "We currently only support backup retention by specifying the number of backups we will retain.",
                    additionalProperties: true,
                  },
                  transactionLogRetentionDays: {
                    type: "integer",
                    description:
                      "The number of days of transaction logs we retain for point in time restore, from 1-7. (Format: int32)",
                  },
                  transactionalLogStorageState: {
                    type: "string",
                    enum: [
                      "TRANSACTIONAL_LOG_STORAGE_STATE_UNSPECIFIED",
                      "DISK",
                      "SWITCHING_TO_CLOUD_STORAGE",
                      "SWITCHED_TO_CLOUD_STORAGE",
                      "CLOUD_STORAGE",
                    ],
                    description:
                      "Output only. This value contains the storage location of transactional logs used to perform point-in-time recovery (PITR) for the database.",
                  },
                  backupTier: {
                    type: "string",
                    enum: [
                      "BACKUP_TIER_UNSPECIFIED",
                      "STANDARD",
                      "ADVANCED",
                      "ENHANCED",
                    ],
                    description:
                      "Output only. Backup tier that manages the backups for the instance.",
                  },
                },
                description: "Database instance backup configuration.",
                additionalProperties: true,
              },
              databaseReplicationEnabled: {
                type: "boolean",
                description:
                  "Configuration specific to read replica instances. Indicates whether replication is enabled or not. WARNING: Changing this restarts the instance.",
              },
              crashSafeReplicationEnabled: {
                type: "boolean",
                description:
                  "Configuration specific to read replica instances. Indicates whether database flags for crash-safe replication are enabled. This property was only applicable to First Generation instances.",
              },
              dataDiskSizeGb: {
                type: "string",
                description:
                  "The size of data disk, in GB. The data disk size minimum is 10GB. (Format: int64)",
              },
              activeDirectoryConfig: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                    description: "This is always sql#activeDirectoryConfig.",
                  },
                  domain: {
                    type: "string",
                    description: "The name of the domain (e.g., mydomain.com).",
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
                  dnsServers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Optional. Domain controller IPv4 addresses used to bootstrap Active Directory.",
                  },
                  adminCredentialSecretName: {
                    type: "string",
                    description:
                      "Optional. The secret manager key storing the administrator credential. (e.g., projects/{project}/secrets/{secret}).",
                  },
                  organizationalUnit: {
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
              denyMaintenancePeriods: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    startDate: {
                      type: "string",
                      description:
                        '"deny maintenance period" start date. If the year of the start date is empty, the year of the end date also must be empty. In this case, it means the deny maintenance period recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01',
                    },
                    endDate: {
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
              insightsConfig: {
                type: "object",
                properties: {
                  queryInsightsEnabled: {
                    type: "boolean",
                    description: "Whether Query Insights feature is enabled.",
                  },
                  recordClientAddress: {
                    type: "boolean",
                    description:
                      "Whether Query Insights will record client address when enabled.",
                  },
                  recordApplicationTags: {
                    type: "boolean",
                    description:
                      "Whether Query Insights will record application tags from query when enabled.",
                  },
                  queryStringLength: {
                    type: "integer",
                    description:
                      "Maximum query length stored in bytes. Default value: 1024 bytes. Range: 256-4500 bytes. Query lengths greater than this field value will be truncated to this value. When unset, query length will be the default value. Changing query length will restart the database. (Format: int32)",
                  },
                  queryPlansPerMinute: {
                    type: "integer",
                    description:
                      "Number of query execution plans captured by Insights per minute for all queries combined. Default is 5. (Format: int32)",
                  },
                },
                description:
                  "Insights configuration. This specifies when Cloud SQL Insights feature is enabled and optional configuration.",
                additionalProperties: true,
              },
              passwordValidationPolicy: {
                type: "object",
                properties: {
                  minLength: {
                    type: "integer",
                    description:
                      "Minimum number of characters allowed. (Format: int32)",
                  },
                  complexity: {
                    type: "string",
                    enum: ["COMPLEXITY_UNSPECIFIED", "COMPLEXITY_DEFAULT"],
                    description: "The complexity of the password.",
                  },
                  reuseInterval: {
                    type: "integer",
                    description:
                      "Number of previous passwords that cannot be reused. (Format: int32)",
                  },
                  disallowUsernameSubstring: {
                    type: "boolean",
                    description: "Disallow username as a part of the password.",
                  },
                  passwordChangeInterval: {
                    type: "string",
                    description:
                      "Minimum interval after which the password can be changed. This flag is only supported for PostgreSQL. (Format: google-duration)",
                  },
                  enablePasswordPolicy: {
                    type: "boolean",
                    description:
                      "Whether the password policy is enabled or not.",
                  },
                  disallowCompromisedCredentials: {
                    type: "boolean",
                    description:
                      "This field is deprecated and will be removed in a future version of the API.",
                  },
                },
                description:
                  "Database instance local user password validation policy",
                additionalProperties: true,
              },
              sqlServerAuditConfig: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                    description: "This is always sql#sqlServerAuditConfig",
                  },
                  bucket: {
                    type: "string",
                    description:
                      "The name of the destination bucket (e.g., gs://mybucket).",
                  },
                  retentionInterval: {
                    type: "string",
                    description:
                      "How long to keep generated audit files. (Format: google-duration)",
                  },
                  uploadInterval: {
                    type: "string",
                    description:
                      "How often to upload generated audit files. (Format: google-duration)",
                  },
                },
                description: "SQL Server specific audit configuration.",
                additionalProperties: true,
              },
              edition: {
                type: "string",
                enum: ["EDITION_UNSPECIFIED", "ENTERPRISE", "ENTERPRISE_PLUS"],
                description: "Optional. The edition of the instance.",
              },
              connectorEnforcement: {
                type: "string",
                enum: [
                  "CONNECTOR_ENFORCEMENT_UNSPECIFIED",
                  "NOT_REQUIRED",
                  "REQUIRED",
                ],
                description:
                  "Specifies if connections must use Cloud SQL connectors. Option values include the following: `NOT_REQUIRED` (Cloud SQL instances can be connected without Cloud SQL Connectors) and `REQUIRED` (Only allow connections that use Cloud SQL Connectors). Note that using REQUIRED disables all existing authorized networks. If this field is not specified when creating a new instance, NOT_REQUIRED is used. If this field is not specified when patching or updating an existing instance, it is left unchanged in the instance.",
              },
              deletionProtectionEnabled: {
                type: "boolean",
                description:
                  "Configuration to protect against accidental instance deletion.",
              },
              timeZone: {
                type: "string",
                description:
                  "Server timezone, relevant only for Cloud SQL for SQL Server.",
              },
              advancedMachineFeatures: {
                type: "object",
                properties: {
                  threadsPerCore: {
                    type: "integer",
                    description:
                      "The number of threads per physical core. (Format: int32)",
                  },
                },
                description:
                  "Specifies options for controlling advanced machine features.",
                additionalProperties: true,
              },
              dataCacheConfig: {
                type: "object",
                properties: {
                  dataCacheEnabled: {
                    type: "boolean",
                    description:
                      "Whether data cache is enabled for the instance.",
                  },
                },
                description: "Data cache configurations.",
                additionalProperties: true,
              },
              replicationLagMaxSeconds: {
                type: "integer",
                description:
                  "Optional. Configuration value for recreation of replica after certain replication lag (Format: int32)",
              },
              enableGoogleMlIntegration: {
                type: "boolean",
                description:
                  "Optional. When this parameter is set to true, Cloud SQL instances can connect to Vertex AI to pass requests for real-time predictions and insights to the AI. The default value is false. This applies only to Cloud SQL for MySQL and Cloud SQL for PostgreSQL instances.",
              },
              enableDataplexIntegration: {
                type: "boolean",
                description:
                  "Optional. By default, Cloud SQL instances have schema extraction disabled for Dataplex. When this parameter is set to true, schema extraction for Dataplex on Cloud SQL instances is activated.",
              },
              retainBackupsOnDelete: {
                type: "boolean",
                description:
                  "Optional. When this parameter is set to true, Cloud SQL retains backups of the instance even after the instance is deleted. The ON_DEMAND backup will be retained until customer deletes the backup or the project. The AUTOMATED backup will be retained based on the backups retention setting.",
              },
              dataDiskProvisionedIops: {
                type: "string",
                description:
                  "Optional. Provisioned number of I/O operations per second for the data disk. This field is only used for hyperdisk-balanced disk types. (Format: int64)",
              },
              dataDiskProvisionedThroughput: {
                type: "string",
                description:
                  "Optional. Provisioned throughput measured in MiB per second for the data disk. This field is only used for hyperdisk-balanced disk types. (Format: int64)",
              },
              connectionPoolConfig: {
                type: "object",
                properties: {
                  connectionPoolingEnabled: {
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
                          description: "Required. The name of the flag.",
                        },
                        value: {
                          type: "string",
                          description:
                            "Required. The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.",
                        },
                      },
                      description:
                        "Connection pool flags for Cloud SQL instances managed connection pool configuration.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. List of connection pool configuration flags.",
                  },
                  poolerCount: {
                    type: "integer",
                    description:
                      "Output only. Number of connection poolers. (Format: int32)",
                  },
                },
                description: "The managed connection pooling configuration.",
                additionalProperties: true,
              },
              finalBackupConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Whether the final backup is enabled for the instance.",
                  },
                  retentionDays: {
                    type: "integer",
                    description:
                      "The number of days to retain the final backup after the instance deletion. The final backup will be purged at (time_of_instance_deletion + retention_days). (Format: int32)",
                  },
                },
                description:
                  "Config used to determine the final backup settings for the instance.",
                additionalProperties: true,
              },
              readPoolAutoScaleConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Indicates whether read pool auto scaling is enabled.",
                  },
                  minNodeCount: {
                    type: "integer",
                    description:
                      "Minimum number of read pool nodes to be maintained. (Format: int32)",
                  },
                  maxNodeCount: {
                    type: "integer",
                    description:
                      "Maximum number of read pool nodes to be maintained. (Format: int32)",
                  },
                  targetMetrics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        metric: {
                          type: "string",
                          description:
                            "The metric name to be used for auto scaling.",
                        },
                        targetValue: {
                          type: "number",
                          description:
                            "The target value for the metric. (Format: float)",
                        },
                      },
                      description: "Target metric for read pool auto scaling.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. Target metrics for read pool auto scaling.",
                  },
                  disableScaleIn: {
                    type: "boolean",
                    description:
                      "Indicates whether read pool auto scaling supports scale in operations (removing nodes).",
                  },
                  scaleInCooldownSeconds: {
                    type: "integer",
                    description:
                      "The cooldown period for scale-in operations. (Format: int32)",
                  },
                  scaleOutCooldownSeconds: {
                    type: "integer",
                    description:
                      "The cooldown period for scale-out operations. (Format: int32)",
                  },
                },
                description: "The read pool auto-scale configuration.",
                additionalProperties: true,
              },
              autoUpgradeEnabled: {
                type: "boolean",
                description:
                  "Optional. Cloud SQL for MySQL auto-upgrade configuration. When this parameter is set to true, auto-upgrade is enabled for MySQL 8.0 minor versions. The MySQL version must be 8.0.35 or higher.",
              },
              entraidConfig: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                    description:
                      "Output only. This is always sql#sqlServerEntraIdConfig",
                  },
                  tenantId: {
                    type: "string",
                    description:
                      "Optional. The tenant ID for the Entra ID configuration.",
                  },
                  applicationId: {
                    type: "string",
                    description:
                      "Optional. The application ID for the Entra ID configuration.",
                  },
                },
                description: "SQL Server Entra ID configuration.",
                additionalProperties: true,
              },
              dataApiAccess: {
                type: "string",
                enum: [
                  "DATA_API_ACCESS_UNSPECIFIED",
                  "DISALLOW_DATA_API",
                  "ALLOW_DATA_API",
                ],
                description:
                  "This parameter controls whether to allow using ExecuteSql API to connect to the instance. Not allowed by default.",
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
          failoverReplica: {
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
            description: "The name and status of the failover replica.",
            additionalProperties: true,
          },
          masterInstanceName: {
            type: "string",
            description:
              "The name of the instance which will act as primary in the replication setup.",
          },
          replicaNames: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The replicas of the instance.",
          },
          maxDiskSize: {
            type: "string",
            description:
              "The maximum disk size of the instance in bytes. (Format: int64)",
          },
          currentDiskSize: {
            type: "string",
            description:
              'The current disk usage of the instance in bytes. This property has been deprecated. Use the "cloudsql.googleapis.com/database/disk/bytes_used" metric in Cloud Monitoring API instead. Please see [this announcement](https://groups.google.com/d/msg/google-cloud-sql-announce/I_7-F9EBhT0/BtvFtdFeAgAJ) for details. (Format: int64)',
          },
          ipAddresses: {
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
                ipAddress: {
                  type: "string",
                  description: "The IP address assigned.",
                },
                timeToRetire: {
                  type: "string",
                  description:
                    "The due time for this IP to be retired in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. This field is only available when the IP is scheduled to be retired. (Format: google-datetime)",
                },
              },
              description: "Database instance IP mapping",
              additionalProperties: true,
            },
            description: "The assigned IP addresses for the instance.",
          },
          serverCaCert: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description: "This is always `sql#sslCert`.",
              },
              certSerialNumber: {
                type: "string",
                description:
                  "Serial number, as extracted from the certificate.",
              },
              cert: {
                type: "string",
                description: "PEM representation.",
              },
              createTime: {
                type: "string",
                description:
                  "The time when the certificate was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z` (Format: google-datetime)",
              },
              commonName: {
                type: "string",
                description:
                  "User supplied name. Constrained to [a-zA-Z.-_ ]+.",
              },
              expirationTime: {
                type: "string",
                description:
                  "The time when the certificate expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
              },
              sha1Fingerprint: {
                type: "string",
                description: "Sha1 Fingerprint.",
              },
              instance: {
                type: "string",
                description: "Name of the database instance.",
              },
              selfLink: {
                type: "string",
                description: "The URI of this resource.",
              },
            },
            description: "SslCerts Resource",
            additionalProperties: true,
          },
          instanceType: {
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
          ipv6Address: {
            type: "string",
            description:
              "The IPv6 address assigned to the instance. (Deprecated) This property was applicable only to First Generation instances.",
          },
          serviceAccountEmailAddress: {
            type: "string",
            description:
              "The service account email address assigned to the instance.\\This property is read-only.",
          },
          onPremisesConfiguration: {
            type: "object",
            properties: {
              hostPort: {
                type: "string",
                description:
                  "The host and port of the on-premises instance in host:port format",
              },
              kind: {
                type: "string",
                description: "This is always `sql#onPremisesConfiguration`.",
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
              caCertificate: {
                type: "string",
                description:
                  "PEM representation of the trusted CA's x509 certificate.",
              },
              clientCertificate: {
                type: "string",
                description:
                  "PEM representation of the replica's x509 certificate.",
              },
              clientKey: {
                type: "string",
                description:
                  "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
              },
              dumpFilePath: {
                type: "string",
                description: "The dump file to create the Cloud SQL replica.",
              },
              sourceInstance: {
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
              selectedObjects: {
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
                  description:
                    "A list of objects that the user selects for replication from an external source instance.",
                  additionalProperties: true,
                },
                description:
                  "Optional. A list of objects that the user selects for replication from an external source instance.",
              },
              sslOption: {
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
          replicaConfiguration: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description: "This is always `sql#replicaConfiguration`.",
              },
              mysqlReplicaConfiguration: {
                type: "object",
                properties: {
                  dumpFilePath: {
                    type: "string",
                    description:
                      "Path to a SQL dump file in Google Cloud Storage from which the replica instance is to be created. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported. Dumps have the binlog co-ordinates from which replication begins. This can be accomplished by setting --master-data to 1 when using mysqldump.",
                  },
                  username: {
                    type: "string",
                    description: "The username for the replication connection.",
                  },
                  password: {
                    type: "string",
                    description: "The password for the replication connection.",
                  },
                  connectRetryInterval: {
                    type: "integer",
                    description:
                      "Seconds to wait between connect retries. MySQL's default is 60 seconds. (Format: int32)",
                  },
                  masterHeartbeatPeriod: {
                    type: "string",
                    description:
                      "Interval in milliseconds between replication heartbeats. (Format: int64)",
                  },
                  caCertificate: {
                    type: "string",
                    description:
                      "PEM representation of the trusted CA's x509 certificate.",
                  },
                  clientCertificate: {
                    type: "string",
                    description:
                      "PEM representation of the replica's x509 certificate.",
                  },
                  clientKey: {
                    type: "string",
                    description:
                      "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
                  },
                  sslCipher: {
                    type: "string",
                    description:
                      "A list of permissible ciphers to use for SSL encryption.",
                  },
                  verifyServerCertificate: {
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
              failoverTarget: {
                type: "boolean",
                description:
                  "Specifies if the replica is the failover target. If the field is set to `true`, the replica will be designated as a failover replica. In case the primary instance fails, the replica instance will be promoted as the new primary instance. Only one replica can be specified as failover target, and the replica has to be in different zone with the primary instance.",
              },
              cascadableReplica: {
                type: "boolean",
                description:
                  "Optional. Specifies if a SQL Server replica is a cascadable replica. A cascadable replica is a SQL Server cross region replica that supports replica(s) under it.",
              },
            },
            description:
              "Read-replica configuration for connecting to the primary instance.",
            additionalProperties: true,
          },
          backendType: {
            type: "string",
            enum: [
              "SQL_BACKEND_TYPE_UNSPECIFIED",
              "FIRST_GEN",
              "SECOND_GEN",
              "EXTERNAL",
            ],
            description:
              "The backend type. `SECOND_GEN`: Cloud SQL database instance. `EXTERNAL`: A database server that is not managed by Google. This property is read-only; use the `tier` property in the `settings` object to determine the database type.",
          },
          selfLink: {
            type: "string",
            description: "The URI of this resource.",
          },
          suspensionReason: {
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
            },
            description:
              "If the instance state is SUSPENDED, the reason for the suspension.",
          },
          connectionName: {
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
              "The geographical region of the Cloud SQL instance. It can be one of the [regions](https://cloud.google.com/sql/docs/mysql/locations#location-r) where Cloud SQL operates: For example, `asia-east1`, `europe-west1`, and `us-central1`. The default value is `us-central1`.",
          },
          gceZone: {
            type: "string",
            description:
              "The Compute Engine zone that the instance is currently serving from. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary zone. WARNING: Changing this might restart the instance.",
          },
          secondaryGceZone: {
            type: "string",
            description:
              "The Compute Engine zone that the failover instance is currently serving from for a regional instance. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary/failover zone.",
          },
          diskEncryptionConfiguration: {
            type: "object",
            properties: {
              kmsKeyName: {
                type: "string",
                description: "Resource name of KMS key for disk encryption",
              },
              kind: {
                type: "string",
                description:
                  "This is always `sql#diskEncryptionConfiguration`.",
              },
            },
            description: "Disk encryption configuration for an instance.",
            additionalProperties: true,
          },
          diskEncryptionStatus: {
            type: "object",
            properties: {
              kmsKeyVersionName: {
                type: "string",
                description:
                  "KMS key version used to encrypt the Cloud SQL instance resource",
              },
              kind: {
                type: "string",
                description: "This is always `sql#diskEncryptionStatus`.",
              },
            },
            description: "Disk encryption status for an instance.",
            additionalProperties: true,
          },
          rootPassword: {
            type: "string",
            description:
              "Initial root password. Use only on creation. You must set root passwords before you can connect to PostgreSQL instances.",
          },
          scheduledMaintenance: {
            type: "object",
            properties: {
              startTime: {
                type: "string",
                description:
                  "The start time of any upcoming scheduled maintenance for this instance. (Format: google-datetime)",
              },
              canDefer: {
                type: "boolean",
              },
              canReschedule: {
                type: "boolean",
                description: "If the scheduled maintenance can be rescheduled.",
              },
              scheduleDeadlineTime: {
                type: "string",
                description:
                  "Maintenance cannot be rescheduled to start beyond this deadline. (Format: google-datetime)",
              },
            },
            description: "Any scheduled maintenance for this instance.",
            additionalProperties: true,
          },
          satisfiesPzs: {
            type: "boolean",
            description:
              "This status indicates whether the instance satisfies PZS. The status is reserved for future use.",
          },
          databaseInstalledVersion: {
            type: "string",
            description:
              "Output only. Stores the current database version running on the instance including minor version such as `MYSQL_8_0_18`.",
          },
          outOfDiskReport: {
            type: "object",
            properties: {
              sqlOutOfDiskState: {
                type: "string",
                enum: [
                  "SQL_OUT_OF_DISK_STATE_UNSPECIFIED",
                  "NORMAL",
                  "SOFT_SHUTDOWN",
                ],
                description:
                  "This field represents the state generated by the proactive database wellness job for OutOfDisk issues. * Writers: * the proactive database wellness job for OOD. * Readers: * the proactive database wellness job",
              },
              sqlMinRecommendedIncreaseSizeGb: {
                type: "integer",
                description:
                  "The minimum recommended increase size in GigaBytes This field is consumed by the frontend * Writers: * the proactive database wellness job for OOD. * Readers: (Format: int32)",
              },
            },
            description:
              "This message wraps up the information written by out-of-disk detection job.",
            additionalProperties: true,
          },
          createTime: {
            type: "string",
            description:
              "Output only. The time when the instance was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
          },
          availableMaintenanceVersions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. List all maintenance versions applicable on the instance",
          },
          maintenanceVersion: {
            type: "string",
            description: "The current software version on the instance.",
          },
          upgradableDatabaseVersions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                majorVersion: {
                  type: "string",
                  description: "The version's major version name.",
                },
                name: {
                  type: "string",
                  description:
                    "The database version name. For MySQL 8.0, this string provides the database major and minor version.",
                },
                displayName: {
                  type: "string",
                  description: "The database version's display name.",
                },
              },
              description:
                "An available database version. It can be a major or a minor version.",
              additionalProperties: true,
            },
            description:
              "Output only. All database versions that are available for upgrade.",
          },
          sqlNetworkArchitecture: {
            type: "string",
            enum: [
              "SQL_NETWORK_ARCHITECTURE_UNSPECIFIED",
              "NEW_NETWORK_ARCHITECTURE",
              "OLD_NETWORK_ARCHITECTURE",
            ],
          },
          pscServiceAttachmentLink: {
            type: "string",
            description:
              "Output only. The link to service attachment of PSC instance.",
          },
          dnsName: {
            type: "string",
            description: "Output only. The dns name of the instance.",
          },
          primaryDnsName: {
            type: "string",
            description:
              "Output only. DEPRECATED: please use write_endpoint instead.",
          },
          writeEndpoint: {
            type: "string",
            description:
              "Output only. The dns name of the primary instance in a replication group.",
          },
          replicationCluster: {
            type: "object",
            properties: {
              psaWriteEndpoint: {
                type: "string",
                description:
                  "Output only. If set, this field indicates this instance has a private service access (PSA) DNS endpoint that is pointing to the primary instance of the cluster. If this instance is the primary, then the DNS endpoint points to this instance. After a switchover or replica failover operation, this DNS endpoint points to the promoted instance. This is a read-only field, returned to the user as information. This field can exist even if a standalone instance doesn't have a DR replica yet or the DR replica is deleted.",
              },
              failoverDrReplicaName: {
                type: "string",
                description:
                  "Optional. If the instance is a primary instance, then this field identifies the disaster recovery (DR) replica. A DR replica is an optional configuration for Enterprise Plus edition instances. If the instance is a read replica, then the field is not set. Set this field to a replica name to designate a DR replica for a primary instance. Remove the replica name to remove the DR replica designation.",
              },
              drReplica: {
                type: "boolean",
                description:
                  "Output only. Read-only field that indicates whether the replica is a DR replica. This field is not set if the instance is a primary instance.",
              },
            },
            description:
              "A primary instance and disaster recovery (DR) replica pair. A DR replica is a cross-region replica that you designate for failover in the event that the primary instance experiences regional failure. Applicable to MySQL and PostgreSQL.",
            additionalProperties: true,
          },
          geminiConfig: {
            type: "object",
            properties: {
              entitled: {
                type: "boolean",
                description: "Output only. Whether Gemini is enabled.",
              },
              googleVacuumMgmtEnabled: {
                type: "boolean",
                description:
                  "Output only. Whether the vacuum management is enabled.",
              },
              oomSessionCancelEnabled: {
                type: "boolean",
                description:
                  "Output only. Whether canceling the out-of-memory (OOM) session is enabled.",
              },
              activeQueryEnabled: {
                type: "boolean",
                description:
                  "Output only. Whether the active query is enabled.",
              },
              indexAdvisorEnabled: {
                type: "boolean",
                description:
                  "Output only. Whether the index advisor is enabled.",
              },
              flagRecommenderEnabled: {
                type: "boolean",
                description:
                  "Output only. Whether the flag recommender is enabled.",
              },
            },
            description: "Gemini instance configuration.",
            additionalProperties: true,
          },
          satisfiesPzi: {
            type: "boolean",
            description:
              "Output only. This status indicates whether the instance satisfies PZI. The status is reserved for future use.",
          },
          switchTransactionLogsToCloudStorageEnabled: {
            type: "boolean",
            description:
              "Input only. Whether Cloud SQL is enabled to switch storing point-in-time recovery log files from a data disk to Cloud Storage.",
          },
          includeReplicasForMajorVersionUpgrade: {
            type: "boolean",
            description:
              "Input only. Determines whether an in-place major version upgrade of replicas happens when an in-place major version upgrade of a primary instance is initiated.",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Tag keys and tag values that are bound to this instance. You must represent each item in the map as: `"" : ""`. For example, a single resource can have the following tags: ``` "123/environment": "production", "123/costCenter": "marketing", ``` For more information on tag creation and management, see https://cloud.google.com/resource-manager/docs/tags/tags-overview.',
          },
          nodeCount: {
            type: "integer",
            description:
              "The number of read pool nodes in a read pool. (Format: int32)",
          },
          nodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The name of the read pool node, to be used for retrieving metrics and logs.",
                },
                gceZone: {
                  type: "string",
                  description: "Output only. The zone of the read pool node.",
                },
                ipAddresses: {
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
                      ipAddress: {
                        type: "string",
                        description: "The IP address assigned.",
                      },
                      timeToRetire: {
                        type: "string",
                        description:
                          "The due time for this IP to be retired in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. This field is only available when the IP is scheduled to be retired. (Format: google-datetime)",
                      },
                    },
                    description: "Database instance IP mapping",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. Mappings containing IP addresses that can be used to connect to the read pool node.",
                },
                dnsName: {
                  type: "string",
                  description:
                    "Output only. The DNS name of the read pool node.",
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
                    "Output only. The current state of the read pool node.",
                },
                dnsNames: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "The DNS name.",
                      },
                      connectionType: {
                        type: "string",
                        enum: [
                          "CONNECTION_TYPE_UNSPECIFIED",
                          "PUBLIC",
                          "PRIVATE_SERVICES_ACCESS",
                          "PRIVATE_SERVICE_CONNECT",
                        ],
                        description:
                          "Output only. The connection type of the DNS name.",
                      },
                      dnsScope: {
                        type: "string",
                        enum: ["DNS_SCOPE_UNSPECIFIED", "INSTANCE"],
                        description:
                          "Output only. The scope that the DNS name applies to.",
                      },
                    },
                    description: "DNS metadata.",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. The list of DNS names used by this read pool node.",
                },
              },
              description: "Details of a single read pool node of a read pool.",
              additionalProperties: true,
            },
            description:
              "Output only. Entries containing information about each read pool node of the read pool.",
          },
          dnsNames: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The DNS name.",
                },
                connectionType: {
                  type: "string",
                  enum: [
                    "CONNECTION_TYPE_UNSPECIFIED",
                    "PUBLIC",
                    "PRIVATE_SERVICES_ACCESS",
                    "PRIVATE_SERVICE_CONNECT",
                  ],
                  description:
                    "Output only. The connection type of the DNS name.",
                },
                dnsScope: {
                  type: "string",
                  enum: ["DNS_SCOPE_UNSPECIFIED", "INSTANCE"],
                  description:
                    "Output only. The scope that the DNS name applies to.",
                },
              },
              description: "DNS metadata.",
              additionalProperties: true,
            },
            description:
              "Output only. The list of DNS names used by this instance.",
          },
        },
        description: "A Cloud SQL instance resource.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesGet;
