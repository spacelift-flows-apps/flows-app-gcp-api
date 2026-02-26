import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const deleteOperation: AppBlock = {
  name: "Zone Operations - Delete",
  description: `Deletes the specified zone-specific Operations resource.`,
  category: "Zone Operations",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "Name of the zone for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        operation: {
          name: "Operation",
          description:
            "Name of the Operations resource to delete, or its unique numeric identifier.",
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
        if (input.event.inputConfig.operation !== undefined)
          pathParams["operation"] = String(input.event.inputConfig.operation);

        const result = await computeFetch({
          config: input.app.config,
          method: "DELETE",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/operations/{operation}",
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
        properties: {},
        description:
          "A response message for ZoneOperations.Delete. See the method description for details.",
        additionalProperties: true,
      },
    },
  },
};

export default deleteOperation;
