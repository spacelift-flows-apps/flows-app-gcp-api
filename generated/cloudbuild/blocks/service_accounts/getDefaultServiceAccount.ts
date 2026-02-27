import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  service_account_email: "serviceAccountEmail",
};

const getDefaultServiceAccount: AppBlock = {
  name: "Get Default Service Account",
  description: `Returns the 'DefaultServiceAccount' used by the project.`,
  category: "Service Accounts",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the `DefaultServiceAccount` to retrieve. Format: `projects/{project}/locations/{location}/defaultServiceAccount`",
          type: {
            type: "string",
            description:
              "Required. The name of the `DefaultServiceAccount` to retrieve. Format: `projects/{project}/locations/{location}/defaultServiceAccount`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getCloudBuildClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.getDefaultServiceAccount(
            request,
            metadata,
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
              "Identifier. Format: `projects/{project}/locations/{location}/defaultServiceAccount`",
          },
          serviceAccountEmail: {
            type: "string",
            description:
              "Output only. The email address of the service account identity that will be used for a build by default.  This is returned in the format `projects/{project}/serviceAccounts/{service_account}` where `{service_account}` could be the legacy Cloud Build SA, in the format [PROJECT_NUMBER]@cloudbuild.gserviceaccount.com or the Compute SA, in the format [PROJECT_NUMBER]-compute@developer.gserviceaccount.com.  If no service account will be used by default, this will be empty.",
          },
        },
        description: "The default service account used for `Builds`.",
        additionalProperties: true,
      },
    },
  },
};

export default getDefaultServiceAccount;
