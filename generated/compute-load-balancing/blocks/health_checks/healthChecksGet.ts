import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const healthChecksGet: AppBlock = {
  name: "Health Checks - Get",
  description: `Returns the specified HealthCheck resource.`,
  category: "Health Checks",
  inputs: {
    default: {
      config: {
        healthCheck: {
          name: "Health Check",
          description: "Name of the HealthCheck resource to return.",
          type: {
            type: "string",
          },
          required: true,
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
        let path = `projects/{project}/global/healthChecks/{healthCheck}`;

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
          tcpHealthCheck: {
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
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          httpsHealthCheck: {
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
          sslHealthCheck: {
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
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp in3339\ntext format.",
          },
          http2HealthCheck: {
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
          kind: {
            type: "string",
            description: "Type of the resource.",
          },
          logConfig: {
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
          httpHealthCheck: {
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
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nFor example, a name that is 1-63 characters long, matches the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`, and otherwise complies with\nRFC1035. This regular expression describes a name where the first\ncharacter is a lowercase letter, and all following characters are a dash,\nlowercase letter, or digit, except the last character, which isn't a dash.",
          },
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
          healthyThreshold: {
            type: "integer",
            description:
              "A so-far unhealthy instance will be marked healthy after this\nmany consecutive successes. The default value is 2. (Format: int32)",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          sourceRegions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of cloud regions from which health checks are performed. If any\nregions are specified, then exactly 3 regions should be specified. The\nregion names must be valid names of Google Cloud regions.\nThis can only be set for global health check.\nIf this list is non-empty, then there are restrictions\non what other health check fields are supported and what other resources\ncan use this health check:\n   \n   - SSL, HTTP2, and GRPC protocols are not supported.\n   - The TCP request field is not supported.\n   - The proxyHeader field for HTTP, HTTPS, and TCP is not\n   supported.\n   - The checkIntervalSec field must be at least 30.\n   - The health check cannot be used with BackendService nor with managed\n   instance group auto-healing.",
          },
          unhealthyThreshold: {
            type: "integer",
            description:
              "A so-far healthy instance will be marked unhealthy after this many\nconsecutive failures. The default value is 2. (Format: int32)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] Region where the health check resides.  Not applicable to\nglobal health checks.",
          },
          checkIntervalSec: {
            type: "integer",
            description:
              "How often (in seconds) to send a health check. The default value is 5\nseconds. (Format: int32)",
          },
          grpcHealthCheck: {
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
          timeoutSec: {
            type: "integer",
            description:
              "How long (in seconds) to wait before claiming failure. The default value is\n5 seconds. It is invalid for timeoutSec to have greater\nvalue than checkIntervalSec. (Format: int32)",
          },
          grpcTlsHealthCheck: {
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
        },
        description:
          "Represents a health check resource.\n\nGoogle Compute Engine has two health check resources:\n\n* [Regional](/compute/docs/reference/rest/v1/regionHealthChecks)\n* [Global](/compute/docs/reference/rest/v1/healthChecks)\n\nThese health check resources can be used for load balancing and for\nautohealing VMs in a managed instance group (MIG).\n\n**Load balancing**\n\nHealth check requirements vary depending on the type of load balancer. For\ndetails about the type of health check supported for\neach load balancer and corresponding backend type,\nsee Health\nchecks overview: Load balancer guide.\n\n**Autohealing in MIGs**\n\nThe health checks that you use for autohealing VMs in a MIG can be either\nregional or global. For more information, see  Set up an\napplication health check and autohealing.\n\nFor more information, seeHealth checks\noverview.",
        additionalProperties: true,
      },
    },
  },
};

export default healthChecksGet;
