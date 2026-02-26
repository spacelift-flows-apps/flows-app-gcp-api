import { AppBlock, events } from "@slflows/sdk/v1";
import { getRepositoryManagerClient } from "../../lib/grpcClient.ts";

const fetchGitRefs: AppBlock = {
  name: "Fetch Git Refs",
  description: `Fetch the list of branches or tags for a given repository.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        repository: {
          name: "Repository",
          description:
            "Required. The resource name of the repository in the format `projects/*/locations/*/connections/*/repositories/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the repository in the format `projects/*/locations/*/connections/*/repositories/*`.",
          },
          required: true,
        },
        ref_type: {
          name: "Ref Type",
          description: "Type of refs to fetch",
          type: {
            type: "string",
            enum: ["REF_TYPE_UNSPECIFIED", "TAG", "BRANCH"],
            description: "Type of refs to fetch",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRepositoryManagerClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.repository !== undefined)
          request.repository = input.event.inputConfig.repository;
        if (input.event.inputConfig.ref_type !== undefined)
          request.ref_type = input.event.inputConfig.ref_type;

        const result = await new Promise<any>((resolve, reject) => {
          client.fetchGitRefs(request, (err: any, response: any) => {
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
          ref_names: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Name of the refs fetched.",
          },
        },
        description: "Response for fetching git refs",
        additionalProperties: true,
      },
    },
  },
};

export default fetchGitRefs;
