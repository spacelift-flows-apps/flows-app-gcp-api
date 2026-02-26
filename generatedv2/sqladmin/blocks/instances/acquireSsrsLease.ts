import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlInstancesServiceClient } from "../../lib/grpcClient.ts";

const acquireSsrsLease: AppBlock = {
  name: "Acquire Ssrs Lease",
  description: `Acquire a lease for the setup of SQL Server Reporting Services (SSRS).`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Required. Cloud SQL instance ID. This doesn't include the project ID. It's composed of lowercase letters, numbers, and hyphens, and it must start with a letter. The total length must be 98 characters or less (Example: instance-id).",
          type: {
            type: "string",
            description:
              "Required. Cloud SQL instance ID. This doesn't include the project ID. It's composed of lowercase letters, numbers, and hyphens, and it must start with a letter. The total length must be 98 characters or less (Example: instance-id).",
          },
          required: true,
        },
        project: {
          name: "Project",
          description:
            "Required. Project ID of the project that contains the instance (Example: project-id).",
          type: {
            type: "string",
            description:
              "Required. Project ID of the project that contains the instance (Example: project-id).",
          },
          required: true,
        },
        body: {
          name: "Body",
          description: "Required. The request body.",
          type: {
            type: "object",
            properties: {
              acquire_ssrs_lease_context: {
                type: "object",
                properties: {
                  setup_login: {
                    type: "string",
                    description:
                      "The username to be used as the setup login to connect to the database server for SSRS setup.",
                  },
                  service_login: {
                    type: "string",
                    description:
                      "The username to be used as the service login to connect to the report database for SSRS setup.",
                  },
                  report_database: {
                    type: "string",
                    description:
                      "The report database to be used for SSRS setup.",
                  },
                  duration: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                },
                description: "Acquire SSRS lease context.",
                additionalProperties: true,
              },
            },
            description: "Request to acquire a lease for SSRS.",
            additionalProperties: true,
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
        if (input.event.inputConfig.body !== undefined)
          request.body = input.event.inputConfig.body;

        const result = await new Promise<any>((resolve, reject) => {
          client.acquireSsrsLease(request, (err: any, response: any) => {
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
        description: "Response for the acquire SSRS lease request.",
        additionalProperties: true,
      },
    },
  },
};

export default acquireSsrsLease;
