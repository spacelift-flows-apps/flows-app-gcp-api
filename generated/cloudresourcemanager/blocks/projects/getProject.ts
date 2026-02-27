import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  project_id: "projectId",
  display_name: "displayName",
  create_time: "createTime",
  update_time: "updateTime",
  delete_time: "deleteTime",
};

const getProject: AppBlock = {
  name: "Get Project",
  description: `Retrieves the project identified by the specified 'name' (for example, 'projects/415104041262'). The caller must have 'resourcemanager.projects.get' permission for this project.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the project (for example, `projects/415104041262`).",
          type: {
            type: "string",
            description:
              "Required. The name of the project (for example, `projects/415104041262`).",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getProject(request, (err: any, response: any) => {
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
            description:
              'Output only. The unique resource name of the project. It is an int64 generated number prefixed by "projects/".  Example: `projects/415104041262`',
          },
          parent: {
            type: "string",
            description:
              "Optional. A reference to a parent Resource. eg., `organizations/123` or `folders/876`.",
          },
          projectId: {
            type: "string",
            description:
              "Immutable. The unique, user-assigned id of the project. It must be 6 to 30 lowercase ASCII letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited.  Example: `tokyo-rain-123`",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
            description: "Output only. The project lifecycle state.",
          },
          displayName: {
            type: "string",
            description:
              "Optional. A user-assigned display name of the project. When present it must be between 4 to 30 characters. Allowed characters are: lowercase and uppercase letters, numbers, hyphen, single-quote, double-quote, space, and exclamation point.  Example: `My Project`",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          deleteTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          etag: {
            type: "string",
            description:
              "Output only. A checksum computed by the server based on the current value of the Project resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
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
    },
  },
};

export default getProject;
