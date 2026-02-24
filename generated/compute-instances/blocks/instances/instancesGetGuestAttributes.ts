import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesGetGuestAttributes: AppBlock = {
  name: "Instances - Get Guest Attributes",
  description: `Returns the specified guest attributes entry.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        instance: {
          name: "Instance",
          description: "Name of the instance scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        variableKey: {
          name: "Variable Key",
          description: "Specifies the key for the guest attributes entry.",
          type: {
            type: "string",
          },
          required: false,
        },
        queryPath: {
          name: "Query Path",
          description: "Specifies the guest attributes path to be queried.",
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
              "https://www.googleapis.com/auth/compute",
              "https://www.googleapis.com/auth/compute.readonly",
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/zones/{zone}/instances/{instance}/getGuestAttributes`;

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
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#guestAttributes for guest attributes entry.",
          },
          queryValue: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description: "Key for the guest attribute entry.",
                    },
                    namespace: {
                      type: "string",
                      description: "Namespace for the guest attribute entry.",
                    },
                    value: {
                      type: "string",
                      description: "Value for the guest attribute entry.",
                    },
                  },
                  description: "A guest attributes namespace/key/value entry.",
                  additionalProperties: true,
                },
              },
            },
            description: "Array of guest attribute namespace/key/value tuples.",
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          queryPath: {
            type: "string",
            description:
              "The path to be queried. This can be the default namespace ('') or a\nnested namespace ('\\/') or a specified key\n('\\/\\').",
          },
          variableValue: {
            type: "string",
            description: "[Output Only] The value found for the requested key.",
          },
          variableKey: {
            type: "string",
            description: "The key to search for.",
          },
        },
        description: "A guest attributes entry.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesGetGuestAttributes;
