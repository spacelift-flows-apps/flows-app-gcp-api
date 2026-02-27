import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const objectsBulkRestore: AppBlock = {
  name: "Objects - Bulk Restore",
  description: `Initiates a long-running bulk restore operation on the specified bucket.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket in which the object resides.",
          type: {
            type: "string",
          },
          required: true,
        },
        allowOverwrite: {
          name: "Allow Overwrite",
          description:
            "If false (default), the restore will not overwrite live objects with the same name at the destination.",
          type: {
            type: "boolean",
            description:
              "If false (default), the restore will not overwrite live objects with the same name at the destination. This means some deleted objects may be skipped. If true, live objects will be overwritten resulting in a noncurrent object (if versioning is enabled). If versioning is not enabled, overwriting the object will result in a soft-deleted object. In either case, if a noncurrent object already exists with the same name, a live version can be written without issue.",
          },
          required: false,
        },
        softDeletedAfterTime: {
          name: "Soft Deleted After Time",
          description:
            "Restores only the objects that were soft-deleted after this time.",
          type: {
            type: "string",
            description:
              "Restores only the objects that were soft-deleted after this time. (Format: date-time)",
          },
          required: false,
        },
        softDeletedBeforeTime: {
          name: "Soft Deleted Before Time",
          description:
            "Restores only the objects that were soft-deleted before this time.",
          type: {
            type: "string",
            description:
              "Restores only the objects that were soft-deleted before this time. (Format: date-time)",
          },
          required: false,
        },
        matchGlobs: {
          name: "Match Globs",
          description:
            "Restores only the objects matching any of the specified glob(s).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Restores only the objects matching any of the specified glob(s). If this parameter is not specified, all objects will be restored within the specified time range.",
          },
          required: false,
        },
        copySourceAcl: {
          name: "Copy Source ACL",
          description:
            "If true, copies the source object's ACL; otherwise, uses the bucket's default object ACL.",
          type: {
            type: "boolean",
            description:
              "If true, copies the source object's ACL; otherwise, uses the bucket's default object ACL. The default is false.",
          },
          required: false,
        },
        createdAfterTime: {
          name: "Created After Time",
          description:
            "Restores only the objects that were created after this time.",
          type: {
            type: "string",
            description:
              "Restores only the objects that were created after this time. (Format: date-time)",
          },
          required: false,
        },
        createdBeforeTime: {
          name: "Created Before Time",
          description:
            "Restores only the objects that were created before this time.",
          type: {
            type: "string",
            description:
              "Restores only the objects that were created before this time. (Format: date-time)",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/devstorage.full_control",
              "https://www.googleapis.com/auth/devstorage.read_write",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://storage.googleapis.com/storage/v1/";
        let path = `b/{bucket}/o/bulkRestore`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.allowOverwrite !== undefined)
          requestBody.allowOverwrite = input.event.inputConfig.allowOverwrite;
        if (input.event.inputConfig.softDeletedAfterTime !== undefined)
          requestBody.softDeletedAfterTime =
            input.event.inputConfig.softDeletedAfterTime;
        if (input.event.inputConfig.softDeletedBeforeTime !== undefined)
          requestBody.softDeletedBeforeTime =
            input.event.inputConfig.softDeletedBeforeTime;
        if (input.event.inputConfig.matchGlobs !== undefined)
          requestBody.matchGlobs = input.event.inputConfig.matchGlobs;
        if (input.event.inputConfig.copySourceAcl !== undefined)
          requestBody.copySourceAcl = input.event.inputConfig.copySourceAcl;
        if (input.event.inputConfig.createdAfterTime !== undefined)
          requestBody.createdAfterTime =
            input.event.inputConfig.createdAfterTime;
        if (input.event.inputConfig.createdBeforeTime !== undefined)
          requestBody.createdBeforeTime =
            input.event.inputConfig.createdBeforeTime;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
          );
        }

        const result = await response.json();
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
          done: {
            type: "boolean",
            description:
              'If the value is "false", it means the operation is still in progress. If "true", the operation is completed, and either "error" or "response" is available.',
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
                description:
                  "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description:
                  "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              },
              message: {
                type: "string",
                description:
                  "A developer-facing error message, which should be in English.",
              },
            },
            description:
              'The "Status" type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each "Status" message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).',
            additionalProperties: true,
          },
          metadata: {
            type: "object",
            additionalProperties: true,
            description:
              "Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.",
          },
          name: {
            type: "string",
            description:
              'The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the "name" should be a resource name ending with "operations/{operationId}".',
          },
          response: {
            type: "object",
            additionalProperties: true,
            description:
              'The normal response of the operation in case of success. If the original method returns no data on success, such as "Delete", the response is google.protobuf.Empty. If the original method is standard Get/Create/Update, the response should be the resource. For other methods, the response should have the type "XxxResponse", where "Xxx" is the original method name. For example, if the original method name is "TakeSnapshot()", the inferred response type is "TakeSnapshotResponse".',
          },
          selfLink: {
            type: "string",
            description: "The link to this long running operation.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For operations, this is always storage#operation.",
          },
        },
        description:
          "This resource represents a long-running operation that is the result of a network API call.",
        additionalProperties: true,
      },
    },
  },
};

export default objectsBulkRestore;
