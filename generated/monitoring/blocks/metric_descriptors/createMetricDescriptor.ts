import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  metricDescriptor: {
    name: "metric_descriptor",
    fields: {
      labels: {
        name: "labels",
        fields: {
          valueType: "value_type",
        },
      },
      metricKind: "metric_kind",
      valueType: "value_type",
      displayName: "display_name",
      metadata: {
        name: "metadata",
        fields: {
          launchStage: "launch_stage",
          samplePeriod: "sample_period",
          ingestDelay: "ingest_delay",
          timeSeriesResourceHierarchyLevel:
            "time_series_resource_hierarchy_level",
        },
      },
      launchStage: "launch_stage",
      monitoredResourceTypes: "monitored_resource_types",
    },
  },
};

const outputMapping = {
  labels: {
    name: "labels",
    fields: {
      value_type: "valueType",
    },
  },
  metric_kind: "metricKind",
  value_type: "valueType",
  display_name: "displayName",
  metadata: {
    name: "metadata",
    fields: {
      launch_stage: "launchStage",
      sample_period: "samplePeriod",
      ingest_delay: "ingestDelay",
      time_series_resource_hierarchy_level: "timeSeriesResourceHierarchyLevel",
    },
  },
  launch_stage: "launchStage",
  monitored_resource_types: "monitoredResourceTypes",
};

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
        metricDescriptor: {
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
              metricKind: {
                type: "string",
                enum: [
                  "METRIC_KIND_UNSPECIFIED",
                  "GAUGE",
                  "DELTA",
                  "CUMULATIVE",
                ],
              },
              valueType: {
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
              displayName: {
                type: "string",
              },
              metadata: {
                type: "object",
                properties: {
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
                  samplePeriod: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                  ingestDelay: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                  timeSeriesResourceHierarchyLevel: {
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
              monitoredResourceTypes: {
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

        const request = convertKeys(input.event.inputConfig, inputMapping);

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
          metricKind: {
            type: "string",
            enum: ["METRIC_KIND_UNSPECIFIED", "GAUGE", "DELTA", "CUMULATIVE"],
          },
          valueType: {
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
          displayName: {
            type: "string",
          },
          metadata: {
            type: "object",
            properties: {
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
              samplePeriod: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              ingestDelay: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              timeSeriesResourceHierarchyLevel: {
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
          monitoredResourceTypes: {
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
