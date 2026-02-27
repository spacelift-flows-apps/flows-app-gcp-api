import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getServiceMonitoringServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  serviceLevelObjective: {
    name: "service_level_objective",
    fields: {
      displayName: "display_name",
      serviceLevelIndicator: {
        name: "service_level_indicator",
        fields: {
          basicSli: "basic_sli",
          requestBased: {
            name: "request_based",
            fields: {
              goodTotalRatio: {
                name: "good_total_ratio",
                fields: {
                  goodServiceFilter: "good_service_filter",
                  badServiceFilter: "bad_service_filter",
                  totalServiceFilter: "total_service_filter",
                },
              },
              distributionCut: {
                name: "distribution_cut",
                fields: {
                  distributionFilter: "distribution_filter",
                },
              },
            },
          },
          windowsBased: {
            name: "windows_based",
            fields: {
              goodBadMetricFilter: "good_bad_metric_filter",
              goodTotalRatioThreshold: {
                name: "good_total_ratio_threshold",
                fields: {
                  performance: {
                    name: "performance",
                    fields: {
                      goodTotalRatio: {
                        name: "good_total_ratio",
                        fields: {
                          goodServiceFilter: "good_service_filter",
                          badServiceFilter: "bad_service_filter",
                          totalServiceFilter: "total_service_filter",
                        },
                      },
                      distributionCut: {
                        name: "distribution_cut",
                        fields: {
                          distributionFilter: "distribution_filter",
                        },
                      },
                    },
                  },
                  basicSliPerformance: "basic_sli_performance",
                },
              },
              metricMeanInRange: {
                name: "metric_mean_in_range",
                fields: {
                  timeSeries: "time_series",
                },
              },
              metricSumInRange: {
                name: "metric_sum_in_range",
                fields: {
                  timeSeries: "time_series",
                },
              },
              windowPeriod: "window_period",
            },
          },
        },
      },
      rollingPeriod: "rolling_period",
      calendarPeriod: "calendar_period",
      userLabels: "user_labels",
    },
  },
  updateMask: "update_mask",
};

const outputMapping = {
  display_name: "displayName",
  service_level_indicator: {
    name: "serviceLevelIndicator",
    fields: {
      basic_sli: "basicSli",
      request_based: {
        name: "requestBased",
        fields: {
          good_total_ratio: {
            name: "goodTotalRatio",
            fields: {
              good_service_filter: "goodServiceFilter",
              bad_service_filter: "badServiceFilter",
              total_service_filter: "totalServiceFilter",
            },
          },
          distribution_cut: {
            name: "distributionCut",
            fields: {
              distribution_filter: "distributionFilter",
            },
          },
        },
      },
      windows_based: {
        name: "windowsBased",
        fields: {
          good_bad_metric_filter: "goodBadMetricFilter",
          good_total_ratio_threshold: {
            name: "goodTotalRatioThreshold",
            fields: {
              performance: {
                name: "performance",
                fields: {
                  good_total_ratio: {
                    name: "goodTotalRatio",
                    fields: {
                      good_service_filter: "goodServiceFilter",
                      bad_service_filter: "badServiceFilter",
                      total_service_filter: "totalServiceFilter",
                    },
                  },
                  distribution_cut: {
                    name: "distributionCut",
                    fields: {
                      distribution_filter: "distributionFilter",
                    },
                  },
                },
              },
              basic_sli_performance: "basicSliPerformance",
            },
          },
          metric_mean_in_range: {
            name: "metricMeanInRange",
            fields: {
              time_series: "timeSeries",
            },
          },
          metric_sum_in_range: {
            name: "metricSumInRange",
            fields: {
              time_series: "timeSeries",
            },
          },
          window_period: "windowPeriod",
        },
      },
    },
  },
  rolling_period: "rollingPeriod",
  calendar_period: "calendarPeriod",
  user_labels: "userLabels",
};

const updateServiceLevelObjective: AppBlock = {
  name: "Update Service Level Objective",
  description: `Update the given 'ServiceLevelObjective'.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        serviceLevelObjective: {
          name: "Service Level Objective",
          description:
            "Required. The `ServiceLevelObjective` to draw updates from. The given `name` specifies the resource to update.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. Resource name for this `ServiceLevelObjective`. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
              },
              displayName: {
                type: "string",
                description: "Name used for UI elements listing this SLO.",
              },
              serviceLevelIndicator: {
                type: "object",
                properties: {
                  basicSli: {
                    type: "object",
                    properties: {
                      method: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "OPTIONAL: The set of RPCs to which this SLI is relevant. Telemetry from other methods will not be used to calculate performance for this SLI. If omitted, this SLI applies to all the Service's methods. For service types that don't support breaking down by method, setting this field will result in an error.",
                      },
                      location: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "OPTIONAL: The set of locations to which this SLI is relevant. Telemetry from other locations will not be used to calculate performance for this SLI. If omitted, this SLI applies to all locations in which the Service has activity. For service types that don't support breaking down by location, setting this field will result in an error.",
                      },
                      version: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "OPTIONAL: The set of API versions to which this SLI is relevant. Telemetry from other API versions will not be used to calculate performance for this SLI. If omitted, this SLI applies to all API versions. For service types that don't support breaking down by version, setting this field will result in an error.",
                      },
                      availability: {
                        type: "object",
                        properties: {},
                        description:
                          "Future parameters for the availability SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      latency: {
                        type: "object",
                        properties: {
                          threshold: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                        },
                        description:
                          "Parameters for a latency threshold SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the `service_resource` determines the metrics to use and the `service_resource.labels` and `metric_labels` are used to construct a monitoring filter to filter that metric down to just the data relevant to this service. (Part of 'type' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  requestBased: {
                    type: "object",
                    properties: {
                      goodTotalRatio: {
                        type: "object",
                        properties: {
                          goodServiceFilter: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                          },
                          badServiceFilter: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                          },
                          totalServiceFilter: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                          },
                        },
                        description:
                          "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      distributionCut: {
                        type: "object",
                        properties: {
                          distributionFilter: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` aggregating values. Must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                          },
                          range: {
                            type: "object",
                            properties: {
                              min: {
                                type: "number",
                                description: "Range minimum.",
                              },
                              max: {
                                type: "number",
                                description: "Range maximum.",
                              },
                            },
                            description:
                              "Range of numerical values within `min` and `max`.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "A `DistributionCut` defines a `TimeSeries` and thresholds used for measuring good service and total service. The `TimeSeries` must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The computed `good_service` will be the estimated count of values in the `Distribution` that fall within the specified `min` and `max`. (Part of 'method' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "Service Level Indicators for which atomic units of service are counted directly. (Part of 'type' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  windowsBased: {
                    type: "object",
                    properties: {
                      goodBadMetricFilter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` with `ValueType = BOOL`. The window is good if any `true` values appear in the window. (Part of 'window_criterion' - only one field in this group can be set)",
                      },
                      goodTotalRatioThreshold: {
                        type: "object",
                        properties: {
                          performance: {
                            type: "object",
                            properties: {
                              goodTotalRatio: {
                                type: "object",
                                properties: {
                                  goodServiceFilter: {
                                    type: "string",
                                    description:
                                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                                  },
                                  badServiceFilter: {
                                    type: "string",
                                    description:
                                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                                  },
                                  totalServiceFilter: {
                                    type: "string",
                                    description:
                                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                                  },
                                },
                                description:
                                  "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                                additionalProperties: true,
                              },
                              distributionCut: {
                                type: "object",
                                properties: {
                                  distributionFilter: {
                                    type: "string",
                                    description:
                                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` aggregating values. Must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                                  },
                                  range: {
                                    type: "object",
                                    properties: {
                                      min: {
                                        type: "number",
                                        description: "Range minimum.",
                                      },
                                      max: {
                                        type: "number",
                                        description: "Range maximum.",
                                      },
                                    },
                                    description:
                                      "Range of numerical values within `min` and `max`.",
                                    additionalProperties: true,
                                  },
                                },
                                description:
                                  "A `DistributionCut` defines a `TimeSeries` and thresholds used for measuring good service and total service. The `TimeSeries` must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The computed `good_service` will be the estimated count of values in the `Distribution` that fall within the specified `min` and `max`. (Part of 'method' - only one field in this group can be set)",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "Service Level Indicators for which atomic units of service are counted directly. (Part of 'type' - only one field in this group can be set)",
                            additionalProperties: true,
                          },
                          basicSliPerformance: {
                            type: "object",
                            properties: {
                              method: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "OPTIONAL: The set of RPCs to which this SLI is relevant. Telemetry from other methods will not be used to calculate performance for this SLI. If omitted, this SLI applies to all the Service's methods. For service types that don't support breaking down by method, setting this field will result in an error.",
                              },
                              location: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "OPTIONAL: The set of locations to which this SLI is relevant. Telemetry from other locations will not be used to calculate performance for this SLI. If omitted, this SLI applies to all locations in which the Service has activity. For service types that don't support breaking down by location, setting this field will result in an error.",
                              },
                              version: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "OPTIONAL: The set of API versions to which this SLI is relevant. Telemetry from other API versions will not be used to calculate performance for this SLI. If omitted, this SLI applies to all API versions. For service types that don't support breaking down by version, setting this field will result in an error.",
                              },
                              availability: {
                                type: "object",
                                properties: {},
                                description:
                                  "Future parameters for the availability SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                                additionalProperties: true,
                              },
                              latency: {
                                type: "object",
                                properties: {
                                  threshold: {
                                    type: "string",
                                    description:
                                      "Duration string (e.g., '1.5s', '300s')",
                                  },
                                },
                                description:
                                  "Parameters for a latency threshold SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the `service_resource` determines the metrics to use and the `service_resource.labels` and `metric_labels` are used to construct a monitoring filter to filter that metric down to just the data relevant to this service. (Part of 'type' - only one field in this group can be set)",
                            additionalProperties: true,
                          },
                          threshold: {
                            type: "number",
                            description:
                              "If window `performance >= threshold`, the window is counted as good.",
                          },
                        },
                        description:
                          "A `PerformanceThreshold` is used when each window is good when that window has a sufficiently high `performance`. (Part of 'window_criterion' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      metricMeanInRange: {
                        type: "object",
                        properties: {
                          timeSeries: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying the `TimeSeries` to use for evaluating window quality.",
                          },
                          range: {
                            type: "object",
                            properties: {
                              min: {
                                type: "number",
                                description: "Range minimum.",
                              },
                              max: {
                                type: "number",
                                description: "Range maximum.",
                              },
                            },
                            description:
                              "Range of numerical values within `min` and `max`.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "A `MetricRange` is used when each window is good when the value x of a single `TimeSeries` satisfies `range.min <= x <= range.max`. The provided `TimeSeries` must have `ValueType = INT64` or `ValueType = DOUBLE` and `MetricKind = GAUGE`. (Part of 'window_criterion' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      metricSumInRange: {
                        type: "object",
                        properties: {
                          timeSeries: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying the `TimeSeries` to use for evaluating window quality.",
                          },
                          range: {
                            type: "object",
                            properties: {
                              min: {
                                type: "number",
                                description: "Range minimum.",
                              },
                              max: {
                                type: "number",
                                description: "Range maximum.",
                              },
                            },
                            description:
                              "Range of numerical values within `min` and `max`.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "A `MetricRange` is used when each window is good when the value x of a single `TimeSeries` satisfies `range.min <= x <= range.max`. The provided `TimeSeries` must have `ValueType = INT64` or `ValueType = DOUBLE` and `MetricKind = GAUGE`. (Part of 'window_criterion' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      windowPeriod: {
                        type: "string",
                        description: "Duration string (e.g., '1.5s', '300s')",
                      },
                    },
                    description:
                      "A `WindowsBasedSli` defines `good_service` as the count of time windows for which the provided service was of good quality. Criteria for determining if service was good are embedded in the `window_criterion`. (Part of 'type' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                },
                description:
                  'A Service-Level Indicator (SLI) describes the "performance" of a service. For some services, the SLI is well-defined. In such cases, the SLI can be described easily by referencing the well-known SLI and providing the needed parameters. Alternatively, a "custom" SLI can be defined with a query to the underlying metric store. An SLI is defined to be `good_service / total_service` over any queried time interval. The value of performance always falls into the range `0 <= performance <= 1`. A custom SLI describes how to compute this ratio, whether this is by dividing values from a pair of time series, cutting a `Distribution` into good and bad counts, or counting time windows in which the service complies with a criterion. For separation of concerns, a single Service-Level Indicator measures performance for only one aspect of service quality, such as fraction of successful queries or fast-enough queries.',
                additionalProperties: true,
              },
              goal: {
                type: "number",
                description:
                  "The fraction of service that must be good in order for this objective to be met. `0 < goal <= 0.9999`.",
              },
              rollingPeriod: {
                type: "string",
                description:
                  "Duration string (e.g., '1.5s', '300s') (Part of 'period' - only one field in this group can be set)",
              },
              calendarPeriod: {
                type: "string",
                enum: [
                  "CALENDAR_PERIOD_UNSPECIFIED",
                  "DAY",
                  "WEEK",
                  "FORTNIGHT",
                  "MONTH",
                  "QUARTER",
                  "HALF",
                  "YEAR",
                ],
                description:
                  "A calendar period, semantically \"since the start of the current `<calendar_period>`\". At this time, only `DAY`, `WEEK`, `FORTNIGHT`, and `MONTH` are supported. (Part of 'period' - only one field in this group can be set)",
              },
              userLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Labels which have been used to annotate the service-level objective. Label keys must start with a letter. Label keys and values may contain lowercase letters, numbers, underscores, and dashes. Label keys and values have a maximum length of 63 characters, and must be less than 128 bytes in size. Up to 64 label entries may be stored. For labels which do not have a semantic value, the empty string may be supplied for the label value.",
              },
            },
            description:
              'A Service-Level Objective (SLO) describes a level of desired good service. It consists of a service-level indicator (SLI), a performance goal, and a period over which the objective is to be evaluated against that goal. The SLO can use SLIs defined in a number of different manners. Typical SLOs might include "99% of requests in each rolling week have latency below 200 milliseconds" or "99.5% of requests in each calendar month return successfully."',
            additionalProperties: true,
          },
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "A set of field paths defining which fields to use for the update.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getServiceMonitoringServiceClient(
          input.app.config,
        );

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.updateServiceLevelObjective(
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
            description:
              "Identifier. Resource name for this `ServiceLevelObjective`. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
          },
          displayName: {
            type: "string",
            description: "Name used for UI elements listing this SLO.",
          },
          serviceLevelIndicator: {
            type: "object",
            properties: {
              basicSli: {
                type: "object",
                properties: {
                  method: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "OPTIONAL: The set of RPCs to which this SLI is relevant. Telemetry from other methods will not be used to calculate performance for this SLI. If omitted, this SLI applies to all the Service's methods. For service types that don't support breaking down by method, setting this field will result in an error.",
                  },
                  location: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "OPTIONAL: The set of locations to which this SLI is relevant. Telemetry from other locations will not be used to calculate performance for this SLI. If omitted, this SLI applies to all locations in which the Service has activity. For service types that don't support breaking down by location, setting this field will result in an error.",
                  },
                  version: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "OPTIONAL: The set of API versions to which this SLI is relevant. Telemetry from other API versions will not be used to calculate performance for this SLI. If omitted, this SLI applies to all API versions. For service types that don't support breaking down by version, setting this field will result in an error.",
                  },
                  availability: {
                    type: "object",
                    properties: {},
                    description:
                      "Future parameters for the availability SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  latency: {
                    type: "object",
                    properties: {
                      threshold: {
                        type: "string",
                        description: "Duration string (e.g., '1.5s', '300s')",
                      },
                    },
                    description:
                      "Parameters for a latency threshold SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                },
                description:
                  "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the `service_resource` determines the metrics to use and the `service_resource.labels` and `metric_labels` are used to construct a monitoring filter to filter that metric down to just the data relevant to this service. (Part of 'type' - only one field in this group can be set)",
                additionalProperties: true,
              },
              requestBased: {
                type: "object",
                properties: {
                  goodTotalRatio: {
                    type: "object",
                    properties: {
                      goodServiceFilter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                      },
                      badServiceFilter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                      },
                      totalServiceFilter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                      },
                    },
                    description:
                      "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  distributionCut: {
                    type: "object",
                    properties: {
                      distributionFilter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` aggregating values. Must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum.",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum.",
                          },
                        },
                        description:
                          "Range of numerical values within `min` and `max`.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A `DistributionCut` defines a `TimeSeries` and thresholds used for measuring good service and total service. The `TimeSeries` must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The computed `good_service` will be the estimated count of values in the `Distribution` that fall within the specified `min` and `max`. (Part of 'method' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                },
                description:
                  "Service Level Indicators for which atomic units of service are counted directly. (Part of 'type' - only one field in this group can be set)",
                additionalProperties: true,
              },
              windowsBased: {
                type: "object",
                properties: {
                  goodBadMetricFilter: {
                    type: "string",
                    description:
                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` with `ValueType = BOOL`. The window is good if any `true` values appear in the window. (Part of 'window_criterion' - only one field in this group can be set)",
                  },
                  goodTotalRatioThreshold: {
                    type: "object",
                    properties: {
                      performance: {
                        type: "object",
                        properties: {
                          goodTotalRatio: {
                            type: "object",
                            properties: {
                              goodServiceFilter: {
                                type: "string",
                                description:
                                  "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                              },
                              badServiceFilter: {
                                type: "string",
                                description:
                                  "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                              },
                              totalServiceFilter: {
                                type: "string",
                                description:
                                  "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                              },
                            },
                            description:
                              "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                            additionalProperties: true,
                          },
                          distributionCut: {
                            type: "object",
                            properties: {
                              distributionFilter: {
                                type: "string",
                                description:
                                  "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` aggregating values. Must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                              },
                              range: {
                                type: "object",
                                properties: {
                                  min: {
                                    type: "number",
                                    description: "Range minimum.",
                                  },
                                  max: {
                                    type: "number",
                                    description: "Range maximum.",
                                  },
                                },
                                description:
                                  "Range of numerical values within `min` and `max`.",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "A `DistributionCut` defines a `TimeSeries` and thresholds used for measuring good service and total service. The `TimeSeries` must have `ValueType = DISTRIBUTION` and `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The computed `good_service` will be the estimated count of values in the `Distribution` that fall within the specified `min` and `max`. (Part of 'method' - only one field in this group can be set)",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "Service Level Indicators for which atomic units of service are counted directly. (Part of 'type' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      basicSliPerformance: {
                        type: "object",
                        properties: {
                          method: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "OPTIONAL: The set of RPCs to which this SLI is relevant. Telemetry from other methods will not be used to calculate performance for this SLI. If omitted, this SLI applies to all the Service's methods. For service types that don't support breaking down by method, setting this field will result in an error.",
                          },
                          location: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "OPTIONAL: The set of locations to which this SLI is relevant. Telemetry from other locations will not be used to calculate performance for this SLI. If omitted, this SLI applies to all locations in which the Service has activity. For service types that don't support breaking down by location, setting this field will result in an error.",
                          },
                          version: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "OPTIONAL: The set of API versions to which this SLI is relevant. Telemetry from other API versions will not be used to calculate performance for this SLI. If omitted, this SLI applies to all API versions. For service types that don't support breaking down by version, setting this field will result in an error.",
                          },
                          availability: {
                            type: "object",
                            properties: {},
                            description:
                              "Future parameters for the availability SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                            additionalProperties: true,
                          },
                          latency: {
                            type: "object",
                            properties: {
                              threshold: {
                                type: "string",
                                description:
                                  "Duration string (e.g., '1.5s', '300s')",
                              },
                            },
                            description:
                              "Parameters for a latency threshold SLI. (Part of 'sli_criteria' - only one field in this group can be set)",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the `service_resource` determines the metrics to use and the `service_resource.labels` and `metric_labels` are used to construct a monitoring filter to filter that metric down to just the data relevant to this service. (Part of 'type' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      threshold: {
                        type: "number",
                        description:
                          "If window `performance >= threshold`, the window is counted as good.",
                      },
                    },
                    description:
                      "A `PerformanceThreshold` is used when each window is good when that window has a sufficiently high `performance`. (Part of 'window_criterion' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  metricMeanInRange: {
                    type: "object",
                    properties: {
                      timeSeries: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying the `TimeSeries` to use for evaluating window quality.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum.",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum.",
                          },
                        },
                        description:
                          "Range of numerical values within `min` and `max`.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A `MetricRange` is used when each window is good when the value x of a single `TimeSeries` satisfies `range.min <= x <= range.max`. The provided `TimeSeries` must have `ValueType = INT64` or `ValueType = DOUBLE` and `MetricKind = GAUGE`. (Part of 'window_criterion' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  metricSumInRange: {
                    type: "object",
                    properties: {
                      timeSeries: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying the `TimeSeries` to use for evaluating window quality.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum.",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum.",
                          },
                        },
                        description:
                          "Range of numerical values within `min` and `max`.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A `MetricRange` is used when each window is good when the value x of a single `TimeSeries` satisfies `range.min <= x <= range.max`. The provided `TimeSeries` must have `ValueType = INT64` or `ValueType = DOUBLE` and `MetricKind = GAUGE`. (Part of 'window_criterion' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  windowPeriod: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                },
                description:
                  "A `WindowsBasedSli` defines `good_service` as the count of time windows for which the provided service was of good quality. Criteria for determining if service was good are embedded in the `window_criterion`. (Part of 'type' - only one field in this group can be set)",
                additionalProperties: true,
              },
            },
            description:
              'A Service-Level Indicator (SLI) describes the "performance" of a service. For some services, the SLI is well-defined. In such cases, the SLI can be described easily by referencing the well-known SLI and providing the needed parameters. Alternatively, a "custom" SLI can be defined with a query to the underlying metric store. An SLI is defined to be `good_service / total_service` over any queried time interval. The value of performance always falls into the range `0 <= performance <= 1`. A custom SLI describes how to compute this ratio, whether this is by dividing values from a pair of time series, cutting a `Distribution` into good and bad counts, or counting time windows in which the service complies with a criterion. For separation of concerns, a single Service-Level Indicator measures performance for only one aspect of service quality, such as fraction of successful queries or fast-enough queries.',
            additionalProperties: true,
          },
          goal: {
            type: "number",
            description:
              "The fraction of service that must be good in order for this objective to be met. `0 < goal <= 0.9999`.",
          },
          rollingPeriod: {
            type: "string",
            description:
              "Duration string (e.g., '1.5s', '300s') (Part of 'period' - only one field in this group can be set)",
          },
          calendarPeriod: {
            type: "string",
            enum: [
              "CALENDAR_PERIOD_UNSPECIFIED",
              "DAY",
              "WEEK",
              "FORTNIGHT",
              "MONTH",
              "QUARTER",
              "HALF",
              "YEAR",
            ],
            description:
              "A calendar period, semantically \"since the start of the current `<calendar_period>`\". At this time, only `DAY`, `WEEK`, `FORTNIGHT`, and `MONTH` are supported. (Part of 'period' - only one field in this group can be set)",
          },
          userLabels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels which have been used to annotate the service-level objective. Label keys must start with a letter. Label keys and values may contain lowercase letters, numbers, underscores, and dashes. Label keys and values have a maximum length of 63 characters, and must be less than 128 bytes in size. Up to 64 label entries may be stored. For labels which do not have a semantic value, the empty string may be supplied for the label value.",
          },
        },
        description:
          'A Service-Level Objective (SLO) describes a level of desired good service. It consists of a service-level indicator (SLI), a performance goal, and a period over which the objective is to be evaluated against that goal. The SLO can use SLIs defined in a number of different manners. Typical SLOs might include "99% of requests in each rolling week have latency below 200 milliseconds" or "99.5% of requests in each calendar month return successfully."',
        additionalProperties: true,
      },
    },
  },
};

export default updateServiceLevelObjective;
