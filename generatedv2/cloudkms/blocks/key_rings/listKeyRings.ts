import { AppBlock, events } from "@slflows/sdk/v1";
import { getKeyManagementServiceClient } from "../../lib/grpcClient.ts";

const listKeyRings: AppBlock = {
  name: "List Key Rings",
  description: `Lists [KeyRings][google.cloud.kms.v1.KeyRing].`,
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
        page_size: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of [KeyRings][google.cloud.kms.v1.KeyRing] to include in the response. Further [KeyRings][google.cloud.kms.v1.KeyRing] can subsequently be obtained by including the [ListKeyRingsResponse.next_page_token][google.cloud.kms.v1.ListKeyRingsResponse.next_page_token] in a subsequent request.  If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. Optional limit on the number of [KeyRings][google.cloud.kms.v1.KeyRing] to include in the response. Further [KeyRings][google.cloud.kms.v1.KeyRing] can subsequently be obtained by including the [ListKeyRingsResponse.next_page_token][google.cloud.kms.v1.ListKeyRingsResponse.next_page_token] in a subsequent request.  If unspecified, the server will pick an appropriate default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via [ListKeyRingsResponse.next_page_token][google.cloud.kms.v1.ListKeyRingsResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional. Optional pagination token, returned earlier via [ListKeyRingsResponse.next_page_token][google.cloud.kms.v1.ListKeyRingsResponse.next_page_token].",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order.  For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order.  For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.order_by !== undefined)
          request.order_by = input.event.inputConfig.order_by;

        const result = await new Promise<any>((resolve, reject) => {
          client.listKeyRings(request, (err: any, response: any) => {
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
          key_rings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The resource name for the [KeyRing][google.cloud.kms.v1.KeyRing] in the format `projects/*/locations/*/keyRings/*`.",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
              },
              description:
                "LINT: LEGACY_NAMES A [KeyRing][google.cloud.kms.v1.KeyRing] is a toplevel logical grouping of [CryptoKeys][google.cloud.kms.v1.CryptoKey].",
              additionalProperties: true,
            },
            description: "The list of [KeyRings][google.cloud.kms.v1.KeyRing].",
          },
          next_page_token: {
            type: "string",
            description:
              "A token to retrieve next page of results. Pass this value in [ListKeyRingsRequest.page_token][google.cloud.kms.v1.ListKeyRingsRequest.page_token] to retrieve the next page of results.",
          },
          total_size: {
            type: "integer",
            description:
              "The total number of [KeyRings][google.cloud.kms.v1.KeyRing] that matched the query.  This field is not populated if [ListKeyRingsRequest.filter][google.cloud.kms.v1.ListKeyRingsRequest.filter] is applied.",
          },
        },
        description:
          "Response message for [KeyManagementService.ListKeyRings][google.cloud.kms.v1.KeyManagementService.ListKeyRings].",
        additionalProperties: true,
      },
    },
  },
};

export default listKeyRings;
