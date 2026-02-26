import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Packet Mirrorings - Get",
  description: `Returns the specified Zone resource.`,
  category: "Packet Mirrorings",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        packetMirroring: {
          name: "Packet Mirroring",
          description: "Name of the PacketMirroring resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.packetMirroring !== undefined)
          pathParams["packet_mirroring"] = String(
            input.event.inputConfig.packetMirroring,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/packetMirrorings/{packet_mirroring}",
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
          collectorIlb: {
            type: "object",
            properties: {
              canonicalUrl: {
                type: "string",
                description:
                  "Output only. [Output Only] Unique identifier for the forwarding rule; defined by the server.",
              },
              url: {
                type: "string",
                description:
                  "Resource URL to the forwarding rule representing the ILB configured as destination of the mirrored traffic.",
              },
            },
            additionalProperties: true,
            description:
              "The Forwarding Rule resource of typeloadBalancingScheme=INTERNAL that will be used as collector for mirrored traffic. The specified forwarding rule must have isMirroringCollector set to true.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          enable: {
            type: "string",
            description:
              "Indicates whether or not this packet mirroring takes effect. If set to FALSE, this packet mirroring policy will not be enforced on the network.  The default is TRUE. Check the Enable enum for the list of possible values.",
          },
          filter: {
            type: "object",
            properties: {
              IPProtocols: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Protocols that apply as filter on mirrored traffic. If no protocols are specified, all traffic that matches the specified CIDR ranges is mirrored. If neither cidrRanges nor IPProtocols is specified, all IPv4 traffic is mirrored.",
              },
              cidrRanges: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'One or more IPv4 or IPv6 CIDR ranges that apply as filters on the source (ingress) or destination (egress) IP in the IP header. If no ranges are specified, all IPv4 traffic that matches the specified IPProtocols is mirrored. If neither cidrRanges nor IPProtocols is specified, all IPv4 traffic is mirrored. To mirror all IPv4 and IPv6 traffic, use "0.0.0.0/0,::/0".',
              },
              direction: {
                type: "string",
                description:
                  "Direction of traffic to mirror, either INGRESS, EGRESS, or BOTH. The default is BOTH. Check the Direction enum for the list of possible values.",
              },
            },
            additionalProperties: true,
            description:
              "Filter for mirrored traffic. If unspecified, all IPv4 traffic is mirrored.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#packetMirroring for packet mirrorings.",
          },
          mirroredResources: {
            type: "object",
            properties: {
              instances: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    canonicalUrl: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Unique identifier for the instance; defined by the server.",
                    },
                    url: {
                      type: "string",
                      description:
                        "Resource URL to the virtual machine instance which is being mirrored.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "A set of virtual machine instances that are being mirrored. They must live in zones contained in the same region as this packetMirroring.  Note that this config will apply only to those network interfaces of the Instances that belong to the network specified in this packetMirroring.  You may specify a maximum of 50 Instances.",
              },
              subnetworks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    canonicalUrl: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Unique identifier for the subnetwork; defined by the server.",
                    },
                    url: {
                      type: "string",
                      description:
                        "Resource URL to the subnetwork for which traffic from/to all VM instances will be mirrored.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "A set of subnetworks for which traffic from/to all VM instances will be mirrored. They must live in the same region as this packetMirroring.  You may specify a maximum of 5 subnetworks.",
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "A set of mirrored tags. Traffic from/to all VM instances that have one or more of these tags will be mirrored.",
              },
            },
            additionalProperties: true,
            description:
              "PacketMirroring mirroredResourceInfos. MirroredResourceInfo specifies a set of mirrored VM instances, subnetworks and/or tags for which traffic from/to all VM instances will be mirrored.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          network: {
            type: "object",
            properties: {
              canonicalUrl: {
                type: "string",
                description:
                  "Output only. [Output Only] Unique identifier for the network; defined by the server.",
              },
              url: {
                type: "string",
                description: "URL of the network resource.",
              },
            },
            additionalProperties: true,
            description:
              "Specifies the mirrored VPC network. Only packets in this network will be mirrored. All mirrored VMs should have a NIC in the given network. All mirrored subnetworks should belong to the given network.",
          },
          priority: {
            type: "integer",
            description:
              "The priority of applying this configuration. Priority is used to break ties in cases where there is more than one matching rule. In the case of two rules that apply for a given Instance, the one with the lowest-numbered priority value wins.  Default value is 1000. Valid range is 0 through 65535.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URI of the region where the packetMirroring resides.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
        },
        description:
          "Represents a Packet Mirroring resource.  Packet Mirroring clones the traffic of specified instances in your Virtual Private Cloud (VPC) network and forwards it to a collector destination, such as an instance group of an internal TCP/UDP load balancer, for analysis or examination. For more information about setting up Packet Mirroring, seeUsing Packet Mirroring.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
