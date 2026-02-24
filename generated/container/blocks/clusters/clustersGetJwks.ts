import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const clustersGetJwks: AppBlock = {
  name: "Clusters - Get JWKS",
  description: `Gets the public component of the cluster signing keys in JSON Web Key format.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The cluster (project, location, cluster name) to get keys for. Specified in the format `projects/*/locations/*/clusters/*`.",
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
        const baseUrl = "https://container.googleapis.com/";
        let path = `v1/{+parent}/jwks`;

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
          cacheHeader: {
            type: "object",
            properties: {
              expires: {
                type: "string",
                description:
                  "14.21 response cache expires, in RFC 1123 date format",
              },
              directive: {
                type: "string",
                description: "14.9 request and response directives",
              },
              age: {
                type: "string",
                description:
                  "14.6 response cache age, in seconds since the response is generated (Format: int64)",
              },
            },
            description: "RFC-2616: cache control support",
            additionalProperties: true,
          },
          keys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                crv: {
                  type: "string",
                  description: "Used for ECDSA keys.",
                },
                y: {
                  type: "string",
                  description: "Used for ECDSA keys.",
                },
                e: {
                  type: "string",
                  description: "Used for RSA keys.",
                },
                kty: {
                  type: "string",
                  description: "Key Type.",
                },
                alg: {
                  type: "string",
                  description: "Algorithm.",
                },
                n: {
                  type: "string",
                  description: "Used for RSA keys.",
                },
                kid: {
                  type: "string",
                  description: "Key ID.",
                },
                use: {
                  type: "string",
                  description: "Permitted uses for the public keys.",
                },
                x: {
                  type: "string",
                  description: "Used for ECDSA keys.",
                },
              },
              description: "Jwk is a JSON Web Key as specified in RFC 7517",
              additionalProperties: true,
            },
            description:
              "The public component of the keys used by the cluster to sign token requests.",
          },
        },
        description:
          "GetJSONWebKeysResponse is a valid JSON Web Key Set as specified in rfc 7517",
        additionalProperties: true,
      },
    },
  },
};

export default clustersGetJwks;
