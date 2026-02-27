import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionUrlMapsInsert: AppBlock = {
  name: "Region URL Maps - Insert",
  description: `Creates a UrlMap resource in the specified project using the data included in the request.`,
  category: "Region URL Maps",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description:
            "[Output Only] URL of the region where the regional URL map resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional URL map resides.\nThis field is not applicable to global URL maps.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          required: false,
        },
        requestId: {
          name: "Request ID",
          description:
            "begin_interface: MixerMutationRequestBuilder\nRequest ID to support idempotency.",
          type: {
            type: "string",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description: "Fingerprint of this resource.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field is ignored when\ninserting a UrlMap. An up-to-date fingerprint must be provided\nin order to update the UrlMap, otherwise the request will\nfail with error 412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a UrlMap. (Format: byte)",
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
                hosts: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The list of host patterns to match. They must be valid hostnames with\noptional port numbers in the format host:port.* matches any string of ([a-z0-9-.]*). In\nthat case, * must be the first character, and if followed by\nanything, the immediate following character must be either -\nor ..\n\n* based matching is not supported when the URL map is bound\nto a target gRPC proxy that has the validateForProxyless field\nset to true.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                pathMatcher: {
                  type: "string",
                  description:
                    "The name of the PathMatcher to use to match the path portion\nof the URL if the hostRule matches the URL's host portion.",
                },
              },
              description:
                "UrlMaps\nA host-matching rule for a URL. If matched, will use the namedPathMatcher to select the BackendService.",
              additionalProperties: true,
            },
            description: "The list of host rules to use against the URL.",
          },
          required: false,
        },
        headerAction: {
          name: "Header Action",
          description:
            "Specifies changes to request and response headers that need to take effect for the selected backendService.",
          type: {
            type: "object",
            properties: {
              requestHeadersToAdd: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    replace: {
                      type: "boolean",
                      description:
                        "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                    },
                    headerValue: {
                      type: "string",
                      description: "The value of the header to add.",
                    },
                    headerName: {
                      type: "string",
                      description: "The name of the header.",
                    },
                  },
                  description:
                    "Specification determining how headers are added to requests or responses.",
                  additionalProperties: true,
                },
                description:
                  "Headers to add to a matching request before forwarding the request to thebackendService.",
              },
              responseHeadersToRemove: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "A list of header names for headers that need to be removed from the\nresponse before sending the response back to the client.",
              },
              requestHeadersToRemove: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "A list of header names for headers that need to be removed from the\nrequest before forwarding the request to the backendService.",
              },
              responseHeadersToAdd: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    replace: {
                      type: "boolean",
                      description:
                        "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                    },
                    headerValue: {
                      type: "string",
                      description: "The value of the header to add.",
                    },
                    headerName: {
                      type: "string",
                      description: "The name of the header.",
                    },
                  },
                  description:
                    "Specification determining how headers are added to requests or responses.",
                  additionalProperties: true,
                },
                description:
                  "Headers to add the response before sending the response back to the\nclient.",
              },
            },
            description:
              "The request and response header transformations that take effect before\nthe request is passed along to the selected backendService.",
            additionalProperties: true,
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "[Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          required: false,
        },
        defaultCustomErrorResponsePolicy: {
          name: "Default Custom Error Response Policy",
          description:
            "defaultCustomErrorResponsePolicy specifies how the Load Balancer returns error responses when BackendServiceorBackendBucket responds with an error.",
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
                        "Valid values include:\n   \n   \n     - A number between 400 and 599: For example\n     401 or 503, in which case the load balancer\n     applies the policy if the error code exactly matches this value.\n     - 5xx: Load Balancer will apply the policy if the\n     backend service responds with any response code in the range of\n     500 to 599. \n   - 4xx: Load\n     Balancer will apply the policy if the backend service responds with any\n     response code in the range of 400 to\n     499.\n\nValues must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                    },
                    path: {
                      type: "string",
                      description:
                        "The full path to a file within backendBucket . For example:/errors/defaultError.html \n\npath must start\nwith a leading slash. path cannot have trailing slashes.\n\nIf the file is not available in backendBucket  or the\nload balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client. \n\nThe value must\nbe from 1 to 1024 characters",
                    },
                    overrideResponseCode: {
                      type: "integer",
                      description:
                        "The HTTP status code returned with the response containing the custom\nerror content. If overrideResponseCode is not supplied, the\nsame response code returned by the original backend bucket or backend\nservice is returned to the client. (Format: int32)",
                    },
                  },
                  description:
                    "Specifies the mapping between the response code that will be returned along\nwith the custom error content and the response code returned by the backend\nservice.",
                  additionalProperties: true,
                },
                description:
                  "Specifies rules for returning error responses.\n\nIn a given policy, if you specify rules for both a range of error codes\nas well as rules for specific error codes then rules with specific error\ncodes have a higher priority. For example, assume that you configure a rule\nfor 401 (Un-authorized) code, and another for all 4 series\nerror codes (4XX). If the backend service returns a401, then the rule for 401 will be applied.\nHowever if the backend service returns a 403, the rule for4xx takes effect.",
              },
              errorService: {
                type: "string",
                description:
                  "The full or partial URL to the BackendBucket resource that\ncontains the custom error content. Examples are:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - global/backendBuckets/myBackendBucket\n\nIf errorService is not specified at lower levels likepathMatcher, pathRule and routeRule,\nan errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService. \n\nIf load balancer cannot reach\nthe backendBucket, a simple Not Found Error will\nbe returned, with the original response code (oroverrideResponseCode if configured).\n\nerrorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
              },
            },
            description:
              "Specifies the custom error response policy that must be applied when the\nbackend service or backend bucket responds with an error.",
            additionalProperties: true,
          },
          required: false,
        },
        defaultService: {
          name: "Default Service",
          description:
            "The full or partial URL of the defaultService resource to which traffic is directed if none of the hostRules match.",
          type: {
            type: "string",
            description:
              "The full or partial URL of the defaultService resource to\nwhich traffic is directed if none of the hostRules match.\nIf defaultRouteAction is also specified, advanced\nrouting actions, such as URL rewrites, take effect before sending the\nrequest to the backend.\n\n\nOnly one of defaultUrlRedirect, defaultService\nor defaultRouteAction.weightedBackendService can be set.\n\n\ndefaultService has no effect when the URL map is bound\nto a target gRPC proxy that has the validateForProxyless field\nset to true.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
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
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#urlMaps for\nurl maps.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description: "[Output Only] The unique identifier for the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
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
                              "Valid values include:\n   \n   \n     - A number between 400 and 599: For example\n     401 or 503, in which case the load balancer\n     applies the policy if the error code exactly matches this value.\n     - 5xx: Load Balancer will apply the policy if the\n     backend service responds with any response code in the range of\n     500 to 599. \n   - 4xx: Load\n     Balancer will apply the policy if the backend service responds with any\n     response code in the range of 400 to\n     499.\n\nValues must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                          },
                          path: {
                            type: "string",
                            description:
                              "The full path to a file within backendBucket . For example:/errors/defaultError.html \n\npath must start\nwith a leading slash. path cannot have trailing slashes.\n\nIf the file is not available in backendBucket  or the\nload balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client. \n\nThe value must\nbe from 1 to 1024 characters",
                          },
                          overrideResponseCode: {
                            type: "integer",
                            description:
                              "The HTTP status code returned with the response containing the custom\nerror content. If overrideResponseCode is not supplied, the\nsame response code returned by the original backend bucket or backend\nservice is returned to the client. (Format: int32)",
                          },
                        },
                        description:
                          "Specifies the mapping between the response code that will be returned along\nwith the custom error content and the response code returned by the backend\nservice.",
                        additionalProperties: true,
                      },
                      description:
                        "Specifies rules for returning error responses.\n\nIn a given policy, if you specify rules for both a range of error codes\nas well as rules for specific error codes then rules with specific error\ncodes have a higher priority. For example, assume that you configure a rule\nfor 401 (Un-authorized) code, and another for all 4 series\nerror codes (4XX). If the backend service returns a401, then the rule for 401 will be applied.\nHowever if the backend service returns a 403, the rule for4xx takes effect.",
                    },
                    errorService: {
                      type: "string",
                      description:
                        "The full or partial URL to the BackendBucket resource that\ncontains the custom error content. Examples are:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - global/backendBuckets/myBackendBucket\n\nIf errorService is not specified at lower levels likepathMatcher, pathRule and routeRule,\nan errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService. \n\nIf load balancer cannot reach\nthe backendBucket, a simple Not Found Error will\nbe returned, with the original response code (oroverrideResponseCode if configured).\n\nerrorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
                    },
                  },
                  description:
                    "Specifies the custom error response policy that must be applied when the\nbackend service or backend bucket responds with an error.",
                  additionalProperties: true,
                },
                name: {
                  type: "string",
                  description:
                    "The name to which this PathMatcher is referred by theHostRule.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                defaultUrlRedirect: {
                  type: "object",
                  properties: {
                    stripQuery: {
                      type: "boolean",
                      description:
                        "If set to true, any accompanying query portion of the original\nURL is\nremoved before redirecting the request. If set to false, the\nquery portion of the original URL is retained.\n\nThe default is set to false.",
                    },
                    pathRedirect: {
                      type: "string",
                      description:
                        "The path that is used in the redirect response instead of the one\nthat was supplied in the request.\n\npathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
                    },
                    redirectResponseCode: {
                      type: "string",
                      enum: [
                        "FOUND",
                        "MOVED_PERMANENTLY_DEFAULT",
                        "PERMANENT_REDIRECT",
                        "SEE_OTHER",
                        "TEMPORARY_REDIRECT",
                      ],
                      description:
                        "The HTTP Status code to use for this RedirectAction.\n\nSupported values are:\n   \n   - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds\n   to 301.\n   - FOUND, which corresponds to 302.\n   - SEE_OTHER which corresponds to 303.\n   - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request\n   method is retained.\n   - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request\n   method is retained.",
                    },
                    hostRedirect: {
                      type: "string",
                      description:
                        "The host that is used in the redirect response instead of the one that\nwas supplied in the request.\n\nThe value must be from 1 to 255\ncharacters.",
                    },
                    prefixRedirect: {
                      type: "string",
                      description:
                        "The prefix that replaces the prefixMatch specified in\nthe HttpRouteRuleMatch, retaining the remaining portion\nof the URL before redirecting the request.\n\nprefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
                    },
                    httpsRedirect: {
                      type: "boolean",
                      description:
                        "If set to true, the URL scheme in the redirected request is\nset to HTTPS.\nIf set to false, the URL scheme of the redirected request\nremains the same as that of the request.\n\nThis must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.\n\nThe default is set to false.",
                    },
                  },
                  description: "Specifies settings for an HTTP redirect.",
                  additionalProperties: true,
                },
                defaultRouteAction: {
                  type: "object",
                  properties: {
                    retryPolicy: {
                      type: "object",
                      properties: {
                        perTryTimeout: {
                          type: "object",
                          properties: {
                            nanos: {
                              type: "integer",
                              description:
                                "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                            },
                            seconds: {
                              type: "string",
                              description:
                                "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                            },
                          },
                          description:
                            'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                          additionalProperties: true,
                        },
                        numRetries: {
                          type: "integer",
                          description:
                            "Specifies the allowed number retries. This number must be > 0.\nIf not specified, defaults to 1. (Format: uint32)",
                        },
                        retryConditions: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies one or more conditions when this retry policy applies. Valid\nvalues are:\n   \n   - 5xx: retry is attempted if the instance or endpoint\n   responds with any 5xx response code, or if the instance or\n   endpoint does not respond at all. For example, disconnects, reset, read\n   timeout, connection failure, and refused streams.\n   - gateway-error: Similar to 5xx, but only\n   applies to response codes 502, 503 or504.\n   - connect-failure: a retry is attempted on failures\n   connecting to the instance or endpoint. For example, connection\n   timeouts.\n   - retriable-4xx: a retry is attempted if the instance\n   or endpoint responds with a 4xx response code.\n   The only error that you can retry is error code 409.\n   - refused-stream: a retry is attempted if the instance\n   or endpoint resets the stream with a REFUSED_STREAM error\n   code. This reset type indicates that it is safe to retry.\n   - cancelled: a retry is attempted if the gRPC status\n   code in the response header is set to cancelled.\n   - deadline-exceeded: a retry is attempted if the gRPC\n   status code in the response header is set todeadline-exceeded.\n   - internal: a retry is attempted if the gRPC\n   status code in the response header is set tointernal.\n   - resource-exhausted: a retry is attempted if the gRPC\n   status code in the response header is set toresource-exhausted.\n   - unavailable: a retry is attempted if the gRPC\n   status code in the response header is set tounavailable.\n\nOnly the following codes are supported when the URL map is bound to\ntarget gRPC proxy that has validateForProxyless field set to true.\n   \n   - cancelled\n   - deadline-exceeded\n   - internal\n   - resource-exhausted\n   - unavailable",
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
                            "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                        },
                        seconds: {
                          type: "string",
                          description:
                            "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                        },
                      },
                      description:
                        'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                      additionalProperties: true,
                    },
                    urlRewrite: {
                      type: "object",
                      properties: {
                        pathTemplateRewrite: {
                          type: "string",
                          description:
                            "If specified, the pattern rewrites the URL path (based on the :path\nheader) using the HTTP template syntax. \n\nA corresponding\npath_template_match must be specified. Any template variables must exist in\nthe path_template_match field. \n   \n   \n      - -At least one variable must be specified in the path_template_match\n      field \n   - You can omit variables from the rewritten URL\n      - The * and ** operators cannot be matched\n      unless they have a corresponding variable name - e.g.\n      {format=*} or {var=**}.\n\nFor example, a path_template_match of /static/{format=**}\ncould be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a\nrewrite, so that /{country}/{format}/{suffix=**} can be\nrewritten as /content/{format}/{country}/{suffix}. \n\nAt least\none non-empty routeRules[].matchRules[].path_template_match is\nrequired. \n\nOnly one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                        },
                        hostRewrite: {
                          type: "string",
                          description:
                            "Before forwarding the request to the selected service, the request's\nhost header is replaced with contents of hostRewrite.\n\nThe value must be from 1 to 255 characters.",
                        },
                        pathPrefixRewrite: {
                          type: "string",
                          description:
                            "Before forwarding the request to the selected backend service, the\nmatching portion of the request's path is replaced bypathPrefixRewrite.\n\nThe value must be from 1 to 1024 characters.",
                        },
                      },
                      description:
                        "The spec for modifying the path before sending the request to the matched\nbackend service.",
                      additionalProperties: true,
                    },
                    requestMirrorPolicy: {
                      type: "object",
                      properties: {
                        backendService: {
                          type: "string",
                          description:
                            "The full or partial URL to the BackendService resource being\nmirrored to.\n\nThe backend service configured for a mirroring\npolicy must reference backends that are of the same type as the original\nbackend service matched in the URL map.\n\nServerless NEG backends are not currently supported as a mirrored\nbackend service.",
                        },
                        mirrorPercent: {
                          type: "number",
                          description:
                            "The percentage of requests to be mirrored to `backend_service`. (Format: double)",
                        },
                      },
                      description:
                        "A policy that specifies how requests intended for the route's backends\nare shadowed to a separate mirrored backend service. The load balancer\ndoesn't wait for responses from the shadow service. Before sending traffic\nto the shadow service, the host or authority header is suffixed with-shadow.",
                      additionalProperties: true,
                    },
                    maxStreamDuration: {
                      type: "object",
                      properties: {
                        nanos: {
                          type: "integer",
                          description:
                            "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                        },
                        seconds: {
                          type: "string",
                          description:
                            "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                        },
                      },
                      description:
                        'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                      additionalProperties: true,
                    },
                    corsPolicy: {
                      type: "object",
                      properties: {
                        allowHeaders: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the content for the Access-Control-Allow-Headers\nheader.",
                        },
                        disabled: {
                          type: "boolean",
                          description:
                            "If true, disables the CORS policy.\nThe default value is false, which indicates that the CORS\npolicy is in effect.",
                        },
                        allowCredentials: {
                          type: "boolean",
                          description:
                            "In response to a preflight request, setting this to true\nindicates that\nthe actual request can include user credentials. This field translates to\nthe Access-Control-Allow-Credentials header.\n\nDefault is false.",
                        },
                        allowOrigins: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the list of origins that is allowed to do CORS requests.\n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                        },
                        maxAge: {
                          type: "integer",
                          description:
                            "Specifies how long results of a preflight request can be cached in\nseconds. This field translates to the Access-Control-Max-Age\nheader. (Format: int32)",
                        },
                        allowOriginRegexes: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies a regular expression that matches allowed origins. For\nmore information, see regular expression syntax. \n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.\n\nRegular expressions can only be used when the loadBalancingScheme is\nset to INTERNAL_SELF_MANAGED.",
                        },
                        allowMethods: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the content for the Access-Control-Allow-Methods\nheader.",
                        },
                        exposeHeaders: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Specifies the content for the Access-Control-Expose-Headers\nheader.",
                        },
                      },
                      description:
                        "The specification for allowing client-side cross-origin requests. For more\ninformation about the W3C recommendation for cross-origin resource sharing\n(CORS), see Fetch API Living\nStandard.",
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
                                "The HTTP status code used to abort the request.\n\nThe value must be from 200 to 599 inclusive.\n\nFor gRPC protocol, the gRPC status code is mapped to HTTP status code\naccording to this \nmapping table. HTTP status 200 is mapped to gRPC status\nUNKNOWN. Injecting an OK status is currently not supported by\nTraffic Director. (Format: uint32)",
                            },
                            percentage: {
                              type: "number",
                              description:
                                "The percentage of traffic for connections, operations, or requests\nthat is aborted as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                            },
                          },
                          description:
                            "Specification for how requests are aborted as part of fault injection.",
                          additionalProperties: true,
                        },
                        delay: {
                          type: "object",
                          properties: {
                            percentage: {
                              type: "number",
                              description:
                                "The percentage of traffic for connections, operations, or requests for\nwhich a delay is introduced as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                            },
                            fixedDelay: {
                              type: "object",
                              properties: {
                                nanos: {
                                  type: "integer",
                                  description:
                                    "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                                },
                                seconds: {
                                  type: "string",
                                  description:
                                    "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                                },
                              },
                              description:
                                'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                              additionalProperties: true,
                            },
                          },
                          description:
                            "Specifies the delay introduced by the load balancer before forwarding the\nrequest to the backend service as part of fault injection.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "The specification for fault injection introduced into traffic to test\nthe resiliency of clients to backend service failure. As part of fault\ninjection, when clients send requests to a backend service, delays can be\nintroduced by the load balancer on a percentage of requests before sending\nthose request to the backend service. Similarly requests from clients can be\naborted by the load balancer for a percentage of requests.",
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
                              "The full or partial URL to the default BackendService\nresource. Before\nforwarding the request to backendService, the load balancer\napplies any relevant headerActions specified as part of thisbackendServiceWeight.",
                          },
                          headerAction: {
                            type: "object",
                            properties: {
                              requestHeadersToAdd: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    replace: {
                                      type: "boolean",
                                      description:
                                        "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                    },
                                    headerValue: {
                                      type: "string",
                                      description:
                                        "The value of the header to add.",
                                    },
                                    headerName: {
                                      type: "string",
                                      description: "The name of the header.",
                                    },
                                  },
                                  description:
                                    "Specification determining how headers are added to requests or responses.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Headers to add to a matching request before forwarding the request to thebackendService.",
                              },
                              responseHeadersToRemove: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "A list of header names for headers that need to be removed from the\nresponse before sending the response back to the client.",
                              },
                              requestHeadersToRemove: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "A list of header names for headers that need to be removed from the\nrequest before forwarding the request to the backendService.",
                              },
                              responseHeadersToAdd: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    replace: {
                                      type: "boolean",
                                      description:
                                        "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                    },
                                    headerValue: {
                                      type: "string",
                                      description:
                                        "The value of the header to add.",
                                    },
                                    headerName: {
                                      type: "string",
                                      description: "The name of the header.",
                                    },
                                  },
                                  description:
                                    "Specification determining how headers are added to requests or responses.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Headers to add the response before sending the response back to the\nclient.",
                              },
                            },
                            description:
                              "The request and response header transformations that take effect before\nthe request is passed along to the selected backendService.",
                            additionalProperties: true,
                          },
                          weight: {
                            type: "integer",
                            description:
                              "Specifies the fraction of traffic sent to a backend service,\ncomputed asweight / (sum of all weightedBackendService weights in routeAction).\n\nThe selection of a backend service is determined only for new traffic.\nOnce a user's request has been directed to a backend service,\nsubsequent requests are sent to the same backend service as\ndetermined by the backend service's session affinity policy.\nDon't configure session affinity if you're using weighted traffic\nsplitting. If you do, the weighted traffic splitting configuration takes\nprecedence.\n\nThe value must be from 0 to 1000. (Format: uint32)",
                          },
                        },
                        description:
                          "In contrast to a single BackendService in \nHttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across\nmultiple backend services. The volume of traffic for each\nbackend service is proportional to the weight specified\nin each WeightedBackendService",
                        additionalProperties: true,
                      },
                      description:
                        "A list of weighted backend services to send traffic to when a route match\noccurs. The weights determine the fraction of traffic that flows to\ntheir corresponding backend service. If all traffic needs to\ngo to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.\n\nAfter a backend service is identified and before forwarding\nthe request to\nthe backend service, advanced routing actions such as URL rewrites and\nheader transformations are applied depending on additional settings\nspecified in this HttpRouteAction.",
                    },
                  },
                  additionalProperties: true,
                },
                routeRules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      service: {
                        type: "string",
                        description:
                          "The full or partial URL of the backend service resource to which traffic\nis directed if this rule is matched. If routeAction is\nalso specified, advanced routing actions, such as URL rewrites,\ntake effect before sending the request to the backend.\n\n\nOnly one of urlRedirect, service orrouteAction.weightedBackendService can be set.",
                      },
                      headerAction: {
                        type: "object",
                        properties: {
                          requestHeadersToAdd: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                replace: {
                                  type: "boolean",
                                  description:
                                    "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                },
                                headerValue: {
                                  type: "string",
                                  description:
                                    "The value of the header to add.",
                                },
                                headerName: {
                                  type: "string",
                                  description: "The name of the header.",
                                },
                              },
                              description:
                                "Specification determining how headers are added to requests or responses.",
                              additionalProperties: true,
                            },
                            description:
                              "Headers to add to a matching request before forwarding the request to thebackendService.",
                          },
                          responseHeadersToRemove: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of header names for headers that need to be removed from the\nresponse before sending the response back to the client.",
                          },
                          requestHeadersToRemove: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "A list of header names for headers that need to be removed from the\nrequest before forwarding the request to the backendService.",
                          },
                          responseHeadersToAdd: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                replace: {
                                  type: "boolean",
                                  description:
                                    "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                },
                                headerValue: {
                                  type: "string",
                                  description:
                                    "The value of the header to add.",
                                },
                                headerName: {
                                  type: "string",
                                  description: "The name of the header.",
                                },
                              },
                              description:
                                "Specification determining how headers are added to requests or responses.",
                              additionalProperties: true,
                            },
                            description:
                              "Headers to add the response before sending the response back to the\nclient.",
                          },
                        },
                        description:
                          "The request and response header transformations that take effect before\nthe request is passed along to the selected backendService.",
                        additionalProperties: true,
                      },
                      urlRedirect: {
                        type: "object",
                        properties: {
                          stripQuery: {
                            type: "boolean",
                            description:
                              "If set to true, any accompanying query portion of the original\nURL is\nremoved before redirecting the request. If set to false, the\nquery portion of the original URL is retained.\n\nThe default is set to false.",
                          },
                          pathRedirect: {
                            type: "string",
                            description:
                              "The path that is used in the redirect response instead of the one\nthat was supplied in the request.\n\npathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
                          },
                          redirectResponseCode: {
                            type: "string",
                            enum: [
                              "FOUND",
                              "MOVED_PERMANENTLY_DEFAULT",
                              "PERMANENT_REDIRECT",
                              "SEE_OTHER",
                              "TEMPORARY_REDIRECT",
                            ],
                            description:
                              "The HTTP Status code to use for this RedirectAction.\n\nSupported values are:\n   \n   - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds\n   to 301.\n   - FOUND, which corresponds to 302.\n   - SEE_OTHER which corresponds to 303.\n   - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request\n   method is retained.\n   - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request\n   method is retained.",
                          },
                          hostRedirect: {
                            type: "string",
                            description:
                              "The host that is used in the redirect response instead of the one that\nwas supplied in the request.\n\nThe value must be from 1 to 255\ncharacters.",
                          },
                          prefixRedirect: {
                            type: "string",
                            description:
                              "The prefix that replaces the prefixMatch specified in\nthe HttpRouteRuleMatch, retaining the remaining portion\nof the URL before redirecting the request.\n\nprefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
                          },
                          httpsRedirect: {
                            type: "boolean",
                            description:
                              "If set to true, the URL scheme in the redirected request is\nset to HTTPS.\nIf set to false, the URL scheme of the redirected request\nremains the same as that of the request.\n\nThis must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.\n\nThe default is set to false.",
                          },
                        },
                        description: "Specifies settings for an HTTP redirect.",
                        additionalProperties: true,
                      },
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
                                    "Valid values include:\n   \n   \n     - A number between 400 and 599: For example\n     401 or 503, in which case the load balancer\n     applies the policy if the error code exactly matches this value.\n     - 5xx: Load Balancer will apply the policy if the\n     backend service responds with any response code in the range of\n     500 to 599. \n   - 4xx: Load\n     Balancer will apply the policy if the backend service responds with any\n     response code in the range of 400 to\n     499.\n\nValues must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                                },
                                path: {
                                  type: "string",
                                  description:
                                    "The full path to a file within backendBucket . For example:/errors/defaultError.html \n\npath must start\nwith a leading slash. path cannot have trailing slashes.\n\nIf the file is not available in backendBucket  or the\nload balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client. \n\nThe value must\nbe from 1 to 1024 characters",
                                },
                                overrideResponseCode: {
                                  type: "integer",
                                  description:
                                    "The HTTP status code returned with the response containing the custom\nerror content. If overrideResponseCode is not supplied, the\nsame response code returned by the original backend bucket or backend\nservice is returned to the client. (Format: int32)",
                                },
                              },
                              description:
                                "Specifies the mapping between the response code that will be returned along\nwith the custom error content and the response code returned by the backend\nservice.",
                              additionalProperties: true,
                            },
                            description:
                              "Specifies rules for returning error responses.\n\nIn a given policy, if you specify rules for both a range of error codes\nas well as rules for specific error codes then rules with specific error\ncodes have a higher priority. For example, assume that you configure a rule\nfor 401 (Un-authorized) code, and another for all 4 series\nerror codes (4XX). If the backend service returns a401, then the rule for 401 will be applied.\nHowever if the backend service returns a 403, the rule for4xx takes effect.",
                          },
                          errorService: {
                            type: "string",
                            description:
                              "The full or partial URL to the BackendBucket resource that\ncontains the custom error content. Examples are:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - global/backendBuckets/myBackendBucket\n\nIf errorService is not specified at lower levels likepathMatcher, pathRule and routeRule,\nan errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService. \n\nIf load balancer cannot reach\nthe backendBucket, a simple Not Found Error will\nbe returned, with the original response code (oroverrideResponseCode if configured).\n\nerrorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
                          },
                        },
                        description:
                          "Specifies the custom error response policy that must be applied when the\nbackend service or backend bucket responds with an error.",
                        additionalProperties: true,
                      },
                      matchRules: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            pathTemplateMatch: {
                              type: "string",
                              description:
                                'If specified, the route is a pattern match expression that must match the\n:path header once the query string is removed.\n\n A pattern match allows you to match\n   \n   \n      - The value must be between 1 and 1024 characters\n      - The pattern must start with a leading slash ("/")\n      - There may be no more than 5 operators in pattern\n\n Precisely one ofprefix_match, full_path_match,regex_match or path_template_match must be set.',
                            },
                            ignoreCase: {
                              type: "boolean",
                              description:
                                "Specifies that prefixMatch and fullPathMatch\nmatches are case sensitive.\n\nThe default value is false.\n\nignoreCase must not be used with regexMatch.\n\nNot supported when the URL map is bound to a target gRPC proxy.",
                            },
                            prefixMatch: {
                              type: "string",
                              description:
                                "For satisfying the matchRule condition, the request's\npath must begin with the specified prefixMatch.prefixMatch must begin with a /.\n\nThe value must be from 1 to 1024 characters.\n\nOnly one of prefixMatch, fullPathMatch,regexMatch or path_template_match must be\nspecified.\nspecified.",
                            },
                            headerMatches: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  exactMatch: {
                                    type: "string",
                                    description:
                                      "The value should exactly match contents of exactMatch.\n\nOnly one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                  },
                                  invertMatch: {
                                    type: "boolean",
                                    description:
                                      "If set to false, the headerMatch is considered a\nmatch if the preceding match criteria are met. If set to true,\nthe headerMatch is considered a match if the preceding\nmatch criteria are NOT met.\n\nThe default setting is false.",
                                  },
                                  regexMatch: {
                                    type: "string",
                                    description:
                                      "The value of the header must match the regular expression specified inregexMatch.\nFor more information about regular expression syntax, see Syntax.\n\nFor matching against a port specified in the HTTP request, use a\nheaderMatch with headerName set to PORT and a regular expression that\nsatisfies the RFC2616 Host header's port specifier.\n\nOnly one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.\n\nRegular expressions can only be used when the loadBalancingScheme is\nset to INTERNAL_SELF_MANAGED, EXTERNAL_MANAGED orINTERNAL_MANAGED.",
                                  },
                                  prefixMatch: {
                                    type: "string",
                                    description:
                                      "The value of the header must start with the contents ofprefixMatch.\n\nOnly one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                  },
                                  suffixMatch: {
                                    type: "string",
                                    description:
                                      "The value of the header must end with the contents ofsuffixMatch.\n\nOnly one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                  },
                                  headerName: {
                                    type: "string",
                                    description:
                                      'The name of the HTTP header to match.\n\nFor matching against the HTTP request\'s authority, use a headerMatch\nwith the header name ":authority".\n\nFor matching a request\'s method, use the headerName ":method".\n\nWhen the URL map is bound to a target gRPC proxy that has\nthe validateForProxyless field set to true, only\nnon-binary\nuser-specified custom metadata and the `content-type` header are supported.\nThe following transport-level headers cannot be used in header matching\nrules:\n`:authority`, `:method`, `:path`, `:scheme`, `user-agent`,\n`accept-encoding`, `content-encoding`, `grpc-accept-encoding`,\n`grpc-encoding`, `grpc-previous-rpc-attempts`, `grpc-tags-bin`,\n`grpc-timeout` and `grpc-trace-bin`.',
                                  },
                                  presentMatch: {
                                    type: "boolean",
                                    description:
                                      "A header with the contents of headerName must exist. The\nmatch takes place whether or not the request's header has a value.\n\nOnly one of exactMatch, prefixMatch,suffixMatch, regexMatch,presentMatch or rangeMatch must be set.",
                                  },
                                  rangeMatch: {
                                    type: "object",
                                    properties: {
                                      rangeEnd: {
                                        type: "string",
                                        description:
                                          "The end of the range (exclusive) in signed long integer format. (Format: int64)",
                                      },
                                      rangeStart: {
                                        type: "string",
                                        description:
                                          "The start of the range (inclusive) in signed long integer format. (Format: int64)",
                                      },
                                    },
                                    description:
                                      "HttpRouteRuleMatch criteria for field values that must stay\nwithin the specified integer range.",
                                    additionalProperties: true,
                                  },
                                },
                                description:
                                  "matchRule criteria for request header matches.",
                                additionalProperties: true,
                              },
                              description:
                                "Specifies a list of header match criteria, all of which must match\ncorresponding headers in the request.",
                            },
                            regexMatch: {
                              type: "string",
                              description:
                                "For satisfying the matchRule condition, the path of the\nrequest must satisfy the regular expression specified inregexMatch after removing any query parameters and anchor\nsupplied with the original URL. For\nmore information about regular expression syntax, see Syntax.\n\nOnly one of prefixMatch, fullPathMatch,regexMatch or path_template_match must be\nspecified.\n\nRegular expressions can only be used when the loadBalancingScheme is\nset to INTERNAL_SELF_MANAGED, EXTERNAL_MANAGED orINTERNAL_MANAGED.",
                            },
                            queryParameterMatches: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  regexMatch: {
                                    type: "string",
                                    description:
                                      "The queryParameterMatch matches if the value of the\nparameter matches the regular expression specified byregexMatch. For\nmore information about regular expression syntax, see Syntax.\n\nOnly one of presentMatch, exactMatch, orregexMatch must be set.\n\nRegular expressions can only be used when the loadBalancingScheme is\nset to INTERNAL_SELF_MANAGED, EXTERNAL_MANAGED orINTERNAL_MANAGED.",
                                  },
                                  exactMatch: {
                                    type: "string",
                                    description:
                                      "The queryParameterMatch matches if the value of the\nparameter exactly matches the contents of exactMatch.\n\nOnly one of presentMatch, exactMatch, orregexMatch must be set.",
                                  },
                                  presentMatch: {
                                    type: "boolean",
                                    description:
                                      "Specifies that the queryParameterMatch matches if the\nrequest contains the query parameter, irrespective of whether the\nparameter has a value or not.\n\nOnly one of presentMatch, exactMatch, orregexMatch must be set.",
                                  },
                                  name: {
                                    type: "string",
                                    description:
                                      "The name of the query parameter to match. The query parameter must exist in\nthe request, in the absence of which the request match fails.",
                                  },
                                },
                                description:
                                  "HttpRouteRuleMatch criteria for a request's query parameter.",
                                additionalProperties: true,
                              },
                              description:
                                "Specifies a list of query parameter match criteria, all of which must\nmatch corresponding query parameters in the request.\n\nNot supported when the URL map is bound to a target gRPC proxy.",
                            },
                            fullPathMatch: {
                              type: "string",
                              description:
                                "For satisfying the matchRule condition, the path of the\nrequest must exactly match the value specified infullPathMatch after removing any query parameters and anchor\nthat may be part of the original URL.\n\nfullPathMatch must be from 1 to 1024 characters.\n\nOnly one of prefixMatch, fullPathMatch,regexMatch or path_template_match must be\nspecified.",
                            },
                            metadataFilters: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  filterMatchCriteria: {
                                    type: "string",
                                    enum: ["MATCH_ALL", "MATCH_ANY", "NOT_SET"],
                                    description:
                                      "Specifies how individual filter label matches\nwithin the list of filterLabels and contributes toward the\noverall metadataFilter match.\n\n Supported values are:\n   \n   - MATCH_ANY: at least one of the filterLabels\n   must have a matching label in the provided metadata.\n   - MATCH_ALL: all filterLabels must have\n   matching labels in the provided metadata.",
                                  },
                                  filterLabels: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                      properties: {
                                        value: {
                                          type: "string",
                                          description:
                                            "The value of the label must match the specified value.\n\nvalue can have a maximum length of 1024 characters.",
                                        },
                                        name: {
                                          type: "string",
                                          description:
                                            "Name of metadata label.\n\n The name can have a maximum length of 1024 characters and must be at\nleast 1 character long.",
                                        },
                                      },
                                      description:
                                        "MetadataFilter label name value pairs that are expected\nto match corresponding labels presented as metadata to the load balancer.",
                                      additionalProperties: true,
                                    },
                                    description:
                                      "The list of label value pairs that must match labels in the provided\nmetadata based on filterMatchCriteria\n\nThis list must not be empty and can have at the most 64 entries.",
                                  },
                                },
                                description:
                                  "Opaque filter criteria used by load balancers to restrict routing\nconfiguration to a limited set of load balancing proxies. Proxies and\nsidecars involved in load balancing would typically present metadata to the\nload balancers that need to match criteria specified here. If a match takes\nplace, the relevant configuration is made available to those\nproxies.\n\nFor each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least\none of thefilterLabels must match the corresponding label provided in\nthe metadata. If its filterMatchCriteria is set to\nMATCH_ALL, then all of its filterLabels must match with\ncorresponding labels provided in the metadata.\n\nAn example for using metadataFilters would be: if\nload balancing involves\nEnvoys, they receive routing configuration when values inmetadataFilters match values supplied in  of their XDS requests to loadbalancers.",
                                additionalProperties: true,
                              },
                              description:
                                "Opaque filter criteria used by the load balancer to restrict routing\nconfiguration to a limited set of xDS\ncompliant clients. In their xDS requests to the load balancer, xDS clients\npresent node\nmetadata. When there is a match, the relevant routing configuration\nis made available to those proxies.\n\nFor each metadataFilter in this list, if itsfilterMatchCriteria is set to MATCH_ANY, at least one of thefilterLabels must match the corresponding label provided in\nthe metadata. If its filterMatchCriteria is set to\nMATCH_ALL, then all of its filterLabels must match with\ncorresponding labels provided in the metadata. If multiple\nmetadata filters are specified, all of them need to be\nsatisfied in order to be considered a match.\n\nmetadataFilters specified here is applied after those\nspecified in ForwardingRule that refers to theUrlMap this HttpRouteRuleMatch belongs to.\n\nmetadataFilters only applies to load balancers that haveloadBalancingScheme set toINTERNAL_SELF_MANAGED.\n\nNot supported when the URL map is bound to a target gRPC proxy that\nhas validateForProxyless field set to true.",
                            },
                          },
                          description:
                            "HttpRouteRuleMatch specifies a set of criteria for matching\nrequests to an HttpRouteRule. All specified criteria must\nbe satisfied for a match to occur.",
                          additionalProperties: true,
                        },
                        description:
                          "The list of criteria for matching attributes of a request to thisrouteRule. This list has OR semantics: the request matches\nthis routeRule when any of thematchRules are satisfied. However predicates within\na given matchRule have AND semantics. All predicates\nwithin a matchRule must match for the request to\nmatch the rule.",
                      },
                      priority: {
                        type: "integer",
                        description:
                          "For routeRules within a given pathMatcher,\npriority determines the order in which a load balancer interpretsrouteRules. RouteRules are evaluated in order\nof priority, from the lowest to highest number. The priority of a\nrule decreases as its number increases (1, 2, 3, N+1). The first rule\nthat matches the request is applied.\n\n\nYou cannot configure two or more routeRules with the same priority.\nPriority for each rule must be set to a number from 0 to 2147483647\ninclusive.\n\n\nPriority numbers can have gaps, which enable you to add or remove rules\nin the future without affecting the rest of the rules. For example, 1, 2,\n3, 4, 5, 9, 12, 16 is a valid series of priority numbers to which you\ncould add rules numbered from 6 to 8, 10 to 11, and 13 to 15 in the future\nwithout any impact on existing rules. (Format: int32)",
                      },
                      description: {
                        type: "string",
                        description:
                          "The short description conveying the intent of this routeRule.\n\n\nThe description can have a maximum length of 1024 characters.",
                      },
                      routeAction: {
                        type: "object",
                        properties: {
                          retryPolicy: {
                            type: "object",
                            properties: {
                              perTryTimeout: {
                                type: "object",
                                properties: {
                                  nanos: {
                                    type: "integer",
                                    description:
                                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                                  },
                                  seconds: {
                                    type: "string",
                                    description:
                                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                                  },
                                },
                                description:
                                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                                additionalProperties: true,
                              },
                              numRetries: {
                                type: "integer",
                                description:
                                  "Specifies the allowed number retries. This number must be > 0.\nIf not specified, defaults to 1. (Format: uint32)",
                              },
                              retryConditions: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies one or more conditions when this retry policy applies. Valid\nvalues are:\n   \n   - 5xx: retry is attempted if the instance or endpoint\n   responds with any 5xx response code, or if the instance or\n   endpoint does not respond at all. For example, disconnects, reset, read\n   timeout, connection failure, and refused streams.\n   - gateway-error: Similar to 5xx, but only\n   applies to response codes 502, 503 or504.\n   - connect-failure: a retry is attempted on failures\n   connecting to the instance or endpoint. For example, connection\n   timeouts.\n   - retriable-4xx: a retry is attempted if the instance\n   or endpoint responds with a 4xx response code.\n   The only error that you can retry is error code 409.\n   - refused-stream: a retry is attempted if the instance\n   or endpoint resets the stream with a REFUSED_STREAM error\n   code. This reset type indicates that it is safe to retry.\n   - cancelled: a retry is attempted if the gRPC status\n   code in the response header is set to cancelled.\n   - deadline-exceeded: a retry is attempted if the gRPC\n   status code in the response header is set todeadline-exceeded.\n   - internal: a retry is attempted if the gRPC\n   status code in the response header is set tointernal.\n   - resource-exhausted: a retry is attempted if the gRPC\n   status code in the response header is set toresource-exhausted.\n   - unavailable: a retry is attempted if the gRPC\n   status code in the response header is set tounavailable.\n\nOnly the following codes are supported when the URL map is bound to\ntarget gRPC proxy that has validateForProxyless field set to true.\n   \n   - cancelled\n   - deadline-exceeded\n   - internal\n   - resource-exhausted\n   - unavailable",
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
                                  "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                              },
                              seconds: {
                                type: "string",
                                description:
                                  "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                              },
                            },
                            description:
                              'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                            additionalProperties: true,
                          },
                          urlRewrite: {
                            type: "object",
                            properties: {
                              pathTemplateRewrite: {
                                type: "string",
                                description:
                                  "If specified, the pattern rewrites the URL path (based on the :path\nheader) using the HTTP template syntax. \n\nA corresponding\npath_template_match must be specified. Any template variables must exist in\nthe path_template_match field. \n   \n   \n      - -At least one variable must be specified in the path_template_match\n      field \n   - You can omit variables from the rewritten URL\n      - The * and ** operators cannot be matched\n      unless they have a corresponding variable name - e.g.\n      {format=*} or {var=**}.\n\nFor example, a path_template_match of /static/{format=**}\ncould be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a\nrewrite, so that /{country}/{format}/{suffix=**} can be\nrewritten as /content/{format}/{country}/{suffix}. \n\nAt least\none non-empty routeRules[].matchRules[].path_template_match is\nrequired. \n\nOnly one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                              },
                              hostRewrite: {
                                type: "string",
                                description:
                                  "Before forwarding the request to the selected service, the request's\nhost header is replaced with contents of hostRewrite.\n\nThe value must be from 1 to 255 characters.",
                              },
                              pathPrefixRewrite: {
                                type: "string",
                                description:
                                  "Before forwarding the request to the selected backend service, the\nmatching portion of the request's path is replaced bypathPrefixRewrite.\n\nThe value must be from 1 to 1024 characters.",
                              },
                            },
                            description:
                              "The spec for modifying the path before sending the request to the matched\nbackend service.",
                            additionalProperties: true,
                          },
                          requestMirrorPolicy: {
                            type: "object",
                            properties: {
                              backendService: {
                                type: "string",
                                description:
                                  "The full or partial URL to the BackendService resource being\nmirrored to.\n\nThe backend service configured for a mirroring\npolicy must reference backends that are of the same type as the original\nbackend service matched in the URL map.\n\nServerless NEG backends are not currently supported as a mirrored\nbackend service.",
                              },
                              mirrorPercent: {
                                type: "number",
                                description:
                                  "The percentage of requests to be mirrored to `backend_service`. (Format: double)",
                              },
                            },
                            description:
                              "A policy that specifies how requests intended for the route's backends\nare shadowed to a separate mirrored backend service. The load balancer\ndoesn't wait for responses from the shadow service. Before sending traffic\nto the shadow service, the host or authority header is suffixed with-shadow.",
                            additionalProperties: true,
                          },
                          maxStreamDuration: {
                            type: "object",
                            properties: {
                              nanos: {
                                type: "integer",
                                description:
                                  "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                              },
                              seconds: {
                                type: "string",
                                description:
                                  "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                              },
                            },
                            description:
                              'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                            additionalProperties: true,
                          },
                          corsPolicy: {
                            type: "object",
                            properties: {
                              allowHeaders: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Allow-Headers\nheader.",
                              },
                              disabled: {
                                type: "boolean",
                                description:
                                  "If true, disables the CORS policy.\nThe default value is false, which indicates that the CORS\npolicy is in effect.",
                              },
                              allowCredentials: {
                                type: "boolean",
                                description:
                                  "In response to a preflight request, setting this to true\nindicates that\nthe actual request can include user credentials. This field translates to\nthe Access-Control-Allow-Credentials header.\n\nDefault is false.",
                              },
                              allowOrigins: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the list of origins that is allowed to do CORS requests.\n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                              },
                              maxAge: {
                                type: "integer",
                                description:
                                  "Specifies how long results of a preflight request can be cached in\nseconds. This field translates to the Access-Control-Max-Age\nheader. (Format: int32)",
                              },
                              allowOriginRegexes: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies a regular expression that matches allowed origins. For\nmore information, see regular expression syntax. \n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.\n\nRegular expressions can only be used when the loadBalancingScheme is\nset to INTERNAL_SELF_MANAGED.",
                              },
                              allowMethods: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Allow-Methods\nheader.",
                              },
                              exposeHeaders: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Expose-Headers\nheader.",
                              },
                            },
                            description:
                              "The specification for allowing client-side cross-origin requests. For more\ninformation about the W3C recommendation for cross-origin resource sharing\n(CORS), see Fetch API Living\nStandard.",
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
                                      "The HTTP status code used to abort the request.\n\nThe value must be from 200 to 599 inclusive.\n\nFor gRPC protocol, the gRPC status code is mapped to HTTP status code\naccording to this \nmapping table. HTTP status 200 is mapped to gRPC status\nUNKNOWN. Injecting an OK status is currently not supported by\nTraffic Director. (Format: uint32)",
                                  },
                                  percentage: {
                                    type: "number",
                                    description:
                                      "The percentage of traffic for connections, operations, or requests\nthat is aborted as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                                  },
                                },
                                description:
                                  "Specification for how requests are aborted as part of fault injection.",
                                additionalProperties: true,
                              },
                              delay: {
                                type: "object",
                                properties: {
                                  percentage: {
                                    type: "number",
                                    description:
                                      "The percentage of traffic for connections, operations, or requests for\nwhich a delay is introduced as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                                  },
                                  fixedDelay: {
                                    type: "object",
                                    properties: {
                                      nanos: {
                                        type: "integer",
                                        description:
                                          "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                                      },
                                      seconds: {
                                        type: "string",
                                        description:
                                          "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                                      },
                                    },
                                    description:
                                      'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                                    additionalProperties: true,
                                  },
                                },
                                description:
                                  "Specifies the delay introduced by the load balancer before forwarding the\nrequest to the backend service as part of fault injection.",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "The specification for fault injection introduced into traffic to test\nthe resiliency of clients to backend service failure. As part of fault\ninjection, when clients send requests to a backend service, delays can be\nintroduced by the load balancer on a percentage of requests before sending\nthose request to the backend service. Similarly requests from clients can be\naborted by the load balancer for a percentage of requests.",
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
                                    "The full or partial URL to the default BackendService\nresource. Before\nforwarding the request to backendService, the load balancer\napplies any relevant headerActions specified as part of thisbackendServiceWeight.",
                                },
                                headerAction: {
                                  type: "object",
                                  properties: {
                                    requestHeadersToAdd: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          replace: {
                                            type: "boolean",
                                            description:
                                              "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                          },
                                          headerValue: {
                                            type: "string",
                                            description:
                                              "The value of the header to add.",
                                          },
                                          headerName: {
                                            type: "string",
                                            description:
                                              "The name of the header.",
                                          },
                                        },
                                        description:
                                          "Specification determining how headers are added to requests or responses.",
                                        additionalProperties: true,
                                      },
                                      description:
                                        "Headers to add to a matching request before forwarding the request to thebackendService.",
                                    },
                                    responseHeadersToRemove: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "A list of header names for headers that need to be removed from the\nresponse before sending the response back to the client.",
                                    },
                                    requestHeadersToRemove: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "A list of header names for headers that need to be removed from the\nrequest before forwarding the request to the backendService.",
                                    },
                                    responseHeadersToAdd: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          replace: {
                                            type: "boolean",
                                            description:
                                              "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                          },
                                          headerValue: {
                                            type: "string",
                                            description:
                                              "The value of the header to add.",
                                          },
                                          headerName: {
                                            type: "string",
                                            description:
                                              "The name of the header.",
                                          },
                                        },
                                        description:
                                          "Specification determining how headers are added to requests or responses.",
                                        additionalProperties: true,
                                      },
                                      description:
                                        "Headers to add the response before sending the response back to the\nclient.",
                                    },
                                  },
                                  description:
                                    "The request and response header transformations that take effect before\nthe request is passed along to the selected backendService.",
                                  additionalProperties: true,
                                },
                                weight: {
                                  type: "integer",
                                  description:
                                    "Specifies the fraction of traffic sent to a backend service,\ncomputed asweight / (sum of all weightedBackendService weights in routeAction).\n\nThe selection of a backend service is determined only for new traffic.\nOnce a user's request has been directed to a backend service,\nsubsequent requests are sent to the same backend service as\ndetermined by the backend service's session affinity policy.\nDon't configure session affinity if you're using weighted traffic\nsplitting. If you do, the weighted traffic splitting configuration takes\nprecedence.\n\nThe value must be from 0 to 1000. (Format: uint32)",
                                },
                              },
                              description:
                                "In contrast to a single BackendService in \nHttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across\nmultiple backend services. The volume of traffic for each\nbackend service is proportional to the weight specified\nin each WeightedBackendService",
                              additionalProperties: true,
                            },
                            description:
                              "A list of weighted backend services to send traffic to when a route match\noccurs. The weights determine the fraction of traffic that flows to\ntheir corresponding backend service. If all traffic needs to\ngo to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.\n\nAfter a backend service is identified and before forwarding\nthe request to\nthe backend service, advanced routing actions such as URL rewrites and\nheader transformations are applied depending on additional settings\nspecified in this HttpRouteAction.",
                          },
                        },
                        additionalProperties: true,
                      },
                    },
                    description:
                      "The HttpRouteRule setting specifies how to match an HTTP request\nand the corresponding routing action that load balancing proxies perform.",
                    additionalProperties: true,
                  },
                  description:
                    "The list of HTTP route rules. Use this list instead ofpathRules when advanced route matching and routing actions are\ndesired. routeRules are evaluated in order of priority, from\nthe lowest to highest number.\n\nWithin a given pathMatcher, you can set only one ofpathRules or routeRules.",
                },
                defaultService: {
                  type: "string",
                  description:
                    "The full or partial URL to the BackendService resource. This\nURL is used if none of the pathRules orrouteRules defined by this PathMatcher are\nmatched. For example, the\nfollowing are all valid URLs to a BackendService resource:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/global/backendServices/backendService\n     - compute/v1/projects/project/global/backendServices/backendService\n     - global/backendServices/backendService\n\n\nIf defaultRouteAction is also specified, advanced\nrouting actions, such as URL rewrites, take effect before sending the\nrequest to the backend.\n\n\nOnly one of defaultUrlRedirect, defaultService\nor defaultRouteAction.weightedBackendService can be set.\n\n\nAuthorization requires one or more of the following Google IAM permissions on the\nspecified resource default_service: \n   \n   \n      - compute.backendBuckets.use\n      - compute.backendServices.use",
                },
                pathRules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      urlRedirect: {
                        type: "object",
                        properties: {
                          stripQuery: {
                            type: "boolean",
                            description:
                              "If set to true, any accompanying query portion of the original\nURL is\nremoved before redirecting the request. If set to false, the\nquery portion of the original URL is retained.\n\nThe default is set to false.",
                          },
                          pathRedirect: {
                            type: "string",
                            description:
                              "The path that is used in the redirect response instead of the one\nthat was supplied in the request.\n\npathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
                          },
                          redirectResponseCode: {
                            type: "string",
                            enum: [
                              "FOUND",
                              "MOVED_PERMANENTLY_DEFAULT",
                              "PERMANENT_REDIRECT",
                              "SEE_OTHER",
                              "TEMPORARY_REDIRECT",
                            ],
                            description:
                              "The HTTP Status code to use for this RedirectAction.\n\nSupported values are:\n   \n   - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds\n   to 301.\n   - FOUND, which corresponds to 302.\n   - SEE_OTHER which corresponds to 303.\n   - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request\n   method is retained.\n   - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request\n   method is retained.",
                          },
                          hostRedirect: {
                            type: "string",
                            description:
                              "The host that is used in the redirect response instead of the one that\nwas supplied in the request.\n\nThe value must be from 1 to 255\ncharacters.",
                          },
                          prefixRedirect: {
                            type: "string",
                            description:
                              "The prefix that replaces the prefixMatch specified in\nthe HttpRouteRuleMatch, retaining the remaining portion\nof the URL before redirecting the request.\n\nprefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
                          },
                          httpsRedirect: {
                            type: "boolean",
                            description:
                              "If set to true, the URL scheme in the redirected request is\nset to HTTPS.\nIf set to false, the URL scheme of the redirected request\nremains the same as that of the request.\n\nThis must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.\n\nThe default is set to false.",
                          },
                        },
                        description: "Specifies settings for an HTTP redirect.",
                        additionalProperties: true,
                      },
                      service: {
                        type: "string",
                        description:
                          "The full or partial URL of the backend service resource to which traffic\nis directed if this rule is matched. If routeAction is\nalso specified, advanced routing actions, such as URL rewrites,\ntake effect before sending the request to the backend.\n\n\nOnly one of urlRedirect, service orrouteAction.weightedBackendService can be set.",
                      },
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
                                    "Valid values include:\n   \n   \n     - A number between 400 and 599: For example\n     401 or 503, in which case the load balancer\n     applies the policy if the error code exactly matches this value.\n     - 5xx: Load Balancer will apply the policy if the\n     backend service responds with any response code in the range of\n     500 to 599. \n   - 4xx: Load\n     Balancer will apply the policy if the backend service responds with any\n     response code in the range of 400 to\n     499.\n\nValues must be unique within matchResponseCodes and across allerrorResponseRules ofCustomErrorResponsePolicy.",
                                },
                                path: {
                                  type: "string",
                                  description:
                                    "The full path to a file within backendBucket . For example:/errors/defaultError.html \n\npath must start\nwith a leading slash. path cannot have trailing slashes.\n\nIf the file is not available in backendBucket  or the\nload balancer cannot reach the BackendBucket, a simpleNot Found Error is returned to the client. \n\nThe value must\nbe from 1 to 1024 characters",
                                },
                                overrideResponseCode: {
                                  type: "integer",
                                  description:
                                    "The HTTP status code returned with the response containing the custom\nerror content. If overrideResponseCode is not supplied, the\nsame response code returned by the original backend bucket or backend\nservice is returned to the client. (Format: int32)",
                                },
                              },
                              description:
                                "Specifies the mapping between the response code that will be returned along\nwith the custom error content and the response code returned by the backend\nservice.",
                              additionalProperties: true,
                            },
                            description:
                              "Specifies rules for returning error responses.\n\nIn a given policy, if you specify rules for both a range of error codes\nas well as rules for specific error codes then rules with specific error\ncodes have a higher priority. For example, assume that you configure a rule\nfor 401 (Un-authorized) code, and another for all 4 series\nerror codes (4XX). If the backend service returns a401, then the rule for 401 will be applied.\nHowever if the backend service returns a 403, the rule for4xx takes effect.",
                          },
                          errorService: {
                            type: "string",
                            description:
                              "The full or partial URL to the BackendBucket resource that\ncontains the custom error content. Examples are:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - compute/v1/projects/project/global/backendBuckets/myBackendBucket\n     - global/backendBuckets/myBackendBucket\n\nIf errorService is not specified at lower levels likepathMatcher, pathRule and routeRule,\nan errorService specified at a higher level in theUrlMap will be used. IfUrlMap.defaultCustomErrorResponsePolicy contains one or moreerrorResponseRules[], it must specifyerrorService. \n\nIf load balancer cannot reach\nthe backendBucket, a simple Not Found Error will\nbe returned, with the original response code (oroverrideResponseCode if configured).\n\nerrorService is not supported for internal or regionalHTTP/HTTPS load balancers.",
                          },
                        },
                        description:
                          "Specifies the custom error response policy that must be applied when the\nbackend service or backend bucket responds with an error.",
                        additionalProperties: true,
                      },
                      routeAction: {
                        type: "object",
                        properties: {
                          retryPolicy: {
                            type: "object",
                            properties: {
                              perTryTimeout: {
                                type: "object",
                                properties: {
                                  nanos: {
                                    type: "integer",
                                    description:
                                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                                  },
                                  seconds: {
                                    type: "string",
                                    description:
                                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                                  },
                                },
                                description:
                                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                                additionalProperties: true,
                              },
                              numRetries: {
                                type: "integer",
                                description:
                                  "Specifies the allowed number retries. This number must be > 0.\nIf not specified, defaults to 1. (Format: uint32)",
                              },
                              retryConditions: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies one or more conditions when this retry policy applies. Valid\nvalues are:\n   \n   - 5xx: retry is attempted if the instance or endpoint\n   responds with any 5xx response code, or if the instance or\n   endpoint does not respond at all. For example, disconnects, reset, read\n   timeout, connection failure, and refused streams.\n   - gateway-error: Similar to 5xx, but only\n   applies to response codes 502, 503 or504.\n   - connect-failure: a retry is attempted on failures\n   connecting to the instance or endpoint. For example, connection\n   timeouts.\n   - retriable-4xx: a retry is attempted if the instance\n   or endpoint responds with a 4xx response code.\n   The only error that you can retry is error code 409.\n   - refused-stream: a retry is attempted if the instance\n   or endpoint resets the stream with a REFUSED_STREAM error\n   code. This reset type indicates that it is safe to retry.\n   - cancelled: a retry is attempted if the gRPC status\n   code in the response header is set to cancelled.\n   - deadline-exceeded: a retry is attempted if the gRPC\n   status code in the response header is set todeadline-exceeded.\n   - internal: a retry is attempted if the gRPC\n   status code in the response header is set tointernal.\n   - resource-exhausted: a retry is attempted if the gRPC\n   status code in the response header is set toresource-exhausted.\n   - unavailable: a retry is attempted if the gRPC\n   status code in the response header is set tounavailable.\n\nOnly the following codes are supported when the URL map is bound to\ntarget gRPC proxy that has validateForProxyless field set to true.\n   \n   - cancelled\n   - deadline-exceeded\n   - internal\n   - resource-exhausted\n   - unavailable",
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
                                  "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                              },
                              seconds: {
                                type: "string",
                                description:
                                  "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                              },
                            },
                            description:
                              'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                            additionalProperties: true,
                          },
                          urlRewrite: {
                            type: "object",
                            properties: {
                              pathTemplateRewrite: {
                                type: "string",
                                description:
                                  "If specified, the pattern rewrites the URL path (based on the :path\nheader) using the HTTP template syntax. \n\nA corresponding\npath_template_match must be specified. Any template variables must exist in\nthe path_template_match field. \n   \n   \n      - -At least one variable must be specified in the path_template_match\n      field \n   - You can omit variables from the rewritten URL\n      - The * and ** operators cannot be matched\n      unless they have a corresponding variable name - e.g.\n      {format=*} or {var=**}.\n\nFor example, a path_template_match of /static/{format=**}\ncould be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a\nrewrite, so that /{country}/{format}/{suffix=**} can be\nrewritten as /content/{format}/{country}/{suffix}. \n\nAt least\none non-empty routeRules[].matchRules[].path_template_match is\nrequired. \n\nOnly one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                              },
                              hostRewrite: {
                                type: "string",
                                description:
                                  "Before forwarding the request to the selected service, the request's\nhost header is replaced with contents of hostRewrite.\n\nThe value must be from 1 to 255 characters.",
                              },
                              pathPrefixRewrite: {
                                type: "string",
                                description:
                                  "Before forwarding the request to the selected backend service, the\nmatching portion of the request's path is replaced bypathPrefixRewrite.\n\nThe value must be from 1 to 1024 characters.",
                              },
                            },
                            description:
                              "The spec for modifying the path before sending the request to the matched\nbackend service.",
                            additionalProperties: true,
                          },
                          requestMirrorPolicy: {
                            type: "object",
                            properties: {
                              backendService: {
                                type: "string",
                                description:
                                  "The full or partial URL to the BackendService resource being\nmirrored to.\n\nThe backend service configured for a mirroring\npolicy must reference backends that are of the same type as the original\nbackend service matched in the URL map.\n\nServerless NEG backends are not currently supported as a mirrored\nbackend service.",
                              },
                              mirrorPercent: {
                                type: "number",
                                description:
                                  "The percentage of requests to be mirrored to `backend_service`. (Format: double)",
                              },
                            },
                            description:
                              "A policy that specifies how requests intended for the route's backends\nare shadowed to a separate mirrored backend service. The load balancer\ndoesn't wait for responses from the shadow service. Before sending traffic\nto the shadow service, the host or authority header is suffixed with-shadow.",
                            additionalProperties: true,
                          },
                          maxStreamDuration: {
                            type: "object",
                            properties: {
                              nanos: {
                                type: "integer",
                                description:
                                  "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                              },
                              seconds: {
                                type: "string",
                                description:
                                  "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                              },
                            },
                            description:
                              'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                            additionalProperties: true,
                          },
                          corsPolicy: {
                            type: "object",
                            properties: {
                              allowHeaders: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Allow-Headers\nheader.",
                              },
                              disabled: {
                                type: "boolean",
                                description:
                                  "If true, disables the CORS policy.\nThe default value is false, which indicates that the CORS\npolicy is in effect.",
                              },
                              allowCredentials: {
                                type: "boolean",
                                description:
                                  "In response to a preflight request, setting this to true\nindicates that\nthe actual request can include user credentials. This field translates to\nthe Access-Control-Allow-Credentials header.\n\nDefault is false.",
                              },
                              allowOrigins: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the list of origins that is allowed to do CORS requests.\n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                              },
                              maxAge: {
                                type: "integer",
                                description:
                                  "Specifies how long results of a preflight request can be cached in\nseconds. This field translates to the Access-Control-Max-Age\nheader. (Format: int32)",
                              },
                              allowOriginRegexes: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies a regular expression that matches allowed origins. For\nmore information, see regular expression syntax. \n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.\n\nRegular expressions can only be used when the loadBalancingScheme is\nset to INTERNAL_SELF_MANAGED.",
                              },
                              allowMethods: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Allow-Methods\nheader.",
                              },
                              exposeHeaders: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "Specifies the content for the Access-Control-Expose-Headers\nheader.",
                              },
                            },
                            description:
                              "The specification for allowing client-side cross-origin requests. For more\ninformation about the W3C recommendation for cross-origin resource sharing\n(CORS), see Fetch API Living\nStandard.",
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
                                      "The HTTP status code used to abort the request.\n\nThe value must be from 200 to 599 inclusive.\n\nFor gRPC protocol, the gRPC status code is mapped to HTTP status code\naccording to this \nmapping table. HTTP status 200 is mapped to gRPC status\nUNKNOWN. Injecting an OK status is currently not supported by\nTraffic Director. (Format: uint32)",
                                  },
                                  percentage: {
                                    type: "number",
                                    description:
                                      "The percentage of traffic for connections, operations, or requests\nthat is aborted as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                                  },
                                },
                                description:
                                  "Specification for how requests are aborted as part of fault injection.",
                                additionalProperties: true,
                              },
                              delay: {
                                type: "object",
                                properties: {
                                  percentage: {
                                    type: "number",
                                    description:
                                      "The percentage of traffic for connections, operations, or requests for\nwhich a delay is introduced as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                                  },
                                  fixedDelay: {
                                    type: "object",
                                    properties: {
                                      nanos: {
                                        type: "integer",
                                        description:
                                          "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                                      },
                                      seconds: {
                                        type: "string",
                                        description:
                                          "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                                      },
                                    },
                                    description:
                                      'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                                    additionalProperties: true,
                                  },
                                },
                                description:
                                  "Specifies the delay introduced by the load balancer before forwarding the\nrequest to the backend service as part of fault injection.",
                                additionalProperties: true,
                              },
                            },
                            description:
                              "The specification for fault injection introduced into traffic to test\nthe resiliency of clients to backend service failure. As part of fault\ninjection, when clients send requests to a backend service, delays can be\nintroduced by the load balancer on a percentage of requests before sending\nthose request to the backend service. Similarly requests from clients can be\naborted by the load balancer for a percentage of requests.",
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
                                    "The full or partial URL to the default BackendService\nresource. Before\nforwarding the request to backendService, the load balancer\napplies any relevant headerActions specified as part of thisbackendServiceWeight.",
                                },
                                headerAction: {
                                  type: "object",
                                  properties: {
                                    requestHeadersToAdd: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          replace: {
                                            type: "boolean",
                                            description:
                                              "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                          },
                                          headerValue: {
                                            type: "string",
                                            description:
                                              "The value of the header to add.",
                                          },
                                          headerName: {
                                            type: "string",
                                            description:
                                              "The name of the header.",
                                          },
                                        },
                                        description:
                                          "Specification determining how headers are added to requests or responses.",
                                        additionalProperties: true,
                                      },
                                      description:
                                        "Headers to add to a matching request before forwarding the request to thebackendService.",
                                    },
                                    responseHeadersToRemove: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "A list of header names for headers that need to be removed from the\nresponse before sending the response back to the client.",
                                    },
                                    requestHeadersToRemove: {
                                      type: "array",
                                      items: {
                                        type: "string",
                                      },
                                      description:
                                        "A list of header names for headers that need to be removed from the\nrequest before forwarding the request to the backendService.",
                                    },
                                    responseHeadersToAdd: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          replace: {
                                            type: "boolean",
                                            description:
                                              "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                                          },
                                          headerValue: {
                                            type: "string",
                                            description:
                                              "The value of the header to add.",
                                          },
                                          headerName: {
                                            type: "string",
                                            description:
                                              "The name of the header.",
                                          },
                                        },
                                        description:
                                          "Specification determining how headers are added to requests or responses.",
                                        additionalProperties: true,
                                      },
                                      description:
                                        "Headers to add the response before sending the response back to the\nclient.",
                                    },
                                  },
                                  description:
                                    "The request and response header transformations that take effect before\nthe request is passed along to the selected backendService.",
                                  additionalProperties: true,
                                },
                                weight: {
                                  type: "integer",
                                  description:
                                    "Specifies the fraction of traffic sent to a backend service,\ncomputed asweight / (sum of all weightedBackendService weights in routeAction).\n\nThe selection of a backend service is determined only for new traffic.\nOnce a user's request has been directed to a backend service,\nsubsequent requests are sent to the same backend service as\ndetermined by the backend service's session affinity policy.\nDon't configure session affinity if you're using weighted traffic\nsplitting. If you do, the weighted traffic splitting configuration takes\nprecedence.\n\nThe value must be from 0 to 1000. (Format: uint32)",
                                },
                              },
                              description:
                                "In contrast to a single BackendService in \nHttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across\nmultiple backend services. The volume of traffic for each\nbackend service is proportional to the weight specified\nin each WeightedBackendService",
                              additionalProperties: true,
                            },
                            description:
                              "A list of weighted backend services to send traffic to when a route match\noccurs. The weights determine the fraction of traffic that flows to\ntheir corresponding backend service. If all traffic needs to\ngo to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.\n\nAfter a backend service is identified and before forwarding\nthe request to\nthe backend service, advanced routing actions such as URL rewrites and\nheader transformations are applied depending on additional settings\nspecified in this HttpRouteAction.",
                          },
                        },
                        additionalProperties: true,
                      },
                      paths: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "The list of path patterns to match. Each must start with /\nand the only place a * is allowed is at the end following\na /.  The string fed to the path matcher does not include\nany text after the first ? or #, and\nthose chars are not allowed here.",
                      },
                    },
                    description:
                      "A path-matching rule for a URL. If matched, will use the specifiedBackendService to handle the traffic arriving at this URL.",
                    additionalProperties: true,
                  },
                  description:
                    "The list of path rules. Use this list instead of routeRules\nwhen routing based on simple path matching is all that's required. The\norder by which path rules are specified does not matter. Matches are always\ndone on the longest-path-first basis.\n\nFor example: a pathRule with a path /a/b/c/* will match\nbefore /a/b/* irrespective of the order in which those paths appear in this\nlist.\n\nWithin a given pathMatcher, only one ofpathRules or routeRules must be set.",
                },
                headerAction: {
                  type: "object",
                  properties: {
                    requestHeadersToAdd: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          replace: {
                            type: "boolean",
                            description:
                              "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                          },
                          headerValue: {
                            type: "string",
                            description: "The value of the header to add.",
                          },
                          headerName: {
                            type: "string",
                            description: "The name of the header.",
                          },
                        },
                        description:
                          "Specification determining how headers are added to requests or responses.",
                        additionalProperties: true,
                      },
                      description:
                        "Headers to add to a matching request before forwarding the request to thebackendService.",
                    },
                    responseHeadersToRemove: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of header names for headers that need to be removed from the\nresponse before sending the response back to the client.",
                    },
                    requestHeadersToRemove: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of header names for headers that need to be removed from the\nrequest before forwarding the request to the backendService.",
                    },
                    responseHeadersToAdd: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          replace: {
                            type: "boolean",
                            description:
                              "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                          },
                          headerValue: {
                            type: "string",
                            description: "The value of the header to add.",
                          },
                          headerName: {
                            type: "string",
                            description: "The name of the header.",
                          },
                        },
                        description:
                          "Specification determining how headers are added to requests or responses.",
                        additionalProperties: true,
                      },
                      description:
                        "Headers to add the response before sending the response back to the\nclient.",
                    },
                  },
                  description:
                    "The request and response header transformations that take effect before\nthe request is passed along to the selected backendService.",
                  additionalProperties: true,
                },
              },
              description:
                "A matcher for the path portion of the URL. The BackendService\nfrom the longest-matched rule will serve the URL. If no rule was matched, the\ndefault service is used.",
              additionalProperties: true,
            },
            description:
              "The list of named PathMatchers to use against the URL.",
          },
          required: false,
        },
        tests: {
          name: "Tests",
          description: "The list of expected URL mapping tests.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                headers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      value: {
                        type: "string",
                        description: "Header value.",
                      },
                      name: {
                        type: "string",
                        description: "Header name.",
                      },
                    },
                    description: "HTTP headers used in UrlMapTests.",
                    additionalProperties: true,
                  },
                  description:
                    "HTTP headers for this request. If headers contains\na host header, then host must also match the header value.",
                },
                host: {
                  type: "string",
                  description:
                    "Host portion of the URL. If headers contains a host header,\nthen host must also match the header value.",
                },
                expectedRedirectResponseCode: {
                  type: "integer",
                  description:
                    "For rules with urlRedirect, the test passes only ifexpectedRedirectResponseCode matches the HTTP status code in\nload balancer's redirect response.\n\nexpectedRedirectResponseCode cannot be set whenservice is set. (Format: int32)",
                },
                description: {
                  type: "string",
                  description: "Description of this test case.",
                },
                expectedOutputUrl: {
                  type: "string",
                  description:
                    "The expected output URL evaluated by the load balancer\ncontaining the scheme, host, path and query parameters.\n\nFor rules that forward requests to backends, the test passes only whenexpectedOutputUrl matches the request forwarded by\nthe load balancer to backends. For rules with urlRewrite,\nthe test verifies that the forwarded request matcheshostRewrite and pathPrefixRewrite in theurlRewrite action. When service is specified,expectedOutputUrl`s scheme is ignored.\n\nFor rules with urlRedirect, the test passes only ifexpectedOutputUrl matches the URL in the load balancer's\nredirect response. If urlRedirect specifieshttps_redirect, the test passes only if the scheme inexpectedOutputUrl is also set to HTTPS.\nIf urlRedirect specifies strip_query, the test\npasses only if expectedOutputUrl does not contain any query\nparameters. \n\nexpectedOutputUrl is optional whenservice is specified.",
                },
                path: {
                  type: "string",
                  description: "Path portion of the URL.",
                },
                service: {
                  type: "string",
                  description:
                    "Expected BackendService or BackendBucket resource\nthe given URL should be mapped to. \n\nThe service field cannot\nbe set if expectedRedirectResponseCode is set.",
                },
              },
              description: "Message for the expected URL mappings.",
              additionalProperties: true,
            },
            description:
              "The list of expected URL mapping tests. Request to update theUrlMap succeeds only if all test cases pass. You can specify a\nmaximum of 100 tests per UrlMap.\n\nNot supported when the URL map is bound to a target gRPC proxy that\nhas validateForProxyless field set to true.",
          },
          required: false,
        },
        defaultUrlRedirect: {
          name: "Default URL Redirect",
          description:
            "When none of the specified hostRules match, the request is redirected to a URL specified by defaultUrlRedirect.",
          type: {
            type: "object",
            properties: {
              stripQuery: {
                type: "boolean",
                description:
                  "If set to true, any accompanying query portion of the original\nURL is\nremoved before redirecting the request. If set to false, the\nquery portion of the original URL is retained.\n\nThe default is set to false.",
              },
              pathRedirect: {
                type: "string",
                description:
                  "The path that is used in the redirect response instead of the one\nthat was supplied in the request.\n\npathRedirect cannot be supplied together withprefixRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
              },
              redirectResponseCode: {
                type: "string",
                enum: [
                  "FOUND",
                  "MOVED_PERMANENTLY_DEFAULT",
                  "PERMANENT_REDIRECT",
                  "SEE_OTHER",
                  "TEMPORARY_REDIRECT",
                ],
                description:
                  "The HTTP Status code to use for this RedirectAction.\n\nSupported values are:\n   \n   - MOVED_PERMANENTLY_DEFAULT, which is the default value and corresponds\n   to 301.\n   - FOUND, which corresponds to 302.\n   - SEE_OTHER which corresponds to 303.\n   - TEMPORARY_REDIRECT, which corresponds to 307. In this case, the request\n   method is retained.\n   - PERMANENT_REDIRECT, which corresponds to 308. In this case, the request\n   method is retained.",
              },
              hostRedirect: {
                type: "string",
                description:
                  "The host that is used in the redirect response instead of the one that\nwas supplied in the request.\n\nThe value must be from 1 to 255\ncharacters.",
              },
              prefixRedirect: {
                type: "string",
                description:
                  "The prefix that replaces the prefixMatch specified in\nthe HttpRouteRuleMatch, retaining the remaining portion\nof the URL before redirecting the request.\n\nprefixRedirect cannot be supplied together withpathRedirect. Supply one alone or neither. If neither is\nsupplied, the path of the original request is used for the redirect.\n\nThe value must be from 1 to 1024 characters.",
              },
              httpsRedirect: {
                type: "boolean",
                description:
                  "If set to true, the URL scheme in the redirected request is\nset to HTTPS.\nIf set to false, the URL scheme of the redirected request\nremains the same as that of the request.\n\nThis must only be set for URL maps used inTargetHttpProxys. Setting this true forTargetHttpsProxy is not permitted.\n\nThe default is set to false.",
              },
            },
            description: "Specifies settings for an HTTP redirect.",
            additionalProperties: true,
          },
          required: false,
        },
        defaultRouteAction: {
          name: "Default Route Action",
          description:
            "defaultRouteAction takes effect when none of the hostRules match.",
          type: {
            type: "object",
            properties: {
              retryPolicy: {
                type: "object",
                properties: {
                  perTryTimeout: {
                    type: "object",
                    properties: {
                      nanos: {
                        type: "integer",
                        description:
                          "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                      },
                      seconds: {
                        type: "string",
                        description:
                          "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                      },
                    },
                    description:
                      'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                    additionalProperties: true,
                  },
                  numRetries: {
                    type: "integer",
                    description:
                      "Specifies the allowed number retries. This number must be > 0.\nIf not specified, defaults to 1. (Format: uint32)",
                  },
                  retryConditions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Specifies one or more conditions when this retry policy applies. Valid\nvalues are:\n   \n   - 5xx: retry is attempted if the instance or endpoint\n   responds with any 5xx response code, or if the instance or\n   endpoint does not respond at all. For example, disconnects, reset, read\n   timeout, connection failure, and refused streams.\n   - gateway-error: Similar to 5xx, but only\n   applies to response codes 502, 503 or504.\n   - connect-failure: a retry is attempted on failures\n   connecting to the instance or endpoint. For example, connection\n   timeouts.\n   - retriable-4xx: a retry is attempted if the instance\n   or endpoint responds with a 4xx response code.\n   The only error that you can retry is error code 409.\n   - refused-stream: a retry is attempted if the instance\n   or endpoint resets the stream with a REFUSED_STREAM error\n   code. This reset type indicates that it is safe to retry.\n   - cancelled: a retry is attempted if the gRPC status\n   code in the response header is set to cancelled.\n   - deadline-exceeded: a retry is attempted if the gRPC\n   status code in the response header is set todeadline-exceeded.\n   - internal: a retry is attempted if the gRPC\n   status code in the response header is set tointernal.\n   - resource-exhausted: a retry is attempted if the gRPC\n   status code in the response header is set toresource-exhausted.\n   - unavailable: a retry is attempted if the gRPC\n   status code in the response header is set tounavailable.\n\nOnly the following codes are supported when the URL map is bound to\ntarget gRPC proxy that has validateForProxyless field set to true.\n   \n   - cancelled\n   - deadline-exceeded\n   - internal\n   - resource-exhausted\n   - unavailable",
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
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
              urlRewrite: {
                type: "object",
                properties: {
                  pathTemplateRewrite: {
                    type: "string",
                    description:
                      "If specified, the pattern rewrites the URL path (based on the :path\nheader) using the HTTP template syntax. \n\nA corresponding\npath_template_match must be specified. Any template variables must exist in\nthe path_template_match field. \n   \n   \n      - -At least one variable must be specified in the path_template_match\n      field \n   - You can omit variables from the rewritten URL\n      - The * and ** operators cannot be matched\n      unless they have a corresponding variable name - e.g.\n      {format=*} or {var=**}.\n\nFor example, a path_template_match of /static/{format=**}\ncould be rewritten as /static/content/{format} to prefix/content to the URL. Variables can also be re-ordered in a\nrewrite, so that /{country}/{format}/{suffix=**} can be\nrewritten as /content/{format}/{country}/{suffix}. \n\nAt least\none non-empty routeRules[].matchRules[].path_template_match is\nrequired. \n\nOnly one of path_prefix_rewrite orpath_template_rewrite may be specified.",
                  },
                  hostRewrite: {
                    type: "string",
                    description:
                      "Before forwarding the request to the selected service, the request's\nhost header is replaced with contents of hostRewrite.\n\nThe value must be from 1 to 255 characters.",
                  },
                  pathPrefixRewrite: {
                    type: "string",
                    description:
                      "Before forwarding the request to the selected backend service, the\nmatching portion of the request's path is replaced bypathPrefixRewrite.\n\nThe value must be from 1 to 1024 characters.",
                  },
                },
                description:
                  "The spec for modifying the path before sending the request to the matched\nbackend service.",
                additionalProperties: true,
              },
              requestMirrorPolicy: {
                type: "object",
                properties: {
                  backendService: {
                    type: "string",
                    description:
                      "The full or partial URL to the BackendService resource being\nmirrored to.\n\nThe backend service configured for a mirroring\npolicy must reference backends that are of the same type as the original\nbackend service matched in the URL map.\n\nServerless NEG backends are not currently supported as a mirrored\nbackend service.",
                  },
                  mirrorPercent: {
                    type: "number",
                    description:
                      "The percentage of requests to be mirrored to `backend_service`. (Format: double)",
                  },
                },
                description:
                  "A policy that specifies how requests intended for the route's backends\nare shadowed to a separate mirrored backend service. The load balancer\ndoesn't wait for responses from the shadow service. Before sending traffic\nto the shadow service, the host or authority header is suffixed with-shadow.",
                additionalProperties: true,
              },
              maxStreamDuration: {
                type: "object",
                properties: {
                  nanos: {
                    type: "integer",
                    description:
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
              corsPolicy: {
                type: "object",
                properties: {
                  allowHeaders: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Specifies the content for the Access-Control-Allow-Headers\nheader.",
                  },
                  disabled: {
                    type: "boolean",
                    description:
                      "If true, disables the CORS policy.\nThe default value is false, which indicates that the CORS\npolicy is in effect.",
                  },
                  allowCredentials: {
                    type: "boolean",
                    description:
                      "In response to a preflight request, setting this to true\nindicates that\nthe actual request can include user credentials. This field translates to\nthe Access-Control-Allow-Credentials header.\n\nDefault is false.",
                  },
                  allowOrigins: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Specifies the list of origins that is allowed to do CORS requests.\n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.",
                  },
                  maxAge: {
                    type: "integer",
                    description:
                      "Specifies how long results of a preflight request can be cached in\nseconds. This field translates to the Access-Control-Max-Age\nheader. (Format: int32)",
                  },
                  allowOriginRegexes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Specifies a regular expression that matches allowed origins. For\nmore information, see regular expression syntax. \n\nAn origin is allowed if it matches either an item inallowOrigins or an item inallowOriginRegexes.\n\nRegular expressions can only be used when the loadBalancingScheme is\nset to INTERNAL_SELF_MANAGED.",
                  },
                  allowMethods: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Specifies the content for the Access-Control-Allow-Methods\nheader.",
                  },
                  exposeHeaders: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Specifies the content for the Access-Control-Expose-Headers\nheader.",
                  },
                },
                description:
                  "The specification for allowing client-side cross-origin requests. For more\ninformation about the W3C recommendation for cross-origin resource sharing\n(CORS), see Fetch API Living\nStandard.",
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
                          "The HTTP status code used to abort the request.\n\nThe value must be from 200 to 599 inclusive.\n\nFor gRPC protocol, the gRPC status code is mapped to HTTP status code\naccording to this \nmapping table. HTTP status 200 is mapped to gRPC status\nUNKNOWN. Injecting an OK status is currently not supported by\nTraffic Director. (Format: uint32)",
                      },
                      percentage: {
                        type: "number",
                        description:
                          "The percentage of traffic for connections, operations, or requests\nthat is aborted as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                      },
                    },
                    description:
                      "Specification for how requests are aborted as part of fault injection.",
                    additionalProperties: true,
                  },
                  delay: {
                    type: "object",
                    properties: {
                      percentage: {
                        type: "number",
                        description:
                          "The percentage of traffic for connections, operations, or requests for\nwhich a delay is introduced as part of fault injection.\n\nThe value must be from 0.0 to 100.0 inclusive. (Format: double)",
                      },
                      fixedDelay: {
                        type: "object",
                        properties: {
                          nanos: {
                            type: "integer",
                            description:
                              "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                          },
                          seconds: {
                            type: "string",
                            description:
                              "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                          },
                        },
                        description:
                          'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                        additionalProperties: true,
                      },
                    },
                    description:
                      "Specifies the delay introduced by the load balancer before forwarding the\nrequest to the backend service as part of fault injection.",
                    additionalProperties: true,
                  },
                },
                description:
                  "The specification for fault injection introduced into traffic to test\nthe resiliency of clients to backend service failure. As part of fault\ninjection, when clients send requests to a backend service, delays can be\nintroduced by the load balancer on a percentage of requests before sending\nthose request to the backend service. Similarly requests from clients can be\naborted by the load balancer for a percentage of requests.",
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
                        "The full or partial URL to the default BackendService\nresource. Before\nforwarding the request to backendService, the load balancer\napplies any relevant headerActions specified as part of thisbackendServiceWeight.",
                    },
                    headerAction: {
                      type: "object",
                      properties: {
                        requestHeadersToAdd: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              replace: {
                                type: "boolean",
                                description:
                                  "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                              },
                              headerValue: {
                                type: "string",
                                description: "The value of the header to add.",
                              },
                              headerName: {
                                type: "string",
                                description: "The name of the header.",
                              },
                            },
                            description:
                              "Specification determining how headers are added to requests or responses.",
                            additionalProperties: true,
                          },
                          description:
                            "Headers to add to a matching request before forwarding the request to thebackendService.",
                        },
                        responseHeadersToRemove: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "A list of header names for headers that need to be removed from the\nresponse before sending the response back to the client.",
                        },
                        requestHeadersToRemove: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "A list of header names for headers that need to be removed from the\nrequest before forwarding the request to the backendService.",
                        },
                        responseHeadersToAdd: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              replace: {
                                type: "boolean",
                                description:
                                  "If false, headerValue is appended to any values\nthat already\nexist for the header. If true, headerValue is set for the\nheader, discarding any values that were set for that header.\n\nThe default value is true,\nunless a variable is present in headerValue,\nin which case the default value is false.\n.",
                              },
                              headerValue: {
                                type: "string",
                                description: "The value of the header to add.",
                              },
                              headerName: {
                                type: "string",
                                description: "The name of the header.",
                              },
                            },
                            description:
                              "Specification determining how headers are added to requests or responses.",
                            additionalProperties: true,
                          },
                          description:
                            "Headers to add the response before sending the response back to the\nclient.",
                        },
                      },
                      description:
                        "The request and response header transformations that take effect before\nthe request is passed along to the selected backendService.",
                      additionalProperties: true,
                    },
                    weight: {
                      type: "integer",
                      description:
                        "Specifies the fraction of traffic sent to a backend service,\ncomputed asweight / (sum of all weightedBackendService weights in routeAction).\n\nThe selection of a backend service is determined only for new traffic.\nOnce a user's request has been directed to a backend service,\nsubsequent requests are sent to the same backend service as\ndetermined by the backend service's session affinity policy.\nDon't configure session affinity if you're using weighted traffic\nsplitting. If you do, the weighted traffic splitting configuration takes\nprecedence.\n\nThe value must be from 0 to 1000. (Format: uint32)",
                    },
                  },
                  description:
                    "In contrast to a single BackendService in \nHttpRouteAction to which all matching traffic is directed to,WeightedBackendService allows traffic to be split across\nmultiple backend services. The volume of traffic for each\nbackend service is proportional to the weight specified\nin each WeightedBackendService",
                  additionalProperties: true,
                },
                description:
                  "A list of weighted backend services to send traffic to when a route match\noccurs. The weights determine the fraction of traffic that flows to\ntheir corresponding backend service. If all traffic needs to\ngo to a single backend service, there must be oneweightedBackendService with weight set to a non-zero number.\n\nAfter a backend service is identified and before forwarding\nthe request to\nthe backend service, advanced routing actions such as URL rewrites and\nheader transformations are applied depending on additional settings\nspecified in this HttpRouteAction.",
              },
            },
            additionalProperties: true,
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
              "https://www.googleapis.com/auth/compute",
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/regions/{region}/urlMaps`;

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

        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.fingerprint !== undefined)
          requestBody.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.hostRules !== undefined)
          requestBody.hostRules = input.event.inputConfig.hostRules;
        if (input.event.inputConfig.headerAction !== undefined)
          requestBody.headerAction = input.event.inputConfig.headerAction;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (
          input.event.inputConfig.defaultCustomErrorResponsePolicy !== undefined
        )
          requestBody.defaultCustomErrorResponsePolicy =
            input.event.inputConfig.defaultCustomErrorResponsePolicy;
        if (input.event.inputConfig.defaultService !== undefined)
          requestBody.defaultService = input.event.inputConfig.defaultService;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.pathMatchers !== undefined)
          requestBody.pathMatchers = input.event.inputConfig.pathMatchers;
        if (input.event.inputConfig.tests !== undefined)
          requestBody.tests = input.event.inputConfig.tests;
        if (input.event.inputConfig.defaultUrlRedirect !== undefined)
          requestBody.defaultUrlRedirect =
            input.event.inputConfig.defaultUrlRedirect;
        if (input.event.inputConfig.defaultRouteAction !== undefined)
          requestBody.defaultRouteAction =
            input.event.inputConfig.defaultRouteAction;

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
          targetId: {
            type: "string",
            description:
              "[Output Only] The unique target ID, which identifies a specific incarnation\nof the target resource. (Format: uint64)",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nmessage that was returned, such as `NOT FOUND`.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always `compute#operation` for\nOperation resources.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "[Output Only] Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
            },
            additionalProperties: true,
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the operation. This identifier is\ndefined by the server. (Format: uint64)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only\napplicable when performing regional operations.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server.\nThis value is inRFC3339\ntext format.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only\napplicable when performing per-zone operations.",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the\noperation.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example:\n`user@example.com` or\n`alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
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
                    '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
                },
                code: {
                  type: "string",
                  enum: [
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
                    "[Output Only] A warning code, if applicable. For example, Compute\nEngine returns NO_RESULTS_ON_PAGE if there\nare no results in the response.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the\noperation, this field will be populated.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`,\n`update`, or `delete`, and so on.",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For\noperations related to creating a snapshot, this points to the disk\nthat the snapshot was created from.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
                description:
                  "Status information per location (location name is key).\nExample key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
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
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          localizedMessage: {
                            type: "object",
                            properties: {
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at\nhttps://www.rfc-editor.org/rfc/bcp/bcp47.txt.\nExamples are: "en-US", "fr-CH", "es-MX"',
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user\nwhich can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          errorInfo: {
                            type: "object",
                            properties: {
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.\n\nKeys must match a regular expression of `a-z+` but should\nideally be lowerCamelCase. Also, they must be limited to 64 characters in\nlength. When identifying the current value of an exceeded limit, the units\nshould be contained in the key, not the value.  For example, rather than\n`{"instanceLimit": "100/request"}`, should be returned as,\n`{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of\ninstances that can be created in a single (batch) request.',
                              },
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain\nis typically the registered service name of the tool or product that\ngenerates the error. Example: "pubsub.googleapis.com". If the error is\ngenerated by some common infrastructure, the error domain must be a\nglobally unique value that identifies the infrastructure. For Google API\ninfrastructure, the error domain is "googleapis.com".',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the\nproximate cause of the error. Error reasons are unique within a particular\ndomain of errors. This should be at most 63 characters and match a\nregular expression of `A-Z+[A-Z0-9]`, which represents\nUPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.\n\nExample of an error when contacting the "pubsub.googleapis.com" API when it\nis not enabled:\n\n    { "reason": "API_DISABLED"\n      "domain": "googleapis.com"\n      "metadata": {\n        "resource": "projects/123",\n        "service": "pubsub.googleapis.com"\n      }\n    }\n\nThis response indicates that the pubsub.googleapis.com API is not enabled.\n\nExample of an error that is returned when attempting to create a Spanner\ninstance in a region that is out of stock:\n\n    { "reason": "STOCKOUT"\n      "domain": "spanner.googleapis.com",\n      "metadata": {\n        "availableRegions": "us-central1,us-east2"\n      }\n    }',
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type\nor metric. (Format: double)",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota\n type or metric. (Format: double)",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
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
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
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
                              "Provides links to documentation or for performing an out of band action.\n\nFor example, if a quota check failed with an error indicating the calling\nproject hasn't enabled the accessed service, this can contain a URL pointing\ndirectly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error\ndetails. There is a set of defined message types to use for providing\ndetails.The syntax depends on the error code. For example,\nQuotaExceededInfo will have details when the error code is\nQUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error.\nThis property is optional.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this\noperation.",
              },
            },
            description:
              "[Output Only] If errors are generated during processing of the operation,\nthis field will be populated.",
            additionalProperties: true,
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339\ntext format.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error\nstatus code that was returned. For example, a `404` means the\nresource was not found. (Format: int32)",
          },
          operationGroupId: {
            type: "string",
            description:
              "[Output Only] An ID that represents a group of operations, such as when a\ngroup of operations results from a `bulkInsert` API request.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is\nset when the operation is created.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request.\nNot present otherwise.",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested.\nThis value is inRFC3339\ntext format.",
          },
          status: {
            type: "string",
            enum: ["DONE", "PENDING", "RUNNING"],
            description:
              "[Output Only] The status of the operation, which can be one of the\nfollowing:\n`PENDING`, `RUNNING`, or `DONE`.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100.\nThere is no requirement that this be linear or support any granularity of\noperations. This should not be used to guess when the operation will be\ncomplete. This number should monotonically increase as the operation\nprogresses. (Format: int32)",
          },
        },
        description:
          "Represents an Operation resource.\n\nGoogle Compute Engine has three Operation resources:\n\n* [Global](/compute/docs/reference/rest/v1/globalOperations)\n* [Regional](/compute/docs/reference/rest/v1/regionOperations)\n* [Zonal](/compute/docs/reference/rest/v1/zoneOperations)\n\nYou can use an operation resource to manage asynchronous API requests.\nFor more information, readHandling\nAPI responses.\n\nOperations can be global, regional or zonal.\n   \n   - For global operations, use the `globalOperations`\n   resource. \n   - For regional operations, use the\n   `regionOperations` resource. \n   - For zonal operations, use\n   the `zoneOperations` resource.\n\n\n\nFor more information, read\nGlobal, Regional, and Zonal Resources.\n\nNote that completed Operation resources have a limited \nretention period.",
        additionalProperties: true,
      },
    },
  },
};

export default regionUrlMapsInsert;
