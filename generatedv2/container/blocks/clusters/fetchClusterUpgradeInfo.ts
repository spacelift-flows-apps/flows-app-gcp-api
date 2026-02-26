import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const fetchClusterUpgradeInfo: AppBlock = {
  name: "Fetch Cluster Upgrade Info",
  description: `Fetch upgrade information of a specific cluster.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name (project, location, cluster) of the cluster to get. Specified in the format `projects/*/locations/*/clusters/*` or `projects/*/zones/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "Required. The name (project, location, cluster) of the cluster to get. Specified in the format `projects/*/locations/*/clusters/*` or `projects/*/zones/*/clusters/*`.",
          },
          required: true,
        },
        version: {
          name: "Version",
          description: "API request version that initiates this operation.",
          type: {
            type: "string",
            description: "API request version that initiates this operation.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.version !== undefined)
          request.version = input.event.inputConfig.version;

        const result = await new Promise<any>((resolve, reject) => {
          client.fetchClusterUpgradeInfo(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

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
          minor_target_version: {
            type: "string",
            description:
              "minor_target_version indicates the target version for minor upgrade.",
          },
          patch_target_version: {
            type: "string",
            description:
              "patch_target_version indicates the target version for patch upgrade.",
          },
          auto_upgrade_status: {
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
          paused_reason: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "AUTO_UPGRADE_PAUSED_REASON_UNSPECIFIED",
                "MAINTENANCE_WINDOW",
                "MAINTENANCE_EXCLUSION_NO_UPGRADES",
                "MAINTENANCE_EXCLUSION_NO_MINOR_UPGRADES",
                "CLUSTER_DISRUPTION_BUDGET",
                "CLUSTER_DISRUPTION_BUDGET_MINOR_UPGRADE",
                "SYSTEM_CONFIG",
              ],
            },
            description: "The auto upgrade paused reason.",
          },
          upgrade_details: {
            type: "array",
            items: {
              type: "object",
              properties: {
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
                start_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                end_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                initial_version: {
                  type: "string",
                  description: "The version before the upgrade.",
                },
                target_version: {
                  type: "string",
                  description: "The version after the upgrade.",
                },
                start_type: {
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
          end_of_standard_support_timestamp: {
            type: "string",
            description:
              "The cluster's current minor version's end of standard support timestamp.",
          },
          end_of_extended_support_timestamp: {
            type: "string",
            description:
              "The cluster's current minor version's end of extended support timestamp.",
          },
        },
        description:
          "ClusterUpgradeInfo contains the upgrade information of a cluster.",
        additionalProperties: true,
      },
    },
  },
};

export default fetchClusterUpgradeInfo;
