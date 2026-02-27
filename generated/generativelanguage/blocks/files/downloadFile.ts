import { AppBlock, events } from "@slflows/sdk/v1";
import { getFileServiceClient } from "../../lib/grpcClient.ts";

const downloadFile: AppBlock = {
  name: "Download File",
  description: `Download the 'File'.`,
  category: "Files",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the `File` to download. Example: `files/abc-123`",
          type: {
            type: "string",
            description:
              "Required. The name of the `File` to download. Example: `files/abc-123`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFileServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.downloadFile(request, (err: any, response: any) => {
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
        description: "Response for `DownloadFile`.",
        additionalProperties: true,
      },
    },
  },
};

export default downloadFile;
