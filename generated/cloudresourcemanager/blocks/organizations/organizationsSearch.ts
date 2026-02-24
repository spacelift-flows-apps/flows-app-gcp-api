import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const organizationsSearch: AppBlock = {
  name: "Organizations - Search",
  description: `Searches organization resources that are visible to the user and satisfy the specified filter.`,
  category: "Organizations",
  inputs: {
    default: {
      config: {
        query: {
          name: "Query",
          description:
            "Optional. An optional query string used to filter the Organizations to return in the response. Query rules are case-insensitive. ``` | Field | Description | |------------------|--------------------------------------------| | directoryCustomerId, owner.directoryCustomerId | Filters by directory customer id. | | domain | Filters by domain. | ``` Organizations may be queried by `directoryCustomerId` or by `domain`, where the domain is a G Suite domain, for example: * Query `directorycustomerid:123456789` returns Organization resources with `owner.directory_customer_id` equal to `123456789`. * Query `domain:google.com` returns Organization resources corresponding to the domain `google.com`.",
          type: {
            type: "string",
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of organizations to return in the response. The server can return fewer organizations than requested. If unspecified, server picks an appropriate default.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `SearchOrganizations` that indicates from where listing should continue.",
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
        const baseUrl = "https://cloudresourcemanager.googleapis.com/";
        let path = `v3/organizations:search`;

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
          organizations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                displayName: {
                  type: "string",
                  description:
                    'Output only. A human-readable string that refers to the organization in the Google Cloud Console. This string is set by the server and cannot be changed. The string will be set to the primary domain (for example, "google.com") of the Google Workspace customer that owns the organization.',
                },
                createTime: {
                  type: "string",
                  description:
                    "Output only. Timestamp when the Organization was created. (Format: google-datetime)",
                },
                deleteTime: {
                  type: "string",
                  description:
                    "Output only. Timestamp when the Organization was requested for deletion. (Format: google-datetime)",
                },
                name: {
                  type: "string",
                  description:
                    'Output only. The resource name of the organization. This is the organization\'s relative path in the API. Its format is "organizations/[organization_id]". For example, "organizations/1234".',
                },
                updateTime: {
                  type: "string",
                  description:
                    "Output only. Timestamp when the Organization was last modified. (Format: google-datetime)",
                },
                directoryCustomerId: {
                  type: "string",
                  description:
                    "Immutable. The G Suite / Workspace customer id used in the Directory API.",
                },
                etag: {
                  type: "string",
                  description:
                    "Output only. A checksum computed by the server based on the current value of the Organization resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
                },
                state: {
                  type: "string",
                  enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
                  description:
                    "Output only. The organization's current lifecycle state.",
                },
              },
              description:
                "The root node in the resource hierarchy to which a particular entity's (a company, for example) resources belong.",
              additionalProperties: true,
            },
            description:
              "The list of Organizations that matched the search query, possibly paginated.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A pagination token to be used to retrieve the next page of results. If the result is too large to fit within the page size specified in the request, this field will be set with a token that can be used to fetch the next page of results. If this field is empty, it indicates that this response contains the last page of results.",
          },
        },
        description:
          "The response returned from the `SearchOrganizations` method.",
        additionalProperties: true,
      },
    },
  },
};

export default organizationsSearch;
