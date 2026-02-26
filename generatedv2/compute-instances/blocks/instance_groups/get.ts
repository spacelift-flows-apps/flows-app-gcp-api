import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Instance Groups - Get",
  description: `Returns the specified Zone resource.`,
  category: "Instance Groups",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of the zone where the instance group is located.",
          type: {
            type: "string",
          },
          required: true,
        },
        instance_group: {
          name: "Instance Group",
          description: "The name of the instance group.",
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
        if (input.event.inputConfig.instance_group !== undefined)
          pathParams["instance_group"] = String(
            input.event.inputConfig.instance_group,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instanceGroups/{instance_group}",
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
          creation_timestamp: {
            type: "string",
            description:
              "Output only. [Output Only] The creation timestamp for this instance group inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          fingerprint: {
            type: "string",
            description:
              "Output only. [Output Only] The fingerprint of the named ports. The system uses this fingerprint to detect conflicts when multiple users change the named ports concurrently.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] The resource type, which is alwayscompute#instanceGroup for instance groups.",
          },
          name: {
            type: "string",
            description:
              "The name of the instance group. The name must be 1-63 characters long, and comply withRFC1035.",
          },
          named_ports: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name for this named port. The name must be 1-63 characters long, and comply withRFC1035.",
                },
                port: {
                  type: "integer",
                  description:
                    "The port number, which can be a value between 1 and 65535.",
                },
              },
              description: 'The named port. For example: <"http", 80>.',
              additionalProperties: true,
            },
            description:
              'Optional. Assigns a name to a port number. For example:{name: "http", port: 80}  This allows the system to reference ports by the assigned name instead of a port number. Named ports can also contain multiple ports. For example:[{name: "app1", port: 8080}, {name: "app1", port: 8081}, {name: "app2", port: 8082}]  Named ports apply to all instances in this instance group.',
          },
          network: {
            type: "string",
            description:
              "[Output Only] The URL of the network to which all instances in the instance group belong. If your instance has multiple network interfaces, then the network and subnetwork fields only refer to the network and subnet used by your primary interface (nic0).",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of theregion where the instance group is located (for regional resources).",
          },
          self_link: {
            type: "string",
            description:
              "Output only. [Output Only] The URL for this instance group. The server generates this URL.",
          },
          size: {
            type: "integer",
            description:
              "Output only. [Output Only] The total number of instances in the instance group.",
          },
          subnetwork: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of the subnetwork to which all instances in the instance group belong. If your instance has multiple network interfaces, then the network and subnetwork fields only refer to the network and subnet used by your primary interface (nic0).",
          },
          zone: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of thezone where the instance group is located (for zonal resources).",
          },
        },
        description:
          "Represents an Instance Group resource.  Instance Groups can be used to configure a target forload balancing.  Instance groups can either be managed or unmanaged.  To create managed instance groups, use the instanceGroupManager orregionInstanceGroupManager resource instead.  Use zonal unmanaged instance groups if you need to applyload balancing to groups of heterogeneous instances or if you need to manage the instances yourself. You cannot create regional unmanaged instance groups.  For more information, readInstance groups.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
