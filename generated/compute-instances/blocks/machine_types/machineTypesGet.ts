import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const machineTypesGet: AppBlock = {
  name: "Machine Types - Get",
  description: `Returns the specified machine type.`,
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
        machineType: {
          name: "Machine Type",
          description: "Name of the machine type to return.",
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
        let path = `projects/{project}/zones/{zone}/machineTypes/{machineType}`;

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
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the resource.",
          },
          imageSpaceGb: {
            type: "integer",
            description:
              "[Deprecated] This property is deprecated and will never be populated with\nany relevant values. (Format: int32)",
          },
          maximumPersistentDisks: {
            type: "integer",
            description:
              "[Output Only] Maximum persistent disks allowed. (Format: int32)",
          },
          deprecated: {
            type: "object",
            properties: {
              state: {
                type: "string",
                enum: ["ACTIVE", "DELETED", "DEPRECATED", "OBSOLETE"],
                description:
                  "The deprecation state of this resource. This can be ACTIVE,DEPRECATED, OBSOLETE, or DELETED.\nOperations which communicate the end of life date for an image, can useACTIVE. Operations which create a new resource using aDEPRECATED resource will return successfully, but with a\nwarning indicating the deprecated resource and recommending its\nreplacement. Operations which use OBSOLETE orDELETED resources will be rejected and result in an error.",
              },
              deprecated: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this\nresource is intended to change to DEPRECATED. This is only\ninformational and the status will not change unless the client explicitly\nchanges it.",
              },
              replacement: {
                type: "string",
                description:
                  "The URL of the suggested replacement for a deprecated resource.\nThe suggested replacement resource must be the same kind of resource as the\ndeprecated resource.",
              },
              obsolete: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this\nresource is intended to change to OBSOLETE. This is only\ninformational and the status will not change unless the client explicitly\nchanges it.",
              },
              deleted: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this\nresource is intended to change to DELETED. This is only\ninformational and the status will not change unless the client explicitly\nchanges it.",
              },
            },
            description: "Deprecation status for a public resource.",
            additionalProperties: true,
          },
          isSharedCpu: {
            type: "boolean",
            description:
              "[Output Only] Whether this machine type has a shared CPU. SeeShared-core machine\ntypes for more information.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] The type of the resource. Alwayscompute#machineType for machine types.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The name of the zone where the machine type resides,\nsuch as us-central1-a.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the resource.",
          },
          guestCpus: {
            type: "integer",
            description:
              "[Output Only] The number of virtual CPUs that are available to the\ninstance. (Format: int32)",
          },
          maximumPersistentDisksSizeGb: {
            type: "string",
            description:
              "[Output Only] Maximum total persistent disks size (GB) allowed. (Format: int64)",
          },
          memoryMb: {
            type: "integer",
            description:
              "[Output Only] The amount of physical memory available to the instance,\ndefined in MB. (Format: int32)",
          },
          accelerators: {
            type: "array",
            items: {
              type: "object",
              properties: {
                guestAcceleratorCount: {
                  type: "integer",
                  description:
                    "Number of accelerator cards exposed to the guest. (Format: int32)",
                },
                guestAcceleratorType: {
                  type: "string",
                  description:
                    "The accelerator type resource name, not a full URL, e.g.nvidia-tesla-t4.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] A list of accelerator configurations assigned to this\nmachine type.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          architecture: {
            type: "string",
            enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
            description: "[Output Only] The architecture of the machine type.",
          },
        },
        description:
          "Represents a Machine Type resource.\n\nYou can use specific machine types for your VM instances based on performance\nand pricing requirements. For more information, readMachine Types.",
        additionalProperties: true,
      },
    },
  },
};

export default machineTypesGet;
