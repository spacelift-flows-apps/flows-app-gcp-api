import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSchemaServiceClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const listSchemas: AppBlock = {
  name: "List Schemas",
  description: `Lists schemas in a project.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the project in which to list schemas. Format is `projects/{project-id}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the project in which to list schemas. Format is `projects/{project-id}`.",
          },
          required: true,
        },
        view: {
          name: "View",
          description:
            "The set of Schema fields to return in the response. If not set, returns Schemas with `name` and `type`, but not `definition`. Set to `FULL` to retrieve all fields.",
          type: {
            type: "string",
            enum: ["SCHEMA_VIEW_UNSPECIFIED", "BASIC", "FULL"],
            description:
              "View of Schema object fields to be returned by GetSchema and ListSchemas.",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description: "Maximum number of schemas to return.",
          type: {
            type: "integer",
            description: "Maximum number of schemas to return.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "The value returned by the last `ListSchemasResponse`; indicates that this is a continuation of a prior `ListSchemas` call, and that the system should return the next page of data.",
          type: {
            type: "string",
            description:
              "The value returned by the last `ListSchemasResponse`; indicates that this is a continuation of a prior `ListSchemas` call, and that the system should return the next page of data.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSchemaServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.view !== undefined)
          request.view = input.event.inputConfig.view;
        if (input.event.inputConfig.pageSize !== undefined)
          request.pageSize = input.event.inputConfig.pageSize;
        if (input.event.inputConfig.pageToken !== undefined)
          request.pageToken = input.event.inputConfig.pageToken;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.listSchemas(protoRequest, (err: any, response: any) => {
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
        properties: {
          schemas: {
            type: "array",
            items: {
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
              },
              required: ["name"],
              description: "A schema resource.",
              additionalProperties: true,
            },
            description: "The resulting schemas.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If not empty, indicates that there may be more schemas that match the request; this value should be passed in a new `ListSchemasRequest`.",
          },
        },
        description: "Response for the `ListSchemas` method.",
        additionalProperties: true,
      },
    },
  },
};

export default listSchemas;
