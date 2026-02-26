import { AppBlock, events } from "@slflows/sdk/v1";
import { getFoldersClient } from "../../lib/grpcClient.ts";

const listFolders: AppBlock = {
  name: "List Folders",
  description: `Lists the folders that are direct descendants of supplied parent resource. 'list()' provides a strongly consistent view of the folders underneath the specified parent resource. 'list()' returns folders sorted based upon the (ascending) lexical ordering of their display_name. The caller must have 'resourcemanager.folders.list' permission on the identified parent.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the parent resource whose folders are being listed. Only children of this parent resource are listed; descendants are not listed.  If the parent is a folder, use the value `folders/{folder_id}`. If the parent is an organization, use the value `organizations/{org_id}`.  Access to this method is controlled by checking the `resourcemanager.folders.list` permission on the `parent`.",
          type: {
            type: "string",
            description:
              "Required. The name of the parent resource whose folders are being listed. Only children of this parent resource are listed; descendants are not listed.  If the parent is a folder, use the value `folders/{folder_id}`. If the parent is an organization, use the value `organizations/{org_id}`.  Access to this method is controlled by checking the `resourcemanager.folders.list` permission on the `parent`.",
          },
          required: true,
        },
        page_size: {
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
        page_token: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `ListFolders` that indicates where this listing should continue from.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to `ListFolders` that indicates where this listing should continue from.",
          },
          required: false,
        },
        show_deleted: {
          name: "Show Deleted",
          description:
            "Optional. Controls whether folders in the [DELETE_REQUESTED][google.cloud.resourcemanager.v3.Folder.State.DELETE_REQUESTED] state should be returned. Defaults to false.",
          type: {
            type: "boolean",
            description:
              "Optional. Controls whether folders in the [DELETE_REQUESTED][google.cloud.resourcemanager.v3.Folder.State.DELETE_REQUESTED] state should be returned. Defaults to false.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getFoldersClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.show_deleted !== undefined)
          request.show_deleted = input.event.inputConfig.show_deleted;

        const result = await new Promise<any>((resolve, reject) => {
          client.listFolders(request, (err: any, response: any) => {
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
                display_name: {
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
                    "Output only. A checksum computed by the server based on the current value of the folder resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
                },
              },
              required: ["parent"],
              description:
                "A folder in an organization's resource hierarchy, used to organize that organization's resources.",
              additionalProperties: true,
            },
            description:
              "A possibly paginated list of folders that are direct descendants of the specified parent resource.",
          },
          next_page_token: {
            type: "string",
            description:
              "A pagination token returned from a previous call to `ListFolders` that indicates from where listing should continue.",
          },
        },
        description: "The ListFolders response message.",
        additionalProperties: true,
      },
    },
  },
};

export default listFolders;
