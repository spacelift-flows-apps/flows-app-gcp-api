import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesListServerCertificates: AppBlock = {
  name: "Instances - List Server Certificates",
  description: `Lists all versions of server certificates and certificate authorities (CAs) for the specified instance.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Required. Cloud SQL instance ID. This does not include the project ID.",
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
        let path = `v1/projects/{project}/instances/{instance}/listServerCertificates`;

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
          caCerts: {
            type: "array",
            items: {
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
            description: "List of server CA certificates for the instance.",
          },
          serverCerts: {
            type: "array",
            items: {
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
            description:
              "List of server certificates for the instance, signed by the corresponding CA from the `ca_certs` list.",
          },
          activeVersion: {
            type: "string",
            description:
              "The `sha1_fingerprint` of the active certificate from `server_certs`.",
          },
          kind: {
            type: "string",
            description:
              "This is always `sql#instancesListServerCertificates`.",
          },
        },
        description: "Instances ListServerCertificates response.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesListServerCertificates;
