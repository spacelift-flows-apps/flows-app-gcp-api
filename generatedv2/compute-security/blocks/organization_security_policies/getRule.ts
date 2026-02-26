import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getRule: AppBlock = {
  name: "Organization Security Policies - Get Rule",
  description: `Gets a rule at the specified priority.`,
  category: "Organization Security Policies",
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
            type: "string",
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
        if (input.event.inputConfig.priority !== undefined)
          queryParams["priority"] = String(input.event.inputConfig.priority);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/locations/global/securityPolicies/{security_policy}/getRule",
          pathParams,
          queryParams,
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
          action: {
            type: "string",
            description:
              "The Action to perform when the rule is matched. The following are the valid actions:     - allow: allow access to target.    - deny(STATUS): deny access to target, returns the    HTTP response code specified. Valid values for `STATUS`    are 403, 404, and 502.    - rate_based_ban: limit client traffic to the configured    threshold and ban the client if the traffic exceeds the threshold.    Configure parameters for this action in RateLimitOptions. Requires    rate_limit_options to be set.    - redirect: redirect to a different target. This can    either be an internal reCAPTCHA redirect, or an external URL-based    redirect via a 302 response. Parameters for this action can be configured    via redirectOptions. This action is only supported in Global Security    Policies of type CLOUD_ARMOR.    - throttle: limit    client traffic to the configured threshold. Configure parameters for this    action in rateLimitOptions. Requires rate_limit_options to be set for    this.    - fairshare (preview only): when traffic reaches the    threshold limit, requests from the clients matching this rule begin to be    rate-limited using the Fair Share algorithm. This action is only allowed    in security policies of type `CLOUD_ARMOR_INTERNAL_SERVICE`.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          headerAction: {
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
          kind: {
            type: "string",
            description:
              "Output only. [Output only] Type of the resource. Alwayscompute#securityPolicyRule for security policy rules",
          },
          match: {
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
                description:
                  "Preconfigured versioned expression. If this field is specified, config must also be specified. Available preconfigured expressions along with their requirements are: SRC_IPS_V1 - must specify the corresponding src_ip_range field in config. Check the VersionedExpr enum for the list of possible values.",
              },
            },
            description:
              "Represents a match condition that incoming traffic is evaluated against. Exactly one field must be specified.",
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
          preconfiguredWafConfig: {
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
          preview: {
            type: "boolean",
            description:
              "If set to true, the specified action is not enforced.",
          },
          priority: {
            type: "integer",
            description:
              "An integer indicating the priority of a rule in the list. The priority must be a positive value between 0 and 2147483647. Rules are evaluated from highest to lowest priority where 0 is the highest priority and 2147483647 is the lowest priority.",
          },
          rateLimitOptions: {
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
          redirectOptions: {
            type: "object",
            properties: {
              target: {
                type: "string",
                description:
                  "Target for the redirect action. This is required if the type is EXTERNAL_302 and cannot be specified for GOOGLE_RECAPTCHA.",
              },
              type: {
                type: "string",
                description:
                  "Type of the redirect action. Possible values are:     - GOOGLE_RECAPTCHA: redirect to reCAPTCHA for manual    challenge assessment.    - EXTERNAL_302: redirect to a different URL via a 302    response. Check the Type enum for the list of possible values.",
              },
            },
            additionalProperties: true,
            description:
              "Parameters defining the redirect action. Cannot be specified for any other actions. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
          },
        },
        description:
          "Represents a rule that describes one or more match conditions along with the action to be taken when traffic matches this condition (allow or deny).",
        additionalProperties: true,
      },
    },
  },
};

export default getRule;
