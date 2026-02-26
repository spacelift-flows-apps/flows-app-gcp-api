import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const responsePoliciesGet: AppBlock = {
  name: "Response Policies - Get",
  description: `Fetches the representation of an existing Response Policy.`,
  category: "Response Policies",
  inputs: {
    default: {
      config: {
        responsePolicy: {
          name: "Response Policy",
          description:
            "User assigned name of the Response Policy addressed by this request.",
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
        if (input.event.inputConfig.responsePolicy !== undefined)
          pathParams["responsePolicy"] = String(
            input.event.inputConfig.responsePolicy,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "dns/v1/projects/{project}/responsePolicies/{responsePolicy}",
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
            description: "User-provided description for this Response Policy.",
          },
        },
        additionalProperties: true,
        description:
          "A Response Policy is a collection of selectors that apply to queries made against one or more Virtual Private Cloud networks.",
      },
    },
  },
};

export default responsePoliciesGet;
