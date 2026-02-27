import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlTiersServiceClient } from "../../lib/grpcClient.ts";

const list: AppBlock = {
  name: "List",
  description: `Lists users in the specified Cloud SQL instance.`,
  category: "Tiers",
  inputs: {
    default: {
      config: {
        project: {
          name: "Project",
          description: "Project ID of the project for which to list tiers.",
          type: {
            type: "string",
            description: "Project ID of the project for which to list tiers.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlTiersServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.list(request, (err: any, response: any) => {
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
          kind: {
            type: "string",
            description: "This is always `sql#tiersList`.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tier: {
                  type: "string",
                  description:
                    "An identifier for the machine type, for example, `db-custom-1-3840`. For related information, see [Pricing](/sql/pricing).",
                },
                RAM: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description: "This is always `sql#tier`.",
                },
                Disk_Quota: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                region: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "The applicable regions for this tier.",
                },
              },
              description: "A Google Cloud SQL service tier resource.",
              additionalProperties: true,
            },
            description: "List of tiers.",
          },
        },
        description: "Tiers list response.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
