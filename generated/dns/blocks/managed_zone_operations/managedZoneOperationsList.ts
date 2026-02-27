import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const managedZoneOperationsList: AppBlock = {
  name: "Managed Zone Operations - List",
  description: `Enumerates Operations for the given ManagedZone.`,
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
        sortBy: {
          name: "Sort By",
          description:
            "Sorting criterion. The only supported values are START_TIME and ID.",
          type: {
            type: "string",
            enum: ["startTime", "id"],
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
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.",
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
        if (input.event.inputConfig.sortBy !== undefined)
          queryParams["sortBy"] = String(input.event.inputConfig.sortBy);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "dns/v1/projects/{project}/managedZones/{managedZone}/operations",
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
          operations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                dnsKeyContext: {
                  type: "object",
                  properties: {
                    newValue: {
                      type: "object",
                      properties: {
                        id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        publicKey: {
                          type: "object",
                          additionalProperties: true,
                        },
                        keyLength: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        creationTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        algorithm: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description: {
                          type: "object",
                          additionalProperties: true,
                        },
                        digests: {
                          type: "object",
                          additionalProperties: true,
                        },
                        keyTag: {
                          type: "object",
                          additionalProperties: true,
                        },
                        isActive: {
                          type: "object",
                          additionalProperties: true,
                        },
                        type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: true,
                      description: "A DNSSEC key pair.",
                    },
                    oldValue: {
                      type: "object",
                      properties: {
                        id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        publicKey: {
                          type: "object",
                          additionalProperties: true,
                        },
                        keyLength: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
                        },
                        creationTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        algorithm: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description: {
                          type: "object",
                          additionalProperties: true,
                        },
                        digests: {
                          type: "object",
                          additionalProperties: true,
                        },
                        keyTag: {
                          type: "object",
                          additionalProperties: true,
                        },
                        isActive: {
                          type: "object",
                          additionalProperties: true,
                        },
                        type: {
                          type: "object",
                          additionalProperties: true,
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
                          additionalProperties: true,
                        },
                        description: {
                          type: "object",
                          additionalProperties: true,
                        },
                        dnssecConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        cloudLoggingConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        creationTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        nameServers: {
                          type: "object",
                          additionalProperties: true,
                        },
                        dnsName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        serviceDirectoryConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        visibility: {
                          type: "object",
                          additionalProperties: true,
                        },
                        name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        labels: {
                          type: "object",
                          additionalProperties: true,
                        },
                        reverseLookupConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        nameServerSet: {
                          type: "object",
                          additionalProperties: true,
                        },
                        peeringConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        forwardingConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
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
                          additionalProperties: true,
                        },
                        description: {
                          type: "object",
                          additionalProperties: true,
                        },
                        dnssecConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        cloudLoggingConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        creationTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        nameServers: {
                          type: "object",
                          additionalProperties: true,
                        },
                        dnsName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        serviceDirectoryConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        visibility: {
                          type: "object",
                          additionalProperties: true,
                        },
                        name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        labels: {
                          type: "object",
                          additionalProperties: true,
                        },
                        reverseLookupConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        nameServerSet: {
                          type: "object",
                          additionalProperties: true,
                        },
                        peeringConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        forwardingConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        kind: {
                          type: "object",
                          additionalProperties: true,
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
            description: "The operation resources.",
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

export default managedZoneOperationsList;
