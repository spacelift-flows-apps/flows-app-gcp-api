import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const list: AppBlock = {
  name: "Operations - List",
  description: `Lists information about the supported locations for this service.`,
  category: "Operations",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The resource that owns the locations collection, if applicable.",
          type: {
            type: "string",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'A filter to narrow down results to a preferred subset. The filtering language accepts strings like `"displayName=tokyo"`, and is documented in more detail in [AIP-160](https://google.aip.dev/160).',
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "The maximum number of results to return. If not set, the service selects a default.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page.",
          type: {
            type: "string",
          },
          required: false,
        },
        extraLocationTypes: {
          name: "Extra Location Types",
          description:
            "Optional. Do not use this field. It is unsupported and is ignored unless explicitly documented otherwise. This is primarily for internal usage.",
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
        const baseUrl = "https://cloudfunctions.googleapis.com/";
        let path = `v2/{+name}/locations`;

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
          locations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    'Resource name for the location, which may vary between implementations. For example: `"projects/example-project/locations/us-east1"`',
                },
                locationId: {
                  type: "string",
                  description:
                    'The canonical id for this location. For example: `"us-east1"`.',
                },
                displayName: {
                  type: "string",
                  description:
                    'The friendly name for this location, typically a nearby city name. For example, "Tokyo".',
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    'Cross-service attributes for the location. For example {"cloud.googleapis.com/region": "us-east1"}',
                },
                metadata: {
                  type: "object",
                  additionalProperties: true,
                  description:
                    "Service-specific metadata. For example the available capacity at the given location.",
                },
              },
              description:
                "A resource that represents a Google Cloud location.",
              additionalProperties: true,
            },
            description:
              "A list of locations that matches the specified filter in the request.",
          },
          nextPageToken: {
            type: "string",
            description: "The standard List next-page token.",
          },
        },
        description: "The response message for Locations.ListLocations.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
