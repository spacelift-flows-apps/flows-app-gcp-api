import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient } from "../../lib/grpcClient.ts";

const listProjects: AppBlock = {
  name: "List Projects",
  description: `Lists projects that are direct children of the specified folder or organization resource. 'list()' provides a strongly consistent view of the projects underneath the specified parent resource. 'list()' returns projects sorted based upon the (ascending) lexical ordering of their 'display_name'. The caller must have 'resourcemanager.projects.list' permission on the identified parent.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the parent resource whose projects are being listed. Only children of this parent resource are listed; descendants are not listed.  If the parent is a folder, use the value `folders/{folder_id}`. If the parent is an organization, use the value `organizations/{org_id}`.",
          type: {
            type: "string",
            description:
              "Required. The name of the parent resource whose projects are being listed. Only children of this parent resource are listed; descendants are not listed.  If the parent is a folder, use the value `folders/{folder_id}`. If the parent is an organization, use the value `organizations/{org_id}`.",
          },
          required: true,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to [ListProjects] [google.cloud.resourcemanager.v3.Projects.ListProjects] that indicates from where listing should continue.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to [ListProjects] [google.cloud.resourcemanager.v3.Projects.ListProjects] that indicates from where listing should continue.",
          },
          required: false,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. The maximum number of projects to return in the response. The server can return fewer projects than requested. If unspecified, server picks an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of projects to return in the response. The server can return fewer projects than requested. If unspecified, server picks an appropriate default.",
          },
          required: false,
        },
        show_deleted: {
          name: "Show Deleted",
          description:
            "Optional. Indicate that projects in the `DELETE_REQUESTED` state should also be returned. Normally only `ACTIVE` projects are returned.",
          type: {
            type: "boolean",
            description:
              "Optional. Indicate that projects in the `DELETE_REQUESTED` state should also be returned. Normally only `ACTIVE` projects are returned.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.show_deleted !== undefined)
          request.show_deleted = input.event.inputConfig.show_deleted;

        const result = await new Promise<any>((resolve, reject) => {
          client.listProjects(request, (err: any, response: any) => {
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
          projects: {
            type: "array",
            items: {
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
                project_id: {
                  type: "string",
                  description:
                    "Immutable. The unique, user-assigned id of the project. It must be 6 to 30 lowercase ASCII letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited.  Example: `tokyo-rain-123`",
                },
                state: {
                  type: "string",
                  enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
                  description: "Output only. The project lifecycle state.",
                },
                display_name: {
                  type: "string",
                  description:
                    "Optional. A user-assigned display name of the project. When present it must be between 4 to 30 characters. Allowed characters are: lowercase and uppercase letters, numbers, hyphen, single-quote, double-quote, space, and exclamation point.  Example: `My Project`",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                update_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                delete_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            description:
              "The list of Projects under the parent. This list can be paginated.",
          },
          next_page_token: {
            type: "string",
            description:
              "Pagination token.  If the result set is too large to fit in a single response, this token is returned. It encodes the position of the current result cursor. Feeding this value into a new list request with the `page_token` parameter gives the next page of the results.  When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set.  Pagination tokens have a limited lifetime.",
          },
        },
        description:
          "A page of the response received from the [ListProjects][google.cloud.resourcemanager.v3.Projects.ListProjects] method.  A paginated response where more pages are available has `next_page_token` set. This token can be used in a subsequent request to retrieve the next request page.  NOTE: A response may contain fewer elements than the request `page_size` and still have a `next_page_token`.",
        additionalProperties: true,
      },
    },
  },
};

export default listProjects;
