import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const targetTcpProxiesGet: AppBlock = {
  name: "Target TCP Proxies - Get",
  description: `Returns the specified TargetTcpProxy resource.`,
  category: "Target TCP Proxies",
  inputs: {
    default: {
      config: {
        targetTcpProxy: {
          name: "Target TCP Proxy",
          description: "Name of the TargetTcpProxy resource to return.",
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
        let path = `projects/{project}/global/targetTcpProxies/{targetTcpProxy}`;

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
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional TCP proxy resides.\nThis field is not applicable to global TCP proxy.",
          },
          proxyHeader: {
            type: "string",
            enum: ["NONE", "PROXY_V1"],
            description:
              "Specifies the type of proxy header to append before sending data to the\nbackend, either NONE or PROXY_V1. The default\nis NONE.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#targetTcpProxy for target TCP proxies.",
          },
          service: {
            type: "string",
            description: "URL to the BackendService resource.",
          },
          proxyBind: {
            type: "boolean",
            description:
              "This field only applies when the forwarding rule that references this\ntarget proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.\n\nWhen this field is set to true, Envoy proxies set up inbound\ntraffic interception and bind to the IP address and port specified in the\nforwarding rule. This is generally useful when using Traffic Director to\nconfigure Envoy as a gateway or middle proxy (in other words, not a\nsidecar proxy). The Envoy proxy listens for inbound requests and handles\nrequests when it receives them.\n\nThe default is false.",
          },
        },
        description:
          "Represents a Target TCP Proxy resource.\n\nA target TCP proxy is a component of a Proxy Network Load Balancer.\nThe forwarding rule references the target TCP proxy, and the target proxy\nthen references a backend service. For more information, readProxy Network\nLoad Balancer overview.",
        additionalProperties: true,
      },
    },
  },
};

export default targetTcpProxiesGet;
