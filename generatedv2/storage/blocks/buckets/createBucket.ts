import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const createBucket: AppBlock = {
  name: "Create Bucket",
  description: `Creates a new bucket. **IAM Permissions**: Requires 'storage.buckets.create' IAM permission on the bucket. Additionally, to enable specific bucket features, the authenticated user must have the following permissions: - To enable object retention using the 'enableObjectRetention' query parameter: 'storage.buckets.enableObjectRetention' - To set the bucket IP filtering rules: 'storage.buckets.setIpFilter'`,
  category: "Buckets",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The project to which this bucket belongs. This field must either be empty or `projects/_`. The project ID that owns this bucket should be specified in the `bucket.project` field.",
          type: {
            type: "string",
            description:
              "Required. The project to which this bucket belongs. This field must either be empty or `projects/_`. The project ID that owns this bucket should be specified in the `bucket.project` field.",
          },
          required: true,
        },
        bucket: {
          name: "Bucket",
          description:
            "Optional. Properties of the new bucket being inserted. The name of the bucket is specified in the `bucket_id` field. Populating `bucket.name` field results in an error. The project of the bucket must be specified in the `bucket.project` field. This field must be in `projects/{projectIdentifier}` format, {projectIdentifier} can be the project ID or project number. The `parent` field must be either empty or `projects/_`.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "Identifier. The name of the bucket. Format: `projects/{project}/buckets/{bucket}`",
              },
              etag: {
                type: "string",
                description:
                  "The etag of the bucket. If included in the metadata of an `UpdateBucketRequest`, the operation is only performed if the `etag` matches that of the bucket.",
              },
              project: {
                type: "string",
                description:
                  "Immutable. The project which owns this bucket, in the format of `projects/{projectIdentifier}`. `{projectIdentifier}` can be the project ID or project number. Output values are always in the project number format.",
              },
              location: {
                type: "string",
                description:
                  "Immutable. The location of the bucket. Object data for objects in the bucket resides in physical storage within this region.  Defaults to `US`. Attempting to update this field after the bucket is created results in an error.",
              },
              storage_class: {
                type: "string",
                description:
                  "Optional. The bucket's default storage class, used whenever no storageClass is specified for a newly-created object. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. If this value is not specified when the bucket is created, it defaults to `STANDARD`. For more information, see [Storage classes](https://developers.google.com/storage/docs/storage-classes).",
              },
              rpo: {
                type: "string",
                description:
                  "Optional. The recovery point objective for cross-region replication of the bucket. Applicable only for dual- and multi-region buckets. `DEFAULT` uses default replication. `ASYNC_TURBO` enables turbo replication, valid for dual-region buckets only. If rpo is not specified when the bucket is created, it defaults to `DEFAULT`. For more information, see [Turbo replication](https://cloud.google.com/storage/docs/availability-durability#turbo-replication).",
              },
              acl: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    role: {
                      type: "string",
                      description:
                        "Optional. The access permission for the entity.",
                    },
                    id: {
                      type: "string",
                      description:
                        "Optional. The ID of the access-control entry.",
                    },
                    entity: {
                      type: "string",
                      description:
                        "Optional. The entity holding the permission, in one of the following forms: * `user-{userid}` * `user-{email}` * `group-{groupid}` * `group-{email}` * `domain-{domain}` * `project-{team}-{projectnumber}` * `project-{team}-{projectid}` * `allUsers` * `allAuthenticatedUsers` Examples: * The user `liz@example.com` would be `user-liz@example.com`. * The group `example@googlegroups.com` would be `group-example@googlegroups.com` * All members of the Google Apps for Business domain `example.com` would be `domain-example.com` For project entities, `project-{team}-{projectnumber}` format is returned on response.",
                    },
                    entity_id: {
                      type: "string",
                      description: "Optional. The ID for the entity, if any.",
                    },
                    etag: {
                      type: "string",
                      description:
                        "Optional. The `etag` of the `BucketAccessControl`. If included in the metadata of an update or delete request message, the operation operation is only performed if the etag matches that of the bucket's `BucketAccessControl`.",
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
                  "Optional. Access controls on the bucket. If `iam_config.uniform_bucket_level_access` is enabled on this bucket, requests to set, read, or modify acl is an error.",
              },
              default_object_acl: {
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
                  "Optional. Default access controls to apply to new objects when no ACL is provided. If `iam_config.uniform_bucket_level_access` is enabled on this bucket, requests to set, read, or modify acl is an error.",
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
                            type: {
                              type: "string",
                              description:
                                "Optional. Type of the action. Currently, only `Delete`, `SetStorageClass`, and `AbortIncompleteMultipartUpload` are supported.",
                            },
                            storage_class: {
                              type: "string",
                              description:
                                "Optional. Target storage class. Required iff the type of the action is SetStorageClass.",
                            },
                          },
                          description: "An action to take on an object.",
                          additionalProperties: true,
                        },
                        condition: {
                          type: "object",
                          properties: {
                            age_days: {
                              type: "integer",
                              description:
                                "Age of an object (in days). This condition is satisfied when an object reaches the specified age. A value of 0 indicates that all objects immediately match this condition.",
                            },
                            created_before: {
                              type: "object",
                              properties: {
                                year: {
                                  type: "integer",
                                },
                                month: {
                                  type: "integer",
                                },
                                day: {
                                  type: "integer",
                                },
                              },
                              additionalProperties: true,
                              description:
                                "Optional. This condition is satisfied when an object is created before midnight of the specified date in UTC.",
                            },
                            is_live: {
                              type: "boolean",
                              description:
                                "Relevant only for versioned objects. If the value is `true`, this condition matches live objects; if the value is `false`, it matches archived objects.",
                            },
                            num_newer_versions: {
                              type: "integer",
                              description:
                                "Relevant only for versioned objects. If the value is N, this condition is satisfied when there are at least N versions (including the live version) newer than this version of the object.",
                            },
                            matches_storage_class: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "Optional. Objects having any of the storage classes specified by this condition are matched. Values include `MULTI_REGIONAL`, `REGIONAL`, `NEARLINE`, `COLDLINE`, `STANDARD`, and `DURABLE_REDUCED_AVAILABILITY`.",
                            },
                            days_since_custom_time: {
                              type: "integer",
                              description:
                                "Number of days that have elapsed since the custom timestamp set on an object. The value of the field must be a nonnegative integer.",
                            },
                            custom_time_before: {
                              type: "object",
                              properties: {
                                year: {
                                  type: "integer",
                                },
                                month: {
                                  type: "integer",
                                },
                                day: {
                                  type: "integer",
                                },
                              },
                              additionalProperties: true,
                              description:
                                "Optional. An object matches this condition if the custom timestamp set on the object is before the specified date in UTC.",
                            },
                            days_since_noncurrent_time: {
                              type: "integer",
                              description:
                                "This condition is relevant only for versioned objects. An object version satisfies this condition only if these many days have been passed since it became noncurrent. The value of the field must be a nonnegative integer. If it's zero, the object version becomes eligible for Lifecycle action as soon as it becomes noncurrent.",
                            },
                            noncurrent_time_before: {
                              type: "object",
                              properties: {
                                year: {
                                  type: "integer",
                                },
                                month: {
                                  type: "integer",
                                },
                                day: {
                                  type: "integer",
                                },
                              },
                              additionalProperties: true,
                              description:
                                "Optional. This condition is relevant only for versioned objects. An object version satisfies this condition only if it became noncurrent before the specified date in UTC.",
                            },
                            matches_prefix: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "Optional. List of object name prefixes. If any prefix exactly matches the beginning of the object name, the condition evaluates to true.",
                            },
                            matches_suffix: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                              description:
                                "Optional. List of object name suffixes. If any suffix exactly matches the end of the object name, the condition evaluates to true.",
                            },
                          },
                          description:
                            "A condition of an object which triggers some action.",
                          additionalProperties: true,
                        },
                      },
                      description:
                        "A lifecycle Rule, combining an action to take on an object and a condition which triggers that action.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. A lifecycle management rule, which is made of an action to take and the condition under which the action is taken.",
                  },
                },
                description:
                  "Lifecycle properties of a bucket. For more information, see [Object Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle).",
                additionalProperties: true,
              },
              cors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    origin: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Optional. The list of origins eligible to receive CORS response headers. For more information about origins, see [RFC 6454](https://tools.ietf.org/html/rfc6454). Note: `*` is permitted in the list of origins, and means `any origin`.",
                    },
                    method: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        'Optional. The list of HTTP methods on which to include CORS response headers, (`GET`, `OPTIONS`, `POST`, etc) Note: `*` is permitted in the list of methods, and means "any method".',
                    },
                    response_header: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Optional. The list of HTTP headers other than the [simple response headers](https://www.w3.org/TR/cors/#simple-response-headers) to give permission for the user-agent to share across domains.",
                    },
                    max_age_seconds: {
                      type: "integer",
                      description:
                        "Optional. The value, in seconds, to return in the [Access-Control-Max-Age header](https://www.w3.org/TR/cors/#access-control-max-age-response-header) used in preflight responses.",
                    },
                  },
                  description:
                    "Cross-Origin Response sharing (CORS) properties for a bucket. For more on Cloud Storage and CORS, see https://cloud.google.com/storage/docs/cross-origin. For more on CORS in general, see https://tools.ietf.org/html/rfc6454.",
                  additionalProperties: true,
                },
                description:
                  "Optional. The bucket's [CORS](https://www.w3.org/TR/cors/) configuration.",
              },
              default_event_based_hold: {
                type: "boolean",
                description:
                  "Optional. The default value for event-based hold on newly created objects in this bucket.  Event-based hold is a way to retain objects indefinitely until an event occurs, signified by the hold's release. After being released, such objects are subject to bucket-level retention (if any).  One sample use case of this flag is for banks to hold loan documents for at least 3 years after loan is paid in full. Here, bucket-level retention is 3 years and the event is loan being paid in full. In this example, these objects are held intact for any number of years until the event has occurred (event-based hold on the object is released) and then 3 more years after that. That means retention duration of the objects begins from the moment event-based hold transitioned from true to false.  Objects under event-based hold cannot be deleted, overwritten or archived until the hold is removed.",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Optional. User-provided labels, in key/value pairs.",
              },
              website: {
                type: "object",
                properties: {
                  main_page_suffix: {
                    type: "string",
                    description:
                      "Optional. If the requested object path is missing, the service ensures the path has a trailing '/', append this suffix, and attempt to retrieve the resulting object. This allows the creation of `index.html` objects to represent directory pages.",
                  },
                  not_found_page: {
                    type: "string",
                    description:
                      "Optional. If the requested object path is missing, and any `mainPageSuffix` object is missing, if applicable, the service returns the named object from this bucket as the content for a [404 Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) result.",
                  },
                },
                description:
                  "Properties of a bucket related to accessing the contents as a static website. For details, see [hosting a static website using Cloud Storage](https://cloud.google.com/storage/docs/hosting-static-website).",
                additionalProperties: true,
              },
              versioning: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Optional. While set to true, versioning is fully enabled for this bucket.",
                  },
                },
                description:
                  "Properties of a bucket related to versioning. For more information about Cloud Storage versioning, see [Object versioning](https://cloud.google.com/storage/docs/object-versioning).",
                additionalProperties: true,
              },
              logging: {
                type: "object",
                properties: {
                  log_bucket: {
                    type: "string",
                    description:
                      "Optional. The destination bucket where the current bucket's logs should be placed, using path format (like `projects/123456/buckets/foo`).",
                  },
                  log_object_prefix: {
                    type: "string",
                    description: "Optional. A prefix for log object names.",
                  },
                },
                description: "Logging-related properties of a bucket.",
                additionalProperties: true,
              },
              encryption: {
                type: "object",
                properties: {
                  default_kms_key: {
                    type: "string",
                    description:
                      "Optional. The name of the Cloud KMS key that is used to encrypt objects inserted into this bucket, if no encryption method is specified.",
                  },
                  google_managed_encryption_enforcement_config: {
                    type: "object",
                    properties: {
                      restriction_mode: {
                        type: "string",
                        description:
                          "Restriction mode for google-managed encryption for new objects within the bucket. Valid values are: `NotRestricted` and `FullyRestricted`. If `NotRestricted` or unset, creation of new objects with google-managed encryption is allowed. If `FullyRestricted`, new objects can't be created using google-managed encryption.",
                      },
                      effective_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                    },
                    description:
                      "Google Managed Encryption (GMEK) enforcement config of a bucket.",
                    additionalProperties: true,
                  },
                  customer_managed_encryption_enforcement_config: {
                    type: "object",
                    properties: {
                      restriction_mode: {
                        type: "string",
                        description:
                          "Restriction mode for customer-managed encryption for new objects within the bucket. Valid values are: `NotRestricted` and `FullyRestricted`. If `NotRestricted` or unset, creation of new objects with customer-managed encryption is allowed. If `FullyRestricted`, new objects can't be created using customer-managed encryption.",
                      },
                      effective_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                    },
                    description:
                      "Customer Managed Encryption (CMEK) enforcement config of a bucket.",
                    additionalProperties: true,
                  },
                  customer_supplied_encryption_enforcement_config: {
                    type: "object",
                    properties: {
                      restriction_mode: {
                        type: "string",
                        description:
                          "Restriction mode for customer-supplied encryption for new objects within the bucket. Valid values are: `NotRestricted` and `FullyRestricted`. If `NotRestricted` or unset, creation of new objects with customer-supplied encryption is allowed. If `FullyRestricted`, new objects can't be created using customer-supplied encryption.",
                      },
                      effective_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                    },
                    description:
                      "Customer Supplied Encryption (CSEK) enforcement config of a bucket.",
                    additionalProperties: true,
                  },
                },
                description: "Encryption properties of a bucket.",
                additionalProperties: true,
              },
              billing: {
                type: "object",
                properties: {
                  requester_pays: {
                    type: "boolean",
                    description:
                      "Optional. When set to true, Requester Pays is enabled for this bucket.",
                  },
                },
                description: "Billing properties of a bucket.",
                additionalProperties: true,
              },
              retention_policy: {
                type: "object",
                properties: {
                  effective_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                  is_locked: {
                    type: "boolean",
                    description:
                      "Optional. Once locked, an object retention policy cannot be modified.",
                  },
                  retention_duration: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                },
                description: "Retention policy properties of a bucket.",
                additionalProperties: true,
              },
              iam_config: {
                type: "object",
                properties: {
                  uniform_bucket_level_access: {
                    type: "object",
                    properties: {
                      enabled: {
                        type: "boolean",
                        description:
                          "Optional. If set, access checks only use bucket-level IAM policies or above.",
                      },
                      lock_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                    },
                    description:
                      "Settings for Uniform Bucket level access. See https://cloud.google.com/storage/docs/uniform-bucket-level-access.",
                    additionalProperties: true,
                  },
                  public_access_prevention: {
                    type: "string",
                    description:
                      "Optional. Whether IAM enforces public access prevention. Valid values are `enforced` or `inherited`.",
                  },
                },
                description: "Bucket restriction options.",
                additionalProperties: true,
              },
              satisfies_pzs: {
                type: "boolean",
                description: "Optional. Reserved for future use.",
              },
              custom_placement_config: {
                type: "object",
                properties: {
                  data_locations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Optional. List of locations to use for data placement.",
                  },
                },
                description:
                  "Configuration for [configurable dual- regions](https://cloud.google.com/storage/docs/locations#configurable). It should specify precisely two eligible regions within the same multi-region. For details, see [locations](https://cloud.google.com/storage/docs/locations).",
                additionalProperties: true,
              },
              autoclass: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "Optional. Enables Autoclass.",
                  },
                  terminal_storage_class: {
                    type: "string",
                    description:
                      "An object in an Autoclass bucket eventually cools down to the terminal storage class if there is no access to the object. The only valid values are NEARLINE and ARCHIVE.",
                  },
                },
                description: "Configuration for a bucket's Autoclass feature.",
                additionalProperties: true,
              },
              hierarchical_namespace: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Optional. Enables the hierarchical namespace feature.",
                  },
                },
                description:
                  "Configuration for a bucket's hierarchical namespace feature.",
                additionalProperties: true,
              },
              soft_delete_policy: {
                type: "object",
                properties: {
                  retention_duration: {
                    type: "string",
                    description: "Duration string (e.g., '1.5s', '300s')",
                  },
                  effective_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description: "Soft delete policy properties of a bucket.",
                additionalProperties: true,
              },
              object_retention: {
                type: "object",
                properties: {},
                description: "Object Retention related properties of a bucket.",
                additionalProperties: true,
              },
              ip_filter: {
                type: "object",
                properties: {
                  mode: {
                    type: "string",
                    description:
                      "The state of the IP filter configuration. Valid values are `Enabled` and `Disabled`. When set to `Enabled`, IP filtering rules are applied to a bucket and all incoming requests to the bucket are evaluated against these rules. When set to `Disabled`, IP filtering rules are not applied to a bucket.",
                  },
                  public_network_source: {
                    type: "object",
                    properties: {
                      allowed_ip_cidr_ranges: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Optional. The list of IPv4 and IPv6 cidr blocks that are allowed to operate or access the bucket and its underlying objects.",
                      },
                    },
                    description:
                      "The public network IP address ranges that can access the bucket and its data.",
                    additionalProperties: true,
                  },
                  vpc_network_sources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        network: {
                          type: "string",
                          description:
                            "Name of the network.  Format: `projects/PROJECT_ID/global/networks/NETWORK_NAME`",
                        },
                        allowed_ip_cidr_ranges: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Optional. The list of public or private IPv4 and IPv6 CIDR ranges that can access the bucket. In the CIDR IP address block, the specified IP address must be properly truncated, meaning all the host bits must be zero or else the input is considered malformed. For example, `192.0.2.0/24` is accepted but `192.0.2.1/24` is not. Similarly, for IPv6, `2001:db8::/32` is accepted whereas `2001:db8::1/32` is not.",
                        },
                      },
                      description:
                        "The list of VPC networks that can access the bucket.",
                      additionalProperties: true,
                    },
                    description:
                      "Optional. The list of network sources that are allowed to access operations on the bucket or the underlying objects.",
                  },
                  allow_cross_org_vpcs: {
                    type: "boolean",
                    description:
                      "Optional. Whether or not to allow VPCs from orgs different than the bucket's parent org to access the bucket. When set to true, validations on the existence of the VPCs won't be performed. If set to false, each VPC network source is checked to belong to the same org as the bucket as well as validated for existence.",
                  },
                  allow_all_service_agent_access: {
                    type: "boolean",
                    description:
                      "Whether or not to allow all P4SA access to the bucket. When set to true, IP filter config validation doesn't apply.",
                  },
                },
                description:
                  "The [bucket IP filtering](https://cloud.google.com/storage/docs/ip-filtering-overview) configuration. Specifies the network sources that can access the bucket, as well as its underlying objects.",
                additionalProperties: true,
              },
            },
            description: "A bucket.",
            additionalProperties: true,
          },
          required: false,
        },
        bucket_id: {
          name: "Bucket Id",
          description:
            "Required. The ID to use for this bucket, which becomes the final component of the bucket's resource name. For example, the value `foo` might result in a bucket with the name `projects/123456/buckets/foo`.",
          type: {
            type: "string",
            description:
              "Required. The ID to use for this bucket, which becomes the final component of the bucket's resource name. For example, the value `foo` might result in a bucket with the name `projects/123456/buckets/foo`.",
          },
          required: true,
        },
        predefined_acl: {
          name: "Predefined Acl",
          description:
            "Optional. Apply a predefined set of access controls to this bucket. Valid values are `authenticatedRead`, `private`, `projectPrivate`, `publicRead`, or `publicReadWrite`.",
          type: {
            type: "string",
            description:
              "Optional. Apply a predefined set of access controls to this bucket. Valid values are `authenticatedRead`, `private`, `projectPrivate`, `publicRead`, or `publicReadWrite`.",
          },
          required: false,
        },
        predefined_default_object_acl: {
          name: "Predefined Default Object Acl",
          description:
            "Optional. Apply a predefined set of default object access controls to this bucket. Valid values are `authenticatedRead`, `bucketOwnerFullControl`, `bucketOwnerRead`, `private`, `projectPrivate`, or `publicRead`.",
          type: {
            type: "string",
            description:
              "Optional. Apply a predefined set of default object access controls to this bucket. Valid values are `authenticatedRead`, `bucketOwnerFullControl`, `bucketOwnerRead`, `private`, `projectPrivate`, or `publicRead`.",
          },
          required: false,
        },
        enable_object_retention: {
          name: "Enable Object Retention",
          description:
            "Optional. If true, enable object retention on the bucket.",
          type: {
            type: "boolean",
            description:
              "Optional. If true, enable object retention on the bucket.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.bucket !== undefined)
          request.bucket = input.event.inputConfig.bucket;
        if (input.event.inputConfig.bucket_id !== undefined)
          request.bucket_id = input.event.inputConfig.bucket_id;
        if (input.event.inputConfig.predefined_acl !== undefined)
          request.predefined_acl = input.event.inputConfig.predefined_acl;
        if (input.event.inputConfig.predefined_default_object_acl !== undefined)
          request.predefined_default_object_acl =
            input.event.inputConfig.predefined_default_object_acl;
        if (input.event.inputConfig.enable_object_retention !== undefined)
          request.enable_object_retention =
            input.event.inputConfig.enable_object_retention;

        const routingParams: Record<string, string> = {};
        if (request.parent !== undefined)
          routingParams["project"] = String(request.parent);
        if (request.bucket?.project !== undefined)
          routingParams["project"] = String(request.bucket?.project);
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.createBucket(request, metadata, (err: any, response: any) => {
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
              "Identifier. The name of the bucket. Format: `projects/{project}/buckets/{bucket}`",
          },
          bucket_id: {
            type: "string",
            description:
              "Output only. The user-chosen part of the bucket name. The `{bucket}` portion of the `name` field. For globally unique buckets, this is equal to the `bucket name` of other Cloud Storage APIs. Example: `pub`.",
          },
          etag: {
            type: "string",
            description:
              "The etag of the bucket. If included in the metadata of an `UpdateBucketRequest`, the operation is only performed if the `etag` matches that of the bucket.",
          },
          project: {
            type: "string",
            description:
              "Immutable. The project which owns this bucket, in the format of `projects/{projectIdentifier}`. `{projectIdentifier}` can be the project ID or project number. Output values are always in the project number format.",
          },
          metageneration: {
            type: "string",
            description: "64-bit integer as string",
          },
          location: {
            type: "string",
            description:
              "Immutable. The location of the bucket. Object data for objects in the bucket resides in physical storage within this region.  Defaults to `US`. Attempting to update this field after the bucket is created results in an error.",
          },
          location_type: {
            type: "string",
            description:
              "Output only. The location type of the bucket (region, dual-region, multi-region, etc).",
          },
          storage_class: {
            type: "string",
            description:
              "Optional. The bucket's default storage class, used whenever no storageClass is specified for a newly-created object. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. If this value is not specified when the bucket is created, it defaults to `STANDARD`. For more information, see [Storage classes](https://developers.google.com/storage/docs/storage-classes).",
          },
          rpo: {
            type: "string",
            description:
              "Optional. The recovery point objective for cross-region replication of the bucket. Applicable only for dual- and multi-region buckets. `DEFAULT` uses default replication. `ASYNC_TURBO` enables turbo replication, valid for dual-region buckets only. If rpo is not specified when the bucket is created, it defaults to `DEFAULT`. For more information, see [Turbo replication](https://cloud.google.com/storage/docs/availability-durability#turbo-replication).",
          },
          acl: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                  description:
                    "Optional. The access permission for the entity.",
                },
                id: {
                  type: "string",
                  description: "Optional. The ID of the access-control entry.",
                },
                entity: {
                  type: "string",
                  description:
                    "Optional. The entity holding the permission, in one of the following forms: * `user-{userid}` * `user-{email}` * `group-{groupid}` * `group-{email}` * `domain-{domain}` * `project-{team}-{projectnumber}` * `project-{team}-{projectid}` * `allUsers` * `allAuthenticatedUsers` Examples: * The user `liz@example.com` would be `user-liz@example.com`. * The group `example@googlegroups.com` would be `group-example@googlegroups.com` * All members of the Google Apps for Business domain `example.com` would be `domain-example.com` For project entities, `project-{team}-{projectnumber}` format is returned on response.",
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
                    "Optional. The `etag` of the `BucketAccessControl`. If included in the metadata of an update or delete request message, the operation operation is only performed if the etag matches that of the bucket's `BucketAccessControl`.",
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
              "Optional. Access controls on the bucket. If `iam_config.uniform_bucket_level_access` is enabled on this bucket, requests to set, read, or modify acl is an error.",
          },
          default_object_acl: {
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
              "Optional. Default access controls to apply to new objects when no ACL is provided. If `iam_config.uniform_bucket_level_access` is enabled on this bucket, requests to set, read, or modify acl is an error.",
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
                        type: {
                          type: "string",
                          description:
                            "Optional. Type of the action. Currently, only `Delete`, `SetStorageClass`, and `AbortIncompleteMultipartUpload` are supported.",
                        },
                        storage_class: {
                          type: "string",
                          description:
                            "Optional. Target storage class. Required iff the type of the action is SetStorageClass.",
                        },
                      },
                      description: "An action to take on an object.",
                      additionalProperties: true,
                    },
                    condition: {
                      type: "object",
                      properties: {
                        age_days: {
                          type: "integer",
                          description:
                            "Age of an object (in days). This condition is satisfied when an object reaches the specified age. A value of 0 indicates that all objects immediately match this condition.",
                        },
                        created_before: {
                          type: "object",
                          properties: {
                            year: {
                              type: "integer",
                            },
                            month: {
                              type: "integer",
                            },
                            day: {
                              type: "integer",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "Optional. This condition is satisfied when an object is created before midnight of the specified date in UTC.",
                        },
                        is_live: {
                          type: "boolean",
                          description:
                            "Relevant only for versioned objects. If the value is `true`, this condition matches live objects; if the value is `false`, it matches archived objects.",
                        },
                        num_newer_versions: {
                          type: "integer",
                          description:
                            "Relevant only for versioned objects. If the value is N, this condition is satisfied when there are at least N versions (including the live version) newer than this version of the object.",
                        },
                        matches_storage_class: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Optional. Objects having any of the storage classes specified by this condition are matched. Values include `MULTI_REGIONAL`, `REGIONAL`, `NEARLINE`, `COLDLINE`, `STANDARD`, and `DURABLE_REDUCED_AVAILABILITY`.",
                        },
                        days_since_custom_time: {
                          type: "integer",
                          description:
                            "Number of days that have elapsed since the custom timestamp set on an object. The value of the field must be a nonnegative integer.",
                        },
                        custom_time_before: {
                          type: "object",
                          properties: {
                            year: {
                              type: "integer",
                            },
                            month: {
                              type: "integer",
                            },
                            day: {
                              type: "integer",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "Optional. An object matches this condition if the custom timestamp set on the object is before the specified date in UTC.",
                        },
                        days_since_noncurrent_time: {
                          type: "integer",
                          description:
                            "This condition is relevant only for versioned objects. An object version satisfies this condition only if these many days have been passed since it became noncurrent. The value of the field must be a nonnegative integer. If it's zero, the object version becomes eligible for Lifecycle action as soon as it becomes noncurrent.",
                        },
                        noncurrent_time_before: {
                          type: "object",
                          properties: {
                            year: {
                              type: "integer",
                            },
                            month: {
                              type: "integer",
                            },
                            day: {
                              type: "integer",
                            },
                          },
                          additionalProperties: true,
                          description:
                            "Optional. This condition is relevant only for versioned objects. An object version satisfies this condition only if it became noncurrent before the specified date in UTC.",
                        },
                        matches_prefix: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Optional. List of object name prefixes. If any prefix exactly matches the beginning of the object name, the condition evaluates to true.",
                        },
                        matches_suffix: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Optional. List of object name suffixes. If any suffix exactly matches the end of the object name, the condition evaluates to true.",
                        },
                      },
                      description:
                        "A condition of an object which triggers some action.",
                      additionalProperties: true,
                    },
                  },
                  description:
                    "A lifecycle Rule, combining an action to take on an object and a condition which triggers that action.",
                  additionalProperties: true,
                },
                description:
                  "Optional. A lifecycle management rule, which is made of an action to take and the condition under which the action is taken.",
              },
            },
            description:
              "Lifecycle properties of a bucket. For more information, see [Object Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle).",
            additionalProperties: true,
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          cors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                origin: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Optional. The list of origins eligible to receive CORS response headers. For more information about origins, see [RFC 6454](https://tools.ietf.org/html/rfc6454). Note: `*` is permitted in the list of origins, and means `any origin`.",
                },
                method: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    'Optional. The list of HTTP methods on which to include CORS response headers, (`GET`, `OPTIONS`, `POST`, etc) Note: `*` is permitted in the list of methods, and means "any method".',
                },
                response_header: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Optional. The list of HTTP headers other than the [simple response headers](https://www.w3.org/TR/cors/#simple-response-headers) to give permission for the user-agent to share across domains.",
                },
                max_age_seconds: {
                  type: "integer",
                  description:
                    "Optional. The value, in seconds, to return in the [Access-Control-Max-Age header](https://www.w3.org/TR/cors/#access-control-max-age-response-header) used in preflight responses.",
                },
              },
              description:
                "Cross-Origin Response sharing (CORS) properties for a bucket. For more on Cloud Storage and CORS, see https://cloud.google.com/storage/docs/cross-origin. For more on CORS in general, see https://tools.ietf.org/html/rfc6454.",
              additionalProperties: true,
            },
            description:
              "Optional. The bucket's [CORS](https://www.w3.org/TR/cors/) configuration.",
          },
          update_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          default_event_based_hold: {
            type: "boolean",
            description:
              "Optional. The default value for event-based hold on newly created objects in this bucket.  Event-based hold is a way to retain objects indefinitely until an event occurs, signified by the hold's release. After being released, such objects are subject to bucket-level retention (if any).  One sample use case of this flag is for banks to hold loan documents for at least 3 years after loan is paid in full. Here, bucket-level retention is 3 years and the event is loan being paid in full. In this example, these objects are held intact for any number of years until the event has occurred (event-based hold on the object is released) and then 3 more years after that. That means retention duration of the objects begins from the moment event-based hold transitioned from true to false.  Objects under event-based hold cannot be deleted, overwritten or archived until the hold is removed.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Optional. User-provided labels, in key/value pairs.",
          },
          website: {
            type: "object",
            properties: {
              main_page_suffix: {
                type: "string",
                description:
                  "Optional. If the requested object path is missing, the service ensures the path has a trailing '/', append this suffix, and attempt to retrieve the resulting object. This allows the creation of `index.html` objects to represent directory pages.",
              },
              not_found_page: {
                type: "string",
                description:
                  "Optional. If the requested object path is missing, and any `mainPageSuffix` object is missing, if applicable, the service returns the named object from this bucket as the content for a [404 Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) result.",
              },
            },
            description:
              "Properties of a bucket related to accessing the contents as a static website. For details, see [hosting a static website using Cloud Storage](https://cloud.google.com/storage/docs/hosting-static-website).",
            additionalProperties: true,
          },
          versioning: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "Optional. While set to true, versioning is fully enabled for this bucket.",
              },
            },
            description:
              "Properties of a bucket related to versioning. For more information about Cloud Storage versioning, see [Object versioning](https://cloud.google.com/storage/docs/object-versioning).",
            additionalProperties: true,
          },
          logging: {
            type: "object",
            properties: {
              log_bucket: {
                type: "string",
                description:
                  "Optional. The destination bucket where the current bucket's logs should be placed, using path format (like `projects/123456/buckets/foo`).",
              },
              log_object_prefix: {
                type: "string",
                description: "Optional. A prefix for log object names.",
              },
            },
            description: "Logging-related properties of a bucket.",
            additionalProperties: true,
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
          encryption: {
            type: "object",
            properties: {
              default_kms_key: {
                type: "string",
                description:
                  "Optional. The name of the Cloud KMS key that is used to encrypt objects inserted into this bucket, if no encryption method is specified.",
              },
              google_managed_encryption_enforcement_config: {
                type: "object",
                properties: {
                  restriction_mode: {
                    type: "string",
                    description:
                      "Restriction mode for google-managed encryption for new objects within the bucket. Valid values are: `NotRestricted` and `FullyRestricted`. If `NotRestricted` or unset, creation of new objects with google-managed encryption is allowed. If `FullyRestricted`, new objects can't be created using google-managed encryption.",
                  },
                  effective_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description:
                  "Google Managed Encryption (GMEK) enforcement config of a bucket.",
                additionalProperties: true,
              },
              customer_managed_encryption_enforcement_config: {
                type: "object",
                properties: {
                  restriction_mode: {
                    type: "string",
                    description:
                      "Restriction mode for customer-managed encryption for new objects within the bucket. Valid values are: `NotRestricted` and `FullyRestricted`. If `NotRestricted` or unset, creation of new objects with customer-managed encryption is allowed. If `FullyRestricted`, new objects can't be created using customer-managed encryption.",
                  },
                  effective_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description:
                  "Customer Managed Encryption (CMEK) enforcement config of a bucket.",
                additionalProperties: true,
              },
              customer_supplied_encryption_enforcement_config: {
                type: "object",
                properties: {
                  restriction_mode: {
                    type: "string",
                    description:
                      "Restriction mode for customer-supplied encryption for new objects within the bucket. Valid values are: `NotRestricted` and `FullyRestricted`. If `NotRestricted` or unset, creation of new objects with customer-supplied encryption is allowed. If `FullyRestricted`, new objects can't be created using customer-supplied encryption.",
                  },
                  effective_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description:
                  "Customer Supplied Encryption (CSEK) enforcement config of a bucket.",
                additionalProperties: true,
              },
            },
            description: "Encryption properties of a bucket.",
            additionalProperties: true,
          },
          billing: {
            type: "object",
            properties: {
              requester_pays: {
                type: "boolean",
                description:
                  "Optional. When set to true, Requester Pays is enabled for this bucket.",
              },
            },
            description: "Billing properties of a bucket.",
            additionalProperties: true,
          },
          retention_policy: {
            type: "object",
            properties: {
              effective_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              is_locked: {
                type: "boolean",
                description:
                  "Optional. Once locked, an object retention policy cannot be modified.",
              },
              retention_duration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
            },
            description: "Retention policy properties of a bucket.",
            additionalProperties: true,
          },
          iam_config: {
            type: "object",
            properties: {
              uniform_bucket_level_access: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description:
                      "Optional. If set, access checks only use bucket-level IAM policies or above.",
                  },
                  lock_time: {
                    type: "string",
                    description:
                      "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                  },
                },
                description:
                  "Settings for Uniform Bucket level access. See https://cloud.google.com/storage/docs/uniform-bucket-level-access.",
                additionalProperties: true,
              },
              public_access_prevention: {
                type: "string",
                description:
                  "Optional. Whether IAM enforces public access prevention. Valid values are `enforced` or `inherited`.",
              },
            },
            description: "Bucket restriction options.",
            additionalProperties: true,
          },
          satisfies_pzs: {
            type: "boolean",
            description: "Optional. Reserved for future use.",
          },
          custom_placement_config: {
            type: "object",
            properties: {
              data_locations: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Optional. List of locations to use for data placement.",
              },
            },
            description:
              "Configuration for [configurable dual- regions](https://cloud.google.com/storage/docs/locations#configurable). It should specify precisely two eligible regions within the same multi-region. For details, see [locations](https://cloud.google.com/storage/docs/locations).",
            additionalProperties: true,
          },
          autoclass: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Optional. Enables Autoclass.",
              },
              toggle_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              terminal_storage_class: {
                type: "string",
                description:
                  "An object in an Autoclass bucket eventually cools down to the terminal storage class if there is no access to the object. The only valid values are NEARLINE and ARCHIVE.",
              },
              terminal_storage_class_update_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
            },
            description: "Configuration for a bucket's Autoclass feature.",
            additionalProperties: true,
          },
          hierarchical_namespace: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "Optional. Enables the hierarchical namespace feature.",
              },
            },
            description:
              "Configuration for a bucket's hierarchical namespace feature.",
            additionalProperties: true,
          },
          soft_delete_policy: {
            type: "object",
            properties: {
              retention_duration: {
                type: "string",
                description: "Duration string (e.g., '1.5s', '300s')",
              },
              effective_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
            },
            description: "Soft delete policy properties of a bucket.",
            additionalProperties: true,
          },
          object_retention: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description:
                  "Optional. Output only. If true, object retention is enabled for the bucket.",
              },
            },
            description: "Object Retention related properties of a bucket.",
            additionalProperties: true,
          },
          ip_filter: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                description:
                  "The state of the IP filter configuration. Valid values are `Enabled` and `Disabled`. When set to `Enabled`, IP filtering rules are applied to a bucket and all incoming requests to the bucket are evaluated against these rules. When set to `Disabled`, IP filtering rules are not applied to a bucket.",
              },
              public_network_source: {
                type: "object",
                properties: {
                  allowed_ip_cidr_ranges: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Optional. The list of IPv4 and IPv6 cidr blocks that are allowed to operate or access the bucket and its underlying objects.",
                  },
                },
                description:
                  "The public network IP address ranges that can access the bucket and its data.",
                additionalProperties: true,
              },
              vpc_network_sources: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    network: {
                      type: "string",
                      description:
                        "Name of the network.  Format: `projects/PROJECT_ID/global/networks/NETWORK_NAME`",
                    },
                    allowed_ip_cidr_ranges: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Optional. The list of public or private IPv4 and IPv6 CIDR ranges that can access the bucket. In the CIDR IP address block, the specified IP address must be properly truncated, meaning all the host bits must be zero or else the input is considered malformed. For example, `192.0.2.0/24` is accepted but `192.0.2.1/24` is not. Similarly, for IPv6, `2001:db8::/32` is accepted whereas `2001:db8::1/32` is not.",
                    },
                  },
                  description:
                    "The list of VPC networks that can access the bucket.",
                  additionalProperties: true,
                },
                description:
                  "Optional. The list of network sources that are allowed to access operations on the bucket or the underlying objects.",
              },
              allow_cross_org_vpcs: {
                type: "boolean",
                description:
                  "Optional. Whether or not to allow VPCs from orgs different than the bucket's parent org to access the bucket. When set to true, validations on the existence of the VPCs won't be performed. If set to false, each VPC network source is checked to belong to the same org as the bucket as well as validated for existence.",
              },
              allow_all_service_agent_access: {
                type: "boolean",
                description:
                  "Whether or not to allow all P4SA access to the bucket. When set to true, IP filter config validation doesn't apply.",
              },
            },
            description:
              "The [bucket IP filtering](https://cloud.google.com/storage/docs/ip-filtering-overview) configuration. Specifies the network sources that can access the bucket, as well as its underlying objects.",
            additionalProperties: true,
          },
        },
        description: "A bucket.",
        additionalProperties: true,
      },
    },
  },
};

export default createBucket;
