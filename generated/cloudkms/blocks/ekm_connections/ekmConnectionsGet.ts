import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const ekmConnectionsGet: AppBlock = {
  name: "EKM Connections - Get",
  description: `Returns metadata for a given EkmConnection.`,
  category: "EKM Connections",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Required. The name of the EkmConnection to get.",
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
              "https://www.googleapis.com/auth/cloudkms",
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
        const baseUrl = "https://cloudkms.googleapis.com/";
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
          etag: {
            type: "string",
            description:
              "Optional. Etag of the currently stored EkmConnection.",
          },
          name: {
            type: "string",
            description:
              "Output only. The resource name for the EkmConnection in the format `projects/*/locations/*/ekmConnections/*`.",
          },
          cryptoSpacePath: {
            type: "string",
            description:
              "Optional. Identifies the EKM Crypto Space that this EkmConnection maps to. Note: This field is required if KeyManagementMode is CLOUD_KMS.",
          },
          serviceResolvers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                hostname: {
                  type: "string",
                  description:
                    "Required. The hostname of the EKM replica used at TLS and HTTP layers.",
                },
                endpointFilter: {
                  type: "string",
                  description:
                    "Optional. The filter applied to the endpoints of the resolved service. If no filter is specified, all endpoints will be considered. An endpoint will be chosen arbitrarily from the filtered list for each request. For endpoint filter syntax and examples, see https://cloud.google.com/service-directory/docs/reference/rpc/google.cloud.servicedirectory.v1#resolveservicerequest.",
                },
                serverCertificates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      issuer: {
                        type: "string",
                        description:
                          "Output only. The issuer distinguished name in RFC 2253 format. Only present if parsed is true.",
                      },
                      rawDer: {
                        type: "string",
                        description:
                          "Required. The raw certificate bytes in DER format. (Format: byte)",
                      },
                      notAfterTime: {
                        type: "string",
                        description:
                          "Output only. The certificate is not valid after this time. Only present if parsed is true. (Format: google-datetime)",
                      },
                      parsed: {
                        type: "boolean",
                        description:
                          "Output only. True if the certificate was parsed successfully.",
                      },
                      serialNumber: {
                        type: "string",
                        description:
                          "Output only. The certificate serial number as a hex string. Only present if parsed is true.",
                      },
                      notBeforeTime: {
                        type: "string",
                        description:
                          "Output only. The certificate is not valid before this time. Only present if parsed is true. (Format: google-datetime)",
                      },
                      sha256Fingerprint: {
                        type: "string",
                        description:
                          "Output only. The SHA-256 certificate fingerprint as a hex string. Only present if parsed is true.",
                      },
                      subject: {
                        type: "string",
                        description:
                          "Output only. The subject distinguished name in RFC 2253 format. Only present if parsed is true.",
                      },
                      subjectAlternativeDnsNames: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Output only. The subject Alternative DNS names. Only present if parsed is true.",
                      },
                    },
                    description:
                      "A Certificate represents an X.509 certificate used to authenticate HTTPS connections to EKM replicas.",
                    additionalProperties: true,
                  },
                  description:
                    "Required. A list of leaf server certificates used to authenticate HTTPS connections to the EKM replica. Currently, a maximum of 10 Certificate is supported.",
                },
                serviceDirectoryService: {
                  type: "string",
                  description:
                    "Required. The resource name of the Service Directory service pointing to an EKM replica, in the format `projects/*/locations/*/namespaces/*/services/*`.",
                },
              },
              description:
                "A ServiceResolver represents an EKM replica that can be reached within an EkmConnection.",
              additionalProperties: true,
            },
            description:
              "Optional. A list of ServiceResolvers where the EKM can be reached. There should be one ServiceResolver per EKM replica. Currently, only a single ServiceResolver is supported.",
          },
          createTime: {
            type: "string",
            description:
              "Output only. The time at which the EkmConnection was created. (Format: google-datetime)",
          },
          keyManagementMode: {
            type: "string",
            enum: ["KEY_MANAGEMENT_MODE_UNSPECIFIED", "MANUAL", "CLOUD_KMS"],
            description:
              "Optional. Describes who can perform control plane operations on the EKM. If unset, this defaults to MANUAL.",
          },
        },
        description:
          "An EkmConnection represents an individual EKM connection. It can be used for creating CryptoKeys and CryptoKeyVersions with a ProtectionLevel of EXTERNAL_VPC, as well as performing cryptographic operations using keys created within the EkmConnection.",
        additionalProperties: true,
      },
    },
  },
};

export default ekmConnectionsGet;
