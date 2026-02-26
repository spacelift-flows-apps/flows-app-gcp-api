import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getIAMClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const listServiceAccountKeys: AppBlock = {
  name: "List Service Account Keys",
  description: `Lists every [ServiceAccountKey][google.iam.admin.v1.ServiceAccountKey] for a service account.`,
  category: "Service Account Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}`.  Using `-` as a wildcard for the `PROJECT_ID`, will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}`.  Using `-` as a wildcard for the `PROJECT_ID`, will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          },
          required: true,
        },
        keyTypes: {
          name: "Key Types",
          description:
            "Filters the types of keys the user wants to include in the list response. Duplicate key types are not allowed. If no key type is provided, all keys are returned.",
          type: {
            type: "array",
            items: {
              type: "string",
              enum: ["KEY_TYPE_UNSPECIFIED", "USER_MANAGED", "SYSTEM_MANAGED"],
            },
            description:
              "Filters the types of keys the user wants to include in the list response. Duplicate key types are not allowed. If no key type is provided, all keys are returned.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.keyTypes !== undefined)
          request.keyTypes = input.event.inputConfig.keyTypes;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.listServiceAccountKeys(
            protoRequest,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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
          keys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The resource name of the service account key in the following format `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}/keys/{key}`.",
                },
                privateKeyType: {
                  type: "string",
                  enum: [
                    "TYPE_UNSPECIFIED",
                    "TYPE_PKCS12_FILE",
                    "TYPE_GOOGLE_CREDENTIALS_FILE",
                  ],
                  description: "Supported private key output formats.",
                },
                keyAlgorithm: {
                  type: "string",
                  enum: [
                    "KEY_ALG_UNSPECIFIED",
                    "KEY_ALG_RSA_1024",
                    "KEY_ALG_RSA_2048",
                  ],
                  description: "Supported key algorithms.",
                },
                privateKeyData: {
                  type: "string",
                  description: "Base64-encoded bytes",
                },
                publicKeyData: {
                  type: "string",
                  description: "Base64-encoded bytes",
                },
                validAfterTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                validBeforeTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                keyOrigin: {
                  type: "string",
                  enum: [
                    "ORIGIN_UNSPECIFIED",
                    "USER_PROVIDED",
                    "GOOGLE_PROVIDED",
                  ],
                  description: "Service Account Key Origin.",
                },
                keyType: {
                  type: "string",
                  enum: [
                    "KEY_TYPE_UNSPECIFIED",
                    "USER_MANAGED",
                    "SYSTEM_MANAGED",
                  ],
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
            description: "The public keys for the service account.",
          },
        },
        description: "The service account keys list response.",
        additionalProperties: true,
      },
    },
  },
};

export default listServiceAccountKeys;
