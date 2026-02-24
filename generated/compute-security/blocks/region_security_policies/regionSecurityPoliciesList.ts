import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionSecurityPoliciesList: AppBlock = {
  name: "Region Security Policies - List",
  description: `List all the policies that have been configured for the specified project and region.`,
  category: "Region Security Policies",
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
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
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
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
          },
          required: false,
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
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
          type: {
            type: "string",
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
        let path = `projects/{project}/regions/{region}/securityPolicies`;

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
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this security policy, which\nis essentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels.\n\nTo see the latest fingerprint, make get() request to the\nsecurity policy. (Format: byte)",
                },
                associations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      securityPolicyId: {
                        type: "string",
                        description:
                          "[Output Only] The security policy ID of the association.",
                      },
                      name: {
                        type: "string",
                        description: "The name for an association.",
                      },
                      attachmentId: {
                        type: "string",
                        description:
                          "The resource that the security policy is attached to.",
                      },
                      shortName: {
                        type: "string",
                        description:
                          "[Output Only] The short name of the security policy of the association.",
                      },
                      excludedProjects: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of projects to exclude from the security policy.",
                      },
                      excludedFolders: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of folders to exclude from the security policy.",
                      },
                      displayName: {
                        type: "string",
                        description:
                          "[Output Only] The display name of the security policy of the association.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "A list of associations that belong to this policy.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035.\nLabel values may be empty.",
                },
                adaptiveProtectionConfig: {
                  type: "object",
                  properties: {
                    layer7DdosDefenseConfig: {
                      type: "object",
                      properties: {
                        enable: {
                          type: "boolean",
                          description:
                            "If set to true, enables CAAP for L7 DDoS detection.\nThis field is only supported in Global Security Policies of type\nCLOUD_ARMOR.",
                        },
                        thresholdConfigs: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              autoDeployImpactedBaselineThreshold: {
                                type: "number",
                                description: "Format: float",
                              },
                              detectionAbsoluteQps: {
                                type: "number",
                                description: "Format: float",
                              },
                              detectionRelativeToBaselineQps: {
                                type: "number",
                                description: "Format: float",
                              },
                              trafficGranularityConfigs: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    enableEachUniqueValue: {
                                      type: "boolean",
                                      description:
                                        "If enabled, traffic matching each unique value for the specified\ntype constitutes a separate traffic unit.\nIt can only be set to true if `value` is empty.",
                                    },
                                    type: {
                                      type: "string",
                                      enum: [
                                        "HTTP_HEADER_HOST",
                                        "HTTP_PATH",
                                        "UNSPECIFIED_TYPE",
                                      ],
                                      description:
                                        "Type of this configuration.",
                                    },
                                    value: {
                                      type: "string",
                                      description:
                                        "Requests that match this value constitute a granular traffic unit.",
                                    },
                                  },
                                  description:
                                    "Configurations to specifc granular traffic units processed by\nAdaptive Protection.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Configuration options for enabling Adaptive Protection to operate\non specified granular traffic units.",
                              },
                              autoDeployConfidenceThreshold: {
                                type: "number",
                                description: "Format: float",
                              },
                              name: {
                                type: "string",
                                description:
                                  "The name must be 1-63 characters long, and comply withRFC1035.\nThe name must be unique within the security policy.",
                              },
                              detectionLoadThreshold: {
                                type: "number",
                                description: "Format: float",
                              },
                              autoDeployLoadThreshold: {
                                type: "number",
                                description: "Format: float",
                              },
                              autoDeployExpirationSec: {
                                type: "integer",
                                description: "Format: int32",
                              },
                            },
                            additionalProperties: true,
                          },
                          description:
                            "Configuration options for layer7 adaptive protection for various\ncustomizable thresholds.",
                        },
                        ruleVisibility: {
                          type: "string",
                          enum: ["PREMIUM", "STANDARD"],
                          description:
                            "Rule visibility can be one of the following:\nSTANDARD - opaque rules. (default)\nPREMIUM - transparent rules.\nThis field is only supported in Global Security Policies of type\nCLOUD_ARMOR.",
                        },
                      },
                      description:
                        "Configuration options for L7 DDoS detection.\nThis field is only supported in Global Security Policies of type\nCLOUD_ARMOR.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Configuration options for Cloud Armor Adaptive Protection (CAAP).",
                  additionalProperties: true,
                },
                parent: {
                  type: "string",
                  description:
                    "[Output Only] The parent of the security policy.",
                },
                recaptchaOptionsConfig: {
                  type: "object",
                  properties: {
                    redirectSiteKey: {
                      type: "string",
                      description:
                        "An optional field to supply a reCAPTCHA site key to be used for all the\nrules using the redirect action with the type of GOOGLE_RECAPTCHA under\nthe security policy. The specified site key needs to be created from the\nreCAPTCHA API. The user is responsible for the validity of the specified\nsite key. If not specified, a Google-managed site key is used.\nThis field is only supported in Global Security Policies of type\nCLOUD_ARMOR.",
                    },
                  },
                  additionalProperties: true,
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the regional security policy\nresides. This field is not applicable to global security policies.",
                },
                advancedOptionsConfig: {
                  type: "object",
                  properties: {
                    userIpRequestHeaders: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "An optional list of case-insensitive request header names to use for\nresolving the callers client IP address.",
                    },
                    logLevel: {
                      type: "string",
                      enum: ["NORMAL", "VERBOSE"],
                    },
                    jsonParsing: {
                      type: "string",
                      enum: ["DISABLED", "STANDARD", "STANDARD_WITH_GRAPHQL"],
                    },
                    jsonCustomConfig: {
                      type: "object",
                      properties: {
                        contentTypes: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            'A list of custom Content-Type header values to apply the JSON parsing.\n\nAs per RFC 1341, a Content-Type header value has the following format:\n\nContent-Type := type "/" subtype *[";" parameter]\n\nWhen configuring a custom Content-Type header value, only the\ntype/subtype needs to be specified, and the parameters should be\nexcluded.',
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                type: {
                  type: "string",
                  enum: [
                    "CLOUD_ARMOR",
                    "CLOUD_ARMOR_EDGE",
                    "CLOUD_ARMOR_NETWORK",
                  ],
                  description:
                    "The type indicates the intended use of the security policy.\n   \n   - CLOUD_ARMOR: Cloud Armor backend security policies can\n   be configured to filter incoming HTTP requests targeting backend services.\n   They filter requests before they hit the origin servers.\n   - CLOUD_ARMOR_EDGE: Cloud Armor edge security policies can\n   be configured to filter incoming HTTP requests targeting backend services\n   (including Cloud CDN-enabled) as well as backend buckets (Cloud Storage).\n   They filter requests before the request is served from Google's cache.\n   - CLOUD_ARMOR_INTERNAL_SERVICE (preview only): Cloud Armor\n   internal service policies can be configured to filter HTTP requests\n   targeting services managed by Traffic Director in a service mesh. They\n   filter requests before the request is served from the application.\n\n- CLOUD_ARMOR_NETWORK: Cloud Armor network policies\ncan be configured to filter packets targeting network load balancing\nresources such as backend services, target pools, target instances, and\ninstances with external IPs. They filter requests before the request is\nserved from the application.\n\n\nThis field can be set only at resource creation time.",
                },
                rules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      preconfiguredWafConfig: {
                        type: "object",
                        properties: {
                          exclusions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                requestQueryParamsToExclude: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      val: {
                                        type: "string",
                                        description: "The value of the field.",
                                      },
                                      op: {
                                        type: "string",
                                        enum: [
                                          "CONTAINS",
                                          "ENDS_WITH",
                                          "EQUALS",
                                          "EQUALS_ANY",
                                          "STARTS_WITH",
                                        ],
                                        description:
                                          "The match operator for the field.",
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  description:
                                    "A list of request query parameter names whose value will be excluded\nfrom inspection during preconfigured WAF evaluation. Note that the\nparameter can be in the query string or in the POST body.",
                                },
                                requestHeadersToExclude: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      val: {
                                        type: "string",
                                        description: "The value of the field.",
                                      },
                                      op: {
                                        type: "string",
                                        enum: [
                                          "CONTAINS",
                                          "ENDS_WITH",
                                          "EQUALS",
                                          "EQUALS_ANY",
                                          "STARTS_WITH",
                                        ],
                                        description:
                                          "The match operator for the field.",
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  description:
                                    "A list of request header names whose value will be excluded from\ninspection during preconfigured WAF evaluation.",
                                },
                                targetRuleSet: {
                                  type: "string",
                                  description:
                                    "Target WAF rule set to apply the preconfigured WAF exclusion.",
                                },
                                targetRuleIds: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    "A list of target rule IDs under the WAF rule set to apply the\npreconfigured WAF exclusion. If omitted, it refers to all the rule\nIDs under the WAF rule set.",
                                },
                                requestUrisToExclude: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      val: {
                                        type: "string",
                                        description: "The value of the field.",
                                      },
                                      op: {
                                        type: "string",
                                        enum: [
                                          "CONTAINS",
                                          "ENDS_WITH",
                                          "EQUALS",
                                          "EQUALS_ANY",
                                          "STARTS_WITH",
                                        ],
                                        description:
                                          "The match operator for the field.",
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  description:
                                    "A list of request URIs from the request line to be excluded from\ninspection during preconfigured WAF evaluation. When specifying this\nfield, the query or fragment part should be excluded.",
                                },
                                requestCookiesToExclude: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      val: {
                                        type: "string",
                                        description: "The value of the field.",
                                      },
                                      op: {
                                        type: "string",
                                        enum: [
                                          "CONTAINS",
                                          "ENDS_WITH",
                                          "EQUALS",
                                          "EQUALS_ANY",
                                          "STARTS_WITH",
                                        ],
                                        description:
                                          "The match operator for the field.",
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  description:
                                    "A list of request cookie names whose value will be excluded from\ninspection during preconfigured WAF evaluation.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "A list of exclusions to apply during preconfigured WAF evaluation.",
                          },
                        },
                        additionalProperties: true,
                      },
                      networkMatch: {
                        type: "object",
                        properties: {
                          destIpRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Destination IPv4/IPv6 addresses or CIDR prefixes, in standard text\nformat.",
                          },
                          srcAsns: {
                            type: "array",
                            items: {
                              type: "integer",
                              description: "Format: uint32",
                            },
                            description:
                              "BGP Autonomous System Number associated with the source IP address.",
                          },
                          srcIpRanges: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Source IPv4/IPv6 addresses or CIDR prefixes, in standard text format.",
                          },
                          ipProtocols: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'IPv4 protocol / IPv6 next header (after extension headers). Each\nelement can be an 8-bit unsigned decimal number (e.g. "6"), range (e.g.\n"253-254"), or one of the following protocol names: "tcp", "udp",\n"icmp", "esp", "ah", "ipip", or "sctp".',
                          },
                          userDefinedFields: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                  description:
                                    "Name of the user-defined field, as given in the definition.",
                                },
                                values: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description:
                                    'Matching values of the field. Each element can be a 32-bit unsigned\ndecimal or hexadecimal (starting with "0x") number (e.g. "64") or\nrange (e.g.  "0x400-0x7ff").',
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "User-defined fields. Each element names a defined field and lists the\nmatching values for that field.",
                          },
                          destPorts: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Destination port numbers for TCP/UDP/SCTP. Each element can be a 16-bit\nunsigned decimal number (e.g. "80") or range (e.g. "0-1023").',
                          },
                          srcPorts: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              'Source port numbers for TCP/UDP/SCTP. Each element can be a 16-bit\nunsigned decimal number (e.g. "80") or range (e.g. "0-1023").',
                          },
                          srcRegionCodes: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Two-letter ISO 3166-1 alpha-2 country code associated with the source\nIP address.",
                          },
                        },
                        description:
                          "Represents a match condition that incoming network traffic is evaluated\nagainst.",
                        additionalProperties: true,
                      },
                      kind: {
                        type: "string",
                        description:
                          "[Output only] Type of the resource. Alwayscompute#securityPolicyRule for security policy rules",
                      },
                      rateLimitOptions: {
                        type: "object",
                        properties: {
                          banDurationSec: {
                            type: "integer",
                            description:
                              'Can only be specified if the action for the rule is\n"rate_based_ban". If specified, determines the time (in seconds)\nthe traffic will continue to be banned by the rate limit after the\nrate falls below the threshold. (Format: int32)',
                          },
                          exceedAction: {
                            type: "string",
                            description:
                              "Action to take for requests that are above the configured rate limit\nthreshold, to either deny with a specified HTTP response code, or\nredirect to a different endpoint.\nValid options are `deny(STATUS)`, where valid values for\n`STATUS` are 403, 404, 429, and 502, and\n`redirect`, where the redirect parameters come from\n`exceedRedirectOptions` below.\nThe `redirect` action is only supported in Global Security Policies of\ntype CLOUD_ARMOR.",
                          },
                          enforceOnKeyName: {
                            type: "string",
                            description:
                              "Rate limit key name applicable only for the following key types:\nHTTP_HEADER -- Name of the HTTP header whose value is taken as the key\nvalue.\nHTTP_COOKIE -- Name of the HTTP cookie whose value is taken as the key\nvalue.",
                          },
                          enforceOnKey: {
                            type: "string",
                            enum: [
                              "ALL",
                              "HTTP_COOKIE",
                              "HTTP_HEADER",
                              "HTTP_PATH",
                              "IP",
                              "REGION_CODE",
                              "SNI",
                              "TLS_JA3_FINGERPRINT",
                              "TLS_JA4_FINGERPRINT",
                              "USER_IP",
                              "XFF_IP",
                            ],
                            description:
                              'Determines the key to enforce the rate_limit_threshold on. Possible\nvalues are:\n   \n   - ALL: A single rate limit threshold is applied to all\n   the requests matching this rule. This is the default value if\n   "enforceOnKey" is not configured.\n   - IP: The source IP address of\n   the request is the key. Each IP has this limit enforced\n   separately.\n   - HTTP_HEADER: The value of the HTTP\n   header whose name is configured under "enforceOnKeyName". The key\n   value is truncated to the first 128 bytes of the header value. If no\n   such header is present in the request, the key type defaults toALL.\n   - XFF_IP: The first IP address (i.e. the\n   originating client IP address) specified in the list of IPs under\n   X-Forwarded-For HTTP header. If no such header is present or the value\n   is not a valid IP, the key defaults to the source IP address of\n   the request i.e. key type IP.\n   - HTTP_COOKIE: The value of the HTTP\n   cookie whose name is configured under "enforceOnKeyName". The key\n   value is truncated to the first 128 bytes of the cookie value. If no\n   such cookie is present in the request, the key type defaults toALL.\n   - HTTP_PATH: The URL path of the HTTP request. The key\n   value is truncated to the first 128 bytes. \n   - SNI: Server name indication in the TLS session of the\n   HTTPS request. The key value is truncated to the first 128 bytes. The\n   key type defaults to ALL on a HTTP session. \n   - REGION_CODE: The country/region from which the request\n   originates. \n   - TLS_JA3_FINGERPRINT: JA3 TLS/SSL fingerprint if the\n   client connects using HTTPS, HTTP/2 or HTTP/3. If not available, the\n   key type defaults to ALL. \n   - USER_IP: The IP address of the originating client,\n   which is resolved based on "userIpRequestHeaders" configured with the\n   security policy. If there is no "userIpRequestHeaders" configuration or\n   an IP address cannot be resolved from it, the key type defaults toIP. \n\n- TLS_JA4_FINGERPRINT: JA4 TLS/SSL fingerprint if the\nclient connects using HTTPS, HTTP/2 or HTTP/3. If not available, the\nkey type defaults to ALL. \nFor "fairshare" action, this value is limited to ALL i.e. a single rate\nlimit threshold is enforced for all the requests matching the rule.',
                          },
                          conformAction: {
                            type: "string",
                            description:
                              'Action to take for requests that are under the configured rate limit\nthreshold. Valid option is "allow" only.',
                          },
                          enforceOnKeyConfigs: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                enforceOnKeyType: {
                                  type: "string",
                                  enum: [
                                    "ALL",
                                    "HTTP_COOKIE",
                                    "HTTP_HEADER",
                                    "HTTP_PATH",
                                    "IP",
                                    "REGION_CODE",
                                    "SNI",
                                    "TLS_JA3_FINGERPRINT",
                                    "TLS_JA4_FINGERPRINT",
                                    "USER_IP",
                                    "XFF_IP",
                                  ],
                                  description:
                                    'Determines the key to enforce the rate_limit_threshold on. Possible\nvalues are:\n   \n   - ALL: A single rate limit threshold is applied to all\n   the requests matching this rule. This is the default value if\n   "enforceOnKeyConfigs" is not configured.\n   - IP: The source IP address of\n   the request is the key. Each IP has this limit enforced\n   separately.\n   - HTTP_HEADER: The value of the HTTP\n   header whose name is configured under "enforceOnKeyName". The key\n   value is truncated to the first 128 bytes of the header value. If no\n   such header is present in the request, the key type defaults toALL.\n   - XFF_IP: The first IP address (i.e. the\n   originating client IP address) specified in the list of IPs under\n   X-Forwarded-For HTTP header. If no such header is present or the\n   value is not a valid IP, the key defaults to the source IP address of\n   the request i.e. key type IP.\n   - HTTP_COOKIE: The value of the HTTP\n   cookie whose name is configured under "enforceOnKeyName". The key\n   value is truncated to the first 128 bytes of the cookie value. If no\n   such cookie is present in the request, the key type defaults toALL.\n   - HTTP_PATH: The URL path of the HTTP request. The key\n   value is truncated to the first 128 bytes. \n   - SNI: Server name indication in the TLS session of\n   the HTTPS request. The key value is truncated to the first 128 bytes.\n   The key type defaults to ALL on a HTTP session. \n   - REGION_CODE: The country/region from which the\n   request originates. \n   - TLS_JA3_FINGERPRINT: JA3 TLS/SSL fingerprint if the\n   client connects using HTTPS, HTTP/2 or HTTP/3. If not available, the\n   key type defaults to ALL. \n   - USER_IP: The IP address of the originating client,\n   which is resolved based on "userIpRequestHeaders" configured with the\n   security policy. If there is no "userIpRequestHeaders" configuration\n   or an IP address cannot be resolved from it, the key type defaults toIP. \n\n- TLS_JA4_FINGERPRINT: JA4 TLS/SSL fingerprint if the\nclient connects using HTTPS, HTTP/2 or HTTP/3. If not available, the\nkey type defaults to ALL.',
                                },
                                enforceOnKeyName: {
                                  type: "string",
                                  description:
                                    "Rate limit key name applicable only for the following key types:\nHTTP_HEADER -- Name of the HTTP header whose value is taken as the\nkey value. HTTP_COOKIE -- Name of the HTTP cookie whose value is\ntaken as the key value.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "If specified, any combination of values of\nenforce_on_key_type/enforce_on_key_name is treated as the key on which\nratelimit threshold/action is enforced. You can specify up to 3\nenforce_on_key_configs. If enforce_on_key_configs is specified,\nenforce_on_key must not be specified.",
                          },
                          exceedRedirectOptions: {
                            type: "object",
                            properties: {
                              type: {
                                type: "string",
                                enum: ["EXTERNAL_302", "GOOGLE_RECAPTCHA"],
                                description:
                                  "Type of the redirect action. Possible values are:\n   \n   - GOOGLE_RECAPTCHA: redirect to reCAPTCHA for manual\n   challenge assessment.\n   - EXTERNAL_302: redirect to a different URL via a 302\n   response.",
                              },
                              target: {
                                type: "string",
                                description:
                                  "Target for the redirect action. This is required if the type is\nEXTERNAL_302 and cannot be specified for GOOGLE_RECAPTCHA.",
                              },
                            },
                            additionalProperties: true,
                          },
                          banThreshold: {
                            type: "object",
                            properties: {
                              intervalSec: {
                                type: "integer",
                                description:
                                  "Interval over which the threshold is computed. (Format: int32)",
                              },
                              count: {
                                type: "integer",
                                description:
                                  "Number of HTTP(S) requests for calculating the threshold. (Format: int32)",
                              },
                            },
                            additionalProperties: true,
                          },
                          rateLimitThreshold: {
                            type: "object",
                            properties: {
                              intervalSec: {
                                type: "integer",
                                description:
                                  "Interval over which the threshold is computed. (Format: int32)",
                              },
                              count: {
                                type: "integer",
                                description:
                                  "Number of HTTP(S) requests for calculating the threshold. (Format: int32)",
                              },
                            },
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      redirectOptions: {
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                            enum: ["EXTERNAL_302", "GOOGLE_RECAPTCHA"],
                            description:
                              "Type of the redirect action. Possible values are:\n   \n   - GOOGLE_RECAPTCHA: redirect to reCAPTCHA for manual\n   challenge assessment.\n   - EXTERNAL_302: redirect to a different URL via a 302\n   response.",
                          },
                          target: {
                            type: "string",
                            description:
                              "Target for the redirect action. This is required if the type is\nEXTERNAL_302 and cannot be specified for GOOGLE_RECAPTCHA.",
                          },
                        },
                        additionalProperties: true,
                      },
                      action: {
                        type: "string",
                        description:
                          "The Action to perform when the rule is matched.\nThe following are the valid actions:\n   \n   - allow: allow access to target.\n   - deny(STATUS): deny access to target, returns the\n   HTTP response code specified. Valid values for `STATUS`\n   are 403, 404, and 502.\n   - rate_based_ban: limit client traffic to the configured\n   threshold and ban the client if the traffic exceeds the threshold.\n   Configure parameters for this action in RateLimitOptions. Requires\n   rate_limit_options to be set.\n   - redirect: redirect to a different target. This can\n   either be an internal reCAPTCHA redirect, or an external URL-based\n   redirect via a 302 response. Parameters for this action can be configured\n   via redirectOptions. This action is only supported in Global Security\n   Policies of type CLOUD_ARMOR.\n   - throttle: limit\n   client traffic to the configured threshold. Configure parameters for this\n   action in rateLimitOptions. Requires rate_limit_options to be set for\n   this.\n   - fairshare (preview only): when traffic reaches the\n   threshold limit, requests from the clients matching this rule begin to be\n   rate-limited using the Fair Share algorithm. This action is only allowed\n   in security policies of type `CLOUD_ARMOR_INTERNAL_SERVICE`.",
                      },
                      headerAction: {
                        type: "object",
                        properties: {
                          requestHeadersToAdds: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                headerValue: {
                                  type: "string",
                                  description:
                                    "The value to set the named header to.",
                                },
                                headerName: {
                                  type: "string",
                                  description: "The name of the header to set.",
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "The list of request headers to add or overwrite if they're already\npresent.",
                          },
                        },
                        additionalProperties: true,
                      },
                      preview: {
                        type: "boolean",
                        description:
                          "If set to true, the specified action is not enforced.",
                      },
                      match: {
                        type: "object",
                        properties: {
                          versionedExpr: {
                            type: "string",
                            enum: ["SRC_IPS_V1"],
                            description:
                              "Preconfigured versioned expression.\nIf this field is specified, config must also be specified.\nAvailable preconfigured expressions along with their requirements are:\nSRC_IPS_V1 - must specify the corresponding src_ip_range field in\nconfig.",
                          },
                          config: {
                            type: "object",
                            properties: {
                              srcIpRanges: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                                description:
                                  "CIDR IP address range.\nMaximum number of src_ip_ranges allowed is 10.",
                              },
                            },
                            additionalProperties: true,
                          },
                          exprOptions: {
                            type: "object",
                            properties: {
                              recaptchaOptions: {
                                type: "object",
                                properties: {
                                  actionTokenSiteKeys: {
                                    type: "array",
                                    items: {
                                      type: "string",
                                    },
                                    description:
                                      "A list of site keys to be used during the validation of reCAPTCHA\naction-tokens. The provided site keys need to be created from\nreCAPTCHA API under the same project where the security policy is\ncreated.",
                                  },
                                  sessionTokenSiteKeys: {
                                    type: "array",
                                    items: {
                                      type: "string",
                                    },
                                    description:
                                      "A list of site keys to be used during the validation of reCAPTCHA\nsession-tokens. The provided site keys need to be created from\nreCAPTCHA API under the same project where the security policy is\ncreated.",
                                  },
                                },
                                additionalProperties: true,
                              },
                            },
                            additionalProperties: true,
                          },
                          expr: {
                            type: "object",
                            properties: {
                              title: {
                                type: "string",
                                description:
                                  "Optional. Title for the expression, i.e. a short string describing\nits purpose. This can be used e.g. in UIs which allow to enter the\nexpression.",
                              },
                              expression: {
                                type: "string",
                                description:
                                  "Textual representation of an expression in Common Expression Language\nsyntax.",
                              },
                              location: {
                                type: "string",
                                description:
                                  "Optional. String indicating the location of the expression for error\nreporting, e.g. a file name and a position in the file.",
                              },
                              description: {
                                type: "string",
                                description:
                                  "Optional. Description of the expression. This is a longer text which\ndescribes the expression, e.g. when hovered over it in a UI.",
                              },
                            },
                            description:
                              'Represents a textual expression in the Common Expression Language (CEL)\nsyntax. CEL is a C-like expression language. The syntax and semantics of CEL\nare documented at https://github.com/google/cel-spec.\n\nExample (Comparison):\n\n    title: "Summary size limit"\n    description: "Determines if a summary is less than 100 chars"\n    expression: "document.summary.size() < 100"\n\nExample (Equality):\n\n    title: "Requestor is owner"\n    description: "Determines if requestor is the document owner"\n    expression: "document.owner == request.auth.claims.email"\n\nExample (Logic):\n\n    title: "Public documents"\n    description: "Determine whether the document should be publicly visible"\n    expression: "document.type != \'private\' && document.type != \'internal\'"\n\nExample (Data Manipulation):\n\n    title: "Notification string"\n    description: "Create a notification string with a timestamp."\n    expression: "\'New message received at \' + string(document.create_time)"\n\nThe exact variables and functions that may be referenced within an expression\nare determined by the service that evaluates it. See the service\ndocumentation for additional information.',
                            additionalProperties: true,
                          },
                        },
                        description:
                          "Represents a match condition that incoming traffic is evaluated against.\nExactly one field must be specified.",
                        additionalProperties: true,
                      },
                      description: {
                        type: "string",
                        description:
                          "An optional description of this resource. Provide this property when you\ncreate the resource.",
                      },
                      priority: {
                        type: "integer",
                        description:
                          "An integer indicating the priority of a rule in the list. The priority\nmust be a positive value between 0 and 2147483647.\nRules are evaluated from highest to lowest priority where 0 is the\nhighest priority and 2147483647 is the lowest priority. (Format: int32)",
                      },
                    },
                    description:
                      "Represents a rule that describes one or more match conditions along with\nthe action to be taken when traffic matches this condition (allow or deny).",
                    additionalProperties: true,
                  },
                  description:
                    'A list of rules that belong to this policy.\nThere must always be a default rule which is a rule with priority\n2147483647 and match all condition (for the match condition this means\nmatch  "*" for srcIpRanges and for the networkMatch condition every field\nmust be either match "*" or not set). If no rules are provided when\ncreating a security policy, a default rule with action "allow" will be\nadded.',
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output only] Type of the resource. Alwayscompute#securityPolicyfor security policies",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                ddosProtectionConfig: {
                  type: "object",
                  properties: {
                    ddosProtection: {
                      type: "string",
                      enum: ["ADVANCED", "ADVANCED_PREVIEW", "STANDARD"],
                    },
                  },
                  additionalProperties: true,
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Specifies a fingerprint for this resource, which is essentially a hash of\nthe metadata's contents and used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update metadata. You must always provide an\nup-to-date fingerprint hash in order to update or change metadata,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make get() request to the\nsecurity policy. (Format: byte)",
                },
                shortName: {
                  type: "string",
                  description:
                    "User-provided name of the organization security policy. The name should be\nunique in the organization in which the security policy is created. This\nshould only be used when SecurityPolicyType is CLOUD_ARMOR.\nThe name must be 1-63 characters long, and comply with\nhttps://www.ietf.org/rfc/rfc1035.txt. Specifically, the name must be 1-63\ncharacters long and match the regular expression\n`[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a\nlowercase letter, and all following characters must be a dash, lowercase\nletter, or digit, except the last character, which cannot be a dash.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                userDefinedFields: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      offset: {
                        type: "integer",
                        description:
                          "Offset of the first byte of the field (in network byte order) relative to\n'base'. (Format: int32)",
                      },
                      mask: {
                        type: "string",
                        description:
                          'If specified, apply this mask (bitwise AND) to the field to ignore bits\nbefore matching. Encoded as a hexadecimal number (starting with "0x").\nThe last byte of the field (in network byte order) corresponds to the\nleast significant byte of the mask.',
                      },
                      name: {
                        type: "string",
                        description:
                          "The name of this field. Must be unique within the policy.",
                      },
                      size: {
                        type: "integer",
                        description:
                          "Size of the field in bytes. Valid values: 1-4. (Format: int32)",
                      },
                      base: {
                        type: "string",
                        enum: ["IPV4", "IPV6", "TCP", "UDP"],
                        description:
                          "The base relative to which 'offset' is measured. Possible values are:\n   \n   - IPV4: Points to the beginning of the IPv4 header.\n   - IPV6: Points to the beginning of the IPv6 header.\n   - TCP: Points to the beginning of the TCP header, skipping\n   over any IPv4 options or IPv6 extension headers. Not present for\n   non-first fragments.\n   - UDP: Points to the beginning of the UDP header, skipping\n   over any IPv4 options or IPv6 extension headers. Not present for\n   non-first fragments.\n\n\nrequired",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    'Definitions of user-defined fields for CLOUD_ARMOR_NETWORK policies. A\nuser-defined field consists of up to 4 bytes extracted from a fixed offset\nin the packet, relative to the IPv4, IPv6, TCP, or UDP header, with an\noptional mask to select certain bits. Rules may then specify matching\nvalues for these fields.\n\nExample:\n\n userDefinedFields:\n - name: "ipv4_fragment_offset"\n   base: IPV4\n   offset: 6\n   size: 2\n   mask: "0x1fff"',
                },
              },
              description:
                "Represents a Google Cloud Armor security policy resource.\n\nOnly external backend services that use load balancers can\nreference a security policy. For more information, see\nGoogle Cloud Armor security policy overview.",
              additionalProperties: true,
            },
            description: "A list of SecurityPolicy resources.",
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
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Alwayscompute#securityPolicyList for listsof securityPolicies",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default regionSecurityPoliciesList;
