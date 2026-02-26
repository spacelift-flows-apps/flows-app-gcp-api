import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient } from "../../lib/grpcClient.ts";

const createMetricDescriptor: AppBlock = {
  name: "Create Metric Descriptor",
  description: `Creates a new metric descriptor. The creation is executed asynchronously. User-created metric descriptors define [custom metrics](https://cloud.google.com/monitoring/custom-metrics). The metric descriptor is updated if it already exists, except that metric labels are never removed.`,
  category: "Metric Descriptors",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is: 4     projects/[PROJECT_ID_OR_NUMBER]",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is: 4     projects/[PROJECT_ID_OR_NUMBER]",
          },
          required: true,
        },
        metric_descriptor: {
          name: "Metric Descriptor",
          description:
            "Required. The new [custom metric](https://cloud.google.com/monitoring/custom-metrics) descriptor.",
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
                enum: [
                  "METRIC_KIND_UNSPECIFIED",
                  "GAUGE",
                  "DELTA",
                  "CUMULATIVE",
                ],
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
            description:
              "Required. The new [custom metric](https://cloud.google.com/monitoring/custom-metrics) descriptor.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getMetricServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.metric_descriptor !== undefined)
          request.metric_descriptor = input.event.inputConfig.metric_descriptor;

        const result = await new Promise<any>((resolve, reject) => {
          client.createMetricDescriptor(request, (err: any, response: any) => {
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

export default createMetricDescriptor;
