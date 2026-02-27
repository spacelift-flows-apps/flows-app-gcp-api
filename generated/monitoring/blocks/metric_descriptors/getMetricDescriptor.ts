import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient, convertKeys } from "../../lib/grpcClient.ts";

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

        const request = { ...input.event.inputConfig };

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

export default getMetricDescriptor;
