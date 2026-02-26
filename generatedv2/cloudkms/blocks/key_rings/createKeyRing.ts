import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const createKeyRing: AppBlock = {
  name: "Create Key Ring",
  description: `Create a new [KeyRing][google.cloud.kms.v1.KeyRing] in a given Project and Location.`,
  category: "Key Rings",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the location associated with the [KeyRings][google.cloud.kms.v1.KeyRing], in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the location associated with the [KeyRings][google.cloud.kms.v1.KeyRing], in the format `projects/*/locations/*`.",
          },
          required: true,
        },
        key_ring_id: {
          name: "Key Ring Id",
          description:
            "Required. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`",
          type: {
            type: "string",
            description:
              "Required. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`",
          },
          required: true,
        },
        key_ring: {
          name: "Key Ring",
          description:
            "Required. A [KeyRing][google.cloud.kms.v1.KeyRing] with initial field values.",
          type: {
            type: "object",
            properties: {},
            description:
              "LINT: LEGACY_NAMES A [KeyRing][google.cloud.kms.v1.KeyRing] is a toplevel logical grouping of [CryptoKeys][google.cloud.kms.v1.CryptoKey].",
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.key_ring_id !== undefined)
          request.key_ring_id = input.event.inputConfig.key_ring_id;
        if (input.event.inputConfig.key_ring !== undefined)
          request.key_ring = input.event.inputConfig.key_ring;

        const result = await new Promise<any>((resolve, reject) => {
          client.createKeyRing(request, (err: any, response: any) => {
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

export default createKeyRing;
