import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const tagValuesList: AppBlock = {
  name: "Tag Values - List",
  description: `Lists all TagValues for a specific TagKey.`,
  category: "Tag Values",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Resource name for the parent of the TagValues to be listed, in the format `tagKeys/123` or `tagValues/123`.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `ListTagValues` that indicates where this listing should continue from.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of TagValues to return in the response. The server allows a maximum of 300 TagValues to return. If unspecified, the server will use 100 as the default.",
          type: {
            type: "integer",
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
        let path = `v3/tagValues`;

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
          tagValues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                shortName: {
                  type: "string",
                  description:
                    "Required. Immutable. User-assigned short name for TagValue. The short name should be unique for TagValues within the same parent TagKey. The short name must be 256 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.",
                },
                updateTime: {
                  type: "string",
                  description:
                    "Output only. Update time. (Format: google-datetime)",
                },
                name: {
                  type: "string",
                  description:
                    "Immutable. Resource name for TagValue in the format `tagValues/456`.",
                },
                parent: {
                  type: "string",
                  description:
                    "Immutable. The resource name of the new TagValue's parent TagKey. Must be of the form `tagKeys/{tag_key_id}`.",
                },
                namespacedName: {
                  type: "string",
                  description:
                    "Output only. The namespaced name of the TagValue. Can be in the form `{organization_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_number}/{tag_key_short_name}/{tag_value_short_name}`.",
                },
                etag: {
                  type: "string",
                  description:
                    "Optional. Entity tag which users can pass to prevent race conditions. This field is always set in server responses. See UpdateTagValueRequest for details.",
                },
                createTime: {
                  type: "string",
                  description:
                    "Output only. Creation time. (Format: google-datetime)",
                },
                description: {
                  type: "string",
                  description:
                    "Optional. User-assigned description of the TagValue. Must not exceed 256 characters. Read-write.",
                },
              },
              description:
                "A TagValue is a child of a particular TagKey. This is used to group cloud resources for the purpose of controlling them using policies.",
              additionalProperties: true,
            },
            description:
              "A possibly paginated list of TagValues that are direct descendants of the specified parent TagKey.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A pagination token returned from a previous call to `ListTagValues` that indicates from where listing should continue.",
          },
        },
        description: "The ListTagValues response.",
        additionalProperties: true,
      },
    },
  },
};

export default tagValuesList;
