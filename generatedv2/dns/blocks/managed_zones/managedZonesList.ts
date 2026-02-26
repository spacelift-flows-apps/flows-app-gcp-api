import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const managedZonesList: AppBlock = {
  name: "Managed Zones - List",
  description: `Enumerates ManagedZones that have been created but not yet deleted.`,
  category: "Managed Zones",
  inputs: {
    default: {
      config: {
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.",
          type: {
            type: "string",
          },
          required: false,
        },
        dnsName: {
          name: "Dns Name",
          description:
            "Restricts the list to return only zones with this domain name.",
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.",
          type: {
            type: "integer",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.dnsName !== undefined)
          queryParams["dnsName"] = String(input.event.inputConfig.dnsName);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "dns/v1/projects/{project}/managedZones",
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
          managedZones: {
            type: "array",
            items: {
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
                      properties: {
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        namespaceUrl: {
                          type: "object",
                          additionalProperties: true,
                        },
                        deletionTime: {
                          type: "object",
                          additionalProperties: true,
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
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        networkUrl: {
                          type: "object",
                          additionalProperties: true,
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
            description: "The managed zone resources.",
          },
          kind: {
            type: "string",
            description: "Type of resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "This field indicates that more results are available beyond the last page displayed. To fetch the results, make another list request and use this value as your page token. This lets you retrieve the complete contents of a very large collection one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You can't retrieve a consistent snapshot of a collection larger than the maximum page size.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default managedZonesList;
