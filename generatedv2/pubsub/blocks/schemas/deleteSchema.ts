import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSchemaServiceClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const deleteSchema: AppBlock = {
  name: "Delete Schema",
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

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteSchema(protoRequest, (err: any, response: any) => {
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
        additionalProperties: true,
      },
    },
  },
};

export default deleteSchema;
