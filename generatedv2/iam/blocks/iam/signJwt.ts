import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient } from "../../lib/grpcClient.ts";

const signJwt: AppBlock = {
  name: "Sign JWT",
  description: `Note:** This method is deprecated. Use the ['signJwt'](https://cloud.google.com/iam/help/rest-credentials/v1/projects.serviceAccounts/signJwt) method in the IAM Service Account Credentials API instead. If you currently use this method, see the [migration guide](https://cloud.google.com/iam/help/credentials/migrate-api) for instructions. Signs a JSON Web Token (JWT) using the system-managed private key for a [ServiceAccount][google.iam.admin.v1.ServiceAccount].`,
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
        payload: {
          name: "Payload",
          description:
            'Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The JWT payload to sign. Must be a serialized JSON object that contains a JWT Claims Set. For example: `{"sub": "user@example.com", "iat": 313435}`  If the JWT Claims Set contains an expiration time (`exp`) claim, it must be an integer timestamp that is not in the past and no more than 12 hours in the future.  If the JWT Claims Set does not contain an expiration time (`exp`) claim, this claim is added automatically, with a timestamp that is 1 hour in the future.',
          type: {
            type: "string",
            description:
              'Required. Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The JWT payload to sign. Must be a serialized JSON object that contains a JWT Claims Set. For example: `{"sub": "user@example.com", "iat": 313435}`  If the JWT Claims Set contains an expiration time (`exp`) claim, it must be an integer timestamp that is not in the past and no more than 12 hours in the future.  If the JWT Claims Set does not contain an expiration time (`exp`) claim, this claim is added automatically, with a timestamp that is 1 hour in the future.',
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.payload !== undefined)
          request.payload = input.event.inputConfig.payload;

        const result = await new Promise<any>((resolve, reject) => {
          client.signJwt(request, (err: any, response: any) => {
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
          keyId: {
            type: "string",
            description:
              "Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The id of the key used to sign the JWT.",
          },
          signedJwt: {
            type: "string",
            description:
              "Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The signed JWT.",
          },
        },
        description:
          "Deprecated. [Migrate to Service Account Credentials API](https://cloud.google.com/iam/help/credentials/migrate-api).  The service account sign JWT response.",
        additionalProperties: true,
      },
    },
  },
};

export default signJwt;
