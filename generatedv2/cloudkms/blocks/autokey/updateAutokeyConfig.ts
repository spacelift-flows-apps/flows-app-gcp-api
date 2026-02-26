import { AppBlock, events } from "@slflows/sdk/v1";
import { getAutokeyAdminClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  autokeyConfig: {
    name: "autokey_config",
    fields: {
      keyProject: "key_project",
      keyProjectResolutionMode: "key_project_resolution_mode",
    },
  },
  updateMask: "update_mask",
};

const outputMapping = {
  key_project: "keyProject",
  key_project_resolution_mode: "keyProjectResolutionMode",
};

const updateAutokeyConfig: AppBlock = {
  name: "Update Autokey Config",
  description: `Updates the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] for a folder or a project. The caller must have both 'cloudkms.autokeyConfigs.update' permission on the parent folder and 'cloudkms.cryptoKeys.setIamPolicy' permission on the provided key project. A [KeyHandle][google.cloud.kms.v1.KeyHandle] creation in the folder's descendant projects will use this configuration to determine where to create the resulting [CryptoKey][google.cloud.kms.v1.CryptoKey].`,
  category: "Autokey",
  inputs: {
    default: {
      config: {
        autokeyConfig: {
          name: "Autokey Config",
          description:
            "Required. [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] with values to update.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. Name of the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] resource, e.g. `folders/{FOLDER_NUMBER}/autokeyConfig` or `projects/{PROJECT_NUMBER}/autokeyConfig`.",
              },
              keyProject: {
                type: "string",
                description:
                  "Optional. Name of the key project, e.g. `projects/{PROJECT_ID}` or `projects/{PROJECT_NUMBER}`, where Cloud KMS Autokey will provision a new [CryptoKey][google.cloud.kms.v1.CryptoKey] when a [KeyHandle][google.cloud.kms.v1.KeyHandle] is created. On [UpdateAutokeyConfig][google.cloud.kms.v1.AutokeyAdmin.UpdateAutokeyConfig], the caller will require `cloudkms.cryptoKeys.setIamPolicy` permission on this key project. Once configured, for Cloud KMS Autokey to function properly, this key project must have the Cloud KMS API activated and the Cloud KMS Service Agent for this key project must be granted the `cloudkms.admin` role (or pertinent permissions). A request with an empty key project field will clear the configuration.",
              },
              etag: {
                type: "string",
                description:
                  "Optional. A checksum computed by the server based on the value of other fields. This may be sent on update requests to ensure that the client has an up-to-date value before proceeding. The request will be rejected with an ABORTED error on a mismatched etag.",
              },
              keyProjectResolutionMode: {
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
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "Required. Masks which fields of the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] to update, e.g. `keyProject`.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getAutokeyAdminClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.updateAutokeyConfig(request, (err: any, response: any) => {
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
              "Identifier. Name of the [AutokeyConfig][google.cloud.kms.v1.AutokeyConfig] resource, e.g. `folders/{FOLDER_NUMBER}/autokeyConfig` or `projects/{PROJECT_NUMBER}/autokeyConfig`.",
          },
          keyProject: {
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
          keyProjectResolutionMode: {
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

export default updateAutokeyConfig;
