import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const connectionsFetchLinkableRepositories: AppBlock = {
  name: "Connections - Fetch Linkable Repositories",
  description: `FetchLinkableRepositories get repositories from SCM that are accessible and could be added to the connection.`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        connection: {
          name: "Connection",
          description:
            "Required. The name of the Connection. Format: `projects/*/locations/*/connections/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Number of results to return in the list. Default to 20.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description: "Page start.",
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
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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
        const baseUrl = "https://cloudbuild.googleapis.com/";
        let path = `v2/{+connection}:fetchLinkableRepositories`;

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
          repositories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Immutable. Resource name of the repository, in the format `projects/*/locations/*/connections/*/repositories/*`.",
                },
                remoteUri: {
                  type: "string",
                  description: "Required. Git Clone HTTPS URI.",
                },
                createTime: {
                  type: "string",
                  description:
                    "Output only. Server assigned timestamp for when the connection was created. (Format: google-datetime)",
                },
                updateTime: {
                  type: "string",
                  description:
                    "Output only. Server assigned timestamp for when the connection was updated. (Format: google-datetime)",
                },
                annotations: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Optional. Allows clients to store small amounts of arbitrary data.",
                },
                etag: {
                  type: "string",
                  description:
                    "This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
                },
                webhookId: {
                  type: "string",
                  description:
                    "Output only. External ID of the webhook created for the repository.",
                },
              },
              description: "A repository associated to a parent connection.",
              additionalProperties: true,
            },
            description: "repositories ready to be created.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token identifying a page of results the server should return.",
          },
        },
        description: "Response message for FetchLinkableRepositories.",
        additionalProperties: true,
      },
    },
  },
};

export default connectionsFetchLinkableRepositories;
