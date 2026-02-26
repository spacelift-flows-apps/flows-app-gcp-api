import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Snapshot Settings Service - Get",
  description: `Returns the specified Zone resource.`,
  category: "Snapshot Settings Service",
  inputs: {
    default: {
      config: {},
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/snapshotSettings",
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
          storage_location: {
            type: "object",
            properties: {
              locations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "When the policy is SPECIFIC_LOCATIONS, snapshots will be stored in the locations listed in this field. Keys are Cloud Storage bucket locations. Only one location can be specified.",
              },
              policy: {
                type: "string",
                description:
                  "The chosen location policy. Check the Policy enum for the list of possible values.",
              },
            },
            additionalProperties: true,
            description:
              "Policy of which storage location is going to be resolved, and additional data that particularizes how the policy is going to be carried out.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default get;
