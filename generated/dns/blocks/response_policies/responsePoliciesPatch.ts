import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePoliciesPatch: AppBlock = {
  name: "Response Policies - Patch",
  description: `Applies a partial update to an existing Response Policy.`,
  category: "Response Policies",
  inputs: {
    default: {
      config: {
        responsePolicy: {
          name: "Response Policy",
          description:
            "User assigned name of the response policy addressed by this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        gkeClusters: {
          name: "Gke Clusters",
          description:
            "The list of Google Kubernetes Engine clusters to which this response policy is applied.",
          type: {
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
          required: false,
        },
        responsePolicyName: {
          name: "Response Policy Name",
          description: "User assigned name for this Response Policy.",
          type: {
            type: "string",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Unique identifier for the resource; defined by the server (output only).",
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
                },
              },
              additionalProperties: true,
            },
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "User-provided description for this Response Policy.",
          type: {
            type: "string",
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
        if (input.event.inputConfig.responsePolicy !== undefined)
          pathParams["responsePolicy"] = String(
            input.event.inputConfig.responsePolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );
        const body: Record<string, any> = {};
        if (input.event.inputConfig.gkeClusters !== undefined)
          body.gkeClusters = input.event.inputConfig.gkeClusters;
        if (input.event.inputConfig.responsePolicyName !== undefined)
          body.responsePolicyName = input.event.inputConfig.responsePolicyName;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.networks !== undefined)
          body.networks = input.event.inputConfig.networks;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;

        const result = await dnsFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}",
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
          responsePolicy: {
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
        },
        additionalProperties: true,
      },
    },
  },
};

export default responsePoliciesPatch;
