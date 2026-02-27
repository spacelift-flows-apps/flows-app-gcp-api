import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

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
              "https://www.googleapis.com/auth/cloud-platform.read-only",
              "https://www.googleapis.com/auth/ndev.clouddns.readonly",
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
        let path = `dns/v1/projects/{project}/responsePolicies`;

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
                    "Unique identifier for the resource; defined by the server (output only). (Format: int64)",
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
              description:
                "A Response Policy is a collection of selectors that apply to queries made against one or more Virtual Private Cloud networks.",
              additionalProperties: true,
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
