import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlOperationsServiceClient } from "../../lib/grpcClient.ts";

const cancel: AppBlock = {
  name: "Cancel",
  description: `Cancels an instance operation that has been performed on an instance.`,
  category: "Operations",
  inputs: {
    default: {
      config: {
        operation: {
          name: "Operation",
          description: "Instance operation ID.",
          type: {
            type: "string",
            description: "Instance operation ID.",
          },
          required: false,
        },
        project: {
          name: "Project",
          description: "Project ID of the project that contains the instance.",
          type: {
            type: "string",
            description:
              "Project ID of the project that contains the instance.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlOperationsServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.operation !== undefined)
          request.operation = input.event.inputConfig.operation;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;

        const result = await new Promise<any>((resolve, reject) => {
          client.cancel(request, (err: any, response: any) => {
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

export default cancel;
