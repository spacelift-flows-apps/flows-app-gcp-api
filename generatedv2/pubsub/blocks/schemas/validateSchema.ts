import { AppBlock, events } from "@slflows/sdk/v1";
import { getSchemaServiceClient } from "../../lib/grpcClient.ts";

const validateSchema: AppBlock = {
  name: "Validate Schema",
  description: `Validates a schema.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the project in which to validate schemas. Format is `projects/{project-id}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the project in which to validate schemas. Format is `projects/{project-id}`.",
          },
          required: true,
        },
        schema: {
          name: "Schema",
          description: "Required. The schema object to validate.",
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
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.schema !== undefined)
          request.schema = input.event.inputConfig.schema;

        const result = await new Promise<any>((resolve, reject) => {
          client.validateSchema(request, (err: any, response: any) => {
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
        properties: {},
        description: "Response for the `ValidateSchema` method. Empty for now.",
        additionalProperties: true,
      },
    },
  },
};

export default validateSchema;
