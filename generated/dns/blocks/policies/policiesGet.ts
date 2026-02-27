import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const policiesGet: AppBlock = {
  name: "Policies - Get",
  description: `Fetches the representation of an existing policy.`,
  category: "Policies",
  inputs: {
    default: {
      config: {
        policy: {
          name: "Policy",
          description:
            "User given friendly name of the policy addressed by this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        clientOperationId: {
          name: "Client Operation Id",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.policy !== undefined)
          pathParams["policy"] = String(input.event.inputConfig.policy);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "dns/v1/projects/{project}/policies/{policy}",
          pathParams,
          queryParams,
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
          enableInboundForwarding: {
            type: "boolean",
            description:
              "Allows networks bound to this policy to receive DNS queries sent by VMs or applications over VPN connections. When enabled, a virtual IP address is allocated from each of the subnetworks that are bound to this policy.",
          },
          networks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                networkUrl: {
                  type: "string",
                  description:
                    "The fully qualified URL of the VPC network to bind to. This should be formatted like https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}",
                },
                kind: {
                  type: "string",
                },
              },
              additionalProperties: true,
            },
            description:
              "List of network names specifying networks to which this policy is applied.",
          },
          dns64Config: {
            type: "object",
            properties: {
              scope: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                  },
                  allQueries: {
                    type: "boolean",
                    description:
                      "Controls whether DNS64 is enabled globally for all networks bound to the policy.",
                  },
                },
                additionalProperties: true,
              },
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
            description: "DNS64 policies",
          },
          kind: {
            type: "string",
          },
          name: {
            type: "string",
            description: "User-assigned name for this policy.",
          },
          alternativeNameServerConfig: {
            type: "object",
            properties: {
              targetNameServers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                    },
                    ipv4Address: {
                      type: "string",
                      description: "IPv4 address to forward queries to.",
                    },
                    forwardingPath: {
                      type: "string",
                      enum: ["default", "private"],
                      description:
                        "Forwarding path for this TargetNameServer. If unset or set to DEFAULT, Cloud DNS makes forwarding decisions based on address ranges; that is, RFC1918 addresses go to the VPC network, non-RFC1918 addresses go to the internet. When set to PRIVATE, Cloud DNS always sends queries through the VPC network for this target.",
                    },
                    ipv6Address: {
                      type: "string",
                      description:
                        "IPv6 address to forward to. Does not accept both fields (ipv4 & ipv6) being populated. Public preview as of November 2022.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "Sets an alternative name server for the associated networks. When specified, all DNS queries are forwarded to a name server that you choose. Names such as .internal are not available when an alternative name server is specified.",
              },
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
          },
          description: {
            type: "string",
            description:
              "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the policy's function.",
          },
          id: {
            type: "string",
            description:
              "Unique identifier for the resource; defined by the server (output only).",
          },
          enableLogging: {
            type: "boolean",
            description:
              "Controls whether logging is enabled for the networks bound to this policy. Defaults to no logging if not set.",
          },
        },
        additionalProperties: true,
        description:
          "A policy is a collection of DNS rules applied to one or more Virtual Private Cloud resources.",
      },
    },
  },
};

export default policiesGet;
