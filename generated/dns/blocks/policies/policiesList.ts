import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

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
        let path = `dns/v1/projects/{project}/policies`;

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
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
                          type: "string",
                        },
                        allQueries: {
                          type: "boolean",
                          description:
                            "Controls whether DNS64 is enabled globally for all networks bound to the policy.",
                        },
                      },
                      additionalProperties: true,
                    },
                    kind: {
                      type: "string",
                    },
                  },
                  description: "DNS64 policies",
                  additionalProperties: true,
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
                        properties: {
                          kind: {
                            type: "string",
                          },
                          ipv4Address: {
                            type: "string",
                            description: "IPv4 address to forward queries to.",
                          },
                          forwardingPath: {
                            type: "string",
                            enum: ["default", "private"],
                            description:
                              "Forwarding path for this TargetNameServer. If unset or set to DEFAULT, Cloud DNS makes forwarding decisions based on address ranges; that is, RFC1918 addresses go to the VPC network, non-RFC1918 addresses go to the internet. When set to PRIVATE, Cloud DNS always sends queries through the VPC network for this target.",
                          },
                          ipv6Address: {
                            type: "string",
                            description:
                              "IPv6 address to forward to. Does not accept both fields (ipv4 & ipv6) being populated. Public preview as of November 2022.",
                          },
                        },
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
                    "Unique identifier for the resource; defined by the server (output only). (Format: uint64)",
                },
                enableLogging: {
                  type: "boolean",
                  description:
                    "Controls whether logging is enabled for the networks bound to this policy. Defaults to no logging if not set.",
                },
              },
              description:
                "A policy is a collection of DNS rules applied to one or more Virtual Private Cloud resources.",
              additionalProperties: true,
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
