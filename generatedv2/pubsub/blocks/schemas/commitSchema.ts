import { AppBlock, events } from "@slflows/sdk/v1";
import { getSchemaServiceClient } from "../../lib/grpcClient.ts";

const commitSchema: AppBlock = {
  name: "Schemas - Commit Schema",
  description: `Commits a new schema revision to an existing schema.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the schema we are revising. Format is `projects/{project}/schemas/{schema}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the schema we are revising. Format is `projects/{project}/schemas/{schema}`.",
          },
          required: true,
        },
        schema: {
          name: "Schema",
          description: "Required. The schema revision to commit.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Required. Name of the schema. Format is `projects/{project}/schemas/{schema}`.",
              },
              type: {
                type: "string",
                enum: ["TYPE_UNSPECIFIED", "PROTOCOL_BUFFER", "AVRO"],
                description: "The type of the schema definition.",
              },
              definition: {
                type: "string",
                description:
                  "The definition of the schema. This should contain a string representing the full definition of the schema that is a valid schema definition of the type specified in `type`.",
              },
            },
            required: ["name"],
            description: "A schema resource.",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSchemaServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.schema !== undefined)
          request.schema = input.event.inputConfig.schema;

        const result = await new Promise<any>((resolve, reject) => {
          client.commitSchema(request, (err: any, response: any) => {
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
          name: {
            type: "string",
            description:
              "Required. Name of the schema. Format is `projects/{project}/schemas/{schema}`.",
          },
          type: {
            type: "string",
            enum: ["TYPE_UNSPECIFIED", "PROTOCOL_BUFFER", "AVRO"],
            description: "The type of the schema definition.",
          },
          definition: {
            type: "string",
            description:
              "The definition of the schema. This should contain a string representing the full definition of the schema that is a valid schema definition of the type specified in `type`.",
          },
          revisionId: {
            type: "string",
            description:
              "Output only. Immutable. The revision ID of the schema.",
          },
          revisionCreateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        required: ["name"],
        description: "A schema resource.",
        additionalProperties: true,
      },
    },
  },
};

export default commitSchema;
