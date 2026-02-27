import { AppBlock, events } from "@slflows/sdk/v1";
import { getQueryServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  time_series_descriptor: {
    name: "timeSeriesDescriptor",
    fields: {
      label_descriptors: {
        name: "labelDescriptors",
        fields: {
          value_type: "valueType",
        },
      },
      point_descriptors: {
        name: "pointDescriptors",
        fields: {
          value_type: "valueType",
          metric_kind: "metricKind",
        },
      },
    },
  },
  time_series_data: {
    name: "timeSeriesData",
    fields: {
      label_values: {
        name: "labelValues",
        fields: {
          bool_value: "boolValue",
          int64_value: "int64Value",
          string_value: "stringValue",
        },
      },
      point_data: {
        name: "pointData",
        fields: {
          values: {
            name: "values",
            fields: {
              bool_value: "boolValue",
              int64_value: "int64Value",
              double_value: "doubleValue",
              string_value: "stringValue",
              distribution_value: {
                name: "distributionValue",
                fields: {
                  sum_of_squared_deviation: "sumOfSquaredDeviation",
                  bucket_options: {
                    name: "bucketOptions",
                    fields: {
                      linear_buckets: {
                        name: "linearBuckets",
                        fields: {
                          num_finite_buckets: "numFiniteBuckets",
                        },
                      },
                      exponential_buckets: {
                        name: "exponentialBuckets",
                        fields: {
                          num_finite_buckets: "numFiniteBuckets",
                          growth_factor: "growthFactor",
                        },
                      },
                      explicit_buckets: "explicitBuckets",
                    },
                  },
                  bucket_counts: "bucketCounts",
                  exemplars: {
                    name: "exemplars",
                    fields: {
                      attachments: {
                        name: "attachments",
                        fields: {
                          type_url: "typeUrl",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          time_interval: {
            name: "timeInterval",
            fields: {
              end_time: "endTime",
              start_time: "startTime",
            },
          },
        },
      },
    },
  },
  next_page_token: "nextPageToken",
  partial_errors: {
    name: "partialErrors",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
};

const queryTimeSeries: AppBlock = {
  name: "Query Time Series",
  description: `Queries time series by using Monitoring Query Language (MQL). We recommend using PromQL instead of MQL. For more information about the status of MQL, see the [MQL deprecation notice](https://cloud.google.com/stackdriver/docs/deprecations/mql).`,
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
        query: {
          name: "Query",
          description:
            "Required. The query in the [Monitoring Query Language](https://cloud.google.com/monitoring/mql/reference) format. The default time zone is in UTC.",
          type: {
            type: "string",
            description:
              "Required. The query in the [Monitoring Query Language](https://cloud.google.com/monitoring/mql/reference) format. The default time zone is in UTC.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "A positive number that is the maximum number of time_series_data to return.",
          type: {
            type: "integer",
            description:
              "A positive number that is the maximum number of time_series_data to return.",
          },
          required: false,
        },
        pageToken: {
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
        const client = await getQueryServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.queryTimeSeries(request, (err: any, response: any) => {
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
          timeSeriesDescriptor: {
            type: "object",
            properties: {
              labelDescriptors: {
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
                description: "Descriptors for the labels.",
              },
              pointDescriptors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description: "The value key.",
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
                      description: "The value type.",
                    },
                    metricKind: {
                      type: "string",
                      enum: [
                        "METRIC_KIND_UNSPECIFIED",
                        "GAUGE",
                        "DELTA",
                        "CUMULATIVE",
                      ],
                      description: "The value stream kind.",
                    },
                    unit: {
                      type: "string",
                      description:
                        "The unit in which `time_series` point values are reported. `unit` follows the UCUM format for units as seen in https://unitsofmeasure.org/ucum.html. `unit` is only valid if `value_type` is INTEGER, DOUBLE, DISTRIBUTION.",
                    },
                  },
                  description:
                    "A descriptor for the value columns in a data point.",
                  additionalProperties: true,
                },
                description: "Descriptors for the point data value columns.",
              },
            },
            description:
              "A descriptor for the labels and points in a time series.",
            additionalProperties: true,
          },
          timeSeriesData: {
            type: "array",
            items: {
              type: "object",
              properties: {
                labelValues: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      boolValue: {
                        type: "boolean",
                        description:
                          "A bool label value. (Part of 'value' - only one field in this group can be set)",
                      },
                      int64Value: {
                        type: "string",
                        description:
                          "64-bit integer as string (Part of 'value' - only one field in this group can be set)",
                      },
                      stringValue: {
                        type: "string",
                        description:
                          "A string label value. (Part of 'value' - only one field in this group can be set)",
                      },
                    },
                    description: "A label value.",
                    additionalProperties: true,
                  },
                  description:
                    "The values of the labels in the time series identifier, given in the same order as the `label_descriptors` field of the TimeSeriesDescriptor associated with this object. Each value must have a value of the type given in the corresponding entry of `label_descriptors`.",
                },
                pointData: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      values: {
                        type: "array",
                        items: {
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
                                              description:
                                                "Base64-encoded bytes",
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
                        description: "The values that make up the point.",
                      },
                      timeInterval: {
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
                    },
                    description:
                      "A point's value columns and time interval. Each point has one or more point values corresponding to the entries in `point_descriptors` field in the TimeSeriesDescriptor associated with this object.",
                    additionalProperties: true,
                  },
                  description: "The points in the time series.",
                },
              },
              description:
                "Represents the values of a time series associated with a TimeSeriesDescriptor.",
              additionalProperties: true,
            },
            description: "The time series data.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If there are more results than have been returned, then this field is set to a non-empty value.  To see the additional results, use that value as `page_token` in the next call to this method.",
          },
          partialErrors: {
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
            description:
              "Query execution errors that may have caused the time series data returned to be incomplete. The available data will be available in the response.",
          },
        },
        description:
          "The `QueryTimeSeries` response. For information about the status of Monitoring Query Language (MQL), see the [MQL deprecation notice](https://cloud.google.com/stackdriver/docs/deprecations/mql).",
        additionalProperties: true,
      },
    },
  },
};

export default queryTimeSeries;
