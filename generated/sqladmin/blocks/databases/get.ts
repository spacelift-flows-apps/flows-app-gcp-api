import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSqlDatabasesServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  self_link: "selfLink",
  sqlserver_database_details: {
    name: "sqlserverDatabaseDetails",
    fields: {
      compatibility_level: "compatibilityLevel",
      recovery_model: "recoveryModel",
    },
  },
};

const get: AppBlock = {
  name: "Get",
  description: `Retrieves a resource containing information about a user.`,
  category: "Databases",
  inputs: {
    default: {
      config: {
        database: {
          name: "Database",
          description: "Name of the database in the instance.",
          type: {
            type: "string",
            description: "Name of the database in the instance.",
          },
          required: false,
        },
        instance: {
          name: "Instance",
          description:
            "Database instance ID. This does not include the project ID.",
          type: {
            type: "string",
            description:
              "Database instance ID. This does not include the project ID.",
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
        const client = await getSqlDatabasesServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.get(request, (err: any, response: any) => {
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
                  "The version of SQL Server with which the database is to be made compatible",
              },
              recoveryModel: {
                type: "string",
                description: "The recovery model of a SQL Server database",
              },
            },
            description:
              "Represents a Sql Server database on the Cloud SQL instance.",
            additionalProperties: true,
          },
        },
        description: "Represents a SQL database on the Cloud SQL instance.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
