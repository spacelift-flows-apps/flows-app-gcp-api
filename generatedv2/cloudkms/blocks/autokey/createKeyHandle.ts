import { AppBlock, events } from "@slflows/sdk/v1";
import { getAutokeyClient } from "../../lib/grpcClient.ts";

const createKeyHandle: AppBlock = {
  name: "Create Key Handle",
  description: `Creates a new [KeyHandle][google.cloud.kms.v1.KeyHandle], triggering the provisioning of a new [CryptoKey][google.cloud.kms.v1.CryptoKey] for CMEK use with the given resource type in the configured key project and the same location. [GetOperation][google.longrunning.Operations.GetOperation] should be used to resolve the resulting long-running operation and get the resulting [KeyHandle][google.cloud.kms.v1.KeyHandle] and [CryptoKey][google.cloud.kms.v1.CryptoKey].`,
  category: "Autokey",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Name of the resource project and location to create the [KeyHandle][google.cloud.kms.v1.KeyHandle] in, e.g. `projects/{PROJECT_ID}/locations/{LOCATION}`.",
          type: {
            type: "string",
            description:
              "Required. Name of the resource project and location to create the [KeyHandle][google.cloud.kms.v1.KeyHandle] in, e.g. `projects/{PROJECT_ID}/locations/{LOCATION}`.",
          },
          required: true,
        },
        key_handle_id: {
          name: "Key Handle Id",
          description:
            "Optional. Id of the [KeyHandle][google.cloud.kms.v1.KeyHandle]. Must be unique to the resource project and location. If not provided by the caller, a new UUID is used.",
          type: {
            type: "string",
            description:
              "Optional. Id of the [KeyHandle][google.cloud.kms.v1.KeyHandle]. Must be unique to the resource project and location. If not provided by the caller, a new UUID is used.",
          },
          required: false,
        },
        key_handle: {
          name: "Key Handle",
          description:
            "Required. [KeyHandle][google.cloud.kms.v1.KeyHandle] to create.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. Name of the [KeyHandle][google.cloud.kms.v1.KeyHandle] resource, e.g. `projects/{PROJECT_ID}/locations/{LOCATION}/keyHandles/{KEY_HANDLE_ID}`.",
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
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getAutokeyClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.key_handle_id !== undefined)
          request.key_handle_id = input.event.inputConfig.key_handle_id;
        if (input.event.inputConfig.key_handle !== undefined)
          request.key_handle = input.event.inputConfig.key_handle;

        const result = await new Promise<any>((resolve, reject) => {
          client.createKeyHandle(request, (err: any, response: any) => {
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
          },
          metadata: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
          },
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type_url: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createKeyHandle;
