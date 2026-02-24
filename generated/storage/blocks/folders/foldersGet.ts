import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const foldersGet: AppBlock = {
  name: "Folders - Get",
  description: `Returns metadata for the specified folder.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket in which the folder resides.",
          type: {
            type: "string",
          },
          required: true,
        },
        folder: {
          name: "Folder",
          description: "Name of a folder.",
          type: {
            type: "string",
          },
          required: true,
        },
        ifMetagenerationMatch: {
          name: "If Metageneration Match",
          description:
            "Makes the return of the folder metadata conditional on whether the folder's current metageneration matches the given value.",
          type: {
            type: "string",
          },
          required: false,
        },
        ifMetagenerationNotMatch: {
          name: "If Metageneration Not Match",
          description:
            "Makes the return of the folder metadata conditional on whether the folder's current metageneration does not match the given value.",
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
        let path = `b/{bucket}/folders/{folder}`;

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
    },
  },
};

export default foldersGet;
