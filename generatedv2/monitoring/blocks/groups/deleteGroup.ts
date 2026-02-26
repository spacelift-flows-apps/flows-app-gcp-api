import { AppBlock, events } from "@slflows/sdk/v1";
import { getGroupServiceClient } from "../../lib/grpcClient.ts";

const deleteGroup: AppBlock = {
  name: "Delete Group",
  description: `Deletes an existing group.`,
  category: "Groups",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The group to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]",
          type: {
            type: "string",
            description:
              "Required. The group to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]",
          },
          required: true,
        },
        recursive: {
          name: "Recursive",
          description:
            "If this field is true, then the request means to delete a group with all its descendants. Otherwise, the request means to delete a group only when it has no descendants. The default value is false.",
          type: {
            type: "boolean",
            description:
              "If this field is true, then the request means to delete a group with all its descendants. Otherwise, the request means to delete a group only when it has no descendants. The default value is false.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getGroupServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.recursive !== undefined)
          request.recursive = input.event.inputConfig.recursive;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteGroup(request, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteGroup;
