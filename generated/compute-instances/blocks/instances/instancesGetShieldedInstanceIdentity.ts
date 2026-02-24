import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesGetShieldedInstanceIdentity: AppBlock = {
  name: "Instances - Get Shielded Instance Identity",
  description: `Returns the Shielded Instance Identity of an instance`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description: "Name or id of the instance scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
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
        let path = `projects/{project}/zones/{zone}/instances/{instance}/getShieldedInstanceIdentity`;

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
          eccP256EncryptionKey: {
            type: "object",
            properties: {
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#shieldedInstanceIdentity for shielded Instance\nidentity entry.",
          },
          eccP256SigningKey: {
            type: "object",
            properties: {
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
          encryptionKey: {
            type: "object",
            properties: {
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
          signingKey: {
            type: "object",
            properties: {
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
        },
        description: "A Shielded Instance Identity.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesGetShieldedInstanceIdentity;
