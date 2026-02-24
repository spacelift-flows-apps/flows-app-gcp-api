import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const backendServicesGet: AppBlock = {
  name: "Backend Services - Get",
  description: `Returns the specified BackendService resource.`,
  category: "Backend Services",
  inputs: {
    default: {
      config: {
        backendService: {
          name: "Backend Service",
          description: "Name of the BackendService resource to return.",
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
        let path = `projects/{project}/global/backendServices/{backendService}`;

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
          params: {
            type: "object",
            properties: {
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Tag keys/values directly bound to this resource.\nTag keys and values have the same definition as resource\nmanager tags. The field is allowed for INSERT\nonly. The keys/values to set on the resource should be specified in\neither ID { : } or Namespaced format\n{ : }.\nFor example the following are valid inputs:\n* {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"}\n* {"123/environment" : "production", "345/abc" : "xyz"}\nNote:\n* Invalid combinations of ID & namespaced format is not supported. For\n  instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional Backend Service parameters.",
            additionalProperties: true,
          },
          affinityCookieTtlSec: {
            type: "integer",
            description:
              "Lifetime of cookies in seconds. This setting is applicable to Application\nLoad Balancers and Traffic Director and requires\nGENERATED_COOKIE or HTTP_COOKIE session affinity.\n\nIf set to 0, the cookie is non-persistent and lasts only until\nthe end of the browser session (or equivalent). The maximum allowed value\nis two weeks (1,209,600).\n\nNot supported when the backend service is referenced by a URL map that is\nbound to target gRPC proxy that has validateForProxyless field set to true. (Format: int32)",
          },
          customMetrics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                dryRun: {
                  type: "boolean",
                  description:
                    "If true, the metric data is not used for load balancing.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of a custom utilization signal. The name must be 1-64 characters\nlong and match the regular expression\n`[a-z]([-_.a-z0-9]*[a-z0-9])?` which means that the\nfirst character must be a lowercase letter, and all following\ncharacters must be a dash, period, underscore, lowercase letter, or\ndigit, except the last character, which cannot be a dash, period, or\nunderscore. For usage guidelines, see Custom Metrics balancing mode. This\nfield can only be used for a global or regional backend service with the\nloadBalancingScheme set to EXTERNAL_MANAGED,INTERNAL_MANAGED INTERNAL_SELF_MANAGED.",
                },
              },
              description:
                "Custom Metrics are used for WEIGHTED_ROUND_ROBIN\nlocality_lb_policy.",
              additionalProperties: true,
            },
            description:
              "List of custom metrics that are used for theWEIGHTED_ROUND_ROBIN locality_lb_policy.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          iap: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "Whether the serving infrastructure will authenticate and authorize all\nincoming requests.",
              },
              oauth2ClientId: {
                type: "string",
                description:
                  "OAuth2 client ID to use for the authentication flow.",
              },
              oauth2ClientSecretSha256: {
                type: "string",
                description:
                  "[Output Only] SHA256 hash value for the field oauth2_client_secret above.",
              },
              oauth2ClientSecret: {
                type: "string",
                description:
                  "OAuth2 client secret to use for the authentication flow.\nFor security reasons, this value cannot be retrieved via the API.\nInstead, the SHA-256 hash of the value is returned in the\noauth2ClientSecretSha256 field.\n\n@InputOnly",
              },
            },
            description: "Identity-Aware Proxy",
            additionalProperties: true,
          },
          compressionMode: {
            type: "string",
            enum: ["AUTOMATIC", "DISABLED"],
            description:
              "Compress text responses using Brotli or gzip compression, based on\nthe client's Accept-Encoding header.",
          },
          customRequestHeaders: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the load balancer adds to proxied requests. See [Creating\ncustom\nheaders](https://cloud.google.com/load-balancing/docs/custom-headers).",
          },
          usedBy: {
            type: "array",
            items: {
              type: "object",
              properties: {
                reference: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for resources referencing given\nBackendService like UrlMaps, TargetTcpProxies, TargetSslProxies\nand ForwardingRule.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] List of resources referencing given backend service.",
          },
          edgeSecurityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the edge security policy associated with\nthis backend service.",
          },
          tlsSettings: {
            type: "object",
            properties: {
              subjectAltNames: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    uniformResourceIdentifier: {
                      type: "string",
                      description: "The SAN specified as a URI.",
                    },
                    dnsName: {
                      type: "string",
                      description: "The SAN specified as a DNS Name.",
                    },
                  },
                  description:
                    "A Subject Alternative Name that the load balancer matches against the SAN\nfield in the TLS certificate provided by the backend, specified as either\na DNS name or a URI, in accordance with RFC 5280 4.2.1.6",
                  additionalProperties: true,
                },
                description:
                  "A list of Subject Alternative Names (SANs) that the Load Balancer\nverifies during a TLS handshake with the backend. When the server\npresents its X.509 certificate to the Load Balancer, the Load Balancer\ninspects the certificate's SAN field, and requires that at least one SAN\nmatch one of the subjectAltNames in the list. This field is limited to 5\nentries. When both sni and subjectAltNames[] are specified, the load\nbalancer matches the backend certificate's SAN only to subjectAltNames[].",
              },
              authenticationConfig: {
                type: "string",
                description:
                  "Reference to the BackendAuthenticationConfig resource from the\nnetworksecurity.googleapis.com namespace. Can be used in authenticating\nTLS connections to the backend, as specified by the authenticationMode\nfield. Can only be specified if authenticationMode is not NONE.",
              },
              sni: {
                type: "string",
                description:
                  "Server Name Indication - see RFC3546 section 3.1. If set, the load\nbalancer sends this string as the SNI hostname in the TLS connection to\nthe backend, and requires that this string match a Subject Alternative\nName (SAN) in the backend's server certificate. With a Regional Internet\nNEG backend, if the SNI is specified here, the load balancer uses it\nregardless of whether the Regional Internet NEG is specified with FQDN or\nIP address and port. When both sni and subjectAltNames[] are specified,\nthe load balancer matches the backend certificate's SAN only to\nsubjectAltNames[].",
              },
            },
            additionalProperties: true,
          },
          consistentHash: {
            type: "object",
            properties: {
              minimumRingSize: {
                type: "string",
                description:
                  "The minimum number of virtual nodes to use for the hash ring. Defaults to\n1024. Larger ring sizes result in more granular load distributions. If the\nnumber of hosts in the load balancing pool is larger than the ring size,\neach host will be assigned a single virtual node. (Format: int64)",
              },
              httpCookie: {
                type: "object",
                properties: {
                  path: {
                    type: "string",
                    description: "Path to set for the cookie.",
                  },
                  ttl: {
                    type: "object",
                    properties: {
                      nanos: {
                        type: "integer",
                        description:
                          "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                      },
                      seconds: {
                        type: "string",
                        description:
                          "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                      },
                    },
                    description:
                      'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                    additionalProperties: true,
                  },
                  name: {
                    type: "string",
                    description: "Name of the cookie.",
                  },
                },
                description:
                  "The information about the HTTP Cookie on which the hash function is based\nfor load balancing policies that use a consistent hash.",
                additionalProperties: true,
              },
              httpHeaderName: {
                type: "string",
                description:
                  "The hash based on the value of the specified header field. This field is\napplicable if the sessionAffinity is set toHEADER_FIELD.",
              },
            },
            description:
              "This message defines settings for a consistent hash style load balancer.",
            additionalProperties: true,
          },
          serviceLbPolicy: {
            type: "string",
            description:
              "URL to networkservices.ServiceLbPolicy resource.\n\nCan only be set if load balancing scheme is EXTERNAL_MANAGED,\nINTERNAL_MANAGED or INTERNAL_SELF_MANAGED and the scope is global.",
          },
          ipAddressSelectionPolicy: {
            type: "string",
            enum: [
              "IPV4_ONLY",
              "IPV6_ONLY",
              "IP_ADDRESS_SELECTION_POLICY_UNSPECIFIED",
              "PREFER_IPV6",
            ],
            description:
              "Specifies a preference for traffic sent from the proxy to the backend (or\nfrom the client to the backend for proxyless gRPC).\nThe possible values are:\n   \n   - IPV4_ONLY: Only send IPv4 traffic to the backends of the\n   backend service (Instance Group, Managed Instance Group, Network Endpoint\n   Group), regardless of traffic from the client to the proxy. Only IPv4\n   health checks are used to check the health of the backends. This is the\n   default setting.\n   - PREFER_IPV6: Prioritize the connection to the endpoint's\n   IPv6 address over its IPv4 address (provided there is a healthy IPv6\n   address).\n   - IPV6_ONLY: Only send IPv6 traffic to the backends of the\n   backend service (Instance Group, Managed Instance Group, Network Endpoint\n   Group), regardless of traffic from the client to the proxy. Only IPv6\n   health checks are used to check the health of the backends.\n\n\n\nThis field is applicable to either:\n   \n   -  Advanced global external Application Load Balancer (load balancing\n   scheme EXTERNAL_MANAGED), \n   -  Regional external Application Load\n   Balancer, \n   -  Internal proxy Network Load Balancer (load balancing\n   scheme INTERNAL_MANAGED), \n   -  Regional internal Application Load\n   Balancer (load balancing scheme INTERNAL_MANAGED), \n   -  Traffic\n   Director with Envoy proxies and proxyless gRPC (load balancing scheme\n   INTERNAL_SELF_MANAGED).",
          },
          externalManagedMigrationState: {
            type: "string",
            enum: ["PREPARE", "TEST_ALL_TRAFFIC", "TEST_BY_PERCENTAGE"],
            description:
              "Specifies the canary migration state. Possible values are PREPARE,\nTEST_BY_PERCENTAGE, and TEST_ALL_TRAFFIC.\n\nTo begin the migration from EXTERNAL to EXTERNAL_MANAGED, the state must be\nchanged to PREPARE. The state must be changed to TEST_ALL_TRAFFIC before\nthe loadBalancingScheme can be changed to EXTERNAL_MANAGED. Optionally, the\nTEST_BY_PERCENTAGE state can be used to migrate traffic by percentage using\nexternalManagedMigrationTestingPercentage.\n\nRolling back a migration requires the states to be set in reverse order. So\nchanging the scheme from EXTERNAL_MANAGED to EXTERNAL requires the state to\nbe set to TEST_ALL_TRAFFIC at the same time. Optionally, the\nTEST_BY_PERCENTAGE state can be used to migrate some traffic back to\nEXTERNAL or PREPARE can be used to migrate all traffic back to EXTERNAL.",
          },
          customResponseHeaders: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Headers that the load balancer adds to proxied responses. See [Creating\ncustom\nheaders](https://cloud.google.com/load-balancing/docs/custom-headers).",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          connectionDraining: {
            type: "object",
            properties: {
              drainingTimeoutSec: {
                type: "integer",
                description:
                  "Configures a duration timeout for existing requests on a removed backend\ninstance. For supported load balancers and protocols, as described inEnabling\nconnection draining. (Format: int32)",
              },
            },
            description:
              "Message containing connection draining configuration.",
            additionalProperties: true,
          },
          backends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                maxConnectionsPerEndpoint: {
                  type: "integer",
                  description:
                    "Defines a target maximum number of simultaneous connections.  For usage\nguidelines, seeConnection\nbalancing mode and Utilization\nbalancing mode.\n\nNot available if the backend's balancingMode isRATE. (Format: int32)",
                },
                balancingMode: {
                  type: "string",
                  enum: ["CONNECTION", "CUSTOM_METRICS", "RATE", "UTILIZATION"],
                  description:
                    "Specifies how to determine whether the backend of a load balancer can\nhandle additional traffic or is fully loaded. For usage guidelines, see\nConnection balancing mode.\n\nBackends must use compatible balancing modes. For more information, see\nSupported balancing modes and target capacity settings and\nRestrictions and guidance for instance groups.\n\nNote: Currently, if you use the API to configure incompatible balancing\nmodes, the configuration might be accepted even though it has no impact\nand is ignored. Specifically, Backend.maxUtilization is ignored when\nBackend.balancingMode is RATE. In the future, this incompatible combination\nwill be rejected.",
                },
                group: {
                  type: "string",
                  description:
                    "The fully-qualified URL of aninstance\ngroup or network endpoint\ngroup (NEG) resource. To determine what types of backends a load\nbalancer supports, see the [Backend services\noverview](https://cloud.google.com/load-balancing/docs/backend-service#backends).\n\nYou must use the *fully-qualified* URL (starting withhttps://www.googleapis.com/) to specify the instance group\nor NEG. Partial URLs are not supported.\n\nIf haPolicy is specified, backends must refer to NEG resources of type\nGCE_VM_IP.",
                },
                maxRatePerInstance: {
                  type: "number",
                  description:
                    "Defines a maximum target for requests per second (RPS). For usage\nguidelines, seeRate\nbalancing mode and Utilization\nbalancing mode.\n\nNot available if the backend's balancingMode isCONNECTION. (Format: float)",
                },
                maxRate: {
                  type: "integer",
                  description:
                    "Defines a maximum number of HTTP requests per second (RPS). For\nusage guidelines, seeRate\nbalancing mode and Utilization\nbalancing mode.\n\nNot available if the backend's balancingMode isCONNECTION. (Format: int32)",
                },
                maxConnections: {
                  type: "integer",
                  description:
                    "Defines a target maximum number of simultaneous connections. For usage\nguidelines, seeConnection\nbalancing mode and Utilization\nbalancing mode. Not available if the backend'sbalancingMode is RATE. (Format: int32)",
                },
                preference: {
                  type: "string",
                  enum: ["DEFAULT", "PREFERENCE_UNSPECIFIED", "PREFERRED"],
                  description:
                    "This field indicates whether this backend should be fully utilized before\nsending traffic to backends with default preference. The possible values\nare:\n   \n   - PREFERRED: Backends with this preference level will be\n   filled up to their capacity limits first, based on RTT.\n   - DEFAULT:  If preferred backends don't have enough\n   capacity, backends in this layer would be used and traffic would be\n   assigned based on the load balancing algorithm you use. This is the\n   default",
                },
                failover: {
                  type: "boolean",
                  description:
                    "This field designates whether this is a failover backend. More than one\nfailover backend can be configured for a given BackendService.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                maxConnectionsPerInstance: {
                  type: "integer",
                  description:
                    "Defines a target maximum number of simultaneous connections.\nFor usage guidelines, seeConnection\nbalancing mode and Utilization\nbalancing mode.\n\nNot available if the backend's balancingMode isRATE. (Format: int32)",
                },
                customMetrics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      dryRun: {
                        type: "boolean",
                        description:
                          "If true, the metric data is collected and reported to Cloud\nMonitoring, but is not used for load balancing.",
                      },
                      name: {
                        type: "string",
                        description:
                          "Name of a custom utilization signal. The name must be 1-64 characters\nlong and match the regular expression\n`[a-z]([-_.a-z0-9]*[a-z0-9])?` which means that the\nfirst character must be a lowercase letter, and all following\ncharacters must be a dash, period, underscore, lowercase letter, or\ndigit, except the last character, which cannot be a dash, period, or\nunderscore. For usage guidelines, see Custom Metrics balancing mode. This\nfield can only be used for a global or regional backend service with the\nloadBalancingScheme set to EXTERNAL_MANAGED,INTERNAL_MANAGED INTERNAL_SELF_MANAGED.",
                      },
                      maxUtilization: {
                        type: "number",
                        description:
                          "Optional parameter to define a target utilization for the Custom Metrics\nbalancing mode. The valid range is [0.0, 1.0]. (Format: float)",
                      },
                    },
                    description:
                      "Custom Metrics are used for CUSTOM_METRICS balancing_mode.",
                    additionalProperties: true,
                  },
                  description:
                    "List of custom metrics that are used for CUSTOM_METRICS\nBalancingMode.",
                },
                maxUtilization: {
                  type: "number",
                  description:
                    "Optional parameter to define a target capacity for theUTILIZATION balancing mode. The valid range is[0.0, 1.0].\n\nFor usage guidelines, seeUtilization\nbalancing mode. (Format: float)",
                },
                capacityScaler: {
                  type: "number",
                  description:
                    "A multiplier applied to the backend's target capacity of its balancing\nmode.\nThe default value is 1, which means the group serves up to\n100% of its configured capacity (depending onbalancingMode). A setting of 0 means the group is\ncompletely drained, offering 0% of its available capacity. The valid ranges\nare 0.0 and [0.1,1.0].\nYou cannot configure a setting larger than 0 and smaller than0.1.\nYou cannot configure a setting of 0 when there is only one\nbackend attached to the backend service.\n\nNot available with backends that don't support using abalancingMode. This includes backends such as global\ninternet NEGs, regional serverless NEGs, and PSC NEGs. (Format: float)",
                },
                maxRatePerEndpoint: {
                  type: "number",
                  description:
                    "Defines a maximum target for requests per second (RPS). For usage\nguidelines, seeRate\nbalancing mode and Utilization\nbalancing mode.\n\nNot available if the backend's balancingMode isCONNECTION. (Format: float)",
                },
              },
              description:
                "Message containing information of one individual backend.",
              additionalProperties: true,
            },
            description: "The list of backends that serve this BackendService.",
          },
          port: {
            type: "integer",
            description:
              "Deprecated in favor of portName. The TCP port to connect on\nthe backend. The default value is 80.\nFor internal passthrough Network Load Balancers and external passthrough\nNetwork Load Balancers, omit port. (Format: int32)",
          },
          externalManagedMigrationTestingPercentage: {
            type: "number",
            description:
              "Determines the fraction of requests that should be processed by the Global\nexternal Application Load Balancer.\n\nThe value of this field must be in the range [0, 100].\n\nSession affinity options will slightly affect this routing behavior, for\nmore details, see:Session\nAffinity.\n\nThis value can only be set if the loadBalancingScheme in the BackendService\nis set to EXTERNAL (when using the classic Application Load Balancer) and\nthe migration state is TEST_BY_PERCENTAGE. (Format: float)",
          },
          metadatas: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Deployment metadata associated with the resource to be set by a GKE hub\ncontroller and read by the backend RCTH",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#backendService\nfor backend services.",
          },
          haPolicy: {
            type: "object",
            properties: {
              leader: {
                type: "object",
                properties: {
                  networkEndpoint: {
                    type: "object",
                    properties: {
                      instance: {
                        type: "string",
                        description:
                          "The name of the VM instance of the leader network endpoint. The\ninstance must already be attached to the NEG specified in the\nhaPolicy.leader.backendGroup.\n\nThe name must be 1-63 characters long, and comply with RFC1035.\nAuthorization requires the following IAM permission on the\nspecified resource instance: compute.instances.use",
                      },
                    },
                    additionalProperties: true,
                  },
                  backendGroup: {
                    type: "string",
                    description:
                      "A fully-qualified URL (starting with https://www.googleapis.com/)\nof the zonal Network Endpoint Group (NEG) with `GCE_VM_IP` endpoints\nthat the leader is attached to.\n\nThe leader's backendGroup must already be specified as a backend of\nthis backend service. Removing a backend that is designated as the\nleader's backendGroup is not permitted.",
                  },
                },
                additionalProperties: true,
              },
              fastIPMove: {
                type: "string",
                enum: ["DISABLED", "GARP_RA"],
                description:
                  "Specifies whether fast IP move is enabled, and if so, the mechanism to\nachieve it.\n\nSupported values are:\n   \n   - DISABLED: Fast IP Move is disabled. You can only use the\n   haPolicy.leader API to update the leader.\n   - >GARP_RA: Provides a method to very quickly define a new network\n   endpoint as the leader. This method is faster than updating the leader\n   using the haPolicy.leader API. Fast IP move works as follows: The VM\n   hosting the network endpoint that should become the new leader sends\n   either a Gratuitous ARP (GARP) packet (IPv4) or an ICMPv6 Router\n   Advertisement(RA) packet (IPv6).  Google Cloud immediately but\n   temporarily associates the forwarding rule IP address with that VM, and\n   both new and in-flight packets are quickly delivered to that VM.\n\n\n\nNote the important properties of the Fast IP Move functionality:\n   \n   - The GARP/RA-initiated re-routing stays active for approximately 20\n   minutes. After triggering fast failover, you must also\n   appropriately set the haPolicy.leader.\n   -  The new leader instance should continue to send GARP/RA packets\n   periodically every 10 seconds until at least 10 minutes after updating\n   the haPolicy.leader (but stop immediately if it is no longer the leader).\n   - After triggering a fast failover, we recommend that you wait at least\n   3 seconds before sending another GARP/RA packet from a different VM\n   instance to avoid race conditions.\n   - Don't send GARP/RA packets from different VM\n   instances at the same time. If multiple instances continue to send\n   GARP/RA packets, traffic might be routed to different destinations in an\n   alternating order. This condition ceases when a single instance\n   issues a GARP/RA packet.\n   - The GARP/RA request always takes priority over the leader API.\n   Using the haPolicy.leader API to change the leader to a different\n   instance will have no effect until the GARP/RA request becomes\n   inactive.\n   - The GARP/RA packets should follow the GARP/RA\n   Packet Specifications..\n   -  When multiple forwarding rules refer to a regional backend service,\n   you need only send a GARP or RA packet for a single forwarding rule\n   virtual IP. The virtual IPs for all forwarding rules targeting the same\n   backend service will also be moved to the sender of the GARP or RA\n   packet. \n\n\n\nThe following are the Fast IP Move limitations (that is, when fastIPMove\nis not DISABLED):\n   \n   - Multiple forwarding rules cannot use the same IP address if one of\n   them refers to a regional backend service with fastIPMove.\n   - The regional backend service must set the network field, and all\n   NEGs must belong to that network. However, individual\n   NEGs can belong to different subnetworks of that network. \n   - The maximum number of network endpoints across all backends of a\n   backend service with fastIPMove is 32.\n   - The maximum number of backend services with fastIPMove that can have\n   the same network endpoint attached to one of its backends is 64.\n   - The maximum number of backend services with fastIPMove in a VPC in a\n   region is 64.\n   - The network endpoints that are attached to a backend of a backend\n   service with fastIPMove cannot resolve to Gen3+ machines for IPv6.\n   - Traffic directed to the leader by a static route next hop will not be\n   redirected to a new leader by fast failover. Such traffic will only be\n   redirected once an haPolicy.leader update has taken effect. Only traffic\n   to the forwarding rule's virtual IP will be redirected to a new leader by\n   fast failover.\n\n\nhaPolicy.fastIPMove can be set only at backend service creation time.\nOnce set, it cannot be updated.\n\nBy default, fastIpMove is set to DISABLED.",
              },
            },
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          cdnPolicy: {
            type: "object",
            properties: {
              negativeCachingPolicy: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ttl: {
                      type: "integer",
                      description:
                        "The TTL (in seconds) for which to cache responses with the\ncorresponding status code.\nThe maximum allowed value is 1800s (30 minutes), noting that\ninfrequently accessed objects may be evicted from the cache before the\ndefined TTL. (Format: int32)",
                    },
                    code: {
                      type: "integer",
                      description:
                        "The HTTP status code to define a TTL against. Only HTTP status codes\n300, 301, 302, 307, 308, 404, 405, 410, 421, 451 and 501 can be\nspecified as values, and you cannot specify a status code more than\nonce. (Format: int32)",
                    },
                  },
                  description: "Specify CDN TTLs for response error codes.",
                  additionalProperties: true,
                },
                description:
                  "Sets a cache TTL for the specified HTTP status code.\nnegative_caching must be enabled to configure negative_caching_policy.\nOmitting the policy and leaving negative_caching enabled will use\nCloud CDN's default cache TTLs.\nNote that when specifying an explicit negative_caching_policy, you\nshould take care to specify a cache TTL for all response codes\nthat you wish to cache. Cloud CDN will not apply any default\nnegative caching when a policy exists.",
              },
              signedUrlKeyNames: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "[Output Only] Names of the keys for signing request URLs.",
              },
              defaultTtl: {
                type: "integer",
                description:
                  'Specifies the default TTL for cached content served by this origin for\nresponses that do not have an existing valid TTL (max-age or s-maxage).\nSetting a TTL of "0" means "always revalidate".\nThe value of defaultTTL cannot be set to a value greater than that of\nmaxTTL, but can be equal.\nWhen the cacheMode is set to FORCE_CACHE_ALL, the defaultTTL\nwill overwrite the TTL set in all responses. The maximum allowed value is\n31,622,400s (1 year), noting that infrequently accessed objects may be\nevicted from the cache before the defined TTL. (Format: int32)',
              },
              serveWhileStale: {
                type: "integer",
                description:
                  'Serve existing content from the cache (if available) when revalidating\ncontent with the origin, or when an error is encountered when refreshing\nthe cache.\nThis setting defines the default "max-stale" duration for any cached\nresponses that do not specify a max-stale directive. Stale responses that\nexceed the TTL configured here will not be served. The default limit\n(max-stale) is 86400s (1 day), which will allow stale content to be\nserved up to this limit beyond the max-age (or s-maxage) of a cached\nresponse.\nThe maximum allowed value is 604800 (1 week).\nSet this to zero (0) to disable serve-while-stale. (Format: int32)',
              },
              signedUrlCacheMaxAgeSec: {
                type: "string",
                description:
                  'Maximum number of seconds the response to a signed URL request will be\nconsidered fresh. After this time period, the response will be\nrevalidated before being served. Defaults to 1hr (3600s).  When serving\nresponses to signed URL requests, Cloud CDN will internally behave as\nthough all responses from this backend had a "Cache-Control:\npublic, max-age=[TTL]" header, regardless of any existing\nCache-Control header. The actual headers served in responses will not be\naltered. (Format: int64)',
              },
              bypassCacheOnRequestHeaders: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    headerName: {
                      type: "string",
                      description:
                        "The header field name to match on when bypassing cache.\nValues are case-insensitive.",
                    },
                  },
                  description:
                    "Bypass the cache when the specified request headers are present,\ne.g. Pragma or Authorization headers. Values are case insensitive.\nThe presence of such a header overrides the cache_mode setting.",
                  additionalProperties: true,
                },
                description:
                  "Bypass the cache when the specified request headers are matched - e.g.\nPragma or Authorization headers. Up to 5 headers can be specified.\nThe cache is bypassed for all cdnPolicy.cacheMode settings.",
              },
              cacheKeyPolicy: {
                type: "object",
                properties: {
                  queryStringWhitelist: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Names of query string parameters to include in cache keys. All other\nparameters will be excluded. Either specify query_string_whitelist or\nquery_string_blacklist, not both. '&' and '=' will be percent encoded and\nnot treated as delimiters.",
                  },
                  includeHost: {
                    type: "boolean",
                    description:
                      "If true, requests to different hosts will be cached separately.",
                  },
                  includeProtocol: {
                    type: "boolean",
                    description:
                      "If true, http and https requests will be cached separately.",
                  },
                  includeHttpHeaders: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Allows HTTP request headers (by name) to be used in the cache key.",
                  },
                  queryStringBlacklist: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Names of query string parameters to exclude in cache keys. All other\nparameters will be included. Either specify query_string_whitelist or\nquery_string_blacklist, not both. '&' and '=' will be percent encoded and\nnot treated as delimiters.",
                  },
                  includeQueryString: {
                    type: "boolean",
                    description:
                      "If true, include query string parameters in the cache key according to\nquery_string_whitelist and query_string_blacklist. If neither is set, the\nentire query string will be included. If false, the query string will be\nexcluded from the cache key entirely.",
                  },
                  includeNamedCookies: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Allows HTTP cookies (by name) to be used in the cache key.\nThe name=value pair will be used in the cache key Cloud CDN generates.",
                  },
                },
                description:
                  "Message containing what to include in the cache key for a request for Cloud\nCDN.",
                additionalProperties: true,
              },
              requestCoalescing: {
                type: "boolean",
                description:
                  "If true then Cloud CDN will combine multiple concurrent cache fill\nrequests into a small number of requests to the origin.",
              },
              negativeCaching: {
                type: "boolean",
                description:
                  "Negative caching allows per-status code TTLs to be set, in order\nto apply fine-grained caching for common errors or redirects.\nThis can reduce the load on your origin and improve end-user\nexperience by reducing response latency.\nWhen the cache mode is set to CACHE_ALL_STATIC or USE_ORIGIN_HEADERS,\nnegative caching applies to responses with the specified response code\nthat lack any Cache-Control, Expires, or Pragma: no-cache directives.\nWhen the cache mode is set to FORCE_CACHE_ALL, negative caching applies\nto all responses with the specified response code, and override any\ncaching headers.\nBy default, Cloud CDN will apply the following default TTLs to these\nstatus codes:\nHTTP 300 (Multiple Choice), 301, 308 (Permanent Redirects): 10m\nHTTP 404 (Not Found), 410 (Gone),\n451 (Unavailable For Legal Reasons): 120s\nHTTP 405 (Method Not Found), 501 (Not Implemented): 60s.\nThese defaults can be overridden in negative_caching_policy.",
              },
              maxTtl: {
                type: "integer",
                description:
                  'Specifies the maximum allowed TTL for cached content served by this\norigin.\nCache directives that attempt to set a max-age or s-maxage higher than\nthis, or an Expires header more than maxTTL seconds in the future will\nbe capped at the value of maxTTL, as if it were the value of an\ns-maxage Cache-Control directive.\nHeaders sent to the client will not be modified.\nSetting a TTL of "0" means "always revalidate".\nThe maximum allowed value is 31,622,400s (1 year), noting that\ninfrequently accessed objects may be evicted from the cache before\nthe defined TTL. (Format: int32)',
              },
              cacheMode: {
                type: "string",
                enum: [
                  "CACHE_ALL_STATIC",
                  "FORCE_CACHE_ALL",
                  "INVALID_CACHE_MODE",
                  "USE_ORIGIN_HEADERS",
                ],
                description:
                  'Specifies the cache setting for all responses from this backend.\nThe possible values are:USE_ORIGIN_HEADERS Requires the origin to set valid caching\nheaders to cache content. Responses without these headers will not be\ncached at Google\'s edge, and will require a full trip to the origin on\nevery request, potentially impacting performance and increasing load on\nthe origin server.FORCE_CACHE_ALL Cache all content, ignoring any "private",\n"no-store" or "no-cache" directives in Cache-Control response headers.\nWarning: this may result in Cloud CDN caching private,\nper-user (user identifiable) content.CACHE_ALL_STATIC Automatically cache static content,\nincluding common image formats, media (video and audio), and web assets\n(JavaScript and CSS). Requests and responses that are marked as\nuncacheable, as well as dynamic content (including HTML), will not be\ncached.\n\nIf no value is provided for cdnPolicy.cacheMode, it defaults\nto CACHE_ALL_STATIC.',
              },
              clientTtl: {
                type: "integer",
                description:
                  'Specifies a separate client (e.g. browser client) maximum TTL. This is\nused to clamp the max-age (or Expires) value sent to the client.  With\nFORCE_CACHE_ALL, the lesser of client_ttl and default_ttl is used for the\nresponse max-age directive, along with a "public" directive.  For\ncacheable content in CACHE_ALL_STATIC mode, client_ttl clamps the max-age\nfrom the origin (if specified), or else sets the response max-age\ndirective to the lesser of the client_ttl and default_ttl, and also\nensures a "public" cache-control directive is present.\nIf a client TTL is not specified, a default value (1 hour) will be used.\nThe maximum allowed value is 31,622,400s (1 year). (Format: int32)',
              },
            },
            description:
              "Message containing Cloud CDN configuration for a backend service.",
            additionalProperties: true,
          },
          maxStreamDuration: {
            type: "object",
            properties: {
              nanos: {
                type: "integer",
                description:
                  "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
              },
              seconds: {
                type: "string",
                description:
                  "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
              },
            },
            description:
              'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
            additionalProperties: true,
          },
          loadBalancingScheme: {
            type: "string",
            enum: [
              "EXTERNAL",
              "EXTERNAL_MANAGED",
              "INTERNAL",
              "INTERNAL_MANAGED",
              "INTERNAL_SELF_MANAGED",
              "INVALID_LOAD_BALANCING_SCHEME",
            ],
            description:
              "Specifies the load balancer type. A backend service\ncreated for one type of load balancer cannot be used with another.\nFor more information, refer toChoosing\na load balancer.",
          },
          outlierDetection: {
            type: "object",
            properties: {
              maxEjectionPercent: {
                type: "integer",
                description:
                  "Maximum percentage of backend endpoints in the load balancing pool for the\nbackend service that can be ejected if the ejection conditions are met.\nDefaults to 50%. (Format: int32)",
              },
              successRateRequestVolume: {
                type: "integer",
                description:
                  "The minimum number of total requests that must be collected in one interval\n(as defined by the interval duration above) to include this backend\nendpoint in success rate based outlier detection. If the volume is lower\nthan this setting, outlier detection via success rate statistics is not\nperformed for that backend endpoint. Defaults to 100.\n\nNot supported when the backend service uses Serverless NEG. (Format: int32)",
              },
              baseEjectionTime: {
                type: "object",
                properties: {
                  nanos: {
                    type: "integer",
                    description:
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
              successRateMinimumHosts: {
                type: "integer",
                description:
                  "The number of backend endpoints in the load balancing pool that must have\nenough request volume to detect success rate outliers. If the number of\nbackend endpoints is fewer than this setting, outlier detection via success\nrate statistics is not performed for any backend endpoint in the load\nbalancing pool. Defaults to 5.\n\nNot supported when the backend service uses Serverless NEG. (Format: int32)",
              },
              successRateStdevFactor: {
                type: "integer",
                description:
                  "This factor is used to determine the ejection threshold for success rate\noutlier ejection. The ejection threshold is the difference between the mean\nsuccess rate, and the product of this factor and the standard deviation of\nthe mean success rate: mean - (stdev * successRateStdevFactor). This factor\nis divided by a thousand to get a double. That is, if the desired factor\nis 1.9, the runtime value should be 1900. Defaults to 1900.\n\nNot supported when the backend service uses Serverless NEG. (Format: int32)",
              },
              interval: {
                type: "object",
                properties: {
                  nanos: {
                    type: "integer",
                    description:
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
              enforcingConsecutiveGatewayFailure: {
                type: "integer",
                description:
                  "The percentage chance that a backend endpoint will be ejected when an\noutlier status is detected through consecutive gateway failures. This\nsetting can be used to disable ejection or to ramp it up slowly. Defaults\nto 100. (Format: int32)",
              },
              consecutiveErrors: {
                type: "integer",
                description:
                  "Number of consecutive errors before a backend endpoint is ejected from the\nload balancing pool. When the backend endpoint is accessed over HTTP, a 5xx\nreturn code qualifies as an error. Defaults to 5. (Format: int32)",
              },
              consecutiveGatewayFailure: {
                type: "integer",
                description:
                  "The number of consecutive gateway failures (502, 503, 504 status or\nconnection errors that are mapped to one of those status codes) before a\nconsecutive gateway failure ejection occurs. Defaults to 3. (Format: int32)",
              },
              enforcingSuccessRate: {
                type: "integer",
                description:
                  "The percentage chance that a backend endpoint will be ejected when an\noutlier status is detected through success rate statistics. This setting\ncan be used to disable ejection or to ramp it up slowly. Defaults to 100.\n\nNot supported when the backend service uses Serverless NEG. (Format: int32)",
              },
              enforcingConsecutiveErrors: {
                type: "integer",
                description:
                  "The percentage chance that a backend endpoint will be ejected when an\noutlier status is detected through consecutive 5xx. This setting can be\nused to disable ejection or to ramp it up slowly. Defaults to 0. (Format: int32)",
              },
            },
            description:
              "Settings controlling the eviction of unhealthy hosts from the load balancing\npool for the backend service.",
            additionalProperties: true,
          },
          serviceBindings: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs of networkservices.ServiceBinding resources.\n\nCan only be set if load balancing scheme is INTERNAL_SELF_MANAGED.\nIf set, lists of backends and health checks must be both empty.",
          },
          portName: {
            type: "string",
            description:
              "A named port on a backend instance group representing the port for\ncommunication to the backend VMs in that group. The\nnamed port must be [defined on each backend instance\ngroup](https://cloud.google.com/load-balancing/docs/backend-service#named_ports).\nThis parameter has no meaning if the backends are NEGs. For internal\npassthrough Network Load Balancers and external passthrough Network Load\nBalancers, omit port_name.",
          },
          connectionTrackingPolicy: {
            type: "object",
            properties: {
              idleTimeoutSec: {
                type: "integer",
                description:
                  "Specifies how long to keep a Connection Tracking entry while there is no\nmatching traffic (in seconds).\n\nFor internal passthrough Network Load Balancers:\n   \n   - The minimum (default) is 10 minutes and the maximum is 16 hours.\n   - It can be set only if Connection Tracking is less than 5-tuple\n   (i.e. Session Affinity is CLIENT_IP_NO_DESTINATION,CLIENT_IP or CLIENT_IP_PROTO, and Tracking\n   Mode is PER_SESSION).\n\n\n\nFor external passthrough Network Load Balancers the default is 60\nseconds. This option is not available publicly. (Format: int32)",
              },
              connectionPersistenceOnUnhealthyBackends: {
                type: "string",
                enum: [
                  "ALWAYS_PERSIST",
                  "DEFAULT_FOR_PROTOCOL",
                  "NEVER_PERSIST",
                ],
                description:
                  "Specifies connection persistence when backends are unhealthy. The default\nvalue is DEFAULT_FOR_PROTOCOL.\n\nIf set to DEFAULT_FOR_PROTOCOL, the existing connections\npersist on unhealthy backends only for connection-oriented protocols\n(TCP and SCTP) and only if the Tracking Mode isPER_CONNECTION (default tracking mode) or the Session\nAffinity is configured for 5-tuple. They do not persist forUDP.\n\nIf set to NEVER_PERSIST, after a backend becomes unhealthy,\nthe existing connections on the unhealthy backend are never persisted on\nthe unhealthy backend. They are always diverted to newly selected healthy\nbackends (unless all backends are unhealthy).\n\nIf set to ALWAYS_PERSIST, existing connections always\npersist on unhealthy backends regardless of protocol and session\naffinity. It is generally not recommended to use this mode overriding the\ndefault.\n\nFor more details, see [Connection Persistence for Network Load\nBalancing](https://cloud.google.com/load-balancing/docs/network/networklb-backend-service#connection-persistence)\nand [Connection Persistence for Internal TCP/UDP Load\nBalancing](https://cloud.google.com/load-balancing/docs/internal#connection-persistence).",
              },
              trackingMode: {
                type: "string",
                enum: [
                  "INVALID_TRACKING_MODE",
                  "PER_CONNECTION",
                  "PER_SESSION",
                ],
                description:
                  "Specifies the key used for connection tracking. There are two\noptions:\n   \n   - PER_CONNECTION: This is the default mode. The Connection\n   Tracking is performed as per the Connection Key (default Hash Method) for\n   the specific protocol.\n   - PER_SESSION: The Connection Tracking is performed as per\n   the configured Session Affinity. It matches the configured Session\n   Affinity.\n\n\n\nFor more details, see [Tracking Mode for Network Load\nBalancing](https://cloud.google.com/load-balancing/docs/network/networklb-backend-service#tracking-mode)\nand [Tracking Mode for Internal TCP/UDP Load\nBalancing](https://cloud.google.com/load-balancing/docs/internal#tracking-mode).",
              },
              enableStrongAffinity: {
                type: "boolean",
                description:
                  "Enable Strong Session Affinity for external passthrough Network Load\nBalancers. This option is not available publicly.",
              },
            },
            description:
              "Connection Tracking configuration for this BackendService.",
            additionalProperties: true,
          },
          healthChecks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of URLs to the healthChecks, httpHealthChecks (legacy), or\nhttpsHealthChecks (legacy) resource for health checking this backend\nservice. Not all backend services support legacy health checks. See\nLoad balancer guide. Currently, at most one health check can be\nspecified for each backend service. Backend services with\ninstance group or zonal NEG backends must have a health check unless\nhaPolicy is specified. Backend services with internet or serverless NEG\nbackends must not have a health check.\n\nhealthChecks[] cannot be specified with haPolicy.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional backend service\nresides. This field is not applicable to global backend services.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          localityLbPolicy: {
            type: "string",
            enum: [
              "INVALID_LB_POLICY",
              "LEAST_REQUEST",
              "MAGLEV",
              "ORIGINAL_DESTINATION",
              "RANDOM",
              "RING_HASH",
              "ROUND_ROBIN",
              "WEIGHTED_GCP_RENDEZVOUS",
              "WEIGHTED_MAGLEV",
              "WEIGHTED_ROUND_ROBIN",
            ],
            description:
              "The load balancing algorithm used within the scope of the locality. The\npossible values are:\n   \n   - ROUND_ROBIN: This is a simple policy in which each healthy\n   backend is selected in round robin order. This is the default.\n   - LEAST_REQUEST: An O(1) algorithm which\n   selects two random healthy hosts and picks the host which has fewer active\n   requests.\n   - RING_HASH: The ring/modulo hash load balancer implements\n   consistent hashing to backends. The algorithm has the property that the\n   addition/removal of a host from a set of N hosts only affects 1/N of the\n   requests.\n   - RANDOM: The load balancer selects a random healthy\n   host.\n   - ORIGINAL_DESTINATION: Backend host is selected\n   based on the client connection metadata, i.e., connections are opened to\n   the same address as the destination address of the incoming connection\n   before the connection was redirected to the load balancer.\n   - MAGLEV: used as a drop in replacement for the ring hash\n   load balancer. Maglev is not as stable as ring hash but has faster table\n   lookup build times and host selection times. For more information about\n   Maglev, see Maglev:\n   A Fast and Reliable Software Network Load Balancer.\n   - WEIGHTED_ROUND_ROBIN: Per-endpoint Weighted Round Robin\n   Load Balancing using weights computed from Backend reported Custom Metrics.\n   If set, the Backend Service responses are expected to contain non-standard\n   HTTP response header field Endpoint-Load-Metrics. The reported\n   metrics to use for computing the weights are specified via thecustomMetrics field.\n   \n   This field is applicable to either:\n      - A regional backend service with the service_protocol set to HTTP,\n      HTTPS, HTTP2 or H2C, and load_balancing_scheme set to\n      INTERNAL_MANAGED. \n      - A global backend service with the\n      load_balancing_scheme set to INTERNAL_SELF_MANAGED, INTERNAL_MANAGED, or\n      EXTERNAL_MANAGED.\n   \n   \n   If sessionAffinity is not configured—that is, if session\n   affinity remains at the default value of NONE—then the\n   default value for localityLbPolicy\n   is ROUND_ROBIN. If session affinity is set to a value other\n   than NONE,\n   then the default value for localityLbPolicy isMAGLEV.\n   \n   Only ROUND_ROBIN and RING_HASH are supported\n   when the backend service is referenced by a URL map that is bound to\n   target gRPC proxy that has validateForProxyless field set to true.\n   \n   localityLbPolicy cannot be specified with haPolicy.",
          },
          securityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the security policy associated with this\nbackend service.",
          },
          subsetting: {
            type: "object",
            properties: {
              policy: {
                type: "string",
                enum: ["CONSISTENT_HASH_SUBSETTING", "NONE"],
              },
            },
            description:
              "Subsetting configuration for this BackendService.\nCurrently this is applicable only for Internal TCP/UDP load balancing,\nInternal HTTP(S) load balancing and Traffic Director.",
            additionalProperties: true,
          },
          localityLbPolicies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                policy: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      enum: [
                        "INVALID_LB_POLICY",
                        "LEAST_REQUEST",
                        "MAGLEV",
                        "ORIGINAL_DESTINATION",
                        "RANDOM",
                        "RING_HASH",
                        "ROUND_ROBIN",
                        "WEIGHTED_GCP_RENDEZVOUS",
                        "WEIGHTED_MAGLEV",
                        "WEIGHTED_ROUND_ROBIN",
                      ],
                      description:
                        "The name of a locality load-balancing policy. Valid values include\nROUND_ROBIN and, for Java clients, LEAST_REQUEST. For information\nabout these values, see the description of localityLbPolicy.\n\nDo not specify the same policy more than once for a\nbackend. If you do, the configuration is rejected.",
                    },
                  },
                  description:
                    "The configuration for a built-in load balancing policy.",
                  additionalProperties: true,
                },
                customPolicy: {
                  type: "object",
                  properties: {
                    data: {
                      type: "string",
                      description:
                        "An optional, arbitrary JSON object with configuration data, understood\nby a locally installed custom policy implementation.",
                    },
                    name: {
                      type: "string",
                      description:
                        "Identifies the custom policy.\n\nThe value should match the name of a custom implementation registered\non the gRPC clients. It should follow protocol buffer message naming\nconventions and include the full path (for example,\nmyorg.CustomLbPolicy). The maximum length is 256 characters.\n\nDo not specify the same custom policy more than once for a\nbackend. If you do, the configuration is rejected.\n\nFor an example of how to use this field, seeUse\na custom policy.",
                    },
                  },
                  description:
                    "The configuration for a custom policy implemented by the user and\ndeployed with the client.",
                  additionalProperties: true,
                },
              },
              description:
                "Container for either a built-in LB policy supported by gRPC or Envoy or\na custom one implemented by the end user.",
              additionalProperties: true,
            },
            description:
              "A list of locality load-balancing policies to be used in order of\npreference. When you use localityLbPolicies, you must set at least one\nvalue for either the localityLbPolicies[].policy or the\nlocalityLbPolicies[].customPolicy field. localityLbPolicies overrides any\nvalue set in the localityLbPolicy field.\n\nFor an example of how to use this field, seeDefine\na list of preferred policies.\n\nCaution: This field and its children are intended for use in a service mesh\nthat includes gRPC clients only. Envoy proxies can't use backend services\nthat have this configuration.",
          },
          circuitBreakers: {
            type: "object",
            properties: {
              maxRetries: {
                type: "integer",
                description:
                  "The maximum number of parallel retries allowed to the backend cluster. If\nnot specified, the default is 1.\n\nNot supported when the backend service is referenced by a URL map that is\nbound to target gRPC proxy that has validateForProxyless field set to true. (Format: int32)",
              },
              maxRequestsPerConnection: {
                type: "integer",
                description:
                  "Maximum requests for a single connection to the backend service.\nThis parameter is respected by both the HTTP/1.1 and HTTP/2\nimplementations. If not specified, there is no limit. Setting this\nparameter to 1 will effectively disable keep alive.\n\nNot supported when the backend service is referenced by a URL map that is\nbound to target gRPC proxy that has validateForProxyless field set to true. (Format: int32)",
              },
              maxConnections: {
                type: "integer",
                description:
                  "The maximum number of connections to the backend service. If not specified,\nthere is no limit.\n\nNot supported when the backend service is referenced by a URL map that is\nbound to target gRPC proxy that has validateForProxyless field set to true. (Format: int32)",
              },
              maxRequests: {
                type: "integer",
                description:
                  "The maximum number of parallel requests that allowed to the backend\nservice. If not specified, there is no limit. (Format: int32)",
              },
              maxPendingRequests: {
                type: "integer",
                description:
                  "The maximum number of pending requests allowed to the backend service. If\nnot specified, there is no limit.\n\nNot supported when the backend service is referenced by a URL map that is\nbound to target gRPC proxy that has validateForProxyless field set to true. (Format: int32)",
              },
            },
            description:
              "Settings controlling the volume of requests, connections and retries to this\nbackend service.",
            additionalProperties: true,
          },
          failoverPolicy: {
            type: "object",
            properties: {
              disableConnectionDrainOnFailover: {
                type: "boolean",
                description:
                  "This can be set to true only if the protocol isTCP.\n\nThe default is false.",
              },
              failoverRatio: {
                type: "number",
                description:
                  "The value of the field must be in the range[0, 1]. If the value is 0, the load balancer performs a\nfailover when the number of healthy primary VMs equals zero.\nFor all other values, the load balancer performs a failover when the\ntotal number of healthy primary VMs is less than this ratio.\nFor load balancers that have configurable\nfailover:\n[Internal TCP/UDP Load\nBalancing](https://cloud.google.com/load-balancing/docs/internal/failover-overview)\nand [external TCP/UDP Load\nBalancing](https://cloud.google.com/load-balancing/docs/network/networklb-failover-overview). (Format: float)",
              },
              dropTrafficIfUnhealthy: {
                type: "boolean",
                description:
                  "If set to true, connections to the\nload balancer are dropped when all primary and all backup backend VMs are\nunhealthy.If set to false, connections are distributed\namong all primary VMs when all primary and all backup backend VMs are\n unhealthy.\nFor load balancers that have configurable\nfailover:\n[Internal passthrough\nNetwork Load\nBalancers](https://cloud.google.com/load-balancing/docs/internal/failover-overview)\nand [external passthrough\nNetwork Load\nBalancers](https://cloud.google.com/load-balancing/docs/network/networklb-failover-overview).\nThe default is false.",
              },
            },
            description:
              "For load balancers that have configurable\nfailover:\n[Internal passthrough Network Load\nBalancers](https://cloud.google.com/load-balancing/docs/internal/failover-overview)\nand [external passthrough\nNetwork Load\nBalancers](https://cloud.google.com/load-balancing/docs/network/networklb-failover-overview).\nOn failover or failback, this field indicates whether connection draining\nwill be honored. Google Cloud has a fixed connection draining timeout of\n10 minutes. A setting of true terminates existing TCP\nconnections to the active pool during failover and failback, immediately\ndraining traffic. A setting of false allows existing TCP\nconnections to persist, even on VMs no longer in the active pool, for up\nto the duration of the connection draining timeout (10 minutes).",
            additionalProperties: true,
          },
          strongSessionAffinityCookie: {
            type: "object",
            properties: {
              ttl: {
                type: "object",
                properties: {
                  nanos: {
                    type: "integer",
                    description:
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
              path: {
                type: "string",
                description: "Path to set for the cookie.",
              },
              name: {
                type: "string",
                description: "Name of the cookie.",
              },
            },
            description: "The HTTP cookie used for stateful session affinity.",
            additionalProperties: true,
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          enableCDN: {
            type: "boolean",
            description:
              "If true, enables Cloud CDN for the backend service of a\nglobal external Application Load Balancer.",
          },
          securitySettings: {
            type: "object",
            properties: {
              clientTlsPolicy: {
                type: "string",
                description:
                  "Optional. A URL referring to a networksecurity.ClientTlsPolicy resource\nthat describes how clients should authenticate with this service's\nbackends.\n\n clientTlsPolicy only applies to a globalBackendService with the loadBalancingScheme set\nto INTERNAL_SELF_MANAGED.\n\n If left blank, communications are not encrypted.",
              },
              subjectAltNames: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Optional. A list of Subject Alternative Names (SANs) that the client\nverifies during a mutual TLS handshake with an server/endpoint for thisBackendService. When the server presents its X.509 certificate\nto the client, the client inspects the certificate'ssubjectAltName field. If the field contains one of the\nspecified values, the communication continues. Otherwise, it fails. This\nadditional check enables the client to verify that the server is authorized\nto run the requested service.\n\n Note that the contents of the server\ncertificate's subjectAltName field are configured by the\nPublic Key Infrastructure which provisions server identities.\n\n Only applies to a global BackendService withloadBalancingScheme set to INTERNAL_SELF_MANAGED.\nOnly applies when BackendService has an attachedclientTlsPolicy with clientCertificate (mTLS\nmode).",
              },
              awsV4Authentication: {
                type: "object",
                properties: {
                  accessKeyVersion: {
                    type: "string",
                    description:
                      "The optional version identifier for the access key. You can use this to\nkeep track of different iterations of your access key.",
                  },
                  originRegion: {
                    type: "string",
                    description:
                      'The name of the cloud region of your origin. This is a free-form field with\nthe name of the region your cloud uses to host your origin.  For example,\n"us-east-1" for AWS or "us-ashburn-1" for OCI.',
                  },
                  accessKey: {
                    type: "string",
                    description:
                      "The access key used for s3 bucket authentication. Required for updating or\ncreating a backend that uses AWS v4 signature authentication, but will not\nbe returned as part of the configuration when queried with a REST API GET\nrequest.\n\n@InputOnly",
                  },
                  accessKeyId: {
                    type: "string",
                    description:
                      "The identifier of an access key used for s3 bucket authentication.",
                  },
                },
                description:
                  "Contains the configurations necessary to generate a signature for access to\nprivate storage buckets that support Signature Version 4 for authentication.\nThe service name for generating the authentication header will always default\nto 's3'.",
                additionalProperties: true,
              },
            },
            description:
              "The authentication and authorization settings for a BackendService.",
            additionalProperties: true,
          },
          sessionAffinity: {
            type: "string",
            enum: [
              "CLIENT_IP",
              "CLIENT_IP_NO_DESTINATION",
              "CLIENT_IP_PORT_PROTO",
              "CLIENT_IP_PROTO",
              "GENERATED_COOKIE",
              "HEADER_FIELD",
              "HTTP_COOKIE",
              "NONE",
              "STRONG_COOKIE_AFFINITY",
            ],
            description:
              "Type of session affinity to use. The default is NONE.\n\nOnly NONE and HEADER_FIELD are supported\nwhen the backend service is referenced by a URL map that is bound to\ntarget gRPC proxy that has validateForProxyless field set to true.\n\nFor more details, see:\n[Session\nAffinity](https://cloud.google.com/load-balancing/docs/backend-service#session_affinity).\n\nsessionAffinity cannot be specified with haPolicy.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a BackendService. An up-to-date fingerprint must be provided in\norder to update the BackendService, otherwise the request will\nfail with error 412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a BackendService. (Format: byte)",
          },
          network: {
            type: "string",
            description:
              "The URL of the network to which this backend service belongs.\n\nThis field must be set for Internal Passthrough Network Load Balancers when\nthe haPolicy is enabled, and for External Passthrough Network Load\nBalancers when the haPolicy fastIpMove is enabled.\n\nThis field can only be specified when the load balancing scheme is set toINTERNAL, or when the load balancing scheme is set toEXTERNAL and haPolicy fastIpMove is enabled.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          protocol: {
            type: "string",
            enum: [
              "GRPC",
              "H2C",
              "HTTP",
              "HTTP2",
              "HTTPS",
              "SSL",
              "TCP",
              "UDP",
              "UNSPECIFIED",
            ],
            description:
              "The protocol this BackendService uses to communicate\nwith backends.\n\nPossible values are HTTP, HTTPS, HTTP2, H2C, TCP, SSL, UDP or GRPC.\ndepending on the chosen load balancer or Traffic Director configuration.\nRefer to the documentation for the load balancers or for Traffic Director\nfor more information.\n\nMust be set to GRPC when the backend service is referenced by a URL map\nthat is bound to target gRPC proxy.",
          },
          timeoutSec: {
            type: "integer",
            description:
              "The backend service timeout has a different meaning depending on the\ntype of load balancer. For more information see,\nBackend service settings.\nThe default is 30 seconds.\nThe full range of timeout values allowed goes from 1\nthrough 2,147,483,647 seconds.\n\nThis value can be overridden in the PathMatcher configuration of the\nUrlMap that references this backend service.\n\nNot supported when the backend service is referenced by a URL map that is\nbound to target gRPC proxy that has validateForProxyless field set to true.\nInstead, use maxStreamDuration. (Format: int32)",
          },
          logConfig: {
            type: "object",
            properties: {
              sampleRate: {
                type: "number",
                description:
                  "This field can only be specified if logging is enabled for this backend\nservice. The value of the field must be in [0, 1]. This configures the\nsampling rate of requests to the load balancer where 1.0 means all logged\nrequests are reported and 0.0 means no logged requests are reported. The\ndefault value is 1.0. (Format: float)",
              },
              optionalFields: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'This field can only be specified if logging is enabled for this backend\nservice and "logConfig.optionalMode" was set to CUSTOM. Contains a list\nof optional fields you want to include in the logs. For example:\nserverInstance, serverGkeDetails.cluster,\nserverGkeDetails.pod.podNamespace',
              },
              optionalMode: {
                type: "string",
                enum: [
                  "CUSTOM",
                  "EXCLUDE_ALL_OPTIONAL",
                  "INCLUDE_ALL_OPTIONAL",
                ],
                description:
                  "This field can only be specified if logging is enabled for this backend\nservice. Configures whether all, none or a subset of optional fields\nshould be added to the reported logs. One of [INCLUDE_ALL_OPTIONAL,\nEXCLUDE_ALL_OPTIONAL, CUSTOM]. Default is EXCLUDE_ALL_OPTIONAL.",
              },
              enable: {
                type: "boolean",
                description:
                  "Denotes whether to enable logging for the load balancer\ntraffic served by this backend service. The default value is false.",
              },
            },
            description:
              "The available logging options for the load balancer traffic served by this\nbackend service.",
            additionalProperties: true,
          },
        },
        description:
          "Represents a Backend Service resource.\n\nA backend service defines how Google Cloud load balancers distribute traffic.\nThe backend service configuration contains a set of values, such as the\nprotocol used to connect to backends, various distribution and session\nsettings, health checks, and timeouts. These settings provide fine-grained\ncontrol over how your load balancer behaves. Most of the settings have\ndefault values that allow for easy configuration if you need to get started\nquickly.\n\nBackend services in Google Compute Engine can be either regionally or\nglobally scoped.\n\n* [Global](https://cloud.google.com/compute/docs/reference/rest/v1/backendServices)\n* [Regional](https://cloud.google.com/compute/docs/reference/rest/v1/regionBackendServices)\n\nFor more information, seeBackend\nServices.",
        additionalProperties: true,
      },
    },
  },
};

export default backendServicesGet;
