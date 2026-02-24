import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const uptimeCheckConfigsPatch: AppBlock = {
  name: "Uptime Check Configs - Patch",
  description: `Updates an Uptime check configuration.`,
  category: "Uptime Check Configs",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Identifier.",
          type: {
            type: "string",
            description:
              "Identifier. A unique resource name for this Uptime check configuration. The format is: projects/[PROJECT_ID_OR_NUMBER]/uptimeCheckConfigs/[UPTIME_CHECK_ID] [PROJECT_ID_OR_NUMBER] is the Workspace host project associated with the Uptime check.This field should be omitted when creating the Uptime check configuration; on create, the resource name is assigned by the server and included in the response.",
          },
          required: false,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "Optional. If present, only the listed fields in the current Uptime check configuration are updated with values from the new configuration. If this field is empty, then the current configuration is completely replaced with the new configuration.",
          type: {
            type: "string",
          },
          required: false,
        },
        displayName: {
          name: "Display Name",
          description:
            "A human-friendly name for the Uptime check configuration.",
          type: {
            type: "string",
            description:
              "A human-friendly name for the Uptime check configuration. The display name should be unique within a Cloud Monitoring Workspace in order to make it easier to identify; however, uniqueness is not enforced. Required.",
          },
          required: false,
        },
        monitoredResource: {
          name: "Monitored Resource",
          description: "The monitored resource (https://cloud.",
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
        resourceGroup: {
          name: "Resource Group",
          description: "The group resource associated with the configuration.",
          type: {
            type: "object",
            properties: {
              groupId: {
                type: "string",
                description:
                  "The group of resources being monitored. Should be only the [GROUP_ID], and not the full-path projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID].",
              },
              resourceType: {
                type: "string",
                enum: [
                  "RESOURCE_TYPE_UNSPECIFIED",
                  "INSTANCE",
                  "AWS_ELB_LOAD_BALANCER",
                ],
                description: "The resource type of the group members.",
              },
            },
            description:
              "The resource submessage for group checks. It can be used instead of a monitored resource, when multiple resources are being monitored.",
            additionalProperties: true,
          },
          required: false,
        },
        syntheticMonitor: {
          name: "Synthetic Monitor",
          description: "Specifies a Synthetic Monitor to invoke.",
          type: {
            type: "object",
            properties: {
              cloudFunctionV2: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "Required. Fully qualified GCFv2 resource name i.e. projects/{project}/locations/{location}/functions/{function} Required.",
                  },
                  cloudRunRevision: {
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
                },
                description:
                  "A Synthetic Monitor deployed to a Cloud Functions V2 instance.",
                additionalProperties: true,
              },
            },
            description:
              "Describes a Synthetic Monitor to be invoked by Uptime.",
            additionalProperties: true,
          },
          required: false,
        },
        httpCheck: {
          name: "HTTP Check",
          description:
            "Contains information needed to make an HTTP or HTTPS check.",
          type: {
            type: "object",
            properties: {
              requestMethod: {
                type: "string",
                enum: ["METHOD_UNSPECIFIED", "GET", "POST"],
                description:
                  "The HTTP request method to use for the check. If set to METHOD_UNSPECIFIED then request_method defaults to GET.",
              },
              useSsl: {
                type: "boolean",
                description:
                  "If true, use HTTPS instead of HTTP to run the check.",
              },
              path: {
                type: "string",
                description:
                  'Optional (defaults to "/"). The path to the page against which to run the check. Will be combined with the host (specified within the monitored_resource) and port to construct the full URL. If the provided path does not begin with "/", a "/" will be prepended automatically.',
              },
              port: {
                type: "integer",
                description:
                  "Optional (defaults to 80 when use_ssl is false, and 443 when use_ssl is true). The TCP port on the HTTP server against which to run the check. Will be combined with host (specified within the monitored_resource) and path to construct the full URL. (Format: int32)",
              },
              authInfo: {
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
                  "The authentication parameters to provide to the specified resource or URL that requires a username and password. Currently, only Basic HTTP authentication (https://tools.ietf.org/html/rfc7617) is supported in Uptime checks.",
                additionalProperties: true,
              },
              maskHeaders: {
                type: "boolean",
                description:
                  "Boolean specifying whether to encrypt the header information. Encryption should be specified for any headers related to authentication that you do not wish to be seen when retrieving the configuration. The server will be responsible for encrypting the headers. On Get/List calls, if mask_headers is set to true then the headers will be obscured with ******.",
              },
              headers: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "The list of headers to send as part of the Uptime check request. If two headers have the same key and different values, they should be entered as a single header, with the value being a comma-separated list of all the desired values as described at https://www.w3.org/Protocols/rfc2616/rfc2616.txt (page 31). Entering two separate headers with the same key in a Create call will cause the first to be overwritten by the second. The maximum number of headers allowed is 100.",
              },
              contentType: {
                type: "string",
                enum: ["TYPE_UNSPECIFIED", "URL_ENCODED", "USER_PROVIDED"],
                description:
                  'The content type header to use for the check. The following configurations result in errors: 1. Content type is specified in both the headers field and the content_type field. 2. Request method is GET and content_type is not TYPE_UNSPECIFIED 3. Request method is POST and content_type is TYPE_UNSPECIFIED. 4. Request method is POST and a "Content-Type" header is provided via headers field. The content_type field should be used instead.',
              },
              customContentType: {
                type: "string",
                description:
                  "A user provided content type header to use for the check. The invalid configurations outlined in the content_type field apply to custom_content_type, as well as the following: 1. content_type is URL_ENCODED and custom_content_type is set. 2. content_type is USER_PROVIDED and custom_content_type is not set.",
              },
              validateSsl: {
                type: "boolean",
                description:
                  "Boolean specifying whether to include SSL certificate validation as a part of the Uptime check. Only applies to checks where monitored_resource is set to uptime_url. If use_ssl is false, setting validate_ssl to true has no effect.",
              },
              body: {
                type: "string",
                description:
                  "The request body associated with the HTTP POST request. If content_type is URL_ENCODED, the body passed in must be URL-encoded. Users can provide a Content-Length header via the headers field or the API will do so. If the request_method is GET and body is not empty, the API will return an error. The maximum byte size is 1 megabyte.Note: If client libraries aren't used (which performs the conversion automatically) base64 encode your body data since the field is of bytes type. (Format: byte)",
              },
              acceptedResponseStatusCodes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    statusValue: {
                      type: "integer",
                      description: "A status code to accept. (Format: int32)",
                    },
                    statusClass: {
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
                      description: "A class of status codes to accept.",
                    },
                  },
                  description:
                    'A status to accept. Either a status code class like "2xx", or an integer status code like "200".',
                  additionalProperties: true,
                },
                description:
                  "If present, the check will only pass if the HTTP response status code is in this set of status codes. If empty, the HTTP status code will only pass if the HTTP status code is 200-299.",
              },
              pingConfig: {
                type: "object",
                properties: {
                  pingsCount: {
                    type: "integer",
                    description:
                      "Number of ICMP pings. A maximum of 3 ICMP pings is currently supported. (Format: int32)",
                  },
                },
                description:
                  "Information involved in sending ICMP pings alongside public HTTP/TCP checks. For HTTP, the pings are performed for each part of the redirect chain.",
                additionalProperties: true,
              },
              serviceAgentAuthentication: {
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
                  "Contains information needed for generating either an OpenID Connect token (https://developers.google.com/identity/protocols/OpenIDConnect) or OAuth token (https://developers.google.com/identity/protocols/oauth2). The token will be generated for the Monitoring service agent service account.",
                additionalProperties: true,
              },
            },
            description:
              "Information involved in an HTTP/HTTPS Uptime check request.",
            additionalProperties: true,
          },
          required: false,
        },
        tcpCheck: {
          name: "TCP Check",
          description: "Contains information needed to make a TCP check.",
          type: {
            type: "object",
            properties: {
              port: {
                type: "integer",
                description:
                  "The TCP port on the server against which to run the check. Will be combined with host (specified within the monitored_resource) to construct the full URL. Required. (Format: int32)",
              },
              pingConfig: {
                type: "object",
                properties: {
                  pingsCount: {
                    type: "integer",
                    description:
                      "Number of ICMP pings. A maximum of 3 ICMP pings is currently supported. (Format: int32)",
                  },
                },
                description:
                  "Information involved in sending ICMP pings alongside public HTTP/TCP checks. For HTTP, the pings are performed for each part of the redirect chain.",
                additionalProperties: true,
              },
            },
            description: "Information required for a TCP Uptime check request.",
            additionalProperties: true,
          },
          required: false,
        },
        period: {
          name: "Period",
          description: "How often, in seconds, the Uptime check is performed.",
          type: {
            type: "string",
            description:
              "How often, in seconds, the Uptime check is performed. Currently, the only supported values are 60s (1 minute), 300s (5 minutes), 600s (10 minutes), and 900s (15 minutes). Optional, defaults to 60s. (Format: google-duration)",
          },
          required: false,
        },
        timeout: {
          name: "Timeout",
          description:
            "The maximum amount of time to wait for the request to complete (must be between 1 and 60 seconds).",
          type: {
            type: "string",
            description:
              "The maximum amount of time to wait for the request to complete (must be between 1 and 60 seconds). Required. (Format: google-duration)",
          },
          required: false,
        },
        contentMatchers: {
          name: "Content Matchers",
          description:
            "The content that is expected to appear in the data returned by the target server against which the check is run.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description:
                    "String, regex or JSON content to match. Maximum 1024 bytes. An empty content string indicates no content matching is to be performed.",
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
                    "The type of content matcher that will be applied to the server output, compared to the content string when the check is run.",
                },
                jsonPathMatcher: {
                  type: "object",
                  properties: {
                    jsonPath: {
                      type: "string",
                      description:
                        "JSONPath within the response output pointing to the expected ContentMatcher::content to match against.",
                    },
                    jsonMatcher: {
                      type: "string",
                      enum: [
                        "JSON_PATH_MATCHER_OPTION_UNSPECIFIED",
                        "EXACT_MATCH",
                        "REGEX_MATCH",
                      ],
                      description:
                        "The type of JSONPath match that will be applied to the JSON output (ContentMatcher.content)",
                    },
                  },
                  description:
                    "Information needed to perform a JSONPath content match. Used for ContentMatcherOption::MATCHES_JSON_PATH and ContentMatcherOption::NOT_MATCHES_JSON_PATH.",
                  additionalProperties: true,
                },
              },
              description:
                "Optional. Used to perform content matching. This allows matching based on substrings and regular expressions, together with their negations. Only the first 4 MB of an HTTP or HTTPS check's response (and the first 1 MB of a TCP check's response) are examined for purposes of content matching.",
              additionalProperties: true,
            },
            description:
              "The content that is expected to appear in the data returned by the target server against which the check is run. Currently, only the first entry in the content_matchers list is supported, and additional entries will be ignored. This field is optional and should only be specified if a content match is required as part of the/ Uptime check.",
          },
          required: false,
        },
        checkerType: {
          name: "Checker Type",
          description:
            "The type of checkers to use to execute the Uptime check.",
          type: {
            type: "string",
            enum: [
              "CHECKER_TYPE_UNSPECIFIED",
              "STATIC_IP_CHECKERS",
              "VPC_CHECKERS",
            ],
            description:
              "The type of checkers to use to execute the Uptime check.",
          },
          required: false,
        },
        disabled: {
          name: "Disabled",
          description: "Whether the check is disabled or not.",
          type: {
            type: "boolean",
            description: "Whether the check is disabled or not.",
          },
          required: false,
        },
        selectedRegions: {
          name: "Selected Regions",
          description: "The list of regions from which the check will be run.",
          type: {
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
            },
            description:
              "The list of regions from which the check will be run. Some regions contain one location, and others contain more than one. If this field is specified, enough regions must be provided to include a minimum of 3 locations. Not specifying this field will result in Uptime checks running from all available regions.",
          },
          required: false,
        },
        logCheckFailures: {
          name: "Log Check Failures",
          description:
            "To specify whether to log the results of failed probes to Cloud Logging.",
          type: {
            type: "boolean",
            description:
              "To specify whether to log the results of failed probes to Cloud Logging.",
          },
          required: false,
        },
        isInternal: {
          name: "Is Internal",
          description:
            "If this is true, then checks are made only from the 'internal_checkers'.",
          type: {
            type: "boolean",
            description:
              "If this is true, then checks are made only from the 'internal_checkers'. If it is false, then checks are made only from the 'selected_regions'. It is an error to provide 'selected_regions' when is_internal is true, or to provide 'internal_checkers' when is_internal is false.",
          },
          required: false,
        },
        internalCheckers: {
          name: "Internal Checkers",
          description:
            "The internal checkers that this check will egress from.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "A unique resource name for this InternalChecker. The format is: projects/[PROJECT_ID_OR_NUMBER]/internalCheckers/[INTERNAL_CHECKER_ID] [PROJECT_ID_OR_NUMBER] is the Cloud Monitoring Metrics Scope project for the Uptime check config associated with the internal checker.",
                },
                displayName: {
                  type: "string",
                  description:
                    "The checker's human-readable name. The display name should be unique within a Cloud Monitoring Metrics Scope in order to make it easier to identify; however, uniqueness is not enforced.",
                },
                network: {
                  type: "string",
                  description:
                    'The GCP VPC network (https://cloud.google.com/vpc/docs/vpc) where the internal resource lives (ex: "default").',
                },
                gcpZone: {
                  type: "string",
                  description:
                    "The GCP zone the Uptime check should egress from. Only respected for internal Uptime checks, where internal_network is specified.",
                },
                peerProjectId: {
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
              "The internal checkers that this check will egress from. If is_internal is true and this list is empty, the check will egress from all the InternalCheckers configured for the project that owns this UptimeCheckConfig.",
          },
          required: false,
        },
        userLabels: {
          name: "User Labels",
          description:
            "User-supplied key/value data to be used for organizing and identifying the UptimeCheckConfig objects.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "User-supplied key/value data to be used for organizing and identifying the UptimeCheckConfig objects.The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
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
        if (input.event.inputConfig.monitoredResource !== undefined)
          requestBody.monitoredResource =
            input.event.inputConfig.monitoredResource;
        if (input.event.inputConfig.resourceGroup !== undefined)
          requestBody.resourceGroup = input.event.inputConfig.resourceGroup;
        if (input.event.inputConfig.syntheticMonitor !== undefined)
          requestBody.syntheticMonitor =
            input.event.inputConfig.syntheticMonitor;
        if (input.event.inputConfig.httpCheck !== undefined)
          requestBody.httpCheck = input.event.inputConfig.httpCheck;
        if (input.event.inputConfig.tcpCheck !== undefined)
          requestBody.tcpCheck = input.event.inputConfig.tcpCheck;
        if (input.event.inputConfig.period !== undefined)
          requestBody.period = input.event.inputConfig.period;
        if (input.event.inputConfig.timeout !== undefined)
          requestBody.timeout = input.event.inputConfig.timeout;
        if (input.event.inputConfig.contentMatchers !== undefined)
          requestBody.contentMatchers = input.event.inputConfig.contentMatchers;
        if (input.event.inputConfig.checkerType !== undefined)
          requestBody.checkerType = input.event.inputConfig.checkerType;
        if (input.event.inputConfig.disabled !== undefined)
          requestBody.disabled = input.event.inputConfig.disabled;
        if (input.event.inputConfig.selectedRegions !== undefined)
          requestBody.selectedRegions = input.event.inputConfig.selectedRegions;
        if (input.event.inputConfig.logCheckFailures !== undefined)
          requestBody.logCheckFailures =
            input.event.inputConfig.logCheckFailures;
        if (input.event.inputConfig.isInternal !== undefined)
          requestBody.isInternal = input.event.inputConfig.isInternal;
        if (input.event.inputConfig.internalCheckers !== undefined)
          requestBody.internalCheckers =
            input.event.inputConfig.internalCheckers;
        if (input.event.inputConfig.userLabels !== undefined)
          requestBody.userLabels = input.event.inputConfig.userLabels;

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
          name: {
            type: "string",
            description:
              "Identifier. A unique resource name for this Uptime check configuration. The format is: projects/[PROJECT_ID_OR_NUMBER]/uptimeCheckConfigs/[UPTIME_CHECK_ID] [PROJECT_ID_OR_NUMBER] is the Workspace host project associated with the Uptime check.This field should be omitted when creating the Uptime check configuration; on create, the resource name is assigned by the server and included in the response.",
          },
          displayName: {
            type: "string",
            description:
              "A human-friendly name for the Uptime check configuration. The display name should be unique within a Cloud Monitoring Workspace in order to make it easier to identify; however, uniqueness is not enforced. Required.",
          },
          monitoredResource: {
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
          resourceGroup: {
            type: "object",
            properties: {
              groupId: {
                type: "string",
                description:
                  "The group of resources being monitored. Should be only the [GROUP_ID], and not the full-path projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID].",
              },
              resourceType: {
                type: "string",
                enum: [
                  "RESOURCE_TYPE_UNSPECIFIED",
                  "INSTANCE",
                  "AWS_ELB_LOAD_BALANCER",
                ],
                description: "The resource type of the group members.",
              },
            },
            description:
              "The resource submessage for group checks. It can be used instead of a monitored resource, when multiple resources are being monitored.",
            additionalProperties: true,
          },
          syntheticMonitor: {
            type: "object",
            properties: {
              cloudFunctionV2: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "Required. Fully qualified GCFv2 resource name i.e. projects/{project}/locations/{location}/functions/{function} Required.",
                  },
                  cloudRunRevision: {
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
                },
                description:
                  "A Synthetic Monitor deployed to a Cloud Functions V2 instance.",
                additionalProperties: true,
              },
            },
            description:
              "Describes a Synthetic Monitor to be invoked by Uptime.",
            additionalProperties: true,
          },
          httpCheck: {
            type: "object",
            properties: {
              requestMethod: {
                type: "string",
                enum: ["METHOD_UNSPECIFIED", "GET", "POST"],
                description:
                  "The HTTP request method to use for the check. If set to METHOD_UNSPECIFIED then request_method defaults to GET.",
              },
              useSsl: {
                type: "boolean",
                description:
                  "If true, use HTTPS instead of HTTP to run the check.",
              },
              path: {
                type: "string",
                description:
                  'Optional (defaults to "/"). The path to the page against which to run the check. Will be combined with the host (specified within the monitored_resource) and port to construct the full URL. If the provided path does not begin with "/", a "/" will be prepended automatically.',
              },
              port: {
                type: "integer",
                description:
                  "Optional (defaults to 80 when use_ssl is false, and 443 when use_ssl is true). The TCP port on the HTTP server against which to run the check. Will be combined with host (specified within the monitored_resource) and path to construct the full URL. (Format: int32)",
              },
              authInfo: {
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
                  "The authentication parameters to provide to the specified resource or URL that requires a username and password. Currently, only Basic HTTP authentication (https://tools.ietf.org/html/rfc7617) is supported in Uptime checks.",
                additionalProperties: true,
              },
              maskHeaders: {
                type: "boolean",
                description:
                  "Boolean specifying whether to encrypt the header information. Encryption should be specified for any headers related to authentication that you do not wish to be seen when retrieving the configuration. The server will be responsible for encrypting the headers. On Get/List calls, if mask_headers is set to true then the headers will be obscured with ******.",
              },
              headers: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "The list of headers to send as part of the Uptime check request. If two headers have the same key and different values, they should be entered as a single header, with the value being a comma-separated list of all the desired values as described at https://www.w3.org/Protocols/rfc2616/rfc2616.txt (page 31). Entering two separate headers with the same key in a Create call will cause the first to be overwritten by the second. The maximum number of headers allowed is 100.",
              },
              contentType: {
                type: "string",
                enum: ["TYPE_UNSPECIFIED", "URL_ENCODED", "USER_PROVIDED"],
                description:
                  'The content type header to use for the check. The following configurations result in errors: 1. Content type is specified in both the headers field and the content_type field. 2. Request method is GET and content_type is not TYPE_UNSPECIFIED 3. Request method is POST and content_type is TYPE_UNSPECIFIED. 4. Request method is POST and a "Content-Type" header is provided via headers field. The content_type field should be used instead.',
              },
              customContentType: {
                type: "string",
                description:
                  "A user provided content type header to use for the check. The invalid configurations outlined in the content_type field apply to custom_content_type, as well as the following: 1. content_type is URL_ENCODED and custom_content_type is set. 2. content_type is USER_PROVIDED and custom_content_type is not set.",
              },
              validateSsl: {
                type: "boolean",
                description:
                  "Boolean specifying whether to include SSL certificate validation as a part of the Uptime check. Only applies to checks where monitored_resource is set to uptime_url. If use_ssl is false, setting validate_ssl to true has no effect.",
              },
              body: {
                type: "string",
                description:
                  "The request body associated with the HTTP POST request. If content_type is URL_ENCODED, the body passed in must be URL-encoded. Users can provide a Content-Length header via the headers field or the API will do so. If the request_method is GET and body is not empty, the API will return an error. The maximum byte size is 1 megabyte.Note: If client libraries aren't used (which performs the conversion automatically) base64 encode your body data since the field is of bytes type. (Format: byte)",
              },
              acceptedResponseStatusCodes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    statusValue: {
                      type: "integer",
                      description: "A status code to accept. (Format: int32)",
                    },
                    statusClass: {
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
                      description: "A class of status codes to accept.",
                    },
                  },
                  description:
                    'A status to accept. Either a status code class like "2xx", or an integer status code like "200".',
                  additionalProperties: true,
                },
                description:
                  "If present, the check will only pass if the HTTP response status code is in this set of status codes. If empty, the HTTP status code will only pass if the HTTP status code is 200-299.",
              },
              pingConfig: {
                type: "object",
                properties: {
                  pingsCount: {
                    type: "integer",
                    description:
                      "Number of ICMP pings. A maximum of 3 ICMP pings is currently supported. (Format: int32)",
                  },
                },
                description:
                  "Information involved in sending ICMP pings alongside public HTTP/TCP checks. For HTTP, the pings are performed for each part of the redirect chain.",
                additionalProperties: true,
              },
              serviceAgentAuthentication: {
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
                  "Contains information needed for generating either an OpenID Connect token (https://developers.google.com/identity/protocols/OpenIDConnect) or OAuth token (https://developers.google.com/identity/protocols/oauth2). The token will be generated for the Monitoring service agent service account.",
                additionalProperties: true,
              },
            },
            description:
              "Information involved in an HTTP/HTTPS Uptime check request.",
            additionalProperties: true,
          },
          tcpCheck: {
            type: "object",
            properties: {
              port: {
                type: "integer",
                description:
                  "The TCP port on the server against which to run the check. Will be combined with host (specified within the monitored_resource) to construct the full URL. Required. (Format: int32)",
              },
              pingConfig: {
                type: "object",
                properties: {
                  pingsCount: {
                    type: "integer",
                    description:
                      "Number of ICMP pings. A maximum of 3 ICMP pings is currently supported. (Format: int32)",
                  },
                },
                description:
                  "Information involved in sending ICMP pings alongside public HTTP/TCP checks. For HTTP, the pings are performed for each part of the redirect chain.",
                additionalProperties: true,
              },
            },
            description: "Information required for a TCP Uptime check request.",
            additionalProperties: true,
          },
          period: {
            type: "string",
            description:
              "How often, in seconds, the Uptime check is performed. Currently, the only supported values are 60s (1 minute), 300s (5 minutes), 600s (10 minutes), and 900s (15 minutes). Optional, defaults to 60s. (Format: google-duration)",
          },
          timeout: {
            type: "string",
            description:
              "The maximum amount of time to wait for the request to complete (must be between 1 and 60 seconds). Required. (Format: google-duration)",
          },
          contentMatchers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description:
                    "String, regex or JSON content to match. Maximum 1024 bytes. An empty content string indicates no content matching is to be performed.",
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
                    "The type of content matcher that will be applied to the server output, compared to the content string when the check is run.",
                },
                jsonPathMatcher: {
                  type: "object",
                  properties: {
                    jsonPath: {
                      type: "string",
                      description:
                        "JSONPath within the response output pointing to the expected ContentMatcher::content to match against.",
                    },
                    jsonMatcher: {
                      type: "string",
                      enum: [
                        "JSON_PATH_MATCHER_OPTION_UNSPECIFIED",
                        "EXACT_MATCH",
                        "REGEX_MATCH",
                      ],
                      description:
                        "The type of JSONPath match that will be applied to the JSON output (ContentMatcher.content)",
                    },
                  },
                  description:
                    "Information needed to perform a JSONPath content match. Used for ContentMatcherOption::MATCHES_JSON_PATH and ContentMatcherOption::NOT_MATCHES_JSON_PATH.",
                  additionalProperties: true,
                },
              },
              description:
                "Optional. Used to perform content matching. This allows matching based on substrings and regular expressions, together with their negations. Only the first 4 MB of an HTTP or HTTPS check's response (and the first 1 MB of a TCP check's response) are examined for purposes of content matching.",
              additionalProperties: true,
            },
            description:
              "The content that is expected to appear in the data returned by the target server against which the check is run. Currently, only the first entry in the content_matchers list is supported, and additional entries will be ignored. This field is optional and should only be specified if a content match is required as part of the/ Uptime check.",
          },
          checkerType: {
            type: "string",
            enum: [
              "CHECKER_TYPE_UNSPECIFIED",
              "STATIC_IP_CHECKERS",
              "VPC_CHECKERS",
            ],
            description:
              "The type of checkers to use to execute the Uptime check.",
          },
          disabled: {
            type: "boolean",
            description: "Whether the check is disabled or not.",
          },
          selectedRegions: {
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
            },
            description:
              "The list of regions from which the check will be run. Some regions contain one location, and others contain more than one. If this field is specified, enough regions must be provided to include a minimum of 3 locations. Not specifying this field will result in Uptime checks running from all available regions.",
          },
          logCheckFailures: {
            type: "boolean",
            description:
              "To specify whether to log the results of failed probes to Cloud Logging.",
          },
          isInternal: {
            type: "boolean",
            description:
              "If this is true, then checks are made only from the 'internal_checkers'. If it is false, then checks are made only from the 'selected_regions'. It is an error to provide 'selected_regions' when is_internal is true, or to provide 'internal_checkers' when is_internal is false.",
          },
          internalCheckers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "A unique resource name for this InternalChecker. The format is: projects/[PROJECT_ID_OR_NUMBER]/internalCheckers/[INTERNAL_CHECKER_ID] [PROJECT_ID_OR_NUMBER] is the Cloud Monitoring Metrics Scope project for the Uptime check config associated with the internal checker.",
                },
                displayName: {
                  type: "string",
                  description:
                    "The checker's human-readable name. The display name should be unique within a Cloud Monitoring Metrics Scope in order to make it easier to identify; however, uniqueness is not enforced.",
                },
                network: {
                  type: "string",
                  description:
                    'The GCP VPC network (https://cloud.google.com/vpc/docs/vpc) where the internal resource lives (ex: "default").',
                },
                gcpZone: {
                  type: "string",
                  description:
                    "The GCP zone the Uptime check should egress from. Only respected for internal Uptime checks, where internal_network is specified.",
                },
                peerProjectId: {
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
              "The internal checkers that this check will egress from. If is_internal is true and this list is empty, the check will egress from all the InternalCheckers configured for the project that owns this UptimeCheckConfig.",
          },
          userLabels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "User-supplied key/value data to be used for organizing and identifying the UptimeCheckConfig objects.The field can contain up to 64 entries. Each key and value is limited to 63 Unicode characters or 128 bytes, whichever is smaller. Labels and values can contain only lowercase letters, numerals, underscores, and dashes. Keys must begin with a letter.",
          },
        },
        description:
          "This message configures which resources and services to monitor for availability.",
        additionalProperties: true,
      },
    },
  },
};

export default uptimeCheckConfigsPatch;
