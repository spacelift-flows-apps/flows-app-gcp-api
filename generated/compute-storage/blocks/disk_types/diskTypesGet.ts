import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const diskTypesGet: AppBlock = {
  name: "Disk Types - Get",
  description: `Returns the specified Zone resource.`,
  category: "Disk Types",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
          type: {
            type: "string",
            description: "The name of the zone for this request.",
          },
          required: true,
        },
        diskType: {
          name: "Disk Type",
          description: "Name of the disk type to return.",
          type: {
            type: "string",
            description: "Name of the disk type to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.diskType !== undefined)
          pathParams["disk_type"] = String(input.event.inputConfig.diskType);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/diskTypes/{disk_type}",
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
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339 text format.",
          },
          defaultDiskSizeGb: {
            type: "string",
            description: "64-bit integer as string",
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
                enum: [
                  "UNDEFINED_STATE",
                  "ACTIVE",
                  "DELETED",
                  "DEPRECATED",
                  "OBSOLETE",
                ],
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
              "[Output Only] An optional description of this resource.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#diskType for disk types.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the resource.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the disk type resides. Only applicable for regional resources. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          validDiskSize: {
            type: "string",
            description:
              '[Output Only] An optional textual description of the valid disk size, such as "10GB-10TB".',
          },
          zone: {
            type: "string",
            description:
              "[Output Only] URL of the zone where the disk type resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
        },
        description:
          "Represents a Disk Type resource.  Google Compute Engine has two Disk Type resources:  * [Regional](/compute/docs/reference/rest/v1/regionDiskTypes) * [Zonal](/compute/docs/reference/rest/v1/diskTypes)  You can choose from a variety of disk types based on your needs. For more information, readStorage options.  The diskTypes resource represents disk types for a zonal persistent disk. For more information, readZonal persistent disks.  The regionDiskTypes resource represents disk types for a regional persistent disk. For more information, read Regional persistent disks.",
        additionalProperties: true,
      },
    },
  },
};

export default diskTypesGet;
