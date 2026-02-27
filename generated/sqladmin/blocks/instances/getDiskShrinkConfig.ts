import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSqlInstancesServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  minimal_target_size_gb: "minimalTargetSizeGb",
};

const getDiskShrinkConfig: AppBlock = {
  name: "Get Disk Shrink Config",
  description: `Get Disk Shrink Config for a given instance.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Cloud SQL instance ID. This does not include the project ID.",
          type: {
            type: "string",
            description:
              "Cloud SQL instance ID. This does not include the project ID.",
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
        const client = await getSqlInstancesServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getDiskShrinkConfig(request, (err: any, response: any) => {
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
          kind: {
            type: "string",
            description: "This is always `sql#getDiskShrinkConfig`.",
          },
          minimalTargetSizeGb: {
            type: "string",
            description: "64-bit integer as string",
          },
          message: {
            type: "string",
            description: "Additional message to customers.",
          },
        },
        description: "Instance get disk shrink config response.",
        additionalProperties: true,
      },
    },
  },
};

export default getDiskShrinkConfig;
