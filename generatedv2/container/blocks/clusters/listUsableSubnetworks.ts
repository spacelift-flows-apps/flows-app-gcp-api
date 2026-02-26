import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const listUsableSubnetworks: AppBlock = {
  name: "List Usable Subnetworks",
  description: `Lists subnetworks that are usable for creating clusters in a project.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The parent project where subnetworks are usable. Specified in the format `projects/*`.",
          type: {
            type: "string",
            description:
              "The parent project where subnetworks are usable. Specified in the format `projects/*`.",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'Filtering currently only supports equality on the networkProjectId and must be in the form: "networkProjectId=[PROJECTID]", where `networkProjectId` is the project which owns the listed subnetworks. This defaults to the parent project ID.',
          type: {
            type: "string",
            description:
              'Filtering currently only supports equality on the networkProjectId and must be in the form: "networkProjectId=[PROJECTID]", where `networkProjectId` is the project which owns the listed subnetworks. This defaults to the parent project ID.',
          },
          required: false,
        },
        page_size: {
          name: "Page Size",
          description:
            "The max number of results per page that should be returned. If the number of available results is larger than `page_size`, a `next_page_token` is returned which can be used to get the next page of results in subsequent requests. Acceptable values are 0 to 500, inclusive. (Default: 500)",
          type: {
            type: "integer",
            description:
              "The max number of results per page that should be returned. If the number of available results is larger than `page_size`, a `next_page_token` is returned which can be used to get the next page of results in subsequent requests. Acceptable values are 0 to 500, inclusive. (Default: 500)",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set this to the nextPageToken returned by previous list requests to get the next page of results.",
          type: {
            type: "string",
            description:
              "Specifies a page token to use. Set this to the nextPageToken returned by previous list requests to get the next page of results.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;

        const result = await new Promise<any>((resolve, reject) => {
          client.listUsableSubnetworks(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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
          subnetworks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                subnetwork: {
                  type: "string",
                  description:
                    "Subnetwork Name. Example: projects/my-project/regions/us-central1/subnetworks/my-subnet",
                },
                network: {
                  type: "string",
                  description:
                    "Network Name. Example: projects/my-project/global/networks/my-network",
                },
                ip_cidr_range: {
                  type: "string",
                  description:
                    "The range of internal addresses that are owned by this subnetwork.",
                },
                secondary_ip_ranges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      range_name: {
                        type: "string",
                        description:
                          "The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance.",
                      },
                      ip_cidr_range: {
                        type: "string",
                        description:
                          "The range of IP addresses belonging to this subnetwork secondary range.",
                      },
                      status: {
                        type: "string",
                        enum: [
                          "UNKNOWN",
                          "UNUSED",
                          "IN_USE_SERVICE",
                          "IN_USE_SHAREABLE_POD",
                          "IN_USE_MANAGED_POD",
                        ],
                        description:
                          "This field is to determine the status of the secondary range programmably.",
                      },
                    },
                    description: "Secondary IP range of a usable subnetwork.",
                    additionalProperties: true,
                  },
                  description: "Secondary IP ranges.",
                },
                status_message: {
                  type: "string",
                  description:
                    "A human readable status message representing the reasons for cases where the caller cannot use the secondary ranges under the subnet. For example if the secondary_ip_ranges is empty due to a permission issue, an insufficient permission message will be given by status_message.",
                },
              },
              description:
                "UsableSubnetwork resource returns the subnetwork name, its associated network and the primary CIDR range.",
              additionalProperties: true,
            },
            description:
              "A list of usable subnetworks in the specified network project.",
          },
          next_page_token: {
            type: "string",
            description:
              "This token allows you to get the next page of results for list requests. If the number of results is larger than `page_size`, use the `next_page_token` as a value for the query parameter `page_token` in the next request. The value will become empty when there are no more pages.",
          },
        },
        description:
          "ListUsableSubnetworksResponse is the response of ListUsableSubnetworksRequest.",
        additionalProperties: true,
      },
    },
  },
};

export default listUsableSubnetworks;
