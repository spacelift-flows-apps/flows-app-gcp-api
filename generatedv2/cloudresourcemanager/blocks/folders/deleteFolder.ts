import { AppBlock, events } from "@slflows/sdk/v1";
import { getFoldersClient } from "../../lib/grpcClient.ts";

const deleteFolder: AppBlock = {
  name: "Delete Folder",
  description: `Requests deletion of a folder. The folder is moved into the [DELETE_REQUESTED][google.cloud.resourcemanager.v3.Folder.State.DELETE_REQUESTED] state immediately, and is deleted approximately 30 days later. This method may only be called on an empty folder, where a folder is empty if it doesn't contain any folders or projects in the [ACTIVE][google.cloud.resourcemanager.v3.Folder.State.ACTIVE] state. If called on a folder in [DELETE_REQUESTED][google.cloud.resourcemanager.v3.Folder.State.DELETE_REQUESTED] state the operation will result in a no-op success. The caller must have 'resourcemanager.folders.delete' permission on the identified folder.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the folder to be deleted. Must be of the form `folders/{folder_id}`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the folder to be deleted. Must be of the form `folders/{folder_id}`.",
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
          client.deleteFolder(request, (err: any, response: any) => {
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

export default deleteFolder;
