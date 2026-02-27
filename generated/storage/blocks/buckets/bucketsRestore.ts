import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const bucketsRestore: AppBlock = {
  name: "Buckets - Restore",
  description: `Restores a soft-deleted bucket.`,
  category: "Buckets",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of a bucket.",
          type: {
            type: "string",
          },
          required: true,
        },
        generation: {
          name: "Generation",
          description: "Generation of a bucket.",
          type: {
            type: "string",
          },
          required: true,
        },
        projection: {
          name: "Projection",
          description: "Set of properties to return. Defaults to full.",
          type: {
            type: "string",
            enum: ["full", "noAcl"],
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
        let path = `b/{bucket}/restore`;

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
                id: {
                  type: "string",
                  description: "The ID of the access-control entry.",
                },
                kind: {
                  type: "string",
                  description:
                    "The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl.",
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
            description: "Access controls on the bucket.",
          },
          billing: {
            type: "object",
            properties: {
              requesterPays: {
                type: "boolean",
                description:
                  "When set to true, Requester Pays is enabled for this bucket.",
              },
            },
            description: "The bucket's billing configuration.",
            additionalProperties: true,
          },
          cors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                maxAgeSeconds: {
                  type: "integer",
                  description:
                    "The value, in seconds, to return in the  Access-Control-Max-Age header used in preflight responses. (Format: int32)",
                },
                method: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    'The list of HTTP methods on which to include CORS response headers, (GET, OPTIONS, POST, etc) Note: "*" is permitted in the list of methods, and means "any method".',
                },
                origin: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    'The list of Origins eligible to receive CORS response headers. Note: "*" is permitted in the list of origins, and means "any Origin".',
                },
                responseHeader: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The list of HTTP headers other than the simple response headers to give permission for the user-agent to share across domains.",
                },
              },
              additionalProperties: true,
            },
            description:
              "The bucket's Cross-Origin Resource Sharing (CORS) configuration.",
          },
          customPlacementConfig: {
            type: "object",
            properties: {
              dataLocations: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The list of regional locations in which data is placed.",
              },
            },
            description:
              "The bucket's custom placement configuration for Custom Dual Regions.",
            additionalProperties: true,
          },
          defaultEventBasedHold: {
            type: "boolean",
            description:
              "The default value for event-based hold on newly created objects in this bucket. Event-based hold is a way to retain objects indefinitely until an event occurs, signified by the hold's release. After being released, such objects will be subject to bucket-level retention (if any). One sample use case of this flag is for banks to hold loan documents for at least 3 years after loan is paid in full. Here, bucket-level retention is 3 years and the event is loan being paid in full. In this example, these objects will be held intact for any number of years until the event has occurred (event-based hold on the object is released) and then 3 more years after that. That means retention duration of the objects begins from the moment event-based hold transitioned from true to false. Objects under event-based hold cannot be deleted, overwritten or archived until the hold is removed.",
          },
          defaultObjectAcl: {
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
            description:
              "Default access controls to apply to new objects when no ACL is provided.",
          },
          encryption: {
            type: "object",
            properties: {
              defaultKmsKeyName: {
                type: "string",
                description:
                  "A Cloud KMS key that will be used to encrypt objects inserted into this bucket, if no encryption method is specified.",
              },
              googleManagedEncryptionEnforcementConfig: {
                type: "object",
                properties: {
                  restrictionMode: {
                    type: "string",
                    enum: ["NotRestricted", "FullyRestricted"],
                    description:
                      "Restriction mode for Google-Managed Encryption Keys. Defaults to NotRestricted.",
                  },
                  effectiveTime: {
                    type: "string",
                    description:
                      "Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. (Format: date-time)",
                  },
                },
                description:
                  "If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Google Managed Encryption type by default.",
                additionalProperties: true,
              },
              customerManagedEncryptionEnforcementConfig: {
                type: "object",
                properties: {
                  restrictionMode: {
                    type: "string",
                    enum: ["NotRestricted", "FullyRestricted"],
                    description:
                      "Restriction mode for Customer-Managed Encryption Keys. Defaults to NotRestricted.",
                  },
                  effectiveTime: {
                    type: "string",
                    description:
                      "Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. (Format: date-time)",
                  },
                },
                description:
                  "If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Managed Encryption type by default.",
                additionalProperties: true,
              },
              customerSuppliedEncryptionEnforcementConfig: {
                type: "object",
                properties: {
                  restrictionMode: {
                    type: "string",
                    enum: ["NotRestricted", "FullyRestricted"],
                    description:
                      "Restriction mode for Customer-Supplied Encryption Keys. Defaults to NotRestricted.",
                  },
                  effectiveTime: {
                    type: "string",
                    description:
                      "Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. (Format: date-time)",
                  },
                },
                description:
                  "If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Supplied Encryption type by default.",
                additionalProperties: true,
              },
            },
            description: "Encryption configuration for a bucket.",
            additionalProperties: true,
          },
          etag: {
            type: "string",
            description: "HTTP 1.1 Entity tag for the bucket.",
          },
          hierarchicalNamespace: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "When set to true, hierarchical namespace is enabled for this bucket.",
              },
            },
            description: "The bucket's hierarchical namespace configuration.",
            additionalProperties: true,
          },
          iamConfiguration: {
            type: "object",
            properties: {
              bucketPolicyOnly: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "If set, access is controlled only by bucket-level or above IAM policies.",
                  },
                  lockedTime: {
                    type: "string",
                    description:
                      "The deadline for changing iamConfiguration.bucketPolicyOnly.enabled from true to false in RFC 3339 format. iamConfiguration.bucketPolicyOnly.enabled may be changed from true to false until the locked time, after which the field is immutable. (Format: date-time)",
                  },
                },
                description:
                  "The bucket's uniform bucket-level access configuration. The feature was formerly known as Bucket Policy Only. For backward compatibility, this field will be populated with identical information as the uniformBucketLevelAccess field. We recommend using the uniformBucketLevelAccess field to enable and disable the feature.",
                additionalProperties: true,
              },
              uniformBucketLevelAccess: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "If set, access is controlled only by bucket-level or above IAM policies.",
                  },
                  lockedTime: {
                    type: "string",
                    description:
                      "The deadline for changing iamConfiguration.uniformBucketLevelAccess.enabled from true to false in RFC 3339  format. iamConfiguration.uniformBucketLevelAccess.enabled may be changed from true to false until the locked time, after which the field is immutable. (Format: date-time)",
                  },
                },
                description:
                  "The bucket's uniform bucket-level access configuration.",
                additionalProperties: true,
              },
              publicAccessPrevention: {
                type: "string",
                description:
                  "The bucket's Public Access Prevention configuration. Currently, 'inherited' and 'enforced' are supported.",
              },
            },
            description: "The bucket's IAM configuration.",
            additionalProperties: true,
          },
          id: {
            type: "string",
            description:
              "The ID of the bucket. For buckets, the id and name properties are the same.",
          },
          ipFilter: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                description:
                  "The mode of the IP filter. Valid values are 'Enabled' and 'Disabled'.",
              },
              publicNetworkSource: {
                type: "object",
                properties: {
                  allowedIpCidrRanges: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The list of public IPv4, IPv6 cidr ranges that are allowed to access the bucket.",
                  },
                },
                description:
                  "The public network source of the bucket's IP filter.",
                additionalProperties: true,
              },
              vpcNetworkSources: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    network: {
                      type: "string",
                      description:
                        "Name of the network. Format: projects/{PROJECT_ID}/global/networks/{NETWORK_NAME}",
                    },
                    allowedIpCidrRanges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The list of IPv4, IPv6 cidr ranges subnetworks that are allowed to access the bucket.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "The list of [VPC network](https://cloud.google.com/vpc/docs/vpc) sources of the bucket's IP filter.",
              },
              allowCrossOrgVpcs: {
                type: "boolean",
                description:
                  "Whether to allow cross-org VPCs in the bucket's IP filter configuration.",
              },
              allowAllServiceAgentAccess: {
                type: "boolean",
                description:
                  "Whether to allow all service agents to access the bucket regardless of the IP filter configuration.",
              },
            },
            description:
              "The bucket's IP filter configuration. Specifies the network sources that are allowed to access the operations on the bucket, as well as its underlying objects. Only enforced when the mode is set to 'Enabled'.",
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For buckets, this is always storage#bucket.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "User-provided labels, in key/value pairs.",
          },
          lifecycle: {
            type: "object",
            properties: {
              rule: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: {
                      type: "object",
                      properties: {
                        storageClass: {
                          type: "string",
                          description:
                            "Target storage class. Required iff the type of the action is SetStorageClass.",
                        },
                        type: {
                          type: "string",
                          description:
                            "Type of the action. Currently, only Delete, SetStorageClass, and AbortIncompleteMultipartUpload are supported.",
                        },
                      },
                      description: "The action to take.",
                      additionalProperties: true,
                    },
                    condition: {
                      type: "object",
                      properties: {
                        age: {
                          type: "integer",
                          description:
                            "Age of an object (in days). This condition is satisfied when an object reaches the specified age. (Format: int32)",
                        },
                        createdBefore: {
                          type: "string",
                          description:
                            'A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when an object is created before midnight of the specified date in UTC. (Format: date)',
                        },
                        customTimeBefore: {
                          type: "string",
                          description:
                            'A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the custom time on an object is before this date in UTC. (Format: date)',
                        },
                        daysSinceCustomTime: {
                          type: "integer",
                          description:
                            "Number of days elapsed since the user-specified timestamp set on an object. The condition is satisfied if the days elapsed is at least this number. If no custom timestamp is specified on an object, the condition does not apply. (Format: int32)",
                        },
                        daysSinceNoncurrentTime: {
                          type: "integer",
                          description:
                            "Number of days elapsed since the noncurrent timestamp of an object. The condition is satisfied if the days elapsed is at least this number. This condition is relevant only for versioned objects. The value of the field must be a nonnegative integer. If it's zero, the object version will become eligible for Lifecycle action as soon as it becomes noncurrent. (Format: int32)",
                        },
                        isLive: {
                          type: "boolean",
                          description:
                            "Relevant only for versioned objects. If the value is true, this condition matches live objects; if the value is false, it matches archived objects.",
                        },
                        matchesPattern: {
                          type: "string",
                          description:
                            'A regular expression that satisfies the RE2 syntax. This condition is satisfied when the name of the object matches the RE2 pattern. Note: This feature is currently in the "Early Access" launch stage and is only available to a whitelisted set of users; that means that this feature may be changed in backward-incompatible ways and that it is not guaranteed to be released.',
                        },
                        matchesPrefix: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "List of object name prefixes. This condition will be satisfied when at least one of the prefixes exactly matches the beginning of the object name.",
                        },
                        matchesSuffix: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "List of object name suffixes. This condition will be satisfied when at least one of the suffixes exactly matches the end of the object name.",
                        },
                        matchesStorageClass: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Objects having any of the storage classes specified by this condition will be matched. Values include MULTI_REGIONAL, REGIONAL, NEARLINE, COLDLINE, ARCHIVE, STANDARD, and DURABLE_REDUCED_AVAILABILITY.",
                        },
                        noncurrentTimeBefore: {
                          type: "string",
                          description:
                            'A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the noncurrent time on an object is before this date in UTC. This condition is relevant only for versioned objects. (Format: date)',
                        },
                        numNewerVersions: {
                          type: "integer",
                          description:
                            "Relevant only for versioned objects. If the value is N, this condition is satisfied when there are at least N versions (including the live version) newer than this version of the object. (Format: int32)",
                        },
                      },
                      description:
                        "The condition(s) under which the action will be taken.",
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "A lifecycle management rule, which is made of an action to take and the condition(s) under which the action will be taken.",
              },
            },
            description:
              "The bucket's lifecycle configuration. See [Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle) for more information.",
            additionalProperties: true,
          },
          autoclass: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "Whether or not Autoclass is enabled on this bucket",
              },
              toggleTime: {
                type: "string",
                description:
                  'A date and time in RFC 3339 format representing the instant at which "enabled" was last toggled. (Format: date-time)',
              },
              terminalStorageClass: {
                type: "string",
                description:
                  "The storage class that objects in the bucket eventually transition to if they are not read for a certain length of time. Valid values are NEARLINE and ARCHIVE.",
              },
              terminalStorageClassUpdateTime: {
                type: "string",
                description:
                  'A date and time in RFC 3339 format representing the time of the most recent update to "terminalStorageClass". (Format: date-time)',
              },
            },
            description: "The bucket's Autoclass configuration.",
            additionalProperties: true,
          },
          location: {
            type: "string",
            description:
              "The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Defaults to US. See the [Developer's Guide](https://cloud.google.com/storage/docs/locations) for the authoritative list.",
          },
          locationType: {
            type: "string",
            description: "The type of the bucket location.",
          },
          logging: {
            type: "object",
            properties: {
              logBucket: {
                type: "string",
                description:
                  "The destination bucket where the current bucket's logs should be placed.",
              },
              logObjectPrefix: {
                type: "string",
                description: "A prefix for log object names.",
              },
            },
            description:
              "The bucket's logging configuration, which defines the destination bucket and optional name prefix for the current bucket's logs.",
            additionalProperties: true,
          },
          generation: {
            type: "string",
            description: "The generation of this bucket. (Format: int64)",
          },
          metageneration: {
            type: "string",
            description:
              "The metadata generation of this bucket. (Format: int64)",
          },
          name: {
            type: "string",
            description: "The name of the bucket.",
          },
          owner: {
            type: "object",
            properties: {
              entity: {
                type: "string",
                description: "The entity, in the form project-owner-projectId.",
              },
              entityId: {
                type: "string",
                description: "The ID for the entity.",
              },
            },
            description:
              "The owner of the bucket. This is always the project team's owner group.",
            additionalProperties: true,
          },
          projectNumber: {
            type: "string",
            description:
              "The project number of the project the bucket belongs to. (Format: uint64)",
          },
          retentionPolicy: {
            type: "object",
            properties: {
              effectiveTime: {
                type: "string",
                description:
                  "Server-determined value that indicates the time from which policy was enforced and effective. This value is in RFC 3339 format. (Format: date-time)",
              },
              isLocked: {
                type: "boolean",
                description:
                  "Once locked, an object retention policy cannot be modified.",
              },
              retentionPeriod: {
                type: "string",
                description:
                  "The duration in seconds that objects need to be retained. Retention duration must be greater than zero and less than 100 years. Note that enforcement of retention periods less than a day is not guaranteed. Such periods should only be used for testing purposes. (Format: int64)",
              },
            },
            description:
              "The bucket's retention policy. The retention policy enforces a minimum retention time for all objects contained in the bucket, based on their creation time. Any attempt to overwrite or delete objects younger than the retention period will result in a PERMISSION_DENIED error. An unlocked retention policy can be modified or removed from the bucket via a storage.buckets.update operation. A locked retention policy cannot be removed or shortened in duration for the lifetime of the bucket. Attempting to remove or decrease period of a locked retention policy will result in a PERMISSION_DENIED error.",
            additionalProperties: true,
          },
          objectRetention: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                description:
                  "The bucket's object retention mode. Can be Enabled.",
              },
            },
            description: "The bucket's object retention config.",
            additionalProperties: true,
          },
          rpo: {
            type: "string",
            description:
              "The Recovery Point Objective (RPO) of this bucket. Set to ASYNC_TURBO to turn on Turbo Replication on a bucket.",
          },
          selfLink: {
            type: "string",
            description: "The URI of this bucket.",
          },
          softDeletePolicy: {
            type: "object",
            properties: {
              retentionDurationSeconds: {
                type: "string",
                description:
                  "The duration in seconds that soft-deleted objects in the bucket will be retained and cannot be permanently deleted. (Format: int64)",
              },
              effectiveTime: {
                type: "string",
                description:
                  "Server-determined value that indicates the time from which the policy, or one with a greater retention, was effective. This value is in RFC 3339 format. (Format: date-time)",
              },
            },
            description:
              "The bucket's soft delete policy, which defines the period of time that soft-deleted objects will be retained, and cannot be permanently deleted.",
            additionalProperties: true,
          },
          storageClass: {
            type: "string",
            description:
              "The bucket's default storage class, used whenever no storageClass is specified for a newly-created object. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. Values include MULTI_REGIONAL, REGIONAL, STANDARD, NEARLINE, COLDLINE, ARCHIVE, and DURABLE_REDUCED_AVAILABILITY. If this value is not specified when the bucket is created, it will default to STANDARD. For more information, see [Storage Classes](https://cloud.google.com/storage/docs/storage-classes).",
          },
          timeCreated: {
            type: "string",
            description:
              "The creation time of the bucket in RFC 3339 format. (Format: date-time)",
          },
          updated: {
            type: "string",
            description:
              "The modification time of the bucket in RFC 3339 format. (Format: date-time)",
          },
          softDeleteTime: {
            type: "string",
            description:
              "The soft delete time of the bucket in RFC 3339 format. (Format: date-time)",
          },
          hardDeleteTime: {
            type: "string",
            description:
              "The hard delete time of the bucket in RFC 3339 format. (Format: date-time)",
          },
          versioning: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "While set to true, versioning is fully enabled for this bucket.",
              },
            },
            description: "The bucket's versioning configuration.",
            additionalProperties: true,
          },
          website: {
            type: "object",
            properties: {
              mainPageSuffix: {
                type: "string",
                description:
                  "If the requested object path is missing, the service will ensure the path has a trailing '/', append this suffix, and attempt to retrieve the resulting object. This allows the creation of index.html objects to represent directory pages.",
              },
              notFoundPage: {
                type: "string",
                description:
                  "If the requested object path is missing, and any mainPageSuffix object is missing, if applicable, the service will return the named object from this bucket as the content for a 404 Not Found result.",
              },
            },
            description:
              "The bucket's website configuration, controlling how the service behaves when accessing bucket contents as a web site. See the [Static Website Examples](https://cloud.google.com/storage/docs/static-website) for more information.",
            additionalProperties: true,
          },
          satisfiesPZS: {
            type: "boolean",
            description: "Reserved for future use.",
          },
          satisfiesPZI: {
            type: "boolean",
            description: "Reserved for future use.",
          },
        },
        description: "A bucket.",
        additionalProperties: true,
      },
    },
  },
};

export default bucketsRestore;
