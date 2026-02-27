import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const httpHealthChecksGet: AppBlock = {
  name: "HTTP Health Checks - Get",
  description: `Returns the specified HttpHealthCheck resource.`,
  category: "HTTP Health Checks",
  inputs: {
    default: {
      config: {
        httpHealthCheck: {
          name: "HTTP Health Check",
          description: "Name of the HttpHealthCheck resource to return.",
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
        let path = `projects/{project}/global/httpHealthChecks/{httpHealthCheck}`;

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
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          port: {
            type: "integer",
            description:
              "The TCP port number for the HTTP health check request. The default value is80. (Format: int32)",
          },
          checkIntervalSec: {
            type: "integer",
            description:
              "How often (in seconds) to send a health check. The default value is5 seconds. (Format: int32)",
          },
          host: {
            type: "string",
            description:
              "The value of the host header in the HTTP health check request. If left\nempty (default value), the public IP on behalf of which this health check\nis performed will be used.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          requestPath: {
            type: "string",
            description:
              "The request path of the HTTP health check request. The default value is/. This field does not support query\nparameters. Must comply withRFC3986.",
          },
          unhealthyThreshold: {
            type: "integer",
            description:
              "A so-far healthy instance will be marked unhealthy after this\nmany consecutive failures. The default value is 2. (Format: int32)",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          healthyThreshold: {
            type: "integer",
            description:
              "A so-far unhealthy instance will be marked healthy after this\nmany consecutive successes. The default value is 2. (Format: int32)",
          },
          timeoutSec: {
            type: "integer",
            description:
              "How long (in seconds) to wait before claiming failure. The default value is5 seconds. It is invalid for timeoutSec to have\ngreater value than checkIntervalSec. (Format: int32)",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#httpHealthCheck for HTTP health checks.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
        },
        description:
          "Represents a legacy HTTP Health Check resource.\n\nLegacy HTTP health checks are now only required by target pool-based network\nload balancers. For all other load balancers, including backend service-based\nnetwork load balancers, and for managed instance group auto-healing, you must\nuse modern (non-legacy) health checks.\n\nFor more information, seeHealth checks\noverview.",
        additionalProperties: true,
      },
    },
  },
};

export default httpHealthChecksGet;
