import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSchemaServiceClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const validateMessage: AppBlock = {
  name: "Validate Message",
  description: `Validates a message against a schema.`,
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
        name: {
          name: "Name",
          description:
            "Name of the schema against which to validate.  Format is `projects/{project}/schemas/{schema}`.",
          type: {
            type: "string",
            description:
              "Name of the schema against which to validate.  Format is `projects/{project}/schemas/{schema}`. (Part of 'schema_spec' - only one field in this group can be set)",
          },
          required: false,
        },
        schema: {
          name: "Schema",
          description: "Ad-hoc schema against which to validate",
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
            description:
              "A schema resource. (Part of 'schema_spec' - only one field in this group can be set)",
            additionalProperties: true,
          },
          required: false,
        },
        message: {
          name: "Message",
          description:
            "Message to validate against the provided `schema_spec`.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: false,
        },
        encoding: {
          name: "Encoding",
          description: "The encoding expected for messages",
          type: {
            type: "string",
            enum: ["ENCODING_UNSPECIFIED", "JSON", "BINARY"],
            description: "Possible encoding types for messages.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSchemaServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.schema !== undefined)
          request.schema = input.event.inputConfig.schema;
        if (input.event.inputConfig.message !== undefined)
          request.message = input.event.inputConfig.message;
        if (input.event.inputConfig.encoding !== undefined)
          request.encoding = input.event.inputConfig.encoding;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.validateMessage(protoRequest, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        await events.emit(result ? toCamelCase(result) : {});
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        description:
          "Response for the `ValidateMessage` method. Empty for now.",
        additionalProperties: true,
      },
    },
  },
};

export default validateMessage;
