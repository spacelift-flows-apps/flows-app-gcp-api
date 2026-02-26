import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient } from "../../lib/grpcClient.ts";

const createProject: AppBlock = {
  name: "Create Project",
  description: `Request that a new project be created. The result is an 'Operation' which can be used to track the creation process. This process usually takes a few seconds, but can sometimes take much longer. The tracking 'Operation' is automatically deleted after a few hours, so there is no need to call 'DeleteOperation'.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        project: {
          name: "Project",
          description:
            "Required. The Project to create.  Project ID is required. If the requested ID is unavailable, the request fails.  If the `parent` field is set, the `resourcemanager.projects.create` permission is checked on the parent resource. If no parent is set and the authorization credentials belong to an Organization, the parent will be set to that Organization.",
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
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;

        const result = await new Promise<any>((resolve, reject) => {
          client.createProject(request, (err: any, response: any) => {
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

export default createProject;
