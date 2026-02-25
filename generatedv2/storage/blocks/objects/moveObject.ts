import { AppBlock, events } from "@slflows/sdk/v1";
import { getStorageClient } from "../../lib/grpcClient.ts";

const moveObject: AppBlock = {
  name: "Move Object",
  description: `Moves the source object to the destination object in the same bucket. This operation moves a source object to a destination object in the same bucket by renaming the object. The move itself is an atomic transaction, ensuring all steps either complete successfully or no changes are made. **IAM Permissions**: Requires the following IAM permissions to use this method: - 'storage.objects.move' - 'storage.objects.create' - 'storage.objects.delete' (only required if overwriting an existing object)`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description:
            "Required. Name of the bucket in which the object resides.",
          type: {
            type: "string",
            description:
              "Required. Name of the bucket in which the object resides.",
          },
          required: true,
        },
        sourceObject: {
          name: "Source Object",
          description: "Required. Name of the source object.",
          type: {
            type: "string",
            description: "Required. Name of the source object.",
          },
          required: true,
        },
        destinationObject: {
          name: "Destination Object",
          description: "Required. Name of the destination object.",
          type: {
            type: "string",
            description: "Required. Name of the destination object.",
          },
          required: true,
        },
        ifSourceGenerationMatch: {
          name: "If Source Generation Match",
          description:
            "Optional. Makes the operation conditional on whether the source object's current generation matches the given value. `if_source_generation_match` and `if_source_generation_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifSourceGenerationNotMatch: {
          name: "If Source Generation Not Match",
          description:
            "Optional. Makes the operation conditional on whether the source object's current generation does not match the given value. `if_source_generation_match` and `if_source_generation_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifSourceMetagenerationMatch: {
          name: "If Source Metageneration Match",
          description:
            "Optional. Makes the operation conditional on whether the source object's current metageneration matches the given value. `if_source_metageneration_match` and `if_source_metageneration_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifSourceMetagenerationNotMatch: {
          name: "If Source Metageneration Not Match",
          description:
            "Optional. Makes the operation conditional on whether the source object's current metageneration does not match the given value. `if_source_metageneration_match` and `if_source_metageneration_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifGenerationMatch: {
          name: "If Generation Match",
          description:
            "Optional. Makes the operation conditional on whether the destination object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. `if_generation_match` and `if_generation_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifGenerationNotMatch: {
          name: "If Generation Not Match",
          description:
            "Optional. Makes the operation conditional on whether the destination object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. `if_generation_match` and `if_generation_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifMetagenerationMatch: {
          name: "If Metageneration Match",
          description:
            "Optional. Makes the operation conditional on whether the destination object's current metageneration matches the given value. `if_metageneration_match` and `if_metageneration_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifMetagenerationNotMatch: {
          name: "If Metageneration Not Match",
          description:
            "Optional. Makes the operation conditional on whether the destination object's current metageneration does not match the given value. `if_metageneration_match` and `if_metageneration_not_match` conditions are mutually exclusive: it's an error for both of them to be set in the request.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.bucket !== undefined)
          request.bucket = input.event.inputConfig.bucket;
        if (input.event.inputConfig.sourceObject !== undefined)
          request.sourceObject = input.event.inputConfig.sourceObject;
        if (input.event.inputConfig.destinationObject !== undefined)
          request.destinationObject = input.event.inputConfig.destinationObject;
        if (input.event.inputConfig.ifSourceGenerationMatch !== undefined)
          request.ifSourceGenerationMatch =
            input.event.inputConfig.ifSourceGenerationMatch;
        if (input.event.inputConfig.ifSourceGenerationNotMatch !== undefined)
          request.ifSourceGenerationNotMatch =
            input.event.inputConfig.ifSourceGenerationNotMatch;
        if (input.event.inputConfig.ifSourceMetagenerationMatch !== undefined)
          request.ifSourceMetagenerationMatch =
            input.event.inputConfig.ifSourceMetagenerationMatch;
        if (
          input.event.inputConfig.ifSourceMetagenerationNotMatch !== undefined
        )
          request.ifSourceMetagenerationNotMatch =
            input.event.inputConfig.ifSourceMetagenerationNotMatch;
        if (input.event.inputConfig.ifGenerationMatch !== undefined)
          request.ifGenerationMatch = input.event.inputConfig.ifGenerationMatch;
        if (input.event.inputConfig.ifGenerationNotMatch !== undefined)
          request.ifGenerationNotMatch =
            input.event.inputConfig.ifGenerationNotMatch;
        if (input.event.inputConfig.ifMetagenerationMatch !== undefined)
          request.ifMetagenerationMatch =
            input.event.inputConfig.ifMetagenerationMatch;
        if (input.event.inputConfig.ifMetagenerationNotMatch !== undefined)
          request.ifMetagenerationNotMatch =
            input.event.inputConfig.ifMetagenerationNotMatch;

        const result = await new Promise<any>((resolve, reject) => {
          client.moveObject(request, (err: any, response: any) => {
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
          restoreToken: {
            type: "string",
            description:
              "Output only. Restore token used to differentiate deleted objects with the same name and generation. This field is output only, and only set for deleted objects in HNS buckets.",
          },
          metageneration: {
            type: "string",
            description: "64-bit integer as string",
          },
          storageClass: {
            type: "string",
            description: "Optional. Storage class of the object.",
          },
          size: {
            type: "string",
            description: "64-bit integer as string",
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
                  description: "Optional. The ID of the access-control entry.",
                },
                entity: {
                  type: "string",
                  description:
                    "Optional. The entity holding the permission, in one of the following forms: * `user-{userid}` * `user-{email}` * `group-{groupid}` * `group-{email}` * `domain-{domain}` * `project-{team}-{projectnumber}` * `project-{team}-{projectid}` * `allUsers` * `allAuthenticatedUsers` Examples: * The user `liz@example.com` would be `user-liz@example.com`. * The group `example@googlegroups.com` would be `group-example@googlegroups.com`. * All members of the Google Apps for Business domain `example.com` would be `domain-example.com`. For project entities, `project-{team}-{projectnumber}` format is returned in the response.",
                },
                entityAlt: {
                  type: "string",
                  description:
                    "Output only. The alternative entity format, if exists. For project entities, `project-{team}-{projectid}` format is returned in the response.",
                },
                entityId: {
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
          deleteTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          finalizeTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          contentType: {
            type: "string",
            description:
              "Optional. Content-Type of the object data, matching [RFC 7231 §3.1.1.5](https://tools.ietf.org/html/rfc7231#section-3.1.1.5). If an object is stored without a Content-Type, it is served as `application/octet-stream`.",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          componentCount: {
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
              md5Hash: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            description:
              "Message used for storing full (not subrange) object checksums.",
            additionalProperties: true,
          },
          updateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          kmsKey: {
            type: "string",
            description:
              "Optional. Cloud KMS Key used to encrypt this object, if the object is encrypted by such a key.",
          },
          updateStorageClassTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          temporaryHold: {
            type: "boolean",
            description:
              "Optional. Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites.  A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. Note that unlike event-based hold, temporary hold does not impact retention expiration time of an object.",
          },
          retentionExpireTime: {
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
          eventBasedHold: {
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
              entityId: {
                type: "string",
                description: "Optional. The ID for the entity.",
              },
            },
            description: "The owner of a specific resource.",
            additionalProperties: true,
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
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          softDeleteTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          hardDeleteTime: {
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
              retainUntilTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
    },
  },
};

export default moveObject;
