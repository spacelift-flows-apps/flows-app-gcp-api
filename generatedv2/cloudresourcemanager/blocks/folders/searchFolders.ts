import { AppBlock, events } from "@slflows/sdk/v1";
import { getFoldersClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  folders: {
    name: "folders",
    fields: {
      display_name: "displayName",
      create_time: "createTime",
      update_time: "updateTime",
      delete_time: "deleteTime",
    },
  },
  next_page_token: "nextPageToken",
};

const searchFolders: AppBlock = {
  name: "Search Folders",
  description: `Search for folders that match specific filter criteria. 'search()' provides an eventually consistent view of the folders a user has access to which meet the specified filter criteria. This will only return folders on which the caller has the permission 'resourcemanager.folders.get'.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of folders to return in the response. The server can return fewer folders than requested. If unspecified, server picks an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of folders to return in the response. The server can return fewer folders than requested. If unspecified, server picks an appropriate default.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `SearchFolders` that indicates from where search should continue.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to `SearchFolders` that indicates from where search should continue.",
          },
          required: false,
        },
        query: {
          name: "Query",
          description:
            'Optional. Search criteria used to select the folders to return. If no search criteria is specified then all accessible folders will be returned.  Query expressions can be used to restrict results based upon displayName, state and parent, where the operators `=` (`:`) `NOT`, `AND` and `OR` can be used along with the suffix wildcard symbol `*`.  The `displayName` field in a query expression should use escaped quotes for values that include whitespace to prevent unexpected behavior.  ``` | Field                   | Description                            | |-------------------------|----------------------------------------| | displayName             | Filters by displayName.                | | parent                  | Filters by parent (for example: folders/123). | | state, lifecycleState   | Filters by state.                      | ```  Some example queries are:  * Query `displayName=Test*` returns Folder resources whose display name starts with "Test". * Query `state=ACTIVE` returns Folder resources with `state` set to `ACTIVE`. * Query `parent=folders/123` returns Folder resources that have `folders/123` as a parent resource. * Query `parent=folders/123 AND state=ACTIVE` returns active Folder resources that have `folders/123` as a parent resource. * Query `displayName=\\\\"Test String\\\\"` returns Folder resources with display names that include both "Test" and "String".',
          type: {
            type: "string",
            description:
              'Optional. Search criteria used to select the folders to return. If no search criteria is specified then all accessible folders will be returned.  Query expressions can be used to restrict results based upon displayName, state and parent, where the operators `=` (`:`) `NOT`, `AND` and `OR` can be used along with the suffix wildcard symbol `*`.  The `displayName` field in a query expression should use escaped quotes for values that include whitespace to prevent unexpected behavior.  ``` | Field                   | Description                            | |-------------------------|----------------------------------------| | displayName             | Filters by displayName.                | | parent                  | Filters by parent (for example: folders/123). | | state, lifecycleState   | Filters by state.                      | ```  Some example queries are:  * Query `displayName=Test*` returns Folder resources whose display name starts with "Test". * Query `state=ACTIVE` returns Folder resources with `state` set to `ACTIVE`. * Query `parent=folders/123` returns Folder resources that have `folders/123` as a parent resource. * Query `parent=folders/123 AND state=ACTIVE` returns active Folder resources that have `folders/123` as a parent resource. * Query `displayName=\\\\"Test String\\\\"` returns Folder resources with display names that include both "Test" and "String".',
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getFoldersClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.searchFolders(request, (err: any, response: any) => {
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
          folders: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    'Output only. The resource name of the folder. Its format is `folders/{folder_id}`, for example: "folders/1234".',
                },
                parent: {
                  type: "string",
                  description:
                    "Required. The folder's parent's resource name. Updates to the folder's parent must be performed using [MoveFolder][google.cloud.resourcemanager.v3.Folders.MoveFolder].",
                },
                displayName: {
                  type: "string",
                  description:
                    "The folder's display name. A folder's display name must be unique amongst its siblings. For example, no two folders with the same parent can share the same display name. The display name must start and end with a letter or digit, may contain letters, digits, spaces, hyphens and underscores and can be no longer than 30 characters. This is captured by the regular expression: `[\\p{L}\\p{N}]([\\p{L}\\p{N}_- ]{0,28}[\\p{L}\\p{N}])?`.",
                },
                state: {
                  type: "string",
                  enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
                  description:
                    "Output only. The lifecycle state of the folder. Updates to the state must be performed using [DeleteFolder][google.cloud.resourcemanager.v3.Folders.DeleteFolder] and [UndeleteFolder][google.cloud.resourcemanager.v3.Folders.UndeleteFolder].",
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
                    "Output only. A checksum computed by the server based on the current value of the folder resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
                },
              },
              required: ["parent"],
              description:
                "A folder in an organization's resource hierarchy, used to organize that organization's resources.",
              additionalProperties: true,
            },
            description:
              "A possibly paginated folder search results. the specified parent resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A pagination token returned from a previous call to `SearchFolders` that indicates from where searching should continue.",
          },
        },
        description: "The response message for searching folders.",
        additionalProperties: true,
      },
    },
  },
};

export default searchFolders;
