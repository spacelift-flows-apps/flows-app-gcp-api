import { AppBlock, events } from "@slflows/sdk/v1";
import { getFileServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  file: {
    name: "file",
    fields: {
      videoMetadata: {
        name: "video_metadata",
        fields: {
          videoDuration: "video_duration",
        },
      },
      displayName: "display_name",
      mimeType: "mime_type",
      sizeBytes: "size_bytes",
      createTime: "create_time",
      updateTime: "update_time",
      expirationTime: "expiration_time",
      sha256Hash: "sha256_hash",
      downloadUri: "download_uri",
      error: {
        name: "error",
        fields: {
          details: {
            name: "details",
            fields: {
              typeUrl: "type_url",
            },
          },
        },
      },
    },
  },
};

const outputMapping = {
  file: {
    name: "file",
    fields: {
      video_metadata: {
        name: "videoMetadata",
        fields: {
          video_duration: "videoDuration",
        },
      },
      display_name: "displayName",
      mime_type: "mimeType",
      size_bytes: "sizeBytes",
      create_time: "createTime",
      update_time: "updateTime",
      expiration_time: "expirationTime",
      sha256_hash: "sha256Hash",
      download_uri: "downloadUri",
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
    },
  },
};

const createFile: AppBlock = {
  name: "Create File",
  description: `Creates a 'File'.`,
  category: "Files",
  inputs: {
    default: {
      config: {
        file: {
          name: "File",
          description: "Optional. Metadata for the file to create.",
          type: {
            type: "object",
            properties: {
              videoMetadata: {
                type: "object",
                properties: {
                  videoDuration: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                },
                additionalProperties: true,
              },
              name: {
                type: "string",
              },
              displayName: {
                type: "string",
              },
              mimeType: {
                type: "string",
              },
              sizeBytes: {
                type: "string",
                description: "64-bit integer as string",
              },
              createTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              updateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              expirationTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              sha256Hash: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              uri: {
                type: "string",
              },
              downloadUri: {
                type: "string",
              },
              state: {
                type: "string",
                enum: ["STATE_UNSPECIFIED", "PROCESSING", "ACTIVE", "FAILED"],
              },
              source: {
                type: "string",
                enum: [
                  "SOURCE_UNSPECIFIED",
                  "UPLOADED",
                  "GENERATED",
                  "REGISTERED",
                ],
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
              },
            },
            additionalProperties: true,
            description: "Optional. Metadata for the file to create.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getFileServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createFile(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
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
        type: "object",
        properties: {
          file: {
            type: "object",
            properties: {
              videoMetadata: {
                type: "object",
                properties: {
                  videoDuration: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                },
                additionalProperties: true,
              },
              name: {
                type: "string",
              },
              displayName: {
                type: "string",
              },
              mimeType: {
                type: "string",
              },
              sizeBytes: {
                type: "string",
                description: "64-bit integer as string",
              },
              createTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              updateTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              expirationTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              sha256Hash: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              uri: {
                type: "string",
              },
              downloadUri: {
                type: "string",
              },
              state: {
                type: "string",
                enum: ["STATE_UNSPECIFIED", "PROCESSING", "ACTIVE", "FAILED"],
              },
              source: {
                type: "string",
                enum: [
                  "SOURCE_UNSPECIFIED",
                  "UPLOADED",
                  "GENERATED",
                  "REGISTERED",
                ],
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
              },
            },
            additionalProperties: true,
            description: "Metadata for the created file.",
          },
        },
        description: "Response for `CreateFile`.",
        additionalProperties: true,
      },
    },
  },
};

export default createFile;
