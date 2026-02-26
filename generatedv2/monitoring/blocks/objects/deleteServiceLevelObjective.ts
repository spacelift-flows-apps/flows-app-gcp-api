import { AppBlock, events } from "@slflows/sdk/v1";
import { getServiceMonitoringServiceClient } from "../../lib/grpcClient.ts";

const deleteServiceLevelObjective: AppBlock = {
  name: "Delete Service Level Objective",
  description: `Delete the given 'ServiceLevelObjective'.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Resource name of the `ServiceLevelObjective` to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
          type: {
            type: "string",
            description:
              "Required. Resource name of the `ServiceLevelObjective` to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getServiceMonitoringServiceClient(
          input.app.config,
        );

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteServiceLevelObjective(
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

export default deleteServiceLevelObjective;
