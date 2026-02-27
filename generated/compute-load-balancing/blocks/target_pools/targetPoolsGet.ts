import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const targetPoolsGet: AppBlock = {
  name: "Target Pools - Get",
  description: `Returns the specified target pool.`,
  category: "Target Pools",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        targetPool: {
          name: "Target Pool",
          description: "Name of the TargetPool resource to return.",
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
        let path = `projects/{project}/regions/{region}/targetPools/{targetPool}`;

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
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#targetPool\nfor target pools.",
          },
          securityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the security policy associated with this\ntarget pool.",
          },
          instances: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of resource URLs to the virtual machine instances serving this pool.\nThey must live in zones contained in the same region as this pool.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the target pool resides.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          backupPool: {
            type: "string",
            description:
              'The server-defined URL for the resource. This field is applicable only when\nthe containing target pool is serving a forwarding rule as the primary\npool, and its failoverRatio field is properly set to a value\nbetween [0, 1].backupPool and failoverRatio together define\nthe fallback behavior of the primary target pool: if the ratio of the\nhealthy instances in the primary pool is at or belowfailoverRatio, traffic arriving at the load-balanced\nIP will be directed to the backup pool.\n\nIn case where failoverRatio and backupPool\nare not set, or all the instances in the backup pool are unhealthy,\nthe traffic will be directed back to the primary pool in the "force"\nmode, where traffic will be spread to the healthy instances with the\nbest effort, or to all instances when no instance is healthy.',
          },
          healthChecks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The URL of the HttpHealthCheck resource. A member instance in this\npool is considered healthy if and only if the health checks pass.\nOnly legacy HttpHealthChecks are supported. Only one health check may be\nspecified.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
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
              "Session affinity option, must be one of the following values: \nNONE: Connections from the same client IP may go to any\n    instance in the pool. \nCLIENT_IP: Connections from the same client IP will go\n    to the same instance in\n    the pool while that instance remains healthy. \nCLIENT_IP_PROTO: Connections from the same client IP\n    with the same IP protocol will go to the same instance in the\n    pool while that instance remains healthy.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          failoverRatio: {
            type: "number",
            description:
              'This field is applicable only when the containing target pool is serving a\nforwarding rule as the primary pool (i.e., not as a backup pool to some\nother target pool). The value of the field must be in [0, 1].\n\nIf set, backupPool must also be set. They together define\nthe fallback behavior of the primary target pool: if the ratio of the\nhealthy instances in the primary pool is at or below this number,\ntraffic arriving at the load-balanced IP will be directed to the\nbackup pool.\n\nIn case where failoverRatio is not set or all the\ninstances in the backup pool are unhealthy, the traffic will be\ndirected back to the primary pool in the "force" mode, where traffic\nwill be spread to the healthy instances with the\nbest effort, or to all instances when no instance is healthy. (Format: float)',
          },
        },
        description:
          "Represents a Target Pool resource.\n\nTarget pools are used with external passthrough Network Load Balancers.\nA target pool references member instances, an associated legacy\nHttpHealthCheck resource, and, optionally, a backup target pool.\nFor more information, readUsing target pools.",
        additionalProperties: true,
      },
    },
  },
};

export default targetPoolsGet;
