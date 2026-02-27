import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const instancesGetScreenshot: AppBlock = {
  name: "Instances - Get Screenshot",
  description: `Returns the screenshot from the specified instance.`,
  category: "Instances",
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
        instance: {
          name: "Instance",
          description: "Name of the instance scoping this request.",
          type: {
            type: "string",
            description: "Name of the instance scoping this request.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.instance !== undefined)
          pathParams["instance"] = String(input.event.inputConfig.instance);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}/screenshot",
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
          contents: {
            type: "string",
            description: "[Output Only] The Base64-encoded screenshot data.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#screenshot for the screenshots.",
          },
        },
        description: "An instance's screenshot.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesGetScreenshot;
