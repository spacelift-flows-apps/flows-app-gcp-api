import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const managedZonesCreate: AppBlock = {
  name: "Managed Zones - Create",
  description: `Creates a new ManagedZone.`,
  category: "Managed Zones",
  inputs: {
    default: {
      config: {
        privateVisibilityConfig: {
          name: "Private Visibility Config",
          description:
            "For privately visible zones, the set of Virtual Private Cloud resources that the zone is visible from.",
          type: {
            type: "object",
            properties: {
              gkeClusters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    gkeClusterName: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
              networks: {
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
            },
            additionalProperties: true,
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the managed zone's function.",
          type: {
            type: "string",
          },
          required: false,
        },
        dnssecConfig: {
          name: "Dnssec Config",
          description: "DNSSEC configuration.",
          type: {
            type: "object",
            properties: {
              state: {
                type: "string",
                enum: ["off", "on", "transfer"],
              },
              defaultKeySpecs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    keyType: {
                      type: "string",
                      enum: ["keySigning", "zoneSigning"],
                    },
                    algorithm: {
                      type: "string",
                      enum: [
                        "rsasha1",
                        "rsasha256",
                        "rsasha512",
                        "ecdsap256sha256",
                        "ecdsap384sha384",
                      ],
                    },
                    keyLength: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                },
              },
              nonExistence: {
                type: "string",
                enum: ["nsec", "nsec3"],
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        cloudLoggingConfig: {
          name: "Cloud Logging Config",
          description: "Cloud Logging Config field.",
          type: {
            type: "object",
            properties: {
              enableLogging: {
                type: "boolean",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        creationTime: {
          name: "Creation Time",
          description:
            "The time that this resource was created on the server. This is in RFC3339 text format. Output only.",
          type: {
            type: "string",
          },
          required: false,
        },
        nameServers: {
          name: "Name Servers",
          description:
            "Delegate your managed_zone to these virtual name servers; defined by the server (output only)",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        dnsName: {
          name: "Dns Name",
          description:
            'The DNS name of this managed zone, for instance "example.com.".',
          type: {
            type: "string",
          },
          required: false,
        },
        serviceDirectoryConfig: {
          name: "Service Directory Config",
          description:
            "This field links to the associated service directory namespace. Do not set this field for public zones or forwarding zones.",
          type: {
            type: "object",
            properties: {
              namespace: {
                type: "object",
                properties: {
                  namespaceUrl: {
                    type: "string",
                  },
                  deletionTime: {
                    type: "string",
                  },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        visibility: {
          name: "Visibility",
          description:
            "The zone's visibility: public zones are exposed to the Internet, while private zones are visible only to Virtual Private Cloud resources.",
          type: {
            type: "string",
            enum: ["public", "private"],
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "User assigned name for this resource. Must be unique within the project. The name must be 1-63 characters long, must begin with a letter, end with a letter or digit, and only contain lowercase letters, digits or dashes.",
          type: {
            type: "string",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Unique identifier for the resource; defined by the server (output only)",
          type: {
            type: "string",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "User labels.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        reverseLookupConfig: {
          name: "Reverse Lookup Config",
          description:
            "The presence of this field indicates that this is a managed reverse lookup zone and Cloud DNS resolves reverse lookup queries using automatically configured records for VPC resources. This only applies to networks listed under private_visibility_config.",
          type: {
            type: "object",
            properties: {},
            additionalProperties: true,
          },
          required: false,
        },
        nameServerSet: {
          name: "Name Server Set",
          description:
            "Optionally specifies the NameServerSet for this ManagedZone. A NameServerSet is a set of DNS name servers that all host the same ManagedZones. Most users leave this field unset. If you need to use this field, contact your account team.",
          type: {
            type: "string",
          },
          required: false,
        },
        peeringConfig: {
          name: "Peering Config",
          description:
            "The presence of this field indicates that DNS Peering is enabled for this zone. The value of this field contains the network to peer with.",
          type: {
            type: "object",
            properties: {
              targetNetwork: {
                type: "object",
                properties: {
                  deactivateTime: {
                    type: "string",
                  },
                  networkUrl: {
                    type: "string",
                  },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        forwardingConfig: {
          name: "Forwarding Config",
          description:
            "The presence for this field indicates that outbound forwarding is enabled for this zone. The value of this field contains the set of destinations to forward to.",
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
                    domainName: {
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
        if (input.event.inputConfig.privateVisibilityConfig !== undefined)
          body.privateVisibilityConfig =
            input.event.inputConfig.privateVisibilityConfig;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.dnssecConfig !== undefined)
          body.dnssecConfig = input.event.inputConfig.dnssecConfig;
        if (input.event.inputConfig.cloudLoggingConfig !== undefined)
          body.cloudLoggingConfig = input.event.inputConfig.cloudLoggingConfig;
        if (input.event.inputConfig.creationTime !== undefined)
          body.creationTime = input.event.inputConfig.creationTime;
        if (input.event.inputConfig.nameServers !== undefined)
          body.nameServers = input.event.inputConfig.nameServers;
        if (input.event.inputConfig.dnsName !== undefined)
          body.dnsName = input.event.inputConfig.dnsName;
        if (input.event.inputConfig.serviceDirectoryConfig !== undefined)
          body.serviceDirectoryConfig =
            input.event.inputConfig.serviceDirectoryConfig;
        if (input.event.inputConfig.visibility !== undefined)
          body.visibility = input.event.inputConfig.visibility;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.reverseLookupConfig !== undefined)
          body.reverseLookupConfig =
            input.event.inputConfig.reverseLookupConfig;
        if (input.event.inputConfig.nameServerSet !== undefined)
          body.nameServerSet = input.event.inputConfig.nameServerSet;
        if (input.event.inputConfig.peeringConfig !== undefined)
          body.peeringConfig = input.event.inputConfig.peeringConfig;
        if (input.event.inputConfig.forwardingConfig !== undefined)
          body.forwardingConfig = input.event.inputConfig.forwardingConfig;

        const result = await dnsFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate: "dns/v1/projects/{project}/managedZones",
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
          privateVisibilityConfig: {
            type: "object",
            properties: {
              gkeClusters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    gkeClusterName: {
                      type: "string",
                      description:
                        "The resource name of the cluster to bind this ManagedZone to. This should be specified in the format like: projects/*/locations/*/clusters/*. This is referenced from GKE projects.locations.clusters.get API: https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters/get",
                    },
                    kind: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "The list of Google Kubernetes Engine clusters that can see this zone.",
              },
              kind: {
                type: "string",
              },
              networks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    networkUrl: {
                      type: "string",
                      description:
                        "The fully qualified URL of the VPC network to bind to. Format this URL like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`",
                    },
                    kind: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
                description: "The list of VPC networks that can see this zone.",
              },
            },
            additionalProperties: true,
          },
          description: {
            type: "string",
            description:
              "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the managed zone's function.",
          },
          dnssecConfig: {
            type: "object",
            properties: {
              state: {
                type: "string",
                enum: ["off", "on", "transfer"],
                description:
                  "Specifies whether DNSSEC is enabled, and what mode it is in.",
              },
              defaultKeySpecs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                    },
                    keyType: {
                      type: "string",
                      enum: ["keySigning", "zoneSigning"],
                      description:
                        "Specifies whether this is a key signing key (KSK) or a zone signing key (ZSK). Key signing keys have the Secure Entry Point flag set and, when active, are only used to sign resource record sets of type DNSKEY. Zone signing keys do not have the Secure Entry Point flag set and are used to sign all other types of resource record sets.",
                    },
                    algorithm: {
                      type: "string",
                      enum: [
                        "rsasha1",
                        "rsasha256",
                        "rsasha512",
                        "ecdsap256sha256",
                        "ecdsap384sha384",
                      ],
                      description:
                        "String mnemonic specifying the DNSSEC algorithm of this key.",
                    },
                    keyLength: {
                      type: "integer",
                      description: "Length of the keys in bits.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Parameters for DnsKey key generation. Used for generating initial keys for a new ManagedZone and as default when adding a new DnsKey.",
                },
                description:
                  "Specifies parameters for generating initial DnsKeys for this ManagedZone. Can only be changed while the state is OFF.",
              },
              kind: {
                type: "string",
              },
              nonExistence: {
                type: "string",
                enum: ["nsec", "nsec3"],
                description:
                  "Specifies the mechanism for authenticated denial-of-existence responses. Can only be changed while the state is OFF.",
              },
            },
            additionalProperties: true,
          },
          cloudLoggingConfig: {
            type: "object",
            properties: {
              enableLogging: {
                type: "boolean",
                description:
                  "If set, enable query logging for this ManagedZone. False by default, making logging opt-in.",
              },
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
            description:
              "Cloud Logging configurations for publicly visible zones.",
          },
          creationTime: {
            type: "string",
            description:
              "The time that this resource was created on the server. This is in RFC3339 text format. Output only.",
          },
          nameServers: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Delegate your managed_zone to these virtual name servers; defined by the server (output only)",
          },
          dnsName: {
            type: "string",
            description:
              'The DNS name of this managed zone, for instance "example.com.".',
          },
          serviceDirectoryConfig: {
            type: "object",
            properties: {
              namespace: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                  },
                  namespaceUrl: {
                    type: "string",
                    description:
                      "The fully qualified URL of the namespace associated with the zone. Format must be `https://servicedirectory.googleapis.com/v1/projects/{project}/locations/{location}/namespaces/{namespace}`",
                  },
                  deletionTime: {
                    type: "string",
                    description:
                      "The time that the namespace backing this zone was deleted; an empty string if it still exists. This is in RFC3339 text format. Output only.",
                  },
                },
                additionalProperties: true,
              },
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
            description:
              "Contains information about Service Directory-backed zones.",
          },
          visibility: {
            type: "string",
            enum: ["public", "private"],
            description:
              "The zone's visibility: public zones are exposed to the Internet, while private zones are visible only to Virtual Private Cloud resources.",
          },
          name: {
            type: "string",
            description:
              "User assigned name for this resource. Must be unique within the project. The name must be 1-63 characters long, must begin with a letter, end with a letter or digit, and only contain lowercase letters, digits or dashes.",
          },
          id: {
            type: "string",
            description:
              "Unique identifier for the resource; defined by the server (output only)",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "User labels.",
          },
          reverseLookupConfig: {
            type: "object",
            properties: {
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
          },
          nameServerSet: {
            type: "string",
            description:
              "Optionally specifies the NameServerSet for this ManagedZone. A NameServerSet is a set of DNS name servers that all host the same ManagedZones. Most users leave this field unset. If you need to use this field, contact your account team.",
          },
          peeringConfig: {
            type: "object",
            properties: {
              targetNetwork: {
                type: "object",
                properties: {
                  deactivateTime: {
                    type: "string",
                    description:
                      "The time at which the zone was deactivated, in RFC 3339 date-time format. An empty string indicates that the peering connection is active. The producer network can deactivate a zone. The zone is automatically deactivated if the producer network that the zone targeted is deleted. Output only.",
                  },
                  kind: {
                    type: "string",
                  },
                  networkUrl: {
                    type: "string",
                    description:
                      "The fully qualified URL of the VPC network to forward queries to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`",
                  },
                },
                additionalProperties: true,
              },
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
          },
          forwardingConfig: {
            type: "object",
            properties: {
              targetNameServers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ipv4Address: {
                      type: "string",
                      description: "IPv4 address of a target name server.",
                    },
                    domainName: {
                      type: "string",
                      description:
                        "Fully qualified domain name for the forwarding target.",
                    },
                    kind: {
                      type: "string",
                    },
                    forwardingPath: {
                      type: "string",
                      enum: ["default", "private"],
                      description:
                        "Forwarding path for this NameServerTarget. If unset or set to DEFAULT, Cloud DNS makes forwarding decisions based on IP address ranges; that is, RFC1918 addresses go to the VPC network, non-RFC1918 addresses go to the internet. When set to PRIVATE, Cloud DNS always sends queries through the VPC network for this target.",
                    },
                    ipv6Address: {
                      type: "string",
                      description:
                        "IPv6 address of a target name server. Does not accept both fields (ipv4 & ipv6) being populated. Public preview as of November 2022.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "List of target name servers to forward to. Cloud DNS selects the best available name server if more than one target is given.",
              },
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
          },
        },
        additionalProperties: true,
        description:
          "A zone is a subtree of the DNS namespace under one administrative responsibility. A ManagedZone is a resource that represents a DNS zone hosted by the Cloud DNS service.",
      },
    },
  },
};

export default managedZonesCreate;
