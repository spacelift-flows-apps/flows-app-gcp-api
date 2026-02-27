import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const regionAutoscalersPatch: AppBlock = {
  name: "Region Autoscalers - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Region Autoscalers",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] URL of theregion where the instance group resides (for autoscalers living in regional scope).",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of theregion where the instance group resides (for autoscalers living in regional scope).",
          },
          required: false,
        },
        autoscalingPolicy: {
          name: "Autoscaling Policy",
          description:
            "The configuration parameters for the autoscaling algorithm. You can define one or more signals for an autoscaler: cpuUtilization,customMetricUtilizations, andloadBalancingUtilization.  If none of these are specified, the default will be to autoscale based oncpuUtilization to 0.6 or 60%.",
          type: {
            type: "object",
            properties: {
              coolDownPeriodSec: {
                type: "integer",
                description:
                  "The number of seconds that your application takes to initialize on a VM instance. This is referred to as the [initialization period](/compute/docs/autoscaler#cool_down_period). Specifying an accurate initialization period improves autoscaler decisions. For example, when scaling out, the autoscaler ignores data from VMs that are still initializing because those VMs might not yet represent normal usage of your application. The default initialization period is 60 seconds.  Initialization periods might vary because of numerous factors. We recommend that you test how long your application takes to initialize. To do this, create a VM and time your application's startup process.",
              },
              cpuUtilization: {
                type: "object",
                properties: {
                  predictiveMethod: {
                    type: "string",
                    enum: [
                      "UNDEFINED_PREDICTIVE_METHOD",
                      "NONE",
                      "OPTIMIZE_AVAILABILITY",
                    ],
                    description:
                      "Indicates whether predictive autoscaling based on CPU metric is enabled. Valid values are:  * NONE (default). No predictive method is used. The autoscaler scales the group to meet current demand based on real-time metrics. * OPTIMIZE_AVAILABILITY. Predictive autoscaling improves availability by monitoring daily and weekly load patterns and scaling out ahead of anticipated demand. Check the PredictiveMethod enum for the list of possible values.",
                  },
                  utilizationTarget: {
                    type: "number",
                    description:
                      "The target CPU utilization that the autoscaler maintains. Must be a float value in the range (0, 1]. If not specified, the default is0.6.  If the CPU level is below the target utilization, the autoscaler scales in the number of instances until it reaches the minimum number of instances you specified or until the average CPU of your instances reaches the target utilization.  If the average CPU is above the target utilization, the autoscaler scales out until it reaches the maximum number of instances you specified or until the average utilization reaches the target utilization.",
                  },
                },
                description: "CPU utilization policy.",
                additionalProperties: true,
              },
              customMetricUtilizations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    filter: {
                      type: "string",
                      description:
                        "A filter string, compatible with a Stackdriver Monitoringfilter string forTimeSeries.list API call. This filter is used to select a specific TimeSeries for the purpose of autoscaling and to determine whether the metric is exporting per-instance or per-group data.  For the filter to be valid for autoscaling purposes, the following rules apply:       - You can only use the AND operator for joining        selectors.     - You can only use direct equality comparison operator        (=) without any functions for each selector.     - You can specify the metric in both the filter string and in the        metric field. However, if specified in both places, the metric must        be identical.     - The monitored resource type        determines what kind of values are expected for the metric. If it is        a gce_instance, the autoscaler expects the metric to        include a separate TimeSeries for each instance in a group. In such a        case, you cannot filter on resource labels.      If the resource type is any other value, the autoscaler expects        this metric to contain values that apply to the entire autoscaled        instance group and resource label filtering can be performed to        point autoscaler at the correct TimeSeries to scale upon. This is        called a *per-group metric* for the purpose of autoscaling.         If not specified, the type defaults to        gce_instance.    Try to provide a filter that is selective enough to pick just one TimeSeries for the autoscaled group or for each of the instances (if you are using gce_instance resource type). If multiple TimeSeries are returned upon the query execution, the autoscaler will sum their respective values to obtain its scaling value.",
                    },
                    metric: {
                      type: "string",
                      description:
                        "The identifier (type) of the Stackdriver Monitoring metric. The metric cannot have negative values.  The metric must have a value type of INT64 orDOUBLE.",
                    },
                    singleInstanceAssignment: {
                      type: "number",
                      description:
                        "If scaling is based on a per-group metric value that represents the total amount of work to be done or resource usage, set this value to an amount assigned for a single instance of the scaled group. Autoscaler keeps the number of instances proportional to the value of this metric. The metric itself does not change value due to group resizing.  A good metric to use with the target is for examplepubsub.googleapis.com/subscription/num_undelivered_messages or a custom metric exporting the total number of requests coming to your instances.  A bad example would be a metric exporting an average or median latency, since this value can't include a chunk assignable to a single instance, it could be better used with utilization_target instead.",
                    },
                    utilizationTarget: {
                      type: "number",
                      description:
                        "The target value of the metric that autoscaler maintains. This must be a positive value. A utilization metric scales number of virtual machines handling requests to increase or decrease proportionally to the metric.  For example, a good metric to use as a utilization_target ishttps://www.googleapis.com/compute/v1/instance/network/received_bytes_count. The autoscaler works to keep this value constant for each of the instances.",
                    },
                    utilizationTargetType: {
                      type: "string",
                      enum: [
                        "UNDEFINED_UTILIZATION_TARGET_TYPE",
                        "DELTA_PER_MINUTE",
                        "DELTA_PER_SECOND",
                        "GAUGE",
                      ],
                      description:
                        "Defines how target utilization value is expressed for a Stackdriver Monitoring metric. Either GAUGE,DELTA_PER_SECOND, or DELTA_PER_MINUTE. Check the UtilizationTargetType enum for the list of possible values.",
                    },
                  },
                  description: "Custom utilization metric policy.",
                  additionalProperties: true,
                },
                description:
                  "Configuration parameters of autoscaling based on a custom metric.",
              },
              loadBalancingUtilization: {
                type: "object",
                properties: {
                  utilizationTarget: {
                    type: "number",
                    description:
                      "Fraction of backend capacity utilization (set in HTTP(S) load balancing configuration) that the autoscaler maintains. Must be a positive float value. If not defined, the default is 0.8.",
                  },
                },
                description:
                  "Configuration parameters of autoscaling based on load balancing.",
                additionalProperties: true,
              },
              maxNumReplicas: {
                type: "integer",
                description:
                  "The maximum number of instances that the autoscaler can scale out to. This is required when creating or updating an autoscaler. The maximum number of replicas must not be lower than minimal number of replicas.",
              },
              minNumReplicas: {
                type: "integer",
                description:
                  "The minimum number of replicas that the autoscaler can scale in to. This cannot be less than 0. If not provided, autoscaler chooses a default value depending on maximum number of instances allowed.",
              },
              mode: {
                type: "string",
                enum: [
                  "UNDEFINED_MODE",
                  "OFF",
                  "ON",
                  "ONLY_SCALE_OUT",
                  "ONLY_UP",
                ],
                description:
                  'Defines the operating mode for this policy. The following modes are available:     - OFF: Disables the autoscaler but maintains its    configuration.    - ONLY_SCALE_OUT: Restricts the autoscaler to add    VM instances only.    - ON: Enables all autoscaler activities according to its    policy.   For more information, see "Turning off or restricting an autoscaler" Check the Mode enum for the list of possible values.',
              },
              scaleInControl: {
                type: "object",
                properties: {
                  maxScaledInReplicas: {
                    type: "object",
                    properties: {
                      calculated: {
                        type: "integer",
                        description:
                          "Output only. [Output Only] Absolute value of VM instances calculated based on the specific mode.        - If the value is fixed, then the calculated      value is equal to the fixed value.     - If the value is a percent, then the     calculated      value is percent/100 * targetSize. For example,      the calculated value of a 80% of a managed instance group      with 150 instances would be (80/100 * 150) = 120 VM instances. If there      is a remainder, the number is rounded.",
                      },
                      fixed: {
                        type: "integer",
                        description:
                          "Specifies a fixed number of VM instances. This must be a positive integer.",
                      },
                      percent: {
                        type: "integer",
                        description:
                          "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
                      },
                    },
                    description:
                      "Encapsulates numeric value that can be either absolute or relative.",
                    additionalProperties: true,
                  },
                  timeWindowSec: {
                    type: "integer",
                    description:
                      "How far back autoscaling looks when computing recommendations to include directives regarding slower scale in, as described above.",
                  },
                },
                description:
                  "Configuration that allows for slower scale in so that even if Autoscaler recommends an abrupt scale in of a MIG, it will be throttled as specified by the parameters below.",
                additionalProperties: true,
              },
              scalingSchedules: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Scaling schedules defined for an autoscaler. Multiple schedules can be set on an autoscaler, and they can overlap. During overlapping periods the greatest min_required_replicas of all scaling schedules is applied. Up to 128 scaling schedules are allowed.",
              },
            },
            description: "Cloud Autoscaler policy.",
            additionalProperties: true,
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Always compute#autoscaler for autoscalers.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#autoscaler for autoscalers.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        recommendedSize: {
          name: "Recommended Size",
          description:
            "Output only. [Output Only] Target recommended MIG size (number of instances) computed by autoscaler. Autoscaler calculates the recommended MIG size even when the autoscaling policy mode is different from ON. This field is empty when autoscaler is not connected to an existing managed instance group or autoscaler did not generate its prediction.",
          type: {
            type: "integer",
            description:
              "Output only. [Output Only] Target recommended MIG size (number of instances) computed by autoscaler. Autoscaler calculates the recommended MIG size even when the autoscaling policy mode is different from ON. This field is empty when autoscaler is not connected to an existing managed instance group or autoscaler did not generate its prediction.",
          },
          required: false,
        },
        scalingScheduleStatus: {
          name: "Scaling Schedule Status",
          description:
            "Output only. [Output Only] Status information of existing scaling schedules.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Output only. [Output Only] Status information of existing scaling schedules.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        status: {
          name: "Status",
          description:
            "[Output Only] The status of the autoscaler configuration. Current set of possible values:     - PENDING:      Autoscaler backend hasn't read new/updated configuration.    - DELETING:      Configuration is being deleted.    - ACTIVE:      Configuration is acknowledged to be effective. Some warnings might      be present in the statusDetails field.    - ERROR:      Configuration has errors. Actionable for users. Details are present in      the statusDetails field.   New values might be added in the future. Check the Status enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_STATUS",
              "ACTIVE",
              "DELETING",
              "ERROR",
              "PENDING",
            ],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          required: false,
        },
        statusDetails: {
          name: "Status Details",
          description:
            "[Output Only] Human-readable details about the current state of the autoscaler. Read the documentation forCommonly returned status messages for examples of status messages you might encounter.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "The status message.",
                },
                type: {
                  type: "string",
                  enum: [
                    "UNDEFINED_TYPE",
                    "ALL_INSTANCES_UNHEALTHY",
                    "BACKEND_SERVICE_DOES_NOT_EXIST",
                    "CAPPED_AT_MAX_NUM_REPLICAS",
                    "CUSTOM_METRIC_DATA_POINTS_TOO_SPARSE",
                    "CUSTOM_METRIC_INVALID",
                    "MIN_EQUALS_MAX",
                    "MISSING_CUSTOM_METRIC_DATA_POINTS",
                    "MISSING_LOAD_BALANCING_DATA_POINTS",
                    "MODE_OFF",
                    "MODE_ONLY_SCALE_OUT",
                    "MODE_ONLY_UP",
                    "MORE_THAN_ONE_BACKEND_SERVICE",
                    "NOT_ENOUGH_QUOTA_AVAILABLE",
                    "REGION_RESOURCE_STOCKOUT",
                    "SCALING_TARGET_DOES_NOT_EXIST",
                    "SCHEDULED_INSTANCES_GREATER_THAN_AUTOSCALER_MAX",
                    "SCHEDULED_INSTANCES_LESS_THAN_AUTOSCALER_MIN",
                    "UNKNOWN",
                    "UNSUPPORTED_MAX_RATE_LOAD_BALANCING_CONFIGURATION",
                    "ZONE_RESOURCE_STOCKOUT",
                  ],
                  description:
                    "The type of error, warning, or notice returned. Current set of possible values:     - ALL_INSTANCES_UNHEALTHY (WARNING):      All instances in the instance group are unhealthy (not in RUNNING      state).    - BACKEND_SERVICE_DOES_NOT_EXIST (ERROR):      There is no backend service attached to the instance group.    - CAPPED_AT_MAX_NUM_REPLICAS (WARNING):      Autoscaler recommends a size greater than maxNumReplicas.    - CUSTOM_METRIC_DATA_POINTS_TOO_SPARSE (WARNING):      The custom metric samples are not exported often enough to be      a credible base for autoscaling.    - CUSTOM_METRIC_INVALID (ERROR):      The custom metric that was specified does not exist or does not have      the necessary labels.    - MIN_EQUALS_MAX (WARNING):      The minNumReplicas is equal to maxNumReplicas. This means the      autoscaler cannot add or remove instances from the instance group.    - MISSING_CUSTOM_METRIC_DATA_POINTS (WARNING):      The autoscaler did not receive any data from the custom metric      configured for autoscaling.    - MISSING_LOAD_BALANCING_DATA_POINTS (WARNING):      The autoscaler is configured to scale based on a load balancing signal      but the instance group has not received any requests from the load      balancer.    - MODE_OFF (WARNING):      Autoscaling is turned off. The number of instances in the group won't      change automatically. The autoscaling configuration is preserved.    - MODE_ONLY_UP (WARNING):      Autoscaling is in the \"Autoscale only out\" mode. The autoscaler can add      instances but not remove any.    - MORE_THAN_ONE_BACKEND_SERVICE (ERROR):      The instance group cannot be autoscaled because it has more than one      backend service attached to it.    - NOT_ENOUGH_QUOTA_AVAILABLE (ERROR):      There is insufficient quota for the necessary resources, such as CPU or      number of instances.    - REGION_RESOURCE_STOCKOUT (ERROR):      Shown only for regional autoscalers: there is a resource stockout in      the chosen region.    - SCALING_TARGET_DOES_NOT_EXIST (ERROR):      The target to be scaled does not exist.    - UNSUPPORTED_MAX_RATE_LOAD_BALANCING_CONFIGURATION      (ERROR): Autoscaling does not work with an HTTP/S load balancer that      has been configured for maxRate.    - ZONE_RESOURCE_STOCKOUT (ERROR):      For zonal autoscalers: there is a resource stockout in the chosen zone.      For regional autoscalers: in at least one of the zones you're using      there is a resource stockout.   New values might be added in the future. Some of the values might not be available in all API versions. Check the Type enum for the list of possible values.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] Human-readable details about the current state of the autoscaler. Read the documentation forCommonly returned status messages for examples of status messages you might encounter.",
          },
          required: false,
        },
        target: {
          name: "Target",
          description:
            "URL of the managed instance group that this autoscaler will scale. This field is required when creating an autoscaler.",
          type: {
            type: "string",
            description:
              "URL of the managed instance group that this autoscaler will scale. This field is required when creating an autoscaler.",
          },
          required: false,
        },
        zone: {
          name: "Zone",
          description:
            "Output only. [Output Only] URL of thezone where the instance group resides (for autoscalers living in zonal scope).",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of thezone where the instance group resides (for autoscalers living in zonal scope).",
          },
          required: false,
        },
        autoscaler: {
          name: "Autoscaler",
          description: "Name of the autoscaler to patch.",
          type: {
            type: "string",
            description: "Name of the autoscaler to patch.",
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
            description:
              "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.autoscaler !== undefined)
          queryParams["autoscaler"] = String(
            input.event.inputConfig.autoscaler,
          );
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.autoscalingPolicy !== undefined)
          body.autoscalingPolicy = input.event.inputConfig.autoscalingPolicy;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.recommendedSize !== undefined)
          body.recommendedSize = input.event.inputConfig.recommendedSize;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.scalingScheduleStatus !== undefined)
          body.scalingScheduleStatus =
            input.event.inputConfig.scalingScheduleStatus;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.status !== undefined)
          body.status = input.event.inputConfig.status;
        if (input.event.inputConfig.statusDetails !== undefined)
          body.statusDetails = input.event.inputConfig.statusDetails;
        if (input.event.inputConfig.target !== undefined)
          body.target = input.event.inputConfig.target;
        if (input.event.inputConfig.zone !== undefined)
          body.zone = input.event.inputConfig.zone;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/autoscalers",
          pathParams,
          queryParams,
          body: Object.keys(body).length > 0 ? body : undefined,
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
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339 text format.",
          },
          error: {
            type: "object",
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      description:
                        "[Output Only] The error type identifier for this error.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          errorInfo: {
                            type: "object",
                            properties: {
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain is typically the registered service name of the tool or product that generates the error. Example: "pubsub.googleapis.com". If the error is generated by some common infrastructure, the error domain must be a globally unique value that identifies the infrastructure. For Google API infrastructure, the error domain is "googleapis.com".',
                              },
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.  Keys must match a regular expression of `a-z+` but should ideally be lowerCamelCase. Also, they must be limited to 64 characters in length. When identifying the current value of an exceeded limit, the units should be contained in the key, not the value.  For example, rather than `{"instanceLimit": "100/request"}`, should be returned as, `{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of instances that can be created in a single (batch) request.',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the proximate cause of the error. Error reasons are unique within a particular domain of errors. This should be at most 63 characters and match a regular expression of `A-Z+[A-Z0-9]`, which represents UPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.  Example of an error when contacting the "pubsub.googleapis.com" API when it is not enabled:      { "reason": "API_DISABLED"       "domain": "googleapis.com"       "metadata": {         "resource": "projects/123",         "service": "pubsub.googleapis.com"       }     }  This response indicates that the pubsub.googleapis.com API is not enabled.  Example of an error that is returned when attempting to create a Spanner instance in a region that is out of stock:      { "reason": "STOCKOUT"       "domain": "spanner.googleapis.com",       "metadata": {         "availableRegions": "us-central1,us-east2"       }     }',
                            additionalProperties: true,
                          },
                          help: {
                            type: "object",
                            properties: {
                              links: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                  },
                                  description: "Describes a URL link.",
                                  additionalProperties: true,
                                },
                                description:
                                  "URL(s) pointing to additional information on handling the current error.",
                              },
                            },
                            description:
                              "Provides links to documentation or for performing an out of band action.  For example, if a quota check failed with an error indicating the calling project hasn't enabled the accessed service, this can contain a URL pointing directly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                          localizedMessage: {
                            type: "object",
                            properties: {
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at https://www.rfc-editor.org/rfc/bcp/bcp47.txt. Examples are: "en-US", "fr-CH", "es-MX"',
                              },
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user which can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_ROLLOUT_STATUS",
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit. Check the RolloutStatus enum for the list of possible values.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error details. There is a set of defined message types to use for providing details.The syntax depends on the error code. For example, QuotaExceededInfo will have details when the error code is QUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error. This property is optional.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this operation.",
              },
            },
            description:
              "Output only. Errors that prevented the ResizeRequest to be fulfilled.",
            additionalProperties: true,
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always `compute#operation` for Operation resources.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          operationGroupId: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`, `update`, or `delete`, and so on.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only applicable when performing regional operations.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "[Output Only] Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] If the operation is for projects.setCommonInstanceMetadata, this field will contain information on all underlying zonal actions and their state.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server. This value is inRFC3339 text format.",
          },
          status: {
            type: "string",
            enum: ["UNDEFINED_STATUS", "DONE", "PENDING", "RUNNING"],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          targetId: {
            type: "string",
            description: "64-bit integer as string",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the disk that the snapshot was created from.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example: `user@example.com` or `alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "UNDEFINED_CODE",
                    "CLEANUP_FAILED",
                    "DEPRECATED_RESOURCE_USED",
                    "DEPRECATED_TYPE_USED",
                    "DISK_SIZE_LARGER_THAN_IMAGE_SIZE",
                    "EXPERIMENTAL_TYPE_USED",
                    "EXTERNAL_API_WARNING",
                    "FIELD_VALUE_OVERRIDEN",
                    "INJECTED_KERNELS_DEPRECATED",
                    "INVALID_HEALTH_CHECK_FOR_DYNAMIC_WIEGHTED_LB",
                    "LARGE_DEPLOYMENT_WARNING",
                    "LIST_OVERHEAD_QUOTA_EXCEED",
                    "MISSING_TYPE_DEPENDENCY",
                    "NEXT_HOP_ADDRESS_NOT_ASSIGNED",
                    "NEXT_HOP_CANNOT_IP_FORWARD",
                    "NEXT_HOP_INSTANCE_HAS_NO_IPV6_INTERFACE",
                    "NEXT_HOP_INSTANCE_NOT_FOUND",
                    "NEXT_HOP_INSTANCE_NOT_ON_NETWORK",
                    "NEXT_HOP_NOT_RUNNING",
                    "NOT_CRITICAL_ERROR",
                    "NO_RESULTS_ON_PAGE",
                    "PARTIAL_SUCCESS",
                    "QUOTA_INFO_UNAVAILABLE",
                    "REQUIRED_TOS_AGREEMENT",
                    "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING",
                    "RESOURCE_NOT_DELETED",
                    "SCHEMA_VALIDATION_IGNORED",
                    "SINGLE_INSTANCE_PROPERTY_TEMPLATE",
                    "UNDECLARED_PROPERTIES",
                    "UNREACHABLE",
                  ],
                  description:
                    "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
                      },
                      value: {
                        type: "string",
                        description:
                          "[Output Only] A warning data value corresponding to the key.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                },
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the operation, this field will be populated.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only applicable when performing per-zone operations.",
          },
        },
        description:
          "Represents an Operation resource.  Google Compute Engine has three Operation resources:  * [Global](/compute/docs/reference/rest/v1/globalOperations) * [Regional](/compute/docs/reference/rest/v1/regionOperations) * [Zonal](/compute/docs/reference/rest/v1/zoneOperations)  You can use an operation resource to manage asynchronous API requests. For more information, readHandling API responses.  Operations can be global, regional or zonal.     - For global operations, use the `globalOperations`    resource.    - For regional operations, use the    `regionOperations` resource.    - For zonal operations, use    the `zoneOperations` resource.    For more information, read Global, Regional, and Zonal Resources.  Note that completed Operation resources have a limited retention period.",
        additionalProperties: true,
      },
    },
  },
};

export default regionAutoscalersPatch;
