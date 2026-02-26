import { AppBlock, events } from "@slflows/sdk/v1";
import { getFoldersClient } from "../../lib/grpcClient.ts";

const moveFolder: AppBlock = {
  name: "Move Folder",
  description: `Moves a folder under a new resource parent. Returns an 'Operation' which can be used to track the progress of the folder move workflow. Upon success, the 'Operation.response' field will be populated with the moved folder. Upon failure, a 'FolderOperationError' categorizing the failure cause will be returned - if the failure occurs synchronously then the 'FolderOperationError' will be returned in the 'Status.details' field. If it occurs asynchronously, then the FolderOperation will be returned in the 'Operation.error' field. In addition, the 'Operation.metadata' field will be populated with a 'FolderOperation' message as an aid to stateless clients. Folder moves will be rejected if they violate either the naming, height, or fanout constraints described in the [CreateFolder][google.cloud.resourcemanager.v3.Folders.CreateFolder] documentation. The caller must have 'resourcemanager.folders.move' permission on the folder's current and proposed new parent.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the Folder to move. Must be of the form folders/{folder_id}",
          type: {
            type: "string",
            description:
              "Required. The resource name of the Folder to move. Must be of the form folders/{folder_id}",
          },
          required: true,
        },
        destination_parent: {
          name: "Destination Parent",
          description:
            "Required. The resource name of the folder or organization which should be the folder's new parent. Must be of the form `folders/{folder_id}` or `organizations/{org_id}`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the folder or organization which should be the folder's new parent. Must be of the form `folders/{folder_id}` or `organizations/{org_id}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFoldersClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.destination_parent !== undefined)
          request.destination_parent =
            input.event.inputConfig.destination_parent;

        const result = await new Promise<any>((resolve, reject) => {
          client.moveFolder(request, (err: any, response: any) => {
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

export default moveFolder;
