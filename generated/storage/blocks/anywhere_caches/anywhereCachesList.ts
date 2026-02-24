import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const anywhereCachesList: AppBlock = {
  name: "Anywhere Caches - List",
  description: `Returns a list of Anywhere Cache instances of the bucket matching the criteria.`,
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
        pageSize: {
          name: "Page Size",
          description:
            "Maximum number of items to return in a single page of responses. Maximum 1000.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A previously-returned page token representing part of the larger set of results to view.",
          type: {
            type: "string",
          },
          required: false,
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
        let path = `b/{bucket}/anywhereCaches`;

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
          kind: {
            type: "string",
            description:
              "The kind of item this is. For lists of Anywhere Caches, this is always storage#anywhereCaches.",
          },
          nextPageToken: {
            type: "string",
            description:
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
          items: {
            type: "array",
            items: {
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
            description: "The list of items.",
          },
        },
        description: "A list of Anywhere Caches.",
        additionalProperties: true,
      },
    },
  },
};

export default anywhereCachesList;
