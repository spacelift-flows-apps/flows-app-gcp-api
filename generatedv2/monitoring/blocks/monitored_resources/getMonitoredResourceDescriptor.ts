import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient } from "../../lib/grpcClient.ts";

const getMonitoredResourceDescriptor: AppBlock = {
  name: "Get Monitored Resource Descriptor",
  description: `Gets a single monitored resource descriptor.`,
  category: "Monitored Resources",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The monitored resource descriptor to get.  The format is:      projects/[PROJECT_ID_OR_NUMBER]/monitoredResourceDescriptors/[RESOURCE_TYPE]  The `[RESOURCE_TYPE]` is a predefined type, such as `cloudsql_database`.",
          type: {
            type: "string",
            description:
              "Required. The monitored resource descriptor to get.  The format is:      projects/[PROJECT_ID_OR_NUMBER]/monitoredResourceDescriptors/[RESOURCE_TYPE]  The `[RESOURCE_TYPE]` is a predefined type, such as `cloudsql_database`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getMetricServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getMonitoredResourceDescriptor(
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
        properties: {
          name: {
            type: "string",
          },
          type: {
            type: "string",
          },
          display_name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          labels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                value_type: {
                  type: "string",
                  enum: ["STRING", "BOOL", "INT64"],
                },
                description: {
                  type: "string",
                },
              },
              additionalProperties: true,
            },
          },
          launch_stage: {
            type: "string",
            enum: [
              "LAUNCH_STAGE_UNSPECIFIED",
              "UNIMPLEMENTED",
              "PRELAUNCH",
              "EARLY_ACCESS",
              "ALPHA",
              "BETA",
              "GA",
              "DEPRECATED",
            ],
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMonitoredResourceDescriptor;
