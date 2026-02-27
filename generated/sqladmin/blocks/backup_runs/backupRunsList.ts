import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const backupRunsList: AppBlock = {
  name: "Backup Runs - List",
  description: `Lists all backup runs associated with the project or a given instance and configuration in the reverse chronological order of the backup initiation time.`,
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
          },
          required: true,
        },
        maxResults: {
          name: "Max Results",
          description: "Maximum number of backup runs per response.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A previously-returned page token representing part of the larger set of results to view.",
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
        let path = `v1/projects/{project}/instances/{instance}/backupRuns`;

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
                  description: "The status of this run.",
                },
                enqueuedTime: {
                  type: "string",
                  description:
                    "The time the run was enqueued in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
                },
                id: {
                  type: "string",
                  description:
                    "The identifier for this backup run. Unique only for a specific Cloud SQL instance. (Format: int64)",
                },
                startTime: {
                  type: "string",
                  description:
                    "The time the backup operation actually started in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
                },
                endTime: {
                  type: "string",
                  description:
                    "The time the backup operation completed in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
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
                    'The type of this run; can be either "AUTOMATED" or "ON_DEMAND" or "FINAL". This field defaults to "ON_DEMAND" and is ignored, when specified for insert requests.',
                },
                description: {
                  type: "string",
                  description:
                    "The description of this run, only applicable to on-demand backups.",
                },
                windowStartTime: {
                  type: "string",
                  description:
                    "The start time of the backup window during which this the backup was attempted in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
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
                    "Output only. The instance database version at the time this backup was made.",
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
                  description:
                    "Specifies the kind of backup, PHYSICAL or DEFAULT_SNAPSHOT.",
                },
                timeZone: {
                  type: "string",
                  description:
                    "Backup time zone to prevent restores to an instance with a different time zone. Now relevant only for SQL Server.",
                },
                maxChargeableBytes: {
                  type: "string",
                  description:
                    "Output only. The maximum chargeable bytes for the backup. (Format: int64)",
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

export default backupRunsList;
