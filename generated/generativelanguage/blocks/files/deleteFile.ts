import { AppBlock, events } from "@slflows/sdk/v1";
import { getFileServiceClient } from "../../lib/grpcClient.ts";

const deleteFile: AppBlock = {
  name: "Delete File",
  description: `Deletes the 'File'.`,
  category: "Files",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the `File` to delete. Example: `files/abc-123`",
          type: {
            type: "string",
            description:
              "Required. The name of the `File` to delete. Example: `files/abc-123`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFileServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteFile(request, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteFile;
