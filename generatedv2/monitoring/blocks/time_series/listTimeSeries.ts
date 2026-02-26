import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient } from "../../lib/grpcClient.ts";

const listTimeSeries: AppBlock = {
  name: "List Time Series",
  description: `Lists time series that match a filter.`,
  category: "Time Series",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name), organization or folder on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]     organizations/[ORGANIZATION_ID]     folders/[FOLDER_ID]",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name), organization or folder on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]     organizations/[ORGANIZATION_ID]     folders/[FOLDER_ID]",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'Required. A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) that specifies which time series should be returned.  The filter must specify a single metric type, and can additionally specify metric labels and other information. For example:      metric.type = "compute.googleapis.com/instance/cpu/usage_time" AND         metric.labels.instance_name = "my-instance-name"',
          type: {
            type: "string",
            description:
              'Required. A [monitoring filter](https://cloud.google.com/monitoring/api/v3/filters) that specifies which time series should be returned.  The filter must specify a single metric type, and can additionally specify metric labels and other information. For example:      metric.type = "compute.googleapis.com/instance/cpu/usage_time" AND         metric.labels.instance_name = "my-instance-name"',
          },
          required: true,
        },
        interval: {
          name: "Interval",
          description:
            "Required. The time interval for which results should be returned. Only time series that contain data points in the specified interval are included in the response.",
          type: {
            type: "object",
            properties: {
              end_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              start_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
            },
            description:
              "Describes a time interval:    * Reads: A half-open time interval. It includes the end time but     excludes the start time: `(startTime, endTime]`. The start time     must be specified, must be earlier than the end time, and should be     no older than the data retention period for the metric.   * Writes: A closed time interval. It extends from the start time to the end   time,     and includes both: `[startTime, endTime]`. Valid time intervals     depend on the     [`MetricKind`](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors#MetricKind)     of the metric value. The end time must not be earlier than the start     time, and the end time must not be more than 25 hours in the past or more     than five minutes in the future.     * For `GAUGE` metrics, the `startTime` value is technically optional; if       no value is specified, the start time defaults to the value of the       end time, and the interval represents a single point in time. If both       start and end times are specified, they must be identical. Such an       interval is valid only for `GAUGE` metrics, which are point-in-time       measurements. The end time of a new interval must be at least a       millisecond after the end time of the previous interval.     * For `DELTA` metrics, the start time and end time must specify a       non-zero interval, with subsequent points specifying contiguous and       non-overlapping intervals. For `DELTA` metrics, the start time of       the next interval must be at least a millisecond after the end time       of the previous interval.     * For `CUMULATIVE` metrics, the start time and end time must specify a       non-zero interval, with subsequent points specifying the same       start time and increasing end times, until an event resets the       cumulative value to zero and sets a new start time for the following       points. The new start time must be at least a millisecond after the       end time of the previous interval.     * The start time of a new interval must be at least a millisecond after     the       end time of the previous interval because intervals are closed. If the       start time of a new interval is the same as the end time of the       previous interval, then data written at the new start time could       overwrite data written at the previous end time.",
            additionalProperties: true,
          },
          required: true,
        },
        aggregation: {
          name: "Aggregation",
          description:
            "Specifies the alignment of data points in individual time series as well as how to combine the retrieved time series across specified labels.  By default (if no `aggregation` is explicitly specified), the raw time series data is returned.",
          type: {
            type: "object",
            properties: {
              alignment_period: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              per_series_aligner: {
                type: "string",
                enum: [
                  "ALIGN_NONE",
                  "ALIGN_DELTA",
                  "ALIGN_RATE",
                  "ALIGN_INTERPOLATE",
                  "ALIGN_NEXT_OLDER",
                  "ALIGN_MIN",
                  "ALIGN_MAX",
                  "ALIGN_MEAN",
                  "ALIGN_COUNT",
                  "ALIGN_SUM",
                  "ALIGN_STDDEV",
                  "ALIGN_COUNT_TRUE",
                  "ALIGN_COUNT_FALSE",
                  "ALIGN_FRACTION_TRUE",
                  "ALIGN_PERCENTILE_99",
                  "ALIGN_PERCENTILE_95",
                  "ALIGN_PERCENTILE_50",
                  "ALIGN_PERCENTILE_05",
                  "ALIGN_PERCENT_CHANGE",
                ],
                description:
                  "An `Aligner` describes how to bring the data points in a single time series into temporal alignment. Except for `ALIGN_NONE`, all alignments cause all the data points in an `alignment_period` to be mathematically grouped together, resulting in a single data point for each `alignment_period` with end timestamp at the end of the period.  Not all alignment operations may be applied to all time series. The valid choices depend on the `metric_kind` and `value_type` of the original time series. Alignment can change the `metric_kind` or the `value_type` of the time series.  Time series data must be aligned in order to perform cross-time series reduction. If `cross_series_reducer` is specified, then `per_series_aligner` must be specified and not equal to `ALIGN_NONE` and `alignment_period` must be specified; otherwise, an error is returned.",
              },
              cross_series_reducer: {
                type: "string",
                enum: [
                  "REDUCE_NONE",
                  "REDUCE_MEAN",
                  "REDUCE_MIN",
                  "REDUCE_MAX",
                  "REDUCE_SUM",
                  "REDUCE_STDDEV",
                  "REDUCE_COUNT",
                  "REDUCE_COUNT_TRUE",
                  "REDUCE_COUNT_FALSE",
                  "REDUCE_FRACTION_TRUE",
                  "REDUCE_PERCENTILE_99",
                  "REDUCE_PERCENTILE_95",
                  "REDUCE_PERCENTILE_50",
                  "REDUCE_PERCENTILE_05",
                ],
                description:
                  "The reduction operation to be used to combine time series into a single time series, where the value of each data point in the resulting series is a function of all the already aligned values in the input time series.  Not all reducer operations can be applied to all time series. The valid choices depend on the `metric_kind` and the `value_type` of the original time series. Reduction can yield a time series with a different `metric_kind` or `value_type` than the input time series.  Time series data must first be aligned (see `per_series_aligner`) in order to perform cross-time series reduction. If `cross_series_reducer` is specified, then `per_series_aligner` must be specified, and must not be `ALIGN_NONE`. An `alignment_period` must also be specified; otherwise, an error is returned.",
              },
              group_by_fields: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The set of fields to preserve when `cross_series_reducer` is specified. The `group_by_fields` determine how the time series are partitioned into subsets prior to applying the aggregation operation. Each subset contains time series that have the same value for each of the grouping fields. Each individual time series is a member of exactly one subset. The `cross_series_reducer` is applied to each subset of time series. It is not possible to reduce across different resource types, so this field implicitly contains `resource.type`.  Fields not specified in `group_by_fields` are aggregated away.  If `group_by_fields` is not specified and all the time series have the same resource type, then the time series are aggregated into a single output time series. If `cross_series_reducer` is not defined, this field is ignored.",
              },
            },
            description:
              'Describes how to combine multiple time series to provide a different view of the data.  Aggregation of time series is done in two steps. First, each time series in the set is _aligned_ to the same time interval boundaries, then the set of time series is optionally _reduced_ in number.  Alignment consists of applying the `per_series_aligner` operation to each time series after its data has been divided into regular `alignment_period` time intervals. This process takes _all_ of the data points in an alignment period, applies a mathematical transformation such as averaging, minimum, maximum, delta, etc., and converts them into a single data point per period.  Reduction is when the aligned and transformed time series can optionally be combined, reducing the number of time series through similar mathematical transformations. Reduction involves applying a `cross_series_reducer` to all the time series, optionally sorting the time series into subsets with `group_by_fields`, and applying the reducer to each subset.  The raw time series data can contain a huge amount of information from multiple sources. Alignment and reduction transforms this mass of data into a more manageable and representative collection of data, for example "the 95% latency across the average of all tasks in a cluster". This representative data can be more easily graphed and comprehended, and the individual time series data is still available for later drilldown. For more details, see [Filtering and aggregation](https://cloud.google.com/monitoring/api/v3/aggregation).',
            additionalProperties: true,
          },
          required: false,
        },
        secondary_aggregation: {
          name: "Secondary Aggregation",
          description:
            "Apply a second aggregation after `aggregation` is applied. May only be specified if `aggregation` is specified.",
          type: {
            type: "object",
            properties: {
              alignment_period: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              per_series_aligner: {
                type: "string",
                enum: [
                  "ALIGN_NONE",
                  "ALIGN_DELTA",
                  "ALIGN_RATE",
                  "ALIGN_INTERPOLATE",
                  "ALIGN_NEXT_OLDER",
                  "ALIGN_MIN",
                  "ALIGN_MAX",
                  "ALIGN_MEAN",
                  "ALIGN_COUNT",
                  "ALIGN_SUM",
                  "ALIGN_STDDEV",
                  "ALIGN_COUNT_TRUE",
                  "ALIGN_COUNT_FALSE",
                  "ALIGN_FRACTION_TRUE",
                  "ALIGN_PERCENTILE_99",
                  "ALIGN_PERCENTILE_95",
                  "ALIGN_PERCENTILE_50",
                  "ALIGN_PERCENTILE_05",
                  "ALIGN_PERCENT_CHANGE",
                ],
                description:
                  "An `Aligner` describes how to bring the data points in a single time series into temporal alignment. Except for `ALIGN_NONE`, all alignments cause all the data points in an `alignment_period` to be mathematically grouped together, resulting in a single data point for each `alignment_period` with end timestamp at the end of the period.  Not all alignment operations may be applied to all time series. The valid choices depend on the `metric_kind` and `value_type` of the original time series. Alignment can change the `metric_kind` or the `value_type` of the time series.  Time series data must be aligned in order to perform cross-time series reduction. If `cross_series_reducer` is specified, then `per_series_aligner` must be specified and not equal to `ALIGN_NONE` and `alignment_period` must be specified; otherwise, an error is returned.",
              },
              cross_series_reducer: {
                type: "string",
                enum: [
                  "REDUCE_NONE",
                  "REDUCE_MEAN",
                  "REDUCE_MIN",
                  "REDUCE_MAX",
                  "REDUCE_SUM",
                  "REDUCE_STDDEV",
                  "REDUCE_COUNT",
                  "REDUCE_COUNT_TRUE",
                  "REDUCE_COUNT_FALSE",
                  "REDUCE_FRACTION_TRUE",
                  "REDUCE_PERCENTILE_99",
                  "REDUCE_PERCENTILE_95",
                  "REDUCE_PERCENTILE_50",
                  "REDUCE_PERCENTILE_05",
                ],
                description:
                  "The reduction operation to be used to combine time series into a single time series, where the value of each data point in the resulting series is a function of all the already aligned values in the input time series.  Not all reducer operations can be applied to all time series. The valid choices depend on the `metric_kind` and the `value_type` of the original time series. Reduction can yield a time series with a different `metric_kind` or `value_type` than the input time series.  Time series data must first be aligned (see `per_series_aligner`) in order to perform cross-time series reduction. If `cross_series_reducer` is specified, then `per_series_aligner` must be specified, and must not be `ALIGN_NONE`. An `alignment_period` must also be specified; otherwise, an error is returned.",
              },
              group_by_fields: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The set of fields to preserve when `cross_series_reducer` is specified. The `group_by_fields` determine how the time series are partitioned into subsets prior to applying the aggregation operation. Each subset contains time series that have the same value for each of the grouping fields. Each individual time series is a member of exactly one subset. The `cross_series_reducer` is applied to each subset of time series. It is not possible to reduce across different resource types, so this field implicitly contains `resource.type`.  Fields not specified in `group_by_fields` are aggregated away.  If `group_by_fields` is not specified and all the time series have the same resource type, then the time series are aggregated into a single output time series. If `cross_series_reducer` is not defined, this field is ignored.",
              },
            },
            description:
              'Describes how to combine multiple time series to provide a different view of the data.  Aggregation of time series is done in two steps. First, each time series in the set is _aligned_ to the same time interval boundaries, then the set of time series is optionally _reduced_ in number.  Alignment consists of applying the `per_series_aligner` operation to each time series after its data has been divided into regular `alignment_period` time intervals. This process takes _all_ of the data points in an alignment period, applies a mathematical transformation such as averaging, minimum, maximum, delta, etc., and converts them into a single data point per period.  Reduction is when the aligned and transformed time series can optionally be combined, reducing the number of time series through similar mathematical transformations. Reduction involves applying a `cross_series_reducer` to all the time series, optionally sorting the time series into subsets with `group_by_fields`, and applying the reducer to each subset.  The raw time series data can contain a huge amount of information from multiple sources. Alignment and reduction transforms this mass of data into a more manageable and representative collection of data, for example "the 95% latency across the average of all tasks in a cluster". This representative data can be more easily graphed and comprehended, and the individual time series data is still available for later drilldown. For more details, see [Filtering and aggregation](https://cloud.google.com/monitoring/api/v3/aggregation).',
            additionalProperties: true,
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            "Unsupported: must be left blank. The points in each time series are currently returned in reverse time order (most recent to oldest).",
          type: {
            type: "string",
            description:
              "Unsupported: must be left blank. The points in each time series are currently returned in reverse time order (most recent to oldest).",
          },
          required: false,
        },
        view: {
          name: "View",
          description:
            "Required. Specifies which information is returned about the time series.",
          type: {
            type: "string",
            enum: ["FULL", "HEADERS"],
            description:
              "Required. Specifies which information is returned about the time series.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "A positive number that is the maximum number of results to return. If `page_size` is empty or more than 100,000 results, the effective `page_size` is 100,000 results. If `view` is set to `FULL`, this is the maximum number of `Points` returned. If `view` is set to `HEADERS`, this is the maximum number of `TimeSeries` returned.",
          type: {
            type: "integer",
            description:
              "A positive number that is the maximum number of results to return. If `page_size` is empty or more than 100,000 results, the effective `page_size` is 100,000 results. If `view` is set to `FULL`, this is the maximum number of `Points` returned. If `view` is set to `HEADERS`, this is the maximum number of `TimeSeries` returned.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getMetricServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.interval !== undefined)
          request.interval = input.event.inputConfig.interval;
        if (input.event.inputConfig.aggregation !== undefined)
          request.aggregation = input.event.inputConfig.aggregation;
        if (input.event.inputConfig.secondary_aggregation !== undefined)
          request.secondary_aggregation =
            input.event.inputConfig.secondary_aggregation;
        if (input.event.inputConfig.order_by !== undefined)
          request.order_by = input.event.inputConfig.order_by;
        if (input.event.inputConfig.view !== undefined)
          request.view = input.event.inputConfig.view;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listTimeSeries(request, (err: any, response: any) => {
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
          time_series: {
            type: "array",
            items: {
              type: "object",
              properties: {
                metric: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                    },
                  },
                  additionalProperties: true,
                  description:
                    "The associated metric. A fully-specified metric used to identify the time series.",
                },
                resource: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                    },
                  },
                  additionalProperties: true,
                  description:
                    "The associated monitored resource.  Custom metrics can use only certain monitored resource types in their time series data. For more information, see [Monitored resources for custom metrics](https://cloud.google.com/monitoring/custom-metrics/creating-metrics#custom-metric-resources).",
                },
                metadata: {
                  type: "object",
                  properties: {
                    system_labels: {
                      type: "object",
                      additionalProperties: true,
                    },
                    user_labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. The associated monitored resource metadata. When reading a time series, this field will include metadata labels that are explicitly named in the reduction. When creating a time series, this field is ignored.",
                },
                metric_kind: {
                  type: "string",
                  enum: [
                    "METRIC_KIND_UNSPECIFIED",
                    "GAUGE",
                    "DELTA",
                    "CUMULATIVE",
                  ],
                  description:
                    "The metric kind of the time series. When listing time series, this metric kind might be different from the metric kind of the associated metric if this time series is an alignment or reduction of other time series.  When creating a time series, this field is optional. If present, it must be the same as the metric kind of the associated metric. If the associated metric's descriptor must be auto-created, then this field specifies the metric kind of the new descriptor and must be either `GAUGE` (the default) or `CUMULATIVE`.",
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
                  description:
                    "The value type of the time series. When listing time series, this value type might be different from the value type of the associated metric if this time series is an alignment or reduction of other time series.  When creating a time series, this field is optional. If present, it must be the same as the type of the data in the `points` field.",
                },
                points: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      interval: {
                        type: "object",
                        properties: {
                          end_time: {
                            type: "string",
                            description:
                              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                          },
                          start_time: {
                            type: "string",
                            description:
                              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                          },
                        },
                        description:
                          "Describes a time interval:    * Reads: A half-open time interval. It includes the end time but     excludes the start time: `(startTime, endTime]`. The start time     must be specified, must be earlier than the end time, and should be     no older than the data retention period for the metric.   * Writes: A closed time interval. It extends from the start time to the end   time,     and includes both: `[startTime, endTime]`. Valid time intervals     depend on the     [`MetricKind`](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors#MetricKind)     of the metric value. The end time must not be earlier than the start     time, and the end time must not be more than 25 hours in the past or more     than five minutes in the future.     * For `GAUGE` metrics, the `startTime` value is technically optional; if       no value is specified, the start time defaults to the value of the       end time, and the interval represents a single point in time. If both       start and end times are specified, they must be identical. Such an       interval is valid only for `GAUGE` metrics, which are point-in-time       measurements. The end time of a new interval must be at least a       millisecond after the end time of the previous interval.     * For `DELTA` metrics, the start time and end time must specify a       non-zero interval, with subsequent points specifying contiguous and       non-overlapping intervals. For `DELTA` metrics, the start time of       the next interval must be at least a millisecond after the end time       of the previous interval.     * For `CUMULATIVE` metrics, the start time and end time must specify a       non-zero interval, with subsequent points specifying the same       start time and increasing end times, until an event resets the       cumulative value to zero and sets a new start time for the following       points. The new start time must be at least a millisecond after the       end time of the previous interval.     * The start time of a new interval must be at least a millisecond after     the       end time of the previous interval because intervals are closed. If the       start time of a new interval is the same as the end time of the       previous interval, then data written at the new start time could       overwrite data written at the previous end time.",
                        additionalProperties: true,
                      },
                      value: {
                        type: "object",
                        properties: {
                          bool_value: {
                            type: "boolean",
                            description:
                              "A Boolean value: `true` or `false`. (Part of 'value' - only one field in this group can be set)",
                          },
                          int64_value: {
                            type: "string",
                            description:
                              "64-bit integer as string (Part of 'value' - only one field in this group can be set)",
                          },
                          double_value: {
                            type: "number",
                            description:
                              "A 64-bit double-precision floating-point number. Its magnitude is approximately &plusmn;10<sup>&plusmn;300</sup> and it has 16 significant digits of precision. (Part of 'value' - only one field in this group can be set)",
                          },
                          string_value: {
                            type: "string",
                            description:
                              "A variable-length string value. (Part of 'value' - only one field in this group can be set)",
                          },
                          distribution_value: {
                            type: "object",
                            properties: {
                              count: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              mean: {
                                type: "number",
                              },
                              sum_of_squared_deviation: {
                                type: "number",
                              },
                              range: {
                                type: "object",
                                properties: {
                                  min: {
                                    type: "number",
                                  },
                                  max: {
                                    type: "number",
                                  },
                                },
                                description:
                                  "Range of numerical values within `min` and `max`.",
                                additionalProperties: true,
                              },
                              bucket_options: {
                                type: "object",
                                properties: {
                                  linear_buckets: {
                                    type: "object",
                                    properties: {
                                      num_finite_buckets: {
                                        type: "integer",
                                      },
                                      width: {
                                        type: "number",
                                      },
                                      offset: {
                                        type: "number",
                                      },
                                    },
                                    additionalProperties: true,
                                    description:
                                      "(Part of 'options' - only one field in this group can be set)",
                                  },
                                  exponential_buckets: {
                                    type: "object",
                                    properties: {
                                      num_finite_buckets: {
                                        type: "integer",
                                      },
                                      growth_factor: {
                                        type: "number",
                                      },
                                      scale: {
                                        type: "number",
                                      },
                                    },
                                    additionalProperties: true,
                                    description:
                                      "(Part of 'options' - only one field in this group can be set)",
                                  },
                                  explicit_buckets: {
                                    type: "object",
                                    properties: {
                                      bounds: {
                                        type: "array",
                                        items: {
                                          type: "number",
                                        },
                                      },
                                    },
                                    additionalProperties: true,
                                    description:
                                      "(Part of 'options' - only one field in this group can be set)",
                                  },
                                },
                                additionalProperties: true,
                              },
                              bucket_counts: {
                                type: "array",
                                items: {
                                  type: "string",
                                  description: "64-bit integer as string",
                                },
                              },
                              exemplars: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    value: {
                                      type: "number",
                                    },
                                    timestamp: {
                                      type: "string",
                                      description:
                                        "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                                    },
                                    attachments: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          type_url: {
                                            type: "string",
                                          },
                                          value: {
                                            type: "string",
                                            description: "Base64-encoded bytes",
                                          },
                                        },
                                        additionalProperties: true,
                                      },
                                    },
                                  },
                                  additionalProperties: true,
                                },
                              },
                            },
                            additionalProperties: true,
                            description:
                              "A distribution value. (Part of 'value' - only one field in this group can be set)",
                          },
                        },
                        description: "A single strongly-typed value.",
                        additionalProperties: true,
                      },
                    },
                    description: "A single data point in a time series.",
                    additionalProperties: true,
                  },
                  description:
                    "The data points of this time series. When listing time series, points are returned in reverse time order.  When creating a time series, this field must contain exactly one point and the point's type must be the same as the value type of the associated metric. If the associated metric's descriptor must be auto-created, then the value type of the descriptor is determined by the point's type, which must be `BOOL`, `INT64`, `DOUBLE`, or `DISTRIBUTION`.",
                },
                unit: {
                  type: "string",
                  description:
                    "The units in which the metric value is reported. It is only applicable if the `value_type` is `INT64`, `DOUBLE`, or `DISTRIBUTION`. The `unit` defines the representation of the stored metric values. This field can only be changed through CreateTimeSeries when it is empty.",
                },
                description: {
                  type: "string",
                  description:
                    "Input only. A detailed description of the time series that will be associated with the [google.api.MetricDescriptor][google.api.MetricDescriptor] for the metric. Once set, this field cannot be changed through CreateTimeSeries.",
                },
              },
              description:
                "A collection of data points that describes the time-varying values of a metric. A time series is identified by a combination of a fully-specified monitored resource and a fully-specified metric. This type is used for both listing and creating time series.",
              additionalProperties: true,
            },
            description:
              "One or more time series that match the filter included in the request.",
          },
          next_page_token: {
            type: "string",
            description:
              "If there are more results than have been returned, then this field is set to a non-empty value.  To see the additional results, use that value as `page_token` in the next call to this method.",
          },
          execution_errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "integer",
                },
                message: {
                  type: "string",
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type_url: {
                        type: "string",
                      },
                      value: {
                        type: "string",
                        description: "Base64-encoded bytes",
                      },
                    },
                    additionalProperties: true,
                  },
                },
              },
              additionalProperties: true,
            },
            description:
              "Query execution errors that may have caused the time series data returned to be incomplete.",
          },
          unit: {
            type: "string",
            description:
              'The unit in which all `time_series` point values are reported. `unit` follows the UCUM format for units as seen in https://unitsofmeasure.org/ucum.html. If different `time_series` have different units (for example, because they come from different metric types, or a unit is absent), then `unit` will be "{not_a_unit}".',
          },
        },
        description: "The `ListTimeSeries` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listTimeSeries;
