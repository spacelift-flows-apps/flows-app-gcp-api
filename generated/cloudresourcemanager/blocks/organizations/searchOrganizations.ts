import { AppBlock, events } from "@slflows/sdk/v1";
import { getOrganizationsClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  organizations: {
    name: "organizations",
    fields: {
      display_name: "displayName",
      directory_customer_id: "directoryCustomerId",
      create_time: "createTime",
      update_time: "updateTime",
      delete_time: "deleteTime",
    },
  },
  next_page_token: "nextPageToken",
};

const searchOrganizations: AppBlock = {
  name: "Search Organizations",
  description: `Searches organization resources that are visible to the user and satisfy the specified filter. This method returns organizations in an unspecified order. New organizations do not necessarily appear at the end of the results, and may take a small amount of time to appear. Search will only return organizations on which the user has the permission 'resourcemanager.organizations.get'`,
  category: "Organizations",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of organizations to return in the response. The server can return fewer organizations than requested. If unspecified, server picks an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. The maximum number of organizations to return in the response. The server can return fewer organizations than requested. If unspecified, server picks an appropriate default.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `SearchOrganizations` that indicates from where listing should continue.",
          type: {
            type: "string",
            description:
              "Optional. A pagination token returned from a previous call to `SearchOrganizations` that indicates from where listing should continue.",
          },
          required: false,
        },
        query: {
          name: "Query",
          description:
            "Optional. An optional query string used to filter the Organizations to return in the response. Query rules are case-insensitive.   ``` | Field            | Description                                | |------------------|--------------------------------------------| | directoryCustomerId, owner.directoryCustomerId | Filters by directory customer id. | | domain           | Filters by domain.                         | ```  Organizations may be queried by `directoryCustomerId` or by `domain`, where the domain is a G Suite domain, for example:  * Query `directorycustomerid:123456789` returns Organization resources with `owner.directory_customer_id` equal to `123456789`. * Query `domain:google.com` returns Organization resources corresponding to the domain `google.com`.",
          type: {
            type: "string",
            description:
              "Optional. An optional query string used to filter the Organizations to return in the response. Query rules are case-insensitive.   ``` | Field            | Description                                | |------------------|--------------------------------------------| | directoryCustomerId, owner.directoryCustomerId | Filters by directory customer id. | | domain           | Filters by domain.                         | ```  Organizations may be queried by `directoryCustomerId` or by `domain`, where the domain is a G Suite domain, for example:  * Query `directorycustomerid:123456789` returns Organization resources with `owner.directory_customer_id` equal to `123456789`. * Query `domain:google.com` returns Organization resources corresponding to the domain `google.com`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getOrganizationsClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.searchOrganizations(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
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
                name: {
                  type: "string",
                  description:
                    'Output only. The resource name of the organization. This is the organization\'s relative path in the API. Its format is "organizations/[organization_id]". For example, "organizations/1234".',
                },
                displayName: {
                  type: "string",
                  description:
                    'Output only. A human-readable string that refers to the organization in the Google Cloud Console. This string is set by the server and cannot be changed. The string will be set to the primary domain (for example, "google.com") of the Google Workspace customer that owns the organization.',
                },
                directoryCustomerId: {
                  type: "string",
                  description:
                    "Immutable. The G Suite / Workspace customer id used in the Directory API.",
                },
                state: {
                  type: "string",
                  enum: ["STATE_UNSPECIFIED", "ACTIVE", "DELETE_REQUESTED"],
                  description:
                    "Output only. The organization's current lifecycle state.",
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                deleteTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                etag: {
                  type: "string",
                  description:
                    "Output only. A checksum computed by the server based on the current value of the Organization resource. This may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.",
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

export default searchOrganizations;
