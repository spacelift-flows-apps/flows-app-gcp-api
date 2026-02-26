import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getGuestAttributes: AppBlock = {
  name: "Instances - Get Guest Attributes",
  description: `Returns the specified guest attributes entry.`,
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
        query_path: {
          name: "Query Path",
          description: "Specifies the guest attributes path to be queried.",
          type: {
            type: "string",
          },
          required: false,
        },
        variable_key: {
          name: "Variable Key",
          description: "Specifies the key for the guest attributes entry.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.instance !== undefined)
          pathParams["instance"] = String(input.event.inputConfig.instance);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.query_path !== undefined)
          queryParams["queryPath"] = String(input.event.inputConfig.query_path);
        if (input.event.inputConfig.variable_key !== undefined)
          queryParams["variableKey"] = String(
            input.event.inputConfig.variable_key,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}/getGuestAttributes",
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
        properties: {
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#guestAttributes for guest attributes entry.",
          },
          query_path: {
            type: "string",
            description:
              "The path to be queried. This can be the default namespace ('') or a nested namespace ('\\/') or a specified key ('\\/\\').",
          },
          query_value: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description: "Key for the guest attribute entry.",
                    },
                    namespace: {
                      type: "string",
                      description: "Namespace for the guest attribute entry.",
                    },
                    value: {
                      type: "string",
                      description: "Value for the guest attribute entry.",
                    },
                  },
                  description: "A guest attributes namespace/key/value entry.",
                  additionalProperties: true,
                },
              },
            },
            description: "Array of guest attribute namespace/key/value tuples.",
            additionalProperties: true,
          },
          self_link: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          variable_key: {
            type: "string",
            description: "The key to search for.",
          },
          variable_value: {
            type: "string",
            description:
              "Output only. [Output Only] The value found for the requested key.",
          },
        },
        description: "A guest attributes entry.",
        additionalProperties: true,
      },
    },
  },
};

export default getGuestAttributes;
