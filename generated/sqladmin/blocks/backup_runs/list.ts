import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSqlBackupRunsServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  maxResults: "max_results",
  pageToken: "page_token",
};

const outputMapping = {
  items: {
    name: "items",
    fields: {
      enqueued_time: "enqueuedTime",
      start_time: "startTime",
      end_time: "endTime",
      window_start_time: "windowStartTime",
      self_link: "selfLink",
      database_version: "databaseVersion",
      disk_encryption_configuration: {
        name: "diskEncryptionConfiguration",
        fields: {
          kms_key_name: "kmsKeyName",
        },
      },
      disk_encryption_status: {
        name: "diskEncryptionStatus",
        fields: {
          kms_key_version_name: "kmsKeyVersionName",
        },
      },
      backup_kind: "backupKind",
      time_zone: "timeZone",
      max_chargeable_bytes: "maxChargeableBytes",
    },
  },
  next_page_token: "nextPageToken",
};

const list: AppBlock = {
  name: "List",
  description: `Lists users in the specified Cloud SQL instance.`,
  category: "Backup Runs",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            'Cloud SQL instance ID, or "-" for all instances. This does not include the project ID.',
          type: {
            type: "string",
            description:
              'Cloud SQL instance ID, or "-" for all instances. This does not include the project ID.',
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description: "Maximum number of backup runs per response.",
          type: {
            type: "integer",
            description: "Maximum number of backup runs per response.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A previously-returned page token representing part of the larger set of results to view.",
          type: {
            type: "string",
            description:
              "A previously-returned page token representing part of the larger set of results to view.",
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
        const client = await getSqlBackupRunsServiceClient(input.app.config);

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
            description: "This is always `sql#backupRunsList`.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description: "This is always `sql#backupRun`.",
                },
                status: {
                  type: "string",
                  enum: [
                    "SQL_BACKUP_RUN_STATUS_UNSPECIFIED",
                    "ENQUEUED",
                    "OVERDUE",
                    "RUNNING",
                    "FAILED",
                    "SUCCESSFUL",
                    "SKIPPED",
                    "DELETION_PENDING",
                    "DELETION_FAILED",
                    "DELETED",
                  ],
                  description: "The status of a backup run.",
                },
                enqueuedTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                startTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                endTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                error: {
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
                type: {
                  type: "string",
                  enum: [
                    "SQL_BACKUP_RUN_TYPE_UNSPECIFIED",
                    "AUTOMATED",
                    "ON_DEMAND",
                  ],
                  description:
                    "Type of backup (i.e. automated, on demand, etc).",
                },
                description: {
                  type: "string",
                  description:
                    "The description of this run, only applicable to on-demand backups.",
                },
                windowStartTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                instance: {
                  type: "string",
                  description: "Name of the database instance.",
                },
                selfLink: {
                  type: "string",
                  description: "The URI of this resource.",
                },
                location: {
                  type: "string",
                  description: "Location of the backups.",
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
                diskEncryptionConfiguration: {
                  type: "object",
                  properties: {
                    kmsKeyName: {
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
                backupKind: {
                  type: "string",
                  enum: ["SQL_BACKUP_KIND_UNSPECIFIED", "SNAPSHOT", "PHYSICAL"],
                  description: "Defines the supported backup kinds.",
                },
                timeZone: {
                  type: "string",
                  description:
                    "Backup time zone to prevent restores to an instance with a different time zone. Now relevant only for SQL Server.",
                },
                maxChargeableBytes: {
                  type: "string",
                  description: "64-bit integer as string",
                },
              },
              description: "A BackupRun resource.",
              additionalProperties: true,
            },
            description:
              "A list of backup runs in reverse chronological order of the enqueued time.",
          },
          nextPageToken: {
            type: "string",
            description:
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
        },
        description: "Backup run list results.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
