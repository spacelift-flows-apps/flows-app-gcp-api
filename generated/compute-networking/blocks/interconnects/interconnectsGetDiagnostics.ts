import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const interconnectsGetDiagnostics: AppBlock = {
  name: "Interconnects - Get Diagnostics",
  description: `Returns the interconnectDiagnostics for the specified Interconnect.`,
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
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/compute",
              "https://www.googleapis.com/auth/compute.readonly",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/global/interconnects/{interconnect}/getDiagnostics`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
          );
        }

        const result = await response.json();
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
              bundleOperationalStatus: {
                type: "string",
                enum: [
                  "BUNDLE_OPERATIONAL_STATUS_DOWN",
                  "BUNDLE_OPERATIONAL_STATUS_UP",
                ],
                description: "The operational status of the bundle interface.",
              },
              macAddress: {
                type: "string",
                description:
                  "The MAC address of the Interconnect's bundle interface.",
              },
              links: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    operationalStatus: {
                      type: "string",
                      enum: [
                        "LINK_OPERATIONAL_STATUS_DOWN",
                        "LINK_OPERATIONAL_STATUS_UP",
                      ],
                      description: "The operational status of the link.",
                    },
                    receivingOpticalPower: {
                      type: "object",
                      properties: {
                        value: {
                          type: "number",
                          description:
                            "Value of the current receiving or transmitting optical power, read in\ndBm. Take a known good optical value, give it a 10% margin and trigger\nwarnings relative to that value. In general, a -7dBm warning and a -11dBm\nalarm are good optical value estimates for most links. (Format: float)",
                        },
                        state: {
                          type: "string",
                          enum: [
                            "HIGH_ALARM",
                            "HIGH_WARNING",
                            "LOW_ALARM",
                            "LOW_WARNING",
                            "OK",
                          ],
                          description:
                            "The status of the current value when compared to the warning and alarm\nlevels for the receiving or transmitting transceiver. Possible states\ninclude:\n   \n   \n    - OK: The value has not crossed a warning threshold.\n    - LOW_WARNING: The value has crossed below the low\n    warning threshold. \n   - HIGH_WARNING: The value has\n    crossed above the high warning threshold.\n    - LOW_ALARM: The value has crossed below the low alarm\n    threshold.\n    - HIGH_ALARM: The value has crossed above the high alarm\n    threshold.",
                        },
                      },
                      additionalProperties: true,
                    },
                    transmittingOpticalPower: {
                      type: "object",
                      properties: {
                        value: {
                          type: "number",
                          description:
                            "Value of the current receiving or transmitting optical power, read in\ndBm. Take a known good optical value, give it a 10% margin and trigger\nwarnings relative to that value. In general, a -7dBm warning and a -11dBm\nalarm are good optical value estimates for most links. (Format: float)",
                        },
                        state: {
                          type: "string",
                          enum: [
                            "HIGH_ALARM",
                            "HIGH_WARNING",
                            "LOW_ALARM",
                            "LOW_WARNING",
                            "OK",
                          ],
                          description:
                            "The status of the current value when compared to the warning and alarm\nlevels for the receiving or transmitting transceiver. Possible states\ninclude:\n   \n   \n    - OK: The value has not crossed a warning threshold.\n    - LOW_WARNING: The value has crossed below the low\n    warning threshold. \n   - HIGH_WARNING: The value has\n    crossed above the high warning threshold.\n    - LOW_ALARM: The value has crossed below the low alarm\n    threshold.\n    - HIGH_ALARM: The value has crossed above the high alarm\n    threshold.",
                        },
                      },
                      additionalProperties: true,
                    },
                    circuitId: {
                      type: "string",
                      description:
                        "The unique ID for this link assigned during turn up by Google.",
                    },
                    arpCaches: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          macAddress: {
                            type: "string",
                            description:
                              "The MAC address of this ARP neighbor.",
                          },
                          ipAddress: {
                            type: "string",
                            description: "The IP address of this ARP neighbor.",
                          },
                        },
                        description:
                          "Describing the ARP neighbor entries seen on this link",
                        additionalProperties: true,
                      },
                      description:
                        "A list of InterconnectDiagnostics.ARPEntry objects,\ndescribing the ARP neighbor entries seen on this link.\nThis will be empty if the link is bundled",
                    },
                    macsec: {
                      type: "object",
                      properties: {
                        ckn: {
                          type: "string",
                          description:
                            "Indicates the Connectivity Association Key Name (CKN)\ncurrently being used if MACsec is operational.",
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
                    googleDemarc: {
                      type: "string",
                      description:
                        "The Demarc address assigned by Google and provided in the LoA.",
                    },
                    lacpStatus: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: ["ACTIVE", "DETACHED"],
                          description:
                            "The state of a LACP link, which can take one of the following values:\n   \n   - ACTIVE: The link is configured and active within the bundle.\n   - DETACHED: The link is not configured within the bundle. This means\n   that the rest of the object should be empty.",
                        },
                        neighborSystemId: {
                          type: "string",
                          description:
                            "System ID of the port on the neighbor's side of the LACP exchange.",
                        },
                        googleSystemId: {
                          type: "string",
                          description:
                            "System ID of the port on Google's side of the LACP exchange.",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "A list of InterconnectDiagnostics.LinkStatus objects,\ndescribing the status for each link on the Interconnect.",
              },
              bundleAggregationType: {
                type: "string",
                enum: [
                  "BUNDLE_AGGREGATION_TYPE_LACP",
                  "BUNDLE_AGGREGATION_TYPE_STATIC",
                ],
                description: "The aggregation type of the bundle interface.",
              },
              arpCaches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    macAddress: {
                      type: "string",
                      description: "The MAC address of this ARP neighbor.",
                    },
                    ipAddress: {
                      type: "string",
                      description: "The IP address of this ARP neighbor.",
                    },
                  },
                  description:
                    "Describing the ARP neighbor entries seen on this link",
                  additionalProperties: true,
                },
                description:
                  "A list of InterconnectDiagnostics.ARPEntry objects,\ndescribing individual neighbors currently seen by the Google router in\nthe ARP cache for the Interconnect.\nThis will be empty when the Interconnect is not bundled.",
              },
            },
            description:
              "Diagnostics information about the Interconnect connection, which contains\ndetailed and current technical information about Google's side of the\nconnection.",
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
