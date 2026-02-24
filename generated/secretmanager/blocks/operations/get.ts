import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const get: AppBlock = {
  name: "Operations - Get",
  description: `Gets information about a location.`,
  category: "Operations",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Resource name for the location.",
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
        const baseUrl = "https://secretmanager.googleapis.com/";
        let path = `v1/{+name}`;

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
          displayName: {
            type: "string",
            description:
              'The friendly name for this location, typically a nearby city name. For example, "Tokyo".',
          },
          metadata: {
            type: "object",
            additionalProperties: true,
            description:
              "Service-specific metadata. For example the available capacity at the given location.",
          },
          locationId: {
            type: "string",
            description:
              'The canonical id for this location. For example: `"us-east1"`.',
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              'Cross-service attributes for the location. For example {"cloud.googleapis.com/region": "us-east1"}',
          },
          name: {
            type: "string",
            description:
              'Resource name for the location, which may vary between implementations. For example: `"projects/example-project/locations/us-east1"`',
          },
        },
        description: "A resource that represents a Google Cloud location.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
