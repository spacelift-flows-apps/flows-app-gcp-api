import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient } from "../../lib/grpcClient.ts";

const getMetricDescriptor: AppBlock = {
  name: "Get Metric Descriptor",
  description: `Gets a single metric descriptor.`,
  category: "Metric Descriptors",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            'Required. The metric descriptor on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/metricDescriptors/[METRIC_ID]  An example value of `[METRIC_ID]` is `"compute.googleapis.com/instance/disk/read_bytes_count"`.',
          type: {
            type: "string",
            description:
              'Required. The metric descriptor on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/metricDescriptors/[METRIC_ID]  An example value of `[METRIC_ID]` is `"compute.googleapis.com/instance/disk/read_bytes_count"`.',
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
          client.getMetricDescriptor(request, (err: any, response: any) => {
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
        properties: {
          name: {
            type: "string",
          },
          type: {
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
          metric_kind: {
            type: "string",
            enum: ["METRIC_KIND_UNSPECIFIED", "GAUGE", "DELTA", "CUMULATIVE"],
          },
          value_type: {
            type: "string",
            enum: [
              "VALUE_TYPE_UNSPECIFIED",
              "BOOL",
              "INT64",
              "DOUBLE",
              "STRING",
              "DISTRIBUTION",
              "MONEY",
            ],
          },
          unit: {
            type: "string",
          },
          description: {
            type: "string",
          },
          display_name: {
            type: "string",
          },
          metadata: {
            type: "object",
            properties: {
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
              sample_period: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              ingest_delay: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              time_series_resource_hierarchy_level: {
                type: "array",
                items: {
                  type: "string",
                  enum: [
                    "TIME_SERIES_RESOURCE_HIERARCHY_LEVEL_UNSPECIFIED",
                    "PROJECT",
                    "ORGANIZATION",
                    "FOLDER",
                  ],
                },
              },
            },
            additionalProperties: true,
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
          monitored_resource_types: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMetricDescriptor;
