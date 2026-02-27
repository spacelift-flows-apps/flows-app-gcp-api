import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const versionsList: AppBlock = {
  name: "Versions - List",
  description: `Lists SecretVersions.`,
  category: "Versions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the Secret associated with the SecretVersions to list, in the format `projects/*/secrets/*` or `projects/*/locations/*/secrets/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. Pagination token, returned earlier via ListSecretVersionsResponse.next_page_token][].",
          type: {
            type: "string",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Filter string, adhering to the rules in [List-operation filtering](https://cloud.google.com/secret-manager/docs/filtering). List only secret versions matching the filter. If filter is empty, all secret versions are listed.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of results to be returned in a single page. If set to 0, the server decides the number of results to return. If the number is greater than 25000, it is capped at 25000.",
          type: {
            type: "integer",
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
        let path = `v1/{+parent}/versions`;

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
          nextPageToken: {
            type: "string",
            description:
              "A token to retrieve the next page of results. Pass this value in ListSecretVersionsRequest.page_token to retrieve the next page.",
          },
          versions: {
            type: "array",
            items: {
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
                  enum: [
                    "STATE_UNSPECIFIED",
                    "ENABLED",
                    "DISABLED",
                    "DESTROYED",
                  ],
                  description:
                    "Output only. The current state of the SecretVersion.",
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
                  description:
                    "Describes the status of customer-managed encryption.",
                  additionalProperties: true,
                },
              },
              description:
                "A secret version resource in the Secret Manager API.",
              additionalProperties: true,
            },
            description:
              "The list of SecretVersions sorted in reverse by create_time (newest first).",
          },
          totalSize: {
            type: "integer",
            description:
              "The total number of SecretVersions but 0 when the ListSecretsRequest.filter field is set. (Format: int32)",
          },
        },
        description:
          "Response message for SecretManagerService.ListSecretVersions.",
        additionalProperties: true,
      },
    },
  },
};

export default versionsList;
