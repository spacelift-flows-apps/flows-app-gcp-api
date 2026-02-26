import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  toSnakeCase,
  toCamelCase,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.uploadId !== undefined)
          request.uploadId = input.event.inputConfig.uploadId;

        const routingParams: Record<string, string> = {};
        if (request.uploadId !== undefined) {
          const m = String(request.uploadId).match(
            /^(projects\/[^/]+\/buckets\/[^/]+)/,
          );
          if (m) routingParams["bucket"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.cancelResumableWrite(
            protoRequest,
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

        await events.emit(result ? toCamelCase(result) : {});
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
