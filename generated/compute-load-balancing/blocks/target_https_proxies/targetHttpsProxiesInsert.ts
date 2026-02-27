import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const targetHttpsProxiesInsert: AppBlock = {
  name: "Target HTTPS Proxies - Insert",
  description: `Creates a TargetHttpsProxy resource in the specified project using the data included in the request.`,
  category: "Target HTTPS Proxies",
  inputs: {
    default: {
      config: {
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
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
        sslPolicy: {
          name: "SSL Policy",
          description:
            "URL of SslPolicy resource that will be associated with the TargetHttpsProxy resource.",
          type: {
            type: "string",
            description:
              "URL of SslPolicy resource that will be associated with the TargetHttpsProxy\nresource. If not set, the TargetHttpsProxy resource has no\nSSL policy configured.",
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
        region: {
          name: "Region",
          description:
            "[Output Only] URL of the region where the regional TargetHttpsProxy resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional TargetHttpsProxy\nresides. This field is not applicable to global TargetHttpsProxies.",
          },
          required: false,
        },
        tlsEarlyData: {
          name: "TLS Early Data",
          description: "Specifies whether TLS 1.",
          type: {
            type: "string",
            enum: ["DISABLED", "PERMISSIVE", "STRICT", "UNRESTRICTED"],
            description:
              'Specifies whether TLS 1.3 0-RTT Data ("Early Data") should be accepted\nfor this service. Early Data allows a TLS resumption handshake to include\nthe initial application payload (a HTTP request) alongside the handshake,\nreducing the effective round trips to "zero". This applies to TLS 1.3\nconnections over TCP (HTTP/2) as well as over UDP (QUIC/h3).\n\n\nThis can improve application performance, especially on networks where\ninterruptions may be common, such as on mobile.\n\n\nRequests with Early Data will have the "Early-Data" HTTP header set on\nthe request, with a value of "1", to allow the backend to determine whether\nEarly Data was included.\n\n\nNote: TLS Early Data may allow requests to be replayed, as the data is\nsent to the backend before the handshake has fully completed. Applications\nthat allow idempotent HTTP methods to make non-idempotent changes, such as\na GET request updating a database, should not accept Early Data on those\nrequests, and reject requests with the "Early-Data: 1" HTTP header by\nreturning a HTTP 425 (Too Early) status code, in order to remain RFC\ncompliant.\n\n\nThe default value is DISABLED.',
          },
          required: false,
        },
        authorizationPolicy: {
          name: "Authorization Policy",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. A URL referring to a networksecurity.AuthorizationPolicy resource\nthat describes how the proxy should authorize inbound traffic. If left\nblank, access will not be restricted by an authorization policy.\n\n Refer to the AuthorizationPolicy resource for additional\ndetails.\n\n authorizationPolicy only applies to a globalTargetHttpsProxy attached toglobalForwardingRules with theloadBalancingScheme set to INTERNAL_SELF_MANAGED.\n\n Note: This field currently has no impact.",
          },
          required: false,
        },
        urlMap: {
          name: "URL Map",
          description:
            "A fully-qualified or valid partial URL to the UrlMap resource that defines the mapping from URL to the BackendService.",
          type: {
            type: "string",
            description:
              "A fully-qualified or valid partial URL to the UrlMap resource that defines\nthe mapping from URL to the BackendService. For example, the following are\nall valid URLs for specifying a URL map:\n   \n   - https://www.googleapis.compute/v1/projects/project/global/urlMaps/url-map \n   - projects/project/global/urlMaps/url-map \n   - global/urlMaps/url-map",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description: "Fingerprint of this resource.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a TargetHttpsProxy. An up-to-date fingerprint must\nbe provided in order to patch the TargetHttpsProxy; otherwise, the request\nwill fail with error 412 conditionNotMet. To see the latest\nfingerprint, make a get() request to retrieve the\nTargetHttpsProxy. (Format: byte)",
          },
          required: false,
        },
        httpKeepAliveTimeoutSec: {
          name: "HTTP Keep Alive Timeout Sec",
          description:
            "Specifies how long to keep a connection open, after completing a response, while there is no matching traffic (in seconds).",
          type: {
            type: "integer",
            description:
              "Specifies how long to keep a connection open, after completing a response,\nwhile there is no matching traffic (in seconds). If an HTTP keep-alive is\nnot specified, a default value (610 seconds) will be used.\n\nFor global external Application Load Balancers, the minimum allowed value\nis 5 seconds and the maximum allowed value is 1200 seconds.\n\nFor classic Application Load Balancers, this option is not supported. (Format: int32)",
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
        sslCertificates: {
          name: "SSL Certificates",
          description:
            "URLs to SslCertificate resources that are used to authenticate connections between users and the load balancer.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs to SslCertificate resources that are used to authenticate\nconnections between users and the load balancer. At least one SSL\ncertificate must be specified. SslCertificates do not apply when the load\nbalancing scheme is set to INTERNAL_SELF_MANAGED.\n\nThe URLs should refer to a SSL Certificate resource or Certificate Manager\nCertificate resource. Mixing Classic Certificates and Certificate Manager\nCertificates is not allowed. Certificate Manager Certificates must include\nthe certificatemanager API namespace. Using Certificate Manager\nCertificates in this field is not supported by Global external Application\nLoad Balancer or Classic Application Load Balancer, use certificate_map\ninstead.\n\nCurrently, you may specify up to 15 Classic SSL Certificates or up to 100\nCertificate Manager Certificates.\n\nCertificate Manager Certificates accepted formats are:\n   \n   - //certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificates/{resourceName}.\n   - https://certificatemanager.googleapis.com/v1alpha1/projects/{project}/locations/{location}/certificates/{resourceName}.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description: "[Output Only] The unique identifier for the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          required: false,
        },
        proxyBind: {
          name: "Proxy Bind",
          description:
            "This field only applies when the forwarding rule that references this target proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.",
          type: {
            type: "boolean",
            description:
              "This field only applies when the forwarding rule that references this\ntarget proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.\n\nWhen this field is set to true, Envoy proxies set up inbound\ntraffic interception and bind to the IP address and port specified in the\nforwarding rule. This is generally useful when using Traffic Director to\nconfigure Envoy as a gateway or middle proxy (in other words, not a\nsidecar proxy). The Envoy proxy listens for inbound requests and handles\nrequests when it receives them.\n\nThe default is false.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of resource. Alwayscompute#targetHttpsProxy for target HTTPS proxies.",
          },
          required: false,
        },
        certificateMap: {
          name: "Certificate Map",
          description:
            "URL of a certificate map that identifies a certificate map associated with the given target proxy.",
          type: {
            type: "string",
            description:
              "URL of a certificate map that identifies a certificate map associated with\nthe given target proxy.\nThis field can only be set for Global external Application Load Balancer or\nClassic Application Load Balancer. For other products use Certificate\nManager Certificates instead.\n\nIf set, sslCertificates will be ignored.\n\n Accepted format is//certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificateMaps/{resourceName}.",
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
        serverTlsPolicy: {
          name: "Server TLS Policy",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. A URL referring to a networksecurity.ServerTlsPolicy resource\nthat describes how the proxy should authenticate inbound traffic.\n\n serverTlsPolicy only applies to a globalTargetHttpsProxy attached toglobalForwardingRules with theloadBalancingScheme set to INTERNAL_SELF_MANAGED\nor EXTERNAL orEXTERNAL_MANAGED or INTERNAL_MANAGED.\nIt also applies to a regional TargetHttpsProxy attached to\nregional forwardingRules with theloadBalancingScheme set to EXTERNAL_MANAGED orINTERNAL_MANAGED. For details whichServerTlsPolicy resources are accepted withINTERNAL_SELF_MANAGED and which with EXTERNAL,INTERNAL_MANAGED, EXTERNAL_MANAGEDloadBalancingScheme consult ServerTlsPolicy\ndocumentation.\n\n  If left blank, communications are not encrypted.",
          },
          required: false,
        },
        quicOverride: {
          name: "Quic Override",
          description:
            "Specifies the QUIC override policy for this TargetHttpsProxy resource.",
          type: {
            type: "string",
            enum: ["DISABLE", "ENABLE", "NONE"],
            description:
              "Specifies the QUIC override policy for this TargetHttpsProxy resource. This\nsetting determines whether the load balancer attempts to negotiate QUIC\nwith clients.\nYou can specify NONE, ENABLE, orDISABLE.\n   \n   - When quic-override is set to NONE,\n   Google manages whether QUIC is used.\n   - When quic-override is set to ENABLE, the\n   load balancer uses QUIC when possible.\n   - When quic-override is set to DISABLE, the\n   load balancer doesn't use QUIC.\n   - If the quic-override flag is not specified,NONE is implied.",
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
        let path = `projects/{project}/global/targetHttpsProxies`;

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

        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.sslPolicy !== undefined)
          requestBody.sslPolicy = input.event.inputConfig.sslPolicy;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.tlsEarlyData !== undefined)
          requestBody.tlsEarlyData = input.event.inputConfig.tlsEarlyData;
        if (input.event.inputConfig.authorizationPolicy !== undefined)
          requestBody.authorizationPolicy =
            input.event.inputConfig.authorizationPolicy;
        if (input.event.inputConfig.urlMap !== undefined)
          requestBody.urlMap = input.event.inputConfig.urlMap;
        if (input.event.inputConfig.fingerprint !== undefined)
          requestBody.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.httpKeepAliveTimeoutSec !== undefined)
          requestBody.httpKeepAliveTimeoutSec =
            input.event.inputConfig.httpKeepAliveTimeoutSec;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.sslCertificates !== undefined)
          requestBody.sslCertificates = input.event.inputConfig.sslCertificates;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.proxyBind !== undefined)
          requestBody.proxyBind = input.event.inputConfig.proxyBind;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.certificateMap !== undefined)
          requestBody.certificateMap = input.event.inputConfig.certificateMap;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.serverTlsPolicy !== undefined)
          requestBody.serverTlsPolicy = input.event.inputConfig.serverTlsPolicy;
        if (input.event.inputConfig.quicOverride !== undefined)
          requestBody.quicOverride = input.event.inputConfig.quicOverride;

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

export default targetHttpsProxiesInsert;
