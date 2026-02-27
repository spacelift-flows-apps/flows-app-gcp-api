import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const diskTypesGet: AppBlock = {
  name: "Disk Types - Get",
  description: `Returns the specified disk type.`,
  category: "Disk Types",
  inputs: {
    default: {
      config: {
        diskType: {
          name: "Disk Type",
          description: "Name of the disk type to return.",
          type: {
            type: "string",
          },
          required: true,
        },
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
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
        let path = `projects/{project}/zones/{zone}/diskTypes/{diskType}`;

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
          zone: {
            type: "string",
            description:
              "[Output Only] URL of the zone where the disk type resides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          defaultDiskSizeGb: {
            type: "string",
            description:
              "[Output Only] Server-defined default disk size in GB. (Format: int64)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the disk type resides. Only\napplicable for regional resources.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          validDiskSize: {
            type: "string",
            description:
              '[Output Only] An optional textual description of the valid disk size,\nsuch as "10GB-10TB".',
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#diskType\nfor disk types.",
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
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the resource.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] An optional description of this resource.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
        },
        description:
          "Represents a Disk Type resource.\n\nGoogle Compute Engine has two Disk Type resources:\n\n* [Regional](/compute/docs/reference/rest/v1/regionDiskTypes)\n* [Zonal](/compute/docs/reference/rest/v1/diskTypes)\n\nYou can choose from a variety of disk types based on your needs.\nFor more information, readStorage options.\n\nThe diskTypes resource represents disk types for a zonal\npersistent disk.\nFor more information, readZonal persistent disks.\n\nThe regionDiskTypes resource represents disk types for a\nregional persistent disk. For more information, read Regional persistent disks.",
        additionalProperties: true,
      },
    },
  },
};

export default diskTypesGet;
