import { AppBlock, events } from "@slflows/sdk/v1";
import { getFoldersClient } from "../../lib/grpcClient.ts";

const updateFolder: AppBlock = {
  name: "Update Folder",
  description: `Updates a folder, changing its 'display_name'. Changes to the folder 'display_name' will be rejected if they violate either the 'display_name' formatting rules or the naming constraints described in the [CreateFolder][google.cloud.resourcemanager.v3.Folders.CreateFolder] documentation. The folder's 'display_name' must start and end with a letter or digit, may contain letters, digits, spaces, hyphens and underscores and can be between 3 and 30 characters. This is captured by the regular expression: '[\p{L}\p{N}][\p{L}\p{N}_- ]{1,28}[\p{L}\p{N}]'. The caller must have 'resourcemanager.folders.update' permission on the identified folder. If the update fails due to the unique name constraint then a 'PreconditionFailure' explaining this violation will be returned in the Status.details field.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        folder: {
          name: "Folder",
          description:
            "Required. The new definition of the Folder. It must include the `name` field, which cannot be changed.",
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
        update_mask: {
          name: "Update Mask",
          description:
            "Required. Fields to be updated. Only the `display_name` can be updated.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFoldersClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.folder !== undefined)
          request.folder = input.event.inputConfig.folder;
        if (input.event.inputConfig.update_mask !== undefined)
          request.update_mask = input.event.inputConfig.update_mask;

        const result = await new Promise<any>((resolve, reject) => {
          client.updateFolder(request, (err: any, response: any) => {
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

export default updateFolder;
