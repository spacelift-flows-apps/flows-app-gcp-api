import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  toSnakeCase,
  toCamelCase,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const restoreObject: AppBlock = {
  name: "Restore Object",
  description: `Restores a soft-deleted object. When a soft-deleted object is restored, a new copy of that object is created in the same bucket and inherits the same metadata as the soft-deleted object. The inherited metadata is the metadata that existed when the original object became soft deleted, with the following exceptions: - The 'createTime' of the new object is set to the time at which the soft-deleted object was restored. - The 'softDeleteTime' and 'hardDeleteTime' values are cleared. - A new generation is assigned and the metageneration is reset to 1. - If the soft-deleted object was in a bucket that had Autoclass enabled, the new object is restored to Standard storage. - The restored object inherits the bucket's default object ACL, unless 'copySourceAcl' is 'true'. If a live object using the same name already exists in the bucket and becomes overwritten, the live object becomes a noncurrent object if Object Versioning is enabled on the bucket. If Object Versioning is not enabled, the live object becomes soft deleted. **IAM Permissions**: Requires the following IAM permissions to use this method: - 'storage.objects.restore' - 'storage.objects.create' - 'storage.objects.delete' (only required if overwriting an existing object) - 'storage.objects.getIamPolicy' (only required if 'projection' is 'full' and the relevant bucket has uniform bucket-level access disabled) - 'storage.objects.setIamPolicy' (only required if 'copySourceAcl' is 'true' and the relevant bucket has uniform bucket-level access disabled)`,
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
        object: {
          name: "Object",
          description: "Required. The name of the object to restore.",
          type: {
            type: "string",
            description: "Required. The name of the object to restore.",
          },
          required: true,
        },
        generation: {
          name: "Generation",
          description:
            "Required. The specific revision of the object to restore.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: true,
        },
        restoreToken: {
          name: "Restore Token",
          description:
            "Optional. Restore token used to differentiate soft-deleted objects with the same name and generation. Only applicable for hierarchical namespace buckets. This parameter is optional, and is only required in the rare case when there are multiple soft-deleted objects with the same name and generation.",
          type: {
            type: "string",
            description:
              "Optional. Restore token used to differentiate soft-deleted objects with the same name and generation. Only applicable for hierarchical namespace buckets. This parameter is optional, and is only required in the rare case when there are multiple soft-deleted objects with the same name and generation.",
          },
          required: false,
        },
        ifGenerationMatch: {
          name: "If Generation Match",
          description:
            "Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifGenerationNotMatch: {
          name: "If Generation Not Match",
          description:
            "Makes the operation conditional on whether the object's live generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifMetagenerationMatch: {
          name: "If Metageneration Match",
          description:
            "Makes the operation conditional on whether the object's current metageneration matches the given value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ifMetagenerationNotMatch: {
          name: "If Metageneration Not Match",
          description:
            "Makes the operation conditional on whether the object's current metageneration does not match the given value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        copySourceAcl: {
          name: "Copy Source Acl",
          description:
            "If false or unset, the bucket's default object ACL is used. If true, copy the source object's access controls. Return an error if bucket has UBLA enabled.",
          type: {
            type: "boolean",
            description:
              "If false or unset, the bucket's default object ACL is used. If true, copy the source object's access controls. Return an error if bucket has UBLA enabled.",
          },
          required: false,
        },
        commonObjectRequestParams: {
          name: "Common Object Request Params",
          description:
            "Optional. A set of parameters common to Storage API requests concerning an object.",
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
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.bucket !== undefined)
          request.bucket = input.event.inputConfig.bucket;
        if (input.event.inputConfig.object !== undefined)
          request.object = input.event.inputConfig.object;
        if (input.event.inputConfig.generation !== undefined)
          request.generation = input.event.inputConfig.generation;
        if (input.event.inputConfig.restoreToken !== undefined)
          request.restoreToken = input.event.inputConfig.restoreToken;
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
        if (input.event.inputConfig.copySourceAcl !== undefined)
          request.copySourceAcl = input.event.inputConfig.copySourceAcl;
        if (input.event.inputConfig.commonObjectRequestParams !== undefined)
          request.commonObjectRequestParams =
            input.event.inputConfig.commonObjectRequestParams;

        const routingParams: Record<string, string> = {};
        if (request.bucket !== undefined)
          routingParams["bucket"] = String(request.bucket);
        const metadata = createRoutingMetadata(routingParams);
        const protoRequest = toSnakeCase(request);
        const result = await new Promise<any>((resolve, reject) => {
          client.restoreObject(
            protoRequest,
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

        await events.emit(result ? toCamelCase(result) : {});
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

export default restoreObject;
