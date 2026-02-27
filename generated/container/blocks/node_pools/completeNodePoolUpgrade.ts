import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const completeNodePoolUpgrade: AppBlock = {
  name: "Complete Node Pool Upgrade",
  description: `CompleteNodePoolUpgrade will signal an on-going node pool upgrade to complete.`,
  category: "Node Pools",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The name (project, location, cluster, node pool id) of the node pool to complete upgrade. Specified in the format `projects/*/locations/*/clusters/*/nodePools/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, cluster, node pool id) of the node pool to complete upgrade. Specified in the format `projects/*/locations/*/clusters/*/nodePools/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.completeNodePoolUpgrade(request, (err: any, response: any) => {
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

export default completeNodePoolUpgrade;
