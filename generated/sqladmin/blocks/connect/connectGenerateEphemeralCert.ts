import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const connectGenerateEphemeralCert: AppBlock = {
  name: "Connect - Generate Ephemeral Cert",
  description: `Generates a short-lived X509 certificate containing the provided public key and signed by a private key specific to the target instance.`,
  category: "Connect",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Cloud SQL instance ID. This does not include the project ID.",
          type: {
            type: "string",
          },
          required: true,
        },
        public_key: {
          name: "Public_key",
          description:
            "PEM encoded public key to include in the signed certificate.",
          type: {
            type: "string",
            description:
              "PEM encoded public key to include in the signed certificate.",
          },
          required: false,
        },
        access_token: {
          name: "Access_token",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Access token to include in the signed certificate.",
          },
          required: false,
        },
        readTime: {
          name: "Read Time",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Optional snapshot read timestamp to trade freshness for performance. (Format: google-datetime)",
          },
          required: false,
        },
        validDuration: {
          name: "Valid Duration",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. If set, it will contain the cert valid duration. (Format: google-duration)",
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
        let path = `v1/projects/{project}/instances/{instance}:generateEphemeralCert`;

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

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.public_key !== undefined)
          requestBody.public_key = input.event.inputConfig.public_key;
        if (input.event.inputConfig.access_token !== undefined)
          requestBody.access_token = input.event.inputConfig.access_token;
        if (input.event.inputConfig.readTime !== undefined)
          requestBody.readTime = input.event.inputConfig.readTime;
        if (input.event.inputConfig.validDuration !== undefined)
          requestBody.validDuration = input.event.inputConfig.validDuration;

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
          ephemeralCert: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description: "This is always `sql#sslCert`.",
              },
              certSerialNumber: {
                type: "string",
                description:
                  "Serial number, as extracted from the certificate.",
              },
              cert: {
                type: "string",
                description: "PEM representation.",
              },
              createTime: {
                type: "string",
                description:
                  "The time when the certificate was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z` (Format: google-datetime)",
              },
              commonName: {
                type: "string",
                description:
                  "User supplied name. Constrained to [a-zA-Z.-_ ]+.",
              },
              expirationTime: {
                type: "string",
                description:
                  "The time when the certificate expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
              },
              sha1Fingerprint: {
                type: "string",
                description: "Sha1 Fingerprint.",
              },
              instance: {
                type: "string",
                description: "Name of the database instance.",
              },
              selfLink: {
                type: "string",
                description: "The URI of this resource.",
              },
            },
            description: "SslCerts Resource",
            additionalProperties: true,
          },
        },
        description: "Ephemeral certificate creation request.",
        additionalProperties: true,
      },
    },
  },
};

export default connectGenerateEphemeralCert;
