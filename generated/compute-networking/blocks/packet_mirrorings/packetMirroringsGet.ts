import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const packetMirroringsGet: AppBlock = {
  name: "Packet Mirrorings - Get",
  description: `Returns the specified PacketMirroring resource.`,
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
              "https://www.googleapis.com/auth/compute",
              "https://www.googleapis.com/auth/compute.readonly",
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/regions/{region}/packetMirrorings/{packetMirroring}`;

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
          region: {
            type: "string",
            description:
              "[Output Only] URI of the region where the packetMirroring resides.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#packetMirroring for packet mirrorings.",
          },
          priority: {
            type: "integer",
            description:
              "The priority of applying this configuration. Priority is used to break ties\nin cases where there is more than one matching rule. In the case of two\nrules that apply for a given Instance, the one with the lowest-numbered\npriority value wins.\n\nDefault value is 1000. Valid range is 0 through 65535. (Format: uint32)",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          enable: {
            type: "string",
            enum: ["FALSE", "TRUE"],
            description:
              "Indicates whether or not this packet mirroring takes effect.\nIf set to FALSE, this packet mirroring policy will not be enforced on the\nnetwork.\n\nThe default is TRUE.",
          },
          filter: {
            type: "object",
            properties: {
              direction: {
                type: "string",
                enum: ["BOTH", "EGRESS", "INGRESS"],
                description:
                  "Direction of traffic to mirror, either INGRESS, EGRESS, or BOTH.\nThe default is BOTH.",
              },
              IPProtocols: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Protocols that apply as filter on mirrored traffic.\nIf no protocols are specified, all traffic that matches the specified\nCIDR ranges is mirrored.\nIf neither cidrRanges nor IPProtocols is specified, all IPv4 traffic is\nmirrored.",
              },
              cidrRanges: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'One or more IPv4 or IPv6 CIDR ranges that apply as filters on the source\n(ingress) or destination (egress) IP in the IP header. If no ranges are\nspecified, all IPv4 traffic that matches the specified IPProtocols is\nmirrored. If neither cidrRanges nor IPProtocols is specified, all IPv4\ntraffic is mirrored. To mirror all IPv4 and IPv6 traffic, use\n"0.0.0.0/0,::/0".',
              },
            },
            additionalProperties: true,
          },
          collectorIlb: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description:
                  "Resource URL to the forwarding rule representing the ILB\nconfigured as destination of the mirrored traffic.",
              },
              canonicalUrl: {
                type: "string",
                description:
                  "[Output Only] Unique identifier for the forwarding rule; defined by the\nserver.",
              },
            },
            additionalProperties: true,
          },
          mirroredResources: {
            type: "object",
            properties: {
              subnetworks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description:
                        "Resource URL to the subnetwork for which\ntraffic from/to all VM instances will be mirrored.",
                    },
                    canonicalUrl: {
                      type: "string",
                      description:
                        "[Output Only] Unique identifier for the subnetwork; defined by the\nserver.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "A set of subnetworks for which traffic from/to all VM instances will be\nmirrored. They must live in the same region as this packetMirroring.\n\nYou may specify a maximum of 5 subnetworks.",
              },
              instances: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    canonicalUrl: {
                      type: "string",
                      description:
                        "[Output Only] Unique identifier for the instance; defined by the\nserver.",
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
                  "A set of virtual machine instances that are being mirrored.\nThey must live in zones contained in the same region as this\npacketMirroring.\n\nNote that this config will apply only to those network interfaces of the\nInstances that belong to the network specified in this packetMirroring.\n\nYou may specify a maximum of 50 Instances.",
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "A set of mirrored tags. Traffic from/to all VM instances that have one or\nmore of these tags will be mirrored.",
              },
            },
            additionalProperties: true,
          },
          network: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "URL of the network resource.",
              },
              canonicalUrl: {
                type: "string",
                description:
                  "[Output Only] Unique identifier for the network; defined by the server.",
              },
            },
            additionalProperties: true,
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
        },
        description:
          "Represents a Packet Mirroring resource.\n\nPacket Mirroring clones the traffic of specified instances in your Virtual\nPrivate Cloud (VPC) network and forwards it to a collector destination,\nsuch as an instance group of an internal TCP/UDP load balancer, for analysis\nor examination.\nFor more information about setting up Packet Mirroring, seeUsing Packet Mirroring.",
        additionalProperties: true,
      },
    },
  },
};

export default packetMirroringsGet;
