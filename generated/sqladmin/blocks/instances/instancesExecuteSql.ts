import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesExecuteSql: AppBlock = {
  name: "Instances - Execute SQL",
  description: `Execute SQL statements.`,
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
        user: {
          name: "User",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The name of an existing database user to connect to the database. When `auto_iam_authn` is set to true, this field is ignored and the API caller's IAM user is used.",
          },
          required: false,
        },
        sqlStatement: {
          name: "SQL Statement",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. SQL statements to run on the database. It can be a single statement or a sequence of statements separated by semicolons.",
          },
          required: false,
        },
        database: {
          name: "Database",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Name of the database on which the statement will be executed.",
          },
          required: false,
        },
        autoIamAuthn: {
          name: "Auto IAM Authn",
          description: "Optional.",
          type: {
            type: "boolean",
            description:
              "Optional. When set to true, the API caller identity associated with the request is used for database authentication. The API caller must be an IAM user in the database.",
          },
          required: false,
        },
        rowLimit: {
          name: "Row Limit",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The maximum number of rows returned per SQL statement. (Format: int64)",
          },
          required: false,
        },
        partialResultMode: {
          name: "Partial Result Mode",
          description: "Optional.",
          type: {
            type: "string",
            enum: [
              "PARTIAL_RESULT_MODE_UNSPECIFIED",
              "FAIL_PARTIAL_RESULT",
              "ALLOW_PARTIAL_RESULT",
            ],
            description:
              "Optional. Controls how the API should respond when the SQL execution result is incomplete due to the size limit or another error. The default mode is to throw an error.",
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
        let path = `v1/projects/{project}/instances/{instance}/executeSql`;

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

        if (input.event.inputConfig.user !== undefined)
          requestBody.user = input.event.inputConfig.user;
        if (input.event.inputConfig.sqlStatement !== undefined)
          requestBody.sqlStatement = input.event.inputConfig.sqlStatement;
        if (input.event.inputConfig.database !== undefined)
          requestBody.database = input.event.inputConfig.database;
        if (input.event.inputConfig.autoIamAuthn !== undefined)
          requestBody.autoIamAuthn = input.event.inputConfig.autoIamAuthn;
        if (input.event.inputConfig.rowLimit !== undefined)
          requestBody.rowLimit = input.event.inputConfig.rowLimit;
        if (input.event.inputConfig.partialResultMode !== undefined)
          requestBody.partialResultMode =
            input.event.inputConfig.partialResultMode;

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
          messages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description:
                    "The full message string. For PostgreSQL, this is a formatted string that may include severity, code, and the notice/warning message. For MySQL, this contains the warning message.",
                },
                severity: {
                  type: "string",
                  description:
                    'The severity of the message (e.g., "NOTICE" for PostgreSQL, "WARNING" for MySQL).',
                },
              },
              description:
                "Represents a notice or warning message from the database.",
              additionalProperties: true,
            },
            description:
              "A list of notices and warnings generated during query execution. For PostgreSQL, this includes all notices and warnings. For MySQL, this includes warnings generated by the last executed statement. To retrieve all warnings for a multi-statement query, `SHOW WARNINGS` must be executed after each statement.",
          },
          metadata: {
            type: "object",
            properties: {
              sqlStatementExecutionTime: {
                type: "string",
                description:
                  "The time taken to execute the SQL statements. (Format: google-duration)",
              },
            },
            description:
              "The additional metadata information regarding the execution of the SQL statements.",
            additionalProperties: true,
          },
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                columns: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Name of the column.",
                      },
                      type: {
                        type: "string",
                        description: "Datatype of the column.",
                      },
                    },
                    description: "Contains the name and datatype of a column.",
                    additionalProperties: true,
                  },
                  description:
                    "List of columns included in the result. This also includes the data type of the column.",
                },
                rows: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      values: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            value: {
                              type: "string",
                              description: "The cell value in string format.",
                            },
                            nullValue: {
                              type: "boolean",
                              description:
                                "If cell value is null, then this flag will be set to true.",
                            },
                          },
                          description: "The cell value of the table.",
                          additionalProperties: true,
                        },
                        description: "The values for the row.",
                      },
                    },
                    description: "Contains the values for a row.",
                    additionalProperties: true,
                  },
                  description: "Rows returned by the SQL statement.",
                },
                message: {
                  type: "string",
                  description: "Message related to the SQL execution result.",
                },
                partialResult: {
                  type: "boolean",
                  description:
                    "Set to true if the SQL execution's result is truncated due to size limits or an error retrieving results.",
                },
                status: {
                  type: "object",
                  properties: {
                    code: {
                      type: "integer",
                      description:
                        "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
                    },
                    message: {
                      type: "string",
                      description:
                        "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.",
                    },
                    details: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                      description:
                        "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
                    },
                  },
                  description:
                    "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
                  additionalProperties: true,
                },
              },
              description:
                "QueryResult contains the result of executing a single SQL statement.",
              additionalProperties: true,
            },
            description:
              "The list of results after executing all the SQL statements.",
          },
          status: {
            type: "object",
            properties: {
              code: {
                type: "integer",
                description:
                  "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
              },
              message: {
                type: "string",
                description:
                  "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description:
                  "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              },
            },
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
            additionalProperties: true,
          },
        },
        description: "Execute SQL statements response.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesExecuteSql;
