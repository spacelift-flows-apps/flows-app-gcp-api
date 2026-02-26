import { AppBlock, events } from "@slflows/sdk/v1";
import { getServiceMonitoringServiceClient } from "../../lib/grpcClient.ts";

const createServiceLevelObjective: AppBlock = {
  name: "Create Service Level Objective",
  description: `Create a 'ServiceLevelObjective' for the given 'Service'.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Resource name of the parent `Service`. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]",
          type: {
            type: "string",
            description:
              "Required. Resource name of the parent `Service`. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]",
          },
          required: true,
        },
        service_level_objective_id: {
          name: "Service Level Objective Id",
          description:
            "Optional. The ServiceLevelObjective id to use for this ServiceLevelObjective. If omitted, an id will be generated instead. Must match the pattern `^[a-zA-Z0-9-_:.]+$`",
          type: {
            type: "string",
            description:
              "Optional. The ServiceLevelObjective id to use for this ServiceLevelObjective. If omitted, an id will be generated instead. Must match the pattern `^[a-zA-Z0-9-_:.]+$`",
          },
          required: false,
        },
        service_level_objective: {
          name: "Service Level Objective",
          description:
            "Required. The `ServiceLevelObjective` to create. The provided `name` will be respected if no `ServiceLevelObjective` exists with this name.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. Resource name for this `ServiceLevelObjective`. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
              },
              display_name: {
                type: "string",
                description: "Name used for UI elements listing this SLO.",
              },
              service_level_indicator: {
                type: "object",
                properties: {
                  basic_sli: {
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
                  request_based: {
                    type: "object",
                    properties: {
                      good_total_ratio: {
                        type: "object",
                        properties: {
                          good_service_filter: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                          },
                          bad_service_filter: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                          },
                          total_service_filter: {
                            type: "string",
                            description:
                              "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                          },
                        },
                        description:
                          "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                        additionalProperties: true,
                      },
                      distribution_cut: {
                        type: "object",
                        properties: {
                          distribution_filter: {
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
                  windows_based: {
                    type: "object",
                    properties: {
                      good_bad_metric_filter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` with `ValueType = BOOL`. The window is good if any `true` values appear in the window. (Part of 'window_criterion' - only one field in this group can be set)",
                      },
                      good_total_ratio_threshold: {
                        type: "object",
                        properties: {
                          performance: {
                            type: "object",
                            properties: {
                              good_total_ratio: {
                                type: "object",
                                properties: {
                                  good_service_filter: {
                                    type: "string",
                                    description:
                                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                                  },
                                  bad_service_filter: {
                                    type: "string",
                                    description:
                                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                                  },
                                  total_service_filter: {
                                    type: "string",
                                    description:
                                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                                  },
                                },
                                description:
                                  "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                                additionalProperties: true,
                              },
                              distribution_cut: {
                                type: "object",
                                properties: {
                                  distribution_filter: {
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
                          basic_sli_performance: {
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
                      metric_mean_in_range: {
                        type: "object",
                        properties: {
                          time_series: {
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
                      metric_sum_in_range: {
                        type: "object",
                        properties: {
                          time_series: {
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
                      window_period: {
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
              rolling_period: {
                type: "string",
                description:
                  "Duration string (e.g., '1.5s', '300s') (Part of 'period' - only one field in this group can be set)",
              },
              calendar_period: {
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
              user_labels: {
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
      },
      onEvent: async (input) => {
        const client = await getServiceMonitoringServiceClient(
          input.app.config,
        );

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.service_level_objective_id !== undefined)
          request.service_level_objective_id =
            input.event.inputConfig.service_level_objective_id;
        if (input.event.inputConfig.service_level_objective !== undefined)
          request.service_level_objective =
            input.event.inputConfig.service_level_objective;

        const result = await new Promise<any>((resolve, reject) => {
          client.createServiceLevelObjective(
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
            description:
              "Identifier. Resource name for this `ServiceLevelObjective`. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
          },
          display_name: {
            type: "string",
            description: "Name used for UI elements listing this SLO.",
          },
          service_level_indicator: {
            type: "object",
            properties: {
              basic_sli: {
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
              request_based: {
                type: "object",
                properties: {
                  good_total_ratio: {
                    type: "object",
                    properties: {
                      good_service_filter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                      },
                      bad_service_filter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                      },
                      total_service_filter: {
                        type: "string",
                        description:
                          "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                      },
                    },
                    description:
                      "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                    additionalProperties: true,
                  },
                  distribution_cut: {
                    type: "object",
                    properties: {
                      distribution_filter: {
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
              windows_based: {
                type: "object",
                properties: {
                  good_bad_metric_filter: {
                    type: "string",
                    description:
                      "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` with `ValueType = BOOL`. The window is good if any `true` values appear in the window. (Part of 'window_criterion' - only one field in this group can be set)",
                  },
                  good_total_ratio_threshold: {
                    type: "object",
                    properties: {
                      performance: {
                        type: "object",
                        properties: {
                          good_total_ratio: {
                            type: "object",
                            properties: {
                              good_service_filter: {
                                type: "string",
                                description:
                                  "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying good service provided. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                              },
                              bad_service_filter: {
                                type: "string",
                                description:
                                  "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                              },
                              total_service_filter: {
                                type: "string",
                                description:
                                  "A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) specifying a `TimeSeries` quantifying total demanded service. Must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`.",
                              },
                            },
                            description:
                              "A `TimeSeriesRatio` specifies two `TimeSeries` to use for computing the `good_service / total_service` ratio. The specified `TimeSeries` must have `ValueType = DOUBLE` or `ValueType = INT64` and must have `MetricKind = DELTA` or `MetricKind = CUMULATIVE`. The `TimeSeriesRatio` must specify exactly two of good, bad, and total, and the relationship `good_service + bad_service = total_service` will be assumed. (Part of 'method' - only one field in this group can be set)",
                            additionalProperties: true,
                          },
                          distribution_cut: {
                            type: "object",
                            properties: {
                              distribution_filter: {
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
                      basic_sli_performance: {
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
                  metric_mean_in_range: {
                    type: "object",
                    properties: {
                      time_series: {
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
                  metric_sum_in_range: {
                    type: "object",
                    properties: {
                      time_series: {
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
                  window_period: {
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
          rolling_period: {
            type: "string",
            description:
              "Duration string (e.g., '1.5s', '300s') (Part of 'period' - only one field in this group can be set)",
          },
          calendar_period: {
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
          user_labels: {
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

export default createServiceLevelObjective;
