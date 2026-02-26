import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getMacsecConfig: AppBlock = {
  name: "Interconnects - Get Macsec Config",
  description: `Returns the interconnectMacsecConfig for the specified Interconnect.`,
  category: "Interconnects",
  inputs: {
    default: {
      config: {
        interconnect: {
          name: "Interconnect",
          description: "Name of the interconnect resource to query.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.interconnect !== undefined)
          pathParams["interconnect"] = String(
            input.event.inputConfig.interconnect,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/interconnects/{interconnect}/getMacsecConfig",
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
          etag: {
            type: "string",
            description: "end_interface: MixerGetResponseWithEtagBuilder",
          },
          result: {
            type: "object",
            properties: {
              pre_shared_keys: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    cak: {
                      type: "string",
                      description:
                        "An auto-generated Connectivity Association Key (CAK) for this key.",
                    },
                    ckn: {
                      type: "string",
                      description:
                        "An auto-generated Connectivity Association Key Name (CKN) for this key.",
                    },
                    name: {
                      type: "string",
                      description:
                        "User provided name for this pre-shared key.",
                    },
                    start_time: {
                      type: "string",
                      description:
                        "User provided timestamp on or after which this key is valid.",
                    },
                  },
                  description:
                    "Describes a pre-shared key used to setup MACsec in static connectivity association key (CAK) mode.",
                  additionalProperties: true,
                },
                description:
                  "A keychain placeholder describing a set of named key objects along with their start times. A MACsec CKN/CAK is generated for each key in the key chain. Google router automatically picks the key with the most recent startTime when establishing or re-establishing a MACsec secure link.",
              },
            },
            description:
              "MACsec configuration information for the Interconnect connection. Contains the generated Connectivity Association Key Name (CKN) and the key (CAK) for this Interconnect connection.",
            additionalProperties: true,
          },
        },
        description: "Response for the InterconnectsGetMacsecConfigRequest.",
        additionalProperties: true,
      },
    },
  },
};

export default getMacsecConfig;
