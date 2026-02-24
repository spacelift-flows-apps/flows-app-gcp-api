import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const databasesList: AppBlock = {
  name: "Databases - List",
  description: `Lists databases in the specified Cloud SQL instance.`,
  category: "Databases",
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
        let path = `v1/projects/{project}/instances/{instance}/databases`;

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
            description: "This is always `sql#databasesList`.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description: "This is always `sql#database`.",
                },
                charset: {
                  type: "string",
                  description: "The Cloud SQL charset value.",
                },
                collation: {
                  type: "string",
                  description: "The Cloud SQL collation value.",
                },
                etag: {
                  type: "string",
                  description:
                    "This field is deprecated and will be removed from a future version of the API.",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the database in the Cloud SQL instance. This does not include the project ID or instance name.",
                },
                instance: {
                  type: "string",
                  description:
                    "The name of the Cloud SQL instance. This does not include the project ID.",
                },
                selfLink: {
                  type: "string",
                  description: "The URI of this resource.",
                },
                project: {
                  type: "string",
                  description:
                    "The project ID of the project containing the Cloud SQL database. The Google apps domain is prefixed if applicable.",
                },
                sqlserverDatabaseDetails: {
                  type: "object",
                  properties: {
                    compatibilityLevel: {
                      type: "integer",
                      description:
                        "The version of SQL Server with which the database is to be made compatible (Format: int32)",
                    },
                    recoveryModel: {
                      type: "string",
                      description:
                        "The recovery model of a SQL Server database",
                    },
                  },
                  description:
                    "Represents a Sql Server database on the Cloud SQL instance.",
                  additionalProperties: true,
                },
              },
              description:
                "Represents a SQL database on the Cloud SQL instance.",
              additionalProperties: true,
            },
            description: "List of database resources in the instance.",
          },
        },
        description: "Database list response.",
        additionalProperties: true,
      },
    },
  },
};

export default databasesList;
