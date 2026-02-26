import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Backend Buckets - Get",
  description: `Returns the specified Zone resource.`,
  category: "Backend Buckets",
  inputs: {
    default: {
      config: {
        backendBucket: {
          name: "Backend Bucket",
          description: "Name of the BackendBucket resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.backendBucket !== undefined)
          pathParams["backend_bucket"] = String(
            input.event.inputConfig.backendBucket,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/backendBuckets/{backend_bucket}",
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
          bucketName: {
            type: "string",
            description: "Cloud Storage bucket name.",
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
                  includeHttpHeaders: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Allows HTTP request headers (by name) to be used in the cache key.",
                  },
                  queryStringWhitelist: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Names of query string parameters to include in cache keys. Default parameters are always included. '&' and '=' will be percent encoded and not treated as delimiters.",
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
              "Message containing Cloud CDN configuration for a backend bucket.",
            additionalProperties: true,
          },
          compressionMode: {
            type: "string",
            description:
              "Compress text responses using Brotli or gzip compression, based on the client's Accept-Encoding header. Check the CompressionMode enum for the list of possible values.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339 text format.",
          },
          customResponseHeaders: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the Application Load Balancer should add to proxied responses.",
          },
          description: {
            type: "string",
            description:
              "An optional textual description of the resource; provided by the client when the resource is created.",
          },
          edgeSecurityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the edge security policy associated with this backend bucket.",
          },
          enableCdn: {
            type: "boolean",
            description: "If true, enable Cloud CDN for this BackendBucket.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description: "Output only. Type of the resource.",
          },
          loadBalancingScheme: {
            type: "string",
            description:
              "The value can only be INTERNAL_MANAGED for cross-region internal layer 7 load balancer.  If loadBalancingScheme is not specified, the backend bucket can be used by classic global external load balancers, or global application external load balancers, or both. Check the LoadBalancingScheme enum for the list of possible values.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
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
            description: "Additional Backend Bucket parameters.",
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          usedBy: {
            type: "array",
            items: {
              type: "object",
              properties: {
                reference: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for UrlMaps referencing that BackendBucket.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] List of resources referencing that backend bucket.",
          },
        },
        description:
          "Represents a Cloud Storage Bucket resource.  This Cloud Storage bucket resource is referenced by a URL map of a load balancer. For more information, readBackend Buckets.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
