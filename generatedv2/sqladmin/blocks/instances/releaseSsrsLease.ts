import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlInstancesServiceClient } from "../../lib/grpcClient.ts";

const releaseSsrsLease: AppBlock = {
  name: "Release Ssrs Lease",
  description: `Release a lease for the setup of SQL Server Reporting Services (SSRS).`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Required. The Cloud SQL instance ID. This doesn't include the project ID. The instance ID contains lowercase letters, numbers, and hyphens, and it must start with a letter. This ID can have a maximum length of 98 characters.",
          type: {
            type: "string",
            description:
              "Required. The Cloud SQL instance ID. This doesn't include the project ID. The instance ID contains lowercase letters, numbers, and hyphens, and it must start with a letter. This ID can have a maximum length of 98 characters.",
          },
          required: true,
        },
        project: {
          name: "Project",
          description: "Required. The project ID that contains the instance.",
          type: {
            type: "string",
            description: "Required. The project ID that contains the instance.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlInstancesServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          request.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;

        const result = await new Promise<any>((resolve, reject) => {
          client.releaseSsrsLease(request, (err: any, response: any) => {
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
          operation_id: {
            type: "string",
            description: "The unique identifier for this operation.",
          },
        },
        description: "Response for the release SSRS lease request.",
        additionalProperties: true,
      },
    },
  },
};

export default releaseSsrsLease;
