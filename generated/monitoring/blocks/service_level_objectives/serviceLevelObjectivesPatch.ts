import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const serviceLevelObjectivesPatch: AppBlock = {
  name: "Service Level Objectives - Patch",
  description: `Update the given ServiceLevelObjective.`,
  category: "Service Level Objectives",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Identifier.",
          type: {
            type: "string",
            description:
              "Identifier. Resource name for this ServiceLevelObjective. The format is: projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
          },
          required: false,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "A set of field paths defining which fields to use for the update.",
          type: {
            type: "string",
          },
          required: false,
        },
        displayName: {
          name: "Display Name",
          description: "Name used for UI elements listing this SLO.",
          type: {
            type: "string",
            description: "Name used for UI elements listing this SLO.",
          },
          required: false,
        },
        serviceLevelIndicator: {
          name: "Service Level Indicator",
          description:
            "The definition of good service, used to measure and calculate the quality of the Service's performance with respect to a single aspect of service quality.",
          type: {
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
                    description: "Future parameters for the availability SLI.",
                    additionalProperties: true,
                  },
                  latency: {
                    type: "object",
                    properties: {
                      threshold: {
                        type: "string",
                        description:
                          "Good service is defined to be the count of requests made to this service that return in no more than threshold. (Format: google-duration)",
                      },
                    },
                    description: "Parameters for a latency threshold SLI.",
                    additionalProperties: true,
                  },
                },
                description:
                  "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the service_resource determines the metrics to use and the service_resource.labels and metric_labels are used to construct a monitoring filter to filter that metric down to just the data relevant to this service.",
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
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying good service provided. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                      badServiceFilter: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                      totalServiceFilter: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying total demanded service. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                    },
                    description:
                      "A TimeSeriesRatio specifies two TimeSeries to use for computing the good_service / total_service ratio. The specified TimeSeries must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE. The TimeSeriesRatio must specify exactly two of good, bad, and total, and the relationship good_service + bad_service = total_service will be assumed.",
                    additionalProperties: true,
                  },
                  distributionCut: {
                    type: "object",
                    properties: {
                      distributionFilter: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries aggregating values. Must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum. (Format: double)",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum. (Format: double)",
                          },
                        },
                        description:
                          "Range of numerical values within min and max.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A DistributionCut defines a TimeSeries and thresholds used for measuring good service and total service. The TimeSeries must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE. The computed good_service will be the estimated count of values in the Distribution that fall within the specified min and max.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Service Level Indicators for which atomic units of service are counted directly.",
                additionalProperties: true,
              },
              windowsBased: {
                type: "object",
                properties: {
                  goodBadMetricFilter: {
                    type: "string",
                    description:
                      "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries with ValueType = BOOL. The window is good if any true values appear in the window.",
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
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying good service provided. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                              badServiceFilter: {
                                type: "string",
                                description:
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                              totalServiceFilter: {
                                type: "string",
                                description:
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying total demanded service. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                            },
                            description:
                              "A TimeSeriesRatio specifies two TimeSeries to use for computing the good_service / total_service ratio. The specified TimeSeries must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE. The TimeSeriesRatio must specify exactly two of good, bad, and total, and the relationship good_service + bad_service = total_service will be assumed.",
                            additionalProperties: true,
                          },
                          distributionCut: {
                            type: "object",
                            properties: {
                              distributionFilter: {
                                type: "string",
                                description:
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries aggregating values. Must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                              range: {
                                type: "object",
                                properties: {
                                  min: {
                                    type: "number",
                                    description:
                                      "Range minimum. (Format: double)",
                                  },
                                  max: {
                                    type: "number",
                                    description:
                                      "Range maximum. (Format: double)",
                                  },
                                },
                                description:
                                  "Range of numerical values within min and max.",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "A DistributionCut defines a TimeSeries and thresholds used for measuring good service and total service. The TimeSeries must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE. The computed good_service will be the estimated count of values in the Distribution that fall within the specified min and max.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "Service Level Indicators for which atomic units of service are counted directly.",
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
                              "Future parameters for the availability SLI.",
                            additionalProperties: true,
                          },
                          latency: {
                            type: "object",
                            properties: {
                              threshold: {
                                type: "string",
                                description:
                                  "Good service is defined to be the count of requests made to this service that return in no more than threshold. (Format: google-duration)",
                              },
                            },
                            description:
                              "Parameters for a latency threshold SLI.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the service_resource determines the metrics to use and the service_resource.labels and metric_labels are used to construct a monitoring filter to filter that metric down to just the data relevant to this service.",
                        additionalProperties: true,
                      },
                      threshold: {
                        type: "number",
                        description:
                          "If window performance >= threshold, the window is counted as good. (Format: double)",
                      },
                    },
                    description:
                      "A PerformanceThreshold is used when each window is good when that window has a sufficiently high performance.",
                    additionalProperties: true,
                  },
                  metricMeanInRange: {
                    type: "object",
                    properties: {
                      timeSeries: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying the TimeSeries to use for evaluating window quality.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum. (Format: double)",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum. (Format: double)",
                          },
                        },
                        description:
                          "Range of numerical values within min and max.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A MetricRange is used when each window is good when the value x of a single TimeSeries satisfies range.min <= x <= range.max. The provided TimeSeries must have ValueType = INT64 or ValueType = DOUBLE and MetricKind = GAUGE.",
                    additionalProperties: true,
                  },
                  metricSumInRange: {
                    type: "object",
                    properties: {
                      timeSeries: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying the TimeSeries to use for evaluating window quality.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum. (Format: double)",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum. (Format: double)",
                          },
                        },
                        description:
                          "Range of numerical values within min and max.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A MetricRange is used when each window is good when the value x of a single TimeSeries satisfies range.min <= x <= range.max. The provided TimeSeries must have ValueType = INT64 or ValueType = DOUBLE and MetricKind = GAUGE.",
                    additionalProperties: true,
                  },
                  windowPeriod: {
                    type: "string",
                    description:
                      "Duration over which window quality is evaluated. Must be an integer fraction of a day and at least 60s. (Format: google-duration)",
                  },
                },
                description:
                  "A WindowsBasedSli defines good_service as the count of time windows for which the provided service was of good quality. Criteria for determining if service was good are embedded in the window_criterion.",
                additionalProperties: true,
              },
            },
            description:
              'A Service-Level Indicator (SLI) describes the "performance" of a service. For some services, the SLI is well-defined. In such cases, the SLI can be described easily by referencing the well-known SLI and providing the needed parameters. Alternatively, a "custom" SLI can be defined with a query to the underlying metric store. An SLI is defined to be good_service / total_service over any queried time interval. The value of performance always falls into the range 0 <= performance <= 1. A custom SLI describes how to compute this ratio, whether this is by dividing values from a pair of time series, cutting a Distribution into good and bad counts, or counting time windows in which the service complies with a criterion. For separation of concerns, a single Service-Level Indicator measures performance for only one aspect of service quality, such as fraction of successful queries or fast-enough queries.',
            additionalProperties: true,
          },
          required: false,
        },
        goal: {
          name: "Goal",
          description:
            "The fraction of service that must be good in order for this objective to be met.",
          type: {
            type: "number",
            description:
              "The fraction of service that must be good in order for this objective to be met. 0 < goal <= 0.9999. (Format: double)",
          },
          required: false,
        },
        rollingPeriod: {
          name: "Rolling Period",
          description: 'A rolling time period, semantically "in the past ".',
          type: {
            type: "string",
            description:
              'A rolling time period, semantically "in the past ". Must be an integer multiple of 1 day no larger than 30 days. (Format: google-duration)',
          },
          required: false,
        },
        calendarPeriod: {
          name: "Calendar Period",
          description:
            'A calendar period, semantically "since the start of the current ".',
          type: {
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
              'A calendar period, semantically "since the start of the current ". At this time, only DAY, WEEK, FORTNIGHT, and MONTH are supported.',
          },
          required: false,
        },
        userLabels: {
          name: "User Labels",
          description:
            "Labels which have been used to annotate the service-level objective.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels which have been used to annotate the service-level objective. Label keys must start with a letter. Label keys and values may contain lowercase letters, numbers, underscores, and dashes. Label keys and values have a maximum length of 63 characters, and must be less than 128 bytes in size. Up to 64 label entries may be stored. For labels which do not have a semantic value, the empty string may be supplied for the label value.",
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
        let path = `v3/{+name}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.displayName !== undefined)
          requestBody.displayName = input.event.inputConfig.displayName;
        if (input.event.inputConfig.serviceLevelIndicator !== undefined)
          requestBody.serviceLevelIndicator =
            input.event.inputConfig.serviceLevelIndicator;
        if (input.event.inputConfig.goal !== undefined)
          requestBody.goal = input.event.inputConfig.goal;
        if (input.event.inputConfig.rollingPeriod !== undefined)
          requestBody.rollingPeriod = input.event.inputConfig.rollingPeriod;
        if (input.event.inputConfig.calendarPeriod !== undefined)
          requestBody.calendarPeriod = input.event.inputConfig.calendarPeriod;
        if (input.event.inputConfig.userLabels !== undefined)
          requestBody.userLabels = input.event.inputConfig.userLabels;

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
          name: {
            type: "string",
            description:
              "Identifier. Resource name for this ServiceLevelObjective. The format is: projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]/serviceLevelObjectives/[SLO_NAME]",
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
                    description: "Future parameters for the availability SLI.",
                    additionalProperties: true,
                  },
                  latency: {
                    type: "object",
                    properties: {
                      threshold: {
                        type: "string",
                        description:
                          "Good service is defined to be the count of requests made to this service that return in no more than threshold. (Format: google-duration)",
                      },
                    },
                    description: "Parameters for a latency threshold SLI.",
                    additionalProperties: true,
                  },
                },
                description:
                  "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the service_resource determines the metrics to use and the service_resource.labels and metric_labels are used to construct a monitoring filter to filter that metric down to just the data relevant to this service.",
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
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying good service provided. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                      badServiceFilter: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                      totalServiceFilter: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying total demanded service. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                    },
                    description:
                      "A TimeSeriesRatio specifies two TimeSeries to use for computing the good_service / total_service ratio. The specified TimeSeries must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE. The TimeSeriesRatio must specify exactly two of good, bad, and total, and the relationship good_service + bad_service = total_service will be assumed.",
                    additionalProperties: true,
                  },
                  distributionCut: {
                    type: "object",
                    properties: {
                      distributionFilter: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries aggregating values. Must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum. (Format: double)",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum. (Format: double)",
                          },
                        },
                        description:
                          "Range of numerical values within min and max.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A DistributionCut defines a TimeSeries and thresholds used for measuring good service and total service. The TimeSeries must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE. The computed good_service will be the estimated count of values in the Distribution that fall within the specified min and max.",
                    additionalProperties: true,
                  },
                },
                description:
                  "Service Level Indicators for which atomic units of service are counted directly.",
                additionalProperties: true,
              },
              windowsBased: {
                type: "object",
                properties: {
                  goodBadMetricFilter: {
                    type: "string",
                    description:
                      "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries with ValueType = BOOL. The window is good if any true values appear in the window.",
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
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying good service provided. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                              badServiceFilter: {
                                type: "string",
                                description:
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying bad service, either demanded service that was not provided or demanded service that was of inadequate quality. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                              totalServiceFilter: {
                                type: "string",
                                description:
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries quantifying total demanded service. Must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                            },
                            description:
                              "A TimeSeriesRatio specifies two TimeSeries to use for computing the good_service / total_service ratio. The specified TimeSeries must have ValueType = DOUBLE or ValueType = INT64 and must have MetricKind = DELTA or MetricKind = CUMULATIVE. The TimeSeriesRatio must specify exactly two of good, bad, and total, and the relationship good_service + bad_service = total_service will be assumed.",
                            additionalProperties: true,
                          },
                          distributionCut: {
                            type: "object",
                            properties: {
                              distributionFilter: {
                                type: "string",
                                description:
                                  "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying a TimeSeries aggregating values. Must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE.",
                              },
                              range: {
                                type: "object",
                                properties: {
                                  min: {
                                    type: "number",
                                    description:
                                      "Range minimum. (Format: double)",
                                  },
                                  max: {
                                    type: "number",
                                    description:
                                      "Range maximum. (Format: double)",
                                  },
                                },
                                description:
                                  "Range of numerical values within min and max.",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "A DistributionCut defines a TimeSeries and thresholds used for measuring good service and total service. The TimeSeries must have ValueType = DISTRIBUTION and MetricKind = DELTA or MetricKind = CUMULATIVE. The computed good_service will be the estimated count of values in the Distribution that fall within the specified min and max.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "Service Level Indicators for which atomic units of service are counted directly.",
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
                              "Future parameters for the availability SLI.",
                            additionalProperties: true,
                          },
                          latency: {
                            type: "object",
                            properties: {
                              threshold: {
                                type: "string",
                                description:
                                  "Good service is defined to be the count of requests made to this service that return in no more than threshold. (Format: google-duration)",
                              },
                            },
                            description:
                              "Parameters for a latency threshold SLI.",
                            additionalProperties: true,
                          },
                        },
                        description:
                          "An SLI measuring performance on a well-known service type. Performance will be computed on the basis of pre-defined metrics. The type of the service_resource determines the metrics to use and the service_resource.labels and metric_labels are used to construct a monitoring filter to filter that metric down to just the data relevant to this service.",
                        additionalProperties: true,
                      },
                      threshold: {
                        type: "number",
                        description:
                          "If window performance >= threshold, the window is counted as good. (Format: double)",
                      },
                    },
                    description:
                      "A PerformanceThreshold is used when each window is good when that window has a sufficiently high performance.",
                    additionalProperties: true,
                  },
                  metricMeanInRange: {
                    type: "object",
                    properties: {
                      timeSeries: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying the TimeSeries to use for evaluating window quality.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum. (Format: double)",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum. (Format: double)",
                          },
                        },
                        description:
                          "Range of numerical values within min and max.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A MetricRange is used when each window is good when the value x of a single TimeSeries satisfies range.min <= x <= range.max. The provided TimeSeries must have ValueType = INT64 or ValueType = DOUBLE and MetricKind = GAUGE.",
                    additionalProperties: true,
                  },
                  metricSumInRange: {
                    type: "object",
                    properties: {
                      timeSeries: {
                        type: "string",
                        description:
                          "A monitoring filter (https://cloud.google.com/monitoring/api/v3/filters) specifying the TimeSeries to use for evaluating window quality.",
                      },
                      range: {
                        type: "object",
                        properties: {
                          min: {
                            type: "number",
                            description: "Range minimum. (Format: double)",
                          },
                          max: {
                            type: "number",
                            description: "Range maximum. (Format: double)",
                          },
                        },
                        description:
                          "Range of numerical values within min and max.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "A MetricRange is used when each window is good when the value x of a single TimeSeries satisfies range.min <= x <= range.max. The provided TimeSeries must have ValueType = INT64 or ValueType = DOUBLE and MetricKind = GAUGE.",
                    additionalProperties: true,
                  },
                  windowPeriod: {
                    type: "string",
                    description:
                      "Duration over which window quality is evaluated. Must be an integer fraction of a day and at least 60s. (Format: google-duration)",
                  },
                },
                description:
                  "A WindowsBasedSli defines good_service as the count of time windows for which the provided service was of good quality. Criteria for determining if service was good are embedded in the window_criterion.",
                additionalProperties: true,
              },
            },
            description:
              'A Service-Level Indicator (SLI) describes the "performance" of a service. For some services, the SLI is well-defined. In such cases, the SLI can be described easily by referencing the well-known SLI and providing the needed parameters. Alternatively, a "custom" SLI can be defined with a query to the underlying metric store. An SLI is defined to be good_service / total_service over any queried time interval. The value of performance always falls into the range 0 <= performance <= 1. A custom SLI describes how to compute this ratio, whether this is by dividing values from a pair of time series, cutting a Distribution into good and bad counts, or counting time windows in which the service complies with a criterion. For separation of concerns, a single Service-Level Indicator measures performance for only one aspect of service quality, such as fraction of successful queries or fast-enough queries.',
            additionalProperties: true,
          },
          goal: {
            type: "number",
            description:
              "The fraction of service that must be good in order for this objective to be met. 0 < goal <= 0.9999. (Format: double)",
          },
          rollingPeriod: {
            type: "string",
            description:
              'A rolling time period, semantically "in the past ". Must be an integer multiple of 1 day no larger than 30 days. (Format: google-duration)',
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
              'A calendar period, semantically "since the start of the current ". At this time, only DAY, WEEK, FORTNIGHT, and MONTH are supported.',
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

export default serviceLevelObjectivesPatch;
