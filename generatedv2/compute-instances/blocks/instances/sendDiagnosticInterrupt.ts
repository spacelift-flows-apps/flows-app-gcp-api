import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const sendDiagnosticInterrupt: AppBlock = {
  name: "Instances - Send Diagnostic Interrupt",
  description: `Sends diagnostic interrupt to the instance.`,
  category: "Instances",
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
        instance: {
          name: "Instance",
          description: "Name of the instance scoping this request.",
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
        if (input.event.inputConfig.instance !== undefined)
          pathParams["instance"] = String(input.event.inputConfig.instance);

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}/sendDiagnosticInterrupt",
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
          "A response message for Instances.SendDiagnosticInterrupt. See the method description for details.",
        additionalProperties: true,
      },
    },
  },
};

export default sendDiagnosticInterrupt;
