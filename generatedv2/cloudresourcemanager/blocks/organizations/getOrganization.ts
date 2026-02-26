import { AppBlock, events } from "@slflows/sdk/v1";
import { getOrganizationsClient } from "../../lib/grpcClient.ts";

const getOrganization: AppBlock = {
  name: "Get Organization",
  description: `Fetches an organization resource identified by the specified resource name.`,
  category: "Organizations",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            'Required. The resource name of the Organization to fetch. This is the organization\'s relative path in the API, formatted as "organizations/[organizationId]". For example, "organizations/1234".',
          type: {
            type: "string",
            description:
              'Required. The resource name of the Organization to fetch. This is the organization\'s relative path in the API, formatted as "organizations/[organizationId]". For example, "organizations/1234".',
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getOrganizationsClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getOrganization(request, (err: any, response: any) => {
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
          name: {
            type: "string",
            description:
              'Output only. The resource name of the organization. This is the organization\'s relative path in the API. Its format is "organizations/[organization_id]". For example, "organizations/1234".',
          },
          display_name: {
            type: "string",
            description:
              'Output only. A human-readable string that refers to the organization in the Google Cloud Console. This string is set by the server and cannot be changed. The string will be set to the primary domain (for example, "google.com") of the Google Workspace customer that owns the organization.',
          },
          directory_customer_id: {
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
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          update_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          delete_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
    },
  },
};

export default getOrganization;
