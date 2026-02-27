import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
  activeOnly: "active_only",
};

const outputMapping = {
  metric_descriptors: {
    name: "metricDescriptors",
    fields: {
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
          time_series_resource_hierarchy_level:
            "timeSeriesResourceHierarchyLevel",
        },
      },
      launch_stage: "launchStage",
      monitored_resource_types: "monitoredResourceTypes",
    },
  },
  next_page_token: "nextPageToken",
};

const listMetricDescriptors: AppBlock = {
  name: "List Metric Descriptors",
  description: `Lists metric descriptors that match a filter.`,
  category: "Metric Descriptors",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'Optional. If this field is empty, all custom and system-defined metric descriptors are returned. Otherwise, the [filter](https://cloud.google.com/monitoring/api/v3/filters) specifies which metric descriptors are to be returned. For example, the following filter matches all [custom metrics](https://cloud.google.com/monitoring/custom-metrics):      metric.type = starts_with("custom.googleapis.com/")',
          type: {
            type: "string",
            description:
              'Optional. If this field is empty, all custom and system-defined metric descriptors are returned. Otherwise, the [filter](https://cloud.google.com/monitoring/api/v3/filters) specifies which metric descriptors are to be returned. For example, the following filter matches all [custom metrics](https://cloud.google.com/monitoring/custom-metrics):      metric.type = starts_with("custom.googleapis.com/")',
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. A positive number that is the maximum number of results to return. The default and maximum value is 10,000. If a page_size <= 0 or > 10,000 is submitted, will instead return a maximum of 10,000 results.",
          type: {
            type: "integer",
            description:
              "Optional. A positive number that is the maximum number of results to return. The default and maximum value is 10,000. If a page_size <= 0 or > 10,000 is submitted, will instead return a maximum of 10,000 results.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          type: {
            type: "string",
            description:
              "Optional. If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          },
          required: false,
        },
        activeOnly: {
          name: "Active Only",
          description:
            "Optional. If true, only metrics and monitored resource types that have recent data (within roughly 25 hours) will be included in the response.  - If a metric descriptor enumerates monitored resource types, only the    monitored resource types for which the metric type has recent data will    be included in the returned metric descriptor, and if none of them have    recent data, the metric descriptor will not be returned.  - If a metric descriptor does not enumerate the compatible monitored    resource types, it will be returned only if the metric type has recent    data for some monitored resource type. The returned descriptor will not    enumerate any monitored resource types.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, only metrics and monitored resource types that have recent data (within roughly 25 hours) will be included in the response.  - If a metric descriptor enumerates monitored resource types, only the    monitored resource types for which the metric type has recent data will    be included in the returned metric descriptor, and if none of them have    recent data, the metric descriptor will not be returned.  - If a metric descriptor does not enumerate the compatible monitored    resource types, it will be returned only if the metric type has recent    data for some monitored resource type. The returned descriptor will not    enumerate any monitored resource types.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getMetricServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listMetricDescriptors(request, (err: any, response: any) => {
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
          metricDescriptors: {
            type: "array",
            items: {
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
            },
            description:
              "The metric descriptors that are available to the project and that match the value of `filter`, if present.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If there are more results than have been returned, then this field is set to a non-empty value.  To see the additional results, use that value as `page_token` in the next call to this method.",
          },
        },
        description: "The `ListMetricDescriptors` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listMetricDescriptors;
