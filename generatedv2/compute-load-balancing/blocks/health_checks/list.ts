import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Health Checks - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Health Checks",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "string",
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
          pathTemplate: "/compute/v1/projects/{project}/global/healthChecks",
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
                checkIntervalSec: {
                  type: "integer",
                  description:
                    "How often (in seconds) to send a health check. The default value is 5 seconds.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp in3339 text format.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                grpcHealthCheck: {
                  type: "object",
                  properties: {
                    grpcServiceName: {
                      type: "string",
                      description:
                        "The gRPC service name for the health check. This field is optional. The value of grpc_service_name has the following meanings by convention:  - Empty service_name means the overall status of all services at the backend.  - Non-empty service_name means the health of that gRPC service, as defined by the owner of the service.  The grpc_service_name can only be ASCII.",
                    },
                    port: {
                      type: "integer",
                      description:
                        "The TCP port number to which the health check prober sends packets. Valid values are 1 through 65535.",
                    },
                    portName: {
                      type: "string",
                      description: "Not supported.",
                    },
                    portSpecification: {
                      type: "string",
                      description:
                        "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                },
                grpcTlsHealthCheck: {
                  type: "object",
                  properties: {
                    grpcServiceName: {
                      type: "string",
                      description:
                        "The gRPC service name for the health check. This field is optional. The value of grpc_service_name has the following meanings by convention:  - Empty service_name means the overall status of all services at the backend.  - Non-empty service_name means the health of that gRPC service, as defined by the owner of the service.  The grpc_service_name can only be ASCII.",
                    },
                    port: {
                      type: "integer",
                      description:
                        "The TCP port number to which the health check prober sends packets. Valid values are 1 through 65535.",
                    },
                    portSpecification: {
                      type: "string",
                      description:
                        "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                },
                healthyThreshold: {
                  type: "integer",
                  description:
                    "A so-far unhealthy instance will be marked healthy after this many consecutive successes. The default value is 2.",
                },
                http2HealthCheck: {
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
                    portName: {
                      type: "string",
                      description: "Not supported.",
                    },
                    portSpecification: {
                      type: "string",
                      description:
                        "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
                    },
                    proxyHeader: {
                      type: "string",
                      description:
                        "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
                    },
                    requestPath: {
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
                httpHealthCheck: {
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
                    portName: {
                      type: "string",
                      description: "Not supported.",
                    },
                    portSpecification: {
                      type: "string",
                      description:
                        "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Also supported in legacy HTTP health checks for target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example,GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends. USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for pass-through load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
                    },
                    proxyHeader: {
                      type: "string",
                      description:
                        "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
                    },
                    requestPath: {
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
                httpsHealthCheck: {
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
                    portName: {
                      type: "string",
                      description: "Not supported.",
                    },
                    portSpecification: {
                      type: "string",
                      description:
                        "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
                    },
                    proxyHeader: {
                      type: "string",
                      description:
                        "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
                    },
                    requestPath: {
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
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description: "Output only. Type of the resource.",
                },
                logConfig: {
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
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. For example, a name that is 1-63 characters long, matches the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`, and otherwise complies with RFC1035. This regular expression describes a name where the first character is a lowercase letter, and all following characters are a dash, lowercase letter, or digit, except the last character, which isn't a dash.",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Region where the health check resides.  Not applicable to global health checks.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                sourceRegions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The list of cloud regions from which health checks are performed. If any regions are specified, then exactly 3 regions should be specified. The region names must be valid names of Google Cloud regions. This can only be set for global health check. If this list is non-empty, then there are restrictions on what other health check fields are supported and what other resources can use this health check:     - SSL, HTTP2, and GRPC protocols are not supported.    - The TCP request field is not supported.    - The proxyHeader field for HTTP, HTTPS, and TCP is not    supported.    - The checkIntervalSec field must be at least 30.    - The health check cannot be used with BackendService nor with managed    instance group auto-healing.",
                },
                sslHealthCheck: {
                  type: "object",
                  properties: {
                    port: {
                      type: "integer",
                      description:
                        "The TCP port number to which the health check prober sends packets. The default value is 443. Valid values are 1 through65535.",
                    },
                    portName: {
                      type: "string",
                      description: "Not supported.",
                    },
                    portSpecification: {
                      type: "string",
                      description:
                        "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends.  USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
                    },
                    proxyHeader: {
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
                tcpHealthCheck: {
                  type: "object",
                  properties: {
                    port: {
                      type: "integer",
                      description:
                        "The TCP port number to which the health check prober sends packets. The default value is 80. Valid values are 1 through65535.",
                    },
                    portName: {
                      type: "string",
                      description: "Not supported.",
                    },
                    portSpecification: {
                      type: "string",
                      description:
                        "Specifies how a port is selected for health checking. Can be one of the following values: USE_FIXED_PORT: Specifies a port number explicitly using theport field  in the health check. Supported by backend services for passthrough load balancers and backend services for proxy load balancers. Not supported by target pools. The health check supports all backends supported by the backend service provided the backend can be health checked. For example, GCE_VM_IP network endpoint groups, GCE_VM_IP_PORT network endpoint groups, and instance group backends. USE_NAMED_PORT: Not supported. USE_SERVING_PORT: Provides an indirect method of specifying the health check port by referring to the backend service. Only supported by backend services for proxy load balancers. Not supported by target pools.  Not supported by backend services for passthrough load balancers. Supports all backends that can be health checked; for example,GCE_VM_IP_PORT network endpoint groups and instance group backends.  For GCE_VM_IP_PORT network endpoint group backends, the health check uses the port number specified for each endpoint in the network endpoint group.  For instance group backends, the health check uses the port number determined by looking up the backend service's named port in the instance group's list of named ports. Check the PortSpecification enum for the list of possible values.",
                    },
                    proxyHeader: {
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
                timeoutSec: {
                  type: "integer",
                  description:
                    "How long (in seconds) to wait before claiming failure. The default value is 5 seconds. It is invalid for timeoutSec to have greater value than checkIntervalSec.",
                },
                type: {
                  type: "string",
                  description:
                    "Specifies the type of the healthCheck, either TCP,SSL, HTTP, HTTPS,HTTP2 or GRPC. Exactly one of the protocol-specific health check fields must be specified, which must matchtype field. Check the Type enum for the list of possible values.",
                },
                unhealthyThreshold: {
                  type: "integer",
                  description:
                    "A so-far healthy instance will be marked unhealthy after this many consecutive failures. The default value is 2.",
                },
              },
              description:
                "Represents a health check resource.  Google Compute Engine has two health check resources:  * [Regional](/compute/docs/reference/rest/v1/regionHealthChecks) * [Global](/compute/docs/reference/rest/v1/healthChecks)  These health check resources can be used for load balancing and for autohealing VMs in a managed instance group (MIG).  **Load balancing**  Health check requirements vary depending on the type of load balancer. For details about the type of health check supported for each load balancer and corresponding backend type, see Health checks overview: Load balancer guide.  **Autohealing in MIGs**  The health checks that you use for autohealing VMs in a MIG can be either regional or global. For more information, see  Set up an application health check and autohealing.  For more information, seeHealth checks overview.",
              additionalProperties: true,
            },
            description: "A list of HealthCheck resources.",
          },
          kind: {
            type: "string",
            description: "Output only. Type of resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          warning: {
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "Contains a list of HealthCheck resources.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
