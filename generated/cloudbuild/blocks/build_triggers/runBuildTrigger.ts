import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  projectId: "project_id",
  triggerId: "trigger_id",
  source: {
    name: "source",
    fields: {
      projectId: "project_id",
      repoName: "repo_name",
      branchName: "branch_name",
      tagName: "tag_name",
      commitSha: "commit_sha",
      invertRegex: "invert_regex",
    },
  },
};

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

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
        projectId: {
          name: "Project Id",
          description: "Required. ID of the project.",
          type: {
            type: "string",
            description: "Required. ID of the project.",
          },
          required: true,
        },
        triggerId: {
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
              projectId: {
                type: "string",
                description:
                  "Optional. ID of the project that owns the Cloud Source Repository. If omitted, the project ID requesting the build is assumed.",
              },
              repoName: {
                type: "string",
                description: "Required. Name of the Cloud Source Repository.",
              },
              branchName: {
                type: "string",
                description:
                  "Regex matching branches to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
              },
              tagName: {
                type: "string",
                description:
                  "Regex matching tags to build.  The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax (Part of 'revision' - only one field in this group can be set)",
              },
              commitSha: {
                type: "string",
                description:
                  "Explicit commit SHA to build. (Part of 'revision' - only one field in this group can be set)",
              },
              dir: {
                type: "string",
                description:
                  "Optional. Directory, relative to the source root, in which to run the build.  This must be a relative path. If a step's `dir` is specified and is an absolute path, this value is ignored for that step's execution.",
              },
              invertRegex: {
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
            required: ["repoName"],
            description:
              "Location of the source in a Google Cloud Source Repository.",
            additionalProperties: true,
          },
          required: false,
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
          name: {
            type: "string",
          },
          metadata: {
            type: "object",
            properties: {
              typeUrl: {
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
                    typeUrl: {
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
              typeUrl: {
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
