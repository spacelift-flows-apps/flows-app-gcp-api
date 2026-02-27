import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

const deleteProject: AppBlock = {
  name: "Delete Project",
  description: `Marks the project identified by the specified 'name' (for example, 'projects/415104041262') for deletion. This method will only affect the project if it has a lifecycle state of [ACTIVE][google.cloud.resourcemanager.v3.Project.State.ACTIVE]. This method changes the Project's lifecycle state from [ACTIVE][google.cloud.resourcemanager.v3.Project.State.ACTIVE] to [DELETE_REQUESTED][google.cloud.resourcemanager.v3.Project.State.DELETE_REQUESTED]. The deletion starts at an unspecified time, at which point the Project is no longer accessible. Until the deletion completes, you can check the lifecycle state checked by retrieving the project with [GetProject] [google.cloud.resourcemanager.v3.Projects.GetProject], and the project remains visible to [ListProjects] [google.cloud.resourcemanager.v3.Projects.ListProjects]. However, you cannot update the project. After the deletion completes, the project is not retrievable by the [GetProject] [google.cloud.resourcemanager.v3.Projects.GetProject], [ListProjects] [google.cloud.resourcemanager.v3.Projects.ListProjects], and [SearchProjects][google.cloud.resourcemanager.v3.Projects.SearchProjects] methods. This method behaves idempotently, such that deleting a 'DELETE_REQUESTED' project will not cause an error, but also won't do anything. The caller must have 'resourcemanager.projects.delete' permissions for this project.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the Project (for example, `projects/415104041262`).",
          type: {
            type: "string",
            description:
              "Required. The name of the Project (for example, `projects/415104041262`).",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteProject(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
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
              typeUrl: {
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
                    typeUrl: {
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
              typeUrl: {
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

export default deleteProject;
