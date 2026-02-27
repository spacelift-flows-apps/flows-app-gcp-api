import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const managedFoldersInsert: AppBlock = {
  name: "Managed Folders - Insert",
  description: `Creates a new managed folder.`,
  category: "Managed Folders",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "The name of the bucket containing this managed folder.",
          type: {
            type: "string",
            description:
              "The name of the bucket containing this managed folder.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "The ID of the managed folder, including the bucket name and managed folder name.",
          type: {
            type: "string",
            description:
              "The ID of the managed folder, including the bucket name and managed folder name.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "The kind of item this is.",
          type: {
            type: "string",
            description:
              "The kind of item this is. For managed folders, this is always storage#managedFolder.",
          },
          required: false,
        },
        metageneration: {
          name: "Metageneration",
          description: "The version of the metadata for this managed folder.",
          type: {
            type: "string",
            description:
              "The version of the metadata for this managed folder. Used for preconditions and for detecting changes in metadata. (Format: int64)",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "The name of the managed folder.",
          type: {
            type: "string",
            description:
              "The name of the managed folder. Required if not specified by URL parameter.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "The link to this managed folder.",
          type: {
            type: "string",
            description: "The link to this managed folder.",
          },
          required: false,
        },
        createTime: {
          name: "Create Time",
          description:
            "The creation time of the managed folder in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The creation time of the managed folder in RFC 3339 format. (Format: date-time)",
          },
          required: false,
        },
        updateTime: {
          name: "Update Time",
          description:
            "The last update time of the managed folder metadata in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The last update time of the managed folder metadata in RFC 3339 format. (Format: date-time)",
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
              "https://www.googleapis.com/auth/devstorage.full_control",
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
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.bucket !== undefined)
          requestBody.bucket = input.event.inputConfig.bucket;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.metageneration !== undefined)
          requestBody.metageneration = input.event.inputConfig.metageneration;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.createTime !== undefined)
          requestBody.createTime = input.event.inputConfig.createTime;
        if (input.event.inputConfig.updateTime !== undefined)
          requestBody.updateTime = input.event.inputConfig.updateTime;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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

export default managedFoldersInsert;
