import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient } from "../../lib/grpcClient.ts";

const getServiceAccountKey: AppBlock = {
  name: "Get Service Account Key",
  description: `Gets a [ServiceAccountKey][google.iam.admin.v1.ServiceAccountKey].`,
  category: "Service Account Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the service account key in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}/keys/{key}`.  Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the service account key in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}/keys/{key}`.  Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          },
          required: true,
        },
        public_key_type: {
          name: "Public Key Type",
          description:
            "Optional. The output format of the public key. The default is `TYPE_NONE`, which means that the public key is not returned.",
          type: {
            type: "string",
            enum: ["TYPE_NONE", "TYPE_X509_PEM_FILE", "TYPE_RAW_PUBLIC_KEY"],
            description: "Supported public key output formats.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.public_key_type !== undefined)
          request.public_key_type = input.event.inputConfig.public_key_type;

        const result = await new Promise<any>((resolve, reject) => {
          client.getServiceAccountKey(request, (err: any, response: any) => {
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
              "The resource name of the service account key in the following format `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}/keys/{key}`.",
          },
          private_key_type: {
            type: "string",
            enum: [
              "TYPE_UNSPECIFIED",
              "TYPE_PKCS12_FILE",
              "TYPE_GOOGLE_CREDENTIALS_FILE",
            ],
            description: "Supported private key output formats.",
          },
          key_algorithm: {
            type: "string",
            enum: [
              "KEY_ALG_UNSPECIFIED",
              "KEY_ALG_RSA_1024",
              "KEY_ALG_RSA_2048",
            ],
            description: "Supported key algorithms.",
          },
          private_key_data: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          public_key_data: {
            type: "string",
            description: "Base64-encoded bytes",
          },
          valid_after_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          valid_before_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          key_origin: {
            type: "string",
            enum: ["ORIGIN_UNSPECIFIED", "USER_PROVIDED", "GOOGLE_PROVIDED"],
            description: "Service Account Key Origin.",
          },
          key_type: {
            type: "string",
            enum: ["KEY_TYPE_UNSPECIFIED", "USER_MANAGED", "SYSTEM_MANAGED"],
            description: "The key type.",
          },
          disabled: {
            type: "boolean",
            description: "The key status.",
          },
        },
        description:
          "Represents a service account key.  A service account has two sets of key-pairs: user-managed, and system-managed.  User-managed key-pairs can be created and deleted by users.  Users are responsible for rotating these keys periodically to ensure security of their service accounts.  Users retain the private key of these key-pairs, and Google retains ONLY the public key.  System-managed keys are automatically rotated by Google, and are used for signing for a maximum of two weeks. The rotation process is probabilistic, and usage of the new key will gradually ramp up and down over the key's lifetime.  If you cache the public key set for a service account, we recommend that you update the cache every 15 minutes. User-managed keys can be added and removed at any time, so it is important to update the cache frequently. For Google-managed keys, Google will publish a key at least 6 hours before it is first used for signing and will keep publishing it for at least 6 hours after it was last used for signing.  Public keys for all service accounts are also published at the OAuth2 Service Account API.",
        additionalProperties: true,
      },
    },
  },
};

export default getServiceAccountKey;
