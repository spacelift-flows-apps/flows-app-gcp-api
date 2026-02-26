import { AppBlock, events } from "@slflows/sdk/v1";
import { getAutokeyClient } from "../../lib/grpcClient.ts";

const listKeyHandles: AppBlock = {
  name: "List Key Handles",
  description: `Lists [KeyHandles][google.cloud.kms.v1.KeyHandle].`,
  category: "Autokey",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Name of the resource project and location from which to list [KeyHandles][google.cloud.kms.v1.KeyHandle], e.g. `projects/{PROJECT_ID}/locations/{LOCATION}`.",
          type: {
            type: "string",
            description:
              "Required. Name of the resource project and location from which to list [KeyHandles][google.cloud.kms.v1.KeyHandle], e.g. `projects/{PROJECT_ID}/locations/{LOCATION}`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of [KeyHandles][google.cloud.kms.v1.KeyHandle] to include in the response. The service may return fewer than this value. Further [KeyHandles][google.cloud.kms.v1.KeyHandle] can subsequently be obtained by including the [ListKeyHandlesResponse.next_page_token][google.cloud.kms.v1.ListKeyHandlesResponse.next_page_token] in a subsequent request.  If unspecified, at most 100 [KeyHandles][google.cloud.kms.v1.KeyHandle] will be returned.",
          type: {
            type: "integer",
            description:
              "Optional. Optional limit on the number of [KeyHandles][google.cloud.kms.v1.KeyHandle] to include in the response. The service may return fewer than this value. Further [KeyHandles][google.cloud.kms.v1.KeyHandle] can subsequently be obtained by including the [ListKeyHandlesResponse.next_page_token][google.cloud.kms.v1.ListKeyHandlesResponse.next_page_token] in a subsequent request.  If unspecified, at most 100 [KeyHandles][google.cloud.kms.v1.KeyHandle] will be returned.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via [ListKeyHandlesResponse.next_page_token][google.cloud.kms.v1.ListKeyHandlesResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional. Optional pagination token, returned earlier via [ListKeyHandlesResponse.next_page_token][google.cloud.kms.v1.ListKeyHandlesResponse.next_page_token].",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'Optional. Filter to apply when listing [KeyHandles][google.cloud.kms.v1.KeyHandle], e.g. `resource_type_selector="{SERVICE}.googleapis.com/{TYPE}"`.',
          type: {
            type: "string",
            description:
              'Optional. Filter to apply when listing [KeyHandles][google.cloud.kms.v1.KeyHandle], e.g. `resource_type_selector="{SERVICE}.googleapis.com/{TYPE}"`.',
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getAutokeyClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;

        const result = await new Promise<any>((resolve, reject) => {
          client.listKeyHandles(request, (err: any, response: any) => {
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
          key_handles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Identifier. Name of the [KeyHandle][google.cloud.kms.v1.KeyHandle] resource, e.g. `projects/{PROJECT_ID}/locations/{LOCATION}/keyHandles/{KEY_HANDLE_ID}`.",
                },
                kms_key: {
                  type: "string",
                  description:
                    "Output only. Name of a [CryptoKey][google.cloud.kms.v1.CryptoKey] that has been provisioned for Customer Managed Encryption Key (CMEK) use in the [KeyHandle][google.cloud.kms.v1.KeyHandle] project and location for the requested resource type. The [CryptoKey][google.cloud.kms.v1.CryptoKey] project will reflect the value configured in the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] on the resource project's ancestor folder at the time of the [KeyHandle][google.cloud.kms.v1.KeyHandle] creation. If more than one ancestor folder has a configured [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig], the nearest of these configurations is used.",
                },
                resource_type_selector: {
                  type: "string",
                  description:
                    "Required. Indicates the resource type that the resulting [CryptoKey][google.cloud.kms.v1.CryptoKey] is meant to protect, e.g. `{SERVICE}.googleapis.com/{TYPE}`. See documentation for supported resource types.",
                },
              },
              required: ["resource_type_selector"],
              description:
                "Resource-oriented representation of a request to Cloud KMS Autokey and the resulting provisioning of a [CryptoKey][google.cloud.kms.v1.CryptoKey].",
              additionalProperties: true,
            },
            description:
              "Resulting [KeyHandles][google.cloud.kms.v1.KeyHandle].",
          },
          next_page_token: {
            type: "string",
            description:
              "A token to retrieve next page of results. Pass this value in [ListKeyHandlesRequest.page_token][google.cloud.kms.v1.ListKeyHandlesRequest.page_token] to retrieve the next page of results.",
          },
        },
        description:
          "Response message for [Autokey.ListKeyHandles][google.cloud.kms.v1.Autokey.ListKeyHandles].",
        additionalProperties: true,
      },
    },
  },
};

export default listKeyHandles;
