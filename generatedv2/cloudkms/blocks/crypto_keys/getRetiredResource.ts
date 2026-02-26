import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const getRetiredResource: AppBlock = {
  name: "Get Retired Resource",
  description: `Retrieves a specific [RetiredResource][google.cloud.kms.v1.RetiredResource] resource, which represents the record of a deleted [CryptoKey][google.cloud.kms.v1.CryptoKey].`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.RetiredResource.name] of the [RetiredResource][google.cloud.kms.v1.RetiredResource] to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.RetiredResource.name] of the [RetiredResource][google.cloud.kms.v1.RetiredResource] to get.",
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
          client.getRetiredResource(request, (err: any, response: any) => {
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
              "Output only. Identifier. The resource name for this [RetiredResource][google.cloud.kms.v1.RetiredResource] in the format `projects/*/locations/*/retiredResources/*`.",
          },
          original_resource: {
            type: "string",
            description:
              "Output only. The full resource name of the original [CryptoKey][google.cloud.kms.v1.CryptoKey] that was deleted in the format `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
          },
          resource_type: {
            type: "string",
            description:
              "Output only. The resource type of the original deleted resource.",
          },
          delete_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
        },
        description:
          "A RetiredResource resource represents the record of a deleted [CryptoKey][google.cloud.kms.v1.CryptoKey]. Its purpose is to provide visibility into retained user data and to prevent reuse of these names for new [CryptoKeys][google.cloud.kms.v1.CryptoKey].",
        additionalProperties: true,
      },
    },
  },
};

export default getRetiredResource;
