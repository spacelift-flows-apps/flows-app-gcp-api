import { AppBlock, events } from "@slflows/sdk/v1";
import { getFunctionServiceClient } from "../../lib/grpcClient.ts";

const generateDownloadUrl: AppBlock = {
  name: "Generate Download Url",
  description: `Returns a signed URL for downloading deployed function source code. The URL is only valid for a limited period and should be used within 30 minutes of generation. For more information about the signed URL usage see: https://cloud.google.com/storage/docs/access-control/signed-urls`,
  category: "Functions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of function for which source code Google Cloud Storage signed URL should be generated.",
          type: {
            type: "string",
            description:
              "Required. The name of function for which source code Google Cloud Storage signed URL should be generated.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFunctionServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.generateDownloadUrl(request, (err: any, response: any) => {
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
          download_url: {
            type: "string",
            description:
              "The generated Google Cloud Storage signed URL that should be used for function source code download.",
          },
        },
        description: "Response of `GenerateDownloadUrl` method.",
        additionalProperties: true,
      },
    },
  },
};

export default generateDownloadUrl;
