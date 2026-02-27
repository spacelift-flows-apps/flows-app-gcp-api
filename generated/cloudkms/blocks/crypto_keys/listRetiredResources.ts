import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  retired_resources: {
    name: "retiredResources",
    fields: {
      original_resource: "originalResource",
      resource_type: "resourceType",
      delete_time: "deleteTime",
    },
  },
  next_page_token: "nextPageToken",
  total_size: "totalSize",
};

const listRetiredResources: AppBlock = {
  name: "List Retired Resources",
  description: `Lists the [RetiredResources][google.cloud.kms.v1.RetiredResource] which are the records of deleted [CryptoKeys][google.cloud.kms.v1.CryptoKey]. RetiredResources prevent the reuse of these resource names after deletion.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The project-specific location holding the [RetiredResources][google.cloud.kms.v1.RetiredResource], in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "Required. The project-specific location holding the [RetiredResources][google.cloud.kms.v1.RetiredResource], in the format `projects/*/locations/*`.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of [RetiredResources][google.cloud.kms.v1.RetiredResource] to be included in the response. Further [RetiredResources][google.cloud.kms.v1.RetiredResource] can subsequently be obtained by including the [ListRetiredResourcesResponse.next_page_token][google.cloud.kms.v1.ListRetiredResourcesResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. Optional limit on the number of [RetiredResources][google.cloud.kms.v1.RetiredResource] to be included in the response. Further [RetiredResources][google.cloud.kms.v1.RetiredResource] can subsequently be obtained by including the [ListRetiredResourcesResponse.next_page_token][google.cloud.kms.v1.ListRetiredResourcesResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via [ListRetiredResourcesResponse.next_page_token][google.cloud.kms.v1.ListRetiredResourcesResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional. Optional pagination token, returned earlier via [ListRetiredResourcesResponse.next_page_token][google.cloud.kms.v1.ListRetiredResourcesResponse.next_page_token].",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listRetiredResources(request, (err: any, response: any) => {
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
          retiredResources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. Identifier. The resource name for this [RetiredResource][google.cloud.kms.v1.RetiredResource] in the format `projects/*/locations/*/retiredResources/*`.",
                },
                originalResource: {
                  type: "string",
                  description:
                    "Output only. The full resource name of the original [CryptoKey][google.cloud.kms.v1.CryptoKey] that was deleted in the format `projects/*/locations/*/keyRings/*/cryptoKeys/*`.",
                },
                resourceType: {
                  type: "string",
                  description:
                    "Output only. The resource type of the original deleted resource.",
                },
                deleteTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
              },
              description:
                "A RetiredResource resource represents the record of a deleted [CryptoKey][google.cloud.kms.v1.CryptoKey]. Its purpose is to provide visibility into retained user data and to prevent reuse of these names for new [CryptoKeys][google.cloud.kms.v1.CryptoKey].",
              additionalProperties: true,
            },
            description:
              "The list of [RetiredResources][google.cloud.kms.v1.RetiredResource].",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token to retrieve the next page of results. Pass this value in [ListRetiredResourcesRequest.page_token][google.cloud.kms.v1.ListRetiredResourcesRequest.page_token] to retrieve the next page of results.",
          },
          totalSize: {
            type: "string",
            description: "64-bit integer as string",
          },
        },
        description:
          "Response message for [KeyManagementService.ListRetiredResources][google.cloud.kms.v1.KeyManagementService.ListRetiredResources].",
        additionalProperties: true,
      },
    },
  },
};

export default listRetiredResources;
