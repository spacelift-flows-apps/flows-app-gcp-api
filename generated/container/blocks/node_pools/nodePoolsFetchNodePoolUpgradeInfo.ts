import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const nodePoolsFetchNodePoolUpgradeInfo: AppBlock = {
  name: "Node Pools - Fetch Node Pool Upgrade Info",
  description: `Fetch upgrade information of a specific nodepool.`,
  category: "Node Pools",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name (project, location, cluster, nodepool) of the nodepool to get. Specified in the format `projects/*/locations/*/clusters/*/nodePools/*` or `projects/*/zones/*/clusters/*/nodePools/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        version: {
          name: "Version",
          description: "API request version that initiates this operation.",
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
        const baseUrl = "https://container.googleapis.com/";
        let path = `v1/{+name}:fetchNodePoolUpgradeInfo`;

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
          endOfStandardSupportTimestamp: {
            type: "string",
            description:
              "The nodepool's current minor version's end of standard support timestamp.",
          },
          patchTargetVersion: {
            type: "string",
            description:
              "patch_target_version indicates the target version for patch upgrade.",
          },
          pausedReason: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "AUTO_UPGRADE_PAUSED_REASON_UNSPECIFIED",
                "MAINTENANCE_WINDOW",
                "MAINTENANCE_EXCLUSION_NO_UPGRADES",
                "MAINTENANCE_EXCLUSION_NO_MINOR_UPGRADES",
                "SYSTEM_CONFIG",
              ],
            },
            description: "The auto upgrade paused reason.",
          },
          endOfExtendedSupportTimestamp: {
            type: "string",
            description:
              "The nodepool's current minor version's end of extended support timestamp.",
          },
          upgradeDetails: {
            type: "array",
            items: {
              type: "object",
              properties: {
                targetVersion: {
                  type: "string",
                  description: "The version after the upgrade.",
                },
                initialVersion: {
                  type: "string",
                  description: "The version before the upgrade.",
                },
                startTime: {
                  type: "string",
                  description:
                    "The start timestamp of the upgrade. (Format: google-datetime)",
                },
                endTime: {
                  type: "string",
                  description:
                    "The end timestamp of the upgrade. (Format: google-datetime)",
                },
                state: {
                  type: "string",
                  enum: [
                    "UNKNOWN",
                    "FAILED",
                    "SUCCEEDED",
                    "CANCELED",
                    "RUNNING",
                  ],
                  description: "Output only. The state of the upgrade.",
                },
                startType: {
                  type: "string",
                  enum: ["START_TYPE_UNSPECIFIED", "AUTOMATIC", "MANUAL"],
                  description: "The start type of the upgrade.",
                },
              },
              description:
                "UpgradeDetails contains detailed information of each individual upgrade operation.",
              additionalProperties: true,
            },
            description: "The list of past auto upgrades.",
          },
          minorTargetVersion: {
            type: "string",
            description:
              "minor_target_version indicates the target version for minor upgrade.",
          },
          autoUpgradeStatus: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "UNKNOWN",
                "ACTIVE",
                "MINOR_UPGRADE_PAUSED",
                "UPGRADE_PAUSED",
              ],
            },
            description: "The auto upgrade status.",
          },
        },
        description:
          "NodePoolUpgradeInfo contains the upgrade information of a nodepool.",
        additionalProperties: true,
      },
    },
  },
};

export default nodePoolsFetchNodePoolUpgradeInfo;
