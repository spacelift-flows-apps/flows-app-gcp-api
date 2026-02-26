import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getIAMClient,
  toSnakeCase,
  toCamelCase,
} from "../../lib/grpcClient.ts";

const deleteServiceAccount: AppBlock = {
  name: "Delete Service Account",
  description: `Deletes a [ServiceAccount][google.iam.admin.v1.ServiceAccount]. **Warning:** After you delete a service account, you might not be able to undelete it. If you know that you need to re-enable the service account in the future, use [DisableServiceAccount][google.iam.admin.v1.IAM.DisableServiceAccount] instead. If you delete a service account, IAM permanently removes the service account 30 days later. Google Cloud cannot recover the service account after it is permanently removed, even if you file a support request. To help avoid unplanned outages, we recommend that you disable the service account before you delete it. Use [DisableServiceAccount][google.iam.admin.v1.IAM.DisableServiceAccount] to disable the service account, then wait at least 24 hours and watch for unintended consequences. If there are no unintended consequences, you can delete the service account.`,
  category: "Service Accounts",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}`. Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the service account in the following format: `projects/{PROJECT_ID}/serviceAccounts/{ACCOUNT}`. Using `-` as a wildcard for the `PROJECT_ID` will infer the project from the account. The `ACCOUNT` value can be the `email` address or the `unique_id` of the service account.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteServiceAccount(
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteServiceAccount;
