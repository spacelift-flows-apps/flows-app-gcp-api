import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const usableSubnetworksList: AppBlock = {
  name: "Usable Subnetworks - List",
  description: `Lists subnetworks that are usable for creating clusters in a project.`,
  category: "Usable Subnetworks",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The parent project where subnetworks are usable. Specified in the format `projects/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'Filtering currently only supports equality on the networkProjectId and must be in the form: "networkProjectId=[PROJECTID]", where `networkProjectId` is the project which owns the listed subnetworks. This defaults to the parent project ID.',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set this to the nextPageToken returned by previous list requests to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "The max number of results per page that should be returned. If the number of available results is larger than `page_size`, a `next_page_token` is returned which can be used to get the next page of results in subsequent requests. Acceptable values are 0 to 500, inclusive. (Default: 500)",
          type: {
            type: "integer",
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
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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
        const baseUrl = "https://container.googleapis.com/";
        let path = `v1/{+parent}/aggregated/usableSubnetworks`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

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
          subnetworks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ipCidrRange: {
                  type: "string",
                  description:
                    "The range of internal addresses that are owned by this subnetwork.",
                },
                statusMessage: {
                  type: "string",
                  description:
                    "A human readable status message representing the reasons for cases where the caller cannot use the secondary ranges under the subnet. For example if the secondary_ip_ranges is empty due to a permission issue, an insufficient permission message will be given by status_message.",
                },
                network: {
                  type: "string",
                  description:
                    "Network Name. Example: projects/my-project/global/networks/my-network",
                },
                secondaryIpRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
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
                      rangeName: {
                        type: "string",
                        description:
                          "The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance.",
                      },
                      ipCidrRange: {
                        type: "string",
                        description:
                          "The range of IP addresses belonging to this subnetwork secondary range.",
                      },
                    },
                    description: "Secondary IP range of a usable subnetwork.",
                    additionalProperties: true,
                  },
                  description: "Secondary IP ranges.",
                },
                subnetwork: {
                  type: "string",
                  description:
                    "Subnetwork Name. Example: projects/my-project/regions/us-central1/subnetworks/my-subnet",
                },
              },
              description:
                "UsableSubnetwork resource returns the subnetwork name, its associated network and the primary CIDR range.",
              additionalProperties: true,
            },
            description:
              "A list of usable subnetworks in the specified network project.",
          },
          nextPageToken: {
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

export default usableSubnetworksList;
