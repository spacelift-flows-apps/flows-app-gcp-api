import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const getKeyRing: AppBlock = {
  name: "Get Key Ring",
  description: `Returns metadata for a given [KeyRing][google.cloud.kms.v1.KeyRing].`,
  category: "Key Rings",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.KeyRing.name] of the [KeyRing][google.cloud.kms.v1.KeyRing] to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.KeyRing.name] of the [KeyRing][google.cloud.kms.v1.KeyRing] to get.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getKeyRing(request, (err: any, response: any) => {
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
            description:
              "Output only. The resource name for the [KeyRing][google.cloud.kms.v1.KeyRing] in the format `projects/*/locations/*/keyRings/*`.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        description:
          "LINT: LEGACY_NAMES A [KeyRing][google.cloud.kms.v1.KeyRing] is a toplevel logical grouping of [CryptoKeys][google.cloud.kms.v1.CryptoKey].",
        additionalProperties: true,
      },
    },
  },
};

export default getKeyRing;
