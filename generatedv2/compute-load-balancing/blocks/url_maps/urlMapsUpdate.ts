import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const urlMapsUpdate: AppBlock = {
  name: "Url Maps - Update",
  description: `Updates the specified UrlMap resource with the data included in the request.`,
  category: "Url Maps",
  inputs: {
    default: {
      config: {
        urlMap: {
          name: "Url Map",
          description: "Name of the UrlMap resource to update.",
          type: {
            type: "string",
            description: "Name of the UrlMap resource to update.",
          },
          required: true,
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
        defaultCustomErrorResponsePolicy: {
          name: "Default Custom Error Response Policy",
          description:
            "defaultCustomErrorResponsePolicy specifies how the Load Balancer returns error responses when BackendServiceorBackendBucket responds with an error.  This policy takes effect at the load balancer level and applies only when no policy has been defined for the error code at lower levels like PathMatcher, RouteRule and PathRule within this UrlMap.  For example, consider a UrlMap with the following configuration:        - defaultCustomErrorResponsePolicy containing policies for      responding to 5xx and 4xx errors      - A PathMatcher configured for *.example.com has      defaultCustomErrorResponsePolicy for 4xx.  If a request for http://www.example.com/ encounters a404, the policy inpathMatcher.defaultCustomErrorResponsePolicy will be enforced. When the request for http://www.example.com/ encounters a502, the policy inUrlMap.defaultCustomErrorResponsePolicy will be enforced. When a request that does not match any host in *.example.com such as http://www.myotherexample.com/, encounters a404, UrlMap.defaultCustomErrorResponsePolicy takes effect.  When used in conjunction withdefaultRouteAction.retryPolicy, retries take precedence. Only once all retries are exhausted, thedefaultCustomErrorResponsePolicy is applied. While attempting a retry, if load balancer is successful in reaching the service, the defaultCustomErrorResponsePolicy is ignored and the response from the service is returned to the client.  defaultCustomErrorResponsePolicy is supported only for global external Application Load Balancers.",
          type: {
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
          required: false,
        },
        defaultRouteAction: {
          name: "Default Route Action",
          description:
            "defaultRouteAction takes effect when none of the hostRules match. The load balancer performs advanced routing actions, such as URL rewrites and header transformations, before forwarding the request to the selected backend.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.    URL maps for classic Application Load Balancers only support the urlRewrite action within defaultRouteAction.   defaultRouteAction has no effect when the URL map is bound to a target gRPC proxy that has the validateForProxyless field set to true.",
          type: {
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
                description: "The retry policy associates with HttpRouteRule",
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
          required: false,
        },
        defaultService: {
          name: "Default Service",
          description:
            "The full or partial URL of the defaultService resource to which traffic is directed if none of the hostRules match. If defaultRouteAction is also specified, advanced routing actions, such as URL rewrites, take effect before sending the request to the backend.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.   defaultService has no effect when the URL map is bound to a target gRPC proxy that has the validateForProxyless field set to true.",
          type: {
            type: "string",
            description:
              "The full or partial URL of the defaultService resource to which traffic is directed if none of the hostRules match. If defaultRouteAction is also specified, advanced routing actions, such as URL rewrites, take effect before sending the request to the backend.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.   defaultService has no effect when the URL map is bound to a target gRPC proxy that has the validateForProxyless field set to true.",
          },
          required: false,
        },
        defaultUrlRedirect: {
          name: "Default Url Redirect",
          description:
            "When none of the specified hostRules match, the request is redirected to a URL specified by defaultUrlRedirect.   Only one of defaultUrlRedirect, defaultService or defaultRouteAction.weightedBackendService can be set.   Not supported when the URL map is bound to a target gRPC proxy.",
          type: {
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
                enum: [
                  "UNDEFINED_REDIRECT_RESPONSE_CODE",
                  "FOUND",
                  "MOVED_PERMANENTLY_DEFAULT",
                  "PERMANENT_REDIRECT",
                  "SEE_OTHER",
                  "TEMPORARY_REDIRECT",
                ],
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
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field is ignored when inserting a UrlMap. An up-to-date fingerprint must be provided in order to update the UrlMap, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a UrlMap.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field is ignored when inserting a UrlMap. An up-to-date fingerprint must be provided in order to update the UrlMap, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a UrlMap.",
          },
          required: false,
        },
        headerAction: {
          name: "Header Action",
          description:
            "Specifies changes to request and response headers that need to take effect for the selected backendService.  The headerAction specified here take effect afterheaderAction specified under pathMatcher.  headerAction is not supported for load balancers that have their loadBalancingScheme set to EXTERNAL.  Not supported when the URL map is bound to a target gRPC proxy that has validateForProxyless field set to true.",
          type: {
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
          required: false,
        },
        hostRules: {
          name: "Host Rules",
          description: "The list of host rules to use against the URL.",
          type: {
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
          required: false,
        },
        id: {
          name: "Id",
          description:
            "[Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Always compute#urlMaps for url maps.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#urlMaps for url maps.",
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
        pathMatchers: {
          name: "Path Matchers",
          description: "The list of named PathMatchers to use against the URL.",
          type: {
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
                      enum: [
                        "UNDEFINED_REDIRECT_RESPONSE_CODE",
                        "FOUND",
                        "MOVED_PERMANENTLY_DEFAULT",
                        "PERMANENT_REDIRECT",
                        "SEE_OTHER",
                        "TEMPORARY_REDIRECT",
                      ],
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
                            enum: [
                              "UNDEFINED_REDIRECT_RESPONSE_CODE",
                              "FOUND",
                              "MOVED_PERMANENTLY_DEFAULT",
                              "PERMANENT_REDIRECT",
                              "SEE_OTHER",
                              "TEMPORARY_REDIRECT",
                            ],
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
                                        description: "64-bit integer as string",
                                      },
                                      rangeStart: {
                                        type: "string",
                                        description: "64-bit integer as string",
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
                                    enum: [
                                      "UNDEFINED_FILTER_MATCH_CRITERIA",
                                      "MATCH_ALL",
                                      "MATCH_ANY",
                                      "NOT_SET",
                                    ],
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
                            enum: [
                              "UNDEFINED_REDIRECT_RESPONSE_CODE",
                              "FOUND",
                              "MOVED_PERMANENTLY_DEFAULT",
                              "PERMANENT_REDIRECT",
                              "SEE_OTHER",
                              "TEMPORARY_REDIRECT",
                            ],
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
          required: false,
        },
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] URL of the region where the regional URL map resides. This field is not applicable to global URL maps. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the regional URL map resides. This field is not applicable to global URL maps. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
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
        tests: {
          name: "Tests",
          description:
            "The list of expected URL mapping tests. Request to update theUrlMap succeeds only if all test cases pass. You can specify a maximum of 100 tests per UrlMap.  Not supported when the URL map is bound to a target gRPC proxy that has validateForProxyless field set to true.",
          type: {
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
        if (input.event.inputConfig.urlMap !== undefined)
          pathParams["url_map"] = String(input.event.inputConfig.urlMap);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (
          input.event.inputConfig.defaultCustomErrorResponsePolicy !== undefined
        )
          body.defaultCustomErrorResponsePolicy =
            input.event.inputConfig.defaultCustomErrorResponsePolicy;
        if (input.event.inputConfig.defaultRouteAction !== undefined)
          body.defaultRouteAction = input.event.inputConfig.defaultRouteAction;
        if (input.event.inputConfig.defaultService !== undefined)
          body.defaultService = input.event.inputConfig.defaultService;
        if (input.event.inputConfig.defaultUrlRedirect !== undefined)
          body.defaultUrlRedirect = input.event.inputConfig.defaultUrlRedirect;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.headerAction !== undefined)
          body.headerAction = input.event.inputConfig.headerAction;
        if (input.event.inputConfig.hostRules !== undefined)
          body.hostRules = input.event.inputConfig.hostRules;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.pathMatchers !== undefined)
          body.pathMatchers = input.event.inputConfig.pathMatchers;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.tests !== undefined)
          body.tests = input.event.inputConfig.tests;

        const result = await computeFetch({
          config: input.app.config,
          method: "PUT",
          pathTemplate:
            "/compute/v1/projects/{project}/global/urlMaps/{url_map}",
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

export default urlMapsUpdate;
