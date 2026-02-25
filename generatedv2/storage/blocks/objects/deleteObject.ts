import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const deleteObject: AppBlock = {
  name: "Delete Object",
  description: `Deletes an object and its metadata. Deletions are permanent if versioning is not enabled for the bucket, or if the generation parameter is used, or if soft delete is not enabled for the bucket. When this API is used to delete an object from a bucket that has soft delete policy enabled, the object becomes soft deleted, and the 'softDeleteTime' and 'hardDeleteTime' properties are set on the object. This API cannot be used to permanently delete soft-deleted objects. Soft-deleted objects are permanently deleted according to their 'hardDeleteTime'. You can use the ['RestoreObject'][google.storage.v2.Storage.RestoreObject] API to restore soft-deleted objects until the soft delete retention period has passed. **IAM Permissions**: Requires 'storage.objects.delete' IAM permission on the bucket.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description:
            "Required. Name of the bucket in which the object resides.",
          type: {
            type: "string",
            description:
              "Required. Name of the bucket in which the object resides.",
          },
          required: true,
        },
        object: {
          name: "Object",
          description:
            "Required. The name of the finalized object to delete. Note: If you want to delete an unfinalized resumable upload please use `CancelResumableWrite`.",
          type: {
            type: "string",
            description:
              "Required. The name of the finalized object to delete. Note: If you want to delete an unfinalized resumable upload please use `CancelResumableWrite`.",
          },
          required: true,
        },
        generation: {
          name: "Generation",
          description:
            "Optional. If present, permanently deletes a specific revision of this object (as opposed to the latest version, the default).",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifGenerationMatch: {
          name: "If Generation Match",
          description:
            "Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifGenerationNotMatch: {
          name: "If Generation Not Match",
          description:
            "Makes the operation conditional on whether the object's live generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifMetagenerationMatch: {
          name: "If Metageneration Match",
          description:
            "Makes the operation conditional on whether the object's current metageneration matches the given value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifMetagenerationNotMatch: {
          name: "If Metageneration Not Match",
          description:
            "Makes the operation conditional on whether the object's current metageneration does not match the given value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        commonObjectRequestParams: {
          name: "Common Object Request Params",
          description:
            "Optional. A set of parameters common to Storage API requests concerning an object.",
          type: {
            type: "object",
            properties: {
              encryptionAlgorithm: {
                type: "string",
                description:
                  "Optional. Encryption algorithm used with the Customer-Supplied Encryption Keys feature.",
              },
              encryptionKeyBytes: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              encryptionKeySha256Bytes: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            description: "Parameters that can be passed to any object request.",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.bucket !== undefined)
          request.bucket = input.event.inputConfig.bucket;
        if (input.event.inputConfig.object !== undefined)
          request.object = input.event.inputConfig.object;
        if (input.event.inputConfig.generation !== undefined)
          request.generation = input.event.inputConfig.generation;
        if (input.event.inputConfig.ifGenerationMatch !== undefined)
          request.ifGenerationMatch = input.event.inputConfig.ifGenerationMatch;
        if (input.event.inputConfig.ifGenerationNotMatch !== undefined)
          request.ifGenerationNotMatch =
            input.event.inputConfig.ifGenerationNotMatch;
        if (input.event.inputConfig.ifMetagenerationMatch !== undefined)
          request.ifMetagenerationMatch =
            input.event.inputConfig.ifMetagenerationMatch;
        if (input.event.inputConfig.ifMetagenerationNotMatch !== undefined)
          request.ifMetagenerationNotMatch =
            input.event.inputConfig.ifMetagenerationNotMatch;
        if (input.event.inputConfig.commonObjectRequestParams !== undefined)
          request.commonObjectRequestParams =
            input.event.inputConfig.commonObjectRequestParams;

        const routingParams: Record<string, string> = {};
        if (request.bucket !== undefined)
          routingParams["bucket"] = String(request.bucket);
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteObject(request, metadata, (err: any, response: any) => {
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

export default deleteObject;
