import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const collectdTimeSeriesCreate: AppBlock = {
  name: "Collectd Time Series - Create",
  description: `Cloud Monitoring Agent only: Creates a new time series.`,
  category: "Collectd Time Series",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The project (https://cloud.google.com/monitoring/api/v3#project_name) in which to create the time series. The format is: projects/[PROJECT_ID_OR_NUMBER] ",
          type: {
            type: "string",
          },
          required: true,
        },
        resource: {
          name: "Resource",
          description:
            "The monitored resource associated with the time series.",
          type: {
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
          required: false,
        },
        collectdVersion: {
          name: "Collectd Version",
          description: "The version of collectd that collected the data.",
          type: {
            type: "string",
            description:
              'The version of collectd that collected the data. Example: "5.3.0-192.el6".',
          },
          required: false,
        },
        collectdPayloads: {
          name: "Collectd Payloads",
          description:
            "The collectd payloads representing the time series data.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                values: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      dataSourceName: {
                        type: "string",
                        description:
                          'The data source for the collectd value. For example, there are two data sources for network measurements: "rx" and "tx".',
                      },
                      dataSourceType: {
                        type: "string",
                        enum: [
                          "UNSPECIFIED_DATA_SOURCE_TYPE",
                          "GAUGE",
                          "COUNTER",
                          "DERIVE",
                          "ABSOLUTE",
                        ],
                        description: "The type of measurement.",
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
                    description:
                      "A single data point from a collectd-based plugin.",
                    additionalProperties: true,
                  },
                  description:
                    "The measured values during this time interval. Each value must have a different data_source_name.",
                },
                startTime: {
                  type: "string",
                  description:
                    "The start time of the interval. (Format: google-datetime)",
                },
                endTime: {
                  type: "string",
                  description:
                    "The end time of the interval. (Format: google-datetime)",
                },
                plugin: {
                  type: "string",
                  description: 'The name of the plugin. Example: "disk".',
                },
                pluginInstance: {
                  type: "string",
                  description:
                    'The instance name of the plugin Example: "hdcl".',
                },
                type: {
                  type: "string",
                  description: 'The measurement type. Example: "memory".',
                },
                typeInstance: {
                  type: "string",
                  description:
                    'The measurement type instance. Example: "used".',
                },
                metadata: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                  description:
                    'The measurement metadata. Example: "process_id" -> 12345',
                },
              },
              description:
                "A collection of data points sent from a collectd-based plugin. See the collectd documentation for more information.",
              additionalProperties: true,
            },
            description:
              "The collectd payloads representing the time series data. You must not include more than a single point for each time series, so no two payloads can have the same values for all of the fields plugin, plugin_instance, type, and type_instance.",
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
        let path = `v3/{+name}/collectdTimeSeries`;

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

        if (input.event.inputConfig.resource !== undefined)
          requestBody.resource = input.event.inputConfig.resource;
        if (input.event.inputConfig.collectdVersion !== undefined)
          requestBody.collectdVersion = input.event.inputConfig.collectdVersion;
        if (input.event.inputConfig.collectdPayloads !== undefined)
          requestBody.collectdPayloads =
            input.event.inputConfig.collectdPayloads;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          payloadErrors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: {
                  type: "integer",
                  description:
                    "The zero-based index in CreateCollectdTimeSeriesRequest.collectd_payloads. (Format: int32)",
                },
                error: {
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
                valueErrors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      index: {
                        type: "integer",
                        description:
                          "The zero-based index in CollectdPayload.values within the parent CreateCollectdTimeSeriesRequest.collectd_payloads. (Format: int32)",
                      },
                      error: {
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
                    },
                    description:
                      "Describes the error status for values that were not written.",
                    additionalProperties: true,
                  },
                  description:
                    "Records the error status for values that were not written due to an error.Failed payloads for which nothing is written will not include partial value errors.",
                },
              },
              description:
                "Describes the error status for payloads that were not written.",
              additionalProperties: true,
            },
            description:
              "Records the error status for points that were not written due to an error in the request.Failed requests for which nothing is written will return an error response instead. Requests where data points were rejected by the backend will set summary instead.",
          },
          summary: {
            type: "object",
            properties: {
              totalPointCount: {
                type: "integer",
                description:
                  "The number of points in the request. (Format: int32)",
              },
              successPointCount: {
                type: "integer",
                description:
                  "The number of points that were successfully written. (Format: int32)",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    status: {
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
                    pointCount: {
                      type: "integer",
                      description:
                        "The number of points that couldn't be written because of status. (Format: int32)",
                    },
                  },
                  description: "Detailed information about an error category.",
                  additionalProperties: true,
                },
                description:
                  "The number of points that failed to be written. Order is not guaranteed.",
              },
            },
            description:
              "Summary of the result of a failed request to write data to a time series.",
            additionalProperties: true,
          },
        },
        description: "The CreateCollectdTimeSeries response.",
        additionalProperties: true,
      },
    },
  },
};

export default collectdTimeSeriesCreate;
