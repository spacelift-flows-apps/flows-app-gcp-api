import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

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
        clientOperationId: {
          name: "Client Operation ID",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
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
          required: false,
        },
        description: {
          name: "Description",
          description:
            "A mutable string of at most 1024 characters associated with this resource for the user's convenience.",
          type: {
            type: "string",
            description:
              "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the managed zone's function.",
          },
          required: false,
        },
        dnssecConfig: {
          name: "DNSSEC Config",
          description: "DNSSEC configuration.",
          type: {
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
                      description:
                        "Length of the keys in bits. (Format: uint32)",
                    },
                  },
                  description:
                    "Parameters for DnsKey key generation. Used for generating initial keys for a new ManagedZone and as default when adding a new DnsKey.",
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
          required: false,
        },
        cloudLoggingConfig: {
          name: "Cloud Logging Config",
          description: "Request body field: cloudLoggingConfig",
          type: {
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
            description:
              "Cloud Logging configurations for publicly visible zones.",
            additionalProperties: true,
          },
          required: false,
        },
        creationTime: {
          name: "Creation Time",
          description: "The time that this resource was created on the server.",
          type: {
            type: "string",
            description:
              "The time that this resource was created on the server. This is in RFC3339 text format. Output only.",
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
            description:
              "Delegate your managed_zone to these virtual name servers; defined by the server (output only)",
          },
          required: false,
        },
        dnsName: {
          name: "DNS Name",
          description:
            'The DNS name of this managed zone, for instance "example.',
          type: {
            type: "string",
            description:
              'The DNS name of this managed zone, for instance "example.com.".',
          },
          required: false,
        },
        serviceDirectoryConfig: {
          name: "Service Directory Config",
          description:
            "This field links to the associated service directory namespace.",
          type: {
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
            description:
              "Contains information about Service Directory-backed zones.",
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
            description:
              "The zone's visibility: public zones are exposed to the Internet, while private zones are visible only to Virtual Private Cloud resources.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "User assigned name for this resource.",
          type: {
            type: "string",
            description:
              "User assigned name for this resource. Must be unique within the project. The name must be 1-63 characters long, must begin with a letter, end with a letter or digit, and only contain lowercase letters, digits or dashes.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "Unique identifier for the resource; defined by the server (output only)",
          type: {
            type: "string",
            description:
              "Unique identifier for the resource; defined by the server (output only) (Format: uint64)",
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
            description: "User labels.",
          },
          required: false,
        },
        reverseLookupConfig: {
          name: "Reverse Lookup Config",
          description:
            "The presence of this field indicates that this is a managed reverse lookup zone and Cloud DNS resolves reverse lookup queries using automatically configured records for VPC resources.",
          type: {
            type: "object",
            properties: {
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        nameServerSet: {
          name: "Name Server Set",
          description:
            "Optionally specifies the NameServerSet for this ManagedZone.",
          type: {
            type: "string",
            description:
              "Optionally specifies the NameServerSet for this ManagedZone. A NameServerSet is a set of DNS name servers that all host the same ManagedZones. Most users leave this field unset. If you need to use this field, contact your account team.",
          },
          required: false,
        },
        peeringConfig: {
          name: "Peering Config",
          description:
            "The presence of this field indicates that DNS Peering is enabled for this zone.",
          type: {
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
          required: false,
        },
        forwardingConfig: {
          name: "Forwarding Config",
          description:
            "The presence for this field indicates that outbound forwarding is enabled for this zone.",
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
        let path = `dns/v1/projects/{project}/managedZones/{managedZone}`;

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

        if (input.event.inputConfig.privateVisibilityConfig !== undefined)
          requestBody.privateVisibilityConfig =
            input.event.inputConfig.privateVisibilityConfig;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.dnssecConfig !== undefined)
          requestBody.dnssecConfig = input.event.inputConfig.dnssecConfig;
        if (input.event.inputConfig.cloudLoggingConfig !== undefined)
          requestBody.cloudLoggingConfig =
            input.event.inputConfig.cloudLoggingConfig;
        if (input.event.inputConfig.creationTime !== undefined)
          requestBody.creationTime = input.event.inputConfig.creationTime;
        if (input.event.inputConfig.nameServers !== undefined)
          requestBody.nameServers = input.event.inputConfig.nameServers;
        if (input.event.inputConfig.dnsName !== undefined)
          requestBody.dnsName = input.event.inputConfig.dnsName;
        if (input.event.inputConfig.serviceDirectoryConfig !== undefined)
          requestBody.serviceDirectoryConfig =
            input.event.inputConfig.serviceDirectoryConfig;
        if (input.event.inputConfig.visibility !== undefined)
          requestBody.visibility = input.event.inputConfig.visibility;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.reverseLookupConfig !== undefined)
          requestBody.reverseLookupConfig =
            input.event.inputConfig.reverseLookupConfig;
        if (input.event.inputConfig.nameServerSet !== undefined)
          requestBody.nameServerSet = input.event.inputConfig.nameServerSet;
        if (input.event.inputConfig.peeringConfig !== undefined)
          requestBody.peeringConfig = input.event.inputConfig.peeringConfig;
        if (input.event.inputConfig.forwardingConfig !== undefined)
          requestBody.forwardingConfig =
            input.event.inputConfig.forwardingConfig;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;

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
                      "Length of the key in bits. Specified at creation time, and then immutable. (Format: uint32)",
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
                          type: "string",
                          description:
                            "The base-16 encoded bytes of this digest. Suitable for use in a DS resource record.",
                        },
                        type: {
                          type: "string",
                          enum: ["sha1", "sha256", "sha384"],
                          description:
                            "Specifies the algorithm used to calculate this digest.",
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
                      "The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone's DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only. (Format: int32)",
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
                description: "A DNSSEC key pair.",
                additionalProperties: true,
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
                      "Length of the key in bits. Specified at creation time, and then immutable. (Format: uint32)",
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
                          type: "string",
                          description:
                            "The base-16 encoded bytes of this digest. Suitable for use in a DS resource record.",
                        },
                        type: {
                          type: "string",
                          enum: ["sha1", "sha256", "sha384"],
                          description:
                            "Specifies the algorithm used to calculate this digest.",
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
                      "The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone's DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only. (Format: int32)",
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
                description: "A DNSSEC key pair.",
                additionalProperties: true,
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
                              description:
                                "Length of the keys in bits. (Format: uint32)",
                            },
                          },
                          description:
                            "Parameters for DnsKey key generation. Used for generating initial keys for a new ManagedZone and as default when adding a new DnsKey.",
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
                    description:
                      "Cloud Logging configurations for publicly visible zones.",
                    additionalProperties: true,
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
                    description:
                      "Contains information about Service Directory-backed zones.",
                    additionalProperties: true,
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
                      "Unique identifier for the resource; defined by the server (output only) (Format: uint64)",
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
                              description:
                                "IPv4 address of a target name server.",
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
                description:
                  "A zone is a subtree of the DNS namespace under one administrative responsibility. A ManagedZone is a resource that represents a DNS zone hosted by the Cloud DNS service.",
                additionalProperties: true,
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
                              description:
                                "Length of the keys in bits. (Format: uint32)",
                            },
                          },
                          description:
                            "Parameters for DnsKey key generation. Used for generating initial keys for a new ManagedZone and as default when adding a new DnsKey.",
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
                    description:
                      "Cloud Logging configurations for publicly visible zones.",
                    additionalProperties: true,
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
                    description:
                      "Contains information about Service Directory-backed zones.",
                    additionalProperties: true,
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
                      "Unique identifier for the resource; defined by the server (output only) (Format: uint64)",
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
                              description:
                                "IPv4 address of a target name server.",
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
                description:
                  "A zone is a subtree of the DNS namespace under one administrative responsibility. A ManagedZone is a resource that represents a DNS zone hosted by the Cloud DNS service.",
                additionalProperties: true,
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
        description:
          "An operation represents a successful mutation performed on a Cloud DNS resource. Operations provide: - An audit log of server resource mutations. - A way to recover/retry API calls in the case where the response is never received by the caller. Use the caller specified client_operation_id.",
        additionalProperties: true,
      },
    },
  },
};

export default managedZonesUpdate;
