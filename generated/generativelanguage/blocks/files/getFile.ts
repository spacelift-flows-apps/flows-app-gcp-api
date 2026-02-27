import { AppBlock, events } from "@slflows/sdk/v1";
import { getFileServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const outputMapping = {
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
};

const getFile: AppBlock = {
  name: "Get File",
  description: `Gets the metadata for the given 'File'.`,
  category: "Files",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the `File` to get. Example: `files/abc-123`",
          type: {
            type: "string",
            description:
              "Required. The name of the `File` to get. Example: `files/abc-123`",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getFileServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getFile(request, (err: any, response: any) => {
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
            enum: ["SOURCE_UNSPECIFIED", "UPLOADED", "GENERATED", "REGISTERED"],
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
      },
    },
  },
};

export default getFile;
