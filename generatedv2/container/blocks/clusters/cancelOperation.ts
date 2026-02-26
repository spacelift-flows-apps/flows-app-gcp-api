import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const cancelOperation: AppBlock = {
  name: "Cancel Operation",
  description: `Cancels the specified operation.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        project_id: {
          name: "Project Id",
          description:
            "Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The Google Developers Console [project ID or project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects). This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        zone: {
          name: "Zone",
          description:
            "Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the operation resides. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The name of the Google Compute Engine [zone](https://cloud.google.com/compute/docs/zones#available) in which the operation resides. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        operation_id: {
          name: "Operation Id",
          description:
            "Deprecated. The server-assigned `name` of the operation. This field has been deprecated and replaced by the name field.",
          type: {
            type: "string",
            description:
              "Deprecated. The server-assigned `name` of the operation. This field has been deprecated and replaced by the name field.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name (project, location, operation id) of the operation to cancel. Specified in the format `projects/*/locations/*/operations/*`.",
          type: {
            type: "string",
            description:
              "The name (project, location, operation id) of the operation to cancel. Specified in the format `projects/*/locations/*/operations/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.project_id !== undefined)
          request.project_id = input.event.inputConfig.project_id;
        if (input.event.inputConfig.zone !== undefined)
          request.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.operation_id !== undefined)
          request.operation_id = input.event.inputConfig.operation_id;
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.cancelOperation(request, (err: any, response: any) => {
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default cancelOperation;
