import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const versionsEnable: AppBlock = {
  name: "Versions - Enable",
  description: `Enables a SecretVersion.`,
  category: "Versions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the SecretVersion to enable in the format `projects/*/secrets/*/versions/*` or `projects/*/locations/*/secrets/*/versions/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        etag: {
          name: "Etag",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Etag of the SecretVersion. The request succeeds if it matches the etag of the currently stored secret version object. If the etag is omitted, the request succeeds.",
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
        const baseUrl = "https://secretmanager.googleapis.com/";
        let path = `v1/{+name}:enable`;

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

        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;

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
          scheduledDestroyTime: {
            type: "string",
            description:
              "Optional. Output only. Scheduled destroy time for secret version. This is a part of the Delayed secret version destroy feature. For a Secret with a valid version destroy TTL, when a secert version is destroyed, version is moved to disabled state and it is scheduled for destruction Version is destroyed only after the scheduled_destroy_time. (Format: google-datetime)",
          },
          etag: {
            type: "string",
            description:
              "Output only. Etag of the currently stored SecretVersion.",
          },
          destroyTime: {
            type: "string",
            description:
              "Output only. The time this SecretVersion was destroyed. Only present if state is DESTROYED. (Format: google-datetime)",
          },
          name: {
            type: "string",
            description:
              "Output only. The resource name of the SecretVersion in the format `projects/*/secrets/*/versions/*`. SecretVersion IDs in a Secret start at 1 and are incremented for each subsequent version of the secret.",
          },
          createTime: {
            type: "string",
            description:
              "Output only. The time at which the SecretVersion was created. (Format: google-datetime)",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "ENABLED", "DISABLED", "DESTROYED"],
            description: "Output only. The current state of the SecretVersion.",
          },
          replicationStatus: {
            type: "object",
            properties: {
              userManaged: {
                type: "object",
                properties: {
                  replicas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        location: {
                          type: "string",
                          description:
                            'Output only. The canonical ID of the replica location. For example: `"us-east1"`.',
                        },
                        customerManagedEncryption: {
                          type: "object",
                          properties: {
                            kmsKeyVersionName: {
                              type: "string",
                              description:
                                "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                            },
                          },
                          description:
                            "Describes the status of customer-managed encryption.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "Describes the status of a user-managed replica for the SecretVersion.",
                      additionalProperties: true,
                    },
                    description:
                      "Output only. The list of replica statuses for the SecretVersion.",
                  },
                },
                description:
                  "The replication status of a SecretVersion using user-managed replication. Only populated if the parent Secret has a user-managed replication policy.",
                additionalProperties: true,
              },
              automatic: {
                type: "object",
                properties: {
                  customerManagedEncryption: {
                    type: "object",
                    properties: {
                      kmsKeyVersionName: {
                        type: "string",
                        description:
                          "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
                      },
                    },
                    description:
                      "Describes the status of customer-managed encryption.",
                    additionalProperties: true,
                  },
                },
                description:
                  "The replication status of a SecretVersion using automatic replication. Only populated if the parent Secret has an automatic replication policy.",
                additionalProperties: true,
              },
            },
            description: "The replication status of a SecretVersion.",
            additionalProperties: true,
          },
          clientSpecifiedPayloadChecksum: {
            type: "boolean",
            description:
              "Output only. True if payload checksum specified in SecretPayload object has been received by SecretManagerService on SecretManagerService.AddSecretVersion.",
          },
          customerManagedEncryption: {
            type: "object",
            properties: {
              kmsKeyVersionName: {
                type: "string",
                description:
                  "Required. The resource name of the Cloud KMS CryptoKeyVersion used to encrypt the secret payload, in the following format: `projects/*/locations/*/keyRings/*/cryptoKeys/*/versions/*`.",
              },
            },
            description: "Describes the status of customer-managed encryption.",
            additionalProperties: true,
          },
        },
        description: "A secret version resource in the Secret Manager API.",
        additionalProperties: true,
      },
    },
  },
};

export default versionsEnable;
