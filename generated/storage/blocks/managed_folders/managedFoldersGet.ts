import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const managedFoldersGet: AppBlock = {
  name: "Managed Folders - Get",
  description: `Returns metadata of the specified managed folder.`,
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
        managedFolder: {
          name: "Managed Folder",
          description: "The managed folder name/path.",
          type: {
            type: "string",
          },
          required: true,
        },
        ifMetagenerationMatch: {
          name: "If Metageneration Match",
          description:
            "Makes the return of the managed folder metadata conditional on whether the managed folder's current metageneration matches the given value.",
          type: {
            type: "string",
          },
          required: false,
        },
        ifMetagenerationNotMatch: {
          name: "If Metageneration Not Match",
          description:
            "Makes the return of the managed folder metadata conditional on whether the managed folder's current metageneration does not match the given value.",
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
        let path = `b/{bucket}/managedFolders/{managedFolder}`;

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
    },
  },
};

export default managedFoldersGet;
