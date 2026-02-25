import { AppBlock, events } from "@slflows/sdk/v1";
import { getSchemaServiceClient } from "../../lib/grpcClient.ts";

const deleteSchema: AppBlock = {
  name: "Schemas - Delete Schema",
  description: `Deletes a schema.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Name of the schema to delete. Format is `projects/{project}/schemas/{schema}`.",
          type: {
            type: "string",
            description:
              "Required. Name of the schema to delete. Format is `projects/{project}/schemas/{schema}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSchemaServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteSchema(request, (err: any, response: any) => {
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
        additionalProperties: true,
      },
    },
  },
};

export default deleteSchema;
