import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const hmacKeysList: AppBlock = {
  name: "HMAC Keys - List",
  description: `Retrieves a list of HMAC keys matching the criteria.`,
  category: "HMAC Keys",
  inputs: {
    default: {
      config: {
        maxResults: {
          name: "Max Results",
          description:
            "Maximum number of items to return in a single page of responses. The service uses this parameter or 250 items, whichever is smaller. The max number of items per page will also be limited by the number of distinct service accounts in the response. If the number of service accounts in a single response is too high, the page will truncated and a next page token will be returned.",
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
        serviceAccountEmail: {
          name: "Service Account Email",
          description:
            "If present, only keys for the given service account are returned.",
          type: {
            type: "string",
          },
          required: false,
        },
        showDeletedKeys: {
          name: "Show Deleted Keys",
          description: "Whether or not to show keys in the DELETED state.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        userProject: {
          name: "User Project",
          description: "The project to be billed for this request.",
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
        let path = `projects/{projectId}/hmacKeys`;

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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                accessId: {
                  type: "string",
                  description: "The ID of the HMAC Key.",
                },
                etag: {
                  type: "string",
                  description: "HTTP 1.1 Entity tag for the HMAC key.",
                },
                id: {
                  type: "string",
                  description:
                    "The ID of the HMAC key, including the Project ID and the Access ID.",
                },
                kind: {
                  type: "string",
                  description:
                    "The kind of item this is. For HMAC Key metadata, this is always storage#hmacKeyMetadata.",
                },
                projectId: {
                  type: "string",
                  description:
                    "Project ID owning the service account to which the key authenticates.",
                },
                selfLink: {
                  type: "string",
                  description: "The link to this resource.",
                },
                serviceAccountEmail: {
                  type: "string",
                  description:
                    "The email address of the key's associated service account.",
                },
                state: {
                  type: "string",
                  description:
                    "The state of the key. Can be one of ACTIVE, INACTIVE, or DELETED.",
                },
                timeCreated: {
                  type: "string",
                  description:
                    "The creation time of the HMAC key in RFC 3339 format. (Format: date-time)",
                },
                updated: {
                  type: "string",
                  description:
                    "The last modification time of the HMAC key metadata in RFC 3339 format. (Format: date-time)",
                },
              },
              description:
                "JSON template to produce a JSON-style HMAC Key metadata resource.",
              additionalProperties: true,
            },
            description: "The list of items.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For lists of hmacKeys, this is always storage#hmacKeysMetadata.",
          },
          nextPageToken: {
            type: "string",
            description:
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
        },
        description: "A list of hmacKeys.",
        additionalProperties: true,
      },
    },
  },
};

export default hmacKeysList;
