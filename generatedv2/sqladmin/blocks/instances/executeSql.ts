import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlInstancesServiceClient } from "../../lib/grpcClient.ts";

const executeSql: AppBlock = {
  name: "Execute Sql",
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
            description:
              "Required. Database instance ID. This does not include the project ID.",
          },
          required: true,
        },
        project: {
          name: "Project",
          description:
            "Required. Project ID of the project that contains the instance.",
          type: {
            type: "string",
            description:
              "Required. Project ID of the project that contains the instance.",
          },
          required: true,
        },
        body: {
          name: "Body",
          description: "The request body.",
          type: {
            type: "object",
            properties: {
              user: {
                type: "string",
                description:
                  "Optional. The name of an existing database user to connect to the database. When `auto_iam_authn` is set to true, this field is ignored and the API caller's IAM user is used.",
              },
              sql_statement: {
                type: "string",
                description:
                  "Required. SQL statements to run on the database. It can be a single statement or a sequence of statements separated by semicolons.",
              },
              database: {
                type: "string",
                description:
                  "Optional. Name of the database on which the statement will be executed.",
              },
              auto_iam_authn: {
                type: "boolean",
                description:
                  "Optional. When set to true, the API caller identity associated with the request is used for database authentication. The API caller must be an IAM user in the database.",
              },
              row_limit: {
                type: "string",
                description: "64-bit integer as string",
              },
              partial_result_mode: {
                type: "string",
                enum: [
                  "PARTIAL_RESULT_MODE_UNSPECIFIED",
                  "FAIL_PARTIAL_RESULT",
                  "ALLOW_PARTIAL_RESULT",
                ],
                description:
                  "Optional. Controls how the API should respond when the SQL execution result is incomplete due to the size limit or another error. The default mode is to throw an error.",
              },
              application: {
                type: "string",
                description:
                  "Optional. Specifies the name of the application that is making the request. This field is used for telemetry. Only alphanumeric characters, dashes, and underscores are allowed. The maximum length is 32 characters.",
              },
            },
            required: ["sql_statement"],
            description: "The request payload used to execute SQL statements.",
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
          client.executeSql(request, (err: any, response: any) => {
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
              sql_statement_execution_time: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
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
                            null_value: {
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
                partial_result: {
                  type: "boolean",
                  description:
                    "Set to true if the SQL execution's result is truncated due to size limits or an error retrieving results.",
                },
                status: {
                  type: "object",
                  properties: {
                    code: {
                      type: "integer",
                    },
                    message: {
                      type: "string",
                    },
                    details: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          type_url: {
                            type: "string",
                          },
                          value: {
                            type: "string",
                            description: "Base64-encoded bytes",
                          },
                        },
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: true,
                  description:
                    "If results were truncated due to an error, details of that error.",
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
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type_url: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "Contains the error from the database if the SQL execution failed.",
          },
        },
        description: "Execute SQL statements response.",
        additionalProperties: true,
      },
    },
  },
};

export default executeSql;
