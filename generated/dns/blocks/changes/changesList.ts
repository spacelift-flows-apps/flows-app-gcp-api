import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const changesList: AppBlock = {
  name: "Changes - List",
  description: `Enumerates Changes to a ResourceRecordSet collection.`,
  category: "Changes",
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
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.",
          type: {
            type: "string",
          },
          required: false,
        },
        sortOrder: {
          name: "Sort Order",
          description: "Sorting order direction: 'ascending' or 'descending'.",
          type: {
            type: "string",
          },
          required: false,
        },
        sortBy: {
          name: "Sort By",
          description:
            "Sorting criterion. The only supported value is change sequence.",
          type: {
            type: "string",
            enum: ["changeSequence"],
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
        if (input.event.inputConfig.managedZone !== undefined)
          pathParams["managedZone"] = String(
            input.event.inputConfig.managedZone,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.sortOrder !== undefined)
          queryParams["sortOrder"] = String(input.event.inputConfig.sortOrder);
        if (input.event.inputConfig.sortBy !== undefined)
          queryParams["sortBy"] = String(input.event.inputConfig.sortBy);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "dns/v1/projects/{project}/managedZones/{managedZone}/changes",
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
          changes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                },
                id: {
                  type: "string",
                  description:
                    "Unique identifier for the resource; defined by the server (output only).",
                },
                status: {
                  type: "string",
                  enum: ["pending", "done"],
                  description:
                    'Status of the operation (output only). A status of "done" means that the request to update the authoritative servers has been sent, but the servers might not be updated yet.',
                },
                additions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      rrdatas: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description:
                          "As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see examples.",
                      },
                      name: {
                        type: "string",
                        description: "For example, www.example.com.",
                      },
                      ttl: {
                        type: "integer",
                        description:
                          "Number of seconds that this `ResourceRecordSet` can be cached by resolvers.",
                      },
                      signatureRrdatas: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description: "As defined in RFC 4034 (section 3.2).",
                      },
                      routingPolicy: {
                        type: "object",
                        additionalProperties: true,
                      },
                      type: {
                        type: "string",
                        description:
                          "The identifier of a supported record type. See the list of Supported DNS record types.",
                      },
                      kind: {
                        type: "string",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "A unit of data that is returned by the DNS servers.",
                  },
                  description: "Which ResourceRecordSets to add?",
                },
                startTime: {
                  type: "string",
                  description:
                    "The time that this operation was started by the server (output only). This is in RFC3339 text format.",
                },
                isServing: {
                  type: "boolean",
                  description:
                    "If the DNS queries for the zone will be served.",
                },
                deletions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      rrdatas: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description:
                          "As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see examples.",
                      },
                      name: {
                        type: "string",
                        description: "For example, www.example.com.",
                      },
                      ttl: {
                        type: "integer",
                        description:
                          "Number of seconds that this `ResourceRecordSet` can be cached by resolvers.",
                      },
                      signatureRrdatas: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                        description: "As defined in RFC 4034 (section 3.2).",
                      },
                      routingPolicy: {
                        type: "object",
                        additionalProperties: true,
                      },
                      type: {
                        type: "string",
                        description:
                          "The identifier of a supported record type. See the list of Supported DNS record types.",
                      },
                      kind: {
                        type: "string",
                      },
                    },
                    additionalProperties: true,
                    description:
                      "A unit of data that is returned by the DNS servers.",
                  },
                  description:
                    "Which ResourceRecordSets to remove? Must match existing data exactly.",
                },
              },
              additionalProperties: true,
              description:
                "A Change represents a set of `ResourceRecordSet` additions and deletions applied atomically to a ManagedZone. ResourceRecordSets within a ManagedZone are modified by creating a new Change element in the Changes collection. In turn the Changes collection also records the past modifications to the `ResourceRecordSets` in a `ManagedZone`. The current state of the `ManagedZone` is the sum effect of applying all `Change` elements in the `Changes` collection in sequence.",
            },
            description: "The requested changes.",
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
        description:
          "The response to a request to enumerate Changes to a ResourceRecordSets collection.",
      },
    },
  },
};

export default changesList;
