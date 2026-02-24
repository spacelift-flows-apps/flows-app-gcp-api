import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const backendBucketsPatch: AppBlock = {
  name: "Backend Buckets - Patch",
  description: `Updates the specified BackendBucket resource with the data included in the request.`,
  category: "Backend Buckets",
  inputs: {
    default: {
      config: {
        backendBucket: {
          name: "Backend Bucket",
          description: "Name of the BackendBucket resource to patch.",
          type: {
            type: "string",
          },
          required: true,
        },
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
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
        description: {
          name: "Description",
          description:
            "An optional textual description of the resource; provided by the client when the resource is created.",
          type: {
            type: "string",
            description:
              "An optional textual description of the resource; provided by the client\nwhen the resource is created.",
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
        id: {
          name: "ID",
          description:
            "[Output Only] Unique identifier for the resource; defined by the server.",
          type: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server. (Format: uint64)",
          },
          required: false,
        },
        enableCdn: {
          name: "Enable CDN",
          description: "If true, enable Cloud CDN for this BackendBucket.",
          type: {
            type: "boolean",
            description: "If true, enable Cloud CDN for this BackendBucket.",
          },
          required: false,
        },
        edgeSecurityPolicy: {
          name: "Edge Security Policy",
          description:
            "[Output Only] The resource URL for the edge security policy associated with this backend bucket.",
          type: {
            type: "string",
            description:
              "[Output Only] The resource URL for the edge security policy associated with\nthis backend bucket.",
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
        customResponseHeaders: {
          name: "Custom Response Headers",
          description:
            "Headers that the Application Load Balancer should add to proxied responses.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the Application Load Balancer should add to proxied responses.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "Type of the resource.",
          type: {
            type: "string",
            description: "Type of the resource.",
          },
          required: false,
        },
        compressionMode: {
          name: "Compression Mode",
          description:
            "Compress text responses using Brotli or gzip compression, based on the client's Accept-Encoding header.",
          type: {
            type: "string",
            enum: ["AUTOMATIC", "DISABLED"],
            description:
              "Compress text responses using Brotli or gzip compression, based on\nthe client's Accept-Encoding header.",
          },
          required: false,
        },
        cdnPolicy: {
          name: "CDN Policy",
          description: "Cloud CDN configuration for this BackendBucket.",
          type: {
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
          required: false,
        },
        bucketName: {
          name: "Bucket Name",
          description: "Cloud Storage bucket name.",
          type: {
            type: "string",
            description: "Cloud Storage bucket name.",
          },
          required: false,
        },
        loadBalancingScheme: {
          name: "Load Balancing Scheme",
          description:
            "The value can only be INTERNAL_MANAGED for cross-region internal layer 7 load balancer.",
          type: {
            type: "string",
            enum: ["INTERNAL_MANAGED"],
            description:
              "The value can only be INTERNAL_MANAGED for cross-region internal layer 7\nload balancer.\n\nIf loadBalancingScheme is not specified, the backend bucket can be used by\nclassic global external load balancers, or global application external load\nbalancers, or both.",
          },
          required: false,
        },
        usedBy: {
          name: "Used By",
          description:
            "[Output Only] List of resources referencing that backend bucket.",
          type: {
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
          required: false,
        },
        params: {
          name: "Params",
          description: "Input only.",
          type: {
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
        let path = `projects/{project}/global/backendBuckets/{backendBucket}`;

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
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.enableCdn !== undefined)
          requestBody.enableCdn = input.event.inputConfig.enableCdn;
        if (input.event.inputConfig.edgeSecurityPolicy !== undefined)
          requestBody.edgeSecurityPolicy =
            input.event.inputConfig.edgeSecurityPolicy;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.customResponseHeaders !== undefined)
          requestBody.customResponseHeaders =
            input.event.inputConfig.customResponseHeaders;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.compressionMode !== undefined)
          requestBody.compressionMode = input.event.inputConfig.compressionMode;
        if (input.event.inputConfig.cdnPolicy !== undefined)
          requestBody.cdnPolicy = input.event.inputConfig.cdnPolicy;
        if (input.event.inputConfig.bucketName !== undefined)
          requestBody.bucketName = input.event.inputConfig.bucketName;
        if (input.event.inputConfig.loadBalancingScheme !== undefined)
          requestBody.loadBalancingScheme =
            input.event.inputConfig.loadBalancingScheme;
        if (input.event.inputConfig.usedBy !== undefined)
          requestBody.usedBy = input.event.inputConfig.usedBy;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;

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

export default backendBucketsPatch;
