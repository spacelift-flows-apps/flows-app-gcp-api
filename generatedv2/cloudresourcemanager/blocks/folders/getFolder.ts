import { AppBlock, events } from "@slflows/sdk/v1";
import { getFoldersClient } from "../../lib/grpcClient.ts";

const getFolder: AppBlock = {
  name: "Get Folder",
  description: `Retrieves a folder identified by the supplied resource name. Valid folder resource names have the format 'folders/{folder_id}' (for example, 'folders/1234'). The caller must have 'resourcemanager.folders.get' permission on the identified folder.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the folder to retrieve. Must be of the form `folders/{folder_id}`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the folder to retrieve. Must be of the form `folders/{folder_id}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFoldersClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getFolder(request, (err: any, response: any) => {
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
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          update_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          delete_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
    },
  },
};

export default getFolder;
