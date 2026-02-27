import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const bucketsGetStorageLayout: AppBlock = {
  name: "Buckets - Get Storage Layout",
  description: `Returns the storage layout configuration for the specified bucket.`,
  category: "Buckets",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of a bucket.",
          type: {
            type: "string",
          },
          required: true,
        },
        prefix: {
          name: "Prefix",
          description:
            "An optional prefix used for permission check. It is useful when the caller only has storage.objects.list permission under a specific prefix.",
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
        let path = `b/{bucket}/storageLayout`;

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
          bucket: {
            type: "string",
            description: "The name of the bucket.",
          },
          customPlacementConfig: {
            type: "object",
            properties: {
              dataLocations: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The list of regional locations in which data is placed.",
              },
            },
            description:
              "The bucket's custom placement configuration for Custom Dual Regions.",
            additionalProperties: true,
          },
          hierarchicalNamespace: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "When set to true, hierarchical namespace is enabled for this bucket.",
              },
            },
            description: "The bucket's hierarchical namespace configuration.",
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For storage layout, this is always storage#storageLayout.",
          },
          location: {
            type: "string",
            description: "The location of the bucket.",
          },
          locationType: {
            type: "string",
            description: "The type of the bucket location.",
          },
        },
        description: "The storage layout configuration of a bucket.",
        additionalProperties: true,
      },
    },
  },
};

export default bucketsGetStorageLayout;
