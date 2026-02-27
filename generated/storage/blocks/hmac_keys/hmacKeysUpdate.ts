import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const hmacKeysUpdate: AppBlock = {
  name: "HMAC Keys - Update",
  description: `Updates the state of an HMAC key.`,
  category: "HMAC Keys",
  inputs: {
    default: {
      config: {
        accessId: {
          name: "Access ID",
          description: "The ID of the HMAC Key.",
          type: {
            type: "string",
            description: "The ID of the HMAC Key.",
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
        etag: {
          name: "Etag",
          description: "HTTP 1.",
          type: {
            type: "string",
            description: "HTTP 1.1 Entity tag for the HMAC key.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "The ID of the HMAC key, including the Project ID and the Access ID.",
          type: {
            type: "string",
            description:
              "The ID of the HMAC key, including the Project ID and the Access ID.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "The kind of item this is.",
          type: {
            type: "string",
            description:
              "The kind of item this is. For HMAC Key metadata, this is always storage#hmacKeyMetadata.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "The link to this resource.",
          type: {
            type: "string",
            description: "The link to this resource.",
          },
          required: false,
        },
        serviceAccountEmail: {
          name: "Service Account Email",
          description:
            "The email address of the key's associated service account.",
          type: {
            type: "string",
            description:
              "The email address of the key's associated service account.",
          },
          required: false,
        },
        state: {
          name: "State",
          description: "The state of the key.",
          type: {
            type: "string",
            description:
              "The state of the key. Can be one of ACTIVE, INACTIVE, or DELETED.",
          },
          required: false,
        },
        timeCreated: {
          name: "Time Created",
          description: "The creation time of the HMAC key in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The creation time of the HMAC key in RFC 3339 format. (Format: date-time)",
          },
          required: false,
        },
        updated: {
          name: "Updated",
          description:
            "The last modification time of the HMAC key metadata in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The last modification time of the HMAC key metadata in RFC 3339 format. (Format: date-time)",
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
        let path = `projects/{projectId}/hmacKeys/{accessId}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};
        requestBody.projectId = input.app.config.projectId;
        if (input.event.inputConfig.accessId !== undefined)
          requestBody.accessId = input.event.inputConfig.accessId;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.serviceAccountEmail !== undefined)
          requestBody.serviceAccountEmail =
            input.event.inputConfig.serviceAccountEmail;
        if (input.event.inputConfig.state !== undefined)
          requestBody.state = input.event.inputConfig.state;
        if (input.event.inputConfig.timeCreated !== undefined)
          requestBody.timeCreated = input.event.inputConfig.timeCreated;
        if (input.event.inputConfig.updated !== undefined)
          requestBody.updated = input.event.inputConfig.updated;

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
    },
  },
};

export default hmacKeysUpdate;
