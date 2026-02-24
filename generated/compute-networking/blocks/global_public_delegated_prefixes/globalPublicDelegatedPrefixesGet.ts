import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const globalPublicDelegatedPrefixesGet: AppBlock = {
  name: "Global Public Delegated Prefixes - Get",
  description: `Returns the specified global PublicDelegatedPrefix resource.`,
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
        let path = `projects/{project}/global/publicDelegatedPrefixes/{publicDelegatedPrefix}`;

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
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          isLiveMigration: {
            type: "boolean",
            description: "If true, the prefix will be live migrated.",
          },
          byoipApiVersion: {
            type: "string",
            enum: ["V1", "V2"],
            description: "[Output Only] The version of BYOIP API.",
          },
          mode: {
            type: "string",
            enum: [
              "DELEGATION",
              "EXTERNAL_IPV6_FORWARDING_RULE_CREATION",
              "EXTERNAL_IPV6_SUBNETWORK_CREATION",
              "INTERNAL_IPV6_SUBNETWORK_CREATION",
            ],
            description: "The public delegated prefix mode for IPv6 only.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          publicDelegatedSubPrefixs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the sub public delegated prefix.",
                },
                delegateeProject: {
                  type: "string",
                  description:
                    "Name of the project scoping this PublicDelegatedSubPrefix.",
                },
                ipCidrRange: {
                  type: "string",
                  description:
                    "The IP address range, in CIDR format, represented by this sub public\ndelegated prefix.",
                },
                status: {
                  type: "string",
                  enum: ["ACTIVE", "INACTIVE"],
                  description:
                    "[Output Only] The status of the sub public delegated prefix.",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] The region of the sub public delegated prefix if it is\nregional. If absent, the sub prefix is global.",
                },
                allocatablePrefixLength: {
                  type: "integer",
                  description:
                    "The allocatable prefix length supported by this PublicDelegatedSubPrefix. (Format: int32)",
                },
                isAddress: {
                  type: "boolean",
                  description:
                    "Whether the sub prefix is delegated to create Address resources in the\ndelegatee project.",
                },
                mode: {
                  type: "string",
                  enum: [
                    "DELEGATION",
                    "EXTERNAL_IPV6_FORWARDING_RULE_CREATION",
                    "EXTERNAL_IPV6_SUBNETWORK_CREATION",
                    "INTERNAL_IPV6_SUBNETWORK_CREATION",
                  ],
                  description:
                    "The PublicDelegatedSubPrefix mode for IPv6 only.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                ipv6AccessType: {
                  type: "string",
                  enum: ["EXTERNAL", "INTERNAL"],
                  description:
                    "[Output Only] The internet access type for IPv6 Public Delegated Sub\nPrefixes. Inherited from parent prefix.",
                },
              },
              description: "Represents a sub PublicDelegatedPrefix.",
              additionalProperties: true,
            },
            description:
              "The list of sub public delegated prefixes that exist for this public\ndelegated prefix.",
          },
          status: {
            type: "string",
            enum: [
              "ACTIVE",
              "ANNOUNCED",
              "ANNOUNCED_TO_GOOGLE",
              "ANNOUNCED_TO_INTERNET",
              "DELETING",
              "INITIALIZING",
              "READY_TO_ANNOUNCE",
            ],
            description:
              "[Output Only] The status of the public delegated prefix, which can be one\nof following values:\n   \n   \n     - `INITIALIZING` The public delegated prefix is being initialized and\n     addresses cannot be created yet.\n     - `READY_TO_ANNOUNCE` The public delegated prefix is a live migration\n     prefix and is active.\n     - `ANNOUNCED` The public delegated prefix is announced and ready to\n     use.\n     - `DELETING` The public delegated prefix is being deprovsioned.\n     - `ACTIVE` The public delegated prefix is ready to use.",
          },
          ipCidrRange: {
            type: "string",
            description:
              "The IP address range, in CIDR format, represented by this public\ndelegated prefix.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#publicDelegatedPrefix for public delegated prefixes.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object.\nThis field is used in optimistic locking. This field will be ignored when\ninserting a new PublicDelegatedPrefix. An up-to-date\nfingerprint must be provided in order to update thePublicDelegatedPrefix, otherwise the request will fail with\nerror 412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a PublicDelegatedPrefix. (Format: byte)",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the public delegated prefix resides.\nThis field applies only to the region resource. You must specify this\nfield as part of the HTTP request URL. It is not settable as a field in\nthe request body.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          parentPrefix: {
            type: "string",
            description:
              "The URL of parent prefix. Either PublicAdvertisedPrefix or\nPublicDelegatedPrefix.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource type. The server\ngenerates this identifier. (Format: uint64)",
          },
          allocatablePrefixLength: {
            type: "integer",
            description:
              "The allocatable prefix length supported by this public delegated prefix.\nThis field is optional and cannot be set for prefixes in DELEGATION mode.\nIt cannot be set for IPv4 prefixes either, and it always defaults to 32. (Format: int32)",
          },
          ipv6AccessType: {
            type: "string",
            enum: ["EXTERNAL", "INTERNAL"],
            description:
              "[Output Only] The internet access type for IPv6 Public Delegated Prefixes.\nInherited from parent prefix.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
        },
        description:
          "A PublicDelegatedPrefix resource represents an IP block within a\nPublicAdvertisedPrefix that is configured within a single cloud scope\n(global or region). IPs in the block can be allocated to resources within\nthat scope. Public delegated prefixes may be further broken up into\nsmaller IP blocks in the same scope as the parent block.",
        additionalProperties: true,
      },
    },
  },
};

export default globalPublicDelegatedPrefixesGet;
