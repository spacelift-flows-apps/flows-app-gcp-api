import { AppBlock, events } from "@slflows/sdk/v1";
import { getFileServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  files: {
    name: "files",
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
  next_page_token: "nextPageToken",
};

const listFiles: AppBlock = {
  name: "List Files",
  description: `Lists the metadata for 'File's owned by the requesting project.`,
  category: "Files",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "Optional. Maximum number of `File`s to return per page. If unspecified, defaults to 10. Maximum `page_size` is 100.",
          type: {
            type: "integer",
            description:
              "Optional. Maximum number of `File`s to return per page. If unspecified, defaults to 10. Maximum `page_size` is 100.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A page token from a previous `ListFiles` call.",
          type: {
            type: "string",
            description:
              "Optional. A page token from a previous `ListFiles` call.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getFileServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listFiles(request, (err: any, response: any) => {
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
          files: {
            type: "array",
            items: {
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                expirationTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            },
            description: "The list of `File`s.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token that can be sent as a `page_token` into a subsequent `ListFiles` call.",
          },
        },
        description: "Response for `ListFiles`.",
        additionalProperties: true,
      },
    },
  },
};

export default listFiles;
