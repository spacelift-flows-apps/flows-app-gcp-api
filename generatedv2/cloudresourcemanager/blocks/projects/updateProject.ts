import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient } from "../../lib/grpcClient.ts";

const updateProject: AppBlock = {
  name: "Update Project",
  description: `Updates the 'display_name' and labels of the project identified by the specified 'name' (for example, 'projects/415104041262'). Deleting all labels requires an update mask for labels field. The caller must have 'resourcemanager.projects.update' permission for this project.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        project: {
          name: "Project",
          description: "Required. The new definition of the project.",
          type: {
            type: "object",
            properties: {
              parent: {
                type: "string",
                description:
                  "Optional. A reference to a parent Resource. eg., `organizations/123` or `folders/876`.",
              },
              project_id: {
                type: "string",
                description:
                  "Immutable. The unique, user-assigned id of the project. It must be 6 to 30 lowercase ASCII letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited.  Example: `tokyo-rain-123`",
              },
              display_name: {
                type: "string",
                description:
                  "Optional. A user-assigned display name of the project. When present it must be between 4 to 30 characters. Allowed characters are: lowercase and uppercase letters, numbers, hyphen, single-quote, double-quote, space, and exclamation point.  Example: `My Project`",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Optional. The labels associated with this project.  Label keys must be between 1 and 63 characters long and must conform to the following regular expression: \\[a-z\\](\\[-a-z0-9\\]*\\[a-z0-9\\])?.  Label values must be between 0 and 63 characters long and must conform to the regular expression (\\[a-z\\](\\[-a-z0-9\\]*\\[a-z0-9\\])?)?.  No more than 64 labels can be associated with a given resource.  Clients should store labels in a representation such as JSON that does not depend on specific characters being disallowed.  Example: `"myBusinessDimension" : "businessValue"`',
              },
            },
            description:
              "A project is a high-level Google Cloud entity. It is a container for ACLs, APIs, App Engine Apps, VMs, and other Google Cloud Platform resources.",
            additionalProperties: true,
          },
          required: true,
        },
        update_mask: {
          name: "Update Mask",
          description: "Optional. An update mask to selectively update fields.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;
        if (input.event.inputConfig.update_mask !== undefined)
          request.update_mask = input.event.inputConfig.update_mask;

        const result = await new Promise<any>((resolve, reject) => {
          client.updateProject(request, (err: any, response: any) => {
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

export default updateProject;
