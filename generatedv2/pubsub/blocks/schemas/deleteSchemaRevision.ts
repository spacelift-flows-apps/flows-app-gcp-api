import { AppBlock, events } from "@slflows/sdk/v1";
import { getSchemaServiceClient } from "../../lib/grpcClient.ts";

const deleteSchemaRevision: AppBlock = {
  name: "Schemas - Delete Schema Revision",
  description: `Deletes a specific schema revision.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the schema revision to be deleted, with a revision ID explicitly included.  Example: `projects/123/schemas/my-schema@c7cfa2a8`",
          type: {
            type: "string",
            description:
              "Required. The name of the schema revision to be deleted, with a revision ID explicitly included.  Example: `projects/123/schemas/my-schema@c7cfa2a8`",
          },
          required: true,
        },
        revisionId: {
          name: "Revision Id",
          description:
            "Optional. This field is deprecated and should not be used for specifying the revision ID. The revision ID should be specified via the `name` parameter.",
          type: {
            type: "string",
            description:
              "Optional. This field is deprecated and should not be used for specifying the revision ID. The revision ID should be specified via the `name` parameter.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSchemaServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.revisionId !== undefined)
          request.revisionId = input.event.inputConfig.revisionId;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteSchemaRevision(request, (err: any, response: any) => {
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

export default deleteSchemaRevision;
