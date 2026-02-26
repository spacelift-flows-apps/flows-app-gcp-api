import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const policiesCreate: AppBlock = {
  name: "Policies - Create",
  description: `Creates a new policy.`,
  category: "Policies",
  inputs: {
    default: {
      config: {
        enableInboundForwarding: {
          name: "Enable Inbound Forwarding",
          description:
            "Allows networks bound to this policy to receive DNS queries sent by VMs or applications over VPN connections. When enabled, a virtual IP address is allocated from each of the subnetworks that are bound to this policy.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        networks: {
          name: "Networks",
          description:
            "List of network names specifying networks to which this policy is applied.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                networkUrl: {
                  type: "string",
                },
              },
              additionalProperties: true,
            },
          },
          required: false,
        },
        dns64Config: {
          name: "Dns64Config",
          description: "Configurations related to DNS64 for this policy.",
          type: {
            type: "object",
            properties: {
              scope: {
                type: "object",
                properties: {
                  allQueries: {
                    type: "boolean",
                  },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "User-assigned name for this policy.",
          type: {
            type: "string",
          },
          required: false,
        },
        alternativeNameServerConfig: {
          name: "Alternative Name Server Config",
          description:
            "Sets an alternative name server for the associated networks. When specified, all DNS queries are forwarded to a name server that you choose. Names such as .internal are not available when an alternative name server is specified.",
          type: {
            type: "object",
            properties: {
              targetNameServers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ipv4Address: {
                      type: "string",
                    },
                    forwardingPath: {
                      type: "string",
                      enum: ["default", "private"],
                    },
                    ipv6Address: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the policy's function.",
          type: {
            type: "string",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Unique identifier for the resource; defined by the server (output only).",
          type: {
            type: "string",
          },
          required: false,
        },
        enableLogging: {
          name: "Enable Logging",
          description:
            "Controls whether logging is enabled for the networks bound to this policy. Defaults to no logging if not set.",
          type: {
            type: "boolean",
          },
          required: false,
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

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );
        const body: Record<string, any> = {};
        if (input.event.inputConfig.enableInboundForwarding !== undefined)
          body.enableInboundForwarding =
            input.event.inputConfig.enableInboundForwarding;
        if (input.event.inputConfig.networks !== undefined)
          body.networks = input.event.inputConfig.networks;
        if (input.event.inputConfig.dns64Config !== undefined)
          body.dns64Config = input.event.inputConfig.dns64Config;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.alternativeNameServerConfig !== undefined)
          body.alternativeNameServerConfig =
            input.event.inputConfig.alternativeNameServerConfig;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.enableLogging !== undefined)
          body.enableLogging = input.event.inputConfig.enableLogging;

        const result = await dnsFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate: "dns/v1/projects/{project}/policies",
          pathParams,
          queryParams,
          body: Object.keys(body).length > 0 ? body : undefined,
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

export default policiesCreate;
