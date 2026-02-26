import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient } from "../../lib/grpcClient.ts";

const moveProject: AppBlock = {
  name: "Move Project",
  description: `Move a project to another place in your resource hierarchy, under a new resource parent. Returns an operation which can be used to track the process of the project move workflow. Upon success, the 'Operation.response' field will be populated with the moved project. The caller must have 'resourcemanager.projects.move' permission on the project, on the project's current and proposed new parent. If project has no current parent, or it currently does not have an associated organization resource, you will also need the 'resourcemanager.projects.setIamPolicy' permission in the project.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Required. The name of the project to move.",
          type: {
            type: "string",
            description: "Required. The name of the project to move.",
          },
          required: true,
        },
        destination_parent: {
          name: "Destination Parent",
          description: "Required. The new parent to move the Project under.",
          type: {
            type: "string",
            description: "Required. The new parent to move the Project under.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.destination_parent !== undefined)
          request.destination_parent =
            input.event.inputConfig.destination_parent;

        const result = await new Promise<any>((resolve, reject) => {
          client.moveProject(request, (err: any, response: any) => {
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
          },
          metadata: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
          },
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type_url: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default moveProject;
