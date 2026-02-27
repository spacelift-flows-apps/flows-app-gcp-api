import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  projectId: "project_id",
  triggerId: "trigger_id",
};

const deleteBuildTrigger: AppBlock = {
  name: "Delete Build Trigger",
  description: `Deletes a 'BuildTrigger' by its project ID and trigger ID.`,
  category: "Build Triggers",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The name of the `Trigger` to delete. Format: `projects/{project}/locations/{location}/triggers/{trigger}`",
          type: {
            type: "string",
            description:
              "The name of the `Trigger` to delete. Format: `projects/{project}/locations/{location}/triggers/{trigger}`",
          },
          required: false,
        },
        projectId: {
          name: "Project Id",
          description: "Required. ID of the project that owns the trigger.",
          type: {
            type: "string",
            description: "Required. ID of the project that owns the trigger.",
          },
          required: true,
        },
        triggerId: {
          name: "Trigger Id",
          description: "Required. ID of the `BuildTrigger` to delete.",
          type: {
            type: "string",
            description: "Required. ID of the `BuildTrigger` to delete.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getCloudBuildClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteBuildTrigger(
            request,
            metadata,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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

export default deleteBuildTrigger;
