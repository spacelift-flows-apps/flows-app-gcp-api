import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient } from "../../lib/grpcClient.ts";

const undeleteProject: AppBlock = {
  name: "Undelete Project",
  description: `Restores the project identified by the specified 'name' (for example, 'projects/415104041262'). You can only use this method for a project that has a lifecycle state of [DELETE_REQUESTED] [Projects.State.DELETE_REQUESTED]. After deletion starts, the project cannot be restored. The caller must have 'resourcemanager.projects.undelete' permission for this project.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the project (for example, `projects/415104041262`).  Required.",
          type: {
            type: "string",
            description:
              "Required. The name of the project (for example, `projects/415104041262`).  Required.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.undeleteProject(request, (err: any, response: any) => {
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

export default undeleteProject;
