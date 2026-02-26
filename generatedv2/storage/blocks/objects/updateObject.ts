import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const updateObject: AppBlock = {
  name: "Update Object",
  description: `Updates an object's metadata. Equivalent to JSON API's 'storage.objects.patch' method. **IAM Permissions**: Requires 'storage.objects.update' IAM permission on the bucket.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        object: {
          name: "Object",
          description:
            "Required. The object to update. The object's bucket and name fields are used to identify the object to update. If present, the object's generation field selects a specific revision of this object whose metadata should be updated. Otherwise, assumes the live version of the object.",
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
              storage_class: {
                type: "string",
                description: "Optional. Storage class of the object.",
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
              content_type: {
                type: "string",
                description:
                  "Optional. Content-Type of the object data, matching [RFC 7231 §3.1.1.5](https://tools.ietf.org/html/rfc7231#section-3.1.1.5). If an object is stored without a Content-Type, it is served as `application/octet-stream`.",
              },
              kms_key: {
                type: "string",
                description:
                  "Optional. Cloud KMS Key used to encrypt this object, if the object is encrypted by such a key.",
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
            description: "An object.",
            additionalProperties: true,
          },
          required: true,
        },
        if_generation_match: {
          name: "If Generation Match",
          description:
            "Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        if_generation_not_match: {
          name: "If Generation Not Match",
          description:
            "Makes the operation conditional on whether the object's live generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        if_metageneration_match: {
          name: "If Metageneration Match",
          description:
            "Makes the operation conditional on whether the object's current metageneration matches the given value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        if_metageneration_not_match: {
          name: "If Metageneration Not Match",
          description:
            "Makes the operation conditional on whether the object's current metageneration does not match the given value.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        predefined_acl: {
          name: "Predefined Acl",
          description:
            'Optional. Apply a predefined set of access controls to this object. Valid values are "authenticatedRead", "bucketOwnerFullControl", "bucketOwnerRead", "private", "projectPrivate", or "publicRead".',
          type: {
            type: "string",
            description:
              'Optional. Apply a predefined set of access controls to this object. Valid values are "authenticatedRead", "bucketOwnerFullControl", "bucketOwnerRead", "private", "projectPrivate", or "publicRead".',
          },
          required: false,
        },
        update_mask: {
          name: "Update Mask",
          description:
            "Required. List of fields to be updated.  To specify ALL fields, equivalent to the JSON API's \"update\" function, specify a single field with the value `*`. Note: not recommended. If a new field is introduced at a later time, an older client updating with the `*` might accidentally reset the new field's value.  Not specifying any fields is an error.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
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
        override_unlocked_retention: {
          name: "Override Unlocked Retention",
          description:
            "Optional. Overrides the unlocked retention config on the object.",
          type: {
            type: "boolean",
            description:
              "Optional. Overrides the unlocked retention config on the object.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.object !== undefined)
          request.object = input.event.inputConfig.object;
        if (input.event.inputConfig.if_generation_match !== undefined)
          request.if_generation_match =
            input.event.inputConfig.if_generation_match;
        if (input.event.inputConfig.if_generation_not_match !== undefined)
          request.if_generation_not_match =
            input.event.inputConfig.if_generation_not_match;
        if (input.event.inputConfig.if_metageneration_match !== undefined)
          request.if_metageneration_match =
            input.event.inputConfig.if_metageneration_match;
        if (input.event.inputConfig.if_metageneration_not_match !== undefined)
          request.if_metageneration_not_match =
            input.event.inputConfig.if_metageneration_not_match;
        if (input.event.inputConfig.predefined_acl !== undefined)
          request.predefined_acl = input.event.inputConfig.predefined_acl;
        if (input.event.inputConfig.update_mask !== undefined)
          request.update_mask = input.event.inputConfig.update_mask;
        if (input.event.inputConfig.common_object_request_params !== undefined)
          request.common_object_request_params =
            input.event.inputConfig.common_object_request_params;
        if (input.event.inputConfig.override_unlocked_retention !== undefined)
          request.override_unlocked_retention =
            input.event.inputConfig.override_unlocked_retention;

        const routingParams: Record<string, string> = {};
        if (request.object?.bucket !== undefined)
          routingParams["bucket"] = String(request.object?.bucket);
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.updateObject(request, metadata, (err: any, response: any) => {
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
                  description: "Optional. The ID of the access-control entry.",
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

export default updateObject;
