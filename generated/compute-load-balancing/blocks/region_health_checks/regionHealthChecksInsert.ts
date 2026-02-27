import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionHealthChecksInsert: AppBlock = {
  name: "Region Health Checks - Insert",
  description: `Creates a HealthCheck resource in the specified project using the data included in the request.`,
  category: "Region Health Checks",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "[Output Only] Region where the health check resides.",
          type: {
            type: "string",
            description:
              "[Output Only] Region where the health check resides.  Not applicable to\nglobal health checks.",
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
        tcpHealthCheck: {
          name: "TCP Health Check",
          description: "Request body field: tcpHealthCheck",
          type: {
            type: "object",
            properties: {
              request: {
                type: "string",
                description:
                  "Instructs the health check prober to send this exact ASCII string, up to\n1024 bytes in length, after establishing the TCP connection.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based TCP health check. In addition to establishing a\nTCP connection, you can configure the health check to pass only when the\nbackend sends this exact response ASCII string, up to 1024 bytes in length.\nFor details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-ssl-tcp",
              },
              portName: {
                type: "string",
                description: "Not supported.",
              },
              portSpecification: {
                type: "string",
                enum: ["USE_FIXED_PORT", "USE_NAMED_PORT", "USE_SERVING_PORT"],
                description:
                  "Specifies how a port is selected for health checking. Can be one of the\nfollowing values: \nUSE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services\nfor passthrough load balancers and backend services for proxy load\nbalancers. Not supported by target pools. The health check supports all\nbackends supported by the backend service provided the backend can be\nhealth checked. For example, GCE_VM_IP network endpoint\ngroups, GCE_VM_IP_PORT network endpoint groups, and instance\ngroup backends. \nUSE_NAMED_PORT: Not supported. \nUSE_SERVING_PORT: Provides an indirect method of specifying\nthe health check port by referring to the backend service. Only supported\nby backend services for proxy load balancers. Not supported by target\npools.  Not supported by backend services for passthrough load balancers.\nSupports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group\nbackends.\n\nFor GCE_VM_IP_PORT network endpoint group backends, the health\ncheck uses the port number specified for each endpoint in the network\nendpoint group.  For instance group backends, the health check uses the\nport number determined by looking up the backend service's named port in\nthe instance group's list of named ports.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The\ndefault value is 80. Valid values are 1 through65535. (Format: int32)",
              },
              proxyHeader: {
                type: "string",
                enum: ["NONE", "PROXY_V1"],
                description:
                  "Specifies the type of proxy header to append before sending data to the\nbackend, either NONE or PROXY_V1. The default\nis NONE.",
              },
            },
            additionalProperties: true,
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
          description: "[Output Only] The unique identifier for the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          required: false,
        },
        httpsHealthCheck: {
          name: "HTTPS Health Check",
          description: "Request body field: httpsHealthCheck",
          type: {
            type: "object",
            properties: {
              portName: {
                type: "string",
                description: "Not supported.",
              },
              portSpecification: {
                type: "string",
                enum: ["USE_FIXED_PORT", "USE_NAMED_PORT", "USE_SERVING_PORT"],
                description:
                  "Specifies how a port is selected for health checking. Can be one of the\nfollowing values: \nUSE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services\nfor passthrough load balancers and backend services for proxy load\nbalancers. Not supported by target pools. The health check supports all\nbackends supported by the backend service provided the backend can be\nhealth checked. For example, GCE_VM_IP network endpoint\ngroups, GCE_VM_IP_PORT network endpoint groups, and instance\ngroup backends. \n USE_NAMED_PORT: Not supported. \nUSE_SERVING_PORT: Provides an indirect method of specifying\nthe health check port by referring to the backend service. Only supported\nby backend services for proxy load balancers. Not supported by target\npools.  Not supported by backend services for passthrough load balancers.\nSupports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group\nbackends.\n\nFor GCE_VM_IP_PORT network endpoint group backends, the health\ncheck uses the port number specified for each endpoint in the network\nendpoint group.  For instance group backends, the health check uses the\nport number determined by looking up the backend service's named port in\nthe instance group's list of named ports.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based HTTPS health check. In addition to the required\nHTTP 200 (OK) status code, you can configure the health check to pass only\nwhen the backend sends this specific ASCII response string within the first\n1024 bytes of the HTTP response body. For details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-http",
              },
              host: {
                type: "string",
                description:
                  "The value of the host header in the HTTPS health check request. If left\nempty (default value), the host header is set to the destination IP address\nto which health check packets are sent. The destination IP address depends\non the type of load balancer. For details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#hc-packet-dest",
              },
              requestPath: {
                type: "string",
                description:
                  "The request path of the HTTPS health check request. The default value is/. Must comply withRFC3986.",
              },
              proxyHeader: {
                type: "string",
                enum: ["NONE", "PROXY_V1"],
                description:
                  "Specifies the type of proxy header to append before sending data to the\nbackend, either NONE or PROXY_V1. The default\nis NONE.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The\ndefault value is 443. Valid values are 1 through65535. (Format: int32)",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        sslHealthCheck: {
          name: "SSL Health Check",
          description: "Request body field: sslHealthCheck",
          type: {
            type: "object",
            properties: {
              portSpecification: {
                type: "string",
                enum: ["USE_FIXED_PORT", "USE_NAMED_PORT", "USE_SERVING_PORT"],
                description:
                  "Specifies how a port is selected for health checking. Can be one of the\nfollowing values: \nUSE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services\nfor passthrough load balancers and backend services for proxy load\nbalancers. Not supported by target pools. The health check supports all\nbackends supported by the backend service provided the backend can be\nhealth checked. For example, GCE_VM_IP network endpoint\ngroups, GCE_VM_IP_PORT network endpoint groups, and instance\ngroup backends. \n USE_NAMED_PORT: Not supported. \nUSE_SERVING_PORT: Provides an indirect method of specifying\nthe health check port by referring to the backend service. Only supported\nby backend services for proxy load balancers. Not supported by target\npools.  Not supported by backend services for passthrough load balancers.\nSupports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group\nbackends.\n\nFor GCE_VM_IP_PORT network endpoint group backends, the health\ncheck uses the port number specified for each endpoint in the network\nendpoint group.  For instance group backends, the health check uses the\nport number determined by looking up the backend service's named port in\nthe instance group's list of named ports.",
              },
              request: {
                type: "string",
                description:
                  "Instructs the health check prober to send this exact ASCII string, up to\n1024 bytes in length, after establishing the TCP connection and SSL\nhandshake.",
              },
              proxyHeader: {
                type: "string",
                enum: ["NONE", "PROXY_V1"],
                description:
                  "Specifies the type of proxy header to append before sending data to the\nbackend, either NONE or PROXY_V1. The default\nis NONE.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based SSL health check. In addition to establishing a\nTCP connection and the TLS handshake, you can configure the health check to\npass only when the backend sends this exact response ASCII string, up to\n1024 bytes in length. For details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-ssl-tcp",
              },
              portName: {
                type: "string",
                description: "Not supported.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The\ndefault value is 443. Valid values are 1 through65535. (Format: int32)",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description: "[Output Only] Creation timestamp in3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Creation timestamp in3339\ntext format.",
          },
          required: false,
        },
        http2HealthCheck: {
          name: "Http2 Health Check",
          description: "Request body field: http2HealthCheck",
          type: {
            type: "object",
            properties: {
              requestPath: {
                type: "string",
                description:
                  "The request path of the HTTP/2 health check request. The default value is/. Must comply withRFC3986.",
              },
              portSpecification: {
                type: "string",
                enum: ["USE_FIXED_PORT", "USE_NAMED_PORT", "USE_SERVING_PORT"],
                description:
                  "Specifies how a port is selected for health checking. Can be one of the\nfollowing values: \nUSE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services\nfor passthrough load balancers and backend services for proxy load\nbalancers. Not supported by target pools. The health check supports all\nbackends supported by the backend service provided the backend can be\nhealth checked. For example, GCE_VM_IP network endpoint\ngroups, GCE_VM_IP_PORT network endpoint groups, and instance\ngroup backends. \n USE_NAMED_PORT: Not supported. \nUSE_SERVING_PORT: Provides an indirect method of specifying\nthe health check port by referring to the backend service. Only supported\nby backend services for proxy load balancers. Not supported by target\npools.  Not supported by backend services for passthrough load balancers.\nSupports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group\nbackends.\n\nFor GCE_VM_IP_PORT network endpoint group backends, the health\ncheck uses the port number specified for each endpoint in the network\nendpoint group.  For instance group backends, the health check uses the\nport number determined by looking up the backend service's named port in\nthe instance group's list of named ports.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The\ndefault value is 443. Valid values are 1 through65535. (Format: int32)",
              },
              portName: {
                type: "string",
                description: "Not supported.",
              },
              proxyHeader: {
                type: "string",
                enum: ["NONE", "PROXY_V1"],
                description:
                  "Specifies the type of proxy header to append before sending data to the\nbackend, either NONE or PROXY_V1. The default\nis NONE.",
              },
              host: {
                type: "string",
                description:
                  "The value of the host header in the HTTP/2 health check request. If left\nempty (default value), the host header is set to the destination IP address\nto which health check packets are sent. The destination IP address depends\non the type of load balancer. For details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#hc-packet-dest",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based HTTP/2 health check. In addition to the required\nHTTP 200 (OK) status code, you can configure the health check to pass only\nwhen the backend sends this specific ASCII response string within the first\n1024 bytes of the HTTP response body. For details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-http",
              },
            },
            additionalProperties: true,
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
        logConfig: {
          name: "Log Config",
          description: "Configure logging on this health check.",
          type: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description:
                  "Indicates whether or not to export logs. This is false by default, which\nmeans no health check logging will be done.",
              },
            },
            description:
              "Configuration of logging on a health check. If logging is enabled, logs\nwill be exported to Stackdriver.",
            additionalProperties: true,
          },
          required: false,
        },
        httpHealthCheck: {
          name: "HTTP Health Check",
          description: "Request body field: httpHealthCheck",
          type: {
            type: "object",
            properties: {
              response: {
                type: "string",
                description:
                  "Creates a content-based HTTP health check. In addition to the required\nHTTP 200 (OK) status code, you can configure the health check to pass only\nwhen the backend sends this specific ASCII response string within the first\n1024 bytes of the HTTP response body. For details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-http",
              },
              requestPath: {
                type: "string",
                description:
                  "The request path of the HTTP health check request. The default value is/. Must comply withRFC3986.",
              },
              portSpecification: {
                type: "string",
                enum: ["USE_FIXED_PORT", "USE_NAMED_PORT", "USE_SERVING_PORT"],
                description:
                  "Specifies how a port is selected for health checking. Can be one of the\nfollowing values: \nUSE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services\nfor passthrough load balancers and backend services for proxy load\nbalancers. Also supported in legacy HTTP health checks for target pools.\nThe health check supports all backends supported by the backend service\nprovided the backend can be health checked. For example,GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT\nnetwork endpoint groups, and instance group backends. \nUSE_NAMED_PORT: Not supported. \nUSE_SERVING_PORT: Provides an indirect method of specifying\nthe health check port by referring to the backend service. Only supported\nby backend services for proxy load balancers. Not supported by target\npools.  Not supported by backend services for pass-through load balancers.\nSupports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group\nbackends.\n\nFor GCE_VM_IP_PORT network endpoint group backends, the health\ncheck uses the port number specified for each endpoint in the network\nendpoint group.  For instance group backends, the health check uses the\nport number determined by looking up the backend service's named port in\nthe instance group's list of named ports.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The\ndefault value is 80. Valid values are 1 through65535. (Format: int32)",
              },
              portName: {
                type: "string",
                description: "Not supported.",
              },
              host: {
                type: "string",
                description:
                  "The value of the host header in the HTTP health check request. If left\nempty (default value), the host header is set to the destination IP address\nto which health check packets are sent. The destination IP address depends\non the type of load balancer. For details, see:\nhttps://cloud.google.com/load-balancing/docs/health-check-concepts#hc-packet-dest",
              },
              proxyHeader: {
                type: "string",
                enum: ["NONE", "PROXY_V1"],
                description:
                  "Specifies the type of proxy header to append before sending data to the\nbackend, either NONE or PROXY_V1. The default\nis NONE.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nFor example, a name that is 1-63 characters long, matches the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`, and otherwise complies with\nRFC1035. This regular expression describes a name where the first\ncharacter is a lowercase letter, and all following characters are a dash,\nlowercase letter, or digit, except the last character, which isn't a dash.",
          },
          required: false,
        },
        type: {
          name: "Type",
          description:
            "Specifies the type of the healthCheck, either TCP,SSL, HTTP, HTTPS,HTTP2 or GRPC.",
          type: {
            type: "string",
            enum: [
              "GRPC",
              "GRPC_WITH_TLS",
              "HTTP",
              "HTTP2",
              "HTTPS",
              "INVALID",
              "SSL",
              "TCP",
            ],
            description:
              "Specifies the type of the healthCheck, either TCP,SSL, HTTP, HTTPS,HTTP2 or GRPC. Exactly one of the\nprotocol-specific health check fields must be specified, which must matchtype field.",
          },
          required: false,
        },
        healthyThreshold: {
          name: "Healthy Threshold",
          description:
            "A so-far unhealthy instance will be marked healthy after this many consecutive successes.",
          type: {
            type: "integer",
            description:
              "A so-far unhealthy instance will be marked healthy after this\nmany consecutive successes. The default value is 2. (Format: int32)",
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
        sourceRegions: {
          name: "Source Regions",
          description:
            "The list of cloud regions from which health checks are performed.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of cloud regions from which health checks are performed. If any\nregions are specified, then exactly 3 regions should be specified. The\nregion names must be valid names of Google Cloud regions.\nThis can only be set for global health check.\nIf this list is non-empty, then there are restrictions\non what other health check fields are supported and what other resources\ncan use this health check:\n   \n   - SSL, HTTP2, and GRPC protocols are not supported.\n   - The TCP request field is not supported.\n   - The proxyHeader field for HTTP, HTTPS, and TCP is not\n   supported.\n   - The checkIntervalSec field must be at least 30.\n   - The health check cannot be used with BackendService nor with managed\n   instance group auto-healing.",
          },
          required: false,
        },
        unhealthyThreshold: {
          name: "Unhealthy Threshold",
          description:
            "A so-far healthy instance will be marked unhealthy after this many consecutive failures.",
          type: {
            type: "integer",
            description:
              "A so-far healthy instance will be marked unhealthy after this many\nconsecutive failures. The default value is 2. (Format: int32)",
          },
          required: false,
        },
        checkIntervalSec: {
          name: "Check Interval Sec",
          description: "How often (in seconds) to send a health check.",
          type: {
            type: "integer",
            description:
              "How often (in seconds) to send a health check. The default value is 5\nseconds. (Format: int32)",
          },
          required: false,
        },
        grpcHealthCheck: {
          name: "Grpc Health Check",
          description: "Request body field: grpcHealthCheck",
          type: {
            type: "object",
            properties: {
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. Valid\nvalues are 1 through 65535. (Format: int32)",
              },
              portName: {
                type: "string",
                description: "Not supported.",
              },
              portSpecification: {
                type: "string",
                enum: ["USE_FIXED_PORT", "USE_NAMED_PORT", "USE_SERVING_PORT"],
                description:
                  "Specifies how a port is selected for health checking. Can be one of the\nfollowing values: \nUSE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services\nfor passthrough load balancers and backend services for proxy load\nbalancers. Not supported by target pools. The health check supports all\nbackends supported by the backend service provided the backend can be\nhealth checked. For example, GCE_VM_IP network endpoint\ngroups, GCE_VM_IP_PORT network endpoint groups, and instance\ngroup backends. \n USE_NAMED_PORT: Not supported. \nUSE_SERVING_PORT: Provides an indirect method of specifying\nthe health check port by referring to the backend service. Only supported\nby backend services for proxy load balancers. Not supported by target\npools.  Not supported by backend services for passthrough load balancers.\nSupports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group\nbackends.\n\nFor GCE_VM_IP_PORT network endpoint group backends, the health\ncheck uses the port number specified for each endpoint in the network\nendpoint group.  For instance group backends, the health check uses the\nport number determined by looking up the backend service's named port in\nthe instance group's list of named ports.",
              },
              grpcServiceName: {
                type: "string",
                description:
                  "The gRPC service name for the health check. This field is optional. The\nvalue of grpc_service_name has the following meanings by convention: \n\n- Empty service_name means the overall status of all services at the\nbackend. \n\n- Non-empty service_name means the health of that gRPC service, as defined\nby the owner of the service. \n\nThe grpc_service_name can only be ASCII.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        timeoutSec: {
          name: "Timeout Sec",
          description: "How long (in seconds) to wait before claiming failure.",
          type: {
            type: "integer",
            description:
              "How long (in seconds) to wait before claiming failure. The default value is\n5 seconds. It is invalid for timeoutSec to have greater\nvalue than checkIntervalSec. (Format: int32)",
          },
          required: false,
        },
        grpcTlsHealthCheck: {
          name: "Grpc TLS Health Check",
          description: "Request body field: grpcTlsHealthCheck",
          type: {
            type: "object",
            properties: {
              grpcServiceName: {
                type: "string",
                description:
                  "The gRPC service name for the health check. This field is optional. The\nvalue of grpc_service_name has the following meanings by convention: \n\n- Empty service_name means the overall status of all services at the\nbackend. \n\n- Non-empty service_name means the health of that gRPC service, as defined\nby the owner of the service. \n\nThe grpc_service_name can only be ASCII.",
              },
              portSpecification: {
                type: "string",
                enum: ["USE_FIXED_PORT", "USE_NAMED_PORT", "USE_SERVING_PORT"],
                description:
                  "Specifies how a port is selected for health checking. Can be one of the\nfollowing values: \nUSE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services\nfor passthrough load balancers and backend services for proxy load\nbalancers. Not supported by target pools. The health check supports all\nbackends supported by the backend service provided the backend can be\nhealth checked. For example, GCE_VM_IP network endpoint\ngroups, GCE_VM_IP_PORT network endpoint groups, and instance\ngroup backends. \n USE_NAMED_PORT: Not supported. \nUSE_SERVING_PORT: Provides an indirect method of specifying\nthe health check port by referring to the backend service. Only supported\nby backend services for proxy load balancers. Not supported by target\npools.  Not supported by backend services for passthrough load balancers.\nSupports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group\nbackends.\n\nFor GCE_VM_IP_PORT network endpoint group backends, the health\ncheck uses the port number specified for each endpoint in the network\nendpoint group.  For instance group backends, the health check uses the\nport number determined by looking up the backend service's named port in\nthe instance group's list of named ports.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. Valid\nvalues are 1 through 65535. (Format: int32)",
              },
            },
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
        let path = `projects/{project}/regions/{region}/healthChecks`;

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

        if (input.event.inputConfig.tcpHealthCheck !== undefined)
          requestBody.tcpHealthCheck = input.event.inputConfig.tcpHealthCheck;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.httpsHealthCheck !== undefined)
          requestBody.httpsHealthCheck =
            input.event.inputConfig.httpsHealthCheck;
        if (input.event.inputConfig.sslHealthCheck !== undefined)
          requestBody.sslHealthCheck = input.event.inputConfig.sslHealthCheck;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.http2HealthCheck !== undefined)
          requestBody.http2HealthCheck =
            input.event.inputConfig.http2HealthCheck;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.logConfig !== undefined)
          requestBody.logConfig = input.event.inputConfig.logConfig;
        if (input.event.inputConfig.httpHealthCheck !== undefined)
          requestBody.httpHealthCheck = input.event.inputConfig.httpHealthCheck;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.type !== undefined)
          requestBody.type = input.event.inputConfig.type;
        if (input.event.inputConfig.healthyThreshold !== undefined)
          requestBody.healthyThreshold =
            input.event.inputConfig.healthyThreshold;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.sourceRegions !== undefined)
          requestBody.sourceRegions = input.event.inputConfig.sourceRegions;
        if (input.event.inputConfig.unhealthyThreshold !== undefined)
          requestBody.unhealthyThreshold =
            input.event.inputConfig.unhealthyThreshold;
        if (input.event.inputConfig.region !== undefined)
          requestBody.region = input.event.inputConfig.region;
        if (input.event.inputConfig.checkIntervalSec !== undefined)
          requestBody.checkIntervalSec =
            input.event.inputConfig.checkIntervalSec;
        if (input.event.inputConfig.grpcHealthCheck !== undefined)
          requestBody.grpcHealthCheck = input.event.inputConfig.grpcHealthCheck;
        if (input.event.inputConfig.timeoutSec !== undefined)
          requestBody.timeoutSec = input.event.inputConfig.timeoutSec;
        if (input.event.inputConfig.grpcTlsHealthCheck !== undefined)
          requestBody.grpcTlsHealthCheck =
            input.event.inputConfig.grpcTlsHealthCheck;

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

export default regionHealthChecksInsert;
