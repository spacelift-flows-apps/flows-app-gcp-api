import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const acceleratorTypesGet: AppBlock = {
  name: "Accelerator Types - Get",
  description: `Returns the specified Zone resource.`,
  category: "Accelerator Types",
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
        acceleratorType: {
          name: "Accelerator Type",
          description: "Name of the accelerator type to return.",
          type: {
            type: "string",
            description: "Name of the accelerator type to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.acceleratorType !== undefined)
          pathParams["accelerator_type"] = String(
            input.event.inputConfig.acceleratorType,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/acceleratorTypes/{accelerator_type}",
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
              "[Output Only] An optional textual description of the resource.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] The type of the resource. Alwayscompute#acceleratorType for accelerator types.",
          },
          maximumCardsPerInstance: {
            type: "integer",
            description:
              "[Output Only] Maximum number of accelerator cards allowed per instance.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the resource.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined, fully qualified URL for this resource.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The name of the zone where the accelerator type resides, such as us-central1-a. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
        },
        description:
          "Represents an Accelerator Type resource.  Google Cloud Platform provides graphics processing units (accelerators) that you can add to VM instances to improve or accelerate performance when working with intensive workloads. For more information, readGPUs on Compute Engine.",
        additionalProperties: true,
      },
    },
  },
};

export default acceleratorTypesGet;
