import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  timeSeries: {
    name: "time_series",
    fields: {
      metadata: {
        name: "metadata",
        fields: {
          systemLabels: "system_labels",
          userLabels: "user_labels",
        },
      },
      metricKind: "metric_kind",
      valueType: "value_type",
      points: {
        name: "points",
        fields: {
          interval: {
            name: "interval",
            fields: {
              endTime: "end_time",
              startTime: "start_time",
            },
          },
          value: {
            name: "value",
            fields: {
              boolValue: "bool_value",
              int64Value: "int64_value",
              doubleValue: "double_value",
              stringValue: "string_value",
              distributionValue: {
                name: "distribution_value",
                fields: {
                  sumOfSquaredDeviation: "sum_of_squared_deviation",
                  bucketOptions: {
                    name: "bucket_options",
                    fields: {
                      linearBuckets: {
                        name: "linear_buckets",
                        fields: {
                          numFiniteBuckets: "num_finite_buckets",
                        },
                      },
                      exponentialBuckets: {
                        name: "exponential_buckets",
                        fields: {
                          numFiniteBuckets: "num_finite_buckets",
                          growthFactor: "growth_factor",
                        },
                      },
                      explicitBuckets: "explicit_buckets",
                    },
                  },
                  bucketCounts: "bucket_counts",
                  exemplars: {
                    name: "exemplars",
                    fields: {
                      attachments: {
                        name: "attachments",
                        fields: {
                          typeUrl: "type_url",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const createServiceTimeSeries: AppBlock = {
  name: "Create Service Time Series",
  description: `Creates or adds data to one or more service time series. A service time series is a time series for a metric from a Google Cloud service. The response is empty if all time series in the request were written. If any time series could not be written, a corresponding failure message is included in the error response. This endpoint rejects writes to user-defined metrics. This method is only for use by Google Cloud services. Use [projects.timeSeries.create][google.monitoring.v3.MetricService.CreateTimeSeries] instead.`,
  category: "Time Series",
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
        timeSeries: {
          name: "Time Series",
          description:
            "Required. The new data to be added to a list of time series. Adds at most one data point to each of several time series.  The new data point must be more recent than any other point in its time series.  Each `TimeSeries` value must fully specify a unique time series by supplying all label values for the metric and the monitored resource.  The maximum number of `TimeSeries` objects per `Create` request is 200.",
          type: {
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
                    systemLabels: {
                      type: "object",
                      additionalProperties: true,
                    },
                    userLabels: {
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
                metricKind: {
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
                          endTime: {
                            type: "string",
                            description:
                              "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                          },
                          startTime: {
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
                          boolValue: {
                            type: "boolean",
                            description:
                              "A Boolean value: `true` or `false`. (Part of 'value' - only one field in this group can be set)",
                          },
                          int64Value: {
                            type: "string",
                            description:
                              "64-bit integer as string (Part of 'value' - only one field in this group can be set)",
                          },
                          doubleValue: {
                            type: "number",
                            description:
                              "A 64-bit double-precision floating-point number. Its magnitude is approximately &plusmn;10<sup>&plusmn;300</sup> and it has 16 significant digits of precision. (Part of 'value' - only one field in this group can be set)",
                          },
                          stringValue: {
                            type: "string",
                            description:
                              "A variable-length string value. (Part of 'value' - only one field in this group can be set)",
                          },
                          distributionValue: {
                            type: "object",
                            properties: {
                              count: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                              mean: {
                                type: "number",
                              },
                              sumOfSquaredDeviation: {
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
                              bucketOptions: {
                                type: "object",
                                properties: {
                                  linearBuckets: {
                                    type: "object",
                                    properties: {
                                      numFiniteBuckets: {
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
                                  exponentialBuckets: {
                                    type: "object",
                                    properties: {
                                      numFiniteBuckets: {
                                        type: "integer",
                                      },
                                      growthFactor: {
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
                                  explicitBuckets: {
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
                              bucketCounts: {
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
                                          typeUrl: {
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
              "Required. The new data to be added to a list of time series. Adds at most one data point to each of several time series.  The new data point must be more recent than any other point in its time series.  Each `TimeSeries` value must fully specify a unique time series by supplying all label values for the metric and the monitored resource.  The maximum number of `TimeSeries` objects per `Create` request is 200.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getMetricServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createServiceTimeSeries(request, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default createServiceTimeSeries;
