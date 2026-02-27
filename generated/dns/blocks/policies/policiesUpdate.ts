import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const policiesUpdate: AppBlock = {
  name: "Policies - Update",
  description: `Updates an existing policy.`,
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
          name: "Client Operation ID",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
        enableInboundForwarding: {
          name: "Enable Inbound Forwarding",
          description:
            "Allows networks bound to this policy to receive DNS queries sent by VMs or applications over VPN connections.",
          type: {
            type: "boolean",
            description:
              "Allows networks bound to this policy to receive DNS queries sent by VMs or applications over VPN connections. When enabled, a virtual IP address is allocated from each of the subnetworks that are bound to this policy.",
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
          required: false,
        },
        dns64Config: {
          name: "Dns64 Config",
          description: "Configurations related to DNS64 for this policy.",
          type: {
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
            description: "DNS64 policies",
            additionalProperties: true,
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "Request body field: kind",
          type: {
            type: "string",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "User-assigned name for this policy.",
          type: {
            type: "string",
            description: "User-assigned name for this policy.",
          },
          required: false,
        },
        alternativeNameServerConfig: {
          name: "Alternative Name Server Config",
          description:
            "Sets an alternative name server for the associated networks.",
          type: {
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
          required: false,
        },
        description: {
          name: "Description",
          description:
            "A mutable string of at most 1024 characters associated with this resource for the user's convenience.",
          type: {
            type: "string",
            description:
              "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the policy's function.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "Unique identifier for the resource; defined by the server (output only).",
          type: {
            type: "string",
            description:
              "Unique identifier for the resource; defined by the server (output only). (Format: uint64)",
          },
          required: false,
        },
        enableLogging: {
          name: "Enable Logging",
          description:
            "Controls whether logging is enabled for the networks bound to this policy.",
          type: {
            type: "boolean",
            description:
              "Controls whether logging is enabled for the networks bound to this policy. Defaults to no logging if not set.",
          },
          required: false,
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
              "https://www.googleapis.com/auth/ndev.clouddns.readwrite",
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
        const baseUrl = "https://dns.googleapis.com/";
        let path = `dns/v1/projects/{project}/policies/{policy}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.enableInboundForwarding !== undefined)
          requestBody.enableInboundForwarding =
            input.event.inputConfig.enableInboundForwarding;
        if (input.event.inputConfig.networks !== undefined)
          requestBody.networks = input.event.inputConfig.networks;
        if (input.event.inputConfig.dns64Config !== undefined)
          requestBody.dns64Config = input.event.inputConfig.dns64Config;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.alternativeNameServerConfig !== undefined)
          requestBody.alternativeNameServerConfig =
            input.event.inputConfig.alternativeNameServerConfig;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.enableLogging !== undefined)
          requestBody.enableLogging = input.event.inputConfig.enableLogging;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
          policy: {
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
                description: "DNS64 policies",
                additionalProperties: true,
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
                  "Unique identifier for the resource; defined by the server (output only). (Format: uint64)",
              },
              enableLogging: {
                type: "boolean",
                description:
                  "Controls whether logging is enabled for the networks bound to this policy. Defaults to no logging if not set.",
              },
            },
            description:
              "A policy is a collection of DNS rules applied to one or more Virtual Private Cloud resources.",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default policiesUpdate;
