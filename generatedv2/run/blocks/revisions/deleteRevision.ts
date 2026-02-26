import { AppBlock, events } from "@slflows/sdk/v1";
import { getRevisionsClient, createRoutingMetadata, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  "validateOnly": "validate_only"
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

const deleteRevision: AppBlock = {
  name: "Delete Revision",
  description: `Deletes a Revision.`,
  category: "Revisions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Required. The name of the Revision to delete. Format: projects/{project}/locations/{location}/services/{service}/revisions/{revision}",
          type: {
                    "type": "string",
                    "description": "Required. The name of the Revision to delete. Format: projects/{project}/locations/{location}/services/{service}/revisions/{revision}"
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
          description: "A system-generated fingerprint for this version of the resource. This may be used to detect modification conflict during updates.",
          type: {
                    "type": "string",
                    "description": "A system-generated fingerprint for this version of the resource. This may be used to detect modification conflict during updates."
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getRevisionsClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteRevision(request, metadata, (err: any, response: any) => {
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

export default deleteRevision;
