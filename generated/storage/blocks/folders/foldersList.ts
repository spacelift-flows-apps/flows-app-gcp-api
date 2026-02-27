import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const foldersList: AppBlock = {
  name: "Folders - List",
  description: `Retrieves a list of folders matching the criteria.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket in which to look for folders.",
          type: {
            type: "string",
          },
          required: true,
        },
        delimiter: {
          name: "Delimiter",
          description:
            "Returns results in a directory-like mode. The only supported value is '/'. If set, items will only contain folders that either exactly match the prefix, or are one level below the prefix.",
          type: {
            type: "string",
          },
          required: false,
        },
        endOffset: {
          name: "End Offset",
          description:
            "Filter results to folders whose names are lexicographically before endOffset. If startOffset is also set, the folders listed will have names between startOffset (inclusive) and endOffset (exclusive).",
          type: {
            type: "string",
          },
          required: false,
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
            "Filter results to folders whose paths begin with this prefix. If set, the value must either be an empty string or end with a '/'.",
          type: {
            type: "string",
          },
          required: false,
        },
        startOffset: {
          name: "Start Offset",
          description:
            "Filter results to folders whose names are lexicographically equal to or after startOffset. If endOffset is also set, the folders listed will have names between startOffset (inclusive) and endOffset (exclusive).",
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
        let path = `b/{bucket}/folders`;

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
                  description: "The name of the bucket containing this folder.",
                },
                id: {
                  type: "string",
                  description:
                    "The ID of the folder, including the bucket name, folder name.",
                },
                kind: {
                  type: "string",
                  description:
                    "The kind of item this is. For folders, this is always storage#folder.",
                },
                metageneration: {
                  type: "string",
                  description:
                    "The version of the metadata for this folder. Used for preconditions and for detecting changes in metadata. (Format: int64)",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the folder. Required if not specified by URL parameter.",
                },
                selfLink: {
                  type: "string",
                  description: "The link to this folder.",
                },
                createTime: {
                  type: "string",
                  description:
                    "The creation time of the folder in RFC 3339 format. (Format: date-time)",
                },
                updateTime: {
                  type: "string",
                  description:
                    "The modification time of the folder metadata in RFC 3339 format. (Format: date-time)",
                },
                pendingRenameInfo: {
                  type: "object",
                  properties: {
                    operationId: {
                      type: "string",
                      description: "The ID of the rename folder operation.",
                    },
                  },
                  description:
                    "Only present if the folder is part of an ongoing rename folder operation. Contains information which can be used to query the operation status.",
                  additionalProperties: true,
                },
              },
              description:
                "A folder. Only available in buckets with hierarchical namespace enabled.",
              additionalProperties: true,
            },
            description: "The list of items.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For lists of folders, this is always storage#folders.",
          },
          nextPageToken: {
            type: "string",
            description:
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
        },
        description: "A list of folders.",
        additionalProperties: true,
      },
    },
  },
};

export default foldersList;
