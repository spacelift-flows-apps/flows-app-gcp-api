import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const regionDisksList: AppBlock = {
  name: "Region Disks - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Region Disks",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
            description: "Name of the region for this request.",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
            description:
              'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
            description:
              "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
            description:
              'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
            description:
              "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "boolean",
            description:
              "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.orderBy !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.orderBy);
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.returnPartialSuccess !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.returnPartialSuccess,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "/compute/v1/projects/{project}/regions/{region}/disks",
          pathParams,
          queryParams,
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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                accessMode: {
                  type: "string",
                  enum: [
                    "UNDEFINED_ACCESS_MODE",
                    "READ_ONLY_MANY",
                    "READ_WRITE_MANY",
                    "READ_WRITE_SINGLE",
                  ],
                  description:
                    "The access mode of the disk.        - READ_WRITE_SINGLE: The default AccessMode, means the      disk can be attached to single instance in RW mode.      - READ_WRITE_MANY: The AccessMode means the disk can be      attached to multiple instances in RW mode.      - READ_ONLY_MANY: The AccessMode means the disk can be      attached to multiple instances in RO mode.   The AccessMode is only valid for Hyperdisk disk types. Check the AccessMode enum for the list of possible values.",
                },
                architecture: {
                  type: "string",
                  enum: [
                    "UNDEFINED_ARCHITECTURE",
                    "ARCHITECTURE_UNSPECIFIED",
                    "ARM64",
                    "X86_64",
                  ],
                  description:
                    "The architecture of the disk. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
                },
                asyncPrimaryDisk: {
                  type: "object",
                  properties: {
                    consistencyGroupPolicy: {
                      type: "string",
                      description:
                        "Output only. [Output Only] URL of the DiskConsistencyGroupPolicy if replication was started on the disk as a member of a group.",
                    },
                    consistencyGroupPolicyId: {
                      type: "string",
                      description:
                        "Output only. [Output Only] ID of the DiskConsistencyGroupPolicy if replication was started on the disk as a member of a group.",
                    },
                    disk: {
                      type: "string",
                      description:
                        "The other disk asynchronously replicated to or from the current disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk    - projects/project/zones/zone/disks/disk    - zones/zone/disks/disk",
                    },
                    diskId: {
                      type: "string",
                      description:
                        "Output only. [Output Only] The unique ID of the other disk asynchronously replicated to or from the current disk. This value identifies the exact disk that was used to create this replication. For example, if you started replicating the persistent disk from a disk that was later deleted and recreated under the same name, the disk ID would identify the exact version of the disk that was used.",
                    },
                  },
                  additionalProperties: true,
                  description: "Disk asynchronously replicated into this disk.",
                },
                asyncSecondaryDisks: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Output only. [Output Only] A list of disks this disk is asynchronously replicated to.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                diskEncryptionKey: {
                  type: "object",
                  properties: {
                    kmsKeyName: {
                      type: "string",
                      description:
                        'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
                    },
                    kmsKeyServiceAccount: {
                      type: "string",
                      description:
                        'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
                    },
                    rawKey: {
                      type: "string",
                      description:
                        'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
                    },
                    rsaEncryptedKey: {
                      type: "string",
                      description:
                        'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rsaEncryptedKey": "ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH z0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD D6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="  The key must meet the following requirements before you can provide it to Compute Engine:     1. The key is wrapped using a RSA public key certificate provided by    Google.    2. After being wrapped, the key must be encoded in RFC 4648 base64    encoding.  Gets the RSA public key certificate provided by Google at:   https://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
                    },
                    sha256: {
                      type: "string",
                      description:
                        "[Output only] TheRFC 4648 base64 encoded SHA-256 hash of the customer-supplied encryption key that protects this resource.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    'Encrypts the disk using a customer-supplied encryption key or a customer-managed encryption key.  Encryption keys do not protect access to metadata of the disk.  After you encrypt a disk with a customer-supplied key, you must provide the same key if you use the disk later. For example, to create a disk snapshot, to create a disk image, to create a machine image, or to attach the disk to a virtual machine.  After you encrypt a disk with a customer-managed key, thediskEncryptionKey.kmsKeyName is set to a key *version* name once the disk is created. The disk is encrypted with this version of the key. In the response, diskEncryptionKey.kmsKeyName appears in the following format:  "diskEncryptionKey.kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeysVersions/version  If you do not provide an encryption key when creating the disk, then the disk is encrypted using an automatically generated key and you don\'t need to provide a key to use the disk later.',
                },
                enableConfidentialCompute: {
                  type: "boolean",
                  description:
                    "Whether this disk is using confidential compute mode.",
                },
                guestOsFeatures: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: [
                          "UNDEFINED_TYPE",
                          "BARE_METAL_LINUX_COMPATIBLE",
                          "FEATURE_TYPE_UNSPECIFIED",
                          "GVNIC",
                          "IDPF",
                          "MULTI_IP_SUBNET",
                          "SECURE_BOOT",
                          "SEV_CAPABLE",
                          "SEV_LIVE_MIGRATABLE",
                          "SEV_LIVE_MIGRATABLE_V2",
                          "SEV_SNP_CAPABLE",
                          "SNP_SVSM_CAPABLE",
                          "TDX_CAPABLE",
                          "UEFI_COMPATIBLE",
                          "VIRTIO_SCSI_MULTIQUEUE",
                          "WINDOWS",
                        ],
                        description:
                          "The ID of a supported feature. To add multiple values, use commas to separate values. Set to one or more of the following values:     - VIRTIO_SCSI_MULTIQUEUE    - WINDOWS    - MULTI_IP_SUBNET    - UEFI_COMPATIBLE    - GVNIC    - SEV_CAPABLE    - SUSPEND_RESUME_COMPATIBLE    - SEV_LIVE_MIGRATABLE_V2    - SEV_SNP_CAPABLE    - TDX_CAPABLE    - IDPF    - SNP_SVSM_CAPABLE   For more information, see Enabling guest operating system features. Check the Type enum for the list of possible values.",
                      },
                    },
                    description: "Guest OS features.",
                    additionalProperties: true,
                  },
                  description:
                    "A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Always compute#disk for disks.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this disk, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a disk.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels to apply to this disk. These can be later modified by the setLabels method.",
                },
                lastAttachTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Last attach timestamp inRFC3339 text format.",
                },
                lastDetachTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Last detach timestamp inRFC3339 text format.",
                },
                licenseCodes: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "64-bit integer as string",
                  },
                  description:
                    "Integer license codes indicating which licenses are attached to this disk.",
                },
                licenses: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of publicly visible licenses. Reserved for Google's use.",
                },
                locationHint: {
                  type: "string",
                  description:
                    "An opaque location hint used to place the disk close to other resources. This field is for use by internal tools that use the public API.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                options: {
                  type: "string",
                  description: "Internal use only.",
                },
                params: {
                  type: "object",
                  properties: {
                    resourceManagerTags: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Resource manager tags to be bound to the disk. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
                    },
                  },
                  description: "Additional disk params.",
                  additionalProperties: true,
                },
                physicalBlockSizeBytes: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                provisionedIops: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                provisionedThroughput: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the region where the disk resides. Only applicable for regional resources. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
                },
                replicaZones: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "URLs of the zones where the disk should be replicated to. Only applicable for regional resources.",
                },
                resourcePolicies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Resource policies applied to this disk for automatic snapshot creations.",
                },
                resourceStatus: {
                  type: "object",
                  properties: {
                    asyncPrimaryDisk: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: [
                            "UNDEFINED_STATE",
                            "ACTIVE",
                            "CREATED",
                            "STARTING",
                            "STATE_UNSPECIFIED",
                            "STOPPED",
                            "STOPPING",
                          ],
                          description:
                            "Check the State enum for the list of possible values.",
                        },
                      },
                      additionalProperties: true,
                    },
                    asyncSecondaryDisks: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Key: disk, value: AsyncReplicationStatus message",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output Only] Status information for the disk resource.",
                },
                satisfiesPzi: {
                  type: "boolean",
                  description: "Output only. Reserved for future use.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description:
                    "Output only. [Output Only] Reserved for future use.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined fully-qualified URL for this resource.",
                },
                sizeGb: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                sourceConsistencyGroupPolicy: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the DiskConsistencyGroupPolicy for a secondary disk that was created using a consistency group.",
                },
                sourceConsistencyGroupPolicyId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] ID of the DiskConsistencyGroupPolicy for a secondary disk that was created using a consistency group.",
                },
                sourceDisk: {
                  type: "string",
                  description:
                    "The source disk used to create this disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        -        https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk       -        https://www.googleapis.com/compute/v1/projects/project/regions/region/disks/disk       -        projects/project/zones/zone/disks/disk       -        projects/project/regions/region/disks/disk       -        zones/zone/disks/disk       -        regions/region/disks/disk",
                },
                sourceDiskId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The unique ID of the disk used to create this disk. This value identifies the exact disk that was used to create this persistent disk. For example, if you created the persistent disk from a disk that was later deleted and recreated under the same name, the source disk ID would identify the exact version of the disk that was used.",
                },
                sourceImage: {
                  type: "string",
                  description:
                    "The source image used to create this disk. If the source image is deleted, this field will not be set.  To create a disk with one of the public operating system images, specify the image by its family name. For example, specifyfamily/debian-9 to use the latest Debian 9 image:  projects/debian-cloud/global/images/family/debian-9   Alternatively, use a specific version of a public operating system image:  projects/debian-cloud/global/images/debian-9-stretch-vYYYYMMDD   To create a disk with a custom image that you created, specify the image name in the following format:  global/images/my-custom-image   You can also specify a custom image by its image family, which returns the latest version of the image in that family. Replace the image name with family/family-name:  global/images/family/my-image-family",
                },
                sourceImageEncryptionKey: {
                  type: "object",
                  properties: {
                    kmsKeyName: {
                      type: "string",
                      description:
                        'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
                    },
                    kmsKeyServiceAccount: {
                      type: "string",
                      description:
                        'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
                    },
                    rawKey: {
                      type: "string",
                      description:
                        'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
                    },
                    rsaEncryptedKey: {
                      type: "string",
                      description:
                        'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rsaEncryptedKey": "ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH z0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD D6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="  The key must meet the following requirements before you can provide it to Compute Engine:     1. The key is wrapped using a RSA public key certificate provided by    Google.    2. After being wrapped, the key must be encoded in RFC 4648 base64    encoding.  Gets the RSA public key certificate provided by Google at:   https://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
                    },
                    sha256: {
                      type: "string",
                      description:
                        "[Output only] TheRFC 4648 base64 encoded SHA-256 hash of the customer-supplied encryption key that protects this resource.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Thecustomer-supplied encryption key of the source image. Required if the source image is protected by a customer-supplied encryption key.",
                },
                sourceImageId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The ID value of the image used to create this disk. This value identifies the exact image that was used to create this persistent disk. For example, if you created the persistent disk from an image that was later deleted and recreated under the same name, the source image ID would identify the exact version of the image that was used.",
                },
                sourceInstantSnapshot: {
                  type: "string",
                  description:
                    "The source instant snapshot used to create this disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot      - projects/project/zones/zone/instantSnapshots/instantSnapshot    - zones/zone/instantSnapshots/instantSnapshot",
                },
                sourceInstantSnapshotId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The unique ID of the instant snapshot used to create this disk. This value identifies the exact instant snapshot that was used to create this persistent disk. For example, if you created the persistent disk from an instant snapshot that was later deleted and recreated under the same name, the source instant snapshot ID would identify the exact version of the instant snapshot that was used.",
                },
                sourceSnapshot: {
                  type: "string",
                  description:
                    "The source snapshot used to create this disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/global/snapshots/snapshot    - projects/project/global/snapshots/snapshot      - global/snapshots/snapshot",
                },
                sourceSnapshotEncryptionKey: {
                  type: "object",
                  properties: {
                    kmsKeyName: {
                      type: "string",
                      description:
                        'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
                    },
                    kmsKeyServiceAccount: {
                      type: "string",
                      description:
                        'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
                    },
                    rawKey: {
                      type: "string",
                      description:
                        'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
                    },
                    rsaEncryptedKey: {
                      type: "string",
                      description:
                        'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rsaEncryptedKey": "ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH z0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD D6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="  The key must meet the following requirements before you can provide it to Compute Engine:     1. The key is wrapped using a RSA public key certificate provided by    Google.    2. After being wrapped, the key must be encoded in RFC 4648 base64    encoding.  Gets the RSA public key certificate provided by Google at:   https://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
                    },
                    sha256: {
                      type: "string",
                      description:
                        "[Output only] TheRFC 4648 base64 encoded SHA-256 hash of the customer-supplied encryption key that protects this resource.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Thecustomer-supplied encryption key of the source snapshot. Required if the source snapshot is protected by a customer-supplied encryption key.",
                },
                sourceSnapshotId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The unique ID of the snapshot used to create this disk. This value identifies the exact snapshot that was used to create this persistent disk. For example, if you created the persistent disk from a snapshot that was later deleted and recreated under the same name, the source snapshot ID would identify the exact version of the snapshot that was used.",
                },
                sourceStorageObject: {
                  type: "string",
                  description:
                    "The full Google Cloud Storage URI where the disk image is stored. This file must be a gzip-compressed tarball whose name ends in .tar.gz or virtual machine disk whose name ends in vmdk. Valid URIs may start with gs:// or https://storage.googleapis.com/. This flag is not optimized for creating multiple disks from a source storage object. To create many disks from a source storage object, use gcloud compute images import instead.",
                },
                status: {
                  type: "string",
                  enum: [
                    "UNDEFINED_STATUS",
                    "CREATING",
                    "DELETING",
                    "FAILED",
                    "READY",
                    "RESTORING",
                    "UNAVAILABLE",
                  ],
                  description:
                    "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
                },
                storagePool: {
                  type: "string",
                  description:
                    "The storage pool in which the new disk is created. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/storagePools/storagePool      - projects/project/zones/zone/storagePools/storagePool    - zones/zone/storagePools/storagePool",
                },
                type: {
                  type: "string",
                  description:
                    "URL of the disk type resource describing which disk type to use to create the disk. Provide this when creating the disk. For example:projects/project/zones/zone/diskTypes/pd-ssd. See Persistent disk types.",
                },
                users: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Output only. [Output Only] Links to the users of the disk (attached instances) in form:projects/project/zones/zone/instances/instance",
                },
                zone: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the zone where the disk resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
                },
              },
              description:
                "Represents a Persistent Disk resource.  Google Compute Engine has two Disk resources:  * [Zonal](/compute/docs/reference/rest/v1/disks) * [Regional](/compute/docs/reference/rest/v1/regionDisks)  Persistent disks are required for running your VM instances. Create both boot and non-boot (data) persistent disks. For more information, read Persistent Disks. For more storage options, read Storage options.  The disks resource represents a zonal persistent disk. For more information, readZonal persistent disks.  The regionDisks resource represents a regional persistent disk.  For more information, read Regional resources.",
              additionalProperties: true,
            },
            description: "A list of Disk resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#diskList for lists of disks.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          warning: {
            type: "object",
            properties: {
              code: {
                type: "string",
                enum: [
                  "UNDEFINED_CODE",
                  "CLEANUP_FAILED",
                  "DEPRECATED_RESOURCE_USED",
                  "DEPRECATED_TYPE_USED",
                  "DISK_SIZE_LARGER_THAN_IMAGE_SIZE",
                  "EXPERIMENTAL_TYPE_USED",
                  "EXTERNAL_API_WARNING",
                  "FIELD_VALUE_OVERRIDEN",
                  "INJECTED_KERNELS_DEPRECATED",
                  "INVALID_HEALTH_CHECK_FOR_DYNAMIC_WIEGHTED_LB",
                  "LARGE_DEPLOYMENT_WARNING",
                  "LIST_OVERHEAD_QUOTA_EXCEED",
                  "MISSING_TYPE_DEPENDENCY",
                  "NEXT_HOP_ADDRESS_NOT_ASSIGNED",
                  "NEXT_HOP_CANNOT_IP_FORWARD",
                  "NEXT_HOP_INSTANCE_HAS_NO_IPV6_INTERFACE",
                  "NEXT_HOP_INSTANCE_NOT_FOUND",
                  "NEXT_HOP_INSTANCE_NOT_ON_NETWORK",
                  "NEXT_HOP_NOT_RUNNING",
                  "NOT_CRITICAL_ERROR",
                  "NO_RESULTS_ON_PAGE",
                  "PARTIAL_SUCCESS",
                  "QUOTA_INFO_UNAVAILABLE",
                  "REQUIRED_TOS_AGREEMENT",
                  "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING",
                  "RESOURCE_NOT_DELETED",
                  "SCHEMA_VALIDATION_IGNORED",
                  "SINGLE_INSTANCE_PROPERTY_TEMPLATE",
                  "UNDECLARED_PROPERTIES",
                  "UNREACHABLE",
                ],
                description:
                  "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description:
                        "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
                    },
                    value: {
                      type: "string",
                      description:
                        "[Output Only] A warning data value corresponding to the key.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
              },
              message: {
                type: "string",
                description:
                  "[Output Only] A human-readable description of the warning code.",
              },
            },
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "A list of Disk resources.",
        additionalProperties: true,
      },
    },
  },
};

export default regionDisksList;
