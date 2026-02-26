import { AppBlock, events } from "@slflows/sdk/v1";
import { getFoldersClient } from "../../lib/grpcClient.ts";

const createFolder: AppBlock = {
  name: "Create Folder",
  description: `Creates a folder in the resource hierarchy. Returns an 'Operation' which can be used to track the progress of the folder creation workflow. Upon success, the 'Operation.response' field will be populated with the created Folder. In order to succeed, the addition of this new folder must not violate the folder naming, height, or fanout constraints. + The folder's 'display_name' must be distinct from all other folders that share its parent. + The addition of the folder must not cause the active folder hierarchy to exceed a height of 10. Note, the full active + deleted folder hierarchy is allowed to reach a height of 20; this provides additional headroom when moving folders that contain deleted folders. + The addition of the folder must not cause the total number of folders under its parent to exceed 300. If the operation fails due to a folder constraint violation, some errors may be returned by the 'CreateFolder' request, with status code 'FAILED_PRECONDITION' and an error description. Other folder constraint violations will be communicated in the 'Operation', with the specific 'PreconditionFailure' returned in the details list in the 'Operation.error' field. The caller must have 'resourcemanager.folders.create' permission on the identified parent.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        folder: {
          name: "Folder",
          description:
            "Required. The folder being created, only the display name and parent will be consulted. All other fields will be ignored.",
          type: {
            type: "object",
            properties: {
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
            },
            required: ["parent"],
            description:
              "A folder in an organization's resource hierarchy, used to organize that organization's resources.",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFoldersClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.folder !== undefined)
          request.folder = input.event.inputConfig.folder;

        const result = await new Promise<any>((resolve, reject) => {
          client.createFolder(request, (err: any, response: any) => {
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

export default createFolder;
