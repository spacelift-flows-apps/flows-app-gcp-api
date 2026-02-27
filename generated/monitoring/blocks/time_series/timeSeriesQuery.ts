import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const timeSeriesQuery: AppBlock = {
  name: "Time Series - Query",
  description: `Queries time series by using Monitoring Query Language (MQL).`,
  category: "Time Series",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The project (https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is: projects/[PROJECT_ID_OR_NUMBER] ",
          type: {
            type: "string",
          },
          required: true,
        },
        query: {
          name: "Query",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The query in the Monitoring Query Language (https://cloud.google.com/monitoring/mql/reference) format. The default time zone is in UTC.",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "A positive number that is the maximum number of time_series_data to return.",
          type: {
            type: "integer",
            description:
              "A positive number that is the maximum number of time_series_data to return. (Format: int32)",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the nextPageToken value returned by a previous call to this method.",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the nextPageToken value returned by a previous call to this method. Using this field causes the method to return additional results from the previous method call.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/monitoring",
              "https://www.googleapis.com/auth/monitoring.read",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://monitoring.googleapis.com/";
        let path = `v3/{+name}/timeSeries:query`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.query !== undefined)
          requestBody.query = input.event.inputConfig.query;
        if (input.event.inputConfig.pageSize !== undefined)
          requestBody.pageSize = input.event.inputConfig.pageSize;
        if (input.event.inputConfig.pageToken !== undefined)
          requestBody.pageToken = input.event.inputConfig.pageToken;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
          );
        }

        const result = await response.json();
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
                      description:
                        "The key for this label. The key must meet the following criteria: Does not exceed 100 characters. Matches the following regular expression: [a-zA-Z][a-zA-Z0-9_]* The first character must be an upper- or lower-case letter. The remaining characters must be letters, digits, or underscores.",
                    },
                    valueType: {
                      type: "string",
                      enum: ["STRING", "BOOL", "INT64"],
                      description:
                        "The type of data that can be assigned to the label.",
                    },
                    description: {
                      type: "string",
                      description:
                        "A human-readable description for the label.",
                    },
                  },
                  description: "A description of a label.",
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
                        "The unit in which time_series point values are reported. unit follows the UCUM format for units as seen in https://unitsofmeasure.org/ucum.html. unit is only valid if value_type is INTEGER, DOUBLE, DISTRIBUTION.",
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
                        description: "A bool label value.",
                      },
                      int64Value: {
                        type: "string",
                        description: "An int64 label value. (Format: int64)",
                      },
                      stringValue: {
                        type: "string",
                        description: "A string label value.",
                      },
                    },
                    description: "A label value.",
                    additionalProperties: true,
                  },
                  description:
                    "The values of the labels in the time series identifier, given in the same order as the label_descriptors field of the TimeSeriesDescriptor associated with this object. Each value must have a value of the type given in the corresponding entry of label_descriptors.",
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
                              description: "A Boolean value: true or false.",
                            },
                            int64Value: {
                              type: "string",
                              description:
                                "A 64-bit integer. Its range is approximately ±9.2x1018. (Format: int64)",
                            },
                            doubleValue: {
                              type: "number",
                              description:
                                "A 64-bit double-precision floating-point number. Its magnitude is approximately ±10±300 and it has 16 significant digits of precision. (Format: double)",
                            },
                            stringValue: {
                              type: "string",
                              description: "A variable-length string value.",
                            },
                            distributionValue: {
                              type: "object",
                              properties: {
                                count: {
                                  type: "string",
                                  description:
                                    "The number of values in the population. Must be non-negative. This value must equal the sum of the values in bucket_counts if a histogram is provided. (Format: int64)",
                                },
                                mean: {
                                  type: "number",
                                  description:
                                    "The arithmetic mean of the values in the population. If count is zero then this field must be zero. (Format: double)",
                                },
                                sumOfSquaredDeviation: {
                                  type: "number",
                                  description:
                                    'The sum of squared deviations from the mean of the values in the population. For values x_i this is: Sum[i=1..n]((x_i - mean)^2) Knuth, "The Art of Computer Programming", Vol. 2, page 232, 3rd edition describes Welford\'s method for accumulating this sum in one pass.If count is zero then this field must be zero. (Format: double)',
                                },
                                range: {
                                  type: "object",
                                  properties: {
                                    min: {
                                      type: "number",
                                      description:
                                        "The minimum of the population values. (Format: double)",
                                    },
                                    max: {
                                      type: "number",
                                      description:
                                        "The maximum of the population values. (Format: double)",
                                    },
                                  },
                                  description:
                                    "The range of the population values.",
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
                                          description:
                                            "Must be greater than 0. (Format: int32)",
                                        },
                                        width: {
                                          type: "number",
                                          description:
                                            "Must be greater than 0. (Format: double)",
                                        },
                                        offset: {
                                          type: "number",
                                          description:
                                            "Lower bound of the first bucket. (Format: double)",
                                        },
                                      },
                                      description:
                                        "Specifies a linear sequence of buckets that all have the same width (except overflow and underflow). Each bucket represents a constant absolute uncertainty on the specific value in the bucket.There are num_finite_buckets + 2 (= N) buckets. Bucket i has the following boundaries:Upper bound (0 <= i < N-1): offset + (width * i).Lower bound (1 <= i < N): offset + (width * (i - 1)).",
                                      additionalProperties: true,
                                    },
                                    exponentialBuckets: {
                                      type: "object",
                                      properties: {
                                        numFiniteBuckets: {
                                          type: "integer",
                                          description:
                                            "Must be greater than 0. (Format: int32)",
                                        },
                                        growthFactor: {
                                          type: "number",
                                          description:
                                            "Must be greater than 1. (Format: double)",
                                        },
                                        scale: {
                                          type: "number",
                                          description:
                                            "Must be greater than 0. (Format: double)",
                                        },
                                      },
                                      description:
                                        "Specifies an exponential sequence of buckets that have a width that is proportional to the value of the lower bound. Each bucket represents a constant relative uncertainty on a specific value in the bucket.There are num_finite_buckets + 2 (= N) buckets. Bucket i has the following boundaries:Upper bound (0 <= i < N-1): scale * (growth_factor ^ i).Lower bound (1 <= i < N): scale * (growth_factor ^ (i - 1)).",
                                      additionalProperties: true,
                                    },
                                    explicitBuckets: {
                                      type: "object",
                                      properties: {
                                        bounds: {
                                          type: "array",
                                          items: {
                                            type: "object",
                                            additionalProperties: true,
                                          },
                                          description:
                                            "The values must be monotonically increasing.",
                                        },
                                      },
                                      description:
                                        "Specifies a set of buckets with arbitrary widths.There are size(bounds) + 1 (= N) buckets. Bucket i has the following boundaries:Upper bound (0 <= i < N-1): boundsi Lower bound (1 <= i < N); boundsi - 1The bounds field must contain at least one element. If bounds has only one element, then there are no finite buckets, and that single element is the common boundary of the overflow and underflow buckets.",
                                      additionalProperties: true,
                                    },
                                  },
                                  description:
                                    "BucketOptions describes the bucket boundaries used to create a histogram for the distribution. The buckets can be in a linear sequence, an exponential sequence, or each bucket can be specified explicitly. BucketOptions does not include the number of values in each bucket.A bucket has an inclusive lower bound and exclusive upper bound for the values that are counted for that bucket. The upper bound of a bucket must be strictly greater than the lower bound. The sequence of N buckets for a distribution consists of an underflow bucket (number 0), zero or more finite buckets (number 1 through N - 2) and an overflow bucket (number N - 1). The buckets are contiguous: the lower bound of bucket i (i > 0) is the same as the upper bound of bucket i - 1. The buckets span the whole range of finite values: lower bound of the underflow bucket is -infinity and the upper bound of the overflow bucket is +infinity. The finite buckets are so-called because both bounds are finite.",
                                  additionalProperties: true,
                                },
                                bucketCounts: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                    description: "Format: int64",
                                  },
                                  description:
                                    "Required in the Cloud Monitoring API v3. The values for each bucket specified in bucket_options. The sum of the values in bucketCounts must equal the value in the count field of the Distribution object. The order of the bucket counts follows the numbering schemes described for the three bucket types. The underflow bucket has number 0; the finite buckets, if any, have numbers 1 through N-2; and the overflow bucket has number N-1. The size of bucket_counts must not be greater than N. If the size is less than N, then the remaining buckets are assigned values of zero.",
                                },
                                exemplars: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      value: {
                                        type: "number",
                                        description:
                                          "Value of the exemplar point. This value determines to which bucket the exemplar belongs. (Format: double)",
                                      },
                                      timestamp: {
                                        type: "string",
                                        description:
                                          "The observation (sampling) time of the above value. (Format: google-datetime)",
                                      },
                                      attachments: {
                                        type: "array",
                                        items: {
                                          type: "object",
                                          additionalProperties: true,
                                        },
                                        description:
                                          "Contextual information about the example value. Examples are:Trace: type.googleapis.com/google.monitoring.v3.SpanContextLiteral string: type.googleapis.com/google.protobuf.StringValueLabels dropped during aggregation: type.googleapis.com/google.monitoring.v3.DroppedLabelsThere may be only a single attachment of any given message type in a single exemplar, and this is enforced by the system.",
                                      },
                                    },
                                    description:
                                      "Exemplars are example points that may be used to annotate aggregated distribution values. They are metadata that gives information about a particular value added to a Distribution bucket, such as a trace ID that was active when a value was added. They may contain further information, such as a example values and timestamps, origin, etc.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Must be in increasing order of value field.",
                                },
                              },
                              description:
                                "Distribution contains summary statistics for a population of values. It optionally contains a histogram representing the distribution of those values across a set of buckets.The summary statistics are the count, mean, sum of the squared deviation from the mean, the minimum, and the maximum of the set of population of values. The histogram is based on a sequence of buckets and gives a count of values that fall into each bucket. The boundaries of the buckets are given either explicitly or by formulas for buckets of fixed or exponentially increasing widths.Although it is not forbidden, it is generally a bad idea to include non-finite values (infinities or NaNs) in the population of values, as this will render the mean and sum_of_squared_deviation fields meaningless.",
                              additionalProperties: true,
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
                              "Required. The end of the time interval. (Format: google-datetime)",
                          },
                          startTime: {
                            type: "string",
                            description:
                              "Optional. The beginning of the time interval. The default value for the start time is the end time. The start time must not be later than the end time. (Format: google-datetime)",
                          },
                        },
                        description:
                          "Describes a time interval: Reads: A half-open time interval. It includes the end time but excludes the start time: (startTime, endTime]. The start time must be specified, must be earlier than the end time, and should be no older than the data retention period for the metric. Writes: A closed time interval. It extends from the start time to the end time, and includes both: [startTime, endTime]. Valid time intervals depend on the MetricKind (https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors#MetricKind) of the metric value. The end time must not be earlier than the start time, and the end time must not be more than 25 hours in the past or more than five minutes in the future. For GAUGE metrics, the startTime value is technically optional; if no value is specified, the start time defaults to the value of the end time, and the interval represents a single point in time. If both start and end times are specified, they must be identical. Such an interval is valid only for GAUGE metrics, which are point-in-time measurements. The end time of a new interval must be at least a millisecond after the end time of the previous interval. For DELTA metrics, the start time and end time must specify a non-zero interval, with subsequent points specifying contiguous and non-overlapping intervals. For DELTA metrics, the start time of the next interval must be at least a millisecond after the end time of the previous interval. For CUMULATIVE metrics, the start time and end time must specify a non-zero interval, with subsequent points specifying the same start time and increasing end times, until an event resets the cumulative value to zero and sets a new start time for the following points. The new start time must be at least a millisecond after the end time of the previous interval. The start time of a new interval must be at least a millisecond after the end time of the previous interval because intervals are closed. If the start time of a new interval is the same as the end time of the previous interval, then data written at the new start time could overwrite data written at the previous end time.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A point's value columns and time interval. Each point has one or more point values corresponding to the entries in point_descriptors field in the TimeSeriesDescriptor associated with this object.",
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
              "If there are more results than have been returned, then this field is set to a non-empty value. To see the additional results, use that value as page_token in the next call to this method.",
          },
          partialErrors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "integer",
                  description:
                    "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
                },
                message: {
                  type: "string",
                  description:
                    "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.",
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: true,
                  },
                  description:
                    "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
                },
              },
              description:
                "The Status type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by gRPC (https://github.com/grpc). Each Status message contains three pieces of data: error code, error message, and error details.You can find out more about this error model and how to work with it in the API Design Guide (https://cloud.google.com/apis/design/errors).",
              additionalProperties: true,
            },
            description:
              "Query execution errors that may have caused the time series data returned to be incomplete. The available data will be available in the response.",
          },
        },
        description:
          "The QueryTimeSeries response. For information about the status of Monitoring Query Language (MQL), see the MQL deprecation notice (https://cloud.google.com/stackdriver/docs/deprecations/mql).",
        additionalProperties: true,
      },
    },
  },
};

export default timeSeriesQuery;
