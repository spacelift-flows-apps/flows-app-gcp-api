import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const managedZonesUpdate: AppBlock = {
  name: "Managed Zones - Update",
  description: `Updates an existing ManagedZone.`,
  category: "Managed Zones",
  inputs: {
    default: {
      config: {
        managedZone: {
          name: "Managed Zone",
          description:
            "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
          type: {
            type: "string",
          },
          required: true,
        },
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
        if (input.event.inputConfig.managedZone !== undefined)
          pathParams["managedZone"] = String(
            input.event.inputConfig.managedZone,
          );

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
          method: "PUT",
          pathTemplate: "dns/v1/projects/{project}/managedZones/{managedZone}",
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
          dnsKeyContext: {
            type: "object",
            properties: {
              newValue: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description:
                      "Unique identifier for the resource; defined by the server (output only).",
                  },
                  publicKey: {
                    type: "string",
                    description:
                      "Base64 encoded public half of this key. Output only.",
                  },
                  keyLength: {
                    type: "integer",
                    description:
                      "Length of the key in bits. Specified at creation time, and then immutable.",
                  },
                  kind: {
                    type: "string",
                  },
                  creationTime: {
                    type: "string",
                    description:
                      "The time that this resource was created in the control plane. This is in RFC3339 text format. Output only.",
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
                      "String mnemonic specifying the DNSSEC algorithm of this key. Immutable after creation time.",
                  },
                  description: {
                    type: "string",
                    description:
                      "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the resource's function.",
                  },
                  digests: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        digest: {
                          type: "object",
                          additionalProperties: true,
                        },
                        type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                    },
                    description:
                      "Cryptographic hashes of the DNSKEY resource record associated with this DnsKey. These digests are needed to construct a DS record that points at this DNS key. Output only.",
                  },
                  keyTag: {
                    type: "integer",
                    description:
                      "The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone's DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only.",
                  },
                  isActive: {
                    type: "boolean",
                    description:
                      "Active keys are used to sign subsequent changes to the ManagedZone. Inactive keys are still present as DNSKEY Resource Records for the use of resolvers validating existing signatures.",
                  },
                  type: {
                    type: "string",
                    enum: ["keySigning", "zoneSigning"],
                    description:
                      'One of "KEY_SIGNING" or "ZONE_SIGNING". Keys of type KEY_SIGNING have the Secure Entry Point flag set and, when active, are used to sign only resource record sets of type DNSKEY. Otherwise, the Secure Entry Point flag is cleared, and this key is used to sign only resource record sets of other types. Immutable after creation time.',
                  },
                },
                additionalProperties: true,
                description: "A DNSSEC key pair.",
              },
              oldValue: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description:
                      "Unique identifier for the resource; defined by the server (output only).",
                  },
                  publicKey: {
                    type: "string",
                    description:
                      "Base64 encoded public half of this key. Output only.",
                  },
                  keyLength: {
                    type: "integer",
                    description:
                      "Length of the key in bits. Specified at creation time, and then immutable.",
                  },
                  kind: {
                    type: "string",
                  },
                  creationTime: {
                    type: "string",
                    description:
                      "The time that this resource was created in the control plane. This is in RFC3339 text format. Output only.",
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
                      "String mnemonic specifying the DNSSEC algorithm of this key. Immutable after creation time.",
                  },
                  description: {
                    type: "string",
                    description:
                      "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the resource's function.",
                  },
                  digests: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        digest: {
                          type: "object",
                          additionalProperties: true,
                        },
                        type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                    },
                    description:
                      "Cryptographic hashes of the DNSKEY resource record associated with this DnsKey. These digests are needed to construct a DS record that points at this DNS key. Output only.",
                  },
                  keyTag: {
                    type: "integer",
                    description:
                      "The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone's DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only.",
                  },
                  isActive: {
                    type: "boolean",
                    description:
                      "Active keys are used to sign subsequent changes to the ManagedZone. Inactive keys are still present as DNSKEY Resource Records for the use of resolvers validating existing signatures.",
                  },
                  type: {
                    type: "string",
                    enum: ["keySigning", "zoneSigning"],
                    description:
                      'One of "KEY_SIGNING" or "ZONE_SIGNING". Keys of type KEY_SIGNING have the Secure Entry Point flag set and, when active, are used to sign only resource record sets of type DNSKEY. Otherwise, the Secure Entry Point flag is cleared, and this key is used to sign only resource record sets of other types. Immutable after creation time.',
                  },
                },
                additionalProperties: true,
                description: "A DNSSEC key pair.",
              },
            },
            additionalProperties: true,
          },
          zoneContext: {
            type: "object",
            properties: {
              oldValue: {
                type: "object",
                properties: {
                  privateVisibilityConfig: {
                    type: "object",
                    properties: {
                      gkeClusters: {
                        type: "array",
                        items: {
                          type: "object",
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
                          additionalProperties: true,
                        },
                        description:
                          "The list of VPC networks that can see this zone.",
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
                          additionalProperties: true,
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
              newValue: {
                type: "object",
                properties: {
                  privateVisibilityConfig: {
                    type: "object",
                    properties: {
                      gkeClusters: {
                        type: "array",
                        items: {
                          type: "object",
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
                          additionalProperties: true,
                        },
                        description:
                          "The list of VPC networks that can see this zone.",
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
                          additionalProperties: true,
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
            additionalProperties: true,
          },
          kind: {
            type: "string",
          },
          startTime: {
            type: "string",
            description:
              "The time that this operation was started by the server. This is in RFC3339 text format (output only).",
          },
          type: {
            type: "string",
            description:
              "Type of the operation. Operations include insert, update, and delete (output only).",
          },
          id: {
            type: "string",
            description:
              "Unique identifier for the resource. This is the client_operation_id if the client specified it when the mutation was initiated, otherwise, it is generated by the server. The name must be 1-63 characters long and match the regular expression [-a-z0-9]? (output only)",
          },
          user: {
            type: "string",
            description:
              "User who requested the operation, for example: user@example.com. cloud-dns-system for operations automatically done by the system. (output only)",
          },
          status: {
            type: "string",
            enum: ["pending", "done"],
            description:
              'Status of the operation. Can be one of the following: "PENDING" or "DONE" (output only). A status of "DONE" means that the request to update the authoritative servers has been sent, but the servers might not be updated yet.',
          },
        },
        additionalProperties: true,
        description:
          "An operation represents a successful mutation performed on a Cloud DNS resource. Operations provide: - An audit log of server resource mutations. - A way to recover/retry API calls in the case where the response is never received by the caller. Use the caller specified client_operation_id.",
      },
    },
  },
};

export default managedZonesUpdate;
