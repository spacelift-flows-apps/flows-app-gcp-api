import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const foldersInsert: AppBlock = {
  name: "Folders - Insert",
  description: `Creates a new folder.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "The name of the bucket containing this folder.",
          type: {
            type: "string",
            description: "The name of the bucket containing this folder.",
          },
          required: false,
        },
        recursive: {
          name: "Recursive",
          description:
            "If true, any parent folder which doesn't exist will be created automatically.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "The ID of the folder, including the bucket name, folder name.",
          type: {
            type: "string",
            description:
              "The ID of the folder, including the bucket name, folder name.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "The kind of item this is.",
          type: {
            type: "string",
            description:
              "The kind of item this is. For folders, this is always storage#folder.",
          },
          required: false,
        },
        metageneration: {
          name: "Metageneration",
          description: "The version of the metadata for this folder.",
          type: {
            type: "string",
            description:
              "The version of the metadata for this folder. Used for preconditions and for detecting changes in metadata. (Format: int64)",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "The name of the folder.",
          type: {
            type: "string",
            description:
              "The name of the folder. Required if not specified by URL parameter.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "The link to this folder.",
          type: {
            type: "string",
            description: "The link to this folder.",
          },
          required: false,
        },
        createTime: {
          name: "Create Time",
          description: "The creation time of the folder in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The creation time of the folder in RFC 3339 format. (Format: date-time)",
          },
          required: false,
        },
        updateTime: {
          name: "Update Time",
          description:
            "The modification time of the folder metadata in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The modification time of the folder metadata in RFC 3339 format. (Format: date-time)",
          },
          required: false,
        },
        pendingRenameInfo: {
          name: "Pending Rename Info",
          description:
            "Only present if the folder is part of an ongoing rename folder operation.",
          type: {
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
        let path = `b/{bucket}/folders`;

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
        if (input.event.inputConfig.pendingRenameInfo !== undefined)
          requestBody.pendingRenameInfo =
            input.event.inputConfig.pendingRenameInfo;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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

export default foldersInsert;
