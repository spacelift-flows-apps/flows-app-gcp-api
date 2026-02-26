import { AppBlock, events } from "@slflows/sdk/v1";
import { getProjectsClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageToken: "page_token",
  pageSize: "page_size",
};

const outputMapping = {
  projects: {
    name: "projects",
    fields: {
      project_id: "projectId",
      display_name: "displayName",
      create_time: "createTime",
      update_time: "updateTime",
      delete_time: "deleteTime",
    },
  },
  next_page_token: "nextPageToken",
};

const searchProjects: AppBlock = {
  name: "Search Projects",
  description: `Search for projects that the caller has both 'resourcemanager.projects.get' permission on, and also satisfy the specified query. This method returns projects in an unspecified order. This method is eventually consistent with project mutations; this means that a newly created project may not appear in the results or recent updates to an existing project may not be reflected in the results. To retrieve the latest state of a project, use the [GetProject][google.cloud.resourcemanager.v3.Projects.GetProject] method.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        query: {
          name: "Query",
          description:
            "Optional. A query string for searching for projects that the caller has `resourcemanager.projects.get` permission to. If multiple fields are included in the query, then it will return results that match any of the fields. Some eligible fields are:  - **`displayName`, `name`**: Filters by displayName. - **`parent`**: Project's parent (for example: `folders/123`, `organizations/*`). Prefer `parent` field over `parent.type` and `parent.id`. - **`parent.type`**: Parent's type: `folder` or `organization`. - **`parent.id`**: Parent's id number (for example: `123`). - **`id`, `projectId`**: Filters by projectId. - **`state`, `lifecycleState`**: Filters by state. - **`labels`**: Filters by label name or value. - **`labels.<key>` (where `<key>` is the name of a label)**: Filters by label name.  Search expressions are case insensitive.  Some examples queries:   - **`name:how*`**: The project's name starts with \"how\". - **`name:Howl`**: The project's name is `Howl` or `howl`. - **`name:HOWL`**: Equivalent to above. - **`NAME:howl`**: Equivalent to above. - **`labels.color:*`**: The project has the label `color`. - **`labels.color:red`**:  The project's label `color` has the value `red`. - **`labels.color:red labels.size:big`**: The project's label `color` has the value `red` or its label `size` has the value `big`.  If no query is specified, the call will return projects for which the user has the `resourcemanager.projects.get` permission.",
          type: {
            type: "string",
            description:
              "Optional. A query string for searching for projects that the caller has `resourcemanager.projects.get` permission to. If multiple fields are included in the query, then it will return results that match any of the fields. Some eligible fields are:  - **`displayName`, `name`**: Filters by displayName. - **`parent`**: Project's parent (for example: `folders/123`, `organizations/*`). Prefer `parent` field over `parent.type` and `parent.id`. - **`parent.type`**: Parent's type: `folder` or `organization`. - **`parent.id`**: Parent's id number (for example: `123`). - **`id`, `projectId`**: Filters by projectId. - **`state`, `lifecycleState`**: Filters by state. - **`labels`**: Filters by label name or value. - **`labels.<key>` (where `<key>` is the name of a label)**: Filters by label name.  Search expressions are case insensitive.  Some examples queries:   - **`name:how*`**: The project's name starts with \"how\". - **`name:Howl`**: The project's name is `Howl` or `howl`. - **`name:HOWL`**: Equivalent to above. - **`NAME:howl`**: Equivalent to above. - **`labels.color:*`**: The project has the label `color`. - **`labels.color:red`**:  The project's label `color` has the value `red`. - **`labels.color:red labels.size:big`**: The project's label `color` has the value `red` or its label `size` has the value `big`.  If no query is specified, the call will return projects for which the user has the `resourcemanager.projects.get` permission.",
          },
          required: false,
        },
        pageToken: {
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
        pageSize: {
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
      },
      onEvent: async (input) => {
        const client = await getProjectsClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.searchProjects(request, (err: any, response: any) => {
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                deleteTime: {
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
              "The list of Projects that matched the list filter query. This list can be paginated.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Pagination token.  If the result set is too large to fit in a single response, this token is returned. It encodes the position of the current result cursor. Feeding this value into a new list request with the `page_token` parameter gives the next page of the results.  When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set.  Pagination tokens have a limited lifetime.",
          },
        },
        description:
          "A page of the response received from the [SearchProjects][google.cloud.resourcemanager.v3.Projects.SearchProjects] method.  A paginated response where more pages are available has `next_page_token` set. This token can be used in a subsequent request to retrieve the next request page.",
        additionalProperties: true,
      },
    },
  },
};

export default searchProjects;
