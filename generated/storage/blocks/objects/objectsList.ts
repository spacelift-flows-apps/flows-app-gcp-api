import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const objectsList: AppBlock = {
  name: "Objects - List",
  description: `Retrieves a list of objects matching the criteria.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket in which to look for objects.",
          type: {
            type: "string",
          },
          required: true,
        },
        delimiter: {
          name: "Delimiter",
          description:
            "Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.",
          type: {
            type: "string",
          },
          required: false,
        },
        endOffset: {
          name: "End Offset",
          description:
            "Filter results to objects whose names are lexicographically before endOffset. If startOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive).",
          type: {
            type: "string",
          },
          required: false,
        },
        includeTrailingDelimiter: {
          name: "Include Trailing Delimiter",
          description:
            "If true, objects that end in exactly one instance of delimiter will have their metadata included in items in addition to prefixes.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "Maximum number of items plus prefixes to return in a single page of responses. As duplicate prefixes are omitted, fewer total results may be returned than requested. The service will use this parameter or 1,000 items, whichever is smaller.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A previously-returned page token representing part of the larger set of results to view.",
          type: {
            type: "string",
          },
          required: false,
        },
        prefix: {
          name: "Prefix",
          description:
            "Filter results to objects whose names begin with this prefix.",
          type: {
            type: "string",
          },
          required: false,
        },
        projection: {
          name: "Projection",
          description: "Set of properties to return. Defaults to noAcl.",
          type: {
            type: "string",
            enum: ["full", "noAcl"],
          },
          required: false,
        },
        startOffset: {
          name: "Start Offset",
          description:
            "Filter results to objects whose names are lexicographically equal to or after startOffset. If endOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive).",
          type: {
            type: "string",
          },
          required: false,
        },
        userProject: {
          name: "User Project",
          description:
            "The project to be billed for this request. Required for Requester Pays buckets.",
          type: {
            type: "string",
          },
          required: false,
        },
        versions: {
          name: "Versions",
          description:
            "If true, lists all versions of an object as distinct results. The default is false. For more information, see [Object Versioning](https://cloud.google.com/storage/docs/object-versioning).",
          type: {
            type: "boolean",
          },
          required: false,
        },
        matchGlob: {
          name: "Match Glob",
          description:
            "Filter results to objects and prefixes that match this glob pattern.",
          type: {
            type: "string",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Filter the returned objects. Currently only supported for the contexts field. If delimiter is set, the returned prefixes are exempt from this filter.",
          type: {
            type: "string",
          },
          required: false,
        },
        softDeleted: {
          name: "Soft Deleted",
          description:
            "If true, only soft-deleted object versions will be listed. The default is false. For more information, see [Soft Delete](https://cloud.google.com/storage/docs/soft-delete).",
          type: {
            type: "boolean",
          },
          required: false,
        },
        includeFoldersAsPrefixes: {
          name: "Include Folders As Prefixes",
          description:
            "Only applicable if delimiter is set to '/'. If true, will also include folders and managed folders (besides objects) in the returned prefixes.",
          type: {
            type: "boolean",
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
              "https://www.googleapis.com/auth/cloud-platform.read-only",
              "https://www.googleapis.com/auth/devstorage.full_control",
              "https://www.googleapis.com/auth/devstorage.read_only",
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
        let path = `b/{bucket}/o`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                acl: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      bucket: {
                        type: "string",
                        description: "The name of the bucket.",
                      },
                      domain: {
                        type: "string",
                        description:
                          "The domain associated with the entity, if any.",
                      },
                      email: {
                        type: "string",
                        description:
                          "The email address associated with the entity, if any.",
                      },
                      entity: {
                        type: "string",
                        description:
                          "The entity holding the permission, in one of the following forms: \n- user-userId \n- user-email \n- group-groupId \n- group-email \n- domain-domain \n- project-team-projectId \n- allUsers \n- allAuthenticatedUsers Examples: \n- The user liz@example.com would be user-liz@example.com. \n- The group example@googlegroups.com would be group-example@googlegroups.com. \n- To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.",
                      },
                      entityId: {
                        type: "string",
                        description: "The ID for the entity, if any.",
                      },
                      etag: {
                        type: "string",
                        description:
                          "HTTP 1.1 Entity tag for the access-control entry.",
                      },
                      generation: {
                        type: "string",
                        description:
                          "The content generation of the object, if applied to an object. (Format: int64)",
                      },
                      id: {
                        type: "string",
                        description: "The ID of the access-control entry.",
                      },
                      kind: {
                        type: "string",
                        description:
                          "The kind of item this is. For object access control entries, this is always storage#objectAccessControl.",
                      },
                      object: {
                        type: "string",
                        description:
                          "The name of the object, if applied to an object.",
                      },
                      projectTeam: {
                        type: "object",
                        properties: {
                          projectNumber: {
                            type: "string",
                            description: "The project number.",
                          },
                          team: {
                            type: "string",
                            description: "The team.",
                          },
                        },
                        description:
                          "The project team associated with the entity, if any.",
                        additionalProperties: true,
                      },
                      role: {
                        type: "string",
                        description: "The access permission for the entity.",
                      },
                      selfLink: {
                        type: "string",
                        description: "The link to this access-control entry.",
                      },
                    },
                    description: "An access-control entry.",
                    additionalProperties: true,
                  },
                  description: "Access controls on the object.",
                },
                bucket: {
                  type: "string",
                  description: "The name of the bucket containing this object.",
                },
                cacheControl: {
                  type: "string",
                  description:
                    "Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600.",
                },
                componentCount: {
                  type: "integer",
                  description:
                    "Number of underlying components that make up this object. Components are accumulated by compose operations. (Format: int32)",
                },
                contentDisposition: {
                  type: "string",
                  description: "Content-Disposition of the object data.",
                },
                contentEncoding: {
                  type: "string",
                  description: "Content-Encoding of the object data.",
                },
                contentLanguage: {
                  type: "string",
                  description: "Content-Language of the object data.",
                },
                contentType: {
                  type: "string",
                  description:
                    "Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream.",
                },
                crc32c: {
                  type: "string",
                  description:
                    "CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation).",
                },
                customTime: {
                  type: "string",
                  description:
                    "A timestamp in RFC 3339 format specified by the user for an object. (Format: date-time)",
                },
                customerEncryption: {
                  type: "object",
                  properties: {
                    encryptionAlgorithm: {
                      type: "string",
                      description: "The encryption algorithm.",
                    },
                    keySha256: {
                      type: "string",
                      description: "SHA256 hash value of the encryption key.",
                    },
                  },
                  description:
                    "Metadata of customer-supplied encryption key, if the object is encrypted by such a key.",
                  additionalProperties: true,
                },
                etag: {
                  type: "string",
                  description: "HTTP 1.1 Entity tag for the object.",
                },
                eventBasedHold: {
                  type: "boolean",
                  description:
                    "Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). One sample use case of this flag is for banks to hold loan documents for at least 3 years after loan is paid in full. Here, bucket-level retention is 3 years and the event is the loan being paid in full. In this example, these objects will be held intact for any number of years until the event has occurred (event-based hold on the object is released) and then 3 more years after that. That means retention duration of the objects begins from the moment event-based hold transitioned from true to false.",
                },
                generation: {
                  type: "string",
                  description:
                    "The content generation of this object. Used for object versioning. (Format: int64)",
                },
                id: {
                  type: "string",
                  description:
                    "The ID of the object, including the bucket name, object name, and generation number.",
                },
                kind: {
                  type: "string",
                  description:
                    "The kind of item this is. For objects, this is always storage#object.",
                },
                kmsKeyName: {
                  type: "string",
                  description:
                    "Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request.",
                },
                md5Hash: {
                  type: "string",
                  description:
                    "MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation).",
                },
                mediaLink: {
                  type: "string",
                  description: "Media download link.",
                },
                metadata: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description: "User-provided metadata, in key/value pairs.",
                },
                contexts: {
                  type: "object",
                  properties: {
                    custom: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description: "User-defined object contexts.",
                    },
                  },
                  description:
                    "User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata.",
                  additionalProperties: true,
                },
                restoreToken: {
                  type: "string",
                  description:
                    "Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets.",
                },
                metageneration: {
                  type: "string",
                  description:
                    "The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. (Format: int64)",
                },
                name: {
                  type: "string",
                  description:
                    "The name of the object. Required if not specified by URL parameter.",
                },
                owner: {
                  type: "object",
                  properties: {
                    entity: {
                      type: "string",
                      description: "The entity, in the form user-userId.",
                    },
                    entityId: {
                      type: "string",
                      description: "The ID for the entity.",
                    },
                  },
                  description:
                    "The owner of the object. This will always be the uploader of the object.",
                  additionalProperties: true,
                },
                retentionExpirationTime: {
                  type: "string",
                  description:
                    "A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. Note 2: This value can be provided even when temporary hold is set (so that the user can reason about policy without having to first unset the temporary hold). (Format: date-time)",
                },
                retention: {
                  type: "object",
                  properties: {
                    retainUntilTime: {
                      type: "string",
                      description:
                        "A time in RFC 3339 format until which object retention protects this object. (Format: date-time)",
                    },
                    mode: {
                      type: "string",
                      description:
                        "The bucket's object retention mode, can only be Unlocked or Locked.",
                    },
                  },
                  description:
                    "A collection of object level retention parameters.",
                  additionalProperties: true,
                },
                selfLink: {
                  type: "string",
                  description: "The link to this object.",
                },
                size: {
                  type: "string",
                  description:
                    "Content-Length of the data in bytes. (Format: uint64)",
                },
                storageClass: {
                  type: "string",
                  description: "Storage class of the object.",
                },
                temporaryHold: {
                  type: "boolean",
                  description:
                    "Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. Note that unlike event-based hold, temporary hold does not impact retention expiration time of an object.",
                },
                timeCreated: {
                  type: "string",
                  description:
                    "The creation time of the object in RFC 3339 format. (Format: date-time)",
                },
                timeDeleted: {
                  type: "string",
                  description:
                    "The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. (Format: date-time)",
                },
                timeFinalized: {
                  type: "string",
                  description:
                    "The time when the object was finalized. (Format: date-time)",
                },
                softDeleteTime: {
                  type: "string",
                  description:
                    "The time at which the object became soft-deleted in RFC 3339 format. (Format: date-time)",
                },
                hardDeleteTime: {
                  type: "string",
                  description:
                    "This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. (Format: date-time)",
                },
                timeStorageClassUpdated: {
                  type: "string",
                  description:
                    "The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. (Format: date-time)",
                },
                updated: {
                  type: "string",
                  description:
                    "The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. This includes changes made by a requester, such as modifying custom metadata, as well as changes made by Cloud Storage on behalf of a requester, such as changing the storage class based on an Object Lifecycle Configuration. (Format: date-time)",
                },
              },
              description: "An object.",
              additionalProperties: true,
            },
            description: "The list of items.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For lists of objects, this is always storage#objects.",
          },
          nextPageToken: {
            type: "string",
            description:
              "The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.",
          },
          prefixes: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of prefixes of objects matching-but-not-listed up to and including the requested delimiter.",
          },
        },
        description: "A list of objects.",
        additionalProperties: true,
      },
    },
  },
};

export default objectsList;
