import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePoliciesList: AppBlock = {
  name: "Response Policies - List",
  description: `Enumerates all Response Policies associated with a project.`,
  category: "Response Policies",
  inputs: {
    default: {
      config: {
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

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "dns/v1/projects/{project}/responsePolicies",
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
          nextPageToken: {
            type: "string",
            description:
              "This field indicates that more results are available beyond the last page displayed. To fetch the results, make another list request and use this value as your page token. This lets you retrieve the complete contents of a very large collection one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You can't retrieve a consistent snapshot of a collection larger than the maximum page size.",
          },
          responsePolicies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                gkeClusters: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                      },
                      gkeClusterName: {
                        type: "string",
                        description:
                          "The resource name of the cluster to bind this response policy to. This should be specified in the format like: projects/*/locations/*/clusters/*. This is referenced from GKE projects.locations.clusters.get API: https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters/get",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "The list of Google Kubernetes Engine clusters to which this response policy is applied.",
                },
                responsePolicyName: {
                  type: "string",
                  description: "User assigned name for this Response Policy.",
                },
                id: {
                  type: "string",
                  description:
                    "Unique identifier for the resource; defined by the server (output only).",
                },
                kind: {
                  type: "string",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description: "User labels.",
                },
                networks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                      },
                      networkUrl: {
                        type: "string",
                        description:
                          "The fully qualified URL of the VPC network to bind to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "List of network names specifying networks to which this policy is applied.",
                },
                description: {
                  type: "string",
                  description:
                    "User-provided description for this Response Policy.",
                },
              },
              additionalProperties: true,
              description:
                "A Response Policy is a collection of selectors that apply to queries made against one or more Virtual Private Cloud networks.",
            },
            description: "The Response Policy resources.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default responsePoliciesList;
