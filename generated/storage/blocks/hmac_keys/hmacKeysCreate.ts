import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const hmacKeysCreate: AppBlock = {
  name: "HMAC Keys - Create",
  description: `Creates a new HMAC key for the specified service account.`,
  category: "HMAC Keys",
  inputs: {
    default: {
      config: {
        serviceAccountEmail: {
          name: "Service Account Email",
          description: "Email address of the service account.",
          type: {
            type: "string",
          },
          required: true,
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
              "https://www.googleapis.com/auth/devstorage.full_control",
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
          method: "POST",
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
          kind: {
            type: "string",
            description:
              "The kind of item this is. For HMAC keys, this is always storage#hmacKey.",
          },
          metadata: {
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
          secret: {
            type: "string",
            description: "HMAC secret key material.",
          },
        },
        description:
          "JSON template to produce a JSON-style HMAC Key resource for Create responses.",
        additionalProperties: true,
      },
    },
  },
};

export default hmacKeysCreate;
