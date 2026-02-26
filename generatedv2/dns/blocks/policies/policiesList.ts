import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const policiesList: AppBlock = {
  name: "Policies - List",
  description: `Enumerates all policies associated with a project.`,
  category: "Policies",
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
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "dns/v1/projects/{project}/policies",
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
          kind: {
            type: "string",
            description: "Type of resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "This field indicates that more results are available beyond the last page displayed. To fetch the results, make another list request and use this value as your page token. This lets you retrieve the complete contents of a very large collection one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You can't retrieve a consistent snapshot of a collection larger than the maximum page size.",
          },
          policies: {
            type: "array",
            items: {
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
                          type: "object",
                          additionalProperties: true,
                        },
                        allQueries: {
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
            description: "The policy resources.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default policiesList;
