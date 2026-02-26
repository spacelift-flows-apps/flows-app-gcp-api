import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  projectId: "project_id",
};

const outputMapping = {
  default_cluster_version: "defaultClusterVersion",
  valid_node_versions: "validNodeVersions",
  default_image_type: "defaultImageType",
  valid_image_types: "validImageTypes",
  valid_master_versions: "validMasterVersions",
  channels: {
    name: "channels",
    fields: {
      default_version: "defaultVersion",
      valid_versions: "validVersions",
      upgrade_target_version: "upgradeTargetVersion",
    },
  },
};

const getServerConfig: AppBlock = {
  name: "Get Server Config",
  description: `Returns configuration info about the Google Kubernetes Engine service.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        projectId: {
          name: "Project Id",
          description:
            "Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        zone: {
          name: "Zone",
          description:
            "Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) to return operations for. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) to return operations for. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name (project and location) of the server config to get, specified in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "The name (project and location) of the server config to get, specified in the format `projects/*/locations/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.getServerConfig(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          defaultClusterVersion: {
            type: "string",
            description:
              "Version of Kubernetes the service deploys by default.",
          },
          validNodeVersions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of valid node upgrade target versions, in descending order.",
          },
          defaultImageType: {
            type: "string",
            description: "Default image type.",
          },
          validImageTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of valid image types.",
          },
          validMasterVersions: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of valid master versions, in descending order.",
          },
          channels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                channel: {
                  type: "string",
                  enum: [
                    "UNSPECIFIED",
                    "RAPID",
                    "REGULAR",
                    "STABLE",
                    "EXTENDED",
                  ],
                  description:
                    "The release channel this configuration applies to.",
                },
                defaultVersion: {
                  type: "string",
                  description:
                    "The default version for newly created clusters on the channel.",
                },
                validVersions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of valid versions for the channel.",
                },
                upgradeTargetVersion: {
                  type: "string",
                  description:
                    "The auto upgrade target version for clusters on the channel.",
                },
              },
              description:
                "ReleaseChannelConfig exposes configuration for a release channel.",
              additionalProperties: true,
            },
            description: "List of release channel configurations.",
          },
        },
        description: "Kubernetes Engine service configuration.",
        additionalProperties: true,
      },
    },
  },
};

export default getServerConfig;
