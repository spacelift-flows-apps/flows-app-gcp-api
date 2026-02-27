import { AppBlock, events } from "@slflows/sdk/v1";
import { getCacheServiceClient } from "../../lib/grpcClient.ts";

const deleteCachedContent: AppBlock = {
  name: "Delete Cached Content",
  description: `Deletes CachedContent resource.`,
  category: "Cached Content",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name referring to the content cache entry Format: `cachedContents/{id}`",
          type: {
            type: "string",
            description:
              "Required. The resource name referring to the content cache entry Format: `cachedContents/{id}`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getCacheServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteCachedContent(request, (err: any, response: any) => {
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

export default deleteCachedContent;
