import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  uploadId: "upload_id",
};

const cancelResumableWrite: AppBlock = {
  name: "Cancel Resumable Write",
  description: `Cancels an in-progress resumable upload. Any attempts to write to the resumable upload after cancelling the upload fail. The behavior for any in-progress write operations is not guaranteed; they could either complete before the cancellation or fail if the cancellation completes first.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        uploadId: {
          name: "Upload Id",
          description:
            "Required. The upload_id of the resumable upload to cancel. This should be copied from the `upload_id` field of `StartResumableWriteResponse`.",
          type: {
            type: "string",
            description:
              "Required. The upload_id of the resumable upload to cancel. This should be copied from the `upload_id` field of `StartResumableWriteResponse`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.upload_id !== undefined) {
          const m = String(request.upload_id).match(
            /^(projects\/[^/]+\/buckets\/[^/]+)/,
          );
          if (m) routingParams["bucket"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.cancelResumableWrite(
            request,
            metadata,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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
        description:
          "Empty response message for canceling an in-progress resumable upload, is extended as needed.",
        additionalProperties: true,
      },
    },
  },
};

export default cancelResumableWrite;
