import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const resourceRecordSetsDelete: AppBlock = {
  name: "Resource Record Sets - Delete",
  description: `Deletes a previously created ResourceRecordSet.`,
  category: "Resource Record Sets",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Fully qualified domain name.",
          type: {
            type: "string",
          },
          required: true,
        },
        managedZone: {
          name: "Managed Zone",
          description:
            "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
          type: {
            type: "string",
          },
          required: true,
        },
        type: {
          name: "Type",
          description: "RRSet type.",
          type: {
            type: "string",
          },
          required: true,
        },
        clientOperationId: {
          name: "Client Operation Id",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.name !== undefined)
          pathParams["name"] = String(input.event.inputConfig.name);
        if (input.event.inputConfig.managedZone !== undefined)
          pathParams["managedZone"] = String(
            input.event.inputConfig.managedZone,
          );
        if (input.event.inputConfig.type !== undefined)
          pathParams["type"] = String(input.event.inputConfig.type);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "DELETE",
          pathTemplate:
            "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets/{name}/{type}",
          pathParams,
          queryParams,
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
        additionalProperties: true,
      },
    },
  },
};

export default resourceRecordSetsDelete;
