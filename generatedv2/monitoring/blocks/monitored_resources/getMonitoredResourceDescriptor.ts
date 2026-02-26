import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  display_name: "displayName",
  labels: {
    name: "labels",
    fields: {
      value_type: "valueType",
    },
  },
  launch_stage: "launchStage",
};

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

        const request = { ...input.event.inputConfig };

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
          type: {
            type: "string",
          },
          displayName: {
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
                valueType: {
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
          launchStage: {
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
