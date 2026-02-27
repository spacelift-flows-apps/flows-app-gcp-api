import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const interconnectsGetMacsecConfig: AppBlock = {
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
        let path = `projects/{project}/global/interconnects/{interconnect}/getMacsecConfig`;

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
          etag: {
            type: "string",
            description: "end_interface: MixerGetResponseWithEtagBuilder",
          },
          result: {
            type: "object",
            properties: {
              preSharedKeys: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    cak: {
                      type: "string",
                      description:
                        "An auto-generated Connectivity Association Key (CAK) for this key.",
                    },
                    name: {
                      type: "string",
                      description:
                        "User provided name for this pre-shared key.",
                    },
                    startTime: {
                      type: "string",
                      description:
                        "User provided timestamp on or after which this key is valid.",
                    },
                    ckn: {
                      type: "string",
                      description:
                        "An auto-generated Connectivity Association Key Name (CKN) for this key.",
                    },
                  },
                  description:
                    "Describes a pre-shared key used to setup MACsec in static connectivity\nassociation key (CAK) mode.",
                  additionalProperties: true,
                },
                description:
                  "A keychain placeholder describing a set of named key objects\nalong with their start times. A MACsec CKN/CAK is generated for each key in\nthe key chain. Google router automatically picks the key with the most\nrecent startTime when establishing or re-establishing a MACsec secure link.",
              },
            },
            description:
              "MACsec configuration information for the Interconnect connection. Contains\nthe generated Connectivity Association Key Name (CKN) and the key (CAK) for\nthis Interconnect connection.",
            additionalProperties: true,
          },
        },
        description: "Response for the InterconnectsGetMacsecConfigRequest.",
        additionalProperties: true,
      },
    },
  },
};

export default interconnectsGetMacsecConfig;
