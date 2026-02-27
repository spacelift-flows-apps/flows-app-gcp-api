import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const anywhereCachesUpdate: AppBlock = {
  name: "Anywhere Caches - Update",
  description: `Updates the config(ttl and admissionPolicy) of an Anywhere Cache instance.`,
  category: "Anywhere Caches",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "The name of the bucket containing this cache instance.",
          type: {
            type: "string",
            description:
              "The name of the bucket containing this cache instance.",
          },
          required: false,
        },
        anywhereCacheId: {
          name: "Anywhere Cache ID",
          description: "The ID of the Anywhere cache instance.",
          type: {
            type: "string",
            description: "The ID of the Anywhere cache instance.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "The kind of item this is.",
          type: {
            type: "string",
            description:
              "The kind of item this is. For Anywhere Cache, this is always storage#anywhereCache.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "The ID of the resource, including the project number, bucket name and anywhere cache ID.",
          type: {
            type: "string",
            description:
              "The ID of the resource, including the project number, bucket name and anywhere cache ID.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "The link to this cache instance.",
          type: {
            type: "string",
            description: "The link to this cache instance.",
          },
          required: false,
        },
        zone: {
          name: "Zone",
          description: "The zone in which the cache instance is running.",
          type: {
            type: "string",
            description:
              "The zone in which the cache instance is running. For example, us-central1-a.",
          },
          required: false,
        },
        state: {
          name: "State",
          description: "The current state of the cache instance.",
          type: {
            type: "string",
            description: "The current state of the cache instance.",
          },
          required: false,
        },
        createTime: {
          name: "Create Time",
          description:
            "The creation time of the cache instance in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The creation time of the cache instance in RFC 3339 format. (Format: date-time)",
          },
          required: false,
        },
        updateTime: {
          name: "Update Time",
          description:
            "The modification time of the cache instance metadata in RFC 3339 format.",
          type: {
            type: "string",
            description:
              "The modification time of the cache instance metadata in RFC 3339 format. (Format: date-time)",
          },
          required: false,
        },
        ttl: {
          name: "Ttl",
          description: "The TTL of all cache entries in whole seconds.",
          type: {
            type: "string",
            description:
              'The TTL of all cache entries in whole seconds. e.g., "7200s". (Format: google-duration)',
          },
          required: false,
        },
        admissionPolicy: {
          name: "Admission Policy",
          description: "The cache-level entry admission policy.",
          type: {
            type: "string",
            description: "The cache-level entry admission policy.",
          },
          required: false,
        },
        pendingUpdate: {
          name: "Pending Update",
          description:
            "True if the cache instance has an active Update long-running operation.",
          type: {
            type: "boolean",
            description:
              "True if the cache instance has an active Update long-running operation.",
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
        let path = `b/{bucket}/anywhereCaches/{anywhereCacheId}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.bucket !== undefined)
          requestBody.bucket = input.event.inputConfig.bucket;
        if (input.event.inputConfig.anywhereCacheId !== undefined)
          requestBody.anywhereCacheId = input.event.inputConfig.anywhereCacheId;
        if (input.event.inputConfig.zone !== undefined)
          requestBody.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.state !== undefined)
          requestBody.state = input.event.inputConfig.state;
        if (input.event.inputConfig.createTime !== undefined)
          requestBody.createTime = input.event.inputConfig.createTime;
        if (input.event.inputConfig.updateTime !== undefined)
          requestBody.updateTime = input.event.inputConfig.updateTime;
        if (input.event.inputConfig.ttl !== undefined)
          requestBody.ttl = input.event.inputConfig.ttl;
        if (input.event.inputConfig.admissionPolicy !== undefined)
          requestBody.admissionPolicy = input.event.inputConfig.admissionPolicy;
        if (input.event.inputConfig.pendingUpdate !== undefined)
          requestBody.pendingUpdate = input.event.inputConfig.pendingUpdate;

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

export default anywhereCachesUpdate;
