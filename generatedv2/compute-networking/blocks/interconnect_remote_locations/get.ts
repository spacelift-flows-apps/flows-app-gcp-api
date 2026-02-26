import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Interconnect Remote Locations - Get",
  description: `Returns the specified Zone resource.`,
  category: "Interconnect Remote Locations",
  inputs: {
    default: {
      config: {
        interconnectRemoteLocation: {
          name: "Interconnect Remote Location",
          description: "Name of the interconnect remote location to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.interconnectRemoteLocation !== undefined)
          pathParams["interconnect_remote_location"] = String(
            input.event.inputConfig.interconnectRemoteLocation,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/interconnectRemoteLocations/{interconnect_remote_location}",
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
          attachmentConfigurationConstraints: {
            type: "object",
            properties: {
              bgpMd5: {
                type: "string",
                description:
                  "Output only. [Output Only] Whether the attachment's BGP session requires/allows/disallows BGP MD5 authentication. This can take one of the following values: MD5_OPTIONAL, MD5_REQUIRED, MD5_UNSUPPORTED.  For example, a Cross-Cloud Interconnect connection to a remote cloud provider that requires BGP MD5 authentication has the interconnectRemoteLocation attachment_configuration_constraints.bgp_md5 field set to MD5_REQUIRED, and that property is propagated to the attachment. Similarly, if BGP MD5 is MD5_UNSUPPORTED, an error is returned if MD5 is requested. Check the BgpMd5 enum for the list of possible values.",
              },
              bgpPeerAsnRanges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    max: {
                      type: "integer",
                    },
                    min: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Output only. [Output Only] List of ASN ranges that the remote location is known to support. Formatted as an array of inclusive ranges {min: min-value, max: max-value}. For example, [{min: 123, max: 123}, {min: 64512, max: 65534}] allows the peer ASN to be 123 or anything in the range 64512-65534.  This field is only advisory. Although the API accepts other ranges, these are the ranges that we recommend.",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] Subset of fields from InterconnectAttachment's |configurationConstraints| field that apply to all attachments for this remote location.",
          },
          city: {
            type: "string",
            description:
              'Output only. [Output Only] Metropolitan area designator that indicates which city an interconnect is located. For example: "Chicago, IL", "Amsterdam, Netherlands".',
          },
          constraints: {
            type: "object",
            properties: {
              portPairRemoteLocation: {
                type: "string",
                description:
                  "Output only. [Output Only] Port pair remote location constraints, which can take one of the following values: PORT_PAIR_UNCONSTRAINED_REMOTE_LOCATION, PORT_PAIR_MATCHING_REMOTE_LOCATION.  Google Cloud API refers only to individual ports, but the UI uses this field when ordering a pair of ports, to prevent users from accidentally ordering something that is incompatible with their cloud provider. Specifically, when ordering a redundant pair of Cross-Cloud Interconnect ports, and one of them uses a remote location with portPairMatchingRemoteLocation set to matching, the UI requires that both ports use the same remote location. Check the PortPairRemoteLocation enum for the list of possible values.",
              },
              portPairVlan: {
                type: "string",
                description:
                  "Output only. [Output Only] Port pair VLAN constraints, which can take one of the following values: PORT_PAIR_UNCONSTRAINED_VLAN, PORT_PAIR_MATCHING_VLAN Check the PortPairVlan enum for the list of possible values.",
              },
              subnetLengthRange: {
                type: "object",
                properties: {
                  max: {
                    type: "integer",
                  },
                  min: {
                    type: "integer",
                  },
                },
                additionalProperties: true,
                description:
                  "Output only. [Output Only]  [min-length, max-length]  The minimum and maximum value (inclusive) for the IPv4 subnet length.   For example, an  interconnectRemoteLocation for Azure has {min: 30, max: 30} because Azure requires /30 subnets.  This range specifies the values supported by both cloud providers. Interconnect currently supports /29 and /30 IPv4 subnet lengths. If a remote cloud has no constraint on IPv4 subnet length, the range would thus be {min: 29, max: 30}.",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] Constraints on the parameters for creating Cross-Cloud Interconnect and associated InterconnectAttachments.",
          },
          continent: {
            type: "string",
            description:
              "Output only. [Output Only] Continent for this location, which can take one of the following values:     - AFRICA    - ASIA_PAC    - EUROPE    - NORTH_AMERICA    - SOUTH_AMERICA Check the Continent enum for the list of possible values.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
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
              "Output only. [Output Only] Type of the resource. Alwayscompute#interconnectRemoteLocation for interconnect remote locations.",
          },
          lacp: {
            type: "string",
            description:
              "Output only. [Output Only] Link Aggregation Control Protocol (LACP) constraints, which can take one of the following values: LACP_SUPPORTED, LACP_UNSUPPORTED Check the Lacp enum for the list of possible values.",
          },
          maxLagSize100Gbps: {
            type: "integer",
            description:
              "Output only. [Output Only] The maximum number of 100 Gbps ports supported in a link aggregation group (LAG). When linkType is 100 Gbps, requestedLinkCount cannot exceed max_lag_size_100_gbps.",
          },
          maxLagSize10Gbps: {
            type: "integer",
            description:
              "Output only. [Output Only] The maximum number of 10 Gbps ports supported in a link aggregation group (LAG). When linkType is 10 Gbps, requestedLinkCount cannot exceed max_lag_size_10_gbps.",
          },
          maxLagSize400Gbps: {
            type: "integer",
            description:
              "Output only. [Output Only] The maximum number of 400 Gbps ports supported in a link aggregation group (LAG). When linkType is 400 Gbps, requestedLinkCount cannot exceed max_lag_size_400_gbps.",
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
          permittedConnections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                interconnectLocation: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of an Interconnect location that is permitted to connect to this Interconnect remote location.",
                },
              },
              additionalProperties: true,
            },
            description: "Output only. [Output Only] Permitted connections.",
          },
          remoteService: {
            type: "string",
            description:
              'Output only. [Output Only] Indicates the service provider present at the remote location. Example values: "Amazon Web Services", "Microsoft Azure".',
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          status: {
            type: "string",
            description:
              "Output only. [Output Only] The status of this InterconnectRemoteLocation, which can take one of the following values:     - CLOSED: The InterconnectRemoteLocation is closed and is unavailable    for provisioning new Cross-Cloud Interconnects.    - AVAILABLE: The    InterconnectRemoteLocation is available for provisioning new    Cross-Cloud Interconnects. Check the Status enum for the list of possible values.",
          },
        },
        description:
          "Represents a Cross-Cloud Interconnect Remote Location resource.  You can use this resource to find remote location details about an Interconnect attachment (VLAN).",
        additionalProperties: true,
      },
    },
  },
};

export default get;
