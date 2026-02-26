import { AppBlock, events } from "@slflows/sdk/v1";
import { getAutokeyClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  kms_key: "kmsKey",
  resource_type_selector: "resourceTypeSelector",
};

const getKeyHandle: AppBlock = {
  name: "Get Key Handle",
  description: `Returns the [KeyHandle][google.cloud.kms.v1.KeyHandle].`,
  category: "Autokey",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Name of the [KeyHandle][google.cloud.kms.v1.KeyHandle] resource, e.g. `projects/{PROJECT_ID}/locations/{LOCATION}/keyHandles/{KEY_HANDLE_ID}`.",
          type: {
            type: "string",
            description:
              "Required. Name of the [KeyHandle][google.cloud.kms.v1.KeyHandle] resource, e.g. `projects/{PROJECT_ID}/locations/{LOCATION}/keyHandles/{KEY_HANDLE_ID}`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getAutokeyClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getKeyHandle(request, (err: any, response: any) => {
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
              "Identifier. Name of the [KeyHandle][google.cloud.kms.v1.KeyHandle] resource, e.g. `projects/{PROJECT_ID}/locations/{LOCATION}/keyHandles/{KEY_HANDLE_ID}`.",
          },
          kmsKey: {
            type: "string",
            description:
              "Output only. Name of a [CryptoKey][google.cloud.kms.v1.CryptoKey] that has been provisioned for Customer Managed Encryption Key (CMEK) use in the [KeyHandle][google.cloud.kms.v1.KeyHandle] project and location for the requested resource type. The [CryptoKey][google.cloud.kms.v1.CryptoKey] project will reflect the value configured in the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] on the resource project's ancestor folder at the time of the [KeyHandle][google.cloud.kms.v1.KeyHandle] creation. If more than one ancestor folder has a configured [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig], the nearest of these configurations is used.",
          },
          resourceTypeSelector: {
            type: "string",
            description:
              "Required. Indicates the resource type that the resulting [CryptoKey][google.cloud.kms.v1.CryptoKey] is meant to protect, e.g. `{SERVICE}.googleapis.com/{TYPE}`. See documentation for supported resource types.",
          },
        },
        required: ["resourceTypeSelector"],
        description:
          "Resource-oriented representation of a request to Cloud KMS Autokey and the resulting provisioning of a [CryptoKey][google.cloud.kms.v1.CryptoKey].",
        additionalProperties: true,
      },
    },
  },
};

export default getKeyHandle;
