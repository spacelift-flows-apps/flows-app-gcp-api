import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const regionDisksCreateSnapshot: AppBlock = {
  name: "Region Disks - Create Snapshot",
  description: `Creates a snapshot of a specified persistent disk. For regular snapshot creation, consider using snapshots.insert instead, as that method supports more features, such as creating snapshots in a project different from the source disk project.`,
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
        disk: {
          name: "Disk",
          description: "Name of the regional persistent disk to snapshot.",
          type: {
            type: "string",
            description: "Name of the regional persistent disk to snapshot.",
          },
          required: true,
        },
        architecture: {
          name: "Architecture",
          description:
            "Output only. [Output Only] The architecture of the snapshot. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_ARCHITECTURE",
              "ARCHITECTURE_UNSPECIFIED",
              "ARM64",
              "X86_64",
            ],
            description:
              "Output only. [Output Only] The architecture of the snapshot. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
          },
          required: false,
        },
        autoCreated: {
          name: "Auto Created",
          description:
            "Output only. [Output Only] Set to true if snapshots are automatically created by applying resource policy on the target disk.",
          type: {
            type: "boolean",
            description:
              "Output only. [Output Only] Set to true if snapshots are automatically created by applying resource policy on the target disk.",
          },
          required: false,
        },
        chainName: {
          name: "Chain Name",
          description:
            "Creates the new snapshot in the snapshot chain labeled with the specified name. The chain name must be 1-63 characters long and comply with RFC1035. This is an uncommon option only for advanced service owners who needs to create separate snapshot chains, for example, for chargeback tracking. When you describe your snapshot resource, this field is visible only if it has a non-empty value.",
          type: {
            type: "string",
            description:
              "Creates the new snapshot in the snapshot chain labeled with the specified name. The chain name must be 1-63 characters long and comply with RFC1035. This is an uncommon option only for advanced service owners who needs to create separate snapshot chains, for example, for chargeback tracking. When you describe your snapshot resource, this field is visible only if it has a non-empty value.",
          },
          required: false,
        },
        creationSizeBytes: {
          name: "Creation Size Bytes",
          description:
            "Output only. [Output Only] Size in bytes of the snapshot at creation time.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          required: false,
        },
        diskSizeGb: {
          name: "Disk Size Gb",
          description:
            "Output only. [Output Only] Size of the source disk, specified in GB.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        downloadBytes: {
          name: "Download Bytes",
          description:
            "Output only. [Output Only] Number of bytes downloaded to restore a snapshot to a disk.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        enableConfidentialCompute: {
          name: "Enable Confidential Compute",
          description:
            "Output only. Whether this snapshot is created from a confidential compute mode disk. [Output Only]: This field is not set by user, but from source disk.",
          type: {
            type: "boolean",
            description:
              "Output only. Whether this snapshot is created from a confidential compute mode disk. [Output Only]: This field is not set by user, but from source disk.",
          },
          required: false,
        },
        guestFlush: {
          name: "Guest Flush",
          description:
            "[Input Only] Whether to attempt an application consistent snapshot by informing the OS to prepare for the snapshot process.",
          type: {
            type: "boolean",
            description:
              "[Input Only] Whether to attempt an application consistent snapshot by informing the OS to prepare for the snapshot process.",
          },
          required: false,
        },
        guestOsFeatures: {
          name: "Guest Os Features",
          description:
            "Output only. [Output Only] A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
          type: {
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
              "Output only. [Output Only] A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Always compute#snapshot for Snapshot resources.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#snapshot for Snapshot resources.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this snapshot, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a snapshot.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this snapshot, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a snapshot.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "Labels to apply to this snapshot. These can be later modified by the setLabels method. Label values may be empty.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this snapshot. These can be later modified by the setLabels method. Label values may be empty.",
          },
          required: false,
        },
        licenseCodes: {
          name: "License Codes",
          description:
            "Output only. [Output Only] Integer license codes indicating which licenses are attached to this snapshot.",
          type: {
            type: "array",
            items: {
              type: "string",
              description: "64-bit integer as string",
            },
            description:
              "Output only. [Output Only] Integer license codes indicating which licenses are attached to this snapshot.",
          },
          required: false,
        },
        licenses: {
          name: "Licenses",
          description:
            "Output only. [Output Only] A list of public visible licenses that apply to this snapshot. This can be because the original image had licenses attached (such as a Windows image).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] A list of public visible licenses that apply to this snapshot. This can be because the original image had licenses attached (such as a Windows image).",
          },
          required: false,
        },
        locationHint: {
          name: "Location Hint",
          description:
            "An opaque location hint used to place the snapshot close to other resources. This field is for use by internal tools that use the public API.",
          type: {
            type: "string",
            description:
              "An opaque location hint used to place the snapshot close to other resources. This field is for use by internal tools that use the public API.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        params: {
          name: "Params",
          description:
            "Input only. [Input Only] Additional params passed with the request, but not persisted as part of resource payload.",
          type: {
            type: "object",
            properties: {
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Resource manager tags to be bound to the snapshot. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
              },
            },
            description: "Additional snapshot params.",
            additionalProperties: true,
          },
          required: false,
        },
        satisfiesPzi: {
          name: "Satisfies Pzi",
          description: "Output only. Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
          },
          required: false,
        },
        satisfiesPzs: {
          name: "Satisfies Pzs",
          description: "Output only. [Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description:
            "Output only. [Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        snapshotEncryptionKey: {
          name: "Snapshot Encryption Key",
          description:
            "Encrypts the snapshot using acustomer-supplied encryption key.  After you encrypt a snapshot using a customer-supplied key, you must provide the same key if you use the snapshot later. For example, you must provide the encryption key when you create a disk from the encrypted snapshot in a future request.  Customer-supplied encryption keys do not protect access to metadata of the snapshot.  If you do not provide an encryption key when creating the snapshot, then the snapshot will be encrypted using an automatically generated key and you do not need to provide a key to use the snapshot later.",
          type: {
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
              "Encrypts the snapshot using acustomer-supplied encryption key.  After you encrypt a snapshot using a customer-supplied key, you must provide the same key if you use the snapshot later. For example, you must provide the encryption key when you create a disk from the encrypted snapshot in a future request.  Customer-supplied encryption keys do not protect access to metadata of the snapshot.  If you do not provide an encryption key when creating the snapshot, then the snapshot will be encrypted using an automatically generated key and you do not need to provide a key to use the snapshot later.",
          },
          required: false,
        },
        snapshotType: {
          name: "Snapshot Type",
          description:
            "Indicates the type of the snapshot. Check the SnapshotType enum for the list of possible values.",
          type: {
            type: "string",
            enum: ["UNDEFINED_SNAPSHOT_TYPE", "ARCHIVE", "STANDARD"],
            description:
              "Indicates the type of the snapshot. Check the SnapshotType enum for the list of possible values.",
          },
          required: false,
        },
        sourceDisk: {
          name: "Source Disk",
          description: "The source disk used to create this snapshot.",
          type: {
            type: "string",
            description: "The source disk used to create this snapshot.",
          },
          required: false,
        },
        sourceDiskEncryptionKey: {
          name: "Source Disk Encryption Key",
          description:
            "The customer-supplied encryption key of the source disk. Required if the source disk is protected by a customer-supplied encryption key.",
          type: {
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
              "The customer-supplied encryption key of the source disk. Required if the source disk is protected by a customer-supplied encryption key.",
          },
          required: false,
        },
        sourceDiskForRecoveryCheckpoint: {
          name: "Source Disk For Recovery Checkpoint",
          description:
            "The source disk whose recovery checkpoint will be used to create this snapshot.",
          type: {
            type: "string",
            description:
              "The source disk whose recovery checkpoint will be used to create this snapshot.",
          },
          required: false,
        },
        sourceDiskId: {
          name: "Source Disk Id",
          description:
            "Output only. [Output Only] The ID value of the disk used to create this snapshot. This value may be used to determine whether the snapshot was taken from the current or a previous instance of a given disk name.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The ID value of the disk used to create this snapshot. This value may be used to determine whether the snapshot was taken from the current or a previous instance of a given disk name.",
          },
          required: false,
        },
        sourceInstantSnapshot: {
          name: "Source Instant Snapshot",
          description:
            "The source instant snapshot used to create this snapshot. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot      - projects/project/zones/zone/instantSnapshots/instantSnapshot    - zones/zone/instantSnapshots/instantSnapshot",
          type: {
            type: "string",
            description:
              "The source instant snapshot used to create this snapshot. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot      - projects/project/zones/zone/instantSnapshots/instantSnapshot    - zones/zone/instantSnapshots/instantSnapshot",
          },
          required: false,
        },
        sourceInstantSnapshotEncryptionKey: {
          name: "Source Instant Snapshot Encryption Key",
          description:
            "Customer provided encryption key when creating Snapshot from Instant Snapshot.",
          type: {
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
              "Customer provided encryption key when creating Snapshot from Instant Snapshot.",
          },
          required: false,
        },
        sourceInstantSnapshotId: {
          name: "Source Instant Snapshot Id",
          description:
            "Output only. [Output Only] The unique ID of the instant snapshot used to create this snapshot. This value identifies the exact instant snapshot that was used to create this snapshot. For example, if you created the snapshot from an instant snapshot that was later deleted and recreated under the same name, the source instant snapshot ID would identify the exact instant snapshot that was used.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The unique ID of the instant snapshot used to create this snapshot. This value identifies the exact instant snapshot that was used to create this snapshot. For example, if you created the snapshot from an instant snapshot that was later deleted and recreated under the same name, the source instant snapshot ID would identify the exact instant snapshot that was used.",
          },
          required: false,
        },
        sourceSnapshotSchedulePolicy: {
          name: "Source Snapshot Schedule Policy",
          description:
            "Output only. [Output Only] URL of the resource policy which created this scheduled snapshot.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the resource policy which created this scheduled snapshot.",
          },
          required: false,
        },
        sourceSnapshotSchedulePolicyId: {
          name: "Source Snapshot Schedule Policy Id",
          description:
            "Output only. [Output Only] ID of the resource policy which created this scheduled snapshot.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] ID of the resource policy which created this scheduled snapshot.",
          },
          required: false,
        },
        status: {
          name: "Status",
          description:
            "Output only. [Output Only] The status of the snapshot. This can beCREATING, DELETING, FAILED,READY, or UPLOADING. Check the Status enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_STATUS",
              "CREATING",
              "DELETING",
              "FAILED",
              "READY",
              "UPLOADING",
            ],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          required: false,
        },
        storageBytes: {
          name: "Storage Bytes",
          description:
            "Output only. [Output Only] A size of the storage used by the snapshot. As snapshots share storage, this number is expected to change with snapshot creation/deletion.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        storageBytesStatus: {
          name: "Storage Bytes Status",
          description:
            "Output only. [Output Only] An indicator whether storageBytes is in a stable state or it is being adjusted as a result of shared storage reallocation. This status can either be UPDATING, meaning the size of the snapshot is being updated, or UP_TO_DATE, meaning the size of the snapshot is up-to-date. Check the StorageBytesStatus enum for the list of possible values.",
          type: {
            type: "string",
            enum: ["UNDEFINED_STORAGE_BYTES_STATUS", "UPDATING", "UP_TO_DATE"],
            description:
              "Output only. [Output Only] An indicator whether storageBytes is in a stable state or it is being adjusted as a result of shared storage reallocation. This status can either be UPDATING, meaning the size of the snapshot is being updated, or UP_TO_DATE, meaning the size of the snapshot is up-to-date. Check the StorageBytesStatus enum for the list of possible values.",
          },
          required: false,
        },
        storageLocations: {
          name: "Storage Locations",
          description:
            "Cloud Storage bucket storage location of the snapshot (regional or multi-regional).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Cloud Storage bucket storage location of the snapshot (regional or multi-regional).",
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
            description:
              "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.disk !== undefined)
          pathParams["disk"] = String(input.event.inputConfig.disk);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.architecture !== undefined)
          body.architecture = input.event.inputConfig.architecture;
        if (input.event.inputConfig.autoCreated !== undefined)
          body.autoCreated = input.event.inputConfig.autoCreated;
        if (input.event.inputConfig.chainName !== undefined)
          body.chainName = input.event.inputConfig.chainName;
        if (input.event.inputConfig.creationSizeBytes !== undefined)
          body.creationSizeBytes = input.event.inputConfig.creationSizeBytes;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.diskSizeGb !== undefined)
          body.diskSizeGb = input.event.inputConfig.diskSizeGb;
        if (input.event.inputConfig.downloadBytes !== undefined)
          body.downloadBytes = input.event.inputConfig.downloadBytes;
        if (input.event.inputConfig.enableConfidentialCompute !== undefined)
          body.enableConfidentialCompute =
            input.event.inputConfig.enableConfidentialCompute;
        if (input.event.inputConfig.guestFlush !== undefined)
          body.guestFlush = input.event.inputConfig.guestFlush;
        if (input.event.inputConfig.guestOsFeatures !== undefined)
          body.guestOsFeatures = input.event.inputConfig.guestOsFeatures;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          body.labelFingerprint = input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.licenseCodes !== undefined)
          body.licenseCodes = input.event.inputConfig.licenseCodes;
        if (input.event.inputConfig.licenses !== undefined)
          body.licenses = input.event.inputConfig.licenses;
        if (input.event.inputConfig.locationHint !== undefined)
          body.locationHint = input.event.inputConfig.locationHint;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.satisfiesPzi !== undefined)
          body.satisfiesPzi = input.event.inputConfig.satisfiesPzi;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          body.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.snapshotEncryptionKey !== undefined)
          body.snapshotEncryptionKey =
            input.event.inputConfig.snapshotEncryptionKey;
        if (input.event.inputConfig.snapshotType !== undefined)
          body.snapshotType = input.event.inputConfig.snapshotType;
        if (input.event.inputConfig.sourceDisk !== undefined)
          body.sourceDisk = input.event.inputConfig.sourceDisk;
        if (input.event.inputConfig.sourceDiskEncryptionKey !== undefined)
          body.sourceDiskEncryptionKey =
            input.event.inputConfig.sourceDiskEncryptionKey;
        if (
          input.event.inputConfig.sourceDiskForRecoveryCheckpoint !== undefined
        )
          body.sourceDiskForRecoveryCheckpoint =
            input.event.inputConfig.sourceDiskForRecoveryCheckpoint;
        if (input.event.inputConfig.sourceDiskId !== undefined)
          body.sourceDiskId = input.event.inputConfig.sourceDiskId;
        if (input.event.inputConfig.sourceInstantSnapshot !== undefined)
          body.sourceInstantSnapshot =
            input.event.inputConfig.sourceInstantSnapshot;
        if (
          input.event.inputConfig.sourceInstantSnapshotEncryptionKey !==
          undefined
        )
          body.sourceInstantSnapshotEncryptionKey =
            input.event.inputConfig.sourceInstantSnapshotEncryptionKey;
        if (input.event.inputConfig.sourceInstantSnapshotId !== undefined)
          body.sourceInstantSnapshotId =
            input.event.inputConfig.sourceInstantSnapshotId;
        if (input.event.inputConfig.sourceSnapshotSchedulePolicy !== undefined)
          body.sourceSnapshotSchedulePolicy =
            input.event.inputConfig.sourceSnapshotSchedulePolicy;
        if (
          input.event.inputConfig.sourceSnapshotSchedulePolicyId !== undefined
        )
          body.sourceSnapshotSchedulePolicyId =
            input.event.inputConfig.sourceSnapshotSchedulePolicyId;
        if (input.event.inputConfig.status !== undefined)
          body.status = input.event.inputConfig.status;
        if (input.event.inputConfig.storageBytes !== undefined)
          body.storageBytes = input.event.inputConfig.storageBytes;
        if (input.event.inputConfig.storageBytesStatus !== undefined)
          body.storageBytesStatus = input.event.inputConfig.storageBytesStatus;
        if (input.event.inputConfig.storageLocations !== undefined)
          body.storageLocations = input.event.inputConfig.storageLocations;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/disks/{disk}/createSnapshot",
          pathParams,
          queryParams,
          body: Object.keys(body).length > 0 ? body : undefined,
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
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339 text format.",
          },
          error: {
            type: "object",
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      description:
                        "[Output Only] The error type identifier for this error.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          errorInfo: {
                            type: "object",
                            properties: {
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain is typically the registered service name of the tool or product that generates the error. Example: "pubsub.googleapis.com". If the error is generated by some common infrastructure, the error domain must be a globally unique value that identifies the infrastructure. For Google API infrastructure, the error domain is "googleapis.com".',
                              },
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.  Keys must match a regular expression of `a-z+` but should ideally be lowerCamelCase. Also, they must be limited to 64 characters in length. When identifying the current value of an exceeded limit, the units should be contained in the key, not the value.  For example, rather than `{"instanceLimit": "100/request"}`, should be returned as, `{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of instances that can be created in a single (batch) request.',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the proximate cause of the error. Error reasons are unique within a particular domain of errors. This should be at most 63 characters and match a regular expression of `A-Z+[A-Z0-9]`, which represents UPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.  Example of an error when contacting the "pubsub.googleapis.com" API when it is not enabled:      { "reason": "API_DISABLED"       "domain": "googleapis.com"       "metadata": {         "resource": "projects/123",         "service": "pubsub.googleapis.com"       }     }  This response indicates that the pubsub.googleapis.com API is not enabled.  Example of an error that is returned when attempting to create a Spanner instance in a region that is out of stock:      { "reason": "STOCKOUT"       "domain": "spanner.googleapis.com",       "metadata": {         "availableRegions": "us-central1,us-east2"       }     }',
                            additionalProperties: true,
                          },
                          help: {
                            type: "object",
                            properties: {
                              links: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                  },
                                  description: "Describes a URL link.",
                                  additionalProperties: true,
                                },
                                description:
                                  "URL(s) pointing to additional information on handling the current error.",
                              },
                            },
                            description:
                              "Provides links to documentation or for performing an out of band action.  For example, if a quota check failed with an error indicating the calling project hasn't enabled the accessed service, this can contain a URL pointing directly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                          localizedMessage: {
                            type: "object",
                            properties: {
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at https://www.rfc-editor.org/rfc/bcp/bcp47.txt. Examples are: "en-US", "fr-CH", "es-MX"',
                              },
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user which can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_ROLLOUT_STATUS",
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit. Check the RolloutStatus enum for the list of possible values.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error details. There is a set of defined message types to use for providing details.The syntax depends on the error code. For example, QuotaExceededInfo will have details when the error code is QUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error. This property is optional.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this operation.",
              },
            },
            description:
              "Output only. Errors that prevented the ResizeRequest to be fulfilled.",
            additionalProperties: true,
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always `compute#operation` for Operation resources.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          operationGroupId: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`, `update`, or `delete`, and so on.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only applicable when performing regional operations.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "[Output Only] Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] If the operation is for projects.setCommonInstanceMetadata, this field will contain information on all underlying zonal actions and their state.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server. This value is inRFC3339 text format.",
          },
          status: {
            type: "string",
            enum: ["UNDEFINED_STATUS", "DONE", "PENDING", "RUNNING"],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          targetId: {
            type: "string",
            description: "64-bit integer as string",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the disk that the snapshot was created from.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example: `user@example.com` or `alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
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
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the operation, this field will be populated.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only applicable when performing per-zone operations.",
          },
        },
        description:
          "Represents an Operation resource.  Google Compute Engine has three Operation resources:  * [Global](/compute/docs/reference/rest/v1/globalOperations) * [Regional](/compute/docs/reference/rest/v1/regionOperations) * [Zonal](/compute/docs/reference/rest/v1/zoneOperations)  You can use an operation resource to manage asynchronous API requests. For more information, readHandling API responses.  Operations can be global, regional or zonal.     - For global operations, use the `globalOperations`    resource.    - For regional operations, use the    `regionOperations` resource.    - For zonal operations, use    the `zoneOperations` resource.    For more information, read Global, Regional, and Zonal Resources.  Note that completed Operation resources have a limited retention period.",
        additionalProperties: true,
      },
    },
  },
};

export default regionDisksCreateSnapshot;
