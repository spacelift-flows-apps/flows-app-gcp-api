import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getAlertPolicyServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  alertPolicy: {
    name: "alert_policy",
    fields: {
      displayName: "display_name",
      documentation: {
        name: "documentation",
        fields: {
          mimeType: "mime_type",
          links: {
            name: "links",
            fields: {
              displayName: "display_name",
            },
          },
        },
      },
      userLabels: "user_labels",
      conditions: {
        name: "conditions",
        fields: {
          displayName: "display_name",
          conditionThreshold: {
            name: "condition_threshold",
            fields: {
              aggregations: {
                name: "aggregations",
                fields: {
                  alignmentPeriod: "alignment_period",
                  perSeriesAligner: "per_series_aligner",
                  crossSeriesReducer: "cross_series_reducer",
                  groupByFields: "group_by_fields",
                },
              },
              denominatorFilter: "denominator_filter",
              denominatorAggregations: {
                name: "denominator_aggregations",
                fields: {
                  alignmentPeriod: "alignment_period",
                  perSeriesAligner: "per_series_aligner",
                  crossSeriesReducer: "cross_series_reducer",
                  groupByFields: "group_by_fields",
                },
              },
              forecastOptions: {
                name: "forecast_options",
                fields: {
                  forecastHorizon: "forecast_horizon",
                },
              },
              thresholdValue: "threshold_value",
              evaluationMissingData: "evaluation_missing_data",
            },
          },
          conditionAbsent: {
            name: "condition_absent",
            fields: {
              aggregations: {
                name: "aggregations",
                fields: {
                  alignmentPeriod: "alignment_period",
                  perSeriesAligner: "per_series_aligner",
                  crossSeriesReducer: "cross_series_reducer",
                  groupByFields: "group_by_fields",
                },
              },
            },
          },
          conditionMatchedLog: {
            name: "condition_matched_log",
            fields: {
              labelExtractors: "label_extractors",
            },
          },
          conditionMonitoringQueryLanguage: {
            name: "condition_monitoring_query_language",
            fields: {
              evaluationMissingData: "evaluation_missing_data",
            },
          },
          conditionPrometheusQueryLanguage: {
            name: "condition_prometheus_query_language",
            fields: {
              evaluationInterval: "evaluation_interval",
              ruleGroup: "rule_group",
              alertRule: "alert_rule",
              disableMetricValidation: "disable_metric_validation",
            },
          },
          conditionSql: {
            name: "condition_sql",
            fields: {
              hourly: {
                name: "hourly",
                fields: {
                  minuteOffset: "minute_offset",
                },
              },
              daily: {
                name: "daily",
                fields: {
                  executionTime: "execution_time",
                },
              },
              rowCountTest: "row_count_test",
              booleanTest: "boolean_test",
            },
          },
        },
      },
      validity: {
        name: "validity",
        fields: {
          details: {
            name: "details",
            fields: {
              typeUrl: "type_url",
            },
          },
        },
      },
      notificationChannels: "notification_channels",
      creationRecord: {
        name: "creation_record",
        fields: {
          mutateTime: "mutate_time",
          mutatedBy: "mutated_by",
        },
      },
      mutationRecord: {
        name: "mutation_record",
        fields: {
          mutateTime: "mutate_time",
          mutatedBy: "mutated_by",
        },
      },
      alertStrategy: {
        name: "alert_strategy",
        fields: {
          notificationRateLimit: "notification_rate_limit",
          notificationPrompts: "notification_prompts",
          autoClose: "auto_close",
          notificationChannelStrategy: {
            name: "notification_channel_strategy",
            fields: {
              notificationChannelNames: "notification_channel_names",
              renotifyInterval: "renotify_interval",
            },
          },
        },
      },
    },
  },
};

const outputMapping = {
  display_name: "displayName",
  documentation: {
    name: "documentation",
    fields: {
      mime_type: "mimeType",
      links: {
        name: "links",
        fields: {
          display_name: "displayName",
        },
      },
    },
  },
  user_labels: "userLabels",
  conditions: {
    name: "conditions",
    fields: {
      display_name: "displayName",
      condition_threshold: {
        name: "conditionThreshold",
        fields: {
          aggregations: {
            name: "aggregations",
            fields: {
              alignment_period: "alignmentPeriod",
              per_series_aligner: "perSeriesAligner",
              cross_series_reducer: "crossSeriesReducer",
              group_by_fields: "groupByFields",
            },
          },
          denominator_filter: "denominatorFilter",
          denominator_aggregations: {
            name: "denominatorAggregations",
            fields: {
              alignment_period: "alignmentPeriod",
              per_series_aligner: "perSeriesAligner",
              cross_series_reducer: "crossSeriesReducer",
              group_by_fields: "groupByFields",
            },
          },
          forecast_options: {
            name: "forecastOptions",
            fields: {
              forecast_horizon: "forecastHorizon",
            },
          },
          threshold_value: "thresholdValue",
          evaluation_missing_data: "evaluationMissingData",
        },
      },
      condition_absent: {
        name: "conditionAbsent",
        fields: {
          aggregations: {
            name: "aggregations",
            fields: {
              alignment_period: "alignmentPeriod",
              per_series_aligner: "perSeriesAligner",
              cross_series_reducer: "crossSeriesReducer",
              group_by_fields: "groupByFields",
            },
          },
        },
      },
      condition_matched_log: {
        name: "conditionMatchedLog",
        fields: {
          label_extractors: "labelExtractors",
        },
      },
      condition_monitoring_query_language: {
        name: "conditionMonitoringQueryLanguage",
        fields: {
          evaluation_missing_data: "evaluationMissingData",
        },
      },
      condition_prometheus_query_language: {
        name: "conditionPrometheusQueryLanguage",
        fields: {
          evaluation_interval: "evaluationInterval",
          rule_group: "ruleGroup",
          alert_rule: "alertRule",
          disable_metric_validation: "disableMetricValidation",
        },
      },
      condition_sql: {
        name: "conditionSql",
        fields: {
          hourly: {
            name: "hourly",
            fields: {
              minute_offset: "minuteOffset",
            },
          },
          daily: {
            name: "daily",
            fields: {
              execution_time: "executionTime",
            },
          },
          row_count_test: "rowCountTest",
          boolean_test: "booleanTest",
        },
      },
    },
  },
  validity: {
    name: "validity",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  notification_channels: "notificationChannels",
  creation_record: {
    name: "creationRecord",
    fields: {
      mutate_time: "mutateTime",
      mutated_by: "mutatedBy",
    },
  },
  mutation_record: {
    name: "mutationRecord",
    fields: {
      mutate_time: "mutateTime",
      mutated_by: "mutatedBy",
    },
  },
  alert_strategy: {
    name: "alertStrategy",
    fields: {
      notification_rate_limit: "notificationRateLimit",
      notification_prompts: "notificationPrompts",
      auto_close: "autoClose",
      notification_channel_strategy: {
        name: "notificationChannelStrategy",
        fields: {
          notification_channel_names: "notificationChannelNames",
          renotify_interval: "renotifyInterval",
        },
      },
    },
  },
};

const createAlertPolicy: AppBlock = {
  name: "Create Alert Policy",
  description: `Creates a new alerting policy. Design your application to single-thread API calls that modify the state of alerting policies in a single project. This includes calls to CreateAlertPolicy, DeleteAlertPolicy and UpdateAlertPolicy.`,
  category: "Alert Policies",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) in which to create the alerting policy. The format is:      projects/[PROJECT_ID_OR_NUMBER]  Note that this field names the parent container in which the alerting policy will be written, not the name of the created policy. |name| must be a host project of a Metrics Scope, otherwise INVALID_ARGUMENT error will return. The alerting policy that is returned will have a name that contains a normalized representation of this name as a prefix but adds a suffix of the form `/alertPolicies/[ALERT_POLICY_ID]`, identifying the policy in the container.",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) in which to create the alerting policy. The format is:      projects/[PROJECT_ID_OR_NUMBER]  Note that this field names the parent container in which the alerting policy will be written, not the name of the created policy. |name| must be a host project of a Metrics Scope, otherwise INVALID_ARGUMENT error will return. The alerting policy that is returned will have a name that contains a normalized representation of this name as a prefix but adds a suffix of the form `/alertPolicies/[ALERT_POLICY_ID]`, identifying the policy in the container.",
          },
          required: true,
        },
        alertPolicy: {
          name: "Alert Policy",
          description:
            "Required. The requested alerting policy. You should omit the `name` field in this policy. The name will be returned in the new policy, including a new `[ALERT_POLICY_ID]` value.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. Required if the policy exists. The resource name for this policy. The format is:      projects/[PROJECT_ID_OR_NUMBER]/alertPolicies/[ALERT_POLICY_ID]  `[ALERT_POLICY_ID]` is assigned by Cloud Monitoring when the policy is created. When calling the [alertPolicies.create][google.monitoring.v3.AlertPolicyService.CreateAlertPolicy] method, do not include the `name` field in the alerting policy passed as part of the request.",
              },
              displayName: {
                type: "string",
                description:
                  'A short name or phrase used to identify the policy in dashboards, notifications, and incidents. To avoid confusion, don\'t use the same display name for multiple policies in the same project. The name is limited to 512 Unicode characters.  The convention for the display_name of a PrometheusQueryLanguageCondition is "{rule group name}/{alert name}", where the {rule group name} and {alert name} should be taken from the corresponding Prometheus configuration file. This convention is not enforced. In any case the display_name is not a unique key of the AlertPolicy.',
              },
              documentation: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "The body of the documentation, interpreted according to `mime_type`. The content may not exceed 8,192 Unicode characters and may not exceed more than 10,240 bytes when encoded in UTF-8 format, whichever is smaller. This text can be [templatized by using variables](https://cloud.google.com/monitoring/alerts/doc-variables#doc-vars).",
                  },
                  mimeType: {
                    type: "string",
                    description:
                      'The format of the `content` field. Presently, only the value `"text/markdown"` is supported. See [Markdown](https://en.wikipedia.org/wiki/Markdown) for more information.',
                  },
                  subject: {
                    type: "string",
                    description:
                      "Optional. The subject line of the notification. The subject line may not exceed 10,240 bytes. In notifications generated by this policy, the contents of the subject line after variable expansion will be truncated to 255 bytes or shorter at the latest UTF-8 character boundary. The 255-byte limit is recommended by [this thread](https://stackoverflow.com/questions/1592291/what-is-the-email-subject-length-limit). It is both the limit imposed by some third-party ticketing products and it is common to define textual fields in databases as VARCHAR(255).  The contents of the subject line can be [templatized by using variables](https://cloud.google.com/monitoring/alerts/doc-variables#doc-vars). If this field is missing or empty, a default subject line will be generated.",
                  },
                  links: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        displayName: {
                          type: "string",
                          description:
                            'A short display name for the link. The display name must not be empty or exceed 63 characters. Example: "playbook".',
                        },
                        url: {
                          type: "string",
                          description:
                            'The url of a webpage. A url can be templatized by using variables in the path or the query parameters. The total length of a URL should not exceed 2083 characters before and after variable expansion. Example: "https://my_domain.com/playbook?name=${resource.name}"',
                        },
                      },
                      description:
                        "Links to content such as playbooks, repositories, and other resources.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. Links to content such as playbooks, repositories, and other resources. This field can contain up to 3 entries.",
                  },
                },
                description:
                  "Documentation that is included in the notifications and incidents pertaining to this policy.",
                additionalProperties: true,
              },
              userLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "User-supplied key/value data to be used for organizing and identifying the `AlertPolicy` objects.  The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.  Note that Prometheus {alert name} is a [valid Prometheus label names](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels), whereas Prometheus {rule group} is an unrestricted UTF-8 string. This means that they cannot be stored as-is in user labels, because they may contain characters that are not allowed in user-label values.",
              },
              conditions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "Required if the condition exists. The unique resource name for this condition. Its format is:      projects/[PROJECT_ID_OR_NUMBER]/alertPolicies/[POLICY_ID]/conditions/[CONDITION_ID]  `[CONDITION_ID]` is assigned by Cloud Monitoring when the condition is created as part of a new or updated alerting policy.  When calling the [alertPolicies.create][google.monitoring.v3.AlertPolicyService.CreateAlertPolicy] method, do not include the `name` field in the conditions of the requested alerting policy. Cloud Monitoring creates the condition identifiers and includes them in the new policy.  When calling the [alertPolicies.update][google.monitoring.v3.AlertPolicyService.UpdateAlertPolicy] method to update a policy, including a condition `name` causes the existing condition to be updated. Conditions without names are added to the updated policy. Existing conditions are deleted if they are not updated.  Best practice is to preserve `[CONDITION_ID]` if you make only small changes, such as those to condition thresholds, durations, or trigger values.  Otherwise, treat the change as a new condition and let the existing condition be deleted.",
                    },
                    displayName: {
                      type: "string",
                      description:
                        "A short name or phrase used to identify the condition in dashboards, notifications, and incidents. To avoid confusion, don't use the same display name for multiple conditions in the same policy.",
                    },
                    conditionThreshold: {
                      type: "object",
                      properties: {
                        filter: {
                          type: "string",
                          description:
                            "Required. A [filter](https://cloud.google.com/monitoring/api/v3/filters) that identifies which time series should be compared with the threshold.  The filter is similar to the one that is specified in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list) (that call is useful to verify the time series that will be retrieved / processed). The filter must specify the metric type and the resource type. Optionally, it can specify resource labels and metric labels. This field must not exceed 2048 Unicode characters in length.",
                        },
                        aggregations: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              alignmentPeriod: {
                                type: "string",
                                description:
                                  "Duration string (e.g., '1.5s', '300s')",
                              },
                              perSeriesAligner: {
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
                              crossSeriesReducer: {
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
                              groupByFields: {
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
                          description:
                            "Specifies the alignment of data points in individual time series as well as how to combine the retrieved time series together (such as when aggregating multiple streams on each resource to a single stream for each resource or when aggregating streams across all members of a group of resources). Multiple aggregations are applied in the order specified.  This field is similar to the one in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list). It is advisable to use the `ListTimeSeries` method when debugging this field.",
                        },
                        denominatorFilter: {
                          type: "string",
                          description:
                            "A [filter](https://cloud.google.com/monitoring/api/v3/filters) that identifies a time series that should be used as the denominator of a ratio that will be compared with the threshold. If a `denominator_filter` is specified, the time series specified by the `filter` field will be used as the numerator.  The filter must specify the metric type and optionally may contain restrictions on resource type, resource labels, and metric labels. This field may not exceed 2048 Unicode characters in length.",
                        },
                        denominatorAggregations: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              alignmentPeriod: {
                                type: "string",
                                description:
                                  "Duration string (e.g., '1.5s', '300s')",
                              },
                              perSeriesAligner: {
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
                              crossSeriesReducer: {
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
                              groupByFields: {
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
                          description:
                            "Specifies the alignment of data points in individual time series selected by `denominatorFilter` as well as how to combine the retrieved time series together (such as when aggregating multiple streams on each resource to a single stream for each resource or when aggregating streams across all members of a group of resources).  When computing ratios, the `aggregations` and `denominator_aggregations` fields must use the same alignment period and produce time series that have the same periodicity and labels.",
                        },
                        forecastOptions: {
                          type: "object",
                          properties: {
                            forecastHorizon: {
                              type: "string",
                              description:
                                "Duration string (e.g., '1.5s', '300s')",
                            },
                          },
                          required: ["forecastHorizon"],
                          description:
                            "Options used when forecasting the time series and testing the predicted value against the threshold.",
                          additionalProperties: true,
                        },
                        comparison: {
                          type: "string",
                          enum: [
                            "COMPARISON_UNSPECIFIED",
                            "COMPARISON_GT",
                            "COMPARISON_GE",
                            "COMPARISON_LT",
                            "COMPARISON_LE",
                            "COMPARISON_EQ",
                            "COMPARISON_NE",
                          ],
                          description:
                            "Specifies an ordering relationship on two arguments, called `left` and `right`.",
                        },
                        thresholdValue: {
                          type: "number",
                          description:
                            "A value against which to compare the time series.",
                        },
                        duration: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                        trigger: {
                          type: "object",
                          properties: {
                            count: {
                              type: "integer",
                              description:
                                "The absolute number of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                            },
                            percent: {
                              type: "number",
                              description:
                                "The percentage of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                            },
                          },
                          description:
                            "Specifies how many time series must fail a predicate to trigger a condition. If not specified, then a `{count: 1}` trigger is used.",
                          additionalProperties: true,
                        },
                        evaluationMissingData: {
                          type: "string",
                          enum: [
                            "EVALUATION_MISSING_DATA_UNSPECIFIED",
                            "EVALUATION_MISSING_DATA_INACTIVE",
                            "EVALUATION_MISSING_DATA_ACTIVE",
                            "EVALUATION_MISSING_DATA_NO_OP",
                          ],
                          description:
                            "A condition control that determines how metric-threshold conditions are evaluated when data stops arriving. To use this control, the value of the `duration` field must be greater than or equal to 60 seconds.",
                        },
                      },
                      required: ["filter"],
                      description:
                        "A condition type that compares a collection of time series against a threshold. (Part of 'condition' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    conditionAbsent: {
                      type: "object",
                      properties: {
                        filter: {
                          type: "string",
                          description:
                            "Required. A [filter](https://cloud.google.com/monitoring/api/v3/filters) that identifies which time series should be compared with the threshold.  The filter is similar to the one that is specified in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list) (that call is useful to verify the time series that will be retrieved / processed). The filter must specify the metric type and the resource type. Optionally, it can specify resource labels and metric labels. This field must not exceed 2048 Unicode characters in length.",
                        },
                        aggregations: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              alignmentPeriod: {
                                type: "string",
                                description:
                                  "Duration string (e.g., '1.5s', '300s')",
                              },
                              perSeriesAligner: {
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
                              crossSeriesReducer: {
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
                              groupByFields: {
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
                          description:
                            "Specifies the alignment of data points in individual time series as well as how to combine the retrieved time series together (such as when aggregating multiple streams on each resource to a single stream for each resource or when aggregating streams across all members of a group of resources). Multiple aggregations are applied in the order specified.  This field is similar to the one in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list). It is advisable to use the `ListTimeSeries` method when debugging this field.",
                        },
                        duration: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                        trigger: {
                          type: "object",
                          properties: {
                            count: {
                              type: "integer",
                              description:
                                "The absolute number of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                            },
                            percent: {
                              type: "number",
                              description:
                                "The percentage of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                            },
                          },
                          description:
                            "Specifies how many time series must fail a predicate to trigger a condition. If not specified, then a `{count: 1}` trigger is used.",
                          additionalProperties: true,
                        },
                      },
                      required: ["filter"],
                      description:
                        "A condition type that checks that monitored resources are reporting data. The configuration defines a metric and a set of monitored resources. The predicate is considered in violation when a time series for the specified metric of a monitored resource does not include any data in the specified `duration`. (Part of 'condition' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    conditionMatchedLog: {
                      type: "object",
                      properties: {
                        filter: {
                          type: "string",
                          description:
                            "Required. A logs-based filter. See [Advanced Logs Queries](https://cloud.google.com/logging/docs/view/advanced-queries) for how this filter should be constructed.",
                        },
                        labelExtractors: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "Optional. A map from a label key to an extractor expression, which is used to extract the value for this label key. Each entry in this map is a specification for how data should be extracted from log entries that match `filter`. Each combination of extracted values is treated as a separate rule for the purposes of triggering notifications. Label keys and corresponding values can be used in notifications generated by this condition.  Please see [the documentation on logs-based metric `valueExtractor`s](https://cloud.google.com/logging/docs/reference/v2/rest/v2/projects.metrics#LogMetric.FIELDS.value_extractor) for syntax and examples.",
                        },
                      },
                      required: ["filter"],
                      description:
                        "A condition type that checks whether a log message in the [scoping project](https://cloud.google.com/monitoring/api/v3#project_name) satisfies the given filter. Logs from other projects in the metrics scope are not evaluated. (Part of 'condition' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    conditionMonitoringQueryLanguage: {
                      type: "object",
                      properties: {
                        query: {
                          type: "string",
                          description:
                            "[Monitoring Query Language](https://cloud.google.com/monitoring/mql) query that outputs a boolean stream.",
                        },
                        duration: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                        trigger: {
                          type: "object",
                          properties: {
                            count: {
                              type: "integer",
                              description:
                                "The absolute number of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                            },
                            percent: {
                              type: "number",
                              description:
                                "The percentage of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                            },
                          },
                          description:
                            "Specifies how many time series must fail a predicate to trigger a condition. If not specified, then a `{count: 1}` trigger is used.",
                          additionalProperties: true,
                        },
                        evaluationMissingData: {
                          type: "string",
                          enum: [
                            "EVALUATION_MISSING_DATA_UNSPECIFIED",
                            "EVALUATION_MISSING_DATA_INACTIVE",
                            "EVALUATION_MISSING_DATA_ACTIVE",
                            "EVALUATION_MISSING_DATA_NO_OP",
                          ],
                          description:
                            "A condition control that determines how metric-threshold conditions are evaluated when data stops arriving.",
                        },
                      },
                      description:
                        "A condition type that allows alerting policies to be defined using [Monitoring Query Language](https://cloud.google.com/monitoring/mql). (Part of 'condition' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    conditionPrometheusQueryLanguage: {
                      type: "object",
                      properties: {
                        query: {
                          type: "string",
                          description:
                            "Required. The PromQL expression to evaluate. Every evaluation cycle this expression is evaluated at the current time, and all resultant time series become pending/firing alerts. This field must not be empty.",
                        },
                        duration: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                        evaluationInterval: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                        labels: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            'Optional. Labels to add to or overwrite in the PromQL query result. Label names [must be valid](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels). Label values can be [templatized by using variables](https://cloud.google.com/monitoring/alerts/doc-variables#doc-vars). The only available variable names are the names of the labels in the PromQL result, including "__name__" and "value". "labels" may be empty.',
                        },
                        ruleGroup: {
                          type: "string",
                          description:
                            "Optional. The rule group name of this alert in the corresponding Prometheus configuration file.  Some external tools may require this field to be populated correctly in order to refer to the original Prometheus configuration file. The rule group name and the alert name are necessary to update the relevant AlertPolicies in case the definition of the rule group changes in the future.  This field is optional. If this field is not empty, then it must contain a valid UTF-8 string. This field may not exceed 2048 Unicode characters in length.",
                        },
                        alertRule: {
                          type: "string",
                          description:
                            "Optional. The alerting rule name of this alert in the corresponding Prometheus configuration file.  Some external tools may require this field to be populated correctly in order to refer to the original Prometheus configuration file. The rule group name and the alert name are necessary to update the relevant AlertPolicies in case the definition of the rule group changes in the future.  This field is optional. If this field is not empty, then it must be a [valid Prometheus label name](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels). This field may not exceed 2048 Unicode characters in length.",
                        },
                        disableMetricValidation: {
                          type: "boolean",
                          description:
                            "Optional. Whether to disable metric existence validation for this condition.  This allows alerting policies to be defined on metrics that do not yet exist, improving advanced customer workflows such as configuring alerting policies using Terraform.  Users with the `monitoring.alertPolicyViewer` role are able to see the name of the non-existent metric in the alerting policy condition.",
                        },
                      },
                      required: ["query"],
                      description:
                        "A condition type that allows alerting policies to be defined using [Prometheus Query Language (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/).  The PrometheusQueryLanguageCondition message contains information from a Prometheus alerting rule and its associated rule group.  A Prometheus alerting rule is described [here](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/). The semantics of a Prometheus alerting rule is described [here](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#rule).  A Prometheus rule group is described [here](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/). The semantics of a Prometheus rule group is described [here](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#rule_group).  Because Cloud Alerting has no representation of a Prometheus rule group resource, we must embed the information of the parent rule group inside each of the conditions that refer to it. We must also update the contents of all Prometheus alerts in case the information of their rule group changes.  The PrometheusQueryLanguageCondition protocol buffer combines the information of the corresponding rule group and alerting rule. The structure of the PrometheusQueryLanguageCondition protocol buffer does NOT mimic the structure of the Prometheus rule group and alerting rule YAML declarations. The PrometheusQueryLanguageCondition protocol buffer may change in the future to support future rule group and/or alerting rule features. There are no new such features at the present time (2023-06-26). (Part of 'condition' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    conditionSql: {
                      type: "object",
                      properties: {
                        query: {
                          type: "string",
                          description:
                            "Required. The Log Analytics SQL query to run, as a string.  The query must conform to the required shape. Specifically, the query must not try to filter the input by time.  A filter will automatically be applied to filter the input so that the query receives all rows received since the last time the query was run.  For example, the following query extracts all log entries containing an HTTP request:      SELECT       timestamp, log_name, severity, http_request, resource, labels     FROM       my-project.global._Default._AllLogs     WHERE       http_request IS NOT NULL",
                        },
                        minutes: {
                          type: "object",
                          properties: {
                            periodicity: {
                              type: "integer",
                              description:
                                "Required. Number of minutes between runs. The interval must be greater than or equal to 5 minutes and less than or equal to 1440 minutes.",
                            },
                          },
                          required: ["periodicity"],
                          description:
                            "Used to schedule the query to run every so many minutes. (Part of 'schedule' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        hourly: {
                          type: "object",
                          properties: {
                            periodicity: {
                              type: "integer",
                              description:
                                "Required. The number of hours between runs. Must be greater than or equal to 1 hour and less than or equal to 48 hours.",
                            },
                            minuteOffset: {
                              type: "integer",
                              description:
                                "Optional. The number of minutes after the hour (in UTC) to run the query. Must be greater than or equal to 0 minutes and less than or equal to 59 minutes.  If left unspecified, then an arbitrary offset is used.",
                            },
                          },
                          required: ["periodicity"],
                          description:
                            "Used to schedule the query to run every so many hours. (Part of 'schedule' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        daily: {
                          type: "object",
                          properties: {
                            periodicity: {
                              type: "integer",
                              description:
                                "Required. The number of days between runs. Must be greater than or equal to 1 day and less than or equal to 31 days.",
                            },
                            executionTime: {
                              type: "object",
                              properties: {
                                hours: {
                                  type: "integer",
                                },
                                minutes: {
                                  type: "integer",
                                },
                                seconds: {
                                  type: "integer",
                                },
                                nanos: {
                                  type: "integer",
                                },
                              },
                              additionalProperties: true,
                              description:
                                "Optional. The time of day (in UTC) at which the query should run. If left unspecified, the server picks an arbitrary time of day and runs the query at the same time each day.",
                            },
                          },
                          required: ["periodicity"],
                          description:
                            "Used to schedule the query to run every so many days. (Part of 'schedule' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        rowCountTest: {
                          type: "object",
                          properties: {
                            comparison: {
                              type: "string",
                              enum: [
                                "COMPARISON_UNSPECIFIED",
                                "COMPARISON_GT",
                                "COMPARISON_GE",
                                "COMPARISON_LT",
                                "COMPARISON_LE",
                                "COMPARISON_EQ",
                                "COMPARISON_NE",
                              ],
                              description:
                                "Specifies an ordering relationship on two arguments, called `left` and `right`.",
                            },
                            threshold: {
                              type: "string",
                              description: "64-bit integer as string",
                            },
                          },
                          required: ["comparison", "threshold"],
                          description:
                            "A test that checks if the number of rows in the result set violates some threshold. (Part of 'evaluate' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                        booleanTest: {
                          type: "object",
                          properties: {
                            column: {
                              type: "string",
                              description:
                                "Required. The name of the column containing the boolean value. If the value in a row is NULL, that row is ignored.",
                            },
                          },
                          required: ["column"],
                          description:
                            "A test that uses an alerting result in a boolean column produced by the SQL query. (Part of 'evaluate' - only one field in this group can be set)",
                          additionalProperties: true,
                        },
                      },
                      required: ["query"],
                      description:
                        "A condition that allows alerting policies to be defined using GoogleSQL. SQL conditions examine a sliding window of logs using GoogleSQL. Alert policies with SQL conditions may incur additional billing. (Part of 'condition' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "A condition is a true/false test that determines when an alerting policy should open an incident. If a condition evaluates to true, it signifies that something is wrong.",
                  additionalProperties: true,
                },
                description:
                  "A list of conditions for the policy. The conditions are combined by AND or OR according to the `combiner` field. If the combined conditions evaluate to true, then an incident is created. A policy can have from one to six conditions. If `condition_time_series_query_language` is present, it must be the only `condition`. If `condition_monitoring_query_language` is present, it must be the only `condition`.",
              },
              combiner: {
                type: "string",
                enum: [
                  "COMBINE_UNSPECIFIED",
                  "AND",
                  "OR",
                  "AND_WITH_MATCHING_RESOURCE",
                ],
                description:
                  "How to combine the results of multiple conditions to determine if an incident should be opened. If `condition_time_series_query_language` is present, this must be `COMBINE_UNSPECIFIED`.",
              },
              enabled: {
                type: "boolean",
                description:
                  "Whether or not the policy is enabled. On write, the default interpretation if unset is that the policy is enabled. On read, clients should not make any assumption about the state if it has not been populated. The field should always be populated on List and Get operations, unless a field projection has been specified that strips it out.",
              },
              validity: {
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
                description:
                  "Read-only description of how the alerting policy is invalid. This field is only set when the alerting policy is invalid. An invalid alerting policy will not generate incidents.",
              },
              notificationChannels: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Identifies the notification channels to which notifications should be sent when incidents are opened or closed or when new violations occur on an already opened incident. Each element of this array corresponds to the `name` field in each of the [`NotificationChannel`][google.monitoring.v3.NotificationChannel] objects that are returned from the [`ListNotificationChannels`] [google.monitoring.v3.NotificationChannelService.ListNotificationChannels] method. The format of the entries in this field is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]",
              },
              creationRecord: {
                type: "object",
                properties: {
                  mutateTime: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  mutatedBy: {
                    type: "string",
                    description:
                      "The email address of the user making the change.",
                  },
                },
                description: "Describes a change made to a configuration.",
                additionalProperties: true,
              },
              mutationRecord: {
                type: "object",
                properties: {
                  mutateTime: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  mutatedBy: {
                    type: "string",
                    description:
                      "The email address of the user making the change.",
                  },
                },
                description: "Describes a change made to a configuration.",
                additionalProperties: true,
              },
              alertStrategy: {
                type: "object",
                properties: {
                  notificationRateLimit: {
                    type: "object",
                    properties: {
                      period: {
                        type: "string",
                        description: "Duration string (e.g., '1.5s', '300s')",
                      },
                    },
                    description:
                      "Control over the rate of notifications sent to this alerting policy's notification channels.",
                    additionalProperties: true,
                  },
                  notificationPrompts: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: [
                        "NOTIFICATION_PROMPT_UNSPECIFIED",
                        "OPENED",
                        "CLOSED",
                      ],
                    },
                    description:
                      "For log-based alert policies, the notification prompts is always [OPENED]. For non log-based alert policies, the notification prompts can be [OPENED] or [OPENED, CLOSED].",
                  },
                  autoClose: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                  notificationChannelStrategy: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        notificationChannelNames: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "The full REST resource name for the notification channels that these settings apply to. Each of these correspond to the name field in one of the NotificationChannel objects referenced in the notification_channels field of this AlertPolicy. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]",
                        },
                        renotifyInterval: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                      },
                      description:
                        "Control over how the notification channels in `notification_channels` are notified when this alert fires, on a per-channel basis.",
                      additionalProperties: true,
                    },
                    description:
                      "Control how notifications will be sent out, on a per-channel basis.",
                  },
                },
                description:
                  "Control over how the notification channels in `notification_channels` are notified when this alert fires.",
                additionalProperties: true,
              },
              severity: {
                type: "string",
                enum: ["SEVERITY_UNSPECIFIED", "CRITICAL", "ERROR", "WARNING"],
                description:
                  "Optional. The severity of an alerting policy indicates how important incidents generated by that policy are. The severity level will be displayed on the Incident detail page and in notifications.",
              },
            },
            description:
              'A description of the conditions under which some aspect of your system is considered to be "unhealthy" and the ways to notify people or services about this state. For an overview of alerting policies, see [Introduction to Alerting](https://cloud.google.com/monitoring/alerts/).',
            additionalProperties: true,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getAlertPolicyServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createAlertPolicy(request, (err: any, response: any) => {
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
          name: {
            type: "string",
            description:
              "Identifier. Required if the policy exists. The resource name for this policy. The format is:      projects/[PROJECT_ID_OR_NUMBER]/alertPolicies/[ALERT_POLICY_ID]  `[ALERT_POLICY_ID]` is assigned by Cloud Monitoring when the policy is created. When calling the [alertPolicies.create][google.monitoring.v3.AlertPolicyService.CreateAlertPolicy] method, do not include the `name` field in the alerting policy passed as part of the request.",
          },
          displayName: {
            type: "string",
            description:
              'A short name or phrase used to identify the policy in dashboards, notifications, and incidents. To avoid confusion, don\'t use the same display name for multiple policies in the same project. The name is limited to 512 Unicode characters.  The convention for the display_name of a PrometheusQueryLanguageCondition is "{rule group name}/{alert name}", where the {rule group name} and {alert name} should be taken from the corresponding Prometheus configuration file. This convention is not enforced. In any case the display_name is not a unique key of the AlertPolicy.',
          },
          documentation: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description:
                  "The body of the documentation, interpreted according to `mime_type`. The content may not exceed 8,192 Unicode characters and may not exceed more than 10,240 bytes when encoded in UTF-8 format, whichever is smaller. This text can be [templatized by using variables](https://cloud.google.com/monitoring/alerts/doc-variables#doc-vars).",
              },
              mimeType: {
                type: "string",
                description:
                  'The format of the `content` field. Presently, only the value `"text/markdown"` is supported. See [Markdown](https://en.wikipedia.org/wiki/Markdown) for more information.',
              },
              subject: {
                type: "string",
                description:
                  "Optional. The subject line of the notification. The subject line may not exceed 10,240 bytes. In notifications generated by this policy, the contents of the subject line after variable expansion will be truncated to 255 bytes or shorter at the latest UTF-8 character boundary. The 255-byte limit is recommended by [this thread](https://stackoverflow.com/questions/1592291/what-is-the-email-subject-length-limit). It is both the limit imposed by some third-party ticketing products and it is common to define textual fields in databases as VARCHAR(255).  The contents of the subject line can be [templatized by using variables](https://cloud.google.com/monitoring/alerts/doc-variables#doc-vars). If this field is missing or empty, a default subject line will be generated.",
              },
              links: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    displayName: {
                      type: "string",
                      description:
                        'A short display name for the link. The display name must not be empty or exceed 63 characters. Example: "playbook".',
                    },
                    url: {
                      type: "string",
                      description:
                        'The url of a webpage. A url can be templatized by using variables in the path or the query parameters. The total length of a URL should not exceed 2083 characters before and after variable expansion. Example: "https://my_domain.com/playbook?name=${resource.name}"',
                    },
                  },
                  description:
                    "Links to content such as playbooks, repositories, and other resources.",
                  additionalProperties: true,
                },
                description:
                  "Optional. Links to content such as playbooks, repositories, and other resources. This field can contain up to 3 entries.",
              },
            },
            description:
              "Documentation that is included in the notifications and incidents pertaining to this policy.",
            additionalProperties: true,
          },
          userLabels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "User-supplied key/value data to be used for organizing and identifying the `AlertPolicy` objects.  The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.  Note that Prometheus {alert name} is a [valid Prometheus label names](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels), whereas Prometheus {rule group} is an unrestricted UTF-8 string. This means that they cannot be stored as-is in user labels, because they may contain characters that are not allowed in user-label values.",
          },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Required if the condition exists. The unique resource name for this condition. Its format is:      projects/[PROJECT_ID_OR_NUMBER]/alertPolicies/[POLICY_ID]/conditions/[CONDITION_ID]  `[CONDITION_ID]` is assigned by Cloud Monitoring when the condition is created as part of a new or updated alerting policy.  When calling the [alertPolicies.create][google.monitoring.v3.AlertPolicyService.CreateAlertPolicy] method, do not include the `name` field in the conditions of the requested alerting policy. Cloud Monitoring creates the condition identifiers and includes them in the new policy.  When calling the [alertPolicies.update][google.monitoring.v3.AlertPolicyService.UpdateAlertPolicy] method to update a policy, including a condition `name` causes the existing condition to be updated. Conditions without names are added to the updated policy. Existing conditions are deleted if they are not updated.  Best practice is to preserve `[CONDITION_ID]` if you make only small changes, such as those to condition thresholds, durations, or trigger values.  Otherwise, treat the change as a new condition and let the existing condition be deleted.",
                },
                displayName: {
                  type: "string",
                  description:
                    "A short name or phrase used to identify the condition in dashboards, notifications, and incidents. To avoid confusion, don't use the same display name for multiple conditions in the same policy.",
                },
                conditionThreshold: {
                  type: "object",
                  properties: {
                    filter: {
                      type: "string",
                      description:
                        "Required. A [filter](https://cloud.google.com/monitoring/api/v3/filters) that identifies which time series should be compared with the threshold.  The filter is similar to the one that is specified in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list) (that call is useful to verify the time series that will be retrieved / processed). The filter must specify the metric type and the resource type. Optionally, it can specify resource labels and metric labels. This field must not exceed 2048 Unicode characters in length.",
                    },
                    aggregations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          alignmentPeriod: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                          perSeriesAligner: {
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
                          crossSeriesReducer: {
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
                          groupByFields: {
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
                      description:
                        "Specifies the alignment of data points in individual time series as well as how to combine the retrieved time series together (such as when aggregating multiple streams on each resource to a single stream for each resource or when aggregating streams across all members of a group of resources). Multiple aggregations are applied in the order specified.  This field is similar to the one in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list). It is advisable to use the `ListTimeSeries` method when debugging this field.",
                    },
                    denominatorFilter: {
                      type: "string",
                      description:
                        "A [filter](https://cloud.google.com/monitoring/api/v3/filters) that identifies a time series that should be used as the denominator of a ratio that will be compared with the threshold. If a `denominator_filter` is specified, the time series specified by the `filter` field will be used as the numerator.  The filter must specify the metric type and optionally may contain restrictions on resource type, resource labels, and metric labels. This field may not exceed 2048 Unicode characters in length.",
                    },
                    denominatorAggregations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          alignmentPeriod: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                          perSeriesAligner: {
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
                          crossSeriesReducer: {
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
                          groupByFields: {
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
                      description:
                        "Specifies the alignment of data points in individual time series selected by `denominatorFilter` as well as how to combine the retrieved time series together (such as when aggregating multiple streams on each resource to a single stream for each resource or when aggregating streams across all members of a group of resources).  When computing ratios, the `aggregations` and `denominator_aggregations` fields must use the same alignment period and produce time series that have the same periodicity and labels.",
                    },
                    forecastOptions: {
                      type: "object",
                      properties: {
                        forecastHorizon: {
                          type: "string",
                          description: "Duration string (e.g., '1.5s', '300s')",
                        },
                      },
                      required: ["forecastHorizon"],
                      description:
                        "Options used when forecasting the time series and testing the predicted value against the threshold.",
                      additionalProperties: true,
                    },
                    comparison: {
                      type: "string",
                      enum: [
                        "COMPARISON_UNSPECIFIED",
                        "COMPARISON_GT",
                        "COMPARISON_GE",
                        "COMPARISON_LT",
                        "COMPARISON_LE",
                        "COMPARISON_EQ",
                        "COMPARISON_NE",
                      ],
                      description:
                        "Specifies an ordering relationship on two arguments, called `left` and `right`.",
                    },
                    thresholdValue: {
                      type: "number",
                      description:
                        "A value against which to compare the time series.",
                    },
                    duration: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    trigger: {
                      type: "object",
                      properties: {
                        count: {
                          type: "integer",
                          description:
                            "The absolute number of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                        },
                        percent: {
                          type: "number",
                          description:
                            "The percentage of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                        },
                      },
                      description:
                        "Specifies how many time series must fail a predicate to trigger a condition. If not specified, then a `{count: 1}` trigger is used.",
                      additionalProperties: true,
                    },
                    evaluationMissingData: {
                      type: "string",
                      enum: [
                        "EVALUATION_MISSING_DATA_UNSPECIFIED",
                        "EVALUATION_MISSING_DATA_INACTIVE",
                        "EVALUATION_MISSING_DATA_ACTIVE",
                        "EVALUATION_MISSING_DATA_NO_OP",
                      ],
                      description:
                        "A condition control that determines how metric-threshold conditions are evaluated when data stops arriving. To use this control, the value of the `duration` field must be greater than or equal to 60 seconds.",
                    },
                  },
                  required: ["filter"],
                  description:
                    "A condition type that compares a collection of time series against a threshold. (Part of 'condition' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                conditionAbsent: {
                  type: "object",
                  properties: {
                    filter: {
                      type: "string",
                      description:
                        "Required. A [filter](https://cloud.google.com/monitoring/api/v3/filters) that identifies which time series should be compared with the threshold.  The filter is similar to the one that is specified in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list) (that call is useful to verify the time series that will be retrieved / processed). The filter must specify the metric type and the resource type. Optionally, it can specify resource labels and metric labels. This field must not exceed 2048 Unicode characters in length.",
                    },
                    aggregations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          alignmentPeriod: {
                            type: "string",
                            description:
                              "Duration string (e.g., '1.5s', '300s')",
                          },
                          perSeriesAligner: {
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
                          crossSeriesReducer: {
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
                          groupByFields: {
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
                      description:
                        "Specifies the alignment of data points in individual time series as well as how to combine the retrieved time series together (such as when aggregating multiple streams on each resource to a single stream for each resource or when aggregating streams across all members of a group of resources). Multiple aggregations are applied in the order specified.  This field is similar to the one in the [`ListTimeSeries` request](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list). It is advisable to use the `ListTimeSeries` method when debugging this field.",
                    },
                    duration: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    trigger: {
                      type: "object",
                      properties: {
                        count: {
                          type: "integer",
                          description:
                            "The absolute number of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                        },
                        percent: {
                          type: "number",
                          description:
                            "The percentage of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                        },
                      },
                      description:
                        "Specifies how many time series must fail a predicate to trigger a condition. If not specified, then a `{count: 1}` trigger is used.",
                      additionalProperties: true,
                    },
                  },
                  required: ["filter"],
                  description:
                    "A condition type that checks that monitored resources are reporting data. The configuration defines a metric and a set of monitored resources. The predicate is considered in violation when a time series for the specified metric of a monitored resource does not include any data in the specified `duration`. (Part of 'condition' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                conditionMatchedLog: {
                  type: "object",
                  properties: {
                    filter: {
                      type: "string",
                      description:
                        "Required. A logs-based filter. See [Advanced Logs Queries](https://cloud.google.com/logging/docs/view/advanced-queries) for how this filter should be constructed.",
                    },
                    labelExtractors: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Optional. A map from a label key to an extractor expression, which is used to extract the value for this label key. Each entry in this map is a specification for how data should be extracted from log entries that match `filter`. Each combination of extracted values is treated as a separate rule for the purposes of triggering notifications. Label keys and corresponding values can be used in notifications generated by this condition.  Please see [the documentation on logs-based metric `valueExtractor`s](https://cloud.google.com/logging/docs/reference/v2/rest/v2/projects.metrics#LogMetric.FIELDS.value_extractor) for syntax and examples.",
                    },
                  },
                  required: ["filter"],
                  description:
                    "A condition type that checks whether a log message in the [scoping project](https://cloud.google.com/monitoring/api/v3#project_name) satisfies the given filter. Logs from other projects in the metrics scope are not evaluated. (Part of 'condition' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                conditionMonitoringQueryLanguage: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description:
                        "[Monitoring Query Language](https://cloud.google.com/monitoring/mql) query that outputs a boolean stream.",
                    },
                    duration: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    trigger: {
                      type: "object",
                      properties: {
                        count: {
                          type: "integer",
                          description:
                            "The absolute number of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                        },
                        percent: {
                          type: "number",
                          description:
                            "The percentage of time series that must fail the predicate for the condition to be triggered. (Part of 'type' - only one field in this group can be set)",
                        },
                      },
                      description:
                        "Specifies how many time series must fail a predicate to trigger a condition. If not specified, then a `{count: 1}` trigger is used.",
                      additionalProperties: true,
                    },
                    evaluationMissingData: {
                      type: "string",
                      enum: [
                        "EVALUATION_MISSING_DATA_UNSPECIFIED",
                        "EVALUATION_MISSING_DATA_INACTIVE",
                        "EVALUATION_MISSING_DATA_ACTIVE",
                        "EVALUATION_MISSING_DATA_NO_OP",
                      ],
                      description:
                        "A condition control that determines how metric-threshold conditions are evaluated when data stops arriving.",
                    },
                  },
                  description:
                    "A condition type that allows alerting policies to be defined using [Monitoring Query Language](https://cloud.google.com/monitoring/mql). (Part of 'condition' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                conditionPrometheusQueryLanguage: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description:
                        "Required. The PromQL expression to evaluate. Every evaluation cycle this expression is evaluated at the current time, and all resultant time series become pending/firing alerts. This field must not be empty.",
                    },
                    duration: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    evaluationInterval: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                    labels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        'Optional. Labels to add to or overwrite in the PromQL query result. Label names [must be valid](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels). Label values can be [templatized by using variables](https://cloud.google.com/monitoring/alerts/doc-variables#doc-vars). The only available variable names are the names of the labels in the PromQL result, including "__name__" and "value". "labels" may be empty.',
                    },
                    ruleGroup: {
                      type: "string",
                      description:
                        "Optional. The rule group name of this alert in the corresponding Prometheus configuration file.  Some external tools may require this field to be populated correctly in order to refer to the original Prometheus configuration file. The rule group name and the alert name are necessary to update the relevant AlertPolicies in case the definition of the rule group changes in the future.  This field is optional. If this field is not empty, then it must contain a valid UTF-8 string. This field may not exceed 2048 Unicode characters in length.",
                    },
                    alertRule: {
                      type: "string",
                      description:
                        "Optional. The alerting rule name of this alert in the corresponding Prometheus configuration file.  Some external tools may require this field to be populated correctly in order to refer to the original Prometheus configuration file. The rule group name and the alert name are necessary to update the relevant AlertPolicies in case the definition of the rule group changes in the future.  This field is optional. If this field is not empty, then it must be a [valid Prometheus label name](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels). This field may not exceed 2048 Unicode characters in length.",
                    },
                    disableMetricValidation: {
                      type: "boolean",
                      description:
                        "Optional. Whether to disable metric existence validation for this condition.  This allows alerting policies to be defined on metrics that do not yet exist, improving advanced customer workflows such as configuring alerting policies using Terraform.  Users with the `monitoring.alertPolicyViewer` role are able to see the name of the non-existent metric in the alerting policy condition.",
                    },
                  },
                  required: ["query"],
                  description:
                    "A condition type that allows alerting policies to be defined using [Prometheus Query Language (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/).  The PrometheusQueryLanguageCondition message contains information from a Prometheus alerting rule and its associated rule group.  A Prometheus alerting rule is described [here](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/). The semantics of a Prometheus alerting rule is described [here](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#rule).  A Prometheus rule group is described [here](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/). The semantics of a Prometheus rule group is described [here](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#rule_group).  Because Cloud Alerting has no representation of a Prometheus rule group resource, we must embed the information of the parent rule group inside each of the conditions that refer to it. We must also update the contents of all Prometheus alerts in case the information of their rule group changes.  The PrometheusQueryLanguageCondition protocol buffer combines the information of the corresponding rule group and alerting rule. The structure of the PrometheusQueryLanguageCondition protocol buffer does NOT mimic the structure of the Prometheus rule group and alerting rule YAML declarations. The PrometheusQueryLanguageCondition protocol buffer may change in the future to support future rule group and/or alerting rule features. There are no new such features at the present time (2023-06-26). (Part of 'condition' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                conditionSql: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description:
                        "Required. The Log Analytics SQL query to run, as a string.  The query must conform to the required shape. Specifically, the query must not try to filter the input by time.  A filter will automatically be applied to filter the input so that the query receives all rows received since the last time the query was run.  For example, the following query extracts all log entries containing an HTTP request:      SELECT       timestamp, log_name, severity, http_request, resource, labels     FROM       my-project.global._Default._AllLogs     WHERE       http_request IS NOT NULL",
                    },
                    minutes: {
                      type: "object",
                      properties: {
                        periodicity: {
                          type: "integer",
                          description:
                            "Required. Number of minutes between runs. The interval must be greater than or equal to 5 minutes and less than or equal to 1440 minutes.",
                        },
                      },
                      required: ["periodicity"],
                      description:
                        "Used to schedule the query to run every so many minutes. (Part of 'schedule' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    hourly: {
                      type: "object",
                      properties: {
                        periodicity: {
                          type: "integer",
                          description:
                            "Required. The number of hours between runs. Must be greater than or equal to 1 hour and less than or equal to 48 hours.",
                        },
                        minuteOffset: {
                          type: "integer",
                          description:
                            "Optional. The number of minutes after the hour (in UTC) to run the query. Must be greater than or equal to 0 minutes and less than or equal to 59 minutes.  If left unspecified, then an arbitrary offset is used.",
                        },
                      },
                      required: ["periodicity"],
                      description:
                        "Used to schedule the query to run every so many hours. (Part of 'schedule' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    daily: {
                      type: "object",
                      properties: {
                        periodicity: {
                          type: "integer",
                          description:
                            "Required. The number of days between runs. Must be greater than or equal to 1 day and less than or equal to 31 days.",
                        },
                        executionTime: {
                          type: "object",
                          properties: {
                            hours: {
                              type: "integer",
                            },
                            minutes: {
                              type: "integer",
                            },
                            seconds: {
                              type: "integer",
                            },
                            nanos: {
                              type: "integer",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "Optional. The time of day (in UTC) at which the query should run. If left unspecified, the server picks an arbitrary time of day and runs the query at the same time each day.",
                        },
                      },
                      required: ["periodicity"],
                      description:
                        "Used to schedule the query to run every so many days. (Part of 'schedule' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    rowCountTest: {
                      type: "object",
                      properties: {
                        comparison: {
                          type: "string",
                          enum: [
                            "COMPARISON_UNSPECIFIED",
                            "COMPARISON_GT",
                            "COMPARISON_GE",
                            "COMPARISON_LT",
                            "COMPARISON_LE",
                            "COMPARISON_EQ",
                            "COMPARISON_NE",
                          ],
                          description:
                            "Specifies an ordering relationship on two arguments, called `left` and `right`.",
                        },
                        threshold: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      required: ["comparison", "threshold"],
                      description:
                        "A test that checks if the number of rows in the result set violates some threshold. (Part of 'evaluate' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                    booleanTest: {
                      type: "object",
                      properties: {
                        column: {
                          type: "string",
                          description:
                            "Required. The name of the column containing the boolean value. If the value in a row is NULL, that row is ignored.",
                        },
                      },
                      required: ["column"],
                      description:
                        "A test that uses an alerting result in a boolean column produced by the SQL query. (Part of 'evaluate' - only one field in this group can be set)",
                      additionalProperties: true,
                    },
                  },
                  required: ["query"],
                  description:
                    "A condition that allows alerting policies to be defined using GoogleSQL. SQL conditions examine a sliding window of logs using GoogleSQL. Alert policies with SQL conditions may incur additional billing. (Part of 'condition' - only one field in this group can be set)",
                  additionalProperties: true,
                },
              },
              description:
                "A condition is a true/false test that determines when an alerting policy should open an incident. If a condition evaluates to true, it signifies that something is wrong.",
              additionalProperties: true,
            },
            description:
              "A list of conditions for the policy. The conditions are combined by AND or OR according to the `combiner` field. If the combined conditions evaluate to true, then an incident is created. A policy can have from one to six conditions. If `condition_time_series_query_language` is present, it must be the only `condition`. If `condition_monitoring_query_language` is present, it must be the only `condition`.",
          },
          combiner: {
            type: "string",
            enum: [
              "COMBINE_UNSPECIFIED",
              "AND",
              "OR",
              "AND_WITH_MATCHING_RESOURCE",
            ],
            description:
              "How to combine the results of multiple conditions to determine if an incident should be opened. If `condition_time_series_query_language` is present, this must be `COMBINE_UNSPECIFIED`.",
          },
          enabled: {
            type: "boolean",
            description:
              "Whether or not the policy is enabled. On write, the default interpretation if unset is that the policy is enabled. On read, clients should not make any assumption about the state if it has not been populated. The field should always be populated on List and Get operations, unless a field projection has been specified that strips it out.",
          },
          validity: {
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
            description:
              "Read-only description of how the alerting policy is invalid. This field is only set when the alerting policy is invalid. An invalid alerting policy will not generate incidents.",
          },
          notificationChannels: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Identifies the notification channels to which notifications should be sent when incidents are opened or closed or when new violations occur on an already opened incident. Each element of this array corresponds to the `name` field in each of the [`NotificationChannel`][google.monitoring.v3.NotificationChannel] objects that are returned from the [`ListNotificationChannels`] [google.monitoring.v3.NotificationChannelService.ListNotificationChannels] method. The format of the entries in this field is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]",
          },
          creationRecord: {
            type: "object",
            properties: {
              mutateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              mutatedBy: {
                type: "string",
                description: "The email address of the user making the change.",
              },
            },
            description: "Describes a change made to a configuration.",
            additionalProperties: true,
          },
          mutationRecord: {
            type: "object",
            properties: {
              mutateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              mutatedBy: {
                type: "string",
                description: "The email address of the user making the change.",
              },
            },
            description: "Describes a change made to a configuration.",
            additionalProperties: true,
          },
          alertStrategy: {
            type: "object",
            properties: {
              notificationRateLimit: {
                type: "object",
                properties: {
                  period: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                },
                description:
                  "Control over the rate of notifications sent to this alerting policy's notification channels.",
                additionalProperties: true,
              },
              notificationPrompts: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["NOTIFICATION_PROMPT_UNSPECIFIED", "OPENED", "CLOSED"],
                },
                description:
                  "For log-based alert policies, the notification prompts is always [OPENED]. For non log-based alert policies, the notification prompts can be [OPENED] or [OPENED, CLOSED].",
              },
              autoClose: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              notificationChannelStrategy: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    notificationChannelNames: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The full REST resource name for the notification channels that these settings apply to. Each of these correspond to the name field in one of the NotificationChannel objects referenced in the notification_channels field of this AlertPolicy. The format is:      projects/[PROJECT_ID_OR_NUMBER]/notificationChannels/[CHANNEL_ID]",
                    },
                    renotifyInterval: {
                      type: "string",
                      description: "Duration string (e.g., '1.5s', '300s')",
                    },
                  },
                  description:
                    "Control over how the notification channels in `notification_channels` are notified when this alert fires, on a per-channel basis.",
                  additionalProperties: true,
                },
                description:
                  "Control how notifications will be sent out, on a per-channel basis.",
              },
            },
            description:
              "Control over how the notification channels in `notification_channels` are notified when this alert fires.",
            additionalProperties: true,
          },
          severity: {
            type: "string",
            enum: ["SEVERITY_UNSPECIFIED", "CRITICAL", "ERROR", "WARNING"],
            description:
              "Optional. The severity of an alerting policy indicates how important incidents generated by that policy are. The severity level will be displayed on the Incident detail page and in notifications.",
          },
        },
        description:
          'A description of the conditions under which some aspect of your system is considered to be "unhealthy" and the ways to notify people or services about this state. For an overview of alerting policies, see [Introduction to Alerting](https://cloud.google.com/monitoring/alerts/).',
        additionalProperties: true,
      },
    },
  },
};

export default createAlertPolicy;
