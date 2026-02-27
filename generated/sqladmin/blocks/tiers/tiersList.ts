import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const tiersList: AppBlock = {
  name: "Tiers - List",
  description: `Lists all available machine types (tiers) for Cloud SQL, for example, 'db-custom-1-3840'.`,
  category: "Tiers",
  inputs: {
    default: {
      config: {},
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
              "https://www.googleapis.com/auth/sqlservice.admin",
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
        const baseUrl = "https://sqladmin.googleapis.com/";
        let path = `v1/projects/{project}/tiers`;

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
          kind: {
            type: "string",
            description: "This is always `sql#tiersList`.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tier: {
                  type: "string",
                  description:
                    "An identifier for the machine type, for example, `db-custom-1-3840`. For related information, see [Pricing](/sql/pricing).",
                },
                RAM: {
                  type: "string",
                  description:
                    "The maximum RAM usage of this tier in bytes. (Format: int64)",
                },
                kind: {
                  type: "string",
                  description: "This is always `sql#tier`.",
                },
                DiskQuota: {
                  type: "string",
                  description:
                    "The maximum disk size of this tier in bytes. (Format: int64)",
                },
                region: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "The applicable regions for this tier.",
                },
              },
              description: "A Google Cloud SQL service tier resource.",
              additionalProperties: true,
            },
            description: "List of tiers.",
          },
        },
        description: "Tiers list response.",
        additionalProperties: true,
      },
    },
  },
};

export default tiersList;
