import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getPermissionServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  permissions: {
    name: "permissions",
    fields: {
      grantee_type: "granteeType",
      email_address: "emailAddress",
    },
  },
  next_page_token: "nextPageToken",
};

const listPermissions: AppBlock = {
  name: "List Permissions",
  description: `Lists permissions for the specific resource.`,
  category: "Permissions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The parent resource of the permissions. Formats:    `tunedModels/{tuned_model}`    `corpora/{corpus}`",
          type: {
            type: "string",
            description:
              "Required. The parent resource of the permissions. Formats:    `tunedModels/{tuned_model}`    `corpora/{corpus}`",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of `Permission`s to return (per page). The service may return fewer permissions.  If unspecified, at most 10 permissions will be returned. This method returns at most 1000 permissions per page, even if you pass larger page_size.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of `Permission`s to return (per page). The service may return fewer permissions.  If unspecified, at most 10 permissions will be returned. This method returns at most 1000 permissions per page, even if you pass larger page_size.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A page token, received from a previous `ListPermissions` call.  Provide the `page_token` returned by one request as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListPermissions` must match the call that provided the page token.",
          type: {
            type: "string",
            description:
              "Optional. A page token, received from a previous `ListPermissions` call.  Provide the `page_token` returned by one request as an argument to the next request to retrieve the next page.  When paginating, all other parameters provided to `ListPermissions` must match the call that provided the page token.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getPermissionServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listPermissions(request, (err: any, response: any) => {
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
          permissions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                granteeType: {
                  type: "string",
                  enum: [
                    "GRANTEE_TYPE_UNSPECIFIED",
                    "USER",
                    "GROUP",
                    "EVERYONE",
                  ],
                },
                emailAddress: {
                  type: "string",
                },
                role: {
                  type: "string",
                  enum: ["ROLE_UNSPECIFIED", "OWNER", "WRITER", "READER"],
                },
              },
              additionalProperties: true,
            },
            description: "Returned permissions.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token, which can be sent as `page_token` to retrieve the next page.  If this field is omitted, there are no more pages.",
          },
        },
        description:
          "Response from `ListPermissions` containing a paginated list of permissions.",
        additionalProperties: true,
      },
    },
  },
};

export default listPermissions;
