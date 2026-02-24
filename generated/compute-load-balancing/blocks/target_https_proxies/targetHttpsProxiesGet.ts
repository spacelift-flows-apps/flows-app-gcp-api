import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const targetHttpsProxiesGet: AppBlock = {
  name: "Target HTTPS Proxies - Get",
  description: `Returns the specified TargetHttpsProxy resource.`,
  category: "Target HTTPS Proxies",
  inputs: {
    default: {
      config: {
        targetHttpsProxy: {
          name: "Target HTTPS Proxy",
          description: "Name of the TargetHttpsProxy resource to return.",
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
        let path = `projects/{project}/global/targetHttpsProxies/{targetHttpsProxy}`;

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
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          sslPolicy: {
            type: "string",
            description:
              "URL of SslPolicy resource that will be associated with the TargetHttpsProxy\nresource. If not set, the TargetHttpsProxy resource has no\nSSL policy configured.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional TargetHttpsProxy\nresides. This field is not applicable to global TargetHttpsProxies.",
          },
          tlsEarlyData: {
            type: "string",
            enum: ["DISABLED", "PERMISSIVE", "STRICT", "UNRESTRICTED"],
            description:
              'Specifies whether TLS 1.3 0-RTT Data ("Early Data") should be accepted\nfor this service. Early Data allows a TLS resumption handshake to include\nthe initial application payload (a HTTP request) alongside the handshake,\nreducing the effective round trips to "zero". This applies to TLS 1.3\nconnections over TCP (HTTP/2) as well as over UDP (QUIC/h3).\n\n\nThis can improve application performance, especially on networks where\ninterruptions may be common, such as on mobile.\n\n\nRequests with Early Data will have the "Early-Data" HTTP header set on\nthe request, with a value of "1", to allow the backend to determine whether\nEarly Data was included.\n\n\nNote: TLS Early Data may allow requests to be replayed, as the data is\nsent to the backend before the handshake has fully completed. Applications\nthat allow idempotent HTTP methods to make non-idempotent changes, such as\na GET request updating a database, should not accept Early Data on those\nrequests, and reject requests with the "Early-Data: 1" HTTP header by\nreturning a HTTP 425 (Too Early) status code, in order to remain RFC\ncompliant.\n\n\nThe default value is DISABLED.',
          },
          authorizationPolicy: {
            type: "string",
            description:
              "Optional. A URL referring to a networksecurity.AuthorizationPolicy resource\nthat describes how the proxy should authorize inbound traffic. If left\nblank, access will not be restricted by an authorization policy.\n\n Refer to the AuthorizationPolicy resource for additional\ndetails.\n\n authorizationPolicy only applies to a globalTargetHttpsProxy attached toglobalForwardingRules with theloadBalancingScheme set to INTERNAL_SELF_MANAGED.\n\n Note: This field currently has no impact.",
          },
          urlMap: {
            type: "string",
            description:
              "A fully-qualified or valid partial URL to the UrlMap resource that defines\nthe mapping from URL to the BackendService. For example, the following are\nall valid URLs for specifying a URL map:\n   \n   - https://www.googleapis.compute/v1/projects/project/global/urlMaps/url-map \n   - projects/project/global/urlMaps/url-map \n   - global/urlMaps/url-map",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a TargetHttpsProxy. An up-to-date fingerprint must\nbe provided in order to patch the TargetHttpsProxy; otherwise, the request\nwill fail with error 412 conditionNotMet. To see the latest\nfingerprint, make a get() request to retrieve the\nTargetHttpsProxy. (Format: byte)",
          },
          httpKeepAliveTimeoutSec: {
            type: "integer",
            description:
              "Specifies how long to keep a connection open, after completing a response,\nwhile there is no matching traffic (in seconds). If an HTTP keep-alive is\nnot specified, a default value (610 seconds) will be used.\n\nFor global external Application Load Balancers, the minimum allowed value\nis 5 seconds and the maximum allowed value is 1200 seconds.\n\nFor classic Application Load Balancers, this option is not supported. (Format: int32)",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          sslCertificates: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs to SslCertificate resources that are used to authenticate\nconnections between users and the load balancer. At least one SSL\ncertificate must be specified. SslCertificates do not apply when the load\nbalancing scheme is set to INTERNAL_SELF_MANAGED.\n\nThe URLs should refer to a SSL Certificate resource or Certificate Manager\nCertificate resource. Mixing Classic Certificates and Certificate Manager\nCertificates is not allowed. Certificate Manager Certificates must include\nthe certificatemanager API namespace. Using Certificate Manager\nCertificates in this field is not supported by Global external Application\nLoad Balancer or Classic Application Load Balancer, use certificate_map\ninstead.\n\nCurrently, you may specify up to 15 Classic SSL Certificates or up to 100\nCertificate Manager Certificates.\n\nCertificate Manager Certificates accepted formats are:\n   \n   - //certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificates/{resourceName}.\n   - https://certificatemanager.googleapis.com/v1alpha1/projects/{project}/locations/{location}/certificates/{resourceName}.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          proxyBind: {
            type: "boolean",
            description:
              "This field only applies when the forwarding rule that references this\ntarget proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.\n\nWhen this field is set to true, Envoy proxies set up inbound\ntraffic interception and bind to the IP address and port specified in the\nforwarding rule. This is generally useful when using Traffic Director to\nconfigure Envoy as a gateway or middle proxy (in other words, not a\nsidecar proxy). The Envoy proxy listens for inbound requests and handles\nrequests when it receives them.\n\nThe default is false.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Alwayscompute#targetHttpsProxy for target HTTPS proxies.",
          },
          certificateMap: {
            type: "string",
            description:
              "URL of a certificate map that identifies a certificate map associated with\nthe given target proxy.\nThis field can only be set for Global external Application Load Balancer or\nClassic Application Load Balancer. For other products use Certificate\nManager Certificates instead.\n\nIf set, sslCertificates will be ignored.\n\n Accepted format is//certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificateMaps/{resourceName}.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          serverTlsPolicy: {
            type: "string",
            description:
              "Optional. A URL referring to a networksecurity.ServerTlsPolicy resource\nthat describes how the proxy should authenticate inbound traffic.\n\n serverTlsPolicy only applies to a globalTargetHttpsProxy attached toglobalForwardingRules with theloadBalancingScheme set to INTERNAL_SELF_MANAGED\nor EXTERNAL orEXTERNAL_MANAGED or INTERNAL_MANAGED.\nIt also applies to a regional TargetHttpsProxy attached to\nregional forwardingRules with theloadBalancingScheme set to EXTERNAL_MANAGED orINTERNAL_MANAGED. For details whichServerTlsPolicy resources are accepted withINTERNAL_SELF_MANAGED and which with EXTERNAL,INTERNAL_MANAGED, EXTERNAL_MANAGEDloadBalancingScheme consult ServerTlsPolicy\ndocumentation.\n\n  If left blank, communications are not encrypted.",
          },
          quicOverride: {
            type: "string",
            enum: ["DISABLE", "ENABLE", "NONE"],
            description:
              "Specifies the QUIC override policy for this TargetHttpsProxy resource. This\nsetting determines whether the load balancer attempts to negotiate QUIC\nwith clients.\nYou can specify NONE, ENABLE, orDISABLE.\n   \n   - When quic-override is set to NONE,\n   Google manages whether QUIC is used.\n   - When quic-override is set to ENABLE, the\n   load balancer uses QUIC when possible.\n   - When quic-override is set to DISABLE, the\n   load balancer doesn't use QUIC.\n   - If the quic-override flag is not specified,NONE is implied.",
          },
        },
        description:
          "Represents a Target HTTPS Proxy resource.\n\nGoogle Compute Engine has two Target HTTPS Proxy resources:\n\n* [Global](/compute/docs/reference/rest/v1/targetHttpsProxies)\n* [Regional](/compute/docs/reference/rest/v1/regionTargetHttpsProxies)\n\nA target HTTPS proxy is a component of Google Cloud HTTPS load balancers.\n\n* targetHttpsProxies are used by global external Application Load Balancers,\n  classic Application Load Balancers, cross-region internal Application Load\n  Balancers, and Traffic Director.\n* regionTargetHttpsProxies are used by regional internal Application Load\n  Balancers and regional external Application Load Balancers.\n\nForwarding rules reference a target HTTPS proxy, and the target proxy\nthen references a URL map. For more information, readUsing Target Proxies\nand \nForwarding rule concepts.",
        additionalProperties: true,
      },
    },
  },
};

export default targetHttpsProxiesGet;
