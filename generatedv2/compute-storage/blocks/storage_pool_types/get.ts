import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Storage Pool Types - Get",
  description: `Returns the specified Zone resource.`,
  category: "Storage Pool Types",
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
        storagePoolType: {
          name: "Storage Pool Type",
          description: "Name of the storage pool type to return.",
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
        if (input.event.inputConfig.storagePoolType !== undefined)
          pathParams["storage_pool_type"] = String(
            input.event.inputConfig.storagePoolType,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/storagePoolTypes/{storage_pool_type}",
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
              "[Output Only] An optional description of this resource.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#storagePoolType for storage pool types.",
          },
          maxPoolProvisionedCapacityGb: {
            type: "string",
            description: "64-bit integer as string",
          },
          maxPoolProvisionedIops: {
            type: "string",
            description: "64-bit integer as string",
          },
          maxPoolProvisionedThroughput: {
            type: "string",
            description: "64-bit integer as string",
          },
          minPoolProvisionedCapacityGb: {
            type: "string",
            description: "64-bit integer as string",
          },
          minPoolProvisionedIops: {
            type: "string",
            description: "64-bit integer as string",
          },
          minPoolProvisionedThroughput: {
            type: "string",
            description: "64-bit integer as string",
          },
          minSizeGb: {
            type: "string",
            description: "64-bit integer as string",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the resource.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          selfLinkWithId: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource with the resource id.",
          },
          supportedDiskTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] The list of disk types supported in this storage pool type.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] URL of the zone where the storage pool type resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default get;
