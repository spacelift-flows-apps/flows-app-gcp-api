import { AppBlock, events } from "@slflows/sdk/v1";
import { getServiceMonitoringServiceClient } from "../../lib/grpcClient.ts";

const deleteService: AppBlock = {
  name: "Delete Service",
  description: `Soft delete this 'Service'.`,
  category: "Services",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Resource name of the `Service` to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]",
          type: {
            type: "string",
            description:
              "Required. Resource name of the `Service` to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getServiceMonitoringServiceClient(
          input.app.config,
        );

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteService(request, (err: any, response: any) => {
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

export default deleteService;
