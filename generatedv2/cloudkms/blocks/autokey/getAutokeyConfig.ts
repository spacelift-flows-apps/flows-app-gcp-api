import { AppBlock, events } from "@slflows/sdk/v1";
import { getAutokeyAdminClient } from "../../lib/grpcClient.ts";

const getAutokeyConfig: AppBlock = {
  name: "Get Autokey Config",
  description: `Returns the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] for a folder or project.`,
  category: "Autokey",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Name of the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] resource, e.g. `folders/{FOLDER_NUMBER}/autokeyConfig` or `projects/{PROJECT_NUMBER}/autokeyConfig`.",
          type: {
            type: "string",
            description:
              "Required. Name of the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] resource, e.g. `folders/{FOLDER_NUMBER}/autokeyConfig` or `projects/{PROJECT_NUMBER}/autokeyConfig`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getAutokeyAdminClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getAutokeyConfig(request, (err: any, response: any) => {
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
              "Identifier. Name of the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] resource, e.g. `folders/{FOLDER_NUMBER}/autokeyConfig` or `projects/{PROJECT_NUMBER}/autokeyConfig`.",
          },
          key_project: {
            type: "string",
            description:
              "Optional. Name of the key project, e.g. `projects/{PROJECT_ID}` or `projects/{PROJECT_NUMBER}`, where Cloud KMS Autokey will provision a new [CryptoKey][google.cloud.kms.v1.CryptoKey] when a [KeyHandle][google.cloud.kms.v1.KeyHandle] is created. On [UpdateAutokeyConfig][google.cloud.kms.v1.AutokeyAdmin.UpdateAutokeyConfig], the caller will require `cloudkms.cryptoKeys.setIamPolicy` permission on this key project. Once configured, for Cloud KMS Autokey to function properly, this key project must have the Cloud KMS API activated and the Cloud KMS Service Agent for this key project must be granted the `cloudkms.admin` role (or pertinent permissions). A request with an empty key project field will clear the configuration.",
          },
          state: {
            type: "string",
            enum: [
              "STATE_UNSPECIFIED",
              "ACTIVE",
              "KEY_PROJECT_DELETED",
              "UNINITIALIZED",
              "KEY_PROJECT_PERMISSION_DENIED",
            ],
            description: "Output only. The state for the AutokeyConfig.",
          },
          etag: {
            type: "string",
            description:
              "Optional. A checksum computed by the server based on the value of other fields. This may be sent on update requests to ensure that the client has an up-to-date value before proceeding. The request will be rejected with an ABORTED error on a mismatched etag.",
          },
          key_project_resolution_mode: {
            type: "string",
            enum: [
              "KEY_PROJECT_RESOLUTION_MODE_UNSPECIFIED",
              "DEDICATED_KEY_PROJECT",
              "RESOURCE_PROJECT",
              "DISABLED",
            ],
            description:
              "Optional. KeyProjectResolutionMode for the AutokeyConfig. Valid values are `DEDICATED_KEY_PROJECT`, `RESOURCE_PROJECT`, or `DISABLED`.",
          },
        },
        description: "Cloud KMS Autokey configuration for a folder.",
        additionalProperties: true,
      },
    },
  },
};

export default getAutokeyConfig;
