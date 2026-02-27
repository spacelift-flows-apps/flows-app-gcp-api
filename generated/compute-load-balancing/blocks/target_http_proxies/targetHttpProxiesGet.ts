import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const targetHttpProxiesGet: AppBlock = {
  name: "Target HTTP Proxies - Get",
  description: `Returns the specified TargetHttpProxy resource.`,
  category: "Target HTTP Proxies",
  inputs: {
    default: {
      config: {
        targetHttpProxy: {
          name: "Target HTTP Proxy",
          description: "Name of the TargetHttpProxy resource to return.",
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
        let path = `projects/{project}/global/targetHttpProxies/{targetHttpProxy}`;

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
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a TargetHttpProxy. An up-to-date fingerprint must\nbe provided in order to patch/update the TargetHttpProxy; otherwise, the\nrequest will fail with error 412 conditionNotMet. To see the\nlatest fingerprint, make a get() request to retrieve the\nTargetHttpProxy. (Format: byte)",
          },
          httpKeepAliveTimeoutSec: {
            type: "integer",
            description:
              "Specifies how long to keep a connection open, after completing a response,\nwhile there is no matching traffic (in seconds). If an HTTP keep-alive is\nnot specified, a default value (610 seconds) will be used.\n\nFor global external Application Load Balancers, the minimum allowed value\nis 5 seconds and the maximum allowed value is 1200 seconds.\n\nFor classic Application Load Balancers, this option is not supported. (Format: int32)",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          proxyBind: {
            type: "boolean",
            description:
              "This field only applies when the forwarding rule that references this\ntarget proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.\n\nWhen this field is set to true, Envoy proxies set up inbound\ntraffic interception and bind to the IP address and port specified in the\nforwarding rule. This is generally useful when using Traffic Director to\nconfigure Envoy as a gateway or middle proxy (in other words, not a\nsidecar proxy). The Envoy proxy listens for inbound requests and handles\nrequests when it receives them.\n\nThe default is false.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional Target HTTP Proxy\nresides. This field is not applicable to global Target HTTP Proxies.",
          },
          urlMap: {
            type: "string",
            description:
              "URL to the UrlMap resource that defines the mapping from URL to\nthe BackendService.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#targetHttpProxy\nfor target HTTP proxies.",
          },
        },
        description:
          "Represents a Target HTTP Proxy resource.\n\nGoogle Compute Engine has two Target HTTP Proxy resources:\n\n* [Global](/compute/docs/reference/rest/v1/targetHttpProxies)\n* [Regional](/compute/docs/reference/rest/v1/regionTargetHttpProxies)\n\nA target HTTP proxy is a component of Google Cloud HTTP load balancers.\n\n* targetHttpProxies are used by global external Application Load Balancers,\n  classic Application Load Balancers, cross-region internal Application Load\n  Balancers, and Traffic Director.\n* regionTargetHttpProxies are used by regional internal Application Load\n  Balancers and regional external Application Load Balancers.\n\nForwarding rules reference a target HTTP proxy, and the target proxy\nthen references a URL map. For more information, readUsing Target Proxies\nand \nForwarding rule concepts.",
        additionalProperties: true,
      },
    },
  },
};

export default targetHttpProxiesGet;
