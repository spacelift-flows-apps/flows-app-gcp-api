import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const securityPoliciesList: AppBlock = {
  name: "Security Policies - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Security Policies",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
            description:
              'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
            description:
              "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
            description:
              'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
            description:
              "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "boolean",
            description:
              "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.orderBy !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.orderBy);
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.returnPartialSuccess !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.returnPartialSuccess,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/securityPolicies",
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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                adaptiveProtectionConfig: {
                  type: "object",
                  properties: {
                    layer7DdosDefenseConfig: {
                      type: "object",
                      properties: {
                        enable: {
                          type: "boolean",
                          description:
                            "If set to true, enables CAAP for L7 DDoS detection. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
                        },
                        ruleVisibility: {
                          type: "string",
                          enum: [
                            "UNDEFINED_RULE_VISIBILITY",
                            "PREMIUM",
                            "STANDARD",
                          ],
                          description:
                            "Rule visibility can be one of the following: STANDARD - opaque rules. (default) PREMIUM - transparent rules. This field is only supported in Global Security Policies of type CLOUD_ARMOR. Check the RuleVisibility enum for the list of possible values.",
                        },
                        thresholdConfigs: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              autoDeployConfidenceThreshold: {
                                type: "number",
                              },
                              autoDeployExpirationSec: {
                                type: "integer",
                              },
                              autoDeployImpactedBaselineThreshold: {
                                type: "number",
                              },
                              autoDeployLoadThreshold: {
                                type: "number",
                              },
                              detectionAbsoluteQps: {
                                type: "number",
                              },
                              detectionLoadThreshold: {
                                type: "number",
                              },
                              detectionRelativeToBaselineQps: {
                                type: "number",
                              },
                              name: {
                                type: "string",
                                description:
                                  "The name must be 1-63 characters long, and comply withRFC1035. The name must be unique within the security policy.",
                              },
                              trafficGranularityConfigs: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    enableEachUniqueValue: {
                                      type: "boolean",
                                      description:
                                        "If enabled, traffic matching each unique value for the specified type constitutes a separate traffic unit. It can only be set to true if `value` is empty.",
                                    },
                                    type: {
                                      type: "string",
                                      enum: [
                                        "UNDEFINED_TYPE",
                                        "HTTP_HEADER_HOST",
                                        "HTTP_PATH",
                                        "UNSPECIFIED_TYPE",
                                      ],
                                      description:
                                        "Type of this configuration. Check the Type enum for the list of possible values.",
                                    },
                                    value: {
                                      type: "string",
                                      description:
                                        "Requests that match this value constitute a granular traffic unit.",
                                    },
                                  },
                                  description:
                                    "Configurations to specifc granular traffic units processed by Adaptive Protection.",
                                  additionalProperties: true,
                                },
                                description:
                                  "Configuration options for enabling Adaptive Protection to operate on specified granular traffic units.",
                              },
                            },
                            additionalProperties: true,
                          },
                          description:
                            "Configuration options for layer7 adaptive protection for various customizable thresholds.",
                        },
                      },
                      description:
                        "Configuration options for L7 DDoS detection. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Configuration options for Cloud Armor Adaptive Protection (CAAP).",
                  additionalProperties: true,
                },
                advancedOptionsConfig: {
                  type: "object",
                  properties: {
                    jsonCustomConfig: {
                      type: "object",
                      properties: {
                        contentTypes: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            'A list of custom Content-Type header values to apply the JSON parsing.  As per RFC 1341, a Content-Type header value has the following format:  Content-Type := type "/" subtype *[";" parameter]  When configuring a custom Content-Type header value, only the type/subtype needs to be specified, and the parameters should be excluded.',
                        },
                      },
                      additionalProperties: true,
                      description:
                        "Custom configuration to apply the JSON parsing. Only applicable when json_parsing is set to STANDARD.",
                    },
                    jsonParsing: {
                      type: "string",
                      enum: [
                        "UNDEFINED_JSON_PARSING",
                        "DISABLED",
                        "STANDARD",
                        "STANDARD_WITH_GRAPHQL",
                      ],
                      description:
                        "Check the JsonParsing enum for the list of possible values.",
                    },
                    logLevel: {
                      type: "string",
                      enum: ["UNDEFINED_LOG_LEVEL", "NORMAL", "VERBOSE"],
                      description:
                        "Check the LogLevel enum for the list of possible values.",
                    },
                    requestBodyInspectionSize: {
                      type: "string",
                      description:
                        'The maximum request size chosen by the customer with Waf enabled. Values supported are "8KB", "16KB, "32KB", "48KB" and "64KB". Values are case insensitive.',
                    },
                    userIpRequestHeaders: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "An optional list of case-insensitive request header names to use for resolving the callers client IP address.",
                    },
                  },
                  additionalProperties: true,
                },
                associations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      attachmentId: {
                        type: "string",
                        description:
                          "The resource that the security policy is attached to.",
                      },
                      displayName: {
                        type: "string",
                        description:
                          "Output only. [Output Only] The display name of the security policy of the association.",
                      },
                      excludedFolders: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of folders to exclude from the security policy.",
                      },
                      excludedProjects: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "A list of projects to exclude from the security policy.",
                      },
                      name: {
                        type: "string",
                        description: "The name for an association.",
                      },
                      securityPolicyId: {
                        type: "string",
                        description:
                          "Output only. [Output Only] The security policy ID of the association.",
                      },
                      shortName: {
                        type: "string",
                        description:
                          "Output only. [Output Only] The short name of the security policy of the association.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "A list of associations that belong to this policy.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                ddosProtectionConfig: {
                  type: "object",
                  properties: {
                    ddosProtection: {
                      type: "string",
                      enum: [
                        "UNDEFINED_DDOS_PROTECTION",
                        "ADVANCED",
                        "ADVANCED_PREVIEW",
                        "STANDARD",
                      ],
                      description:
                        "Check the DdosProtection enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Specifies a fingerprint for this resource, which is essentially a hash of the metadata's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make get() request to the security policy.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output only] Type of the resource. Alwayscompute#securityPolicyfor security policies",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this security policy, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.  To see the latest fingerprint, make get() request to the security policy.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                parent: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The parent of the security policy.",
                },
                recaptchaOptionsConfig: {
                  type: "object",
                  properties: {
                    redirectSiteKey: {
                      type: "string",
                      description:
                        "An optional field to supply a reCAPTCHA site key to be used for all the rules using the redirect action with the type of GOOGLE_RECAPTCHA under the security policy. The specified site key needs to be created from the reCAPTCHA API. The user is responsible for the validity of the specified site key. If not specified, a Google-managed site key is used. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
                    },
                  },
                  additionalProperties: true,
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the region where the regional security policy resides. This field is not applicable to global security policies.",
                },
                rules: {
                  type: "array",
                  items: {
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
                                  description:
                                    "The value to set the named header to.",
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
                            enum: ["UNDEFINED_VERSIONED_EXPR", "SRC_IPS_V1"],
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
                            description:
                              "Threshold at which to begin ratelimiting.",
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
                          "Parameters defining the redirect action. Cannot be specified for any other actions. This field is only supported in Global Security Policies of type CLOUD_ARMOR.",
                      },
                    },
                    description:
                      "Represents a rule that describes one or more match conditions along with the action to be taken when traffic matches this condition (allow or deny).",
                    additionalProperties: true,
                  },
                  description:
                    'A list of rules that belong to this policy. There must always be a default rule which is a rule with priority 2147483647 and match all condition (for the match condition this means match  "*" for srcIpRanges and for the networkMatch condition every field must be either match "*" or not set). If no rules are provided when creating a security policy, a default rule with action "allow" will be added.',
                },
                selfLink: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for the resource.",
                },
                shortName: {
                  type: "string",
                  description:
                    "User-provided name of the organization security policy. The name should be unique in the organization in which the security policy is created. This should only be used when SecurityPolicyType is CLOUD_ARMOR. The name must be 1-63 characters long, and comply with https://www.ietf.org/rfc/rfc1035.txt. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                type: {
                  type: "string",
                  enum: [
                    "UNDEFINED_TYPE",
                    "CLOUD_ARMOR",
                    "CLOUD_ARMOR_EDGE",
                    "CLOUD_ARMOR_NETWORK",
                  ],
                  description:
                    "The type indicates the intended use of the security policy.     - CLOUD_ARMOR: Cloud Armor backend security policies can    be configured to filter incoming HTTP requests targeting backend services.    They filter requests before they hit the origin servers.    - CLOUD_ARMOR_EDGE: Cloud Armor edge security policies can    be configured to filter incoming HTTP requests targeting backend services    (including Cloud CDN-enabled) as well as backend buckets (Cloud Storage).    They filter requests before the request is served from Google's cache.    - CLOUD_ARMOR_INTERNAL_SERVICE (preview only): Cloud Armor    internal service policies can be configured to filter HTTP requests    targeting services managed by Traffic Director in a service mesh. They    filter requests before the request is served from the application.  - CLOUD_ARMOR_NETWORK: Cloud Armor network policies can be configured to filter packets targeting network load balancing resources such as backend services, target pools, target instances, and instances with external IPs. They filter requests before the request is served from the application.   This field can be set only at resource creation time. Check the Type enum for the list of possible values.",
                },
                userDefinedFields: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      base: {
                        type: "string",
                        enum: ["UNDEFINED_BASE", "IPV4", "IPV6", "TCP", "UDP"],
                        description:
                          "The base relative to which 'offset' is measured. Possible values are:     - IPV4: Points to the beginning of the IPv4 header.    - IPV6: Points to the beginning of the IPv6 header.    - TCP: Points to the beginning of the TCP header, skipping    over any IPv4 options or IPv6 extension headers. Not present for    non-first fragments.    - UDP: Points to the beginning of the UDP header, skipping    over any IPv4 options or IPv6 extension headers. Not present for    non-first fragments.   required Check the Base enum for the list of possible values.",
                      },
                      mask: {
                        type: "string",
                        description:
                          'If specified, apply this mask (bitwise AND) to the field to ignore bits before matching. Encoded as a hexadecimal number (starting with "0x"). The last byte of the field (in network byte order) corresponds to the least significant byte of the mask.',
                      },
                      name: {
                        type: "string",
                        description:
                          "The name of this field. Must be unique within the policy.",
                      },
                      offset: {
                        type: "integer",
                        description:
                          "Offset of the first byte of the field (in network byte order) relative to 'base'.",
                      },
                      size: {
                        type: "integer",
                        description:
                          "Size of the field in bytes. Valid values: 1-4.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    'Definitions of user-defined fields for CLOUD_ARMOR_NETWORK policies. A user-defined field consists of up to 4 bytes extracted from a fixed offset in the packet, relative to the IPv4, IPv6, TCP, or UDP header, with an optional mask to select certain bits. Rules may then specify matching values for these fields.  Example:   userDefinedFields:  - name: "ipv4_fragment_offset"    base: IPV4    offset: 6    size: 2    mask: "0x1fff"',
                },
              },
              description:
                "Represents a Google Cloud Armor security policy resource.  Only external backend services that use load balancers can reference a security policy. For more information, see Google Cloud Armor security policy overview.",
              additionalProperties: true,
            },
            description: "A list of SecurityPolicy resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#securityPolicyList for listsof securityPolicies",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          warning: {
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default securityPoliciesList;
