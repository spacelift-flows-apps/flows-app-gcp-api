import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const createSnapshot: AppBlock = {
  name: "Disks - Create Snapshot",
  description: `Creates a snapshot of a specified persistent disk. For regular snapshot creation, consider using snapshots.insert instead, as that method supports more features, such as creating snapshots in a project different from the source disk project.`,
  category: "Disks",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        disk: {
          name: "Disk",
          description: "Name of the persistent disk to snapshot.",
          type: {
            type: "string",
          },
          required: true,
        },
        architecture: {
          name: "Architecture",
          description:
            "Output only. [Output Only] The architecture of the snapshot. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The architecture of the snapshot. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
          },
          required: false,
        },
        auto_created: {
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
        chain_name: {
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
        creation_size_bytes: {
          name: "Creation Size Bytes",
          description:
            "Output only. [Output Only] Size in bytes of the snapshot at creation time.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        creation_timestamp: {
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
        disk_size_gb: {
          name: "Disk Size Gb",
          description:
            "Output only. [Output Only] Size of the source disk, specified in GB.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        download_bytes: {
          name: "Download Bytes",
          description:
            "Output only. [Output Only] Number of bytes downloaded to restore a snapshot to a disk.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        enable_confidential_compute: {
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
        guest_flush: {
          name: "Guest Flush",
          description:
            "[Input Only] Whether to attempt an application consistent snapshot by informing the OS to prepare for the snapshot process.",
          type: {
            type: "string",
          },
          required: false,
        },
        guest_os_features: {
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
        label_fingerprint: {
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
        license_codes: {
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
        location_hint: {
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
              resource_manager_tags: {
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
        satisfies_pzi: {
          name: "Satisfies Pzi",
          description: "Output only. Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
          },
          required: false,
        },
        satisfies_pzs: {
          name: "Satisfies Pzs",
          description: "Output only. [Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          required: false,
        },
        self_link: {
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
        snapshot_encryption_key: {
          name: "Snapshot Encryption Key",
          description:
            "Encrypts the snapshot using acustomer-supplied encryption key.  After you encrypt a snapshot using a customer-supplied key, you must provide the same key if you use the snapshot later. For example, you must provide the encryption key when you create a disk from the encrypted snapshot in a future request.  Customer-supplied encryption keys do not protect access to metadata of the snapshot.  If you do not provide an encryption key when creating the snapshot, then the snapshot will be encrypted using an automatically generated key and you do not need to provide a key to use the snapshot later.",
          type: {
            type: "object",
            properties: {
              kms_key_name: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kms_key_service_account: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              raw_key: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsa_encrypted_key: {
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
        snapshot_type: {
          name: "Snapshot Type",
          description:
            "Indicates the type of the snapshot. Check the SnapshotType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Indicates the type of the snapshot. Check the SnapshotType enum for the list of possible values.",
          },
          required: false,
        },
        source_disk: {
          name: "Source Disk",
          description: "The source disk used to create this snapshot.",
          type: {
            type: "string",
            description: "The source disk used to create this snapshot.",
          },
          required: false,
        },
        source_disk_encryption_key: {
          name: "Source Disk Encryption Key",
          description:
            "The customer-supplied encryption key of the source disk. Required if the source disk is protected by a customer-supplied encryption key.",
          type: {
            type: "object",
            properties: {
              kms_key_name: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kms_key_service_account: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              raw_key: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsa_encrypted_key: {
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
        source_disk_for_recovery_checkpoint: {
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
        source_disk_id: {
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
        source_instant_snapshot: {
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
        source_instant_snapshot_encryption_key: {
          name: "Source Instant Snapshot Encryption Key",
          description:
            "Customer provided encryption key when creating Snapshot from Instant Snapshot.",
          type: {
            type: "object",
            properties: {
              kms_key_name: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kms_key_service_account: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              raw_key: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsa_encrypted_key: {
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
        source_instant_snapshot_id: {
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
        source_snapshot_schedule_policy: {
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
        source_snapshot_schedule_policy_id: {
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
            description:
              "Output only. [Output Only] The status of the snapshot. This can beCREATING, DELETING, FAILED,READY, or UPLOADING. Check the Status enum for the list of possible values.",
          },
          required: false,
        },
        storage_bytes: {
          name: "Storage Bytes",
          description:
            "Output only. [Output Only] A size of the storage used by the snapshot. As snapshots share storage, this number is expected to change with snapshot creation/deletion.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        storage_bytes_status: {
          name: "Storage Bytes Status",
          description:
            "Output only. [Output Only] An indicator whether storageBytes is in a stable state or it is being adjusted as a result of shared storage reallocation. This status can either be UPDATING, meaning the size of the snapshot is being updated, or UP_TO_DATE, meaning the size of the snapshot is up-to-date. Check the StorageBytesStatus enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] An indicator whether storageBytes is in a stable state or it is being adjusted as a result of shared storage reallocation. This status can either be UPDATING, meaning the size of the snapshot is being updated, or UP_TO_DATE, meaning the size of the snapshot is up-to-date. Check the StorageBytesStatus enum for the list of possible values.",
          },
          required: false,
        },
        storage_locations: {
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
        request_id: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.disk !== undefined)
          pathParams["disk"] = String(input.event.inputConfig.disk);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.guest_flush !== undefined)
          queryParams["guestFlush"] = String(
            input.event.inputConfig.guest_flush,
          );
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.architecture !== undefined)
          body.architecture = input.event.inputConfig.architecture;
        if (input.event.inputConfig.auto_created !== undefined)
          body.auto_created = input.event.inputConfig.auto_created;
        if (input.event.inputConfig.chain_name !== undefined)
          body.chain_name = input.event.inputConfig.chain_name;
        if (input.event.inputConfig.creation_size_bytes !== undefined)
          body.creation_size_bytes =
            input.event.inputConfig.creation_size_bytes;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.disk_size_gb !== undefined)
          body.disk_size_gb = input.event.inputConfig.disk_size_gb;
        if (input.event.inputConfig.download_bytes !== undefined)
          body.download_bytes = input.event.inputConfig.download_bytes;
        if (input.event.inputConfig.enable_confidential_compute !== undefined)
          body.enable_confidential_compute =
            input.event.inputConfig.enable_confidential_compute;
        if (input.event.inputConfig.guest_flush !== undefined)
          body.guest_flush = input.event.inputConfig.guest_flush;
        if (input.event.inputConfig.guest_os_features !== undefined)
          body.guest_os_features = input.event.inputConfig.guest_os_features;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.label_fingerprint !== undefined)
          body.label_fingerprint = input.event.inputConfig.label_fingerprint;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.license_codes !== undefined)
          body.license_codes = input.event.inputConfig.license_codes;
        if (input.event.inputConfig.licenses !== undefined)
          body.licenses = input.event.inputConfig.licenses;
        if (input.event.inputConfig.location_hint !== undefined)
          body.location_hint = input.event.inputConfig.location_hint;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.satisfies_pzi !== undefined)
          body.satisfies_pzi = input.event.inputConfig.satisfies_pzi;
        if (input.event.inputConfig.satisfies_pzs !== undefined)
          body.satisfies_pzs = input.event.inputConfig.satisfies_pzs;
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;
        if (input.event.inputConfig.snapshot_encryption_key !== undefined)
          body.snapshot_encryption_key =
            input.event.inputConfig.snapshot_encryption_key;
        if (input.event.inputConfig.snapshot_type !== undefined)
          body.snapshot_type = input.event.inputConfig.snapshot_type;
        if (input.event.inputConfig.source_disk !== undefined)
          body.source_disk = input.event.inputConfig.source_disk;
        if (input.event.inputConfig.source_disk_encryption_key !== undefined)
          body.source_disk_encryption_key =
            input.event.inputConfig.source_disk_encryption_key;
        if (
          input.event.inputConfig.source_disk_for_recovery_checkpoint !==
          undefined
        )
          body.source_disk_for_recovery_checkpoint =
            input.event.inputConfig.source_disk_for_recovery_checkpoint;
        if (input.event.inputConfig.source_disk_id !== undefined)
          body.source_disk_id = input.event.inputConfig.source_disk_id;
        if (input.event.inputConfig.source_instant_snapshot !== undefined)
          body.source_instant_snapshot =
            input.event.inputConfig.source_instant_snapshot;
        if (
          input.event.inputConfig.source_instant_snapshot_encryption_key !==
          undefined
        )
          body.source_instant_snapshot_encryption_key =
            input.event.inputConfig.source_instant_snapshot_encryption_key;
        if (input.event.inputConfig.source_instant_snapshot_id !== undefined)
          body.source_instant_snapshot_id =
            input.event.inputConfig.source_instant_snapshot_id;
        if (
          input.event.inputConfig.source_snapshot_schedule_policy !== undefined
        )
          body.source_snapshot_schedule_policy =
            input.event.inputConfig.source_snapshot_schedule_policy;
        if (
          input.event.inputConfig.source_snapshot_schedule_policy_id !==
          undefined
        )
          body.source_snapshot_schedule_policy_id =
            input.event.inputConfig.source_snapshot_schedule_policy_id;
        if (input.event.inputConfig.status !== undefined)
          body.status = input.event.inputConfig.status;
        if (input.event.inputConfig.storage_bytes !== undefined)
          body.storage_bytes = input.event.inputConfig.storage_bytes;
        if (input.event.inputConfig.storage_bytes_status !== undefined)
          body.storage_bytes_status =
            input.event.inputConfig.storage_bytes_status;
        if (input.event.inputConfig.storage_locations !== undefined)
          body.storage_locations = input.event.inputConfig.storage_locations;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/disks/{disk}/createSnapshot",
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
          client_operation_id: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creation_timestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          end_time: {
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
                    error_details: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          error_info: {
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
                          localized_message: {
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
                          quota_info: {
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
                              future_limit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limit_name: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metric_name: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rollout_status: {
                                type: "string",
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
          http_error_message: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          http_error_status_code: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insert_time: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instances_bulk_insert_operation_metadata: {
            type: "object",
            properties: {
              per_location_status: {
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
          operation_group_id: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operation_type: {
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
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          set_common_instance_metadata_operation_metadata: {
            type: "object",
            properties: {
              client_operation_id: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              per_location_operations: {
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
          start_time: {
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
          status_message: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          target_id: {
            type: "string",
            description: "64-bit integer as string",
          },
          target_link: {
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

export default createSnapshot;
