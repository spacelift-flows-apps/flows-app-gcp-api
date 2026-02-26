import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Global Public Delegated Prefixes - Get",
  description: `Returns the specified Zone resource.`,
  category: "Global Public Delegated Prefixes",
  inputs: {
    default: {
      config: {
        publicDelegatedPrefix: {
          name: "Public Delegated Prefix",
          description: "Name of the PublicDelegatedPrefix resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.publicDelegatedPrefix !== undefined)
          pathParams["public_delegated_prefix"] = String(
            input.event.inputConfig.publicDelegatedPrefix,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/publicDelegatedPrefixes/{public_delegated_prefix}",
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
          allocatablePrefixLength: {
            type: "integer",
            description:
              "The allocatable prefix length supported by this public delegated prefix. This field is optional and cannot be set for prefixes in DELEGATION mode. It cannot be set for IPv4 prefixes either, and it always defaults to 32.",
          },
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
          enableEnhancedIpv4Allocation: {
            type: "boolean",
            description:
              "Output only. [Output Only] Whether this PDP supports enhanced IPv4 allocations. Applicable for IPv4 PDPs only.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a new PublicDelegatedPrefix. An up-to-date fingerprint must be provided in order to update thePublicDelegatedPrefix, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a PublicDelegatedPrefix.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          ipCidrRange: {
            type: "string",
            description:
              "The IP address range, in CIDR format, represented by this public delegated prefix.",
          },
          ipv6AccessType: {
            type: "string",
            description:
              "Output only. [Output Only] The internet access type for IPv6 Public Delegated Prefixes. Inherited from parent prefix. Check the Ipv6AccessType enum for the list of possible values.",
          },
          isLiveMigration: {
            type: "boolean",
            description: "If true, the prefix will be live migrated.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#publicDelegatedPrefix for public delegated prefixes.",
          },
          mode: {
            type: "string",
            description:
              "The public delegated prefix mode for IPv6 only. Check the Mode enum for the list of possible values.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          parentPrefix: {
            type: "string",
            description:
              "The URL of parent prefix. Either PublicAdvertisedPrefix or PublicDelegatedPrefix.",
          },
          publicDelegatedSubPrefixs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                allocatablePrefixLength: {
                  type: "integer",
                  description:
                    "The allocatable prefix length supported by this PublicDelegatedSubPrefix.",
                },
                delegateeProject: {
                  type: "string",
                  description:
                    "Name of the project scoping this PublicDelegatedSubPrefix.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                enableEnhancedIpv4Allocation: {
                  type: "boolean",
                  description:
                    "Output only. [Output Only] Whether this PDP supports enhanced IPv4 allocations. Applicable for IPv4 PDPs only.",
                },
                ipCidrRange: {
                  type: "string",
                  description:
                    "The IP address range, in CIDR format, represented by this sub public delegated prefix.",
                },
                ipv6AccessType: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The internet access type for IPv6 Public Delegated Sub Prefixes. Inherited from parent prefix. Check the Ipv6AccessType enum for the list of possible values.",
                },
                isAddress: {
                  type: "boolean",
                  description:
                    "Whether the sub prefix is delegated to create Address resources in the delegatee project.",
                },
                mode: {
                  type: "string",
                  description:
                    "The PublicDelegatedSubPrefix mode for IPv6 only. Check the Mode enum for the list of possible values.",
                },
                name: {
                  type: "string",
                  description: "The name of the sub public delegated prefix.",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The region of the sub public delegated prefix if it is regional. If absent, the sub prefix is global.",
                },
                status: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The status of the sub public delegated prefix. Check the Status enum for the list of possible values.",
                },
              },
              description: "Represents a sub PublicDelegatedPrefix.",
              additionalProperties: true,
            },
            description:
              "The list of sub public delegated prefixes that exist for this public delegated prefix.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the public delegated prefix resides. This field applies only to the region resource. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          status: {
            type: "string",
            description:
              "[Output Only] The status of the public delegated prefix, which can be one of following values:        - `INITIALIZING` The public delegated prefix is being initialized and      addresses cannot be created yet.      - `READY_TO_ANNOUNCE` The public delegated prefix is a live migration      prefix and is active.      - `ANNOUNCED` The public delegated prefix is announced and ready to      use.      - `DELETING` The public delegated prefix is being deprovsioned.      - `ACTIVE` The public delegated prefix is ready to use. Check the Status enum for the list of possible values.",
          },
        },
        description:
          "A PublicDelegatedPrefix resource represents an IP block within a PublicAdvertisedPrefix that is configured within a single cloud scope (global or region). IPs in the block can be allocated to resources within that scope. Public delegated prefixes may be further broken up into smaller IP blocks in the same scope as the parent block.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
