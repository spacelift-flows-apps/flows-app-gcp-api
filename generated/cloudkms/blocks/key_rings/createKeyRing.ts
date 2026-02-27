import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  keyRingId: "key_ring_id",
  keyRing: "key_ring",
};

const outputMapping = {
  create_time: "createTime",
};

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
        keyRingId: {
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
        keyRing: {
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

        const request = convertKeys(input.event.inputConfig, inputMapping);

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

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
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
          createTime: {
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
