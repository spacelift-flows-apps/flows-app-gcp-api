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
  updateMask: "update_mask",
};

const outputMapping = {
  grantee_type: "granteeType",
  email_address: "emailAddress",
};

const updatePermission: AppBlock = {
  name: "Update Permission",
  description: `Updates the permission.`,
  category: "Permissions",
  inputs: {
    default: {
      config: {
        permission: {
          name: "Permission",
          description:
            "Required. The permission to update.  The permission's `name` field is used to identify the permission to update.",
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
            description:
              "Required. The permission to update.  The permission's `name` field is used to identify the permission to update.",
          },
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "Required. The list of fields to update. Accepted ones:  - role (`Permission.role` field)",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPermissionServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.updatePermission(request, (err: any, response: any) => {
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

export default updatePermission;
