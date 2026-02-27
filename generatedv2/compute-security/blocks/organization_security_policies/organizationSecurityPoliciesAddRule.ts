import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const organizationSecurityPoliciesAddRule: AppBlock = {
  name: "Organization Security Policies - Add Rule",
  description: `Inserts a rule into a security policy.`,
  category: "Organization Security Policies",
  inputs: {
    default: {
      config: {
        securityPolicy: {
          name: "Security Policy",
          description: "Name of the security policy to update.",
          type: {
            type: "string",
            description: "Name of the security policy to update.",
          },
          required: true,
        },
        action: {
          name: "Action",
          description:
            "The Action to perform when the rule is matched. The following are the valid actions:     - allow: allow access to target.    - deny(STATUS): deny access to target, returns the    HTTP response code specified. Valid values for `STATUS`    are 403, 404, and 502.    - rate_based_ban: limit client traffic to the configured    threshold and ban the client if the traffic exceeds the threshold.    Configure parameters for this action in RateLimitOptions. Requires    rate_limit_options to be set.    - redirect: redirect to a different target. This can    either be an internal reCAPTCHA redirect, or an external URL-based    redirect via a 302 response. Parameters for this action can be configured    via redirectOptions. This action is only supported in Global Security    Policies of type CLOUD_ARMOR.    - throttle: limit    client traffic to the configured threshold. Configure parameters for this    action in rateLimitOptions. Requires rate_limit_options to be set for    this.    - fairshare (preview only): when traffic reaches the    threshold limit, requests from the clients matching this rule begin to be    rate-limited using the Fair Share algorithm. This action is only allowed    in security policies of type `CLOUD_ARMOR_INTERNAL_SERVICE`.",
          type: {
            type: "string",
            description:
              "The Action to perform when the rule is matched. The following are the valid actions:     - allow: allow access to target.    - deny(STATUS): deny access to target, returns the    HTTP response code specified. Valid values for `STATUS`    are 403, 404, and 502.    - rate_based_ban: limit client traffic to the configured    threshold and ban the client if the traffic exceeds the threshold.    Configure parameters for this action in RateLimitOptions. Requires    rate_limit_options to be set.    - redirect: redirect to a different target. This can    either be an internal reCAPTCHA redirect, or an external URL-based    redirect via a 302 response. Parameters for this action can be configured    via redirectOptions. This action is only supported in Global Security    Policies of type CLOUD_ARMOR.    - throttle: limit    client traffic to the configured threshold. Configure parameters for this    action in rateLimitOptions. Requires rate_limit_options to be set for    this.    - fairshare (preview only): when traffic reaches the    threshold limit, requests from the clients matching this rule begin to be    rate-limited using the Fair Share algorithm. This action is only allowed    in security policies of type `CLOUD_ARMOR_INTERNAL_SERVICE`.",
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
        headerAction: {
          name: "Header Action",
          description:
            "Optional, additional actions that are performed on headers. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
          type: {
            type: "object",
            properties: {
              requestHeadersToAdds: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    headerName: {
                      type: "string",
                      description: "The name of the header to set.",
                    },
                    headerValue: {
                      type: "string",
                      description: "The value to set the named header to.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "The list of request headers to add or overwrite if they're already present.",
              },
            },
            additionalProperties: true,
            description:
              "Optional, additional actions that are performed on headers. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output only] Type of the resource. Alwayscompute#securityPolicyRule for security policy rules",
          type: {
            type: "string",
            description:
              "Output only. [Output only] Type of the resource. Alwayscompute#securityPolicyRule for security policy rules",
          },
          required: false,
        },
        match: {
          name: "Match",
          description:
            "A match condition that incoming traffic is evaluated against. If it evaluates to true, the corresponding 'action' is enforced.",
          type: {
            type: "object",
            properties: {
              config: {
                type: "object",
                properties: {
                  srcIpRanges: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "CIDR IP address range. Maximum number of src_ip_ranges allowed is 10.",
                  },
                },
                additionalProperties: true,
                description:
                  "The configuration options available when specifying versioned_expr. This field must be specified if versioned_expr is specified and cannot be specified if versioned_expr is not specified.",
              },
              expr: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    description:
                      "Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.",
                  },
                  expression: {
                    type: "string",
                    description:
                      "Textual representation of an expression in Common Expression Language syntax.",
                  },
                  location: {
                    type: "string",
                    description:
                      "Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file.",
                  },
                  title: {
                    type: "string",
                    description:
                      "Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.",
                  },
                },
                description:
                  'Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec.  Example (Comparison):      title: "Summary size limit"     description: "Determines if a summary is less than 100 chars"     expression: "document.summary.size() < 100"  Example (Equality):      title: "Requestor is owner"     description: "Determines if requestor is the document owner"     expression: "document.owner == request.auth.claims.email"  Example (Logic):      title: "Public documents"     description: "Determine whether the document should be publicly visible"     expression: "document.type != \'private\' && document.type != \'internal\'"  Example (Data Manipulation):      title: "Notification string"     description: "Create a notification string with a timestamp."     expression: "\'New message received at \' + string(document.create_time)"  The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.',
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
                          "A list of site keys to be used during the validation of reCAPTCHA action-tokens. The provided site keys need to be created from reCAPTCHA API under the same project where the security policy is created.",
                      },
                      sessionTokenSiteKeys: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of site keys to be used during the validation of reCAPTCHA session-tokens. The provided site keys need to be created from reCAPTCHA API under the same project where the security policy is created.",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "reCAPTCHA configuration options to be applied for the rule. If the rule does not evaluate reCAPTCHA tokens, this field has no effect.",
                  },
                },
                additionalProperties: true,
                description:
                  "The configuration options available when specifying a user defined CEVAL expression (i.e., 'expr').",
              },
              versionedExpr: {
                type: "string",
                enum: ["UNDEFINED_VERSIONED_EXPR", "SRC_IPS_V1"],
                description:
                  "Preconfigured versioned expression. If this field is specified, config must also be specified. Available preconfigured expressions along with their requirements are: SRC_IPS_V1 - must specify the corresponding src_ip_range field in config. Check the VersionedExpr enum for the list of possible values.",
              },
            },
            description:
              "Represents a match condition that incoming traffic is evaluated against. Exactly one field must be specified.",
            additionalProperties: true,
          },
          required: false,
        },
        networkMatch: {
          name: "Network Match",
          description:
            "A match condition that incoming packets are evaluated against for CLOUD_ARMOR_NETWORK security policies. If it matches, the corresponding 'action' is enforced.  The match criteria for a rule consists of built-in match fields (like 'srcIpRanges') and potentially multiple user-defined match fields ('userDefinedFields').  Field values may be extracted directly from the packet or derived from it (e.g. 'srcRegionCodes'). Some fields may not be present in every packet (e.g. 'srcPorts'). A user-defined field is only present if the base header is found in the packet and the entire field is in bounds.  Each match field may specify which values can match it, listing one or more ranges, prefixes, or exact values that are considered a match for the field. A field value must be present in order to match a specified match field. If no match values are specified for a match field, then any field value is considered to match it, and it's not required to be present. For strings specifying '*' is also equivalent to match all.  For a packet to match a rule, all specified match fields must match the corresponding field values derived from the packet.  Example:  networkMatch:   srcIpRanges:   - \"192.0.2.0/24\"   - \"198.51.100.0/24\"   userDefinedFields:   - name: \"ipv4_fragment_offset\"     values:     - \"1-0x1fff\"  The above match condition matches packets with a source IP in 192.0.2.0/24 or 198.51.100.0/24 and a user-defined field named \"ipv4_fragment_offset\" with a value between 1 and 0x1fff inclusive.",
          type: {
            type: "object",
            properties: {
              destIpRanges: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Destination IPv4/IPv6 addresses or CIDR prefixes, in standard text format.",
              },
              destPorts: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'Destination port numbers for TCP/UDP/SCTP. Each element can be a 16-bit unsigned decimal number (e.g. "80") or range (e.g. "0-1023").',
              },
              ipProtocols: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'IPv4 protocol / IPv6 next header (after extension headers). Each element can be an 8-bit unsigned decimal number (e.g. "6"), range (e.g. "253-254"), or one of the following protocol names: "tcp", "udp", "icmp", "esp", "ah", "ipip", or "sctp".',
              },
              srcAsns: {
                type: "array",
                items: {
                  type: "integer",
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
              srcPorts: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'Source port numbers for TCP/UDP/SCTP. Each element can be a 16-bit unsigned decimal number (e.g. "80") or range (e.g. "0-1023").',
              },
              srcRegionCodes: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Two-letter ISO 3166-1 alpha-2 country code associated with the source IP address.",
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
                        'Matching values of the field. Each element can be a 32-bit unsigned decimal or hexadecimal (starting with "0x") number (e.g. "64") or range (e.g.  "0x400-0x7ff").',
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "User-defined fields. Each element names a defined field and lists the matching values for that field.",
              },
            },
            description:
              "Represents a match condition that incoming network traffic is evaluated against.",
            additionalProperties: true,
          },
          required: false,
        },
        preconfiguredWafConfig: {
          name: "Preconfigured Waf Config",
          description:
            "Preconfigured WAF configuration to be applied for the rule. If the rule does not evaluate preconfigured WAF rules, i.e., if evaluatePreconfiguredWaf() is not used, this field will have no effect.",
          type: {
            type: "object",
            properties: {
              exclusions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    requestCookiesToExclude: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          op: {
                            type: "string",
                            enum: [
                              "UNDEFINED_OP",
                              "CONTAINS",
                              "ENDS_WITH",
                              "EQUALS",
                              "EQUALS_ANY",
                              "STARTS_WITH",
                            ],
                            description:
                              "The match operator for the field. Check the Op enum for the list of possible values.",
                          },
                          val: {
                            type: "string",
                            description: "The value of the field.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A list of request cookie names whose value will be excluded from inspection during preconfigured WAF evaluation.",
                    },
                    requestHeadersToExclude: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          op: {
                            type: "string",
                            enum: [
                              "UNDEFINED_OP",
                              "CONTAINS",
                              "ENDS_WITH",
                              "EQUALS",
                              "EQUALS_ANY",
                              "STARTS_WITH",
                            ],
                            description:
                              "The match operator for the field. Check the Op enum for the list of possible values.",
                          },
                          val: {
                            type: "string",
                            description: "The value of the field.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A list of request header names whose value will be excluded from inspection during preconfigured WAF evaluation.",
                    },
                    requestQueryParamsToExclude: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          op: {
                            type: "string",
                            enum: [
                              "UNDEFINED_OP",
                              "CONTAINS",
                              "ENDS_WITH",
                              "EQUALS",
                              "EQUALS_ANY",
                              "STARTS_WITH",
                            ],
                            description:
                              "The match operator for the field. Check the Op enum for the list of possible values.",
                          },
                          val: {
                            type: "string",
                            description: "The value of the field.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A list of request query parameter names whose value will be excluded from inspection during preconfigured WAF evaluation. Note that the parameter can be in the query string or in the POST body.",
                    },
                    requestUrisToExclude: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          op: {
                            type: "string",
                            enum: [
                              "UNDEFINED_OP",
                              "CONTAINS",
                              "ENDS_WITH",
                              "EQUALS",
                              "EQUALS_ANY",
                              "STARTS_WITH",
                            ],
                            description:
                              "The match operator for the field. Check the Op enum for the list of possible values.",
                          },
                          val: {
                            type: "string",
                            description: "The value of the field.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "A list of request URIs from the request line to be excluded from inspection during preconfigured WAF evaluation. When specifying this field, the query or fragment part should be excluded.",
                    },
                    targetRuleIds: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "A list of target rule IDs under the WAF rule set to apply the preconfigured WAF exclusion. If omitted, it refers to all the rule IDs under the WAF rule set.",
                    },
                    targetRuleSet: {
                      type: "string",
                      description:
                        "Target WAF rule set to apply the preconfigured WAF exclusion.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "A list of exclusions to apply during preconfigured WAF evaluation.",
              },
            },
            additionalProperties: true,
            description:
              "Preconfigured WAF configuration to be applied for the rule. If the rule does not evaluate preconfigured WAF rules, i.e., if evaluatePreconfiguredWaf() is not used, this field will have no effect.",
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
        priority: {
          name: "Priority",
          description:
            "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
          type: {
            type: "integer",
            description:
              "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
          },
          required: false,
        },
        rateLimitOptions: {
          name: "Rate Limit Options",
          description:
            'Must be specified if the action is "rate_based_ban" or "throttle" or "fairshare". Cannot be specified for any other actions.',
          type: {
            type: "object",
            properties: {
              banDurationSec: {
                type: "integer",
                description:
                  'Can only be specified if the action for the rule is "rate_based_ban". If specified, determines the time (in seconds) the traffic will continue to be banned by the rate limit after the rate falls below the threshold.',
              },
              banThreshold: {
                type: "object",
                properties: {
                  count: {
                    type: "integer",
                    description:
                      "Number of HTTP(S) requests for calculating the threshold.",
                  },
                  intervalSec: {
                    type: "integer",
                    description:
                      "Interval over which the threshold is computed.",
                  },
                },
                additionalProperties: true,
                description:
                  "Can only be specified if the action for the rule is \"rate_based_ban\". If specified, the key will be banned for the configured 'ban_duration_sec' when the number of requests that exceed the 'rate_limit_threshold' also exceed this 'ban_threshold'.",
              },
              conformAction: {
                type: "string",
                description:
                  'Action to take for requests that are under the configured rate limit threshold. Valid option is "allow" only.',
              },
              enforceOnKey: {
                type: "string",
                enum: [
                  "UNDEFINED_ENFORCE_ON_KEY",
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
                  'Determines the key to enforce the rate_limit_threshold on. Possible values are:     - ALL: A single rate limit threshold is applied to all    the requests matching this rule. This is the default value if    "enforceOnKey" is not configured.    - IP: The source IP address of    the request is the key. Each IP has this limit enforced    separately.    - HTTP_HEADER: The value of the HTTP    header whose name is configured under "enforceOnKeyName". The key    value is truncated to the first 128 bytes of the header value. If no    such header is present in the request, the key type defaults toALL.    - XFF_IP: The first IP address (i.e. the    originating client IP address) specified in the list of IPs under    X-Forwarded-For HTTP header. If no such header is present or the value    is not a valid IP, the key defaults to the source IP address of    the request i.e. key type IP.    - HTTP_COOKIE: The value of the HTTP    cookie whose name is configured under "enforceOnKeyName". The key    value is truncated to the first 128 bytes of the cookie value. If no    such cookie is present in the request, the key type defaults toALL.    - HTTP_PATH: The URL path of the HTTP request. The key    value is truncated to the first 128 bytes.    - SNI: Server name indication in the TLS session of the    HTTPS request. The key value is truncated to the first 128 bytes. The    key type defaults to ALL on a HTTP session.    - REGION_CODE: The country/region from which the request    originates.    - TLS_JA3_FINGERPRINT: JA3 TLS/SSL fingerprint if the    client connects using HTTPS, HTTP/2 or HTTP/3. If not available, the    key type defaults to ALL.    - USER_IP: The IP address of the originating client,    which is resolved based on "userIpRequestHeaders" configured with the    security policy. If there is no "userIpRequestHeaders" configuration or    an IP address cannot be resolved from it, the key type defaults toIP.  - TLS_JA4_FINGERPRINT: JA4 TLS/SSL fingerprint if the client connects using HTTPS, HTTP/2 or HTTP/3. If not available, the key type defaults to ALL. For "fairshare" action, this value is limited to ALL i.e. a single rate limit threshold is enforced for all the requests matching the rule. Check the EnforceOnKey enum for the list of possible values.',
              },
              enforceOnKeyConfigs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    enforceOnKeyName: {
                      type: "string",
                      description:
                        "Rate limit key name applicable only for the following key types: HTTP_HEADER -- Name of the HTTP header whose value is taken as the key value. HTTP_COOKIE -- Name of the HTTP cookie whose value is taken as the key value.",
                    },
                    enforceOnKeyType: {
                      type: "string",
                      enum: [
                        "UNDEFINED_ENFORCE_ON_KEY_TYPE",
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
                        'Determines the key to enforce the rate_limit_threshold on. Possible values are:     - ALL: A single rate limit threshold is applied to all    the requests matching this rule. This is the default value if    "enforceOnKeyConfigs" is not configured.    - IP: The source IP address of    the request is the key. Each IP has this limit enforced    separately.    - HTTP_HEADER: The value of the HTTP    header whose name is configured under "enforceOnKeyName". The key    value is truncated to the first 128 bytes of the header value. If no    such header is present in the request, the key type defaults toALL.    - XFF_IP: The first IP address (i.e. the    originating client IP address) specified in the list of IPs under    X-Forwarded-For HTTP header. If no such header is present or the    value is not a valid IP, the key defaults to the source IP address of    the request i.e. key type IP.    - HTTP_COOKIE: The value of the HTTP    cookie whose name is configured under "enforceOnKeyName". The key    value is truncated to the first 128 bytes of the cookie value. If no    such cookie is present in the request, the key type defaults toALL.    - HTTP_PATH: The URL path of the HTTP request. The key    value is truncated to the first 128 bytes.    - SNI: Server name indication in the TLS session of    the HTTPS request. The key value is truncated to the first 128 bytes.    The key type defaults to ALL on a HTTP session.    - REGION_CODE: The country/region from which the    request originates.    - TLS_JA3_FINGERPRINT: JA3 TLS/SSL fingerprint if the    client connects using HTTPS, HTTP/2 or HTTP/3. If not available, the    key type defaults to ALL.    - USER_IP: The IP address of the originating client,    which is resolved based on "userIpRequestHeaders" configured with the    security policy. If there is no "userIpRequestHeaders" configuration    or an IP address cannot be resolved from it, the key type defaults toIP.  - TLS_JA4_FINGERPRINT: JA4 TLS/SSL fingerprint if the client connects using HTTPS, HTTP/2 or HTTP/3. If not available, the key type defaults to ALL. Check the EnforceOnKeyType enum for the list of possible values.',
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "If specified, any combination of values of enforce_on_key_type/enforce_on_key_name is treated as the key on which ratelimit threshold/action is enforced. You can specify up to 3 enforce_on_key_configs. If enforce_on_key_configs is specified, enforce_on_key must not be specified.",
              },
              enforceOnKeyName: {
                type: "string",
                description:
                  "Rate limit key name applicable only for the following key types: HTTP_HEADER -- Name of the HTTP header whose value is taken as the key value. HTTP_COOKIE -- Name of the HTTP cookie whose value is taken as the key value.",
              },
              exceedAction: {
                type: "string",
                description:
                  "Action to take for requests that are above the configured rate limit threshold, to either deny with a specified HTTP response code, or redirect to a different endpoint. Valid options are `deny(STATUS)`, where valid values for `STATUS` are 403, 404, 429, and 502, and `redirect`, where the redirect parameters come from `exceedRedirectOptions` below. The `redirect` action is only supported in Global Security Policies of type CLOUD_ARMOR.",
              },
              exceedRedirectOptions: {
                type: "object",
                properties: {
                  target: {
                    type: "string",
                    description:
                      "Target for the redirect action. This is required if the type is EXTERNAL_302 and cannot be specified for GOOGLE_RECAPTCHA.",
                  },
                  type: {
                    type: "string",
                    enum: [
                      "UNDEFINED_TYPE",
                      "EXTERNAL_302",
                      "GOOGLE_RECAPTCHA",
                    ],
                    description:
                      "Type of the redirect action. Possible values are:     - GOOGLE_RECAPTCHA: redirect to reCAPTCHA for manual    challenge assessment.    - EXTERNAL_302: redirect to a different URL via a 302    response. Check the Type enum for the list of possible values.",
                  },
                },
                additionalProperties: true,
                description:
                  "Parameters defining the redirect action that is used as the exceed action. Cannot be specified if the exceed action is not redirect. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
              },
              rateLimitThreshold: {
                type: "object",
                properties: {
                  count: {
                    type: "integer",
                    description:
                      "Number of HTTP(S) requests for calculating the threshold.",
                  },
                  intervalSec: {
                    type: "integer",
                    description:
                      "Interval over which the threshold is computed.",
                  },
                },
                additionalProperties: true,
                description: "Threshold at which to begin ratelimiting.",
              },
            },
            additionalProperties: true,
            description:
              'Must be specified if the action is "rate_based_ban" or "throttle" or "fairshare". Cannot be specified for any other actions.',
          },
          required: false,
        },
        redirectOptions: {
          name: "Redirect Options",
          description:
            "Parameters defining the redirect action. Cannot be specified for any other actions. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
          type: {
            type: "object",
            properties: {
              target: {
                type: "string",
                description:
                  "Target for the redirect action. This is required if the type is EXTERNAL_302 and cannot be specified for GOOGLE_RECAPTCHA.",
              },
              type: {
                type: "string",
                enum: ["UNDEFINED_TYPE", "EXTERNAL_302", "GOOGLE_RECAPTCHA"],
                description:
                  "Type of the redirect action. Possible values are:     - GOOGLE_RECAPTCHA: redirect to reCAPTCHA for manual    challenge assessment.    - EXTERNAL_302: redirect to a different URL via a 302    response. Check the Type enum for the list of possible values.",
              },
            },
            additionalProperties: true,
            description:
              "Parameters defining the redirect action. Cannot be specified for any other actions. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
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
        if (input.event.inputConfig.securityPolicy !== undefined)
          pathParams["security_policy"] = String(
            input.event.inputConfig.securityPolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.action !== undefined)
          body.action = input.event.inputConfig.action;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.headerAction !== undefined)
          body.headerAction = input.event.inputConfig.headerAction;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.match !== undefined)
          body.match = input.event.inputConfig.match;
        if (input.event.inputConfig.networkMatch !== undefined)
          body.networkMatch = input.event.inputConfig.networkMatch;
        if (input.event.inputConfig.preconfiguredWafConfig !== undefined)
          body.preconfiguredWafConfig =
            input.event.inputConfig.preconfiguredWafConfig;
        if (input.event.inputConfig.preview !== undefined)
          body.preview = input.event.inputConfig.preview;
        if (input.event.inputConfig.priority !== undefined)
          body.priority = input.event.inputConfig.priority;
        if (input.event.inputConfig.rateLimitOptions !== undefined)
          body.rateLimitOptions = input.event.inputConfig.rateLimitOptions;
        if (input.event.inputConfig.redirectOptions !== undefined)
          body.redirectOptions = input.event.inputConfig.redirectOptions;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/locations/global/securityPolicies/{security_policy}/addRule",
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

export default organizationSecurityPoliciesAddRule;
