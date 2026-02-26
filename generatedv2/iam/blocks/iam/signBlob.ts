import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getIAMClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const signBlob: AppBlock = {
  name: "Sign Blob",
  description: `Note:** This method is deprecated. Use the ['signBlob'](https://cloud.google.com/iam/help/rest-credentials/v1/projects.serviceAccounts/signBlob) method in the IAM Service Account Credentials API instead. If you currently use this method, see the [migration guide](https://cloud.google.com/iam/help/credentials/migrate-api) for instructions. Signs a blob using the system-managed private key for a [ServiceAccount][google.iam.admin.v1.ServiceAccount].`,
  category: "IAM",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}`. Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          type: {
            type: "string",
            description:
              "Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}`. Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          },
          required: true,
        },
        bytesToSign: {
          name: "Bytes To Sign",
          description:
            "Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The bytes to sign.",
          type: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.bytesToSign !== undefined)
          request.bytesToSign = input.event.inputConfig.bytesToSign;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.signBlob(protoRequest, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        await events.emit(result ? toCamelCase(result) : {});
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          keyId: {
            type: "string",
            description:
              "Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The id of the key used to sign the blob.",
          },
          signature: {
            type: "string",
            description: "Base64-encoded bytes",
          },
        },
        description:
          "Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The service account sign blob response.",
        additionalProperties: true,
      },
    },
  },
};

export default signBlob;
