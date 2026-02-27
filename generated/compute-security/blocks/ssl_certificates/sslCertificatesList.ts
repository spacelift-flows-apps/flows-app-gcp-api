import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const sslCertificatesList: AppBlock = {
  name: "SSL Certificates - List",
  description: `Retrieves the list of SslCertificate resources available to the specified project.`,
  category: "SSL Certificates",
  inputs: {
    default: {
      config: {
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
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
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
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
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
        let path = `projects/{project}/global/sslCertificates`;

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
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                type: {
                  type: "string",
                  enum: ["MANAGED", "SELF_MANAGED", "TYPE_UNSPECIFIED"],
                  description:
                    '(Optional) Specifies the type of SSL certificate, either "SELF_MANAGED" or\n"MANAGED". If not specified, the certificate is self-managed and the fieldscertificate and private_key are used.',
                },
                managed: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: [
                        "ACTIVE",
                        "MANAGED_CERTIFICATE_STATUS_UNSPECIFIED",
                        "PROVISIONING",
                        "PROVISIONING_FAILED",
                        "PROVISIONING_FAILED_PERMANENTLY",
                        "RENEWAL_FAILED",
                      ],
                      description:
                        "[Output only] Status of the managed certificate resource.",
                    },
                    domains: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The domains for which a managed SSL certificate will be generated. Each\nGoogle-managed SSL certificate supports up to the [maximum number of\ndomains per Google-managed SSL\ncertificate](/load-balancing/docs/quotas#ssl_certificates).",
                    },
                    domainStatus: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "[Output only] Detailed statuses of the domains specified for managed\ncertificate resource.",
                    },
                  },
                  description:
                    "Configuration and status of a managed SSL certificate.",
                  additionalProperties: true,
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
                },
                subjectAlternativeNames: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] Domains associated with the certificate via Subject\nAlternative Name.",
                },
                expireTime: {
                  type: "string",
                  description:
                    "[Output Only] Expire time of the certificate. RFC3339",
                },
                selfManaged: {
                  type: "object",
                  properties: {
                    privateKey: {
                      type: "string",
                      description:
                        "A write-only private key in PEM format. Only insert\nrequests will include this field.",
                    },
                    certificate: {
                      type: "string",
                      description:
                        "A local certificate file. The certificate must be in\nPEM format. The certificate chain must be no greater than 5 certs\nlong. The chain must include at least one intermediate cert.",
                    },
                  },
                  description:
                    "Configuration and status of a self-managed SSL certificate.",
                  additionalProperties: true,
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#sslCertificate for SSL certificates.",
                },
                privateKey: {
                  type: "string",
                  description:
                    "A value read into memory from a write-only private key file. The private\nkey file must be in PEM format. For security, only insert\nrequests include this field.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the regional SSL Certificate\nresides. This field is not applicable to global SSL Certificate.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output only] Server-defined URL for the resource.",
                },
                certificate: {
                  type: "string",
                  description:
                    "A value read into memory from a certificate file. The certificate file must\nbe in PEM format. The certificate chain must be no greater than 5 certs\nlong. The chain must include at least one intermediate cert.",
                },
              },
              description:
                "Represents an SSL certificate resource.\n\nGoogle Compute Engine has two SSL certificate resources:\n\n* [Global](/compute/docs/reference/rest/v1/sslCertificates)\n* [Regional](/compute/docs/reference/rest/v1/regionSslCertificates)\n\n\nThe global SSL certificates (sslCertificates) are used by:\n   \n   - Global external Application Load Balancers\n   - Classic Application Load Balancers\n   - Proxy Network Load Balancers (with target SSL proxies)\n\n\n\nThe regional SSL certificates (regionSslCertificates) are used\nby:\n   \n   - Regional external Application Load Balancers\n   - Regional internal Application Load Balancers\n\n\n\nOptionally, certificate file contents that you upload can contain a set of up\nto five PEM-encoded certificates.\nThe API call creates an object (sslCertificate) that holds this data.\nYou can use SSL keys and certificates to secure connections to a load\nbalancer.\nFor more information, read \nCreating and using SSL certificates,SSL certificates\nquotas and limits, and\nTroubleshooting SSL certificates.",
              additionalProperties: true,
            },
            description: "A list of SslCertificate resources.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          kind: {
            type: "string",
            description: "Type of resource.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          warning: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    value: {
                      type: "string",
                      description:
                        "[Output Only] A warning data value corresponding to the key.",
                    },
                    key: {
                      type: "string",
                      description:
                        "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
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
              message: {
                type: "string",
                description:
                  "[Output Only] A human-readable description of the warning code.",
              },
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "Contains a list of SslCertificate resources.",
        additionalProperties: true,
      },
    },
  },
};

export default sslCertificatesList;
