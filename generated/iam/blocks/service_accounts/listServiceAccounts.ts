import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  accounts: {
    name: "accounts",
    fields: {
      project_id: "projectId",
      unique_id: "uniqueId",
      display_name: "displayName",
      oauth2_client_id: "oauth2ClientId",
    },
  },
  next_page_token: "nextPageToken",
};

const listServiceAccounts: AppBlock = {
  name: "List Service Accounts",
  description: `Lists every [ServiceAccount][google.iam.admin.v1.ServiceAccount] that belongs to a specific project.`,
  category: "Service Accounts",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the project associated with the service accounts, such as `projects/my-project-123`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the project associated with the service accounts, such as `projects/my-project-123`.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional limit on the number of service accounts to include in the response. Further accounts can subsequently be obtained by including the [ListServiceAccountsResponse.next_page_token][google.iam.admin.v1.ListServiceAccountsResponse.next_page_token] in a subsequent request.  The default is 20, and the maximum is 100.",
          type: {
            type: "integer",
            description:
              "Optional limit on the number of service accounts to include in the response. Further accounts can subsequently be obtained by including the [ListServiceAccountsResponse.next_page_token][google.iam.admin.v1.ListServiceAccountsResponse.next_page_token] in a subsequent request.  The default is 20, and the maximum is 100.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional pagination token returned in an earlier [ListServiceAccountsResponse.next_page_token][google.iam.admin.v1.ListServiceAccountsResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional pagination token returned in an earlier [ListServiceAccountsResponse.next_page_token][google.iam.admin.v1.ListServiceAccountsResponse.next_page_token].",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listServiceAccounts(request, (err: any, response: any) => {
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
          accounts: {
            type: "array",
            items: {
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
            description: "The list of matching service accounts.",
          },
          nextPageToken: {
            type: "string",
            description:
              "To retrieve the next page of results, set [ListServiceAccountsRequest.page_token][google.iam.admin.v1.ListServiceAccountsRequest.page_token] to this value.",
          },
        },
        description: "The service account list response.",
        additionalProperties: true,
      },
    },
  },
};

export default listServiceAccounts;
