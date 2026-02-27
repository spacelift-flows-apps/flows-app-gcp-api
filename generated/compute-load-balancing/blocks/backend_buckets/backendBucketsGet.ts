import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const backendBucketsGet: AppBlock = {
  name: "Backend Buckets - Get",
  description: `Returns the specified BackendBucket resource.`,
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
              "https://www.googleapis.com/auth/compute.readonly",
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
        let path = `projects/{project}/global/backendBuckets/{backendBucket}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

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
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          description: {
            type: "string",
            description:
              "An optional textual description of the resource; provided by the client\nwhen the resource is created.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server. (Format: uint64)",
          },
          enableCdn: {
            type: "boolean",
            description: "If true, enable Cloud CDN for this BackendBucket.",
          },
          edgeSecurityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the edge security policy associated with\nthis backend bucket.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          customResponseHeaders: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the Application Load Balancer should add to proxied responses.",
          },
          kind: {
            type: "string",
            description: "Type of the resource.",
          },
          compressionMode: {
            type: "string",
            enum: ["AUTOMATIC", "DISABLED"],
            description:
              "Compress text responses using Brotli or gzip compression, based on\nthe client's Accept-Encoding header.",
          },
          cdnPolicy: {
            type: "object",
            properties: {
              requestCoalescing: {
                type: "boolean",
                description:
                  "If true then Cloud CDN will combine multiple concurrent cache fill\nrequests into a small number of requests to the origin.",
              },
              negativeCaching: {
                type: "boolean",
                description:
                  "Negative caching allows per-status code TTLs to be set, in order\nto apply fine-grained caching for common errors or redirects.\nThis can reduce the load on your origin and improve end-user\nexperience by reducing response latency.\nWhen the cache mode is set to CACHE_ALL_STATIC or USE_ORIGIN_HEADERS,\nnegative caching applies to responses with the specified response code\nthat lack any Cache-Control, Expires, or Pragma: no-cache directives.\nWhen the cache mode is set to FORCE_CACHE_ALL, negative caching applies\nto all responses with the specified response code, and override any\ncaching headers.\nBy default, Cloud CDN will apply the following default TTLs to these\nstatus codes:\nHTTP 300 (Multiple Choice), 301, 308 (Permanent Redirects): 10m\nHTTP 404 (Not Found), 410 (Gone),\n451 (Unavailable For Legal Reasons): 120s\nHTTP 405 (Method Not Found), 501 (Not Implemented): 60s.\nThese defaults can be overridden in negative_caching_policy.",
              },
              cacheMode: {
                type: "string",
                enum: [
                  "CACHE_ALL_STATIC",
                  "FORCE_CACHE_ALL",
                  "INVALID_CACHE_MODE",
                  "USE_ORIGIN_HEADERS",
                ],
                description:
                  'Specifies the cache setting for all responses from this backend.\nThe possible values are:USE_ORIGIN_HEADERS Requires the origin to set valid caching\nheaders to cache content. Responses without these headers will not be\ncached at Google\'s edge, and will require a full trip to the origin on\nevery request, potentially impacting performance and increasing load on\nthe origin server.FORCE_CACHE_ALL Cache all content, ignoring any "private",\n"no-store" or "no-cache" directives in Cache-Control response headers.\nWarning: this may result in Cloud CDN caching private,\nper-user (user identifiable) content.CACHE_ALL_STATIC Automatically cache static content,\nincluding common image formats, media (video and audio), and web assets\n(JavaScript and CSS). Requests and responses that are marked as\nuncacheable, as well as dynamic content (including HTML), will not be\ncached.\n\nIf no value is provided for cdnPolicy.cacheMode, it defaults\nto CACHE_ALL_STATIC.',
              },
              clientTtl: {
                type: "integer",
                description:
                  'Specifies a separate client (e.g. browser client) maximum TTL. This is\nused to clamp the max-age (or Expires) value sent to the client.  With\nFORCE_CACHE_ALL, the lesser of client_ttl and default_ttl is used for the\nresponse max-age directive, along with a "public" directive.  For\ncacheable content in CACHE_ALL_STATIC mode, client_ttl clamps the max-age\nfrom the origin (if specified), or else sets the response max-age\ndirective to the lesser of the client_ttl and default_ttl, and also\nensures a "public" cache-control directive is present.\nIf a client TTL is not specified, a default value (1 hour) will be used.\nThe maximum allowed value is 31,622,400s (1 year). (Format: int32)',
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
                      "Names of query string parameters to include in cache keys. Default\nparameters are always included. '&' and '=' will be percent encoded\nand not treated as delimiters.",
                  },
                },
                description:
                  "Message containing what to include in the cache key for a request for\nCloud CDN.",
                additionalProperties: true,
              },
              maxTtl: {
                type: "integer",
                description:
                  'Specifies the maximum allowed TTL for cached content served by this\norigin.\nCache directives that attempt to set a max-age or s-maxage higher than\nthis, or an Expires header more than maxTTL seconds in the future will\nbe capped at the value of maxTTL, as if it were the value of an\ns-maxage Cache-Control directive.\nHeaders sent to the client will not be modified.\nSetting a TTL of "0" means "always revalidate".\nThe maximum allowed value is 31,622,400s (1 year), noting that\ninfrequently accessed objects may be evicted from the cache before\nthe defined TTL. (Format: int32)',
              },
              defaultTtl: {
                type: "integer",
                description:
                  'Specifies the default TTL for cached content served by this origin for\nresponses that do not have an existing valid TTL (max-age or s-maxage).\nSetting a TTL of "0" means "always revalidate".\nThe value of defaultTTL cannot be set to a value greater than that of\nmaxTTL, but can be equal.\nWhen the cacheMode is set to FORCE_CACHE_ALL, the defaultTTL\nwill overwrite the TTL set in all responses. The maximum allowed value is\n31,622,400s (1 year), noting that infrequently accessed objects may be\nevicted from the cache before the defined TTL. (Format: int32)',
              },
              signedUrlCacheMaxAgeSec: {
                type: "string",
                description:
                  'Maximum number of seconds the response to a signed URL request will be\nconsidered fresh. After this time period, the response will be\nrevalidated before being served. Defaults to 1hr (3600s).  When serving\nresponses to signed URL requests, Cloud CDN will internally behave as\nthough all responses from this backend had a "Cache-Control:\npublic, max-age=[TTL]" header, regardless of any existing\nCache-Control header. The actual headers served in responses will not be\naltered. (Format: int64)',
              },
              negativeCachingPolicy: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ttl: {
                      type: "integer",
                      description:
                        "The TTL (in seconds) for which to cache responses with the\ncorresponding status code.\nThe maximum allowed value is 1800s (30 minutes), noting that\ninfrequently accessed objects may be evicted from the cache before the\ndefined TTL. (Format: int32)",
                    },
                    code: {
                      type: "integer",
                      description:
                        "The HTTP status code to define a TTL against. Only HTTP status codes\n300, 301, 302, 307, 308, 404, 405, 410, 421, 451 and 501 can be\nspecified as values, and you cannot specify a status code more than\nonce. (Format: int32)",
                    },
                  },
                  description: "Specify CDN TTLs for response error codes.",
                  additionalProperties: true,
                },
                description:
                  "Sets a cache TTL for the specified HTTP status code.\nnegative_caching must be enabled to configure negative_caching_policy.\nOmitting the policy and leaving negative_caching enabled will use\nCloud CDN's default cache TTLs.\nNote that when specifying an explicit negative_caching_policy, you\nshould take care to specify a cache TTL for all response codes\nthat you wish to cache. Cloud CDN will not apply any default\nnegative caching when a policy exists.",
              },
              serveWhileStale: {
                type: "integer",
                description:
                  'Serve existing content from the cache (if available) when revalidating\ncontent with the origin, or when an error is encountered when refreshing\nthe cache.\nThis setting defines the default "max-stale" duration for any cached\nresponses that do not specify a max-stale directive. Stale responses that\nexceed the TTL configured here will not be served. The default limit\n(max-stale) is 86400s (1 day), which will allow stale content to be\nserved up to this limit beyond the max-age (or s-maxage) of a cached\nresponse.\nThe maximum allowed value is 604800 (1 week).\nSet this to zero (0) to disable serve-while-stale. (Format: int32)',
              },
              bypassCacheOnRequestHeaders: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    headerName: {
                      type: "string",
                      description:
                        "The header field name to match on when bypassing cache.\nValues are case-insensitive.",
                    },
                  },
                  description:
                    "Bypass the cache when the specified request headers are present,\ne.g. Pragma or Authorization headers. Values are case insensitive.\nThe presence of such a header overrides the cache_mode setting.",
                  additionalProperties: true,
                },
                description:
                  "Bypass the cache when the specified request headers are matched - e.g.\nPragma or Authorization headers. Up to 5 headers can be specified.\nThe cache is bypassed for all cdnPolicy.cacheMode settings.",
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
          bucketName: {
            type: "string",
            description: "Cloud Storage bucket name.",
          },
          loadBalancingScheme: {
            type: "string",
            enum: ["INTERNAL_MANAGED"],
            description:
              "The value can only be INTERNAL_MANAGED for cross-region internal layer 7\nload balancer.\n\nIf loadBalancingScheme is not specified, the backend bucket can be used by\nclassic global external load balancers, or global application external load\nbalancers, or both.",
          },
          usedBy: {
            type: "array",
            items: {
              type: "object",
              properties: {
                reference: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for UrlMaps referencing that\nBackendBucket.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] List of resources referencing that backend bucket.",
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
                  'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional Backend Bucket parameters.",
            additionalProperties: true,
          },
        },
        description:
          "Represents a Cloud Storage Bucket resource.\n\nThis Cloud Storage bucket resource is referenced by a URL map of a load\nbalancer. For more information, readBackend Buckets.",
        additionalProperties: true,
      },
    },
  },
};

export default backendBucketsGet;
