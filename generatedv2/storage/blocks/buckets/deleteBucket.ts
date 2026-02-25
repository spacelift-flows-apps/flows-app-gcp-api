import { AppBlock, events } from "@slflows/sdk/v1";
import { getStorageClient } from "../../lib/grpcClient.ts";

const deleteBucket: AppBlock = {
  name: "Buckets - Delete Bucket",
  description: `Permanently deletes an empty bucket. The request fails if there are any live or noncurrent objects in the bucket, but the request succeeds if the bucket only contains soft-deleted objects or incomplete uploads, such as ongoing XML API multipart uploads. Does not permanently delete soft-deleted objects. When this API is used to delete a bucket containing an object that has a soft delete policy enabled, the object becomes soft deleted, and the 'softDeleteTime' and 'hardDeleteTime' properties are set on the object. Objects and multipart uploads that were in the bucket at the time of deletion are also retained for the specified retention duration. When a soft-deleted bucket reaches the end of its retention duration, it is permanently deleted. The 'hardDeleteTime' of the bucket always equals or exceeds the expiration time of the last soft-deleted object in the bucket. **IAM Permissions**: Requires 'storage.buckets.delete' IAM permission on the bucket.`,
  category: "Buckets",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Required. Name of a bucket to delete.",
          type: {
            type: "string",
            description: "Required. Name of a bucket to delete.",
          },
          required: true,
        },
        ifMetagenerationMatch: {
          name: "If Metageneration Match",
          description:
            "If set, only deletes the bucket if its metageneration matches this value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifMetagenerationNotMatch: {
          name: "If Metageneration Not Match",
          description:
            "If set, only deletes the bucket if its metageneration does not match this value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.ifMetagenerationMatch !== undefined)
          request.ifMetagenerationMatch =
            input.event.inputConfig.ifMetagenerationMatch;
        if (input.event.inputConfig.ifMetagenerationNotMatch !== undefined)
          request.ifMetagenerationNotMatch =
            input.event.inputConfig.ifMetagenerationNotMatch;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteBucket(request, (err: any, response: any) => {
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

export default deleteBucket;
