import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient } from "../../lib/grpcClient.ts";

const disableServiceAccountKey: AppBlock = {
  name: "Disable Service Account Key",
  description: `Disable a [ServiceAccountKey][google.iam.admin.v1.ServiceAccountKey]. A disabled service account key can be re-enabled with [EnableServiceAccountKey][google.iam.admin.v1.IAM.EnableServiceAccountKey].`,
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
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.disableServiceAccountKey(
            request,
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

        await events.emit(result || {});
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

export default disableServiceAccountKey;
