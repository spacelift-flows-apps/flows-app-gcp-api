import { AppBlock, events } from "@slflows/sdk/v1";
import { getInstancesClient, createRoutingMetadata, convertKeys } from "../../lib/grpcClient.ts";

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

const deleteInstance: AppBlock = {
  name: "Delete Instance",
  description: `Deletes a Instance`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Name field",
          type: {
                    "type": "string"
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description: "Optional. Indicates that the request should be validated without actually deleting any resources.",
          type: {
                    "type": "boolean",
                    "description": "Optional. Indicates that the request should be validated without actually deleting any resources."
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description: "Optional. A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates.",
          type: {
                    "type": "string",
                    "description": "Optional. A system-generated fingerprint for this version of the resource. May be used to detect modification conflict during updates."
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getInstancesClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.name !== undefined) {
          const m = String(request.name).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.deleteInstance(request, metadata, (err: any, response: any) => {
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

export default deleteInstance;
