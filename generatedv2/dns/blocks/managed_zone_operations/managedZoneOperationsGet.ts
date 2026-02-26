import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const managedZoneOperationsGet: AppBlock = {
  name: "Managed Zone Operations - Get",
  description: `Fetches the representation of an existing Operation.`,
  category: "Managed Zone Operations",
  inputs: {
    default: {
      config: {
        managedZone: {
          name: "Managed Zone",
          description: "Identifies the managed zone addressed by this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        operation: {
          name: "Operation",
          description:
            "Identifies the operation addressed by this request (ID of the operation).",
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
        if (input.event.inputConfig.managedZone !== undefined)
          pathParams["managedZone"] = String(
            input.event.inputConfig.managedZone,
          );
        if (input.event.inputConfig.operation !== undefined)
          pathParams["operation"] = String(input.event.inputConfig.operation);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "dns/v1/projects/{project}/managedZones/{managedZone}/operations/{operation}",
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

export default managedZoneOperationsGet;
