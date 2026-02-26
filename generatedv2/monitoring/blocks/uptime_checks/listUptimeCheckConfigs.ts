import { AppBlock, events } from "@slflows/sdk/v1";
import { getUptimeCheckServiceClient } from "../../lib/grpcClient.ts";

const listUptimeCheckConfigs: AppBlock = {
  name: "List Uptime Check Configs",
  description: `Lists the existing valid Uptime check configurations for the project (leaving out any invalid configurations).`,
  category: "Uptime Checks",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) whose Uptime check configurations are listed. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) whose Uptime check configurations are listed. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            "If provided, this field specifies the criteria that must be met by uptime checks to be included in the response.  For more details, see [Filtering syntax](https://cloud.google.com/monitoring/api/v3/sorting-and-filtering#filter_syntax).",
          type: {
            type: "string",
            description:
              "If provided, this field specifies the criteria that must be met by uptime checks to be included in the response.  For more details, see [Filtering syntax](https://cloud.google.com/monitoring/api/v3/sorting-and-filtering#filter_syntax).",
          },
          required: false,
        },
        page_size: {
          name: "Page Size",
          description:
            "The maximum number of results to return in a single response. The server may further constrain the maximum number of results returned in a single page. If the page_size is <=0, the server will decide the number of results to be returned.",
          type: {
            type: "integer",
            description:
              "The maximum number of results to return in a single response. The server may further constrain the maximum number of results returned in a single page. If the page_size is <=0, the server will decide the number of results to be returned.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return more results from the previous method call.",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return more results from the previous method call.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getUptimeCheckServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listUptimeCheckConfigs(request, (err: any, response: any) => {
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
          uptime_check_configs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Identifier. A unique resource name for this Uptime check configuration. The format is:       projects/[PROJECT_ID_OR_NUMBER]/uptimeCheckConfigs/[UPTIME_CHECK_ID]  `[PROJECT_ID_OR_NUMBER]` is the Workspace host project associated with the Uptime check.  This field should be omitted when creating the Uptime check configuration; on create, the resource name is assigned by the server and included in the response.",
                },
                display_name: {
                  type: "string",
                  description:
                    "A human-friendly name for the Uptime check configuration. The display name should be unique within a Cloud Monitoring Workspace in order to make it easier to identify; however, uniqueness is not enforced. Required.",
                },
                monitored_resource: {
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
                    "The [monitored resource](https://cloud.google.com/monitoring/api/resources) associated with the configuration. The following monitored resource types are valid for this field:   `uptime_url`,   `gce_instance`,   `gae_app`,   `aws_ec2_instance`,   `aws_elb_load_balancer`   `k8s_service`   `servicedirectory_service`   `cloud_run_revision` (Part of 'resource' - only one field in this group can be set)",
                },
                resource_group: {
                  type: "object",
                  properties: {
                    group_id: {
                      type: "string",
                      description:
                        "The group of resources being monitored. Should be only the `[GROUP_ID]`, and not the full-path `projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]`.",
                    },
                    resource_type: {
                      type: "string",
                      enum: [
                        "RESOURCE_TYPE_UNSPECIFIED",
                        "INSTANCE",
                        "AWS_ELB_LOAD_BALANCER",
                      ],
                      description:
                        "The supported resource types that can be used as values of `group_resource.resource_type`. `INSTANCE` includes `gce_instance` and `aws_ec2_instance` resource types. The resource types `gae_app` and `uptime_url` are not valid here because group checks on App Engine modules and URLs are not allowed.",
                    },
                  },
                  description:
                    "The resource submessage for group checks. It can be used instead of a monitored resource, when multiple resources are being monitored. (Part of 'resource' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                synthetic_monitor: {
                  type: "object",
                  properties: {
                    cloud_function_v2: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                          description:
                            "Required. Fully qualified GCFv2 resource name i.e. `projects/{project}/locations/{location}/functions/{function}` Required.",
                        },
                        cloud_run_revision: {
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
                            "Output only. The `cloud_run_revision` Monitored Resource associated with the GCFv2. The Synthetic Monitor execution results (metrics, logs, and spans) are reported against this Monitored Resource. This field is output only.",
                        },
                      },
                      required: ["name"],
                      description:
                        "A Synthetic Monitor deployed to a Cloud Functions V2 instance.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Describes a Synthetic Monitor to be invoked by Uptime. (Part of 'resource' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                http_check: {
                  type: "object",
                  properties: {
                    request_method: {
                      type: "string",
                      enum: ["METHOD_UNSPECIFIED", "GET", "POST"],
                      description:
                        "The HTTP request method to use for the check. If set to `METHOD_UNSPECIFIED` then `request_method` defaults to `GET`.",
                    },
                    use_ssl: {
                      type: "boolean",
                      description:
                        "If `true`, use HTTPS instead of HTTP to run the check.",
                    },
                    path: {
                      type: "string",
                      description:
                        'Optional (defaults to "/"). The path to the page against which to run the check. Will be combined with the `host` (specified within the `monitored_resource`) and `port` to construct the full URL. If the provided path does not begin with "/", a "/" will be prepended automatically.',
                    },
                    port: {
                      type: "integer",
                      description:
                        "Optional (defaults to 80 when `use_ssl` is `false`, and 443 when `use_ssl` is `true`). The TCP port on the HTTP server against which to run the check. Will be combined with host (specified within the `monitored_resource`) and `path` to construct the full URL.",
                    },
                    auth_info: {
                      type: "object",
                      properties: {
                        username: {
                          type: "string",
                          description:
                            "The username to use when authenticating with the HTTP server.",
                        },
                        password: {
                          type: "string",
                          description:
                            "The password to use when authenticating with the HTTP server.",
                        },
                      },
                      description:
                        "The authentication parameters to provide to the specified resource or URL that requires a username and password. Currently, only [Basic HTTP authentication](https://tools.ietf.org/html/rfc7617) is supported in Uptime checks.",
                      additionalProperties: true,
                    },
                    mask_headers: {
                      type: "boolean",
                      description:
                        "Boolean specifying whether to encrypt the header information. Encryption should be specified for any headers related to authentication that you do not wish to be seen when retrieving the configuration. The server will be responsible for encrypting the headers. On Get/List calls, if `mask_headers` is set to `true` then the headers will be obscured with `******.`",
                    },
                    headers: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "The list of headers to send as part of the Uptime check request. If two headers have the same key and different values, they should be entered as a single header, with the value being a comma-separated list of all the desired values as described at https://www.w3.org/Protocols/rfc2616/rfc2616.txt (page 31). Entering two separate headers with the same key in a Create call will cause the first to be overwritten by the second. The maximum number of headers allowed is 100.",
                    },
                    content_type: {
                      type: "string",
                      enum: [
                        "TYPE_UNSPECIFIED",
                        "URL_ENCODED",
                        "USER_PROVIDED",
                      ],
                      description:
                        'The content type header to use for the check. The following configurations result in errors: 1. Content type is specified in both the `headers` field and the `content_type` field. 2. Request method is `GET` and `content_type` is not `TYPE_UNSPECIFIED` 3. Request method is `POST` and `content_type` is `TYPE_UNSPECIFIED`. 4. Request method is `POST` and a "Content-Type" header is provided via `headers` field. The `content_type` field should be used instead.',
                    },
                    custom_content_type: {
                      type: "string",
                      description:
                        "A user provided content type header to use for the check. The invalid configurations outlined in the `content_type` field apply to `custom_content_type`, as well as the following: 1. `content_type` is `URL_ENCODED` and `custom_content_type` is set. 2. `content_type` is `USER_PROVIDED` and `custom_content_type` is not set.",
                    },
                    validate_ssl: {
                      type: "boolean",
                      description:
                        "Boolean specifying whether to include SSL certificate validation as a part of the Uptime check. Only applies to checks where `monitored_resource` is set to `uptime_url`. If `use_ssl` is `false`, setting `validate_ssl` to `true` has no effect.",
                    },
                    body: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                    accepted_response_status_codes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          status_value: {
                            type: "integer",
                            description:
                              "A status code to accept. (Part of 'status_code' - only one field in this group can be set)",
                          },
                          status_class: {
                            type: "string",
                            enum: [
                              "STATUS_CLASS_UNSPECIFIED",
                              "STATUS_CLASS_1XX",
                              "STATUS_CLASS_2XX",
                              "STATUS_CLASS_3XX",
                              "STATUS_CLASS_4XX",
                              "STATUS_CLASS_5XX",
                              "STATUS_CLASS_ANY",
                            ],
                            description:
                              "A class of status codes to accept. (Part of 'status_code' - only one field in this group can be set)",
                          },
                        },
                        description:
                          'A status to accept. Either a status code class like "2xx", or an integer status code like "200".',
                        additionalProperties: true,
                      },
                      description:
                        "If present, the check will only pass if the HTTP response status code is in this set of status codes. If empty, the HTTP status code will only pass if the HTTP status code is 200-299.",
                    },
                    ping_config: {
                      type: "object",
                      properties: {
                        pings_count: {
                          type: "integer",
                          description:
                            "Number of ICMP pings. A maximum of 3 ICMP pings is currently supported.",
                        },
                      },
                      description:
                        "Information involved in sending ICMP pings alongside public HTTP/TCP checks. For HTTP, the pings are performed for each part of the redirect chain.",
                      additionalProperties: true,
                    },
                    service_agent_authentication: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: [
                            "SERVICE_AGENT_AUTHENTICATION_TYPE_UNSPECIFIED",
                            "OIDC_TOKEN",
                          ],
                          description: "Type of authentication.",
                        },
                      },
                      description:
                        "Contains information needed for generating either an [OpenID Connect token](https://developers.google.com/identity/protocols/OpenIDConnect) or [OAuth token](https://developers.google.com/identity/protocols/oauth2). The token will be generated for the Monitoring service agent service account.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Information involved in an HTTP/HTTPS Uptime check request. (Part of 'check_request_type' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                tcp_check: {
                  type: "object",
                  properties: {
                    port: {
                      type: "integer",
                      description:
                        "The TCP port on the server against which to run the check. Will be combined with host (specified within the `monitored_resource`) to construct the full URL. Required.",
                    },
                    ping_config: {
                      type: "object",
                      properties: {
                        pings_count: {
                          type: "integer",
                          description:
                            "Number of ICMP pings. A maximum of 3 ICMP pings is currently supported.",
                        },
                      },
                      description:
                        "Information involved in sending ICMP pings alongside public HTTP/TCP checks. For HTTP, the pings are performed for each part of the redirect chain.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Information required for a TCP Uptime check request. (Part of 'check_request_type' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                period: {
                  type: "string",
                  description: "Duration string (e.g., '1.5s', '300s')",
                },
                timeout: {
                  type: "string",
                  description: "Duration string (e.g., '1.5s', '300s')",
                },
                content_matchers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      content: {
                        type: "string",
                        description:
                          "String, regex or JSON content to match. Maximum 1024 bytes. An empty `content` string indicates no content matching is to be performed.",
                      },
                      matcher: {
                        type: "string",
                        enum: [
                          "CONTENT_MATCHER_OPTION_UNSPECIFIED",
                          "CONTAINS_STRING",
                          "NOT_CONTAINS_STRING",
                          "MATCHES_REGEX",
                          "NOT_MATCHES_REGEX",
                          "MATCHES_JSON_PATH",
                          "NOT_MATCHES_JSON_PATH",
                        ],
                        description:
                          "The type of content matcher that will be applied to the server output, compared to the `content` string when the check is run.",
                      },
                      json_path_matcher: {
                        type: "object",
                        properties: {
                          json_path: {
                            type: "string",
                            description:
                              "JSONPath within the response output pointing to the expected `ContentMatcher::content` to match against.",
                          },
                          json_matcher: {
                            type: "string",
                            enum: [
                              "JSON_PATH_MATCHER_OPTION_UNSPECIFIED",
                              "EXACT_MATCH",
                              "REGEX_MATCH",
                            ],
                            description:
                              "The type of JSONPath match that will be applied to the JSON output (`ContentMatcher.content`)",
                          },
                        },
                        description:
                          "Information needed to perform a JSONPath content match. Used for `ContentMatcherOption::MATCHES_JSON_PATH` and `ContentMatcherOption::NOT_MATCHES_JSON_PATH`.",
                        additionalProperties: true,
                      },
                    },
                    description:
                      "Optional. Used to perform content matching. This allows matching based on substrings and regular expressions, together with their negations. Only the first 4&nbsp;MB of an HTTP or HTTPS check's response (and the first 1&nbsp;MB of a TCP check's response) are examined for purposes of content matching.",
                    additionalProperties: true,
                  },
                  description:
                    "The content that is expected to appear in the data returned by the target server against which the check is run.  Currently, only the first entry in the `content_matchers` list is supported, and additional entries will be ignored. This field is optional and should only be specified if a content match is required as part of the/ Uptime check.",
                },
                checker_type: {
                  type: "string",
                  enum: [
                    "CHECKER_TYPE_UNSPECIFIED",
                    "STATIC_IP_CHECKERS",
                    "VPC_CHECKERS",
                  ],
                  description:
                    "The type of checkers to use to execute the Uptime check.",
                },
                selected_regions: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "REGION_UNSPECIFIED",
                      "USA",
                      "EUROPE",
                      "SOUTH_AMERICA",
                      "ASIA_PACIFIC",
                      "USA_OREGON",
                      "USA_IOWA",
                      "USA_VIRGINIA",
                    ],
                    description:
                      "The regions from which an Uptime check can be run.",
                  },
                  description:
                    "The list of regions from which the check will be run. Some regions contain one location, and others contain more than one. If this field is specified, enough regions must be provided to include a minimum of 3 locations.  Not specifying this field will result in Uptime checks running from all available regions.",
                },
                is_internal: {
                  type: "boolean",
                  description:
                    "If this is `true`, then checks are made only from the 'internal_checkers'. If it is `false`, then checks are made only from the 'selected_regions'. It is an error to provide 'selected_regions' when is_internal is `true`, or to provide 'internal_checkers' when is_internal is `false`.",
                },
                internal_checkers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "A unique resource name for this InternalChecker. The format is:      projects/[PROJECT_ID_OR_NUMBER]/internalCheckers/[INTERNAL_CHECKER_ID]  `[PROJECT_ID_OR_NUMBER]` is the Cloud Monitoring Metrics Scope project for the Uptime check config associated with the internal checker.",
                      },
                      display_name: {
                        type: "string",
                        description:
                          "The checker's human-readable name. The display name should be unique within a Cloud Monitoring Metrics Scope in order to make it easier to identify; however, uniqueness is not enforced.",
                      },
                      network: {
                        type: "string",
                        description:
                          'The [GCP VPC network](https://cloud.google.com/vpc/docs/vpc) where the internal resource lives (ex: "default").',
                      },
                      gcp_zone: {
                        type: "string",
                        description:
                          "The GCP zone the Uptime check should egress from. Only respected for internal Uptime checks, where internal_network is specified.",
                      },
                      peer_project_id: {
                        type: "string",
                        description:
                          "The GCP project ID where the internal checker lives. Not necessary the same as the Metrics Scope project.",
                      },
                      state: {
                        type: "string",
                        enum: ["UNSPECIFIED", "CREATING", "RUNNING"],
                        description:
                          "The current operational state of the internal checker.",
                      },
                    },
                    description:
                      "An internal checker allows Uptime checks to run on private/internal GCP resources.",
                    additionalProperties: true,
                  },
                  description:
                    "The internal checkers that this check will egress from. If `is_internal` is `true` and this list is empty, the check will egress from all the InternalCheckers configured for the project that owns this `UptimeCheckConfig`.",
                },
                user_labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "User-supplied key/value data to be used for organizing and identifying the `UptimeCheckConfig` objects.  The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
                },
              },
              description:
                "This message configures which resources and services to monitor for availability.",
              additionalProperties: true,
            },
            description: "The returned Uptime check configurations.",
          },
          next_page_token: {
            type: "string",
            description:
              "This field represents the pagination token to retrieve the next page of results. If the value is empty, it means no further results for the request. To retrieve the next page of results, the value of the next_page_token is passed to the subsequent List method call (in the request message's page_token field).",
          },
          total_size: {
            type: "integer",
            description:
              "The total number of Uptime check configurations for the project, irrespective of any pagination.",
          },
        },
        description: "The protocol for the `ListUptimeCheckConfigs` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listUptimeCheckConfigs;
