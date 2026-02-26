import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Public Advertised Prefixes - Get",
  description: `Returns the specified Zone resource.`,
  category: "Public Advertised Prefixes",
  inputs: {
    default: {
      config: {
        publicAdvertisedPrefix: {
          name: "Public Advertised Prefix",
          description: "Name of the PublicAdvertisedPrefix resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.publicAdvertisedPrefix !== undefined)
          pathParams["public_advertised_prefix"] = String(
            input.event.inputConfig.publicAdvertisedPrefix,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/publicAdvertisedPrefixes/{public_advertised_prefix}",
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
          byoipApiVersion: {
            type: "string",
            description:
              "Output only. [Output Only] The version of BYOIP API. Check the ByoipApiVersion enum for the list of possible values.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          dnsVerificationIp: {
            type: "string",
            description: "The address to be used for reverse DNS verification.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a new PublicAdvertisedPrefix. An up-to-date fingerprint must be provided in order to update thePublicAdvertisedPrefix, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a PublicAdvertisedPrefix.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          ipCidrRange: {
            type: "string",
            description:
              "The address range, in CIDR format, represented by this public advertised prefix.",
          },
          ipv6AccessType: {
            type: "string",
            description:
              "The internet access type for IPv6 Public Advertised Prefixes. Check the Ipv6AccessType enum for the list of possible values.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#publicAdvertisedPrefix for public advertised prefixes.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          pdpScope: {
            type: "string",
            description:
              "Specifies how child public delegated prefix will be scoped. It could be one of following values:        - `REGIONAL`: The public delegated prefix is regional only. The      provisioning will take a few minutes.      - `GLOBAL`: The public delegated prefix is global only. The      provisioning will take ~4 weeks.      - `GLOBAL_AND_REGIONAL` [output only]: The public delegated prefixes is       BYOIP V1 legacy prefix. This is output only value and no longer       supported in BYOIP V2. Check the PdpScope enum for the list of possible values.",
          },
          publicDelegatedPrefixs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ipRange: {
                  type: "string",
                  description:
                    "The IP address range of the public delegated prefix",
                },
                name: {
                  type: "string",
                  description: "The name of the public delegated prefix",
                },
                project: {
                  type: "string",
                  description:
                    "The project number of the public delegated prefix",
                },
                region: {
                  type: "string",
                  description:
                    "The region of the public delegated prefix if it is regional. If absent, the prefix is global.",
                },
                status: {
                  type: "string",
                  description:
                    "The status of the public delegated prefix. Possible values are:   INITIALIZING: The public delegated prefix is being initialized and     addresses cannot be created yet.   ANNOUNCED: The public delegated prefix is active.",
                },
              },
              description:
                "Represents a CIDR range which can be used to assign addresses.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] The list of public delegated prefixes that exist for this public advertised prefix.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          sharedSecret: {
            type: "string",
            description:
              "[Output Only] The shared secret to be used for reverse DNS verification.",
          },
          status: {
            type: "string",
            description:
              "The status of the public advertised prefix. Possible values include:        - `INITIAL`: RPKI validation is complete.      - `PTR_CONFIGURED`: User has configured the PTR.      - `VALIDATED`: Reverse DNS lookup is successful.      - `REVERSE_DNS_LOOKUP_FAILED`: Reverse DNS lookup failed.      - `PREFIX_CONFIGURATION_IN_PROGRESS`: The prefix is being      configured.      - `PREFIX_CONFIGURATION_COMPLETE`: The prefix is fully configured.      - `PREFIX_REMOVAL_IN_PROGRESS`: The prefix is being removed. Check the Status enum for the list of possible values.",
          },
        },
        description:
          "A public advertised prefix represents an aggregated IP prefix or netblock which customers bring to cloud. The IP prefix is a single unit of route advertisement and is announced globally to the internet.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
