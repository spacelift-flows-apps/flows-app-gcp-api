import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const interconnectLocationsGet: AppBlock = {
  name: "Interconnect Locations - Get",
  description: `Returns the specified Zone resource.`,
  category: "Interconnect Locations",
  inputs: {
    default: {
      config: {
        interconnectLocation: {
          name: "Interconnect Location",
          description: "Name of the interconnect location to return.",
          type: {
            type: "string",
            description: "Name of the interconnect location to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.interconnectLocation !== undefined)
          pathParams["interconnect_location"] = String(
            input.event.inputConfig.interconnectLocation,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/interconnectLocations/{interconnect_location}",
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
          address: {
            type: "string",
            description:
              "Output only. [Output Only] The postal address of the Point of Presence, each line in the address is separated by a newline character.",
          },
          availabilityZone: {
            type: "string",
            description:
              '[Output Only] Availability zone for this InterconnectLocation. Within a metropolitan area (metro), maintenance will not be simultaneously scheduled in more than one availability zone.  Example: "zone1" or "zone2".',
          },
          availableFeatures: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "UNDEFINED_AVAILABLE_FEATURES",
                "IF_CROSS_SITE_NETWORK",
                "IF_L2_FORWARDING",
                "IF_MACSEC",
              ],
            },
            description:
              "[Output only] List of features available at this InterconnectLocation, which can take one of the following values:     - IF_MACSEC    - IF_CROSS_SITE_NETWORK Check the AvailableFeatures enum for the list of possible values.",
          },
          availableLinkTypes: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "UNDEFINED_AVAILABLE_LINK_TYPES",
                "LINK_TYPE_ETHERNET_100G_LR",
                "LINK_TYPE_ETHERNET_10G_LR",
                "LINK_TYPE_ETHERNET_400G_LR4",
              ],
            },
            description:
              "[Output only] List of link types available at this InterconnectLocation, which can take one of the following values:     - LINK_TYPE_ETHERNET_10G_LR    - LINK_TYPE_ETHERNET_100G_LR    - LINK_TYPE_ETHERNET_400G_LR4 Check the AvailableLinkTypes enum for the list of possible values.",
          },
          city: {
            type: "string",
            description:
              '[Output Only] Metropolitan area designator that indicates which city an interconnect is located. For example: "Chicago, IL", "Amsterdam, Netherlands".',
          },
          continent: {
            type: "string",
            enum: [
              "UNDEFINED_CONTINENT",
              "AFRICA",
              "ASIA_PAC",
              "C_AFRICA",
              "C_ASIA_PAC",
              "C_EUROPE",
              "C_NORTH_AMERICA",
              "C_SOUTH_AMERICA",
              "EUROPE",
              "NORTH_AMERICA",
              "SOUTH_AMERICA",
            ],
            description:
              "[Output Only] Continent for this location, which can take one of the following values:     - AFRICA    - ASIA_PAC    - EUROPE    - NORTH_AMERICA    - SOUTH_AMERICA Check the Continent enum for the list of possible values.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          crossSiteInterconnectInfos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                city: {
                  type: "string",
                  description:
                    "Output only. The remote location for Cross-Site Interconnect wires. This specifies an InterconnectLocation city (metropolitan area designator), which itself may match multiple InterconnectLocations.",
                },
              },
              description:
                "Information about Cross-Site Interconnect wires which may be created between the containing location and another remote location.",
              additionalProperties: true,
            },
            description:
              "[Output Only] A list of InterconnectLocation.CrossSiteInterconnectInfo objects, that describe where Cross-Site Interconnect wires may connect to from this location and associated connection parameters. Cross-Site Interconnect isn't allowed to locations which are not listed.",
          },
          description: {
            type: "string",
            description:
              "Output only. [Output Only] An optional description of the resource.",
          },
          facilityProvider: {
            type: "string",
            description:
              "Output only. [Output Only] The name of the provider for this facility (e.g., EQUINIX).",
          },
          facilityProviderFacilityId: {
            type: "string",
            description:
              "Output only. [Output Only] A provider-assigned Identifier for this facility (e.g., Ashburn-DC1).",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#interconnectLocation for interconnect locations.",
          },
          name: {
            type: "string",
            description: "Output only. [Output Only] Name of the resource.",
          },
          peeringdbFacilityId: {
            type: "string",
            description:
              "Output only. [Output Only] The peeringdb identifier for this facility (corresponding with a netfac type in peeringdb).",
          },
          regionInfos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                expectedRttMs: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                l2ForwardingEnabled: {
                  type: "boolean",
                  description:
                    "Output only. Identifies whether L2 Interconnect Attachments can be created in this region for interconnects that are in this location.",
                },
                locationPresence: {
                  type: "string",
                  enum: [
                    "UNDEFINED_LOCATION_PRESENCE",
                    "GLOBAL",
                    "LOCAL_REGION",
                    "LP_GLOBAL",
                    "LP_LOCAL_REGION",
                  ],
                  description:
                    "Output only. Identifies the network presence of this location. Check the LocationPresence enum for the list of possible values.",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. URL for the region of this location.",
                },
              },
              description:
                "Information about any potential InterconnectAttachments between an Interconnect at a specific InterconnectLocation, and a specific Cloud Region.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] A list of InterconnectLocation.RegionInfo objects, that describe parameters pertaining to the relation between this InterconnectLocation and various Google Cloud regions.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          singleRegionProductionCriticalPeerLocations: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] URLs of the other locations that can pair up with this location to support Single-Region 99.99% SLA. E.g. iad-zone1-1 and iad-zone2-5467 are Single-Region 99.99% peer locations of each other.",
          },
          status: {
            type: "string",
            enum: ["UNDEFINED_STATUS", "AVAILABLE", "CLOSED"],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          supportsPzs: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
        },
        description:
          "Represents an Interconnect Attachment (VLAN) Location resource.  You can use this resource to find location details about an Interconnect attachment (VLAN). For more information about interconnect attachments, read Creating VLAN Attachments.",
        additionalProperties: true,
      },
    },
  },
};

export default interconnectLocationsGet;
