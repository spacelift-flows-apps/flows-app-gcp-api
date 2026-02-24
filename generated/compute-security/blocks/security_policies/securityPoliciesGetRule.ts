import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const securityPoliciesGetRule: AppBlock = {
  name: "Security Policies - Get Rule",
  description: `Gets a rule at the specified priority.`,
  category: "Security Policies",
  inputs: {
    default: {
      config: {
        securityPolicy: {
          name: "Security Policy",
          description:
            "Name of the security policy to which the queried rule belongs.",
          type: {
            type: "string",
          },
          required: true,
        },
        priority: {
          name: "Priority",
          description:
            "The priority of the rule to get from the security policy.",
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
        let path = `projects/{project}/global/securityPolicies/{securityPolicy}/getRule`;

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
                            description: "The match operator for the field.",
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
                            description: "The match operator for the field.",
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
                            description: "The match operator for the field.",
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
                            description: "The match operator for the field.",
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
                      description: "The value to set the named header to.",
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
    },
  },
};

export default securityPoliciesGetRule;
