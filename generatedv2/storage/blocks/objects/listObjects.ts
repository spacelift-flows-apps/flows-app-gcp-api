import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const listObjects: AppBlock = {
  name: "List Objects",
  description: `Retrieves a list of objects matching the criteria. **IAM Permissions**: The authenticated user requires 'storage.objects.list' IAM permission to use this method. To return object ACLs, the authenticated user must also have the 'storage.objects.getIamPolicy' permission.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Name of the bucket in which to look for objects.",
          type: {
            type: "string",
            description:
              "Required. Name of the bucket in which to look for objects.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. Maximum number of `items` plus `prefixes` to return in a single page of responses. As duplicate `prefixes` are omitted, fewer total results might be returned than requested. The service uses this parameter or 1,000 items, whichever is smaller.",
          type: {
            type: "integer",
            description:
              "Optional. Maximum number of `items` plus `prefixes` to return in a single page of responses. As duplicate `prefixes` are omitted, fewer total results might be returned than requested. The service uses this parameter or 1,000 items, whichever is smaller.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A previously-returned page token representing part of the larger set of results to view.",
          type: {
            type: "string",
            description:
              "Optional. A previously-returned page token representing part of the larger set of results to view.",
          },
          required: false,
        },
        delimiter: {
          name: "Delimiter",
          description:
            "Optional. If set, returns results in a directory-like mode. `items` contains only objects whose names, aside from the `prefix`, do not contain `delimiter`. Objects whose names, aside from the `prefix`, contain `delimiter` has their name, truncated after the `delimiter`, returned in `prefixes`. Duplicate `prefixes` are omitted.",
          type: {
            type: "string",
            description:
              "Optional. If set, returns results in a directory-like mode. `items` contains only objects whose names, aside from the `prefix`, do not contain `delimiter`. Objects whose names, aside from the `prefix`, contain `delimiter` has their name, truncated after the `delimiter`, returned in `prefixes`. Duplicate `prefixes` are omitted.",
          },
          required: false,
        },
        includeTrailingDelimiter: {
          name: "Include Trailing Delimiter",
          description:
            "Optional. If true, objects that end in exactly one instance of `delimiter` has their metadata included in `items` in addition to `prefixes`.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, objects that end in exactly one instance of `delimiter` has their metadata included in `items` in addition to `prefixes`.",
          },
          required: false,
        },
        prefix: {
          name: "Prefix",
          description:
            "Optional. Filter results to objects whose names begin with this prefix.",
          type: {
            type: "string",
            description:
              "Optional. Filter results to objects whose names begin with this prefix.",
          },
          required: false,
        },
        versions: {
          name: "Versions",
          description:
            "Optional. If `true`, lists all versions of an object as distinct results.",
          type: {
            type: "boolean",
            description:
              "Optional. If `true`, lists all versions of an object as distinct results.",
          },
          required: false,
        },
        readMask: {
          name: "Read Mask",
          description:
            "Mask specifying which fields to read from each result. If no mask is specified, defaults to all fields except `items.acl` and `items.owner`. `*` might be used to mean all fields.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: false,
        },
        lexicographicStart: {
          name: "Lexicographic Start",
          description:
            "Optional. Filter results to objects whose names are lexicographically equal to or after `lexicographic_start`. If `lexicographic_end` is also set, the objects listed have names between `lexicographic_start` (inclusive) and `lexicographic_end` (exclusive).",
          type: {
            type: "string",
            description:
              "Optional. Filter results to objects whose names are lexicographically equal to or after `lexicographic_start`. If `lexicographic_end` is also set, the objects listed have names between `lexicographic_start` (inclusive) and `lexicographic_end` (exclusive).",
          },
          required: false,
        },
        lexicographicEnd: {
          name: "Lexicographic End",
          description:
            "Optional. Filter results to objects whose names are lexicographically before `lexicographic_end`. If `lexicographic_start` is also set, the objects listed have names between `lexicographic_start` (inclusive) and `lexicographic_end` (exclusive).",
          type: {
            type: "string",
            description:
              "Optional. Filter results to objects whose names are lexicographically before `lexicographic_end`. If `lexicographic_start` is also set, the objects listed have names between `lexicographic_start` (inclusive) and `lexicographic_end` (exclusive).",
          },
          required: false,
        },
        softDeleted: {
          name: "Soft Deleted",
          description:
            "Optional. If true, only list all soft-deleted versions of the object. Soft delete policy is required to set this option.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, only list all soft-deleted versions of the object. Soft delete policy is required to set this option.",
          },
          required: false,
        },
        includeFoldersAsPrefixes: {
          name: "Include Folders As Prefixes",
          description:
            "Optional. If true, includes folders and managed folders (besides objects) in the returned `prefixes`. Requires `delimiter` to be set to '/'.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, includes folders and managed folders (besides objects) in the returned `prefixes`. Requires `delimiter` to be set to '/'.",
          },
          required: false,
        },
        matchGlob: {
          name: "Match Glob",
          description:
            "Optional. Filter results to objects and prefixes that match this glob pattern. See [List objects using glob](https://cloud.google.com/storage/docs/json_api/v1/objects/list#list-objects-and-prefixes-using-glob) for the full syntax.",
          type: {
            type: "string",
            description:
              "Optional. Filter results to objects and prefixes that match this glob pattern. See [List objects using glob](https://cloud.google.com/storage/docs/json_api/v1/objects/list#list-objects-and-prefixes-using-glob) for the full syntax.",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. An expression used to filter the returned objects by the `context` field. For the full syntax, see [Filter objects by contexts syntax](https://cloud.google.com/storage/docs/listing-objects#filter-by-object-contexts-syntax). If a `delimiter` is set, the returned `prefixes` are exempt from this filter.",
          type: {
            type: "string",
            description:
              "Optional. An expression used to filter the returned objects by the `context` field. For the full syntax, see [Filter objects by contexts syntax](https://cloud.google.com/storage/docs/listing-objects#filter-by-object-contexts-syntax). If a `delimiter` is set, the returned `prefixes` are exempt from this filter.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.pageSize !== undefined)
          request.pageSize = input.event.inputConfig.pageSize;
        if (input.event.inputConfig.pageToken !== undefined)
          request.pageToken = input.event.inputConfig.pageToken;
        if (input.event.inputConfig.delimiter !== undefined)
          request.delimiter = input.event.inputConfig.delimiter;
        if (input.event.inputConfig.includeTrailingDelimiter !== undefined)
          request.includeTrailingDelimiter =
            input.event.inputConfig.includeTrailingDelimiter;
        if (input.event.inputConfig.prefix !== undefined)
          request.prefix = input.event.inputConfig.prefix;
        if (input.event.inputConfig.versions !== undefined)
          request.versions = input.event.inputConfig.versions;
        if (input.event.inputConfig.readMask !== undefined)
          request.readMask = input.event.inputConfig.readMask;
        if (input.event.inputConfig.lexicographicStart !== undefined)
          request.lexicographicStart =
            input.event.inputConfig.lexicographicStart;
        if (input.event.inputConfig.lexicographicEnd !== undefined)
          request.lexicographicEnd = input.event.inputConfig.lexicographicEnd;
        if (input.event.inputConfig.softDeleted !== undefined)
          request.softDeleted = input.event.inputConfig.softDeleted;
        if (input.event.inputConfig.includeFoldersAsPrefixes !== undefined)
          request.includeFoldersAsPrefixes =
            input.event.inputConfig.includeFoldersAsPrefixes;
        if (input.event.inputConfig.matchGlob !== undefined)
          request.matchGlob = input.event.inputConfig.matchGlob;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;

        const routingParams: Record<string, string> = {};
        if (request.parent !== undefined)
          routingParams["bucket"] = String(request.parent);
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.listObjects(request, metadata, (err: any, response: any) => {
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
          objects: {
            type: "array",
            items: {
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
                        description:
                          "Optional. The ID of the access-control entry.",
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                finalizeTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                contentType: {
                  type: "string",
                  description:
                    "Optional. Content-Type of the object data, matching [RFC 7231 §3.1.1.5](https://tools.ietf.org/html/rfc7231#section-3.1.1.5). If an object is stored without a Content-Type, it is served as `application/octet-stream`.",
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                kmsKey: {
                  type: "string",
                  description:
                    "Optional. Cloud KMS Key used to encrypt this object, if the object is encrypted by such a key.",
                },
                updateStorageClassTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                softDeleteTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                hardDeleteTime: {
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
            description: "The list of items.",
          },
          prefixes: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of prefixes of objects matching-but-not-listed up to and including the requested delimiter.",
          },
          nextPageToken: {
            type: "string",
            description:
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
        },
        description: "The result of a call to Objects.ListObjects",
        additionalProperties: true,
      },
    },
  },
};

export default listObjects;
