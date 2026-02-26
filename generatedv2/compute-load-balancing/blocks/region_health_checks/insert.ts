import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const insert: AppBlock = {
  name: "Region Health Checks - Insert",
  description: `Creates a wire group in the specified project in the given scope using the parameters that are included in the request.`,
  category: "Region Health Checks",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] Region where the health check resides.  Not applicable to global health checks.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Region where the health check resides.  Not applicable to global health checks.",
          },
          required: false,
        },
        check_interval_sec: {
          name: "Check Interval Sec",
          description:
            "How often (in seconds) to send a health check. The default value is 5 seconds.",
          type: {
            type: "integer",
            description:
              "How often (in seconds) to send a health check. The default value is 5 seconds.",
          },
          required: false,
        },
        creation_timestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] Creation timestamp in3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp in3339 text format.",
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
        grpc_health_check: {
          name: "Grpc Health Check",
          description: "Grpc Health Check field",
          type: {
            type: "object",
            properties: {
              grpc_service_name: {
                type: "string",
                description:
                  "The gRPC service name for the health check. This field is optional. The value of grpc_service_name has the following meanings by convention:  - Empty service_name means the overall status of all services at the backend.  - Non-empty service_name means the health of that gRPC service, as defined by the owner of the service.  The grpc_service_name can only be ASCII.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. Valid values are 1 through 65535.",
              },
              port_name: {
                type: "string",
                description: "Not supported.",
              },
              port_specification: {
                type: "string",
                description:
                  "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        grpc_tls_health_check: {
          name: "Grpc Tls Health Check",
          description: "Grpc Tls Health Check field",
          type: {
            type: "object",
            properties: {
              grpc_service_name: {
                type: "string",
                description:
                  "The gRPC service name for the health check. This field is optional. The value of grpc_service_name has the following meanings by convention:  - Empty service_name means the overall status of all services at the backend.  - Non-empty service_name means the health of that gRPC service, as defined by the owner of the service.  The grpc_service_name can only be ASCII.",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. Valid values are 1 through 65535.",
              },
              port_specification: {
                type: "string",
                description:
                  "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        healthy_threshold: {
          name: "Healthy Threshold",
          description:
            "A so-far unhealthy instance will be marked healthy after this many consecutive successes. The default value is 2.",
          type: {
            type: "integer",
            description:
              "A so-far unhealthy instance will be marked healthy after this many consecutive successes. The default value is 2.",
          },
          required: false,
        },
        http2_health_check: {
          name: "Http2 Health Check",
          description: "Http2 Health Check field",
          type: {
            type: "object",
            properties: {
              host: {
                type: "string",
                description:
                  "The value of the host header in the HTTP/2 health check request. If left empty (default value), the host header is set to the destination IP address to which health check packets are sent. The destination IP address depends on the type of load balancer. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#hc-packet-dest",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The default value is 443. Valid values are 1 through65535.",
              },
              port_name: {
                type: "string",
                description: "Not supported.",
              },
              port_specification: {
                type: "string",
                description:
                  "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
              },
              proxy_header: {
                type: "string",
                description:
                  "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
              },
              request_path: {
                type: "string",
                description:
                  "The request path of the HTTP/2 health check request. The default value is/. Must comply withRFC3986.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based HTTP/2 health check. In addition to the required HTTP 200 (OK) status code, you can configure the health check to pass only when the backend sends this specific ASCII response string within the first 1024 bytes of the HTTP response body. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-http",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        http_health_check: {
          name: "Http Health Check",
          description: "Http Health Check field",
          type: {
            type: "object",
            properties: {
              host: {
                type: "string",
                description:
                  "The value of the host header in the HTTP health check request. If left empty (default value), the host header is set to the destination IP address to which health check packets are sent. The destination IP address depends on the type of load balancer. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#hc-packet-dest",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The default value is 80. Valid values are 1 through65535.",
              },
              port_name: {
                type: "string",
                description: "Not supported.",
              },
              port_specification: {
                type: "string",
                description:
                  "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Also supported in legacy HTTP health checks for target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example,GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends. USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for pass-through load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
              },
              proxy_header: {
                type: "string",
                description:
                  "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
              },
              request_path: {
                type: "string",
                description:
                  "The request path of the HTTP health check request. The default value is/. Must comply withRFC3986.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based HTTP health check. In addition to the required HTTP 200 (OK) status code, you can configure the health check to pass only when the backend sends this specific ASCII response string within the first 1024 bytes of the HTTP response body. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-http",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        https_health_check: {
          name: "Https Health Check",
          description: "Https Health Check field",
          type: {
            type: "object",
            properties: {
              host: {
                type: "string",
                description:
                  "The value of the host header in the HTTPS health check request. If left empty (default value), the host header is set to the destination IP address to which health check packets are sent. The destination IP address depends on the type of load balancer. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#hc-packet-dest",
              },
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The default value is 443. Valid values are 1 through65535.",
              },
              port_name: {
                type: "string",
                description: "Not supported.",
              },
              port_specification: {
                type: "string",
                description:
                  "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
              },
              proxy_header: {
                type: "string",
                description:
                  "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
              },
              request_path: {
                type: "string",
                description:
                  "The request path of the HTTPS health check request. The default value is/. Must comply withRFC3986.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based HTTPS health check. In addition to the required HTTP 200 (OK) status code, you can configure the health check to pass only when the backend sends this specific ASCII response string within the first 1024 bytes of the HTTP response body. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-http",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "[Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "Output only. Type of the resource.",
          type: {
            type: "string",
            description: "Output only. Type of the resource.",
          },
          required: false,
        },
        log_config: {
          name: "Log Config",
          description: "Configure logging on this health check.",
          type: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description:
                  "Indicates whether or not to export logs. This is false by default, which means no health check logging will be done.",
              },
            },
            description:
              "Configuration of logging on a health check. If logging is enabled, logs will be exported to Stackdriver.",
            additionalProperties: true,
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. For example, a name that is 1-63 characters long, matches the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`, and otherwise complies with RFC1035. This regular expression describes a name where the first character is a lowercase letter, and all following characters are a dash, lowercase letter, or digit, except the last character, which isn't a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. For example, a name that is 1-63 characters long, matches the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`, and otherwise complies with RFC1035. This regular expression describes a name where the first character is a lowercase letter, and all following characters are a dash, lowercase letter, or digit, except the last character, which isn't a dash.",
          },
          required: false,
        },
        self_link: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        source_regions: {
          name: "Source Regions",
          description:
            "The list of cloud regions from which health checks are performed. If any regions are specified, then exactly 3 regions should be specified. The region names must be valid names of Google Cloud regions. This can only be set for global health check. If this list is non-empty, then there are restrictions on what other health check fields are supported and what other resources can use this health check:     - SSL, HTTP2, and GRPC protocols are not supported.    - The TCP request field is not supported.    - The proxyHeader field for HTTP, HTTPS, and TCP is not    supported.    - The checkIntervalSec field must be at least 30.    - The health check cannot be used with BackendService nor with managed    instance group auto-healing.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of cloud regions from which health checks are performed. If any regions are specified, then exactly 3 regions should be specified. The region names must be valid names of Google Cloud regions. This can only be set for global health check. If this list is non-empty, then there are restrictions on what other health check fields are supported and what other resources can use this health check:     - SSL, HTTP2, and GRPC protocols are not supported.    - The TCP request field is not supported.    - The proxyHeader field for HTTP, HTTPS, and TCP is not    supported.    - The checkIntervalSec field must be at least 30.    - The health check cannot be used with BackendService nor with managed    instance group auto-healing.",
          },
          required: false,
        },
        ssl_health_check: {
          name: "Ssl Health Check",
          description: "Ssl Health Check field",
          type: {
            type: "object",
            properties: {
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The default value is 443. Valid values are 1 through65535.",
              },
              port_name: {
                type: "string",
                description: "Not supported.",
              },
              port_specification: {
                type: "string",
                description:
                  "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
              },
              proxy_header: {
                type: "string",
                description:
                  "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
              },
              request: {
                type: "string",
                description:
                  "Instructs the health check prober to send this exact ASCII string, up to 1024 bytes in length, after establishing the TCP connection and SSL handshake.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based SSL health check. In addition to establishing a TCP connection and the TLS handshake, you can configure the health check to pass only when the backend sends this exact response ASCII string, up to 1024 bytes in length. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-ssl-tcp",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        tcp_health_check: {
          name: "Tcp Health Check",
          description: "Tcp Health Check field",
          type: {
            type: "object",
            properties: {
              port: {
                type: "integer",
                description:
                  "The TCP port number to which the health check prober sends packets. The default value is 80. Valid values are 1 through65535.",
              },
              port_name: {
                type: "string",
                description: "Not supported.",
              },
              port_specification: {
                type: "string",
                description:
                  "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends. USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
              },
              proxy_header: {
                type: "string",
                description:
                  "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
              },
              request: {
                type: "string",
                description:
                  "Instructs the health check prober to send this exact ASCII string, up to 1024 bytes in length, after establishing the TCP connection.",
              },
              response: {
                type: "string",
                description:
                  "Creates a content-based TCP health check. In addition to establishing a TCP connection, you can configure the health check to pass only when the backend sends this exact response ASCII string, up to 1024 bytes in length. For details, see: https://cloud.google.com/load-balancing/docs/health-check-concepts#criteria-protocol-ssl-tcp",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        timeout_sec: {
          name: "Timeout Sec",
          description:
            "How long (in seconds) to wait before claiming failure. The default value is 5 seconds. It is invalid for timeoutSec to have greater value than checkIntervalSec.",
          type: {
            type: "integer",
            description:
              "How long (in seconds) to wait before claiming failure. The default value is 5 seconds. It is invalid for timeoutSec to have greater value than checkIntervalSec.",
          },
          required: false,
        },
        type: {
          name: "Type",
          description:
            "Specifies the type of the healthCheck, either TCP,SSL, HTTP, HTTPS,HTTP2 or GRPC. Exactly one of the protocol-specific health check fields must be specified, which must matchtype field. Check the Type enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Specifies the type of the healthCheck, either TCP,SSL, HTTP, HTTPS,HTTP2 or GRPC. Exactly one of the protocol-specific health check fields must be specified, which must matchtype field. Check the Type enum for the list of possible values.",
          },
          required: false,
        },
        unhealthy_threshold: {
          name: "Unhealthy Threshold",
          description:
            "A so-far healthy instance will be marked unhealthy after this many consecutive failures. The default value is 2.",
          type: {
            type: "integer",
            description:
              "A so-far healthy instance will be marked unhealthy after this many consecutive failures. The default value is 2.",
          },
          required: false,
        },
        request_id: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.check_interval_sec !== undefined)
          body.check_interval_sec = input.event.inputConfig.check_interval_sec;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.grpc_health_check !== undefined)
          body.grpc_health_check = input.event.inputConfig.grpc_health_check;
        if (input.event.inputConfig.grpc_tls_health_check !== undefined)
          body.grpc_tls_health_check =
            input.event.inputConfig.grpc_tls_health_check;
        if (input.event.inputConfig.healthy_threshold !== undefined)
          body.healthy_threshold = input.event.inputConfig.healthy_threshold;
        if (input.event.inputConfig.http2_health_check !== undefined)
          body.http2_health_check = input.event.inputConfig.http2_health_check;
        if (input.event.inputConfig.http_health_check !== undefined)
          body.http_health_check = input.event.inputConfig.http_health_check;
        if (input.event.inputConfig.https_health_check !== undefined)
          body.https_health_check = input.event.inputConfig.https_health_check;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.log_config !== undefined)
          body.log_config = input.event.inputConfig.log_config;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;
        if (input.event.inputConfig.source_regions !== undefined)
          body.source_regions = input.event.inputConfig.source_regions;
        if (input.event.inputConfig.ssl_health_check !== undefined)
          body.ssl_health_check = input.event.inputConfig.ssl_health_check;
        if (input.event.inputConfig.tcp_health_check !== undefined)
          body.tcp_health_check = input.event.inputConfig.tcp_health_check;
        if (input.event.inputConfig.timeout_sec !== undefined)
          body.timeout_sec = input.event.inputConfig.timeout_sec;
        if (input.event.inputConfig.type !== undefined)
          body.type = input.event.inputConfig.type;
        if (input.event.inputConfig.unhealthy_threshold !== undefined)
          body.unhealthy_threshold =
            input.event.inputConfig.unhealthy_threshold;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/healthChecks",
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
          client_operation_id: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creation_timestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          end_time: {
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
                    error_details: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          error_info: {
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
                          localized_message: {
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
                          quota_info: {
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
                              future_limit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limit_name: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metric_name: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rollout_status: {
                                type: "string",
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
          http_error_message: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          http_error_status_code: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insert_time: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instances_bulk_insert_operation_metadata: {
            type: "object",
            properties: {
              per_location_status: {
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
          operation_group_id: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operation_type: {
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
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          set_common_instance_metadata_operation_metadata: {
            type: "object",
            properties: {
              client_operation_id: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              per_location_operations: {
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
          start_time: {
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
          status_message: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          target_id: {
            type: "string",
            description: "64-bit integer as string",
          },
          target_link: {
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

export default insert;
