import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instanceGroupsGet: AppBlock = {
  name: "Instance Groups - Get",
  description: `Returns the specified zonal instance group.`,
  category: "Instance Groups",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of the zone\nwhere the instance group is located.",
          type: {
            type: "string",
          },
          required: true,
        },
        instanceGroup: {
          name: "Instance Group",
          description: "The name of the instance group.",
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
        let path = `projects/{project}/zones/{zone}/instanceGroups/{instanceGroup}`;

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
          id: {
            type: "string",
            description:
              "[Output Only] A unique identifier for this instance group, generated\nby the server. (Format: uint64)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of theregion\nwhere the instance group is located (for regional resources).",
          },
          network: {
            type: "string",
            description:
              "[Output Only] The URL of the network to which all instances in the\ninstance group belong. If your instance has multiple network interfaces,\nthen the network and subnetwork fields only refer to the\nnetwork and subnet used by your primary interface (nic0).",
          },
          fingerprint: {
            type: "string",
            description:
              "[Output Only] The fingerprint of the named ports. The system\nuses this fingerprint to detect conflicts when multiple users change the\nnamed ports concurrently. (Format: byte)",
          },
          namedPorts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                port: {
                  type: "integer",
                  description:
                    "The port number, which can be a value between 1 and 65535. (Format: int32)",
                },
                name: {
                  type: "string",
                  description:
                    "The name for this named port.\nThe name must be 1-63 characters long, and comply withRFC1035.",
                },
              },
              description: 'The named port. For example: <"http", 80>.',
              additionalProperties: true,
            },
            description:
              'Optional. Assigns a name to a port number. For example:{name: "http", port: 80}\n\nThis\nallows the system to reference ports by the assigned name instead of a\nport number. Named ports can also contain multiple ports. For example:[{name: "app1", port: 8080}, {name:\n"app1", port: 8081}, {name: "app2", port:\n8082}]\n\nNamed ports apply to all instances in this instance group.',
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] The creation timestamp for this instance group inRFC3339\ntext format.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of thezone\nwhere the instance group is located (for zonal resources).",
          },
          selfLink: {
            type: "string",
            description:
              "[Output Only] The URL for this instance group. The server generates\nthis URL.",
          },
          size: {
            type: "integer",
            description:
              "[Output Only] The total number of instances in the instance group. (Format: int32)",
          },
          subnetwork: {
            type: "string",
            description:
              "[Output Only] The URL of the subnetwork to which all instances in the\ninstance group belong. If your instance has multiple network interfaces,\nthen the network and subnetwork fields only refer to the\nnetwork and subnet used by your primary interface (nic0).",
          },
          name: {
            type: "string",
            description:
              "The name of the instance group. The name must be 1-63 characters\nlong, and comply withRFC1035.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] The resource type, which is alwayscompute#instanceGroup for instance groups.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
        },
        description:
          "Represents an Instance Group resource.\n\nInstance Groups can be used to configure a target forload\nbalancing.\n\nInstance groups can either be managed or unmanaged.\n\nTo create \nmanaged instance groups, use the instanceGroupManager orregionInstanceGroupManager resource instead.\n\nUse zonal unmanaged instance groups if you need to applyload\nbalancing to groups of heterogeneous instances or if you need to manage\nthe instances yourself. You cannot create regional unmanaged instance groups.\n\nFor more information, readInstance\ngroups.",
        additionalProperties: true,
      },
    },
  },
};

export default instanceGroupsGet;
