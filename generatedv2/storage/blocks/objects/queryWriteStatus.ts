import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const queryWriteStatus: AppBlock = {
  name: "Query Write Status",
  description: `Determines the 'persisted_size' of an object that is being written. This method is part of the resumable upload feature. The returned value is the size of the object that has been persisted so far. The value can be used as the 'write_offset' for the next 'Write()' call. If the object does not exist, meaning if it was deleted, or the first 'Write()' has not yet reached the service, this method returns the error 'NOT_FOUND'. This method is useful for clients that buffer data and need to know which data can be safely evicted. The client can call 'QueryWriteStatus()' at any time to determine how much data has been logged for this object. For any sequence of 'QueryWriteStatus()' calls for a given object name, the sequence of returned 'persisted_size' values are non-decreasing.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        upload_id: {
          name: "Upload Id",
          description:
            "Required. The name of the resume token for the object whose write status is being requested.",
          type: {
            type: "string",
            description:
              "Required. The name of the resume token for the object whose write status is being requested.",
          },
          required: true,
        },
        common_object_request_params: {
          name: "Common Object Request Params",
          description:
            "Optional. A set of parameters common to Storage API requests concerning an object.",
          type: {
            type: "object",
            properties: {
              encryption_algorithm: {
                type: "string",
                description:
                  "Optional. Encryption algorithm used with the Customer-Supplied Encryption Keys feature.",
              },
              encryption_key_bytes: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              encryption_key_sha256_bytes: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            description: "Parameters that can be passed to any object request.",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.upload_id !== undefined)
          request.upload_id = input.event.inputConfig.upload_id;
        if (input.event.inputConfig.common_object_request_params !== undefined)
          request.common_object_request_params =
            input.event.inputConfig.common_object_request_params;

        const routingParams: Record<string, string> = {};
        if (request.upload_id !== undefined) {
          const m = String(request.upload_id).match(
            /^(projects\/[^/]+\/buckets\/[^/]+)/,
          );
          if (m) routingParams["bucket"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.queryWriteStatus(
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
          persisted_size: {
            type: "string",
            description:
              "64-bit integer as string (Part of 'write_status' - only one field in this group can be set)",
          },
          resource: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Immutable. The name of this object. Nearly any sequence of unicode characters is valid. See [Guidelines](https://cloud.google.com/storage/docs/objects#naming). Example: `test.txt` The `name` field by itself does not uniquely identify a Cloud Storage object. A Cloud Storage object is uniquely identified by the tuple of (bucket, object, generation).",
              },
              bucket: {
                type: "string",
                description:
                  "Immutable. The name of the bucket containing this object.",
              },
              etag: {
                type: "string",
                description:
                  "Optional. The `etag` of an object. If included in the metadata of an update or delete request message, the operation is only performed if the etag matches that of the live object.",
              },
              generation: {
                type: "string",
                description: "64-bit integer as string",
              },
              restore_token: {
                type: "string",
                description:
                  "Output only. Restore token used to differentiate deleted objects with the same name and generation. This field is output only, and only set for deleted objects in HNS buckets.",
              },
              metageneration: {
                type: "string",
                description: "64-bit integer as string",
              },
              storage_class: {
                type: "string",
                description: "Optional. Storage class of the object.",
              },
              size: {
                type: "string",
                description: "64-bit integer as string",
              },
              content_encoding: {
                type: "string",
                description:
                  "Optional. Content-Encoding of the object data, matching [RFC 7231 §3.1.2.2](https://tools.ietf.org/html/rfc7231#section-3.1.2.2)",
              },
              content_disposition: {
                type: "string",
                description:
                  "Optional. Content-Disposition of the object data, matching [RFC 6266](https://tools.ietf.org/html/rfc6266).",
              },
              cache_control: {
                type: "string",
                description:
                  "Optional. Cache-Control directive for the object data, matching [RFC 7234 §5.2](https://tools.ietf.org/html/rfc7234#section-5.2). If omitted, and the object is accessible to all anonymous users, the default is `public, max-age=3600`.",
              },
              acl: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    role: {
                      type: "string",
                      description:
                        "Optional. The access permission for the entity. One of the following values: * `READER` * `WRITER` * `OWNER`",
                    },
                    id: {
                      type: "string",
                      description:
                        "Optional. The ID of the access-control entry.",
                    },
                    entity: {
                      type: "string",
                      description:
                        "Optional. The entity holding the permission, in one of the following forms: * `user-{userid}` * `user-{email}` * `group-{groupid}` * `group-{email}` * `domain-{domain}` * `project-{team}-{projectnumber}` * `project-{team}-{projectid}` * `allUsers` * `allAuthenticatedUsers` Examples: * The user `liz@example.com` would be `user-liz@example.com`. * The group `example@googlegroups.com` would be `group-example@googlegroups.com`. * All members of the Google Apps for Business domain `example.com` would be `domain-example.com`. For project entities, `project-{team}-{projectnumber}` format is returned in the response.",
                    },
                    entity_alt: {
                      type: "string",
                      description:
                        "Output only. The alternative entity format, if exists. For project entities, `project-{team}-{projectid}` format is returned in the response.",
                    },
                    entity_id: {
                      type: "string",
                      description: "Optional. The ID for the entity, if any.",
                    },
                    etag: {
                      type: "string",
                      description:
                        "Optional. The etag of the ObjectAccessControl. If included in the metadata of an update or delete request message, the operation is only performed if the etag matches that of the live object's ObjectAccessControl.",
                    },
                    email: {
                      type: "string",
                      description:
                        "Optional. The email address associated with the entity, if any.",
                    },
                    domain: {
                      type: "string",
                      description:
                        "Optional. The domain associated with the entity, if any.",
                    },
                    project_team: {
                      type: "object",
                      properties: {
                        project_number: {
                          type: "string",
                          description: "Optional. The project number.",
                        },
                        team: {
                          type: "string",
                          description: "Optional. The team.",
                        },
                      },
                      description:
                        "Represents the Viewers, Editors, or Owners of a given project.",
                      additionalProperties: true,
                    },
                  },
                  description: "An access-control entry.",
                  additionalProperties: true,
                },
                description:
                  "Optional. Access controls on the object. If `iam_config.uniform_bucket_level_access` is enabled on the parent bucket, requests to set, read, or modify acl is an error.",
              },
              content_language: {
                type: "string",
                description:
                  "Optional. Content-Language of the object data, matching [RFC 7231 §3.1.3.2](https://tools.ietf.org/html/rfc7231#section-3.1.3.2).",
              },
              delete_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              finalize_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              content_type: {
                type: "string",
                description:
                  "Optional. Content-Type of the object data, matching [RFC 7231 §3.1.1.5](https://tools.ietf.org/html/rfc7231#section-3.1.1.5). If an object is stored without a Content-Type, it is served as `application/octet-stream`.",
              },
              create_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              component_count: {
                type: "integer",
                description:
                  "Output only. Number of underlying components that make up this object. Components are accumulated by compose operations.",
              },
              checksums: {
                type: "object",
                properties: {
                  crc32c: {
                    type: "integer",
                    description:
                      "CRC32C digest of the object data. Computed by the Cloud Storage service for all written objects. If set in a WriteObjectRequest, service validates that the stored object matches this checksum.",
                  },
                  md5_hash: {
                    type: "string",
                    description: "Base64-encoded bytes",
                  },
                },
                description:
                  "Message used for storing full (not subrange) object checksums.",
                additionalProperties: true,
              },
              update_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              kms_key: {
                type: "string",
                description:
                  "Optional. Cloud KMS Key used to encrypt this object, if the object is encrypted by such a key.",
              },
              update_storage_class_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              temporary_hold: {
                type: "boolean",
                description:
                  "Optional. Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites.  A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. Note that unlike event-based hold, temporary hold does not impact retention expiration time of an object.",
              },
              retention_expire_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              metadata: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Optional. User-provided metadata, in key/value pairs.",
              },
              contexts: {
                type: "object",
                properties: {
                  custom: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                    description:
                      "Optional. User-defined object contexts. The maximum key or value size is `256` characters. The maximum number of entries is `50`. The maximum total serialized size of all entries is `25KiB`.",
                  },
                },
                description: "All contexts of an object grouped by type.",
                additionalProperties: true,
              },
              event_based_hold: {
                type: "boolean",
                description:
                  "Whether an object is under event-based hold. An event-based hold is a way to force the retention of an object until after some event occurs. Once the hold is released by explicitly setting this field to `false`, the object becomes subject to any bucket-level retention policy, except that the retention duration is calculated from the time the event based hold was lifted, rather than the time the object was created.  In a `WriteObject` request, not setting this field implies that the value should be taken from the parent bucket's `default_event_based_hold` field. In a response, this field is always set to `true` or `false`.",
              },
              owner: {
                type: "object",
                properties: {
                  entity: {
                    type: "string",
                    description:
                      "Optional. The entity, in the form `user-`*userId*.",
                  },
                  entity_id: {
                    type: "string",
                    description: "Optional. The ID for the entity.",
                  },
                },
                description: "The owner of a specific resource.",
                additionalProperties: true,
              },
              customer_encryption: {
                type: "object",
                properties: {
                  encryption_algorithm: {
                    type: "string",
                    description: "Optional. The encryption algorithm.",
                  },
                  key_sha256_bytes: {
                    type: "string",
                    description: "Base64-encoded bytes",
                  },
                },
                description:
                  "Describes the customer-supplied encryption key mechanism used to store an object's data at rest.",
                additionalProperties: true,
              },
              custom_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              soft_delete_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              hard_delete_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              retention: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    enum: ["MODE_UNSPECIFIED", "UNLOCKED", "LOCKED"],
                    description: "Optional. The mode of the Retention.",
                  },
                  retain_until_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description:
                  "Specifies retention parameters of the object. Objects under retention cannot be deleted or overwritten until their retention expires.",
                additionalProperties: true,
              },
            },
            description:
              "An object. (Part of 'write_status' - only one field in this group can be set)",
            additionalProperties: true,
          },
        },
        description:
          "Response object for [QueryWriteStatus][google.storage.v2.Storage.QueryWriteStatus].",
        additionalProperties: true,
      },
    },
  },
};

export default queryWriteStatus;
