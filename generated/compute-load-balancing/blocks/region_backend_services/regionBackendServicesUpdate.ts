import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const regionBackendServicesUpdate: AppBlock = {
  name: "Region Backend Services - Update",
  description: `Updates the specified UrlMap resource with the data included in the request.`,
  category: "Region Backend Services",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
            description: "Name of the region scoping this request.",
          },
          required: true,
        },
        backendService: {
          name: "Backend Service",
          description: "Name of the BackendService resource to update.",
          type: {
            type: "string",
            description: "Name of the BackendService resource to update.",
          },
          required: true,
        },
        affinityCookieTtlSec: {
          name: "Affinity Cookie Ttl Sec",
          description:
            "Lifetime of cookies in seconds. This setting is applicable to Application Load Balancers and Traffic Director and requires GENERATED_COOKIE or HTTP_COOKIE session affinity.  If set to 0, the cookie is non-persistent and lasts only until the end of the browser session (or equivalent). The maximum allowed value is two weeks (1,209,600).  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
          type: {
            type: "integer",
            description:
              "Lifetime of cookies in seconds. This setting is applicable to Application Load Balancers and Traffic Director and requires GENERATED_COOKIE or HTTP_COOKIE session affinity.  If set to 0, the cookie is non-persistent and lasts only until the end of the browser session (or equivalent). The maximum allowed value is two weeks (1,209,600).  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
          },
          required: false,
        },
        backends: {
          name: "Backends",
          description: "The list of backends that serve this BackendService.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                balancingMode: {
                  type: "string",
                  enum: [
                    "UNDEFINED_BALANCING_MODE",
                    "CONNECTION",
                    "CUSTOM_METRICS",
                    "RATE",
                    "UTILIZATION",
                  ],
                  description:
                    "Specifies how to determine whether the backend of a load balancer can handle additional traffic or is fully loaded. For usage guidelines, see Connection balancing mode.  Backends must use compatible balancing modes. For more information, see Supported balancing modes and target capacity settings and Restrictions and guidance for instance groups.  Note: Currently, if you use the API to configure incompatible balancing modes, the configuration might be accepted even though it has no impact and is ignored. Specifically, Backend.maxUtilization is ignored when Backend.balancingMode is RATE. In the future, this incompatible combination will be rejected. Check the BalancingMode enum for the list of possible values.",
                },
                capacityScaler: {
                  type: "number",
                  description:
                    "A multiplier applied to the backend's target capacity of its balancing mode. The default value is 1, which means the group serves up to 100% of its configured capacity (depending onbalancingMode). A setting of 0 means the group is completely drained, offering 0% of its available capacity. The valid ranges are 0.0 and [0.1,1.0]. You cannot configure a setting larger than 0 and smaller than0.1. You cannot configure a setting of 0 when there is only one backend attached to the backend service.  Not available with backends that don't support using abalancingMode. This includes backends such as global internet NEGs, regional serverless NEGs, and PSC NEGs.",
                },
                customMetrics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      dryRun: {
                        type: "boolean",
                        description:
                          "If true, the metric data is collected and reported to Cloud Monitoring, but is not used for load balancing.",
                      },
                      maxUtilization: {
                        type: "number",
                        description:
                          "Optional parameter to define a target utilization for the Custom Metrics balancing mode. The valid range is [0.0, 1.0].",
                      },
                      name: {
                        type: "string",
                        description:
                          "Name of a custom utilization signal. The name must be 1-64 characters long and match the regular expression `[a-z]([-_.a-z0-9]*[a-z0-9])?` which means that the first character must be a lowercase letter, and all following characters must be a dash, period, underscore, lowercase letter, or digit, except the last character, which cannot be a dash, period, or underscore. For usage guidelines, see Custom Metrics balancing mode. This field can only be used for a global or regional backend service with the loadBalancingScheme set to EXTERNAL_MANAGED,INTERNAL_MANAGED INTERNAL_SELF_MANAGED.",
                      },
                    },
                    description:
                      "Custom Metrics are used for CUSTOM_METRICS balancing_mode.",
                    additionalProperties: true,
                  },
                  description:
                    "List of custom metrics that are used for CUSTOM_METRICS BalancingMode.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                failover: {
                  type: "boolean",
                  description:
                    "This field designates whether this is a failover backend. More than one failover backend can be configured for a given BackendService.",
                },
                group: {
                  type: "string",
                  description:
                    "The fully-qualified URL of aninstance group or network endpoint group (NEG) resource. To determine what types of backends a load balancer supports, see the [Backend services overview](https://cloud.google.com/load-balancing/docs/backend-service#backends).  You must use the *fully-qualified* URL (starting withhttps://www.googleapis.com/) to specify the instance group or NEG. Partial URLs are not supported.  If haPolicy is specified, backends must refer to NEG resources of type GCE_VM_IP.",
                },
                maxConnections: {
                  type: "integer",
                  description:
                    "Defines a target maximum number of simultaneous connections. For usage guidelines, seeConnection balancing mode and Utilization balancing mode. Not available if the backend'sbalancingMode is RATE.",
                },
                maxConnectionsPerEndpoint: {
                  type: "integer",
                  description:
                    "Defines a target maximum number of simultaneous connections.  For usage guidelines, seeConnection balancing mode and Utilization balancing mode.  Not available if the backend's balancingMode isRATE.",
                },
                maxConnectionsPerInstance: {
                  type: "integer",
                  description:
                    "Defines a target maximum number of simultaneous connections. For usage guidelines, seeConnection balancing mode and Utilization balancing mode.  Not available if the backend's balancingMode isRATE.",
                },
                maxRate: {
                  type: "integer",
                  description:
                    "Defines a maximum number of HTTP requests per second (RPS). For usage guidelines, seeRate balancing mode and Utilization balancing mode.  Not available if the backend's balancingMode isCONNECTION.",
                },
                maxRatePerEndpoint: {
                  type: "number",
                  description:
                    "Defines a maximum target for requests per second (RPS). For usage guidelines, seeRate balancing mode and Utilization balancing mode.  Not available if the backend's balancingMode isCONNECTION.",
                },
                maxRatePerInstance: {
                  type: "number",
                  description:
                    "Defines a maximum target for requests per second (RPS). For usage guidelines, seeRate balancing mode and Utilization balancing mode.  Not available if the backend's balancingMode isCONNECTION.",
                },
                maxUtilization: {
                  type: "number",
                  description:
                    "Optional parameter to define a target capacity for theUTILIZATION balancing mode. The valid range is[0.0, 1.0].  For usage guidelines, seeUtilization balancing mode.",
                },
                preference: {
                  type: "string",
                  enum: [
                    "UNDEFINED_PREFERENCE",
                    "DEFAULT",
                    "PREFERENCE_UNSPECIFIED",
                    "PREFERRED",
                  ],
                  description:
                    "This field indicates whether this backend should be fully utilized before sending traffic to backends with default preference. The possible values are:     - PREFERRED: Backends with this preference level will be    filled up to their capacity limits first, based on RTT.    - DEFAULT:  If preferred backends don't have enough    capacity, backends in this layer would be used and traffic would be    assigned based on the load balancing algorithm you use. This is the    default Check the Preference enum for the list of possible values.",
                },
              },
              description:
                "Message containing information of one individual backend.",
              additionalProperties: true,
            },
            description: "The list of backends that serve this BackendService.",
          },
          required: false,
        },
        cdnPolicy: {
          name: "Cdn Policy",
          description:
            "Cloud CDN configuration for this BackendService. Only available for specified load balancer types.",
          type: {
            type: "object",
            properties: {
              bypassCacheOnRequestHeaders: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    headerName: {
                      type: "string",
                      description:
                        "The header field name to match on when bypassing cache. Values are case-insensitive.",
                    },
                  },
                  description:
                    "Bypass the cache when the specified request headers are present, e.g. Pragma or Authorization headers. Values are case insensitive. The presence of such a header overrides the cache_mode setting.",
                  additionalProperties: true,
                },
                description:
                  "Bypass the cache when the specified request headers are matched - e.g. Pragma or Authorization headers. Up to 5 headers can be specified. The cache is bypassed for all cdnPolicy.cacheMode settings.",
              },
              cacheKeyPolicy: {
                type: "object",
                properties: {
                  includeHost: {
                    type: "boolean",
                    description:
                      "If true, requests to different hosts will be cached separately.",
                  },
                  includeHttpHeaders: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Allows HTTP request headers (by name) to be used in the cache key.",
                  },
                  includeNamedCookies: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Allows HTTP cookies (by name) to be used in the cache key. The name=value pair will be used in the cache key Cloud CDN generates.",
                  },
                  includeProtocol: {
                    type: "boolean",
                    description:
                      "If true, http and https requests will be cached separately.",
                  },
                  includeQueryString: {
                    type: "boolean",
                    description:
                      "If true, include query string parameters in the cache key according to query_string_whitelist and query_string_blacklist. If neither is set, the entire query string will be included. If false, the query string will be excluded from the cache key entirely.",
                  },
                  queryStringBlacklist: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Names of query string parameters to exclude in cache keys. All other parameters will be included. Either specify query_string_whitelist or query_string_blacklist, not both. '&' and '=' will be percent encoded and not treated as delimiters.",
                  },
                  queryStringWhitelist: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Names of query string parameters to include in cache keys. All other parameters will be excluded. Either specify query_string_whitelist or query_string_blacklist, not both. '&' and '=' will be percent encoded and not treated as delimiters.",
                  },
                },
                description:
                  "Message containing what to include in the cache key for a request for Cloud CDN.",
                additionalProperties: true,
              },
              cacheMode: {
                type: "string",
                enum: [
                  "UNDEFINED_CACHE_MODE",
                  "CACHE_ALL_STATIC",
                  "FORCE_CACHE_ALL",
                  "INVALID_CACHE_MODE",
                  "USE_ORIGIN_HEADERS",
                ],
                description:
                  'Specifies the cache setting for all responses from this backend. The possible values are:USE_ORIGIN_HEADERS Requires the origin to set valid caching headers to cache content. Responses without these headers will not be cached at Google\'s edge, and will require a full trip to the origin on every request, potentially impacting performance and increasing load on the origin server.FORCE_CACHE_ALL Cache all content, ignoring any "private", "no-store" or "no-cache" directives in Cache-Control response headers. Warning: this may result in Cloud CDN caching private, per-user (user identifiable) content.CACHE_ALL_STATIC Automatically cache static content, including common image formats, media (video and audio), and web assets (JavaScript and CSS). Requests and responses that are marked as uncacheable, as well as dynamic content (including HTML), will not be cached.  If no value is provided for cdnPolicy.cacheMode, it defaults to CACHE_ALL_STATIC. Check the CacheMode enum for the list of possible values.',
              },
              clientTtl: {
                type: "integer",
                description:
                  'Specifies a separate client (e.g. browser client) maximum TTL. This is used to clamp the max-age (or Expires) value sent to the client.  With FORCE_CACHE_ALL, the lesser of client_ttl and default_ttl is used for the response max-age directive, along with a "public" directive.  For cacheable content in CACHE_ALL_STATIC mode, client_ttl clamps the max-age from the origin (if specified), or else sets the response max-age directive to the lesser of the client_ttl and default_ttl, and also ensures a "public" cache-control directive is present. If a client TTL is not specified, a default value (1 hour) will be used. The maximum allowed value is 31,622,400s (1 year).',
              },
              defaultTtl: {
                type: "integer",
                description:
                  'Specifies the default TTL for cached content served by this origin for responses that do not have an existing valid TTL (max-age or s-maxage). Setting a TTL of "0" means "always revalidate". The value of defaultTTL cannot be set to a value greater than that of maxTTL, but can be equal. When the cacheMode is set to FORCE_CACHE_ALL, the defaultTTL will overwrite the TTL set in all responses. The maximum allowed value is 31,622,400s (1 year), noting that infrequently accessed objects may be evicted from the cache before the defined TTL.',
              },
              maxTtl: {
                type: "integer",
                description:
                  'Specifies the maximum allowed TTL for cached content served by this origin. Cache directives that attempt to set a max-age or s-maxage higher than this, or an Expires header more than maxTTL seconds in the future will be capped at the value of maxTTL, as if it were the value of an s-maxage Cache-Control directive. Headers sent to the client will not be modified. Setting a TTL of "0" means "always revalidate". The maximum allowed value is 31,622,400s (1 year), noting that infrequently accessed objects may be evicted from the cache before the defined TTL.',
              },
              negativeCaching: {
                type: "boolean",
                description:
                  "Negative caching allows per-status code TTLs to be set, in order to apply fine-grained caching for common errors or redirects. This can reduce the load on your origin and improve end-user experience by reducing response latency. When the cache mode is set to CACHE_ALL_STATIC or USE_ORIGIN_HEADERS, negative caching applies to responses with the specified response code that lack any Cache-Control, Expires, or Pragma: no-cache directives. When the cache mode is set to FORCE_CACHE_ALL, negative caching applies to all responses with the specified response code, and override any caching headers. By default, Cloud CDN will apply the following default TTLs to these status codes: HTTP 300 (Multiple Choice), 301, 308 (Permanent Redirects): 10m HTTP 404 (Not Found), 410 (Gone), 451 (Unavailable For Legal Reasons): 120s HTTP 405 (Method Not Found), 501 (Not Implemented): 60s. These defaults can be overridden in negative_caching_policy.",
              },
              negativeCachingPolicy: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: {
                      type: "integer",
                      description:
                        "The HTTP status code to define a TTL against. Only HTTP status codes 300, 301, 302, 307, 308, 404, 405, 410, 421, 451 and 501 can be specified as values, and you cannot specify a status code more than once.",
                    },
                    ttl: {
                      type: "integer",
                      description:
                        "The TTL (in seconds) for which to cache responses with the corresponding status code. The maximum allowed value is 1800s (30 minutes), noting that infrequently accessed objects may be evicted from the cache before the defined TTL.",
                    },
                  },
                  description: "Specify CDN TTLs for response error codes.",
                  additionalProperties: true,
                },
                description:
                  "Sets a cache TTL for the specified HTTP status code. negative_caching must be enabled to configure negative_caching_policy. Omitting the policy and leaving negative_caching enabled will use Cloud CDN's default cache TTLs. Note that when specifying an explicit negative_caching_policy, you should take care to specify a cache TTL for all response codes that you wish to cache. Cloud CDN will not apply any default negative caching when a policy exists.",
              },
              requestCoalescing: {
                type: "boolean",
                description:
                  "If true then Cloud CDN will combine multiple concurrent cache fill requests into a small number of requests to the origin.",
              },
              serveWhileStale: {
                type: "integer",
                description:
                  'Serve existing content from the cache (if available) when revalidating content with the origin, or when an error is encountered when refreshing the cache. This setting defines the default "max-stale" duration for any cached responses that do not specify a max-stale directive. Stale responses that exceed the TTL configured here will not be served. The default limit (max-stale) is 86400s (1 day), which will allow stale content to be served up to this limit beyond the max-age (or s-maxage) of a cached response. The maximum allowed value is 604800 (1 week). Set this to zero (0) to disable serve-while-stale.',
              },
              signedUrlCacheMaxAgeSec: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            description:
              "Message containing Cloud CDN configuration for a backend service.",
            additionalProperties: true,
          },
          required: false,
        },
        circuitBreakers: {
          name: "Circuit Breakers",
          description: "Circuit Breakers field",
          type: {
            type: "object",
            properties: {
              maxConnections: {
                type: "integer",
                description:
                  "The maximum number of connections to the backend service. If not specified, there is no limit.  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
              },
              maxPendingRequests: {
                type: "integer",
                description:
                  "The maximum number of pending requests allowed to the backend service. If not specified, there is no limit.  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
              },
              maxRequests: {
                type: "integer",
                description:
                  "The maximum number of parallel requests that allowed to the backend service. If not specified, there is no limit.",
              },
              maxRequestsPerConnection: {
                type: "integer",
                description:
                  "Maximum requests for a single connection to the backend service. This parameter is respected by both the HTTP/1.1 and HTTP/2 implementations. If not specified, there is no limit. Setting this parameter to 1 will effectively disable keep alive.  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
              },
              maxRetries: {
                type: "integer",
                description:
                  "The maximum number of parallel retries allowed to the backend cluster. If not specified, the default is 1.  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
              },
            },
            description:
              "Settings controlling the volume of requests, connections and retries to this backend service.",
            additionalProperties: true,
          },
          required: false,
        },
        compressionMode: {
          name: "Compression Mode",
          description:
            "Compress text responses using Brotli or gzip compression, based on the client's Accept-Encoding header. Check the CompressionMode enum for the list of possible values.",
          type: {
            type: "string",
            enum: ["UNDEFINED_COMPRESSION_MODE", "AUTOMATIC", "DISABLED"],
            description:
              "Compress text responses using Brotli or gzip compression, based on the client's Accept-Encoding header. Check the CompressionMode enum for the list of possible values.",
          },
          required: false,
        },
        connectionDraining: {
          name: "Connection Draining",
          description: "connectionDraining cannot be specified with haPolicy.",
          type: {
            type: "object",
            properties: {
              drainingTimeoutSec: {
                type: "integer",
                description:
                  "Configures a duration timeout for existing requests on a removed backend instance. For supported load balancers and protocols, as described inEnabling connection draining.",
              },
            },
            description:
              "Message containing connection draining configuration.",
            additionalProperties: true,
          },
          required: false,
        },
        connectionTrackingPolicy: {
          name: "Connection Tracking Policy",
          description:
            "Connection Tracking configuration for this BackendService. Connection tracking policy settings are only available for external passthrough Network Load Balancers and internal passthrough Network Load Balancers.  connectionTrackingPolicy cannot be specified with haPolicy.",
          type: {
            type: "object",
            properties: {
              connectionPersistenceOnUnhealthyBackends: {
                type: "string",
                enum: [
                  "UNDEFINED_CONNECTION_PERSISTENCE_ON_UNHEALTHY_BACKENDS",
                  "ALWAYS_PERSIST",
                  "DEFAULT_FOR_PROTOCOL",
                  "NEVER_PERSIST",
                ],
                description:
                  "Specifies connection persistence when backends are unhealthy. The default value is DEFAULT_FOR_PROTOCOL.  If set to DEFAULT_FOR_PROTOCOL, the existing connections persist on unhealthy backends only for connection-oriented protocols (TCP and SCTP) and only if the Tracking Mode isPER_CONNECTION (default tracking mode) or the Session Affinity is configured for 5-tuple. They do not persist forUDP.  If set to NEVER_PERSIST, after a backend becomes unhealthy, the existing connections on the unhealthy backend are never persisted on the unhealthy backend. They are always diverted to newly selected healthy backends (unless all backends are unhealthy).  If set to ALWAYS_PERSIST, existing connections always persist on unhealthy backends regardless of protocol and session affinity. It is generally not recommended to use this mode overriding the default.  For more details, see [Connection Persistence for Network Load Balancing](https://cloud.google.com/load-balancing/docs/network/networklb-backend-service#connection-persistence) and [Connection Persistence for Internal TCP/UDP Load Balancing](https://cloud.google.com/load-balancing/docs/internal#connection-persistence). Check the ConnectionPersistenceOnUnhealthyBackends enum for the list of possible values.",
              },
              enableStrongAffinity: {
                type: "boolean",
                description:
                  "Enable Strong Session Affinity for external passthrough Network Load Balancers. This option is not available publicly.",
              },
              idleTimeoutSec: {
                type: "integer",
                description:
                  "Specifies how long to keep a Connection Tracking entry while there is no matching traffic (in seconds).  For internal passthrough Network Load Balancers:     - The minimum (default) is 10 minutes and the maximum is 16 hours.    - It can be set only if Connection Tracking is less than 5-tuple    (i.e. Session Affinity is CLIENT_IP_NO_DESTINATION,CLIENT_IP or CLIENT_IP_PROTO, and Tracking    Mode is PER_SESSION).    For external passthrough Network Load Balancers the default is 60 seconds. This option is not available publicly.",
              },
              trackingMode: {
                type: "string",
                enum: [
                  "UNDEFINED_TRACKING_MODE",
                  "INVALID_TRACKING_MODE",
                  "PER_CONNECTION",
                  "PER_SESSION",
                ],
                description:
                  "Specifies the key used for connection tracking. There are two options:     - PER_CONNECTION: This is the default mode. The Connection    Tracking is performed as per the Connection Key (default Hash Method) for    the specific protocol.    - PER_SESSION: The Connection Tracking is performed as per    the configured Session Affinity. It matches the configured Session    Affinity.    For more details, see [Tracking Mode for Network Load Balancing](https://cloud.google.com/load-balancing/docs/network/networklb-backend-service#tracking-mode) and [Tracking Mode for Internal TCP/UDP Load Balancing](https://cloud.google.com/load-balancing/docs/internal#tracking-mode). Check the TrackingMode enum for the list of possible values.",
              },
            },
            description:
              "Connection Tracking configuration for this BackendService.",
            additionalProperties: true,
          },
          required: false,
        },
        consistentHash: {
          name: "Consistent Hash",
          description:
            "Consistent Hash-based load balancing can be used to provide soft session affinity based on HTTP headers, cookies or other properties. This load balancing policy is applicable only for HTTP connections. The affinity to a particular destination host will be lost when one or more hosts are added/removed from the destination service. This field specifies parameters that control consistent hashing. This field is only applicable whenlocalityLbPolicy is set to MAGLEV orRING_HASH.  This field is applicable to either:     - A regional backend service with the service_protocol set to HTTP,    HTTPS, HTTP2 or H2C, and load_balancing_scheme set to    INTERNAL_MANAGED.    - A global backend service with the    load_balancing_scheme set to INTERNAL_SELF_MANAGED.",
          type: {
            type: "object",
            properties: {
              httpCookie: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the cookie.",
                  },
                  path: {
                    type: "string",
                    description: "Path to set for the cookie.",
                  },
                  ttl: {
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
                },
                description:
                  "The information about the HTTP Cookie on which the hash function is based for load balancing policies that use a consistent hash.",
                additionalProperties: true,
              },
              httpHeaderName: {
                type: "string",
                description:
                  "The hash based on the value of the specified header field. This field is applicable if the sessionAffinity is set toHEADER_FIELD.",
              },
              minimumRingSize: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            description:
              "This message defines settings for a consistent hash style load balancer.",
            additionalProperties: true,
          },
          required: false,
        },
        customMetrics: {
          name: "Custom Metrics",
          description:
            "List of custom metrics that are used for theWEIGHTED_ROUND_ROBIN locality_lb_policy.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                dryRun: {
                  type: "boolean",
                  description:
                    "If true, the metric data is not used for load balancing.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of a custom utilization signal. The name must be 1-64 characters long and match the regular expression `[a-z]([-_.a-z0-9]*[a-z0-9])?` which means that the first character must be a lowercase letter, and all following characters must be a dash, period, underscore, lowercase letter, or digit, except the last character, which cannot be a dash, period, or underscore. For usage guidelines, see Custom Metrics balancing mode. This field can only be used for a global or regional backend service with the loadBalancingScheme set to EXTERNAL_MANAGED,INTERNAL_MANAGED INTERNAL_SELF_MANAGED.",
                },
              },
              description:
                "Custom Metrics are used for WEIGHTED_ROUND_ROBIN locality_lb_policy.",
              additionalProperties: true,
            },
            description:
              "List of custom metrics that are used for theWEIGHTED_ROUND_ROBIN locality_lb_policy.",
          },
          required: false,
        },
        customRequestHeaders: {
          name: "Custom Request Headers",
          description:
            "Headers that the load balancer adds to proxied requests. See [Creating custom headers](https://cloud.google.com/load-balancing/docs/custom-headers).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the load balancer adds to proxied requests. See [Creating custom headers](https://cloud.google.com/load-balancing/docs/custom-headers).",
          },
          required: false,
        },
        customResponseHeaders: {
          name: "Custom Response Headers",
          description:
            "Headers that the load balancer adds to proxied responses. See [Creating custom headers](https://cloud.google.com/load-balancing/docs/custom-headers).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the load balancer adds to proxied responses. See [Creating custom headers](https://cloud.google.com/load-balancing/docs/custom-headers).",
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
        enableCDN: {
          name: "Enable C D N",
          description:
            "If true, enables Cloud CDN for the backend service of a global external Application Load Balancer.",
          type: {
            type: "boolean",
            description:
              "If true, enables Cloud CDN for the backend service of a global external Application Load Balancer.",
          },
          required: false,
        },
        externalManagedMigrationState: {
          name: "External Managed Migration State",
          description:
            "Specifies the canary migration state. Possible values are PREPARE, TEST_BY_PERCENTAGE, and TEST_ALL_TRAFFIC.  To begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be changed to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before the loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate traffic by percentage using externalManagedMigrationTestingPercentage.  Rolling back a migration requires the states to be set in reverse order. So changing the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to be set to TEST_ALL_TRAFFIC at the same time. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate some traffic back to EXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL. Check the ExternalManagedMigrationState enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_EXTERNAL_MANAGED_MIGRATION_STATE",
              "PREPARE",
              "TEST_ALL_TRAFFIC",
              "TEST_BY_PERCENTAGE",
            ],
            description:
              "Specifies the canary migration state. Possible values are PREPARE, TEST_BY_PERCENTAGE, and TEST_ALL_TRAFFIC.  To begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be changed to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before the loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate traffic by percentage using externalManagedMigrationTestingPercentage.  Rolling back a migration requires the states to be set in reverse order. So changing the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to be set to TEST_ALL_TRAFFIC at the same time. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate some traffic back to EXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL. Check the ExternalManagedMigrationState enum for the list of possible values.",
          },
          required: false,
        },
        externalManagedMigrationTestingPercentage: {
          name: "External Managed Migration Testing Percentage",
          description:
            "Determines the fraction of requests that should be processed by the Global external Application Load Balancer.  The value of this field must be in the range [0, 100].  Session affinity options will slightly affect this routing behavior, for more details, see:Session Affinity.  This value can only be set if the loadBalancingScheme in the BackendService is set to EXTERNAL (when using the classic Application Load Balancer) and the migration state is TEST_BY_PERCENTAGE.",
          type: {
            type: "number",
            description:
              "Determines the fraction of requests that should be processed by the Global external Application Load Balancer.  The value of this field must be in the range [0, 100].  Session affinity options will slightly affect this routing behavior, for more details, see:Session Affinity.  This value can only be set if the loadBalancingScheme in the BackendService is set to EXTERNAL (when using the classic Application Load Balancer) and the migration state is TEST_BY_PERCENTAGE.",
          },
          required: false,
        },
        failoverPolicy: {
          name: "Failover Policy",
          description:
            "Requires at least one backend instance group to be defined as a backup (failover) backend. For load balancers that have configurable failover: [Internal passthrough Network Load Balancers](https://cloud.google.com/load-balancing/docs/internal/failover-overview) and [external passthrough Network Load Balancers](https://cloud.google.com/load-balancing/docs/network/networklb-failover-overview).  failoverPolicy cannot be specified with haPolicy.",
          type: {
            type: "object",
            properties: {
              disableConnectionDrainOnFailover: {
                type: "boolean",
                description:
                  "This can be set to true only if the protocol isTCP.  The default is false.",
              },
              dropTrafficIfUnhealthy: {
                type: "boolean",
                description:
                  "If set to true, connections to the load balancer are dropped when all primary and all backup backend VMs are unhealthy.If set to false, connections are distributed among all primary VMs when all primary and all backup backend VMs are  unhealthy. For load balancers that have configurable failover: [Internal passthrough Network Load Balancers](https://cloud.google.com/load-balancing/docs/internal/failover-overview) and [external passthrough Network Load Balancers](https://cloud.google.com/load-balancing/docs/network/networklb-failover-overview). The default is false.",
              },
              failoverRatio: {
                type: "number",
                description:
                  "The value of the field must be in the range[0, 1]. If the value is 0, the load balancer performs a failover when the number of healthy primary VMs equals zero. For all other values, the load balancer performs a failover when the total number of healthy primary VMs is less than this ratio. For load balancers that have configurable failover: [Internal TCP/UDP Load Balancing](https://cloud.google.com/load-balancing/docs/internal/failover-overview) and [external TCP/UDP Load Balancing](https://cloud.google.com/load-balancing/docs/network/networklb-failover-overview).",
              },
            },
            description:
              "For load balancers that have configurable failover: [Internal passthrough Network Load Balancers](https://cloud.google.com/load-balancing/docs/internal/failover-overview) and [external passthrough Network Load Balancers](https://cloud.google.com/load-balancing/docs/network/networklb-failover-overview). On failover or failback, this field indicates whether connection draining will be honored. Google Cloud has a fixed connection draining timeout of 10 minutes. A setting of true terminates existing TCP connections to the active pool during failover and failback, immediately draining traffic. A setting of false allows existing TCP connections to persist, even on VMs no longer in the active pool, for up to the duration of the connection draining timeout (10 minutes).",
            additionalProperties: true,
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a BackendService. An up-to-date fingerprint must be provided in order to update the BackendService, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a BackendService.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a BackendService. An up-to-date fingerprint must be provided in order to update the BackendService, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a BackendService.",
          },
          required: false,
        },
        haPolicy: {
          name: "Ha Policy",
          description:
            "Configures self-managed High Availability (HA) for External and Internal Protocol Forwarding.  The backends of this regional backend service must only specify zonal network endpoint groups (NEGs) of type GCE_VM_IP.  When haPolicy is set for an Internal Passthrough Network Load Balancer, the regional backend service must set the network field. All zonal NEGs must belong to the same network. However, individual NEGs can belong to different subnetworks of that network.  When haPolicy is specified, the set of attached network endpoints across all backends comprise an High Availability domain from which one endpoint is selected as the active endpoint (the leader) that receives all traffic.  haPolicy can be added only at backend service creation time. Once set up, it cannot be deleted.  Note that haPolicy is not for load balancing, and therefore cannot be specified with sessionAffinity, connectionTrackingPolicy, and failoverPolicy.  haPolicy requires customers to be responsible for tracking backend endpoint health and electing a leader among the healthy endpoints. Therefore, haPolicy cannot be specified with healthChecks.  haPolicy can only be specified for External Passthrough Network Load Balancers and Internal Passthrough Network Load Balancers.",
          type: {
            type: "object",
            properties: {
              fastIPMove: {
                type: "string",
                enum: ["UNDEFINED_FAST_I_P_MOVE", "DISABLED", "GARP_RA"],
                description:
                  "Specifies whether fast IP move is enabled, and if so, the mechanism to achieve it.  Supported values are:     - DISABLED: Fast IP Move is disabled. You can only use the    haPolicy.leader API to update the leader.    - >GARP_RA: Provides a method to very quickly define a new network    endpoint as the leader. This method is faster than updating the leader    using the haPolicy.leader API. Fast IP move works as follows: The VM    hosting the network endpoint that should become the new leader sends    either a Gratuitous ARP (GARP) packet (IPv4) or an ICMPv6 Router    Advertisement(RA) packet (IPv6).  Google Cloud immediately but    temporarily associates the forwarding rule IP address with that VM, and    both new and in-flight packets are quickly delivered to that VM.    Note the important properties of the Fast IP Move functionality:     - The GARP/RA-initiated re-routing stays active for approximately 20    minutes. After triggering fast failover, you must also    appropriately set the haPolicy.leader.    -  The new leader instance should continue to send GARP/RA packets    periodically every 10 seconds until at least 10 minutes after updating    the haPolicy.leader (but stop immediately if it is no longer the leader).    - After triggering a fast failover, we recommend that you wait at least    3 seconds before sending another GARP/RA packet from a different VM    instance to avoid race conditions.    - Don't send GARP/RA packets from different VM    instances at the same time. If multiple instances continue to send    GARP/RA packets, traffic might be routed to different destinations in an    alternating order. This condition ceases when a single instance    issues a GARP/RA packet.    - The GARP/RA request always takes priority over the leader API.    Using the haPolicy.leader API to change the leader to a different    instance will have no effect until the GARP/RA request becomes    inactive.    - The GARP/RA packets should follow the GARP/RA    Packet Specifications..    -  When multiple forwarding rules refer to a regional backend service,    you need only send a GARP or RA packet for a single forwarding rule    virtual IP. The virtual IPs for all forwarding rules targeting the same    backend service will also be moved to the sender of the GARP or RA    packet.    The following are the Fast IP Move limitations (that is, when fastIPMove is not DISABLED):     - Multiple forwarding rules cannot use the same IP address if one of    them refers to a regional backend service with fastIPMove.    - The regional backend service must set the network field, and all    NEGs must belong to that network. However, individual    NEGs can belong to different subnetworks of that network.    - The maximum number of network endpoints across all backends of a    backend service with fastIPMove is 32.    - The maximum number of backend services with fastIPMove that can have    the same network endpoint attached to one of its backends is 64.    - The maximum number of backend services with fastIPMove in a VPC in a    region is 64.    - The network endpoints that are attached to a backend of a backend    service with fastIPMove cannot resolve to Gen3+ machines for IPv6.    - Traffic directed to the leader by a static route next hop will not be    redirected to a new leader by fast failover. Such traffic will only be    redirected once an haPolicy.leader update has taken effect. Only traffic    to the forwarding rule's virtual IP will be redirected to a new leader by    fast failover.   haPolicy.fastIPMove can be set only at backend service creation time. Once set, it cannot be updated.  By default, fastIpMove is set to DISABLED. Check the FastIPMove enum for the list of possible values.",
              },
              leader: {
                type: "object",
                properties: {
                  backendGroup: {
                    type: "string",
                    description:
                      "A fully-qualified URL (starting with https://www.googleapis.com/) of the zonal Network Endpoint Group (NEG) with `GCE_VM_IP` endpoints that the leader is attached to.  The leader's backendGroup must already be specified as a backend of this backend service. Removing a backend that is designated as the leader's backendGroup is not permitted.",
                  },
                  networkEndpoint: {
                    type: "object",
                    properties: {
                      instance: {
                        type: "string",
                        description:
                          "The name of the VM instance of the leader network endpoint. The instance must already be attached to the NEG specified in the haPolicy.leader.backendGroup.  The name must be 1-63 characters long, and comply with RFC1035. Authorization requires the following IAM permission on the specified resource instance: compute.instances.use",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "The network endpoint within the leader.backendGroup that is designated as the leader.  This network endpoint cannot be detached from the NEG specified in the haPolicy.leader.backendGroup until the leader is updated with another network endpoint, or the leader is removed from the haPolicy.",
                  },
                },
                additionalProperties: true,
                description:
                  "Selects one of the network endpoints attached to the backend NEGs of this service as the active endpoint (the leader) that receives all traffic.  When the leader changes, there is no connection draining to persist existing connections on the old leader.  You are responsible for selecting a suitable endpoint as the leader. For example, preferring a healthy endpoint over unhealthy ones. Note that this service does not track backend endpoint health, and selects the configured leader unconditionally.",
              },
            },
            additionalProperties: true,
            description:
              "Configures self-managed High Availability (HA) for External and Internal Protocol Forwarding.  The backends of this regional backend service must only specify zonal network endpoint groups (NEGs) of type GCE_VM_IP.  When haPolicy is set for an Internal Passthrough Network Load Balancer, the regional backend service must set the network field. All zonal NEGs must belong to the same network. However, individual NEGs can belong to different subnetworks of that network.  When haPolicy is specified, the set of attached network endpoints across all backends comprise an High Availability domain from which one endpoint is selected as the active endpoint (the leader) that receives all traffic.  haPolicy can be added only at backend service creation time. Once set up, it cannot be deleted.  Note that haPolicy is not for load balancing, and therefore cannot be specified with sessionAffinity, connectionTrackingPolicy, and failoverPolicy.  haPolicy requires customers to be responsible for tracking backend endpoint health and electing a leader among the healthy endpoints. Therefore, haPolicy cannot be specified with healthChecks.  haPolicy can only be specified for External Passthrough Network Load Balancers and Internal Passthrough Network Load Balancers.",
          },
          required: false,
        },
        healthChecks: {
          name: "Health Checks",
          description:
            "The list of URLs to the healthChecks, httpHealthChecks (legacy), or httpsHealthChecks (legacy) resource for health checking this backend service. Not all backend services support legacy health checks. See Load balancer guide. Currently, at most one health check can be specified for each backend service. Backend services with instance group or zonal NEG backends must have a health check unless haPolicy is specified. Backend services with internet or serverless NEG backends must not have a health check.  healthChecks[] cannot be specified with haPolicy.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of URLs to the healthChecks, httpHealthChecks (legacy), or httpsHealthChecks (legacy) resource for health checking this backend service. Not all backend services support legacy health checks. See Load balancer guide. Currently, at most one health check can be specified for each backend service. Backend services with instance group or zonal NEG backends must have a health check unless haPolicy is specified. Backend services with internet or serverless NEG backends must not have a health check.  healthChecks[] cannot be specified with haPolicy.",
          },
          required: false,
        },
        iap: {
          name: "Iap",
          description:
            "The configurations for Identity-Aware Proxy on this resource. Not available for internal passthrough Network Load Balancers and external passthrough Network Load Balancers.",
          type: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "Whether the serving infrastructure will authenticate and authorize all incoming requests.",
              },
              oauth2ClientId: {
                type: "string",
                description:
                  "OAuth2 client ID to use for the authentication flow.",
              },
              oauth2ClientSecret: {
                type: "string",
                description:
                  "OAuth2 client secret to use for the authentication flow. For security reasons, this value cannot be retrieved via the API. Instead, the SHA-256 hash of the value is returned in the oauth2ClientSecretSha256 field.  @InputOnly",
              },
            },
            description: "Identity-Aware Proxy",
            additionalProperties: true,
          },
          required: false,
        },
        ipAddressSelectionPolicy: {
          name: "Ip Address Selection Policy",
          description:
            "Specifies a preference for traffic sent from the proxy to the backend (or from the client to the backend for proxyless gRPC). The possible values are:     - IPV4_ONLY: Only send IPv4 traffic to the backends of the    backend service (Instance Group, Managed Instance Group, Network Endpoint    Group), regardless of traffic from the client to the proxy. Only IPv4    health checks are used to check the health of the backends. This is the    default setting.    - PREFER_IPV6: Prioritize the connection to the endpoint's    IPv6 address over its IPv4 address (provided there is a healthy IPv6    address).    - IPV6_ONLY: Only send IPv6 traffic to the backends of the    backend service (Instance Group, Managed Instance Group, Network Endpoint    Group), regardless of traffic from the client to the proxy. Only IPv6    health checks are used to check the health of the backends.    This field is applicable to either:     -  Advanced global external Application Load Balancer (load balancing    scheme EXTERNAL_MANAGED),    -  Regional external Application Load    Balancer,    -  Internal proxy Network Load Balancer (load balancing    scheme INTERNAL_MANAGED),    -  Regional internal Application Load    Balancer (load balancing scheme INTERNAL_MANAGED),    -  Traffic    Director with Envoy proxies and proxyless gRPC (load balancing scheme    INTERNAL_SELF_MANAGED). Check the IpAddressSelectionPolicy enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_IP_ADDRESS_SELECTION_POLICY",
              "IPV4_ONLY",
              "IPV6_ONLY",
              "IP_ADDRESS_SELECTION_POLICY_UNSPECIFIED",
              "PREFER_IPV6",
            ],
            description:
              "Specifies a preference for traffic sent from the proxy to the backend (or from the client to the backend for proxyless gRPC). The possible values are:     - IPV4_ONLY: Only send IPv4 traffic to the backends of the    backend service (Instance Group, Managed Instance Group, Network Endpoint    Group), regardless of traffic from the client to the proxy. Only IPv4    health checks are used to check the health of the backends. This is the    default setting.    - PREFER_IPV6: Prioritize the connection to the endpoint's    IPv6 address over its IPv4 address (provided there is a healthy IPv6    address).    - IPV6_ONLY: Only send IPv6 traffic to the backends of the    backend service (Instance Group, Managed Instance Group, Network Endpoint    Group), regardless of traffic from the client to the proxy. Only IPv6    health checks are used to check the health of the backends.    This field is applicable to either:     -  Advanced global external Application Load Balancer (load balancing    scheme EXTERNAL_MANAGED),    -  Regional external Application Load    Balancer,    -  Internal proxy Network Load Balancer (load balancing    scheme INTERNAL_MANAGED),    -  Regional internal Application Load    Balancer (load balancing scheme INTERNAL_MANAGED),    -  Traffic    Director with Envoy proxies and proxyless gRPC (load balancing scheme    INTERNAL_SELF_MANAGED). Check the IpAddressSelectionPolicy enum for the list of possible values.",
          },
          required: false,
        },
        loadBalancingScheme: {
          name: "Load Balancing Scheme",
          description:
            "Specifies the load balancer type. A backend service created for one type of load balancer cannot be used with another. For more information, refer toChoosing a load balancer. Check the LoadBalancingScheme enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_LOAD_BALANCING_SCHEME",
              "EXTERNAL",
              "EXTERNAL_MANAGED",
              "INTERNAL",
              "INTERNAL_MANAGED",
              "INTERNAL_SELF_MANAGED",
              "INVALID_LOAD_BALANCING_SCHEME",
            ],
            description:
              "Specifies the load balancer type. A backend service created for one type of load balancer cannot be used with another. For more information, refer toChoosing a load balancer. Check the LoadBalancingScheme enum for the list of possible values.",
          },
          required: false,
        },
        localityLbPolicies: {
          name: "Locality Lb Policies",
          description:
            "A list of locality load-balancing policies to be used in order of preference. When you use localityLbPolicies, you must set at least one value for either the localityLbPolicies[].policy or the localityLbPolicies[].customPolicy field. localityLbPolicies overrides any value set in the localityLbPolicy field.  For an example of how to use this field, seeDefine a list of preferred policies.  Caution: This field and its children are intended for use in a service mesh that includes gRPC clients only. Envoy proxies can't use backend services that have this configuration.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                customPolicy: {
                  type: "object",
                  properties: {
                    data: {
                      type: "string",
                      description:
                        "An optional, arbitrary JSON object with configuration data, understood by a locally installed custom policy implementation.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Identifies the custom policy.  The value should match the name of a custom implementation registered on the gRPC clients. It should follow protocol buffer message naming conventions and include the full path (for example, myorg.CustomLbPolicy). The maximum length is 256 characters.  Do not specify the same custom policy more than once for a backend. If you do, the configuration is rejected.  For an example of how to use this field, seeUse a custom policy.",
                    },
                  },
                  description:
                    "The configuration for a custom policy implemented by the user and deployed with the client.",
                  additionalProperties: true,
                },
                policy: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      enum: [
                        "UNDEFINED_NAME",
                        "INVALID_LB_POLICY",
                        "LEAST_REQUEST",
                        "MAGLEV",
                        "ORIGINAL_DESTINATION",
                        "RANDOM",
                        "RING_HASH",
                        "ROUND_ROBIN",
                        "WEIGHTED_GCP_RENDEZVOUS",
                        "WEIGHTED_MAGLEV",
                        "WEIGHTED_ROUND_ROBIN",
                      ],
                      description:
                        "The name of a locality load-balancing policy. Valid values include ROUND_ROBIN and, for Java clients, LEAST_REQUEST. For information about these values, see the description of localityLbPolicy.  Do not specify the same policy more than once for a backend. If you do, the configuration is rejected. Check the Name enum for the list of possible values.",
                    },
                  },
                  description:
                    "The configuration for a built-in load balancing policy.",
                  additionalProperties: true,
                },
              },
              description:
                "Container for either a built-in LB policy supported by gRPC or Envoy or a custom one implemented by the end user.",
              additionalProperties: true,
            },
            description:
              "A list of locality load-balancing policies to be used in order of preference. When you use localityLbPolicies, you must set at least one value for either the localityLbPolicies[].policy or the localityLbPolicies[].customPolicy field. localityLbPolicies overrides any value set in the localityLbPolicy field.  For an example of how to use this field, seeDefine a list of preferred policies.  Caution: This field and its children are intended for use in a service mesh that includes gRPC clients only. Envoy proxies can't use backend services that have this configuration.",
          },
          required: false,
        },
        localityLbPolicy: {
          name: "Locality Lb Policy",
          description:
            "The load balancing algorithm used within the scope of the locality. The possible values are:     - ROUND_ROBIN: This is a simple policy in which each healthy    backend is selected in round robin order. This is the default.    - LEAST_REQUEST: An O(1) algorithm which    selects two random healthy hosts and picks the host which has fewer active    requests.    - RING_HASH: The ring/modulo hash load balancer implements    consistent hashing to backends. The algorithm has the property that the    addition/removal of a host from a set of N hosts only affects 1/N of the    requests.    - RANDOM: The load balancer selects a random healthy    host.    - ORIGINAL_DESTINATION: Backend host is selected    based on the client connection metadata, i.e., connections are opened to    the same address as the destination address of the incoming connection    before the connection was redirected to the load balancer.    - MAGLEV: used as a drop in replacement for the ring hash    load balancer. Maglev is not as stable as ring hash but has faster table    lookup build times and host selection times. For more information about    Maglev, see Maglev:    A Fast and Reliable Software Network Load Balancer.    - WEIGHTED_ROUND_ROBIN: Per-endpoint Weighted Round Robin    Load Balancing using weights computed from Backend reported Custom Metrics.    If set, the Backend Service responses are expected to contain non-standard    HTTP response header field Endpoint-Load-Metrics. The reported    metrics to use for computing the weights are specified via thecustomMetrics field.     This field is applicable to either:       - A regional backend service with the service_protocol set to HTTP,       HTTPS, HTTP2 or H2C, and load_balancing_scheme set to       INTERNAL_MANAGED.       - A global backend service with the       load_balancing_scheme set to INTERNAL_SELF_MANAGED, INTERNAL_MANAGED, or       EXTERNAL_MANAGED.      If sessionAffinity is not configured—that is, if session    affinity remains at the default value of NONE—then the    default value for localityLbPolicy    is ROUND_ROBIN. If session affinity is set to a value other    than NONE,    then the default value for localityLbPolicy isMAGLEV.     Only ROUND_ROBIN and RING_HASH are supported    when the backend service is referenced by a URL map that is bound to    target gRPC proxy that has validateForProxyless field set to true.     localityLbPolicy cannot be specified with haPolicy. Check the LocalityLbPolicy enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_LOCALITY_LB_POLICY",
              "INVALID_LB_POLICY",
              "LEAST_REQUEST",
              "MAGLEV",
              "ORIGINAL_DESTINATION",
              "RANDOM",
              "RING_HASH",
              "ROUND_ROBIN",
              "WEIGHTED_GCP_RENDEZVOUS",
              "WEIGHTED_MAGLEV",
              "WEIGHTED_ROUND_ROBIN",
            ],
            description:
              "The load balancing algorithm used within the scope of the locality. The possible values are:     - ROUND_ROBIN: This is a simple policy in which each healthy    backend is selected in round robin order. This is the default.    - LEAST_REQUEST: An O(1) algorithm which    selects two random healthy hosts and picks the host which has fewer active    requests.    - RING_HASH: The ring/modulo hash load balancer implements    consistent hashing to backends. The algorithm has the property that the    addition/removal of a host from a set of N hosts only affects 1/N of the    requests.    - RANDOM: The load balancer selects a random healthy    host.    - ORIGINAL_DESTINATION: Backend host is selected    based on the client connection metadata, i.e., connections are opened to    the same address as the destination address of the incoming connection    before the connection was redirected to the load balancer.    - MAGLEV: used as a drop in replacement for the ring hash    load balancer. Maglev is not as stable as ring hash but has faster table    lookup build times and host selection times. For more information about    Maglev, see Maglev:    A Fast and Reliable Software Network Load Balancer.    - WEIGHTED_ROUND_ROBIN: Per-endpoint Weighted Round Robin    Load Balancing using weights computed from Backend reported Custom Metrics.    If set, the Backend Service responses are expected to contain non-standard    HTTP response header field Endpoint-Load-Metrics. The reported    metrics to use for computing the weights are specified via thecustomMetrics field.     This field is applicable to either:       - A regional backend service with the service_protocol set to HTTP,       HTTPS, HTTP2 or H2C, and load_balancing_scheme set to       INTERNAL_MANAGED.       - A global backend service with the       load_balancing_scheme set to INTERNAL_SELF_MANAGED, INTERNAL_MANAGED, or       EXTERNAL_MANAGED.      If sessionAffinity is not configured—that is, if session    affinity remains at the default value of NONE—then the    default value for localityLbPolicy    is ROUND_ROBIN. If session affinity is set to a value other    than NONE,    then the default value for localityLbPolicy isMAGLEV.     Only ROUND_ROBIN and RING_HASH are supported    when the backend service is referenced by a URL map that is bound to    target gRPC proxy that has validateForProxyless field set to true.     localityLbPolicy cannot be specified with haPolicy. Check the LocalityLbPolicy enum for the list of possible values.",
          },
          required: false,
        },
        logConfig: {
          name: "Log Config",
          description:
            "This field denotes the logging options for the load balancer traffic served by this backend service. If logging is enabled, logs will be exported to Stackdriver.",
          type: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description:
                  "Denotes whether to enable logging for the load balancer traffic served by this backend service. The default value is false.",
              },
              optionalFields: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'This field can only be specified if logging is enabled for this backend service and "logConfig.optionalMode" was set to CUSTOM. Contains a list of optional fields you want to include in the logs. For example: serverInstance, serverGkeDetails.cluster, serverGkeDetails.pod.podNamespace',
              },
              optionalMode: {
                type: "string",
                enum: [
                  "UNDEFINED_OPTIONAL_MODE",
                  "CUSTOM",
                  "EXCLUDE_ALL_OPTIONAL",
                  "INCLUDE_ALL_OPTIONAL",
                ],
                description:
                  "This field can only be specified if logging is enabled for this backend service. Configures whether all, none or a subset of optional fields should be added to the reported logs. One of [INCLUDE_ALL_OPTIONAL, EXCLUDE_ALL_OPTIONAL, CUSTOM]. Default is EXCLUDE_ALL_OPTIONAL. Check the OptionalMode enum for the list of possible values.",
              },
              sampleRate: {
                type: "number",
                description:
                  "This field can only be specified if logging is enabled for this backend service. The value of the field must be in [0, 1]. This configures the sampling rate of requests to the load balancer where 1.0 means all logged requests are reported and 0.0 means no logged requests are reported. The default value is 1.0.",
              },
            },
            description:
              "The available logging options for the load balancer traffic served by this backend service.",
            additionalProperties: true,
          },
          required: false,
        },
        maxStreamDuration: {
          name: "Max Stream Duration",
          description:
            "Specifies the default maximum duration (timeout) for streams to this service. Duration is computed from the beginning of the stream until the response has been completely processed, including all retries. A stream that does not complete in this duration is closed.  If not specified, there will be no timeout limit, i.e. the maximum duration is infinite.  This value can be overridden in the PathMatcher configuration of the UrlMap that references this backend service.  This field is only allowed when the loadBalancingScheme of the backend service is INTERNAL_SELF_MANAGED.",
          type: {
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
          required: false,
        },
        metadatas: {
          name: "Metadatas",
          description:
            "Deployment metadata associated with the resource to be set by a GKE hub controller and read by the backend RCTH",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Deployment metadata associated with the resource to be set by a GKE hub controller and read by the backend RCTH",
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
        network: {
          name: "Network",
          description:
            "The URL of the network to which this backend service belongs.  This field must be set for Internal Passthrough Network Load Balancers when the haPolicy is enabled, and for External Passthrough Network Load Balancers when the haPolicy fastIpMove is enabled.  This field can only be specified when the load balancing scheme is set toINTERNAL, or when the load balancing scheme is set toEXTERNAL and haPolicy fastIpMove is enabled.",
          type: {
            type: "string",
            description:
              "The URL of the network to which this backend service belongs.  This field must be set for Internal Passthrough Network Load Balancers when the haPolicy is enabled, and for External Passthrough Network Load Balancers when the haPolicy fastIpMove is enabled.  This field can only be specified when the load balancing scheme is set toINTERNAL, or when the load balancing scheme is set toEXTERNAL and haPolicy fastIpMove is enabled.",
          },
          required: false,
        },
        networkPassThroughLbTrafficPolicy: {
          name: "Network Pass Through Lb Traffic Policy",
          description:
            "Configures traffic steering properties of internal passthrough Network Load Balancers.  networkPassThroughLbTrafficPolicy cannot be specified with haPolicy.",
          type: {
            type: "object",
            properties: {
              zonalAffinity: {
                type: "object",
                properties: {
                  spillover: {
                    type: "string",
                    enum: [
                      "UNDEFINED_SPILLOVER",
                      "ZONAL_AFFINITY_DISABLED",
                      "ZONAL_AFFINITY_SPILL_CROSS_ZONE",
                      "ZONAL_AFFINITY_STAY_WITHIN_ZONE",
                    ],
                    description:
                      "This field indicates whether zonal affinity is enabled or not. The possible values are:     - ZONAL_AFFINITY_DISABLED: Default Value. Zonal Affinity    is disabled. The load balancer distributes new connections to all    healthy backend endpoints across all zones.    - ZONAL_AFFINITY_STAY_WITHIN_ZONE: Zonal Affinity is    enabled. The load balancer distributes new connections to all healthy    backend endpoints in the local zone only. If there are no healthy    backend endpoints in the local zone, the load balancer distributes    new connections to all backend endpoints in the local zone.    - ZONAL_AFFINITY_SPILL_CROSS_ZONE: Zonal Affinity is    enabled. The load balancer distributes new connections to all healthy    backend endpoints in the local zone only. If there aren't enough    healthy backend endpoints in the local zone, the load balancer    distributes new connections to all healthy backend endpoints across all    zones. Check the Spillover enum for the list of possible values.",
                  },
                  spilloverRatio: {
                    type: "number",
                    description:
                      "The value of the field must be in [0, 1]. When the ratio of the count of healthy backend endpoints in a zone to the count of backend endpoints in that same zone is equal to or above this threshold, the load balancer distributes new connections to all healthy endpoints in the local zone only. When the ratio of the count of healthy backend endpoints in a zone to the count of backend endpoints in that same zone is below this threshold, the load balancer distributes all new connections to all healthy endpoints across all zones.",
                  },
                },
                additionalProperties: true,
                description:
                  "When configured, new connections are load balanced across healthy backend endpoints in the local zone.",
              },
            },
            additionalProperties: true,
            description:
              "Configures traffic steering properties of internal passthrough Network Load Balancers.  networkPassThroughLbTrafficPolicy cannot be specified with haPolicy.",
          },
          required: false,
        },
        outlierDetection: {
          name: "Outlier Detection",
          description:
            "Settings controlling the ejection of unhealthy backend endpoints from the load balancing pool of each individual proxy instance that processes the traffic for the given backend service. If not set, this feature is considered disabled.  Results of the outlier detection algorithm (ejection of endpoints from the load balancing pool and returning them back to the pool) are executed independently by each proxy instance of the load balancer. In most cases, more than one proxy instance handles the traffic received by a backend service. Thus, it is possible that an unhealthy endpoint is detected and ejected by only some of the proxies, and while this happens, other proxies may continue to send requests to the same unhealthy endpoint until they detect and eject the unhealthy endpoint.  Applicable backend endpoints can be:     - VM instances in an Instance Group    - Endpoints in a Zonal NEG (GCE_VM_IP, GCE_VM_IP_PORT)    - Endpoints in a Hybrid Connectivity NEG (NON_GCP_PRIVATE_IP_PORT)    - Serverless NEGs, that resolve to Cloud Run, App Engine, or Cloud    Functions Services    - Private Service Connect NEGs, that resolve to    Google-managed regional API endpoints or managed services published using    Private Service Connect    Applicable backend service types can be:     - A global backend service with the loadBalancingScheme set to    INTERNAL_SELF_MANAGED or EXTERNAL_MANAGED.    - A regional backend    service with the serviceProtocol set to HTTP, HTTPS, HTTP2 or H2C, and    loadBalancingScheme set to INTERNAL_MANAGED or EXTERNAL_MANAGED. Not    supported for Serverless NEGs.    Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
          type: {
            type: "object",
            properties: {
              baseEjectionTime: {
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
              consecutiveErrors: {
                type: "integer",
                description:
                  "Number of consecutive errors before a backend endpoint is ejected from the load balancing pool. When the backend endpoint is accessed over HTTP, a 5xx return code qualifies as an error. Defaults to 5.",
              },
              consecutiveGatewayFailure: {
                type: "integer",
                description:
                  "The number of consecutive gateway failures (502, 503, 504 status or connection errors that are mapped to one of those status codes) before a consecutive gateway failure ejection occurs. Defaults to 3.",
              },
              enforcingConsecutiveErrors: {
                type: "integer",
                description:
                  "The percentage chance that a backend endpoint will be ejected when an outlier status is detected through consecutive 5xx. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 0.",
              },
              enforcingConsecutiveGatewayFailure: {
                type: "integer",
                description:
                  "The percentage chance that a backend endpoint will be ejected when an outlier status is detected through consecutive gateway failures. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100.",
              },
              enforcingSuccessRate: {
                type: "integer",
                description:
                  "The percentage chance that a backend endpoint will be ejected when an outlier status is detected through success rate statistics. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100.  Not supported when the backend service uses Serverless NEG.",
              },
              interval: {
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
              maxEjectionPercent: {
                type: "integer",
                description:
                  "Maximum percentage of backend endpoints in the load balancing pool for the backend service that can be ejected if the ejection conditions are met. Defaults to 50%.",
              },
              successRateMinimumHosts: {
                type: "integer",
                description:
                  "The number of backend endpoints in the load balancing pool that must have enough request volume to detect success rate outliers. If the number of backend endpoints is fewer than this setting, outlier detection via success rate statistics is not performed for any backend endpoint in the load balancing pool. Defaults to 5.  Not supported when the backend service uses Serverless NEG.",
              },
              successRateRequestVolume: {
                type: "integer",
                description:
                  "The minimum number of total requests that must be collected in one interval (as defined by the interval duration above) to include this backend endpoint in success rate based outlier detection. If the volume is lower than this setting, outlier detection via success rate statistics is not performed for that backend endpoint. Defaults to 100.  Not supported when the backend service uses Serverless NEG.",
              },
              successRateStdevFactor: {
                type: "integer",
                description:
                  "This factor is used to determine the ejection threshold for success rate outlier ejection. The ejection threshold is the difference between the mean success rate, and the product of this factor and the standard deviation of the mean success rate: mean - (stdev * successRateStdevFactor). This factor is divided by a thousand to get a double. That is, if the desired factor is 1.9, the runtime value should be 1900. Defaults to 1900.  Not supported when the backend service uses Serverless NEG.",
              },
            },
            description:
              "Settings controlling the eviction of unhealthy hosts from the load balancing pool for the backend service.",
            additionalProperties: true,
          },
          required: false,
        },
        params: {
          name: "Params",
          description:
            "Input only. [Input Only] Additional params passed with the request, but not persisted as part of resource payload.",
          type: {
            type: "object",
            properties: {
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional Backend Service parameters.",
            additionalProperties: true,
          },
          required: false,
        },
        port: {
          name: "Port",
          description:
            "Deprecated in favor of portName. The TCP port to connect on the backend. The default value is 80. For internal passthrough Network Load Balancers and external passthrough Network Load Balancers, omit port.",
          type: {
            type: "integer",
            description:
              "Deprecated in favor of portName. The TCP port to connect on the backend. The default value is 80. For internal passthrough Network Load Balancers and external passthrough Network Load Balancers, omit port.",
          },
          required: false,
        },
        portName: {
          name: "Port Name",
          description:
            "A named port on a backend instance group representing the port for communication to the backend VMs in that group. The named port must be [defined on each backend instance group](https://cloud.google.com/load-balancing/docs/backend-service#named_ports). This parameter has no meaning if the backends are NEGs. For internal passthrough Network Load Balancers and external passthrough Network Load Balancers, omit port_name.",
          type: {
            type: "string",
            description:
              "A named port on a backend instance group representing the port for communication to the backend VMs in that group. The named port must be [defined on each backend instance group](https://cloud.google.com/load-balancing/docs/backend-service#named_ports). This parameter has no meaning if the backends are NEGs. For internal passthrough Network Load Balancers and external passthrough Network Load Balancers, omit port_name.",
          },
          required: false,
        },
        protocol: {
          name: "Protocol",
          description:
            "The protocol this BackendService uses to communicate with backends.  Possible values are HTTP, HTTPS, HTTP2, H2C, TCP, SSL, UDP or GRPC. depending on the chosen load balancer or Traffic Director configuration. Refer to the documentation for the load balancers or for Traffic Director for more information.  Must be set to GRPC when the backend service is referenced by a URL map that is bound to target gRPC proxy. Check the Protocol enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_PROTOCOL",
              "GRPC",
              "H2C",
              "HTTP",
              "HTTP2",
              "HTTPS",
              "SSL",
              "TCP",
              "UDP",
              "UNSPECIFIED",
            ],
            description:
              "The protocol this BackendService uses to communicate with backends.  Possible values are HTTP, HTTPS, HTTP2, H2C, TCP, SSL, UDP or GRPC. depending on the chosen load balancer or Traffic Director configuration. Refer to the documentation for the load balancers or for Traffic Director for more information.  Must be set to GRPC when the backend service is referenced by a URL map that is bound to target gRPC proxy. Check the Protocol enum for the list of possible values.",
          },
          required: false,
        },
        securitySettings: {
          name: "Security Settings",
          description:
            "This field specifies the security settings that apply to this backend service. This field is applicable to a global backend service with the load_balancing_scheme set to INTERNAL_SELF_MANAGED.",
          type: {
            type: "object",
            properties: {
              awsV4Authentication: {
                type: "object",
                properties: {
                  accessKey: {
                    type: "string",
                    description:
                      "The access key used for s3 bucket authentication. Required for updating or creating a backend that uses AWS v4 signature authentication, but will not be returned as part of the configuration when queried with a REST API GET request.  @InputOnly",
                  },
                  accessKeyId: {
                    type: "string",
                    description:
                      "The identifier of an access key used for s3 bucket authentication.",
                  },
                  accessKeyVersion: {
                    type: "string",
                    description:
                      "The optional version identifier for the access key. You can use this to keep track of different iterations of your access key.",
                  },
                  originRegion: {
                    type: "string",
                    description:
                      'The name of the cloud region of your origin. This is a free-form field with the name of the region your cloud uses to host your origin.  For example, "us-east-1" for AWS or "us-ashburn-1" for OCI.',
                  },
                },
                description:
                  "Messages  Contains the configurations necessary to generate a signature for access to private storage buckets that support Signature Version 4 for authentication. The service name for generating the authentication header will always default to 's3'.",
                additionalProperties: true,
              },
              clientTlsPolicy: {
                type: "string",
                description:
                  "Optional. A URL referring to a networksecurity.ClientTlsPolicy resource that describes how clients should authenticate with this service's backends.   clientTlsPolicy only applies to a globalBackendService with the loadBalancingScheme set to INTERNAL_SELF_MANAGED.   If left blank, communications are not encrypted.",
              },
              subjectAltNames: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Optional. A list of Subject Alternative Names (SANs) that the client verifies during a mutual TLS handshake with an server/endpoint for thisBackendService. When the server presents its X.509 certificate to the client, the client inspects the certificate'ssubjectAltName field. If the field contains one of the specified values, the communication continues. Otherwise, it fails. This additional check enables the client to verify that the server is authorized to run the requested service.   Note that the contents of the server certificate's subjectAltName field are configured by the Public Key Infrastructure which provisions server identities.   Only applies to a global BackendService withloadBalancingScheme set to INTERNAL_SELF_MANAGED. Only applies when BackendService has an attachedclientTlsPolicy with clientCertificate (mTLS mode).",
              },
            },
            description:
              "The authentication and authorization settings for a BackendService.",
            additionalProperties: true,
          },
          required: false,
        },
        serviceBindings: {
          name: "Service Bindings",
          description:
            "URLs of networkservices.ServiceBinding resources.  Can only be set if load balancing scheme is INTERNAL_SELF_MANAGED. If set, lists of backends and health checks must be both empty.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs of networkservices.ServiceBinding resources.  Can only be set if load balancing scheme is INTERNAL_SELF_MANAGED. If set, lists of backends and health checks must be both empty.",
          },
          required: false,
        },
        serviceLbPolicy: {
          name: "Service Lb Policy",
          description:
            "URL to networkservices.ServiceLbPolicy resource.  Can only be set if load balancing scheme is EXTERNAL_MANAGED, INTERNAL_MANAGED or INTERNAL_SELF_MANAGED and the scope is global.",
          type: {
            type: "string",
            description:
              "URL to networkservices.ServiceLbPolicy resource.  Can only be set if load balancing scheme is EXTERNAL_MANAGED, INTERNAL_MANAGED or INTERNAL_SELF_MANAGED and the scope is global.",
          },
          required: false,
        },
        sessionAffinity: {
          name: "Session Affinity",
          description:
            "Type of session affinity to use. The default is NONE.  Only NONE and HEADER_FIELD are supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.  For more details, see: [Session Affinity](https://cloud.google.com/load-balancing/docs/backend-service#session_affinity).  sessionAffinity cannot be specified with haPolicy. Check the SessionAffinity enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_SESSION_AFFINITY",
              "CLIENT_IP",
              "CLIENT_IP_NO_DESTINATION",
              "CLIENT_IP_PORT_PROTO",
              "CLIENT_IP_PROTO",
              "GENERATED_COOKIE",
              "HEADER_FIELD",
              "HTTP_COOKIE",
              "NONE",
              "STRONG_COOKIE_AFFINITY",
            ],
            description:
              "Type of session affinity to use. The default is NONE.  Only NONE and HEADER_FIELD are supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.  For more details, see: [Session Affinity](https://cloud.google.com/load-balancing/docs/backend-service#session_affinity).  sessionAffinity cannot be specified with haPolicy. Check the SessionAffinity enum for the list of possible values.",
          },
          required: false,
        },
        strongSessionAffinityCookie: {
          name: "Strong Session Affinity Cookie",
          description:
            "Describes the HTTP cookie used for stateful session affinity. This field is applicable and required if the sessionAffinity is set toSTRONG_COOKIE_AFFINITY.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name of the cookie.",
              },
              path: {
                type: "string",
                description: "Path to set for the cookie.",
              },
              ttl: {
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
            },
            description: "The HTTP cookie used for stateful session affinity.",
            additionalProperties: true,
          },
          required: false,
        },
        subsetting: {
          name: "Subsetting",
          description: "subsetting cannot be specified with haPolicy.",
          type: {
            type: "object",
            properties: {
              policy: {
                type: "string",
                enum: [
                  "UNDEFINED_POLICY",
                  "CONSISTENT_HASH_SUBSETTING",
                  "NONE",
                ],
                description:
                  'An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources.   A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. Principals can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role.  For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).  **JSON example:**  ```     {       "bindings": [         {           "role": "roles/resourcemanager.organizationAdmin",           "members": [             "user:mike@example.com",             "group:admins@example.com",             "domain:google.com",             "serviceAccount:my-project-id@appspot.gserviceaccount.com"           ]         },         {           "role": "roles/resourcemanager.organizationViewer",           "members": [             "user:eve@example.com"           ],           "condition": {             "title": "expirable access",             "description": "Does not grant access after Sep 2020",             "expression": "request.time < timestamp(\'2020-10-01T00:00:00.000Z\')",           }         }       ],       "etag": "BwWWja0YfJA=",       "version": 3     } ```  **YAML example:**  ```     bindings:     - members:       - user:mike@example.com       - group:admins@example.com       - domain:google.com       - serviceAccount:my-project-id@appspot.gserviceaccount.com       role: roles/resourcemanager.organizationAdmin     - members:       - user:eve@example.com       role: roles/resourcemanager.organizationViewer       condition:         title: expirable access         description: Does not grant access after Sep 2020         expression: request.time < timestamp(\'2020-10-01T00:00:00.000Z\')     etag: BwWWja0YfJA=     version: 3 ```  For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).',
              },
            },
            description:
              "Subsetting configuration for this BackendService. Currently this is applicable only for Internal TCP/UDP load balancing, Internal HTTP(S) load balancing and Traffic Director.",
            additionalProperties: true,
          },
          required: false,
        },
        timeoutSec: {
          name: "Timeout Sec",
          description:
            "The backend service timeout has a different meaning depending on the type of load balancer. For more information see, Backend service settings. The default is 30 seconds. The full range of timeout values allowed goes from 1 through 2,147,483,647 seconds.  This value can be overridden in the PathMatcher configuration of the UrlMap that references this backend service.  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true. Instead, use maxStreamDuration.",
          type: {
            type: "integer",
            description:
              "The backend service timeout has a different meaning depending on the type of load balancer. For more information see, Backend service settings. The default is 30 seconds. The full range of timeout values allowed goes from 1 through 2,147,483,647 seconds.  This value can be overridden in the PathMatcher configuration of the UrlMap that references this backend service.  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true. Instead, use maxStreamDuration.",
          },
          required: false,
        },
        tlsSettings: {
          name: "Tls Settings",
          description:
            "Configuration for Backend Authenticated TLS and mTLS. May only be specified when the backend protocol is SSL, HTTPS or HTTP2.",
          type: {
            type: "object",
            properties: {
              authenticationConfig: {
                type: "string",
                description:
                  "Reference to the BackendAuthenticationConfig resource from the networksecurity.googleapis.com namespace. Can be used in authenticating TLS connections to the backend, as specified by the authenticationMode field. Can only be specified if authenticationMode is not NONE.",
              },
              sni: {
                type: "string",
                description:
                  "Server Name Indication - see RFC3546 section 3.1. If set, the load balancer sends this string as the SNI hostname in the TLS connection to the backend, and requires that this string match a Subject Alternative Name (SAN) in the backend's server certificate. With a Regional Internet NEG backend, if the SNI is specified here, the load balancer uses it regardless of whether the Regional Internet NEG is specified with FQDN or IP address and port. When both sni and subjectAltNames[] are specified, the load balancer matches the backend certificate's SAN only to subjectAltNames[].",
              },
              subjectAltNames: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    dnsName: {
                      type: "string",
                      description: "The SAN specified as a DNS Name.",
                    },
                    uniformResourceIdentifier: {
                      type: "string",
                      description: "The SAN specified as a URI.",
                    },
                  },
                  description:
                    "A Subject Alternative Name that the load balancer matches against the SAN field in the TLS certificate provided by the backend, specified as either a DNS name or a URI, in accordance with RFC 5280 4.2.1.6",
                  additionalProperties: true,
                },
                description:
                  "A list of Subject Alternative Names (SANs) that the Load Balancer verifies during a TLS handshake with the backend. When the server presents its X.509 certificate to the Load Balancer, the Load Balancer inspects the certificate's SAN field, and requires that at least one SAN match one of the subjectAltNames in the list. This field is limited to 5 entries. When both sni and subjectAltNames[] are specified, the load balancer matches the backend certificate's SAN only to subjectAltNames[].",
              },
            },
            additionalProperties: true,
            description:
              "Configuration for Backend Authenticated TLS and mTLS. May only be specified when the backend protocol is SSL, HTTPS or HTTP2.",
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
        if (input.event.inputConfig.backendService !== undefined)
          pathParams["backend_service"] = String(
            input.event.inputConfig.backendService,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.affinityCookieTtlSec !== undefined)
          body.affinityCookieTtlSec =
            input.event.inputConfig.affinityCookieTtlSec;
        if (input.event.inputConfig.backends !== undefined)
          body.backends = input.event.inputConfig.backends;
        if (input.event.inputConfig.cdnPolicy !== undefined)
          body.cdnPolicy = input.event.inputConfig.cdnPolicy;
        if (input.event.inputConfig.circuitBreakers !== undefined)
          body.circuitBreakers = input.event.inputConfig.circuitBreakers;
        if (input.event.inputConfig.compressionMode !== undefined)
          body.compressionMode = input.event.inputConfig.compressionMode;
        if (input.event.inputConfig.connectionDraining !== undefined)
          body.connectionDraining = input.event.inputConfig.connectionDraining;
        if (input.event.inputConfig.connectionTrackingPolicy !== undefined)
          body.connectionTrackingPolicy =
            input.event.inputConfig.connectionTrackingPolicy;
        if (input.event.inputConfig.consistentHash !== undefined)
          body.consistentHash = input.event.inputConfig.consistentHash;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.customMetrics !== undefined)
          body.customMetrics = input.event.inputConfig.customMetrics;
        if (input.event.inputConfig.customRequestHeaders !== undefined)
          body.customRequestHeaders =
            input.event.inputConfig.customRequestHeaders;
        if (input.event.inputConfig.customResponseHeaders !== undefined)
          body.customResponseHeaders =
            input.event.inputConfig.customResponseHeaders;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.edgeSecurityPolicy !== undefined)
          body.edgeSecurityPolicy = input.event.inputConfig.edgeSecurityPolicy;
        if (input.event.inputConfig.enableCDN !== undefined)
          body.enableCDN = input.event.inputConfig.enableCDN;
        if (input.event.inputConfig.externalManagedMigrationState !== undefined)
          body.externalManagedMigrationState =
            input.event.inputConfig.externalManagedMigrationState;
        if (
          input.event.inputConfig.externalManagedMigrationTestingPercentage !==
          undefined
        )
          body.externalManagedMigrationTestingPercentage =
            input.event.inputConfig.externalManagedMigrationTestingPercentage;
        if (input.event.inputConfig.failoverPolicy !== undefined)
          body.failoverPolicy = input.event.inputConfig.failoverPolicy;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.haPolicy !== undefined)
          body.haPolicy = input.event.inputConfig.haPolicy;
        if (input.event.inputConfig.healthChecks !== undefined)
          body.healthChecks = input.event.inputConfig.healthChecks;
        if (input.event.inputConfig.iap !== undefined)
          body.iap = input.event.inputConfig.iap;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.ipAddressSelectionPolicy !== undefined)
          body.ipAddressSelectionPolicy =
            input.event.inputConfig.ipAddressSelectionPolicy;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.loadBalancingScheme !== undefined)
          body.loadBalancingScheme =
            input.event.inputConfig.loadBalancingScheme;
        if (input.event.inputConfig.localityLbPolicies !== undefined)
          body.localityLbPolicies = input.event.inputConfig.localityLbPolicies;
        if (input.event.inputConfig.localityLbPolicy !== undefined)
          body.localityLbPolicy = input.event.inputConfig.localityLbPolicy;
        if (input.event.inputConfig.logConfig !== undefined)
          body.logConfig = input.event.inputConfig.logConfig;
        if (input.event.inputConfig.maxStreamDuration !== undefined)
          body.maxStreamDuration = input.event.inputConfig.maxStreamDuration;
        if (input.event.inputConfig.metadatas !== undefined)
          body.metadatas = input.event.inputConfig.metadatas;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.network !== undefined)
          body.network = input.event.inputConfig.network;
        if (
          input.event.inputConfig.networkPassThroughLbTrafficPolicy !==
          undefined
        )
          body.networkPassThroughLbTrafficPolicy =
            input.event.inputConfig.networkPassThroughLbTrafficPolicy;
        if (input.event.inputConfig.outlierDetection !== undefined)
          body.outlierDetection = input.event.inputConfig.outlierDetection;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.port !== undefined)
          body.port = input.event.inputConfig.port;
        if (input.event.inputConfig.portName !== undefined)
          body.portName = input.event.inputConfig.portName;
        if (input.event.inputConfig.protocol !== undefined)
          body.protocol = input.event.inputConfig.protocol;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.securityPolicy !== undefined)
          body.securityPolicy = input.event.inputConfig.securityPolicy;
        if (input.event.inputConfig.securitySettings !== undefined)
          body.securitySettings = input.event.inputConfig.securitySettings;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.serviceBindings !== undefined)
          body.serviceBindings = input.event.inputConfig.serviceBindings;
        if (input.event.inputConfig.serviceLbPolicy !== undefined)
          body.serviceLbPolicy = input.event.inputConfig.serviceLbPolicy;
        if (input.event.inputConfig.sessionAffinity !== undefined)
          body.sessionAffinity = input.event.inputConfig.sessionAffinity;
        if (input.event.inputConfig.strongSessionAffinityCookie !== undefined)
          body.strongSessionAffinityCookie =
            input.event.inputConfig.strongSessionAffinityCookie;
        if (input.event.inputConfig.subsetting !== undefined)
          body.subsetting = input.event.inputConfig.subsetting;
        if (input.event.inputConfig.timeoutSec !== undefined)
          body.timeoutSec = input.event.inputConfig.timeoutSec;
        if (input.event.inputConfig.tlsSettings !== undefined)
          body.tlsSettings = input.event.inputConfig.tlsSettings;
        if (input.event.inputConfig.usedBy !== undefined)
          body.usedBy = input.event.inputConfig.usedBy;

        const result = await computeFetch({
          config: input.app.config,
          method: "PUT",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/backendServices/{backend_service}",
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

export default regionBackendServicesUpdate;
