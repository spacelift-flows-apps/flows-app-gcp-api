import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const list: AppBlock = {
  name: "Operations - List",
  description: `Lists projects that are direct children of the specified folder or organization resource.`,
  category: "Operations",
  inputs: {
    default: {
      config: {
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to ListProjects that indicates from where listing should continue.",
          type: {
            type: "string",
          },
          required: false,
        },
        parent: {
          name: "Parent",
          description:
            "Required. The name of the parent resource whose projects are being listed. Only children of this parent resource are listed; descendants are not listed. If the parent is a folder, use the value `folders/{folder_id}`. If the parent is an organization, use the value `organizations/{org_id}`.",
          type: {
            type: "string",
          },
          required: false,
        },
        showDeleted: {
          name: "Show Deleted",
          description:
            "Optional. Indicate that projects in the `DELETE_REQUESTED` state should also be returned. Normally only `ACTIVE` projects are returned.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of projects to return in the response. The server can return fewer projects than requested. If unspecified, server picks an appropriate default.",
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
        let path = `v3/projects`;

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
          projects: {
            type: "array",
            items: {
              type: "object",
              properties: {
                updateTime: {
                  type: "string",
                  description:
                    "Output only. The most recent time this resource was modified. (Format: google-datetime)",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    'Optional. The labels associated with this project. Label keys must be between 1 and 63 characters long and must conform to the following regular expression: \\[a-z\\](\\[-a-z0-9\\]*\\[a-z0-9\\])?. Label values must be between 0 and 63 characters long and must conform to the regular expression (\\[a-z\\](\\[-a-z0-9\\]*\\[a-z0-9\\])?)?. No more than 64 labels can be associated with a given resource. Clients should store labels in a representation such as JSON that does not depend on specific characters being disallowed. Example: `"myBusinessDimension" : "businessValue"`',
                },
                createTime: {
                  type: "string",
                  description:
                    "Output only. Creation time. (Format: google-datetime)",
                },
                configuredCapabilities: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Output only. If this project is a Management Project, list of capabilities configured on the parent folder. Note, presence of any capability implies that this is a Management Project. Example: `folders/123/capabilities/app-management`. OUTPUT ONLY.",
                },
                deleteTime: {
                  type: "string",
                  description:
                    "Output only. The time at which this resource was requested for deletion. (Format: google-datetime)",
                },
                parent: {
                  type: "string",
                  description:
                    "Optional. A reference to a parent Resource. eg., `organizations/123` or `folders/876`.",
                },
                projectId: {
                  type: "string",
                  description:
                    "Immutable. The unique, user-assigned id of the project. It must be 6 to 30 lowercase ASCII letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited. Example: `tokyo-rain-123`",
                },
                displayName: {
                  type: "string",
                  description:
                    "Optional. A user-assigned display name of the project. When present it must be between 4 to 30 characters. Allowed characters are: lowercase and uppercase letters, numbers, hyphen, single-quote, double-quote, space, and exclamation point. Example: `My Project`",
                },
                etag: {
                  type: "string",
                  description:
                    "Output only. A checksum computed by the server based on the current value of the Project resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
                },
                tags: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    'Optional. Input only. Immutable. Tag keys/values directly bound to this project. Each item in the map must be expressed as " : ". For example: "123/environment" : "production", "123/costCenter" : "marketing" Note: Currently this field is in Preview.',
                },
                state: {
                  type: "string",
                  enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
                  description: "Output only. The project lifecycle state.",
                },
                name: {
                  type: "string",
                  description:
                    'Output only. The unique resource name of the project. It is an int64 generated number prefixed by "projects/". Example: `projects/415104041262`',
                },
              },
              description:
                "A project is a high-level Google Cloud entity. It is a container for ACLs, APIs, App Engine Apps, VMs, and other Google Cloud Platform resources.",
              additionalProperties: true,
            },
            description:
              "The list of Projects under the parent. This list can be paginated.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Pagination token. If the result set is too large to fit in a single response, this token is returned. It encodes the position of the current result cursor. Feeding this value into a new list request with the `page_token` parameter gives the next page of the results. When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set. Pagination tokens have a limited lifetime.",
          },
        },
        description:
          "A page of the response received from the ListProjects method. A paginated response where more pages are available has `next_page_token` set. This token can be used in a subsequent request to retrieve the next request page. NOTE: A response may contain fewer elements than the request `page_size` and still have a `next_page_token`.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
