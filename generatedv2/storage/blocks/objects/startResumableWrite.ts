import { AppBlock, events } from "@slflows/sdk/v1";
import { getStorageClient } from "../../lib/grpcClient.ts";

const startResumableWrite: AppBlock = {
  name: "Start Resumable Write",
  description: `Starts a resumable write operation. This method is part of the Resumable upload feature. This allows you to upload large objects in multiple chunks, which is more resilient to network interruptions than a single upload. The validity duration of the write operation, and the consequences of it becoming invalid, are service-dependent. **IAM Permissions**: Requires 'storage.objects.create' IAM permission on the bucket.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        writeObjectSpec: {
          name: "Write Object Spec",
          description:
            "Required. Contains the information necessary to start a resumable write.",
          type: {
            type: "object",
            properties: {
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
                  storageClass: {
                    type: "string",
                    description: "Optional. Storage class of the object.",
                  },
                  contentEncoding: {
                    type: "string",
                    description:
                      "Optional. Content-Encoding of the object data, matching [RFC 7231 §3.1.2.2](https://tools.ietf.org/html/rfc7231#section-3.1.2.2)",
                  },
                  contentDisposition: {
                    type: "string",
                    description:
                      "Optional. Content-Disposition of the object data, matching [RFC 6266](https://tools.ietf.org/html/rfc6266).",
                  },
                  cacheControl: {
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
                        entityId: {
                          type: "string",
                          description:
                            "Optional. The ID for the entity, if any.",
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
                        projectTeam: {
                          type: "object",
                          properties: {
                            projectNumber: {
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
                  contentLanguage: {
                    type: "string",
                    description:
                      "Optional. Content-Language of the object data, matching [RFC 7231 §3.1.3.2](https://tools.ietf.org/html/rfc7231#section-3.1.3.2).",
                  },
                  contentType: {
                    type: "string",
                    description:
                      "Optional. Content-Type of the object data, matching [RFC 7231 §3.1.1.5](https://tools.ietf.org/html/rfc7231#section-3.1.1.5). If an object is stored without a Content-Type, it is served as `application/octet-stream`.",
                  },
                  kmsKey: {
                    type: "string",
                    description:
                      "Optional. Cloud KMS Key used to encrypt this object, if the object is encrypted by such a key.",
                  },
                  temporaryHold: {
                    type: "boolean",
                    description:
                      "Optional. Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites.  A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. Note that unlike event-based hold, temporary hold does not impact retention expiration time of an object.",
                  },
                  retentionExpireTime: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                  eventBasedHold: {
                    type: "boolean",
                    description:
                      "Whether an object is under event-based hold. An event-based hold is a way to force the retention of an object until after some event occurs. Once the hold is released by explicitly setting this field to `false`, the object becomes subject to any bucket-level retention policy, except that the retention duration is calculated from the time the event based hold was lifted, rather than the time the object was created.  In a `WriteObject` request, not setting this field implies that the value should be taken from the parent bucket's `default_event_based_hold` field. In a response, this field is always set to `true` or `false`.",
                  },
                  customerEncryption: {
                    type: "object",
                    properties: {
                      encryptionAlgorithm: {
                        type: "string",
                        description: "Optional. The encryption algorithm.",
                      },
                      keySha256Bytes: {
                        type: "string",
                        description: "Base64-encoded bytes",
                      },
                    },
                    description:
                      "Describes the customer-supplied encryption key mechanism used to store an object's data at rest.",
                    additionalProperties: true,
                  },
                  customTime: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  retention: {
                    type: "object",
                    properties: {
                      mode: {
                        type: "string",
                        enum: ["MODE_UNSPECIFIED", "UNLOCKED", "LOCKED"],
                        description: "Optional. The mode of the Retention.",
                      },
                      retainUntilTime: {
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
                description: "An object.",
                additionalProperties: true,
              },
              predefinedAcl: {
                type: "string",
                description:
                  "Optional. Apply a predefined set of access controls to this object. Valid values are `authenticatedRead`, `bucketOwnerFullControl`, `bucketOwnerRead`, `private`, `projectPrivate`, or `publicRead`.",
              },
              ifGenerationMatch: {
                type: "string",
                description: "64-bit integer as string",
              },
              ifGenerationNotMatch: {
                type: "string",
                description: "64-bit integer as string",
              },
              ifMetagenerationMatch: {
                type: "string",
                description: "64-bit integer as string",
              },
              ifMetagenerationNotMatch: {
                type: "string",
                description: "64-bit integer as string",
              },
              objectSize: {
                type: "string",
                description: "64-bit integer as string",
              },
              appendable: {
                type: "boolean",
                description:
                  "If `true`, the object is created in appendable mode. This field might only be set when using `BidiWriteObject`.",
              },
            },
            required: ["resource"],
            description:
              "Describes an attempt to insert an object, possibly over multiple requests.",
            additionalProperties: true,
          },
          required: true,
        },
        commonObjectRequestParams: {
          name: "Common Object Request Params",
          description:
            "Optional. A set of parameters common to Storage API requests related to an object.",
          type: {
            type: "object",
            properties: {
              encryptionAlgorithm: {
                type: "string",
                description:
                  "Optional. Encryption algorithm used with the Customer-Supplied Encryption Keys feature.",
              },
              encryptionKeyBytes: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              encryptionKeySha256Bytes: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            description: "Parameters that can be passed to any object request.",
            additionalProperties: true,
          },
          required: false,
        },
        objectChecksums: {
          name: "Object Checksums",
          description:
            "Optional. The checksums of the complete object. This is used to validate the uploaded object. For each upload, `object_checksums` can be provided when initiating a resumable upload with`StartResumableWriteRequest` or when completing a write with `WriteObjectRequest` with `finish_write` set to `true`.",
          type: {
            type: "object",
            properties: {
              crc32c: {
                type: "integer",
                description:
                  "CRC32C digest of the object data. Computed by the Cloud Storage service for all written objects. If set in a WriteObjectRequest, service validates that the stored object matches this checksum.",
              },
              md5Hash: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            description:
              "Message used for storing full (not subrange) object checksums.",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.writeObjectSpec !== undefined)
          request.writeObjectSpec = input.event.inputConfig.writeObjectSpec;
        if (input.event.inputConfig.commonObjectRequestParams !== undefined)
          request.commonObjectRequestParams =
            input.event.inputConfig.commonObjectRequestParams;
        if (input.event.inputConfig.objectChecksums !== undefined)
          request.objectChecksums = input.event.inputConfig.objectChecksums;

        const result = await new Promise<any>((resolve, reject) => {
          client.startResumableWrite(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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
          uploadId: {
            type: "string",
            description:
              "A unique identifier for the initiated resumable write operation. As the ID grants write access, you should keep it confidential during the upload to prevent unauthorized access and data tampering during your upload. This ID should be included in subsequent `WriteObject` requests to upload the object data.",
          },
        },
        description:
          "Response object for [StartResumableWrite][google.storage.v2.Storage.StartResumableWrite].",
        additionalProperties: true,
      },
    },
  },
};

export default startResumableWrite;
