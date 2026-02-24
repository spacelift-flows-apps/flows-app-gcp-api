import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const objectsCompose: AppBlock = {
  name: "Objects - Compose",
  description: `Concatenates a list of existing objects into a new object in the same bucket.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        destinationBucket: {
          name: "Destination Bucket",
          description:
            "Name of the bucket containing the source objects. The destination object is stored in this bucket.",
          type: {
            type: "string",
          },
          required: true,
        },
        destinationObject: {
          name: "Destination Object",
          description:
            "Name of the new object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding).",
          type: {
            type: "string",
          },
          required: true,
        },
        destinationPredefinedAcl: {
          name: "Destination Predefined ACL",
          description:
            "Apply a predefined set of access controls to the destination object.",
          type: {
            type: "string",
            enum: [
              "authenticatedRead",
              "bucketOwnerFullControl",
              "bucketOwnerRead",
              "private",
              "projectPrivate",
              "publicRead",
            ],
          },
          required: false,
        },
        ifGenerationMatch: {
          name: "If Generation Match",
          description:
            "Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object.",
          type: {
            type: "string",
          },
          required: false,
        },
        ifMetagenerationMatch: {
          name: "If Metageneration Match",
          description:
            "Makes the operation conditional on whether the object's current metageneration matches the given value.",
          type: {
            type: "string",
          },
          required: false,
        },
        kmsKeyName: {
          name: "KMS Key Name",
          description:
            "Resource name of the Cloud KMS key, of the form projects/my-project/locations/global/keyRings/my-kr/cryptoKeys/my-key, that will be used to encrypt the object. Overrides the object metadata's kms_key_name value, if any.",
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
        destination: {
          name: "Destination",
          description: "Properties of the resulting object.",
          type: {
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
          required: false,
        },
        kind: {
          name: "Kind",
          description: "The kind of item this is.",
          type: {
            type: "string",
            description: "The kind of item this is.",
          },
          required: false,
        },
        sourceObjects: {
          name: "Source Objects",
          description:
            "The list of source objects that will be concatenated into a single object.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                generation: {
                  type: "string",
                  description:
                    "The generation of this object to use as the source. (Format: int64)",
                },
                name: {
                  type: "string",
                  description:
                    "The source object's name. All source objects must reside in the same bucket.",
                },
                objectPreconditions: {
                  type: "object",
                  properties: {
                    ifGenerationMatch: {
                      type: "string",
                      description:
                        "Only perform the composition if the generation of the source object that would be used matches this value. If this value and a generation are both specified, they must be the same value or the call will fail. (Format: int64)",
                    },
                  },
                  description:
                    "Conditions that must be met for this operation to execute.",
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
            },
            description:
              "The list of source objects that will be concatenated into a single object.",
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
        let path = `b/{destinationBucket}/o/{destinationObject}/compose`;

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

        if (input.event.inputConfig.destination !== undefined)
          requestBody.destination = input.event.inputConfig.destination;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.sourceObjects !== undefined)
          requestBody.sourceObjects = input.event.inputConfig.sourceObjects;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
                  description: "The domain associated with the entity, if any.",
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
            description: "A collection of object level retention parameters.",
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
    },
  },
};

export default objectsCompose;
