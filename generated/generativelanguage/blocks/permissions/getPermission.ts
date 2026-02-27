import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getPermissionServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  grantee_type: "granteeType",
  email_address: "emailAddress",
};

const getPermission: AppBlock = {
  name: "Get Permission",
  description: `Gets information about a specific Permission.`,
  category: "Permissions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the permission.  Formats:    `tunedModels/{tuned_model}/permissions/{permission}`    `corpora/{corpus}/permissions/{permission}`",
          type: {
            type: "string",
            description:
              "Required. The resource name of the permission.  Formats:    `tunedModels/{tuned_model}/permissions/{permission}`    `corpora/{corpus}/permissions/{permission}`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getPermissionServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getPermission(request, (err: any, response: any) => {
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

export default getPermission;
