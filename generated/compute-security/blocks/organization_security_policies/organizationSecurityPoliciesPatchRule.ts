import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const organizationSecurityPoliciesPatchRule: AppBlock = {
  name: "Organization Security Policies - Patch Rule",
  description: `Patches a rule at the specified priority.`,
  category: "Organization Security Policies",
  inputs: {
    default: {
      config: {
        securityPolicy: {
          name: "Security Policy",
          description: "Name of the security policy to update.",
          type: {
            type: "string",
          },
          required: true,
        },
        priority: {
          name: "Priority",
          description:
            "An integer indicating the priority of a rule in the list.",
          type: {
            type: "integer",
            description:
              "An integer indicating the priority of a rule in the list. The priority\nmust be a positive value between 0 and 2147483647.\nRules are evaluated from highest to lowest priority where 0 is the\nhighest priority and 2147483647 is the lowest priority. (Format: int32)",
          },
          required: false,
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
        preconfiguredWafConfig: {
          name: "Preconfigured Waf Config",
          description:
            "Preconfigured WAF configuration to be applied for the rule.",
          type: {
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
          required: false,
        },
        networkMatch: {
          name: "Network Match",
          description:
            "A match condition that incoming packets are evaluated against for CLOUD_ARMOR_NETWORK security policies.",
          type: {
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
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output only] Type of the resource. Alwayscompute#securityPolicyRule for security policy rules",
          },
          required: false,
        },
        rateLimitOptions: {
          name: "Rate Limit Options",
          description:
            'Must be specified if the action is "rate_based_ban" or "throttle" or "fairshare".',
          type: {
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
          required: false,
        },
        redirectOptions: {
          name: "Redirect Options",
          description: "Parameters defining the redirect action.",
          type: {
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
          required: false,
        },
        action: {
          name: "Action",
          description: "The Action to perform when the rule is matched.",
          type: {
            type: "string",
            description:
              "The Action to perform when the rule is matched.\nThe following are the valid actions:\n   \n   - allow: allow access to target.\n   - deny(STATUS): deny access to target, returns the\n   HTTP response code specified. Valid values for `STATUS`\n   are 403, 404, and 502.\n   - rate_based_ban: limit client traffic to the configured\n   threshold and ban the client if the traffic exceeds the threshold.\n   Configure parameters for this action in RateLimitOptions. Requires\n   rate_limit_options to be set.\n   - redirect: redirect to a different target. This can\n   either be an internal reCAPTCHA redirect, or an external URL-based\n   redirect via a 302 response. Parameters for this action can be configured\n   via redirectOptions. This action is only supported in Global Security\n   Policies of type CLOUD_ARMOR.\n   - throttle: limit\n   client traffic to the configured threshold. Configure parameters for this\n   action in rateLimitOptions. Requires rate_limit_options to be set for\n   this.\n   - fairshare (preview only): when traffic reaches the\n   threshold limit, requests from the clients matching this rule begin to be\n   rate-limited using the Fair Share algorithm. This action is only allowed\n   in security policies of type `CLOUD_ARMOR_INTERNAL_SERVICE`.",
          },
          required: false,
        },
        headerAction: {
          name: "Header Action",
          description:
            "Optional, additional actions that are performed on headers.",
          type: {
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
          required: false,
        },
        preview: {
          name: "Preview",
          description: "If set to true, the specified action is not enforced.",
          type: {
            type: "boolean",
            description:
              "If set to true, the specified action is not enforced.",
          },
          required: false,
        },
        match: {
          name: "Match",
          description:
            "A match condition that incoming traffic is evaluated against.",
          type: {
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
        let path = `locations/global/securityPolicies/{securityPolicy}/patchRule`;

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

        if (input.event.inputConfig.preconfiguredWafConfig !== undefined)
          requestBody.preconfiguredWafConfig =
            input.event.inputConfig.preconfiguredWafConfig;
        if (input.event.inputConfig.networkMatch !== undefined)
          requestBody.networkMatch = input.event.inputConfig.networkMatch;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.rateLimitOptions !== undefined)
          requestBody.rateLimitOptions =
            input.event.inputConfig.rateLimitOptions;
        if (input.event.inputConfig.redirectOptions !== undefined)
          requestBody.redirectOptions = input.event.inputConfig.redirectOptions;
        if (input.event.inputConfig.action !== undefined)
          requestBody.action = input.event.inputConfig.action;
        if (input.event.inputConfig.headerAction !== undefined)
          requestBody.headerAction = input.event.inputConfig.headerAction;
        if (input.event.inputConfig.preview !== undefined)
          requestBody.preview = input.event.inputConfig.preview;
        if (input.event.inputConfig.match !== undefined)
          requestBody.match = input.event.inputConfig.match;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.priority !== undefined)
          requestBody.priority = input.event.inputConfig.priority;

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

export default organizationSecurityPoliciesPatchRule;
