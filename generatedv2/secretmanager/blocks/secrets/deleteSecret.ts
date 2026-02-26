import { AppBlock, events } from "@slflows/sdk/v1";
import { getSecretManagerServiceClient } from "../../lib/grpcClient.ts";

const deleteSecret: AppBlock = {
  name: "Delete Secret",
  description: `Deletes a [Secret][google.cloud.secretmanager.v1.Secret].`,
  category: "Secrets",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret] to delete in the format `projects/*/secrets/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [Secret][google.cloud.secretmanager.v1.Secret] to delete in the format `projects/*/secrets/*`.",
          },
          required: true,
        },
        etag: {
          name: "Etag",
          description:
            "Optional. Etag of the [Secret][google.cloud.secretmanager.v1.Secret]. The request succeeds if it matches the etag of the currently stored secret object. If the etag is omitted, the request succeeds.",
          type: {
            type: "string",
            description:
              "Optional. Etag of the [Secret][google.cloud.secretmanager.v1.Secret]. The request succeeds if it matches the etag of the currently stored secret object. If the etag is omitted, the request succeeds.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSecretManagerServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteSecret(request, (err: any, response: any) => {
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

export default deleteSecret;
