import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getPermissionServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  permission: {
    name: "permission",
    fields: {
      granteeType: "grantee_type",
      emailAddress: "email_address",
    },
  },
};

const outputMapping = {
  grantee_type: "granteeType",
  email_address: "emailAddress",
};

const createPermission: AppBlock = {
  name: "Create Permission",
  description: `Create a permission to a specific resource.`,
  category: "Permissions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The parent resource of the `Permission`. Formats:    `tunedModels/{tuned_model}`    `corpora/{corpus}`",
          type: {
            type: "string",
            description:
              "Required. The parent resource of the `Permission`. Formats:    `tunedModels/{tuned_model}`    `corpora/{corpus}`",
          },
          required: true,
        },
        permission: {
          name: "Permission",
          description: "Required. The permission to create.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              granteeType: {
                type: "string",
                enum: ["GRANTEE_TYPE_UNSPECIFIED", "USER", "GROUP", "EVERYONE"],
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
            description: "Required. The permission to create.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPermissionServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createPermission(request, (err: any, response: any) => {
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
          name: {
            type: "string",
          },
          granteeType: {
            type: "string",
            enum: ["GRANTEE_TYPE_UNSPECIFIED", "USER", "GROUP", "EVERYONE"],
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
    },
  },
};

export default createPermission;
