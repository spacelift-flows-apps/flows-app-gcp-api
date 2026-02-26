import { AppBlock, events } from "@slflows/sdk/v1";
import { getFunctionServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
  runtimes: {
    name: "runtimes",
    fields: {
      display_name: "displayName",
      deprecation_date: "deprecationDate",
      decommission_date: "decommissionDate",
    },
  },
};

const listRuntimes: AppBlock = {
  name: "List Runtimes",
  description: `Returns a list of runtimes that are supported for the requested project.`,
  category: "Functions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The project and location from which the runtimes should be listed, specified in the format `projects/*/locations/*`",
          type: {
            type: "string",
            description:
              "Required. The project and location from which the runtimes should be listed, specified in the format `projects/*/locations/*`",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            "The filter for Runtimes that match the filter expression, following the syntax outlined in https://google.aip.dev/160.",
          type: {
            type: "string",
            description:
              "The filter for Runtimes that match the filter expression, following the syntax outlined in https://google.aip.dev/160.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getFunctionServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.listRuntimes(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          runtimes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name of the runtime, e.g., 'go113', 'nodejs12', etc.",
                },
                displayName: {
                  type: "string",
                  description:
                    "The user facing name, eg 'Go 1.13', 'Node.js 12', etc.",
                },
                stage: {
                  type: "string",
                  enum: [
                    "RUNTIME_STAGE_UNSPECIFIED",
                    "DEVELOPMENT",
                    "ALPHA",
                    "BETA",
                    "GA",
                    "DEPRECATED",
                    "DECOMMISSIONED",
                  ],
                  description:
                    "The stage of life this runtime is in, e.g., BETA, GA, etc.",
                },
                warnings: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Warning messages, e.g., a deprecation warning.",
                },
                environment: {
                  type: "string",
                  enum: ["ENVIRONMENT_UNSPECIFIED", "GEN_1", "GEN_2"],
                  description: "The environment the function is hosted on.",
                },
                deprecationDate: {
                  type: "object",
                  properties: {
                    year: {
                      type: "integer",
                    },
                    month: {
                      type: "integer",
                    },
                    day: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                  description: "Deprecation date for the runtime.",
                },
                decommissionDate: {
                  type: "object",
                  properties: {
                    year: {
                      type: "integer",
                    },
                    month: {
                      type: "integer",
                    },
                    day: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                  description: "Decommission date for the runtime.",
                },
              },
              description:
                "Describes a runtime and any special information (e.g., deprecation status) related to it.",
              additionalProperties: true,
            },
            description: "The runtimes that match the request.",
          },
        },
        description: "Response for the `ListRuntimes` method.",
        additionalProperties: true,
      },
    },
  },
};

export default listRuntimes;
