import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const getServerConfig: AppBlock = {
  name: "Get Server Config",
  description: `Returns configuration info about the Google Kubernetes Engine service.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        project_id: {
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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.project_id !== undefined)
          request.project_id = input.event.inputConfig.project_id;
        if (input.event.inputConfig.zone !== undefined)
          request.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

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
          default_cluster_version: {
            type: "string",
            description:
              "Version of Kubernetes the service deploys by default.",
          },
          valid_node_versions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of valid node upgrade target versions, in descending order.",
          },
          default_image_type: {
            type: "string",
            description: "Default image type.",
          },
          valid_image_types: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of valid image types.",
          },
          valid_master_versions: {
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
                default_version: {
                  type: "string",
                  description:
                    "The default version for newly created clusters on the channel.",
                },
                valid_versions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of valid versions for the channel.",
                },
                upgrade_target_version: {
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
