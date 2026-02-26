import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const runBuildTrigger: AppBlock = {
  name: "Run Build Trigger",
  description: `Runs a 'BuildTrigger' at a particular source revision. To run a regional or global trigger, use the POST request that includes the location endpoint in the path (ex. v1/projects/{projectId}/locations/{region}/triggers/{triggerId}:run). The POST request that does not include the location endpoint in the path can only be used when running global triggers.`,
  category: "Build Triggers",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The name of the `Trigger` to run. Format: `projects/{project}/locations/{location}/triggers/{trigger}`",
          type: {
            type: "string",
            description:
              "The name of the `Trigger` to run. Format: `projects/{project}/locations/{location}/triggers/{trigger}`",
          },
          required: false,
        },
        project_id: {
          name: "Project Id",
          description: "Required. ID of the project.",
          type: {
            type: "string",
            description: "Required. ID of the project.",
          },
          required: true,
        },
        trigger_id: {
          name: "Trigger Id",
          description: "Required. ID of the trigger.",
          type: {
            type: "string",
            description: "Required. ID of the trigger.",
          },
          required: true,
        },
        source: {
          name: "Source",
          description:
            "Source to build against this trigger. Branch and tag names cannot consist of regular expressions.",
          type: {
            type: "object",
            properties: {
              project_id: {
                type: "string",
                description:
                  "Optional. ID of the project that owns the Cloud Source Repository. If omitted, the project ID requesting the build is assumed.",
              },
              repo_name: {
                type: "string",
                description: "Required. Name of the Cloud Source Repository.",
              },
              branch_name: {
                type: "string",
                description:
                  "Regex matching branches to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
              },
              tag_name: {
                type: "string",
                description:
                  "Regex matching tags to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
              },
              commit_sha: {
                type: "string",
                description:
                  "Explicit commit SHA to build. (Part of 'revision' - only one field in this group can be set)",
              },
              dir: {
                type: "string",
                description:
                  "Optional. Directory, relative to the source root, in which to run the build.  This must be a relative path. If a step's `dir` is specified and is an absolute path, this value is ignored for that step's execution.",
              },
              invert_regex: {
                type: "boolean",
                description:
                  "Optional. Only trigger a build if the revision regex does NOT match the revision regex.",
              },
              substitutions: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Optional. Substitutions to use in a triggered build. Should only be used with RunBuildTrigger",
              },
            },
            required: ["repo_name"],
            description:
              "Location of the source in a Google Cloud Source Repository.",
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
        if (input.event.inputConfig.project_id !== undefined)
          request.project_id = input.event.inputConfig.project_id;
        if (input.event.inputConfig.trigger_id !== undefined)
          request.trigger_id = input.event.inputConfig.trigger_id;
        if (input.event.inputConfig.source !== undefined)
          request.source = input.event.inputConfig.source;

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.runBuildTrigger(
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

export default runBuildTrigger;
