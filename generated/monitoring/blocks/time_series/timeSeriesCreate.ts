import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const timeSeriesCreate: AppBlock = {
  name: "Time Series - Create",
  description: `Creates or adds data to one or more time series.`,
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
        timeSeries: {
          name: "Time Series",
          description: "Required.",
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
                      description:
                        "An existing metric type, see google.api.MetricDescriptor. For example, custom.googleapis.com/invoice/paid/amount.",
                    },
                    labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "The set of label values that uniquely identify this metric. All labels listed in the MetricDescriptor must be assigned values.",
                    },
                  },
                  description:
                    "A specific metric, identified by specifying values for all of the labels of a MetricDescriptor.",
                  additionalProperties: true,
                },
                resource: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      description:
                        "Required. The monitored resource type. This field must match the type field of a MonitoredResourceDescriptor object. For example, the type of a Compute Engine VM instance is gce_instance. For a list of types, see Monitoring resource types (https://cloud.google.com/monitoring/api/resources) and Logging resource types (https://cloud.google.com/logging/docs/api/v2/resource-list).",
                    },
                    labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        'Required. Values for all of the labels listed in the associated monitored resource descriptor. For example, Compute Engine VM instances use the labels "project_id", "instance_id", and "zone".',
                    },
                  },
                  description:
                    'An object representing a resource that can be used for monitoring, logging, billing, or other purposes. Examples include virtual machine instances, databases, and storage devices such as disks. The type field identifies a MonitoredResourceDescriptor object that describes the resource\'s schema. Information in the labels field identifies the actual resource and its attributes according to the schema. For example, a particular Compute Engine VM instance could be represented by the following object, because the MonitoredResourceDescriptor for "gce_instance" has labels "project_id", "instance_id" and "zone": { "type": "gce_instance", "labels": { "project_id": "my-project", "instance_id": "12345678901234", "zone": "us-central1-a" }}',
                  additionalProperties: true,
                },
                metadata: {
                  type: "object",
                  properties: {
                    systemLabels: {
                      type: "object",
                      additionalProperties: true,
                      description:
                        'Output only. Values for predefined system metadata labels. System labels are a kind of metadata extracted by Google, including "machine_image", "vpc", "subnet_id", "security_group", "name", etc. System label values can be only strings, Boolean values, or a list of strings. For example: { "name": "my-test-instance", "security_group": ["a", "b", "c"], "spot_instance": false }',
                    },
                    userLabels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Output only. A map of user-defined metadata labels.",
                    },
                  },
                  description:
                    "Auxiliary metadata for a MonitoredResource object. MonitoredResource objects contain the minimum set of information to uniquely identify a monitored resource instance. There is some other useful auxiliary metadata. Monitoring and Logging use an ingestion pipeline to extract metadata for cloud resources of all types, and store the metadata in this message.",
                  additionalProperties: true,
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
                    "The metric kind of the time series. When listing time series, this metric kind might be different from the metric kind of the associated metric if this time series is an alignment or reduction of other time series.When creating a time series, this field is optional. If present, it must be the same as the metric kind of the associated metric. If the associated metric's descriptor must be auto-created, then this field specifies the metric kind of the new descriptor and must be either GAUGE (the default) or CUMULATIVE.",
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
                    "The value type of the time series. When listing time series, this value type might be different from the value type of the associated metric if this time series is an alignment or reduction of other time series.When creating a time series, this field is optional. If present, it must be the same as the type of the data in the points field.",
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
                      value: {
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
                                          type: "number",
                                          description: "Format: double",
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
                    },
                    description: "A single data point in a time series.",
                    additionalProperties: true,
                  },
                  description:
                    "The data points of this time series. When listing time series, points are returned in reverse time order.When creating a time series, this field must contain exactly one point and the point's type must be the same as the value type of the associated metric. If the associated metric's descriptor must be auto-created, then the value type of the descriptor is determined by the point's type, which must be BOOL, INT64, DOUBLE, or DISTRIBUTION.",
                },
                unit: {
                  type: "string",
                  description:
                    "The units in which the metric value is reported. It is only applicable if the value_type is INT64, DOUBLE, or DISTRIBUTION. The unit defines the representation of the stored metric values. This field can only be changed through CreateTimeSeries when it is empty.",
                },
                description: {
                  type: "string",
                  description:
                    "Input only. A detailed description of the time series that will be associated with the google.api.MetricDescriptor for the metric. Once set, this field cannot be changed through CreateTimeSeries.",
                },
              },
              description:
                "A collection of data points that describes the time-varying values of a metric. A time series is identified by a combination of a fully-specified monitored resource and a fully-specified metric. This type is used for both listing and creating time series.",
              additionalProperties: true,
            },
            description:
              "Required. The new data to be added to a list of time series. Adds at most one data point to each of several time series. The new data point must be more recent than any other point in its time series. Each TimeSeries value must fully specify a unique time series by supplying all label values for the metric and the monitored resource.The maximum number of TimeSeries objects per Create request is 200.",
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
              "https://www.googleapis.com/auth/monitoring.write",
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
        let path = `v3/{+name}/timeSeries`;

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

        if (input.event.inputConfig.timeSeries !== undefined)
          requestBody.timeSeries = input.event.inputConfig.timeSeries;

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
        properties: {},
        description:
          "A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); }",
        additionalProperties: true,
      },
    },
  },
};

export default timeSeriesCreate;
