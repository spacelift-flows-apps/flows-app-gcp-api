import { AppBlock, events } from "@slflows/sdk/v1";
import { getSchemaServiceClient } from "../../lib/grpcClient.ts";

const createSchema: AppBlock = {
  name: "Create Schema",
  description: `Creates a schema.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the project in which to create the schema. Format is `projects/{project-id}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the project in which to create the schema. Format is `projects/{project-id}`.",
          },
          required: true,
        },
        schema: {
          name: "Schema",
          description:
            "Required. The schema object to create.  This schema's `name` parameter is ignored. The schema object returned by CreateSchema will have a `name` made using the given `parent` and `schema_id`.",
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
        schemaId: {
          name: "Schema Id",
          description:
            "The ID to use for the schema, which will become the final component of the schema's resource name.  See https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names for resource name constraints.",
          type: {
            type: "string",
            description:
              "The ID to use for the schema, which will become the final component of the schema's resource name.  See https://cloud.google.com/pubsub/docs/pubsub-basics#resource_names for resource name constraints.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSchemaServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.schema !== undefined)
          request.schema = input.event.inputConfig.schema;
        if (input.event.inputConfig.schemaId !== undefined)
          request.schemaId = input.event.inputConfig.schemaId;

        const result = await new Promise<any>((resolve, reject) => {
          client.createSchema(request, (err: any, response: any) => {
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

export default createSchema;
