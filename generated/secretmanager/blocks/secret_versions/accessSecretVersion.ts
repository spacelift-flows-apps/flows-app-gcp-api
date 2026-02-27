import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSecretManagerServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  payload: {
    name: "payload",
    fields: {
      data_crc32c: "dataCrc32c",
    },
  },
};

const accessSecretVersion: AppBlock = {
  name: "Access Secret Version",
  description: `Accesses a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion]. This call returns the secret data. 'projects/*/secrets/*/versions/latest' is an alias to the most recently created [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].`,
  category: "Secret Versions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] in the format `projects/*/secrets/*/versions/*` or `projects/*/locations/*/secrets/*/versions/*`.  `projects/*/secrets/*/versions/latest` or `projects/*/locations/*/secrets/*/versions/latest` is an alias to the most recently created [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
          type: {
            type: "string",
            description:
              "Required. The resource name of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] in the format `projects/*/secrets/*/versions/*` or `projects/*/locations/*/secrets/*/versions/*`.  `projects/*/secrets/*/versions/latest` or `projects/*/locations/*/secrets/*/versions/latest` is an alias to the most recently created [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSecretManagerServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.accessSecretVersion(request, (err: any, response: any) => {
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
              "The resource name of the [SecretVersion][google.cloud.secretmanager.v1.SecretVersion] in the format `projects/*/secrets/*/versions/*` or `projects/*/locations/*/secrets/*/versions/*`.",
          },
          payload: {
            type: "object",
            properties: {
              data: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              dataCrc32c: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            description:
              "A secret payload resource in the Secret Manager API. This contains the sensitive secret payload that is associated with a [SecretVersion][google.cloud.secretmanager.v1.SecretVersion].",
            additionalProperties: true,
          },
        },
        description:
          "Response message for [SecretManagerService.AccessSecretVersion][google.cloud.secretmanager.v1.SecretManagerService.AccessSecretVersion].",
        additionalProperties: true,
      },
    },
  },
};

export default accessSecretVersion;
