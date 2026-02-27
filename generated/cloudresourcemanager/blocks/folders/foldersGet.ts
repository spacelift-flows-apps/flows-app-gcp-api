import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const foldersGet: AppBlock = {
  name: "Folders - Get",
  description: `Retrieves a folder identified by the supplied resource name.`,
  category: "Folders",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the folder to retrieve. Must be of the form `folders/{folder_id}`.",
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
        const baseUrl = "https://cloudresourcemanager.googleapis.com/";
        let path = `v3/{+name}`;

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
          etag: {
            type: "string",
            description:
              "Output only. A checksum computed by the server based on the current value of the folder resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
          },
          displayName: {
            type: "string",
            description:
              "The folder's display name. A folder's display name must be unique amongst its siblings. For example, no two folders with the same parent can share the same display name. The display name must start and end with a letter or digit, may contain letters, digits, spaces, hyphens and underscores and can be no longer than 30 characters. This is captured by the regular expression: `[\\p{L}\\p{N}]([\\p{L}\\p{N}_- ]{0,28}[\\p{L}\\p{N}])?`.",
          },
          managementProject: {
            type: "string",
            description:
              "Output only. Management Project associated with this folder (if app-management capability is enabled). Example: `projects/google-mp-123` OUTPUT ONLY.",
          },
          parent: {
            type: "string",
            description:
              "Required. The folder's parent's resource name. Updates to the folder's parent must be performed using MoveFolder.",
          },
          name: {
            type: "string",
            description:
              'Identifier. The resource name of the folder. Its format is `folders/{folder_id}`, for example: "folders/1234".',
          },
          deleteTime: {
            type: "string",
            description:
              "Output only. Timestamp when the folder was requested to be deleted. (Format: google-datetime)",
          },
          createTime: {
            type: "string",
            description:
              "Output only. Timestamp when the folder was created. (Format: google-datetime)",
          },
          updateTime: {
            type: "string",
            description:
              "Output only. Timestamp when the folder was last modified. (Format: google-datetime)",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Optional. Input only. Immutable. Tag keys/values directly bound to this folder. Each item in the map must be expressed as " : ". For example: "123/environment" : "production", "123/costCenter" : "marketing" Note: Currently this field is in Preview.',
          },
          configuredCapabilities: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. Optional capabilities configured for this folder (via UpdateCapability API). Example: `folders/123/capabilities/app-management`.",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
            description:
              "Output only. The lifecycle state of the folder. Updates to the state must be performed using DeleteFolder and UndeleteFolder.",
          },
        },
        description:
          "A folder in an organization's resource hierarchy, used to organize that organization's resources.",
        additionalProperties: true,
      },
    },
  },
};

export default foldersGet;
