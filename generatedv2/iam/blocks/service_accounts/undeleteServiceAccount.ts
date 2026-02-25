import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient } from "../../lib/grpcClient.ts";

const undeleteServiceAccount: AppBlock = {
  name: "Undelete Service Account",
  description: `Restores a deleted [ServiceAccount][google.iam.admin.v1.ServiceAccount]. **Important:** It is not always possible to restore a deleted service account. Use this method only as a last resort. After you delete a service account, IAM permanently removes the service account 30 days later. There is no way to restore a deleted service account that has been permanently removed.`,
  category: "Service Accounts",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT_UNIQUE_ID}`. Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account.",
          type: {
            type: "string",
            description:
              "The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT_UNIQUE_ID}`. Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.undeleteServiceAccount(request, (err: any, response: any) => {
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
          restoredAccount: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "The resource name of the service account.  Use one of the following formats:  * `projects/{PROJECT_ID}/serviceAccounts/{EMAIL_ADDRESS}` * `projects/{PROJECT_ID}/serviceAccounts/{UNIQUE_ID}`  As an alternative, you can use the `-` wildcard character instead of the project ID:  * `projects/-/serviceAccounts/{EMAIL_ADDRESS}` * `projects/-/serviceAccounts/{UNIQUE_ID}`  When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to get the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.",
              },
              projectId: {
                type: "string",
                description:
                  "Output only. The ID of the project that owns the service account.",
              },
              uniqueId: {
                type: "string",
                description:
                  "Output only. The unique, stable numeric ID for the service account.  Each service account retains its unique ID even if you delete the service account. For example, if you delete a service account, then create a new service account with the same name, the new service account has a different unique ID than the deleted service account.",
              },
              email: {
                type: "string",
                description:
                  "Output only. The email address of the service account.",
              },
              displayName: {
                type: "string",
                description:
                  "Optional. A user-specified, human-readable name for the service account. The maximum length is 100 UTF-8 bytes.",
              },
              etag: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              description: {
                type: "string",
                description:
                  "Optional. A user-specified, human-readable description of the service account. The maximum length is 256 UTF-8 bytes.",
              },
              oauth2ClientId: {
                type: "string",
                description:
                  "Output only. The OAuth 2.0 client ID for the service account.",
              },
              disabled: {
                type: "boolean",
                description:
                  "Output only. Whether the service account is disabled.",
              },
            },
            description:
              "An IAM service account.  A service account is an account for an application or a virtual machine (VM) instance, not a person. You can use a service account to call Google APIs. To learn more, read the [overview of service accounts](https://cloud.google.com/iam/help/service-accounts/overview).  When you create a service account, you specify the project ID that owns the service account, as well as a name that must be unique within the project. IAM uses these values to create an email address that identifies the service account.",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default undeleteServiceAccount;
