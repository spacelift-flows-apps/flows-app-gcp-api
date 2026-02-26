import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Url Maps - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Url Maps",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.orderBy !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.orderBy);
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.returnPartialSuccess !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.returnPartialSuccess,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "/compute/v1/projects/{project}/global/urlMaps",
          pathParams,
          queryParams,
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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                defaultCustomErrorResponsePolicy: {
                  type: "object",
                  properties: {
                    errorResponseRules: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          matchResponseCodes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Valid values include:        - A number between 400 and 599: For example      401 or 503, in which case the load balancer      applies the policy if the error code exactly matches this value.      - 5xx: Load Balancer will apply the policy if the      backend service responds with any response code in the range of      500 to 599.    - 4xx: Load      Balancer will apply the policy if the backend service responds with any      response code in the range of 400 to      499.  Values must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                          },
                          overrideResponseCode: {
                            type: "integer",
                            description:
                              "The HTTP status code returned with the response containing the custom error content. If overrideResponseCode is not supplied, the same response code returned by the original backend bucket or backend service is returned to the client.",
                          },
                          path: {
                            type: "string",
                            description:
                              "The full path to a file within backendBucket . For example:/errors/defaultError.html  path must start with a leading slash. path cannot have trailing slashes.  If the file is not available in backendBucket  or the load balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client.  The value must be from 1 to 1024 characters",
                          },
                        },
                        description:
                          "Specifies the mapping between the response code that will be returned along with the custom error content and the response code returned by the backend service.",
                        additionalProperties: true,
                      },
                      description:
                        "Specifies rules for returning error responses.  In a given policy, if you specify rules for both a range of error codes as well as rules for specific error codes then rules with specific error codes have a higher priority. For example, assume that you configure a rule for 401 (Un-authorized) code, and another for all 4 series error codes (4XX). If the backend service returns a401, then the rule for 401 will be applied. However if the backend service returns a 403, the rule for4xx takes effect.",
                    },
                    errorService: {
                      type: "string",
                      description:
                        "The full or partial URL to the BackendBucket resource that contains the custom error content. Examples are:        - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket      - compute/v1/projects/project/global/backendBuckets/myBackendBucket      - global/backendBuckets/myBackendBucket  If errorService is not specified at lower levels likepathMatcher, pathRule and routeRule, an errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService.  If load balancer cannot reach the backendBucket, a simple Not Found Error will be returned, with the original response code (oroverrideResponseCode if configured).  errorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
                    },
                  },
                  description:
                    "Specifies the custom error response policy that must be applied when the backend service or backend bucket responds with an error.",
                  additionalProperties: true,
                },
                defaultRouteAction: {
                  type: "object",
                  properties: {
                    corsPolicy: {
                      type: "object",
                      properties: {
                        allowCredentials: {
                          type: "boolean",
                          description:
                            "In response to a preflight request, setting this to true indicates that the actual request can include user credentials. This field translates to the Access-Control-Allow-Credentials header.  Default is false.",
                        },
                        allowHeaders: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the content for the Access-Control-Allow-Headers header.",
                        },
                        allowMethods: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the content for the Access-Control-Allow-Methods header.",
                        },
                        allowOriginRegexes: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies a regular expression that matches allowed origins. For more information, see regular expression syntax.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.  Regular expressions can only be used when the loadBalancingScheme is set to INTERNAL_SELF_MANAGED.",
                        },
                        allowOrigins: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the list of origins that is allowed to do CORS requests.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                        },
                        disabled: {
                          type: "boolean",
                          description:
                            "If true, disables the CORS policy. The default value is false, which indicates that the CORS policy is in effect.",
                        },
                        exposeHeaders: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the content for the Access-Control-Expose-Headers header.",
                        },
                        maxAge: {
                          type: "integer",
                          description:
                            "Specifies how long results of a preflight request can be cached in seconds. This field translates to the Access-Control-Max-Age header.",
                        },
                      },
                      description:
                        "The specification for allowing client-side cross-origin requests. For more information about the W3C recommendation for cross-origin resource sharing (CORS), see Fetch API Living Standard.",
                      additionalProperties: true,
                    },
                    faultInjectionPolicy: {
                      type: "object",
                      properties: {
                        abort: {
                          type: "object",
                          properties: {
                            httpStatus: {
                              type: "integer",
                              description:
                                "The HTTP status code used to abort the request.  The value must be from 200 to 599 inclusive.  For gRPC protocol, the gRPC status code is mapped to HTTP status code according to this mapping table. HTTP status 200 is mapped to gRPC status UNKNOWN. Injecting an OK status is currently not supported by Traffic Director.",
                            },
                            percentage: {
                              type: "number",
                              description:
                                "The percentage of traffic for connections, operations, or requests that is aborted as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                            },
                          },
                          description:
                            "Specification for how requests are aborted as part of fault injection.",
                          additionalProperties: true,
                        },
                        delay: {
                          type: "object",
                          properties: {
                            fixedDelay: {
                              type: "object",
                              properties: {
                                nanos: {
                                  type: "integer",
                                  description:
                                    "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                },
                                seconds: {
                                  type: "string",
                                  description: "64-bit integer as string",
                                },
                              },
                              description:
                                'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                              additionalProperties: true,
                            },
                            percentage: {
                              type: "number",
                              description:
                                "The percentage of traffic for connections, operations, or requests for which a delay is introduced as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                            },
                          },
                          description:
                            "Specifies the delay introduced by the load balancer before forwarding the request to the backend service as part of fault injection.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "The specification for fault injection introduced into traffic to test the resiliency of clients to backend service failure. As part of fault injection, when clients send requests to a backend service, delays can be introduced by the load balancer on a percentage of requests before sending those request to the backend service. Similarly requests from clients can be aborted by the load balancer for a percentage of requests.",
                      additionalProperties: true,
                    },
                    maxStreamDuration: {
                      type: "object",
                      properties: {
                        nanos: {
                          type: "integer",
                          description:
                            "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                        },
                        seconds: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      description:
                        'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                      additionalProperties: true,
                    },
                    requestMirrorPolicy: {
                      type: "object",
                      properties: {
                        backendService: {
                          type: "string",
                          description:
                            "The full or partial URL to the BackendService resource being mirrored to.  The backend service configured for a mirroring policy must reference backends that are of the same type as the original backend service matched in the URL map.  Serverless NEG backends are not currently supported as a mirrored backend service.",
                        },
                        mirrorPercent: {
                          type: "number",
                          description:
                            "The percentage of requests to be mirrored to `backend_service`.",
                        },
                      },
                      description:
                        "A policy that specifies how requests intended for the route's backends are shadowed to a separate mirrored backend service. The load balancer doesn't wait for responses from the shadow service. Before sending traffic to the shadow service, the host or authority header is suffixed with-shadow.",
                      additionalProperties: true,
                    },
                    retryPolicy: {
                      type: "object",
                      properties: {
                        numRetries: {
                          type: "integer",
                          description:
                            "Specifies the allowed number retries. This number must be > 0. If not specified, defaults to 1.",
                        },
                        perTryTimeout: {
                          type: "object",
                          properties: {
                            nanos: {
                              type: "integer",
                              description:
                                "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                            },
                            seconds: {
                              type: "string",
                              description: "64-bit integer as string",
                            },
                          },
                          description:
                            'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                          additionalProperties: true,
                        },
                        retryConditions: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies one or more conditions when this retry policy applies. Valid values are:     - 5xx: retry is attempted if the instance or endpoint    responds with any 5xx response code, or if the instance or    endpoint does not respond at all. For example, disconnects, reset, read    timeout, connection failure, and refused streams.    - gateway-error: Similar to 5xx, but only    applies to response codes 502, 503 or504.    - connect-failure: a retry is attempted on failures    connecting to the instance or endpoint. For example, connection    timeouts.    - retriable-4xx: a retry is attempted if the instance    or endpoint responds with a 4xx response code.    The only error that you can retry is error code 409.    - refused-stream: a retry is attempted if the instance    or endpoint resets the stream with a REFUSED_STREAM error    code. This reset type indicates that it is safe to retry.    - cancelled: a retry is attempted if the gRPC status    code in the response header is set to cancelled.    - deadline-exceeded: a retry is attempted if the gRPC    status code in the response header is set todeadline-exceeded.    - internal: a retry is attempted if the gRPC    status code in the response header is set tointernal.    - resource-exhausted: a retry is attempted if the gRPC    status code in the response header is set toresource-exhausted.    - unavailable: a retry is attempted if the gRPC    status code in the response header is set tounavailable.  Only the following codes are supported when the URL map is bound to target gRPC proxy that has validateForProxyless field set to true.     - cancelled    - deadline-exceeded    - internal    - resource-exhausted    - unavailable",
                        },
                      },
                      description:
                        "The retry policy associates with HttpRouteRule",
                      additionalProperties: true,
                    },
                    timeout: {
                      type: "object",
                      properties: {
                        nanos: {
                          type: "integer",
                          description:
                            "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                        },
                        seconds: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                      },
                      description:
                        'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                      additionalProperties: true,
                    },
                    urlRewrite: {
                      type: "object",
                      properties: {
                        hostRewrite: {
                          type: "string",
                          description:
                            "Before forwarding the request to the selected service, the request's host header is replaced with contents of hostRewrite.  The value must be from 1 to 255 characters.",
                        },
                        pathPrefixRewrite: {
                          type: "string",
                          description:
                            "Before forwarding the request to the selected backend service, the matching portion of the request's path is replaced bypathPrefixRewrite.  The value must be from 1 to 1024 characters.",
                        },
                        pathTemplateRewrite: {
                          type: "string",
                          description:
                            "If specified, the pattern rewrites the URL path (based on the :path header) using the HTTP template syntax.  A corresponding path_template_match must be specified. Any template variables must exist in the path_template_match field.         - -At least one variable must be specified in the path_template_match       field    - You can omit variables from the rewritten URL       - The * and ** operators cannot be matched       unless they have a corresponding variable name - e.g.       {format=*} or {var=**}.  For example, a path_template_match of /static/{format=**} could be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a rewrite, so that /{country}/{format}/{suffix=**} can be rewritten as /content/{format}/{country}/{suffix}.  At least one non-empty routeRules[].matchRules[].path_template_match is required.  Only one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                        },
                      },
                      description:
                        "The spec for modifying the path before sending the request to the matched backend service.",
                      additionalProperties: true,
                    },
                    weightedBackendServices: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          backendService: {
                            type: "string",
                            description:
                              "The full or partial URL to the default BackendService resource. Before forwarding the request to backendService, the load balancer applies any relevant headerActions specified as part of thisbackendServiceWeight.",
                          },
                          headerAction: {
                            type: "object",
                            properties: {
                              requestHeadersToAdd: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    headerName: {
                                      type: "string",
                                      description: "The name of the header.",
                                    },
                                    headerValue: {
                                      type: "string",
                                      description:
                                        "The value of the header to add.",
                                    },
                                    replace: {
                                      type: "boolean",
                                      description:
                                        "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                    },
                                  },
                                  description:
                                    "Specification determining how headers are added to requests or responses.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Headers to add to a matching request before forwarding the request to thebackendService.",
                              },
                              requestHeadersToRemove: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "A list of header names for headers that need to be removed from the request before forwarding the request to the backendService.",
                              },
                              responseHeadersToAdd: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    headerName: {
                                      type: "string",
                                      description: "The name of the header.",
                                    },
                                    headerValue: {
                                      type: "string",
                                      description:
                                        "The value of the header to add.",
                                    },
                                    replace: {
                                      type: "boolean",
                                      description:
                                        "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                    },
                                  },
                                  description:
                                    "Specification determining how headers are added to requests or responses.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Headers to add the response before sending the response back to the client.",
                              },
                              responseHeadersToRemove: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "A list of header names for headers that need to be removed from the response before sending the response back to the client.",
                              },
                            },
                            description:
                              "The request and response header transformations that take effect before the request is passed along to the selected backendService.",
                            additionalProperties: true,
                          },
                          weight: {
                            type: "integer",
                            description:
                              "Specifies the fraction of traffic sent to a backend service, computed asweight / (sum of all weightedBackendService weights in routeAction).  The selection of a backend service is determined only for new traffic. Once a user's request has been directed to a backend service, subsequent requests are sent to the same backend service as determined by the backend service's session affinity policy. Don't configure session affinity if you're using weighted traffic splitting. If you do, the weighted traffic splitting configuration takes precedence.  The value must be from 0 to 1000.",
                          },
                        },
                        description:
                          "In contrast to a single BackendService in HttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across multiple backend services. The volume of traffic for each backend service is proportional to the weight specified in each WeightedBackendService",
                        additionalProperties: true,
                      },
                      description:
                        "A list of weighted backend services to send traffic to when a route match occurs. The weights determine the fraction of traffic that flows to their corresponding backend service. If all traffic needs to go to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.  After a backend service is identified and before forwarding the request to the backend service, advanced routing actions such as URL rewrites and header transformations are applied depending on additional settings specified in this HttpRouteAction.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "defaultRouteAction takes effect when none of the hostRules match. The load balancer performs advanced routing actions, such as URL rewrites and header transformations, before forwarding the request to the selected backend.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.    URL maps for classic Application Load Balancers only support the urlRewrite action within defaultRouteAction.   defaultRouteAction has no effect when the URL map is bound to a target gRPC proxy that has the validateForProxyless field set to true.",
                },
                defaultService: {
                  type: "string",
                  description:
                    "The full or partial URL of the defaultService resource to which traffic is directed if none of the hostRules match. If defaultRouteAction is also specified, advanced routing actions, such as URL rewrites, take effect before sending the request to the backend.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.   defaultService has no effect when the URL map is bound to a target gRPC proxy that has the validateForProxyless field set to true.",
                },
                defaultUrlRedirect: {
                  type: "object",
                  properties: {
                    hostRedirect: {
                      type: "string",
                      description:
                        "The host that is used in the redirect response instead of the one that was supplied in the request.  The value must be from 1 to 255 characters.",
                    },
                    httpsRedirect: {
                      type: "boolean",
                      description:
                        "If set to true, the URL scheme in the redirected request is set to HTTPS. If set to false, the URL scheme of the redirected request remains the same as that of the request.  This must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.  The default is set to false.",
                    },
                    pathRedirect: {
                      type: "string",
                      description:
                        "The path that is used in the redirect response instead of the one that was supplied in the request.  pathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                    },
                    prefixRedirect: {
                      type: "string",
                      description:
                        "The prefix that replaces the prefixMatch specified in the HttpRouteRuleMatch, retaining the remaining portion of the URL before redirecting the request.  prefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                    },
                    redirectResponseCode: {
                      type: "string",
                      description:
                        "The HTTP Status code to use for this RedirectAction.  Supported values are:     - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds    to 301.    - FOUND, which corresponds to 302.    - SEE_OTHER which corresponds to 303.    - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request    method is retained.    - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request    method is retained. Check the RedirectResponseCode enum for the list of possible values.",
                    },
                    stripQuery: {
                      type: "boolean",
                      description:
                        "If set to true, any accompanying query portion of the original URL is removed before redirecting the request. If set to false, the query portion of the original URL is retained.  The default is set to false.",
                    },
                  },
                  description: "Specifies settings for an HTTP redirect.",
                  additionalProperties: true,
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field is ignored when inserting a UrlMap. An up-to-date fingerprint must be provided in order to update the UrlMap, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a UrlMap.",
                },
                headerAction: {
                  type: "object",
                  properties: {
                    requestHeadersToAdd: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          headerName: {
                            type: "string",
                            description: "The name of the header.",
                          },
                          headerValue: {
                            type: "string",
                            description: "The value of the header to add.",
                          },
                          replace: {
                            type: "boolean",
                            description:
                              "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                          },
                        },
                        description:
                          "Specification determining how headers are added to requests or responses.",
                        additionalProperties: true,
                      },
                      description:
                        "Headers to add to a matching request before forwarding the request to thebackendService.",
                    },
                    requestHeadersToRemove: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of header names for headers that need to be removed from the request before forwarding the request to the backendService.",
                    },
                    responseHeadersToAdd: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          headerName: {
                            type: "string",
                            description: "The name of the header.",
                          },
                          headerValue: {
                            type: "string",
                            description: "The value of the header to add.",
                          },
                          replace: {
                            type: "boolean",
                            description:
                              "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                          },
                        },
                        description:
                          "Specification determining how headers are added to requests or responses.",
                        additionalProperties: true,
                      },
                      description:
                        "Headers to add the response before sending the response back to the client.",
                    },
                    responseHeadersToRemove: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of header names for headers that need to be removed from the response before sending the response back to the client.",
                    },
                  },
                  description:
                    "The request and response header transformations that take effect before the request is passed along to the selected backendService.",
                  additionalProperties: true,
                },
                hostRules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      description: {
                        type: "string",
                        description:
                          "An optional description of this resource. Provide this property when you create the resource.",
                      },
                      hosts: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "The list of host patterns to match. They must be valid hostnames with optional port numbers in the format host:port.* matches any string of ([a-z0-9-.]*). In that case, * must be the first character, and if followed by anything, the immediate following character must be either - or ..  * based matching is not supported when the URL map is bound to a target gRPC proxy that has the validateForProxyless field set to true.",
                      },
                      pathMatcher: {
                        type: "string",
                        description:
                          "The name of the PathMatcher to use to match the path portion of the URL if the hostRule matches the URL's host portion.",
                      },
                    },
                    description:
                      "UrlMaps A host-matching rule for a URL. If matched, will use the namedPathMatcher to select the BackendService.",
                    additionalProperties: true,
                  },
                  description: "The list of host rules to use against the URL.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Always compute#urlMaps for url maps.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                pathMatchers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      defaultCustomErrorResponsePolicy: {
                        type: "object",
                        properties: {
                          errorResponseRules: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                matchResponseCodes: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    "Valid values include:        - A number between 400 and 599: For example      401 or 503, in which case the load balancer      applies the policy if the error code exactly matches this value.      - 5xx: Load Balancer will apply the policy if the      backend service responds with any response code in the range of      500 to 599.    - 4xx: Load      Balancer will apply the policy if the backend service responds with any      response code in the range of 400 to      499.  Values must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                                },
                                overrideResponseCode: {
                                  type: "integer",
                                  description:
                                    "The HTTP status code returned with the response containing the custom error content. If overrideResponseCode is not supplied, the same response code returned by the original backend bucket or backend service is returned to the client.",
                                },
                                path: {
                                  type: "string",
                                  description:
                                    "The full path to a file within backendBucket . For example:/errors/defaultError.html  path must start with a leading slash. path cannot have trailing slashes.  If the file is not available in backendBucket  or the load balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client.  The value must be from 1 to 1024 characters",
                                },
                              },
                              description:
                                "Specifies the mapping between the response code that will be returned along with the custom error content and the response code returned by the backend service.",
                              additionalProperties: true,
                            },
                            description:
                              "Specifies rules for returning error responses.  In a given policy, if you specify rules for both a range of error codes as well as rules for specific error codes then rules with specific error codes have a higher priority. For example, assume that you configure a rule for 401 (Un-authorized) code, and another for all 4 series error codes (4XX). If the backend service returns a401, then the rule for 401 will be applied. However if the backend service returns a 403, the rule for4xx takes effect.",
                          },
                          errorService: {
                            type: "string",
                            description:
                              "The full or partial URL to the BackendBucket resource that contains the custom error content. Examples are:        - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket      - compute/v1/projects/project/global/backendBuckets/myBackendBucket      - global/backendBuckets/myBackendBucket  If errorService is not specified at lower levels likepathMatcher, pathRule and routeRule, an errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService.  If load balancer cannot reach the backendBucket, a simple Not Found Error will be returned, with the original response code (oroverrideResponseCode if configured).  errorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
                          },
                        },
                        description:
                          "Specifies the custom error response policy that must be applied when the backend service or backend bucket responds with an error.",
                        additionalProperties: true,
                      },
                      defaultRouteAction: {
                        type: "object",
                        properties: {
                          corsPolicy: {
                            type: "object",
                            properties: {
                              allowCredentials: {
                                type: "boolean",
                                description:
                                  "In response to a preflight request, setting this to true indicates that the actual request can include user credentials. This field translates to the Access-Control-Allow-Credentials header.  Default is false.",
                              },
                              allowHeaders: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Allow-Headers header.",
                              },
                              allowMethods: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Allow-Methods header.",
                              },
                              allowOriginRegexes: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies a regular expression that matches allowed origins. For more information, see regular expression syntax.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.  Regular expressions can only be used when the loadBalancingScheme is set to INTERNAL_SELF_MANAGED.",
                              },
                              allowOrigins: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the list of origins that is allowed to do CORS requests.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                              },
                              disabled: {
                                type: "boolean",
                                description:
                                  "If true, disables the CORS policy. The default value is false, which indicates that the CORS policy is in effect.",
                              },
                              exposeHeaders: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Expose-Headers header.",
                              },
                              maxAge: {
                                type: "integer",
                                description:
                                  "Specifies how long results of a preflight request can be cached in seconds. This field translates to the Access-Control-Max-Age header.",
                              },
                            },
                            description:
                              "The specification for allowing client-side cross-origin requests. For more information about the W3C recommendation for cross-origin resource sharing (CORS), see Fetch API Living Standard.",
                            additionalProperties: true,
                          },
                          faultInjectionPolicy: {
                            type: "object",
                            properties: {
                              abort: {
                                type: "object",
                                properties: {
                                  httpStatus: {
                                    type: "integer",
                                    description:
                                      "The HTTP status code used to abort the request.  The value must be from 200 to 599 inclusive.  For gRPC protocol, the gRPC status code is mapped to HTTP status code according to this mapping table. HTTP status 200 is mapped to gRPC status UNKNOWN. Injecting an OK status is currently not supported by Traffic Director.",
                                  },
                                  percentage: {
                                    type: "number",
                                    description:
                                      "The percentage of traffic for connections, operations, or requests that is aborted as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                                  },
                                },
                                description:
                                  "Specification for how requests are aborted as part of fault injection.",
                                additionalProperties: true,
                              },
                              delay: {
                                type: "object",
                                properties: {
                                  fixedDelay: {
                                    type: "object",
                                    properties: {
                                      nanos: {
                                        type: "integer",
                                        description:
                                          "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                      },
                                      seconds: {
                                        type: "string",
                                        description: "64-bit integer as string",
                                      },
                                    },
                                    description:
                                      'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                    additionalProperties: true,
                                  },
                                  percentage: {
                                    type: "number",
                                    description:
                                      "The percentage of traffic for connections, operations, or requests for which a delay is introduced as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                                  },
                                },
                                description:
                                  "Specifies the delay introduced by the load balancer before forwarding the request to the backend service as part of fault injection.",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "The specification for fault injection introduced into traffic to test the resiliency of clients to backend service failure. As part of fault injection, when clients send requests to a backend service, delays can be introduced by the load balancer on a percentage of requests before sending those request to the backend service. Similarly requests from clients can be aborted by the load balancer for a percentage of requests.",
                            additionalProperties: true,
                          },
                          maxStreamDuration: {
                            type: "object",
                            properties: {
                              nanos: {
                                type: "integer",
                                description:
                                  "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                              },
                              seconds: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                            },
                            description:
                              'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                            additionalProperties: true,
                          },
                          requestMirrorPolicy: {
                            type: "object",
                            properties: {
                              backendService: {
                                type: "string",
                                description:
                                  "The full or partial URL to the BackendService resource being mirrored to.  The backend service configured for a mirroring policy must reference backends that are of the same type as the original backend service matched in the URL map.  Serverless NEG backends are not currently supported as a mirrored backend service.",
                              },
                              mirrorPercent: {
                                type: "number",
                                description:
                                  "The percentage of requests to be mirrored to `backend_service`.",
                              },
                            },
                            description:
                              "A policy that specifies how requests intended for the route's backends are shadowed to a separate mirrored backend service. The load balancer doesn't wait for responses from the shadow service. Before sending traffic to the shadow service, the host or authority header is suffixed with-shadow.",
                            additionalProperties: true,
                          },
                          retryPolicy: {
                            type: "object",
                            properties: {
                              numRetries: {
                                type: "integer",
                                description:
                                  "Specifies the allowed number retries. This number must be > 0. If not specified, defaults to 1.",
                              },
                              perTryTimeout: {
                                type: "object",
                                properties: {
                                  nanos: {
                                    type: "integer",
                                    description:
                                      "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                  },
                                  seconds: {
                                    type: "string",
                                    description: "64-bit integer as string",
                                  },
                                },
                                description:
                                  'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                additionalProperties: true,
                              },
                              retryConditions: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies one or more conditions when this retry policy applies. Valid values are:     - 5xx: retry is attempted if the instance or endpoint    responds with any 5xx response code, or if the instance or    endpoint does not respond at all. For example, disconnects, reset, read    timeout, connection failure, and refused streams.    - gateway-error: Similar to 5xx, but only    applies to response codes 502, 503 or504.    - connect-failure: a retry is attempted on failures    connecting to the instance or endpoint. For example, connection    timeouts.    - retriable-4xx: a retry is attempted if the instance    or endpoint responds with a 4xx response code.    The only error that you can retry is error code 409.    - refused-stream: a retry is attempted if the instance    or endpoint resets the stream with a REFUSED_STREAM error    code. This reset type indicates that it is safe to retry.    - cancelled: a retry is attempted if the gRPC status    code in the response header is set to cancelled.    - deadline-exceeded: a retry is attempted if the gRPC    status code in the response header is set todeadline-exceeded.    - internal: a retry is attempted if the gRPC    status code in the response header is set tointernal.    - resource-exhausted: a retry is attempted if the gRPC    status code in the response header is set toresource-exhausted.    - unavailable: a retry is attempted if the gRPC    status code in the response header is set tounavailable.  Only the following codes are supported when the URL map is bound to target gRPC proxy that has validateForProxyless field set to true.     - cancelled    - deadline-exceeded    - internal    - resource-exhausted    - unavailable",
                              },
                            },
                            description:
                              "The retry policy associates with HttpRouteRule",
                            additionalProperties: true,
                          },
                          timeout: {
                            type: "object",
                            properties: {
                              nanos: {
                                type: "integer",
                                description:
                                  "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                              },
                              seconds: {
                                type: "string",
                                description: "64-bit integer as string",
                              },
                            },
                            description:
                              'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                            additionalProperties: true,
                          },
                          urlRewrite: {
                            type: "object",
                            properties: {
                              hostRewrite: {
                                type: "string",
                                description:
                                  "Before forwarding the request to the selected service, the request's host header is replaced with contents of hostRewrite.  The value must be from 1 to 255 characters.",
                              },
                              pathPrefixRewrite: {
                                type: "string",
                                description:
                                  "Before forwarding the request to the selected backend service, the matching portion of the request's path is replaced bypathPrefixRewrite.  The value must be from 1 to 1024 characters.",
                              },
                              pathTemplateRewrite: {
                                type: "string",
                                description:
                                  "If specified, the pattern rewrites the URL path (based on the :path header) using the HTTP template syntax.  A corresponding path_template_match must be specified. Any template variables must exist in the path_template_match field.         - -At least one variable must be specified in the path_template_match       field    - You can omit variables from the rewritten URL       - The * and ** operators cannot be matched       unless they have a corresponding variable name - e.g.       {format=*} or {var=**}.  For example, a path_template_match of /static/{format=**} could be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a rewrite, so that /{country}/{format}/{suffix=**} can be rewritten as /content/{format}/{country}/{suffix}.  At least one non-empty routeRules[].matchRules[].path_template_match is required.  Only one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                              },
                            },
                            description:
                              "The spec for modifying the path before sending the request to the matched backend service.",
                            additionalProperties: true,
                          },
                          weightedBackendServices: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                backendService: {
                                  type: "string",
                                  description:
                                    "The full or partial URL to the default BackendService resource. Before forwarding the request to backendService, the load balancer applies any relevant headerActions specified as part of thisbackendServiceWeight.",
                                },
                                headerAction: {
                                  type: "object",
                                  properties: {
                                    requestHeadersToAdd: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          headerName: {
                                            type: "string",
                                            description:
                                              "The name of the header.",
                                          },
                                          headerValue: {
                                            type: "string",
                                            description:
                                              "The value of the header to add.",
                                          },
                                          replace: {
                                            type: "boolean",
                                            description:
                                              "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                          },
                                        },
                                        description:
                                          "Specification determining how headers are added to requests or responses.",
                                        additionalProperties: true,
                                      },
                                      description:
                                        "Headers to add to a matching request before forwarding the request to thebackendService.",
                                    },
                                    requestHeadersToRemove: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "A list of header names for headers that need to be removed from the request before forwarding the request to the backendService.",
                                    },
                                    responseHeadersToAdd: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          headerName: {
                                            type: "string",
                                            description:
                                              "The name of the header.",
                                          },
                                          headerValue: {
                                            type: "string",
                                            description:
                                              "The value of the header to add.",
                                          },
                                          replace: {
                                            type: "boolean",
                                            description:
                                              "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                          },
                                        },
                                        description:
                                          "Specification determining how headers are added to requests or responses.",
                                        additionalProperties: true,
                                      },
                                      description:
                                        "Headers to add the response before sending the response back to the client.",
                                    },
                                    responseHeadersToRemove: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "A list of header names for headers that need to be removed from the response before sending the response back to the client.",
                                    },
                                  },
                                  description:
                                    "The request and response header transformations that take effect before the request is passed along to the selected backendService.",
                                  additionalProperties: true,
                                },
                                weight: {
                                  type: "integer",
                                  description:
                                    "Specifies the fraction of traffic sent to a backend service, computed asweight / (sum of all weightedBackendService weights in routeAction).  The selection of a backend service is determined only for new traffic. Once a user's request has been directed to a backend service, subsequent requests are sent to the same backend service as determined by the backend service's session affinity policy. Don't configure session affinity if you're using weighted traffic splitting. If you do, the weighted traffic splitting configuration takes precedence.  The value must be from 0 to 1000.",
                                },
                              },
                              description:
                                "In contrast to a single BackendService in HttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across multiple backend services. The volume of traffic for each backend service is proportional to the weight specified in each WeightedBackendService",
                              additionalProperties: true,
                            },
                            description:
                              "A list of weighted backend services to send traffic to when a route match occurs. The weights determine the fraction of traffic that flows to their corresponding backend service. If all traffic needs to go to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.  After a backend service is identified and before forwarding the request to the backend service, advanced routing actions such as URL rewrites and header transformations are applied depending on additional settings specified in this HttpRouteAction.",
                          },
                        },
                        additionalProperties: true,
                        description:
                          "defaultRouteAction takes effect when none of the pathRules or routeRules match. The load balancer performs advanced routing actions, such as URL rewrites and header transformations, before forwarding the request to the selected backend.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.   URL maps for classic Application Load Balancers only support the urlRewrite action within a path matcher'sdefaultRouteAction.",
                      },
                      defaultService: {
                        type: "string",
                        description:
                          "The full or partial URL to the BackendService resource. This URL is used if none of the pathRules orrouteRules defined by this PathMatcher are matched. For example, the following are all valid URLs to a BackendService resource:        - https://www.googleapis.com/compute/v1/projects/project/global/backendServices/backendService      - compute/v1/projects/project/global/backendServices/backendService      - global/backendServices/backendService   If defaultRouteAction is also specified, advanced routing actions, such as URL rewrites, take effect before sending the request to the backend.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.   Authorization requires one or more of the following Google IAM permissions on the specified resource default_service:         - compute.backendBuckets.use       - compute.backendServices.use",
                      },
                      defaultUrlRedirect: {
                        type: "object",
                        properties: {
                          hostRedirect: {
                            type: "string",
                            description:
                              "The host that is used in the redirect response instead of the one that was supplied in the request.  The value must be from 1 to 255 characters.",
                          },
                          httpsRedirect: {
                            type: "boolean",
                            description:
                              "If set to true, the URL scheme in the redirected request is set to HTTPS. If set to false, the URL scheme of the redirected request remains the same as that of the request.  This must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.  The default is set to false.",
                          },
                          pathRedirect: {
                            type: "string",
                            description:
                              "The path that is used in the redirect response instead of the one that was supplied in the request.  pathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                          },
                          prefixRedirect: {
                            type: "string",
                            description:
                              "The prefix that replaces the prefixMatch specified in the HttpRouteRuleMatch, retaining the remaining portion of the URL before redirecting the request.  prefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                          },
                          redirectResponseCode: {
                            type: "string",
                            description:
                              "The HTTP Status code to use for this RedirectAction.  Supported values are:     - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds    to 301.    - FOUND, which corresponds to 302.    - SEE_OTHER which corresponds to 303.    - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request    method is retained.    - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request    method is retained. Check the RedirectResponseCode enum for the list of possible values.",
                          },
                          stripQuery: {
                            type: "boolean",
                            description:
                              "If set to true, any accompanying query portion of the original URL is removed before redirecting the request. If set to false, the query portion of the original URL is retained.  The default is set to false.",
                          },
                        },
                        description: "Specifies settings for an HTTP redirect.",
                        additionalProperties: true,
                      },
                      description: {
                        type: "string",
                        description:
                          "An optional description of this resource. Provide this property when you create the resource.",
                      },
                      headerAction: {
                        type: "object",
                        properties: {
                          requestHeadersToAdd: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                headerName: {
                                  type: "string",
                                  description: "The name of the header.",
                                },
                                headerValue: {
                                  type: "string",
                                  description:
                                    "The value of the header to add.",
                                },
                                replace: {
                                  type: "boolean",
                                  description:
                                    "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                },
                              },
                              description:
                                "Specification determining how headers are added to requests or responses.",
                              additionalProperties: true,
                            },
                            description:
                              "Headers to add to a matching request before forwarding the request to thebackendService.",
                          },
                          requestHeadersToRemove: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of header names for headers that need to be removed from the request before forwarding the request to the backendService.",
                          },
                          responseHeadersToAdd: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                headerName: {
                                  type: "string",
                                  description: "The name of the header.",
                                },
                                headerValue: {
                                  type: "string",
                                  description:
                                    "The value of the header to add.",
                                },
                                replace: {
                                  type: "boolean",
                                  description:
                                    "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                },
                              },
                              description:
                                "Specification determining how headers are added to requests or responses.",
                              additionalProperties: true,
                            },
                            description:
                              "Headers to add the response before sending the response back to the client.",
                          },
                          responseHeadersToRemove: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of header names for headers that need to be removed from the response before sending the response back to the client.",
                          },
                        },
                        description:
                          "The request and response header transformations that take effect before the request is passed along to the selected backendService.",
                        additionalProperties: true,
                      },
                      name: {
                        type: "string",
                        description:
                          "The name to which this PathMatcher is referred by theHostRule.",
                      },
                      pathRules: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            customErrorResponsePolicy: {
                              type: "object",
                              properties: {
                                errorResponseRules: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      matchResponseCodes: {
                                        type: "array",
                                        items: {
                                          type: "string",
                                        },
                                        description:
                                          "Valid values include:        - A number between 400 and 599: For example      401 or 503, in which case the load balancer      applies the policy if the error code exactly matches this value.      - 5xx: Load Balancer will apply the policy if the      backend service responds with any response code in the range of      500 to 599.    - 4xx: Load      Balancer will apply the policy if the backend service responds with any      response code in the range of 400 to      499.  Values must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                                      },
                                      overrideResponseCode: {
                                        type: "integer",
                                        description:
                                          "The HTTP status code returned with the response containing the custom error content. If overrideResponseCode is not supplied, the same response code returned by the original backend bucket or backend service is returned to the client.",
                                      },
                                      path: {
                                        type: "string",
                                        description:
                                          "The full path to a file within backendBucket . For example:/errors/defaultError.html  path must start with a leading slash. path cannot have trailing slashes.  If the file is not available in backendBucket  or the load balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client.  The value must be from 1 to 1024 characters",
                                      },
                                    },
                                    description:
                                      "Specifies the mapping between the response code that will be returned along with the custom error content and the response code returned by the backend service.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Specifies rules for returning error responses.  In a given policy, if you specify rules for both a range of error codes as well as rules for specific error codes then rules with specific error codes have a higher priority. For example, assume that you configure a rule for 401 (Un-authorized) code, and another for all 4 series error codes (4XX). If the backend service returns a401, then the rule for 401 will be applied. However if the backend service returns a 403, the rule for4xx takes effect.",
                                },
                                errorService: {
                                  type: "string",
                                  description:
                                    "The full or partial URL to the BackendBucket resource that contains the custom error content. Examples are:        - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket      - compute/v1/projects/project/global/backendBuckets/myBackendBucket      - global/backendBuckets/myBackendBucket  If errorService is not specified at lower levels likepathMatcher, pathRule and routeRule, an errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService.  If load balancer cannot reach the backendBucket, a simple Not Found Error will be returned, with the original response code (oroverrideResponseCode if configured).  errorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
                                },
                              },
                              description:
                                "Specifies the custom error response policy that must be applied when the backend service or backend bucket responds with an error.",
                              additionalProperties: true,
                            },
                            paths: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "The list of path patterns to match. Each must start with / and the only place a * is allowed is at the end following a /.  The string fed to the path matcher does not include any text after the first ? or #, and those chars are not allowed here.",
                            },
                            routeAction: {
                              type: "object",
                              properties: {
                                corsPolicy: {
                                  type: "object",
                                  properties: {
                                    allowCredentials: {
                                      type: "boolean",
                                      description:
                                        "In response to a preflight request, setting this to true indicates that the actual request can include user credentials. This field translates to the Access-Control-Allow-Credentials header.  Default is false.",
                                    },
                                    allowHeaders: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the content for the Access-Control-Allow-Headers header.",
                                    },
                                    allowMethods: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the content for the Access-Control-Allow-Methods header.",
                                    },
                                    allowOriginRegexes: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies a regular expression that matches allowed origins. For more information, see regular expression syntax.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.  Regular expressions can only be used when the loadBalancingScheme is set to INTERNAL_SELF_MANAGED.",
                                    },
                                    allowOrigins: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the list of origins that is allowed to do CORS requests.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                                    },
                                    disabled: {
                                      type: "boolean",
                                      description:
                                        "If true, disables the CORS policy. The default value is false, which indicates that the CORS policy is in effect.",
                                    },
                                    exposeHeaders: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the content for the Access-Control-Expose-Headers header.",
                                    },
                                    maxAge: {
                                      type: "integer",
                                      description:
                                        "Specifies how long results of a preflight request can be cached in seconds. This field translates to the Access-Control-Max-Age header.",
                                    },
                                  },
                                  description:
                                    "The specification for allowing client-side cross-origin requests. For more information about the W3C recommendation for cross-origin resource sharing (CORS), see Fetch API Living Standard.",
                                  additionalProperties: true,
                                },
                                faultInjectionPolicy: {
                                  type: "object",
                                  properties: {
                                    abort: {
                                      type: "object",
                                      properties: {
                                        httpStatus: {
                                          type: "integer",
                                          description:
                                            "The HTTP status code used to abort the request.  The value must be from 200 to 599 inclusive.  For gRPC protocol, the gRPC status code is mapped to HTTP status code according to this mapping table. HTTP status 200 is mapped to gRPC status UNKNOWN. Injecting an OK status is currently not supported by Traffic Director.",
                                        },
                                        percentage: {
                                          type: "number",
                                          description:
                                            "The percentage of traffic for connections, operations, or requests that is aborted as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                                        },
                                      },
                                      description:
                                        "Specification for how requests are aborted as part of fault injection.",
                                      additionalProperties: true,
                                    },
                                    delay: {
                                      type: "object",
                                      properties: {
                                        fixedDelay: {
                                          type: "object",
                                          properties: {
                                            nanos: {
                                              type: "integer",
                                              description:
                                                "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                            },
                                            seconds: {
                                              type: "string",
                                              description:
                                                "64-bit integer as string",
                                            },
                                          },
                                          description:
                                            'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                          additionalProperties: true,
                                        },
                                        percentage: {
                                          type: "number",
                                          description:
                                            "The percentage of traffic for connections, operations, or requests for which a delay is introduced as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                                        },
                                      },
                                      description:
                                        "Specifies the delay introduced by the load balancer before forwarding the request to the backend service as part of fault injection.",
                                      additionalProperties: true,
                                    },
                                  },
                                  description:
                                    "The specification for fault injection introduced into traffic to test the resiliency of clients to backend service failure. As part of fault injection, when clients send requests to a backend service, delays can be introduced by the load balancer on a percentage of requests before sending those request to the backend service. Similarly requests from clients can be aborted by the load balancer for a percentage of requests.",
                                  additionalProperties: true,
                                },
                                maxStreamDuration: {
                                  type: "object",
                                  properties: {
                                    nanos: {
                                      type: "integer",
                                      description:
                                        "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                    },
                                    seconds: {
                                      type: "string",
                                      description: "64-bit integer as string",
                                    },
                                  },
                                  description:
                                    'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                  additionalProperties: true,
                                },
                                requestMirrorPolicy: {
                                  type: "object",
                                  properties: {
                                    backendService: {
                                      type: "string",
                                      description:
                                        "The full or partial URL to the BackendService resource being mirrored to.  The backend service configured for a mirroring policy must reference backends that are of the same type as the original backend service matched in the URL map.  Serverless NEG backends are not currently supported as a mirrored backend service.",
                                    },
                                    mirrorPercent: {
                                      type: "number",
                                      description:
                                        "The percentage of requests to be mirrored to `backend_service`.",
                                    },
                                  },
                                  description:
                                    "A policy that specifies how requests intended for the route's backends are shadowed to a separate mirrored backend service. The load balancer doesn't wait for responses from the shadow service. Before sending traffic to the shadow service, the host or authority header is suffixed with-shadow.",
                                  additionalProperties: true,
                                },
                                retryPolicy: {
                                  type: "object",
                                  properties: {
                                    numRetries: {
                                      type: "integer",
                                      description:
                                        "Specifies the allowed number retries. This number must be > 0. If not specified, defaults to 1.",
                                    },
                                    perTryTimeout: {
                                      type: "object",
                                      properties: {
                                        nanos: {
                                          type: "integer",
                                          description:
                                            "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                        },
                                        seconds: {
                                          type: "string",
                                          description:
                                            "64-bit integer as string",
                                        },
                                      },
                                      description:
                                        'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                      additionalProperties: true,
                                    },
                                    retryConditions: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies one or more conditions when this retry policy applies. Valid values are:     - 5xx: retry is attempted if the instance or endpoint    responds with any 5xx response code, or if the instance or    endpoint does not respond at all. For example, disconnects, reset, read    timeout, connection failure, and refused streams.    - gateway-error: Similar to 5xx, but only    applies to response codes 502, 503 or504.    - connect-failure: a retry is attempted on failures    connecting to the instance or endpoint. For example, connection    timeouts.    - retriable-4xx: a retry is attempted if the instance    or endpoint responds with a 4xx response code.    The only error that you can retry is error code 409.    - refused-stream: a retry is attempted if the instance    or endpoint resets the stream with a REFUSED_STREAM error    code. This reset type indicates that it is safe to retry.    - cancelled: a retry is attempted if the gRPC status    code in the response header is set to cancelled.    - deadline-exceeded: a retry is attempted if the gRPC    status code in the response header is set todeadline-exceeded.    - internal: a retry is attempted if the gRPC    status code in the response header is set tointernal.    - resource-exhausted: a retry is attempted if the gRPC    status code in the response header is set toresource-exhausted.    - unavailable: a retry is attempted if the gRPC    status code in the response header is set tounavailable.  Only the following codes are supported when the URL map is bound to target gRPC proxy that has validateForProxyless field set to true.     - cancelled    - deadline-exceeded    - internal    - resource-exhausted    - unavailable",
                                    },
                                  },
                                  description:
                                    "The retry policy associates with HttpRouteRule",
                                  additionalProperties: true,
                                },
                                timeout: {
                                  type: "object",
                                  properties: {
                                    nanos: {
                                      type: "integer",
                                      description:
                                        "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                    },
                                    seconds: {
                                      type: "string",
                                      description: "64-bit integer as string",
                                    },
                                  },
                                  description:
                                    'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                  additionalProperties: true,
                                },
                                urlRewrite: {
                                  type: "object",
                                  properties: {
                                    hostRewrite: {
                                      type: "string",
                                      description:
                                        "Before forwarding the request to the selected service, the request's host header is replaced with contents of hostRewrite.  The value must be from 1 to 255 characters.",
                                    },
                                    pathPrefixRewrite: {
                                      type: "string",
                                      description:
                                        "Before forwarding the request to the selected backend service, the matching portion of the request's path is replaced bypathPrefixRewrite.  The value must be from 1 to 1024 characters.",
                                    },
                                    pathTemplateRewrite: {
                                      type: "string",
                                      description:
                                        "If specified, the pattern rewrites the URL path (based on the :path header) using the HTTP template syntax.  A corresponding path_template_match must be specified. Any template variables must exist in the path_template_match field.         - -At least one variable must be specified in the path_template_match       field    - You can omit variables from the rewritten URL       - The * and ** operators cannot be matched       unless they have a corresponding variable name - e.g.       {format=*} or {var=**}.  For example, a path_template_match of /static/{format=**} could be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a rewrite, so that /{country}/{format}/{suffix=**} can be rewritten as /content/{format}/{country}/{suffix}.  At least one non-empty routeRules[].matchRules[].path_template_match is required.  Only one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                                    },
                                  },
                                  description:
                                    "The spec for modifying the path before sending the request to the matched backend service.",
                                  additionalProperties: true,
                                },
                                weightedBackendServices: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      backendService: {
                                        type: "string",
                                        description:
                                          "The full or partial URL to the default BackendService resource. Before forwarding the request to backendService, the load balancer applies any relevant headerActions specified as part of thisbackendServiceWeight.",
                                      },
                                      headerAction: {
                                        type: "object",
                                        properties: {
                                          requestHeadersToAdd: {
                                            type: "array",
                                            items: {
                                              type: "object",
                                              properties: {
                                                headerName: {
                                                  type: "string",
                                                  description:
                                                    "The name of the header.",
                                                },
                                                headerValue: {
                                                  type: "string",
                                                  description:
                                                    "The value of the header to add.",
                                                },
                                                replace: {
                                                  type: "boolean",
                                                  description:
                                                    "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                                },
                                              },
                                              description:
                                                "Specification determining how headers are added to requests or responses.",
                                              additionalProperties: true,
                                            },
                                            description:
                                              "Headers to add to a matching request before forwarding the request to thebackendService.",
                                          },
                                          requestHeadersToRemove: {
                                            type: "array",
                                            items: {
                                              type: "string",
                                            },
                                            description:
                                              "A list of header names for headers that need to be removed from the request before forwarding the request to the backendService.",
                                          },
                                          responseHeadersToAdd: {
                                            type: "array",
                                            items: {
                                              type: "object",
                                              properties: {
                                                headerName: {
                                                  type: "string",
                                                  description:
                                                    "The name of the header.",
                                                },
                                                headerValue: {
                                                  type: "string",
                                                  description:
                                                    "The value of the header to add.",
                                                },
                                                replace: {
                                                  type: "boolean",
                                                  description:
                                                    "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                                },
                                              },
                                              description:
                                                "Specification determining how headers are added to requests or responses.",
                                              additionalProperties: true,
                                            },
                                            description:
                                              "Headers to add the response before sending the response back to the client.",
                                          },
                                          responseHeadersToRemove: {
                                            type: "array",
                                            items: {
                                              type: "string",
                                            },
                                            description:
                                              "A list of header names for headers that need to be removed from the response before sending the response back to the client.",
                                          },
                                        },
                                        description:
                                          "The request and response header transformations that take effect before the request is passed along to the selected backendService.",
                                        additionalProperties: true,
                                      },
                                      weight: {
                                        type: "integer",
                                        description:
                                          "Specifies the fraction of traffic sent to a backend service, computed asweight / (sum of all weightedBackendService weights in routeAction).  The selection of a backend service is determined only for new traffic. Once a user's request has been directed to a backend service, subsequent requests are sent to the same backend service as determined by the backend service's session affinity policy. Don't configure session affinity if you're using weighted traffic splitting. If you do, the weighted traffic splitting configuration takes precedence.  The value must be from 0 to 1000.",
                                      },
                                    },
                                    description:
                                      "In contrast to a single BackendService in HttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across multiple backend services. The volume of traffic for each backend service is proportional to the weight specified in each WeightedBackendService",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "A list of weighted backend services to send traffic to when a route match occurs. The weights determine the fraction of traffic that flows to their corresponding backend service. If all traffic needs to go to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.  After a backend service is identified and before forwarding the request to the backend service, advanced routing actions such as URL rewrites and header transformations are applied depending on additional settings specified in this HttpRouteAction.",
                                },
                              },
                              additionalProperties: true,
                              description:
                                "In response to a matching path, the load balancer performs advanced routing actions, such as URL rewrites and header transformations, before forwarding the request to the selected backend.   Only one of urlRedirect, service orrouteAction.weightedBackendService can be set.   URL maps for classic Application Load Balancers only support the urlRewrite action within a path rule'srouteAction.",
                            },
                            service: {
                              type: "string",
                              description:
                                "The full or partial URL of the backend service resource to which traffic is directed if this rule is matched. If routeAction is also specified, advanced routing actions, such as URL rewrites, take effect before sending the request to the backend.   Only one of urlRedirect, service orrouteAction.weightedBackendService can be set.",
                            },
                            urlRedirect: {
                              type: "object",
                              properties: {
                                hostRedirect: {
                                  type: "string",
                                  description:
                                    "The host that is used in the redirect response instead of the one that was supplied in the request.  The value must be from 1 to 255 characters.",
                                },
                                httpsRedirect: {
                                  type: "boolean",
                                  description:
                                    "If set to true, the URL scheme in the redirected request is set to HTTPS. If set to false, the URL scheme of the redirected request remains the same as that of the request.  This must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.  The default is set to false.",
                                },
                                pathRedirect: {
                                  type: "string",
                                  description:
                                    "The path that is used in the redirect response instead of the one that was supplied in the request.  pathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                                },
                                prefixRedirect: {
                                  type: "string",
                                  description:
                                    "The prefix that replaces the prefixMatch specified in the HttpRouteRuleMatch, retaining the remaining portion of the URL before redirecting the request.  prefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                                },
                                redirectResponseCode: {
                                  type: "string",
                                  description:
                                    "The HTTP Status code to use for this RedirectAction.  Supported values are:     - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds    to 301.    - FOUND, which corresponds to 302.    - SEE_OTHER which corresponds to 303.    - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request    method is retained.    - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request    method is retained. Check the RedirectResponseCode enum for the list of possible values.",
                                },
                                stripQuery: {
                                  type: "boolean",
                                  description:
                                    "If set to true, any accompanying query portion of the original URL is removed before redirecting the request. If set to false, the query portion of the original URL is retained.  The default is set to false.",
                                },
                              },
                              description:
                                "Specifies settings for an HTTP redirect.",
                              additionalProperties: true,
                            },
                          },
                          description:
                            "A path-matching rule for a URL. If matched, will use the specifiedBackendService to handle the traffic arriving at this URL.",
                          additionalProperties: true,
                        },
                        description:
                          'The list of path rules. Use this list instead of routeRules when routing based on simple path matching is all that\'s required. A path rule can only include a wildcard character (*) after a forward slash character ("/").  The order by which path rules are specified does not matter. Matches are always done on the longest-path-first basis.  For example: a pathRule with a path /a/b/c/* will match before /a/b/* irrespective of the order in which those paths appear in this list.  Within a given pathMatcher, only one ofpathRules or routeRules must be set.',
                      },
                      routeRules: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            customErrorResponsePolicy: {
                              type: "object",
                              properties: {
                                errorResponseRules: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      matchResponseCodes: {
                                        type: "array",
                                        items: {
                                          type: "string",
                                        },
                                        description:
                                          "Valid values include:        - A number between 400 and 599: For example      401 or 503, in which case the load balancer      applies the policy if the error code exactly matches this value.      - 5xx: Load Balancer will apply the policy if the      backend service responds with any response code in the range of      500 to 599.    - 4xx: Load      Balancer will apply the policy if the backend service responds with any      response code in the range of 400 to      499.  Values must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                                      },
                                      overrideResponseCode: {
                                        type: "integer",
                                        description:
                                          "The HTTP status code returned with the response containing the custom error content. If overrideResponseCode is not supplied, the same response code returned by the original backend bucket or backend service is returned to the client.",
                                      },
                                      path: {
                                        type: "string",
                                        description:
                                          "The full path to a file within backendBucket . For example:/errors/defaultError.html  path must start with a leading slash. path cannot have trailing slashes.  If the file is not available in backendBucket  or the load balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client.  The value must be from 1 to 1024 characters",
                                      },
                                    },
                                    description:
                                      "Specifies the mapping between the response code that will be returned along with the custom error content and the response code returned by the backend service.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Specifies rules for returning error responses.  In a given policy, if you specify rules for both a range of error codes as well as rules for specific error codes then rules with specific error codes have a higher priority. For example, assume that you configure a rule for 401 (Un-authorized) code, and another for all 4 series error codes (4XX). If the backend service returns a401, then the rule for 401 will be applied. However if the backend service returns a 403, the rule for4xx takes effect.",
                                },
                                errorService: {
                                  type: "string",
                                  description:
                                    "The full or partial URL to the BackendBucket resource that contains the custom error content. Examples are:        - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket      - compute/v1/projects/project/global/backendBuckets/myBackendBucket      - global/backendBuckets/myBackendBucket  If errorService is not specified at lower levels likepathMatcher, pathRule and routeRule, an errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService.  If load balancer cannot reach the backendBucket, a simple Not Found Error will be returned, with the original response code (oroverrideResponseCode if configured).  errorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
                                },
                              },
                              description:
                                "Specifies the custom error response policy that must be applied when the backend service or backend bucket responds with an error.",
                              additionalProperties: true,
                            },
                            description: {
                              type: "string",
                              description:
                                "The short description conveying the intent of this routeRule.   The description can have a maximum length of 1024 characters.",
                            },
                            headerAction: {
                              type: "object",
                              properties: {
                                requestHeadersToAdd: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      headerName: {
                                        type: "string",
                                        description: "The name of the header.",
                                      },
                                      headerValue: {
                                        type: "string",
                                        description:
                                          "The value of the header to add.",
                                      },
                                      replace: {
                                        type: "boolean",
                                        description:
                                          "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                      },
                                    },
                                    description:
                                      "Specification determining how headers are added to requests or responses.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Headers to add to a matching request before forwarding the request to thebackendService.",
                                },
                                requestHeadersToRemove: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    "A list of header names for headers that need to be removed from the request before forwarding the request to the backendService.",
                                },
                                responseHeadersToAdd: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      headerName: {
                                        type: "string",
                                        description: "The name of the header.",
                                      },
                                      headerValue: {
                                        type: "string",
                                        description:
                                          "The value of the header to add.",
                                      },
                                      replace: {
                                        type: "boolean",
                                        description:
                                          "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                      },
                                    },
                                    description:
                                      "Specification determining how headers are added to requests or responses.",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "Headers to add the response before sending the response back to the client.",
                                },
                                responseHeadersToRemove: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    "A list of header names for headers that need to be removed from the response before sending the response back to the client.",
                                },
                              },
                              description:
                                "The request and response header transformations that take effect before the request is passed along to the selected backendService.",
                              additionalProperties: true,
                            },
                            matchRules: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  fullPathMatch: {
                                    type: "string",
                                    description:
                                      "For satisfying the matchRule condition, the path of the request must exactly match the value specified infullPathMatch after removing any query parameters and anchor that may be part of the original URL.  fullPathMatch must be from 1 to 1024 characters.  Only one of prefixMatch, fullPathMatch,regexMatch or path_template_match must be specified.",
                                  },
                                  headerMatches: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                      properties: {
                                        exactMatch: {
                                          type: "string",
                                          description:
                                            "The value should exactly match contents of exactMatch.  Only one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                        },
                                        headerName: {
                                          type: "string",
                                          description:
                                            'The name of the HTTP header to match.  For matching against the HTTP request\'s authority, use a headerMatch with the header name ":authority".  For matching a request\'s method, use the headerName ":method".  When the URL map is bound to a target gRPC proxy that has the validateForProxyless field set to true, only non-binary user-specified custom metadata and the `content-type` header are supported. The following transport-level headers cannot be used in header matching rules: `:authority`, `:method`, `:path`, `:scheme`, `user-agent`, `accept-encoding`, `content-encoding`, `grpc-accept-encoding`, `grpc-encoding`, `grpc-previous-rpc-attempts`, `grpc-tags-bin`, `grpc-timeout` and `grpc-trace-bin`.',
                                        },
                                        invertMatch: {
                                          type: "boolean",
                                          description:
                                            "If set to false, the headerMatch is considered a match if the preceding match criteria are met. If set to true, the headerMatch is considered a match if the preceding match criteria are NOT met.  The default setting is false.",
                                        },
                                        prefixMatch: {
                                          type: "string",
                                          description:
                                            "The value of the header must start with the contents ofprefixMatch.  Only one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                        },
                                        presentMatch: {
                                          type: "boolean",
                                          description:
                                            "A header with the contents of headerName must exist. The match takes place whether or not the request's header has a value.  Only one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                        },
                                        rangeMatch: {
                                          type: "object",
                                          properties: {
                                            rangeEnd: {
                                              type: "string",
                                              description:
                                                "64-bit integer as string",
                                            },
                                            rangeStart: {
                                              type: "string",
                                              description:
                                                "64-bit integer as string",
                                            },
                                          },
                                          description:
                                            "HttpRouteRuleMatch criteria for field values that must stay within the specified integer range.",
                                          additionalProperties: true,
                                        },
                                        regexMatch: {
                                          type: "string",
                                          description:
                                            "The value of the header must match the regular expression specified inregexMatch. For more information about regular expression syntax, see Syntax.  For matching against a port specified in the HTTP request, use a headerMatch with headerName set to PORT and a regular expression that satisfies the RFC2616 Host header's port specifier.  Only one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.  Regular expressions can only be used when the loadBalancingScheme is set to INTERNAL_SELF_MANAGED, EXTERNAL_MANAGED (regional scope) or INTERNAL_MANAGED.",
                                        },
                                        suffixMatch: {
                                          type: "string",
                                          description:
                                            "The value of the header must end with the contents ofsuffixMatch.  Only one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                        },
                                      },
                                      description:
                                        "matchRule criteria for request header matches.",
                                      additionalProperties: true,
                                    },
                                    description:
                                      "Specifies a list of header match criteria, all of which must match corresponding headers in the request.",
                                  },
                                  ignoreCase: {
                                    type: "boolean",
                                    description:
                                      "Specifies that prefixMatch and fullPathMatch matches are case sensitive.  The default value is false.  ignoreCase must not be used with regexMatch.  Not supported when the URL map is bound to a target gRPC proxy.",
                                  },
                                  metadataFilters: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                      properties: {
                                        filterLabels: {
                                          type: "array",
                                          items: {
                                            type: "object",
                                            properties: {
                                              name: {
                                                type: "string",
                                                description:
                                                  "Name of metadata label.   The name can have a maximum length of 1024 characters and must be at least 1 character long.",
                                              },
                                              value: {
                                                type: "string",
                                                description:
                                                  "The value of the label must match the specified value.  value can have a maximum length of 1024 characters.",
                                              },
                                            },
                                            description:
                                              "MetadataFilter label name value pairs that are expected to match corresponding labels presented as metadata to the load balancer.",
                                            additionalProperties: true,
                                          },
                                          description:
                                            "The list of label value pairs that must match labels in the provided metadata based on filterMatchCriteria  This list must not be empty and can have at the most 64 entries.",
                                        },
                                        filterMatchCriteria: {
                                          type: "string",
                                          description:
                                            "Specifies how individual filter label matches within the list of filterLabels and contributes toward the overall metadataFilter match.   Supported values are:     - MATCH_ANY: at least one of the filterLabels    must have a matching label in the provided metadata.    - MATCH_ALL: all filterLabels must have    matching labels in the provided metadata. Check the FilterMatchCriteria enum for the list of possible values.",
                                        },
                                      },
                                      description:
                                        "Opaque filter criteria used by load balancers to restrict routing configuration to a limited set of load balancing proxies. Proxies and sidecars involved in load balancing would typically present metadata to the load balancers that need to match criteria specified here. If a match takes place, the relevant configuration is made available to those proxies.  For each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least one of thefilterLabels must match the corresponding label provided in the metadata. If its filterMatchCriteria is set to MATCH_ALL, then all of its filterLabels must match with corresponding labels provided in the metadata.  An example for using metadataFilters would be: if load balancing involves Envoys, they receive routing configuration when values inmetadataFilters match values supplied in  of their XDS requests to loadbalancers.",
                                      additionalProperties: true,
                                    },
                                    description:
                                      "Opaque filter criteria used by the load balancer to restrict routing configuration to a limited set of xDS compliant clients. In their xDS requests to the load balancer, xDS clients present node metadata. When there is a match, the relevant routing configuration is made available to those proxies.  For each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least one of thefilterLabels must match the corresponding label provided in the metadata. If its filterMatchCriteria is set to MATCH_ALL, then all of its filterLabels must match with corresponding labels provided in the metadata. If multiple metadata filters are specified, all of them need to be satisfied in order to be considered a match.  metadataFilters specified here is applied after those specified in ForwardingRule that refers to theUrlMap this HttpRouteRuleMatch belongs to.  metadataFilters only applies to load balancers that haveloadBalancingScheme set toINTERNAL_SELF_MANAGED.  Not supported when the URL map is bound to a target gRPC proxy that has validateForProxyless field set to true.",
                                  },
                                  pathTemplateMatch: {
                                    type: "string",
                                    description:
                                      'If specified, this field defines a path template pattern that must match the :path header after the query string is removed.  A path template pattern can include variables and wildcards. Variables are enclosed in curly braces, for example{variable_name}. Wildcards include * that matches a single path segment, and ** that matches zero or more path segments. The pattern must follow these rules:         - The value must be between 1 and 1024 characters.       - The pattern must start with a leading slash ("/").       - No more than 5 operators (variables or wildcards) may appear in       the pattern.  Precisely one ofprefixMatch, fullPathMatch,regexMatch, or pathTemplateMatch must be set.',
                                  },
                                  prefixMatch: {
                                    type: "string",
                                    description:
                                      "For satisfying the matchRule condition, the request's path must begin with the specified prefixMatch.prefixMatch must begin with a /.  The value must be from 1 to 1024 characters.  The * character inside a prefix match is treated as a literal character, not as a wildcard.  Only one of prefixMatch, fullPathMatch,regexMatch or path_template_match can be used within a matchRule.",
                                  },
                                  queryParameterMatches: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                      properties: {
                                        exactMatch: {
                                          type: "string",
                                          description:
                                            "The queryParameterMatch matches if the value of the parameter exactly matches the contents of exactMatch.  Only one of presentMatch, exactMatch, orregexMatch must be set.",
                                        },
                                        name: {
                                          type: "string",
                                          description:
                                            "The name of the query parameter to match. The query parameter must exist in the request, in the absence of which the request match fails.",
                                        },
                                        presentMatch: {
                                          type: "boolean",
                                          description:
                                            "Specifies that the queryParameterMatch matches if the request contains the query parameter, irrespective of whether the parameter has a value or not.  Only one of presentMatch, exactMatch, orregexMatch must be set.",
                                        },
                                        regexMatch: {
                                          type: "string",
                                          description:
                                            "The queryParameterMatch matches if the value of the parameter matches the regular expression specified byregexMatch. For more information about regular expression syntax, see Syntax.  Only one of presentMatch, exactMatch, orregexMatch must be set.  Regular expressions can only be used when the loadBalancingScheme is set to INTERNAL_SELF_MANAGED, EXTERNAL_MANAGED (regional scope) or INTERNAL_MANAGED.",
                                        },
                                      },
                                      description:
                                        "HttpRouteRuleMatch criteria for a request's query parameter.",
                                      additionalProperties: true,
                                    },
                                    description:
                                      "Specifies a list of query parameter match criteria, all of which must match corresponding query parameters in the request.  Not supported when the URL map is bound to a target gRPC proxy.",
                                  },
                                  regexMatch: {
                                    type: "string",
                                    description:
                                      "For satisfying the matchRule condition, the path of the request must satisfy the regular expression specified inregexMatch after removing any query parameters and anchor supplied with the original URL. For more information about regular expression syntax, see Syntax.  Only one of prefixMatch, fullPathMatch,regexMatch or path_template_match must be specified.  Regular expressions can only be used when the loadBalancingScheme is set to INTERNAL_SELF_MANAGED, EXTERNAL_MANAGED (regional scope) or INTERNAL_MANAGED.",
                                  },
                                },
                                description:
                                  "HttpRouteRuleMatch specifies a set of criteria for matching requests to an HttpRouteRule. All specified criteria must be satisfied for a match to occur.",
                                additionalProperties: true,
                              },
                              description:
                                "The list of criteria for matching attributes of a request to thisrouteRule. This list has OR semantics: the request matches this routeRule when any of thematchRules are satisfied. However predicates within a given matchRule have AND semantics. All predicates within a matchRule must match for the request to match the rule.",
                            },
                            priority: {
                              type: "integer",
                              description:
                                "For routeRules within a given pathMatcher, priority determines the order in which a load balancer interpretsrouteRules. RouteRules are evaluated in order of priority, from the lowest to highest number. The priority of a rule decreases as its number increases (1, 2, 3, N+1). The first rule that matches the request is applied.   You cannot configure two or more routeRules with the same priority. Priority for each rule must be set to a number from 0 to 2147483647 inclusive.   Priority numbers can have gaps, which enable you to add or remove rules in the future without affecting the rest of the rules. For example, 1, 2, 3, 4, 5, 9, 12, 16 is a valid series of priority numbers to which you could add rules numbered from 6 to 8, 10 to 11, and 13 to 15 in the future without any impact on existing rules.",
                            },
                            routeAction: {
                              type: "object",
                              properties: {
                                corsPolicy: {
                                  type: "object",
                                  properties: {
                                    allowCredentials: {
                                      type: "boolean",
                                      description:
                                        "In response to a preflight request, setting this to true indicates that the actual request can include user credentials. This field translates to the Access-Control-Allow-Credentials header.  Default is false.",
                                    },
                                    allowHeaders: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the content for the Access-Control-Allow-Headers header.",
                                    },
                                    allowMethods: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the content for the Access-Control-Allow-Methods header.",
                                    },
                                    allowOriginRegexes: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies a regular expression that matches allowed origins. For more information, see regular expression syntax.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.  Regular expressions can only be used when the loadBalancingScheme is set to INTERNAL_SELF_MANAGED.",
                                    },
                                    allowOrigins: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the list of origins that is allowed to do CORS requests.  An origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                                    },
                                    disabled: {
                                      type: "boolean",
                                      description:
                                        "If true, disables the CORS policy. The default value is false, which indicates that the CORS policy is in effect.",
                                    },
                                    exposeHeaders: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies the content for the Access-Control-Expose-Headers header.",
                                    },
                                    maxAge: {
                                      type: "integer",
                                      description:
                                        "Specifies how long results of a preflight request can be cached in seconds. This field translates to the Access-Control-Max-Age header.",
                                    },
                                  },
                                  description:
                                    "The specification for allowing client-side cross-origin requests. For more information about the W3C recommendation for cross-origin resource sharing (CORS), see Fetch API Living Standard.",
                                  additionalProperties: true,
                                },
                                faultInjectionPolicy: {
                                  type: "object",
                                  properties: {
                                    abort: {
                                      type: "object",
                                      properties: {
                                        httpStatus: {
                                          type: "integer",
                                          description:
                                            "The HTTP status code used to abort the request.  The value must be from 200 to 599 inclusive.  For gRPC protocol, the gRPC status code is mapped to HTTP status code according to this mapping table. HTTP status 200 is mapped to gRPC status UNKNOWN. Injecting an OK status is currently not supported by Traffic Director.",
                                        },
                                        percentage: {
                                          type: "number",
                                          description:
                                            "The percentage of traffic for connections, operations, or requests that is aborted as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                                        },
                                      },
                                      description:
                                        "Specification for how requests are aborted as part of fault injection.",
                                      additionalProperties: true,
                                    },
                                    delay: {
                                      type: "object",
                                      properties: {
                                        fixedDelay: {
                                          type: "object",
                                          properties: {
                                            nanos: {
                                              type: "integer",
                                              description:
                                                "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                            },
                                            seconds: {
                                              type: "string",
                                              description:
                                                "64-bit integer as string",
                                            },
                                          },
                                          description:
                                            'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                          additionalProperties: true,
                                        },
                                        percentage: {
                                          type: "number",
                                          description:
                                            "The percentage of traffic for connections, operations, or requests for which a delay is introduced as part of fault injection.  The value must be from 0.0 to 100.0 inclusive.",
                                        },
                                      },
                                      description:
                                        "Specifies the delay introduced by the load balancer before forwarding the request to the backend service as part of fault injection.",
                                      additionalProperties: true,
                                    },
                                  },
                                  description:
                                    "The specification for fault injection introduced into traffic to test the resiliency of clients to backend service failure. As part of fault injection, when clients send requests to a backend service, delays can be introduced by the load balancer on a percentage of requests before sending those request to the backend service. Similarly requests from clients can be aborted by the load balancer for a percentage of requests.",
                                  additionalProperties: true,
                                },
                                maxStreamDuration: {
                                  type: "object",
                                  properties: {
                                    nanos: {
                                      type: "integer",
                                      description:
                                        "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                    },
                                    seconds: {
                                      type: "string",
                                      description: "64-bit integer as string",
                                    },
                                  },
                                  description:
                                    'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                  additionalProperties: true,
                                },
                                requestMirrorPolicy: {
                                  type: "object",
                                  properties: {
                                    backendService: {
                                      type: "string",
                                      description:
                                        "The full or partial URL to the BackendService resource being mirrored to.  The backend service configured for a mirroring policy must reference backends that are of the same type as the original backend service matched in the URL map.  Serverless NEG backends are not currently supported as a mirrored backend service.",
                                    },
                                    mirrorPercent: {
                                      type: "number",
                                      description:
                                        "The percentage of requests to be mirrored to `backend_service`.",
                                    },
                                  },
                                  description:
                                    "A policy that specifies how requests intended for the route's backends are shadowed to a separate mirrored backend service. The load balancer doesn't wait for responses from the shadow service. Before sending traffic to the shadow service, the host or authority header is suffixed with-shadow.",
                                  additionalProperties: true,
                                },
                                retryPolicy: {
                                  type: "object",
                                  properties: {
                                    numRetries: {
                                      type: "integer",
                                      description:
                                        "Specifies the allowed number retries. This number must be > 0. If not specified, defaults to 1.",
                                    },
                                    perTryTimeout: {
                                      type: "object",
                                      properties: {
                                        nanos: {
                                          type: "integer",
                                          description:
                                            "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                        },
                                        seconds: {
                                          type: "string",
                                          description:
                                            "64-bit integer as string",
                                        },
                                      },
                                      description:
                                        'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                      additionalProperties: true,
                                    },
                                    retryConditions: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "Specifies one or more conditions when this retry policy applies. Valid values are:     - 5xx: retry is attempted if the instance or endpoint    responds with any 5xx response code, or if the instance or    endpoint does not respond at all. For example, disconnects, reset, read    timeout, connection failure, and refused streams.    - gateway-error: Similar to 5xx, but only    applies to response codes 502, 503 or504.    - connect-failure: a retry is attempted on failures    connecting to the instance or endpoint. For example, connection    timeouts.    - retriable-4xx: a retry is attempted if the instance    or endpoint responds with a 4xx response code.    The only error that you can retry is error code 409.    - refused-stream: a retry is attempted if the instance    or endpoint resets the stream with a REFUSED_STREAM error    code. This reset type indicates that it is safe to retry.    - cancelled: a retry is attempted if the gRPC status    code in the response header is set to cancelled.    - deadline-exceeded: a retry is attempted if the gRPC    status code in the response header is set todeadline-exceeded.    - internal: a retry is attempted if the gRPC    status code in the response header is set tointernal.    - resource-exhausted: a retry is attempted if the gRPC    status code in the response header is set toresource-exhausted.    - unavailable: a retry is attempted if the gRPC    status code in the response header is set tounavailable.  Only the following codes are supported when the URL map is bound to target gRPC proxy that has validateForProxyless field set to true.     - cancelled    - deadline-exceeded    - internal    - resource-exhausted    - unavailable",
                                    },
                                  },
                                  description:
                                    "The retry policy associates with HttpRouteRule",
                                  additionalProperties: true,
                                },
                                timeout: {
                                  type: "object",
                                  properties: {
                                    nanos: {
                                      type: "integer",
                                      description:
                                        "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                                    },
                                    seconds: {
                                      type: "string",
                                      description: "64-bit integer as string",
                                    },
                                  },
                                  description:
                                    'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                                  additionalProperties: true,
                                },
                                urlRewrite: {
                                  type: "object",
                                  properties: {
                                    hostRewrite: {
                                      type: "string",
                                      description:
                                        "Before forwarding the request to the selected service, the request's host header is replaced with contents of hostRewrite.  The value must be from 1 to 255 characters.",
                                    },
                                    pathPrefixRewrite: {
                                      type: "string",
                                      description:
                                        "Before forwarding the request to the selected backend service, the matching portion of the request's path is replaced bypathPrefixRewrite.  The value must be from 1 to 1024 characters.",
                                    },
                                    pathTemplateRewrite: {
                                      type: "string",
                                      description:
                                        "If specified, the pattern rewrites the URL path (based on the :path header) using the HTTP template syntax.  A corresponding path_template_match must be specified. Any template variables must exist in the path_template_match field.         - -At least one variable must be specified in the path_template_match       field    - You can omit variables from the rewritten URL       - The * and ** operators cannot be matched       unless they have a corresponding variable name - e.g.       {format=*} or {var=**}.  For example, a path_template_match of /static/{format=**} could be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a rewrite, so that /{country}/{format}/{suffix=**} can be rewritten as /content/{format}/{country}/{suffix}.  At least one non-empty routeRules[].matchRules[].path_template_match is required.  Only one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                                    },
                                  },
                                  description:
                                    "The spec for modifying the path before sending the request to the matched backend service.",
                                  additionalProperties: true,
                                },
                                weightedBackendServices: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      backendService: {
                                        type: "string",
                                        description:
                                          "The full or partial URL to the default BackendService resource. Before forwarding the request to backendService, the load balancer applies any relevant headerActions specified as part of thisbackendServiceWeight.",
                                      },
                                      headerAction: {
                                        type: "object",
                                        properties: {
                                          requestHeadersToAdd: {
                                            type: "array",
                                            items: {
                                              type: "object",
                                              properties: {
                                                headerName: {
                                                  type: "string",
                                                  description:
                                                    "The name of the header.",
                                                },
                                                headerValue: {
                                                  type: "string",
                                                  description:
                                                    "The value of the header to add.",
                                                },
                                                replace: {
                                                  type: "boolean",
                                                  description:
                                                    "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                                },
                                              },
                                              description:
                                                "Specification determining how headers are added to requests or responses.",
                                              additionalProperties: true,
                                            },
                                            description:
                                              "Headers to add to a matching request before forwarding the request to thebackendService.",
                                          },
                                          requestHeadersToRemove: {
                                            type: "array",
                                            items: {
                                              type: "string",
                                            },
                                            description:
                                              "A list of header names for headers that need to be removed from the request before forwarding the request to the backendService.",
                                          },
                                          responseHeadersToAdd: {
                                            type: "array",
                                            items: {
                                              type: "object",
                                              properties: {
                                                headerName: {
                                                  type: "string",
                                                  description:
                                                    "The name of the header.",
                                                },
                                                headerValue: {
                                                  type: "string",
                                                  description:
                                                    "The value of the header to add.",
                                                },
                                                replace: {
                                                  type: "boolean",
                                                  description:
                                                    "If false, headerValue is appended to any values that already exist for the header. If true, headerValue is set for the header, discarding any values that were set for that header.  The default value is true, unless a variable is present in headerValue, in which case the default value is false. .",
                                                },
                                              },
                                              description:
                                                "Specification determining how headers are added to requests or responses.",
                                              additionalProperties: true,
                                            },
                                            description:
                                              "Headers to add the response before sending the response back to the client.",
                                          },
                                          responseHeadersToRemove: {
                                            type: "array",
                                            items: {
                                              type: "string",
                                            },
                                            description:
                                              "A list of header names for headers that need to be removed from the response before sending the response back to the client.",
                                          },
                                        },
                                        description:
                                          "The request and response header transformations that take effect before the request is passed along to the selected backendService.",
                                        additionalProperties: true,
                                      },
                                      weight: {
                                        type: "integer",
                                        description:
                                          "Specifies the fraction of traffic sent to a backend service, computed asweight / (sum of all weightedBackendService weights in routeAction).  The selection of a backend service is determined only for new traffic. Once a user's request has been directed to a backend service, subsequent requests are sent to the same backend service as determined by the backend service's session affinity policy. Don't configure session affinity if you're using weighted traffic splitting. If you do, the weighted traffic splitting configuration takes precedence.  The value must be from 0 to 1000.",
                                      },
                                    },
                                    description:
                                      "In contrast to a single BackendService in HttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across multiple backend services. The volume of traffic for each backend service is proportional to the weight specified in each WeightedBackendService",
                                    additionalProperties: true,
                                  },
                                  description:
                                    "A list of weighted backend services to send traffic to when a route match occurs. The weights determine the fraction of traffic that flows to their corresponding backend service. If all traffic needs to go to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.  After a backend service is identified and before forwarding the request to the backend service, advanced routing actions such as URL rewrites and header transformations are applied depending on additional settings specified in this HttpRouteAction.",
                                },
                              },
                              additionalProperties: true,
                              description:
                                "In response to a matching matchRule, the load balancer performs advanced routing actions, such as URL rewrites and header transformations, before forwarding the request to the selected backend.   Only one of urlRedirect, service orrouteAction.weightedBackendService can be set.   URL maps for classic Application Load Balancers only support the urlRewrite action within a route rule'srouteAction.",
                            },
                            service: {
                              type: "string",
                              description:
                                "The full or partial URL of the backend service resource to which traffic is directed if this rule is matched. If routeAction is also specified, advanced routing actions, such as URL rewrites, take effect before sending the request to the backend.   Only one of urlRedirect, service orrouteAction.weightedBackendService can be set.",
                            },
                            urlRedirect: {
                              type: "object",
                              properties: {
                                hostRedirect: {
                                  type: "string",
                                  description:
                                    "The host that is used in the redirect response instead of the one that was supplied in the request.  The value must be from 1 to 255 characters.",
                                },
                                httpsRedirect: {
                                  type: "boolean",
                                  description:
                                    "If set to true, the URL scheme in the redirected request is set to HTTPS. If set to false, the URL scheme of the redirected request remains the same as that of the request.  This must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.  The default is set to false.",
                                },
                                pathRedirect: {
                                  type: "string",
                                  description:
                                    "The path that is used in the redirect response instead of the one that was supplied in the request.  pathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                                },
                                prefixRedirect: {
                                  type: "string",
                                  description:
                                    "The prefix that replaces the prefixMatch specified in the HttpRouteRuleMatch, retaining the remaining portion of the URL before redirecting the request.  prefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is supplied, the path of the original request is used for the redirect.  The value must be from 1 to 1024 characters.",
                                },
                                redirectResponseCode: {
                                  type: "string",
                                  description:
                                    "The HTTP Status code to use for this RedirectAction.  Supported values are:     - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds    to 301.    - FOUND, which corresponds to 302.    - SEE_OTHER which corresponds to 303.    - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request    method is retained.    - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request    method is retained. Check the RedirectResponseCode enum for the list of possible values.",
                                },
                                stripQuery: {
                                  type: "boolean",
                                  description:
                                    "If set to true, any accompanying query portion of the original URL is removed before redirecting the request. If set to false, the query portion of the original URL is retained.  The default is set to false.",
                                },
                              },
                              description:
                                "Specifies settings for an HTTP redirect.",
                              additionalProperties: true,
                            },
                          },
                          description:
                            "The HttpRouteRule setting specifies how to match an HTTP request and the corresponding routing action that load balancing proxies perform.",
                          additionalProperties: true,
                        },
                        description:
                          "The list of HTTP route rules. Use this list instead ofpathRules when advanced route matching and routing actions are desired. routeRules are evaluated in order of priority, from the lowest to highest number.  Within a given pathMatcher, you can set only one ofpathRules or routeRules.",
                      },
                    },
                    description:
                      "A matcher for the path portion of the URL. The BackendService from the longest-matched rule will serve the URL. If no rule was matched, the default service is used.",
                    additionalProperties: true,
                  },
                  description:
                    "The list of named PathMatchers to use against the URL.",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the region where the regional URL map resides. This field is not applicable to global URL maps. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                tests: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      description: {
                        type: "string",
                        description: "Description of this test case.",
                      },
                      expectedOutputUrl: {
                        type: "string",
                        description:
                          "The expected output URL evaluated by the load balancer containing the scheme, host, path and query parameters.  For rules that forward requests to backends, the test passes only whenexpectedOutputUrl matches the request forwarded by the load balancer to backends. For rules with urlRewrite, the test verifies that the forwarded request matcheshostRewrite and pathPrefixRewrite in theurlRewrite action. When service is specified,expectedOutputUrl`s scheme is ignored.  For rules with urlRedirect, the test passes only ifexpectedOutputUrl matches the URL in the load balancer's redirect response. If urlRedirect specifieshttps_redirect, the test passes only if the scheme inexpectedOutputUrl is also set to HTTPS. If urlRedirect specifies strip_query, the test passes only if expectedOutputUrl does not contain any query parameters.  expectedOutputUrl is optional whenservice is specified.",
                      },
                      expectedRedirectResponseCode: {
                        type: "integer",
                        description:
                          "For rules with urlRedirect, the test passes only ifexpectedRedirectResponseCode matches the HTTP status code in load balancer's redirect response.  expectedRedirectResponseCode cannot be set whenservice is set.",
                      },
                      headers: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              description: "Header name.",
                            },
                            value: {
                              type: "string",
                              description: "Header value.",
                            },
                          },
                          description: "HTTP headers used in UrlMapTests.",
                          additionalProperties: true,
                        },
                        description:
                          "HTTP headers for this request. If headers contains a host header, then host must also match the header value.",
                      },
                      host: {
                        type: "string",
                        description:
                          "Host portion of the URL. If headers contains a host header, then host must also match the header value.",
                      },
                      path: {
                        type: "string",
                        description: "Path portion of the URL.",
                      },
                      service: {
                        type: "string",
                        description:
                          "Expected BackendService or BackendBucket resource the given URL should be mapped to.  The service field cannot be set if expectedRedirectResponseCode is set.",
                      },
                    },
                    description: "Message for the expected URL mappings.",
                    additionalProperties: true,
                  },
                  description:
                    "The list of expected URL mapping tests. Request to update theUrlMap succeeds only if all test cases pass. You can specify a maximum of 100 tests per UrlMap.  Not supported when the URL map is bound to a target gRPC proxy that has validateForProxyless field set to true.",
                },
              },
              description:
                "Represents a URL Map resource.  Compute Engine has two URL Map resources:  * [Global](/compute/docs/reference/rest/v1/urlMaps) * [Regional](/compute/docs/reference/rest/v1/regionUrlMaps)  A URL map resource is a component of certain types of cloud load balancers and Traffic Director:  * urlMaps are used by global external Application Load Balancers, classic Application Load Balancers, and cross-region internal Application Load Balancers. * regionUrlMaps are used by internal Application Load Balancers, regional external Application Load Balancers and regional internal Application Load Balancers.  For a list of supported URL map features by the load balancer type, see the Load balancing features: Routing and traffic management table.  For a list of supported URL map features for Traffic Director, see the Traffic Director features: Routing and traffic management table.  This resource defines mappings from hostnames and URL paths to either a backend service or a backend bucket.  To use the global urlMaps resource, the backend service must have a loadBalancingScheme of either EXTERNAL,EXTERNAL_MANAGED, or INTERNAL_SELF_MANAGED. To use the regionUrlMaps resource, the backend service must have aloadBalancingScheme of INTERNAL_MANAGED. For more information, read URL Map Concepts.",
              additionalProperties: true,
            },
            description: "A list of UrlMap resources.",
          },
          kind: {
            type: "string",
            description: "Output only. Type of resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          warning: {
            type: "object",
            properties: {
              code: {
                type: "string",
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "Contains a list of UrlMap resources.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
