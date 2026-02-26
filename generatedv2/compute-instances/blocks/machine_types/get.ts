import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Machine Types - Get",
  description: `Returns the specified Zone resource.`,
  category: "Machine Types",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        machine_type: {
          name: "Machine Type",
          description: "Name of the machine type to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.machine_type !== undefined)
          pathParams["machine_type"] = String(
            input.event.inputConfig.machine_type,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/machineTypes/{machine_type}",
          pathParams,
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
          accelerators: {
            type: "array",
            items: {
              type: "object",
              properties: {
                guest_accelerator_count: {
                  type: "integer",
                  description:
                    "Number of accelerator cards exposed to the guest.",
                },
                guest_accelerator_type: {
                  type: "string",
                  description:
                    "The accelerator type resource name, not a full URL, e.g.nvidia-tesla-t4.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] A list of accelerator configurations assigned to this machine type.",
          },
          architecture: {
            type: "string",
            description:
              "[Output Only] The architecture of the machine type. Check the Architecture enum for the list of possible values.",
          },
          creation_timestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339 text format.",
          },
          deprecated: {
            type: "object",
            properties: {
              deleted: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this resource is intended to change to DELETED. This is only informational and the status will not change unless the client explicitly changes it.",
              },
              deprecated: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this resource is intended to change to DEPRECATED. This is only informational and the status will not change unless the client explicitly changes it.",
              },
              obsolete: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this resource is intended to change to OBSOLETE. This is only informational and the status will not change unless the client explicitly changes it.",
              },
              replacement: {
                type: "string",
                description:
                  "The URL of the suggested replacement for a deprecated resource. The suggested replacement resource must be the same kind of resource as the deprecated resource.",
              },
              state: {
                type: "string",
                description:
                  "The deprecation state of this resource. This can be ACTIVE,DEPRECATED, OBSOLETE, or DELETED. Operations which communicate the end of life date for an image, can useACTIVE. Operations which create a new resource using aDEPRECATED resource will return successfully, but with a warning indicating the deprecated resource and recommending its replacement. Operations which use OBSOLETE orDELETED resources will be rejected and result in an error. Check the State enum for the list of possible values.",
              },
            },
            description: "Deprecation status for a public resource.",
            additionalProperties: true,
          },
          description: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the resource.",
          },
          guest_cpus: {
            type: "integer",
            description:
              "[Output Only] The number of virtual CPUs that are available to the instance.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          image_space_gb: {
            type: "integer",
            description:
              "[Deprecated] This property is deprecated and will never be populated with any relevant values.",
          },
          is_shared_cpu: {
            type: "boolean",
            description:
              "[Output Only] Whether this machine type has a shared CPU. SeeShared-core machine types for more information.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] The type of the resource. Alwayscompute#machineType for machine types.",
          },
          maximum_persistent_disks: {
            type: "integer",
            description: "[Output Only] Maximum persistent disks allowed.",
          },
          maximum_persistent_disks_size_gb: {
            type: "string",
            description: "64-bit integer as string",
          },
          memory_mb: {
            type: "integer",
            description:
              "[Output Only] The amount of physical memory available to the instance, defined in MB.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the resource.",
          },
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The name of the zone where the machine type resides, such as us-central1-a.",
          },
        },
        description:
          "Represents a Machine Type resource.  You can use specific machine types for your VM instances based on performance and pricing requirements. For more information, readMachine Types.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
