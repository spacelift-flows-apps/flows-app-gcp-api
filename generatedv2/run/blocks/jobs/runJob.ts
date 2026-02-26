import { AppBlock, events } from "@slflows/sdk/v1";
import { getJobsClient, createRoutingMetadata, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  "validateOnly": "validate_only",
  "overrides": {
    "name": "overrides",
    "fields": {
      "containerOverrides": {
        "name": "container_overrides",
        "fields": {
          "env": {
            "name": "env",
            "fields": {
              "valueSource": {
                "name": "value_source",
                "fields": {
                  "secretKeyRef": "secret_key_ref"
                }
              }
            }
          },
          "clearArgs": "clear_args"
        }
      },
      "taskCount": "task_count"
    }
  }
};

const outputMapping = {
  "metadata": {
    "name": "metadata",
    "fields": {
      "type_url": "typeUrl"
    }
  },
  "error": {
    "name": "error",
    "fields": {
      "details": {
        "name": "details",
        "fields": {
          "type_url": "typeUrl"
        }
      }
    }
  },
  "response": {
    "name": "response",
    "fields": {
      "type_url": "typeUrl"
    }
  }
};

const runJob: AppBlock = {
  name: "Run Job",
  description: `Triggers creation of a new Execution of this Job.`,
  category: "Jobs",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Required. The full name of the Job. Format: projects/{project}/locations/{location}/jobs/{job}, where {project} can be project id or number.",
          type: {
                    "type": "string",
                    "description": "Required. The full name of the Job. Format: projects/{project}/locations/{location}/jobs/{job}, where {project} can be project id or number."
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description: "Indicates that the request should be validated without actually deleting any resources.",
          type: {
                    "type": "boolean",
                    "description": "Indicates that the request should be validated without actually deleting any resources."
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description: "A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
          type: {
                    "type": "string",
                    "description": "A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates."
          },
          required: false,
        },
        overrides: {
          name: "Overrides",
          description: "Overrides specification for a given execution of a job. If provided, overrides will be applied to update the execution or task spec.",
          type: {
                    "type": "object",
                    "properties": {
                              "containerOverrides": {
                                        "type": "array",
                                        "items": {
                                                  "type": "object",
                                                  "properties": {
                                                            "name": {
                                                                      "type": "string",
                                                                      "description": "The name of the container specified as a DNS_LABEL."
                                                            },
                                                            "args": {
                                                                      "type": "array",
                                                                      "items": {
                                                                                "type": "string"
                                                                      },
                                                                      "description": "Optional. Arguments to the entrypoint. Will replace existing args for override."
                                                            },
                                                            "env": {
                                                                      "type": "array",
                                                                      "items": {
                                                                                "type": "object",
                                                                                "properties": {
                                                                                          "name": {
                                                                                                    "type": "string",
                                                                                                    "description": "Required. Name of the environment variable. Must not exceed 32768 characters."
                                                                                          },
                                                                                          "value": {
                                                                                                    "type": "string",
                                                                                                    "description": "Literal value of the environment variable. Defaults to \"\", and the maximum length is 32768 bytes. Variable references are not supported in Cloud Run. (Part of 'values' - only one field in this group can be set)"
                                                                                          },
                                                                                          "valueSource": {
                                                                                                    "type": "object",
                                                                                                    "properties": {
                                                                                                              "secretKeyRef": {
                                                                                                                        "type": "object",
                                                                                                                        "properties": {
                                                                                                                                  "secret": {
                                                                                                                                            "type": "string",
                                                                                                                                            "description": "Required. The name of the secret in Cloud Secret Manager. Format: {secret_name} if the secret is in the same project. projects/{project}/secrets/{secret_name} if the secret is in a different project."
                                                                                                                                  },
                                                                                                                                  "version": {
                                                                                                                                            "type": "string",
                                                                                                                                            "description": "The Cloud Secret Manager secret version. Can be 'latest' for the latest version, an integer for a specific version, or a version alias."
                                                                                                                                  }
                                                                                                                        },
                                                                                                                        "required": [
                                                                                                                                  "secret"
                                                                                                                        ],
                                                                                                                        "description": "SecretEnvVarSource represents a source for the value of an EnvVar.",
                                                                                                                        "additionalProperties": true
                                                                                                              }
                                                                                                    },
                                                                                                    "description": "EnvVarSource represents a source for the value of an EnvVar. (Part of 'values' - only one field in this group can be set)",
                                                                                                    "additionalProperties": true
                                                                                          }
                                                                                },
                                                                                "required": [
                                                                                          "name"
                                                                                ],
                                                                                "description": "EnvVar represents an environment variable present in a Container.",
                                                                                "additionalProperties": true
                                                                      },
                                                                      "description": "List of environment variables to set in the container. Will be merged with existing env for override."
                                                            },
                                                            "clearArgs": {
                                                                      "type": "boolean",
                                                                      "description": "Optional. True if the intention is to clear out existing args list."
                                                            }
                                                  },
                                                  "description": "Per-container override specification.",
                                                  "additionalProperties": true
                                        },
                                        "description": "Per container override specification."
                              },
                              "taskCount": {
                                        "type": "integer",
                                        "description": "Optional. The desired number of tasks the execution should run. Will replace existing task_count value."
                              },
                              "timeout": {
                                        "type": "string",
                                        "description": "Duration string (e.g., '1.5s', '300s')"
                              }
                    },
                    "description": "RunJob Overrides that contains Execution fields to be overridden.",
                    "additionalProperties": true
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getJobsClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.runJob(request, metadata, (err: any, response: any) => {
            if (err) reject(new Error(`gRPC error [${err.code}]: ${err.details || err.message}`));
            else resolve(response);
          });
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
            "type": "object",
            "properties": {
                  "name": {
                        "type": "string"
                  },
                  "metadata": {
                        "type": "object",
                        "properties": {
                              "typeUrl": {
                                    "type": "string"
                              },
                              "value": {
                                    "type": "string",
                                    "description": "Base64-encoded bytes"
                              }
                        },
                        "additionalProperties": true
                  },
                  "done": {
                        "type": "boolean"
                  },
                  "error": {
                        "type": "object",
                        "properties": {
                              "code": {
                                    "type": "integer"
                              },
                              "message": {
                                    "type": "string"
                              },
                              "details": {
                                    "type": "array",
                                    "items": {
                                          "type": "object",
                                          "properties": {
                                                "typeUrl": {
                                                      "type": "string"
                                                },
                                                "value": {
                                                      "type": "string",
                                                      "description": "Base64-encoded bytes"
                                                }
                                          },
                                          "additionalProperties": true
                                    }
                              }
                        },
                        "additionalProperties": true,
                        "description": "(Part of 'result' - only one field in this group can be set)"
                  },
                  "response": {
                        "type": "object",
                        "properties": {
                              "typeUrl": {
                                    "type": "string"
                              },
                              "value": {
                                    "type": "string",
                                    "description": "Base64-encoded bytes"
                              }
                        },
                        "additionalProperties": true,
                        "description": "(Part of 'result' - only one field in this group can be set)"
                  }
            },
            "additionalProperties": true
      },
    },
  },
};

export default runJob;
