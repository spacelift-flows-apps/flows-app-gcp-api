import { AppBlock, events } from "@slflows/sdk/v1";
import { getUptimeCheckServiceClient } from "../../lib/grpcClient.ts";

const deleteUptimeCheckConfig: AppBlock = {
  name: "Delete Uptime Check Config",
  description: `Deletes an Uptime check configuration. Note that this method will fail if the Uptime check configuration is referenced by an alert policy or other dependent configs that would be rendered invalid by the deletion.`,
  category: "Uptime Checks",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The Uptime check configuration to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/uptimeCheckConfigs/[UPTIME_CHECK_ID]",
          type: {
            type: "string",
            description:
              "Required. The Uptime check configuration to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/uptimeCheckConfigs/[UPTIME_CHECK_ID]",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getUptimeCheckServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteUptimeCheckConfig(request, (err: any, response: any) => {
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

export default deleteUptimeCheckConfig;
