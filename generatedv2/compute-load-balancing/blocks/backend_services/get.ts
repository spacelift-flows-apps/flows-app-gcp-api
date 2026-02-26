import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Backend Services - Get",
  description: `Returns the specified Zone resource.`,
  category: "Backend Services",
  inputs: {
    default: {
      config: {
        backendService: {
          name: "Backend Service",
          description: "Name of the BackendService resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.backendService !== undefined)
          pathParams["backend_service"] = String(
            input.event.inputConfig.backendService,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/backendServices/{backend_service}",
          pathParams,
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
          affinityCookieTtlSec: {
            type: "integer",
            description:
              "Lifetime of cookies in seconds. This setting is applicable to Application Load Balancers and Traffic Director and requires GENERATED_COOKIE or HTTP_COOKIE session affinity.  If set to 0, the cookie is non-persistent and lasts only until the end of the browser session (or equivalent). The maximum allowed value is two weeks (1,209,600).  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.",
          },
          backends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                balancingMode: {
                  type: "string",
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
          cdnPolicy: {
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
              signedUrlKeyNames: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "[Output Only] Names of the keys for signing request URLs.",
              },
            },
            description:
              "Message containing Cloud CDN configuration for a backend service.",
            additionalProperties: true,
          },
          circuitBreakers: {
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
          compressionMode: {
            type: "string",
            description:
              "Compress text responses using Brotli or gzip compression, based on the client's Accept-Encoding header. Check the CompressionMode enum for the list of possible values.",
          },
          connectionDraining: {
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
          connectionTrackingPolicy: {
            type: "object",
            properties: {
              connectionPersistenceOnUnhealthyBackends: {
                type: "string",
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
                description:
                  "Specifies the key used for connection tracking. There are two options:     - PER_CONNECTION: This is the default mode. The Connection    Tracking is performed as per the Connection Key (default Hash Method) for    the specific protocol.    - PER_SESSION: The Connection Tracking is performed as per    the configured Session Affinity. It matches the configured Session    Affinity.    For more details, see [Tracking Mode for Network Load Balancing](https://cloud.google.com/load-balancing/docs/network/networklb-backend-service#tracking-mode) and [Tracking Mode for Internal TCP/UDP Load Balancing](https://cloud.google.com/load-balancing/docs/internal#tracking-mode). Check the TrackingMode enum for the list of possible values.",
              },
            },
            description:
              "Connection Tracking configuration for this BackendService.",
            additionalProperties: true,
          },
          consistentHash: {
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
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          customMetrics: {
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
          customRequestHeaders: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the load balancer adds to proxied requests. See [Creating custom headers](https://cloud.google.com/load-balancing/docs/custom-headers).",
          },
          customResponseHeaders: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the load balancer adds to proxied responses. See [Creating custom headers](https://cloud.google.com/load-balancing/docs/custom-headers).",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          edgeSecurityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the edge security policy associated with this backend service.",
          },
          enableCDN: {
            type: "boolean",
            description:
              "If true, enables Cloud CDN for the backend service of a global external Application Load Balancer.",
          },
          externalManagedMigrationState: {
            type: "string",
            description:
              "Specifies the canary migration state. Possible values are PREPARE, TEST_BY_PERCENTAGE, and TEST_ALL_TRAFFIC.  To begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be changed to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before the loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate traffic by percentage using externalManagedMigrationTestingPercentage.  Rolling back a migration requires the states to be set in reverse order. So changing the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to be set to TEST_ALL_TRAFFIC at the same time. Optionally, the TEST_BY_PERCENTAGE state can be used to migrate some traffic back to EXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL. Check the ExternalManagedMigrationState enum for the list of possible values.",
          },
          externalManagedMigrationTestingPercentage: {
            type: "number",
            description:
              "Determines the fraction of requests that should be processed by the Global external Application Load Balancer.  The value of this field must be in the range [0, 100].  Session affinity options will slightly affect this routing behavior, for more details, see:Session Affinity.  This value can only be set if the loadBalancingScheme in the BackendService is set to EXTERNAL (when using the classic Application Load Balancer) and the migration state is TEST_BY_PERCENTAGE.",
          },
          failoverPolicy: {
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
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a BackendService. An up-to-date fingerprint must be provided in order to update the BackendService, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a BackendService.",
          },
          haPolicy: {
            type: "object",
            properties: {
              fastIPMove: {
                type: "string",
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
          healthChecks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of URLs to the healthChecks, httpHealthChecks (legacy), or httpsHealthChecks (legacy) resource for health checking this backend service. Not all backend services support legacy health checks. See Load balancer guide. Currently, at most one health check can be specified for each backend service. Backend services with instance group or zonal NEG backends must have a health check unless haPolicy is specified. Backend services with internet or serverless NEG backends must not have a health check.  healthChecks[] cannot be specified with haPolicy.",
          },
          iap: {
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
              oauth2ClientSecretSha256: {
                type: "string",
                description:
                  "Output only. [Output Only] SHA256 hash value for the field oauth2_client_secret above.",
              },
            },
            description: "Identity-Aware Proxy",
            additionalProperties: true,
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          ipAddressSelectionPolicy: {
            type: "string",
            description:
              "Specifies a preference for traffic sent from the proxy to the backend (or from the client to the backend for proxyless gRPC). The possible values are:     - IPV4_ONLY: Only send IPv4 traffic to the backends of the    backend service (Instance Group, Managed Instance Group, Network Endpoint    Group), regardless of traffic from the client to the proxy. Only IPv4    health checks are used to check the health of the backends. This is the    default setting.    - PREFER_IPV6: Prioritize the connection to the endpoint's    IPv6 address over its IPv4 address (provided there is a healthy IPv6    address).    - IPV6_ONLY: Only send IPv6 traffic to the backends of the    backend service (Instance Group, Managed Instance Group, Network Endpoint    Group), regardless of traffic from the client to the proxy. Only IPv6    health checks are used to check the health of the backends.    This field is applicable to either:     -  Advanced global external Application Load Balancer (load balancing    scheme EXTERNAL_MANAGED),    -  Regional external Application Load    Balancer,    -  Internal proxy Network Load Balancer (load balancing    scheme INTERNAL_MANAGED),    -  Regional internal Application Load    Balancer (load balancing scheme INTERNAL_MANAGED),    -  Traffic    Director with Envoy proxies and proxyless gRPC (load balancing scheme    INTERNAL_SELF_MANAGED). Check the IpAddressSelectionPolicy enum for the list of possible values.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#backendService for backend services.",
          },
          loadBalancingScheme: {
            type: "string",
            description:
              "Specifies the load balancer type. A backend service created for one type of load balancer cannot be used with another. For more information, refer toChoosing a load balancer. Check the LoadBalancingScheme enum for the list of possible values.",
          },
          localityLbPolicies: {
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
          localityLbPolicy: {
            type: "string",
            description:
              "The load balancing algorithm used within the scope of the locality. The possible values are:     - ROUND_ROBIN: This is a simple policy in which each healthy    backend is selected in round robin order. This is the default.    - LEAST_REQUEST: An O(1) algorithm which    selects two random healthy hosts and picks the host which has fewer active    requests.    - RING_HASH: The ring/modulo hash load balancer implements    consistent hashing to backends. The algorithm has the property that the    addition/removal of a host from a set of N hosts only affects 1/N of the    requests.    - RANDOM: The load balancer selects a random healthy    host.    - ORIGINAL_DESTINATION: Backend host is selected    based on the client connection metadata, i.e., connections are opened to    the same address as the destination address of the incoming connection    before the connection was redirected to the load balancer.    - MAGLEV: used as a drop in replacement for the ring hash    load balancer. Maglev is not as stable as ring hash but has faster table    lookup build times and host selection times. For more information about    Maglev, see Maglev:    A Fast and Reliable Software Network Load Balancer.    - WEIGHTED_ROUND_ROBIN: Per-endpoint Weighted Round Robin    Load Balancing using weights computed from Backend reported Custom Metrics.    If set, the Backend Service responses are expected to contain non-standard    HTTP response header field Endpoint-Load-Metrics. The reported    metrics to use for computing the weights are specified via thecustomMetrics field.     This field is applicable to either:       - A regional backend service with the service_protocol set to HTTP,       HTTPS, HTTP2 or H2C, and load_balancing_scheme set to       INTERNAL_MANAGED.       - A global backend service with the       load_balancing_scheme set to INTERNAL_SELF_MANAGED, INTERNAL_MANAGED, or       EXTERNAL_MANAGED.      If sessionAffinity is not configured—that is, if session    affinity remains at the default value of NONE—then the    default value for localityLbPolicy    is ROUND_ROBIN. If session affinity is set to a value other    than NONE,    then the default value for localityLbPolicy isMAGLEV.     Only ROUND_ROBIN and RING_HASH are supported    when the backend service is referenced by a URL map that is bound to    target gRPC proxy that has validateForProxyless field set to true.     localityLbPolicy cannot be specified with haPolicy. Check the LocalityLbPolicy enum for the list of possible values.",
          },
          logConfig: {
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
          metadatas: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Deployment metadata associated with the resource to be set by a GKE hub controller and read by the backend RCTH",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          network: {
            type: "string",
            description:
              "The URL of the network to which this backend service belongs.  This field must be set for Internal Passthrough Network Load Balancers when the haPolicy is enabled, and for External Passthrough Network Load Balancers when the haPolicy fastIpMove is enabled.  This field can only be specified when the load balancing scheme is set toINTERNAL, or when the load balancing scheme is set toEXTERNAL and haPolicy fastIpMove is enabled.",
          },
          networkPassThroughLbTrafficPolicy: {
            type: "object",
            properties: {
              zonalAffinity: {
                type: "object",
                properties: {
                  spillover: {
                    type: "string",
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
          outlierDetection: {
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
          params: {
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
          port: {
            type: "integer",
            description:
              "Deprecated in favor of portName. The TCP port to connect on the backend. The default value is 80. For internal passthrough Network Load Balancers and external passthrough Network Load Balancers, omit port.",
          },
          portName: {
            type: "string",
            description:
              "A named port on a backend instance group representing the port for communication to the backend VMs in that group. The named port must be [defined on each backend instance group](https://cloud.google.com/load-balancing/docs/backend-service#named_ports). This parameter has no meaning if the backends are NEGs. For internal passthrough Network Load Balancers and external passthrough Network Load Balancers, omit port_name.",
          },
          protocol: {
            type: "string",
            description:
              "The protocol this BackendService uses to communicate with backends.  Possible values are HTTP, HTTPS, HTTP2, H2C, TCP, SSL, UDP or GRPC. depending on the chosen load balancer or Traffic Director configuration. Refer to the documentation for the load balancers or for Traffic Director for more information.  Must be set to GRPC when the backend service is referenced by a URL map that is bound to target gRPC proxy. Check the Protocol enum for the list of possible values.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the regional backend service resides. This field is not applicable to global backend services. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          securityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the security policy associated with this backend service.",
          },
          securitySettings: {
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
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          serviceBindings: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs of networkservices.ServiceBinding resources.  Can only be set if load balancing scheme is INTERNAL_SELF_MANAGED. If set, lists of backends and health checks must be both empty.",
          },
          serviceLbPolicy: {
            type: "string",
            description:
              "URL to networkservices.ServiceLbPolicy resource.  Can only be set if load balancing scheme is EXTERNAL_MANAGED, INTERNAL_MANAGED or INTERNAL_SELF_MANAGED and the scope is global.",
          },
          sessionAffinity: {
            type: "string",
            description:
              "Type of session affinity to use. The default is NONE.  Only NONE and HEADER_FIELD are supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true.  For more details, see: [Session Affinity](https://cloud.google.com/load-balancing/docs/backend-service#session_affinity).  sessionAffinity cannot be specified with haPolicy. Check the SessionAffinity enum for the list of possible values.",
          },
          strongSessionAffinityCookie: {
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
          subsetting: {
            type: "object",
            properties: {
              policy: {
                type: "string",
                description:
                  "Check the Policy enum for the list of possible values.",
              },
            },
            description:
              "Subsetting configuration for this BackendService. Currently this is applicable only for Internal TCP/UDP load balancing, Internal HTTP(S) load balancing and Traffic Director.",
            additionalProperties: true,
          },
          timeoutSec: {
            type: "integer",
            description:
              "The backend service timeout has a different meaning depending on the type of load balancer. For more information see, Backend service settings. The default is 30 seconds. The full range of timeout values allowed goes from 1 through 2,147,483,647 seconds.  This value can be overridden in the PathMatcher configuration of the UrlMap that references this backend service.  Not supported when the backend service is referenced by a URL map that is bound to target gRPC proxy that has validateForProxyless field set to true. Instead, use maxStreamDuration.",
          },
          tlsSettings: {
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
          usedBy: {
            type: "array",
            items: {
              type: "object",
              properties: {
                reference: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for resources referencing given BackendService like UrlMaps, TargetTcpProxies, TargetSslProxies and ForwardingRule.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] List of resources referencing given backend service.",
          },
        },
        description:
          "Represents a Backend Service resource.  A backend service defines how Google Cloud load balancers distribute traffic. The backend service configuration contains a set of values, such as the protocol used to connect to backends, various distribution and session settings, health checks, and timeouts. These settings provide fine-grained control over how your load balancer behaves. Most of the settings have default values that allow for easy configuration if you need to get started quickly.  Backend services in Google Compute Engine can be either regionally or globally scoped.  * [Global](https://cloud.google.com/compute/docs/reference/rest/v1/backendServices) * [Regional](https://cloud.google.com/compute/docs/reference/rest/v1/regionBackendServices)  For more information, seeBackend Services.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
