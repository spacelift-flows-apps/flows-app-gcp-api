import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionTargetHttpsProxiesList: AppBlock = {
  name: "Region Target HTTPS Proxies - List",
  description: `Retrieves the list of TargetHttpsProxy resources available to the specified project in the specified region.`,
  category: "Region Target HTTPS Proxies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
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
        let path = `projects/{project}/regions/{region}/targetHttpsProxies`;

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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                sslPolicy: {
                  type: "string",
                  description:
                    "URL of SslPolicy resource that will be associated with the TargetHttpsProxy\nresource. If not set, the TargetHttpsProxy resource has no\nSSL policy configured.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the regional TargetHttpsProxy\nresides. This field is not applicable to global TargetHttpsProxies.",
                },
                tlsEarlyData: {
                  type: "string",
                  enum: ["DISABLED", "PERMISSIVE", "STRICT", "UNRESTRICTED"],
                  description:
                    'Specifies whether TLS 1.3 0-RTT Data ("Early Data") should be accepted\nfor this service. Early Data allows a TLS resumption handshake to include\nthe initial application payload (a HTTP request) alongside the handshake,\nreducing the effective round trips to "zero". This applies to TLS 1.3\nconnections over TCP (HTTP/2) as well as over UDP (QUIC/h3).\n\n\nThis can improve application performance, especially on networks where\ninterruptions may be common, such as on mobile.\n\n\nRequests with Early Data will have the "Early-Data" HTTP header set on\nthe request, with a value of "1", to allow the backend to determine whether\nEarly Data was included.\n\n\nNote: TLS Early Data may allow requests to be replayed, as the data is\nsent to the backend before the handshake has fully completed. Applications\nthat allow idempotent HTTP methods to make non-idempotent changes, such as\na GET request updating a database, should not accept Early Data on those\nrequests, and reject requests with the "Early-Data: 1" HTTP header by\nreturning a HTTP 425 (Too Early) status code, in order to remain RFC\ncompliant.\n\n\nThe default value is DISABLED.',
                },
                authorizationPolicy: {
                  type: "string",
                  description:
                    "Optional. A URL referring to a networksecurity.AuthorizationPolicy resource\nthat describes how the proxy should authorize inbound traffic. If left\nblank, access will not be restricted by an authorization policy.\n\n Refer to the AuthorizationPolicy resource for additional\ndetails.\n\n authorizationPolicy only applies to a globalTargetHttpsProxy attached toglobalForwardingRules with theloadBalancingScheme set to INTERNAL_SELF_MANAGED.\n\n Note: This field currently has no impact.",
                },
                urlMap: {
                  type: "string",
                  description:
                    "A fully-qualified or valid partial URL to the UrlMap resource that defines\nthe mapping from URL to the BackendService. For example, the following are\nall valid URLs for specifying a URL map:\n   \n   - https://www.googleapis.compute/v1/projects/project/global/urlMaps/url-map \n   - projects/project/global/urlMaps/url-map \n   - global/urlMaps/url-map",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a TargetHttpsProxy. An up-to-date fingerprint must\nbe provided in order to patch the TargetHttpsProxy; otherwise, the request\nwill fail with error 412 conditionNotMet. To see the latest\nfingerprint, make a get() request to retrieve the\nTargetHttpsProxy. (Format: byte)",
                },
                httpKeepAliveTimeoutSec: {
                  type: "integer",
                  description:
                    "Specifies how long to keep a connection open, after completing a response,\nwhile there is no matching traffic (in seconds). If an HTTP keep-alive is\nnot specified, a default value (610 seconds) will be used.\n\nFor global external Application Load Balancers, the minimum allowed value\nis 5 seconds and the maximum allowed value is 1200 seconds.\n\nFor classic Application Load Balancers, this option is not supported. (Format: int32)",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                sslCertificates: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "URLs to SslCertificate resources that are used to authenticate\nconnections between users and the load balancer. At least one SSL\ncertificate must be specified. SslCertificates do not apply when the load\nbalancing scheme is set to INTERNAL_SELF_MANAGED.\n\nThe URLs should refer to a SSL Certificate resource or Certificate Manager\nCertificate resource. Mixing Classic Certificates and Certificate Manager\nCertificates is not allowed. Certificate Manager Certificates must include\nthe certificatemanager API namespace. Using Certificate Manager\nCertificates in this field is not supported by Global external Application\nLoad Balancer or Classic Application Load Balancer, use certificate_map\ninstead.\n\nCurrently, you may specify up to 15 Classic SSL Certificates or up to 100\nCertificate Manager Certificates.\n\nCertificate Manager Certificates accepted formats are:\n   \n   - //certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificates/{resourceName}.\n   - https://certificatemanager.googleapis.com/v1alpha1/projects/{project}/locations/{location}/certificates/{resourceName}.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                proxyBind: {
                  type: "boolean",
                  description:
                    "This field only applies when the forwarding rule that references this\ntarget proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.\n\nWhen this field is set to true, Envoy proxies set up inbound\ntraffic interception and bind to the IP address and port specified in the\nforwarding rule. This is generally useful when using Traffic Director to\nconfigure Envoy as a gateway or middle proxy (in other words, not a\nsidecar proxy). The Envoy proxy listens for inbound requests and handles\nrequests when it receives them.\n\nThe default is false.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of resource. Alwayscompute#targetHttpsProxy for target HTTPS proxies.",
                },
                certificateMap: {
                  type: "string",
                  description:
                    "URL of a certificate map that identifies a certificate map associated with\nthe given target proxy.\nThis field can only be set for Global external Application Load Balancer or\nClassic Application Load Balancer. For other products use Certificate\nManager Certificates instead.\n\nIf set, sslCertificates will be ignored.\n\n Accepted format is//certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificateMaps/{resourceName}.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
                },
                serverTlsPolicy: {
                  type: "string",
                  description:
                    "Optional. A URL referring to a networksecurity.ServerTlsPolicy resource\nthat describes how the proxy should authenticate inbound traffic.\n\n serverTlsPolicy only applies to a globalTargetHttpsProxy attached toglobalForwardingRules with theloadBalancingScheme set to INTERNAL_SELF_MANAGED\nor EXTERNAL orEXTERNAL_MANAGED or INTERNAL_MANAGED.\nIt also applies to a regional TargetHttpsProxy attached to\nregional forwardingRules with theloadBalancingScheme set to EXTERNAL_MANAGED orINTERNAL_MANAGED. For details whichServerTlsPolicy resources are accepted withINTERNAL_SELF_MANAGED and which with EXTERNAL,INTERNAL_MANAGED, EXTERNAL_MANAGEDloadBalancingScheme consult ServerTlsPolicy\ndocumentation.\n\n  If left blank, communications are not encrypted.",
                },
                quicOverride: {
                  type: "string",
                  enum: ["DISABLE", "ENABLE", "NONE"],
                  description:
                    "Specifies the QUIC override policy for this TargetHttpsProxy resource. This\nsetting determines whether the load balancer attempts to negotiate QUIC\nwith clients.\nYou can specify NONE, ENABLE, orDISABLE.\n   \n   - When quic-override is set to NONE,\n   Google manages whether QUIC is used.\n   - When quic-override is set to ENABLE, the\n   load balancer uses QUIC when possible.\n   - When quic-override is set to DISABLE, the\n   load balancer doesn't use QUIC.\n   - If the quic-override flag is not specified,NONE is implied.",
                },
              },
              description:
                "Represents a Target HTTPS Proxy resource.\n\nGoogle Compute Engine has two Target HTTPS Proxy resources:\n\n* [Global](/compute/docs/reference/rest/v1/targetHttpsProxies)\n* [Regional](/compute/docs/reference/rest/v1/regionTargetHttpsProxies)\n\nA target HTTPS proxy is a component of Google Cloud HTTPS load balancers.\n\n* targetHttpsProxies are used by global external Application Load Balancers,\n  classic Application Load Balancers, cross-region internal Application Load\n  Balancers, and Traffic Director.\n* regionTargetHttpsProxies are used by regional internal Application Load\n  Balancers and regional external Application Load Balancers.\n\nForwarding rules reference a target HTTPS proxy, and the target proxy\nthen references a URL map. For more information, readUsing Target Proxies\nand \nForwarding rule concepts.",
              additionalProperties: true,
            },
            description: "A list of TargetHttpsProxy resources.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          warning: {
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
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          kind: {
            type: "string",
            description:
              "Type of resource. Always compute#targetHttpsProxyList for\nlists of target HTTPS proxies.",
          },
        },
        description: "Contains a list of TargetHttpsProxy resources.",
        additionalProperties: true,
      },
    },
  },
};

export default regionTargetHttpsProxiesList;
