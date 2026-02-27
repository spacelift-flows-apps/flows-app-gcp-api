import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const interconnectsGetDiagnostics: AppBlock = {
  name: "Interconnects - Get Diagnostics",
  description: `Returns the interconnectDiagnostics for the specified Interconnect. In the event of a global outage, do not use this API to make decisions about where to redirect your network traffic. Unlike a VLAN attachment, which is regional, a Cloud Interconnect connection is a global resource. A global outage can prevent this API from functioning properly.`,
  category: "Interconnects",
  inputs: {
    default: {
      config: {
        interconnect: {
          name: "Interconnect",
          description: "Name of the interconnect resource to query.",
          type: {
            type: "string",
            description: "Name of the interconnect resource to query.",
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
            "/compute/v1/projects/{project}/global/interconnects/{interconnect}/getDiagnostics",
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
          result: {
            type: "object",
            properties: {
              arpCaches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ipAddress: {
                      type: "string",
                      description: "The IP address of this ARP neighbor.",
                    },
                    macAddress: {
                      type: "string",
                      description: "The MAC address of this ARP neighbor.",
                    },
                  },
                  description:
                    "Describing the ARP neighbor entries seen on this link",
                  additionalProperties: true,
                },
                description:
                  "A list of InterconnectDiagnostics.ARPEntry objects, describing individual neighbors currently seen by the Google router in the ARP cache for the Interconnect. This will be empty when the Interconnect is not bundled.",
              },
              bundleAggregationType: {
                type: "string",
                enum: [
                  "UNDEFINED_BUNDLE_AGGREGATION_TYPE",
                  "BUNDLE_AGGREGATION_TYPE_LACP",
                  "BUNDLE_AGGREGATION_TYPE_STATIC",
                ],
                description:
                  "The aggregation type of the bundle interface. Check the BundleAggregationType enum for the list of possible values.",
              },
              bundleOperationalStatus: {
                type: "string",
                enum: [
                  "UNDEFINED_BUNDLE_OPERATIONAL_STATUS",
                  "BUNDLE_OPERATIONAL_STATUS_DOWN",
                  "BUNDLE_OPERATIONAL_STATUS_UP",
                ],
                description:
                  "The operational status of the bundle interface. Check the BundleOperationalStatus enum for the list of possible values.",
              },
              links: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    arpCaches: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          ipAddress: {
                            type: "string",
                            description: "The IP address of this ARP neighbor.",
                          },
                          macAddress: {
                            type: "string",
                            description:
                              "The MAC address of this ARP neighbor.",
                          },
                        },
                        description:
                          "Describing the ARP neighbor entries seen on this link",
                        additionalProperties: true,
                      },
                      description:
                        "A list of InterconnectDiagnostics.ARPEntry objects, describing the ARP neighbor entries seen on this link. This will be empty if the link is bundled",
                    },
                    circuitId: {
                      type: "string",
                      description:
                        "The unique ID for this link assigned during turn up by Google.",
                    },
                    googleDemarc: {
                      type: "string",
                      description:
                        "The Demarc address assigned by Google and provided in the LoA.",
                    },
                    lacpStatus: {
                      type: "object",
                      properties: {
                        googleSystemId: {
                          type: "string",
                          description:
                            "System ID of the port on Google's side of the LACP exchange.",
                        },
                        neighborSystemId: {
                          type: "string",
                          description:
                            "System ID of the port on the neighbor's side of the LACP exchange.",
                        },
                        state: {
                          type: "string",
                          enum: ["UNDEFINED_STATE", "ACTIVE", "DETACHED"],
                          description:
                            "The state of a LACP link, which can take one of the following values:     - ACTIVE: The link is configured and active within the bundle.    - DETACHED: The link is not configured within the bundle. This means    that the rest of the object should be empty. Check the State enum for the list of possible values.",
                        },
                      },
                      additionalProperties: true,
                    },
                    macsec: {
                      type: "object",
                      properties: {
                        ckn: {
                          type: "string",
                          description:
                            "Indicates the Connectivity Association Key Name (CKN) currently being used if MACsec is operational.",
                        },
                        operational: {
                          type: "boolean",
                          description:
                            "Indicates whether or not MACsec is operational on this link.",
                        },
                      },
                      description:
                        "Describes the status of MACsec encryption on the link.",
                      additionalProperties: true,
                    },
                    operationalStatus: {
                      type: "string",
                      enum: [
                        "UNDEFINED_OPERATIONAL_STATUS",
                        "LINK_OPERATIONAL_STATUS_DOWN",
                        "LINK_OPERATIONAL_STATUS_UP",
                      ],
                      description:
                        "The operational status of the link. Check the OperationalStatus enum for the list of possible values.",
                    },
                    receivingOpticalPower: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: [
                            "UNDEFINED_STATE",
                            "HIGH_ALARM",
                            "HIGH_WARNING",
                            "LOW_ALARM",
                            "LOW_WARNING",
                            "OK",
                          ],
                          description:
                            "The status of the current value when compared to the warning and alarm levels for the receiving or transmitting transceiver. Possible states include:       - OK: The value has not crossed a warning threshold.     - LOW_WARNING: The value has crossed below the low     warning threshold.    - HIGH_WARNING: The value has     crossed above the high warning threshold.     - LOW_ALARM: The value has crossed below the low alarm     threshold.     - HIGH_ALARM: The value has crossed above the high alarm     threshold. Check the State enum for the list of possible values.",
                        },
                        value: {
                          type: "number",
                          description:
                            "Value of the current receiving or transmitting optical power, read in dBm. Take a known good optical value, give it a 10% margin and trigger warnings relative to that value. In general, a -7dBm warning and a -11dBm alarm are good optical value estimates for most links.",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "An InterconnectDiagnostics.LinkOpticalPower object, describing the current value and status of the received light level.",
                    },
                    transmittingOpticalPower: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: [
                            "UNDEFINED_STATE",
                            "HIGH_ALARM",
                            "HIGH_WARNING",
                            "LOW_ALARM",
                            "LOW_WARNING",
                            "OK",
                          ],
                          description:
                            "The status of the current value when compared to the warning and alarm levels for the receiving or transmitting transceiver. Possible states include:       - OK: The value has not crossed a warning threshold.     - LOW_WARNING: The value has crossed below the low     warning threshold.    - HIGH_WARNING: The value has     crossed above the high warning threshold.     - LOW_ALARM: The value has crossed below the low alarm     threshold.     - HIGH_ALARM: The value has crossed above the high alarm     threshold. Check the State enum for the list of possible values.",
                        },
                        value: {
                          type: "number",
                          description:
                            "Value of the current receiving or transmitting optical power, read in dBm. Take a known good optical value, give it a 10% margin and trigger warnings relative to that value. In general, a -7dBm warning and a -11dBm alarm are good optical value estimates for most links.",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "An InterconnectDiagnostics.LinkOpticalPower object, describing the current value and status of the transmitted light level.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "A list of InterconnectDiagnostics.LinkStatus objects, describing the status for each link on the Interconnect.",
              },
              macAddress: {
                type: "string",
                description:
                  "The MAC address of the Interconnect's bundle interface.",
              },
            },
            description:
              "Diagnostics information about the Interconnect connection, which contains detailed and current technical information about Google's side of the connection.",
            additionalProperties: true,
          },
        },
        description: "Response for the InterconnectsGetDiagnosticsRequest.",
        additionalProperties: true,
      },
    },
  },
};

export default interconnectsGetDiagnostics;
