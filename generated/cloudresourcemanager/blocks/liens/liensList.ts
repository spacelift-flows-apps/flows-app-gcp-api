import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const liensList: AppBlock = {
  name: "Liens - List",
  description: `List all Liens applied to the 'parent' resource.`,
  category: "Liens",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The name of the resource to list all attached Liens. For example, `projects/1234`. (google.api.field_policy).resource_type annotation is not set since the parent depends on the meta api implementation. This field could be a project or other sub project resources.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "The `next_page_token` value returned from a previous List request, if any.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "The maximum number of items to return. This is a suggestion for the server. The server can return fewer liens than requested. If unspecified, server picks an appropriate default.",
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
        let path = `v3/liens`;

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
          liens: {
            type: "array",
            items: {
              type: "object",
              properties: {
                restrictions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The types of operations which should be blocked as a result of this Lien. Each value should correspond to an IAM permission. The server will validate the permissions against those for which Liens are supported. An empty list is meaningless and will be rejected. Example: ['resourcemanager.projects.delete']",
                },
                origin: {
                  type: "string",
                  description:
                    "A stable, user-visible/meaningful string identifying the origin of the Lien, intended to be inspected programmatically. Maximum length of 200 characters. Example: 'compute.googleapis.com'",
                },
                createTime: {
                  type: "string",
                  description:
                    "The creation time of this Lien. (Format: google-datetime)",
                },
                reason: {
                  type: "string",
                  description:
                    "Concise user-visible strings indicating why an action cannot be performed on a resource. Maximum length of 200 characters. Example: 'Holds production API key'",
                },
                name: {
                  type: "string",
                  description:
                    "A system-generated unique identifier for this Lien. Example: `liens/1234abcd`",
                },
                parent: {
                  type: "string",
                  description:
                    "A reference to the resource this Lien is attached to. The server will validate the parent against those for which Liens are supported. Example: `projects/1234`",
                },
              },
              description:
                "A Lien represents an encumbrance on the actions that can be performed on a resource.",
              additionalProperties: true,
            },
            description: "A list of Liens.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Token to retrieve the next page of results, or empty if there are no more results in the list.",
          },
        },
        description: "The response message for Liens.ListLiens.",
        additionalProperties: true,
      },
    },
  },
};

export default liensList;
