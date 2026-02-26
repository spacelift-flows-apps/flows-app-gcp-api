import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const approveBuild: AppBlock = {
  name: "Approve Build",
  description: `Approves or rejects a pending build. If approved, the returned long-running operation (LRO) will be analogous to the LRO returned from a CreateBuild call. If rejected, the returned LRO will be immediately done.`,
  category: "Builds",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            'Required. Name of the target build. For example: "projects/{$project_id}/builds/{$build_id}"',
          type: {
            type: "string",
            description:
              'Required. Name of the target build. For example: "projects/{$project_id}/builds/{$build_id}"',
          },
          required: true,
        },
        approval_result: {
          name: "Approval Result",
          description: "Approval decision and metadata.",
          type: {
            type: "object",
            properties: {
              decision: {
                type: "string",
                enum: ["DECISION_UNSPECIFIED", "APPROVED", "REJECTED"],
                description: "Required. The decision of this manual approval.",
              },
              comment: {
                type: "string",
                description:
                  "Optional. An optional comment for this manual approval result.",
              },
              url: {
                type: "string",
                description:
                  "Optional. An optional URL tied to this manual approval result. This field is essentially the same as comment, except that it will be rendered by the UI differently. An example use case is a link to an external job that approved this Build.",
              },
            },
            required: ["decision"],
            description:
              "ApprovalResult describes the decision and associated metadata of a manual approval of a build.",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getCloudBuildClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;
        if (input.event.inputConfig.approval_result !== undefined)
          request.approval_result = input.event.inputConfig.approval_result;

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.approveBuild(request, metadata, (err: any, response: any) => {
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
          },
          metadata: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
          },
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type_url: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
            type: "object",
            properties: {
              type_url: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default approveBuild;
