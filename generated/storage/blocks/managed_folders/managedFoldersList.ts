import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const managedFoldersList: AppBlock = {
  name: "Managed Folders - List",
  description: `Lists managed folders in the given bucket.`,
  category: "Managed Folders",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket containing the managed folder.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Maximum number of items to return in a single page of responses.",
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
        prefix: {
          name: "Prefix",
          description:
            "The managed folder name/path prefix to filter the output list of results.",
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
        let path = `b/{bucket}/managedFolders`;

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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bucket: {
                  type: "string",
                  description:
                    "The name of the bucket containing this managed folder.",
                },
                id: {
                  type: "string",
                  description:
                    "The ID of the managed folder, including the bucket name and managed folder name.",
                },
                kind: {
                  type: "string",
                  description:
                    "The kind of item this is. For managed folders, this is always storage#managedFolder.",
                },
                metageneration: {
                  type: "string",
                  description:
                    "The version of the metadata for this managed folder. Used for preconditions and for detecting changes in metadata. (Format: int64)",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the managed folder. Required if not specified by URL parameter.",
                },
                selfLink: {
                  type: "string",
                  description: "The link to this managed folder.",
                },
                createTime: {
                  type: "string",
                  description:
                    "The creation time of the managed folder in RFC 3339 format. (Format: date-time)",
                },
                updateTime: {
                  type: "string",
                  description:
                    "The last update time of the managed folder metadata in RFC 3339 format. (Format: date-time)",
                },
              },
              description: "A managed folder.",
              additionalProperties: true,
            },
            description: "The list of items.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For lists of managed folders, this is always storage#managedFolders.",
          },
          nextPageToken: {
            type: "string",
            description:
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
        },
        description: "A list of managed folders.",
        additionalProperties: true,
      },
    },
  },
};

export default managedFoldersList;
