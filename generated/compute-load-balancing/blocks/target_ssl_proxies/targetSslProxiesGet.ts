import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const targetSslProxiesGet: AppBlock = {
  name: "Target SSL Proxies - Get",
  description: `Returns the specified TargetSslProxy resource.`,
  category: "Target SSL Proxies",
  inputs: {
    default: {
      config: {
        targetSslProxy: {
          name: "Target SSL Proxy",
          description: "Name of the TargetSslProxy resource to return.",
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
        let path = `projects/{project}/global/targetSslProxies/{targetSslProxy}`;

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
          proxyHeader: {
            type: "string",
            enum: ["NONE", "PROXY_V1"],
            description:
              "Specifies the type of proxy header to append before sending data to the\nbackend, either NONE or PROXY_V1. The default\nis NONE.",
          },
          service: {
            type: "string",
            description: "URL to the BackendService resource.",
          },
          sslCertificates: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs to SslCertificate resources that are used to\nauthenticate connections to Backends. At least one SSL certificate\nmust be specified. Currently, you may specify up to 15 SSL certificates.\nsslCertificates do not apply when the load balancing scheme is set to\nINTERNAL_SELF_MANAGED.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          sslPolicy: {
            type: "string",
            description:
              "URL of SslPolicy resource that will be associated with the TargetSslProxy\nresource. If not set, the TargetSslProxy resource will not have any\nSSL policy configured.",
          },
          certificateMap: {
            type: "string",
            description:
              "URL of a certificate map that identifies a certificate map associated with\nthe given target proxy.\nThis field can only be set for global target proxies.\nIf set, sslCertificates will be ignored.\n\n Accepted format is//certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificateMaps/{resourceName}.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#targetSslProxy for target SSL proxies.",
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
            description: "[Output Only] Server-defined URL for the resource.",
          },
        },
        description:
          "Represents a Target SSL Proxy resource.\n\nA target SSL proxy is a component of a Proxy Network Load Balancer.\nThe forwarding rule references the target SSL proxy, and the target proxy\nthen references a backend service. For more information, readProxy Network\nLoad Balancer overview.",
        additionalProperties: true,
      },
    },
  },
};

export default targetSslProxiesGet;
