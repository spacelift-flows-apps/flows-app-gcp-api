import { AppBlock, events } from "@slflows/sdk/v1";
import { getSchemaServiceClient } from "../../lib/grpcClient.ts";

const listSchemaRevisions: AppBlock = {
  name: "List Schema Revisions",
  description: `Lists all schema revisions for the named schema.`,
  category: "Schemas",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the schema to list revisions for.",
          type: {
            type: "string",
            description:
              "Required. The name of the schema to list revisions for.",
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
          description: "The maximum number of revisions to return per page.",
          type: {
            type: "integer",
            description: "The maximum number of revisions to return per page.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "The page token, received from a previous ListSchemaRevisions call. Provide this to retrieve the subsequent page.",
          type: {
            type: "string",
            description:
              "The page token, received from a previous ListSchemaRevisions call. Provide this to retrieve the subsequent page.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSchemaServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.view !== undefined)
          request.view = input.event.inputConfig.view;
        if (input.event.inputConfig.pageSize !== undefined)
          request.pageSize = input.event.inputConfig.pageSize;
        if (input.event.inputConfig.pageToken !== undefined)
          request.pageToken = input.event.inputConfig.pageToken;

        const result = await new Promise<any>((resolve, reject) => {
          client.listSchemaRevisions(request, (err: any, response: any) => {
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
            description: "The revisions of the schema.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token that can be sent as `page_token` to retrieve the next page. If this field is empty, there are no subsequent pages.",
          },
        },
        description: "Response for the `ListSchemaRevisions` method.",
        additionalProperties: true,
      },
    },
  },
};

export default listSchemaRevisions;
