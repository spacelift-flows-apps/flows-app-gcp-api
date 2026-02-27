import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const anywhereCachesGet: AppBlock = {
  name: "Anywhere Caches - Get",
  description: `Returns the metadata of an Anywhere Cache instance.`,
  category: "Anywhere Caches",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the parent bucket.",
          type: {
            type: "string",
          },
          required: true,
        },
        anywhereCacheId: {
          name: "Anywhere Cache ID",
          description: "The ID of requested Anywhere Cache instance.",
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
              "https://www.googleapis.com/auth/cloud-platform.read-only",
              "https://www.googleapis.com/auth/devstorage.full_control",
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/devstorage.read_write",
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
        const baseUrl = "https://storage.googleapis.com/storage/v1/";
        let path = `b/{bucket}/anywhereCaches/{anywhereCacheId}`;

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
              "The kind of item this is. For Anywhere Cache, this is always storage#anywhereCache.",
          },
          id: {
            type: "string",
            description:
              "The ID of the resource, including the project number, bucket name and anywhere cache ID.",
          },
          selfLink: {
            type: "string",
            description: "The link to this cache instance.",
          },
          bucket: {
            type: "string",
            description:
              "The name of the bucket containing this cache instance.",
          },
          anywhereCacheId: {
            type: "string",
            description: "The ID of the Anywhere cache instance.",
          },
          zone: {
            type: "string",
            description:
              "The zone in which the cache instance is running. For example, us-central1-a.",
          },
          state: {
            type: "string",
            description: "The current state of the cache instance.",
          },
          createTime: {
            type: "string",
            description:
              "The creation time of the cache instance in RFC 3339 format. (Format: date-time)",
          },
          updateTime: {
            type: "string",
            description:
              "The modification time of the cache instance metadata in RFC 3339 format. (Format: date-time)",
          },
          ttl: {
            type: "string",
            description:
              'The TTL of all cache entries in whole seconds. e.g., "7200s". (Format: google-duration)',
          },
          admissionPolicy: {
            type: "string",
            description: "The cache-level entry admission policy.",
          },
          pendingUpdate: {
            type: "boolean",
            description:
              "True if the cache instance has an active Update long-running operation.",
          },
        },
        description: "An Anywhere Cache instance.",
        additionalProperties: true,
      },
    },
  },
};

export default anywhereCachesGet;
